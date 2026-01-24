# 5. DDL (Data Definition Language)

**PostgreSQL 16 + pgvector | Scripts de Criacao do Banco**

---

## 5.1 Extensoes Requeridas

```sql
-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cryptographic functions (senhas, tokens)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigram indexes for fuzzy search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Vector embeddings for AI/RAG
CREATE EXTENSION IF NOT EXISTS "vector";
```

---

## 5.2 Enums

```sql
-- ===== USUARIOS E ROLES =====

CREATE TYPE "UserRole" AS ENUM (
  'admin',
  'empresa',
  'analista',
  'auditor',
  'gestor',
  'comercial',
  'juridico',
  'financeiro',
  'gestor_auditoria',
  'supervisor',
  'controlador',
  'secretaria'
);

-- ===== SOLICITACOES =====

CREATE TYPE "RequestType" AS ENUM (
  'nova',
  'inicial',
  'renovacao',
  'ampliacao',
  'manutencao',
  'adequacao'
);

CREATE TYPE "CertificationType" AS ENUM (
  'C1',
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
  'produto',
  'processo',
  'servico'
);

CREATE TYPE "ProductOrigin" AS ENUM (
  'animal',
  'vegetal',
  'misto',
  'quimico'
);

CREATE TYPE "RequestStatus" AS ENUM (
  'rascunho',
  'enviado',
  'pendente',
  'em_analise',
  'aprovado',
  'rejeitado',
  'cancelado'
);

-- ===== PROCESSOS =====

CREATE TYPE "ProcessStatus" AS ENUM (
  'rascunho',
  'pendente',
  'em_andamento',
  'aguardando_documentos',
  'analise_documental',
  'analise_tecnica',
  'aguardando_auditoria',
  'proposta_enviada',
  'aguardando_assinatura',
  'em_auditoria',
  'concluido',
  'aprovado',
  'reprovado',
  'certificado',
  'cancelado',
  'suspenso'
);

CREATE TYPE "ProcessPhase" AS ENUM (
  'cadastro_solicitacao',
  'analise_documental_inicial',
  'elaboracao_proposta',
  'negociacao_proposta',
  'proposta_aprovada',
  'elaboracao_contrato',
  'assinatura_contrato',
  'avaliacao_documental',
  'planejamento_auditoria',
  'auditoria_estagio1',
  'auditoria_estagio2',
  'analise_nao_conformidades',
  'correcao_nao_conformidades',
  'validacao_correcoes',
  'comite_tecnico',
  'emissao_certificado',
  'certificado_emitido'
);

CREATE TYPE "Priority" AS ENUM (
  'baixa',
  'media',
  'alta',
  'urgente'
);

-- ===== DOCUMENTOS =====

CREATE TYPE "DocumentType" AS ENUM (
  'contrato_social',
  'certidao_negativa',
  'alvara_funcionamento',
  'laudo_tecnico',
  'licenca_sanitaria',
  'fotos',
  'videos',
  'laudos',
  'manual_bpf',
  'fluxograma_processo',
  'lista_fornecedores',
  'certificado_ingredientes',
  'analise_produto',
  'rotulo_produto',
  'outros'
);

CREATE TYPE "ValidationStatus" AS ENUM (
  'pendente',
  'aprovado',
  'rejeitado'
);

CREATE TYPE "DocumentRequestStatus" AS ENUM (
  'pendente',
  'atendido',
  'cancelado'
);

-- ===== CONTRATOS =====

CREATE TYPE "ContractType" AS ENUM (
  'proposta',
  'contrato'
);

CREATE TYPE "ContractStatus" AS ENUM (
  'rascunho',
  'enviado',
  'em_negociacao',
  'assinado',
  'cancelado'
);

-- ===== AUDITORIAS =====

CREATE TYPE "AuditType" AS ENUM (
  'inicial',
  'estagio1',
  'estagio2',
  'vigilancia',
  'renovacao',
  'especial',
  'follow_up'
);

CREATE TYPE "AuditStatus" AS ENUM (
  'agendado',
  'em_andamento',
  'concluido',
  'cancelado'
);

CREATE TYPE "AuditResult" AS ENUM (
  'aprovado',
  'aprovado_condicional',
  'reprovado'
);

-- ===== COMITE =====

CREATE TYPE "DecisionType" AS ENUM (
  'aprovar',
  'reprovar',
  'solicitar_info'
);

-- ===== CERTIFICADOS =====

CREATE TYPE "CertificateStatus" AS ENUM (
  'ativo',
  'suspenso',
  'cancelado',
  'expirado'
);

-- ===== CERTIFICACOES (Nova Estrutura) =====

CREATE TYPE "CertificationStatus" AS ENUM (
  'em_solicitacao',
  'ativa',
  'suspensa',
  'cancelada',
  'expirada',
  'recusada'
);

CREATE TYPE "SuspensionType" AS ENUM (
  'normal',
  'entressafra'
);

CREATE TYPE "CancellationType" AS ENUM (
  'pos_suspensao',
  'distrato'
);

CREATE TYPE "ScopeItemStatus" AS ENUM (
  'ativo',
  'pendente',
  'removido'
);

-- ===== PROPOSTAS =====

CREATE TYPE "ProposalStatus" AS ENUM (
  'rascunho',
  'calculada',
  'enviada',
  'aceita',
  'recusada',
  'expirada'
);

-- ===== IA =====

CREATE TYPE "AnalysisType" AS ENUM (
  'pre_auditoria',
  'risco',
  'chatbot'
);

CREATE TYPE "AnalysisStatus" AS ENUM (
  'pendente',
  'concluido',
  'erro'
);

CREATE TYPE "ChatRole" AS ENUM (
  'user',
  'assistant',
  'system'
);

-- ===== NOTIFICACOES =====

CREATE TYPE "NotificationType" AS ENUM (
  'info',
  'warning',
  'error',
  'success'
);

-- ===== AUDIT TRAIL =====

CREATE TYPE "AuditEntity" AS ENUM (
  'process',
  'contract',
  'certificate',
  'audit',
  'document',
  'user',
  'company'
);

CREATE TYPE "AuditAction" AS ENUM (
  'create',
  'update',
  'delete',
  'approve',
  'reject',
  'sign',
  'cancel'
);

-- ===== PLANTAS =====

CREATE TYPE "PlantCodeType" AS ENUM (
  'sif',
  'sie',
  'sim',
  'internal'
);

-- ===== FORNECEDORES =====

CREATE TYPE "SupplierStatus" AS ENUM (
  'pending',
  'approved',
  'rejected',
  'suspended'
);

-- ===== DOCUMENTOS CORPORATIVOS =====

CREATE TYPE "CorporateDocumentCategory" AS ENUM (
  'bpf',
  'appcc',
  'procedimento',
  'manual',
  'politica',
  'outro'
);

-- ===== CONVITES E ACESSO =====

CREATE TYPE "InviteStatus" AS ENUM (
  'pending',
  'accepted',
  'expired',
  'cancelled'
);

CREATE TYPE "AccessRequestStatus" AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- ===== ASSINATURA ELETRONICA =====

CREATE TYPE "ESignatureProvider" AS ENUM (
  'clicksign',
  'd4sign',
  'docusign',
  'adobe_sign',
  'custom',
  'none'
);

CREATE TYPE "SignatureStatus" AS ENUM (
  'pendente',
  'assinado',
  'recusado',
  'expirado',
  'cancelado',
  'rejeitado'
);

-- ===== STORAGE =====

CREATE TYPE "StorageProvider" AS ENUM (
  's3',
  'local',
  'azure',
  'gcp',
  'cloudflare_r2'
);

-- ===== CNPJ LOOKUP =====

CREATE TYPE "CnpjLookupProvider" AS ENUM (
  'none',
  'brasilapi',
  'receitaws',
  'cnpjws'
);
```

---

## 5.3 Tabelas Principais

### 5.3.1 Users

```sql
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL,
  "role" "UserRole" NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(20),
  "mfa_config" JSONB,
  "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
  "login_attempts" INTEGER NOT NULL DEFAULT 0,
  "locked_until" TIMESTAMP,
  "last_login" TIMESTAMP,
  "is_group_admin" BOOLEAN NOT NULL DEFAULT false,
  "is_company_admin" BOOLEAN NOT NULL DEFAULT false,
  "is_temporary_admin" BOOLEAN NOT NULL DEFAULT false,
  "admin_assigned_at" TIMESTAMP,
  "admin_assigned_by" UUID REFERENCES "users"("id"),
  "pending_company_access" UUID,
  "access_requested_at" TIMESTAMP,
  "access_request_message" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.2 Company Groups

```sql
CREATE TABLE "company_groups" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "trade_name" VARCHAR(255),
  "document" VARCHAR(20),
  "contact_name" VARCHAR(255),
  "contact_email" VARCHAR(255),
  "contact_phone" VARCHAR(50),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.3 Companies

```sql
CREATE TABLE "companies" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID UNIQUE REFERENCES "users"("id") ON DELETE SET NULL,
  "group_id" UUID REFERENCES "company_groups"("id") ON DELETE SET NULL,
  "cnpj" VARCHAR(14) NOT NULL UNIQUE,
  "razao_social" VARCHAR(255) NOT NULL,
  "nome_fantasia" VARCHAR(255),
  "address" JSONB,
  "contact" JSONB,
  "email" VARCHAR(255),
  "telefone" VARCHAR(50),
  "endereco" TEXT,
  "cidade" VARCHAR(100),
  "estado" VARCHAR(100),
  "cep" VARCHAR(20),
  "pais" VARCHAR(100),
  "tipo_empresa" VARCHAR(100),
  "website" VARCHAR(255),
  "num_employees" INTEGER,
  "annual_revenue" DECIMAL(15,2),
  "main_activity" TEXT,
  "is_verified" BOOLEAN NOT NULL DEFAULT false,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "verified_at" TIMESTAMP,
  "verified_by" UUID REFERENCES "users"("id"),
  "is_headquarters" BOOLEAN NOT NULL DEFAULT false,
  "pending_validation" BOOLEAN NOT NULL DEFAULT true,
  "validation_notes" TEXT,
  "created_by" UUID,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.4 Plants

```sql
CREATE TABLE "plants" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "company_id" UUID NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
  "code" VARCHAR(50) NOT NULL,
  "code_type" "PlantCodeType" NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "address" TEXT NOT NULL,
  "city" VARCHAR(100),
  "state" VARCHAR(100),
  "postal_code" VARCHAR(20),
  "country" VARCHAR(10) NOT NULL DEFAULT 'BR',
  "production_capacity" VARCHAR(255),
  "employee_count" INTEGER,
  "shifts_count" INTEGER,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "plants_company_code_unique" UNIQUE ("company_id", "code")
);
```

### 5.3.5 Industrial Classification (GSO 2055-2)

```sql
CREATE TABLE "industrial_groups" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "code" VARCHAR(1) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "name_en" VARCHAR(255),
  "name_ar" VARCHAR(255),
  "description" TEXT NOT NULL,
  "description_en" TEXT,
  "description_ar" TEXT,
  "icon" VARCHAR(10),
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "industrial_categories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "group_id" UUID NOT NULL REFERENCES "industrial_groups"("id") ON DELETE CASCADE,
  "code" VARCHAR(10) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "name_en" VARCHAR(255),
  "name_ar" VARCHAR(255),
  "description" TEXT,
  "description_en" TEXT,
  "description_ar" TEXT,
  "audit_days" FLOAT,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "industrial_subcategories" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "category_id" UUID NOT NULL REFERENCES "industrial_categories"("id") ON DELETE CASCADE,
  "code" VARCHAR(10) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "name_en" VARCHAR(255),
  "name_ar" VARCHAR(255),
  "description" TEXT,
  "description_en" TEXT,
  "description_ar" TEXT,
  "examples" TEXT[] DEFAULT '{}',
  "examples_en" TEXT[] DEFAULT '{}',
  "examples_ar" TEXT[] DEFAULT '{}',
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "industrial_subcategories_category_code_unique" UNIQUE ("category_id", "code")
);
```

### 5.3.6 Requests

```sql
CREATE TABLE "requests" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "company_id" UUID NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
  "protocol" VARCHAR(50) UNIQUE,
  "company_name" VARCHAR(255) NOT NULL,
  "cnpj" VARCHAR(20),
  "request_type" "RequestType" NOT NULL,
  "certification_type" "CertificationType" NOT NULL,
  "industrial_group_id" UUID REFERENCES "industrial_groups"("id"),
  "industrial_category_id" UUID REFERENCES "industrial_categories"("id"),
  "industrial_subcategory_id" UUID REFERENCES "industrial_subcategories"("id"),
  "contact_person" VARCHAR(255),
  "contact_email" VARCHAR(255),
  "contact_phone" VARCHAR(50),
  "facility_address" TEXT,
  "facility_city" VARCHAR(100),
  "facility_state" VARCHAR(100),
  "facility_country" VARCHAR(100),
  "facility_postal_code" VARCHAR(20),
  "product_origin" "ProductOrigin",
  "product_type" VARCHAR(255),
  "product_category" VARCHAR(255),
  "product_description" TEXT,
  "product_details" JSONB,
  "production_details" JSONB,
  "industrial_classification" VARCHAR(500),
  "estimated_production_capacity" VARCHAR(255),
  "current_certifications" TEXT,
  "additional_info" TEXT,
  "status" "RequestStatus" NOT NULL DEFAULT 'rascunho',
  "submitted_at" TIMESTAMP,
  "reviewer_id" UUID REFERENCES "users"("id"),
  "reviewed_at" TIMESTAMP,
  "review_notes" TEXT,
  "rejection_reason" TEXT,
  "cancel_reason" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.7 Processes

```sql
CREATE TABLE "processes" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "request_id" UUID NOT NULL UNIQUE REFERENCES "requests"("id") ON DELETE CASCADE,
  "analyst_id" UUID REFERENCES "users"("id"),
  "auditor_id" UUID REFERENCES "users"("id"),
  "current_phase" "ProcessPhase" NOT NULL DEFAULT 'cadastro_solicitacao',
  "status" "ProcessStatus" NOT NULL DEFAULT 'pendente',
  "priority" "Priority" NOT NULL DEFAULT 'media',
  "days_in_phase" INTEGER NOT NULL DEFAULT 0,
  "estimated_end" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "process_phase_history" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "phase" INTEGER NOT NULL,
  "entered_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "exited_at" TIMESTAMP,
  "days_in_phase" INTEGER
);

CREATE TABLE "process_history" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "status" "ProcessStatus" NOT NULL,
  "notes" TEXT,
  "changed_by" UUID NOT NULL REFERENCES "users"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.8 Documents

```sql
CREATE TABLE "documents" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "request_id" UUID NOT NULL REFERENCES "requests"("id") ON DELETE CASCADE,
  "certification_id" UUID,
  "document_type" "DocumentType" NOT NULL,
  "file_name" VARCHAR(255) NOT NULL,
  "file_url" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "mime_type" VARCHAR(100) NOT NULL,
  "validation_status" "ValidationStatus" NOT NULL DEFAULT 'pendente',
  "validation_notes" TEXT,
  "valid_until" TIMESTAMP,
  "uploaded_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "validated_at" TIMESTAMP
);

CREATE TABLE "document_requests" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "requested_by" UUID NOT NULL REFERENCES "users"("id"),
  "document_type" "DocumentType" NOT NULL,
  "description" TEXT NOT NULL,
  "due_date" TIMESTAMP,
  "status" "DocumentRequestStatus" NOT NULL DEFAULT 'pendente',
  "responded_at" TIMESTAMP,
  "uploaded_doc_id" UUID REFERENCES "documents"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.9 Contracts

```sql
CREATE TABLE "contracts" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "company_id" UUID NOT NULL REFERENCES "companies"("id"),
  "certification_id" UUID,
  "contract_type" "ContractType" NOT NULL,
  "status" "ContractStatus" NOT NULL DEFAULT 'rascunho',
  "total_value" DECIMAL(10,2) NOT NULL,
  "num_installments" INTEGER NOT NULL,
  "validity_months" INTEGER NOT NULL,
  "pdf_url" TEXT,
  "sent_at" TIMESTAMP,
  "signed_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.10 Certifications (Nova Estrutura)

```sql
CREATE TABLE "certifications" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "company_id" UUID NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
  "plant_id" UUID REFERENCES "plants"("id"),
  "certification_number" VARCHAR(50) UNIQUE,
  "certification_type" "CertificationType" NOT NULL,
  "industrial_group_id" UUID REFERENCES "industrial_groups"("id"),
  "industrial_category_id" UUID REFERENCES "industrial_categories"("id"),
  "industrial_subcategory_id" UUID REFERENCES "industrial_subcategories"("id"),
  "status" "CertificationStatus" NOT NULL DEFAULT 'em_solicitacao',
  "valid_from" TIMESTAMP,
  "valid_until" TIMESTAMP,
  "analyst_id" UUID REFERENCES "users"("id"),
  "suspension_type" "SuspensionType",
  "suspended_at" TIMESTAMP,
  "max_suspension_date" TIMESTAMP,
  "suspension_reason" TEXT,
  "cancellation_type" "CancellationType",
  "cancelled_at" TIMESTAMP,
  "cancellation_reason" TEXT,
  "rejected_at" TIMESTAMP,
  "rejection_reason" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "certification_scopes" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "certification_id" UUID NOT NULL UNIQUE REFERENCES "certifications"("id") ON DELETE CASCADE,
  "description" TEXT,
  "production_capacity" VARCHAR(255),
  "num_employees" INTEGER,
  "num_shifts" INTEGER,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "scope_products" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "scope_id" UUID NOT NULL REFERENCES "certification_scopes"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "category" VARCHAR(255),
  "origin" "ProductOrigin",
  "status" "ScopeItemStatus" NOT NULL DEFAULT 'ativo',
  "added_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "removed_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "scope_facilities" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "scope_id" UUID NOT NULL REFERENCES "certification_scopes"("id") ON DELETE CASCADE,
  "name" VARCHAR(255),
  "address" TEXT NOT NULL,
  "city" VARCHAR(100),
  "state" VARCHAR(100),
  "country" VARCHAR(100),
  "postal_code" VARCHAR(20),
  "facility_type" VARCHAR(100),
  "status" "ScopeItemStatus" NOT NULL DEFAULT 'ativo',
  "added_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "removed_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "scope_brands" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "scope_id" UUID NOT NULL REFERENCES "certification_scopes"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "logo_url" TEXT,
  "status" "ScopeItemStatus" NOT NULL DEFAULT 'ativo',
  "added_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "removed_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "scope_suppliers" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "scope_id" UUID NOT NULL REFERENCES "certification_scopes"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "cnpj" VARCHAR(20),
  "ingredient_type" VARCHAR(255),
  "has_halal_certificate" BOOLEAN NOT NULL DEFAULT false,
  "status" "ScopeItemStatus" NOT NULL DEFAULT 'ativo',
  "added_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "certification_requests" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "certification_id" UUID NOT NULL REFERENCES "certifications"("id") ON DELETE CASCADE,
  "protocol" VARCHAR(50) UNIQUE,
  "request_type" "RequestType" NOT NULL,
  "status" "RequestStatus" NOT NULL DEFAULT 'rascunho',
  "submitted_at" TIMESTAMP,
  "completed_at" TIMESTAMP,
  "reviewer_id" UUID REFERENCES "users"("id"),
  "reviewed_at" TIMESTAMP,
  "review_notes" TEXT,
  "rejection_reason" TEXT,
  "change_description" TEXT,
  "change_type" VARCHAR(100),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "request_workflows" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "request_id" UUID NOT NULL UNIQUE REFERENCES "certification_requests"("id") ON DELETE CASCADE,
  "current_phase" "ProcessPhase" NOT NULL DEFAULT 'cadastro_solicitacao',
  "status" "ProcessStatus" NOT NULL DEFAULT 'rascunho',
  "priority" "Priority" NOT NULL DEFAULT 'media',
  "analyst_id" UUID REFERENCES "users"("id"),
  "auditor_id" UUID REFERENCES "users"("id"),
  "days_in_phase" INTEGER NOT NULL DEFAULT 0,
  "estimated_end" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "certification_history" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "certification_id" UUID NOT NULL REFERENCES "certifications"("id") ON DELETE CASCADE,
  "action" VARCHAR(100) NOT NULL,
  "action_description" TEXT,
  "request_id" UUID,
  "document_id" UUID,
  "audit_id" UUID,
  "certificate_id" UUID,
  "performed_by" UUID REFERENCES "users"("id"),
  "metadata" JSONB,
  "performed_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.11 Pricing and Proposals

```sql
CREATE TABLE "pricing_tables" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "version" VARCHAR(20) NOT NULL,
  "effective_from" TIMESTAMP NOT NULL,
  "effective_to" TIMESTAMP,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "base_prices" JSONB NOT NULL,
  "product_multipliers" JSONB NOT NULL,
  "shift_multipliers" JSONB NOT NULL,
  "history_multipliers" JSONB NOT NULL,
  "supplier_multipliers" JSONB NOT NULL,
  "man_hour_rates" JSONB NOT NULL,
  "travel_costs" JSONB NOT NULL,
  "accommodation_cost" DECIMAL(10,2) NOT NULL,
  "document_analysis_fee" DECIMAL(10,2) NOT NULL,
  "committee_fee" DECIMAL(10,2) NOT NULL,
  "issuance_fee" DECIMAL(10,2) NOT NULL,
  "tax_rate" DECIMAL(5,2) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "proposals" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL UNIQUE REFERENCES "processes"("id") ON DELETE CASCADE,
  "certification_id" UUID REFERENCES "certifications"("id"),
  "pricing_table_id" UUID NOT NULL REFERENCES "pricing_tables"("id"),
  "calculation_inputs" JSONB NOT NULL,
  "breakdown" JSONB NOT NULL,
  "total_value" DECIMAL(10,2) NOT NULL,
  "manual_adjustment" DECIMAL(10,2) DEFAULT 0,
  "adjustment_reason" TEXT,
  "adjusted_by" UUID REFERENCES "users"("id"),
  "final_value" DECIMAL(10,2) NOT NULL,
  "status" "ProposalStatus" NOT NULL DEFAULT 'rascunho',
  "valid_until" TIMESTAMP,
  "pdf_url" TEXT,
  "pdf_generated_at" TIMESTAMP,
  "sent_at" TIMESTAMP,
  "responded_at" TIMESTAMP,
  "response_notes" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.12 Audits and Certificates

```sql
CREATE TABLE "audits" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "certification_id" UUID REFERENCES "certifications"("id"),
  "auditor_id" UUID REFERENCES "users"("id"),
  "audit_type" "AuditType" NOT NULL,
  "status" "AuditStatus" NOT NULL DEFAULT 'agendado',
  "scheduled_date" TIMESTAMP NOT NULL,
  "completed_date" TIMESTAMP,
  "location" JSONB NOT NULL,
  "result" "AuditResult",
  "findings" JSONB,
  "auditor_notes" TEXT,
  "is_unannounced" BOOLEAN NOT NULL DEFAULT false,
  "unannounced_window_start" TIMESTAMP,
  "unannounced_window_end" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "committee_decisions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "decision_type" "DecisionType" NOT NULL,
  "justification" TEXT NOT NULL,
  "requested_info" TEXT,
  "voted_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "decided_by" VARCHAR(255) NOT NULL
);

CREATE TABLE "certificates" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "certification_id" UUID REFERENCES "certifications"("id"),
  "issued_by_id" UUID REFERENCES "users"("id"),
  "certificate_number" VARCHAR(50) NOT NULL UNIQUE,
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" "CertificateStatus" NOT NULL DEFAULT 'ativo',
  "issued_at" TIMESTAMP NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "pdf_url" TEXT NOT NULL,
  "qr_code_url" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.13 AI and Chat

```sql
CREATE TABLE "ai_analyses" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "analysis_type" "AnalysisType" NOT NULL,
  "status" "AnalysisStatus" NOT NULL DEFAULT 'pendente',
  "result" JSONB,
  "confidence" FLOAT,
  "executed_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "completed_at" TIMESTAMP
);

CREATE TABLE "knowledge_base" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "content" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "embedding" VECTOR(1536),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "chat_messages" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" "ChatRole" NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "comments" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "process_id" UUID NOT NULL REFERENCES "processes"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "content" TEXT NOT NULL,
  "mentions" TEXT[] DEFAULT '{}',
  "is_internal" BOOLEAN NOT NULL DEFAULT false,
  "edited_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.14 Notifications and Audit Trail

```sql
CREATE TABLE "notifications" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" "NotificationType" NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "link" VARCHAR(255),
  "read_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "audit_trail" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "entity" "AuditEntity" NOT NULL,
  "entity_id" UUID NOT NULL,
  "action" "AuditAction" NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "changes" JSONB,
  "ip_address" VARCHAR(45),
  "user_agent" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.15 Company Groups and Onboarding

```sql
CREATE TABLE "shared_suppliers" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "group_id" UUID NOT NULL REFERENCES "company_groups"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "document" VARCHAR(20),
  "contact_name" VARCHAR(255),
  "contact_email" VARCHAR(255),
  "contact_phone" VARCHAR(50),
  "products" TEXT[] DEFAULT '{}',
  "status" "SupplierStatus" NOT NULL DEFAULT 'pending',
  "approved_at" TIMESTAMP,
  "approved_by" UUID,
  "halal_certificate_url" TEXT,
  "halal_certificate_expiry" TIMESTAMP,
  "added_by" UUID NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "corporate_documents" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "group_id" UUID NOT NULL REFERENCES "company_groups"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "category" "CorporateDocumentCategory" NOT NULL,
  "file_url" TEXT NOT NULL,
  "file_name" VARCHAR(255) NOT NULL,
  "file_size" INTEGER NOT NULL,
  "mime_type" VARCHAR(100) NOT NULL,
  "valid_until" TIMESTAMP,
  "version" VARCHAR(20),
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "uploaded_by" UUID NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "user_invites" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "company_id" UUID NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255),
  "role" "UserRole" NOT NULL DEFAULT 'empresa',
  "token" VARCHAR(100) NOT NULL UNIQUE,
  "status" "InviteStatus" NOT NULL DEFAULT 'pending',
  "expires_at" TIMESTAMP NOT NULL,
  "invited_by" UUID NOT NULL,
  "accepted_at" TIMESTAMP,
  "accepted_by_id" UUID,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "access_requests" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "company_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "message" TEXT,
  "status" "AccessRequestStatus" NOT NULL DEFAULT 'pending',
  "responded_at" TIMESTAMP,
  "responded_by" UUID,
  "response_message" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "access_requests_company_user_unique" UNIQUE ("company_id", "user_id")
);
```

### 5.3.16 E-Signature

```sql
CREATE TABLE "e_signature_configs" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "company_id" UUID,
  "provider" "ESignatureProvider" NOT NULL,
  "api_key" TEXT,
  "api_secret" TEXT,
  "webhook_url" TEXT,
  "config" JSONB,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "signature_documents" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "contract_id" UUID NOT NULL,
  "config_id" UUID NOT NULL,
  "provider_doc_id" TEXT NOT NULL,
  "signer_email" VARCHAR(255) NOT NULL,
  "signer_name" VARCHAR(255) NOT NULL,
  "status" "SignatureStatus" NOT NULL DEFAULT 'pendente',
  "signed_at" TIMESTAMP,
  "refused_at" TIMESTAMP,
  "refusal_reason" TEXT,
  "expires_at" TIMESTAMP,
  "webhook_events" JSONB,
  "signed_document_url" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.17 Storage

```sql
CREATE TABLE "storage_configs" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "provider" "StorageProvider" NOT NULL,
  "access_key" TEXT,
  "secret_key" TEXT,
  "region" VARCHAR(50),
  "bucket" VARCHAR(255),
  "endpoint" TEXT,
  "cdn_url" TEXT,
  "max_file_size" INTEGER DEFAULT 52428800,
  "allowed_types" TEXT[] DEFAULT ARRAY['application/pdf', 'image/jpeg', 'image/png'],
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "company_buckets" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "company_id" UUID NOT NULL UNIQUE,
  "bucket_name" VARCHAR(255) NOT NULL,
  "storage_config_id" UUID NOT NULL REFERENCES "storage_configs"("id"),
  "path" VARCHAR(500),
  "quota" BIGINT,
  "used_space" BIGINT NOT NULL DEFAULT 0,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 5.3.18 CNPJ Lookup

```sql
CREATE TABLE "cnpj_lookup_configs" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "provider" "CnpjLookupProvider" NOT NULL,
  "receitaws_token" TEXT,
  "cnpjws_token" TEXT,
  "cache_enabled" BOOLEAN NOT NULL DEFAULT true,
  "cache_duration_hours" INTEGER NOT NULL DEFAULT 24,
  "rate_limit_per_minute" INTEGER NOT NULL DEFAULT 10,
  "is_active" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "cnpj_lookup_cache" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "config_id" UUID NOT NULL REFERENCES "cnpj_lookup_configs"("id"),
  "cnpj" VARCHAR(14) NOT NULL,
  "data" JSONB NOT NULL,
  "provider" "CnpjLookupProvider" NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "cnpj_lookup_cache_cnpj_config_unique" UNIQUE ("cnpj", "config_id")
);
```

---

**Ultima atualizacao**: 24 de Janeiro de 2026
