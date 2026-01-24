# 7. Migrations Strategy

**PostgreSQL 16 + Prisma | MVP em Producao: Janeiro 2026**

---

## 7.1 Ferramenta de Migrations

**Utilizada**: **Prisma Migrate** (integrado com Prisma ORM).

Vantagens:
- Migrations automaticas baseadas no schema
- Rollback nativo
- Historico versionado
- CI/CD friendly
- Suporte a preview de alteracoes
- Integracao com TypeScript

---

## 7.2 Estrutura de Migrations

```
/halalsphere-backend
  /prisma
    /migrations
      /20250110120000_init
        migration.sql
      /20250115143022_add_industrial_classification
        migration.sql
      /20250118091545_add_company_groups
        migration.sql
      /20250120153000_add_certifications
        migration.sql
      /20250122100000_add_pricing_tables
        migration.sql
      /20250123090000_add_e_signature
        migration.sql
      /20250123140000_add_storage_config
        migration.sql
      /20250124080000_add_cnpj_lookup
        migration.sql
      migration_lock.toml
    schema.prisma
```

---

## 7.3 Comandos Prisma

```bash
# Criar nova migration
npx prisma migrate dev --name add_feature_x

# Aplicar migrations em producao
npx prisma migrate deploy

# Ver status das migrations
npx prisma migrate status

# Reset do banco (CUIDADO - apaga tudo)
npx prisma migrate reset

# Gerar cliente Prisma
npx prisma generate

# Ver diff de schema
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma

# Aplicar migration especifica (rollback)
npx prisma migrate resolve --applied 20250110120000_init
```

---

## 7.4 Migrations Aplicadas (MVP)

### 20250110120000_init
Criacao inicial do schema:
- Extensions: uuid-ossp, pgcrypto, pg_trgm, vector
- Enums: UserRole (4 roles iniciais), RequestType, etc.
- Tabelas core: users, companies, requests, processes
- Tabelas de workflow: documents, contracts, audits
- Tabelas de IA: ai_analyses, knowledge_base, chat_messages
- Tabelas auxiliares: notifications, audit_trail

### 20250115143022_add_industrial_classification
Classificacao industrial GSO 2055-2:
- industrial_groups (4 grupos: A, B, C, D)
- industrial_categories (10 categorias)
- industrial_subcategories (atividades especificas)
- FKs em requests para classificacao

### 20250118091545_add_company_groups
Grupos empresariais:
- company_groups
- plants
- shared_suppliers
- corporate_documents
- user_invites
- access_requests
- Novos campos em users: is_group_admin, is_company_admin, is_temporary_admin
- Novos campos em companies: group_id, is_headquarters, pending_validation

### 20250120153000_add_certifications
Reestruturacao de certificacoes:
- certifications (entidade central)
- certification_scopes
- scope_products, scope_facilities, scope_brands, scope_suppliers
- certification_requests
- request_workflows
- certification_history

### 20250122100000_add_pricing_tables
Propostas comerciais:
- pricing_tables (tabelas de precos com multiplicadores)
- proposals (propostas calculadas)
- Novos campos: manual_adjustment, adjustment_reason

### 20250123090000_add_e_signature
Assinatura eletronica:
- e_signature_configs
- signature_documents
- Suporte: D4Sign, Clicksign, DocuSign, Adobe Sign

### 20250123140000_add_storage_config
Storage configuravel:
- storage_configs (S3, local, Azure, GCP, Cloudflare R2)
- company_buckets

### 20250124080000_add_cnpj_lookup
Consulta CNPJ:
- cnpj_lookup_configs
- cnpj_lookup_cache
- Suporte: BrasilAPI, ReceitaWS, CNPJ.ws

### 20250124120000_expand_roles
Expansao de roles (12 roles):
- UserRole enum atualizado
- Novos: comercial, juridico, financeiro, gestor_auditoria, supervisor, controlador, secretaria

---

## 7.5 Exemplo de Migration

```sql
-- Migration: 20250120153000_add_certifications

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM (
  'em_solicitacao', 'ativa', 'suspensa',
  'cancelada', 'expirada', 'recusada'
);

CREATE TYPE "SuspensionType" AS ENUM ('normal', 'entressafra');
CREATE TYPE "CancellationType" AS ENUM ('pos_suspensao', 'distrato');
CREATE TYPE "ScopeItemStatus" AS ENUM ('ativo', 'pendente', 'removido');

-- CreateTable
CREATE TABLE "certifications" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "company_id" UUID NOT NULL,
    "plant_id" UUID,
    "certification_number" VARCHAR(50),
    "certification_type" "CertificationType" NOT NULL,
    "status" "CertificationStatus" NOT NULL DEFAULT 'em_solicitacao',
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "analyst_id" UUID,
    "suspension_type" "SuspensionType",
    "suspended_at" TIMESTAMP(3),
    "max_suspension_date" TIMESTAMP(3),
    "suspension_reason" TEXT,
    "cancellation_type" "CancellationType",
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,
    "rejected_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_scopes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "certification_id" UUID NOT NULL,
    "description" TEXT,
    "production_capacity" VARCHAR(255),
    "num_employees" INTEGER,
    "num_shifts" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_scopes_pkey" PRIMARY KEY ("id")
);

-- ... mais tabelas

-- CreateIndex
CREATE INDEX "idx_certifications_company_id" ON "certifications"("company_id");
CREATE INDEX "idx_certifications_status" ON "certifications"("status");
CREATE UNIQUE INDEX "certifications_certification_number_key"
    ON "certifications"("certification_number");
CREATE UNIQUE INDEX "certification_scopes_certification_id_key"
    ON "certification_scopes"("certification_id");

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_company_id_fkey"
    FOREIGN KEY ("company_id") REFERENCES "companies"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "certifications" ADD CONSTRAINT "certifications_plant_id_fkey"
    FOREIGN KEY ("plant_id") REFERENCES "plants"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "certification_scopes" ADD CONSTRAINT "certification_scopes_certification_id_fkey"
    FOREIGN KEY ("certification_id") REFERENCES "certifications"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 7.6 Data Migration (Exemplo)

```sql
-- Migration: 20250125000000_migrate_legacy_products

-- Migrar produtos legados para nova estrutura de escopo

-- 1. Criar scope para cada certificacao existente
INSERT INTO certification_scopes (id, certification_id, created_at, updated_at)
SELECT
    uuid_generate_v4(),
    c.id,
    NOW(),
    NOW()
FROM certifications c
WHERE NOT EXISTS (
    SELECT 1 FROM certification_scopes cs
    WHERE cs.certification_id = c.id
);

-- 2. Migrar produtos do processo para scope
INSERT INTO scope_products (
    id, scope_id, name, description, category, origin, status, added_at, created_at
)
SELECT
    uuid_generate_v4(),
    cs.id,
    legacy.name,
    legacy.description,
    legacy.category,
    legacy.origin::product_origin,
    'ativo',
    NOW(),
    NOW()
FROM legacy_products legacy
JOIN certifications c ON c.process_id = legacy.process_id
JOIN certification_scopes cs ON cs.certification_id = c.id;

-- 3. (Opcional) Remover tabela legada apos validacao
-- DROP TABLE legacy_products;
```

---

## 7.7 Rollback Strategy

### Rollback Manual (SQL)

```sql
-- Reverter migration add_certifications

-- DropForeignKey
ALTER TABLE "certifications" DROP CONSTRAINT "certifications_company_id_fkey";
ALTER TABLE "certifications" DROP CONSTRAINT "certifications_plant_id_fkey";

-- DropTable
DROP TABLE "scope_suppliers";
DROP TABLE "scope_brands";
DROP TABLE "scope_facilities";
DROP TABLE "scope_products";
DROP TABLE "certification_scopes";
DROP TABLE "certification_history";
DROP TABLE "request_workflows";
DROP TABLE "certification_requests";
DROP TABLE "certifications";

-- DropEnum
DROP TYPE "CertificationStatus";
DROP TYPE "SuspensionType";
DROP TYPE "CancellationType";
DROP TYPE "ScopeItemStatus";
```

### Prisma Rollback

```bash
# Marcar migration como nao aplicada
npx prisma migrate resolve --rolled-back 20250120153000_add_certifications

# Aplicar migration de rollback
npx prisma migrate deploy
```

---

## 7.8 CI/CD Integration

### GitHub Actions

```yaml
name: Database Migration

on:
  push:
    branches: [main]
    paths:
      - 'prisma/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Check migration status
        run: npx prisma migrate status
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Apply migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Generate Prisma Client
        run: npx prisma generate
```

---

## 7.9 Boas Praticas

1. **Sempre testar em staging primeiro**
2. **Fazer backup antes de migrations destrutivas**
3. **Usar transacoes quando possivel**
4. **Evitar `ALTER TABLE` em tabelas grandes durante horario de pico**
5. **Documentar migrations com comentarios**
6. **Nunca editar migrations ja aplicadas em producao**
7. **Usar `CONCURRENTLY` para criar indices grandes**
8. **Verificar locks antes de migrations em producao**

---

**Ultima atualizacao**: 24 de Janeiro de 2026
