# Plano de Deploy: AWS ECS Fargate com Spot Instances

> **DEPLOY CONCLUIDO** - O sistema esta em producao na AWS desde 23/01/2026.
> Backend em ECS Fargate, Frontend em S3 + CloudFront, CI/CD via CodePipeline.
> Este documento e mantido como registro historico do planejamento. Alguns exemplos
> de codigo referenciam Fastify (stack anterior), mas o deploy real usa NestJS + Express.

**Projeto**: HalalSphere
**Data**: 2026-01-12
**Ambiente Alvo**: AWS ECS Fargate + S3 + CloudFront
**Arquitetura**: Serverless Frontend + Containerized Backend

---

## 📊 Análise do Estado Atual

### Ambiente Atual (Local/Development)

**Infraestrutura:**
- Backend: Node.js rodando localmente (não containerizado)
- Frontend: React/Vite rodando localmente (não containerizado)
- PostgreSQL: Container Docker (pgvector/pgvector:pg16)
- Redis: Container Docker (redis:7-alpine)
- Uploads: File system local (`./uploads`)

**Problemas para Produção:**
- ❌ Backend não containerizado
- ❌ Frontend não otimizado para CDN
- ❌ Uploads em disco local (efêmero em containers)
- ❌ Sem graceful shutdown
- ❌ Banco/Redis em containers (não gerenciados)
- ❌ Secrets em .env hardcoded
- ❌ Sem observabilidade centralizada
- ❌ Sem auto-scaling
- ❌ Sem infraestrutura como código
- ❌ API não exposta via API Gateway

---

## 🎯 Arquitetura Alvo (AWS)

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USUÁRIOS (Browser/Mobile)                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────────┐
│                         Route 53 (DNS)                               │
│                                                                       │
│  halalsphere.com        →  CloudFront (Frontend)                     │
│  api.halalsphere.com    →  API Gateway (Backend)                     │
└─────────────┬─────────────────────────────┬───────────────────────── ┘
              │                             │
    ┌─────────▼────────────┐    ┌───────────▼────────────────────────┐
    │  CloudFront (CDN)    │    │   API Gateway (REST)                │
    │                      │    │                                      │
    │  - React SPA Build   │    │  - Swagger/OpenAPI 3.0              │
    │  - Global Edge Cache │    │  - Rate Limiting (100 req/min)      │
    │  - HTTPS (ACM)       │    │  - API Keys Management              │
    │  - Gzip/Brotli       │    │  - CORS                             │
    │  - Custom errors     │    │  - Request/Response Validation      │
    └──────────┬───────────┘    │  - CloudWatch Logs                  │
               │                │  - X-Ray Tracing                    │
               │                │  - WAF (optional)                   │
               │                └────────────┬────────────────────────┘
               │                             │
       ┌───────▼──────┐                     │
       │   S3 Bucket  │              ┌──────▼───────────────────────┐
       │  (Frontend)  │              │  VPC Link (Private)          │
       │              │              │  - Connects API GW to VPC    │
       │  - Static    │              └──────┬───────────────────────┘
       │    Assets    │                     │
       │  - index.html│              ┌──────▼───────────────────────┐
       │  - js/css    │              │  Network Load Balancer (NLB) │
       │  - images    │              │  - Internal only             │
       │              │              │  - TCP passthrough           │
       └──────────────┘              └──────┬───────────────────────┘
                                            │
                                ┌───────────▼─────────────────────────┐
                                │    ECS Fargate Cluster (Private)   │
                                │                                     │
                                │  ┌──────────────────────────────┐  │
                                │  │  Backend Service             │  │
                                │  │                              │  │
                                │  │  ┌────────────────────────┐ │  │
                                │  │  │  Task 1 (Spot)         │ │  │
                                │  │  │  - Node.js Backend     │ │  │
                                │  │  │  - Port 3333           │ │  │
                                │  │  └────────────────────────┘ │  │
                                │  │                              │  │
                                │  │  ┌────────────────────────┐ │  │
                                │  │  │  Task 2 (On-Demand)    │ │  │
                                │  │  │  - Node.js Backend     │ │  │
                                │  │  │  - Port 3333           │ │  │
                                │  │  └────────────────────────┘ │  │
                                │  │                              │  │
                                │  │  Desired: 2                  │  │
                                │  │  Min: 1, Max: 10             │  │
                                │  │  Auto-scaling (CPU/Memory)   │  │
                                │  └──────────────────────────────┘  │
                                └─────────────┬───────────────────────┘
                                              │
┌─────────────────────────────────────────────┴───────────────────────┐
│                     Managed Services (VPC)                           │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐      │
│  │  RDS Postgres  │  │ ElastiCache    │  │      S3          │      │
│  │   (Primary)    │  │    Redis       │  │  - Uploads       │      │
│  │   Multi-AZ     │  │  Cluster Mode  │  │  - Documents     │      │
│  │   Read Replica │  │                │  │  - Backups       │      │
│  └────────────────┘  └────────────────┘  └──────────────────┘      │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐      │
│  │ Secrets Mgr    │  │  CloudWatch    │  │   X-Ray          │      │
│  │  - DB creds    │  │  - Logs        │  │  - Tracing       │      │
│  │  - API keys    │  │  - Metrics     │  │  - Debugging     │      │
│  │  - JWT secret  │  │  - Alarms      │  │                  │      │
│  └────────────────┘  └────────────────┘  └──────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```

### Fluxo de Requisições

**Frontend (Estático):**
```
User → Route53 (halalsphere.com)
     → CloudFront Edge Location
     → S3 Bucket (React build)
     → Response cached at edge
```

**Backend (API):**
```
User → Route53 (api.halalsphere.com)
     → API Gateway (Validação, Rate Limit, Auth)
     → VPC Link (Private Connection)
     → Network Load Balancer (Internal)
     → ECS Fargate Tasks (Backend containers)
     → Response + Logs/Metrics
```

### Custos Estimados (Mensais)

| Serviço | Tipo | Custo Aprox. |
|---------|------|--------------|
| **Frontend (Serverless)** | | |
| S3 Hosting | Standard (5GB) | ~$0.12 |
| CloudFront | 50GB transfer | ~$4.25 |
| Route 53 | Hosted zone | ~$0.50 |
| **Backend (Compute)** | | |
| ECS Fargate Spot (2 tasks) | 0.5 vCPU, 1GB RAM | ~$15 |
| API Gateway | 1M requests | ~$3.50 |
| VPC Link | NLB hours | ~$16 |
| **Database** | | |
| RDS PostgreSQL (db.t4g.small) | Multi-AZ | ~$50 |
| RDS Read Replica (opcional) | db.t4g.small | ~$25 |
| **Cache** | | |
| ElastiCache Redis (cache.t4g.micro) | Single node | ~$15 |
| **Storage** | | |
| S3 (100GB uploads) | Standard | ~$3 |
| EBS Snapshots (backups) | 50GB | ~$2.50 |
| **Network** | | |
| Data Transfer Out | 100GB | ~$9 |
| NAT Gateway | 2 AZs | ~$60 |
| **Outros** | | |
| CloudWatch Logs (10GB) | | ~$5 |
| X-Ray Tracing | 1M traces | ~$5 |
| Secrets Manager | 5 secrets | ~$2 |
| WAF (opcional) | Basic rules | ~$10 |
| ACM Certificates | | Free |
| **TOTAL sem Read Replica** | | **~$201/mês** |
| **TOTAL com Read Replica** | | **~$226/mês** |

**Economia com Spot**: ~60% vs. On-Demand (savings de ~$50/mês no compute)

**Comparado com ALB (plano anterior):**
- Removido: ALB (~$20), Frontend containers (~$7), Nginx
- Adicionado: API Gateway (~$3.50), VPC Link (~$16), CloudFront (~$4.25)
- **Economia total: ~$13/mês** + melhor performance global

---

## 🚀 Fases de Implementação

### **FASE 1: Containerização do Backend (3 dias)**

#### Objetivos
- Criar Dockerfile otimizado para backend
- Build multi-stage
- Image < 300MB
- Security scanning

#### 1.1. Backend Dockerfile

```dockerfile
# backend/Dockerfile
# ====================================
# Stage 1: Dependencies
# ====================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Generate Prisma Client
RUN npx prisma generate

# ====================================
# Stage 2: Build
# ====================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY src ./src
COPY prisma ./prisma

# Build TypeScript
RUN npm run build

# ====================================
# Stage 3: Production
# ====================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy production dependencies from stage 1
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=dependencies --chown=nodejs:nodejs /app/prisma ./prisma

# Copy built application from stage 2
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Copy startup script
COPY --chown=nodejs:nodejs docker-entrypoint.sh ./

# Make entrypoint executable
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Use dumb-init to handle signals properly (for graceful shutdown)
ENTRYPOINT ["dumb-init", "--"]

# Run entrypoint script
CMD ["./docker-entrypoint.sh"]
```

#### 1.2. Backend Entrypoint Script

```bash
#!/bin/sh
# backend/docker-entrypoint.sh

set -e

echo "🚀 Starting HalalSphere Backend..."

# Run Prisma migrations (only if AUTO_MIGRATE=true)
if [ "$AUTO_MIGRATE" = "true" ]; then
  echo "📦 Running Prisma migrations..."
  npx prisma migrate deploy
fi

# Generate Prisma Client (defensive)
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Start application
echo "✅ Starting Node.js server..."
exec node dist/server.js
```

#### 1.3. .dockerignore

```
# backend/.dockerignore
node_modules
dist
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
*.md
uploads/
.vscode
.idea
coverage
.nyc_output
**/*.test.ts
**/*.spec.ts
scripts/
```

#### 1.4. Docker Compose para Teste Local

```yaml
# docker-compose.prod-test.yml
version: '3.9'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3333:3333"
    environment:
      DATABASE_URL: postgresql://admin:secret123@postgres:5432/halalsphere
      REDIS_URL: redis://redis:6379
      JWT_SECRET: test-secret-key
      NODE_ENV: production
      AUTO_MIGRATE: "true"
      # API Gateway sends x-forwarded headers
      TRUST_PROXY: "true"
    depends_on:
      - postgres
      - redis
    networks:
      - halalsphere-network
    restart: unless-stopped

  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: halalsphere
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - halalsphere-network

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - halalsphere-network

networks:
  halalsphere-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

#### Checklist Fase 1

- [ ] Backend Dockerfile criado e testado
- [ ] Entrypoint script criado
- [ ] .dockerignore configurado
- [ ] docker-compose.prod-test.yml funcionando
- [ ] Image buildando com sucesso
- [ ] Health check respondendo
- [ ] Security scan passando (Trivy/Snyk)
- [ ] Image < 300MB

---

### **FASE 2: Frontend para S3 + CloudFront (2 dias)**

#### Objetivos
- Build otimizado do React/Vite para produção
- Deploy estático no S3
- CloudFront com cache otimizado
- HTTPS via ACM

#### 2.1. Build Script do Frontend

```json
// frontend/package.json - adicionar scripts
{
  "scripts": {
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "preview": "vite preview"
  }
}
```

#### 2.2. Configuração de Ambiente

```typescript
// frontend/.env.production
VITE_API_URL=https://api.halalsphere.com
VITE_API_GATEWAY_KEY=your-api-gateway-key
VITE_ENV=production

// frontend/.env.staging
VITE_API_URL=https://staging-api.halalsphere.com
VITE_API_GATEWAY_KEY=your-staging-api-gateway-key
VITE_ENV=staging
```

#### 2.3. Vite Config Otimizado

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: './dist/stats.html' }), // Bundle analyzer
  ],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for security
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Code splitting for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
});
```

#### 2.4. S3 Sync Script

```bash
#!/bin/bash
# frontend/scripts/deploy-s3.sh

set -e

ENVIRONMENT=$1
BUCKET_NAME=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$BUCKET_NAME" ]; then
  echo "Usage: ./deploy-s3.sh <environment> <bucket-name>"
  echo "Example: ./deploy-s3.sh production halalsphere-frontend-prod"
  exit 1
fi

echo "🏗️  Building frontend for $ENVIRONMENT..."
npm run build:$ENVIRONMENT

echo "📦 Syncing to S3 bucket: $BUCKET_NAME..."

# Upload HTML files (no cache, always revalidate)
aws s3 sync dist/ s3://$BUCKET_NAME/ \
  --delete \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE

# Upload JS/CSS with long cache (immutable, content-hashed)
aws s3 sync dist/ s3://$BUCKET_NAME/ \
  --delete \
  --exclude "*.html" \
  --cache-control "public, max-age=31536000, immutable" \
  --metadata-directive REPLACE

echo "🔄 Creating CloudFront invalidation..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$BUCKET_NAME')].Id" \
  --output text)

if [ -n "$DISTRIBUTION_ID" ]; then
  aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"
  echo "✅ CloudFront cache invalidated"
else
  echo "⚠️  CloudFront distribution not found"
fi

echo "✅ Frontend deployed successfully!"
```

#### Checklist Fase 2

- [ ] Vite config otimizado
- [ ] Environment variables configuradas
- [ ] Build production gerando < 2MB (gzipped)
- [ ] Code splitting funcionando
- [ ] S3 bucket criado com políticas corretas
- [ ] CloudFront distribution criada
- [ ] ACM certificate provisionado
- [ ] Deploy script testado
- [ ] Cache headers corretos

---

### **FASE 3: Graceful Shutdown & Resiliência (2 dias)**

#### Objetivos
- Implementar tratamento de sinais (SIGTERM/SIGINT)
- Drenagem de conexões
- Health checks (liveness + readiness)

#### 3.1. Graceful Shutdown (Backend)

```typescript
// backend/src/server.ts - Adicionar no final

let isShuttingDown = false;

// Handle graceful shutdown
async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    fastify.log.warn('Shutdown already in progress, forcing exit...');
    process.exit(1);
  }

  isShuttingDown = true;

  fastify.log.info(`\n🛑 Received ${signal}, starting graceful shutdown...`);

  // Set timeout for forced shutdown (30 seconds)
  const forceShutdownTimer = setTimeout(() => {
    fastify.log.error('⏱️  Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, 30000);

  try {
    // 1. Stop accepting new connections
    fastify.log.info('⏸️  Stopping new connections...');
    await fastify.close();

    // 2. Close database connections
    fastify.log.info('💾 Closing database connections...');
    await prisma.$disconnect();

    // 3. Close Redis connections (if applicable)
    if (redisClient) {
      fastify.log.info('🗄️  Closing Redis connections...');
      await redisClient.quit();
    }

    // 4. Flush logs
    fastify.log.info('📝 Flushing logs...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    clearTimeout(forceShutdownTimer);
    fastify.log.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    fastify.log.error({ err: error }, '❌ Error during shutdown');
    process.exit(1);
  }
}

// Register signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // ECS/ELB sends this
process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Ctrl+C locally

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  fastify.log.error({ err: error }, '💥 Uncaught exception');
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  fastify.log.error({ reason, promise }, '💥 Unhandled rejection');
  gracefulShutdown('unhandledRejection');
});

// Start server (existing code)
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = Number(process.env.PORT) || 3333;
    const host = '0.0.0.0';

    await fastify.listen({ port, host });

    fastify.log.info(`🚀 Server running on http://localhost:${port}`);
    fastify.log.info(`📚 API Docs: http://localhost:${port}/docs`);
    fastify.log.info(`🔐 Environment: ${process.env.NODE_ENV}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
```

#### 3.2. Health Check Routes

```typescript
// backend/src/routes/health.routes.ts
import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function healthRoutes(fastify: FastifyInstance) {
  // Liveness: "Is the app running?" (ECS restarts if fails)
  fastify.get('/health/live', async (request, reply) => {
    return reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Readiness: "Can the app serve traffic?" (ELB stops routing if fails)
  fastify.get('/health/ready', async (request, reply) => {
    const checks: Record<string, string> = {};

    // Check database
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = 'healthy';
    } catch (error) {
      checks.database = 'unhealthy';
      return reply.status(503).send({
        status: 'not_ready',
        checks,
        timestamp: new Date().toISOString(),
      });
    }

    // Check Redis (optional)
    try {
      if (redisClient) {
        await redisClient.ping();
        checks.redis = 'healthy';
      }
    } catch (error) {
      checks.redis = 'degraded'; // Non-critical
    }

    return reply.status(200).send({
      status: 'ready',
      checks,
      timestamp: new Date().toISOString(),
    });
  });

  // Legacy health check endpoint
  fastify.get('/health', async (request, reply) => {
    return reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
}
```

#### 3.3. Trust Proxy (para API Gateway)

```typescript
// backend/src/server.ts - adicionar na configuração do Fastify

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  trustProxy: true, // IMPORTANTE: API Gateway envia X-Forwarded-For
});
```

#### Checklist Fase 3

- [ ] SIGTERM handler implementado
- [ ] Timeout de 30s para shutdown forçado
- [ ] Conexões drenadas corretamente
- [ ] Health checks (liveness + readiness) implementados
- [ ] Trust proxy configurado para API Gateway
- [ ] Logs de shutdown detalhados
- [ ] Testado interrupção manual (docker stop)

---

### **FASE 4: Migração de Uploads para S3 (2 dias)**

#### Objetivos
- Substituir file system local por S3
- Pre-signed URLs para downloads seguros
- Manter backward compatibility

#### 4.1. Storage Service (ajustar existente)

```typescript
// backend/src/services/storage/storage-manager.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3StorageProvider } from './providers/s3-storage.provider';

@Injectable()
export class StorageManagerService {
  private provider: StorageProviderInterface;

  constructor(private config: ConfigService) {
    const provider = this.config.get('STORAGE_PROVIDER', 's3');

    // Force S3 in production
    if (provider === 's3' || process.env.NODE_ENV === 'production') {
      this.provider = new S3StorageProvider(config);
    } else {
      this.provider = new LocalStorageProvider(config);
    }
  }

  async uploadCompanyFileFromStream(
    companyId: string,
    file: Express.Multer.File,
    options: UploadOptions
  ): Promise<UploadResult> {
    return this.provider.uploadFile(file, { companyId, ...options });
  }

  async getFileUrl(fileKey: string, expiresIn: number = 3600): Promise<string> {
    return this.provider.getFileUrl(fileKey, expiresIn);
  }

  async deleteFile(fileKey: string): Promise<void> {
    return this.provider.deleteFile(fileKey);
  }
}
```

#### 4.2. S3 Provider com Pre-signed URLs

```typescript
// backend/src/services/storage/providers/s3-storage.provider.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3StorageProvider implements StorageProviderInterface {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private config: ConfigService) {
    this.bucketName = config.get('AWS_S3_BUCKET');

    this.s3Client = new S3Client({
      region: config.get('AWS_REGION', 'us-east-1'),
      // ECS Task Role provides credentials automatically
      // No need to hardcode access keys
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadOptions
  ): Promise<UploadResult> {
    const key = this.generateKey(
      options.companyId,
      options.category,
      file.originalname
    );

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ServerSideEncryption: 'AES256', // Encrypt at rest
      Metadata: {
        'uploaded-by': options.userId || 'system',
        'company-id': options.companyId,
        'original-name': file.originalname,
      },
    });

    await this.s3Client.send(command);

    return {
      url: `s3://${this.bucketName}/${key}`, // Store S3 URI in DB
      key: key,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    // Generate pre-signed URL (valid for 1 hour by default)
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return signedUrl;
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  private generateKey(
    companyId: string,
    category: string,
    filename: string
  ): string {
    const timestamp = Date.now();
    const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `companies/${companyId}/${category}/${timestamp}-${sanitized}`;
  }
}
```

#### Checklist Fase 4

- [ ] S3 bucket criado (com versioning + encryption)
- [ ] Storage service usando S3 em produção
- [ ] Pre-signed URLs funcionando
- [ ] Upload de arquivos testado
- [ ] Download de arquivos testado
- [ ] Arquivos antigos migrados (se necessário)

---

### **FASE 5: Gerar Swagger para API Gateway (1 dia)**

#### Objetivos
- Gerar arquivo Swagger/OpenAPI 3.0 completo
- Incluir todos os 111 endpoints
- Validação de request/response
- Integração com AWS API Gateway

#### 5.1. Script de Geração de Swagger

```bash
#!/bin/bash
# backend/scripts/generate-swagger.sh

set -e

echo "📝 Generating Swagger/OpenAPI specification..."

# Garantir que o servidor está rodando para extrair rotas
npm run build

# Executar script de geração
tsx scripts/extract-swagger.ts

echo "✅ Swagger generated at: swagger-api-gateway.json"
echo "📋 You can import this file to AWS API Gateway"
```

#### 5.2. Swagger Completo para API Gateway

O arquivo `backend/swagger.yaml` já existe e está parcialmente completo. Vou criar um script para converter e enriquecer para o formato do API Gateway:

```typescript
// backend/scripts/generate-api-gateway-swagger.ts
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

const swaggerPath = path.join(process.cwd(), 'swagger.yaml');
const outputPath = path.join(process.cwd(), 'swagger-api-gateway.json');

interface SwaggerDoc {
  openapi: string;
  info: any;
  servers: any[];
  paths: Record<string, any>;
  components: any;
}

async function generateAPIGatewaySwagger() {
  console.log('📖 Reading existing swagger.yaml...');

  const swaggerYaml = fs.readFileSync(swaggerPath, 'utf8');
  const swagger: SwaggerDoc = yaml.load(swaggerYaml) as SwaggerDoc;

  console.log('🔧 Enhancing for API Gateway...');

  // Add API Gateway extensions
  swagger['x-amazon-apigateway-request-validators'] = {
    all: {
      validateRequestBody: true,
      validateRequestParameters: true,
    },
    'params-only': {
      validateRequestBody: false,
      validateRequestParameters: true,
    },
    'body-only': {
      validateRequestBody: true,
      validateRequestParameters: false,
    },
  };

  // Add VPC Link integration to all paths
  const vpcLinkId = '${vpc_link_id}'; // Will be replaced by Terraform

  for (const [pathKey, pathValue] of Object.entries(swagger.paths)) {
    for (const [method, operation] of Object.entries(pathValue as any)) {
      if (typeof operation === 'object' && operation !== null) {
        // Add request validator
        operation['x-amazon-apigateway-request-validator'] = 'all';

        // Add VPC Link integration
        operation['x-amazon-apigateway-integration'] = {
          type: 'http_proxy',
          httpMethod: method.toUpperCase(),
          uri: `http://\${nlb_dns_name}${pathKey}`,
          connectionType: 'VPC_LINK',
          connectionId: vpcLinkId,
          requestParameters: {
            'integration.request.header.X-Forwarded-For':
              'context.identity.sourceIp',
            'integration.request.header.X-API-Gateway-Request-Id':
              'context.requestId',
          },
          responses: {
            default: {
              statusCode: '200',
            },
            '4\\d{2}': {
              statusCode: '400',
            },
            '5\\d{2}': {
              statusCode: '500',
            },
          },
        };

        // Add CORS for OPTIONS
        if (method === 'options') {
          operation['x-amazon-apigateway-integration'] = {
            type: 'mock',
            requestTemplates: {
              'application/json': '{"statusCode": 200}',
            },
            responses: {
              default: {
                statusCode: '200',
                responseParameters: {
                  'method.response.header.Access-Control-Allow-Headers':
                    "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
                  'method.response.header.Access-Control-Allow-Methods':
                    "'GET,POST,PUT,PATCH,DELETE,OPTIONS'",
                  'method.response.header.Access-Control-Allow-Origin': "'*'",
                },
              },
            },
          };
        }
      }
    }
  }

  // Add rate limiting policy
  swagger['x-amazon-apigateway-policy'] = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: 'execute-api:Invoke',
        Resource: 'execute-api:/*',
      },
    ],
  };

  console.log('💾 Writing swagger-api-gateway.json...');
  fs.writeFileSync(outputPath, JSON.stringify(swagger, null, 2));

  console.log('✅ API Gateway Swagger generated successfully!');
  console.log(`📄 File: ${outputPath}`);
  console.log(`📊 Total paths: ${Object.keys(swagger.paths).length}`);
}

generateAPIGatewaySwagger().catch(console.error);
```

#### 5.3. Adicionar ao package.json

```json
// backend/package.json
{
  "scripts": {
    "swagger:generate": "tsx scripts/generate-api-gateway-swagger.ts",
    "swagger:validate": "swagger-cli validate swagger-api-gateway.json"
  }
}
```

#### Checklist Fase 5

- [ ] Script de geração de Swagger criado
- [ ] swagger-api-gateway.json gerado
- [ ] Todos os 111 endpoints incluídos
- [ ] VPC Link integration configurada
- [ ] Request validators adicionados
- [ ] CORS configurado
- [ ] Rate limiting policy incluída
- [ ] Validação passando (swagger-cli)

---

### **FASE 6: Infraestrutura como Código - Terraform (1 semana)**

#### Objetivos
- Provisionar toda infraestrutura AWS via Terraform
- Incluir API Gateway + VPC Link
- S3 + CloudFront para frontend
- ECS Fargate com Spot

#### 6.1. Estrutura de Diretórios

```
terraform/
├── modules/
│   ├── vpc/                  # VPC + Subnets + NAT
│   ├── s3-frontend/          # S3 + CloudFront (Frontend)
│   ├── api-gateway/          # API Gateway + VPC Link
│   ├── ecs/                  # ECS Cluster + Services
│   ├── nlb/                  # Network Load Balancer (internal)
│   ├── rds/                  # PostgreSQL RDS
│   ├── elasticache/          # Redis
│   ├── s3-storage/           # S3 buckets (uploads)
│   ├── secrets/              # Secrets Manager
│   ├── cloudwatch/           # Logs + Alarms
│   └── ecr/                  # Container Registry
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── prod/
├── backend.tf                # S3 backend config
└── README.md
```

#### 6.2. S3 + CloudFront Module (Frontend)

```hcl
# terraform/modules/s3-frontend/main.tf

# S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${var.environment}"

  tags = {
    Name = "${var.project_name}-frontend"
  }
}

# Block public access (CloudFront will access via OAI)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning
resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "frontend" {
  comment = "OAI for ${var.project_name} frontend"
}

# S3 Bucket Policy (allow CloudFront)
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOAI"
        Effect = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.frontend.iam_arn
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} Frontend"
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class
  aliases             = [var.domain_name]

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600   # 1 hour
    max_ttl                = 86400  # 24 hours
    compress               = true
  }

  # Cache behavior for static assets (long cache)
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 31536000  # 1 year
    default_ttl            = 31536000
    max_ttl                = 31536000
    compress               = true
  }

  # Custom error responses (SPA routing)
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "${var.project_name}-frontend-cdn"
  }
}

# Route53 Alias
resource "aws_route53_record" "frontend" {
  zone_id = var.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

# Outputs
output "s3_bucket_name" {
  value = aws_s3_bucket.frontend.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "website_url" {
  value = "https://${var.domain_name}"
}
```

#### 6.3. API Gateway Module

```hcl
# terraform/modules/api-gateway/main.tf

# Import Swagger definition
locals {
  swagger_content = templatefile("${path.module}/../../swagger-api-gateway.json", {
    vpc_link_id  = aws_api_gateway_vpc_link.main.id
    nlb_dns_name = var.nlb_dns_name
    region       = var.aws_region
  })
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "main" {
  name        = "${var.project_name}-api-${var.environment}"
  description = "HalalSphere API - Managed by Terraform"

  body = local.swagger_content

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = "${var.project_name}-api-gateway"
  }
}

# VPC Link (connects API Gateway to NLB in VPC)
resource "aws_api_gateway_vpc_link" "main" {
  name        = "${var.project_name}-vpc-link-${var.environment}"
  description = "VPC Link to ECS Fargate backend"
  target_arns = [var.nlb_arn]

  tags = {
    Name = "${var.project_name}-vpc-link"
  }
}

# Deployment
resource "aws_api_gateway_deployment" "main" {
  rest_api_id = aws_api_gateway_rest_api.main.id

  triggers = {
    redeployment = sha256(local.swagger_content)
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Stage
resource "aws_api_gateway_stage" "main" {
  deployment_id = aws_api_gateway_deployment.main.id
  rest_api_id   = aws_api_gateway_rest_api.main.id
  stage_name    = var.environment

  xray_tracing_enabled = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      caller         = "$context.identity.caller"
      user           = "$context.identity.user"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      resourcePath   = "$context.resourcePath"
      status         = "$context.status"
      protocol       = "$context.protocol"
      responseLength = "$context.responseLength"
      errorMessage   = "$context.error.message"
    })
  }

  tags = {
    Name = "${var.project_name}-api-stage"
  }
}

# CloudWatch Logs for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-api-gateway-logs"
  }
}

# Usage Plan (Rate Limiting)
resource "aws_api_gateway_usage_plan" "main" {
  name        = "${var.project_name}-usage-plan-${var.environment}"
  description = "Usage plan with rate limiting"

  api_stages {
    api_id = aws_api_gateway_rest_api.main.id
    stage  = aws_api_gateway_stage.main.stage_name
  }

  quota_settings {
    limit  = 100000 # 100k requests per month
    period = "MONTH"
  }

  throttle_settings {
    burst_limit = 200  # Burst capacity
    rate_limit  = 100  # 100 requests per second
  }
}

# API Key (optional, for specific clients)
resource "aws_api_gateway_api_key" "main" {
  name    = "${var.project_name}-api-key-${var.environment}"
  enabled = true

  tags = {
    Name = "${var.project_name}-api-key"
  }
}

# Associate API Key with Usage Plan
resource "aws_api_gateway_usage_plan_key" "main" {
  key_id        = aws_api_gateway_api_key.main.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.main.id
}

# Custom Domain (optional)
resource "aws_api_gateway_domain_name" "main" {
  domain_name              = var.api_domain_name
  regional_certificate_arn = var.acm_certificate_arn

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = "${var.project_name}-api-domain"
  }
}

# Base Path Mapping
resource "aws_api_gateway_base_path_mapping" "main" {
  api_id      = aws_api_gateway_rest_api.main.id
  stage_name  = aws_api_gateway_stage.main.stage_name
  domain_name = aws_api_gateway_domain_name.main.domain_name
  base_path   = ""
}

# Route53 Record for API
resource "aws_route53_record" "api" {
  zone_id = var.route53_zone_id
  name    = var.api_domain_name
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.main.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.main.regional_zone_id
    evaluate_target_health = false
  }
}

# Outputs
output "api_gateway_id" {
  value = aws_api_gateway_rest_api.main.id
}

output "api_gateway_invoke_url" {
  value = aws_api_gateway_stage.main.invoke_url
}

output "api_gateway_custom_domain" {
  value = "https://${var.api_domain_name}"
}

output "vpc_link_id" {
  value = aws_api_gateway_vpc_link.main.id
}
```

#### 6.4. NLB Module (Internal)

```hcl
# terraform/modules/nlb/main.tf

# Network Load Balancer (internal, for VPC Link)
resource "aws_lb" "main" {
  name               = "${var.project_name}-nlb-${var.environment}"
  internal           = true  # Not exposed to internet
  load_balancer_type = "network"
  subnets            = var.private_subnet_ids

  enable_cross_zone_load_balancing = true
  enable_deletion_protection       = var.environment == "prod"

  tags = {
    Name = "${var.project_name}-nlb"
  }
}

# Target Group
resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-backend-tg-${var.environment}"
  port        = 3333
  protocol    = "TCP"
  target_type = "ip"
  vpc_id      = var.vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    interval            = 30
    protocol            = "HTTP"
    path                = "/health/ready"
    matcher             = "200"
  }

  deregistration_delay = 30 # Graceful shutdown period

  tags = {
    Name = "${var.project_name}-backend-tg"
  }
}

# Listener
resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

# Outputs
output "nlb_arn" {
  value = aws_lb.main.arn
}

output "nlb_dns_name" {
  value = aws_lb.main.dns_name
}

output "target_group_arn" {
  value = aws_lb_target_group.backend.arn
}
```

#### 6.5. ECS Module (Backend, Spot)

```hcl
# terraform/modules/ecs/main.tf

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-cluster"
  }
}

# Capacity Provider Strategy (Spot + On-Demand)
resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 4 # 80% Spot
    base              = 0
  }

  default_capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1 # 20% On-Demand
    base              = 1 # At least 1 On-Demand always
  }
}

# Task Definition (Backend)
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"  # 0.5 vCPU
  memory                   = "1024" # 1 GB
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${var.ecr_backend_url}:${var.image_tag}"
      cpu       = 512
      memory    = 1024
      essential = true

      portMappings = [
        {
          containerPort = 3333
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "PORT", value = "3333" },
        { name = "AUTO_MIGRATE", value = "false" },
        { name = "TRUST_PROXY", value = "true" },
        { name = "AWS_REGION", value = var.aws_region },
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "${var.db_secret_arn}:DATABASE_URL::"
        },
        {
          name      = "REDIS_URL"
          valueFrom = "${var.redis_secret_arn}:REDIS_URL::"
        },
        {
          name      = "JWT_SECRET"
          valueFrom = "${var.jwt_secret_arn}:JWT_SECRET::"
        },
      ]

      healthCheck = {
        command = [
          "CMD-SHELL",
          "node -e \"require('http').get('http://localhost:3333/health/ready', (r) => process.exit(r.statusCode === 200 ? 0 : 1))\""
        ]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-backend"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      stopTimeout = 30 # Grace period for SIGTERM
    }
  ])

  tags = {
    Name = "${var.project_name}-backend-task"
  }
}

# ECS Service (Backend)
resource "aws_ecs_service" "backend" {
  name            = "${var.project_name}-backend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count
  launch_type     = "FARGATE"

  # Use Spot instances
  capacity_provider_strategy {
    capacity_provider = "FARGATE_SPOT"
    weight            = 4
    base              = 0
  }

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
    base              = 1
  }

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.nlb_target_group_arn
    container_name   = "backend"
    container_port   = 3333
  }

  health_check_grace_period_seconds = 60

  # Graceful shutdown
  deployment_configuration {
    minimum_healthy_percent = 50
    maximum_percent         = 200
  }

  enable_ecs_managed_tags = true
  propagate_tags          = "SERVICE"

  depends_on = [var.nlb_listener_arn]

  tags = {
    Name = "${var.project_name}-backend-service"
  }
}

# Auto Scaling
resource "aws_appautoscaling_target" "backend" {
  max_capacity       = var.backend_max_count
  min_capacity       = var.backend_min_count
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "backend_cpu" {
  name               = "${var.project_name}-backend-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend.resource_id
  scalable_dimension = aws_appautoscaling_target.backend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# Security Group (ECS Tasks)
resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project_name}-ecs-tasks-sg"
  description = "Security group for ECS tasks"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow traffic from NLB"
    from_port   = 3333
    to_port     = 3333
    protocol    = "tcp"
    cidr_blocks = var.private_subnet_cidrs
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ecs-tasks-sg"
  }
}

# IAM Roles (execution + task)
# ... (similar to previous version, with S3 and Secrets Manager permissions)
```

#### Checklist Fase 6

- [ ] Terraform modules criados
- [ ] S3 + CloudFront configurado para frontend
- [ ] API Gateway com VPC Link
- [ ] NLB interno criado
- [ ] ECS Fargate com Spot
- [ ] RDS PostgreSQL Multi-AZ
- [ ] ElastiCache Redis
- [ ] S3 bucket para uploads
- [ ] Secrets Manager
- [ ] CloudWatch Logs e Alarms
- [ ] `terraform plan` executado com sucesso

---

### **FASE 7: CI/CD Pipeline (3 dias)**

#### 7.1. GitHub Actions - Backend Deploy

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend to ECS

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: halalsphere-backend
  ECS_CLUSTER: halalsphere-cluster-prod
  ECS_SERVICE: halalsphere-backend-service
  CONTAINER_NAME: backend

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Run linter
        working-directory: ./backend
        run: npm run lint

      - name: Run tests
        working-directory: ./backend
        run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image
        id: build-image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        working-directory: ./backend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster ${{ env.ECS_CLUSTER }} \
            --service ${{ env.ECS_SERVICE }} \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster ${{ env.ECS_CLUSTER }} \
            --services ${{ env.ECS_SERVICE }}

      - name: Notify success
        if: success()
        run: echo "✅ Backend deployed successfully!"
```

#### 7.2. GitHub Actions - Frontend Deploy

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend to S3

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy-frontend.yml'

env:
  AWS_REGION: us-east-1
  S3_BUCKET: halalsphere-frontend-prod
  CLOUDFRONT_DISTRIBUTION_ID: ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Run linter
        working-directory: ./frontend
        run: npm run lint

      - name: Run tests
        working-directory: ./frontend
        run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Build production
        working-directory: ./frontend
        env:
          VITE_API_URL: https://api.halalsphere.com
        run: npm run build:production

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Sync to S3
        working-directory: ./frontend
        run: |
          # Upload HTML (no cache)
          aws s3 sync dist/ s3://${{ env.S3_BUCKET }}/ \
            --delete \
            --exclude "*" \
            --include "*.html" \
            --cache-control "no-cache, no-store, must-revalidate"

          # Upload assets (long cache)
          aws s3 sync dist/ s3://${{ env.S3_BUCKET }}/ \
            --delete \
            --exclude "*.html" \
            --cache-control "public, max-age=31536000, immutable"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ env.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

      - name: Notify success
        if: success()
        run: echo "✅ Frontend deployed successfully!"
```

#### Checklist Fase 7

- [ ] GitHub Actions workflows criados
- [ ] ECR repository criado
- [ ] AWS credentials configuradas
- [ ] Backend pipeline testado
- [ ] Frontend pipeline testado
- [ ] CloudFront invalidation funcionando
- [ ] Notifications configuradas

---

## 📊 Monitoramento e Observabilidade

### CloudWatch Dashboards

```hcl
# terraform/modules/cloudwatch/dashboards.tf
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}"

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", { stat = "Average" }],
            [".", "MemoryUtilization", { stat = "Average" }]
          ]
          period = 300
          region = var.aws_region
          title  = "ECS CPU & Memory"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/ApiGateway", "Count", { stat = "Sum" }],
            [".", "Latency", { stat = "Average" }],
            [".", "4XXError", { stat = "Sum" }],
            [".", "5XXError", { stat = "Sum" }]
          ]
          period = 300
          region = var.aws_region
          title  = "API Gateway Metrics"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/CloudFront", "Requests", { stat = "Sum" }],
            [".", "BytesDownloaded", { stat = "Sum" }],
            [".", "4xxErrorRate", { stat = "Average" }],
            [".", "5xxErrorRate", { stat = "Average" }]
          ]
          period = 300
          region = "us-east-1" # CloudFront always us-east-1
          title  = "CloudFront Metrics"
        }
      },
      {
        type = "metric"
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", { stat = "Average" }],
            [".", "DatabaseConnections", { stat = "Average" }],
            [".", "FreeableMemory", { stat = "Average" }]
          ]
          period = 300
          region = var.aws_region
          title  = "RDS Performance"
        }
      }
    ]
  })
}
```

---

## 🎯 Checklist Final

### Pré-Deploy
- [ ] Backend Dockerfile criado e testado
- [ ] Frontend build otimizado
- [ ] Graceful shutdown implementado
- [ ] Uploads migrados para S3
- [ ] Swagger para API Gateway gerado
- [ ] Terraform configurado
- [ ] Secrets Manager preenchido
- [ ] CI/CD pipelines testados

### Deploy
- [ ] Terraform apply executado
- [ ] VPC e subnets criadas
- [ ] RDS PostgreSQL funcionando
- [ ] ElastiCache Redis funcionando
- [ ] S3 buckets criados
- [ ] ECR images pushed
- [ ] ECS tasks rodando (Spot + On-Demand)
- [ ] NLB funcionando internamente
- [ ] API Gateway criado e testado
- [ ] VPC Link conectado
- [ ] CloudFront distribuindo frontend
- [ ] Rotas DNS configuradas

### Pós-Deploy
- [ ] Monitoramento CloudWatch configurado
- [ ] Alarms testados
- [ ] Logs centralizados
- [ ] Performance testado (load test)
- [ ] Spot interruptions testadas
- [ ] Backups automáticos (RDS)
- [ ] Disaster recovery plan documentado
- [ ] Runbook para operações

---

## 📚 Recursos

- [API Gateway VPC Link](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-private-integration.html)
- [ECS Fargate Spot](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html)
- [CloudFront + S3](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html)
- [Swagger/OpenAPI with API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-import-api.html)

---

**Status**: Pronto para implementação

**Arquitetura atualizada com:**
- ✅ Frontend estático no S3 + CloudFront
- ✅ API Gateway com VPC Link (sem ALB)
- ✅ Backend containerizado no ECS Fargate com Spot
- ✅ NLB interno (não exposto)
- ✅ Swagger/OpenAPI para API Gateway

**Próximos Passos**:
1. Revisar e aprovar plano atualizado
2. Executar Fase 1 (Containerização backend)
3. Executar Fase 2 (Frontend para S3)
4. Gerar Swagger para API Gateway
5. Provisionar infraestrutura AWS (Terraform)
6. Deploy em staging
7. Load testing
8. Deploy em produção
