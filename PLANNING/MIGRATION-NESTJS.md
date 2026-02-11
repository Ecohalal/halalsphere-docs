# Plano de Migracao: Fastify -> NestJS (CONCLUIDO)

> **MIGRACAO CONCLUIDA** - O backend HalalSphere foi migrado 100% para NestJS 11 + Express.
> Fastify foi completamente removido do codebase. Este documento e mantido como registro historico
> do planejamento original. Para o estado atual, consulte o repo `halalsphere-backend`.

**Projeto**: HalalSphere Backend
**Data de Atualizacao**: 14 de Janeiro de 2026
**Status**: CONCLUIDO - NestJS 11.0.1 + Express em producao
**Stack Final**: NestJS 11 + Express adapter (nao Fastify adapter como planejado)

---

## 📊 CONTEXTO ATUAL (Janeiro 2026)

### Estado do Projeto

O HalalSphere está **95% implementado e production-ready**:

| Aspecto | Status | Detalhes |
|---------|--------|----------|
| **Backend** | ✅ 95% | 13 módulos, 80+ endpoints, 26+ services |
| **Frontend** | ✅ 100% | 34 páginas, 55+ componentes, 0 TODOs |
| **Documentação** | ✅ 100% | 211 arquivos, GitHub Pages ativo |
| **Infraestrutura** | ⚠️ Atualização Pendente | Mudanças AWS Jan 2026 |
| **Deploy** | 🔄 Staging Ready | Aguardando ajustes de infra |

### Arquitetura Atual

**Estatísticas do Backend:**
- **13 módulos** de domínio implementados
- **80+ endpoints** REST funcionais
- **19 tabelas** no PostgreSQL 16 + pgvector
- **12 tipos de roles** RBAC completo
- **3 países** suportados (BR, CO, PY)
- **5 serviços externos** (S3, AI, E-Signature, Email, PDF)
- **37 TODO comments** (melhorias não-bloqueantes)

**Stack Tecnológico Atual:**
```
Framework:      Fastify 5.2.0
ORM:            Prisma 6.1.0
Database:       PostgreSQL 16 + pgvector
Validation:     Zod 3.23.8
Auth:           @fastify/jwt (HS256 - migrar para RS256)
Files:          @fastify/multipart + AWS S3
Cache:          Redis 4.7.0
Email:          Nodemailer 7.0.10
PDF:            Puppeteer 24.32.1 + PDFKit
AI:             Anthropic Claude SDK
E-Signature:    ClickSign + D4Sign + DocuSign
```

### Mudanças de Infraestrutura AWS (Janeiro 2026) ⚡

**IMPORTANTE**: Em 14 de Janeiro de 2026, a equipe de infraestrutura solicitou ajustes críticos:

#### 1. Renomeação de Secrets AWS
- ❌ `DATABASE_URL` → ✅ `SQL_HALALSPHERE_CONNECTION`
- ❌ `JWT_SECRET` → ✅ `JWT_PUBLIC_KEY_HALALSPHERE_API` + `JWT_PRIVATE_KEY_HALALSPHERE_API`

#### 2. Remoção de Credenciais AWS
- ❌ `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` removidos
- ✅ ECS Task Role fornece credenciais via IAM Roles

#### 3. JWT - Migração para RS256
- ❌ HS256 (simétrico) → ✅ RS256 (assimétrico - RSA 2048)
- ✅ Maior segurança e facilita rotação de chaves

**Documentação**: [AWS-INFRA-CHANGES-2026.md](../ARCHITECTURE/AWS-INFRA-CHANGES-2026.md)

---

## 🎯 OBJETIVOS ATUALIZADOS DA MIGRAÇÃO

### Por Que Migrar Agora?

Com o sistema **95% pronto**, a migração para NestJS oferece:

#### 1. **Timing Ideal** ✅
- Sistema implementado, mas ainda não em produção
- Evita refatoração após deploy
- Melhor momento para modernização

#### 2. **Arquitetura e Organização**
- ✅ Dependency Injection nativa (vs. singletons manuais atuais)
- ✅ Decorators para rotas, guards, interceptors
- ✅ Módulos auto-contidos com imports/exports claros
- ✅ CLI para scaffolding consistente

#### 3. **Developer Experience**
- ✅ Convenções estabelecidas (padrão de mercado)
- ✅ Documentação automática com Swagger decorators
- ✅ Testing tools nativos (@nestjs/testing)
- ✅ Hot reload com HMR
- ✅ Onboarding mais fácil (NestJS é padrão mercado)

#### 4. **Performance Mantida**
- ✅ NestJS com Fastify adapter mantém 95% da performance
- ✅ Overhead de ~20ms é aceitável vs. benefícios

#### 5. **Ecosystem**
- ✅ Integrações oficiais (Prisma, Redis, WebSocket, GraphQL)
- ✅ Microservices patterns prontos
- ✅ Queue management (@nestjs/bull)
- ✅ CQRS/Event Sourcing suporte

### Comparação: Fastify vs NestJS+Fastify

| Aspecto | Fastify Atual | NestJS+Fastify |
|---------|---------------|----------------|
| **Performance** | 100% | ~95% (overhead mínimo) |
| **Organização** | Manual | Estruturada (módulos) |
| **DI** | Singletons manuais | Nativo (@Injectable) |
| **Testing** | Manual setup | @nestjs/testing integrado |
| **Swagger** | Manual (Zod) | Decorators automáticos |
| **Onboarding** | 2 semanas | 1 semana (padrão mercado) |
| **Ecosystem** | Plugins Fastify | NestJS + Fastify plugins |

---

## 📋 ESTRATÉGIA DE MIGRAÇÃO ATUALIZADA

### Abordagem: **Big Bang (Reescrita Paralela)**

Dada a situação atual (sistema não em produção), recomendamos **reescrita paralela** ao invés de Strangler Pattern:

```
┌─────────────────────────────────────────────────┐
│  Fase 0: Preparação e Ajustes AWS (1 semana)   │
│  - Ajustar ConfigLoader (novos secrets AWS)    │
│  - Implementar JWT RS256                       │
│  - Atualizar Storage Manager (IAM Roles)       │
│  - Validar em ambiente local                   │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Fase 1: Setup NestJS + Core (2 semanas)       │
│  - Criar projeto NestJS paralelo               │
│  - Configurar infraestrutura base              │
│  - Migrar Auth + Health check                  │
│  - Implementar Guards e Decorators             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Fase 2: Migração Módulos (4-5 semanas)        │
│  - Migrar todos os 13 módulos                  │
│  - Ordem: simples → complexos                  │
│  - 2-3 módulos por semana                      │
│  - Manter paridade funcional 100%              │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Fase 3: Serviços + Testing (2 semanas)        │
│  - Migrar serviços compartilhados              │
│  - Testes E2E completos                        │
│  - Performance testing                         │
│  - Code coverage > 80%                         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Fase 4: Deploy e Validação (1 semana)         │
│  - Deploy em staging                           │
│  - UAT completo                                │
│  - Performance validation                      │
│  - Deploy em production                        │
└─────────────────────────────────────────────────┘
```

**Duração Total Estimada**: 10-12 semanas

### Vantagens da Abordagem Big Bang (Neste Contexto)

✅ **Sistema não está em produção** - sem risco de downtime
✅ **Codebase completo conhecido** - 95% implementado, sem surpresas
✅ **Migração mais rápida** - 10-12 semanas vs 16-20 semanas do Strangler
✅ **Código limpo desde início** - sem manter 2 sistemas em paralelo
✅ **Testing mais simples** - um sistema por vez

---

## 🗓️ FASE 0: Ajustes AWS e Preparação (1 semana)

### Objetivos
- Implementar mudanças de infraestrutura AWS Janeiro 2026
- Validar configuração local antes da migração
- Preparar ambiente para NestJS

### Atividades

#### 0.1. Atualizar ConfigLoader Service (2 dias)

**Responsável**: Backend Lead

**Mudanças Necessárias**:
```typescript
// src/services/config-loader.ts - ATUALIZAR

// ANTES (deprecated):
const databaseUrl = await getSecret('DATABASE_URL');
const jwtSecret = await getSecret('JWT_SECRET');
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;

// DEPOIS (novo padrão):
const databaseUrl = await getSecret('SQL_HALALSPHERE_CONNECTION');
const jwtPublicKey = await getSecret('JWT_PUBLIC_KEY_HALALSPHERE_API');
const jwtPrivateKey = await getSecret('JWT_PRIVATE_KEY_HALALSPHERE_API');
// AWS credentials via IAM Role (ECS Task Role)
```

**Referência**: [CONFIGLOADER-UPDATE-GUIDE.md](../ARCHITECTURE/CONFIGLOADER-UPDATE-GUIDE.md)

**Checklist**:
- [ ] Atualizar mapeamento de secrets no ConfigLoader
- [ ] Gerar par de chaves RSA 2048 para JWT
- [ ] Testar geração de secrets localmente
- [ ] Validar conexão com banco usando novo secret name
- [ ] Documentar mudanças no README

---

#### 0.2. Implementar JWT RS256 (2 dias)

**Responsável**: Backend Dev

**Mudanças Necessárias**:
```typescript
// src/services/auth-service.ts - ATUALIZAR

// ANTES (HS256):
import jwt from 'jsonwebtoken';
const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });

// DEPOIS (RS256):
const token = jwt.sign(payload, config.jwtPrivateKey, {
  algorithm: 'RS256',
  expiresIn: '24h'
});

// Verificação:
const decoded = jwt.verify(token, config.jwtPublicKey, {
  algorithms: ['RS256']
});
```

**Checklist**:
- [ ] Gerar par de chaves RSA 2048 (local)
- [ ] Atualizar AuthService para usar RS256
- [ ] Atualizar middleware de autenticação
- [ ] Atualizar testes de auth
- [ ] Validar login/logout funcionando
- [ ] Documentar processo de rotação de chaves

**Script para Gerar Chaves**:
```bash
# Gerar chave privada RSA 2048
openssl genrsa -out jwt_private.key 2048

# Extrair chave pública
openssl rsa -in jwt_private.key -pubout -out jwt_public.key

# Converter para formato base64 (para AWS Secrets Manager)
cat jwt_private.key | base64 > jwt_private_base64.txt
cat jwt_public.key | base64 > jwt_public_base64.txt
```

---

#### 0.3. Atualizar Storage Manager (1 dia)

**Responsável**: Backend Dev

**Mudanças Necessárias**:
```typescript
// src/services/storage-manager.ts - ATUALIZAR

// ANTES (credenciais explícitas):
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// DEPOIS (IAM Role):
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  // Credenciais via ECS Task Role (automático)
});
```

**Checklist**:
- [ ] Remover referências a AWS_ACCESS_KEY_ID
- [ ] Remover referências a AWS_SECRET_ACCESS_KEY
- [ ] Testar upload local (com credenciais AWS profile)
- [ ] Validar pre-signed URLs
- [ ] Atualizar documentação

---

#### 0.4. Auditoria e Documentação (2 dias)

**Responsável**: Backend Team

**Checklist**:
- [ ] Documentar todos os 80+ endpoints (request/response schemas)
- [ ] Mapear dependências entre módulos (diagrama de dependências)
- [ ] Listar todas as variáveis de ambiente (.env.example atualizado)
- [ ] Documentar regras de negócio críticas (README por módulo)
- [ ] Criar testes de regressão E2E (Postman collection)
- [ ] Atualizar ARCHITECTURE.md com estado atual

---

#### 0.5. Setup Branch Strategy (0.5 dia)

**Estratégia de Branches**:
```
main (Fastify - baseline)
  └── feature/nestjs-migration
       ├── phase-1-setup-core
       ├── phase-2-modules
       ├── phase-3-services
       └── phase-4-deploy
```

**Checklist**:
- [ ] Criar branch `feature/nestjs-migration`
- [ ] Setup GitHub Projects/Issues para tracking
- [ ] Definir processo de code review
- [ ] Configurar CI para branch (testes automáticos)

---

### Checklist Completo Fase 0

- [ ] ConfigLoader atualizado com novos secret names
- [ ] JWT RS256 implementado e testado
- [ ] Storage Manager usando IAM Roles
- [ ] Par de chaves RSA gerado
- [ ] Todos os endpoints documentados
- [ ] Dependências mapeadas
- [ ] Testes de regressão criados
- [ ] Branch strategy definida
- [ ] Sistema Fastify validado e funcionando 100%

---

## 🗓️ FASE 1: Setup NestJS + Core (2 semanas)

### Objetivos
- Projeto NestJS funcionando com Fastify adapter
- Infraestrutura core implementada
- Auth module migrado e funcionando
- Primeiros endpoints validados

### Sprint 1.1: Setup Inicial (3 dias)

#### 1.1.1. Criar Projeto NestJS (1 dia)

**Responsável**: Backend Lead

**Tarefas**:
```bash
# 1. Criar projeto NestJS com Fastify adapter
cd ..  # Sair do projeto Fastify
npm i -g @nestjs/cli
nest new halalsphere-backend-nest --package-manager npm

cd halalsphere-backend-nest

# 2. Instalar Fastify adapter
npm install @nestjs/platform-fastify

# 3. Instalar dependências principais
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport-jwt
npm install @nestjs/swagger
npm install @prisma/client prisma
npm install zod zod-validation-error
npm install bcrypt redis ioredis
npm install @types/bcrypt @types/node

# 4. Instalar serviços externos
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install nodemailer @types/nodemailer
npm install @anthropic-ai/sdk
npm install puppeteer
npm install pdfkit
```

**Configurar main.ts com Fastify**:
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: true, // Para ALB/API Gateway
    })
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('HalalSphere API')
    .setDescription('API de Certificação Halal')
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(3333, '0.0.0.0');
  console.log(`🚀 Application running on: ${await app.getUrl()}`);
}

bootstrap();
```

**Checklist**:
- [ ] Projeto NestJS criado
- [ ] Fastify adapter configurado
- [ ] Dependências instaladas
- [ ] main.ts configurado
- [ ] Health check endpoint funcionando (`GET /`)

---

#### 1.1.2. Copiar Prisma Schema (0.5 dia)

**Tarefas**:
```bash
# 1. Copiar schema do projeto Fastify
cp ../halalsphere-backend/prisma/schema.prisma ./prisma/

# 2. Gerar Prisma Client
npx prisma generate

# 3. Criar PrismaService
mkdir -p src/database
```

**Criar PrismaService**:
```typescript
// src/database/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
  }

  // Helper para limpar dados em testes
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      key => key !== '_engine' && !key.toString().startsWith('$')
    );

    await Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof PrismaService];
        if (model && typeof model === 'object' && 'deleteMany' in model) {
          return (model as any).deleteMany();
        }
      })
    );
  }
}

// src/database/database.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
```

**Checklist**:
- [ ] Prisma schema copiado
- [ ] PrismaService criado
- [ ] DatabaseModule criado e exportando PrismaService
- [ ] Conexão com banco testada

---

#### 1.1.3. Config Module (1 dia)

**Criar estrutura**:
```bash
mkdir -p src/config
```

**ConfigModule**:
```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT || '3333', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL || process.env.SQL_HALALSPHERE_CONNECTION,
  },

  jwt: {
    publicKey: process.env.JWT_PUBLIC_KEY_HALALSPHERE_API,
    privateKey: process.env.JWT_PRIVATE_KEY_HALALSPHERE_API,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'noreply@halalsphere.com',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
});

// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
})
export class ConfigModule {}
```

**Checklist**:
- [ ] ConfigModule criado
- [ ] Todas as variáveis de ambiente mapeadas
- [ ] ConfigService testado
- [ ] .env.example atualizado

---

### Sprint 1.2: Core Infrastructure (4 dias)

#### 1.2.1. Guards e Decorators (2 dias)

**Criar estrutura**:
```bash
mkdir -p src/common/{guards,decorators,interceptors,filters,pipes}
```

**JWT Auth Guard**:
```typescript
// src/common/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

**Roles Guard**:
```typescript
// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
```

**Decorators**:
```typescript
// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
```

**Checklist**:
- [ ] JwtAuthGuard implementado
- [ ] RolesGuard implementado
- [ ] @Public() decorator criado
- [ ] @Roles() decorator criado
- [ ] @CurrentUser() decorator criado
- [ ] Guards testados

---

#### 1.2.2. Interceptors e Filters (1 dia)

**Logging Interceptor**:
```typescript
// src/common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const userAgent = request.headers['user-agent'] || '';
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const delay = Date.now() - now;

          this.logger.log(
            `${method} ${url} ${statusCode} ${delay}ms - ${userAgent} ${ip}`
          );
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.error(
            `${method} ${url} ERROR ${delay}ms - ${error.message}`
          );
        },
      }),
    );
  }
}
```

**Exception Filter**:
```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message,
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(status).send(errorResponse);
  }
}
```

**Checklist**:
- [ ] LoggingInterceptor implementado
- [ ] AllExceptionsFilter implementado
- [ ] Interceptors testados
- [ ] Filters testados

---

#### 1.2.3. Zod Validation Pipe (1 dia)

**Zod Validation Pipe**:
```typescript
// src/common/pipes/zod-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: fromZodError(error).details,
      });
    }
  }
}

// Helper para usar com decorators
export function ZodBody(schema: ZodSchema) {
  return Body(new ZodValidationPipe(schema));
}

export function ZodQuery(schema: ZodSchema) {
  return Query(new ZodValidationPipe(schema));
}

export function ZodParam(schema: ZodSchema) {
  return Param(new ZodValidationPipe(schema));
}
```

**Checklist**:
- [ ] ZodValidationPipe implementado
- [ ] Helper decorators criados
- [ ] Pipe testado com schemas Zod

---

### Sprint 1.3: Auth Module (3 dias)

#### 1.3.1. Criar Auth Module (3 dias)

**Gerar estrutura**:
```bash
nest g module modules/auth
nest g controller modules/auth
nest g service modules/auth
```

**JWT Strategy (RS256)**:
```typescript
// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.publicKey'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { id: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        isActive: true,
        company: {
          select: {
            id: true,
            tradeName: true,
            country: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
```

**Auth Service** (migrar lógica do Fastify):
```typescript
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { company: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check account lockout
    if (user.loginAttempts >= 5) {
      const lockoutTime = new Date(user.lastLoginAttempt);
      lockoutTime.setMinutes(lockoutTime.getMinutes() + 30);

      if (new Date() < lockoutTime) {
        throw new UnauthorizedException('Account locked. Try again in 30 minutes');
      }

      // Reset attempts after lockout period
      await this.prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0 },
      });
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: { increment: 1 },
          lastLoginAttempt: new Date(),
        },
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    const token = await this.signToken(user.id, user.email, user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
      },
    };
  }

  async register(dto: RegisterDto) {
    // Migrar lógica completa do Fastify
    // ...
  }

  private async signToken(userId: string, email: string, role: string): Promise<string> {
    const payload = { id: userId, email, role };

    const privateKey = this.config.get<string>('jwt.privateKey');
    const expiresIn = this.config.get<string>('jwt.expiresIn');

    return this.jwt.sign(payload, {
      secret: privateKey,
      algorithm: 'RS256',
      expiresIn,
    });
  }

  // Implementar demais métodos: verifyEmail, forgotPassword, resetPassword, etc.
}
```

**DTOs**:
```typescript
// src/modules/auth/dto/login.dto.ts
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginDto = z.infer<typeof LoginSchema>;

// Para Swagger
export class LoginDtoSwagger {
  @ApiProperty({ example: 'empresa@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
```

**Controller**:
```typescript
// src/modules/auth/auth.controller.ts
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, LoginDtoSwagger } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { LoginSchema } from './dto/login.dto';

@Controller('api/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new company' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  // Implementar demais endpoints: verifyEmail, forgotPassword, etc.
}
```

**Auth Module**:
```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        privateKey: config.get<string>('jwt.privateKey'),
        publicKey: config.get<string>('jwt.publicKey'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: config.get<string>('jwt.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

**Checklist**:
- [ ] JwtStrategy implementada (RS256)
- [ ] AuthService migrado (login, register, etc.)
- [ ] AuthController com 8 endpoints
- [ ] DTOs com validação Zod
- [ ] Swagger documentado
- [ ] Account lockout implementado
- [ ] Testes unitários (>80% coverage)
- [ ] Testes E2E do auth flow

---

### Sprint 1.4: Health Module (0.5 dia)

**Gerar estrutura**:
```bash
nest g module modules/health
nest g controller modules/health
nest g service modules/health
```

**Health Service**:
```typescript
// src/modules/health/health.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private prisma: PrismaService) {}

  async liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  async readiness() {
    const checks = {
      database: await this.checkDatabase(),
      // redis: await this.checkRedis(), // Se usar Redis
    };

    const allHealthy = Object.values(checks).every(check => check === 'healthy');

    return {
      status: allHealthy ? 'ready' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private async checkDatabase(): Promise<string> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'healthy';
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return 'unhealthy';
    }
  }
}
```

**Health Controller**:
```typescript
// src/modules/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { HealthService } from './health.service';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  async liveness() {
    return this.healthService.liveness();
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  async readiness() {
    return this.healthService.readiness();
  }
}
```

**Checklist**:
- [ ] HealthModule implementado
- [ ] Liveness endpoint (`/health/live`)
- [ ] Readiness endpoint (`/health/ready`)
- [ ] Database health check
- [ ] Endpoints testados

---

### App Module (Configuração Global)

**App Module Final**:
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    HealthModule,
    // Outros módulos serão adicionados na Fase 2
  ],
  providers: [
    // Global guards
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },

    // Global interceptors
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

    // Global filters
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
```

---

### Checklist Completo Fase 1

**Setup**:
- [ ] Projeto NestJS criado com Fastify adapter
- [ ] Todas as dependências instaladas
- [ ] Prisma schema copiado e configurado
- [ ] PrismaService criado e testado
- [ ] ConfigModule implementado
- [ ] .env configurado corretamente

**Core Infrastructure**:
- [ ] JwtAuthGuard implementado
- [ ] RolesGuard implementado
- [ ] Decorators (@Public, @Roles, @CurrentUser)
- [ ] LoggingInterceptor implementado
- [ ] AllExceptionsFilter implementado
- [ ] ZodValidationPipe implementado
- [ ] Guards aplicados globalmente no AppModule

**Auth Module**:
- [ ] JwtStrategy implementada (RS256)
- [ ] AuthService com 8 métodos migrados
- [ ] AuthController com 8 endpoints
- [ ] DTOs com validação Zod
- [ ] Swagger documentado
- [ ] Account lockout funcionando
- [ ] Testes unitários (>80% coverage)
- [ ] Testes E2E do auth flow

**Health Module**:
- [ ] HealthModule implementado
- [ ] Liveness endpoint funcionando
- [ ] Readiness endpoint verificando DB
- [ ] Health checks testados

**Validação**:
- [ ] Servidor rodando na porta 3333
- [ ] Swagger acessível em `/api/docs`
- [ ] POST `/api/auth/login` funcionando
- [ ] GET `/api/auth/me` com JWT funcionando
- [ ] GET `/health/live` retornando 200
- [ ] GET `/health/ready` verificando DB
- [ ] Logs estruturados funcionando

---

## 🗓️ FASE 2: Migração de Módulos (4-5 semanas)

### Objetivos
- Migrar todos os 13 módulos do Fastify para NestJS
- Manter 100% de paridade funcional
- Implementar testes para cada módulo
- Documentar com Swagger

### Estratégia de Migração

**Ordem de Migração** (do mais simples ao mais complexo):

| Ordem | Módulo | Endpoints | Complexidade | Dependências | Duração |
|-------|--------|-----------|--------------|--------------|---------|
| 1 | industrial-classification | 4 | Baixa | Nenhuma | 1 dia |
| 2 | storage-config | 2 | Baixa | Storage | 1 dia |
| 3 | comment | 6 | Baixa | Process | 2 dias |
| 4 | document-request | 7 | Média | Process | 2 dias |
| 5 | users / admin | 6 | Média | Auth | 2 dias |
| 6 | **process** (core) | 7 | Alta | Várias | 3 dias |
| 7 | **proposal** | 16 | Alta | Process | 3 dias |
| 8 | **contract** | 10 | Alta | Process, E-Signature | 3 dias |
| 9 | audit-schedule | 8 | Média | Process | 2 dias |
| 10 | audit-execution | 12 | Alta | Audit-Schedule | 3 dias |
| 11 | manager | 10 | Média | Process, Analytics | 2 dias |
| 12 | comercial | 4 | Baixa | Proposal | 1 dia |
| 13 | juridico | 4 | Baixa | Contract | 1 dia |

**Total**: ~25 dias úteis (~5 semanas com 2 devs em paralelo)

---

### Template de Migração por Módulo

Para cada módulo, seguir este processo:

#### Passo 1: Gerar Estrutura NestJS (30min)

```bash
nest g module modules/[module-name]
nest g controller modules/[module-name]
nest g service modules/[module-name]
```

#### Passo 2: Criar DTOs com Zod (1-2h)

```typescript
// src/modules/[module-name]/dto/create-[entity].dto.ts
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Schema Zod (para validação)
export const CreateEntitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  // ... outros campos
});

export type CreateEntityDto = z.infer<typeof CreateEntitySchema>;

// Classe para Swagger documentation
export class CreateEntityDtoSwagger implements CreateEntityDto {
  @ApiProperty({ example: 'Example Name' })
  name: string;

  @ApiProperty({ example: 'Example Description', required: false })
  description?: string;
}
```

#### Passo 3: Migrar Service (2-4h)

```typescript
// src/modules/[module-name]/[module-name].service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEntityDto, UpdateEntityDto } from './dto';

@Injectable()
export class EntityService {
  constructor(
    private prisma: PrismaService,
    // Injetar outros services necessários
  ) {}

  async create(dto: CreateEntityDto, userId: string) {
    // Migrar lógica de negócio do Fastify
    // A lógica permanece a mesma, apenas adaptar:
    // 1. Prisma já está injetado (vs. singleton manual)
    // 2. Exceptions: usar NestJS exceptions (NotFoundException, BadRequestException, etc.)
    // 3. Logs: usar this.logger ao invés de console.log

    return this.prisma.entity.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(filters: any) {
    // Migrar lógica de listagem
    return this.prisma.entity.findMany({
      where: filters,
    });
  }

  async findOne(id: string) {
    const entity = await this.prisma.entity.findUnique({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }

  async update(id: string, dto: UpdateEntityDto) {
    // Verificar se existe
    await this.findOne(id);

    return this.prisma.entity.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.entity.delete({
      where: { id },
    });
  }
}
```

#### Passo 4: Migrar Controller (2-3h)

```typescript
// src/modules/[module-name]/[module-name].controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EntityService } from './entity.service';
import { CreateEntityDto, UpdateEntityDto, CreateEntityDtoSwagger } from './dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateEntitySchema } from './dto/create-entity.dto';
import { UserRole } from '@prisma/client';

@Controller('api/entities')
@ApiTags('Entities')
@ApiBearerAuth()
export class EntityController {
  constructor(private entityService: EntityService) {}

  @Post()
  @Roles(UserRole.analista, UserRole.gestor)
  @ApiOperation({ summary: 'Create new entity' })
  @ApiResponse({ status: 201, description: 'Entity created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body(new ZodValidationPipe(CreateEntitySchema)) dto: CreateEntityDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.entityService.create(dto, userId);
  }

  @Get()
  @Roles(UserRole.analista, UserRole.gestor, UserRole.admin)
  @ApiOperation({ summary: 'List all entities' })
  async findAll(@Query() filters: any, @CurrentUser() user: any) {
    return this.entityService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entity by ID' })
  async findOne(@Param('id') id: string) {
    return this.entityService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.analista, UserRole.gestor)
  @ApiOperation({ summary: 'Update entity' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEntityDto,
  ) {
    return this.entityService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Delete entity' })
  async remove(@Param('id') id: string) {
    return this.entityService.remove(id);
  }
}
```

#### Passo 5: Testes (2-3h por módulo)

**Testes Unitários do Service**:
```typescript
// src/modules/[module-name]/[module-name].service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EntityService } from './entity.service';
import { PrismaService } from '../../database/prisma.service';

describe('EntityService', () => {
  let service: EntityService;
  let prisma: PrismaService;

  const mockPrismaService = {
    entity: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EntityService>(EntityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an entity', async () => {
      const dto = { name: 'Test Entity' };
      const userId = 'user-123';
      const expectedResult = { id: '1', ...dto, userId };

      mockPrismaService.entity.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto, userId);

      expect(result).toEqual(expectedResult);
      expect(prisma.entity.create).toHaveBeenCalledWith({
        data: { ...dto, userId },
      });
    });
  });

  describe('findOne', () => {
    it('should return an entity if found', async () => {
      const id = '1';
      const expectedResult = { id, name: 'Test Entity' };

      mockPrismaService.entity.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(id);

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if entity not found', async () => {
      const id = '999';
      mockPrismaService.entity.findUnique.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow('Entity with ID 999 not found');
    });
  });

  // Adicionar testes para outros métodos...
});
```

**Testes E2E do Controller**:
```typescript
// test/modules/[module-name].e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';

describe('EntityController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.cleanDatabase(); // Se em test env
    await app.close();
  });

  describe('POST /api/entities', () => {
    it('should create a new entity', () => {
      return request(app.getHttpServer())
        .post('/api/entities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Entity',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Entity');
        });
    });

    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .post('/api/entities')
        .send({ name: 'Test' })
        .expect(401);
    });

    it('should return 400 for invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/entities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '', // Invalid: empty string
        })
        .expect(400);
    });
  });

  describe('GET /api/entities', () => {
    it('should list all entities', () => {
      return request(app.getHttpServer())
        .get('/api/entities')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // Adicionar testes para outros endpoints...
});
```

#### Passo 6: Adicionar ao AppModule

```typescript
// src/app.module.ts
import { EntityModule } from './modules/entity/entity.module';

@Module({
  imports: [
    // ... módulos existentes
    EntityModule,
  ],
  // ...
})
export class AppModule {}
```

---

### Critérios de Aceite por Módulo

Para considerar um módulo **completamente migrado**, validar:

- [ ] Todos os endpoints do Fastify reimplementados
- [ ] Business logic idêntica (100% paridade funcional)
- [ ] DTOs com validação Zod para todos os endpoints
- [ ] Swagger documentado (operações, responses, schemas)
- [ ] Testes unitários do service (>80% coverage)
- [ ] Testes E2E dos endpoints principais
- [ ] Guards aplicados corretamente (@Roles)
- [ ] Exceptions tratadas (NotFoundException, etc.)
- [ ] Logs implementados onde necessário
- [ ] Módulo adicionado ao AppModule
- [ ] Testado manualmente via Swagger UI
- [ ] Code review aprovado

---

### Checklist Completo Fase 2

**Módulos Simples (Semanas 1-2)**:
- [ ] industrial-classification migrado
- [ ] storage-config migrado
- [ ] comment migrado
- [ ] document-request migrado
- [ ] users/admin migrado

**Módulos Core (Semanas 3-4)**:
- [ ] **process** migrado (core business)
- [ ] **proposal** migrado (cálculo automático)
- [ ] **contract** migrado (PDF + e-signature)

**Módulos Auditorias (Semana 5)**:
- [ ] audit-schedule migrado
- [ ] audit-execution migrado (checklist digital)

**Módulos Finais (Semana 5)**:
- [ ] manager migrado (dashboard)
- [ ] comercial migrado
- [ ] juridico migrado

**Validação Geral**:
- [ ] Todos os 13 módulos migrados
- [ ] 80+ endpoints funcionando
- [ ] Swagger completo com todos os endpoints
- [ ] Testes unitários > 80% coverage
- [ ] Testes E2E dos fluxos principais
- [ ] Zero erros de TypeScript
- [ ] Linter passando sem warnings

---

## 🗓️ FASE 3: Serviços Compartilhados + Testing (2 semanas)

### Objetivos
- Migrar serviços compartilhados (Email, Storage, PDF, AI, E-Signature)
- Implementar testes E2E completos
- Performance testing
- Atingir > 80% code coverage

---

### Sprint 3.1: Serviços Compartilhados (1 semana)

#### 3.1.1. Email Service (1 dia)

**Criar módulo**:
```bash
nest g module shared/email
nest g service shared/email
```

**Email Service**:
```typescript
// src/shared/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('email.host'),
      port: this.config.get('email.port'),
      secure: false,
      auth: {
        user: this.config.get('email.user'),
        pass: this.config.get('email.pass'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${this.config.get('frontend.url')}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.config.get('email.from'),
      to,
      subject: 'Verifique seu email - HalalSphere',
      html: `
        <h1>Bem-vindo ao HalalSphere!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${verificationUrl}">Verificar Email</a>
      `,
    });

    this.logger.log(`Verification email sent to ${to}`);
  }

  // Implementar outros métodos: sendPasswordReset, sendProcessStatusUpdate, etc.
}
```

**Checklist**:
- [ ] EmailModule criado
- [ ] EmailService com Nodemailer
- [ ] Templates de email implementados
- [ ] Método sendVerificationEmail
- [ ] Método sendPasswordReset
- [ ] Método sendProcessStatusUpdate
- [ ] Testes unitários

---

#### 3.1.2. Storage Service (1 dia)

**Criar módulo**:
```bash
nest g module shared/storage
nest g service shared/storage
```

**Storage Service (S3 + IAM Role)**:
```typescript
// src/shared/storage/storage.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private config: ConfigService) {
    // AWS credentials via ECS Task Role (IAM Role)
    this.s3Client = new S3Client({
      region: this.config.get('aws.region'),
      // Credenciais automáticas via IAM Role
    });

    this.bucket = this.config.get('aws.s3Bucket');
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: 'AES256',
    });

    await this.s3Client.send(command);

    this.logger.log(`File uploaded: ${key}`);

    return key;
  }

  async getFileUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3Client, command, { expiresIn });

    return url;
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);

    this.logger.log(`File deleted: ${key}`);
  }
}
```

**Checklist**:
- [ ] StorageModule criado
- [ ] StorageService com S3Client (IAM Role)
- [ ] uploadFile implementado
- [ ] getFileUrl (pre-signed URLs)
- [ ] deleteFile implementado
- [ ] Testes unitários

---

#### 3.1.3. PDF Service (1 dia)

**Criar módulo**:
```bash
nest g module shared/pdf
nest g service shared/pdf
```

**PDF Service (Puppeteer)**:
```typescript
// src/shared/pdf/pdf.service.ts
import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generateContractPdf(contractData: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const html = this.generateContractHtml(contractData);

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    });

    await browser.close();

    this.logger.log(`Contract PDF generated for process ${contractData.processId}`);

    return pdfBuffer;
  }

  private generateContractHtml(data: any): string {
    // Migrar template HTML do Fastify
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          /* CSS do contrato */
        </style>
      </head>
      <body>
        <h1>Contrato de Certificação Halal</h1>
        <!-- Template completo -->
      </body>
      </html>
    `;
  }

  // Implementar generateCertificatePdf, generateProposalPdf, etc.
}
```

**Checklist**:
- [ ] PdfModule criado
- [ ] PdfService com Puppeteer
- [ ] generateContractPdf implementado
- [ ] generateCertificatePdf implementado
- [ ] Templates HTML migrados
- [ ] Testes unitários

---

#### 3.1.4. AI Service (1 dia)

**Criar módulo**:
```bash
nest g module shared/ai
nest g service shared/ai
```

**AI Service (Anthropic Claude)**:
```typescript
// src/shared/ai/ai.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AiService {
  private anthropic: Anthropic;
  private readonly logger = new Logger(AiService.name);

  constructor(private config: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.config.get('anthropic.apiKey'),
    });
  }

  async analyzeDocuments(documents: string[]): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analyze the following documents for Halal certification compliance:\n\n${documents.join('\n\n')}`,
        },
      ],
    });

    const response = message.content[0].type === 'text' ? message.content[0].text : '';

    this.logger.log('Document analysis completed');

    return response;
  }

  // Implementar chat, preAuditAnalysis, etc.
}
```

**Checklist**:
- [ ] AiModule criado
- [ ] AiService com Anthropic SDK
- [ ] analyzeDocuments implementado
- [ ] chat implementado
- [ ] preAuditAnalysis implementado
- [ ] Testes unitários

---

#### 3.1.5. E-Signature Service (2 dias)

**Criar módulo**:
```bash
nest g module shared/e-signature
nest g service shared/e-signature
```

**E-Signature Service (Strategy Pattern)**:
```typescript
// src/shared/e-signature/providers/base.provider.ts
export interface ESignatureProvider {
  createDocument(documentData: any): Promise<string>;
  sendForSignature(documentId: string, signers: any[]): Promise<void>;
  getDocumentStatus(documentId: string): Promise<string>;
  downloadSignedDocument(documentId: string): Promise<Buffer>;
}

// src/shared/e-signature/providers/d4sign.provider.ts
import { Injectable } from '@nestjs/common';
import { ESignatureProvider } from './base.provider';

@Injectable()
export class D4SignProvider implements ESignatureProvider {
  async createDocument(documentData: any): Promise<string> {
    // Implementar integração D4Sign
  }

  async sendForSignature(documentId: string, signers: any[]): Promise<void> {
    // Implementar envio para assinatura
  }

  // Implementar demais métodos...
}

// src/shared/e-signature/providers/clicksign.provider.ts
@Injectable()
export class ClickSignProvider implements ESignatureProvider {
  // Implementar Clicksign provider
}

// src/shared/e-signature/e-signature.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ESignatureProvider } from './providers/base.provider';
import { D4SignProvider } from './providers/d4sign.provider';
import { ClickSignProvider } from './providers/clicksign.provider';

@Injectable()
export class ESignatureService {
  private provider: ESignatureProvider;

  constructor(
    private config: ConfigService,
    private d4signProvider: D4SignProvider,
    private clicksignProvider: ClickSignProvider,
  ) {
    const providerType = this.config.get('esignature.provider', 'd4sign');

    this.provider = providerType === 'clicksign'
      ? this.clicksignProvider
      : this.d4signProvider;
  }

  async createDocument(documentData: any): Promise<string> {
    return this.provider.createDocument(documentData);
  }

  async sendForSignature(documentId: string, signers: any[]): Promise<void> {
    return this.provider.sendForSignature(documentId, signers);
  }

  // Proxy para demais métodos...
}
```

**Checklist**:
- [ ] E-SignatureModule criado
- [ ] Base provider interface
- [ ] D4SignProvider implementado
- [ ] ClickSignProvider implementado
- [ ] DocuSignProvider implementado (opcional)
- [ ] ESignatureService com strategy pattern
- [ ] Testes unitários

---

### Sprint 3.2: Testing & Quality (1 semana)

#### 3.2.1. Testes E2E Completos (3 dias)

**Fluxos a testar**:

1. **Fluxo de Autenticação**:
   - [ ] Registro de empresa
   - [ ] Verificação de email
   - [ ] Login com credenciais válidas
   - [ ] Login com credenciais inválidas (account lockout)
   - [ ] Recuperação de senha
   - [ ] Alteração de senha

2. **Fluxo de Certificação Completo**:
   - [ ] Empresa cria solicitação
   - [ ] Upload de documentos
   - [ ] Analista é atribuído automaticamente
   - [ ] Analista analisa documentos
   - [ ] Proposta comercial gerada
   - [ ] Contrato criado e enviado para assinatura
   - [ ] Auditoria agendada
   - [ ] Auditoria executada (checklist)
   - [ ] Decisão do comitê (aprovação)
   - [ ] Certificado emitido

3. **Fluxo de Gestão**:
   - [ ] Admin cria usuários (analista, auditor, gestor)
   - [ ] Gestor visualiza dashboard
   - [ ] Gestor atribui processos
   - [ ] Analista visualiza processos atribuídos no Kanban

**Checklist**:
- [ ] Testes E2E de autenticação (100% dos casos)
- [ ] Testes E2E do fluxo completo de certificação
- [ ] Testes E2E de gestão de usuários
- [ ] Testes E2E de upload/download de arquivos
- [ ] Coverage > 80% (unitário + E2E)

---

#### 3.2.2. Performance Testing (2 dias)

**Setup k6**:
```bash
npm install -g k6
```

**Script de Load Test**:
```javascript
// test/load/login.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100, // 100 virtual users
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requests < 500ms
    http_req_failed: ['rate<0.01'],   // Taxa de erro < 1%
  },
};

export default function () {
  const res = http.post('http://localhost:3333/api/auth/login', JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });

  sleep(1);
}
```

**Executar testes**:
```bash
# Login endpoint
k6 run test/load/login.js

# Process creation
k6 run test/load/create-process.js

# Dashboard load
k6 run test/load/dashboard.js
```

**Métricas esperadas**:
- P95 latency < 500ms
- P99 latency < 1s
- Throughput > 800 req/s (vs 1000 req/s do Fastify puro)
- Error rate < 0.1%
- Memory usage estável (< 250MB)

**Checklist**:
- [ ] Load tests criados para endpoints principais
- [ ] Performance comparado com Fastify atual
- [ ] P95 latency < 500ms
- [ ] Throughput > 800 req/s
- [ ] Memory usage estável
- [ ] Zero memory leaks detectados

---

### Checklist Completo Fase 3

**Serviços Compartilhados**:
- [ ] EmailService migrado
- [ ] StorageService migrado (S3 + IAM Role)
- [ ] PdfService migrado (Puppeteer)
- [ ] AiService migrado (Anthropic)
- [ ] E-SignatureService migrado (D4Sign, Clicksign, DocuSign)
- [ ] Todos os services testados

**Testing & Quality**:
- [ ] Testes E2E completos (3 fluxos principais)
- [ ] Coverage > 80%
- [ ] Performance testing (k6)
- [ ] P95 latency < 500ms
- [ ] Throughput > 800 req/s
- [ ] Zero memory leaks
- [ ] Linter sem warnings
- [ ] TypeScript sem erros

---

## 🗓️ FASE 4: Deploy e Validação (1 semana)

### Objetivos
- Deploy do NestJS em staging
- User Acceptance Testing (UAT)
- Performance validation em ambiente real
- Deploy em production

---

### Sprint 4.1: Deploy Staging (2 dias)

#### 4.1.1. Build e Docker (1 dia)

**Criar Dockerfile**:
```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build
RUN npx prisma generate

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3333

CMD ["node", "dist/main.js"]
```

**Build e Push para ECR**:
```bash
# Build
docker build -t halalsphere-backend-nest:latest .

# Tag para ECR
docker tag halalsphere-backend-nest:latest <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-nestjs:latest

# Push
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-nestjs:latest
```

**Checklist**:
- [ ] Dockerfile criado
- [ ] Image size < 300MB
- [ ] Security scan passando (Trivy)
- [ ] Image no ECR

---

#### 4.1.2. Deploy ECS Staging (1 dia)

**Atualizar Terraform**:
```hcl
# terraform/modules/ecs/main.tf
# Adicionar Task Definition para NestJS
resource "aws_ecs_task_definition" "nestjs" {
  family                   = "halalsphere-nestjs-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([{
    name  = "nestjs"
    image = "${var.ecr_repository_url}:latest"

    portMappings = [{
      containerPort = 3333
      protocol      = "tcp"
    }]

    environment = [
      { name = "NODE_ENV", value = var.environment }
    ]

    secrets = [
      { name = "DATABASE_URL", valueFrom = "arn:aws:secretsmanager:${var.region}:${var.account_id}:secret:SQL_HALALSPHERE_CONNECTION" }
      { name = "JWT_PUBLIC_KEY", valueFrom = "arn:aws:secretsmanager:${var.region}:${var.account_id}:secret:JWT_PUBLIC_KEY_HALALSPHERE_API" }
      { name = "JWT_PRIVATE_KEY", valueFrom = "arn:aws:secretsmanager:${var.region}:${var.account_id}:secret:JWT_PRIVATE_KEY_HALALSPHERE_API" }
    ]

    healthCheck = {
      command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3333/health/live || exit 1"]
      interval    = 30
      timeout     = 5
      retries     = 3
      startPeriod = 60
    }

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = "/ecs/halalsphere-nestjs"
        awslogs-region        = var.region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
}

# Criar ECS Service para NestJS (staging)
resource "aws_ecs_service" "nestjs_staging" {
  name            = "halalsphere-nestjs-staging"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.nestjs.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.nestjs_staging.arn
    container_name   = "nestjs"
    container_port   = 3333
  }
}
```

**Deploy**:
```bash
cd terraform/environments/staging
terraform workspace select staging
terraform apply
```

**Checklist**:
- [ ] Terraform atualizado para NestJS
- [ ] Secrets configurados no AWS Secrets Manager
- [ ] IAM Role com permissões corretas (S3, Secrets Manager)
- [ ] ECS Task Definition criada
- [ ] ECS Service rodando 2 tasks
- [ ] Health checks passando
- [ ] NestJS acessível via staging URL

---

### Sprint 4.2: UAT e Validação (3 dias)

#### 4.2.1. User Acceptance Testing (2 dias)

**Checklist UAT**:

**Autenticação**:
- [ ] Registro de empresa funciona
- [ ] Email de verificação recebido
- [ ] Login com credenciais válidas
- [ ] Recuperação de senha funciona

**Fluxo de Certificação**:
- [ ] Empresa cria solicitação (wizard 9 etapas)
- [ ] Upload de documentos funciona
- [ ] Analista recebe processo automaticamente
- [ ] Analista move processo no Kanban
- [ ] Solicitação de documentos funciona
- [ ] Proposta comercial gerada corretamente
- [ ] Contrato criado e PDF gerado
- [ ] E-signature funcionando (testar D4Sign)
- [ ] Auditoria agendada
- [ ] Auditoria executada (checklist completo)
- [ ] Decisão do comitê funciona
- [ ] Certificado PDF gerado corretamente

**Gestão**:
- [ ] Dashboard gestor com métricas corretas
- [ ] Admin cria usuários
- [ ] Atribuição de processos funciona

**Performance**:
- [ ] Páginas carregam < 2s
- [ ] Upload de arquivos < 5s
- [ ] Dashboard atualiza em tempo real
- [ ] Sem erros no console do browser

**Checklist**:
- [ ] UAT completo com stakeholders
- [ ] Todos os fluxos testados
- [ ] Bugs críticos resolvidos
- [ ] Performance aceitável
- [ ] Aprovação dos stakeholders

---

#### 4.2.2. Performance Validation (1 dia)

**Load Test em Staging**:
```bash
# Executar k6 contra staging
k6 run --vus 100 --duration 10m test/load/full-flow.js
```

**Métricas esperadas (staging)**:
- P95 latency < 500ms
- P99 latency < 1s
- Error rate < 0.1%
- Memory usage < 250MB
- CPU usage < 70%

**CloudWatch Monitoring**:
- [ ] Verificar métricas ECS (CPU, Memory)
- [ ] Verificar logs de erros
- [ ] Verificar latência média
- [ ] Verificar throughput

**Checklist**:
- [ ] Load tests executados em staging
- [ ] Performance dentro do esperado
- [ ] Zero memory leaks detectados
- [ ] Logs estruturados funcionando
- [ ] Alarms não disparados

---

### Sprint 4.3: Deploy Production (2 dias)

#### 4.3.1. Preparação Production (1 dia)

**Checklist de Pré-Deploy**:
- [ ] Todos os secrets criados no Secrets Manager (prod)
- [ ] IAM Roles configurados
- [ ] RDS PostgreSQL pronto (prod)
- [ ] ElastiCache Redis pronto (prod)
- [ ] S3 buckets criados (prod)
- [ ] CloudFront configurado
- [ ] API Gateway configurado
- [ ] VPC Link conectado
- [ ] Route53 DNS configurado
- [ ] Alarms configurados
- [ ] SNS topics para notificações
- [ ] Backup automático configurado (RDS)

**Gerar chaves JWT RS256 para produção**:
```bash
# Gerar par de chaves
openssl genrsa -out jwt_private_prod.key 2048
openssl rsa -in jwt_private_prod.key -pubout -out jwt_public_prod.key

# Converter para base64
cat jwt_private_prod.key | base64 > jwt_private_prod_base64.txt
cat jwt_public_prod.key | base64 > jwt_public_prod_base64.txt

# Armazenar no AWS Secrets Manager
aws secretsmanager create-secret \
  --name JWT_PRIVATE_KEY_HALALSPHERE_API \
  --secret-string "$(cat jwt_private_prod.key)" \
  --region us-east-1

aws secretsmanager create-secret \
  --name JWT_PUBLIC_KEY_HALALSPHERE_API \
  --secret-string "$(cat jwt_public_prod.key)" \
  --region us-east-1
```

**Checklist**:
- [ ] Secrets criados (prod)
- [ ] Chaves JWT geradas e armazenadas
- [ ] Infraestrutura validada
- [ ] Runbook de deploy criado
- [ ] Rollback plan documentado

---

#### 4.3.2. Deploy Production (1 dia)

**Deploy**:
```bash
# Build image
docker build -t halalsphere-nestjs:prod .

# Tag e push para ECR
docker tag halalsphere-nestjs:prod <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-nestjs:prod
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-nestjs:prod

# Deploy via Terraform
cd terraform/environments/prod
terraform workspace select prod
terraform apply

# Ou via ECS CLI
aws ecs update-service \
  --cluster halalsphere-cluster-prod \
  --service halalsphere-nestjs-prod \
  --force-new-deployment \
  --region us-east-1

# Monitorar deploy
aws ecs describe-services \
  --cluster halalsphere-cluster-prod \
  --services halalsphere-nestjs-prod \
  --region us-east-1
```

**Smoke Tests Pós-Deploy**:
```bash
# Health check
curl https://api.halalsphere.com/health/live
curl https://api.halalsphere.com/health/ready

# Login test
curl -X POST https://api.halalsphere.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Swagger UI
open https://api.halalsphere.com/api/docs
```

**Monitoramento 24h**:
- [ ] Verificar logs em tempo real (CloudWatch)
- [ ] Verificar métricas (CPU, Memory, Latency)
- [ ] Verificar alarms (nenhum disparado)
- [ ] Verificar error rate (< 0.1%)
- [ ] Realizar smoke tests a cada 6h

**Checklist**:
- [ ] Image de produção no ECR
- [ ] ECS tasks rodando em production
- [ ] Health checks passando
- [ ] API acessível via https://api.halalsphere.com
- [ ] Frontend conectando corretamente
- [ ] Smoke tests passando
- [ ] Zero erros críticos
- [ ] Monitoramento 24h confirmado estável

---

### Checklist Completo Fase 4

**Staging**:
- [ ] Dockerfile criado
- [ ] Image no ECR (staging)
- [ ] ECS tasks rodando (staging)
- [ ] UAT completo e aprovado
- [ ] Performance validated (staging)

**Production**:
- [ ] Secrets configurados (prod)
- [ ] Chaves JWT geradas (prod)
- [ ] Image no ECR (prod)
- [ ] ECS tasks rodando (prod)
- [ ] Health checks passando (prod)
- [ ] API acessível (prod)
- [ ] Frontend conectando (prod)
- [ ] Smoke tests passando (prod)
- [ ] Sistema estável por 48h
- [ ] Zero critical bugs

**Validação Final**:
- [ ] Todos os 80+ endpoints funcionando
- [ ] Performance P95 < 500ms
- [ ] Error rate < 0.1%
- [ ] Uptime 99.9%
- [ ] Aprovação final dos stakeholders

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs da Migração

| Métrica | Baseline Fastify | Target NestJS | Status |
|---------|------------------|---------------|--------|
| **Performance** | | | |
| P95 Latency | 200ms | < 250ms (+25% ok) | ⏳ |
| Throughput | 1000 req/s | > 800 req/s | ⏳ |
| Memory Usage | 150MB | < 250MB | ⏳ |
| **Quality** | | | |
| Test Coverage | ~40% | > 80% | ⏳ |
| Bugs em Prod | - | 0 críticos/mês | ⏳ |
| **Developer** | | | |
| Build Time | 30s | < 45s | ⏳ |
| Hot Reload | ~2s | < 3s | ⏳ |
| Onboarding Time | 2 semanas | 1 semana | ⏳ |

---

## ⚠️ RISCOS E MITIGAÇÕES

### Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Mudanças de infra AWS atrasam início** | Média | Alto | Fase 0 dedicada; 1 semana buffer |
| **Performance inferior ao Fastify** | Baixa | Alto | Fastify adapter mantém 95% performance |
| **Breaking changes em APIs** | Baixa | Crítico | Manter 100% paridade; contract testing |
| **Bugs em produção** | Média | Alto | UAT rigoroso; staging validation |
| **Atraso no cronograma** | Média | Médio | 2 semanas buffer; priorizar módulos críticos |
| **Resistance da equipe** | Baixa | Médio | Training; pair programming |
| **RS256 complexidade** | Baixa | Médio | Documentação clara; templates prontos |

---

## 📅 TIMELINE ATUALIZADO

### Visão Geral (10-12 semanas)

```
┌─────────────────────────────────────────────────────────┐
│  Semana 1  │ Fase 0: Ajustes AWS + Preparação          │
├─────────────────────────────────────────────────────────┤
│ Semanas 2-3│ Fase 1: Setup NestJS + Core + Auth        │
├─────────────────────────────────────────────────────────┤
│ Semanas 4-8│ Fase 2: Migração de Módulos (13 módulos)  │
├─────────────────────────────────────────────────────────┤
│ Semanas 9-10│ Fase 3: Serviços + Testing              │
├─────────────────────────────────────────────────────────┤
│ Semana 11  │ Fase 4: Deploy e Validação                │
├─────────────────────────────────────────────────────────┤
│ Semana 12  │ Buffer + Polish                           │
└─────────────────────────────────────────────────────────┘
```

### Cronograma Detalhado

| Semana | Fase | Foco Principal | Entregáveis |
|--------|------|----------------|-------------|
| **1** | Fase 0 | Ajustes AWS | ConfigLoader atualizado, JWT RS256, Storage IAM Role |
| **2** | Fase 1.1 | Setup NestJS | Projeto criado, Prisma, Config, Core infrastructure |
| **3** | Fase 1.2 | Auth + Health | Auth module completo (8 endpoints), Health checks |
| **4** | Fase 2.1 | Módulos Simples | industrial-classification, storage-config, comment |
| **5** | Fase 2.2 | Módulos Médios | document-request, users/admin |
| **6** | Fase 2.3 | Módulos Core | **process** (core business) |
| **7** | Fase 2.4 | Módulos Alta | **proposal** (16 endpoints) |
| **8** | Fase 2.5 | Módulos Alta | **contract**, audit-schedule |
| **9** | Fase 3.1 | Serviços | Email, Storage, PDF, AI, E-Signature |
| **10** | Fase 3.2 | Testing | E2E tests, Performance tests, Coverage >80% |
| **11** | Fase 4 | Deploy | Staging + UAT + Production deploy |
| **12** | Buffer | Polish | Ajustes finais, documentação, retrospectiva |

---

## 👥 RECURSOS E EQUIPE

### Equipe Recomendada

| Role | Quantidade | Dedicação | Responsabilidades |
|------|------------|-----------|-------------------|
| **Backend Lead** | 1 | Full-time | Arquitetura, code review, decisões técnicas, Fase 0 |
| **Backend Devs** | 2-3 | Full-time | Migração de módulos, services, testes |
| **DevOps Engineer** | 1 | 50% (Fases 0 e 4) | AWS updates, secrets, deploy ECS |
| **QA Engineer** | 1 | 50% (Fases 3 e 4) | Testes E2E, UAT, validação |
| **Product Owner** | 1 | 20% | Priorização, aceite |

**Total**: ~4 FTE (Full-Time Equivalent)

### Alocação por Fase

| Fase | Backend Lead | Backend Devs | DevOps | QA |
|------|--------------|--------------|--------|-----|
| Fase 0 (1 sem) | 100% | 1 pessoa, 100% | 100% | - |
| Fase 1 (2 sem) | 100% | 2-3 pessoas, 100% | 20% | - |
| Fase 2 (5 sem) | 100% | 2-3 pessoas, 100% | - | 20% |
| Fase 3 (2 sem) | 100% | 2-3 pessoas, 100% | - | 80% |
| Fase 4 (1 sem) | 100% | 2 pessoas, 100% | 100% | 100% |

---

## 📚 DOCUMENTAÇÃO E TREINAMENTO

### Documentos Criados/Atualizados

**Durante Fase 0**:
- [ ] [CONFIGLOADER-UPDATE-GUIDE.md](../ARCHITECTURE/CONFIGLOADER-UPDATE-GUIDE.md) ✅ Já existe
- [ ] [AWS-INFRA-CHANGES-2026.md](../ARCHITECTURE/AWS-INFRA-CHANGES-2026.md) ✅ Já existe
- [ ] Runbook de deploy
- [ ] .env.example atualizado

**Durante Migração**:
- [ ] NestJS migration guide
- [ ] Code style guide (NestJS + TypeScript)
- [ ] Onboarding guide (novos devs)
- [ ] Testing strategy document
- [ ] Performance benchmarks
- [ ] API documentation (Swagger JSON)

**Após Deploy**:
- [ ] Operations manual
- [ ] Troubleshooting guide
- [ ] Disaster recovery plan
- [ ] Retrospectiva da migração

### Treinamentos Recomendados

**Antes de Iniciar**:
1. **NestJS Fundamentals** (16h online) - Backend team
   - Modules, Controllers, Services
   - Dependency Injection
   - Guards, Interceptors, Pipes
   - Testing (@nestjs/testing)
   - Recursos: [NestJS Official Docs](https://docs.nestjs.com/)

2. **JWT RS256 (Asymmetric)** (2h) - Backend team
   - Diferenças HS256 vs RS256
   - Geração de chaves RSA
   - Verificação de tokens
   - Best practices de segurança

**Durante Migração**:
1. **Pair Programming Sessions** - Todas as semanas
   - Migração de módulo complexo juntos
   - Code review coletivo
   - Compartilhamento de conhecimento

2. **Weekly Tech Talks** (1h/semana)
   - Patterns aprendidos
   - Challenges superados
   - Best practices identificados

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### Esta Semana (Semana 1 - Fase 0)

#### Segunda-feira
- [ ] Reunião de kickoff (1h)
  - Apresentar este plano atualizado
  - Alinhar expectativas
  - Definir working agreements
- [ ] Alocar equipe (Backend Lead + 1 Dev + DevOps)
- [ ] Setup canais de comunicação (Slack #nestjs-migration)

#### Terça a Quinta (3 dias)
- [ ] Implementar ConfigLoader atualizado (novos secrets)
- [ ] Implementar JWT RS256 (gerar chaves, atualizar AuthService)
- [ ] Atualizar Storage Manager (remover AWS credentials, usar IAM Role)
- [ ] Testar localmente (validar tudo funcionando 100%)

#### Sexta-feira
- [ ] Code review das mudanças AWS
- [ ] Merge para branch `feature/aws-updates`
- [ ] Documentar endpoints existentes (preparar para Fase 1)
- [ ] Criar branch `feature/nestjs-migration`

### Próxima Semana (Semana 2 - Fase 1.1)

- [ ] Criar projeto NestJS
- [ ] Instalar Fastify adapter
- [ ] Configurar Prisma
- [ ] Implementar ConfigModule
- [ ] Implementar Guards e Decorators
- [ ] Primeira reunião de progresso (sexta-feira)

---

## 📝 CHECKLIST FINAL DE MIGRAÇÃO

### Pré-Migration
- [ ] Fastify funcionando 100% (baseline)
- [ ] Ajustes AWS implementados (Fase 0)
- [ ] JWT RS256 funcionando
- [ ] ConfigLoader atualizado
- [ ] Storage Manager com IAM Role
- [ ] Todos os 80+ endpoints documentados
- [ ] Testes de regressão criados (Postman)
- [ ] Branch `feature/nestjs-migration` criada

### Durante Migration
- [ ] Projeto NestJS criado e configurado
- [ ] Core infrastructure implementada (Guards, Decorators, etc.)
- [ ] Auth module migrado (8 endpoints)
- [ ] Health checks funcionando
- [ ] Todos os 13 módulos migrados
- [ ] Serviços compartilhados migrados (Email, Storage, PDF, AI, E-Signature)
- [ ] Testes unitários > 80% coverage
- [ ] Testes E2E dos fluxos principais
- [ ] Performance testing (k6)
- [ ] Code reviews completos

### Pós-Migration
- [ ] Deploy em staging validado
- [ ] UAT completo e aprovado
- [ ] Performance em staging validado (P95 < 500ms)
- [ ] Deploy em production realizado
- [ ] Smoke tests em production passando
- [ ] Sistema estável por 48h
- [ ] Zero critical bugs
- [ ] Documentação atualizada
- [ ] Retrospectiva realizada
- [ ] Fastify descomissionado (após 7 dias estável)

---

## 🏁 CONCLUSÃO

### Situação Atual
- ✅ **Backend 95% implementado** - Sistema funcional completo
- ✅ **Frontend 100% pronto** - Esperando backend em produção
- ✅ **Documentação 100%** - 211 arquivos no GitHub Pages
- ⚠️ **Ajustes AWS pendentes** - ConfigLoader, JWT RS256, IAM Roles

### Por Que Migrar Agora?
1. **Timing perfeito**: Sistema implementado, mas ainda não em produção
2. **Evita refatoração futura**: Melhor migrar antes de produção
3. **Padrões de mercado**: NestJS é padrão, facilita onboarding
4. **DX superior**: Dependency Injection, Decorators, Testing integrado
5. **Mantém performance**: Fastify adapter preserva 95% da velocidade

### Plano Atualizado
- **Duração**: 10-12 semanas (vs 16-20 do plano anterior)
- **Abordagem**: Big Bang (reescrita paralela) ao invés de Strangler
- **Equipe**: 4 FTE (Backend Lead + 2-3 Devs + DevOps part-time + QA part-time)
- **Fases**: 0 (Ajustes AWS) → 1 (Setup+Core) → 2 (Módulos) → 3 (Serviços+Testing) → 4 (Deploy)

### Benefícios Esperados
- ✅ Código mais organizado e manutenível
- ✅ Onboarding reduzido (2 semanas → 1 semana)
- ✅ Testes integrados (coverage > 80%)
- ✅ Performance similar (95% do Fastify)
- ✅ Ecosystem rico (integrações oficiais)
- ✅ Padrões de mercado (DI, Decorators)

### Riscos Mitigados
- ✅ **Ajustes AWS** têm Fase 0 dedicada + documentação completa
- ✅ **Performance** garantida com Fastify adapter
- ✅ **Paridade funcional** garantida com testes E2E
- ✅ **Cronograma** tem 2 semanas de buffer

### Próxima Ação
**INICIAR FASE 0 (Semana 1)**: Implementar ajustes AWS (ConfigLoader, JWT RS256, Storage IAM Role)

**Status**: ✅ **Pronto para iniciar**

---

**Documento atualizado**: 14 de Janeiro de 2026
**Versão**: 2.0 (Atualizada com contexto atual)
**Próxima revisão**: Após Fase 1 (Semana 3)
**Mantenedor**: Backend Lead
