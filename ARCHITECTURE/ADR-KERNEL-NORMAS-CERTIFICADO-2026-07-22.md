# ADR — Kernel de Normas do Certificado (snapshot-first + matriz effective-dated)

- **Data:** 2026-07-22
- **Status:** Aceita — decisões FAMBRAS fechadas (Soha 22/jul + Elaine); pronta para implementar a Fatia 0
- **Sistema:** GC — Gestão de Certificações (`halalsphere-backend`)
- **Trilha (mestre §2):** A · Emissão / normas / certificado
- **Fontes:** reunião FAMBRAS 20/jul + testes Giovanna/William (seg 20/jul) + WhatsApp Soha 22/jul + inventário de consumidores (varredura GC 22/jul) + stress-test arquitetural.

> Decisão de arquitetura sobre **sistema acreditado (ISO 17065)**. A matriz dirige conteúdo
> legal do certificado tanto quanto o layout congelado — governa-se com o mesmo rigor.

---

## 1. Contexto — o problema

As regras de norma/categoria/DT/mercado/selo/numeração estão espalhadas em **quatro representações** que divergem em silêncio:

1. **DB** — `certification_standards_by_market` (`schema.prisma:2233`; seed `migrations/20260518120000`), a matriz `(dt_code × market) → standards[]` já semeada do **FM 4.1.X REV 03** (a fonte canônica).
2. **TS hardcoded** — `category-display-map.ts` (GSO/SMIIC, PT), `seal-config.ts`, `dt-code-map.ts`, `fambras-market-resolver.ts`.
3. **Fallback duplicado** — o mesmo mapa de normas em **dois lugares literalmente iguais**: `certificate.service.ts:889-906` e `certificate-pdf.service.ts:714-729`.
4. **Override manual** — `Certificate.requirementsOverride` (JSON) que sobrepõe tudo.

**Raiz do bug (achado do stress-test):** o `Certificate` **não persiste as normas resolvidas**. O PDF **re-resolve ao vivo a cada render** (`certificate-pdf.service.ts:685-737` → `extractRequirements` → `lookupStandardsFromCatalog` → catálogo; senão fallback TS). Consequências:

- **Bug do "2055-2":** o rótulo de esquema `GSO 2055-2` vaza do `category-display-map`/subtexto de selo para a **linha de norma do produto**, onde deveria ser `GSO 2055-1/2015` (+ `993` no abate). Confirmado por testes (William W2) e por certificado real.
- **Violação de imutabilidade ISO 17065 já hoje:** reemitir o PDF de um cert antigo, após qualquer ajuste de dado, **imprime norma diferente com o mesmo número**. `Certificate` (`schema:1404-1436`) só guarda `marketVariant/dtCode/categoryDisplay/requirementsOverride` — nenhuma norma resolvida congelada.
- **País fora de ~30/50 mapeados → `[]`** (`fambras-market-resolver.ts:117-155`) → cert acreditado com linha de norma vazia.

---

## 2. Decisões FAMBRAS (travadas com a Soha — 22/jul)

1. **A AUDITORIA governa a versão da norma.** O certificado congela a norma vigente **na auditoria que reconheceu aquele escopo**; atualização de norma é **prospectiva** (vale a partir da próxima auditoria, não retroage). *(Soha: "ano da atualização pode mudar a partir da auditoria do ano seguinte".)*
2. **Mercado no cert ⊆ mercado auditado por auditor ELEGÍVEL.** Um mercado só entra no certificado se a auditoria foi feita por auditor com competência para a norma daquele mercado (ex.: Indonésia tem grupo de auditores dedicado). *(Soha: "temos um grupo específico de auditores para acreditação Indonésia... a auditoria precisa ser realizada com eles".)* — **inativa no modo emissão-manual** (não há auditoria no sistema; é o bridge até o ciclo completo).
3. **Dois eixos de norma que NUNCA se cruzam:**
   - **Norma do produto/planta** (o que a planta cumpre) → **linha de normas**: `GSO 2055-1/2015`, `993`, `UAE.S 2055-1`, etc.
   - **Norma do organismo certificador** (o que acredita a FAMBRAS) → **selo GAC**: `GSO 2055-2:2021`.
   - *(Soha: "foi na linha de normas... as normas de certificação das plantas... e não do sistema de gestão, que somos nós, organismos de certificação".)* Anos divergentes entre os dois (2015 × 2021) são **normais** — cada norma tem ciclo próprio.
4. **UAE.S NÃO é "sem norma acreditada"** — tem norma acreditada própria (imprime selo ENAS). Corrigir a classificação.

## 3. Regra de negócio derivada — elegibilidade de mercado é INTERSEÇÃO

Quais mercados podem coexistir num certificado = cruzamento de filtros independentes:

> **mercado no cert = base ∩ ingrediente ∩ auditor ∩ habilitação**

| Filtro | Regra | Exemplo |
|---|---|---|
| **base** | mercado existe no catálogo para o DT | FM 4.1.X |
| **ingrediente** | ingrediente restrito do produto aceito pela norma do mercado | conchonilha/carmim → **não** GSO/UAE ("Ásia Marrom"); aceita Malásia/Indonésia ("Ásia Amarela") |
| **auditor** | auditoria por auditor elegível para a norma do mercado | Indonésia → grupo dedicado |
| **habilitação** | planta operacionalmente habilitada para o mercado | junção GC↔SIH por SIF+CNPJ |

**Ingrediente restrito = tabela GERAL** (decisão do Renato, 22/jul — não flag conchonilha-only). Enforcement near-term = **flag do operador + aviso** (W11 pediu a trava); long-term = **derivado das MPs homologadas (FAM-0017)**.

---

## 4. Decisão de arquitetura

**Reenquadrar de "grande matriz dimensional" para "snapshot-first + produtor único + tabela plana effective-dated".** As 8 dimensões versionadas foram **rejeitadas** (over-engineering para ~180 linhas reeditadas 2×/ano; empurraria para EAV).

1. **Snapshot-first.** `Certificate` ganha `resolved_scope_snapshot` (JSON): normas, selos, DTs, categoryDisplay resolvidos **congelados na emissão**. Cert já emitido lê **só do snapshot**, nunca re-resolve.
2. **Tabela plana effective-dated (por norma).** Manter `certification_standards_by_market` `(dt × market) → standards[]`; a string já carrega o **ano de edição por norma** (`"GSO 2055-1/2015"`). Effective-dating é **por linha**, não por "REV global". Os discriminadores hoje em `notes` texto-livre (`cochonilha_split`, `linha_dedicada`, `Deixar só a DT`) viram **colunas tipadas**.
3. **Produtor único da linha de norma = a matriz.** Deletar os **dois fallbacks duplicados** (`certificate.service.ts:889-906` + `certificate-pdf.service.ts:714-729`) e cortar o vazamento do `category-display-map` na linha de norma.
4. **NÃO fundir bounded contexts no kernel.** Numeração (`fambras-numbering.service` + `certificate.service.ts:915-934/1008-1074`), dias de auditoria (`AuditDaysTable`), competência de auditor (`AuditorCompetency`/`classifica-auditor.config`), regras Golfo (`GulfRestrictionConfig`) — **permanecem separados**. O kernel = resolução de **norma/selo/categoria** só. A regra "mercado ⊆ auditado" liga kernel↔competência **por validação, não por fusão**.
5. **Categoria é composição hierárquica**, não `código → label`: `CATEGORY <grupo> – <nome>/ SUBCATEGORY <cód> – <nome>`, no idioma-alvo (EN), a partir de `IndustrialGroup`/`IndustrialCategory`/`IndustrialSubcategory`.
6. **País com totalidade.** Unificar os 3-4 catálogos fragmentados (`enum Country` + `CountryConfig` DB + `COUNTRY_CONFIGS`/`SPECIFIC_COUNTRY_MARKETS`/`DEMAIS_*` TS + `@IsIn` do DTO) e garantir que **todo destino resolva** ("Demais da região" explícito, sem `[]` silencioso).

### 5 condições de segurança (inegociáveis)
1. **Snapshot no `Certificate` antes de tudo** — satisfaz imutabilidade ISO e mata o bug, independente da matriz.
2. **Produtor único** da linha de norma; deletar fallback/vazamento; `notes` → colunas tipadas.
3. **Não fundir** numeração/audit-days/competência no kernel versionado.
4. **Provenance:** cada versão de linha com `approved_by` + `source_doc_ref` (ex.: `FM_4_1_X_REV_03`) + `effective_from`; cada `Certification` pina a versão da matriz no gate (auditoria).
5. **Validação na escrita** — norma/selo/DT com enum/FK/check, não texto livre.

---

## 5. Sequência de fatias (ancorada em arquivo:linha)

- **Fatia 0** *(dias, zero tabela nova, altíssimo valor)* — `resolved_scope_snapshot` no `Certificate` (`schema:1404-1436`); PDF de cert emitido lê só dele (deixa de re-resolver em `certificate-pdf.service.ts:685-737`). Backfill dos certs gerados na janela "prod = homologação / reset antes do go-live". **Cert mirror (`CertificatePdfUpload`) fica de fora — já é arquivo.**
- **Fatia 1** — matriz vira **produtor único** da linha de norma; deletar os 2 fallbacks duplicados; `notes` → colunas tipadas; unificar catálogo de país (totalidade); corrigir a composição categoria+subcategoria em EN (G1/W17); classificação UAE.S (W1); guard-rail de normas conflitantes (W11).
- **Fatia 2** — effective-dating + provenance (`approved_by`/`source_doc_ref`/`effective_from`) + pin da versão da matriz na `Certification` no gate da auditoria; tabela de **ingrediente restrito × mercado** + flag do operador.

---

## 6. Consolidação de fontes (do inventário) — o que absorver/deletar

**Já em DB (fonte primária):** `certification_standards_by_market`, `MarketScope`, `CountryHabilitation`, `IndustrialGroup/Category/Subcategory`, `AuditDaysTable`, `GulfRestrictionConfig`, `AuditorCompetency`, `CitySigla`.

**Hardcoded TS a absorver/eliminar:** `category-display-map.ts` (→ categoria via DB, EN), `dt-code-map.ts` (categoria→DT contextual), `fambras-market-resolver.ts` (país→mercado; frágil, `[]` no fallback), os **dois mapas de norma duplicados** (`certificate.service.ts:889-906` = `certificate-pdf.service.ts:714-729`), `normGroupKIndex`/`deriveTemplate/Standard`, `country-config.ts` (5 países, sobrepõe `CountryConfig`).

**Possível órfão a investigar:** `CertificateTemplate` (`schema:3041`) — o PDF usa o TS `MARKET_VARIANT_CONFIGS`, não a tabela.

---

## 7. Questões abertas (não decidir sozinho)

1. ✅ **RESOLVIDO (Elaine, reunião anterior): selo por grupo-de-norma, nacionais SEM selo.** Cert de Indonésia (e nacionais) não leva selo — nem o nacional, nem GAC/ENAS (acreditação do Golfo). Confirma o §5.2 e resolve W12/W13. Modelo: **selo por grupo** — GSO/Golfo→GAC(+ENAS p/ UAE) · OIC/SMIIC→HAK · **nacionais→conjunto vazio**. Não contradiz §5.2; refina o enforcement (hoje o código põe GAC/ENAS em tudo — `seal-config.ts` allowlist global).
2. **Agrupamento de aves.** Cert real de aves traz `UAE.S` + `GSO` juntos no `.1.`, mas o TXT de aves diz `.1.` UAE.S e `.2.` GSO **separados**. Verificar com o André se o de-referência é antigo ou se a regra prática difere.
3. **Ingrediente restrito além da conchonilha** — Soha ainda não confirmou se há outros; modelamos geral por decisão, mas a **carga** de linhas aguarda a lista FAMBRAS.
4. **Textos oficiais EN por categoria** — só "K" confirmado; bloqueia o EN automático de todas as categorias (G1/W17).

---

## 8. Consequências

- **Positivas:** o bug do 2055 e a violação ISO caem já na Fatia 0 (independente da matriz). Revisões futuras do FM 4.1.X viram **carga de dado (DBeaver)**, não deploy. Fonte única elimina a classe de bug "3 grafias de 2055". Effective-dating simples (por norma).
- **Custos/risco:** Fatia 0 exige backfill dos certs gerados (mitigado pela janela homologação). Fatias 1-2 tocam os renderers (layout congelado — alto cuidado, regressão obrigatória). Não resolve sozinho o **algoritmo de split** nem o **render** — esses continuam código (bounded contexts).
- **Reversibilidade:** Fatia 0 é aditiva (coluna nova) e reversível. Fatias 1-2 deletam fallback — reversível por revert enquanto a matriz não for a única fonte.

---

## 9. Backlog de emissão (bugs dos testers)

Categorizado e priorizado no **mestre `BACKLOG-ECOHALAL.md` §4.2 (Trilha A)** — reunião 20/jul (A1-9) + Giovanna (G1-5) + William (W1-17). Este ADR trata a **arquitetura**; os bugs de render/layout/split são fixes de emissão que correm em paralelo (vários não dependem do kernel).
