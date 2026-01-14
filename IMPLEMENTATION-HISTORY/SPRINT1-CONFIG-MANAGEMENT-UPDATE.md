# Sprint 1 - Update: AWS Config Management

**Data:** 2026-01-12
**Status:** ✅ Implementado

## 📋 Motivação

Ajuste na estratégia de configuração para seguir melhores práticas de segurança AWS:

- **Antes:** Todas as variáveis passadas via environment variables no container
- **Depois:** Segregação entre configs não sensíveis (Parameter Store) e sensíveis (Secrets Manager)

## 🔐 Nova Estratégia

### Parameter Store (Não Sensíveis)

**Path:** `/halalsphere/{env}/config/*`

Configurações públicas ou não sensíveis:
- `cors_origin`
- `frontend_url`
- `base_url`
- `smtp_host`
- `smtp_port`
- `smtp_from_email`
- `smtp_from_name`
- `require_email_verification`
- `aws_region`

**Custo:** Gratuito (até 10.000 parâmetros)

### Secrets Manager (Sensíveis)

**Secret Name:** `halalsphere/{env}/secrets`

JSON contendo:
```json
{
  "SQL_HALALSPHERE_CONNECTION": "...",
  "REDIS_URL": "...",
  "JWT_SECRET": "...",
  "JWT_EXPIRES_IN": "...",
  "SMTP_USER": "...",
  "SMTP_PASSWORD": "..."
}
```

**Nota:** Credenciais AWS (AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY) foram removidas pois o ECS usa IAM Roles para permissões

**Custo:** $0.40/mês por secret + $0.05 por 10k API calls

## 🏗️ Arquivos Implementados

### 1. ConfigLoader Service
**Arquivo:** `backend/src/services/aws/config-loader.service.ts`

**Responsabilidades:**
- Carregar configs do Parameter Store (não sensíveis)
- Carregar secrets do Secrets Manager (sensíveis)
- Fallback para environment variables em dev
- Aplicar configs ao `process.env` para compatibilidade

**Comportamento por Ambiente:**

| Ambiente | Parameter Store | Secrets Manager | Env Vars Local |
|----------|----------------|-----------------|----------------|
| **development** | ❌ Não usa | ❌ Não usa | ✅ Usa (.env) |
| **staging** | ✅ Usa | ✅ Usa | ⚠️ Fallback |
| **production** | ✅ Usa | ✅ Usa | ⚠️ Fallback |

**API:**
```typescript
// Inicializar (no startup)
await configLoader.initialize();

// Aplicar ao process.env
configLoader.applyToEnvironment();

// Obter config específica
const jwtSecret = configLoader.get('jwtSecret');

// Obter todas
const config = configLoader.getAll();

// Verificar se inicializado
configLoader.isInitialized();
```

### 2. Storage Manager Update
**Arquivo:** `backend/src/services/storage/storage-manager.service.ts`

**Mudanças:**
- Agora busca credenciais AWS do `configLoader` em vez de `process.env`
- Garante que `configLoader` está inicializado antes de acessar
- Erro claro se secrets não estiverem configurados em prod/staging

**Antes:**
```typescript
const s3AccessKeyId = process.env.AWS_ACCESS_KEY_ID;
```

**Depois:**
```typescript
if (!configLoader.isInitialized()) {
  throw new Error('ConfigLoader not initialized');
}
const s3AccessKeyId = configLoader.get('awsAccessKeyId');
```

### 3. Server Startup
**Arquivo:** `backend/src/server.ts`

**Mudanças:**
```typescript
async function start() {
  // 1. Carregar configurações PRIMEIRO
  await configLoader.initialize();
  configLoader.applyToEnvironment();

  // 2. Depois registrar plugins/routes
  await registerPlugins();
  await registerRoutes();

  // 3. Iniciar servidor
  await fastify.listen({ port, host });
}
```

### 4. Package.json
**Arquivo:** `backend/package.json`

**Novas dependências:**
```json
{
  "@aws-sdk/client-secrets-manager": "^3.948.0",
  "@aws-sdk/client-ssm": "^3.948.0"
}
```

### 5. Documentação
**Arquivo:** `docs/ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md`

Guia completo sobre:
- Estrutura de Parameter Store
- Estrutura de Secrets Manager
- Como criar parâmetros via CLI e Terraform
- IAM permissions necessárias
- Como testar localmente
- Rotação de secrets
- Monitoramento

### 6. Dockerfile Update
**Arquivo:** `backend/Dockerfile`

Atualizado header com:
- Explicação da estratégia de config
- Variáveis necessárias por ambiente
- Referência para documentação completa

## 🔑 IAM Permissions Necessárias

O ECS Task Role precisa de:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": "arn:aws:ssm:*:*:parameter/halalsphere/*/config/*"
    },
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": "arn:aws:secretsmanager:*:*:secret:halalsphere/*/secrets-*"
    },
    {
      "Effect": "Allow",
      "Action": ["kms:Decrypt"],
      "Resource": "arn:aws:kms:*:*:key/*"
    }
  ]
}
```

## 🧪 Testando Localmente

### Opção 1: Development Mode (Recomendado)
```bash
# backend/.env
NODE_ENV=development
SQL_HALALSPHERE_CONNECTION=postgresql://...
JWT_SECRET=local-secret
# ... demais variáveis

npm run dev
```

**Resultado:** Usa variáveis locais, não acessa AWS

### Opção 2: Staging Mode (Testar AWS)
```bash
# Configurar AWS CLI
aws configure --profile halalsphere-staging

# Usar profile
export AWS_PROFILE=halalsphere-staging
export NODE_ENV=staging

npm run dev
```

**Resultado:** Carrega do Parameter Store e Secrets Manager do staging

### Opção 3: LocalStack (AWS Local)
```bash
# docker-compose.yml com LocalStack
docker-compose up -d localstack

# Criar parâmetros no LocalStack
aws --endpoint-url=http://localhost:4566 ssm put-parameter \
  --name /halalsphere/staging/config/cors_origin \
  --type String \
  --value "http://localhost:5173"

# Configurar app
export AWS_ENDPOINT_URL=http://localhost:4566
export NODE_ENV=staging
npm run dev
```

## 📦 Setup para Production

### 1. Criar Parâmetros no Parameter Store

```bash
# Script de setup
./scripts/setup-parameter-store.sh production
```

Ou manualmente:
```bash
aws ssm put-parameter \
  --name /halalsphere/production/config/cors_origin \
  --type String \
  --value "https://app.halalsphere.com"

aws ssm put-parameter \
  --name /halalsphere/production/config/frontend_url \
  --type String \
  --value "https://app.halalsphere.com"

# ... demais parâmetros
```

### 2. Criar Secret no Secrets Manager

```bash
aws secretsmanager create-secret \
  --name halalsphere/production/secrets \
  --description "HalalSphere Production Secrets" \
  --secret-string '{
    "SQL_HALALSPHERE_CONNECTION": "postgresql://...",
    "REDIS_URL": "redis://...",
    "JWT_SECRET": "...",
    "JWT_EXPIRES_IN": "7d",
    "SMTP_USER": "...",
    "SMTP_PASSWORD": "..."
  }'
```

### 3. Configurar ECS Task Definition

```json
{
  "containerDefinitions": [{
    "environment": [
      { "name": "NODE_ENV", "value": "production" },
      { "name": "AWS_REGION", "value": "us-east-1" },
      { "name": "PORT", "value": "3333" },
      { "name": "TRUST_PROXY", "value": "true" }
    ]
  }],
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/halalsphere-ecs-task-role"
}
```

**Nota:** Não precisa passar SQL_HALALSPHERE_CONNECTION, JWT_SECRET, etc - serão carregados automaticamente do AWS!

**Importante:** Não é necessário passar AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY como variáveis de ambiente. O ECS Task Role já possui as permissões necessárias via IAM.

## 🔄 Fluxo de Inicialização

```mermaid
graph TD
    A[Container Start] --> B[configLoader.initialize]
    B --> C{NODE_ENV?}
    C -->|development| D[Load from .env]
    C -->|staging/production| E[Load from AWS]
    E --> F[Parameter Store: /halalsphere/{env}/config/*]
    E --> G[Secrets Manager: halalsphere/{env}/secrets]
    F --> H[Merge configs]
    G --> H
    D --> H
    H --> I[configLoader.applyToEnvironment]
    I --> J[Register Plugins]
    J --> K[Register Routes]
    K --> L[Start Server]
```

## ✅ Vantagens da Nova Estratégia

1. **Segurança:**
   - ✅ Secrets não expostos em environment variables
   - ✅ Criptografia automática com KMS
   - ✅ Auditoria via CloudTrail
   - ✅ Rotação automática de secrets

2. **Manutenção:**
   - ✅ Configs centralizadas no AWS
   - ✅ Não precisa rebuild de container para trocar config
   - ✅ Versionamento de parâmetros
   - ✅ Rollback fácil de secrets

3. **Custo:**
   - ✅ Parameter Store gratuito
   - ✅ Secrets Manager: ~$0.40/mês total
   - ✅ Sem custo de infraestrutura adicional

4. **Developer Experience:**
   - ✅ Dev local usa .env (simples)
   - ✅ Staging/Prod usa AWS (seguro)
   - ✅ Fallback automático se AWS falhar

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Secrets no container** | ✅ Sim (env vars) | ❌ Não (carrega do AWS) |
| **Rebuild para config** | ✅ Sim | ❌ Não |
| **Auditoria** | ❌ Difícil | ✅ CloudTrail |
| **Rotação** | ❌ Manual | ✅ Automática |
| **Criptografia** | ❌ Não | ✅ KMS |
| **Versionamento** | ❌ Não | ✅ Sim |
| **Custo** | $0 | ~$0.40/mês |
| **Setup inicial** | Simples | Moderado |
| **Dev local** | .env | .env (igual) |

## 🚀 Próximos Passos

### Sprint 2 - Terraform
- Criar módulo Terraform para Parameter Store
- Criar módulo Terraform para Secrets Manager
- Configurar IAM roles com permissões corretas
- Adicionar CloudWatch alarms para falhas de acesso

### Opcional (Futuro)
- Rotação automática de secrets (Lambda)
- Integration com HashiCorp Vault
- Cache local de configs para reduzir API calls
- Webhook para reload de configs sem restart

## 📚 Documentação Relacionada

- [AWS-CONFIG-MANAGEMENT.md](../ARCHITECTURE/AWS-CONFIG-MANAGEMENT.md) - Guia completo
- [SPRINT1-COMPLETED.md](./SPRINT1-COMPLETED.md) - Resumo Sprint 1
- [ROADMAP-COMPLETO-2026.md](../../ROADMAP-COMPLETO-2026.md) - Roadmap geral

---

**Status:** ✅ Implementado e documentado
**Impact:** 🟢 Melhoria significativa de segurança e manutenibilidade
