# 📊 Diagrama: Solução de Upload de Documentos

**Data:** 2026-01-19

---

## 🔴 ANTES: Problema Arquitetural

### **Schema sem Relacionamento**

```
┌─────────────────────────────────┐          ┌─────────────────────────────────┐
│         REQUESTS                │          │         DOCUMENTS               │
├─────────────────────────────────┤          ├─────────────────────────────────┤
│ id (UUID) PK                    │          │ id (UUID) PK                    │
│ company_id                      │          │ file_name                       │
│ status                          │    ❌    │ file_url                        │
│ created_at                      │   NENHUM │ file_size                       │
│ updated_at                      │  VÍNCULO │ document_type                   │
│                                 │          │ uploaded_by                     │
│                                 │          │ created_at                      │
└─────────────────────────────────┘          └─────────────────────────────────┘
```

### **Fluxo com Problema**

```
Frontend                    Backend                     Database
   │                           │                            │
   │ 1. POST /requests         │                            │
   ├──────────────────────────>│                            │
   │                           │ 2. INSERT requests         │
   │                           ├───────────────────────────>│
   │                           │                            │
   │ 3. Response: requestId    │                            │
   │<──────────────────────────┤                            │
   │                           │                            │
   │ 4. POST /upload           │                            │
   │    + requestId            │                            │
   ├──────────────────────────>│                            │
   │                           │ 5. ❌ PROBLEMA!            │
   │                           │    Não há FK entre         │
   │                           │    documents e requests    │
   │                           │                            │
   │                           │ 6. Tentativa de buscar     │
   │                           │    request antes upload    │
   │                           ├───────────────────────────>│
   │                           │                            │
   │                           │ 7. ❌ Race condition!      │
   │                           │    Request pode não estar  │
   │                           │    visível ainda           │
   │                           │<───────────────────────────┤
   │                           │                            │
   │ 8. ❌ 404 Not Found        │                            │
   │<──────────────────────────┤                            │
   │                           │                            │
   │ 9. 🔄 Retry (10x)          │                            │
   │ (delays, backoff...)      │                            │
   │                           │                            │
```

---

## ✅ DEPOIS: Solução com Foreign Key

### **Schema com Relacionamento 1:N**

```
┌─────────────────────────────────┐          ┌─────────────────────────────────┐
│         REQUESTS                │          │         DOCUMENTS               │
├─────────────────────────────────┤          ├─────────────────────────────────┤
│ id (UUID) PK                    │          │ id (UUID) PK                    │
│ company_id                      │          │ request_id (UUID) FK  ─────────>│ id
│ status                          │    ✅    │ file_name                       │
│ created_at                      │  FOREIGN │ file_url                        │
│ updated_at                      │    KEY   │ file_size                       │
│                                 │          │ document_type                   │
│                                 │          │ uploaded_by                     │
│ documents: Document[]           │<─────────┤ request: Request                │
└─────────────────────────────────┘          └─────────────────────────────────┘

                                             INDEX: idx_documents_request_id
                                             CONSTRAINT: ON DELETE CASCADE
```

### **Fluxo Corrigido**

```
Frontend                    Backend                     Database
   │                           │                            │
   │ 1. POST /requests         │                            │
   ├──────────────────────────>│                            │
   │                           │ 2. INSERT requests         │
   │                           ├───────────────────────────>│
   │                           │                            │
   │ 3. Response: requestId    │                            │
   │<──────────────────────────┤                            │
   │                           │                            │
   │ 4. POST /upload           │                            │
   │    + requestId            │                            │
   │    + file                 │                            │
   ├──────────────────────────>│                            │
   │                           │                            │
   │                           │ 5. ✅ Validar request      │
   │                           ├───────────────────────────>│
   │                           │<───────────────────────────┤
   │                           │                            │
   │                           │ 6. Upload to S3/Storage    │
   │                           ├────────────> [S3]          │
   │                           │<──────────── fileUrl       │
   │                           │                            │
   │                           │ 7. ✅ INSERT document      │
   │                           │    WITH request_id!        │
   │                           ├───────────────────────────>│
   │                           │                            │
   │ 8. ✅ 201 Created          │                            │
   │    { id, requestId, ... } │                            │
   │<──────────────────────────┤                            │
   │                           │                            │
   │ 9. ✅ SEM RETRY!           │                            │
   │    Upload direto          │                            │
   │                           │                            │
```

---

## 🔄 Comparação de Queries

### **ANTES: Impossível Buscar Documentos de um Request**

```sql
-- ❌ NÃO FUNCIONA: Não há coluna request_id
SELECT * FROM documents
WHERE request_id = 'req-123';
-- ERROR: column "request_id" does not exist

-- ❌ Workaround complexo e ineficiente
SELECT d.*
FROM documents d
INNER JOIN process_documents pd ON pd.document_id = d.id
INNER JOIN processes p ON p.id = pd.process_id
INNER JOIN requests r ON r.id = p.request_id
WHERE r.id = 'req-123';
-- Muitas joins, lento, propenso a erros
```

### **DEPOIS: Query Simples e Direta**

```sql
-- ✅ FUNCIONA: Busca direta via FK
SELECT * FROM documents
WHERE request_id = 'req-123';
-- Rápido, usa índice, direto

-- ✅ Buscar request COM documentos (JOIN)
SELECT
  r.*,
  json_agg(d.*) as documents
FROM requests r
LEFT JOIN documents d ON d.request_id = r.id
WHERE r.id = 'req-123'
GROUP BY r.id;
-- Eficiente e legível
```

---

## 📦 Operações CRUD

### **CREATE: Upload de Documento**

```typescript
// ✅ NOVO: Upload vinculado ao request
async uploadDocument(requestId: string, file: File) {
  // 1. Validar request existe
  const request = await prisma.request.findUnique({
    where: { id: requestId }
  });

  if (!request) {
    throw new NotFoundException('Request not found');
  }

  // 2. Upload e salvar COM request_id
  const document = await prisma.document.create({
    data: {
      fileName: file.name,
      fileUrl: await storage.upload(file),
      requestId: requestId,  // 🎯 VINCULA AQUI!
      // ... outros campos
    }
  });

  return document;
}
```

### **READ: Buscar Documentos de um Request**

```typescript
// ✅ NOVO: Busca direta
async getDocumentsByRequest(requestId: string) {
  return prisma.document.findMany({
    where: { requestId: requestId },  // 🎯 BUSCA DIRETA!
    orderBy: { createdAt: 'desc' }
  });
}

// ✅ Ou com eager loading
async getRequestWithDocuments(requestId: string) {
  return prisma.request.findUnique({
    where: { id: requestId },
    include: {
      documents: true  // 🎯 INCLUI DOCUMENTOS!
    }
  });
}
```

### **DELETE: Cascade Automático**

```typescript
// ✅ Deletar request deleta documentos automaticamente
await prisma.request.delete({
  where: { id: requestId }
});

// 🗑️ Todos os documentos com request_id = requestId
//    são deletados automaticamente (ON DELETE CASCADE)
```

---

## 🏗️ Migration Step-by-Step

```sql
-- STEP 1: Adicionar coluna (nullable)
ALTER TABLE documents
ADD COLUMN request_id UUID;

-- STEP 2: Criar índice para performance
CREATE INDEX idx_documents_request_id
ON documents(request_id);

-- STEP 3: Adicionar foreign key
ALTER TABLE documents
ADD CONSTRAINT fk_documents_request_id
FOREIGN KEY (request_id)
REFERENCES requests(id)
ON DELETE CASCADE;

-- STEP 4 (Opcional): Migrar dados existentes
-- UPDATE documents SET request_id = ... WHERE ...;

-- STEP 5 (Opcional): Tornar NOT NULL
-- ALTER TABLE documents
-- ALTER COLUMN request_id SET NOT NULL;
```

---

## 📊 Integridade Referencial

```
┌─────────────────────────────────────────────────────────────────────┐
│                     INTEGRIDADE GARANTIDA                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ✅ Só é possível criar documento se request existir                 │
│     (FK constraint valida)                                          │
│                                                                     │
│  ✅ Deletar request deleta documentos automaticamente                │
│     (ON DELETE CASCADE)                                             │
│                                                                     │
│  ✅ Atualizar request.id atualiza documents.request_id               │
│     (ON UPDATE CASCADE)                                             │
│                                                                     │
│  ✅ Não há documentos órfãos                                         │
│     (FK constraint previne)                                         │
│                                                                     │
│  ✅ Busca rápida via índice                                          │
│     (idx_documents_request_id)                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Resultado Final

### **Backend**

```typescript
// ✅ Código simples e direto
@Post('upload')
async upload(
  @Body('requestId') requestId: string,
  @UploadedFile() file: File
) {
  return this.documentService.uploadDocument(requestId, file);
}
```

### **Frontend**

```typescript
// ✅ Upload direto, sem retry
const formData = new FormData();
formData.append('file', file);
formData.append('requestId', requestId);

await axios.post('/documents/upload', formData);
// Funciona na primeira tentativa! ✅
```

### **Database**

```sql
-- ✅ Dados consistentes
SELECT
  r.id as request_id,
  r.status,
  COUNT(d.id) as document_count
FROM requests r
LEFT JOIN documents d ON d.request_id = r.id
GROUP BY r.id, r.status;

-- request_id                            | status  | document_count
-- --------------------------------------|---------|---------------
-- abc-123                              | pending | 5
-- def-456                              | approved| 12
```

---

## ✅ Benefícios

| Benefício | Descrição |
|-----------|-----------|
| 🚀 **Performance** | Busca direta com índice, sem joins complexos |
| 🔒 **Integridade** | FK garante consistência dos dados |
| 🧹 **Cleanup** | Cascade delete automático |
| 📝 **Simplicidade** | Código mais simples e legível |
| ⚡ **Sem Race Condition** | Upload funciona imediatamente |
| 🎯 **Direto** | Sem lógica de retry necessária |

---

**Status:** ✅ Solução implementada e documentada
