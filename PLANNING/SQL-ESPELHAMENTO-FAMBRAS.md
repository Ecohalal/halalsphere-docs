# Espelhamento FAMBRAS via SQL puro

**Origem:** planilhas oficiais FAMBRAS em
`c:\Projetos\Ecohalal\fambras-references-2026-04\_emails-fonte\Qualidade\Lista de clientes\`
- `FM 7.8.1 - CERTIFICATED PRODUCTS INDUSTRIAL_ATIVOS - 16.04.2026.xlsx`
- `FM 7.8.2 - CERTIFICATED PRODUCTS LIST SLAUGHTERHOUSE - 08.04.2026.xlsb`

**Pipeline:** `python scripts/generate-mirror-sql.py` → `scripts/sql-out/mirror-fambras-import.sql` → DBeaver no banco destino.

**Não usa o `mirror-fambras-lists.ts`** (TypeScript com Prisma) — decisão de
2026-05-14 foi rodar via SQL puro pra evitar dependência de runtime Node
na máquina que conecta no banco.

---

## Pré-requisitos

1. Migration **`20260514100000_add_mirror_issuance_mode`** já aplicada
   (`ALTER TYPE "CertificateIssuanceMode" ADD VALUE 'mirror'`). Ver
   [SQL-VALIDACAO-MIRROR-MIGRATION.md](SQL-VALIDACAO-MIRROR-MIGRATION.md).
2. Tabela `industrial_categories` populada com os codes GSO/SMIIC
   (AI, AII, BI, BII, CI...CV, DI, DII, E, FI, FII, GI, GII, H/HI/HII/HIII, I, J, K, LI/LII/LIII).
3. Python 3 com `openpyxl` e `pyxlsb` instalados.

---

## Volume esperado

A partir das planilhas de 16/abr (FM 7.8.1) + 08/abr (FM 7.8.2):

| Métrica | Valor |
|---|---|
| Companies criadas | ~562 |
| Plants criadas | ~575 (com SIF real ou sintético `MIRROR-<cnpj>-<addr_hash>` para industriais sem SIF) |
| Certificados criados | ~1025 (após deduplicação do FM 7.8.2 que tinha linhas repetidas) |
| Linhas puladas | ~111 (CNPJ ausente — empresas estrangeiras sem documento brasileiro) |

Todos os Companies ficam num único `CompanyGroup`:
**"Espelhamento FAMBRAS (FM 7.8.x)"** (id determinístico:
`99c089ed-38db-52a1-8271-e2d575ab84e7`).

Codes GSO/SMIIC observados na fonte: `C, CI, CII, CIII, CIV, CV, CVCV, DI, G, GI, GII, I, K`
— "CVCV" é lixo da planilha; o pre-flight avisa mas não bloqueia
(o JOIN para a tabela `industrial_categories` filtra silenciosamente).

---

## Passo a passo

### 1. Gerar o SQL local (você executa)

```bash
cd c:/Projetos/Ecohalal/halalsphere-backend
python scripts/generate-mirror-sql.py
```

Saída em `scripts/sql-out/`:
- `mirror-fambras-import.sql` (~1.4MB, único arquivo, uma transação)
- `mirror-fambras-skipped.txt` (~12KB, lista das linhas puladas com motivo)

Revisar o `mirror-fambras-skipped.txt` antes de ir para o passo 2.

### 2. Conferir IndustrialCategory no banco destino

```sql
SELECT code, name, group_id
FROM industrial_categories
ORDER BY code;
```

Se algum code esperado (CI, CII, CV, K, etc.) estiver ausente, popular antes
de rodar — o pre-flight avisa, mas os certs com cats ausentes ficam **sem entradas
na M:N** (no banco, certificate fica isolado da categoria).

### 3. Abrir o SQL no DBeaver e rodar

O arquivo está estruturado como:

```
PRE-FLIGHT (DO block — só NOTICE de codes faltantes, não aborta)
BEGIN;
  -- 1. CompanyGroup (1 row, ON CONFLICT id)
  -- 2. Companies (~562 rows, ON CONFLICT country+tax_id+tax_id_type)
  -- 3. Plants (~575 rows, ON CONFLICT sanitary_code+sanitary_code_type)
  -- 4. Certifications (~1025 rows, JOIN industrial_categories pelo code primário, ON CONFLICT id)
  -- 5. CertificationIndustrialCategory M:N (~1200 rows, JOIN industrial_categories, ON CONFLICT)
  -- 6. CertificationScopes (~1025 rows, ON CONFLICT id)
  -- 7. Certificates (~1025 rows, ON CONFLICT certificate_number)
  -- 8. CertificationHistory (~1025 rows, ON CONFLICT id)
COMMIT;
```

**No DBeaver:**
- Abra a connection do banco destino (staging ou prod conforme escolha).
- File → Open SQL Script → `mirror-fambras-import.sql`.
- Executar **bloco a bloco** se quiser controle granular, ou **tudo de uma vez**
  com `Ctrl+Alt+Enter` (Execute SQL Script).
- Em caso de erro inesperado, a transação fica em estado de erro — execute
  `ROLLBACK;` manualmente.

### 4. Validar pós-execução

Logo após o `COMMIT`, o arquivo já lista as queries de validação como
comentários. Versão executável:

```sql
-- Volume total importado
SELECT issuance_mode, status, COUNT(*) AS total
FROM certificates
GROUP BY 1, 2
ORDER BY 1, 2;
-- Esperado: ~1025 linhas com (issuance_mode='mirror', status='ativo')

-- Companies no grupo dedicado
SELECT COUNT(*) AS companies, COUNT(DISTINCT country) AS paises
FROM companies
WHERE group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid;
-- Esperado: ~562 companies, ~5 países (BR + UY/AR/PE/CO/EC/etc dependendo do que entrou)

-- Plants por tipo
SELECT p.plant_type, COUNT(*) AS plantas
FROM plants p
JOIN companies c ON c.id = p.company_id
WHERE c.group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid
GROUP BY 1
ORDER BY 2 DESC;
-- Esperado: processamento (~570), abatedouro (~3), frigorifico (poucas, ~2)

-- Distribuição multi-categoria
SELECT cic_count AS categorias_por_cert, COUNT(*) AS total_certs
FROM (
  SELECT certification_id, COUNT(*) AS cic_count
  FROM certification_industrial_categories
  GROUP BY 1
) s
GROUP BY 1
ORDER BY 1;
-- Esperado: ~900 com 1 cat, ~120 com 2 cats, ~5 com 3+ cats

-- Certs cuja categoria primária não foi resolvida (industrial_category_id NULL)
SELECT cf.id, cert.certificate_number
FROM certifications cf
JOIN certificates cert ON cert.certification_id = cf.id
WHERE cert.issuance_mode = 'mirror' AND cf.industrial_category_id IS NULL
LIMIT 20;
-- Idealmente 0; se houver, indica que o code primário não existe em industrial_categories.

-- Plants com sanitary_code sintético (MIRROR-...)
SELECT COUNT(*) AS plantas_sem_sif_real
FROM plants
WHERE sanitary_code LIKE 'MIRROR-%';
-- Industriais sem SIF (polpa, suco, etc.) — esperado ~400
```

---

## Idempotência

Re-rodar o SQL é **seguro**:
- Todos os IDs são determinísticos (uuid v5 do namespace fixo `8e8a6f4d-...c0` +
  chave natural — CNPJ, SIF, certNumber).
- Cada INSERT tem `ON CONFLICT ... DO NOTHING` ancorado em unique constraint
  ou no `id` direto.
- Re-execução só cria registros novos se a planilha mudou. Os existentes
  ficam intactos.

---

## Rollback

Se precisar desfazer tudo (operação destrutiva, só em caso de erro real):

```sql
-- Em ordem reversa de FK (cascade do CompanyGroup cuidaria, mas vamos explícitos):

DELETE FROM certification_history
WHERE certification_id IN (
  SELECT id FROM certifications WHERE plant_id IN (
    SELECT p.id FROM plants p JOIN companies c ON c.id = p.company_id
    WHERE c.group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid
  )
);

DELETE FROM certificates
WHERE issuance_mode = 'mirror';

DELETE FROM certification_industrial_categories
WHERE certification_id IN (
  SELECT id FROM certifications WHERE plant_id IN (
    SELECT p.id FROM plants p JOIN companies c ON c.id = p.company_id
    WHERE c.group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid
  )
);

DELETE FROM certification_scopes
WHERE certification_id IN (
  SELECT id FROM certifications WHERE plant_id IN (
    SELECT p.id FROM plants p JOIN companies c ON c.id = p.company_id
    WHERE c.group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid
  )
);

DELETE FROM certifications
WHERE plant_id IN (
  SELECT p.id FROM plants p JOIN companies c ON c.id = p.company_id
  WHERE c.group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid
);

-- Plants e Companies do mirror group
DELETE FROM plants WHERE company_id IN (
  SELECT id FROM companies WHERE group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid
);

DELETE FROM companies WHERE group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid;

DELETE FROM company_groups WHERE id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid;
```

> **Atenção:** se algum cliente real entrou no `Espelhamento FAMBRAS` por
> engano (alguém moveu uma empresa pra esse grupo), o rollback apaga junto.
> Verificar antes:
>
> ```sql
> SELECT id, legal_name, relationship, is_verified
> FROM companies
> WHERE group_id = '99c089ed-38db-52a1-8271-e2d575ab84e7'::uuid
>   AND (relationship != 'partner' OR is_verified = true);
> ```

---

## Limites conhecidos

- **111 linhas puladas** — todas estrangeiras (URU/PER/COL/ECU) sem CNPJ.
  Para incluí-las depois, ajustar o gerador para sintetizar `tax_id` único
  (ex: `MIRROR-NOTAX-<row>-<source>`) — não recomendado se essas empresas
  vierem a formalizar relação real com EcoHalal.
- **Industriais sem SIF** entram com `sanitary_code` sintético
  (`MIRROR-<cnpj>-<addr_hash>`). Quando o cliente formalizar e fornecer o
  registro sanitário real, UPDATE manual.
- **Plants sem cidade/UF** ficam com `address: { raw: ... }` no JSON sem
  city/state extraídos. Parser de endereço foi conservador — não tenta
  interpretar geograficamente, só extrai por separadores simples.
- **PDF/QR vazios** (`pdf_url=''`, `qr_code_url=''`). Decisão de produto:
  espelhamento de metadados, sem regerar artefato. Quando o cert for
  renovado/re-emitido pelo nosso fluxo (manual ou workflow completo),
  o novo Certificate (versão 2) ganha PDF/QR no nosso S3.
