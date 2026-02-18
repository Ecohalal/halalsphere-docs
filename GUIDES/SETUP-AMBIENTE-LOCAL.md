# HalalSphere - Guia de Setup do Ambiente Local

**Versao:** 1.0 | **Data:** 18/02/2026
**Stack:** NestJS 11 + React 19 + PostgreSQL 16 + Redis 7

---

## Pre-requisitos

| Ferramenta | Versao Minima | Verificar |
|---|---|---|
| **Node.js** | v20+ | `node -v` |
| **npm** | v10+ | `npm -v` |
| **Docker** + Compose | v24+ / v2+ | `docker --version` && `docker compose version` |
| **Git** | v2.30+ | `git --version` |

> **Windows:** Instalar Docker Desktop com WSL2 habilitado.

---

## 1. Clonar os Repositorios

Estrutura recomendada:

```
C:\Projetos\                    (ou ~/projetos/)
├── halalsphere-backend/        # API NestJS
├── halalsphere-frontend/       # SPA React
└── halalsphere-docs/           # Documentacao (opcional)
```

```bash
# Criar diretorio base
mkdir -p ~/projetos && cd ~/projetos

# Clonar repos
git clone https://github.com/Ecohalal/halalsphere-backend.git
git clone https://github.com/Ecohalal/halalsphere-frontend.git
git clone https://github.com/Ecohalal/halalsphere-docs.git   # opcional
```

---

## 2. Subir Infraestrutura (PostgreSQL + Redis)

O `docker-compose.yml` fica no repo do backend.

```bash
cd halalsphere-backend

# Subir PostgreSQL 16 (com pgvector) + Redis 7
docker compose up -d
```

Verificar se subiu corretamente:

```bash
# Status dos containers
docker compose ps

# Logs (caso algum nao suba)
docker compose logs postgres
docker compose logs redis

# Testar conexao PostgreSQL
docker exec halalsphere-postgres pg_isready -U admin -d halalsphere
# Esperado: /var/run/postgresql:5432 - accepting connections

# Testar conexao Redis
docker exec halalsphere-redis redis-cli ping
# Esperado: PONG
```

**Servicos disponiveis:**

| Servico | Host | Porta | Credenciais |
|---|---|---|---|
| PostgreSQL | localhost | 5432 | admin / secret123 / halalsphere |
| Redis | localhost | 6379 | sem senha |

> **Nota:** O container PostgreSQL usa a imagem `pgvector/pgvector:pg16` que ja inclui a extensao `vector` para embeddings de IA. As extensoes `uuid-ossp`, `pgcrypto`, `pg_trgm` e `vector` sao criadas automaticamente na primeira inicializacao.

---

## 3. Configurar Backend

### 3.1 Instalar dependencias

```bash
cd halalsphere-backend
npm ci
```

### 3.2 Configurar variaveis de ambiente

```bash
# Copiar template
cp .env.example .env
```

Editar o `.env` com os valores para desenvolvimento local:

```env
# Server
PORT=3333
NODE_ENV=development

# Database (apontar para o container Docker)
SQL_HALALSPHERE_CONNECTION=postgresql://admin:secret123@localhost:5432/halalsphere

# JWT - HS256 para desenvolvimento local (mais simples)
JWT_SECRET=dev-secret-key-minimum-32-characters-for-hs256-local-development
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# Redis
REDIS_URL=redis://localhost:6379

# AWS (deixar vazio para dev local - upload de arquivos usara filesystem)
AWS_REGION=us-east-1
```

> **Importante:** Em desenvolvimento local usamos JWT com HS256 (chave simetrica). Em producao o sistema usa RS256 com chaves RSA via AWS Secrets Manager.

### 3.3 Executar migrations do Prisma

```bash
# Gerar o Prisma Client
npx prisma generate

# Aplicar todas as migrations
npx prisma migrate deploy
```

### 3.4 Popular banco com dados de teste (seed)

```bash
npx prisma db seed
```

Isso cria:
- **12 usuarios** de teste (todos os perfis/roles)
- **1 empresa** teste com grupo e planta industrial
- **Tabela de precos** v1.0
- **Classificacao industrial** GSO 2055-2 (11 grupos, 22 categorias)
- **8 auditores** com competencias

### 3.5 Iniciar o backend

```bash
npm run start:dev
```

Verificar:
- API: http://localhost:3333/health
- Swagger: http://localhost:3333/api/docs

---

## 4. Configurar Frontend

### 4.1 Instalar dependencias

```bash
cd halalsphere-frontend
npm ci
```

### 4.2 Configurar variaveis de ambiente

```bash
cp .env.example .env.local
```

O conteudo padrao ja funciona para dev local:

```env
VITE_API_URL=http://localhost:3333
VITE_ENV=development
```

### 4.3 Iniciar o frontend

```bash
npm run dev
```

Acessar: http://localhost:5173

---

## 5. Usuarios de Teste

Todos usam a senha: **`A123456!`**

| Email | Role | Descricao |
|---|---|---|
| `admin@halalsphere.com` | ADMIN | Administrador do sistema |
| `teste@empresa.com` | EMPRESA | Empresa solicitante |
| `analista@halalsphere.com` | ANALISTA | Analista documental |
| `auditor@halalsphere.com` | AUDITOR | Auditor de campo |
| `gestor@halalsphere.com` | GESTOR | Gestor de certificacao |
| `comercial@halalsphere.com` | COMERCIAL | Equipe comercial |
| `juridico@halalsphere.com` | JURIDICO | Equipe juridica |
| `financeiro@halalsphere.com` | FINANCEIRO | Equipe financeira |
| `gestor_auditoria@halalsphere.com` | GESTOR_AUDITORIA | Gestor de auditoria |
| `supervisor@halalsphere.com` | SUPERVISOR | Supervisor |
| `controlador@halalsphere.com` | CONTROLADOR | Controlador de qualidade |
| `secretaria@halalsphere.com` | SECRETARIA | Secretaria |

---

## 6. Comandos Uteis

### Backend

```bash
# Desenvolvimento (hot reload)
npm run start:dev

# Build producao
npm run build

# Testes unitarios
npm run test

# Testes E2E
npm run test:e2e

# Reset completo do banco
npx prisma migrate reset --force

# Abrir Prisma Studio (GUI para o banco)
npx prisma studio

# Ver status das migrations
npx prisma migrate status
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build producao
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

### Docker

```bash
# Subir infraestrutura
docker compose up -d

# Parar infraestrutura (mantem dados)
docker compose down

# Parar E apagar todos os dados (reset completo)
docker compose down -v

# Ver logs em tempo real
docker compose logs -f postgres
docker compose logs -f redis

# Subir TUDO via Docker (infra + backend containerizado)
docker compose --profile full up -d

# Acessar shell do PostgreSQL
docker exec -it halalsphere-postgres psql -U admin -d halalsphere

# Backup do banco
docker exec halalsphere-postgres pg_dump -U admin halalsphere > backup.sql

# Restaurar backup
docker exec -i halalsphere-postgres psql -U admin halalsphere < backup.sql
```

---

## 7. Setup Completo via Docker (Alternativo)

Se preferir rodar o **backend tambem via Docker** (sem instalar Node localmente):

```bash
cd halalsphere-backend

# Sobe PostgreSQL + Redis + Backend
docker compose --profile full up -d --build
```

Neste modo:
- Migrations rodam automaticamente (AUTO_MIGRATE=true)
- Backend disponivel em http://localhost:3333
- Voce ainda precisa rodar o frontend localmente (`npm run dev` no repo frontend)

> **Nota:** Para desenvolvimento ativo do backend, recomendamos rodar `npm run start:dev` localmente (hot reload mais rapido). Use o profile `full` apenas para testes de integracao ou demonstracoes.

---

## 8. Troubleshooting

### Porta 5432 ja em uso

```bash
# Verificar o que esta usando a porta
# Windows:
netstat -ano | findstr :5432
# Linux/Mac:
lsof -i :5432

# Solucao: parar o PostgreSQL local ou mudar a porta no docker-compose.yml
```

### Erro de conexao com o banco

```bash
# Verificar se o container esta rodando
docker compose ps

# Verificar se as extensoes foram criadas
docker exec halalsphere-postgres psql -U admin -d halalsphere -c "\dx"
# Deve listar: uuid-ossp, pgcrypto, pg_trgm, vector
```

### Prisma migrate falha

```bash
# Forcar reset completo (APAGA TODOS OS DADOS)
npx prisma migrate reset --force

# Se persistir, verificar se DATABASE_URL esta correto no .env
npx prisma migrate status
```

### Frontend nao conecta na API

1. Verificar se o backend esta rodando: http://localhost:3333/health
2. Verificar `VITE_API_URL` no `.env.local`
3. Verificar CORS: `CORS_ORIGIN=http://localhost:5173` no `.env` do backend

### Erro "vector extension not found"

A imagem `pgvector/pgvector:pg16` ja inclui a extensao. Se houver erro:

```bash
docker exec halalsphere-postgres psql -U admin -d halalsphere -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### Resetar tudo do zero

```bash
# Parar e remover containers + volumes
cd halalsphere-backend
docker compose down -v

# Subir novamente
docker compose up -d

# Aguardar PostgreSQL ficar healthy (~10s)
docker compose ps

# Re-executar migrations e seed
npx prisma migrate deploy
npx prisma db seed
```

---

## 9. Estrutura de Portas

| Servico | Porta | URL |
|---|---|---|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (NestJS) | 3333 | http://localhost:3333 |
| Swagger Docs | 3333 | http://localhost:3333/api/docs |
| Prisma Studio | 5555 | http://localhost:5555 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |

---

## Resumo Rapido (TL;DR)

```bash
# 1. Clonar
git clone https://github.com/Ecohalal/halalsphere-backend.git
git clone https://github.com/Ecohalal/halalsphere-frontend.git

# 2. Infraestrutura
cd halalsphere-backend
docker compose up -d

# 3. Backend
cp .env.example .env
# Editar .env (ver secao 3.2)
npm ci
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev

# 4. Frontend (novo terminal)
cd halalsphere-frontend
cp .env.example .env.local
npm ci
npm run dev

# 5. Acessar
# http://localhost:5173 (login: admin@halalsphere.com / A123456!)
```
