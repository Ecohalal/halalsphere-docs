# HalalSphere - Ficha Técnica do Projeto

## Informações Gerais

| Campo | Descrição |
|-------|-----------|
| **Nome do Projeto** | HalalSphere |
| **Versão Atual** | MVP 1.0 |
| **Data de Início** | 2025 |
| **Primeira Publicação em Produção** | 23 de Janeiro de 2026 |
| **Status** | 🟢 Em Produção |
| **Tipo** | Plataforma SaaS B2B |
| **Domínio** | Certificação Halal |

---

## 📋 Sumário Executivo

**HalalSphere** é uma plataforma SaaS end-to-end que automatiza o ciclo completo de certificação Halal, reduzindo o tempo de certificação de 7-8 meses para 2-3 meses através de automação inteligente, IA e workflows padronizados conforme normas internacionais (GAC, ISO 17065, GSO 2055-2, SMIIC).

---

## 🎯 Objetivos do Projeto

### Objetivo Principal
Digitalizar e automatizar o processo de certificação Halal, reduzindo custos operacionais em 30% e aumentando a capacidade de processamento em 40%.

### Objetivos Específicos
- ⏱️ Reduzir tempo de certificação em 60% (7-8 meses → 2-3 meses)
- 🤖 Automatizar 70% das tarefas operacionais repetitivas
- ✅ Garantir 95% de conformidade com o procedimento PR 7.1 Rev 21
- 🔍 Prover 100% de rastreabilidade de decisões e mudanças
- 😊 Alcançar NPS 50+ entre empresas certificadas
- 💰 ROI positivo em 18 meses

---

## 👥 Stakeholders

### Perfis de Usuário (5 Tipos)

| Perfil | Quantidade | Responsabilidades Principais |
|--------|-----------|------------------------------|
| **Empresas Solicitantes** | 600-700 | Solicitar certificação, submeter documentos, acompanhar status |
| **Analistas** | ~15 | Análise documental, criar propostas, gerenciar contratos |
| **Auditores** | 22 | Auditorias presenciais, relatórios de auditoria, não-conformidades |
| **Comitê Técnico** | 5-7 | Decisão final sobre certificação, análise de casos complexos |
| **Gestão/Administração** | 3-5 | Configuração do sistema, métricas, KPIs, alocação de recursos |

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

#### Frontend
- **Framework**: React 18.x com TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API
- **Build Tool**: Vite
- **Routing**: React Router v6

#### Backend
- **Runtime**: Node.js 20.x
- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Validação**: class-validator + class-transformer

#### Banco de Dados
- **Primary DB**: PostgreSQL 15+
- **Schema Management**: Prisma Migrations
- **Estratégia**: Relacional com relacionamentos complexos

#### Infraestrutura e Serviços
- **Autenticação**: JWT + bcrypt
- **File Storage**: AWS S3 / Azure Blob Storage / Google Cloud Storage (configurável)
- **E-Signature**: DocuSign / Adobe Sign / Clicksign (configurável)
- **Email Service**: AWS SES / SendGrid (configurável)
- **IA/ML**: OpenAI GPT-4 para análise documental e chatbot

#### DevOps
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: .env para configurações
- **Testing**: Jest, React Testing Library (planejado)

### Diagrama de Arquitetura (High-Level)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TS)                    │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │ Company  │ Analyst  │ Auditor  │Committee │  Admin   │  │
│  │Dashboard │Dashboard │Dashboard │Dashboard │Dashboard │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API (JSON)
┌────────────────────────────▼────────────────────────────────┐
│              BACKEND (Node.js + Express + TS)               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Controllers & Routes                    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │              Business Logic (Services)               │   │
│  │  • Auth • Process • Proposal • Contract • Audit      │   │
│  │  • Document • Notification • AI Integration          │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │              Data Access Layer (Prisma)              │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                   PostgreSQL Database                       │
│  • Users • Companies • Processes • Documents • Contracts    │
│  • Proposals • Audits • Comments • Notifications            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   External Integrations                     │
│  • AWS S3/Azure/GCS (Storage) • DocuSign/Adobe (E-Sign)     │
│  • AWS SES/SendGrid (Email)   • OpenAI (AI Analysis)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Inovações Tecnológicas (Diferenciais Competitivos)

### 1. Calculadora Inteligente de Custos Multi-Variável
Algoritmo que considera 7+ variáveis simultaneamente para gerar propostas comerciais em segundos.

**Tecnologias**: Algoritmo proprietário + Business Rules Engine

### 2. IA de Análise Pré-Auditoria
IA que analisa documentação antes da auditoria, extraindo produtos, ingredientes, fornecedores e identificando pontos críticos.

**Tecnologias**: OpenAI GPT-4 + RAG (Retrieval Augmented Generation)

### 3. Gestão de Contratos Colaborativa
Edição granular por cláusulas com versionamento automático e negociação em tempo real.

**Tecnologias**: React + Diff Algorithm + WebSocket (planejado)

### 4. Calendário Inteligente de Auditorias
Algoritmo de scheduling que otimiza alocação de 22 auditores considerando especialização, localização e carga de trabalho.

**Tecnologias**: Constraint Satisfaction Algorithm + Graph Theory

### 5. Assistente Virtual Multilíngue
Chatbot com IA treinada em certificação Halal, suportando 4 idiomas (PT, EN, AR, ES).

**Tecnologias**: OpenAI GPT-4 + RAG + i18n

### 6. Workflow Automatizado com 12 Fases
Workflow visual com rastreabilidade completa e notificações automáticas.

**Tecnologias**: State Machine Pattern + Event-Driven Architecture

---

## 📊 Modelo de Dados (Principais Entidades)

### Entidades Core

```
User (Usuários)
├── Company (Empresas)
│   ├── Process (Processos de Certificação)
│   │   ├── ProcessPhase (Fases: 1-12)
│   │   ├── Document (Documentos)
│   │   ├── Proposal (Proposta Comercial)
│   │   ├── Contract (Contrato)
│   │   ├── Audit (Auditoria)
│   │   │   ├── NonConformity (Não-Conformidades)
│   │   │   └── Evidence (Evidências)
│   │   ├── Comment (Comentários)
│   │   └── Notification (Notificações)
│   └── Supplier (Fornecedores)
├── PricingTable (Tabela de Preços)
└── IndustrialClassification (Classificação Industrial)
```

### Relacionamentos Principais
- User → Company (1:N - um usuário pode ter múltiplas empresas)
- Company → Process (1:N - uma empresa pode ter múltiplos processos)
- Process → Analyst (N:1 - processo atribuído a um analista)
- Process → Auditor (N:1 - processo atribuído a um auditor)
- Process → ProcessPhase (1:1 - fase atual do processo)
- Audit → NonConformity (1:N - auditoria pode ter várias NC's)

---

## 🔄 Workflow de Certificação (12 Fases)

| Fase | Nome | Responsável | Duração Estimada |
|------|------|-------------|------------------|
| 1 | Solicitação Enviada | Empresa | 1 dia |
| 2 | Análise Preliminar | Analista | 3-5 dias |
| 3 | Proposta Comercial | Analista | 2-3 dias |
| 4 | Proposta em Revisão | Empresa | 5-7 dias |
| 5 | Negociação de Contrato | Empresa + Analista | 5-7 dias |
| 6 | Contrato Assinado | Empresa | 2-3 dias |
| 7 | Análise Documental (Estágio 1) | Analista | 10-15 dias |
| 8 | Agendamento de Auditoria | Gestor | 5-7 dias |
| 9 | Auditoria Presencial (Estágio 2) | Auditor | 1-3 dias |
| 10 | Relatório de Auditoria | Auditor | 5-7 dias |
| 11 | Decisão do Comitê | Comitê Técnico | 7-10 dias |
| 12 | Certificado Emitido | Sistema | 1 dia |

**Total MVP**: ~2-3 meses (vs. 7-8 meses manual)

---

## 📦 Escopo do MVP

### ✅ Incluído no MVP

**Módulos Implementados**:
- ✅ Autenticação e Autorização (JWT + RBAC)
- ✅ Gestão de Usuários e Empresas
- ✅ Wizard de Solicitação de Certificação
- ✅ Análise Preliminar
- ✅ Proposta Comercial Automatizada
- ✅ Gestão de Contratos Colaborativa
- ✅ Análise Documental (Estágio 1)
- ✅ Agendamento de Auditorias
- ✅ Execução de Auditoria (Estágio 2)
- ✅ Gestão de Não-Conformidades
- ✅ Decisão do Comitê Técnico
- ✅ Emissão de Certificado Digital
- ✅ Sistema de Notificações
- ✅ Dashboard por Perfil (5 tipos)

### ❌ Fora do MVP (Roadmap Futuro)

- ❌ Auditorias de Manutenção Anual
- ❌ Renovação Trienal
- ❌ Extensão de Escopo
- ❌ Testes Laboratoriais
- ❌ Suspensão/Cancelamento de Certificados
- ❌ Integrações com ERPs de Clientes
- ❌ App Mobile Nativo (MVP: Web Responsivo)
- ❌ Pagamentos Online (processos financeiros externos)
- ❌ Portal de Auditores Mobile
- ❌ Analytics Avançado com BI

---

## 📐 Normas e Conformidade

### Normas Internacionais de Referência

| Norma | Descrição | Impacto no Sistema |
|-------|-----------|-------------------|
| **PR 7.1 Rev 21** | Procedimento Operacional Interno | Base de todo o workflow (12 fases) |
| **ISO 17065** | Requisitos para Organismos de Certificação | Rastreabilidade, imparcialidade, documentação |
| **GAC** | Global Accreditation Council | Auditabilidade, evidências, registros |
| **GSO 2055-2** | Norma de Certificação Halal do Golfo | Classificação de produtos (C1-C6) |
| **SMIIC** | Standards and Metrology Institute | Requisitos técnicos de certificação |

### Aderência no Sistema
- 🔍 **100% de rastreabilidade** através de audit trails
- 📋 **Campos obrigatórios** mapeados das normas
- ✅ **Validações automáticas** conforme requisitos normativos
- 📊 **Relatórios padronizados** segundo templates das normas

---

## 🔐 Segurança e Privacidade

### Controles Implementados

| Controle | Implementação |
|----------|---------------|
| **Autenticação** | JWT com expiração configurável |
| **Autorização** | RBAC (5 perfis: company, analista, auditor, committee, admin) |
| **Criptografia de Senhas** | bcrypt com salt rounds |
| **Proteção de Rotas** | Middleware de autenticação + autorização |
| **File Upload Seguro** | Validação de tipo, tamanho e sanitização |
| **Auditoria de Ações** | Logs de todas operações críticas |
| **HTTPS** | Obrigatório em produção |
| **Env Variables** | Segredos nunca commitados (.env no .gitignore) |

### Privacidade de Dados
- 📄 Documentos armazenados com criptografia em repouso (S3/Azure)
- 🔒 Acesso baseado em ownership (empresa vê apenas seus dados)
- 🗑️ Políticas de retenção conforme LGPD/GDPR (planejado)

---

## 📈 Métricas de Sucesso (KPIs)

### Operacionais
- ⏱️ **Tempo médio de certificação**: < 3 meses
- 📊 **Processos concluídos/mês**: +40% vs. baseline
- 🤖 **Taxa de automação**: > 70%
- ⚡ **SLA de resposta**: < 24h para análise preliminar

### Qualidade
- ✅ **Conformidade com PR 7.1**: > 95%
- 🐛 **Taxa de não-conformidades em auditorias**: < 5%
- 🔍 **Rastreabilidade de decisões**: 100%

### Satisfação
- 😊 **NPS (Net Promoter Score)**: > 50
- ⭐ **Satisfação média**: > 4.5/5
- 📞 **Redução de ligações reativas**: > 80%

### Financeiros
- 💰 **ROI**: Positivo em 18 meses
- 💵 **Redução de custo operacional/certificação**: > 30%
- 📈 **Taxa de conversão de leads**: +25%

---

## 🗓️ Roadmap e Fases

### Fase 1: MVP - ✅ CONCLUÍDO (Janeiro 2026)
- ✅ Ciclo completo de certificação inicial
- ✅ 5 perfis de usuário + perfis especializados
- ✅ Integrações básicas (storage, e-signature, email)
- ✅ Migração completa para NestJS
- ✅ Deploy em produção (23/01/2026)

### Fase 2: Grupos Empresariais - 🟡 EM ANDAMENTO (Q1 2026)
- ✅ Schema e migrations de grupos empresariais
- ✅ Backend completo para grupos
- 🔄 Frontend de gestão de grupos (71% concluído)
- 🔄 Integração ReceitaWS para consulta CNPJ

### Fase 3: Post-MVP - Q2 2026
- 🔄 Auditorias de manutenção anual
- 🔄 Renovação trienal
- 📱 App mobile (React Native)
- 💳 Gateway de pagamentos

### Fase 4: Escala - Q3-Q4 2026
- 🔗 Integrações com ERPs
- 🧪 Módulo de testes laboratoriais
- 📊 BI e Analytics avançado
- 🌍 Multi-tenant completo

### Fase 5: Internacional - 2027
- 🌐 Expansão para novos mercados
- 🏢 White-label para outras certificadoras
- 🤖 IA avançada (predição de não-conformidades)

---

## 👨‍💻 Equipe e Recursos

### Recursos Necessários (Sugerido)

| Função | Quantidade | Responsabilidades |
|--------|-----------|-------------------|
| **Product Owner** | 1 | Backlog, priorização, stakeholders |
| **Scrum Master** | 1 | Facilitação, remoção de impedimentos |
| **Tech Lead** | 1 | Arquitetura, code review, padrões |
| **Fullstack Developers** | 3-4 | Desenvolvimento frontend + backend |
| **DevOps Engineer** | 1 | Infra, CI/CD, deploy, monitoramento |
| **QA Engineer** | 1 | Testes manuais + automação |
| **UX/UI Designer** | 1 | Wireframes, protótipos, design system |

### Metodologia
- **Framework**: Scrum
- **Sprint**: 2 semanas
- **Cerimônias**: Daily, Planning, Review, Retrospective
- **Ferramentas**: Jira/Trello (backlog), Confluence (docs), Slack (comunicação)

---

## 🔧 Configuração e Deploy

### Variáveis de Ambiente Críticas

```bash
# Database
SQL_HALALSPHERE_CONNECTION=postgresql://user:password@host:5432/halalsphere

# JWT (par de chaves RSA)
JWT_PUBLIC_KEY_HALALSPHERE_API=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
JWT_PRIVATE_KEY_HALALSPHERE_API=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
JWT_EXPIRES_IN=7d

# Storage (escolher um)
STORAGE_PROVIDER=aws-s3 | azure | google-cloud
AWS_S3_BUCKET=your-bucket
# AWS credentials não necessárias - ECS usa IAM Roles em produção

# E-Signature (escolher um)
ESIGNATURE_PROVIDER=docusign | adobe-sign | clicksign
DOCUSIGN_API_KEY=your-api-key

# Email
EMAIL_PROVIDER=aws-ses | sendgrid
SENDGRID_API_KEY=your-key

# OpenAI (IA)
OPENAI_API_KEY=your-openai-key
```

### Deploy (Sugestão)

**Desenvolvimento**:
- Frontend: Vite dev server (porta 5173)
- Backend: ts-node-dev (porta 3001)
- Database: PostgreSQL local ou Docker

**Produção**:
- Frontend: Vercel / Netlify / AWS S3 + CloudFront
- Backend: AWS EC2 / AWS ECS / DigitalOcean / Heroku
- Database: AWS RDS PostgreSQL / Azure Database

---

## 📚 Documentação Relacionada

### Documentos Principais
- 📘 [PRD Completo](./01-prd/01-overview.md) - Product Requirements Document
- 🎯 [User Stories](./01-prd/05-user-stories/) - Histórias de usuário por épico
- 🏗️ [Arquitetura Técnica](./02-technical/) - Detalhes técnicos de implementação
- 🔄 [Guia de Processos](./PROCESS/) - Documentação de processos de negócio
- 🧪 [Estratégia de Testes](./TESTING/) - Planos e casos de teste

### Links Úteis
- **Repositório**: Git (branch principal: `main`, desenvolvimento: `develop`)
- **API Docs**: Swagger/OpenAPI disponível em `/api/docs` (301 endpoints documentados)
- **GitHub Docs**: https://ecohalal.github.io/halalsphere-docs/
- **Produção**: https://halalsphere.ecohalal.solutions

---

## 📞 Contatos e Suporte

### Product Owner
- **Nome**: [A definir]
- **Email**: [A definir]
- **Slack**: [A definir]

### Tech Lead
- **Nome**: [A definir]
- **Email**: [A definir]
- **Slack**: [A definir]

### Canais de Comunicação
- 💬 **Slack**: #halalsphere-dev (desenvolvimento), #halalsphere-product (produto)
- 📧 **Email**: halalsphere-team@[empresa].com
- 🎫 **Suporte**: Jira Service Desk

---

## 📝 Notas Adicionais

### Dependências Críticas
- ✅ PostgreSQL 15+ instalado e configurado
- ✅ Node.js 20.x + npm
- ✅ Conta AWS (S3) ou Azure ou Google Cloud
- ✅ Conta DocuSign ou Adobe Sign ou Clicksign
- ✅ Conta OpenAI (para funcionalidades de IA)

### Riscos Identificados
- ⚠️ **Complexidade de integrações**: Múltiplos provedores (storage, e-sign) requerem abstração robusta
- ⚠️ **Performance com escala**: 600-700 empresas + documentos pesados exigem otimização
- ⚠️ **Curva de aprendizado**: Stakeholders não-técnicos precisarão treinamento
- ⚠️ **Custos de IA**: OpenAI API pode gerar custos significativos em escala

### Mitigações
- ✅ Padrão Strategy para integrations (fácil trocar providers)
- ✅ Lazy loading, paginação, caching de queries
- ✅ Plano de treinamento e onboarding detalhado
- ✅ Rate limiting + cache de respostas da IA

---

## 🏁 Conclusão

O **HalalSphere** representa uma transformação digital completa no setor de certificação Halal, combinando automação inteligente, IA e conformidade normativa para reduzir drasticamente tempos de certificação enquanto aumenta qualidade e satisfação.

**Conquistas Recentes (Janeiro 2026)**:
1. ✅ MVP concluído e em produção
2. ✅ Migração completa para NestJS
3. ✅ Deploy em produção realizado (23/01/2026)
4. ✅ 301 endpoints de API documentados
5. ✅ Sistema de grupos empresariais em desenvolvimento (71%)

**Próximos Passos**:
1. 🔄 Concluir frontend de grupos empresariais
2. 🔄 Integração ReceitaWS para consulta CNPJ
3. 🧪 Testes com usuários piloto (5-10 empresas)
4. 📊 Coletar feedback e iterar
5. 📈 Implementar auditorias de manutenção e renovação

---

**Última Atualização**: 2026-01-23
**Versão do Documento**: 2.0
**Elaborado por**: Equipe HalalSphere
