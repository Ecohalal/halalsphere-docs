# HANDOFF — Sessão 07→08/jul (emissão manual GC + fidelidade PDF 7.7.2 + conteúdo Corbion)

> **Continuação de** `HANDOFF-EMISSAO-MANUAL-2026-07-07.md`. Branch **`release`** = deploy (push dispara CI/CD).
> Fontes desta sessão: 4 transcrições em `C:\HalalSphere\Alinhamentos de validação\` (`060726_11h/16h`, `070726_11h/16h`) + gabaritos em `C:\HalalSphere\Gabaritos atualizados\`.
> **Ao retomar: NÃO re-validar nem refazer o que está abaixo como FEITO.**

## 1. FEITO e PUSHADO em `release` (deploy disparado)

### halalsphere-frontend
- `01bb57cb` combobox único Grupo/Planta (`SearchableSelect.tsx`) + `getAll({take:2000})` — default 50 cortava JBS/Minerva/BRF.
- `7bd4d41e` categoria **adiciona ao selecionar** (botão "Adicionar" removido).
- `0ef399bc` botão **Imprimir** roteia pelo `/generate-pdf` (respeita force-regen; analista/gestor/admin).
- `5b67ebe5` import/export produtos em **.xlsx 2 abas** (Modelo + Instruções; dep `xlsx@0.18.5`).
- `e8e691bc` **facilityType** frigorífico (select Seção 7; aves auto-sugere).
- `5f35267a` `deriveTemplateCode`: GSO só → GCC.
- `9f36de65` **marca não obrigatória** + copy "modelo Excel".
- `57f10cc6` **S3 rascunho** (localStorage `gc-manual-cert-emission-draft-v1`, banner restaurar/descartar) + **S5** remove "Customizar norma/template".
- `aa418b59` **datas em UTC** (5 telas: lista, detalhe, emissão, card grupo, verify público) — fim do −1 dia.
- `b2ad2c47` badge "Tipo" do dashboard usa categoria real.
- `732b0cd9` **S4 DTs em checkboxes** auto-ticados + **2.3 Seção 9 colapsada**.

### halalsphere-backend
- `6c155aec` FM 7.7.2 **pagina por altura real** (fim das 16 páginas/overlap dos JBS).
- `d98a496d` **modo-teste Imprimir** (env `CERTIFICATE_REPRINT_FORCE_REGEN`; regenera fresco + sobrescreve mesmo S3).
- `e46ab213` facilityType → frase "HALAL … FACILITY:" no escopo 7.7.1 (via `requirementsOverride.facilityLabel`, sem migration).
- `cddf3513` **selo ENAS só com UAE.S** + `approval-renderer.renderSeal` empilha (não sobrepõe).
- `4e50beea` **colunas dinâmicas** 7.7.2 (coluna 100% vazia some; só Nome obrigatório) + **"Packing size" re-adicionada** (reverte remoção de 22/jun).
- `5e95154a` **layout 7.7.2 — 10 ajustes de fidelidade** ao gabarito + `bg-certificate-portrait-hires.jpg` (300 DPI reconstruído do docx): logo/título nítidos, selos GAC 36pt/ENAS 58pt, labels `EN | árabe` inline (header + 3 datas), datas na sequência à esquerda, zero verde, linha+fonte 7.5 no rodapé, QR centralizado, assinatura 195pt.
- `3e93e9a5` reprint usa **`marketVariant` gravado** no Certificate (Corbion volta a GAC+ENAS).
- `d26bbb66` `formatDateEN` com getters **UTC** (defensivo p/ host em fuso negativo).
- `c9b0531b` `findOne`/`findByNumber` incluem **categoria aninhada** (fim do "C1 - Abate" na tela; PDF já estava certo).
- `da4906f8` gerador `gen_j1b_categories.py` (rastreabilidade do J1b).

### Operações em prod (DBeaver / infra) — EXECUTADAS
- **J1b commitado**: `load_j1b_cert_categories.sql` → **1956 vínculos** de categoria; **2 certifications sem categoria** (códigos ambíguos C/C6/D4/G → FAMBRAS). 1º SELECT vazio ✓, 113 certs do CSV sem match (= não importados pelo N2, esperado).
- **cycle_date**: já estava CORRETO no banco (1187/1253 = expiry−3y). Backfill **descartado** (no-op). 66 nulls = vigência ≠ 3 anos → FAMBRAS.
- **env `CERTIFICATE_REPRINT_FORCE_REGEN=true`** setada na task def do GC (modo-teste LIGADO). **DESLIGAR pós-validação FAMBRAS.**

## 2. DECISÕES TRAVADAS nesta sessão (não re-litigar)
- **Selos:** GSO só → **GCC** (só GAC); UAE.S só → **ENAS**; GSO+UAE → **GAC_ENAS**.
- **Colunas 7.7.2:** coluna 100% vazia SOME; **só Nome obrigatório**; **Packing size volta** (reverte 22/jun).
- **facilityType** (frigorífico 7.7.1): slaughter/deboning/slaughter_deboning/slaughter_processing → prefixa produtos no escopo. Aves = processing.
- **Datas date-only = UTC** (nunca converter pro fuso local; timestamps reais seguem local).
- **Tipo na tela = categoria industrial M:N** (helper `getCertificationCategoryLabel`); enum legado C1..C5 é só fallback.
- **Idioma extra = cert adicional separado** (Dib); **acesso sempre e-mail individual**; **assinante fixo** Dr. Mohamed Hussein El Zoghbi (não editável).
- **Modo-teste Imprimir** = env reversível; regenera + sobrescreve mesmo S3.

## 3. PENDÊNCIAS (por dono)
| Dono | Item |
|---|---|
| **Renato — validar** | Corbion pós-CI: **reimprimir** (selos GAC+ENAS · Category K · cycle 22/12/2023 · datas 10/06 e 22/12) + **Ctrl+F5** na tela (Tipo=K). |
| **FAMBRAS — cobrar** | Lista **empresa → "certificada desde"** (destrava o último campo do cert) · logos acreditadoras em **alta resolução** · de/para dos **2 certs sem categoria** + **66 sem cycle** · lista de e-mails dos analistas · prints de novos testes · **taxonomia de categoria dos 3 nacionais** (Malásia/MS, Indonésia/BPJPH, Singapura/MUIS) → GSO ou SMIIC? (enviado ao grupo 08/jul; resto do mapa já derivado do FM 4.1.X). |
| **Renato — conduzir** | **Normalização de cadastro** (grupos/empresas/plantas: cidade, CNPJ, duplicatas Rising, backfill cidade/UF, CNPJ→Receita) → **pré-requisito do L2**. |
| **Eu — sessão dedicada** | **F1** múltiplos por PRODUTO (DSM ~130 certs; checkbox de quais produtos por cert, inline sem persistir) · **F2** draft→aprovar→travar (+ edição c/ justificativa) · **F3** nº = nº do CONTRATO · **L2** CNPJ/endereço overflow no header 7.7.2 (pós-normalização) · opcional: "AND antes do último" produto. |
| **Eu — categoria por norma (🟢 DEPLOYADA 09/jul — back `96c9b6f7` + front `c0caae17`; aguarda validação PROD)** | **Categoria por norma** — spec `halalsphere-docs/PLANNING/CATEGORIA-POR-NORMA-PICKER-EMISSAO-GC-SPEC-2026-07-08.md`. **Parte 1 (picker/entrada):** fix `CV.applicableSmiic=false` + add L4/LIV (SMIIC) + reordenar norma-antes-categoria + filtrar categorias por norma (`applicableGso/applicableSmiic`) — **pronta, decisões PO fechadas**. **Parte 2 (nomenclatura/saída PDF):** categoria sai ora GSO ora SMIIC porque `certificate-pdf.service.ts:680` usa `certification.standard` **colapsado**; fix = resolver taxonomia pela **norma real** (via `resolveFambrasMarket`). **Mapa fechado (FAMBRAS 08/jul): SMIIC só para OIC/SMIIC (Turquia); TODO o resto = GSO** — inclui Malásia/Indonésia/Singapura (Soha: SGQ baseado em GSO; "verificar internamente" = revisível, não bloqueia). **🟢 DEPLOYADA em release 09/jul** (back `96c9b6f7`: migration CV.applicableSmiic=false + LIV, getCategoryDisplay BOTH→GSO; front `c0caae17`: Seção 2 Norma antes da Categoria, picker filtrado + poda, preview DT, aviso Ponto 2). Aguarda validação PROD. Reorder foi CONTIDO (só seletor de norma subiu; DT editável segue em Ajustes avançados). |
| **Parked / paralelo** | **C** criticidade de MP (decisão: depois) · **D** validação produto×escopo / palavras proibidas (**SysHalal/Cisalau**, aguarda lista do Dib) · **IFF** anexar documento (6.2) · **113 certs** não importados (N2c) · **SES** entrega. |

## 4. Harness / assets (scratch, fora do git)
- PDF: `scripts/gen-certificate-arabic-sample.ts` (case1 JBS S/A, case2 AVES, case3 colunas cheias, case4 nome+marca; env `MV=<variant>` p/ selos) · `gen-approval-facility-sample.ts` (7.7.1, `MV=`) · `gen-approval-sample.ts`. Rodar do dir do backend com `npx ts-node -r tsconfig-paths/register`; **sempre nome de arquivo NOVO** (cache de leitura). Ler o PDF gerado direto (a ferramenta de leitura renderiza páginas).
- Assets 300 DPI commitados: `bg-certificate-portrait-hires.jpg` (usado) + `*-hires.jpg` de logo/título (reserva).

## 5. Regras operacionais
- Trabalhar em `release`; **pedir OK antes de cada push**. Renato sobe back+front local (NÃO iniciar dev server nem tocar `.env.local`).
- Renderer/lógica → **sem API Gateway**. **Rota nova** no GC → regenerar API GW (swagger + 3 JSONs no mesmo commit).
- DDL = migration idempotente; **dados/carga = SQL p/ Renato rodar no DBeaver** (colar outputs; nunca presumir resultado).
- `.gitignore` bloqueia `*.sql` (exceto prisma/docker) e os harnesses `.ts` são scratch; os geradores `gen_*.py` do ETL SÃO versionados.

---

## 6. Alinhamento 08/jul 11h + trabalho em PARALELO (2 sessões)

> Reunião ampla de validação (Elaine, Lina, Soha, André, Nisa, Ema, Elisara, Dib).
> Transcrição: `C:\HalalSphere\Alinhamentos de validação\080726_11h.txt`.
> Spec da categoria: `halalsphere-docs/PLANNING/CATEGORIA-POR-NORMA-PICKER-EMISSAO-GC-SPEC-2026-07-08.md`.

### 6.1 Duas trilhas paralelas (evitar colisão)
Rodamos em DUAS sessões separadas, com **domínios de arquivo distintos**:

- **Trilha NORMALIZAÇÃO (sessão dedicada — Renato):** saneamento de cadastro (endereço, escopo/produtos, SIF) a partir do FM 7.8.x / SysHalal. Domínio: **dados (DBeaver SQL) + cadastro** (Company/Plant/Scope). Destrava em cascata: endereço 2 linhas no header (**L2**), **SIH mostrar frigoríficos certificados** (André/Victor), `certified since`, verificação cruzada c/ embarque SysHalal. Meta: base validada + lista pra FAMBRAS validar ("quatro mãos").
- **Trilha EMISSÃO/CATEGORIA (esta sessão):** leva de categoria + robustez de emissão + render PDF. Domínio: **código** — `ManualCertificateEmission.tsx`, `certificate-pdf.service.ts`, `seal-config.ts`, `category-display-map.ts`, seed `industrial-categories`.

**Regras de coordenação:** ambas em `release`, **pedir OK antes de cada push**; **NÃO editar os mesmos arquivos** entre trilhas; ref-data de categoria (CV/L4) pertence à trilha EMISSÃO; sincronizar no grupo se houver sobreposição.

### 6.2 Backlog EMISSÃO/CATEGORIA (esta trilha)
1. ✅ **Categoria leva — DEPLOYADA 09/jul** (back `96c9b6f7` + front `c0caae17`): (a) `CV.applicableSmiic=false` + `L4/LIV` (migration); (b) Seção 2 "Norma/Reconhecimento" antes da Categoria + preview DT junto; (c) picker filtra por norma + poda ao trocar; (d) aviso de coerência **Ponto 2** (depende de species cadastrada); (e) `getCategoryDisplay` BOTH→GSO (SMIIC só Turquia). **Aguarda validação PROD.** Follow-up: DT editável no fluxo (hoje é preview + edição em Ajustes avançados) se Soha pedir.
2. **Robustez de emissão:** (A) **trava de data** (>3 anos = aviso vermelho; barrar data impossível); (F) **"descartar só produtos"**.
   - ⏸️ **(E) parser xlsx — PARKEADO 09/jul** (aguarda o **arquivo de escopo REAL da Lina** — o "controle de escopo" Produto/Código/Embalagem/Marca que deu colunas em branco; Renato prefere o modelo correto antes de codar). *Não confundir com as FM 7.4.2.7 MP/Fornecedores — essas são matéria-prima, não escopo.*
   - ⏸️ **(G) emissão assíncrona (Ponto 1) — REBAIXADA 09/jul.** **Re-diagnose:** o "timeout dos 151" NÃO era escala do servidor — era **arquivo shadow-copy do OneDrive** (placeholder não lido; menor também falhou; **arquivo local emitiu rápido**) + **formato fora do padrão** (colunas em branco = parser). Antes de construir async, **medir**: com o parser corrigido, testar arquivo local limpo com 151 produtos — se < 29s, async não é necessário.
3. **Render PDF:** (B) **remover selos nacionais** — só acreditação (GAC/ENAS/RAC); selo Indonésia no teste da Lina = **bug**; (D) **PDF protegido** (não copiável; validação via QR).
4. **DEFERIDO:** edição do texto da DT (fase 2); layout **novo** (rito diretoria → Dr. Mohamed → acreditadores — hoje é fidelidade ao layout velho).
5. **Emissão de cert de PRODUTO por cliente (DSM/IFF) — na fila atrás da normalização do escopo (indústria).** Análise do histórico real (`etl-fam0017/establishments_certs.csv`) fechou: modelo **(a)** norma-por-habilitação (`market_scopes` na certification; `scope_products` sem norma); **GSO×SMIIC coexistem em INDUSTRIAL** (conflito é só frigorífico); **1 produto/cert**; **nº próprio IT 4.2** (não `base.N` → F1-partição não serve); guardrail `produto ∈ escopo` **E** `norma ∈ habilitação`; sobreposição OK; não nomeia cliente (SKU amarra). **Depende de digitalizar o escopo DSM/IFF** (normalização apontada p/ indústria). Spec dedicada a escrever quando priorizar. Ver memória `project_emissao_cert_produto_dsm_iff_2026-07-08`.

### 6.3 Pendências FAMBRAS (colher)
PNG alta-res (GAC/RAC + assinatura) · validar lista de normalização · **confirmar conjunto exato de selos** (GAC/ENAS/RAC?) · Nizar validar fontes/rodapé pós-viagem.

### 6.4 Confirmações (sem dev novo)
Multi-categoria = **certs separados via clonar** (habilitação + único) · signatário **Mohamed** mantido · QR mesmo domínio `cert.fambrasralal.com.br/verify` · cert **VOLUNTARY** mostra todas categorias · Malásia/Indonésia/Singapura → **GSO** (SMIIC só Turquia).

---

## PROMPT PARA A PRÓXIMA SESSÃO
```
Contexto: GC (halalsphere) — trilha EMISSÃO/CATEGORIA da emissão manual de certificado.
Leia primeiro: halalsphere-docs/PLANNING/HANDOFF-SESSAO-2026-07-08.md (§6 é o mais atual)
+ spec CATEGORIA-POR-NORMA-PICKER-EMISSAO-GC-SPEC-2026-07-08.md. Memórias
project_categoria_por_norma_picker_2026-07-08 e project_emissao_cert_produto_dsm_iff_2026-07-08
carregam no início.

PAPÉIS: Renato NÃO é dev — eu (Claude) escrevo 100% do código; ele decide/revisa/deploya e é a
cara junto à FAMBRAS. NÃO misturar sistemas: GC ≠ SysHalal ≠ SIH. "na minha tela / em PR" na
boca do Renato = nosso trabalho (o que eu produzo), não um dev externo.

DEPLOYADO em release 09/jul (NÃO refazer): F1 split-por-produto (front c0caae17 + back 8c1eda2f);
LEVA DE CATEGORIA (back 96c9b6f7: migration CV.applicableSmiic=false + LIV; getCategoryDisplay
BOTH→GSO, SMIIC só Turquia; front c0caae17: Seção 2 "Norma/Reconhecimento" antes da Categoria,
picker filtra por applicableGso/applicableSmiic + poda ao trocar, preview DT, aviso coerência Ponto 2).
AGUARDA validação PROD dos 4 cenários (só GSO→CV aparece/grupo L some; só SMIIC→CV some/LI-LIV;
trocar norma poda a seleção; PDF coerente). Testar em PROD (base atualizada é onde aparecem inconsistências).

TRILHAS PARALELAS (§6.1): NORMALIZAÇÃO (sessão do Renato — dados/cadastro DBeaver) × EMISSÃO/CATEGORIA
(esta — código). NÃO editar os mesmos arquivos.

PARKEADO/REBAIXADO: parser xlsx (aguarda arquivo de escopo REAL da Lina — Produto/Código/Embalagem/
Marca que deu colunas em branco; NÃO é as FM 7.4.2.7 MP/Fornecedores); async emissão Ponto 1
(REBAIXADO — o "timeout 151" era shadow-copy OneDrive + formato, não escala do servidor; medir com
arquivo local limpo antes de construir). DSM/IFF cert-de-produto: atrás da digitalização do escopo (indústria).

ACIONÁVEL AGORA (quick wins, esta trilha): trava de data (>3 anos = aviso + barrar data impossível);
"descartar só produtos"; remover selos nacionais (só GAC/ENAS/RAC — selo Indonésia no teste da Lina = bug);
PDF protegido (não copiável, validação via QR). + reconciliar release→development (F1 + leva categoria).

Comece confirmando que leu o handoff §6 e pergunte ao Renato: (a) validou os 4 cenários em PROD?
(b) por qual quick win começar? Regras: release=deploy (pedir OK a cada push); NÃO subir dev server
nem mexer .env.local; renderer sem API Gateway, ROTA NOVA sim (regenerar swagger+3 JSONs no mesmo commit);
DDL=migration idempotente com nome MAPEADO da tabela; dados/carga=SQL p/ Renato no DBeaver.
```

---

## 7. Matriz de cobertura — reuniões da semana (06–08/jul) — revisão 09/jul

> Cruzamento das 5 transcrições (`060726_11h/16h`, `070726_11h/16h`, `080726_11h`) contra o que
> está FEITO (§1) e rastreado (§3/§6). Fonte durável (evita reabrir). ✅=fechado · 🟡=rastreado · ⏸=parked.

### Fechado nesta semana (deployado)
- **Layout PDF 7.7.2** (10 ajustes fidelidade + colunas dinâmicas + packing size + paginação por altura) ✅
- **Combobox Grupo→Planta**, país automático, tipo no topo (granel/álcool), assinante fixo Mohamed,
  marca não-obrigatória/por produto, DTs em checkbox, clone por número, rascunho autosave, xlsx 2 abas ✅
- **Selo ENAS só com UAE.S**; **categoria** substitui "tipo de produto" na coluna ✅
- **Categoria por norma** (leva 09/jul) — 4 cenários **validados em PROD** ✅
- **Trava de data** (09/jul, front `295d274f`) — fecha 08/jul #6 (>3 anos = aviso) e #12 (datas impossíveis) ✅
- **"HalalSphere" em e-mail/2FA** — verificado: `email.service.ts` e `onboarding.service.ts` usam
  "Gestão de Certificações"; não vaza mais ✅
- **G1 clone com typeahead** (09/jul, front) — busca conforme digita, nº + planta/empresa ✅
- **Remover selos nacionais** (09/jul, back `ee23628f`) — `resolveSeals` vira allowlist `{fambras,gac,enas,oic}`; corrige bug do selo Indonésia (BPJPH) no teste da Lina; OIC/SMIIC (Turquia) preservado; RAC entra quando FAMBRAS mandar PNG ✅
- **Descartar-só-produtos** (09/jul, front `d5ced92a`) — botão limpa a lista de produtos + grupos de produto, mantém grupo/planta/normas/categoria/datas ✅
- **Guard-rail de categorias por modelo** (14/jul, front `e1f92785`) — feedback do André item 03: BLOQUEIA categorias de modelos diferentes (habilitação 7.7.1 × único 7.7.2 — ex.: CV+HII/GI); AVISA tipos diferentes no mesmo modelo (serviço × transporte); LIVRE mesmo tipo (CI+CII, GI+GII). Orienta emitir separados via Clonar ✅

### Trabalho de 14/jul que estava sem commit (recuperado e deployado 14/jul)
- front `827f8adf` — preset de normas **por espécie** (bovinos `GSO+UAE / BPJPH+MUIS+MS / OIC`; aves em 5 grupos) + exibe SIF da planta selecionada (item #8).
- back `c396f0a5` — **OIC/SMIIC 01/2019** (norma de PRODUTO, não a "2" de organismo) · **GSO/UAE 993** só em habilitação de ABATE (CV / DT 7.2.x) · **índice `.K.` por espécie** na numeração (single também carrega o `.K.`; split por produto segue sequencial).
- ⚠️ **Pendente de validação do Renato em prod** — mexe em **número do certificado** e texto de normas no PDF.

- **PDF protegido — cópia bloqueada** (14/jul, back `6fed9470`) — Lina 08/jul. Novo `pdf-protection.ts` = fonte única (o `approval-renderer`/FM 7.7.1 estava SEM proteção). Cert **sempre abre** (sem `userPassword`; autenticidade via QR); bloqueia copiar/editar/anotar/acessibilidade/montar; **imprimir liberado**. `pdfVersion:'1.7'` é obrigatório — no default (PDF 1.3/RC4 40-bit) as permissões finas são silenciosamente ignoradas e a extração via leitor de tela ficava aberta. Verificado decodificando os bits `/P`. ✅
  - ⚠️ **Deploy exige nova rev. da task def** com **`CERTIFICATE_PDF_UNLOCK_KEY`** (`9bf9bab0`). **NÃO é senha para abrir o certificado** — o cert abre livre, sem senha (autenticidade via QR). É o *owner password* da spec do PDF: nunca pedida para abrir/ler/imprimir, serve só para **remover as restrições** de um arquivo já emitido. Existe porque a spec não deixa declarar "não pode copiar" num documento sem dono. Sem a env, a proteção continua valendo (chave aleatória) — só não haverá dono conhecido para destravar depois. Documentada em `.env.example`.
  - ⚠️ **Limite:** permissão de PDF é advisória (qpdf/print-screen contornam) — não vender como inviolável; o antifraude real é o QR. Vale só p/ certs **novos** (os já emitidos no S3 são imutáveis).
  - 🧹 **Dívida:** `base-template.renderer.ts` é código morto (nenhum consumidor) e ainda tem caminho de `userPassword` — foi a origem da divergência entre renderers. Vale deletar.

### Aberto e rastreado
- ~~Quick wins de código~~ — ✅ **TODOS FECHADOS** (trava de data · clone typeahead · descartar-só-produtos · selos allowlist · guard-rail categorias · PDF protegido).
- **Feedback do André (14/jul):**
  - item 03 (categorias incompatíveis) → ✅ guard-rail `e1f92785`
  - pergunta do template → ✅ `82a5e2c1`: a tela mostra **os selos que saem** ("apenas FAMBRAS" nos nacionais) em vez do código do template; nota explica que a norma marcada sai no **texto**. Revelou que **GSO+OIC juntos → template GCC → só GAC** (selo OIC não sai) — coerente com "SMIIC só Turquia", **confirmar com Soha**.
  - **busca por SIF no topo** (item 01) → Renato assume, alinhado ao `#8` já feito 🟡
  - **"Norma principal = Voluntária"** → ✅ **rótulo corrigido** (`2844a9c2`): vira **"Sem norma acreditada (GSO/SMIIC)"** nos 3 pontos (emissão, detalhe, manual no app). `VOLUNTARY` **não é norma** — é o *fallback* de quando nem GSO nem OIC/SMIIC é marcado; a tela respondia "Voluntária" a quem acabara de marcar normas, e a palavra sugeria "vale menos". **Sem mudança de comportamento**: VOLUNTARY já obedece às regras do GSO (nomenclatura de categoria + `gsoAuditMode`, *"Default to GSO rules"*).
  - 🟡 **Decisões PENDENTES da Soha** (derivação, não rótulo):
    1. **Mercados nacionais BPJPH/MUIS/MS devem DERIVAR GSO?** O alinhamento de 08/jul diz que são baseados em GSO e o sistema **já os trata como GSO** internamente — só a derivação de `standard` não reflete. Se sim, "Voluntária" praticamente deixa de existir na emissão manual (a validação exige ≥1 norma).
    2. 🚩 **Contradição real:** marcar **só UAE.S** → `standard` = "sem norma acreditada", **mas o PDF imprime o selo ENAS**, que É acreditação. Um cert que estampa ENAS e se declara sem acreditação.
    3. **GSO+OIC juntos → template GCC → só o selo GAC** (o selo OIC não sai). Coerente com "SMIIC só Turquia", mas confirmar.
- ~~Reconciliar backend `release`→`develop`~~ — ✅ **FEITO 14/jul** (merge `fec9062b`, 31 commits, zero conflitos; tsc + renderers.spec OK). Front e back agora com `release` ≡ `develop`.
- **Sessão dedicada:** F2 draft→aprovar→travar+audit · F3 nº=contrato · L2 overflow endereço header 🟡
- **Parked/rebaixado:** parser xlsx formato real ⏸ · async 151 produtos ⏸ · DSM/IFF cert-de-produto ⏸
- **Trilha normalização (Renato/dados):** endereço/CNPJ-Receita/Rising/cidade-UF/escopo · SIH mostrar frigoríficos certificados 🟡
- **Parked C/D:** trava produto industrial×frigorífico + palavras proibidas ⏸ · criticidade MP ⏸
- **FAMBRAS (colher):** logos/assinatura alta-res · e-mails analistas · lista "certificada desde" · taxonomia 3 nacionais · prints

### Itens levantados — resolução (revisão 09/jul com Renato)
- **G1** clone sem autocomplete → **FEITO** (typeahead).
- **G2** "importar linha da planilha preenchendo todos os campos" → **superado** por clone + emissão manual.
- **G3** "menos colunas exige justificativa / só planta 100% halal" → **ENCERRADO** (Renato 09/jul: frescura; coluna vazia some sozinha, sem gatekeeping).
- **G4** segregar visões por papel → **pós-go-live**.
- **G5** nome errado no card de detalhe → **OK** (não reincide na base atual).
- **G6** selos pequenos / assinatura resolução → **já tratado** (layout + depende de FAMBRAS mandar alta-res).
- **G7** Argentina sem todas as categorias de reconhecimento → **ENCERRADO** (Renato 09/jul: frescura; sem trava país×norma).

**Fora da alçada (sem código):** porto Dubai Harpan→Jabel Ali resolvido por carta de correção do CECI (SysHalal/processo).
