# 7. Sistema de Autenticação

**Refresh Tokens + HttpOnly Cookies | Sessões Múltiplas | Segurança Avançada**

---

## Document Control

| Campo | Valor |
|-------|-------|
| **Versão** | 1.0 |
| **Data** | 26 de Janeiro de 2026 |
| **Autor** | Tech Lead - HalalSphere Team |
| **Status** | ✅ Implementado |
| **Ambiente** | Production |

---

## 1. Visão Geral

O sistema de autenticação do HalalSphere implementa um modelo seguro baseado em:

- **Access Token (JWT)**: Token de curta duração (15 minutos) para autenticar requisições
- **Refresh Token**: Token de longa duração (7 dias) armazenado no banco de dados para renovar access tokens
- **HttpOnly Cookies**: Armazenamento seguro de tokens no navegador, imune a XSS
- **Rotação de Tokens**: A cada renovação, o refresh token anterior é invalidado

### Benefícios

| Característica | Benefício |
|----------------|-----------|
| **Access Token curto (15min)** | Limita janela de exposição se token for comprometido |
| **Refresh Token no BD** | Permite revogação imediata (logout) |
| **HttpOnly Cookies** | Imune a ataques XSS (JavaScript não acessa) |
| **Rotação automática** | Detecta uso de token roubado |
| **Múltiplas sessões** | Usuário pode logar em vários dispositivos |

---

## 2. Arquitetura

### 2.1 Diagrama de Fluxo

```
┌─────────────┐                    ┌─────────────┐                    ┌──────────────┐
│   Browser   │                    │   Backend   │                    │   Database   │
│  (Frontend) │                    │   (NestJS)  │                    │ (PostgreSQL) │
└──────┬──────┘                    └──────┬──────┘                    └──────┬───────┘
       │                                  │                                  │
       │  1. POST /auth/login             │                                  │
       │  { email, password }             │                                  │
       ├─────────────────────────────────►│                                  │
       │                                  │  2. Validate credentials         │
       │                                  ├─────────────────────────────────►│
       │                                  │                                  │
       │                                  │  3. Create refresh_token         │
       │                                  ├─────────────────────────────────►│
       │                                  │                                  │
       │  4. Set-Cookie: access_token     │                                  │
       │  4. Set-Cookie: refresh_token    │                                  │
       │◄─────────────────────────────────┤                                  │
       │                                  │                                  │
       │  5. GET /api/* (with cookies)    │                                  │
       ├─────────────────────────────────►│                                  │
       │                                  │                                  │
       │  6. POST /auth/refresh           │                                  │
       │  (when access_token expires)     │                                  │
       ├─────────────────────────────────►│                                  │
       │                                  │  7. Validate + Rotate token      │
       │                                  ├─────────────────────────────────►│
       │                                  │                                  │
       │  8. New cookies                  │                                  │
       │◄─────────────────────────────────┤                                  │
       │                                  │                                  │
```

### 2.2 Tabela refresh_tokens

```sql
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "token" VARCHAR(500) NOT NULL,          -- SHA-256 hash do token
    "user_id" UUID NOT NULL,
    "user_agent" VARCHAR(500),              -- Browser/Device info
    "ip_address" VARCHAR(45),               -- IPv4 ou IPv6
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),              -- NULL = ativo

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- Índices
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- Foreign Key
ALTER TABLE "refresh_tokens"
ADD CONSTRAINT "refresh_tokens_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## 3. Configuração de Cookies

### 3.1 Opções de Cookie

```typescript
// src/auth/auth.service.ts
export const COOKIE_OPTIONS = {
  httpOnly: true,                    // Não acessível via JavaScript
  secure: process.env.NODE_ENV === 'production',  // HTTPS only em prod
  sameSite: 'none' as const,         // Cross-site cookies (subdomínios)
  domain: process.env.NODE_ENV === 'production'
    ? '.ecohalal.solutions'          // Compartilhado entre subdomínios
    : undefined,                      // localhost não precisa
  path: '/',                          // Disponível em todas as rotas
};

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Tempos de expiração
export const ACCESS_TOKEN_EXPIRY = '15m';                    // 15 minutos
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 dias (ms)
```

### 3.2 Domínios e Cross-Site

| Ambiente | Domain Cookie | Frontend | Backend |
|----------|---------------|----------|---------|
| **Local** | `undefined` | localhost:5173 | localhost:3333 |
| **Produção** | `.ecohalal.solutions` | halalsphere.ecohalal.solutions | halalsphere-api.ecohalal.solutions |

O domínio `.ecohalal.solutions` (com ponto inicial) permite que o cookie seja enviado para todos os subdomínios.

---

## 4. Endpoints de Autenticação

### 4.1 Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@empresa.com",
  "password": "senha123"
}

Response: 200 OK
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiI...; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=900
Set-Cookie: refresh_token=dGhpcyBpcyBh...; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800

{
  "user": {
    "id": "uuid",
    "email": "usuario@empresa.com",
    "name": "Nome",
    "role": "empresa",
    "companyId": "uuid",
    "groupId": "uuid",
    "isGroupAdmin": false,
    "isCompanyAdmin": true,
    "isTemporaryAdmin": true,
    "pendingValidation": false
  },
  "token": "eyJhbGciOiJIUzI1NiI..."  // Backwards compatibility
}
```

### 4.2 Renovar Tokens

```
POST /auth/refresh
Cookie: refresh_token=dGhpcyBpcyBh...

Response: 200 OK
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiI...; HttpOnly; Secure; ...
Set-Cookie: refresh_token=bmV3IHRva2VuIGhlcmU...; HttpOnly; Secure; ...

{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiI..."
}
```

### 4.3 Logout

```
POST /auth/logout
Authorization: Bearer <access_token>
Cookie: refresh_token=dGhpcyBpcyBh...

Response: 200 OK
Set-Cookie: access_token=; Max-Age=0
Set-Cookie: refresh_token=; Max-Age=0

{
  "message": "Logout realizado com sucesso"
}
```

### 4.4 Logout de Todos os Dispositivos

```
POST /auth/logout-all
Authorization: Bearer <access_token>

Response: 200 OK

{
  "message": "Logout realizado em 3 dispositivo(s)",
  "sessionsRevoked": 3
}
```

### 4.5 Listar Sessões Ativas

```
GET /auth/sessions
Authorization: Bearer <access_token>

Response: 200 OK

{
  "sessions": [
    {
      "id": "uuid",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
      "ipAddress": "201.123.45.67",
      "createdAt": "2026-01-26T10:30:00.000Z",
      "expiresAt": "2026-02-02T10:30:00.000Z"
    },
    {
      "id": "uuid2",
      "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...",
      "ipAddress": "189.45.67.89",
      "createdAt": "2026-01-25T14:20:00.000Z",
      "expiresAt": "2026-02-01T14:20:00.000Z"
    }
  ]
}
```

### 4.6 Revogar Sessão Específica

```
DELETE /auth/sessions/:sessionId
Authorization: Bearer <access_token>

Response: 200 OK

{
  "success": true,
  "message": "Sessão revogada com sucesso"
}
```

---

## 5. Implementação Backend

### 5.1 RefreshTokenService

Localização: `src/auth/refresh-token.service.ts`

```typescript
@Injectable()
export class RefreshTokenService {
  // Tempo de vida do refresh token: 7 dias
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;

  // Cria novo refresh token
  async createRefreshToken(params: {
    userId: string;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<string> {
    // Gera token aleatório de 64 bytes
    const token = randomBytes(64).toString('base64url');

    // Armazena hash SHA-256 no banco (nunca o token original)
    const hashedToken = this.hashToken(token);

    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId: params.userId,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      },
    });

    return token; // Retorna token original para o cookie
  }

  // Valida refresh token
  async validateRefreshToken(token: string): Promise<string | null> {
    const hashedToken = this.hashToken(token);

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashedToken },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      return null;
    }

    return storedToken.userId;
  }

  // Rotaciona token (invalida antigo, cria novo)
  async rotateRefreshToken(oldToken: string, params: {...}): Promise<string | null> {
    const hashedOldToken = this.hashToken(oldToken);

    // Transação atômica
    const result = await this.prisma.$transaction(async (tx) => {
      // Revoga token antigo
      await tx.refreshToken.update({
        where: { token: hashedOldToken },
        data: { revokedAt: new Date() },
      });

      // Cria novo token
      const newToken = randomBytes(64).toString('base64url');
      const hashedNewToken = this.hashToken(newToken);

      await tx.refreshToken.create({
        data: {
          token: hashedNewToken,
          userId: params.userId,
          userAgent: params.userAgent,
          ipAddress: params.ipAddress,
          expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        },
      });

      return newToken;
    });

    return result;
  }

  // Hash SHA-256
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
```

### 5.2 JWT Strategy

Localização: `src/auth/strategies/jwt.strategy.ts`

O token é extraído do cookie ou do header Authorization (fallback para compatibilidade):

```typescript
const cookieOrHeaderExtractor = (req: Request): string | null => {
  // 1. Tenta extrair do cookie (prioritário)
  if (req.cookies && req.cookies[ACCESS_TOKEN_COOKIE]) {
    return req.cookies[ACCESS_TOKEN_COOKIE];
  }

  // 2. Fallback: header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: cookieOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return this.authService.validateUser(payload.sub);
  }
}
```

---

## 6. Implementação Frontend

### 6.1 Configuração Axios

Localização: `src/lib/api.ts`

```typescript
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // ESSENCIAL: envia cookies automaticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para refresh automático
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se 401 e não é retry, tenta refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Aguarda refresh em andamento
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');

        // Processa fila de requisições que falharam
        failedQueue.forEach(({ resolve }) => resolve());
        failedQueue = [];

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou - logout
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

### 6.2 Auth Service

Localização: `src/services/auth.service.ts`

```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);

    // Token vem no cookie automaticamente
    // Armazena user no localStorage para acesso rápido
    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return { success: true, data: response.data };
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async getSessions() {
    const response = await api.get('/auth/sessions');
    return response.data.sessions;
  }

  async revokeSession(sessionId: string) {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data.success;
  }
}
```

---

## 7. Segurança

### 7.1 Proteções Implementadas

| Ameaça | Proteção |
|--------|----------|
| **XSS (Cross-Site Scripting)** | HttpOnly cookies - JavaScript não pode acessar |
| **CSRF (Cross-Site Request Forgery)** | SameSite=None + origem validada no CORS |
| **Token Theft** | Tokens curtos (15min) + rotação de refresh |
| **Replay Attack** | Token invalidado após uso (rotação) |
| **Brute Force** | Rate limiting + account lockout (5 tentativas) |
| **Token in DB Breach** | Armazenado como hash SHA-256, não texto |

### 7.2 Account Lockout

Após 5 tentativas de login falhas, a conta é bloqueada por 15 minutos:

```typescript
if (newAttempts >= maxAttempts) {
  const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  await this.prisma.user.update({
    where: { id: userId },
    data: { loginAttempts: newAttempts, lockedUntil: lockUntil },
  });
}
```

### 7.3 CORS Configuration

```typescript
// src/main.ts
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://halalsphere.ecohalal.solutions',
  'https://halalsphere-staging.ecohalal.solutions',
];

app.enableCors({
  origin: allowedOrigins,
  credentials: true,  // Permite envio de cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
```

---

## 8. Payload do JWT

### 8.1 Access Token Payload

```typescript
interface JwtPayload {
  sub: string;         // User ID (UUID)
  email: string;
  role: 'empresa' | 'analista' | 'auditor' | 'gestor';
  companyId: string | null;
  groupId: string | null;
  isGroupAdmin: boolean;
  isCompanyAdmin: boolean;
  iat: number;         // Issued at (Unix timestamp)
  exp: number;         // Expiration (iat + 15 min)
}
```

### 8.2 User Object Retornado

```typescript
interface TokensResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyId: string | null;
    groupId: string | null;
    isGroupAdmin: boolean;
    isCompanyAdmin: boolean;
    isTemporaryAdmin: boolean;
    pendingValidation: boolean;
  };
}
```

---

## 9. Infraestrutura AWS

### 9.1 Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CloudFront                                │
│                    halalsphere.ecohalal.solutions                   │
│                                                                     │
│  ┌─────────────────┐                      ┌─────────────────────┐   │
│  │   S3 Bucket     │                      │    API Gateway      │   │
│  │   (Frontend)    │                      │                     │   │
│  │                 │                      │  /auth/* → NLB      │   │
│  │  React SPA      │                      │  /api/*  → NLB      │   │
│  └─────────────────┘                      └──────────┬──────────┘   │
│                                                      │              │
│                                           ┌──────────▼──────────┐   │
│                                           │        NLB          │   │
│                                           │                     │   │
│                                           └──────────┬──────────┘   │
│                                                      │              │
│                                           ┌──────────▼──────────┐   │
│                                           │    ECS Fargate      │   │
│                                           │    (NestJS)         │   │
│                                           │                     │   │
│                                           │  halalsphere-api    │   │
│                                           │  .ecohalal.solutions│   │
│                                           └──────────┬──────────┘   │
│                                                      │              │
│                                           ┌──────────▼──────────┐   │
│                                           │    RDS PostgreSQL   │   │
│                                           │                     │   │
│                                           │  - users            │   │
│                                           │  - refresh_tokens   │   │
│                                           │  - companies        │   │
│                                           │  - ...              │   │
│                                           └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2 Configuração Necessária

O cookie domain `.ecohalal.solutions` funciona porque:
1. Frontend: `halalsphere.ecohalal.solutions`
2. Backend: `halalsphere-api.ecohalal.solutions`

Ambos são subdomínios de `.ecohalal.solutions`, permitindo compartilhamento de cookies.

---

## 10. Manutenção

### 10.1 Limpeza de Tokens Expirados

Recomenda-se criar um cron job para limpar tokens expirados:

```sql
-- Executar diariamente
DELETE FROM refresh_tokens
WHERE expires_at < NOW() - INTERVAL '1 day'
   OR revoked_at IS NOT NULL;
```

### 10.2 Monitoramento

Métricas a monitorar:
- Número de logins por minuto
- Taxa de refresh tokens
- Tokens revogados (possível indicador de token theft)
- Contas bloqueadas (brute force attempts)

---

## 11. Troubleshooting

### 11.1 Cookie não sendo enviado

**Sintoma**: Backend retorna 401 mesmo após login bem-sucedido.

**Causas comuns**:
1. `withCredentials: true` não configurado no Axios
2. CORS não permite `credentials: true`
3. Domínio do cookie não bate (ex: dev vs prod)

**Solução**:
```typescript
// Frontend
axios.create({ withCredentials: true });

// Backend
app.enableCors({ credentials: true });
```

### 11.2 Refresh loop infinito

**Sintoma**: Requisições ficam em loop tentando refresh.

**Causa**: Refresh token expirado ou inválido.

**Solução**: O interceptor deve redirecionar para login quando refresh falha:
```typescript
if (refreshError) {
  window.location.href = '/login';
}
```

### 11.3 Múltiplos dispositivos não funcionam

**Sintoma**: Login em um dispositivo desloga outro.

**Verificar**: Cada login cria um novo refresh token (não substitui o anterior).

---

## 12. Referências

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://auth0.com/blog/jwt-security-best-practices/)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

---

**Última atualização**: 26 de Janeiro de 2026
