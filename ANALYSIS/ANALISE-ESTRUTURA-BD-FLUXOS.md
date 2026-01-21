# Análise da Estrutura do Banco de Dados e Fluxos - HalalSphere

**Data:** 2026-01-20
**Versão:** 2.0
**Objetivo:** Definir a estrutura correta para o sistema de certificação Halal

---

## Sumário

1. [Visão do Negócio](#1-visão-do-negócio)
2. [Estrutura Atual vs. Estrutura Ideal](#2-estrutura-atual-vs-estrutura-ideal)
3. [Análise de Gaps](#3-análise-de-gaps)
4. [Proposta de Novo Schema](#4-proposta-de-novo-schema)
5. [Fluxos Diferenciados por Tipo de Solicitação](#5-fluxos-diferenciados-por-tipo-de-solicitação)
6. [Plano de Migração](#6-plano-de-migração)
7. [Impactos da Migração](#7-impactos-da-migração)
8. [Cronograma Sugerido](#8-cronograma-sugerido)

---

## 1. Visão do Negócio

### 1.1 O Que é uma Certificação Halal?

Uma **Certificação Halal** é uma entidade viva que existe por anos (tipicamente 3 anos de validade). Ela é composta por:

| Componente | Descrição |
|------------|-----------|
| **Dados da Empresa** | Cadastro permanente da organização solicitante |
| **Escopo** | Produtos, processos, instalações e marcas certificadas |
| **Documentos** | Documentação legal, técnica e operacional |
| **Propostas** | Orçamentos comerciais ao longo do tempo |
| **Contratos** | Acordos formais assinados |
| **Auditorias** | Verificações durante a solicitação E durante a validade |
| **Certificado** | O documento/comprovante físico da certificação |

O **Certificado** é apenas o comprovante da Certificação, não a certificação em si.

### 1.2 Tipos de Solicitação

Uma empresa pode fazer 3 tipos de solicitação relacionada à certificação:

| Tipo | Descrição | Dados Necessários |
|------|-----------|-------------------|
| **Nova Certificação** | Primeira vez da empresa/produto | Tudo do zero |
| **Renovação** | Certificação existente expirando | Confirmação/atualização de dados existentes |
| **Manutenção/Ajuste** | Alteração no escopo vigente | Apenas dados da alteração |

### 1.3 Ciclo de Vida da Certificação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CICLO DE VIDA DA CERTIFICAÇÃO                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ANO 0                        ANO 1-2                      ANO 3            │
│  ══════                       ═══════                      ═════            │
│                                                                             │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐   │
│  │   NOVA      │             │ AUDITORIAS  │             │  RENOVAÇÃO  │   │
│  │ SOLICITAÇÃO │────────────▶│    DE       │────────────▶│     OU      │   │
│  │             │             │ VIGILÂNCIA  │             │ EXPIRAÇÃO   │   │
│  └─────────────┘             └─────────────┘             └─────────────┘   │
│        │                           │                           │           │
│        ▼                           ▼                           ▼           │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐   │
│  │ 17 FASES    │             │ MANUTENÇÃO  │             │ FLUXO       │   │
│  │ COMPLETAS   │             │ E AJUSTES   │             │ SIMPLIFICADO│   │
│  │             │             │ (se houver) │             │             │   │
│  └─────────────┘             └─────────────┘             └─────────────┘   │
│        │                                                       │           │
│        ▼                                                       ▼           │
│  ┌─────────────┐                                         ┌─────────────┐   │
│  │ CERTIFICADO │                                         │ CERTIFICADO │   │
│  │  EMITIDO    │◄────────────────────────────────────────│  RENOVADO   │   │
│  │ (v1)        │                                         │  (v2, v3...)│   │
│  └─────────────┘                                         └─────────────┘   │
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│                     CERTIFICAÇÃO ATIVA (3 ANOS)                             │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.4 O Que Deve Ser Consultável Após Certificação Emitida

| Consulta | Descrição |
|----------|-----------|
| Dados da certificação | Número, tipo, validade, status |
| Escopo certificado | Produtos, processos, instalações, marcas |
| Documentos vinculados | Todos os documentos associados |
| Histórico de auditorias | Durante solicitação E durante validade |
| Relatórios de auditoria | Achados, não-conformidades, correções |
| Propostas e contratos | Histórico comercial |
| Linha do tempo | Todas as ações e mudanças de status |

### 1.5 Transparência e Controle de Acesso

| Ator | O Que Pode Ver |
|------|----------------|
| **Empresa** | Status simplificado, seus documentos, suas auditorias, seu certificado |
| **Analista** | Todos os dados da certificação, workflow detalhado |
| **Auditor** | Dados relevantes para auditoria, relatórios |
| **Gestor** | Visão completa + métricas + decisões |
| **Comitê** | Dados para tomada de decisão |

---

## 2. Estrutura Atual vs. Estrutura Ideal

### 2.1 Estrutura Atual (Problemática)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ESTRUTURA ATUAL                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  companies ──1:N──▶ requests ──1:1──▶ processes                             │
│                         │                  │                                │
│                         │ 1:N              │ 1:N                            │
│                         ▼                  ├──▶ proposals                   │
│                    documents               ├──▶ contracts                   │
│                                            ├──▶ audits                      │
│                                            └──▶ certificates                │
│                                                                             │
│  PROBLEMAS:                                                                 │
│  ══════════                                                                 │
│  1. Request = solicitação + dados da certificação (misturado)               │
│  2. Process = apenas workflow (morre quando certificado é emitido)          │
│  3. Audits vinculado a Process (não pode ter auditoria pós-certificação)    │
│  4. Não existe entidade "Certificação" como centro                          │
│  5. Renovação/Manutenção usa o mesmo fluxo de Nova                          │
│  6. Documents vinculado a Request (não à certificação)                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Estrutura Ideal (Proposta)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ESTRUTURA PROPOSTA                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  companies ──1:N──▶ CERTIFICATIONS (NOVO - entidade central)                │
│                           │                                                 │
│                           ├──1:1──▶ certification_scopes (NOVO)             │
│                           │              ├── products[]                     │
│                           │              ├── facilities[]                   │
│                           │              ├── processes[]                    │
│                           │              └── brands[]                       │
│                           │                                                 │
│                           ├──1:N──▶ certification_requests (renomeado)      │
│                           │              └──1:1──▶ request_workflows        │
│                           │                                                 │
│                           ├──1:N──▶ documents (movido)                      │
│                           │                                                 │
│                           ├──1:N──▶ proposals (movido)                      │
│                           │                                                 │
│                           ├──1:N──▶ contracts (movido)                      │
│                           │                                                 │
│                           ├──1:N──▶ audits (movido)                         │
│                           │              └── audit_findings[]               │
│                           │                                                 │
│                           ├──1:N──▶ certificates (histórico de emissões)    │
│                           │                                                 │
│                           └──1:N──▶ certification_history (timeline)        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Comparativo de Entidades

| Entidade Atual | Entidade Proposta | Mudança |
|----------------|-------------------|---------|
| `companies` | `companies` | Mantém |
| `requests` | `certification_requests` | Renomeia + remove dados de escopo |
| `processes` | `request_workflows` | Renomeia + vincula a request |
| - | **`certifications`** | **NOVO - entidade central** |
| - | **`certification_scopes`** | **NOVO - escopo da certificação** |
| - | **`scope_products`** | **NOVO - produtos certificados** |
| - | **`scope_facilities`** | **NOVO - instalações certificadas** |
| - | **`scope_brands`** | **NOVO - marcas certificadas** |
| `documents` | `documents` | Move FK para `certificationId` |
| `proposals` | `proposals` | Move FK para `certificationId` |
| `contracts` | `contracts` | Move FK para `certificationId` |
| `audits` | `audits` | Move FK para `certificationId` + adiciona `auditorId` |
| `certificates` | `certificates` | Move FK para `certificationId` + adiciona `issuedBy` |
| `process_phase_history` | `workflow_phase_history` | Renomeia |
| `process_history` | `certification_history` | Move FK para `certificationId` |

---

## 3. Análise de Gaps

### 3.1 Funcionalidades que NÃO FUNCIONAM Hoje

| # | Funcionalidade | Gap | Impacto |
|---|----------------|-----|---------|
| 1 | Renovação com dados preenchidos | Wizard sempre começa do zero | UX ruim, retrabalho |
| 2 | Manutenção/Ajuste simplificado | Não existe fluxo específico | Impossível fazer ajustes |
| 3 | Auditorias pós-certificação | `audits` → `processId` que morre | Não rastreia vigilância |
| 4 | Consulta unificada da certificação | Dados espalhados em 6+ tabelas | Complexidade, bugs |
| 5 | Histórico de certificados (versões) | Não há versionamento | Perde histórico de renovações |
| 6 | Rastreio de quem fez auditoria | `audits` não tem `auditorId` | Compliance falho |
| 7 | Rastreio de quem emitiu certificado | `certificates` não tem `issuedBy` | Compliance falho |
| 8 | Documentos com validade | `documents` não tem `validUntil` | Docs expirados não detectados |
| 9 | Escopo estruturado | Dados em JSON/texto livre | Não pesquisável |
| 10 | Timeline unificada | Histórico em várias tabelas | Difícil auditoria |

### 3.2 Funcionalidades que FUNCIONAM Parcialmente

| # | Funcionalidade | Status | O que Falta |
|---|----------------|--------|-------------|
| 1 | Workflow de 17 fases | OK | Apenas nomenclatura confusa |
| 2 | Propostas comerciais | OK | Vincular à certificação, não ao process |
| 3 | Contratos | OK | Vincular à certificação |
| 4 | Auditorias durante solicitação | OK | Adicionar `auditorId` |
| 5 | Geração de certificado | OK | Adicionar `issuedBy`, versão |
| 6 | Histórico de fases | OK | Renomear e manter |

---

## 4. Proposta de Novo Schema

### 4.1 Nova Tabela: `certifications`

```sql
-- TABELA CENTRAL: Certificação
CREATE TABLE certifications (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id              UUID NOT NULL REFERENCES companies(id),

    -- Identificação
    certification_number    VARCHAR(50) UNIQUE,  -- HS-2026-001

    -- Tipo e Classificação
    certification_type      certification_type NOT NULL,  -- C1, C2, C3, C4, C5, C6
    industrial_group_id     UUID REFERENCES industrial_groups(id),
    industrial_category_id  UUID REFERENCES industrial_categories(id),
    industrial_subcategory_id UUID REFERENCES industrial_subcategories(id),

    -- Status e Validade
    status                  certification_status NOT NULL DEFAULT 'em_solicitacao',
    -- em_solicitacao, ativa, suspensa, cancelada, expirada

    valid_from              TIMESTAMP,  -- Data início da validade
    valid_until             TIMESTAMP,  -- Data fim da validade (3 anos típico)

    -- Responsáveis
    analyst_id              UUID REFERENCES users(id),  -- Analista principal

    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW(),

    -- Índices
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX idx_certifications_company ON certifications(company_id);
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_certifications_valid_until ON certifications(valid_until);
CREATE INDEX idx_certifications_number ON certifications(certification_number);
```

### 4.2 Nova Tabela: `certification_scopes`

```sql
-- ESCOPO: O que está sendo certificado
CREATE TABLE certification_scopes (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_id        UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,

    -- Descrição Geral
    description             TEXT,

    -- Capacidade Produtiva
    production_capacity     VARCHAR(255),
    num_employees           INT,
    num_shifts              INT,

    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_certification_scope UNIQUE (certification_id)
);

-- PRODUTOS no escopo
CREATE TABLE scope_products (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id                UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,

    name                    VARCHAR(255) NOT NULL,
    description             TEXT,
    category                VARCHAR(255),
    origin                  product_origin,  -- animal, vegetal, misto, quimico

    -- Status no escopo
    status                  scope_item_status DEFAULT 'ativo',  -- ativo, removido, pendente
    added_at                TIMESTAMP DEFAULT NOW(),
    removed_at              TIMESTAMP,

    created_at              TIMESTAMP DEFAULT NOW()
);

-- INSTALAÇÕES no escopo
CREATE TABLE scope_facilities (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id                UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,

    name                    VARCHAR(255),
    address                 TEXT NOT NULL,
    city                    VARCHAR(100),
    state                   VARCHAR(100),
    country                 VARCHAR(100),
    postal_code             VARCHAR(20),

    -- Tipo de instalação
    facility_type           VARCHAR(100),  -- fabrica, armazem, escritorio

    -- Status no escopo
    status                  scope_item_status DEFAULT 'ativo',
    added_at                TIMESTAMP DEFAULT NOW(),
    removed_at              TIMESTAMP,

    created_at              TIMESTAMP DEFAULT NOW()
);

-- MARCAS no escopo
CREATE TABLE scope_brands (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id                UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,

    name                    VARCHAR(255) NOT NULL,
    logo_url                TEXT,

    -- Status no escopo
    status                  scope_item_status DEFAULT 'ativo',
    added_at                TIMESTAMP DEFAULT NOW(),
    removed_at              TIMESTAMP,

    created_at              TIMESTAMP DEFAULT NOW()
);

-- FORNECEDORES no escopo
CREATE TABLE scope_suppliers (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id                UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,

    name                    VARCHAR(255) NOT NULL,
    cnpj                    VARCHAR(20),
    ingredient_type         VARCHAR(255),  -- Tipo de ingrediente fornecido
    has_halal_certificate   BOOLEAN DEFAULT FALSE,

    status                  scope_item_status DEFAULT 'ativo',
    added_at                TIMESTAMP DEFAULT NOW(),

    created_at              TIMESTAMP DEFAULT NOW()
);
```

### 4.3 Tabela Modificada: `certification_requests`

```sql
-- SOLICITAÇÕES vinculadas à certificação
CREATE TABLE certification_requests (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_id        UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,

    -- Identificação
    protocol                VARCHAR(50) UNIQUE,  -- REQ-20260120-00001

    -- Tipo de Solicitação
    request_type            request_type NOT NULL,  -- nova, renovacao, manutencao, ajuste

    -- Status do Request (visão da empresa)
    status                  request_status NOT NULL DEFAULT 'rascunho',
    -- rascunho, enviado, em_analise, aprovado, rejeitado, cancelado

    -- Dados de Submissão
    submitted_at            TIMESTAMP,
    completed_at            TIMESTAMP,

    -- Revisão
    reviewer_id             UUID REFERENCES users(id),
    reviewed_at             TIMESTAMP,
    review_notes            TEXT,
    rejection_reason        TEXT,

    -- Para Manutenção/Ajuste: o que está sendo alterado
    change_description      TEXT,
    change_type             VARCHAR(100),  -- adicao_produto, remocao_produto, alteracao_instalacao

    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cert_requests_certification ON certification_requests(certification_id);
CREATE INDEX idx_cert_requests_status ON certification_requests(status);
CREATE INDEX idx_cert_requests_type ON certification_requests(request_type);
```

### 4.4 Tabela Modificada: `request_workflows`

```sql
-- WORKFLOW de cada solicitação (antes era processes)
CREATE TABLE request_workflows (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id              UUID NOT NULL REFERENCES certification_requests(id) ON DELETE CASCADE,

    -- Controle de Fase
    current_phase           process_phase NOT NULL DEFAULT 'cadastro_solicitacao',
    status                  workflow_status NOT NULL DEFAULT 'rascunho',
    priority                process_priority DEFAULT 'media',

    -- Responsáveis
    analyst_id              UUID REFERENCES users(id),
    auditor_id              UUID REFERENCES users(id),

    -- Métricas
    days_in_phase           INT DEFAULT 0,
    estimated_end           TIMESTAMP,

    -- Timestamps
    created_at              TIMESTAMP DEFAULT NOW(),
    updated_at              TIMESTAMP DEFAULT NOW(),

    CONSTRAINT uq_request_workflow UNIQUE (request_id)
);
```

### 4.5 Tabela Modificada: `documents`

```sql
-- DOCUMENTOS vinculados à certificação
ALTER TABLE documents
    ADD COLUMN certification_id UUID REFERENCES certifications(id),
    ADD COLUMN request_id UUID REFERENCES certification_requests(id),  -- opcional: qual request originou
    ADD COLUMN valid_until TIMESTAMP,  -- validade do documento
    ADD COLUMN replaced_by UUID REFERENCES documents(id),  -- se foi substituído
    ADD COLUMN version INT DEFAULT 1;

-- Migrar dados existentes
-- UPDATE documents SET certification_id = (SELECT c.id FROM certifications c
--   JOIN certification_requests cr ON cr.certification_id = c.id
--   WHERE cr.id = documents.request_id);

CREATE INDEX idx_documents_certification ON documents(certification_id);
CREATE INDEX idx_documents_valid_until ON documents(valid_until);
```

### 4.6 Tabela Modificada: `audits`

```sql
-- AUDITORIAS vinculadas à certificação
ALTER TABLE audits
    ADD COLUMN certification_id UUID REFERENCES certifications(id),
    ADD COLUMN auditor_id UUID REFERENCES users(id),  -- NOVO: quem fez
    ADD COLUMN request_id UUID REFERENCES certification_requests(id),  -- opcional
    ADD COLUMN conducted_at TIMESTAMP,  -- quando foi realizada (não agendada)
    ADD COLUMN report_url TEXT;  -- URL do relatório

-- Tipos de auditoria expandidos
-- audit_type: inicial, estagio1, estagio2, vigilancia, renovacao, especial

CREATE INDEX idx_audits_certification ON audits(certification_id);
CREATE INDEX idx_audits_auditor ON audits(auditor_id);
```

### 4.7 Tabela Modificada: `certificates`

```sql
-- CERTIFICADOS (histórico de emissões)
ALTER TABLE certificates
    ADD COLUMN certification_id UUID REFERENCES certifications(id),
    ADD COLUMN issued_by UUID REFERENCES users(id),  -- NOVO: quem emitiu
    ADD COLUMN approved_by UUID REFERENCES users(id),  -- NOVO: quem aprovou no comitê
    ADD COLUMN approval_date TIMESTAMP,
    ADD COLUMN version INT DEFAULT 1,  -- v1, v2 (renovações)
    ADD COLUMN replaced_previous UUID REFERENCES certificates(id);  -- certificado anterior

CREATE INDEX idx_certificates_certification ON certificates(certification_id);
```

### 4.8 Nova Tabela: `certification_history`

```sql
-- HISTÓRICO unificado da certificação (timeline)
CREATE TABLE certification_history (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_id        UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,

    -- Ação
    action                  VARCHAR(100) NOT NULL,
    -- criacao, submissao, analise_iniciada, documento_enviado, auditoria_agendada,
    -- auditoria_realizada, proposta_enviada, contrato_assinado, certificado_emitido,
    -- suspensao, reativacao, renovacao_iniciada, ajuste_solicitado, etc.

    action_description      TEXT,

    -- Referências opcionais
    request_id              UUID REFERENCES certification_requests(id),
    document_id             UUID REFERENCES documents(id),
    audit_id                UUID REFERENCES audits(id),
    certificate_id          UUID REFERENCES certificates(id),

    -- Quem fez
    performed_by            UUID REFERENCES users(id),

    -- Metadados
    metadata                JSONB,  -- dados adicionais específicos da ação

    -- Timestamp
    performed_at            TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cert_history_certification ON certification_history(certification_id);
CREATE INDEX idx_cert_history_action ON certification_history(action);
CREATE INDEX idx_cert_history_performed_at ON certification_history(performed_at);
```

### 4.9 Novos Enums

```sql
-- Status da Certificação (entidade principal)
CREATE TYPE certification_status AS ENUM (
    'em_solicitacao',   -- Aguardando primeira aprovação
    'ativa',            -- Certificado válido emitido
    'suspensa',         -- Temporariamente suspensa
    'cancelada',        -- Cancelada definitivamente
    'expirada'          -- Validade expirou
);

-- Status de itens no escopo
CREATE TYPE scope_item_status AS ENUM (
    'ativo',            -- Item ativo no escopo
    'pendente',         -- Aguardando aprovação
    'removido'          -- Removido do escopo
);

-- Status do Workflow
CREATE TYPE workflow_status AS ENUM (
    'rascunho',
    'pendente',
    'em_andamento',
    'aguardando_documentos',
    'aguardando_empresa',
    'aguardando_auditoria',
    'em_auditoria',
    'aguardando_comite',
    'concluido',
    'cancelado',
    'suspenso'
);

-- Tipo de Auditoria expandido
CREATE TYPE audit_type AS ENUM (
    'inicial',          -- Durante primeira certificação
    'estagio1',         -- Estágio 1 da certificação
    'estagio2',         -- Estágio 2 da certificação
    'vigilancia',       -- Durante validade (anual)
    'renovacao',        -- Para renovação
    'especial',         -- Auditoria especial/extraordinária
    'follow_up'         -- Verificação de correções
);
```

---

## 5. Fluxos Diferenciados por Tipo de Solicitação

### 5.1 Nova Certificação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NOVA CERTIFICAÇÃO                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRÉ-REQUISITOS: Nenhum                                                     │
│  DADOS NECESSÁRIOS: Todos (wizard completo de 9 etapas)                     │
│  WORKFLOW: 17 fases completas                                               │
│                                                                             │
│  WIZARD (9 ETAPAS):                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Etapa 1: Tipo de Certificação                                       │   │
│  │   ├── Tipo: NOVA                                                    │   │
│  │   ├── Classificação Industrial (GSO 2055-2)                         │   │
│  │   └── Tipo de Certificação (C1-C6)                                  │   │
│  │                                                                     │   │
│  │ Etapa 2: Dados da Empresa                                           │   │
│  │   ├── Razão Social, CNPJ                                            │   │
│  │   ├── Endereço completo                                             │   │
│  │   └── Contato responsável                                           │   │
│  │                                                                     │   │
│  │ Etapa 3: Escopo - Instalações                                       │   │
│  │   ├── Endereço(s) da(s) instalação(ões)                             │   │
│  │   └── Tipo de cada instalação                                       │   │
│  │                                                                     │   │
│  │ Etapa 4: Escopo - Produtos                                          │   │
│  │   ├── Lista de produtos a certificar                                │   │
│  │   ├── Origem (animal/vegetal/misto)                                 │   │
│  │   └── Descrição de cada produto                                     │   │
│  │                                                                     │   │
│  │ Etapa 5: Escopo - Produção                                          │   │
│  │   ├── Capacidade produtiva                                          │   │
│  │   ├── Número de turnos                                              │   │
│  │   └── Processos produtivos                                          │   │
│  │                                                                     │   │
│  │ Etapa 6: Escopo - Ingredientes e Fornecedores                       │   │
│  │   ├── Lista de ingredientes                                         │   │
│  │   ├── Fornecedores principais                                       │   │
│  │   └── Certificações dos fornecedores                                │   │
│  │                                                                     │   │
│  │ Etapa 7: Documentos                                                 │   │
│  │   ├── Contrato Social                                               │   │
│  │   ├── Alvará de Funcionamento                                       │   │
│  │   ├── Licença Sanitária                                             │   │
│  │   ├── Manual BPF                                                    │   │
│  │   └── Outros documentos obrigatórios                                │   │
│  │                                                                     │   │
│  │ Etapa 8: Informações Adicionais                                     │   │
│  │   ├── Certificações existentes                                      │   │
│  │   └── Observações                                                   │   │
│  │                                                                     │   │
│  │ Etapa 9: Revisão e Aceite                                           │   │
│  │   ├── Revisão de todos os dados                                     │   │
│  │   └── Aceite dos termos                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  WORKFLOW (17 FASES):                                                       │
│  1. Cadastro da solicitação ✓                                               │
│  2. Análise documental inicial                                              │
│  3. Elaboração da proposta                                                  │
│  4. Negociação da proposta                                                  │
│  5. Proposta aprovada                                                       │
│  6. Elaboração do contrato                                                  │
│  7. Assinatura do contrato                                                  │
│  8. Avaliação documental completa                                           │
│  9. Planejamento da auditoria                                               │
│  10. Auditoria estágio 1                                                    │
│  11. Auditoria estágio 2                                                    │
│  12. Análise de não-conformidades                                           │
│  13. Correção de não-conformidades                                          │
│  14. Validação das correções                                                │
│  15. Comitê técnico                                                         │
│  16. Emissão do certificado                                                 │
│  17. Certificado emitido ✓                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Renovação de Certificação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       RENOVAÇÃO DE CERTIFICAÇÃO                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRÉ-REQUISITOS: Certificação existente (ativa ou prestes a expirar)        │
│  DADOS NECESSÁRIOS: Confirmação/atualização dos dados existentes            │
│  WORKFLOW: Fases 2-17 (pula cadastro inicial)                               │
│                                                                             │
│  WIZARD SIMPLIFICADO (6 ETAPAS):                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Etapa 1: Seleção da Certificação                                    │   │
│  │   ├── Tipo: RENOVAÇÃO                                               │   │
│  │   ├── Selecionar certificação a renovar                             │   │
│  │   └── Exibe: número, validade, escopo atual                         │   │
│  │                                                                     │   │
│  │ Etapa 2: Confirmar Dados da Empresa                                 │   │
│  │   ├── [PRÉ-PREENCHIDO] Razão Social, CNPJ                           │   │
│  │   ├── [PRÉ-PREENCHIDO] Endereço                                     │   │
│  │   ├── [PRÉ-PREENCHIDO] Contato                                      │   │
│  │   └── Botão: "Dados corretos" ou "Atualizar dados"                  │   │
│  │                                                                     │   │
│  │ Etapa 3: Confirmar/Atualizar Escopo                                 │   │
│  │   ├── [PRÉ-PREENCHIDO] Instalações                                  │   │
│  │   ├── [PRÉ-PREENCHIDO] Produtos                                     │   │
│  │   ├── [PRÉ-PREENCHIDO] Fornecedores                                 │   │
│  │   └── Opção: Adicionar/Remover itens do escopo                      │   │
│  │                                                                     │   │
│  │ Etapa 4: Documentos                                                 │   │
│  │   ├── [LISTA] Documentos existentes com validade                    │   │
│  │   ├── [ALERTA] Documentos expirados ou a expirar                    │   │
│  │   └── Upload apenas de documentos novos/atualizados                 │   │
│  │                                                                     │   │
│  │ Etapa 5: Alterações desde Última Certificação                       │   │
│  │   ├── Houve mudança de processo? [ ] Sim [ ] Não                    │   │
│  │   ├── Houve mudança de fornecedores? [ ] Sim [ ] Não                │   │
│  │   ├── Houve não-conformidades? [ ] Sim [ ] Não                      │   │
│  │   └── Descrição das alterações (se houver)                          │   │
│  │                                                                     │   │
│  │ Etapa 6: Revisão e Aceite                                           │   │
│  │   ├── Resumo do que mudou                                           │   │
│  │   └── Aceite dos termos                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  WORKFLOW SIMPLIFICADO:                                                     │
│  2. Análise documental (foco em mudanças)                                   │
│  3. Elaboração da proposta (valor de renovação)                             │
│  4-7. Proposta e Contrato (se necessário novo contrato)                     │
│  8. Avaliação documental                                                    │
│  9. Planejamento da auditoria de renovação                                  │
│  10-11. Auditoria de renovação (pode ser única)                             │
│  12-14. Não-conformidades (se houver)                                       │
│  15. Comitê técnico                                                         │
│  16-17. Emissão do certificado renovado (v2, v3...)                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Manutenção/Ajuste de Certificação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MANUTENÇÃO/AJUSTE DE CERTIFICAÇÃO                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRÉ-REQUISITOS: Certificação ativa                                         │
│  DADOS NECESSÁRIOS: Apenas dados da alteração                               │
│  WORKFLOW: Análise simplificada (fases específicas)                         │
│                                                                             │
│  WIZARD MÍNIMO (4 ETAPAS):                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Etapa 1: Seleção e Tipo de Ajuste                                   │   │
│  │   ├── Tipo: MANUTENÇÃO/AJUSTE                                       │   │
│  │   ├── Selecionar certificação ativa                                 │   │
│  │   └── Tipo de alteração:                                            │   │
│  │       [ ] Adicionar produto/marca                                   │   │
│  │       [ ] Remover produto/marca                                     │   │
│  │       [ ] Alterar instalação                                        │   │
│  │       [ ] Atualizar documento                                       │   │
│  │       [ ] Alterar fornecedor                                        │   │
│  │       [ ] Outro (especificar)                                       │   │
│  │                                                                     │   │
│  │ Etapa 2: Detalhes da Alteração                                      │   │
│  │   ├── Se ADICIONAR PRODUTO:                                         │   │
│  │   │   ├── Nome do produto                                           │   │
│  │   │   ├── Descrição                                                 │   │
│  │   │   └── Ingredientes                                              │   │
│  │   │                                                                 │   │
│  │   ├── Se REMOVER PRODUTO:                                           │   │
│  │   │   ├── Selecionar produto a remover                              │   │
│  │   │   └── Motivo da remoção                                         │   │
│  │   │                                                                 │   │
│  │   ├── Se ALTERAR INSTALAÇÃO:                                        │   │
│  │   │   ├── Qual instalação                                           │   │
│  │   │   └── Nova informação                                           │   │
│  │   │                                                                 │   │
│  │   └── (etc. para cada tipo)                                         │   │
│  │                                                                     │   │
│  │ Etapa 3: Documentos (se necessário)                                 │   │
│  │   ├── [CONDICIONAL] Documentos exigidos para este tipo de ajuste    │   │
│  │   └── Upload dos documentos                                         │   │
│  │                                                                     │   │
│  │ Etapa 4: Revisão e Aceite                                           │   │
│  │   ├── Resumo da alteração                                           │   │
│  │   └── Aceite dos termos                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  WORKFLOW POR TIPO DE AJUSTE:                                               │
│                                                                             │
│  ADICIONAR PRODUTO (requer auditoria):                                      │
│  ├── 2. Análise documental                                                  │
│  ├── 8. Avaliação técnica do produto                                        │
│  ├── 9-11. Auditoria específica (se produto de risco)                       │
│  ├── 15. Comitê técnico                                                     │
│  └── Atualização do certificado (adendo ou nova versão)                     │
│                                                                             │
│  REMOVER PRODUTO (sem auditoria):                                           │
│  ├── 2. Análise documental                                                  │
│  ├── 15. Aprovação do gestor                                                │
│  └── Atualização do escopo                                                  │
│                                                                             │
│  ATUALIZAR DOCUMENTO (sem auditoria):                                       │
│  ├── 2. Validação do novo documento                                         │
│  └── Atualização do repositório                                             │
│                                                                             │
│  ALTERAR INSTALAÇÃO (requer auditoria):                                     │
│  ├── 2. Análise documental                                                  │
│  ├── 9-11. Auditoria da nova instalação                                     │
│  ├── 15. Comitê técnico                                                     │
│  └── Atualização do certificado                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Plano de Migração

### 6.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PLANO DE MIGRAÇÃO                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FASE 1: Preparação (1 semana)                                              │
│  ├── Backup completo do banco                                               │
│  ├── Criar branch de migração                                               │
│  ├── Criar scripts de rollback                                              │
│  └── Documentar estado atual                                                │
│                                                                             │
│  FASE 2: Criação de Novas Tabelas (1 semana)                                │
│  ├── Criar tabela certifications                                            │
│  ├── Criar tabelas de escopo (scope_*)                                      │
│  ├── Criar tabela certification_history                                     │
│  ├── Criar novos enums                                                      │
│  └── Não alterar tabelas existentes ainda                                   │
│                                                                             │
│  FASE 3: Migração de Dados (2 semanas)                                      │
│  ├── Script: requests + processes → certifications                          │
│  ├── Script: dados de escopo → scope_*                                      │
│  ├── Script: adicionar FKs nas tabelas existentes                           │
│  ├── Script: popular certification_id em documents, audits, etc.            │
│  └── Validação de integridade                                               │
│                                                                             │
│  FASE 4: Atualização do Backend (2 semanas)                                 │
│  ├── Criar CertificationModule                                              │
│  ├── Criar CertificationScopeModule                                         │
│  ├── Atualizar RequestModule → CertificationRequestModule                   │
│  ├── Atualizar ProcessModule → WorkflowModule                               │
│  ├── Atualizar DocumentModule                                               │
│  ├── Atualizar AuditModule                                                  │
│  └── Criar novos endpoints                                                  │
│                                                                             │
│  FASE 5: Atualização do Frontend (2 semanas)                                │
│  ├── Novo wizard com fluxos diferenciados                                   │
│  ├── Tela de visualização da certificação                                   │
│  ├── Timeline unificada                                                     │
│  ├── Gestão de escopo                                                       │
│  └── Ajustes em telas existentes                                            │
│                                                                             │
│  FASE 6: Testes e Validação (1 semana)                                      │
│  ├── Testes de regressão                                                    │
│  ├── Testes de migração                                                     │
│  ├── Validação com usuários                                                 │
│  └── Correções                                                              │
│                                                                             │
│  FASE 7: Deploy e Limpeza (1 semana)                                        │
│  ├── Deploy em staging                                                      │
│  ├── Validação final                                                        │
│  ├── Deploy em produção                                                     │
│  ├── Remover colunas/tabelas obsoletas                                      │
│  └── Documentação final                                                     │
│                                                                             │
│  TOTAL ESTIMADO: 10 semanas                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Scripts de Migração

#### 6.2.1 Criar Nova Estrutura

```sql
-- migration_001_create_certifications.sql

-- 1. Criar enum de status da certificação
CREATE TYPE certification_status AS ENUM (
    'em_solicitacao',
    'ativa',
    'suspensa',
    'cancelada',
    'expirada'
);

CREATE TYPE scope_item_status AS ENUM (
    'ativo',
    'pendente',
    'removido'
);

-- 2. Criar tabela certifications
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    certification_number VARCHAR(50) UNIQUE,
    certification_type certification_type NOT NULL,
    industrial_group_id UUID REFERENCES industrial_groups(id),
    industrial_category_id UUID REFERENCES industrial_categories(id),
    industrial_subcategory_id UUID REFERENCES industrial_subcategories(id),
    status certification_status NOT NULL DEFAULT 'em_solicitacao',
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    analyst_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Criar tabela de escopo
CREATE TABLE certification_scopes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    description TEXT,
    production_capacity VARCHAR(255),
    num_employees INT,
    num_shifts INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_certification_scope UNIQUE (certification_id)
);

-- 4. Criar tabelas de itens do escopo
CREATE TABLE scope_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    origin product_origin,
    status scope_item_status DEFAULT 'ativo',
    added_at TIMESTAMP DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scope_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,
    name VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    facility_type VARCHAR(100),
    status scope_item_status DEFAULT 'ativo',
    added_at TIMESTAMP DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scope_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    status scope_item_status DEFAULT 'ativo',
    added_at TIMESTAMP DEFAULT NOW(),
    removed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scope_suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id UUID NOT NULL REFERENCES certification_scopes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    ingredient_type VARCHAR(255),
    has_halal_certificate BOOLEAN DEFAULT FALSE,
    status scope_item_status DEFAULT 'ativo',
    added_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Criar tabela de histórico
CREATE TABLE certification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    action_description TEXT,
    request_id UUID,
    document_id UUID,
    audit_id UUID,
    certificate_id UUID,
    performed_by UUID REFERENCES users(id),
    metadata JSONB,
    performed_at TIMESTAMP DEFAULT NOW()
);

-- 6. Criar índices
CREATE INDEX idx_certifications_company ON certifications(company_id);
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_certifications_valid_until ON certifications(valid_until);
CREATE INDEX idx_certifications_number ON certifications(certification_number);
CREATE INDEX idx_cert_history_certification ON certification_history(certification_id);
CREATE INDEX idx_cert_history_action ON certification_history(action);
CREATE INDEX idx_scope_products_scope ON scope_products(scope_id);
CREATE INDEX idx_scope_facilities_scope ON scope_facilities(scope_id);
```

#### 6.2.2 Migrar Dados Existentes

```sql
-- migration_002_migrate_data.sql

-- 1. Criar certificações a partir de requests+processes existentes
INSERT INTO certifications (
    id,
    company_id,
    certification_number,
    certification_type,
    industrial_group_id,
    industrial_category_id,
    industrial_subcategory_id,
    status,
    analyst_id,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    r.company_id,
    COALESCE(r.protocol, 'HS-' || EXTRACT(YEAR FROM r.created_at) || '-' ||
             LPAD(ROW_NUMBER() OVER (ORDER BY r.created_at)::TEXT, 5, '0')),
    r.certification_type,
    r.industrial_group_id,
    r.industrial_category_id,
    r.industrial_subcategory_id,
    CASE
        WHEN c.status = 'ativo' THEN 'ativa'::certification_status
        WHEN c.status = 'suspenso' THEN 'suspensa'::certification_status
        WHEN c.status = 'cancelado' THEN 'cancelada'::certification_status
        WHEN c.status = 'expirado' THEN 'expirada'::certification_status
        ELSE 'em_solicitacao'::certification_status
    END,
    p.analyst_id,
    r.created_at,
    r.updated_at
FROM requests r
LEFT JOIN processes p ON p.request_id = r.id
LEFT JOIN certificates c ON c.process_id = p.id;

-- 2. Criar mapeamento temporário request_id -> certification_id
CREATE TEMP TABLE request_certification_map AS
SELECT
    r.id AS request_id,
    cert.id AS certification_id
FROM requests r
JOIN certifications cert ON cert.certification_number LIKE '%' || r.protocol || '%'
   OR cert.company_id = r.company_id AND cert.created_at = r.created_at;

-- 3. Criar escopos
INSERT INTO certification_scopes (
    id,
    certification_id,
    description,
    production_capacity,
    created_at
)
SELECT
    uuid_generate_v4(),
    m.certification_id,
    r.product_description,
    r.estimated_production_capacity,
    r.created_at
FROM requests r
JOIN request_certification_map m ON m.request_id = r.id;

-- 4. Migrar instalações para scope_facilities
INSERT INTO scope_facilities (
    scope_id,
    address,
    city,
    state,
    country,
    postal_code,
    status,
    added_at
)
SELECT
    cs.id,
    r.facility_address,
    r.facility_city,
    r.facility_state,
    r.facility_country,
    r.facility_postal_code,
    'ativo'::scope_item_status,
    r.created_at
FROM requests r
JOIN request_certification_map m ON m.request_id = r.id
JOIN certification_scopes cs ON cs.certification_id = m.certification_id
WHERE r.facility_address IS NOT NULL;

-- 5. Adicionar certification_id nas tabelas existentes
ALTER TABLE documents ADD COLUMN IF NOT EXISTS certification_id UUID REFERENCES certifications(id);
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS certification_id UUID REFERENCES certifications(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS certification_id UUID REFERENCES certifications(id);
ALTER TABLE audits ADD COLUMN IF NOT EXISTS certification_id UUID REFERENCES certifications(id);
ALTER TABLE audits ADD COLUMN IF NOT EXISTS auditor_id UUID REFERENCES users(id);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS certification_id UUID REFERENCES certifications(id);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS issued_by UUID REFERENCES users(id);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;

-- 6. Popular certification_id nos documents
UPDATE documents d
SET certification_id = m.certification_id
FROM request_certification_map m
WHERE d.request_id = m.request_id;

-- 7. Popular certification_id nos outros (via process)
UPDATE proposals p
SET certification_id = (
    SELECT m.certification_id
    FROM request_certification_map m
    JOIN processes pr ON pr.request_id = m.request_id
    WHERE pr.id = p.process_id
);

UPDATE contracts c
SET certification_id = (
    SELECT m.certification_id
    FROM request_certification_map m
    JOIN processes pr ON pr.request_id = m.request_id
    WHERE pr.id = c.process_id
);

UPDATE audits a
SET certification_id = (
    SELECT m.certification_id
    FROM request_certification_map m
    JOIN processes pr ON pr.request_id = m.request_id
    WHERE pr.id = a.process_id
);

UPDATE certificates c
SET certification_id = (
    SELECT m.certification_id
    FROM request_certification_map m
    JOIN processes pr ON pr.request_id = m.request_id
    WHERE pr.id = c.process_id
);

-- 8. Criar índices nas novas colunas
CREATE INDEX idx_documents_certification ON documents(certification_id);
CREATE INDEX idx_proposals_certification ON proposals(certification_id);
CREATE INDEX idx_contracts_certification ON contracts(certification_id);
CREATE INDEX idx_audits_certification ON audits(certification_id);
CREATE INDEX idx_certificates_certification ON certificates(certification_id);
```

---

## 7. Impactos da Migração

### 7.1 Impactos no Backend

| Módulo | Impacto | Ação |
|--------|---------|------|
| `RequestModule` | **ALTO** | Renomear para `CertificationRequestModule`, remover dados de escopo |
| `ProcessModule` | **ALTO** | Renomear para `WorkflowModule`, vincular a Request não a Company |
| `DocumentModule` | **MÉDIO** | Adicionar `certificationId`, manter `requestId` como opcional |
| `ProposalModule` | **MÉDIO** | Adicionar `certificationId` |
| `ContractModule` | **MÉDIO** | Adicionar `certificationId` |
| `AuditModule` | **MÉDIO** | Adicionar `certificationId` e `auditorId` |
| `CertificateModule` | **MÉDIO** | Adicionar `certificationId`, `issuedBy`, `version` |
| **NOVO** `CertificationModule` | **CRIAR** | Entidade central, CRUD, timeline |
| **NOVO** `ScopeModule` | **CRIAR** | Gestão de escopo (produtos, instalações, etc) |

### 7.2 Impactos no Frontend

| Tela/Componente | Impacto | Ação |
|-----------------|---------|------|
| Wizard de Solicitação | **ALTO** | Implementar 3 fluxos diferenciados |
| Dashboard da Empresa | **ALTO** | Mostrar certificações (não requests) |
| Lista de Processos | **MÉDIO** | Ajustar para mostrar certificações |
| Detalhes do Processo | **ALTO** | Nova tela de certificação com timeline |
| Upload de Documentos | **BAIXO** | Ajustar FK |
| Gestão de Auditorias | **MÉDIO** | Vincular a certificação |
| Emissão de Certificado | **MÉDIO** | Adicionar versão, vincular a certificação |
| **NOVA** Tela de Escopo | **CRIAR** | Visualizar/editar produtos, instalações |
| **NOVA** Timeline | **CRIAR** | Histórico unificado da certificação |

### 7.3 Impactos em APIs

| Endpoint Atual | Endpoint Novo | Breaking Change? |
|----------------|---------------|------------------|
| `POST /requests` | `POST /certifications/requests` | Sim |
| `GET /requests/:id` | `GET /certification-requests/:id` | Sim |
| `GET /processes/:id` | `GET /workflows/:id` | Sim |
| `POST /documents` | `POST /certifications/:id/documents` | Sim |
| - | `GET /certifications/:id` | Novo |
| - | `GET /certifications/:id/scope` | Novo |
| - | `GET /certifications/:id/timeline` | Novo |
| - | `POST /certifications/:id/requests` | Novo (renovação/ajuste) |

### 7.4 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Perda de dados na migração | Baixa | Alto | Backup completo, scripts de rollback |
| Inconsistência de FKs | Média | Alto | Validação em cada etapa, constraints |
| Downtime durante migração | Média | Médio | Migração em horário de baixo uso, modo manutenção |
| Bugs no novo wizard | Alta | Médio | Testes extensivos, feature flag |
| Resistência dos usuários | Média | Baixo | Documentação, treinamento |

---

## 8. Cronograma Sugerido

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CRONOGRAMA DE MIGRAÇÃO                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SEMANA 1: Preparação                                                       │
│  ══════════════════════                                                     │
│  [ ] Backup completo do banco de dados                                      │
│  [ ] Criar branch: feature/certification-restructure                        │
│  [ ] Documentar estado atual de todas as tabelas                            │
│  [ ] Criar scripts de rollback                                              │
│  [ ] Revisar e aprovar este documento com a equipe                          │
│                                                                             │
│  SEMANA 2: Criação de Novas Tabelas                                         │
│  ════════════════════════════════════                                       │
│  [ ] Criar migration: certifications                                        │
│  [ ] Criar migration: certification_scopes                                  │
│  [ ] Criar migration: scope_products, scope_facilities, scope_brands        │
│  [ ] Criar migration: certification_history                                 │
│  [ ] Criar novos enums                                                      │
│  [ ] Testar em ambiente de desenvolvimento                                  │
│                                                                             │
│  SEMANAS 3-4: Migração de Dados                                             │
│  ══════════════════════════════                                             │
│  [ ] Script: criar certifications a partir de requests+processes            │
│  [ ] Script: migrar dados de escopo                                         │
│  [ ] Script: adicionar certification_id em documents                        │
│  [ ] Script: adicionar certification_id em proposals                        │
│  [ ] Script: adicionar certification_id em contracts                        │
│  [ ] Script: adicionar certification_id e auditor_id em audits              │
│  [ ] Script: adicionar certification_id, issued_by em certificates          │
│  [ ] Validar integridade dos dados migrados                                 │
│  [ ] Testar queries de consulta                                             │
│                                                                             │
│  SEMANAS 5-6: Atualização do Backend                                        │
│  ═══════════════════════════════════                                        │
│  [ ] Criar CertificationModule (entity, service, controller)                │
│  [ ] Criar ScopeModule (products, facilities, brands, suppliers)            │
│  [ ] Criar CertificationHistoryModule                                       │
│  [ ] Atualizar RequestModule → CertificationRequestModule                   │
│  [ ] Atualizar ProcessModule → WorkflowModule                               │
│  [ ] Atualizar DocumentModule (nova FK)                                     │
│  [ ] Atualizar AuditModule (nova FK + auditorId)                            │
│  [ ] Atualizar CertificateModule (nova FK + issuedBy + version)             │
│  [ ] Criar novos endpoints de API                                           │
│  [ ] Atualizar Swagger/OpenAPI                                              │
│                                                                             │
│  SEMANAS 7-8: Atualização do Frontend                                       │
│  ════════════════════════════════════                                       │
│  [ ] Novo wizard: fluxo Nova Certificação                                   │
│  [ ] Novo wizard: fluxo Renovação                                           │
│  [ ] Novo wizard: fluxo Manutenção/Ajuste                                   │
│  [ ] Nova tela: Detalhes da Certificação                                    │
│  [ ] Nova tela: Gestão de Escopo                                            │
│  [ ] Novo componente: Timeline unificada                                    │
│  [ ] Atualizar Dashboard da Empresa                                         │
│  [ ] Atualizar telas de listagem                                            │
│                                                                             │
│  SEMANA 9: Testes e Validação                                               │
│  ════════════════════════════════                                           │
│  [ ] Testes unitários dos novos módulos                                     │
│  [ ] Testes de integração                                                   │
│  [ ] Testes E2E dos novos fluxos                                            │
│  [ ] Testes de regressão                                                    │
│  [ ] Validação com usuários piloto                                          │
│  [ ] Correção de bugs encontrados                                           │
│                                                                             │
│  SEMANA 10: Deploy e Limpeza                                                │
│  ═══════════════════════════                                                │
│  [ ] Deploy em ambiente de staging                                          │
│  [ ] Validação final com stakeholders                                       │
│  [ ] Deploy em produção                                                     │
│  [ ] Monitoramento pós-deploy                                               │
│  [ ] Remover colunas obsoletas (após período de estabilização)              │
│  [ ] Atualizar documentação final                                           │
│  [ ] Retrospectiva e lições aprendidas                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Glossário Final

| Termo | Definição | Tabela |
|-------|-----------|--------|
| **Empresa** | Organização que busca certificação | `companies` |
| **Certificação** | Entidade central que vive por anos, contém todo o histórico | `certifications` |
| **Escopo** | O que está sendo certificado (produtos, instalações, marcas) | `certification_scopes` + `scope_*` |
| **Solicitação** | Pedido específico (nova, renovação, ajuste) | `certification_requests` |
| **Workflow** | Controle de fases de uma solicitação | `request_workflows` |
| **Documento** | Arquivo vinculado à certificação | `documents` |
| **Proposta** | Orçamento comercial | `proposals` |
| **Contrato** | Acordo formal assinado | `contracts` |
| **Auditoria** | Verificação (inicial, vigilância, renovação) | `audits` |
| **Certificado** | Documento/comprovante emitido | `certificates` |
| **Timeline** | Histórico de todas as ações | `certification_history` |

---

## 10. Próximos Passos Imediatos

1. [x] **Revisar este documento** com a equipe de desenvolvimento ✓ 2026-01-20
2. [x] **Aprovar a abordagem** com stakeholders ✓ 2026-01-20
3. [x] **Criar backlog** de tasks no sistema de gestão ✓ 2026-01-20 → [BACKLOG-MIGRACAO-CERTIFICACOES.md](./BACKLOG-MIGRACAO-CERTIFICACOES.md)
4. [ ] **Iniciar Fase 1** (Preparação) na próxima sprint
5. [ ] **Definir responsáveis** para cada fase

---

*Documento criado em 2026-01-20*
*Versão 2.0 - Reestruturação completa baseada na visão de negócio*