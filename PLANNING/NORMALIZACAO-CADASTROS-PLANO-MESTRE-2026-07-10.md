# Normalização de cadastros GC — Plano-mestre (Grupo → Empresa → Planta → Produto → MP)

> **Datado: 2026-07-10.** Workstream multi-sessão. Objetivo: equalizar/normalizar
> toda a árvore de cadastro do GC (halalsphere), consumindo o SysHalal como fonte de
> endereços/estabelecimentos (chave CNPJ p/ empresa, SIF p/ planta) + Receita/FAMBRAS
> onde o SysHalal não cobre.
>
> **⚠️ Conexões DBeaver (fácil confundir):** `postgres` / Script-74 = **GC (halalsphere)** ·
> `HALAL PROD` = **SysHalal** · `db_ecohalal_sih` = SIH. Scripts de GC (painéis, staging SIGSIF,
> updates de empresa/planta) rodam no **postgres/GC**; extract/gerador do SysHalal rodam na
> **HALAL PROD**. Os scripts de GC têm guard `to_regclass('public.plants')` que aborta se a
> conexão estiver errada. **Auto-commit ON** ou `COMMIT;` explícito — senão staging não persiste.
>
> **Regras operacionais** (herdadas): DDL via migration; **dado/carga via SQL manual p/ Renato
> rodar no DBeaver** (colar outputs, nunca presumir); **merge por chave natural** (CNPJ/SIF/nome,
> nunca UUID de export); GC e SysHalal são **bancos separados** → carga por **gerador SQL**
> (uma query no SysHalal cospe o script do GC) ou ETL `gen_*.py`; toda escrita em prod pede OK.

## Árvore e dimensões

| Nível | Tabela | Dimensões a normalizar | Fonte da verdade | Mecanismo |
|---|---|---|---|---|
| 1. Grupo | `company_groups` | nome canônico; `document` (CNPJ holding); dedup por nome/doc | Receita / FAMBRAS | SQL |
| 2. Empresa | `companies` | `address` JSON (city/UF/logradouro); `legal_name`/`trade_name`; CNPJ (formato) | **SysHalal** (endereço, chave CNPJ) + Receita | gerador SysHalal→GC |
| 3. Planta | `plants` | `address` JSON; `sanitary_code` (SIF); `display_name` "Razão — Cidade/UF (SIF n)"; `plant_type`/`species` | **SIGSIF** (dados abertos MAPA, chave SIF + CNPJ) · SysHalal alternativo | staging CSV→GC + UPDATE |
| 4. Produto | `products` | nome canônico; dedup intra-empresa; NCM/HS | catálogo/seed + SysHalal | SQL/ETL |
| 5. Matéria-Prima | `raw_material_masters` + `company_raw_materials` + `raw_material_supplier_entities` | dedup/merge de master; matching dos `awaiting_matching`; dedup fornecedor | catálogo FAMBRAS | mecanismo merge nativo (`mergedIntoId`) + SQL |

## Diagnóstico (números reais)

### Nível 2 — Empresa (medido 2026-07-09, GC prod)
- 820 empresas ativas · **0 sem CNPJ** · CNPJ **100% dígitos puros** (match limpo).
- **399 com `state` fora do padrão UF de 2 letras** (nome por extenso) ← headline.
- ~16–21 sem address/cidade/UF · **14 BR com CNPJ ≠ 14 dígitos** (conferir).
- **Duplicatas = 0** (mesmo CNPJ / mesmo nome de grupo): não há epidemia de merge.
- Distribuição: BR 738 · CO 23 · AR 19 · PY 15 · UY 7 · PE 7 · EC 5 · CL 4 · VE 1 · BO 1.

### Leva 1 — Empresa endereços aplicada (2026-07-10, GC prod)
- Gerador A.4 rodado no SysHalal → script no GC → **288 empresas casaram** por CNPJ.
- Resultado (transação, pré-COMMIT, monotônico e seguro — nenhuma regressão):
  - `uf_nao_2_letras`: **399 → 333** (66 UFs corrigidas de nome-por-extenso p/ sigla).
  - `sem_cidade`: **19 → 3** (16 cidades preenchidas).
  - \+ rua/número/CEP/bairro detalhados nas 288.
- **Restam 333 UF ruins** — todas nas ~450 empresas BR **sem match SysHalal** (cadastro manual) → alvo da **2ª fonte (Receita)**, leva 2.
- Merge validado seguro: contadores só caíram (nada bom→ruim). **COMMIT executado 2026-07-10.** ✅

### Leva 2 — Empresa endereços via Receita (BrasilAPI) COMMITADO (2026-07-10) ✅
- 328 CNPJs-alvo (BR sem/UF-ruim) → 319 enriquecidos (9 CNPJs inválidos/400 → pendência manual).
- Merge fino: `state` SEMPRE da Receita; cidade do GC mantida (com acento) quando é a MESMA (comparação sem acento), senão Receita vence cidade+UF (evita "Canápolis/SP").
- Resultado: **`uf_ruim_br` 333 → 19** (as 19 = 9 inválidas + ~10 não-BR/sem-match).
- Fonte: BrasilAPI keyless (exige UA de navegador); cidade Receita vem sem acento (Title Case).

### Nível 1 — Grupo COMMITADO (2026-07-10) ✅
- **Decisão: nomes de grupo em CAIXA ALTA** (`upper(btrim(name))`).
- **Segregação JBS:** "Grupo JBS" (67 empresas) → 3 grupos: **GRUPO JBS** (JBS S/A bovino, raiz 02916265) · **GRUPO JBS AVES** (JBS Aves 08199996 + Jandelle 74101569) · **GRUPO SEARA** (Seara 02914460). Classificação por nome + raiz de CNPJ.
- Follow-up: quebras de linha em `legal_name` (JBS/Seara "⏎Pedra Preta", "⏎(Antiga Bunge)").

### Fonte SysHalal p/ empresa (medido 2026-07-09)
- Cadeia: `tb_empresa_docs`(nome_doc='CNPJ') → `tb_empresa` → `tb_endereco` → `aux_tb_cidades` → `aux_tb_estados`(sigla=UF) → `aux_tb_paises`.
- **~418 CNPJs BR distintos com endereço completo** (cidade+UF). ~502 "empresas" estrangeiras têm linha CNPJ com `nr_doc` vazio (ruído, descartado por `char_length(digits)=14`).
- Cobertura ≈ **57% das 738 BR** do GC → resto vai p/ 2ª fonte (Receita).

### Nível 1 — Grupo (parcial)
- 554 grupos ativos · **554/554 sem `document`** (CNPJ holding) · 0 nomes duplicados (normalizado).

### Nível 3 — Planta (parcial, medido 2026-07-09)
- 812 plantas · **453 sem address · 484 sem UF · 500 sem SIF · 431 sem `display_name`**. Muito pior que empresa.

### Leva 2 — Planta endereços/SIF via SIGSIF aplicada (2026-07-10, GC prod) ✅
- Staging `stg_sigsif` carregada no GC (3.092 SIF). Match: **298 de 312 plantas com SIF** casam.
- UPDATE commitado: **endereço 453→214 sem address (−239)** · `display_name` preenchido nos matches · descobrir-SIF = **0** (guard `NOT EXISTS` evitou duplicar SIF já usado — no-op seguro).
- **Achado:** 433 plantas tinham `display_name` PRÉ-EXISTENTE com SIF divergente (seed antigo, ex.: "Concórdia/SC (SIF 1)" na FADEL que é argentina). Não é dano do update (as escritas do match são auto-consistentes).
- **Correção:** `gc-rebuild-display-name-plantas.sql` — regenera `display_name` de TODAS as plantas ativas como "Razão — Cidade/UF (TIPO código)" usando `sanitary_code_type` real (SIF/SIE/SISBI/Est. AR…), não "SIF" fixo. Idempotente, preview→COMMIT.

### ⚠️ Bug leva 2 + corretivo (2026-07-10)
- **Bug:** o match `sanitary_code ↔ nr_sif` NÃO filtrou `sanitary_code_type='SIF'`. Plantas
  Est. AR/PY/UY/SIE/SISBI cujo NÚMERO coincide com um SIF brasileiro herdaram endereço BR
  de outro estabelecimento (ex.: AVICOLA CAPITAN SARMIENTO argentina → "Paraguaçu/MG").
- **Corretivo:** `gc-fix-plantas-nao-sif-contaminadas.sql` — zera o endereço BR indevido das
  plantas não-SIF (cidade/UF atual == SIGSIF do código colidente). Reenriquecimento AR/PY via
  SysHalal por CNPJ fica p/ etapa futura. Script `sigsif-update-plantas.sql` blindado com
  `sanitary_code_type='SIF'` no match (não recontamina se re-rodado).
- **Ordem:** ROLLBACK do rebuild display_name → rodar corretivo (COMMIT) → re-rodar rebuild.
- **Corretivo aplicado (COMMIT 2026-07-10):** 24 plantas não-SIF (3 AR, 10 IVO_PY, 2 INVIMA, 9 NAO_APLICAVEL) tiveram endereço BR indevido zerado.
- **Rebuild display_name aplicado (COMMIT 2026-07-10):** 805/812 regeneradas p/ "legal_name — Cidade/UF (TIPO código)"; lixo "Concórdia/SC (SIF 1)" eliminado; estrangeiras sem cidade BR falsa. Decisão: usar `legal_name` completo como Razão.
- **Pendências N3:** (a) reenriquecer AR/PY/estrangeiras via SysHalal por CNPJ (endereço correto); (b) varredura NAO_APLICAVEL cujo código = SIF real → candidatas a reclassificar `sanitary_code_type`.

### Fonte SIGSIF p/ planta (2026-07-10) — dados abertos MAPA
- Dataset "Estabelecimentos Registrados no SIF", CC-BY, atualizado 2026-07-02.
- Download (CSV ~11 MB, UTF-8, sep `;`) — **exige User-Agent de navegador** (WAF do gov.br bloqueia curl default):
  ```
  curl -sL -A "Mozilla/5.0 ... Chrome/126 Safari/537.36" \
    "https://dados.agricultura.gov.br/dataset/062166e3-b515-4274-8e7d-68aadd64b820/resource/97277e92-264a-4dc0-9aea-f87b8ea93798/download/sigsifestabelecimentosnosif.csv" \
    -o sigsif.csv
  ```
- Colunas: `CPF_CNPJ; RAZAO_SOCIAL; NOME_FANTASIA; NR_SIF; DATA_RESERVA; DT_REGISTRO; NUMERO_PROCESSO; SITUACAO; LOGRADOURO; BAIRRO; CEP; MUNICIPIO; UF; TELEFONE; EMAIL; AREA_CATEGORIA; CATEGORIA_CLASSE; DATA_OCORRENCIA; DESCRICAO_OCORRENCIA`.
- 26.462 linhas (1 por ocorrência/habilitação) → **3.138 SIF distintos**; 23.765 ativos (`SITUACAO='A'`).
- Dedup p/ 1 linha por SIF (só ativos, colunas de estabelecimento):
  ```
  awk -F';' 'NR>1 && $8=="A" && $4!="" && !seen[$4]++ {cnpj=$1;gsub(/[^0-9]/,"",cnpj);
    print cnpj";"$2";"$3";"$4";"$8";"$9";"$10";"$11";"$12";"$13";"$16";"$17}' sigsif.csv
  ```
  → **3.129 estabelecimentos** (2.864 c/ CNPJ 14 díg). Categorias: LEITE 1040 · CARNE 732 · OVOS 492 · MEL 253 · PESCADO 221 · NÃO COMESTÍVEL 196 · ESTOCAGEM 116.
- Carga: gerar `stg-sigsif-load.sql` (CREATE TABLE `stg_sigsif` + INSERTs, filtrando `uf ~ '^[A-Z]{2}$'`) → rodar no GC. Match: `sanitary_code` ↔ `nr_sif` (chave = só dígitos sem zero à esquerda) e `companies.tax_id` ↔ `cnpj_digitos` p/ **descobrir SIF** de planta sem código.

### Níveis 1, 4, 5 — medido 2026-07-10 (diag #2, GC prod)
- **Grupo (N1):** 554 · 0 espaço-nas-pontas · 0 espaço-duplo · **23 CAIXA ALTA** (cosmético). Normalização trivial.
- **Produto (N4):** `products` (catálogo-mestre por empresa) = **VAZIO (0)**. Produtos reais vivem em `scope_products` (~14,8k do seed). N4 como catálogo-mestre **não se aplica** hoje — confirmar se `products` é intencionalmente não-usado.
- **MP (N5) — o gargalo:** `company_raw_materials` = **504** (26 empresas), **100% `awaiting_matching`, 0 vinculadas a master**; `raw_material_masters` = **0** (catálogo global vazio). Normalização = **popular o master + matching** (trabalho FAM-0017). `raw_material_supplier_entities` = 579, **todos sem `tax_id`**.

## Mecanismo de carga (padrão)

**Gerador SysHalal→GC**: uma query no SysHalal monta (via `format('%L')`, escape seguro) o
script completo do GC — `BEGIN` + temp table com os dados + SELECTs de **preview/diff** + `UPDATE`
+ lembrete de `COMMIT/ROLLBACK`. Renato roda no SysHalal, copia a célula, cola no GC, revisa o
preview, decide COMMIT. **Merge**: `address = address_atual || address_syshalal` (SysHalal vence
nas chaves que traz, preserva chaves só-GC). Nada grava sem COMMIT do Renato.

Scripts SQL (embutidos no Anexo A abaixo — versionados com este plano, não dependem do scratchpad):
- Painel #1 — diagnóstico GC (empresa/grupo/planta).
- Painel #2 — diagnóstico GC (produto/MP/grupo-nomes).
- Extract SysHalal — probe + cobertura de endereços por CNPJ.
- **Gerador SysHalal→GC** — UPDATE de endereço de empresa (pronto; aguarda run+preview+COMMIT).

## Sequência de ataque

1. **Empresa — endereços** (em execução): rodar gerador, preview, COMMIT.
2. **Empresa — 2ª fonte (Receita)** p/ as ~320 BR sem match SysHalal + 14 CNPJ inválidos.
3. **Grupo**: canonicalizar nome; decidir se preenche `document` (Receita).
4. **Planta**: gerador SysHalal por SIF (endereço + SIF + `display_name`).
5. **Produto**: dedup intra-empresa + canonical + NCM.
6. **MP**: merge de master (mecanismo nativo) + matching `awaiting_matching`.

## Decisões de PO pendentes
- Formato canônico do CNPJ armazenado (dígitos vs máscara) — hoje GC usa dígitos.
- 2ª fonte de endereço (Receita/cnpj.ws automático vs planilha FAMBRAS vs manual).
- Preencher `document` (CNPJ holding) dos grupos? (não afeta certificado).
- Regra de merge de MP duplicada (auto por CAS/nome vs revisão caso a caso).

---

# Anexo A — Scripts SQL (fonte única, versionada)

## Ordem de execução

| Passo | Script | Conexão | Escreve? | Saída / ação |
|---|---|---|---|---|
| 1 | A.1 Painel #1 | **GC** | não | números empresa/planta/grupo-doc (✅ já rodado 2026-07-09) |
| 2 | A.3 Extract SysHalal | **SysHalal** | não | probe `nome_doc` + cobertura (✅ já rodado) |
| 3 | A.4 Gerador SysHalal→GC | **SysHalal** | não (gera texto) | cospe o script do GC → colar no GC → preview → **COMMIT** |
| 4 | A.2 Painel #2 | **GC** | não | números produto/MP/grupo-nomes (⏳ pendente) |

> Passos 1–3 são a leva de **endereços de empresa** (N2). O passo 4 abre os níveis
> **Produto/MP** para o sequenciamento (ver "Sequência de ataque"). Nenhum script
> escreve sozinho: o único write é o `UPDATE` do A.4, atrás de `BEGIN`/preview/`COMMIT`.

## A.1 — Painel de diagnóstico #1 (rodar no GC)

```sql
-- Volumetria + cidade/UF (empresa e planta) + tax_id/document + duplicatas + SIF + país.
SELECT '0. volumetria' AS bloco,
  (SELECT count(*) FROM company_groups WHERE is_active) AS grupos_ativos,
  (SELECT count(*) FROM companies      WHERE is_active) AS empresas_ativas,
  (SELECT count(*) FROM plants         WHERE is_active) AS plantas_ativas;

SELECT '1. empresas cidade/uf' AS bloco,
  count(*) AS total,
  count(*) FILTER (WHERE address IS NULL) AS sem_address,
  count(*) FILTER (WHERE NULLIF(trim(address->>'city'),'') IS NULL)  AS sem_cidade,
  count(*) FILTER (WHERE NULLIF(trim(address->>'state'),'') IS NULL) AS sem_uf,
  count(*) FILTER (WHERE address->>'state' IS NOT NULL
                    AND char_length(trim(address->>'state')) <> 2)   AS uf_nao_2_letras
FROM companies WHERE is_active;

SELECT '2. plantas cidade/uf' AS bloco,
  count(*) AS total,
  count(*) FILTER (WHERE address IS NULL) AS sem_address,
  count(*) FILTER (WHERE NULLIF(trim(address->>'city'),'') IS NULL)  AS sem_cidade,
  count(*) FILTER (WHERE NULLIF(trim(address->>'state'),'') IS NULL) AS sem_uf,
  count(*) FILTER (WHERE display_name IS NULL) AS sem_display_name
FROM plants WHERE is_active;

SELECT '3. empresas tax_id' AS bloco,
  count(*) AS total,
  count(*) FILTER (WHERE NULLIF(trim(tax_id),'') IS NULL)           AS sem_tax_id,
  count(*) FILTER (WHERE tax_id ~ '[.\-/]')                         AS com_mascara,
  count(*) FILTER (WHERE tax_id IS NOT NULL AND tax_id !~ '[.\-/]') AS sem_mascara,
  count(*) FILTER (WHERE country = 'BR'
        AND char_length(regexp_replace(coalesce(tax_id,''),'\D','','g')) <> 14) AS br_digitos_diferente_de_14
FROM companies WHERE is_active;

SELECT '4. grupos document' AS bloco,
  count(*) AS total,
  count(*) FILTER (WHERE NULLIF(trim(document),'') IS NULL) AS sem_document,
  count(*) FILTER (WHERE document ~ '[.\-/]')               AS com_mascara
FROM company_groups WHERE is_active;

SELECT '5. empresas cnpj duplicado' AS bloco,
  regexp_replace(tax_id,'\D','','g') AS cnpj_digitos, count(*) AS qtd,
  string_agg(DISTINCT legal_name, ' | ') AS razoes
FROM companies WHERE is_active AND NULLIF(trim(tax_id),'') IS NOT NULL
GROUP BY regexp_replace(tax_id,'\D','','g') HAVING count(*) > 1
ORDER BY qtd DESC LIMIT 50;

SELECT '6. grupos nome duplicado' AS bloco,
  upper(trim(name)) AS nome_norm, count(*) AS qtd,
  string_agg(DISTINCT coalesce(document,'(sem doc)'), ' | ') AS documentos
FROM company_groups WHERE is_active
GROUP BY upper(trim(name)) HAVING count(*) > 1
ORDER BY qtd DESC LIMIT 50;

SELECT '7. grupos mesmo document' AS bloco,
  regexp_replace(document,'\D','','g') AS doc_digitos, count(*) AS qtd,
  string_agg(DISTINCT name, ' | ') AS nomes
FROM company_groups WHERE is_active AND NULLIF(trim(document),'') IS NOT NULL
GROUP BY regexp_replace(document,'\D','','g') HAVING count(*) > 1
ORDER BY qtd DESC LIMIT 50;

SELECT '8. plantas sem SIF' AS bloco,
  count(*) AS total,
  count(*) FILTER (WHERE NULLIF(trim(sanitary_code),'') IS NULL) AS sem_sanitary_code,
  count(*) FILTER (WHERE sanitary_code_type = 'NAO_APLICAVEL')   AS tipo_nao_aplicavel
FROM plants WHERE is_active;

SELECT '9. empresas por pais' AS bloco, country, count(*) AS qtd
FROM companies WHERE is_active GROUP BY country ORDER BY qtd DESC;
```

## A.2 — Painel de diagnóstico #2 — produto/MP/grupo (rodar no GC)

```sql
SELECT '10. produtos' AS bloco,
  count(*) AS total_ativos, count(DISTINCT company_id) AS empresas_com_produto,
  count(*) FILTER (WHERE NULLIF(trim(name),'') IS NULL)     AS sem_nome,
  count(*) FILTER (WHERE NULLIF(trim(category),'') IS NULL) AS sem_categoria,
  count(*) FILTER (WHERE NULLIF(trim(ncm),'') IS NULL)      AS sem_ncm
FROM products WHERE is_active;

SELECT '11. produto dup intra-empresa' AS bloco,
  count(*) AS grupos_duplicados, coalesce(sum(qtd) - count(*), 0) AS linhas_excedentes
FROM (
  SELECT company_id, lower(btrim(regexp_replace(name,'\s+',' ','g'))) AS nome_norm, count(*) AS qtd
  FROM products WHERE is_active AND NULLIF(trim(name),'') IS NOT NULL
  GROUP BY company_id, lower(btrim(regexp_replace(name,'\s+',' ','g')))
  HAVING count(*) > 1
) d;

SELECT '12. raw_material_masters' AS bloco,
  count(*) AS total,
  count(*) FILTER (WHERE is_active) AS ativos,
  count(*) FILTER (WHERE merged_into_id IS NOT NULL) AS ja_mesclados,
  count(*) FILTER (WHERE NULLIF(trim(cas_number),'') IS NULL) AS sem_cas,
  count(*) FILTER (WHERE approval_status = 'pending')  AS pendentes,
  count(*) FILTER (WHERE approval_status = 'approved') AS aprovados
FROM raw_material_masters;

SELECT '13. rmm dup por nome' AS bloco,
  lower(btrim(regexp_replace(canonical_name,'\s+',' ','g'))) AS nome_norm, count(*) AS qtd,
  string_agg(DISTINCT coalesce(cas_number,'(sem cas)'), ' | ') AS cas
FROM raw_material_masters WHERE is_active AND merged_into_id IS NULL
GROUP BY lower(btrim(regexp_replace(canonical_name,'\s+',' ','g')))
HAVING count(*) > 1 ORDER BY qtd DESC LIMIT 50;

SELECT '14. company_raw_materials' AS bloco,
  count(*) AS total_ativos,
  count(*) FILTER (WHERE awaiting_matching) AS aguardando_match,
  count(*) FILTER (WHERE raw_material_master_id IS NULL) AS sem_master_vinculado,
  count(DISTINCT company_id) AS empresas
FROM company_raw_materials WHERE is_active;

SELECT '15. rms_entities dup' AS bloco,
  count(*) AS total_ativos,
  count(*) FILTER (WHERE NULLIF(trim(tax_id),'') IS NULL) AS sem_tax_id,
  (SELECT count(*) FROM (
     SELECT regexp_replace(tax_id,'\D','','g') d
     FROM raw_material_supplier_entities
     WHERE is_active AND NULLIF(trim(tax_id),'') IS NOT NULL
     GROUP BY regexp_replace(tax_id,'\D','','g') HAVING count(*) > 1
   ) x) AS taxids_duplicados
FROM raw_material_supplier_entities WHERE is_active;

SELECT '16. grupos nome higiene' AS bloco,
  count(*) AS total_ativos,
  count(*) FILTER (WHERE name <> btrim(name))                   AS com_espaco_nas_pontas,
  count(*) FILTER (WHERE name ~ '\s{2,}')                       AS com_espaco_duplo,
  count(*) FILTER (WHERE name = upper(name) AND name ~ '[A-Z]') AS todo_maiusculo
FROM company_groups WHERE is_active;
```

## A.3 — Extract de endereços por CNPJ (rodar no SysHalal, read-only)

```sql
-- A. PROBE: rótulos de documento (confirmar o label do CNPJ)
SELECT nome_doc, count(*) AS qtd FROM tb_empresa_docs GROUP BY nome_doc ORDER BY qtd DESC;

-- B. COBERTURA: quantos CNPJs distintos têm endereço completo
WITH base AS (
  SELECT regexp_replace(d.nr_doc,'\D','','g') AS cnpj_digitos,
    en.endereco, c.nome AS cidade, es.sigla AS uf
  FROM tb_empresa_docs d
  JOIN tb_empresa e ON e.id=d.empresa_id AND e.deleted_at IS NULL
  LEFT JOIN tb_endereco en ON en.id=e.endereco_id
  LEFT JOIN aux_tb_cidades c ON c.id=en.cidade_id
  LEFT JOIN aux_tb_estados es ON es.id=c.estado_id
  WHERE d.nome_doc ILIKE '%CNPJ%'
)
SELECT 'B. cobertura' AS bloco, count(*) AS linhas_cnpj,
  count(DISTINCT cnpj_digitos) AS cnpjs_distintos,
  count(*) FILTER (WHERE char_length(cnpj_digitos)=14) AS cnpj_14_digitos,
  count(*) FILTER (WHERE endereco IS NOT NULL) AS com_logradouro,
  count(*) FILTER (WHERE cidade IS NOT NULL)   AS com_cidade,
  count(*) FILTER (WHERE uf IS NOT NULL)        AS com_uf
FROM base;
```

## A.4 — GERADOR SysHalal→GC — UPDATE de endereços de empresa

Rodar no **SysHalal**. Retorna uma célula (`gc_script`) com o script completo do GC.
Copiar a célula (value viewer) → nova aba **GC** → colar → revisar preview → `COMMIT`/`ROLLBACK`.

```sql
WITH fonte AS (
  SELECT DISTINCT ON (regexp_replace(d.nr_doc,'\D','','g'))
    regexp_replace(d.nr_doc,'\D','','g') AS cnpj,
    jsonb_strip_nulls(jsonb_build_object(
      'street',       NULLIF(btrim(en.endereco),   ''),
      'number',       NULLIF(btrim(en.numero),     ''),
      'complement',   NULLIF(btrim(en.complemento),''),
      'neighborhood', NULLIF(btrim(en.bairro),     ''),
      'city',         NULLIF(btrim(c.nome),        ''),
      'state',        NULLIF(btrim(es.sigla),      ''),
      'postalCode',   NULLIF(btrim(en.cep),        ''),
      'country',      'BR'
    ))::text AS addr_json
  FROM tb_empresa_docs d
  JOIN tb_empresa    e  ON e.id  = d.empresa_id AND e.deleted_at IS NULL
  JOIN tb_endereco   en ON en.id = e.endereco_id
  JOIN aux_tb_cidades c ON c.id  = en.cidade_id
  JOIN aux_tb_estados es ON es.id = c.estado_id
  WHERE d.nome_doc = 'CNPJ'
    AND char_length(regexp_replace(d.nr_doc,'\D','','g')) = 14
    AND NULLIF(btrim(es.sigla),'') IS NOT NULL
    AND NULLIF(btrim(c.nome),'')   IS NOT NULL
  ORDER BY regexp_replace(d.nr_doc,'\D','','g'), e.updated_at DESC
)
SELECT
  '-- ===== UPDATE de endereços GC gerado do SysHalal (' || count(*) || ' empresas BR) =====' || E'\n' ||
  'BEGIN;' || E'\n' ||
  'CREATE TEMP TABLE _sysh_addr(cnpj text PRIMARY KEY, addr jsonb) ON COMMIT DROP;' || E'\n' ||
  'INSERT INTO _sysh_addr(cnpj, addr) VALUES' || E'\n' ||
  string_agg(format('  (%L, %L::jsonb)', cnpj, addr_json), E',\n') || ';' || E'\n\n' ||
  '-- (1) PREVIEW: quantas empresas GC casam por CNPJ' || E'\n' ||
  'SELECT count(*) AS empresas_que_casam' || E'\n' ||
  'FROM companies c JOIN _sysh_addr s ON regexp_replace(c.tax_id,''\D'','''',''g'')=s.cnpj' || E'\n' ||
  'WHERE c.country=''BR'';' || E'\n\n' ||
  '-- (2) PREVIEW: diff de cidade/UF (só onde muda)' || E'\n' ||
  'SELECT c.legal_name,' || E'\n' ||
  '       c.address->>''city''  AS city_atual,  s.addr->>''city''  AS city_novo,' || E'\n' ||
  '       c.address->>''state'' AS uf_atual,    s.addr->>''state'' AS uf_novo' || E'\n' ||
  'FROM companies c JOIN _sysh_addr s ON regexp_replace(c.tax_id,''\D'','''',''g'')=s.cnpj' || E'\n' ||
  'WHERE c.country=''BR''' || E'\n' ||
  '  AND (c.address->>''state'' IS DISTINCT FROM s.addr->>''state''' || E'\n' ||
  '    OR c.address->>''city''  IS DISTINCT FROM s.addr->>''city'')' || E'\n' ||
  'ORDER BY 1 LIMIT 100;' || E'\n\n' ||
  '-- (3) APLICAR (SysHalal vence nas chaves fornecidas; preserva o resto)' || E'\n' ||
  'UPDATE companies c' || E'\n' ||
  'SET address = COALESCE(c.address::jsonb,''{}''::jsonb) || s.addr, updated_at = now()' || E'\n' ||
  'FROM _sysh_addr s' || E'\n' ||
  'WHERE c.country=''BR'' AND regexp_replace(c.tax_id,''\D'','''',''g'')=s.cnpj;' || E'\n\n' ||
  '-- Revise (1) e (2). Se OK:  COMMIT;   senão:  ROLLBACK;' AS gc_script
FROM fonte;
```

