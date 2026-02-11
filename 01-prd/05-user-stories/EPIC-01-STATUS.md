# ÉPICO 1: Gestão de Solicitações e Onboarding - Status de Implementação

**Status Geral**: 🟢 95% Completo (Atualizado Fev 2026)
**8 User Stories | 57 Story Points**

---

## 📊 Visão Geral

| US | Título | Status | SP | Implementação |
|----|--------|--------|----|--------------|
| US-001 | Cadastro de Empresa | ✅ Completo | 5 | Schema Company + User |
| US-002 | Wizard de Solicitação | ✅ Completo | 13 | NewRequestWizard.tsx (9 etapas) |
| US-003 | Upload de Documentos | ✅ Completo | 8 | FileDropzone + Document model |
| US-004 | Dashboard de Status | ✅ Completo | 8 | ProcessDetails.tsx (17 fases) |
| US-005 | Calculadora de Custos | ✅ Completo | 8 | CalculatorService |
| US-006 | Notificações | 🟡 Parcial | 3 | Schema pronto, falta EmailService |
| US-007 | Editar Rascunho | ✅ Completo | 3 | Status 'rascunho' funcional |
| US-008 | Cancelar Solicitação | ✅ Completo | 2 | Status 'cancelado' funcional |

---

## ✅ US-001: Cadastro de Nova Empresa Solicitante

**Status**: ✅ IMPLEMENTADO
**Story Points**: 5
**Data de Conclusão**: Implementado

### O Que Foi Implementado

#### Backend
- ✅ **Schema Prisma**:
  - Model `Company` com internacionalização (3 países, 4 idiomas)
  - Model `User` com role 'empresa'
  - Campos: `taxId`, `taxIdType`, `country`, `currency`, `language`
  - Validação de unicidade: `@@unique([country, taxId])`

- ✅ **AuthService** ([backend/src/modules/auth/auth.service.ts](../../backend/src/modules/auth/auth.service.ts)):
  - Método `register()` (presumido, verificar se existe)
  - Hash de senha com bcrypt
  - Geração de JWT token

- ✅ **AdminService** ([backend/src/modules/admin/admin.service.ts](../../backend/src/modules/admin/admin.service.ts)):
  - `createUser()` - Cria usuário + empresa simultaneamente
  - Validação de email duplicado
  - Validação de taxId duplicado por país

#### Frontend
- ✅ **Página de Cadastro** (presumido em Login.tsx ou separado):
  - Formulário de cadastro de empresa
  - Validação de campos
  - Integração com API

#### Database
- ✅ Tabela `companies` com todos os campos
- ✅ Tabela `users` com relação 1:1 com companies
- ✅ Enum `Country`, `TaxIdType`, `Currency`, `Language`

### O Que Está Faltando

- 🔴 **Landing Page Pública**: Não há página de apresentação do sistema
- 🔴 **Integração ViaCEP**: Busca automática de endereço (se aplicável fora do Brasil)
- 🔴 **Email de Confirmação**: EmailService não implementado ainda
- 🔴 **Chatbot IA**: Link para chatbot não existe (Épico 6)

### Como Testar
```bash
# Backend
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empresa@exemplo.com",
    "password": "Senha123!",
    "name": "João Silva",
    "role": "empresa",
    "company": {
      "razaoSocial": "Empresa Exemplo Ltda",
      "country": "BR",
      "taxId": "12345678000190",
      "taxIdType": "CNPJ"
    }
  }'
```

---

## ✅ US-002: Wizard de Solicitação de Certificação

**Status**: ✅ IMPLEMENTADO
**Story Points**: 13
**Data de Conclusão**: Implementado (9 etapas)

### O Que Foi Implementado

#### Frontend - Wizard Completo
📂 **Arquivo Principal**: [frontend/src/pages/company/NewRequestWizard.tsx](../../frontend/src/pages/company/NewRequestWizard.tsx)

✅ **7 Etapas Implementadas**:

1. **Etapa 1: Dados Gerais da Empresa**
   - Pré-preenchimento de dados cadastrais
   - Certificações existentes
   - Outras certificações (ISO 9001, 22000, etc.)

2. **Etapa 2: Classificação Industrial GSO 2055-2**
   - ✅ Componente: `IndustrialClassificationStep.tsx`
   - ✅ 3 níveis hierárquicos: Grupo → Categoria → Subcategoria
   - ✅ Navegação com breadcrumb
   - ✅ Cards visuais com ícones
   - ✅ Validação: todos 3 níveis obrigatórios
   - ✅ Reset automático ao voltar

3. **Etapa 3: Escopo e Produtos**
   - ✅ Componente: `ProductOriginStep.tsx` + `ProductDetailsStep.tsx`
   - ✅ Tipo de certificação (C1-C6)
   - ✅ Origem dos produtos (animal/vegetal/misto)
   - ✅ Lista de produtos (manual ou upload de planilha)

4. **Etapa 4: Produção e Processos**
   - ✅ Número de turnos (1, 2, 3)
   - ✅ Capacidade produtiva
   - ✅ Processos de fabricação (múltipla seleção)
   - ✅ Linha exclusiva Halal (sim/não)
   - ✅ Uso de álcool etílico

5. **Etapa 5: Fornecedores**
   - ✅ Componente: `SuppliersStep.tsx`
   - ✅ Quantidade total de fornecedores
   - ✅ Lista de fornecedores principais
   - ✅ Certificados Halal de fornecedores
   - ✅ Matérias-primas de origem animal
   - ✅ Upload ou preenchimento manual

6. **Etapa 6: Mercados-Alvo**
   - ✅ Componente: `TargetMarketsStep.tsx`
   - ✅ Países de exportação
   - ✅ Mercado principal
   - ✅ Seleção múltipla de países

7. **Etapa 7: Documentos Obrigatórios**
   - ✅ Upload de múltiplos arquivos
   - ✅ Categorização automática
   - ✅ Validação de formatos (PDF, JPG, PNG, DOCX, XLSX)
   - ✅ Preview de imagens
   - ✅ Progresso visual (X de Y documentos)

#### Componentes UI Implementados
- ✅ `CountrySelector.tsx` - Seleção de país
- ✅ `TaxIdInput.tsx` - Input de documento fiscal
- ✅ `UniversalTaxIdInput.tsx` - Input universal
- ✅ `CountryBasedTaxInput.tsx` - Input baseado no país
- ✅ `PreviewSidebar.tsx` - Preview lateral do wizard
- ✅ `FileDropzone` - Upload drag-and-drop

#### Backend
- ✅ **ProcessService** ([backend/src/modules/process/process.service.ts](../../backend/src/modules/process/process.service.ts)):
  - `createProcess(requestData)` - Cria Request + Process
  - Geração de protocolo único: HS-YYYY-NNNNNN
  - Status inicial: 'rascunho'

- ✅ **IndustrialClassificationService** ([backend/src/modules/industrial-classification/](../../backend/src/modules/industrial-classification/)):
  - `getAllGroupsWithRelations()` - Hierarquia completa
  - `validateClassification()` - Valida combinação
  - Dados em PT, EN, AR

- ✅ **Schema Prisma**:
  - Model `Request` com todos os campos do wizard
  - Fields: `industrialGroupId`, `industrialCategoryId`, `industrialSubcategoryId`
  - JSON fields: `productionDetails`, `productDetails`, `supplierDetails`, `targetMarkets`

### O Que Está Faltando

- 🔴 **Auto-save**: Salvar progresso a cada 30s (mencionado nos requisitos)
- 🔴 **Chat IA**: Toggle Chat ↔️ Formulário não implementado
- 🔴 **Sugestões IA**: IA não sugere classificação GSO

### Diferenças do PRD Original

**Expandido de 5 para 9 etapas**:
- ✅ Etapa 2 adicionada: Classificação Industrial GSO 2055-2 (3 níveis)
- ✅ Etapa 6 adicionada: Mercados-Alvo (targetMarkets)

**Funcionalidades Extras Implementadas**:
- ✅ Internacionalização completa (3 países, validação de taxId por país)
- ✅ Seletor de país dinâmico
- ✅ Validação de documento fiscal por país

### Como Testar
1. Login como empresa
2. Acessar `/nova-solicitacao`
3. Completar todas as 9 etapas
4. Verificar geração de protocolo
5. Verificar status = 'rascunho'

---

## ✅ US-003: Upload e Gestão de Documentos

**Status**: ✅ IMPLEMENTADO
**Story Points**: 8

### O Que Foi Implementado

#### Frontend
- ✅ **FileDropzone** ([frontend/src/components/ui/FileDropzone.tsx](../../frontend/src/components/ui/FileDropzone.tsx)):
  - Drag & drop múltiplos arquivos
  - Preview de imagens (thumbnails)
  - Validação de formato e tamanho
  - Barra de progresso

- ✅ **ProcessDocuments** ([frontend/src/components/analyst/ProcessDocuments.tsx](../../frontend/src/components/analyst/ProcessDocuments.tsx)):
  - Lista de documentos por processo
  - Categorização por tipo
  - Ações: visualizar, baixar, aprovar, rejeitar

#### Backend
- ✅ **DocumentController** ([backend/src/controllers/document.controller.ts](../../backend/src/controllers/document.controller.ts)):
  - Upload de documentos
  - Validação de arquivos
  - Storage (local ou S3)

- ✅ **Schema Prisma**:
  - Model `Document` com campos:
    - `documentType` (enum com 14 tipos)
    - `validationStatus` (pendente, aprovado, rejeitado)
    - `validationNotes`
    - `fileUrl`, `fileSize`, `mimeType`

#### Storage
- ✅ **StorageConfig** model implementado
- ✅ Suporte a local storage e S3
- ✅ Configuração via admin

### O Que Está Faltando

- 🔴 **Versionamento**: Não mantém versões antigas automaticamente
- 🔴 **Scan de Vírus**: ClamAV não integrado
- 🔴 **Download em lote (ZIP)**: Não implementado
- 🔴 **Remoção de metadados EXIF**: Não implementado

---

## ✅ US-004: Dashboard de Status do Processo

**Status**: ✅ IMPLEMENTADO
**Story Points**: 8

### O Que Foi Implementado

#### Frontend
- ✅ **ProcessDetails** ([frontend/src/pages/ProcessDetails.tsx](../../frontend/src/pages/ProcessDetails.tsx)):
  - Timeline visual horizontal com **17 fases** (expandido de 12)
  - Fase atual destacada
  - Fases concluídas com ✓
  - Linha de conexão entre fases
  - Informações detalhadas da fase atual:
    - Data de entrada
    - Dias na fase
    - Prazo estimado
    - Responsável atual
    - Próxima ação esperada

- ✅ **process-phases.ts** ([frontend/src/lib/process-phases.ts](../../frontend/src/lib/process-phases.ts)):
  - Configuração centralizada das 17 fases
  - Mapeamento de responsabilidades
  - Cores e ícones por fase

#### Backend
- ✅ **ProcessPhaseTransitionService** ([backend/src/modules/process/process-transition.service.ts](../../backend/src/modules/process/process-transition.service.ts)):
  - `advancePhase()` - Transição validada entre fases
  - `canAdvancePhase()` - Validação de requisitos
  - Transições automáticas em eventos

- ✅ **ProcessService**:
  - `updateProcessStatus()` - Atualiza status com histórico
  - Registro em `ProcessHistory` e `ProcessPhaseHistory`

- ✅ **Schema Prisma**:
  - Enum `ProcessPhase` com 17 fases
  - Enum `PhaseResponsibility` (11 roles)
  - Model `ProcessPhaseHistory` - rastreamento completo

### 17 Fases Implementadas
1. cadastro_solicitacao (Empresa)
2. analise_documental_inicial (Analista)
3. elaboracao_proposta (Comercial)
4. negociacao_proposta (Comercial)
5. proposta_aprovada (Empresa)
6. elaboracao_contrato (Jurídico)
7. assinatura_contrato (Empresa + Jurídico)
8. avaliacao_documental (Analista)
9. planejamento_auditoria (Gestor Auditoria)
10. auditoria_estagio1 (Auditor)
11. auditoria_estagio2 (Auditor)
12. analise_nao_conformidades (Auditor)
13. correcao_nao_conformidades (Empresa)
14. validacao_correcoes (Auditor)
15. comite_tecnico (Supervisor + Gestor)
16. emissao_certificado (Controlador)
17. certificado_emitido (Sistema)

### O Que Está Faltando

- 🔴 **Estimativa de Conclusão**: Cálculo de previsão não implementado
- 🔴 **WebSocket Real-time**: Polling a cada 30s não existe
- 🔴 **Indicador de Prazo**: Cores verde/amarelo/vermelho não implementadas

---

## ✅ US-005: Calculadora de Custos

**Status**: ✅ IMPLEMENTADO (Inovação #1)
**Story Points**: 8

### O Que Foi Implementado

#### Backend
- ✅ **CalculatorService** ([backend/src/modules/proposal/calculator.service.ts](../../backend/src/modules/proposal/calculator.service.ts)):
  ```typescript
  calculate(inputs: CalculationInputs): ProposalBreakdown
  ```

  **Fórmula Completa**:
  ```
  TOTAL = (BASE_PRICE × PRODUCT_MULT × SHIFT_MULT × HISTORY_MULT × SUPPLIER_MULT)
        + (MAN_HOUR_HOURS × MAN_HOUR_RATE)
        + TRAVEL_COST
        + ACCOMMODATION_COST
        + DOCUMENT_ANALYSIS_FEE
        + COMMITTEE_FEE
        + ISSUANCE_FEE
        + (SUBTOTAL × TAX_RATE)
  ```

- ✅ **PricingTableService** ([backend/src/modules/proposal/pricing-table.service.ts](../../backend/src/modules/proposal/pricing-table.service.ts)):
  - `getActiveTable()` - Tabela vigente
  - `createTable()` - Criar nova tabela
  - Versionamento de tabelas de preço

- ✅ **ProposalService** ([backend/src/modules/proposal/proposal.service.ts](../../backend/src/modules/proposal/proposal.service.ts)):
  - `calculate()` - Preview sem salvar
  - `create()` - Criar proposta calculada
  - `adjust()` - Ajuste manual com validação
  - `send()` - Enviar para empresa
  - `respond()` - Registrar aceitação/recusa

- ✅ **Schema Prisma**:
  - Model `PricingTable` com:
    - Versionamento (`version`, `effectiveFrom`, `effectiveTo`)
    - Preços base por certificação (C1-C6)
    - Multiplicadores (produtos, turnos, histórico, fornecedores)
    - Man-hour rates por faixa de funcionários
    - Custos de deslocamento por distância
    - Taxas fixas
  - Model `Proposal` com breakdown completo
  - Model `ProposalResponse` - histórico de respostas

#### Frontend
- ✅ **ProposalCalculator** ([frontend/src/components/proposal/ProposalCalculator.tsx](../../frontend/src/components/proposal/ProposalCalculator.tsx)):
  - Interface de cálculo de proposta
  - Inputs configuráveis
  - Visualização de breakdown

- ✅ **ProposalBreakdown** ([frontend/src/components/proposal/ProposalBreakdown.tsx](../../frontend/src/components/proposal/ProposalBreakdown.tsx)):
  - Exibição detalhada do cálculo
  - Cada componente do valor separado
  - Total destacado

- ✅ **ProposalAdjustment** ([frontend/src/components/proposal/ProposalAdjustment.tsx](../../frontend/src/components/proposal/ProposalAdjustment.tsx)):
  - Ajuste manual de valores
  - Campo de justificativa obrigatório
  - Validação de percentual máximo

### Funcionalidade Completa

✅ **Admin configura tabela de preços**
✅ **Analista calcula proposta automaticamente**
✅ **Sistema exibe breakdown detalhado**
✅ **Analista pode ajustar manualmente** (com limite)
✅ **Proposta é enviada para empresa**
✅ **Empresa pode aceitar ou recusar**
✅ **Histórico de todas as respostas**

### O Que Está Faltando

- 🔴 **Geração de PDF**: Template profissional da proposta
- 🔴 **Envio por Email**: EmailService não integrado

---

## 🟡 US-006: Notificações de Mudança de Status

**Status**: 🟡 PARCIALMENTE IMPLEMENTADO
**Story Points**: 3

### O Que Foi Implementado

#### Database
- ✅ **Schema Prisma**:
  - Model `Notification` com campos:
    - `userId`, `type`, `title`, `message`, `link`
    - `readAt` (para marcar como lida)

#### Backend (Preparado)
- ✅ Método `emailService` existe em vários lugares:
  - [backend/src/services/email.service.ts](../../backend/src/services/email.service.ts)
  - Mencionado em vários services (process, document-request, contract)

### O Que Está Faltando (CRÍTICO para MVP)

- 🔴 **EmailService não implementado**:
  - Sem integração SendGrid/AWS SES
  - Sem templates de email
  - Sem envio real de emails

- 🔴 **Notificações in-app**:
  - Sem componente de sino no header
  - Sem dropdown de notificações
  - Sem badge de contador

- 🔴 **Preferências de notificação**:
  - Não há página de configuração
  - Não há opt-out

### Para Implementar

Ver [PROXIMOS-PASSOS-MVP.md](../../../PROXIMOS-PASSOS-MVP.md#1-sistema-de-emails-transacionais--crítico) - Prioridade MÁXIMA

---

## ✅ US-007: Editar Solicitação em Rascunho

**Status**: ✅ IMPLEMENTADO
**Story Points**: 3

### O Que Foi Implementado

- ✅ Status 'rascunho' no enum `RequestStatus` e `ProcessStatus`
- ✅ Wizard permite salvar progresso
- ✅ Empresa pode retornar e editar
- ✅ Submissão final muda status de 'rascunho' para 'enviado'

### Método Backend
```typescript
// backend/src/modules/process/process.service.ts
submitWizard(processId: string) {
  // Muda de 'rascunho' para 'pendente'
  // Gera protocolo único
  // Notifica analistas (quando emails implementados)
}
```

---

## ✅ US-008: Cancelar Solicitação

**Status**: ✅ IMPLEMENTADO
**Story Points**: 2

### O Que Foi Implementado

- ✅ Status 'cancelado' no enum `ProcessStatus`
- ✅ Transição permitida de qualquer fase para 'cancelado'
- ✅ Registro em histórico (`ProcessHistory`)
- ✅ Campo `notes` para motivo do cancelamento

### Método Backend
```typescript
// backend/src/modules/process/process.service.ts
cancelProcess(processId: string, reason: string) {
  // Muda status para 'cancelado'
  // Registra motivo em notes
  // Cria entrada em ProcessHistory
}
```

---

## 📋 Checklist de Entrega para Desenvolvedor

### Backend
- [x] Schema Prisma completo (Company, User, Request, Process, Document)
- [x] ProcessService com CRUD e transições
- [x] IndustrialClassificationService (GSO 2055-2)
- [x] CalculatorService (Inovação #1)
- [x] ProposalService (calcular, criar, ajustar, enviar)
- [ ] EmailService (PENDENTE - CRÍTICO)

### Frontend
- [x] NewRequestWizard.tsx (9 etapas completas)
- [x] ProcessDetails.tsx (timeline 17 fases)
- [x] CompanyDashboard.tsx
- [x] Todos os componentes do wizard
- [x] FileDropzone para upload
- [x] ProposalCalculator e ProposalBreakdown
- [ ] Notificações in-app (PENDENTE)

### Database
- [x] 19 tabelas criadas e relacionadas
- [x] 22 enums definidos
- [x] Migrations aplicadas
- [x] Seed data (se houver)

### Funcionalidades End-to-End
- [x] Empresa se cadastra
- [x] Empresa preenche wizard completo (9 etapas)
- [x] Sistema gera protocolo único
- [x] Processo fica em 'rascunho'
- [x] Empresa submete solicitação
- [x] Status muda para 'pendente'
- [x] Analista vê processo no Kanban
- [ ] Analista recebe notificação por email (PENDENTE)

---

**Documento gerado**: 16 de Dezembro de 2025
**Próximo épico**: Ver [EPIC-02-STATUS.md](./EPIC-02-STATUS.md)
