# User Stories Detalhadas

**63 User Stories | 544 Story Points | 9 Épicos**

🟢 **Status Atual**: 85% Implementado (Janeiro 2026)
📅 **MVP em Produção**: 23 de Janeiro de 2026

📄 **Análise Completa**: Ver [ANALISE-PROJETO-EPICOS-2025.md](../../ANALISE-PROJETO-EPICOS-2025.md)

---

## 📊 User Stories por Épico

| Épico | Descrição | Status | % Execução |
|-------|-----------|--------|------------|
| [Épico 01](./epic-01-requests.md) | Gestão de Solicitações | 🟢 Completo | **95%** |
| [Épico 02](./epic-02-contracts.md) | Gestão Comercial | 🟢 Funcional | **90%** |
| [Épico 03](./epic-03-analysis.md) | Análise e Preparação | 🟢 Completo | **95%** |
| [Épico 04](./epic-04-audits.md) | Execução de Auditorias | 🟢 Completo | **95%** |
| [Épico 05](./epic-05-decision.md) | Decisão e Certificados | 🟡 Parcial | **70%** |
| [Épico 06](./epic-06-ai.md) | Assistente IA | 🔴 Futuro | **5%** |
| [Épico 07](./epic-07-admin.md) | Gestão Administrativa | 🟢 Completo | **85%** |
| [Épico 08](./epic-08-infra.md) | Infraestrutura | 🟢 Completo | **90%** |
| [Épico 09](./epic-09-auto-cadastro.md) | Auto-Cadastro | 🟢 Completo | **95%** |

**Ver Status de Todos os Épicos**: [PROXIMOS-PASSOS-MVP.md](../../GUIDES/PROXIMOS-PASSOS-MVP.md)

---

## 📋 Épicos e User Stories

### Must Have (P0) - 7 Épicos, 493 SP | 🟢 90% Implementado

#### [Épico 1: Gestão de Solicitações e Onboarding](./epic-01-requests.md) 🟢 95%
**8 stories | 57 SP | Status: Completo**

- ✅ US-001: Cadastro de Nova Empresa Solicitante (5 SP)
- ✅ US-002: Wizard de Solicitação de Certificação (13 SP) - 9 etapas
- ✅ US-003: Upload e Gestão de Documentos (8 SP)
- ✅ US-004: Dashboard de Status - 17 fases (8 SP)
- ✅ US-005: Calculadora de Custos (8 SP) - CalculatorService
- 🟡 US-006: Notificações (3 SP) - In-app OK, falta emails
- ✅ US-007: Editar Rascunho (3 SP)
- ✅ US-008: Cancelar Solicitação (2 SP)

---

#### [Épico 2: Gestão Comercial e Contratual](./epic-02-contracts.md) 🚀 🟢 90%
**9 stories | 80 SP | Status: Funcional, faltam features avançadas**

- ✅ US-009: Config Tabelas de Preço (8 SP) - PricingTable
- ✅ US-010: Cálculo Automático de Proposta (13 SP) - Inovação #1 ✅
- 🟡 US-011: Geração de PDF Profissional (8 SP) - Backend OK, falta template
- ✅ US-013: Geração Auto de Contrato (8 SP)
- ✅ US-016: Aprovação Final (5 SP)
- 🟡 US-017: Assinatura Digital (13 SP) - Schema pronto, falta integração D4Sign
- 🔴 US-012/014/015: Contratos Colaborativos (26 SP) - Pós-MVP

---

#### [Épico 3: Análise e Preparação](./epic-03-analysis.md) 🚀 🟢 95%
**10 stories | 68 SP | Status: Completo**

- ✅ US-018: Kanban de Processos (8 SP) - Com lazy loading e drag-drop
- ✅ US-019: Atribuição de Analista (5 SP) - Manual com seleção
- ✅ US-020: Revisão de Solicitação (8 SP)
- ✅ US-021: Enquadramento GSO 2055-2 (8 SP) - 3 níveis hierárquicos
- ✅ US-022: Checklist Estágio 1 (8 SP) - 5 seções
- ✅ US-023: Solicitação de Docs (5 SP) - DocumentRequest
- ✅ US-024: Sistema de Comentários (5 SP) - Com @mentions
- ✅ US-025: Agendamento Auditorias (8 SP) - Backend completo
- ✅ US-026: Cadastro Auditores (5 SP)
- ✅ US-027: Calendário Visual (8 SP)
- 🔴 US-028: Matching Inteligente (13 SP) - Pós-MVP

---

#### [Épico 4: Execução de Auditorias](./epic-04-audits.md) 🚀 🟢 95%
**9 stories | 63 SP | Status: Completo**

- ✅ US-029: Dashboard Auditor (8 SP) - AuditorDashboard
- ✅ US-030: Ver Processo (5 SP) - ProcessDetails
- ✅ US-031: Ver Documentação (3 SP) - ProcessDocuments
- ✅ US-032: Checklist Digital (13 SP) - AuditExecution com 5 seções
- ✅ US-033: Upload Evidências (8 SP) - EvidenceCapture
- ✅ US-034: Relatório de Auditoria (13 SP) - NonConformityForm
- ✅ US-035: Enviar Relatório (5 SP) - Submit workflow
- ✅ US-036: Histórico (5 SP) - AuditorReports
- 🟡 US-037: Notificações (3 SP) - In-app OK, falta emails

---

#### [Épico 5: Decisão e Emissão de Certificados](./epic-05-decision.md) 🟡 70%
**7 stories | 48 SP | Status: Decisões OK, certificados parcial**

- ✅ US-038: Dashboard Comitê (8 SP) - ManagerDashboard
- ✅ US-039: Analisar Relatório (8 SP) - Via ProcessDetails
- ✅ US-040: Decisão do Comitê (5 SP) - submitCommitteeDecision
- ✅ US-041: Solicitar Info Adicional (3 SP) - Via comentários
- 🟡 US-042: Emitir Certificado (13 SP) - Schema pronto, falta PDF
- 🔴 US-043: Consulta Pública (5 SP) - A implementar
- ✅ US-044: Histórico (3 SP) - getCommitteeDecisions

---

#### [Épico 8: Infraestrutura e Fundação Técnica](./epic-08-infra.md) 🟢 90%
**8 stories | 66 SP | Status: Core completo**

- ✅ US-052: Autenticação (13 SP) - JWT + refresh + bloqueio
- ✅ US-053: RBAC (8 SP) - 12 roles completo
- ✅ US-054: Gestão Usuários (8 SP) - AdminService
- ✅ US-055: Logs de Auditoria (8 SP) - AuditTrail ISO 17065
- ✅ US-056: i18n (8 SP) - PT/EN/AR preparado
- ✅ US-057: Storage Configurável (5 SP) - S3/Local/Azure/GCP
- ✅ US-058: CNPJ Lookup (5 SP) - BrasilAPI/ReceitaWS
- 🟡 US-059: Email Transacional (5 SP) - AWS SES preparado

---

### Should Have (P1) - 2 Épicos, 119 SP | 🟡 45% Implementado

#### [Épico 6: Assistente IA Multilíngue](./epic-06-ai.md) 🤖 🔴 5%
**6 stories | 78 SP | Status: Schema pronto, implementação pós-MVP**

- 🔴 US-045: Chatbot RAG (21 SP) - Schema KnowledgeBase com pgvector
- 🔴 US-046: Análise Pré-Auditoria (21 SP) - Schema AiAnalysis pronto
- 🔴 US-047: Sugestões IA (13 SP) - Não iniciado
- 🔴 US-048: Base Conhecimento (13 SP) - pgvector HNSW configurado
- 🔴 US-049: Feedback IA (5 SP) - Não iniciado
- 🔴 US-050: Métricas Uso (5 SP) - Não iniciado

---

#### [Épico 7: Gestão Administrativa e Dashboards](./epic-07-admin.md) 📊 🟢 85%
**5 stories | 41 SP | Status: Core completo**

- ✅ US-060: Dashboard Gestor (13 SP) - ManagerDashboard com KPIs
- ✅ US-061: Relatórios (8 SP) - 3 tipos implementados
- ✅ US-062: Config Sistema (5 SP) - Storage + ESignature + CNPJ
- 🔴 US-063: Exportação (5 SP) - Não iniciado
- ✅ US-064: Auditoria (8 SP) - AuditTrail completo

---

#### [Épico 9: Auto-Cadastro e Grupos Empresariais](./epic-09-auto-cadastro.md) 🏢 🟢 95%
**4 stories | 43 SP | Status: Completo**

- ✅ US-065: Grupos Empresariais (13 SP) - CompanyGroup + Plants
- ✅ US-066: Convites de Usuários (8 SP) - UserInvite com expiração
- ✅ US-067: Documentos Corporativos (8 SP) - SharedSupplier + CorporateDocument
- ✅ US-068: Validação de Empresas (5 SP) - PendingValidation workflow

---

## 📊 Legenda de Status

- ✅ **Completo**: Implementado e testado
- 🟢 **Verde (>80%)**: Épico quase completo
- 🟡 **Amarelo (50-80%)**: Épico parcialmente implementado
- 🔴 **Vermelho (<50%)**: Épico não iniciado ou com pouca implementação

---

## 🎯 Resumo de Implementação (Janeiro 2026)

### ✅ O Que Está Funcionando (MVP em Produção)
1. **Fluxo Completo de Certificação** (17 fases)
2. **Wizard de Solicitação** (9 etapas)
3. **Sistema de Propostas** com cálculo automático
4. **Gestão de Auditorias** completa (agendamento + execução + checklist)
5. **Dashboard Kanban** para analistas (drag-and-drop)
6. **Dashboard Executivo** para gestores
7. **Sistema de Comentários** e solicitação de documentos
8. **RBAC** com 12 tipos de usuários
9. **Classificação Industrial** GSO 2055-2 (3 níveis)
10. **Grupos Empresariais** (matriz + filiais)
11. **Storage Configurável** (S3/Local/Azure/GCP)
12. **CNPJ Lookup** (BrasilAPI/ReceitaWS)
13. **Notificações In-App** funcionais

### 🟡 O Que Está Parcial (Fase 2 - Fev/Mar 2026)
1. **Emissão de Certificados** - Schema pronto, falta PDF profissional
2. **Assinatura Digital** - Schema pronto, falta integração D4Sign
3. **Emails Transacionais** - AWS SES preparado, falta templates

### 🚀 Futuro (Pós-MVP - Fase 3)
1. **Sistema de IA** (Chatbot RAG + Análise Pré-Auditoria)
2. **Contratos Colaborativos** por cláusulas
3. **Matching Inteligente** de auditores
4. **Consulta Pública** de certificados

---

## 📊 Estatísticas por Épico

| Épico | Stories | Story Points | % Execução | Prioridade |
|-------|---------|--------------|------------|------------|
| Épico 1: Solicitações | 8 | 57 SP | 🟢 **95%** | P0 - Must Have |
| Épico 2: Comercial | 7 | 80 SP | 🟢 **90%** | P0 - Must Have |
| Épico 3: Análise | 10 | 68 SP | 🟢 **95%** | P0 - Must Have |
| Épico 4: Auditorias | 9 | 63 SP | 🟢 **95%** | P0 - Must Have |
| Épico 5: Decisão | 7 | 48 SP | 🟡 **70%** | P0 - Must Have |
| Épico 6: IA | 6 | 78 SP | 🔴 **5%** | P1 - Should Have |
| Épico 7: Admin | 5 | 41 SP | 🟢 **85%** | P1 - Should Have |
| Épico 8: Infra | 8 | 66 SP | 🟢 **90%** | P0 - Must Have |
| Épico 9: Onboarding | 4 | 43 SP | 🟢 **95%** | P0 - Must Have |
| **TOTAL** | **63** | **544 SP** | **85%** | - |

---

## 🚀 Inovações Tecnológicas (6)

1. **Calculadora de Custos** (US-005) - Multi-variável, C1-C6
2. **Contratos Colaborativos** (US-014) - Assinatura em 48h
3. **Kanban Inteligente** (US-018) - 700 processos simultâneos
4. **Calendário de Agendamento** (US-028, US-029) - Score de disponibilidade
5. **IA Pré-Auditoria** (US-050) - Análise automática de docs
6. **Chatbot RAG** (US-049) - Multilíngue, 70%+ resolução

---

## 🔗 Navegação

- [← Voltar ao Índice do PRD](../README.md)
- [Roadmap e Faseamento →](../06-roadmap.md)
- [Acceptance Criteria Globais →](../09-acceptance-criteria.md)

---

**Última atualização**: 24 de Janeiro de 2026
