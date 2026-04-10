# Fluxo de Certificacao Halal - HalalSphere

## Visao Geral

O sistema HalalSphere implementa um fluxo de certificacao Halal em **17 fases**, baseado no PR 7.1 Rev 21/22 da FAMBRAS. O fluxo e unico para todos os tipos de solicitacao (nova, renovacao, ampliacao, manutencao, reducao), com variacoes nas fases obrigatorias por tipo.

O fluxo segue a sequencia: **Empresa > Comercial > Juridico > Gestao > Analise > Auditoria > Comite > Certificacao**.

---

## Tipos de Solicitacao

| Tipo | Descricao | Quando |
|------|-----------|--------|
| **Nova** | Primeira certificacao da empresa/produto | Empresa nunca certificada |
| **Renovacao** | Renovacao de certificacao existente | Antes do vencimento (alerta 6 meses) |
| **Ampliacao** | Inclusao de novos produtos/linhas | Durante vigencia |
| **Manutencao** | Auditoria periodica obrigatoria | Ate 12 meses apos Estagio 2 |
| **Reducao** | Reducao do escopo certificado | Durante vigencia |

---

## Fases do Fluxo

### Fase 0 - Solicitacao (Empresa)

**Responsavel**: Empresa
**Acao**: Empresa preenche o wizard de nova solicitacao

O wizard coleta:
- **Tipo de solicitacao** (nova, renovacao, ampliacao, manutencao)
- **Selecao da empresa** (pre-preenchida se ja cadastrada no grupo)
- **Escopo**: produtos, marcas, instalacoes, fornecedores
- **Informacoes de producao** (OBRIGATORIOS): capacidade produtiva, endereco de producao, numero de funcionarios, turnos
- **Documentos obrigatorios**: licencas, alvaras, laudos

**Dados persistentes**: Informacoes de producao sao salvas na empresa/planta e reutilizadas automaticamente em futuras solicitacoes.

**Transicao**: AUTOMATICA - Ao submeter o wizard, o workflow e criado e avanca automaticamente para a Fase 1.

**Protocolo gerado**: HS-YYYY-NNNNNN (ex: HS-2026-000012)

---

### Fase 1 - Elaboracao de Proposta (Comercial)

**Responsavel**: Equipe Comercial
**Acao**: Comercial recebe a solicitacao e elabora proposta comercial

O comercial:
- Analisa o escopo solicitado pela empresa
- Define valores com base na tabela de precos (categorias industriais, numero de plantas, complexidade)
- Elabora proposta formal com: valor, prazo de validade, condicoes de pagamento
- Envia proposta para a empresa

**Transicao**: MANUAL - Comercial envia a proposta, workflow avanca para Fase 2.

---

### Fase 2 - Negociacao da Proposta (Empresa)

**Responsavel**: Empresa
**Acao**: Empresa recebe a proposta e decide

A empresa pode:
- **Aceitar** a proposta -> avanca para Fase 3
- **Recusar** a proposta (com motivo) -> volta para Fase 1 (comercial refaz proposta)
- **Negociar** -> solicitar ajustes de valor ou condicoes

**Transicao**: MANUAL - Empresa aceita ou recusa. Se aceita, avanca automaticamente.

---

### Fase 3 - Proposta Aprovada

**Responsavel**: Sistema (automatico)
**Acao**: Registro da aprovacao da proposta

**Transicao**: AUTOMATICA - Proposta aceita avanca direto para Fase 4 (Juridico).

---

### Fase 4 - Elaboracao de Contrato (Juridico)

**Responsavel**: Equipe Juridica
**Acao**: Juridico elabora contrato de certificacao

O juridico:
- Recebe notificacao de que a proposta foi aceita
- Elabora contrato com base na proposta aprovada
- Numero do contrato = numero da proposta (IT 4.2)
- Anexa documentos ao contrato (upload disponivel)
- Envia contrato para a empresa

**Negociacao de contrato**: Se a empresa solicitar alteracoes, o juridico pode reenviar versao revisada. Upload de documentos disponivel para ambas as partes durante negociacao.

**Transicao**: MANUAL - Juridico envia contrato, workflow avanca para Fase 5.

---

### Fase 5 - Assinatura do Contrato (Empresa)

**Responsavel**: Empresa
**Acao**: Empresa assina o contrato

A empresa:
- Recebe notificacao do contrato
- Revisa termos e condicoes
- Pode solicitar negociacao (volta para Fase 4)
- Assina o contrato digitalmente

**Transicao**: MANUAL - Empresa confirma assinatura. Workflow fica AGUARDANDO o gestor atribuir analista (Fase 6).

---

### Fase 6 - Atribuicao de Analista (Gestor)

**Responsavel**: Gestor (segregado por area)
**Acao**: Gestor da area atribui analista ao processo

**Segregacao por area**:
- **Gestor de Frigorifico**: recebe solicitacoes de categorias DT 7.2.1 e DT 7.2.2 (abate de aves e bovinos)
- **Gestor de Industria**: recebe solicitacoes das demais categorias (DT 7.1, 7.4 a 7.11)

O gestor:
- Visualiza apenas processos da sua area de especialidade
- Processo so aparece na tela de atribuicao APOS contrato assinado
- Seleciona analista compativel com a area (frigorifico ou industrial)
- Pode atribuir a si mesmo (se tiver perfil acumulado gestor+analista)

**Perfil acumulado**: Gestores com `additionalRoles: ['analista']` podem atuar como analistas em certificacoes.

**Transicao**: AUTOMATICA - Ao atribuir analista, workflow avanca para Fase 7.

---

### Fase 7 - Analise Documental Inicial (Analista)

**Responsavel**: Analista
**Acao**: Analista valida todos os documentos submetidos pela empresa

O analista:
- Recebe notificacao da atribuicao
- Acessa documentos da certificacao
- Valida cada documento individualmente (aprovar/rejeitar com justificativa)
- Se documentos rejeitados: empresa e notificada para correcao
- Aguarda todos os documentos serem validados

**Condicao para avancar**: Nenhum documento com status "pendente"

**Transicao**: MANUAL - Analista avanca quando todos os documentos estao validados.

---

### Fase 8 - Avaliacao Documental (Analista)

**Responsavel**: Analista
**Acao**: Analista emite parecer sobre a documentacao

O analista:
- Avalia conjunto completo da documentacao
- Verifica aderencia aos requisitos da norma (GSO 2055-2 / SMIIC OIC/SMIIC 1)
- Emite parecer tecnico
- Se documentos rejeitados encontrados: empresa deve corrigir antes de avancar

**Condicao para avancar**: Nenhum documento rejeitado

**Transicao**: MANUAL - Analista aprova documentacao e avanca para planejamento de auditoria.

---

### Fase 9 - Planejamento da Auditoria (Gestor de Auditoria)

**Responsavel**: Gestor de Auditoria
**Acao**: Gestor atribui auditores e agenda auditoria

O gestor de auditoria:
- Recebe sugestoes automaticas de auditores (matching por competencia)
- Seleciona equipe de auditoria obedecendo:
  - **Composicao minima**: 1 auditor tecnico + 1 especialista islamico (sheikh)
  - **Imparcialidade**: auditor NAO pode auditar mesma empresa por 3+ anos consecutivos (PR 7.1 Secao 10.7.4)
  - **Declaracao FM 4.2.3**: todos os auditores devem ter declaracao de imparcialidade e confidencialidade assinada
- Define data, local e duracao da auditoria
- Modalidade (presencial/remota) conforme categoria industrial e norma

**Validacoes automaticas**:
- Auditor tecnico obrigatorio
- Sheikh obrigatorio
- Declaracao de imparcialidade verificada
- Rotacao por imparcialidade verificada (historico 3 anos)
- Modalidade presencial obrigatoria para categorias que exigem (conforme norma)

**Calculo de duracao**: Baseado na FM 7.1.9 (numero de funcionarios, turnos, complexidade do escopo)

**Transicao**: MANUAL - Gestor confirma agendamento apos todas as validacoes passarem.

---

### Fase 10a - Auditoria Estagio 1 (Auditor)

**Responsavel**: Equipe de Auditoria
**Acao**: Auditoria inicial (documental e preparatoria)

O auditor:
- Recebe acesso ao processo e documentacao
- Realiza auditoria Estagio 1 (foco documental)
- Registra achados e observacoes
- Pode registrar Nao Conformidades (NCs) ja nesta fase

**Condicao para avancar**: Auditoria Estagio 1 concluida

**Intervalo obrigatorio**: Maximo 6 meses entre Estagio 1 e Estagio 2 (PR 7.1)

**Transicao**: MANUAL - Auditor conclui Estagio 1.

---

### Fase 10b - Auditoria Estagio 2 (Auditor)

**Responsavel**: Equipe de Auditoria
**Acao**: Auditoria in loco (operacional)

O auditor:
- Realiza auditoria presencial na(s) planta(s)
- Verifica processos produtivos, abate, armazenamento
- Preenche checklists (FM 7.7.1 para frigorificos, FM 7.7.2 para industriais)
- Registra Nao Conformidades (NC Maior, NC Menor, Observacao)
- Elabora relatorio de auditoria

**Duracao minima**:
- Manutencao: 1/3 do tempo da certificacao inicial
- Renovacao: 2/3 do tempo da certificacao inicial

**Proibicao**: Relatorio do Estagio 1 deve ser emitido ANTES do inicio do Estagio 2

**Transicao**: MANUAL - Auditor conclui Estagio 2. Se ha NCs, avanca para Fase 11.

---

### Fase 11 - Analise de Nao Conformidades (Auditor)

**Responsavel**: Auditor / Analista
**Acao**: Registro e classificacao das NCs encontradas

**Classificacao**:
| Severidade | Descricao | Prazo |
|-----------|-----------|-------|
| **NC Maior** | Falha sistematica ou critica | 7 dias para plano de acao |
| **NC Menor** | Desvio pontual | 7 dias para plano de acao |
| **Observacao** | Ponto de melhoria | Informativo |

Cada NC registrada contem:
- Descricao detalhada
- Clausula da norma violada
- Evidencias (fotos, documentos)
- Severidade
- Prazo para resposta (7 dias)

**Se nao houver NCs**: Avanca direto para Fase 15 (Comite Tecnico)

**Transicao**: MANUAL - NCs registradas e enviadas para empresa.

---

### Fase 12 - Correcao de Nao Conformidades (Empresa)

**Responsavel**: Empresa
**Acao**: Empresa responde as NCs com plano de acao corretiva

A empresa:
- Recebe notificacao das NCs encontradas
- Prazo de 7 dias para responder cada NC
- Submete plano de acao corretiva
- Anexa evidencias de correcao (fotos, documentos, registros)

**Alerta automatico**: Notificacao por email quando prazo de 7 dias esta expirando

**Transicao**: MANUAL - Empresa submete todas as respostas.

---

### Fase 13 - Validacao das Correcoes (Auditor)

**Responsavel**: Auditor
**Acao**: Auditor valida as correcoes submetidas pela empresa

O auditor:
- Analisa cada resposta/evidencia
- Pode **aceitar** (NC encerrada) ou **rejeitar** (volta para Fase 12 - empresa corrige novamente)
- Registra comentarios de avaliacao

**Loop**: Se NCs rejeitadas, empresa recebe novo prazo para correcao. Ciclo repete ate todas as NCs estarem encerradas ou aceitas.

**Alerta automatico**: Auditor tem 7 dias para avaliar (notificacao por email)

**Transicao**: MANUAL - Todas as NCs encerradas/aceitas, avanca para Comite.

---

### Fase 14 - Comite Tecnico

**Responsavel**: Comite Tecnico (minimo 2 Sheikhs + 1 Tecnico)
**Acao**: Comite delibera sobre a certificacao

**Composicao obrigatoria** (PR 7.1 Secao 10.9.1):
- Minimo 2 especialistas islamicos (Sheikhs)
- Minimo 1 auditor tecnico
- Nenhum membro pode ter participado da auditoria desta certificacao

**Sequencia de revisoes** (4 etapas):
1. **Revisao Documental**: Analise dos documentos e relatorios
2. **Revisao Islamica**: Conformidade com requisitos Halal
3. **Revisao Tecnica**: Conformidade tecnica e normativa
4. **Revisao Final**: Deliberacao final

**Decisoes possiveis**:
- **Aprovar** (unanimidade) -> avanca para Fase 15 (Emissao)
- **Rejeitar** -> volta para Fase 7 (Analise Documental) para novo ciclo completo

**Transicao**: AUTOMATICA (se aprovado) - Avanca para emissao do certificado.

---

### Fase 15 - Emissao do Certificado (Gestor)

**Responsavel**: Gestor
**Acao**: Emissao do certificado Halal

O gestor:
- Seleciona template do certificado conforme:
  - Tipo: Frigorifico (FM 7.7.1) ou Industrial (FM 7.7.2)
  - Pais: Brasil, Argentina, Colombia, Paraguai, Peru
  - Reconhecimento: GAC (Golfo), SMIIC/OIC (HAK), BPJPH, MUIS, UAE, MS
  - Categoria industrial (DT 7.1 a 7.11)
  - Com/sem SIF, com/sem anexo
- Preenche dados do certificado
- Emite certificado com numero unico
- Define data de validade

**Data de validade em renovacao**: Baseada no ciclo anterior (nao na data de emissao)

**Transicao**: AUTOMATICA - Certificado emitido, workflow avanca para Fase 16.

---

### Fase 16 - Certificado Emitido

**Responsavel**: Sistema
**Acao**: Certificacao concluida

- Workflow marcado como "concluido"
- Empresa recebe notificacao
- Certificado disponivel para download
- Alertas automaticos programados:
  - 6 meses antes do vencimento
  - 90 dias antes do vencimento

---

## Automacoes e Alertas

### Avancos Automaticos

| Transicao | Gatilho |
|-----------|---------|
| Fase 0 -> 1 | Wizard submetido |
| Fase 3 -> 4 | Proposta aceita pela empresa |
| Fase 6 -> 7 | Gestor atribui analista |
| Fase 15 -> 16 | Certificado emitido |

### Alertas por Email e Notificacao

| Alerta | Prazo | Destinatario |
|--------|-------|-------------|
| Vencimento de certificado | 6 meses antes | Empresa + Gestor |
| Vencimento de certificado | 90 dias antes | Empresa + Gestor |
| Documentos pendentes | 30 dias antes da auditoria | Empresa |
| Plano de auditoria | 7 dias antes da data | Gestor auditoria |
| Relatorio de auditoria | 15 dias apos auditoria | Auditor |
| Resposta de NC | 7 dias apos registro | Empresa |
| Avaliacao de NC | 7 dias apos resposta | Auditor |
| Comite pendente | 15 dias apos etapas | Comite |
| Manutencao obrigatoria | 12 meses apos Estagio 2 | Empresa + Gestor |
| Suspensao automatica | Prazo de manutencao excedido | Gestor |

### Eventos no Calendario

Todos os alertas acima sao registrados no calendario do sistema, segregados por perfil:
- **Empresa**: ve seus proprios prazos
- **Analista**: ve prazos de processos atribuidos
- **Auditor**: ve auditorias agendadas
- **Gestor**: ve visao panoramica da area

Calendario abre em **modo lista** por padrao.

---

## Acoes de Gestao do Certificado

### Suspensao

- **Motivos catalogados** (7 motivos PR 7.1):
  1. Nao conformidade critica nao resolvida
  2. Uso indevido da marca Halal
  3. Alteracao nao comunicada no escopo
  4. Recusa de auditoria de manutencao
  5. Inadimplencia contratual
  6. Solicitacao do orgao regulador
  7. Outros motivos justificados
- Notificacao formal enviada a empresa
- Empresa pode solicitar reativacao

### Cancelamento

- So permitido **apos suspensao** (exceto distrato voluntario)
- Notificacao formal enviada a empresa
- Certificado invalidado

### Termino

- **Por decisao do cliente**: empresa solicita, gestor confirma
- Certificado encerrado na data de termino

### Reducao de Escopo

- Tipo de solicitacao especifico (`reducao`)
- Passa por fases simplificadas de analise

---

## Segregacao por Area

### Frigorifico vs Industrial

| Aspecto | Frigorifico | Industrial |
|---------|-------------|-----------|
| Categorias | DT 7.2.1 (aves), DT 7.2.2 (bovinos) | DT 7.1, 7.4 a 7.11 |
| Gestor | Gestor de Frigorifico | Gestor de Industria |
| Checklist | FM 7.7.1 (Habilitacao de Planta) | FM 7.7.2 (Certificado Unico) |
| Template certificado | Por especie (aves/bovinos) + pais + reconhecimento | Por DT + pais + reconhecimento |
| SIF | Relevante (com/sem SIF) | Nao aplicavel |
| Auditoria | Foco em abate e processamento | Foco em producao e armazenamento |

### Perfil Acumulado

Usuarios podem ter:
- `role`: papel principal (gestor, analista, auditor, etc.)
- `additionalRoles`: papeis adicionais (ex: gestor que tambem e analista)
- `specialtyArea`: area de atuacao (frigorifico, industrial, ambos)

---

## Nao Conformidades (NCs)

### Modelo

Cada NC e vinculada a uma certificacao e auditoria especifica, contendo:
- Descricao
- Clausula normativa violada
- Severidade (NC Maior / NC Menor / Observacao)
- Status (aberta -> respondida -> aceita/rejeitada -> encerrada)
- Prazo de resposta (7 dias)
- Evidencias (documentos anexados)

### Visoes

- **Aba na certificacao**: NCs especificas daquela certificacao
- **Tela /nao-conformidades**: visao panoramica para gestores (todas as NCs do sistema)

### Fluxo de NC

```
Auditor registra NC
    |
    v
Empresa responde (7 dias)
    |
    v
Auditor avalia resposta
    |
    +-- Aceita -> NC encerrada
    |
    +-- Rejeita -> Empresa corrige novamente (loop)
```

---

## Fluxo Visual

```
EMPRESA            COMERCIAL          JURIDICO           GESTAO             ANALISE            AUDITORIA          COMITE             CERTIFICACAO
  |                   |                  |                  |                  |                  |                  |                  |
  | 0.Solicitacao     |                  |                  |                  |                  |                  |                  |
  |----AUTO---------->|                  |                  |                  |                  |                  |                  |
  |                   | 1.Proposta       |                  |                  |                  |                  |                  |
  |                   |---MANUAL-------->|                  |                  |                  |                  |                  |
  |<--MANUAL----------|                  |                  |                  |                  |                  |                  |
  | 2.Aceita/Recusa   |                  |                  |                  |                  |                  |                  |
  |----AUTO---------->|                  |                  |                  |                  |                  |                  |
  |                   |    3.Aprovada    |                  |                  |                  |                  |                  |
  |                   |----AUTO--------->|                  |                  |                  |                  |                  |
  |                   |                  | 4.Contrato       |                  |                  |                  |                  |
  |<--MANUAL----------|                  |                  |                  |                  |                  |                  |
  | 5.Assina          |                  |                  |                  |                  |                  |                  |
  |----MANUAL-------->|                  |                  | 6.Atribui        |                  |                  |                  |
  |                   |                  |                  |----AUTO--------->|                  |                  |                  |
  |                   |                  |                  |                  | 7.Analise Doc    |                  |                  |
  |                   |                  |                  |                  | 8.Avaliacao      |                  |                  |
  |                   |                  |                  |                  |---MANUAL-------->|                  |                  |
  |                   |                  |                  | 9.Plan.Auditoria |                  |                  |                  |
  |                   |                  |                  |---MANUAL-------->|                  |                  |                  |
  |                   |                  |                  |                  |                  | 10.Estagio 1     |                  |
  |                   |                  |                  |                  |                  | 10.Estagio 2     |                  |
  |                   |                  |                  |                  |                  | 11-13.NCs        |                  |
  |                   |                  |                  |                  |                  |---MANUAL-------->|                  |
  |                   |                  |                  |                  |                  |                  | 14.Comite        |
  |                   |                  |                  |                  |                  |                  |---AUTO---------->|
  |                   |                  |                  |                  |                  |                  |                  | 15.Emissao
  |                   |                  |                  |                  |                  |                  |                  | 16.Emitido
```

---

## Dados Tecnicos

- **Backend**: NestJS 11 + Prisma 7 + PostgreSQL 16
- **Frontend**: React 19 + Vite 7 + TypeScript
- **17 fases** no enum `ProcessPhase`
- **47 modelos** Prisma
- **323 endpoints** REST
- **Cron jobs** para alertas automaticos (CertificationSchedulerService)
- **Notificacoes** in-app + email (SMTP)
- **Calendario** com eventos de prazos (modo lista padrao)

---

*Documento gerado em 23/03/2026 - HalalSphere v2.0*
*Baseado no PR 7.1 Rev 21/22, GSO 2055-2, SMIIC OIC/SMIIC 1, ISO 17065*
