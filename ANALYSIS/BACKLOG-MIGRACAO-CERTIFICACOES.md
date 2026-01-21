# Backlog de Migração - Reestruturação de Certificações

**Criado:** 2026-01-20
**Baseado em:** [ANALISE-ESTRUTURA-BD-FLUXOS.md](./ANALISE-ESTRUTURA-BD-FLUXOS.md)
**Status:** Em andamento

---

## Legenda

- `[ ]` Pendente
- `[~]` Em andamento
- `[x]` Concluído
- `[-]` Cancelado/Bloqueado

**Prioridade:** 🔴 Crítica | 🟠 Alta | 🟡 Média | 🟢 Baixa

---

## Fase 1: Preparação (Semana 1)

### 1.1 Infraestrutura e Backup
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| P-001 | Backup completo do banco de dados de produção | 🔴 | - | [ ] |
| P-002 | Criar branch `feature/certification-restructure` no backend-nest | 🔴 | - | [x] ✓ 2026-01-20 |
| P-003 | Criar branch `feature/certification-restructure` no frontend | 🔴 | - | [x] ✓ 2026-01-20 |
| P-004 | Documentar estado atual de todas as tabelas afetadas | 🟠 | - | [ ] |
| P-005 | Criar scripts de rollback para cada migration | 🟠 | - | [ ] |

### 1.2 Revisão e Alinhamento
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| P-006 | Revisar análise com equipe técnica | 🔴 | - | [x] |
| P-007 | Aprovar abordagem com stakeholders | 🔴 | - | [x] |
| P-008 | Definir responsáveis para cada fase | 🟠 | - | [ ] |

---

## Fase 2: Criação de Novas Tabelas (Semana 2)

### 2.1 Migrations de Estrutura
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| M-001 | Criar enum `CertificationStatus` | 🔴 | - | [x] ✓ 2026-01-20 |
| M-002 | Criar enum `ScopeItemStatus` | 🔴 | - | [x] ✓ 2026-01-20 |
| M-003 | Criar enum `WorkflowStatus` | 🔴 | - | [x] ✓ 2026-01-20 |
| M-004 | Criar enum `AuditType` (expandido) | 🟠 | - | [x] ✓ 2026-01-20 |
| M-005 | Criar tabela `certifications` | 🔴 | - | [x] ✓ 2026-01-20 |
| M-006 | Criar tabela `certification_scopes` | 🔴 | - | [x] ✓ 2026-01-20 |
| M-007 | Criar tabela `scope_products` | 🔴 | - | [x] ✓ 2026-01-20 |
| M-008 | Criar tabela `scope_facilities` | 🔴 | - | [x] ✓ 2026-01-20 |
| M-009 | Criar tabela `scope_brands` | 🟠 | - | [x] ✓ 2026-01-20 |
| M-010 | Criar tabela `scope_suppliers` | 🟠 | - | [x] ✓ 2026-01-20 |
| M-011 | Criar tabela `certification_history` | 🟠 | - | [x] ✓ 2026-01-20 |
| M-012 | Criar índices de performance | 🟡 | - | [x] ✓ 2026-01-20 |
| M-013 | Testar migrations em ambiente de desenvolvimento | 🔴 | - | [x] ✓ 2026-01-20 |

---

## Fase 3: Migração de Dados (Semanas 3-4)

### 3.1 Scripts de Migração
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-001 | Script: criar `certifications` a partir de `requests` + `processes` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-002 | Script: criar mapeamento `request_id` → `certification_id` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-003 | Script: migrar dados de escopo para `certification_scopes` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-004 | Script: migrar instalações para `scope_facilities` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-005 | Script: migrar produtos para `scope_products` (se existir) | 🟠 | - | [x] ✓ 2026-01-20 |

### 3.2 Alteração de Tabelas Existentes
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-006 | Adicionar `certification_id` em `documents` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-007 | Adicionar `certification_id` em `proposals` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-008 | Adicionar `certification_id` em `contracts` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-009 | Adicionar `certification_id` e `auditor_id` em `audits` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-010 | Adicionar `certification_id`, `issued_by`, `version` em `certificates` | 🔴 | - | [x] ✓ 2026-01-20 |
| D-011 | Adicionar `valid_until` em `documents` | 🟠 | - | [x] ✓ 2026-01-20 |

### 3.3 População de Dados
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-012 | Popular `certification_id` em `documents` existentes | 🔴 | - | [x] ✓ 2026-01-20 (incluído em D-002) |
| D-013 | Popular `certification_id` em `proposals` existentes | 🔴 | - | [x] ✓ 2026-01-20 (incluído em D-002) |
| D-014 | Popular `certification_id` em `contracts` existentes | 🔴 | - | [x] ✓ 2026-01-20 (incluído em D-002) |
| D-015 | Popular `certification_id` em `audits` existentes | 🔴 | - | [x] ✓ 2026-01-20 (incluído em D-002) |
| D-016 | Popular `certification_id` em `certificates` existentes | 🔴 | - | [x] ✓ 2026-01-20 (incluído em D-002) |

### 3.4 Validação
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| D-017 | Validar integridade de FKs após migração | 🔴 | - | [x] ✓ 2026-01-20 |
| D-018 | Validar contagem de registros (antes vs depois) | 🔴 | - | [x] ✓ 2026-01-20 |
| D-019 | Testar queries de consulta principais | 🟠 | - | [x] ✓ 2026-01-20 |

---

## Fase 4: Atualização do Backend NestJS (Semanas 5-6)

### 4.1 Novos Módulos
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| B-001 | Criar `CertificationModule` - Entity | 🔴 | - | [x] ✓ 2026-01-20 |
| B-002 | Criar `CertificationModule` - DTO | 🔴 | - | [x] ✓ 2026-01-20 |
| B-003 | Criar `CertificationModule` - Service | 🔴 | - | [x] ✓ 2026-01-20 |
| B-004 | Criar `CertificationModule` - Controller | 🔴 | - | [x] ✓ 2026-01-20 |
| B-005 | Criar `CertificationScopeModule` - Entity | 🔴 | - | [x] ✓ 2026-01-20 |
| B-006 | Criar `CertificationScopeModule` - Service | 🔴 | - | [x] ✓ 2026-01-20 |
| B-007 | Criar `CertificationScopeModule` - Controller | 🔴 | - | [x] ✓ 2026-01-20 |
| B-008 | Criar `ScopeProductsModule` | 🟠 | - | [x] ✓ 2026-01-20 |
| B-009 | Criar `ScopeFacilitiesModule` | 🟠 | - | [x] ✓ 2026-01-20 |
| B-010 | Criar `ScopeBrandsModule` | 🟡 | - | [x] ✓ 2026-01-20 |
| B-011 | Criar `ScopeSuppliersModule` | 🟡 | - | [x] ✓ 2026-01-20 |
| B-012 | Criar `CertificationHistoryModule` - Entity | 🟠 | - | [x] ✓ 2026-01-20 (integrado no CertificationModule) |
| B-013 | Criar `CertificationHistoryModule` - Service | 🟠 | - | [x] ✓ 2026-01-20 (método recordHistory no CertificationService) |
| B-014 | Criar `CertificationHistoryModule` - Controller (timeline) | 🟠 | - | [x] ✓ 2026-01-20 (endpoint GET /certifications/:id/timeline) |

### 4.2 Refatoração de Módulos Existentes
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| B-015 | Renomear/Refatorar `RequestModule` → `CertificationRequestModule` | 🔴 | - | [x] ✓ 2026-01-20 (novo módulo criado, antigo mantido para compatibilidade) |
| B-016 | Renomear/Refatorar `ProcessModule` → `WorkflowModule` | 🔴 | - | [x] ✓ 2026-01-20 (novo WorkflowModule criado para RequestWorkflow, ProcessModule mantido para compatibilidade) |
| B-017 | Atualizar `DocumentModule` - adicionar `certificationId` | 🟠 | - | [x] ✓ 2026-01-20 (DTO, Service, Controller atualizados) |
| B-018 | Atualizar `ProposalModule` - adicionar `certificationId` | 🟠 | - | [x] ✓ 2026-01-20 (DTO, Service atualizados) |
| B-019 | Atualizar `ContractModule` - adicionar `certificationId` | 🟠 | - | [x] ✓ 2026-01-20 (DTO, Service atualizados) |
| B-020 | Atualizar `AuditModule` - adicionar `certificationId`, `auditorId` | 🟠 | - | [x] ✓ 2026-01-20 (DTO, Service, Controller atualizados + endpoint /certification/:id) |
| B-021 | Atualizar `CertificateModule` - adicionar `certificationId`, `issuedBy`, `version` | 🟠 | - | [x] ✓ 2026-01-20 (módulo criado do zero: DTO, Service, Controller com todos os campos) |

### 4.3 Novos Endpoints
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| B-022 | `GET /certifications` - listar certificações | 🔴 | - | [x] ✓ 2026-01-20 |
| B-023 | `GET /certifications/:id` - detalhes da certificação | 🔴 | - | [x] ✓ 2026-01-20 |
| B-024 | `GET /certifications/:id/scope` - escopo da certificação | 🔴 | - | [x] ✓ 2026-01-20 |
| B-025 | `GET /certifications/:id/timeline` - histórico/timeline | 🟠 | - | [x] ✓ 2026-01-20 |
| B-026 | `POST /certifications/:id/requests` - nova solicitação (renovação/ajuste) | 🟠 | - | [x] ✓ 2026-01-20 (POST /certification-requests) |
| B-027 | `PUT /certifications/:id/scope` - atualizar escopo | 🟠 | - | [x] ✓ 2026-01-20 |
| B-028 | Atualizar documentação Swagger/OpenAPI | 🟡 | - | [x] ✓ 2026-01-20 |

### 4.4 Lógica de Negócio
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| B-029 | Implementar lógica de fluxo diferenciado por `request_type` | 🔴 | - | [x] ✓ 2026-01-20 |
| B-030 | Implementar geração automática de `certification_number` | 🟠 | - | [x] ✓ 2026-01-20 (formato HS-YYYY-NNNNN) |
| B-031 | Implementar cálculo de `status` baseado em regras de negócio | 🟠 | - | [x] ✓ 2026-01-20 |
| B-032 | Implementar registro automático em `certification_history` | 🟠 | - | [x] ✓ 2026-01-20 (recordHistory em create/update/assignAnalyst) |

---

## Fase 5: Atualização do Frontend (Semanas 7-8)

### 5.1 Novo Wizard de Solicitação
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| F-001 | Wizard: Etapa de seleção de tipo (Nova/Renovação/Ajuste) | 🔴 | - | [x] ✓ 2026-01-20 |
| F-002 | Wizard: Fluxo completo Nova Certificação (9 etapas) | 🔴 | - | [x] ✓ 2026-01-20 |
| F-003 | Wizard: Fluxo simplificado Renovação (6 etapas com pré-preenchimento) | 🔴 | - | [x] ✓ 2026-01-20 |
| F-004 | Wizard: Fluxo mínimo Manutenção/Ajuste (4 etapas) | 🟠 | - | [x] ✓ 2026-01-20 |
| F-005 | Implementar lógica de pré-preenchimento para renovação | 🔴 | - | [x] ✓ 2026-01-20 |

### 5.2 Novas Telas
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| F-006 | Tela: Detalhes da Certificação (visão unificada) | 🔴 | - | [x] ✓ 2026-01-20 |
| F-007 | Tela: Gestão de Escopo (produtos, instalações, marcas) | 🟠 | - | [x] ✓ 2026-01-20 |
| F-008 | Componente: Timeline unificada da certificação | 🟠 | - | [x] ✓ 2026-01-21 |
| F-009 | Tela: Lista de Certificações (substituir lista de requests) | 🔴 | - | [x] ✓ 2026-01-20 |

### 5.3 Atualização de Telas Existentes
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| F-010 | Atualizar Dashboard da Empresa - mostrar certificações | 🔴 | - | [x] ✓ 2026-01-21 |
| F-011 | Atualizar tela de listagem de processos | 🟠 | - | [x] ✓ 2026-01-21 |
| F-012 | Atualizar componente de upload de documentos | 🟡 | - | [x] ✓ 2026-01-21 |
| F-013 | Atualizar telas de auditoria | 🟡 | - | [x] ✓ 2026-01-21 |
| F-014 | Atualizar tela de emissão de certificado | 🟡 | - | [x] ✓ 2026-01-21 |

### 5.4 Integração com API
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| F-015 | Criar services para novos endpoints de certificação | 🔴 | - | [x] ✓ 2026-01-20 |
| F-016 | Atualizar types/interfaces TypeScript | 🔴 | - | [x] ✓ 2026-01-20 |
| F-017 | Atualizar stores/state management | 🟠 | - | [x] ✓ 2026-01-21 |

---

## Fase 6: Testes e Validação (Semana 9)

### 6.1 Testes Backend
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| T-001 | Testes unitários: CertificationModule | 🔴 | - | [ ] |
| T-002 | Testes unitários: ScopeModule | 🟠 | - | [ ] |
| T-003 | Testes unitários: CertificationHistoryModule | 🟠 | - | [ ] |
| T-004 | Testes de integração: fluxo Nova Certificação | 🔴 | - | [ ] |
| T-005 | Testes de integração: fluxo Renovação | 🔴 | - | [ ] |
| T-006 | Testes de integração: fluxo Manutenção | 🟠 | - | [ ] |

### 6.2 Testes Frontend
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| T-007 | Testes E2E: Wizard Nova Certificação | 🔴 | - | [ ] |
| T-008 | Testes E2E: Wizard Renovação | 🔴 | - | [ ] |
| T-009 | Testes E2E: Wizard Manutenção | 🟠 | - | [ ] |
| T-010 | Testes E2E: Visualização de Certificação | 🟠 | - | [ ] |

### 6.3 Validação
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| T-011 | Testes de regressão em funcionalidades existentes | 🔴 | - | [ ] |
| T-012 | Validação com usuários piloto | 🟠 | - | [ ] |
| T-013 | Documentar e corrigir bugs encontrados | 🔴 | - | [ ] |

---

## Fase 7: Deploy e Limpeza (Semana 10)

### 7.1 Deploy
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| DP-001 | Deploy em ambiente de staging | 🔴 | - | [ ] |
| DP-002 | Validação final com stakeholders em staging | 🔴 | - | [ ] |
| DP-003 | Criar plano de deploy para produção | 🔴 | - | [ ] |
| DP-004 | Executar deploy em produção | 🔴 | - | [ ] |
| DP-005 | Monitoramento pós-deploy (24-48h) | 🔴 | - | [ ] |

### 7.2 Limpeza e Finalização
| ID | Task | Prioridade | Responsável | Status |
|----|------|------------|-------------|--------|
| DP-006 | Remover colunas obsoletas (após estabilização) | 🟡 | - | [ ] |
| DP-007 | Atualizar documentação técnica final | 🟠 | - | [ ] |
| DP-008 | Criar guia de uso para novos fluxos | 🟠 | - | [ ] |
| DP-009 | Retrospectiva e lições aprendidas | 🟡 | - | [ ] |
| DP-010 | Merge das branches para main | 🔴 | - | [ ] |

---

## Resumo por Fase

| Fase | Total Tasks | Críticas | Status |
|------|-------------|----------|--------|
| 1. Preparação | 8 | 4 | 4/8 concluídas |
| 2. Novas Tabelas | 13 | 6 | 13/13 concluídas ✓ |
| 3. Migração de Dados | 19 | 14 | 19/19 concluídas ✓ |
| 4. Backend NestJS | 32 | 12 | 32/32 concluídas ✓ |
| 5. Frontend | 17 | 8 | 17/17 concluídas ✓ |
| 6. Testes | 13 | 6 | 0/13 |
| 7. Deploy | 10 | 5 | 0/10 |
| **TOTAL** | **112** | **55** | **85/112 (76%)** |

---

## Próximo Passo

**Ação imediata:** Implementar componentes do Frontend

1. ~~**Fase 1**: Preparação~~ ✓ (4/8)
2. ~~**Fase 2**: Novas Tabelas~~ ✓ (13/13)
3. ~~**B-001 a B-004**: CertificationModule~~ ✓
4. ~~**B-005 a B-011**: CertificationScopeModule (produtos, instalações, marcas, fornecedores)~~ ✓
5. ~~**B-012 a B-014**: CertificationHistoryModule~~ ✓ (integrado no CertificationService)
6. ~~**B-015**: CertificationRequestModule~~ ✓ (novo módulo criado)
7. ~~**D-006 a D-011**: Adicionar certificationId em tabelas existentes~~ ✓ (schema atualizado)
8. ~~**B-017 a B-020**: Atualizar DTOs e Services dos módulos existentes~~ ✓
   - DocumentModule: DTO + Service + Controller (endpoint /certification/:id)
   - ProposalModule: DTO + Service
   - ContractModule: DTO + Service
   - AuditModule: DTO + Service + Controller (endpoint /certification/:id)
9. ~~**B-021**: Criar CertificateModule~~ ✓ 2026-01-20
   - DTO: CreateCertificateDto, UpdateCertificateDto, CertificateFilterDto
   - Service: create, findOne, findByNumber, findAll, findByCertificationId, update, suspend, reactivate, cancel, getStatistics, getExpiringSoon, verify
   - Controller: 12 endpoints incluindo verificação pública
10. ~~**B-016**: Criar WorkflowModule~~ ✓ 2026-01-20
    - DTO: UpdateWorkflowDto, AssignAnalystToWorkflowDto, AssignAuditorToWorkflowDto, AdvancePhaseDto
    - Service: findOne, findByRequestId, findAll, update, assignAnalyst, assignAuditor, advancePhase, getStatistics
    - Controller: 9 endpoints para gestão de workflows
    - Validação de transições de fase e roles permitidas
11. ~~**D-001 a D-005**: Scripts de migração de dados~~ ✓ 2026-01-20
    - D-001: create-certifications.ts - Cria Certifications a partir de Requests + Processes
    - D-002: update-certification-ids.ts - Atualiza certification_id em documents, proposals, contracts, audits, certificates
    - D-003: migrate-scope-data.ts - Migra dados de escopo (description, productionCapacity, etc.)
    - D-004: migrate-facilities.ts - Migra instalações para ScopeFacility
    - D-005: migrate-products.ts - Migra produtos para ScopeProduct
    - run-all-migrations.ts - Script mestre para executar todas as migrações
    - README.md com documentação
12. ~~**B-027**: PUT /certifications/:id/scope - atualizar escopo~~ ✓ 2026-01-20
13. ~~**B-029**: Implementar lógica de fluxo diferenciado por request_type~~ ✓ 2026-01-20
    - Definição de fases requeridas por tipo de request (nova, renovacao, ampliacao, manutencao, adequacao)
    - Transições de fase dinâmicas baseadas no tipo
    - Endpoint GET /workflows/flow/:requestType para consulta de fluxos
    - Cálculo de progresso do workflow
14. ~~**B-031**: Implementar cálculo de status baseado em regras de negócio~~ ✓ 2026-01-20
    - calculateStatus: regras de negócio para determinar status
    - recalculateStatus: recalcula e atualiza com registro em history
    - batchRecalculateStatus: recálculo em lote (para jobs agendados)
    - getStatusDetails: detalhes completos do cálculo de status
    - Endpoints: GET /:id/status-details, PATCH /:id/recalculate-status, PATCH /batch-recalculate-status
15. ~~**D-017 a D-019**: Validação pós-migração~~ ✓ 2026-01-20
    - D-017-validate-certifications.ts - Valida integridade das Certifications
    - D-018-validate-references.ts - Valida referências certification_id em todas tabelas
    - D-019-generate-report.ts - Gera relatório completo da migração (JSON e TXT)
    - run-all-migrations.ts atualizado com fase de validação
16. ~~**B-028**: Atualizar documentação Swagger/OpenAPI~~ ✓ 2026-01-20
    - Todos os novos controllers já possuem @ApiTags, @ApiOperation, @ApiResponse
    - Todos os DTOs já possuem @ApiProperty e @ApiPropertyOptional
    - Endpoints autenticados com @ApiBearerAuth
17. ~~**Documentação Frontend**~~ ✓ 2026-01-20
    - `FRONTEND/types/certification.types.ts` - Interfaces TypeScript completas
    - `FRONTEND/api/certification.api.ts` - Serviços de API prontos para uso
    - `FRONTEND/GUIA-INTEGRACAO-FRONTEND.md` - Guia completo de integração
18. ~~**F-015 a F-016**: Tipos e Serviços Frontend~~ ✓ 2026-01-20
    - `src/types/certification.types.ts` - Tipos completos com enums, interfaces, labels
    - `src/services/certification.service.ts` - CRUD de certificações
    - `src/services/certification-request.service.ts` - Gestão de solicitações
    - `src/services/workflow.service.ts` - Gestão de workflows
    - `src/services/scope.service.ts` - Gestão de escopo
    - `src/services/certificate.service.ts` - Gestão de certificados
19. ~~**F-001 a F-005**: Wizard de Solicitação~~ ✓ 2026-01-20
    - `RequestTypeSelector.tsx` - Seleção de tipo (nova/renovação/etc)
    - `CertificationTypeSelector.tsx` - Seleção C1-C5
    - `ScopeProductsManager.tsx` - Gestão de produtos
    - `ScopeFacilitiesManager.tsx` - Gestão de instalações
    - `ScopeBrandsManager.tsx` - Gestão de marcas
    - `ScopeSuppliersManager.tsx` - Gestão de fornecedores
    - `CertificationWizard.tsx` - Wizard principal com fluxos diferenciados
20. ~~**F-006, F-007, F-009**: Páginas de Certificação~~ ✓ 2026-01-20
    - `CertificationList.tsx` - Listagem com filtros e métricas
    - `CertificationDetails.tsx` - Detalhes com escopo e histórico
    - `NewCertificationRequest.tsx` - Página de nova solicitação
21. ~~**F-008**: Componente Timeline~~ ✓ 2026-01-21
    - `CertificationTimeline.tsx` - Timeline unificada com histórico e workflows
22. ~~**F-010**: Atualizar Dashboard da Empresa~~ ✓ 2026-01-21
    - Seção de certificações no CompanyDashboard com métricas e lista
    - Links para /certificacoes e detalhes
23. **Rotas configuradas** ✓ 2026-01-21
    - `/certificacoes` - Lista de certificações
    - `/certificacoes/nova` - Nova solicitação
    - `/certificacoes/:id` - Detalhes
    - `/certificacoes/:id/renovar` - Renovação
    - `/certificacoes/:id/ampliar` - Ampliação
    - `/certificacoes/:id/manutencao` - Manutenção
24. ~~**F-011**: Atualizar tela de listagem de processos~~ ✓ 2026-01-21
    - Adicionado suporte a certificationId e certificationNumber no Process
    - Adicionado link para certificação no card do processo
    - Badge com tipo de solicitação (nova, renovação, etc.)
25. ~~**F-012**: Atualizar componente de upload de documentos~~ ✓ 2026-01-21
    - Suporte a certificationRequestId além do requestId legado
    - Invalidação de queries de certificação após upload/delete
26. ~~**F-013**: Atualizar telas de auditoria~~ ✓ 2026-01-21
    - AuditExecution: exibe certificationNumber no header
    - AuditorDashboard: usa certification?.companyName com fallback para process?.request
    - Audit interface atualizada com campos de certificação
27. ~~**F-014**: Atualizar tela de emissão de certificado~~ ✓ 2026-01-21
    - Integração com certificateService real (substituiu mock data)
    - Exibe produtos e instalações do scope da certificação
    - Link para certificação completa
    - Labels de status do certificado adicionados
28. ~~**F-017**: Atualizar stores/state management~~ ✓ 2026-01-21
    - Criado `useCertification.ts` com hooks para gerenciamento de estado
    - `useCertification`: detalhes de certificação com scope e certificados
    - `useCertificationList`: listagem com filtros e paginação
    - `useCertificationScope`: gerenciamento de escopo (produtos, instalações, marcas, fornecedores)
    - `useCertificates`: gerenciamento de certificados (emissão, suspensão, reativação)
    - `useExpiringCertifications`: certificações próximas do vencimento
    - `useCertificationStatistics`: estatísticas de certificações
    - Query keys centralizados para cache management
    - Criado `hooks/index.ts` para exportação centralizada
29. **FASE 5 COMPLETA** ✓ - Frontend totalmente atualizado para arquitetura de Certificação
30. **Próximo passo**: Fase 6 - Testes e Validação

---

*Backlog criado em 2026-01-20*
*Última atualização: 2026-01-21*
