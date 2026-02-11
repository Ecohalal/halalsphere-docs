# Implementation Guides

**Guias práticos para desenvolvimento do HalalSphere**

---

## 📚 Guias Disponíveis

### 1. [Setup do Ambiente de Desenvolvimento](./01-setup-guide.md)
**Pré-requisitos | Docker | Node.js | PostgreSQL | Redis**

- Instalação de dependências (Node 20+, Docker, Git)
- Configuração do docker-compose
- Setup do backend (NestJS 11 + Express + TypeScript + Prisma 7)
- Setup do frontend (React + Vite + Tailwind + shadcn/ui)
- Primeira migration do banco
- Seed de dados de exemplo

---

### 2. [Plano do Mockup (5 Dias)](./02-mockup-plan.md)
**Cronograma Detalhado | 7 Telas Principais | Demo Apresentável**

- **Dia 1**: Setup e estrutura base (8h)
- **Dia 2**: Autenticação + Design System (8h)
- **Dia 3**: Dashboards + Wizard (8h)
- **Dia 4**: Kanban Analista + Detalhes (8h)
- **Dia 5**: Chat IA + Certificado + Polish (8h)

**Resultado**: Mockup funcional com 7 telas demonstráveis

---

### 3. Coding Standards *(a criar)*
**Padrões de Código | Linting | Testing | Git Workflow**

- ESLint + Prettier configuration
- Convenções de nomenclatura
- Estrutura de arquivos
- Testing strategy (unit, integration, E2E)
- Git commit conventions
- Code review checklist

---

## 🎯 Quick Start

### Para Começar a Desenvolver HOJE

1. **[Siga o Setup Guide](./01-setup-guide.md)** (30-60 minutos)
   - Instale Node.js 20+, Docker, Git
   - Clone o repositório
   - Execute `docker-compose up -d`
   - Execute `npm install` em backend e frontend
   - Execute `npx prisma migrate dev`

2. **[Siga o Plano do Mockup](./02-mockup-plan.md)** (5 dias)
   - Implemente as 7 telas principais
   - Use dados mockados para IA
   - Prepare apresentação com screenshots

3. **Consulte o PRD** para detalhes de features
   - [User Stories](../01-prd/05-user-stories/README.md)
   - [Acceptance Criteria](../01-prd/09-acceptance-criteria.md)

4. **Consulte a Arquitetura Técnica** para decisões de implementação
   - [Stack Tecnológica](../technical-architecture.md#1-stack-tecnológica)
   - [Database Schema](../technical-architecture.md#3-database-schema-erd)
   - [APIs](../technical-architecture.md#8-apis-e-integrações)

---

## 📊 Status da Implementação

| Fase | Status | Progresso |
|------|--------|-----------|
| **Setup Inicial** | 📝 Planejado | Guia criado |
| **Mockup (5 dias)** | 📝 Planejado | Cronograma definido |
| **Sprint 0: Fundação** | ⏳ Aguardando | 2 semanas |
| **Sprint 1-4: MVP Core** | ⏳ Aguardando | 8 semanas |
| **Sprint 5-7: Auditoria** | ⏳ Aguardando | 6 semanas |
| **Sprint 8-11: IA** | ⏳ Aguardando | 8 semanas |
| **Sprint 12-14: Escalabilidade** | ⏳ Aguardando | 6 semanas |

---

## 🔗 Links Úteis

- [PRD v2.0](../01-prd/README.md) - Product Requirements
- [Technical Architecture](../technical-architecture.md) - Arquitetura técnica
- [UX Design Guide](../ux-design-guide.md) - Design system e wireframes

---

**Última atualização**: 13 de Novembro de 2025
