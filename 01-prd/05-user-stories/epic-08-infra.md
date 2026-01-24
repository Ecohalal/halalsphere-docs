# 🏗️ Épico 8: Infraestrutura e Fundação Técnica

**Status de Implementação**: 🟢 95% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026
**9 User Stories | 64 Story Points**

#### 📊 Resumo de Implementação

**✅ Implementado (7/9)**:
- US-062: JWT e Gestão de Sessões ✅
- US-063: Notificações por Email (AWS SES preparado) ✅
- US-065: Notificações Push In-App ✅
- US-067: Storage S3/Local configurável ✅
- US-068: Audit Trail completo ✅
- US-069: i18n - 3 idiomas (PT, EN, AR) Schema preparado ✅
- RBAC com 11 roles ✅

**🟡 Parcial (2/9)**:
- US-061: MFA (schema OK, não obrigatório)
- US-064: SMS (schema OK, falta Twilio)
- US-066: WhatsApp Business (pós-MVP)

**📂 Código Relacionado**:
- Backend: `backend/src/auth/`, `backend/src/admin/`, `backend/src/notification/`
- Schema: `User`, `AuditTrail`, `StorageConfig`, `ESignatureConfig` models

---

**Objetivo**: Estabelecer fundação técnica robusta, escalável e segura para suportar todas as features do HalalSphere conforme best practices e compliance ISO 17065.

**Valor de Negócio**:
- 🔐 **Segurança enterprise-grade** - MFA, JWT, audit trail imutável
- ⚡ **Performance otimizada** - <2s load time, 99.9% uptime SLA
- 📱 **Multi-canal** - E-mail, SMS, Push, WhatsApp
- 🌍 **Escalabilidade global** - CDN, multi-região, auto-scaling

**Prioridade**: P0 (Must Have) | **Total**: 64 SP

---

## 🔐 Feature 8.1: Autenticação e Segurança

### **US-061: Autenticação Multifator (MFA)**
```
Como usuário do sistema,
Eu quero usar autenticação de dois fatores,
Para proteção adicional da minha conta.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Métodos de MFA suportados**:
  - 📱 **Authenticator App** (Google Authenticator, Authy) - TOTP
  - 📧 **E-mail** (código 6 dígitos)
  - 📲 **SMS** (código 6 dígitos)
  - 🔑 **Backup Codes** (10 códigos únicos para emergência)
- [ ] **Fluxo de ativação**:
  - Usuário ativa MFA em Configurações
  - Sistema exibe QR code (para app) ou envia código (e-mail/SMS)
  - Usuário confirma com código
  - Sistema gera backup codes
- [ ] **Login com MFA**:
  - Passo 1: E-mail + senha
  - Passo 2: Código MFA (válido por 5 min)
- [ ] **Políticas**:
  - MFA obrigatória para: Administradores, Gestores, Comitê
  - MFA opcional para: Empresas, Analistas, Auditores
- [ ] **Recovery**: Usar backup code se perder acesso ao MFA

**RN-064**: Após 3 tentativas de MFA falhas, bloquear conta por 15 minutos

---

### **US-062: JWT e Gestão de Sessões**
```
Como sistema,
Eu quero gerenciar sessões com tokens JWT seguros,
Para autenticação stateless e escalável.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Tokens JWT**:
  - Access Token: Validade 15 min
  - Refresh Token: Validade 7 dias (rotating)
  - Algoritmo: RS256 (chave pública/privada)
- [ ] **Payload do JWT**:
  ```json
  {
    "sub": "user_id",
    "email": "user@example.com",
    "roles": ["analista"],
    "permissions": ["solicitacoes:read", "propostas:write"],
    "iat": 1234567890,
    "exp": 1234568790
  }
  ```
- [ ] **Refresh automático**: Frontend renova access token antes de expirar
- [ ] **Revogação**:
  - Logout: Invalidar refresh token
  - Troca de senha: Invalidar todos os tokens do usuário
  - Desativação de usuário: Invalidar todos os tokens imediatamente
- [ ] **Múltiplas sessões**: Usuário pode estar logado em até 5 dispositivos simultaneamente
- [ ] **Listagem de sessões**: Ver dispositivos ativos (browser, IP, última atividade)

**RN-065**: Tokens devem ser armazenados apenas em httpOnly cookies (não localStorage)

---

## 📬 Feature 8.2: Sistema de Notificações Multi-Canal

### **US-063: Notificações por E-mail**
```
Como sistema,
Eu quero enviar e-mails transacionais e informativos,
Para comunicação com usuários.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Provedor**: SendGrid ou AWS SES
- [ ] **Templates responsivos** (HTML + Plain Text):
  - Bem-vindo (nova conta)
  - Confirmação de e-mail
  - Reset de senha
  - Nova solicitação recebida
  - Mudança de fase
  - Documento solicitado
  - Auditoria agendada
  - Certificado emitido
  - NCs identificadas
- [ ] **Personalização**:
  - Nome do usuário
  - Idioma preferido (PT/EN/AR/TR)
  - Dados do processo (número, fase, empresa)
- [ ] **Tracking**:
  - Taxa de abertura (open rate)
  - Taxa de clique (CTR)
  - Bounces (e-mails inválidos)
- [ ] **Rate limiting**: Máximo 50 e-mails/hora por usuário
- [ ] **Logs**: Registrar todos os e-mails enviados

**RN-066**: E-mails críticos (reset senha, MFA) têm prioridade máxima

---

### **US-064: Notificações por SMS**
```
Como sistema,
Eu quero enviar SMS para alertas urgentes,
Para garantir entrega imediata.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Provedor**: Twilio ou AWS SNS
- [ ] **Casos de uso**:
  - Código MFA
  - Reset de senha urgente
  - Auditoria agendada (lembrete 24h antes)
  - NC crítica identificada
- [ ] **Formato**:
  ```
  HalalSphere: Sua auditoria está agendada para 15/03 às 10h na Rua ABC, 123. Confirme: https://app.halalsphere.com/audit/1234
  ```
- [ ] **Validação**: Apenas números de celular válidos (formato E.164)
- [ ] **Opt-out**: Usuário pode desativar SMS não-críticos
- [ ] **Custo**: Limite de 100 SMS/mês por empresa (cobrar adicional se ultrapassar)

---

### **US-065: Notificações Push (In-App + Browser)**
```
Como usuário,
Eu quero receber notificações push no navegador/app,
Para acompanhar processos em tempo real.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Push Web**: Via Web Push API (browser notifications)
- [ ] **Push In-App**: Badge + lista de notificações no header
- [ ] **Tipos de notificação**:
  - 🔔 Informativa (nova mensagem, upload aprovado)
  - ⚠️ Atenção (documento solicitado, prazo próximo)
  - 🚨 Urgente (NC crítica, auditoria em 2h)
- [ ] **Centro de notificações**:
  - Listar últimas 50 notificações
  - Marcar como lida/não lida
  - Filtrar por tipo
  - "Marcar todas como lidas"
- [ ] **Permissões**: Solicitar permissão de notificação na primeira visita
- [ ] **Desabilitação granular**: Usuário escolhe quais notificações quer receber

---

### **US-066: Integração WhatsApp Business (Opcional)**
```
Como empresa,
Eu quero receber atualizações via WhatsApp,
Para conveniência (maior taxa de abertura).
```
**Prioridade**: Nice to Have (P2) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Integração**: WhatsApp Business API
- [ ] **Opt-in obrigatório**: Empresa autoriza via checkbox na solicitação
- [ ] **Templates aprovados** (WhatsApp exige pré-aprovação):
  - "Olá {{nome}}, sua solicitação #{{num}} foi recebida!"
  - "Auditoria agendada para {{data}} às {{hora}}"
  - "Certificado emitido! Baixe aqui: {{link}}"
- [ ] **Limitação**: Apenas mensagens transacionais (não marketing)
- [ ] **Fallback**: Se WhatsApp falhar, enviar SMS ou e-mail

**RN-067**: WhatsApp é complementar, nunca substitui e-mail oficial

---

## 🗄️ Feature 8.3: Storage e Arquivos

### **US-067: Armazenamento de Arquivos**
```
Como sistema,
Eu quero armazenar arquivos de forma segura e escalável,
Para documentos, fotos, certificados.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Provedor**: AWS S3 ou Azure Blob Storage
- [ ] **Estrutura de buckets**:
  - `halalsphere-documents-prod` (docs das empresas)
  - `halalsphere-certificates-prod` (PDFs de certificados)
  - `halalsphere-audit-photos-prod` (fotos de auditorias)
  - `halalsphere-temp` (uploads temporários - limpar após 24h)
- [ ] **Organização por empresa**:
  ```
  s3://halalsphere-documents-prod/
    ├── empresa-1234/
    │   ├── solicitacao-5678/
    │   │   ├── manual_halal_v2.pdf
    │   │   ├── certificado_abatedouro.pdf
    │   └── contratos/
    │       └── contrato_assinado.pdf
  ```
- [ ] **Segurança**:
  - Criptografia at-rest (AES-256)
  - Criptografia in-transit (TLS 1.3)
  - URLs pré-assinadas (expira em 1h)
  - Sem acesso público direto
- [ ] **Versionamento**: Manter histórico de versões de documentos
- [ ] **Backup**: Replicação cross-region (disaster recovery)
- [ ] **Lifecycle**: Arquivar docs antigos (>3 anos) para Glacier (custo menor)

**RN-068**: Tamanho máximo por arquivo: 50 MB

---

## 📝 Feature 8.4: Audit Trail e Logs

### **US-068: Audit Trail Completo**
```
Como sistema,
Eu quero registrar todas as ações de usuários,
Para conformidade ISO 17065 e rastreabilidade.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Eventos logados**:
  - Login/Logout
  - Criação/Edição/Exclusão de qualquer entidade
  - Upload/Download de documentos
  - Mudança de fase de processo
  - Deliberação de comitê
  - Emissão de certificado
  - Alteração de permissões
- [ ] **Formato de log**:
  ```json
  {
    "timestamp": "2025-03-15T10:30:45Z",
    "user_id": "user-1234",
    "user_email": "analista@cert.com",
    "action": "solicitacao.phase.changed",
    "resource_type": "solicitacao",
    "resource_id": "sol-5678",
    "changes": {
      "from": "Fase 2: Análise Comercial",
      "to": "Fase 3: Análise Documental"
    },
    "ip_address": "192.168.1.100",
    "user_agent": "Mozilla/5.0..."
  }
  ```
- [ ] **Imutabilidade**: Logs não podem ser editados/deletados (write-only)
- [ ] **Armazenamento**: CloudWatch Logs ou ELK Stack
- [ ] **Retenção**: 7 anos (requisito ISO 17065)
- [ ] **Busca**: Interface para gestores filtrarem logs (usuário, data, ação)

**RN-069**: Logs de segurança (login falho, MFA falho) são críticos e geram alertas

---

## 🌐 Feature 8.5: Internacionalização (i18n)

### **US-069: Suporte a 4 Idiomas**
```
Como usuário internacional,
Eu quero usar o sistema no meu idioma,
Para melhor experiência.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Idiomas suportados**:
  - 🇧🇷 Português (pt-BR) - padrão
  - 🇬🇧 Inglês (en-US)
  - 🇸🇦 Árabe (ar-SA) - layout RTL
  - 🇹🇷 Turco (tr-TR)
- [ ] **Escopo de tradução**:
  - Interface completa (botões, menus, labels)
  - Mensagens de erro
  - E-mails transacionais
  - Templates de contratos (seções fixas)
  - Chatbot IA
- [ ] **Não traduzido** (mantém original):
  - Conteúdo inserido por usuários (nomes de empresas, descrições de produtos)
  - Documentos PDF uploadados
- [ ] **Detecção automática**: Sistema detecta idioma do browser
- [ ] **Troca manual**: Seletor de idioma no header (persiste em preferências)
- [ ] **Formatação localizada**:
  - Datas: BR (dd/mm/aaaa), US (mm/dd/yyyy), AR (yyyy/mm/dd)
  - Números: BR (1.234,56), US (1,234.56)
  - Moeda: BRL, USD, SAR, TRY

**RN-070**: Árabe requer layout RTL (right-to-left) completo

**Implementação Técnica**:
```typescript
// Framework: i18next ou react-intl
{
  "pt-BR": {
    "dashboard.title": "Painel de Controle",
    "solicitacao.phase.1": "Cadastro Inicial"
  },
  "en-US": {
    "dashboard.title": "Dashboard",
    "solicitacao.phase.1": "Initial Registration"
  },
  "ar-SA": {
    "dashboard.title": "لوحة التحكم",
    "solicitacao.phase.1": "التسجيل الأولي"
  }
}
```

---

## ✅ ÉPICO 8 COMPLETO
