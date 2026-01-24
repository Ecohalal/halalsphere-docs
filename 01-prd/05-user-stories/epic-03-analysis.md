## ÉPICO 3: Análise e Preparação (Analistas) 🚀

**Status de Implementação**: 🟢 90% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026
**12 User Stories | 90 Story Points**

#### 📊 Resumo de Implementação

**✅ Implementado (9/12)**:
- US-018: Dashboard Kanban de Processos ✅
- US-020: Revisão de Solicitação ✅
- US-021: Enquadramento GSO 2055-2 (3 níveis) ✅
- US-022: Checklist Estágio 1 (5 seções) ✅
- US-023: Solicitação de Documentos ✅
- US-023.1: Sistema de Comentários (@mentions) ✅
- US-023.2: Agendamento de Auditorias ✅
- US-025: Cadastro de Auditores ✅
- US-028: Calendário Visual de Auditorias ✅

**🟡 Parcial (1/12)**:
- US-019: Atribuição de Analistas - Apenas manual implementado
- US-027: Agendamento Colaborativo - Falta interface empresa

**🔴 Pendente (2/12 - Pós-MVP)**:
- US-024: Assistência IA para análise documental
- US-026: Matching Inteligente de Auditores
- US-029: Briefing automático por email

**📂 Código Relacionado**:
- Backend: `backend/src/process/`, `document-request/`, `comment/`, `audit/`
- Frontend: `frontend/src/pages/analyst/AnalystDashboard.tsx` (Kanban)
- Schema: `DocumentRequest`, `Comment`, `Audit` models

---

**Contexto**: Features para analistas gerenciarem processos, analisarem documentação e coordenarem auditorias. Inclui **Inovação #4: Calendário Inteligente de Auditorias**.

---

### 📋 Feature 3.1: Painel de Controle de Processos

#### **US-018: Dashboard Kanban de Processos**
```
Como analista,
Eu quero visualizar todos meus processos em um painel Kanban,
Para gerenciar e priorizar meu trabalho eficientemente.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Colunas Kanban**: Novos | Em Análise | Aguardando Docs | Agendamento | Em Auditoria | Aguardando Comitê | Concluídos
- [ ] **Cards** com: Nome empresa, protocolo, dias no status, prioridade
- [ ] **Drag & drop** entre colunas
- [ ] **Filtros**: Por analista, prazo, tipo certificação
- [ ] **Contadores**: Total por coluna
- [ ] **Alertas visuais**: Cards atrasados em vermelho

**RN-041**: Apenas analista responsável pode mover processo

**UX/UI Specifications**:

**Referência**: [UX Design Guide - Seção 2.2: Layout para Analistas](./ux-design-guide.md#22-para-analistas---direção-8-kanban-view-)
**Wireframes**: [ux-design-directions-v2.html](./ux-design-directions-v2.html) - Direção 8, [ux-design-high-volume-solutions.html](./ux-design-high-volume-solutions.html) - Solução 2

**Layout Geral** (Direção 8: Kanban Limitado):
```
┌─┬────────────────────────────────────────────────┐
│S│ Top Bar: Filtros + Toggle View + Search       │
│I├────────────────────────────────────────────────┤
│D│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│E│ │Nov │ │Anál│ │Docs│ │Agen│ │Audi│ │Comi│   │
│B│ │ 12 │ │ 18 │ │ 23 │ │ 15 │ │ 18 │ │  8 │   │
│A│ ├────┤ ├────┤ ├────┤ ├────┤ ├────┤ ├────┤   │
│R│ │Card│ │Card│ │Card│ │Card│ │Card│ │Card│   │
│ │ │Card│ │Card│ │Card│ │Card│ │Card│ │Card│   │
│ │ │Card│ │Card│ │Card│ │Card│ │Card│ │    │   │
│ │ │Card│ │Card│ │Card│ │    │ │    │ │    │   │
│ │ │Card│ │    │ │    │ │    │ │    │ │    │   │
│ │ ├────┤ ├────┤ ├────┤ ├────┤ ├────┤ ├────┤   │
│ │ │+Mais│ │+Mais│ │+Mais│ │+Mais│ │+Mais│ │+Mais│  │
│ │ │  7 │ │ 13 │ │ 18 │ │ 10 │ │ 13 │ │  3 │   │
└─┴────────────────────────────────────────────────┘
```

**1. Sidebar Colapsável** (P0 - Must Have):
- **Width**: 260px expandido, 60px colapsado
- **Toggle**: Ícone hamburger (☰) no topo
- **Conteúdo**:
  * Logo (topo)
  * Navegação principal:
    - 📊 Dashboard (atual)
    - 📝 Solicitações
    - 📅 Agenda
    - 📈 Relatórios
    - ⚙️ Configurações
  * Avatar + nome do usuário (bottom)
- **Estado colapsado**: Apenas ícones visíveis
- **Responsivo**: Auto-colapsa em telas <1280px

**2. Top Bar com Filtros Inteligentes** (P0 - Must Have):
```
┌──────────────────────────────────────────────┐
│ 🔍 [Protocolo, empresa...]                   │
│ [Minhas Solicit. ▼] [Status ▼] [Prior. ▼]  │
│ Filtros ativos: [Minhas ×] [Alta ×]         │
│ Toggle: [Kanban] [Tabela] [Timeline]        │
└──────────────────────────────────────────────┘
```

**Componentes**:
- **Busca rápida**:
  * Input com ícone lupa
  * Placeholder: "Buscar por protocolo, empresa, CNPJ..."
  * Busca em tempo real após 3 caracteres
  * Width: 300px
- **Filtros dropdown**:
  * **Analista**: [Todos (167)] [Minhas Solicitações (47)] [João Silva (32)]
  * **Status/Fase**: Todas as colunas kanban + contador
  * **Prioridade**: [Todas] [Alta (8)] [Média (25)] [Baixa (14)]
  * **Tipo Certificação**: [Todos] [C1] [C2] [C3] [C4] [C5] [C6]
  * Cada opção mostra contador entre parênteses
- **Badges de filtros ativos**:
  * Background verde (#2D5016), texto branco
  * Ícone × para remover filtro
  * Animação fade ao adicionar/remover
- **Toggle de visualização**:
  * 3 botões: [Kanban] [Tabela] [Timeline]
  * Ativo: background verde, inativo: cinza
  * Salva preferência do usuário

**3. Colunas Kanban** (P0 - Must Have):

**7 Colunas padrão**:
1. **Novos** (cinza #6B7280)
2. **Em Análise** (azul #3B82F6)
3. **Aguardando Docs** (amarelo #F59E0B)
4. **Agendamento** (roxo #8B5CF6)
5. **Em Auditoria** (verde #10B981)
6. **Aguardando Comitê** (laranja #F97316)
7. **Concluídos** (verde escuro #059669)

**Header da coluna**:
```
┌─────────────────────┐
│ Em Análise    [18]  │ ← Contador
└─────────────────────┘
```
- Font-size: 11px uppercase
- Font-weight: 600
- Cor da coluna no border-top (3px)
- Background cinza claro (#F3F4F6)

**4. Cards Kanban** (P0 - Must Have):

**Estrutura do card**:
```
┌─────────────────────────────┐
│ ⚠️ HAL-2025-001234          │ ← Protocolo (monospace)
│ XYZ Alimentos Ltda          │ ← Nome empresa (bold)
│ C1 - Alimentos              │ ← Tipo (small, muted)
│                             │
│ [JS] Há 3 dias       →     │ ← Avatar, Tempo, Ação
└─────────────────────────────┘
```

**Especificações visuais**:
- **Dimensões**: Width 100%, min-height 110px
- **Border-left**: 4px com cor de prioridade
  * Alta: #EF4444 (vermelho)
  * Média: #F59E0B (amarelo)
  * Baixa: #9CA3AF (cinza)
- **Background**: Branco (#FFFFFF)
- **Border**: 1px solid #E5E7EB
- **Border-radius**: 8px
- **Padding**: 12px
- **Shadow**: 0 1px 2px rgba(0,0,0,0.05)
- **Hover**: Shadow elevado (0 4px 6px) + cursor grab
- **Dragging**: Opacity 0.6 + rotate(2deg) + cursor grabbing

**Conteúdo do card**:
- **Protocolo**: Font-family monospace, font-size 11px, color #6B7280
- **Nome empresa**: Font-size 13px, font-weight 600, color #1F2937
- **Tipo**: Font-size 11px, color #9CA3AF, margin-top 4px
- **Footer** (flex, space-between):
  * **Avatar**: Circle 24px, initials, background verde
  * **Tempo**:
    - Normal: "Há X dias" (cinza #6B7280)
    - Atrasado (>7 dias): "⚠️ Há X dias" (vermelho #EF4444)
  * **Ação**: Seta → (cor verde, hover underline)

**5. Lazy Loading** (P0 - Must Have - **Solução para Alto Volume**):

**Por que?** Com 600-700 empresas simultâneas, mostrar todos os cards causaria:
- Scroll infinito nas colunas
- Performance ruim (renderização de 100+ cards)
- Sobrecarga cognitiva para o analista

**Solução implementada**:
```
┌─────────────────────────────┐
│ Card 1 (mais urgente)       │
│ Card 2                      │
│ Card 3                      │
│ Card 4                      │
│ Card 5                      │
├─────────────────────────────┤
│ + Carregar mais 13 →        │ ← Botão
└─────────────────────────────┘
```

**Comportamento**:
- **Inicial**: Mostra top 5 cards por coluna (ordenados por prioridade + tempo)
- **Botão "Carregar mais"**:
  * Mostra quantos faltam (ex: "+ Carregar mais 13")
  * Ao clicar: Carrega mais 10 cards
  * Animação fade-in (0.2s)
  * Scroll automático para o último card carregado
- **Se filtro ativo** e resultado <5: Mostra todos, sem botão

**6. Drag-and-Drop** (P0 - Must Have):

**Biblioteca**: react-beautiful-dnd ou @dnd-kit (React)

**Comportamento**:
1. **Grab**: Hover no card mostra cursor grab
2. **Drag**:
   - Card fica semi-transparente (opacity 0.6)
   - Rotate leve (2deg)
   - Outras colunas destacam área de drop
3. **Drop zone**:
   - Placeholder visual (border dashed verde)
   - Animação smooth de outros cards movendo
4. **Drop**:
   - Animação de card "caindo" na nova posição
   - Chamada API para atualizar status no backend
   - Toast de sucesso: "Processo movido para [Coluna]"
5. **Validação**:
   - Se analista não é responsável: Bloqueio visual + toast vermelho
   - Se transição inválida (ex: Novos → Concluídos): Reverte + toast explicativo

**7. Alertas Visuais** (P0 - Must Have):

**Cards atrasados** (processo há >7 dias no mesmo status):
- Border-left vermelho (#EF4444), 4px mais grosso
- Ícone ⚠️ ao lado do protocolo
- Tempo em vermelho + bold
- Animação sutil de "pulse" (1s loop)

**Notificação no topo** (se há cards atrasados):
```
┌──────────────────────────────────────────┐
│ ⚠️ Você tem 3 processos atrasados        │
│ [Ver Atrasados] [×]                      │
└──────────────────────────────────────────┘
```
- Background amarelo claro (#FEF3C7)
- Border-left laranja (#F59E0B)
- Dismissible (botão ×)

**8. Empty States**:

Se coluna vazia:
```
┌─────────────────────────────┐
│                             │
│      📭                     │
│   Nenhum processo           │
│   nesta fase                │
│                             │
└─────────────────────────────┘
```

**9. Responsividade**:
- **Desktop (>1280px)**: 7 colunas visíveis, scroll horizontal suave
- **Tablet (768-1280px)**: 4 colunas visíveis, swipe para navegar
- **Mobile (<768px)**: 1 coluna por vez, swipe left/right, dots indicator

**10. Performance**:
- **Virtualization**: Renderizar apenas cards visíveis (react-window)
- **Lazy images**: Avatares carregam sob demanda
- **Debounce**: Busca rápida espera 300ms após último caractere
- **Optimistic UI**: Drag-and-drop atualiza UI imediatamente, rollback se API falhar

**Métricas de Sucesso UX**:
- Tempo para encontrar processo: **<10s** (vs. 2-3min atual)
- Processos movidos/dia: **+50%** (mais produtividade)
- Erros de atribuição: **-80%** (drag-and-drop visual)

---

#### **US-019: Atribuição Automática de Processos**
```
Como coordenador,
Eu quero que novos processos sejam distribuídos automaticamente,
Para balancear carga entre analistas.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Algoritmo considera**: Carga atual, especialização, histórico
- [ ] **Coordenador pode** reatribuir manualmente
- [ ] **Notificação** automática ao analista atribuído

**RN-042**: Analista não pode ter >60 processos ativos

---

### 🔍 Feature 3.2: Análise de Solicitação e Enquadramento

#### **US-020: Revisão de Solicitação Completa**
```
Como analista,
Eu quero revisar solicitação com checklist de elegibilidade,
Para aprovar ou rejeitar rapidamente.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Visualização completa** da solicitação (todas 5 etapas)
- [ ] **Checklist de elegibilidade**: CNPJ válido, licenças, produtos elegíveis
- [ ] **Botões**: Aprovar / Solicitar Complementação / Rejeitar
- [ ] **Se rejeitar**: Campo obrigatório de justificativa
- [ ] **Se aprovar**: Avança automaticamente para cálculo de proposta

**RN-043**: Revisão deve ocorrer em max 5 dias úteis

---

#### **US-021: Enquadramento Automático GSO/SMIIC**
```
Como analista,
Eu quero que sistema sugira categorias GSO/SMIIC baseado em produtos,
Para acelerar enquadramento.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **IA sugere categoria** baseada em descrição de produtos
- [ ] **Exibe top 3 sugestões** com % de confiança
- [ ] **Analista pode aceitar ou alterar**
- [ ] **Histórico** de enquadramentos similares

---

### 📄 Feature 3.3: Análise Documental (Estágio 1)

#### **US-022: Checklist Digital de Estágio 1 (PR 7.1 10.6)**
```
Como analista,
Eu quero checklist digital conforme PR 7.1 para Estágio 1,
Para garantir conformidade na análise documental.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Checklist padrão** conforme PR 7.1 10.6
- [ ] **Cada item** pode ser marcado: ✅ Conforme / ❌ Não-Conforme / ⚠️ Requer Atenção
- [ ] **Campo de observações** por item
- [ ] **Sistema bloqueia** conclusão até todos itens revisados
- [ ] **Gera relatório** de Estágio 1 automaticamente

---

#### **US-023: Solicitação de Documentos Complementares** ✅ IMPLEMENTADO
```
Como analista,
Eu quero solicitar documentos adicionais diretamente no sistema,
Para que empresa saiba exatamente o que está faltando.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP | **Status**: ✅ Completo (Nov 2025)

**Acceptance Criteria**:
- [x] **Botão** "Solicitar Documentos Adicionais" na página de detalhes do processo
- [x] **Lista** de tipos de documentos predefinidos (11 tipos + outros)
- [x] **Campo** de descrição obrigatório do que é necessário
- [x] **Prazo** para envio (opcional, campo data limite)
- [x] **Sistema rastreia** status da solicitação (pendente/atendido/cancelado)
- [x] **API completa** para gerenciar solicitações de documentos

**RN-044**: Após 3 solicitações sem resposta, processo pode ser cancelado

**Implementação**:
- **Backend**: `DocumentRequest` model + API em `/api/document-requests`
- **Frontend**: `DocumentRequestModal` component
- **Database**: Tabela `document_requests` com foreign keys
- **Funcionalidades**:
  - Criar solicitações com tipo de documento, descrição e prazo
  - Visualizar solicitações pendentes por processo
  - Marcar como atendido quando documento enviado
  - Cancelar solicitações
  - Rastrear documentos atrasados (overdue)

---

#### **US-023.1: Sistema de Comentários e Observações** ✅ IMPLEMENTADO
```
Como analista,
Eu quero adicionar comentários e observações aos processos,
Para documentar decisões, anotações e comunicação com a empresa.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP | **Status**: ✅ Completo (Nov 2025)

**Acceptance Criteria**:
- [x] **Adicionar comentários** diretamente na página do processo
- [x] **Comentários internos** (visíveis apenas para analistas)
- [x] **Comentários externos** (visíveis para empresa)
- [x] **Editar e deletar** próprios comentários
- [x] **Mencionar usuários** com @ (notificações futuras)
- [x] **Histórico completo** de comentários ordenado por data
- [x] **Indicador visual** de comentários internos vs externos

**Implementação**:
- **Backend**: `Comment` model + API em `/api/comments`
- **Frontend**: `CommentsSection` component integrado em ProcessDetails
- **Database**: Tabela `comments` com campo `isInternal`
- **Funcionalidades**:
  - Criar comentários com toggle interno/externo
  - Visualizar comentários filtrados por role (empresas não veem internos)
  - Editar comentários com registro de edição (`editedAt`)
  - Deletar comentários (soft delete ou hard delete)
  - Sistema de menções (`mentions` array)
  - Buscar comentários por menção

---

#### **US-023.2: Agendamento de Auditorias** ✅ IMPLEMENTADO PARCIAL
```
Como analista,
Eu quero agendar auditorias diretamente no sistema,
Para coordenar visitas técnicas com as empresas.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP | **Status**: ✅ Backend Completo (Nov 2025)

**Acceptance Criteria**:
- [x] **Criar agendamento** com tipo, data, hora e local
- [x] **Tipos de auditoria**: Estágio 1, Estágio 2, Vigilância, Especial
- [x] **Local**: Presencial (com endereço) ou Remota
- [x] **Observações do auditor**
- [x] **Rastrear status**: Agendado, Em Andamento, Concluído, Cancelado
- [x] **Registrar resultados**: Aprovado, Aprovado Condicional, Reprovado
- [x] **Conformidades e não-conformidades**
- [ ] **Integração com calendário** (futuro)
- [ ] **Notificações** para empresa e auditor (futuro)

**Implementação**:
- **Backend**: `Audit` model + API em `/api/audits`
- **Frontend**: `AuditScheduleModal` component
- **Database**: Tabela `audits` com localização e resultados
- **Funcionalidades**:
  - Criar auditorias com todas as informações
  - Visualizar auditorias por processo
  - Completar auditoria com resultados e findings
  - Cancelar auditorias com motivo
  - Buscar auditorias agendadas próximas
  - Estatísticas de auditorias

**Pendente para US-026 e US-027**:
- Algoritmo de matching de auditores
- Interface de agendamento colaborativo com empresa
- Notificações automáticas

---

#### **US-024: Assistência IA para Análise Documental**
```
Como analista,
Eu quero IA que analise documentos automaticamente,
Para identificar gaps rapidamente.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **IA analisa PDFs** com OCR + NLP
- [ ] **Identifica automaticamente**: Validades, CNPJs, licenças
- [ ] **Alerta** se documento vencido ou ilegível
- [ ] **Extrai** lista de produtos, ingredientes, fornecedores
- [ ] **Compara** com solicitação (detecta inconsistências)
- [ ] **Gera resumo** executivo para analista

---

### 📅 Feature 3.4: Calendário Inteligente de Auditorias 🚀 INOVAÇÃO #4

#### **US-025: Cadastro Completo de Auditores**
```
Como coordenador,
Eu quero cadastrar auditores com especialização e disponibilidade,
Para sistema sugerir matches inteligentes.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Cadastro contém**: Nome, e-mail, telefone, localização base
- [ ] **Especialização**: Alimentos, Laticínios, Cárneos, Farmacêuticos, Químicos, Cosméticos
- [ ] **Idiomas** falados
- [ ] **Disponibilidade padrão**: Dias da semana, horários
- [ ] **Status**: Ativo / Inativo / Férias
- [ ] **Histórico** de auditorias realizadas

---

#### **US-026: Algoritmo de Matching Inteligente**
```
Como analista,
Eu quero que sistema sugira melhores auditores para cada caso,
Para otimizar agendamento.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Algoritmo considera**:
  - Disponibilidade em tempo real
  - Especialização × Tipo de empresa
  - Distância geográfica (Google Maps API)
  - Carga de trabalho atual
  - Histórico (evita sempre mesmo auditor)
  - Idiomas (se empresa não fala português)
- [ ] **Sistema sugere top 3 auditores** com score e justificativa
- [ ] **Analista seleciona** e sistema agenda
- [ ] **Impossível** agendar conflitos (validação backend)

**RN-045**: Auditor não pode ter >5 auditorias/semana
**RN-046**: Distância >500km exige aprovação coordenador

---

#### **US-027: Interface de Agendamento Colaborativo**
```
Como analista,
Eu quero propor datas e empresa confirmar,
Para garantir que empresa está preparada.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Analista propõe**: 3 datas alternativas + horário + auditor
- [ ] **Empresa recebe notificação** com opções
- [ ] **Empresa pode**: Aceitar ou propor data alternativa
- [ ] **Sistema valida** se auditor continua disponível na nova data
- [ ] **Após confirmação**: Auditoria agendada, empresa e auditor notificados
- [ ] **Botão** "Adicionar ao Google Calendar" para empresa

---

#### **US-028: Calendário Visual de Auditorias (Coordenador)**
```
Como coordenador,
Eu quero visualizar calendário de todos os 22 auditores,
Para ter visão geral e detectar conflitos.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Visualização mensal** estilo Google Calendar
- [ ] **Linha por auditor** (22 linhas)
- [ ] **Cores** por status: Agendada, Confirmada, Em Execução, Concluída
- [ ] **Clique** em evento abre detalhes
- [ ] **Filtros**: Por auditor, por região, por tipo
- [ ] **Exportação** para Excel/PDF

---

#### **US-029: Briefing Automático do Auditor**
```
Como auditor,
Eu quero receber briefing completo antes da auditoria,
Para chegar preparado.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **E-mail automático** 3 dias antes com:
  - Dados da empresa e contatos
  - Endereço e navegação GPS
  - Escopo da certificação
  - Documentos já analisados (Estágio 1)
  - Relatório de IA (se disponível)
  - Checklist de auditoria pré-gerado
  - Histórico de auditorias anteriores

---

## ✅ ÉPICO 3 COMPLETO
