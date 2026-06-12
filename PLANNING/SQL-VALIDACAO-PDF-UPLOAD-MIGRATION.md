# SQL — Validação da migration `add_certificate_pdf_upload`

**Migration:** `20260514110000_add_certificate_pdf_upload/migration.sql`
**Aplicar em:** prod (DBeaver) — AUTO_MIGRATE no ECS é instável
([feedback_migrations_deploy](../../../sih-docs/CLAUDE.md))
**Criado:** 2026-05-14

Cria tabela `certificate_pdf_uploads` para armazenar uploads manuais de
PDFs legados de certificados mirror (FAMBRAS). Aditiva e idempotente —
não toca em nenhuma estrutura existente.

---

## 1. ANTES — confirmar estado

### 1.1 Tabela já existe?

```sql
SELECT to_regclass('public.certificate_pdf_uploads');
```

**Esperado antes:** `NULL`.

### 1.2 Migration registrada?

```sql
SELECT migration_name, finished_at
FROM _prisma_migrations
WHERE migration_name = '20260514110000_add_certificate_pdf_upload';
```

**Esperado antes:** 0 linhas.

---

## 2. APLICAR

### 2.1 Rodar DDL

```sql
CREATE TABLE IF NOT EXISTS "certificate_pdf_uploads" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "certificate_id" UUID NOT NULL,
  "s3_uri" TEXT NOT NULL,
  "file_name" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "mime_type" VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
  "uploaded_by_id" UUID,
  "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "is_current" BOOLEAN NOT NULL DEFAULT TRUE,
  "replaced_at" TIMESTAMP(3),
  CONSTRAINT "certificate_pdf_uploads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "certificate_pdf_uploads_certificate_id_is_current_idx"
  ON "certificate_pdf_uploads"("certificate_id", "is_current");

CREATE INDEX IF NOT EXISTS "certificate_pdf_uploads_certificate_id_uploaded_at_idx"
  ON "certificate_pdf_uploads"("certificate_id", "uploaded_at");

ALTER TABLE "certificate_pdf_uploads"
  ADD CONSTRAINT "certificate_pdf_uploads_certificate_id_fkey"
  FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "certificate_pdf_uploads"
  ADD CONSTRAINT "certificate_pdf_uploads_uploaded_by_id_fkey"
  FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
```

### 2.2 Registrar em `_prisma_migrations`

```sql
INSERT INTO _prisma_migrations (
  id, checksum, finished_at, migration_name, logs,
  rolled_back_at, started_at, applied_steps_count
)
VALUES (
  gen_random_uuid()::text,
  'manual',
  NOW(),
  '20260514110000_add_certificate_pdf_upload',
  'Aplicada manualmente via DBeaver — AUTO_MIGRATE indisponível',
  NULL,
  NOW(),
  1
);
```

---

## 3. DEPOIS — confirmar

### 3.1 Tabela criada?

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'certificate_pdf_uploads'
ORDER BY ordinal_position;
```

**Esperado:** 10 colunas (`id`, `certificate_id`, `s3_uri`, `file_name`,
`file_size`, `mime_type`, `uploaded_by_id`, `uploaded_at`, `is_current`,
`replaced_at`).

### 3.2 FKs e índices

```sql
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'certificate_pdf_uploads'::regclass;
```

**Esperado:** PK + 2 FKs (certificate_id → certificates, uploaded_by_id → users).

```sql
SELECT indexname FROM pg_indexes WHERE tablename = 'certificate_pdf_uploads';
```

**Esperado:** 3 índices (PK + 2 que criamos).

### 3.3 Migration registrada?

```sql
SELECT migration_name, finished_at, applied_steps_count
FROM _prisma_migrations
WHERE migration_name = '20260514110000_add_certificate_pdf_upload';
```

**Esperado:** 1 linha, `applied_steps_count = 1`.

---

## 4. Rollback (se necessário)

Operação aditiva pura — rollback é seguro.

```sql
DROP TABLE IF EXISTS "certificate_pdf_uploads" CASCADE;
DELETE FROM _prisma_migrations
WHERE migration_name = '20260514110000_add_certificate_pdf_upload';
```

---

## Notas

- A tabela só passa a ter dados depois que o analista usar o botão
  "Anexar PDF" no detalhe de um certificado.
- O campo `Certificate.pdfUrl` continua sendo o atalho para o PDF
  corrente — quando há upload manual, é setado para o `s3_uri` do upload
  mais recente. Quando há PDF gerado pelo backend (workflow/manual mode),
  fica com a URI gerada pelo `CertificatePdfService`.
- O endpoint `GET /certificates/:id/download-url` (existente) já serve o
  PDF corrente sem mudança — basta o `pdfUrl` estar setado.
