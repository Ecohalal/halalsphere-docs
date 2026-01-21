# Backlog Complementar - Conformidade PR 7.1 Rev. 22

**Criado:** 2026-01-21
**Baseado em:**
- [ANALISE-CONFORMIDADE-PR71-REV22.md](./ANALISE-CONFORMIDADE-PR71-REV22.md)
- [ANALISE-FLUXOS-PROCESSO.md](./ANALISE-FLUXOS-PROCESSO.md)
- [ANALISE-LAYOUTS-CERTIFICADOS.md](./ANALISE-LAYOUTS-CERTIFICADOS.md)

**Status:** ✅ Fase A Concluída | ✅ Fase B Concluída | Fase C-E Pendente

---

## Legenda

- `[ ]` Pendente
- `[~]` Em andamento
- `[x]` Concluído
- `[-]` Cancelado/Bloqueado

**Prioridade:** 🔴 Crítica | 🟠 Alta | 🟡 Média | 🟢 Baixa

---

## ✅ Fase A: Validações de Compliance (CONCLUÍDA)

> **Concluída em:** 2026-01-21
> **Implementação:** halalsphere-backend-nest

### A.1 Validações de Prazos de Suspensão
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| A-001 | Adicionar campo `max_suspension_date` na entidade Certification | 🔴 | - | [x] |
| A-002 | Implementar cálculo de prazo máximo (3 meses normal / 1 ano entressafra) | 🔴 | - | [x] |
| A-003 | Adicionar campo `suspension_type` enum ('normal', 'entressafra') | 🔴 | - | [x] |
| A-004 | Criar job agendado para verificar certificações suspensas expiradas | 🔴 | - | [x] |
| A-005 | Implementar cancelamento automático após prazo de suspensão | 🔴 | - | [x] |
| A-006 | Criar testes unitários para validações de suspensão | 🟠 | - | [x] |

### A.2 Auditoria Não Anunciada
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| A-007 | Adicionar campo `is_unannounced` boolean na entidade Audit | 🔴 | - | [x] |
| A-008 | Validar que auditoria não anunciada não pode ser inicial ou renovação | 🔴 | - | [x] |
| A-009 | Implementar regra: 1 auditoria não anunciada obrigatória por ciclo (3 anos) | 🔴 | - | [x] |
| A-010 | Criar alerta para FAMBRAS quando ciclo não tiver auditoria não anunciada | 🟠 | - | [x] |
| A-011 | Adicionar campo `unannounced_window_start` e `unannounced_window_end` | 🟠 | - | [x] |

### A.3 Intervalo Estágio 1-2
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| A-012 | Validar intervalo máximo de 6 meses entre Estágio 1 e Estágio 2 | 🔴 | - | [x] |
| A-013 | Criar alerta quando intervalo ultrapassar 5 meses | 🟠 | - | [x] |
| A-014 | Implementar regra: se > 6 meses, repetir Estágio 1 | 🔴 | - | [x] |

### A.4 Alertas de Vencimento
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| A-015 | Adicionar alerta de 180 dias (6 meses) para manutenção/renovação | 🔴 | - | [x] |
| A-016 | Atualizar constante ALERT_DAYS = [180, 90, 60, 30] | 🔴 | - | [x] |
| A-017 | Criar template de notificação para alerta de 6 meses | 🟠 | - | [x] |

### Arquivos Implementados (Fase A)

**Schema Prisma:**
- `prisma/schema.prisma` - Adicionados campos: SuspensionType enum, suspensionType, suspendedAt, maxSuspensionDate, suspensionReason (Certification); isUnannounced, unannouncedWindowStart, unannouncedWindowEnd (Audit)

**Services:**
- `src/certification/certification.service.ts` - Métodos: calculateMaxSuspensionDate, suspendCertification, reactivateCertification, getExpiredSuspensions, cancelAfterSuspensionExpiry, processExpiredSuspensions, getSuspensionStatus
- `src/audit/audit.service.ts` - Métodos: validateUnannouncedAudit, hasUnannouncedAuditInCycle, getCertificationsMissingUnannouncedAudit, getUnannouncedAuditStatus, validateStage1To2Interval, getCertificationsWithStageIntervalIssues, getStageIntervalStatus

**Scheduler:**
- `src/scheduler/scheduler.module.ts` - Módulo de tarefas agendadas
- `src/scheduler/certification-scheduler.service.ts` - Jobs: handleExpiredSuspensions (1AM), handleStatusRecalculation (2AM), handleExpirationAlerts 180/90/60/30 dias, handleUnannouncedAuditAlerts, handleStageIntervalAlerts

**DTOs:**
- `src/certification/dto/suspend-certification.dto.ts` - DTO para suspensão
- `src/audit/dto/create-audit.dto.ts` - Adicionados campos de auditoria não anunciada

**Notificações:**
- `src/notification/notification.types.ts` - Tipos de notificação
- `src/notification/templates/certification-expiring.template.ts` - Templates 180/90/60/30 dias
- `src/notification/templates/suspension.template.ts` - Templates de suspensão
- `src/notification/templates/audit-compliance.template.ts` - Templates de auditoria

**Testes:**
- `src/certification/certification.service.spec.ts` - 22 testes de suspensão adicionados

---

## ✅ Fase B: Saídas de Rejeição do Comitê (CONCLUÍDA)

> **Concluída em:** 2026-01-21
> **Implementação:** halalsphere-backend-nest

### B.1 Tratamento por Tipo de Request
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| B-001 | Adicionar status `recusada` no enum CertificationStatus | 🟠 | - | [x] |
| B-002 | Implementar `rejectAtCommittee()` no WorkflowService | 🟠 | - | [x] |
| B-003 | Nova Certificação: se rejeitada → status `recusada` | 🟠 | - | [x] |
| B-004 | Manutenção: se rejeitada → status `suspensa` com motivo | 🟠 | - | [x] |
| B-005 | Renovação: se rejeitada → não emite novo certificado, expira normalmente | 🟠 | - | [x] |
| B-006 | Registrar decisão no certification_history | 🟠 | - | [x] |
| B-007 | Notificar empresa sobre rejeição com motivo | 🟠 | - | [x] |

### B.2 Regra Suspensão Prévia ao Cancelamento
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| B-008 | Validar que cancelamento só pode ocorrer após suspensão | 🟠 | - | [x] |
| B-009 | Exceção: permitir cancelamento direto em caso de distrato | 🟠 | - | [x] |
| B-010 | Adicionar campo `cancellation_type` enum ('pos_suspensao', 'distrato') | 🟠 | - | [x] |

### Arquivos Implementados (Fase B)

**Schema Prisma:**
- `prisma/schema.prisma` - Adicionados: CertificationStatus.recusada, CancellationType enum, campos cancellationType, cancelledAt, cancellationReason, rejectedAt, rejectionReason

**Services:**
- `src/workflow/workflow.service.ts` - Métodos: rejectAtCommittee(), cancelCertification(), getRejectionOutcomeDescription()

**DTOs:**
- `src/workflow/dto/reject-at-committee.dto.ts` - DTO para rejeição no comitê
- `src/workflow/dto/cancel-certification.dto.ts` - DTO para cancelamento

**Controller:**
- `src/workflow/workflow.controller.ts` - Endpoints: POST :id/reject, GET :id/rejection-outcome, POST certifications/:id/cancel

**Notificações:**
- `src/notification/templates/rejection.template.ts` - Templates: CERTIFICATION_REJECTED, MAINTENANCE_REJECTED_SUSPENDED, RENEWAL_REJECTED_EXPIRATION, CERTIFICATION_CANCELLED

**Testes:**
- `src/workflow/workflow.service.spec.ts` - 15 testes de rejeição e cancelamento adicionados

---

## Fase C: Auditorias - Melhorias (Média Prioridade)

### C.1 Modalidade de Auditoria
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| C-001 | Adicionar campo `is_remote` boolean na entidade Audit | 🟡 | - | [ ] |
| C-002 | Implementar validação: Estágio 1 remoto só para categorias A,B,F,G,H,J | 🟡 | - | [ ] |
| C-003 | Implementar validação: Estágio 2 sempre presencial | 🟡 | - | [ ] |
| C-004 | Adicionar categorias permitidas para auditoria remota na configuração | 🟡 | - | [ ] |

### C.2 Cálculo de Tempo de Auditoria
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| C-005 | Criar service `AuditDurationCalculatorService` | 🟡 | - | [ ] |
| C-006 | Implementar fórmula GSO 2055-2 (Anexo B) | 🟡 | - | [ ] |
| C-007 | Implementar fórmula SMIIC 02 (Anexo B) | 🟡 | - | [ ] |
| C-008 | Adicionar campos de entrada: categoria, funcionários, APPCC, turnos | 🟡 | - | [ ] |
| C-009 | Implementar redução de até 30% (IAF MD 5:2015) com justificativa | 🟡 | - | [ ] |
| C-010 | Exibir cálculo de homens-dia na proposta comercial | 🟡 | - | [ ] |

### C.3 Amostras Laboratoriais
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| C-011 | Adicionar campo `requires_lab_samples` boolean na entidade Audit | 🟡 | - | [ ] |
| C-012 | Adicionar enum `lab_sample_status` (collected, sent, result_received, approved, rejected) | 🟡 | - | [ ] |
| C-013 | Adicionar campo `lab_report_url` string | 🟡 | - | [ ] |
| C-014 | Adicionar campo `lab_result_date` date | 🟡 | - | [ ] |
| C-015 | Validar que decisão do comitê aguarda resultado de laboratório (se aplicável) | 🟡 | - | [ ] |

### C.4 Prazos de Relatório
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| C-016 | Adicionar alerta quando relatório não enviado em 15 dias | 🟡 | - | [ ] |
| C-017 | Adicionar campo `report_sent_at` date na entidade Audit | 🟡 | - | [ ] |
| C-018 | Dashboard: indicador de relatórios pendentes | 🟢 | - | [ ] |

### C.5 Equipe de Auditoria
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| C-019 | Adicionar relacionamento N:N entre Audit e Users (equipe) | 🟡 | - | [ ] |
| C-020 | Adicionar campo `role_in_audit` (lider, tecnico, religioso, observador) | 🟡 | - | [ ] |
| C-021 | Validar composição mínima: 1 técnico + 1 religioso | 🟡 | - | [ ] |
| C-022 | Alerta: evitar mesmo auditor por mais de 3 anos consecutivos | 🟢 | - | [ ] |

---

## Fase D: Geração de Certificados PDF (Média Prioridade)

### D.1 Novos Campos no Banco
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-001 | Adicionar campo `sif` string na entidade Company | 🟡 | - | [ ] |
| D-002 | Adicionar campo `first_certified_date` date na entidade Company | 🟡 | - | [ ] |
| D-003 | Adicionar campo `packing_size` string na entidade ScopeProduct | 🟡 | - | [ ] |
| D-004 | Adicionar campo `certificate_type` enum na entidade Certificate | 🟡 | - | [ ] |
| D-005 | Adicionar campo `accreditation` enum (GAC, HAK, WHFC, none) na entidade Certificate | 🟡 | - | [ ] |
| D-006 | Adicionar campo `requirements_dt` string[] na entidade Certification | 🟡 | - | [ ] |

### D.2 Configuração de Certificados
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-007 | Criar tabela `certificate_config` para configurações globais | 🟡 | - | [ ] |
| D-008 | Campos: authorized_representative_name, title, signature_image_url | 🟡 | - | [ ] |
| D-009 | Campos: fambras_logo_url, gac_logo_url, hak_logo_url, whfc_logo_url | 🟡 | - | [ ] |
| D-010 | Campo: verification_base_url para QR Code | 🟡 | - | [ ] |
| D-011 | Criar CRUD de configuração no admin | 🟡 | - | [ ] |

### D.3 Serviço de Geração de PDF
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-012 | Criar `CertificatePdfService` | 🟡 | - | [ ] |
| D-013 | Instalar e configurar biblioteca PDF (puppeteer, pdfkit, ou similar) | 🟡 | - | [ ] |
| D-014 | Criar template HTML/CSS para FM 7.7.2 (Certificado Único) | 🟡 | - | [ ] |
| D-015 | Criar template HTML/CSS para FM 7.7.1 (Aprovação de Planta) | 🟡 | - | [ ] |
| D-016 | Implementar paginação automática para lista de produtos | 🟡 | - | [ ] |
| D-017 | Implementar geração de QR Code | 🟡 | - | [ ] |
| D-018 | Implementar seleção automática de template por categoria | 🟡 | - | [ ] |
| D-019 | Criar endpoint `GET /certificates/:id/pdf` | 🟡 | - | [ ] |
| D-020 | Criar endpoint `GET /certificates/:id/preview` (HTML) | 🟢 | - | [ ] |

### D.4 Frontend - Visualização e Download
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-021 | Criar componente `CertificatePreview` | 🟡 | - | [ ] |
| D-022 | Criar botão de download de PDF | 🟡 | - | [ ] |
| D-023 | Integrar preview na tela de emissão de certificado | 🟡 | - | [ ] |
| D-024 | Adicionar seleção de acreditação (GAC/HAK/WHFC) na emissão | 🟡 | - | [ ] |

### D.5 Mapeamento DT por Categoria
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-025 | Criar mapeamento categoria → DTs aplicáveis | 🟡 | - | [ ] |
| D-026 | Implementar derivação automática de DTs no certificado | 🟡 | - | [ ] |

---

## Fase E: Módulos Complementares (Baixa Prioridade - Roadmap Futuro)

### E.1 Reclamações e Apelações (PR 7.13)
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| E-001 | Criar entidade `Complaint` | 🟢 | - | [ ] |
| E-002 | Criar entidade `Appeal` | 🟢 | - | [ ] |
| E-003 | Implementar workflow de reclamação | 🟢 | - | [ ] |
| E-004 | Implementar workflow de apelação contra decisões | 🟢 | - | [ ] |
| E-005 | Criar tela de gestão de reclamações | 🟢 | - | [ ] |
| E-006 | Criar tela de gestão de apelações | 🟢 | - | [ ] |

### E.2 Eventos Extraordinários (PR 9.1)
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| E-007 | Criar entidade `ExtraordinaryEvent` | 🟢 | - | [ ] |
| E-008 | Tipos: pandemia, guerra, desastre_natural, falencia, etc. | 🟢 | - | [ ] |
| E-009 | Implementar extensão de prazos durante eventos | 🟢 | - | [ ] |
| E-010 | Implementar permissão de auditoria remota extraordinária | 🟢 | - | [ ] |
| E-011 | Criar tela de gestão de eventos extraordinários | 🟢 | - | [ ] |

### E.3 Recolhimento de Produtos (Recall)
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| E-012 | Criar entidade `ProductRecall` | 🟢 | - | [ ] |
| E-013 | Campos: motivo, lotes, risco_saude, medidas_adotadas | 🟢 | - | [ ] |
| E-014 | Implementar notificação em 48h para FAMBRAS | 🟢 | - | [ ] |
| E-015 | Implementar rastreabilidade de lotes | 🟢 | - | [ ] |
| E-016 | Criar tela de registro de recall | 🟢 | - | [ ] |
| E-017 | Dashboard: recalls ativos | 🟢 | - | [ ] |

### E.4 Integrações Externas
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| E-018 | Pesquisar API HAKSIS (Turquia) | 🟢 | - | [ ] |
| E-019 | Pesquisar API SiHalal (Indonésia) | 🟢 | - | [ ] |
| E-020 | Pesquisar API MOIAT (Emirados Árabes) | 🟢 | - | [ ] |
| E-021 | Implementar integração HAKSIS para certificados SMIIC | 🟢 | - | [ ] |
| E-022 | Implementar integração SiHalal para certificados Indonésia | 🟢 | - | [ ] |
| E-023 | Implementar integração MOIAT para certificados UAE | 🟢 | - | [ ] |

---

## Resumo por Fase

| Fase | Total Tasks | Críticas | Estimativa |
|------|-------------|----------|------------|
| A. Validações de Compliance | 17 | 14 | 1-2 semanas |
| B. Saídas de Rejeição | 10 | 0 | 1 semana |
| C. Auditorias - Melhorias | 22 | 0 | 2-3 semanas |
| D. Geração de Certificados PDF | 26 | 0 | 2-3 semanas |
| E. Módulos Complementares | 23 | 0 | 4-6 semanas |
| **TOTAL** | **98** | **14** | **10-15 semanas** |

---

## Dependências

```
BACKLOG-MIGRACAO-CERTIFICACOES.md (Fases 1-5) ✅ Concluído
        │
        ▼
BACKLOG-GRUPOS-EMPRESARIAIS.md (Fases 1-8) ◄── NOVO - Próximo passo
        │
        ▼
BACKLOG-MIGRACAO-CERTIFICACOES.md (Fases 6-7) - Testes e Deploy
        │
        ▼
┌───────────────────────────────────┐
│  Fase A: Validações de Compliance │  ✅ Concluída
└───────────────┬───────────────────┘
                │
                ▼
┌───────────────────────────────────┐
│  Fase B: Saídas de Rejeição       │  ✅ Concluída
└───────────────┬───────────────────┘
                │
        ┌───────┴───────┐
        ▼               ▼
┌───────────────┐ ┌───────────────┐
│ Fase C:       │ │ Fase D:       │  ◄── Podem rodar em paralelo
│ Auditorias    │ │ Certificados  │
└───────┬───────┘ └───────┬───────┘
        │                 │
        └────────┬────────┘
                 ▼
┌───────────────────────────────────┐
│  Fase E: Módulos Complementares   │  ◄── Roadmap futuro
└───────────────────────────────────┘
```

---

## Critérios de Aceite

### ✅ Fase A (Compliance) - CONCLUÍDA
- [x] Todas as validações de prazo funcionando
- [x] Auditoria não anunciada obrigatória por ciclo
- [x] Alertas de 6 meses enviados corretamente
- [x] Testes automatizados passando (22 testes de suspensão)

### ✅ Fase B (Rejeição) - CONCLUÍDA
- [x] Cada tipo de request tem tratamento correto de rejeição
- [x] Histórico registra decisões negativas
- [x] Notificações enviadas à empresa
- [x] Testes automatizados passando (15 testes de rejeição/cancelamento)

### Fase C (Auditorias)
- [ ] Cálculo de tempo de auditoria funcionando
- [ ] Rastreamento de amostras laboratoriais
- [ ] Composição de equipe validada

### Fase D (Certificados)
- [ ] PDF gerado idêntico aos exemplos FAMBRAS
- [ ] QR Code funcionando para verificação
- [ ] Paginação automática de produtos

### Fase E (Complementares)
- [ ] Módulos funcionais e integrados ao sistema principal

---

## Próximos Passos

1. ~~**Concluir Fase 6-7** do BACKLOG-MIGRACAO-CERTIFICACOES.md (Testes e Deploy)~~ ✅
2. ~~**Iniciar Fase A** deste backlog (Validações de Compliance)~~ ✅
3. ~~**Fase B: Saídas de Rejeição do Comitê**~~ ✅
4. **Iniciar Fase C** (Auditorias - Melhorias) ou **Fase D** (Geração de Certificados PDF) - podem rodar em paralelo
5. **Priorizar Fase D** se geração de certificados for requisito de negócio imediato

---

*Backlog criado em 2026-01-21*
*Última atualização: 2026-01-21 (Fase A e B concluídas)*
