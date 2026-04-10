# ÉPICO 12: Revisão Completa do Processo de Onboarding

**ID**: EPIC-12
**Título**: Revisão e Correção do Sistema de Onboarding
**Status**: 🔴 Não Iniciado
**Prioridade**: P0 - Must Have
**Estimativa**: 34 Story Points (~4-5 dias)
**Responsável**: DEV Parceiro (Revisão)
**Data de Criação**: 09/03/2026
**Última Atualização**: 09/03/2026

---

## 📋 Sumário Executivo

### Objetivo
Realizar revisão completa do processo de onboarding existente, identificando e corrigindo bugs, falhas de segurança, problemas de UX e inconsistências entre frontend e backend.

### Contexto
O onboarding atual possui **4 fluxos** implementados e em produção:
1. **Primeiro Acesso** (admin cria usuário → email → senha + telefone → OTP)
2. **Convite** (empresa convida membro → aceita convite → cria conta)
3. **Solicitação de Acesso** (usuário sem empresa → busca por CNPJ → admin aprova)
4. **Cadastro de Empresa** (usuário sem empresa → registra nova empresa)

### Problemas Conhecidos
- Serviço frontend usa `axios` direto em vez de `api` centralizada (causa 401 em produção)
- OTP gerado com `Math.random()` (não criptograficamente seguro)
- Sem rate limiting em geração/verificação de OTP
- Tokens de convite armazenados em texto plano no banco
- Validação de telefone apenas remove não-dígitos (sem validação de formato por país)
- OTP expiry hardcoded (10 min)

### Escopo da Revisão
- **Backend**: 3 módulos (onboarding, user-invite, access-request)
- **Frontend**: 6 páginas + 3 serviços
- **API Gateway**: Configuração de rotas de onboarding
- **Testes**: Unitários e E2E existentes

---

## 🏗️ Arquitetura Atual

### Endpoints em Produção

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/onboarding/{id}` | Validar token de onboarding |
| `PUT` | `/onboarding/{id}` | Definir senha + telefone + disparar OTP |
| `POST` | `/onboarding/otp/verify` | Verificar OTP e concluir onboarding |
| `POST` | `/onboarding/otp/resend` | Reenviar OTP |
| `POST` | `/invites` | Criar convite para empresa |
| `GET` | `/invites/validate/:token` | Validar token de convite |
| `POST` | `/invites/:token/accept` | Aceitar convite |
| `POST` | `/access-requests` | Solicitar acesso a empresa |
| `GET` | `/access-requests` | Listar solicitações (admin empresa) |
| `POST` | `/access-requests/:id/respond` | Aprovar/rejeitar solicitação |

### Arquivos-Chave

**Backend** (`halalsphere-backend`):
- `src/onboarding/onboarding.controller.ts` - 4 endpoints
- `src/onboarding/onboarding.service.ts` - Lógica de negócio
- `src/onboarding/dto/complete-onboarding.dto.ts` - Validação
- `src/user-invite/user-invite.service.ts` - Fluxo de convites
- `src/user-invite/user-invite.controller.ts` - Endpoints de convite
- `src/access-request/access-request.service.ts` - Solicitações de acesso
- `src/access-request/access-request.controller.ts` - Endpoints de acesso
- `scripts/generate-api-gateway.js` - Merge `/onboarding/{token}` + `/onboarding/{userId}` → `/onboarding/{id}`

**Frontend** (`halalsphere-frontend`):
- `src/pages/auth/OnboardingPage.tsx` - Passo 1: senha + telefone
- `src/pages/auth/OnboardingOtpPage.tsx` - Passo 2: OTP
- `src/pages/onboarding/CompanyLinkingPage.tsx` - Escolha de caminho
- `src/pages/onboarding/RegisterCompanyPage.tsx` - Cadastro de empresa
- `src/pages/onboarding/JoinCompanyPage.tsx` - Solicitação de acesso
- `src/pages/onboarding/AcceptInvitePage.tsx` - Aceitar convite
- `src/services/onboarding.service.ts` - ⚠️ USA AXIOS DIRETO
- `src/services/invite.service.ts` - Serviço de convites
- `src/services/access-request.service.ts` - ⚠️ USA AXIOS DIRETO

**Prisma** (`prisma/schema.prisma`):
- Campos de onboarding no model `User`
- Model `UserInvite`
- Model `AccessRequest`

### Fluxo 1: Primeiro Acesso (Onboarding por Email)

```
Admin cria usuário (POST /users)
  → User criado SEM senha (passwordHash = '')
  → Token gerado (32-byte hex, 7 dias validade)
  → Email enviado com link: /auth/onboarding?token={token}

Usuário clica no link
  → GET /onboarding/{token} valida token
  → Formulário: senha + telefone

Usuário submete formulário
  → PUT /onboarding/{userId} com { password, phone, countryCode, onboardingToken }
  → Backend: hash senha, normaliza telefone, gera OTP 6 dígitos, envia SMS

Usuário recebe OTP
  → POST /onboarding/otp/verify com { userId, otp }
  → Backend: valida, marca phoneVerified=true, onboardingCompleted=true
  → Limpa tokens, envia email de boas-vindas
  → Redireciona para /login
```

### Fluxo 2: Convite para Empresa

```
Admin da empresa cria convite (POST /invites)
  → Token gerado (32-byte hex, 7 dias)
  → Status: pending

Convidado acessa link /invite/{token}
  → GET /invites/validate/:token valida
  → Formulário: senha + nome + telefone (se novo usuário)

Convidado aceita (POST /invites/:token/accept)
  → Cria conta se necessário
  → Vincula à empresa
  → onboardingCompleted = true (sem OTP)
  → Retorna JWT tokens
```

### Fluxo 3: Solicitação de Acesso

```
Usuário logado sem empresa → auto-redirect para /onboarding
  → CompanyLinkingPage: 3 opções

Escolhe "Solicitar Acesso"
  → Busca empresa por CNPJ
  → POST /access-requests com { companyId, message }

Admin da empresa vê solicitação pendente
  → POST /access-requests/:id/respond com { approved: boolean }
  → Se aprovado: vincula user.companyId
```

### Fluxo 4: Cadastro de Empresa

```
Usuário logado sem empresa → CompanyLinkingPage
  → Escolhe "Cadastrar Nova Empresa"
  → RegisterCompanyPage (3 steps):
    Step 1: País + Documento fiscal
    Step 2: Dados da empresa (razão social, endereço)
    Step 3: Contato (telefone, website)
  → POST /companies
  → CompanyGroup auto-criado
```

---

## 🎯 User Stories

### US-074: Revisão do Serviço Frontend de Onboarding (Migração axios → api)
**Como** desenvolvedor revisor
**Quero** corrigir os serviços frontend que usam `axios` direto
**Para** garantir que autenticação, refresh token e interceptors funcionem em produção

**Contexto**:
O arquivo `src/services/onboarding.service.ts` importa `axios` diretamente em vez de usar `api` de `src/lib/api.ts`. O mesmo ocorre em `access-request.service.ts` e `invite.service.ts`. Isso causa falhas 401 em produção porque os interceptors de auth não são aplicados.

**Critérios de Aceitação**:
- [ ] Substituir `import axios from 'axios'` por `import { api } from '@/lib/api'` em:
  - `src/services/onboarding.service.ts`
  - `src/services/access-request.service.ts`
  - `src/services/invite.service.ts`
- [ ] Verificar que todas as chamadas usam `api.get()`, `api.post()`, `api.put()` em vez de `axios.get()`, etc.
- [ ] Verificar se os endpoints estão corretos (sem `/api` duplicado, baseURL já inclui)
- [ ] Remover qualquer configuração manual de headers de Authorization (o interceptor já faz)
- [ ] Testar cada endpoint em ambiente de staging/produção após migração
- [ ] Verificar que refresh token funciona quando access token expira durante onboarding

**Arquivos**:
- `halalsphere-frontend/src/services/onboarding.service.ts`
- `halalsphere-frontend/src/services/access-request.service.ts`
- `halalsphere-frontend/src/services/invite.service.ts`
- `halalsphere-frontend/src/lib/api.ts` (referência - não modificar)

**Story Points**: 3
**Prioridade**: P0 - Crítico (bug em produção)

---

### US-075: Revisão de Segurança do OTP
**Como** desenvolvedor revisor
**Quero** revisar e corrigir a geração e verificação de OTP
**Para** prevenir ataques de brute force e garantir segurança criptográfica

**Contexto**:
O OTP atual é gerado com `Math.random()`, que não é criptograficamente seguro. Além disso, não há rate limiting na verificação de OTP, permitindo brute force dos 6 dígitos (1 milhão de combinações).

**Critérios de Aceitação**:
- [ ] Substituir `Math.random()` por `crypto.randomInt()` para geração do OTP
- [ ] Implementar rate limiting na verificação de OTP:
  - Máximo 5 tentativas por userId em 10 minutos
  - Após 5 tentativas falhas, bloquear por 30 minutos
  - Retornar mensagem genérica (não revelar quantas tentativas restam)
- [ ] Implementar rate limiting no reenvio de OTP:
  - Máximo 3 reenvios por userId em 1 hora
- [ ] Validar que OTP é limpo do banco após verificação bem-sucedida (já implementado - confirmar)
- [ ] Validar que OTP é limpo do banco após expiração
- [ ] Considerar hash do OTP no banco em vez de texto plano (opcional mas recomendado)
- [ ] Adicionar logging de tentativas falhas de OTP (para auditoria)
- [ ] Revisar expiração de 10 minutos (é adequada?)

**Arquivos**:
- `halalsphere-backend/src/onboarding/onboarding.service.ts` (geração + verificação OTP)

**Story Points**: 5
**Prioridade**: P0 - Crítico (vulnerabilidade de segurança)

---

### US-076: Revisão de Segurança dos Tokens
**Como** desenvolvedor revisor
**Quero** revisar o armazenamento e validação de tokens de onboarding e convite
**Para** prevenir roubo de tokens e acesso não autorizado

**Critérios de Aceitação**:
- [ ] Revisar se tokens de onboarding (32-byte hex) são suficientemente entrópicos
- [ ] Avaliar se tokens devem ser hasheados no banco (SHA-256) em vez de texto plano
  - Se sim: hash ao salvar, hash ao buscar para comparação
  - Impacto: `GET /onboarding/{token}` precisa buscar por hash
- [ ] Revisar se tokens de convite (`UserInvite.token`) seguem mesmo padrão
- [ ] Validar que tokens são invalidados após uso (single-use)
- [ ] Validar que tokens expirados não podem ser usados
- [ ] Verificar se há limpeza periódica de tokens expirados no banco
- [ ] Revisar se token aparece em logs (não deve)
- [ ] Verificar se token é transmitido apenas via HTTPS (garantido pelo CloudFront)
- [ ] Validar CORS configuration para endpoints de onboarding

**Arquivos**:
- `halalsphere-backend/src/onboarding/onboarding.service.ts`
- `halalsphere-backend/src/user-invite/user-invite.service.ts`
- `halalsphere-backend/src/users/users.service.ts` (criação de token no create)

**Story Points**: 3
**Prioridade**: P1 - Alta

---

### US-077: Revisão do Fluxo de Primeiro Acesso (End-to-End)
**Como** desenvolvedor revisor
**Quero** testar o fluxo completo de primeiro acesso
**Para** garantir que funciona corretamente em todos os cenários

**Critérios de Aceitação**:
- [ ] **Cenário feliz**: Admin cria usuário → email chega → link funciona → senha + telefone → OTP → login
- [ ] **Token expirado**: Testar acesso com token de 8+ dias → mensagem clara de expiração
- [ ] **Token inválido**: Testar com token aleatório → mensagem clara de "link inválido"
- [ ] **Token já usado**: Testar acesso com token de usuário já onboarded → mensagem clara
- [ ] **Senha fraca**: Testar validações (min 8 chars, maiúscula, número, especial)
- [ ] **OTP incorreto**: Testar com código errado → mensagem de erro
- [ ] **OTP expirado**: Esperar 10+ min → mensagem de expiração → botão reenviar
- [ ] **Reenvio de OTP**: Verificar que novo código é gerado e antigo invalidado
- [ ] **Navegação**: Usuário pode voltar do OTP para a tela de senha?
- [ ] **Refresh de página**: SessionStorage mantém userId no passo do OTP?
- [ ] **Email de boas-vindas**: Chega após OTP verificado?
- [ ] **Múltiplos dispositivos**: Se abrir link em 2 navegadores, o que acontece?
- [ ] **Mobile**: Fluxo funciona em tela pequena?

**Arquivos**:
- `halalsphere-frontend/src/pages/auth/OnboardingPage.tsx`
- `halalsphere-frontend/src/pages/auth/OnboardingOtpPage.tsx`
- `halalsphere-backend/src/onboarding/onboarding.controller.ts`
- `halalsphere-backend/src/onboarding/onboarding.service.ts`

**Story Points**: 5
**Prioridade**: P0 - Crítico

---

### US-078: Revisão do Fluxo de Convites (End-to-End)
**Como** desenvolvedor revisor
**Quero** testar o fluxo completo de convites de empresa
**Para** garantir que funciona corretamente e é seguro

**Critérios de Aceitação**:
- [ ] **Cenário feliz**: Admin cria convite → link enviado → novo usuário aceita → conta criada → logado
- [ ] **Email já cadastrado**: Convite para email existente → mensagem clara
- [ ] **Convite duplicado**: Mesmo email + empresa → rejeitar ou reenviar?
- [ ] **Token expirado**: Link de convite após 7 dias → mensagem clara
- [ ] **Token inválido**: Link com token aleatório → mensagem clara
- [ ] **Usuário já logado**: Aceitar convite estando logado → vincular à empresa sem criar nova conta
- [ ] **Permissões**: Apenas admin da empresa pode criar convites?
- [ ] **Role do convidado**: Role definido no convite é respeitado na criação do usuário?
- [ ] **Cancelamento**: Admin pode cancelar convite pendente?
- [ ] **Listagem**: Admin vê lista de convites pendentes/aceitos/expirados?
- [ ] **Segurança**: Convite não pula etapa de OTP (confirmar se é intencional ou bug)
- [ ] **Sem empresa**: O que acontece se convidado aceitar mas empresa foi deletada?

**Arquivos**:
- `halalsphere-frontend/src/pages/onboarding/AcceptInvitePage.tsx`
- `halalsphere-backend/src/user-invite/user-invite.controller.ts`
- `halalsphere-backend/src/user-invite/user-invite.service.ts`

**Story Points**: 5
**Prioridade**: P1 - Alta

---

### US-079: Revisão do Fluxo de Solicitação de Acesso (End-to-End)
**Como** desenvolvedor revisor
**Quero** testar o fluxo de solicitação de acesso a empresa existente
**Para** garantir que funciona e não permite acesso indevido

**Critérios de Aceitação**:
- [ ] **Cenário feliz**: Usuário sem empresa → busca CNPJ → encontra empresa → solicita → admin aprova → vinculado
- [ ] **CNPJ não encontrado**: Mensagem clara sugerindo cadastrar nova empresa
- [ ] **Solicitação duplicada**: Mesma empresa → rejeitar ou mostrar status da existente?
- [ ] **Já pertence a empresa**: Usuário já vinculado a empresa → bloquear nova solicitação?
- [ ] **Admin rejeita**: Mensagem clara para o usuário → pode solicitar novamente?
- [ ] **Múltiplas solicitações**: Pode solicitar acesso a várias empresas simultaneamente?
- [ ] **Notificação**: Admin da empresa é notificado de nova solicitação? (email?)
- [ ] **Timeout**: Solicitação pendente por muito tempo → expira automaticamente?
- [ ] **Permissões**: Apenas admin da empresa vê e responde solicitações?
- [ ] **Dados do solicitante**: Admin vê informações suficientes para tomar decisão?

**Arquivos**:
- `halalsphere-frontend/src/pages/onboarding/JoinCompanyPage.tsx`
- `halalsphere-backend/src/access-request/access-request.controller.ts`
- `halalsphere-backend/src/access-request/access-request.service.ts`

**Story Points**: 3
**Prioridade**: P1 - Alta

---

### US-080: Revisão do Fluxo de Cadastro de Empresa (End-to-End)
**Como** desenvolvedor revisor
**Quero** testar o fluxo de cadastro de nova empresa durante onboarding
**Para** garantir integridade dos dados e funcionamento correto

**Critérios de Aceitação**:
- [ ] **Cenário feliz**: Usuário sem empresa → registra empresa → 3 steps → empresa criada → CompanyGroup auto-criado
- [ ] **CNPJ duplicado**: Empresa com mesmo CNPJ já existe → mensagem clara
- [ ] **CNPJ inválido**: Dígitos verificadores errados → validação em tempo real
- [ ] **CEP válido**: Auto-complete de endereço funciona? (Brasil)
- [ ] **CEP inválido**: Mensagem de erro clara
- [ ] **Campos obrigatórios**: Todos validados antes de avançar step
- [ ] **Navegação entre steps**: Pode voltar sem perder dados?
- [ ] **Países suportados**: Brasil, Colômbia, Paraguai → máscaras corretas
- [ ] **CompanyGroup**: Criado automaticamente com nome da empresa?
- [ ] **Planta**: SIF/número da planta é solicitado? É obrigatório?
- [ ] **Redirect**: Após cadastro, redireciona para dashboard correto?
- [ ] **Transação**: Se falha no meio, faz rollback completo?

**Arquivos**:
- `halalsphere-frontend/src/pages/onboarding/RegisterCompanyPage.tsx`
- `halalsphere-backend/src/companies/companies.service.ts`
- `halalsphere-backend/src/companies/companies.controller.ts`

**Story Points**: 3
**Prioridade**: P1 - Alta

---

### US-081: Revisão da CompanyLinkingPage (Roteamento Pós-Login)
**Como** desenvolvedor revisor
**Quero** revisar o comportamento de redirect para usuários sem empresa
**Para** garantir que nenhum usuário fica preso em loop ou sem caminho

**Critérios de Aceitação**:
- [ ] **Redirect automático**: Usuário `empresa` sem `companyId` é redirecionado para `/onboarding`
- [ ] **FAMBRAS staff**: Usuários admin/gestor/analista/auditor NÃO são redirecionados (não precisam de empresa)
- [ ] **3 opções visíveis**: "Cadastrar Empresa", "Tenho Código de Convite", "Solicitar Acesso"
- [ ] **Código de convite**: Input aceita token → redireciona para `/invite/{token}`
- [ ] **Loop prevention**: Se usuário volta ao dashboard sem empresa, redireciona novamente sem loop infinito
- [ ] **Deep link**: Se usuário acessa URL direta (ex: `/certifications`), redireciona para onboarding → após completar, volta para URL original?
- [ ] **Logout**: Botão de logout acessível durante onboarding
- [ ] **Responsividade**: Funciona em mobile

**Arquivos**:
- `halalsphere-frontend/src/pages/onboarding/CompanyLinkingPage.tsx`
- `halalsphere-frontend/src/routes/` (verificar guards de rota)

**Story Points**: 2
**Prioridade**: P1 - Alta

---

### US-082: Revisão de Validações e DTOs do Backend
**Como** desenvolvedor revisor
**Quero** revisar todas as validações de entrada nos endpoints de onboarding
**Para** prevenir dados inválidos e ataques de injeção

**Critérios de Aceitação**:
- [ ] **DTO de onboarding**: `complete-onboarding.dto.ts`
  - Senha validada (min 8 chars, maiúscula, número, especial)
  - Telefone validado (formato, tamanho)
  - CountryCode validado (códigos válidos)
  - OnboardingToken validado (formato hex, tamanho)
- [ ] **DTO de convite**: Validações de email, nome, role
- [ ] **DTO de acesso**: Validações de companyId, message
- [ ] **Sanitização**: Inputs são sanitizados contra XSS/SQL injection?
- [ ] **Validação de UUID**: IDs são validados como UUID válidos?
- [ ] **Mensagens de erro**: São genéricas o suficiente para não vazar informação?
  - Ex: "Usuário não encontrado" vs "Token inválido" (não revelar se o user existe)
- [ ] **Payload size**: Há limite de tamanho no body das requests?
- [ ] **Content-Type**: Endpoints aceitam apenas `application/json`?

**Arquivos**:
- `halalsphere-backend/src/onboarding/dto/`
- `halalsphere-backend/src/user-invite/dto/`
- `halalsphere-backend/src/access-request/dto/`

**Story Points**: 3
**Prioridade**: P1 - Alta

---

### US-083: Revisão dos Testes Existentes
**Como** desenvolvedor revisor
**Quero** revisar e complementar os testes unitários e E2E de onboarding
**Para** garantir cobertura adequada e confiabilidade

**Critérios de Aceitação**:
- [ ] **Executar testes existentes**: Todos passam? Algum flaky?
  - `npm test -- --testPathPattern=onboarding`
  - `npm test -- --testPathPattern=user-invite`
  - `npm test -- --testPathPattern=access-request`
- [ ] **Cobertura**: Verificar % de cobertura dos 3 módulos
- [ ] **Cenários faltantes**: Identificar edge cases não cobertos:
  - Token expirado
  - Usuário já completou onboarding
  - OTP expirado
  - Múltiplas tentativas de OTP
  - Race conditions (2 requests simultâneas)
  - Campos com caracteres especiais (unicode, emojis)
- [ ] **Mocks corretos**: Prisma, EmailService, SmsService mockados adequadamente?
- [ ] **Testes E2E**: Se existem, todos passam?
- [ ] **Adicionar testes** para cenários críticos não cobertos

**Arquivos**:
- `halalsphere-backend/src/onboarding/*.spec.ts`
- `halalsphere-backend/src/user-invite/*.spec.ts`
- `halalsphere-backend/src/access-request/*.spec.ts`
- `halalsphere-backend/test/` (E2E)

**Story Points**: 5
**Prioridade**: P1 - Alta

---

### US-084: Revisão da Configuração do API Gateway
**Como** desenvolvedor revisor
**Quero** verificar que as rotas de onboarding estão corretamente configuradas no API Gateway
**Para** prevenir erros de CORS e roteamento em produção

**Contexto**:
O API Gateway da AWS tem uma limitação que impede dois path params diferentes no mesmo nível. Por isso, `/onboarding/{token}` (GET) e `/onboarding/{userId}` (PUT) foram mergeados em `/onboarding/{id}`. O script `generate-api-gateway.js` faz essa conversão automaticamente, mas é um ponto frágil.

**Critérios de Aceitação**:
- [ ] **Verificar merge**: No JSON gerado, `/onboarding/{id}` existe com GET e PUT
- [ ] **Verificar ausência**: `/onboarding/{token}` e `/onboarding/{userId}` NÃO existem
- [ ] **RequestParameters**: Mapeamento correto `integration.request.path.id → method.request.path.id`
- [ ] **URI de integração**: Aponta para o backend correto nos 3 ambientes
- [ ] **CORS**: OPTIONS method presente em todas as rotas de onboarding
- [ ] **Rotas de convite**: `/invites`, `/invites/validate/{token}`, `/invites/{token}/accept` configuradas
- [ ] **Rotas de acesso**: `/access-requests`, `/access-requests/{id}/respond` configuradas
- [ ] **Regenerar e comparar**: Executar `node scripts/generate-api-gateway.js` e verificar diff
- [ ] **Validar script**: O merge logic (linhas ~82-133 do script) está correto?

**Arquivos**:
- `halalsphere-backend/scripts/generate-api-gateway.js`
- `halalsphere-backend/deploy/halalsphere-api.production.json`
- `halalsphere-backend/deploy/halalsphere-api.staging.json`
- `halalsphere-backend/deploy/halalsphere-api.development.json`

**Comando de verificação**:
```bash
node -e "const j = require('./deploy/halalsphere-api.production.json'); console.log(JSON.stringify(j.paths['/onboarding/{id}'], null, 2))"
```

**Story Points**: 2
**Prioridade**: P0 - Crítico

---

### US-085: Revisão de UX e Acessibilidade das Telas de Onboarding
**Como** desenvolvedor revisor
**Quero** revisar a experiência do usuário nas telas de onboarding
**Para** garantir usabilidade, acessibilidade e consistência visual

**Critérios de Aceitação**:
- [ ] **OnboardingPage** (senha + telefone):
  - Indicador de progresso visível (passo 1/2)
  - Requisitos de senha claros e atualizados em tempo real
  - Input de telefone com máscara internacional
  - Botão desabilitado enquanto formulário inválido
  - Loading state no submit
  - Mensagens de erro claras
- [ ] **OnboardingOtpPage** (OTP):
  - 6 inputs com auto-advance ao digitar
  - Suporte a paste do código completo
  - Contador regressivo antes de "Reenviar" (60s)
  - Mensagem clara de código expirado
  - Botão "Reenviar" funcional após countdown
- [ ] **CompanyLinkingPage** (escolha):
  - 3 opções claramente diferenciadas
  - Descrição de cada opção ajuda o usuário a escolher
  - Input de código de convite com validação
- [ ] **RegisterCompanyPage** (cadastro empresa):
  - Indicador de progresso (steps 1/2/3)
  - Auto-complete de CEP funcional
  - Máscaras de documento fiscal por país
  - Validação em tempo real
- [ ] **AcceptInvitePage** (convite):
  - Mostra nome da empresa e quem convidou
  - Formulário limpo e simples
- [ ] **Geral**:
  - Responsivo em mobile (testar 375px, 768px, 1024px)
  - Navegação por teclado (Tab, Enter)
  - Labels e aria-labels em inputs
  - Contraste de cores adequado
  - Feedback visual em todas as ações

**Story Points**: 3
**Prioridade**: P2 - Média

---

## 📊 Resumo

| US | Título | SP | Prioridade | Tipo |
|----|--------|-----|------------|------|
| US-074 | Migração axios → api | 3 | P0 | Bug Fix |
| US-075 | Segurança do OTP | 5 | P0 | Segurança |
| US-076 | Segurança dos Tokens | 3 | P1 | Segurança |
| US-077 | Fluxo Primeiro Acesso E2E | 5 | P0 | Teste |
| US-078 | Fluxo Convites E2E | 5 | P1 | Teste |
| US-079 | Fluxo Solicitação Acesso E2E | 3 | P1 | Teste |
| US-080 | Fluxo Cadastro Empresa E2E | 3 | P1 | Teste |
| US-081 | CompanyLinkingPage | 2 | P1 | Teste |
| US-082 | Validações e DTOs | 3 | P1 | Segurança |
| US-083 | Revisão de Testes | 5 | P1 | Teste |
| US-084 | API Gateway | 2 | P0 | Infra |
| US-085 | UX e Acessibilidade | 3 | P2 | UX |

**Total**: 12 User Stories | 42 Story Points

### Ordem de Execução Sugerida

1. **Fase 1 - Crítico** (P0 - Dias 1-2):
   - US-074: Migração axios → api (bug em produção)
   - US-075: Segurança do OTP
   - US-084: API Gateway
   - US-077: Fluxo Primeiro Acesso E2E

2. **Fase 2 - Alta** (P1 - Dias 3-4):
   - US-076: Segurança dos Tokens
   - US-082: Validações e DTOs
   - US-078: Fluxo Convites E2E
   - US-079: Fluxo Solicitação Acesso E2E
   - US-080: Fluxo Cadastro Empresa E2E
   - US-081: CompanyLinkingPage

3. **Fase 3 - Complementar** (P1-P2 - Dia 5):
   - US-083: Revisão de Testes
   - US-085: UX e Acessibilidade

---

## 🔧 Setup para o DEV Revisor

### Pré-requisitos
- Node.js 20+
- PostgreSQL 16
- Redis 7+
- Git access aos 3 repos

### Ambiente Local
```bash
# Backend
cd halalsphere-backend
cp .env.example .env  # configurar DB, Redis, JWT
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend
cd halalsphere-frontend
cp .env.example .env  # configurar VITE_API_URL
npm install
npm run dev
```

### Credenciais de Teste (Seed)
- **Senha padrão**: `A123456!`
- **Admin**: admin@fambras.org.br
- **Empresa**: teste@empresa.com (vinculado à "Empresa Teste Halal LTDA")
- **Para testar onboarding**: Criar novo usuário via admin → usar link do email

### URLs de Produção
- **API**: gestaodecertificacoes-api.ecohalal.solutions
- **Web**: gestaodecertificacoes.ecohalal.solutions
- **Staging API**: staging-gestaodecertificacoes-api.ecohalal.solutions
- **Staging Web**: staging-gestaodecertificacoes.ecohalal.solutions

---

**Status**: 🔴 Não Iniciado
**Última Atualização**: 09/03/2026
**Owner**: DEV Parceiro
