# 1. Stack Tecnológica

## 1.1 Frontend

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Framework** | React | 19.2 | Ecossistema maduro, componentes reutilizáveis, performance |
| **Linguagem** | TypeScript | 5.9 | Type safety, melhor DX, menos bugs em produção |
| **Build Tool** | Vite | 7.2 | Build rápido, HMR instantâneo, tree-shaking |
| **Routing** | React Router | 7.2 | Padrão de mercado, nested routes |
| **State Management** | Zustand | 4+ | Simples, performático, menos boilerplate que Redux |
| **Forms** | React Hook Form | 7+ | Performance, validação integrada, menos re-renders |
| **Validação** | Zod | 3+ | Type-safe, integra com React Hook Form |
| **UI Components** | shadcn/ui + Radix UI | - | Acessível (WCAG AA), customizável, headless |
| **Styling** | Tailwind CSS | 4.1 | Utility-first, design system consistente, bundle pequeno |
| **Data Fetching** | TanStack Query | 5+ | Cache inteligente, optimistic updates, retry |
| **HTTP Client** | Axios | 1.7 | Interceptors de auth, refresh token, FormData |
| **Icons** | Lucide React | - | Icones consistentes, tree-shakeable |
| **Animations** | Motion | - | Animacoes fluidas, gestures |
| **Toasts** | Sonner | - | Notificacoes toast, empilhamento |
| **Drag & Drop** | @dnd-kit | 6+ | Acessível, touch-friendly, performático (Kanban) |
| **Diagrams** | Mermaid | 11+ | Diagramas de fluxo, sequencia, estado |
| **Date Picker** | date-fns | 3+ | i18n, timezone-aware |
| **Testing** | - | - | Testes frontend ainda nao implementados |

---

## 1.2 Backend

> **Atualizado Mar 2026** - Migracao de Fastify para NestJS + Express concluida.

| Componente | Tecnologia | Versao | Justificativa |
|------------|------------|--------|---------------|
| **Runtime** | Node.js | 20 LTS | Performance, ecossistema, async I/O |
| **Framework** | NestJS + Express | 11+ | Arquitetura modular, DI nativo, Guards, Pipes |
| **Linguagem** | TypeScript | 5.9 | Type safety compartilhado com frontend |
| **ORM** | Prisma | 7+ | Type-safe, migrations automaticas, schema visual |
| **Validacao** | class-validator + Zod 4+ | - | DTOs NestJS + runtime validation |
| **Auth** | @nestjs/jwt + Passport | - | JWT RS256/HS256, Guards, Strategies |
| **File Upload** | Multer (@nestjs/platform-express) | - | Multipart/form-data, size limits |
| **PDF Generation** | PDFKit | 0.17+ | Geracao nativa de PDFs (contratos, relatorios) |
| **Email** | AWS SES (@aws-sdk/client-ses) | - | Templates, envio transacional |
| **SMS** | AWS SNS (@aws-sdk/client-sns) | - | Notificacoes SMS |
| **Cache** | Redis + ioredis | 7+ | Cache, sessions |
| **AI** | Anthropic SDK | 0.71+ | Assistente conversacional Claude |
| **API Docs** | @nestjs/swagger | 11+ | Auto-gerado via decorators NestJS |
| **QR Code** | qrcode + sharp | - | Geracao de QR codes para certificados |
| **Excel** | exceljs | - | Import/export de planilhas |
| **Scheduler** | @nestjs/schedule | - | Tarefas agendadas (alertas, prazos) |
| **Health Check** | @nestjs/terminus | - | Monitoramento de saude da API |
| **Testing** | Jest + Supertest | 30+ | Unit + integration + e2e tests |
| **Code Quality** | ESLint + Prettier | - | Linting + formatting |

---

## 1.3 Inteligência Artificial

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **LLM Provider** | Anthropic Claude (SDK 0.71) | Análise de documentos, chatbot RAG, assistente IA |
| **Vector DB** | PostgreSQL pgvector | Evita dependência adicional, busca semântica |
| **LLM Framework** | LangChain.js | Chains, RAG pipeline, prompt templates |

---

## 1.4 Database e Storage

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Primary DB** | PostgreSQL | 16+ | ACID, JSON support, pgvector, full-text search |
| **Extensões PG** | pgvector, pg_trgm, uuid-ossp | Vector search, fuzzy search, UUIDs |
| **Cache** | Redis | 7+ | Session store, queue, rate limiting |
| **Object Storage** | AWS S3 / MinIO | - | Documentos, certificados, uploads |
| **File Organization** | `/uploads/{company_id}/{certification_id}/{file_id}` | Isolamento por empresa |

---

## 1.5 Infraestrutura

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **Cloud Provider** | AWS | Confiabilidade, serviços gerenciados |
| **Containers** | Docker | Reprodutibilidade, isolamento |
| **Orchestration** | ECS Fargate | Serverless containers, auto-scaling |
| **CI/CD** | AWS CodePipeline + CodeBuild | Build, test e deploy automatizados |
| **CDN** | AWS CloudFront | Cache de assets, distribuicao global |
| **DNS/Domain** | AWS Route 53 | Gestao de dominios |
| **Secrets** | AWS Secrets Manager | Rotação automática, auditoria |
| **Parameters** | AWS SSM Parameter Store | Configuracoes de ambiente |

---

