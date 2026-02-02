# Planejamento de Correção de Endpoints

## Visão Geral

**Data:** 2026-01-23
**Total de itens:** 23 endpoints faltantes + 6 padronizações
**Estimativa total:** 5 fases

---

## Fase 1 - Manager Service (Alta Prioridade) ✅ CONCLUÍDA

**Objetivo:** Implementar endpoints críticos para gestores e comitê
**Módulo:** `src/manager/`
**Data de conclusão:** 2026-01-23

### 1.1 Dashboard Auditores
- [x] `GET /manager/dashboard/auditors` - Lista auditores com métricas

```typescript
// manager.controller.ts
@Get('dashboard/auditors')
async getDashboardAuditors() {
  return this.managerService.getAuditorsDashboard();
}
```

**Dados retornados:**
- Lista de auditores
- Auditorias em andamento por auditor
- Carga de trabalho
- Próximas auditorias agendadas

### 1.2 Sistema de Aprovações
- [x] `POST /manager/approvals/decision` - Registrar decisão de aprovação

```typescript
// DTO
interface ApprovalDecisionDto {
  processId: string;
  decision: 'approved' | 'rejected' | 'pending_committee';
  notes?: string;
  conditions?: string[];
}

// manager.controller.ts
@Post('approvals/decision')
async makeApprovalDecision(@Body() dto: ApprovalDecisionDto, @Request() req) {
  return this.managerService.makeApprovalDecision(dto, req.user.id);
}
```

### 1.3 Sistema de Comitê
- [x] `POST /manager/committee/decision` - Registrar decisão do comitê
- [x] `GET /manager/committee/decisions/:processId` - Histórico de decisões

```typescript
// DTO
interface CommitteeDecisionDto {
  processId: string;
  decision: 'approved' | 'rejected' | 'deferred';
  votingMembers: string[];
  votes: { memberId: string; vote: 'yes' | 'no' | 'abstain' }[];
  notes?: string;
  conditions?: string[];
  meetingDate: Date;
}

// manager.controller.ts
@Post('committee/decision')
async makeCommitteeDecision(@Body() dto: CommitteeDecisionDto, @Request() req) {
  return this.managerService.recordCommitteeDecision(dto, req.user.id);
}

@Get('committee/decisions/:processId')
async getCommitteeDecisions(@Param('processId') processId: string) {
  return this.managerService.getCommitteeDecisionHistory(processId);
}
```

### 1.4 Relatórios Gerenciais
- [x] `GET /manager/reports/certifications` - Relatório de certificações
- [x] `GET /manager/reports/audits` - Relatório de auditorias
- [x] `GET /manager/reports/conformity` - Relatório de conformidade

```typescript
// DTOs
interface ReportFilterDto {
  startDate?: Date;
  endDate?: Date;
  companyId?: string;
  status?: string;
  groupBy?: 'month' | 'quarter' | 'year';
}

// manager.controller.ts
@Get('reports/certifications')
async getCertificationsReport(@Query() filters: ReportFilterDto) {
  return this.managerService.generateCertificationsReport(filters);
}

@Get('reports/audits')
async getAuditsReport(@Query() filters: ReportFilterDto) {
  return this.managerService.generateAuditsReport(filters);
}

@Get('reports/conformity')
async getConformityReport(@Query() filters: ReportFilterDto) {
  return this.managerService.generateConformityReport(filters);
}
```

### Arquivos criados/modificados:
- [x] `src/manager/manager.controller.ts` - Adicionados 7 endpoints
- [x] `src/manager/manager.service.ts` - Adicionados 7 métodos
- [x] `src/manager/dto/approval-decision.dto.ts` - Criado
- [x] `src/manager/dto/committee-decision.dto.ts` - Criado
- [x] `src/manager/dto/report-filter.dto.ts` - Criado
- [x] `src/manager/dto/index.ts` - Criado (exports)

### Dependências:
- [x] Tabela `CommitteeDecision` já existia no Prisma
- [x] Relacionamento com `Process` já existia

---

## Fase 2 - Audit Service (Alta Prioridade) ✅ CONCLUÍDA

**Objetivo:** Implementar funcionalidades completas para auditores
**Módulo:** `src/audit/`
**Data de conclusão:** 2026-01-23

### 2.1 Salvar Rascunho
- [x] `PATCH /audits/:id/save` - Salvar rascunho de auditoria

```typescript
// audit.controller.ts
@Put(':id/save')
async saveAuditDraft(
  @Param('id') id: string,
  @Body() data: SaveAuditDraftDto,
  @Request() req
) {
  return this.auditService.saveDraft(id, data, req.user.id);
}
```

### 2.2 Evidências
- [x] `POST /audits/:id/evidence` - Adicionar evidências

```typescript
// audit.controller.ts
@Post(':id/evidence')
@UseInterceptors(FilesInterceptor('files'))
async uploadEvidence(
  @Param('id') id: string,
  @UploadedFiles() files: Express.Multer.File[],
  @Body() data: CreateEvidenceDto,
  @Request() req
) {
  return this.auditService.uploadEvidence(id, files, data, req.user.id);
}
```

### 2.3 Não-Conformidades
- [x] `POST /audits/:id/non-conformities` - Registrar não-conformidades

```typescript
// DTO
interface CreateNonConformityDto {
  category: 'critical' | 'major' | 'minor' | 'observation';
  clause: string;
  description: string;
  evidence?: string[];
  correctiveActionRequired: boolean;
  deadline?: Date;
}

// audit.controller.ts
@Post(':id/non-conformities')
async createNonConformity(
  @Param('id') id: string,
  @Body() dto: CreateNonConformityDto,
  @Request() req
) {
  return this.auditService.createNonConformity(id, dto, req.user.id);
}
```

### 2.4 Checklist
- [x] `GET /audits/:id/checklist` - Obter checklist da auditoria

```typescript
// audit.controller.ts
@Get(':id/checklist')
async getChecklist(@Param('id') id: string) {
  return this.auditService.getAuditChecklist(id);
}
```

### Arquivos criados/modificados:
- [x] `src/audit/audit.controller.ts` - Adicionados 4 endpoints
- [x] `src/audit/audit.service.ts` - Adicionados 4 métodos
- [x] `src/audit/dto/save-audit-draft.dto.ts` - Criado
- [x] `src/audit/dto/create-evidence.dto.ts` - Criado
- [x] `src/audit/dto/create-non-conformity.dto.ts` - Criado

### Dependências:
- [x] Evidências e NCs são armazenadas no campo JSON `findings` da tabela `Audit`
- [x] Não requer novas tabelas

---

## Fase 3 - Company Service (Média Prioridade) ✅ CONCLUÍDA

**Objetivo:** Completar funcionalidades de empresa
**Módulo:** `src/company/`
**Data de conclusão:** 2026-01-23

### 3.1 Empresa do Usuário Logado
- [x] `GET /companies/me` - Retorna empresa do usuário autenticado

```typescript
// company.controller.ts
@Get('me')
@UseGuards(JwtAuthGuard)
async getMyCompany(@Request() req) {
  return this.companyService.findByUserId(req.user.id);
}
```

### 3.2 Gestão de Grupos
- [x] `POST /companies/:id/add-to-group` - Adicionar empresa a grupo
- [x] `POST /companies/:id/remove-from-group` - Remover empresa de grupo

```typescript
// company.controller.ts
@Post(':id/add-to-group')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'gestor')
async addToGroup(
  @Param('id') id: string,
  @Body() dto: { groupId: string }
) {
  return this.companyService.addToGroup(id, dto.groupId);
}

@Post(':id/remove-from-group')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'gestor')
async removeFromGroup(@Param('id') id: string) {
  return this.companyService.removeFromGroup(id);
}
```

### Arquivos criados/modificados:
- [x] `src/company/company.controller.ts` - Adicionados 3 endpoints
- [x] `src/company/company.service.ts` - Adicionados 3 métodos

---

## Fase 4 - Document & Contract (Média Prioridade) ✅ CONCLUÍDA

**Objetivo:** Completar funcionalidades de documentos e contratos
**Módulos:** `src/document/`, `src/contract/`
**Data de conclusão:** 2026-01-23

### 4.1 Document Service

- [x] `POST /documents/upload-multiple` - Upload múltiplos documentos
- [x] `PATCH /documents/:id/validate` - Validar documento

```typescript
// document.controller.ts
@Post('upload-multiple')
@UseInterceptors(FilesInterceptor('files', 10))
async uploadMultiple(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() dto: UploadDocumentsDto,
  @Request() req
) {
  return this.documentService.uploadMultiple(files, dto, req.user.id);
}

@Patch(':id/validate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('analista', 'gestor')
async validateDocument(
  @Param('id') id: string,
  @Body() dto: ValidateDocumentDto,
  @Request() req
) {
  return this.documentService.validate(id, dto, req.user.id);
}
```

### 4.2 Contract Service

- [x] `POST /contracts/:id/generate-pdf` - Gerar PDF do contrato
- [x] `POST /contracts/:id/send-for-signature` - Enviar para assinatura

```typescript
// contract.controller.ts
@Post(':id/generate-pdf')
async generatePdf(@Param('id') id: string) {
  return this.contractService.generatePdf(id);
}

@Post(':id/send-for-signature')
async sendForSignature(
  @Param('id') id: string,
  @Body() dto?: SendForSignatureDto
) {
  return this.contractService.sendForESignature(id, dto);
}
```

### Arquivos criados/modificados:
- [x] `src/document/document.controller.ts` - Adicionados 2 endpoints
- [x] `src/document/document.service.ts` - Adicionados 2 métodos
- [x] `src/contract/contract.controller.ts` - Adicionados 2 endpoints
- [x] `src/contract/contract.service.ts` - Adicionados 2 métodos

### Dependências:
- PDF generation: Implementado estrutura de dados para geração (biblioteca pdfkit pode ser adicionada)
- E-signature: Implementado integração com ESignatureConfig

---

## Fase 5 - Plant & Padronizações (Baixa Prioridade) ✅ CONCLUÍDA

**Objetivo:** Completar Plant e padronizar rotas/métodos
**Módulos:** Diversos
**Data de conclusão:** 2026-01-23

### 5.1 Plant Service

- [x] `DELETE /plants/:id/permanent` - Exclusão permanente
- [x] `GET /plants/check-code` - Validar código único

```typescript
// plant.controller.ts
@Delete(':id/permanent')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async permanentDelete(@Param('id') id: string) {
  return this.plantService.permanentDelete(id);
}

@Get('check-code')
async checkCodeAvailability(
  @Query('code') code: string,
  @Query('companyId') companyId: string,
  @Query('excludePlantId') excludePlantId?: string
) {
  return this.plantService.checkCodeAvailability(code, companyId, excludePlantId);
}
```

### 5.2 Padronização de Rotas

#### Storage Config (singular + plural)
- [x] Adicionado alias `storage-configs` mantendo backward compatibility

```typescript
// storage-config.controller.ts
@Controller(['storage-config', 'storage-configs']) // Ambas as rotas funcionam
export class StorageConfigController {
  // ...
}
```

#### Comercial/Pricing Table
- [x] Adicionados endpoints de pricing-table no comercial.controller

```typescript
// comercial.controller.ts
@Get('pricing-table')
async listPricingTables() { ... }

@Get('pricing-table/active')
async getActivePricingTable() { ... }

@Get('pricing-table/:id')
async getPricingTableById(@Param('id') id: string) { ... }

@Post('pricing-table')
async createPricingTable(@Body() dto: CreatePricingTableDto) { ... }

@Patch('pricing-table/:id')
async updatePricingTable(@Param('id') id: string, @Body() dto: UpdatePricingTableDto) { ... }

@Get('pricing-table/compare/:id1/:id2')
async comparePricingTables(@Param('id1') id1: string, @Param('id2') id2: string) { ... }
```

### 5.3 Padronização de Métodos HTTP

**Decisão:** Backend aceita tanto POST quanto PATCH para operações de workflow.
Os métodos atuais do backend já utilizam PATCH para operações de estado, mantendo compatibilidade.

### Arquivos criados/modificados:
- [x] `src/plant/plant.controller.ts` - Adicionados 2 endpoints
- [x] `src/plant/plant.service.ts` - Adicionados 2 métodos
- [x] `src/storage-config/storage-config.controller.ts` - Adicionado alias plural
- [x] `src/comercial/comercial.controller.ts` - Adicionados 6 endpoints de pricing-table

---

## Cronograma Sugerido

```
┌─────────────────────────────────────────────────────────────┐
│                    CRONOGRAMA DE EXECUÇÃO                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Fase 1 - Manager Service                                   │
│  ████████████████████                                       │
│  7 endpoints | Alta prioridade                              │
│                                                             │
│  Fase 2 - Audit Service                                     │
│  ██████████████                                             │
│  4 endpoints | Alta prioridade                              │
│                                                             │
│  Fase 3 - Company Service                                   │
│  ████████                                                   │
│  3 endpoints | Média prioridade                             │
│                                                             │
│  Fase 4 - Document & Contract                               │
│  ████████                                                   │
│  4 endpoints | Média prioridade                             │
│                                                             │
│  Fase 5 - Plant & Padronizações                             │
│  ██████████                                                 │
│  2 endpoints + padronizações | Baixa prioridade             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Checklist de Implementação

### Fase 1 - Manager Service ✅
- [x] Criar `dto/approval-decision.dto.ts`
- [x] Criar `dto/committee-decision.dto.ts`
- [x] Criar `dto/report-filter.dto.ts`
- [x] Implementar `GET /manager/dashboard/auditors`
- [x] Implementar `POST /manager/approvals/decision`
- [x] Implementar `POST /manager/committee/decision`
- [x] Implementar `GET /manager/committee/decisions/:processId`
- [x] Implementar `GET /manager/reports/certifications`
- [x] Implementar `GET /manager/reports/audits`
- [x] Implementar `GET /manager/reports/conformity`
- [x] Criar/atualizar migration Prisma se necessário
- [ ] Testes unitários
- [ ] Testes de integração

### Fase 2 - Audit Service ✅
- [x] Criar `dto/save-audit-draft.dto.ts`
- [x] Criar `dto/create-evidence.dto.ts`
- [x] Criar `dto/create-non-conformity.dto.ts`
- [x] Implementar `PATCH /audits/:id/save`
- [x] Implementar `POST /audits/:id/evidence`
- [x] Implementar `POST /audits/:id/non-conformities`
- [x] Implementar `GET /audits/:id/checklist`
- [x] Criar/atualizar migration Prisma se necessário
- [ ] Testes unitários
- [ ] Testes de integração

### Fase 3 - Company Service ✅
- [x] Implementar `GET /companies/me`
- [x] Implementar `POST /companies/:id/add-to-group`
- [x] Implementar `POST /companies/:id/remove-from-group`
- [ ] Testes unitários
- [ ] Testes de integração

### Fase 4 - Document & Contract ✅
- [x] Implementar `POST /documents/upload-multiple`
- [x] Implementar `PATCH /documents/:id/validate`
- [x] Implementar `POST /contracts/:id/generate-pdf`
- [x] Implementar `POST /contracts/:id/send-for-signature`
- [ ] Testes unitários
- [ ] Testes de integração

### Fase 5 - Plant & Padronizações ✅
- [x] Implementar `DELETE /plants/:id/permanent`
- [x] Implementar `GET /plants/check-code`
- [x] Padronizar rota storage-config (alias plural adicionado)
- [x] Adicionar aliases pricing-table no comercial
- [x] Padronizar métodos HTTP (backend aceita PATCH)
- [ ] Testes de regressão
- [ ] Atualizar documentação OpenAPI/Swagger

---

## Considerações Finais

### Banco de Dados
Verificar se as seguintes tabelas/campos existem no Prisma:
- `CommitteeDecision` - Para decisões do comitê
- `AuditEvidence` - Para evidências de auditoria
- `NonConformity` - Para não-conformidades
- `AuditChecklist` / `ChecklistItem` - Para checklist

### Testes
- Cada fase deve incluir testes unitários e de integração
- Testar integração frontend-backend após cada fase

### Documentação
- Atualizar OpenAPI/Swagger após cada fase
- Atualizar CLAUDE.md com novos endpoints

### Deploy
- Deploy incremental por fase
- Manter backward compatibility durante transição
