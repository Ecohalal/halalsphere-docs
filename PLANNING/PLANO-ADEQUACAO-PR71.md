# Plano de Adequacao ao PR 7.1 Rev 22

**Data**: 2026-03-22
**Ultima Atualizacao**: 2026-03-23
**Fonte**: `PLANNING/ANALISE-FLUXO-PR71-VS-IMPLEMENTACAO.md`
**Status**: CONCLUIDO (exceto Bloco 6 - templates de certificado)

---

## Contexto

O sistema HalalSphere implementava ~70% do fluxo de certificacao inicial, com lacunas em fluxos secundarios, controles regulatorios e processos adversos. Este plano detalhou as acoes necessarias para atingir conformidade com o PR 7.1 Rev 22.

### Implementado em 22-23/03/2026

**Bloco 1 - Prazos e Alertas**: CONCLUIDO
- Cron jobs com notificacoes reais: vencimento 6m/90d, relatorio 15d, NCs 7d, comite 15d, manutencao 12m
- Emails automaticos via SES nos alertas criticos (vencimento 90d, NC vencida, relatorio atrasado, manutencao)

**Bloco 2 - Nao Conformidades**: CONCLUIDO
- Modelo NonConformity standalone (severidade MAIOR/MENOR/OBSERVACAO, status, prazo 7d, evidencias)
- CRUD completo (service + controller + 8 endpoints)
- Frontend: NonConformityTab na certificacao + pagina /nao-conformidades panoramica
- Eventos de NC no calendario

**Bloco 3 - Comite de Decisao**: CONCLUIDO
- Membro do comite nao pode ter participado da auditoria
- Composicao minima: 2 Sheikhs + 1 tecnico (via sgqAppointments)
- Rejeicao volta ao 1o passo (analise_documental_inicial) em vez de cancelar

**Bloco 4 - Suspensao/Cancelamento/Termino**: CONCLUIDO
- Cancelamento so apos suspensao (pos_suspensao) ou distrato (PR 7.1 Secao 12)
- 7 motivos de suspensao catalogados
- Notificacoes para empresa ao suspender/cancelar
- Termino voluntario por decisao da empresa (PR 7.1 Secao 14)
- Reducao de escopo como RequestType com fases proprias (PR 7.1 Secao 10.13)
- Frontend: CertificationActions com modais de confirmacao

**Bloco 5 - Auditoria**: CONCLUIDO
- Intervalo maximo 6 meses entre Estagio 1 e 2
- Relatorio do Estagio 1 obrigatorio antes do Estagio 2
- Composicao minima da equipe (tecnico + sheikh) no plano
- Imparcialidade: auditor nao pode auditar mesma empresa 3+ anos
- Alerta de auditoria nao anunciada ausente no ciclo
- Duracao minima 1/3 (manutencao) e 2/3 (renovacao)
- Calculo automatico de tempo ja existia (AuditDaysCalculatorService)
- Validacao presencial vs remoto por categoria ja existia

**Bloco 6 - Certificados e Reconhecimentos**: PENDENTE (sessao dedicada)
- 337 templates .docx do cliente analisados
- Estrutura: Tipo (frig/ind) x Pais x Especie x Reconhecimento x DT x SIF x Anexo
- Requer sessao dedicada para definir abordagem (programatica vs .docx)

**Bloco 7 - Auditorias Especiais**: CONCLUIDO
- 4 subtipos de auditoria especial (mudanca, normativa, urgencia, extraordinaria)
- Declaracao de imparcialidade FM 4.2.3 obrigatoria no planejamento
- Cadastros internacionais: campos na Company (HAKSIS, SiHalal, MOIAT, SFDA)

**Extras implementados na mesma sessao**:
- Segregacao frigorifico/industrial (specialtyArea no User + validacao no assignAnalyst)
- Perfil acumulado gestor+analista (additionalRoles + RolesGuard ajustado)
- Fluxos renovacao/ampliacao/manutencao alinhados ao PR 7.1
- Dados de producao obrigatorios e persistentes no wizard
- Session security (sessionStorage + "Manter conectado")
- Calendario default modo lista + eventos de NCs

---

## Legenda de Complexidade
- **P** = Pequena (1-2 dias)
- **M** = Media (3-5 dias)
- **G** = Grande (1-2 semanas)

---

## BLOCO 1 - Controles de Prazo e Alertas (Prioridade ALTA)

Infraestrutura existente: `CertificationSchedulerService` (cron jobs), modelo `Notification`, `NotificationService` com metodos `create()`, `createForMany()`, `createForRole()`, `createForCompany()`.

| # | Item | O que falta | Ja existe | Complexidade |
|---|------|-------------|-----------|-------------|
| 1.1 | Alerta de vencimento 6 meses antes | Novo cron job + notificacao para empresa e analista | Scheduler + Notification model | P |
| 1.2 | Alerta 90 dias antes (agendar manutencao/renovacao) | Novo cron job | Scheduler | P |
| 1.3 | Prazo 30 dias - documentos antes da auditoria | Validacao no `canAdvancePhase()` da fase planejamento_auditoria | WorkflowService | P |
| 1.4 | Prazo 7 dias - envio do plano de auditoria antes da data | Validacao no AuditPlan + alerta | AuditPlan model existe | P |
| 1.5 | Prazo 15 dias - relatorio apos auditoria | Novo cron job que verifica auditorias concluidas sem relatorio | Audit model | P |
| 1.6 | Prazo 7 dias - empresa responder NCs | Alerta apos fase `analise_nao_conformidades` | Notification | P |
| 1.7 | Prazo 7 dias - auditor encerrar NCs apos evidencias | Alerta apos fase `correcao_nao_conformidades` | Notification | P |
| 1.8 | Prazo 15 dias - comite apos finalizacao etapas | Alerta apos fase anterior ao comite | Notification | P |
| 1.9 | Manutencao em ate 12 meses apos Estagio 2 | Validacao + alerta automatico | Audit.completedDate | M |
| 1.10 | Suspensao automatica por descumprimento de prazo de manutencao | Cron job que suspende certificacoes vencidas | CertificationStatus.suspensa existe | M |

**Subtotal**: 8P + 2M = ~2 semanas

---

## BLOCO 2 - Nao Conformidades (Prioridade ALTA)

Infraestrutura existente: `ChecklistResponse` com `NC_MAIOR`, `NC_MENOR`, `OBS`. `PcchSeverity` enum. Workflow ja tem loop correcao<->validacao.

| # | Item | O que falta | Ja existe | Complexidade |
|---|------|-------------|-----------|-------------|
| 2.1 | Modelo `NonConformity` standalone | Novo modelo Prisma com severidade, prazo, status, evidencias | ChecklistResponse tem NC_MAIOR/MENOR/OBS | M |
| 2.2 | Classificacao NC Maior / Menor / Observacao | Enum + campos no novo modelo | PcchSeverity como referencia | P |
| 2.3 | Prazo de resposta (7 dias) | Campo `deadlineAt` no modelo + alerta | Notification | P |
| 2.4 | Upload de evidencias vinculado a NC | Relacao NC -> Document | Document model existe | P |
| 2.5 | Loop de rejeicao com comentarios | Campo `rejectionReason` + status `rejeitada` | Workflow ja tem loop | P |
| 2.6 | Frontend: tela de gestao de NCs | CRUD + filtros por severidade | - | M |

**Subtotal**: 4P + 2M = ~1.5 semana

---

## BLOCO 3 - Comite de Decisao (Prioridade ALTA)

Infraestrutura existente: `CommitteeReview` com `reviewType` (revisao_tecnica, revisao_religiosa_1/2, aprovacao_rt). `SgqAppointment` distingue `auditor_tecnico` vs `auditor_religioso`. Unanimidade ja implementada.

| # | Item | O que falta | Ja existe | Complexidade |
|---|------|-------------|-----------|-------------|
| 3.1 | Validar que membro do comite NAO participou da auditoria | Check `reviewerId` vs `Audit.auditorId` no `canFinalizeCommittee()` | CommitteeReview.reviewerId + Audit.auditorId | P |
| 3.2 | Validar composicao minima: 2 Sheikhs + 1 tecnico | Verificar `sgqAppointments` dos reviewers | AuditorCompetency.sgqAppointments | P |
| 3.3 | Loop de rejeicao volta ao 1o passo (nao cancela direto) | Alterar `rejectAtCommittee()` para reabrir processo | CommitteeService | M |

**Subtotal**: 2P + 1M = ~1 semana

---

## BLOCO 4 - Suspensao / Cancelamento / Termino (Prioridade ALTA)

Infraestrutura existente: `suspensionType` (normal/entressafra), `cancellationType` (pos_suspensao/distrato), `CertificationStatus.suspensa/cancelada`. Scheduler ja cancela apos prazo de suspensao.

| # | Item | O que falta | Ja existe | Complexidade |
|---|------|-------------|-----------|-------------|
| 4.1 | Fluxo Suspensao -> Cancelamento (cancelamento so apos suspensao, exceto distrato) | Validacao no servico de cancelamento | CancellationType.pos_suspensao / distrato | P |
| 4.2 | 7 motivos de suspensao catalogados | Enum ou tabela de motivos | suspensionReason (texto livre) | P |
| 4.3 | Notificacao formal ao suspender/cancelar | Notification para empresa + acreditadores | Notification model | P |
| 4.4 | Termino por decisao do cliente | Novo status ou CancellationType + endpoint | - | P |
| 4.5 | Reducao de escopo como tipo de processo | Novo `RequestType.reducao` com fases especificas | requiredPhasesByType | M |
| 4.6 | Frontend: telas de suspensao/cancelamento/termino | Acoes no painel do gestor | - | M |

**Subtotal**: 4P + 2M = ~1.5 semana

---

## BLOCO 5 - Auditoria (Prioridade MEDIA)

Infraestrutura existente: `Audit.location` (JSON com tipo presencial/remota), `isUnannounced`, `unannouncedWindowStart/End`. `AuditPlan` separa `leadAuditorId`, `technicalAuditorId`, `religiousAuditorId`. Validacao parcial de Gulf restrictions.

| # | Item | O que falta | Ja existe | Complexidade |
|---|------|-------------|-----------|-------------|
| 5.1 | Validacao presencial vs remoto por categoria | Logica em `canAdvancePhase()` fase estagio1 baseada em `gsoAuditMode`/`smiicAuditMode` | Validacao parcial ja existe | P |
| 5.2 | Intervalo maximo 6 meses entre Estagio 1 e 2 | Validacao ao agendar Estagio 2 | Audit.scheduledDate + completedDate | P |
| 5.3 | Proibicao de estagios sequenciais (relatorio + parecer antes do 2) | Validacao no `canAdvancePhase()` | - | P |
| 5.4 | Composicao minima da equipe (tecnico + sheikh) | Validacao ao criar AuditPlan | AuditPlan.technicalAuditorId + religiousAuditorId | P |
| 5.5 | Imparcialidade: auditor nao repetir 3+ anos consecutivos | Query historica de auditorias por auditor/empresa | Audit model | M |
| 5.6 | Auditoria nao anunciada (1x por ciclo de 3 anos) | Cron job + logica de janela de 15 dias | isUnannounced + windowStart/End existem | M |
| 5.7 | Duracao minima 1/3 (manutencao) e 2/3 (renovacao) | Validacao ao completar auditoria | auditDays por categoria no seed | P |
| 5.8 | Calculo automatico tempo de auditoria (FM 7.1.9) | Servico com formula baseada em categoria, funcionarios, turnos, APPCC | Campos existem na Company e IndustrialCategory | G |

**Subtotal**: 5P + 2M + 1G = ~2.5 semanas

---

## BLOCO 6 - Certificados e Reconhecimentos (Prioridade MEDIA)

Infraestrutura existente: `Certificate.templateType`, `marketVariant`, `countryVariant`. `CertificateTemplate` model com campos para variantes por mercado.

| # | Item | O que falta | Ja existe | Complexidade |
|---|------|-------------|-----------|-------------|
| 6.1 | 3 modelos de certificado (GAC/HAK/WHFC) | Templates PDF + logica de selecao por acreditador/norma | CertificateTemplate model + templateType | M |
| 6.2 | Certificado de embarque (por lote, frigorificos) | Novo tipo de certificado + endpoint | templateType pode ser "EMBARQUE" | M |
| 6.3 | Restauracao em ate 6 meses apos expiracao | Novo `RequestType.restauracao` | CertificationStatus.expirada | P |
| 6.4 | Data de expiracao baseada no ciclo anterior (renovacao) | Logica ao emitir certificado de renovacao | Certificate.expiresAt + cycleDate | P |

**Subtotal**: 2P + 2M = ~1.5 semana

---

## BLOCO 7 - Auditorias Especiais e Internacionais (Prioridade BAIXA)

| # | Item | O que falta | Ja existe | Complexidade |
|---|------|-------------|-----------|-------------|
| 7.1 | 4 tipos de auditoria especial | Novos enum values em AuditType + fluxo | AuditType.especial existe | M |
| 7.2 | Cadastros em sistemas internacionais (HAKSIS, SiHalal, MOIAT, SFDA) | Campos na Company + tracking de registro | - | M |
| 7.3 | Controle de imparcialidade (declaracao FM 4.2.3) | Campo boolean no AuditorCompetency + tracking | confidentialityAgreement existe | P |

**Subtotal**: 1P + 2M = ~1 semana

---

## Resumo Consolidado

| Bloco | Tema | Itens | Complexidade | Estimativa |
|-------|------|-------|-------------|------------|
| 1 | Controles de prazo e alertas | 10 | 8P + 2M | ~2 sem |
| 2 | Nao conformidades | 6 | 4P + 2M | ~1.5 sem |
| 3 | Comite de decisao | 3 | 2P + 1M | ~1 sem |
| 4 | Suspensao/Cancelamento/Termino | 6 | 4P + 2M | ~1.5 sem |
| 5 | Auditoria | 8 | 5P + 2M + 1G | ~2.5 sem |
| 6 | Certificados e reconhecimentos | 4 | 2P + 2M | ~1.5 sem |
| 7 | Auditorias especiais | 3 | 1P + 2M | ~1 sem |
| **Total** | | **40** | **26P + 13M + 1G** | **~11 sem** |

---

## Ordem de Execucao Sugerida

1. **Bloco 3** (Comite) - menor, alto impacto regulatorio
2. **Bloco 4** (Suspensao/Cancelamento) - obrigatorio pelo PR 7.1
3. **Bloco 2** (NCs) - base para auditorias funcionarem corretamente
4. **Bloco 1** (Prazos) - muitos itens pequenos, pode ser feito em paralelo
5. **Bloco 5** (Auditoria) - depende de NCs prontas
6. **Bloco 6** (Certificados) - depende de fluxos ajustados
7. **Bloco 7** (Especiais) - menor prioridade

---

## Dependencias entre Blocos

- Bloco 5 (Auditoria) depende de Bloco 2 (NCs) para validacoes de NC Maior/Menor
- Bloco 1 (Prazos) depende parcialmente de Bloco 4 (Suspensao) para item 1.10
- Bloco 6 (Certificados) depende de Bloco 5 (Auditoria) para calculo de tempo
- Blocos 3 e 4 sao independentes e podem ser feitos em paralelo
