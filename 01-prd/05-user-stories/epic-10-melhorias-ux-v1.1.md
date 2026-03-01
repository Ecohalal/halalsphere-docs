# Epic 10 - Melhorias de UX, Validações e Correções v1.1

> **22 User Stories** | **Estimativa Total**: 89 Story Points
> **Prioridade Geral**: Must Have (P0) - Correções e melhorias pós-produção
> **Data**: 23/02/2026

---

## Sumário por Categoria

| # | Categoria | Stories | SP |
|---|-----------|---------|-----|
| 1 | Cadastro de Usuário | US-074 a US-077 | 19 |
| 2 | Validações Globais de Formulário | US-078 a US-081 | 18 |
| 3 | Solicitar Certificação | US-082 a US-083 | 10 |
| 4 | Meu Perfil | US-084 a US-085 | 4 |
| 5 | Empresas do Grupo | US-086 a US-088 | 11 |
| 6 | Login / Autenticação | US-089 | 5 |
| 7 | Notificações | US-090 | 3 |
| 8 | Dashboards | US-091 a US-095 | 11 |
| 9 | Gestão de Atribuições | US-096 | 3 |
| 10 | Gestão de Usuários | US-097 | 5 |

---

## 1. Cadastro de Usuário

---

##### **US-074: Remover Dados de Contato e Manter Somente Dados do Responsável**

```
Como administrador do sistema,
Eu quero que o formulário de cadastro de usuário exiba apenas os dados do responsável,
Para que o cadastro seja mais simples e evite redundância de informações de contato.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Seção "Dados de Contato" removida do formulário de cadastro de usuário
- [ ] Campos de telefone e email mantidos dentro da seção "Dados do Responsável"
- [ ] Dados existentes no banco migrados/mapeados corretamente (sem perda de informação)
- [ ] Validações dos campos mantidas na nova estrutura
- [ ] Tela de edição de usuário refletindo a mesma estrutura

**Regras de Negócio**:
- **RN-074-01**: Os campos email e telefone do responsável passam a ser os dados de contato principais do usuário
- **RN-074-02**: Dados legados de contato devem ser preservados no banco, apenas a UI é simplificada

**Testes**:
- [ ] Teste unitário: Formulário renderiza sem seção de contato
- [ ] Teste unitário: Validação dos campos do responsável
- [ ] Teste E2E: Fluxo completo de cadastro com nova estrutura

---

##### **US-075: Incluir Campo Cargo nos Dados do Responsável**

```
Como empresa solicitante,
Eu quero informar o cargo do responsável no cadastro,
Para que a certificadora saiba a posição hierárquica do meu ponto de contato.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: US-074

**Critérios de Aceitação**:
- [ ] Campo "Cargo" adicionado na seção "Dados do Responsável"
- [ ] Campo do tipo texto livre com máximo de 100 caracteres
- [ ] Campo obrigatório no cadastro
- [ ] Campo exibido nas telas de visualização e edição do usuário
- [ ] Coluna `cargo` adicionada na tabela correspondente do banco de dados (migration)

**Regras de Negócio**:
- **RN-075-01**: Cargo é obrigatório para perfis do tipo "Empresa"
- **RN-075-02**: Para outros perfis (admin, analista, auditor), o campo é opcional

**Testes**:
- [ ] Teste unitário: Validação de obrigatoriedade condicional por perfil
- [ ] Teste unitário: Limite de 100 caracteres
- [ ] Teste de integração: Migration cria coluna corretamente

---

##### **US-076: Busca Automática de Dados da Empresa por CNPJ via API**

```
Como empresa solicitante,
Eu quero que ao informar meu CNPJ os dados da empresa sejam preenchidos automaticamente,
Para que o cadastro seja mais rápido e com menos erros de digitação.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 8 story points
**Dependências**: US-078

**Critérios de Aceitação**:
- [ ] Ao digitar/colar um CNPJ válido (14 dígitos), sistema consulta a API `https://publica.cnpj.ws/cnpj/{cnpj}`
- [ ] Campos preenchidos automaticamente: Razão Social, Nome Fantasia, Endereço completo, Telefone, Email
- [ ] Loading spinner exibido durante a consulta
- [ ] Usuário pode editar campos preenchidos automaticamente
- [ ] Tratamento de erro quando API retorna 404 (CNPJ não encontrado)
- [ ] Tratamento de erro quando API está indisponível (timeout/500)
- [ ] Debounce de 500ms na digitação do CNPJ para evitar múltiplas requisições
- [ ] Rate limiting respeitado (3 consultas/minuto na API gratuita)

**Regras de Negócio**:
- **RN-076-01**: A consulta só é disparada após CNPJ válido (14 dígitos + validação de dígitos verificadores)
- **RN-076-02**: Dados da API são sugestão, o usuário pode alterar qualquer campo
- **RN-076-03**: Se a API estiver fora, o cadastro continua normalmente (preenchimento manual)

**Casos de Uso Alternativos**:
- **Caso 1**: CNPJ não encontrado na base da Receita → Exibir mensagem informativa, permitir preenchimento manual
- **Caso 2**: API fora do ar → Exibir aviso discreto, continuar com preenchimento manual
- **Caso 3**: Empresa com situação cadastral "Baixada" → Exibir alerta ao usuário

**UX/UI**:
- Ícone de busca ao lado do campo CNPJ
- Toast/snackbar informando resultado da busca
- Campos preenchidos com destaque visual temporário (highlight)

**Testes**:
- [ ] Teste unitário: Debounce e validação antes da chamada
- [ ] Teste unitário: Mapeamento correto dos campos da API
- [ ] Teste unitário: Tratamento de erros (404, 500, timeout)
- [ ] Teste de integração: Chamada real à API (ambiente de teste)
- [ ] Teste E2E: Fluxo completo de preenchimento automático

---

##### **US-077: Componente Modal Padronizado para Erros no Cadastro**

```
Como usuário do sistema,
Eu quero ver mensagens de erro em um modal padronizado durante o cadastro,
Para que eu entenda claramente o que deu errado e como corrigir.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Componente `ErrorModal` criado/atualizado como componente reutilizável
- [ ] Modal exibe: ícone de erro, título, mensagem descritiva e botão de fechar
- [ ] Suporte a múltiplos erros em lista (validação de formulário)
- [ ] Todos os erros de cadastro de usuário utilizam o novo modal
- [ ] Modal acessível (foco, escape para fechar, aria-labels)
- [ ] Estilo consistente com o design system (shadcn/ui)
- [ ] Animação de entrada/saída suave

**Regras de Negócio**:
- **RN-077-01**: Erros de validação do formulário devem listar todos os campos inválidos
- **RN-077-02**: Erros de API devem exibir mensagem amigável (não o erro técnico)
- **RN-077-03**: Modal deve ser fechável por clique fora, botão X ou tecla Escape

**UX/UI**:
- Ícone: `AlertTriangle` vermelho para erros, `AlertCircle` amarelo para avisos
- Botão primário: "Entendi" ou "Corrigir"
- Overlay com backdrop escuro semitransparente

**Testes**:
- [ ] Teste unitário: Renderização com diferentes tipos de erro
- [ ] Teste unitário: Acessibilidade (focus trap, keyboard navigation)
- [ ] Teste unitário: Fechamento por todas as formas (botão, escape, backdrop)

---

## 2. Validações Globais de Formulário

---

##### **US-078: Validação em Tempo Real de CNPJ e CPF nos Cadastros**

```
Como usuário do sistema,
Eu quero que CNPJ e CPF sejam validados em tempo real durante a digitação,
Para que eu seja alertado imediatamente sobre documentos inválidos.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Validação de dígitos verificadores do CPF (algoritmo mod 11)
- [ ] Validação de dígitos verificadores do CNPJ (algoritmo mod 11)
- [ ] Validação executada `onBlur` do campo e/ou após digitação completa
- [ ] Máscara de formatação aplicada: CPF `XXX.XXX.XXX-XX`, CNPJ `XX.XXX.XXX/XXXX-XX`
- [ ] Mensagem de erro inline abaixo do campo quando inválido
- [ ] Borda vermelha no campo quando inválido, verde quando válido
- [ ] Validação aplicada em **todos** os formulários que possuem campos CPF/CNPJ
- [ ] CPFs/CNPJs conhecidos como inválidos rejeitados (ex: 111.111.111-11, 000.000.000-00)

**Regras de Negócio**:
- **RN-078-01**: CPF com todos dígitos iguais é inválido
- **RN-078-02**: CNPJ com todos dígitos iguais é inválido
- **RN-078-03**: Validação no frontend é complementar à validação no backend (ambas devem existir)

**Testes**:
- [ ] Teste unitário: Algoritmo de validação de CPF (casos válidos e inválidos)
- [ ] Teste unitário: Algoritmo de validação de CNPJ (casos válidos e inválidos)
- [ ] Teste unitário: Rejeição de documentos com dígitos repetidos
- [ ] Teste unitário: Máscara de formatação

---

##### **US-079: Busca Automática de Endereço por CEP via API**

```
Como usuário do sistema,
Eu quero que ao informar o CEP o endereço seja preenchido automaticamente,
Para que o preenchimento seja mais rápido e sem erros.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-080

**Critérios de Aceitação**:
- [ ] Ao digitar CEP válido (8 dígitos), sistema consulta **BrasilAPI** como serviço principal
- [ ] Em caso de falha da BrasilAPI, sistema faz fallback para **ViaCEP**
- [ ] Campos preenchidos automaticamente: Logradouro, Bairro, Cidade, Estado (UF)
- [ ] Máscara de CEP aplicada: `XXXXX-XXX`
- [ ] Loading spinner no campo durante a consulta
- [ ] Funcionalidade aplicada em **todos** os formulários com endereço (cadastro de usuário, solicitar certificação, empresas do grupo, etc.)
- [ ] Campos preenchidos automaticamente ficam editáveis
- [ ] Tratamento de CEP não encontrado com mensagem informativa

**Regras de Negócio**:
- **RN-079-01**: BrasilAPI é o serviço primário (`https://brasilapi.com.br/api/cep/v2/{cep}`)
- **RN-079-02**: ViaCEP é o fallback (`https://viacep.com.br/ws/{cep}/json/`)
- **RN-079-03**: Timeout de 5 segundos por serviço antes de tentar fallback
- **RN-079-04**: Se ambos falharem, permitir preenchimento manual

**Casos de Uso Alternativos**:
- **Caso 1**: BrasilAPI timeout → Tenta ViaCEP automaticamente
- **Caso 2**: Ambas APIs fora → Mensagem informativa, preenchimento manual
- **Caso 3**: CEP não encontrado → Mensagem "CEP não encontrado", preenchimento manual

**Testes**:
- [ ] Teste unitário: Chamada à BrasilAPI com mapeamento correto
- [ ] Teste unitário: Fallback para ViaCEP quando BrasilAPI falha
- [ ] Teste unitário: Timeout e tratamento de erros
- [ ] Teste de integração: Fluxo completo com APIs reais

---

##### **US-080: Select de Estados (UF) em Todos os Formulários de Endereço**

```
Como usuário do sistema,
Eu quero selecionar o estado de uma lista padronizada em vez de digitar,
Para que não haja inconsistência nos dados de endereço.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Campo "Estado" substituído por componente `Select` em **todos** os formulários de endereço
- [ ] Lista com todos os 27 estados brasileiros (26 estados + DF) em ordem alfabética
- [ ] Formato: `UF - Nome` (ex: `SP - São Paulo`, `RJ - Rio de Janeiro`)
- [ ] Valor salvo no banco: apenas a sigla UF (2 caracteres)
- [ ] Campo preenchido automaticamente pela busca de CEP (US-079)
- [ ] Componente reutilizável `StateSelect` para uso global
- [ ] Busca/filtro dentro do select para facilitar seleção

**Regras de Negócio**:
- **RN-080-01**: Lista de estados é fixa (constante no frontend)
- **RN-080-02**: Quando preenchido via CEP, o select é atualizado automaticamente

**Testes**:
- [ ] Teste unitário: Renderização com 27 opções
- [ ] Teste unitário: Valor correto salvo (sigla UF)
- [ ] Teste unitário: Filtro/busca funcional

---

##### **US-081: Padronizar Campo País em Todos os Formulários de Endereço**

```
Como gestor do sistema,
Eu quero que o campo País seja padronizado em todos os cadastros,
Para que haja consistência nos dados e preparação para operação internacional.
```

**Prioridade**: Should Have (P1)
**Estimativa**: 5 story points
**Dependências**: US-080

**Critérios de Aceitação**:
- [ ] Campo "País" padronizado como `Select` em **todos** os formulários de endereço
- [ ] Valor padrão: "Brasil" pré-selecionado
- [ ] Lista de países com os principais mercados Halal (Brasil, Arábia Saudita, Emirados, Malásia, Indonésia, Turquia, etc.)
- [ ] Formato: Nome do país em português
- [ ] Quando país é "Brasil", exibe campo UF como select de estados brasileiros
- [ ] Quando país é diferente de "Brasil", campo UF vira texto livre
- [ ] Consistência de layout e posicionamento em todos os formulários

**Regras de Negócio**:
- **RN-081-01**: País padrão é "Brasil" para todos os novos cadastros
- **RN-081-02**: Alteração de país reseta os campos de UF e Cidade
- **RN-081-03**: Campo de CEP oculto ou desabilitado para países diferentes de Brasil

**Testes**:
- [ ] Teste unitário: País padrão "Brasil"
- [ ] Teste unitário: Alternância entre select de UF e texto livre
- [ ] Teste unitário: Reset de campos ao trocar país

---

## 3. Solicitar Certificação

---

##### **US-082: Seleção de Empresa por Select com Botão de Adicionar**

```
Como empresa solicitante,
Eu quero selecionar minha empresa de uma lista ao solicitar certificação em vez de digitar o CNPJ,
Para que o processo seja mais rápido e eu possa adicionar uma nova empresa facilmente.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-076

**Critérios de Aceitação**:
- [ ] Campo CNPJ em "Dados da Empresa" substituído por componente `Select`
- [ ] Select lista todas as empresas vinculadas ao grupo do usuário logado
- [ ] Formato da opção: `Razão Social - CNPJ formatado`
- [ ] Botão "Adicionar Empresa" ao lado do select para cadastrar nova empresa
- [ ] Ao clicar em "Adicionar Empresa", abre modal de cadastro rápido de empresa
- [ ] Após cadastrar nova empresa, select é atualizado e a nova empresa selecionada automaticamente
- [ ] Ao selecionar uma empresa, dados de endereço são preenchidos automaticamente

**Regras de Negócio**:
- **RN-082-01**: Somente empresas do grupo do usuário logado são listadas
- **RN-082-02**: Empresas com situação "Inativa" não aparecem no select
- **RN-082-03**: O botão "Adicionar Empresa" segue as mesmas validações do cadastro completo

**UX/UI**:
- Select com busca (searchable combobox)
- Botão "+" ou "Adicionar Empresa" com ícone, posicionado à direita do select
- Modal de cadastro rápido com campos essenciais (CNPJ, Razão Social, Endereço)

**Testes**:
- [ ] Teste unitário: Lista apenas empresas do grupo
- [ ] Teste unitário: Preenchimento automático ao selecionar
- [ ] Teste E2E: Fluxo de adicionar empresa e selecionar

---

##### **US-083: Corrigir Validação de Campos Obrigatórios de Endereço na Certificação**

```
Como empresa solicitante,
Eu quero ser impedido de avançar sem preencher o endereço completo,
Para que minha solicitação de certificação não fique com dados incompletos.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Campos obrigatórios de endereço definidos: CEP, Logradouro, Número, Bairro, Cidade, Estado, País
- [ ] Validação executa ao clicar "Avançar" / "Salvar" no formulário
- [ ] Campos não preenchidos exibem mensagem de erro inline
- [ ] Schema Zod atualizado com validação de obrigatoriedade para todos os campos de endereço
- [ ] Botão de submit desabilitado enquanto campos obrigatórios estiverem vazios (ou validação ao submit)
- [ ] Validação no backend (DTO) também impede dados incompletos

**Regras de Negócio**:
- **RN-083-02**: Validação deve ocorrer tanto no frontend (Zod) quanto no backend (class-validator)

**Testes**:
- [ ] Teste unitário: Schema Zod rejeita endereço incompleto
- [ ] Teste unitário: DTO backend rejeita endereço incompleto
- [ ] Teste E2E: Formulário não avança sem endereço completo

---

## 4. Meu Perfil

---

##### **US-084: Ocultar Opção de Ativação de 2FA na Segurança**

```
Como gestor do sistema,
Eu quero ocultar a opção de ativar 2FA no perfil do usuário,
Para que os usuários não vejam uma funcionalidade que ainda não está implementada.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 2 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Seção/botão de "Autenticação de Dois Fatores (2FA)" oculta na página Meu Perfil > Segurança
- [ ] Ocultação feita via flag/feature toggle para facilitar reativação futura
- [ ] Nenhuma rota ou endpoint de 2FA acessível pelo usuário
- [ ] Tela de segurança reorganizada sem espaço vazio onde o 2FA estava

**Regras de Negócio**:
- **RN-084-01**: Funcionalidade apenas oculta, não removida do código (feature flag)

**Testes**:
- [ ] Teste unitário: Componente de 2FA não renderizado quando flag desabilitada

---

##### **US-085: Ocultar Sessões Ativas na Segurança**

```
Como gestor do sistema,
Eu quero ocultar a seção de sessões ativas no perfil do usuário,
Para que os usuários não vejam uma funcionalidade que ainda não está operacional.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 2 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Seção "Sessões Ativas" oculta na página Meu Perfil > Segurança
- [ ] Ocultação feita via flag/feature toggle para facilitar reativação futura
- [ ] Tela de segurança reorganizada sem espaço vazio

**Regras de Negócio**:
- **RN-085-01**: Funcionalidade apenas oculta, não removida do código (feature flag)

**Testes**:
- [ ] Teste unitário: Componente de sessões não renderizado quando flag desabilitada

---

## 5. Empresas do Grupo

---

##### **US-086: Corrigir Exclusão de Empresa do Grupo**

```
Como administrador da empresa,
Eu quero conseguir excluir uma empresa do meu grupo,
Para que eu possa gerenciar corretamente as empresas vinculadas.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Botão "Excluir" na listagem de empresas do grupo funciona corretamente
- [ ] Modal de confirmação exibido antes da exclusão
- [ ] Chamada DELETE ao endpoint correto da API
- [ ] Empresa removida da lista após exclusão bem-sucedida (refresh da lista)
- [ ] Mensagem de sucesso exibida após exclusão
- [ ] Tratamento de erro quando empresa tem certificações ativas (não pode ser excluída)

**Regras de Negócio**:
- **RN-086-01**: Empresa com certificação em andamento NÃO pode ser excluída
- **RN-086-02**: Empresa principal do grupo (matriz) NÃO pode ser excluída
- **RN-086-03**: Exclusão é lógica (soft delete) ou desvinculação do grupo

**Testes**:
- [ ] Teste unitário: Chamada correta ao endpoint DELETE
- [ ] Teste unitário: Tratamento de erro para empresa com certificação ativa
- [ ] Teste E2E: Fluxo completo de exclusão

---

##### **US-087: Corrigir Layout do Modal de Exclusão de Empresa do Grupo**

```
Como usuário do sistema,
Eu quero que o modal de confirmação de exclusão de empresa seja exibido corretamente,
Para que eu tenha uma experiência visual consistente e sem bugs.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: US-086

**Critérios de Aceitação**:
- [ ] Modal de confirmação de exclusão renderizado sem bugs visuais
- [ ] Layout responsivo correto (desktop e mobile)
- [ ] Botões "Cancelar" e "Confirmar Exclusão" posicionados e estilizados corretamente
- [ ] Texto de confirmação legível e com espaçamento adequado
- [ ] Overlay/backdrop funcionando corretamente
- [ ] Modal centralizado na tela

**UX/UI**:
- Utilizar componente `AlertDialog` do shadcn/ui para consistência
- Botão "Confirmar Exclusão" em vermelho (destructive variant)
- Botão "Cancelar" como secondary/outline

**Testes**:
- [ ] Teste unitário: Renderização correta do modal
- [ ] Teste visual: Screenshot comparison (se disponível)

---

##### **US-088: Ocultar Opção de Configuração nas Empresas do Grupo**

```
Como gestor do sistema,
Eu quero ocultar a opção de configuração nas empresas do grupo,
Para que os usuários não acessem funcionalidade ainda não finalizada.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Botão/link "Configuração" oculto na tela de Empresas do Grupo
- [ ] Rota de configuração de empresa protegida (redirect se acessada diretamente)
- [ ] Ocultação via feature flag para reativação futura
- [ ] Layout da listagem ajustado sem espaço vazio

**Regras de Negócio**:
- **RN-088-01**: Funcionalidade apenas oculta, não removida do código

**Testes**:
- [ ] Teste unitário: Opção de configuração não renderizada quando flag desabilitada

---

## 6. Login / Autenticação

---

##### **US-089: Modal de Feedback para Erros de Autenticação no Login**

```
Como usuário do sistema,
Eu quero ver um modal claro quando minhas credenciais estiverem incorretas ou minha conta não estiver validada,
Para que eu entenda o motivo da falha e saiba como resolver.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: US-077

**Critérios de Aceitação**:
- [ ] Erro de credenciais inválidas (401) exibe modal com mensagem: "Usuário ou senha inválidos. Verifique seus dados e tente novamente."
- [ ] Usuário não validado/aprovado exibe modal com mensagem diferenciada: "Sua conta ainda não foi aprovada pelo administrador. Aguarde a validação ou entre em contato com o suporte."
- [ ] Modal utiliza o componente `ErrorModal` padronizado (US-077)
- [ ] Mensagens genéricas o suficiente para não revelar se o email existe no sistema (segurança)
- [ ] Botão "Tentar Novamente" que fecha o modal e foca no campo de email
- [ ] Para conta não validada: botão adicional "Contatar Suporte" (opcional)

**Regras de Negócio**:
- **RN-089-01**: Nunca revelar se o email existe ou não no sistema (prevenção de enumeração)
- **RN-089-02**: Após 5 tentativas falhas, exibir mensagem de bloqueio temporário (se implementado)
- **RN-089-03**: Usuários com status `PENDING_APPROVAL` recebem mensagem específica de conta pendente

**Casos de Uso Alternativos**:
- **Caso 1**: Conta bloqueada → "Sua conta foi bloqueada. Entre em contato com o administrador."
- **Caso 2**: Conta desativada → "Sua conta está desativada. Entre em contato com o suporte."

**Testes**:
- [ ] Teste unitário: Modal exibido para erro 401
- [ ] Teste unitário: Mensagem diferenciada para conta pendente
- [ ] Teste unitário: Mensagem genérica (sem revelar existência do email)
- [ ] Teste E2E: Fluxo de login com credenciais inválidas

---

## 7. Notificações

---

##### **US-090: Exibir Somente Notificações Pendentes**

```
Como usuário do sistema,
Eu quero ver apenas as notificações pendentes (não lidas) no sino de notificações,
Para que eu foque nas ações que realmente precisam da minha atenção.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Lista de notificações exibe apenas notificações com status "pendente" / não lidas
- [ ] Contador no ícone do sino reflete apenas notificações pendentes
- [ ] Opção/link "Ver todas" para acessar histórico completo (incluindo lidas)
- [ ] Ao marcar como lida, notificação sai da lista principal
- [ ] Filtro aplicado tanto no frontend (query) quanto na API (parâmetro `status=pending`)

**Regras de Negócio**:
- **RN-090-01**: Notificações pendentes são ordenadas por data (mais recente primeiro)
- **RN-090-02**: Notificação marcada como lida não reaparece na lista principal

**Testes**:
- [ ] Teste unitário: Filtro de notificações pendentes
- [ ] Teste unitário: Contador atualizado corretamente
- [ ] Teste de integração: API retorna apenas pendentes com filtro

---

## 8. Dashboards

---

##### **US-091: Remover Widget MRR (Receita Mensal) dos Dashboards**

```
Como gestor do sistema,
Eu quero remover o widget de MRR (Receita Mensal Recorrente) dos dashboards,
Para que não exiba dados financeiros que ainda não estão integrados ao sistema.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 2 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Card/widget de MRR removido de **todos** os dashboards que o exibem
- [ ] Layout do dashboard reajustado para ocupar o espaço sem o widget
- [ ] Nenhuma chamada à API de MRR sendo feita (performance)
- [ ] Código do widget mantido comentado ou via feature flag para uso futuro

**Testes**:
- [ ] Teste unitário: Widget de MRR não renderizado

---

##### **US-092: Ocultar Seção de Documentação**

```
Como gestor do sistema,
Eu quero ocultar a seção/link de documentação da interface,
Para que os usuários não acessem documentação ainda em construção.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 2 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Link/menu "Documentação" oculto do sidebar/navbar
- [ ] Rota de documentação protegida (redirect se acessada diretamente)
- [ ] Ocultação via feature flag para reativação futura

**Testes**:
- [ ] Teste unitário: Link de documentação não renderizado quando flag desabilitada

---

##### **US-093: Labels nos Valores de Processos por Fase no Dashboard do Gestor**

```
Como gestor da certificadora,
Eu quero ver os valores numéricos diretamente nos gráficos de processos por fase,
Para que eu consiga identificar rapidamente a quantidade em cada fase sem precisar passar o mouse.
```

**Prioridade**: Should Have (P1)
**Estimativa**: 3 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Gráfico de "Processos por Fase" exibe labels com valores numéricos em cada barra/segmento
- [ ] Labels posicionados de forma legível (dentro ou acima das barras)
- [ ] Valores zero não exibem label (evitar poluição visual)
- [ ] Fonte e cor dos labels consistentes com o design system
- [ ] Labels responsivos (escondidos se espaço insuficiente em mobile)

**Testes**:
- [ ] Teste unitário: Labels renderizados com valores corretos
- [ ] Teste unitário: Labels ocultos para valores zero

---

##### **US-094: Corrigir Tempo de Atividade Zerado no Dashboard do Analista**

```
Como analista da certificadora,
Eu quero ver o tempo real de atividade nas minhas métricas do dashboard,
Para que eu possa acompanhar minha produtividade corretamente.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 2 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Widget "Tempo de Atividade" exibe valor correto (não zerado)
- [ ] Cálculo baseado no tempo entre início e conclusão das fases atribuídas ao analista
- [ ] Investigar e corrigir a causa raiz: query incorreta, campo não preenchido ou cálculo errado
- [ ] Formato de exibição: horas e minutos (ex: "12h 30min") ou dias (ex: "3 dias")

**Regras de Negócio**:
- **RN-094-01**: Tempo de atividade = soma do tempo gasto em todas as fases atribuídas ao analista
- **RN-094-02**: Se não houver dados, exibir "Sem dados" em vez de "0"

**Testes**:
- [ ] Teste unitário: Cálculo correto do tempo de atividade
- [ ] Teste unitário: Exibição "Sem dados" quando não há registros

---

##### **US-095: Adicionar Labels de Status da Certificação no Dashboard do Analista**

```
Como analista da certificadora,
Eu quero ver labels descritivos nos status das certificações no meu dashboard,
Para que eu identifique rapidamente o estado de cada processo.
```

**Prioridade**: Should Have (P1)
**Estimativa**: 2 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Cada status de certificação exibe label textual além da cor/ícone
- [ ] Labels: "Em Análise", "Pendente", "Aprovado", "Reprovado", "Em Auditoria", etc.
- [ ] Badges/chips coloridos com texto do status
- [ ] Consistência visual com outros dashboards do sistema

**Testes**:
- [ ] Teste unitário: Labels corretos para cada status
- [ ] Teste unitário: Cores corretas para cada status

---

## 9. Gestão de Atribuições

---

##### **US-096: Corrigir Contagem de Dias Zerada nas Atribuições**

```
Como gestor da certificadora,
Eu quero ver a quantidade correta de dias em cada atribuição,
Para que eu possa monitorar prazos e identificar atrasos.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 3 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Coluna "Dias" na listagem de atribuições exibe valor correto (não zero)
- [ ] Cálculo: diferença em dias entre a data de atribuição e a data atual (ou data de conclusão)
- [ ] Investigar causa raiz: campo `assignedAt` não preenchido, query incorreta ou cálculo frontend errado
- [ ] Atribuições concluídas mostram total de dias que levaram
- [ ] Atribuições em andamento mostram dias decorridos desde a atribuição

**Regras de Negócio**:
- **RN-096-01**: Dias = `dateFns.differenceInDays(hoje, dataAtribuicao)`
- **RN-096-02**: Se data de atribuição for nula, exibir "-" (traço)

**Testes**:
- [ ] Teste unitário: Cálculo correto de diferença de dias
- [ ] Teste unitário: Tratamento de data nula

---

## 10. Gestão de Usuários

---

##### **US-097: Corrigir Erro ao Deletar Usuário Cadastrado**

```
Como administrador do sistema,
Eu quero conseguir excluir usuários cadastrados sem erros,
Para que eu possa gerenciar os acessos ao sistema corretamente.
```

**Prioridade**: Must Have (P0)
**Estimativa**: 5 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Botão "Excluir" na listagem de usuários funciona sem erro
- [ ] Modal de confirmação exibido antes da exclusão
- [ ] Chamada DELETE ao endpoint correto da API
- [ ] Erro atual investigado e corrigido (possível FK constraint, soft delete não implementado, ou erro no endpoint)
- [ ] Usuário removido da lista após exclusão bem-sucedida
- [ ] Mensagem de sucesso exibida
- [ ] Tratamento de erro quando usuário tem dependências (certificações, atribuições)

**Regras de Negócio**:
- **RN-097-01**: Exclusão deve ser lógica (soft delete) - setar status como "INACTIVE" ou "DELETED"
- **RN-097-02**: Usuário com certificações ativas não pode ser excluído, apenas desativado
- **RN-097-03**: Admin não pode excluir a si mesmo
- **RN-097-04**: Registrar audit trail da exclusão

**Casos de Uso Alternativos**:
- **Caso 1**: Usuário com dependências → Exibir mensagem: "Usuário possui processos ativos. Deseja desativá-lo?"
- **Caso 2**: Tentativa de auto-exclusão → Bloquear com mensagem: "Você não pode excluir sua própria conta"

**Testes**:
- [ ] Teste unitário: Chamada correta ao endpoint DELETE
- [ ] Teste unitário: Tratamento de FK constraints
- [ ] Teste unitário: Bloqueio de auto-exclusão
- [ ] Teste E2E: Fluxo completo de exclusão

---

## Resumo de Classificação

### Por Tipo

| Tipo | Qtd | Stories |
|------|-----|---------|
| **Bug Fix** | 6 | US-083, US-086, US-087, US-094, US-096, US-097 |
| **Melhoria UX** | 8 | US-074, US-075, US-077, US-082, US-089, US-090, US-093, US-095 |
| **Nova Funcionalidade** | 4 | US-076, US-078, US-079, US-081 |
| **Ocultar Feature** | 4 | US-084, US-085, US-088, US-092 |
| **Padronização** | 2 | US-080, US-091 |

### Por Prioridade

| Prioridade | Qtd | SP |
|------------|-----|-----|
| **Must Have (P0)** | 19 | 76 |
| **Should Have (P1)** | 3 | 10 |

### Sugestão de Ordem de Implementação (Sprints)

**Sprint 1 - Fundações (21 SP)**:
US-077, US-078, US-080 → Componentes base reutilizáveis

**Sprint 2 - Cadastro e Validações (21 SP)**:
US-074, US-075, US-076, US-079 → Melhorias de cadastro

**Sprint 3 - Certificação e Correções (18 SP)**:
US-081, US-082, US-083, US-089 → Fluxo de certificação e login

**Sprint 4 - Bugs e Ajustes (16 SP)**:
US-086, US-087, US-096, US-097 → Correções críticas

**Sprint 5 - Polish e Ocultação (13 SP)**:
US-084, US-085, US-088, US-090, US-091, US-092, US-093, US-094, US-095 → Ajustes finais
