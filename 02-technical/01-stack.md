# 1. Stack Tecnológica

## 1.1 Frontend

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Framework** | React | 18+ | Ecossistema maduro, componentes reutilizáveis, performance |
| **Linguagem** | TypeScript | 5+ | Type safety, melhor DX, menos bugs em produção |
| **Build Tool** | Vite | 5+ | Build rápido, HMR instantâneo, tree-shaking |
| **Routing** | React Router | 6+ | Padrão de mercado, nested routes |
| **State Management** | Zustand | 4+ | Simples, performático, menos boilerplate que Redux |
| **Forms** | React Hook Form | 7+ | Performance, validação integrada, menos re-renders |
| **Validação** | Zod | 3+ | Type-safe, integra com React Hook Form |
| **UI Components** | shadcn/ui + Radix UI | - | Acessível (WCAG AA), customizável, headless |
| **Styling** | Tailwind CSS | 3+ | Utility-first, design system consistente, bundle pequeno |
| **i18n** | i18next | 23+ | Suporte RTL (árabe), plurals, interpolação |
| **Data Fetching** | TanStack Query | 5+ | Cache inteligente, optimistic updates, retry |
| **Drag & Drop** | @dnd-kit | 6+ | Acessível, touch-friendly, performático (Kanban) |
| **Charts** | Recharts | 2+ | Declarativo, responsivo, customizável |
| **PDF Viewer** | react-pdf | 7+ | Visualização de certificados |
| **Rich Text** | Tiptap | 2+ | Editor para comentários, relatórios |
| **Date Picker** | date-fns | 3+ | i18n, timezone-aware |
| **Testing** | Vitest + Testing Library | - | Testes unitários e integração |
| **E2E Testing** | Playwright | 1+ | Cross-browser, paralelo, CI-friendly |

---

## 1.2 Backend

> **Atualizado Fev 2026** - Migracao de Fastify para NestJS + Express concluida.

| Componente | Tecnologia | Versao | Justificativa |
|------------|------------|--------|---------------|
| **Runtime** | Node.js | 20 LTS | Performance, ecossistema, async I/O |
| **Framework** | NestJS + Express | 11+ | Arquitetura modular, DI nativo, Guards, Pipes |
| **Linguagem** | TypeScript | 5.7+ | Type safety compartilhado com frontend |
| **ORM** | Prisma | 7+ | Type-safe, migrations automaticas, schema visual |
| **Validacao** | class-validator + Zod | - | DTOs NestJS + runtime validation |
| **Auth** | @nestjs/jwt + Passport | - | JWT RS256/HS256, Guards, Strategies |
| **File Upload** | Multer (@nestjs/platform-express) | - | Multipart/form-data, size limits |
| **PDF Generation** | PDFKit | 0.17+ | Geracao nativa de PDFs (contratos, relatorios) |
| **Email** | Nodemailer | - | Templates, SMTP configuravel |
| **Cache** | Redis + ioredis | 7+ | Cache, sessions |
| **AI** | Anthropic SDK | 0.71+ | Assistente conversacional Claude |
| **API Docs** | @nestjs/swagger | 11+ | Auto-gerado via decorators NestJS |
| **Testing** | Jest + Supertest | 30+ | Unit + integration + e2e tests |
| **Code Quality** | ESLint + Prettier | - | Linting + formatting |

---

## 1.3 Inteligência Artificial

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **LLM Provider** | OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet | Análise de documentos, chatbot RAG |
| **Embeddings** | OpenAI text-embedding-3-large | Vetorização para RAG (512 dimensões) |
| **Vector DB** | PostgreSQL pgvector | Evita dependência adicional, busca semântica |
| **LLM Framework** | LangChain.js | Chains, RAG pipeline, prompt templates |
| **Fallback Local** | Ollama + Llama 3.1 70B | Contingência se APIs externas falharem |

---

## 1.4 Database e Storage

| Componente | Tecnologia | Versão | Justificativa |
|------------|------------|--------|---------------|
| **Primary DB** | PostgreSQL | 16+ | ACID, JSON support, pgvector, full-text search |
| **Extensões PG** | pgvector, pg_trgm, uuid-ossp | Vector search, fuzzy search, UUIDs |
| **Cache** | Redis | 7+ | Session store, queue, rate limiting |
| **Object Storage** | AWS S3 / MinIO | - | Documentos, certificados, uploads |
| **File Organization** | `/uploads/{company_id}/{process_id}/{file_id}` | Isolamento por empresa |

---

## 1.5 Infraestrutura

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **Cloud Provider** | AWS (ou GCP) | Confiabilidade, serviços gerenciados |
| **Containers** | Docker | Reprodutibilidade, isolamento |
| **Orchestration** | Kubernetes (EKS) | Auto-scaling, resilience |
| **CI/CD** | GitHub Actions | Integração nativa, workflows YAML |
| **Monitoramento** | Grafana + Prometheus | Dashboards, alertas |
| **Logs** | Grafana Loki | Centralizado, integrado com Grafana |
| **APM** | Sentry | Error tracking, performance |
| **Secrets** | AWS Secrets Manager | Rotação automática, auditoria |

---

