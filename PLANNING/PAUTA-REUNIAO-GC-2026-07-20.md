# Pauta — GC / Emissão de Certificados

**20/jul/2026** · Renato + André (+ Willian, Giovana)

---

## 1. Anunciar: entregue

- [ ] Os **4 pontos do André** estão fechados — busca por SIF · guard-rail de categorias · "Voluntária" → "Sem norma acreditada" · templates
- [ ] **Múltiplos mercados** na emissão manual: marcar os destinos agora resolve as normas pelo catálogo oficial (Indonésia lista 8 normas; Brasil sai só com a DT)
- [ ] PDF do certificado protegido — abre livre, bloqueia cópia

## 2. Decidir hoje — normas

- [ ] **ENAS:** marcar só UAE.S classifica como "sem norma acreditada", **mas o PDF imprime o selo ENAS**, que é acreditação. Qual dos dois está errado?
- [ ] **BPJPH / MUIS / MS derivam GSO?** O sistema já os trata como GSO em tudo, menos na derivação da norma. Se sim, "sem norma acreditada" quase desaparece
- [ ] **GSO + OIC juntos** → template GCC → sai **só o selo GAC**, sem o OIC. Confirmam?

## 3. Decidir — numeração (Lina)

- [ ] Nº do certificado = **nº do contrato**. Dois bloqueios reais:
  - a **emissão manual não tem contrato** (pula proposta→contrato) — o operador digita, ou passa a exigir contrato?
  - a Minerva usou **2 bases (1430 e 1431)** para 2 categorias — são 2 contratos? Ou 1 contrato com base por categoria?

## 4. Levantar — nome das plantas

- [ ] **788 das 820 plantas** do GC têm o nome idêntico ao da empresa
- [ ] **JBS: 45 plantas todas chamadas "JBS S/A"** · BRF: 12 "BRF S.A." · Seara: 12 · Minerva: 8 + 9
- [ ] Na emissão manual, o combobox mostra 45 linhas idênticas — **como escolhem hoje?**
- [ ] Proposta: repopular o nome com a unidade (`BRF S.A. - Dourados/MS`), que é o padrão já usado no SIH

## 5. Cobrar entregas

- [ ] **Textos oficiais EN por categoria** (só o "K" está confirmado)
- [ ] **Arquivo de escopo real** (Lina) — destrava o parser xlsx
- [ ] **Aprovar os itens de MP** na tela de review — sem isso a lista volta vazia
- [ ] Logos e assinatura em **alta resolução** · logo da Indonésia
- [ ] **Certificado real preenchido**, de referência (layout de datas EN/AR)
- [ ] Lista "certificada desde"

## 6. Se sobrar tempo

- [ ] Certificados **vencidos-mas-ativos** (caso Gelita)
- [ ] **3 SIFs duplicados**: 585 · 4699 · 2620
- [ ] De-para das **14 categorias** (N2b)

---

## Meu lado — em produção, esperando só validação

`.K.` bovino × aves · OIC/SMIIC 01/2019 · **993 só em abate** · busca por SIF · guard-rail CV+HII ·
**edição de escopo (F1)** · filtro de empresa em `/homologacao-mp` · e-mails migrados para o azul `#118add`.

**Gap conhecido do múltiplos mercados:** só os 12 países com mapeamento 1:1 verificado
(BR, SA, AE, BH, KW, OM, QA, YE, ID, MY, SG, TR). Os agrupamentos *"Demais países da <região>"*
ficaram de fora **de propósito** — exigem seletor de país completo, e chutar um país
"representante" gravaria dado errado.
