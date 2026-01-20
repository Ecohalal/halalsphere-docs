# 🧪 Guia de Teste via Postman - Criação de Processo

**Data:** 2026-01-19
**Objetivo:** Testar o fluxo completo de criação de processo e upload de documentos

---

## 📋 Pré-requisitos

1. Backend rodando em `http://localhost:3333`
2. Postman instalado
3. Banco de dados com dados de seed (usuários, industrial groups, etc)

---

## 🔐 Passo 1: Autenticação (Login)

### **Endpoint:** `POST /auth/login`

**URL:**
```
http://localhost:3333/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "empresa@test.com",
  "password": "senha123"
}
```

**Resposta Esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "empresa@test.com",
    "name": "Empresa Teste",
    "role": "empresa",
    "companyId": "uuid-da-empresa"
  }
}
```

**⚠️ IMPORTANTE:** Copie o `access_token` - você vai usar em todos os próximos requests!

---

## 📝 Passo 2: Criar Processo (Request + Process)

### **Endpoint:** `POST /processes`

**URL:**
```
http://localhost:3333/processes
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (raw JSON) - EXEMPLO COMPLETO:**
```json
{
  "companyName": "Frigorífico Halal LTDA",
  "cnpj": "12345678000190",
  "address": "Rua das Indústrias, 1000 - Distrito Industrial",
  "phone": "11987654321",
  "contactName": "João Silva",
  "contactEmail": "joao@frigorifico.com",
  "industrialGroup": "A",
  "industrialCategory": "AI",
  "industrialSubcategory": "AI-01",
  "productType": "Carne Bovina Refrigerada",
  "productDescription": "Cortes nobres de carne bovina refrigerada para exportação, processados segundo normas Halal",
  "productCategory": "Produtos Cárneos",
  "productionCapacity": "5000 kg/dia",
  "productionAddress": "Av. Industrial, 2000 - Zona Frigorífica",
  "hasOtherCertifications": true,
  "otherCertifications": "ISO 22000, HACCP",
  "ingredients": "Carne bovina 100% (músculo bovino)",
  "suppliers": "Fazenda São José (BR), Pecuária Santa Maria (BR)",
  "hasAnimalIngredients": true,
  "animalIngredientDetails": "Carne bovina proveniente de bovinos abatidos segundo ritual Halal",
  "agreedToTerms": true,
  "requestType": "nova",
  "certificationType": "C1",
  "productOrigin": "animal"
}
```

**Resposta Esperada (200):**
```json
{
  "id": "process-uuid",
  "requestId": "request-uuid",
  "protocol": "HS-2026-001",
  "companyId": "company-uuid",
  "companyName": "Frigorífico Halal LTDA",
  "cnpj": "12345678000190",
  "address": "Rua das Indústrias, 1000 - Distrito Industrial",
  "phone": "11987654321",
  "contactName": "João Silva",
  "contactEmail": "joao@frigorifico.com",
  "industrialGroup": "A",
  "industrialCategory": "AI",
  "industrialSubcategory": "AI-01",
  "productType": "Carne Bovina Refrigerada",
  "productCategory": "Produtos Cárneos",
  "productDescription": "Cortes nobres de carne bovina...",
  "productionCapacity": "5000 kg/dia",
  "productionAddress": "Av. Industrial, 2000 - Zona Frigorífica",
  "hasOtherCertifications": true,
  "otherCertifications": "ISO 22000, HACCP",
  "ingredients": "Carne bovina 100%...",
  "suppliers": "Fazenda São José...",
  "hasAnimalIngredients": true,
  "animalIngredientDetails": "Carne bovina proveniente...",
  "status": "rascunho",
  "currentPhase": "cadastro_solicitacao",
  "priority": "media",
  "assignedAnalystId": null,
  "assignedAnalystName": null,
  "createdAt": "2026-01-19T15:30:00.000Z",
  "updatedAt": "2026-01-19T15:30:00.000Z",
  "daysInStage": 0
}
```

**⚠️ IMPORTANTE:**
- Copie o `requestId` - você vai precisar para o upload de documentos!
- Copie o `id` (process ID) - útil para consultas posteriores

---

## 🔍 Passo 3: Verificar Dados no Banco

Execute esta query no PostgreSQL para verificar se os dados foram salvos corretamente:

```sql
-- Verificar Request criado
SELECT
  id,
  protocol,
  company_name,
  cnpj,
  contact_person,           -- ✅ Deve estar preenchido
  contact_email,            -- ✅ Deve estar preenchido
  contact_phone,            -- ✅ Deve estar preenchido
  facility_address,         -- ✅ Deve estar preenchido
  industrial_group_id,      -- ✅ Deve ter UUID (se tabela tem dados)
  industrial_category_id,   -- ✅ Deve ter UUID (se tabela tem dados)
  industrial_subcategory_id, -- ✅ Deve ter UUID (se tabela tem dados)
  industrial_classification, -- ✅ Deve ter string descritiva
  estimated_production_capacity, -- ✅ Deve estar preenchido
  current_certifications,   -- ✅ Deve estar preenchido
  product_details,          -- JSON com ingredients, suppliers, etc
  production_details,       -- JSON com productionAddress
  status,
  created_at
FROM requests
ORDER BY created_at DESC
LIMIT 1;
```

**✅ CHECKLIST - O que deve estar preenchido:**
- [x] `contact_person` = "João Silva"
- [x] `contact_email` = "joao@frigorifico.com"
- [x] `contact_phone` = "11987654321"
- [x] `facility_address` = "Rua das Indústrias, 1000..."
- [x] `estimated_production_capacity` = "5000 kg/dia"
- [x] `current_certifications` = "ISO 22000, HACCP"
- [x] `industrial_classification` = "A - AI - AI-01" (ou nomes completos se encontrou)
- [x] `industrial_group_id` = UUID (se tabela industrial_groups tem código "A")
- [x] `industrial_category_id` = UUID (se tabela industrial_categories tem código "AI")
- [x] `industrial_subcategory_id` = UUID (se tabela industrial_subcategories tem código "AI-01")

---

## 📤 Passo 4: Upload de Documento

### **Endpoint:** `POST /documents/upload`

**URL:**
```
http://localhost:3333/documents/upload
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body (form-data):**
```
file: [SELECIONE UM ARQUIVO PDF]
requestId: SEU_REQUEST_ID_DO_PASSO_2
documentType: contrato_social
```

**Como fazer no Postman:**
1. Vá para a tab "Body"
2. Selecione "form-data"
3. Adicione 3 campos:
   - `file` (tipo: File) → Clique em "Select Files" e escolha um PDF
   - `requestId` (tipo: Text) → Cole o requestId do Passo 2
   - `documentType` (tipo: Text) → Digite: `contrato_social`

**Tipos de documento válidos:**
- `contrato_social`
- `certidao_negativa`
- `alvara_funcionamento`
- `laudo_tecnico`
- `licenca_sanitaria`
- `fotos`
- `videos`
- `laudos`
- `manual_bpf`
- `fluxograma_processo`
- `lista_fornecedores`
- `certificado_ingredientes`
- `analise_produto`
- `rotulo_produto`
- `outros`

**Resposta Esperada (201):**
```json
{
  "id": "document-uuid",
  "requestId": "request-uuid",
  "documentType": "contrato_social",
  "fileName": "contrato_social.pdf",
  "fileUrl": "/uploads/documents/request-uuid-1737307800000.pdf",
  "fileSize": 245678,
  "mimeType": "application/pdf",
  "validationStatus": "pendente",
  "validationNotes": null,
  "uploadedAt": "2026-01-19T15:35:00.000Z",
  "validatedAt": null
}
```

---

## 🔄 Passo 5: Submeter Wizard (Rascunho → Pendente)

### **Endpoint:** `POST /processes/:id/submit`

**URL:**
```
http://localhost:3333/processes/SEU_PROCESS_ID/submit
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Body:** (nenhum)

**Resposta Esperada (200):**
```json
{
  "id": "process-uuid",
  "protocol": "HS-2026-001",
  "companyId": "company-uuid",
  "companyName": "Frigorífico Halal LTDA",
  "productType": "Carne Bovina Refrigerada",
  "productCategory": "Produtos Cárneos",
  "productDescription": "Cortes nobres...",
  "status": "pendente",
  "currentPhase": "cadastro_solicitacao",
  "priority": "media",
  "assignedAnalystId": null,
  "assignedAnalystName": null,
  "createdAt": "2026-01-19T15:30:00.000Z",
  "updatedAt": "2026-01-19T15:36:00.000Z",
  "daysInStage": 0
}
```

---

## 🔍 Passo 6: Consultar Processo Criado

### **Endpoint:** `GET /processes/:id`

**URL:**
```
http://localhost:3333/processes/SEU_PROCESS_ID
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200):**
Retorna todos os detalhes do processo com os dados das colunas corretas.

---

## 📊 Passo 7: Consultar Documentos do Request

### **Endpoint:** `GET /documents/request/:requestId`

**URL:**
```
http://localhost:3333/documents/request/SEU_REQUEST_ID
```

**Headers:**
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta Esperada (200):**
```json
{
  "documents": [
    {
      "id": "document-uuid",
      "requestId": "request-uuid",
      "documentType": "contrato_social",
      "fileName": "contrato_social.pdf",
      "fileUrl": "/uploads/documents/...",
      "fileSize": 245678,
      "mimeType": "application/pdf",
      "validationStatus": "pendente",
      "uploadedAt": "2026-01-19T15:35:00.000Z"
    }
  ]
}
```

---

## 🚨 Troubleshooting

### **Erro 404 "Request not found" no upload:**
- **Causa:** Race condition - request ainda não está visível no banco
- **Solução:** Aguarde 1-2 segundos após criar o processo antes de fazer upload
- **Logs esperados no backend:** Você deve ver mensagens de retry no console

### **Erro 401 "Unauthorized":**
- **Causa:** Token inválido ou expirado
- **Solução:** Faça login novamente (Passo 1) e pegue novo token

### **Erro 400 "Validation failed":**
- **Causa:** Campos obrigatórios faltando
- **Solução:** Verifique se todos os campos do exemplo estão presentes

### **industrial_group_id é NULL:**
- **Causa:** Tabela `industrial_groups` não tem código "A"
- **Solução:** Execute seed para popular as tabelas de classificação industrial
- **Comportamento esperado:** Sistema salva código "A" na string `industrial_classification` mesmo sem UUID

---

## 📁 Collection do Postman (JSON)

Você pode importar esta collection no Postman:

```json
{
  "info": {
    "name": "HalalSphere - Teste Criação Processo",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3333"
    },
    {
      "key": "token",
      "value": ""
    },
    {
      "key": "processId",
      "value": ""
    },
    {
      "key": "requestId",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "1. Login (Empresa)",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "var jsonData = pm.response.json();",
              "pm.collectionVariables.set(\"token\", jsonData.access_token);"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"empresa@test.com\",\n  \"password\": \"senha123\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/auth/login",
          "host": ["{{baseUrl}}"],
          "path": ["auth", "login"]
        }
      }
    },
    {
      "name": "2. Criar Processo",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "var jsonData = pm.response.json();",
              "pm.collectionVariables.set(\"processId\", jsonData.id);",
              "pm.collectionVariables.set(\"requestId\", jsonData.requestId);"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"companyName\": \"Frigorífico Halal LTDA\",\n  \"cnpj\": \"12345678000190\",\n  \"address\": \"Rua das Indústrias, 1000 - Distrito Industrial\",\n  \"phone\": \"11987654321\",\n  \"contactName\": \"João Silva\",\n  \"contactEmail\": \"joao@frigorifico.com\",\n  \"industrialGroup\": \"A\",\n  \"industrialCategory\": \"AI\",\n  \"industrialSubcategory\": \"AI-01\",\n  \"productType\": \"Carne Bovina Refrigerada\",\n  \"productDescription\": \"Cortes nobres de carne bovina refrigerada para exportação\",\n  \"productCategory\": \"Produtos Cárneos\",\n  \"productionCapacity\": \"5000 kg/dia\",\n  \"productionAddress\": \"Av. Industrial, 2000 - Zona Frigorífica\",\n  \"hasOtherCertifications\": true,\n  \"otherCertifications\": \"ISO 22000, HACCP\",\n  \"ingredients\": \"Carne bovina 100%\",\n  \"suppliers\": \"Fazenda São José (BR)\",\n  \"hasAnimalIngredients\": true,\n  \"animalIngredientDetails\": \"Carne bovina Halal\",\n  \"agreedToTerms\": true\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/processes",
          "host": ["{{baseUrl}}"],
          "path": ["processes"]
        }
      }
    },
    {
      "name": "3. Upload Documento",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": []
            },
            {
              "key": "requestId",
              "value": "{{requestId}}",
              "type": "text"
            },
            {
              "key": "documentType",
              "value": "contrato_social",
              "type": "text"
            }
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/documents/upload",
          "host": ["{{baseUrl}}"],
          "path": ["documents", "upload"]
        }
      }
    },
    {
      "name": "4. Submeter Wizard",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/processes/{{processId}}/submit",
          "host": ["{{baseUrl}}"],
          "path": ["processes", "{{processId}}", "submit"]
        }
      }
    },
    {
      "name": "5. Consultar Processo",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/processes/{{processId}}",
          "host": ["{{baseUrl}}"],
          "path": ["processes", "{{processId}}"]
        }
      }
    },
    {
      "name": "6. Listar Documentos",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/documents/request/{{requestId}}",
          "host": ["{{baseUrl}}"],
          "path": ["documents", "request", "{{requestId}}"]
        }
      }
    }
  ]
}
```

---

## 📝 Checklist de Teste

- [ ] Login realizado com sucesso
- [ ] Token salvo
- [ ] Processo criado (status 201)
- [ ] `requestId` e `processId` salvos
- [ ] Query SQL executada mostrando colunas preenchidas
- [ ] Upload de documento bem-sucedido (ou falhou com retry esperado)
- [ ] Wizard submetido (status mudou para `pendente`)
- [ ] Processo consultado com todos os dados corretos

---

**✅ Se todos os passos funcionaram, a correção está OK!**
**❌ Se upload falhar com 404 após 5 tentativas, precisamos corrigir a race condition.**
