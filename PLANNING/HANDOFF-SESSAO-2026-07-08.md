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
| **FAMBRAS — cobrar** | Lista **empresa → "certificada desde"** (destrava o último campo do cert) · logos acreditadoras em **alta resolução** · de/para dos **2 certs sem categoria** + **66 sem cycle** · lista de e-mails dos analistas · prints de novos testes. |
| **Renato — conduzir** | **Normalização de cadastro** (grupos/empresas/plantas: cidade, CNPJ, duplicatas Rising, backfill cidade/UF, CNPJ→Receita) → **pré-requisito do L2**. |
| **Eu — sessão dedicada** | **F1** múltiplos por PRODUTO (DSM ~130 certs; checkbox de quais produtos por cert, inline sem persistir) · **F2** draft→aprovar→travar (+ edição c/ justificativa) · **F3** nº = nº do CONTRATO · **L2** CNPJ/endereço overflow no header 7.7.2 (pós-normalização) · opcional: "AND antes do último" produto. |
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

## PROMPT PARA A PRÓXIMA SESSÃO
```
Contexto: GC (halalsphere) — continuação da sessão 07-08/jul (emissão manual + PDF 7.7.2).
Leia primeiro: halalsphere-docs/PLANNING/HANDOFF-SESSAO-2026-07-08.md (+ memória
project_emissao_manual_cert_spec_2026-07-06 carrega no início).

ESTADO: tudo do handoff §1 está FEITO e PUSHADO em release; J1b commitado; modo-teste
Imprimir LIGADO. NÃO re-validar nem refazer.

Ordem natural: (1) Renato conduz a NORMALIZAÇÃO DE CADASTRO (grupos/empresas/plantas) —
isso destrava o L2 (CNPJ/endereço overflow no header 7.7.2) e o pré-preenchimento do
"certified since"; (2) em paralelo eu ataco F1 = múltiplos por PRODUTO (DSM/IFF ~130 certs:
checkbox de quais produtos vão em cada cert, inline, sem persistir — proposta já aprovada
na reunião 07/jul 16h, Lina quer ver um exemplo).

Comece confirmando que leu o handoff e me pergunte por onde começar (normalização×F1) e se
já validei a Corbion em prod. Regras: release=deploy (pedir OK a cada push); não subir dev
server nem mexer .env.local; renderer NÃO precisa API Gateway, rota nova SIM; harness de PDF
= scripts/gen-*.ts com nome de arquivo novo.
```
