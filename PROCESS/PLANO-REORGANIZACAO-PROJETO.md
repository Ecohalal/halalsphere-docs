# 📋 Plano de Reorganização do Projeto HalalSphere

**Data**: 10 de Dezembro de 2025
**Objetivo**: Reorganizar a estrutura do projeto para facilitar manutenção e onboarding de novos desenvolvedores

---

## 🚨 Problemas Identificados

### 1. Schemas Prisma Duplicados
- ✅ **Correto**: `backend/prisma/schema.prisma` (schema principal usado)
- ❌ **Problema**: `prisma/schema-audits.prisma` (isolado na raiz, não integrado)

**Impacto**: Confusão sobre qual schema usar. O schema de auditorias não está sendo usado.

### 2. Documentação Desorganizada (60+ arquivos .md na raiz)
```
./ATUALIZACOES-SISTEMA-2025-12-08.md
./ANALISE-ADERENCIA-FLUXO-ATUAL.md
./CORRECAO-ACEITAR-PROPOSTA.md
./IMPLEMENTACAO-FLUXO-DOCUMENTOS.md
... (55+ arquivos similares)
```

**Impacto**: Impossível encontrar documentação relevante rapidamente.

### 3. Diretórios com Paths Malformados
```
./c:ProjetosHalalSpherebackendsrcmodulescontract/
./c:ProjetosHalalSpherebackendsrcservicese-signature/
```

**Impacto**: Paths absolutos do Windows versionados no Git. Grave problema de portabilidade.

### 4. Pasta `src/` na Raiz (Duplicada)
- `./src/components/` (raiz)
- `./backend/src/` (correto)
- `./frontend/src/` (correto)

**Impacto**: Confusão sobre onde está o código fonte real.

### 5. Scripts de Utilidade no Backend Raiz
```
backend/delete-all-processes.ts
backend/generate-valid-numbers.ts
backend/create-admin.ts
backend/assign-processes.ts
```

**Impacto**: Misturados com código da aplicação.

### 6. Arquivos de Log Versionados
```
backend/server.log (974KB!)
backend/backend.log
frontend/frontend.log
```

**Impacto**: Poluição do repositório Git.

---

## ✅ Estrutura Proposta (Organizada)

```
HalalSphere/
│
├── .github/                          # GitHub Actions, templates
│   ├── workflows/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .bmad/                            # Configurações BMAD
├── .bmad-core/                       # Agent teams
├── .claude/                          # Claude commands
│
├── docs/                             # 📚 TODA documentação técnica
│   ├── README.md                     # Índice da documentação
│   ├── 01-prd/                       # Product Requirements
│   ├── 02-technical/                 # Arquitetura técnica
│   ├── 03-ux/                        # Design e UX
│   ├── 04-implementation/            # Guias de implementação
│   │
│   ├── CHANGELOG/                    # 📝 Histórico de mudanças
│   │   ├── 2025-12-08-internacionalizacao.md
│   │   ├── 2025-12-09-correcoes-sessao.md
│   │   └── ...
│   │
│   ├── GUIDES/                       # 📖 Guias específicos
│   │   ├── GUIA-MIGRACAO-INTERNACIONAL.md
│   │   ├── GUIA-TESTES.md
│   │   ├── COMO-ATIVAR-IA.md
│   │   └── TROUBLESHOOTING-ADMIN.md
│   │
│   ├── PROCESS/                      # 🔄 Processos e fluxos
│   │   ├── PROCESSO-CERTIFICACAO-COMPLETO.md
│   │   ├── FLUXOS-TIPOS-SOLICITACAO.md
│   │   └── WIZARD-INTEGRADO-COMPLETO.md
│   │
│   ├── ARCHITECTURE/                 # 🏗️ Arquitetura
│   │   ├── BACKEND-API-REFERENCE.md
│   │   ├── MODULO-PROPOSTA-COMERCIAL.md
│   │   ├── INDUSTRIAL-CLASSIFICATION.md
│   │   └── INTERNACIONALIZACAO-SISTEMA.md
│   │
│   └── IMPLEMENTATION-HISTORY/       # 📋 Histórico de implementações
│       ├── implementacoes-sprint1.md
│       ├── implementacoes-sprint2.md
│       ├── implementacao-auditorias.md
│       └── ...
│
├── backend/                          # API Node.js + NestJS 11
│   ├── prisma/
│   │   ├── schema.prisma             # Schema ÚNICO consolidado
│   │   ├── migrations/
│   │   ├── seed.ts
│   │   └── seeds/                    # Seeds separados
│   │       ├── industrial-classification.ts
│   │       ├── international.ts
│   │       └── pricing-table.ts
│   │
│   ├── src/
│   │   ├── server.ts
│   │   ├── controllers/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── shared/
│   │   └── ...
│   │
│   ├── scripts/                      # 🛠️ Scripts de utilidade
│   │   ├── delete-all-processes.ts
│   │   ├── generate-valid-numbers.ts
│   │   ├── create-admin.ts
│   │   ├── assign-processes.ts
│   │   └── README.md                 # Como usar os scripts
│   │
│   ├── tests/                        # 🧪 Testes
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # 🎨 React + Vite + TypeScript
│   ├── src/
│   ├── public/
│   ├── tests/
│   ├── package.json
│   └── vite.config.ts
│
├── backups/                          # 💾 Backups de dados
│
├── docker-compose.yml                # 🐳 PostgreSQL + Redis
├── .gitignore                        # (atualizado)
├── README.md                         # Documentação principal
└── package.json                      # Root package (workspaces)
```

---

## 🔄 Plano de Migração (Passo a Passo)

### Fase 1: Criar Nova Estrutura de Pastas

```bash
# Criar estrutura de documentação
mkdir -p docs/CHANGELOG
mkdir -p docs/GUIDES
mkdir -p docs/PROCESS
mkdir -p docs/ARCHITECTURE
mkdir -p docs/IMPLEMENTATION-HISTORY

# Criar pasta de scripts no backend
mkdir -p backend/scripts
mkdir -p backend/tests
mkdir -p backend/prisma/seeds
```

### Fase 2: Mover Arquivos de Documentação

**CHANGELOG** (Atualizações do sistema):
```bash
mv ./ATUALIZACOES-SISTEMA-2025-12-08.md docs/CHANGELOG/
mv ./RESUMO-CORRECOES-SESSAO-2025-12-09.md docs/CHANGELOG/
mv ./CORRECOES-*.md docs/CHANGELOG/
mv ./IMPLEMENTACAO-REALIZADA-HOJ\ E.md docs/CHANGELOG/
```

**GUIDES** (Guias e tutoriais):
```bash
mv ./GUIA-MIGRACAO-INTERNACIONAL.md docs/GUIDES/
mv ./GUIA_TESTES.md docs/GUIDES/
mv ./COMO-ATIVAR-IA.md docs/GUIDES/
mv ./COMO-TESTAR-AUDITORIAS.md docs/GUIDES/
mv ./TROUBLESHOOTING-ADMIN.md docs/GUIDES/
mv ./SETUP.md docs/GUIDES/
```

**PROCESS** (Processos de negócio):
```bash
mv ./PROCESSO-CERTIFICACAO-COMPLETO-FINAL.md docs/PROCESS/
mv ./FLUXOS-TIPOS-SOLICITACAO.md docs/PROCESS/
mv ./FLUXO-COMPLETO-CERTIFICACAO-ATUALIZADO.md docs/PROCESS/
mv ./WIZARD-INTEGRADO-COMPLETO.md docs/PROCESS/
mv ./WIZARD-INTERNACIONAL-CRIADO.md docs/PROCESS/
```

**ARCHITECTURE** (Arquitetura técnica):
```bash
mv ./BACKEND-API-REFERENCE.md docs/ARCHITECTURE/
mv ./BACKEND-IMPLEMENTADO.md docs/ARCHITECTURE/
mv ./MODULO_PROPOSTA_COMERCIAL.md docs/ARCHITECTURE/
mv ./INDUSTRIAL_CLASSIFICATION_MIGRATION.md docs/ARCHITECTURE/
mv ./INTERNACIONALIZACAO-SISTEMA.md docs/ARCHITECTURE/
mv ./CONFIGURACAO-ARMAZENAMENTO.md docs/ARCHITECTURE/
```

**IMPLEMENTATION-HISTORY** (Histórico de implementações):
```bash
mv ./IMPLEMENTACOES_SPRINT*.md docs/IMPLEMENTATION-HISTORY/
mv ./IMPLEMENTACAO-*.md docs/IMPLEMENTATION-HISTORY/
mv ./SESSION_SUMMARY_*.md docs/IMPLEMENTATION-HISTORY/
```

### Fase 3: Mover Scripts do Backend

```bash
mv backend/delete-all-processes.ts backend/scripts/
mv backend/generate-valid-numbers.ts backend/scripts/
mv backend/create-admin.ts backend/scripts/
mv backend/assign-processes.ts backend/scripts/
mv backend/check-*.ts backend/scripts/
mv backend/reset-test-process.ts backend/scripts/
mv backend/set-pending.ts backend/scripts/
mv backend/add-rascunho-status.ts backend/scripts/
```

### Fase 4: Mover Seeds do Prisma

```bash
mv backend/prisma/seed-industrial-classification.ts backend/prisma/seeds/
mv backend/prisma/seed-international.ts backend/prisma/seeds/
mv backend/prisma/seed-pricing-table.ts backend/prisma/seeds/
```

### Fase 5: Consolidar Schemas Prisma

**Ação**: Mesclar `prisma/schema-audits.prisma` no `backend/prisma/schema.prisma`

```bash
# Backup do schema atual
cp backend/prisma/schema.prisma backend/prisma/schema.prisma.backup

# Depois de consolidar manualmente os schemas
rm -rf prisma/                        # Remove pasta duplicada
```

### Fase 6: Remover Diretórios Malformados

```bash
rm -rf "c:ProjetosHalalSpherebackendsrcmodulescontract"
rm -rf "c:ProjetosHalalSpherebackendsrcservicese-signature"
rm -rf src/                           # Pasta src duplicada na raiz
```

### Fase 7: Remover Arquivos de Log

```bash
rm backend/server.log
rm backend/backend.log
rm backend/nul
rm frontend/frontend.log
rm frontend/dev.log
```

### Fase 8: Atualizar .gitignore

```gitignore
# Adicionar ao .gitignore
*.log
server.log
backend.log
frontend.log
dev.log
nul

# Paths malformados (se aparecerem novamente)
c:*
```

### Fase 9: Atualizar Imports nos Arquivos

**Arquivos que referenciam scripts:**
- Buscar por `import.*from.*delete-all-processes`
- Buscar por `import.*from.*create-admin`
- Atualizar paths para `./scripts/...`

**Exemplo de busca:**
```bash
grep -r "delete-all-processes" backend/
grep -r "create-admin" backend/
grep -r "generate-valid-numbers" backend/
```

### Fase 10: Atualizar package.json Scripts

**backend/package.json:**
```json
{
  "scripts": {
    "script:delete-processes": "ts-node scripts/delete-all-processes.ts",
    "script:create-admin": "ts-node scripts/create-admin.ts",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:seed:industrial": "ts-node prisma/seeds/seed-industrial-classification.ts"
  }
}
```

### Fase 11: Criar README nos Diretórios

**docs/README.md**: Índice atualizado com nova estrutura
**backend/scripts/README.md**: Como usar cada script
**docs/CHANGELOG/README.md**: Índice cronológico de mudanças

---

## ⚠️ Checklist de Validação Pós-Migração

- [ ] Backend compila sem erros (`npm run build`)
- [ ] Frontend compila sem erros (`npm run build`)
- [ ] Prisma migrations funcionam (`npm run prisma:migrate`)
- [ ] Seeds executam corretamente (`npm run prisma:seed`)
- [ ] Testes passam (se houver)
- [ ] Nenhum import quebrado
- [ ] Git status limpo (sem paths malformados)
- [ ] .gitignore atualizado
- [ ] README.md atualizado

---

## 🎯 Benefícios Esperados

1. **Onboarding 5x mais rápido**: Novos devs encontram tudo facilmente
2. **Documentação acessível**: Tudo em `docs/` com índice
3. **Manutenção simplificada**: Código separado de scripts
4. **Git mais limpo**: Sem logs e arquivos desnecessários
5. **Portabilidade**: Sem paths absolutos do Windows

---

## 📝 Próximos Passos

1. Executar migração (seguir plano acima)
2. Criar PR com mudanças organizacionais
3. Atualizar documentação do time
4. Comunicar nova estrutura ao time
