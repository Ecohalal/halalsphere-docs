# HalalSphere - Setup Guide

**Sistema Inteligente de Gestão de Certificação Halal com IA**

⚠️ **ATENÇÃO: REPOSITÓRIO DIVIDIDO**

Este guia é para o monorepo histórico. Para desenvolvimento ativo:
- **Backend:** https://github.com/Ecohalal/halalsphere-backend
- **Frontend:** https://github.com/Ecohalal/halalsphere-frontend

Veja [MULTI-REPO-DEVELOPMENT-GUIDE.md](./MULTI-REPO-DEVELOPMENT-GUIDE.md) para setup dos novos repositórios.

---

Este guia te ajudará a configurar e executar o projeto HalalSphere localmente (versão monorepo histórica).

---

## 📋 Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** v20+ ([Download](https://nodejs.org/))
- **Docker** & Docker Compose ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

Versões verificadas neste setup:
- Node.js: v22.20.0
- npm: 11.6.2
- Docker: 28.1.1
- Git: 2.49.0

---

## 🚀 Quick Start (5 minutos)

### 1. Clone o repositório (se ainda não fez)
```bash
git clone <seu-repositorio>
cd HalalSphere
```

### 2. Inicie o banco de dados
```bash
docker-compose up -d
```

Aguarde os containers iniciarem (PostgreSQL + Redis). Verifique com:
```bash
docker-compose ps
```

Você deverá ver:
- `halalsphere-postgres` - running
- `halalsphere-redis` - running

### 3. Configure o backend
```bash
cd backend

# Copie o arquivo de exemplo
cp .env.example .env

# Instale as dependências
npm install

# Gere o Prisma Client
npm run prisma:generate

# Execute as migrations
npm run prisma:migrate

# Popule o banco com dados de teste
npm run prisma:seed
```

### 4. Configure o frontend
```bash
cd ../frontend

# Instale as dependências
npm install
```

### 5. Execute o projeto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Acesse: http://localhost:3333

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

---

## 🔑 Usuários de Teste

Após executar o seed, você terá estes usuários disponíveis:

| Função | Email | Senha | Descrição |
|--------|-------|-------|-----------|
| **Empresa** | empresa@teste.com | senha123 | Solicitante de certificação |
| **Analista** | analista@halalsphere.com | senha123 | Analista de documentos |
| **Auditor** | auditor@halalsphere.com | senha123 | Auditor de campo |
| **Gestor** | gestor@halalsphere.com | senha123 | Gestor de comitê |

---

## 📦 Estrutura do Projeto

```
HalalSphere/
├── backend/              # API NestJS 11 + Prisma 7
│   ├── src/
│   │   ├── modules/     # Módulos (auth, processes, users, ai, contracts)
│   │   ├── shared/      # Config, utils, types
│   │   └── server.ts    # Servidor principal
│   ├── prisma/
│   │   ├── schema.prisma # Schema do banco (19 tabelas)
│   │   └── seed.ts       # Dados de teste
│   └── package.json
├── frontend/             # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/       # Páginas (Login, Dashboard, etc)
│   │   ├── components/  # Componentes reutilizáveis
│   │   └── lib/         # Utilidades e configurações
│   └── package.json
├── docker-compose.yml    # PostgreSQL 16 + Redis
├── docs/                 # Documentação completa
│   ├── 01-prd/          # Product Requirements (69 stories)
│   ├── 02-technical/    # Arquitetura técnica
│   ├── 03-ux/           # Design system
│   └── 04-implementation/ # Guias de implementação
└── README.md
```

---

## 🗄️ Database

### PostgreSQL (pgvector)

**Conexão:**
- Host: localhost
- Port: 5432
- Database: halalsphere
- User: admin
- Password: secret123

**Tabelas criadas (19):**
1. users
2. companies
3. requests
4. processes
5. documents
6. contracts
7. audits
8. committee_decisions
9. certificates
10. ai_analyses
11. knowledge_base
12. chat_messages
13. notifications
14. process_phase_history
15. audit_trail
... (consulte docs/02-technical/03-database/README.md para detalhes completos)

### Prisma Studio (GUI para o banco)
```bash
cd backend
npm run prisma:studio
```

Acesse: http://localhost:5555

### Redis

**Conexão:**
- Host: localhost
- Port: 6379

**Uso:** Cache, sessões, rate limiting

---

## 🛠️ Comandos Úteis

### Backend

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start

# Prisma
npm run prisma:generate    # Gera o Prisma Client
npm run prisma:migrate     # Cria migrations
npm run prisma:studio      # Abre GUI do banco
npm run prisma:seed        # Popula com dados de teste
npm run db:reset           # Reset completo do banco
```

### Frontend

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

### Docker

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f

# Ver status
docker-compose ps

# Resetar volumes (CUIDADO: apaga dados)
docker-compose down -v
```

---

## 🎨 Design System

O projeto usa o design system **Autoridade Clássica** baseado no logo HalalSphere:

### Cores Principais

```css
/* Primary (Verde Halal) */
--primary: #00843D
--primary-dark: #006830
--primary-light: #00A34D

/* Secondary (Dourado Premium) */
--secondary: #D4AF37
--secondary-dark: #B8933D
--secondary-light: #E8C468

/* Semantic */
--success: #10B981
--warning: #F59E0B
--error: #EF4444
--info: #3B82F6
```

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Tamanhos**: 4xl (36px) → xs (12px)

Consulte [docs/03-ux/01-design-system.md](docs/03-ux/01-design-system.md) para detalhes completos.

---

## 📚 Documentação

A documentação completa está em `docs/`:

- **[Índice Geral](docs/README.md)** - Comece aqui
- **[PRD v2.0](docs/01-prd/README.md)** - 69 user stories, 594 SP
- **[Technical Architecture](docs/02-technical/README.md)** - Stack, database, APIs
- **[UX Design Guide](docs/03-ux/README.md)** - Design system, componentes
- **[Mockup Plan](docs/04-implementation/02-mockup-plan.md)** - Plano de 5 dias

---

## 🐛 Troubleshooting

### Problema: Porta 5432 já está em uso
**Solução:**
```bash
# Parar o PostgreSQL local
sudo service postgresql stop

# Ou mude a porta no docker-compose.yml:
ports:
  - "5433:5432"  # Mude para 5433
```

### Problema: Prisma não encontra o banco
**Solução:**
```bash
# Verifique se o Docker está rodando
docker-compose ps

# Verifique o SQL_HALALSPHERE_CONNECTION no .env
SQL_HALALSPHERE_CONNECTION="postgresql://admin:secret123@localhost:5432/halalsphere?schema=public"

# Recrie o Prisma Client
npm run prisma:generate
```

### Problema: Frontend não conecta no backend
**Solução:**
```bash
# Verifique se o backend está rodando na porta 3333
curl http://localhost:3333/health

# Verifique o CORS no backend (backend/src/server.ts)
origin: 'http://localhost:5173'
```

---

## 🔐 Variáveis de Ambiente

### Backend (.env)

```env
# Database
SQL_HALALSPHERE_CONNECTION="postgresql://admin:secret123@localhost:5432/halalsphere?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT (usar par de chaves RSA)
JWT_PUBLIC_KEY_HALALSPHERE_API="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
JWT_PRIVATE_KEY_HALALSPHERE_API="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_EXPIRES_IN="7d"

# Server
PORT=3333
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

---

## 🚢 Deploy (Produção)

### Pré-requisitos de Produção

1. **PostgreSQL 16** com extensão pgvector
2. **Redis 7**
3. **Node.js 20+**
4. **Certificado SSL** (HTTPS obrigatório)

### Variáveis de Ambiente de Produção

```env
NODE_ENV="production"
SQL_HALALSPHERE_CONNECTION="postgresql://user:pass@prod-db.com:5432/halalsphere"
REDIS_URL="redis://prod-redis.com:6379"
JWT_PUBLIC_KEY_HALALSPHERE_API="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
JWT_PRIVATE_KEY_HALALSPHERE_API="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
CORS_ORIGIN="https://halalsphere.com"

# AWS credentials não necessárias - ECS usa IAM Roles
```

### Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Deploy pasta dist/ para CDN/hosting
```

---

## 📞 Suporte

- **Documentação**: [docs/README.md](docs/README.md)
- **Issues**: [GitHub Issues](#)
- **Email**: suporte@halalsphere.com

---

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**Última atualização**: 13 de Novembro de 2025
**Versão**: 1.0.0 (Mockup)
**Status**: ✅ Pronto para desenvolvimento

