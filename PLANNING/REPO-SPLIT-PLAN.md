# Plano de Separação: Monorepo → Multi-repo

## 📋 Visão Geral

Separar o projeto HalalSphere de um monorepo único em dois repositórios independentes:
- **halalsphere-backend** - API REST com NestJS 11 + Express + Prisma 7
- **halalsphere-frontend** - SPA React com Vite

## 🎯 Objetivos

### Vantagens da Separação
1. ✅ **Deploy Independente** - Backend e frontend podem ser deployados separadamente
2. ✅ **Equipes Independentes** - Times de backend e frontend trabalham sem conflitos
3. ✅ **CI/CD Otimizado** - Pipelines específicos para cada repo
4. ✅ **Versionamento Separado** - Backend e frontend têm suas próprias versões
5. ✅ **Permissões Granulares** - Controle de acesso por repositório
6. ✅ **Build Mais Rápido** - Cada repo faz build apenas do necessário

### Estrutura Atual
```
HalalSphere/
├── backend/          → Vai para halalsphere-backend
├── frontend/         → Vai para halalsphere-frontend
├── docs/             → Vai para ambos (ou repo separado)
└── docker-compose.yml → Vai para halalsphere-backend
```

### Estrutura Futura
```
halalsphere-backend/
├── src/
├── prisma/
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod-test.yml
└── docs/ (específicos do backend)

halalsphere-frontend/
├── src/
├── public/
├── scripts/
└── docs/ (específicos do frontend)

halalsphere-docs/ (opcional)
└── docs/ (documentação geral)
```

## 📦 Estratégia de Separação

### Opção 1: Preservar Histórico Completo (Recomendado)
Usa `git filter-repo` ou `git subtree` para manter histórico de commits.

**Vantagens:**
- ✅ Histórico completo preservado
- ✅ `git blame` funciona corretamente
- ✅ Rastreabilidade total

**Desvantagens:**
- ⚠️ Mais complexo
- ⚠️ Requer ferramenta adicional (`git-filter-repo`)

### Opção 2: Fresh Start (Mais Simples)
Criar novos repos e copiar código atual.

**Vantagens:**
- ✅ Simples e rápido
- ✅ Histórico limpo

**Desvantagens:**
- ❌ Perde histórico de commits
- ❌ Perde rastreabilidade

**Recomendação:** Opção 1 para preservar histórico

## 🔧 Plano de Execução - Opção 1 (Com Histórico)

### Fase 1: Preparação (30 min)

#### 1.1 Backup Completo
```bash
# Fazer backup do repo atual
cd /c/Projetos
cp -r HalalSphere HalalSphere-backup-$(date +%Y%m%d)

# Criar tag de referência
cd HalalSphere
git tag -a monorepo-split-point -m "Split point before separating repos"
git push origin monorepo-split-point
```

#### 1.2 Instalar Ferramentas
```bash
# Instalar git-filter-repo
# Windows (via pip)
pip install git-filter-repo

# Ou baixar executável
# https://github.com/newren/git-filter-repo/releases
```

#### 1.3 Criar Repositórios no GitHub
```bash
# Via GitHub CLI (se disponível)
gh repo create renatoribeiro1974/halalsphere-backend --private
gh repo create renatoribeiro1974/halalsphere-frontend --private

# Ou criar manualmente:
# - https://github.com/new
# - Nome: halalsphere-backend
# - Privado
# - Sem README/gitignore/license (vamos preservar os existentes)
```

### Fase 2: Separar Backend (45 min)

#### 2.1 Clonar Repo Original
```bash
cd /c/Projetos
git clone https://github.com/renatoribeiro1974/HalalSphere.git halalsphere-backend-temp
cd halalsphere-backend-temp
```

#### 2.2 Filtrar Apenas Backend
```bash
# Remover tudo exceto backend/
git filter-repo --path backend/ --path-rename backend/:

# Adicionar arquivos raiz relevantes
git filter-repo --path docker-compose.yml --path docker-compose.prod-test.yml

# Adicionar docs de backend
git filter-repo --path docs/ARCHITECTURE/ --path docs/TESTING/
```

**Alternativa usando git-subtree (mais simples):**
```bash
cd /c/Projetos
git clone https://github.com/renatoribeiro1974/HalalSphere.git halalsphere-backend
cd halalsphere-backend

# Mover backend/ para raiz
git mv backend/* .
git mv backend/.* . 2>/dev/null || true
git rm -rf backend/

# Remover frontend
git rm -rf frontend/

# Commit
git add .
git commit -m "chore: move backend to root and remove frontend"
```

#### 2.3 Ajustar Estrutura Backend
```bash
# Mover arquivos para raiz
cd /c/Projetos/halalsphere-backend

# Ajustar .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Environment
.env
.env.local
.env.*.local

# Build
dist/
build/
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Prisma
prisma/migrations/migration_lock.toml

# Uploads (local dev)
uploads/

# Logs
logs/
*.log

# Testing
coverage/

# Docker
.docker/
EOF

# Criar README.md específico do backend
cat > README.md << 'EOF'
# HalalSphere Backend

API REST do sistema HalalSphere de gestão de certificação Halal.

## 🚀 Stack Tecnológica

- **Runtime:** Node.js 20+
- **Framework:** NestJS 11 + Express
- **ORM:** Prisma 7.2
- **Database:** PostgreSQL 16 (pgvector)
- **Cache:** Redis 7
- **Storage:** AWS S3
- **Config:** AWS Parameter Store + Secrets Manager

## 📦 Quick Start

### Development
\`\`\`bash
# Install dependencies
npm install

# Setup database
docker-compose up -d postgres redis

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start dev server
npm run dev
\`\`\`

### Production (Docker)
\`\`\`bash
# Build image
docker build -t halalsphere-backend:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod-test.yml up -d
\`\`\`

## 📚 Documentação

- [AWS Config Management](docs/ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md)
- [Terraform Integration](docs/ARCHITECTURE/TERRAFORM-CONFIG-INTEGRATION.md)
- [API Reference](docs/ARCHITECTURE/BACKEND-API-REFERENCE.md)

## 🔗 Repositórios Relacionados

- [Frontend](https://github.com/renatoribeiro1974/halalsphere-frontend)
- [Documentação Geral](https://github.com/renatoribeiro1974/halalsphere-docs) (se existir)

## 📄 License

MIT
EOF

# Commit ajustes
git add .
git commit -m "chore: adjust backend repo structure"
```

#### 2.4 Conectar ao Novo Repo
```bash
# Remover origin antigo
git remote remove origin

# Adicionar novo origin
git remote add origin https://github.com/renatoribeiro1974/halalsphere-backend.git

# Push com histórico
git push -u origin develop
git push origin main  # Se tiver branch main
git push --tags
```

### Fase 3: Separar Frontend (45 min)

#### 3.1 Clonar Repo Original Novamente
```bash
cd /c/Projetos
git clone https://github.com/renatoribeiro1974/HalalSphere.git halalsphere-frontend
cd halalsphere-frontend
```

#### 3.2 Mover Frontend para Raiz
```bash
# Mover frontend/ para raiz
git mv frontend/* .
git mv frontend/.* . 2>/dev/null || true
git rm -rf frontend/

# Remover backend
git rm -rf backend/

# Remover docker-compose do backend
git rm docker-compose.yml docker-compose.prod-test.yml

# Commit
git add .
git commit -m "chore: move frontend to root and remove backend"
```

#### 3.3 Ajustar Estrutura Frontend
```bash
cd /c/Projetos/halalsphere-frontend

# Criar .gitignore específico
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*

# Build
dist/
dist-ssr/
*.local

# Environment (templates ok, valores reais no .gitignore)
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Testing
coverage/

# Vite
.vite/
EOF

# Criar README.md específico do frontend
cat > README.md << 'EOF'
# HalalSphere Frontend

Interface web do sistema HalalSphere de gestão de certificação Halal.

## 🚀 Stack Tecnológica

- **Framework:** React 19.2
- **Build Tool:** Vite 7.2
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **UI:** Tailwind CSS + Lucide Icons
- **State:** React Hooks + Context API

## 📦 Quick Start

### Development
\`\`\`bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Access: http://localhost:5173
\`\`\`

### Production Build
\`\`\`bash
# Build for staging
npm run build:staging

# Build for production
npm run build:production

# Preview production build
npm run preview
\`\`\`

## 🚢 Deploy

### Deploy to S3
\`\`\`bash
# Deploy to staging
./scripts/deploy-s3.sh staging

# Deploy to production
./scripts/deploy-s3.sh production
\`\`\`

## 📚 Documentação

- [Deploy Script](scripts/README.md)
- [Environment Variables](.env.production)

## 🔗 Repositórios Relacionados

- [Backend API](https://github.com/renatoribeiro1974/halalsphere-backend)
- [Documentação Geral](https://github.com/renatoribeiro1974/halalsphere-docs) (se existir)

## 📄 License

MIT
EOF

# Commit ajustes
git add .
git commit -m "chore: adjust frontend repo structure"
```

#### 3.4 Conectar ao Novo Repo
```bash
# Remover origin antigo
git remote remove origin

# Adicionar novo origin
git remote add origin https://github.com/renatoribeiro1974/halalsphere-frontend.git

# Push com histórico
git push -u origin develop
git push origin main  # Se tiver branch main
git push --tags
```

### Fase 4: Documentação Compartilhada (Opcional - 30 min)

#### 4.1 Criar Repo de Docs (Opcional)
```bash
# Se quiser manter docs centralizadas
cd /c/Projetos
git clone https://github.com/renatoribeiro1974/HalalSphere.git halalsphere-docs
cd halalsphere-docs

# Manter apenas docs/
git filter-repo --path docs/

# Ou manualmente
git rm -rf backend/ frontend/
git add .
git commit -m "chore: keep only documentation"

# Criar no GitHub e push
gh repo create renatoribeiro1974/halalsphere-docs --private
git remote remove origin
git remote add origin https://github.com/renatoribeiro1974/halalsphere-docs.git
git push -u origin develop
```

#### 4.2 Ou: Duplicar Docs nos Repos
```bash
# Backend: manter docs técnicos de backend
cd /c/Projetos/halalsphere-backend
git rm -rf docs/IMPLEMENTATION-HISTORY/  # Frontend-specific

# Frontend: manter docs técnicos de frontend
cd /c/Projetos/halalsphere-frontend
git rm -rf docs/ARCHITECTURE/  # Backend-specific
git rm -rf docs/TESTING/  # Backend-specific
```

### Fase 5: Atualizar Repo Original (15 min)

#### 5.1 Arquivar Monorepo Original
```bash
cd /c/Projetos/HalalSphere

# Criar branch de arquivo
git checkout -b archived-monorepo

# Adicionar README explicativo
cat > README.md << 'EOF'
# HalalSphere (Archived Monorepo)

⚠️ **Este repositório foi dividido em múltiplos repositórios.**

## 📦 Repositórios Ativos

- **Backend:** https://github.com/renatoribeiro1974/halalsphere-backend
- **Frontend:** https://github.com/renatoribeiro1974/halalsphere-frontend
- **Docs (opcional):** https://github.com/renatoribeiro1974/halalsphere-docs

## 📅 Split Point

Tag: `monorepo-split-point`
Data: [DATA DO SPLIT]

## 📚 Histórico

Este repositório contém o histórico completo do projeto quando era um monorepo.
Use os novos repositórios para desenvolvimento futuro.
EOF

git add README.md
git commit -m "docs: archive monorepo, point to new repos"
git push origin archived-monorepo

# Opcional: arquivar repo no GitHub
# Settings → General → Archive this repository
```

#### 5.2 Atualizar Branch Develop/Main
```bash
# Ou manter develop/main apontando para último commit e adicionar notice
git checkout develop
cat > MOVED.md << 'EOF'
# ⚠️ Repositório Movido

Este projeto foi dividido em repositórios separados:

- **Backend:** https://github.com/renatoribeiro1974/halalsphere-backend
- **Frontend:** https://github.com/renatoribeiro1974/halalsphere-frontend

Por favor, clone os novos repositórios.
EOF

git add MOVED.md
git commit -m "docs: add moved notice"
git push origin develop
```

## 🔄 CI/CD Adjustments

### Backend CI/CD (.github/workflows/backend-ci.yml)
```yaml
name: Backend CI/CD

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t halalsphere-backend:${{ github.sha }} .
      - name: Scan image
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image halalsphere-backend:${{ github.sha }}

  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to ECS
        run: |
          # Deploy to ECS Fargate
          aws ecs update-service --cluster halalsphere-prod --service backend --force-new-deployment
```

### Frontend CI/CD (.github/workflows/frontend-ci.yml)
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to S3 Staging
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          npm ci
          ./scripts/deploy-s3.sh staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to S3 Production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          npm ci
          ./scripts/deploy-s3.sh production
```

## 📝 Comunicação com Equipe

### Email Template
```
Assunto: [IMPORTANTE] Migração para Multi-Repo

Olá time,

Estamos migrando o projeto HalalSphere de um monorepo único para repositórios separados.

📦 Novos Repositórios:
- Backend: https://github.com/renatoribeiro1974/halalsphere-backend
- Frontend: https://github.com/renatoribeiro1974/halalsphere-frontend

🔄 Ação Necessária:
1. Clone os novos repositórios
2. Atualize seus remotes locais
3. Repositório antigo será arquivado

📅 Data de Migração: [DATA]

⏰ Timeline:
- [DATA]: Criação dos novos repos
- [DATA+1]: Período de transição
- [DATA+7]: Arquivamento do monorepo

Dúvidas? Entre em contato.
```

## ✅ Checklist de Validação

### Backend
- [ ] Repo criado no GitHub
- [ ] Código migrado com histórico
- [ ] README.md atualizado
- [ ] .gitignore ajustado
- [ ] docker-compose.yml presente
- [ ] Dockerfile presente
- [ ] CI/CD configurado
- [ ] Secrets configurados no GitHub
- [ ] Build local funciona
- [ ] Docker build funciona
- [ ] Testes passam

### Frontend
- [ ] Repo criado no GitHub
- [ ] Código migrado com histórico
- [ ] README.md atualizado
- [ ] .gitignore ajustado
- [ ] scripts/deploy-s3.sh presente
- [ ] CI/CD configurado
- [ ] Secrets configurados no GitHub
- [ ] Build local funciona
- [ ] Deploy script funciona

### Geral
- [ ] Tags migradas
- [ ] Branches importantes migrados
- [ ] Documentação atualizada
- [ ] Equipe comunicada
- [ ] Links cruzados entre repos
- [ ] Monorepo arquivado/atualizado

## 🎯 Pós-Migração

### Configurar Branch Protection
```bash
# Via GitHub UI ou CLI
gh api repos/renatoribeiro1974/halalsphere-backend/branches/main/protection \
  --method PUT \
  --input protection-rules.json

# Regras:
# - Require pull request reviews
# - Require status checks (CI)
# - Restrict who can push
```

### Atualizar Dependências Cruzadas
```javascript
// Frontend - package.json (se usar tipos do backend)
{
  "devDependencies": {
    "@halalsphere/backend-types": "git+https://github.com/renatoribeiro1974/halalsphere-backend.git#types"
  }
}
```

## 📊 Tempo Estimado

| Fase | Tempo | Responsável |
|------|-------|-------------|
| Preparação | 30 min | DevOps |
| Backend Split | 45 min | DevOps |
| Frontend Split | 45 min | DevOps |
| Docs (opcional) | 30 min | DevOps |
| Atualizar Original | 15 min | DevOps |
| CI/CD Setup | 60 min | DevOps |
| Testes | 45 min | QA |
| Comunicação | 15 min | PM |
| **Total** | **4h-5h** | - |

## 🚨 Rollback Plan

Se houver problemas:

1. **Tag de referência** já existe: `monorepo-split-point`
2. **Backup completo** em `HalalSphere-backup-YYYYMMDD/`
3. **Repos novos** podem ser deletados
4. **Voltar ao monorepo** original

```bash
# Restaurar monorepo
cd /c/Projetos
rm -rf HalalSphere
cp -r HalalSphere-backup-YYYYMMDD HalalSphere
cd HalalSphere
git checkout develop
```

## 📚 Referências

- [Git Filter Repo](https://github.com/newren/git-filter-repo)
- [GitHub - Splitting a Repository](https://docs.github.com/en/get-started/using-git/splitting-a-subfolder-out-into-a-new-repository)
- [Monorepo vs Multi-repo](https://www.atlassian.com/git/tutorials/monorepos)
