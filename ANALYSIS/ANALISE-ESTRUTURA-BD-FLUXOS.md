# Análise da Estrutura do Banco de Dados e Fluxos - HalalSphere

**Data:** 2026-01-20
**Objetivo:** Esclarecer a confusão entre Request, Process e Certificação

---

## 1. PROBLEMA ATUAL: A CONFUSÃO

Atualmente o sistema tem **confusão terminológica** entre:

| Termo no Código | O que Parece Ser | O que Realmente É |
|-----------------|------------------|-------------------|
| `Request` | Uma solicitação simples | Contém TODOS os dados da certificação |
| `Process` | O processo completo | Apenas o workflow/fases da certificação |
| `Certificate` | O certificado final | Apenas o documento PDF gerado |

### O Que Está Errado?

1. **Request está sobrecarregado** - armazena dados da empresa, do produto, da instalação, contato, etc.
2. **Process é apenas um "rastreador de fase"** - não contém dados, só referencia Request
3. **Dois fluxos de criação coexistem** - via Request OU via Process (wizard)
4. **Dois protocolos diferentes** - `REQ-YYYYMMDD-XXXXX` e `HS-YYYY-NNN`

---

## 2. VISÃO DO NEGÓCIO: Como Deveria Ser

### Glossário de Negócio

| Termo de Negócio | Descrição | Tabela no BD |
|------------------|-----------|--------------|
| **Empresa** | A organização que busca certificação | `companies` |
| **Solicitação** | Pedido inicial de certificação (9 etapas de preenchimento) | `requests` |
| **Processo de Certificação** | Todo o ciclo de vida da certificação (17 fases) | `requests` + `processes` |
| **Proposta Comercial** | Orçamento enviado à empresa | `proposals` |
| **Contrato** | Documento formal assinado | `contracts` |
| **Auditoria** | Verificação in loco ou remota | `audits` |
| **Certificado** | Documento final emitido | `certificates` |

### Fluxo Simplificado do Negócio

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PROCESSO DE CERTIFICAÇÃO HALAL                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  EMPRESA                                                                     │
│     │                                                                        │
│     ▼                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ SOLICITAÇÃO (9 etapas de preenchimento)                              │   │
│  │ ├─ Etapa 1: Tipo de certificação (nova/renovação/ampliação)          │   │
│  │ ├─ Etapa 2: Dados da empresa                                         │   │
│  │ ├─ Etapa 3: Classificação industrial (GSO 2055-2)                    │   │
│  │ ├─ Etapa 4: Dados do produto                                         │   │
│  │ ├─ Etapa 5: Dados de produção                                        │   │
│  │ ├─ Etapa 6: Ingredientes e fornecedores                              │   │
│  │ ├─ Etapa 7: Local/Instalação a ser certificada                       │   │
│  │ ├─ Etapa 8: Upload de documentos                                     │   │
│  │ └─ Etapa 9: Aceite dos termos                                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│     │                                                                        │
│     ▼ (Submit)                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ ANÁLISE E PROCESSAMENTO (17 fases)                                   │   │
│  │ ├─ Fase 1:  Cadastro da solicitação ✓                                │   │
│  │ ├─ Fase 2:  Análise documental inicial                               │   │
│  │ ├─ Fase 3:  Elaboração da proposta                                   │   │
│  │ ├─ Fase 4:  Negociação da proposta                                   │   │
│  │ ├─ Fase 5:  Proposta aprovada                                        │   │
│  │ ├─ Fase 6:  Elaboração do contrato                                   │   │
│  │ ├─ Fase 7:  Assinatura do contrato                                   │   │
│  │ ├─ Fase 8:  Avaliação documental completa                            │   │
│  │ ├─ Fase 9:  Planejamento da auditoria                                │   │
│  │ ├─ Fase 10: Auditoria estágio 1                                      │   │
│  │ ├─ Fase 11: Auditoria estágio 2                                      │   │
│  │ ├─ Fase 12: Análise de não-conformidades                             │   │
│  │ ├─ Fase 13: Correção de não-conformidades                            │   │
│  │ ├─ Fase 14: Validação das correções                                  │   │
│  │ ├─ Fase 15: Comitê técnico                                           │   │
│  │ ├─ Fase 16: Emissão do certificado                                   │   │
│  │ └─ Fase 17: Certificado emitido ✓                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│     │                                                                        │
│     ▼                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ CERTIFICADO HALAL                                                    │   │
│  │ ├─ Número único                                                      │   │
│  │ ├─ QR Code de validação                                              │   │
│  │ ├─ Validade (1-3 anos)                                               │   │
│  │ └─ Status: ativo | suspenso | cancelado | expirado                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ESTRUTURA ATUAL DO BANCO DE DADOS

### 3.1 Tabelas Principais do Fluxo de Certificação

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  companies  │────▶│  requests   │────▶│  processes  │
│             │ 1:N │             │ 1:1 │             │
└─────────────┘     └─────────────┘     └─────────────┘
                          │                    │
                          │ 1:N                │ 1:N
                          ▼                    ▼
                    ┌───────────┐      ┌─────────────┐
                    │ documents │      │   audits    │
                    └───────────┘      ├─────────────┤
                                       │  proposals  │
                                       ├─────────────┤
                                       │  contracts  │
                                       ├─────────────┤
                                       │certificates │
                                       └─────────────┘
```

### 3.2 Tabela `requests` - O Que Armazena

A tabela `requests` é o **repositório central de dados** da certificação:

```
requests
├── IDENTIFICAÇÃO
│   ├── id (UUID)
│   ├── protocol (REQ-20260120-00001)
│   ├── companyId → FK companies
│   └── companyName (desnormalizado)
│
├── TIPO DE CERTIFICAÇÃO
│   ├── requestType: nova | renovacao | ampliacao | inicial
│   ├── certificationType: C1 | C2 | C3 | C4 | C5 | C6
│   └── industrialClassification (texto descritivo)
│
├── CLASSIFICAÇÃO INDUSTRIAL (GSO 2055-2)
│   ├── industrialGroupId → FK industrial_groups (A, B, C, D)
│   ├── industrialCategoryId → FK industrial_categories (AI, AII, BI...)
│   └── industrialSubcategoryId → FK industrial_subcategories
│
├── DADOS DE CONTATO
│   ├── contactPerson
│   ├── contactEmail
│   └── contactPhone
│
├── LOCAL/INSTALAÇÃO
│   ├── facilityAddress
│   ├── facilityCity
│   ├── facilityState
│   ├── facilityCountry
│   └── facilityPostalCode
│
├── DADOS DO PRODUTO (campos legados)
│   ├── productOrigin: animal | vegetal | misto | quimico
│   ├── productType
│   ├── productCategory
│   ├── productDescription
│   ├── productDetails (JSON)
│   └── productionDetails (JSON)
│
├── INFORMAÇÕES ADICIONAIS
│   ├── estimatedProductionCapacity
│   ├── currentCertifications
│   └── additionalInfo
│
├── STATUS E WORKFLOW
│   ├── status: rascunho → pendente → em_analise → aprovado/rejeitado
│   └── submittedAt (quando foi enviado)
│
└── REVISÃO (pelo analista)
    ├── reviewerId → FK users
    ├── reviewedAt
    ├── reviewNotes
    ├── rejectionReason
    └── cancelReason
```

### 3.3 Tabela `processes` - O Que Armazena

A tabela `processes` é o **controlador de workflow**:

```
processes
├── IDENTIFICAÇÃO
│   ├── id (UUID)
│   └── requestId → FK requests (1:1, UNIQUE)
│
├── RESPONSÁVEIS
│   ├── analystId → FK users (analista atribuído)
│   └── auditorId → FK users (auditor atribuído)
│
├── CONTROLE DE FASE
│   ├── currentPhase: 1 de 17 fases (enum ProcessPhase)
│   ├── status: ProcessStatus (15 valores possíveis)
│   ├── priority: baixa | media | alta | urgente
│   ├── daysInPhase (dias na fase atual)
│   └── estimatedEnd (previsão de conclusão)
│
└── timestamps
    ├── createdAt
    └── updatedAt
```

### 3.4 Relação Request ↔ Process

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  REQUEST                           PROCESS                      │
│  ═══════                           ═══════                      │
│  • Armazena DADOS                  • Controla WORKFLOW          │
│  • Preenchido pela EMPRESA         • Gerenciado pelo SISTEMA    │
│  • Status simplificado (6)         • Status detalhado (15)      │
│  • Criado primeiro                 • Criado após aprovação      │
│                                      do Request                 │
│                                                                 │
│  Request.status     ←────────────→ Process.status               │
│  (espelho)                         (fonte da verdade)           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. MAPEAMENTO DE STATUS

### 4.1 RequestStatus (6 valores - visão da empresa)

| Status | Descrição | Quem Atua |
|--------|-----------|-----------|
| `rascunho` | Empresa está preenchendo | Empresa |
| `enviado` | Empresa finalizou preenchimento | - |
| `pendente` | Aguardando análise | - |
| `em_analise` | Analista está revisando | Analista |
| `aprovado` | Aceito, processo em andamento | - |
| `rejeitado` | Recusado | - |
| `cancelado` | Cancelado pela empresa | Empresa |

### 4.2 ProcessStatus (15 valores - visão interna)

| Status | Descrição | Fase Típica |
|--------|-----------|-------------|
| `rascunho` | Processo criado mas não iniciado | 1 |
| `pendente` | Aguardando atribuição de analista | 1 |
| `em_andamento` | Sendo trabalhado ativamente | 2-8 |
| `aguardando_documentos` | Falta documentação | 2, 8 |
| `analise_documental` | Documentos sendo analisados | 2, 8 |
| `analise_tecnica` | Avaliação técnica em curso | 8 |
| `proposta_enviada` | Proposta comercial enviada | 4 |
| `aguardando_assinatura` | Contrato aguardando assinatura | 7 |
| `aguardando_auditoria` | Auditoria sendo planejada | 9 |
| `em_auditoria` | Auditoria em execução | 10-11 |
| `concluido` | Todas as fases completadas | 15 |
| `aprovado` | Aprovado pelo comitê | 15 |
| `reprovado` | Reprovado pelo comitê | 15 |
| `certificado` | Certificado emitido | 17 |
| `cancelado` | Cancelado | qualquer |
| `suspenso` | Temporariamente parado | qualquer |

### 4.3 ProcessPhase (17 fases)

| # | Enum | Descrição | Responsável |
|---|------|-----------|-------------|
| 1 | `cadastro_solicitacao` | Preenchimento dos dados | Empresa |
| 2 | `analise_documental_inicial` | Verificação inicial dos docs | Analista |
| 3 | `elaboracao_proposta` | Cálculo da proposta | Sistema/Analista |
| 4 | `negociacao_proposta` | Negociação com empresa | Comercial |
| 5 | `proposta_aprovada` | Empresa aceitou proposta | Empresa |
| 6 | `elaboracao_contrato` | Preparação do contrato | Jurídico |
| 7 | `assinatura_contrato` | Assinatura eletrônica | Empresa |
| 8 | `avaliacao_documental` | Análise profunda dos docs | Analista |
| 9 | `planejamento_auditoria` | Agendamento da auditoria | Gestor Auditoria |
| 10 | `auditoria_estagio1` | Primeira auditoria | Auditor |
| 11 | `auditoria_estagio2` | Segunda auditoria | Auditor |
| 12 | `analise_nao_conformidades` | Análise dos achados | Analista |
| 13 | `correcao_nao_conformidades` | Empresa corrige problemas | Empresa |
| 14 | `validacao_correcoes` | Validação das correções | Auditor |
| 15 | `comite_tecnico` | Decisão final | Comitê |
| 16 | `emissao_certificado` | Geração do certificado | Sistema |
| 17 | `certificado_emitido` | Concluído | - |

---

## 5. PROBLEMAS IDENTIFICADOS

### 5.1 Problemas Críticos

| # | Problema | Impacto | Localização |
|---|----------|---------|-------------|
| 1 | **Dois fluxos de criação** | Confusão no código e bugs | `RequestService` e `ProcessService` |
| 2 | **Request sobrecarregado** | Dados misturados | `requests` table |
| 3 | **Audit sem auditorId** | Não rastreia quem fez a auditoria | `audits` table |
| 4 | **Certificate sem issuedBy** | Não rastreia quem emitiu | `certificates` table |
| 5 | **Dois protocolos diferentes** | `REQ-*` vs `HS-*` | Services |

### 5.2 Problemas de Nomenclatura

| Atual | Problema | Sugestão |
|-------|----------|----------|
| `Request` | Muito genérico | `CertificationApplication` |
| `Process` | Confunde com processo do SO | `CertificationWorkflow` |
| `Document` | OK | - |
| `Proposal` | OK mas duplica com `Contract.type=proposta` | Remover duplicidade |

### 5.3 Dados Duplicados

```
Company.address (JSON) ←→ Company.endereco (flat)
Company.contact (JSON) ←→ Company.email, Company.telefone (flat)
Request.contactEmail  ←→ Company.contact.email
Request.facilityAddress ←→ Deveria estar em Process ou nova tabela
```

---

## 6. RECOMENDAÇÕES

### 6.1 Curto Prazo (Não quebrar o sistema)

1. **Padronizar um único fluxo de criação** - escolher Request-first OU Process-first
2. **Documentar claramente o mapeamento** Request.status ↔ Process.status
3. **Adicionar `auditorId` na tabela `audits`**
4. **Adicionar `issuedBy` na tabela `certificates`**

### 6.2 Médio Prazo (Refatoração)

1. **Criar tabela `Facility`** para locais de auditoria
2. **Consolidar Proposal e Contract** (proposta é um tipo de contrato)
3. **Remover campos JSON duplicados** (usar apenas flat fields ou apenas JSON)
4. **Criar ProcessFacility** para suportar múltiplos locais por processo

### 6.3 Longo Prazo (Redesign)

```
Estrutura Proposta:

Company (dados cadastrais)
    └── CertificationApplication (solicitação inicial)
            └── CertificationProcess (workflow + dados de certificação)
                    ├── Facility[] (locais a serem auditados)
                    ├── Proposal (proposta comercial)
                    ├── Contract (contrato assinado)
                    ├── Audit[] (auditorias realizadas)
                    │       └── Finding[] (achados/não-conformidades)
                    ├── CommitteeDecision (decisão do comitê)
                    └── Certificate (certificado final)
```

---

## 7. TABELA DE REFERÊNCIA RÁPIDA

### Para Desenvolvedores

| Quando você precisa... | Use esta tabela | Campo chave |
|------------------------|-----------------|-------------|
| Dados da empresa | `companies` | `id` |
| Dados da solicitação (produto, local) | `requests` | `id` |
| Status atual do processo | `processes` | `status`, `currentPhase` |
| Documentos enviados | `documents` | `requestId` |
| Proposta comercial | `proposals` | `processId` |
| Contrato assinado | `contracts` | `processId` |
| Registros de auditoria | `audits` | `processId` |
| Certificado emitido | `certificates` | `processId` |
| Histórico de fases | `process_phase_history` | `processId` |
| Histórico de status | `process_history` | `processId` |

### Para Negócio

| Pergunta de Negócio | Consulta |
|---------------------|----------|
| Quantas solicitações pendentes? | `SELECT COUNT(*) FROM requests WHERE status = 'pendente'` |
| Em que fase está o processo X? | `SELECT currentPhase FROM processes WHERE id = 'X'` |
| Quais processos estão atrasados? | `SELECT * FROM processes WHERE daysInPhase > 30` |
| Certificados a expirar | `SELECT * FROM certificates WHERE expiresAt < NOW() + INTERVAL '30 days'` |

---

## 8. DIAGRAMA ER SIMPLIFICADO

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │
│ email           │
│ role            │◄──────────────────────────────────────┐
│ name            │                                       │
└────────┬────────┘                                       │
         │ 1:1 (empresa)                                  │
         ▼                                                │
┌─────────────────┐                                       │
│   companies     │                                       │
│─────────────────│                                       │
│ id (PK)         │                                       │
│ userId (FK)     │                                       │
│ cnpj            │                                       │
│ razaoSocial     │                                       │
└────────┬────────┘                                       │
         │ 1:N                                            │
         ▼                                                │
┌─────────────────┐       ┌─────────────────┐            │
│    requests     │──────▶│   processes     │            │
│─────────────────│  1:1  │─────────────────│            │
│ id (PK)         │       │ id (PK)         │            │
│ companyId (FK)  │       │ requestId (FK)  │            │
│ protocol        │       │ analystId (FK)  │────────────┤
│ status          │       │ auditorId (FK)  │────────────┤
│ requestType     │       │ currentPhase    │            │
│ certificationType│      │ status          │            │
│ [dados produto] │       │ priority        │            │
│ [dados local]   │       └────────┬────────┘            │
│ [dados contato] │                │                     │
└────────┬────────┘                │                     │
         │ 1:N                     │ 1:N                 │
         ▼                         ├─────────────────────┼──▶ proposals
┌─────────────────┐                ├─────────────────────┼──▶ contracts
│   documents     │                ├─────────────────────┼──▶ audits
│─────────────────│                ├─────────────────────┼──▶ certificates
│ id (PK)         │                └─────────────────────┼──▶ process_history
│ requestId (FK)  │                                      │
│ documentType    │                                      │
│ fileUrl         │                                      │
│ validationStatus│                                      │
└─────────────────┘                                      │
                                                         │
                        reviewerId (FK) ─────────────────┘
```

---

## 9. PRÓXIMOS PASSOS

1. [ ] Validar este documento com a equipe
2. [ ] Decidir qual fluxo de criação manter (Request-first vs Process-first)
3. [ ] Criar migration para adicionar `auditorId` em `audits`
4. [ ] Criar migration para adicionar `issuedBy` em `certificates`
5. [ ] Atualizar documentação do frontend
6. [ ] Criar testes de integração para validar fluxos

---

*Documento gerado em 2026-01-20 para análise da estrutura do HalalSphere*
