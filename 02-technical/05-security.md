# 9. Segurança Técnica

## 9.1 Autenticação e Autorização

### JWT Strategy
```typescript
// Payload do JWT
interface JWTPayload {
  userId: string;
  email: string;
  role: 'empresa' | 'analista' | 'auditor' | 'gestor';
  companyId?: string;  // Se role=empresa
  iat: number;  // Issued at
  exp: number;  // Expiration (15min)
}

// Refresh Token (7 dias, armazenado no Redis)
interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}
```

### RBAC Matrix

| Recurso | Empresa | Analista | Auditor | Gestor |
|---------|---------|----------|---------|--------|
| Criar solicitação | ✅ | ❌ | ❌ | ❌ |
| Ver próprios processos | ✅ | ✅ (atribuídos) | ✅ (atribuídos) | ✅ (todos) |
| Editar documentos | ✅ (antes de enviar) | ❌ | ❌ | ❌ |
| Atribuir analista | ❌ | ❌ | ❌ | ✅ |
| Realizar auditoria | ❌ | ❌ | ✅ | ❌ |
| Emitir certificado | ❌ | ❌ | ❌ | ✅ |

Implementacao (NestJS Guards):
```typescript
// RolesGuard - aplicado via @UseGuards(JwtAuthGuard, RolesGuard)
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.role === role);
  }
}
```

---

## 9.2 Proteção de Dados (LGPD)

### Dados Pessoais Coletados
- Nome, email, telefone, CNPJ
- Endereço, responsável técnico
- IP de acesso, user agent

### Implementação de Direitos

```sql
-- Direito de Acesso (Art. 18, II)
SELECT jsonb_build_object(
    'usuario', (SELECT jsonb_strip_nulls(to_jsonb(users.*)) FROM users WHERE id = $1),
    'empresa', (SELECT jsonb_strip_nulls(to_jsonb(companies.*)) FROM companies WHERE user_id = $1),
    'processos', (SELECT jsonb_agg(to_jsonb(cp.*)) FROM certification_processes cp WHERE company_id IN (SELECT id FROM companies WHERE user_id = $1))
) AS meus_dados;

-- Direito de Portabilidade (Art. 18, V)
-- Exportar em JSON estruturado

-- Direito ao Esquecimento (Art. 18, VI)
-- Após fim de relação + prazo legal (3 anos):
DELETE FROM users WHERE id = $1;
-- Cascata deleta: companies, requests, etc (via ON DELETE CASCADE)
-- Audit trail mantido (anonimizado: email → 'deleted_user_123@anonymized.com')
```

---

## 9.3 Proteção contra OWASP Top 10

| Vulnerabilidade | Mitigação Implementada |
|-----------------|------------------------|
| **A01: Broken Access Control** | RBAC middleware em todas as rotas, validação server-side |
| **A02: Cryptographic Failures** | TLS 1.3, bcrypt (cost=12), Secrets Manager, sem dados sensíveis em logs |
| **A03: Injection** | Prisma ORM (prepared statements), Zod validation, sanitização HTML |
| **A04: Insecure Design** | Threat modeling, segregation of duties, rate limiting (Redis) |
| **A05: Security Misconfiguration** | Helmet.js (security headers), CORS restrito, env vars |
| **A06: Vulnerable Components** | Dependabot, npm audit semanal, Snyk scan no CI/CD |
| **A07: Auth Failures** | MFA obrigatório (analistas+), JWT short-lived, account lockout (5 tentativas) |
| **A08: Software Data Integrity** | Webhook HMAC validation (Stripe), CI/CD signing |
| **A09: Logging Failures** | Pino structured logs, ELK stack, alertas de anomalias |
| **A10: SSRF** | Validação de URLs, network segmentation, proxy interno |

---

## 9.4 Rate Limiting

```typescript
// Rate limiting via NestJS Throttler ou middleware customizado
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot({
  ttl: 900,    // 15 minutos (em segundos)
  limit: 100,  // 100 requests
});

// Rate limits específicos
// Login: 5 tentativas / 15min
// Upload: 10 arquivos / hora
// IA Analysis: 3 análises / hora (free tier)
```

---

## 9.5 Secrets Management

```bash
# AWS Secrets Manager (produção)
aws secretsmanager get-secret-value --secret-id halalsphere/prod/db

# Variáveis de ambiente (dev/staging)
SQL_HALALSPHERE_CONNECTION=postgresql://user:pass@localhost:5432/halalsphere
JWT_PUBLIC_KEY_HALALSPHERE_API=-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----
JWT_PRIVATE_KEY_HALALSPHERE_API=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
# AWS credentials não são necessárias - ECS usa IAM Roles
```

**NUNCA** commitar secrets no código!

---

