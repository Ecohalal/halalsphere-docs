# Sistema de Configuração de Armazenamento - HalalSphere

## 📋 Visão Geral

Sistema completo de gerenciamento de armazenamento de documentos com suporte para:
- **Armazenamento Local**: Pasta no servidor
- **AWS S3**: Buckets na nuvem Amazon
- **Buckets por Empresa**: Cada empresa tem seu próprio espaço de armazenamento isolado

## 🗂️ Estrutura Implementada

### Backend

#### 1. Models do Prisma (`schema.prisma`)

```prisma
enum StorageProvider {
  local
  s3
}

model StorageConfig {
  id                String          @id
  provider          StorageProvider
  localPath         String?         // Para armazenamento local
  s3Region          String?         // Para AWS S3
  s3AccessKeyId     String?
  s3SecretAccessKey String?
  s3Endpoint        String?
  isActive          Boolean
  companyBuckets    CompanyBucket[]
}

model CompanyBucket {
  id              String
  companyId       String
  storageConfigId String
  bucketName      String
  bucketPath      String?
  totalSize       BigInt
  fileCount       Int
  lastSyncAt      DateTime
  isActive        Boolean
}
```

#### 2. Serviços de Armazenamento

**Interface Abstrata** (`storage-provider.interface.ts`)
- Define contrato comum para todos os provedores

**LocalStorageProvider** (`local-storage.provider.ts`)
- Implementação para armazenamento em disco local
- Suporta organização por empresa (`companies/{companyId}/`)

**S3StorageProvider** (`s3-storage.provider.ts`)
- Implementação para AWS S3
- Cada empresa pode ter seu próprio bucket

**StorageManager** (`storage-manager.service.ts`)
- Gerenciador central que escolhe o provider ativo
- Carrega configuração do banco de dados
- Gerencia buckets por empresa

#### 3. API Endpoints

**Configurações** (`/api/storage-configs`)
- `GET /storage-configs` - Listar configurações
- `GET /storage-configs/active` - Obter configuração ativa
- `POST /storage-configs` - Criar configuração
- `PATCH /storage-configs/:id` - Atualizar configuração
- `POST /storage-configs/:id/activate` - Ativar configuração
- `DELETE /storage-configs/:id` - Deletar configuração
- `POST /storage-configs/:id/test` - Testar conexão

**Buckets de Empresas**
- `GET /storage-configs/buckets` - Listar todos os buckets
- `GET /storage-configs/buckets/:companyId/stats` - Estatísticas de bucket

### Frontend

#### 1. Tela de Configurações (`/admin/armazenamento`)

**Componentes:**
- `StorageSettings.tsx` - Tela principal
- Gerenciamento de configurações (criar, ativar, testar, deletar)
- Visualização de buckets por empresa
- Estatísticas de uso

**Service** (`storage-config.service.ts`)
- Comunicação com API
- Métodos para todas as operações de configuração

## 🚀 Como Usar

### 1. Executar Migração do Banco de Dados

```bash
cd backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npx prisma migrate dev --name add_storage_configuration
npx prisma generate
```

### 2. Configurar Armazenamento Local

1. Acesse o sistema como **Admin**
2. Navegue para `/admin/armazenamento`
3. Clique em **"Nova Configuração"**
4. Selecione **"Local"**
5. Digite o caminho: `/var/www/halalsphere/uploads` (ou caminho desejado)
6. Clique em **"Criar Configuração"**
7. Clique em **"Ativar"** na configuração criada

### 3. Configurar AWS S3

1. **Criar IAM User na AWS:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::halalsphere-*/*",
           "arn:aws:s3:::halalsphere-*"
         ]
       }
     ]
   }
   ```

2. **No Sistema:**
   - Acesse `/admin/armazenamento`
   - Clique em **"Nova Configuração"**
   - Selecione **"AWS S3"**
   - Preencha:
     - **Região**: `us-east-1` (ou sua região)
     - **Access Key ID**: Sua access key
     - **Secret Access Key**: Sua secret key
     - **Endpoint** (opcional): Para S3-compatible services
   - Clique em **"Criar Configuração"**
   - Teste a configuração clicando em **"Testar"**
   - Se OK, clique em **"Ativar"**

## 📊 Organização de Arquivos

### Armazenamento Local

```
uploads/
├── companies/
│   ├── {company-id-1}/
│   │   ├── documents/
│   │   │   ├── file1.pdf
│   │   │   └── file2.pdf
│   │   └── images/
│   │       └── logo.png
│   └── {company-id-2}/
│       ├── documents/
│       └── certificates/
└── temp/
```

### AWS S3

**Opção 1: Bucket único com pastas por empresa**
```
halalsphere-documents/
├── companies/
│   ├── {company-id-1}/
│   │   ├── documents/
│   │   └── certificates/
│   └── {company-id-2}/
│       ├── documents/
│       └── certificates/
```

**Opção 2: Bucket por empresa (recomendado)**
```
halalsphere-company-{id-1}/
├── documents/
├── certificates/
└── audits/

halalsphere-company-{id-2}/
├── documents/
└── certificates/
```

## 🔐 Segurança

### Permissões AWS S3
- Use IAM Roles quando possível
- Restrinja acesso apenas aos buckets necessários
- Habilite versionamento de objetos
- Configure lifecycle policies para otimizar custos

### Credenciais
- As credenciais S3 são armazenadas criptografadas no banco
- Apenas admins podem criar/editar configurações
- Logs de auditoria registram todas as alterações

## 🎯 Fluxo de Upload

1. **Empresa faz upload de documento:**
   - Sistema identifica a empresa
   - Verifica se existe bucket para a empresa
   - Se não existe, cria automaticamente
   - Upload é feito para o bucket da empresa

2. **Storage Manager:**
   - Carrega configuração ativa do banco
   - Instancia o provider correto (Local ou S3)
   - Delega operação para o provider

3. **Provider:**
   - Executa upload no destino configurado
   - Retorna URL pública do arquivo
   - Atualiza metadados no banco

## 📈 Monitoramento

### Estatísticas por Empresa
- Total de arquivos
- Tamanho total (em bytes/GB)
- Última sincronização
- Provider utilizado

### Dashboard Admin
- Lista de todas as configurações
- Configuração ativa destacada
- Lista de buckets por empresa
- Status de cada bucket

## 🔄 Migração de Provider

Para migrar de Local para S3 (ou vice-versa):

1. Criar nova configuração com o provider destino
2. Testar a configuração
3. **NÃO ativar ainda**
4. Executar script de migração (a implementar):
   ```bash
   npm run migrate-storage --from=local --to=s3
   ```
5. Ativar nova configuração
6. Validar que uploads estão funcionando
7. Deletar configuração antiga

## 🛠️ Desenvolvimento

### Adicionar Novo Provider

1. Criar classe que implementa `StorageProvider`
2. Adicionar novo enum em `schema.prisma`
3. Atualizar `StorageManager` para instanciar o novo provider
4. Atualizar frontend para suportar nova configuração

### Exemplo: Google Cloud Storage

```typescript
import { StorageProvider } from './storage-provider.interface';

export class GCSStorageProvider implements StorageProvider {
  // Implementar todos os métodos da interface
  async uploadFile(params) { ... }
  async deleteFile(filepath) { ... }
  // ...
}
```

## 📝 Notas Importantes

1. **Apenas uma configuração pode estar ativa por vez**
2. **Não é possível deletar a configuração ativa**
3. **Buckets são criados automaticamente no primeiro upload**
4. **URLs dos arquivos são armazenados no banco de dados**
5. **Ao trocar de provider, URLs antigas continuam válidas se os arquivos não forem migrados**

## 🐛 Troubleshooting

### "No active storage configuration found"
- Criar e ativar uma configuração em `/admin/armazenamento`

### "S3 connection test failed"
- Verificar credenciais AWS
- Verificar região configurada
- Verificar permissões IAM

### "File not found"
- Verificar se arquivo existe no storage
- Verificar permissões de leitura
- Verificar se URL está correta no banco

## 📚 Referências

- [AWS S3 SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [Prisma Documentation](https://www.prisma.io/docs/)
