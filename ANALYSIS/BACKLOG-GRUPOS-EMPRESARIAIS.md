# Backlog de Implementação - Grupos Empresariais e Onboarding

**Criado:** 2026-01-21
**Baseado em:** [ANALISE-GRUPOS-EMPRESARIAIS.md](./ANALISE-GRUPOS-EMPRESARIAIS.md)
**Status:** ✅ Fases 1-5 Concluídas (143/200 - 71%) | Fases 6-8 Pendentes
**Prioridade:** Implementar ANTES da Fase 6 (Testes) do backlog de migração

---

## Legenda

- `[ ]` Pendente
- `[~]` Em andamento
- `[x]` Concluído
- `[-]` Cancelado/Bloqueado

**Prioridade:** 🔴 Crítica | 🟠 Alta | 🟡 Média | 🟢 Baixa

---

## Visão Geral das Fases

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SEQUÊNCIA DE IMPLEMENTAÇÃO                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Fase 1: Schema e Migrations ──► Fase 2: Migração de Dados             │
│                                                                         │
│  Fase 3: Backend - Grupos ──────► Fase 4: Backend - Onboarding         │
│                                                                         │
│  Fase 5: Frontend - Estrutura ──► Fase 6: Frontend - Onboarding        │
│                                                                         │
│  Fase 7: Integração ReceitaWS ──► Fase 8: Testes e Validação           │
│                                                                         │
│  ════════════════════════════════════════════════════════════════════  │
│                                                                         │
│  Após conclusão: Retomar Fase 6-7 do BACKLOG-MIGRACAO-CERTIFICACOES    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Fase 1: Schema e Migrations (CONCLUÍDA)

> **Concluída em:** 2026-01-21
> **Commit:** `feat(schema): add company groups, plants and onboarding tables`
> **Branch:** `feature/company-groups`

### 1.1 Novas Tabelas

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-001 | Criar enum `PlantCodeType` (sif, sie, sim, internal) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-002 | Criar enum `SharedSupplierStatus` (pending, approved, rejected, suspended) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-003 | Criar enum `CorporateDocumentCategory` (bpf, appcc, procedimento, manual, politica, outro) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-004 | Criar tabela `company_groups` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-005 | Criar tabela `plants` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-006 | Criar tabela `shared_suppliers` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-007 | Criar tabela `corporate_documents` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-008 | Criar tabela `user_invites` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-009 | Criar tabela `access_requests` | 🟠 | - | [x] ✓ 2026-01-21 |

### 1.2 Alterações em Tabelas Existentes

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-010 | Adicionar `group_id` em `companies` (FK para company_groups) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-011 | Adicionar `is_headquarters` em `companies` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-012 | Adicionar `pending_validation`, `validated_at`, `validated_by`, `validation_notes` em `companies` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-013 | Adicionar `created_by` em `companies` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-014 | Adicionar `is_group_admin` em `users` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-015 | Adicionar `is_company_admin`, `is_temporary_admin` em `users` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-016 | Adicionar `admin_assigned_at`, `admin_assigned_by` em `users` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-017 | Adicionar `pending_company_access`, `access_requested_at`, `access_request_message` em `users` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-018 | Adicionar `plant_id` em `certifications` (FK para plants) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-019 | Criar índice único para `document` (CNPJ) em `companies` | 🔴 | - | [x] ✓ 2026-01-21 (já existia) |

### 1.3 Índices e Constraints

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-020 | Criar índice em `companies.group_id` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-021 | Criar índice em `plants.company_id` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-022 | Criar índice em `certifications.plant_id` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-023 | Criar índice em `users.company_id` | 🟠 | - | [x] ✓ 2026-01-21 (já existia) |
| G-024 | Validar e testar migrations em ambiente de desenvolvimento | 🔴 | - | [x] ✓ 2026-01-21 |

### Arquivos da Fase 1

**Schema Prisma:**
- `prisma/schema.prisma` - Adicionados enums, tabelas e campos

**Migration:**
- `prisma/migrations/20260121000001_company_groups_and_onboarding/migration.sql`

---

## ✅ Fase 2: Migração de Dados (CONCLUÍDA)

> **Concluída em:** 2026-01-21
> **Script:** `prisma/migrations/data/migrate-company-groups.ts`
> **Comando:** `npx ts-node prisma/migrations/data/migrate-company-groups.ts`

### 2.1 Criação de Grupos para Empresas Existentes

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-025 | Script: criar `company_group` para cada `company` existente (1:1) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-026 | Script: popular `group_id` em todas as `companies` existentes | 🔴 | - | [x] ✓ 2026-01-21 |
| G-027 | Script: definir `is_headquarters = true` para empresa única no grupo | 🟠 | - | [x] ✓ 2026-01-21 |
| G-028 | Script: definir `pending_validation = false` para empresas existentes | 🟠 | - | [x] ✓ 2026-01-21 |

### 2.2 Migração de Facilities para Plants

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-029 | Analisar dados existentes em `scope_facilities` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-030 | Script: criar `plant` para cada `scope_facility` único | 🔴 | - | [x] ✓ 2026-01-21 |
| G-031 | Script: vincular `company_id` nas plants criadas | 🔴 | - | [x] ✓ 2026-01-21 |
| G-032 | Script: inferir `code_type` (SIF/SIE/SIM/internal) baseado no formato do código | 🟠 | - | [x] ✓ 2026-01-21 |
| G-033 | Script: popular `plant_id` em `certifications` existentes | 🔴 | - | [x] ✓ 2026-01-21 |

### 2.3 Migração de Usuários

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-034 | Script: definir primeiro usuário de cada empresa como `is_company_admin = true` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-035 | Script: definir `is_temporary_admin = true` se não há admin designado | 🟠 | - | [x] ✓ 2026-01-21 |
| G-036 | Script: definir `is_group_admin = true` para admin de empresa que é única no grupo | 🟠 | - | [x] ✓ 2026-01-21 |

### 2.4 Validação

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-037 | Validar integridade referencial após migração | 🔴 | - | [x] ✓ 2026-01-21 |
| G-038 | Validar que todas as companies têm group_id | 🔴 | - | [x] ✓ 2026-01-21 |
| G-039 | Validar que todas as certifications têm plant_id | 🔴 | - | [x] ✓ 2026-01-21 |
| G-040 | Gerar relatório de migração | 🟠 | - | [x] ✓ 2026-01-21 |

### Resultado da Migração (2026-01-21)

```
📊 Resultados:
   - Empresas processadas: 2
   - Grupos criados: 2
   - Plants criadas: 0 (nenhum scope_facility existente)
   - Usuários atualizados: 1

⚠️  Avisos:
   - 1 empresa sem usuário vinculado (dados de teste)

✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!
```

---

## ✅ Fase 3: Backend - Módulos de Grupos (CONCLUÍDA)

> **Concluída em:** 2026-01-21
> **Branch:** `feature/company-groups`
> **Commits:** `feat(backend): add CompanyGroup and Plant modules`, `feat(backend): add SharedSupplier and CorporateDocument modules`

### 3.1 CompanyGroupModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-041 | Criar Entity `CompanyGroup` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-042 | Criar DTOs: `CreateCompanyGroupDto`, `UpdateCompanyGroupDto` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-043 | Criar `CompanyGroupService` com CRUD | 🔴 | - | [x] ✓ 2026-01-21 |
| G-044 | Criar `CompanyGroupController` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-045 | Endpoint: `GET /company-groups` - listar grupos (admin FAMBRAS) | 🟠 | - | [x] ✓ 2026-01-21 |
| G-046 | Endpoint: `GET /company-groups/:id` - detalhes do grupo | 🔴 | - | [x] ✓ 2026-01-21 |
| G-047 | Endpoint: `GET /company-groups/:id/companies` - empresas do grupo | 🔴 | - | [x] ✓ 2026-01-21 |
| G-048 | Endpoint: `POST /company-groups/:id/companies` - adicionar empresa ao grupo | 🟠 | - | [x] ✓ 2026-01-21 |
| G-049 | Endpoint: `DELETE /company-groups/:id/companies/:companyId` - remover empresa | 🟡 | - | [x] ✓ 2026-01-21 |

### 3.2 PlantModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-050 | Criar Entity `Plant` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-051 | Criar DTOs: `CreatePlantDto`, `UpdatePlantDto`, `PlantFilterDto` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-052 | Criar `PlantService` com CRUD | 🔴 | - | [x] ✓ 2026-01-21 |
| G-053 | Criar `PlantController` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-054 | Endpoint: `GET /plants` - listar plantas da empresa do usuário | 🔴 | - | [x] ✓ 2026-01-21 |
| G-055 | Endpoint: `GET /plants/:id` - detalhes da planta | 🔴 | - | [x] ✓ 2026-01-21 |
| G-056 | Endpoint: `POST /plants` - criar nova planta | 🔴 | - | [x] ✓ 2026-01-21 |
| G-057 | Endpoint: `PUT /plants/:id` - atualizar planta | 🟠 | - | [x] ✓ 2026-01-21 |
| G-058 | Endpoint: `GET /plants/:id/certifications` - certificações da planta | 🔴 | - | [x] ✓ 2026-01-21 |

### 3.3 SharedSupplierModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-059 | Criar Entity `SharedSupplier` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-060 | Criar DTOs | 🟠 | - | [x] ✓ 2026-01-21 |
| G-061 | Criar `SharedSupplierService` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-062 | Criar `SharedSupplierController` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-063 | Endpoint: `GET /shared-suppliers/group/:groupId` - fornecedores do grupo | 🟠 | - | [x] ✓ 2026-01-21 |
| G-064 | Endpoint: `POST /shared-suppliers` - adicionar fornecedor | 🟠 | - | [x] ✓ 2026-01-21 |
| G-065 | Endpoint: `PATCH /shared-suppliers/:id/approve` - aprovar/rejeitar | 🟠 | - | [x] ✓ 2026-01-21 |

### 3.4 CorporateDocumentModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-066 | Criar Entity `CorporateDocument` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-067 | Criar DTOs | 🟠 | - | [x] ✓ 2026-01-21 |
| G-068 | Criar `CorporateDocumentService` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-069 | Criar `CorporateDocumentController` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-070 | Endpoint: `GET /corporate-documents/group/:groupId` - documentos do grupo | 🟠 | - | [x] ✓ 2026-01-21 |
| G-071 | Endpoint: `POST /corporate-documents` - upload documento | 🟠 | - | [x] ✓ 2026-01-21 |
| G-072 | Endpoint: `DELETE /corporate-documents/:id` - remover | 🟡 | - | [x] ✓ 2026-01-21 |

### 3.5 Atualização de CompanyModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-073 | Atualizar Entity `Company` com novos campos | 🔴 | - | [x] ✓ 2026-01-21 (Fase 1) |
| G-074 | Atualizar DTOs com campos de grupo e validação | 🔴 | - | [x] ✓ 2026-01-21 |
| G-075 | Implementar validação de CNPJ único | 🔴 | - | [x] ✓ 2026-01-21 (já existia) |
| G-076 | Endpoint: `GET /companies/cnpj/:cnpj` - verificar se CNPJ existe | 🔴 | - | [x] ✓ 2026-01-21 (já existia) |
| G-077 | Atualizar `findAll` para filtrar por grupo (se admin grupo) | 🟠 | - | [x] ✓ 2026-01-21 |

### 3.6 Atualização de CertificationModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-078 | Atualizar Entity `Certification` com `plantId` | 🔴 | - | [x] ✓ 2026-01-21 (Fase 1) |
| G-079 | Atualizar DTOs para incluir `plantId` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-080 | Atualizar Service para validar planta pertence à empresa | 🔴 | - | [x] ✓ 2026-01-21 |
| G-081 | Atualizar queries para incluir dados da planta | 🟠 | - | [x] ✓ 2026-01-21 |

---

## Fase 4: Backend - Onboarding e Permissões

### 4.1 Atualização de UserModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-082 | Atualizar Entity `User` com novos campos de permissão | 🔴 | - | [x] ✓ 2026-01-21 |
| G-083 | Atualizar DTOs | 🔴 | - | [x] ✓ 2026-01-21 |
| G-084 | Implementar lógica de admin temporário | 🔴 | - | [x] ✓ 2026-01-21 |
| G-085 | Implementar lógica de admin de grupo | 🔴 | - | [x] ✓ 2026-01-21 |
| G-086 | Endpoint: `POST /users/:id/assign-admin` - FAMBRAS designa admin | 🟠 | - | [x] ✓ 2026-01-21 |

### 4.2 UserInviteModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-087 | Criar Entity `UserInvite` | 🔴 | - | [x] ✓ 2026-01-21 (Fase 1) |
| G-088 | Criar DTOs: `CreateInviteDto` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-089 | Criar `UserInviteService` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-090 | Criar `UserInviteController` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-091 | Endpoint: `POST /invites` - criar convite | 🔴 | - | [x] ✓ 2026-01-21 |
| G-092 | Endpoint: `GET /invites/validate/:token` - validar token | 🔴 | - | [x] ✓ 2026-01-21 |
| G-093 | Endpoint: `POST /invites/:token/accept` - aceitar convite | 🔴 | - | [x] ✓ 2026-01-21 |
| G-094 | Endpoint: `GET /invites` - listar convites pendentes (admin) | 🟠 | - | [x] ✓ 2026-01-21 |
| G-095 | Endpoint: `DELETE /invites/:id` - cancelar convite | 🟡 | - | [x] ✓ 2026-01-21 |
| G-096 | Serviço de envio de email de convite | 🔴 | - | [x] ✓ 2026-01-21 (estrutura) |

### 4.3 AccessRequestModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-097 | Criar Entity `AccessRequest` | 🟠 | - | [x] ✓ 2026-01-21 (Fase 1) |
| G-098 | Criar DTOs | 🟠 | - | [x] ✓ 2026-01-21 |
| G-099 | Criar `AccessRequestService` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-100 | Criar `AccessRequestController` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-101 | Endpoint: `POST /access-requests` - solicitar acesso | 🟠 | - | [x] ✓ 2026-01-21 |
| G-102 | Endpoint: `GET /access-requests` - listar solicitações (admin) | 🟠 | - | [x] ✓ 2026-01-21 |
| G-103 | Endpoint: `POST /access-requests/:id/approve` - aprovar | 🟠 | - | [x] ✓ 2026-01-21 |
| G-104 | Endpoint: `POST /access-requests/:id/reject` - rejeitar | 🟠 | - | [x] ✓ 2026-01-21 |
| G-105 | Notificação por email ao admin sobre nova solicitação | 🟡 | - | [x] ✓ 2026-01-21 (estrutura) |

### 4.4 Atualização de AuthModule

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-106 | Atualizar registro para NÃO exigir empresa (pendente vinculação) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-107 | Endpoint: `GET /auth/me/company-status` - verificar status de vinculação | 🔴 | - | [x] ✓ 2026-01-21 |
| G-108 | Atualizar JWT payload com `isGroupAdmin`, `isCompanyAdmin` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-109 | Criar Guard `GroupAdminGuard` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-110 | Criar Guard `CompanyAdminGuard` | 🟠 | - | [x] ✓ 2026-01-21 |

### 4.5 Fluxo de Cadastro de Empresa

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-111 | Endpoint: `POST /companies/register` - cadastrar nova empresa | 🔴 | - | [x] ✓ 2026-01-21 |
| G-112 | Lógica: criar grupo automaticamente se independente | 🔴 | - | [x] ✓ 2026-01-21 |
| G-113 | Lógica: definir usuário como admin temporário | 🔴 | - | [x] ✓ 2026-01-21 |
| G-114 | Lógica: flag `pendingValidation = true` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-115 | Endpoint: `POST /companies/:id/validate` - FAMBRAS valida empresa | 🟠 | - | [x] ✓ 2026-01-21 |
| G-116 | Endpoint: `GET /companies/pending-validation` - empresas pendentes (FAMBRAS) | 🟠 | - | [x] ✓ 2026-01-21 |

---

## ✅ Fase 5: Frontend - Estrutura de Grupos (CONCLUÍDA)

> **Concluída em:** 2026-01-21
> **Branch:** `feature/certification-restructure`
> **Commits:** `feat(frontend): add company groups types, services, hooks and components`

### 5.1 Types e Services

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-117 | Criar `types/company-group.types.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-118 | Criar `types/plant.types.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-119 | Atualizar `types/company.types.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-120 | Atualizar `types/user.types.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-121 | Criar `services/company-group.service.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-122 | Criar `services/plant.service.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-123 | Criar `services/invite.service.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-124 | Criar `services/access-request.service.ts` | 🟠 | - | [x] ✓ 2026-01-21 |

### 5.2 Hooks

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-125 | Criar `hooks/useCompanyGroup.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-126 | Criar `hooks/usePlants.ts` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-127 | Criar `hooks/useInvites.ts` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-128 | Criar `hooks/useAccessRequests.ts` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-129 | Atualizar `hooks/useAuth.ts` com status de vinculação | 🔴 | - | [x] ✓ 2026-01-21 |

### 5.3 Componentes de Gestão de Grupo

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-130 | Criar `components/group/GroupCompanyList.tsx` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-131 | Criar `components/group/AddCompanyToGroupModal.tsx` | 🟠 | - | [x] ✓ 2026-01-21 |
| G-132 | Criar `components/group/GroupSuppliersManager.tsx` | 🟡 | - | [x] ✓ 2026-01-21 |
| G-133 | Criar `components/group/GroupDocumentsManager.tsx` | 🟡 | - | [x] ✓ 2026-01-21 |

### 5.4 Componentes de Gestão de Plantas

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-134 | Criar `components/plant/PlantList.tsx` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-135 | Criar `components/plant/PlantForm.tsx` | 🔴 | - | [x] ✓ 2026-01-21 |
| G-136 | Criar `components/plant/PlantScopeManager.tsx` (escopo de produtos) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-137 | Criar `components/plant/PlantCard.tsx` | 🟠 | - | [x] ✓ 2026-01-21 |

### 5.5 Páginas de Gestão

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-138 | Criar `pages/company/GroupManagement.tsx` (gestão do grupo) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-139 | Criar `pages/company/PlantManagement.tsx` (gestão de plantas) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-140 | Criar `pages/company/UserManagement.tsx` (gestão de usuários) | 🔴 | - | [x] ✓ 2026-01-21 |
| G-141 | Criar `pages/admin/CompanyValidation.tsx` (validação FAMBRAS) | 🟠 | - | [x] ✓ 2026-01-21 |
| G-142 | Atualizar `App.tsx` - adicionar novas rotas | 🟠 | - | [x] ✓ 2026-01-21 |

### 5.6 Atualização de Componentes Existentes

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-143 | Atualizar `Sidebar` - menu com grupo/plantas/usuários | 🔴 | - | [x] ✓ 2026-01-21 |
| G-144 | Criar `services/company.service.ts` - métodos de validação | 🔴 | - | [x] ✓ 2026-01-21 |
| G-145 | Atualizar `types/company.types.ts` - ValidationStatus | 🟠 | - | [x] ✓ 2026-01-21 |
| G-146 | Atualizar `services/index.ts` - exportar novos serviços | 🟡 | - | [x] ✓ 2026-01-21 |
| G-147 | Atualizar `hooks/index.ts` - exportar novos hooks | 🟠 | - | [x] ✓ 2026-01-21 |

### Arquivos da Fase 5

**Types:**
- `src/types/company-group.types.ts` - Tipos para grupos, fornecedores e documentos
- `src/types/plant.types.ts` - Tipos para plantas com PlantCodeType
- `src/types/user.types.ts` - Tipos para convites e solicitações de acesso
- `src/types/company.types.ts` - Atualizado com ValidationStatus

**Services:**
- `src/services/company-group.service.ts` - CRUD de grupos, fornecedores e documentos
- `src/services/plant.service.ts` - CRUD de plantas
- `src/services/invite.service.ts` - Gestão de convites
- `src/services/access-request.service.ts` - Solicitações de acesso
- `src/services/company.service.ts` - Validação de empresas

**Hooks:**
- `src/hooks/useCompanyGroup.ts` - Hook para gestão de grupos
- `src/hooks/usePlants.ts` - Hook para gestão de plantas
- `src/hooks/useInvites.ts` - Hook para convites
- `src/hooks/useAccessRequests.ts` - Hook para solicitações de acesso
- `src/hooks/useAuth.ts` - Atualizado com checkCompanyStatus

**Components:**
- `src/components/group/GroupCompanyList.tsx` - Lista de empresas do grupo
- `src/components/group/AddCompanyToGroupModal.tsx` - Modal para adicionar empresa
- `src/components/group/GroupSuppliersManager.tsx` - Gestão de fornecedores
- `src/components/group/GroupDocumentsManager.tsx` - Gestão de documentos
- `src/components/plant/PlantCard.tsx` - Card de planta
- `src/components/plant/PlantList.tsx` - Lista de plantas
- `src/components/plant/PlantForm.tsx` - Formulário de planta
- `src/components/plant/PlantScopeManager.tsx` - Escopo de produtos

**Pages:**
- `src/pages/company/GroupManagement.tsx` - Página de gestão do grupo
- `src/pages/company/PlantManagement.tsx` - Página de gestão de plantas
- `src/pages/company/UserManagement.tsx` - Página de gestão de usuários
- `src/pages/admin/CompanyValidation.tsx` - Validação de empresas (FAMBRAS)

**Routes adicionadas:**
- `/grupo` - Gestão do grupo
- `/plantas` - Gestão de plantas
- `/usuarios` - Gestão de usuários da empresa
- `/admin/validacao-empresas` - Validação de empresas pendentes

---

## Fase 6: Frontend - Onboarding

### 6.1 Fluxo Pós-Registro

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-148 | Criar `pages/onboarding/CompanyLinkingPage.tsx` (escolher caminho) | 🔴 | - | [ ] |
| G-149 | Criar `pages/onboarding/RegisterCompanyPage.tsx` (cadastrar empresa) | 🔴 | - | [ ] |
| G-150 | Criar `pages/onboarding/JoinCompanyPage.tsx` (solicitar acesso) | 🟠 | - | [ ] |
| G-151 | Criar `pages/onboarding/AcceptInvitePage.tsx` (aceitar convite) | 🔴 | - | [ ] |

### 6.2 Componentes de Onboarding

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-152 | Criar `components/onboarding/CnpjSearchInput.tsx` | 🔴 | - | [ ] |
| G-153 | Criar `components/onboarding/CompanyDataPreview.tsx` (dados da Receita) | 🔴 | - | [ ] |
| G-154 | Criar `components/onboarding/GroupSelectionStep.tsx` (pertence a grupo?) | 🟠 | - | [ ] |
| G-155 | Criar `components/onboarding/CompanySearchForAccess.tsx` | 🟠 | - | [ ] |

### 6.3 Gestão de Convites (Admin)

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-156 | Criar `components/admin/InviteUserModal.tsx` | 🔴 | - | [ ] |
| G-157 | Criar `components/admin/PendingInvitesList.tsx` | 🟠 | - | [ ] |
| G-158 | Criar `components/admin/AccessRequestsList.tsx` | 🟠 | - | [ ] |
| G-159 | Criar `components/admin/AccessRequestActionModal.tsx` | 🟠 | - | [ ] |

### 6.4 Validação FAMBRAS

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-160 | Criar `pages/admin/PendingCompaniesValidation.tsx` | 🟠 | - | [ ] |
| G-161 | Criar `components/admin/CompanyValidationCard.tsx` | 🟠 | - | [ ] |
| G-162 | Criar `components/admin/AssignAdminModal.tsx` | 🟡 | - | [ ] |

### 6.5 Atualização de Rotas

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-163 | Rota: `/onboarding` - página de vinculação | 🔴 | - | [ ] |
| G-164 | Rota: `/onboarding/register-company` - cadastrar empresa | 🔴 | - | [ ] |
| G-165 | Rota: `/onboarding/join-company` - solicitar acesso | 🟠 | - | [ ] |
| G-166 | Rota: `/invite/:token` - aceitar convite | 🔴 | - | [ ] |
| G-167 | Rota: `/empresa/configuracoes` - configurações | 🔴 | - | [ ] |
| G-168 | Rota: `/empresa/plantas` - gestão de plantas | 🔴 | - | [ ] |
| G-169 | Rota: `/empresa/usuarios` - gestão de usuários | 🔴 | - | [ ] |
| G-170 | Rota: `/grupo` - dashboard do grupo (admin grupo) | 🟠 | - | [ ] |
| G-171 | Rota: `/admin/empresas-pendentes` - validação FAMBRAS | 🟠 | - | [ ] |
| G-172 | Implementar redirect automático para `/onboarding` se usuário sem empresa | 🔴 | - | [ ] |

---

## Fase 7: Integração ReceitaWS

### 7.1 Backend

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-173 | Criar `ReceitaWsModule` | 🟠 | - | [ ] |
| G-174 | Implementar client HTTP para API ReceitaWS | 🟠 | - | [ ] |
| G-175 | Criar interface `ReceitaWsResponse` | 🟠 | - | [ ] |
| G-176 | Endpoint: `GET /receita-ws/:cnpj` - buscar dados do CNPJ | 🟠 | - | [ ] |
| G-177 | Implementar cache de consultas (evitar chamadas repetidas) | 🟡 | - | [ ] |
| G-178 | Implementar rate limiting (respeitar limites da API) | 🟡 | - | [ ] |
| G-179 | Fallback para quando API estiver indisponível | 🟡 | - | [ ] |

### 7.2 Frontend

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-180 | Criar `services/receita-ws.service.ts` | 🟠 | - | [ ] |
| G-181 | Criar `hooks/useCnpjLookup.ts` | 🟠 | - | [ ] |
| G-182 | Integrar busca no `CnpjSearchInput.tsx` | 🟠 | - | [ ] |
| G-183 | Exibir loading e tratamento de erros | 🟠 | - | [ ] |

---

## Fase 8: Testes e Validação

### 8.1 Testes Backend

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-184 | Testes unitários: CompanyGroupModule | 🔴 | - | [ ] |
| G-185 | Testes unitários: PlantModule | 🔴 | - | [ ] |
| G-186 | Testes unitários: UserInviteModule | 🟠 | - | [ ] |
| G-187 | Testes unitários: AccessRequestModule | 🟠 | - | [ ] |
| G-188 | Testes integração: fluxo cadastro nova empresa | 🔴 | - | [ ] |
| G-189 | Testes integração: fluxo convite de usuário | 🔴 | - | [ ] |
| G-190 | Testes integração: fluxo solicitação de acesso | 🟠 | - | [ ] |
| G-191 | Testes integração: permissões de admin grupo | 🟠 | - | [ ] |

### 8.2 Testes Frontend

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-192 | Testes E2E: onboarding - cadastrar empresa | 🔴 | - | [ ] |
| G-193 | Testes E2E: onboarding - aceitar convite | 🔴 | - | [ ] |
| G-194 | Testes E2E: criar certificação selecionando planta | 🔴 | - | [ ] |
| G-195 | Testes E2E: dashboard admin grupo | 🟠 | - | [ ] |

### 8.3 Validação

| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| G-196 | Validar migração de dados em ambiente de staging | 🔴 | - | [ ] |
| G-197 | Testar com usuários piloto | 🟠 | - | [ ] |
| G-198 | Documentar bugs encontrados e corrigir | 🔴 | - | [ ] |
| G-199 | Validar performance com múltiplas empresas em grupo | 🟡 | - | [ ] |
| G-200 | Atualizar documentação técnica | 🟠 | - | [ ] |

---

## Resumo por Fase

| Fase | Total Tasks | Críticas (🔴) | Status |
|------|-------------|---------------|--------|
| 1. Schema e Migrations | 24 | 14 | ✅ 24/24 |
| 2. Migração de Dados | 16 | 10 | ✅ 16/16 |
| 3. Backend - Grupos | 41 | 20 | ✅ 41/41 |
| 4. Backend - Onboarding | 35 | 17 | ✅ 35/35 |
| 5. Frontend - Estrutura | 31 | 17 | ✅ 31/31 |
| 6. Frontend - Onboarding | 25 | 11 | 0/25 |
| 7. Integração ReceitaWS | 11 | 0 | 0/11 |
| 8. Testes e Validação | 17 | 8 | 0/17 |
| **TOTAL** | **200** | **97** | **143/200 (71%)** |

---

## Dependências

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ORDEM DE EXECUÇÃO                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BACKLOG-MIGRACAO-CERTIFICACOES (Fases 1-5) ✅ Concluído                │
│                          │                                              │
│                          ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ ESTE BACKLOG - Grupos Empresariais                                │  │
│  │                                                                   │  │
│  │  Fase 1 ──► Fase 2 ──► Fase 3 ──► Fase 4                         │  │
│  │     │                      │          │                           │  │
│  │     │                      │          │                           │  │
│  │     └──────────────────────┼──────────┼───────────────────────┐   │  │
│  │                            │          │                       │   │  │
│  │                            ▼          ▼                       ▼   │  │
│  │                       Fase 5 ──► Fase 6 ──► Fase 7 ──► Fase 8    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                          │                                              │
│                          ▼                                              │
│  BACKLOG-MIGRACAO-CERTIFICACOES (Fases 6-7) - Testes e Deploy          │
│                          │                                              │
│                          ▼                                              │
│  BACKLOG-COMPLEMENTAR-PR71 (Fases C, D, E) - Melhorias                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Critérios de Aceite

### Fase 1-2 (Schema e Migração)
- [ ] Todas as migrations executam sem erro
- [ ] Dados existentes migrados corretamente
- [ ] Índice único de CNPJ funcionando
- [ ] Todas as empresas com grupo vinculado

### Fase 3-4 (Backend)
- [ ] CRUD de grupos funcionando
- [ ] CRUD de plantas funcionando
- [ ] Fluxo de convite funcionando
- [ ] Validação de CNPJ duplicado funcionando
- [ ] Permissões de admin grupo funcionando

### Fase 5-6 (Frontend)
- [ ] Onboarding funcional para novo usuário
- [ ] Cadastro de empresa com busca CNPJ
- [ ] Seleção de planta no wizard de certificação
- [ ] Dashboard de grupo para admin
- [ ] Gestão de usuários e convites

### Fase 7 (Integração)
- [ ] Busca de CNPJ na Receita funcionando
- [ ] Dados preenchidos automaticamente

### Fase 8 (Testes)
- [ ] Testes automatizados passando
- [ ] Validação com usuários piloto concluída

---

## Próximos Passos

1. **Iniciar Fase 1**: Criar migrations no backend-nest
2. **Criar branch**: `feature/company-groups` no backend e frontend
3. **Revisar**: Analisar schema atual para identificar conflitos
4. **Executar**: Seguir tasks em ordem de prioridade

---

*Backlog criado em 2026-01-21*
*Última atualização: 2026-01-21*
