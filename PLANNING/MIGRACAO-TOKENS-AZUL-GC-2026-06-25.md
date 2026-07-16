# Migração de identidade visual GC: Verde → Azul EcoHalal

> **Data:** 2026-06-25 · **Repo alvo:** `halalsphere-frontend` (GC — Gestão de Certificações)
> **Autor do levantamento:** sessão Claude Code · **Referência:** migração já concluída no `sih-frontend`
> **Marca canônica:** azul EcoHalal `#118add` (primário) / `#0556a1` (profundo). Verde apenas como
> acento semântico (success). Ver regra de marca em memória `project_brand_ecohalal_azul`.

---

## 1. Objetivo

Alinhar o GC à identidade visual azul da EcoHalal, replicando o que já foi feito no SIH:
trocar os **tokens de marca** (hoje verde) por azul e converter os **verdes de marca
hardcoded** em azul — **preservando o verde semântico de success** (status aprovado/ativo/
concluído, checkmarks, toasts de sucesso).

Não altera lógica, rotas, dados ou comportamento — é exclusivamente camada visual.

---

## 2. Situação atual (levantamento 25/jun)

### 2.1 Tokens de marca — `src/index.css`
O tema **`:root` (light) é verde**; o tema **`.dark` já é azul**. Isso de-risca a migração:
o destino dos tokens light **já existe pronto no dark** — basta portar os hues e ajustar
lightness/chroma para fundo claro.

| Token | Valor atual (verde) | Destino (referência `.dark`) |
|---|---|---|
| `--primary` | `oklch(0.5425 0.1383 137.28)` | hue ~239 (azul) |
| `--secondary` | `oklch(0.5425 0.1383 137.28)` | hue ~239 |
| `--chart-1..5` | hues 134–138 | hues 239–245 (copiar do dark) |
| `--sidebar` + 7 derivados | hue 145 | hue ~239–264 |
| `--brand-gradient` | `152deg, #0084c0 → #448127` | trocar stop verde `#448127` por azul |
| `--foreground` / `*-foreground` | hue 128–131 (tinta levemente esverdeada) | neutralizar (opcional) |
| `--success` / `--success-foreground` | hue 152 (verde) | **MANTER** (semântico) |
| `theme-color` (`index.html`) | `#0A6847` | `#0556a1` |

> **Efeito multiplicador:** ~**491 usos** de classes de token (`bg-primary`, `text-primary`,
> `bg-sidebar`, `text-chart-*`) em 107 arquivos **migram automaticamente** ao flipar os tokens.

### 2.2 Verdes hardcoded (classes utilitárias Tailwind)
- **617 ocorrências em 110 arquivos** (`text/bg/border/ring/from/to-green|emerald|teal-NNN`).
- Famílias: **495 emerald · 449 green · 9 teal** (contagem por classe = 953).
- Shades dominantes: 500 (315), 600 (248), 700 (129), 100 (89), 800 (65).
- **67 ocorrências / 49 arquivos** são o par clássico de badge semântico
  (`bg-green-100 … text-green-800`) → **success → mantém verde**.

### 2.3 Hexes verdes fixos
- `src/content/manual/*` — **44 ocorrências / 11 arquivos** (mockups do manual em JSX).
- `index.html` `theme-color` + stop verde do `--brand-gradient`.
- Fora isso, **não há verde em SVG/CSS de componente** — o estilo é todo Tailwind + tokens.

### 2.4 Calibração contra o SIH (pós-migração)
- SIH terminou com **0 tokens verdes** no `index.css` e apenas **55** classes verdes residuais
  (success semântico, 4 badges `green-100/800`).
- **GC tem ~10× o resíduo do SIH** (617 vs 55) — não por dívida, mas por tamanho (8+ dashboards:
  comercial, jurídico, qualidade, auditor, analista, admin, empresa, certificação).
- **Mesma receita, escala maior.**

---

## 3. Decisão de escopo

**Success/aprovado/ativo/concluído permanece VERDE (semântico).**
- Alinhado ao que o SIH fez e à regra de marca ("verde só como acento").
- Verde = sucesso é convenção universal; trocar por azul piora a leitura de status e incha o esforço.
- **Converter para azul apenas os verdes de *marca*** (acento primário, headers, cards
  selecionados, rings de foco, gradientes, ícones de destaque) — não os de *status*.

Revisável: se depois quisermos full-azul (zero verde), reabrir a Fase 2 com nova cor semântica.

---

## 4. Plano de execução (3 fases)

### Fase 1 — Flip dos tokens · ~0,5 dia · **alto impacto / baixo custo**
`src/index.css` (`:root`) + `index.html`:
1. `--primary`, `--secondary` → azul (hue ~239).
2. `--chart-1..5` → azul (portar do `.dark`).
3. `--sidebar*` (8 tokens) → azul.
4. `--brand-gradient` → trocar `#448127` por stop azul.
5. `--foreground` / `*-foreground` → neutralizar tinta verde (opcional, baixo risco).
6. `theme-color` no `index.html` → `#0556a1`.
7. **Não tocar** `--success*`.
→ Vira ~491 usos de token de uma vez. QA visual nas telas-âncora.

### Fase 2 — Triagem dos hardcoded · ~1,5–2 dias · **o grosso**
110 arquivos, decisão caso-a-caso:
- **brand-accent verde → azul** (alvo principal: `green-600/500`, `emerald-600/500`,
  gradientes, `ring-green`, cards selecionados).
- **success semântico → fica verde** (os ~67 pares de badge + checkmarks + toasts).
- Ritmo realista ~10–15 arquivos/h com QA visual incremental.

### Fase 3 — Hexes/manual + QA de regressão · ~0,5–1 dia
- `src/content/manual/*` (11 arquivos) — converter hexes de marca dos mockups.
- Varredura visual de regressão nos 8 papéis/dashboards.

**Total estimado: ~3–3,5 dias-dev** para o padrão SIH completo.
Atalho: só Fase 1 entrega ~80% do impacto visual em ~0,5 dia (bom ponto de validação de direção).

---

## 5. Workflow / deploy
- Branch `release` (push dispara CI/CD CodePipeline → reconciliar `release → develop` depois).
- `index.css` é mudança de tema puro: validar build (`tsc -b` + `vite build`) antes do push.
- QA visual obrigatório (sem teste automatizado de cor) — checar charts (Recharts lê `--chart-*`),
  sidebar, botões primários, estados de foco, badges de status.

## 6. Riscos
- **Recharts**: séries leem `--chart-*`; conferir contraste/legibilidade pós-azul.
- **Sidebar dark**: já é azul-escuro (hue 145→264 no dark) — garantir harmonia com o novo primário.
- **Falsos positivos na triagem**: não converter success por engano (custo de UX). Par
  `green-100/800` é o sinal de "não tocar".
- **`content/manual`**: são mockups ilustrativos; mudança cosmética, baixo risco funcional.

## 7. Aceite
- `index.css :root` sem hue verde (exceto `--success*`).
- Telas-âncora dos 8 papéis em azul, sem verde-marca remanescente.
- Status/badges de sucesso continuam verdes e legíveis.
- Build limpo; deploy via `release`.
