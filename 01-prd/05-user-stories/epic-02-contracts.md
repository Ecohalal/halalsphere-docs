## ÉPICO 2: Gestão Comercial e Contratual 🚀 INOVAÇÃO

**Status de Implementação**: 🟢 90% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026
**9 User Stories | 80 Story Points**

#### 📊 Resumo de Implementação

**✅ Implementado (6/9)**:
- US-009: Configuração de Tabelas de Preço ✅
- US-010: Cálculo Automático de Proposta ✅
- US-013: Geração Automática de Contrato ✅
- US-016: Aprovação Final de Contrato ✅
- Workflow completo de propostas comerciais ✅
- CRUD de contratos com numeração única ✅

**🟡 Parcial (2/9)**:
- US-011: Geração PDF - Backend pronto, falta template profissional
- US-017: Assinatura Digital - Schema pronto, falta integração D4Sign/Docusign

**🔴 Pendente (1/9 - Pós-MVP)**:
- US-012/014/015: Contratos colaborativos por cláusulas (Inovação #3)

**📂 Código Relacionado**:
- Backend: `backend/src/proposal/`, `backend/src/contract/`
- Frontend: `frontend/src/pages/analyst/ProcessProposal.tsx`
- Schema: `PricingTable`, `Proposal`, `Contract`, `ContractSignature` models

---

**Contexto**: Este épico implementa **2 das 6 inovações tecnológicas exclusivas** do HalalSphere:
- **Inovação #1**: Calculadora Inteligente de Custos Multi-Variável
- **Inovação #3**: Gestão de Contratos Colaborativa por Cláusulas

**Impacto Esperado**:
- ⚡ Redução de **80% no tempo** de criação de propostas (horas → segundos)
- ⚡ Redução de **75% no tempo** de fechamento de contratos (20-30 dias → 5-7 dias)
- ✅ **100% de consistência** em precificação (elimina erro humano)

**Total**: 9 User Stories | **80 Story Points**

---

### 💰 Feature 2.1: Calculadora Inteligente de Custos Multi-Variável

#### **US-009: Configuração de Tabelas de Preço (Admin)**

```
Como administrador da certificadora,
Eu quero configurar tabelas de preço e parâmetros de cálculo,
Para que o sistema calcule propostas comerciais automaticamente com precificação consistente.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP
**Dependências**: US-082 (RBAC)

**Acceptance Criteria**:

- [ ] **Sistema fornece interface de configuração** (Admin apenas)

- [ ] **Tabela de Preços Base por Tipo de Certificação**:
  - C1 a C6 (valores configuráveis)

- [ ] **Fatores Multiplicadores**:
  - Número de produtos (1-10: 1.0x, 11-50: 1.3x, etc.)
  - Turnos (1: 1.0x, 2: 1.4x, 3: 1.8x)
  - Histórico (primeira: 1.0x, renovação: 0.8x)
  - Fornecedores (1-5: 1.0x, 6-15: 1.2x, 16+: 1.5x)

- [ ] **Cálculo de Man-Hour** (PR 7.1 10.7.4):
  - Por funcionários (1-50: 8h, 51-150: 16h, etc.)
  - Valor/hora configurável

- [ ] **Custos de Deslocamento**:
  - Por distância (0km, 100km, 300km, 500km+)
  - Hospedagem se necessário

- [ ] **Taxas Fixas**:
  - Análise documental, Comitê, Emissão, Impostos

- [ ] **Histórico de mudanças** (versionamento)

**RN-027**: Mudanças não afetam processos já iniciados
**RN-028**: Sistema usa tabela vigente na data da solicitação

---

#### **US-010: Cálculo Automático de Proposta**

```
Como analista,
Eu quero que o sistema calcule automaticamente a proposta,
Para evitar cálculos manuais e erros.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:

- [ ] **Fórmula**:
```
TOTAL = (PREÇO_BASE × MULTIPLICADORES)
      + MAN_HOUR + DESLOCAMENTO
      + TAXAS + IMPOSTOS
```

- [ ] **Breakdown detalhado** visível para analista

- [ ] **Analista pode ajustar manualmente** (com justificativa)

- [ ] **Validações**: Alertas se valor muito baixo/alto

**RN-029**: Usa tabela vigente
**RN-030**: Ajustes >20% exigem aprovação

---

#### **US-011: Geração de PDF Profissional**

```
Como analista,
Eu quero gerar PDF profissional da proposta,
Para enviar à empresa.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:

- [ ] **Seções**: Resumo, Breakdown, Escopo, Timeline, Condições, Próximos Passos
- [ ] **Design profissional**: Logo, cores, tabelas, gráficos, QR Code
- [ ] **Geração em < 5 segundos**
- [ ] **Personalizável** (Admin)

---

### 📄 Feature 2.2: Gestão de Contratos Colaborativa por Cláusulas 🚀

**Contexto da Inovação**: Contratos são estruturados em **cláusulas individuais editáveis**. Empresa e certificadora podem editar/comentar cada cláusula separadamente, com versionamento automático, até aprovação final.

#### **US-012: Templates de Contratos por Setor**

```
Como administrador,
Eu quero criar templates de contratos organizados por cláusulas,
Para que analistas possam gerar contratos customizados rapidamente.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:

- [ ] **Admin pode criar templates** por tipo de indústria:
  - Alimentos (Geral)
  - Alimentos - Laticínios
  - Alimentos - Cárneos
  - Farmacêuticos
  - Químicos e Cosméticos

- [ ] **Template estruturado em cláusulas** (15-20 cláusulas típicas):
  1. **Cláusula 1 - Objeto do Contrato**
  2. **Cláusula 2 - Escopo da Certificação**
  3. **Cláusula 3 - Validade do Certificado**
  4. **Cláusula 4 - Responsabilidades da Empresa**
  5. **Cláusula 5 - Responsabilidades da Certificadora**
  6. **Cláusula 6 - Custos e Forma de Pagamento**
  7. **Cláusula 7 - Auditorias de Manutenção**
  8. **Cláusula 8 - Suspensão e Cancelamento**
  9. **Cláusula 9 - Uso da Marca e do Certificado**
  10. **Cláusula 10 - Confidencialidade**
  11. **Cláusula 11 - Propriedade Intelectual**
  12. **Cláusula 12 - Rescisão**
  13. **Cláusula 13 - Multas e Penalidades**
  14. **Cláusula 14 - Legislação Aplicável**
  15. **Cláusula 15 - Foro**

- [ ] **Cada cláusula contém**:
  - Número e título
  - Texto padrão
  - Tipo: **Obrigatória** (não pode ser removida) ou **Opcional**
  - Editável: **Sim** ou **Não** (algumas cláusulas legais não podem ser editadas)
  - Variáveis dinâmicas: `{{NOME_EMPRESA}}`, `{{VALOR_TOTAL}}`, `{{VALIDADE}}`, etc.

- [ ] **Sistema suporta variáveis dinâmicas** que são preenchidas automaticamente

- [ ] **Admin pode duplicar/editar templates existentes**

- [ ] **Histórico de versões de templates**

**RN-032**: Cláusulas obrigatórias não podem ser removidas do contrato

---

#### **US-013: Geração Automática de Contrato a partir de Proposta Aceita**

```
Como analista,
Eu quero que o sistema gere automaticamente um contrato quando a proposta for aceita,
Para iniciar a negociação rapidamente.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:

- [ ] **Quando empresa aceita proposta**, sistema automaticamente:
  1. Seleciona template de contrato apropriado (baseado em tipo de indústria)
  2. Preenche variáveis dinâmicas:
     - `{{NOME_EMPRESA}}` → Razão Social
     - `{{CNPJ}}` → CNPJ formatado
     - `{{ENDERECO}}` → Endereço completo
     - `{{VALOR_TOTAL}}` → Valor da proposta
     - `{{DATA}}` → Data atual
     - `{{VALIDADE}}` → 3 anos
     - etc.
  3. Cria registro de contrato com status: **"Em Preparação"**
  4. Notifica analista: "Contrato gerado. Revise antes de enviar."

- [ ] **Analista pode revisar contrato** antes de enviar à empresa:
  - Visualiza todas cláusulas pré-preenchidas
  - Pode editar cláusulas editáveis
  - Pode adicionar cláusulas opcionais
  - Pode remover cláusulas opcionais (obrigatórias não)

- [ ] **Após revisão, analista envia para empresa**:
  - Botão: "Enviar Contrato para Empresa"
  - Status muda para: **"Aguardando Revisão da Empresa"**
  - Empresa recebe notificação por e-mail

**RN-033**: Contrato só pode ser enviado após proposta aceita

---

#### **US-014: Interface Colaborativa de Edição por Cláusulas (Empresa)**

```
Como empresa,
Eu quero editar e comentar cláusulas específicas do contrato,
Para negociar termos sem trocas intermináveis de e-mail.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:

- [ ] **Interface de revisão de contrato para empresa**:

**Visualização Lado-a-Lado**:
```
┌─────────────────────┬─────────────────────┐
│ PROPOSTA ORIGINAL   │  VERSÃO EDITADA     │
│   (Certificadora)   │  (Colaborativa)     │
├─────────────────────┼─────────────────────┤
│ Cláusula 1 - Objeto │ Cláusula 1 - Objeto │
│ [Texto original...] │ [Texto editado...]  │
│                     │                     │
│ Status: ✅ Aprovado │ Status: 📝 Editado  │
│ Comentários: 0      │ Comentários: 2      │
└─────────────────────┴─────────────────────┘
```

- [ ] **Para cada cláusula, empresa pode**:
  1. **Aprovar** (marca como ✅ Aprovado)
  2. **Editar** (modifica texto, marca como 📝 Editado)
  3. **Comentar** (adiciona comentário sem editar texto)
  4. **Rejeitar** (marca como ❌ Rejeitada com motivo)

- [ ] **Sistema exibe status granular por cláusula**:
  - ✅ **Aprovada** (ambas partes aprovaram)
  - 📝 **Editada pela Empresa** (aguardando certificadora)
  - 📝 **Editada pela Certificadora** (aguardando empresa)
  - 💬 **Em Discussão** (há comentários não resolvidos)
  - ❌ **Rejeitada** (uma parte rejeitou)
  - ⏳ **Pendente** (nenhuma ação ainda)

- [ ] **Contador de progresso visual**:
  - "12 de 15 cláusulas aprovadas (80%)"
  - Barra de progresso colorida
  - Lista de cláusulas pendentes

- [ ] **Sistema bloqueia edição de cláusulas obrigatórias não-editáveis**:
  - Exibe ícone de cadeado 🔒
  - Tooltip: "Esta cláusula é obrigatória e não pode ser editada conforme legislação vigente"

- [ ] **Thread de comentários por cláusula**:
  - Empresa: "Sugerimos mudar prazo de 30 para 45 dias"
  - Certificadora: "Aceito. Mudança aplicada."
  - Cada comentário tem timestamp e autor

- [ ] **Notificações em tempo real**:
  - Quando certificadora edita cláusula, empresa recebe notificação
  - Vice-versa

**RN-034**: Cláusulas obrigatórias 🔒 não podem ser editadas
**RN-035**: Apenas 1 versão ativa de cada cláusula (última edição prevalece)

---

#### **US-015: Versionamento Automático de Mudanças**

```
Como usuário do sistema (empresa ou certificadora),
Eu quero ver histórico completo de mudanças em cada cláusula,
Para rastrear negociação e entender o que mudou.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:

- [ ] **Sistema mantém histórico completo** de cada cláusula:

**Exemplo de histórico da Cláusula 6**:
```
Cláusula 6 - Custos e Forma de Pagamento

📜 HISTÓRICO DE VERSÕES:

v1 - 10/11/2025 14:30 - Analista Mariana Silva
"O valor total da certificação é de R$ 12.916,80,
parcelado em 3x sem juros."

v2 - 11/11/2025 09:15 - Empresa Ahmad Silva
"O valor total da certificação é de R$ 12.916,80,
parcelado em 4x sem juros."
Comentário: "Solicitamos parcelamento em 4x"

v3 - 11/11/2025 16:00 - Analista Mariana Silva (ATUAL)
"O valor total da certificação é de R$ 12.916,80,
parcelado em 4x sem juros, com acréscimo de 2% em cada parcela."
Comentário: "Aceito 4x mas com acréscimo de 2% por parcela conforme política comercial"

Status: 📝 Aguardando aprovação da empresa
```

- [ ] **Sistema destaca mudanças** (diff visual):
  - Texto removido em vermelho tachado
  - Texto adicionado em verde destacado

- [ ] **Usuário pode reverter para versão anterior**:
  - Botão "Reverter para v1"
  - Cria nova versão (não deleta histórico)

- [ ] **Histórico é imutável** (não pode ser apagado)

- [ ] **Audit trail completo**:
  - Quem editou, quando, o que mudou, comentário

**RN-036**: Histórico de versões é imutável e auditável

---

#### **US-016: Aprovação Final e Bloqueio de Edição**

```
Como analista ou empresa,
Eu quero aprovar o contrato completo apenas quando TODAS cláusulas estiverem aprovadas,
Para garantir que não há pendências.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:

- [ ] **Sistema bloqueia aprovação final até**:
  - 100% das cláusulas estejam com status ✅ Aprovada
  - Ambas as partes (empresa + certificadora) aprovaram TODAS

- [ ] **Botão "Aprovar Contrato Final"** aparece apenas quando:
  - Todas cláusulas aprovadas
  - Nenhuma cláusula em edição/discussão/rejeitada

- [ ] **Ao clicar "Aprovar Contrato Final"**:
  - Sistema exibe confirmação: "Tem certeza? Após aprovação, o contrato não poderá mais ser editado."
  - Após confirmação:
    - Status do contrato muda para: **"Aprovado - Aguardando Assinatura"**
    - Contrato é **bloqueado para edição** (ambas partes não podem mais editar)
    - Sistema gera PDF final do contrato
    - Sistema envia para assinatura digital (US-017)

- [ ] **Se uma parte tentar editar após aprovação final**: Sistema bloqueia e exibe mensagem

**RN-037**: Contrato aprovado é imutável (não pode ser editado)
**RN-038**: Apenas após ambas partes aprovarem TODAS cláusulas, contrato vai para assinatura

---

#### **US-017: Assinatura Digital Integrada**

```
Como empresa ou certificadora,
Eu quero assinar digitalmente o contrato aprovado,
Para que o contrato tenha validade jurídica e o processo possa continuar.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:

- [ ] **Integração com plataforma de assinatura digital**:
  - **Opção 1**: Docusign (internacional)
  - **Opção 2**: D4Sign (Brasil)
  - **Opção 3**: ICP-Brasil (validade jurídica máxima no Brasil)
  - Escolha configurável por Admin

- [ ] **Quando contrato é aprovado, sistema**:
  1. Gera PDF final do contrato com todas cláusulas aprovadas
  2. Envia para plataforma de assinatura digital
  3. Define signatários:
     - Empresa: Nome e e-mail do responsável
     - Certificadora: Nome e e-mail do diretor/coordenador
  4. Cada signatário recebe e-mail com link para assinar

- [ ] **Fluxo de assinatura**:
  - Empresa assina primeiro (ordem configurável)
  - Após empresa assinar, notifica certificadora
  - Certificadora assina
  - Após ambas assinarem, contrato é considerado **"Assinado"**

- [ ] **Sistema recebe webhook** da plataforma de assinatura:
  - Quando empresa assina → Status: "Aguardando Assinatura Certificadora"
  - Quando certificadora assina → Status: **"Contrato Assinado"** ✅
  - Sistema armazena certificado de assinatura (PDF)

- [ ] **Após ambas assinaturas**:
  - Status do processo muda para: **"Contrato Assinado - Estágio 1"**
  - Sistema notifica empresa: "Contrato assinado com sucesso! Próxima etapa: Análise Documental."
  - Sistema notifica analista: "Contrato assinado. Processo pode avançar para Estágio 1."
  - PDF assinado disponível para download por ambas partes

- [ ] **Sistema permite reenvio de e-mail de assinatura** (se expirou)

- [ ] **Sistema exibe status de assinatura em tempo real**:
  - ⏳ Aguardando Empresa
  - ⏳ Aguardando Certificadora
  - ✅ Assinado por Ambas Partes

**RN-039**: Contrato só é válido após assinatura digital de ambas partes
**RN-040**: Processo não avança para Estágio 1 até contrato assinado

**Integrações**:
- [ ] Docusign API / D4Sign API / ICP-Brasil
- [ ] Webhook para receber status de assinatura
- [ ] Download de PDF assinado com certificado

**Testes**:
- [ ] Teste de integração: Envio para Docusign/D4Sign
- [ ] Teste funcional: Fluxo completo de assinatura
- [ ] Teste de segurança: Validação de certificado de assinatura

---

## ✅ ÉPICO 2 COMPLETO
