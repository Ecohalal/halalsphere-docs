# ADR — Aprovação da confecção do certificado (F2: rascunho → aprovar → travar)

- **Data:** 2026-07-24
- **Status:** **Aceita — em implementação (Fatia A, GO do Renato 24/jul).** Desenho travado; demanda FAMBRAS. Segregação de função = recomendação do Claude aceita (§4.4). Divisão→gestor resolvida (§8.1): aprovador via `User.specialtyArea`, área do cert via **novo `Plant.specialtyArea`** (cadastro da planta).
- **Sistema:** GC — Gestão de Certificações (`halalsphere-backend` + `halalsphere-frontend`)
- **Trilha (mestre §2):** A · Emissão / normas / certificado — **toca também a C** (edição/estado). Coordenar (não rodar em paralelo com edição de escopo no mesmo arquivo).
- **Fontes:** demanda FAMBRAS (Renato tem as respostas) + evidência de campo dos operacionais (Giovanna: *"campo de visualização antes da emissão oficial"*, 24/jul) + inventário do fluxo de emissão (varredura GC 24/jul).

> Decisão sobre **sistema acreditado (ISO 17065)**: introduz um controle de qualidade
> sobre o **documento** antes de ele valer, com segregação de função e trilha de auditoria.

---

## 1. Contexto — o problema

Hoje **a emissão é imediata e sem rede**:

- O `Certificate` **nasce `ativo`** (enum `CertificateStatus` = `ativo | suspenso | cancelado | expirado` — **não existe rascunho**). Em ~6 pontos de `certificate.service.ts` o status é gravado `ativo` direto na criação.
- A **emissão manual** (`issuanceMode = manual`) **pula o workflow inteiro**: cria uma `Certification` sintética já `ativa` + `Certificate` `ativo` numa única transação, sem passar por proposta → contrato → comitê. É a ponte de exceção até o ciclo completo.
- **Não há conferência do documento** entre "resolver o conteúdo" e "o certificado valer". Quem confecciona emite e pronto.

**O portão que já existe (Comitê) governa outra coisa.** O `CommitteeReview` (revisão técnica + religiosa 1/2 + aprovação RT) + `CommitteeDecision` (aprovar/reprovar/solicitar_info) aprovam a **CERTIFICAÇÃO** — o mérito de certificar aquela empresa/planta. Não olham a **peça** que sai.

**Evidência de campo:** os operacionais pediram, por conta própria, *"um campo de visualização antes da emissão oficial"* (Giovanna, 24/jul) — exatamente a metade "rascunho/preview" desta decisão.

**O "travar" já está construído.** A Fatia 0 do kernel de normas (`Certificate.resolvedScopeSnapshot`, write-once, first-render-freeze — ver ADR do kernel §5.22-e) já congela o conteúdo resolvido do certificado. Esta ADR **não reinventa o travamento**; adiciona o **rascunho → aprovar** na frente dele.

---

## 2. Decisão da FAMBRAS — as duas aprovações são ortogonais

> **Comitê aprova a CERTIFICAÇÃO** (o processo/mérito — *"pode certificar?"*).
> **F2 aprova a CONFECÇÃO do certificado** (o documento em si — *"o certificado ficou correto e pode sair?"*).

Um **não substitui nem contém** o outro. São momentos e objetos diferentes. Isso **elimina o risco de duplicação de aprovação** — não há dois "aprovar" concorrendo.

---

## 3. Regras travadas (respostas do Renato / FAMBRAS)

1. **Estado novo no `Certificate`:** `rascunho` (pendente de aprovação) **antes** de `ativo`. A emissão deixa de gravar `ativo` direto; passa a criar **rascunho**.
2. **Portão no nível do DOCUMENTO** (§2). Ortogonal ao Comitê.
3. **Quem aprova = o GESTOR DA ÁREA**, derivado da divisão/objeto do certificado:
   - **In Natura / frigorífico → André**
   - **Industrializados → Fuad**
4. **Incide em toda emissão — principalmente a MANUAL** (que hoje pula tudo). A emissão manual passa a criar rascunho, não `ativo`.
5. **Numeração: indicativa no rascunho, definitiva na aprovação.** O rascunho mostra um número **provisório** (pode mudar até a oficialização, porque a sequência é global — IT 7.10/`.K.`); o número **definitivo** é atribuído **na aprovação**. Assim: o operador vê o número provável e **rascunho reprovado não queima número** (sequência sem buracos entre os aprovados). Coerente com §5.3 (número travado só na oficialização, junto com o snapshot).
6. **Aprovar = oficializar + travar:** grava o `resolvedScopeSnapshot` (Fatia 0), atribui o número definitivo, status → `ativo`, QR válido.
7. **PDF do rascunho:** marca **"RASCUNHO"**, **sem QR válido**, **não conta como emitido**.
8. **Reprovar:** volta ao rascunho (editável) com **motivo registrado**; não gera certificado nem consome número.

## 4. Regra derivada — segregação de função (ISO 17065)

> **§4.4 — recomendação do Claude, aceita pelo Renato (24/jul).**

- **Padrão: aprovador ≠ quem confeccionou.** É o que dá sentido ao portão (segundo par de olhos).
- **Exceção permitida:** o gestor pode confeccionar **e** aprovar (equipes pequenas / ausência), **desde que a auto-aprovação fique EXPLICITAMENTE registrada** na auditoria (`CertificationHistory`).
- Não travamos o dia a dia; mantemos o rastro para a ISO 17065.

*(Substrato de auditoria já existe — `CertificationHistory` transacional da C-F2. F2 apenas grava as transições.)*

---

## 5. Impacto no workflow existente (o que muda)

| Área | Mudança | Custo |
|---|---|---|
| **`CertificateStatus`** | + valor `rascunho` | migration **aditiva** de enum |
| **Emissão (manual + workflow)** | cria `rascunho`, não `ativo` | os ~6 pontos que gravam `ativo` na criação passam pelo novo estado |
| **Máquina de status da Certificação** | `ativa` (= "certificado emitido") só **após** a aprovação do documento | ajustar `effectiveStatus()` / recalculate-status para contar rascunho como "ainda não emitido" |
| **Renderers / PDF** | estado rascunho: marca d'água + QR inválido | `pdf/*` |
| **Numeração** | `fambrasNumbering`: indicativo × definitivo (assign no approve) | lógica de reserva vs. atribuição |
| **Tela** | fila de "rascunhos a aprovar" para o gestor da área + preview | front novo |
| **Comitê** | **nada** — ortogonal (sem duplicação) | — |

**Não funde bounded contexts:** não mistura com o Comitê nem com a numeração; liga por **validação/estado**, não por fusão (mesma disciplina do kernel, §5.22-f).

---

## 6. Consequências

- **(+)** Controle ISO 17065 sobre o **documento**; segregação de função; audit trail completo das transições.
- **(+)** A **emissão manual** deixa de ser atalho sem rede — passa a ter conferência antes de valer (é onde a FAMBRAS mais quer o portão).
- **(+)** Entrega o **preview antes da emissão oficial** que os operacionais pediram (o valor real do antigo "caminho feliz #7", que **converge aqui** — ver mestre §4.2/A).
- **(−)** Um passo a mais no fluxo (rascunho → aprovar). **Mitigado:** é exatamente o que o campo pediu; e para o caso comum o gestor aprova em lote.
- **Dependência:** o sistema precisa saber **quem é "o gestor da área"** — mapeamento **divisão → gestor** (André/Fuad) no modelo de usuários.

---

## 7. Fatias de implementação (proposta — validar antes de codar)

- **Fatia A — núcleo:** enum `rascunho` (migration) · emissão **manual** cria rascunho · tela "rascunhos a aprovar" do gestor · **aprovar** = snapshot + número definitivo + `ativo` · **reprovar** com motivo · auditoria das transições · enforcement de segregação (§4).
- **Fatia B — documento:** PDF de rascunho (marca "RASCUNHO", sem QR válido) · numeração indicativa → definitiva.
- **Fatia C — cobertura total:** emissão via **workflow** também gated · derivação **divisão → gestor** · refino do enforcement.

*Cada fatia entra com testes; push em `release` só com OK do Renato; rota nova → regen API Gateway no mesmo commit.*

---

## 8. Decisões de desenho — divisão→gestor RESOLVIDA (24/jul, GO do Renato)

1. ✅ **Mapeamento divisão → gestor — RESOLVIDO.**
   - **Quem aprova = `User.specialtyArea`** (enum `SpecialtyArea = frigorifico | industrial | ambos`, **já existe** no `User`, comentário "SEGREGAÇÃO FRIGORÍFICO/INDUSTRIAL"). André = gestor `frigorifico`; Fuad = gestor `industrial`; `ambos` aprova as duas áreas. **Zero migration no User.**
   - **Área do CERTIFICADO vem do CADASTRO DA PLANTA, não da categoria** (decisão Renato: um frigorífico com armazenamento pode ter categoria ≠ CV). Como o `Plant` só tem `plantType` (funcional/ambíguo em `armazenamento`/`escritorio`), **cria-se `Plant.specialtyArea`** (reusa o enum; **nullable**) — migration aditiva + backfill + vira campo do cadastro. O cert lê `certification.plant.specialtyArea`.
   - **Backfill do `Plant.specialtyArea`:** `abatedouro`/`frigorifico` → `frigorifico` · `processamento`/`laticinio` → `industrial` · `armazenamento`/`escritorio`/`outro` → **NULL** (designação manual — o sistema não chuta).
   - **Gate:** aprovador elegível = `role` gestor/admin com `specialtyArea` = área da planta do cert (ou `ambos`), respeitando a segregação §4 (aprovador ≠ quem confeccionou).
   - ⚠️ **Toca a Trilha B:** `plants` é domínio B — o campo (migration/DDL) entra pela A, mas **backfill = SQL pro Renato** e **campo no cadastro = front B**; declarar no §2 antes de mexer.
2. **Reprovação:** volta pra rascunho **editável** (mesma peça); o motivo fica no `CertificationHistory`. *(travado)*
3. **Rascunho × edição de escopo (Trilha C):** pode editar o escopo com rascunho pendente — o rascunho re-resolve ao aprovar; só a aprovação congela. *(travado)*

---

> **Vira decisão travada no mestre** (`sih-docs/PLANNING/BACKLOG-ECOHALAL.md` §5) ao ser referenciada — candidato a **§5.23**. Enquanto não codado, o §4.2 do mestre aponta para cá como "em implementação".
