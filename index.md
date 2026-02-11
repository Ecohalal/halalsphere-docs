---
layout: default
title: HalalSphere Docs
---

# HalalSphere - Central de Documentacao

**Sistema de Gestao de Certificacao Halal**

![Docs](https://img.shields.io/badge/docs-latest-blue.svg)
![Version](https://img.shields.io/badge/version-2.0-green.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

---

## 🚀 MVP EM PRODUÇÃO

**Data de Lançamento**: 23 de Janeiro de 2026
**URL Produção**: https://halalsphere.ecohalal.solutions
**API Docs**: 301 endpoints documentados (OpenAPI/Swagger)

---

## Ultima Atualizacao

| Data | Documento | Categoria |
|------|-----------|-----------|
| **2026-01-23** | [FICHA-TECNICA-PROJETO](01-prd/FICHA-TECNICA-PROJETO.md) | **MVP em Produção** |
| **2026-01-23** | [Status Implementação](01-prd/05-user-stories/STATUS-IMPLEMENTACAO-TODOS-EPICOS.md) | **95% Implementado** |
| **2026-01-23** | [Backlog Grupos Empresariais](ANALYSIS/BACKLOG-GRUPOS-EMPRESARIAIS.md) | Analise - **Fases 1-7 concluidas (93.5%)** |
| 2026-01-21 | [Analise Conformidade PR 7.1](ANALYSIS/ANALISE-CONFORMIDADE-PR71-REV22.md) | Analise |
| 2026-01-21 | [Analise Layouts Certificados](ANALYSIS/ANALISE-LAYOUTS-CERTIFICADOS.md) | Analise |

---

## Indice por Categoria

| Categoria | Descricao | Qtd |
|-----------|-----------|-----|
| [Requisitos](#requisitos) | PRD, User Stories, Epicos | 15+ |
| [Arquitetura](#arquitetura) | Decisoes tecnicas, infraestrutura | 35+ |
| [Processo](#processo-certificacao) | Fluxos, 17 fases, wizard | 21 |
| [Implementacao](#implementacao) | Status, historico, sprints | 35+ |
| [Guias](#guias) | Setup, testes, troubleshooting | 27 |
| [Changelog](#changelog) | Correcoes, atualizacoes | 20 |
| [Analise](#analise) | Mapeamentos, diagnosticos, backlogs | 10 |
| [Planejamento](#planejamento) | Roadmaps, migracao | 10 |

---

## Requisitos

### PRD e Documentos de Produto

| Documento | Descricao |
|-----------|-----------|
| [PRD v2](01-prd/prd-v2.md) | Product Requirements Document (versao atual) |
| [PRD v1](01-prd/prd.md) | Product Requirements Document (legado) |
| [Project Brief](01-prd/halalsphere-project-brief.md) | Brief completo do projeto |
| [Project Brief (EN)](01-prd/project-brief.md) | Brief em ingles |
| [Ficha Tecnica](01-prd/FICHA-TECNICA-PROJETO.md) | Especificacoes tecnicas gerais |

### User Stories por Epico

| Epico | Descricao | Status |
|-------|-----------|--------|
| [Epico 01](01-prd/05-user-stories/epic-01-requests.md) | Gestao de Solicitacoes | [Status](01-prd/05-user-stories/EPIC-01-STATUS.md) |
| [Epico 02](01-prd/05-user-stories/epic-02-contracts.md) | Gestao Comercial | - |
| [Epico 03](01-prd/05-user-stories/epic-03-analysis.md) | Analise e Preparacao | - |
| [Epico 04](01-prd/05-user-stories/epic-04-audits.md) | Execucao de Auditorias | - |
| [Epico 05](01-prd/05-user-stories/epic-05-decision.md) | Decisao e Certificados | - |
| [Epico 06](01-prd/05-user-stories/epic-06-ai.md) | Assistente IA | - |
| [Epico 07](01-prd/05-user-stories/epic-07-admin.md) | Gestao Administrativa | - |
| [Epico 08](01-prd/05-user-stories/epic-08-infra.md) | Infraestrutura | - |
| [Epico 09](01-prd/05-user-stories/epic-09-auto-cadastro.md) | Auto Cadastro | - |

[Ver Status de Todos os Epicos](01-prd/05-user-stories/STATUS-IMPLEMENTACAO-TODOS-EPICOS.md)

---

## Arquitetura

### Decisoes Arquiteturais

| Documento | Categoria |
|-----------|-----------|
| [Technical Architecture](02-technical/technical-architecture.md) | Visao Geral |
| [Backend Implementado](ARCHITECTURE/BACKEND-IMPLEMENTADO.md) | Backend |
| [Backend API Reference](ARCHITECTURE/BACKEND-API-REFERENCE.md) | Backend |
| [Sistema Kanban](ARCHITECTURE/KANBAN_IMPLEMENTATION.md) | Backend |
| [Internacionalizacao](ARCHITECTURE/INTERNACIONALIZACAO-SISTEMA.md) | Backend |
| [Analyst Process APIs](ARCHITECTURE/ANALYST_PROCESS_APIS.md) | Backend |
| [Perfil Administrador](ARCHITECTURE/PERFIL-ADMINISTRADOR.md) | Backend |

### Modulos Comerciais

| Documento | Categoria |
|-----------|-----------|
| [Modulo Proposta Comercial](ARCHITECTURE/MODULO_PROPOSTA_COMERCIAL.md) | Comercial |
| [Frontend Proposta Comercial](ARCHITECTURE/FRONTEND_PROPOSTA_COMERCIAL.md) | Comercial |
| [Proposta Modulo Certificados](ARCHITECTURE/PROPOSTA-MODULO-CERTIFICADOS.md) | Certificados |
| [Provedores Assinatura](ARCHITECTURE/PROPOSTA-PROVEDORES-ASSINATURA-EXCECOES.md) | Contratos |
| [Ajustes Processo Certificacao](ARCHITECTURE/PROPOSTA-AJUSTES-PROCESSO-CERTIFICACAO.md) | Processo |

### Alocacao de Auditores

| Documento | Categoria |
|-----------|-----------|
| [README Alocacao](ARCHITECTURE/README-ALOCACAO-AUDITORES.md) | Visao Geral |
| [Gestao Alocacao Auditores](ARCHITECTURE/GESTAO-ALOCACAO-AUDITORES.md) | Gestao |
| [Fluxo Alocacao Auditores](ARCHITECTURE/FLUXO-ALOCACAO-AUDITORES.md) | Fluxos |
| [ROI Alocacao Auditores](ARCHITECTURE/ROI-ALOCACAO-AUDITORES.md) | Metricas |
| [Resumo Executivo Alocacao](ARCHITECTURE/RESUMO-EXECUTIVO-ALOCACAO.md) | Resumo |

### Kanban e Fases

| Documento | Categoria |
|-----------|-----------|
| [Analise Fases Kanban](ARCHITECTURE/ANALISE-FASES-KANBAN.md) | Analise |
| [Relatorio Diagnostico Kanban](ARCHITECTURE/RELATORIO-DIAGNOSTICO-KANBAN.md) | Diagnostico |
| [Solucao Processos Sumindo](ARCHITECTURE/SOLUCAO-PROCESSOS-SUMINDO.md) | Correcao |

### Infraestrutura AWS

| Documento | Categoria |
|-----------|-----------|
| [AWS Infra Changes 2026](ARCHITECTURE/AWS-INFRA-CHANGES-2026.md) | AWS |
| [AWS Migration Checklist](ARCHITECTURE/AWS-MIGRATION-CHECKLIST.md) | AWS |
| [AWS Config Management](ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md) | AWS |
| [Terraform Integration](ARCHITECTURE/TERRAFORM-CONFIG-INTEGRATION.md) | Terraform |
| [ConfigLoader Update](ARCHITECTURE/CONFIGLOADER-UPDATE-GUIDE.md) | Config |
| [Configuracao Armazenamento](ARCHITECTURE/CONFIGURACAO-ARMAZENAMENTO.md) | Storage |

### Migracoes

| Documento | Categoria |
|-----------|-----------|
| [Industrial Classification Migration](ARCHITECTURE/INDUSTRIAL_CLASSIFICATION_MIGRATION.md) | Dados |

### Banco de Dados

| Documento | Tipo |
|-----------|------|
| [ERD - Diagrama](02-technical/03-database/01-erd.md) | Diagrama |
| [Dicionario de Dados](02-technical/03-database/02-data-dictionary.md) | Referencia |
| [DDL Statements](02-technical/03-database/03-ddl.md) | SQL |
| [Indices](02-technical/03-database/04-indexes.md) | SQL |
| [Migracoes](02-technical/03-database/05-migrations.md) | SQL |

---

## Processo Certificacao

### Documentos Principais

| Documento | Descricao |
|-----------|-----------|
| [17 Fases do Processo](PROCESS/17-FASES-PROCESSO-CERTIFICACAO.md) | Todas as fases detalhadas |
| [Processo Completo Final](PROCESS/PROCESSO-CERTIFICACAO-COMPLETO-FINAL.md) | Visao consolidada |
| [Analise Estrutura BD](ANALYSIS/ANALISE-ESTRUTURA-BD-FLUXOS.md) | Request vs Process vs Certificate |
| [Analise Fluxos Processo](ANALYSIS/ANALISE-FLUXOS-PROCESSO.md) | Fluxos detalhados |

### Wizard (9 Etapas)

| Documento | Descricao |
|-----------|-----------|
| [Wizard Implementation](03-ux/04-wizard.md) | Especificacao UX |
| [Wizard Integrado](PROCESS/WIZARD-INTEGRADO-COMPLETO.md) | Fluxo completo |
| [Wizard Internacional](PROCESS/WIZARD-INTERNACIONAL-CRIADO.md) | Versao multi-idioma |

### Fluxos Especificos

| Documento | Fluxo |
|-----------|-------|
| [Certification Request Flow](04-implementation/03-certification-request-flow.md) | Solicitacao |
| [Analyst Process Management](04-implementation/04-analyst-process-management.md) | Analista |
| [Upload Documents Solution](DIAGRAMS/UPLOAD-DOCUMENTS-SOLUTION.md) | Documentos |

---

## Implementacao

### Status Atual (Janeiro 2026)

| Documento | Area |
|-----------|------|
| [Resumo Executivo Jan/2026](IMPLEMENTATION-HISTORY/RESUMO-EXECUTIVO-JANEIRO-2026.md) | Geral |
| [Backend Status Jan/2026](IMPLEMENTATION-HISTORY/BACKEND-STATUS-JANEIRO-2026.md) | Backend |
| [Frontend Status Jan/2026](IMPLEMENTATION-HISTORY/FRONTEND-STATUS-JANEIRO-2026.md) | Frontend |
| [Analise Estatistica NestJS](IMPLEMENTATION-HISTORY/MIGRATION-NESTJS-STATISTICAL-ANALYSIS.md) | Migracao |

### Migracao NestJS (CONCLUIDA)

| Documento | Tipo |
|-----------|------|
| [Plano Migracao NestJS](PLANNING/MIGRATION-NESTJS.md) | Plano original (historico) |
| [Token Tracking](IMPLEMENTATION-HISTORY/MIGRATION-NESTJS-TOKEN-TRACKING.md) | Acompanhamento |
| [Fases da Migracao](IMPLEMENTATION-HISTORY/NESTJS-MIGRATION-PHASES/) | Detalhes |

### Modulos Implementados

| Documento | Modulo |
|-----------|--------|
| [Auto-Cadastro Completo](IMPLEMENTATION-HISTORY/2025-12-17-auto-cadastro-completo.md) | Auto-Cadastro |
| [Auto-Cadastro Backend](IMPLEMENTATION-HISTORY/2025-12-17-auto-cadastro-backend.md) | Auto-Cadastro |
| [Proposta Comercial](IMPLEMENTATION-HISTORY/IMPLEMENTACAO_PROPOSTA_COMERCIAL.md) | Comercial |
| [Proposta Completa](IMPLEMENTATION-HISTORY/IMPLEMENTACAO_COMPLETA_PROPOSTA.md) | Comercial |
| [Frontend Proposta](IMPLEMENTATION-HISTORY/IMPLEMENTACAO_FRONTEND_PROPOSTA.md) | Comercial |
| [Auditorias Completas](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-COMPLETA-AUDITORIAS.md) | Auditorias |
| [Agendamento Auditoria](IMPLEMENTATION-HISTORY/IMPLEMENTACAO_AGENDAMENTO_AUDITORIA.md) | Auditorias |
| [Perfil Juridico](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-PERFIL-JURIDICO.md) | Juridico |
| [Resumo Executivo Juridico](IMPLEMENTATION-HISTORY/RESUMO-EXECUTIVO-JURIDICO.md) | Juridico |
| [Contratos e Assinatura](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-CONTRATOS-ASSINATURA.md) | Contratos |
| [Fluxo Documentos](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-FLUXO-DOCUMENTOS.md) | Documentos |
| [Modulo Comercial Completo](IMPLEMENTATION-HISTORY/MODULO-COMERCIAL-COMPLETO.md) | Comercial |
| [Internacional Resumo](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-INTERNACIONAL-RESUMO.md) | i18n |

### Sprints e Historico

| Documento | Sprint |
|-----------|--------|
| [Sprint 1 Completed](IMPLEMENTATION-HISTORY/SPRINT1-COMPLETED.md) | Sprint 1 |
| [Sprint 1 Config Management](IMPLEMENTATION-HISTORY/SPRINT1-CONFIG-MANAGEMENT-UPDATE.md) | Sprint 1 |
| [Implementacoes Sprint 1](IMPLEMENTATION-HISTORY/IMPLEMENTACOES_SPRINT1.md) | Sprint 1 |
| [Implementacoes Sprint 2](IMPLEMENTATION-HISTORY/IMPLEMENTACOES_SPRINT2.md) | Sprint 2 |
| [Test Results](IMPLEMENTATION-HISTORY/TEST-RESULTS.md) | Testes |
| [Resumo Executivo Implementacao](IMPLEMENTATION-HISTORY/RESUMO-EXECUTIVO-IMPLEMENTACAO.md) | Resumo |
| [Analise Aderencia Fluxo](IMPLEMENTATION-HISTORY/ANALISE-ADERENCIA-FLUXO-ATUAL.md) | Analise |
| [Analise Comparativa Fases](IMPLEMENTATION-HISTORY/ANALISE_COMPARATIVA_FASES.md) | Analise |

---

## Guias

### Setup e Configuracao

| Documento | Tipo |
|-----------|------|
| [Setup Geral](GUIDES/SETUP.md) | Instalacao |
| [Setup GitHub](GUIDES/SETUP-GITHUB.md) | Git |
| [Comandos de Execucao](GUIDES/EXECUTAR-AGORA-COMANDOS.md) | Operacional |
| [Indice de Documentacao](GUIDES/INDICE-DOCUMENTACAO.md) | Navegacao |
| [Multi-Repo Development](GUIDES/MULTI-REPO-DEVELOPMENT-GUIDE.md) | Desenvolvimento |
| [NestJS Migration to Production](GUIDES/NESTJS-MIGRATION-TO-PRODUCTION.md) | Deploy |
| [Guia Migracao Internacional](GUIDES/GUIA-MIGRACAO-INTERNACIONAL.md) | i18n |

### Testes

| Documento | Tipo |
|-----------|------|
| [Guia de Testes](GUIDES/GUIA_TESTES.md) | Geral |
| [Testes Sprint 1](GUIDES/TESTES_SPRINT1.md) | Sprint |
| [Sprint 1 Testing](TESTING/SPRINT1-TESTING-GUIDE.md) | Sprint |
| [Como Testar Auditorias](GUIDES/COMO-TESTAR-AUDITORIAS.md) | Auditorias |
| [Testes Relatorios Auditoria](GUIDES/TESTES-RELATORIOS-AUDITORIA.md) | Auditorias |
| [Teste Validacao](GUIDES/TESTE_VALIDACAO.md) | Validacao |
| [Teste Armazenamento](GUIDES/TESTE-ARMAZENAMENTO.md) | Storage |
| [Permissoes Auditoria](GUIDES/PERMISSOES_AUDITORIA.md) | Permissoes |

### Operacao

| Documento | Tipo |
|-----------|------|
| [Como Ativar IA](GUIDES/COMO-ATIVAR-IA.md) | IA |
| [Ambiente Gestor](GUIDES/AMBIENTE_GESTOR.md) | Ambiente |
| [Guia Apresentacao Clientes](GUIDES/GUIA-APRESENTACAO-CLIENTES.md) | Demo |
| [Proximos Passos MVP](GUIDES/PROXIMOS-PASSOS-MVP.md) | Roadmap |

### Troubleshooting

| Documento | Problema |
|-----------|----------|
| [Document Upload](GUIDES/TROUBLESHOOTING-DOCUMENT-UPLOAD.md) | Upload |
| [Troubleshooting Admin](GUIDES/TROUBLESHOOTING-ADMIN.md) | Admin |
| [Email Verification](TROUBLESHOOTING/EMAIL-VERIFICATION-ISSUE.md) | Email |
| [Proposal Service 401](TROUBLESHOOTING/FIX-PROPOSAL-SERVICE-401.md) | Auth |
| [Login Comercial 401](TROUBLESHOOTING/LOGIN-COMERCIAL-401.md) | Auth |
| [Dependency Injection](TROUBLESHOOTING/DEPENDENCY-INJECTION-ERRORS.md) | NestJS |

---

## Changelog

### Correcoes Recentes (2026)

| Data | Documento | Tipo |
|------|-----------|------|
| 2026-01-20 | [Ordem Rotas NestJS](CHANGELOG/CORRECAO-ORDEM-ROTAS-NESTJS-2026-01-20.md) | Correcao |
| 2026-01-20 | [Modulo Juridico PDF](CHANGELOG/IMPLEMENTACAO-MODULO-JURIDICO-PDF-2026-01-20.md) | Feature |
| 2026-01-19 | [Race Condition Upload](CHANGELOG/CORRECAO-RACE-CONDITION-UPLOAD-2026-01-19.md) | Correcao |
| 2026-01-19 | [Upload Request ID](CHANGELOG/SOLUCAO-DEFINITIVA-UPLOAD-REQUEST-ID-2026-01-19.md) | Correcao |
| 2026-01-19 | [Simplificacao Upload](CHANGELOG/SIMPLIFICACAO-UPLOAD-EXECUTADA-2026-01-19.md) | Refactor |

### Correcoes Anteriores

| Documento | Tipo |
|-----------|------|
| [Atualizacoes 2025-12-08](CHANGELOG/ATUALIZACOES-SISTEMA-2025-12-08.md) | Geral |
| [Resumo Correcoes 2025-12-09](CHANGELOG/RESUMO-CORRECOES-SESSAO-2025-12-09.md) | Geral |
| [Correcoes Finalizadas](CHANGELOG/CORRECOES-FINALIZADAS.md) | Consolidado |
| [Dashboard e Timeline](CHANGELOG/CORRECOES-DASHBOARD-TIMELINE-COMMENTS.md) | UI |
| [Componentes UI](CHANGELOG/CORRECOES-COMPONENTES-UI.md) | UI |
| [Dashboard Analista](CHANGELOG/CORRECOES_DASHBOARD_ANALISTA.md) | UI |
| [Agendamento Auditoria](CHANGELOG/CORRECOES_AGENDAMENTO_AUDITORIA.md) | Auditoria |
| [Aceitar Proposta](CHANGELOG/CORRECAO-ACEITAR-PROPOSTA.md) | Comercial |
| [Proposta Recusada](CHANGELOG/CORRECAO-PROPOSTA-RECUSADA.md) | Comercial |
| [Correcao Fases](CHANGELOG/CORRECAO_FASES.md) | Processo |
| [Menu Duplicado](CHANGELOG/CORRECAO-MENU-DUPLICADO.md) | UI |
| [Upload Documentos Race Condition](CHANGELOG/CORRECAO-UPLOAD-DOCUMENTOS-RACE-CONDITION.md) | Upload |
| [Resumo Final Upload](CHANGELOG/RESUMO-FINAL-CORRECAO-UPLOAD.md) | Upload |

---

## Analise

### Analises de Conformidade e Certificados

| Documento | Descricao |
|-----------|-----------|
| [Conformidade PR 7.1 Rev.22](ANALYSIS/ANALISE-CONFORMIDADE-PR71-REV22.md) | Analise do procedimento de certificacao |
| [Layouts Certificados](ANALYSIS/ANALISE-LAYOUTS-CERTIFICADOS.md) | Analise dos layouts de certificados |
| [Backlog Complementar PR 7.1](ANALYSIS/BACKLOG-COMPLEMENTAR-PR71.md) | Tasks complementares |
| [Analise Projeto Epicos 2025](ANALYSIS/ANALISE-PROJETO-EPICOS-2025.md) | Status epicos e implementacao |
| [Auditoria Documentacao](ANALYSIS/AUDITORIA-DOCUMENTACAO-2026-01-13.md) | Relatorio de auditoria da documentacao |
| [Analise Endpoints](ANALYSIS/analise-endpoints-frontend-backend.md) | Mapeamento endpoints front vs back |

### Analises de Estrutura

| Documento | Descricao |
|-----------|-----------|
| [Estrutura BD e Fluxos](ANALYSIS/ANALISE-ESTRUTURA-BD-FLUXOS.md) | Request vs Process - IMPORTANTE |
| [Fluxos Processo](ANALYSIS/ANALISE-FLUXOS-PROCESSO.md) | Fluxos detalhados do processo |
| [Auditor Qualification Mapping](ANALYSIS/AUDITOR-QUALIFICATION-MAPPING.md) | Qualificacao de auditores |

### Grupos Empresariais

| Documento | Descricao |
|-----------|-----------|
| [Analise Grupos Empresariais](ANALYSIS/ANALISE-GRUPOS-EMPRESARIAIS.md) | Estrutura de grupos |
| [Backlog Grupos Empresariais](ANALYSIS/BACKLOG-GRUPOS-EMPRESARIAIS.md) | 200 tasks - **71% concluido** (Fases 1-5 completas) |

### Migracoes

| Documento | Descricao |
|-----------|-----------|
| [Backlog Migracao Certificacoes](ANALYSIS/BACKLOG-MIGRACAO-CERTIFICACOES.md) | Migracao de dados |

---

## Planejamento

### Roadmaps

| Documento | Descricao |
|-----------|-----------|
| [Roadmap Completo 2026](PLANNING/ROADMAP-COMPLETO-2026.md) | Visao anual (historico - deploy e migracao ja concluidos) |
| [Migration NestJS](PLANNING/MIGRATION-NESTJS.md) | Plano original (CONCLUIDO) |
| [AWS ECS Fargate Spot](PLANNING/AWS-ECS-FARGATE-SPOT.md) | Infraestrutura (CONCLUIDO) |

### Planejamentos Especificos

| Documento | Area |
|-----------|------|
| [Plano Conversao Multi-Tenant](PLANNING/PLANO-CONVERSAO-MULTI-TENANT.md) | **Multi-Tenant** |
| [Planejamento Correcao Endpoints](PLANNING/planejamento-correcao-endpoints.md) | Endpoints |
| [Repo Split Plan](PLANNING/REPO-SPLIT-PLAN.md) | Organizacao |
| [Ecohalal Migration](PLANNING/ECOHALAL-MIGRATION.md) | Migracao Org |
| [Auditor Qualification System](PLANNING/AUDITOR-QUALIFICATION-SYSTEM.md) | Auditores |
| [Auditor Logistics Optimization](PLANNING/AUDITOR-LOGISTICS-OPTIMIZATION.md) | Auditores |

---

## Features

### Sistema de Auditorias

| Documento | Tipo |
|-----------|------|
| [Audit System Overview](05-features/AUDIT-SYSTEM.md) | Visao Geral |
| [Audit README](05-features/AUDIT-README.md) | Documentacao |
| [Implementation Guide](05-features/AUDIT-IMPLEMENTATION-GUIDE.md) | Guia |
| [Stage 1 Implementation](05-features/AUDIT-STAGE-1.md) | Estagio 1 |
| [Integracao Auditorias](IMPLEMENTATION-HISTORY/INTEGRACAO-AUDITORIAS.md) | Integracao |

---

## UX e Design

| Documento | Tipo |
|-----------|------|
| [UX Design Guide](03-ux/ux-design-guide.md) | Guia Geral |
| [Design System](03-ux/01-design-system.md) | Sistema |
| [Layouts](03-ux/02-layouts.md) | Layouts |
| [High Volume](03-ux/03-high-volume.md) | Performance |
| [Components](03-ux/05-components.md) | Componentes |
| [Wireframes](03-ux/07-wireframes.md) | Wireframes |
| [Accessibility](03-ux/06-accessibility.md) | Acessibilidade |
| [Metrics](03-ux/08-metrics.md) | Metricas |

---

## Quick Start

### Repositorios

| Repo | Descricao | Link |
|------|-----------|------|
| Backend | API NestJS 11 + Express + Prisma 7 | [halalsphere-backend](https://github.com/Ecohalal/halalsphere-backend) |
| Frontend | React 19 + Vite 7 + TypeScript | [halalsphere-frontend](https://github.com/Ecohalal/halalsphere-frontend) |
| Docs | Documentacao | [halalsphere-docs](https://github.com/Ecohalal/halalsphere-docs) |

### Primeiros Passos

```bash
# Clone os repositorios
git clone https://github.com/Ecohalal/halalsphere-backend.git
git clone https://github.com/Ecohalal/halalsphere-frontend.git

# Siga os guias
# -> GUIDES/SETUP.md
# -> GUIDES/MULTI-REPO-DEVELOPMENT-GUIDE.md
```

---

## Status do Projeto

| Area | Stack | Status |
|------|-------|--------|
| Backend | NestJS 11 + Express + Prisma 7 | ✅ Em Producao (ECS Fargate) |
| Frontend | React 19 + Vite 7 + TypeScript | ✅ Em Producao (S3 + CloudFront) |
| Database | PostgreSQL 16 + pgvector | ✅ Em Producao |
| CI/CD | AWS CodePipeline + CodeBuild | ✅ Operacional |
| Migracao NestJS | Fastify removido, NestJS 100% | ✅ Concluida |
| Grupos Empresariais | 93.5% (187/200 tasks) | 🟢 Fases 1-7 Concluidas |
| Documentacao | 211+ arquivos | 🔄 Em atualizacao |

**Status:** 🟢 **MVP em Producao desde 23 de Janeiro de 2026**
**Ultima avaliacao:** 10 de Fevereiro de 2026

### Progresso Grupos Empresariais

| Fase | Status |
|------|--------|
| 1. Schema e Migrations | ✅ Concluida |
| 2. Migracao de Dados | ✅ Concluida |
| 3. Backend - Grupos | ✅ Concluida |
| 4. Backend - Onboarding | ✅ Concluida |
| 5. Frontend - Estrutura | ✅ Concluida |
| 6. Frontend - Onboarding | ✅ Concluida |
| 7. Integracao CNPJ Lookup | ✅ Concluida |
| 8. Testes e Validacao | 🟡 8.1 Concluida (8/17) |

---

## Estrutura de Pastas

```
halalsphere-docs/
├── 01-prd/                 # Requisitos e User Stories
├── 02-technical/           # Especificacoes Tecnicas
├── 03-ux/                  # Design e UX
├── 04-implementation/      # Guias de Implementacao
├── 05-features/            # Features Documentadas
├── ANALYSIS/               # Analises, Mapeamentos e Backlogs
├── ARCHITECTURE/           # Decisoes Arquiteturais
├── CHANGELOG/              # Historico de Mudancas
├── DIAGRAMS/               # Diagramas e Solucoes
├── GUIDES/                 # Guias Praticos
├── IMPLEMENTATION-HISTORY/ # Historico de Implementacoes
├── PLANNING/               # Roadmaps e Planos
├── PROCESS/                # Fluxos e Processos
├── TESTING/                # Testes e Validacao
└── TROUBLESHOOTING/        # Resolucao de Problemas
```

---

**Documentacao mantida pela equipe HalalSphere**

*Ultima atualizacao do indice: 10 de Fevereiro de 2026*
*MVP em Produção desde: 23 de Janeiro de 2026*
