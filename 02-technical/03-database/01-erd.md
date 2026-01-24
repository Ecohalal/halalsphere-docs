# 3. Database Schema (ERD)

**PostgreSQL 16 + pgvector | 40+ Tabelas | MVP em Produção: Janeiro 2026**

---

## 3.1 Diagrama Entidade-Relacionamento (Resumido)

```mermaid
erDiagram
    %% === CORE ===
    users ||--o{ companies : "pertence"
    users ||--o{ processes : "analista/auditor"
    companies ||--o{ requests : "solicita"
    requests ||--|| processes : "gera"

    %% === GRUPOS EMPRESARIAIS ===
    company_groups ||--o{ companies : "agrupa"
    companies ||--o{ plants : "possui"
    company_groups ||--o{ shared_suppliers : "compartilha"
    company_groups ||--o{ corporate_documents : "documentos"

    %% === CERTIFICACOES (Nova Estrutura) ===
    companies ||--o{ certifications : "certifica"
    certifications ||--|| certification_scopes : "define escopo"
    certifications ||--o{ certification_requests : "solicitacoes"
    certification_requests ||--|| request_workflows : "workflow"
    certifications ||--o{ certification_history : "historico"

    %% === CLASSIFICACAO INDUSTRIAL ===
    industrial_groups ||--o{ industrial_categories : "contem"
    industrial_categories ||--o{ industrial_subcategories : "detalha"

    %% === WORKFLOW (Legacy) ===
    processes ||--o{ documents : "anexa"
    processes ||--o{ contracts : "possui"
    processes ||--o{ audits : "realiza"
    processes ||--o{ committee_decisions : "delibera"
    processes ||--o| certificates : "emite"
    processes ||--o{ ai_analyses : "analisa"
    processes ||--o| proposals : "proposta"

    %% === NOTIFICACOES E AUDIT ===
    users ||--o{ notifications : "recebe"
    users ||--o{ chat_messages : "conversa"
    users ||--o{ audit_trail : "executa"
```

---

## 3.2 Diagrama Detalhado - Core (Usuarios e Empresas)

```mermaid
erDiagram
    users {
        uuid id PK
        string email UK "NOT NULL"
        string password_hash "bcrypt"
        enum role "12 roles: admin, empresa, analista, auditor, gestor, comercial, juridico, financeiro, gestor_auditoria, supervisor, controlador, secretaria"
        string name "NOT NULL"
        string phone
        jsonb mfa_config "TOTP settings"
        boolean mfa_enabled "default false"
        int login_attempts "rate limiting"
        timestamp locked_until
        timestamp last_login
        boolean is_group_admin "admin do grupo"
        boolean is_company_admin "admin da empresa"
        boolean is_temporary_admin "admin temporario"
        timestamp created_at
        timestamp updated_at
    }

    companies {
        uuid id PK
        uuid user_id FK UK
        uuid group_id FK "CompanyGroup"
        string cnpj UK "14 digits"
        string razao_social "NOT NULL"
        string nome_fantasia
        jsonb address "CEP, rua, cidade, UF"
        jsonb contact "email, phone, whatsapp"
        string email "flat field"
        string telefone "flat field"
        string endereco "flat field"
        string cidade
        string estado
        string cep
        string pais
        string tipo_empresa
        boolean is_verified
        boolean is_active
        boolean is_headquarters "matriz do grupo"
        boolean pending_validation "aguardando FAMBRAS"
        timestamp created_at
        timestamp updated_at
    }

    company_groups {
        uuid id PK
        string name "NOT NULL"
        string trade_name
        string document "CNPJ holding"
        string contact_name
        string contact_email
        string contact_phone
        timestamp created_at
        timestamp updated_at
    }

    plants {
        uuid id PK
        uuid company_id FK
        string code "SIF ou interno"
        enum code_type "sif, sie, sim, internal"
        string name
        string address
        string city
        string state
        string postal_code
        string country "default BR"
        string production_capacity
        int employee_count
        int shifts_count
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ companies : "user_id"
    company_groups ||--o{ companies : "group_id"
    companies ||--o{ plants : "company_id"
```

---

## 3.3 Diagrama Detalhado - Solicitacoes e Processos

```mermaid
erDiagram
    requests {
        uuid id PK
        uuid company_id FK
        string protocol UK "REQ-20260115-00001"
        string company_name
        string cnpj
        enum request_type "nova, inicial, renovacao, ampliacao, manutencao, adequacao"
        enum certification_type "C1-C6, produto, processo, servico"
        uuid industrial_group_id FK
        uuid industrial_category_id FK
        uuid industrial_subcategory_id FK
        string contact_person
        string contact_email
        string contact_phone
        string facility_address
        enum product_origin "animal, vegetal, misto, quimico"
        jsonb product_details
        jsonb production_details
        string industrial_classification
        enum status "rascunho, enviado, pendente, em_analise, aprovado, rejeitado, cancelado"
        timestamp submitted_at
        uuid reviewer_id FK
        timestamp reviewed_at
        string review_notes
        string rejection_reason
        timestamp created_at
        timestamp updated_at
    }

    processes {
        uuid id PK
        uuid request_id FK UK
        uuid analyst_id FK
        uuid auditor_id FK
        enum current_phase "17 fases: cadastro_solicitacao ate certificado_emitido"
        enum status "16 status: rascunho ate suspenso"
        enum priority "baixa, media, alta, urgente"
        int days_in_phase
        timestamp estimated_end
        timestamp created_at
        timestamp updated_at
    }

    process_phase_history {
        uuid id PK
        uuid process_id FK
        int phase "1-12"
        timestamp entered_at
        timestamp exited_at
        int days_in_phase
    }

    process_history {
        uuid id PK
        uuid process_id FK
        enum status
        string notes
        uuid changed_by FK
        timestamp created_at
    }

    companies ||--o{ requests : "company_id"
    requests ||--|| processes : "request_id"
    users ||--o{ processes : "analyst_id"
    users ||--o{ processes : "auditor_id"
    processes ||--o{ process_phase_history : "process_id"
    processes ||--o{ process_history : "process_id"
```

---

## 3.4 Diagrama Detalhado - Classificacao Industrial (GSO 2055-2)

```mermaid
erDiagram
    industrial_groups {
        uuid id PK
        string code UK "A, B, C, D"
        string name
        string name_en
        string name_ar
        string description
        string icon "emoji"
        int display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    industrial_categories {
        uuid id PK
        uuid group_id FK
        string code UK "AI, AII, BI, BII, CI, CII, CIII, CIV, DI, DII"
        string name
        string name_en
        string name_ar
        string description
        float audit_days "tempo de auditoria"
        int display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    industrial_subcategories {
        uuid id PK
        uuid category_id FK
        string code
        string name
        string name_en
        string name_ar
        string description
        array examples "atividades"
        int display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    industrial_groups ||--o{ industrial_categories : "group_id"
    industrial_categories ||--o{ industrial_subcategories : "category_id"
    industrial_groups ||--o{ requests : "industrial_group_id"
    industrial_categories ||--o{ requests : "industrial_category_id"
    industrial_subcategories ||--o{ requests : "industrial_subcategory_id"
```

---

## 3.5 Diagrama Detalhado - Reestruturacao Certificacoes

```mermaid
erDiagram
    certifications {
        uuid id PK
        uuid company_id FK
        uuid plant_id FK
        string certification_number UK "HS-2026-001"
        enum certification_type
        uuid industrial_group_id FK
        uuid industrial_category_id FK
        uuid industrial_subcategory_id FK
        enum status "em_solicitacao, ativa, suspensa, cancelada, expirada, recusada"
        timestamp valid_from
        timestamp valid_until
        uuid analyst_id FK
        enum suspension_type "normal, entressafra"
        timestamp suspended_at
        timestamp max_suspension_date
        string suspension_reason
        enum cancellation_type "pos_suspensao, distrato"
        timestamp cancelled_at
        string cancellation_reason
        timestamp rejected_at
        string rejection_reason
        timestamp created_at
        timestamp updated_at
    }

    certification_scopes {
        uuid id PK
        uuid certification_id FK UK
        string description
        string production_capacity
        int num_employees
        int num_shifts
        timestamp created_at
        timestamp updated_at
    }

    scope_products {
        uuid id PK
        uuid scope_id FK
        string name
        string description
        string category
        enum origin "animal, vegetal, misto, quimico"
        enum status "ativo, pendente, removido"
        timestamp added_at
        timestamp removed_at
    }

    scope_facilities {
        uuid id PK
        uuid scope_id FK
        string name
        string address
        string city
        string state
        string country
        string postal_code
        string facility_type
        enum status
        timestamp added_at
        timestamp removed_at
    }

    scope_brands {
        uuid id PK
        uuid scope_id FK
        string name
        string logo_url
        enum status
        timestamp added_at
        timestamp removed_at
    }

    scope_suppliers {
        uuid id PK
        uuid scope_id FK
        string name
        string cnpj
        string ingredient_type
        boolean has_halal_certificate
        enum status
        timestamp added_at
    }

    certification_requests {
        uuid id PK
        uuid certification_id FK
        string protocol UK
        enum request_type
        enum status
        timestamp submitted_at
        timestamp completed_at
        uuid reviewer_id FK
        string change_description
        string change_type
        timestamp created_at
        timestamp updated_at
    }

    request_workflows {
        uuid id PK
        uuid request_id FK UK
        enum current_phase
        enum status
        enum priority
        uuid analyst_id FK
        uuid auditor_id FK
        int days_in_phase
        timestamp estimated_end
        timestamp created_at
        timestamp updated_at
    }

    certification_history {
        uuid id PK
        uuid certification_id FK
        string action "criacao, submissao, auditoria, etc"
        string action_description
        uuid request_id FK
        uuid document_id FK
        uuid audit_id FK
        uuid certificate_id FK
        uuid performed_by FK
        jsonb metadata
        timestamp performed_at
    }

    companies ||--o{ certifications : "company_id"
    plants ||--o{ certifications : "plant_id"
    certifications ||--|| certification_scopes : "certification_id"
    certification_scopes ||--o{ scope_products : "scope_id"
    certification_scopes ||--o{ scope_facilities : "scope_id"
    certification_scopes ||--o{ scope_brands : "scope_id"
    certification_scopes ||--o{ scope_suppliers : "scope_id"
    certifications ||--o{ certification_requests : "certification_id"
    certification_requests ||--|| request_workflows : "request_id"
    certifications ||--o{ certification_history : "certification_id"
```

---

## 3.6 Diagrama Detalhado - Documentos e Contratos

```mermaid
erDiagram
    documents {
        uuid id PK
        uuid request_id FK
        uuid certification_id FK
        enum document_type "15 tipos"
        string file_name
        string file_url
        int file_size
        string mime_type
        enum validation_status "pendente, aprovado, rejeitado"
        string validation_notes
        timestamp valid_until
        timestamp uploaded_at
        timestamp validated_at
    }

    document_requests {
        uuid id PK
        uuid process_id FK
        uuid requested_by FK
        enum document_type
        string description
        timestamp due_date
        enum status "pendente, atendido, cancelado"
        timestamp responded_at
        uuid uploaded_doc_id FK
        timestamp created_at
        timestamp updated_at
    }

    contracts {
        uuid id PK
        uuid process_id FK
        uuid company_id FK
        uuid certification_id FK
        enum contract_type "proposta, contrato"
        enum status "rascunho, enviado, em_negociacao, assinado, cancelado"
        decimal total_value
        int num_installments
        int validity_months
        string pdf_url
        timestamp sent_at
        timestamp signed_at
        timestamp created_at
        timestamp updated_at
    }

    requests ||--o{ documents : "request_id"
    certifications ||--o{ documents : "certification_id"
    processes ||--o{ document_requests : "process_id"
    processes ||--o{ contracts : "process_id"
    companies ||--o{ contracts : "company_id"
    certifications ||--o{ contracts : "certification_id"
```

---

## 3.7 Diagrama Detalhado - Proposta Comercial

```mermaid
erDiagram
    pricing_tables {
        uuid id PK
        string version "v1.0, v1.1"
        timestamp effective_from
        timestamp effective_to
        boolean is_active
        jsonb base_prices "C1-C6 prices"
        jsonb product_multipliers
        jsonb shift_multipliers
        jsonb history_multipliers
        jsonb supplier_multipliers
        jsonb man_hour_rates
        jsonb travel_costs
        decimal accommodation_cost
        decimal document_analysis_fee
        decimal committee_fee
        decimal issuance_fee
        decimal tax_rate
        timestamp created_at
        timestamp updated_at
    }

    proposals {
        uuid id PK
        uuid process_id FK UK
        uuid certification_id FK
        uuid pricing_table_id FK
        jsonb calculation_inputs
        jsonb breakdown
        decimal total_value
        decimal manual_adjustment
        string adjustment_reason
        uuid adjusted_by FK
        decimal final_value
        enum status "rascunho, calculada, enviada, aceita, recusada, expirada"
        timestamp valid_until
        string pdf_url
        timestamp pdf_generated_at
        timestamp sent_at
        timestamp responded_at
        string response_notes
        timestamp created_at
        timestamp updated_at
    }

    pricing_tables ||--o{ proposals : "pricing_table_id"
    processes ||--|| proposals : "process_id"
    certifications ||--o{ proposals : "certification_id"
    users ||--o{ proposals : "adjusted_by"
```

---

## 3.8 Diagrama Detalhado - Auditorias e Certificados

```mermaid
erDiagram
    audits {
        uuid id PK
        uuid process_id FK
        uuid certification_id FK
        uuid auditor_id FK
        enum audit_type "inicial, estagio1, estagio2, vigilancia, renovacao, especial, follow_up"
        enum status "agendado, em_andamento, concluido, cancelado"
        timestamp scheduled_date
        timestamp completed_date
        jsonb location
        enum result "aprovado, aprovado_condicional, reprovado"
        jsonb findings "conformidades, nao_conformidades"
        string auditor_notes
        boolean is_unannounced "auditoria nao anunciada"
        timestamp unannounced_window_start
        timestamp unannounced_window_end
        timestamp created_at
        timestamp updated_at
    }

    committee_decisions {
        uuid id PK
        uuid process_id FK
        enum decision_type "aprovar, reprovar, solicitar_info"
        string justification
        string requested_info
        timestamp voted_at
        string decided_by
    }

    certificates {
        uuid id PK
        uuid process_id FK
        uuid certification_id FK
        uuid issued_by_id FK
        string certificate_number UK "HS-YYYY-NNNNN"
        int version
        enum status "ativo, suspenso, cancelado, expirado"
        timestamp issued_at
        timestamp expires_at
        string pdf_url
        string qr_code_url
        timestamp created_at
    }

    processes ||--o{ audits : "process_id"
    certifications ||--o{ audits : "certification_id"
    users ||--o{ audits : "auditor_id"
    processes ||--o{ committee_decisions : "process_id"
    processes ||--o{ certificates : "process_id"
    certifications ||--o{ certificates : "certification_id"
    users ||--o{ certificates : "issued_by_id"
```

---

## 3.9 Diagrama Detalhado - IA e Chat

```mermaid
erDiagram
    ai_analyses {
        uuid id PK
        uuid process_id FK
        enum analysis_type "pre_auditoria, risco, chatbot"
        enum status "pendente, concluido, erro"
        jsonb result
        float confidence "0.0-1.0"
        timestamp executed_at
        timestamp completed_at
    }

    knowledge_base {
        uuid id PK
        string content
        jsonb metadata "source, category, tags"
        vector embedding "1536 dimensions"
        timestamp created_at
    }

    chat_messages {
        uuid id PK
        uuid user_id FK
        enum role "user, assistant, system"
        string content
        jsonb metadata "sources, confidence"
        timestamp created_at
    }

    comments {
        uuid id PK
        uuid process_id FK
        uuid user_id FK
        string content
        array mentions "user IDs"
        boolean is_internal
        timestamp edited_at
        timestamp created_at
        timestamp updated_at
    }

    processes ||--o{ ai_analyses : "process_id"
    users ||--o{ chat_messages : "user_id"
    processes ||--o{ comments : "process_id"
    users ||--o{ comments : "user_id"
```

---

## 3.10 Diagrama Detalhado - Notificacoes e Audit Trail

```mermaid
erDiagram
    notifications {
        uuid id PK
        uuid user_id FK
        enum type "info, warning, error, success"
        string title
        string message
        string link
        timestamp read_at
        timestamp created_at
    }

    audit_trail {
        uuid id PK
        enum entity "process, contract, certificate, audit, document, user, company"
        uuid entity_id
        enum action "create, update, delete, approve, reject, sign, cancel"
        uuid user_id FK
        jsonb changes "before, after"
        string ip_address
        string user_agent
        timestamp created_at
    }

    users ||--o{ notifications : "user_id"
    users ||--o{ audit_trail : "user_id"
```

---

## 3.11 Diagrama Detalhado - E-Signature e Storage

```mermaid
erDiagram
    e_signature_configs {
        uuid id PK
        uuid company_id FK
        enum provider "clicksign, d4sign, docusign, adobe_sign, custom, none"
        string api_key
        string api_secret
        string webhook_url
        jsonb config
        boolean is_active
        boolean is_default
        timestamp created_at
        timestamp updated_at
    }

    signature_documents {
        uuid id PK
        uuid contract_id FK
        uuid config_id FK
        string provider_doc_id
        string signer_email
        string signer_name
        enum status "pendente, assinado, recusado, expirado, cancelado, rejeitado"
        timestamp signed_at
        timestamp refused_at
        string refusal_reason
        timestamp expires_at
        jsonb webhook_events
        string signed_document_url
        timestamp created_at
        timestamp updated_at
    }

    storage_configs {
        uuid id PK
        enum provider "s3, local, azure, gcp, cloudflare_r2"
        string access_key
        string secret_key
        string region
        string bucket
        string endpoint
        string cdn_url
        int max_file_size
        array allowed_types
        boolean is_default
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    company_buckets {
        uuid id PK
        uuid company_id FK UK
        string bucket_name
        uuid storage_config_id FK
        string path
        bigint quota
        bigint used_space
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    e_signature_configs ||--o{ signature_documents : "config_id"
    storage_configs ||--o{ company_buckets : "storage_config_id"
```

---

## 3.12 Diagrama Detalhado - CNPJ Lookup

```mermaid
erDiagram
    cnpj_lookup_configs {
        uuid id PK
        enum provider "none, brasilapi, receitaws, cnpjws"
        string receitaws_token
        string cnpjws_token
        boolean cache_enabled
        int cache_duration_hours
        int rate_limit_per_minute
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    cnpj_lookup_cache {
        uuid id PK
        uuid config_id FK
        string cnpj
        jsonb data
        enum provider
        timestamp expires_at
        timestamp created_at
    }

    cnpj_lookup_configs ||--o{ cnpj_lookup_cache : "config_id"
```

---

## 3.13 Diagrama Detalhado - Grupos Empresariais

```mermaid
erDiagram
    shared_suppliers {
        uuid id PK
        uuid group_id FK
        string name
        string document "CNPJ"
        string contact_name
        string contact_email
        string contact_phone
        array products
        enum status "pending, approved, rejected, suspended"
        timestamp approved_at
        uuid approved_by FK
        string halal_certificate_url
        timestamp halal_certificate_expiry
        uuid added_by FK
        timestamp created_at
        timestamp updated_at
    }

    corporate_documents {
        uuid id PK
        uuid group_id FK
        string name
        string description
        enum category "bpf, appcc, procedimento, manual, politica, outro"
        string file_url
        string file_name
        int file_size
        string mime_type
        timestamp valid_until
        string version
        boolean is_active
        uuid uploaded_by FK
        timestamp created_at
        timestamp updated_at
    }

    user_invites {
        uuid id PK
        uuid company_id FK
        string email
        string name
        enum role
        string token UK
        enum status "pending, accepted, expired, cancelled"
        timestamp expires_at
        uuid invited_by FK
        timestamp accepted_at
        uuid accepted_by_id FK
        timestamp created_at
        timestamp updated_at
    }

    access_requests {
        uuid id PK
        uuid company_id FK
        uuid user_id FK
        string message
        enum status "pending, approved, rejected"
        timestamp responded_at
        uuid responded_by FK
        string response_message
        timestamp created_at
        timestamp updated_at
    }

    company_groups ||--o{ shared_suppliers : "group_id"
    company_groups ||--o{ corporate_documents : "group_id"
```

---

## 3.14 Relacionamentos Principais (Visao Geral)

```
                        ┌──────────────────┐
                        │  company_groups  │
                        └────────┬─────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────────┐
│  companies   │        │shared_supplier│        │corporate_documents│
└──────┬───────┘        └──────────────┘        └──────────────────┘
       │
       ├───────────────┬──────────────────────────────────────┐
       ▼               ▼                                      ▼
┌──────────────┐  ┌──────────────┐                    ┌──────────────┐
│    plants    │  │  requests    │                    │certifications│
└──────────────┘  └──────┬───────┘                    └──────┬───────┘
                         │                                    │
                         ▼                                    ├─────────────────┐
                  ┌──────────────┐                            ▼                 ▼
                  │  processes   │                    ┌───────────────┐  ┌──────────────┐
                  └──────┬───────┘                    │cert_requests  │  │cert_scopes   │
                         │                            └───────┬───────┘  └──────┬───────┘
       ┌─────────────────┼─────────────────────┐              │                 │
       ▼                 ▼                     ▼              ▼           ┌─────┼─────┐
┌──────────────┐  ┌──────────────┐     ┌──────────────┐ ┌──────────┐     ▼     ▼     ▼
│  documents   │  │  contracts   │     │   audits     │ │workflows │  products brands suppliers
└──────────────┘  └──────────────┘     └──────────────┘ └──────────┘

users ─┬─→ processes (analista/auditor)
       ├─→ certifications (analista)
       ├─→ audit_trail
       ├─→ notifications
       └─→ chat_messages

industrial_groups ─→ industrial_categories ─→ industrial_subcategories
```

---

**Ultima atualizacao**: 24 de Janeiro de 2026
