# Teste Manual - Upload de Documento

## Objetivo
Testar upload de documento **sem** envolver a criação do processo, para isolar o problema.

---

## Pré-requisitos

1. Backend rodando: `http://localhost:3333`
2. Token de autenticação válido
3. RequestId válido de um processo existente

---

## Passo 1: Obter Token de Autenticação

### Usando Postman/Insomnia

**POST** `http://localhost:3333/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "empresa@halalsphere.com",
  "password": "senha123"
}
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "empresa@halalsphere.com",
    "role": "empresa"
  }
}
```

**⚠️ COPIE O TOKEN** - você vai usar no próximo passo

---

## Passo 2: Verificar Request Existente no Banco

### Opção A: Usando Prisma Studio

1. Abrir terminal:
```bash
cd c:\Projetos\halalsphere-backend-nest
npx prisma studio
```

2. Navegar para tabela `Request`
3. Copiar um `id` de Request existente

### Opção B: Usando SQL direto

Execute o SQL em `DEBUG-REQUEST-NOT-FOUND.sql`:

```sql
SELECT id, protocol, "companyName", status
FROM "Request"
ORDER BY "createdAt" DESC
LIMIT 5;
```

**⚠️ COPIE UM `id` DE REQUEST EXISTENTE**

Exemplo: `abc-123-def-456-ghi`

---

## Passo 3: Testar Upload de Documento

### Usando Postman

**POST** `http://localhost:3333/documents/upload`

**Headers:**
```
Authorization: Bearer <SEU_TOKEN_AQUI>
```

**Body (form-data):**
- Key: `requestId` | Value: `<ID_DO_REQUEST_AQUI>` (text)
- Key: `documentType` | Value: `outros` (text)
- Key: `file` | Value: `<SELECIONE_UM_PDF>` (file)

**Exemplo:**
```
requestId: abc-123-def-456-ghi
documentType: outros
file: test.pdf
```

---

### Usando cURL

```bash
curl -X POST http://localhost:3333/documents/upload \
  -H "Authorization: Bearer <SEU_TOKEN>" \
  -F "requestId=<ID_DO_REQUEST>" \
  -F "documentType=outros" \
  -F "file=@C:\caminho\para\seu\arquivo.pdf"
```

**Exemplo real:**
```bash
curl -X POST http://localhost:3333/documents/upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "requestId=abc-123-def-456-ghi" \
  -F "documentType=outros" \
  -F "file=@C:\Users\Downloads\test.pdf"
```

---

## Resultado Esperado

### ✅ Sucesso (200 OK)

```json
{
  "document": {
    "id": "doc-123-456",
    "requestId": "abc-123-def-456-ghi",
    "fileName": "test.pdf",
    "fileUrl": "/uploads/documents/abc-123-def-456-ghi-1234567890.pdf",
    "fileSize": 12345,
    "mimeType": "application/pdf",
    "documentType": "outros",
    "validationStatus": "pendente",
    "uploadedAt": "2026-01-19T18:30:00.000Z"
  }
}
```

### ❌ Erro - Request Not Found (404)

```json
{
  "statusCode": 404,
  "message": "Request not found",
  "error": "Not Found"
}
```

**Isso significa:** O `requestId` que você usou não existe no banco de dados!

---

## Passo 4: Verificar se Request Foi Criado

Se você recebeu 404, execute esta query SQL:

```sql
SELECT id, protocol, "companyName", status
FROM "Request"
WHERE id = '<O_ID_QUE_VOCÊ_USOU>';
```

**Se retornar vazio** → O Request não foi criado!

**Se retornar o registro** → O Request existe, o problema é no endpoint de upload

---

## Passo 5: Criar Request Manualmente (Para Teste)

Se o problema for que o Request não está sendo criado, vamos criar um manualmente:

### SQL para criar Request de teste

```sql
INSERT INTO "Request" (
  id,
  protocol,
  "companyId",
  "companyName",
  cnpj,
  "requestType",
  "certificationType",
  "productOrigin",
  "productType",
  "productCategory",
  "productDescription",
  "productDetails",
  "productionDetails",
  status,
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'HS-2026-TEST',
  '<ID_DA_SUA_EMPRESA>',
  'Empresa Teste',
  '12345678000100',
  'nova',
  'C1',
  'misto',
  'alimentos',
  'Alimentos',
  'Produto de teste',
  '{"contact": {"name": "Teste", "email": "teste@test.com", "phone": "11999999999"}, "address": "Rua Teste"}',
  '{"capacity": "1000", "address": "Rua Teste", "industrialGroup": "A", "industrialCategory": "AI", "industrialSubcategory": "AI-01"}',
  'rascunho',
  NOW(),
  NOW()
)
RETURNING id, protocol;
```

**⚠️ COPIE O `id` RETORNADO** e use no upload!

---

## Diagnóstico

### Cenário 1: Upload funciona com Request manual
**Conclusão:** O problema está na criação do Request, não no upload
**Solução:** Investigar `process.service.ts` → `createProcess()`

### Cenário 2: Upload falha mesmo com Request manual
**Conclusão:** O problema está no endpoint de upload
**Solução:** Investigar `document.service.ts` → `uploadDocument()`

### Cenário 3: Upload funciona imediatamente (sem retry)
**Conclusão:** Não há race condition, problema era outra coisa
**Solução:** Reverter mudanças complexas

---

## O Que Verificar no Backend

Se o upload funcionar com Request manual, adicione logs em `createProcess`:

```typescript
// Em process.service.ts, após a transaction
console.log('[DEBUG] Transaction completed, requestId:', request.id);

// Verificar se Request existe
const checkRequest = await this.prisma.request.findUnique({
  where: { id: request.id }
});

console.log('[DEBUG] Request found after transaction:', !!checkRequest);

if (!checkRequest) {
  console.error('[CRITICAL] Request not found immediately after transaction!');
}

// Aguardar 50ms
await new Promise(resolve => setTimeout(resolve, 50));

// Verificar novamente
const checkRequest2 = await this.prisma.request.findUnique({
  where: { id: request.id }
});

console.log('[DEBUG] Request found after 50ms delay:', !!checkRequest2);
```

---

## Próximos Passos

1. ✅ Executar teste manual de upload com Request existente
2. ✅ Verificar se upload funciona isoladamente
3. ✅ Se funcionar, problema está na criação do Request
4. ✅ Adicionar logs detalhados em `createProcess()`
5. ✅ Identificar onde a transaction está falhando

---

## Notas Importantes

- **NÃO** use o frontend para este teste
- **NÃO** crie novos processos ainda
- **USE** Postman/cURL para isolar o problema
- **VERIFIQUE** o banco de dados diretamente

**Este é um teste isolado para identificar a causa raiz!**

