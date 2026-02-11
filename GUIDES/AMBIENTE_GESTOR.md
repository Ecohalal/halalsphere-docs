# Ambiente do Gestor - HalalSphere

## Visão Geral

O ambiente do gestor foi desenvolvido para fornecer uma visão executiva completa do sistema de certificação Halal, permitindo ao gestor supervisionar operações, gerenciar usuários, aprovar processos e gerar relatórios de conformidade.

## 📋 Índice

1. [Funcionalidades Implementadas](#funcionalidades-implementadas)
2. [Arquitetura](#arquitetura)
3. [Rotas da API](#rotas-da-api)
4. [Páginas do Frontend](#páginas-do-frontend)
5. [Permissões e Controle de Acesso](#permissões-e-controle-de-acesso)
6. [Como Usar](#como-usar)

---

## Funcionalidades Implementadas

### ✅ 1. Dashboard Executivo

**Métricas Financeiras:**
- MRR (Monthly Recurring Revenue) - Receita mensal recorrente
- Pipeline comercial (propostas em andamento)
- Ticket médio por certificação
- Taxa de conversão (solicitação → contrato)

**Métricas Operacionais:**
- Processos ativos
- Tempo médio de certificação (em dias)
- Taxa de aprovação do comitê técnico
- NCs médias por auditoria

**Métricas de Pessoas:**
- Auditores ativos
- Analistas ativos
- Empresas certificadas (total)
- Novas empresas certificadas no mês

**Visualizações:**
- Processos por fase (gráfico de barras)
- Processos por setor industrial
- Performance dos analistas
- Atividade recente do sistema

### ✅ 2. Gestão de Usuários

**Funcionalidades:**
- Listar todos os usuários do sistema
- Filtrar por papel (gestor, analista, auditor, empresa)
- Buscar por nome ou email
- Visualizar estatísticas de usuários por papel
- Excluir usuários
- Ver último login e status (ativo/inativo)

**Em Desenvolvimento:**
- Criar novos usuários
- Editar usuários existentes
- Gerenciar especialidades de auditores
- Gerenciar regiões de atuação

### ✅ 3. Aprovações Pendentes

**Funcionalidades:**
- Visualizar processos aguardando aprovação do comitê
- Ver detalhes do processo (empresa, protocolo, analista responsável)
- Aprovar processos
- Reprovar processos
- Indicadores de prioridade (baseado em dias de espera)

### 🔄 4. Comitê Técnico (Parcialmente Implementado)

**Backend Pronto:**
- Registrar decisões do comitê
- Votar em processos (aprovar, reprovar, aprovar com condições, solicitar mais informações)
- Justificativa obrigatória (mínimo 100 caracteres)
- Histórico de decisões por processo

**Frontend:** A implementar interface dedicada

### 🔄 5. Relatórios Gerenciais (Backend Pronto)

**Relatórios Disponíveis via API:**
1. **Relatório de Certificações**
   - Certificados emitidos por período
   - Distribuição por setor industrial
   - Tempo médio de certificação
   - Detalhes completos de cada certificado

2. **Relatório de Auditorias**
   - Auditorias realizadas
   - Performance dos auditores
   - NCs por tipo
   - Scores médios

3. **Relatório de Conformidade (SLA)**
   - Processos no prazo vs atrasados
   - Taxa de conformidade com SLA
   - Tempo médio de atraso
   - Conformidade por fase

**Frontend:** A implementar página de relatórios

---

## Arquitetura

### Backend (Node.js + NestJS + Prisma)

```
backend/src/manager/
├── manager.module.ts         # Modulo NestJS
├── manager.service.ts        # Logica de negocio
├── manager.controller.ts     # Controladores HTTP
└── dto/                      # DTOs com class-validator
```

**Tecnologias:**
- NestJS 11 (Framework web)
- Express (HTTP adapter)
- Prisma 7 (ORM)
- class-validator + Zod (Validacao)
- bcrypt (Hash de senhas)

### Frontend (React + TypeScript + TailwindCSS)

```
frontend/src/
├── services/
│   └── manager.service.ts            # Client HTTP para API
├── pages/manager/
│   ├── ManagerDashboard.tsx          # Dashboard executivo
│   └── UserManagement.tsx            # Gestão de usuários
└── App.tsx                           # Rotas registradas
```

**Tecnologias:**
- React 19.2
- TypeScript 5.9
- TailwindCSS 3.4 (Estilização)
- React Hot Toast (Notificações)
- Lucide React (Ícones)

---

## Rotas da API

### Base URL: `/api/manager`

Todas as rotas requerem autenticação JWT e papel "gestor".

#### Dashboard

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard` | Retorna métricas completas do dashboard |
| GET | `/dashboard/analysts` | Performance detalhada dos analistas |
| GET | `/dashboard/auditors` | Performance detalhada dos auditores |

#### Aprovações

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/approvals/pending` | Lista processos aguardando aprovação |
| POST | `/approvals/decision` | Submete decisão de aprovação/reprovação |

**Body de `/approvals/decision`:**
```json
{
  "processId": "uuid",
  "decision": "approve" | "reject" | "request_changes",
  "comments": "string (opcional)",
  "conditions": ["string"] // opcional
}
```

#### Gestão de Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users?role=analista` | Lista usuários (filtro opcional) |
| POST | `/users` | Cria novo usuário |
| PUT | `/users/:userId` | Atualiza usuário |
| DELETE | `/users/:userId` | Remove usuário |

**Body de POST `/users`:**
```json
{
  "name": "string (min 3 caracteres)",
  "email": "string (email válido)",
  "password": "string (min 6 caracteres)",
  "role": "analista" | "auditor" | "gestor",
  "phone": "string (opcional)",
  "preferredLanguage": "string (opcional)",
  "specialties": ["string"] // para auditores
}
```

#### Comitê Técnico

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/committee/decision` | Registra decisão do comitê |
| GET | `/committee/decisions/:processId` | Histórico de decisões |

**Body de POST `/committee/decision`:**
```json
{
  "processId": "uuid",
  "vote": "approve" | "approve_with_conditions" | "reject" | "request_more_info",
  "justification": "string (min 100 caracteres)",
  "conditions": ["string"] // obrigatório se vote = approve_with_conditions
}
```

#### Relatórios

| Método | Endpoint | Parâmetros | Descrição |
|--------|----------|------------|-----------|
| GET | `/reports/certifications` | startDate, endDate, sector, analystId | Relatório de certificações |
| GET | `/reports/audits` | startDate, endDate, auditorId | Relatório de auditorias |
| GET | `/reports/conformity` | startDate, endDate, phase | Relatório de conformidade SLA |

---

## Páginas do Frontend

### 1. Dashboard do Gestor

**Rota:** `/gestor/dashboard`

**Componentes:**
- Cards de métricas financeiras (MRR, Pipeline, Ticket Médio)
- Cards de métricas operacionais (Processos ativos, Tempo médio, Taxa de aprovação)
- Cards de métricas de pessoas (Analistas, Auditores, Empresas certificadas)
- Seção de aprovações pendentes (com ações de aprovar/reprovar)
- Gráfico de processos por fase
- Tabela de performance dos analistas
- Feed de atividade recente

**Funcionalidades:**
- Auto-refresh ao aprovar/reprovar processos
- Loading states
- Error handling com toasts
- Navegação para detalhes do processo

### 2. Gestão de Usuários

**Rota:** `/gestor/usuarios`

**Componentes:**
- Cards com estatísticas de usuários por papel
- Filtros de busca (por nome/email) e seleção de papel
- Tabela com todos os usuários
- Badges de papel e status
- Ações de editar e excluir

**Funcionalidades:**
- Busca em tempo real
- Filtro por papel
- Confirmação antes de excluir
- Loading states

---

## Permissões e Controle de Acesso

### Nível de Autenticação

Todas as rotas do gestor exigem:
1. Token JWT válido
2. Papel do usuário = "gestor"

**Middleware Aplicado:**
```typescript
router.use(authenticateToken);
```

### Segregação de Funções (ISO 17065)

O gestor **NÃO PODE**:
- ❌ Executar auditorias
- ❌ Analisar documentos técnicos de processos específicos
- ❌ Carregar/revisar documentos de empresas

O gestor **PODE**:
- ✅ Supervisionar todos os processos
- ✅ Aprovar/reprovar certificações
- ✅ Gerenciar usuários do sistema
- ✅ Votar em decisões do comitê técnico
- ✅ Gerar relatórios de conformidade
- ✅ Visualizar métricas executivas

---

## Como Usar

### 1. Acesso ao Sistema

1. Faça login com credenciais de gestor:
   ```
   POST /api/auth/login
   {
     "email": "gestor@halalsphere.com",
     "password": "senha123"
   }
   ```

2. Navegue para o dashboard do gestor:
   - URL: `/gestor/dashboard`
   - Ou clique em "Dashboard Gestor" no menu lateral

### 2. Aprovar/Reprovar Processos

1. No dashboard, visualize a seção "Aprovações Pendentes"
2. Clique em "Ver Detalhes" para ver informações completas do processo
3. Clique em "Aprovar" ou "Reprovar"
4. O sistema atualiza automaticamente o dashboard

### 3. Gerenciar Usuários

1. Navegue para `/gestor/usuarios`
2. Use a barra de busca para encontrar usuários específicos
3. Filtre por papel usando o dropdown
4. Clique no ícone de lixeira para excluir um usuário (confirmação obrigatória)

### 4. Visualizar Métricas

**Métricas Financeiras:**
- MRR: Soma de todos os contratos ativos
- Pipeline: Soma de todas as propostas pendentes/enviadas
- Ticket Médio: MRR / número de contratos

**Métricas Operacionais:**
- Tempo Médio: Calculado entre data de criação e conclusão
- Taxa de Aprovação: % de processos aprovados pelo comitê

**Performance de Analistas:**
- Eficiência: Baseada em processos concluídos no prazo (60 dias)
- Processos Ativos: Não concluídos
- Concluídos no Mês: Filtrados pelo mês atual

### 5. Tomar Decisões do Comitê

**Via API (interface web em desenvolvimento):**
```bash
POST /api/manager/committee/decision
{
  "processId": "abc-123",
  "vote": "approve",
  "justification": "A empresa demonstrou total conformidade com os requisitos Halal. Todos os documentos foram verificados, a auditoria foi bem-sucedida com score de 95%, e não foram encontradas não-conformidades críticas. Recomendo a emissão do certificado."
}
```

---

## Próximos Passos (Roadmap)

### Prioridade Alta
1. ✅ Dashboard executivo completo
2. ✅ Gestão básica de usuários
3. 🔄 Interface do Comitê Técnico
4. 🔄 Página de Relatórios Gerenciais
5. ⏳ Modal de criar/editar usuários

### Prioridade Média
6. ⏳ Analytics avançado com IA (US-059)
7. ⏳ Gráficos interativos (funil de conversão, timeline de receita)
8. ⏳ Exportação de relatórios (PDF, Excel)
9. ⏳ Notificações em tempo real
10. ⏳ Filtros avançados por período

### Prioridade Baixa
11. ⏳ Mapa de calor (Auditores x Regiões)
12. ⏳ Integração com sistema de e-mail (resumo semanal)
13. ⏳ Dashboards customizáveis
14. ⏳ Previsões baseadas em ML

---

## Estrutura de Dados Principais

### DashboardMetrics
```typescript
{
  financial: {
    mrr: number;
    pipeline: number;
    averageTicket: number;
    conversionRate: number;
  },
  operational: {
    activeProcesses: number;
    averageCertificationDays: number;
    committeeApprovalRate: number;
    averageNCs: number;
  },
  people: {
    activeAuditors: number;
    activeAnalysts: number;
    certifiedCompanies: number;
    newCompaniesThisMonth: number;
  },
  processesByPhase: Array<{
    phase: string;
    count: number;
    percentage: number;
  }>,
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
    priority: 'low' | 'medium' | 'high';
  }>
}
```

### AnalystPerformance
```typescript
{
  id: string;
  name: string;
  activeProcesses: number;
  completedThisMonth: number;
  averageCompletionDays: number;
  efficiency: number; // 0-100
  processesOnTime: number;
  processesDelayed: number;
}
```

### PendingApproval
```typescript
{
  id: string;
  processId: string;
  companyName: string;
  protocol: string;
  type: 'certificate' | 'contract' | 'proposal';
  analystName: string;
  auditScore?: number;
  contractValue?: number;
  daysWaiting: number;
  priority: 'low' | 'medium' | 'high';
  phase: string;
}
```

---

## Tecnologias Utilizadas

### Backend
- **Node.js** v20+
- **NestJS** 11.x (Web framework)
- **Express** (HTTP adapter)
- **Prisma** 7.x (ORM)
- **PostgreSQL** 16 (Banco de dados)
- **class-validator + Zod** (Validacao)
- **@nestjs/jwt** (Autenticacao JWT RS256/HS256)

### Frontend
- **React** 19.2
- **TypeScript** 5.9
- **Vite** 7.2 (Build tool)
- **TailwindCSS** 3.4 (Estilização)
- **React Router** 6.x (Roteamento)
- **React Hot Toast** (Notificações)
- **Lucide React** (Ícones)
- **Axios** (Client HTTP)

---

## Considerações de Segurança

1. **Autenticação:** Todas as rotas protegidas por JWT
2. **Validação:** Schemas Zod em todos os endpoints
3. **RBAC:** Controle de acesso baseado em papéis
4. **Sanitização:** Inputs validados no backend
5. **Rate Limiting:** Configurado via NestJS Throttler (100 req/min)
6. **HTTPS:** Obrigatório em produção
7. **CORS:** Configurado para origem específica em produção

---

## Conformidade ISO 17065

O ambiente do gestor foi desenvolvido considerando os requisitos da norma ISO/IEC 17065:2012:

- **PR 7.1 (Decisões sobre certificação):**
  - Comitê técnico com decisões registradas e rastreáveis
  - Justificativas obrigatórias
  - Segregação de funções (gestor não analisa processos que vota)

- **PR 7.5 (Manutenção da certificação):**
  - Relatórios de conformidade
  - Monitoramento de prazos (SLA)
  - Rastreabilidade completa

- **PR 9.1 (Auditoria interna):**
  - Audit trail de todas as ações
  - Histórico de decisões
  - Relatórios de conformidade

---

## Suporte e Contato

Para dúvidas ou sugestões sobre o ambiente do gestor:
- Documentação técnica: `docs/04-implementation/`
- Issues: GitHub Issues
- Email: suporte@halalsphere.com

---

**Última atualização:** 2025-01-19
**Versão do documento:** 1.0
**Status:** ✅ Ambiente básico implementado e funcional
