# Product Requirements Document (PRD): HalalSphere
**Sistema Inteligente de Gestão de Certificação Halal com IA**

---

## Document Control

| Campo | Valor |
|-------|-------|
| **Versão** | 1.0 |
| **Data** | 12 de Novembro de 2025 |
| **Autor** | Product Manager - HalalSphere Team |
| **Baseado em** | Project Brief HalalSphere v1.0 (Aprovado) |
| **Status** | Draft - Em Revisão |
| **Aprovadores** | Diretoria Executiva, Gerência de Certificação, Tech Lead |

---

## Índice

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Objetivos e Métricas de Sucesso](#2-objetivos-e-métricas-de-sucesso)
3. [Personas e Jornadas](#3-personas-e-jornadas)
4. [Arquitetura de Features (Épicos)](#4-arquitetura-de-features-épicos)
5. [User Stories Detalhadas](#5-user-stories-detalhadas)
6. [Roadmap e Faseamento](#6-roadmap-e-faseamento)
7. [Requisitos Não-Funcionais](#7-requisitos-não-funcionais)
8. [Dependências e Riscos](#8-dependências-e-riscos)
9. [Acceptance Criteria Globais](#9-acceptance-criteria-globais)

---

## 1. Visão Geral do Produto

### 1.1 Problema que Resolvemos

O processo de certificação Halal atual é:
- **Manual e lento**: 7-8 meses desde solicitação até emissão
- **Opaco**: Empresas não sabem status de seus processos
- **Ineficiente**: 22 auditores para 600-700 empresas gera sobrecarga
- **Propenso a erros**: Processos manuais aumentam risco de não-conformidades
- **Custoso**: Retrabalho, comunicação fragmentada, perda de clientes por demora

### 1.2 Solução Proposta

**HalalSphere** é uma plataforma SaaS que:
- Automatiza o ciclo completo de certificação conforme **PR 7.1 Rev 21**
- Integra 5 stakeholders: Empresas, Analistas, Auditores, Comitê, Gestão
- Fornece visibilidade em tempo real
- Aplica IA em 6 pontos críticos do processo
- Reduz tempo de certificação em 60% (7-8 meses → 2-3 meses)

### 1.3 Diferenciais Competitivos (Inovações Tecnológicas)

1. **Calculadora Inteligente de Custos**: Proposta comercial em segundos
2. **IA de Análise Pré-Auditoria**: Reduz tempo de auditoria em 30-40%
3. **Contratos Colaborativos por Cláusulas**: Fechamento 4x mais rápido
4. **Calendário Inteligente**: Zero conflitos, otimização de rotas
5. **Chatbot Multilíngue Especializado**: 60-70% de dúvidas auto-resolvidas
6. **Workflow Automatizado**: 12 fases rastreáveis em tempo real

### 1.4 Escopo do MVP

**MVP cobre**: Ciclo completo de certificação inicial (primeira certificação)

**Incluído no MVP**:
- ✅ Solicitação e análise preliminar (PR 7.1 seções 10.1, 10.2)
- ✅ Proposta comercial e contrato (10.3)
- ✅ Análise documental - Estágio 1 (10.6)
- ✅ Auditoria presencial - Estágio 2 (10.7)
- ✅ Gestão de não-conformidades (10.7.7)
- ✅ Decisão do comitê (10.9)
- ✅ Emissão de certificado digital (10.9)

**Fora do MVP** (Post-MVP):
- ❌ Auditorias de manutenção anual (10.10)
- ❌ Renovação trienal (13)
- ❌ Extensão de escopo (10.9.3)
- ❌ Testes laboratoriais (10.8)
- ❌ Suspensão/Cancelamento/Término (11, 12, 14)

---

## 2. Objetivos e Métricas de Sucesso

### 2.1 Objetivos de Negócio (OKRs)

#### OKR 1: Reduzir Tempo de Certificação
- **KR1**: Tempo médio cai de 7-8 meses para 3 meses (Ano 1)
- **KR2**: Tempo médio cai para 2 meses (Ano 2)
- **KR3**: 90% das certificações dentro do prazo estimado

#### OKR 2: Aumentar Capacidade Operacional
- **KR1**: Processar 40% mais solicitações com mesma equipe (Ano 1)
- **KR2**: Cada analista gerencia 60 processos simultâneos (vs 40-50)
- **KR3**: Reduzir tempo de análise documental em 50%

#### OKR 3: Melhorar Conformidade
- **KR1**: 95% de aderência ao PR 7.1
- **KR2**: Zero não-conformidades em auditorias GAC
- **KR3**: 100% de rastreabilidade de decisões

#### OKR 4: Aumentar Satisfação
- **KR1**: NPS 50+ entre empresas certificadas
- **KR2**: 85% avaliam processo como "excelente" ou "bom"
- **KR3**: Taxa de renovação de 95%

### 2.2 Métricas de Produto (KPIs)

| Categoria | Métrica | Meta MVP | Meta Ano 1 |
|-----------|---------|----------|------------|
| **Eficiência** | Tempo médio de análise documental | 7 dias | 5 dias |
| **Eficiência** | Tempo médio de agendamento de auditoria | 14 dias | 10 dias |
| **Eficiência** | Tempo médio de decisão do comitê | 10 dias | 7 dias |
| **Qualidade** | Taxa de re-trabalho | <8% | <5% |
| **Qualidade** | Conformidade com PR 7.1 | 90%+ | 95%+ |
| **Adoção** | Taxa de adoção (empresas) | 80% | 100% |
| **Adoção** | Taxa de uso do chatbot | 50% | 60% |
| **Satisfação** | NPS Empresas | 40+ | 50+ |
| **Satisfação** | NPS Equipe Interna | 30+ | 40+ |

---

## 3. Personas e Jornadas

### 3.1 Persona 1: Ahmad - Gerente de Qualidade (Empresa)

**Perfil**:
- Idade: 42 anos
- Empresa: Indústria alimentícia (150 funcionários)
- Objetivo: Obter certificação Halal rapidamente

**Jobs to be Done**:
1. Solicitar certificação Halal de forma simples
2. Entender quais documentos são necessários
3. Acompanhar status do processo em tempo real
4. Resolver dúvidas rapidamente
5. Tratar não-conformidades eficientemente

**Jornada no HalalSphere**:
```
1. Cadastro → 2. Solicitação → 3. Upload Docs → 4. Acompanha Proposta →
5. Assina Contrato → 6. Acompanha Auditoria → 7. Trata NCs → 8. Recebe Certificado
```

### 3.2 Persona 2: Mariana - Analista de Certificação

**Perfil**:
- Idade: 35 anos
- Experiência: 8 anos em certificação Halal
- Objetivo: Gerenciar 60 processos com eficiência

**Jobs to be Done**:
1. Revisar solicitações rapidamente
2. Gerar propostas comerciais automaticamente
3. Gerenciar contratos de forma colaborativa
4. Analisar documentação com suporte de IA
5. Coordenar agendamento de auditorias
6. Preparar casos para o comitê

**Jornada no HalalSphere**:
```
1. Revisa Solicitação → 2. Gera Proposta → 3. Gerencia Contrato →
4. Analisa Docs (Estágio 1) → 5. Agenda Auditoria → 6. Prepara Dossiê → 7. Submete ao Comitê
```

### 3.3 Persona 3: Khalil - Auditor Halal

**Perfil**:
- Idade: 48 anos
- Experiência: 15 anos em auditoria
- Objetivo: Realizar 3-5 auditorias/semana com qualidade

**Jobs to be Done**:
1. Visualizar agenda de auditorias
2. Preparar-se com documentação e IA
3. Executar auditoria com app mobile
4. Registrar não-conformidades facilmente
5. Gerar relatório automaticamente

**Jornada no HalalSphere**:
```
1. Vê Agenda → 2. Prepara com IA → 3. Executa Auditoria (Mobile) →
4. Registra NCs → 5. Gera Relatório → 6. Submete para Analista
```

### 3.4 Persona 4: Sheikh Abdullah - Membro do Comitê

**Perfil**:
- Idade: 58 anos
- Experiência: 25 anos em jurisprudência islâmica
- Objetivo: Decidir sobre certificações com rapidez e precisão

**Jobs to be Done**:
1. Visualizar casos pendentes
2. Acessar dossiê completo de forma organizada
3. Deliberar e votar digitalmente
4. Registrar justificativas com rastreabilidade

**Jornada no HalalSphere**:
```
1. Vê Casos Pendentes → 2. Revisa Dossiê Completo →
3. Delibera e Vota → 4. Registra Justificativa
```

### 3.5 Persona 5: Fernanda - Coordenadora Administrativa

**Perfil**:
- Idade: 38 anos
- Responsabilidade: Gestão operacional e financeira
- Objetivo: Ter visibilidade total e métricas para decisões

**Jobs to be Done**:
1. Visualizar dashboards executivos
2. Gerar relatórios de conformidade
3. Gerenciar usuários e permissões
4. Monitorar KPIs em tempo real

**Jornada no HalalSphere**:
```
1. Acessa Dashboards → 2. Analisa Métricas → 3. Gera Relatórios →
4. Gerencia Usuários → 5. Monitora Conformidade PR 7.1
```

---

## 4. Arquitetura de Features (Épicos)

### Estrutura Hierárquica

```
HalalSphere MVP
│
├── ÉPICO 1: Gestão de Solicitações e Onboarding
│   ├── Feature 1.1: Cadastro e Solicitação
│   ├── Feature 1.2: Dashboard de Acompanhamento
│   ├── Feature 1.3: Gestão de Documentação
│   └── Feature 1.4: Tratamento de NCs (Empresa)
│
├── ÉPICO 2: Gestão Comercial e Contratual (Inovação)
│   ├── Feature 2.1: Calculadora Inteligente de Custos
│   ├── Feature 2.2: Geração de Propostas Comerciais
│   └── Feature 2.3: Contratos Colaborativos por Cláusulas
│
├── ÉPICO 3: Análise e Preparação (Analistas)
│   ├── Feature 3.1: Painel de Controle de Processos
│   ├── Feature 3.2: Análise de Solicitação
│   ├── Feature 3.3: Análise Documental (Estágio 1) com IA
│   └── Feature 3.4: Coordenação de Auditoria Inteligente
│
├── ÉPICO 4: Execução de Auditorias (Inovação)
│   ├── Feature 4.1: Agenda de Auditorias
│   ├── Feature 4.2: Preparação com IA de Suporte
│   ├── Feature 4.3: Execução de Auditoria (App Mobile)
│   └── Feature 4.4: Relatório de Auditoria
│
├── ÉPICO 5: Decisão e Emissão de Certificados
│   ├── Feature 5.1: Painel do Comitê
│   ├── Feature 5.2: Dossiê de Certificação
│   ├── Feature 5.3: Deliberação e Votação
│   └── Feature 5.4: Emissão de Certificados Digitais
│
├── ÉPICO 6: Assistente IA Multilíngue (Inovação)
│   ├── Feature 6.1: Chatbot para Empresas (4 idiomas)
│   └── Feature 6.2: Assistente IA para Analistas
│
├── ÉPICO 7: Gestão Administrativa e Dashboards
│   ├── Feature 7.1: Dashboards Executivos
│   ├── Feature 7.2: Relatórios de Conformidade PR 7.1
│   └── Feature 7.3: Gestão de Usuários e Permissões
│
└── ÉPICO 8: Infraestrutura e Fundação
    ├── Feature 8.1: Autenticação e Autorização (RBAC)
    ├── Feature 8.2: Sistema de Notificações
    ├── Feature 8.3: Central de Mensagens
    └── Feature 8.4: Audit Trail e Logs
```

### Priorização MoSCoW

| Épico | Prioridade | Justificativa |
|-------|-----------|---------------|
| **Épico 8** | **Must Have** | Fundação: sem auth/notificações nada funciona |
| **Épico 1** | **Must Have** | Porta de entrada: empresas solicitam certificação |
| **Épico 2** | **Must Have** | Gargalo crítico: contratos demoram 20-30 dias |
| **Épico 3** | **Must Have** | Coração do processo: analistas coordenam tudo |
| **Épico 4** | **Must Have** | Maior tempo: auditorias são essenciais |
| **Épico 5** | **Must Have** | Decisão final: sem comitê não há certificado |
| **Épico 6** | **Should Have** | Diferencial: mas sistema funciona sem IA inicialmente |
| **Épico 7** | **Should Have** | Gestão: importante mas não bloqueia certificação |

---

## 5. User Stories Detalhadas

### ÉPICO 1: Gestão de Solicitações e Onboarding

#### 📋 Feature 1.1: Cadastro e Solicitação de Certificação

##### **US-001: Cadastro de Nova Empresa**
```
Como empresa solicitante,
Eu quero me cadastrar no sistema com meus dados básicos,
Para que eu possa iniciar o processo de certificação Halal.
```

**Acceptance Criteria**:
- [ ] Sistema solicita: Razão Social, Nome Fantasia, CNPJ, Endereço completo
- [ ] Sistema solicita: Contatos (nome, e-mail, telefone do responsável)
- [ ] Sistema solicita: Tipo de indústria (Alimentos, Farmacêuticos, Químicos, Cosméticos)
- [ ] Sistema valida CNPJ (formato e dígito verificador)
- [ ] Sistema verifica se CNPJ já está cadastrado (evita duplicatas)
- [ ] Sistema envia e-mail de confirmação de cadastro
- [ ] Sistema cria usuário com perfil "Empresa" automaticamente
- [ ] Sistema redireciona para formulário de solicitação após cadastro

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: US-080 (Autenticação)

---

##### **US-002: Formulário de Solicitação de Certificação**
```
Como empresa cadastrada,
Eu quero preencher um formulário estruturado de solicitação,
Para que a certificadora tenha todas as informações necessárias para analisar meu pedido.
```

**Acceptance Criteria**:
- [ ] Sistema apresenta wizard em 4 etapas:
  - **Etapa 1 - Dados Gerais**: Confirma dados da empresa, permite edição
  - **Etapa 2 - Escopo**: Tipo de certificação desejada, produtos fabricados, categorias GSO 2055-2
  - **Etapa 3 - Produção**: Número de turnos, capacidade produtiva, processos utilizados
  - **Etapa 4 - Fornecedores**: Lista de matérias-primas e fornecedores principais
- [ ] Sistema salva progresso automaticamente a cada etapa
- [ ] Sistema permite voltar para etapas anteriores
- [ ] Sistema valida campos obrigatórios antes de avançar
- [ ] Sistema permite upload de documentos obrigatórios:
  - Contrato Social ou equivalente
  - Licença de Funcionamento
  - Fotos da planta industrial (mínimo 5)
  - Lista de produtos (planilha ou PDF)
  - Certificados de fornecedores (se houver)
- [ ] Sistema limita tamanho de arquivos: máximo 50MB por arquivo
- [ ] Sistema aceita formatos: PDF, JPG, PNG, XLSX, DOCX
- [ ] Sistema exibe barra de progresso: "3 de 10 documentos obrigatórios enviados"
- [ ] Sistema exibe checklist visual de documentos faltantes
- [ ] Sistema permite submeter solicitação apenas quando:
  - Todas as 4 etapas preenchidas
  - Documentos obrigatórios enviados
- [ ] Sistema gera número único de protocolo: "HS-2025-001234"
- [ ] Sistema muda status para "Solicitação Enviada"
- [ ] Sistema envia e-mail de confirmação com número de protocolo

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-001, US-003

---

##### **US-003: Upload e Gestão de Documentos**
```
Como empresa solicitante,
Eu quero fazer upload de múltiplos documentos organizados por categoria,
Para que a certificadora tenha acesso fácil a toda documentação necessária.
```

**Acceptance Criteria**:
- [ ] Sistema organiza documentos em categorias:
  - Documentação Legal (contrato social, licenças)
  - Documentação Técnica (fichas técnicas, processos)
  - Fotos da Planta Industrial
  - Certificados de Fornecedores
  - Outros
- [ ] Sistema permite upload múltiplo (drag & drop ou seleção)
- [ ] Sistema exibe preview de documentos (thumbnails para imagens, ícone para PDFs)
- [ ] Sistema permite substituir documento (nova versão)
- [ ] Sistema mantém versionamento: "contrato-social-v1.pdf", "contrato-social-v2.pdf"
- [ ] Sistema permite download individual ou em lote
- [ ] Sistema exibe metadata: nome do arquivo, tamanho, data de upload, versão
- [ ] Sistema marca documentos como "Aguardando Revisão", "Aprovado", "Rejeitado" (após análise do analista)
- [ ] Sistema notifica empresa quando documento é rejeitado (com motivo)
- [ ] Sistema permite empresa fazer download de seus próprios documentos a qualquer momento

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-002

---

#### 📊 Feature 1.2: Dashboard de Acompanhamento

##### **US-004: Dashboard de Status em Tempo Real**
```
Como empresa solicitante,
Eu quero ver em tempo real em que etapa está meu processo de certificação,
Para que eu não precise ligar na certificadora perguntando sobre o status.
```

**Acceptance Criteria**:
- [ ] Sistema exibe timeline visual com 12 fases:
  1. Solicitação Enviada
  2. Revisão Inicial (Analista)
  3. Proposta Comercial em Criação
  4. Proposta Enviada (Aguardando Resposta)
  5. Contrato em Preparação
  6. Contrato Enviado (Aguardando Assinatura)
  7. Contrato Assinado
  8. Análise Documental (Estágio 1)
  9. Auditoria Agendada (Estágio 2)
  10. Auditoria Realizada (Aguardando Relatório)
  11. Análise do Comitê
  12. Certificado Emitido
- [ ] Sistema destaca fase atual em cor diferenciada (verde)
- [ ] Sistema marca fases concluídas com ✓
- [ ] Sistema exibe data de mudança de cada fase
- [ ] Sistema exibe estimativa de prazo para conclusão total
- [ ] Sistema exibe próxima ação esperada: "Aguardando assinatura do contrato"
- [ ] Sistema exibe responsável atual: "Analista: Mariana Silva"
- [ ] Sistema exibe mensagens importantes destacadas
- [ ] Sistema permite empresa adicionar comentários/perguntas
- [ ] Sistema atualiza em tempo real (WebSocket ou polling a cada 30s)

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-002, US-085 (Sistema de Notificações)

---

##### **US-005: Notificações de Mudança de Status**
```
Como empresa solicitante,
Eu quero receber notificações automáticas quando meu processo mudar de status,
Para que eu esteja sempre informado sem precisar acessar o sistema constantemente.
```

**Acceptance Criteria**:
- [ ] Sistema envia notificação por e-mail a cada mudança de fase
- [ ] Sistema envia notificação in-app (sino no header)
- [ ] Sistema permite empresa configurar preferências:
  - Receber e-mail para todas mudanças (padrão)
  - Receber e-mail apenas para ações requeridas
  - Receber SMS para ações críticas (contrato pronto, certificado emitido)
- [ ] E-mail contém:
  - Número do protocolo
  - Nova fase atual
  - Próxima ação esperada (se houver)
  - Link direto para o processo
- [ ] Sistema envia notificação quando:
  - Proposta comercial está pronta
  - Contrato está pronto para assinatura
  - Documentos foram rejeitados (com motivo)
  - Auditoria foi agendada (data/hora)
  - Não-conformidades foram identificadas
  - Certificado foi emitido
- [ ] Sistema mantém histórico de notificações enviadas

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-004, US-085

---

#### 📁 Feature 1.3: Gestão de Documentação (Continuação)

##### **US-006: Checklist de Documentos Obrigatórios**
```
Como empresa solicitante,
Eu quero ver uma checklist clara de quais documentos são obrigatórios,
Para que eu saiba exatamente o que preciso enviar.
```

**Acceptance Criteria**:
- [ ] Sistema exibe checklist visual com todos documentos obrigatórios
- [ ] Sistema marca documentos já enviados com ✓ verde
- [ ] Sistema marca documentos faltantes com ⚠️ laranja
- [ ] Sistema marca documentos rejeitados com ✗ vermelho (com motivo)
- [ ] Sistema agrupa documentos por categoria
- [ ] Sistema exibe descrição de cada documento: "Contrato Social - Documento que comprova constituição legal da empresa"
- [ ] Sistema exibe exemplos quando disponível: "Exemplo de foto da planta industrial"
- [ ] Sistema permite download de templates (planilha de produtos, etc.)
- [ ] Sistema calcula progresso: "7 de 10 documentos obrigatórios enviados (70%)"
- [ ] Sistema bloqueia submissão se documentos obrigatórios faltantes
- [ ] Sistema atualiza checklist em tempo real ao fazer upload

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-003

---

#### 🔧 Feature 1.4: Tratamento de Não-Conformidades (Empresa)

##### **US-007: Visualização de Não-Conformidades**
```
Como empresa solicitante,
Eu quero visualizar não-conformidades identificadas durante a auditoria,
Para que eu saiba exatamente o que precisa ser corrigido.
```

**Acceptance Criteria**:
- [ ] Sistema exibe lista de NCs após auditoria Estágio 2
- [ ] Cada NC contém:
  - Código único: "NC-001"
  - Classificação: Maior (crítica) ou Menor (não-crítica)
  - Descrição detalhada do problema
  - Seção do PR 7.1 violada
  - Fotos de evidência (se houver)
  - Prazo para tratamento (30 dias para Maior, 60 dias para Menor)
  - Status: Pendente / Em Tratamento / Aguardando Aprovação / Resolvida
- [ ] Sistema destaca NCs críticas (Maiores) em vermelho
- [ ] Sistema exibe contador: "2 NCs Maiores, 3 NCs Menores"
- [ ] Sistema exibe prazo restante com alerta visual: "15 dias restantes" (vermelho se <7 dias)
- [ ] Sistema permite empresa adicionar comentários em cada NC

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-004, US-040 (Auditoria)

---

##### **US-008: Upload de Evidências de Tratamento de NC**
```
Como empresa solicitante,
Eu quero fazer upload de evidências que mostram correção de não-conformidades,
Para que o auditor possa aprovar o tratamento e o processo possa continuar.
```

**Acceptance Criteria**:
- [ ] Sistema permite upload de evidências por NC:
  - Fotos mostrando correção
  - Documentos atualizados (procedimentos, registros)
  - Descrição textual das ações corretivas tomadas
- [ ] Sistema permite upload múltiplo (várias fotos/docs por NC)
- [ ] Sistema limita tamanho: 50MB por arquivo
- [ ] Sistema aceita formatos: JPG, PNG, PDF, DOCX, XLSX
- [ ] Sistema marca NC como "Em Tratamento" ao fazer primeiro upload
- [ ] Sistema permite marcar NC como "Pronto para Revisão"
- [ ] Sistema notifica auditor quando empresa marca NC como pronta
- [ ] Sistema permite comunicação direta com auditor via chat:
  - Empresa pode fazer perguntas sobre NC
  - Auditor pode solicitar mais evidências
- [ ] Sistema exibe histórico de tratamento:
  - Data de identificação
  - Data de início de tratamento
  - Data de submissão para revisão
  - Data de aprovação/rejeição
- [ ] Sistema bloqueia envio para comitê se NCs Maiores não resolvidas

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-007, US-086 (Central de Mensagens)

---

### ÉPICO 2: Gestão Comercial e Contratual (Inovação 🚀)

#### 💰 Feature 2.1: Calculadora Inteligente de Custos

##### **US-010: Configuração de Parâmetros da Calculadora (Admin)**
```
Como coordenador administrativo,
Eu quero configurar parâmetros da calculadora de custos,
Para que as propostas comerciais sejam geradas automaticamente com precificação consistente.
```

**Acceptance Criteria**:
- [ ] Sistema permite admin configurar:
  - **Tabela de preços por tipo de certificação**: C1, C2, C3, C4, C5, C6 (valores base)
  - **Fatores multiplicadores**:
    - Origem de produtos: Animal (1.5x), Vegetal (1.0x), Misto (1.3x)
    - Quantidade de produtos: 1-10 (1.0x), 11-50 (1.2x), 51-100 (1.4x), >100 (1.6x)
    - Turnos de produção: 1 turno (1.0x), 2 turnos (1.3x), 3 turnos (1.5x)
    - Histórico: Primeira certificação (1.0x), Renovação (0.8x)
    - Complexidade de fornecedores: Simples (1.0x), Média (1.2x), Alta (1.5x)
  - **Custos de deslocamento**: Tabela por região/estado (km ou valor fixo)
  - **Man-hour de auditoria**: Implementa tabela PR 7.1 seção 10.7.4
    - Pequena empresa (<50 func): 1 dia
    - Média empresa (50-250 func): 2 dias
    - Grande empresa (>250 func): 3+ dias
  - **Taxas administrativas**: % ou valor fixo
  - **Impostos**: % aplicado ao total
- [ ] Sistema permite criar múltiplas tabelas de preço (Padrão, Promocional, Corporativo)
- [ ] Sistema permite ativar/desativar tabelas de preço
- [ ] Sistema valida que tabela ativa sempre existe
- [ ] Sistema mantém histórico de alterações de preços
- [ ] Sistema permite duplicar tabela de preço

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-082 (Gestão de Usuários - perfil Admin)

---

##### **US-011: Cálculo Automático de Proposta Comercial (Analista)**
```
Como analista de certificação,
Eu quero que o sistema calcule automaticamente o valor da certificação,
Para que eu possa gerar propostas em segundos ao invés de horas.
```

**Acceptance Criteria**:
- [ ] Sistema recebe como input (da solicitação da empresa):
  - Tipo de certificação solicitada
  - Origem de produtos (animal/vegetal/misto)
  - Quantidade de produtos
  - Número de turnos
  - Histórico (primeira vez ou renovação)
  - Número de fornecedores
  - Localização da empresa (para cálculo de deslocamento)
- [ ] Sistema aplica algoritmo de cálculo:
  ```
  Valor Base = Tabela[Tipo de Certificação]
  Valor com Multiplicadores = Valor Base × Fator Origem × Fator Quantidade × Fator Turnos × Fator Histórico × Fator Fornecedores
  Man-hour = Função(Tamanho da Empresa, Complexidade)
  Custo Auditoria = Man-hour × Valor/hora do Auditor
  Custo Deslocamento = Tabela[Região/Estado]
  Taxas Administrativas = Valor Fixo ou %
  Subtotal = Valor com Multiplicadores + Custo Auditoria + Custo Deslocamento + Taxas
  Total = Subtotal + Impostos
  ```
- [ ] Sistema exibe breakdown detalhado:
  - Valor base da certificação: R$ X
  - Custo de análise documental: R$ Y
  - Custo de auditoria (Z dias × R$ A/dia): R$ B
  - Custo de deslocamento: R$ C
  - Taxas administrativas: R$ D
  - Subtotal: R$ E
  - Impostos (X%): R$ F
  - **Total**: R$ G
- [ ] Sistema permite analista ajustar manualmente qualquer valor
- [ ] Sistema marca proposta como "Ajustada Manualmente" se houver override
- [ ] Sistema registra justificativa de ajuste manual
- [ ] Sistema calcula margem de lucro esperada
- [ ] Sistema exibe histórico de propostas similares para comparação

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-010, US-020 (Análise de Solicitação)

---

#### 📄 Feature 2.2: Geração de Propostas Comerciais

##### **US-012: Geração Automática de PDF de Proposta**
```
Como analista de certificação,
Eu quero gerar automaticamente um PDF profissional da proposta comercial,
Para que eu possa enviá-la à empresa sem trabalho manual de formatação.
```

**Acceptance Criteria**:
- [ ] Sistema gera PDF com template profissional contendo:
  - **Header**: Logo da certificadora, dados de contato
  - **Dados da empresa**: Razão social, CNPJ, endereço, contato
  - **Número da proposta**: "PROP-2025-001234"
  - **Data de emissão** e **validade** (30 dias padrão)
  - **Escopo da certificação**: Tipo, produtos, categorias GSO
  - **Breakdown de custos** (tabela formatada)
  - **Condições de pagamento**: Entrada (%), Parcelas, Formas aceitas
  - **Prazo estimado**: "Aproximadamente 90 dias após assinatura do contrato"
  - **Próximos passos**: O que empresa deve fazer para aceitar
  - **Termos e condições**: Texto jurídico padrão
  - **Assinatura digital**: Nome e cargo do responsável pela proposta
- [ ] Sistema permite personalizar template (cores, logo, textos)
- [ ] Sistema gera PDF em alta qualidade (não imagem, texto selecionável)
- [ ] Sistema armazena PDF no sistema (histórico)
- [ ] Sistema permite analista fazer download do PDF antes de enviar
- [ ] Sistema permite re-gerar PDF após ajustes

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-011

---

##### **US-013: Envio de Proposta para Empresa**
```
Como analista de certificação,
Eu quero enviar a proposta comercial para a empresa via sistema,
Para que tudo fique registrado e a empresa possa visualizar/aceitar facilmente.
```

**Acceptance Criteria**:
- [ ] Sistema permite analista enviar proposta com um clique
- [ ] Sistema muda status do processo para "Proposta Enviada"
- [ ] Sistema envia e-mail para empresa com:
  - Assunto: "Proposta Comercial - Certificação Halal - [Nome da Empresa]"
  - Corpo: Texto amigável explicando próximos passos
  - PDF da proposta anexo
  - Link para visualizar proposta no portal
  - Botões de ação: "Aceitar Proposta" e "Solicitar Ajustes"
- [ ] Sistema registra data/hora de envio
- [ ] Sistema permite empresa visualizar proposta no portal
- [ ] Sistema permite empresa fazer download do PDF
- [ ] Sistema exibe aviso: "Proposta válida até [data]"
- [ ] Sistema permite empresa aceitar proposta diretamente:
  - Botão "Aceitar Proposta"
  - Sistema solicita confirmação
  - Sistema muda status para "Proposta Aceita"
  - Sistema notifica analista automaticamente
- [ ] Sistema permite empresa solicitar ajustes:
  - Botão "Solicitar Ajustes"
  - Campo de texto para empresa justificar
  - Sistema notifica analista
  - Sistema muda status para "Proposta em Revisão"

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-012, US-085

---

#### 📝 Feature 2.3: Contratos Colaborativos por Cláusulas (Inovação 🚀)

##### **US-014: Template de Contrato Estruturado por Cláusulas**
```
Como coordenador administrativo,
Eu quero criar templates de contrato estruturados por cláusulas editáveis,
Para que contratos possam ser negociados de forma colaborativa e rápida.
```

**Acceptance Criteria**:
- [ ] Sistema permite admin criar templates por tipo de indústria:
  - Alimentos (padrão)
  - Farmacêuticos
  - Químicos e Cosméticos
- [ ] Cada template contém 15-20 cláusulas estruturadas:
  1. Objeto do Contrato
  2. Escopo da Certificação
  3. Obrigações da Empresa Certificada
  4. Obrigações da Certificadora
  5. Valor e Condições de Pagamento
  6. Prazo de Validade da Certificação
  7. Auditorias de Manutenção
  8. Renovação
  9. Uso da Marca e Certificado
  10. Confidencialidade
  11. Não-Conformidades e Suspensão
  12. Rescisão
  13. Responsabilidades e Limitações
  14. Resolução de Conflitos
  15. Disposições Gerais
  16-20. Cláusulas Específicas (variam por indústria)
- [ ] Cada cláusula tem:
  - Título
  - Número
  - Texto (HTML formatado: negrito, itálico, listas)
  - Tags de variáveis: `{{nome_empresa}}`, `{{valor_total}}`, `{{prazo}}`
- [ ] Sistema substitui variáveis automaticamente baseado em dados da solicitação/proposta
- [ ] Sistema permite admin editar templates
- [ ] Sistema mantém versionamento de templates
- [ ] Sistema permite marcar cláusula como "Editável pela Empresa" ou "Não Editável"

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-010, US-082

---

##### **US-015: Geração de Contrato a partir de Template**
```
Como analista de certificação,
Eu quero gerar um contrato automaticamente a partir do template,
Para que eu não precise redigir contratos manualmente.
```

**Acceptance Criteria**:
- [ ] Sistema gera contrato após empresa aceitar proposta
- [ ] Sistema seleciona template correto baseado em tipo de indústria
- [ ] Sistema substitui todas variáveis automaticamente:
  - `{{nome_empresa}}` → Razão Social
  - `{{cnpj}}` → CNPJ formatado
  - `{{endereco}}` → Endereço completo
  - `{{valor_total}}` → Valor da proposta aceita
  - `{{prazo_certificacao}}` → 3 anos (padrão)
  - Etc.
- [ ] Sistema cria instância do contrato com status "Em Preparação"
- [ ] Sistema notifica analista: "Contrato gerado, revisar antes de enviar"
- [ ] Sistema permite analista revisar contrato cláusula por cláusula
- [ ] Sistema permite analista editar cláusulas antes de enviar
- [ ] Sistema permite analista marcar cláusulas como "Negociáveis" ou "Não Negociáveis"
- [ ] Sistema exibe preview do contrato completo (PDF)

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-013, US-014

---

##### **US-016: Negociação Colaborativa de Cláusulas (Empresa + Certificadora)**
```
Como empresa e como analista,
Nós queremos editar e comentar cláusulas individuais do contrato,
Para que possamos negociar de forma estruturada e transparente, sem dezenas de e-mails.
```

**Acceptance Criteria**:
- [ ] Sistema exibe contrato em interface de edição colaborativa:
  - Lista de cláusulas (sidebar esquerda)
  - Cláusula selecionada (área principal)
  - Comentários e histórico (sidebar direita)
- [ ] Para cada cláusula, sistema exibe:
  - Número e título da cláusula
  - **Texto original** (proposto pela certificadora)
  - **Texto editado** pela empresa (se houver)
  - **Status da cláusula**:
    - ⚪ Pendente (não revisada)
    - 🟡 Em Negociação (empresa propôs mudanças)
    - ✅ Aprovada (ambas as partes aprovaram)
    - ❌ Rejeitada (certificadora rejeitou proposta da empresa)
  - Botões de ação (varia por perfil):
    - **Empresa**: "Propor Alteração", "Aprovar Original", "Adicionar Comentário"
    - **Certificadora**: "Aceitar Alteração", "Rejeitar Alteração", "Contra-Propor", "Aprovar"
- [ ] Empresa pode propor alteração:
  - Clica em "Propor Alteração"
  - Editor de texto rico (HTML) abre
  - Empresa edita texto da cláusula
  - Empresa adiciona comentário justificando mudança (obrigatório)
  - Empresa clica "Enviar Proposta"
  - Status muda para 🟡 Em Negociação
  - Certificadora é notificada automaticamente
- [ ] Certificadora pode responder:
  - **Aceitar Alteração**: Status muda para ✅ Aprovada, texto editado se torna oficial
  - **Rejeitar Alteração**: Status volta para ⚪ Pendente, texto original mantido
  - **Contra-Propor**: Certificadora edita texto novamente, adiciona comentário, envia para empresa
- [ ] Sistema exibe visualização lado-a-lado:
  - **Esquerda**: Texto original
  - **Direita**: Texto proposto/editado
  - **Diff highlighting**: Palavras adicionadas (verde), removidas (vermelho)
- [ ] Sistema mantém histórico completo de versões:
  - Versão 1 (Original) - Certificadora - 10/11/2025
  - Versão 2 (Editada) - Empresa - 12/11/2025 - "Solicitamos redução de prazo de 90 para 60 dias"
  - Versão 3 (Contra-proposta) - Certificadora - 13/11/2025 - "Prazo mínimo é 75 dias por conformidade PR 7.1"
- [ ] Sistema exibe contador visual:
  - "12 de 18 cláusulas aprovadas"
  - Barra de progresso: 67%
- [ ] Sistema bloqueia assinatura até que TODAS as cláusulas estejam aprovadas (✅)
- [ ] Sistema envia notificações em tempo real:
  - Empresa propõe mudança → Analista recebe notificação
  - Analista responde → Empresa recebe notificação

**Prioridade**: Must Have (P0) - **DIFERENCIAL CHAVE**
**Estimativa**: 21 story points (complexo)
**Dependências**: US-015, US-085, US-086

---

##### **US-017: Versionamento Automático de Contrato**
```
Como empresa ou analista,
Eu quero ter acesso ao histórico completo de mudanças do contrato,
Para que haja transparência total e possamos reverter mudanças se necessário.
```

**Acceptance Criteria**:
- [ ] Sistema cria nova versão do contrato a cada mudança significativa:
  - Quando empresa propõe alteração em cláusula
  - Quando certificadora aceita/rejeita/contra-propõe
  - Quando qualquer cláusula é marcada como aprovada
- [ ] Cada versão contém:
  - Número da versão: V1, V2, V3...
  - Data/hora de criação
  - Autor da mudança: Nome e perfil (Empresa/Certificadora)
  - Descrição da mudança: "Empresa propôs alteração na Cláusula 5"
  - Snapshot completo do contrato naquela versão
- [ ] Sistema permite visualizar qualquer versão anterior:
  - Dropdown "Ver Versão": V1, V2, V3, V4 (Atual)
  - Contrato é carregado no estado daquela versão
  - Interface é somente leitura para versões antigas
- [ ] Sistema permite comparar duas versões:
  - Botão "Comparar Versões"
  - Seleciona V2 vs V4
  - Sistema exibe diff lado-a-lado
- [ ] Sistema permite admin reverter para versão anterior (apenas admin):
  - Botão "Reverter para esta Versão" (apenas para admin)
  - Sistema solicita confirmação
  - Sistema cria nova versão (não deleta histórico)

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-016

---

##### **US-018: Assinatura Digital de Contrato**
```
Como empresa e como certificadora,
Nós queremos assinar o contrato digitalmente após aprovação de todas as cláusulas,
Para que o contrato tenha validade jurídica e o processo possa avançar.
```

**Acceptance Criteria**:
- [ ] Sistema habilita botão "Assinar Contrato" apenas quando:
  - Todas as cláusulas estão aprovadas (✅)
  - Ambas as partes concordaram com versão final
- [ ] Sistema gera PDF final do contrato com:
  - Todas as cláusulas na versão aprovada
  - Data de geração
  - Número único do contrato: "CONT-2025-001234"
  - Espaços para assinaturas digitais
- [ ] Sistema integra com serviço de assinatura digital:
  - **Opção 1**: DocuSign
  - **Opção 2**: D4Sign (Brasil)
  - **Opção 3**: ICP-Brasil (se necessário)
- [ ] Fluxo de assinatura:
  1. Analista clica "Enviar para Assinatura"
  2. Sistema envia para serviço de assinatura
  3. Serviço envia e-mail para empresa com link para assinar
  4. Empresa assina eletronicamente
  5. Serviço envia e-mail para certificadora (representante legal) com link
  6. Representante da certificadora assina
  7. Serviço notifica sistema que contrato foi assinado por ambas as partes
  8. Sistema recebe PDF assinado com certificados digitais
  9. Sistema muda status para "Contrato Assinado"
  10. Sistema notifica analista e empresa
- [ ] Sistema armazena:
  - PDF do contrato assinado
  - Certificados digitais de ambas assinaturas
  - Timestamp de cada assinatura
  - Certificado de autenticidade do serviço de assinatura
- [ ] Sistema permite download do contrato assinado (PDF)
- [ ] Sistema bloqueia edições após primeira assinatura

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-016, US-017, Integração com DocuSign/D4Sign

---

### ⏱️ Status Atual do PRD

Criamos a estrutura completa do PRD e detalhamos:
- ✅ Seção 1: Visão Geral (Problema, Solução, Diferenciais, Escopo MVP)
- ✅ Seção 2: Objetivos e Métricas (4 OKRs + KPIs)
- ✅ Seção 3: Personas e Jornadas (5 personas detalhadas)
- ✅ Seção 4: Arquitetura de Features (8 épicos com priorização)
- ✅ Seção 5 - Parcial: User Stories Detalhadas
  - ✅ ÉPICO 1: Gestão de Solicitações (8 user stories)
  - ✅ ÉPICO 2: Gestão Comercial (9 user stories - incluindo inovação de contratos colaborativos)

---

## Próximas Seções a Desenvolver

### Seção 5 (continuação) - User Stories Faltantes:
- **ÉPICO 3**: Análise e Preparação (Analistas) - ~12 user stories
- **ÉPICO 4**: Execução de Auditorias (App Mobile + IA) - ~10 user stories
- **ÉPICO 5**: Decisão e Emissão de Certificados - ~8 user stories
- **ÉPICO 6**: Assistente IA Multilíngue - ~6 user stories
- **ÉPICO 7**: Gestão Administrativa - ~6 user stories
- **ÉPICO 8**: Infraestrutura e Fundação - ~8 user stories

**Total estimado**: ~68 user stories no MVP completo

### Seção 6: Roadmap e Faseamento
### Seção 7: Requisitos Não-Funcionais
### Seção 8: Dependências e Riscos
### Seção 9: Acceptance Criteria Globais

---

---

### ÉPICO 3: Análise e Preparação (Analistas)

#### 📋 Feature 3.1: Painel de Controle de Processos

##### **US-020: Dashboard de Processos do Analista**
```
Como analista de certificação,
Eu quero visualizar todos os processos que estou gerenciando em um único painel,
Para que eu possa priorizar e gerenciar eficientemente até 60 processos simultâneos.
```

**Acceptance Criteria**:
- [ ] Sistema exibe dashboard tipo Kanban com colunas por fase:
  - Solicitações Novas (Pendentes de Revisão)
  - Em Análise Inicial
  - Aguardando Proposta
  - Aguardando Contrato
  - Análise Documental (Estágio 1)
  - Auditoria (Estágio 2)
  - Aguardando Decisão do Comitê
  - Concluídas
- [ ] Cada card exibe:
  - Nome da empresa
  - Número do protocolo
  - Tipo de certificação
  - Dias na fase atual
  - Indicadores visuais: 🔴 Atrasado, 🟡 Perto do prazo, 🟢 No prazo
  - Ações pendentes do analista
- [ ] Sistema permite filtros:
  - Por fase do processo
  - Por tipo de certificação (C1-C6)
  - Por auditor alocado
  - Por prazo (atrasados, urgentes, no prazo)
  - Por empresa (busca por nome/CNPJ)
- [ ] Sistema exibe métricas no header:
  - Total de processos ativos: 45
  - Processos atrasados: 3 🔴
  - Processos urgentes (< 7 dias): 8 🟡
  - Média de dias por fase
- [ ] Sistema permite arrastar e soltar cards entre fases (se aplicável)
- [ ] Sistema permite clicar em card para abrir detalhes do processo
- [ ] Sistema atualiza em tempo real (WebSocket)
- [ ] Sistema permite ordenação: Mais antigo, Mais recente, Prioridade

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-002, US-082

---

##### **US-021: Visualização Detalhada de Processo Individual**
```
Como analista de certificação,
Eu quero visualizar todas as informações de um processo específico em uma única tela,
Para que eu possa tomar decisões rápidas sem navegar por múltiplas páginas.
```

**Acceptance Criteria**:
- [ ] Sistema exibe página de detalhes do processo com abas:
  - **Aba 1 - Resumo**: Dados da empresa, escopo, status atual, timeline
  - **Aba 2 - Solicitação**: Formulário completo submetido pela empresa
  - **Aba 3 - Documentos**: Todos documentos com status (aprovado/rejeitado)
  - **Aba 4 - Proposta**: Proposta comercial gerada, status de aceitação
  - **Aba 5 - Contrato**: Status da negociação de cláusulas, PDF final
  - **Aba 6 - Estágio 1**: Análise documental, checklist, relatório
  - **Aba 7 - Estágio 2**: Auditoria agendada, relatório, NCs
  - **Aba 8 - Comitê**: Dossiê, recomendação, decisão
  - **Aba 9 - Comunicações**: Histórico de mensagens e comentários
  - **Aba 10 - Histórico**: Log completo de ações e mudanças
- [ ] Sistema exibe sidebar direita com ações rápidas:
  - Enviar mensagem para empresa
  - Agendar auditoria
  - Solicitar documento adicional
  - Mover para próxima fase
  - Gerar relatório
- [ ] Sistema exibe indicador de ações pendentes: "3 ações requerem sua atenção"
- [ ] Sistema permite adicionar notas internas (não visíveis para empresa)
- [ ] Sistema permite marcar processo como prioritário (estrela)

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-020

---

#### 📄 Feature 3.2: Análise de Solicitação e Enquadramento

##### **US-022: Revisão e Enquadramento de Solicitação**
```
Como analista de certificação,
Eu quero revisar a solicitação da empresa e enquadrá-la conforme PR 7.1,
Para que o processo inicie corretamente e a proposta comercial seja precisa.
```

**Acceptance Criteria**:
- [ ] Sistema exibe solicitação completa da empresa
- [ ] Sistema sugere automaticamente (via IA):
  - Tipo de certificação: C1, C2, C3, C4, C5 ou C6
  - Categorias GSO 2055-2 baseado nos produtos listados
  - Categorias SMIIC 02 alternativas
  - Origem: Animal, Vegetal ou Misto
  - Complexidade da cadeia de fornecedores: Simples, Média, Alta
- [ ] Sistema permite analista confirmar ou ajustar sugestões
- [ ] Sistema exibe justificativa da IA para cada sugestão:
  - "Sugerido C3 porque empresa utiliza matérias-primas de origem animal"
  - "Detectados 15 produtos na categoria GSO 2055-2: Seção 4 - Laticínios"
- [ ] Sistema permite analista adicionar observações:
  - "Atenção: Empresa utiliza glicerina - exige certificado de fornecedor"
  - "Complexidade alta devido a 40 fornecedores diferentes"
- [ ] Sistema calcula automaticamente man-hour estimado (PR 7.1 10.7.4)
- [ ] Sistema permite aprovar ou rejeitar solicitação:
  - **Aprovar**: Sistema muda status para "Aprovada - Gerar Proposta"
  - **Rejeitar**: Sistema solicita justificativa e notifica empresa
- [ ] Sistema valida que todos documentos obrigatórios foram enviados
- [ ] Sistema permite solicitar documentos adicionais antes de aprovar

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-021, US-011 (para cálculo de proposta)

---

#### 📂 Feature 3.3: Análise Documental (Estágio 1) com IA

##### **US-023: Checklist Digital de Análise Documental**
```
Como analista de certificação,
Eu quero ter um checklist estruturado para análise documental (Estágio 1),
Para que eu garanta conformidade com PR 7.1 seção 10.6 e não esqueça nenhum requisito.
```

**Acceptance Criteria**:
- [ ] Sistema gera checklist automaticamente baseado em:
  - Tipo de certificação solicitada
  - Tipo de indústria
  - Produtos fabricados
  - Requisitos do PR 7.1 seção 10.6
- [ ] Checklist contém itens como:
  - ☐ Contrato social ou documento equivalente válido
  - ☐ Licença de funcionamento válida
  - ☐ Layout da planta industrial com fluxo de produção
  - ☐ Lista completa de produtos a serem certificados
  - ☐ Fichas técnicas de todos os produtos
  - ☐ Lista de matérias-primas e ingredientes
  - ☐ Certificados Halal de fornecedores de matérias-primas críticas
  - ☐ Procedimentos de higienização e sanitização
  - ☐ Procedimentos de controle de pragas
  - ☐ Procedimentos de rastreabilidade
  - ☐ Fotos da planta industrial (mínimo 5, incluindo áreas de produção e armazenamento)
  - ☐ Outros documentos específicos conforme tipo de certificação
- [ ] Sistema permite analista marcar cada item como:
  - ✅ Conforme (documento aprovado)
  - ❌ Não Conforme (documento rejeitado ou ausente)
  - ⚠️ Requer Atenção (documento precisa ajustes)
- [ ] Sistema permite adicionar comentários em cada item
- [ ] Sistema permite solicitar documento adicional diretamente do checklist:
  - Clica em "❌ Certificado de Fornecedor X ausente"
  - Sistema envia notificação para empresa: "Por favor, envie Certificado Halal do Fornecedor X"
- [ ] Sistema bloqueia aprovação de Estágio 1 se itens críticos estão não-conformes
- [ ] Sistema calcula % de conformidade: "85% dos itens conformes"

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-022, US-003

---

##### **US-024: Assistente IA para Análise Preliminar de Documentos**
```
Como analista de certificação,
Eu quero que a IA analise automaticamente os documentos enviados e identifique gaps,
Para que eu possa focar em análise de maior valor ao invés de revisão manual básica.
```

**Acceptance Criteria**:
- [ ] Sistema executa análise automática de IA quando empresa submete documentos
- [ ] IA aplica OCR em todos PDFs e imagens para extrair texto
- [ ] IA identifica automaticamente:
  - **Tipo de documento**: "Contrato Social", "Licença de Funcionamento", "Ficha Técnica"
  - **Validade**: Extrai data de validade e alerta se vencido
  - **CNPJ/Razão Social**: Valida se corresponde à empresa solicitante
  - **Informações críticas**: Produtos, ingredientes, fornecedores
- [ ] IA gera relatório preliminar:
  - ✅ Documentos identificados automaticamente: 8 de 10
  - ⚠️ Documentos com data de validade expirada: 1 (Licença de Funcionamento - vencida em 01/10/2025)
  - ❌ Documentos ausentes: 2 (Certificado Halal Fornecedor A, Procedimento de Higienização)
  - ℹ️ Produtos identificados: 15 produtos extraídos de fichas técnicas
  - ℹ️ Ingredientes críticos: 3 ingredientes de origem animal detectados (Gelatina, Lecitina, Glicerina)
- [ ] IA sugere categorização GSO/SMIIC baseada em produtos
- [ ] IA destaca inconsistências:
  - "Empresa declarou 10 produtos no formulário, mas fichas técnicas contêm 15 produtos"
  - "Fornecedor X está listado sem certificado Halal correspondente"
- [ ] Sistema exibe relatório de IA na aba de Estágio 1
- [ ] Analista pode aceitar ou rejeitar sugestões da IA
- [ ] Sistema mantém sugestões da IA como "assistência", decisão final sempre é do analista

**Prioridade**: Should Have (P1) - **DIFERENCIAL**
**Estimativa**: 21 story points (complexo - integração IA + OCR)
**Dependências**: US-023, Integração OpenAI/Claude + OCR

---

##### **US-025: Geração de Relatório de Estágio 1**
```
Como analista de certificação,
Eu quero gerar automaticamente o relatório de análise documental (Estágio 1),
Para que eu documente conformidade com PR 7.1 seção 10.6 sem digitação manual.
```

**Acceptance Criteria**:
- [ ] Sistema gera relatório de Estágio 1 automaticamente contendo:
  - **Header**: Dados da empresa, número do processo, data da análise
  - **Escopo Analisado**: Tipo de certificação, produtos, categorias
  - **Checklist de Conformidade**: Todos itens com status (✅❌⚠️)
  - **Documentos Analisados**: Lista de documentos com status de aprovação
  - **Não-Conformidades Documentais**: Lista de documentos rejeitados ou ausentes
  - **Observações do Analista**: Comentários e notas importantes
  - **Recomendação**: "Aprovado para Estágio 2" ou "Requer ações corretivas"
  - **Assinatura Digital**: Nome e cargo do analista
- [ ] Sistema permite analista editar relatório antes de finalizar
- [ ] Sistema gera PDF do relatório
- [ ] Sistema permite aprovar ou reprovar Estágio 1:
  - **Aprovar**: Status muda para "Estágio 1 Aprovado - Agendar Auditoria"
  - **Reprovar**: Sistema solicita lista de ações corretivas e notifica empresa
- [ ] Sistema armazena relatório no histórico do processo
- [ ] Sistema permite empresa visualizar relatório de Estágio 1

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-023, US-024

---

#### 🗓️ Feature 3.4: Coordenação de Auditoria Inteligente (Inovação 🚀)

##### **US-026: Cadastro de Auditores e Disponibilidade**
```
Como coordenador administrativo,
Eu quero cadastrar auditores com suas especializações e disponibilidade,
Para que o sistema possa alocar auditores de forma inteligente.
```

**Acceptance Criteria**:
- [ ] Sistema permite cadastrar auditores com:
  - Nome completo
  - E-mail e telefone
  - **Especialização** (múltipla seleção):
    - Alimentos (geral)
    - Alimentos - Laticínios
    - Alimentos - Cárneos
    - Alimentos - Panificação
    - Farmacêuticos
    - Químicos
    - Cosméticos
  - **Localização base**: Cidade e Estado
  - **Idiomas falados**: Português, Inglês, Árabe, Espanhol
  - **Certificações**: GAC, ISO 17065, outras qualificações
  - **Disponibilidade padrão**: Dias da semana e horários
  - **Taxa diária**: Valor cobrado por dia de auditoria
  - **Raio de atuação**: Distância máxima disposto a viajar (km)
  - Status: Ativo / Inativo
- [ ] Sistema permite auditor gerenciar sua própria agenda:
  - Marcar dias indisponíveis (férias, compromissos)
  - Definir disponibilidade semanal
- [ ] Sistema exibe lista de todos auditores cadastrados (22 auditores)
- [ ] Sistema permite filtrar e buscar auditores
- [ ] Sistema exibe estatísticas por auditor:
  - Auditorias realizadas (total)
  - Média de auditorias/mês
  - Taxa de não-conformidades encontradas
  - Avaliação média (futura feature)

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-082

---

##### **US-027: Algoritmo de Scheduling Inteligente (Inovação 🚀)**
```
Como analista de certificação,
Eu quero que o sistema sugira automaticamente os melhores auditores para cada auditoria,
Para que eu economize horas de coordenação manual e evite conflitos de agenda.
```

**Acceptance Criteria**:
- [ ] Sistema implementa algoritmo de scheduling que considera:
  - **Disponibilidade**: Auditor não pode estar em duas auditorias no mesmo dia
  - **Especialização Match**: Score de match entre especialização do auditor e tipo de empresa
    - Exemplo: Auditor especializado em Laticínios = 100% match para indústria de laticínios
    - Auditor generalista em Alimentos = 70% match
  - **Distância Geográfica**:
    - Calcula distância entre localização base do auditor e empresa (via geocoding)
    - Prioriza auditores mais próximos (menor custo de deslocamento)
    - Verifica se está dentro do raio de atuação do auditor
  - **Carga de Trabalho**: Balanceamento automático
    - Evita alocar sempre os mesmos auditores
    - Prioriza auditores com menor número de auditorias agendadas no mês
  - **Histórico**: Evita sempre alocar mesmo auditor para mesma empresa (rodízio)
  - **Idioma**: Prioriza auditor que fala idioma da empresa (se empresa internacional)
- [ ] Sistema calcula **Score de Match** (0-100%) para cada auditor:
  ```
  Score = (Especialização × 0.4) + (Proximidade × 0.3) + (Disponibilidade × 0.2) + (Balanceamento × 0.1)
  ```
- [ ] Sistema sugere **top 3 auditores** ordenados por score
- [ ] Para cada auditor sugerido, sistema exibe:
  - Nome e foto
  - Score de match: 92%
  - Especialização: "Alimentos - Laticínios (Match 100%)"
  - Distância: "45 km da empresa"
  - Disponibilidade: "Disponível em 5 datas nos próximos 30 dias"
  - Custo estimado: R$ 2.500 (taxa diária + deslocamento)
  - Carga atual: "8 auditorias agendadas este mês (capacidade média)"
- [ ] Sistema permite analista:
  - Selecionar um dos 3 sugeridos
  - Buscar manualmente outro auditor (se necessário)
  - Ver explicação do score: "Por que este auditor foi sugerido?"

**Prioridade**: Must Have (P0) - **INOVAÇÃO CHAVE**
**Estimativa**: 21 story points (algoritmo complexo)
**Dependências**: US-026, Integração com Google Maps API (geocoding)

---

##### **US-028: Agendamento de Auditoria com Empresa**
```
Como analista de certificação,
Eu quero agendar a auditoria com a empresa e o auditor selecionado,
Para que todas as partes sejam notificadas e a auditoria seja confirmada.
```

**Acceptance Criteria**:
- [ ] Após analista selecionar auditor, sistema exibe calendário:
  - Mostra disponibilidade do auditor (dias disponíveis em verde)
  - Mostra indisponibilidade em vermelho
  - Destaca datas sugeridas baseado em urgência do processo
- [ ] Analista seleciona data e horário preferencial
- [ ] Sistema calcula duração estimada da auditoria:
  - Baseado em man-hour calculado anteriormente
  - Exemplo: "Auditoria estimada em 2 dias (16 horas)"
- [ ] Sistema envia proposta de data para empresa:
  - E-mail: "Sua auditoria foi agendada para 20/12/2025 às 09:00"
  - Empresa pode:
    - **Confirmar**: Data confirmada, auditor é notificado
    - **Solicitar Reagendamento**: Empresa sugere 2-3 datas alternativas
- [ ] Se empresa solicita reagendamento:
  - Sistema valida se auditor está disponível nas datas alternativas
  - Analista seleciona uma das alternativas
  - Sistema envia confirmação
- [ ] Após confirmação, sistema:
  - Muda status para "Auditoria Agendada"
  - Cria evento no calendário do auditor
  - Envia e-mail de confirmação para empresa com:
    - Data, horário e duração
    - Nome e contato do auditor
    - O que preparar para auditoria
    - Lembrete 7 dias antes e 1 dia antes
  - Envia briefing para auditor (US-029)

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-027, US-085

---

##### **US-029: Briefing Automático do Auditor**
```
Como auditor,
Eu quero receber automaticamente todas as informações necessárias para preparar a auditoria,
Para que eu chegue preparado e possa focar na auditoria em si, não em buscar informações.
```

**Acceptance Criteria**:
- [ ] Sistema gera briefing completo automaticamente e envia para auditor
- [ ] Briefing contém:
  - **Dados da Empresa**:
    - Nome, CNPJ, endereço completo
    - Contato principal (nome, telefone, e-mail)
    - Navegação GPS (link Google Maps)
  - **Escopo da Certificação**:
    - Tipo de certificação (C1-C6)
    - Produtos a serem certificados (lista completa)
    - Categorias GSO 2055-2 / SMIIC 02
  - **Documentação Analisada** (Estágio 1):
    - Link para todos documentos enviados
    - Relatório de Estágio 1 do analista
    - Observações importantes
  - **Histórico** (se houver):
    - Auditorias anteriores nesta empresa
    - Não-conformidades encontradas em auditorias passadas
    - Como foram tratadas
  - **Pontos de Atenção** (gerados por IA ou analista):
    - "Empresa utiliza 3 ingredientes de origem animal - verificar certificados"
    - "Processo de fermentação no Produto X - validar evaporação de álcool"
    - "40 fornecedores cadastrados - priorizar os 10 mais críticos"
  - **Checklist de Auditoria**: Gerado automaticamente baseado em escopo
  - **Logística**:
    - Data e horário
    - Duração estimada
    - Instruções de acesso (portaria, etc.)
- [ ] Sistema permite auditor fazer download do briefing (PDF)
- [ ] Sistema permite auditor fazer download de todos documentos (ZIP)
- [ ] Sistema envia briefing:
  - Imediatamente após agendamento confirmado
  - 7 dias antes da auditoria (lembrete)

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-028, US-025 (Relatório Estágio 1)

---

### ÉPICO 4: Execução de Auditorias (App Mobile + IA)

#### 📱 Feature 4.1: App Mobile para Auditores

##### **US-030: Agenda de Auditorias no App Mobile**
```
Como auditor,
Eu quero visualizar minhas auditorias agendadas em um app mobile,
Para que eu possa gerenciar minha agenda em movimento e acessar informações offline.
```

**Acceptance Criteria**:
- [ ] App mobile (iOS e Android) exibe:
  - **Calendário mensal**: Dias com auditorias marcados
  - **Lista de auditorias**: Próximas auditorias (7 dias)
  - **Card por auditoria**:
    - Nome da empresa
    - Data, horário e duração
    - Endereço
    - Status: Agendada / Confirmada / Em Execução / Concluída
    - Botão "Iniciar Auditoria"
    - Botão "Navegação" (abre Google Maps/Waze)
- [ ] App sincroniza automaticamente quando online
- [ ] App permite visualizar auditorias offline (cache)
- [ ] App envia notificação push:
  - 1 dia antes: "Lembrete: Auditoria em [Empresa] amanhã às 09:00"
  - 1 hora antes: "Auditoria em [Empresa] em 1 hora"
- [ ] App permite auditor confirmar presença com 1 clique
- [ ] App exibe resumo da semana:
  - "Você tem 3 auditorias esta semana"
  - Tempo total estimado: 24 horas
  - Distância total: 350 km

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-028, App Mobile Infrastructure

---

##### **US-031: Preparação de Auditoria com IA de Suporte (Inovação 🚀)**
```
Como auditor,
Eu quero que a IA analise automaticamente os documentos da empresa e me forneça insights críticos,
Para que eu chegue preparado e reduza tempo de auditoria em 30-40%.
```

**Acceptance Criteria**:
- [ ] Sistema executa análise de IA automaticamente quando auditoria é agendada
- [ ] IA extrai automaticamente de documentos (usando OCR + NLP):
  - **Lista completa de produtos** fabricados
  - **Ingredientes e matérias-primas** utilizados (extraídos de fichas técnicas)
  - **Fornecedores** de matérias-primas
  - **Processos de fabricação** descritos
- [ ] IA identifica pontos críticos:
  - **Matérias-primas de origem animal**: Exigem certificação Halal obrigatória
    - Exemplo: "Gelatina Bovina - Fornecedor: ABC Ltda - ATENÇÃO: Verificar certificado Halal"
  - **Lista Positiva**: Ingredientes automaticamente aprovados (vegetais óbvios)
    - Exemplo: "Açúcar, Sal, Farinha de Trigo - Lista Positiva (OK)"
  - **Ingredientes Questionáveis**: Exigem análise especial
    - Exemplo: "Lecitina de Soja (E322) - Pode conter traços de origem animal - VERIFICAR"
    - Exemplo: "Glicerina (E422) - Origem pode ser animal ou vegetal - EXIGIR CERTIFICADO"
    - Exemplo: "Aromatizantes Naturais - Verificar se contém álcool etílico"
  - **Aditivos Críticos**: Código E que pode conter derivados não-Halal
    - Exemplo: "E471 (Mono e Diglicerídeos) - Pode ser de origem animal - CRÍTICO"
  - **Álcool/Etanol**: Usado em processos (exige verificação de evaporação completa)
- [ ] IA categoriza riscos:
  - 🔴 **Alto**: Ingredientes críticos que exigem atenção imediata (3 identificados)
  - 🟡 **Médio**: Ingredientes que exigem validação de fornecedor (8 identificados)
  - 🟢 **Baixo**: Ingredientes pré-aprovados ou vegetais óbvios (34 identificados)
- [ ] IA gera **Resumo Executivo** automático:
  ```
  Esta empresa fabrica 15 produtos utilizando 45 matérias-primas.

  ⚠️ 3 INGREDIENTES CRÍTICOS identificados:
  - Gelatina Bovina (Fornecedor ABC) - EXIGE certificado Halal
  - Glicerina E422 (Fornecedor XYZ) - Origem desconhecida
  - Aromatizante Natural (Fornecedor QWE) - Pode conter álcool

  📋 Certificados de fornecedores necessários: 8 matérias-primas

  🔍 Pontos de atenção especial:
  - Processo de fermentação no Produto "Pão Integral" - validar evaporação completa de álcool
  - Linha de produção compartilhada com produtos não-Halal - verificar procedimento de higienização
  ```
- [ ] App mobile exibe relatório de IA na tela de "Preparação":
  - Resumo executivo
  - Lista de ingredientes críticos (🔴🟡🟢)
  - Fornecedores que exigem certificados
  - Pontos de atenção com localização nos documentos
- [ ] App permite auditor:
  - Adicionar notas aos insights da IA
  - Marcar como "Verificado" cada ponto crítico
  - Fazer download de documentos relevantes para acesso offline

**Prioridade**: Should Have (P1) - **INOVAÇÃO CHAVE / DIFERENCIAL**
**Estimativa**: 34 story points (muito complexo - IA + OCR + NLP)
**Dependências**: US-029, US-030, Integração OpenAI/Claude + OCR + NLP

---

**Este é um PRD vivo que será atualizado conforme necessário durante o desenvolvimento.**
