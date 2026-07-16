# HANDOFF — Normalização de cadastros GC (sessão 2026-07-12)

> Continuação de `HANDOFF-NORMALIZACAO-2026-07-10.md` e `NORMALIZACAO-CADASTROS-PLANO-MESTRE-2026-07-10.md`.
> **Tudo abaixo foi EXECUTADO EM PRODUÇÃO no GC (`db_ecohalal_halalsphere`, Aurora) e verificado com query fresca.**
> Acesso direto: `scratchpad/dbq.py` (pg8000) + `db-conn.json`. ⚠️ **Rotacionar a senha do GC** (compartilhada em sessões anteriores, em arquivo temp).

---

## 0. Resumo executivo

Sessão fechou a **normalização do cadastro do GC** (empresa / planta / certificado / produto / MP / marca)
para o go-live FAMBRAS de agosto. Todas as escritas foram **preview→commit→verificação**, com evidência
(FM 7.8.x, SIGSIF, Receita/BrasilAPI, dígito verificador do CNPJ). O que era irreversível/ambíguo foi
**flagado**, não adivinhado.

---

## 1. Executado (em prod)

### 1.1 Re-sourcing de produto (escopo dos certs)
- Causa-raiz dos produtos com **nome numérico**: o "Complete escope" do FM é heterogêneo (3 famílias) e o
  seed antigo pegava o **Nº** como nome. Parser novo `scratchpad/parse_escope.py` (famílias **A** tab-numerada,
  **B** texto livre/lista, **C** numerada-sem-tab; trata packing≠código, CAS, genérico-vazio→comercial,
  linhas de continuação, filtro de barcode).
- **Decisões:** name = genérico (fallback comercial); slot-código: embalagem→`packing_size`, resto→`code`;
  Família B = separar N produtos; certification↔scope é **1:1** → união dedup por scope.
- `gen_resourcing_sql.py` → DELETE+INSERT dos **1.010 scopes mirror** (0 FK dependente).
- **Resultado: 14.817 → 16.524 produtos, nome numérico 358 → 0.** Excel de auditoria:
  `scratchpad/resourcing-produtos-FM78x-VALIDACAO.xlsx`.

### 1.2 Seed dos 118 certs ausentes
- O seed mirror **original** rodou nos FM de **abril** e **não cria produto**; 118 linhas do FM-junho
  (113 cert-numbers distintos; ~85% internacionais COL/PAR/ARG/PER/ECU/URU) não estavam no GC.
- Match: BR por CNPJ, estrangeira por documento-do-país (CUIT/RUC/NIT)+nome (**JBS CNPJ truncado só casou
  por nome**). ⚠️ **GC NÃO tem unique constraint em companies/plants** (só PK) → usar `WHERE NOT EXISTS`.
  `group_id` NOT NULL → 1 grupo "GRUPO \<nome\>" por empresa (CAIXA ALTA).
- `gen_seed_118.py`: **7 grupos + 7 companies novas** (Azul Natural Beef, Black Bamboo, Romex/PE, Avicar/PY,
  PRONACA, San Isidro/EC, LP Trade) + **10 plantas** (país-aware) + **113 certifications/scopes/certificates
  (mirror)** + ~250 category-links + **1.617 scope_products** + history. 105 certs anexados a planta existente.
- **Total mirror 1.253 → 1.366.**

### 1.3 Dedup das 11 "plantas ambíguas" do seed
- **NÃO era merge errado** — os pares partilham RUC/NIT = 1 contribuinte com N estabelecimentos (padrão PY/CO):
  San Antonio=Belén (RUC 800282116), Frigomerc=Lombardo (RUC 800197089), Del Sinu=Red Carnica (NIT 9003193720).
- Fix: re-apontar cert pro estabelecimento certo (FSA→IVO3, FLB→IVO8) + criar planta 503BD (INVIMA) sob
  Red Carnica (FGS). **Lição:** RUC/NIT igual = mesma empresa; nunca criar empresa duplicada.

### 1.4 N5 — MP homologada (catálogo canônico)
- Schema **refatorado** desde 02/jul: `raw_material_masters` (catálogo canônico) + `company_raw_materials`
  (`raw_material_master_id` + `awaiting_matching`); **sem auto-matcher**. Master era **vazio**, 504 MP awaiting.
- Canonicalizei **504 → 352 masters** (strip nº-prefixo `03 `, acento, bilíngue PT/EN; dedup 67, singleton 285)
  e casei as 504 (`awaiting_matching=false`). `gen_n5_masters.py`.
- **Proveniência:** masters `approval_status='approved'` + `approved_by_id=NULL` (=seed histórico de docs
  FAMBRAS validadas). **Flag "validado FAMBRAS in-system" = `approved_by_id IS NOT NULL`** (o `approve(id,userId)`
  carimba o usuário). Decisão do Renato: fonte já validada → `approved`.

### 1.5 Marca → `scope_brands`
- Tabela já tinha **2.144** do seed 01/jul (todos `ownership='own'`, sem curadoria). Parse extrai 6.356 mas com
  RUÍDO (4º campo FM = comercial×marca ambíguo; ADM=21 nomes-de-produto × Forno de Minas=6 marcas reais).
- **Decisão (opção c):** NÃO rebuild total; só apagar **12 numéricas** + popular **109 dos 113 scopes do seed**
  (frigorífico BRANDS: limpos, +530). Total **2.662, 0 numéricas**.

### 1.6 Fix do import de produtos (frontend) — **DEPLOYADO**
- `BulkImportProductsDialog.tsx` (`parseAoa`/`parseCsv`): assumia ordem posicional sem cabeçalho → gravava a
  coluna "Nº" como nome (mesma raiz do escopo). Agora: **exige cabeçalho do modelo**, rejeita nome numérico,
  **cap de 500** produtos, + fix de lint (BOM literal). lint+tsc verdes.
- Commit `3c620550` na `release`, **merge fast-forward + push release → CI/CD disparado**; reconciliado
  `release → develop` (drift de 30 commits zerada, merge `2a53b7ad`).

### 1.7 Expurgo dos 49 certs manuais de teste
- `issuance_mode='manual'` (teste FAMBRAS ≥06/07). Confirmado: 11 tabelas RESTRICT = 0, sem overlap com mirror.
- **DB:** DELETE certificates → certifications (cascade 2.477 produtos / 56 cic / 49 history). **S3:** 98 objetos
  (49 PDF + 49 QR) apagados no `repo-production-halalsphere-docs`. **Mirror 1.366 intacto.**

### 1.8 Normalização §7.5
- `uf_ruim` (BR) **19 → 0** (nome-por-extenso → sigla).
- Plantas `NAO_APLICAVEL` numéricas **24 → 3**: 20 → SIF (confirmadas CNPJ+SIF no SIGSIF), 1 PY → ESTABLECIMIENTO_PY.
- CNPJ inválido (BR) **13 → 0**: 2 Chile → CL/RUT, 1 → CPF (pessoa física), **9 truncados reconstruídos por
  dígito verificador + confirmação na Receita/BrasilAPI** (nome bate).
- Estrangeiras sem endereço **84 → 16** (59 via cert→endereço FM + 9 por nome/tax nas abas inativas do FM).
- **26 certs do seed sem categoria GSO → 53 categorias** (bug: `parse_cats` não quebrava em ESPAÇO — `C4 K`).

### 1.9 Dedups de empresa (deletados os dups vazios — planta sem código, 0 certs/MP, com o real existindo)
- **Vale Grande** (`0608874100829`; keeper `06088741000829` c/ SIF 2937 + 4 filiais legítimas intactas).
- **JBS Pedra Preta** (`06945520000153`; real = JBS `02916265038647` SIF 1922).
- **Red Carnica** ×2 (`80012003522`, `9009193720`; keeper `9003193720` c/ 5 certs / 3 plantas).

---

## 2. Métricas (início da sessão → agora)

| Métrica | Antes | Agora |
|---|---|---|
| Produtos com nome numérico (mirror) | 358 | **0** |
| scope_products (mirror) | 14.817 | 16.524 |
| Mirror certs | 1.253 | **1.366** |
| `uf_ruim` (BR) | 19 | **0** |
| CNPJ inválido (BR) | 13 | **0** |
| Plantas NAO_APLICAVEL numéricas | 24 | **3** |
| Estrangeiras sem endereço | 84 | **16** |
| raw_material_masters | 0 | **352** |
| company_raw_materials awaiting | 504 | **0** |
| scope_brands numéricas | 12 | **0** |
| Certs manuais de teste (DB+S3) | 49 | **0** |

---

## 3. Flagado — precisa decisão/fonte externa (NÃO adivinhar)

- **Dedup Hexus** — Vidara (`72923113001818`, plant 407 NAO_APLICAVEL, 0 certs) × Hexus (`04908706000107`,
  plant 407 SIF, 1 cert) = **CNPJs diferentes** (possível fabricante×distribuidor). FAMBRAS confirmar.
- **Starmilk / Econata** — plantas NAO_APLICAVEL numéricas fora do SIGSIF (prováveis SIE/SISBI).
- **16 estrangeiras sem endereço** — não estão em nenhuma aba do FM (pré-cadastro/SysHalal, sem cert ativo);
  só por fonte externa.
- **MP:** lotes **N5b (OUTROS)**, **N5c (arquivo GRUPO JBS consolidado)**, **INTERMEDIÁRIAS** — das 28 planilhas
  FAM-0017, só Rolândia + N5 carregados; **322 códigos sintéticos `N5-*`**; **criticidade halal**
  (`critical_raw_material_id`); **FAMBRAS aprovar itens** (senão `approvedOnly=true` devolve vazio).
- **Badge UI** da flag "validado FAMBRAS" (`approved_by_id IS NOT NULL`) — se quiser visível.
- **ScopeBrand rebuild total (opção b)** — só se aceitar o ruído do 4º campo. **`_ScopeProductBrands`** (marca
  por produto, M:N) segue vazio.

---

## 4. ⚠️ Cross-system — RISCO criado hoje + integrações

### 4.1 SIH — cadastro de planta: LEVANTADO E CORRIGIDO (12/jul)

**Arquitetura real (confirmada cruzando os 2 bancos):** o GC é master da **certificação**, mas o **SIH tem cadastro
PRÓPRIO de planta** (`model Plant`) — toda a operação (abate/produção/embarque/NC/supervisor/inventário) pendura nele.
**SIH não tem model Company** (empresa é inline na planta). A integração é **read-through de UMA via** (SIH lê GC);
**não há sync** GC→SIH (planejado no TASK-07 do schema, não feito). **Chave de junção = `SIF + CNPJ`.**

**✅ Minhas mudanças de hoje no GC NÃO quebraram nada** — as plantas que casavam continuaram casando.

**Cruzamento: 39 plantas SIH → 31 casavam. Corrigido para 34** (`db_ecohalal_sih`, prod):
- BRF Nova Mutum **+CNPJ** `01838723049487` · Minerva Jose Bonifacio **+CNPJ** `67620377000386` ·
  Curtume Jangadas **+SIF** `3471` — valores tirados do **GC master** (não da Receita).
- Minerva Casing: removido **SIF 451 ERRADO** (451 é da Minerva principal `…0386`; a Casing `…5930` é NAO_APLICAVEL no GC).
- Ecotrace Teste: **desativada** (`isActive=false`) — tinha 1 registro, **não deletei**.

**⚠️ GAP ESTRUTURAL (principal achado):** o match é por `SIF+CNPJ`, mas **planta SEM SIF não casa por definição**.
Químico/casing (Kin Master, Minerva Casing) são `NAO_APLICAVEL` sem SIF no GC — modelagem **correta**; o read-through
é que assume SIF. **Fix = fallback CNPJ-only no `/integration`** (código `halalsphere-backend`), **não é dado**.

**Restam 5 (nenhum é sujeira de dado):** 3 **estruturais** (Kin Master ×2, Minerva Casing) · **Padoca Maricota**
(não existe no GC → cadastrar) · **Kin Master Passo Fundo** (dup **com operação**: 1 relatório + 1 origem-MP →
precisa **merge** pro registro bom `da41a004` SIF 2233/CNPJ `…0296`, que também não está no GC — **não deletar**).

Também em aberto: **espelho GC→SIH** F4 (enforcement) = decisão PO.
**Conexão SIH:** `scratchpad/db-conn-sih.json` + `dbq_sih.py` (mesmo cluster Aurora, database `db_ecohalal_sih`).

### 4.2 SysHalal (SYS) — integração `/integration` para o SIH
- SysHalal External API `/integration/*` (x-api-key, sem filtro de grupo): **F1 pushada**
  (`syshalal-external-api`, branch `feat/integration-sih` `25c96a6`). Repo real = `Ecohalal/syshalal-external-api`;
  envs de prod no **SSM `syshalal-external-api-<env>.json`** (não task def).
- **F2 (SIH modo dual) commitada LOCAL, NÃO pushada** (`sih-backend 439d4ea` em release).
- **Aberto:** credencial interna do PDF (`SERVICE_PDF_USER_*` no SSM — manter `api_sih` ativo?) + 5 decisões na
  spec `sih-docs/PLANNING/SYSHALAL-INTEGRATION-ENDPOINT-SIH-SPEC-2026-07-06.md`.

---

## 5. Ferramentas / acesso (scratchpad da sessão)

`parse_escope.py` · `gen_resourcing_sql.py` · `gen_seed_118.py` · `gen_n5_masters.py` · `dbq.py` (pg8000) ·
`db-conn.json` (GC Aurora, **SSL=false**) · SIGSIF em `<sessão 81555bea>/scratchpad/sigsif_estabelecimentos.csv`.
FM fonte-da-verdade em `C:\HalalSphere\FM78x_atualizados\` (7.8.1 industrial .xlsx / 7.8.2 frigorífico .xlsb, 25/06).

⚠️ **Conexões DBeaver:** `postgres` = GC · `HALAL PROD` = SysHalal · `db_ecohalal_sih` = SIH (fácil confundir).
⚠️ **Rotacionar a senha do GC.**

---

## 6. Próximos passos recomendados

1. ✅ **GC↔SIH levantado e corrigido** (§4.1) — 34/39 casando; sem quebra causada pela normalização.
2. **⭐ Fallback CNPJ-only no `/integration`** (§4.1) — destrava as 3 plantas sem SIF (químico/casing). **Código**,
   `halalsphere-backend`. É o maior ganho pendente da integração.
3. **Cadastrar no GC:** Padoca Maricota + Kin Master Passo Fundo (`…0296`).
4. **Merge** Kin Master Passo Fundo dup no SIH (tem operação — migrar 1 relatório + 1 origem-MP, não deletar).
5. **Fechar SysHalal F2** (§4.2) — push + resolver credencial PDF.
6. **Cauda do GC:** dedup Hexus, Starmilk/Econata, 16 estrangeiras, lotes N5b/N5c/INTERMEDIÁRIAS — quando a
   FAMBRAS entrar no loop de revisão.
