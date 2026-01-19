# Phase 1.14: Document Upload & Process Edit Features

**Status**: ✅ Completed
**Date**: 2026-01-19
**Implementation Time**: ~2 hours

---

## 📋 Overview

This phase implements the ability for companies (empresa role) to:
1. **Edit process data** while the process is not yet assigned to an analyst
2. **Upload additional documents** to their process
3. **Delete pending documents** they have uploaded

All features are only available while:
- Process status is `rascunho` or `pendente`
- No analyst has been assigned to the process

---

## 🔧 Backend Changes (NestJS)

### 1. HTTP Adapter Change: Fastify → Express

**File**: `src/main.ts`

The backend was originally configured to use Fastify adapter. This caused issues with file uploads (multipart/form-data) because:
- `@nestjs/platform-express` Multer module is not compatible with Fastify
- The error was: `415 Unsupported Media Type: multipart/form-data`

**Change**: Switched to Express adapter (NestJS default)

```typescript
// BEFORE (Fastify)
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter({...}),
);

// AFTER (Express - Default)
const app = await NestFactory.create(AppModule, {
  logger: ['log', 'error', 'warn', 'debug', 'verbose'],
});
```

### 2. Process Service Updates

**File**: `src/process/process.service.ts`

Added `requestId` to the response of three methods:
- `createProcess()` - Returns requestId on creation
- `getProcessById()` - Returns requestId with process details
- `updateProcess()` - Returns requestId after update

**File**: `src/process/process.types.ts`

```typescript
export interface ProcessDetailResponse extends ProcessResponse {
  requestId: string;  // NEW - Required for document upload
  cnpj: string | null;
  // ... other fields
}
```

### 3. Document Controller (Already existed)

**File**: `src/document/document.controller.ts`

Endpoints available:
- `POST /documents/upload` - Upload document (multipart/form-data)
- `GET /documents/request/:requestId` - Get documents by request
- `GET /documents/process/:processId` - Get documents by process
- `DELETE /documents/:id` - Delete document (empresa only, pending status)
- `GET /documents/:id/can-delete` - Check if document can be deleted

Uses `@UploadedFile()` decorator with `FileInterceptor('file')` from `@nestjs/platform-express`.

---

## 🎨 Frontend Changes (React)

### 1. Process Service Updates

**File**: `src/services/process.service.ts`

Added `requestId` to `ProcessDetail` interface:

```typescript
export interface ProcessDetail extends Process {
  requestId: string;  // NEW
  cnpj: string;
  address: string;
  // ... other fields
}
```

### 2. New Component: DocumentUploadSection

**File**: `src/components/company/DocumentUploadSection.tsx`

Features:
- Drag-and-drop file upload
- Document type selection (15 types available)
- Document list with validation status badges
- Delete button for pending documents only
- Warning message about editing limitations

Props:
```typescript
interface DocumentUploadSectionProps {
  processId: string;
  requestId: string;
}
```

### 3. ProcessDetails Page Integration

**File**: `src/pages/ProcessDetails.tsx`

Added:
- Import for `DocumentUploadSection`
- Conditional rendering for empresa users who can edit:

```tsx
{/* Company Document Upload Section - only for empresa who can edit */}
{currentUser?.role === 'empresa' && canEdit && process.requestId && (
  <DocumentUploadSection processId={id!} requestId={process.requestId} />
)}
```

### 4. ProcessEditModal (Already existed from previous session)

**File**: `src/components/company/ProcessEditModal.tsx`

Modal with 4 tabs for editing process data:
- Empresa (Company)
- Contato (Contact)
- Produto (Product)
- Produção (Production)

---

## 📝 Document Types Supported

```typescript
const DOCUMENT_TYPES = [
  { value: 'contrato_social', label: 'Contrato Social' },
  { value: 'certidao_negativa', label: 'Certidão Negativa' },
  { value: 'alvara_funcionamento', label: 'Alvará de Funcionamento' },
  { value: 'laudo_tecnico', label: 'Laudo Técnico' },
  { value: 'manual_bpf', label: 'Manual de Boas Práticas de Fabricação' },
  { value: 'fluxograma_processo', label: 'Fluxograma do Processo' },
  { value: 'lista_fornecedores', label: 'Lista de Fornecedores' },
  { value: 'certificado_ingredientes', label: 'Certificados de Ingredientes' },
  { value: 'analise_produto', label: 'Análise de Produto' },
  { value: 'rotulo_produto', label: 'Rótulo do Produto' },
  { value: 'licenca_sanitaria', label: 'Licença Sanitária' },
  { value: 'fotos', label: 'Fotos' },
  { value: 'videos', label: 'Vídeos' },
  { value: 'laudos', label: 'Laudos' },
  { value: 'outros', label: 'Outros' },
];
```

---

## 🔒 Security & Business Rules

### Edit Permission Rules

A company can edit process/upload documents ONLY when:
1. `process.status === 'rascunho' OR process.status === 'pendente'`
2. `process.analystId === null` (no analyst assigned)
3. User role is `empresa`
4. User's company matches process company

### Document Deletion Rules

A document can be deleted ONLY when:
1. `document.validationStatus === 'pendente'`
2. Process can be edited (same rules as above)
3. User is the company owner of the document

---

## 🧪 Testing

### Manual Testing Steps

1. **Test Edit Process**:
   - Login as empresa
   - Go to a process in `pendente` status without analyst
   - Click "Editar Processo" button
   - Modify fields and save

2. **Test Upload Document**:
   - In the same process, find "Meus Documentos" section
   - Click "Enviar Documento"
   - Select document type and file
   - Click "Enviar"

3. **Test Delete Document**:
   - After uploading, click trash icon on pending document
   - Confirm deletion

4. **Test Permission Denied**:
   - Assign analyst to process
   - Verify edit button disappears
   - Verify upload section disappears

---

## 📁 Files Modified

### Backend (halalsphere-backend-nest)

| File | Change |
|------|--------|
| `src/main.ts` | Changed from Fastify to Express adapter |
| `src/process/process.types.ts` | Added `requestId` to ProcessDetailResponse |
| `src/process/process.service.ts` | Added `requestId` to 3 response methods |
| `src/document/document.controller.ts` | Restored Express/Multer file handling |
| `src/document/document.module.ts` | Using MulterModule (Express) |

### Frontend (halalsphere-frontend)

| File | Change |
|------|--------|
| `src/services/process.service.ts` | Added `requestId` to ProcessDetail interface |
| `src/components/company/DocumentUploadSection.tsx` | NEW - Upload component |
| `src/pages/ProcessDetails.tsx` | Added DocumentUploadSection integration |

---

## ⚠️ Important Notes

### Why Express Instead of Fastify?

- **Fastify** requires `@fastify/multipart` for file uploads
- **Express** works with `@nestjs/platform-express` and Multer out of the box
- NestJS default is Express, making migration simpler
- Both are production-ready; Express has broader ecosystem support

### Restart Required

After these changes, the backend must be restarted for the Express adapter to take effect.

---

## 🔧 Phase Transition Fixes (Post Phase 1.14)

### Issues Fixed

#### 1. 403 Forbidden on Advance Phase (Analyst)

**Problem**: Analyst role couldn't advance phase from `cadastro_solicitacao`.

**Cause**: The `allowedRoles` for phase 1 only included `['empresa']`.

**Fix**: Updated `process.types.ts` to include `'analista', 'gestor'` in the allowedRoles for `cadastro_solicitacao` phase.

```typescript
[ProcessPhase.cadastro_solicitacao]: {
  // ...
  allowedRoles: ['empresa', 'analista', 'gestor'], // Was: ['empresa']
}
```

#### 2. 500 Internal Server Error on Advance Phase

**Problem**: After fixing 403, advance phase returned 500 error.

**Causes Identified**:
1. Missing user validation before creating ProcessHistory
2. Missing initial ProcessPhaseHistory entry on process creation
3. Inconsistent phase tracking in assignAnalyst method

**Fixes Applied**:

**a) User validation in `process-transition.service.ts`:**
```typescript
// Added at the start of advancePhase method
const user = await this.prisma.user.findUnique({
  where: { id: userId },
  select: { id: true },
});

if (!user) {
  throw new BadRequestException('Usuário não encontrado');
}
```

**b) Request validation:**
```typescript
if (!process.request) {
  throw new BadRequestException(
    'Processo não possui solicitação vinculada',
  );
}
```

**c) Initial ProcessPhaseHistory in `process.service.ts` createProcess:**
```typescript
// After creating Process, create initial phase history
await tx.processPhaseHistory.create({
  data: {
    processId: process.id,
    phase: 1, // cadastro_solicitacao
  },
});
```

**d) Phase tracking in assignAnalyst method:**
- Added closing of current phase (phase 1)
- Added creation of new phase entry (phase 2)
- Ensured consistency with advancePhase method

#### 3. userId undefined (Prisma Validation Error)

**Problem**: `this.prisma.user.findUnique()` was called with `id: undefined`.

**Cause**: The JWT strategy returns user object with `id` property, but the controller was destructuring `userId` which doesn't exist.

**Fix**: Updated `process.controller.ts` to use correct property name with destructuring rename:

```typescript
// BEFORE (incorrect)
const { userId, role } = req.user;

// AFTER (correct)
const { id: userId, role } = req.user;
```

This fix was applied to all methods in the controller:
- `findAll()` - line 109
- `findOne()` - line 154
- `updateStatus()` - line 294
- `advancePhase()` - line 384

### Files Modified (Phase Transition Fixes)

| File | Change |
|------|--------|
| `src/process/process.types.ts` | Added 'analista', 'gestor' to cadastro_solicitacao allowedRoles |
| `src/process/process-transition.service.ts` | Added user validation, request null check, debug logging |
| `src/process/process.service.ts` | Added initial ProcessPhaseHistory on createProcess, added phase tracking on assignAnalyst |
| `src/process/process.controller.ts` | Fixed userId extraction from req.user (id → userId rename) |

---

## 🎯 Next Steps

1. **Restart backend** to apply all changes
2. **Test upload** with various file types (PDF, DOC, images)
3. **Verify** document deletion only works for pending documents
4. **Test advance phase** as analyst
5. **Monitor** file size limits (10MB max configured)

---

**End of Phase 1.14 Documentation**

*Date: 2026-01-19*
*Status: COMPLETED (with phase transition fixes)*
