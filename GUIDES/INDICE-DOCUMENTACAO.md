# 📚 Índice de Documentação - HalalSphere

**Última Atualização**: 13 de Janeiro de 2026

⚠️ **REPOSITÓRIO DIVIDIDO (2026-01-12)**

Este monorepo contém documentação geral e histórica. Para código ativo:
- **Backend:** https://github.com/Ecohalal/halalsphere-backend
- **Frontend:** https://github.com/Ecohalal/halalsphere-frontend

---

## 📂 Estrutura de Pastas

### 01-prd/
Documentação de Produto (Product Requirements Document)
- `05-user-stories/` - User Stories organizadas por épico
  - **epic-01-requests.md** - Gestão de Solicitações
  - **epic-09-auto-cadastro.md** - Sistema de Auto Cadastro ⭐ NOVO
  - **EPIC-01-STATUS.md** - Status de implementação
  - **STATUS-IMPLEMENTACAO-TODOS-EPICOS.md** - Visão geral completa

### 02-technical/
Documentação Técnica
- **ENDPOINTS-CONTRATOS.md** - Endpoints de contratos e assinatura eletrônica
- Arquitetura do sistema
- Especificações técnicas
- Diagramas de infraestrutura

### 03-ux/
Design e Experiência do Usuário
- Guias de design
- Wireframes
- Protótipos

### ARCHITECTURE/
Decisões Arquiteturais e Estrutura
- Padrões de design
- Diagramas de arquitetura
- Decisões técnicas documentadas

### CHANGELOG/
Histórico de Mudanças
- Logs de versões
- Mudanças significativas
- Breaking changes

### GUIDES/
Guias e Tutoriais
- **PROXIMOS-PASSOS-MVP.md** - Roadmap do MVP
- Guias de implementação
- Tutoriais para desenvolvedores

### IMPLEMENTATION-HISTORY/
Histórico de Implementações
- **2025-12-17-auto-cadastro-backend.md** - Backend do auto cadastro
- **2025-12-17-auto-cadastro-completo.md** - Implementação completa
- **HISTORICO-RESPOSTAS-PROPOSTA.md** - Histórico de propostas
- **IMPLEMENTACAO-CONTRATOS-ASSINATURA.md** - Contratos e assinatura

### PROCESS/
Processos e Metodologias
- **2025-12-17-reorganizacao-completa.md** - Reorganização completa (17/12/2025) ⭐
- **2025-12-17-reorganizacao-testes.md** - Reorganização de testes (17/12/2025) ⭐
- **PLANO-REORGANIZACAO-PROJETO.md** - Plano de reorganização
- **REORGANIZACAO-ESTRUTURA.md** - Estrutura reorganizada
- **REORGANIZACAO-CONCLUIDA.md** - Conclusão da reorganização anterior
- Metodologias ágeis
- Fluxos de trabalho

### TESTING/
Testes e Validações
- **test-analyst-assignment.js** - Testes de atribuição de analista
- **test-api.sh** - Testes de API (shell script)
- **test-audit-report.pdf** - Relatório de auditoria de teste
- **test-audit-schedule.js** - Testes de agendamento de auditoria
- **test-auto-assign.js** - Testes de atribuição automática
- **test-auto-assign-complete.js** - Testes de atribuição automática (completo)
- **test-auto-assign-final.js** - Testes de atribuição automática (final)
- **test-comments.js** - Testes de comentários
- **test-login.js** - Testes de login
- **test-process-phases.js** - Testes de fases de processo
- **test-proposal-accept.js** - Testes de aceitação de proposta
- **test-sprint1.js** - Testes da Sprint 1
- **test-submit-wizard.js** - Testes de submissão de wizard
- **test-upload.js** - Testes de upload
- Planos de teste
- Casos de teste
- Relatórios de QA

---

## 🎯 Documentos Principais

### Para Desenvolvedores

1. **Visão Geral do Projeto**
   - [README.md](../README.md) - Introdução ao projeto
   - [halalsphere-project-brief.md](../01-prd/halalsphere-project-brief.md) - Brief completo
   - [ANALISE-PROJETO-EPICOS-2025.md](../ANALYSIS/ANALISE-PROJETO-EPICOS-2025.md) - Análise de épicos

2. **Status de Implementação**
   - [STATUS-IMPLEMENTACAO-TODOS-EPICOS.md](01-prd/05-user-stories/STATUS-IMPLEMENTACAO-TODOS-EPICOS.md) - Status geral
   - [EPIC-01-STATUS.md](01-prd/05-user-stories/EPIC-01-STATUS.md) - Épico 1 detalhado

3. **Roadmap**
   - [PROXIMOS-PASSOS-MVP.md](GUIDES/PROXIMOS-PASSOS-MVP.md) - Próximos passos do MVP

4. **Histórico Recente**
   - [2025-12-17-auto-cadastro-completo.md](IMPLEMENTATION-HISTORY/2025-12-17-auto-cadastro-completo.md) - Auto cadastro ⭐

### Para Product Owners

1. **User Stories**
   - [epic-01-requests.md](01-prd/05-user-stories/epic-01-requests.md) - Solicitações
   - [epic-09-auto-cadastro.md](01-prd/05-user-stories/epic-09-auto-cadastro.md) - Auto cadastro ⭐

2. **Progresso**
   - [STATUS-IMPLEMENTACAO-TODOS-EPICOS.md](01-prd/05-user-stories/STATUS-IMPLEMENTACAO-TODOS-EPICOS.md)

### Para Arquitetos

1. **Arquitetura Técnica**
   - [technical-architecture.md](../02-technical/technical-architecture.md)
   - [ARCHITECTURE/](ARCHITECTURE/)

2. **Decisões Técnicas**
   - [ARCHITECTURE/](ARCHITECTURE/)

---

## 🆕 Últimas Adições

### 17 de Dezembro de 2025

#### ÉPICO 9: Sistema de Auto Cadastro ⭐
- **Documentação**: [epic-09-auto-cadastro.md](01-prd/05-user-stories/epic-09-auto-cadastro.md)
- **Implementação Backend**: [2025-12-17-auto-cadastro-backend.md](IMPLEMENTATION-HISTORY/2025-12-17-auto-cadastro-backend.md)
- **Implementação Completa**: [2025-12-17-auto-cadastro-completo.md](IMPLEMENTATION-HISTORY/2025-12-17-auto-cadastro-completo.md)

**Entregas**:
- ✅ Backend API completo (5 endpoints públicos)
- ✅ Frontend com wizard multi-step (4 páginas)
- ✅ Sistema de verificação de email
- ✅ Prevenção de duplicação de contas e empresas
- ✅ Validação de documentos fiscais por país

**User Stories**:
- US-068: Registro Inicial de Conta (5 SP)
- US-069: Cadastro de Dados da Empresa (8 SP)
- US-070: Verificação de Email (5 SP)
- US-071: Prevenção de Duplicação (5 SP)
- US-072: Wizard Multi-Step (8 SP)
- US-073: Integração com Fluxo (3 SP)

**Total**: 34 Story Points (~4-5 dias)

---

## 📊 Métricas do Projeto

### Status de Implementação por Épico

| Épico | Nome | Status | Progresso |
|-------|------|--------|-----------|
| 01 | Gestão de Solicitações | 🟢 Completo | 85% |
| 02 | Gestão Comercial | 🟡 Parcial | 75% |
| 03 | Análise e Preparação | 🟢 Completo | 90% |
| 04 | Execução de Auditorias | 🟢 Completo | 95% |
| 05 | Decisão e Certificados | 🟡 Parcial | 60% |
| 06 | Assistente IA | 🔴 Não Iniciado | 5% |
| 07 | Gestão Administrativa | 🟢 Completo | 80% |
| 08 | Infraestrutura | 🟢 Completo | 85% |
| **09** | **Auto Cadastro** | ✅ **Completo** | **100%** ⭐ |

### Prioridades Críticas para MVP

1. 🚨 **Sistema de Emails** (US-067) - Bloqueador
2. 🚨 **Emissão de Certificados** (US-044, 045, 046) - Bloqueador
3. 🚨 **Assinatura Eletrônica** (US-017) - Importante

---

## 🔍 Como Navegar

### Por Fase de Desenvolvimento

**Planejamento**:
- `01-prd/` - User Stories e requisitos
- `GUIDES/PROXIMOS-PASSOS-MVP.md` - Roadmap

**Desenvolvimento**:
- `02-technical/` - Especificações técnicas
- `ARCHITECTURE/` - Decisões arquiteturais
- `IMPLEMENTATION-HISTORY/` - Histórico de implementações

**Testes**:
- `TESTING/` - Testes e validações

**Manutenção**:
- `CHANGELOG/` - Histórico de mudanças
- `PROCESS/` - Processos e metodologias

### Por Papel

**Desenvolvedor Frontend**:
1. [STATUS-IMPLEMENTACAO-TODOS-EPICOS.md](01-prd/05-user-stories/STATUS-IMPLEMENTACAO-TODOS-EPICOS.md)
2. [03-ux/](03-ux/) - Guias de UX
3. [IMPLEMENTATION-HISTORY/](IMPLEMENTATION-HISTORY/) - Exemplos de código

**Desenvolvedor Backend**:
1. [technical-architecture.md](../02-technical/technical-architecture.md)
2. [ARCHITECTURE/](ARCHITECTURE/)
3. [IMPLEMENTATION-HISTORY/](IMPLEMENTATION-HISTORY/) - Implementações anteriores

**QA/Tester**:
1. [TESTING/](TESTING/) - Scripts de teste
2. [01-prd/05-user-stories/](01-prd/05-user-stories/) - Critérios de aceitação

**Product Owner**:
1. [STATUS-IMPLEMENTACAO-TODOS-EPICOS.md](01-prd/05-user-stories/STATUS-IMPLEMENTACAO-TODOS-EPICOS.md)
2. [GUIDES/PROXIMOS-PASSOS-MVP.md](GUIDES/PROXIMOS-PASSOS-MVP.md)
3. [ANALISE-PROJETO-EPICOS-2025.md](../ANALYSIS/ANALISE-PROJETO-EPICOS-2025.md)

---

## 📝 Convenções de Nomenclatura

### Arquivos

- **Épicos**: `epic-XX-nome.md` (ex: `epic-09-auto-cadastro.md`)
- **User Stories**: `US-XXX` dentro dos arquivos de épico
- **Histórico**: `YYYY-MM-DD-descricao.md` (ex: `2025-12-17-auto-cadastro-backend.md`)
- **Status**: `STATUS-*.md` (ex: `STATUS-IMPLEMENTACAO-TODOS-EPICOS.md`)

### Pastas

- **MAIÚSCULAS**: Categorias principais (ex: `GUIDES`, `TESTING`)
- **minúsculas-com-hifen**: Subcategorias (ex: `user-stories`)
- **Números**: Ordem sequencial (ex: `01-prd`, `02-technical`)

---

## 🔗 Links Úteis

### Repositório
- **Backend**: [backend/](../backend/)
- **Frontend**: [frontend/](../frontend/)
- **Database**: [backend/prisma/schema.prisma](../backend/prisma/schema.prisma)

### Documentação Externa
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [NestJS Docs](https://docs.nestjs.com/)

---

## 📞 Suporte

Para dúvidas sobre a documentação:
1. Verifique o índice acima
2. Consulte os guias em `GUIDES/`
3. Revise o histórico em `IMPLEMENTATION-HISTORY/`

---

**Mantido por**: Claude AI
**Última Revisão**: 17/12/2025
**Próxima Atualização**: Após conclusão do MVP
