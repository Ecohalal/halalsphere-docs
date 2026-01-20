---
layout: default
title: Home
---

<div align="center">

# HalalSphere - Central de Documentacao

**Sistema de Gestao de Certificacao Halal**

[![Docs](https://img.shields.io/badge/docs-latest-blue.svg)](https://github.com/Ecohalal/halalsphere-docs)
[![Version](https://img.shields.io/badge/version-2.0-green.svg)](CHANGELOG/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

</div>

---

## Ultima Atualizacao

| Data | Documento | Categoria |
|------|-----------|-----------|
| **2026-01-20** | [Analise Estrutura BD e Fluxos](ANALYSIS/ANALISE-ESTRUTURA-BD-FLUXOS.md) | Analise |
| 2026-01-20 | [Correcao Ordem Rotas NestJS](CHANGELOG/CORRECAO-ORDEM-ROTAS-NESTJS-2026-01-20.md) | Changelog |
| 2026-01-20 | [Implementacao Modulo Juridico PDF](CHANGELOG/IMPLEMENTACAO-MODULO-JURIDICO-PDF-2026-01-20.md) | Changelog |
| 2026-01-19 | [Solucao Upload Request ID](CHANGELOG/SOLUCAO-DEFINITIVA-UPLOAD-REQUEST-ID-2026-01-19.md) | Changelog |
| 2026-01-15 | [Analise Estatistica NestJS](IMPLEMENTATION-HISTORY/MIGRATION-NESTJS-STATISTICAL-ANALYSIS.md) | Migracao |

---

## Indice por Categoria

> **Como usar:** Clique na categoria para expandir e ver todos os documentos relacionados.

### Categorias Disponiveis

| Categoria | Descricao | Qtd Docs |
|-----------|-----------|----------|
| [Requisitos](#-requisitos) | PRD, User Stories, Epicos | 15+ |
| [Arquitetura](#-arquitetura) | Decisoes tecnicas, infraestrutura | 28 |
| [Processo](#-processo-certificacao) | Fluxos, 17 fases, wizard | 21 |
| [Implementacao](#-implementacao) | Status, historico, sprints | 32 |
| [Guias](#-guias) | Setup, testes, troubleshooting | 27 |
| [Changelog](#-changelog) | Correcoes, atualizacoes | 19 |
| [Analise](#-analise) | Mapeamentos, diagnosticos | 5 |
| [Planejamento](#-planejamento) | Roadmaps, migracao | 10 |

---

## Requisitos

**PRD e Documentos de Produto**

| Documento | Descricao |
|-----------|-----------|
| [PRD v2](prd-v2.md) | Product Requirements Document (versao atual) |
| [PRD v1](prd.md) | Product Requirements Document (legado) |
| [Project Brief](halalsphere-project-brief.md) | Brief completo do projeto |
| [Ficha Tecnica](FICHA-TECNICA-PROJETO.md) | Especificacoes tecnicas gerais |

**User Stories por Epico**

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

**Decisoes Arquiteturais**

| Documento | Categoria |
|-----------|-----------|
| [Technical Architecture](technical-architecture.md) | Visao Geral |
| [Backend Implementado](ARCHITECTURE/BACKEND-IMPLEMENTADO.md) | Backend |
| [Backend API Reference](ARCHITECTURE/BACKEND-API-REFERENCE.md) | Backend |
| [Sistema Kanban](ARCHITECTURE/KANBAN_IMPLEMENTATION.md) | Backend |
| [Internacionalizacao](ARCHITECTURE/INTERNACIONALIZACAO-SISTEMA.md) | Backend |

**Infraestrutura AWS**

| Documento | Categoria |
|-----------|-----------|
| [AWS Infra Changes 2026](ARCHITECTURE/AWS-INFRA-CHANGES-2026.md) | AWS |
| [AWS Migration Checklist](ARCHITECTURE/AWS-MIGRATION-CHECKLIST.md) | AWS |
| [AWS Config Management](ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md) | AWS |
| [Terraform Integration](ARCHITECTURE/TERRAFORM-CONFIG-INTEGRATION.md) | Terraform |
| [ConfigLoader Update](ARCHITECTURE/CONFIGLOADER-UPDATE-GUIDE.md) | Config |

**Modulos Especificos**

| Documento | Modulo |
|-----------|--------|
| [Modulo Proposta Comercial](ARCHITECTURE/MODULO_PROPOSTA_COMERCIAL.md) | Comercial |
| [Frontend Proposta](ARCHITECTURE/FRONTEND_PROPOSTA_COMERCIAL.md) | Comercial |
| [Gestao Alocacao Auditores](ARCHITECTURE/GESTAO-ALOCACAO-AUDITORES.md) | Auditores |
| [Fluxo Alocacao Auditores](ARCHITECTURE/FLUXO-ALOCACAO-AUDITORES.md) | Auditores |
| [Configuracao Armazenamento](ARCHITECTURE/CONFIGURACAO-ARMAZENAMENTO.md) | Storage |

**Banco de Dados**

| Documento | Tipo |
|-----------|------|
| [ERD - Diagrama](02-technical/03-database/01-erd.md) | Diagrama |
| [Dicionario de Dados](02-technical/03-database/02-data-dictionary.md) | Referencia |
| [DDL Statements](02-technical/03-database/03-ddl.md) | SQL |
| [Indices](02-technical/03-database/04-indexes.md) | SQL |
| [Migracoes](02-technical/03-database/05-migrations.md) | SQL |

---

## Processo Certificacao

**Documentos Principais**

| Documento | Descricao |
|-----------|-----------|
| [17 Fases do Processo](PROCESS/17-FASES-PROCESSO-CERTIFICACAO.md) | Todas as fases detalhadas |
| [Processo Completo Final](PROCESS/PROCESSO-CERTIFICACAO-COMPLETO-FINAL.md) | Visao consolidada |
| [Analise Estrutura BD](ANALYSIS/ANALISE-ESTRUTURA-BD-FLUXOS.md) | Request vs Process vs Certificate |

**Wizard (9 Etapas)**

| Documento | Descricao |
|-----------|-----------|
| [Wizard Implementation](03-ux/04-wizard.md) | Especificacao UX |
| [Wizard Integrado](PROCESS/WIZARD-INTEGRADO-COMPLETO.md) | Fluxo completo |
| [Wizard Internacional](PROCESS/WIZARD-INTERNACIONAL-CRIADO.md) | Versao multi-idioma |

**Fluxos Especificos**

| Documento | Fluxo |
|-----------|-------|
| [Certification Request Flow](04-implementation/03-certification-request-flow.md) | Solicitacao |
| [Analyst Process Management](04-implementation/04-analyst-process-management.md) | Analista |
| [Upload Documents Solution](DIAGRAMS/UPLOAD-DOCUMENTS-SOLUTION.md) | Documentos |

---

## Implementacao

**Status Atual (Janeiro 2026)**

| Documento | Area |
|-----------|------|
| [Resumo Executivo Jan/2026](IMPLEMENTATION-HISTORY/RESUMO-EXECUTIVO-JANEIRO-2026.md) | Geral |
| [Backend Status Jan/2026](IMPLEMENTATION-HISTORY/BACKEND-STATUS-JANEIRO-2026.md) | Backend |
| [Frontend Status Jan/2026](IMPLEMENTATION-HISTORY/FRONTEND-STATUS-JANEIRO-2026.md) | Frontend |
| [Analise Estatistica NestJS](IMPLEMENTATION-HISTORY/MIGRATION-NESTJS-STATISTICAL-ANALYSIS.md) | Migracao |

**Migracao NestJS**

| Documento | Tipo |
|-----------|------|
| [Plano Migracao NestJS](PLANNING/MIGRATION-NESTJS.md) | Plano 85 passos |
| [Token Tracking](IMPLEMENTATION-HISTORY/MIGRATION-NESTJS-TOKEN-TRACKING.md) | Acompanhamento |
| [Fases da Migracao](IMPLEMENTATION-HISTORY/NESTJS-MIGRATION-PHASES/) | Detalhes |

**Historico de Sprints**

| Documento | Sprint |
|-----------|--------|
| [Sprint 1 Completed](IMPLEMENTATION-HISTORY/SPRINT1-COMPLETED.md) | Sprint 1 |
| [Implementacoes Sprint 1](IMPLEMENTATION-HISTORY/IMPLEMENTACOES_SPRINT1.md) | Sprint 1 |
| [Implementacoes Sprint 2](IMPLEMENTATION-HISTORY/IMPLEMENTACOES_SPRINT2.md) | Sprint 2 |

**Modulos Implementados**

| Documento | Modulo |
|-----------|--------|
| [Auto-Cadastro Completo](IMPLEMENTATION-HISTORY/2025-12-17-auto-cadastro-completo.md) | Auto-Cadastro |
| [Proposta Comercial](IMPLEMENTATION-HISTORY/IMPLEMENTACAO_PROPOSTA_COMERCIAL.md) | Comercial |
| [Auditorias Completas](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-COMPLETA-AUDITORIAS.md) | Auditorias |
| [Perfil Juridico](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-PERFIL-JURIDICO.md) | Juridico |
| [Contratos e Assinatura](IMPLEMENTATION-HISTORY/IMPLEMENTACAO-CONTRATOS-ASSINATURA.md) | Contratos |

---

## Guias

**Setup e Configuracao**

| Documento | Tipo |
|-----------|------|
| [Setup Geral](GUIDES/SETUP.md) | Instalacao |
| [Setup GitHub](SETUP-GITHUB.md) | Git |
| [Multi-Repo Development](GUIDES/MULTI-REPO-DEVELOPMENT-GUIDE.md) | Desenvolvimento |
| [NestJS Migration to Production](GUIDES/NESTJS-MIGRATION-TO-PRODUCTION.md) | Deploy |

**Testes**

| Documento | Tipo |
|-----------|------|
| [Guia de Testes](GUIDES/GUIA_TESTES.md) | Geral |
| [Sprint 1 Testing](TESTING/SPRINT1-TESTING-GUIDE.md) | Sprint |
| [Como Testar Auditorias](GUIDES/COMO-TESTAR-AUDITORIAS.md) | Auditorias |
| [Como Ativar IA](GUIDES/COMO-ATIVAR-IA.md) | IA |

**Troubleshooting**

| Documento | Problema |
|-----------|----------|
| [Document Upload](GUIDES/TROUBLESHOOTING-DOCUMENT-UPLOAD.md) | Upload |
| [Email Verification](TROUBLESHOOTING/EMAIL-VERIFICATION-ISSUE.md) | Email |
| [Proposal Service 401](TROUBLESHOOTING/FIX-PROPOSAL-SERVICE-401.md) | Auth |
| [Login Comercial 401](TROUBLESHOOTING/LOGIN-COMERCIAL-401.md) | Auth |
| [Dependency Injection](TROUBLESHOOTING/DEPENDENCY-INJECTION-ERRORS.md) | NestJS |

---

## Changelog

**Correcoes Recentes (2026)**

| Data | Documento | Tipo |
|------|-----------|------|
| 2026-01-20 | [Ordem Rotas NestJS](CHANGELOG/CORRECAO-ORDEM-ROTAS-NESTJS-2026-01-20.md) | Correcao |
| 2026-01-20 | [Modulo Juridico PDF](CHANGELOG/IMPLEMENTACAO-MODULO-JURIDICO-PDF-2026-01-20.md) | Feature |
| 2026-01-19 | [Race Condition Upload](CHANGELOG/CORRECAO-RACE-CONDITION-UPLOAD-2026-01-19.md) | Correcao |
| 2026-01-19 | [Upload Request ID](CHANGELOG/SOLUCAO-DEFINITIVA-UPLOAD-REQUEST-ID-2026-01-19.md) | Correcao |
| 2026-01-19 | [Simplificacao Upload](CHANGELOG/SIMPLIFICACAO-UPLOAD-EXECUTADA-2026-01-19.md) | Refactor |

**Correcoes Anteriores**

| Documento | Tipo |
|-----------|------|
| [Atualizacoes 2025-12-08](CHANGELOG/ATUALIZACOES-SISTEMA-2025-12-08.md) | Geral |
| [Correcoes Finalizadas](CHANGELOG/CORRECOES-FINALIZADAS.md) | Consolidado |
| [Dashboard e Timeline](CHANGELOG/CORRECOES-DASHBOARD-TIMELINE-COMMENTS.md) | UI |
| [Componentes UI](CHANGELOG/CORRECOES-COMPONENTES-UI.md) | UI |

---

## Analise

| Documento | Descricao |
|-----------|-----------|
| [Estrutura BD e Fluxos](ANALYSIS/ANALISE-ESTRUTURA-BD-FLUXOS.md) | Request vs Process - IMPORTANTE |
| [Auditor Qualification Mapping](ANALYSIS/AUDITOR-QUALIFICATION-MAPPING.md) | Qualificacao de auditores |
| [Fases Kanban](ARCHITECTURE/ANALISE-FASES-KANBAN.md) | Analise de fases |
| [Aderencia Fluxo Atual](IMPLEMENTATION-HISTORY/ANALISE-ADERENCIA-FLUXO-ATUAL.md) | Comparativo |
| [Analise Comparativa Fases](IMPLEMENTATION-HISTORY/ANALISE_COMPARATIVA_FASES.md) | Fases |

---

## Planejamento

**Roadmaps**

| Documento | Descricao |
|-----------|-----------|
| [Roadmap Completo 2026](PLANNING/ROADMAP-COMPLETO-2026.md) | Visao anual |
| [Migration NestJS](PLANNING/MIGRATION-NESTJS.md) | Plano 85 passos |
| [AWS ECS Fargate Spot](PLANNING/AWS-ECS-FARGATE-SPOT.md) | Infraestrutura |

**Planejamentos Especificos**

| Documento | Area |
|-----------|------|
| [Repo Split Plan](PLANNING/REPO-SPLIT-PLAN.md) | Organizacao |
| [Ecohalal Migration](PLANNING/ECOHALAL-MIGRATION.md) | Migracao Org |
| [Auditor Qualification System](PLANNING/AUDITOR-QUALIFICATION-SYSTEM.md) | Auditores |
| [Auditor Logistics Optimization](PLANNING/AUDITOR-LOGISTICS-OPTIMIZATION.md) | Auditores |

---

## Features

**Sistema de Auditorias**

| Documento | Tipo |
|-----------|------|
| [Audit System Overview](05-features/AUDIT-SYSTEM.md) | Visao Geral |
| [Audit README](05-features/AUDIT-README.md) | Documentacao |
| [Implementation Guide](05-features/AUDIT-IMPLEMENTATION-GUIDE.md) | Guia |
| [Stage 1 Implementation](05-features/AUDIT-STAGE-1.md) | Estagio 1 |
| [Integracao Auditorias](INTEGRACAO-AUDITORIAS.md) | Integracao |

---

## UX e Design

| Documento | Tipo |
|-----------|------|
| [UX Design Guide](ux-design-guide.md) | Guia Geral |
| [Design System](03-ux/01-design-system.md) | Sistema |
| [Layouts](03-ux/02-layouts.md) | Layouts |
| [Components](03-ux/05-components.md) | Componentes |
| [Wireframes](03-ux/07-wireframes.md) | Wireframes |
| [Accessibility](03-ux/06-accessibility.md) | Acessibilidade |

---

## Quick Start

### Repositorios

| Repo | Descricao | Link |
|------|-----------|------|
| Backend NestJS | API em migracao | [halalsphere-backend-nest](https://github.com/Ecohalal/halalsphere-backend-nest) |
| Backend Fastify | API legada | [halalsphere-backend](https://github.com/Ecohalal/halalsphere-backend) |
| Frontend | React App | [halalsphere-frontend](https://github.com/Ecohalal/halalsphere-frontend) |
| Docs | Documentacao | [halalsphere-docs](https://github.com/Ecohalal/halalsphere-docs) |

### Primeiros Passos

```bash
# Clone os repositorios
git clone https://github.com/Ecohalal/halalsphere-backend-nest.git
git clone https://github.com/Ecohalal/halalsphere-frontend.git

# Siga os guias
# -> GUIDES/SETUP.md
# -> GUIDES/MULTI-REPO-DEVELOPMENT-GUIDE.md
```

---

## Status do Projeto

```
Backend NestJS:     [################----]  80%
Frontend React:     [#################---]  85%
Database:           [###################-]  95%
Testes:             [###############-----]  75%
Documentacao:       [##############------]  70%
```

**Ultima avaliacao:** 20 de Janeiro de 2026

---

## Estrutura de Pastas

```
halalsphere-docs/
|
+-- 01-prd/                 # Requisitos e User Stories
+-- 02-technical/           # Especificacoes Tecnicas
+-- 03-ux/                  # Design e UX
+-- 04-implementation/      # Guias de Implementacao
+-- 05-features/            # Features Documentadas
|
+-- ANALYSIS/               # Analises e Mapeamentos
+-- ARCHITECTURE/           # Decisoes Arquiteturais
+-- CHANGELOG/              # Historico de Mudancas
+-- DIAGRAMS/               # Diagramas e Solucoes
+-- GUIDES/                 # Guias Praticos
+-- IMPLEMENTATION-HISTORY/ # Historico de Implementacoes
+-- PLANNING/               # Roadmaps e Planos
+-- PROCESS/                # Fluxos e Processos
+-- TESTING/                # Testes e Validacao
+-- TROUBLESHOOTING/        # Resolucao de Problemas
```

---

<div align="center">

**Documentacao mantida pela equipe HalalSphere**

*Ultima atualizacao do indice: 20 de Janeiro de 2026*

</div>
