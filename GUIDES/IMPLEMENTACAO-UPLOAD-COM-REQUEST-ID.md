# 🚀 Implementação: Upload de Documentos com request_id

**Data:** 2026-01-19
**Status:** 📋 Guia de Implementação

---

## 🎯 Objetivo

Modificar a lógica de upload de documentos para vincular cada documento diretamente ao `request_id` durante o upload, eliminando o problema de race condition e garantindo que documentos sejam sempre associados à solicitação correta.

---

## 📋 Pré-requisitos

1. ✅ Migration executada: `ADD-REQUEST-ID-TO-DOCUMENTS-2026-01-19.sql`
2. ✅ Model Prisma atualizado com campo `requestId`
3. ✅ Coluna `request_id` existe na tabela `documents`

---

## 🔧 Implementação Backend (NestJS/TypeScript)

### **1. Atualizar DocumentService**

Arquivo: `src/document/document.service.ts`

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { DocumentType, DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Upload de documento vinculado a um request
   * 🎯 PRINCIPAL MUDANÇA: Vincula diretamente via request_id
   */
  async uploadDocument(
    requestId: string,
    file: Express.Multer.File,
    documentType: DocumentType,
    uploadedBy: string,
    description?: string,
  ) {
    // 1. Validar se o request existe ANTES do upload
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(
        `Request ${requestId} not found. Cannot upload document.`
      );
    }

    // 2. Fazer upload do arquivo para storage (S3/Cloudinary)
    let fileUrl: string;
    try {
      fileUrl = await this.storageService.uploadFile(file);
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload file to storage: ${error.message}`
      );
    }

    // 3. Criar registro do documento COM request_id
    const document = await this.prisma.document.create({
      data: {
        fileName: file.originalname,
        fileUrl: fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        documentType: documentType,
        description: description,

        // 🎯 VINCULA DIRETAMENTE AO REQUEST
        requestId: requestId,

        uploadedBy: uploadedBy,
        status: DocumentStatus.PENDING,
      },
    });

    console.log(
      `[DocumentService] Document uploaded successfully:`,
      `ID: ${document.id}, File: ${document.fileName}, Request: ${requestId}`
    );

    return document;
  }

  /**
   * Buscar todos os documentos de um request
   * 🎯 AGORA FUNCIONA PERFEITAMENTE!
   */
  async getDocumentsByRequest(requestId: string) {
    // Verificar se request existe
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Request ${requestId} not found`);
    }

    // Buscar documentos vinculados
    return this.prisma.document.findMany({
      where: { requestId: requestId },
      orderBy: { uploadedAt: 'desc' },
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

  /**
   * Buscar request COM seus documentos (eager loading)
   */
  async getRequestWithDocuments(requestId: string) {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: {
        documents: {
          orderBy: { uploadedAt: 'desc' },
        },
        company: true,
        process: true,
      },
    });

    if (!request) {
      throw new NotFoundException(`Request ${requestId} not found`);
    }

    return request;
  }

  /**
   * Validar documento
   */
  async validateDocument(documentId: string, validatedBy: string, approved: boolean, reason?: string) {
    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        status: approved ? DocumentStatus.APPROVED : DocumentStatus.REJECTED,
        validatedAt: new Date(),
        validatedBy: validatedBy,
        rejectionReason: approved ? null : reason,
      },
    });
  }

  /**
   * Deletar documento
   */
  async deleteDocument(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document ${documentId} not found`);
    }

    // Deletar do storage
    await this.storageService.deleteFile(document.fileUrl);

    // Deletar do banco
    await this.prisma.document.delete({
      where: { id: documentId },
    });

    return { message: 'Document deleted successfully' };
  }
}
```

---

### **2. Atualizar DocumentController**

Arquivo: `src/document/document.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentService } from './document.service';
import { DocumentType } from '@prisma/client';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Upload de documento
   * 🎯 ENDPOINT PRINCIPAL - Recebe requestId e vincula documento
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('requestId') requestId: string,
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

    // Upload com request_id
    return this.documentService.uploadDocument(
      requestId,
      file,
      documentType,
      req.user.id, // ID do usuário autenticado
      description,
    );
  }

  /**
   * Buscar documentos de um request
   * 🎯 AGORA FUNCIONA CORRETAMENTE!
   */
  @Get('request/:requestId')
  async getDocumentsByRequest(@Param('requestId') requestId: string) {
    return this.documentService.getDocumentsByRequest(requestId);
  }

  /**
   * Buscar request com documentos
   */
  @Get('request/:requestId/details')
  async getRequestWithDocuments(@Param('requestId') requestId: string) {
    return this.documentService.getRequestWithDocuments(requestId);
  }

  /**
   * Validar documento
   */
  @Post(':documentId/validate')
  async validateDocument(
    @Param('documentId') documentId: string,
    @Body('approved') approved: boolean,
    @Body('reason') reason: string,
    @Request() req,
  ) {
    return this.documentService.validateDocument(
      documentId,
      req.user.id,
      approved,
      reason,
    );
  }

  /**
   * Deletar documento
   */
  @Delete(':documentId')
  async deleteDocument(@Param('documentId') documentId: string) {
    return this.documentService.deleteDocument(documentId);
  }
}
```

---

## 🎨 Implementação Frontend (React/Angular/Vue)

### **Exemplo com React + Axios**

```typescript
// src/services/document.service.ts

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

export interface UploadDocumentDTO {
  requestId: string;
  file: File;
  documentType: string;
  description?: string;
}

export class DocumentService {
  /**
   * Upload de documento
   * 🎯 AGORA PASSA request_id DIRETAMENTE!
   */
  async uploadDocument({ requestId, file, documentType, description }: UploadDocumentDTO) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestId', requestId);          // 🎯 VINCULA AO REQUEST
    formData.append('documentType', documentType);

    if (description) {
      formData.append('description', description);
    }

    try {
      const response = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  /**
   * Buscar documentos de um request
   */
  async getDocumentsByRequest(requestId: string) {
    const response = await axios.get(`${API_URL}/documents/request/${requestId}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });

    return response.data;
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}

export default new DocumentService();
```

### **Uso no Componente de Upload**

```typescript
// src/components/DocumentUploadWizard.tsx

import React, { useState } from 'react';
import documentService from '../services/document.service';

interface Props {
  requestId: string; // 🎯 RECEBE request_id do processo criado
}

export const DocumentUploadWizard: React.FC<Props> = ({ requestId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);

    try {
      // Upload cada arquivo vinculando ao requestId
      for (const file of files) {
        await documentService.uploadDocument({
          requestId: requestId,        // 🎯 VINCULA AO REQUEST
          file: file,
          documentType: 'CONTRATO_SOCIAL', // Ou tipo selecionado pelo usuário
          description: file.name,
        });
      }

      alert('Todos os documentos foram enviados com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar documentos. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload de Documentos</h2>
      <p>Request ID: {requestId}</p>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
      />

      <button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? 'Enviando...' : 'Enviar Documentos'}
      </button>

      {uploading && <p>Enviando {files.length} arquivo(s)...</p>}
    </div>
  );
};
```

---

## 🧪 Testes

### **Teste 1: Upload e Busca**

```bash
# 1. Criar request
POST http://localhost:3333/requests
Body: { companyId: "...", ... }

# Response:
{
  "id": "abc-123-request",
  ...
}

# 2. Upload documento
POST http://localhost:3333/documents/upload
Body (form-data):
  - file: contrato.pdf
  - requestId: abc-123-request
  - documentType: CONTRATO_SOCIAL

# Response:
{
  "id": "doc-456",
  "requestId": "abc-123-request",
  "fileName": "contrato.pdf",
  "status": "PENDING"
}

# 3. Buscar documentos do request
GET http://localhost:3333/documents/request/abc-123-request

# Response:
[
  {
    "id": "doc-456",
    "requestId": "abc-123-request",
    "fileName": "contrato.pdf",
    ...
  }
]
```

### **Teste 2: Request com Documentos**

```bash
GET http://localhost:3333/documents/request/abc-123-request/details

# Response:
{
  "id": "abc-123-request",
  "documents": [
    {
      "id": "doc-456",
      "fileName": "contrato.pdf",
      "status": "PENDING"
    },
    {
      "id": "doc-789",
      "fileName": "cnpj.pdf",
      "status": "APPROVED"
    }
  ],
  "company": { ... },
  "process": { ... }
}
```

---

## ✅ Checklist de Implementação

- [ ] Migration executada no banco de dados
- [ ] Model Prisma atualizado com `requestId`
- [ ] `DocumentService.uploadDocument()` atualizado para receber e salvar `requestId`
- [ ] `DocumentController.uploadDocument()` atualizado para validar `requestId`
- [ ] Endpoint `GET /documents/request/:requestId` implementado
- [ ] Frontend atualizado para passar `requestId` no upload
- [ ] Testes de integração executados
- [ ] Documentos antigos migrados (se necessário)
- [ ] Deploy realizado

---

## 🚨 Pontos de Atenção

1. **Validação do requestId**: Sempre validar se o request existe antes do upload
2. **Transação**: Se criar request + upload no mesmo fluxo, considere usar transações
3. **Documentos órfãos**: Após migração, verificar se há documentos sem `request_id`
4. **Storage cleanup**: Se upload falhar, limpar arquivo do storage
5. **Permissões**: Garantir que usuário tem permissão de fazer upload para aquele request

---

## 📊 Impacto

| Antes | Depois |
|-------|--------|
| ❌ Documentos sem vínculo claro com request | ✅ Documentos vinculados diretamente via FK |
| ❌ Race condition ao buscar documentos | ✅ Busca instantânea via `request_id` |
| ❌ Lógica de retry complexa | ✅ Upload simples e direto |
| ❌ Dados inconsistentes | ✅ Integridade referencial garantida |

---

**Status:** ✅ Guia completo pronto para implementação
