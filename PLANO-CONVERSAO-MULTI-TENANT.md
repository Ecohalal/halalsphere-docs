---
layout: default
title: Plano de Conversao Multi-Tenant
---

# Plano de Conversão Multi-Tenant — HalalSphere

> **Status**: RASCUNHO — Em análise conjunta
> **Data**: 2026-02-02
> **Escopo**: Análise cruzada de 6 repositórios (halalsphere-backend, halalsphere-frontend, halalsphere-docs, admin-geral-auth-integracao, admin-geral-api-auth-trace, admin-geral-web)

## Resumo Executivo

Converter o HalalSphere de single-tenant para multi-tenant integrado ao ecossistema admin-geral. Cada **certificadora** será um tenant (workspace). Padrão: **row-level isolation** em PostgreSQL compartilhado, **SSO via admin-geral-api-auth-trace**, frontend com **workspace selector** (Zustand).

### Decisões Já Tomadas

- **Isolamento**: Row-level isolation (mesmo padrão admin-geral)
- **Autenticação**: Integrar com admin-geral (SSO entre produtos)
- **Agente BMAD**: Analyst (Mary) será usado para validar/complementar
- **Escopo**: Apenas planejamento nesta fase

---

## 1. Análise do Estado Atual

### 1.1 HalalSphere Backend

- **Stack**: NestJS + Prisma ORM + PostgreSQL
- **Módulos**: 35+ domain modules
- **Auth atual**: JWT (15min) + Refresh tokens (7 dias), HttpOnly cookies, RS256
- **JWT payload atual**: `{ sub, email, role, companyId, groupId, isGroupAdmin, isCompanyAdmin }`
- **Guards**: `JwtAuthGuard` (global), `RolesGuard`, `GroupAdminGuard`, `CompanyAdminGuard`
- **Database**: 40+ tabelas, 22 enums, hierarquia `company_groups → companies → plants`
- **Roles**: 12 tipos (UserRole enum)

### 1.2 HalalSphere Frontend

- **Stack**: React + TypeScript, PWA
- **API layer**: Axios com Bearer token interceptor e auto-refresh
- **Deploy**: S3 + CloudFront (branch `release`)

### 1.3 Admin-Geral (Padrão Multi-Tenant de Referência)

#### admin-geral-api-auth-trace (Auth principal)
- **Stack**: NestJS 11, Prisma 6, PostgreSQL, Redis
- **Auth**: JWT criptografado (JWE com A256GCM via JOSE library)
- **Sessões**: Redis com chaves compostas `userId:sessionId`, TTL 5 dias
- **Multi-session**: Suporta múltiplos logins simultâneos
- **JWT claims**: `userId`, `userEmail`, `fullname`, `avatarUrl`, `userTypeId`, `userType`, `isClonedUser`
- **Guards**: `JwtAuthGuard` valida token + sessão no Redis
- **Exceptions**: `ForbiddenWorkspaceException`, `ForbiddenTeamException`, `ForbiddenUserException`

#### admin-geral-auth-integracao (Integração)
- Geração de JWT para APIs de integração externa
- JWE com JOSE library (A256GCM), secret via SHA-256 de CRYPTOGRAPHY_KEY

#### admin-geral-web (Frontend admin)
- **Stack**: React 19, Vite, Zustand, TanStack Router, Axios
- **State**: `useUserStore` com `selectedWorkspaceId` persistido em localStorage
- **UserInfo**: Inclui `workspaces[]` com `teams[]` e `companies[]` hierárquicos
- **Workspace switching**: `setSelectedWorkspace(workspaceId)`
- **CRUD workspaces**: `GET/POST/PUT/DELETE /workspaces/*`

#### Modelo de dados multi-tenant (admin-geral)
```
tb_cliente (Client)
  └── adm_tb_workspace_produto (Workspace)
        └── adm_tb_time_workspace (Team) [hierárquico, suporta parent_id]
              └── adm_cx_empresa_time (Company↔Team junction)
              └── adm_cx_time_membros (User↔Team junction)
```

- **Isolamento**: Row-level via foreign keys
- **Acesso ao tenant**: Implícito via membership em teams (não há tabela direta user↔workspace)
- **IDs**: Snowflake IDs para unicidade global
- **Soft deletes**: Via `deleted_at`
- **Audit fields**: `created_at`, `updated_at`, `owner_id`, `author_id`

---

## 2. Mapeamento de Conceitos

| Admin-Geral | HalalSphere (equivalência) | Tabela admin-geral |
|---|---|---|
| Client | Certificadora (empresa mãe) | `tb_cliente` |
| Workspace | Instância/operação da certificadora | `adm_tb_workspace_produto` |
| Team | CompanyGroup (já existe) | `adm_tb_time_workspace` |
| Company | Company (já existe) | `tb_empresa` |
| User Member | User (já existe) | `adm_cx_time_membros` |

**Hierarquia resultante**: `Client > Workspace > CompanyGroup > Company > User`

---

## 3. Fases de Implementação

### FASE 1: Fundação (Schema + Auth + Middleware)

#### 3.1 Novas Tabelas no Prisma Schema

**Arquivo**: `halalsphere-backend/prisma/schema.prisma`

- **`tenant_clients`** — entidade top-level do tenant
  - `id`, `admin_geral_client_id`, `name`, `slug` (UNIQUE), `is_active`, `settings` (JSONB), timestamps
- **`tenant_workspaces`** — workspace dentro do tenant
  - `id`, `tenant_id` FK, `admin_geral_workspace_id`, `name`, `is_active`, `settings` (JSONB), timestamps
- **`tenant_user_memberships`** — vínculo user↔workspace com role
  - `id`, `user_id` FK, `workspace_id` FK, `role` (UserRole), `is_active`, UNIQUE(user_id, workspace_id)

#### 3.2 FK `workspace_id` em Tabelas Existentes (18+ tabelas)

**Prioridade ALTA**: `companies`, `company_groups`, `requests`, `processes`, `certifications`, `users` (default_workspace_id)

**Prioridade MÉDIA**: `contracts`, `audits`, `certificates`, `documents`, `proposals`, `notifications`, `audit_trail`, `plants`

**Prioridade BAIXA**: `shared_suppliers`, `corporate_documents`, `user_invites`, `access_requests`

**Tabelas globais (sem workspace_id)**: `industrial_groups/categories/subcategories`, `knowledge_base`, `cnpj_lookup_configs`

#### 3.3 Estratégia de Migração de Dados

1. Criar novas tabelas (non-breaking)
2. Adicionar `workspace_id` **nullable** em todas as tabelas
3. Criar tenant default ("FAMBRAS") e workspace default
4. Popular `workspace_id` em todos os registros existentes
5. Tornar `workspace_id` NOT NULL
6. Adicionar índices compostos `(workspace_id, ...)`

#### 3.4 Integração Auth com Admin-Geral

**Abordagem**: Auth federado com período de transição dual

**Novos arquivos**:
- `src/auth/strategies/admin-geral-jwt.strategy.ts` — Passport strategy que valida JWTs do admin-geral (JWE com A256GCM via JOSE)
- `src/common/middleware/tenant.middleware.ts` — Resolve workspace do JWT + header `X-Workspace-Id`
- `src/common/decorators/current-workspace.decorator.ts` — `@CurrentWorkspace()` param decorator

**Arquivos modificados**:
- `src/auth/guards/jwt-auth.guard.ts` — Aceitar tokens admin-geral E legacy
- `src/auth/auth.module.ts` — Registrar nova strategy + Redis module
- `src/auth/auth.service.ts` — Sync de usuário do admin-geral no primeiro login

**Fluxo de request**:
```
Request → JwtAuthGuard (valida JWT admin-geral ou legacy)
        → TenantMiddleware (resolve workspace via header X-Workspace-Id)
        → Controller (recebe tenantContext: { tenantId, workspaceId, userId, role })
        → Service (usa PrismaClient scoped por workspace)
```

---

### FASE 2: Adaptação Backend (35+ Services)

#### 3.5 Prisma Extension para Auto-Scoping

**Novo arquivo**: `src/prisma/prisma-tenant.extension.ts`
- Wraps PrismaClient com extensão que injeta `workspace_id` automaticamente em queries
- `findMany`, `findFirst`, `create`, `update`, `delete` recebem `where: { workspaceId }` implícito

**Arquivo modificado**: `src/prisma/prisma.service.ts`
- Método `forWorkspace(workspaceId)` retorna PrismaClient scoped

#### 3.6 Serviços com Mudanças Manuais Necessárias

| Serviço | Motivo |
|---|---|
| `ProcessService` | Geração de protocolo deve ser workspace-scoped |
| `CertificationService` | Numeração de certificados (sequência por workspace ou global) |
| `ProposalService` | Tabelas de preço podem ser per-workspace |
| `AuditService` | Alocação de auditores cross-workspace |
| `ReportsService` | Queries agregadas precisam scoping |
| `AdminService` | Views admin podem precisar acesso cross-workspace |
| `AiService` | Knowledge base compartilhada vs per-workspace |

Os demais ~28 serviços são cobertos pelo Prisma auto-scoping.

#### 3.7 Endpoints API

**Abordagem**: Header `X-Workspace-Id` (implícito via middleware). Sem mudança de URLs.
- Menos disruptivo que prefixo `/api/w/:workspaceId/`
- Compatível com padrão do admin-geral-web (`selectedWorkspaceId`)

#### 3.8 Permissões Workspace-Aware

**Arquivos modificados**:
- `src/auth/guards/roles.guard.ts` — Role agora vem de `tenant_user_memberships`, não da tabela user
- `src/auth/guards/group-admin.guard.ts` — Scoped ao workspace
- `src/auth/guards/company-admin.guard.ts` — Scoped ao workspace

---

### FASE 3: Adaptação Frontend

#### 3.9 Workspace Store (Zustand)

**Novo arquivo**: `src/store/workspace.store.ts` (seguindo padrão admin-geral-web)
```typescript
interface WorkspaceState {
  selectedWorkspaceId: string | null
  workspaces: Workspace[]
  setSelectedWorkspace: (id: string) => void
}
// Persistido em localStorage via zustand/persist
```

#### 3.10 API Layer — Header Automático

**Arquivo modificado**: `src/lib/api.ts`
- Interceptor Axios injeta `X-Workspace-Id` em todas as requests automaticamente
- Serviços individuais não precisam de mudança

#### 3.11 Auth Flow SSO

**Arquivo modificado**: `src/services/auth.service.ts`
- Redirect para admin-geral login se não autenticado
- Recebe JWT do admin-geral após login
- Busca perfil + lista de workspaces

**Novo componente**: `src/components/WorkspaceSelector.tsx`
- Dropdown no header com workspace atual
- Lista workspaces acessíveis
- Auto-select se apenas 1 workspace

#### 3.12 Branding por Tenant

- Config armazenada em `tenant_clients.settings` (JSONB)
- Endpoint público `GET /api/tenant/branding`
- CSS custom properties atualizadas por workspace

---

### FASE 4: Infraestrutura

- **Redis** (ElastiCache): novo — validação de sessão admin-geral
- **RDS PostgreSQL**: novas tabelas + índices
- **S3**: paths com prefixo `/{workspaceId}/`
- **Secrets Manager**: secrets do admin-geral
- **CI/CD**: step de migration + seed + testes de isolamento

---

### FASE 5: Testes e Validação

| Teste | Prioridade |
|---|---|
| Dados do Workspace A invisíveis do Workspace B | CRÍTICA |
| User sem membership não acessa API do workspace | CRÍTICA |
| JOINs cross-workspace retornam vazio | CRÍTICA |
| Role em workspace A não dá poder em workspace B | ALTA |
| Audit trail scoped por workspace | ALTA |
| Verificação de certificado (QR público) funciona cross-workspace | MÉDIA |

---

## 4. Decisões Pendentes (Stakeholder Input)

| # | Decisão | Recomendação |
|---|---|---|
| 1 | Tabela de preços: global ou per-workspace? | Per-workspace |
| 2 | Auditores: pool compartilhado ou per-workspace? | Pool compartilhado com assignment por workspace |
| 3 | Numeração de certificados: global ou per-workspace? | Global (certificados são público-facing) |
| 4 | S3: bucket único com prefix ou bucket por tenant? | Bucket único com `/{workspaceId}/` |
| 5 | Admin-geral DB: acesso direto ou via API? | Via API (menor acoplamento) |
| 6 | Knowledge base (AI/RAG): compartilhada ou per-workspace? | Per-workspace com base global |
| 7 | Timing de migração: big-bang ou gradual? | Gradual com feature flag |
| 8 | e_signature_configs / storage_configs: per-workspace? | Per-workspace |

---

## 5. Agentes BMAD Recomendados por Fase

| Fase | Agente | Propósito |
|---|---|---|
| Fase 1 | **Analyst (Mary)** | Investigar formato exato JWT admin-geral, Redis session format, API de sync de user, template de permissões |
| Fase 1 | **Architect (Winston)** | Revisar design do Prisma extension, validar strategy de migração, design do auth bridge |
| Fase 2 | **Dev (James)** | Implementar serviço por serviço, Prisma tenant extension |
| Fase 3 | **UX Expert (Sally)** | Design do workspace selector, sistema de branding, fluxo SSO |
| Fase 5 | **QA (Quinn)** | Suite de testes de isolamento cross-tenant |
| Geral | **PM (John)** | Sprint planning, tracking de dependências |

### Itens para Investigação pela Analyst (Mary)

1. Formato exato do JWT admin-geral (JWE ou JWS? Claims?)
2. Estrutura de keys no Redis (`userId:sessionId`)
3. API de lookup de usuário no admin-geral
4. API de criação de workspace no admin-geral
5. Navegação cross-produto (URL pattern)
6. Mapeamento `default_templates_permissoes` → 12 roles do HalalSphere
7. Clientes existentes no admin-geral que devem ser vinculados

---

## 6. Riscos

| Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|
| Data leak entre tenants (WHERE faltando) | MÉDIA | CRÍTICO | Prisma auto-scoping + testes de isolamento |
| Degradação de performance | BAIXA | MÉDIA | Índices compostos + benchmark antes/depois |
| Admin-geral auth indisponível | BAIXA | ALTA | Fallback para auth legacy + circuit breaker |
| Migração corrompe dados de produção | BAIXA | CRÍTICO | Backup completo + rollout staged + rollback script |

---

## 7. Impacto em Arquivos

**Novos (~15 arquivos)**:
- Backend: tenant middleware, decorators, Prisma extension, admin-geral JWT strategy, 5+ migrations
- Frontend: workspace store, workspace selector component

**Modificação major (~10 arquivos)**:
- `prisma/schema.prisma` (3 novos models + 18+ models modificados)
- `src/auth/auth.service.ts`, `auth.module.ts`, `jwt-auth.guard.ts`, `roles.guard.ts`
- `src/prisma/prisma.service.ts`
- Frontend: `src/lib/api.ts`, `src/services/auth.service.ts`

**Modificação minor (~35 arquivos)**:
- Todos os 35+ backend services (cobertos pelo auto-scoping na maioria)

---

## 8. Verificação End-to-End

1. Rodar migrations: `npx prisma migrate dev`
2. Seed do tenant default: migration script SQL
3. Rodar testes existentes (devem passar — tudo fica no workspace default)
4. Criar segundo tenant via API
5. Criar dados no segundo tenant
6. Verificar que queries do tenant 1 não retornam dados do tenant 2
7. Testar login SSO via admin-geral → redirect → HalalSphere
8. Testar workspace switching no frontend
9. Verificar audit trail por workspace
10. Benchmark de performance antes/depois
