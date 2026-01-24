# 🤖 Épico 6: Assistente IA Multilíngue

**Status de Implementação**: 🔴 5% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026 (sem IA)
**6 User Stories | 80 Story Points**

#### 📊 Resumo de Implementação

**✅ Preparado (Schema apenas)**:
- Model `KnowledgeBase` com embedding vector(1536) ✅
- Model `AiAnalysis` ✅
- Model `ChatMessage` ✅
- Extension pgvector habilitada ✅

**🔴 Não Iniciado (6/6 - Pós-MVP)**:
- US-049: Base RAG de Conhecimento
- US-050: Chatbot Multilíngue (PT, EN, AR, TR)
- US-051: Integração com Contexto de Processo
- US-052: OCR Inteligente de Documentos
- US-053: Classificação GSO/SMIIC Automática
- US-054: Verificação de Conformidade PR 7.1

**📂 Código Relacionado**:
- Backend: `backend/src/ai/` (estrutura básica)
- Schema: `KnowledgeBase`, `AiAnalysis`, `ChatMessage` models

**Prioridade Pós-MVP**: Alta (diferencial competitivo)

---

**Objetivo**: Implementar assistente de IA baseado em RAG para suporte técnico, análise documental e classificação automática conforme PR 7.1 e normas GSO/SMIIC.

**Inovação #5**: Chatbot inteligente que domina PR 7.1, GSO 2055-2 e SMIIC 02 em 4 idiomas (Português, Inglês, Árabe, Turco).

**Valor de Negócio**:
- ⏱️ **Redução de 60%** no tempo de análise documental via OCR + IA
- 📚 **Base de conhecimento unificada** - PR 7.1 + Normas + FAQs
- 🌍 **Suporte 24/7** em 4 idiomas sem aumento de equipe
- 🎯 **Precisão de 95%+** em classificação automática de produtos

**Prioridade**: P1 (Should Have - Pós-MVP) | **Total**: 80 SP

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
