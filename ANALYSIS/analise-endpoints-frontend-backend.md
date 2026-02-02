# Análise de Endpoints - Frontend vs Backend

## Resumo
Data da análise: 2026-01-23
**Última atualização:** 2026-01-23

Este documento apresenta a comparação entre os endpoints chamados pelo frontend e os implementados no backend, identificando discrepâncias e endpoints faltantes.

### Progresso de Implementação
- ✅ **Manager Service** - 7 endpoints implementados (2026-01-23)
- ✅ **Audit Service** - 4 endpoints implementados (2026-01-23)
- ✅ **Company Service** - 3 endpoints implementados (2026-01-23)
- ⏳ **Document & Contract** - 4 endpoints pendentes
- ⏳ **Plant & Padronizações** - 2 endpoints + ajustes pendentes

---

## 1. ENDPOINTS FALTANTES NO BACKEND

### 1.1 Company Service (`/companies/*`) ✅ IMPLEMENTADO (2026-01-23)

| Endpoint Frontend | Método | Status Backend | Observação |
|------------------|--------|----------------|------------|
| `/companies/me` | GET | ✅ IMPLEMENTADO | Retorna empresa do usuário logado |
| `/companies/search` | GET | ⚠️ DIFERENTE | Backend tem `/companies/search/query` |
| `/companies/group/:groupId` | GET | ⚠️ DIFERENTE | Usar `/company-groups/:id/companies` |
| `/companies/:id/add-to-group` | POST | ✅ IMPLEMENTADO | Adicionar empresa a grupo |
| `/companies/:id/remove-from-group` | POST | ✅ IMPLEMENTADO | Remover empresa de grupo |

### 1.2 Manager Service (`/manager/*`) ✅ IMPLEMENTADO (2026-01-23)

| Endpoint Frontend | Método | Status Backend | Observação |
|------------------|--------|----------------|------------|
| `/manager/dashboard/auditors` | GET | ✅ IMPLEMENTADO | Lista auditores no dashboard |
| `/manager/approvals/decision` | POST | ✅ IMPLEMENTADO | Decisão de aprovação |
| `/manager/committee/decision` | POST | ✅ IMPLEMENTADO | Decisão do comitê |
| `/manager/committee/decisions/:processId` | GET | ✅ IMPLEMENTADO | Histórico decisões comitê |
| `/manager/reports/certifications` | GET | ✅ IMPLEMENTADO | Relatório certificações |
| `/manager/reports/audits` | GET | ✅ IMPLEMENTADO | Relatório auditorias |
| `/manager/reports/conformity` | GET | ✅ IMPLEMENTADO | Relatório conformidade |

### 1.3 Plant Service (`/plants/*`)

| Endpoint Frontend | Método | Status Backend | Observação |
|------------------|--------|----------------|------------|
| `/plants/:id/permanent` | DELETE | ❌ FALTANDO | Exclusão permanente |
| `/plants/check-code` | GET | ❌ FALTANDO | Validar código único |

### 1.4 Audit Service (`/audits/*`) ✅ IMPLEMENTADO (2026-01-23)

| Endpoint Frontend | Método | Status Backend | Observação |
|------------------|--------|----------------|------------|
| `/audits/:id/save` | PATCH | ✅ IMPLEMENTADO | Salvar rascunho de auditoria |
| `/audits/:id/submit` | POST | ⚠️ N/A | Usar `/audits/:id/complete` existente |
| `/audits/:id/evidence` | POST | ✅ IMPLEMENTADO | Adicionar evidências |
| `/audits/:id/non-conformities` | POST | ✅ IMPLEMENTADO | Registrar não-conformidades |
| `/audits/:id/checklist` | GET | ✅ IMPLEMENTADO | Obter checklist da auditoria |

### 1.5 Contract Service (`/contracts/*`)

| Endpoint Frontend | Método | Status Backend | Observação |
|------------------|--------|----------------|------------|
| `/contracts/:id/generate-pdf` | POST | ❌ FALTANDO | Gerar PDF do contrato |
| `/contracts/:id/send-for-signature` | POST | ❌ FALTANDO | Enviar para assinatura eletrônica |

### 1.6 Document Service (`/documents/*`)

| Endpoint Frontend | Método | Status Backend | Observação |
|------------------|--------|----------------|------------|
| `/documents/upload-multiple` | POST | ❌ FALTANDO | Upload múltiplos documentos |
| `/documents/:id/validate` | PATCH | ❌ FALTANDO | Validar documento |

---

## 2. DISCREPÂNCIAS DE ROTA/MÉTODO

### 2.1 Storage Config - Nome da rota diferente

| Frontend | Backend |
|----------|---------|
| `/storage-configs` (plural) | `/storage-config` (singular) |

**Ação:** Padronizar para plural no backend ou atualizar frontend

### 2.2 Pricing Table - Rota diferente

| Frontend | Backend |
|----------|---------|
| `/comercial/pricing-table/*` | `/proposals/pricing-tables/*` |

**Ação:** Criar aliases no comercial.controller ou atualizar frontend

### 2.3 Contract Service - Métodos diferentes

| Endpoint | Frontend | Backend |
|----------|----------|---------|
| `/contracts/:id/send` | POST | PATCH |
| `/contracts/:id/sign` | POST | PATCH |
| `/contracts/:id/cancel` | POST | PATCH |
| `/contracts/:id/negotiate` | POST | PATCH |

**Ação:** Padronizar métodos HTTP

### 2.4 Proposal Service - Métodos diferentes

| Endpoint | Frontend | Backend |
|----------|----------|---------|
| `/proposals/:id/adjust` | PUT | PATCH |
| `/proposals/:id/respond` | PUT | PATCH |
| `/proposals/:id/recalculate` | PUT | PATCH |

**Ação:** Padronizar métodos HTTP

### 2.5 Shared Suppliers - Métodos diferentes

| Endpoint | Frontend | Backend |
|----------|----------|---------|
| `/shared-suppliers/:id/approve` | POST | PATCH |
| `/shared-suppliers/:id/reject` | POST | PATCH |
| `/shared-suppliers/:id/suspend` | POST | PATCH |

**Ação:** Padronizar métodos HTTP

### 2.6 Company Groups - Headquarters

| Frontend | Backend |
|----------|---------|
| `PATCH /company-groups/:id/headquarters` com body `{ companyId }` | `PATCH /:id/headquarters/:companyId` |

**Ação:** Padronizar padrão de rota

---

## 3. BACKEND CONTROLLERS IMPLEMENTADOS (34 controllers)

| Controller | Rota Base | Status |
|------------|-----------|--------|
| admin.controller.ts | `/admin` | ✅ |
| access-request.controller.ts | `/access-requests` | ✅ |
| ai.controller.ts | `/ai` | ✅ |
| app.controller.ts | `/` | ✅ |
| audit.controller.ts | `/audits` | ⚠️ Parcial |
| auditor-allocation.controller.ts | `/auditor-allocation` | ✅ |
| auth.controller.ts | `/auth` | ✅ |
| certificate.controller.ts | `/certificates` | ✅ |
| certification.controller.ts | `/certifications` | ✅ |
| certification-request.controller.ts | `/certification-requests` | ✅ |
| certification-scope.controller.ts | `/certifications/:id/scope` | ✅ |
| cnpj-lookup.controller.ts | `/cnpj-lookup` | ✅ |
| comment.controller.ts | `/comments` | ✅ |
| comercial.controller.ts | `/comercial` | ⚠️ Falta pricing-table |
| company.controller.ts | `/companies` | ⚠️ Parcial |
| company-group.controller.ts | `/company-groups` | ✅ |
| contract.controller.ts | `/contracts` | ⚠️ Parcial |
| corporate-document.controller.ts | `/corporate-documents` | ✅ |
| document.controller.ts | `/documents` | ⚠️ Parcial |
| document-request.controller.ts | `/document-requests` | ✅ |
| e-signature-config.controller.ts | `/e-signature-config` | ✅ |
| health.controller.ts | `/health` | ✅ |
| industrial-classification.controller.ts | `/industrial-classification` | ✅ |
| juridico.controller.ts | `/juridico` | ✅ |
| manager.controller.ts | `/manager` | ⚠️ Parcial |
| plant.controller.ts | `/plants` | ⚠️ Parcial |
| process.controller.ts | `/processes` | ✅ |
| proposal.controller.ts | `/proposals` | ✅ |
| reports.controller.ts | `/reports` | ✅ |
| request.controller.ts | `/requests` | ✅ |
| shared-supplier.controller.ts | `/shared-suppliers` | ✅ |
| storage-config.controller.ts | `/storage-config` | ⚠️ Nome diferente |
| user.controller.ts | `/users` | ✅ |
| user-invite.controller.ts | `/invites` | ✅ |
| workflow.controller.ts | `/workflows` | ✅ |

---

## 4. PRIORIZAÇÃO DE IMPLEMENTAÇÃO

### Alta Prioridade (Funcionalidades core)

1. **Manager Service endpoints** - Gestores precisam dessas funcionalidades
   - `/manager/dashboard/auditors`
   - `/manager/approvals/decision`
   - `/manager/committee/decision`
   - `/manager/committee/decisions/:processId`
   - `/manager/reports/*`

2. **Audit endpoints** - Crítico para auditores
   - `/audits/:id/evidence`
   - `/audits/:id/non-conformities`
   - `/audits/:id/checklist`
   - `/audits/:id/save`

3. **Document validation**
   - `/documents/:id/validate`

### Média Prioridade

4. **Company endpoints**
   - `/companies/me`
   - `/companies/:id/add-to-group`
   - `/companies/:id/remove-from-group`

5. **Contract endpoints**
   - `/contracts/:id/generate-pdf`
   - `/contracts/:id/send-for-signature`

### Baixa Prioridade (Ajustes de padronização)

6. **Padronização de rotas**
   - Renomear `/storage-config` para `/storage-configs`
   - Adicionar aliases no comercial para pricing-table

7. **Padronização de métodos HTTP**
   - Ajustar POST/PUT vs PATCH

---

## 5. AÇÕES RECOMENDADAS

### 5.1 Backend - Implementar endpoints faltantes

```typescript
// 1. Adicionar em manager.controller.ts
@Get('dashboard/auditors')
@Get('approvals/decision') // POST
@Get('committee/decision') // POST
@Get('committee/decisions/:processId')
@Get('reports/certifications')
@Get('reports/audits')
@Get('reports/conformity')

// 2. Adicionar em audit.controller.ts
@Put(':id/save')
@Post(':id/evidence')
@Post(':id/non-conformities')
@Get(':id/checklist')

// 3. Adicionar em company.controller.ts
@Get('me')
@Post(':id/add-to-group')
@Post(':id/remove-from-group')

// 4. Adicionar em document.controller.ts
@Post('upload-multiple')
@Patch(':id/validate')

// 5. Adicionar em contract.controller.ts
@Post(':id/generate-pdf')
@Post(':id/send-for-signature')

// 6. Adicionar em plant.controller.ts
@Delete(':id/permanent')
@Get('check-code')
```

### 5.2 Frontend - Ajustar chamadas

```typescript
// Ajustar métodos HTTP para compatibilidade
// contracts: POST -> PATCH
// proposals: PUT -> PATCH
// shared-suppliers: POST -> PATCH

// OU manter POST/PUT no frontend e aceitar ambos no backend
```

---

## 6. CONCLUSÃO

**Total de endpoints faltantes identificados:** 23

- **Críticos (bloqueiam funcionalidades):** 11
- **Importantes (afetam UX):** 7
- **Ajustes de padronização:** 5

A maioria das discrepâncias está no módulo **Manager** (relatórios e decisões) e no módulo **Audit** (funcionalidades do auditor).

Recomenda-se priorizar a implementação dos endpoints do Manager e Audit, pois são funcionalidades essenciais para os papéis de gestão e auditoria no sistema.
