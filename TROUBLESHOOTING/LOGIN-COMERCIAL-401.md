# Troubleshooting: Erro 401 ao Acessar Detalhes de Proposta

> **DOCUMENTO HISTORICO (Dez 2024)** - Exemplos de codigo referem-se ao Fastify, que foi substituido por NestJS 11 + Express em Jan 2026. Os conceitos de JWT/auth continuam validos, mas a sintaxe mudou.

**Data:** 19/12/2024
**Issue:** Erro 401 (Unauthorized) ao clicar em "Ver Detalhes" de uma proposta

---

## 🐛 Problema Reportado

Ao acessar a tela de propostas comerciais e clicar em "Ver Detalhes" ou na linha de uma proposta, ocorria erro 401:

```
GET http://localhost:3333/api/proposals/process/286516b1-5444-48a5-8b8d-0c4b17d95125 401 (Unauthorized)
```

---

## 🔍 Diagnóstico

### Sintomas
- Usuário consegue acessar a tela de propostas
- Lista de propostas carrega corretamente
- Erro 401 apenas ao tentar acessar detalhes
- Interceptor de erro redireciona para login

### Causa Raiz

**Token JWT expirado ou inválido**

Tokens JWT têm validade limitada (configurada no backend):
- Tempo de vida: ~7 dias (604800 segundos)
- Campo: `exp` no payload do token
- Quando expira: Backend retorna 401

### Por que o erro só ocorre em alguns endpoints?

1. **Lista de propostas:** Endpoint `/api/comercial/proposals` estava sendo acessado com token válido
2. **Detalhes da proposta:** Endpoint `/api/proposals/process/:id` tentou ser acessado após expiração do token
3. **Interceptor do Axios:** Detecta 401 e redireciona para `/login`

---

## ✅ Solução Aplicada

### 1. Verificação do Usuário

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
await prisma.user.findFirst({ where: { email: 'comercial@halalsphere.com' } });
"
```

**Resultado:** Usuário existe e email está verificado

### 2. Tentativa de Login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"comercial@halalsphere.com","password":"comercial123"}'
```

**Erro:** `{"error": "Credenciais inválidas"}`

### 3. Reset de Senha

Criado script `reset-comercial-password.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function resetPassword() {
  const user = await prisma.user.findFirst({
    where: { email: 'comercial@halalsphere.com' }
  });

  const password = 'comercial123';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      emailVerified: true,
      activatedAt: new Date(),
      loginAttempts: 0,
      lockedUntil: null,
    },
  });
}
```

**Executado com:**
```bash
cd backend
node scripts/reset-comercial-password.js
```

**Resultado:** ✅ Senha resetada com sucesso

### 4. Novo Login

```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"comercial@halalsphere.com","password":"comercial123"}'
```

**Resultado:** Token válido gerado:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "b4fedacc-8ace-4f68-813f-e81db28a26f8",
      "email": "comercial@halalsphere.com",
      "name": "Departamento Comercial",
      "role": "comercial"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🔧 Como Resolver no Futuro

### Opção 1: Re-login via Interface

1. Acesse `http://localhost:5173/login`
2. Faça login com:
   - Email: `comercial@halalsphere.com`
   - Senha: `comercial123`
3. Novo token será armazenado automaticamente

### Opção 2: Reset de Senha via Script

Se houver problema com a senha:

```bash
cd backend
node scripts/reset-comercial-password.js
```

### Opção 3: Gerar Token Manualmente

```bash
cd backend
npx ts-node scripts/get-comercial-token.ts
```

Depois copiar o token para localStorage:
```javascript
localStorage.setItem('token', 'SEU_TOKEN_AQUI');
```

---

## 🔐 Configuração de Tokens JWT

### Localização

**Backend:** `backend/src/modules/auth/auth.service.ts`

### Configuração Atual

```typescript
const token = fastify.jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
  },
  {
    expiresIn: '7d', // 7 dias
  }
);
```

### Como Alterar Validade

1. Abra `backend/src/modules/auth/auth.service.ts`
2. Localize o método `login`
3. Altere `expiresIn`:
   - `'1h'` - 1 hora
   - `'1d'` - 1 dia
   - `'7d'` - 7 dias (atual)
   - `'30d'` - 30 dias

**Recomendação:** Manter entre 1-7 dias para segurança

---

## 📝 Scripts Criados

### 1. reset-comercial-password.js

**Localização:** `backend/scripts/reset-comercial-password.js`

**Função:** Reseta a senha do usuário comercial para 'comercial123' e garante que a conta está ativa

**Uso:**
```bash
cd backend
node scripts/reset-comercial-password.js
```

### 2. get-comercial-token.ts

**Localização:** `backend/scripts/get-comercial-token.ts`

**Função:** Faz login e retorna o token JWT válido

**Uso:**
```bash
cd backend
npx ts-node scripts/get-comercial-token.ts
```

### 3. verify-comercial-user.ts

**Localização:** `backend/scripts/verify-comercial-user.ts`

**Função:** Marca o email do usuário comercial como verificado

**Uso:**
```bash
cd backend
npx ts-node scripts/verify-comercial-user.ts
```

---

## 🔄 Interceptor de Autenticação

### Como Funciona

**Arquivo:** `frontend/src/lib/api.ts`

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Comportamento
1. Toda resposta HTTP é interceptada
2. Se status for 401:
   - Remove token e user do localStorage
   - Redireciona para `/login`
   - Usuário vê tela de login
3. Se outro erro:
   - Propaga erro normalmente

---

## 🧪 Testes

### Teste 1: Verificar Token Válido

```bash
TOKEN="seu_token_aqui"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3333/api/comercial/dashboard
```

**Esperado:** Retorna dados do dashboard (status 200)

### Teste 2: Verificar Token Expirado

Use um token antigo ou manipule a data do sistema

**Esperado:** Erro 401

### Teste 3: Verificar Sem Token

```bash
curl http://localhost:3333/api/comercial/dashboard
```

**Esperado:** Erro 401

---

## 🚨 Prevenção

### Para Desenvolvedores

1. **Avisar Expiração:**
   - Implementar warning quando token estiver próximo de expirar
   - Mostrar toast: "Sua sessão expira em X minutos"

2. **Refresh Token:**
   - Implementar sistema de refresh tokens
   - Token de acesso: curta duração (1h)
   - Refresh token: longa duração (30d)
   - Auto-renova antes de expirar

3. **Persistência de Sessão:**
   - Opção "Lembrar-me" no login
   - Token com validade maior se marcado

### Para Usuários

1. **Re-login Regular:**
   - Fazer login novamente a cada sessão de trabalho
   - Não confiar em tokens muito antigos

2. **Verificar Erro 401:**
   - Se aparecer erro 401, fazer logout e login novamente
   - Não tentar forçar requisições com token inválido

---

## 📚 Referências

- **Interceptor:** [frontend/src/lib/api.ts](../../frontend/src/lib/api.ts)
- **Auth Service:** [backend/src/modules/auth/auth.service.ts](../../backend/src/modules/auth/auth.service.ts)
- **JWT Config:** [@fastify/jwt](https://github.com/fastify/fastify-jwt)

---

## ✅ Checklist de Resolução

Quando encontrar erro 401:

- [ ] Verificar se backend está rodando (`curl http://localhost:3333/health`)
- [ ] Verificar se existe token no localStorage
- [ ] Tentar fazer login novamente via interface
- [ ] Se login falhar, verificar se usuário existe no banco
- [ ] Se usuário existe, resetar senha via script
- [ ] Fazer novo login e testar

---

## 💡 Lições Aprendidas

1. **bcrypt vs bcryptjs:**
   - Projeto usa `bcrypt` (nativo, mais rápido)
   - Scripts antigos usavam `bcryptjs` (JavaScript puro)
   - Sempre verificar qual biblioteca está instalada

2. **Token Expiration:**
   - Tokens expiram por segurança
   - Sistema está funcionando corretamente ao rejeitar tokens expirados
   - Implementar refresh token para melhor UX

3. **Diagnóstico Sistemático:**
   - Verificar usuário existe
   - Testar login
   - Isolar problema (senha vs token vs permissão)
   - Aplicar solução específica

---

## 🎯 Conclusão

O erro 401 foi causado por **token JWT expirado** ou **senha inválida**. A solução foi resetar a senha do usuário comercial usando o script `reset-comercial-password.js` e fazer novo login para obter token válido.

**Status:** ✅ Resolvido

**Próximos passos:**
- Implementar sistema de refresh tokens
- Adicionar warning de expiração
- Melhorar UX de re-autenticação
