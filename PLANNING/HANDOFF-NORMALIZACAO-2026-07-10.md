# HANDOFF — Sessão normalização de cadastros GC (2026-07-10)

> ⚠️ **HISTÓRICO — NÃO É FONTE DA VERDADE.** Este handoff descreve o momento em que foi escrito e **pode estar defasado** (vários afirmavam "feito/commitado" para código que o git desmentia). Para o estado atual, leia **`sih-docs/PLANNING/BACKLOG-ECOHALAL.md`**. Use este arquivo só para entender *por que* uma decisão foi tomada.

> Continuação natural: `NORMALIZACAO-CADASTROS-PLANO-MESTRE-2026-07-10.md` (plano-mestre com Anexo A de SQL).
> **Ao retomar: NÃO re-validar o que está como COMMITADO abaixo.**

## 0. Correções de premissa (importante — eu errei durante a sessão)
- **NÃO existe "seed de SysHalal" para certs/produtos.** O seed dos **1.253 certs `mirror` + scope_products veio dos FM 7.8.1 (industrial) e FM 7.8.2 (frigorífico)** — provado pelo formato do escopo (ver §5). O SysHalal foi usado SÓ para **endereço de empresa** (leva 1).
- **FM 7.8.1 = lista de produtos certificados INDUSTRIAL; FM 7.8.2 = FRIGORÍFICO.** São a **fonte da verdade** do cadastro de produto.

## 1. COMMITADO em prod hoje (GC = `db_ecohalal_halalsphere`, Aurora)
- **Empresa — endereços:** leva 1 (SysHalal, chave CNPJ) + leva 2 (Receita/BrasilAPI). **`uf_ruim` 399 → 19.** Merge fino: state sempre da fonte; cidade do GC mantida (acento) se for a mesma, senão fonte vence cidade+UF.
- **Planta — SIGSIF** (dados abertos MAPA, chave SIF, só `sanitary_code_type='SIF'`): endereços 453→214 sem address; **corretivo** das 24 estrangeiras (AR/PY/INVIMA) que colidiram por número; **rebuild `display_name`** = "Razão — Cidade/UF (TIPO código)" com tipo real.
- **Grupo:** todos em **CAIXA ALTA**; **segregação JBS**: GRUPO JBS (47) · GRUPO SEARA (14) · GRUPO JBS AVES (6).
- **Limpeza de quebras de linha** em legal_name/trade_name/plants.name/display_name (36).

## 2. Acesso DIRETO ao banco (montado nesta sessão — grande ganho)
- Runner: `scratchpad/dbq.py` (pg8000 puro-Python). Conexão em `scratchpad/db-conn.json` (**SSL=false**).
- Uso: `python dbq.py arquivo.sql` ou `echo "SELECT..." | python dbq.py`. Roda com `dangerouslyDisableSandbox:true` (rede).
- ⚠️ **RECICLAR A SENHA DO BANCO** — foi compartilhada nesta sessão (Renato faz).
- Conexões: GC = `db-aurora-production-one...rds.amazonaws.com`/`db_ecohalal_halalsphere`. (SysHalal = "HALAL PROD" no DBeaver; não confundir.)

## 3. REGRA CENTRAL: dado real vs teste
- **`issuance_mode='mirror'` (criado 01/07) = dado REAL** (seed FM 7.8.x). **1.253 certs.**
- **`issuance_mode='manual'` (criado ≥06/07) = TESTE FAMBRAS.** **49 certs.** FAMBRAS começou a acessar em 06/07; go-live é agosto → não há cert manual "de produção".
- **Agora: FILTRAR** (`mirror`) em toda análise. **Não deletar ainda.**

## 4. Pacote de EXPURGO dos 49 manuais (pronto, ADIADO)
- **DB:** confirmado limpo — só 49 `certificates` + `certifications`; cascade cobre scopes/produtos/marcas/history/categorias; ZERO audits/proposals/contracts/committee. Deletar `certificates` primeiro (RESTRICT), depois `certifications`. Transação + preview + OK.
- **S3:** 49 pastas `.../v1/` (PDF+QR) no bucket `repo-production-halalsphere-docs`. Lista em `scratchpad/s3-prefixos-manual-certs.txt`. Comando: `aws s3 rm --recursive <prefix>` (precisa credencial AWS). **Apagar PDFs junto** (pedido do Renato).

## 5. ⭐ FONTE DA VERDADE + causa raiz dos produtos ruins
- **Arquivos (25/06/2026):**
  - `C:\HalalSphere\FM78x_atualizados\FM 7.8.1 - CERTIFICATED PRODUCTS INDUSTRIAL_ATIVOS - 25.06.2026.xlsx` (aba "Industrial ativo", 1363 linhas)
  - `C:\HalalSphere\FM78x_atualizados\FM 7.8.2 - ... SLAUGHTERHOUSE - 25.06.2026.xlsb` (formato **.xlsb** → usar `pyxlsb`)
- **Estrutura 7.8.1** (1 linha por certificado): col 0 empresa · 1 CNPJ · 2 SIF · 3 endereço · 4 Cat GSO · 5 Cat SMIIC · 6/7 tipo produto · **8 "Complete escope"** · **9 número do certificado** · 10 emissão · 11 validade.
- **A coluna "Complete escope" é uma célula única** com N produtos, formato por linha: **`Nº \t Nome genérico \t Código \t Nome comercial/marca`** (ex. ADM: `1\tTextured Soy Protein Concentrate\t103204\tACCELFLEX`). Nome genérico às vezes vazio; identidade real = **código + nome comercial**.
- **CAUSA RAIZ:** o seed (e o import de xlsx) pegou o **campo 0 (Nº)** como *nome do produto* → é a origem dos **373 produtos numéricos reais** (NCD 231, ADM 105, ZANCHETTA, Chr Hansen, BREMIL, BRF) e do mesmo bug que a Lina viu (timeout + números) nas emissões manuais de teste.
- **Match GC ↔ FM 7.8.x = por número do certificado** (`certificates.certificate_number` = coluna 9).

## 6. Estado real dos produtos (filtrado `mirror`)
- 15.960 produtos reais · **373 nome-numérico** (6 empresas, maioria COM code) · **7.104 sem code** · 0 whitespace sujo · 0 header vazado.
- Ambos (373 + 7.104) se resolvem re-parseando o "Complete escope" do FM 7.8.x correto.

## 7. PRÓXIMOS PASSOS (ordem sugerida)
1. **Re-sourcing de produto pelo FM 7.8.1/7.8.2** (o grande): parser correto do "Complete escope" (`Nº\tNome\tCódigo\tComercial`), match por número de cert, **corrigir/repor scope_products** dos certs `mirror`. Decidir: `name` = nome genérico ou comercial? (comercial parece a identidade). Preview→COMMIT por lote.
2. **Corrigir o bug do import** `BulkImportProductsDialog.tsx` (`parseAoa`): rejeitar coluna "Nº"/nome numérico, exigir cabeçalho do template, cap de linhas + aviso, e o timeout de emissão com muitos produtos. (Ideal: reproduzir com a planilha real da ACQUION.)
3. **Expurgo dos 49 manuais** (DB+S3) quando decidir.
4. **N5 MP:** popular `raw_material_masters` (vazio) + match das 504 `company_raw_materials` (100% awaiting) — provável fonte é a mesma linha FAM-0017 / planilha FAMBRAS.
5. **Follow-ups menores:** 9 CNPJ inválidos Receita; reenriquecer estrangeiras AR/PY via SysHalal por CUIT/RUC; reclassificar NAO_APLICAVEL que são SIF real; 19 uf_ruim restantes.

## 8. Artefatos no scratchpad
dbq.py · db-conn.json · s3-prefixos-manual-certs.txt · diagnostico-scope-products*.sql · diagnostico-normalizacao*.sql · gen-receita-sql.py · receita-results.psv · (SQL das levas commitadas). Plano-mestre + Anexo A em `PLANNING/NORMALIZACAO-CADASTROS-PLANO-MESTRE-2026-07-10.md`.
