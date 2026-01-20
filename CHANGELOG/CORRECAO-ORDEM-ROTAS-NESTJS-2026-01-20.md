# Correção: Ordem das Rotas nos Controllers NestJS

**Data:** 2026-01-20
**Problema:** Rotas específicas sendo interpretadas como UUIDs
**Status:** Resolvido

## Problema

O frontend estava recebendo erros 500 ao acessar rotas como `/audits/upcoming`, `/audits/by-status`, etc. O backend NestJS interpretava strings como `"upcoming"` e `"by-status"` como se fossem parâmetros UUID para a rota `GET /audits/:id`.

### Erro típico:
```
Invalid input value: invalid input syntax for type uuid: "upcoming"
```

## Causa Raiz

No NestJS, a **ordem de declaração das rotas importa**. Rotas com parâmetros dinâmicos (`:id`) estavam sendo definidas **antes** de rotas específicas, fazendo com que o NestJS fizesse match com a rota parametrizada primeiro.

### Exemplo do problema:
```typescript
// ERRADO - :id captura "upcoming" como parâmetro
@Get(':id')        // linha 210
async findById() {}

@Get('upcoming')   // linha 283 - nunca é alcançada!
async getUpcoming() {}
```

## Solução

Reorganizar todos os controllers para que rotas específicas venham **ANTES** das rotas parametrizadas.

### Padrão correto:
```typescript
// CORRETO - rotas específicas primeiro
@Get()                    // 1. Listar todos
async findAll() {}

@Get('stats/summary')     // 2. Rotas específicas
async getStats() {}

@Get('upcoming')          // 3. Mais rotas específicas
async getUpcoming() {}

@Get('process/:processId') // 4. Rotas com sub-parâmetros
async findByProcess() {}

@Get(':id')               // 5. ÚLTIMO - rota genérica com :id
async findById() {}
```

## Controllers Corrigidos

| Controller | Arquivo | Rotas Afetadas |
|------------|---------|----------------|
| **AuditController** | `src/audit/audit.controller.ts` | `/upcoming`, `/by-status`, `/stats/summary`, `/process/:processId` |
| **CompanyController** | `src/company/company.controller.ts` | `/search/query`, `/stats/summary`, `/cnpj/:cnpj` |
| **RequestController** | `src/request/request.controller.ts` | `/company/:companyId`, `/protocol/:protocol`, `/stats/summary` |
| **ContractController** | `src/contract/contract.controller.ts` | `/process/:processId`, `/stats/summary` |
| **ProposalController** | `src/proposal/proposal.controller.ts` | `/process/:processId`, `/stats/summary`, `/pricing-tables/*` |

## Alterações Realizadas

### 1. AuditController
- Movido `@Get('upcoming')` para antes de `@Get(':id')`
- Movido `@Get('by-status')` para antes de `@Get(':id')`
- Movido `@Get('stats/summary')` para antes de `@Get(':id')`
- Movido `@Get('process/:processId')` para antes de `@Get(':id')`

### 2. CompanyController
- Movido `@Get()` para o início
- Movido `@Get('search/query')` para antes de `@Get(':id')`
- Movido `@Get('stats/summary')` para antes de `@Get(':id')`
- `@Get(':id')` agora é a última rota GET

### 3. RequestController
- Movido `@Get()` para o início
- Movido `@Get('company/:companyId')` para antes de `@Get(':id')`
- Movido `@Get('protocol/:protocol')` para antes de `@Get(':id')`
- Movido `@Get('stats/summary')` para antes de `@Get(':id')`
- `@Get(':id')` agora é a última rota GET

### 4. ContractController
- Movido `@Get()` para o início
- Movido `@Get('stats/summary')` para antes de `@Get(':id')`
- Movido `@Get('process/:processId')` para antes de `@Get(':id')`
- `@Get(':id')` agora é a última rota GET

### 5. ProposalController
- Reorganizado completamente
- Rotas de pricing-tables também corrigidas
- `@Get(':id')` agora é a última rota GET de proposals
- `@Get('pricing-tables/:id')` agora é a última rota GET de pricing-tables

## Comentários Adicionados

Cada controller agora possui comentários explicativos:

```typescript
// ========== QUERY ENDPOINTS ==========
// IMPORTANT: Specific routes MUST come BEFORE parameterized routes (:id)
// Otherwise NestJS will match "upcoming", "by-status", etc. as :id

// ...

// ========== PARAMETERIZED ROUTES (must be LAST) ==========

/**
 * GET /audits/:id - Get audit by ID
 * IMPORTANT: This route MUST be LAST among GET routes to avoid matching
 * "upcoming", "by-status", "stats" as :id parameter
 */
@Get(':id')
```

## Regra para Futuros Desenvolvimentos

**SEMPRE** seguir esta ordem ao adicionar rotas em controllers NestJS:

1. `POST /resource` - Criar
2. `GET /resource` - Listar todos
3. `GET /resource/specific-route` - Rotas específicas sem parâmetros
4. `GET /resource/stats/summary` - Estatísticas
5. `GET /resource/sub/:param` - Rotas com sub-parâmetros específicos
6. `PATCH /resource/:id/action` - Ações em recursos específicos
7. `PATCH /resource/:id` - Atualizar
8. `DELETE /resource/:id` - Deletar
9. `GET /resource/:id` - **SEMPRE POR ÚLTIMO** entre os GETs

## Verificação

Após as correções, reiniciar o servidor NestJS e testar:
- Dashboard do auditor (`/auditor`)
- Rotas de audits, companies, requests, contracts, proposals
- Todas as rotas de statistics (`/stats/summary`)
