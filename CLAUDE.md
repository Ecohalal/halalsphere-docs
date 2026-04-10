# HalalSphere Docs - Regras Obrigatorias

## ANTES DE QUALQUER ALTERACAO NO PROJETO

**OBRIGATORIO**: Ler `GUIDES/LICOES-APRENDIDAS.md` antes de iniciar qualquer tarefa que envolva backend ou frontend.
Sao 28+ erros documentados que ja aconteceram em producao. Ignorar este arquivo resulta em bugs recorrentes.

## Este Repositorio
- Documentacao do projeto HalalSphere (PRD, arquitetura, planning, guides)
- GitHub Pages para publicacao
- **AVISO**: Muitos docs estao DESATUALIZADOS (ainda referenciam Fastify e arquitetura legada Process/Request)
- Sempre validar contra o codigo real dos repos backend/frontend

## Repos Relacionados
- **Backend**: `c:\Projetos\halalsphere-backend` (NestJS 11 + Prisma 7 + PostgreSQL 16)
- **Frontend**: `c:\Projetos\halalsphere-frontend` (React 19 + Vite 7 + TypeScript)

## Regras Criticas (resumo de LICOES-APRENDIDAS.md)

### Backend - Rotas/Controllers
- Rotas especificas ANTES de parametrizadas (`@Get('stats')` antes de `@Get(':id')`)
- **Novo controller = regenerar API Gateway** no mesmo commit: `npm run generate:swagger` + `node scripts/generate-api-gateway.js`

### Backend - Migrations
- Verificar `docker-entrypoint.sh`, `prisma.config.ts` no Dockerfile
- Validar em producao com query SQL apos deploy

### Frontend - Services
- **SEMPRE** usar `api` de `src/lib/api.ts` — NUNCA `import axios from 'axios'` direto

### Deploy
- Branch de producao: `release` (fluxo: develop -> staging -> release)
- NUNCA push sem Renato sinalizar explicitamente
- NUNCA mencionar Supabase — projeto usa PostgreSQL direto na AWS
