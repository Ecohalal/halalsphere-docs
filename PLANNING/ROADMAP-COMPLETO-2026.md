# Roadmap Completo: HalalSphere 2026

> **DOCUMENTO HISTORICO** - Planejamento de 12/01/2026. Desde entao:
> - **Fase I (Deploy AWS)**: CONCLUIDA - MVP em producao desde 23/01/2026
> - **Fase II (Migracao NestJS)**: CONCLUIDA - Backend 100% NestJS 11 + Express
> - **CI/CD**: Operacional via AWS CodePipeline + CodeBuild
> - Consulte o codigo real nos repos para o estado atual.

**Projeto**: HalalSphere - Plataforma de Certificacao Halal
**Data**: 2026-01-12
**Versao**: 1.0 (HISTORICO)
**Duracao Total Estimada**: 18-24 semanas

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Fase I: Deploy AWS (Fastify)](#fase-i-deploy-aws-fastify)
3. [Fase II: Migração NestJS](#fase-ii-migração-nestjs)
4. [Timeline Consolidado](#timeline-consolidado)
5. [Recursos e Equipe](#recursos-e-equipe)
6. [Riscos e Mitigações](#riscos-e-mitigações)

---

## 🎯 Visão Geral

### Objetivos Estratégicos

**1. Modernizar Infraestrutura (Fase I - 2-3 semanas)**
- ✅ Deploy em AWS com arquitetura serverless/containerizada
- ✅ Frontend estático em S3 + CloudFront (CDN global)
- ✅ Backend containerizado no ECS Fargate com Spot Instances (economia 60%)
- ✅ API Gateway gerenciando todos os endpoints
- ✅ Auto-scaling, observabilidade e resiliência

**2. Modernizar Stack Backend (Fase II - 8-12 semanas)**
- ✅ Migração gradual de Fastify → NestJS
- ✅ Manter performance com Fastify adapter
- ✅ Melhorar DX (Developer Experience)
- ✅ Padrões de mercado e onboarding facilitado

### Estado Atual vs. Estado Futuro

| Aspecto | Atual | Após Fase I | Após Fase II |
|---------|-------|-------------|--------------|
| **Frontend** | Local (Vite dev) | S3 + CloudFront | S3 + CloudFront |
| **Backend Framework** | Fastify (local) | Fastify (ECS) | NestJS (ECS) |
| **API Exposure** | Direto | API Gateway | API Gateway |
| **Database** | Docker local | RDS Multi-AZ | RDS Multi-AZ |
| **Cache** | Docker local | ElastiCache | ElastiCache |
| **Storage** | File system | S3 | S3 |
| **CI/CD** | Manual | GitHub Actions | GitHub Actions |
| **Monitoring** | Nenhum | CloudWatch | CloudWatch |
| **Auto-scaling** | Não | Sim | Sim |
| **Custo mensal** | ~$0 | ~$201 | ~$201 |

---

## 🚀 FASE I: Deploy AWS (Fastify)

**Duração**: 2-3 semanas
**Objetivo**: Sistema rodando em produção na AWS com arquitetura moderna
**Documento Detalhado**: [AWS-ECS-FARGATE-SPOT.md](./AWS-ECS-FARGATE-SPOT.md)

### Sprint 1: Containerização (Semana 1)

#### 1.1. Backend - Dockerfile (2 dias)

**Responsável**: Dev Backend
**Entregáveis**:
- [ ] `backend/Dockerfile` (multi-stage build)
- [ ] `backend/docker-entrypoint.sh`
- [ ] `backend/.dockerignore`
- [ ] `docker-compose.prod-test.yml`
- [ ] Image < 300MB
- [ ] Security scan passando (Trivy/Snyk)

**Tarefas**:
```bash
# 1. Criar Dockerfile multi-stage
cd backend
touch Dockerfile docker-entrypoint.sh .dockerignore

# 2. Testar build local
docker build -t halalsphere-backend:local .

# 3. Testar execução
docker run -p 3333:3333 halalsphere-backend:local

# 4. Security scan
trivy image halalsphere-backend:local
```

**Critérios de Aceite**:
- Image building sem erros
- Health check respondendo em `/health`
- Size < 300MB
- No vulnerabilities HIGH/CRITICAL

---

#### 1.2. Frontend - Build Otimizado (2 dias)

**Responsável**: Dev Frontend
**Entregáveis**:
- [ ] Vite config otimizado (code splitting)
- [ ] Build production < 2MB (gzipped)
- [ ] Environment variables configuradas
- [ ] Deploy script para S3

**Tarefas**:
```bash
# 1. Otimizar vite.config.ts
cd frontend
npm install rollup-plugin-visualizer

# 2. Configurar ambientes
touch .env.production .env.staging

# 3. Build e análise
npm run build:production
# Verificar dist/stats.html

# 4. Testar preview
npm run preview
```

**Critérios de Aceite**:
- Build production < 2MB (gzipped)
- Code splitting funcionando (3+ chunks)
- No console.logs em production
- Assets com hash no nome

---

#### 1.3. Graceful Shutdown + Health Checks (1 dia)

**Responsável**: Dev Backend
**Entregáveis**:
- [ ] SIGTERM handler implementado
- [ ] Health checks (liveness + readiness)
- [ ] Trust proxy configurado

**Tarefas**:
```typescript
// backend/src/server.ts
// 1. Adicionar graceful shutdown
process.on('SIGTERM', gracefulShutdown);

// 2. Criar health check routes
// /health/live  - liveness
// /health/ready - readiness

// 3. Configurar trust proxy
fastify = Fastify({ trustProxy: true });
```

**Critérios de Aceite**:
- `docker stop` drena conexões (30s timeout)
- `/health/ready` verifica DB + Redis
- `/health/live` sempre responde 200 (se app running)

---

#### 1.4. Migração Uploads → S3 (2 dias)

**Responsável**: Dev Backend
**Entregáveis**:
- [ ] Storage service usando S3 em produção
- [ ] Pre-signed URLs implementadas
- [ ] Upload/download testados

**Tarefas**:
```typescript
// 1. Ajustar StorageManagerService
// Forçar S3 em production

// 2. Implementar pre-signed URLs
async getFileUrl(key: string, expiresIn = 3600) {
  return getSignedUrl(s3Client, GetObjectCommand, { expiresIn });
}

// 3. Atualizar controllers
// Download retorna pre-signed URL
```

**Critérios de Aceite**:
- Upload para S3 funcionando
- Download via pre-signed URL
- Arquivos encrypted at rest (AES256)

---

### Sprint 2: Swagger + Infraestrutura (Semana 2)

#### 2.1. Gerar Swagger para API Gateway (1 dia)

**Responsável**: Dev Backend
**Entregáveis**:
- [ ] Script `generate-api-gateway-swagger.ts`
- [ ] `swagger-api-gateway.json` gerado
- [ ] VPC Link integration configurada
- [ ] CORS + Rate limiting

**Tarefas**:
```bash
# 1. Criar script de geração
cd backend
touch scripts/generate-api-gateway-swagger.ts

# 2. Adicionar ao package.json
npm pkg set scripts.swagger:generate="tsx scripts/generate-api-gateway-swagger.ts"

# 3. Gerar Swagger
npm run swagger:generate

# 4. Validar
npm install -g swagger-cli
swagger-cli validate swagger-api-gateway.json
```

**Critérios de Aceite**:
- 111 endpoints incluídos
- VPC Link placeholders `${vpc_link_id}`
- Request validators configurados
- CORS OPTIONS para todos os paths

---

#### 2.2. Terraform - Setup Inicial (2 dias)

**Responsável**: DevOps/Backend Lead
**Entregáveis**:
- [ ] Estrutura de módulos Terraform
- [ ] Backend S3 para state
- [ ] VPC com subnets (public, private, database)
- [ ] NAT Gateways

**Tarefas**:
```bash
# 1. Criar estrutura
mkdir -p terraform/{modules,environments/prod}
cd terraform

# 2. Criar backend config
cat > backend.tf <<EOF
terraform {
  backend "s3" {
    bucket = "halalsphere-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}
EOF

# 3. Criar módulo VPC
mkdir -p modules/vpc
# ... (ver detalhes em AWS-ECS-FARGATE-SPOT.md)

# 4. Init e plan
terraform init
terraform plan
```

**Critérios de Aceite**:
- VPC criada (10.0.0.0/16)
- 2 subnets públicas (ALB/NAT)
- 2 subnets privadas (ECS)
- 2 subnets database (RDS/Redis)
- Internet Gateway + NAT Gateways

---

#### 2.3. Terraform - S3 + CloudFront (1 dia)

**Responsável**: DevOps
**Entregáveis**:
- [ ] S3 bucket para frontend
- [ ] CloudFront distribution
- [ ] ACM certificate
- [ ] Route53 record

**Tarefas**:
```bash
# 1. Criar módulo s3-frontend
cd terraform/modules
mkdir s3-frontend

# 2. Configurar CloudFront
# - Origin Access Identity
# - Cache behaviors (HTML vs assets)
# - Custom error responses (SPA routing)
# - SSL certificate

# 3. Apply
cd ../../environments/prod
terraform apply
```

**Critérios de Aceite**:
- S3 não público (acesso só via CloudFront)
- CloudFront com HTTPS
- Cache: HTML (no-cache), Assets (1 year)
- SPA routing (404 → index.html)

---

#### 2.4. Terraform - RDS + ElastiCache (2 dias)

**Responsável**: DevOps
**Entregáveis**:
- [ ] RDS PostgreSQL Multi-AZ
- [ ] ElastiCache Redis
- [ ] Security groups
- [ ] Secrets Manager

**Tarefas**:
```bash
# 1. Criar módulos
mkdir -p modules/{rds,elasticache,secrets}

# 2. RDS config
# - db.t4g.small
# - Multi-AZ (production)
# - Automated backups (7 days)
# - Encryption at rest

# 3. ElastiCache Redis
# - cache.t4g.micro
# - Single node (dev/staging)
# - Cluster mode (production opcional)

# 4. Secrets Manager
# - DB credentials
# - JWT secret
# - API keys
```

**Critérios de Aceite**:
- RDS acessível só de ECS tasks
- Redis acessível só de ECS tasks
- Backups automáticos configurados
- Secrets rotacionando (opcional)

---

### Sprint 3: ECS + API Gateway (Semana 3)

#### 3.1. Terraform - API Gateway + VPC Link (2 dias)

**Responsável**: DevOps
**Entregáveis**:
- [ ] API Gateway REST API
- [ ] VPC Link
- [ ] NLB interno
- [ ] Custom domain

**Tarefas**:
```bash
# 1. Criar módulos
mkdir -p modules/{api-gateway,nlb}

# 2. NLB interno
# - Internal only
# - Target group (TCP 3333)
# - Health check /health/ready

# 3. VPC Link
# - Conecta API Gateway → NLB

# 4. API Gateway
# - Import swagger-api-gateway.json
# - Deploy stage (prod)
# - Usage plan (rate limiting)
# - Custom domain (api.halalsphere.com)
```

**Critérios de Aceite**:
- NLB interno (não exposto à internet)
- VPC Link conectado
- API Gateway importando Swagger
- Custom domain com HTTPS

---

#### 3.2. Terraform - ECS Fargate + Spot (3 dias)

**Responsável**: DevOps/Backend
**Entregáveis**:
- [ ] ECS Cluster
- [ ] Task Definition
- [ ] ECS Service (Spot + On-Demand)
- [ ] Auto-scaling
- [ ] IAM roles

**Tarefas**:
```bash
# 1. Criar módulo ECS
mkdir modules/ecs

# 2. Task Definition
# - 0.5 vCPU, 1GB RAM
# - Secrets via Secrets Manager
# - CloudWatch Logs
# - Health check container

# 3. ECS Service
# - Desired: 2
# - Min: 1, Max: 10
# - 80% Spot, 20% On-Demand
# - Load balancer: NLB

# 4. Auto-scaling
# - CPU > 70% → scale out
# - Memory > 80% → scale out

# 5. IAM Roles
# - Task role: S3, Secrets Manager
# - Execution role: ECR, CloudWatch
```

**Critérios de Aceite**:
- 2 tasks rodando (1 Spot, 1 On-Demand)
- Health checks passando
- Tasks recebendo tráfego via NLB
- Auto-scaling testado

---

#### 3.3. ECR + First Deploy (1 dia)

**Responsável**: DevOps
**Entregáveis**:
- [ ] ECR repository criado
- [ ] First image pushed
- [ ] ECS tasks atualizados

**Tarefas**:
```bash
# 1. Criar ECR repo
aws ecr create-repository --repository-name halalsphere-backend

# 2. Build e push
cd backend
docker build -t halalsphere-backend .
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag halalsphere-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend:latest

# 3. Update ECS service
aws ecs update-service --cluster halalsphere-cluster-prod --service halalsphere-backend-service --force-new-deployment
```

**Critérios de Aceite**:
- Image no ECR
- ECS tasks rodando nova image
- API Gateway → VPC Link → NLB → ECS funcionando

---

#### 3.4. Frontend Deploy (1 dia)

**Responsável**: Frontend
**Entregáveis**:
- [ ] Build production
- [ ] Sync para S3
- [ ] CloudFront invalidation

**Tarefas**:
```bash
# 1. Build
cd frontend
npm run build:production

# 2. Sync to S3
aws s3 sync dist/ s3://halalsphere-frontend-prod/ \
  --delete \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable"

aws s3 sync dist/ s3://halalsphere-frontend-prod/ \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate"

# 3. Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

**Critérios de Aceite**:
- Frontend acessível via CloudFront
- Assets servidos de edge locations
- API calls indo para API Gateway

---

#### 3.5. CI/CD Pipelines (2 dias)

**Responsável**: DevOps
**Entregáveis**:
- [ ] GitHub Actions - Backend
- [ ] GitHub Actions - Frontend
- [ ] Secrets configurados

**Tarefas**:
```bash
# 1. Criar workflows
mkdir -p .github/workflows
touch .github/workflows/{deploy-backend.yml,deploy-frontend.yml}

# 2. Configurar secrets no GitHub
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - CLOUDFRONT_DISTRIBUTION_ID

# 3. Testar pipelines
# - Push to main → auto deploy
```

**Critérios de Aceite**:
- Push to main deploya backend automaticamente
- Push to main deploya frontend automaticamente
- Rollback automático se health check falhar

---

#### 3.6. Monitoramento + Alarms (1 dia)

**Responsável**: DevOps
**Entregáveis**:
- [ ] CloudWatch Dashboard
- [ ] Alarms (CPU, Memory, 5XX)
- [ ] SNS topic para notificações

**Tarefas**:
```bash
# 1. Criar módulo cloudwatch
mkdir modules/cloudwatch

# 2. Dashboard com:
# - ECS CPU/Memory
# - API Gateway requests/latency/errors
# - CloudFront requests/errors
# - RDS CPU/connections

# 3. Alarms:
# - ECS CPU > 80%
# - ECS tasks < 1
# - API Gateway 5XX > 10
# - RDS CPU > 80%

# 4. SNS topic
# - Email notifications
```

**Critérios de Aceite**:
- Dashboard visualizando métricas
- Alarms testados
- Notificações chegando por email

---

### Checklist Fase I - Completo

#### Pré-Deploy
- [ ] Backend Dockerfile criado e testado
- [ ] Frontend build otimizado (< 2MB gzipped)
- [ ] Graceful shutdown implementado
- [ ] Uploads migrados para S3
- [ ] Swagger para API Gateway gerado
- [ ] Terraform modules criados
- [ ] Secrets Manager preenchido
- [ ] CI/CD pipelines configurados

#### Deploy
- [ ] Terraform apply executado com sucesso
- [ ] VPC e subnets criadas
- [ ] RDS PostgreSQL Multi-AZ funcionando
- [ ] ElastiCache Redis funcionando
- [ ] S3 buckets criados (frontend + uploads)
- [ ] CloudFront distribuindo frontend
- [ ] ECR images pushed
- [ ] ECS tasks rodando (Spot + On-Demand)
- [ ] NLB roteando tráfego internamente
- [ ] API Gateway criado e importando Swagger
- [ ] VPC Link conectado
- [ ] Route53 DNS configurado

#### Pós-Deploy
- [ ] Monitoramento CloudWatch configurado
- [ ] Alarms testados e notificando
- [ ] Logs centralizados funcionando
- [ ] Performance testado (load test com k6)
- [ ] Spot interruptions simuladas e testadas
- [ ] Backups automáticos configurados (RDS)
- [ ] Disaster recovery plan documentado
- [ ] Runbook criado para equipe de operações

#### Validação Final
- [ ] Frontend acessível via https://halalsphere.com
- [ ] API acessível via https://api.halalsphere.com
- [ ] Login funcionando
- [ ] Upload de documentos funcionando
- [ ] Fluxo completo de certificação testado
- [ ] Performance aceitável (P95 < 500ms)
- [ ] Custos dentro do esperado (~$201/mês)

---

## 🔄 FASE II: Migração NestJS

**Duração**: 8-12 semanas
**Objetivo**: Modernizar stack backend mantendo sistema estável em produção
**Documento Detalhado**: [MIGRATION-NESTJS.md](./MIGRATION-NESTJS.md)

### Estratégia: Strangler Pattern

```
Semana 1-2:   Foundation (NestJS base + Auth)
Semana 3-4:   Módulos simples (3-4 módulos)
Semana 5-7:   Módulos complexos (process, proposal, contract)
Semana 8-9:   Módulos restantes + serviços
Semana 10:    Testing e QA
Semana 11-12: Deploy paralelo e cutover
```

---

### Sprint 4: Foundation NestJS (Semanas 1-2)

#### 4.1. Setup Projeto NestJS (2 dias)

**Responsável**: Backend Lead
**Entregáveis**:
- [ ] Projeto NestJS criado com Fastify adapter
- [ ] Prisma configurado
- [ ] Core modules (config, database, common)

**Tarefas**:
```bash
# 1. Criar projeto NestJS
npm i -g @nestjs/cli
nest new halalsphere-nest --package-manager npm

# 2. Instalar Fastify adapter
cd halalsphere-nest
npm install @nestjs/platform-fastify

# 3. Instalar dependências core
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport-jwt
npm install @nestjs/swagger swagger-ui-express
npm install @prisma/client prisma
npm install zod class-validator class-transformer

# 4. Copiar schema.prisma
cp ../backend/prisma/schema.prisma ./prisma/

# 5. Gerar Prisma Client
npx prisma generate
```

**Critérios de Aceite**:
- NestJS rodando com Fastify adapter
- Prisma conectando ao banco
- Health check endpoint funcionando
- Swagger UI acessível

---

#### 4.2. Core Infrastructure (3 dias)

**Responsável**: Backend Team
**Entregáveis**:
- [ ] Guards (JWT, Roles)
- [ ] Decorators (@CurrentUser, @Roles, @Public)
- [ ] Interceptors (Logging, Transform)
- [ ] Filters (Exception)
- [ ] Pipes (Zod validation)

**Tarefas**:
```typescript
// 1. JWT Auth Guard
// common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Skip auth if @Public() decorator
}

// 2. Roles Guard
// common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  // Check user.role against @Roles() decorator
}

// 3. Decorators
// @CurrentUser() - extract user from request
// @Roles(...roles) - define required roles
// @Public() - skip authentication

// 4. Exception Filter
// Standardize error responses

// 5. Logging Interceptor
// Log all requests/responses
```

**Critérios de Aceite**:
- Guards aplicados globalmente
- Decorators funcionando
- Logs estruturados
- Erros padronizados

---

#### 4.3. Auth Module (3 dias)

**Responsável**: Backend Dev 1
**Entregáveis**:
- [ ] AuthModule completo (8 endpoints)
- [ ] JWT Strategy
- [ ] Login, Register, Verify Email, Password Reset
- [ ] DTOs com validação Zod

**Tarefas**:
```bash
# 1. Gerar módulo
nest g module modules/auth
nest g controller modules/auth
nest g service modules/auth

# 2. Implementar endpoints (8):
# - POST /auth/login
# - POST /auth/register
# - GET  /auth/me
# - GET  /auth/verify-email
# - POST /auth/resend-verification
# - POST /auth/forgot-password
# - POST /auth/reset-password
# - POST /auth/change-password

# 3. JWT Strategy
# - Validate token
# - Fetch user from DB
# - Inject into request

# 4. DTOs com Zod
# - LoginDto, RegisterDto, etc.
```

**Critérios de Aceite**:
- 8 endpoints funcionando
- JWT generation/validation
- Email verification flow
- Password reset flow
- Testes unitários (>80% coverage)

---

#### 4.4. Health Module (1 dia)

**Responsável**: Backend Dev 2
**Entregáveis**:
- [ ] HealthModule com liveness + readiness
- [ ] Database check
- [ ] Redis check (opcional)

**Tarefas**:
```typescript
// modules/health/health.controller.ts
@Controller('health')
export class HealthController {
  @Public()
  @Get('live')
  liveness() {
    return { status: 'ok' };
  }

  @Public()
  @Get('ready')
  async readiness() {
    // Check DB, Redis, etc.
    return { status: 'ready', checks: {...} };
  }
}
```

**Critérios de Aceite**:
- `/health/live` sempre 200
- `/health/ready` verifica dependências
- Usado em ECS health checks

---

### Sprint 5-7: Migração de Módulos (Semanas 3-7)

**Ordem de Migração** (do mais simples ao mais complexo):

| Semana | Módulos | Endpoints | Complexidade |
|--------|---------|-----------|--------------|
| 3 | industrial-classification, comment | 10 | Baixa |
| 4 | document-request, users/admin | 13 | Média |
| 5 | **process** (core) | 7 | Alta |
| 6 | **proposal** | 16 | Alta |
| 7 | **contract**, audit-schedule | 18 | Alta |

#### Template de Migração por Módulo

Para cada módulo, seguir:

**1. Gerar estrutura NestJS** (30min)
```bash
nest g module modules/[module-name]
nest g controller modules/[module-name]
nest g service modules/[module-name]
```

**2. Criar DTOs** (1-2h)
```typescript
// dto/create-[entity].dto.ts
export const CreateEntitySchema = z.object({
  // ... validation rules
});
export type CreateEntityDto = z.infer<typeof CreateEntitySchema>;
```

**3. Migrar Service** (2-4h)
```typescript
@Injectable()
export class EntityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEntityDto) {
    // Lógica de negócio mantém igual
    // Apenas adaptar injeção de dependências
  }
}
```

**4. Migrar Controller** (2-3h)
```typescript
@Controller('api/[module]')
@ApiTags('[Module]')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntityController {
  @Post()
  @Roles(UserRole.analista)
  @ApiOperation({ summary: 'Create entity' })
  create(@Body() dto: CreateEntityDto, @CurrentUser() user: User) {
    return this.service.create(dto, user.id);
  }
}
```

**5. Testes** (2-3h)
```typescript
describe('EntityService', () => {
  let service: EntityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EntityService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get(EntityService);
  });

  it('should create entity', async () => {
    // Test implementation
  });
});
```

**Critérios de Aceite por Módulo**:
- [ ] Todos os endpoints migrados
- [ ] Business logic idêntica ao Fastify
- [ ] DTOs validando requests
- [ ] Swagger documentado
- [ ] Testes unitários (>80% coverage)
- [ ] Testes E2E dos principais fluxos

---

### Sprint 8: Serviços Compartilhados (Semana 8)

#### 8.1. Email Service (1 dia)

**Responsável**: Backend Dev
**Entregáveis**:
- [ ] EmailModule com Nodemailer
- [ ] Templates Handlebars

---

#### 8.2. Storage Service (1 dia)

**Responsável**: Backend Dev
**Entregáveis**:
- [ ] StorageModule com S3 + Local providers
- [ ] Pre-signed URLs

---

#### 8.3. E-Signature Service (1 dia)

**Responsável**: Backend Dev
**Entregáveis**:
- [ ] E-SignatureModule
- [ ] ClickSign + D4Sign providers

---

#### 8.4. PDF Service (1 dia)

**Responsável**: Backend Dev
**Entregáveis**:
- [ ] PDFModule com Puppeteer

---

#### 8.5. AI Service (1 dia)

**Responsável**: Backend Dev
**Entregáveis**:
- [ ] AIModule com Anthropic Claude

---

### Sprint 9: WebSocket + Real-time (Semana 9)

#### 9.1. Notifications Gateway (2 dias)

**Responsável**: Backend Dev
**Entregáveis**:
- [ ] NotificationsGateway
- [ ] Real-time process updates
- [ ] Live dashboard

**Tarefas**:
```bash
# 1. Instalar dependências
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

# 2. Criar gateway
nest g gateway modules/notifications/notifications

# 3. Implementar eventos
# - process:status-changed
# - document:uploaded
# - comment:created
```

**Critérios de Aceite**:
- WebSocket conectando
- Notificações em tempo real
- Reconexão automática

---

### Sprint 10: Testing & Quality (Semana 10)

#### 10.1. Testes E2E (3 dias)

**Responsável**: QA + Backend Team
**Entregáveis**:
- [ ] Testes E2E dos principais fluxos
- [ ] Coverage > 80%

**Fluxos a testar**:
1. **Registro e Login**
   - Empresa se registra
   - Verifica email
   - Faz login

2. **Processo de Certificação Completo**
   - Empresa cria solicitação
   - Upload de documentos
   - Analista é atribuído
   - Análise de documentos
   - Proposta comercial
   - Contrato
   - Auditoria
   - Certificado emitido

3. **Gestão de Usuários**
   - Admin cria usuários
   - Gestor atribui processos
   - Analista visualiza dashboard

---

#### 10.2. Performance Testing (2 dias)

**Responsável**: DevOps + Backend
**Entregáveis**:
- [ ] Load tests com k6
- [ ] Performance comparado com Fastify

**Tarefas**:
```bash
# 1. Criar scripts k6
# test/load/login.js
# test/load/process-flow.js

# 2. Executar testes
k6 run --vus 100 --duration 5m test/load/login.js

# 3. Comparar resultados
# NestJS deve ter performance similar ao Fastify (±10%)
```

**Critérios de Aceite**:
- P95 latency < 500ms
- 0 errors em 1000 req/s
- Memory usage estável

---

### Sprint 11-12: Deploy Paralelo & Cutover (Semanas 11-12)

#### 11.1. Deploy Paralelo (3 dias)

**Responsável**: DevOps
**Entregáveis**:
- [ ] NestJS deployado em staging
- [ ] Testes em staging completos

**Tarefas**:
```bash
# 1. Criar ECR repo para NestJS
aws ecr create-repository --repository-name halalsphere-nestjs

# 2. Build e push
docker build -t halalsphere-nestjs .
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-nestjs:latest

# 3. Deploy em staging
terraform workspace select staging
terraform apply

# 4. Rodar smoke tests
npm run test:e2e:staging
```

**Critérios de Aceite**:
- NestJS rodando em staging
- Todos os endpoints funcionando
- Performance aceitável

---

#### 11.2. Canary Deployment (3 dias)

**Responsável**: DevOps
**Entregáveis**:
- [ ] 10% tráfego → NestJS
- [ ] Monitoramento 24h
- [ ] Rollback plan testado

**Estratégia**:
```
Dia 1: 10% tráfego → NestJS (monitor errors)
Dia 2: 25% tráfego → NestJS (monitor performance)
Dia 3: 50% tráfego → NestJS (monitor everything)
```

**Critérios de Aceite**:
- Error rate < 0.1%
- Latency similar ao Fastify
- No memory leaks

---

#### 11.3. Full Cutover (2 dias)

**Responsável**: DevOps + Backend Team
**Entregáveis**:
- [ ] 100% tráfego → NestJS
- [ ] Fastify desligado após 24h estável
- [ ] Rollback plan documentado

**Tarefas**:
```bash
# Dia 1: 100% tráfego para NestJS
# - Update API Gateway VPC Link target
# - Monitor errors/performance

# Dia 2 (se estável): Desligar Fastify
# - Scale down Fastify ECS service to 0
# - Keep infrastructure for rollback (72h)

# Dia 5: Cleanup
# - Delete Fastify resources
# - Update documentation
```

**Critérios de Aceite**:
- Sistema estável por 48h
- Zero critical bugs
- Performance dentro do esperado

---

#### 11.4. Retrospectiva & Documentação (2 dias)

**Responsável**: Todos
**Entregáveis**:
- [ ] Retrospectiva da migração
- [ ] Documentação atualizada
- [ ] Lessons learned

**Tarefas**:
1. Reunião de retrospectiva
2. Documentar decisões técnicas
3. Atualizar README e docs
4. Criar guia de onboarding para novos devs

---

## 📅 Timeline Consolidado

### Visão Geral (18-24 semanas)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FASE I: AWS DEPLOY                          │
│                         (3 semanas)                                 │
├─────────────────────────────────────────────────────────────────────┤
│ Semana 1  │ Containerização + Otimizações                          │
│ Semana 2  │ Swagger + Infraestrutura (Terraform)                   │
│ Semana 3  │ ECS + API Gateway + Deploy                             │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      FASE II: MIGRAÇÃO NESTJS                       │
│                         (8-12 semanas)                              │
├─────────────────────────────────────────────────────────────────────┤
│ Semanas 1-2   │ Foundation (NestJS base + Auth)                    │
│ Semanas 3-4   │ Módulos simples (4 módulos)                        │
│ Semanas 5-7   │ Módulos complexos (process, proposal, contract)    │
│ Semanas 8-9   │ Serviços compartilhados + WebSocket                │
│ Semana 10     │ Testing & QA                                        │
│ Semanas 11-12 │ Deploy paralelo e cutover                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         BUFFER & POLISH                             │
│                         (2-4 semanas)                               │
├─────────────────────────────────────────────────────────────────────┤
│ - Ajustes finos                                                     │
│ - Performance tuning                                                │
│ - Documentação                                                      │
│ - Training da equipe                                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Cronograma Detalhado

| Semana | Sprint | Foco Principal | Entregáveis Chave |
|--------|--------|----------------|-------------------|
| **1** | Sprint 1 | Containerização | Dockerfile, Build otimizado, Graceful shutdown, S3 migration |
| **2** | Sprint 2 | Infraestrutura Base | Swagger API Gateway, Terraform (VPC, RDS, Redis, S3, CloudFront) |
| **3** | Sprint 3 | Deploy AWS | API Gateway, ECS Fargate Spot, CI/CD, Monitoring |
| **4-5** | Sprint 4 | NestJS Foundation | Setup, Core modules, Auth module |
| **6-7** | Sprint 5 | Módulos Simples | Industrial-classification, Comment, Document-request, Admin |
| **8-9** | Sprint 6 | Módulo Process (Core) | Process service + controller + DTOs + Tests |
| **10-11** | Sprint 7 | Módulos Complexos | Proposal (16 endpoints), Contract (10 endpoints) |
| **12-13** | Sprint 8 | Serviços Compartilhados | Email, Storage, E-Signature, PDF, AI |
| **14** | Sprint 9 | WebSocket | Real-time notifications |
| **15** | Sprint 10 | Testing & QA | E2E tests, Performance tests, Coverage >80% |
| **16-17** | Sprint 11 | Deploy Paralelo | Staging deploy, Canary (10%→50%→100%) |
| **18** | Sprint 12 | Cutover Final | 100% NestJS, Fastify shutdown, Cleanup |

---

## 👥 Recursos e Equipe

### Equipe Mínima Recomendada

| Role | Quantidade | Dedicação | Responsabilidades |
|------|------------|-----------|-------------------|
| **Backend Lead** | 1 | Full-time | Arquitetura, code review, decisões técnicas |
| **Backend Devs** | 2-3 | Full-time | Desenvolvimento, testes, migração módulos |
| **DevOps Engineer** | 1 | Full-time | Terraform, CI/CD, monitoring, deploy |
| **Frontend Dev** | 1 | Part-time (30%) | Otimização build, deploy S3 |
| **QA Engineer** | 1 | Part-time (50%) | Testes E2E, validação fluxos |
| **Product Owner** | 1 | Part-time (20%) | Priorização, aceite |

**Total**: ~5 pessoas full-time equivalente

### Alocação por Fase

**Fase I (AWS Deploy - 3 semanas)**:
- Backend Lead: 100%
- Backend Dev: 1-2 pessoas, 100%
- DevOps: 100%
- Frontend Dev: 30%
- QA: 20%

**Fase II (NestJS - 12 semanas)**:
- Backend Lead: 100%
- Backend Devs: 2-3 pessoas, 100%
- DevOps: 40%
- QA: 60%

---

## ⚠️ Riscos e Mitigações

### Fase I: AWS Deploy

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Custos AWS acima do esperado** | Média | Médio | Monitorar AWS Budget Alerts; otimizar recursos após 1 mês |
| **Performance degradation** | Baixa | Alto | Load testing antes de production; manter Fastify adapter |
| **Spot interruptions frequentes** | Baixa | Médio | Mix 80% Spot + 20% On-Demand; graceful shutdown implementado |
| **Migração S3 com downtime** | Baixa | Alto | Migrar arquivos offline; dupla escrita (local + S3) temporariamente |
| **API Gateway latency** | Média | Médio | VPC Link para reduzir latência; cache em Redis |
| **Terraform state corruption** | Baixa | Crítico | State no S3 com versioning + DynamoDB lock; backups diários |

### Fase II: NestJS Migration

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Breaking changes em APIs** | Baixa | Crítico | Contract testing; não mudar payloads; versioning se necessário |
| **Performance inferior ao Fastify** | Baixa | Alto | Usar Fastify adapter; performance testing contínuo |
| **Bugs em produção** | Média | Alto | Canary deployment; rollback automático; monitoring 24/7 |
| **Atraso no cronograma** | Alta | Médio | Buffer de 2-4 semanas; priorizar módulos críticos |
| **Resistência da equipe** | Baixa | Médio | Training sessions; pair programming; documentação clara |
| **Perda de conhecimento do Fastify** | Baixa | Alto | Documentação detalhada; code review rigoroso; manter código 90 dias |

---

## 📊 Métricas de Sucesso

### KPIs - Fase I (AWS Deploy)

| Métrica | Baseline | Target | Como Medir |
|---------|----------|--------|------------|
| **Uptime** | N/A | 99.9% | CloudWatch Alarms |
| **P95 Latency** | N/A | < 500ms | API Gateway metrics |
| **Error Rate** | N/A | < 0.1% | CloudWatch Logs |
| **Cost/Month** | $0 | ~$201 | AWS Cost Explorer |
| **Deploy Time** | Manual | < 10min | GitHub Actions |
| **MTTR** | N/A | < 30min | Incident logs |

### KPIs - Fase II (NestJS Migration)

| Métrica | Baseline (Fastify) | Target (NestJS) | Como Medir |
|---------|-------------------|-----------------|------------|
| **P95 Latency** | 200ms | < 250ms (+25% ok) | Load testing |
| **Throughput** | 1000 req/s | > 900 req/s | k6 tests |
| **Memory Usage** | 150MB | < 200MB | ECS metrics |
| **Test Coverage** | ~40% | > 80% | Jest coverage |
| **Build Time** | 30s | < 45s | GitHub Actions |
| **Bugs em Prod** | N/A | 0 críticos/mês | Issue tracker |

---

## 📚 Documentação e Treinamento

### Documentos a Criar/Atualizar

**Durante Fase I**:
- [ ] Arquitetura AWS (diagramas)
- [ ] Runbook de operações
- [ ] Disaster recovery plan
- [ ] API Gateway configuration guide
- [ ] Troubleshooting guide

**Durante Fase II**:
- [ ] NestJS migration guide
- [ ] Code style guide (NestJS)
- [ ] Onboarding guide (novos devs)
- [ ] Testing strategy
- [ ] Performance benchmarks

### Treinamentos Recomendados

**Antes de Fase I**:
1. **AWS Fundamentals** (8h) - Toda equipe
   - VPC, ECS, RDS, S3, CloudFront, API Gateway

**Antes de Fase II**:
1. **NestJS Fundamentals** (16h) - Backend team
   - Modules, Controllers, Services
   - Dependency Injection
   - Guards, Interceptors, Pipes
   - Testing

2. **Advanced NestJS** (8h) - Backend lead
   - Custom Decorators
   - Dynamic Modules
   - Microservices patterns

---

## 🎯 Decisões Estratégicas

### Por que AWS?
- ✅ Infraestrutura gerenciada (RDS, ElastiCache)
- ✅ Auto-scaling nativo
- ✅ CloudFront para CDN global
- ✅ Spot instances (economia 60%)
- ✅ Ecossistema completo (monitoring, CI/CD)

### Por que API Gateway?
- ✅ Rate limiting nativo
- ✅ Request/response validation
- ✅ API Keys management
- ✅ Logs + metrics integrados
- ✅ WAF integration (segurança)

### Por que NestJS?
- ✅ Padrões de mercado (onboarding fácil)
- ✅ Dependency Injection nativa
- ✅ Decorators (menos boilerplate)
- ✅ Testing tools integrados
- ✅ Ecossistema rico (Prisma, Swagger, WebSocket)
- ✅ Mantém performance com Fastify adapter

### Por que Strangler Pattern?
- ✅ Migração gradual (baixo risco)
- ✅ Sistema sempre em produção
- ✅ Rollback fácil por módulo
- ✅ Learning curve suave
- ✅ Validação contínua

---

## 📞 Contatos e Suporte

### Equipe Principal

| Papel | Nome | Email | Responsabilidades |
|-------|------|-------|-------------------|
| Tech Lead | [Nome] | [email] | Arquitetura, decisões técnicas |
| Backend Lead | [Nome] | [email] | Migração NestJS, code review |
| DevOps Lead | [Nome] | [email] | AWS, Terraform, CI/CD |
| Product Owner | [Nome] | [email] | Priorização, aceite |

### Escalação

**Nível 1**: Desenvolvedor responsável pelo módulo
**Nível 2**: Backend/DevOps Lead
**Nível 3**: Tech Lead + Product Owner
**Nível 4**: CTO

---

## 🔄 Próximos Passos Imediatos

### Semana Atual (Preparação)

1. **Revisar este documento** com stakeholders
   - [ ] Apresentação para tech team
   - [ ] Apresentação para management
   - [ ] Aprovar budget AWS (~$201/mês)

2. **Alocar equipe**
   - [ ] Definir tech lead
   - [ ] Alocar 2-3 backend devs
   - [ ] Alocar 1 devops
   - [ ] Definir QA

3. **Setup inicial**
   - [ ] Criar AWS account (se não existir)
   - [ ] Setup GitHub organization/repos
   - [ ] Criar Slack channels (#halalsphere-deploy, #halalsphere-nestjs)

4. **Kickoff meeting**
   - [ ] Alinhar expectativas
   - [ ] Definir working agreements
   - [ ] Setup daily standups
   - [ ] Criar board no Jira/Linear

### Próxima Semana (Sprint 1 - Fase I)

1. **Iniciar containerização**
   - [ ] Criar backend/Dockerfile
   - [ ] Otimizar frontend build
   - [ ] Implementar graceful shutdown

2. **Setup AWS**
   - [ ] Criar AWS account
   - [ ] Setup Terraform state bucket
   - [ ] Configure AWS credentials

3. **Gerar Swagger**
   - [ ] Criar script generate-api-gateway-swagger.ts
   - [ ] Validar 111 endpoints

---

## 📝 Versionamento deste Documento

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-01-12 | Claude + User | Versão inicial - Roadmap completo |

---

## 🏁 Conclusão

Este roadmap consolida:
- ✅ **Fase I**: Deploy AWS (3 semanas) - Sistema em produção com arquitetura moderna
- ✅ **Fase II**: Migração NestJS (8-12 semanas) - Stack modernizado mantendo estabilidade
- ✅ Timeline realista com buffer
- ✅ Riscos identificados e mitigados
- ✅ Métricas de sucesso claras
- ✅ Equipe dimensionada

**Duração Total**: 18-24 semanas (4-6 meses)
**Investimento**: ~$201/mês AWS + ~5 FTEs
**ROI**: Sistema escalável, performático e moderno

**Status**: ✅ Pronto para iniciar

---

**Próxima ação**: Apresentar para stakeholders e obter aprovação para começar Sprint 1.
