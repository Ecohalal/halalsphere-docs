# ✅ Solução Definitiva: Upload de Documentos com request_id

**Data:** 2026-01-19
**Tipo:** Correção Arquitetural
**Prioridade:** 🔴 CRÍTICA

---

## 🎯 Problema Original

O sistema tentava fazer upload de documentos buscando por `request_id`, mas **NÃO HAVIA VÍNCULO** entre a tabela `documents` e a tabela `requests`. Isso causava:

- ❌ Erro `404 Not Found` nos uploads
- ❌ Tentativas de retry infinitas
- ❌ Impossibilidade de buscar documentos de uma solicitação
- ❌ Dados inconsistentes e órfãos

### **Causa Raiz**

```
┌─────────────┐         ❌ SEM VÍNCULO!         ┌─────────────┐
│  requests   │                                  │  documents  │
├─────────────┤                                  ├─────────────┤
│ id (PK)     │                                  │ id (PK)     │
│ company_id  │ <───────────────────────────────>│ file_name   │
│ status      │         NENHUMA FK!              │ file_url    │
│ ...         │                                  │ ...         │
└─────────────┘                                  └─────────────┘
```

---

## ✅ Solução Implementada

### **Abordagem: Coluna `request_id` na tabela `documents`**

Adicionamos uma **foreign key direta** de `documents` para `requests`, criando um relacionamento 1:N (um request tem muitos documentos).

```
┌─────────────┐                                  ┌─────────────┐
│  requests   │                                  │  documents  │
├─────────────┤         ✅ FOREIGN KEY           ├─────────────┤
│ id (PK)     │ <────────────────────────────────│ id (PK)     │
│ company_id  │                                  │ request_id ──┤ FK
│ status      │                                  │ file_name   │
│ ...         │                                  │ file_url    │
└─────────────┘                                  │ ...         │
                                                 └─────────────┘
```

---

## 📦 Arquivos Criados

### **1. Migration SQL**

📄 [`MIGRATIONS/ADD-REQUEST-ID-TO-DOCUMENTS-2026-01-19.sql`](../MIGRATIONS/ADD-REQUEST-ID-TO-DOCUMENTS-2026-01-19.sql)

**O que faz:**
- ✅ Adiciona coluna `request_id UUID` na tabela `documents`
- ✅ Cria índice para performance
- ✅ Adiciona foreign key constraint com `ON DELETE CASCADE`
- ✅ Inclui verificações e queries de diagnóstico

**Como executar:**
```bash
psql -U postgres -d halalsphere < MIGRATIONS/ADD-REQUEST-ID-TO-DOCUMENTS-2026-01-19.sql
```

### **2. Model Prisma Atualizado**

📄 [`PRISMA/document-model-with-request-id.prisma`](../PRISMA/document-model-with-request-id.prisma)

**Principais mudanças:**
```prisma
model Document {
  id          String   @id @default(uuid())

  // 🎯 NOVO: Vínculo direto com Request
  requestId   String?  @map("request_id")
  request     Request? @relation(fields: [requestId], references: [id], onDelete: Cascade)

  fileName    String
  fileUrl     String
  // ... outros campos

  @@index([requestId]) // Índice para busca rápida
}

model Request {
  id         String      @id @default(uuid())
  documents  Document[]  // 🎯 NOVO: Relação 1:N
}
```

### **3. Guia de Implementação Completo**

📄 [`GUIDES/IMPLEMENTACAO-UPLOAD-COM-REQUEST-ID.md`](../GUIDES/IMPLEMENTACAO-UPLOAD-COM-REQUEST-ID.md)

**Contém:**
- ✅ Código completo do `DocumentService` atualizado
- ✅ Código completo do `DocumentController` atualizado
- ✅ Exemplo de implementação no frontend (React)
- ✅ Testes de integração
- ✅ Checklist de implementação

---

## 🚀 Como Implementar (Passo a Passo)

### **Backend (NestJS)**

#### **1. Executar Migration**

```bash
# Executar SQL no banco de dados
psql -U postgres -d halalsphere < MIGRATIONS/ADD-REQUEST-ID-TO-DOCUMENTS-2026-01-19.sql

# Ou via Prisma (se estiver usando Prisma Migrate)
npx prisma migrate dev --name add-request-id-to-documents
```

#### **2. Atualizar Prisma Schema**

Adicionar ao arquivo `prisma/schema.prisma`:

```prisma
model Document {
  // ... campos existentes ...

  // ADICIONAR:
  requestId   String?  @map("request_id")
  request     Request? @relation(fields: [requestId], references: [id], onDelete: Cascade)

  @@index([requestId])
}

model Request {
  // ... campos existentes ...

  // ADICIONAR:
  documents  Document[]
}
```

Depois:
```bash
npx prisma generate
```

#### **3. Atualizar DocumentService**

Modificar o método de upload para vincular ao request:

```typescript
async uploadDocument(
  requestId: string,
  file: Express.Multer.File,
  documentType: DocumentType,
  uploadedBy: string,
) {
  // Validar request existe
  const request = await this.prisma.request.findUnique({
    where: { id: requestId }
  });

  if (!request) {
    throw new NotFoundException(`Request ${requestId} not found`);
  }

  // Upload e criar documento
  const fileUrl = await this.storageService.uploadFile(file);

  return this.prisma.document.create({
    data: {
      fileName: file.originalname,
      fileUrl: fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
      documentType: documentType,
      requestId: requestId,  // 🎯 VINCULA AO REQUEST
      uploadedBy: uploadedBy,
      status: 'PENDING',
    },
  });
}
```

#### **4. Atualizar DocumentController**

Endpoint de upload deve receber `requestId`:

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadDocument(
  @UploadedFile() file: Express.Multer.File,
  @Body('requestId') requestId: string,
  @Body('documentType') documentType: DocumentType,
  @Request() req,
) {
  return this.documentService.uploadDocument(
    requestId,
    file,
    documentType,
    req.user.id,
  );
}
```

### **Frontend (React/Angular/Vue)**

#### **Modificar Chamada de Upload**

**Antes:**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('documentType', 'CONTRATO_SOCIAL');

await axios.post('/documents/upload', formData);
```

**Depois:**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('requestId', requestId);  // 🎯 ADICIONAR REQUEST_ID
formData.append('documentType', 'CONTRATO_SOCIAL');

await axios.post('/documents/upload', formData);
```

---

## 🧪 Testes

### **Teste 1: Upload e Vínculo**

```bash
# 1. Criar request
POST /requests
Response: { "id": "req-123", ... }

# 2. Upload documento vinculado
POST /documents/upload
Body:
  - file: contrato.pdf
  - requestId: req-123
  - documentType: CONTRATO_SOCIAL

Response: {
  "id": "doc-456",
  "requestId": "req-123",  ✅ VINCULADO!
  "fileName": "contrato.pdf",
  "status": "PENDING"
}

# 3. Buscar documentos do request
GET /documents/request/req-123

Response: [
  {
    "id": "doc-456",
    "requestId": "req-123",
    "fileName": "contrato.pdf"
  }
]
```

### **Teste 2: Integridade Referencial**

```sql
-- Deletar request deve deletar documentos (CASCADE)
DELETE FROM requests WHERE id = 'req-123';

-- Verificar que documentos foram deletados
SELECT * FROM documents WHERE request_id = 'req-123';
-- Deve retornar 0 rows
```

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Vínculo documento-request** | ❌ Inexistente | ✅ Foreign key direta |
| **Upload de documento** | ❌ Falha com 404 | ✅ Funciona perfeitamente |
| **Buscar documentos de request** | ❌ Impossível | ✅ Query simples e rápida |
| **Integridade de dados** | ❌ Documentos órfãos | ✅ Cascade delete automático |
| **Tentativas de retry** | ❌ 10 tentativas | ✅ Não precisa mais |
| **Complexidade do código** | ❌ Alta (retry logic) | ✅ Simples e direto |

---

## ⚠️ Pontos de Atenção

### **1. Documentos Existentes**

Se já existem documentos na tabela sem `request_id`, você precisa:

```sql
-- Verificar quantos documentos órfãos existem
SELECT COUNT(*) FROM documents WHERE request_id IS NULL;

-- Opção A: Migrar automaticamente (se possível)
UPDATE documents d
SET request_id = (
  SELECT r.id FROM requests r
  WHERE r.company_id = d.company_id
  LIMIT 1
)
WHERE d.request_id IS NULL;

-- Opção B: Marcar para revisão manual
-- Documentos com request_id NULL precisarão ser revisados
```

### **2. Tornar Coluna NOT NULL (Opcional)**

Após garantir que todos os documentos têm `request_id`:

```sql
ALTER TABLE documents
ALTER COLUMN request_id SET NOT NULL;
```

### **3. Remover Lógica de Retry Antiga**

Após implementar, você pode remover:
- ✂️ Retry loops com 10 tentativas
- ✂️ Endpoint `/documents/request/:id/ready`
- ✂️ Delays e backoff exponencial

---

## ✅ Checklist de Implementação

- [ ] **Database:** Migration executada
- [ ] **Backend:** Prisma schema atualizado e gerado
- [ ] **Backend:** `DocumentService.uploadDocument()` modificado
- [ ] **Backend:** `DocumentService.getDocumentsByRequest()` implementado
- [ ] **Backend:** `DocumentController` atualizado
- [ ] **Frontend:** Chamada de upload modificada para incluir `requestId`
- [ ] **Testes:** Upload funcionando corretamente
- [ ] **Testes:** Busca de documentos por request funcionando
- [ ] **Testes:** Cascade delete funcionando
- [ ] **Cleanup:** Lógica de retry antiga removida
- [ ] **Deploy:** Alterações em produção

---

## 📚 Arquivos de Referência

1. **Migration SQL:** [`MIGRATIONS/ADD-REQUEST-ID-TO-DOCUMENTS-2026-01-19.sql`](../MIGRATIONS/ADD-REQUEST-ID-TO-DOCUMENTS-2026-01-19.sql)
2. **Prisma Model:** [`PRISMA/document-model-with-request-id.prisma`](../PRISMA/document-model-with-request-id.prisma)
3. **Guia Completo:** [`GUIDES/IMPLEMENTACAO-UPLOAD-COM-REQUEST-ID.md`](../GUIDES/IMPLEMENTACAO-UPLOAD-COM-REQUEST-ID.md)

---

## 🎉 Resultado Esperado

Após implementação:

1. ✅ Upload de documentos funciona **sem race conditions**
2. ✅ Documentos ficam **vinculados automaticamente** ao request
3. ✅ Busca de documentos por request é **instantânea**
4. ✅ Integridade referencial **garantida por FK**
5. ✅ Código **mais simples e mantível**
6. ✅ **Zero tentativas de retry** necessárias

---

**Status:** ✅ Solução completa e pronta para implementação

**Próximo passo:** Executar migration e atualizar código conforme guia de implementação
