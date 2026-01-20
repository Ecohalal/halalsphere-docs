# Troubleshooting - Document Upload "Request not found" Error

## Problema: Erro 404 "Request not found" ao fazer upload de documentos

### Sintomas

Ao criar uma nova solicitação (processo) com documentos anexados:

1. ✅ O processo é criado com sucesso
2. ✅ Mensagem de sucesso é exibida no frontend
3. ❌ Popup de erro aparece: "Processo criado: 0 documento(s) enviado(s) com sucesso. 1 falhou(ram) e pode(m) ser anexado(s) posteriormente."
4. ❌ Console mostra erro 404: `POST http://localhost:3333/documents/upload 404 (Not Found)`
5. ❌ Erro retornado: `{message: 'Request not found', error: 'Not Found', statusCode: 404}`

### Console Log Exemplo

```javascript
[NewRequestWizard] Submitting data: {...}
[NewRequestWizard] Uploading 1 documents for process: 87fe7ce0-8556-4242-b197-f174e13801dd
[DocumentService] Uploading document: {fileName: 'Invoice.pdf', fileSize: 31938, requestId: '87fe7ce0-8556-4242-b197-f174e13801dd'}
POST http://localhost:3333/documents/upload 404 (Not Found)
[DocumentService] Upload error: AxiosError {...}
[DocumentService] Error response: {message: 'Request not found', error: 'Not Found', statusCode: 404}
```

---

## Causa Raiz

O problema é uma **race condition** entre a criação do processo e o upload de documentos.

### Fluxo Atual do Problema

#### 1. Backend - Criação do Processo (process.service.ts:113-173)

```typescript
async createProcess(...): Promise<ProcessDetailResponse> {
  const protocol = await this.generateProtocol();

  // Transaction atômica
  const result = await this.prisma.$transaction(async (tx) => {
    // 1. Criar Request
    const request = await tx.request.create({
      data: {
        protocol,
        companyId,
        // ... outros campos
      },
    });

    // 2. Criar Process
    const process = await tx.process.create({
      data: {
        requestId: request.id,
        status: ProcessStatus.rascunho,
        // ... outros campos
      },
    });

    return { request, process };
  });

  // 3. Retorna o requestId para o frontend
  return {
    requestId: request.id,
    // ... outros campos
  };
}
```

**Timing:**
- Request e Process são criados dentro de `prisma.$transaction()`
- O `requestId` é retornado para o frontend
- A transaction ainda pode estar **commitando** quando a resposta é enviada

#### 2. Frontend - Upload Imediato (NewRequestWizard.tsx:215-219)

```typescript
const createMutation = useMutation({
  mutationFn: (data) => processService.createProcess(data),
  onSuccess: async (createdProcess) => {
    // Imediatamente tenta fazer upload
    await uploadDocuments(createdProcess.requestId);
  },
});
```

**Timing:**
- Frontend recebe o `requestId`
- **Imediatamente** executa `uploadDocuments()`
- Faz requisição `POST /documents/upload`

#### 3. Backend - Verificação de Request (document.service.ts:79-85)

```typescript
async uploadDocument(...) {
  // Verifica se Request existe
  const request = await this.prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new NotFoundException('Request not found'); // ❌ ERRO AQUI
  }
  // ...
}
```

**Timing:**
- Query `findUnique()` executa **antes** da transaction do `createProcess()` commitar
- PostgreSQL não vê o registro ainda (isolamento de transação)
- Retorna `null` → lança `NotFoundException`

### Diagrama de Sequência do Problema

```
Frontend              Backend (Process)         Database              Backend (Document)
   |                         |                      |                         |
   |--createProcess()------->|                      |                         |
   |                         |--$transaction()----->|                         |
   |                         |  INSERT Request      |                         |
   |                         |  INSERT Process      |                         |
   |<----response (requestId)|                      |                         |
   |                         |                      |--COMMIT (in progress)   |
   |                         |                      |                         |
   |--uploadDocument(requestId)----------------------|------------------------>|
   |                         |                      |                         |
   |                         |                      |<--findUnique(requestId)-|
   |                         |                      |   (TRANSACTION NOT      |
   |                         |                      |    COMMITTED YET!)      |
   |                         |                      |--null------------------>|
   |                         |                      |                         |
   |<--404 "Request not found"------------------------------------X            |
```

---

## Soluções Propostas

### ✅ Solução 1: Adicionar Read Committed + Retry (RECOMENDADA)

Garante que a query do document upload veja dados committed + adiciona retry logic no frontend.

#### Backend: Adicionar transaction isolamento

**Arquivo:** `src/document/document.service.ts`

```typescript
async uploadDocument(
  file: UploadedFile,
  requestId: string,
  documentType: DocumentType,
) {
  // Use transaction com isolamento Read Committed
  return await this.prisma.$transaction(
    async (tx) => {
      // Verify request exists dentro da transação
      const request = await tx.request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new NotFoundException('Request not found');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const filename = `${requestId}-${timestamp}${ext}`;
      const filePath = path.join(this.uploadDir, filename);

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Create document record in database
      const document = await tx.document.create({
        data: {
          requestId,
          documentType,
          fileName: file.originalname,
          fileUrl: `/uploads/documents/${filename}`,
          fileSize: file.size,
          mimeType: file.mimetype,
          validationStatus: DocumentValidationStatus.pendente,
        },
      });

      return document;
    },
    {
      isolationLevel: 'ReadCommitted', // Garante leitura de dados committed
      maxWait: 5000, // 5s wait for transaction
      timeout: 10000, // 10s timeout
    }
  );
}
```

#### Frontend: Adicionar Retry Logic

**Arquivo:** `frontend/src/services/document.service.ts`

```typescript
async uploadDocument(
  file: File,
  requestId: string,
  documentType: string,
  retries = 3,
  delayMs = 1000
): Promise<Document> {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('requestId', requestId);
      formData.append('documentType', documentType);

      const response = await api.post<Document>('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(`[DocumentService] Upload successful on attempt ${attempt}`);
      return response.data;

    } catch (error: any) {
      lastError = error;

      // Se for 404 "Request not found", tenta novamente
      if (
        error.response?.status === 404 &&
        error.response?.data?.message === 'Request not found' &&
        attempt < retries
      ) {
        console.log(
          `[DocumentService] Request not found (attempt ${attempt}/${retries}), retrying in ${delayMs}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }

      // Para outros erros, lança imediatamente
      throw error;
    }
  }

  // Se esgotou todas as tentativas
  throw lastError;
}
```

---

### ⚠️ Solução 2: Aguardar Commit Explícito (Alternativa)

Força o backend a aguardar o commit antes de retornar a resposta.

**Arquivo:** `src/process/process.service.ts`

```typescript
async createProcess(...): Promise<ProcessDetailResponse> {
  const protocol = await this.generateProtocol();

  // Transaction com isolamento mais forte
  const result = await this.prisma.$transaction(
    async (tx) => {
      const request = await tx.request.create({...});
      const process = await tx.process.create({...});
      await tx.processPhaseHistory.create({...});

      return { request, process };
    },
    {
      isolationLevel: 'Serializable', // Mais forte
      maxWait: 5000,
      timeout: 10000,
    }
  );

  // Aguardar um pouco para garantir commit
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    requestId: result.request.id,
    // ... outros campos
  };
}
```

**Desvantagens:**
- Adiciona latência desnecessária
- Não garante 100% que commit finalizou
- Solução "gambiarra"

---

### ❌ Solução 3: Upload Assíncrono (NÃO RECOMENDADA)

Mover o upload para depois do usuário confirmar, mas piora a UX.

---

## Solução Implementada (RECOMENDAÇÃO)

### Implementar Solução 1: Transaction + Retry

1. ✅ **Backend:** Adicionar transaction com `ReadCommitted` em `document.service.ts`
2. ✅ **Frontend:** Adicionar retry logic (3 tentativas, 1s delay) em `document.service.ts`
3. ✅ **Logging:** Melhorar logs para debug

### Por que essa solução?

| Critério | Avaliação |
|----------|-----------|
| **Confiabilidade** | ✅ Alta - garante leitura de dados committed |
| **Performance** | ✅ Boa - só adiciona latência se houver race condition |
| **Complexidade** | ✅ Baixa - mudanças localizadas |
| **UX** | ✅ Mantém fluxo atual |
| **Manutenção** | ✅ Fácil de entender e debugar |

---

## Testes de Validação

### 1. Teste de Upload Simples

```bash
# 1. Criar solicitação com 1 documento
# 2. Verificar que documento foi enviado com sucesso
# 3. Verificar logs do console
```

**Resultado Esperado:**
- ✅ Processo criado
- ✅ 1 documento enviado com sucesso
- ✅ Sem erros 404 no console

### 2. Teste de Upload Múltiplo

```bash
# 1. Criar solicitação com 5 documentos
# 2. Verificar que todos foram enviados
```

**Resultado Esperado:**
- ✅ 5 documentos enviados com sucesso

### 3. Teste de Carga

```bash
# 1. Criar 10 solicitações simultâneas
# 2. Cada uma com 3 documentos
```

**Resultado Esperado:**
- ✅ 30 documentos no total
- ✅ Taxa de sucesso > 99%

---

## Monitoramento

### Logs para Adicionar

#### Backend: `document.service.ts`

```typescript
async uploadDocument(...) {
  const startTime = Date.now();

  try {
    const result = await this.prisma.$transaction(async (tx) => {
      const request = await tx.request.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        console.log(
          `[DocumentService] Request ${requestId} not found. ` +
          `Elapsed: ${Date.now() - startTime}ms`
        );
        throw new NotFoundException('Request not found');
      }

      // ... resto do código
    });

    console.log(
      `[DocumentService] Upload successful for ${requestId}. ` +
      `Elapsed: ${Date.now() - startTime}ms`
    );

    return result;
  } catch (error) {
    console.error(
      `[DocumentService] Upload failed for ${requestId}. ` +
      `Elapsed: ${Date.now() - startTime}ms`,
      error
    );
    throw error;
  }
}
```

#### Frontend: `document.service.ts`

```typescript
console.log(
  `[DocumentService] Uploading: ${file.name} ` +
  `(${file.size} bytes) to request ${requestId}`
);

// Após upload
console.log(
  `[DocumentService] Upload successful: ${file.name} ` +
  `on attempt ${attempt}/${retries}`
);

// Se retry
console.log(
  `[DocumentService] Retry ${attempt}/${retries} for ${file.name} ` +
  `(404 - Request not found). Waiting ${delayMs}ms...`
);
```

---

## Referências

### Arquivos Relacionados

#### Backend
- [process.service.ts:95-216](c:\Projetos\halalsphere-backend-nest\src\process\process.service.ts#L95-L216) - Criação do processo
- [document.service.ts:73-110](c:\Projetos\halalsphere-backend-nest\src\document\document.service.ts#L73-L110) - Upload de documento
- [document.controller.ts:101-127](c:\Projetos\halalsphere-backend-nest\src\document\document.controller.ts#L101-L127) - Endpoint de upload

#### Frontend
- `frontend/src/components/NewRequestWizard.tsx:215-239` - Upload após criação
- `frontend/src/services/document.service.ts` - Serviço de upload

### Prisma Transaction Documentation

- [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Transaction Isolation Levels](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#transaction-isolation-level)

---

## Histórico de Mudanças

| Data | Versão | Mudança |
|------|--------|---------|
| 2026-01-19 | 1.0 | Documento inicial - diagnóstico do problema |

