# Análise: Grupos Empresariais e Onboarding

**Data:** 2026-01-21
**Status:** Aprovado para Implementação
**Impacto:** Alto - Reestruturação de entidades base

---

## Sumário Executivo

Este documento define a arquitetura para suporte a **Grupos Empresariais** no HalalSphere, permitindo que grandes conglomerados (BRF, Minerva, JBS, etc.) gerenciem múltiplas empresas/filiais de forma organizada, além de estabelecer o fluxo de **onboarding** para novos usuários e empresas.

### Motivação

- Grandes grupos possuem múltiplas empresas (CNPJs) e plantas industriais
- Cada planta tem sua própria certificação Halal
- Necessidade de visão consolidada para administradores de grupo
- Compartilhamento de recursos entre empresas do mesmo grupo
- Fluxo de auto-cadastro ágil mas com qualidade de informação

---

## Decisões de Negócio

As seguintes decisões foram tomadas em reunião de análise:

| # | Questão | Decisão |
|---|---------|---------|
| 1 | Permissões de usuários | Cada filial tem seus próprios usuários. Apenas "admin de grupo" vê todas as empresas |
| 2 | Compartilhamento de dados | Apenas **fornecedores aprovados** e **documentos corporativos** são compartilhados no grupo |
| 3 | Hierarquia de certificação | CNPJ = Empresa. **Certificação é sempre por planta** (SIF no Brasil, código interno no exterior) |
| 4 | Faturamento | Cada empresa tem sua própria fatura, conforme definido em contrato |
| 5 | Aprovação de cadastro | **Auto-aprovado** com flag para validação posterior pela FAMBRAS |
| 6 | Integração CNPJ | **Sim**, busca automática na Receita Federal (ReceitaWS) |
| 7 | Acesso a empresa existente | **Ambos**: via convite do admin OU via solicitação do usuário |
| 8 | Primeiro usuário | **Admin temporário** até FAMBRAS designar admin definitivo |
| 9 | Duplicidade | **Validar CNPJ** antes de permitir cadastro (prevenir duplicidade) |

---

## Modelo de Dados

### Hierarquia de Entidades

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GRUPO EMPRESARIAL                               │
│  • Admin de grupo vê todas as empresas                                  │
│  • Compartilha: fornecedores aprovados + documentos corporativos        │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ 1:N
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         EMPRESA (CNPJ)                                  │
│  • Usuários próprios (não veem outras empresas do grupo)                │
│  • Faturamento próprio (definido em contrato)                           │
│  • CNPJ único no sistema (sem duplicidade)                              │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ 1:N
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         PLANTA / INSTALAÇÃO                             │
│  • Identificada por SIF (Brasil) ou código interno (exterior)           │
│  • Cada planta tem sua própria certificação                             │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ 1:N
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CERTIFICAÇÃO                                    │
│  • Ciclo de 3 anos                                                      │
│  • Escopo específico da planta                                          │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ 1:N
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         SOLICITAÇÃO                                     │
│  (nova, manutenção, renovação, ampliação, adequação)                    │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ 1:1
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          WORKFLOW                                       │
│  (até 17 fases)                                                         │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ resulta em
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CERTIFICADO                                     │
│  (documento emitido)                                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Diagrama ER Simplificado

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  CompanyGroup    │       │     Company      │       │      Plant       │
├──────────────────┤       ├──────────────────┤       ├──────────────────┤
│ id               │       │ id               │       │ id               │
│ name             │◄──────│ groupId (FK)     │◄──────│ companyId (FK)   │
│ tradeName        │  1:N  │ document (CNPJ)  │  1:N  │ code (SIF/interno)│
│ document         │       │ name             │       │ codeType         │
│ createdAt        │       │ tradeName        │       │ name             │
│ updatedAt        │       │ status           │       │ address          │
└────────┬─────────┘       │ pendingValidation│       │ country          │
         │                 │ isHeadquarters   │       │ isActive         │
         │                 │ createdAt        │       └────────┬─────────┘
         │                 │ updatedAt        │                │
         │                 └────────┬─────────┘                │
         │                          │                          │
         │  ┌───────────────────────┘                          │
         │  │                                                  │
         │  │  1:N                                             │ 1:N
         │  ▼                                                  ▼
         │  ┌──────────────────┐                 ┌──────────────────┐
         │  │      User        │                 │  Certification   │
         │  ├──────────────────┤                 ├──────────────────┤
         │  │ id               │                 │ id               │
         │  │ companyId (FK)   │                 │ plantId (FK)     │
         │  │ isGroupAdmin     │                 │ status           │
         │  │ isCompanyAdmin   │                 │ validUntil       │
         │  │ isTemporaryAdmin │                 │ ...              │
         │  └──────────────────┘                 └──────────────────┘
         │
         │  1:N (compartilhados)
         ▼
┌──────────────────┐       ┌──────────────────┐
│ SharedSupplier   │       │ CorporateDocument│
├──────────────────┤       ├──────────────────┤
│ id               │       │ id               │
│ groupId (FK)     │       │ groupId (FK)     │
│ supplierData...  │       │ documentData...  │
└──────────────────┘       └──────────────────┘
```

---

## Definição das Entidades

### CompanyGroup

```typescript
interface CompanyGroup {
  id: string;

  // Identificação
  name: string;                      // "Grupo BRF", "Grupo Minerva"
  tradeName?: string;                // Nome fantasia do grupo
  document?: string;                 // CNPJ da holding (opcional)

  // Contato do grupo
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;

  // Relacionamentos
  companies: Company[];              // Empresas do grupo
  sharedSuppliers: SharedSupplier[]; // Fornecedores compartilhados
  corporateDocuments: Document[];    // Documentos corporativos

  // Auditoria
  createdAt: Date;
  updatedAt: Date;
}
```

### Company (Atualizada)

```typescript
interface Company {
  id: string;

  // Identificação - CNPJ ÚNICO
  document: string;                  // CNPJ - índice único
  name: string;                      // Razão Social (da Receita)
  tradeName?: string;                // Nome Fantasia

  // Dados da Receita Federal
  legalNature?: string;              // Natureza Jurídica
  legalNatureCode?: string;
  mainActivity?: string;             // CNAE Principal
  mainActivityCode?: string;
  secondaryActivities?: string[];    // CNAEs Secundários
  capitalStock?: number;             // Capital Social
  companySize?: string;              // Porte (ME, EPP, etc)
  federalRegistrationStatus?: string;// Situação Cadastral
  federalRegistrationDate?: Date;    // Data Situação Cadastral

  // Endereço
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Contato
  email?: string;
  phone?: string;

  // Vinculação ao grupo
  groupId: string;                   // FK para CompanyGroup
  group: CompanyGroup;
  isHeadquarters: boolean;           // É matriz do grupo?

  // Status
  status: 'active' | 'inactive' | 'suspended';

  // Validação FAMBRAS
  pendingValidation: boolean;        // Aguardando validação?
  validatedAt?: Date;                // Quando foi validado
  validatedBy?: string;              // Quem validou (userId)
  validationNotes?: string;          // Observações da validação

  // Relacionamentos
  plants: Plant[];                   // Plantas/instalações
  users: User[];                     // Usuários da empresa

  // Auditoria
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;                // Usuário que cadastrou
}
```

### Plant (Nova Entidade)

```typescript
interface Plant {
  id: string;

  // Vinculação
  companyId: string;                 // FK para Company
  company: Company;

  // Identificação
  code: string;                      // SIF (Brasil) ou código interno
  codeType: 'sif' | 'sie' | 'sim' | 'internal'; // Tipo do código
  name: string;                      // Nome/descrição da planta

  // Localização
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Detalhes operacionais
  productionCapacity?: string;       // Capacidade produtiva
  employeeCount?: number;            // Número de funcionários
  shiftsCount?: number;              // Número de turnos

  // Status
  isActive: boolean;

  // Relacionamentos
  certifications: Certification[];   // Certificações desta planta

  // Auditoria
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de código de planta
enum PlantCodeType {
  SIF = 'sif',       // Serviço de Inspeção Federal (Brasil)
  SIE = 'sie',       // Serviço de Inspeção Estadual (Brasil)
  SIM = 'sim',       // Serviço de Inspeção Municipal (Brasil)
  INTERNAL = 'internal' // Código interno (exterior ou sem registro)
}
```

### User (Campos Adicionais)

```typescript
interface User {
  // Campos existentes...
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // ...

  // Vinculação à empresa
  companyId?: string;                // FK para Company
  company?: Company;

  // Permissões de grupo
  isGroupAdmin: boolean;             // Vê todas empresas do grupo

  // Permissões de empresa
  isCompanyAdmin: boolean;           // Admin da empresa
  isTemporaryAdmin: boolean;         // Admin temporário (primeiro usuário)
  adminAssignedAt?: Date;            // Quando FAMBRAS designou admin
  adminAssignedBy?: string;          // Quem designou (userId FAMBRAS)

  // Solicitação de acesso pendente
  pendingCompanyAccess?: string;     // companyId que solicitou acesso
  accessRequestedAt?: Date;          // Quando solicitou
  accessRequestMessage?: string;     // Mensagem da solicitação

  // Convite pendente
  invitedByCompanyId?: string;       // Empresa que convidou
  invitedAt?: Date;                  // Quando foi convidado
  inviteToken?: string;              // Token do convite
  inviteExpiresAt?: Date;            // Validade do convite
}
```

### SharedSupplier (Fornecedor Compartilhado)

```typescript
interface SharedSupplier {
  id: string;

  // Vinculação ao grupo
  groupId: string;                   // FK para CompanyGroup
  group: CompanyGroup;

  // Dados do fornecedor
  name: string;
  document?: string;                 // CNPJ/CPF
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;

  // Produtos/ingredientes fornecidos
  products: string[];                // Lista de produtos

  // Status de aprovação
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  approvedAt?: Date;
  approvedBy?: string;

  // Documentação
  halalCertificateUrl?: string;      // Certificado Halal do fornecedor
  halalCertificateExpiry?: Date;

  // Auditoria
  createdAt: Date;
  updatedAt: Date;
  addedBy: string;                   // Quem adicionou
}
```

### CorporateDocument (Documento Corporativo)

```typescript
interface CorporateDocument {
  id: string;

  // Vinculação ao grupo
  groupId: string;                   // FK para CompanyGroup
  group: CompanyGroup;

  // Dados do documento
  name: string;                      // Nome do documento
  description?: string;
  category: 'bpf' | 'appcc' | 'procedimento' | 'manual' | 'politica' | 'outro';

  // Arquivo
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;

  // Validade
  validUntil?: Date;
  version?: string;

  // Status
  isActive: boolean;

  // Auditoria
  createdAt: Date;
  updatedAt: Date;
  uploadedBy: string;
}
```

---

## Fluxo de Onboarding

### Diagrama do Fluxo

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    CADASTRO DE NOVO USUÁRIO + EMPRESA                    │
└──────────────────────────────────────────────────────────────────────────┘

     ┌─────────────┐
     │  REGISTRO   │
     │  (usuário)  │
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │  VERIFICAR  │
     │   EMAIL     │
     └──────┬──────┘
            │
            ▼
     ┌─────────────────────────────────────┐
     │  COMO DESEJA PROSSEGUIR?            │
     │                                     │
     │  ○ Cadastrar nova empresa           │───────────────┐
     │  ○ Tenho código de convite          │───────┐       │
     │  ○ Solicitar acesso a empresa       │───┐   │       │
     └─────────────────────────────────────┘   │   │       │
                                               │   │       │
                    ┌──────────────────────────┘   │       │
                    │                              │       │
                    ▼                              ▼       ▼
            ┌───────────────┐            ┌─────────────────────────────┐
            │  BUSCAR CNPJ  │            │    INFORMAR CNPJ            │
            │  (solicitar)  │            │    ┌─────────────────────┐  │
            └───────┬───────┘            │    │ [Buscar na Receita] │  │
                    │                    │    └──────────┬──────────┘  │
                    ▼                    │               │             │
            ┌───────────────┐            │               ▼             │
            │ CNPJ existe?  │            │    ┌─────────────────────┐  │
            └───────┬───────┘            │    │ CNPJ já cadastrado? │  │
                    │                    │    └──────────┬──────────┘  │
              Sim   │                    │               │             │
                    ▼                    │         Sim   │   Não       │
            ┌───────────────┐            │               │             │
            │   SOLICITAR   │            │    ┌──────────┘             │
            │    ACESSO     │            │    │                        │
            └───────┬───────┘            │    ▼                        ▼
                    │                    │  ┌─────────┐    ┌───────────────────┐
                    ▼                    │  │ ERRO:   │    │ PREENCHER DADOS   │
            ┌───────────────┐            │  │ CNPJ já │    │ • Razão Social    │
            │ ADMIN APROVA  │            │  │ existe  │    │ • Endereço        │
            └───────┬───────┘            │  └─────────┘    │ • Contato         │
                    │                    │                 │ • Faz parte de    │
                    │                    │                 │   grupo? [S/N]    │
                    │    ┌───────────────┘                 └─────────┬─────────┘
                    │    │ (convite)                                 │
                    │    ▼                                           │
                    │  ┌───────────────┐                             │
                    │  │ VALIDAR       │                             │
                    │  │ CÓDIGO        │                             │
                    │  └───────┬───────┘                             │
                    │          │                                     │
                    └────┬─────┘                                     │
                         │                                           │
                         ▼                                           ▼
                  ┌─────────────┐                          ┌─────────────────────┐
                  │  VINCULADO  │                          │ EMPRESA CRIADA      │
                  │  À EMPRESA  │                          │ • Status: ativo     │
                  │  (role do   │                          │ • Flag: pendente    │
                  │   convite)  │                          │   validação         │
                  └──────┬──────┘                          │ • Grupo: criado     │
                         │                                 │   automaticamente   │
                         │                                 │   (se independente) │
                         │                                 └──────────┬──────────┘
                         │                                            │
                         │                                            ▼
                         │                                 ┌─────────────────────┐
                         │                                 │ USUÁRIO = ADMIN     │
                         │                                 │ TEMPORÁRIO          │
                         │                                 │ (até FAMBRAS        │
                         │                                 │  designar)          │
                         │                                 └──────────┬──────────┘
                         │                                            │
                         └───────────────┬────────────────────────────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │  DASHBOARD  │
                                  │  EMPRESA    │
                                  └──────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │   INICIAR   │
                                  │ CERTIFICAÇÃO│
                                  └─────────────┘
```

### Estados do Usuário

```
┌─────────────┐    verificação    ┌─────────────┐    vinculação    ┌─────────────┐
│  pending    │ ───────────────►  │  verified   │ ───────────────► │   active    │
│ (sem email) │      email        │ (sem empresa)│     empresa      │ (completo)  │
└─────────────┘                   └─────────────┘                   └─────────────┘
```

### Estados da Empresa

```
┌─────────────┐                   ┌─────────────┐
│   active    │                   │   active    │
│ (pendente   │ ───validação───►  │ (validado)  │
│  validação) │    FAMBRAS        │             │
└─────────────┘                   └─────────────┘
```

---

## Jornadas de Usuário

### Jornada A: Empresa Nova Independente

```
1. Usuário acessa /register
2. Preenche dados pessoais
3. Verifica email
4. Seleciona "Cadastrar nova empresa"
5. Informa CNPJ
6. Sistema busca dados na Receita Federal
7. Sistema valida que CNPJ não existe
8. Usuário confirma dados e informa que NÃO faz parte de grupo
9. Sistema cria:
   - CompanyGroup (com nome da empresa)
   - Company (vinculada ao grupo)
   - Usuário como admin temporário
10. Usuário é redirecionado ao Dashboard
11. Usuário pode iniciar certificação
12. FAMBRAS valida empresa posteriormente (flag pendingValidation)
```

### Jornada B: Nova Filial de Grupo Existente

```
1. Admin do grupo acessa Dashboard
2. Seleciona "Adicionar Empresa ao Grupo"
3. Informa CNPJ da nova filial
4. Sistema busca dados na Receita Federal
5. Admin confirma dados
6. Empresa é criada vinculada ao grupo
7. Admin convida usuário para a nova empresa
8. Usuário recebe email com link de convite
9. Usuário se registra (ou faz login se já tem conta)
10. Usuário é vinculado à empresa com role definido no convite
```

### Jornada C: Funcionário de Empresa Existente

```
Caminho 1 - Via Convite:
1. Admin da empresa acessa "Gerenciar Usuários"
2. Clica em "Convidar Usuário"
3. Informa email e role do novo usuário
4. Sistema envia email com link de convite
5. Usuário clica no link e se registra
6. Usuário é automaticamente vinculado à empresa

Caminho 2 - Via Solicitação:
1. Usuário se registra
2. Seleciona "Solicitar acesso a empresa"
3. Busca empresa pelo CNPJ
4. Envia solicitação com mensagem
5. Admin da empresa recebe notificação
6. Admin aprova ou rejeita
7. Se aprovado, usuário é vinculado com role padrão
```

### Jornada D: Empresa Adquirida por Grupo

```
1. Admin da empresa independente acessa "Configurações"
2. Seleciona "Vincular a Grupo Empresarial"
3. Busca grupo pelo nome ou CNPJ da holding
4. Envia solicitação de vinculação
5. Admin do grupo recebe notificação
6. Admin do grupo aprova
7. Empresa migra para o grupo (mantém certificações)
8. Grupo original (que tinha só essa empresa) é desativado
```

---

## Regras de Negócio

### RN-001: Unicidade de CNPJ
- Não é permitido cadastrar duas empresas com o mesmo CNPJ
- Sistema deve validar antes de permitir cadastro
- Se CNPJ já existe, redirecionar para solicitação de acesso

### RN-002: Grupo Obrigatório
- Toda empresa DEVE pertencer a um grupo
- Ao cadastrar empresa independente, criar grupo automaticamente
- Nome do grupo = Nome da empresa (pode ser alterado depois)

### RN-003: Admin de Grupo
- Apenas admin de grupo pode ver todas as empresas
- Usuários comuns veem apenas sua empresa
- Admin de grupo pode gerenciar usuários de qualquer empresa

### RN-004: Admin Temporário
- Primeiro usuário a cadastrar empresa = admin temporário
- Flag `isTemporaryAdmin = true`
- FAMBRAS pode designar admin definitivo
- Admin temporário tem mesmos poderes de admin

### RN-005: Validação FAMBRAS
- Empresas são criadas com `pendingValidation = true`
- Não bloqueia operação (pode solicitar certificação)
- FAMBRAS valida em background
- Se validação falhar, FAMBRAS contata empresa

### RN-006: Certificação por Planta
- Certificação é vinculada à Planta, não à Empresa
- Uma empresa pode ter múltiplas plantas
- Cada planta pode ter múltiplas certificações (histórico)
- Planta identificada por SIF/SIE/SIM (Brasil) ou código interno

### RN-007: Compartilhamento no Grupo
- Apenas fornecedores aprovados são compartilhados
- Apenas documentos corporativos são compartilhados
- Certificações, solicitações e certificados são por empresa/planta

### RN-008: Faturamento
- Cada empresa tem seu próprio faturamento
- Definido pelo contrato de cada certificação
- Grupo não consolida faturamento automaticamente

---

## Impacto no Sistema Atual

### Backend

| Módulo | Impacto | Ação |
|--------|---------|------|
| Company | Alto | Adicionar campos de grupo, validação, admin |
| User | Alto | Adicionar campos de permissão e convite |
| Certification | Médio | Vincular a Plant ao invés de Company diretamente |
| Auth | Médio | Fluxo pós-registro, convites |
| Document | Baixo | Suporte a documentos corporativos |

### Frontend

| Tela/Componente | Impacto | Ação |
|-----------------|---------|------|
| Register | Alto | Fluxo pós-verificação |
| Dashboard | Alto | Visão de grupo para admin |
| Nova Certificação | Médio | Seleção de planta |
| Configurações | Alto | Gestão de grupo, usuários, plantas |

### Banco de Dados

| Tabela | Ação |
|--------|------|
| company_groups | Criar |
| plants | Criar |
| shared_suppliers | Criar |
| corporate_documents | Criar |
| companies | Alterar (adicionar campos) |
| users | Alterar (adicionar campos) |
| certifications | Alterar (vincular a plant) |
| user_invites | Criar |
| access_requests | Criar |

---

## Referências

- [BACKLOG-MIGRACAO-CERTIFICACOES.md](./BACKLOG-MIGRACAO-CERTIFICACOES.md)
- [BACKLOG-COMPLEMENTAR-PR71.md](./BACKLOG-COMPLEMENTAR-PR71.md)
- [ANALISE-CONFORMIDADE-PR71-REV22.md](./ANALISE-CONFORMIDADE-PR71-REV22.md)

---

*Documento criado em 2026-01-21*
*Aprovado para implementação em 2026-01-21*
