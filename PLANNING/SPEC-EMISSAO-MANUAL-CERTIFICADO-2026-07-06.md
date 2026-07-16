# SPEC — Revisão da Emissão/Criação Manual de Certificado (GC)

> **Data:** 2026-07-06 · **Origem:** reunião de validação FAMBRAS (Renato, Elaine, Lina, André, Fuad)
> observando a tela de criação de certificado do zero + impressão de certificados de teste.
> **Escopo:** tela de criação/emissão manual de certificado e o pipeline de geração de PDF do GC.
> **Fora de escopo:** SysHalal (embarque/exportação), SIH. Integrações com esses são travas futuras (§I).

---

## 0. Contexto e problema central

Na reunião, ao **imprimir vários certificados**, **todos saíram no mesmo layout** (o FM 7.7.2,
"mal renderizado") e com **normas conflitantes misturadas** num único certificado. Isso é sintoma
de duas falhas somadas:

1. **Detecção de formulário (7.7.1 × 7.7.2) não confiável após o import.** O `detectFormCode`
   (`certificate-pdf.service.ts`) exige categoria ∈ {CV, CI, CIII, K} **e** planta com
   `sanitaryCode` não-INTERNAL. Mas a base de import (`scripts/etl-fam0017/establishments_certs.csv`)
   traz o discriminador limpo na coluna **`src` = FRIG | IND** (frigorífico → 7.7.1; industrial → 7.7.2).
   > **Correção 06/jul:** o **catálogo de categorias do GC ESTÁ COMPLETO** — 12 grupos A–L + **25
   > categorias** (AI/AII, BI/BII, CI…CV, DI/DII, E, FI/FII, GI/GII, H/HII/HIII, I, J, K, LI/LII/LIII),
   > `CV` inclusive (com `smiic_code='CI'`, dual mapping). O `n2b_depara` marcou "CV NÃO existe" porque
   > comparava **códigos-fonte da FAMBRAS** (`C1/C2/C4/CVCV`…) que não casam 1:1 com os códigos GC — é um
   > gap de **mapeamento no ETL** (source→GC), não do catálogo. Logo o problema real do import é:
   > (a) mapear `src`→formCode/categoria, (b) garantir `sanitaryCode` nas plantas de abate.
2. **A tela não tem trava/lógica de agrupamento de normas.** O analista consegue jogar todas as
   normas juntas, gerando um certificado inválido (normas que se excluem no mesmo doc).

> **Nota de arquitetura (verificada 2026-07-06):** `requiresArabic: true` em **todas** as variantes
> de mercado (`seal-config.ts`) → o serviço **sempre** usa os renderers `-arabic`
> (`CertificateArabicRenderer` / `ApprovalArabicRenderer`). Os renderers **não-árabes**
> (`certificate-renderer.ts` / `approval-renderer.ts`) são **dead code**. **Qualquer ajuste de layout
> deve ser feito nos `-arabic`.** (Os ajustes de layout do FM 7.7.1 feitos em 06/jul foram no
> `approval-renderer.ts` por engano — precisam ser replicados no `ApprovalArabicRenderer` para valer.)

---

## 1. Decisões travadas na reunião (não re-litigar)

- **D1. Layout é único por TIPO de documento.** Dentro de um tipo, o que varia é o **selo/logo**
  (parâmetro, trocável) + as **normas listadas** + **notas** (granel/álcool). Diferente do SysHalal,
  onde o selo está embutido na arte. (Renato/Lina/André)
- **D2. Assinante é fixo:** 100% dos certificados são assinados por **Dr. Mohamed Hussein El Zoghbi /
  Representante Autorizado**. Campo de assinante **não** deve ser editável (risco de acreditação). (Elaine)
- **D3. Regra de agrupamento de normas é VOLANTE** (muda conforme o acreditador). **Não** hardcodar
  "quem agrupa com quem" — decisão fica a **cargo do analista**, com a tela permitindo montar os grupos. (Elaine)
- **D4. Frigorífico não combina normas conflitantes** → emite **vários** certificados (aves ~5, bovino ~3).
  **Industrial pode combinar.** (André)
- **D5. Numeração automática pela IT 4.1.X/4.2** já está implementada no backend (foi só desabilitada
  para teste). Agrupados usam mesmo nº base + `.1`, `.2` por norma. (Renato)
- **D6. PDF é imutável/cacheado:** gera 1x, guarda no S3; download futuro devolve o mesmo arquivo
  (igual SysHalal). Regenerar exige `forceRegenerate`/nova versão. (Renato)
- **D7. Bioquímicos (K) = Certificado Único (FM 7.7.2).** Confirmado por Renato 2026-07-06 (a base de
  import marca todas as 592 linhas `K` como `src=IND`). ⇒ **O `detectFormCode` atual está errado: `K`
  deve SAIR do conjunto de habilitação `{CV, CI, CIII, K}`** (que dispara FM 7.7.1). Habilitação (7.7.1)
  fica só para **abate/proc. animal** (CV/CI/CIII com registro sanitário).

---

## 2. Tipos de certificado (modelos reais)

Os campos atuais **"lote de exportação"** e **"mercado interno"** **não existem** na realidade da
FAMBRAS e devem ser **removidos**. O tipo passa para o **topo** da tela e substitui as flags
separadas de granel/álcool.

### ⚠️ Só existem 2 layouts-base (corrigido 06/jul após varrer `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026`)

A pasta oficial de templates tem **apenas 2 troncos: `FRIGORÍFICO` e `INDUSTRIAL`** (337 arquivos .docx).
**Não há layout próprio** para Serviço/Transporte/Hotel/Armazém — todos são **FM 7.7.2 (Certificado
Único)** com **DT** diferente. Confirmado: `INDUSTRIAL/BRASIL/` tem `DT 7.1, 7.4, 7.5, 7.6, 7.8, 7.9,
7.10, 7.11` e **DT 7.11 = categoria H = Serviço**.

| Tipo (escolha do analista) | Layout-base | Como se realiza |
|---|---|---|
| **Único** (industrial/food) | FM 7.7.2 | DT 7.1 |
| **Único — Granel/Açúcar** | FM 7.7.2 | + **nota de granel** (texto abaixo) |
| **Único — Álcool** | FM 7.7.2 | + **nota de álcool** (texto abaixo) |
| **Bioquímicos (K)** | FM 7.7.2 | categoria K (D7) |
| **Serviço** | FM 7.7.2 | **DT 7.11 (cat. H)** |
| **Transporte / Hotel / Armazém** | FM 7.7.2 | DT 7.9/7.10/… + categoria respectiva (mapear — ver abaixo) |
| **Habilitação com SIF** | FM 7.7.1 | Frigorífico (CV/CI) + código sanitário |
| **Habilitação sem SIF** | FM 7.7.1 | Frigorífico sem SIF |

**Dimensões de parametrização** (da árvore de templates, não geram layout novo): segmento
(FRIG/IND) · país (BR/AR/CO/PY/PE — muda endereço FAMBRAS + rótulo CNPJ/CUIT/RUT) · espécie
(AVES→DT 7.2.1 / BOVINOS→DT 7.2.2) · mercado/acreditação (GOLFO-GAC, GAC+ENAS, UAE, OIC/SMIIC,
BPJPH, MUIS, MS → **selo**) · com/sem SIF · com/sem **anexo** de produtos · **granel** · **álcool** · **DT**.

> **Q3 RESOLVIDO 06/jul (revisto):** **não há 2ª onda de layouts** — Serviço/Transporte/Hotel/Armazém
> são **FM 7.7.2 + DT/categoria**. O que falta é **dado**, não layout: (a) mapa **DT → tipo/categoria**
> (ex.: DT 7.11=H=Serviço; confirmar Transporte/Hotel/Armazém em IT 7.10 / DT 7.11 / catálogo de
> categorias); (b) **texto exato da nota de álcool**.

### Nota de granel (texto oficial — FAMBRAS 06/jul)
Renderizar **em PT _ou_ EN conforme o idioma da lista de produtos** (regra da Elaine no gabarito),
não os dois:

> *Para produtos a granel, a FAMBRAS Halal se responsabiliza pela condição Halal apenas até a expedição
> de seu endereço de fabricação.*
> *For bulk products, FAMBRAS Halal is responsible for the Halal condition only until it is shipped from
> its manufacturing address.*

### Nota de álcool (texto oficial — extraído dos templates 06/jul)
Mesma regra de idioma (PT _ou_ EN conforme a lista de produtos):

> *Os produtos listados contêm álcool etílico de fonte lícita e são destinados ao uso externo.*
> *The listed products contain ethyl alcohol from a lawful source and are intended for external use only.*

**Fonte da verdade da parametrização:** `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026`
(FRIGORÍFICO/INDUSTRIAL → país → [espécie] → mercado → SIF → anexo → granel).
Extração completa (catálogo DT, normas por mercado, notas, categorias, matriz de cobertura) em
[`REFERENCIA-TEMPLATES-CERTIFICADO-2026-07-06.md`](./REFERENCIA-TEMPLATES-CERTIFICADO-2026-07-06.md).
Normas por **(DT × mercado)** normalizadas em
[`REGRAS-NORMAS-POR-DT-MERCADO-2026-07-06.md`](./REGRAS-NORMAS-POR-DT-MERCADO-2026-07-06.md).

> **Achado (06/jul):** os próprios templates Word são **inconsistentes** entre si para o mesmo
> (DT×mercado) — separadores/anos divergentes, textos colados/truncados. Reforça ter o **engine
> paramétrico como fonte única** e reconciliar contra **FM 4.1.X REV 03** (não copiar o docx cru).
> Confirmado também: **GAC × GAC+ENAS têm as mesmas normas** — muda só o **selo** (D-selo).

---

## 3. Backlog por área e prioridade

Ordem sugerida: **J → C/D → B → E → F/G → H → I**. J e D/C são o que faz "sair certificado errado" hoje.

### J. Correção do bug central (P0)
- **J1. [DECIDIDO 06/jul]** Fonte da verdade do formulário = **TIPO explícito escolhido pelo analista**
  na tela (o tipo vai pro topo, §C). O sistema apenas **sugere um default** derivado da **categoria
  corrigida** (não do `src`); `src` FRIG/IND vira **validação/backfill** e sanity-check de massa.
  - **J1a.** Remover `K` de `HABILITATION_CATEGORIES` no `detectFormCode` (D7) — bioquímicos = 7.7.2.
  - **J1b.** (ETL/import) Mapear **códigos-fonte FAMBRAS → códigos GC** (`C1/C2/C4/CVCV`→`CI/CIV/CV`…;
    ver `n2b_depara_categorias_FAMBRAS.csv`) e garantir `sanitaryCode` nas plantas de abate.
    **NÃO é migration de catálogo** — o catálogo GC (25 categorias) já está completo. Escopo do import.
  - **J1c.** Validar em massa: nenhuma linha `src=FRIG` deve resolver 7.7.2 e vice-versa (exceto exceções conhecidas).
- **J2.** Aplicar os ajustes de layout do FM 7.7.1 (feitos em 06/jul) no renderer **vivo**
  (`ApprovalArabicRenderer`); revisar fidelidade do FM 7.7.2 vivo (`CertificateArabicRenderer`),
  que saiu "mal renderizado".
- **J3.** Trava/UX de agrupamento de normas (ver D).

### C/D. Tipos + normas + agrupamento (P0/P1)
- **C1.** Mover **tipo de certificado** para o topo; remover "lote de exportação"/"mercado interno".
- **C2.** Granel/álcool viram variação do **tipo** (remover flags soltas §G).
- **D-UI.** Em "Normas e mercados": tick **"gerar agrupados × individuais"** + seleção de **quais
  normas** em cada grupo. Gera todos de uma vez; numeração automática por grupo. Sem hardcode de
  compatibilidade (analista decide).
- **D-selo.** Selo/logo do certificado é **parâmetro** derivado da norma/mercado (não muda o layout base).

### B. Seleção de empresa/planta (P1)
- **B1.** Remover redundância Empresa + Planta → **selecionar a planta direto**.
- **B2.** Busca por **SIF** e por **localidade/cidade** (além de CNPJ). SIF/planta puxa o resto.
- **B3.** Empresa **sem SIF** → CNPJ ou cidade.
- **B4.** Exibir **grupo + nome (+ SIF)** na lista, não o CNPJ solto.
- **B5.** **País da planta** puxado automático do cadastro (remover campo manual).
- **B6.** **Certified since / cycle date**: remover "opcional"; buscar da base.

### E. Escopo (produtos e marcas) (P1)
- **E1.** **Marcas** deixa de ser tópico separado → fica **dentro do escopo**.
- **E2.** Campo de produtos **inteligente por segmento**:
  - Industrial: `produto + código + embalagem + marca (por produto)`.
  - Frigorífico (habilitação): agrupa marca, **sem** código/embalagem.
- **E3.** Import de produtos: botão **exportar planilha-modelo** + importar (layout fixo garantido).

### F. Numeração (P1)
- **F1.** Reabilitar geração automática (IT 4.1.X/4.2).
- **F2.** Garantir **não-duplicidade** (havia ~2 duplicados no import).

### G. Campos a remover/automatizar (P1)
- **G1.** Remover **"nome do assinante"** (D2).
- **G2.** Remover **"customizar template/combo"** (só existe para cert de **embarque** no SysHalal).
- **G3.** **Override de DTs** em "Ajustes avançados" → manter **colapsado**; avaliar permanência.

### H. Clonar certificado (P2)
- **H1.** Clonar/rascunho: mesma empresa/planta, muda só **produtos** (cert por produto; cochonilha
  Golfo 10 × Malásia 11). Layout igual, muda a tabela de produtos; nº recalculado.

### I. Travas por camadas (P3 — futuro, não agora)
- ~~Proibir norma/mercado sem habilitação~~ → **NÃO** vira trava automática: o reconhecimento por
  mercado é **volante** e fica com o analista (Q4). No máximo, **presets sugeridos** (Q2), nunca bloqueio.
- Validar produto/marca dentro do escopo.
- Link com relatório de exportação (SIH ↔ SysHalal) antes de autorizar.

### Extra
- **Performance** da geração do PDF (melhorar velocidade).

---

## 4. Perguntas em aberto (decisão do PO/FAMBRAS)

- **Q1 (J1): ✅ RESOLVIDO 06/jul.** Tipo = escolha explícita do analista; default derivado da
  **categoria corrigida** (K sai da habilitação — D7); `src` só valida/backfill. Ver J1.
- **Q2: ✅ RESOLVIDO 06/jul — presets sugeridos.** Agrupamento com **presets sugeridos (não travados)**
  por mercado para reduzir erro; o analista sempre pode ajustar.
- **Q3: ✅ RESOLVIDO 06/jul (revisto)** (ver §2): só existem **2 layouts-base** (7.7.1 FRIG / 7.7.2 IND).
  Serviço/Transporte/Hotel/Armazém = **FM 7.7.2 + DT** (DT 7.11=H=Serviço), **não** são layout novo →
  sem 2ª onda. Mapa DT→tipo/categoria **extraído** (§6). Notas de **granel e álcool obtidas**. Só resta
  confirmar Hotel=DT 7.11 e Transporte/Armazém=DT 7.8 com FAMBRAS.
- **Q4: ✅ RESOLVIDO 06/jul.** Separar dois conceitos:
  - **País (físico) da planta** → vem do **cadastro da planta** (auto). O campo manual "País da planta"
    no bloco "4. Layout do PDF" **sai** (deriva do cadastro).
  - **Reconhecimento (quais mercados/normas a planta pode ter)** → é **VOLANTE**, fica com o
    **analista/equipe**, **SEM trava automática** e **NÃO** vem do cadastro. Casa com Q2 (presets sugeridos).

---

## 5. Referências

- `certificate-pdf.service.ts` — `detectFormCode`, seleção de renderer, `extractRequirements`.
- `seal-config.ts` — `MARKET_VARIANT_CONFIGS` (todos `requiresArabic: true`), `resolveSeals`, `BLOCKED_SEAL_IDS`.
- Renderers vivos: `ApprovalArabicRenderer` (7.7.1), `CertificateArabicRenderer` (7.7.2).
- Base de import: `scripts/etl-fam0017/establishments_certs.csv` (col. `src`, `cat_gso`, `cat_smiic`, `sif`),
  `n2b_depara_categorias_FAMBRAS.csv` (gap categorias-fonte × catálogo GC).
- Regras: **IT 7.10** (preenchimento/gabarito), **FM 4.1.X REV 03** (normas × mercado).
- Front: `halalsphere-frontend/src/pages/analyst/ManualCertificateEmission.tsx`.
</content>

---

## 6. Catálogo DT → Categoria → Tipo (extraído dos templates 06/jul)

Extraído de `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026` (336 .docx, gabaritos reais pré-preenchidos).
Todos incluem sempre **DT 7.3 – Halal Assurance System (HAS)** além da DT principal.

| DT | Requisito (texto oficial EN) | Categoria (display) | Tipo de negócio | Form base |
|---|---|---|---|---|
| **7.1** | industrialized food and food additive certification | **C – Food manufacturing** (subcat CI – perishable animal products; CV; etc.) | Único industrial (alimentos/aditivos) | 7.7.2 |
| **7.2.1** | poultry slaughterhouses certification | C – Food manufacturing / **CV – Animal slaughtering** | Habilitação abate **AVES** | 7.7.1 |
| **7.2.2** | bovine slaughterhouses certification | C – Food manufacturing / **CV – Animal slaughtering** | Habilitação abate **BOVINOS** | 7.7.1 |
| **7.4** | Chemicals in general and cleaning agents | **K – Chemical and Biochemical manufacturing** | Químicos / saneantes | 7.7.2 (há variante c/ SIF = 7.7.1) |
| **7.5** | Drugs and medications | K – biochemicals (drugs and medications) | Medicamentos | 7.7.2 |
| **7.6** | Cosmetics and personal care products | K – biochemicals (cosmetics and personal care) | Cosméticos/higiene | 7.7.2 |
| **7.7** | farms certification | **B – Farming of plants** (BII – pulses and grains) | Fazenda (genérico) | 7.7.2 |
| **7.7.1** *(DT!)* | animal farms certification | **A – Farming of animals** (A1 – meat/milk/eggs/honey) | Fazenda animal | 7.7.2 |
| **7.7.2** *(DT!)* | agricultural farms certification | B – Farming of plants (BII) | Fazenda vegetal | 7.7.2 |
| **7.8** | warehouse, transportation and distribution | **G – Transport and storage services** (GI) | **Transporte / Armazém** | 7.7.2 |
| **7.9** | feed production | **D – Animal feed production** (DI) | Ração / feed | 7.7.2 |
| **7.10** | packaging materials and wrappers | **I – Production of food packaging** | Embalagens | 7.7.2 |
| **7.11** | food and tourism services | **H – Services** | **Serviço / Hotel** | 7.7.2 |

> Os tipos pedidos na reunião mapeiam direto: **Serviço/Hotel → DT 7.11 (cat. H)**;
> **Transporte/Armazém → DT 7.8 (cat. G)**. Nenhum precisa de layout novo — todos FM 7.7.2.
> **Confirma com FAMBRAS:** Hotel entra como "food and tourism services" (DT 7.11)? Transporte e
> Armazém ambos DT 7.8?

### Distinção por país (do nome/rótulos dos templates)

| País | Registro | Sufixo do form code | Obs |
|---|---|---|---|
| **Brasil** | CNPJ | *(sem sufixo)* | S.I.F. quando frigorífico |
| **Argentina** | CUIT | `.A` | |
| **Colômbia** | RUT (NIT) | `.C` | |
| **Paraguai** | RUC | `.P` | |
| **Peru/Equador** | RUT | `.C` | há template `FM 7.7.1.C - ECU AGROCALIDADE` **misfiled** na pasta PERU — validar |

### ⚠️ Cuidados para a implementação
- **Colisão de nomenclatura:** `DT 7.7.1`/`DT 7.7.2` (fazendas) ≠ `FM 7.7.1`/`FM 7.7.2` (formulário).
  Não confundir no código.
- **Cobertura do `dt-code-map`/`category-display-map`:** hoje há foco em DT 7.1/7.2.x. As DTs
  **7.4–7.11** precisam estar mapeadas (label + categoria) senão caem em fallback → parte do
  "mal renderizado" observado. Auditar cobertura na implementação (item J2).
- **`.C` compartilhado** por Colômbia e Peru/Equador — checar se o sufixo do nº de cert precisa
  desambiguar por país (ISO3 `.COL`/`.PER`/`.ECU` no número já resolve?).
