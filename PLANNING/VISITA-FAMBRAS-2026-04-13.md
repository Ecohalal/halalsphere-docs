# Visita Tecnica FAMBRAS — 13 a 16 de abril de 2026
## Relatorio para HalalSphere (Gestao de Certificacoes)

> Ecohalal x FAMBRAS Halal (FAMBRAS e socia da Ecohalal).
> Visita presencial de Renato Ribeiro (PJ contratado, PO).
> Relatorio reconstituido em 2026-05-03 a partir de debrief
> verbal — pode haver itens adicionais quando relatorio formal
> for redigido.

---

## 1. Contexto

| Dia | Data | Equipe FAMBRAS | Pontos focais |
|---|---|---|---|
| Segunda | 13/04 | Controladoria de frigorifico | Identificacao de melhorias (mais relevantes para SIH — vide relatorio especifico) |
| Terca | 14/04 | Industrializados (Lina) | Cadastro de produtos/ingredientes, fluxo de certificacao, exceções |
| Quarta | 15/04 | Industrializados (continuacao) | Inventario; ventilada possibilidade de visita a planta JBS em Lins |
| Quinta | 16/04 | Qualidade (Elaine) | Emissao manual de certificados, QR code de validacao, anexacao de documentos |

Documentos repassados por **Elaine (Qualidade)** e **Lina (Industrializados)** durante a semana — incorporar a base de
referencia para evolucao do produto.

---

## 2. Visao macro da FAMBRAS sobre o produto

A FAMBRAS espera que a Ecohalal entregue um sistema **muito
parecido com um ERP** — controle de toda a empresa em todo o
processo, abrangendo:

- Certificacao halal (nucleo atual do HalalSphere)
- Documentacao
- Logistica
- Componente financeiro

**Implicacao estrategica:** o escopo que a FAMBRAS-socia tem em
mente e maior que o escopo atual do HalalSphere v1. Qualquer
roadmap precisa endereçar essa expectativa explicitamente — ou
ajustando o escopo do HalalSphere, ou produtizando integracoes
com sistemas adjacentes (incluindo SysHalal e SIH), ou alinhando
com CEO+CTO Ecohalal sobre quem entrega cada parte.

---

## 3. Pedidos e necessidades levantados

### 3.1 Cadastro de produtos com ingredientes
- Necessidade de **levantamento de certificacao halal para
  ingredientes** que compoem produtos a serem certificados.
- Implica novo cadastro/modulo de Produtos com lista de
  ingredientes.
- Regra de negocio: ingrediente ja certificado pode ser citado
  em qualquer outro produto sem necessidade de re-certificacao.
- **Inferencia minha (Claude):** isso provavelmente exige
  modelagem `Produto` ↔ `Ingrediente` com vinculo a `Certificado`.
  Validar com PO.

### 3.2 Revisao do fluxo de certificacao (fase comercial)
- Hoje: nova empresa solicita certificacao → segue fluxo
  completo.
- Pedido: dentro da **fase comercial**, ter **analise previa de
  documentacao**.
- Operacionalmente: empresa preenche formulario mais
  superficial → analista comercial faz primeira analise
  documental antes de seguir adiante.
- Beneficio: filtro inicial reduz custo de processamento de
  solicitacoes inadequadas.

### 3.3 Excecoes que viram regras
- Observacao em campo: existem variacoes/nuances no fluxo de
  certificacao no contexto de frigorifico que, em busca de
  agilidade, geram **atalhos sistematicos** ("queimam fases").
- Risco de compliance: o que era excecao vira pratica de fato,
  potencialmente violando o PR 7.1.
- Acao: mapear essas excecoes, validar com FAMBRAS quais sao
  legitimas (e portanto deveriam estar formalizadas no fluxo)
  e quais sao informais (e deveriam ser sanadas, nao
  pavimentadas).

### 3.4 Emissao de certificados — hoje muito manual
- A equipe de Qualidade emite certificados de forma manual.
- Forte demanda por digitalizacao desse processo.
- **Cruzamento com SysHalal:** o SysHalal ja emite certificados
  (95k+ em prod) — vale validar se a digitalizacao demandada
  pela Qualidade FAMBRAS deve ir pelo SysHalal ou pelo
  HalalSphere, ou se e ponto de integracao entre os dois.

### 3.5 QR code de validacao de certificados — **PRAZO 20/05**
- **Compromisso assumido:** em ate 30 dias da visita (ate
  20/05/2026), entregar QR code de validacao para novos
  certificados emitidos.
- Funcionalidade: cada certificado emitido tem QR code que,
  ao ser escaneado, valida a autenticidade.
- Esse e um item com **deadline curto e visibilidade
  societaria** (FAMBRAS e socia da Ecohalal).
- **Acao:** decidir rapidamente se QR code sai pelo HalalSphere
  ou pelo SysHalal — depende de onde a emissao formal mora.

### 3.6 Anexacao de documentos nas fases do processo
- Pedido: cada fase do processo de gestao de certificacoes deve
  permitir anexacao de documentos.
- Hoje: provavelmente ha campos limitados — confirmar com
  modelagem atual.
- Implicacao: estrutura de armazenamento (S3) + UI de upload
  + auditoria/log de quem anexou o que e quando.

---

## 4. Pendencias e promessas

| Item | Origem | Prazo | Prioridade |
|---|---|---|---|
| **QR code de validacao para novos certificados** | Equipe Qualidade FAMBRAS, dia 16/04 | **20/05/2026** | 🔴 critica |
| Cadastro de produtos com ingredientes | Industrializados, dia 14/04 | nao definido | media-alta |
| Analise previa de documentacao na fase comercial | Industrializados, dia 14/04 | nao definido | media |
| Mapeamento de excecoes que viram regras | Controladoria + Industrializados | nao definido | media |
| Anexacao de documentos por fase | Qualidade | nao definido | media |
| Visao "ERP halal" — alinhamento de escopo | FAMBRAS direção (implicito) | a tratar com CEO+CTO Ecohalal | alta |

---

## 5. Decisoes estrategicas necessarias com CEO+CTO Ecohalal

Renato e PO operacional; estes itens precisam de anuencia
estrategica antes de execucao:

1. **Escopo "ERP halal":** o HalalSphere expande para esse
   escopo? Ou Ecohalal mantem escopo de certificacao e produz
   integracoes com SysHalal/SIH/sistema externo?
2. **QR code: HalalSphere ou SysHalal?** Decidir rapido — prazo
   20/05 nao espera.
3. **Visita JBS Lins:** ventilada na quarta-feira. Vale
   priorizar? Ela informaria modelo de inventario.
4. **Possivel re-visita FAMBRAS:** alguns processos pedem
   imersao mais profunda. Quando agendar?

---

## 6. Proximos passos sugeridos (rascunho — validar)

### Esta semana (2026-05-04 a 2026-05-10)
- [ ] Decidir: QR code → HalalSphere ou SysHalal? (decisao
      Renato + CEO+CTO)
- [ ] Comecar implementacao do QR code escolhido
- [ ] Redigir relatorio formal completo da visita
- [ ] Compilar e organizar documentos repassados por Elaine
      e Lina

### Proximas 2 semanas (ate 20/05)
- [ ] Entregar QR code em prod
- [ ] Validar com FAMBRAS (Elaine)

### Mes seguinte (ate fim de junho)
- [ ] Modelar cadastro de produtos com ingredientes
- [ ] Mapear excecoes do frigorifico
- [ ] Alinhar com CEO+CTO escopo "ERP halal"

---

## 7. Itens nao cobertos por este relatorio

- Detalhes operacionais especificos por equipe (lista completa
  dos pontos levantados pela controladoria de frigorifico, lista
  completa dos pedidos da qualidade) — esperar relatorio formal
  redigido pelo Renato.
- Documentos especificos repassados por Elaine e Lina — listar
  quando consolidados.
- Quantificacao de impacto e estimativa de esforço por item —
  fazer no proximo planejamento de sprint.

---

## 8. Itens deste relatorio que sao do SIH

Para evitar duplicacao, os pontos coletados na visita que sao
escopo do SIH estao em relatorio separado:
`sih-docs/PLANNING/VISITA-FAMBRAS-2026-04-13.md`.
