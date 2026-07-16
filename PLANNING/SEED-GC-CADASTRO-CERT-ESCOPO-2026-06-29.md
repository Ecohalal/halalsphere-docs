# Seed do GC a partir das planilhas FAMBRAS — Cadastro + Certificação + Escopo (+ espelho SIH)

> **Status:** desenho (aguarda decisões de PO antes de gerar SQL).
> **Data:** 2026-06-29. **Autor:** Renato + Claude.
> Arquitetura de referência: memória `project_arquitetura_halal_ecosistema` (GC master,
> SIH espelho/operacional, Sys exportação/fim-de-linha; fluxo curto p/ açúcar).

## Princípio
O **GC é a autoridade de cadastro e certificação**. Reconstruímos o estado do GC a partir
de duas fontes-mestre FAMBRAS, em **camadas idempotentes** (N1→N5), casando tudo por
**CNPJ + SIF**. O SIH **espelha** o resultado (nome amigável + flag de certificação). O
import de MP (objetivo original) é a **última camada**, agora destravada.

## Fontes-mestre
| Fonte | Arquivos | Alimenta |
|---|---|---|
| **FM 7.8.1 / 7.8.2.S** (CERTIFICATED PRODUCTS — ATIVOS) | `fambras-references-2026-04/.../Qualidade/Lista de clientes/` e `.../habilitacao/` | Cadastro + **Certificação** + **MarketScope** + **ScopeProduct** (≈448 estab/445 CNPJ) |
| **FM 7.4.2.7** (PLANILHA MP E FORNECEDORES) | `sih-docs/Reuniões/MP E ESCOPO/` (28 arquivos, 1019 linhas) | **MP/homologação (FAM-0017)** + **ScopeSupplier** |

> Chave universal: **CNPJ** (`companies.tax_id`, só dígitos) + **SIF** (`plants.sanitary_code`).
> CNPJ é a chave robusta (cada estabelecimento = 1 Company com CNPJ próprio; SIF às vezes NULL).

## Convenções de execução
- **DDL → migration** (idempotente). **Dados → SQL pro DBeaver** (Renato roda; eu nunca em PROD).
- Cada camada usa **staging temp table** + **upsert por chave natural** → **re-rodável (no-op na 2ª vez)**.
- Tudo casa por CNPJ(+SIF); linhas que não casam são **relatadas** (não inseridas às cegas).
- Parsers free-text (escopo, normas) já validados no piloto (origem, evidência); reutilizar.

---

## N0 — Pré-requisitos (migration + staging)
1. **Migration GC** (opção C do nome amigável): `Plant.displayName` (`display_name VARCHAR(255) NULL`).
   - Não sobrescreve `name` (razão social); `address.city/state` preenchidos no N1.
2. **Staging**: importar as planilhas parseadas para temp tables (`stg_cert`, `stg_estab`, `stg_mp`).
3. **Snapshot** do estado atual (contagens) antes de qualquer UPDATE/INSERT.

---

## N1 — Cadastro: Company/Plant + cidade + nome amigável + flag "tem cert ativo"
**Entrada:** FM 7.8.x → 1 linha por estabelecimento (`cnpj, sif, razão, cidade/uf`).
**Ação (idempotente, match por CNPJ+SIF):**
- `UPDATE plants` → `address.city/state` + `display_name = "<Razão curta> — <Cidade>/<UF>"`
  (ex.: **"Seara — Rolândia/PR"**, **"JBS — Pedra Preta/MT"**).
- **Estabelecimento na FM 7.8 mas ausente no GC** → relatar; criar Company/Plant **só** se
  decisão-PO permitir (ver Decisão 2). Não-certificados (fornecedores) ficam de fora.
- Marcar/derivar **"tem certificado ativo"** (consequência do N2; no N1 pode ser flag temporária
  por presença na lista ATIVOS).

**Destrava:** cadastro legível; SIH amigável (espelho N+); gate "sem cert → nada no SIH".

---

## N2 — Certification (habilitação)
**Mapa FM 7.8.1 → `certifications`:**
| Coluna | Campo GC |
|---|---|
| Nº do certificado (base, sem sufixo `.1/.2` de mercado) | `certification_number` (@unique) |
| Emissão / Validade | `valid_from` / `valid_until` |
| Status (Ativo) | `status = ativa` |
| Categoria GSO/SMIIC (C1, K, …) | `certification_type` + `industrialCategory` (M:N por código) |
| (planta) | `plant_id` (resolvido no N1) |

- **Granularidade:** 1 `Certification` por **(plant, nº-base)**. Linhas com sufixo `.1/.2` =
  mesma certificação, **mercados diferentes** → viram N3 (MarketScope), não certs separadas.
- **Idempotência:** `ON CONFLICT (certification_number) DO NOTHING` (ou update controlado).
- `certificationType`: C1=alimentos, C2=químicos, C3=cosméticos(K), C4=farma, C5=embalagem.

**Destrava:** habilitação no GC (a base que o Sys consulta no fluxo de exportação).

---

## N3 — MarketScope (país × norma)
**Entrada:** col 14 "Normas acreditadas" (free-text; `;`/newline separados).
**Parser → `(EligibleStandard, Country, status=approved)`:**
| Texto na planilha | EligibleStandard | País/mercado |
|---|---|---|
| `GSO 2055-1/2015 - GCC` | `GSO` | GCC → expandir p/ países do Golfo (Decisão 5) |
| `UAE.S 2055-1/2015 - MOIAT` | `UAE` | AE |
| `MUIS-…- Singapore` | `MUIS` | SG |
| `MS 1500/… - Malaysian` | `MS` | MY |
| `KEPKABAN/BPJPH … Indonesia` | `BPJPH` | ID |
| `DT 7.x - Mercado Interno` | (interno) | BR |

- 1 `MarketScope` por (certification, country, standard); `@@unique` já existe → idempotente.
- Apoio: catálogo `CertificationStandardByMarket` (FM 4.1.X REV 03) para validar/rotular.

**Destrava:** escopo de mercado (quais países/normas o certificado cobre).

---

## N4 — ScopeProduct (+ ScopeBrand parcial)
**Pré:** `CertificationScope` (1:1 com Certification) — criar se não existir.
**Entrada:** col 9 "Complete escope" (free-text; padrão `idx⇥nome⇥[código]⇥[marca]`).
**Parser → `scope_products`:** `name`, `code` (código FAMBRAS, ex.: `40.03.1410`), `status=ativo`.
- **4º token** (ex.: "Leiteria de Minas") → candidato a **`ScopeBrand`** (`ownership` default a decidir — Decisão 6); vincular M:N ao ScopeProduct.
- Linhas só-texto (ex.: "CHICKEN BREADED PRODUCTS") → 1 ScopeProduct sem código.
- Idempotência: por (scope_id, code) quando há código; senão (scope_id, lower(name)).

**Destrava:** escopo de produto (a coluna "Code/Product" do certificado).

---

## N5 — MP/homologação (FAM-0017) + ScopeSupplier
**Entrada:** FM 7.4.2.7 (parser+normalização **já prontos**: 28 arquivos/1019 linhas; origem→enum,
evidência certificate/declaration/none, certificadora canônica).
**Ação (idempotente, todos `approved`):**
- `manufacturers` (dedup por nome, `approved`), `raw_material_supplier_entities` (company+nome),
  `company_raw_materials` (`ON CONFLICT (company_id, internal_code)`),
  `raw_material_suppliers` (**`fambras_review_status='approved'`**, `ON CONFLICT` na tripla),
  `raw_material_halal_certifications` (casa certificadora por nome/alias).
- Resolução de empresa: **CNPJ via cidade** (a FM 7.8.x dá cidade↔CNPJ; o nome do arquivo dá a cidade).
- **ScopeSupplier (opcional):** como as Certifications existem após o N2, dá pra **derivar** o
  escopo de fornecedores por certificação — **a partir do homologado** (ponte `SupplierHomologation`),
  não re-importando a planilha. Mantém fonte única (homologação).

**Destrava:** o objetivo original (MP homologada lida pelo SIH) + escopo de fornecedor coerente.

---

## Espelho GC → SIH
Após o GC enriquecido:
- SIH passa a exibir **`displayName`** (nome amigável) e **flag certificado** das plantas,
  **espelhados do GC** (via a integração já existente `/integration/...` por SIF+CNPJ, ou um
  endpoint/cron de sync de plantas). SIH **não** mantém cadastro próprio — só espelho + operação.
- Regra de gate: planta sem `Certification` ativa no GC → **não** aparece para registro no SIH.

---

## Dependências / ordem
```
N0 (migration displayName + staging)
└─ N1 (cadastro: cidade + displayName + match CNPJ/SIF)
   └─ N2 (Certification: nº/datas/status/categoria)
      ├─ N3 (MarketScope: país×norma)   ┐ paralelos
      └─ N4 (CertificationScope + ScopeProduct/Brand) ┘
         └─ N5 (MP homologação + ScopeSupplier derivado)
            └─ Espelho GC→SIH (displayName + flag cert)
```

---

## Decisões — RESOLVIDAS (2026-06-29)
1. ✅ **Profundidade:** **seed automático completo (N1→N5)**. Recadastro manual seria moroso. Mitigação: **flag de revisão QA** (ver abaixo) para a Qualidade FAMBRAS validar depois.
2. ✅ **Nome amigável:** opção **C** (`Plant.displayName`), formato **`"<Razão> — <Cidade>/<UF> (SIF <n>)"`** — **incluir SIF quando houver** (uso comum em campo).
3. ✅ **Estabelecimentos ausentes:** **criar** Company/Plant a partir da FM 7.8.x. (Não-certificados/fornecedores das planilhas de MP continuam fora.)

### Flag de revisão QA (decisão 1) — design
Todo registro **semeado** nasce **não-revisado**, para a Qualidade FAMBRAS revisar e dar baixa:
- Campos novos (migration): **`qaReviewed Boolean @default(false)`**, `qaReviewedAt`, `qaReviewedById`, e **`seedSource String?`** (ex.: `fm_7_8_1`, `fm_7_4_2_7`).
- Aplicar nas entidades semeadas: **Plant** (enriquecimento), **Certification**, **MarketScope**, **ScopeProduct**, **ScopeBrand**, **CompanyRawMaterial**, **RawMaterialSupplier**.
- Habilita um filtro de UI "**Pendentes de revisão QA**" e marcação em lote (fase 2).

## Decisões — EM ABERTO (necessárias p/ N2+)
4. **Nº do certificado** — usar o número FAMBRAS **base** (sem sufixo `.1/.2` de mercado, ex.: `JBS.ADD.2306.5608`) como `certification_number`? (rec.: sim; o sufixo vira MarketScope.)
5. **Categoria → tipo** — mapear a coluna "Categoria (C1, K, …)" para `certification_type` + `IndustrialCategory` (rec.: C1→alimentos, K→cosméticos…; confirmar códigos do catálogo `IndustrialCategory`).
6. **Certification.standard** — derivar `GSO_2055_2`/`SMIIC_02`/`BOTH` das categorias GSO/SMIIC (rec.: `BOTH` quando ambas presentes).
7. **GCC → países** — `GSO-GCC` vira quais `MarketScope.country`? (rec.: expandir p/ membros do Golfo: SA, AE, KW, QA, BH, OM — confirmar lista.)
8. **ScopeBrand.ownership** default p/ o 4º token (rec.: `own` + `qaReviewed=false`).
9. ⚠️ **Fonte dos FRIGORÍFICOS** — a `FM 7.8.2.S - SITE` é **parcial** (SIF embutido no nome "JBS S/A (SIF 385)", **sem coluna CNPJ/validade/escopo completo**). Precisamos do equivalente **"FRIGORÍFICO ATIVOS"** com as mesmas colunas da 7.8.1, senão frigorífico entra só no N1 (cadastro) e N2+ fica incompleto. **Renato: existe esse arquivo?**
10. **Versão da FM 7.8.x** — usar o export mais recente da Qualidade (o meu é abr/mai-2026).

## Riscos
- **Conflito com recadastro manual** da FAMBRAS (base resetada) — alinhar escopo do seed.
- **Qualidade de free-text** (escopo/normas/datas sujas tipo `02/12//2025`) — parser tolerante + relatório de exceções.
- **Duplicação de catálogos globais** (manufacturers/certifying bodies) — mitigado por upsert por nome/alias.

## Artefatos já prontos (reaproveitar)
- `halalsphere-backend/scripts/etl-fam0017/` — parser+normalização MP (N5) + CSVs de revisão + README.
- Análise FM 7.8.x (cidade↔CNPJ↔SIF) — valida o método (Rolândia bateu com o piloto).
