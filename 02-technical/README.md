# Technical Architecture v1.0

**Stack Completa | 19 Tabelas | ERD Detalhado | APIs RESTful**

⚠️ **REPOSITÓRIO DIVIDIDO (2026-01-12)**

Esta documentação cobre a arquitetura geral. Para código-fonte:
- Backend: https://github.com/Ecohalal/halalsphere-backend
- Frontend: https://github.com/Ecohalal/halalsphere-frontend

---

## Document Control

| Campo | Valor |
|-------|-------|
| **Versão** | 1.0 |
| **Data** | 13 de Janeiro de 2026 |
| **Autor** | Tech Lead - HalalSphere Team |
| **Status** | ✅ Completo |
| **Aprovadores** | CTO, Arquiteto de Software, DBA |

---

## 📋 Índice da Arquitetura Técnica

### Core Architecture

#### [1. Stack Tecnológica](./01-stack.md)
**Frontend | Backend | IA | Database | Infra**

- Frontend: React 19 + TypeScript 5.9 + Vite 7 + Tailwind + shadcn/ui
- Backend: Node.js 20 + NestJS 11 + Express + Prisma 7
- IA: Anthropic Claude (SDK 0.71) + LangChain.js + pgvector
- Database: PostgreSQL 16 + Redis 7 + S3
- Infra: Docker + ECS Fargate + CloudFront + AWS CodePipeline

#### [2. Arquitetura de Sistema](./02-system-architecture.md)
**Diagramas | Fluxos de Dados | Componentes**

- Diagrama de arquitetura (alto nível)
- 3 Fluxos de dados críticos:
  - Criar Solicitação (Wizard)
  - Análise IA Pré-Auditoria
  - Emissão de Certificado

---

### Database Design

#### [3. Database Schema](./03-database/README.md)
**19 Tabelas | ERD | DDL | Índices | Migrations**

- **[ERD - Diagrams](./03-database/01-erd.md)** - Diagramas Mermaid completos
- **[Dicionário de Dados](./03-database/02-data-dictionary.md)** - Todas as tabelas documentadas
- **[DDL SQL](./03-database/03-ddl.md)** - Scripts CREATE TABLE completos
- **[Índices e Performance](./03-database/04-indexes.md)** - Otimizações, pgvector
- **[Migrations Strategy](./03-database/05-migrations.md)** - Prisma Migrate

**Tabelas principais**:
- `users`, `companies`, `certification_processes`
- `products`, `documents`, `contracts`
- `audits`, `certificates`, `ai_analysis`
- E mais 10 tabelas...

---

### Integration & Security

#### [4. APIs e Integrações](./04-apis.md)
**30+ Endpoints REST | WebSockets | Integrações Externas**

- Endpoints principais (auth, processes, documents, etc)
- WebSockets (notificações real-time)
- 7 Integrações externas:
  - OpenAI, Anthropic (IA)
  - Stripe (pagamentos)
  - SendGrid (emails)
  - AWS S3 (storage)
  - Google Maps, ViaCEP

#### [5. Segurança Técnica](./05-security.md)
**OWASP Top 10 | LGPD | JWT | RBAC**

- Autenticação (JWT + MFA)
- RBAC (4 roles)
- LGPD compliance
- OWASP Top 10 mitigações
- Rate limiting
- Secrets management

---

### DevOps & Infrastructure

#### [6. Infraestrutura e DevOps](./06-infrastructure.md)
**AWS | Kubernetes | Docker | CI/CD**

- Arquitetura AWS completa
- Docker Compose (desenvolvimento local)
- CI/CD Pipeline (GitHub Actions)
- Kubernetes manifests
- Monitoramento (Grafana + Prometheus)

---

## 📊 Estatísticas Técnicas

### Stack
- **Frontend**: React 19.2, TypeScript 5.9, Vite 7.2, Tailwind CSS 3.4
- **Backend**: Node.js 20, NestJS 11, Express, Prisma 7
- **Database**: PostgreSQL 16, Redis 7, pgvector
- **IA**: Anthropic Claude (SDK 0.71), LangChain.js
- **Infra**: Docker, ECS Fargate, CloudFront, AWS CodePipeline

### Database
- **Tabelas**: 19
- **Índices**: 40+
- **Extensions**: pgvector, pg_trgm, uuid-ossp
- **Retenção**: 3 anos (compliance ISO 17065)

### APIs
- **Endpoints REST**: 30+
- **WebSockets**: Socket.io (notificações)
- **Integrações Externas**: 7

### Infraestrutura
- **Ambientes**: Development, Staging, Production
- **Auto-scaling**: 2-10 pods (Kubernetes HPA)
- **SLA**: 99.9% uptime
- **Custo MVP**: ~$170/mês
- **Custo Produção**: ~$1.510/mês

---

## 🎯 Decisões Arquiteturais Principais

### Por que React + TypeScript?
- Ecossistema maduro, componentes reutilizáveis
- Type safety reduz bugs em produção
- Performance com Virtual DOM

### Por que NestJS + Express?
- Arquitetura modular com Dependency Injection nativo
- Guards, Pipes, Interceptors para cross-cutting concerns
- Ecossistema maduro (@nestjs/swagger, @nestjs/jwt, etc.)
- Express adapter para compatibilidade maxima com middlewares

### Por que Prisma ORM?
- Type-safe queries
- Migrations automáticas
- Schema visual (Prisma Studio)
- Excelente DX (Developer Experience)

### Por que PostgreSQL 16?
- ACID compliance (certificação requer rastreabilidade)
- JSON support (campos flexíveis)
- **pgvector** para RAG (chatbot semântico)
- Full-text search nativo

### Por que pgvector?
- Evita dependência adicional (Pinecone, Weaviate)
- Busca semântica para chatbot RAG
- Performance suficiente (<10k documentos)

---

## 🔗 Navegação

- [← Voltar ao Índice Geral](../README.md)
- [PRD v2.0](../01-prd/README.md) - Product Requirements
- [UX Design Guide](../ux-design-guide.md) - Design System
- [Implementation Plan](../04-implementation/README.md) - Setup & Mockup

---

## 🚀 Quick Start para Desenvolvedores

### 1. Setup Local
```bash
# Clonar repositório
git clone <repo-url>
cd halalsphere

# Subir infraestrutura
docker-compose up -d

# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### 2. Acessar
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Prisma Studio: http://localhost:5555
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 3. Credenciais de Teste
```
Empresa:
  email: empresa@demo.com
  senha: demo123

Analista:
  email: analista@demo.com
  senha: demo123
```

---

## 📝 Próximos Passos

1. **Revisar stack** - Validar escolhas tecnológicas com o time
2. **Setup do ambiente** - Seguir [Implementation Plan](../04-implementation/02-mockup-plan.md)
3. **Primeira migration** - Criar schema no PostgreSQL
4. **Mockup** - Implementar 7 telas em 5 dias
5. **Sprint 0** - Fundação técnica (2 semanas)

---

**Ultima atualizacao**: 10 de Fevereiro de 2026
