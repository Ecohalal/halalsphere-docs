# ⚡ EXECUTAR AGORA: Comandos para Correção de Upload

**ATENÇÃO:** Este arquivo contém os comandos exatos para implementar a correção.
**Execute na ordem indicada.**

---

## 📍 PASSO 1: BANCO DE DADOS (5 minutos)

### **1.1. Conectar ao Banco**

```bash
# Conectar ao PostgreSQL
psql -U postgres -d halalsphere

# Ou se estiver usando outro usuário:
psql -U seu_usuario -d halalsphere
```

### **1.2. Executar Migration**

**Copie e cole no terminal do psql:**

```sql
-- ============================================================================
-- MIGRATION: Adicionar request_id à tabela documents
-- ============================================================================

-- Verificar se a tabela documents existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'documents'
    ) THEN
        RAISE EXCEPTION 'Tabela documents não existe!';
    END IF;
END $$;

-- STEP 1: Adicionar coluna request_id
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS request_id UUID;

-- STEP 2: Criar índice
CREATE INDEX IF NOT EXISTS idx_documents_request_id
ON documents(request_id);

-- STEP 3: Adicionar foreign key
ALTER TABLE documents
ADD CONSTRAINT fk_documents_request_id
FOREIGN KEY (request_id)
REFERENCES requests(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- STEP 4: Verificar resultado
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'documents'
AND column_name = 'request_id';
```

**Resultado esperado:**
```
column_name | data_type | is_nullable
------------|-----------|------------
request_id  | uuid      | YES
```

✅ Se você viu isso, está OK! Siga para o próximo passo.

---

## 📍 PASSO 2: PRISMA SCHEMA (10 minutos)

### **2.1. Localizar arquivo Prisma**

```bash
# No backend, localizar arquivo schema.prisma
cd /caminho/do/backend
find . -name "schema.prisma"

# Geralmente está em:
# - prisma/schema.prisma
# - src/prisma/schema.prisma
```

### **2.2. Editar schema.prisma**

**Abra o arquivo e localize o model `Document`:**

```prisma
model Document {
  id          String   @id @default(uuid())

  // ========================================
  // ADICIONE ESTAS 2 LINHAS AQUI:
  // ========================================
  requestId   String?  @map("request_id")
  request     Request? @relation(fields: [requestId], references: [id], onDelete: Cascade)

  // ... resto dos campos existentes ...

  fileName    String
  fileUrl     String
  // etc...

  // ========================================
  // ADICIONE ESTE ÍNDICE NO FINAL DO MODEL:
  // ========================================
  @@index([requestId])

  @@map("documents")
}
```

**Agora localize o model `Request` e adicione:**

```prisma
model Request {
  id         String      @id @default(uuid())

  // ========================================
  // ADICIONE ESTA LINHA:
  // ========================================
  documents  Document[]

  // ... resto dos campos existentes ...

  @@map("requests")
}
```

### **2.3. Gerar Prisma Client**

```bash
# No diretório do backend
cd /caminho/do/backend

# Gerar Prisma Client
npx prisma generate

# Verificar se compilou
npm run build
```

✅ Se compilou sem erros, está OK!

---

## 📍 PASSO 3: DOCUMENT SERVICE (15 minutos)

### **3.1. Localizar DocumentService**

```bash
# Encontrar arquivo do DocumentService
find . -name "*document*.service.ts"

# Geralmente está em:
# - src/document/document.service.ts
# - src/modules/document/document.service.ts
```

### **3.2. Modificar método uploadDocument**

**Abra o arquivo e SUBSTITUA o método `uploadDocument` por este:**

```typescript
/**
 * Upload de documento vinculado a um request
 */
async uploadDocument(
  requestId: string,              // 🎯 NOVO PARÂMETRO
  file: Express.Multer.File,
  documentType: DocumentType,
  uploadedBy: string,
  description?: string,
) {
  // 1. Validar se o request existe
  const request = await this.prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new NotFoundException(`Request ${requestId} not found`);
  }

  // 2. Fazer upload do arquivo
  let fileUrl: string;
  try {
    fileUrl = await this.storageService.uploadFile(file);
  } catch (error) {
    throw new BadRequestException(`Failed to upload file: ${error.message}`);
  }

  // 3. Criar documento COM request_id
  const document = await this.prisma.document.create({
    data: {
      fileName: file.originalname,
      fileUrl: fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      documentType: documentType,
      description: description,
      requestId: requestId,        // 🎯 VINCULA AO REQUEST
      uploadedBy: uploadedBy,
      status: 'PENDING',
    },
  });

  console.log(`[DocumentService] Document uploaded: ${document.id} -> Request: ${requestId}`);

  return document;
}
```

### **3.3. Adicionar método de busca**

**ADICIONE este método no DocumentService:**

```typescript
/**
 * Buscar documentos de um request
 */
async getDocumentsByRequest(requestId: string) {
  const request = await this.prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new NotFoundException(`Request ${requestId} not found`);
  }

  return this.prisma.document.findMany({
    where: { requestId: requestId },
    orderBy: { createdAt: 'desc' },
    include: {
      uploader: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
}
```

---

## 📍 PASSO 4: DOCUMENT CONTROLLER (10 minutos)

### **4.1. Localizar DocumentController**

```bash
# Encontrar arquivo do DocumentController
find . -name "*document*.controller.ts"

# Geralmente está em:
# - src/document/document.controller.ts
# - src/modules/document/document.controller.ts
```

### **4.2. Modificar endpoint de upload**

**Abra o arquivo e SUBSTITUA o método de upload por este:**

```typescript
/**
 * Upload de documento
 */
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadDocument(
  @UploadedFile() file: Express.Multer.File,
  @Body('requestId') requestId: string,         // 🎯 NOVO PARÂMETRO
  @Body('documentType') documentType: DocumentType,
  @Body('description') description: string,
  @Request() req,
) {
  // Validações
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  if (!requestId) {
    throw new BadRequestException('requestId is required');
  }

  if (!documentType) {
    throw new BadRequestException('documentType is required');
  }

  return this.documentService.uploadDocument(
    requestId,                                   // 🎯 PASSA REQUEST_ID
    file,
    documentType,
    req.user.id,
    description,
  );
}
```

### **4.3. Adicionar endpoint de busca**

**ADICIONE este método no DocumentController:**

```typescript
/**
 * Buscar documentos de um request
 */
@Get('request/:requestId')
async getDocumentsByRequest(@Param('requestId') requestId: string) {
  return this.documentService.getDocumentsByRequest(requestId);
}
```

### **4.4. Compilar e iniciar backend**

```bash
# Compilar
npm run build

# Iniciar em modo dev
npm run start:dev

# Verificar logs - deve iniciar sem erros
```

✅ Backend está rodando? Continue!

---

## 📍 PASSO 5: FRONTEND (20 minutos)

### **5.1. Localizar service de documentos**

```bash
# No frontend, encontrar service de documentos
cd /caminho/do/frontend
find . -name "*document*.service.ts"

# Pode estar em:
# - src/services/document.service.ts
# - src/api/document.service.ts
```

### **5.2. Modificar método de upload**

**Abra o arquivo e MODIFIQUE o método de upload:**

```typescript
// ANTES:
async uploadDocument(file: File, documentType: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  return axios.post('/documents/upload', formData);
}

// DEPOIS:
async uploadDocument(requestId: string, file: File, documentType: string, description?: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('requestId', requestId);      // 🎯 ADICIONAR REQUEST_ID
  formData.append('documentType', documentType);

  if (description) {
    formData.append('description', description);
  }

  return axios.post('/documents/upload', formData, {
    headers: {
      'Authorization': `Bearer ${this.getToken()}`,
    }
  });
}
```

### **5.3. Atualizar componente de upload**

**Localize o componente que faz upload (wizard, formulário, etc):**

```bash
# Encontrar componente de upload
grep -r "uploadDocument" src/
```

**Modifique para passar requestId:**

```typescript
// ANTES:
await documentService.uploadDocument(file, 'CONTRATO_SOCIAL');

// DEPOIS:
await documentService.uploadDocument(requestId, file, 'CONTRATO_SOCIAL');
```

**Exemplo completo de fluxo:**

```typescript
// Após criar processo/request
const handleSubmit = async () => {
  // 1. Criar processo (retorna requestId)
  const response = await processService.createProcess(formData);
  const requestId = response.data.id;

  // 2. Upload documentos vinculados ao requestId
  for (const file of selectedFiles) {
    await documentService.uploadDocument(
      requestId,           // 🎯 PASSA REQUEST_ID
      file,
      'CONTRATO_SOCIAL',
      file.name,
    );
  }

  // 3. Redirecionar
  navigate(`/processes/${requestId}`);
};
```

---

## 📍 PASSO 6: TESTAR (10 minutos)

### **6.1. Teste via Postman/Thunder Client**

**Teste 1: Criar Request**
```
POST http://localhost:3333/requests
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "companyName": "Empresa Teste",
  "cnpj": "12345678000199"
}
```

**Copie o `id` do response (requestId)**

**Teste 2: Upload Documento**
```
POST http://localhost:3333/documents/upload
Authorization: Bearer SEU_TOKEN
Content-Type: multipart/form-data

Body (form-data):
  file: [selecionar arquivo]
  requestId: [colar requestId do teste 1]
  documentType: CONTRATO_SOCIAL
```

**Resultado esperado:** Status 201, com `requestId` no response

**Teste 3: Buscar Documentos**
```
GET http://localhost:3333/documents/request/[requestId]
Authorization: Bearer SEU_TOKEN
```

**Resultado esperado:** Array com documento uploadado

✅ Funcionou? Parabéns!

### **6.2. Teste no Frontend**

1. Acesse o wizard de criação de processo
2. Preencha o formulário
3. Anexe documentos
4. Submeta
5. Verifique que não há erros 404
6. Verifique que documentos aparecem na lista

---

## 📍 PASSO 7: REMOVER CÓDIGO ANTIGO (10 minutos)

### **7.1. Remover retry logic**

**No DocumentService, REMOVA:**
- ✂️ Loop de 10 tentativas de retry
- ✂️ Delays e backoff exponencial
- ✂️ Método `isRequestReady()` (se existir)

**No DocumentController, REMOVA:**
- ✂️ Endpoint `/request/:id/ready` (se existir)

**No Frontend, REMOVA:**
- ✂️ Função `checkRequestReady()` (se existir)
- ✂️ Delays antes do upload

### **7.2. Compilar tudo novamente**

```bash
# Backend
cd /caminho/do/backend
npm run build
npm run start:dev

# Frontend
cd /caminho/do/frontend
npm run build
npm run dev
```

---

## ✅ CHECKLIST FINAL

- [ ] Migration executada no banco
- [ ] Prisma schema atualizado
- [ ] Prisma client gerado
- [ ] DocumentService modificado
- [ ] DocumentController modificado
- [ ] Backend compilando sem erros
- [ ] Frontend service modificado
- [ ] Frontend componente modificado
- [ ] Teste 1: Upload funciona
- [ ] Teste 2: Busca funciona
- [ ] Teste 3: Frontend completo funciona
- [ ] Código antigo removido
- [ ] Build final sem erros

---

## 🎉 PRONTO!

Se todos os testes passaram, a correção está implementada!

**Próximos passos:**
1. Monitorar logs por 24-48h
2. Verificar que não há mais erros 404
3. Confirmar que uploads estão 100% funcionais

---

## 🚨 SE ALGO DEU ERRADO

### **Rollback do Banco:**
```sql
ALTER TABLE documents DROP CONSTRAINT IF EXISTS fk_documents_request_id;
DROP INDEX IF EXISTS idx_documents_request_id;
ALTER TABLE documents DROP COLUMN IF EXISTS request_id;
```

### **Rollback do Código:**
```bash
git checkout -- prisma/schema.prisma
git checkout -- src/document/
npm run build
```

---

**Status:** ✅ Pronto para executar
**Tempo estimado:** 1-2 horas
**Dificuldade:** 🟢 Baixa
