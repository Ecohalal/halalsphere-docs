# SPEC — Emissão multi-certificado por norma (regras bovinos/aves) — Bloco A

> **Origem:** reunião FAMBRAS (controladoria de frigoríficos) — 14/jul/2026. Reclamações sobre
> **aplicação das normas** e a **tela de emissão de certificados**.
> **Natureza:** análise de **GAP (delta)** — a emissão multi-certificado **já existe**; aqui está
> o que falta alinhar. **Nada codado ainda.** Revisar antes de executar.
> **Fallback de normas já corrigido em código (não commitado — vai neste pacote):**
> `certificate-pdf.service.ts` (OIC/SMIIC 01/2019; GSO 993 só em abate).

---

## 1. O que JÁ existe (não rebuildar)

- **Front** ([ManualCertificateEmission.tsx]): `emissionMode: 'single' | 'multiple' | 'per_product'`;
  **`normGroups`** = grupos de normas, **1 certificado por grupo** (default já é
  `[['GSO'], ['UAE'], ['BPJPH','MUIS'], ['MS']]`); `productGroups` p/ split por produto.
- **Back** (`certificate.service.ts manualEmit`): consome `normGroups`/`productGroups` →
  **N certificados**, número base + **sufixo `.1/.2`**; mutuamente exclusivos.
- **Catálogo** `certification_standards_by_market` (banco): **CORRETO** — GSO 993 nas DTs de abate
  (7.2.1/7.2.2), `OIC/SMIIC 01/2019` p/ Turquia, sem `2055-2` em norma alguma. **Não alterar.**
- **Selos** por mercado (`seal-config.ts MARKET_VARIANT_CONFIGS`): `OIC_SMIIC → [OIC_SEAL]` (logo SMIIC
  já existe, `oic-seal.png`).

## 2. Regras da reunião — agrupamento de norma × número `.K.` (por ESPÉCIE)

**Bovinos**
| `.K.` | Normas | Template / Habilitação |
|---|---|---|
| `.1.` | GSO 2055-2 (Golfo) **+** UAE.S | mesmo template, mesma habilitação |
| `.2.` | BPJPH (Indonésia) **+** MUIS (Singapura) **+** MS (Malásia) | mesmo template, mesma habilitação |
| `.3.` | OIC/SMIIC (Turquia) | exclusivo |

**Aves**
| `.K.` | Normas | Template / Habilitação |
|---|---|---|
| `.1.` | UAE.S | exclusivo |
| `.2.` | GSO 2055-2 (Golfo) | exclusivo |
| `.3.` | BPJPH (Indonésia) **e/ou** MUIS (Singapura) | mesmo template, mesma habilitação |
| `.4.` | MS (Malásia) | exclusivo |
| `.5.` | OIC/SMIIC (Turquia) | exclusivo |

> Observações estruturais: **GSO+UAE.S** andam juntos em bovinos (`.1.`) mas **separados** em aves
> (`.1.`/`.2.`); **MS** agrupa com Indonésia/Singapura em bovinos (`.2.`) mas é **exclusivo** em aves
> (`.4.`). O agrupamento é **por espécie**.

**Exemplo Minerva 791** (bovinos; GSO+UAE.S+BPJPH; categorias CV abate + GI transporte) → **3 certs**:
`MIN.RMM.2603.1430.1.BRA` (Habilitação de Planta; GSO+UAE.S) · `...1430.2.BRA` (Habilitação; BPJPH) ·
`...1431.1.BRA` (Certificado Único; transporte). → **`####` muda por categoria/template; `.K.` por norma-grupo.**

## 3. GAP — o que falta (delta)

| # | Gap | Onde | Ação |
|---|---|---|---|
| G1 | **Agrupamento de norma não segue bovinos/aves** (default é fixo `[[GSO],[UAE],[BPJPH,MUIS],[MS]]`; regra correta depende da **espécie** e junta GSO+UAE em bovinos) | front (sugestão de grupos) + validação | derivar `normGroups` sugeridos a partir da **espécie da planta** + normas elegíveis |
| G2 | **#6/#10 — colapso de template** GSO+SMIIC→`GCC` no `deriveTemplateCode` (`if(hasGso) return 'GCC'` antes do OIC) → selo GAC (legenda `GSO 2055-2:2021`) e perde selo OIC/SMIIC | front `deriveTemplateCode` + selos por grupo | template/selos **por norma-grupo**; nunca misturar GSO e SMIIC no mesmo grupo (regra diz que são grupos distintos) |
| G3 | **Numeração `.K.`** — hoje sufixo `.1/.2` sequencial; a regra pede `.K.` = **índice fixo da norma-grupo por espécie** (bovinos 1-3, aves 1-5) | back (geração do número) | mapear norma-grupo→índice `.K.` por espécie (não sequencial) |
| G4 | **#5 — normas via fallback** (emissão não grava `marketScopes`) → não usa o catálogo | back manualEmit + front | gravar `marketScopes` (país×norma) OU garantir catálogo; fallback já corrigido como rede |
| G5 | **#4 BPJPH (Indonésia)** — confirmar texto por categoria (catálogo tem variações por DT) | dado (catálogo) | validar com FAMBRAS; catálogo parece correto |
| G6 | **#9 múltiplos mercados** — Seção 3 "Normas e mercados" — confirmar o que foi removido | front | reintroduzir seleção de mercados |
| G7 | **#8 SIF na seleção de planta** (UI) | front | mostrar SIF selecionado (independe do resto) |

## 4. Decisões PENDENTES (FAMBRAS) — bloqueiam parte do design

1. **`.K.` substitui ou coexiste** com a numeração atual (IT 4.2 / SEQQ)? Hoje o sufixo é sequencial
   `.1/.2`; a regra pede índice **fixo por norma-grupo/espécie**. Confirmar.
2. **Certificado Único** (categorias não-habilitação, ex.: transporte/ração) sai **um por norma-grupo**
   (como a Habilitação) ou **um só com todas as normas**? (3ª linha do Minerva ficou ambígua.)
3. **G1** — a sugestão automática de `normGroups` por espécie está **correta** conforme as tabelas da §2?
   (validar caso a caso: aves separa GSO/UAE; MS exclusivo em aves etc.)
4. **#4 BPJPH** — o texto do catálogo por DT está correto para todas as categorias?

## 5. Sequência de execução proposta (após decisões)
1. **G2** (colapso template/selos por grupo) + **G7** (SIF) — correções pontuais, alto valor, baixo risco.
2. **G1 + G3** (agrupamento por espécie + numeração `.K.`) — núcleo; depende das decisões 1 e 3.
3. **G4 + G6** (`marketScopes` + múltiplos mercados) — fecha #5/#9 e faz o catálogo ser a fonte.
4. **G5** (validar BPJPH) — dado.

## 5.1 Progresso (14/jul — decisões travadas: 1=coexiste, 2=um cert por norma-grupo, 3=confere, 4=BPJPH ok)

**Feito (não commitado — pacote único):**
- **G7 (#8)** — SIF da planta selecionada aparece abaixo do seletor. *(front)*
- **#5/#6 no caminho multi** — `normsLinesFromStandards` corrigido: `OIC/SMIIC 01/2019` (era "2", de organismo cert.) e GSO/UAE com **993 só em abate** (`isSlaughter` = categoria CV). *(back)*
- **G3 (`.K.`)** — `normGroupKIndex(isAves, group)`: índice **fixo por espécie+norma-grupo** (bovinos 1-3, aves 1-5) no split por norma; split por produto mantém sequencial. `isAves` = espécie da planta. *(back)*
- **Fallback** de normas (certs sem marketScopes) idem correção. *(back)*
- **G2/#6/#10 (colapso):** confirmado que no split por NORMA cada grupo já deriva template/selo próprio (`deriveTemplateCodeFromStandards`), então **não colapsa em modo multiple**. Resta forçar o uso do modo multiple (G1) e/ou corrigir a ordem no `deriveTemplateCode` do single.

**GAP NOVO descoberto — #3 multi-CATEGORIA (base `####` própria por categoria/template):**
O `manualEmit` hoje emite múltiplos **por norma** (mesmo base, `.K.` diferente) OU por produto — mas **NÃO por categoria com bases distintas**. O Minerva (Habilitação `1430` × Certificado Único `1431`) exige **um número-base próprio por categoria/template**. Isso é capacidade nova (não é só ajuste). **Precisa de sessão dedicada.**

**Pendente decisão:** certificado em modo **single** (1 norma) também carrega `.K.`? Hoje só o multi carrega. Confirmar com FAMBRAS.

## 6. Fora deste SPEC (Bloco C, já em curso)
`#1 rascunho` (já existe, localStorage) e `#2 draft→aprovação` (conversa com "edição de escopo Fase 1"
de 13/jul) — tratar no Bloco C.
