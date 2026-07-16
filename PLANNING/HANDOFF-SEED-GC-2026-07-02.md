# HANDOFF — Seed GC — 2026-07-02 (LIMPO, supera o de 30/jun)

> ⚠️ **HISTÓRICO — NÃO É FONTE DA VERDADE.** Este handoff descreve o momento em que foi escrito e **pode estar defasado** (vários afirmavam "feito/commitado" para código que o git desmentia). Para o estado atual, leia **`sih-docs/PLANNING/BACKLOG-ECOHALAL.md`**. Use este arquivo só para entender *por que* uma decisão foi tomada.

> **⚠️ ATUALIZADO 2026-07-06:** o N5 (seção 3) **FOI EXECUTADO E VALIDADO em 02/jul** —
> 504 MPs / 869 itens `approved` em 26 plantas, spot-check no SIH ok (Rolândia 19/19).
> Ver memória `project_seed_n5_mp_decisoes_2026-07-02` + `BACKLOG-ECOHALAL.md` (sih-docs),
> que passam a ser a fonte viva. As seções 6 e 7 também foram executadas (marcações abaixo).
> Deste handoff, segue vivo apenas: seção 5 (pendências FAMBRAS).

> **Como usar este handoff:** ~~o **PRÓXIMO PASSO** é N5 (seção 3)~~. NÃO reabra o que está em "DONE"
> (seção 1) — já está em prod e VALIDADO. NÃO re-litigue as "DECISÕES TRAVADAS" (seção 4).
> Não invente validação: as validações do Renato já foram feitas (seção 1).

Tooling: **`halalsphere-backend/scripts/etl-fam0017/`**. DDL=migration; dados=SQL que **o Renato roda no DBeaver** (eu nunca rodo em prod). Trabalho em `release` (push→CI/CD), depois alinho `staging`.

---

## 1. DONE — em PROD e VALIDADO (não reabrir)

Cadastro do GC reconstruído das planilhas FM 7.8.x (25/06), casando por **CNPJ+SIF**. Tudo `qa_reviewed=false`.

- **Grupos econômicos**: 550 (merge por nome 579→547 + merge econômico 4: Seara/FrigSeara→JBS, Fortunceres→Minerva, Pampeano→Marfrig). Contagens: JBS 67 / Minerva 22 / Marfrig 15.
- **Plantas**: 813 (N1 enrichment 619 + N1b-create BR 25 + N1c 23 faltando + 11 SIFs federais preenchidos). fix_frigomarca executado.
- **Certifications**: **1010** (1 por nº-base×planta). **Certificates**: **1253** (mirror, `issuance_mode='mirror'`, nº-completo). **MarketScopes**: **4954** (país×norma).
- **ScopeProduct**: **14.817** + **ScopeBrand**: **2.144** (N4, free-text, productId=null). `load_n4_scope_products.sql` é REFRESH (re-rodável).
- **Endereços de empresa**: 291 sobrescritos do SysHalal (autoritativo, estruturado) + ~52 parseados (fallback string) + 16 sem-fonte→QA. `ainda_virgula=0`.
- **market_variant** dos certificados: corrigido (derivado das normas) → selos certos na /verify. Dist.: GAC_ENAS 435 / BPJPH 371 / STANDARD 235 / MUIS 60 / UAE 58 / OIC_SMIIC 42 / GCC 36 / MS 16.
- **Verificação pública OK**: `cert.fambrashalal.com.br/verify/{nº-completo}` mostra empresa+planta+produtos+marcas+selos+validade. Ex.: `MIN.JOB.2405.4382.1.BRA`.
- **Frontend deployado** (`release`+`staging` alinhados): crash lista plantas (null sanitaryCode) `c636a684`; verify URL+rodapé FAMBRAS+tooltip `f86fe58e`; logo FAMBRAS no cert `bc8763a5`; sweep marca "HalalSphere"→"Gestão de Certificações" `fc44e675`.
- **Validações do Renato (FEITAS, não repetir)**: endereços=0 vírgula; /verify IFF produtos/marcas ok; contador da empresa 377 (`67620377000386`) mostra certs = contador funciona (via `getByCompany` por plantas).

---

## 2. Números de referência (pra bater sanity)
1010 certifications · 1253 certificates · 4954 market_scopes · 14817 scope_products · 2144 scope_brands · 813 plants · 550 groups.

---

## 3. ✅ EXECUTADO 02/jul: **N5 — MP / homologação de matéria-prima**

> **Status:** `load_n5_mp.sql` rodado em PROD e conferência batida (504/504 MPs, 869/869
> itens 100% `approved`, flip do piloto Rolândia incluso). 26 plantas (HOLD: Kinmaster +
> Montenegro). Tooling commitado em release (`6b8d779c`+`37bfe38a`). SIH validado
> (/gc-raw-materials Rolândia 19/19). Detalhes: memória `project_seed_n5_mp_decisoes_2026-07-02`
> e `scripts/etl-fam0017/README.md`. O texto abaixo é histórico (como era o plano).

**Objetivo:** popular a matéria-prima homologada (MP) por certificação/planta — quem fornece o quê, homologado por qual certificadora halal. Antes travava por cadastro incompleto; **agora destrava** (cadastro+cert prontos, chave CNPJ+SIF funcionando).

**Por onde começar (nesta ordem):**
1. **Ler o padrão PROVADO**: `halalsphere-backend/prisma/import-rolandia-fam0017-2026-06-28.sql` — ele JÁ fez MP p/ 1 planta (Rolândia/Seara): cria `halal_certifying_bodies`, `manufacturers` (approval_status=approved), `raw_material_supplier_entities`, e liga na empresa. **N5 = generalizar esse padrão pra todas as plantas.**
2. **Tooling MP existente** (etl-fam0017): `parse_spreadsheets.py` + `normalize.py` + **`mp_rows.json`** (745KB, já parseado dos 28 arquivos FM 7.4.2.7 em `sih-docs/Reuniões/MP E ESCOPO/`). `review_manufacturers.csv`/`review_suppliers.csv`/`review_cert_bodies.csv` = catálogos de revisão.
3. **Schema (Prisma)** — modelos-alvo: `SupplierHomologation`, `ScopeSupplier`, `RawMaterialSupplierEntity`, `Manufacturer`, `HalalCertifyingBody` (+ `CriticalRawMaterial`?). **Ler o schema desses modelos ANTES** (campos NOT NULL, enums). Ver memória [[project_planilha_mp_fam0017_analisada]] (FM 7.4.2.7 REV 9, 9 modelos, spec U7) e [[project_sih_consome_gc_mp_homologada_2026-06-29]] (SIH já lê MP do GC via `/integration/raw-materials/by-plant`).
4. **Chave**: casar MP → planta/certificação por **CNPJ+SIF** (mesma resolução em camadas do N2/N1c: pri1 SIF federal, pri2 CNPJ+SIF, pri3 CNPJ+planta única — ver `gen_n2.py`/`gen_n1c.py`).
5. **Gerar** `load_n5_mp.sql` idempotente (uuid5 + ON CONFLICT), Renato revisa+roda no DBeaver.
6. **Decisões a confirmar com Renato ANTES de gerar** (havia 8 perguntas PO em aberto na análise da planilha — reabrir a lista de [[project_planilha_mp_fam0017_analisada]] e confirmar).

**Cuidado:** N5 é build grande — começar com contexto cheio. NÃO tentar fazer numa janela apertada.

---

## 4. DECISÕES TRAVADAS (não re-litigar)
- **Modelo**: CompanyGroup=grupo econômico · Company=CNPJ da filial · Plant=estabelecimento (SIF estável, nullable). 1 SIF↔1 CNPJ. Ver [[project_arquitetura_halal_ecosistema]].
- **Cert histórico/transferência**: ancora na planta atual por **SIF** (CNPJ do papel pode ser antigo). Correto por design.
- **Endereço**: SysHalal é fonte autoritativa, **sobrescrita total** (decisão Renato).
- **ScopeProduct**: free-text (name+code, productId=null), não linka catálogo mestre.
- **market_variant**: derivado das normas (GCC/GAC_ENAS/BPJPH/…), NÃO o índice numérico.
- **Duplicatas de empresa (tipo 337/377)**: NÃO auto-fundir (detector por nome+cidade fundiria IND+FRIG legítimas) → flag QA FAMBRAS.
- **Estrangeiros (81)**: HOLD (decisão Renato). `n1b_foreign_pending.csv`.
- **Merge/UPDATE de dados**: resolver por chave natural (nome/CNPJ/SIF) contra banco vivo, NUNCA UUID de export defasado. Ver [[feedback_merge_grupos_por_nome_nao_uuid]].
- **Renato sobe back+front local e gerencia `.env.local`** — não subir servidor nem editar env dele. Ver [[feedback_nao_subir_server_nem_mexer_env_local]].

---

## 5. Pendências de TERCEIROS (não bloqueiam o N5)
- **FAMBRAS**: `REVIEW-N2-HISTORICO-FAMBRAS.md` (7 casos: 2 casing JBS4400/Minerva451 + 5 transferências) · `n2b_depara_categorias_FAMBRAS.csv` (14 categorias GSO→catálogo GC; L1/L2=couro talvez CRIAR) · certs vencidos-mas-ativos (ex. Gelita, validade < hoje mas na lista ATIVOS) · QA geral (qa_reviewed=false).
- **N2b (categoria M2M)**: bloqueado até FAMBRAS devolver o de-para. Depois: gerar SQL `CertificationIndustrialCategory` (9 códigos casam direto: C/CI/CII/DI/G/GI/GII/I/K).

## 6. ✅ Decisões pequenas — EXECUTADAS 02/jul (deployadas)
- ~~**Blindagem de chunk** pós-deploy~~ → **FEITO**: auto-reload em `vite:preloadError` +
  buildspec com `s3 sync --delete` + Cache-Control (assets immutable / index no-cache).
  Commit `5ac33a6d` (halalsphere-frontend), deployado 02/jul.
- ~~**E-mails demo do Login**~~ → **REMOVIDOS** (decisão Renato 02/jul), mesmo commit.

## 7. ✅ Depois do N5 — Espelho GC→SIH EXECUTADO 03-05/jul
- **FEITO** (F1 GC `b4337037` + F2 SIH back `0450f78` + F3 UI `f76cc8d`, tudo deployado):
  SIH mostra nome canônico + certs vigentes do GC na tela da planta e no destino da
  transferência. **Falta só validação do Renato na UI** (planta Rolândia). Detalhes:
  memória `project_espelho_gc_sih_cadastro_cert`.
