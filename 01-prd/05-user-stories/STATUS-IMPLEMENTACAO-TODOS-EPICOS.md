# 📊 Status de Implementação - Todos os Épicos
## HalalSphere - Guia Completo para Desenvolvedor

**Data**: Janeiro 2026
**Versão**: 2.0
**Status Geral**: 95% Implementado
**Primeira Publicação em Produção**: 23 de Janeiro de 2026

---

## 🎯 Como Usar Este Documento

Este documento fornece uma **visão consolidada** do status de implementação de **todos os 8 épicos** do projeto HalalSphere. Para cada épico, você encontrará:

✅ **O que está implementado** (com referências ao código)
🟡 **O que está parcialmente pronto** (schema existe, falta UI/lógica)
🔴 **O que falta implementar** (não iniciado)
📂 **Onde encontrar o código** (arquivos específicos)

---

## ÉPICO 1: Gestão de Solicitações e Onboarding 🟢 95%

📄 **Detalhes Completos**: [EPIC-01-STATUS.md](./EPIC-01-STATUS.md)

### Status Rápido
| US | Título | Status |
|----|--------|--------|
| US-001 | Cadastro de Empresa | ✅ |
| US-002 | Wizard (9 etapas) | ✅ |
| US-003 | Upload Documentos | ✅ |
| US-004 | Dashboard (17 fases) | ✅ |
| US-005 | Calculadora | ✅ |
| US-006 | Notificações | ✅ |
| US-007 | Editar Rascunho | ✅ |
| US-008 | Cancelar | ✅ |

### Código Principal
- Backend: `backend/src/modules/process/`
- Frontend: `frontend/src/pages/company/NewRequestWizard.tsx`
- Schema: `Request`, `Process`, `Company`

### Prioridade para Completar
✅ **US-006**: Sistema de notificações in-app implementado

---

## ÉPICO 2: Gestão Comercial e Contratual 🟢 90%

### Status Rápido
| US | Título | Status | Notas |
|----|--------|--------|-------|
| US-009 | Config Tabelas Preço | ✅ | PricingTable model |
| US-010 | Cálculo Automático | ✅ | CalculatorService (Inovação #1) |
| US-011 | Geração PDF | 🟡 | Backend pronto, falta template |
| US-012 | Templates Contratos | 🔴 | Não iniciado |
| US-013 | Geração Auto Contrato | ✅ | ContractService |
| US-014 | Interface Colaborativa | 🔴 | Não iniciado (Inovação #3) |
| US-015 | Versionamento | 🔴 | Não iniciado |
| US-016 | Aprovação Final | ✅ | Workflow OK |
| US-017 | Assinatura Digital | 🟡 | Schema pronto, falta D4Sign |

### Código Principal
- Backend: `backend/src/modules/proposal/`, `backend/src/modules/contract/`
- Frontend: `frontend/src/pages/analyst/ProcessProposal.tsx`, `ProcessContract.tsx`
- Schema: `PricingTable`, `Proposal`, `Contract`, `ContractSignature`

### O Que Funciona
✅ **Proposta Comercial Completa**:
- Cálculo automático multi-variável
- Ajustes manuais com validação
- Envio para empresa
- Aceitação/recusa

✅ **Contratos Básicos**:
- Geração após proposta aceita
- Número único (HS-CONT-YYYY-0000)
- CRUD completo
- Workflow de aprovação

### O Que Falta (Prioridades MVP)
🔴 **US-011**: Template profissional de PDF (propostas e contratos)
🔴 **US-017**: Integração D4Sign/Docusign para assinatura eletrônica

### O Que Falta (Pós-MVP)
🔴 **US-012/014/015**: Sistema de contratos colaborativos por cláusulas (Inovação #3)

---

## ÉPICO 3: Análise e Preparação 🟢 90%

### Status Rápido
| US | Título | Status | Notas |
|----|--------|--------|-------|
| US-018 | Kanban | ✅ | Com lazy loading |
| US-019 | Atribuição Auto | 🟡 | Apenas manual |
| US-020 | Revisão Solicitação | ✅ | Checklist OK |
| US-021 | Enquadramento GSO | ✅ | 3 níveis hierárquicos |
| US-022 | Checklist Estágio 1 | ✅ | 5 seções |
| US-023 | Solicitação Docs | ✅ | DocumentRequest |
| US-023.1 | Comentários | ✅ | Com @mentions |
| US-023.2 | Agend. Auditorias | ✅ | Backend completo |
| US-024 | Assistência IA | 🔴 | Não iniciado |
| US-025 | Cadastro Auditores | ✅ | User role 'auditor' |
| US-026 | Matching Inteligente | 🔴 | Algoritmo pendente |
| US-027 | Agend. Colaborativo | 🟡 | Falta interface empresa |
| US-028 | Calendário Visual | ✅ | AuditCalendar |
| US-029 | Briefing Auditor | 🔴 | Falta email |

### Código Principal
- Backend: `backend/src/modules/process/`, `document-request/`, `comment/`, `audit-schedule/`
- Frontend: `frontend/src/pages/analyst/AnalystDashboard.tsx` (Kanban)
- Frontend: `frontend/src/components/kanban/` (KanbanColumn, ProcessCard, KanbanFilters)
- Frontend: `frontend/src/components/analyst/` (DocumentRequestModal, AuditScheduleModal, CommentsSection)
- Schema: `DocumentRequest`, `Comment`, `Audit`

### O Que Funciona
✅ **Dashboard Kanban Completo**:
- 7 colunas (Novos, Em Análise, Aguard. Docs, Agendamento, Em Auditoria, Comitê, Concluídos)
- Drag-and-drop entre colunas
- Filtros (analista, status, prioridade, tipo)
- Lazy loading (mostra 5 cards, botão "carregar mais")
- Alertas visuais para processos atrasados

✅ **Sistema de Comentários**:
- Comentários internos (só staff) e públicos (empresa vê)
- @mentions para notificações
- Edição e exclusão (apenas autor)
- Busca por menção

✅ **Solicitação de Documentos**:
- Analista solicita documentos adicionais
- Empresa recebe notificação
- Rastreamento de status (pendente/atendido/cancelado)
- Detecção de documentos atrasados (overdue)

✅ **Agendamento de Auditorias**:
- Tipos: Estágio 1, 2, Vigilância, Especial
- Local: Presencial ou Remota
- Status tracking completo
- Registro de resultados (aprovado/condicional/reprovado)

✅ **Classificação Industrial GSO 2055-2**:
- 3 níveis hierárquicos (Grupo → Categoria → Subcategoria)
- Internacionalização (PT, EN, AR)
- Validação de classificação
- Cálculo de dias de auditoria por categoria

### O Que Falta
🔴 **US-019**: Algoritmo de atribuição automática de analistas
🔴 **US-024**: Assistência IA para análise documental (OCR + NLP)
🔴 **US-026**: Matching inteligente de auditores (distância, especialização, carga)
🔴 **US-029**: Briefing automático por email para auditor

---

## ÉPICO 4: Execução de Auditorias 🟢 95%

### Status Rápido
| US | Título | Status | Notas |
|----|--------|--------|-------|
| US-030 | Dashboard Auditor | ✅ | AuditorDashboard |
| US-031 | Ver Processo | ✅ | ProcessDetails |
| US-032 | Ver Documentação | ✅ | ProcessDocuments |
| US-033 | Checklist Digital | ✅ | AuditExecution (5 seções) |
| US-034 | Upload Evidências | ✅ | EvidenceCapture |
| US-035 | Relatório Auditoria | ✅ | NonConformityForm |
| US-036 | Enviar Relatório | ✅ | Submit workflow |
| US-037 | Histórico | ✅ | AuditorReports |
| US-038 | Notificações | 🟡 | Falta emails |
| US-039 | App Mobile | 🔴 | Futuro (pós-MVP) |

### Código Principal
- Backend: `backend/src/modules/audit-execution/`
- Frontend: `frontend/src/pages/auditor/` (AuditorDashboard, AuditorReports)
- Frontend: `frontend/src/components/audits/` (AuditExecution, EvidenceCapture, NonConformityForm, PreAuditAnalysis)
- Schema: `Audit` (agendamento), dados de execução no service

### O Que Funciona (ÉPICO MAIS COMPLETO)

✅ **Checklist Digital de Auditoria (5 Seções)**:
1. **Matérias-Primas** (5 itens)
   - Certificados Halal de fornecedores
   - Rastreabilidade de ingredientes
   - Armazenamento segregado
   - Controle de origem animal
   - Verificação de aditivos

2. **Produção e Processamento** (6 itens)
   - Segregação de linhas
   - Higienização de equipamentos
   - Prevenção de contaminação cruzada
   - Uso de álcool etílico
   - Controle de processo
   - Documentação de produção

3. **Armazenamento e Transporte** (4 itens)
   - Segregação de produtos Halal
   - Condições de armazenamento
   - Rastreabilidade
   - Transporte adequado

4. **Rotulagem e Identificação** (3 itens)
   - Rótulos corretos
   - Informações obrigatórias
   - Idiomas e símbolos

5. **Sistema de Gestão Halal** (4 itens)
   - Manual de BPF Halal
   - Treinamento de equipe
   - Procedimentos documentados
   - Auditoria interna

**Cada item do checklist tem**:
- Status: CONFORM, MINOR_NC, MAJOR_NC, NA
- Tipo de verificação: DOCUMENT_REVIEW, SITE_INSPECTION, INTERVIEW
- Observações (campo texto)
- Evidências anexadas (fotos, docs)

✅ **Captura de Evidências**:
- Upload de fotos, documentos, vídeos, áudios
- Captura via câmera do dispositivo
- Categorização (conformidade, NC menor, NC maior, geral)
- Sistema de tags
- Preview de imagens
- Anotações visuais (preparado)

✅ **Registro de Não-Conformidades**:
- Classificação de severidade (Maior, Menor, Observação)
- Referências a normas (DT 7.1, GSO 2055-2)
- Descrição detalhada
- Ações corretivas e preventivas
- Atribuição de responsável e prazo
- Upload de evidências específicas
- Geração de número único (NC-YYYY-NNNNNN-NNN)

✅ **Relatório de Auditoria**:
- Geração de número único (HS-AUD-YYYY-NNNNNN)
- Salvamento de progresso (rascunho)
- Submissão com validações:
  - Alerta se itens pendentes
  - Bloqueia se NCs Maiores sem evidências
  - Confirmação com resumo completo
- Status automático baseado em NCs:
  - COMPLIANT (sem NC maior, <5 menores)
  - PENDING_CORRECTIONS (5+ NC menores)
  - NON_COMPLIANT (NC maior detectada)

✅ **Dashboard e Histórico**:
- Lista de auditorias do auditor
- Filtros (status, estágio, busca)
- Estatísticas agregadas
- Ações: visualizar, editar (rascunho), baixar relatório

### O Que Falta
🔴 **US-038**: Notificações por email (depende de EmailService)
🔴 **US-039**: App mobile (React Native - pós-MVP)

---

## ÉPICO 5: Decisão e Emissão de Certificados 🟢 85%

### Status Rápido
| US | Título | Status | Notas |
|----|--------|--------|-------|
| US-040 | Dashboard Comitê | ✅ | ManagerDashboard |
| US-041 | Analisar Relatório | ✅ | Via ProcessDetails |
| US-042 | Decisão Comitê | ✅ | submitCommitteeDecision |
| US-043 | Solicitar Info | 🟡 | Via comentários |
| US-044 | Emitir Certificado | 🔴 | **CRÍTICO MVP** |
| US-045 | Enviar Certificado | 🔴 | **CRÍTICO MVP** |
| US-046 | Consulta Pública | 🔴 | **CRÍTICO MVP** |
| US-047 | Histórico | ✅ | getCommitteeDecisions |
| US-048 | Notificações | 🔴 | Falta emails |

### Código Principal
- Backend: `backend/src/modules/manager/` (ManagerService)
- Frontend: `frontend/src/pages/manager/ManagerDashboard.tsx`
- Schema: `CommitteeDecision`, `Certificate` (existe mas não usado)

### O Que Funciona

✅ **Dashboard do Comitê**:
- Métricas financeiras (MRR, Pipeline, Ticket médio)
- Métricas operacionais (Processos ativos, Dias médios, Taxa de aprovação)
- Métricas de pessoas (Auditores, Analistas, Empresas, Novas empresas/mês)
- Distribuição por fase e setor industrial
- Atividades recentes

✅ **Decisão do Comitê**:
- `submitCommitteeDecision(processId, decision)`
- Tipos de decisão:
  - `aprovar` - Aprovar certificação
  - `reprovar` - Reprovar certificação
  - `solicitar_info` - Solicitar informações adicionais
- Justificativa obrigatória
- Registro em histórico (`CommitteeDecision` model)
- Nome do gestor que decidiu

✅ **Análise de Relatório**:
- Gestor vê relatório completo de auditoria
- Visualização de conformidades e NCs
- Acesso a evidências fotográficas
- Histórico de decisões anteriores

### O Que Falta (BLOQUEADOR MVP)

🔴 **US-044/045/046: Sistema Completo de Certificados**

**Precisa implementar**:

1. **CertificateService** (backend):
   - `generateCertificate(processId)` - Criar registro
   - `generatePDF(certificateId)` - Gerar PDF profissional
   - `generateQRCode(certificateId)` - QR Code para validação
   - `sendCertificate(certificateId)` - Enviar por email
   - `validateCertificate(number)` - API pública de validação
   - `revokeCertificate(id, reason)` - Suspender/cancelar

2. **Template de PDF Profissional**:
   - Logo certificadora + Logo Halal
   - Dados da empresa e produtos certificados
   - Número do certificado (HS-CERT-YYYY-NNNNNN)
   - QR Code para validação
   - Validade (3 anos)
   - Escopo da certificação
   - Assinatura digital (watermark)

3. **Página Pública de Consulta** (frontend):
   - Qualquer pessoa pode validar certificado
   - Input: Número do certificado
   - Exibição:
     - Status (Ativo, Suspenso, Cancelado, Expirado)
     - Empresa certificada
     - Produtos certificados
     - Validade
     - Data de emissão
   - Download do PDF
   - QR Code para validação mobile

4. **Integração com Emails**:
   - Email para empresa com certificado anexo
   - Email de congratulações
   - Próximos passos (auditorias de manutenção)

**Schema já existe**:
- Model `Certificate` com todos os campos necessários
- Enum `CertificateStatus` (ativo, suspenso, cancelado, expirado)

**Referência**: Ver [PROXIMOS-PASSOS-MVP.md](../../../PROXIMOS-PASSOS-MVP.md#2-emissão-de-certificados-digitais-)

---

## ÉPICO 6: Assistente IA Multilíngue 🔴 5%

### Status: NÃO INICIADO (Prioridade P1 - Should Have)

| US | Título | Status | Notas |
|----|--------|--------|-------|
| US-049 | Chatbot RAG | 🔴 | Schema pronto |
| US-050 | Análise Pré-Auditoria | 🔴 | Schema pronto |
| US-051 | Sugestões IA | 🔴 | Não iniciado |
| US-052 | Base Conhecimento | 🔴 | pgvector OK |
| US-053 | Feedback IA | 🔴 | Não iniciado |
| US-054 | Métricas Uso | 🔴 | Não iniciado |

### O Que Existe (Schema Preparado)

✅ **Database**:
- Model `KnowledgeBase` com embedding vector(1536) (pgvector)
- Model `AiAnalysis` (processId, analysisType, result, confidence)
- Model `ChatMessage` (userId, role, content, metadata)
- Enum `AiAnalysisType` (pre_auditoria, risco, chatbot)
- Enum `AiStatus` (pendente, concluido, erro)
- Enum `ChatRole` (user, assistant, system)

✅ **Extension PostgreSQL**:
- `vector` extension habilitada no schema
- Suporta embeddings de 1536 dimensões (OpenAI ada-002 ou similar)

### O Que Falta Implementar

🔴 **US-049: Chatbot RAG Multilíngue** (21 SP):
- Integração com OpenAI GPT-4 ou Claude
- Sistema de embeddings (pgvector)
- Base de conhecimento com normas Halal (GSO 2055-2, DT 7.1)
- Interface de chat no frontend
- Multilíngue (PT, EN, ES, AR)
- Histórico de conversas

🔴 **US-050: Análise IA de Pré-Auditoria** (21 SP):
- OCR de documentos (Tesseract ou Google Vision)
- Extração de informações (ingredientes, fornecedores)
- Identificação de riscos
- Checklist pré-preenchido
- Relatório para auditor

🔴 **US-051: Sugestões de IA para Analistas** (13 SP):
- Sugestão de enquadramento GSO
- Identificação de gaps documentais
- Estimativa de complexidade

🔴 **US-052: Base de Conhecimento (RAG)** (13 SP):
- Upload de documentos PDF (normas, regulamentos)
- Processamento e chunking
- Geração de embeddings
- Busca semântica
- Admin pode gerenciar base

### Por Que Deixar para Pós-MVP

- **Não é bloqueador**: Sistema funciona sem IA
- **Alto custo de desenvolvimento**: 81 SP (~2-3 semanas)
- **Dependências externas**: OpenAI API, custos mensais
- **Complexidade técnica**: RAG, embeddings, OCR

### Quando Implementar

Após MVP funcional, como diferencial competitivo (Inovações #5 e #6).

---

## ÉPICO 7: Gestão Administrativa 🟢 95%

### Status Rápido
| US | Título | Status | Notas |
|----|--------|--------|-------|
| US-055 | Dashboard Gestor | ✅ | ManagerDashboard |
| US-056 | Relatórios | ✅ | 3 tipos implementados |
| US-057 | Config Sistema | ✅ | Storage + ESignature |
| US-058 | Exportação | 🔴 | Não iniciado |
| US-059 | Auditoria | ✅ | AuditTrail |
| US-060 | Renovação | 🔴 | Não iniciado |

### Código Principal
- Backend: `backend/src/modules/manager/`, `admin/`
- Frontend: `frontend/src/pages/manager/ManagerDashboard.tsx`, `UserManagement.tsx`
- Frontend: `frontend/src/pages/admin/` (StorageSettings, ESignatureSettings, UserList, UserForm)
- Schema: `AuditTrail`, `StorageConfig`, `ESignatureConfig`

### O Que Funciona

✅ **Dashboard Gestor (US-055)**:
- **Métricas Financeiras**:
  - MRR (Monthly Recurring Revenue)
  - Pipeline (valor total em negociação)
  - Ticket médio
  - Taxa de conversão (proposta → contrato)
- **Métricas Operacionais**:
  - Processos ativos
  - Dias médios de certificação
  - Taxa de aprovação do comitê
  - Distribuição por fase
  - Distribuição por setor industrial
- **Métricas de Pessoas**:
  - Auditores ativos
  - Analistas ativos
  - Empresas certificadas
  - Novas empresas por mês
- **Atividades Recentes**:
  - Últimas ações no sistema
  - Timeline de eventos importantes

✅ **Relatórios Gerenciais (US-056)**:
1. **Relatório de Certificação** (`getCertificationReport`):
   - Certificados emitidos por período
   - Breakdown por tipo (C1-C6)
   - Tendências

2. **Relatório de Auditorias** (`getAuditReport`):
   - Auditorias realizadas
   - Breakdown por resultado (aprovado/condicional/reprovado)
   - Auditor performance

3. **Relatório de Conformidade SLA** (`getConformityReport`):
   - Processos dentro/fora do prazo
   - Tempo médio por fase
   - Gargalos identificados

✅ **Gestão de Configurações (US-057)**:
- **Storage Settings** (StorageSettings.tsx):
  - Configurar storage local ou S3
  - Credenciais AWS
  - Gerenciar buckets por empresa
- **E-Signature Settings** (ESignatureSettings.tsx):
  - Configurar D4Sign, Clicksign ou Docusign
  - Credenciais das plataformas
  - Configurações de expiração e lembretes
- **Usuários**:
  - CRUD completo (UserList, UserForm, UserManagement)
  - 11 roles diferentes
  - Reset de senha
  - Desbloqueio de contas

✅ **Auditoria de Compliance (US-059)**:
- Model `AuditTrail` registra tudo:
  - Entidade (process, contract, certificate, audit, document, user, company)
  - Ação (create, update, delete, approve, reject, sign, cancel)
  - Quem fez (userId)
  - O que mudou (changes: {before, after})
  - IP address e user agent
  - Timestamp
- Usado em todos os services críticos

### O Que Falta

🔴 **US-058: Exportação de Dados**:
- Exportar para CSV/Excel/PDF
- Relatórios customizáveis
- Agendamento de relatórios automáticos

🔴 **US-060: Renovação de Certificados**:
- Alerta 60 dias antes de expirar
- Processo simplificado de renovação
- Desconto para renovação (0.8x conforme PricingTable)
- Histórico de certificados da empresa

---

## ÉPICO 8: Infraestrutura 🟢 95%

### Status Rápido
| US | Título | Status | Notas |
|----|--------|--------|-------|
| US-059 | Autenticação | ✅ | JWT + bloqueio |
| US-060 | RBAC | ✅ | 11 roles |
| US-061 | Gestão Usuários | ✅ | AdminService |
| US-062 | Logs Auditoria | ✅ | AuditTrail |
| US-063 | Backup | 🟡 | Manual |
| US-064 | Monitoramento | 🔴 | Não iniciado |
| US-065 | i18n | ✅ | Schema pronto |
| US-066 | Storage S3 | ✅ | Configurável |
| US-067 | Email/Notificações | ✅ | Notificações in-app |

### Código Principal
- Backend: `backend/src/modules/auth/`, `admin/`
- Schema: `User`, `AuditTrail`, `StorageConfig`, `ESignatureConfig`

### O Que Funciona

✅ **Autenticação (US-059)**:
- **AuthService** ([backend/src/modules/auth/auth.service.ts](../../backend/src/modules/auth/auth.service.ts)):
  - `login(email, password)` - Retorna JWT token
  - Validação de senha com bcrypt
  - Bloqueio de conta após 5 tentativas (15 minutos)
  - Rastreamento de `lastLogin`
  - Reset de tentativas ao login com sucesso
- **JWT Token**:
  - Payload: `{id, email, role, companyId}`
  - Validade configurável
  - Refresh token (preparado)

✅ **RBAC - 11 Roles (US-060)**:
- `admin` - Acesso total
- `empresa` - Dashboard de empresa, solicitações
- `analista` - Dashboard Kanban, análise de processos
- `comercial` - Elaboração de propostas
- `juridico` - Elaboração de contratos
- `financeiro` - Acesso a relatórios financeiros
- `gestor_auditoria` - Planejamento de auditorias
- `auditor` - Execução de auditorias
- `supervisor` - Comitê técnico
- `controlador` - Emissão de certificados
- `gestor` - Dashboard executivo, relatórios, decisões

**Controle de Acesso**:
- Middleware de role em todas as rotas
- Frontend esconde/mostra componentes por role
- Database queries filtradas por role

✅ **Gestão de Usuários (US-061)**:
- **AdminService** ([backend/src/modules/admin/admin.service.ts](../../backend/src/modules/admin/admin.service.ts)):
  - `listUsers()` - Lista com filtros
  - `createUser()` - CRUD
  - `updateUser()` - CRUD
  - `deleteUser()` - CRUD
  - `getUserStats()` - Estatísticas
  - `resetPassword()` - Reset senha + desbloqueia
  - `unlockUser()` - Desbloqueia conta

✅ **Logs de Auditoria (US-062)**:
- Tudo registrado em `AuditTrail`
- Usado em: ProcessService, ContractService, CertificateService, etc.

✅ **i18n - Internacionalização (US-065)**:
- **Schema preparado**:
  - Enum `Country` (BR, CO, PY)
  - Enum `Language` (PT_BR, ES)
  - Enum `Currency` (BRL, COP, PYG)
  - Enum `TaxIdType` (CNPJ, CPF, NIT, RUT, RUC, CI)
- **Models com campos multilíngues**:
  - `IndustrialGroup`: name, nameEn, nameAr, description, descriptionEn, descriptionAr
  - `IndustrialCategory`: idem
  - `IndustrialSubcategory`: idem + examples[], examplesEn[], examplesAr[]
- **Company model**:
  - `country`, `taxId`, `taxIdType`, `currency`, `language`
  - Validação de taxId por país
  - Formatação automática de taxId

✅ **Storage de Arquivos (US-066)**:
- **StorageConfig** model:
  - Provider: `local` ou `s3`
  - Configurações S3 (region, accessKeyId, secretAccessKey, endpoint)
  - Configurações locais (localPath)
  - `isActive` - apenas 1 config ativa por vez
- **CompanyBucket** model:
  - Bucket por empresa
  - Tracking de tamanho e contagem de arquivos
  - Última sincronização

### O Que Falta (CRÍTICO MVP)

🔴 **US-067: Email Transacional** (5 SP):
- **EmailService** não implementado
- Sem SendGrid/AWS SES
- Sem templates de email
- Bloqueia: Notificações, confirmações, alertas

**Prioridade MÁXIMA** - Ver [PROXIMOS-PASSOS-MVP.md](../../../PROXIMOS-PASSOS-MVP.md#1-sistema-de-emails-transacionais--crítico)

### O Que Falta (Pós-MVP)

🔴 **US-063: Backup Automatizado**:
- Backup manual apenas
- Sem restore automático
- Sem agendamento

🔴 **US-064: Monitoramento**:
- Sem Sentry ou DataDog
- Sem alertas de erro
- Sem tracking de performance
- Sem logs centralizados

---

## 🔥 Prioridades CRÍTICAS para MVP

### 1. Sistema de Emails (3-5 dias) 🚨
**Bloqueador**: Sem emails, sistema não notifica ninguém

**Implementar**:
- SendGrid ou AWS SES
- EmailService no backend
- 8 templates de email
- Integração com todos os eventos

**Impacto**: Desbloqueia US-006, US-038, US-048, US-067

### 2. Emissão de Certificados (5-7 dias) 🚨
**Bloqueador**: Fim do processo, sem isso não há certificação

**Implementar**:
- CertificateService
- Template de PDF profissional
- QR Code
- Página pública de consulta
- Envio por email

**Impacto**: Completa Épico 5 (US-044, US-045, US-046)

### 3. Assinatura Eletrônica (5-7 dias) 🚨
**Bloqueador**: Sem assinatura, contratos não têm validade jurídica

**Implementar**:
- Integração D4Sign/Docusign
- Webhook handler
- UI de acompanhamento

**Impacto**: Completa US-017

---

## 📋 Checklist de Entrega para Desenvolvedor

### Antes de Começar
- [ ] Ler [ANALISE-PROJETO-EPICOS-2025.md](../../ANALISE-PROJETO-EPICOS-2025.md)
- [ ] Ler [PROXIMOS-PASSOS-MVP.md](../../../PROXIMOS-PASSOS-MVP.md)
- [ ] Setup local (seguir SETUP.md se existir)
- [ ] Banco de dados rodando (PostgreSQL 16 + pgvector)
- [ ] Backend rodando (`npm run dev`)
- [ ] Frontend rodando (`npm run dev`)

### Para Completar MVP
- [ ] Implementar EmailService (Prioridade 1)
- [ ] Implementar CertificateService (Prioridade 2)
- [ ] Integrar D4Sign (Prioridade 3)
- [ ] Criar templates de PDF (Prioridade 4)
- [ ] Testar fluxo end-to-end completo
- [ ] Corrigir bugs críticos
- [ ] Testes de segurança básicos
- [ ] Deploy em staging

### Para Pós-MVP
- [ ] Sistema de IA (Chatbot RAG + Análise)
- [ ] Contratos colaborativos
- [ ] Matching de auditores
- [ ] Exportação de dados
- [ ] Renovação automática
- [ ] Monitoramento (Sentry)
- [ ] Backup automatizado

---

## 📞 Recursos e Referências

### Documentação Principal
- **PRD Completo**: [docs/01-prd/](../../01-prd/)
- **Arquitetura Técnica**: [docs/02-technical/](../../02-technical/)
- **Guia UX**: [docs/03-ux/](../../03-ux/)

### Código
- **Backend**: [backend/src/](../../../backend/src/)
- **Frontend**: [frontend/src/](../../../frontend/src/)
- **Schema**: [backend/prisma/schema.prisma](../../../backend/prisma/schema.prisma)

### Suporte
- **Issues**: Criar issue no GitHub
- **Documentação de Implementação**: [docs/IMPLEMENTATION-HISTORY/](../../IMPLEMENTATION-HISTORY/)

---

**Documento gerado**: 16 de Dezembro de 2025
**Última atualização**: 24 de Janeiro de 2026
**Status**: MVP em Produção desde 23/01/2026
**Revisão de Épicos**: Headers de status atualizados em todos os 9 épicos
**Mantenedor**: Equipe HalalSphere
