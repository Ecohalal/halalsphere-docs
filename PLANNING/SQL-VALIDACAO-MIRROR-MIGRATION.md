# SQL — Validação da migration `add_mirror_issuance_mode`

**Migration:** `20260514100000_add_mirror_issuance_mode/migration.sql`
**Aplicar em:** prod (DBeaver) — AUTO_MIGRATE no ECS é instável
([feedback_migrations_deploy](../../../sih-docs/CLAUDE.md))
**Criado:** 2026-05-14

---

## 0. SQL da migration (idempotente)

```sql
ALTER TYPE "CertificateIssuanceMode" ADD VALUE IF NOT EXISTS 'mirror';
```

`IF NOT EXISTS` torna seguro re-executar.

---

## 1. ANTES de aplicar — confirma estado atual

### 1.1 Enum existe e tem só `workflow`, `manual`?

```sql
SELECT enumlabel
FROM pg_enum
WHERE enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'CertificateIssuanceMode'
)
ORDER BY enumsortorder;
```

**Esperado antes:** 2 linhas — `workflow`, `manual`.
**Esperado depois:** 3 linhas — `workflow`, `manual`, `mirror`.

### 1.2 Migration ainda não está em `_prisma_migrations`?

```sql
SELECT migration_name, finished_at, applied_steps_count, logs
FROM _prisma_migrations
WHERE migration_name = '20260514100000_add_mirror_issuance_mode';
```

**Esperado antes:** 0 linhas.

### 1.3 Já existem certs com `issuanceMode='mirror'` no banco?

```sql
SELECT issuance_mode, COUNT(*)
FROM certificates
GROUP BY issuance_mode
ORDER BY issuance_mode;
```

**Esperado antes:** só `workflow` e/ou `manual`. **Não pode existir `mirror`** (impossível antes do enum aceitar).

---

## 2. APLICAR a migration

### 2.1 Rodar o ALTER TYPE

```sql
ALTER TYPE "CertificateIssuanceMode" ADD VALUE IF NOT EXISTS 'mirror';
```

### 2.2 Registrar manualmente em `_prisma_migrations`

(Como AUTO_MIGRATE no ECS não roda, o Prisma não vai marcar sozinho. Sem
isso, o próximo `prisma migrate deploy` vai tentar aplicar de novo —
seria idempotente mas suja o histórico.)

```sql
INSERT INTO _prisma_migrations (
  id,
  checksum,
  finished_at,
  migration_name,
  logs,
  rolled_back_at,
  started_at,
  applied_steps_count
)
VALUES (
  gen_random_uuid()::text,
  'manual',
  NOW(),
  '20260514100000_add_mirror_issuance_mode',
  'Aplicada manualmente via DBeaver — AUTO_MIGRATE indisponível',
  NULL,
  NOW(),
  1
);
```

---

## 3. DEPOIS de aplicar — confirma sucesso

### 3.1 Enum agora tem `mirror`?

```sql
SELECT enumlabel
FROM pg_enum
WHERE enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'CertificateIssuanceMode'
)
ORDER BY enumsortorder;
```

**Esperado:** `workflow`, `manual`, `mirror` (3 linhas).

### 3.2 Migration registrada?

```sql
SELECT migration_name, finished_at, applied_steps_count
FROM _prisma_migrations
WHERE migration_name = '20260514100000_add_mirror_issuance_mode';
```

**Esperado:** 1 linha com `finished_at` preenchido, `applied_steps_count = 1`.

### 3.3 Smoke test — INSERT/DELETE de cert mirror

> **Cuidado:** insere e remove um registro de teste. Só rodar fora do
> horário de uso pesado.

```sql
-- Pega 1 certification existente para amarrar o teste (qualquer cert serve)
DO $$
DECLARE
  v_cert_id UUID;
  v_certification_id UUID;
BEGIN
  SELECT id INTO v_certification_id FROM certifications LIMIT 1;
  IF v_certification_id IS NULL THEN
    RAISE NOTICE 'Sem certifications no banco — pulando smoke';
    RETURN;
  END IF;

  -- INSERT teste
  INSERT INTO certificates (
    id, certification_id, certificate_number, version, status,
    issuance_mode, issued_at, expires_at, pdf_url, qr_code_url, created_at
  )
  VALUES (
    gen_random_uuid(), v_certification_id, 'SMOKE-MIRROR-DELETE-ME',
    1, 'ativo', 'mirror', NOW(), NOW() + INTERVAL '3 years',
    '', '', NOW()
  )
  RETURNING id INTO v_cert_id;

  RAISE NOTICE 'INSERT OK: certificate id=%', v_cert_id;

  -- DELETE teste (limpa)
  DELETE FROM certificates WHERE id = v_cert_id;
  RAISE NOTICE 'DELETE OK: smoke removido';
END $$;
```

**Esperado:** 2 NOTICEs (`INSERT OK` + `DELETE OK`) sem erros.

---

## 4. Rollback (se algo der errado)

`ALTER TYPE ... ADD VALUE` **não tem rollback nativo no PostgreSQL** —
não dá para `DROP VALUE`. Se precisar reverter:

1. Deletar todos os certs com `issuance_mode = 'mirror'`:
   ```sql
   DELETE FROM certificates WHERE issuance_mode = 'mirror';
   ```
2. Recriar o enum sem `mirror`:
   ```sql
   ALTER TYPE "CertificateIssuanceMode" RENAME TO "CertificateIssuanceMode_old";
   CREATE TYPE "CertificateIssuanceMode" AS ENUM ('workflow', 'manual');
   ALTER TABLE certificates ALTER COLUMN issuance_mode TYPE
     "CertificateIssuanceMode" USING issuance_mode::text::"CertificateIssuanceMode";
   DROP TYPE "CertificateIssuanceMode_old";
   ```
3. Remover do `_prisma_migrations`:
   ```sql
   DELETE FROM _prisma_migrations
   WHERE migration_name = '20260514100000_add_mirror_issuance_mode';
   ```

> Operação destrutiva — só executar se houver erro real, não para "limpar dúvida".

---

## 5. Pós-execução do script `mirror-fambras-lists.ts`

Depois de rodar o script (se chegar a esse passo), validações úteis:

### 5.1 Volume importado

```sql
SELECT issuance_mode, status, COUNT(*) AS total
FROM certificates
GROUP BY issuance_mode, status
ORDER BY issuance_mode, status;
```

**Esperado depois do espelhamento completo:** ~1.358 linhas com
`issuance_mode='mirror'` e `status='ativo'`.

### 5.2 Companies espelhadas (no grupo dedicado)

```sql
SELECT
  cg.name AS group_name,
  COUNT(c.id) AS companies,
  COUNT(DISTINCT c.country) AS countries
FROM company_groups cg
LEFT JOIN companies c ON c.group_id = cg.id
WHERE cg.name = 'Espelhamento FAMBRAS (FM 7.8.x)'
GROUP BY cg.name;
```

**Esperado:** ~662 companies (estimativa pré-execução).

### 5.3 Plants espelhadas

```sql
SELECT
  p.plant_type,
  COUNT(*) AS plantas,
  COUNT(DISTINCT p.company_id) AS companies
FROM plants p
JOIN companies c ON c.id = p.company_id
JOIN company_groups cg ON cg.id = c.group_id
WHERE cg.name = 'Espelhamento FAMBRAS (FM 7.8.x)'
GROUP BY p.plant_type
ORDER BY plantas DESC;
```

**Esperado:** majoritariamente `processamento` (FM 7.8.1) +
`abatedouro`/`frigorifico` (FM 7.8.2). ~672 plantas total.

### 5.4 Multi-categoria efetiva

```sql
SELECT
  cic_count AS categorias_por_cert,
  COUNT(*) AS total_certs
FROM (
  SELECT cert.id, COUNT(cic.id) AS cic_count
  FROM certificates cert
  JOIN certifications cf ON cf.id = cert.certification_id
  JOIN certification_industrial_categories cic ON cic.certification_id = cf.id
  WHERE cert.issuance_mode = 'mirror'
  GROUP BY cert.id
) sub
GROUP BY cic_count
ORDER BY cic_count;
```

**Esperado:** distribuição ~1 cat (~1100), 2 cats (~150), 3+ cats
(~10) — com base no que vimos na FM 7.8.1 ("C4\nK", "C2\nK", etc.).

### 5.5 Categorias não-mapeadas (warnings do script)

Verificar manualmente os warnings impressos pelo script. Se houver muitos
"categoria GSO 'X' não encontrada", popular `industrial_categories`
faltantes antes de re-rodar.

```sql
-- Ver quais codes de IndustrialCategory existem hoje
SELECT code, name, group_id FROM industrial_categories ORDER BY code;
```

---

## Notas

- A migration é **aditiva e idempotente** — risco zero de quebrar workflow ou manual existentes.
- O script `mirror-fambras-lists.ts` **não pode rodar antes** desta migration (vai falhar ao tentar inserir `'mirror'` em coluna ainda não-aceita pelo enum).
- Qualquer erro do `_prisma_migrations` é cosmético — afeta só `prisma migrate status`, não impede emissão de certs.
