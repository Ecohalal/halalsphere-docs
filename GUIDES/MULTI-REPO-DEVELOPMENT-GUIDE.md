# Guia de Desenvolvimento Multi-Repositório

**Versão:** 1.0
**Data:** 2026-01-12
**Status:** Ativo

## 📋 Visão Geral

O HalalSphere agora está dividido em dois repositórios independentes mas integrados:
- **Backend:** API REST (NestJS 11 + Express + Prisma 7)
- **Frontend:** Interface Web (React + Vite)

Este guia ensina como desenvolver de forma eficiente nesta estrutura.

## 🏗️ Estrutura de Pastas Recomendada

```bash
/c/Projetos/
├── halalsphere-backend/          # API Backend
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── package.json
│
├── halalsphere-frontend/         # Web Frontend
│   ├── src/
│   ├── scripts/
│   └── package.json
│
└── HalalSphere/                  # Monorepo (histórico/docs)
    └── docs/
```

## 🚀 Setup Inicial

### 1. Clonar Repositórios (Primeira Vez)

```bash
cd /c/Projetos

# Backend
git clone https://github.com/Ecohalal/halalsphere-backend.git
cd halalsphere-backend
npm install

# Frontend
cd ..
git clone https://github.com/Ecohalal/halalsphere-frontend.git
cd halalsphere-frontend
npm install
```

### 2. Configurar Ambiente Local

#### Backend (.env)
```bash
cd /c/Projetos/halalsphere-backend
cp .env.example .env

# Editar .env com suas configurações locais
cat > .env << 'EOF'
# Database
SQL_HALALSPHERE_CONNECTION=postgresql://admin:secret123@localhost:5432/halalsphere

# Redis
REDIS_URL=redis://localhost:6379

# JWT (usar par de chaves RSA - gerar com: ssh-keygen -t rsa -b 2048)
JWT_PUBLIC_KEY_HALALSPHERE_API=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
JWT_PRIVATE_KEY_HALALSPHERE_API=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
JWT_EXPIRES_IN=7d

# AWS (desenvolvimento local)
AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY não são necessários - ECS usa IAM Roles

# Server
PORT=3333
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
EOF
```

#### Frontend (.env.local)
```bash
cd /c/Projetos/halalsphere-frontend
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3333
VITE_ENV=development
EOF
```

### 3. Iniciar Banco de Dados

```bash
cd /c/Projetos/halalsphere-backend

# Iniciar PostgreSQL e Redis
docker-compose up -d postgres redis

# Rodar migrations
npm run prisma:migrate

# Seed inicial
npm run prisma:seed
```

## 💻 Workflow de Desenvolvimento Diário

### Cenário 1: Desenvolvimento Full-Stack Local

**Terminal 1 - Backend:**
```bash
cd /c/Projetos/halalsphere-backend
npm run dev
# Server em http://localhost:3333
# Docs em http://localhost:3333/docs
```

**Terminal 2 - Frontend:**
```bash
cd /c/Projetos/halalsphere-frontend
npm run dev
# App em http://localhost:5173
```

**Terminal 3 - Comandos auxiliares:**
```bash
# Ver logs do DB
cd /c/Projetos/halalsphere-backend
docker-compose logs -f postgres

# Prisma Studio (visualizar dados)
npm run prisma:studio
# Abre em http://localhost:5555
```

### Cenário 2: Desenvolvimento Apenas Backend

```bash
cd /c/Projetos/halalsphere-backend

# Modo desenvolvimento
npm run dev

# Testar endpoints manualmente
curl http://localhost:3333/health/ready

# Ou usar o Swagger
# http://localhost:3333/docs
```

### Cenário 3: Desenvolvimento Apenas Frontend

```bash
# Backend em produção/staging (remoto)
cd /c/Projetos/halalsphere-frontend

# Apontar para backend remoto
echo "VITE_API_URL=https://staging-api.halalsphere.com" > .env.local

# Iniciar dev
npm run dev
```

## 🔄 Sincronização entre Repositórios

### Workflow Típico de Feature

#### 1. Criar Branches Sincronizadas

```bash
# Backend
cd /c/Projetos/halalsphere-backend
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade

# Frontend
cd /c/Projetos/halalsphere-frontend
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade
```

**Convenção:** Use **o mesmo nome de branch** em ambos os repos quando a feature envolve mudanças nos dois.

#### 2. Desenvolver Feature

**Exemplo: Adicionar novo endpoint de relatórios**

**Backend primeiro:**
```bash
cd /c/Projetos/halalsphere-backend

# 1. Criar tipos/interfaces
# 2. Criar rota e controller
# 3. Adicionar testes
# 4. Testar localmente

git add src/modules/reports/
git commit -m "feat(backend): add reports API endpoint"
git push origin feature/nova-funcionalidade
```

**Frontend depois:**
```bash
cd /c/Projetos/halalsphere-frontend

# 1. Criar service para consumir API
# 2. Criar componentes
# 3. Adicionar à interface
# 4. Testar integração local

git add src/services/reports.service.ts src/pages/Reports.tsx
git commit -m "feat(frontend): add reports page consuming new API"
git push origin feature/nova-funcionalidade
```

#### 3. Code Review e Merge

**Backend PR:**
```
Title: feat(backend): Add reports API endpoint
Description:
- Nova rota GET /api/reports
- Filtros por data e tipo
- Paginação incluída

Related Frontend PR: Ecohalal/halalsphere-frontend#123
```

**Frontend PR:**
```
Title: feat(frontend): Add reports page
Description:
- Nova página de relatórios
- Integração com API /api/reports
- Filtros e exportação

Related Backend PR: Ecohalal/halalsphere-backend#456
```

**Ordem de Merge:**
1. ✅ Merge backend primeiro
2. ✅ Deploy backend (staging)
3. ✅ Merge frontend
4. ✅ Deploy frontend (staging)

### Estratégias de Versionamento

#### Opção 1: Versionamento Independente (Recomendado)

```bash
# Backend
v1.0.0 - Initial release
v1.1.0 - Add reports API
v1.2.0 - Add filters

# Frontend
v1.0.0 - Initial release
v1.0.1 - Fix button styling
v1.1.0 - Add reports page
```

**Vantagens:**
- Backend e frontend evoluem no próprio ritmo
- Hotfix em um não afeta o outro
- Mais flexível

#### Opção 2: Versionamento Sincronizado

```bash
# Ambos
v1.0.0 - Initial release
v1.1.0 - Reports feature (backend + frontend)
v1.2.0 - Filters improvement
```

**Vantagens:**
- Fácil rastrear features completas
- Releases coordenados
- Melhor para usuário final

## 🔀 Estratégias de Branching

### Git Flow Adaptado

```
Backend e Frontend (mesma estrutura):

main (ou master)
  └─ production deployments
  └─ tags: v1.0.0, v1.1.0, etc

develop
  └─ integration branch
  └─ auto-deploy para staging

feature/*
  └─ novas funcionalidades
  └─ feature/reports
  └─ feature/user-profile

hotfix/*
  └─ correções urgentes em prod
  └─ hotfix/critical-bug

release/*
  └─ preparação de releases
  └─ release/v1.1.0
```

### Comandos Úteis

```bash
# Criar feature
git checkout develop
git pull origin develop
git checkout -b feature/nome-feature

# Atualizar feature com develop
git checkout feature/nome-feature
git pull origin develop --rebase

# Finalizar feature
git checkout develop
git merge feature/nome-feature
git push origin develop
git branch -d feature/nome-feature
```

## 🧪 Testando Integração Local

### 1. Backend + Frontend Local

```bash
# Terminal 1 - Backend
cd /c/Projetos/halalsphere-backend
npm run dev

# Terminal 2 - Frontend
cd /c/Projetos/halalsphere-frontend
npm run dev

# Testar no navegador
# http://localhost:5173
```

### 2. Frontend com Backend Remoto

```bash
cd /c/Projetos/halalsphere-frontend

# Apontar para staging
echo "VITE_API_URL=https://staging-api.halalsphere.com" > .env.local

npm run dev
```

### 3. Testar API Diretamente

```bash
# Via curl
curl http://localhost:3333/api/processes

# Via Swagger UI
# http://localhost:3333/docs

# Via Postman/Insomnia
# Importar swagger.yaml do backend
```

## 📝 Convenções de Commit

### Backend
```bash
feat(auth): add password reset endpoint
fix(process): correct status transition logic
docs(api): update swagger for reports endpoint
refactor(db): optimize query performance
test(process): add integration tests
chore(deps): update prisma to 6.2
```

### Frontend
```bash
feat(reports): add reports page with filters
fix(login): correct form validation
style(dashboard): improve responsive layout
refactor(api): centralize error handling
test(components): add unit tests for Card
chore(deps): update react to 18.3
```

### Prefixos Comuns
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação, CSS
- `refactor:` Refatoração de código
- `test:` Adicionar/modificar testes
- `chore:` Manutenção, deps, config

## 🚀 Deploy Coordenado

### Processo de Release

#### 1. Preparar Backend
```bash
cd /c/Projetos/halalsphere-backend
git checkout develop
git pull origin develop

# Criar release branch
git checkout -b release/v1.1.0

# Atualizar versão
# Editar package.json: "version": "1.1.0"
git add package.json
git commit -m "chore: bump version to 1.1.0"

# Merge para main
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Release v1.1.0 - Reports feature"
git push origin main --tags

# Merge back para develop
git checkout develop
git merge release/v1.1.0
git push origin develop
```

#### 2. Deploy Backend
```bash
# CI/CD automático ao push na main
# Ou manual:
docker build -t halalsphere-backend:v1.1.0 .
# Push to ECR e deploy no ECS
```

#### 3. Preparar Frontend
```bash
cd /c/Projetos/halalsphere-frontend
git checkout develop
git pull origin develop

# Criar release branch
git checkout -b release/v1.1.0

# Atualizar versão
# Editar package.json: "version": "1.1.0"
git add package.json
git commit -m "chore: bump version to 1.1.0"

# Merge para main
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Release v1.1.0 - Reports UI"
git push origin main --tags

# Merge back para develop
git checkout develop
git merge release/v1.1.0
git push origin develop
```

#### 4. Deploy Frontend
```bash
# Build e deploy para S3
cd /c/Projetos/halalsphere-frontend
npm run build:production
./scripts/deploy-s3.sh production
```

### Checklist de Release

**Backend:**
- [ ] Todas as migrations rodadas
- [ ] Testes passando
- [ ] Swagger atualizado
- [ ] Health checks funcionando
- [ ] Variáveis de ambiente configuradas

**Frontend:**
- [ ] Build sem erros
- [ ] Testes E2E passando
- [ ] URLs da API corretas (.env.production)
- [ ] Assets otimizados

**Integração:**
- [ ] Testar fluxo completo em staging
- [ ] Verificar logs de erro
- [ ] Monitoramento ativo

## 🐛 Debugging Multi-Repo

### Problema: Frontend não conecta ao Backend

```bash
# 1. Verificar backend está rodando
curl http://localhost:3333/health

# 2. Verificar CORS
# Backend deve ter CORS_ORIGIN=http://localhost:5173

# 3. Verificar .env.local do frontend
cat /c/Projetos/halalsphere-frontend/.env.local
# Deve ter: VITE_API_URL=http://localhost:3333

# 4. Ver logs do frontend
# Abrir DevTools → Console

# 5. Ver logs do backend
cd /c/Projetos/halalsphere-backend
# Verificar terminal ou docker logs
```

### Problema: Mudança no Backend quebrou Frontend

```bash
# 1. Verificar versão da API
curl http://localhost:3333/

# 2. Ver breaking changes
cd /c/Projetos/halalsphere-backend
git log --oneline -10

# 3. Atualizar tipos/interfaces no frontend
cd /c/Projetos/halalsphere-frontend
# Atualizar services para nova API

# 4. Considerar versionamento de API
# Backend: /api/v1/processes, /api/v2/processes
```

### Problema: Conflitos em Develop

```bash
# Backend e frontend têm develops diferentes
# Sempre sincronizar antes de começar feature

cd /c/Projetos/halalsphere-backend
git checkout develop
git pull origin develop

cd /c/Projetos/halalsphere-frontend
git checkout develop
git pull origin develop
```

## 📦 Dependências Compartilhadas

### Tipos TypeScript (Opcional)

Se quiser compartilhar tipos entre backend e frontend:

**Opção 1: Package NPM Privado**
```bash
# Criar repo
github.com/Ecohalal/halalsphere-types

# Publicar
npm publish --access private

# Usar no backend
npm install @ecohalal/halalsphere-types

# Usar no frontend
npm install @ecohalal/halalsphere-types
```

**Opção 2: Git Submodule**
```bash
# Backend
cd /c/Projetos/halalsphere-backend
git submodule add https://github.com/Ecohalal/halalsphere-types.git src/types

# Frontend
cd /c/Projetos/halalsphere-frontend
git submodule add https://github.com/Ecohalal/halalsphere-types.git src/types
```

**Opção 3: Copiar/Colar (Mais Simples)**
```bash
# Manter DTOs manualmente sincronizados
# Backend: src/modules/process/process.types.ts
# Frontend: src/types/process.types.ts
```

## 🔐 Secrets e Configuração

### Development (Local)
```bash
# Backend: .env (git ignored)
# Frontend: .env.local (git ignored)
```

### Staging/Production
```bash
# Backend: AWS Secrets Manager
# Frontend: Build-time env vars

# Ver: docs/ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md
```

## 📚 Documentação

### Onde Documentar

**Backend (halalsphere-backend):**
- API endpoints: `swagger.yaml`
- Arquitetura: `docs/ARCHITECTURE/`
- Testes: `docs/TESTING/`
- AWS: `docs/ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md`

**Frontend (halalsphere-frontend):**
- Componentes: `src/components/README.md`
- Deploy: `scripts/README.md`
- Páginas: Comentários JSDoc

**Geral (HalalSphere - monorepo):**
- PRD: `docs/01-prd/`
- Processo: `docs/PROCESS/`
- Guias: `docs/GUIDES/` (este arquivo!)

## 🎯 Boas Práticas

### ✅ DO

1. **Sincronizar branches** - Usar mesmo nome quando feature toca nos dois repos
2. **Commitar frequentemente** - Commits pequenos e descritivos
3. **Testar integração local** - Rodar backend + frontend juntos antes de PR
4. **Documentar breaking changes** - No PR e no CHANGELOG
5. **Versionar APIs** - `/api/v1/`, `/api/v2/` para breaking changes
6. **Revisar PRs relacionados** - Backend PR deve linkar Frontend PR
7. **Deploy staging primeiro** - Sempre testar em staging antes de prod
8. **Manter READMEs atualizados** - Especialmente setup e env vars

### ❌ DON'T

1. **Não fazer breaking changes** sem coordenar com outro repo
2. **Não commitar .env** com secrets
3. **Não mergear sem revisar** PR relacionado no outro repo
4. **Não deployar sem testar** integração completa
5. **Não usar branches diferentes** para mesma feature nos dois repos
6. **Não esquecer migrations** ao mudar schema no backend
7. **Não hardcodar URLs** - sempre usar variáveis de ambiente
8. **Não testar só isoladamente** - sempre testar integração

## 🔄 Atualizações Futuras

### Monorepo vs Multi-repo

Se o projeto crescer muito e a coordenação ficar complexa, considerar:

**Volta ao Monorepo com:**
- Turborepo
- Nx
- Lerna

**Ou manter Multi-repo com:**
- GitHub Actions matrix
- Renovate para deps
- Conventional commits + semantic-release

## 📞 Suporte

### Links Úteis

- **Backend:** https://github.com/Ecohalal/halalsphere-backend
- **Frontend:** https://github.com/Ecohalal/halalsphere-frontend
- **Docs:** https://github.com/renatoribeiro1974/HalalSphere

### Troubleshooting

- [Backend Testing Guide](../TESTING/SPRINT1-TESTING-GUIDE.md)
- [AWS Config Management](../ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md)
- [Frontend Deploy Guide](../../halalsphere-frontend/scripts/README.md)

---

**Última atualização:** 2026-01-12
**Autor:** HalalSphere Team
**Versão:** 1.0
