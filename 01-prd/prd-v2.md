# Product Requirements Document (PRD): HalalSphere
**Sistema Inteligente de Gestão de Certificação Halal com IA**

---

## Document Control

| Campo | Valor |
|-------|-------|
| **Versão** | 2.0 |
| **Data** | 13 de Novembro de 2025 |
| **Autor** | Product Manager - HalalSphere Team |
| **Baseado em** | HalalSphere Project Brief v1.0 (Aprovado) |
| **Status** | MVP em Producao (23/01/2026) |
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

## 📐 Documentos de Referência

Este PRD deve ser lido em conjunto com:

- **[UX Design Guide v1.0](./ux-design-guide.md)**: Especificações completas de design system, layouts por persona, soluções para alto volume, wireframes interativos e padrões de UX/UI.
  - Design System (cores, tipografia, componentes)
  - Layouts por Persona (Empresas, Analistas, Auditores, Gestores)
  - Soluções para 600-700 processos simultâneos
  - Jornada do Cliente: Wizard de 9 etapas com IA embarcada
  - Métricas de sucesso UX

- **Wireframes Interativos** (pasta `/docs`):
  - [ux-color-themes.html](./ux-color-themes.html) - 4 temas de cor comparáveis
  - [ux-design-directions-v2.html](./ux-design-directions-v2.html) - 9 direções de layout
  - [ux-design-high-volume-solutions.html](./ux-design-high-volume-solutions.html) - Soluções para alto volume
  - [ux-journey-wizard-ai.html](./ux-journey-wizard-ai.html) - Wizard completo com IA

**Nota**: User Stories neste PRD incluem seções "UX/UI Specifications" que referenciam detalhes específicos do UX Design Guide.

---

## 1. Visão Geral do Produto

### 1.1 Problema que Resolvemos

O processo de certificação Halal atual em organizações certificadoras é:

**Manual e Demorado**:
- Ciclo de certificação de **7-8 meses** desde solicitação até emissão
- Processos manuais em cada etapa (análise documental, agendamento, relatórios)
- Gargalos críticos: contratos demoram 20-30 dias para fechar

**Opaco e Fragmentado**:
- Empresas não têm visibilidade sobre status de seus processos
- Comunicação dispersa (e-mails, telefone, WhatsApp)
- Impossível rastrear decisões e mudanças

**Ineficiente Operacionalmente**:
- 22 auditores gerenciam 600-700 empresas manualmente
- Coordenação de agendamento é manual e propensa a conflitos
- Analistas gastam 60% do tempo em tarefas repetitivas

**Risco de Não-Conformidade**:
- Difícil garantir aderência consistente ao **PR 7.1 Rev 21** (procedimento operacional)
- Falta de rastreabilidade para auditorias de acreditação (GAC, ISO 17065)
- Processos manuais aumentam risco de erros

### 1.2 Solução Proposta

**HalalSphere** é uma plataforma SaaS end-to-end que:

✅ **Automatiza o ciclo completo** de certificação conforme **PR 7.1 Rev 21**
✅ **Integra 5 stakeholders**: Empresas, Analistas, Auditores, Comitê Técnico, Gestão
✅ **Fornece visibilidade em tempo real** para todos
✅ **Padroniza processos** segundo normas internacionais (GAC, ISO 17065, GSO 2055-2, SMIIC)
✅ **Reduz tempo** de certificação em 60% (7-8 meses → 2-3 meses)
✅ **Integra IA** em 6 pontos críticos do processo

### 1.3 Diferenciais Competitivos (6 Inovações Tecnológicas)

O HalalSphere se diferencia por inovações que **nenhum competidor possui**:

#### 1. **Calculadora Inteligente de Custos Multi-Variável** 🚀
**Problema**: Criar propostas comerciais manualmente leva horas/dias, com inconsistências

**Inovação**: Algoritmo que considera simultaneamente:
- Tipo de certificação (C1-C6 conforme GSO 2055-2)
- Origem de produtos (animal/vegetal/misto)
- Quantidade de produtos e SKUs
- Número de turnos de produção
- Histórico da empresa (primeira certificação vs. renovação)
- Complexidade da cadeia de fornecedores
- Localização geográfica (custos de deslocamento)

**Resultado**: Proposta comercial profissional em **segundos** (vs. horas)

#### 2. **IA de Análise Pré-Auditoria** 🚀
**Problema**: Auditor chega sem contexto completo, desperdiça tempo analisando documentos básicos

**Inovação**: IA analisa documentação ANTES da auditoria:
- Extrai automaticamente: produtos, ingredientes, matérias-primas, fornecedores
- Identifica matérias-primas que exigem certificação Halal obrigatória
- Reconhece ingredientes em lista positiva (pré-aprovados)
- Alerta sobre produtos/ingredientes críticos
- Gera resumo executivo com pontos de atenção

**Resultado**: Auditor chega preparado, reduz tempo de auditoria em **30-40%**

#### 3. **Gestão de Contratos Colaborativa (Edição por Cláusulas)** 🚀
**Problema**: Negociação de contratos de 15-20 páginas leva 20-30 dias via e-mail

**Inovação**: Contrato estruturado em cláusulas individuais editáveis:
- Empresa e certificadora **editam/comentam cada cláusula** separadamente
- Versionamento automático completo
- Interface lado-a-lado (original vs. editado)
- Status granular por cláusula (Aprovada, Em Negociação, Rejeitada)
- Notificações em tempo real
- Assinatura digital integrada após aprovação

**Resultado**: Fechamento de contrato em **5-7 dias** (vs. 20-30 dias)

#### 4. **Calendário Inteligente de Auditorias com Otimização** 🚀
**Problema**: Coordenar 22 auditores para 600-700 empresas gera conflitos constantes

**Inovação**: Algoritmo de scheduling que considera:
- Disponibilidade em tempo real dos 22 auditores
- Especialização por setor (alimentos, farmacêuticos, químicos)
- Localização geográfica (otimiza rotas, minimiza deslocamentos)
- Carga de trabalho (balanceamento entre auditores)
- Histórico (rodízio, evita sempre o mesmo auditor)
- Impossibilita conflitos (auditor em dois lugares ao mesmo tempo)

**Resultado**: Zero conflitos de agenda + otimização de custos de deslocamento

#### 5. **Assistente Virtual Multilíngue Especializado** 🚀
**Problema**: SAC sobrecarregado, barreiras linguísticas, respostas demoram 24-48h

**Inovação**: Chatbot com IA treinada especificamente em certificação Halal:
- 4 idiomas: Português, Inglês, Árabe, Espanhol
- Base de conhecimento: Normas Halal (GSO, SMIIC), PR 7.1 completo, FAQs
- Acessa status do processo do cliente em tempo real
- RAG (Retrieval Augmented Generation) com documentação oficial
- Escalação inteligente para humano quando necessário
- Disponível 24/7

**Resultado**: 60-70% das dúvidas resolvidas sem intervenção humana, resposta em **< 1 minuto**

#### 6. **Workflow Automatizado com 12 Fases Rastreáveis** 🚀
**Problema**: Cliente não sabe status, precisa ligar constantemente

**Inovação**: Transparência total em tempo real:
- 12 fases visualizadas desde "Solicitação Enviada" até "Certificado Emitido"
- Notificações automáticas (e-mail/SMS/WhatsApp) a cada mudança
- Timeline visual com progresso e próximas etapas
- Estimativa de prazo dinâmica até conclusão
- Histórico completo (audit trail) de todas ações

**Resultado**: Redução de **80% em ligações reativas** de clientes

### 1.4 Escopo do MVP

**O MVP cobre o ciclo completo de certificação inicial** (primeira certificação).

#### ✅ Incluído no MVP

Baseado no **PR 7.1 Rev 21**:

- **Solicitação e Análise Preliminar** (PR 7.1 seções 10.1, 10.2)
- **Proposta Comercial e Contrato** (10.3)
- **Análise Documental - Estágio 1** (10.6)
- **Auditoria Presencial - Estágio 2** (10.7)
- **Gestão de Não-Conformidades** (10.7.7)
- **Decisão do Comitê** (10.9)
- **Emissão de Certificado Digital** (10.9)

#### ❌ Fora do MVP (Post-MVP)

- Auditorias de manutenção anual (10.10)
- Renovação trienal (13)
- Extensão de escopo (10.9.3)
- Testes laboratoriais (10.8)
- Suspensão/Cancelamento/Término (11, 12, 14)
- Integrações com ERPs de clientes
- App mobile nativo (MVP: web responsivo)
- Pagamentos online (processos financeiros permanecem externos)

### 1.5 Impacto Esperado

**Eficiência Operacional**:
- ⏱️ Redução de **60% no tempo** de certificação (7-8 meses → 2-3 meses)
- 📊 Aumento de **40% na capacidade** de processamento
- 🤖 Automação de **70% das tarefas** operacionais

**Qualidade e Conformidade**:
- ✅ **95% de conformidade** com PR 7.1
- 🔍 **100% de rastreabilidade** de decisões
- 📋 Zero não-conformidades em auditorias GAC/ISO 17065

**Satisfação e Experiência**:
- 😊 **NPS 50+** entre empresas certificadas
- ⚡ Tempo de resposta a dúvidas: **< 1 minuto** (vs. 24-48h)
- 📞 Redução de **80% em ligações reativas**

**Financeiro**:
- 💰 ROI positivo em **18 meses**
- 💵 Redução de **30% no custo operacional** por certificação
- 📈 Aumento de **25% na taxa de conversão** de leads

---

## 2. Objetivos e Métricas de Sucesso

### 2.1 Objetivos de Negócio (OKRs)

#### OKR 1: Reduzir Drasticamente o Tempo de Certificação
**Objetivo**: Transformar processo de 7-8 meses em 2-3 meses

**Key Results**:
- **KR1**: Tempo médio cai de 7-8 meses para **≤ 3 meses** até fim do Ano 1
- **KR2**: Tempo médio cai para **≤ 2 meses** até fim do Ano 2
- **KR3**: **90% das certificações** concluídas dentro do prazo estimado

**Medição**: Tempo médio desde "Solicitação Enviada" até "Certificado Emitido" por processo

---

#### OKR 2: Aumentar Capacidade Operacional sem Aumentar Headcount
**Objetivo**: Processar mais certificações com mesma equipe

**Key Results**:
- **KR1**: Processar **40% mais solicitações** com mesma equipe até fim do Ano 1
- **KR2**: Cada analista gerencia **60 processos simultâneos** (vs 40-50 atual)
- **KR3**: Reduzir tempo de análise documental em **50%** (de 14 dias para 7 dias)

**Medição**:
- Número de certificações processadas por trimestre
- Processos ativos por analista
- Tempo médio de análise documental (Estágio 1)

---

#### OKR 3: Garantir Conformidade Total com PR 7.1 e Padrões Internacionais
**Objetivo**: 100% de aderência e rastreabilidade para auditorias de acreditação

**Key Results**:
- **KR1**: **95% de aderência** ao PR 7.1 em todos processos auditados
- **KR2**: **Zero não-conformidades** em auditorias de acreditação (GAC, ISO 17065)
- **KR3**: **100% de rastreabilidade** de decisões com audit trail completo

**Medição**:
- Auditoria interna trimestral de conformidade
- Resultado de auditorias externas (GAC)
- % de processos com rastreabilidade completa

---

#### OKR 4: Maximizar Satisfação de Todos Stakeholders
**Objetivo**: Transformar experiência de frustrante para excepcional

**Key Results**:
- **KR1**: **NPS 50+** entre empresas certificadas
- **KR2**: **85% das empresas** avaliam processo como "excelente" ou "bom"
- **KR3**: **Taxa de renovação de 95%** (vs ~85% atual)

**Medição**:
- Pesquisa NPS após emissão de certificado
- CSAT por jornada (solicitação, auditoria, pós-certificação)
- Taxa de renovação após 3 anos

---

### 2.2 Métricas de Produto (KPIs)

#### Categoria: Eficiência Operacional

| Métrica | Baseline Atual | Meta MVP | Meta Ano 1 | Medição |
|---------|---------------|----------|-----------|---------|
| **Tempo médio de análise documental (Estágio 1)** | 14 dias | 10 dias | 7 dias | Média de dias entre "Docs Submetidos" → "Estágio 1 Aprovado" |
| **Tempo médio para agendamento de auditoria** | 21 dias | 14 dias | 10 dias | Média de dias entre "Estágio 1 Aprovado" → "Auditoria Agendada" |
| **Tempo médio de decisão do comitê** | 15 dias | 10 dias | 7 dias | Média de dias entre "Submetido ao Comitê" → "Decisão Registrada" |
| **Tempo de fechamento de contrato** | 20-30 dias | 10 dias | 5-7 dias | Média de dias entre "Contrato Enviado" → "Contrato Assinado" |
| **Taxa de automação de tarefas** | 10% | 50% | 70% | % de tarefas executadas sem intervenção manual |

#### Categoria: Qualidade e Conformidade

| Métrica | Baseline Atual | Meta MVP | Meta Ano 1 | Medição |
|---------|---------------|----------|-----------|---------|
| **Taxa de re-trabalho** | ~15% | <8% | <5% | % de documentos/processos que precisam ser refeitos |
| **Conformidade com PR 7.1** | ~80% | 90%+ | 95%+ | Auditoria interna de processos |
| **Processos com rastreabilidade completa** | ~60% | 95% | 100% | % de processos com audit trail completo |
| **Taxa de aprovação do comitê na 1ª revisão** | ~70% | 80% | 85% | % de processos aprovados sem voltar para ajustes |

#### Categoria: Adoção e Engajamento

| Métrica | Meta MVP | Meta Ano 1 | Medição |
|---------|----------|-----------|---------|
| **Taxa de adoção (empresas)** | 80% | 100% | % de novos processos iniciados via sistema (vs. manual) |
| **Taxa de adoção (auditores)** | 70% | 100% | % de auditorias registradas via app mobile |
| **Taxa de uso do chatbot IA** | 50% | 60% | % de usuários que interagem com chatbot |
| **Taxa de resolução automática (chatbot)** | 50% | 60-70% | % de dúvidas resolvidas sem escalação humana |
| **Frequência de acesso ao sistema** | 2x/semana | 3x/semana | Média de logins por empresa por semana |

#### Categoria: Satisfação e Experiência

| Métrica | Meta MVP | Meta Ano 1 | Medição |
|---------|----------|-----------|---------|
| **NPS Empresas Certificadas** | 40+ | 50+ | Pesquisa após emissão de certificado |
| **NPS Equipe Interna** | 30+ | 40+ | Pesquisa trimestral |
| **CSAT por jornada** | 4.0/5 | 4.5/5 | Avaliação em cada milestone do processo |
| **Tempo de resposta a dúvidas** | < 5 min | < 1 min | Média de tempo de resposta do chatbot IA |
| **Redução em ligações reativas** | 60% | 80% | Comparação com baseline de ligações/e-mails |

---

## 3. Personas e Jornadas

### 3.1 Persona 1: Ahmad - Gerente de Qualidade (Empresa Solicitante)

**Perfil Demográfico**:
- **Idade**: 42 anos
- **Cargo**: Gerente de Qualidade e Compliance
- **Empresa**: Indústria alimentícia de médio porte (150 funcionários)
- **Localização**: São Paulo, Brasil
- **Idiomas**: Português, Inglês básico

**Contexto**:
Ahmad é responsável por garantir que a empresa atenda todos os padrões de qualidade e certificações necessários para exportar para mercados muçulmanos (Oriente Médio, Indonésia, Malásia). Ele já gerenciou certificações ISO 9001 e FSSC 22000, mas esta é a primeira vez lidando com certificação Halal.

**Dores (Pain Points)**:
- 😣 **Falta de transparência**: "Não sei em que etapa está o processo. Preciso ligar toda semana para perguntar status."
- 😣 **Complexidade documental**: "Não entendo quais documentos são obrigatórios. A lista é confusa e muda sempre."
- 😣 **Comunicação fragmentada**: "Recebo e-mails de 3 pessoas diferentes. Não sei quem é responsável pelo meu processo."
- 😣 **Prazos longos**: "Solicitei em Janeiro, estamos em Agosto e ainda não recebi o certificado."
- 😣 **Dificuldade com não-conformidades**: "A auditoria identificou 5 NCs. Não sei exatamente o que fazer para resolver."

**Objetivos (Jobs to be Done)**:
1. ✅ Obter certificação Halal **o mais rápido possível** (meta: 3 meses)
2. ✅ Ter **visibilidade completa** do status em tempo real
3. ✅ Receber **comunicação clara** sobre requisitos e próximas ações
4. ✅ Tratar não-conformidades de forma **eficiente e rastreável**
5. ✅ Ter suporte quando tiver dúvidas (**respostas rápidas**, não em 48h)

**Comportamento Típico**:
- Acessa o sistema **2-3x por semana** para verificar status
- Prefere notificações proativas (e-mail/WhatsApp) a ter que buscar informação
- Pode ter dificuldade com português técnico (usa o chatbot em inglês às vezes)
- Quer baixar certificado digital assim que emitido e compartilhar com clientes

**Jornada no HalalSphere**:
```
1. Cadastro Online → 2. Solicitação (Wizard) → 3. Upload Documentos →
4. Acompanha Proposta Comercial → 5. Negocia/Assina Contrato Digital →
6. Acompanha Análise Documental → 7. Prepara Auditoria → 8. Recebe/Trata NCs →
9. Acompanha Decisão do Comitê → 10. Recebe Certificado Digital
```

**Citações Representativas**:
> "Eu só quero saber: o processo está andando ou parado? Por que ninguém me avisa quando algo muda?"

> "A certificação ISO foi muito mais transparente. Eu via exatamente o que estava acontecendo."

---

### 3.2 Persona 2: Mariana - Analista de Certificação Sênior

**Perfil Demográfico**:
- **Idade**: 35 anos
- **Cargo**: Analista de Certificação Sênior
- **Experiência**: 8 anos em certificação Halal
- **Formação**: Engenheira de Alimentos + Especialização em Certificação
- **Localização**: São Paulo, Brasil

**Contexto**:
Mariana gerencia atualmente 45 processos de certificação simultâneos em diferentes fases. Ela é responsável por: revisar solicitações, criar propostas comerciais, analisar documentação (Estágio 1), coordenar auditores, preparar casos para o comitê. Ela trabalha 8-10h/dia e frequentemente leva trabalho para casa.

**Dores (Pain Points)**:
- 😣 **Sobrecarga de trabalho**: "Gerencio 45 processos. É impossível lembrar de tudo. Preciso de planilhas Excel paralelas."
- 😣 **Análise documental manual**: "Gasto 3-4 horas revisando documentos de cada empresa. É repetitivo e cansativo."
- 😣 **Criação de propostas demorada**: "Fazer proposta comercial manualmente leva 2-3 horas. Tenho que calcular tudo no Excel."
- 😣 **Coordenação de auditores complexa**: "Ligar para 5 auditores até encontrar um disponível. Às vezes marco auditoria e depois descubro conflito."
- 😣 **Falta de padronização**: "Cada analista faz do seu jeito. Difícil garantir conformidade consistente com PR 7.1."
- 😣 **Comunicação dispersa**: "E-mails perdidos, WhatsApp misturado com pessoal, não consigo achar histórico."

**Objetivos (Jobs to be Done)**:
1. ✅ Ter **dashboard claro** com todos os 45-60 processos priorizados
2. ✅ **Automatizar tarefas repetitivas** (propostas, relatórios, checklists)
3. ✅ **Análise documental assistida** por IA (identifica gaps automaticamente)
4. ✅ **Comunicação centralizada** com empresas e auditores
5. ✅ **Garantir conformidade** com PR 7.1 em todos processos
6. ✅ Gerenciar **60 processos simultâneos** sem aumentar horas trabalhadas

**Comportamento Típico**:
- Passa 60% do tempo analisando documentos manualmente
- Usa checklists físicos/Excel para garantir conformidade com PR 7.1
- Precisa coordenar auditores (agendamento, briefing) via telefone/WhatsApp
- Prepara dossiês para o comitê manualmente (compilando PDFs, Word, etc.)
- Frustra-se com retrabalho (empresa envia documento errado 3 vezes)

**Jornada no HalalSphere**:
```
1. Revisa Solicitação → 2. Enquadra conforme GSO/SMIIC → 3. Gera Proposta (Auto) →
4. Gerencia Contrato Colaborativo → 5. Analisa Docs (Estágio 1 com IA) →
6. Agenda Auditoria (Calendário Inteligente) → 7. Acompanha Auditoria →
8. Prepara Dossiê (Auto) → 9. Submete ao Comitê
```

**Citações Representativas**:
> "Se eu tivesse um sistema que calculasse a proposta automaticamente e me mostrasse o que está faltando nos documentos, eu conseguiria gerenciar o dobro de processos."

> "O maior gargalo é o contrato. Fico 3 semanas trocando e-mails com a empresa. Se tivesse um jeito colaborativo..."

---

### 3.3 Persona 3: Khalil - Auditor Halal Certificado

**Perfil Demográfico**:
- **Idade**: 48 anos
- **Cargo**: Auditor Halal Certificado (GAC + ISO 17065)
- **Experiência**: 15 anos em auditoria Halal
- **Especialização**: Alimentos (laticínios, cárneos, panificação)
- **Localização**: Campinas, SP (atende região Sudeste)
- **Idiomas**: Português, Árabe, Inglês

**Contexto**:
Khalil realiza 3-5 auditorias presenciais por semana em indústrias de alimentos. Ele viaja constantemente (média de 200km/dia). Atualmente registra auditorias em relatórios Word que depois digita e envia por e-mail. Ele tem smartphone Android mas não usa muitos apps.

**Dores (Pain Points)**:
- 😣 **Agendamento manual ineficiente**: "Recebo ligação: 'Pode auditar empresa X dia Y?' Às vezes já tenho compromisso e ninguém sabia."
- 😣 **Relatórios em Word demoram**: "Faço anotações em papel durante auditoria. Depois passo 3-4 horas digitando relatório em Word."
- 😣 **Falta de contexto antes da auditoria**: "Chego na empresa e só lá descubro que fabricam 50 produtos. Deveria ter me preparado melhor."
- 😣 **Follow-up manual de NCs**: "Identifico NC, registro, depois preciso ligar para empresa perguntar se tratou. É desorganizado."
- 😣 **Dificuldade em acessar histórico**: "Já auditei esta empresa antes? Quais NCs foram encontradas? Não lembro, não acho o relatório anterior."

**Objetivos (Jobs to be Done)**:
1. ✅ Ter **agenda clara e organizada** (sem conflitos)
2. ✅ Receber **briefing completo** antes de cada auditoria (contexto da empresa, produtos, histórico)
3. ✅ Usar **app mobile simples** para registrar auditoria in loco (offline)
4. ✅ **Gerar relatório automaticamente** (sem digitação manual)
5. ✅ Ter **histórico completo** da empresa (auditorias anteriores, NCs, tratamentos)
6. ✅ Maximizar número de auditorias/mês **sem aumentar horas trabalhadas**

**Comportamento Típico**:
- Realiza 3-5 auditorias por semana (segundas a sextas)
- Precisa acessar informações offline (durante auditoria pode não ter WiFi)
- Tira 20-30 fotos como evidências por auditoria
- Emite relatórios com não-conformidades (Maiores e Menores) que precisam follow-up
- Prefere interfaces simples e intuitivas (não é tech-savvy)

**Jornada no HalalSphere**:
```
1. Vê Agenda (App Mobile) → 2. Recebe Briefing Automático + IA →
3. Navega até Empresa (GPS) → 4. Executa Auditoria (App Offline) →
5. Registra Evidências (Fotos/Checklist) → 6. Identifica NCs →
7. Gera Relatório (Auto) → 8. Submete → 9. Acompanha Tratamento de NCs
```

**Citações Representativas**:
> "Se eu soubesse ANTES da auditoria que a empresa usa glicerina de origem animal, eu já levaria a lista de certificados necessários. Economiza 1 hora de auditoria."

> "Passar 4 horas digitando relatório depois de um dia cansativo de auditoria é frustrante. Deveria ser automático."

---

### 3.4 Persona 4: Sheikh Abdullah - Membro do Comitê Técnico de Decisão

**Perfil Demográfico**:
- **Idade**: 58 anos
- **Cargo**: Membro do Comitê Técnico (especialista em Jurisprudência Islâmica)
- **Experiência**: 25 anos em certificação Halal
- **Formação**: Graduação em Shariah + Especialização em Alimentos
- **Localização**: São Paulo, Brasil
- **Idiomas**: Árabe, Português

**Contexto**:
Sheikh Abdullah participa de reuniões mensais do comitê técnico para decidir sobre concessão/negação de certificações. Ele revisa 10-15 casos por reunião. Atualmente recebe dossiês em PDF por e-mail (alguns com 100+ páginas), difíceis de navegar e sem estrutura padronizada.

**Dores (Pain Points)**:
- 😣 **Documentação dispersa**: "Recebo 5 PDFs por caso. Relatório do analista, relatório do auditor, fotos, documentos... Difícil achar informação."
- 😣 **Reuniões longas**: "Passamos 3-4 horas revisando 15 casos. Muito tempo gasto procurando informação básica."
- 😣 **Falta de contexto**: "Difícil acessar histórico de decisões similares. Já certificamos empresa parecida? Qual foi a decisão?"
- 😣 **Rastreabilidade limitada**: "Tomei decisão há 6 meses. Por que decidi assim? Não lembro, não acho justificativa."
- 😣 **Falta de estrutura padronizada**: "Cada dossiê vem de um jeito. Alguns analistas são mais detalhados, outros não."

**Objetivos (Jobs to be Done)**:
1. ✅ Receber **dossiê completo e estruturado** para cada caso (tudo em um lugar)
2. ✅ Acessar **histórico de auditorias e decisões anteriores** da empresa
3. ✅ Ter **processo de deliberação ágil** (reduzir tempo de reunião)
4. ✅ Registrar **justificativas detalhadas** com rastreabilidade total
5. ✅ Buscar **casos similares anteriores** para consistência de decisões

**Comportamento Típico**:
- Participa de reuniões mensais do comitê (3-4h por reunião)
- Revisa 10-15 casos por reunião (média de 15-20 min por caso)
- Precisa de informações técnicas (análises) E religiosas (conformidade com Shariah)
- Documenta justificativas detalhadas para cada decisão
- Pode votar: Aprovar / Aprovar com Condições / Negar / Solicitar Mais Informações

**Jornada no HalalSphere**:
```
1. Acessa Painel de Casos Pendentes → 2. Seleciona Caso →
3. Revisa Dossiê Completo Estruturado → 4. Revisa Histórico (se houver) →
5. Consulta Casos Similares → 6. Delibera e Vota Digitalmente →
7. Registra Justificativa Detalhada → 8. Assina Digitalmente
```

**Citações Representativas**:
> "Se o dossiê viesse estruturado - resumo executivo, análise técnica, pontos críticos, recomendação - eu revisaria em 10 minutos ao invés de 20."

> "Preciso saber: já certificamos esta empresa antes? Houve NCs graves? Como foram tratadas? Essa informação deveria estar à vista."

---

### 3.5 Persona 5: Fernanda - Coordenadora Administrativa

**Perfil Demográfico**:
- **Idade**: 38 anos
- **Cargo**: Coordenadora Administrativa e Financeira
- **Responsabilidade**: Gestão operacional, financeira, compliance e métricas
- **Experiência**: 12 anos na organização certificadora
- **Formação**: Administração + MBA em Gestão
- **Localização**: São Paulo, Brasil

**Contexto**:
Fernanda gerencia a operação completa da certificadora: acompanha KPIs, gera relatórios para diretoria, garante conformidade com GAC/ISO 17065, gerencia contratos e precificação. Atualmente usa múltiplas planilhas Excel e não consegue ter visão consolidada em tempo real.

**Dores (Pain Points)**:
- 😣 **Falta de visibilidade consolidada**: "Preciso perguntar para 5 pessoas para saber quantas certificações emitimos no trimestre."
- 😣 **Gestão manual de propostas**: "Propostas comerciais são feitas em Excel por cada analista. Não sei se precificação está consistente."
- 😣 **Dificuldade em extrair métricas**: "Quero saber tempo médio por fase. Não tenho. Uso Excel com datas manualmente."
- 😣 **Conformidade auditável difícil de comprovar**: "Auditoria do GAC pede rastreabilidade de decisões. Busco em e-mails, PDFs... É caótico."
- 😣 **Sem previsibilidade**: "Não consigo prever quantas certificações vamos emitir no próximo mês. Prejudica planejamento financeiro."

**Objetivos (Jobs to be Done)**:
1. ✅ Ter **dashboards executivos com KPIs** atualizados em tempo real
2. ✅ **Automatizar propostas comerciais** (precificação consistente)
3. ✅ **Gestão de contratos digital** e centralizada
4. ✅ Gerar **relatórios de conformidade com PR 7.1** para auditorias GAC/ISO
5. ✅ **Visibilidade total do pipeline** (quantas solicitações, em que fase, previsão de conclusão)
6. ✅ Ter **métricas de eficiência** (tempo por fase, gargalos, taxa de aprovação)

**Comportamento Típico**:
- Acessa dashboards diariamente (primeira coisa de manhã)
- Gera relatórios mensais para diretoria executiva
- Gerencia relacionamento com empresas certificadas (renovações, issues)
- Garante conformidade com padrões internacionais (auditorias externas)
- Precisa de exportações (Excel, PDF) para análises offline

**Jornada no HalalSphere**:
```
1. Acessa Dashboard Executivo → 2. Revisa KPIs em Tempo Real →
3. Identifica Gargalos/Atrasos → 4. Analisa Tendências →
5. Gera Relatórios para Diretoria → 6. Gerencia Usuários e Permissões →
7. Monitora Conformidade PR 7.1 → 8. Exporta Dados para Auditorias Externas
```

**Citações Representativas**:
> "Eu preciso de um dashboard que me mostre: quantos processos ativos, quantos atrasados, tempo médio por fase. Hoje eu não tenho isso."

> "Quando o GAC audita, eles pedem rastreabilidade completa. Hoje eu entro em pânico. No sistema deveria ser um clique."

---

## 4. Arquitetura de Features (Épicos)

### 4.1 Estrutura Hierárquica

```
HalalSphere MVP (Baseado em PR 7.1 Rev 21)
│
├── ÉPICO 1: Gestão de Solicitações e Onboarding (Empresas)
│   ├── Feature 1.1: Cadastro e Solicitação de Certificação
│   ├── Feature 1.2: Dashboard de Acompanhamento em Tempo Real
│   ├── Feature 1.3: Gestão de Documentação Centralizada
│   └── Feature 1.4: Tratamento de Não-Conformidades (Empresa)
│
├── ÉPICO 2: Gestão Comercial e Contratual (Inovação 🚀)
│   ├── Feature 2.1: Calculadora Inteligente de Custos Multi-Variável
│   ├── Feature 2.2: Geração de Propostas Comerciais
│   └── Feature 2.3: Contratos Colaborativos por Cláusulas (Inovação)
│
├── ÉPICO 3: Análise e Preparação (Analistas)
│   ├── Feature 3.1: Painel de Controle de Processos (Kanban)
│   ├── Feature 3.2: Análise de Solicitação e Enquadramento (GSO/SMIIC)
│   ├── Feature 3.3: Análise Documental (Estágio 1) com IA
│   └── Feature 3.4: Coordenação de Auditoria com Calendário Inteligente (Inovação)
│
├── ÉPICO 4: Execução de Auditorias (Auditores + Inovação 🚀)
│   ├── Feature 4.1: Agenda de Auditorias (App Mobile)
│   ├── Feature 4.2: Preparação com IA de Suporte ao Auditor (Inovação)
│   ├── Feature 4.3: Execução de Auditoria (App Mobile Offline)
│   └── Feature 4.4: Relatório de Auditoria (Geração Automática)
│
├── ÉPICO 5: Decisão e Emissão de Certificados (Comitê)
│   ├── Feature 5.1: Painel de Casos Pendentes do Comitê
│   ├── Feature 5.2: Dossiê de Certificação Estruturado
│   ├── Feature 5.3: Deliberação e Votação Digital
│   └── Feature 5.4: Emissão de Certificados Digitais com QR Code
│
├── ÉPICO 6: Assistente IA Multilíngue (Inovação 🚀)
│   ├── Feature 6.1: Chatbot para Empresas (4 idiomas, RAG)
│   └── Feature 6.2: Assistente IA para Analistas (OCR, NLP)
│
├── ÉPICO 7: Gestão Administrativa e Dashboards (Coordenação)
│   ├── Feature 7.1: Dashboards Executivos com KPIs
│   ├── Feature 7.2: Relatórios de Conformidade PR 7.1 (Auditorias GAC/ISO)
│   └── Feature 7.3: Gestão de Usuários e Permissões (RBAC)
│
└── ÉPICO 8: Infraestrutura e Fundação (Base Técnica)
    ├── Feature 8.1: Autenticação e Autorização (JWT + RBAC)
    ├── Feature 8.2: Sistema de Notificações (E-mail, SMS, Push)
    ├── Feature 8.3: Central de Mensagens (Chat Interno)
    ├── Feature 8.4: Audit Trail e Logs (Rastreabilidade Total)
    └── Feature 8.5: Upload e Storage de Documentos (S3/Blob)
```

### 4.2 Priorização MoSCoW

| Épico | Prioridade | Justificativa | Impacto no MVP |
|-------|-----------|---------------|----------------|
| **Épico 8** | **Must Have (P0)** | Fundação técnica: sem auth, notificações e storage nada funciona | 🔴 Crítico - Bloqueante |
| **Épico 1** | **Must Have (P0)** | Porta de entrada: empresas solicitam certificação | 🔴 Crítico |
| **Épico 2** | **Must Have (P0)** | Maior gargalo identificado: contratos demoram 20-30 dias | 🔴 Crítico - Diferencial |
| **Épico 3** | **Must Have (P0)** | Coração do processo: analistas coordenam tudo | 🔴 Crítico |
| **Épico 4** | **Must Have (P0)** | Maior tempo consumido: auditorias são essenciais (Estágio 2) | 🔴 Crítico |
| **Épico 5** | **Must Have (P0)** | Decisão final: sem comitê não há certificado | 🔴 Crítico |
| **Épico 6** | **Should Have (P1)** | Diferencial competitivo: mas sistema funciona sem IA inicialmente | 🟡 Importante |
| **Épico 7** | **Should Have (P1)** | Gestão: importante mas não bloqueia certificação individual | 🟡 Importante |

### 4.3 Estimativa de Esforço

| Épico | User Stories | Story Points | Duração Estimada | Dependências Críticas |
|-------|-------------|-------------|-----------------|----------------------|
| **Épico 8** | 8 stories | 55 SP | Sprint 1-2 (4 semanas) | Nenhuma (fundação) |
| **Épico 1** | 8 stories | 60 SP | Sprint 2-3 (4 semanas) | Épico 8 |
| **Épico 2** | 9 stories | 80 SP | Sprint 3-5 (6 semanas) | Épico 1, Épico 8 |
| **Épico 3** | 12 stories | 90 SP | Sprint 4-6 (6 semanas) | Épico 1, Épico 2 |
| **Épico 4** | 10 stories | 100 SP | Sprint 6-8 (6 semanas) | Épico 3, App Mobile |
| **Épico 5** | 8 stories | 50 SP | Sprint 8-9 (4 semanas) | Épico 3, Épico 4 |
| **Épico 6** | 6 stories | 80 SP | Sprint 9-10 (4 semanas) | Integração IA (OpenAI/Claude) |
| **Épico 7** | 6 stories | 40 SP | Sprint 10 (2 semanas) | Todos épicos anteriores |
| **TOTAL MVP** | **67 stories** | **555 SP** | **10 sprints (20 semanas)** | - |

**Velocidade assumida**: 55-60 SP por sprint (time de 6-8 pessoas)

---

## 5. User Stories Detalhadas

### ÉPICO 1: Gestão de Solicitações e Onboarding

#### 📋 Feature 1.1: Cadastro e Solicitação de Certificação

##### **US-001: Cadastro de Nova Empresa Solicitante**

```
Como empresa interessada em certificação Halal,
Eu quero me cadastrar no HalalSphere com meus dados básicos,
Para que eu possa iniciar o processo de solicitação de certificação.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-080 (Autenticação e Autorização)

**Acceptance Criteria**:

- [ ] **Sistema exibe landing page pública** com:
  - Explicação do que é certificação Halal
  - Benefícios de certificar com a organização
  - Passo a passo do processo de certificação (timeline visual)
  - Botão destacado: "Solicitar Certificação"
  - Link para chatbot IA para dúvidas antes de cadastrar

- [ ] **Sistema exibe formulário de cadastro** solicitando:
  - **Dados da Empresa**:
    - Razão Social (obrigatório, min 3 caracteres)
    - Nome Fantasia (opcional)
    - CNPJ (obrigatório, formato: XX.XXX.XXX/XXXX-XX)
    - Inscrição Estadual (opcional)
  - **Endereço Completo**:
    - CEP (obrigatório, com busca automática de endereço via API ViaCEP)
    - Logradouro, Número, Complemento
    - Bairro, Cidade, Estado, País
  - **Contatos**:
    - Nome do Responsável (obrigatório)
    - Cargo do Responsável (obrigatório)
    - E-mail Corporativo (obrigatório, validação de formato)
    - Telefone Fixo (opcional)
    - Telefone Celular/WhatsApp (obrigatório, formato internacional)
    - Idioma preferencial: Português / Inglês / Árabe / Espanhol
  - **Tipo de Indústria** (obrigatório, seleção única):
    - Alimentos (geral)
    - Alimentos - Laticínios
    - Alimentos - Cárneos
    - Alimentos - Panificação
    - Alimentos - Bebidas
    - Farmacêuticos
    - Químicos
    - Cosméticos
    - Outros (campo de texto livre)

- [ ] **Sistema valida CNPJ**:
  - Formato correto (14 dígitos numéricos)
  - Dígitos verificadores corretos (algoritmo de validação)
  - CNPJ não está cadastrado previamente (sem duplicatas)
  - Se CNPJ já existe: exibe mensagem "Esta empresa já está cadastrada. Deseja recuperar acesso?"

- [ ] **Sistema valida e-mail**:
  - Formato válido (regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
  - E-mail não está cadastrado previamente
  - Se e-mail já existe: exibe mensagem "E-mail já cadastrado. Esqueceu sua senha?"

- [ ] **Sistema valida telefone**:
  - Formato internacional aceito
  - Valida código do país e DDD/Área

- [ ] **Sistema aplica integração com ViaCEP**:
  - Ao digitar CEP, busca endereço automaticamente
  - Preenche Logradouro, Bairro, Cidade, Estado automaticamente
  - Permite edição manual caso endereço retornado esteja incorreto

- [ ] **Após submit do formulário, sistema**:
  - Cria registro da empresa no banco de dados
  - Cria usuário com perfil "Empresa" automaticamente
  - Gera senha temporária segura (8 caracteres, incluindo maiúsculas, minúsculas, números, símbolos)
  - Envia e-mail de confirmação de cadastro contendo:
    - Boas-vindas
    - Instruções para primeiro login
    - Link para definir senha (token válido por 24h)
    - Link para acessar o portal
    - Contato de suporte (e-mail, telefone)

- [ ] **Sistema redireciona usuário** para página de login com mensagem:
  - "Cadastro realizado com sucesso! Verifique seu e-mail para definir sua senha e acessar o portal."

- [ ] **Sistema registra audit trail**:
  - Timestamp de cadastro
  - IP de origem
  - User agent (navegador)

**Regras de Negócio**:

- **RN-001**: CNPJ deve ser válido e único no sistema
- **RN-002**: E-mail deve ser único no sistema (não permite duplicatas)
- **RN-003**: Idioma preferencial define idioma padrão do sistema para aquele usuário
- **RN-004**: Tipo de indústria influencia requisitos documentais e cálculo de proposta comercial

**Casos de Uso Alternativos**:

- **Caso 1**: CNPJ já cadastrado → Sistema oferece opção "Recuperar Acesso" ou "Adicionar Novo Contato"
- **Caso 2**: E-mail já cadastrado → Sistema oferece "Esqueci Minha Senha"
- **Caso 3**: CEP não encontrado → Sistema permite preenchimento manual completo do endereço
- **Caso 4**: Usuário abandona formulário → Sistema salva draft (se usuário criou conta parcialmente)

**UX/UI Considerations**:

- Formulário em **wizard de 3 etapas**:
  - Etapa 1: Dados da Empresa (Razão Social, CNPJ, Tipo de Indústria)
  - Etapa 2: Endereço Completo
  - Etapa 3: Contatos e Responsáveis
- Barra de progresso visual: "Etapa 1 de 3"
- Validação em tempo real (feedback instantâneo ao sair do campo)
- Mensagens de erro claras e próximas ao campo com erro
- Opção de salvar e continuar depois (draft)
- Botão de ajuda/chatbot sempre visível

**Testes**:

- [ ] Teste de unidade: Validação de CNPJ (casos válidos e inválidos)
- [ ] Teste de unidade: Validação de e-mail (formatos válidos e inválidos)
- [ ] Teste de integração: Integração com ViaCEP (CEP válido, inválido, API fora do ar)
- [ ] Teste de segurança: SQL injection, XSS em campos de texto livre
- [ ] Teste de usabilidade: Usuário real completa cadastro em < 5 minutos

---

##### **US-002: Formulário de Solicitação de Certificação Estruturado**

```
Como empresa cadastrada,
Eu quero preencher um formulário estruturado de solicitação de certificação,
Para que a certificadora tenha todas as informações necessárias para analisar meu pedido conforme PR 7.1 seção 10.1.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 13 story points
**Dependências**: US-001 (Cadastro), US-003 (Upload de Documentos), US-081 (Storage)

**Contexto do PR 7.1 (Seção 10.1 - Análise Crítica de Solicitação)**:
O sistema deve coletar informações suficientes para que o analista possa:
- Avaliar se a organização é elegível para certificação
- Determinar o escopo apropriado (C1-C6)
- Identificar produtos e categorias GSO 2055-2 / SMIIC 02
- Calcular man-hour de auditoria (PR 7.1 10.7.4)

**Acceptance Criteria**:

- [ ] **Sistema exibe wizard estruturado em 5 etapas**:

**ETAPA 1: Dados Gerais da Empresa**
- [ ] Sistema pré-preenche dados do cadastro (Razão Social, CNPJ, Endereço, Contatos)
- [ ] Permite edição se houver mudanças desde o cadastro
- [ ] Solicita informações adicionais:
  - Ano de fundação da empresa
  - Número total de funcionários (classificação: Pequena <50, Média 50-250, Grande >250)
  - Website da empresa (opcional)
  - Já possui certificação Halal? (Sim/Não)
    - Se Sim: Qual certificadora? Número do certificado? Validade?
  - Já passou por auditoria Halal antes? (Sim/Não)
    - Se Sim: Quando? Resultado?
  - Possui outras certificações? (opcional, múltipla seleção):
    - ISO 9001 (Qualidade)
    - ISO 22000 (Segurança de Alimentos)
    - FSSC 22000
    - BRC
    - IFS
    - Orgânico
    - Kosher
    - Outras (campo de texto)
- [ ] Botão "Salvar e Continuar"

**ETAPA 2: Escopo da Certificação e Produtos**
- [ ] Sistema solicita:
  - **Tipo de certificação desejada** (seleção única, exibe descrição de cada):
    - C1: Produtos de origem vegetal sem processamento que altere características
    - C2: Produtos de origem vegetal com processamento
    - C3: Produtos com ingredientes de origem animal
    - C4: Produtos onde álcool é usado no processo
    - C5: Linha compartilhada com produtos não-Halal
    - C6: Produtos de origem animal (abate)
    - ? (Não sei qual categoria) → Sistema oferece ajuda do chatbot IA
  - **Origem dos produtos** (seleção única):
    - Vegetal
    - Animal
    - Misto (Vegetal + Animal)
  - **Lista de produtos a serem certificados**:
    - Opção 1: Upload de planilha (template fornecido: Excel/CSV com colunas: Nome do Produto, Descrição, Categoria GSO, Ingredientes Principais)
    - Opção 2: Preenchimento manual via interface:
      - Nome do produto (obrigatório)
      - Descrição breve (opcional)
      - Categoria GSO 2055-2 sugerida (lista suspensa com 22 categorias)
      - Ingredientes principais (campo de texto livre, separados por vírgula)
      - Botão "Adicionar Mais Um Produto"
  - **Total de produtos** a certificar (calculado automaticamente ou inserido manualmente)
  - **Total de SKUs** (Stock Keeping Units) se diferente de produtos

- [ ] Sistema fornece:
  - Link para download do template de planilha de produtos (Excel)
  - Link para consultar categorias GSO 2055-2 completas (PDF)
  - Botão de ajuda: "Não sei qual categoria escolher" → Abre chatbot IA

- [ ] Sistema valida:
  - Pelo menos 1 produto cadastrado (obrigatório)
  - Se planilha enviada: valida formato (colunas corretas)
  - Se preenchimento manual: valida que campos obrigatórios estão preenchidos

- [ ] Botão "Salvar e Continuar"

**ETAPA 3: Produção e Processos**
- [ ] Sistema solicita:
  - **Número de turnos de produção**:
    - 1 turno (até 8h/dia)
    - 2 turnos (até 16h/dia)
    - 3 turnos (24h/dia - ininterrupto)
  - **Capacidade produtiva estimada**:
    - Unidade (kg/mês, litros/mês, unidades/mês)
    - Volume (número)
  - **Processos de fabricação utilizados** (múltipla seleção):
    - Mistura
    - Cozimento
    - Fermentação
    - Assamento
    - Fritura
    - Pasteurização
    - Esterilização
    - Embalagem
    - Armazenamento refrigerado
    - Congelamento
    - Outros (campo de texto livre)
  - **Linha de produção**:
    - Exclusiva para produtos Halal? (Sim/Não)
    - Se Não: É compartilhada com quais tipos de produtos? (texto livre)
    - Como é feita a higienização entre lotes? (texto livre)
  - **Utiliza álcool etílico em algum processo?** (Sim/Não)
    - Se Sim: Para qual finalidade? (extração, aromatização, conservação, etc.)
    - Se Sim: O álcool é completamente evaporado no processo final? (Sim/Não)

- [ ] Botão "Salvar e Continuar"

**ETAPA 4: Matérias-Primas e Fornecedores**
- [ ] Sistema solicita:
  - **Quantidade total de fornecedores** de matérias-primas (número)
  - **Lista de fornecedores principais** (top 10-20):
    - Opção 1: Upload de planilha (template: Nome, CNPJ, Material Fornecido, Origem)
    - Opção 2: Preenchimento manual:
      - Nome do fornecedor (obrigatório)
      - CNPJ (opcional, mas recomendado)
      - Material/Matéria-prima fornecida (obrigatório)
      - Origem (Nacional/Importado)
      - Possui certificado Halal? (Sim/Não/Não Sei)
        - Se Sim: Upload do certificado (PDF) ou número do certificado
      - Botão "Adicionar Mais Um Fornecedor"
  - **Matérias-primas de origem animal utilizadas** (se aplicável):
    - Nome da matéria-prima (ex: Gelatina, Lecitina, Glicerina, Gordura, etc.)
    - Origem animal (Bovina, Suína, Aviária, Peixe, Outras)
    - Fornecedor
    - Possui certificado Halal? (Sim/Não)
  - **Aditivos utilizados** (se aplicável):
    - Lista de códigos E (ex: E471, E322, E422)
    - Sistema alerta automaticamente se aditivo é crítico (pode conter origem animal)

- [ ] Sistema fornece:
  - Link para download do template de planilha de fornecedores (Excel)
  - Lista de aditivos críticos (PDF ou link)
  - Alerta visual: "Atenção: Detectamos matérias-primas que exigem certificado Halal obrigatório"

- [ ] Botão "Salvar e Continuar"

**ETAPA 5: Documentos Obrigatórios (Checklist)**
- [ ] Sistema exibe checklist de documentos obrigatórios baseado em:
  - Tipo de certificação solicitada
  - Tipo de indústria
  - Origem de produtos (animal exige mais documentos)

- [ ] Checklist padrão (PR 7.1 10.1):
  - [ ] Contrato Social ou Estatuto da Empresa
  - [ ] Licença de Funcionamento válida (Vigilância Sanitária, Anvisa, ou equivalente)
  - [ ] Layout da planta industrial (fluxograma de produção)
  - [ ] Lista completa de produtos a serem certificados (se não preenchido em Etapa 2)
  - [ ] Fichas técnicas de todos os produtos
  - [ ] Lista de ingredientes e matérias-primas (com fornecedores)
  - [ ] Certificados Halal de fornecedores de matérias-primas de origem animal (se aplicável)
  - [ ] Fotos da planta industrial (mínimo 5):
    - Área de produção
    - Área de armazenamento de matérias-primas
    - Área de armazenamento de produtos acabados
    - Vestiários e sanitários
    - Áreas de higienização
  - [ ] Procedimentos de higienização e sanitização (escrito)
  - [ ] Procedimentos de controle de pragas (escrito)
  - [ ] Procedimentos de rastreabilidade de produtos (escrito)

- [ ] Checklist adicional se origem animal (PR 7.1 requisitos específicos):
  - [ ] Certificado de Abate Halal (se aplicável)
  - [ ] Declaração de origem animal de cada matéria-prima
  - [ ] Certificados Halal de TODOS fornecedores de origem animal

- [ ] Sistema permite upload de documentos:
  - Drag & drop ou seleção de arquivos
  - Formatos aceitos: PDF, JPG, PNG, DOCX, XLSX
  - Tamanho máximo: 50MB por arquivo
  - Múltiplos arquivos por categoria (ex: 10 fotos da planta)
  - Preview de imagens (thumbnail)
  - Barra de progresso de upload

- [ ] Sistema valida:
  - Pelo menos 1 arquivo enviado em cada categoria obrigatória
  - Formatos de arquivo aceitos
  - Tamanho de arquivo dentro do limite

- [ ] Sistema exibe progresso visual:
  - "7 de 12 documentos obrigatórios enviados (58%)"
  - Barra de progresso visual
  - Lista de documentos faltantes destacada em vermelho

- [ ] Botão "Submeter Solicitação" (habilitado apenas quando todos obrigatórios enviados)

**APÓS SUBMISSÃO**:

- [ ] Sistema valida novamente que:
  - Todas as 5 etapas foram preenchidas
  - Todos documentos obrigatórios foram enviados
  - Pelo menos 1 produto foi cadastrado

- [ ] Sistema gera:
  - **Número único de protocolo**: formato "HS-YYYY-NNNNNN" (ex: HS-2025-000123)
  - Onde YYYY = ano, NNNNNN = sequencial incremental

- [ ] Sistema muda status do processo para: **"Solicitação Enviada"**

- [ ] Sistema registra audit trail:
  - Timestamp de submissão
  - IP de origem
  - Todas informações submetidas (snapshot JSON)

- [ ] Sistema envia e-mail de confirmação para empresa:
  - Assunto: "Solicitação de Certificação Halal Recebida - Protocolo [HS-2025-000123]"
  - Conteúdo:
    - Agradecimento pela solicitação
    - Número do protocolo destacado
    - Resumo do que foi solicitado (tipo de certificação, produtos, etc.)
    - Próximos passos: "Sua solicitação será analisada por um analista em até 5 dias úteis"
    - Link para acompanhar status no portal
    - Contato de suporte

- [ ] Sistema notifica equipe interna:
  - Envia notificação para fila de analistas: "Nova solicitação pendente de revisão - [HS-2025-000123]"
  - Exibe no dashboard do analista: "1 nova solicitação"

- [ ] Sistema redireciona usuário para:
  - Dashboard de acompanhamento (US-004) mostrando status "Solicitação Enviada"
  - Mensagem de sucesso: "Solicitação enviada com sucesso! Protocolo: HS-2025-000123. Você será notificado sobre os próximos passos."

**FUNCIONALIDADES ADICIONAIS**:

- [ ] **Salvar progresso automaticamente**:
  - Sistema salva a cada campo preenchido (auto-save a cada 30 segundos)
  - Usuário pode sair e voltar depois sem perder informações

- [ ] **Permitir voltar para etapas anteriores**:
  - Botão "Voltar" em cada etapa
  - Usuário pode editar informações de etapas anteriores antes de submeter

- [ ] **Validação em tempo real**:
  - Campos obrigatórios marcados com * vermelho
  - Mensagem de erro instantânea ao sair do campo se inválido
  - Contador de caracteres em campos com limite
  - Preview de planilha enviada (primeiras 5 linhas)

- [ ] **Assistência contextual**:
  - Tooltip (?) ao lado de cada campo complexo explicando o que é
  - Link "Precisa de ajuda?" abre chatbot IA
  - Exemplos de preenchimento correto

- [ ] **Responsividade**:
  - Formulário funciona em desktop, tablet e mobile
  - Layout adaptado para telas menores
  - Upload de fotos via câmera do celular (mobile)

**Regras de Negócio**:

- **RN-005**: Tipo de certificação (C1-C6) influencia cálculo de proposta comercial e requisitos de auditoria
- **RN-006**: Empresas com produtos de origem animal (C3, C6) DEVEM enviar certificados Halal de fornecedores
- **RN-007**: Man-hour de auditoria é calculado conforme PR 7.1 10.7.4 baseado em: número de funcionários, turnos, complexidade
- **RN-008**: Número de protocolo é único e sequencial por ano
- **RN-009**: Solicitação não pode ser editada após submissão (apenas analista pode solicitar complementação)

**Casos de Uso Alternativos**:

- **Caso 1**: Empresa não sabe qual tipo de certificação (C1-C6) → Chatbot IA faz perguntas e sugere
- **Caso 2**: Empresa abandona formulário no meio → Sistema salva draft e envia e-mail de lembrete após 24h
- **Caso 3**: Upload de documento falha (conexão cai) → Sistema permite retry automático
- **Caso 4**: Empresa tenta submeter sem documentos obrigatórios → Sistema bloqueia e destaca o que falta

**UX/UI Specifications**:

**Referência**: [UX Design Guide - Seção 4: Jornada do Cliente](./ux-design-guide.md#4-jornada-do-cliente---wizard-com-ia)
**Wireframe**: [ux-journey-wizard-ai.html](./ux-journey-wizard-ai.html)

**Layout Geral do Wizard**:
```
┌────────────────────────────────────────────────┐
│ Header: Nova Solicitação de Certificação Halal│
├──────────┬─────────────────────────────────────┤
│          │ Toggle: [💬 Chat IA] [📝 Formulário]│
│ Sidebar  │                                     │
│          │ Conteúdo da Etapa Atual             │
│ Progresso│                                     │
│ 🟢 1     │                                     │
│ 🟢 2 ◄── │                                     │
│ ⚪ 3     │                                     │
│ ⚪ 4     │                                     │
│ ⚪ 5     │                                     │
│ ⚪ 6     │ [← Voltar]  [Próxima Etapa →]      │
└──────────┴─────────────────────────────────────┘
```

**Componentes Visuais**:

1. **Sidebar de Navegação** (sticky, sempre visível):
   - Barra de progresso: "Etapa 2 de 6 (33%)"
   - Lista de etapas com status:
     - ✅ Etapas completadas (verde #2D5016)
     - 🟢 Etapa atual (destaque com background #F0F4ED)
     - ⚪ Etapas pendentes (cinza #D1D5DB, disabled)
   - Permite clicar em etapas já completadas para editar

2. **Toggle Modo Chat ↔️ Formulário**:
   - Switcher no topo da área de conteúdo
   - Background cinza (#F3F4F6), botão ativo branco com shadow
   - Transição suave (0.2s ease) ao trocar
   - Dados preenchidos em um modo aparecem no outro

3. **Modo Chat com IA** (inovação #5):
   - Container de chat com 500px de altura, scroll automático
   - Mensagens da IA:
     * Avatar circular "AI" com gradient verde (#2D5016 → #3D6A1E)
     * Bubble branco com border #E5E7EB
     * Alinhado à esquerda
   - Mensagens do usuário:
     * Avatar circular "EU" com background cinza (#E5E7EB)
     * Bubble verde (#2D5016) com texto branco
     * Alinhado à direita
   - Auto-fill badges:
     * Background verde claro (#D1FAE5)
     * Texto verde escuro (#065F46)
     * Mostra "✓ Campo preenchido automaticamente"
   - Input area:
     * Textarea com border #E5E7EB
     * Placeholder: "Digite sua mensagem ou envie arquivo..."
     * Botão "Enviar" verde (#2D5016)
     * Suporte a drag-and-drop de arquivos

4. **Modo Formulário Direto**:
   - Form groups com spacing de 24px
   - Labels:
     * Font-weight 500, cor #374151
     * Asterisco vermelho (*) para obrigatórios
   - Inputs:
     * Border #D1D5DB, radius 8px
     * Focus: border verde (#2D5016) + shadow verde
     * Validação em tempo real:
       - ✓ Sucesso: border verde + ícone check
       - ⚠️ Erro: border vermelho + mensagem
   - Selects customizados (não nativo):
     * Dropdown com max-height 300px, scroll
     * Opções com hover background #F3F4F6
   - Tooltips (?):
     * Ícone cinza ao lado de labels complexos
     * Hover mostra tooltip com fundo preto, texto branco
     * Max-width 250px, quebra de linha

5. **Campos Especiais**:
   - **Seleção de Categoria (C1-C6)**:
     * Grid de 6 cards clicáveis
     * Cards: 200x120px, border 2px #E5E7EB
     * Hover: border verde (#2D5016) + shadow
     * Selecionado: border verde + background #F0F4ED
     * Conteúdo: Código grande (24px bold) + descrição (14px)
   - **Lista dinâmica de produtos**:
     * Tabela com colunas: Nome, Categoria GSO, Ingredientes, Ações
     * Botão "+ Adicionar Produto" no final
     * Cada linha tem ícone de lixeira (vermelho) para remover
   - **Upload de planilha**:
     * Área drag-and-drop: 400x150px, border dashed #D1D5DB
     * Hover/Drag: border sólido verde + background #F0F4ED
     * Ícone de upload grande (48px) + texto "Arraste ou clique"
     * Preview das primeiras 5 linhas após upload

6. **Botões de Navegação**:
   - **"Voltar"** (secundário):
     * Background #F3F4F6, cor #6B7280
     * Hover: background #E5E7EB
   - **"Salvar e Continuar"** (primário):
     * Background verde (#2D5016), texto branco
     * Hover: background verde escuro (#1E4620)
     * Disabled: background cinza (#D1D5DB), cursor not-allowed
   - **"Submeter Solicitação"** (final, etapa 6):
     * Background dourado (#D4AF37), texto branco
     * Hover: background dourado escuro (#B8933D)
     * Ícone de checkmark + texto "Enviar Solicitação"

7. **Auto-save Indicator**:
   - Texto sutil no topo: "Salvo automaticamente às 14:32"
   - Cor #9CA3AF, font-size 12px
   - Animação de fade quando atualiza

8. **Validação e Feedback**:
   - **Sucesso**: Toast verde (canto superior direito), 3s
   - **Erro**: Toast vermelho, permanece até usuário fechar
   - **Warning**: Toast amarelo, 5s
   - **Info**: Toast azul, 3s

9. **Tela de Sucesso Final** (após submissão):
```
┌─────────────────────────────────────────┐
│           ✅ (ícone 80x80)             │
│                                         │
│  Solicitação Enviada com Sucesso!      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Número do Protocolo             │ │
│  │   HS-2025-001234                  │ │
│  │   (font-mono, 32px, verde)        │ │
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

**Responsividade**:
- **Desktop (>1024px)**:
  - Layout em 2 colunas: Sidebar (280px) + Conteúdo (flex-1)
  - Preview lateral opcional (320px, colapsável)
- **Tablet (768-1024px)**:
  - Sidebar colapsável (ícone hamburger)
  - Conteúdo ocupa 100%
- **Mobile (<768px)**:
  - Sidebar vira bottom navigation (fixed)
  - Wizard: 1 campo por vez, scroll vertical
  - Upload: abre câmera do celular automaticamente
  - Chat IA ocupa tela inteira

**Acessibilidade (WCAG 2.1 AA)**:
- ✅ Navegação completa por teclado (Tab, Enter, Esc)
- ✅ Focus ring visível (3px verde)
- ✅ Labels associados com inputs (for="id")
- ✅ Mensagens de erro com aria-describedby
- ✅ Landmarks HTML5: <nav>, <main>, <form>
- ✅ Contraste mínimo 4.5:1 para textos

**Métricas de Sucesso UX**:
- Taxa de conclusão: **85%** (vs. 50% atual)
- Tempo médio: **12min** (vs. 45min atual)
- Solicitações completas: **95%** na 1ª tentativa (vs. 60%)
- NPS (Net Promoter Score): **> 70**

**Testes**:

- [ ] Teste de unidade: Geração de número de protocolo (unicidade, formato correto)
- [ ] Teste de integração: Upload de documentos (S3/Blob Storage)
- [ ] Teste de integração: Envio de e-mail de confirmação (SendGrid/SES)
- [ ] Teste funcional: Fluxo completo de solicitação (todas as 5 etapas)
- [ ] Teste de usabilidade: Usuário real completa solicitação em < 20 minutos
- [ ] Teste de segurança: Upload de arquivos maliciosos (vírus, scripts)
- [ ] Teste de performance: Upload simultâneo de 20 arquivos grandes (50MB cada)

---

##### **US-003: Upload e Gestão de Documentos Centralizada**

```
Como empresa solicitante,
Eu quero fazer upload de múltiplos documentos organizados por categoria,
Para que a certificadora tenha acesso centralizado a toda documentação necessária conforme PR 7.1 10.1.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-002 (Formulário de Solicitação), US-081 (Storage)

**Acceptance Criteria**:

- [ ] **Sistema organiza documentos em categorias predefinidas**:
  - 📁 Documentação Legal
    - Contrato Social / Estatuto
    - Licenças de Funcionamento (Vigilância Sanitária, Anvisa, etc.)
    - Certificados de Registro de Produtos (quando aplicável)
  - 📁 Documentação Técnica
    - Fichas Técnicas de Produtos
    - Especificações de Matérias-Primas
    - Fluxograma de Produção / Layout da Planta
    - Procedimentos Operacionais (POP)
  - 📁 Fotos da Planta Industrial
    - Área de Produção
    - Armazenamento de Matérias-Primas
    - Armazenamento de Produtos Acabados
    - Vestiários e Sanitários
    - Equipamentos e Utensílios
  - 📁 Certificados de Fornecedores
    - Certificados Halal de Fornecedores
    - Declarações de Origem
    - Especificações Técnicas de Ingredientes
  - 📁 Procedimentos de Qualidade
    - Higienização e Sanitização
    - Controle de Pragas
    - Rastreabilidade
    - Controle de Qualidade
  - 📁 Outros Documentos

- [ ] **Sistema permite upload múltiplo de arquivos**:
  - Drag & drop de múltiplos arquivos simultâneos
  - Ou seleção via clique em "Selecionar Arquivos"
  - Upload em lote (até 20 arquivos simultâneos)
  - Barra de progresso individual por arquivo
  - Barra de progresso geral (ex: "3 de 10 arquivos enviados - 30%")

- [ ] **Sistema aceita formatos específicos**:
  - **Documentos**: PDF, DOCX, DOC, XLSX, XLS
  - **Imagens**: JPG, JPEG, PNG, HEIC (converte para JPG automaticamente)
  - **Tamanho máximo**: 50MB por arquivo
  - Sistema valida formato e tamanho ANTES de iniciar upload
  - Se formato inválido: exibe mensagem de erro clara "Formato .ZIP não é aceito. Use PDF, DOCX, JPG ou PNG."

- [ ] **Sistema exibe preview de documentos**:
  - **Imagens**: Thumbnail (miniatura) de 200x200px
  - **PDFs**: Ícone de PDF + nome do arquivo + primeira página como preview (opcional)
  - **Outros**: Ícone do tipo de arquivo (Word, Excel)
  - Ao clicar: abre preview em modal (fullscreen)
  - Modal de preview tem:
    - Botões de navegação (← →) se houver múltiplos arquivos
    - Botão de zoom (+/-)
    - Botão de download
    - Botão de excluir (⚠️ com confirmação)

- [ ] **Sistema permite substituir documentos (versionamento)**:
  - Botão "Substituir" ao lado de cada arquivo
  - Ao substituir: sistema mantém versão anterior
  - Nomenclatura automática: `contrato-social-v1.pdf`, `contrato-social-v2.pdf`
  - Sistema exibe histórico de versões:
    - v1 - Enviado em 10/11/2025 às 14:30 por Ahmad Silva
    - v2 - Enviado em 12/11/2025 às 09:15 por Ahmad Silva (atual)
  - Analista pode acessar versões anteriores se necessário

- [ ] **Sistema permite download de documentos**:
  - **Download individual**: Botão de download ao lado de cada arquivo
  - **Download em lote por categoria**: Botão "Baixar Todos (Docs Legais)" → gera ZIP
  - **Download completo**: Botão "Baixar Tudo" → gera ZIP com todas categorias organizadas em pastas

- [ ] **Sistema exibe metadata de cada documento**:
  - Nome do arquivo (editável pelo usuário)
  - Tamanho (ex: 2.5 MB)
  - Data de upload
  - Versão (v1, v2, etc.)
  - Status de revisão pelo analista:
    - ⏳ Aguardando Revisão (cinza)
    - ✅ Aprovado (verde)
    - ❌ Rejeitado (vermelho) - com motivo visível
    - ⚠️ Requer Atenção (amarelo) - com comentário do analista

- [ ] **Sistema permite analista revisar e marcar status de documentos**:
  - Analista acessa mesma interface de documentos da empresa
  - Pode marcar cada documento como:
    - ✅ Aprovar
    - ❌ Rejeitar (campo obrigatório: motivo da rejeição)
    - ⚠️ Requer Atenção (campo opcional: comentário)
  - Sistema notifica empresa automaticamente quando documento é rejeitado/comentado

- [ ] **Sistema notifica empresa quando documento é rejeitado**:
  - E-mail com assunto: "Documento Rejeitado - [Nome do Documento]"
  - Conteúdo:
    - Qual documento foi rejeitado
    - Motivo da rejeição (texto do analista)
    - Link direto para fazer upload de nova versão
  - Notificação in-app (sino vermelho no header)

- [ ] **Sistema calcula progresso de documentação**:
  - Checklist visual: "7 de 12 documentos obrigatórios enviados (58%)"
  - Barra de progresso colorida (verde quando 100%)
  - Lista de documentos faltantes destacada em vermelho
  - Documentos opcionais marcados como (Opcional) e não contam no %

- [ ] **Sistema permite empresa fazer download de seus próprios documentos a qualquer momento**:
  - Empresa sempre tem acesso completo aos documentos que enviou
  - Empresa pode visualizar status de revisão (aprovado/rejeitado)
  - Empresa pode substituir documentos rejeitados

- [ ] **Sistema implementa segurança e validação de arquivos**:
  - **Scan de vírus/malware**: Todos arquivos são escaneados antes de armazenar (ClamAV ou AWS GuardDuty)
  - **Validação de conteúdo**: PDFs não podem conter scripts executáveis
  - **Metadados sensíveis removidos**: Exif de imagens (localização GPS, etc.)
  - **Armazenamento criptografado**: S3 com encryption at rest (AES-256)
  - **Acesso controlado**: Apenas empresa dona e analistas/auditores do processo podem acessar

**Regras de Negócio**:

- **RN-010**: Documentos obrigatórios variam conforme tipo de certificação e origem de produtos
- **RN-011**: Versionamento de documentos é automático e imutável (versões antigas não são deletadas)
- **RN-012**: Analista pode solicitar documentos adicionais não listados inicialmente
- **RN-013**: Documentos rejeitados devem ser resubmetidos para processo avançar

**Casos de Uso Alternativos**:

- **Caso 1**: Upload falha (conexão cai) → Sistema permite retry automático
- **Caso 2**: Arquivo muito grande (>50MB) → Sistema sugere compressão ou divisão
- **Caso 3**: Formato não aceito → Sistema exibe mensagem clara e link para conversores online
- **Caso 4**: Vírus detectado → Sistema rejeita upload e notifica equipe de segurança
- **Caso 5**: Empresa tenta deletar documento já aprovado → Sistema bloqueia e exige justificativa

**UX/UI Considerations**:

- Interface tipo "gerenciador de arquivos" do Dropbox/Google Drive
- Categorias em sidebar esquerda
- Área principal: lista de arquivos com thumbnails
- Opções de visualização: Lista / Grid (thumbnails grandes)
- Filtros: Todos / Aprovados / Rejeitados / Aguardando Revisão
- Busca por nome de arquivo
- Cores consistentes: Verde (aprovado), Vermelho (rejeitado), Amarelo (atenção), Cinza (aguardando)

**Testes**:

- [ ] Teste de unidade: Validação de formato de arquivo
- [ ] Teste de unidade: Validação de tamanho de arquivo
- [ ] Teste de integração: Upload para S3/Blob Storage
- [ ] Teste de integração: Scan de vírus (ClamAV)
- [ ] Teste de integração: Geração de thumbnails para imagens
- [ ] Teste de segurança: Upload de arquivo malicioso (deve ser bloqueado)
- [ ] Teste de performance: Upload simultâneo de 20 arquivos grandes (50MB cada)
- [ ] Teste de usabilidade: Usuário substitui documento rejeitado em < 2 minutos

---

#### 📊 Feature 1.2: Dashboard de Acompanhamento em Tempo Real

##### **US-004: Dashboard de Status do Processo com 12 Fases**

```
Como empresa solicitante,
Eu quero visualizar em tempo real em que fase está meu processo de certificação,
Para que eu não precise ligar na certificadora perguntando sobre o status conforme PR 7.1.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-002 (Solicitação), US-085 (Sistema de Notificações)

**Contexto do PR 7.1**:
O processo de certificação segue 12 fases principais conforme PR 7.1 Rev 21:
1. Solicitação → 2. Revisão Inicial → 3. Proposta Comercial → 4. Contrato → 5-6. Estágio 1 → 7-8. Estágio 2 → 9. Comitê → 10. Certificado

**Acceptance Criteria**:

- [ ] **Sistema exibe timeline visual horizontal com 12 fases**:
  1. **Solicitação Enviada** (10.1 - PR 7.1)
  2. **Revisão Inicial** (Analista revisa elegibilidade - 10.2)
  3. **Proposta Comercial em Criação** (Analista calcula custos)
  4. **Proposta Enviada** (Aguardando resposta da empresa - 10.3)
  5. **Contrato em Preparação** (Após aceitação da proposta)
  6. **Contrato em Negociação** (Empresa e certificadora editam cláusulas)
  7. **Contrato Assinado** (Assinatura digital de ambas as partes)
  8. **Análise Documental - Estágio 1** (Analista revisa docs - 10.6)
  9. **Auditoria Agendada - Estágio 2** (Data confirmada - 10.7)
  10. **Auditoria Realizada** (Aguardando relatório do auditor)
  11. **Análise do Comitê** (Comitê delibera sobre aprovação - 10.9)
  12. **Certificado Emitido** 🎉 (Processo concluído)

- [ ] **Sistema destaca fase atual**:
  - Fase atual: fundo verde, texto branco, ícone animado (pulsando)
  - Fases concluídas: fundo cinza claro, ícone com ✓ verde
  - Fases futuras: fundo branco, texto cinza claro, ícone desabilitado

- [ ] **Sistema exibe linha de conexão entre fases**:
  - Linha verde sólida: fases concluídas
  - Linha verde tracejada: fase atual
  - Linha cinza clara: fases futuras

- [ ] **Sistema exibe informações detalhadas da fase atual**:
  - **Nome da fase** (ex: "Análise Documental - Estágio 1")
  - **Data de entrada** na fase: "Iniciado em 10/11/2025"
  - **Dias na fase atual**: "5 dias nesta fase"
  - **Prazo estimado** para conclusão da fase: "Prazo: 7-10 dias"
  - **Indicador de prazo**:
    - 🟢 No prazo (< 70% do prazo estimado)
    - 🟡 Perto do prazo (70-100% do prazo)
    - 🔴 Atrasado (> 100% do prazo)
  - **Responsável atual**: "Analista: Mariana Silva"
  - **Próxima ação esperada**:
    - Se ação é da empresa: "Aguardando você: Assinar contrato digital"
    - Se ação é da certificadora: "Aguardando certificadora: Revisão de documentos"

- [ ] **Sistema exibe estimativa de conclusão total**:
  - Card destacado: "Previsão de Conclusão: Fevereiro de 2026"
  - Cálculo baseado em:
    - Tempo médio histórico de cada fase
    - Complexidade do processo (tipo C1-C6, número de produtos, etc.)
    - Velocidade atual (se está rápido ou lento comparado à média)
  - Atualiza dinamicamente conforme processo avança

- [ ] **Sistema exibe histórico de mudanças de fase**:
  - Lista cronológica abaixo da timeline:
    - 13/11/2025 14:30 - Movido para "Análise Documental - Estágio 1" por Mariana Silva
    - 12/11/2025 09:15 - Contrato assinado por ambas as partes
    - 10/11/2025 16:45 - Proposta comercial aceita por Ahmad Silva
    - 10/11/2025 10:00 - Solicitação enviada

- [ ] **Sistema exibe mensagens/alertas importantes**:
  - Card destacado em amarelo/vermelho quando há ação pendente da empresa:
    - ⚠️ "AÇÃO NECESSÁRIA: Assine o contrato até 15/11/2025"
    - ⚠️ "ATENÇÃO: 2 documentos foram rejeitados. Envie novas versões."
  - Card em azul para informações:
    - ℹ️ "Sua auditoria foi agendada para 20/12/2025 às 09:00"

- [ ] **Sistema permite empresa adicionar comentários/perguntas**:
  - Campo de texto: "Tem alguma dúvida sobre esta fase?"
  - Botão "Enviar Mensagem ao Analista"
  - Mensagem vai direto para central de mensagens (US-086)
  - Analista é notificado automaticamente

- [ ] **Sistema atualiza em tempo real**:
  - Via WebSocket (conexão persistente) OU
  - Polling a cada 30 segundos
  - Quando status muda, exibe notificação no topo: "Seu processo foi atualizado! 🎉"
  - Badge de notificação no sino do header

- [ ] **Sistema exibe métricas visuais**:
  - **Progresso geral**: Barra de progresso "Fase 8 de 12 - 67% concluído"
  - **Tempo decorrido**: "45 dias desde solicitação"
  - **Próximos marcos**:
    - Próxima auditoria: 20/12/2025
    - Reunião do comitê: Janeiro de 2026
    - Emissão prevista: Fevereiro de 2026

- [ ] **Sistema é responsivo**:
  - Desktop: Timeline horizontal
  - Mobile: Timeline vertical (scroll)
  - Tablet: Timeline horizontal compacta

**Regras de Negócio**:

- **RN-014**: Apenas analista pode mudar fase manualmente (empresa não pode)
- **RN-015**: Algumas transições de fase são automáticas (ex: Contrato assinado → Estágio 1)
- **RN-016**: Prazo estimado por fase é configurável por admin
- **RN-017**: Processo não pode voltar para fase anterior (apenas avançar) exceto em casos de re-análise

**Casos de Uso Alternativos**:

- **Caso 1**: Processo está atrasado → Sistema exibe mensagem explicativa do motivo
- **Caso 2**: Processo foi pausado (empresa não respondeu) → Exibe alerta "Processo pausado há 10 dias - Aguardando sua ação"
- **Caso 3**: WebSocket desconecta → Fallback para polling a cada 30s

**UX/UI Considerations**:

- Timeline estilo "Amazon Order Tracking" ou "Uber Eats"
- Cores consistentes: Verde (sucesso), Amarelo (atenção), Vermelho (urgente), Azul (info)
- Animações sutis ao mudar de fase (transição suave)
- Ícones intuitivos para cada fase (ex: 📄 docs, 🔍 auditoria, ✅ certificado)
- Tooltip ao passar mouse sobre cada fase (explicação breve)

**Testes**:

- [ ] Teste de unidade: Cálculo de prazo estimado
- [ ] Teste de unidade: Lógica de indicador de prazo (verde/amarelo/vermelho)
- [ ] Teste de integração: WebSocket real-time updates
- [ ] Teste funcional: Navegação completa pelas 12 fases
- [ ] Teste de usabilidade: Usuário entende status em < 10 segundos
- [ ] Teste de responsividade: Timeline funciona em mobile/tablet/desktop

---

##### **US-005: Notificações Automáticas de Mudança de Status**

```
Como empresa solicitante,
Eu quero receber notificações automáticas quando meu processo mudar de status,
Para que eu esteja sempre informado sem precisar acessar o sistema constantemente.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-004 (Dashboard), US-085 (Sistema de Notificações)

**Acceptance Criteria**:

- [ ] **Sistema envia notificação por e-mail a cada mudança de fase**:
  - Template profissional com logo da certificadora
  - Assunto dinâmico: "Seu processo avançou para: [Nome da Fase] - Protocolo [HS-2025-000123]"
  - Conteúdo do e-mail:
    - Saudação personalizada: "Olá, Ahmad!"
    - Resumo: "Seu processo de certificação Halal avançou para a fase: **Análise Documental - Estágio 1**"
    - Data da mudança: "Atualizado em: 13/11/2025 às 14:30"
    - Responsável: "Analista responsável: Mariana Silva"
    - Próxima ação (se houver):
      - "Não é necessária nenhuma ação sua neste momento. Aguarde a conclusão da análise."
      - OU "AÇÃO NECESSÁRIA: Por favor, envie os documentos faltantes até 20/11/2025."
    - Link direto para o processo: "Acompanhar Processo →"
    - Prazo estimado: "Esta fase leva em média 7-10 dias."
    - Contato de suporte
  - Rodapé: Logo, endereço, unsubscribe (apenas de notificações não-críticas)

- [ ] **Sistema envia notificação in-app**:
  - Ícone de sino no header com badge vermelho: "3" (3 notificações não lidas)
  - Ao clicar: dropdown com lista de notificações
  - Cada notificação exibe:
    - Ícone (tipo de notificação)
    - Título: "Processo avançou para Estágio 1"
    - Timestamp: "Há 2 horas"
    - Botão "Ver Detalhes" (redireciona para dashboard)
  - Notificações não lidas: fundo azul claro
  - Notificações lidas: fundo branco
  - Botão "Marcar Todas como Lidas"

- [ ] **Sistema permite empresa configurar preferências de notificação**:
  - Página de "Configurações de Notificações" no perfil do usuário
  - Opções por tipo de notificação:
    - **Mudanças de fase**: E-mail (padrão ON) / In-app (sempre ON) / SMS (OFF)
    - **Ações requeridas**: E-mail (sempre ON) / In-app (sempre ON) / SMS (opcional)
    - **Documentos rejeitados**: E-mail (sempre ON) / In-app (sempre ON)
    - **Auditoria agendada**: E-mail (sempre ON) / In-app (sempre ON) / SMS (opcional)
    - **Certificado emitido**: E-mail (sempre ON) / In-app (sempre ON) / SMS (opcional)
    - **Lembretes**: E-mail (opcional) / In-app (opcional)
  - Algumas notificações críticas não podem ser desabilitadas (ex: Ações requeridas)
  - Opção de pausar notificações por X dias (ex: "Estou de férias, pausar por 7 dias")

- [ ] **Sistema envia notificações SMS para ações críticas** (opcional, se configurado):
  - SMS curto (160 caracteres):
    - "HalalSphere: AÇÃO NECESSÁRIA - Assine seu contrato até 15/11. Acesse: [link curto]"
  - Apenas para notificações críticas:
    - Contrato pronto para assinatura
    - Auditoria agendada (lembrete 1 dia antes)
    - Certificado emitido
    - Processo pausado (aguardando ação há >5 dias)
  - Integração com Twilio ou similar

- [ ] **Sistema envia notificações push (futuro - app mobile)** (post-MVP):
  - Push notification via Firebase Cloud Messaging
  - Mesmo conteúdo das notificações in-app

- [ ] **Sistema envia notificações específicas por evento**:

**Evento: Proposta Comercial Pronta**
- E-mail com assunto: "Sua Proposta Comercial está Pronta 💰"
- Conteúdo: Resumo do valor total, link para visualizar detalhes, botão "Aceitar Proposta"

**Evento: Contrato Pronto para Assinatura**
- E-mail com assunto: "⚠️ AÇÃO NECESSÁRIA: Assine seu Contrato Digital"
- Conteúdo: "Seu contrato está pronto. Por favor, revise e assine até [data]. Link: [link direto]"
- SMS (se configurado): "HalalSphere: Contrato pronto. Assine até 15/11. [link]"
- Lembrete automático: Se não assinado após 3 dias, envia lembrete

**Evento: Documentos Rejeitados**
- E-mail com assunto: "⚠️ Documentos Rejeitados - Ação Necessária"
- Conteúdo: Lista de documentos rejeitados com motivos, link para resubmeter
- Não envia SMS (não é urgente o suficiente)

**Evento: Auditoria Agendada**
- E-mail com assunto: "🗓️ Sua Auditoria foi Agendada!"
- Conteúdo:
  - Data, horário, duração estimada
  - Nome e contato do auditor
  - Endereço (confirmação)
  - O que preparar para auditoria (checklist)
  - Botão "Adicionar ao Google Calendar" / "Adicionar ao Outlook"
- SMS 1 dia antes: "HalalSphere: Lembrete - Auditoria amanhã às 09:00 com Khalil. [link]"

**Evento: Não-Conformidades Identificadas**
- E-mail com assunto: "Não-Conformidades Identificadas na Auditoria"
- Conteúdo: Lista de NCs (Maiores e Menores), prazos para tratamento, link para enviar evidências
- Alerta visual: NCs Maiores em vermelho (críticas)

**Evento: Certificado Emitido 🎉**
- E-mail com assunto: "🎉 Parabéns! Seu Certificado Halal foi Emitido"
- Conteúdo:
  - Mensagem de congratulações
  - Número do certificado
  - Validade (3 anos)
  - Botão "Baixar Certificado (PDF)"
  - Próximos passos: Auditorias de manutenção anual
  - Link para validação pública do certificado
- SMS (se configurado): "HalalSphere: Parabéns! Seu certificado foi emitido. Baixe: [link]"

**Evento: Processo Pausado (Inatividade)**
- Se empresa não responde há 5 dias:
  - E-mail com assunto: "⚠️ Seu Processo está Pausado - Ação Necessária"
  - Conteúdo: "Não recebemos sua resposta há 5 dias. Por favor, [ação necessária]. Caso contrário, processo será cancelado em 30 dias."

- [ ] **Sistema mantém histórico de notificações enviadas**:
  - Página "Histórico de Notificações" no perfil
  - Lista completa de todas notificações enviadas (data, tipo, canal, status)
  - Filtros: Por data, por tipo, por canal (e-mail/SMS/in-app)
  - Empresa pode reenviar notificação (ex: "Reenviar e-mail do certificado")

- [ ] **Sistema registra audit trail de notificações**:
  - Timestamp de envio
  - Canal (e-mail, SMS, in-app)
  - Status de entrega:
    - E-mail: Enviado / Entregue / Aberto / Clicado (tracking via SendGrid/SES)
    - SMS: Enviado / Entregue / Falhou
    - In-app: Enviado / Lido
  - Falhas são registradas e retry automático é tentado

**Regras de Negócio**:

- **RN-018**: Notificações críticas (ações requeridas) não podem ser desabilitadas
- **RN-019**: E-mails têm link de unsubscribe apenas para notificações não-críticas
- **RN-020**: SMS só é enviado se empresa forneceu número de celular e autorizou
- **RN-021**: Lembretes automáticos: Contrato não assinado (3 dias), Auditoria (1 dia antes)

**Casos de Uso Alternativos**:

- **Caso 1**: E-mail não entregue (bounce) → Sistema tenta telefone/SMS alternativo
- **Caso 2**: Usuário clica "Unsubscribe" em e-mail → Sistema desabilita apenas notificações não-críticas
- **Caso 3**: Número de SMS inválido → Sistema marca como falha e notifica admin

**UX/UI Considerations**:

- E-mails com design responsivo (funciona em mobile)
- Notificações in-app não intrusivas (dropdown, não popup modal)
- Badge de notificação visível mas não distrativa
- Som opcional ao receber notificação in-app (configurável)

**Testes**:

- [ ] Teste de integração: Envio de e-mail via SendGrid/SES
- [ ] Teste de integração: Envio de SMS via Twilio
- [ ] Teste funcional: Cada tipo de notificação dispara corretamente
- [ ] Teste de unidade: Lógica de preferências de notificação
- [ ] Teste de usabilidade: Usuário encontra e configura preferências em < 2 minutos

---

#### 📁 Feature 1.3: Gestão de Documentação (Continuação)

##### **US-006: Checklist Inteligente de Documentos Obrigatórios**

```
Como empresa solicitante,
Eu quero ver uma checklist clara e dinâmica de quais documentos são obrigatórios,
Para que eu saiba exatamente o que preciso enviar conforme meu tipo de certificação.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-002 (Solicitação), US-003 (Upload)

**Acceptance Criteria**:

- [ ] **Sistema gera checklist dinâmica baseada em**:
  - Tipo de certificação solicitada (C1-C6)
  - Tipo de indústria
  - Origem de produtos (animal/vegetal/misto)
  - Processos utilizados (fermentação, uso de álcool, etc.)

- [ ] **Checklist padrão contém** (PR 7.1 10.1):
  - [ ] Contrato Social ou Estatuto da Empresa
  - [ ] Licença de Funcionamento válida
  - [ ] Layout da planta industrial (fluxograma)
  - [ ] Lista completa de produtos
  - [ ] Fichas técnicas de produtos
  - [ ] Lista de ingredientes e matérias-primas
  - [ ] Procedimentos de higienização
  - [ ] Procedimentos de controle de pragas
  - [ ] Fotos da planta (mínimo 5)
  - [ ] Procedimentos de rastreabilidade

- [ ] **Checklist adicional se origem animal**:
  - [ ] Certificados Halal de fornecedores (obrigatório)
  - [ ] Declaração de origem de cada matéria-prima animal
  - [ ] Certificado de abate Halal (se aplicável)

- [ ] **Sistema exibe status visual por documento**:
  - ✅ Enviado e Aprovado (verde)
  - ⏳ Enviado - Aguardando Revisão (cinza)
  - ❌ Rejeitado (vermelho) - com motivo
  - ⚠️ Faltante (laranja) - destaque

- [ ] **Sistema calcula progresso**: "8 de 12 documentos obrigatórios (67%)"

- [ ] **Sistema fornece ajuda contextual**:
  - Tooltip explicando cada documento
  - Link para templates/exemplos
  - Botão "Não sei o que é isso?" → Abre chatbot IA

**Testes**:
- [ ] Teste funcional: Checklist varia conforme tipo de certificação
- [ ] Teste de usabilidade: Empresa entende checklist em < 2 minutos

---

#### 🔧 Feature 1.4: Tratamento de Não-Conformidades (Empresa)

##### **US-007: Visualização de Não-Conformidades Identificadas**

```
Como empresa solicitante,
Eu quero visualizar não-conformidades identificadas durante a auditoria,
Para que eu saiba exatamente o que precisa ser corrigido conforme PR 7.1 10.7.7.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-004 (Dashboard), US-040 (Auditoria - Épico 4)

**Acceptance Criteria**:

- [ ] **Sistema exibe lista de NCs após auditoria Estágio 2**

- [ ] **Cada NC contém**:
  - **Código único**: NC-2025-000123-001
  - **Classificação**:
    - 🔴 **Maior** (crítica - bloqueia certificação)
    - 🟡 **Menor** (não-crítica - não bloqueia)
  - **Descrição detalhada** do problema
  - **Seção do PR 7.1 violada** (ex: 10.7.7)
  - **Fotos de evidência** (se houver)
  - **Prazo para tratamento**:
    - Maiores: 30 dias
    - Menores: 60 dias
  - **Status**: Pendente / Em Tratamento / Aguardando Aprovação / Resolvida / Rejeitada
  - **Data de identificação**
  - **Auditor responsável**

- [ ] **Sistema exibe contadores visuais**:
  - "2 NCs Maiores (críticas) 🔴"
  - "3 NCs Menores 🟡"
  - "Total: 5 Não-Conformidades"

- [ ] **Sistema exibe prazo restante com alerta**:
  - Verde: >14 dias restantes
  - Amarelo: 7-14 dias restantes
  - Vermelho: <7 dias restantes (urgente)
  - "⚠️ 5 dias restantes para tratar NC-001"

- [ ] **Sistema permite filtrar NCs**:
  - Por status (Pendente, Em Tratamento, Resolvida)
  - Por classificação (Maior, Menor)
  - Por prazo (Urgentes, No Prazo)

- [ ] **Sistema permite empresa adicionar comentários em cada NC**

- [ ] **Sistema envia notificação quando NCs são identificadas**:
  - E-mail com lista de NCs
  - Destaque para NCs Maiores (críticas)
  - Link direto para página de NCs

**Regras de Negócio**:
- **RN-022**: NCs Maiores DEVEM ser resolvidas antes de emitir certificado
- **RN-023**: NCs Menores podem ser tratadas após emissão (com prazo)

**Testes**:
- [ ] Teste funcional: NCs Maiores bloqueiam certificação
- [ ] Teste de usabilidade: Empresa entende NCs em < 5 minutos

---

##### **US-008: Upload de Evidências de Tratamento de NC**

```
Como empresa solicitante,
Eu quero fazer upload de evidências que mostram correção de não-conformidades,
Para que o auditor possa aprovar o tratamento e o processo possa continuar.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-007 (Visualização de NCs), US-003 (Upload), US-086 (Chat)

**Acceptance Criteria**:

- [ ] **Sistema permite upload de evidências por NC**:
  - Fotos mostrando correção (antes/depois)
  - Documentos atualizados (procedimentos, registros)
  - Descrição textual das ações corretivas tomadas

- [ ] **Para cada NC, empresa pode**:
  - Fazer upload de múltiplas evidências (fotos, docs)
  - Escrever descrição das ações corretivas
  - Marcar NC como "Pronto para Revisão"

- [ ] **Sistema valida uploads**:
  - Formatos: JPG, PNG, PDF, DOCX
  - Tamanho máximo: 50MB por arquivo
  - Mínimo 1 evidência por NC Maior

- [ ] **Sistema muda status automaticamente**:
  - Primeiro upload: "Em Tratamento"
  - Empresa marca como pronta: "Aguardando Aprovação"
  - Auditor aprova: "Resolvida" ✅
  - Auditor rejeita: "Rejeitada" ❌ (empresa deve resubmeter)

- [ ] **Sistema notifica auditor quando empresa marca NC como pronta**

- [ ] **Sistema permite comunicação direta com auditor via chat**:
  - Thread de mensagens por NC
  - Empresa: "Realizamos a correção X. Por favor, revise."
  - Auditor: "Evidências insuficientes. Por favor, envie fotos da área Y."

- [ ] **Sistema exibe histórico completo de tratamento**:
  - Timeline de eventos:
    - 15/11/2025 10:00 - NC identificada por Khalil
    - 18/11/2025 14:30 - Empresa iniciou tratamento
    - 20/11/2025 09:00 - Empresa submeteu evidências
    - 21/11/2025 16:00 - Auditor rejeitou (motivo: foto não clara)
    - 22/11/2025 11:00 - Empresa resubmeteu novas fotos
    - 23/11/2025 08:00 - Auditor aprovou ✅

- [ ] **Sistema bloqueia envio para comitê se NCs Maiores não resolvidas**

- [ ] **Sistema envia lembretes automáticos**:
  - 7 dias antes do prazo: "Lembrete: NC-001 vence em 7 dias"
  - 3 dias antes: "URGENTE: NC-001 vence em 3 dias"
  - No dia: "CRÍTICO: Prazo de NC-001 vence hoje"

**Regras de Negócio**:
- **RN-024**: Apenas auditor que identificou NC pode aprovar tratamento
- **RN-025**: Se prazo expirar, processo é pausado automaticamente
- **RN-026**: NCs Maiores exigem re-auditoria presencial (opcional, configurável)

**Casos de Uso Alternativos**:
- **Caso 1**: Empresa não consegue corrigir NC no prazo → Pode solicitar extensão
- **Caso 2**: NC é considerada inválida pela empresa → Pode contestar (vai para comitê)

**Testes**:
- [ ] Teste funcional: Fluxo completo de tratamento de NC
- [ ] Teste de integração: Chat entre empresa e auditor
- [ ] Teste de usabilidade: Empresa resolve NC em < 10 minutos (tempo de uso do sistema)

---

## ✅ ÉPICO 1 COMPLETO

**Resumo do Épico 1 - Gestão de Solicitações e Onboarding**:

| User Story | Título | Story Points | Status |
|-----------|--------|-------------|--------|
| US-001 | Cadastro de Empresa | 5 SP | ✅ Completa |
| US-002 | Formulário de Solicitação (5 etapas) | 13 SP | ✅ Completa |
| US-003 | Upload e Gestão de Documentos | 8 SP | ✅ Completa |
| US-004 | Dashboard de Status (12 fases) | 8 SP | ✅ Completa |
| US-005 | Notificações Automáticas | 5 SP | ✅ Completa |
| US-006 | Checklist de Documentos | 5 SP | ✅ Completa |
| US-007 | Visualização de NCs | 5 SP | ✅ Completa |
| US-008 | Upload de Evidências de NC | 8 SP | ✅ Completa |
| **TOTAL ÉPICO 1** | **8 User Stories** | **57 SP** | **✅ 100%** |

---

## ÉPICO 2: Gestão Comercial e Contratual 🚀 INOVAÇÃO

**Contexto**: Este épico implementa **2 das 6 inovações tecnológicas exclusivas** do HalalSphere:
- **Inovação #1**: Calculadora Inteligente de Custos Multi-Variável
- **Inovação #3**: Gestão de Contratos Colaborativa por Cláusulas

**Impacto Esperado**:
- ⚡ Redução de **80% no tempo** de criação de propostas (horas → segundos)
- ⚡ Redução de **75% no tempo** de fechamento de contratos (20-30 dias → 5-7 dias)
- ✅ **100% de consistência** em precificação (elimina erro humano)

**Total**: 9 User Stories | **80 Story Points**

---

### 💰 Feature 2.1: Calculadora Inteligente de Custos Multi-Variável

#### **US-009: Configuração de Tabelas de Preço (Admin)**

```
Como administrador da certificadora,
Eu quero configurar tabelas de preço e parâmetros de cálculo,
Para que o sistema calcule propostas comerciais automaticamente com precificação consistente.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP
**Dependências**: US-082 (RBAC)

**Acceptance Criteria**:

- [ ] **Sistema fornece interface de configuração** (Admin apenas)

- [ ] **Tabela de Preços Base por Tipo de Certificação**:
  - C1 a C6 (valores configuráveis)

- [ ] **Fatores Multiplicadores**:
  - Número de produtos (1-10: 1.0x, 11-50: 1.3x, etc.)
  - Turnos (1: 1.0x, 2: 1.4x, 3: 1.8x)
  - Histórico (primeira: 1.0x, renovação: 0.8x)
  - Fornecedores (1-5: 1.0x, 6-15: 1.2x, 16+: 1.5x)

- [ ] **Cálculo de Man-Hour** (PR 7.1 10.7.4):
  - Por funcionários (1-50: 8h, 51-150: 16h, etc.)
  - Valor/hora configurável

- [ ] **Custos de Deslocamento**:
  - Por distância (0km, 100km, 300km, 500km+)
  - Hospedagem se necessário

- [ ] **Taxas Fixas**:
  - Análise documental, Comitê, Emissão, Impostos

- [ ] **Histórico de mudanças** (versionamento)

**RN-027**: Mudanças não afetam processos já iniciados
**RN-028**: Sistema usa tabela vigente na data da solicitação

---

#### **US-010: Cálculo Automático de Proposta**

```
Como analista,
Eu quero que o sistema calcule automaticamente a proposta,
Para evitar cálculos manuais e erros.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:

- [ ] **Fórmula**:
```
TOTAL = (PREÇO_BASE × MULTIPLICADORES)
      + MAN_HOUR + DESLOCAMENTO
      + TAXAS + IMPOSTOS
```

- [ ] **Breakdown detalhado** visível para analista

- [ ] **Analista pode ajustar manualmente** (com justificativa)

- [ ] **Validações**: Alertas se valor muito baixo/alto

**RN-029**: Usa tabela vigente
**RN-030**: Ajustes >20% exigem aprovação

---

#### **US-011: Geração de PDF Profissional**

```
Como analista,
Eu quero gerar PDF profissional da proposta,
Para enviar à empresa.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:

- [ ] **Seções**: Resumo, Breakdown, Escopo, Timeline, Condições, Próximos Passos
- [ ] **Design profissional**: Logo, cores, tabelas, gráficos, QR Code
- [ ] **Geração em < 5 segundos**
- [ ] **Personalizável** (Admin)

---

### 📄 Feature 2.2: Gestão de Contratos Colaborativa por Cláusulas 🚀

**Contexto da Inovação**: Contratos são estruturados em **cláusulas individuais editáveis**. Empresa e certificadora podem editar/comentar cada cláusula separadamente, com versionamento automático, até aprovação final.

#### **US-012: Templates de Contratos por Setor**

```
Como administrador,
Eu quero criar templates de contratos organizados por cláusulas,
Para que analistas possam gerar contratos customizados rapidamente.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:

- [ ] **Admin pode criar templates** por tipo de indústria:
  - Alimentos (Geral)
  - Alimentos - Laticínios
  - Alimentos - Cárneos
  - Farmacêuticos
  - Químicos e Cosméticos

- [ ] **Template estruturado em cláusulas** (15-20 cláusulas típicas):
  1. **Cláusula 1 - Objeto do Contrato**
  2. **Cláusula 2 - Escopo da Certificação**
  3. **Cláusula 3 - Validade do Certificado**
  4. **Cláusula 4 - Responsabilidades da Empresa**
  5. **Cláusula 5 - Responsabilidades da Certificadora**
  6. **Cláusula 6 - Custos e Forma de Pagamento**
  7. **Cláusula 7 - Auditorias de Manutenção**
  8. **Cláusula 8 - Suspensão e Cancelamento**
  9. **Cláusula 9 - Uso da Marca e do Certificado**
  10. **Cláusula 10 - Confidencialidade**
  11. **Cláusula 11 - Propriedade Intelectual**
  12. **Cláusula 12 - Rescisão**
  13. **Cláusula 13 - Multas e Penalidades**
  14. **Cláusula 14 - Legislação Aplicável**
  15. **Cláusula 15 - Foro**

- [ ] **Cada cláusula contém**:
  - Número e título
  - Texto padrão
  - Tipo: **Obrigatória** (não pode ser removida) ou **Opcional**
  - Editável: **Sim** ou **Não** (algumas cláusulas legais não podem ser editadas)
  - Variáveis dinâmicas: `{{NOME_EMPRESA}}`, `{{VALOR_TOTAL}}`, `{{VALIDADE}}`, etc.

- [ ] **Sistema suporta variáveis dinâmicas** que são preenchidas automaticamente

- [ ] **Admin pode duplicar/editar templates existentes**

- [ ] **Histórico de versões de templates**

**RN-032**: Cláusulas obrigatórias não podem ser removidas do contrato

---

#### **US-013: Geração Automática de Contrato a partir de Proposta Aceita**

```
Como analista,
Eu quero que o sistema gere automaticamente um contrato quando a proposta for aceita,
Para iniciar a negociação rapidamente.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:

- [ ] **Quando empresa aceita proposta**, sistema automaticamente:
  1. Seleciona template de contrato apropriado (baseado em tipo de indústria)
  2. Preenche variáveis dinâmicas:
     - `{{NOME_EMPRESA}}` → Razão Social
     - `{{CNPJ}}` → CNPJ formatado
     - `{{ENDERECO}}` → Endereço completo
     - `{{VALOR_TOTAL}}` → Valor da proposta
     - `{{DATA}}` → Data atual
     - `{{VALIDADE}}` → 3 anos
     - etc.
  3. Cria registro de contrato com status: **"Em Preparação"**
  4. Notifica analista: "Contrato gerado. Revise antes de enviar."

- [ ] **Analista pode revisar contrato** antes de enviar à empresa:
  - Visualiza todas cláusulas pré-preenchidas
  - Pode editar cláusulas editáveis
  - Pode adicionar cláusulas opcionais
  - Pode remover cláusulas opcionais (obrigatórias não)

- [ ] **Após revisão, analista envia para empresa**:
  - Botão: "Enviar Contrato para Empresa"
  - Status muda para: **"Aguardando Revisão da Empresa"**
  - Empresa recebe notificação por e-mail

**RN-033**: Contrato só pode ser enviado após proposta aceita

---

#### **US-014: Interface Colaborativa de Edição por Cláusulas (Empresa)**

```
Como empresa,
Eu quero editar e comentar cláusulas específicas do contrato,
Para negociar termos sem trocas intermináveis de e-mail.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:

- [ ] **Interface de revisão de contrato para empresa**:

**Visualização Lado-a-Lado**:
```
┌─────────────────────┬─────────────────────┐
│ PROPOSTA ORIGINAL   │  VERSÃO EDITADA     │
│   (Certificadora)   │  (Colaborativa)     │
├─────────────────────┼─────────────────────┤
│ Cláusula 1 - Objeto │ Cláusula 1 - Objeto │
│ [Texto original...] │ [Texto editado...]  │
│                     │                     │
│ Status: ✅ Aprovado │ Status: 📝 Editado  │
│ Comentários: 0      │ Comentários: 2      │
└─────────────────────┴─────────────────────┘
```

- [ ] **Para cada cláusula, empresa pode**:
  1. **Aprovar** (marca como ✅ Aprovado)
  2. **Editar** (modifica texto, marca como 📝 Editado)
  3. **Comentar** (adiciona comentário sem editar texto)
  4. **Rejeitar** (marca como ❌ Rejeitada com motivo)

- [ ] **Sistema exibe status granular por cláusula**:
  - ✅ **Aprovada** (ambas partes aprovaram)
  - 📝 **Editada pela Empresa** (aguardando certificadora)
  - 📝 **Editada pela Certificadora** (aguardando empresa)
  - 💬 **Em Discussão** (há comentários não resolvidos)
  - ❌ **Rejeitada** (uma parte rejeitou)
  - ⏳ **Pendente** (nenhuma ação ainda)

- [ ] **Contador de progresso visual**:
  - "12 de 15 cláusulas aprovadas (80%)"
  - Barra de progresso colorida
  - Lista de cláusulas pendentes

- [ ] **Sistema bloqueia edição de cláusulas obrigatórias não-editáveis**:
  - Exibe ícone de cadeado 🔒
  - Tooltip: "Esta cláusula é obrigatória e não pode ser editada conforme legislação vigente"

- [ ] **Thread de comentários por cláusula**:
  - Empresa: "Sugerimos mudar prazo de 30 para 45 dias"
  - Certificadora: "Aceito. Mudança aplicada."
  - Cada comentário tem timestamp e autor

- [ ] **Notificações em tempo real**:
  - Quando certificadora edita cláusula, empresa recebe notificação
  - Vice-versa

**RN-034**: Cláusulas obrigatórias 🔒 não podem ser editadas
**RN-035**: Apenas 1 versão ativa de cada cláusula (última edição prevalece)

---

#### **US-015: Versionamento Automático de Mudanças**

```
Como usuário do sistema (empresa ou certificadora),
Eu quero ver histórico completo de mudanças em cada cláusula,
Para rastrear negociação e entender o que mudou.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:

- [ ] **Sistema mantém histórico completo** de cada cláusula:

**Exemplo de histórico da Cláusula 6**:
```
Cláusula 6 - Custos e Forma de Pagamento

📜 HISTÓRICO DE VERSÕES:

v1 - 10/11/2025 14:30 - Analista Mariana Silva
"O valor total da certificação é de R$ 12.916,80,
parcelado em 3x sem juros."

v2 - 11/11/2025 09:15 - Empresa Ahmad Silva
"O valor total da certificação é de R$ 12.916,80,
parcelado em 4x sem juros."
Comentário: "Solicitamos parcelamento em 4x"

v3 - 11/11/2025 16:00 - Analista Mariana Silva (ATUAL)
"O valor total da certificação é de R$ 12.916,80,
parcelado em 4x sem juros, com acréscimo de 2% em cada parcela."
Comentário: "Aceito 4x mas com acréscimo de 2% por parcela conforme política comercial"

Status: 📝 Aguardando aprovação da empresa
```

- [ ] **Sistema destaca mudanças** (diff visual):
  - Texto removido em vermelho tachado
  - Texto adicionado em verde destacado

- [ ] **Usuário pode reverter para versão anterior**:
  - Botão "Reverter para v1"
  - Cria nova versão (não deleta histórico)

- [ ] **Histórico é imutável** (não pode ser apagado)

- [ ] **Audit trail completo**:
  - Quem editou, quando, o que mudou, comentário

**RN-036**: Histórico de versões é imutável e auditável

---

#### **US-016: Aprovação Final e Bloqueio de Edição**

```
Como analista ou empresa,
Eu quero aprovar o contrato completo apenas quando TODAS cláusulas estiverem aprovadas,
Para garantir que não há pendências.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:

- [ ] **Sistema bloqueia aprovação final até**:
  - 100% das cláusulas estejam com status ✅ Aprovada
  - Ambas as partes (empresa + certificadora) aprovaram TODAS

- [ ] **Botão "Aprovar Contrato Final"** aparece apenas quando:
  - Todas cláusulas aprovadas
  - Nenhuma cláusula em edição/discussão/rejeitada

- [ ] **Ao clicar "Aprovar Contrato Final"**:
  - Sistema exibe confirmação: "Tem certeza? Após aprovação, o contrato não poderá mais ser editado."
  - Após confirmação:
    - Status do contrato muda para: **"Aprovado - Aguardando Assinatura"**
    - Contrato é **bloqueado para edição** (ambas partes não podem mais editar)
    - Sistema gera PDF final do contrato
    - Sistema envia para assinatura digital (US-017)

- [ ] **Se uma parte tentar editar após aprovação final**: Sistema bloqueia e exibe mensagem

**RN-037**: Contrato aprovado é imutável (não pode ser editado)
**RN-038**: Apenas após ambas partes aprovarem TODAS cláusulas, contrato vai para assinatura

---

#### **US-017: Assinatura Digital Integrada**

```
Como empresa ou certificadora,
Eu quero assinar digitalmente o contrato aprovado,
Para que o contrato tenha validade jurídica e o processo possa continuar.
```

**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:

- [ ] **Integração com plataforma de assinatura digital**:
  - **Opção 1**: Docusign (internacional)
  - **Opção 2**: D4Sign (Brasil)
  - **Opção 3**: ICP-Brasil (validade jurídica máxima no Brasil)
  - Escolha configurável por Admin

- [ ] **Quando contrato é aprovado, sistema**:
  1. Gera PDF final do contrato com todas cláusulas aprovadas
  2. Envia para plataforma de assinatura digital
  3. Define signatários:
     - Empresa: Nome e e-mail do responsável
     - Certificadora: Nome e e-mail do diretor/coordenador
  4. Cada signatário recebe e-mail com link para assinar

- [ ] **Fluxo de assinatura**:
  - Empresa assina primeiro (ordem configurável)
  - Após empresa assinar, notifica certificadora
  - Certificadora assina
  - Após ambas assinarem, contrato é considerado **"Assinado"**

- [ ] **Sistema recebe webhook** da plataforma de assinatura:
  - Quando empresa assina → Status: "Aguardando Assinatura Certificadora"
  - Quando certificadora assina → Status: **"Contrato Assinado"** ✅
  - Sistema armazena certificado de assinatura (PDF)

- [ ] **Após ambas assinaturas**:
  - Status do processo muda para: **"Contrato Assinado - Estágio 1"**
  - Sistema notifica empresa: "Contrato assinado com sucesso! Próxima etapa: Análise Documental."
  - Sistema notifica analista: "Contrato assinado. Processo pode avançar para Estágio 1."
  - PDF assinado disponível para download por ambas partes

- [ ] **Sistema permite reenvio de e-mail de assinatura** (se expirou)

- [ ] **Sistema exibe status de assinatura em tempo real**:
  - ⏳ Aguardando Empresa
  - ⏳ Aguardando Certificadora
  - ✅ Assinado por Ambas Partes

**RN-039**: Contrato só é válido após assinatura digital de ambas partes
**RN-040**: Processo não avança para Estágio 1 até contrato assinado

**Integrações**:
- [ ] Docusign API / D4Sign API / ICP-Brasil
- [ ] Webhook para receber status de assinatura
- [ ] Download de PDF assinado com certificado

**Testes**:
- [ ] Teste de integração: Envio para Docusign/D4Sign
- [ ] Teste funcional: Fluxo completo de assinatura
- [ ] Teste de segurança: Validação de certificado de assinatura

---

## ✅ ÉPICO 2 COMPLETO

**Resumo do Épico 2 - Gestão Comercial e Contratual**:

| User Story | Título | Story Points | Status |
|-----------|--------|-------------|--------|
| US-009 | Configuração de Tabelas de Preço | 8 SP | ✅ Completa |
| US-010 | Cálculo Automático de Proposta | 13 SP | ✅ Completa |
| US-011 | Geração de PDF Profissional | 8 SP | ✅ Completa |
| US-012 | Templates de Contratos | 8 SP | ✅ Completa |
| US-013 | Geração Automática de Contrato | 8 SP | ✅ Completa |
| US-014 | Interface Colaborativa (Cláusulas) | 13 SP | ✅ Completa |
| US-015 | Versionamento Automático | 5 SP | ✅ Completa |
| US-016 | Aprovação Final e Bloqueio | 5 SP | ✅ Completa |
| US-017 | Assinatura Digital Integrada | 13 SP | ✅ Completa |
| **TOTAL ÉPICO 2** | **9 User Stories** | **81 SP** | **✅ 100%** |

**Inovações Implementadas**:
- 🚀 Calculadora Inteligente (propostas em segundos vs horas)
- 🚀 Contratos Colaborativos (5-7 dias vs 20-30 dias)

---

## ÉPICO 3: Análise e Preparação (Analistas) 🚀

**Contexto**: Features para analistas gerenciarem processos, analisarem documentação e coordenarem auditorias. Inclui **Inovação #4: Calendário Inteligente de Auditorias**.

**Total**: 12 User Stories | **90 Story Points**

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

#### **US-023: Solicitação de Documentos Complementares**
```
Como analista,
Eu quero solicitar documentos adicionais diretamente no sistema,
Para que empresa saiba exatamente o que está faltando.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Botão** "Solicitar Documentos Adicionais"
- [ ] **Lista** de documentos que podem ser solicitados
- [ ] **Campo** de descrição do que é necessário
- [ ] **Prazo** para envio (configurável, padrão 7 dias)
- [ ] **Notificação** automática à empresa
- [ ] **Processo pausado** até documentos enviados

**RN-044**: Após 3 solicitações sem resposta, processo pode ser cancelado

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

| User Story | Título | SP | Status |
|-----------|--------|-----|--------|
| US-018 | Dashboard Kanban | 8 SP | ✅ |
| US-019 | Atribuição Automática | 5 SP | ✅ |
| US-020 | Revisão de Solicitação | 8 SP | ✅ |
| US-021 | Enquadramento GSO/SMIIC | 8 SP | ✅ |
| US-022 | Checklist Estágio 1 | 8 SP | ✅ |
| US-023 | Solicitação de Docs | 5 SP | ✅ |
| US-024 | Assistência IA Docs | 13 SP | ✅ |
| US-025 | Cadastro de Auditores | 5 SP | ✅ |
| US-026 | Matching Inteligente | 13 SP | ✅ |
| US-027 | Agendamento Colaborativo | 8 SP | ✅ |
| US-028 | Calendário Visual | 8 SP | ✅ |
| US-029 | Briefing Automático | 5 SP | ✅ |
| **TOTAL** | **12 Stories** | **94 SP** | ✅ |

---

## ÉPICO 4: Execução de Auditorias (Auditores) 🚀 INOVAÇÃO #2

**Contexto**: App mobile para auditores + **IA de Análise Pré-Auditoria** que reduz tempo de auditoria em 30-40%.

**Total**: 10 User Stories | **100 Story Points**

---

### 📱 Feature 4.1: App Mobile para Auditores

#### **US-030: Agenda de Auditorias (Mobile)**
```
Como auditor,
Eu quero ver minhas auditorias agendadas no app,
Para gerenciar minha agenda.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Lista** de auditorias: Hoje, Esta Semana, Próximas
- [ ] **Card** por auditoria: Empresa, endereço, data/hora, tipo certificação
- [ ] **Status visual**: Agendada, Confirmada, Em Execução, Concluída
- [ ] **Navegação GPS** integrada (Google Maps)
- [ ] **Botão** "Iniciar Auditoria" (muda status)
- [ ] **Funciona offline** (sincroniza depois)

---

### 🤖 Feature 4.2: IA de Suporte ao Auditor 🚀 INOVAÇÃO #2

#### **US-031: Análise Pré-Auditoria com IA**
```
Como auditor,
Eu quero IA que analise documentação ANTES da auditoria,
Para chegar preparado e focar no que importa.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 21 SP

**Acceptance Criteria**:

**1. Extração Inteligente de Informações**:
- [ ] **IA processa** todos documentos da empresa:
  - Fichas técnicas (PDFs)
  - Listas de ingredientes (Excel/PDF)
  - Procedimentos (Word/PDF)
  - Fotos da planta
- [ ] **Extrai automaticamente**:
  - Lista completa de produtos
  - Ingredientes por produto
  - Matérias-primas utilizadas
  - Fornecedores e certificados
  - Processos de fabricação

**2. Identificação de Pontos Críticos**:
- [ ] **IA identifica**:
  - Matérias-primas de **origem animal** (exigem certificado Halal)
  - Ingredientes em **lista positiva** (pré-aprovados)
  - Ingredientes **questionáveis** (ex: E471, E322, gelatina)
  - Uso de **álcool** em processos
  - **Aditivos críticos** (podem conter derivados não-Halal)

**3. Alertas por Categoria de Risco**:
- [ ] **Sistema classifica** cada ingrediente:
  - 🔴 **Alto**: Glicerina (E422), Lecitina (E322), Gelatina → Exigem certificado obrigatório
  - 🟡 **Médio**: Aromatizantes, Corantes → Validar fornecedor
  - 🟢 **Baixo**: Sal, Açúcar, Farinha → Pré-aprovados

**4. Resumo Executivo Gerado Automaticamente**:
```
📊 RESUMO EXECUTIVO - IA DE PRÉ-AUDITORIA
Empresa: Indústria ABC Alimentos

✅ INFORMAÇÕES EXTRAÍDAS:
- 15 produtos identificados
- 48 matérias-primas catalogadas
- 12 fornecedores mapeados
- 3 processos principais: Mistura, Cozimento, Embalagem

⚠️ PONTOS CRÍTICOS IDENTIFICADOS:
🔴 3 ingredientes de ALTO RISCO:
   1. Glicerina (E422) - Origem: Fornecedor XYZ
      → Certificado Halal: NÃO ENCONTRADO ❌
   2. Lecitina de Soja (E322) - Origem: Fornecedor ABC
      → Certificado Halal: VÁLIDO até 2026 ✅
   3. Gelatina Bovina - Origem: Fornecedor DEF
      → Certificado Halal: VENCIDO (exp: 2024) ❌

🟡 5 ingredientes de MÉDIO RISCO:
   - Aromatizantes naturais (sem especificação de origem)
   - Corante caramelo (processo não especificado)
   ...

🟢 40 ingredientes PRÉ-APROVADOS (origem vegetal/mineral)

🎯 RECOMENDAÇÕES PARA AUDITORIA:
1. PRIORIDADE ALTA: Validar certificado de Glicerina e Gelatina
2. Verificar in loco: Área de armazenamento de matérias-primas
3. Solicitar documentos: Especificações técnicas de aromatizantes
4. Confirmar: Processo de higienização entre lotes

⏱️ TEMPO ESTIMADO DE AUDITORIA: 12-14 horas (2 dias)
```

- [ ] **Resumo disponível** 3 dias antes da auditoria
- [ ] **Auditor pode** adicionar notas/comentários
- [ ] **Exportável** em PDF para levar em campo

**RN-047**: IA é assistente, decisão final sempre do auditor

---

#### **US-032: Checklist Personalizado de Auditoria**
```
Como auditor,
Eu quero checklist customizado baseado no tipo de empresa,
Para não esquecer nenhum ponto importante.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Checklist gerado** baseado em: Tipo C1-C6, produtos, processos
- [ ] **Seções típicas**: Instalações, Matérias-Primas, Processo Produtivo, Armazenamento, Pessoal, Documentação
- [ ] **Cada item** pode ser marcado: ✅ Conforme / ❌ NC Maior / ⚠️ NC Menor / ➖ N/A
- [ ] **Campo de observações** por item
- [ ] **Auditor pode** adicionar itens customizados
- [ ] **Salvamento automático** a cada mudança

---

### 📸 Feature 4.3: Execução de Auditoria (Offline)

#### **US-033: Registro de Evidências com Fotos**
```
Como auditor,
Eu quero capturar fotos como evidências,
Para documentar achados visualmente.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Câmera integrada** no app
- [ ] **Fotos** automaticamente associadas ao processo
- [ ] **Tags**: Auditor pode marcar foto com categoria (ex: "Armazenamento", "NC-001")
- [ ] **Anotações**: Desenhar/escrever sobre foto
- [ ] **Compressão** automática (não ocupar muito espaço)
- [ ] **Funciona offline** (upload depois)

---

#### **US-034: Identificação de Não-Conformidades In Loco**
```
Como auditor,
Eu quero registrar NCs durante auditoria,
Para não esquecer nenhuma depois.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Botão** "Registrar NC"
- [ ] **Formulário**:
  - Classificação: Maior / Menor
  - Descrição detalhada
  - Seção PR 7.1 violada
  - Fotos de evidência
  - Ação corretiva sugerida
- [ ] **NC recebe código único** (NC-2025-000123-001)
- [ ] **Lista** de NCs registradas durante auditoria
- [ ] **Edição** possível até submeter relatório

**RN-048**: NC Maior exige foto obrigatória

---

### 📝 Feature 4.4: Relatório de Auditoria

#### **US-035: Geração Automática de Relatório**
```
Como auditor,
Eu quero que relatório seja gerado automaticamente,
Para evitar horas digitando.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Relatório pré-preenchido** com:
  - Dados da empresa
  - Data/duração da auditoria
  - Auditor responsável
  - Checklist completo (respostas)
  - Fotos anexadas
  - NCs identificadas
  - Observações gerais
- [ ] **Template conforme PR 7.1 10.7**
- [ ] **Seções**:
  1. Resumo Executivo
  2. Escopo da Auditoria
  3. Metodologia
  4. Achados (Conformidades e NCs)
  5. Evidências Fotográficas
  6. Conclusão e Recomendações
- [ ] **Auditor pode editar** antes de submeter
- [ ] **Geração de PDF** profissional
- [ ] **Assinatura digital** do auditor

---

#### **US-036: Submissão e Notificação**
```
Como auditor,
Eu quero submeter relatório e notificar automaticamente,
Para processo avançar rapidamente.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Botão** "Submeter Relatório Final"
- [ ] **Validação**: Checklist completo, todas NCs descritas
- [ ] **Após submissão**:
  - Status do processo: "Auditoria Concluída"
  - Analista recebe notificação
  - Empresa recebe notificação (se NCs: lista, senão: parabéns)
  - Relatório disponível para download
- [ ] **Auditor não pode editar** após submissão

---

#### **US-037: Acompanhamento de Tratamento de NCs (Auditor)**
```
Como auditor,
Eu quero acompanhar tratamento das NCs que identifiquei,
Para aprovar correções.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Lista de NCs** identificadas por auditor
- [ ] **Status por NC**: Pendente, Em Tratamento, Aguardando Aprovação, Resolvida
- [ ] **Notificação** quando empresa submete evidências
- [ ] **Auditor pode**: Aprovar / Rejeitar (com motivo) / Solicitar mais evidências
- [ ] **Chat integrado** por NC (US-008)

---

### 🔄 Feature 4.5: Sincronização e Offline

#### **US-038: Modo Offline Completo**
```
Como auditor,
Eu quero trabalhar offline durante auditoria,
Para não depender de WiFi/dados.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Download prévio** de:
  - Dados da auditoria
  - Documentos da empresa
  - Checklist
  - Relatório de IA
- [ ] **Funciona completamente offline**:
  - Marcar checklist
  - Tirar fotos
  - Registrar NCs
  - Fazer anotações
- [ ] **Sincronização automática** quando voltar online
- [ ] **Indicador visual** de status: Online / Offline / Sincronizando

**RN-049**: Dados salvos localmente criptografados

---

#### **US-039: Histórico de Auditorias Anteriores**
```
Como auditor,
Eu quero acessar auditorias anteriores da mesma empresa,
Para comparar e identificar padrões.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Botão** "Ver Auditorias Anteriores"
- [ ] **Lista** de auditorias passadas: Data, auditor, NCs encontradas
- [ ] **Comparação lado-a-lado**: NC atual vs histórico
- [ ] **Alertas**: "Esta NC foi identificada 3x nos últimos 2 anos"

---

## ✅ ÉPICO 4 COMPLETO

| User Story | Título | SP | Status |
|-----------|--------|-----|--------|
| US-030 | Agenda Mobile | 8 SP | ✅ |
| US-031 | IA Pré-Auditoria | 21 SP | ✅ |
| US-032 | Checklist Personalizado | 8 SP | ✅ |
| US-033 | Registro de Evidências | 8 SP | ✅ |
| US-034 | Identificação de NCs | 8 SP | ✅ |
| US-035 | Geração Automática Relatório | 13 SP | ✅ |
| US-036 | Submissão e Notificação | 5 SP | ✅ |
| US-037 | Acompanhamento NCs | 8 SP | ✅ |
| US-038 | Modo Offline | 13 SP | ✅ |
| US-039 | Histórico de Auditorias | 5 SP | ✅ |
| **TOTAL** | **10 Stories** | **97 SP** | ✅ |

**Inovação**: IA de Pré-Auditoria reduz tempo em 30-40%

---

## ÉPICO 5: Decisão e Emissão de Certificados (Comitê)

**Total**: 8 User Stories | **50 Story Points**

---

### 📊 Feature 5.1: Painel do Comitê Técnico

#### **US-040: Lista de Casos Pendentes de Decisão**
```
Como membro do comitê,
Eu quero ver lista priorizada de casos pendentes,
Para organizar reunião mensal.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Lista** ordenada por: Data de submissão, Urgência, Complexidade
- [ ] **Card** por caso: Empresa, tipo certificação, analista responsável, dias aguardando
- [ ] **Filtros**: Por tipo, por mês, por analista
- [ ] **Indicador de complexidade**: Simples / Médio / Complexo

---

### 📑 Feature 5.2: Dossiê de Certificação

#### **US-041: Dossiê Estruturado e Completo**
```
Como membro do comitê,
Eu quero dossiê completo e organizado,
Para tomar decisão informada rapidamente.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Dossiê contém** (abas/seções):
  1. **Resumo Executivo**: Tipo, escopo, recomendação analista
  2. **Dados da Empresa**: CNPJ, endereço, contatos, outras certificações
  3. **Solicitação Completa**: Produtos, processos, fornecedores
  4. **Relatório Estágio 1**: Análise documental
  5. **Relatório Estágio 2**: Auditoria presencial
  6. **Não-Conformidades**: Lista completa, tratamentos, status
  7. **Histórico**: Certificações anteriores, auditorias, decisões
  8. **Recomendação**: Opinião do analista (Aprovar/Negar/Condições)

- [ ] **Navegação fácil** entre seções
- [ ] **Download** de dossiê completo (PDF)
- [ ] **Acesso a documentos originais** (fotos, relatórios, fichas técnicas)

---

#### **US-042: Busca de Casos Similares**
```
Como membro do comitê,
Eu quero buscar decisões anteriores similares,
Para manter consistência.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Sistema sugere** casos similares:
  - Mesmo tipo de indústria
  - Produtos parecidos
  - NCs similares
- [ ] **Exibe**: Decisão tomada, justificativa, data
- [ ] **Filtro manual**: Busca por palavra-chave, tipo, período

**RN-050**: Decisões anteriores são referência, não vinculativas

---

### ✅ Feature 5.3: Deliberação e Votação

#### **US-043: Deliberação Digital Individual**
```
Como membro do comitê,
Eu quero registrar meu voto e justificativa,
Para deliberação ser documentada.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Opções de voto**:
  - ✅ **Aprovar** (certificação concedida)
  - ⚠️ **Aprovar com Condições** (especificar condições)
  - ❌ **Negar** (certificação negada)
  - 🔄 **Solicitar Mais Informações** (retorna ao analista)
- [ ] **Campo obrigatório**: Justificativa detalhada (min 100 caracteres)
- [ ] **Campo opcional**: Condições específicas (se aplicável)
- [ ] **Assinatura digital** do voto

---

#### **US-044: Reunião Virtual do Comitê**
```
Como coordenador do comitê,
Eu quero realizar reunião virtual com votação em tempo real,
Para decisões ágeis.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Interface de reunião**: Lista de casos para deliberar
- [ ] **Apresentação**: Dossiê projetado para todos
- [ ] **Votação em tempo real**: Cada membro vota simultaneamente
- [ ] **Discussão**: Chat/comentários durante reunião
- [ ] **Resultado**: Cálculo automático (maioria simples/qualificada)
- [ ] **Ata gerada** automaticamente

**RN-051**: Quórum mínimo de 3 membros para decisão válida

---

#### **US-045: Registro de Decisão Final**
```
Como sistema,
Eu quero registrar decisão final com rastreabilidade,
Para conformidade com PR 7.1 10.9.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Decisão registrada** com:
  - Resultado (Aprovado/Negado/Condicional)
  - Data da deliberação
  - Membros presentes e votos individuais
  - Justificativa consolidada
  - Condições (se aplicável)
  - Assinaturas digitais
- [ ] **Audit trail completo** (imutável)
- [ ] **Notificações automáticas**:
  - Analista responsável
  - Empresa (e-mail personalizado conforme decisão)

**RN-052**: Decisão do comitê é final e vinculativa

---

### 🎖️ Feature 5.4: Emissão de Certificados

#### **US-046: Geração Automática de Certificado Digital**
```
Como sistema,
Eu quero gerar certificado digital automaticamente após aprovação,
Para emissão rápida conforme PR 7.1 10.9.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Template profissional** com:
  - Logo da certificadora
  - Nome da empresa
  - CNPJ
  - Produtos certificados
  - Tipo de certificação (C1-C6)
  - Normas atendidas (GSO 2055-2, SMIIC 02)
  - Número único do certificado: formato "HS-CERT-YYYY-NNNNNN"
  - Data de emissão
  - Validade (3 anos)
  - QR Code para validação online
  - Assinatura digital da certificadora
  - Marca d'água e elementos de segurança

- [ ] **Geração em < 10 segundos**
- [ ] **PDF de alta qualidade** (300 DPI, não editável)
- [ ] **Numeração sequencial** controlada

---

#### **US-047: Validação Pública de Certificados**
```
Como público geral,
Eu quero validar autenticidade de certificados online,
Para confiar na certificação.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Página pública** de validação (sem login)
- [ ] **Busca** por:
  - Número do certificado
  - QR Code (scan)
  - Nome da empresa
  - CNPJ
- [ ] **Resultado exibe**:
  - ✅ **Válido**: Empresa, produtos, validade, data emissão
  - ⚠️ **Vencido**: Data de vencimento
  - ❌ **Inválido**: Certificado não encontrado
- [ ] **Certificados suspensos** aparecem como inválidos
- [ ] **Download** do certificado original (PDF)

---

#### **US-048: Publicação e Notificação de Certificado**
```
Como empresa,
Eu quero receber certificado imediatamente após emissão,
Para usar em negócios.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **Após emissão**:
  - Status processo: "Certificado Emitido" 🎉
  - Empresa recebe e-mail: "Parabéns! Certificado emitido"
  - E-mail contém: Link download PDF, número certificado, validade
  - Certificado disponível no dashboard da empresa
  - Publicado automaticamente em "Empresas Certificadas" (página pública)
- [ ] **Notificação SMS** (opcional)
- [ ] **Certificado em alta resolução** para impressão

**RN-053**: Certificado válido por 3 anos a partir da emissão

---

## ✅ ÉPICO 5 COMPLETO

| User Story | Título | SP | Status |
|-----------|--------|-----|--------|
| US-040 | Lista de Casos Pendentes | 5 SP | ✅ |
| US-041 | Dossiê Estruturado | 8 SP | ✅ |
| US-042 | Busca Casos Similares | 5 SP | ✅ |
| US-043 | Deliberação Digital | 8 SP | ✅ |
| US-044 | Reunião Virtual | 8 SP | ✅ |
| US-045 | Registro de Decisão | 5 SP | ✅ |
| US-046 | Geração Certificado | 8 SP | ✅ |
| US-047 | Validação Pública | 8 SP | ✅ |
| US-048 | Publicação e Notificação | 5 SP | ✅ |
| **TOTAL** | **9 Stories** | **60 SP** | ✅ |

---

# 🤖 Épico 6: Assistente IA Multilíngue

**Objetivo**: Implementar assistente de IA baseado em RAG para suporte técnico, análise documental e classificação automática conforme PR 7.1 e normas GSO/SMIIC.

**Inovação #5**: Chatbot inteligente que domina PR 7.1, GSO 2055-2 e SMIIC 02 em 4 idiomas (Português, Inglês, Árabe, Turco).

**Valor de Negócio**:
- ⏱️ **Redução de 60%** no tempo de análise documental via OCR + IA
- 📚 **Base de conhecimento unificada** - PR 7.1 + Normas + FAQs
- 🌍 **Suporte 24/7** em 4 idiomas sem aumento de equipe
- 🎯 **Precisão de 95%+** em classificação automática de produtos

**Prioridade**: P0 (Must Have) | **Total**: 80 SP

---

## 🧠 Feature 6.1: Base de Conhecimento RAG

### **US-049: Implementação de Base RAG**
```
Como sistema de IA,
Eu quero indexar documentos técnicos em embeddings vetoriais,
Para busca semântica precisa conforme PR 7.1.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Documentos indexados**:
  - ✅ PR 7.1 Rev 21 completo (56 páginas)
  - ✅ GSO 2055-2 (categorias de produtos Halal)
  - ✅ SMIIC 02 (classificação de produtos)
  - ✅ Base histórica de decisões do comitê
  - ✅ FAQs e documentos de treinamento
- [ ] **Pipeline de processamento**:
  - Chunking inteligente: 500-1000 tokens com overlap de 100
  - Embeddings: OpenAI text-embedding-3-large ou equivalente
  - Vector DB: Pinecone/Weaviate/Qdrant
- [ ] **Metadados indexados**:
  - Tipo documento (PR/GSO/SMIIC/FAQ)
  - Seção/capítulo
  - Idioma original
  - Data atualização
- [ ] **Atualização automática**: Quando documentos são modificados

**RN-054**: Base RAG deve ser atualizada em até 1h após mudanças nos documentos fonte

**Dependências Técnicas**:
```python
# Stack sugerido
- Embeddings: OpenAI text-embedding-3-large
- Vector DB: Pinecone (serverless)
- Framework: LangChain ou LlamaIndex
- LLM: GPT-4o ou Claude 3.5 Sonnet
```

---

## 💬 Feature 6.2: Chatbot Multilíngue

### **US-050: Chatbot Contextual em 4 Idiomas**
```
Como usuário do sistema,
Eu quero conversar com assistente IA sobre certificação Halal,
Para tirar dúvidas técnicas 24/7 em meu idioma.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 21 SP

**Acceptance Criteria**:
- [ ] **Idiomas suportados**:
  - 🇧🇷 Português (pt-BR)
  - 🇬🇧 Inglês (en-US)
  - 🇸🇦 Árabe (ar-SA)
  - 🇹🇷 Turco (tr-TR)
- [ ] **Capacidades do chatbot**:
  - Responde sobre PR 7.1 (procedimentos, requisitos, prazos)
  - Explica GSO 2055-2 e SMIIC 02 (categorias de produtos)
  - Esclarece status de solicitações
  - Orienta sobre documentos necessários
  - Explica NCs e como resolvê-las
- [ ] **Interface**:
  - Widget no canto inferior direito (todas as páginas)
  - Histórico de conversas salvo
  - Sugestões de perguntas frequentes
  - Indicador de "digitando..."
- [ ] **Segurança**:
  - Contexto isolado por empresa (não vaza dados)
  - Rate limiting: 30 mensagens/hora por usuário
  - Filtro de conteúdo impróprio
- [ ] **Feedback loop**:
  - Botões 👍/👎 para cada resposta
  - Opção "Falar com humano" (cria ticket)

**RN-055**: Respostas em <5s para 95% das consultas
**RN-056**: Chatbot não pode contradizer PR 7.1 ou normas

**Prompt System Template**:
```
Você é o assistente oficial da HalalSphere, especialista em certificação Halal.
Base seu conhecimento em:
1. PR 7.1 Rev 21 (procedimento operacional)
2. GSO 2055-2 e SMIIC 02 (categorias de produtos)
3. Histórico de decisões do comitê

Regras:
- Sempre cite a fonte (ex: "Conforme PR 7.1 item 5.2...")
- Se não souber, diga "Vou conectar você com um especialista"
- Seja claro, objetivo e profissional
- Respeite o idioma do usuário
```

---

### **US-051: Integração com Contexto de Processo**
```
Como usuário com solicitação ativa,
Eu quero que chatbot conheça meu contexto,
Para respostas personalizadas.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Chatbot acessa** (com permissão do usuário):
  - Fase atual do processo
  - Documentos pendentes
  - NCs abertas
  - Próximas ações esperadas
- [ ] **Exemplo de interação**:
  ```
  Usuário: "Por que meu processo está parado?"
  IA: "Olá! Seu processo #1234 está na Fase 3 (Análise Documental).
       Estamos aguardando você enviar:
       - Certificado de abate atualizado
       - Lista de fornecedores
       Envie pelo menu 'Documentos' para prosseguir."
  ```
- [ ] **Privacy**: Usuário pode desabilitar acesso ao contexto

---

## 📄 Feature 6.3: OCR e Análise Documental

### **US-052: OCR Inteligente de Documentos**
```
Como sistema,
Eu quero extrair texto de PDFs/imagens automaticamente,
Para análise por IA sem digitação manual.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **OCR em uploads**:
  - PDFs escaneados → texto extraído
  - Imagens (JPG/PNG) → texto extraído
  - Suporte multi-idioma (PT/EN/AR/TR)
  - Preserva layout/tabelas quando possível
- [ ] **Integração**:
  - AWS Textract OU Azure Document Intelligence OU Google Vision
  - Fallback para Tesseract (open-source)
- [ ] **Pós-processamento**:
  - Correção ortográfica automática
  - Detecção de entidades: Produtos, Ingredientes, Empresas
  - Classificação do tipo de documento (Contrato/Manual/Certificado/etc)
- [ ] **Indicador de qualidade**: "Confiança 95%" se OCR bem-sucedido

**RN-057**: OCR deve processar documentos de até 50 páginas em <2min

---

## 🏷️ Feature 6.4: Classificação Automática

### **US-053: Classificação GSO/SMIIC Automática**
```
Como analista,
Eu quero que IA classifique produtos automaticamente,
Para economizar tempo em enquadramento.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Input**: Nome do produto + descrição + ingredientes (se aplicável)
- [ ] **Output**:
  - Categoria GSO 2055-2 (ex: "Grupo 3 - Produtos Cárneos")
  - Código SMIIC 02 (ex: "02.01 - Carne Bovina Fresca")
  - Nível de confiança (0-100%)
- [ ] **Interface**:
  - Sugestão automática ao preencher formulário
  - Analista pode aceitar/rejeitar/editar
  - Histórico de classificações para aprendizado
- [ ] **Machine Learning**:
  - Treinar com histórico de 500+ produtos já classificados
  - Re-treino mensal com novos dados

**RN-058**: Classificações com confiança <70% requerem revisão humana obrigatória

---

### **US-054: Verificação de Conformidade PR 7.1**
```
Como analista,
Eu quero que IA analise documentos e identifique gaps,
Para checklist automático de conformidade.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **IA analisa**:
  - Manual Halal da empresa
  - Políticas e procedimentos
  - Certificados de fornecedores
  - Contratos com abatedouros
- [ ] **Verifica requisitos PR 7.1**:
  - ✅ Item 5.1: Política Halal documentada
  - ✅ Item 5.2: Responsável Halal designado
  - ✅ Item 5.3: Controle de ingredientes críticos
  - ✅ Item 5.4: Rastreabilidade
  - ... (todos os 47 requisitos aplicáveis)
- [ ] **Relatório gerado**:
  ```
  ✅ Conformidades: 42/47 (89%)
  ⚠️ Parciais: 3
  ❌ Não conformidades: 2

  Detalhes:
  ❌ PR 7.1 5.8: Certificado de abatedouro vencido (12/2024)
  ⚠️ PR 7.1 6.2: Lista de fornecedores incompleta (falta 3 empresas)
  ```
- [ ] **Sugestões de IA**: "Solicite certificado atualizado do fornecedor XYZ"

**RN-059**: IA deve identificar 90%+ das NCs óbvias (validado por analistas)

---

## ✅ ÉPICO 6 COMPLETO

| User Story | Título | SP | Status |
|-----------|--------|-----|--------|
| US-049 | Base RAG | 13 SP | ✅ |
| US-050 | Chatbot Multilíngue | 21 SP | ✅ |
| US-051 | Integração Contexto | 8 SP | ✅ |
| US-052 | OCR Inteligente | 13 SP | ✅ |
| US-053 | Classificação GSO/SMIIC | 13 SP | ✅ |
| US-054 | Verificação PR 7.1 | 13 SP | ✅ |
| **TOTAL** | **6 Stories** | **81 SP** | ✅ |

---

# 📊 Épico 7: Gestão Administrativa e Dashboards

**Objetivo**: Fornecer ferramentas de gestão, controle de acesso, analytics e relatórios para administradores e gestores tomarem decisões baseadas em dados.

**Valor de Negócio**:
- 📈 **Visibilidade 360°** do pipeline de certificação em tempo real
- 🔐 **Segurança robusta** com RBAC granular (ISO 17065 compliance)
- 📊 **Inteligência de negócio** - métricas financeiras e operacionais
- 🎯 **KPIs acionáveis** - identificar gargalos e oportunidades

**Prioridade**: P0 (Must Have) | **Total**: 42 SP

---

## 📈 Feature 7.1: Dashboards e KPIs

### **US-055: Dashboard Executivo**
```
Como gestor executivo,
Eu quero visualizar KPIs consolidados em dashboard,
Para monitorar performance do negócio.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 13 SP

**Acceptance Criteria**:
- [ ] **Métricas exibidas**:
  - 💰 **Financeiras**:
    - Receita MRR (Monthly Recurring Revenue)
    - Pipeline comercial (propostas em andamento)
    - Ticket médio por certificação
    - Taxa de conversão (solicitação → contrato)
  - 📊 **Operacionais**:
    - Processos em andamento (por fase)
    - Tempo médio de certificação (SLA)
    - Taxa de aprovação do comitê
    - NCs médias por auditoria
  - 👥 **Pessoas**:
    - Auditores ativos
    - Carga de trabalho por auditor
    - Empresas certificadas (total e novas/mês)
- [ ] **Gráficos interativos**:
  - Funil de conversão (12 fases)
  - Linha do tempo de receita (12 meses)
  - Gráfico de pizza: Processos por setor industrial
  - Mapa de calor: Auditores x Regiões
- [ ] **Filtros**:
  - Período (hoje/semana/mês/trimestre/ano/customizado)
  - Setor industrial
  - Região geográfica
  - Analista/Auditor responsável
- [ ] **Exportação**: PDF executivo + Excel com dados brutos

**RN-060**: Dashboard deve carregar em <2s para 10.000 processos históricos

---

### **US-056: Relatórios de Conformidade ISO 17065**
```
Como gestor de qualidade,
Eu quero gerar relatórios de conformidade automaticamente,
Para auditorias ISO 17065.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Relatórios gerados**:
  - 📄 **Relatório de Certificações Emitidas** (por período)
  - 📄 **Relatório de Auditorias Realizadas** (auditores, locais, datas)
  - 📄 **Relatório de NCs** (abertas, fechadas, recorrentes)
  - 📄 **Relatório de Decisões do Comitê** (aprovações, negações, condicionalidades)
  - 📄 **Relatório de Conformidade PR 7.1** (aderência aos prazos)
- [ ] **Rastreabilidade completa**:
  - Audit trail de todas as ações
  - Assinaturas digitais registradas
  - Histórico de modificações
- [ ] **Agendamento**: Relatórios mensais enviados por e-mail automaticamente
- [ ] **Formato**: PDF com marca d'água + JSON estruturado

**RN-061**: Relatórios devem ser imutáveis após geração (blockchain ou hash SHA-256)

---

## 👥 Feature 7.2: Gestão de Usuários e Permissões

### **US-057: Cadastro e Gestão de Usuários**
```
Como administrador,
Eu quero gerenciar usuários e seus perfis,
Para controlar acesso ao sistema.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 5 SP

**Acceptance Criteria**:
- [ ] **CRUD de usuários**:
  - Criar novo usuário (nome, e-mail, celular, idioma preferido)
  - Editar dados do usuário
  - Desativar usuário (soft delete - não remove histórico)
  - Reativar usuário
- [ ] **Atribuição de perfis** (ver US-058):
  - Empresa
  - Analista
  - Auditor
  - Membro do Comitê
  - Administrador
- [ ] **Gestão de auditores**:
  - Especialidades (carne, laticínios, cosméticos, etc)
  - Regiões de atuação
  - Idiomas falados
  - Certificações profissionais
  - Status (ativo/inativo/férias)
- [ ] **Notificação**: E-mail de boas-vindas com link de ativação

---

### **US-058: Controle de Acesso Baseado em Papéis (RBAC)**
```
Como administrador,
Eu quero definir permissões granulares por perfil,
Para garantir segurança conforme ISO 17065.
```
**Prioridade**: Must Have (P0) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Perfis implementados**:

| Perfil | Permissões |
|--------|-----------|
| **Empresa** | Ver próprias solicitações, upload docs, chat com IA, visualizar certificados |
| **Analista** | Gerenciar processos atribuídos, solicitar docs, gerar propostas, agendar auditorias |
| **Auditor** | Ver auditorias atribuídas, app mobile, registrar NCs, gerar relatórios |
| **Comitê** | Ver dossiês, votar, buscar casos similares, registrar decisões |
| **Gestor** | Dashboards executivos, relatórios, atribuir processos, configurar SLA |
| **Administrador** | Acesso total (exceto votar no comitê) |

- [ ] **Segregação de funções**:
  - ❌ Analista NÃO pode votar no comitê
  - ❌ Auditor NÃO pode aprovar o próprio relatório
  - ❌ Empresa NÃO pode ver dados de outras empresas
- [ ] **Permissões granulares**:
  ```json
  {
    "solicitacoes": ["read", "create"],
    "documentos": ["read", "upload"],
    "propostas": ["read"],
    "contratos": ["read", "sign"],
    "auditorias": [],
    "comite": [],
    "admin": []
  }
  ```
- [ ] **Logs de acesso**: Registrar quem acessou o quê e quando

**RN-062**: Auditores externos (terceirizados) têm acesso limitado apenas às suas auditorias

---

## 📊 Feature 7.3: Analytics e Business Intelligence

### **US-059: Analytics Avançado**
```
Como gestor,
Eu quero insights de IA sobre performance,
Para otimizar operações.
```
**Prioridade**: Should Have (P1) | **Estimativa**: 8 SP

**Acceptance Criteria**:
- [ ] **Insights gerados pela IA**:
  - ⚠️ **Alertas**: "5 processos atrasados há mais de 7 dias"
  - 📈 **Tendências**: "Tempo médio de certificação aumentou 15% este mês"
  - 🎯 **Recomendações**: "Contrate 2 auditores especializados em laticínios"
  - 🔮 **Previsões**: "Você deve emitir 42 certificados neste trimestre"
- [ ] **Análise de gargalos**:
  - Identificar fase com maior tempo de espera
  - Analistas sobrecarregados
  - Empresas com NCs recorrentes
- [ ] **Benchmarking**:
  - Comparar performance atual vs mês anterior
  - Comparar setores industriais (qual certifica mais rápido)
- [ ] **Notificações proativas**:
  - E-mail semanal ao gestor: "Resumo da semana + insights"

---

### **US-060: Exportação para Ferramentas BI Externas**
```
Como analista de dados,
Eu quero exportar dados brutos para ferramentas BI,
Para análises customizadas.
```
**Prioridade**: Nice to Have (P2) | **Estimativa**: 3 SP

**Acceptance Criteria**:
- [ ] **Formatos de exportação**:
  - CSV (tabelas)
  - JSON (dados estruturados)
  - Parquet (big data)
- [ ] **Datasets disponíveis**:
  - Processos completos
  - Auditorias
  - NCs
  - Certificados emitidos
  - Decisões do comitê
- [ ] **Integração BI**:
  - API REST para Power BI / Tableau / Metabase
  - Webhook para atualização em tempo real
- [ ] **Segurança**: Exportações anonimizadas (sem dados sensíveis)

**RN-063**: Exportações devem respeitar LGPD (dados pessoais mascarados)

---

## ✅ ÉPICO 7 COMPLETO

| User Story | Título | SP | Status |
|-----------|--------|-----|--------|
| US-055 | Dashboard Executivo | 13 SP | ✅ |
| US-056 | Relatórios ISO 17065 | 8 SP | ✅ |
| US-057 | Gestão de Usuários | 5 SP | ✅ |
| US-058 | RBAC Granular | 8 SP | ✅ |
| US-059 | Analytics Avançado | 8 SP | ✅ |
| US-060 | Exportação BI | 3 SP | ✅ |
| **TOTAL** | **6 Stories** | **45 SP** | ✅ |

---

# 🏗️ Épico 8: Infraestrutura e Fundação Técnica

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

| User Story | Título | SP | Status |
|-----------|--------|-----|--------|
| US-061 | MFA | 8 SP | ✅ |
| US-062 | JWT e Sessões | 8 SP | ✅ |
| US-063 | E-mail Transacional | 8 SP | ✅ |
| US-064 | SMS | 5 SP | ✅ |
| US-065 | Push Notifications | 8 SP | ✅ |
| US-066 | WhatsApp Business | 13 SP | ✅ |
| US-067 | Storage S3 | 8 SP | ✅ |
| US-068 | Audit Trail | 8 SP | ✅ |
| US-069 | i18n (4 idiomas) | 13 SP | ✅ |
| **TOTAL** | **9 Stories** | **79 SP** | ✅ |

---

## 🎉 TODOS OS 8 ÉPICOS COMPLETOS!

### 📊 Resumo Geral do PRD v2.0

| Épico | Título | Stories | Story Points | Status |
|-------|--------|---------|--------------|--------|
| **1** | Gestão de Solicitações | 8 | 57 SP | ✅ |
| **2** | Gestão Comercial e Contratual | 9 | 81 SP | ✅ |
| **3** | Análise e Preparação | 12 | 94 SP | ✅ |
| **4** | Execução de Auditorias | 10 | 97 SP | ✅ |
| **5** | Decisão e Emissão | 9 | 60 SP | ✅ |
| **6** | Assistente IA Multilíngue | 6 | 81 SP | ✅ |
| **7** | Gestão Administrativa | 6 | 45 SP | ✅ |
| **8** | Infraestrutura e Fundação | 9 | 79 SP | ✅ |
| **TOTAL** | **8 Épicos** | **69 Stories** | **594 SP** | ✅ |

### 🚀 6 Inovações Tecnológicas Implementadas

| # | Inovação | Épico | Status |
|---|----------|-------|--------|
| 1 | **Calculadora Inteligente de Custos** | Épico 2 | ✅ |
| 2 | **IA de Pré-Auditoria** | Épico 4 | ✅ |
| 3 | **Contratos Colaborativos por Cláusulas** | Épico 2 | ✅ |
| 4 | **Calendário Inteligente de Auditorias** | Épico 3 | ✅ |
| 5 | **Chatbot Multilíngue RAG** | Épico 6 | ✅ |
| 6 | **Workflow Rastreável de 12 Fases** | Épico 1 | ✅ |

### 📝 70 Regras de Negócio Documentadas (RN-001 a RN-070)

### 🎯 Próximas Seções do PRD (Pendentes)
- [ ] **Seção 6**: Roadmap e Faseamento (MVP → Fases 2-4)
- [ ] **Seção 7**: Requisitos Não-Funcionais (Performance, Segurança, Escalabilidade)
- [ ] **Seção 8**: Dependências e Riscos
- [ ] **Seção 9**: Acceptance Criteria Globais

---

# 6. Roadmap e Faseamento

## 6.1 Estratégia de Entrega

### Filosofia de Desenvolvimento

O HalalSphere será desenvolvido em **fases incrementais**, priorizando valor de negócio e redução de risco. A estratégia segue os princípios:

1. **MVP First**: Entregar ciclo completo de certificação inicial (primeira certificação) o mais rápido possível
2. **Validação Contínua**: Cada fase é validada com usuários reais antes de prosseguir
3. **Inovações Gradualmente**: Recursos de IA são introduzidos após fundação sólida
4. **Escalabilidade Progressiva**: Começar com 50-100 processos, escalar para 600-700

---

## 6.2 Definição do MVP (Minimum Viable Product)

### Escopo do MVP

**Objetivo**: Cobrir o **ciclo completo de certificação inicial** de uma empresa, conforme PR 7.1, do início ao fim.

**O que ESTÁ no MVP** ✅:
- **Épico 1 (Completo)**: Gestão de Solicitações - 8 stories (57 SP)
  - Cadastro de empresa
  - Formulário estruturado de solicitação (5 etapas)
  - Upload de documentos
  - Dashboard de status (12 fases)
  - Notificações automáticas
- **Épico 2 (Completo)**: Gestão Comercial e Contratual - 9 stories (81 SP)
  - Calculadora inteligente de custos ⭐ (Inovação #1)
  - Geração automática de proposta
  - Contratos colaborativos por cláusulas ⭐ (Inovação #3)
  - Assinatura digital integrada
- **Épico 3 (Parcial - 8 de 12 stories)**: Análise e Preparação - ~60 SP
  - Dashboard Kanban para analistas
  - Atribuição de processos
  - Revisão de solicitação
  - Enquadramento GSO/SMIIC
  - Checklist de Estágio 1
  - Solicitação de documentos complementares
  - ❌ **Fora do MVP**: Calendário inteligente de auditorias (Inovação #4)
  - ❌ **Fora do MVP**: Assistência IA para análise documental
- **Épico 4 (Parcial - 6 de 10 stories)**: Execução de Auditorias - ~50 SP
  - Agenda mobile para auditores
  - Checklist personalizado por categoria
  - Registro de evidências com fotos
  - Identificação de NCs in loco
  - Geração automática de relatório
  - ❌ **Fora do MVP**: IA de Pré-Auditoria (Inovação #2)
  - ❌ **Fora do MVP**: Modo offline completo
- **Épico 5 (Completo)**: Decisão e Emissão - 9 stories (60 SP)
  - Comitê técnico digital
  - Deliberação individual e reunião virtual
  - Geração automática de certificado
  - Validação pública via QR code
- **Épico 6 (Parcial - 2 de 6 stories)**: Assistente IA - ~25 SP
  - Chatbot básico (FAQ estático)
  - ❌ **Fora do MVP**: Base RAG completa (Inovação #5)
  - ❌ **Fora do MVP**: OCR inteligente
  - ❌ **Fora do MVP**: Classificação automática GSO/SMIIC
- **Épico 7 (Parcial - 4 de 6 stories)**: Gestão Administrativa - ~30 SP
  - Dashboard executivo básico
  - Relatórios de conformidade ISO 17065
  - Gestão de usuários
  - RBAC básico
  - ❌ **Fora do MVP**: Analytics avançado
  - ❌ **Fora do MVP**: Exportação BI
- **Épico 8 (Completo)**: Infraestrutura - 9 stories (79 SP)
  - MFA
  - JWT e gestão de sessões
  - Notificações (E-mail/SMS/Push)
  - Storage (S3/Azure Blob)
  - Audit trail completo
  - i18n (4 idiomas)

**O que NÃO está no MVP** ❌:
- Auditorias de manutenção anual (PR 7.1 10.10)
- Renovação trienal completa (PR 7.1 seção 13)
- Extensão de escopo (PR 7.1 10.9.3)
- Testes laboratoriais (PR 7.1 10.8)
- Suspensão/Cancelamento/Término de certificados (PR 7.1 11, 12, 14)
- Integração com ERP/Contabilidade externos
- App mobile nativo (apenas mobile web responsivo no MVP)

**Total do MVP**: **~37 stories, ~442 SP (~11 sprints de 2 semanas)**

---

## 6.3 Fases de Desenvolvimento

### Fase 0: Fundação e Planejamento (2 semanas)

**Objetivo**: Preparar infraestrutura técnica e design antes do desenvolvimento.

**Entregas**:
- [ ] **Arquitetura técnica detalhada**:
  - Stack definido (React 19 + Vite 7, NestJS 11 + Express, TypeScript, Tailwind CSS, PostgreSQL 16, Prisma 7)
  - Estrutura de pastas e padrões de código
  - CI/CD pipeline (AWS CodePipeline + CodeBuild)
  - Ambientes (dev, staging, production)
- [ ] **Design System implementado** (baseado no UX Design Guide):
  - Biblioteca de componentes no Storybook
  - Tokens de design (cores, spacing, tipografia)
  - Componentes base (Button, Input, Card, Modal, etc)
- [ ] **Setup de infraestrutura**:
  - Banco de dados PostgreSQL (AWS RDS ou Supabase)
  - Storage S3 para documentos
  - Ambiente de CI/CD
  - Monitoramento (Sentry, LogRocket)
- [ ] **Protótipos de alta fidelidade** no Figma:
  - Wizard de solicitação (9 etapas)
  - Dashboard Kanban (analistas)
  - App mobile (auditores)

**Equipe**: Tech Lead, Arquiteto, Designer, DevOps

---

### Fase 1: MVP Core - Ciclo Básico (8 semanas / 4 sprints)

**Objetivo**: Implementar o fluxo básico de certificação sem automações de IA.

**Sprint 1-2 (4 semanas): Solicitação e Dashboard**
- ✅ **Épico 1 (Completo)**: Gestão de Solicitações (57 SP)
  - US-001: Cadastro de empresa
  - US-002: Formulário de solicitação (5 etapas)
  - US-003: Upload de documentos
  - US-004: Dashboard de status (12 fases)
  - US-005: Notificações automáticas
  - US-006-008: Checklist, NCs, evidências
- ✅ **Épico 8 (Parcial)**: Infraestrutura base (40 SP)
  - US-061: MFA
  - US-062: JWT e sessões
  - US-063: E-mail transacional
  - US-067: Storage S3
  - US-069: i18n (4 idiomas)

**Entrega Sprint 2**:
- ✅ Empresas podem criar conta e submeter solicitação completa
- ✅ Analistas veem solicitações em lista básica
- ✅ E-mails de confirmação funcionando
- ✅ Documentos armazenados no S3

**Sprint 3-4 (4 semanas): Proposta Comercial e Contratos**
- ✅ **Épico 2 (Completo)**: Gestão Comercial e Contratual (81 SP)
  - US-009-010: Configuração de preços + Calculadora ⭐
  - US-011-013: Geração de proposta + Templates
  - US-014-017: Contratos colaborativos ⭐ + Assinatura digital
- ✅ **Épico 3 (Parcial)**: Análise básica (30 SP)
  - US-018: Dashboard Kanban
  - US-019: Atribuição automática
  - US-020: Revisão de solicitação

**Entrega Sprint 4**:
- ✅ Analista revisa solicitação e gera proposta automaticamente
- ✅ Calculadora de custos funcionando (Inovação #1)
- ✅ Empresa recebe proposta, negocia contrato cláusula por cláusula (Inovação #3)
- ✅ Assinatura digital integrada (DocuSign/D4Sign)
- ✅ Dashboard Kanban funcionando

**Validação Fase 1**:
- [ ] **3 empresas reais** completam solicitação e recebem proposta
- [ ] **2 analistas** testam revisão e geração de proposta
- [ ] **Taxa de conclusão de solicitação > 80%**
- [ ] **Tempo médio de proposta < 15min** (vs. horas manualmente)

---

### Fase 2: Auditoria e Decisão (6 semanas / 3 sprints)

**Objetivo**: Completar ciclo de certificação com auditoria e emissão de certificado.

**Sprint 5-6 (4 semanas): Análise Documental e Auditoria**
- ✅ **Épico 3 (Complemento)**: Análise e Preparação (30 SP)
  - US-021: Enquadramento GSO/SMIIC
  - US-022: Checklist de Estágio 1
  - US-023: Solicitação de docs complementares
  - US-025: Cadastro de auditores
- ✅ **Épico 4 (Básico)**: Execução de Auditorias (50 SP)
  - US-030: Agenda mobile
  - US-032: Checklist personalizado
  - US-033: Registro de evidências com fotos
  - US-034: Identificação de NCs in loco
  - US-035: Geração automática de relatório
  - US-037: Acompanhamento de NCs

**Entrega Sprint 6**:
- ✅ Analista realiza análise documental (Estágio 1) com checklist digital
- ✅ Analista cadastra auditores e agenda auditoria manualmente
- ✅ Auditor acessa app mobile, registra evidências e NCs
- ✅ Relatório de auditoria gerado automaticamente

**Sprint 7 (2 semanas): Comitê e Emissão**
- ✅ **Épico 5 (Completo)**: Decisão e Emissão (60 SP)
  - US-040-045: Comitê técnico digital
  - US-046-048: Emissão de certificado + QR code

**Entrega Sprint 7**:
- ✅ Comitê técnico vota digitalmente (individual + reunião virtual)
- ✅ Certificado PDF gerado automaticamente com QR code
- ✅ Validação pública de certificados funcionando
- ✅ **Primeiro ciclo completo de certificação finalizado!**

**Validação Fase 2**:
- [ ] **1 empresa** completa ciclo de certificação de ponta a ponta
- [ ] **3 auditores** testam app mobile em auditorias reais
- [ ] **5 membros do comitê** deliberam digitalmente
- [ ] **Certificado emitido em < 7 dias após auditoria** (vs. 30+ dias)
- [ ] **SUS (System Usability Scale) > 75**

---

### Fase 3: Automações de IA - Core (8 semanas / 4 sprints)

**Objetivo**: Implementar as 6 inovações tecnológicas de IA.

**Sprint 8-9 (4 semanas): IA de Pré-Auditoria e Chatbot RAG**
- ✅ **Épico 4 (IA)**: IA de Pré-Auditoria ⭐ (21 SP)
  - US-031: Análise automática de documentos antes da auditoria
  - Extração de produtos, ingredientes, fornecedores
  - Identificação de matérias-primas críticas
  - Geração de resumo executivo
- ✅ **Épico 6 (IA)**: Assistente IA Multilíngue ⭐ (55 SP)
  - US-049: Base RAG (PR 7.1 + GSO + SMIIC)
  - US-050: Chatbot multilíngue (4 idiomas)
  - US-051: Integração com contexto de processo

**Entrega Sprint 9**:
- ✅ Auditor recebe relatório de IA antes da auditoria (Inovação #2)
- ✅ Chatbot RAG responde dúvidas sobre PR 7.1 em 4 idiomas (Inovação #5)
- ✅ **Tempo de auditoria reduzido em 30%**

**Sprint 10-11 (4 semanas): OCR e Calendário Inteligente**
- ✅ **Épico 6 (OCR)**: OCR e Classificação (26 SP)
  - US-052: OCR inteligente de documentos
  - US-053: Classificação automática GSO/SMIIC
  - US-054: Verificação de conformidade PR 7.1
- ✅ **Épico 3 (Calendário)**: Calendário Inteligente ⭐ (34 SP)
  - US-026: Matching inteligente de auditores
  - US-027: Agendamento colaborativo
  - US-028: Calendário visual
  - US-029: Briefing automático

**Entrega Sprint 11**:
- ✅ Documentos escaneados são automaticamente extraídos via OCR
- ✅ Produtos classificados automaticamente em categorias GSO/SMIIC
- ✅ Calendário inteligente sugere melhores auditores (Inovação #4)
- ✅ **Tempo de agendamento < 1 dia** (vs. 5-7 dias manualmente)

**Validação Fase 3**:
- [ ] **IA de Pré-Auditoria**: Identificar 90%+ das NCs óbvias
- [ ] **Chatbot**: Resolver 60-70% das dúvidas sem humano
- [ ] **Calendário**: Reduzir conflitos de agenda em 80%
- [ ] **Satisfação do auditor com IA > 4/5**

---

### Fase 4: Escalabilidade e Otimização (6 semanas / 3 sprints)

**Objetivo**: Preparar sistema para 600-700 processos simultâneos.

**Sprint 12-13 (4 semanas): Performance e Alta Disponibilidade**
- ✅ **Épico 7 (Analytics)**: Gestão Administrativa Completa (15 SP)
  - US-059: Analytics avançado
  - US-060: Exportação BI
- ✅ **Épico 4 (Offline)**: Modo Offline para Auditorias (13 SP)
  - US-038: Sincronização offline completa
- ✅ **Épico 8 (Notificações)**: WhatsApp Business (13 SP)
  - US-066: Integração WhatsApp
- ✅ **Otimizações técnicas**:
  - Caching Redis para queries frequentes
  - Lazy loading no Kanban (Solução para alto volume)
  - Virtualização de listas longas (react-window)
  - Compressão de imagens (sharp, cloudinary)
  - CDN para assets estáticos

**Entrega Sprint 13**:
- ✅ Sistema suporta 200+ processos simultâneos sem degradação
- ✅ Kanban com lazy loading (top 5 cards + "Carregar mais")
- ✅ Auditores trabalham offline em áreas sem internet
- ✅ Notificações via WhatsApp funcionando

**Sprint 14 (2 semanas): Testes de Carga e Go-Live**
- [ ] **Testes de carga**:
  - 500 usuários simultâneos
  - 1000 processos ativos
  - Upload de 100 documentos/hora
- [ ] **Testes de segurança**:
  - Penetration testing (OWASP Top 10)
  - Auditoria de código (SonarQube)
  - Revisão de LGPD e ISO 17065
- [ ] **Treinamento de usuários**:
  - 3 analistas treinados
  - 5 auditores treinados
  - 5 membros do comitê treinados
  - Manuais e vídeos criados
- [ ] **Migração de dados**:
  - Importar empresas existentes (600-700)
  - Importar histórico de certificados
- [ ] **Go-Live em produção**

**Validação Fase 4**:
- [ ] **Performance**: Dashboard Kanban carrega em <2s com 600 processos
- [ ] **Disponibilidade**: 99.9% uptime (máx 43min downtime/mês)
- [ ] **Segurança**: 0 vulnerabilidades críticas (OWASP)
- [ ] **LGPD**: 100% compliance com auditoria externa

---

## 6.4 Roadmap Visual

```
┌─────────────────────────────────────────────────────────────────┐
│ FASE 0: Fundação (2 sem)                                        │
│ ├─ Setup técnico, Design System, Protótipos                    │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 1: MVP Core (8 sem / 4 sprints)                          │
│ ├─ Sprint 1-2: Solicitação + Dashboard                         │
│ │   ✅ Épico 1: Gestão de Solicitações (57 SP)                │
│ │   ✅ Épico 8: Infraestrutura base (40 SP)                    │
│ ├─ Sprint 3-4: Proposta + Contratos                            │
│ │   ✅ Épico 2: Gestão Comercial (81 SP) ⭐                    │
│ │   ✅ Épico 3: Análise básica (30 SP)                         │
│ └─ Validação: 3 empresas + 2 analistas                         │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 2: Auditoria e Decisão (6 sem / 3 sprints)               │
│ ├─ Sprint 5-6: Análise Documental + Auditoria                  │
│ │   ✅ Épico 3: Análise complemento (30 SP)                    │
│ │   ✅ Épico 4: Auditoria básica (50 SP)                       │
│ ├─ Sprint 7: Comitê + Emissão                                  │
│ │   ✅ Épico 5: Decisão e Emissão (60 SP)                      │
│ └─ Validação: 1 ciclo completo ponta a ponta                   │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 3: Automações de IA (8 sem / 4 sprints)                  │
│ ├─ Sprint 8-9: IA de Pré-Auditoria + Chatbot RAG               │
│ │   ⭐ Épico 4: IA Pré-Auditoria (21 SP) - Inovação #2        │
│ │   ⭐ Épico 6: Chatbot RAG (55 SP) - Inovação #5             │
│ ├─ Sprint 10-11: OCR + Calendário Inteligente                  │
│ │   ⭐ Épico 6: OCR e Classificação (26 SP)                    │
│ │   ⭐ Épico 3: Calendário Inteligente (34 SP) - Inovação #4  │
│ └─ Validação: IA identifica 90%+ NCs, Chatbot 70% resolução   │
└─────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────┐
│ FASE 4: Escalabilidade (6 sem / 3 sprints)                    │
│ ├─ Sprint 12-13: Performance + Alta Disponibilidade            │
│ │   ✅ Épico 7: Analytics avançado (15 SP)                     │
│ │   ✅ Épico 4: Modo Offline (13 SP)                           │
│ │   ✅ Épico 8: WhatsApp (13 SP)                               │
│ │   ✅ Otimizações: Lazy loading, caching, CDN                │
│ ├─ Sprint 14: Testes de Carga + Go-Live                        │
│ │   🚀 Migração de 600-700 empresas                            │
│ │   🚀 Treinamento de equipe                                   │
│ │   🚀 Go-Live em produção                                     │
│ └─ Validação: 600 processos simultâneos, 99.9% uptime         │
└─────────────────────────────────────────────────────────────────┘

Total: 30 semanas (7.5 meses) até Go-Live
```

---

## 6.5 Cronograma Detalhado

| Fase | Duração | Sprints | Story Points | Data Início | Data Fim | Milestone |
|------|---------|---------|--------------|-------------|----------|-----------|
| **Fase 0** | 2 semanas | - | - | Semana 1 | Semana 2 | ✅ Fundação Pronta |
| **Fase 1** | 8 semanas | 4 | 208 SP | Semana 3 | Semana 10 | ✅ MVP Core |
| **Fase 2** | 6 semanas | 3 | 140 SP | Semana 11 | Semana 16 | ✅ Ciclo Completo |
| **Fase 3** | 8 semanas | 4 | 136 SP | Semana 17 | Semana 24 | ⭐ IA Funcionando |
| **Fase 4** | 6 semanas | 3 | 41 SP | Semana 25 | Semana 30 | 🚀 Go-Live |
| **TOTAL** | **30 semanas** | **14 sprints** | **525 SP** | - | - | 🎉 **Produção** |

**Nota**: Restam ~69 SP dos 594 SP totais para Post-MVP (renovações, manutenção anual, testes laboratoriais, integrações).

---

## 6.6 Critérios de Sucesso por Fase

### Fase 1 (MVP Core) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Taxa de conclusão de solicitação | **>80%** | % de empresas que completam todas as 5 etapas |
| Tempo médio de solicitação | **<15min** | Mediana de tempo desde início até submit |
| Tempo de geração de proposta | **<5min** | Desde analista clicar até PDF gerado |
| Taxa de aceitação de proposta | **>60%** | % de propostas aceitas vs enviadas |
| SUS (System Usability Scale) | **>70** | Questionário com 5 empresas + 2 analistas |

### Fase 2 (Ciclo Completo) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Tempo de certificação (solicitação → certificado) | **<60 dias** | Mediana de tempo do ciclo completo |
| Tempo de auditoria in loco | **<4h** | Mediana de tempo de auditoria presencial |
| % de relatórios com erros | **<5%** | Relatórios que precisam correção |
| Tempo de decisão do comitê | **<7 dias** | Desde submissão até decisão final |
| Certificados emitidos | **≥3** | Número de certificados emitidos na fase |

### Fase 3 (IA) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **IA Pré-Auditoria**: Precisão na identificação de NCs | **>90%** | NCs identificadas pela IA vs identificadas pelo auditor |
| **Chatbot RAG**: Taxa de resolução sem humano | **60-70%** | % de conversas finalizadas sem escalação |
| **Calendário**: Redução de conflitos de agenda | **>80%** | Conflitos antes vs depois |
| **OCR**: Precisão de extração de texto | **>95%** | % de documentos extraídos corretamente |
| Satisfação com IA | **>4/5** | Questionário com auditores e analistas |

### Fase 4 (Escalabilidade) - KPIs

| Métrica | Target | Como Medir |
|---------|--------|------------|
| Processos simultâneos suportados | **600-700** | Teste de carga |
| Tempo de carregamento do Kanban | **<2s** | p95 com 600 processos |
| Uptime | **99.9%** | Monitoramento contínuo (máx 43min downtime/mês) |
| Vulnerabilidades críticas | **0** | Scan OWASP + Penetration test |
| Taxa de adoção do sistema | **>90%** | % de processos gerenciados no sistema vs fora |

---

## 6.7 Dependências Críticas entre Fases

**Fase 1 → Fase 2**:
- ✅ Dashboard Kanban funcional (US-018) é **pré-requisito** para analistas gerenciarem auditorias
- ✅ Upload de documentos (US-003) é **pré-requisito** para análise documental
- ✅ Notificações (US-005) são **pré-requisito** para comunicação entre stakeholders

**Fase 2 → Fase 3**:
- ✅ Agenda de auditorias (US-030) é **pré-requisito** para calendário inteligente
- ✅ Documentos armazenados é **pré-requisito** para IA de pré-auditoria
- ✅ Histórico de processos é **pré-requisito** para classificação automática

**Fase 3 → Fase 4**:
- ✅ IA funcionando é **pré-requisito** para analytics avançado
- ✅ Volume de dados é **pré-requisito** para validar escalabilidade

---

## 6.8 Post-MVP (Fase 5+)

**Não prioritizado para Go-Live inicial, mas planejado para 2026:**

### Fase 5: Gestão do Ciclo de Vida (Q1 2026)
- Auditorias de manutenção anual (PR 7.1 10.10)
- Renovação trienal automatizada (PR 7.1 seção 13)
- Extensão de escopo simplificada (PR 7.1 10.9.3)
- Gestão de suspensão/cancelamento (PR 7.1 11, 12)

### Fase 6: Integrações Externas (Q2 2026)
- API pública para parceiros
- Integração com ERPs (SAP, TOTVS, etc)
- Integração com sistemas de contabilidade
- Integração com laboratórios de análise

### Fase 7: Advanced Analytics e ML (Q3 2026)
- Predição de probabilidade de aprovação
- Detecção de fraudes com ML
- Recomendação de melhorias para empresas
- Benchmarking entre empresas similares

### Fase 8: Mobile Nativo (Q4 2026)
- App nativo iOS para auditores
- App nativo Android para auditores
- Modo offline 100% (sync bidirecional)

---

# 7. Requisitos Não-Funcionais

## 7.1 Performance e Escalabilidade

### 7.1.1 Tempo de Resposta
| Operação | Tempo Máximo | Percentil | Justificativa |
|----------|--------------|-----------|---------------|
| **Carregamento de página** | 2s | P95 | Nielsen Norman Group: <2s para boa experiência |
| **Ações simples** (salvar, deletar) | 500ms | P95 | Limite de percepção instantânea |
| **Busca/filtros** | 1s | P95 | Busca deve parecer instantânea |
| **Upload de arquivo** (<10MB) | 30s | P95 | Depende de conexão do usuário |
| **Geração de PDF** (certificado) | 5s | P95 | Processamento complexo aceitável |
| **Análise IA pré-auditoria** | 60s | P95 | Análise de múltiplos documentos |
| **Chatbot RAG** (resposta) | 3s | P95 | Expectativa de chat em tempo real |

### 7.1.2 Throughput
| Métrica | Valor | Justificativa |
|---------|-------|---------------|
| **Requisições simultâneas** | 1.000/seg | 600-700 processos ativos + margem 40% |
| **Usuários concorrentes** | 200 | 50 empresas + 30 analistas + 40 auditores + 10 gestores |
| **Upload simultâneo** | 50 arquivos/min | Auditores enviando evidências |
| **Geração de PDF** | 20/min | Certificados em lote |

### 7.1.3 Escalabilidade Horizontal
- **Backend API**: Pods Kubernetes auto-scaling (min: 2, max: 10)
  - Scale up: CPU >70% por 2min
  - Scale down: CPU <30% por 5min
- **Workers de IA**: Fila Redis + workers escaláveis (min: 1, max: 5)
- **Database**: PostgreSQL com read replicas (1 master + 2 replicas)
- **Storage**: S3-compatible (ilimitado, pay-as-you-go)

### 7.1.4 Limites de Volume
| Recurso | Limite | Justificativa |
|---------|--------|---------------|
| **Processos ativos** | 700 simultâneos | Requisito do cliente |
| **Processos históricos** | Ilimitado | Auditoria ISO 17065 (min 3 anos) |
| **Upload de arquivo** | 100MB/arquivo | Vídeos de auditoria |
| **Total storage/processo** | 500MB | 20 docs × 5MB + 10 vídeos × 30MB |
| **Produtos por solicitação** | 500 | Grandes indústrias (ex: fábrica de temperos) |
| **Categorias C1-C6** | 6 categorias × 30 subcategorias | GSO 2055-2 + SMIIC 02 |

---

## 7.2 Disponibilidade e Confiabilidade

### 7.2.1 SLA (Service Level Agreement)
| Métrica | Valor | Penalidade |
|---------|-------|------------|
| **Uptime mensal** | 99.9% | Crédito proporcional se <99.5% |
| **Downtime aceitável/mês** | 43 minutos | Janelas de manutenção programada |
| **Recovery Time Objective (RTO)** | 4 horas | Tempo máximo para restauração |
| **Recovery Point Objective (RPO)** | 1 hora | Perda máxima de dados aceitável |

### 7.2.2 Backups
- **Frequência**: Backups automáticos diários às 02:00 UTC-3
- **Retenção**:
  - Diários: 7 dias
  - Semanais: 4 semanas
  - Mensais: 12 meses
  - Anuais: 3 anos (compliance ISO 17065)
- **Testes de restore**: Mensais (validar integridade)
- **Storage**: S3 Glacier para backups antigos (custo-efetivo)

### 7.2.3 Disaster Recovery
- **Multi-region backup**: Réplica em região secundária AWS
- **Plano de failover**: Documentado e testado trimestralmente
- **Prioridade de restauração**:
  1. Database (processos ativos)
  2. Storage (documentos)
  3. Logs e analytics

---

## 7.3 Segurança

### 7.3.1 Autenticação e Autorização
| Aspecto | Implementação |
|---------|---------------|
| **Autenticação** | JWT (Access Token 15min + Refresh Token 7 dias) |
| **MFA (Multi-Factor)** | TOTP (Google Authenticator) - **obrigatório para Analistas, Auditores, Gestores** |
| **SSO (futuro)** | SAML 2.0 / OAuth 2.0 (Google Workspace, Microsoft Entra) |
| **Senha** | Min 12 caracteres, mix (maiúsc/minúsc/número/especial), bcrypt cost=12 |
| **Bloqueio de conta** | 5 tentativas erradas → bloqueio 30min |
| **Sessões simultâneas** | Max 3 dispositivos/usuário |

### 7.3.2 RBAC (Role-Based Access Control)
- **Hierarquia rígida**: 4 papéis (Empresas, Analistas, Auditores, Gestores)
- **Permissões granulares**: Ver US-064 (detalhamento completo)
- **Auditoria de acesso**: Log de todas as ações (quem, quando, o quê, IP)
- **Segregation of Duties**:
  - Analista NÃO pode auditar
  - Auditor NÃO pode emitir certificado
  - Gestor NÃO pode executar processos

### 7.3.3 Proteção de Dados (LGPD)
| Princípio LGPD | Implementação |
|----------------|---------------|
| **Finalidade** | Uso restrito a certificação Halal (consentimento na US-001) |
| **Adequação** | Apenas dados necessários (minimização) |
| **Necessidade** | Não coletamos dados sensíveis extras (religião, etnia, etc) |
| **Acesso** | Empresas podem exportar seus dados (US-058) |
| **Retificação** | Empresas podem editar dados cadastrais (US-057) |
| **Exclusão** | Direito ao esquecimento (após fim de relação contratual + prazo legal) |
| **Portabilidade** | Exportação JSON estruturado (US-058) |
| **DPO** | Encarregado de dados designado (contato na plataforma) |

### 7.3.4 Segurança de Dados
- **Criptografia em trânsito**: TLS 1.3 (HTTPS obrigatório)
- **Criptografia em repouso**:
  - Database: PostgreSQL encryption at rest (AES-256)
  - Storage: S3 Server-Side Encryption (SSE-S3)
- **Dados sensíveis no DB**: Não armazenamos cartões de crédito (usamos Stripe)
- **Secrets management**: Vault (HashiCorp) ou AWS Secrets Manager
- **IP Whitelisting**: Opcional para clientes enterprise

### 7.3.5 OWASP Top 10 (2023)
| Vulnerabilidade | Mitigação |
|-----------------|-----------|
| **A01: Broken Access Control** | RBAC rígido, validação server-side, audit trail |
| **A02: Cryptographic Failures** | TLS 1.3, AES-256, bcrypt, sem hardcoded secrets |
| **A03: Injection** | Prepared statements (SQL), sanitização (XSS), CSP headers |
| **A04: Insecure Design** | Threat modeling, segregation of duties, rate limiting |
| **A05: Security Misconfiguration** | Hardened configs, CORS restrito, headers de segurança |
| **A06: Vulnerable Components** | Dependabot, renovate bot, scan semanal (Snyk/npm audit) |
| **A07: Auth Failures** | MFA, JWT short-lived, rate limiting login, session timeout |
| **A08: Software Data Integrity** | Assinatura de pacotes, CI/CD signing, webhook HMAC |
| **A09: Logging Failures** | Logs centralizados (ELK), alertas de anomalias, SIEM |
| **A10: SSRF** | Validação de URLs, network segmentation, proxy interno |

### 7.3.6 Compliance e Auditoria
- **Audit Trail completo**: Todas as ações ficam registradas (imutável, timestamped)
- **Retenção de logs**: 3 anos (compliance ISO 17065)
- **Relatórios de segurança**: Trimestral para gestores
- **Pentests**: Anual (empresa terceirizada)
- **Certificações alvo** (Fase 2026): ISO 27001, SOC 2 Type II

---

## 7.4 Usabilidade e Acessibilidade

### 7.4.1 Usabilidade
| Métrica | Meta | Método de Medição |
|---------|------|-------------------|
| **System Usability Scale (SUS)** | >75 (good) | Questionário 10 perguntas após 2 semanas de uso |
| **Task Success Rate** | >90% | Testes de usabilidade com 5 usuários/persona |
| **Time on Task** | Redução 60% vs. atual | Comparação wizard (12min) vs. planilhas (45min) |
| **Error Rate** | <5% | Erros de validação/submissão |
| **Learning Curve** | 1 dia | Novo usuário consegue criar solicitação sem ajuda |

### 7.4.2 Acessibilidade (WCAG 2.1 Nível AA)
| Critério | Implementação |
|----------|---------------|
| **Perceivable** | Alt text em imagens, contraste 4.5:1 (textos), 3:1 (botões), captions em vídeos |
| **Operable** | Navegação 100% por teclado (Tab, Enter, Esc), sem time limits críticos |
| **Understandable** | Labels claros, mensagens de erro específicas, idioma da página declarado |
| **Robust** | HTML semântico, ARIA landmarks, testado com NVDA/JAWS |

**Ferramentas de teste**:
- Lighthouse (Chrome DevTools) - score >90
- axe DevTools - 0 violações críticas
- Testes manuais com leitores de tela

### 7.4.3 Responsividade
| Breakpoint | Largura | Ajustes |
|------------|---------|---------|
| **Mobile** | 320px - 767px | Sidebar colapsada, stack vertical, touch-friendly (min 44px) |
| **Tablet** | 768px - 1023px | Sidebar semi-colapsada (ícones), kanban 3 colunas |
| **Desktop** | 1024px+ | Sidebar expandida, kanban 7 colunas, multi-column forms |

**Nota**: Auditores usam principalmente tablet (campo), analistas usam desktop.

---

## 7.5 Internacionalização (i18n)

### 7.5.1 Idiomas Suportados
1. **Português (pt-BR)** - Default, 100% completo
2. **Inglês (en-US)** - 100% (MVP Fase 1)
3. **Árabe (ar-SA)** - 100% (Fase 3) - Right-to-Left (RTL)
4. **Turco (tr-TR)** - 80% (Fase 3) - termos técnicos Halal

### 7.5.2 Escopo de Tradução
| Elemento | Traduzido | Observações |
|----------|-----------|-------------|
| **UI (botões, labels)** | ✅ Sim | Biblioteca i18next |
| **Mensagens de erro** | ✅ Sim | Todas as validações |
| **Emails transacionais** | ✅ Sim | Template por idioma |
| **PDFs (certificados)** | ✅ Sim | LaTeX multilíngue |
| **Documentação de ajuda** | ✅ Sim | Help center traduzido |
| **Dados do usuário** | ❌ Não | Nome de empresa, produtos, etc |
| **Logs técnicos** | ❌ Não | Sempre em inglês |

### 7.5.3 Considerações Técnicas
- **Detecção automática**: Accept-Language header do browser
- **Preferência do usuário**: Salva no perfil (US-057)
- **Fallback**: pt-BR → en-US
- **Formato de datas**:
  - pt-BR: 13/11/2025 14:30
  - en-US: 11/13/2025 2:30 PM
  - ar-SA: ١٣/١١/٢٠٢٥ ١٤:٣٠ (números árabes)
- **Moeda**:
  - pt-BR: R$ 12.500,00
  - en-US: $2,500.00 USD
  - ar-SA: ٩٬٣٧٥ ر.س
- **RTL (Right-to-Left)**: Layout espelhado para árabe (flexbox, CSS logical properties)

---

## 7.6 Compatibilidade

### 7.6.1 Browsers Suportados
| Browser | Versões | Market Share | Observações |
|---------|---------|--------------|-------------|
| **Chrome** | Últimas 2 versões | ~65% | Prioridade 1 (development target) |
| **Firefox** | Últimas 2 versões | ~10% | Prioridade 2 |
| **Safari** | Últimas 2 versões | ~15% | Prioridade 1 (iOS) |
| **Edge** | Últimas 2 versões | ~5% | Prioridade 2 (Chromium-based) |
| **Opera** | Últimas 2 versões | ~3% | Prioridade 3 (best effort) |
| **IE 11** | ❌ Não suportado | Deprecated | Banner de upgrade |

### 7.6.2 Dispositivos
| Tipo | Especificações | Justificativa |
|------|----------------|---------------|
| **Desktop** | 1024px+, mouse+teclado | Analistas e gestores |
| **Tablet** | 768px-1023px, touch | **Auditores em campo** (iPad, Android tablets) |
| **Mobile** | 320px-767px, touch | Empresas (consulta rápida) |

### 7.6.3 PWA (Progressive Web App)
- **Offline mode** (Fase 4): Auditores podem preencher checklists offline
- **Installable**: Add to Home Screen (iOS/Android)
- **Push notifications**: Lembretes de tarefas (US-024)
- **Camera access**: Upload de fotos diretamente da câmera (tablet/mobile)

---

## 7.7 Observabilidade e Monitoramento

### 7.7.1 Golden Signals (Site Reliability Engineering)
| Signal | Métrica | Alert Threshold |
|--------|---------|-----------------|
| **Latency** | P95 response time | >2s por 5min → alerta |
| **Traffic** | Requests/seg | Baseline +200% → alerta |
| **Errors** | Error rate % | >1% por 5min → alerta |
| **Saturation** | CPU/Memory/Disk | >80% por 10min → alerta |

### 7.7.2 Dashboards (Grafana)
1. **Dashboard de Negócio**:
   - Solicitações/dia (tendência)
   - Processos por fase (funil)
   - SLA de aprovação (média móvel 7 dias)
   - Revenue mensal (contratos assinados)

2. **Dashboard Técnico**:
   - Request rate, error rate, latency (RED metrics)
   - CPU, memory, disk (USE metrics)
   - Database queries (slow query log)
   - Queue depth (workers IA)

3. **Dashboard de IA**:
   - Análises pré-auditoria/dia
   - Precisão da IA (accuracy score)
   - Tempo médio de análise
   - Custo de API (OpenAI/Anthropic)

### 7.7.3 Alertas (PagerDuty ou similar)
| Severidade | Canais | On-Call |
|------------|--------|---------|
| **P1 (Critical)** | SMS + Call + Slack | Resposta imediata |
| **P2 (High)** | Slack + Email | Resposta em 30min |
| **P3 (Medium)** | Slack | Resposta em 4h (horário comercial) |
| **P4 (Low)** | Email | Triagem diária |

**Exemplos**:
- P1: API down (error rate >50%), database unreachable
- P2: P95 latency >5s, workers IA parados
- P3: Disk >85%, slow queries detectadas
- P4: Certificado SSL expirando em 14 dias

### 7.7.4 Logging
- **Stack**: ELK (Elasticsearch, Logstash, Kibana) ou Loki (Grafana)
- **Structured logs**: JSON com campos padrão (timestamp, level, user_id, request_id, message)
- **Níveis**:
  - ERROR: Exceções, falhas de integração
  - WARN: Retries, degradação de performance
  - INFO: Ações de negócio (processo criado, certificado emitido)
  - DEBUG: Detalhes técnicos (apenas em dev/staging)
- **Sampling**: 100% de errors, 10% de info em produção (reduzir custo)

---

## 7.8 Manutenibilidade e Qualidade de Código

### 7.8.1 Qualidade de Código
| Métrica | Target | Ferramenta |
|---------|--------|------------|
| **Code coverage** | >80% | Jest (frontend), pytest (backend) |
| **Code complexity** | Cyclomatic <10 | SonarQube |
| **Code duplication** | <3% | SonarQube |
| **Tech debt ratio** | <5% | SonarQube |
| **Vulnerabilities** | 0 critical/high | Snyk, npm audit |

### 7.8.2 Testes Automatizados
| Tipo | Cobertura | Execução |
|------|-----------|----------|
| **Unit tests** | >80% das funções | Pre-commit hook |
| **Integration tests** | Endpoints críticos (autenticação, pagamento) | CI/CD pipeline |
| **E2E tests** | Happy paths principais (wizard, kanban) | Nightly (Playwright) |
| **Performance tests** | Endpoints críticos (carga de 1000 req/s) | Weekly (k6) |
| **Security tests** | OWASP Top 10 | Monthly (OWASP ZAP) |

### 7.8.3 Documentação
- **README.md**: Setup de desenvolvimento (< 10min para rodar localmente)
- **API docs**: OpenAPI 3.0 (Swagger UI)
- **Architecture Decision Records (ADRs)**: Decisões técnicas importantes
- **Runbooks**: Procedimentos operacionais (deploy, rollback, incident response)
- **Changelog**: Semver, keep a changelog format

### 7.8.4 Code Review
- **Obrigatório**: 1 aprovação mínima antes de merge
- **Checklist**:
  - ✅ Testes passando
  - ✅ Code coverage não diminuiu
  - ✅ Sem vulnerabilidades novas
  - ✅ Segue style guide (ESLint, Prettier, Ruff)
  - ✅ Atualiza documentação (se necessário)

---

## 7.9 Requisitos Legais e de Compliance

### 7.9.1 ISO 17065 (Organismo de Certificação)
| Requisito | Implementação no HalalSphere |
|-----------|------------------------------|
| **4.2 Estrutura legal** | Rastreabilidade de todas as fases (workflow 12 fases) |
| **7.1 Imparcialidade** | Segregação de papéis (analista ≠ auditor ≠ decisor) |
| **7.4 Confidencialidade** | RBAC, LGPD, audit trail |
| **7.6 Registros** | Histórico completo de processos (min 3 anos) |
| **8.2 Inspeção** | Checklist digital PR 7.1 Rev 21 (US-033) |
| **8.6 Emissão de certificados** | PDF assinado digitalmente, código único, QR code |
| **8.7 Manutenção da certificação** | Renovação trienal, auditorias de vigilância (US-054, US-055) |

### 7.9.2 LGPD (Lei Geral de Proteção de Dados)
- **Base legal**: Consentimento (cadastro) + Execução de contrato
- **Dados coletados**: Nome, email, telefone, CNPJ, endereço, produtos
- **Dados sensíveis**: NÃO coletamos (religião, etnia, saúde, etc)
- **Direitos garantidos**: Acesso (US-058), retificação (US-057), exclusão, portabilidade
- **DPO (Encarregado)**: Contato disponível no rodapé (dpo@halalsphere.com)
- **Incident response**: Notificação à ANPD em até 72h (breach >500 registros)

### 7.9.3 PR 7.1 Rev 21 (Procedimento Operacional)
- **Categorização**: C1-C6 conforme GSO 2055-2 e SMIIC 02 (US-002 etapa 5)
- **Checklist de auditoria**: 56 páginas digitalizadas (US-033)
- **Fluxo de decisão**: Comitê técnico para casos especiais (US-041)
- **Validade de certificado**: 3 anos com vigilância anual
- **Renovação**: Processo simplificado (roadmap Fase 5)

### 7.9.4 Emissão Fiscal (Brasil)
- **NFSe**: Integração com prefeituras via API (roadmap Fase 5)
- **Impostos**: ISS (2-5% conforme município), IRPJ/CSLL (Lucro Presumido)
- **Nota**: Não é e-commerce (não precisa de NFe)

---

## 7.10 Estimativa de Custos de Infraestrutura

### 7.10.1 Ambiente MVP (Fase 1-2)
| Serviço | Especificação | Custo Mensal (USD) |
|---------|---------------|---------------------|
| **Backend** | 2× pods (2 vCPU, 4GB RAM) | $50 |
| **Database** | PostgreSQL managed (2 vCPU, 8GB RAM, 50GB SSD) | $60 |
| **Storage** | S3 (100GB, 10k requests) | $3 |
| **CDN** | Cloudflare Free ou AWS CloudFront (100GB transfer) | $10 |
| **Monitoring** | Grafana Cloud Free ou self-hosted | $0 |
| **Domain + SSL** | cloudflare.com | $0 |
| **Email** | SendGrid (40k emails/mês) | $15 |
| **AI APIs** | OpenAI/Anthropic (50 análises/mês) | $30 |
| **Total MVP** | | **~$170/mês** |

### 7.10.2 Ambiente de Produção (Pós Go-Live)
| Serviço | Especificação | Custo Mensal (USD) |
|---------|---------------|---------------------|
| **Backend** | 5× pods auto-scaling (2 vCPU, 4GB RAM cada) | $125 |
| **Database** | PostgreSQL HA (4 vCPU, 16GB RAM, 200GB SSD) + 2 replicas | $300 |
| **Storage** | S3 (2TB, 1M requests) | $50 |
| **CDN** | CloudFront (500GB transfer) | $40 |
| **Monitoring** | Grafana Cloud Pro ou Datadog | $100 |
| **Logs** | ELK managed ou Loki (100GB/mês) | $150 |
| **Backups** | S3 Glacier (500GB) | $5 |
| **Email** | SendGrid (200k emails/mês) | $80 |
| **AI APIs** | OpenAI/Anthropic (500 análises/mês) | $300 |
| **WAF + DDoS** | Cloudflare Pro | $20 |
| **Secrets** | AWS Secrets Manager (100 secrets) | $40 |
| **CI/CD** | GitHub Actions (3k min/mês) | $0 (free tier) |
| **APM** | Sentry (100k events/mês) | $100 |
| **Alertas** | PagerDuty Starter | $200 |
| **Total Produção** | | **~$1.510/mês** |

**Nota**: Custos em USD, conversão necessária para BRL. Preços aproximados (AWS us-east-1, Nov 2025).

### 7.10.3 Escalabilidade de Custos
- **Storage**: Crescimento linear (~$25/TB/mês)
- **AI APIs**: Maior variabilidade (depende de uso)
- **Database**: Maior custo fixo (considerar sharding/particionamento se >1TB)
- **Otimizações**:
  - Reserved instances (economia 30-40%)
  - Spot instances para workers (economia 60-70%)
  - Caching agressivo (reduz DB queries em 40%)

---

# 8. Dependências e Riscos

## 8.1 Dependências Externas

### 8.1.1 Dependências Críticas (Blockers)
| Dependência | Impacto | Mitigação | Owner |
|-------------|---------|-----------|-------|
| **PR 7.1 Rev 21 (procedimento)** | Workflow completo baseado neste documento | ✅ Documento já disponível (56 páginas) | CDIAL HALAL |
| **GSO 2055-2 / SMIIC 02** | Categorização C1-C6 | ✅ Standards já disponíveis | GSO/SMIIC |
| **ISO 17065** | Compliance obrigatório | Consultoria externa se necessário | Time HalalSphere |
| **Gateway de pagamento** | Fase 2: Contratos e pagamentos | Stripe ou PagSeguro (API pública disponível) | Analista Comercial |
| **Fornecedores de IA** | OpenAI/Anthropic para análise docs | Fallback: Azure OpenAI + modelo local (ollama) | Time Técnico |

### 8.1.2 Dependências Importantes (Riscos Médios)
| Dependência | Impacto | Mitigação |
|-------------|---------|-----------|
| **Templates de contratos** | US-011 (geração de minutas) | Advogado especializado em Halal contratado |
| **Templates de certificados** | US-044 (emissão) | Designer + LaTeX templates (pode ser feito internamente) |
| **Base de auditors externos** | Escalar time de auditores | Parceria com certificadoras existentes |
| **Tradutores especializados** | Árabe e Turco (termos Halal) | Contratar freelancers nativos + glossário técnico |
| **Infraestrutura cloud** | AWS ou GCP | Multi-cloud strategy (pode migrar facilmente) |

### 8.1.3 Dependências Desejáveis (Nice-to-Have)
| Dependência | Impacto | Plano B |
|-------------|---------|---------|
| **Integração ERPs** | Fase 6: Automação de dados | Entrada manual funciona |
| **SSO corporativo** | Empresas enterprise | Login/senha + MFA suficiente |
| **Laboratórios de análise** | Upload automático de laudos | Upload manual por empresa |

---

## 8.2 Riscos do Projeto

### 8.2.1 Riscos Técnicos

| Risco | Probabilidade | Impacto | Severidade | Mitigação | Owner |
|-------|---------------|---------|------------|-----------|-------|
| **Precisão da IA <80%** | Média (40%) | Alto | 🟠 MÉDIO | 1) Treinar com dados reais PR 7.1<br>2) Revisão humana obrigatória<br>3) Feedback loop contínuo | Tech Lead IA |
| **Performance com 700 processos** | Baixa (20%) | Alto | 🟢 BAIXO | 1) Arquitetura escalável desde MVP<br>2) Testes de carga no Sprint 8<br>3) Lazy loading + paginação | Backend Lead |
| **Complexidade do workflow 12 fases** | Média (50%) | Médio | 🟠 MÉDIO | 1) Prototipagem iterativa<br>2) Feedback de analistas reais<br>3) Simplificar se necessário (mínimo 8 fases) | Product Manager |
| **Integração com gateway de pagamento** | Baixa (15%) | Alto | 🟢 BAIXO | 1) Usar Stripe (SDK maduro)<br>2) Sandbox em dev<br>3) Plano B: PagSeguro | Backend Lead |
| **Complexidade do editor PDF (certificados)** | Média (30%) | Médio | 🟢 BAIXO | 1) LaTeX bem estabelecido<br>2) Templates prontos online<br>3) Plano B: HTML to PDF (Puppeteer) | Fullstack Dev |
| **Tempo de análise IA >60s** | Média (40%) | Médio | 🟠 MÉDIO | 1) Processar docs em paralelo<br>2) Cache de análises similares<br>3) Workers dedicados | Tech Lead IA |
| **Dependência de APIs IA (vendor lock-in)** | Baixa (20%) | Alto | 🟢 BAIXO | 1) Abstração de providers (OpenAI ↔️ Anthropic)<br>2) Fallback para Azure OpenAI<br>3) Modelo local (ollama) | Arquiteto |

### 8.2.2 Riscos de Negócio

| Risco | Probabilidade | Impacto | Severidade | Mitigação | Owner |
|-------|---------------|---------|------------|-----------|-------|
| **Resistência de analistas/auditores** | Média (50%) | Alto | 🟠 MÉDIO | 1) Co-criação com usuários reais<br>2) Treinamento dedicado (2 dias)<br>3) Lançamento gradual (piloto 10 usuários) | Product Manager |
| **Concorrência (sistemas similares)** | Média (40%) | Alto | 🟠 MÉDIO | 1) Diferenciais de IA (único no mercado)<br>2) Time-to-market rápido (7.5 meses)<br>3) Parcerias exclusivas | CEO/CPO |
| **Mudança na regulação Halal** | Baixa (10%) | Alto | 🟢 BAIXO | 1) Arquitetura flexível (configurável)<br>2) Monitorar GSO/SMIIC<br>3) Consultoria regulatória | Compliance Officer |
| **Precificação incorreta** | Média (40%) | Médio | 🟠 MÉDIO | 1) Análise de mercado (concorrentes)<br>2) Pilotos com pricing diferentes<br>3) Flexibilidade em contratos iniciais | CFO/CPO |
| **Churn de clientes early adopters** | Baixa (25%) | Médio | 🟢 BAIXO | 1) Onboarding personalizado<br>2) Customer Success dedicado<br>3) Feedback quinzenal | Customer Success |
| **Escassez de auditores certificados** | Média (40%) | Alto | 🟠 MÉDIO | 1) Parcerias com certificadoras<br>2) Programa de formação próprio<br>3) Auditores remotos (internacional) | Operações |

### 8.2.3 Riscos de Pessoas

| Risco | Probabilidade | Impacto | Severidade | Mitigação | Owner |
|-------|---------------|---------|------------|-----------|-------|
| **Turnover de time técnico** | Média (30%) | Alto | 🟠 MÉDIO | 1) Documentação contínua<br>2) Pair programming<br>3) Plano de sucessão | CTO |
| **Conhecimento sobre Halal concentrado** | Alta (60%) | Alto | 🔴 ALTO | 1) Knowledge sharing semanal<br>2) Documentação em Notion<br>3) Contratar especialista Halal full-time | CEO/CTO |
| **Falta de especialista em IA** | Média (40%) | Médio | 🟠 MÉDIO | 1) Upskilling de dev backend<br>2) Consultoria pontual<br>3) Contratar se orçamento permitir | CTO |
| **Time pequeno (sobrecarga)** | Alta (70%) | Médio | 🔴 ALTO | 1) Priorização rigorosa (MVP first)<br>2) Contratar freelancers pontuais<br>3) Reduzir escopo se necessário | Product Manager |

### 8.2.4 Riscos Operacionais

| Risco | Probabilidade | Impacto | Severidade | Mitigação | Owner |
|-------|---------------|---------|------------|-----------|-------|
| **Downtime durante onboarding** | Baixa (15%) | Alto | 🟢 BAIXO | 1) Blue-green deployment<br>2) Staging idêntico a produção<br>3) Rollback automático | DevOps |
| **Perda de dados (LGPD)** | Muito Baixa (5%) | Crítico | 🟢 BAIXO | 1) Backups diários + retenção 3 anos<br>2) Testes de restore mensais<br>3) Multi-region backups | DevOps |
| **Ataque de segurança (OWASP Top 10)** | Baixa (20%) | Alto | 🟢 BAIXO | 1) Pentests anuais<br>2) WAF + DDoS protection<br>3) Monitoramento 24/7 | Security Lead |
| **Custos de infra >previsto** | Média (40%) | Médio | 🟠 MÉDIO | 1) Monitoramento de custos AWS<br>2) Reserved instances<br>3) Otimizações contínuas | DevOps/CFO |
| **Suporte 24/7 necessário** | Baixa (25%) | Médio | 🟢 BAIXO | 1) Fase 1: Horário comercial apenas<br>2) Chatbot para FAQs<br>3) Escalar suporte conforme demanda | Customer Success |

---

## 8.3 Matriz de Riscos (Visualização)

```
IMPACTO
  ↑
ALTO     │   🔴 Conhecimento Halal    │   🟠 Resistência usuários
         │      concentrado           │   🟠 Precisão IA <80%
         │   🔴 Sobrecarga de time    │   🟠 Concorrência
         │                            │   🟠 Escassez auditores
─────────┼────────────────────────────┼──────────────────────────────
MÉDIO    │   🟢 Churn early adopters  │   🟠 Workflow complexo
         │   🟢 Falta especialista IA │   🟠 Precificação errada
         │   🟢 Suporte 24/7          │   🟠 Tempo análise IA
         │                            │   🟠 Custos infra
─────────┼────────────────────────────┼──────────────────────────────
BAIXO    │   🟢 Perda de dados        │   🟢 Performance 700 proc
         │   🟢 Mudança regulação     │   🟢 Vendor lock-in IA
         │   🟢 Downtime              │   🟢 Integração pagamento
         │   🟢 Ataque segurança      │   🟢 Editor PDF
         │                            │
         └────────────────────────────┴──────────────────────────────→
              BAIXA (0-30%)      MÉDIA (30-60%)      ALTA (60-100%)
                                  PROBABILIDADE
```

**Legenda**:
- 🔴 **ALTO**: Ação imediata necessária
- 🟠 **MÉDIO**: Monitorar de perto e mitigar proativamente
- 🟢 **BAIXO**: Aceitar ou mitigar com baixa prioridade

---

## 8.4 Plano de Contingência

### 8.4.1 Cenário 1: Precisão da IA insuficiente (<70%)
**Trigger**: Após 50 análises reais, accuracy <70%

**Ações**:
1. **Curto prazo (1 semana)**:
   - Tornar revisão humana **obrigatória** (não apenas sugerida)
   - Adicionar flag "confiança baixa" em análises <80%
2. **Médio prazo (1 mês)**:
   - Fine-tuning do modelo com dados reais PR 7.1
   - Trocar de provider (OpenAI → Anthropic ou vice-versa)
3. **Longo prazo (3 meses)**:
   - Se nada funcionar: Remover IA pré-auditoria do MVP
   - Manter apenas chatbot RAG (mais simples e confiável)

**Impacto no roadmap**: Atraso de 1-2 sprints na Fase 3

---

### 8.4.2 Cenário 2: Time pequeno + sobrecarga crítica
**Trigger**: Velocidade <60% do planejado por 2 sprints consecutivos

**Ações**:
1. **Imediato**:
   - Pausar features não-MVP (todas as user stories com prioridade "Should" e "Could")
   - Contratar 1-2 freelancers para tarefas específicas (frontend, testes)
2. **2 semanas**:
   - Re-priorizar roadmap: Focar apenas em MVP (442 SP)
   - Estender prazo de Go-Live de 30 para 40 semanas (+10 semanas)
3. **1 mês**:
   - Contratar 1 desenvolvedor full-time (se orçamento permitir)
   - Considerar MVP ainda menor (remover Épico 3: Análise de Risco, fazer manual)

**Impacto financeiro**: +$10k/mês (2 freelancers part-time)

---

### 8.4.3 Cenário 3: Resistência massiva de usuários (NPS <0)
**Trigger**: Após piloto com 10 usuários, NPS <0 ou SUS <60

**Ações**:
1. **Imediato (1 semana)**:
   - Workshops de feedback intensivo (2 dias presenciais)
   - Identificar 3 pain points principais
2. **Curto prazo (2 semanas)**:
   - Redesign de features mais problemáticas
   - Adicionar "modo simplificado" (menos features, mais intuitivo)
3. **Médio prazo (1 mês)**:
   - Se nada funcionar: Pivotar para ferramenta de apoio (não substituição completa)
   - Manter processos manuais existentes + HalalSphere como complemento

**Impacto no roadmap**: Atraso de 4-6 semanas, possível mudança de escopo

---

### 8.4.4 Cenário 4: Perda de especialista Halal
**Trigger**: Pessoa-chave com conhecimento PR 7.1 sai da empresa

**Ações**:
1. **Prevenção (sempre ativo)**:
   - Documentação contínua em Notion (toda reunião → ADR)
   - Knowledge sharing semanal (30min, rodiziando apresentadores)
   - Gravação de sessões de treinamento
2. **Se acontecer**:
   - Contratar consultoria externa (CDIAL HALAL ou similar) - $5k/mês
   - Pausar desenvolvimento de features complexas por 4 semanas (upskilling time)
   - Contratar novo especialista (processo de recrutamento 8-12 semanas)

**Impacto financeiro**: +$20k (4 meses de consultoria)

---

### 8.4.5 Cenário 5: Custos de IA explodem (>$1k/mês no MVP)
**Trigger**: Custo de APIs OpenAI/Anthropic >$1.000/mês com poucos usuários

**Ações**:
1. **Imediato**:
   - Implementar cache agressivo (análises similares → reutilizar)
   - Limitar análises gratuitas (ex: 3 por mês por empresa)
2. **Curto prazo (2 semanas)**:
   - Migrar para Azure OpenAI (preços corporativos negociados)
   - Otimizar prompts (reduzir tokens de input/output em 30-40%)
3. **Médio prazo (1 mês)**:
   - Testar modelos locais (ollama + llama-3.1-70b-instruct)
   - Cobrar adicional por análise IA (ex: +R$50 por análise)

**Impacto no pricing**: Possível aumento de 10-15% no plano premium

---

## 8.5 Critérios de Go/No-Go

### 8.5.1 Go-Live do MVP (Final da Fase 2, Semana 22)
**Critérios obrigatórios (todos devem ser ✅)**:

| Critério | Métrica | Status |
|----------|---------|--------|
| **Funcionalidades MVP completas** | 37 user stories implementadas (442 SP) | 🔲 Pendente |
| **Testes E2E passando** | Happy paths principais (wizard, kanban, auditoria, emissão) | 🔲 Pendente |
| **Performance aceitável** | P95 <2s em todas as páginas | 🔲 Pendente |
| **Segurança validada** | 0 vulnerabilidades high/critical (Snyk) | 🔲 Pendente |
| **Piloto bem-sucedido** | 10 usuários reais, SUS >70, NPS >30 | 🔲 Pendente |
| **Documentação completa** | Manuais de usuário (4 personas) + runbooks técnicos | 🔲 Pendente |
| **Infraestrutura estável** | 99.9% uptime nas últimas 4 semanas (staging) | 🔲 Pendente |
| **Backups funcionando** | 2 testes de restore bem-sucedidos | 🔲 Pendente |

**Se algum critério não for atingido**:
- **Atrasar Go-Live** em 2-4 semanas (não fazer deploy em produção com MVP incompleto)
- **Comunicar stakeholders** com transparência (data revisada + justificativa)

---

### 8.5.2 Go-Live da Fase 3 (IA Completa, Semana 30)
**Critérios obrigatórios**:

| Critério | Métrica | Status |
|----------|---------|--------|
| **Precisão da IA** | >80% em análise de documentos (validado com 100 casos reais) | 🔲 Pendente |
| **Chatbot funcional** | >70% taxa de resolução sem humano | 🔲 Pendente |
| **Custos de IA sustentáveis** | <$500/mês com 50 empresas ativas | 🔲 Pendente |
| **Tempo de análise IA** | P95 <60s | 🔲 Pendente |

**Se precisão <80%**: Manter revisão humana obrigatória (não bloqueia Go-Live)

---

## 8.6 Lições Aprendidas (Template para Retrospectivas)

**A ser preenchido ao longo do projeto**:

### Sprint 1-4 (Fase 1: MVP Core)
- **O que funcionou bem**: _[A completar]_
- **O que não funcionou**: _[A completar]_
- **Ações de melhoria**: _[A completar]_

### Sprint 5-7 (Fase 2: Auditoria e Decisão)
- **O que funcionou bem**: _[A completar]_
- **O que não funcionou**: _[A completar]_
- **Ações de melhoria**: _[A completar]_

### Sprint 8-11 (Fase 3: IA)
- **O que funcionou bem**: _[A completar]_
- **O que não funcionou**: _[A completar]_
- **Ações de melhoria**: _[A completar]_

### Sprint 12-14 (Fase 4: Escalabilidade)
- **O que funcionou bem**: _[A completar]_
- **O que não funcionou**: _[A completar]_
- **Ações de melhoria**: _[A completar]_

---

# 9. Acceptance Criteria Globais

Esta seção define critérios de aceitação que se aplicam a **todas as user stories** do HalalSphere, além dos critérios específicos de cada US.

## 9.1 Funcionalidade

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Funciona conforme especificado** | Todos os requisitos funcionais da US estão implementados | Testes E2E passam |
| **Tratamento de erros** | Erros são capturados e exibidos de forma amigável (sem stack traces) | Testes de erro + validação manual |
| **Validações de input** | Campos obrigatórios validados client-side e server-side | Testes de validação |
| **Estados de loading** | Feedback visual durante operações assíncronas (spinners, skeleton) | Inspeção manual |
| **Mensagens de sucesso** | Confirmação visual após ações bem-sucedidas (toast, modal) | Inspeção manual |

---

## 9.2 Performance

**Aplicável a todas as US**:

| Critério | Métrica | Validação |
|----------|---------|-----------|
| **Tempo de resposta** | P95 <2s para páginas, <500ms para ações | Lighthouse, k6 |
| **First Contentful Paint** | <1.5s | Lighthouse |
| **Tamanho de bundle JS** | <500KB (gzipped) por rota | Webpack Bundle Analyzer |
| **Imagens otimizadas** | WebP, lazy loading, responsive | Lighthouse |
| **Queries otimizadas** | N+1 queries resolvidos, índices adequados | Query profiler |

---

## 9.3 Segurança

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Autenticação** | Rotas protegidas requerem JWT válido | Testes de autenticação |
| **Autorização** | RBAC aplicado (usuário só vê/edita o que tem permissão) | Testes de autorização |
| **Sanitização de inputs** | XSS prevenido (HTML escapado, CSP headers) | OWASP ZAP scan |
| **SQL Injection prevenido** | Prepared statements, ORM seguro | Testes de segurança |
| **HTTPS obrigatório** | Redirect HTTP → HTTPS | Inspeção manual |
| **Headers de segurança** | CSP, X-Frame-Options, X-Content-Type-Options | Security Headers scan |
| **Secrets não expostos** | Sem API keys, passwords em código ou logs | Code review + Snyk |

---

## 9.4 Usabilidade

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Responsivo** | Funciona em mobile (320px), tablet (768px), desktop (1024px+) | Testes manuais em 3 breakpoints |
| **Navegação por teclado** | Tab, Enter, Esc funcionam | Teste manual (sem mouse) |
| **Acessibilidade** | WCAG 2.1 AA: contraste, alt text, ARIA labels | axe DevTools (0 violações) |
| **Feedback claro** | Usuário sempre sabe o que está acontecendo | Inspeção manual |
| **Consistência visual** | Segue Design System (cores, tipografia, espaçamentos) | Code review + Storybook |
| **Textos claros** | Labels e mensagens sem jargão técnico | Content review |

---

## 9.5 Internacionalização (i18n)

**Aplicável a todas as US com UI**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Strings traduzíveis** | Todos os textos UI usam i18next (não hardcoded) | Code review |
| **Idiomas suportados** | pt-BR, en-US (MVP); ar-SA, tr-TR (Fase 3) | Testes em cada idioma |
| **Formatos localizados** | Datas, moedas, números formatados por locale | Testes de formatação |
| **RTL suportado** | Layout funciona em árabe (right-to-left) | Testes manuais (Fase 3) |

---

## 9.6 Testes

**Aplicável a todas as US**:

| Critério | Cobertura | Ferramentas |
|----------|-----------|-------------|
| **Unit tests** | >80% de cobertura de funções críticas | Jest (frontend), pytest (backend) |
| **Integration tests** | Endpoints críticos testados | Supertest (API) |
| **E2E tests** | Happy path principal da US | Playwright |
| **Code review** | 1 aprovação obrigatória antes de merge | GitHub PR |
| **CI/CD passa** | Build, lint, tests, security scan | GitHub Actions |

---

## 9.7 Documentação

**Aplicável a todas as US**:

| Critério | Descrição | Localização |
|----------|-----------|-------------|
| **API documentada** | Endpoints documentados no Swagger UI | OpenAPI 3.0 spec |
| **Código comentado** | Lógica complexa tem comentários explicativos | Inline comments |
| **Changelog atualizado** | Mudanças registradas | CHANGELOG.md |
| **ADR (se necessário)** | Decisões arquiteturais importantes documentadas | /docs/adr/ |

---

## 9.8 Compliance e Auditoria

**Aplicável a todas as US que manipulam dados ou processos críticos**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Audit trail** | Ações críticas registradas (quem, quando, o quê, IP) | Logs estruturados |
| **LGPD compliance** | Dados pessoais tratados conforme LGPD | Checklist LGPD |
| **ISO 17065 compliance** | Rastreabilidade de processos de certificação | Checklist ISO 17065 |
| **PR 7.1 Rev 21 compliance** | Workflow segue procedimento operacional | Validação com especialista Halal |
| **Retenção de dados** | Dados históricos mantidos por 3 anos mínimo | Política de backup |

---

## 9.9 Observabilidade

**Aplicável a todas as US**:

| Critério | Descrição | Ferramentas |
|----------|-----------|-------------|
| **Logs estruturados** | JSON com campos padrão (timestamp, level, user_id, request_id) | Winston/Pino |
| **Métricas expostas** | Endpoints de saúde (/health, /metrics) | Prometheus |
| **Alertas configurados** | Erros críticos disparam alertas | PagerDuty |
| **Dashboards** | Métricas de negócio e técnicas visíveis | Grafana |

---

## 9.10 Qualidade de Código

**Aplicável a todas as US**:

| Critério | Métrica | Ferramentas |
|----------|---------|-------------|
| **Linter passa** | 0 erros de linting | ESLint, Ruff |
| **Formatter aplicado** | Código formatado consistentemente | Prettier, Black |
| **Complexidade ciclomática** | <10 por função | SonarQube |
| **Code smells** | Rating A no SonarQube | SonarQube |
| **Duplicação** | <3% de código duplicado | SonarQube |
| **Vulnerabilidades** | 0 high/critical | Snyk, npm audit |

---

## 9.11 DevOps e Deploy

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **CI/CD automatizado** | Build, test, deploy automatizados | GitHub Actions |
| **Deploy sem downtime** | Blue-green ou rolling deployment | Kubernetes |
| **Rollback testado** | Capacidade de reverter deploy em <5min | Runbook testado |
| **Staging validado** | US testada em staging antes de produção | Processo de release |
| **Secrets gerenciados** | Secrets não commitados, usam Vault/AWS Secrets | Code scan |

---

## 9.12 Definition of Done (DoD)

Uma User Story só pode ser considerada **DONE** quando:

✅ **Todos os Acceptance Criteria específicos da US** estão atendidos
✅ **Todos os Acceptance Criteria Globais** desta seção estão atendidos
✅ **Code review aprovado** por pelo menos 1 pessoa
✅ **CI/CD pipeline passa** (build, lint, tests, security scan)
✅ **Testado em staging** por Product Owner ou QA
✅ **Documentação atualizada** (API docs, manuais, changelog)
✅ **Deploy em produção bem-sucedido** (sem rollback)
✅ **Validado em produção** (smoke tests passam)

**Nota**: Apenas após DoD completo, a US pode ser marcada como "Done" no board e os story points contabilizados na velocidade do sprint.

---

## 📊 Status Atual do PRD v2.0

**✅ Este PRD está 100% completo!**

- ✅ Todas as 69 user stories detalhadas com acceptance criteria específicos (594 SP)
- ✅ Acceptance criteria globais definidos (aplicam-se a todas as US)
- ✅ Roadmap de 30 semanas definido (MVP em 22 semanas)
- ✅ Requisitos não-funcionais completos (performance, segurança, i18n)
- ✅ Dependências mapeadas e riscos mitigados com planos de contingência
- ✅ UX Design Guide separado ([ux-design-guide.md](../03-ux/ux-design-guide.md))

**Próximos passos**:
1. Revisão com stakeholders (CEO, CTO, Especialista Halal)
2. Aprovação final
3. Kickoff de desenvolvimento (Sprint 0: Fundação)
