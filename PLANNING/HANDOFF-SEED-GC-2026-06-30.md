# HANDOFF — Seed do cadastro GC (N0–N5) — 2026-06-30

> ⚠️ **HISTÓRICO — NÃO É FONTE DA VERDADE.** Este handoff descreve o momento em que foi escrito e **pode estar defasado** (vários afirmavam "feito/commitado" para código que o git desmentia). Para o estado atual, leia **`sih-docs/PLANNING/BACKLOG-ECOHALAL.md`**. Use este arquivo só para entender *por que* uma decisão foi tomada.

Continuação de `SEED-GC-CADASTRO-CERT-ESCOPO-2026-06-29.md`. Este doc = estado + próximos passos
para retomar sem perder contexto. Tooling e SQLs em **`halalsphere-backend/scripts/etl-fam0017/`**.

## Objetivo
Reconstruir o cadastro do GC (empresas/plantas + certificação + escopo) a partir das planilhas
FAMBRAS, casando por **CNPJ+SIF**, idempotente. SQLs rodam no **DBeaver** (Renato); DDL via migration.

## Modelo CONFIRMADO (memória `project_arquitetura_halal_ecosistema`)
```
CompanyGroup = GRUPO ECONÔMICO (dono; JBS inclui Seara, Minerva inclui Fortunceres, Marfrig inclui Pampeano)
  Company    = pessoa jurídica (CNPJ da filial; CNPJ mora na Company, GC Plant NÃO tem cnpj)
    Plant    = estabelecimento (SIF = Plant.sanitary_code, ESTÁVEL; nullable p/ químicos/casing)
```
- **1 SIF ↔ 1 CNPJ (estrito)** — regra MAPA. Unique GC `(sanitary_code, sanitary_code_type)` está CERTA → **NÃO** adicionar CNPJ / **sem migration**.
- "SIF com 2 CNPJs" na planilha = erro de dado (2º é casing/filial sem SIF → sanitary_code NULL).
- **Venda/transferência**: SIF fica, CNPJ+razão mudam → reatribui `Plant.company_id` à nova Company/grupo; cert segue a Plant (plantId); reemissão sob novo CNPJ = processo de negócio. Sem problema estrutural.
- Ownership econômico (quem é dono de quem) **NÃO é derivável** de nome/CNPJ → precisa **mapa FAMBRAS**.

## Fontes-mestre (as DEFINITIVAS, completas, atuais)
`C:\HalalSphere\FM78x_atualizados\`:
- **FM 7.8.1 INDUSTRIAL_ATIVOS 25.06.2026 (.xlsx)** — aba "Industrial ativo". Cols: razão(1), CNPJ(2), SIF(3), endereço(4), cat GSO(5), cat SMIIC(6), tipo produto(7/8), **escopo completo(9)**, **nº cert(10)**, emissão(11), validade(12), reconhecimento(13), **normas(14)**, plataformas(15), status(16).
- **FM 7.8.2 SLAUGHTERHOUSE 25.06.2026 (.xlsb)** — aba "FRIGORÍFICO ATIVO" (pyxlsb). Ordem DIFERENTE: razão(1), CNPJ(2), SIF(3 float), endereço(4), cat(5/6), tipo(7), **escopo(8)**, **nº cert(9)**, **normas(10)**, plataformas(11), emissão(12 serial), validade(13 serial), reconhecimento(14), status(15). CNPJ estrangeiro = CUIT/RUC.
- Extrator unificado: `extract_all.py` → `establishments_all.csv` (**652 estab**: 440 IND + 212 FRIG; 571 BR + 81 estrangeiros; 302 c/ SIF).
- MP (fase N5): FM 7.4.2.7 em `sih-docs/Reuniões/MP E ESCOPO/` (28 arquivos/1019 linhas; parser `parse_spreadsheets.py`+`normalize.py` prontos).

## ESTADO — o que JÁ RODOU em PROD (GC, DBeaver)
- 🟢 **N0**: migration `20260629140000_plant_friendly_qa_seed` (GC `release@4eb0aeee`, aplicada). `Plant.displayName` + `qaReviewed`/`qaReviewedAt`/`qaReviewedById`/`seedSource`.
- 🟢 **N1 enrichment v2** (`load_n1_enrichment.sql`, 652 estab): **619 casaram** → enriquecidos (display_name "Razão — Cidade/UF (SIF n)" + address city/UF + `seed_source='fm_7_8_25jun'` + `qa_reviewed=false`). COMMIT feito.
- 🟢 **Consolidação de grupos por NOME** (`merge_grupos.sql`): **579→547** grupos (25 clusters: Marfrig×5, JBS×4, Minerva+DawnFarms, Seara×3, Tereos×3…). Reatribui companies/users/shared_suppliers/corporate_documents ao canônico + delete vazios. COMMIT feito.
- 🟢 **N1b-create BR** (`load_n1b_create_br.sql`): **25 criados** (faltantes BR; grupos_a_criar=0 → todos anexaram a grupos existentes; SIF-conflito→NULL). COMMIT feito. `sif_zerado_por_conflito=10` (fan-out; conflitos reais distintos = 4).
- 🟢 **Fix FRIGOMARCA** (`fix_frigomarca.sql`): **EXECUTADO/COMMIT (30/jun)** — removeu empresa duplicata `11610856000103` (planilha usou CNPJ genérico p/ 2 filiais; FAMBRAS confirmou SIF 3505=`...000367`, SIF 4086=`...000600`, já no GC). Cascata apagou as 2 plantas sem SIF. **N1 BR fechado.**
- 🟢 **SIF multi-CNPJ FECHADO (30/jun)**: com o frigomarca rodado, **não há mais nenhum SIF com 2 CNPJs competindo** no GC. `sifs_multi_cnpj.csv` só tinha 451/4400 (casing sem-SIF, já criados com SIF NULL — donos reais `...000386`/`...007768` no GC). Não precisa lista p/ FAMBRAS. Pendência "CNPJ atual dos SIFs em transição" (screenshot sessão) = resolvida.
- 🟢 **Merge ECONÔMICO EXECUTADO/COMMIT (30/jun)**: mapa aprovado FAMBRAS → `cluster_economic.py` → `merge_grupos_economico.sql`. **4 merges**: Grupo Seara + Grupo Frigorifico Seara Alimentos → Grupo JBS; Grupo Fortunceres → Grupo Minerva; Grupo Pampeano → Grupo Marfrig. Total **554→550 grupos**. Contagens pós-merge confirmadas: **JBS 67 / Marfrig 15 / Minerva 22**, filhos deletados. ⚠️ **Lição:** a v1 do SQL usava UUIDs do export `grupos_gc.csv` (10:19) — defasado do banco vivo → UPDATEs no-opuaram (0 linhas). **v2 resolve grupos POR NOME** (`SELECT id FROM company_groups WHERE name=...`) contra o banco vivo, imune a UUID obsoleto. Para merges de grupo futuros: **usar nome, não UUID de export**.

### Conflitos de SIF resolvidos (todos fechados)
- **4400** (JBS Campo Grande `...016597` IND) e **451** (Minerva Casings `...005930`) = casing/sem-SIF → criados com SIF NULL (CORRETO). Donos reais do SIF: `...007768` (4400) e `...000386` (451), já no GC.
- **3505/4086** (FRIGOMARCA) = duplicata → `fix_frigomarca.sql` EXECUTADO.
- **Regra futuro (venda/transferência)**: SIF é estável; reatribui `Plant.company_id` à nova Company/grupo, cert segue `plantId`, audit trail registra. Sem problema estrutural.

## UX FOLLOW-UP (registrado 01/jul, decisão Renato = fazer depois do N2)
⭐ **Visão "Plantas do Grupo" (lista plana)** — hoje o GC só oferece `Grupo → Empresas(N) → entra numa → 1 Planta`. Falta a visão que o mercado usa: **lista plana das N plantas do grupo** (SIF · cidade/UF · tipo abate/produção · **status do cert**). NÃO é erro de modelo (dado certo: 1 filial CNPJ ↔ 1 SIF; Company↔Plant sai 1:1 p/ frigorífico). NÃO colapsar a camada Company (CNPJ jurídico, multi-país, contratos). Correção = **enhancement de frontend read-only**: (1) card "Plantas: N" no detalhe do grupo; (2) aba "Plantas do Grupo" achatando Grupo→Companies→Plants; (3) manter drill-down atual. Fica **muito** mais útil pós-N2 (mostra plantas COM status de cert). Sem re-seed/migration.

## PENDÊNCIAS (dependem da FAMBRAS)
1. ✅ **Mapa de grupos econômicos** — APROVADO pela FAMBRAS (screenshot sessão 30/jun) e GERADO: `merge_grupos_economico.sql` (a rodar no DBeaver). Confirmados: JBS←{Seara, Frigorifico Seara Alimentos}; Minerva←{Fortunceres, Dawn Farms}; Marfrig←{Pampeano}. JBS Aves/Couros já entraram no merge por nome. Estender aqui se a FAMBRAS indicar novos donos.
2. **Estrangeiros (81)** — `n1b_foreign_pending.csv` — país + tipo de doc (SENACSA→PY/RUC, SENASA→AR/CUIT, INVIMA→CO/NIT…). **HOLD** (decisão Renato).
3. Outros "CNPJ genérico p/ várias filiais" (tipo FRIGOMARCA) — QA da FAMBRAS pega pelos flags `qa_reviewed=false`.

## N1c + N2-core — ✅ EXECUTADOS/COMMIT (01/jul)
- 🟢 **N1c** (`load_n1c_missing_plants.sql` + `cleanup_n1c.sql`): criou **23 plantas faltando** (21 empresas 0-planta = açúcar/álcool Raízen×5/Tereos×5/usinas "fluxo curto" sem SIF + 2 traps 2º-estabelecimento FRIGOMARCA 4687/MINERVA 2240) e **preencheu 11 SIFs federais** em plantas `NAO_APLICAVEL` (AB Mauri 2408, Nestlé 468, Garoto 2266…). Total plantas: 813.
  - ⚠️ **Bug pego e corrigido**: `pri3` com `NOT (sif~digit AND ...)` vira `NOT(NULL)`=NULL c/ SIF nulo → super-criou 13 duplicatas (1º run). Fix = `NOT COALESCE(..., false)`. Cleanup removeu as 13. **Lição:** NULL≠'' em 3-valued logic; sempre `COALESCE` em cláusula `NOT(... boolean ...)`.
- 🟢 **N2-core** (`load_n2_certifications.sql`): **1010 Certifications** (nº-base×planta) + **1253 Certificates** (mirror, `issuance_mode='mirror'`, nº-completo) + **4954 MarketScopes** (país×norma) + CertificationScope shell. Resolução de planta **em camadas**: pri1=SIF federal (chave estável → pega cert histórico/transferido) → pri2=CNPJ+SIF exato → pri3=CNPJ+planta única. Cobertura 1010/1010. Estrangeiros excluídos (HOLD).
  - Tooling: `extract_certs.py`→`establishments_certs.csv` (1385 linhas, base = `PREFIXO.LOCAL.AAMM.SEQ` sem sufixo variante/país); `gen_n1c.py`, `gen_n2.py`.
  - Datas .xlsb = serial Excel; 1 data typo clampada (2027-02-29→28).
- ⏭️ **PENDENTE do N2**: (1) **REVIEW histórico/transferência** (cert ancorado por SIF em planta de CNPJ≠papel — FRIGOMARCA, transferências, casing JBS 4400/Minerva 451) → FAMBRAS confere; (2) **N2b categoria M2M** (`n2_categorias_distintas.csv`, 34 códigos — gap: catálogo GC usa SMIIC-romano, fonte tem GSO C1/CV/D1/L1…); (3) **N3/N4/N5** (ScopeProduct estruturado, ScopeBrand, MP/homologação).

## Continuação 01/jul (tarde/noite) — verificação UI + front + N1d endereços
- 🟢 **Validação ponta-a-ponta**: cert do seed verificável em **`cert.fambrashalal.com.br/verify/{numero}`** (mirror resolve por número; qrCodeUrl vazio não impede). Ex.: `MIN.JOB.2405.4382.1.BRA` abre.
- 🟢 **Fixes de frontend DEPLOYADOS** (`halalsphere-frontend` release): (1) `PlantsManager` crash com `sanitaryCode` nulo (`c636a684`); (2) URL de verificação → `cert.fambrashalal.com.br/verify/{n}` + rodapé **Fambras Halal Certificação Ltda / CNPJ 27.637.554/0001-50 / fambrashalal.com.br / Powered by Ecohalal** + tooltip (`title`) no sidebar (`f86fe58e`). Sidebar: alargar quebrou o floating → revertido, ficou só o tooltip.
- ⚠️ **Erro de MIME pós-deploy** (chunk defasado): transitório (aba aberta durante deploy); refresh resolve. Blindagem (auto-reload on chunkload) **oferecida, PENDENTE decisão**.
- 🟢 **REVIEW FAMBRAS gerado**: `REVIEW-N2-HISTORICO-FAMBRAS.md` (13 casos; 7 pra confirmar: 2 casing JBS4400/Minerva451 + 5 transferências reais BWL→JBS, FTC Marfrig→Fortunceres, PTL FRIGOMARCA→Pantanal, BMG→Falcão, HEX).
- 🟢 **N1d endereços via SysHalal** (ideia do Renato — melhor que parse): SysHalal tem endereço estruturado (`tb_endereco`→cidade/UF/CEP). Export read-only `C:\HalalSphere\enderecos_sys.csv` (934 linhas) → `gen_n1d_from_sys.py` → **`load_n1d_addresses_from_sys.sql`** (415 BR dedup por CNPJ). **Sobrescrita TOTAL** do `company.address` (decisão Renato: Sys é fonte da verdade). **A RODAR no DBeaver.** (Fallback string-parse `cleanup_n1d_addresses.sql` descartado.)
- 🔵 **Duplicatas de empresa (337/377 tipo)**: detector razão+cidade é ruim (fundiria IND+FRIG legítimas). **NÃO auto-fundir** → flag QA FAMBRAS.
- ⚠️ **Ao retomar**: contador de certificações da empresa usa `getByCompany` (via plantas) — 337 mostra 0 pq os certs foram pro 377 por SIF; **testar 377 (`67620377000386`)** confirma que o contador funciona.

### 01/jul cont.2 — N1d endereços FECHADO + N2b preparado
- 🟢 **N1d endereços EXECUTADO/COMMIT**: `load_n1d_addresses_from_sys.sql` (291 do SysHalal, autoritativo) + `cleanup_n1d_addresses.sql` (v2: ~52 resíduo suppliers-FM parseado — strip país, UF grudada " SP", whitespace/newline; estrangeiro mantém província). Sobram 16 sem-fonte → QA. `ainda_virgula=0`.
- 🟡 **N2b (categoria) PREPARADO, bloqueado FAMBRAS**: catálogo GC = taxonomia interna (A–K + romanas AI/BI/CI/DI/GI…); dual-standard só criou colunas gso_code/smiic_code (NÃO populou). Fonte usa GSO 2055-1/SMIIC (C1/CV/D1/L1…) = esquema diferente. `gen_n2b_categories.py` → **`n2b_depara_categorias_FAMBRAS.csv`**: 23 códigos (9 casam direto: C/CI/CII/DI/G/GI/GII/I/K; **14 FAMBRAS mapear**: C1/C2/C3/C4/C6/CIV/CV/CVCV/D1/D4/G1/G2/L1/L2 — L1/L2=couro talvez CRIAR categoria). Com o de-para preenchido → gerar SQL M2M `CertificationIndustrialCategory`.

- 🟢 **N4 (ScopeProduct + ScopeBrand) GERADO** — `gen_n4.py` re-extrai escopo CRU (tabs preservados; extract_certs colapsava) → `load_n4_scope_products.sql` (~2MB): **15.640 ScopeProduct** (nome+código free-text, productId=null) + **1.229 ScopeBrand** (ownership='own') sob a CertificationScope do N2 (chave base+cnpj+sif → scope_uuid). 2 formatos: A=tab `idx\tnome\tcodigo\tmarca`; B=lista-vírgula + `Brand:`. Guardado por scope existente, idempotente. **A RODAR DBeaver.** Payoff: `/verify` passa a mostrar produtos+marcas. Parse best-effort (qa refina "X AND Y").

### Ao retomar (ordem)
1. ✅ N1d endereços — feito. ✅ N4 gerado.
2. **Rodar `load_n4_scope_products.sql`** (RELATÓRIO ~15640/1229). Testar 377 (contador). Decidir blindagem de chunk. Levar `n2b_depara_categorias_FAMBRAS.csv` à FAMBRAS.
3. **N2b** (quando FAMBRAS devolver de-para de categoria) → **N5 (MP)** → **espelho GC→SIH**.

## (histórico) PRÓXIMO GRANDE PASSO: N2 (Certification)
Sai dos MESMOS arquivos completos (7.8.1/7.8.2). Decisões a confirmar (recomendações prontas):
- **#4 Nº do certificado**: usar o número FAMBRAS **base** (sem sufixo `.1/.2` de mercado, ex.: `JBS.ADD.2306.5608`) como `Certification.certification_number`; os números completos (`...5608.1.BRA`) vão pro modelo **`Certificate`** (emitido; tem `certificate_number @unique` + `certificateType` + `marketVariant`/`countryVariant`).
- **#5 Categoria (C1/K…)** → `IndustrialCategory` (catálogo tem `gsoCode`/`smiicCode` p/ mapear dual-norma) + `certificationType` (enum C1..C6/produto/processo/servico).
- **#6 `Certification.standard`**: derivar `GSO_2055_2`/`SMIIC_02`/`BOTH` das colunas de categoria GSO/SMIIC (BOTH quando ambas).
- **#7 GCC → países** (MarketScope é por país): expandir `GSO-GCC` p/ SA, AE, KW, QA, BH, OM.
- Mapeamentos N2–N4 (col→modelo) detalhados em `SEED-GC-CADASTRO-CERT-ESCOPO-2026-06-29.md`.
- Granularidade: 1 `Certification` por (plant, nº-base); N `MarketScope` (país×norma, da col normas) + N `ScopeProduct` (col escopo, free-text parser). Datas do .xlsb = serial Excel (converter). Enums confirmados: `CertificationStatus.ativa`, `EligibleStandard{GSO,OIC_SMIIC,BPJPH,MUIS,MS,UAE}`, `MarketScopeStatus.approved`, `ScopeItemStatus.ativo`.

## Convenções (não esquecer)
- GC atrás de API Gateway: rota de TOPO nova → regenerar gateway (não é o caso aqui, só dados/migration).
- DDL = migration idempotente com nome MAPEADO da tabela (`plants`, não `Plant`). Dados = SQL DBeaver.
- Trabalhar em `release` (remote `origin`); push dispara CI/CD; reconciliar `release→develop`.
- Consultar `halalsphere-docs/GUIDES/LICOES-APRENDIDAS.md` antes de mexer no GC.

## Retomar assim
1. Renato roda `fix_frigomarca.sql` (fecha N1 BR).
2. Confirmar #4–#7 → gerar N2 (Certification) SQL a partir de `establishments_all.csv` + parse de escopo/normas dos arquivos completos.
3. Em paralelo: FAMBRAS entrega mapa econômico → `merge_grupos_economico.sql`.
