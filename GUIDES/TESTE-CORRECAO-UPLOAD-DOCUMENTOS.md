# Guia de Teste - Correção de Upload de Documentos

**Data:** 2026-01-19
**Versão:** 1.0
**Correção:** Race Condition no Upload de Documentos

---

## 🎯 Objetivo

Validar que a correção da race condition no upload de documentos está funcionando corretamente.

---

## 📋 Pré-requisitos

### 1. Reiniciar Backend

```bash
cd c:\Projetos\halalsphere-backend-nest
npm run start:dev
```

**Aguardar até ver:**
```
[Nest] 12345  - Application is running on: http://localhost:3333
```

### 2. Reiniciar Frontend

```bash
cd c:\Projetos\halalsphere-frontend
npm run dev
```

**Aguardar até ver:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 3. Abrir Console do Navegador

- **Chrome/Edge:** `F12` → Aba "Console"
- **Firefox:** `F12` → Aba "Console"
- Filtrar por "DocumentService" ou "ProcessService"

---

## ✅ Teste 1: Upload Simples (1 Documento)

### Passos

1. **Login como Empresa:**
   - Usuário: `empresa@halalsphere.com`
   - Senha: `senha123`

2. **Criar Nova Solicitação:**
   - Menu → "Nova Solicitação"
   - Preencher todos os campos obrigatórios
   - **Anexar 1 documento** (qualquer PDF ou imagem)

3. **Submeter:**
   - Clicar em "Finalizar"
   - Aguardar mensagem de sucesso

### Resultado Esperado

#### ✅ UI
- Mensagem de sucesso: "Processo criado: 1 documento(s) enviado(s) com sucesso"
- **NÃO** deve aparecer: "1 falhou(ram) e pode(m) ser anexado(s) posteriormente"

#### ✅ Console do Navegador

```javascript
[DocumentService] Uploading document (attempt 1/3): {fileName: 'doc.pdf', ...}
[DocumentService] FormData contents: ...
[DocumentService] Upload successful on attempt 1/3: {...}
```

**NÃO DEVE APARECER:**
```javascript
❌ POST http://localhost:3333/documents/upload 404 (Not Found)
❌ [DocumentService] Request not found (attempt 1/3)
```

#### ✅ Console do Backend (Terminal)

```bash
[ProcessService] Request abc-123 created but not immediately visible  # ⚠️ Pode aparecer em casos raros
[DocumentService] Upload successful for abc-123 (doc.pdf). Elapsed: 45ms
```

**NÃO DEVE APARECER:**
```bash
❌ [DocumentService] Request abc-123 not found. Elapsed: 7ms
❌ NotFoundException: Request not found
```

### Critérios de Sucesso

- [ ] Documento foi enviado com sucesso (1/1)
- [ ] Sem erros 404 no console
- [ ] Tempo de upload < 200ms (primeira tentativa)
- [ ] Mensagem de sucesso exibida

---

## ✅ Teste 2: Upload Múltiplo (3-5 Documentos)

### Passos

1. **Criar Nova Solicitação:**
   - Preencher todos os campos
   - **Anexar 3-5 documentos** diferentes

2. **Submeter:**
   - Clicar em "Finalizar"

### Resultado Esperado

#### ✅ UI
- "Processo criado: 5 documento(s) enviado(s) com sucesso"
- Todos os documentos na lista de anexos

#### ✅ Console

```javascript
[DocumentService] Uploading document (attempt 1/3): {fileName: 'doc1.pdf', ...}
[DocumentService] Upload successful on attempt 1/3
[DocumentService] Uploading document (attempt 1/3): {fileName: 'doc2.pdf', ...}
[DocumentService] Upload successful on attempt 1/3
...
```

### Critérios de Sucesso

- [ ] Todos os documentos enviados (5/5)
- [ ] Sem erros 404
- [ ] Taxa de sucesso = 100%

---

## ✅ Teste 3: Teste de Carga (10 Solicitações)

### Objetivo
Verificar comportamento sob carga e taxa de retry.

### Passos

1. **Criar 10 solicitações rapidamente:**
   - Preencher formulário
   - Anexar 1-2 documentos cada
   - Submeter
   - Repetir 10 vezes

2. **Monitorar console do backend**

### Resultado Esperado

#### ✅ Métricas

- Taxa de sucesso: **> 99%**
- Taxa de retry (attempt 2/3): **< 5%**
- Uploads bem-sucedidos: **≥ 18/20** (se anexou 2 docs por solicitação)

#### ✅ Console Backend

```bash
# Sucesso normal (maioria dos casos)
[DocumentService] Upload successful for abc-123. Elapsed: 45ms

# Retry ocasional (aceitável em <5% dos casos)
[DocumentService] Uploading document (attempt 1/3)
[DocumentService] Request not found (attempt 1/3) - Retrying in 1000ms...
[DocumentService] Uploading document (attempt 2/3)
[DocumentService] Upload successful for abc-123. Elapsed: 1089ms
```

### Critérios de Sucesso

- [ ] Taxa de sucesso > 99%
- [ ] Retries ocasionais (< 5%)
- [ ] Nenhum upload falhou completamente

---

## ✅ Teste 4: Verificação de Logs Detalhados

### Backend - Sucesso na 1ª tentativa

```bash
prisma:query BEGIN
prisma:query INSERT INTO "Request" (...)
prisma:query INSERT INTO "Process" (...)
prisma:query INSERT INTO "ProcessPhaseHistory" (...)
prisma:query COMMIT
prisma:query SELECT "Request"."id" FROM "Request" WHERE "Request"."id" = $1  # ✅ Verificação pós-commit
[DocumentService] Upload successful for abc-123 (doc.pdf). Elapsed: 45ms
```

### Backend - Retry (Caso Raro)

```bash
prisma:query COMMIT  # Transaction do createProcess
[DocumentService] Request abc-123 not found. Elapsed: 7ms  # ⚠️ Race condition detectada
prisma:query ROLLBACK
# Frontend espera 1s...
prisma:query BEGIN
prisma:query SELECT "Request"."id" FROM "Request" WHERE "Request"."id" = $1  # ✅ Agora encontra
[DocumentService] Upload successful for abc-123 (doc.pdf). Elapsed: 1089ms
```

---

## 🔍 Troubleshooting

### Problema: Ainda aparece erro 404

#### Possível Causa 1: Backend não reiniciado
**Solução:**
```bash
cd c:\Projetos\halalsphere-backend-nest
npm run start:dev
```

#### Possível Causa 2: Frontend não reiniciado
**Solução:**
```bash
cd c:\Projetos\halalsphere-frontend
npm run dev
```

#### Possível Causa 3: Cache do navegador
**Solução:**
- Hard refresh: `Ctrl + Shift + R` (Chrome/Edge)
- Limpar cache e recarregar

---

### Problema: Upload lento (> 2s)

#### Diagnóstico

Verificar no console se há múltiplos retries:

```javascript
[DocumentService] Uploading document (attempt 1/3)
[DocumentService] Request not found (attempt 1/3) - Retrying...  # Retry 1
[DocumentService] Uploading document (attempt 2/3)
[DocumentService] Request not found (attempt 2/3) - Retrying...  # Retry 2
[DocumentService] Uploading document (attempt 3/3)
[DocumentService] Upload successful on attempt 3/3  # Sucesso apenas na 3ª tentativa
```

**Se isso ocorrer frequentemente (> 10% dos uploads):**
1. Verificar carga do banco de dados
2. Aumentar `maxWait` da transaction em `process.service.ts`
3. Reportar issue com logs detalhados

---

## 📊 Métricas de Sucesso

### Checklist Final

- [ ] **Teste 1:** Upload simples funcionou sem erros
- [ ] **Teste 2:** Upload múltiplo 100% de sucesso
- [ ] **Teste 3:** Taxa de sucesso > 99% sob carga
- [ ] **Teste 4:** Logs corretos (sem erros 404 persistentes)

### Se TODOS os testes passaram:

✅ **Correção validada com sucesso!**

A race condition foi resolvida e o sistema está pronto para uso.

---

## 📝 Relatório de Teste

Após executar os testes, preencher:

**Data do Teste:** _____________

**Testado por:** _____________

**Ambiente:**
- [ ] Desenvolvimento Local
- [ ] Staging
- [ ] Produção

**Resultados:**

| Teste | Status | Observações |
|-------|--------|-------------|
| Teste 1 - Upload Simples | ✅ / ❌ | |
| Teste 2 - Upload Múltiplo | ✅ / ❌ | |
| Teste 3 - Teste de Carga | ✅ / ❌ | |
| Teste 4 - Logs Detalhados | ✅ / ❌ | |

**Taxa de Retry Observada:** _____%

**Comentários:**
_______________________________________________________
_______________________________________________________

---

## 🔗 Referências

- [TROUBLESHOOTING-DOCUMENT-UPLOAD.md](./TROUBLESHOOTING-DOCUMENT-UPLOAD.md)
- [CORRECAO-UPLOAD-DOCUMENTOS-RACE-CONDITION.md](../CHANGELOG/CORRECAO-UPLOAD-DOCUMENTOS-RACE-CONDITION.md)

