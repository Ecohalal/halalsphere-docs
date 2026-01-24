# 📊 Épico 7: Gestão Administrativa e Dashboards

**Status de Implementação**: 🟢 95% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026
**6 User Stories | 42 Story Points**

#### 📊 Resumo de Implementação

**✅ Implementado (5/6)**:
- US-055: Dashboard Executivo (métricas financeiras + operacionais) ✅
- US-056: Relatórios de Conformidade ISO 17065 ✅
- US-057: Gestão de Usuários e Permissões ✅
- US-058: RBAC - 11 roles implementadas ✅
- US-059: Analytics Avançado ✅

**🔴 Pendente (1/6 - Pós-MVP)**:
- US-060: Exportação para Power BI/Tableau

**📂 Código Relacionado**:
- Backend: `backend/src/manager/`, `backend/src/admin/`
- Frontend: `frontend/src/pages/manager/ManagerDashboard.tsx`
- Frontend: `frontend/src/pages/admin/` (StorageSettings, ESignatureSettings, UserList)
- Schema: `AuditTrail`, `StorageConfig`, `ESignatureConfig` models

---

**Objetivo**: Fornecer ferramentas de gestão, controle de acesso, analytics e relatórios para administradores e gestores tomarem decisões baseadas em dados.

**Valor de Negócio**:
- 📈 **Visibilidade 360°** do pipeline de certificação em tempo real
- 🔐 **Segurança robusta** com RBAC granular (ISO 17065 compliance)
- 📊 **Inteligência de negócio** - métricas financeiras e operacionais
- 🎯 **KPIs acionáveis** - identificar gargalos e oportunidades

**Prioridade**: P0 (Must Have) | **Total**: 42 SP

---

## 📈 Feature 7.1: Dashboards e KPIs

### **US-055: Dashboard Executivo**
```
Como gestor executivo,
Eu quero visualizar KPIs consolidados em dashboard,
Para monitorar performance do negócio.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Métricas exibidas**:
  - 💰 **Financeiras**:
    - Receita MRR (Monthly Recurring Revenue)
    - Pipeline comercial (propostas em andamento)
    - Ticket médio por certificação
    - Taxa de conversão (solicitação → contrato)
  - 📊 **Operacionais**:
    - Processos em andamento (por fase)
    - Tempo médio de certificação (SLA)
    - Taxa de aprovação do comitê
    - NCs médias por auditoria
  - 👥 **Pessoas**:
    - Auditores ativos
    - Carga de trabalho por auditor
    - Empresas certificadas (total e novas/mês)
- [ ] **Gráficos interativos**:
  - Funil de conversão (12 fases)
  - Linha do tempo de receita (12 meses)
  - Gráfico de pizza: Processos por setor industrial
  - Mapa de calor: Auditores x Regiões
- [ ] **Filtros**:
  - Período (hoje/semana/mês/trimestre/ano/customizado)
  - Setor industrial
  - Região geográfica
  - Analista/Auditor responsável
- [ ] **Exportação**: PDF executivo + Excel com dados brutos

**RN-060**: Dashboard deve carregar em <2s para 10.000 processos históricos

---

### **US-056: Relatórios de Conformidade ISO 17065**
```
Como gestor de qualidade,
Eu quero gerar relatórios de conformidade automaticamente,
Para auditorias ISO 17065.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Relatórios gerados**:
  - 📄 **Relatório de Certificações Emitidas** (por período)
  - 📄 **Relatório de Auditorias Realizadas** (auditores, locais, datas)
  - 📄 **Relatório de NCs** (abertas, fechadas, recorrentes)
  - 📄 **Relatório de Decisões do Comitê** (aprovações, negações, condicionalidades)
  - 📄 **Relatório de Conformidade PR 7.1** (aderência aos prazos)
- [ ] **Rastreabilidade completa**:
  - Audit trail de todas as ações
  - Assinaturas digitais registradas
  - Histórico de modificações
- [ ] **Agendamento**: Relatórios mensais enviados por e-mail automaticamente
- [ ] **Formato**: PDF com marca d'água + JSON estruturado

**RN-061**: Relatórios devem ser imutáveis após geração (blockchain ou hash SHA-256)

---

## 👥 Feature 7.2: Gestão de Usuários e Permissões

### **US-057: Cadastro e Gestão de Usuários**
```
Como administrador,
Eu quero gerenciar usuários e seus perfis,
Para controlar acesso ao sistema.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **CRUD de usuários**:
  - Criar novo usuário (nome, e-mail, celular, idioma preferido)
  - Editar dados do usuário
  - Desativar usuário (soft delete - não remove histórico)
  - Reativar usuário
- [ ] **Atribuição de perfis** (ver US-058):
  - Empresa
  - Analista
  - Auditor
  - Membro do Comitê
  - Administrador
- [ ] **Gestão de auditores**:
  - Especialidades (carne, laticínios, cosméticos, etc)
  - Regiões de atuação
  - Idiomas falados
  - Certificações profissionais
  - Status (ativo/inativo/férias)
- [ ] **Notificação**: E-mail de boas-vindas com link de ativação

---

### **US-058: Controle de Acesso Baseado em Papéis (RBAC)**
```
Como administrador,
Eu quero definir permissões granulares por perfil,
Para garantir segurança conforme ISO 17065.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Perfis implementados**:

| Perfil | Permissões |
|--------|-----------|
| **Empresa** | Ver próprias solicitações, upload docs, chat com IA, visualizar certificados |
| **Analista** | Gerenciar processos atribuídos, solicitar docs, gerar propostas, agendar auditorias |
| **Auditor** | Ver auditorias atribuídas, app mobile, registrar NCs, gerar relatórios |
| **Comitê** | Ver dossiês, votar, buscar casos similares, registrar decisões |
| **Gestor** | Dashboards executivos, relatórios, atribuir processos, configurar SLA |
| **Administrador** | Acesso total (exceto votar no comitê) |

- [ ] **Segregação de funções**:
  - ❌ Analista NÃO pode votar no comitê
  - ❌ Auditor NÃO pode aprovar o próprio relatório
  - ❌ Empresa NÃO pode ver dados de outras empresas
- [ ] **Permissões granulares**:
  ```json
  {
    "solicitacoes": ["read", "create"],
    "documentos": ["read", "upload"],
    "propostas": ["read"],
    "contratos": ["read", "sign"],
    "auditorias": [],
    "comite": [],
    "admin": []
  }
  ```
- [ ] **Logs de acesso**: Registrar quem acessou o quê e quando

**RN-062**: Auditores externos (terceirizados) têm acesso limitado apenas às suas auditorias

---

## 📊 Feature 7.3: Analytics e Business Intelligence

### **US-059: Analytics Avançado**
```
Como gestor,
Eu quero insights de IA sobre performance,
Para otimizar operações.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Insights gerados pela IA**:
  - ⚠️ **Alertas**: "5 processos atrasados há mais de 7 dias"
  - 📈 **Tendências**: "Tempo médio de certificação aumentou 15% este mês"
  - 🎯 **Recomendações**: "Contrate 2 auditores especializados em laticínios"
  - 🔮 **Previsões**: "Você deve emitir 42 certificados neste trimestre"
- [ ] **Análise de gargalos**:
  - Identificar fase com maior tempo de espera
  - Analistas sobrecarregados
  - Empresas com NCs recorrentes
- [ ] **Benchmarking**:
  - Comparar performance atual vs mês anterior
  - Comparar setores industriais (qual certifica mais rápido)
- [ ] **Notificações proativas**:
  - E-mail semanal ao gestor: "Resumo da semana + insights"

---

### **US-060: Exportação para Ferramentas BI Externas**
```
Como analista de dados,
Eu quero exportar dados brutos para ferramentas BI,
Para análises customizadas.
```
**Prioridade**: Nice to Have (P2) | **Estimativa**: 3 SP

**Acceptance Criteria**:
- [ ] **Formatos de exportação**:
  - CSV (tabelas)
  - JSON (dados estruturados)
  - Parquet (big data)
- [ ] **Datasets disponíveis**:
  - Processos completos
  - Auditorias
  - NCs
  - Certificados emitidos
  - Decisões do comitê
- [ ] **Integração BI**:
  - API REST para Power BI / Tableau / Metabase
  - Webhook para atualização em tempo real
- [ ] **Segurança**: Exportações anonimizadas (sem dados sensíveis)

**RN-063**: Exportações devem respeitar LGPD (dados pessoais mascarados)

---

## ✅ ÉPICO 7 COMPLETO
