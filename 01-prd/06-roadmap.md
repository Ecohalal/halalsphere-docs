# 6. Roadmap e Faseamento

> **Status Atualizado**: MVP em Produção desde 23 de Janeiro de 2026
> **URL Produção**: https://halalsphere.ecohalal.solutions

## 6.1 Estratégia de Entrega

### Filosofia de Desenvolvimento

O HalalSphere foi desenvolvido em **fases incrementais**, priorizando valor de negócio e redução de risco. A estratégia seguiu os princípios:

1. **MVP First**: Entregar ciclo completo de certificação inicial (primeira certificação) o mais rápido possível
2. **Validação Contínua**: Cada fase é validada com usuários reais antes de prosseguir
3. **Inovações Gradualmente**: Recursos de IA são introduzidos após fundação sólida
4. **Escalabilidade Progressiva**: Começar com 50-100 processos, escalar para 600-700

---

## 6.2 Definição do MVP (Minimum Viable Product)

### Escopo do MVP

**Objetivo**: Cobrir o **ciclo completo de certificação inicial** de uma empresa, conforme PR 7.1, do início ao fim.

**O que ESTÁ no MVP** ✅:
- **Épico 1 (Completo)**: Gestão de Solicitações - 8 stories (57 SP)
  - Cadastro de empresa
  - Formulário estruturado de solicitação (5 etapas)
  - Upload de documentos
  - Dashboard de status (12 fases)
  - Notificações automáticas
- **Épico 2 (Completo)**: Gestão Comercial e Contratual - 9 stories (81 SP)
  - Calculadora inteligente de custos ⭐ (Inovação #1)
  - Geração automática de proposta
  - Contratos colaborativos por cláusulas ⭐ (Inovação #3)
  - Assinatura digital integrada
- **Épico 3 (Parcial - 8 de 12 stories)**: Análise e Preparação - ~60 SP
  - Dashboard Kanban para analistas
  - Atribuição de processos
  - Revisão de solicitação
  - Enquadramento GSO/SMIIC
  - Checklist de Estágio 1
  - Solicitação de documentos complementares
  - ❌ **Fora do MVP**: Calendário inteligente de auditorias (Inovação #4)
  - ❌ **Fora do MVP**: Assistência IA para análise documental
- **Épico 4 (Parcial - 6 de 10 stories)**: Execução de Auditorias - ~50 SP
  - Agenda mobile para auditores
  - Checklist personalizado por categoria
  - Registro de evidências com fotos
  - Identificação de NCs in loco
  - Geração automática de relatório
  - ❌ **Fora do MVP**: IA de Pré-Auditoria (Inovação #2)
  - ❌ **Fora do MVP**: Modo offline completo
- **Épico 5 (Completo)**: Decisão e Emissão - 9 stories (60 SP)
  - Comitê técnico digital
  - Deliberação individual e reunião virtual
  - Geração automática de certificado
  - Validação pública via QR code
- **Épico 6 (Parcial - 2 de 6 stories)**: Assistente IA - ~25 SP
  - Chatbot básico (FAQ estático)
  - ❌ **Fora do MVP**: Base RAG completa (Inovação #5)
  - ❌ **Fora do MVP**: OCR inteligente
  - ❌ **Fora do MVP**: Classificação automática GSO/SMIIC
- **Épico 7 (Parcial - 4 de 6 stories)**: Gestão Administrativa - ~30 SP
  - Dashboard executivo básico
  - Relatórios de conformidade ISO 17065
  - Gestão de usuários
  - RBAC básico
  - ❌ **Fora do MVP**: Analytics avançado
  - ❌ **Fora do MVP**: Exportação BI
- **Épico 8 (Completo)**: Infraestrutura - 9 stories (79 SP)
  - MFA
  - JWT e gestão de sessões
  - Notificações (E-mail/SMS/Push)
  - Storage (S3/Azure Blob)
  - Audit trail completo
  - i18n (4 idiomas)

**O que NÃO está no MVP** ❌:
- Auditorias de manutenção anual (PR 7.1 10.10)
- Renovação trienal completa (PR 7.1 seção 13)
- Extensão de escopo (PR 7.1 10.9.3)
- Testes laboratoriais (PR 7.1 10.8)
- Suspensão/Cancelamento/Término de certificados (PR 7.1 11, 12, 14)
- Integração com ERP/Contabilidade externos
- App mobile nativo (apenas mobile web responsivo no MVP)

**Total do MVP**: **~37 stories, ~442 SP (~11 sprints de 2 semanas)**

---

## 6.3 Fases de Desenvolvimento

### Fase 0: Fundação e Planejamento (2 semanas)

**Objetivo**: Preparar infraestrutura técnica e design antes do desenvolvimento.

**Entregas**:
- [x] **Arquitetura técnica detalhada**:
  - Stack definido (React 19 + Vite 7, NestJS 11 + Express, TypeScript, Tailwind CSS, PostgreSQL 16, Prisma 7)
  - Estrutura de pastas e padrões de código
  - CI/CD pipeline (AWS CodePipeline + CodeBuild)
  - Ambientes (dev, staging, production)
- [x] **Design System implementado** (baseado no UX Design Guide):
  - Biblioteca de componentes shadcn/ui + custom
  - Tokens de design (cores, spacing, tipografia)
  - Componentes base (Button, Input, Card, Modal, etc)
- [x] **Setup de infraestrutura**:
  - Banco de dados PostgreSQL 16 (AWS)
  - Storage S3 para documentos
  - CI/CD AWS CodePipeline + CodeBuild
  - Ambientes: Dev, Staging, Production
- [x] **Protótipos de alta fidelidade**:
  - Wizard de solicitação (9 etapas)
  - Dashboard Kanban (analistas)
  - App mobile (auditores)

**Equipe**: Tech Lead, Arquiteto, Designer, DevOps

---

### Fase 1: MVP Core - Ciclo Básico (8 semanas / 4 sprints)

**Objetivo**: Implementar o fluxo básico de certificação sem automações de IA.

**Sprint 1-2 (4 semanas): Solicitação e Dashboard**
- ✅ **Épico 1 (Completo)**: Gestão de Solicitações (57 SP)
  - US-001: Cadastro de empresa
  - US-002: Formulário de solicitação (5 etapas)
  - US-003: Upload de documentos
  - US-004: Dashboard de status (12 fases)
  - US-005: Notificações automáticas
  - US-006-008: Checklist, NCs, evidências
- ✅ **Épico 8 (Parcial)**: Infraestrutura base (40 SP)
  - US-061: MFA
  - US-062: JWT e sessões
  - US-063: E-mail transacional
  - US-067: Storage S3
  - US-069: i18n (4 idiomas)

**Entrega Sprint 2**:
- ✅ Empresas podem criar conta e submeter solicitação completa
- ✅ Analistas veem solicitações em lista básica
- ✅ E-mails de confirmação funcionando
- ✅ Documentos armazenados no S3

**Sprint 3-4 (4 semanas): Proposta Comercial e Contratos**
- ✅ **Épico 2 (Completo)**: Gestão Comercial e Contratual (81 SP)
  - US-009-010: Configuração de preços + Calculadora ⭐
  - US-011-013: Geração de proposta + Templates
  - US-014-017: Contratos colaborativos ⭐ + Assinatura digital
- ✅ **Épico 3 (Parcial)**: Análise básica (30 SP)
  - US-018: Dashboard Kanban
  - US-019: Atribuição automática
  - US-020: Revisão de solicitação

**Entrega Sprint 4**:
- ✅ Analista revisa solicitação e gera proposta automaticamente
- ✅ Calculadora de custos funcionando (Inovação #1)
- ✅ Empresa recebe proposta, negocia contrato cláusula por cláusula (Inovação #3)
- ✅ Assinatura digital integrada (DocuSign/D4Sign)
- ✅ Dashboard Kanban funcionando

**Validação Fase 1**:
- [ ] **3 empresas reais** completam solicitação e recebem proposta
- [ ] **2 analistas** testam revisão e geração de proposta
- [ ] **Taxa de conclusão de solicitação > 80%**
- [ ] **Tempo médio de proposta < 15min** (vs. horas manualmente)

---

### Fase 2: Auditoria e Decisão (6 semanas / 3 sprints)

**Objetivo**: Completar ciclo de certificação com auditoria e emissão de certificado.

**Sprint 5-6 (4 semanas): Análise Documental e Auditoria**
- ✅ **Épico 3 (Complemento)**: Análise e Preparação (30 SP)
  - US-021: Enquadramento GSO/SMIIC
  - US-022: Checklist de Estágio 1
  - US-023: Solicitação de docs complementares
  - US-025: Cadastro de auditores
- ✅ **Épico 4 (Básico)**: Execução de Auditorias (50 SP)
  - US-030: Agenda mobile
  - US-032: Checklist personalizado
  - US-033: Registro de evidências com fotos
  - US-034: Identificação de NCs in loco
  - US-035: Geração automática de relatório
  - US-037: Acompanhamento de NCs

**Entrega Sprint 6**:
- ✅ Analista realiza análise documental (Estágio 1) com checklist digital
- ✅ Analista cadastra auditores e agenda auditoria manualmente
- ✅ Auditor acessa app mobile, registra evidências e NCs
- ✅ Relatório de auditoria gerado automaticamente

**Sprint 7 (2 semanas): Comitê e Emissão**
- ✅ **Épico 5 (Completo)**: Decisão e Emissão (60 SP)
  - US-040-045: Comitê técnico digital
  - US-046-048: Emissão de certificado + QR code

**Entrega Sprint 7**:
- ✅ Comitê técnico vota digitalmente (individual + reunião virtual)
- ✅ Certificado PDF gerado automaticamente com QR code
- ✅ Validação pública de certificados funcionando
- ✅ **Primeiro ciclo completo de certificação finalizado!**

**Validação Fase 2**:
- [ ] **1 empresa** completa ciclo de certificação de ponta a ponta
- [ ] **3 auditores** testam app mobile em auditorias reais
- [ ] **5 membros do comitê** deliberam digitalmente
- [ ] **Certificado emitido em < 7 dias após auditoria** (vs. 30+ dias)
- [ ] **SUS (System Usability Scale) > 75**

---

### Fase 3: Automações de IA - Core (8 semanas / 4 sprints)

**Objetivo**: Implementar as 6 inovações tecnológicas de IA.

**Sprint 8-9 (4 semanas): IA de Pré-Auditoria e Chatbot RAG**
- ✅ **Épico 4 (IA)**: IA de Pré-Auditoria ⭐ (21 SP)
  - US-031: Análise automática de documentos antes da auditoria
  - Extração de produtos, ingredientes, fornecedores
  - Identificação de matérias-primas críticas
  - Geração de resumo executivo
- ✅ **Épico 6 (IA)**: Assistente IA Multilíngue ⭐ (55 SP)
  - US-049: Base RAG (PR 7.1 + GSO + SMIIC)
  - US-050: Chatbot multilíngue (4 idiomas)
  - US-051: Integração com contexto de processo

**Entrega Sprint 9**:
- ✅ Auditor recebe relatório de IA antes da auditoria (Inovação #2)
- ✅ Chatbot RAG responde dúvidas sobre PR 7.1 em 4 idiomas (Inovação #5)
- ✅ **Tempo de auditoria reduzido em 30%**

**Sprint 10-11 (4 semanas): OCR e Calendário Inteligente**
- ✅ **Épico 6 (OCR)**: OCR e Classificação (26 SP)
  - US-052: OCR inteligente de documentos
  - US-053: Classificação automática GSO/SMIIC
  - US-054: Verificação de conformidade PR 7.1
- ✅ **Épico 3 (Calendário)**: Calendário Inteligente ⭐ (34 SP)
  - US-026: Matching inteligente de auditores
  - US-027: Agendamento colaborativo
  - US-028: Calendário visual
  - US-029: Briefing automático

**Entrega Sprint 11**:
- ✅ Documentos escaneados são automaticamente extraídos via OCR
- ✅ Produtos classificados automaticamente em categorias GSO/SMIIC
- ✅ Calendário inteligente sugere melhores auditores (Inovação #4)
- ✅ **Tempo de agendamento < 1 dia** (vs. 5-7 dias manualmente)

**Validação Fase 3**:
- [ ] **IA de Pré-Auditoria**: Identificar 90%+ das NCs óbvias
- [ ] **Chatbot**: Resolver 60-70% das dúvidas sem humano
- [ ] **Calendário**: Reduzir conflitos de agenda em 80%
- [ ] **Satisfação do auditor com IA > 4/5**

---

### Fase 4: Escalabilidade e Otimização (6 semanas / 3 sprints)

**Objetivo**: Preparar sistema para 600-700 processos simultâneos.

**Sprint 12-13 (4 semanas): Performance e Alta Disponibilidade**
- ✅ **Épico 7 (Analytics)**: Gestão Administrativa Completa (15 SP)
  - US-059: Analytics avançado
  - US-060: Exportação BI
- ✅ **Épico 4 (Offline)**: Modo Offline para Auditorias (13 SP)
  - US-038: Sincronização offline completa
- ✅ **Épico 8 (Notificações)**: WhatsApp Business (13 SP)
  - US-066: Integração WhatsApp
- ✅ **Otimizações técnicas**:
  - Caching Redis para queries frequentes
  - Lazy loading no Kanban (Solução para alto volume)
  - Virtualização de listas longas (react-window)
  - Compressão de imagens (sharp, cloudinary)
  - CDN para assets estáticos

**Entrega Sprint 13**:
- ✅ Sistema suporta 200+ processos simultâneos sem degradação
- ✅ Kanban com lazy loading (top 5 cards + "Carregar mais")
- ✅ Auditores trabalham offline em áreas sem internet
- ✅ Notificações via WhatsApp funcionando

**Sprint 14 (2 semanas): Testes de Carga e Go-Live**
- [ ] **Testes de carga**:
  - 500 usuários simultâneos
  - 1000 processos ativos
  - Upload de 100 documentos/hora
- [ ] **Testes de segurança**:
  - Penetration testing (OWASP Top 10)
  - Auditoria de código (SonarQube)
  - Revisão de LGPD e ISO 17065
- [ ] **Treinamento de usuários**:
  - 3 analistas treinados
  - 5 auditores treinados
  - 5 membros do comitê treinados
  - Manuais e vídeos criados
- [ ] **Migração de dados**:
  - Importar empresas existentes (600-700)
  - Importar histórico de certificados
- [ ] **Go-Live em produção**

**Validação Fase 4**:
- [ ] **Performance**: Dashboard Kanban carrega em <2s com 600 processos
- [ ] **Disponibilidade**: 99.9% uptime (máx 43min downtime/mês)
- [ ] **Segurança**: 0 vulnerabilidades críticas (OWASP)
- [ ] **LGPD**: 100% compliance com auditoria externa

---

## 6.4 Roadmap Visual

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 0: Fundação (2 sem)                                        │
│ ├─ Setup técnico, Design System, Protótipos                    │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1: MVP Core (8 sem / 4 sprints)                          │
│ ├─ Sprint 1-2: Solicitação + Dashboard                         │
│ │   ✅ Épico 1: Gestão de Solicitações (57 SP)                │
│ │   ✅ Épico 8: Infraestrutura base (40 SP)                    │
│ ├─ Sprint 3-4: Proposta + Contratos                            │
│ │   ✅ Épico 2: Gestão Comercial (81 SP) ⭐                    │
│ │   ✅ Épico 3: Análise básica (30 SP)                         │
│ └─ Validação: 3 empresas + 2 analistas                         │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 2: Auditoria e Decisão (6 sem / 3 sprints)               │
│ ├─ Sprint 5-6: Análise Documental + Auditoria                  │
│ │   ✅ Épico 3: Análise complemento (30 SP)                    │
│ │   ✅ Épico 4: Auditoria básica (50 SP)                       │
│ ├─ Sprint 7: Comitê + Emissão                                  │
│ │   ✅ Épico 5: Decisão e Emissão (60 SP)                      │
│ └─ Validação: 1 ciclo completo ponta a ponta                   │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 3: Automações de IA (8 sem / 4 sprints)                  │
│ ├─ Sprint 8-9: IA de Pré-Auditoria + Chatbot RAG               │
│ │   ⭐ Épico 4: IA Pré-Auditoria (21 SP) - Inovação #2        │
│ │   ⭐ Épico 6: Chatbot RAG (55 SP) - Inovação #5             │
│ ├─ Sprint 10-11: OCR + Calendário Inteligente                  │
│ │   ⭐ Épico 6: OCR e Classificação (26 SP)                    │
│ │   ⭐ Épico 3: Calendário Inteligente (34 SP) - Inovação #4  │
│ └─ Validação: IA identifica 90%+ NCs, Chatbot 70% resolução   │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4: Escalabilidade (6 sem / 3 sprints)                    │
│ ├─ Sprint 12-13: Performance + Alta Disponibilidade            │
│ │   ✅ Épico 7: Analytics avançado (15 SP)                     │
│ │   ✅ Épico 4: Modo Offline (13 SP)                           │
│ │   ✅ Épico 8: WhatsApp (13 SP)                               │
│ │   ✅ Otimizações: Lazy loading, caching, CDN                │
│ ├─ Sprint 14: Testes de Carga + Go-Live                        │
│ │   🚀 Migração de 600-700 empresas                            │
│ │   🚀 Treinamento de equipe                                   │
│ │   🚀 Go-Live em produção                                     │
│ └─ Validação: 600 processos simultâneos, 99.9% uptime         │
└─────────────────────────────────────────────────────────────────┘

Total: 30 semanas (7.5 meses) até Go-Live
```

---

## 6.5 Cronograma Realizado

| Fase | Status | Story Points | Data Conclusão | Milestone |
|------|--------|--------------|----------------|-----------|
| **Fase 0** | ✅ Concluída | - | Q2 2025 | ✅ Fundação Pronta |
| **Fase 1** | ✅ Concluída | 208 SP | Q3 2025 | ✅ MVP Core |
| **Fase 2** | ✅ Concluída | 140 SP | Q4 2025 | ✅ Ciclo Completo |
| **Fase 3** | ✅ Concluída | 136 SP | Q4 2025 | ✅ Migração NestJS |
| **Fase 4** | ✅ Concluída | 41 SP | 23/01/2026 | 🚀 **Go-Live Produção** |
| **TOTAL** | **✅ 95% Implementado** | **525 SP** | **23/01/2026** | 🎉 **EM PRODUÇÃO** |

**Status Atual (Janeiro 2026)**:
- ✅ 301 endpoints de API documentados
- ✅ Sistema em produção desde 23/01/2026
- ✅ Grupos Empresariais 93.5% concluído (Fases 1-7)
- ✅ Integração CNPJ Lookup implementada
- 🔄 Testes E2E frontend pendentes

---

## 6.6 Critérios de Sucesso por Fase

### Fase 1 (MVP Core) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Taxa de conclusão de solicitação | **>80%** | % de empresas que completam todas as 5 etapas |
| Tempo médio de solicitação | **<15min** | Mediana de tempo desde início até submit |
| Tempo de geração de proposta | **<5min** | Desde analista clicar até PDF gerado |
| Taxa de aceitação de proposta | **>60%** | % de propostas aceitas vs enviadas |
| SUS (System Usability Scale) | **>70** | Questionário com 5 empresas + 2 analistas |

### Fase 2 (Ciclo Completo) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Tempo de certificação (solicitação → certificado) | **<60 dias** | Mediana de tempo do ciclo completo |
| Tempo de auditoria in loco | **<4h** | Mediana de tempo de auditoria presencial |
| % de relatórios com erros | **<5%** | Relatórios que precisam correção |
| Tempo de decisão do comitê | **<7 dias** | Desde submissão até decisão final |
| Certificados emitidos | **≥3** | Número de certificados emitidos na fase |

### Fase 3 (IA) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **IA Pré-Auditoria**: Precisão na identificação de NCs | **>90%** | NCs identificadas pela IA vs identificadas pelo auditor |
| **Chatbot RAG**: Taxa de resolução sem humano | **60-70%** | % de conversas finalizadas sem escalação |
| **Calendário**: Redução de conflitos de agenda | **>80%** | Conflitos antes vs depois |
| **OCR**: Precisão de extração de texto | **>95%** | % de documentos extraídos corretamente |
| Satisfação com IA | **>4/5** | Questionário com auditores e analistas |

### Fase 4 (Escalabilidade) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Processos simultâneos suportados | **600-700** | Teste de carga |
| Tempo de carregamento do Kanban | **<2s** | p95 com 600 processos |
| Uptime | **99.9%** | Monitoramento contínuo (máx 43min downtime/mês) |
| Vulnerabilidades críticas | **0** | Scan OWASP + Penetration test |
| Taxa de adoção do sistema | **>90%** | % de processos gerenciados no sistema vs fora |

---

## 6.7 Dependências Críticas entre Fases

**Fase 1 → Fase 2**:
- ✅ Dashboard Kanban funcional (US-018) é **pré-requisito** para analistas gerenciarem auditorias
- ✅ Upload de documentos (US-003) é **pré-requisito** para análise documental
- ✅ Notificações (US-005) são **pré-requisito** para comunicação entre stakeholders

**Fase 2 → Fase 3**:
- ✅ Agenda de auditorias (US-030) é **pré-requisito** para calendário inteligente
- ✅ Documentos armazenados é **pré-requisito** para IA de pré-auditoria
- ✅ Histórico de processos é **pré-requisito** para classificação automática

**Fase 3 → Fase 4**:
- ✅ IA funcionando é **pré-requisito** para analytics avançado
- ✅ Volume de dados é **pré-requisito** para validar escalabilidade

---

## 6.8 Próximas Fases (2026)

### Fase 5: Grupos Empresariais (Q1 2026 - 🟢 93.5% CONCLUÍDO)
- ✅ Schema e migrations de grupos empresariais
- ✅ Backend completo para grupos e onboarding
- ✅ Frontend de gestão de grupos e onboarding
- ✅ Integração CNPJ Lookup (BrasilAPI, ReceitaWS, CNPJ.ws)
- 🔄 Testes E2E frontend pendentes (8.2-8.3)

### Fase 6: Gestão do Ciclo de Vida (Q2 2026)
- Auditorias de manutenção anual (PR 7.1 10.10)
- Renovação trienal automatizada (PR 7.1 seção 13)
- Extensão de escopo simplificada (PR 7.1 10.9.3)
- Gestão de suspensão/cancelamento (PR 7.1 11, 12)

### Fase 7: Integrações Externas (Q3 2026)
- API pública para parceiros
- Integração com ERPs (SAP, TOTVS, etc)
- Integração com sistemas de contabilidade
- Integração com laboratórios de análise

### Fase 8: Advanced Analytics e IA (Q4 2026)
- Chatbot RAG com base de conhecimento
- Predição de probabilidade de aprovação
- Detecção de fraudes com ML
- Recomendação de melhorias para empresas

### Fase 9: Mobile Nativo (2027)
- App nativo iOS para auditores
- App nativo Android para auditores
- Modo offline 100% (sync bidirecional)

---

