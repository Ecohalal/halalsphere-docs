# HANDOFF — Sessão 14/jul (reunião controladoria frigoríficos: normas + emissão de certificado)

> Branch `release` = deploy. **Ao retomar: NÃO re-validar/refazer o que está como FEITO.**
> Detalhe técnico e regras completas: `SPEC-EMISSAO-MULTI-CERT-NORMAS-GC-2026-07-14.md`.

## Contexto
Reunião FAMBRAS (controladoria de frigoríficos) com reclamações sobre **aplicação das normas** e a
**tela de emissão de certificados**. Regras recebidas: agrupamento de norma × número **`.K.`** por
**espécie** (bovinos 1-3, aves 1-5) — ver SPEC §2. Exemplo Minerva (2 categorias + 3 normas → 3 certs).

## Decisões travadas (não re-litigar)
1. **`.K.` coexiste** com a numeração IT 4.2 (é segmento adicional antes do `BRA`).
2. Certificado Único = **um cert por norma-grupo** (mesmo comportamento da Habilitação).
3. Agrupamento por espécie **confere** (tabelas bovinos/aves do SPEC).
4. **Single também leva `.K.`** (todos os certs carregam o índice da norma-grupo).
5. BPJPH (Indonésia): catálogo correto, sem mudança de dado.
6. **Cor** dos e-mails segue teal (decisão anterior, mantida).

## FEITO nesta sessão (typecheck OK; commitado no pacote "por norma")

### halalsphere-backend
- **Rótulos de norma** (`certificate.service.ts normsLinesFromStandards` + `certificate-pdf.service.ts` fallback):
  `OIC/SMIIC 01/2019` (era "OIC/SMIIC 2", de organismo certificador — bug #6); **GSO/UAE.S incluem 993 só em ABATE**
  (`isSlaughter` = categoria CV) — #5.
- **Numeração `.K.`** (`normGroupKIndex(isAves, group)`): índice **fixo por espécie+norma-grupo**, no split por
  **norma** e no **single**; split por **produto** segue sequencial (evita colisão). `isAves` = `plant.species`.

### halalsphere-frontend
- **#8 (G7):** SIF da planta selecionada aparece abaixo do seletor (`ManualCertificateEmission.tsx`).
- **G1:** "Sugerir grupos (por espécie)" — grupos conforme bovinos/aves + entra em **modo multiple**
  (cada norma-grupo deriva template/selo próprio → resolve o colapso #6/#10; SMIIC volta a usar o selo OIC).

### Descobertas que orientaram o escopo
- **Catálogo `certification_standards_by_market` está CORRETO** (993 nas DTs de abate 7.2.1/7.2.2; OIC/SMIIC 01/2019
  Turquia; **nenhum "2055-2" em norma**). A reclamação vinha do **fallback/colapso de template**, não do catálogo.
- **Emissão multi-certificado por NORMA já existia** (`emissionMode/normGroups` + `manualEmit` → N certs). O ajuste
  foi regra/label/numeração, não construção.

## PENDÊNCIAS → PRÓXIMO BLOCO (capacidades novas; Renato concordou em adiar)
- **#3 multi-CATEGORIA** — número-base `####` próprio por categoria/template (Minerva `1430` Habilitação × `1431`
  Certificado Único). Hoje o multi é por norma OU por produto, **base única**. Precisa de sessão dedicada.
- **#9 / G4 / G6 múltiplos mercados** — `marketScopes` **não existe** no form/DTO da emissão manual; é feature nova
  (seleção de mercados + persistir `marketScopes` → usar o catálogo em vez do fallback).
- **Bloco C:** #1 rascunho (já existe) e #2 draft→aprovação (conversa com "edição de escopo Fase 1" 13/jul).

## Validação recomendada (Renato)
Emitir um **teste** (ex.: bovinos GSO+UAE.S+BPJPH) e conferir os `.K.` (`.1.` Golfo, `.2.` BPJPH) e as normas no PDF.
