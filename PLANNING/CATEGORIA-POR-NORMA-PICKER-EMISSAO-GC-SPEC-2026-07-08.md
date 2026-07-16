# SPEC — Categoria por norma no picker de Emissão Manual (GC)

> **Data:** 2026-07-08 · **Sistema:** GC (Gestão de Certificações) — `halalsphere-backend` + `halalsphere-frontend`
> **Origem:** Reunião WhatsApp FAMBRAS 08/jul (Elaine + Soha Chabrawi).
> **Fonte oficial de regras:** `DT 7.1 REV 14` (REQ Gerais FAMBRAS Halal, alimentos industrializados e aditivos) —
> Tabela 1 = **GSO** (pp.7-8), Tabela 2 = **SMIIC** (pp.10-11).
> Arquivo: `C:\HalalSphere\Alinhamentos de validação\DT 7.1 - ... (REV 14) PT (1).pdf`
> **Status:** aguardando revisão do Renato. **NADA executado.**

---

## 1. Problema

Na tela de emissão manual (`/analista/emissao_manual_certificado`), o dropdown de categoria
mistura as taxonomias **GSO** e **SMIIC** numa lista única. Não é regra de exclusão — é que a
**taxonomia difere por norma**. O operador escolhe a categoria (Seção 2) **antes** da norma
(Seção 5), então no momento da escolha o sistema ainda não sabe qual norma filtrar.

Casos concretos (confirmados no DT 7.1 Rev 14):

| Estabelecimento | GSO (Tabela 1) | SMIIC (Tabela 2) |
|---|---|---|
| Frigorífico | **C1 + C5** (abate = categoria à parte) | **só C1** (C1 = "Abate Halal *e* Processamento") |
| Cosmético / têxtil / couro | dentro de **K** (não há grupo L) | **L1 / L2 / L3** (grupo L próprio) |
| Serviços | **H** único | **H1 / H2 / H3** |

> Notação: o DT usa arábico (C1, C5); nosso sistema usa romano (CI, CV). Mapeiam 1:1 (CV = C5).

---

## 2. Achados do cruzamento (nosso modelo × DT 7.1 Rev 14)

### 2.1 O que JÁ está correto (sem ação)
- `IndustrialCategory` (`prisma/schema.prisma` ~L1683) já tem `gsoCode`/`smiicCode`/`gsoName`/`smiicName`/`applicableGso`/`applicableSmiic`.
- Grupo **L** com `applicableGso=false` (cosmético/têxtil/couro só-SMIIC) ✓
- `CI.smiicName` = "Abate Halal e Processamento de produtos perecíveis de origem animal" (idêntico ao DT) ✓
- `GSO_TO_SMIIC_CODE_MAP = { CV: 'CI' }` em `category-display-map.ts` ✓
- Backend `getAllGroupsWithRelations` usa `include` → já devolve todas as flags ao front ✓

> ⚠️ **Correção de premissa (Soha, 08/jul 08:57 — "no certificado saiu com as outras categorias"):**
> `getCategoryDisplay(code, standard)` **relabela** corretamente os códigos que recebe (CV→CI etc.),
> mas **NÃO filtra** categorias que não pertencem à norma. Logo, se o operador seleciona no picker
> uma categoria inválida para a norma (porque a lista não filtra), ela **é impressa no certificado**.
> O bug, portanto, chega ao PDF — não é só cosmético de tela. **Remediação de certs já emitidos: não
> se aplica** — GC está em teste/pré-go-live (base de prod zerada em 28/mai; go-live FAMBRAS ago/2026),
> os certificados existentes são de teste. Basta o fix daqui pra frente.

### 2.2 Correção real (defeito)
- **`CV.applicableSmiic` está `true`; deve ser `false`.** O DT 7.1 Tabela 2 (SMIIC) **não tem C5** —
  o abate está embutido no C1. Enquanto `true`, o CV aparece indevidamente no picker quando a
  norma é SMIIC. Ref: `prisma/scripts/seed-industrial-categories.sql:61`.

### 2.3 Decidido pelo PO (08/jul)
- **L4 — "NA (Não aplicável nas demais categorias)":** **incluir no seed** (grupo L, só-SMIIC). → §4.2.
- **Notação arábica × romana:** **manter romana** (CI/CV). Certificados já emitidos usam romano; mapeia 1:1 com C1/C5. Não mexer.
- **Voluntária:** picker **mostra todas** as categorias (sem filtro). → §6.2.
- **Renumeração "ANTIGO"** (informativo): o DT documenta a consolidação (C2 ANTIGO D, J ANTIGO K, K ANTIGO L e N…).
  Já usamos o esquema novo (A-L). Só registrar caso apareça dado legado com código antigo.

---

## 3. Escopo da leva

1. **Fix de dado:** `CV.applicableSmiic = false` (§4).
2. **Incluir L4/LIV** ("NA") no grupo L, só-SMIIC (§4.2).
3. **Reordenar a tela:** **categoria + DT + norma no TOPO, fluxo contínuo** — norma/reconhecimento **antes** da categoria, e a **seleção de DT sobe** do "Ajustes avançados" (Seção 9) pra junto da categoria (§5). *Origem: Soha 08/jul 11h — "aparecer junto na hora que seleciona a categoria, amarra na hora, sem ficar indo e voltando".*
4. **Picker norma-consciente:** filtrar por norma + rotular com o nome da norma (§6).
5. **Regra de coerência categoria/planta → tipo** (§7-bis): planta de abate/frigorífico → **habilitação** (FM 7.7.1); processamento → **único** (FM 7.7.2). Resolve o **Ponto 2** (JBS AVES saiu "industrial" com CI selecionado; Renato 08/jul: *"regra que estava em aberto"*). Guard-rail/aviso quando categoria e planta divergem.
6. **Parte 2 — Nomenclatura da categoria por norma** (§10): `getCategoryDisplay` resolve pela **norma real** (SMIIC só Turquia/OIC; resto GSO; mapa parametrizável).

Fora de escopo: notação arábica (manter romana); edição do texto da DT (fase 2); selos e PDF-protegido (trilha render, ver handoff §6).

---

## 4. Mudança 1 — Fix de dado (`CV.applicableSmiic = false`)

**Regra do projeto:** DDL/ref-data via migration idempotente; carga de dados de prod via SQL para o
Renato aplicar no DBeaver (ver `feedback_schema_migration_data_dbeaver`).

Migration aditiva idempotente (nome mapeado da tabela = `industrial_categories`):

```sql
-- Alinha CV (abate) ao DT 7.1 Rev 14: no SMIIC não há C5, abate está no C1.
UPDATE industrial_categories
   SET applicable_smiic = false, updated_at = NOW()
 WHERE code = 'CV' AND applicable_smiic = true;
```

Atualizar também o seed base (`seed-industrial-categories.sql:61`) para `applicable_smiic=false`,
mantendo consistência para ambientes novos.

> **Auditoria de certificados já emitidos: fora de escopo** — estamos em teste/pré-go-live, os
> certificados existentes não são reais. Sem remediação retroativa; o fix vale daqui pra frente.

### 4.2 Incluir L4/LIV ("NA — Não aplicável nas demais categorias")

O DT 7.1 Tabela 2 (SMIIC) tem **L4 — NA** no grupo L, ausente no nosso seed. Adicionar como `LIV`
(romano, coerente com LI/LII/LIII), só-SMIIC:

```sql
INSERT INTO industrial_categories
  (id, group_id, code, name, name_en, description, display_order, is_active,
   gso_code, smiic_code, gso_name, smiic_name, gso_audit_mode, smiic_audit_mode,
   applicable_gso, applicable_smiic, created_at, updated_at)
SELECT uuid_generate_v4(), g.id, 'LIV',
       'NA (não aplicável nas demais categorias)', 'NA (not applicable to other categories)',
       'Categoria residual SMIIC 02 para itens não enquadrados nas demais.',
       4, true, NULL, 'L4', NULL, 'NA (não aplicável nas demais categorias)',
       'REMOTO', 'IN_LOCO', false, true, NOW(), NOW()
  FROM industrial_groups g WHERE g.code = 'L'
  ON CONFLICT (code) DO NOTHING;
```

E adicionar `LIV` ao `SMIIC_DISPLAY_MAP` em `category-display-map.ts`
(ex.: `LIV: 'LIV - NA (não aplicável nas demais categorias)'`). GSO não recebe L4 (grupo L não existe no GSO).

---

## 5. Mudança 2 — Reordenar (norma antes da categoria)

Hoje as seções são: 1 Grupo/planta → **2 Categoria** → 3 Tipo → 4 Identificação → **5 Normas e mercados**.

**Alteração:** promover **apenas o seletor de normas elegíveis** (`applicableStandards` /
`ELIGIBLE_STANDARDS`, hoje dentro da Seção 5) para uma nova seção **antes da Categoria**.

- Manter na Seção 5: mercados e o painel de **DTs derivadas** (`derivedDts`, `ManualCertificateEmission.tsx:471`)
  — este depende das categorias já escolhidas, então **não** pode subir.
- O `derivedStandard` (`deriveStandard(form.applicableStandards)`) passa a estar disponível quando o
  picker de categoria renderiza.

Nova ordem: 1 Grupo/planta → **2 Norma/Reconhecimento** → 3 Categoria → 4 Tipo → 5 Identificação → 6 Mercados/DTs.

> O encadeamento categoria → sugestão de tipo (`onCategoriesChange`, comentário em L585) continua
> intacto; só ganha o filtro por norma a montante.

---

## 6. Mudança 3 — Picker norma-consciente

### 6.1 Expor as flags no `allCategories`
`ManualCertificateEmission.tsx:433` monta hoje só `{ id, code, label }`. Incluir as flags e nomes por norma:

```ts
flat.push({
  id: c.id, code: c.code,
  name: c.name,
  gsoCode: c.gsoCode, smiicCode: c.smiicCode,
  gsoName: c.gsoName, smiicName: c.smiicName,
  applicableGso: c.applicableGso ?? true,
  applicableSmiic: c.applicableSmiic ?? true,
});
```

### 6.2 Filtrar + rotular por `derivedStandard`

```ts
// derivedStandard: 'GSO_2055_2' | 'SMIIC_02' | 'BOTH' | 'VOLUNTARY'
function visibleCategories(all, std) {
  return all
    .filter((c) => {
      if (std === 'GSO_2055_2') return c.applicableGso !== false;
      if (std === 'SMIIC_02')   return c.applicableSmiic !== false;
      if (std === 'BOTH')       return c.applicableGso !== false || c.applicableSmiic !== false;
      return true; // VOLUNTARY → mostra todas (decisão PO 08/jul)
    })
    .map((c) => ({ id: c.id, label: labelFor(c, std) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function labelFor(c, std) {
  if (std === 'SMIIC_02') return `${c.smiicCode || c.code} — ${c.smiicName || c.name}`;
  if (std === 'GSO_2055_2') return `${c.gsoCode || c.code} — ${c.gsoName || c.name}`;
  return `${c.code} — ${c.name}`; // BOTH/VOLUNTARY: nome interno (ou usar getCategoryDisplay p/ mesclado)
}
```

Passar `visibleCategories(allCategories, derivedStandard)` ao `CategoryPicker` (`all=`).

### 6.3 Poda de seleção ao trocar a norma
Se o operador voltar e mudar a norma, remover de `form.industrialCategoryIds` as categorias que
deixaram de ser válidas, com aviso não-bloqueante (ex.: "CV removido — não existe no SMIIC").
Implementar no handler de `toggleApplicableStandard` (`L598`).

### 6.4 Estado inicial
Enquanto nenhuma norma estiver marcada, o picker fica desabilitado com placeholder
"Selecione a norma primeiro". (`applicableStandards` default hoje é `['GSO']` — manter, então o
picker já abre filtrado por GSO.)

---

## 7. Testes / validação

- **Frigorífico GSO:** aparecem CI e CV. **Frigorífico SMIIC:** aparece só CI (CV some). **BOTH:** CI + CV.
- **Cosmético GSO:** aparece K (não LI). **Cosmético SMIIC:** aparece LI (grupo L). **BOTH:** ambos visíveis.
- Trocar norma com categoria já selecionada → categoria inválida é podada com aviso.
- Rótulo reflete o nome da norma escolhida (`gsoName`/`smiicName`).
- PDF de saída inalterado (`getCategoryDisplay` já correto).
- `tsc -b` limpo (front CI roda `tsc -b`, ver `feedback_tsc_b_vs_noemit`).

---

## 8. Decisões de PO — RESOLVIDAS (08/jul)

1. **VOLUNTARY:** ✅ **mostrar todas** as categorias (sem filtro). → §6.2.
2. **L4 (NA):** ✅ **incluir no seed** (como LIV, só-SMIIC). → §4.2.
3. **Notação arábica (C1/C5):** ✅ **manter romana** (CI/CV). Não mexer no display.

Nenhuma decisão de PO pendente — spec pronta para implementação mediante autorização do Renato.

---

## 10. PARTE 2 — Nomenclatura da categoria por norma no PDF (NOVO — Soha 08/jul 09:12)

> **Descoberto durante a revisão.** É um **segundo** problema, do lado da SAÍDA (PDF), distinto do
> picker (entrada). Deve entrar na **mesma leva** — não subir metade.

### 10.1 Evidência (Soha)
Certificados JBS AVES (SIF 2032, Montenegro-RS): a **mesma norma** (Malásia/MS 1500) às vezes sai
com o nome da categoria em **GSO**, às vezes em **SMIIC**; e houve **norma GSO saindo com nome SMIIC**.
Palavras dela: *"tem vezes que a norma da malásia sai com a categoria segundo smiic, tem vezes que
sai com a categoria do gso"* / *"aqui saiu a categoria da smiic para a norma gso"*.

### 10.2 Causa-raiz (confirmada no código)
`certificate-pdf.service.ts:618` → `const standard = certification.standard || null;` e
`:680` → `getCategoryDisplay(cat.code, standard)`: o PDF rotula **todas** as categorias com **um
único** `standard`, que é o valor **colapsado** por `deriveStandard` (GSO / SMIIC / BOTH / VOLUNTARY).
Esse colapso **descarta a norma real** (MS, BPJPH, MUIS, UAE…). Logo a nomenclatura vira efeito
colateral de *quais outras normas* foram marcadas, não uma regra por norma:

- Malásia sozinha → `VOLUNTARY` → ramo GSO → **nome GSO**.
- Malásia + OIC → `SMIIC`/`BOTH` → **nome SMIIC**.
- GSO + OIC → `BOTH` → **nome SMIIC vaza na norma GSO**.

`getCategoryDisplay` (`category-display-map.ts:82`): ramo `SMIIC_02` usa SMIIC map; `BOTH` mescla;
**todo o resto (GSO, VOLUNTARY, null) cai no GSO map** — daí o comportamento acima.

### 10.3 Mapa norma/mercado → taxonomia (DERIVADO do FM 4.1.X REV 03)

O seed `CertificationStandardByMarket` (migration `20260518120000_add_certification_standard_by_market`,
FM 4.1.X entregue pela Soha 15/mai) já mapeia **mercado → normas**. Daí deriva-se a taxonomia da
categoria em ~85% dos casos:

**REGRA FINAL — CONFIRMADA FAMBRAS 08/jul (Elaine: "usa sempre GSO"):**
> **Taxonomia SMIIC apenas para OIC/SMIIC (Turquia). TODO o resto → GSO.**

| Mercado (FM 4.1.X) | Norma(s) | Taxonomia |
|---|---|---|
| Mercado Interno (BR) | UAE.S 2055 | **GSO** |
| Arábia Saudita | GSO 2055 | **GSO** |
| Emirados (UAE) | UAE.S 2055 | **GSO** |
| Demais Golfo (BH/OM/QA/KW/YE) | GSO 2055 | **GSO** |
| Demais Américas/Europa/África/Ásia/Oceania | UAE.S 2055 | **GSO** |
| **Malásia** | MS 1500/2009-2019 | **GSO** ✅ |
| **Indonésia** | Law 33 / BPJPH / SNI | **GSO** ✅ |
| **Singapura** | MUIS-HC-S001 | **GSO** ✅ |
| Turquia | OIC/SMIIC 01 | **SMIIC** |

> **Contexto FAMBRAS (Soha):** o SGQ deles foi desenhado sobre o GSO, e as categorias GSO são mais
> "completas" que as nacionais (a Malásia define só alimentos). A Soha sinalizou "verificar
> internamente" o uso de GSO p/ Malásia/Indonésia — **revisível no futuro, não bloqueia**; hoje é GSO.
> **Design:** manter o mapa **parametrizável** (dado, não `if norm===SMIIC` hard-coded), pra FAMBRAS
> reclassificar um mercado sem tocar em código.

### 10.4 Design do fix (saída/PDF)
- **Lar da regra:** estender `CertificationStandardByMarket` (ou um mapa norma→taxonomia derivado dele)
  com o eixo de taxonomia. Alternativa: resolver a taxonomia em runtime pela norma via a regra derivada
  acima + os 3 valores confirmados.
- **Refatorar** `certificate-pdf.service.ts:680`: `getCategoryDisplay(cat.code, standard)` passa a
  receber a **taxonomia resolvida pela norma real do certificado** (via `resolveFambrasMarket` +
  o mapa), não o `certification.standard` colapsado (`:618`).
- Um certificado no modo `multiple` = 1 norma-grupo por PDF, então a taxonomia é única por PDF.

### 10.5 Pendências Parte 2
- [x] Levantar o que `CertificationStandardByMarket` cobre → **mercado→normas já seedado** (FM 4.1.X REV 03).
- [x] Montar proposta de mapa norma→taxonomia → **§10.3**.
- [x] FAMBRAS confirmar Malásia / Indonésia / Singapura → **todos GSO** (Elaine 08/jul). **DESBLOQUEADO.**
- [ ] Refatorar `getCategoryDisplay` para usar a taxonomia da norma real por certificado (SMIIC só Turquia/OIC).

---

## 9. Deploy (checklist GC)

- Migration aditiva idempotente aplicada no banco prod (ver `feedback_migrations_deploy`).
- Dado CV corrigido via SQL no DBeaver após verificação §4.
- **API Gateway:** rota é `GET` de leitura já existente (`getAllGroupsWithRelations`) — **não** há rota
  nova; sem necessidade de regenerar. (Se surgir rota nova, regenerar no MESMO commit —
  `feedback_gc_apigateway_regen_obrigatorio`.)
- Backend: **sem alteração** (include já devolve as flags).
- Deploy por merge na branch `release` (`feedback_release_branch_workflow`); reconciliar release→development.
- Autorização explícita do Renato antes de qualquer push/execução.
