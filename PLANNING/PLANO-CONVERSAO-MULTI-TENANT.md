---
layout: default
title: Plano de Conversao Multi-Tenant
---

# Plano de Conversão Multi-Tenant — Gestão de Certificações

> **Status**: RASCUNHO v2.0 — Em análise conjunta
> **Data**: 2026-02-15 (atualizado de 2026-02-02)
> **Escopo**: Conversão completa para multi-tenant com fluxos de certificação customizáveis
> **Repos afetados**: halalsphere-backend, halalsphere-frontend, halalsphere-docs

---

## Resumo Executivo

Converter o sistema "Gestão de Certificações" de single-tenant (FAMBRAS Halal) para **multi-tenant com fluxos de certificação customizáveis**. Cada **certificadora** será um tenant com:

1. **Isolamento de dados** — Row-level isolation em PostgreSQL compartilhado
2. **Identidade visual própria** — Cores, fontes, logo (já implementado via CSS vars + Tailwind)
3. **Fluxos de certificação configuráveis** — Fases, documentos, roles, regras de aprovação e transição customizáveis por tenant

### Visão de Negócio

O sistema foi originalmente desenhado para a FAMBRAS (certificação Halal, 17 fases). A visão expandida permite que **qualquer organismo certificador** — não necessariamente Halal — utilize a plataforma com seus próprios fluxos. Exemplos:

- **FAMBRAS**: Certificação Halal (17 fases, fluxo comercial + operacional)
- **Certificadora Orgânica**: Certificação orgânica (fases de inspeção de campo, rastreabilidade)
- **Certificadora ISO**: Certificação ISO 9001 (auditoria de sistema, ações corretivas)
- **Certificadora Kosher**: Certificação Kosher (supervisão rabínica, inspeção de ingredientes)

### Três Camadas da Conversão

| Camada | Escopo | Complexidade | Status |
|--------|--------|-------------|--------|
| **1. Visual (White-label)** | Cores, fontes, logo, branding por tenant | ✅ Pronto | CSS vars + Tailwind config centralizados |
| **2. Dados (Isolamento)** | Row-level tenant isolation, SSO, workspace scoping | 🔶 Médio | Planejado neste documento |
| **3. Workflow (Motor de Fluxos)** | Fases, documentos, roles, regras customizáveis | 🔴 Grande | Planejado neste documento |

### Decisões Já Tomadas

- **Isolamento**: Row-level isolation (PostgreSQL compartilhado)
- **Autenticação**: Integrar com admin-geral (SSO entre produtos) — futuro
- **Branding**: Já implementado (Tailwind + CSS custom properties)
- **Escopo**: Apenas planejamento nesta fase — implementação incremental

---

## 1. Análise do Estado Atual

### 1.1 Backend (halalsphere-backend)

- **Stack**: NestJS 11 + Express + Prisma 7 + PostgreSQL 16
- **Módulos**: 38 modules, 35 controllers, 43 services
- **Auth**: JWT RS256/HS256, Guards (JwtAuth, Roles, GroupAdmin, CompanyAdmin)
- **Database**: 45 models Prisma, 23 enums
- **Fluxo atual**: 17 fases hardcoded no ProcessService + RequestService
- **Roles**: 12 tipos no UserRole enum (admin, analista, auditor, gestor, empresa, comercial, juridico, etc.)

### 1.2 Frontend (halalsphere-frontend)

- **Stack**: React 19 + Vite 7 + TypeScript + Tailwind CSS 3.4
- **Componentes**: 80+ componentes, 40+ páginas
- **API layer**: Axios com interceptors + React Query 5
- **Branding**: Centralizado em Tailwind config + CSS vars (white-label ready)

### 1.3 Fluxo de Certificação Atual (FAMBRAS — Hardcoded)

```
FASES COMERCIAIS (1-7) — Novas certificações
  Fase 1: Solicitação
  Fase 2: Análise Inicial
  Fase 3: Proposta Comercial
  Fase 4: Contrato
  Fase 5: Pagamento
  Fase 6: Designação de Analista
  Fase 7: Análise Documental

FASES OPERACIONAIS (8-17) — Todos os tipos
  Fase 8: Designação de Auditor
  Fase 9: Planejamento de Auditoria
  Fase 10: Execução de Auditoria
  Fase 11: Relatório de Auditoria
  Fase 12: Análise Pós-Auditoria
  Fase 13: Comitê Técnico
  Fase 14: Decisão de Certificação
  Fase 15: Emissão do Certificado
  Fase 16: Monitoramento
  Fase 17: Renovação
```

### 1.4 Onde o Fluxo Está Hardcoded

| Local | Tipo | Impacto |
|-------|------|---------|
| `ProcessService` | Enums de status/fase | Transições de estado fixas |
| `RequestService` | Validações de fase | Documentos obrigatórios por fase |
| `CertificationService` | Tipos de certificação | nova/renovação/ampliação |
| `ProposalService` | Fluxo comercial | Geração e aprovação de propostas |
| `ContractService` | Fluxo jurídico | Geração e assinatura de contratos |
| `AuditService` | Fluxo operacional | Designação e execução de auditoria |
| Frontend: Sidebar | Navegação | Menus por role fixos |
| Frontend: Dashboards | Métricas | KPIs por role fixos |
| Frontend: Pages | Formulários | Campos e validações fixos |
| Prisma Schema | Enums | ProcessStatus, RequestStatus, CertificationType |

---

## 2. Arquitetura do Workflow Engine

### 2.1 Conceito: Templates de Fluxo

Cada tenant terá um ou mais **Workflow Templates** que definem seu fluxo de certificação:

```
tenant_workflow_templates
  ├── workflow_phases[]          — Fases do fluxo (ordem, regras)
  │     ├── phase_documents[]    — Documentos exigidos na fase
  │     ├── phase_roles[]        — Roles permitidos na fase
  │     └── phase_transitions[]  — Transições possíveis (aprovação, rejeição, etc.)
  ├── workflow_document_types[]  — Tipos de documento do tenant
  ├── workflow_roles[]           — Roles customizados do tenant
  └── workflow_field_configs[]   — Campos customizados por fase
```

### 2.2 Novos Models Prisma — Workflow Engine

```prisma
// ============================================
// TENANT (Isolamento de Dados)
// ============================================

model TenantClient {
  id                  String   @id @default(uuid())
  name                String   // "FAMBRAS", "CertOrg Brasil"
  slug                String   @unique // "fambras", "certorg"
  isActive            Boolean  @default(true)
  settings            Json?    // Branding, config geral

  // Relações
  workspaces          TenantWorkspace[]

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("tenant_clients")
}

model TenantWorkspace {
  id                     String   @id @default(uuid())
  tenantId               String
  tenant                 TenantClient @relation(fields: [tenantId], references: [id])
  name                   String   // "FAMBRAS Operações SP"
  isActive               Boolean  @default(true)
  settings               Json?    // Config do workspace

  // Relações
  memberships            TenantUserMembership[]
  workflowTemplates      WorkflowTemplate[]

  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  @@map("tenant_workspaces")
}

model TenantUserMembership {
  id            String   @id @default(uuid())
  userId        String
  workspaceId   String
  workspace     TenantWorkspace @relation(fields: [workspaceId], references: [id])
  roleId        String   // Referência ao WorkflowRole do tenant
  isActive      Boolean  @default(true)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([userId, workspaceId])
  @@map("tenant_user_memberships")
}

// ============================================
// WORKFLOW ENGINE (Motor de Fluxos)
// ============================================

model WorkflowTemplate {
  id            String   @id @default(uuid())
  workspaceId   String
  workspace     TenantWorkspace @relation(fields: [workspaceId], references: [id])
  name          String   // "Certificação Halal", "Certificação Orgânica"
  slug          String   // "certificacao-halal"
  description   String?
  version       Int      @default(1)
  isActive      Boolean  @default(true)
  isDefault     Boolean  @default(false)
  settings      Json?    // Config geral do template

  // Relações
  phases        WorkflowPhase[]
  documentTypes WorkflowDocumentType[]
  roles         WorkflowRole[]
  fieldConfigs  WorkflowFieldConfig[]
  // Processos que usam este template
  processes     Process[] // FK reversa

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([workspaceId, slug])
  @@map("workflow_templates")
}

model WorkflowPhase {
  id            String   @id @default(uuid())
  templateId    String
  template      WorkflowTemplate @relation(fields: [templateId], references: [id])
  name          String   // "Solicitação", "Análise Inicial"
  slug          String   // "solicitacao", "analise-inicial"
  description   String?
  order         Int      // Ordem de exibição
  phaseType     PhaseType // commercial, operational, administrative
  isOptional    Boolean  @default(false)
  settings      Json?    // Config da fase (SLA em dias, etc.)

  // Relações
  documents     PhaseDocument[]
  allowedRoles  PhaseRole[]
  transitionsFrom PhaseTransition[] @relation("TransitionFrom")
  transitionsTo   PhaseTransition[] @relation("TransitionTo")
  fieldOverrides  WorkflowFieldConfig[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([templateId, slug])
  @@unique([templateId, order])
  @@map("workflow_phases")
}

model PhaseTransition {
  id              String   @id @default(uuid())
  fromPhaseId     String
  fromPhase       WorkflowPhase @relation("TransitionFrom", fields: [fromPhaseId], references: [id])
  toPhaseId       String
  toPhase         WorkflowPhase @relation("TransitionTo", fields: [toPhaseId], references: [id])
  action          String   // "approve", "reject", "request_revision", "skip"
  label           String   // "Aprovar e Avançar", "Solicitar Revisão"
  conditions      Json?    // Condições para habilitar transição
  requiredRole    String?  // Role necessário para executar
  requiresComment Boolean  @default(false)
  isAutomatic     Boolean  @default(false) // Transição automática se conditions met

  createdAt       DateTime @default(now())

  @@unique([fromPhaseId, toPhaseId, action])
  @@map("phase_transitions")
}

model PhaseDocument {
  id              String   @id @default(uuid())
  phaseId         String
  phase           WorkflowPhase @relation(fields: [phaseId], references: [id])
  documentTypeId  String
  documentType    WorkflowDocumentType @relation(fields: [documentTypeId], references: [id])
  isRequired      Boolean  @default(true)
  uploadedBy      String?  // Role que deve fazer upload
  validatedBy     String?  // Role que valida

  @@unique([phaseId, documentTypeId])
  @@map("phase_documents")
}

model PhaseRole {
  id         String   @id @default(uuid())
  phaseId    String
  phase      WorkflowPhase @relation(fields: [phaseId], references: [id])
  roleId     String
  role       WorkflowRole @relation(fields: [roleId], references: [id])
  permission String   // "view", "edit", "approve", "manage"

  @@unique([phaseId, roleId, permission])
  @@map("phase_roles")
}

model WorkflowDocumentType {
  id            String   @id @default(uuid())
  templateId    String
  template      WorkflowTemplate @relation(fields: [templateId], references: [id])
  name          String   // "Formulário de Solicitação", "Relatório de Auditoria"
  slug          String
  description   String?
  category      String?  // "legal", "technical", "financial"
  fileTypes     String[] // ["pdf", "docx", "xlsx"]
  maxSizeMb     Int      @default(10)
  templateUrl   String?  // URL de modelo para download

  // Relações
  phases        PhaseDocument[]

  @@unique([templateId, slug])
  @@map("workflow_document_types")
}

model WorkflowRole {
  id            String   @id @default(uuid())
  templateId    String
  template      WorkflowTemplate @relation(fields: [templateId], references: [id])
  name          String   // "Analista", "Auditor", "Solicitante"
  slug          String   // "analista", "auditor", "solicitante"
  description   String?
  baseRole      String?  // Mapeamento p/ role base do sistema (admin, user)
  permissions   Json?    // Permissões específicas do role

  // Relações
  phases        PhaseRole[]

  @@unique([templateId, slug])
  @@map("workflow_roles")
}

model WorkflowFieldConfig {
  id            String   @id @default(uuid())
  templateId    String
  template      WorkflowTemplate @relation(fields: [templateId], references: [id])
  phaseId       String?  // Se null, aplica a todas as fases
  phase         WorkflowPhase? @relation(fields: [phaseId], references: [id])
  fieldName     String   // "company_name", "cnpj", "product_list"
  fieldType     String   // "text", "number", "date", "select", "file", "textarea"
  label         String   // Label para exibição
  isRequired    Boolean  @default(false)
  isVisible     Boolean  @default(true)
  options       Json?    // Para tipo "select": [{value, label}]
  validation    Json?    // Regras de validação: {min, max, pattern, etc}
  order         Int      @default(0)

  @@map("workflow_field_configs")
}

// Novo enum
enum PhaseType {
  commercial    // Fases comerciais (proposta, contrato, pagamento)
  operational   // Fases operacionais (auditoria, análise, decisão)
  administrative // Fases administrativas (emissão, monitoramento)
}
```

### 2.3 Alteração no Model Process Existente

O model `Process` existente ganha referência ao template e à fase atual dinâmica:

```prisma
model Process {
  // ... campos existentes mantidos ...

  // NOVOS campos para Workflow Engine
  workspaceId         String?             // Tenant isolation
  workflowTemplateId  String?             // Template de fluxo usado
  workflowTemplate    WorkflowTemplate?   @relation(fields: [workflowTemplateId], references: [id])
  currentPhaseId      String?             // Fase atual (dinâmica)
  phaseHistory        Json?               // Histórico: [{phaseId, enteredAt, exitedAt, action, userId}]
}
```

### 2.4 Diagrama de Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                       │
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Workspace   │  │ Dynamic      │  │ Branding        │ │
│  │ Selector    │  │ Phase UI     │  │ (CSS vars)      │ │
│  └─────────────┘  └──────────────┘  └─────────────────┘ │
│         │                │                    │           │
│  ┌──────┴────────────────┴────────────────────┴────────┐ │
│  │        API Layer (Axios + X-Workspace-Id)            │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                   BACKEND (NestJS)                        │
│                                                           │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────┐ │
│  │ Tenant       │  │ Workflow      │  │ Process       │ │
│  │ Middleware   │  │ Engine        │  │ Service       │ │
│  │ (workspace   │  │ Service       │  │ (agora        │ │
│  │  resolution) │  │ (fases,       │  │  dinâmico)    │ │
│  └──────────────┘  │  transições,  │  └───────────────┘ │
│         │          │  validações)  │          │          │
│         ▼          └───────────────┘          ▼          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │     Prisma (Auto-scoping por workspace_id)           │ │
│  └──────────────────────────────────────────────────────┘ │
│                          │                                │
│                          ▼                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  PostgreSQL (Row-level isolation + Workflow tables)   │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Fases de Implementação

### FASE 1: Fundação — Tenant + Schema (Estimativa: 2-3 sprints)

#### 3.1 Novas Tabelas no Prisma Schema

**Arquivo**: `halalsphere-backend/prisma/schema.prisma`

- **`tenant_clients`** — Entidade top-level (a certificadora)
- **`tenant_workspaces`** — Workspace dentro do tenant
- **`tenant_user_memberships`** — Vínculo user↔workspace com role

#### 3.2 FK `workspace_id` em Tabelas Existentes

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

#### 3.4 Tenant Middleware + Guards

**Novos arquivos**:
- `src/common/middleware/tenant.middleware.ts` — Resolve workspace do JWT + header `X-Workspace-Id`
- `src/common/decorators/current-workspace.decorator.ts` — `@CurrentWorkspace()` param decorator

**Arquivos modificados**:
- `src/auth/guards/jwt-auth.guard.ts` — Workspace context no request
- `src/auth/guards/roles.guard.ts` — Role vem de `tenant_user_memberships`

**Fluxo de request**:
```
Request → JwtAuthGuard (valida JWT)
        → TenantMiddleware (resolve workspace via header X-Workspace-Id)
        → Controller (recebe tenantContext: { tenantId, workspaceId, userId, role })
        → Service (usa PrismaClient scoped por workspace)
```

#### 3.5 Prisma Extension para Auto-Scoping

**Novo arquivo**: `src/prisma/prisma-tenant.extension.ts`
- Wraps PrismaClient com extensão que injeta `workspace_id` automaticamente em queries
- `findMany`, `findFirst`, `create`, `update`, `delete` recebem `where: { workspaceId }` implícito

**Arquivo modificado**: `src/prisma/prisma.service.ts`
- Método `forWorkspace(workspaceId)` retorna PrismaClient scoped

---

### FASE 2: Workflow Engine — Backend (Estimativa: 3-4 sprints)

#### 3.6 Tabelas do Workflow Engine

Criar todos os models descritos na seção 2.2:
- `workflow_templates`, `workflow_phases`, `phase_transitions`
- `phase_documents`, `phase_roles`
- `workflow_document_types`, `workflow_roles`
- `workflow_field_configs`

#### 3.7 WorkflowEngineService

**Novo módulo**: `src/workflow-engine/`

```
src/workflow-engine/
  ├── workflow-engine.module.ts
  ├── workflow-engine.service.ts        — Lógica principal do motor
  ├── workflow-template.service.ts      — CRUD de templates
  ├── workflow-phase.service.ts         — CRUD de fases
  ├── workflow-transition.service.ts    — Lógica de transições
  ├── workflow-validation.service.ts    — Validações dinâmicas
  ├── workflow-engine.controller.ts     — API REST
  ├── dto/
  │     ├── create-template.dto.ts
  │     ├── create-phase.dto.ts
  │     ├── execute-transition.dto.ts
  │     └── ...
  └── interfaces/
        ├── workflow-context.interface.ts
        └── phase-config.interface.ts
```

**Responsabilidades do WorkflowEngineService**:

```typescript
class WorkflowEngineService {
  // Dado um processo, retorna a fase atual e transições disponíveis
  getCurrentPhase(processId: string): PhaseWithTransitions

  // Executa uma transição (avança, rejeita, solicita revisão)
  executeTransition(processId: string, transitionId: string, context: TransitionContext): Process

  // Valida se uma transição pode ser executada (role, documents, conditions)
  canTransition(processId: string, transitionId: string, userId: string): ValidationResult

  // Retorna documentos obrigatórios pendentes na fase atual
  getPendingDocuments(processId: string): PendingDocument[]

  // Retorna campos do formulário para a fase atual
  getPhaseFields(processId: string): FieldConfig[]

  // Retorna timeline/histórico de fases do processo
  getPhaseHistory(processId: string): PhaseHistoryEntry[]
}
```

#### 3.8 Seed do Template FAMBRAS

Criar migration/seed que converte o fluxo FAMBRAS atual (17 fases hardcoded) em um WorkflowTemplate completo:

```typescript
// seed-fambras-template.ts
const fambrasTemplate = {
  name: 'Certificação Halal — FAMBRAS',
  slug: 'certificacao-halal-fambras',
  phases: [
    { name: 'Solicitação', slug: 'solicitacao', order: 1, phaseType: 'commercial',
      documents: ['formulario-solicitacao', 'documentos-empresa'],
      allowedRoles: ['empresa'],
      transitions: [{ to: 'analise-inicial', action: 'submit' }]
    },
    { name: 'Análise Inicial', slug: 'analise-inicial', order: 2, phaseType: 'commercial',
      allowedRoles: ['analista'],
      transitions: [
        { to: 'proposta-comercial', action: 'approve' },
        { to: 'solicitacao', action: 'request_revision' }
      ]
    },
    // ... todas as 17 fases mapeadas
  ]
};
```

#### 3.9 Refatorar ProcessService

O `ProcessService` atual usa lógica hardcoded para transições. Refatorar para delegar ao `WorkflowEngineService`:

**Antes** (hardcoded):
```typescript
async advancePhase(processId: string) {
  const process = await this.prisma.process.findUnique(...);
  if (process.currentPhase === 7) {
    // Lógica fixa de transição fase 7 → 8
  }
}
```

**Depois** (dinâmico):
```typescript
async advancePhase(processId: string, transitionAction: string) {
  return this.workflowEngine.executeTransition(processId, transitionAction, {
    userId: currentUser.id,
    workspaceId: currentWorkspace.id,
  });
}
```

#### 3.10 Adaptação dos Serviços Existentes

| Serviço | Mudança |
|---------|---------|
| `ProcessService` | Delegar transições ao WorkflowEngine |
| `RequestService` | Validação de documentos via PhaseDocument config |
| `CertificationService` | Tipo de certificação via WorkflowTemplate |
| `ProposalService` | Fase de proposta configurável (pode não existir em todos os fluxos) |
| `ContractService` | Fase de contrato configurável |
| `AuditService` | Fase de auditoria configurável |
| `DocumentService` | Tipos de documento via WorkflowDocumentType |
| `NotificationService` | Notificações baseadas em transições de fase |
| `ReportsService` | Queries scoped por workspace + template |

---

### FASE 3: Workflow Engine — Frontend (Estimativa: 3-4 sprints)

#### 3.11 Workspace Store (Zustand)

**Novo arquivo**: `src/store/workspace.store.ts`
```typescript
interface WorkspaceState {
  selectedWorkspaceId: string | null;
  workspaces: Workspace[];
  currentTemplate: WorkflowTemplate | null;
  setSelectedWorkspace: (id: string) => void;
}
// Persistido em localStorage via zustand/persist
```

#### 3.12 API Layer — Header Automático

**Arquivo modificado**: `src/lib/api.ts`
- Interceptor Axios injeta `X-Workspace-Id` em todas as requests automaticamente
- Serviços individuais não precisam de mudança

#### 3.13 Componentes Dinâmicos

**Novos componentes**:

```
src/components/workflow/
  ├── WorkspaceSelector.tsx        — Dropdown no header
  ├── PhaseTimeline.tsx            — Timeline visual das fases (dinâmica)
  ├── PhaseActions.tsx             — Botões de ação baseados em transições disponíveis
  ├── DynamicForm.tsx              — Formulário renderizado a partir de WorkflowFieldConfig
  ├── DocumentChecklist.tsx        — Lista de documentos obrigatórios por fase
  ├── WorkflowTemplateEditor.tsx   — Admin: editor visual de templates (futuro)
  └── TransitionDialog.tsx         — Modal de confirmação de transição
```

**PhaseTimeline** — Componente central que substitui a timeline hardcoded:
```typescript
// Recebe as fases do template e o histórico do processo
// Renderiza uma timeline visual independente do número/nome das fases
function PhaseTimeline({ template, process }: Props) {
  const phases = template.phases.sort((a, b) => a.order - b.order);
  const currentPhaseId = process.currentPhaseId;
  // Render: fases concluídas (verde), fase atual (dourado), futuras (cinza)
}
```

**DynamicForm** — Renderiza formulários baseados na config do tenant:
```typescript
// Usa React Hook Form + Zod
// Campos, labels, validações e opções vêm do WorkflowFieldConfig
function DynamicForm({ fields, onSubmit }: Props) {
  // Gera schema Zod dinamicamente a partir dos fields
  // Renderiza inputs conforme fieldType (text, select, date, file, etc.)
}
```

#### 3.14 Adaptação das Páginas Existentes

| Página | Mudança |
|--------|---------|
| **ProcessDetailPage** | Timeline dinâmica, ações baseadas em transições |
| **RequestPage** | Formulário dinâmico, documentos por fase |
| **DashboardPage** | KPIs baseados nas fases do template ativo |
| **Sidebar / MobileMenu** | Navegação baseada nos roles do workflow |
| **CertificadosPage** | Tipos de certificado do template |
| **PropostaPage** | Condicional — só existe se o template tem fase comercial |

#### 3.15 Admin: Gerenciamento de Templates

Interface para administradores do tenant configurarem seus fluxos:

- **Lista de Templates**: Ver templates ativos, criar novo
- **Editor de Template**: Adicionar/remover/reordenar fases
- **Config de Fase**: Documentos obrigatórios, roles permitidos, transições
- **Preview**: Visualizar o fluxo antes de ativar
- **Versionamento**: Processos em andamento continuam no template original

> **Nota**: O editor visual de templates é um feature avançado que pode ser implementado em fase posterior. Inicialmente, templates podem ser configurados via seed/migration ou API direta.

---

### FASE 4: Integração Auth + SSO (Estimativa: 1-2 sprints)

#### 3.16 Integração com Admin-Geral (Opcional/Futuro)

**Abordagem**: Auth federado com período de transição dual

**Novos arquivos**:
- `src/auth/strategies/admin-geral-jwt.strategy.ts` — Passport strategy para JWTs do admin-geral
- Sync de usuário do admin-geral no primeiro login

**Fluxo SSO**:
```
User → admin-geral login → JWT → redirect ao Gestão de Certificações
     → TenantMiddleware resolve workspace → acesso concedido
```

> **Nota**: Esta fase é independente e pode ser implementada a qualquer momento. O sistema pode operar multi-tenant com seu próprio auth enquanto o SSO não estiver pronto.

---

### FASE 5: Infraestrutura (Estimativa: 1 sprint)

- **PostgreSQL**: Novas tabelas + índices compostos `(workspace_id, ...)`
- **S3**: Paths com prefixo `/{workspaceId}/`
- **Redis** (se SSO): Validação de sessão admin-geral
- **CI/CD**: Step de migration + seed + testes de isolamento

---

### FASE 6: Testes e Validação (Estimativa: 1-2 sprints)

| Teste | Prioridade |
|-------|-----------|
| Dados do Workspace A invisíveis do Workspace B | CRÍTICA |
| User sem membership não acessa API do workspace | CRÍTICA |
| JOINs cross-workspace retornam vazio | CRÍTICA |
| Processo segue fases do template correto | CRÍTICA |
| Transições respeitam roles do workflow | ALTA |
| Documentos obrigatórios bloqueiam transição | ALTA |
| Campos customizados renderizam corretamente | ALTA |
| Template versionado: processos antigos mantêm fluxo original | ALTA |
| Role em workspace A não dá poder em workspace B | ALTA |
| Audit trail scoped por workspace | MÉDIA |
| QR code de certificado funciona cross-workspace | MÉDIA |

---

## 4. Exemplo Prático: Dois Tenants

### Tenant 1: FAMBRAS (Halal) — 17 fases

```yaml
Template: Certificação Halal FAMBRAS
Roles: [admin, analista, auditor, gestor, empresa, comercial, juridico]
Fases:
  1. Solicitação (empresa → analista)
  2. Análise Inicial (analista)
  3. Proposta Comercial (comercial → empresa)
  4. Contrato (juridico → empresa)
  5. Pagamento (empresa → financeiro)
  6. Designação de Analista (gestor)
  7. Análise Documental (analista)
  8. Designação de Auditor (gestor)
  9. Planejamento de Auditoria (auditor)
  10. Execução de Auditoria (auditor)
  11. Relatório de Auditoria (auditor → analista)
  12. Análise Pós-Auditoria (analista)
  13. Comitê Técnico (gestor + membros)
  14. Decisão de Certificação (gestor)
  15. Emissão do Certificado (admin)
  16. Monitoramento (analista)
  17. Renovação (empresa → fase 2)
Documentos: 25+ tipos (formulário halal, lista de ingredientes, relatório de auditoria, etc.)
```

### Tenant 2: CertOrg (Orgânicos) — 10 fases

```yaml
Template: Certificação Orgânica CertOrg
Roles: [admin, inspetor, analista, produtor]
Fases:
  1. Cadastro do Produtor (produtor)
  2. Análise de Elegibilidade (analista)
  3. Contrato de Certificação (analista → produtor)
  4. Inspeção de Campo (inspetor)
  5. Coleta de Amostras (inspetor)
  6. Análise Laboratorial (analista)
  7. Relatório de Inspeção (inspetor → analista)
  8. Decisão de Certificação (analista)
  9. Emissão do Selo (admin)
  10. Auditoria de Manutenção (inspetor — anual)
Documentos: 12 tipos (plano de manejo, laudo laboratorial, mapa da propriedade, etc.)
```

### O que muda no código?

**NADA** no código-fonte. A diferença está inteiramente nos dados:
- Diferentes registros em `workflow_templates`, `workflow_phases`, `phase_transitions`
- Diferentes `workflow_roles` e `workflow_document_types`
- O frontend renderiza dinamicamente baseado no template do workspace ativo

---

## 5. Estratégia de Implementação Incremental

### Abordagem Recomendada: Backward-Compatible

```
SPRINT 1-2: Fase 1 (Tenant Foundation)
  ├── Criar tabelas tenant + workspace
  ├── Adicionar workspace_id nullable
  ├── Criar tenant/workspace default (FAMBRAS)
  ├── Popular workspace_id em dados existentes
  └── Resultado: Sistema funciona igual, mas com tenant_id

SPRINT 3-4: Fase 2a (Workflow Schema + Seed)
  ├── Criar tabelas do workflow engine
  ├── Seed do template FAMBRAS (17 fases → workflow_templates)
  ├── WorkflowEngineService básico (read-only)
  └── Resultado: Template existe mas ProcessService ainda hardcoded

SPRINT 5-6: Fase 2b (Workflow Engine Active)
  ├── ProcessService delega ao WorkflowEngine
  ├── Transições dinâmicas funcionando
  ├── Validações de documentos dinâmicas
  └── Resultado: FAMBRAS funciona igual, mas via workflow engine

SPRINT 7-8: Fase 3a (Frontend Dynamic)
  ├── PhaseTimeline dinâmico
  ├── DynamicForm para campos customizados
  ├── PhaseActions baseado em transições
  └── Resultado: Frontend renderiza fluxo do template

SPRINT 9-10: Fase 3b (Multi-tenant Frontend)
  ├── WorkspaceSelector
  ├── Branding por tenant (já preparado)
  ├── Navegação dinâmica
  └── Resultado: Pronto para segundo tenant

SPRINT 11: Fase 4 (SSO — opcional)
SPRINT 12: Fase 5 (Infra) + Fase 6 (Testes)
```

### Princípio: Zero Breaking Changes

Cada sprint deve manter o sistema funcional. O tenant default (FAMBRAS) e o template padrão (17 fases) garantem que o sistema opera normalmente durante toda a migração. O segundo tenant só é ativado quando tudo estiver pronto.

---

## 6. Decisões Pendentes (Stakeholder Input)

| # | Decisão | Opções | Recomendação |
|---|---------|--------|-------------|
| 1 | Tabela de preços | Global vs per-workspace | Per-workspace |
| 2 | Pool de auditores | Compartilhado vs per-workspace | Pool compartilhado com assignment por workspace |
| 3 | Numeração de certificados | Global vs per-workspace | Global (certificados são público-facing) |
| 4 | S3 storage | Bucket único com prefix vs bucket por tenant | Bucket único com `/{workspaceId}/` |
| 5 | Knowledge base (AI/RAG) | Compartilhada vs per-workspace | Per-workspace com base global |
| 6 | Timing de migração | Big-bang vs gradual | Gradual com backward-compatibility |
| 7 | Editor de templates | UI visual vs config via API/seed | API/seed primeiro, UI visual depois |
| 8 | Roles: herança ou independentes? | Roles do workflow herdam de roles base | Herdam (baseRole mapping) |
| 9 | Processos em andamento durante migração | Mantêm fluxo original vs migram | Mantêm fluxo original (template versionado) |

---

## 7. Riscos

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| Data leak entre tenants (WHERE faltando) | MÉDIA | CRÍTICO | Prisma auto-scoping + testes de isolamento |
| Workflow engine com complexidade excessiva | MÉDIA | ALTO | Começar simples (linear), complexidade sob demanda |
| Performance com muitas tabelas de workflow | BAIXA | MÉDIA | Índices compostos, cache de template em Redis |
| Template mal configurado trava processos | MÉDIA | ALTO | Validação de template antes de ativar + rollback |
| Frontend não renderiza fluxos muito diferentes | MÉDIA | MÉDIO | DynamicForm + PhaseTimeline genéricos |
| Migração corrompe dados de produção | BAIXA | CRÍTICO | Backup completo + rollout staged + rollback script |

---

## 8. Impacto em Arquivos

### Novos (~25-30 arquivos)

**Backend**:
- `src/workflow-engine/` — Módulo completo (8-10 arquivos)
- `src/common/middleware/tenant.middleware.ts`
- `src/common/decorators/current-workspace.decorator.ts`
- `src/prisma/prisma-tenant.extension.ts`
- `prisma/migrations/` — 3-5 migrations
- `prisma/seeds/` — Seed do template FAMBRAS

**Frontend**:
- `src/store/workspace.store.ts`
- `src/components/workflow/` — 6-8 componentes
- `src/services/workflow.service.ts`

### Modificação Major (~15 arquivos)

- `prisma/schema.prisma` — 8 novos models + 18+ models com workspace_id
- `src/process/process.service.ts` — Delegar ao workflow engine
- `src/request/request.service.ts` — Validações dinâmicas
- `src/auth/guards/jwt-auth.guard.ts` — Workspace context
- `src/auth/guards/roles.guard.ts` — Role via membership
- `src/prisma/prisma.service.ts` — forWorkspace()
- Frontend: `src/lib/api.ts` — Header X-Workspace-Id
- Frontend: `src/components/layout/Sidebar.tsx` — Menu dinâmico
- Frontend: process detail pages — Timeline dinâmica

### Modificação Minor (~35 arquivos)

- Todos os 35+ backend services (cobertos pelo Prisma auto-scoping na maioria)

---

## 9. Verificação End-to-End

1. Rodar migrations: `npx prisma migrate dev`
2. Seed do tenant default FAMBRAS + template 17 fases
3. Rodar testes existentes (devem passar — tudo no workspace default)
4. Criar segundo tenant "CertOrg" com template de 10 fases
5. Criar dados no segundo tenant
6. Verificar que queries do tenant 1 não retornam dados do tenant 2
7. Criar processo no tenant 2 — verificar que segue as 10 fases do template CertOrg
8. Verificar transições de fase respeitam roles do template CertOrg
9. Testar workspace switching no frontend
10. Verificar branding muda ao trocar workspace
11. Verificar audit trail scoped por workspace
12. Benchmark de performance antes/depois

---

## 10. Resumo de Esforço

| Fase | Sprints | Foco |
|------|---------|------|
| Fase 1: Tenant Foundation | 2-3 | Schema, middleware, auto-scoping |
| Fase 2: Workflow Engine Backend | 3-4 | Motor de fluxos, seed FAMBRAS, refatorar services |
| Fase 3: Workflow Engine Frontend | 3-4 | Componentes dinâmicos, workspace selector |
| Fase 4: SSO (opcional) | 1-2 | Integração admin-geral |
| Fase 5: Infraestrutura | 1 | S3, Redis, CI/CD |
| Fase 6: Testes | 1-2 | Isolamento, fluxos, e2e |
| **TOTAL** | **~12-16 sprints** | **~6-8 meses** |

> **Nota**: A Fase 1 + Fase 2a (schema + seed) podem ser feitas em paralelo. A Fase 4 (SSO) é independente e pode ser adiada. O MVP multi-tenant (sem editor visual de templates) pode estar pronto em ~8-10 sprints.
