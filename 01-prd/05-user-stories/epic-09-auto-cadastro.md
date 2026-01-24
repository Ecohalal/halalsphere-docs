# ÉPICO 9: Auto Cadastro de Clientes

**ID**: EPIC-09
**Título**: Sistema de Auto Cadastro para Novos Clientes
**Status de Implementação**: 🔴 0% - Não Iniciado (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026 (sem auto-cadastro)
**Prioridade**: P1 - Should Have (Pós-MVP)
**Estimativa**: 34 Story Points (~4-5 dias)
**Responsável**: Development Team
**Data de Criação**: 17/12/2025
**Última Atualização**: 24/01/2026

#### 📊 Resumo de Implementação

**🔴 Não Iniciado (6/6 User Stories)**:
- US-068: Registro Inicial de Conta
- US-069: Cadastro de Dados da Empresa
- US-070: Verificação de Email
- US-071: Prevenção de Duplicação
- US-072: Wizard de Registro Multi-Step
- US-073: Integração com Fluxo de Certificação

**Nota**: No MVP atual, empresas são cadastradas manualmente por administradores. O auto-cadastro será implementado na próxima fase para permitir onboarding self-service.

---

## 📋 Sumário Executivo

### Objetivo
Permitir que novos clientes se cadastrem autonomamente através do site da empresa, iniciando o processo de solicitação de certificação Halal sem necessidade de intervenção manual da equipe comercial.

### Problema
Atualmente, não existe um sistema de registro público. Novos clientes precisam entrar em contato com a equipe comercial para ter uma conta criada manualmente, causando:
- Atraso no início do processo
- Sobrecarga da equipe comercial
- Perda de leads (clientes desistem antes de começar)
- Falta de rastreamento do funil de conversão

### Solução
Implementar um sistema completo de auto cadastro com:
- Formulário público de registro
- Validação automática de documentos fiscais
- Verificação de email obrigatória
- Prevenção de duplicação de contas e empresas
- Integração com fluxo existente de solicitação de certificação

### Valor de Negócio
- ⚡ **Conversão 24/7**: Clientes podem se cadastrar a qualquer momento
- 📈 **Aumento de Leads**: Redução de fricção no início do funil
- ⏱️ **Redução de Tempo**: De dias para minutos no onboarding
- 💰 **Redução de Custo**: Menos trabalho manual da equipe
- 📊 **Métricas**: Rastreamento completo do funil de conversão

---

## 🎯 User Stories

### US-068: Registro Inicial de Conta
**Como** um potencial cliente
**Quero** me cadastrar autonomamente no sistema
**Para** iniciar o processo de certificação sem precisar de contato prévio

**Critérios de Aceitação**:
- [ ] Formulário público acessível via `/register`
- [ ] Campos obrigatórios validados:
  - Email (único, formato válido)
  - Senha (mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial)
  - Nome completo do responsável
  - Telefone (com máscara)
- [ ] Validação em tempo real (não apenas no submit)
- [ ] Indicador de força de senha
- [ ] Botão desabilitado enquanto houver erros
- [ ] Mensagens de erro claras e localizadas
- [ ] reCAPTCHA v3 para prevenir bots
- [ ] Rate limiting (3 tentativas/hora por IP)

**Story Points**: 5
**Prioridade**: P0 - Must Have

---

### US-069: Cadastro de Dados da Empresa
**Como** um novo usuário em processo de registro
**Quero** informar os dados da minha empresa
**Para** que o sistema possa validar e prevenir duplicação

**Critérios de Aceitação**:
- [ ] Seleção de país de operação (Brasil, Colômbia, Paraguai)
- [ ] Tipo de documento fiscal auto-detectado por país:
  - Brasil: CNPJ ou CPF
  - Colômbia: NIT ou RUT
  - Paraguai: RUC ou CI
- [ ] Input com máscara dinâmica baseada no tipo de documento
- [ ] Validação em tempo real do formato do documento
- [ ] Verificação de dígitos verificadores
- [ ] API endpoint para verificar disponibilidade (debounced)
- [ ] Mensagem clara se empresa já cadastrada
- [ ] Campos: Razão Social, Nome Fantasia (opcional)
- [ ] Validação de unicidade: `country + taxId` único

**Story Points**: 8
**Prioridade**: P0 - Must Have

---

### US-070: Verificação de Email
**Como** o sistema
**Quero** verificar que o email do usuário é válido
**Para** garantir que posso me comunicar com ele e prevenir spam

**Critérios de Aceitação**:
- [ ] Após registro, enviar email de verificação automaticamente
- [ ] Email contém link único com token (válido por 24h)
- [ ] Template profissional de email com branding
- [ ] Página de verificação: `/auth/verify-email?token=xxx`
- [ ] Validação do token:
  - Token existe
  - Não expirado
  - Não já utilizado
- [ ] Após verificação:
  - Marcar `emailVerified = true`
  - Marcar `activatedAt = now()`
  - Redirecionar para login com mensagem de sucesso
- [ ] Usuários não verificados não podem fazer login
- [ ] Opção de reenviar email de verificação
- [ ] Link de verificação funciona apenas uma vez

**Story Points**: 5
**Prioridade**: P0 - Must Have

---

### US-071: Prevenção de Duplicação
**Como** o sistema
**Quero** prevenir cadastros duplicados
**Para** manter a integridade dos dados e evitar confusão

**Critérios de Aceitação**:
- [ ] Validação no backend de email único
- [ ] Validação no backend de `country + taxId` único
- [ ] Constraints no banco de dados (já existem)
- [ ] Mensagens de erro específicas por tipo de duplicação:
  - Email duplicado: Sugerir login ou recuperação de senha
  - Empresa duplicada: Sugerir login ou contato com suporte
  - Solicitação em andamento: Mostrar protocolo e status
- [ ] Verificação em tempo real (debounced) no frontend
- [ ] Indicador visual de disponibilidade (✓ ou ✗)
- [ ] Tratamento de race conditions no backend
- [ ] Log de tentativas de duplicação (segurança)

**Story Points**: 5
**Prioridade**: P0 - Must Have

---

### US-072: Wizard de Registro Multi-Step
**Como** um novo usuário
**Quero** um processo guiado de registro
**Para** não me sentir perdido e fornecer todas as informações necessárias

**Critérios de Aceitação**:
- [ ] Interface dividida em 4 steps:
  - **Step 1**: Dados do Responsável (nome, email, telefone, senha)
  - **Step 2**: Dados da Empresa (país, documento, razão social)
  - **Step 3**: Endereço e Contato (CEP, cidade, UF, telefone empresa)
  - **Step 4**: Confirmação (revisão, termos de uso, botão criar conta)
- [ ] Indicador visual de progresso (1/4, 2/4, 3/4, 4/4)
- [ ] Navegação entre steps:
  - Próximo: Validar step atual antes de avançar
  - Anterior: Permitir voltar sem perder dados
- [ ] Dados salvos localmente (localStorage) para recuperação
- [ ] Auto-complete de endereço via CEP (Brasil)
- [ ] Design responsivo (mobile-first)
- [ ] Loading states em todas as ações
- [ ] Mensagens de erro contextuais por campo

**Story Points**: 8
**Prioridade**: P0 - Must Have

---

### US-073: Integração com Fluxo de Certificação
**Como** um usuário recém-registrado e verificado
**Quero** iniciar minha solicitação de certificação
**Para** dar continuidade ao processo

**Critérios de Aceitação**:
- [ ] Após login de conta verificada, redirecionar para `/company/dashboard`
- [ ] Dashboard mostra estado "novo usuário":
  - Mensagem de boas-vindas personalizada
  - CTA destacado: "Iniciar Solicitação de Certificação"
  - Vídeo ou tutorial explicativo (opcional)
- [ ] Botão CTA redireciona para `/company/new-request` (wizard existente)
- [ ] Dados da empresa pré-preenchidos no wizard:
  - Razão Social
  - CNPJ/Documento Fiscal
  - País
  - Contato
- [ ] Tracking de conversão:
  - Registro → Verificação → Primeiro Login → Iniciou Solicitação → Enviou Solicitação
- [ ] Email de boas-vindas após verificação

**Story Points**: 3
**Prioridade**: P0 - Must Have

---

## 🏗️ Arquitetura Técnica

### Stack
- **Backend**: Node.js + TypeScript + Fastify
- **Database**: PostgreSQL 16 (Prisma ORM)
- **Frontend**: React + TypeScript + Vite
- **Email**: SendGrid ou AWS SES (já previsto em US-067)
- **Validação**: Zod (já usado no projeto)
- **Segurança**: reCAPTCHA v3, bcrypt, rate-limiting

### Fluxo de Dados

```
┌──────────────┐
│   Browser    │
│ (RegisterPage)│
└──────┬───────┘
       │ POST /api/auth/register
       │ { email, password, company data }
       ▼
┌──────────────────────────────────┐
│     Backend API (Fastify)        │
│  ┌────────────────────────────┐  │
│  │  AuthController.register() │  │
│  └────────────┬───────────────┘  │
│               │                  │
│  ┌────────────▼───────────────┐  │
│  │   AuthService.register()   │  │
│  │  - Validar dados           │  │
│  │  - Verificar duplicação    │  │
│  │  - Hash senha (bcrypt)     │  │
│  │  - Criar User + Company    │  │
│  │  - Gerar verification token│  │
│  └────────────┬───────────────┘  │
│               │                  │
│  ┌────────────▼───────────────┐  │
│  │ EmailVerificationService   │  │
│  │  - Gerar token único       │  │
│  │  - Salvar no DB            │  │
│  │  - Enviar email            │  │
│  └────────────┬───────────────┘  │
└───────────────┼──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│       Email Service (SendGrid)   │
│  - Template: email-verification  │
│  - Link: /verify-email?token=xxx │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│        User Email Inbox          │
│  "Confirme seu email..."         │
└──────────────┬───────────────────┘
               │ Click no link
               ▼
┌──────────────────────────────────┐
│  GET /auth/verify-email?token=xxx│
│  - Validar token                 │
│  - Marcar emailVerified = true   │
│  - Redirecionar para login       │
└──────────────────────────────────┘
```

### Endpoints

#### Públicos (não requerem autenticação)

```typescript
POST   /api/auth/register
GET    /api/auth/verify-email?token=xxx
POST   /api/auth/resend-verification
POST   /api/auth/check-email-availability
POST   /api/auth/check-company-availability
```

#### Protegidos (requerem autenticação)

```typescript
GET    /api/auth/me           // Já existe
POST   /api/auth/logout       // Já existe
```

### Database Schema Changes

```prisma
model User {
  // ... campos existentes

  // ===== NOVOS CAMPOS =====

  // Verificação de Email
  emailVerified            Boolean   @default(false) @map("email_verified")
  verificationToken        String?   @unique @map("verification_token") @db.VarChar(64)
  verificationTokenExpires DateTime? @map("verification_token_expires")

  // Reset de Senha
  resetPasswordToken       String?   @unique @map("reset_password_token") @db.VarChar(64)
  resetPasswordExpires     DateTime? @map("reset_password_expires")

  // Timestamps Adicionais
  registeredAt             DateTime? @map("registered_at") // Data de registro inicial
  activatedAt              DateTime? @map("activated_at")  // Data de ativação (email verificado)

  @@index([verificationToken])
  @@index([resetPasswordToken])
  @@index([emailVerified])
}
```

---

## 🔒 Segurança

### Proteções Implementadas

1. **Autenticação**:
   - Senha hasheada com bcrypt (salt rounds: 10)
   - Força de senha validada (mínimo 8 chars, maiúscula, número, especial)
   - Email obrigatório e único
   - Verificação de email obrigatória antes de uso

2. **Prevenção de Spam/Bots**:
   - reCAPTCHA v3 (score mínimo: 0.5)
   - Rate limiting: 3 registros/hora por IP
   - Email verification obrigatória

3. **Validação de Dados**:
   - Sanitização de inputs (validator.js)
   - Validação de schema com Zod
   - Validação de documentos fiscais (TaxValidationService)
   - Unique constraints no banco

4. **Tokens**:
   - Tokens aleatórios (crypto.randomBytes(32))
   - Expiração em 24h
   - Uso único (invalidados após uso)
   - Armazenados hasheados no banco (opcional - decisão do time)

5. **Prevenção de Duplicação**:
   - Unique constraint: `users.email`
   - Unique constraint: `companies.(country, taxId)`
   - Verificação na aplicação antes de inserir
   - Tratamento de race conditions (try/catch em constraint violation)

6. **Logs e Auditoria**:
   - Log de tentativas de registro
   - Log de tentativas de duplicação
   - AuditTrail para criação de usuários
   - IP address e user agent capturados

---

## 📊 Métricas de Sucesso

### KPIs

1. **Conversão**:
   - Taxa de registro iniciado → completado (meta: >80%)
   - Taxa de verificação de email (meta: >70%)
   - Taxa de primeira solicitação (meta: >60%)
   - Tempo médio até primeira solicitação (meta: <48h)

2. **Performance**:
   - Tempo de resposta do endpoint de registro (meta: <500ms)
   - Tempo de entrega de email de verificação (meta: <30s)
   - Taxa de erro em registros (meta: <1%)

3. **Qualidade**:
   - Taxa de duplicação detectada (quanto maior, melhor o sistema)
   - Taxa de emails inválidos rejeitados
   - Taxa de documentos fiscais inválidos rejeitados

4. **Negócio**:
   - Aumento de leads por semana
   - Redução de tempo da equipe comercial
   - Aumento de solicitações iniciadas

### Analytics a Implementar

```typescript
// Google Analytics Events
analytics.track('registration_started');
analytics.track('registration_step_completed', { step: 1 });
analytics.track('registration_completed');
analytics.track('email_verified');
analytics.track('first_request_created');

// Mixpanel Funnels
mixpanel.track('Signup Funnel', {
  step: 'Started',
  source: 'Website CTA',
  country: 'BR'
});
```

---

## 🧪 Testes

### Casos de Teste

#### 1. Testes Unitários (Backend)

**AuthService.register()**:
- ✓ Deve criar usuário e empresa com dados válidos
- ✓ Deve rejeitar email duplicado
- ✓ Deve rejeitar empresa duplicada (country + taxId)
- ✓ Deve validar formato de email
- ✓ Deve validar força de senha
- ✓ Deve validar documento fiscal por país
- ✓ Deve gerar token de verificação único
- ✓ Deve hashear senha corretamente
- ✓ Deve criar em transação atômica (rollback em erro)

**EmailVerificationService**:
- ✓ Deve gerar token aleatório de 64 chars
- ✓ Deve definir expiração de 24h
- ✓ Deve enviar email com link correto
- ✓ Deve validar token existente
- ✓ Deve rejeitar token expirado
- ✓ Deve rejeitar token já usado
- ✓ Deve marcar email como verificado

**TaxValidationService**:
- ✓ Deve validar CNPJ válido (Brasil)
- ✓ Deve rejeitar CNPJ inválido
- ✓ Deve validar CPF válido (Brasil)
- ✓ Deve validar NIT (Colômbia)
- ✓ Deve validar RUT (Colômbia)
- ✓ Deve validar RUC (Paraguai)

#### 2. Testes de Integração

- ✓ Fluxo completo: registro → verificação → login → dashboard
- ✓ Tentativa de login sem verificar email (deve falhar)
- ✓ Tentativa de registro com email duplicado
- ✓ Tentativa de registro com empresa duplicada
- ✓ Reenvio de email de verificação
- ✓ Expiração de token de verificação

#### 3. Testes E2E (Frontend)

- ✓ Preencher formulário completo e submeter
- ✓ Validação em tempo real de campos
- ✓ Navegação entre steps do wizard
- ✓ Indicador de força de senha
- ✓ Verificação de disponibilidade de email
- ✓ Máscara de documento fiscal por país
- ✓ Auto-complete de endereço por CEP
- ✓ Confirmação e criação de conta
- ✓ Recebimento e clique em link de verificação
- ✓ Login após verificação

#### 4. Testes de Segurança

- ✓ SQL Injection em inputs
- ✓ XSS em campos de texto
- ✓ CSRF em formulário de registro
- ✓ Rate limiting funcionando
- ✓ reCAPTCHA bloqueando bots
- ✓ Senhas fracas sendo rejeitadas
- ✓ Tokens não podem ser reutilizados

#### 5. Testes de Performance

- ✓ 100 registros simultâneos (load test)
- ✓ Tempo de resposta <500ms (95th percentile)
- ✓ Email enviado em <30s
- ✓ Verificação de disponibilidade <200ms

---

## 📅 Cronograma de Implementação

### Sprint 1 (Dias 1-2): Backend Core
- [ ] Modificar schema Prisma
- [ ] Migration de banco de dados
- [ ] AuthService.register()
- [ ] EmailVerificationService
- [ ] TaxValidationService (validar se já está completo)
- [ ] Testes unitários

### Sprint 2 (Dia 3): Backend API
- [ ] AuthController (register, verifyEmail, checkAvailability)
- [ ] Rotas públicas
- [ ] Rate limiting
- [ ] reCAPTCHA validation
- [ ] Testes de integração

### Sprint 3 (Dias 4-5): Frontend
- [ ] RegisterPage.tsx
- [ ] RegistrationForm.tsx (wizard multi-step)
- [ ] CountryTaxIdInput.tsx
- [ ] VerifyEmailPage.tsx
- [ ] Integração com backend
- [ ] Testes E2E

### Sprint 4 (Dia 6): Polimento e Deploy
- [ ] Templates de email
- [ ] Mensagens de erro localizadas
- [ ] Loading states e feedback visual
- [ ] Testes de segurança
- [ ] Code review
- [ ] Deploy em staging
- [ ] Testes de aceitação

---

## 🔗 Dependências

### Bloqueadores
- **US-067** (Email Service): Necessário para envio de emails de verificação
  - Status: 🔴 Não implementado
  - Impacto: Bloqueador total - sem email, não há verificação

### Relacionados
- **US-001** (Cadastro de Empresa): Aproveitará mesma estrutura
- **US-002** (Wizard de Solicitação): Mesmo padrão de UI
- **EPIC-08** (Infraestrutura): Usa AuthService, RBAC, Storage

### Habilitados por este Épico
- Marketing digital com landing pages
- Campanhas de aquisição de clientes
- Funil de conversão automatizado
- Onboarding self-service

---

## 🎨 Protótipos e Design

### Wireframes

#### 1. Landing Page (Site)
```
┌─────────────────────────────────────┐
│ [Logo HalalSphere]      [Login]     │
├─────────────────────────────────────┤
│                                     │
│   Certificação Halal Simplificada   │
│                                     │
│   Obtenha sua certificação em       │
│   apenas 30 dias                    │
│                                     │
│   [Solicitar Certificação Agora]    │
│                                     │
│   ✓ Processo 100% digital           │
│   ✓ Auditoria remota disponível     │
│   ✓ Suporte multilíngue             │
│                                     │
└─────────────────────────────────────┘
```

#### 2. Página de Registro - Step 1
```
┌─────────────────────────────────────┐
│  Criar Conta - Dados do Responsável │
│  ●───○───○───○  (1/4)               │
├─────────────────────────────────────┤
│                                     │
│  Nome Completo *                    │
│  [________________________]         │
│                                     │
│  Email *                            │
│  [________________________] ✓       │
│  ✓ Email disponível                 │
│                                     │
│  Telefone *                         │
│  [(__) _____-____]                  │
│                                     │
│  Senha *                            │
│  [________________________]         │
│  Força: ████████░░ Forte            │
│                                     │
│  Confirmar Senha *                  │
│  [________________________]         │
│                                     │
│            [Próximo →]              │
│                                     │
└─────────────────────────────────────┘
```

#### 3. Página de Registro - Step 2
```
┌─────────────────────────────────────┐
│  Criar Conta - Dados da Empresa     │
│  ●───●───○───○  (2/4)               │
├─────────────────────────────────────┤
│                                     │
│  País de Operação *                 │
│  [▼ Brasil          ]               │
│                                     │
│  Documento Fiscal (CNPJ) *          │
│  [__.___.___/____-__] ✓             │
│  ✓ CNPJ válido e disponível         │
│                                     │
│  Razão Social *                     │
│  [________________________]         │
│                                     │
│  Nome Fantasia                      │
│  [________________________]         │
│                                     │
│  [← Anterior]    [Próximo →]        │
│                                     │
└─────────────────────────────────────┘
```

#### 4. Email de Verificação
```
┌─────────────────────────────────────┐
│  [Logo HalalSphere]                 │
│                                     │
│  Olá, João Silva!                   │
│                                     │
│  Bem-vindo à HalalSphere            │
│                                     │
│  Para ativar sua conta, clique      │
│  no botão abaixo:                   │
│                                     │
│     [Verificar Email]               │
│                                     │
│  Ou copie e cole este link:         │
│  https://app.halalsphere.com/...    │
│                                     │
│  Este link expira em 24 horas.      │
│                                     │
│  Não solicitou? Ignore este email.  │
│                                     │
│  ---                                │
│  © 2025 HalalSphere                 │
└─────────────────────────────────────┘
```

---

## 📚 Documentação Adicional

### Para Desenvolvedores
- [IMPLEMENTATION.md](./epic-09-implementation.md) - Guia de implementação técnica
- [API.md](./epic-09-api.md) - Documentação de endpoints
- [TESTING.md](./epic-09-testing.md) - Guia de testes

### Para Usuários
- [USER_GUIDE.md](./epic-09-user-guide.md) - Guia do usuário
- [FAQ.md](./epic-09-faq.md) - Perguntas frequentes

---

## ✅ Checklist de Conclusão

### Backend
- [ ] Schema Prisma atualizado
- [ ] Migrations executadas
- [ ] AuthService.register() implementado
- [ ] EmailVerificationService implementado
- [ ] TaxValidationService validado
- [ ] Rotas públicas criadas
- [ ] Rate limiting configurado
- [ ] reCAPTCHA integrado
- [ ] Testes unitários (>80% coverage)
- [ ] Testes de integração

### Frontend
- [ ] RegisterPage implementada
- [ ] Wizard multi-step funcional
- [ ] Validações em tempo real
- [ ] CountryTaxIdInput com máscaras
- [ ] VerifyEmailPage implementada
- [ ] Integração com backend
- [ ] Loading states e feedback
- [ ] Testes E2E

### DevOps
- [ ] Deploy em staging
- [ ] Testes de performance
- [ ] Testes de segurança
- [ ] Monitoramento configurado
- [ ] Alertas configurados

### Documentação
- [ ] README atualizado
- [ ] API documentada
- [ ] Guia do usuário criado
- [ ] FAQ criada

### QA
- [ ] Testes de aceitação passando
- [ ] Testes de acessibilidade
- [ ] Testes em múltiplos browsers
- [ ] Testes em dispositivos móveis

---

## 🚀 Rollout Plan

### Fase 1: Soft Launch (Semana 1)
- Disponibilizar apenas via link direto (não no site)
- Convidar 10 empresas beta testers
- Monitorar métricas intensamente
- Coletar feedback

### Fase 2: Limited Release (Semana 2)
- Adicionar link no site (footer)
- Comunicar para base de leads existente
- Continuar monitoramento
- Ajustes baseados em feedback

### Fase 3: Full Launch (Semana 3)
- CTA destacado no site
- Campanha de marketing
- Email marketing
- Redes sociais

### Fase 4: Otimização (Contínua)
- A/B testing de mensagens
- Otimização de conversão
- Melhorias de UX
- Expansão de features

---

**Status**: 🔴 Não Iniciado
**Última Atualização**: 17/12/2025
**Próxima Revisão**: Após conclusão
**Owner**: Development Team
