## ÉPICO 5: Decisão e Emissão de Certificados (Comitê)

**Status de Implementação**: 🟢 85% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026
**8 User Stories | 50 Story Points**

#### 📊 Resumo de Implementação

**✅ Implementado (5/8)**:
- US-040: Dashboard do Comitê ✅
- US-041: Dossiê Estruturado ✅
- US-043: Deliberação Individual ✅
- US-045: Registro de Decisão Final ✅
- US-047: Histórico de Decisões ✅

**🔴 Pendente (3/8 - MVP Crítico)**:
- US-044: Reunião Virtual do Comitê (Pós-MVP)
- US-046: Geração de Certificado Digital (implementação básica existe)
- US-047: Validação Pública de Certificados (página pública)
- US-048: Notificações por Email

**📂 Código Relacionado**:
- Backend: `backend/src/manager/`, `backend/src/certificate/`
- Frontend: `frontend/src/pages/manager/ManagerDashboard.tsx`
- Schema: `CommitteeDecision`, `Certificate` models

---

---

### 📊 Feature 5.1: Painel do Comitê Técnico

#### **US-040: Lista de Casos Pendentes de Decisão**
```
Como membro do comitê,
Eu quero ver lista priorizada de casos pendentes,
Para organizar reunião mensal.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Lista** ordenada por: Data de submissão, Urgência, Complexidade
- [ ] **Card** por caso: Empresa, tipo certificação, analista responsável, dias aguardando
- [ ] **Filtros**: Por tipo, por mês, por analista
- [ ] **Indicador de complexidade**: Simples / Médio / Complexo

---

### 📑 Feature 5.2: Dossiê de Certificação

#### **US-041: Dossiê Estruturado e Completo**
```
Como membro do comitê,
Eu quero dossiê completo e organizado,
Para tomar decisão informada rapidamente.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Dossiê contém** (abas/seções):
  1. **Resumo Executivo**: Tipo, escopo, recomendação analista
  2. **Dados da Empresa**: CNPJ, endereço, contatos, outras certificações
  3. **Solicitação Completa**: Produtos, processos, fornecedores
  4. **Relatório Estágio 1**: Análise documental
  5. **Relatório Estágio 2**: Auditoria presencial
  6. **Não-Conformidades**: Lista completa, tratamentos, status
  7. **Histórico**: Certificações anteriores, auditorias, decisões
  8. **Recomendação**: Opinião do analista (Aprovar/Negar/Condições)

- [ ] **Navegação fácil** entre seções
- [ ] **Download** de dossiê completo (PDF)
- [ ] **Acesso a documentos originais** (fotos, relatórios, fichas técnicas)

---

#### **US-042: Busca de Casos Similares**
```
Como membro do comitê,
Eu quero buscar decisões anteriores similares,
Para manter consistência.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Sistema sugere** casos similares:
  - Mesmo tipo de indústria
  - Produtos parecidos
  - NCs similares
- [ ] **Exibe**: Decisão tomada, justificativa, data
- [ ] **Filtro manual**: Busca por palavra-chave, tipo, período

**RN-050**: Decisões anteriores são referência, não vinculativas

---

### ✅ Feature 5.3: Deliberação e Votação

#### **US-043: Deliberação Digital Individual**
```
Como membro do comitê,
Eu quero registrar meu voto e justificativa,
Para deliberação ser documentada.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Opções de voto**:
  - ✅ **Aprovar** (certificação concedida)
  - ⚠️ **Aprovar com Condições** (especificar condições)
  - ❌ **Negar** (certificação negada)
  - 🔄 **Solicitar Mais Informações** (retorna ao analista)
- [ ] **Campo obrigatório**: Justificativa detalhada (min 100 caracteres)
- [ ] **Campo opcional**: Condições específicas (se aplicável)
- [ ] **Assinatura digital** do voto

---

#### **US-044: Reunião Virtual do Comitê**
```
Como coordenador do comitê,
Eu quero realizar reunião virtual com votação em tempo real,
Para decisões ágeis.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Interface de reunião**: Lista de casos para deliberar
- [ ] **Apresentação**: Dossiê projetado para todos
- [ ] **Votação em tempo real**: Cada membro vota simultaneamente
- [ ] **Discussão**: Chat/comentários durante reunião
- [ ] **Resultado**: Cálculo automático (maioria simples/qualificada)
- [ ] **Ata gerada** automaticamente

**RN-051**: Quórum mínimo de 3 membros para decisão válida

---

#### **US-045: Registro de Decisão Final**
```
Como sistema,
Eu quero registrar decisão final com rastreabilidade,
Para conformidade com PR 7.1 10.9.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Decisão registrada** com:
  - Resultado (Aprovado/Negado/Condicional)
  - Data da deliberação
  - Membros presentes e votos individuais
  - Justificativa consolidada
  - Condições (se aplicável)
  - Assinaturas digitais
- [ ] **Audit trail completo** (imutável)
- [ ] **Notificações automáticas**:
  - Analista responsável
  - Empresa (e-mail personalizado conforme decisão)

**RN-052**: Decisão do comitê é final e vinculativa

---

### 🎖️ Feature 5.4: Emissão de Certificados

#### **US-046: Geração Automática de Certificado Digital**
```
Como sistema,
Eu quero gerar certificado digital automaticamente após aprovação,
Para emissão rápida conforme PR 7.1 10.9.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Template profissional** com:
  - Logo da certificadora
  - Nome da empresa
  - CNPJ
  - Produtos certificados
  - Tipo de certificação (C1-C6)
  - Normas atendidas (GSO 2055-2, SMIIC 02)
  - Número único do certificado: formato "HS-CERT-YYYY-NNNNNN"
  - Data de emissão
  - Validade (3 anos)
  - QR Code para validação online
  - Assinatura digital da certificadora
  - Marca d'água e elementos de segurança

- [ ] **Geração em < 10 segundos**
- [ ] **PDF de alta qualidade** (300 DPI, não editável)
- [ ] **Numeração sequencial** controlada

---

#### **US-047: Validação Pública de Certificados**
```
Como público geral,
Eu quero validar autenticidade de certificados online,
Para confiar na certificação.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Página pública** de validação (sem login)
- [ ] **Busca** por:
  - Número do certificado
  - QR Code (scan)
  - Nome da empresa
  - CNPJ
- [ ] **Resultado exibe**:
  - ✅ **Válido**: Empresa, produtos, validade, data emissão
  - ⚠️ **Vencido**: Data de vencimento
  - ❌ **Inválido**: Certificado não encontrado
- [ ] **Certificados suspensos** aparecem como inválidos
- [ ] **Download** do certificado original (PDF)

---

#### **US-048: Publicação e Notificação de Certificado**
```
Como empresa,
Eu quero receber certificado imediatamente após emissão,
Para usar em negócios.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Após emissão**:
  - Status processo: "Certificado Emitido" 🎉
  - Empresa recebe e-mail: "Parabéns! Certificado emitido"
  - E-mail contém: Link download PDF, número certificado, validade
  - Certificado disponível no dashboard da empresa
  - Publicado automaticamente em "Empresas Certificadas" (página pública)
- [ ] **Notificação SMS** (opcional)
- [ ] **Certificado em alta resolução** para impressão

**RN-053**: Certificado válido por 3 anos a partir da emissão

---

## ✅ ÉPICO 5 COMPLETO
