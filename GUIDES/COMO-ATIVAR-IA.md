# Como Ativar a Análise com IA

## 📋 Status Atual da Implementação

### ✅ O que JÁ está implementado:

1. **Backend Completo**
   - ✅ Service layer: [anthropic.service.ts](backend/src/services/anthropic.service.ts)
   - ✅ Controller: [ai.controller.ts](backend/src/controllers/ai.controller.ts)
   - ✅ Routes: [ai.routes.ts](backend/src/routes/ai.routes.ts)
   - ✅ SDK instalado: `@anthropic-ai/sdk@^0.69.0`
   - ✅ Rotas registradas no server.ts

2. **Frontend Service**
   - ✅ AI Service: [ai.service.ts](frontend/src/services/ai.service.ts)
   - ✅ Interceptors de autenticação
   - ✅ Métodos para chat, extração de dados, validação

3. **Endpoints API Disponíveis**
   - ✅ `POST /api/ai/chat` - Chat conversacional
   - ✅ `POST /api/ai/extract` - Extração de dados estruturados
   - ✅ `POST /api/ai/suggest-questions` - Sugestão de perguntas
   - ✅ `POST /api/ai/validate` - Validação de dados

## 🔧 O que FALTA para Ativar

### 1. **Configurar Chave da API Anthropic**

**Passo 1: Obter chave da API**
- Acesse: https://console.anthropic.com/
- Crie uma conta ou faça login
- Vá em "API Keys"
- Crie uma nova chave API

**Passo 2: Configurar no backend**

Edite o arquivo [.env](backend/.env):
```bash
# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx"
```

**Passo 3: Reiniciar o backend**
```bash
cd backend
npm run dev
```

### 2. **Implementar Interface de Chat no Frontend**

Atualmente, o serviço está pronto mas não há interface de usuário. Você precisa:

**Opção A: Chat durante Nova Solicitação**
Criar um componente de chat integrado ao wizard de nova solicitação.

**Opção B: Página de Chat Dedicada**
Criar uma página `/chat` conforme o Sidebar já indica.

#### Exemplo de Implementação Básica:

```typescript
// frontend/src/pages/Chat.tsx
import { useState } from 'react';
import { aiService, ChatMessage } from '@/services/ai.service';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.chatCompletion({
        messages: [...messages, userMessage]
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Se houver dados extraídos, processar
      if (response.extractedData) {
        console.log('Dados extraídos:', response.extractedData);
        // Atualizar formulário com dados extraídos
      }
    } catch (error) {
      console.error('Erro no chat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-xs'
                : 'bg-gray-100 mr-auto max-w-xs'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div>Pensando...</div>}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3. **Adicionar Rota no App.tsx**

Se criar página dedicada, adicione em [App.tsx](frontend/src/App.tsx):

```typescript
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>
```

## 🧪 Como Testar

### 1. **Testar Backend (sem chave da API)**

Atualmente, se não houver chave da API, o sistema retorna mensagens mock:

```bash
curl -X POST http://localhost:3333/api/ai/chat \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Olá, quero certificação Halal"}
    ]
  }'
```

**Resposta sem API_KEY:**
```json
{
  "message": "API de IA não configurada. Configure ANTHROPIC_API_KEY para habilitar.",
  "extractedData": {},
  "conversationContext": {
    "completedFields": []
  }
}
```

### 2. **Testar Backend (com chave da API)**

Com a chave configurada, a resposta será do Claude:

```json
{
  "message": "Olá! Fico feliz em ajudá-lo com o processo de certificação Halal. Vou fazer algumas perguntas para entender melhor suas necessidades...",
  "extractedData": {}
}
```

### 3. **Testar Extração de Dados**

```bash
curl -X POST http://localhost:3333/api/ai/extract \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": [
      {"role": "user", "content": "Minha empresa é ABC Alimentos, CNPJ 12.345.678/0001-90"},
      {"role": "assistant", "content": "Perfeito! E qual é o endereço?"},
      {"role": "user", "content": "Rua das Flores, 123, São Paulo"}
    ],
    "schema": {
      "companyName": "string",
      "cnpj": "string",
      "address": "string"
    }
  }'
```

**Resposta esperada:**
```json
{
  "extractedData": {
    "companyName": "ABC Alimentos",
    "cnpj": "12.345.678/0001-90",
    "address": "Rua das Flores, 123, São Paulo"
  },
  "confidence": 0.8,
  "missingFields": []
}
```

## 💰 Custos da API

### Modelo Usado: `claude-3-5-sonnet-20241022`

**Pricing (Novembro 2024):**
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens

**Estimativa por conversa:**
- Conversa típica: ~500 tokens input + ~200 tokens output
- Custo: ~$0.0045 por conversa (menos de meio centavo)
- 1000 conversas: ~$4.50

**Alternativas mais baratas:**
- `claude-3-haiku-20240307`: $0.25/$1.25 por 1M tokens (80% mais barato)

## 🔒 Boas Práticas de Segurança

1. **Nunca commite a API Key**
   - ✅ Já está em `.gitignore`
   - ✅ Usar variáveis de ambiente

2. **Rate Limiting**
   - ✅ Já implementado no NestJS (ThrottlerModule)
   - Limite: 100 requests/minuto por IP

3. **Autenticação**
   - ✅ Todas as rotas AI exigem autenticação JWT
   - ✅ Token validado no middleware

4. **Validação de Input**
   - ✅ Validação básica implementada
   - Considere adicionar limites de tamanho de mensagem

## 📊 Funcionalidades Disponíveis

### 1. **Chat Conversacional**
- Coleta informações de forma natural
- Extrai dados estruturados automaticamente
- Valida respostas do usuário
- Sugere próximos passos

### 2. **Extração de Dados**
- Converte conversas em dados estruturados
- Schema flexível (JSON)
- Indicadores de confiança
- Lista de campos faltantes

### 3. **Sugestão de Perguntas**
- Baseado no contexto da conversa
- Evita perguntas repetidas
- Prioriza campos importantes

### 4. **Validação de Dados**
- Verifica formato (CNPJ, email, etc)
- Detecta inconsistências
- Sugere melhorias
- Validação semântica

## 🎯 Próximos Passos Recomendados

1. **Imediato:**
   - [ ] Obter chave da API Anthropic
   - [ ] Configurar no `.env`
   - [ ] Testar endpoints com curl/Postman

2. **Frontend:**
   - [ ] Criar componente de chat
   - [ ] Integrar com wizard de nova solicitação
   - [ ] Adicionar indicadores de dados extraídos
   - [ ] Mostrar sugestões de perguntas

3. **Melhorias:**
   - [ ] Streaming de respostas (SSE)
   - [ ] Histórico de conversas
   - [ ] Cache de respostas
   - [ ] Analytics de uso da IA
   - [ ] Fallback para modelo mais barato (Haiku)

## 🐛 Troubleshooting

### Erro: "ANTHROPIC_API_KEY not found"
- Verifique se o `.env` está no diretório correto
- Reinicie o servidor backend
- Verifique se não há espaços na chave

### Erro: "401 Unauthorized"
- Verifique se a chave da API está correta
- Verifique se tem créditos na conta Anthropic
- Teste a chave diretamente na console Anthropic

### Erro: "Rate limit exceeded"
- Aguarde 1 minuto
- Considere implementar queue de requests
- Verifique se não há loop de chamadas

### Respostas em inglês
- O prompt do sistema está em português
- Verifique se está passando o sistema prompt corretamente
- Pode adicionar "Sempre responda em português" nas mensagens

## 📚 Documentação Adicional

- [Anthropic API Docs](https://docs.anthropic.com/)
- [Claude Pricing](https://www.anthropic.com/api)
- [Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
