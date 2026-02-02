# HalalSphere - UX Design Guide v1.0

**Versão**: 1.0
**Data**: 13 de Novembro de 2025
**Status**: Draft
**Proprietário**: Equipe de Produto

---

## 📋 Índice

1. [Design System](#1-design-system)
2. [Layouts por Persona](#2-layouts-por-persona)
3. [Soluções para Alto Volume](#3-soluções-para-alto-volume)
4. [Jornada do Cliente - Wizard com IA](#4-jornada-do-cliente---wizard-com-ia)
5. [Componentes e Padrões](#5-componentes-e-padrões)
6. [Acessibilidade e i18n](#6-acessibilidade-e-i18n)
7. [Wireframes e Protótipos](#7-wireframes-e-protótipos)

---

## 1. Design System

### 1.1 Paleta de Cores - Tema Autoridade Clássica ⭐

**Tema escolhido**: Autoridade Clássica
**Justificativa**: Mantém identidade Halal original, transmite seriedade institucional necessária para certificação religiosa, e o dourado premium reforça qualidade.

```css
:root {
  /* Primary Colors */
  --primary: #2D5016;           /* Verde Halal tradicional */
  --primary-dark: #1E4620;      /* Hover/Active states */
  --primary-light: #3D6A1E;     /* Backgrounds sutis */

  /* Secondary Colors */
  --secondary: #D4AF37;         /* Dourado premium */
  --secondary-dark: #B8933D;    /* Hover states */
  --secondary-light: #E8C468;   /* Highlights */

  /* Semantic Colors */
  --success: #10B981;           /* Verde sucesso (Tailwind) */
  --warning: #F59E0B;           /* Laranja alerta */
  --error: #EF4444;             /* Vermelho erro */
  --info: #3B82F6;              /* Azul informação */

  /* Neutrals */
  --bg-white: #FFFFFF;
  --bg-gray: #F8F9FA;
  --bg-gray-dark: #F3F4F6;
  --border: #E5E7EB;
  --border-dark: #D1D5DB;

  /* Text */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  --text-disabled: #D1D5DB;
}
```

**Status Badges**:
```css
.status-pending {
  background: #E0E7FF;
  color: #3730A3;
}

.status-warning {
  background: #FEF3C7;
  color: #92400E;
}

.status-success {
  background: #D1FAE5;
  color: #065F46;
}

.status-error {
  background: #FEE2E2;
  color: #991B1B;
}
```

---

### 1.2 Tipografia

**Fonte Principal**: Inter (Google Fonts)
**Fallbacks**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

**Scale**:
```css
/* Headings */
--text-4xl: 36px;   /* Page titles */
--text-3xl: 28px;   /* Section headers */
--text-2xl: 24px;   /* Card headers */
--text-xl: 20px;    /* Sub-headers */
--text-lg: 18px;    /* Large body */

/* Body */
--text-base: 16px;  /* Base body text */
--text-sm: 14px;    /* Secondary text */
--text-xs: 12px;    /* Captions, labels */
--text-2xs: 11px;   /* Tiny text (table headers) */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

**Monospace** (para protocolos, códigos):
```css
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

---

### 1.3 Spacing System

Baseado em múltiplos de 4px (Tailwind-like):

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

### 1.4 Border Radius

```css
--radius-sm: 4px;    /* Small elements */
--radius-md: 6px;    /* Buttons, inputs */
--radius-lg: 8px;    /* Cards */
--radius-xl: 12px;   /* Large cards */
--radius-full: 9999px; /* Pills, avatars */
```

---

### 1.5 Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 10px 15px rgba(0, 0, 0, 0.15);
```

---

## 2. Layouts por Persona

### 2.1 Para Empresas (Clientes) - Direção 3: Card Modern ⭐

**Contexto**: Empresas solicitantes, primeira interação com o sistema.

**Características**:
- ✅ Cards visuais grandes com ícones
- ✅ Linguagem simples e não-técnica
- ✅ Wizard guiado passo-a-passo
- ✅ Chat com IA embarcado
- ✅ Mobile-first (60% acessam via celular)

**Layout**:
```
┌─────────────────────────────────────┐
│  Header: Logo + Status + Perfil     │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Card 1   │  │ Card 2   │        │
│  │ 📄 Nova  │  │ 📋 Minhas│        │
│  │ Solicit. │  │ Solicit. │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Card 3   │  │ Card 4   │        │
│  └──────────┘  └──────────┘        │
│                                     │
└─────────────────────────────────────┘
```

**Referência**: [ux-journey-wizard-ai.html](./ux-journey-wizard-ai.html)

---

### 2.2 Para Analistas - Direção 8: Kanban View ⭐

**Contexto**: Analistas gerenciando 600-700 processos simultâneos.

**Características**:
- ✅ Kanban com drag-and-drop
- ✅ Sidebar colapsável (maximiza espaço horizontal)
- ✅ Limite de 5 cards por coluna + "Carregar mais"
- ✅ Filtros: "Minhas Solicitações" (reduz 600 para ~47)
- ✅ Priorização visual (bolinha vermelha/amarela)

**Layout**:
```
┌─┬────────────────────────────────────────┐
│S│  Filtros: [Minhas] [Status] [Prior.]  │
│I├────────────────────────────────────────┤
│D│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐   │
│E│ │Col1│ │Col2│ │Col3│ │Col4│ │Col5│   │
│B│ │ 12 │ │  8 │ │ 23 │ │ 15 │ │ 18 │   │
│A│ ├────┤ ├────┤ ├────┤ ├────┤ ├────┤   │
│R│ │Card│ │Card│ │Card│ │Card│ │Card│   │
│ │ │Card│ │Card│ │Card│ │Card│ │Card│   │
│ │ │Card│ │Card│ │Card│ │    │ │    │   │
│ │ │    │ │    │ │+Mais│ │+Mais│ │+Mais│  │
└─┴────────────────────────────────────────┘
```

**Referência**: [ux-design-directions-v2.html](./ux-design-directions-v2.html) - Direção 8

---

### 2.3 Para Auditores - Direção 1: Sidebar Dense

**Contexto**: Auditores em campo, precisam de densidade de informação.

**Características**:
- ✅ Sidebar fixa com navegação sempre visível
- ✅ Tabelas densas (muitas linhas visíveis)
- ✅ Modo offline completo
- ✅ App mobile otimizado para campo

**Layout**:
```
┌──────┬───────────────────────────────┐
│      │ Top Bar: Título + Usuário     │
│ S    ├───────────────────────────────┤
│ I    │ Métricas: [47] [12] [8] [27] │
│ D    ├───────────────────────────────┤
│ E    │ ┌─────────────────────────┐  │
│ B    │ │ Tabela de Auditorias    │  │
│ A    │ │ Protocolo | Empresa | ... │  │
│ R    │ │ HAL-001   | XYZ     | ... │  │
│      │ │ HAL-002   | ABC     | ... │  │
│      │ │ ...                      │  │
│      │ └─────────────────────────┘  │
└──────┴───────────────────────────────┘
```

**Referência**: [ux-design-directions-v2.html](./ux-design-directions-v2.html) - Direção 1

---

### 2.4 Para Gestores - Direção 9: Executive Dashboard

**Contexto**: Gestores precisam de overview estratégico, não detalhes operacionais.

**Características**:
- ✅ Métricas visuais grandes (KPIs)
- ✅ Gráficos e charts (menos tabelas)
- ✅ Insights de IA destacados
- ✅ Filtros de período (30d, 90d, 1 ano)

**Layout**:
```
┌─────────────────────────────────────────┐
│ Top Nav: [Dashboard] [Relatórios] ...  │
├─────────────────────────────────────────┤
│ KPIs:  [167] [89%] [4.2d] [23] [R$2.4M]│
├─────────────────────────────────────────┤
│ ┌──────────────────┐ ┌──────────────┐  │
│ │ Gráfico Funil    │ │ Pizza Tipos  │  │
│ │ (12 fases)       │ │ (C1/C2/C3)   │  │
│ └──────────────────┘ └──────────────┘  │
│ ┌──────────────────┐ ┌──────────────┐  │
│ │ Linha Evolução   │ │ Barra Por    │  │
│ │ (6 meses)        │ │ Analista     │  │
│ └──────────────────┘ └──────────────┘  │
│ ⚠️ Alertas: 12 solicitações atrasadas  │
└─────────────────────────────────────────┘
```

**Referência**: [ux-design-directions-v2.html](./ux-design-directions-v2.html) - Direção 9

---

## 3. Soluções para Alto Volume

### Problema

Com **600-700 empresas certificadas simultaneamente** e **22 auditores** processando múltiplas solicitações:
- ❌ Kanban com 50+ cards por coluna = scroll infinito
- ❌ Tabelas com centenas de linhas = impossível encontrar
- ❌ Dashboards sobrecarregados = paralisia por informação

### 3.1 Solução Implementada: Kanban Limitado + Lazy Loading ⭐

**Características**:
- ✅ **Limite de 5 cards** visíveis por coluna
- ✅ Botão **"Carregar mais X solicitações"** sob demanda
- ✅ **Contador** no header da coluna mostra total (ex: "Revisão Inicial 12")
- ✅ **Filtro padrão**: "Minhas Solicitações" (reduz 600 para ~47)
- ✅ **Priorização visual**: Destacar apenas urgências (bolinha vermelha)

**Mockup**:
```
┌─────────────────────────────────────────┐
│ Filtro: [Minhas Solicitações ▼] [Alta/Média Prioridade ▼] │
├─────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐        │
│ │ Revisão (12)│ │ Proposta (8)│        │
│ ├─────────────┤ ├─────────────┤        │
│ │ ⚠️ Card 1   │ │ Card 1      │        │
│ │ ⚠️ Card 2   │ │ Card 2      │        │
│ │ Card 3      │ │ Card 3      │        │
│ │ Card 4      │ │             │        │
│ │ Card 5      │ │             │        │
│ ├─────────────┤ ├─────────────┤        │
│ │ + Carregar  │ │ + Carregar  │        │
│ │ mais 7      │ │ mais 5      │        │
│ └─────────────┘ └─────────────┘        │
└─────────────────────────────────────────┘
```

**Referência**: [ux-design-high-volume-solutions.html](./ux-design-high-volume-solutions.html) - Solução 2

---

### 3.2 Filtros Inteligentes

**Barra de Filtros** (sempre visível no topo):

```
┌─────────────────────────────────────────┐
│ 🔍 [Protocolo, empresa, CNPJ...]        │
│                                         │
│ Status: [Para Revisar (12) ▼]          │
│ Analista: [Minhas Solicitações ▼]      │
│ Prioridade: [Alta (8) ▼]               │
│                                         │
│ Filtros ativos:                         │
│ [Status: Para Revisar ×]                │
│ [Analista: João Silva ×]                │
└─────────────────────────────────────────┘
```

**Comportamento**:
- **Busca rápida**: Começa a filtrar após 3 caracteres digitados
- **Contadores**: Mostram quantos itens em cada opção (ex: "Alta (8)")
- **Filtros ativos**: Badges visuais, clicáveis para remover
- **Persistência**: Salva última configuração de filtros do usuário

---

### 3.3 Agrupamento Inteligente (Alternativa)

Para views de tabela, oferecer agrupamento:

```
┌─────────────────────────────────────────┐
│ Agrupar por: [Analista Responsável ▼]  │
├─────────────────────────────────────────┤
│ ▼ João Silva (Eu) [47 solicitações]    │
│   ┌─────────────────────────────────┐  │
│   │ HAL-001234 | XYZ Alimentos | ... │  │
│   │ HAL-001230 | ABC Pharma   | ... │  │
│   │ Mostrar todas as 47 →           │  │
│   └─────────────────────────────────┘  │
│                                         │
│ ▶ Maria Santos [32 solicitações]       │
│ ▶ Pedro Costa [28 solicitações]        │
│ ▶ Ana Silva [25 solicitações]          │
│ ▶ Não Atribuídas [35 solicitações] ⚠️  │
└─────────────────────────────────────────┘
```

**Opções de agrupamento**:
- Por Analista Responsável
- Por Status (Fase)
- Por Data (Hoje / Esta semana / Antigas)
- Por Prioridade (Alta / Média / Baixa)
- Sem agrupamento

---

## 4. Jornada do Cliente - Wizard com IA

### 4.1 Visão Geral

**Objetivo**: Solicitação de certificação completa em **12min** (vs. 45min atual)
**Taxa de conclusão alvo**: **85%** (vs. 50% atual)
**Solicitações completas**: **95%** na primeira tentativa (vs. 60%)

**Inovação**: Wizard de 9 etapas com **IA conversacional embarcada** + toggle para formulário direto.

---

### 4.2 Estrutura do Wizard

#### **Layout Geral**

```
┌────────────────────────────────────────────────┐
│ Header: Nova Solicitação de Certificação Halal│
├──────────┬─────────────────────────────────────┤
│          │                                     │
│ Sidebar  │  Conteúdo da Etapa                 │
│          │                                     │
│ Progresso│  [Toggle: Chat IA ↔️ Formulário]   │
│ 🟢 1. Tipo│                                     │
│ ⚪ 2. Prod│  [Área de Chat ou Form]            │
│ ⚪ 3. Forn│                                     │
│ ⚪ 4. Cap │                                     │
│ ⚪ 5. Docs│                                     │
│ ⚪ 6. Rev │                                     │
│          │                                     │
│          │  [← Voltar]  [Próxima Etapa →]     │
└──────────┴─────────────────────────────────────┘
```

---

### 4.3 Etapas Detalhadas

#### **Etapa 1: Tipo de Certificação**

**Modo Chat**:
```
IA: "Olá! 👋 Que tipo de produto sua empresa fabrica?"
Usuário: "Fabricamos biscoitos, bolos e massas"
IA: "Perfeito! Produtos de panificação. Seus produtos
     contêm ingredientes de origem animal? (ovos, leite...)"
Usuário: "Sim, usamos ovos e leite"
IA: "Entendido! A certificação correta é:
     ✅ C3 - Produtos de Origem Mista
     Já preenchi isso para você!"
```

**Modo Formulário Direto**:
- 6 cards clicáveis (C1-C6)
- Hover mostra exemplos de produtos
- Seleção única

**Auto-fill**: Campo `certificationType` = "C3"

---

#### **Etapa 2: Produtos e Matérias-Primas**

**Modo Chat**:
```
IA: "Quais produtos específicos você quer certificar?"
Usuário: "Biscoito de chocolate, bolo de cenoura, massa de pizza"
IA: [Extrai lista estruturada]
    "Entendi! E quais as principais matérias-primas?"
Usuário: "Farinha, ovos, leite, chocolate, cenoura, tomate"
IA: [Identifica origem automaticamente]
    "✅ Produtos cadastrados:
     - Biscoito de chocolate (misto)
     - Bolo de cenoura (misto)
     - Massa de pizza (misto)"
```

**Modo Formulário**:
- Tabela dinâmica: "Adicionar Produto"
- Campos: Nome, Matérias-primas (textarea), Origem (dropdown)

**Auto-fill**:
```json
{
  "products": [
    {"name": "Biscoito de chocolate", "origin": "misto"},
    {"name": "Bolo de cenoura", "origin": "misto"},
    {"name": "Massa de pizza", "origin": "misto"}
  ]
}
```

---

#### **Etapa 3: Fornecedores**

**Modo Chat**:
```
IA: "De quem vocês compram as matérias-primas principais?"
Usuário: "Compramos farinha da Moinho ABC e ovos da Granja XYZ"
IA: [Extrai fornecedores]
    "Esses fornecedores têm certificação Halal?"
Usuário: "O Moinho sim, a Granja não"
IA: "✅ Fornecedores cadastrados:
     - Moinho ABC (farinha) - Certificado ✓
     - Granja XYZ (ovos) - Não certificado ⚠️"
```

**Modo Formulário**:
- Formulário repetível: "Adicionar Fornecedor"
- Campos: Nome, CNPJ, Produto fornecido, Certificação Halal? (sim/não)

**Auto-fill**: Array de fornecedores estruturado

---

#### **Etapa 4: Capacidade Produtiva**

**Modo Chat**:
```
IA: "Quantos turnos de produção vocês operam?"
Usuário: "2 turnos"
IA: "E quantas toneladas produzem por hora?"
Usuário: "5 toneladas"
IA: "Vocês já têm outras certificações de qualidade?"
Usuário: "Sim, ANVISA e ISO 9001"
IA: "✅ Capacidade registrada:
     - 2 turnos
     - 5 ton/hora
     - Certificações: ANVISA, ISO 9001"
```

**Modo Formulário**:
- Select: Turnos (1/2/3)
- Input numérico: Toneladas/hora
- Checkboxes: Certificações existentes

---

#### **Etapa 5: Documentos Obrigatórios**

**Modo Chat**:
```
IA: "Agora preciso que você envie alguns documentos:
     📄 Licença de funcionamento (ANVISA)
     📄 Contrato social ou CNPJ
     📄 Lista de fornecedores
     📄 Manual de procedimentos Halal

     Você pode arrastar os arquivos aqui ou clicar para upload."

[Usuário arrasta arquivo]

IA: "✅ Licença de funcionamento recebida!
     ✅ Formato: PDF ✓
     ✅ Tamanho: 2.3 MB ✓

     Ainda falta: Contrato social, Lista de fornecedores..."
```

**Modo Formulário**:
- Lista de documentos obrigatórios (checkboxes)
- Área de drag-and-drop para cada
- Preview de arquivos enviados
- Validação: formato (PDF/JPG/PNG) e tamanho (max 50MB)

---

#### **Etapa 6: Revisão Final**

**Tela de Revisão**:
```
┌─────────────────────────────────────────┐
│ Revise suas Informações                │
├─────────────────────────────────────────┤
│ ▼ 1. Tipo de Certificação      [Editar]│
│   C3 - Produtos de Origem Mista        │
│                                         │
│ ▼ 2. Produtos (3)               [Editar]│
│   • Biscoito de chocolate              │
│   • Bolo de cenoura                    │
│   • Massa de pizza                     │
│                                         │
│ ▼ 3. Fornecedores (2)           [Editar]│
│   • Moinho ABC (certificado ✓)        │
│   • Granja XYZ (não certificado ⚠️)    │
│                                         │
│ ▼ 4. Capacidade Produtiva       [Editar]│
│   2 turnos, 5 ton/hora                 │
│                                         │
│ ▼ 5. Documentos (4/4)           [Editar]│
│   ✅ Todos os documentos enviados      │
│                                         │
│ ☐ Confirmo que as informações estão   │
│   corretas e completas                 │
│                                         │
│ [📄 Preview PDF]  [✅ Enviar Solicitação]│
└─────────────────────────────────────────┘
```

**Após enviar**:
```
┌─────────────────────────────────────────┐
│         ✅ Sucesso!                     │
│                                         │
│  Solicitação Enviada com Sucesso!      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Número do Protocolo             │ │
│  │   HAL-2025-001234                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Você receberá email em:               │
│  eric@empresa.com                      │
│                                         │
│  Tempo estimado: 2-3 dias úteis        │
│                                         │
│  [Ver Minha Solicitação] [Dashboard]   │
└─────────────────────────────────────────┘
```

---

### 4.4 Funcionalidades Inteligentes

**Auto-save**:
- Salva a cada campo preenchido
- Permite fechar navegador e voltar depois
- Indicador visual: "Salvo automaticamente às 14:32"

**Validação em Tempo Real**:
- CNPJ inválido → IA avisa imediatamente
- Campo obrigatório vazio → Não permite avançar
- Arquivo muito grande → Aviso antes de upload

**Modo Híbrido**:
- Pode começar no chat, trocar para formulário
- Dados preenchidos pela IA aparecem no formulário
- Vice-versa: formulário → chat continua contexto

**Escalação para Humano**:
- Botão "Falar com Analista" sempre visível
- Cria ticket de suporte com contexto da etapa atual

**Multilíngue**:
- IA detecta idioma da primeira mensagem
- Responde em PT/EN/AR/TR conforme detectado

---

## 5. Componentes e Padrões

### 5.1 Botões

**Tamanhos**:
```css
/* Small */
.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

/* Medium (padrão) */
.btn {
  padding: 10px 20px;
  font-size: 14px;
}

/* Large */
.btn-lg {
  padding: 12px 24px;
  font-size: 16px;
}
```

**Variantes**:
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-danger">Danger</button>
```

**Estados**:
- `:hover` - Escurece 10%
- `:active` - Escurece 20% + scale(0.98)
- `:disabled` - Opacity 50% + cursor not-allowed
- `:loading` - Spinner + texto "Carregando..."

---

### 5.2 Form Inputs

**Text Input**:
```html
<div class="form-group">
  <label class="form-label required">CNPJ da Empresa</label>
  <input type="text" class="form-input" placeholder="00.000.000/0000-00">
  <span class="form-hint">Apenas números</span>
</div>
```

**Select**:
```html
<select class="form-select">
  <option>Selecione...</option>
  <option>Opção 1</option>
</select>
```

**Textarea**:
```html
<textarea class="form-textarea" rows="4"></textarea>
```

**Validação**:
```html
<!-- Sucesso -->
<input class="form-input is-valid">
<span class="form-success">✓ CNPJ válido</span>

<!-- Erro -->
<input class="form-input is-invalid">
<span class="form-error">⚠️ CNPJ inválido</span>
```

---

### 5.3 Cards

**Card Padrão**:
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título do Card</h3>
  </div>
  <div class="card-body">
    Conteúdo...
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Ação</button>
  </div>
</div>
```

**Card Clicável** (para seleção):
```html
<div class="card card-selectable">
  <!-- Adiciona border highlight no hover -->
</div>

<div class="card card-selectable is-selected">
  <!-- Adiciona background verde claro -->
</div>
```

---

### 5.4 Status Badges

```html
<span class="badge badge-pending">Pendente</span>
<span class="badge badge-warning">Revisão</span>
<span class="badge badge-success">Aprovado</span>
<span class="badge badge-error">Rejeitado</span>
<span class="badge badge-info">Em Auditoria</span>
```

---

### 5.5 Tabelas

**Tabela Compacta** (para alto volume):
```html
<table class="table table-compact">
  <thead>
    <tr>
      <th>Protocolo</th>
      <th>Empresa</th>
      <th>Status</th>
      <th>Data</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="font-mono">HAL-2025-001234</td>
      <td>XYZ Alimentos</td>
      <td><span class="badge badge-warning">Revisão</span></td>
      <td>10/11/2025</td>
      <td><a href="#">Revisar →</a></td>
    </tr>
  </tbody>
</table>
```

**Comportamento**:
- Hover em linha: Background cinza claro
- Linha clicável: Cursor pointer + transição suave
- Zebra striping: Opcional, ativar com `.table-striped`

---

### 5.6 Kanban Cards

```html
<div class="kanban-card">
  <div class="kanban-card-protocol">HAL-2025-001234</div>
  <div class="kanban-card-company">XYZ Alimentos Ltda</div>
  <div class="kanban-card-type">C1 - Alimentos</div>
  <div class="kanban-card-footer">
    <div class="avatar">JS</div>
    <span class="kanban-card-date">Há 3 dias</span>
  </div>
</div>
```

**Priorização Visual**:
```html
<div class="kanban-card priority-high">
  <!-- Border-left vermelho -->
</div>

<div class="kanban-card priority-medium">
  <!-- Border-left amarelo -->
</div>
```

---

### 5.7 Chat Messages

**Mensagem da IA**:
```html
<div class="chat-message ai">
  <div class="message-avatar">AI</div>
  <div class="message-content">
    <div class="message-bubble">
      Olá! Como posso ajudar?
    </div>
    <div class="message-timestamp">10:23</div>
  </div>
</div>
```

**Mensagem do Usuário**:
```html
<div class="chat-message user">
  <div class="message-avatar">EU</div>
  <div class="message-content">
    <div class="message-bubble">
      Preciso de certificação
    </div>
    <div class="message-timestamp">10:24</div>
  </div>
</div>
```

**Auto-filled Badge**:
```html
<div class="auto-filled-badge">
  ✓ Categoria identificada
</div>
```

---

## 6. Acessibilidade e i18n

### 6.1 Acessibilidade (WCAG 2.1 AA)

**Contraste de Cores**:
- Texto principal (#111827) em fundo branco: 16:1 ✅
- Verde primário (#2D5016) em branco: 8.5:1 ✅
- Dourado secundário (#D4AF37) em branco: 3.2:1 ⚠️ (usar apenas para destaques, não texto)

**Navegação por Teclado**:
- ✅ Todos os botões e links navegáveis com Tab
- ✅ Focus ring visível (outline 3px verde)
- ✅ Esc fecha modais
- ✅ Enter/Space ativam botões

**Screen Readers**:
- ✅ `aria-label` em ícones sem texto
- ✅ `role="status"` para notificações
- ✅ `aria-live="polite"` para atualizações dinâmicas
- ✅ Landmarks HTML5: `<nav>`, `<main>`, `<aside>`

**Formulários**:
- ✅ Labels associados com `for="id"`
- ✅ Mensagens de erro com `aria-describedby`
- ✅ Required fields com `required` + `aria-required="true"`

---

### 6.2 Internacionalização (i18n)

**Idiomas Suportados**:
- 🇧🇷 Português (pt-BR) - padrão
- 🇬🇧 Inglês (en-US)
- 🇸🇦 Árabe (ar-SA) - **RTL layout**
- 🇹🇷 Turco (tr-TR)

**RTL (Right-to-Left) para Árabe**:
```html
<html dir="rtl" lang="ar">
```

**Ajustes CSS para RTL**:
```css
[dir="rtl"] .sidebar {
  right: 0;
  left: auto;
}

[dir="rtl"] .text-align-left {
  text-align: right;
}

[dir="rtl"] .margin-left-4 {
  margin-left: 0;
  margin-right: 1rem;
}
```

**Formatação Localizada**:
```javascript
// Datas
pt-BR: "13/11/2025"
en-US: "11/13/2025"
ar-SA: "٢٠٢٥/١١/١٣"

// Números
pt-BR: "1.234,56"
en-US: "1,234.56"
ar-SA: "١٬٢٣٤٫٥٦"

// Moeda
pt-BR: "R$ 2.400,00"
en-US: "$2,400.00"
ar-SA: "٢٬٤٠٠٫٠٠ ر.س"
tr-TR: "₺2.400,00"
```

---

## 7. Wireframes e Protótipos

### 7.1 Arquivos de Referência

Todos os wireframes interativos estão disponíveis na pasta `/docs`:

1. **[ux-color-themes.html](./ux-color-themes.html)**
   - 4 temas de cor comparáveis
   - Demonstração de componentes (botões, badges, cards, forms)
   - Ferramenta de seleção de tema

2. **[ux-design-directions-v2.html](./ux-design-directions-v2.html)**
   - 9 direções de layout completas
   - Navegação interativa (setas ou teclado)
   - Comparação lado-a-lado

3. **[ux-design-high-volume-solutions.html](./ux-design-high-volume-solutions.html)**
   - 3 soluções para alto volume
   - Mockups de filtros, kanban limitado, agrupamento
   - Comparação de pros/contras

4. **[ux-journey-wizard-ai.html](./ux-journey-wizard-ai.html)**
   - Wizard completo de 9 etapas
   - Chat com IA embarcado
   - Tela de sucesso final

### 7.2 Como Usar

**Para Designers**:
1. Abra os arquivos HTML em um navegador
2. Use como base para criar protótipos de alta fidelidade no Figma/Sketch
3. Extraia CSS e componentes para design system

**Para Desenvolvedores**:
1. HTML/CSS já está pronto para uso
2. Integre com framework (React, Vue, Next.js)
3. Componentes são stateless e reutilizáveis

**Para PMs/Stakeholders**:
1. Use para validar fluxos e jornadas
2. Compartilhe links dos HTMLs para feedback
3. Apresente em demos e reuniões de alinhamento

---

### 7.3 Próximos Passos

**Fase 1: Design System** (Sprint 1-2)
- [ ] Criar biblioteca de componentes no Figma
- [ ] Documentar todos os componentes no Storybook
- [ ] Criar tokens de design (cores, espaçamentos)

**Fase 2: Protótipos Interativos** (Sprint 3-4)
- [ ] Protótipo clicável da jornada do cliente (9 etapas)
- [ ] Protótipo do dashboard do analista (Kanban)
- [ ] Protótipo do app mobile do auditor

**Fase 3: Testes de Usabilidade** (Sprint 5)
- [ ] Testar wizard com 5 empresas reais
- [ ] Testar dashboard com 3 analistas
- [ ] Coletar feedback e iterar

---

## 📊 Métricas de Sucesso de UX

### Objetivos Mensuráveis

**Jornada do Cliente (Wizard)**:
- ✅ Taxa de conclusão: **85%** (vs. 50% atual)
- ✅ Tempo médio: **12min** (vs. 45min atual)
- ✅ Solicitações completas: **95%** na 1ª tentativa (vs. 60%)
- ✅ Contatos reativos: **-70%** (menos "o que falta?")

**Dashboard do Analista**:
- ✅ Tempo para encontrar solicitação: **<10s** (vs. 2-3min atual)
- ✅ Processos revisados/dia: **+50%** (mais produtividade)
- ✅ Erros de atribuição: **-80%** (drag-and-drop visual)

**Satisfação Geral**:
- ✅ NPS (Net Promoter Score): **> 70**
- ✅ CSAT (Customer Satisfaction): **> 4.5/5**
- ✅ SUS (System Usability Scale): **> 80**

---

## 📝 Referências

- [Material Design 3](https://m3.material.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Nielsen Norman Group - UX Best Practices](https://www.nngroup.com/)

---

**Última atualização**: 13/11/2025
**Autor**: Equipe de Produto HalalSphere
**Revisores**: [A definir]
**Aprovação**: [Pendente]
