# Gap Analysis: Documentacao Fambras vs Sistema HalalSphere

> **Data**: 2026-03-18 | **Versao**: 2.0 (baseada em leitura real dos 368 documentos)
> **Metodo**: Extracao completa via PyMuPDF/python-docx/openpyxl + cruzamento com codigo Prisma/NestJS/React

---

## METODOLOGIA

1. Todos os 368 arquivos (68 PDF, 71 DOCX, 197 XLSX, 32 DOC) foram extraidos para texto puro
2. Conteudo analisado por fase do processo de certificacao (25 fases Fambras)
3. Campos, regras de negocio e requisitos extraidos de cada formulario/procedimento
4. Cruzados contra modelos Prisma, services NestJS e componentes React reais
5. DOCs legados (32 arquivos) nao puderam ser extraidos automaticamente - sao templates de certificado

---

## LEGENDA

| Status | Significado |
|---|---|
| COMPLETO | Implementado e atende ao requisito Fambras |
| PARCIAL | Existe mas incompleto vs documentacao Fambras |
| AUSENTE | Nao implementado |

---

## FASE 1 - SOLICITACAO DE CERTIFICACAO

### O que a Fambras exige (baseado em leitura dos 12 arquivos)

**FM 7.2.1.X** - 9 formularios de solicitacao com 11 secoes comuns + campos especificos por segmento:
- Industrial: 11 secoes incluindo Avaliacao de Complexidade (MP/fornecedores) e 3 contatos
- Frigorifico Aves: tabela pre-definida de produtos (frango inteiro, cortes, CMS, etc.), 2 contatos
- Frigorifico Bovino: tipo de atividade (abate/desossa/ambos), tabela pre-definida bovino, 2 contatos
- Fazenda: tipo pecuaria, criacao suino (sim/nao), producao alcoolica (sim/nao), capacidade
- Turismo: capacidade hospedes, quartos, cozinhas/restaurantes
- Catering: APPCC inline, filiais com copia de bloco
- Entreposto/Armazem: capacidade, tipos armazenados, 1 contato

**FM 7.1.9** - Calculo de dias de auditoria:
- Formula: TS = TD + TH + TMS + TFTE (tabela A-K com valores especificos)
- Estagio 1 = 30%, Estagio 2 = 70%, Manutencao = 1/3, Renovacao = 2/3
- Reducao maxima 30% com justificativa
- Regras: Golfo nao pode E1+E2 no mesmo dia, minimo 0.5 dia, 1 dia = 8h

**FM 7.2.1.5** - Controle de escopo: tabela de produtos (nome, codigo, embalagem, marca)

**IT 7.4** - Instrucao de revisao: 3 perguntas obrigatorias de validacao, classificacao final

### O que o sistema tem

| Requisito Fambras | Sistema | Status | Detalhe |
|---|---|---|---|
| 9 formularios por segmento | CertificationFormData + CertificationSegment (9 segmentos) | COMPLETO | Enum com 9 valores, 11 secoes comuns |
| Campos especificos por segmento | segmentData JSON com tipos por segmento | COMPLETO | criaSuino, possuiAlcool, tipoPecuaria, capacidade todos presentes |
| Tabela pre-definida produtos aves | productTypes ['frango_inteiro', 'cortes', etc.] | COMPLETO | 6 tipos definidos no schema |
| Tabela pre-definida produtos bovino | productTypes ['carcaca', 'cortes', 'miudos', 'tripas'] | COMPLETO | 4 tipos definidos |
| 3 contatos (solicitante, legal, tramites) | contatoSolicitante, contatoLegal, contatoResponsavel | COMPLETO | Cada um com nome, email, telefone, cargo |
| Controle de escopo FM 7.2.1.5 | ScopeProduct (name, packingSize, category, origin) + ScopeBrand | COMPLETO | Suporta N produtos com marcas |
| Calculo dias auditoria FM 7.1.9 | AuditDaysTable (td, th, tms, fteHd) + AuditDaysCalculatorService | COMPLETO | Formula TS=TD+TH+TMS+FTE implementada |
| Tabela A-K com FTE ranges | AuditDaysTable com categoryCode, fteRangeMin, fteRangeMax | COMPLETO | Seed data com categorias A-K |
| Split 30/70 E1/E2, 1/3 manut, 2/3 renov | Multiplicadores no calculator service | COMPLETO | requestType nova=1.5, renovacao=0.8, branch=0.5 |
| Reducao maxima 30% | reductionPercentage com cap em 30 | COMPLETO | Validacao no service |
| 3 perguntas validacao IT 7.4 | Fase 2 workflow (analise_documental_inicial) | PARCIAL | Workflow avanca mas sem as 3 perguntas formais |
| Mercados pretendidos (checkboxes individuais) | mercadoInterno, exportacao, mercadoGolfo (booleans) | PARCIAL | Apenas 3 flags; Fambras tem 14 mercados individuais |
| Exportacao para formularios FM padrao Fambras | Nao existe | AUSENTE | Sistema nao gera PDFs no formato FM 7.2.1.X |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-01 | Mercados pretendidos individuais | MEDIA | Fambras lista 14 mercados (Arabia Saudita, Emirados, Indonesia, Malasia, etc.); sistema tem apenas 3 flags |
| GAP-02 | 3 perguntas formais de validacao IT 7.4 | BAIXA | Workflow avanca sem checklist formal das 3 perguntas de viabilidade |
| GAP-03 | Exportacao PDF formato Fambras | MEDIA | Formularios preenchidos nao sao exportaveis no layout FM oficial |

---

## FASE 2 - PROPOSTA E CONTRATO

### O que a Fambras exige (baseado em leitura dos 17 arquivos)

**8 tipos de contrato** distintos por modalidade e pais:
- Certificado Unico: FM 4.1.1 (BR), FM 4.1.1.2 (LatAm), FM 4.1.1.3 (Logistica)
- Supervisor Fixo: FM 4.1.2.1 (custo contratada), FM 4.1.2.2 (custo contratante/Paraguai), FM 4.1.2.3 (logistica), FM 4.1.2.4 (Colombia)
- Hab. Planta/Campanha: FM 4.1.3

**Estrutura de pagamento**: 3 parcelas (cert inicial + manut 1 + manut 2), supervisao mensal ou diaria, certificado por embarque (U$80 + U$4/ton excedente)

**FM 7.2.3/7.2.4** - Proposta comercial com 7 secoes, validade 60 dias

**IT 4.2** - Formato ABC.SIG.ANOMES.NN com tabela SIGLA de 12.500+ cidades

**FM 7.4.2.3** - Controle de contatos com 10 categorias (diretoria, juridico, qualidade, etc.)

### O que o sistema tem

| Requisito Fambras | Sistema | Status | Detalhe |
|---|---|---|---|
| Proposta com calculo dinamico | ProposalModule com PricingTable, 7 multiplicadores | COMPLETO | Calculo, breakdown, ajustes, PDF |
| Validade da proposta | Proposal.validityDays | COMPLETO | Configuravel (padrao 30 dias, Fambras usa 60) |
| Numeracao ABC.SIG.ANOMES.NN | FambrasNumberingService + CitySigla | COMPLETO | Implementado com lookup de cidade |
| Gestao de contratos | ContractModule (CRUD, status, assinatura) | COMPLETO | rascunho->enviado->assinado->cancelado |
| Assinatura eletronica | ESignatureConfig (ClickSign, D4Sign, DocuSign, Adobe) | COMPLETO | 4 provedores |
| 8 tipos de contrato por modalidade/pais | Contract.contractType: proposta/contrato apenas | PARCIAL | Sem distincao dos 8 modelos FM 4.1.X |
| Custo logistica supervisor (contratada vs contratante) | Nao existe campo | AUSENTE | Contrato nao registra quem paga logistica |
| Tipo supervisao no contrato (fixo/campanha/nenhum) | Nao existe campo no Contract | PARCIAL | Existe no Proposal mas nao migra pro Contract |
| Certificado por embarque (U$80 + U$4/ton) | Nao modelado | AUSENTE | Sem modelo de cobranca por embarque |
| 10 categorias de contato FM 7.4.2.3 | 3 contatos no CertificationFormData | PARCIAL | Falta: diretoria, juridico, qualidade, financeiro, comercial int/ext, assessoria |
| Reajuste IPCA/IGPM em renovacao | Nao existe campo | AUSENTE | Contrato nao tem indice de reajuste |
| Clausulas contratuais especificas (supervisor, EPIs, sala reza) | Nao modelado | AUSENTE | Template de contrato generico |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-04 | Tipificacao de contrato (8 modelos FM 4.1.X) | ALTA | Sem distincao certificado unico vs supervisor fixo vs hab. planta |
| GAP-05 | Campos de supervisao no contrato | ALTA | logisticsCostResponsible, supervisionType, supervisionCost faltam |
| GAP-06 | Cobranca por embarque/tonelada | MEDIA | Modelo de pricing por lote nao existe |
| GAP-07 | Contatos multi-role (10 categorias) | MEDIA | Apenas 3 contatos; Fambras exige 10 categorias por empresa |
| GAP-08 | Indice de reajuste contratual | BAIXA | IPCA/IGPM nao registrado |

---

## FASE 3/3.1 - DOCUMENTACAO INICIAL E QUALIDADE

### O que a Fambras exige (baseado em leitura dos 31 arquivos)

**3 checklists distintos** de documentacao (FM 7.4.2.1/2/12):
- Industrial: 13 itens incluindo PCR + solventes residuais, ficha tecnica por produto, HAS
- Frigorifico: 14 itens incluindo PCR (sem solventes), tinta de carimbo na planilha MP
- Armazem: 7 itens simplificados (sem lab, sem planilha MP)

**15 Documentos Tecnicos (DTs)** com requisitos auditaveis detalhados:
- DT 7.1 (Alimentos): 10+ secoes, limite etanol 0.1% produto / 0.5% MP, purificacao 7x para linhas suinos
- DT 7.3 (HAS): 7 componentes obrigatorios (Politica Halal, Equipe, Treinamento, Descricao Produto, PCCH, Auditoria Interna, Rastreabilidade)
- DT 7.3 Anexo 1: Matriz de risco (Probabilidade x Severidade) para hazards Haram
- Cada DT tem entre 20-50 requisitos auditaveis especificos

**IT 7.1** - Homologacao de MP: contatar auditor ANTES da compra, enviar FM 7.4.2.7 + ficha tecnica + certificado Halal

**IT 7.2** - Aceite certificados Halal: criterios de aceitacao (validade, nomenclatura, fabricante, reconhecimento por JAKIM/MUI/GAC/MOIAT/PNAC/EIAC), classificacao de risco (ALTO/MEDIO/BAIXO)

**PR 7.1** (56 paginas) - Regras completas: concessao, manutencao, extensao, reducao, suspensao, cancelamento, renovacao com prazos e condicoes

**PR 7.13** - Reclamacao e Apelo: comite proprio, prazos, anonimato permitido

### O que o sistema tem

| Requisito Fambras | Sistema | Status | Detalhe |
|---|---|---|---|
| Upload de documentos | DocumentModule (S3, validacao, versionamento) | COMPLETO | 15 tipos, expiry tracking |
| Solicitacao de documentos | DocumentRequest com status tracking | COMPLETO | pendente/atendido/cancelado |
| Checklist de docs POR SEGMENTO (3 variantes) | DocumentType generico (15 tipos) | PARCIAL | Nao diferencia Industrial vs Frigorifico vs Armazem |
| HAS (DT 7.3) - 7 componentes obrigatorios | Nao existe modelo dedicado | AUSENTE | Sem checklist HAS com os 7 componentes |
| Matriz PCCH (DT 7.3 Anexo 1) | Nao existe | AUSENTE | Sem template de hazard analysis Haram |
| Requisitos auditaveis dos 15 DTs | Nao existe modelo de checklist por DT | AUSENTE | Requisitos nao estruturados no sistema |
| Homologacao de MP (IT 7.1) | ScopeSupplier com hasHalalCertificate | PARCIAL | Registra status mas sem workflow de homologacao pre-compra |
| Classificacao de risco MP (IT 7.2) | Nao existe | AUSENTE | Sem classificacao ALTO/MEDIO/BAIXO para aceite de certificados |
| Criterios aceite certificado Halal (JAKIM/MUI/GAC/MOIAT) | Nao existe | AUSENTE | Sem validacao por organismo reconhecedor |
| Cadastro laboratorios aprovados (FM 7.4.2.11) | Nao existe | AUSENTE | 5 labs com analises especificas nao cadastrados |
| Regras suspensao/cancelamento (PR 7.1) | CancellationType + SuspensionType | COMPLETO | pos_suspensao/distrato, normal/entressafra com prazos |
| Reclamacao e Apelo (PR 7.13) | Nao existe | AUSENTE | Sem modelo Complaint/Appeal |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-09 | Checklist documentos segmentado (3 variantes) | MEDIA | Industrial exige 13 docs, Armazem 7 - sistema nao diferencia |
| GAP-10 | HAS - Halal Assurance System (DT 7.3) | CRITICA | 7 componentes obrigatorios sem checklist dedicado no sistema |
| GAP-11 | Matriz PCCH (Pontos Criticos Controle Haram) | CRITICA | Template Fambras DT 7.3 Anexo 1 nao existe |
| GAP-12 | Checklists auditaveis por DT (15 documentos) | CRITICA | 20-50 requisitos por DT nao estruturados como items verificaveis |
| GAP-13 | Workflow homologacao MP pre-compra (IT 7.1) | ALTA | Fambras exige contato ANTES da compra; sistema so registra |
| GAP-14 | Classificacao risco MP + criterios aceite certificado (IT 7.2) | ALTA | Sem validacao JAKIM/MUI/GAC/MOIAT, sem risco ALTO/MEDIO/BAIXO |
| GAP-15 | Cadastro 5 laboratorios aprovados (FM 7.4.2.11) | ALTA | Labs com analises, LOD, LOQ, prazos nao cadastrados |
| GAP-16 | Modulo Reclamacao e Apelo (PR 7.13) | ALTA | Comite proprio, prazos, anonimato - nada implementado |

---

## FASES 4-6 - AGENDAMENTO E AUDITORIA (ESTAGIOS 1 e 2)

### O que a Fambras exige (baseado em leitura dos ~220 arquivos)

**Calendario**: Grid semanal com empresa, tipo auditoria, auditores, logistica compartilhada

**FM 9.3** - Formulario preparatorio: 17 campos incluindo permissao gravacao, anexos obrigatorios (relatorio anterior, fluxograma, planilha MP, escopo, HAS, FM 7.4.2.4), tipo analise laboratorial

**FM 7.4.3.X / FM 7.4.4.X** - Planos de auditoria com 3 sheets:
- Sumario (dados cliente, equipe, objetivos, normas referencia, obrigacoes)
- Cronograma (18 atividades detalhadas com horarios: abertura, visita, documentacao legal, HAS, SGQ, agua, sanitizacao, embalagem, manutencao, certificados Halal MP, programas obrigatorios, desvios, transporte, rotulagem, reuniao equipe, encerramento)
- Escopo (tabela de ate 139 produtos)

**FM 7.7.4.X** - Relatorios de auditoria com 3 sheets:
- Resumo (conclusao: recomendado/recomendado apos NCs/suspensao/nao recomendado)
- Detalhado (checklist por item do DT com C/NC-MAIOR/NC-MENOR/OBS/NA + evidencias)
- Escopo auditado

**10 categorias** com documentos em PT/EN/ES para cada (presencial + remoto)

### O que o sistema tem

| Requisito Fambras | Sistema | Status | Detalhe |
|---|---|---|---|
| Agendamento de auditoria | AuditModule com scheduling | COMPLETO | agendado/em_andamento/concluido/cancelado |
| Calendario visual | Calendar.tsx | COMPLETO | Visualizacao de eventos |
| Alocacao auditores com competencias | AuditorAllocationModule + AuditorCompetency | COMPLETO | Match scoring, FM 6.1.4, deputy |
| Auditoria nao anunciada | Audit com unannounced windows | COMPLETO | Janela PR 7.1 Rev 22 |
| Estagio 1 vs Estagio 2 | ProcessPhase.auditoria_estagio1 / auditoria_estagio2 | COMPLETO | Fases distintas no workflow |
| Presencial vs Remoto | AuditMode (IN_LOCO / REMOTO) | COMPLETO | Enum no IndustrialCategory |
| Captura de evidencias | EvidenceCapture.tsx | COMPLETO | Fotos/videos durante auditoria |
| Nao-conformidades | NonConformityForm.tsx (maior/menor/critica) | COMPLETO | 3 niveis |
| Formulario preparatorio FM 9.3 (17 campos) | Nao existe | AUSENTE | Sem formulario pre-auditoria estruturado |
| Plano de auditoria por categoria (cronograma 18 atividades) | Nao existe template | AUSENTE | Sem FM 7.4.3.X / FM 7.4.4.X |
| Relatorio de auditoria por categoria (checklist DT + conclusao) | AuditExecution captura dados | PARCIAL | Sem template FM 7.7.4.X com checklist estruturado por DT |
| Conclusao formal (4 opcoes: recomendado/recomendado c/ NCs/suspensao/nao recomendado) | AuditResult (aprovado/aprovado_condicional/reprovado) | PARCIAL | 3 opcoes vs 4 da Fambras |
| Obrigacoes auditado (sala reza, alimentacao Halal, EPI com tamanhos) | Nao modelado | AUSENTE | Requisitos logisticos nao registrados |
| Geracao em PT/EN/ES | Apenas PT | AUSENTE | Sem internacionalizacao |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-17 | Formulario preparatorio FM 9.3 | ALTA | 17 campos incluindo anexos obrigatorios e permissao gravacao |
| GAP-18 | Plano de auditoria estruturado (FM 7.4.3.X/7.4.4.X) | CRITICA | Cronograma com 18 atividades, 3 sheets, por categoria |
| GAP-19 | Relatorio de auditoria com checklist DT (FM 7.7.4.X) | CRITICA | Checklist detalhado por requisito do DT com C/NC/NA + evidencias |
| GAP-20 | Conclusao formal com 4 opcoes | BAIXA | Falta opcao "recomendado apos NCs" e "suspensao" |
| GAP-21 | Obrigacoes logisticas do auditado | BAIXA | Sala reza, EPI com tamanhos, alimentacao Halal |

---

## FASE 7 - ANALISE LABORATORIAL

### O que a Fambras exige (baseado em leitura dos 3 arquivos)

**FM 7.4.2.11** - 5 laboratorios aprovados com dados detalhados:
1. FoodChain ID (Analitus) - PCR, LOD 25mg/kg, 3 dias
2. Eurofins - PCR + Etanol, LOD 0.01%, 5/24 dias
3. CQA - PCR + Etanol, LOD 0.01%, LOQ 4ppm, 15 dias
4. INTECSO - PCR + Etanol, LOD 0.01%, LOQ 0.001g/100g, 3/5 dias
5. SENAI - PCR, LOD 0.1%, 10 dias

**IT 7.6.1** - 19 passos procedimentais para coleta:
- 3 amostras sempre (1 lab + 2 contra-prova com lacre numerado)
- Mix de ate 10 produtos para PCR (nao para solventes)
- Separacao por caracteristica fisica (po/liquido/oleoso)
- Resultado enviado simultaneamente para cliente e Fambras

### O que o sistema tem

| Requisito Fambras | Sistema | Status |
|---|---|---|
| Cadastro de laboratorios | Nao existe | AUSENTE |
| Analise laboratorial (PCR/cromatografia) | Nao existe | AUSENTE |
| Coleta de amostras (FM 7.6.1) | Nao existe | AUSENTE |
| Lacre numerado | Nao existe | AUSENTE |
| Resultados e rastreamento | Nao existe | AUSENTE |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-22 | Modulo laboratorial completo | CRITICA | Cadastro labs, tipos analise (PCR/cromatografia), coleta, amostras, resultados, contra-prova |

---

## FASE 8 - REVISAO DO PROCESSO

### O que a Fambras exige (FM 7.1.2.1 - planilha com 4 sheets)

Sheet principal com 30+ colunas rastreando: pasta analista, complexidade, doc qualidade, estagio 1 (dia/plano/reuniao/relatorio/NCs/auditores), estagio 2 (idem), coleta, analise, checklist processo, selo, layout, proposta, contrato, pagamento, certificado, manutencao 1, manutencao 2, renovacao, contatos

Sheets auxiliares: controle auditores por complexidade, desempenho mensal analistas, matriz empresa-mes

### O que o sistema tem

| Requisito Fambras | Sistema | Status |
|---|---|---|
| Rastreamento 17 fases | RequestWorkflow + WorkflowPhaseHistory | COMPLETO |
| Status por certificacao | CertificationStatus + ProcessPhase | COMPLETO |
| Dashboard consolidado FM 7.1.2.1 | Nao existe | PARCIAL |
| Controle auditores por complexidade | AuditorAllocation com match scores | PARCIAL |
| Desempenho mensal analistas | Nao existe | AUSENTE |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-23 | Dashboard consolidado tipo FM 7.1.2.1 | MEDIA | Visao tabular com 30+ colunas por certificacao |
| GAP-24 | Metricas desempenho analistas | BAIXA | Entregas, efetividade, pastas por mes |

---

## FASE 9 - COMITE DE DECISAO

### O que a Fambras exige (FM 7.1.1 + PR 5.1)

**FM 7.1.1** - Checklist com 9 itens + 4 pareceres sequenciais
**PR 5.1** - Composicao: minimo 4 membros (2+ sheikhs + tecnico + RT), unanimidade, impedimentos

### O que o sistema tem

| Requisito Fambras | Sistema | Status |
|---|---|---|
| 4 revisoes sequenciais | CommitteeReview (tecnica, religiosa_1, religiosa_2, aprovacao_rt) | COMPLETO |
| Unanimidade | isUnanimous tracking | COMPLETO |
| Sequencialidade | REVIEW_SEQUENCE_MAP enforced | COMPLETO |
| Checklist 9 itens FM 7.1.1 | checklist JSON no CommitteeReview | PARCIAL |
| Gestao de membros do comite | Nao existe modelo | AUSENTE |
| Impedimentos (membro nao pode ter participado da auditoria) | Nao validado | AUSENTE |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-25 | Checklist FM 7.1.1 com 9 itens formais | MEDIA | Checklist generico, sem os 9 itens especificos |
| GAP-26 | Gestao membros comite + impedimentos | MEDIA | PR 5.1 exige que nenhum membro tenha participado na auditoria |

---

## FASE 10 - EMISSAO DO CERTIFICADO

### O que a Fambras exige (IT 7.10 + 60 templates)

**3 modelos**: Certificado Unico (SEM supervisor), Habilitacao de Planta (COM supervisor), Certificado por Embarque
**Variantes** por: pais (BR/AR/PY/CO), SIF (com/sem), mercado (Golfo/Sem Golfo), organismo (MS/MUIS-SMIIC/KEPKABAN BPJPH), anexo (com/sem)
**Regras**: data emissao >= data comite, "certified since" = primeira certificacao, validade = sempre 3 anos exatos, PDF protegido com senha

### O que o sistema tem

| Requisito Fambras | Sistema | Status |
|---|---|---|
| Emissao certificado com PDF + QR | CertificateModule | COMPLETO |
| Template system | CertificateTemplate (templateCode, marketVariant) | PARCIAL |
| 6 market variants (GCC/EMIRATES/SINGAPORE/INDONESIA/MALAYSIA/STANDARD) | seal-config.ts | PARCIAL |
| Campos por pais (BR/AR/PY/CO) | Nao existe campo country no template | AUSENTE |
| SIF (com/sem) no template | Nao existe campo sifPresent | AUSENTE |
| COM/SEM anexo de produtos | Nao existe campo withAnnex | AUSENTE |
| 3 modelos (unico/planta/embarque) | Sem distincao | AUSENTE |
| PDF protegido com senha | Nao implementado | AUSENTE |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-27 | Templates certificado com variantes completas | CRITICA | Faltam: pais, SIF, com/sem anexo, 3 modelos de certificado |
| GAP-28 | PDF protegido com senha | BAIXA | IT 7.10 exige PDF encriptado |

---

## FASE 11 - USO DO SELO HALAL

### O que a Fambras exige (4 arquivos lidos)

**IT 4.1** - 18 regras detalhadas incluindo: aprovacao previa de layout, proibicao selo em UAE, selo so para producoes acompanhadas por supervisor, marca propria de terceiros requer validacao

**FM 4.3.1** - Verificacao periodica: data, empresa, produto, meio verificacao, local, avaliacao, acao, correcao, acompanhamento

**FM 7.4.2.4** - Declaracao de uso: tipo (produtos vs institucional), compromisso remocao pos-certificacao

### O que o sistema tem

Nenhuma funcionalidade dedicada. Selo e estatico via seal-config.ts.

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-29 | Modulo controle uso do selo Halal | ALTA | Verificacao periodica, aprovacao layout, regras UAE, supervisor |

---

## FASE 13 - INCLUSAO PRODUTO / ALTERACAO ESCOPO

### O que a Fambras exige (IT 7.8 + FM 7.4.2.9)

**FM 7.4.2.9** - Planilha MP e Fornecedores com 2 abas:
- Aba 1: 15 campos por MP (nome generico, nome certificado Halal, origem, certificadora, numero, validade, fabricante, fornecedor, embalagem original)
- Aba 2: Embalagem, tratamento agua, limpeza (sem documentacao Halal)

**IT 7.8** - Comunicacao obrigatoria ao auditor + diretor + RT; reducao remove selo; extensao pode exigir auditoria E2

### O que o sistema tem

| Requisito Fambras | Sistema | Status |
|---|---|---|
| Alteracao de escopo | ScopeChangeRequest (extensao/reducao) | COMPLETO |
| Aprovacao RT | ScopeChangeRequest com RT tracking | COMPLETO |
| Novo certificado | Nova versao Certificate | COMPLETO |
| Planilha MP 15 campos (FM 7.4.2.9) | ScopeSupplier basico | PARCIAL |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-30 | Planilha MP completa (15 campos FM 7.4.2.9) | MEDIA | Faltam: nome no certificado Halal, numero certificado, validade, fabricante vs fornecedor, embalagem original |

---

## FASES 14-21 - MANUTENCAO E RENOVACAO

### O que a Fambras exige

**Manutencao**: Ciclo anual, apenas Estagio 2 (1/3 do tempo), deadline 12 meses da ultima auditoria, atraso = suspensao
**Manutencao 2**: Identica a Manutencao 1 (2o ano do ciclo de 3 anos)
**Renovacao**: Estagio 2 (2/3 do tempo), ANTES do vencimento, cliente solicita 6 meses antes, restauracao ate 6 meses pos-vencimento

### O que o sistema tem

| Requisito Fambras | Sistema | Status |
|---|---|---|
| RequestType manutencao | RequestType.manutencao | COMPLETO |
| RequestType renovacao | RequestType.renovacao | COMPLETO |
| Workflow customizado (sem fases comerciais) | Mesmo workflow 17 fases | PARCIAL |
| Deadline 12 meses + suspensao automatica | Scheduler module | PARCIAL |
| Diferenciacao Manutencao 1 vs 2 | Nao existe | AUSENTE |
| Restauracao 6 meses pos-vencimento | Nao implementado | AUSENTE |
| Solicitacao 6 meses antes vencimento | Nao implementado | AUSENTE |

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-31 | Workflow simplificado para manutencao (apenas E2) | MEDIA | Manutencao nao precisa de fases 1-8 |
| GAP-32 | Alerta 6 meses antes vencimento + restauracao pos-vencimento | MEDIA | Regras de timeline PR 7.1 |

---

## FASE 25 - RELATORIOS SUPERVISORES

### O que a Fambras exige (8 arquivos lidos)

**FM 20.1** (Aves) - Relatorio DIARIO com 9 secoes: abate mecanico (eficiencia disco), insensibilizacao (parametros), paradas de linha, aves vivas/mal sangradas, pendura/lote, funcionarios, mercado, outros, correcoes

**FM 20.2** (Interno) - Relatorio DIARIO com 5 secoes: materias primas (MP recebida com certificado Halal?), produto (producao Halal? sanitizacao?), expedicao (paises destino, container exclusivo?), outros, correcoes

**FM 7.1.3.X** - Relatorios por segmento: tripas (materia-prima, produto final, checklist producao), rotulagem (inventario latas), limpeza (checklist equipamentos)

### O que o sistema tem

Nenhuma funcionalidade dedicada.

### Gaps Reais

| # | Gap | Severidade | Detalhe |
|---|---|---|---|
| GAP-33 | Relatorio diario supervisores aves (FM 20.1) | ALTA | 9 secoes com campos especificos de abate/insensibilizacao |
| GAP-34 | Relatorio diario supervisores interno (FM 20.2) | ALTA | 5 secoes: MP, produto, expedicao |
| GAP-35 | Relatorios acompanhamento por segmento (FM 7.1.3.X) | MEDIA | Tripas, rotulagem, limpeza, carne, sem carne, proteinas |

---

## CONSOLIDACAO FINAL

### Total: 35 gaps identificados

| Severidade | Qtd | Gaps |
|---|---|---|
| **CRITICA** | 6 | GAP-10, GAP-11, GAP-12, GAP-18, GAP-19, GAP-22, GAP-27 |
| **ALTA** | 10 | GAP-04, GAP-05, GAP-13, GAP-14, GAP-15, GAP-16, GAP-17, GAP-29, GAP-33, GAP-34 |
| **MEDIA** | 12 | GAP-01, GAP-03, GAP-06, GAP-07, GAP-09, GAP-23, GAP-25, GAP-26, GAP-30, GAP-31, GAP-32, GAP-35 |
| **BAIXA** | 7 | GAP-02, GAP-08, GAP-20, GAP-21, GAP-24, GAP-28 |

### O que JA ESTA BEM IMPLEMENTADO (validado contra conteudo real)

1. **Formulario segmentado 9 segmentos** com campos especificos (criaSuino, tipoPecuaria, capacidade etc.)
2. **Calculo dias auditoria FM 7.1.9** com formula TS=TD+TH+TMS+FTE completa
3. **Numeracao Fambras ABC.SIG.ANOMES.NN** com tabela SIGLA 12.500+ cidades
4. **Proposta comercial** com precificacao dinamica e 7 multiplicadores
5. **Assinatura eletronica** (4 provedores)
6. **Comite de decisao** 4 revisores sequenciais com unanimidade
7. **Suspensao/Cancelamento** com tipos e prazos corretos (3 meses / 1 ano entressafra)
8. **Alteracao de escopo** com workflow de aprovacao RT
9. **Alocacao auditores** com competencias FM 6.1.4 e match scoring
10. **Categorias industriais** GSO/SMIIC dual-standard (A-K)
11. **Workflow 17 fases** com auto-advance e phase history
12. **Documentos** com upload S3, validacao, versionamento
13. **Certificado** com PDF, QR code e verificacao publica
14. **Multi-pais** (30 paises, 25 moedas, tax IDs)
