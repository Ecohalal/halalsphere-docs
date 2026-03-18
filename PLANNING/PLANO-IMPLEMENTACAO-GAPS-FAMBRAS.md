# Plano de Implementacao - Gaps Fambras vs HalalSphere

> **Data**: 2026-03-18 | **Versao**: 2.0 (baseada em analise real dos 368 documentos)
> **Referencia**: Gap Analysis v2.0

---

## PRIORIDADE 1 - CHECKLISTS E AUDITORIA (Bloqueiam conformidade operacional)

> Gaps CRITICOS: 10, 11, 12, 18, 19

### Epic A: Infraestrutura de Checklists Auditaveis

**A.1 - Modelo de Checklist Auditavel** (GAP-12)
- Prisma: `ChecklistTemplate` (name, dtReference, category, version, items[])
- Prisma: `ChecklistItem` (code, requirement, section, dtClause)
- Prisma: `AuditChecklist` (auditId, templateId, responses[])
- Prisma: `ChecklistResponse` (itemId, status: C/NC_MAIOR/NC_MENOR/OBS/NA, evidencias, descricao)
- Backend: ChecklistModule (CRUD templates, preenchimento, consulta)
- Frontend: Componente renderizavel de checklist com status por item
- **Estimativa**: 8 SP

**A.2 - Carregar Requisitos dos 15 DTs** (GAP-12)
- Extrair requisitos auditaveis de cada DT ja lido (textos extraidos em fambras-extraido/)
- Criar seed para ChecklistTemplate por DT:
  - DT 7.1: ~19 itens (requisitos fabricacao + areas producao + armazenagem + qualidade + HAS)
  - DT 7.2.1/7.2.2: ~20 itens cada (frigorificos)
  - DT 7.4 a 7.11: ~15-25 itens cada
- Usar IA (Claude) para acelerar extracao estruturada dos PDFs ja extraidos
- **Estimativa**: 5 SP (dados ja extraidos, falta estruturar como seed)

**A.3 - Checklist HAS (DT 7.3)** (GAP-10)
- Template especifico com 7 secoes obrigatorias:
  1. Politica Halal (items 7.1-7.3)
  2. Equipe de Gestao Halal (items 8.1-8.5)
  3. Treinamento (items 9.1-9.5)
  4. Descricao Produto Halal (items 10.1-10.2)
  5. Identificacao Perigos Haram e PCCH (items 11.1-11.6)
  6. Auditoria Interna HAS (items 12.1-12.6)
  7. Rastreabilidade (items 13.1-13.3)
- **Estimativa**: 3 SP

**A.4 - Matriz PCCH (DT 7.3 Anexo 1)** (GAP-11)
- **Decisao: Modelo Prisma dedicado** (nao JSON) - permite linkar com auditoria, versionamento entre ciclos, e alimentar IA
- Prisma: `PcchMatrix` (certificationId, version, createdAt)
- Prisma: `PcchHazard` (matrixId, flowchartStep, hazardDescription, probability: ALTA/MEDIA/BAIXA/NULA, severity: ALTA/MEDIA/BAIXA, isPcch, preventiveMeasure)
- Prisma: `PcchMonitoring` (hazardId, what, how, frequency, responsible, correctiveAction)
- Reutiliza entre ciclos (manutencao/renovacao herda da versao anterior)
- Auditor pode verificar cada hazard linkando com ChecklistResponse (A.1)
- **Estimativa**: 3 SP

### Epic B: Plano e Relatorio de Auditoria

**B.1 - Template Plano de Auditoria (FM 7.4.3.X / FM 7.4.4.X)** (GAP-18)
- 3 sheets: Sumario + Cronograma + Escopo
- Sumario: dados cliente, equipe, objetivos, normas
- Cronograma: 18 atividades com horarios (abertura -> visita -> documentacao legal -> HAS -> SGQ -> agua -> sanitizacao -> embalagem -> manutencao -> certificados MP -> almoco/reza -> programas obrigatorios -> desvios -> transporte -> itens categoria -> rotulagem -> reuniao equipe -> encerramento)
- Variante presencial vs remoto (campo Ferramenta TIC, teste pre-dia)
- Selecao automatica por categoria industrial
- **Estimativa**: 5 SP

**B.2 - Template Relatorio de Auditoria (FM 7.7.4.X)** (GAP-19)
- 3 sheets: Resumo + Detalhado + Escopo Auditado
- Resumo: conclusao (4 opcoes), pontos fortes, pontos melhoria, plano seguido?
- Detalhado: checklist por item DT (linkado ao ChecklistTemplate da Epic A)
- Escopo: tabela produtos auditados
- Assinaturas: auditor lider + RT
- **Estimativa**: 5 SP

**B.3 - Formulario Preparatorio FM 9.3** (GAP-17)
- 17 campos: cliente, categoria, tipo processo, reconhecimento, numero/vencimento, data auditoria, duracao, equipe, modalidade, contatos, permissao gravacao, anexos (6 checkboxes), analise laboratorial (PCR/solventes), observacoes
- Pre-auditoria acessivel ao auditor
- **Estimativa**: 3 SP

---

## PRIORIDADE 2 - MODULOS FALTANTES (Funcionalidades inexistentes)

> Gaps CRITICOS: 22, 27 | Gaps ALTOS: 13, 14, 15, 16, 29, 33, 34

### Epic C: Modulo Laboratorial

**C.1 - Cadastro Laboratorios + Analises** (GAP-15, GAP-22)
- Prisma: `Laboratory` (name, legalName, address, phone, email, isActive)
- Prisma: `LabCapability` (labId, analysisType: PCR/CROMATOGRAFIA, species[], lod, loq, turnaroundDays, excludedMatrices[])
- Seed com 5 labs aprovados (FoodChain, Eurofins, CQA, INTECSO, SENAI)
- **Estimativa**: 3 SP

**C.2 - Coleta de Amostras + Resultados** (GAP-22)
- Prisma: `LabSample` (certificationId, auditId, sealNumber, collectionDate, collectorId)
- Prisma: `SampleProduct` (sampleId, productName, lotInfo, quantity)
- Prisma: `LabAnalysis` (sampleId, labId, analysisType, status, resultDate, result, isConforming)
- Regras: 3 amostras (1 lab + 2 contra-prova), mix ate 10 para PCR, separacao po/liquido/oleoso
- Frontend: formulario de coleta FM 7.6.1 + dashboard resultados
- **Estimativa**: 8 SP

### Epic D: Templates de Certificado

**D.1 - Variantes de Certificado** (GAP-27)
- **Nota**: PDF generation (FM 7.7.1 + FM 7.7.2) ja implementado em Mar/2026 com PDFKit, background images, selos por mercado, QR code, fontes arabes
- **Falta**: campos de selecao automatica (country, sifPresent, withAnnex, certificateModel UNICO/PLANTA/EMBARQUE) + modelo FM 7.7.3 (embarque)
- Logica de selecao automatica baseada em: pais + SIF + mercado + organismo
- **Estimativa**: 3 SP (reduzido de 8 - base ja existe)

### Epic E: Contratos Tipificados

**E.1 - 8 Tipos de Contrato** (GAP-04, GAP-05)
- Enum ContractModel: CERTIFICADO_UNICO, CERTIFICADO_UNICO_LATAM, CERTIFICADO_UNICO_LOGISTICA, SUPERVISOR_FIXO_CUSTO_CONTRATADA, SUPERVISOR_FIXO_CUSTO_CONTRATANTE, SUPERVISOR_FIXO_LOGISTICA, SUPERVISOR_COLOMBIA, HAB_PLANTA_CAMPANHA
- Campos adicionais: logisticsCostResponsible, supervisionType, supervisionMonthlyCost, supervisionDailyCost, shipmentCertificateCost, renewalAdjustmentIndex
- Selecao automatica baseada em: pais + segmento + modalidade supervisao
- **Estimativa**: 5 SP

### Epic F: Reclamacao e Apelo

**F.1 - Modulo PR 7.13** (GAP-16)
- Prisma: `Complaint` (type: RECLAMACAO/APELO, description, certificationId, status, isAnonymous)
- Prisma: `ComplaintReview` (complaintId, committeeMemberId, recommendation, deadline)
- Workflow: registrada -> em_analise -> comite -> respondida -> resolvida
- Canal anonimo permitido
- **Estimativa**: 5 SP

### Epic G: Selo Halal

**G.1 - Controle Uso do Selo** (GAP-29)
- Prisma: `SealUsageControl` (certificationId, usageType: PRODUTO/INSTITUCIONAL, approvalDate, status)
- Prisma: `SealVerification` (controlId, verificationDate, product, location, evaluator, result, action)
- Regras IT 4.1: aprovacao previa layout, proibicao UAE, apenas producoes c/ supervisor
- FM 4.3.1 como formulario de verificacao periodica
- **Estimativa**: 5 SP

### Epic H: Integracao SIH (Supervisao Industrial Halal)

> **Decisao**: NAO duplicar - integrar com o SIH que ja esta em producao (supervisao-industrial.ecohalal.solutions)
> O SIH ja implementa: SlaughterReport (FM 7.1.4.x), ProductionReport (FM 7.1.3.x), ShippingReport (FM 7.1.7.x), NonConformity (FM 7.1.6.1), analytics, PDF, 13 controllers, 47 modelos Prisma
> GAPs 33, 34, 35 resolvidos via SIH

**H.1 - API de Integracao HalalSphere <-> SIH** (GAP-33, 34, 35)
- Link: `Plant.externalCompanyId` (SIH) -> HalalSphere `Company.id`
- Endpoint no HalalSphere para receber resumo de supervisao do SIH
- NC critica no SIH dispara alerta/webhook no HalalSphere (NotificationModule)
- Dashboard no HalalSphere mostra status de supervisao (dados SIH)
- Preparar para SSO futuro (SIH Phase 13)
- **Estimativa**: 5 SP

---

## PRIORIDADE 3 - MELHORIAS (Completam aderencia)

> Gaps MEDIOS e BAIXOS

### Epic I: Ajustes e Complementos

**I.1 - Mercados pretendidos individuais** (GAP-01): 14 checkboxes vs 3 flags | 2 SP
**I.2 - Validacao IT 7.4 (3 perguntas)** (GAP-02): Checklist formal na fase 2 | 1 SP
**I.3 - Exportacao PDF formato Fambras** (GAP-03): Geracao PDF dos FM | 5 SP
**I.4 - Cobranca por embarque** (GAP-06): Modelo pricing por lote | 3 SP
**I.5 - Contatos 10 categorias** (GAP-07): CompanyContact com role enum | 3 SP
**I.6 - Indice reajuste contratual** (GAP-08): Campo IPCA/IGPM | 1 SP
**I.7 - Checklist docs segmentado** (GAP-09): Config por segmento | 2 SP
**I.8 - Homologacao MP pre-compra** (GAP-13): Workflow de aprovacao | 5 SP
**I.9 - Classificacao risco MP + aceite certificado** (GAP-14): Risk enum + criterios | 3 SP
**I.10 - Conclusao auditoria 4 opcoes** (GAP-20): +1 enum value | 1 SP
**I.11 - Obrigacoes logisticas auditado** (GAP-21): Campos no Audit | 1 SP
**I.12 - Dashboard FM 7.1.2.1** (GAP-23): Pagina com visao tabular | 3 SP
**I.13 - Checklist FM 7.1.1 formal** (GAP-25): 9 itens especificos | 2 SP
**I.14 - Gestao membros comite** (GAP-26): CommitteeMember + impedimentos | 3 SP
**I.15 - Planilha MP 15 campos** (GAP-30): Expandir ScopeSupplier | 2 SP
**I.16 - Workflow manutencao simplificado** (GAP-31): Skip fases 1-8 | 3 SP
**I.17 - Alertas vencimento + restauracao** (GAP-32): Scheduler rules | 3 SP
**I.18 - Metricas desempenho analistas** (GAP-24): Reports dashboard | 2 SP
**I.19 - PDF certificado protegido** (GAP-28): Encryption | 1 SP
**I.20 - Relatorios segmento supervisor** (GAP-35): Resolvido via integracao SIH (H.1) | 0 SP

---

## RESUMO DE ESFORCO

| Prioridade | Epic | SP | Gaps Resolvidos |
|---|---|---|---|
| **P1** | A - Checklists Auditaveis | 19 | GAP-10, 11, 12 |
| **P1** | B - Plano/Relatorio Auditoria | 13 | GAP-17, 18, 19 |
| **P2** | C - Laboratorial | 11 | GAP-15, 22 |
| **P2** | D - Certificado Templates | 3 | GAP-27 (base ja existe) |
| **P2** | E - Contratos Tipificados | 5 | GAP-04, 05 |
| **P2** | F - Reclamacao/Apelo | 5 | GAP-16 |
| **P2** | G - Selo Halal | 5 | GAP-29 |
| **P2** | H - Integracao SIH | 5 | GAP-33, 34, 35 (via SIH) |
| **P3** | I - Ajustes (20 items) | 42 | Demais 20 gaps |
| | **TOTAL** | **~108 SP** | **35 gaps** |

---

## SEQUENCIA RECOMENDADA

```
Mes 1-2: Epic A (Checklists) + Epic B (Auditoria)          → 32 SP, 6 gaps criticos
Mes 2-3: Epic C (Lab) + Epic D (Certificado)               → 14 SP, 2 gaps criticos
Mes 3-4: Epic E (Contratos) + F (Reclamacao) + G (Selo)    → 15 SP, 3 gaps altos
Mes 4-5: Epic H (Integracao SIH) + I.8/I.9 (MP)           → 13 SP, 4 gaps altos
Mes 5-6: Epic I restante (15 items)                        → 34 SP, 20 gaps medios/baixos
```

---

## DEPENDENCIAS

1. **Epic A e PRE-REQUISITO** de Epic B (relatorio de auditoria usa checklist)
2. **Conteudo dos DTs** ja extraido em `PLANNING/fambras-extraido/` - usar como fonte para seed
3. **Templates de certificado** (Epic D): base de PDF ja implementada (Mar/2026), faltam variantes
4. **Epic H** depende do SIH estar acessivel (API ou DB compartilhado)
5. **Validacao com Fambras** necessaria apos implementacao de cada Epic

---

## DECISOES TOMADAS NA REVISAO (18/03/2026)

1. **A.4 - Matriz PCCH**: Modelo Prisma dedicado (PcchMatrix/PcchHazard/PcchMonitoring) em vez de JSON - permite linkar com auditoria, versionar entre ciclos e alimentar IA
2. **D.1 - Certificados**: Reduzido de 8 SP para 3 SP - PDF generation ja implementada em Mar/2026 com PDFKit, background images, selos por mercado, QR code, fontes arabes
3. **H - Supervisores**: Mudou de "implementar do zero" para "integrar com SIH" - o SIH (supervisao-industrial.ecohalal.solutions) ja implementa SlaughterReport, ProductionReport, ShippingReport, NonConformity, analytics completos
4. **I.20 - Relatorios segmento**: Zerado (0 SP) - coberto pela integracao SIH

---

## RISCOS

1. **Volume de dados para seed**: 15 DTs com 20-50 requisitos cada = 300-750 items de checklist para estruturar
2. **Templates DOC legados**: 32 arquivos .DOC nao extraidos automaticamente (certificados) - precisam leitura manual
3. **Validacao regulatoria**: Templates gerados precisam aprovacao da Fambras antes de uso em producao
4. **Internacionalizacao (PT/EN/ES)**: Nao priorizado neste plano mas exigido pela Fambras em formularios
5. **Integracao SIH**: Depende de API ou acesso compartilhado entre os sistemas
