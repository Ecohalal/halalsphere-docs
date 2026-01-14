---
layout: default
title: Home
---

# 📚 HalalSphere - Documentação Oficial

> **Sistema de Gestão de Certificação Halal** - Documentação completa do projeto

[![Documentation](https://img.shields.io/badge/docs-latest-blue.svg)](https://github.com/Ecohalal/halalsphere-docs)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0-green.svg)](CHANGELOG.md)

---

## 🎯 Sobre o Projeto

O **HalalSphere** é uma plataforma SaaS que revoluciona o processo de certificação Halal, reduzindo o tempo de certificação de 7-8 meses para 2-3 meses através de IA e automação inteligente.

### Repositórios do Projeto

- **Backend API:** [Ecohalal/halalsphere-backend](https://github.com/Ecohalal/halalsphere-backend)
- **Frontend Web:** [Ecohalal/halalsphere-frontend](https://github.com/Ecohalal/halalsphere-frontend)
- **Documentação:** [Ecohalal/halalsphere-docs](https://github.com/Ecohalal/halalsphere-docs) (você está aqui)

---

## 📖 Navegação Rápida

### 🎯 Para Product Owners
- [📋 PRD v2](prd-v2.md) - Product Requirements Document
- [📊 User Stories](01-prd/05-user-stories/README.md)
- [✅ Status de Implementação](01-prd/05-user-stories/STATUS-IMPLEMENTACAO-TODOS-EPICOS.md)

### 👨‍💻 Para Desenvolvedores
- [🔧 Setup e Instalação](GUIDES/SETUP.md)
- [🏗️ Arquitetura Técnica](technical-architecture.md)
- [🗄️ Banco de Dados](02-technical/03-database/03-ddl.md)
- [🔄 Migração NestJS](PLANNING/MIGRATION-NESTJS.md)
- [☁️ Mudanças AWS 2026](ARCHITECTURE/AWS-INFRA-CHANGES-2026.md)
- [📝 ConfigLoader Update Guide](ARCHITECTURE/CONFIGLOADER-UPDATE-GUIDE.md)
- [✅ AWS Migration Checklist](ARCHITECTURE/AWS-MIGRATION-CHECKLIST.md)

### 🎨 Para Designers
- [🎨 UX Design Guide](ux-design-guide.md)
- [🧙 Wizard Implementation](03-ux/04-wizard.md)
- [🖼️ Wireframes](03-ux/07-wireframes.md)

### 🔄 Processo de Certificação
- [📋 17 Fases do Processo](PROCESS/17-FASES-PROCESSO-CERTIFICACAO.md)
- [🔄 Processo Completo](PROCESS/PROCESSO-CERTIFICACAO-COMPLETO-FINAL.md)

### 📚 Índices Completos
- [📑 Índice Geral da Documentação](INDICE-DOCUMENTACAO.md)
- [📊 Status da Documentação](DOCUMENTATION_STATUS.md)

---

## 🔄 Planejamento e Migração

### Migração Backend (Fastify → NestJS)
- [🔄 Plano de Migração NestJS](PLANNING/MIGRATION-NESTJS.md) - Guia completo de 85 passos (10-12 semanas)
- [☁️ Mudanças AWS 2026](ARCHITECTURE/AWS-INFRA-CHANGES-2026.md) - JWT RS256, novos secrets, IAM Roles
- [📝 ConfigLoader Update Guide](ARCHITECTURE/CONFIGLOADER-UPDATE-GUIDE.md) - Atualização do sistema de configuração
- [✅ AWS Migration Checklist](ARCHITECTURE/AWS-MIGRATION-CHECKLIST.md) - Checklist detalhado de migração
- [🔧 Terraform Config Integration](ARCHITECTURE/TERRAFORM-CONFIG-INTEGRATION.md) - Integração com Terraform
- [⚙️ AWS Config Management](ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md) - Gerenciamento de configurações AWS

### Outros Planejamentos
- [🗺️ Roadmap Completo 2026](PLANNING/ROADMAP-COMPLETO-2026.md)
- [☁️ AWS ECS Fargate Spot](PLANNING/AWS-ECS-FARGATE-SPOT.md)
- [🔀 Repo Split Plan](PLANNING/REPO-SPLIT-PLAN.md)
- [👥 Sistema de Qualificação de Auditores](PLANNING/AUDITOR-QUALIFICATION-SYSTEM.md)
- [📍 Otimização de Logística de Auditores](PLANNING/AUDITOR-LOGISTICS-OPTIMIZATION.md)

---

## 🗂️ Estrutura da Documentação

```
halalsphere-docs/
├── 01-prd/              # Product Requirements & User Stories
├── 02-technical/        # Arquitetura, APIs, Database
├── 03-ux/              # Design, Wireframes, Components
├── 04-implementation/   # Guias de Implementação
├── 05-features/        # Documentação de Features
├── GUIDES/             # Guias de Setup, Teste, Deploy
├── PROCESS/            # Fases do Processo de Certificação
├── ARCHITECTURE/       # Diagramas e Decisões Arquiteturais
├── TESTING/            # Estratégias e Casos de Teste
└── TROUBLESHOOTING/    # Resolução de Problemas
```

---

## 🚀 Quick Start

### Para Desenvolvedores

1. **Clone os repositórios:**
   ```bash
   git clone https://github.com/Ecohalal/halalsphere-backend.git
   git clone https://github.com/Ecohalal/halalsphere-frontend.git
   ```

2. **Siga os guias de setup:**
   - [Backend Setup](https://github.com/Ecohalal/halalsphere-backend#-quick-start)
   - [Frontend Setup](https://github.com/Ecohalal/halalsphere-frontend#-quick-start)

3. **Consulte a documentação técnica:**
   - [Arquitetura](technical-architecture.md)
   - [API Reference](02-technical/02-api/README.md)
   - [Database Schema](02-technical/03-database/03-ddl.md)

---

## 📊 Status do Projeto

- **Versão Atual:** 2.0
- **Última Atualização:** Janeiro 2026
- **Status:** Em Desenvolvimento Ativo

### Funcionalidades Implementadas

✅ Sistema de Autenticação Multi-role
✅ Wizard de Solicitação (9 etapas)
✅ Dashboard por Perfil
✅ Gestão de Documentos
✅ Sistema de Propostas
✅ Gestão de Contratos
✅ Sistema de Auditorias
✅ Geração de Certificados

### Em Desenvolvimento

🔄 Chat IA para assistência
🔄 Relatórios Avançados
🔄 Integrações de E-signature
🔄 Storage Cloud (AWS S3/Azure)

---

## 🤝 Contribuindo

Esta é uma documentação proprietária do projeto HalalSphere. Para contribuições:

1. Consulte o time de produto
2. Siga os padrões de documentação existentes
3. Mantenha a estrutura de pastas
4. Atualize o índice quando adicionar novos documentos

---

## 📞 Suporte

- **Equipe de Produto:** Para questões sobre features e roadmap
- **Equipe Técnica:** Para questões de implementação
- **Documentação:** Consulte os índices e guias específicos

---

**Documentação mantida pela equipe HalalSphere**
**Última atualização:** 14 de Janeiro de 2026
