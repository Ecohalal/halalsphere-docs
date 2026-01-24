### ÉPICO 1: Gestão de Solicitações e Onboarding

**Status de Implementação**: 🟢 95% Completo (Janeiro 2026)
**MVP em Produção**: 23 de Janeiro de 2026
**8 User Stories | 57 Story Points**

#### 📊 Resumo de Implementação

**✅ Implementado (8/8)**:
- US-001: Cadastro de Empresa ✅
- US-002: Wizard de Solicitação (9 etapas) ✅
- US-003: Upload de Documentos ✅
- US-004: Dashboard de Status (17 fases) ✅
- US-005: Calculadora de Custos ✅
- US-006: Notificações In-App ✅
- US-007: Editar Rascunho ✅
- US-008: Cancelar Solicitação ✅

**🟡 Pendente (Pós-MVP)**:
- Notificações por Email (depende EmailService)

**📂 Código Relacionado**:
- Backend: `backend/src/modules/process/` - Process & Request management
- Frontend: `frontend/src/pages/company/NewRequestWizard.tsx` - Wizard completo
- Frontend: `frontend/src/pages/company/CompanyDashboard.tsx` - Dashboard
- Schema: `Request`, `Process`, `Company` models

---

#### 📋 Feature 1.1: Cadastro e Solicitação de Certificação

##### **US-001: Cadastro de Nova Empresa Solicitante** ✅ IMPLEMENTADO

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

- [ ] **Sistema exibe wizard estruturado em 9 etapas** (atualizado em 16/11/2025):

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

**ETAPA 2: Classificação Industrial (GSO 2055-2)** [NOVA]
- [ ] Sistema solicita classificação hierárquica em 3 níveis:
  - **Nível 1 - Grupo Industrial**:
    - A: Agricultura (Criação de animais, piscicultura)
    - B: Plantação Agrícola (Cultivo de plantas, legumes, grãos)
    - C: Processamento de Alimentos e Rações
    - D: Produção de Ração Animal
  - **Nível 2 - Categoria**:
    - Sistema exibe categorias específicas do grupo selecionado
    - Exemplos: AI, AII, BI, BII, CI, CII, CIII, CIV, DI, DII
  - **Nível 3 - Subcategoria**:
    - Sistema exibe subcategorias com exemplos de atividades
    - Empresa seleciona a que melhor descreve sua operação
- [ ] Sistema fornece:
  - Interface de seleção em 3 sub-passos sequenciais
  - Cards visuais com ícones para cada grupo (A-D)
  - Breadcrumb mostrando: Grupo > Categoria > Subcategoria
  - Exemplos práticos de atividades para cada subcategoria
  - Link para PDF completo: "Categorias Industriais GSO 2055-2"
  - Botão de ajuda: "Não sei qual categoria escolher" → Abre chatbot IA
  - Botão "Voltar" em cada sub-passo (Categoria/Subcategoria)
- [ ] Sistema valida:
  - Todos os 3 níveis devem ser selecionados (obrigatório)
  - Classificação influencia requisitos documentais e cálculo de proposta
- [ ] Sistema exibe confirmação visual:
  - Caminho completo selecionado (ex: "A > AI > Criação de animais para produção de carne")
  - Indicador de completude com checkmark verde
  - Checkmarks aparecem apenas em níveis já confirmados
- [ ] Sistema implementa comportamento de reset ao navegar:
  - **Ao voltar de Categoria para Grupo**: Limpa categoria e subcategoria selecionadas
  - **Ao voltar de Subcategoria para Categoria**: Limpa apenas subcategoria selecionada
  - **Ao selecionar novo Grupo**: Descarta categoria e subcategoria anteriores
  - **Ao selecionar nova Categoria**: Descarta subcategoria anterior
  - **Feedback visual**: Checkmarks só aparecem em níveis anteriores ao atual
- [ ] Sistema exibe indicadores visuais de progresso:
  - Badge de passo atual (1/3, 2/3, 3/3)
  - Checkmarks em passos completados
  - Passos futuros sem checkmarks (mesmo se já foram selecionados antes)
- [ ] Botão "Salvar e Continuar" (habilitado apenas quando 3 níveis completos)

**ETAPA 3: Escopo da Certificação e Produtos**
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

**ETAPA 4: Produção e Processos**
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

**ETAPA 5: Matérias-Primas e Fornecedores**
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

**ETAPA 6: Documentos Obrigatórios (Checklist)**
- [ ] Sistema exibe checklist de documentos obrigatórios baseado em:
  - Tipo de certificação solicitada
  - Tipo de indústria
  - Classificação industrial (Grupo/Categoria/Subcategoria GSO 2055-2)
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

**ETAPA 7: Revisão e Submissão Final**
- [ ] Sistema exibe resumo completo organizado por seções:
  1. Dados da Empresa (Etapa 1)
  2. Classificação Industrial (Etapa 2) - [NOVA]
  3. Produtos e Certificação (Etapa 3)
  4. Produção (Etapa 4)
  5. Fornecedores e Ingredientes (Etapa 5)
  6. Documentos Anexados (Etapa 6)
- [ ] Empresa pode clicar para editar qualquer seção (volta ao step correspondente)
- [ ] Checkbox obrigatório: "Aceito os Termos e Condições de Certificação"
- [ ] Botão "Submeter Solicitação" habilitado apenas quando todos os requisitos foram atendidos

**APÓS SUBMISSÃO**:

- [ ] Sistema valida novamente que:
  - Todas as 9 etapas foram preenchidas
  - Classificação industrial foi selecionada (3 níveis completos)
  - Todos documentos obrigatórios foram enviados
  - Pelo menos 1 produto foi cadastrado
  - Termos foram aceitos

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
- **RN-005a**: Classificação industrial (Grupo/Categoria/Subcategoria GSO 2055-2) influencia requisitos documentais e complexidade da auditoria [NOVA]
- **RN-006**: Empresas com produtos de origem animal (C3, C6) DEVEM enviar certificados Halal de fornecedores
- **RN-007**: Man-hour de auditoria é calculado conforme PR 7.1 10.7.4 baseado em: número de funcionários, turnos, complexidade, classificação industrial
- **RN-008**: Número de protocolo é único e sequencial por ano
- **RN-009**: Solicitação não pode ser editada após submissão (apenas analista pode solicitar complementação)
- **RN-010a**: Classificação industrial é obrigatória e deve ter os 3 níveis completos (Grupo > Categoria > Subcategoria) [NOVA]

**Casos de Uso Alternativos**:

- **Caso 1**: Empresa não sabe qual tipo de certificação (C1-C6) → Chatbot IA faz perguntas e sugere
- **Caso 1a**: Empresa não sabe qual classificação industrial (GSO 2055-2) → Chatbot IA analisa descrição da atividade e sugere Grupo/Categoria/Subcategoria [NOVO]
- **Caso 2**: Empresa abandona formulário no meio → Sistema salva draft e envia e-mail de lembrete após 24h
- **Caso 3**: Upload de documento falha (conexão cai) → Sistema permite retry automático
- **Caso 4**: Empresa tenta submeter sem documentos obrigatórios → Sistema bloqueia e destaca o que falta
- **Caso 5**: Empresa seleciona classificação incorreta → Analista pode sugerir reclassificação durante revisão inicial [NOVO]

**UX/UI Specifications**:

**Referência**: [UX Design Guide - Seção 4: Jornada do Cliente](./ux-design-guide.md#4-jornada-do-cliente---wizard-com-ia)
**Wireframe**: [ux-journey-wizard-ai.html](./ux-journey-wizard-ai.html)

**Layout Geral do Wizard** (atualizado para 9 etapas):
```
┌────────────────────────────────────────────────┐
│ Header: Nova Solicitação de Certificação Halal│
├──────────┬─────────────────────────────────────┤
│          │ Toggle: [💬 Chat IA] [📝 Formulário]│
│ Sidebar  │                                     │
│          │ Conteúdo da Etapa Atual             │
│ Progresso│                                     │
│ 🟢 1     │                                     │
│ 🟢 2 [NEW] ◄─ Classificação Industrial        │
│ ⚪ 3     │                                     │
│ ⚪ 4     │                                     │
│ ⚪ 5     │                                     │
│ ⚪ 6     │                                     │
│ ⚪ 7     │ [← Voltar]  [Próxima Etapa →]      │
└──────────┴─────────────────────────────────────┘
```

**Componentes Visuais**:

1. **Sidebar de Navegação** (sticky, sempre visível):
   - Barra de progresso: "Etapa 2 de 7 (29%)"
   - Lista de etapas com status:
     - ✅ Etapas completadas (verde #2D5016)
     - 🟢 Etapa atual (destaque com background #F0F4ED)
     - ⚪ Etapas pendentes (cinza #D1D5DB, disabled)
   - Permite clicar em etapas já completadas para editar
   - Etapa 2 (nova): "Classificação Industrial" com ícone de fábrica 🏭

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
- Tempo médio: **15min** (vs. 45min atual) - ajustado para 9 etapas
- Solicitações completas: **95%** na 1ª tentativa (vs. 60%)
- NPS (Net Promoter Score): **> 70**
- Classificação industrial correta: **>90%** na primeira seleção

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
