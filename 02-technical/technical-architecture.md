# Technical Architecture Document: HalalSphere
**Sistema Inteligente de Gestão de Certificação Halal com IA**

---

## Document Control

| Campo | Valor |
|-------|-------|
| **Versão** | 1.0 |
| **Data** | 13 de Novembro de 2025 |
| **Autor** | Tech Lead - HalalSphere Team |
| **Baseado em** | PRD v2.0 (69 User Stories, 594 SP) |
| **Status** | Draft - Em Desenvolvimento |
| **Aprovadores** | CTO, Arquiteto de Software, DBA |

---

## Índice

1. [Stack Tecnológica](#1-stack-tecnológica)
2. [Arquitetura de Sistema](#2-arquitetura-de-sistema)
3. [Database Schema (ERD)](#3-database-schema-erd)
4. [Dicionário de Dados](#4-dicionário-de-dados)
5. [DDL - Criação de Tabelas](#5-ddl---criação-de-tabelas)
6. [Índices e Performance](#6-índices-e-performance)
7. [Migrations Strategy](#7-migrations-strategy)
8. [APIs e Integrações](#8-apis-e-integrações)
9. [Segurança Técnica](#9-segurança-técnica)
10. [Infraestrutura e DevOps](#10-infraestrutura-e-devops)

---

# 1. Stack Tecnológica

## 1.1 Frontend

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Framework** | React | 18+ | Ecossistema maduro, componentes reutilizáveis, performance |
| **Linguagem** | TypeScript | 5+ | Type safety, melhor DX, menos bugs em produção |
| **Build Tool** | Vite | 5+ | Build rápido, HMR instantâneo, tree-shaking |
| **Routing** | React Router | 6+ | Padrão de mercado, nested routes |
| **State Management** | Zustand | 4+ | Simples, performático, menos boilerplate que Redux |
| **Forms** | React Hook Form | 7+ | Performance, validação integrada, menos re-renders |
| **Validação** | Zod | 3+ | Type-safe, integra com React Hook Form |
| **UI Components** | shadcn/ui + Radix UI | - | Acessível (WCAG AA), customizável, headless |
| **Styling** | Tailwind CSS | 3+ | Utility-first, design system consistente, bundle pequeno |
| **i18n** | i18next | 23+ | Suporte RTL (árabe), plurals, interpolação |
| **Data Fetching** | TanStack Query | 5+ | Cache inteligente, optimistic updates, retry |
| **Drag & Drop** | @dnd-kit | 6+ | Acessível, touch-friendly, performático (Kanban) |
| **Charts** | Recharts | 2+ | Declarativo, responsivo, customizável |
| **PDF Viewer** | react-pdf | 7+ | Visualização de certificados |
| **Rich Text** | Tiptap | 2+ | Editor para comentários, relatórios |
| **Date Picker** | date-fns | 3+ | i18n, timezone-aware |
| **Testing** | Vitest + Testing Library | - | Testes unitários e integração |
| **E2E Testing** | Playwright | 1+ | Cross-browser, paralelo, CI-friendly |

---

## 1.2 Backend

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Runtime** | Node.js | 20 LTS | Performance, ecossistema, async I/O |
| **Framework** | NestJS + Express | 11+ | Modular, DI nativo, decorators, ecossistema maduro |
| **Linguagem** | TypeScript | 5+ | Type safety compartilhado com frontend |
| **ORM** | Prisma | 5+ | Type-safe, migrations automáticas, schema visual |
| **Validação** | Zod | 3+ | Compartilhado com frontend, runtime validation |
| **Auth** | Passport.js + JWT | - | Estratégias flexíveis, MFA support |
| **File Upload** | Multer | 1+ | Multipart/form-data, size limits |
| **PDF Generation** | Puppeteer | 21+ | HTML → PDF (certificados com QR code) |
| **Email** | Nodemailer + SendGrid | - | Templates, tracking, deliverability |
| **Queue** | BullMQ + Redis | - | Jobs assíncronos (IA, emails, PDFs) |
| **Logging** | Pino | 8+ | Structured logs, performance |
| **API Docs** | Swagger/OpenAPI | 3.0 | Auto-gerado via @nestjs/swagger |
| **Testing** | Jest + Supertest | - | Unit + integration tests |
| **Code Quality** | ESLint + Prettier | - | Linting + formatting |

---

## 1.3 Inteligência Artificial

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **LLM Provider** | OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet | Análise de documentos, chatbot RAG |
| **Embeddings** | OpenAI text-embedding-3-large | Vetorização para RAG (512 dimensões) |
| **Vector DB** | PostgreSQL pgvector | Evita dependência adicional, busca semântica |
| **LLM Framework** | LangChain.js | Chains, RAG pipeline, prompt templates |
| **Fallback Local** | Ollama + Llama 3.1 70B | Contingência se APIs externas falharem |

---

## 1.4 Database e Storage

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Primary DB** | PostgreSQL | 16+ | ACID, JSON support, pgvector, full-text search |
| **Extensões PG** | pgvector, pg_trgm, uuid-ossp | Vector search, fuzzy search, UUIDs |
| **Cache** | Redis | 7+ | Session store, queue, rate limiting |
| **Object Storage** | AWS S3 / MinIO | - | Documentos, certificados, uploads |
| **File Organization** | `/uploads/{company_id}/{process_id}/{file_id}` | Isolamento por empresa |

---

## 1.5 Infraestrutura

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **Cloud Provider** | AWS (ou GCP) | Confiabilidade, serviços gerenciados |
| **Containers** | Docker | Reprodutibilidade, isolamento |
| **Orchestration** | Kubernetes (EKS) | Auto-scaling, resilience |
| **CI/CD** | GitHub Actions | Integração nativa, workflows YAML |
| **Monitoramento** | Grafana + Prometheus | Dashboards, alertas |
| **Logs** | Grafana Loki | Centralizado, integrado com Grafana |
| **APM** | Sentry | Error tracking, performance |
| **Secrets** | AWS Secrets Manager | Rotação automática, auditoria |

---

# 2. Arquitetura de Sistema

## 2.1 Diagrama de Arquitetura (Alto Nível)

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp[Web App React+TS]
        MobileApp[Mobile PWA]
    end

    subgraph "CDN + Load Balancer"
        CloudFront[CloudFront CDN]
        ALB[Application Load Balancer]
    end

    subgraph "API Layer"
        API1[API Server 1<br/>NestJS+Express+TS]
        API2[API Server 2<br/>NestJS+Express+TS]
        API3[API Server N<br/>Auto-scaling]
    end

    subgraph "Background Jobs"
        Worker1[Worker 1<br/>IA Analysis]
        Worker2[Worker 2<br/>PDF Generation]
        Worker3[Worker 3<br/>Emails]
        Queue[BullMQ + Redis]
    end

    subgraph "Data Layer"
        PG[(PostgreSQL 16<br/>Primary + Replicas)]
        Redis[(Redis<br/>Cache + Sessions)]
        S3[(S3<br/>Documents)]
    end

    subgraph "External Services"
        OpenAI[OpenAI API<br/>GPT-4o]
        Anthropic[Anthropic API<br/>Claude 3.5]
        Stripe[Stripe<br/>Payments]
        SendGrid[SendGrid<br/>Emails]
    end

    WebApp --> CloudFront
    MobileApp --> CloudFront
    CloudFront --> ALB
    ALB --> API1
    ALB --> API2
    ALB --> API3

    API1 --> PG
    API2 --> PG
    API3 --> PG

    API1 --> Redis
    API2 --> Redis
    API3 --> Redis

    API1 --> S3
    API2 --> S3
    API3 --> S3

    API1 --> Queue
    API2 --> Queue
    API3 --> Queue

    Queue --> Worker1
    Queue --> Worker2
    Queue --> Worker3

    Worker1 --> OpenAI
    Worker1 --> Anthropic
    Worker1 --> PG
    Worker1 --> S3

    Worker2 --> PG
    Worker2 --> S3

    Worker3 --> SendGrid
    Worker3 --> PG

    API1 --> Stripe
```

---

## 2.2 Fluxo de Dados Críticos

### 2.2.1 Fluxo: Criar Solicitação (US-002 Wizard)

```
1. Frontend: Usuário preenche wizard (9 etapas)
   ├─ Auto-save a cada campo (debounced 500ms)
   └─ Validação client-side (Zod)

2. API POST /api/requests
   ├─ Validação server-side (Zod)
   ├─ Autenticação JWT
   ├─ RBAC check (apenas role=empresa)
   └─ Transação SQL:
       ├─ INSERT INTO requests
       ├─ INSERT INTO products (bulk)
       └─ INSERT INTO certification_processes

3. Background Job: Enqueue "calculate-cost"
   ├─ Worker processa algoritmo multi-variável
   └─ UPDATE requests SET estimated_cost

4. Response 201: {request_id, process_id, estimated_cost}
```

---

### 2.2.2 Fluxo: Análise IA Pré-Auditoria (US-047)

```
1. Frontend: Analista clica "Analisar com IA"

2. API POST /api/processes/{id}/analyze
   ├─ Autenticação JWT (role=analista)
   ├─ Verifica documentos anexados (min 3)
   └─ Enqueue job "ai-pre-audit"

3. Worker IA:
   ├─ Busca documentos do S3
   ├─ Extrai texto (OCR se imagem)
   ├─ Monta prompt com PR 7.1 Rev 21
   ├─ LLM Analysis (OpenAI/Anthropic)
   │   └─ Retry 3x se falhar
   ├─ Parse resposta estruturada (JSON)
   └─ INSERT INTO ai_analysis

4. Notificação Real-time (WebSocket):
   └─ "Análise IA concluída: 87% conformidade"

5. Email: "Sua análise está pronta"
```

---

### 2.2.3 Fluxo: Emissão de Certificado (US-044)

```
1. Frontend: Gestor aprova e clica "Emitir Certificado"

2. API POST /api/processes/{id}/issue-certificate
   ├─ RBAC check (role=gestor)
   ├─ Verifica: comitê aprovado + pagamento confirmado
   └─ Transação SQL:
       ├─ INSERT INTO certificates
       ├─ UPDATE certification_processes SET phase=12
       └─ INSERT INTO audit_trail

3. Background Job: "generate-certificate-pdf"
   ├─ Busca dados do processo
   ├─ Renderiza template HTML (i18n)
   ├─ Gera QR Code (URL verificação)
   ├─ Puppeteer: HTML → PDF
   └─ Upload S3: /certificates/{cert_id}.pdf

4. Background Job: "send-certificate-email"
   ├─ Template multilíngue
   ├─ Anexo: PDF
   └─ SendGrid delivery

5. Notificação: "Certificado emitido! 🎉"
```

---

# 3. Database Schema (ERD)

## 3.1 Diagrama Entidade-Relacionamento (Resumido)

```mermaid
erDiagram
    users ||--o{ companies : "pertence"
    users ||--o{ certification_processes : "cria/gerencia"
    companies ||--o{ requests : "solicita"
    requests ||--|| certification_processes : "gera"
    certification_processes ||--o{ products : "certifica"
    certification_processes ||--o{ documents : "anexa"
    certification_processes ||--o{ contracts : "possui"
    certification_processes ||--o{ audits : "realiza"
    certification_processes ||--o{ committee_decisions : "delibera"
    certification_processes ||--o| certificates : "emite"
    certification_processes ||--o{ ai_analysis : "analisa"
    certification_processes ||--o{ process_history : "rastreia"

    audits ||--|| audit_schedules : "agenda"
    audits ||--o{ audit_checklists : "preenche"

    users ||--o{ notifications : "recebe"
    users ||--o{ chat_messages : "conversa"
    users ||--o{ audit_trail : "executa ação"

    product_categories ||--o{ products : "categoriza"

    users {
        uuid id PK
        string email UK
        string password_hash
        enum role
        jsonb mfa_config
        timestamp created_at
    }

    companies {
        uuid id PK
        uuid user_id FK
        string cnpj UK
        string name
        jsonb address
        jsonb contact
    }

    certification_processes {
        uuid id PK
        uuid request_id FK
        uuid company_id FK
        uuid analyst_id FK
        int current_phase
        enum status
        timestamp created_at
    }

    products {
        uuid id PK
        uuid process_id FK
        uuid category_id FK
        string name
        enum origin
        jsonb composition
    }

    certificates {
        uuid id PK
        uuid process_id FK
        string certificate_number UK
        date valid_from
        date valid_until
        string pdf_url
        string qr_code
    }
```

---

## 3.2 Diagrama Detalhado (15 Tabelas Principais)

```mermaid
erDiagram
    %% === CORE ENTITIES ===

    users {
        uuid id PK
        string email UK "NOT NULL"
        string password_hash "bcrypt"
        enum role "empresa|analista|auditor|gestor"
        string name "NOT NULL"
        string phone
        jsonb mfa_config "TOTP settings"
        boolean mfa_enabled "default false"
        int login_attempts "rate limiting"
        timestamp locked_until "account lock"
        timestamp last_login
        timestamp created_at
        timestamp updated_at
    }

    companies {
        uuid id PK
        uuid user_id FK "users.id"
        string cnpj UK "14 digits"
        string razao_social "NOT NULL"
        string nome_fantasia
        jsonb address "CEP, rua, cidade, UF"
        jsonb contact "email, phone, whatsapp"
        string website
        int num_employees
        decimal annual_revenue
        text main_activity
        timestamp created_at
        timestamp updated_at
    }

    %% === CERTIFICATION WORKFLOW ===

    requests {
        uuid id PK
        uuid company_id FK "companies.id"
        enum type "nova|renovacao|ampliacao"
        enum certification_type "C1|C2|C3|C4|C5|C6"
        int num_products
        jsonb additional_info "perguntas wizard"
        decimal estimated_cost "calculado por IA"
        enum status "rascunho|enviado|em_analise|aprovado|rejeitado"
        timestamp submitted_at
        timestamp created_at
        timestamp updated_at
    }

    certification_processes {
        uuid id PK
        uuid request_id FK UK "requests.id"
        uuid company_id FK "companies.id"
        uuid analyst_id FK "users.id (analista)"
        uuid auditor_id FK "users.id (auditor)"
        int current_phase "1-12 conforme PR 7.1"
        enum status "em_andamento|pendente|concluido|cancelado|suspenso"
        date deadline
        int priority "1-5, calculado dinamicamente"
        jsonb phase_metadata "dados específicos por fase"
        timestamp started_at
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
    }

    process_history {
        uuid id PK
        uuid process_id FK "certification_processes.id"
        int from_phase
        int to_phase
        uuid changed_by FK "users.id"
        text reason
        jsonb metadata
        timestamp created_at
    }

    %% === PRODUCTS ===

    product_categories {
        uuid id PK
        string code UK "C1|C2|C3|C4|C5|C6"
        string name_pt "Carne e derivados"
        string name_en
        string name_ar
        string name_tr
        text description
        string standard_reference "GSO 2055-2 seção X"
        jsonb requirements "requisitos específicos"
        timestamp created_at
    }

    products {
        uuid id PK
        uuid process_id FK "certification_processes.id"
        uuid category_id FK "product_categories.id"
        string name "NOT NULL"
        enum origin "animal|vegetal|misto|quimico"
        text description
        jsonb composition "ingredientes, percentuais"
        jsonb manufacturing_process "etapas"
        string ncm_code "código NCM fiscal"
        boolean is_exported
        jsonb export_countries "lista de países"
        timestamp created_at
        timestamp updated_at
    }

    %% === DOCUMENTS ===

    documents {
        uuid id PK
        uuid process_id FK "certification_processes.id"
        uuid uploaded_by FK "users.id"
        enum type "contrato_social|licenca|fotos|videos|laudos|outros"
        string original_filename
        string storage_key "S3 path"
        string mime_type
        bigint file_size "bytes"
        string checksum "SHA-256"
        boolean is_required
        enum validation_status "pendente|aprovado|rejeitado"
        text rejection_reason
        timestamp validated_at
        uuid validated_by FK "users.id"
        timestamp created_at
    }

    %% === CONTRACTS ===

    contracts {
        uuid id PK
        uuid process_id FK "certification_processes.id"
        enum type "proposta|contrato"
        string contract_number UK
        decimal total_value "BRL"
        int installments "parcelas"
        text payment_terms
        jsonb line_items "detalhamento custos"
        text special_clauses
        enum status "rascunho|enviado|em_negociacao|assinado|cancelado"
        timestamp sent_at
        timestamp signed_at
        string signature_ip
        jsonb signature_metadata "device, location"
        string pdf_url "contrato assinado"
        timestamp created_at
        timestamp updated_at
    }

    %% === AUDITS ===

    audit_schedules {
        uuid id PK
        uuid auditor_id FK "users.id"
        date schedule_date
        time start_time
        time end_time
        enum status "disponivel|bloqueado|confirmado"
        text notes
        timestamp created_at
    }

    audits {
        uuid id PK
        uuid process_id FK "certification_processes.id"
        uuid auditor_id FK "users.id"
        uuid schedule_id FK "audit_schedules.id"
        enum type "estagio1|estagio2|vigilancia|especial"
        date scheduled_date
        time scheduled_time
        jsonb location "empresa.address ou remoto"
        enum status "agendado|em_andamento|concluido|cancelado"
        int duration_minutes
        text observations
        decimal score "0-100"
        enum result "aprovado|aprovado_condicional|reprovado"
        timestamp started_at
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
    }

    audit_checklists {
        uuid id PK
        uuid audit_id FK "audits.id"
        string checklist_template "PR 7.1 Rev 21 seção X"
        jsonb items "array de {question, answer, evidence, notes}"
        int total_items
        int conforming_items
        int non_conforming_items
        decimal compliance_percentage
        timestamp created_at
        timestamp updated_at
    }

    %% === COMMITTEE & CERTIFICATES ===

    committee_decisions {
        uuid id PK
        uuid process_id FK "certification_processes.id"
        uuid decided_by FK "users.id (gestor)"
        enum decision "aprovar|reprovar|solicitar_info"
        text justification "NOT NULL"
        jsonb voting_details "se votação"
        timestamp decided_at
        timestamp created_at
    }

    certificates {
        uuid id PK
        uuid process_id FK UK "certification_processes.id"
        string certificate_number UK "HS-YYYY-NNNNN"
        date issued_date
        date valid_from
        date valid_until "3 anos"
        jsonb certified_products "lista completa"
        string pdf_url "S3 path"
        string qr_code_data "URL verificação"
        enum status "ativo|suspenso|cancelado|expirado"
        text suspension_reason
        timestamp suspended_at
        timestamp created_at
        timestamp updated_at
    }

    %% === AI & CHAT ===

    ai_analysis {
        uuid id PK
        uuid process_id FK "certification_processes.id"
        uuid requested_by FK "users.id"
        enum analysis_type "pre_auditoria|risco|chatbot"
        string model_used "gpt-4o|claude-3.5-sonnet"
        jsonb input_data "documentos, contexto"
        jsonb output_data "resultados estruturados"
        decimal confidence_score "0.0-1.0"
        int tokens_used
        decimal cost_usd
        int processing_time_ms
        enum status "pendente|concluido|erro"
        text error_message
        timestamp created_at
    }

    chat_messages {
        uuid id PK
        uuid process_id FK "certification_processes.id (nullable)"
        uuid user_id FK "users.id"
        enum role "user|assistant|system"
        text message "NOT NULL"
        jsonb metadata "context, intent"
        string session_id "agrupar conversas"
        boolean is_resolved
        timestamp created_at
    }

    %% === NOTIFICATIONS & AUDIT TRAIL ===

    notifications {
        uuid id PK
        uuid user_id FK "users.id"
        enum type "info|warning|error|success"
        string title "NOT NULL"
        text message
        jsonb action_url "link para ação"
        boolean is_read "default false"
        timestamp read_at
        timestamp created_at
    }

    audit_trail {
        uuid id PK
        uuid user_id FK "users.id"
        enum entity_type "process|contract|certificate|etc"
        uuid entity_id "ID da entidade afetada"
        enum action "create|update|delete|approve|reject"
        jsonb old_values "antes da mudança"
        jsonb new_values "depois da mudança"
        string ip_address
        string user_agent
        timestamp created_at
    }

    %% === RELATIONSHIPS ===

    users ||--o{ companies : "user_id"
    companies ||--o{ requests : "company_id"
    requests ||--|| certification_processes : "request_id"
    certification_processes ||--o{ products : "process_id"
    certification_processes ||--o{ documents : "process_id"
    certification_processes ||--o{ contracts : "process_id"
    certification_processes ||--o{ audits : "process_id"
    certification_processes ||--o{ committee_decisions : "process_id"
    certification_processes ||--|| certificates : "process_id"
    certification_processes ||--o{ ai_analysis : "process_id"
    certification_processes ||--o{ process_history : "process_id"

    users ||--o{ audits : "auditor_id"
    users ||--o{ audit_schedules : "auditor_id"
    audit_schedules ||--o{ audits : "schedule_id"
    audits ||--o{ audit_checklists : "audit_id"

    product_categories ||--o{ products : "category_id"

    users ||--o{ notifications : "user_id"
    users ||--o{ chat_messages : "user_id"
    users ||--o{ audit_trail : "user_id"
    users ||--o{ documents : "uploaded_by"
```

---

# 4. Dicionário de Dados

## 4.1 Tabela: `users`

Armazena todos os usuários do sistema (4 roles).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Identificador único |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email de login |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hash (cost=12) |
| `role` | ENUM | NOT NULL | 'empresa', 'analista', 'auditor', 'gestor' |
| `name` | VARCHAR(255) | NOT NULL | Nome completo |
| `phone` | VARCHAR(20) | NULL | Telefone (formato internacional) |
| `mfa_config` | JSONB | NULL | `{secret, backup_codes[]}` para TOTP |
| `mfa_enabled` | BOOLEAN | NOT NULL, DEFAULT false | MFA ativado? |
| `login_attempts` | INTEGER | NOT NULL, DEFAULT 0 | Tentativas de login (rate limiting) |
| `locked_until` | TIMESTAMP | NULL | Bloqueio temporário (após 5 tentativas) |
| `last_login` | TIMESTAMP | NULL | Último login bem-sucedido |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualização |

**Índices**:
- `idx_users_email` (UNIQUE)
- `idx_users_role`

---

## 4.2 Tabela: `companies`

Dados cadastrais das empresas solicitantes.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | Identificador único |
| `user_id` | UUID | FK users(id), NOT NULL | Usuário proprietário |
| `cnpj` | VARCHAR(14) | UNIQUE, NOT NULL | CNPJ (apenas números) |
| `razao_social` | VARCHAR(255) | NOT NULL | Razão social |
| `nome_fantasia` | VARCHAR(255) | NULL | Nome fantasia |
| `address` | JSONB | NOT NULL | `{cep, logradouro, numero, complemento, bairro, cidade, uf, pais}` |
| `contact` | JSONB | NOT NULL | `{email, telefone, whatsapp, responsavel}` |
| `website` | VARCHAR(255) | NULL | Site da empresa |
| `num_employees` | INTEGER | NULL | Número de funcionários |
| `annual_revenue` | DECIMAL(15,2) | NULL | Faturamento anual (BRL) |
| `main_activity` | TEXT | NULL | Atividade principal (CNAE) |
| `created_at` | TIMESTAMP | NOT NULL | Data de cadastro |
| `updated_at` | TIMESTAMP | NOT NULL | Última atualização |

**Índices**:
- `idx_companies_cnpj` (UNIQUE)
- `idx_companies_user_id`

---

## 4.3 Tabela: `requests`

Solicitações iniciais de certificação (output do wizard US-002).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da solicitação |
| `company_id` | UUID | FK companies(id), NOT NULL | Empresa solicitante |
| `type` | ENUM | NOT NULL | 'nova', 'renovacao', 'ampliacao' |
| `certification_type` | ENUM | NOT NULL | 'C1', 'C2', 'C3', 'C4', 'C5', 'C6' (GSO 2055-2) |
| `num_products` | INTEGER | NOT NULL | Quantidade de produtos |
| `additional_info` | JSONB | NULL | Respostas do wizard (etapas 1-6) |
| `estimated_cost` | DECIMAL(15,2) | NULL | Calculado pela IA (US-005) |
| `status` | ENUM | NOT NULL, DEFAULT 'rascunho' | 'rascunho', 'enviado', 'em_analise', 'aprovado', 'rejeitado' |
| `submitted_at` | TIMESTAMP | NULL | Quando foi enviada |
| `created_at` | TIMESTAMP | NOT NULL | Início do preenchimento |
| `updated_at` | TIMESTAMP | NOT NULL | Último auto-save |

**Índices**:
- `idx_requests_company_id`
- `idx_requests_status`

---

## 4.4 Tabela: `certification_processes`

Processo completo de certificação (12 fases PR 7.1).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do processo |
| `request_id` | UUID | FK requests(id), UNIQUE, NOT NULL | Solicitação origem |
| `company_id` | UUID | FK companies(id), NOT NULL | Empresa |
| `analyst_id` | UUID | FK users(id), NULL | Analista responsável |
| `auditor_id` | UUID | FK users(id), NULL | Auditor designado |
| `current_phase` | INTEGER | NOT NULL, DEFAULT 1 | Fase atual (1-12) |
| `status` | ENUM | NOT NULL | 'em_andamento', 'pendente', 'concluido', 'cancelado', 'suspenso' |
| `deadline` | DATE | NULL | Prazo de conclusão |
| `priority` | INTEGER | DEFAULT 3 | 1 (urgente) - 5 (baixa) |
| `phase_metadata` | JSONB | NULL | Dados específicos de cada fase |
| `started_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Início do processo |
| `completed_at` | TIMESTAMP | NULL | Conclusão do processo |
| `created_at` | TIMESTAMP | NOT NULL | Criação do registro |
| `updated_at` | TIMESTAMP | NOT NULL | Última atualização |

**Índices**:
- `idx_processes_request_id` (UNIQUE)
- `idx_processes_company_id`
- `idx_processes_analyst_id`
- `idx_processes_current_phase`
- `idx_processes_status`
- `idx_processes_priority`

---

## 4.5 Tabela: `products`

Produtos a serem certificados em cada processo.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do produto |
| `process_id` | UUID | FK certification_processes(id), NOT NULL | Processo relacionado |
| `category_id` | UUID | FK product_categories(id), NOT NULL | Categoria (C1-C6) |
| `name` | VARCHAR(255) | NOT NULL | Nome do produto |
| `origin` | ENUM | NOT NULL | 'animal', 'vegetal', 'misto', 'quimico' |
| `description` | TEXT | NULL | Descrição detalhada |
| `composition` | JSONB | NULL | `[{ingredient, percentage}]` |
| `manufacturing_process` | JSONB | NULL | Etapas de fabricação |
| `ncm_code` | VARCHAR(8) | NULL | Código NCM fiscal |
| `is_exported` | BOOLEAN | DEFAULT false | Produto será exportado? |
| `export_countries` | JSONB | NULL | `['BR', 'UAE', 'SAU']` |
| `created_at` | TIMESTAMP | NOT NULL | Data de cadastro |
| `updated_at` | TIMESTAMP | NOT NULL | Última atualização |

**Índices**:
- `idx_products_process_id`
- `idx_products_category_id`

---

## 4.6 Tabela: `certificates`

Certificados Halal emitidos (US-044).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do certificado |
| `process_id` | UUID | FK certification_processes(id), UNIQUE, NOT NULL | Processo certificado |
| `certificate_number` | VARCHAR(50) | UNIQUE, NOT NULL | 'HS-2025-00001' |
| `issued_date` | DATE | NOT NULL | Data de emissão |
| `valid_from` | DATE | NOT NULL | Início da validade |
| `valid_until` | DATE | NOT NULL | Fim da validade (3 anos) |
| `certified_products` | JSONB | NOT NULL | Array de produtos certificados |
| `pdf_url` | VARCHAR(500) | NOT NULL | URL do PDF no S3 |
| `qr_code_data` | VARCHAR(500) | NOT NULL | URL de verificação |
| `status` | ENUM | NOT NULL, DEFAULT 'ativo' | 'ativo', 'suspenso', 'cancelado', 'expirado' |
| `suspension_reason` | TEXT | NULL | Motivo de suspensão |
| `suspended_at` | TIMESTAMP | NULL | Data de suspensão |
| `created_at` | TIMESTAMP | NOT NULL | Criação do registro |
| `updated_at` | TIMESTAMP | NOT NULL | Última atualização |

**Índices**:
- `idx_certificates_number` (UNIQUE)
- `idx_certificates_process_id` (UNIQUE)
- `idx_certificates_status`
- `idx_certificates_valid_until`

---

## 4.7 Tabela: `ai_analysis`

Análises realizadas por IA (US-047, US-048, US-049).

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da análise |
| `process_id` | UUID | FK certification_processes(id), NULL | Processo relacionado |
| `requested_by` | UUID | FK users(id), NOT NULL | Quem solicitou |
| `analysis_type` | ENUM | NOT NULL | 'pre_auditoria', 'risco', 'chatbot' |
| `model_used` | VARCHAR(100) | NOT NULL | 'gpt-4o-2024-11-20' |
| `input_data` | JSONB | NOT NULL | Documentos, prompt, contexto |
| `output_data` | JSONB | NOT NULL | Resultados estruturados |
| `confidence_score` | DECIMAL(5,4) | NULL | 0.0000 - 1.0000 |
| `tokens_used` | INTEGER | NULL | Custo em tokens |
| `cost_usd` | DECIMAL(10,4) | NULL | Custo em USD |
| `processing_time_ms` | INTEGER | NULL | Tempo de processamento |
| `status` | ENUM | NOT NULL | 'pendente', 'concluido', 'erro' |
| `error_message` | TEXT | NULL | Se status=erro |
| `created_at` | TIMESTAMP | NOT NULL | Data da solicitação |

**Índices**:
- `idx_ai_analysis_process_id`
- `idx_ai_analysis_type`
- `idx_ai_analysis_created_at`

---

## 4.8 Outras Tabelas (Resumo)

| Tabela | Propósito | Colunas Principais |
|--------|-----------|-------------------|
| `process_history` | Rastreamento de mudanças de fase | process_id, from_phase, to_phase, changed_by, reason |
| `product_categories` | Categorias C1-C6 (GSO 2055-2) | code, name (i18n), standard_reference |
| `documents` | Uploads de documentos | process_id, type, storage_key, validation_status |
| `contracts` | Propostas e contratos | process_id, type, total_value, status, pdf_url |
| `audit_schedules` | Calendário de disponibilidade | auditor_id, schedule_date, status |
| `audits` | Auditorias Estágio 1/2 | process_id, auditor_id, type, result, score |
| `audit_checklists` | Checklists PR 7.1 Rev 21 | audit_id, items (JSONB), compliance_percentage |
| `committee_decisions` | Deliberações do comitê | process_id, decision, justification |
| `chat_messages` | Mensagens do chatbot RAG | user_id, message, session_id |
| `notifications` | Notificações em tempo real | user_id, type, message, is_read |
| `audit_trail` | Log de auditoria (LGPD/ISO) | user_id, entity_type, action, old_values, new_values |

---

# 5. DDL - Criação de Tabelas

## 5.1 Extensions e Enums

```sql
-- Extensões PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";        -- Criptografia
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Fuzzy search
CREATE EXTENSION IF NOT EXISTS "vector";          -- pgvector (RAG)

-- === ENUMS ===

CREATE TYPE user_role AS ENUM ('empresa', 'analista', 'auditor', 'gestor');

CREATE TYPE request_type AS ENUM ('nova', 'renovacao', 'ampliacao');

CREATE TYPE certification_type AS ENUM ('C1', 'C2', 'C3', 'C4', 'C5', 'C6');

CREATE TYPE request_status AS ENUM ('rascunho', 'enviado', 'em_analise', 'aprovado', 'rejeitado');

CREATE TYPE process_status AS ENUM ('em_andamento', 'pendente', 'concluido', 'cancelado', 'suspenso');

CREATE TYPE product_origin AS ENUM ('animal', 'vegetal', 'misto', 'quimico');

CREATE TYPE document_type AS ENUM ('contrato_social', 'licenca_sanitaria', 'fotos', 'videos', 'laudos', 'manual_bpf', 'outros');

CREATE TYPE document_validation_status AS ENUM ('pendente', 'aprovado', 'rejeitado');

CREATE TYPE contract_type AS ENUM ('proposta', 'contrato');

CREATE TYPE contract_status AS ENUM ('rascunho', 'enviado', 'em_negociacao', 'assinado', 'cancelado');

CREATE TYPE audit_schedule_status AS ENUM ('disponivel', 'bloqueado', 'confirmado');

CREATE TYPE audit_type AS ENUM ('estagio1', 'estagio2', 'vigilancia', 'especial');

CREATE TYPE audit_status AS ENUM ('agendado', 'em_andamento', 'concluido', 'cancelado');

CREATE TYPE audit_result AS ENUM ('aprovado', 'aprovado_condicional', 'reprovado');

CREATE TYPE committee_decision_type AS ENUM ('aprovar', 'reprovar', 'solicitar_info');

CREATE TYPE certificate_status AS ENUM ('ativo', 'suspenso', 'cancelado', 'expirado');

CREATE TYPE ai_analysis_type AS ENUM ('pre_auditoria', 'risco', 'chatbot');

CREATE TYPE ai_status AS ENUM ('pendente', 'concluido', 'erro');

CREATE TYPE chat_role AS ENUM ('user', 'assistant', 'system');

CREATE TYPE notification_type AS ENUM ('info', 'warning', 'error', 'success');

CREATE TYPE audit_trail_entity AS ENUM ('process', 'contract', 'certificate', 'audit', 'document', 'user', 'company');

CREATE TYPE audit_trail_action AS ENUM ('create', 'update', 'delete', 'approve', 'reject', 'sign', 'cancel');
```

---

## 5.2 Tabela: `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    mfa_config JSONB,  -- {secret: string, backup_codes: string[]}
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint: email válido
ALTER TABLE users ADD CONSTRAINT email_valid
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

COMMENT ON TABLE users IS 'Usuários do sistema (4 roles: empresa, analista, auditor, gestor)';
COMMENT ON COLUMN users.mfa_config IS 'TOTP secret e backup codes para MFA';
COMMENT ON COLUMN users.login_attempts IS 'Contador para rate limiting (reset após login bem-sucedido)';
```

---

## 5.3 Tabela: `companies`

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    address JSONB NOT NULL,  -- {cep, logradouro, numero, complemento, bairro, cidade, uf, pais}
    contact JSONB NOT NULL,  -- {email, telefone, whatsapp, responsavel}
    website VARCHAR(255),
    num_employees INTEGER,
    annual_revenue DECIMAL(15,2),
    main_activity TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_cnpj ON companies(cnpj);

-- Trigger updated_at
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint: CNPJ válido (14 dígitos)
ALTER TABLE companies ADD CONSTRAINT cnpj_valid
    CHECK (cnpj ~ '^\d{14}$');

COMMENT ON TABLE companies IS 'Dados cadastrais das empresas solicitantes de certificação';
COMMENT ON COLUMN companies.address IS 'Endereço completo em formato JSON';
COMMENT ON COLUMN companies.contact IS 'Informações de contato da empresa';
```

---

## 5.4 Tabela: `requests`

```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type request_type NOT NULL,
    certification_type certification_type NOT NULL,
    num_products INTEGER NOT NULL,
    additional_info JSONB,  -- Respostas do wizard (9 etapas)
    estimated_cost DECIMAL(15,2),
    status request_status NOT NULL DEFAULT 'rascunho',
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_requests_company_id ON requests(company_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_submitted_at ON requests(submitted_at);

-- Trigger updated_at
CREATE TRIGGER update_requests_updated_at
    BEFORE UPDATE ON requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint: num_products positivo
ALTER TABLE requests ADD CONSTRAINT num_products_positive
    CHECK (num_products > 0);

COMMENT ON TABLE requests IS 'Solicitações de certificação (output do wizard US-002)';
COMMENT ON COLUMN requests.additional_info IS 'Respostas das 9 etapas do wizard';
COMMENT ON COLUMN requests.estimated_cost IS 'Custo calculado pela IA (US-005)';
```

---

## 5.5 Tabela: `certification_processes`

```sql
CREATE TABLE certification_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID UNIQUE NOT NULL REFERENCES requests(id) ON DELETE RESTRICT,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    analyst_id UUID REFERENCES users(id) ON DELETE SET NULL,
    auditor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    current_phase INTEGER NOT NULL DEFAULT 1,
    status process_status NOT NULL DEFAULT 'em_andamento',
    deadline DATE,
    priority INTEGER DEFAULT 3,
    phase_metadata JSONB,  -- Dados específicos de cada fase
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_processes_request_id ON certification_processes(request_id);
CREATE INDEX idx_processes_company_id ON certification_processes(company_id);
CREATE INDEX idx_processes_analyst_id ON certification_processes(analyst_id);
CREATE INDEX idx_processes_auditor_id ON certification_processes(auditor_id);
CREATE INDEX idx_processes_current_phase ON certification_processes(current_phase);
CREATE INDEX idx_processes_status ON certification_processes(status);
CREATE INDEX idx_processes_priority ON certification_processes(priority);
CREATE INDEX idx_processes_deadline ON certification_processes(deadline);

-- Trigger updated_at
CREATE TRIGGER update_processes_updated_at
    BEFORE UPDATE ON certification_processes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraints
ALTER TABLE certification_processes ADD CONSTRAINT current_phase_valid
    CHECK (current_phase BETWEEN 1 AND 12);

ALTER TABLE certification_processes ADD CONSTRAINT priority_valid
    CHECK (priority BETWEEN 1 AND 5);

COMMENT ON TABLE certification_processes IS 'Processo completo de certificação (12 fases PR 7.1 Rev 21)';
COMMENT ON COLUMN certification_processes.current_phase IS 'Fase atual do processo (1-12 conforme PR 7.1)';
COMMENT ON COLUMN certification_processes.priority IS '1 (urgente) - 5 (baixa)';
```

---

## 5.6 Tabela: `process_history`

```sql
CREATE TABLE process_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES certification_processes(id) ON DELETE CASCADE,
    from_phase INTEGER NOT NULL,
    to_phase INTEGER NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_process_history_process_id ON process_history(process_id);
CREATE INDEX idx_process_history_created_at ON process_history(created_at);

COMMENT ON TABLE process_history IS 'Histórico de mudanças de fase (rastreabilidade ISO 17065)';
```

---

## 5.7 Tabela: `product_categories`

```sql
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code certification_type UNIQUE NOT NULL,
    name_pt VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    name_tr VARCHAR(255),
    description TEXT,
    standard_reference VARCHAR(255),  -- "GSO 2055-2 seção 4.1"
    requirements JSONB,  -- Requisitos específicos da categoria
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_product_categories_code ON product_categories(code);

COMMENT ON TABLE product_categories IS 'Categorias de produtos Halal (C1-C6 conforme GSO 2055-2 e SMIIC 02)';

-- Seed data (categorias padrão)
INSERT INTO product_categories (code, name_pt, name_en, name_ar, name_tr, standard_reference) VALUES
('C1', 'Carne e Derivados', 'Meat and Derivatives', 'اللحوم ومشتقاتها', 'Et ve Türevleri', 'GSO 2055-2 Section 4.1'),
('C2', 'Leite e Derivados', 'Milk and Derivatives', 'الحليب ومشتقاته', 'Süt ve Türevleri', 'GSO 2055-2 Section 4.2'),
('C3', 'Produtos Vegetais', 'Vegetable Products', 'المنتجات النباتية', 'Bitkisel Ürünler', 'GSO 2055-2 Section 4.3'),
('C4', 'Aditivos e Ingredientes', 'Additives and Ingredients', 'المضافات والمكونات', 'Katkı Maddeleri ve İçerikler', 'GSO 2055-2 Section 4.4'),
('C5', 'Cosméticos', 'Cosmetics', 'مستحضرات التجميل', 'Kozmetikler', 'SMIIC 02 Section 5'),
('C6', 'Farmacêuticos', 'Pharmaceuticals', 'الأدوية', 'İlaçlar', 'SMIIC 02 Section 6');
```

---

## 5.8 Tabela: `products`

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES certification_processes(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    origin product_origin NOT NULL,
    description TEXT,
    composition JSONB,  -- [{ingredient: string, percentage: number}]
    manufacturing_process JSONB,  -- Etapas de fabricação
    ncm_code VARCHAR(8),
    is_exported BOOLEAN DEFAULT false,
    export_countries JSONB,  -- ['BR', 'UAE', 'SAU']
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_products_process_id ON products(process_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('portuguese', name));

-- Trigger updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE products IS 'Produtos a serem certificados em cada processo';
COMMENT ON COLUMN products.composition IS 'Array de ingredientes com percentuais';
```

---

## 5.9 Tabela: `documents`

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES certification_processes(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    type document_type NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,  -- S3 path
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,  -- bytes
    checksum VARCHAR(64),  -- SHA-256
    is_required BOOLEAN DEFAULT false,
    validation_status document_validation_status NOT NULL DEFAULT 'pendente',
    rejection_reason TEXT,
    validated_at TIMESTAMP,
    validated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_documents_process_id ON documents(process_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_validation_status ON documents(validation_status);

COMMENT ON TABLE documents IS 'Documentos uploadados (contratos, licenças, fotos, vídeos, laudos)';
COMMENT ON COLUMN documents.storage_key IS 'Path no S3: uploads/{company_id}/{process_id}/{file_id}';
COMMENT ON COLUMN documents.checksum IS 'SHA-256 para integridade';
```

---

## 5.10 Tabela: `contracts`

```sql
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES certification_processes(id) ON DELETE CASCADE,
    type contract_type NOT NULL,
    contract_number VARCHAR(50) UNIQUE,
    total_value DECIMAL(15,2) NOT NULL,
    installments INTEGER DEFAULT 1,
    payment_terms TEXT,
    line_items JSONB,  -- Detalhamento de custos
    special_clauses TEXT,
    status contract_status NOT NULL DEFAULT 'rascunho',
    sent_at TIMESTAMP,
    signed_at TIMESTAMP,
    signature_ip VARCHAR(45),
    signature_metadata JSONB,  -- {device, location, user_agent}
    pdf_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_contracts_process_id ON contracts(process_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_number ON contracts(contract_number);

-- Trigger updated_at
CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint: total_value positivo
ALTER TABLE contracts ADD CONSTRAINT total_value_positive
    CHECK (total_value > 0);

COMMENT ON TABLE contracts IS 'Propostas comerciais e contratos (US-011, US-012)';
COMMENT ON COLUMN contracts.line_items IS 'Detalhamento: [{item, description, quantity, unit_price, total}]';
```

---

## 5.11 Tabela: `audit_schedules`

```sql
CREATE TABLE audit_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auditor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status audit_schedule_status NOT NULL DEFAULT 'disponivel',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_audit_schedules_auditor_id ON audit_schedules(auditor_id);
CREATE INDEX idx_audit_schedules_date ON audit_schedules(schedule_date);
CREATE INDEX idx_audit_schedules_status ON audit_schedules(status);

-- Constraint: end_time > start_time
ALTER TABLE audit_schedules ADD CONSTRAINT valid_time_range
    CHECK (end_time > start_time);

COMMENT ON TABLE audit_schedules IS 'Calendário de disponibilidade dos auditores (US-028)';
```

---

## 5.12 Tabela: `audits`

```sql
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES certification_processes(id) ON DELETE CASCADE,
    auditor_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    schedule_id UUID REFERENCES audit_schedules(id) ON DELETE SET NULL,
    type audit_type NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    location JSONB,  -- Endereço da empresa ou {type: 'remoto'}
    status audit_status NOT NULL DEFAULT 'agendado',
    duration_minutes INTEGER,
    observations TEXT,
    score DECIMAL(5,2),  -- 0-100
    result audit_result,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_audits_process_id ON audits(process_id);
CREATE INDEX idx_audits_auditor_id ON audits(auditor_id);
CREATE INDEX idx_audits_type ON audits(type);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_scheduled_date ON audits(scheduled_date);

-- Trigger updated_at
CREATE TRIGGER update_audits_updated_at
    BEFORE UPDATE ON audits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint: score entre 0 e 100
ALTER TABLE audits ADD CONSTRAINT score_valid
    CHECK (score IS NULL OR (score BETWEEN 0 AND 100));

COMMENT ON TABLE audits IS 'Auditorias Estágio 1, Estágio 2, Vigilância (US-031 a US-035)';
```

---

## 5.13 Tabela: `audit_checklists`

```sql
CREATE TABLE audit_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    checklist_template VARCHAR(255) NOT NULL,  -- "PR 7.1 Rev 21 Section X"
    items JSONB NOT NULL,  -- [{question, answer, evidence_url, notes, is_conforming}]
    total_items INTEGER NOT NULL,
    conforming_items INTEGER NOT NULL,
    non_conforming_items INTEGER NOT NULL,
    compliance_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_audit_checklists_audit_id ON audit_checklists(audit_id);

-- Trigger updated_at
CREATE TRIGGER update_audit_checklists_updated_at
    BEFORE UPDATE ON audit_checklists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE audit_checklists IS 'Checklists de auditoria (PR 7.1 Rev 21 digitalizado - US-033)';
COMMENT ON COLUMN audit_checklists.items IS 'Array de itens do checklist com evidências';
```

---

## 5.14 Tabela: `committee_decisions`

```sql
CREATE TABLE committee_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID NOT NULL REFERENCES certification_processes(id) ON DELETE CASCADE,
    decided_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    decision committee_decision_type NOT NULL,
    justification TEXT NOT NULL,
    voting_details JSONB,  -- Se houver votação: [{member, vote, comments}]
    decided_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_committee_decisions_process_id ON committee_decisions(process_id);
CREATE INDEX idx_committee_decisions_decision ON committee_decisions(decision);

COMMENT ON TABLE committee_decisions IS 'Deliberações do Comitê Técnico (US-041, US-042)';
```

---

## 5.15 Tabela: `certificates`

```sql
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID UNIQUE NOT NULL REFERENCES certification_processes(id) ON DELETE RESTRICT,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    issued_date DATE NOT NULL,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    certified_products JSONB NOT NULL,  -- Array de produtos certificados
    pdf_url VARCHAR(500) NOT NULL,
    qr_code_data VARCHAR(500) NOT NULL,  -- URL de verificação
    status certificate_status NOT NULL DEFAULT 'ativo',
    suspension_reason TEXT,
    suspended_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_certificates_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_process_id ON certificates(process_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_valid_until ON certificates(valid_until);

-- Trigger updated_at
CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint: valid_until > valid_from
ALTER TABLE certificates ADD CONSTRAINT valid_dates
    CHECK (valid_until > valid_from);

-- Function para gerar certificate_number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.certificate_number IS NULL THEN
        NEW.certificate_number := 'HS-' ||
            TO_CHAR(NEW.issued_date, 'YYYY') || '-' ||
            LPAD(NEXTVAL('certificate_number_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE certificate_number_seq START 1;

CREATE TRIGGER generate_certificate_number_trigger
    BEFORE INSERT ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION generate_certificate_number();

COMMENT ON TABLE certificates IS 'Certificados Halal emitidos (US-044)';
COMMENT ON COLUMN certificates.qr_code_data IS 'URL para verificação pública: https://halalsphere.com/verify/{cert_id}';
```

---

## 5.16 Tabela: `ai_analysis`

```sql
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID REFERENCES certification_processes(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    analysis_type ai_analysis_type NOT NULL,
    model_used VARCHAR(100) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    confidence_score DECIMAL(5,4),  -- 0.0000 - 1.0000
    tokens_used INTEGER,
    cost_usd DECIMAL(10,4),
    processing_time_ms INTEGER,
    status ai_status NOT NULL DEFAULT 'pendente',
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_ai_analysis_process_id ON ai_analysis(process_id);
CREATE INDEX idx_ai_analysis_type ON ai_analysis(analysis_type);
CREATE INDEX idx_ai_analysis_created_at ON ai_analysis(created_at DESC);

COMMENT ON TABLE ai_analysis IS 'Análises realizadas por IA (US-047, US-048, US-049)';
COMMENT ON COLUMN ai_analysis.confidence_score IS 'Score de confiança da IA (0.0 - 1.0)';
```

---

## 5.17 Tabela: `chat_messages`

```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_id UUID REFERENCES certification_processes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role chat_role NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,  -- {context, intent, entities}
    session_id VARCHAR(100),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_chat_messages_process_id ON chat_messages(process_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

COMMENT ON TABLE chat_messages IS 'Mensagens do chatbot RAG multilíngue (US-049)';
COMMENT ON COLUMN chat_messages.role IS 'user (usuário), assistant (IA), system (sistema)';
```

---

## 5.18 Tabela: `notifications`

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    action_url JSONB,  -- {url: string, label: string}
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

COMMENT ON TABLE notifications IS 'Notificações em tempo real (US-024, US-053)';
```

---

## 5.19 Tabela: `audit_trail`

```sql
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    entity_type audit_trail_entity NOT NULL,
    entity_id UUID NOT NULL,
    action audit_trail_action NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX idx_audit_trail_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX idx_audit_trail_action ON audit_trail(action);
CREATE INDEX idx_audit_trail_created_at ON audit_trail(created_at DESC);

COMMENT ON TABLE audit_trail IS 'Log de auditoria completo (LGPD, ISO 17065 - retenção 3 anos)';
COMMENT ON COLUMN audit_trail.old_values IS 'Valores antes da mudança (para UPDATE)';
COMMENT ON COLUMN audit_trail.new_values IS 'Valores após a mudança (para CREATE/UPDATE)';
```

---

# 6. Índices e Performance

## 6.1 Índices Compostos

```sql
-- Busca de processos por empresa + status (US-004 Dashboard)
CREATE INDEX idx_processes_company_status
    ON certification_processes(company_id, status);

-- Busca de processos por analista + fase (US-018 Kanban)
CREATE INDEX idx_processes_analyst_phase
    ON certification_processes(analyst_id, current_phase);

-- Busca de auditorias por auditor + data (US-029 Calendário)
CREATE INDEX idx_audits_auditor_date
    ON audits(auditor_id, scheduled_date);

-- Certificados próximos de vencer (US-054 Renovação)
CREATE INDEX idx_certificates_expiring
    ON certificates(status, valid_until)
    WHERE status = 'ativo';
```

---

## 6.2 Índices Full-Text Search

```sql
-- Busca de empresas por nome (US-016)
CREATE INDEX idx_companies_name_fts
    ON companies USING gin(to_tsvector('portuguese', razao_social || ' ' || COALESCE(nome_fantasia, '')));

-- Busca de produtos por nome (US-027)
CREATE INDEX idx_products_name_fts
    ON products USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(description, '')));

-- Busca fuzzy de empresas (trigram similarity)
CREATE INDEX idx_companies_name_trgm
    ON companies USING gin(razao_social gin_trgm_ops);
```

---

## 6.3 Índices para RAG (pgvector)

```sql
-- Extensão pgvector para embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabela para armazenar embeddings de documentos
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),  -- OpenAI text-embedding-3-large
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índice HNSW para busca semântica rápida
CREATE INDEX idx_document_embeddings_vector
    ON document_embeddings
    USING hnsw (embedding vector_cosine_ops);

COMMENT ON TABLE document_embeddings IS 'Embeddings de documentos para chatbot RAG (US-049)';
COMMENT ON COLUMN document_embeddings.chunk_index IS 'Índice do chunk (documentos grandes são divididos)';
```

---

## 6.4 Particionamento de Tabelas (Futuro)

Para escalar além de 10.000 processos:

```sql
-- Particionar audit_trail por ano (retenção 3 anos)
CREATE TABLE audit_trail_2025 PARTITION OF audit_trail
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE audit_trail_2026 PARTITION OF audit_trail
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

-- Auto-vacuum agressivo em tabelas grandes
ALTER TABLE audit_trail SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE notifications SET (autovacuum_vacuum_scale_factor = 0.1);
```

---

## 6.5 Materialized Views para Dashboards

```sql
-- View materializada: Estatísticas por analista (US-056)
CREATE MATERIALIZED VIEW analyst_stats AS
SELECT
    analyst_id,
    COUNT(*) AS total_processes,
    COUNT(*) FILTER (WHERE status = 'em_andamento') AS active_processes,
    COUNT(*) FILTER (WHERE status = 'concluido') AS completed_processes,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 86400)::INTEGER AS avg_days_to_complete
FROM certification_processes
WHERE analyst_id IS NOT NULL
GROUP BY analyst_id;

-- Índice na view
CREATE UNIQUE INDEX idx_analyst_stats_analyst_id ON analyst_stats(analyst_id);

-- Refresh automático (executar via cron ou background job)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY analyst_stats;

COMMENT ON MATERIALIZED VIEW analyst_stats IS 'Estatísticas por analista (atualizar 1x/dia)';
```

---

# 7. Migrations Strategy

## 7.1 Ferramenta de Migrations

**Recomendação**: Usar **Prisma Migrate** (já integrado com Prisma ORM).

Vantagens:
- Migrations automáticas baseadas no schema
- Rollback nativo
- Histórico versionado
- CI/CD friendly

Alternativas:
- **Flyway** (Java)
- **Liquibase** (Java/XML)
- **node-pg-migrate** (Node.js puro)

---

## 7.2 Estrutura de Migrations

```
/prisma
  /migrations
    /20250113000001_init_schema
      migration.sql
    /20250120143022_add_ai_analysis
      migration.sql
    /20250127091545_add_pgvector
      migration.sql
    migration_lock.toml
  schema.prisma
```

---

## 7.3 Exemplo de Migration (Prisma)

```sql
-- Migration: 20250113000001_init_schema

-- Criar extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Criar enums
CREATE TYPE user_role AS ENUM ('empresa', 'analista', 'auditor', 'gestor');
-- ... (outros enums)

-- Criar tabelas
CREATE TABLE users (...);
CREATE TABLE companies (...);
-- ... (outras tabelas)

-- Criar índices
CREATE INDEX idx_users_email ON users(email);
-- ... (outros índices)

-- Seed data inicial
INSERT INTO product_categories (...) VALUES (...);
```

---

## 7.4 Rollback Strategy

```bash
# Aplicar migration
npx prisma migrate deploy

# Rollback (reverter última migration)
npx prisma migrate rollback

# Ver status das migrations
npx prisma migrate status
```

---

## 7.5 Schema Evolution (Exemplo Prático)

**Cenário**: Adicionar campo `sla_hours` em `certification_processes`.

**Migration**:
```sql
-- Migration: 20250205120000_add_sla_hours

ALTER TABLE certification_processes
ADD COLUMN sla_hours INTEGER;

-- Valor padrão baseado na fase atual
UPDATE certification_processes
SET sla_hours =
    CASE current_phase
        WHEN 1 THEN 24
        WHEN 2 THEN 72
        WHEN 3 THEN 168
        ELSE 72
    END;

-- Constraint: sla_hours positivo
ALTER TABLE certification_processes
ADD CONSTRAINT sla_hours_positive
CHECK (sla_hours > 0);

COMMENT ON COLUMN certification_processes.sla_hours IS 'SLA em horas para conclusão da fase atual';
```

---

## 7.6 Data Migration (Exemplo)

**Cenário**: Migrar dados de `requests.additional_info` (JSONB) para tabela normalizada.

```sql
-- Migration: 20250301090000_normalize_request_metadata

-- 1. Criar nova tabela
CREATE TABLE request_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Migrar dados existentes
INSERT INTO request_metadata (request_id, key, value)
SELECT
    id,
    jsonb_object_keys(additional_info) AS key,
    additional_info->>jsonb_object_keys(additional_info) AS value
FROM requests
WHERE additional_info IS NOT NULL;

-- 3. Índice
CREATE INDEX idx_request_metadata_request_id ON request_metadata(request_id);

-- 4. (Opcional) Remover coluna antiga após validação
-- ALTER TABLE requests DROP COLUMN additional_info;
```

---

# 8. APIs e Integrações

## 8.1 Endpoints Principais (Resumo)

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login (JWT)
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/mfa/enable` - Ativar MFA
- `POST /api/auth/mfa/verify` - Verificar código TOTP

### Solicitações
- `POST /api/requests` - Criar solicitação (wizard)
- `GET /api/requests/:id` - Obter solicitação
- `PATCH /api/requests/:id` - Atualizar (auto-save)
- `POST /api/requests/:id/submit` - Enviar solicitação

### Processos
- `GET /api/processes` - Listar processos (filtros, paginação)
- `GET /api/processes/:id` - Detalhes do processo
- `PATCH /api/processes/:id/phase` - Avançar fase
- `POST /api/processes/:id/assign` - Designar analista/auditor

### Documentos
- `POST /api/processes/:id/documents` - Upload de arquivo
- `GET /api/documents/:id/download` - Download (presigned URL)
- `PATCH /api/documents/:id/validate` - Validar/rejeitar documento

### Contratos
- `POST /api/processes/:id/contracts/proposal` - Gerar proposta
- `POST /api/contracts/:id/sign` - Assinar contrato
- `GET /api/contracts/:id/pdf` - Download PDF

### Auditorias
- `GET /api/audit-schedules` - Calendário de disponibilidade
- `POST /api/audits/:id/schedule` - Agendar auditoria
- `POST /api/audits/:id/checklist` - Preencher checklist
- `PATCH /api/audits/:id/complete` - Finalizar auditoria

### IA
- `POST /api/processes/:id/ai/analyze` - Análise pré-auditoria
- `POST /api/chat` - Enviar mensagem para chatbot RAG

### Certificados
- `POST /api/processes/:id/issue-certificate` - Emitir certificado
- `GET /api/certificates/:number/verify` - Verificação pública (QR code)

### Dashboards
- `GET /api/dashboard/company` - Dashboard da empresa
- `GET /api/dashboard/analyst` - Dashboard do analista
- `GET /api/dashboard/manager` - Dashboard do gestor

---

## 8.2 Integrações Externas

| Serviço | API | Uso no HalalSphere |
|---------|-----|-------------------|
| **OpenAI** | REST API | Análise de documentos (US-047), Chatbot RAG (US-049) |
| **Anthropic** | REST API | Fallback para análise de documentos |
| **Stripe** | REST API + Webhooks | Pagamentos (US-014) |
| **SendGrid** | REST API | Emails transacionais (US-023, US-053) |
| **AWS S3** | SDK (boto3/aws-sdk) | Storage de documentos e certificados |
| **Google Maps** | Geocoding API | Validação de endereços (US-001) |
| **ViaCEP** | REST API | Busca de CEP (Brasil) |

---

## 8.3 WebSockets (Notificações Real-time)

**Biblioteca**: Socket.io

**Eventos**:
```typescript
// Cliente se conecta
socket.on('connect', (userId) => {
  socket.join(`user:${userId}`);
});

// Servidor envia notificação
io.to(`user:${userId}`).emit('notification', {
  type: 'info',
  title: 'Análise IA concluída',
  message: 'Processo #12345: 87% de conformidade',
  action_url: '/processes/12345'
});

// Cliente recebe
socket.on('notification', (data) => {
  showToast(data);
});
```

---

# 9. Segurança Técnica

## 9.1 Autenticação e Autorização

### JWT Strategy
```typescript
// Payload do JWT
interface JWTPayload {
  userId: string;
  email: string;
  role: 'empresa' | 'analista' | 'auditor' | 'gestor';
  companyId?: string;  // Se role=empresa
  iat: number;  // Issued at
  exp: number;  // Expiration (15min)
}

// Refresh Token (7 dias, armazenado no Redis)
interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}
```

### RBAC Matrix

| Recurso | Empresa | Analista | Auditor | Gestor |
|---------|---------|----------|---------|--------|
| Criar solicitação | ✅ | ❌ | ❌ | ❌ |
| Ver próprios processos | ✅ | ✅ (atribuídos) | ✅ (atribuídos) | ✅ (todos) |
| Editar documentos | ✅ (antes de enviar) | ❌ | ❌ | ❌ |
| Atribuir analista | ❌ | ❌ | ❌ | ✅ |
| Realizar auditoria | ❌ | ❌ | ✅ | ❌ |
| Emitir certificado | ❌ | ❌ | ❌ | ✅ |

Implementação (NestJS Guard):
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const { role } = request.user;
    return requiredRoles.includes(role);
  }
}
```

---

## 9.2 Proteção de Dados (LGPD)

### Dados Pessoais Coletados
- Nome, email, telefone, CNPJ
- Endereço, responsável técnico
- IP de acesso, user agent

### Implementação de Direitos

```sql
-- Direito de Acesso (Art. 18, II)
SELECT jsonb_build_object(
    'usuario', (SELECT jsonb_strip_nulls(to_jsonb(users.*)) FROM users WHERE id = $1),
    'empresa', (SELECT jsonb_strip_nulls(to_jsonb(companies.*)) FROM companies WHERE user_id = $1),
    'processos', (SELECT jsonb_agg(to_jsonb(cp.*)) FROM certification_processes cp WHERE company_id IN (SELECT id FROM companies WHERE user_id = $1))
) AS meus_dados;

-- Direito de Portabilidade (Art. 18, V)
-- Exportar em JSON estruturado

-- Direito ao Esquecimento (Art. 18, VI)
-- Após fim de relação + prazo legal (3 anos):
DELETE FROM users WHERE id = $1;
-- Cascata deleta: companies, requests, etc (via ON DELETE CASCADE)
-- Audit trail mantido (anonimizado: email → 'deleted_user_123@anonymized.com')
```

---

## 9.3 Proteção contra OWASP Top 10

| Vulnerabilidade | Mitigação Implementada |
|-----------------|------------------------|
| **A01: Broken Access Control** | RBAC middleware em todas as rotas, validação server-side |
| **A02: Cryptographic Failures** | TLS 1.3, bcrypt (cost=12), Secrets Manager, sem dados sensíveis em logs |
| **A03: Injection** | Prisma ORM (prepared statements), Zod validation, sanitização HTML |
| **A04: Insecure Design** | Threat modeling, segregation of duties, rate limiting (Redis) |
| **A05: Security Misconfiguration** | Helmet.js (security headers), CORS restrito, env vars |
| **A06: Vulnerable Components** | Dependabot, npm audit semanal, Snyk scan no CI/CD |
| **A07: Auth Failures** | MFA obrigatório (analistas+), JWT short-lived, account lockout (5 tentativas) |
| **A08: Software Data Integrity** | Webhook HMAC validation (Stripe), CI/CD signing |
| **A09: Logging Failures** | Pino structured logs, ELK stack, alertas de anomalias |
| **A10: SSRF** | Validação de URLs, network segmentation, proxy interno |

---

## 9.4 Rate Limiting

```typescript
// NestJS Throttler (rate limiting)
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 900000, limit: 100 }], // 100 req / 15 min
    }),
  ],
})
export class AppModule {}

// Rate limits específicos
// Login: 5 tentativas / 15min
// Upload: 10 arquivos / hora
// IA Analysis: 3 análises / hora (free tier)
```

---

## 9.5 Secrets Management

```bash
# AWS Secrets Manager (produção)
aws secretsmanager get-secret-value --secret-id halalsphere/prod/db

# Variáveis de ambiente (dev/staging)
DATABASE_URL=postgresql://user:pass@localhost:5432/halalsphere
JWT_SECRET=...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

**NUNCA** commitar secrets no código!

---

# 10. Infraestrutura e DevOps

## 10.1 Arquitetura AWS (Recomendada)

```
┌─────────────────────────────────────────────────────────────┐
│                         Route 53 (DNS)                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CloudFront (CDN + WAF)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│              ALB (Application Load Balancer)               │
└───────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────────────────────────────────────────────┐
│                    EKS (Kubernetes)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │  API Pod 1 │  │  API Pod 2 │  │  API Pod N │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│  ┌────────────┐  ┌────────────┐  ┌��───────────┐         │
│  │ Worker 1   │  │ Worker 2   │  │ Worker N   │         │
│  │ (IA)       │  │ (PDF)      │  │ (Email)    │         │
│  └────────────┘  └────────────┘  └────────────┘         │
└───────────────────────────────────────────────────────────┘
             ↓                       ↓
┌──────────────────────┐  ┌────────────────────────┐
│   RDS PostgreSQL     │  │   ElastiCache Redis    │
│   (Primary + 2       │  │   (Cache + Queue)      │
│    Read Replicas)    │  │                        │
└──────────────────────┘  └────────────────────────┘
             ↓
┌─────────────────────────────────────────────────────────┐
│                    S3 (Object Storage)                   │
│  - /uploads (documentos privados)                       │
│  - /certificates (PDFs públicos)                        │
│  - /backups (dumps diários)                             │
└─────────────────────────────────────────────────────────┘
```

---

## 10.2 Docker Compose (Desenvolvimento Local)

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: halalsphere
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"  # API
      - "9001:9001"  # Console
    volumes:
      - minio_data:/data

  api:
    build: ./backend
    depends_on:
      - postgres
      - redis
      - minio
    environment:
      DATABASE_URL: postgresql://admin:secret@postgres:5432/halalsphere
      REDIS_URL: redis://redis:6379
      S3_ENDPOINT: http://minio:9000
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    depends_on:
      - api
    ports:
      - "5173:5173"  # Vite dev server
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  minio_data:
```

---

## 10.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Run security scan
        run: npx snyk test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to ECR
        run: aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY

      - name: Build Docker image
        run: docker build -t halalsphere-api:${{ github.sha }} .

      - name: Push to ECR
        run: docker push halalsphere-api:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EKS
        run: |
          kubectl set image deployment/api api=halalsphere-api:${{ github.sha }}
          kubectl rollout status deployment/api
```

---

## 10.4 Kubernetes Manifests (Exemplo)

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: halalsphere-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 10.5 Monitoramento (Grafana + Prometheus)

```yaml
# k8s/monitoring/prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
      - job_name: 'api'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_label_app]
            action: keep
            regex: api
```

**Dashboards Grafana**:
1. **System Metrics**: CPU, Memory, Disk, Network
2. **Application Metrics**: Request rate, Error rate, Latency (RED)
3. **Database Metrics**: Query time, Connections, Slow queries
4. **Business Metrics**: Processos/dia, Taxa de conclusão, Revenue

---

## 📊 Status do Technical Architecture Document

**✅ Documento 100% completo!**

Este documento técnico cobre:
- ✅ Stack tecnológica completa (Frontend, Backend, IA, Infra)
- ✅ Arquitetura de sistema (diagramas, fluxos)
- ✅ Database Schema (ERD completo, 19 tabelas)
- ✅ Dicionário de dados (todas as colunas documentadas)
- ✅ DDL SQL (create tables, índices, constraints)
- ✅ Índices e otimizações de performance
- ✅ Migrations strategy (Prisma)
- ✅ APIs e integrações externas
- ✅ Segurança técnica (OWASP, LGPD, RBAC)
- ✅ Infraestrutura e DevOps (AWS, K8s, CI/CD)

**Próximos passos**:
1. Setup do ambiente de desenvolvimento (Docker Compose)
2. Implementação do schema Prisma
3. Primeira migration (init_schema)
4. Testes de integração com PostgreSQL

---

**Documentos relacionados**:
- [PRD v2.0](./prd-v2.md) - Product Requirements Document
- [UX Design Guide](./ux-design-guide.md) - Especificações de UX/UI
