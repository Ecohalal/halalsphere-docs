# Guia de Migracao NestJS para Producao

> **MIGRACAO CONCLUIDA** - O backend foi migrado 100% para NestJS 11 + Express.
> O repo `halalsphere-backend` agora contem apenas NestJS. Fastify foi removido.
> Este documento e mantido como registro historico das estrategias de migracao consideradas.

**Versao:** 1.0
**Data:** 2026-01-19
**Status:** CONCLUIDO

## Visao Geral

Este guia detalhava os passos para migrar o backend do HalalSphere de Fastify para NestJS em producao.
A migracao foi concluida com sucesso. O repo `halalsphere-backend` agora opera 100% com NestJS 11 + Express.

### Repositorios (Estado Atual)

- **Backend (NestJS - producao):** `halalsphere-backend`
- **Frontend:** `halalsphere-frontend`
- **Documentação:** `halalsphere-docs`

---

## 🎯 Situação Atual

### Status da Migração NestJS

De acordo com [BUILD-TEST-STATUS-2026-01-19.md](../migration-updates/BUILD-TEST-STATUS-2026-01-19.md):

| Componente | Status | Detalhes |
|------------|--------|----------|
| **Build TypeScript** | ✅ SUCESSO | 0 erros, dist/ gerado |
| **Testes Unitários** | ⚠️ 88% | 324/368 passando (44 falhando) |
| **Testes E2E** | ✅ 100% | Todos os testes E2E passando |
| **Funcionalidades Core** | ✅ OPERACIONAIS | Request, Process, Contract, Auditor Allocation |

### Fase Atual da Migração

Conforme documentação, a migração está em **Fase 1 - 61% completa** (11/18 módulos).

**Módulos Completos:**
1. ✅ Auth & Users
2. ✅ Company
3. ✅ User Management
4. ✅ Process Management (core)
5. ✅ Request
6. ✅ Contract
7. ✅ Certificate
8. ✅ Auditor Allocation
9. ✅ Document Upload
10. ✅ Notification
11. ✅ Settings

---

## 🔄 Estratégias de Migração para Produção

Existem **3 estratégias principais** para levar o NestJS para produção:

### Estratégia 1: Substituição Completa (Big Bang) ⚡

**Descrição:** Substituir todo o backend Fastify pelo NestJS de uma vez.

**Quando usar:**
- Quando 100% das funcionalidades estão migradas
- Em aplicações pequenas ou com baixo tráfego
- Com janela de manutenção disponível

**Prós:**
- ✅ Mais simples de executar
- ✅ Sem necessidade de manter dois sistemas
- ✅ Migração completa e rápida

**Contras:**
- ❌ Alto risco
- ❌ Rollback complexo
- ❌ Requer janela de manutenção
- ❌ Impacto grande se houver problemas

**Passos:**
1. Finalizar 100% da migração NestJS
2. Testar exaustivamente em staging
3. Agendar janela de manutenção
4. Fazer backup completo do banco
5. Deploy do NestJS
6. Monitorar intensivamente
7. Manter Fastify como backup por 1-2 semanas

---

### Estratégia 2: Migração Gradual por Módulos (Strangler Fig) 🌱 **[RECOMENDADO]**

**Descrição:** Migrar módulos progressivamente, mantendo ambos os sistemas rodando em paralelo com um API Gateway fazendo roteamento.

**Quando usar:**
- Em aplicações de médio/grande porte
- Quando há necessidade de zero downtime
- Quando nem todos os módulos estão prontos
- **Situação atual do HalalSphere (61% completo)**

**Prós:**
- ✅ Risco baixo (rollback módulo por módulo)
- ✅ Zero downtime
- ✅ Pode começar com módulos já prontos
- ✅ Feedback contínuo da produção
- ✅ Permite ajustes durante a migração

**Contras:**
- ❌ Mais complexo de configurar
- ❌ Necessita API Gateway ou Proxy reverso
- ❌ Dois sistemas em produção simultaneamente
- ❌ Requer gestão de estado compartilhado

**Arquitetura:**

```
                          ┌─────────────────┐
                          │   API Gateway   │
                          │  (Kong/nginx)   │
                          └────────┬────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
           ┌────────▼────────┐         ┌─────────▼─────────┐
           │  Fastify (OLD)  │         │   NestJS (NEW)    │
           │  Port 3333      │         │   Port 3334       │
           └────────┬────────┘         └─────────┬─────────┘
                    │                             │
                    └──────────────┬──────────────┘
                                   │
                          ┌────────▼────────┐
                          │   PostgreSQL    │
                          │   (Compartilhado)│
                          └─────────────────┘
```

**Passos Detalhados:**
1. [Configurar infraestrutura dual](#fase-1-preparação-da-infraestrutura)
2. [Migrar módulos gradualmente](#fase-2-migração-gradual-por-módulos)
3. [Remover sistema legado](#fase-4-remoção-do-sistema-legado)

---

### Estratégia 3: Blue-Green Deployment 🔵🟢

**Descrição:** Manter dois ambientes completos (blue=Fastify, green=NestJS) e fazer switch de tráfego.

**Quando usar:**
- Quando 100% está pronto mas quer rollback instantâneo
- Em sistemas críticos que não podem ter downtime
- Quando há orçamento para duplicar infraestrutura temporariamente

**Prós:**
- ✅ Rollback instantâneo
- ✅ Zero downtime
- ✅ Pode testar com tráfego real gradualmente (canary)

**Contras:**
- ❌ Custo dobrado de infraestrutura temporariamente
- ❌ Complexidade de sincronização de dados
- ❌ Requer load balancer sofisticado

**Passos:**
1. Provisionar ambiente Green (NestJS) completo
2. Sincronizar banco de dados
3. Configurar load balancer com 0% tráfego no Green
4. Gradualmente aumentar tráfego: 5% → 20% → 50% → 100%
5. Desligar ambiente Blue após estabilização

---

## 🏗️ Plano de Implementação Recomendado

Para o HalalSphere, considerando que:
- ✅ 61% dos módulos estão prontos
- ✅ Testes E2E passando 100%
- ⚠️ 12% dos testes unitários falhando (não crítico)
- ✅ Build TypeScript funcionando

**Recomendação: Estratégia 2 - Migração Gradual por Módulos**

---

## 📅 Fase 1: Preparação da Infraestrutura

### 1.1. Organizar Repositórios

#### Opção A: Manter Repos Separados (Recomendado)

```bash
/c/Projetos/
├── halalsphere-backend/           # Fastify (legado)
├── halalsphere-backend-nest/      # NestJS (novo)
└── halalsphere-frontend/          # Frontend (continua funcionando com ambos)
```

**Vantagens:**
- Rollback fácil
- Desenvolvimento paralelo
- Histórico preservado

**Configuração:**
```bash
# Certificar que ambos os repos estão sincronizados
cd /c/Projetos/halalsphere-backend
git pull origin main

cd /c/Projetos/halalsphere-backend-nest
git pull origin release
```

#### Opção B: Substituir Repo

```bash
# Backup do Fastify
cd /c/Projetos/halalsphere-backend
git branch fastify-legacy-backup
git push origin fastify-legacy-backup

# Substituir pelo NestJS
cd /c/Projetos
mv halalsphere-backend halalsphere-backend-fastify-backup
mv halalsphere-backend-nest halalsphere-backend
```

**Nota:** Mantenha o backup do Fastify por pelo menos 3 meses.

---

### 1.2. Configurar API Gateway

Usar **nginx** como proxy reverso para rotear tráfego entre Fastify e NestJS.

#### Instalação do nginx (EC2/ECS)

```bash
# Amazon Linux 2
sudo yum install -y nginx

# Ubuntu
sudo apt-get install -y nginx
```

#### Configuração nginx

Criar `/etc/nginx/conf.d/halalsphere.conf`:

```nginx
upstream fastify_backend {
    server localhost:3333 max_fails=3 fail_timeout=30s;
}

upstream nestjs_backend {
    server localhost:3334 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name api.halalsphere.com;

    # Health check endpoint
    location /health {
        proxy_pass http://nestjs_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Módulos migrados para NestJS (Fase 1)
    location ~ ^/api/v1/(requests|contracts|certificates|auditor-allocation) {
        proxy_pass http://nestjs_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Módulos ainda em Fastify
    location /api/v1/ {
        proxy_pass http://fastify_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Swagger/Docs do NestJS
    location /docs {
        proxy_pass http://nestjs_backend;
        proxy_set_header Host $host;
    }
}
```

**Testar configuração:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 1.3. Preparar Ambientes AWS

#### Opção A: ECS Fargate (Recomendado)

**Task Definition - NestJS:**

```json
{
  "family": "halalsphere-backend-nestjs",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "nestjs-app",
      "image": "<account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend-nest:latest",
      "portMappings": [
        {
          "containerPort": 3334,
          "protocol": "tcp"
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" },
        { "name": "PORT", "value": "3334" }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account>:secret:halalsphere/production-db"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3334/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

**Service Definition:**

```bash
aws ecs create-service \
  --cluster halalsphere-cluster \
  --service-name halalsphere-backend-nestjs \
  --task-definition halalsphere-backend-nestjs:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx]}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=nestjs-app,containerPort=3334"
```

#### Opção B: EC2 com Docker Compose

**docker-compose.production.yml:**

```yaml
version: '3.8'

services:
  fastify:
    image: halalsphere-backend-fastify:latest
    container_name: fastify-backend
    ports:
      - "3333:3333"
    environment:
      NODE_ENV: production
      PORT: 3333
    env_file:
      - /opt/secrets/fastify.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3333/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  nestjs:
    image: halalsphere-backend-nest:latest
    container_name: nestjs-backend
    ports:
      - "3334:3334"
    environment:
      NODE_ENV: production
      PORT: 3334
    env_file:
      - /opt/secrets/nestjs.env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3334/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: api-gateway
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - fastify
      - nestjs
    restart: unless-stopped
```

---

### 1.4. Migrar Variáveis de Ambiente

Criar configuração NestJS com base no Fastify:

**Fastify (.env):**
```bash
SQL_HALALSPHERE_CONNECTION=postgresql://...
JWT_PUBLIC_KEY_HALALSPHERE_API=...
JWT_PRIVATE_KEY_HALALSPHERE_API=...
PORT=3333
```

**NestJS (.env):**
```bash
DATABASE_URL=postgresql://...
JWT_PUBLIC_KEY=...
JWT_PRIVATE_KEY=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
PORT=3334
FRONTEND_URL=https://app.halalsphere.com
AWS_REGION=us-east-1
AWS_S3_BUCKET=halalsphere-documents
```

**Armazenar no AWS Secrets Manager:**

```bash
# Criar secret
aws secretsmanager create-secret \
  --name halalsphere/production-nestjs \
  --description "NestJS Backend Production Secrets" \
  --secret-string file://secrets.json

# secrets.json
{
  "DATABASE_URL": "postgresql://user:pass@host:5432/halalsphere",
  "JWT_SECRET": "your-secret-key-min-32-chars",
  "JWT_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\n...",
  "JWT_PUBLIC_KEY": "-----BEGIN PUBLIC KEY-----\n..."
}
```

---

## 📅 Fase 2: Migração Gradual por Módulos

### 2.1. Ordem de Migração Recomendada

Baseado nos módulos já completos e criticidade:

| Ordem | Módulo | Status | Risco | Prioridade |
|-------|--------|--------|-------|------------|
| 1 | ✅ Health Check | Completo | Baixo | Alta |
| 2 | ✅ Certificate | Completo | Baixo | Alta |
| 3 | ✅ Auditor Allocation | Completo | Médio | Alta |
| 4 | ✅ Request | Completo | Alto | Média |
| 5 | ✅ Contract | Completo | Alto | Média |
| 6 | ✅ Process Management | Completo (alguns testes falhando) | Alto | Média |
| 7 | ✅ Document Upload | Completo | Médio | Baixa |
| 8 | ✅ Notification | Completo | Baixo | Baixa |
| 9 | ⚠️ Payment | Em desenvolvimento | Alto | Esperar |
| 10 | ⚠️ Outros módulos | Pendente | Variável | Esperar |

---

### 2.2. Migração do Primeiro Módulo (Health Check)

#### Passo 1: Preparar NestJS

```bash
cd /c/Projetos/halalsphere-backend-nest

# Verificar build
npm run build

# Verificar health endpoint
npm run start:prod
curl http://localhost:3334/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" }
  }
}
```

#### Passo 2: Deploy em Staging

```bash
# Build da imagem
docker build -t halalsphere-backend-nest:v1.0.0-staging .

# Push para ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag halalsphere-backend-nest:v1.0.0-staging <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend-nest:staging
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend-nest:staging

# Deploy no ECS staging
aws ecs update-service \
  --cluster halalsphere-staging-cluster \
  --service halalsphere-backend-nestjs \
  --force-new-deployment
```

#### Passo 3: Testar em Staging

```bash
# Health check
curl https://staging-api.halalsphere.com/health

# Verificar logs
aws logs tail /ecs/halalsphere-backend-nestjs --follow
```

#### Passo 4: Configurar nginx para rotear /health para NestJS

```nginx
# /etc/nginx/conf.d/halalsphere-staging.conf
location /health {
    proxy_pass http://nestjs_backend:3334;
    proxy_set_header Host $host;
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Passo 5: Monitorar e Validar

```bash
# Testar várias vezes
for i in {1..100}; do
  curl -s https://staging-api.halalsphere.com/health | jq .status
  sleep 1
done

# Verificar logs de erro
aws logs filter-pattern '{$.level = "error"}' /ecs/halalsphere-backend-nestjs
```

#### Passo 6: Deploy em Produção

Se tudo estiver OK em staging por 24-48 horas:

```bash
# Tag para produção
docker tag <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend-nest:staging \
           <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend-nest:v1.0.0

docker push <account>.dkr.ecr.us-east-1.amazonaws.com/halalsphere-backend-nest:v1.0.0

# Deploy em produção
aws ecs update-service \
  --cluster halalsphere-production-cluster \
  --service halalsphere-backend-nestjs \
  --force-new-deployment

# Atualizar nginx produção
# (aplicar mesma config de roteamento)
```

---

### 2.3. Migração de Módulos Subsequentes

Repetir o processo acima para cada módulo, seguindo a ordem recomendada.

#### Exemplo: Migração do Módulo Certificate

**Atualizar nginx:**

```nginx
# Adicionar rota para certificates
location ~ ^/api/v1/certificates {
    proxy_pass http://nestjs_backend:3334;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**Testar endpoints:**

```bash
# Listar certificados
curl -H "Authorization: Bearer $TOKEN" \
  https://staging-api.halalsphere.com/api/v1/certificates

# Criar certificado
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"processId":"123","type":"HALAL"}' \
  https://staging-api.halalsphere.com/api/v1/certificates
```

**Monitorar por 48h em staging antes de produção.**

---

### 2.4. Migração de Módulos Críticos (Process, Request)

Estes módulos requerem atenção especial:

#### Pré-requisitos:
1. ✅ Corrigir os 44 testes unitários falhando
2. ✅ Realizar testes de carga
3. ✅ Configurar rollback automático
4. ✅ Backup completo do banco de dados

#### Estratégia de Deploy:

**Opção A: Canary Release (5% → 20% → 50% → 100%)**

```nginx
# nginx com split de tráfego
upstream nestjs_backend {
    server nestjs:3334 weight=5;   # 5% tráfego
}

upstream fastify_backend {
    server fastify:3333 weight=95;  # 95% tráfego
}

location ~ ^/api/v1/processes {
    proxy_pass http://nestjs_backend;  # Vai usar peso definido no upstream
}
```

**Aumentar gradualmente:**
- Dia 1: 5% NestJS, 95% Fastify
- Dia 3: 20% NestJS, 80% Fastify
- Dia 7: 50% NestJS, 50% Fastify
- Dia 14: 100% NestJS

**Opção B: Feature Flag**

Adicionar flag no banco de dados:

```sql
CREATE TABLE feature_flags (
  flag_name VARCHAR(50) PRIMARY KEY,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0
);

INSERT INTO feature_flags (flag_name, enabled, rollout_percentage)
VALUES ('use_nestjs_process_module', TRUE, 5);
```

No código (Fastify):

```typescript
// Fastify route handler
async function getProcessHandler(req, reply) {
  const useNestJS = await checkFeatureFlag('use_nestjs_process_module', req.user.id);

  if (useNestJS) {
    // Forward para NestJS
    return reply.proxy(`http://nestjs:3334${req.url}`);
  }

  // Continuar com lógica Fastify
  return processService.getProcess(req.params.id);
}
```

---

## 📅 Fase 3: Monitoramento e Validação

### 3.1. Métricas Essenciais

Configurar CloudWatch Dashboards com:

**Métricas de Performance:**
```
- API response time (p50, p95, p99)
  - Fastify vs NestJS
- Request rate (req/s)
- Error rate (% 5xx)
- Database query duration
- Database connection pool usage
```

**Métricas de Infraestrutura:**
```
- ECS CPU utilization
- ECS Memory utilization
- ALB target health
- RDS CPU, connections, IOPS
```

**Alarmes Críticos:**

```bash
# Criar alarme de alta taxa de erro
aws cloudwatch put-metric-alarm \
  --alarm-name nestjs-high-error-rate \
  --alarm-description "NestJS error rate > 5%" \
  --metric-name ErrorRate \
  --namespace HalalSphere/API \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:<account>:critical-alerts

# Criar alarme de alta latência
aws cloudwatch put-metric-alarm \
  --alarm-name nestjs-high-latency \
  --metric-name ResponseTime \
  --namespace HalalSphere/API \
  --statistic Average \
  --period 60 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 3
```

### 3.2. Logs Estruturados

Garantir que ambos os sistemas (Fastify e NestJS) usam formato consistente:

```json
{
  "timestamp": "2026-01-19T10:30:00Z",
  "level": "info",
  "service": "nestjs",
  "module": "ProcessService",
  "method": "POST",
  "path": "/api/v1/processes",
  "userId": "user-123",
  "duration": 125,
  "statusCode": 201,
  "error": null
}
```

**CloudWatch Insights Queries:**

```sql
-- Comparar performance Fastify vs NestJS
fields @timestamp, service, duration
| filter path like /processes/
| stats avg(duration) as avg_duration by service
| sort avg_duration desc

-- Top erros por serviço
fields @timestamp, service, error
| filter level = "error"
| stats count() as error_count by service, error
| sort error_count desc
| limit 20
```

### 3.3. Testes de Carga Comparativos

```bash
# Instalar k6
npm install -g k6

# Teste de carga Fastify
k6 run --vus 100 --duration 5m load-test-fastify.js

# Teste de carga NestJS
k6 run --vus 100 --duration 5m load-test-nestjs.js
```

**load-test-nestjs.js:**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp-up
    { duration: '5m', target: 100 }, // Stay at 100 VUs
    { duration: '2m', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requests < 500ms
    http_req_failed: ['rate<0.05'],   // Menos de 5% de erros
  },
};

export default function () {
  const BASE_URL = 'https://staging-api.halalsphere.com';

  // Login
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'password',
  }));

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  const token = loginRes.json('accessToken');

  // Get processes
  const processRes = http.get(`${BASE_URL}/api/v1/processes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(processRes, {
    'processes fetched': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

---

## 📅 Fase 4: Remoção do Sistema Legado

### 4.1. Checklist de Remoção

Só remover Fastify quando:

- [ ] 100% dos módulos migrados para NestJS
- [ ] 100% do tráfego no NestJS por pelo menos 2 semanas
- [ ] 0 incidentes relacionados ao NestJS nos últimos 7 dias
- [ ] Todos os testes passando (unit + E2E)
- [ ] Performance igual ou melhor que Fastify
- [ ] Documentação atualizada
- [ ] Equipe treinada no NestJS

### 4.2. Processo de Descomissionamento

#### Semana 1-2: Reduzir recursos do Fastify

```bash
# Reduzir número de tasks ECS
aws ecs update-service \
  --cluster halalsphere-production-cluster \
  --service halalsphere-backend-fastify \
  --desired-count 1  # De 3 para 1
```

#### Semana 3-4: Monitorar se algum tráfego ainda chega no Fastify

```bash
# Verificar logs Fastify
aws logs tail /ecs/halalsphere-backend-fastify --since 24h | grep "POST\|GET\|PUT\|DELETE"
```

Se **zero tráfego** por 1 semana:

#### Semana 5: Desligar Fastify

```bash
# Parar service
aws ecs update-service \
  --cluster halalsphere-production-cluster \
  --service halalsphere-backend-fastify \
  --desired-count 0

# Aguardar 48h e deletar service
aws ecs delete-service \
  --cluster halalsphere-production-cluster \
  --service halalsphere-backend-fastify
```

#### Semana 6: Remover configurações nginx

```nginx
# Remover upstream fastify_backend
# Simplificar configuração para apontar só para NestJS

upstream backend {
    server localhost:3334;
}

location /api/ {
    proxy_pass http://backend;
}
```

### 4.3. Arquivamento

```bash
# Fazer backup final do repo Fastify
cd /c/Projetos/halalsphere-backend
git bundle create halalsphere-backend-fastify-final.bundle --all

# Mover para armazenamento de longo prazo
aws s3 cp halalsphere-backend-fastify-final.bundle s3://halalsphere-archives/backups/

# Arquivar repo no GitHub
# Settings → General → Archive this repository
```

---

## 🔄 Plano de Rollback

### Rollback de Módulo Individual

Se um módulo NestJS apresentar problemas:

```nginx
# nginx - reverter rota específica para Fastify
location ~ ^/api/v1/processes {
    proxy_pass http://fastify_backend;  # Voltar para Fastify
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx

# Verificar
curl https://api.halalsphere.com/api/v1/processes
# Deve voltar a funcionar via Fastify
```

### Rollback Completo

Se houver problemas críticos no NestJS:

```bash
# 1. Atualizar nginx para rotear 100% para Fastify
cat > /etc/nginx/conf.d/halalsphere.conf << 'EOF'
upstream backend {
    server localhost:3333;  # Fastify
}

location /api/ {
    proxy_pass http://backend;
}
EOF

sudo nginx -t
sudo systemctl reload nginx

# 2. Escalar Fastify
aws ecs update-service \
  --cluster halalsphere-production-cluster \
  --service halalsphere-backend-fastify \
  --desired-count 3

# 3. Escalar down NestJS
aws ecs update-service \
  --cluster halalsphere-production-cluster \
  --service halalsphere-backend-nestjs \
  --desired-count 0

# 4. Verificar saúde do sistema
curl https://api.halalsphere.com/health
curl https://api.halalsphere.com/api/v1/processes
```

### Rollback de Banco de Dados

Se houver migration problemática:

```bash
# Prisma não suporta rollback automático
# Precisa criar migration reversa manualmente

cd /c/Projetos/halalsphere-backend-nest

# Criar migration que reverte mudanças
npx prisma migrate dev --name revert_last_migration

# Deploy
npx prisma migrate deploy
```

---

## 🔒 Segurança e Compliance

### Checklist de Segurança

- [ ] Variáveis sensíveis no AWS Secrets Manager
- [ ] JWT keys únicas entre Fastify e NestJS (ou compartilhadas se necessário)
- [ ] Rate limiting configurado em ambos
- [ ] CORS configurado corretamente
- [ ] Helmet.js (NestJS equivalente)
- [ ] Input validation em todos os endpoints
- [ ] SQL injection protegido (Prisma)
- [ ] XSS protegido
- [ ] HTTPS enforced
- [ ] Security headers configurados
- [ ] Dependências sem vulnerabilidades conhecidas

```bash
# Verificar vulnerabilidades
cd /c/Projetos/halalsphere-backend-nest
npm audit
npm audit fix
```

---

## 📊 Métricas de Sucesso

### KPIs da Migração

| Métrica | Meta | Método de Medição |
|---------|------|-------------------|
| **Uptime** | ≥ 99.9% | CloudWatch + PagerDuty |
| **Error Rate** | < 0.1% | CloudWatch Metrics |
| **P95 Response Time** | < 500ms | CloudWatch + New Relic |
| **Database Queries** | < 100ms (avg) | Prisma logging |
| **Rollbacks** | 0 | Manual tracking |
| **Incidents** | < 2 (minor) | PagerDuty |
| **User Complaints** | 0 | Support tickets |

### Comparação Performance

| Endpoint | Fastify (atual) | NestJS (meta) |
|----------|----------------|---------------|
| GET /processes | 120ms | < 150ms |
| POST /requests | 250ms | < 300ms |
| GET /certificates | 80ms | < 100ms |

---

## 🗓️ Timeline Sugerido

### Cenário Conservador (3 meses)

| Fase | Duração | Atividades | Entregável |
|------|---------|------------|------------|
| **Preparação** | 2 semanas | Infra dual, CI/CD, docs | Ambientes prontos |
| **Módulos Low-Risk** | 3 semanas | Health, Certificate, Notification | 3 módulos em prod |
| **Módulos Medium-Risk** | 4 semanas | Auditor, Document, Contract | 6 módulos em prod |
| **Módulos High-Risk** | 5 semanas | Process, Request, Payment | 9 módulos em prod |
| **Estabilização** | 2 semanas | Monitoramento intensivo | 100% tráfego NestJS |
| **Descomissionamento** | 2 semanas | Remover Fastify | Fastify offline |

**Total: ~12 semanas (3 meses)**

### Cenário Agressivo (1.5 meses)

| Fase | Duração | Atividades |
|------|---------|------------|
| **Preparação** | 1 semana | Infra rápida |
| **Módulos em paralelo** | 3 semanas | Migrar 3-4 módulos por semana |
| **Módulos críticos** | 2 semanas | Process + Request |
| **Estabilização** | 1 semana | Monitoramento |
| **Cleanup** | 1 semana | Remover Fastify |

**Total: ~6-8 semanas**

**Nota:** Cenário agressivo recomendado apenas se:
- Equipe grande e experiente
- Testes 100% passando
- Staging validado por semanas

---

## 🎯 Próximos Passos Imediatos

### Esta Semana

1. **Corrigir testes falhando** (~2h)
   - [BUILD-TEST-STATUS-2026-01-19.md](../migration-updates/BUILD-TEST-STATUS-2026-01-19.md#plano-de-correção)
   - Mocks de transação
   - Assertions de controller

2. **Setup ambiente staging NestJS**
   - Provisionar ECS task
   - Configurar CI/CD
   - Deploy primeira versão

3. **Documentar estratégia escolhida**
   - Criar ADR (Architecture Decision Record)
   - Comunicar para equipe e stakeholders

### Próximas 2 Semanas

4. **Migrar primeiro módulo (Health)**
   - Deploy staging
   - Configurar nginx
   - Monitorar 48h
   - Deploy produção

5. **Configurar monitoramento completo**
   - CloudWatch Dashboards
   - Alarmes
   - Logs estruturados

6. **Treinar equipe**
   - Workshop NestJS
   - Runbook de operação
   - Plano de rollback

---

## 📚 Recursos Adicionais

### Documentação Relacionada

- [DEPLOYMENT.md](../IMPLEMENTATION-HISTORY/NESTJS-MIGRATION-PHASES/DEPLOYMENT.md)
- [MULTI-REPO-DEVELOPMENT-GUIDE.md](./MULTI-REPO-DEVELOPMENT-GUIDE.md)
- [BUILD-TEST-STATUS.md](../migration-updates/BUILD-TEST-STATUS-2026-01-19.md)
- [AWS-CONFIG-MANAGEMENT.md](../ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md)

### Links Úteis

- [NestJS Production Best Practices](https://docs.nestjs.com/faq/serverless)
- [Strangler Fig Pattern (Martin Fowler)](https://martinfowler.com/bliki/StranglerFigApplication.html)
- [AWS ECS Deployment Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)
- [Blue-Green Deployment Guide](https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/bluegreen-deployments.html)

---

## ✅ Checklist Final

Antes de considerar a migração completa:

### Técnico
- [ ] 100% testes passando (unit + E2E + integração)
- [ ] Performance igual ou melhor que Fastify
- [ ] Zero erros críticos em logs
- [ ] Monitoramento configurado
- [ ] Alarmes testados
- [ ] Rollback testado e documentado

### Operacional
- [ ] Runbook de produção criado
- [ ] Equipe treinada
- [ ] Documentação atualizada
- [ ] On-call preparado
- [ ] PagerDuty configurado

### Negócio
- [ ] Stakeholders alinhados
- [ ] Timeline comunicado
- [ ] Plano de contingência aprovado
- [ ] Janela de manutenção agendada (se necessário)

---

**Última atualização:** 2026-01-19
**Autor:** HalalSphere Technical Team
**Versão:** 1.0
**Status:** Draft para Aprovação