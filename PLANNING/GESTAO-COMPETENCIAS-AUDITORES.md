# Gestao de Competencias de Auditores

## Planejamento de Implementacao

**Data**: 2026-03-09
**Status**: PLANEJADO
**Versao**: 1.0

---

## 1. Visao Geral

### Objetivo
Permitir que auditores cadastrem e gerenciem suas proprias competencias via pagina de perfil, com fluxo de aprovacao pelo gestor de auditoria.

### Regras de Negocio

| Regra | Descricao |
|-------|-----------|
| RN-01 | O auditor cadastra/edita suas competencias pela pagina `/perfil` |
| RN-02 | Toda alteracao fica com status `pendente` ate aprovacao |
| RN-03 | `gestor_auditoria` ou `admin` aprovam/rejeitam as solicitacoes |
| RN-04 | `gestor_auditoria` tem suas proprias competencias **auto-aprovadas** |
| RN-05 | Somente `gestor_auditoria` ou `admin` podem **remover** competencias |
| RN-06 | O auditor pode criar novas competencias e editar existentes |
| RN-07 | O gestor_auditoria recebe notificacao quando ha solicitacao pendente |
| RN-08 | O auditor recebe notificacao quando sua solicitacao e aprovada/rejeitada |
| RN-09 | Dashboard do gestor exibe contador de pendencias |

### Roles Envolvidas

| Role | Pode fazer |
|------|-----------|
| `auditor` | Criar/editar competencias (pendente de aprovacao), ver status dos pedidos |
| `gestor_auditoria` | Criar/editar competencias (auto-aprovadas), aprovar/rejeitar pedidos, remover competencias |
| `admin` | Tudo que gestor_auditoria + gestao de usuarios |

---

## 2. Modelo de Dados

### 2.1. Novo Enum: `CompetencyRequestStatus`

```prisma
enum CompetencyRequestStatus {
  pendente   // Aguardando revisao
  aprovada   // Gestor aprovou - aplicada na tabela real
  rejeitada  // Gestor rejeitou com motivo
  cancelada  // Auditor cancelou antes da revisao
}
```

### 2.2. Novo Enum: `CompetencyRequestAction`

```prisma
enum CompetencyRequestAction {
  criar   // Nova competencia
  editar  // Alteracao de competencia existente
}
```

### 2.3. Novo Modelo: `CompetencyChangeRequest`

```prisma
model CompetencyChangeRequest {
  id              String                    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  auditorId       String                    @map("auditor_id") @db.Uuid
  competencyId    String?                   @map("competency_id") @db.Uuid  // null = criacao
  action          CompetencyRequestAction
  status          CompetencyRequestStatus   @default(pendente)

  // Snapshot dos dados submetidos (todos os campos de AuditorCompetency)
  data            Json                      @db.JsonB

  // Para edits: snapshot do estado anterior (permite diff)
  previousData    Json?                     @map("previous_data") @db.JsonB

  // Tracking
  submittedAt     DateTime                  @default(now()) @map("submitted_at")
  reviewedBy      String?                   @map("reviewed_by") @db.Uuid
  reviewedAt      DateTime?                 @map("reviewed_at")
  reviewNotes     String?                   @map("review_notes") @db.Text

  // Relacoes
  auditor         User                      @relation("CompetencyRequests", fields: [auditorId], references: [id], onDelete: Cascade)
  competency      AuditorCompetency?        @relation("CompetencyChanges", fields: [competencyId], references: [id], onDelete: SetNull)
  reviewer        User?                     @relation("CompetencyReviews", fields: [reviewedBy], references: [id])

  createdAt       DateTime                  @default(now()) @map("created_at")
  updatedAt       DateTime                  @updatedAt @map("updated_at")

  @@index([auditorId])
  @@index([status])
  @@index([submittedAt])
  @@map("competency_change_requests")
}
```

### 2.4. Relacoes Adicionais no User

```prisma
// Adicionar ao model User:
competencyRequests    CompetencyChangeRequest[]   @relation("CompetencyRequests")
competencyReviews     CompetencyChangeRequest[]   @relation("CompetencyReviews")
```

### 2.5. Relacao Adicional no AuditorCompetency

```prisma
// Adicionar ao model AuditorCompetency:
changeRequests        CompetencyChangeRequest[]   @relation("CompetencyChanges")
```

---

## 3. Backend - Endpoints

### 3.1. Novos Endpoints (CompetencyChangeRequest)

| # | Metodo | Rota | Roles | Descricao |
|---|--------|------|-------|-----------|
| E1 | `POST` | `/auditor-competencies/requests` | auditor, gestor_auditoria | Submeter solicitacao (criar/editar) |
| E2 | `GET` | `/auditor-competencies/requests/my` | auditor, gestor_auditoria | Minhas solicitacoes |
| E3 | `GET` | `/auditor-competencies/requests/pending` | gestor_auditoria, admin | Solicitacoes pendentes |
| E4 | `GET` | `/auditor-competencies/requests/pending/count` | gestor_auditoria, admin | Contador de pendentes (para badge) |
| E5 | `GET` | `/auditor-competencies/requests/:id` | auditor (proprio), gestor_auditoria, admin | Detalhe da solicitacao |
| E6 | `PATCH` | `/auditor-competencies/requests/:id/approve` | gestor_auditoria, admin | Aprovar (aplica na tabela real) |
| E7 | `PATCH` | `/auditor-competencies/requests/:id/reject` | gestor_auditoria, admin | Rejeitar com motivo obrigatorio |
| E8 | `DELETE` | `/auditor-competencies/requests/:id` | auditor (proprio, so pendente) | Cancelar solicitacao pendente |

### 3.2. Logica de Negocio por Endpoint

**E1 - Submeter Solicitacao**
```
1. Valida que user existe e tem role auditor ou gestor_auditoria
2. Se action=editar, valida que competencyId existe e pertence ao auditor
3. Salva snapshot em `data` (campos do formulario)
4. Se action=editar, salva estado atual em `previousData`
5. Se role=gestor_auditoria:
   a. Cria request com status=aprovada
   b. Aplica direto na AuditorCompetency (create ou update)
   c. NÃO notifica ninguem
6. Se role=auditor:
   a. Cria request com status=pendente
   b. Notifica todos os gestor_auditoria via notificacao in-app
   c. Verifica se ja existe pedido pendente para mesma competencia → erro 409
```

**E6 - Aprovar**
```
1. Valida request existe e status=pendente
2. Se action=criar:
   a. Cria AuditorCompetency com dados do `data`
   b. Atualiza request.competencyId com o ID criado
3. Se action=editar:
   a. Atualiza AuditorCompetency com dados do `data`
4. Marca request: status=aprovada, reviewedBy, reviewedAt
5. Notifica auditor: "Competencia aprovada"
```

**E7 - Rejeitar**
```
1. Valida request existe e status=pendente
2. reviewNotes obrigatorio (min 10 caracteres)
3. Marca request: status=rejeitada, reviewedBy, reviewedAt, reviewNotes
4. Notifica auditor: "Competencia rejeitada - motivo: ..."
```

### 3.3. DTOs

**SubmitCompetencyRequestDto**
```typescript
{
  competencyId?: string;         // null = nova, preenchido = edicao
  // Mesmos campos do CreateCompetencyDto EXCETO auditorId (vem do JWT)
  industrialCategoryId?: string;
  competencyLevel: CompetencyLevel;
  certificationType?: CertificationType;
  educationalBackground: EducationalBackground;
  eligibleStandards?: EligibleStandard[];
  sgqAppointments?: SgqAppointment[];
  deputyId?: string;
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  confidentialityAgreement?: boolean;
  ethicsCode?: boolean;
  yearsExperience?: number;
  auditsCompleted?: number;
  successRate?: number;
  certifications?: any;
  languages?: Language[];
  baseCity?: string;
  baseState?: string;
  baseCountry?: string;
  maxTravelKm?: number;
  acceptsInternational?: boolean;
  maxConcurrentAudits?: number;
  notes?: string;
}
```

**ReviewCompetencyRequestDto**
```typescript
{
  reviewNotes?: string;  // Obrigatorio para rejeicao
}
```

---

## 4. Backend - Notificacoes

### 4.1. Novos Tipos

Adicionar ao `notification.types.ts`:

```typescript
// Competency management
COMPETENCY_REQUEST_SUBMITTED = 'competency_request_submitted',
COMPETENCY_REQUEST_APPROVED = 'competency_request_approved',
COMPETENCY_REQUEST_REJECTED = 'competency_request_rejected',
```

### 4.2. Template de Notificacoes

| Tipo | Titulo | Mensagem | Link |
|------|--------|----------|------|
| SUBMITTED | "Nova solicitacao de competencia" | "{{auditorName}} submeteu uma solicitacao de {{action}} de competencia" | `/gestor/competencias-pendentes` |
| APPROVED | "Competencia aprovada" | "Sua solicitacao de {{action}} de competencia foi aprovada por {{reviewerName}}" | `/perfil` |
| REJECTED | "Competencia rejeitada" | "Sua solicitacao de {{action}} de competencia foi rejeitada. Motivo: {{reviewNotes}}" | `/perfil` |

---

## 5. Frontend - Pagina de Perfil

### 5.1. Nova Secao: "Minhas Competencias"

Visivel apenas para roles `auditor` e `gestor_auditoria`.

Posicao na pagina `/perfil` (UserProfile.tsx):
```
[Header com Avatar]         ← existente
[Dados Pessoais]            ← existente
[Seguranca]                 ← existente
[Minhas Competencias]       ← NOVO
[Estatisticas]              ← existente
```

### 5.2. Layout da Secao

```
┌─────────────────────────────────────────────────────┐
│ 🎓 Minhas Competencias              [+ Adicionar]   │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌─ Competencia 1 ─────────────────────── ✅ ─────┐  │
│ │ Alimentos | Avançado | GSO, OIC_SMIIC          │  │
│ │ Cat: A - Carnes e derivados                     │  │
│ │ Funcoes: auditor_tecnico, revisor              │  │
│ │                                      [Editar]   │  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Competencia 2 ─────────────────────── ⏳ ─────┐  │
│ │ Veterinaria | Intermediário | GSO               │  │
│ │ Cat: B - Lácteos                                │  │
│ │ Status: Pendente de aprovacao                   │  │
│ │                                    [Cancelar]   │  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Competencia 3 ─────────────────────── ✗ ─────┐  │
│ │ Quimica | Avançado | BPJPH                      │  │
│ │ REJEITADA: "Necessario comprovar experiencia"   │  │
│ │                               [Editar e Resub]  │  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 5.3. Modal de Competencia (Criar/Editar)

Formulario com os campos organizados em secoes:

```
┌─ Nova Competencia ──────────────────────────────────┐
│                                                      │
│ ── Formacao e Qualificacao ──                        │
│ [Formacao Educacional ▾]  [Nivel de Competencia ▾]   │
│ [Tipo de Certificacao ▾]                             │
│                                                      │
│ ── Area de Atuacao ──                                │
│ [Categoria Industrial ▾ com busca]                   │
│ [Normas Elegiveis        □GSO □OIC □BPJPH □...]     │
│ [Funcoes SGQ             □aud_tec □aud_rel □...]    │
│                                                      │
│ ── Localizacao e Disponibilidade ──                  │
│ [Cidade]  [UF ▾]  [Pais]                            │
│ [Distancia Max km]  [□ Aceita Internacional]         │
│ [Max Auditorias Simultaneas]                         │
│                                                      │
│ ── Experiencia ──                                    │
│ [Anos Experiencia]  [Auditorias Completadas]         │
│ [Taxa de Sucesso %]                                  │
│ [Idiomas             □PT □EN □ES □AR □...]          │
│                                                      │
│ ── Compliance ──                                     │
│ [□ Acordo de Confidencialidade]                      │
│ [□ Codigo de Etica]                                  │
│ [Ultima Avaliacao 📅]  [Proxima Avaliacao 📅]       │
│                                                      │
│ ── Outros ──                                         │
│ [Suplente ▾]                                         │
│ [Notas                                         ]     │
│                                                      │
│              [Cancelar]  [Submeter para Aprovacao]   │
│              (gestor_auditoria ve: [Salvar])          │
└──────────────────────────────────────────────────────┘
```

---

## 6. Frontend - Gestao pelo Gestor de Auditoria

### 6.1. Nova Pagina: Competencias Pendentes

**Rota**: `/gestor/competencias-pendentes`
**Menu**: Adicionar ao Sidebar do gestor_auditoria

```
┌─────────────────────────────────────────────────────┐
│ Competencias Pendentes de Aprovacao          (3)     │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Joao Silva (auditor)           NOVA | 2h atras  │  │
│ │ Formacao: Alimentos | Nivel: Avancado           │  │
│ │ Categoria: A - Carnes e derivados               │  │
│ │ Normas: GSO, OIC_SMIIC | Funcoes: aud_tecnico  │  │
│ │                                                  │  │
│ │ [Ver Detalhes]    [Aprovar ✓]    [Rejeitar ✗]   │  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─────────────────────────────────────────────────┐  │
│ │ Maria Santos (auditor)      EDICAO | 1 dia atras│  │
│ │ Formacao: Veterinaria | Nivel: Intermediario     │  │
│ │ ── Alteracoes ──                                 │  │
│ │ Nivel: basico → intermediario                    │  │
│ │ +Norma: OIC_SMIIC (adicionada)                  │  │
│ │ KM: 500 → 1000                                   │  │
│ │                                                  │  │
│ │ [Ver Completo]    [Aprovar ✓]    [Rejeitar ✗]   │  │
│ └─────────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 6.2. Dashboard - Novo Card

No AllocationDashboard.tsx, adicionar card:

```
┌─────────────────────────┐
│ Competencias Pendentes   │
│         3                │
│ solicitacoes aguardando  │
│      [Ver todas →]       │
└─────────────────────────┘
```

### 6.3. Sidebar - Novo Item

Adicionar ao menu do `gestor_auditoria` no Sidebar.tsx:

```
- Dashboard → /dashboard
- Certificacoes → /certificacoes
- Alocacao de Auditores → /gestor/alocacoes
- Dashboard Alocacoes → /gestor/alocacoes/dashboard
- Competencias Pendentes → /gestor/competencias-pendentes    ← NOVO (com badge)
- Calendario → /calendario
- Relatorios → /relatorios
```

---

## 7. Plano de Execucao

### Fase 1: Backend - Modelo e Migration ✅ CONCLUIDA
**Arquivos**:
- `prisma/schema.prisma` - Enums + modelo + relacoes adicionados
- `prisma/migrations/20260309000000_add_competency_change_requests/migration.sql` - SQL idempotente

**Tarefas**:
- [x] 1.1 Criar enum `CompetencyRequestStatus`
- [x] 1.2 Criar enum `CompetencyRequestAction`
- [x] 1.3 Criar modelo `CompetencyChangeRequest`
- [x] 1.4 Adicionar relacoes no `User` e `AuditorCompetency`
- [x] 1.5 Criar migration SQL (manual, idempotente - IF NOT EXISTS / DO $$ BEGIN...EXCEPTION)

**Nota ERRO-23**: Migration criada manualmente com SQL idempotente. Em producao rodar:
```sql
-- Conectar no RDS e executar o conteudo de:
-- prisma/migrations/20260309000000_add_competency_change_requests/migration.sql
```

---

### Fase 2: Backend - Service e Controller ✅ CONCLUIDA
**Arquivos**:
- `src/auditor-competency/dto/submit-competency-request.dto.ts` - CRIADO
- `src/auditor-competency/dto/review-competency-request.dto.ts` - CRIADO
- `src/auditor-competency/dto/index.ts` - Atualizado exports
- `src/auditor-competency/auditor-competency.service.ts` - 7 novos metodos + applyCompetencyChange()
- `src/auditor-competency/auditor-competency.controller.ts` - 8 novos endpoints (ERRO-1 aplicado)
- `src/auditor-competency/auditor-competency.module.ts` - NotificationModule ja e @Global

**Tarefas**:
- [x] 2.1 Criar `SubmitCompetencyRequestDto`
- [x] 2.2 Criar `ReviewCompetencyRequestDto`
- [x] 2.3 Implementar `submitRequest()` (auto-aprovacao gestor_auditoria)
- [x] 2.4 Implementar `findMyRequests()`
- [x] 2.5 Implementar `findPendingRequests()`
- [x] 2.6 Implementar `countPending()`
- [x] 2.7 Implementar `findRequestById()`
- [x] 2.8 Implementar `approveRequest()` (aplica AuditorCompetency + notifica)
- [x] 2.9 Implementar `rejectRequest()` (notifica com motivo)
- [x] 2.10 Implementar `cancelRequest()`
- [x] 2.11 Adicionar 8 endpoints no controller (rotas especificas ANTES de :id - ERRO 1)
- [x] 2.12 NotificationService injetado via @Global

---

### Fase 3: Backend - Notificacoes ✅ CONCLUIDA
**Arquivos**:
- `src/notification/notification.types.ts` - 3 novos tipos
- `src/notification/templates/competency-request.template.ts` - CRIADO
- `src/notification/templates/index.ts` - Atualizado

**Tarefas**:
- [x] 3.1 Adicionar 3 novos tipos ao `NotificationType` enum
- [x] 3.2 Criar template `competency-request.template.ts`
- [x] 3.3 Integrar envio (feito na Fase 2 - submitRequest/approveRequest/rejectRequest)

---

### Fase 4: Backend - Testes ✅ CONCLUIDA (38 testes, todos passando)
**Arquivos**:
- `src/auditor-competency/auditor-competency.service.spec.ts` - 16 novos testes (22 existentes + 16 novos = 38)

**Tarefas**:
- [x] 4.1 Testes para `submitRequest()` - auditor (pendente) vs gestor_auditoria (auto-aprovada)
- [x] 4.2 Testes para `approveRequest()` - criar e editar
- [x] 4.3 Testes para `rejectRequest()` - com validacao de reviewNotes
- [x] 4.4 Testes para `cancelRequest()` - so pendente, so dono
- [x] 4.5 Testes para `findPendingRequests()` e `countPending()`
- [x] 4.6 Teste de conflito: pedido duplicado para mesma competencia

---

### Fase 5: Frontend - Service e Types ✅ CONCLUIDA
**Arquivos**:
- `src/services/auditor-competency.service.ts` - Types + 7 novos metodos adicionados

**Tarefas**:
- [x] 5.1 Tipos: `CompetencyChangeRequest`, `CompetencyRequestStatus`, `CompetencyRequestAction`, `SubmitCompetencyRequestDto`, `REQUEST_STATUS_LABELS`
- [x] 5.2 `submitRequest()`
- [x] 5.3 `getMyRequests()`
- [x] 5.4 `getPendingRequests()`
- [x] 5.5 `getPendingCount()`
- [x] 5.6 `approveRequest()`
- [x] 5.7 `rejectRequest()`
- [x] 5.8 `cancelRequest()`

---

### Fase 6: Frontend - Perfil do Auditor ✅ CONCLUIDA
**Arquivos**:
- `src/components/competency/CompetencyCard.tsx` - CRIADO
- `src/components/competency/CompetencyFormModal.tsx` - CRIADO (formulario completo, 6 secoes)
- `src/components/competency/CompetencySection.tsx` - CRIADO
- `src/pages/profile/UserProfile.tsx` - Integrado (condicional para auditor/gestor_auditoria)

**Tarefas**:
- [x] 6.1 `CompetencyCard` com badge de status + acoes (editar/cancelar/resubmeter)
- [x] 6.2 `CompetencyFormModal` com todas as secoes do DTO
- [x] 6.3 `CompetencySection` - lista aprovadas + pendentes criacao + rejeitadas
- [x] 6.4 Integrado no `UserProfile.tsx` (condicional auditor/gestor_auditoria)
- [x] 6.5 Logica: auditor→pendente, gestor_auditoria→salvar direto
- [x] 6.6 Busca categorias industriais via `/industrial-categories`
- [ ] 6.7 Select de suplente - adiado (baixa prioridade)

---

### Fase 7: Frontend - Tela de Revisao (Gestor) ✅ CONCLUIDA
**Arquivos**:
- `src/components/competency/CompetencyReviewCard.tsx` - CRIADO (com diff visual)
- `src/pages/manager/PendingCompetencies.tsx` - CRIADO
- `src/App.tsx` - Rota adicionada
- `src/components/layout/Sidebar.tsx` - Item adicionado (admin sections + gestor_auditoria direto)

**Tarefas**:
- [x] 7.1 `CompetencyReviewCard` com diff (DiffValue component) + aprovar/rejeitar
- [x] 7.2 Pagina `PendingCompetencies` com loading, empty state, lista
- [x] 7.3 Rota `/gestor/competencias-pendentes` no App.tsx
- [x] 7.4 Item no Sidebar para gestor_auditoria e admin

---

### Fase 8: Frontend - Dashboard Integration ✅ CONCLUIDA
**Arquivos**:
- `src/pages/manager/AllocationDashboard.tsx` - Card de alerta + contagem + link
- `src/components/layout/Sidebar.tsx` - Item ja adicionado na Fase 7

**Tarefas**:
- [x] 8.1 Card "Competencias Pendentes" no AllocationDashboard (banner amarelo com contagem + botao "Ver todas")
- [x] 8.2 Item no Sidebar (feito na Fase 7 - badge dinamico adiado para futuro)

---

### Fase 9: API Gateway + Seed ✅ CONCLUIDA
**Arquivos**:
- `scripts/generate-api-gateway.js` - Regenerado com sucesso
- `deploy/halalsphere-api.*.json` - 332 paths (8 novos endpoints incluidos)
- `prisma/seed.ts` - JA POSSUI 8 auditores + competencias (seed existente)

**Tarefas**:
- [x] 9.1 Regenerar API Gateway (ERRO-19): swagger gerado (333 paths) → API Gateway JSONs regenerados (332 paths, 3 ambientes)
- [x] 9.2 Seed: JA EXISTE - 8 auditores FAMBRAS com competencias completas
- [ ] 9.3 Seed de change request pendente - opcional (pode testar manualmente)

**IMPORTANTE para deploy (ERRO-23 + ERRO-19)**:
1. Rodar migration SQL no RDS de producao ANTES do deploy
2. Regenerar API Gateway JSON com novos endpoints
3. Deploy do API Gateway via `deploy/apigateway.sh`

---

## 8. Resumo de Arquivos

### Novos (10)
| # | Arquivo | Repo |
|---|---------|------|
| 1 | `src/auditor-competency/dto/submit-competency-request.dto.ts` | backend |
| 2 | `src/auditor-competency/dto/review-competency-request.dto.ts` | backend |
| 3 | `src/notification/templates/competency-request.template.ts` | backend |
| 4 | `src/types/auditor.ts` | frontend |
| 5 | `src/components/competency/CompetencySection.tsx` | frontend |
| 6 | `src/components/competency/CompetencyCard.tsx` | frontend |
| 7 | `src/components/competency/CompetencyFormModal.tsx` | frontend |
| 8 | `src/components/competency/CompetencyReviewCard.tsx` | frontend |
| 9 | `src/pages/manager/PendingCompetencies.tsx` | frontend |
| 10 | migration file | backend |

### Modificados (10)
| # | Arquivo | Repo | Alteracao |
|---|---------|------|-----------|
| 1 | `prisma/schema.prisma` | backend | Enums + modelo + relacoes |
| 2 | `src/auditor-competency/auditor-competency.service.ts` | backend | 7 novos metodos |
| 3 | `src/auditor-competency/auditor-competency.controller.ts` | backend | 8 novos endpoints |
| 4 | `src/auditor-competency/auditor-competency.module.ts` | backend | Import NotificationModule |
| 5 | `src/auditor-competency/dto/index.ts` | backend | Novos exports |
| 6 | `src/notification/notification.types.ts` | backend | 3 novos tipos |
| 7 | `src/services/auditor-competency.service.ts` | frontend | 7 novos metodos |
| 8 | `src/pages/profile/UserProfile.tsx` | frontend | Secao competencias |
| 9 | `src/pages/manager/AllocationDashboard.tsx` | frontend | Card pendentes |
| 10 | `src/components/layout/Sidebar.tsx` | frontend | Item menu + badge |

### Possivelmente Modificados (2)
| # | Arquivo | Repo | Se necessario |
|---|---------|------|---------------|
| 1 | `scripts/generate-api-gateway.js` | backend | Novas rotas |
| 2 | `prisma/seeds/seed.ts` | backend | Dados de exemplo |
| 3 | `src/auditor-competency/auditor-competency.service.spec.ts` | backend | Novos testes |

---

## 9. Dependencias entre Fases

```
Fase 1 (Schema)
  └→ Fase 2 (Service/Controller)
       ├→ Fase 3 (Notificacoes)
       │    └→ integra no service da Fase 2
       ├→ Fase 4 (Testes backend)
       └→ Fase 5 (Frontend Service)
            ├→ Fase 6 (Perfil Auditor)
            └→ Fase 7 (Tela Revisao Gestor)
                 └→ Fase 8 (Dashboard)
Fase 9 (API Gateway + Seed) → apos Fase 2
```

**Paralelizaveis**:
- Fase 3 + Fase 4 (podem rodar juntas apos Fase 2)
- Fase 6 + Fase 7 (podem rodar juntas apos Fase 5)

---

## 10. Criterios de Aceite

- [ ] Auditor consegue adicionar competencia via `/perfil` e ela fica pendente
- [ ] Gestor_auditoria adiciona competencia via `/perfil` e ela e aplicada imediatamente
- [ ] Gestor_auditoria ve notificacao no sino quando auditor submete pedido
- [ ] Gestor_auditoria ve card com contagem de pendencias no dashboard
- [ ] Gestor_auditoria consegue aprovar e a competencia aparece ativa para o auditor
- [ ] Gestor_auditoria consegue rejeitar com motivo e auditor ve o motivo no perfil
- [ ] Auditor consegue cancelar pedido pendente
- [ ] Auditor consegue editar competencia existente (gera novo pedido pendente)
- [ ] Edicoes mostram diff (antes/depois) na tela de revisao
- [ ] Auditor nao consegue remover competencias (so gestor/admin)
- [ ] Testes unitarios passando para novos metodos do service
