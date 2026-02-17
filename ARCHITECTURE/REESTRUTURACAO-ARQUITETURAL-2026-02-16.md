# Reestruturacao Arquitetural - 16/02/2026

**Status:** COMPLETA
**Versao:** 1.0
**Data:** 16/02/2026

---

## Resumo

Unificacao de duas arquiteturas paralelas (legado Request/Process + nova Certification) em uma unica arquitetura com **Certification como aggregate root**.

## O Que Mudou

### Modelos Removidos
- `Request` - substituido por `CertificationRequest`
- `Process` - substituido por `RequestWorkflow`
- `ProcessHistory` - substituido por `CertificationHistory`
- `ProcessPhaseHistory` - substituido por `WorkflowPhaseHistory`
- `ProcessStatus` enum - substituido por `WorkflowStatus` enum

### Modelos Adicionados
- `Product` - catalogo de produtos no nivel da Company (prepara exportacao)
- `WorkflowPhaseHistory` - tracking de tempo por fase do workflow

### FK Principal Invertida
Todos os modelos dependentes agora usam `certificationId` como FK principal (antes era `processId`):

| Modelo | Antes | Depois |
|--------|-------|--------|
| Certificate | processId (required) | certificationId (required) |
| Audit | processId (required) | certificationId (required) |
| Proposal | processId (required) | certificationId (required) |
| Contract | processId (required) | certificationId (required) |
| CommitteeDecision | processId (required) | certificationId (required) |
| AiAnalysis | processId (required) | certificationId (required) |

### Company.groupId Obrigatorio
- Toda `Company` agora DEVE pertencer a um `CompanyGroup`
- Auto-criacao: se nao informado, um grupo e criado automaticamente com o nome da empresa
- `CompanyGroup.headquartersId` removido → substituido por `Company.isHeadquarters` (boolean)

### WorkflowService como Engine Central
- `canAdvancePhase()` com validacoes por fase
- Tracking de `WorkflowPhaseHistory` (tempo em cada fase)
- Bridge mechanism removido

## Fluxo Atual

```
Certification (aggregate root)
  └── CertificationRequest (solicitacao)
        └── RequestWorkflow (workflow com 17 fases)
              └── WorkflowPhaseHistory (tracking por fase)
  └── CertificationScope
        └── ScopeProduct, ScopeFacility, ScopeBrand, ScopeSupplier
  └── CertificationHistory (timeline)
```

## Modulos Backend Removidos
- `src/request/` (~1.900 linhas) - DELETADO
- `src/process/` (~3.000 linhas) - DELETADO
- Imports removidos de `app.module.ts`

## Frontend Limpo
- `NewRequestWizard.tsx` - DELETADO (1.085 linhas)
- `ProcessDetails.tsx` - DELETADO (594 linhas)
- `ProcessList.tsx` - DELETADO (392 linhas)
- `process.service.ts` - DELETADO (192 linhas)
- Rotas `/solicitacoes` e `/processos` removidas
- Sidebar e dashboards atualizados

## Migracoes de Banco
1. `restructure` - adiciona novos modelos e campos
2. `make-optional` - torna processId opcional durante transicao
3. `remove-legacy` - remove modelos e campos legados

## Testes Apos Reestruturacao
- **541 testes unitarios passando** (20 suites)
- **6 arquivos E2E corrigidos** para nova arquitetura
- **4 arquivos E2E legados deletados** (process, request, auditor-allocation, contract)
- Zero erros TypeScript em `src/` e `test/`

## Schema Atual (Referencia Rapida)

### CompanyGroup
```prisma
model CompanyGroup {
  id, name, tradeName?, document?,
  contactName?, contactEmail?, contactPhone?,
  companies[], sharedSuppliers[], corporateDocuments[]
}
```

### Company (campos obrigatorios)
```
groupId (REQUIRED), cnpj, razaoSocial,
isHeadquarters (boolean), pendingValidation (boolean)
```

### Plant (campos obrigatorios)
```
companyId, code, codeType (PlantCodeType enum), name, address, country
```

### UserInvite
```
companyId, email, token, status (InviteStatus), expiresAt, invitedBy
// InviteStatus: pending, accepted, expired, cancelled
```

## Seed Data
- **Senha**: `A123456!` (todos os usuarios)
- **12 roles**: admin, empresa, analista, auditor, gestor, comercial, juridico, financeiro, gestor_auditoria, supervisor, controlador, secretaria
- **Empresa teste**: "Empresa Teste Halal LTDA" (CNPJ 12345678000199)
- **Planta**: SIF 1234 - Unidade Principal SP

---

## Checklist de Validacao Manual

### Login (todos os perfis)
- [ ] admin@halalsphere.com
- [ ] teste@empresa.com
- [ ] analista@halalsphere.com
- [ ] auditor@halalsphere.com
- [ ] gestor@halalsphere.com
- [ ] comercial@halalsphere.com

### Fluxo de Certificacao
- [ ] Criar empresa (verificar auto-criacao de grupo)
- [ ] Cadastrar produtos no catalogo
- [ ] Criar certificacao (wizard)
- [ ] Verificar Certification + CertificationRequest + RequestWorkflow criados
- [ ] Avancar fases (verificar validacoes)
- [ ] Dashboard empresa mostra dados corretos
- [ ] Dashboard analista mostra workflows no kanban
- [ ] Sidebar tem navegacao limpa (sem /solicitacoes, /processos)
