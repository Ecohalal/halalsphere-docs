# HANDOFF — Revisão da Emissão Manual de Certificado (GC)

> ⚠️ **HISTÓRICO — NÃO É FONTE DA VERDADE.** Este handoff descreve o momento em que foi escrito e **pode estar defasado** (vários afirmavam "feito/commitado" para código que o git desmentia). Para o estado atual, leia **`sih-docs/PLANNING/BACKLOG-ECOHALAL.md`**. Use este arquivo só para entender *por que* uma decisão foi tomada.

> **Data:** 2026-07-07 · Continuação da reunião FAMBRAS 06/jul.
> **Repos:** `halalsphere-frontend` + `halalsphere-backend` (branch **`release`** = deploy via CI/CD).
> **Specs:** `SPEC-EMISSAO-MANUAL-CERTIFICADO-2026-07-06.md`, `REFERENCIA-TEMPLATES-CERTIFICADO-2026-07-06.md`,
> `REGRAS-NORMAS-POR-DT-MERCADO-2026-07-06.md` (todos em `halalsphere-docs/PLANNING/`).

## 1. FEITO e PUSHADO em `release` (deploy disparado; NÃO validado em prod ainda — local do Renato defasado)

Commits (ordem cronológica):
- **back `ad33c309`** — layout FM 7.7.1 fidelidade v5 no `approval-renderer.ts` (⚠️ era dead code até o `f3eaad48`).
- **back `c319039e`** — J1a: `K` sai de HABILITATION_CATEGORIES; `detectFormCode` vira fallback.
- **front `d557c081`** — tela reordenada: Grupo→Planta (auto 1:1), Grupo→Categoria→Tipo, categoria sugere tipo (direção A), remove assinante + "Lote/Mercado interno".
- **front `126c2bf9` / back `b24dc072`** — país automático (Seção 6 read-only); numeração IT 4.2 (nº opcional; `manualEmit` gera quando vazio); datas relabel; busca digitável Grupo/Planta.
- **front `aa2b36d3` / back `eedd2c24`** — **D agrupamento de normas**: modo Único×Múltiplos + construtor de grupos + preset frigorífico; backend emite **N Certifications** (opção 2), norma/selo por grupo, número **base + `.1/.2`**; `manualEmit` retorna `{count, results[]}`; controller N PDFs; success view lista N.
- **front `5b3143fc` / back `ebf6e558`** — **E** (escopo por segmento: frigorífico FM 7.7.1 esconde código/embalagem + marca-por-produto; marcas no escopo) + **H** (clonar: campo "Clonar de nº" → `getByNumber` hidrata; `findOne`/`findByNumber` enriquecidos com groupId+categorias+scope — aditivo, **sem regen API GW**).
- **back `f3eaad48`** — **seletor FM 7.7.1 usa sempre `ApprovalRenderer`** (= layout v5 validado). Confirmado no harness PNG.

## 2. DECISÕES TRAVADAS (não re-litigar)
- **D7**: bioquímicos **K = FM 7.7.2** (não habilitação).
- **Q1**: tipo = escolha explícita do analista; default sugerido pela **categoria** (direção A, categoria→tipo); `src` FRIG/IND só valida/backfill no ETL.
- **Q2**: agrupamento de normas com **presets sugeridos, sem trava** (regra é do analista).
- **Q3**: só 2 layouts-base (7.7.1/7.7.2); Serviço/Hotel=DT 7.11/H, Transporte/Armazém=DT 7.8/G — tudo FM 7.7.2 + DT. Notas granel/álcool obtidas (texto no SPEC §2).
- **Q4**: **país** da planta vem do cadastro (auto); **reconhecimento** (mercados/normas) é volante, do analista, sem trava.
- **Catálogo de categorias GC JÁ está completo** (25 cats, CV incl. com `smiic_code='CI'`) — NÃO precisa migration. `n2b` comparava códigos-fonte FAMBRAS ≠ códigos GC.
- **Agrupamento = opção 2** (N Certifications, reusa pipeline PDF).
- **Layout 7.7.1 = ApprovalRenderer** (v5 validado); `ApprovalArabicRenderer` desativado p/ approval.
- **Assinante fixo** Dr. Mohamed Hussein El Zoghbi (não editável).
- Tipo **re-sugere** ao trocar categoria primária (confirmado).

## 3. PENDÊNCIAS (nenhuma bloqueia; ordem sugerida)
1. **⭐ PRÓXIMO PASSO = validar em prod** (Renato, pós-deploy): gerar **1 industrial + 1 frigorífico** (conferir N certs + numeração `base.1/.2` + selos/normas por grupo), testar **clone**, e confirmar 7.7.1 saindo como o v5.
2. **FM 7.7.2 "mal renderizado"** — precisa **evidência**: gerar um 7.7.2 em prod e trazer o PDF/print. Alvo = `CertificateArabicRenderer` (renderer VIVO do 7.7.2) + auditar cobertura de **DT 7.4–7.11** e categorias no `dt-code-map`/`category-display-map` (hoje foco em 7.1/7.2.x → provável causa). Regra: evidência antes de fix.
3. **ETL J1b-import** — mapear **códigos-fonte FAMBRAS→GC** (`C1/C2/C4/CVCV`→`CI/CIV/CV`… ver `scripts/etl-fam0017/n2b_depara_categorias_FAMBRAS.csv`) + garantir `sanitaryCode` nas plantas de abate. Escopo import/mirror, não a tela.
4. **Frigorífico + numeração por norma**: hoje o auto-número multi usa `insertNormaIndex` (base+`.i`). Se a FAMBRAS quiser o formato exato do `generateSlaughterhouseCertificateNumber` (norma antes do país), revisar.

## 4. Harness de validação de PDF (scratchpad da sessão)
`halalsphere-backend/scripts/gen-approval-sample.ts` (7.7.1) e `gen-approval-arabic-sample.ts`; render PNG via `pdf-to-img` (`render.mjs`, ESM). Rodar do dir do backend com `npx ts-node -r tsconfig-paths/register`. **Sempre nome de arquivo NOVO** a cada geração (cache de leitura). Não commitados (scratch).

## 5. Arquivos-chave
- Front tela: `halalsphere-frontend/src/pages/analyst/ManualCertificateEmission.tsx`.
- Back service: `halalsphere-backend/src/certificate/certificate.service.ts` (`manualEmit`, helpers deriveTemplateCode/deriveStandard/normsLines/insertNormaIndex, `findOne`/`findByNumber` enriquecidos).
- Back PDF: `certificate-pdf.service.ts` (`detectFormCode`, seletor de renderer §14), renderers em `certificate/pdf/`.
- Numeração: `fambras-numbering/fambras-numbering.service.ts` (`generateCertificateNumber`, `generateSlaughterhouseCertificateNumber`).
</content>
