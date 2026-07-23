# Edição de Escopo — Fase 2 (Trilha C) — REESCOPO 2026-07-23

> **STATUS: PROPOSTA — aguardando OK do Renato. Nada codado, zero hash.**
> Cumpre a pendência 🚩 do §4.2/Trilha C do mestre (`sih-docs/PLANNING/BACKLOG-ECOHALAL.md`):
> *"REESCOPAR ANTES DE INICIAR (16/jul)"* — market scopes fora, fronteira A/C por escrito.
> Base: handoff F1 (`EDICAO-ESCOPO-CERTIFICADO-FASE1-HANDOFF-2026-07-13`) + leitura do código em
> `release` (back `7ce654fd` · front `5ebe7dd4`, 23/jul).

---

## 0. Nomenclatura — desambiguar os dois "F2"

| Nome | O que é | Dono |
|---|---|---|
| **C-F2 (este doc)** — Fase 2 da Edição de Escopo | campos gerais da certificação viva (datas, norma, observações) + categorias M2M | **Trilha C** |
| **F2 draft→aprovar→travar** (§4.2/A) | workflow de aprovação de emissão + audit trail ISO 17065 | Trilha A (❓PO), toca A e C — **não é este pacote** |

C-F2 **não implementa** workflow de aprovação. Mas cada edição grava `CertificationHistory`
com diff `{campo: {from, to}}` (padrão F1) — exatamente o substrato que o draft→aprovar→travar
vai consumir quando existir. Compatível por construção, sem antecipar decisão de PO.

---

## 1. Descoberta central: o backend da F2 JÁ EXISTE (falta auditoria + UI)

Levantamento no código em `release` (23/jul):

| Superfície | Rota | Estado | Gap |
|---|---|---|---|
| Campos gerais da `Certification` (datas, norma, notas) | `PUT /certifications/:id` (`certification.controller.ts:208`, roles analista/gestor/admin) | `certification.service.ts:489` já atualiza `certificationType`, `standard`, `standardNotes`, `validFrom`, `validUntil` | **Só audita mudança de `status`** (`:530`). Nenhum diff por campo. |
| Campos gerais do escopo (descrição, capacidade, turnos, funcionários, APPCC…) | `PUT /certifications/:id/scope` (`certification-scope.controller.ts:73`) | `updateScope` (`certification-scope.service.ts:113`) cobre tudo | **Zero auditoria** (o padrão F1 `historyCreateArgs`+`diffChanges` vive no MESMO arquivo, mas só produtos/marcas usam). |
| Categorias M2M (`CertificationIndustrialCategory`) | `GET/POST/POST-batch/DELETE/PATCH-primary` em `/industrial-classification/certifications/:id/categories` (`industrial-classification.controller.ts:165-230`) | CRUD completo, com troca de primária | **Zero auditoria.** Campos legados da `Certification` (`industrialGroupId/CategoryId/SubcategoryId`) **não sincronizam** com a M2M. |
| Front | `certificationService.update()` e `industrial-classification.service.ts` (client) já existem | — | **Nenhuma UI chama** — não há tela de edição. |

**Consequência:** C-F2 = **auditoria transacional + UI + validações**. **Zero rota nova → zero
regen de API Gateway. Zero migration.** Os prefixos `/certifications` e `/industrial-classification`
já servem o front hoje.

---

## 2. FRONTEIRA A/C — por escrito (a resolver ANTES de codar; vira §2 do mestre com o OK)

### 2.1 Domínio de arquivos

**Fato novo que viabiliza fronteira por arquivo:** `manualEmit` vive em
`certificate.{service,controller}.ts` — módulo **`certificate/`**, declarado da Trilha A.
O módulo **`certification/`** é outro arquivo e hoje não pertence a trilha nenhuma
(o lote 23/jul o tocou sem domínio declarado — mesmo buraco do §2 que o `db_ecohalal_sih` tinha).

| Passa a ser **Trilha C** (adicionar ao §2 do mestre) | Segue **Trilha A** (inalterado) |
|---|---|
| back: `certification/certification.{service,controller}.ts` + `certification/dto/*` | back: `certificate/*` (inclui `manualEmit`), `certificate-pdf.service.ts`, `pdf/*`, `data/seal-config.ts`, `data/category-display-map.ts`, `data/standard-labels.ts` |
| back: `industrial-classification.{service,controller}.ts` (**só** os métodos `certifications/:id/categories`) | front: `ManualCertificateEmission.tsx`, `services/certificate.service.ts` |
| back: `certification-scope/*` (já era C) | |
| front: `CertificationDetails.tsx`, `CertificationList.tsx`, `ScopeEditor.tsx`, **novo** `CertificationGeneralEditor.tsx`, `services/certification.service.ts`, `services/industrial-classification.service.ts`, `types/certification.types.ts` | |

### 2.2 Contrato de interação (onde A e C se encostam)

1. **Emitir-do-escopo** (`ManualCertificateEmission.tsx` → `hydrateFromCertification`, arquivo da A)
   **lê** `GET /certifications/:id` (rota da C). Contrato: **C muda VALORES, nunca o SHAPE** da
   resposta. Precisou mudar shape (novo include, rename) → é mudança cross-trilha, coordenar
   antes. A recíproca: **A não escreve** em `Certification`/`CertificationScope` (a emissão manual
   cria `Certification` synthetic própria — isso é dela e segue dela).
2. **`MarketScope` (mercados de destino): 100% FORA da C-F2.** Não haverá UI de edição de destinos
   de certificação existente neste pacote. O `CertificationDetails` continua no máximo exibindo
   (read-only). Motivos: semântica de norma×mercado é o kernel (§5.22); o DTO `@IsIn` de 12 países
   e o gap "Demais países da região" são backlog da A (§4.2/A #9); e a hidratação da emissão já
   filtra destinos que a tela conhece. Se a FAMBRAS pedir "corrigir destinos do mirror", **abre
   item na Trilha A**, não aqui.
3. **Norma na C-F2 = DADO, não RESOLUÇÃO.** C edita o campo `Certification.standard`
   (enum: `GSO_2055_2 | SMIIC_02 | BOTH | VOLUNTARY`, labels fixos) + `standardNotes`
   (justificativa do analista). C **não toca** pipeline de resolução (catálogo FM 4.1.X,
   `deriveStandard`/fallback, snapshot, `standard-labels.ts`) — tudo kernel/A.
4. **Imutabilidade garante que C nunca vaza para PDF emitido:** com a Fatia 0 do kernel
   (`resolvedScopeSnapshot`, §5.22-e), certificado emitido renderiza **só do snapshot**. Editar
   datas/norma/categorias da certificação viva afeta **apenas** a tela, os KPIs e as **próximas**
   emissões (prefill). Reimpressão não muda. É a mesma razão pela qual a F1 ficou segura pós-Fatia 0.
5. **`applicableStandards` do escopo (DEPRECATED no schema, "usar MarketScope"):** a C-F2 **não
   expõe** na UI nem remove do DTO — remoção é limpeza da A quando migrar o front da emissão.
6. **Número do certificado e da certificação: TRAVADOS** (§5.3). `certificationNumber` fora do DTO
   e fora da UI. **Status também fora da UI da C-F2** — mudar status tem máquinas próprias
   (suspend/cancel/reactivate/recalculate) com regras PR 7.1; o modal não vira atalho para burlá-las.

---

## 3. Escopo da C-F2

### IN
1. **Datas de vigência** (`validFrom`/`validUntil`) — com sanidade de ano (2000–2100, padrão da
   trava `295d274f`) + aviso de vigência > 3 anos + **aviso explícito quando `validUntil` < hoje**
   ("esta certificação passará a constar como expirada" — o status derivado `effectiveStatus`
   vira `expirada` na hora, e os KPIs da lista mudam).
2. **Norma** (`standard`, 4 valores do enum) + **justificativa** (`standardNotes`).
3. **Observações/descrição do escopo** (`CertificationScope.description`) e demais campos gerais
   do escopo que a rota já cobre (capacidade produtiva, nº funcionários, turnos) — ❓ ver P3.
4. **Categorias industriais M2M**: adicionar, remover, trocar a primária — via rotas
   `industrial-classification` existentes. Respeitando unique `(certificationId, categoryId)`.
5. **Auditoria ISO 17065 em TUDO acima** (§5.17): `CertificationHistory` transacional com
   `metadata.changes = {campo: {from, to}}`, padrão F1. Ações novas:
   `certification_updated` · `scope_general_updated` · `industrial_category_added/removed/primary_changed`.
6. **Histórico visível** no rodapé do modal (filtro das ações novas + `scope_*`), como na F1.

### OUT (explícito)
- `MarketScope` / mercados de destino (Trilha A — §2.2.2 acima).
- Workflow draft→aprovar→travar (item da A, ❓PO).
- Número do certificado/certificação; status da certificação (máquinas próprias).
- Qualquer coisa de `Certificate` (emitido) — imutável, snapshot.
- Suspensão/cancelamento/reativação (fluxos prontos, fora do modal).
- `applicableStandards` (deprecated).
- Produtos/marcas — **já é a F1** (em prod, aguardando validação do roteiro de 5 passos).

---

## 4. Pacote proposto (2 fatias + roteiro)

### C-F2.1 — Backend: auditoria transacional (sem rota nova, sem migration)
- `certification.service.update()`: envolver em `$transaction` + gravar `certification_updated`
  com diff dos campos (certificationType, standard, standardNotes, validFrom, validUntil,
  analystId). Reaproveitar o padrão `diffChanges` da F1 (extrair helper comum ou replicar —
  decidir na implementação; ambos os arquivos são C).
- `certification-scope.service.updateScope()`: idem, ação `scope_general_updated`, com
  `performedBy` (controller já tem `req.user` disponível; hoje `updateScope` nem recebe).
- `industrial-classification.service` (métodos de certificação): auditoria nas 3 mutações +
  **sync dos campos legados** da `Certification` com a categoria primária (❓ P2).
- Specs jest no padrão F1 (mock com `$transaction` — lição do spec consertado em 23/jul).

### C-F2.2 — Front: editor de dados gerais
- **Novo** `src/components/certification/CertificationGeneralEditor.tsx` (modal, arquivo novo =
  zero colisão), aberto por botão **"Editar dados gerais"** no card "Informações da Certificação"
  do `CertificationDetails.tsx` (mesmo gate da F1: analista/gestor/admin).
- Seções: Vigência (2 date inputs + avisos) · Norma (select + textarea justificativa) ·
  Observações do escopo · Categorias (chips add/remove + rádio primária).
- Salvar por seção (padrão F1: cada ação chama o service e invalida queries) → o histórico
  no rodapé reflete na hora; `onChanged → refetch()` do detalhe.
- `tsc -b` limpo; sem tocar `ManualCertificateEmission.tsx`.

### C-F2.3 — Roteiro de validação (Renato, 6 passos)
1. Abrir certificação mirror → "Editar dados gerais" → mudar `validUntil` → conferir aviso +
   status derivado + KPI da lista.
2. Trocar norma + justificativa → conferir exibição no detalhe.
3. Adicionar categoria, trocar primária, remover → conferir chips e (❓P2) legados.
4. Editar observações do escopo.
5. Conferir o histórico (quem/quando/o quê, diff from→to) no modal e no timeline.
6. **Prova da fronteira:** "Emitir certificado" do detalhe → o form da emissão hidrata com os
   valores NOVOS · reimprimir um certificado JÁ emitido dessa certificação → **PDF idêntico**
   (snapshot intacto).

**Estimativa:** 1 sessão back + 1 sessão front (ou 1 sessão única apertada). Push em `release`
só com OK do Renato, como sempre.

---

## 5. Decisões pendentes do Renato (bloqueiam o início)

- **P1 — "Observações" é o quê?** Proposta: **ambos**, rotulados — "Justificativa da norma"
  (`standardNotes`) e "Descrição/observações do escopo" (`scope.description`).
- **P2 — Sync dos campos legados:** ao trocar a categoria **primária**, atualizar
  `industrialGroupId/CategoryId/SubcategoryId` da `Certification` para espelhar a primária?
  Proposta: **sim** (consumidores antigos — inclusive o fallback do prefill — leem os legados).
- **P3 — Capacidade/turnos/funcionários** entram no modal? O handoff F1 citava "escopo geral
  (capacidade/turnos)" na Fase 2. Proposta: **entram** (rota pronta, custo marginal), em seção
  própria.
- **P4 — Fronteira do §2.1** (certification/ + industrial-classification p/ C): OK para gravar
  no §2 do mestre?
- **P5 — VOLUNTARY no select de norma:** expor os 4 valores do enum como estão? (A decisão
  pendente da Soha — nacionais derivam GSO, §4.3-1 — muda *display/derivação*, não o enum;
  proposta: expor os 4.)

---

## 6. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Editar `validUntil` flipa status derivado em massa nos KPIs | Aviso explícito no modal; auditoria com diff; nada automático além do que `effectiveStatus` já faz hoje |
| Colisão com A (emissão/kernel em curso) | Fronteira §2.1 por arquivo; único ponto de contato = shape de `GET /certifications/:id` (contrato §2.2.1); `ManualCertificateEmission.tsx` intocado |
| Colisão com draft→aprovar→travar futuro | C-F2 só grava histórico (substrato); não cria estado de workflow |
| `dto.validFrom &&` não permite LIMPAR data | Comportamento mantido (limpar vigência não é caso de uso da correção de mirror); documentado |
| Padrão de senha/roles | Mesmo gate da F1 (analista/gestor/admin), rotas já protegidas |
