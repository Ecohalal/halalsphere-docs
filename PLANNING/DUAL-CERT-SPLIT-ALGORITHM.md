# Dual-cert Split — algoritmo de emissão quando um pedido cobre mercados conflitantes

**Status:** ISSUE em aberto. Sem implementação. Pré-requisito da modelagem de `CertificationStandardByMarket`.
**Aberto em:** 2026-05-17
**Trigger:** análise da FM 4.1.X (REV 03) entregue por Soha Chabrawi em 2026-05-15.
**Relacionado:** [CRUZAMENTO-GSO-SMIIC.md](./CRUZAMENTO-GSO-SMIIC.md) (taxonomia GSO 2055-2 vs SMIIC 02), `FAMBRAS/FM-4.1.X-REV03-flattened.csv` (matriz DT×mercado×normas).

---

## 1. Problema

A FM 4.1.X define **uma norma (ou lista de normas) por par (DT, mercado)** — ver `FAMBRAS/FM 4.1.X - ANEXO 1 (REV 03) PT_EN_15.05.26.xlsx`.

Mas o sistema permite que **um certificado** liste **múltiplos mercados de destino** no mesmo `MarketScope`. Quando esses mercados ficam em normas conflitantes, o sistema precisa decidir: **um cert combinado** ou **N certs separados**?

A planilha não codifica essa regra. As pistas na coluna B da FM 4.1.X são apenas anotações descritivas da Soha:
- Arábia Saudita — *"não pode compartilhar"*
- Emirados Árabes — *"não pode compartilhar"*
- Demais países do Golfo — *"não pode compartilhar"*
- Indonésia — *"linha dedicada"*
- Malásia — *"linha dedicada"*
- Turquia — *"linha dedicada (auditoria mais tempo)"*
- Demais (Américas/Europa/África/Ásia/Oceania) — sem anotação

Essas são **regras de processo** (não pode compartilhar planta entre Arábia e Emirados, por exemplo), mas elas vazam para o documento: se Arábia "não pode compartilhar", o certificado para Arábia precisa ser separado.

## 2. Caso concreto que motivou o issue

Frigorífico de aves quer um cert que cubra:
- Arábia Saudita (GSO 993/2015)
- Turquia (OIC/SMIIC 01/2019)
- Demais Américas (UAE.S 2055-1/2015)

Esses três mercados pedem normas de famílias **diferentes e exclusivas** (GSO ≠ SMIIC ≠ UAE.S). Não dá pra listar as três no campo "standards" de um único PDF — o cert ficaria normativamente incoerente.

A memória `project_frigorifico_dual_cert_rule.md` registra que **GSO × SMIIC em abate mecânico exige certs separados**. Esta é a regra mais restritiva conhecida, mas não a única.

## 3. Decisões pendentes

### 3.1 Qual o nível de granularidade do split?

Opções (do mais restrito ao mais permissivo):

| Opção | Granularidade | Resultado |
|---|---|---|
| A | 1 cert por (DT × mercado) | Explosão de PDFs; máxima precisão; alinha 1:1 com a planilha |
| B | 1 cert por (DT × família de norma) | Famílias = {Golfo, Indonésia, Malásia, Turquia, Singapura, Mercado Interno, Demais sem-cochonilha, Demais com-cochonilha}. Agrupa mercados que compartilham norma |
| C | 1 cert por (DT × grupo de "compartilhabilidade") | Considera a anotação "não pode compartilhar" para forçar cert único, ignora detalhe da norma. Mais permissivo, exige catálogo de regras à parte |
| D | Cert único combinando todas as normas como lista | Status quo — não resolve o problema, fere a coerência normativa |

**Recomendação inicial:** **Opção B**. Agrupa por **família de norma** (a coluna "standard" da FM 4.1.X já é o particionador natural — dois mercados com a mesma norma ficam no mesmo cert), e usa as anotações "não pode compartilhar" como override (Arábia e EAU têm normas equivalentes mas a Soha disse que não pode compartilhar — então força split). Precisa confirmar com Lina/Soha.

### 3.2 Onde mora a regra de "não pode compartilhar"?

Não está na planilha. Precisa virar **tabela mestre** própria:

```prisma
model MarketSharingRule {
  id           String   @id @default(cuid())
  marketCode   String   @unique  // "SAUDI_ARABIA", "UAE", "GULF_OTHER", etc.
  canShareWith String[]          // lista de marketCode com quem PODE compartilhar cert
  reason       String?           // anotação livre ("regulamento BPJPH", etc.)
}
```

Ou: campo `isolated: boolean` em `CountryConfig` (já existe na Onda 1+ — ver memória `project_onda1plus_schema_completo`), mais simples.

### 3.3 O usuário escolhe o split ou o sistema decide?

Opções:

- **Sistema decide silenciosamente** — usuário pede cert para [Arábia, Turquia, EUA], recebe 3 PDFs. Risco: surpresa, sem auditoria.
- **Sistema sugere, usuário confirma** — wizard mostra "isso vai virar 3 certs separados, confirma?". Mais lento mas auditável.
- **Usuário escolhe os agrupamentos** — wizard mostra os mercados, usuário cria N "grupos de mercado" e cada grupo vira um cert. Mais flexível mas exige treinamento.

**Recomendação inicial:** **Sistema sugere + usuário confirma**, com possibilidade de override (juntar dois grupos manualmente se a auditoria validar).

### 3.4 Como nomear / numerar os certs filhos?

Hoje o número de certificado segue o padrão `<PLANTA>.<DT>.<AAAA>.<SEQ>.<REVISÃO>.<COUNTRY>` (ver memória `project_emissao_manual_certificado_18mai`). Quando há split:

- **Sufixo numérico por filho:** `.1`, `.2`, `.3` (já usado por Soha no exemplo de Jaguafrangos — `JGF.APS.2407.1560.1.BRA`). **Confirmar este padrão.**
- **Country code no próprio número:** o último segmento já carrega o país, então o número fica naturalmente único por cert filho.

**Decisão:** seguir convenção Soha (sufixo numérico + country code) **assim que tivermos pelo menos um exemplo dela com split real** — pedir um na próxima reunião.

## 4. Implicações no schema

Mínimo viável:

```prisma
model Certification {
  // ... campos existentes ...

  // NOVO: grupo de irmãos quando um pedido virou N certs
  splitGroupId  String?   // null = standalone; mesmo id = irmãos
  splitIndex    Int?      // 1, 2, 3... ordem dentro do grupo
}

model CountryConfig {
  // ... campos existentes (Onda 1+) ...

  // NOVO ou já existente — confirmar
  isolated      Boolean   @default(false)  // "não pode compartilhar cert"
}
```

E uma **tabela de auditoria** do split (quem decidiu, quando, qual regra disparou):

```prisma
model SplitDecision {
  id              String   @id @default(cuid())
  certificationId String
  ruleApplied     String   // "GSO_SMIIC_CONFLICT", "ISOLATED_MARKET", "USER_OVERRIDE"
  decidedBy       String   // userId ou "SYSTEM"
  decidedAt       DateTime @default(now())
  notes           String?
}
```

## 5. Próximos passos

1. **Reunião curta com Lina + Soha** para validar:
   - É correto inferir "não pode compartilhar" das anotações da coluna B?
   - Existem outros pares (mercado A, mercado B) que não podem ser combinados além dos 4 já anotados (Arábia / EAU / Golfo / cada um dos "dedicados")?
   - Confirmar padrão de numeração com sufixo (`.1`, `.2`) — pedir 2-3 exemplos reais de cert split feito hoje fora do sistema.
2. **Decidir granularidade** (recomendação: opção B + override por `isolated`).
3. **Implementar** após [emissão manual de certificado](../FAMBRAS/) (que é a bridge até go-live julho) — não antes.
4. **Backfill** dos 1023 certs FAMBRAS espelhados em prod (ver memória `project_estado_2026-05-14`): identificar quais foram emitidos com múltiplos mercados e precisariam ter sido split. Pode ser zero (FAMBRAS provavelmente já emite split fora do sistema).

## 6. Não-objetivos

- Este doc **não** cobre o mapeamento de taxonomia de categorias GSO 2055-2 vs SMIIC 02 — isso está em [CRUZAMENTO-GSO-SMIIC.md](./CRUZAMENTO-GSO-SMIIC.md).
- **Não** propõe alterar a planilha FM 4.1.X — ela é input, a regra de split é orquestração.
- **Não** cobre revogação / suspensão / extensão dos certs filhos (já tratados em PR 7.1 e na engine de certificação existente).
