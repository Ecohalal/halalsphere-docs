## ÉPICO 4: Execução de Auditorias (Auditores) 🚀 INOVAÇÃO #2

**Status de Implementação**: 🟢 95% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026
**10 User Stories | 100 Story Points**

#### 📊 Resumo de Implementação

**✅ Implementado (8/10)**:
- US-030: Dashboard do Auditor ✅
- US-031: Visualização de Processo ✅
- US-032: Visualização de Documentação ✅
- US-033: Checklist Digital de Auditoria (5 seções, 22 itens) ✅
- US-034: Upload de Evidências ✅
- US-035: Registro de Não-Conformidades ✅
- US-036: Submissão de Relatório ✅
- US-037: Histórico de Auditorias ✅

**🟡 Parcial (1/10)**:
- US-038: Notificações - In-app OK, falta emails

**🔴 Pendente (1/10 - Pós-MVP)**:
- US-039: App Mobile (React Native)

**📂 Código Relacionado**:
- Backend: `backend/src/audit/`
- Frontend: `frontend/src/pages/auditor/` (AuditorDashboard, AuditorReports)
- Frontend: `frontend/src/components/audits/` (AuditExecution, EvidenceCapture, NonConformityForm)
- Schema: `Audit` model

---

**Contexto**: App mobile para auditores + **IA de Análise Pré-Auditoria** que reduz tempo de auditoria em 30-40%.

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
