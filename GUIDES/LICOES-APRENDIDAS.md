# Licoes Aprendidas - HalalSphere

**Data de Criacao:** 10/02/2026
**Ultima Atualizacao:** 10/02/2026
**Versao:** 1.0

---

## Principio Fundamental

> **Quando voce tem codigo FUNCIONANDO, NAO mude o padrao de fluxo de dados ao otimizar.**
> **Sempre valide contra o codigo real dos repos, nao contra documentacao que pode estar desatualizada.**

### O Que Pode Fazer

- Adicionar validacoes e guards
- Melhorar indices no banco
- Adicionar logs e diagnosticos
- Otimizar queries Prisma
- Adicionar testes

### O Que NAO Pode Fazer

- Mudar framework/adapter sem planejamento (ex: trocar Express por Fastify)
- Alterar ordem de rotas em controllers NestJS sem entender o impacto
- Mudar de qual tabela ler os dados
- Alterar logica de negocio fundamental ao "otimizar"

---

## ERRO 1: Ordem de Rotas no NestJS - Rota Parametrizada Captura Rotas Especificas

### O Que Aconteceu

```typescript
// ERRADO - :id captura "upcoming", "by-status", etc.
@Controller('audits')
export class AuditController {
  @Get(':id')        // Linha 10 - captura TUDO
  findOne() {}

  @Get('upcoming')   // Linha 20 - NUNCA executada
  getUpcoming() {}
}
// Erro: "invalid input syntax for type uuid: upcoming"
```

### Por Que Aconteceu

NestJS avalia rotas na ordem de declaracao no controller. `@Get(':id')` e um "catch-all" que consome qualquer path segment, incluindo palavras como `upcoming`, `by-status`, `stats/summary`.

### Solucao

```typescript
// CORRETO - Rotas especificas ANTES das parametrizadas
@Controller('audits')
export class AuditController {
  @Post()                    // 1. Criacao
  @Get()                     // 2. Listagem
  @Get('upcoming')           // 3. Rotas especificas (sem params)
  @Get('by-status')          // 4. Mais rotas especificas
  @Get('stats/summary')      // 5. Sub-rotas
  @Patch(':id/action')       // 6. Acoes em recursos
  @Patch(':id')              // 7. Update
  @Delete(':id')             // 8. Delete
  @Get(':id')                // 9. SEMPRE POR ULTIMO
}
```

### Controllers Afetados

- AuditController: `/upcoming`, `/by-status`, `/stats/summary`
- CompanyController: `/search/query`, `/stats/summary`
- RequestController: `/company/:companyId`, `/protocol/:protocol`
- ContractController: `/process/:processId`
- ProposalController: `/process/:processId`, `/pricing-tables/*`

### Regra de Ouro

1. **SEMPRE** declare `@Get(':id')` como ULTIMA rota no controller
2. **REVISE** a ordem de rotas ao adicionar novos endpoints
3. **TESTE** endpoints especificos apos qualquer mudanca no controller

### Referencia

- `CHANGELOG/CORRECAO-ORDEM-ROTAS-NESTJS-2026-01-20.md`

---

## ERRO 2: Dependency Injection - Servico Nao Encontrado no Modulo

### O Que Aconteceu

```
Nest can't resolve dependencies of ComercialController (ComercialService, ?).
Please make sure that the argument PricingTableService at index [1]
is available in the ComercialModule context.
```

### Por Que Aconteceu

NestJS exige registro explicito de dependencias. Se `ModuloA` precisa de um servico de `ModuloB`, o `ModuloB` deve **exportar** o servico E o `ModuloA` deve **importar** o `ModuloB`.

### Solucao

```typescript
// Modulo que FORNECE o servico
@Module({
  providers: [PricingTableService],
  exports: [PricingTableService],  // NAO ESQUECA o exports!
})
export class PricingTableModule {}

// Modulo que CONSOME o servico
@Module({
  imports: [PricingTableModule],  // Importar o modulo
  controllers: [ComercialController],
  providers: [ComercialService],
})
export class ComercialModule {}
```

### Regra de Ouro

1. **SEMPRE** adicione ao `exports` se o servico sera usado por outros modulos
2. **IMPORTE** o modulo inteiro, nao apenas o servico
3. **VERIFIQUE** a arvore de dependencias antes de adicionar novos imports

### Referencia

- `TROUBLESHOOTING/DEPENDENCY-INJECTION-ERRORS.md`

---

## ERRO 3: HTTP Client Errado no Frontend - 401 em Endpoints Apos Login

### O Que Aconteceu

```typescript
// ERRADO - axios direto NAO tem interceptor de autenticacao
import axios from 'axios';
const response = await axios.get(`${API_URL}/proposals/...`);
// Retorna 401 mesmo com usuario logado
```

### Por Que Aconteceu

O `proposal.service.ts` importava `axios` diretamente ao inves da instancia centralizada `api` que tem o interceptor de Bearer token. O login funcionava, dashboard carregava, mas endpoints especificos falhavam com 401.

### Solucao

```typescript
// CORRETO - instancia centralizada com interceptors
import { api } from '../lib/api';
const response = await api.get('/proposals/...');
// Interceptor adiciona automaticamente: Authorization: Bearer <token>
```

### O Que a Instancia `api` Faz (lib/api.ts)

- Adiciona Bearer token automaticamente a cada request
- Faz refresh automatico do token em caso de 401
- Enfileira requests durante o refresh (evita race condition)
- Redireciona para `/login` se refresh falhar
- Define `baseURL` centralizado

### Regra de Ouro

1. **NUNCA** importe `axios` diretamente em services - use `import { api } from '../lib/api'`
2. **REVISE** imports ao criar novos services
3. **GREP** por `import axios from 'axios'` periodicamente para detectar violacoes

### Referencia

- `TROUBLESHOOTING/FIX-PROPOSAL-SERVICE-401.md`

---

## ERRO 4: Race Condition no Upload de Documentos

### O Que Aconteceu

```
POST /documents/upload → 404 "Request not found"
// Upload tentava referenciar request que ainda nao existia no banco
```

### Por Que Aconteceu

Uploads simultaneos criavam race condition: o primeiro upload tentava encontrar o request antes que a criacao do request fosse commitada no banco. Solucao inicial de retry loop (10 tentativas) era fragil.

### Solucao

```typescript
// CORRETO - FK direto ao inves de busca + retry
// Backend: Adicionou request_id como FK direta na tabela documents
// Frontend: Retry com exponential backoff como fallback
async uploadDocument(file, requestId, type, retries = 5, delayMs = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await api.post('/documents/upload', formData);
    } catch (error) {
      if (isRequestNotFoundError && attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * attempt));
        continue;
      }
      break;
    }
  }
}
```

### Regra de Ouro

1. **USE** constraints de banco (FK) ao inves de logica de retry
2. **SE** retry for necessario, use exponential backoff
3. **NUNCA** confie que registros relacionados existem em operacoes concorrentes

### Referencia

- `CHANGELOG/SOLUCAO-DEFINITIVA-UPLOAD-REQUEST-ID-2026-01-19.md`
- `GUIDES/TROUBLESHOOTING-DOCUMENT-UPLOAD.md`

---

## ERRO 5: Email Verification Bloqueando Login em Dev

### O Que Aconteceu

```
"Email nao verificado. Verifique sua caixa de entrada para ativar sua conta."
// Usuarios criados manualmente nao conseguiam logar
```

### Por Que Aconteceu

SMTP nao configurado em ambiente de desenvolvimento. Emails de verificacao nunca eram enviados. Usuarios criados manualmente ficavam com `emailVerified: false` por padrao.

### Solucao

```bash
# .env (desenvolvimento)
REQUIRE_EMAIL_VERIFICATION=false

# Scripts de manutencao criados:
# verify-users.ts - marca todos usuarios como verificados
# reset-login-attempts.ts - reseta tentativas de login bloqueadas
```

### Regra de Ouro

1. **CONFIGURE** `REQUIRE_EMAIL_VERIFICATION=false` em dev/staging
2. **MANTENHA** scripts de manutencao para cenarios comuns
3. **DOCUMENTE** configuracoes environment-specific no `.env.example`

### Referencia

- `TROUBLESHOOTING/EMAIL-VERIFICATION-ISSUE.md`

---

## ERRO 6: Arrays Undefined Causando Crash no Frontend

### O Que Aconteceu

```typescript
// ERRADO - filter em array que pode ser undefined
const filtered = contracts.filter(c => c.status === 'active');
// TypeError: Cannot read properties of undefined (reading 'filter')
```

### Por Que Aconteceu

APIs podem retornar `null`, `undefined` ou estrutura diferente do esperado. Componentes React quebravam ao tentar operar em dados que ainda nao carregaram ou que vieram com formato inesperado.

### Solucao

```typescript
// CORRETO - defensive check antes de operacoes em arrays
const filtered = Array.isArray(contracts) ? contracts.filter(c => c.status === 'active') : [];
// OU
const filtered = (contracts ?? []).filter(c => c.status === 'active');
```

### Regra de Ouro

1. **SEMPRE** verifique se o array existe antes de `.filter()`, `.map()`, `.reduce()`
2. **USE** `Array.isArray()` ou optional chaining `?.`
3. **DEFINA** valores default nos hooks: `const { data = [] } = useQuery(...)`

### Referencia

- Commits `0ab04d2d`, `97e1b9b7` (defensive array checks)

---

## ERRO 7: AWS API Gateway - Path Parameters Incompativeis

### O Que Aconteceu

```typescript
// ERRADO - path nao compativel com API Gateway
await api.post(`/invites/${token}/accept`);
// API Gateway nao roteava corretamente
```

### Por Que Aconteceu

AWS API Gateway tem limitacoes com parametros no meio do path. O padrao `/resource/{param}/action` pode nao funcionar como esperado dependendo da configuracao.

### Solucao

```typescript
// CORRETO - parametro no final do path
await api.post(`/invites/accept/${token}`);
```

### Regra de Ouro

1. **PREFIRA** parametros no final do path: `/resource/action/{param}`
2. **TESTE** endpoints via API Gateway apos deploy, nao apenas localmente
3. **DOCUMENTE** restricoes de roteamento do API Gateway

### Referencia

- Commit `297f7ef0` (update invite accept endpoint path)

---

## ERRO 8: Credenciais AWS Hardcoded no Codigo

### O Que Aconteceu

```typescript
// ERRADO - credenciais diretas no .env ou no codigo
AWS_ACCESS_KEY_ID=AKIAXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxx
```

### Por Que Aconteceu

Abordagem inicial usava credenciais estaticas para acesso ao S3 e outros servicos AWS. Funciona localmente mas e um risco de seguranca em producao.

### Solucao

```typescript
// CORRETO - IAM Task Role (ECS Fargate)
// Nenhuma credencial no codigo ou .env
// ECS Task Role assume permissoes automaticamente
// AWS SDK detecta credenciais via metadata service

// Para desenvolvimento local:
// Configurar AWS CLI profile ou usar variavel AWS_PROFILE
```

### Regra de Ouro

1. **NUNCA** commite credenciais AWS no repositorio
2. **USE** IAM Roles para ECS/Lambda/EC2
3. **USE** AWS Secrets Manager para dados sensiveis (DB connection, JWT keys)
4. **USE** SSM Parameter Store para configuracoes nao-sensiveis

### Referencia

- Commit `9ba2e1c1` (S3 config simplification)

---

## ERRO 9: Migracao NestJS - Modulos Duplicados por Falta de Analise do Schema

### O Que Aconteceu

```
Planejamento inicial: AuditScheduleModule separado de AuditModule
Resultado: 500 linhas de codigo duplicado
```

### Por Que Aconteceu

O planejamento da migracao foi feito sem analisar o schema Prisma primeiro. Ao implementar, descobriu-se que `AuditSchedule` e `Audit` compartilham a mesma tabela e relacoes.

### Solucao

Consolidar em um unico `AuditModule` com toda a funcionalidade de agendamento integrada.

### Regra de Ouro

1. **ANALISE** o schema Prisma ANTES de planejar novos modulos
2. **VERIFIQUE** se ja existe modulo que cobre a funcionalidade
3. **PREFIRA** consolidar ao inves de criar modulos separados para entidades relacionadas

### Referencia

- `IMPLEMENTATION-HISTORY/MIGRATION-NESTJS-STATISTICAL-ANALYSIS.md`

---

## ERRO 10: JWT - Migracao HS256 para RS256 sem Backward Compatibility

### O Que Aconteceu

Ao migrar de HS256 (simetrico) para RS256 (assimetrico), tokens existentes dos usuarios logados ficaram invalidos.

### Solucao Implementada

```typescript
// jwt.service.ts - Deteccao automatica do algoritmo
if (publicKey && privateKey) {
  return { algorithm: 'RS256', publicKey, privateKey };
}
if (secret) {
  return { algorithm: 'HS256', secret };  // Fallback
}

// jwt.strategy.ts - Aceita ambos algoritmos
secretOrKey: publicKey || secret,
algorithms: publicKey ? ['RS256'] : ['HS256'],
```

### Regra de Ouro

1. **MANTENHA** backward compatibility durante migracoes de autenticacao
2. **IMPLEMENTE** fallback para o algoritmo anterior
3. **PLANEJE** periodo de transicao onde ambos algoritmos sao aceitos
4. **TESTE** com tokens existentes antes de deploy

### Referencia

- `src/auth/jwt/jwt.service.ts`
- `src/auth/strategies/jwt.strategy.ts`

---

## ERRO 11: Documentacao Desatualizada Gerando Decisoes Erradas

### O Que Aconteceu

Documentacao no repo docs ainda referencia Fastify como stack do backend e roadmap planeja migracao NestJS como futuro, quando na realidade a migracao ja foi 100% concluida e o sistema roda em producao com NestJS + Express.

### Impacto

- Novos desenvolvedores recebem informacao errada sobre a stack
- Decisoes de arquitetura baseadas em premissas falsas
- Tempo perdido investigando "problemas" que nao existem

### Regra de Ouro

1. **SEMPRE** valide informacoes contra o codigo real dos repos, nao contra docs
2. **ATUALIZE** documentacao imediatamente apos migracoes significativas
3. **MARQUE** documentos obsoletos com aviso claro no topo
4. **PREFIRA** docs gerados automaticamente (Swagger, typedoc) a docs manuais

---

## Padroes Corretos - Codigo que Funciona

### Padrao 1: Modulo NestJS Completo

```typescript
// feature.module.ts
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService],       // Se usado por outros modulos
})
export class FeatureModule {}
```

### Padrao 2: Controller com Rotas na Ordem Correta

```typescript
@Controller('resource')
export class ResourceController {
  @Post()           create() {}      // 1. Criacao
  @Get()            findAll() {}     // 2. Listagem
  @Get('stats')     getStats() {}    // 3. Especificas
  @Patch(':id')     update() {}      // 4. Update
  @Delete(':id')    remove() {}      // 5. Delete
  @Get(':id')       findOne() {}     // 6. ULTIMO
}
```

### Padrao 3: Service Frontend com api Centralizado

```typescript
import { api } from '../lib/api';

export const featureService = {
  getAll: async () => {
    const response = await api.get('/features');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/features/${id}`);
    return response.data;
  },
};
```

### Padrao 4: Tratamento de Erros NestJS

```typescript
async findOne(id: string) {
  const resource = await this.prisma.resource.findUnique({ where: { id } });
  if (!resource) {
    throw new NotFoundException(`Resource ${id} nao encontrado`);
  }
  return resource;
}
```

### Padrao 5: React Query com Default Seguro

```typescript
const { data: items = [], isLoading } = useQuery({
  queryKey: ['items'],
  queryFn: () => featureService.getAll(),
});
// items sempre sera array, nunca undefined
```

---

## Checklist - Antes de Modificar Codigo

### Ao Criar Novo Endpoint NestJS

- [ ] Rota especifica declarada ANTES de rotas com `:id`?
- [ ] Servico registrado no `providers` do modulo?
- [ ] Servico exportado no `exports` se usado por outro modulo?
- [ ] Guards de autenticacao e roles aplicados?
- [ ] Decorators Swagger adicionados?
- [ ] DTO com class-validator para request body?

### Ao Criar Novo Service Frontend

- [ ] Usando `import { api } from '../lib/api'` (NAO `import axios`)?
- [ ] Tratamento de erro com try/catch?
- [ ] TypeScript types definidos para request e response?

### Ao Fazer Deploy

- [ ] `git status` - nao ha alteracoes uncommitted indesejadas?
- [ ] `git log origin/main..main` - sei quais commits vao subir?
- [ ] Prisma migrations pendentes aplicadas no banco?
- [ ] Variaveis de ambiente configuradas no ambiente alvo?
- [ ] Build local passou sem erros?
- [ ] Testei endpoints criticos apos deploy?

### Ao Modificar Autenticacao

- [ ] Backward compatibility mantida?
- [ ] Tokens existentes continuam funcionando?
- [ ] Refresh token flow testado?
- [ ] Logout limpa todos os dados locais?

### Ao Trabalhar com Arrays no Frontend

- [ ] Defensive check antes de `.filter()`, `.map()`, `.reduce()`?
- [ ] Default value no useQuery: `data = []`?
- [ ] Loading state tratado antes de renderizar lista?

---

## Resumo - Evite Estes Erros

| Erro | Como Evitar |
|------|-------------|
| Rota `:id` captura rotas especificas | Declare `@Get(':id')` como ULTIMA rota |
| Service nao encontrado no NestJS | Adicione ao `exports` do modulo fonte |
| 401 no frontend apos login | Use `api` centralizado, nao `axios` direto |
| Race condition em upload | Use FK no banco + retry como fallback |
| Email verification bloqueia dev | `REQUIRE_EMAIL_VERIFICATION=false` em dev |
| Array undefined crash | Defensive checks: `data ?? []` ou `Array.isArray()` |
| API Gateway path incompativel | Parametros no final: `/action/{param}` |
| Credenciais AWS hardcoded | Use IAM Roles + Secrets Manager |
| Modulos duplicados | Analise schema Prisma ANTES de criar modulos |
| JWT migration quebra tokens | Mantenha fallback para algoritmo anterior |
| Docs desatualizados | Valide contra codigo real, nao docs |

---

## TODOs Conhecidos no Codigo (Fev 2026)

### Backend

| Arquivo | TODO | Prioridade |
|---------|------|------------|
| `scheduler/certification-scheduler.service.ts` | Integrar com servico de notificacoes | Media |
| `proposal/proposal.controller.ts` | Tracking completo de ProposalResponse | Baixa |
| `e-signature-config/e-signature-config.service.ts` | Teste real de credenciais por provider | Media |
| `storage-config/storage-config.service.ts` | Teste real de conexao com storage | Media |
| `auditor-allocation/auditor-allocation.service.ts` | User ID real no audit trail (nao 'system') | Alta |
| `contract/contract.service.ts` | User ID real no audit trail | Alta |

### Frontend

| Arquivo | TODO | Prioridade |
|---------|------|------------|
| `components/audits/AuditExecution.tsx` | Integracao backend (save, evidencias, observacoes) | Alta |
| `pages/Certificate.tsx` | Download PDF do certificado | Media |
| `hooks/useCurrentUser.ts` | Integrar com API (usa mock quando API indisponivel) | Baixa |
| `components/wizard/TaxIdInput.tsx` | Validacao de Tax ID via API | Baixa |
| `pages/manager/UserManagement.tsx` | Modal de edicao e criacao de usuario | Media |

---

**IMPORTANTE**: Este documento deve ser consultado SEMPRE que for iniciar trabalho no projeto. Erros basicos causam retrabalho e frustracao.

---

**Data de Criacao:** 10/02/2026
**Ultima Atualizacao:** 10/02/2026
**Versao:** 1.0
