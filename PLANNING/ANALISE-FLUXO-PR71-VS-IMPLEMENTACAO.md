# Análise: PR 7.1 Rev 22 vs Fluxo Implementado

**Data**: 2026-03-17
**Fonte**: `PR 7.1 COND DE CONCES MAN EXT RED SUSP CANC E TER DE CERT (REV 22) PT.pdf`
**Documento**: PR 7.1 Rev 22 | Data: 23/09/2025 | 65 páginas | FAMBRAS Halal Certificação

---

## 1. RESUMO EXECUTIVO

O fluxo implementado no sistema (17 fases) **atende parcialmente** o PR 7.1. A estrutura principal de certificação inicial está razoavelmente coberta, mas existem **lacunas significativas** em funcionalidades regulatórias, tipos de processo, regras de negócio e controles obrigatórios.

### Scorecard Geral

| Área | Cobertura | Classificação |
|------|-----------|---------------|
| Fluxo de Certificação Inicial | ~70% | PARCIAL |
| Fluxo de Manutenção | ~40% | INSUFICIENTE |
| Fluxo de Renovação | ~45% | INSUFICIENTE |
| Fluxo de Extensão | ~30% | INSUFICIENTE |
| Suspensão / Cancelamento / Término | ~10% | CRÍTICO |
| Comitê de Decisão (4 passos) | ~50% | PARCIAL |
| Categorias Industriais (GSO/SMIIC) | ~15% | CRÍTICO |
| Controle de Prazos e Vencimentos | ~20% | INSUFICIENTE |
| Auditoria Não Anunciada | 0% | NÃO IMPLEMENTADO |
| Ensaios Laboratoriais | 0% | NÃO IMPLEMENTADO |
| Reconhecimentos Internacionais | ~10% | CRÍTICO |
| Cálculo Tempo de Auditoria | 0% | NÃO IMPLEMENTADO |

---

## 2. FLUXO DO PR 7.1 - CERTIFICAÇÃO INICIAL (Anexo 3, Pág. 61)

### 2.1 Etapas do Fluxograma Oficial vs Implementação

| # | Etapa PR 7.1 (Anexo 3) | Responsável | Fase Implementada | Status |
|---|----------------------|-------------|-------------------|--------|
| 1 | Solicitação de certificação | Empresa | Fase 1: `cadastro_solicitacao` | OK |
| 2 | Revisão da solicitação + envio de proposta e contrato | FAMBRAS | Fase 2: `analise_documental_inicial` | PARCIAL - Revisão da solicitação (FM 7.1.9) com cálculo de tempo de auditoria NÃO implementado |
| 3 | Solicitação da documentação técnica necessária | FAMBRAS | - | NÃO IMPLEMENTADO - Não há etapa de solicitação documental específica (FM 7.4.2.1/7.4.2.2) |
| 4 | Envio da documentação | Empresa | Parcial via upload de documentos | PARCIAL - Não há controle de prazo de 30 dias antes da auditoria |
| 5 | Análise da documentação | FAMBRAS | Fase 2: `analise_documental_inicial` | PARCIAL - Falta análise pelo especialista islâmico |
| 6 | Assinatura do contrato + emissão da NF de pagamento | Ambos | Fases 6-7: `elaboracao_contrato` → `assinatura_contrato` | OK |
| 7 | Planejamento e envio do plano de auditoria Estágio 1 | FAMBRAS | Fase 9: `planejamento_auditoria` | PARCIAL - Não gera FM 7.4.3.X automaticamente. Não envia plano 7 dias antes |
| 8 | Auditoria de Estágio 1 | FAMBRAS | Fase 10: `auditoria_estagio1` | PARCIAL - Ver seção 3 |
| 9 | Emissão e envio do relatório de auditoria Estágio 1 | FAMBRAS | - | NÃO IMPLEMENTADO - Não há geração de relatório FM 7.7.4.X |
| 10 | Respostas às não conformidades + envio do plano de ação e evidências | Empresa | Fases 12-13: `analise_nao_conformidades` → `correcao_nao_conformidades` | PARCIAL - Falta prazo de 7 dias para resposta. Falta distinção maior/menor |
| 11 | Aprovação do plano de ação e evidências | FAMBRAS | Fase 14: `validacao_correcoes` | PARCIAL - Falta loop de rejeição com comentários |
| 12 | Agendamento e planejamento e envio do plano de auditoria Estágio 2 | FAMBRAS | Volta para Fase 9 implicitamente | PARCIAL - Não há controle de intervalo máximo de 6 meses entre Estágio 1 e 2 |
| 13 | Auditoria de Estágio 2 | FAMBRAS | Fase 11: `auditoria_estagio2` | PARCIAL - Ver seção 3 |
| 14 | Coleta de amostras laboratoriais (quando aplicável) | FAMBRAS | - | NÃO IMPLEMENTADO |
| 15 | Envio das amostras ao laboratório acreditado | Empresa | - | NÃO IMPLEMENTADO |
| 16 | Emissão e envio do relatório de auditoria Estágio 2 | FAMBRAS | - | NÃO IMPLEMENTADO |
| 17 | Respostas às NCs do Estágio 2 | Empresa | Fases 12-14 (reutilizadas) | PARCIAL |
| 18 | Encerramento técnico do processo e organização de todos os registros | FAMBRAS | - | NÃO IMPLEMENTADO |
| 19 | Avaliação do comitê de decisão | FAMBRAS | Fase 15: `comite_tecnico` | PARCIAL - Ver seção 4 |
| 20 | Emissão do certificado Halal | FAMBRAS | Fase 16: `emissao_certificado` | PARCIAL - Não distingue 3 modelos (GAC/HAK/WHFC) |

---

## 3. LACUNAS NAS AUDITORIAS (Seções 10.7 do PR 7.1)

### 3.1 Restrições de Estágio 1 por Categoria (Seção 10.7.5.1)

O PR 7.1 exige que o Estágio 1 seja **obrigatoriamente presencial (in loco)** para:
- **GSO 2055-2**: Categorias C, D, E, I e K
- **SMIIC 02**: Categorias C, D, I, K e L

Para as demais categorias, pode ser **remoto/online**.

**Implementação**: O `WorkflowService` valida restrições Gulf para categorias C, D, E, I, K - **parcialmente correto**, mas:
- Falta campo `auditMode` (presencial/remoto) no modelo de Audit
- Falta validação específica para SMIIC (categorias diferentes)
- Não há registro do motivo se for presencial vs remoto

### 3.2 Regras de Intervalo entre Estágios (Seção 10.7.5.1)

> "O intervalo razoavelmente aceito entre as auditorias do estágio 1 e do estágio 2 não deva ultrapassar **6 meses**. A auditoria do estágio 1 deve ser repetida se um intervalo maior for necessário."

**Implementação**: NÃO há validação de intervalo máximo entre estágios.

### 3.3 Proibição de Estágios Sequenciais (Seção 10.7.6)

> "Não é permitido realizar as auditorias de estágio 1 e estágio 2 em sequência. Inclusive não é permitido realizar a auditoria de estágio 2 antes de emitir o relatório da auditoria do estágio 1, com parecer favorável."

**Implementação**: O workflow exige Estágio 1 completo antes do 2, MAS não valida:
- Que o relatório do Estágio 1 foi emitido
- Que houve parecer favorável
- Que as NCs do Estágio 1 foram encerradas ANTES de agendar o Estágio 2

### 3.4 Composição da Equipe de Auditoria (Seção 10.7.4)

O PR 7.1 exige:
- Mínimo 1 auditor técnico + 1 especialista islâmico (Sheikh)
- Para SMIIC: 2 auditores técnicos + 1 especialista islâmico
- Não repetir membros por mais de 3 anos consecutivos (imparcialidade)

**Implementação**: O `MatchingService.suggestAuditors()` existe mas:
- NÃO valida composição mínima obrigatória
- NÃO distingue auditor técnico vs especialista islâmico
- NÃO verifica histórico de 3 anos de imparcialidade
- NÃO diferencia requisitos GSO vs SMIIC

### 3.5 Prazo de Envio do Plano de Auditoria (Seção 10.7.3)

> "O plano será enviado pelo menos **7 dias** antes da data da auditoria."

**Implementação**: NÃO há controle de prazo para envio do plano.

### 3.6 Prazo de Envio do Relatório (Seção 10.7.6)

> "Os relatórios de auditoria devem ser enviados em no máximo **15 dias corridos** após o encerramento da auditoria."

**Implementação**: NÃO há controle de prazo para envio de relatório.

### 3.7 Auditoria Não Anunciada (Seção 10.7.1)

> "Auditorias não anunciadas devem ocorrer pelo menos **uma vez em cada ciclo de certificação (3 anos)**."

**Implementação**: NÃO IMPLEMENTADO. Não há:
- Tipo de auditoria "não anunciada"
- Notificação 3 meses antes
- Janela de 15 dias
- Controle de que empresa pode informar datas indisponíveis (5 dias)

---

## 4. LACUNAS NO COMITÊ DE DECISÃO (Seção 10.9.1)

### 4.1 Processo de 4 Passos do PR 7.1

O PR 7.1 define um processo rigoroso em **4 passos sequenciais**:

| Passo | Descrição PR 7.1 | Implementado? |
|-------|------------------|---------------|
| **1º** | **Aprovação técnica**: Especialista técnico do comitê (que NÃO participou da auditoria) revisa todo o processo e aprova via FM 7.1.1 | PARCIAL - O sistema exige 4 votos mas não diferencia tipo de membro |
| **2º** | **Aprovação religiosa**: Pelo menos 2 Sheikhs do comitê (que NÃO participaram da auditoria) revisam conformidade Halal via FM 7.1.1 | NÃO - Não distingue Sheikh vs técnico |
| **3º** | **Aprovação unânime**: Todos os membros devem ter emitido parecer. Se algum recusar → volta ao 1º passo | PARCIAL - `canFinalizeCommittee()` exige unanimidade, mas se rejeitado não volta ao 1º passo |
| **4º** | **Emissão do certificado**: RT emite o certificado específico (FM 7.7.1/7.7.2/7.7.2.1) | PARCIAL - Não distingue 3 modelos de certificado |

### 4.2 Composição do Comitê

O PR 7.1 exige:
- **Mínimo 3 membros**: 2 Sheikhs + 1 auditor técnico
- **Nenhum** dos membros pode ter participado da auditoria daquele processo
- Decisões por **unanimidade** (não maioria)

**Implementação**:
- Exige 4 votos (correto, mais rigoroso que o mínimo de 3)
- NÃO valida que membros não participaram da auditoria
- NÃO distingue roles de Sheikh vs técnico
- Unanimidade: SIM, implementado via `canFinalizeCommittee()`

---

## 5. FLUXO DE MANUTENÇÃO (Anexo 3, Pág. 62)

### 5.1 Etapas do Fluxograma vs Implementação

O PR 7.1 define um fluxo específico para Manutenção 1 e 2:

| # | Etapa PR 7.1 | Implementado? | Observação |
|---|-------------|---------------|------------|
| 1 | Contato 6 meses antes para início da manutenção | NÃO | Não há sistema de alertas/notificações por vencimento |
| 2 | Atualização das informações de solicitação de certificação | NÃO | Não solicita novo FM 7.2.1.1 |
| 3 | Revisão da solicitação para confirmação da auditoria | NÃO | Não recalcula tempo de auditoria |
| 4 | Atualização da documentação técnica | PARCIAL | Upload de documentos existe |
| 5 | Envio de documentação | PARCIAL | Sem controle de prazo 30 dias |
| 6 | Análise da documentação | PARCIAL | Fase 8 `avaliacao_documental` |
| 7 | Emissão da NF de pagamento da manutenção | NÃO | Sem integração financeira |
| 8 | Agendamento e planejamento Estágio 2 | PARCIAL | |
| 9 | Auditoria de Estágio 2 (mínimo 1/3 do tempo total) | PARCIAL | Não valida duração mínima 1/3 |
| 10 | Coleta de amostras laboratoriais | NÃO | |
| 11 | Relatório de auditoria Estágio 2 | NÃO | Não gera FM |
| 12 | NCs + plano de ação + evidências | PARCIAL | |
| 13 | Encerramento técnico | NÃO | |
| 14 | Comitê de decisão (aprovado → revalidação / não aprovado → suspensão ou cancelamento) | PARCIAL | Decisão binária, sem caminho de suspensão |
| 15 | Revalidação do certificado Halal | PARCIAL | |

### 5.2 Regras Críticas de Manutenção NÃO Implementadas

1. **Prazo de 12 meses**: A primeira manutenção não deve exceder 12 meses desde o último dia do Estágio 2 inicial
2. **Auditoria não anunciada**: Uma das manutenções (1 ou 2) deve ser não anunciada
3. **Duração mínima 1/3**: Auditoria de manutenção deve durar no mínimo 1/3 do tempo total calculado
4. **Suspensão automática**: Não atendimento do prazo de manutenção implica suspensão do certificado
5. **Verificação de uso do selo Halal**: Verificar nos produtos certificados o uso correto do selo

---

## 6. FLUXO DE RENOVAÇÃO (Anexo 3, Pág. 63)

### 6.1 Diferenças entre PR 7.1 e Implementação

O fluxo de renovação no PR 7.1 é quase idêntico ao de manutenção, mas com estas particularidades:

| Requisito PR 7.1 | Implementado? |
|------------------|---------------|
| Contato 6 meses antes do vencimento para início | NÃO |
| Solicitação de renovação pelo cliente 6 meses antes | NÃO - Sem alerta |
| Nova proposta comercial (FM 7.2.3/7.2.4) | PARCIAL - Workflow suporta proposta mas NÃO específica de renovação |
| Novo contrato ou aditivo contratual | PARCIAL - Workflow suporta contrato |
| Auditoria Estágio 2 com 2/3 do tempo total | NÃO - Sem validação de duração 2/3 |
| Possibilidade de Estágio 1 (se mudanças significativas) | NÃO - Fluxo de renovação pula estágio 1 |
| Restauração em até 6 meses após expiração | NÃO - Sem conceito de "restauração" |
| Data de expiração baseada no ciclo anterior | NÃO - Sem vínculo entre ciclos |
| SMIIC: reiniciar ciclo completo (Est. 1 + Est. 2 a 100%) | NÃO - Sem diferenciação por norma |

### 6.2 Implementação do RequestType

O `WorkflowService` define `requiredPhases` por tipo:
- **Renovação**: Pula fases 3-8 (proposta, contrato, avaliação documental)
- **PR 7.1 Seção 13**: Renovação INCLUI nova proposta (13.3), novo contrato (13.3), e análise documental (13.5)

**DIVERGÊNCIA CRÍTICA**: A implementação pula fases que o PR 7.1 exige para renovação.

---

## 7. EXTENSÃO DA CERTIFICAÇÃO (Seção 10.9.3)

### 7.1 Regras do PR 7.1 vs Implementação

| Requisito PR 7.1 | Implementado? |
|------------------|---------------|
| Nova solicitação FM 7.2.1.1 com escopo atualizado | PARCIAL |
| Análise crítica para determinar quais etapas são necessárias | NÃO - Fluxo fixo de "Ampliação" |
| Produto idêntico → pode ser isento de auditoria e análise lab | NÃO - Sem lógica de isenção |
| Novo fluxo de fabricação → obrigatório Estágio 2 | NÃO - Sem validação |
| Normalmente só Estágio 2 | PARCIAL |

---

## 8. SUSPENSÃO, CANCELAMENTO E TÉRMINO (Seções 11, 12, 14)

### 8.1 Status Atual: CRÍTICO

Estas funcionalidades são praticamente **inexistentes** na implementação:

| Funcionalidade | PR 7.1 | Implementação |
|----------------|--------|---------------|
| **Suspensão** (Seção 11) | 7 motivos listados, período máx. 3 meses, notificação formal, retenção de documentos | Apenas `WorkflowStatus.cancelado` existe - sem conceito de suspensão |
| **Cancelamento** (Seção 12) | 4 motivos, só após suspensão (exceto distrato), devolução de docs, notificação a acreditadores | Não implementado como processo |
| **Término** (Seção 14) | Decisão do cliente, remoção de marca, notificação | Não implementado |
| **Redução de Escopo** (Seção 10.13) | Por vontade da empresa ou decisão FAMBRAS, novo certificado com escopo reduzido | Não implementado |
| **Auditorias Especiais** (Seção 10.12) | 4 tipos: mudanças, alterações normativas, pouca antecedência, extraordinárias | Não implementado |

### 8.2 Regra Crítica Ausente

> "Os certificados Halal só podem ser cancelados **após serem suspensos**, salvo em caso de distrato." (Seção 12, Nota)

O sistema não implementa este fluxo obrigatório: Suspensão → Cancelamento.

---

## 9. RECONHECIMENTOS INTERNACIONAIS (Seção 15)

### 9.1 Funcionalidades NÃO Implementadas

| Requisito | Descrição | Status |
|-----------|-----------|--------|
| **Modelo de certificado por acreditador** | 3 versões: Logo GAC (Golfo), Logo HAK (Turquia), Logo WHFC (Malásia/Indonésia) | NÃO - Certificado único sem seleção de logo |
| **Cadastro HAKSIS** (Turquia) | Empresas SMIIC devem ser cadastradas no sistema HAKSIS | NÃO |
| **Cadastro SiHalal** (Indonésia) | Empresas devem ser cadastradas no sistema BPJPH | NÃO |
| **Cadastro MOIAT** (Emirados) | Empresas devem ser listadas na MOIAT, prazo ~20 dias | NÃO |
| **Cadastro SFDA** (Arábia Saudita) | Frigoríficos/cárneos devem ser cadastrados na SFDA | NÃO |
| **Restrições por país** | Egito (ISEG exclusivo), Irã (restrições cárneos) | NÃO |
| **Certificado de embarque** (por lote) | FM 7.7.3 - Para frigoríficos, emitido por lote | NÃO |

---

## 10. CÁLCULO DO TEMPO DE AUDITORIA (Seção 10.2)

### 10.1 Funcionalidade Ausente Completa

O PR 7.1 define que o FM 7.1.9 deve calcular automaticamente o tempo de auditoria com base em:
- Categoria e subcategoria industrial (GSO 2055-2 e SMIIC 02)
- Complexidade do processo
- Número de funcionários / turnos
- Número de planos APPCC
- Número de produtos certificados
- Quantidade de linhas de produtos
- Nível de maturidade do sistema Halal
- Nível de automação

E produzir **duas durações**: uma baseada no GSO 2055-2 e outra na SMIIC 02.

**Implementação**: O campo `auditDays` existe por categoria no seed, mas:
- NÃO há cálculo automático
- NÃO considera número de funcionários, APPCC, etc.
- NÃO produz duas durações (GSO vs SMIIC)
- NÃO permite redução de até 30% (IAF MD 5)

---

## 11. CONTROLES DE PRAZO E DOCUMENTOS

### 11.1 Prazos do PR 7.1 NÃO Implementados

| Prazo | Referência | Implementado? |
|-------|-----------|---------------|
| Documentos enviados 30 dias antes da auditoria | Seção 10.5 | NÃO |
| FAMBRAS responde em 7 dias após recebimento de docs | Seção 10.5 | NÃO |
| Plano de auditoria enviado 7 dias antes | Seção 10.7.3 | NÃO |
| Relatório enviado em 15 dias após auditoria | Seção 10.7.6 | NÃO |
| Empresa responde NCs em 7 dias | Seção 10.7.7 | NÃO |
| Auditor encerra NCs em 7 dias após receber evidências | Seção 10.7.7 | NÃO |
| Comitê em até 15 dias após finalização das etapas | Seção 10.9 | NÃO |
| Contato para manutenção 6 meses antes | Manutenção | NÃO |
| Auditoria manutenção agendada 90 dias antes do vencimento | Seção 10.11 | NÃO |
| Manutenção em até 12 meses após Estágio 2 | Seção 10.11 | NÃO |
| Solicitação de renovação 6 meses antes da expiração | Seção 13 | NÃO |
| Renovação planejada 90 dias antes da expiração | Seção 13 | NÃO |
| Certificado atualizado em 20 dias (extensão sem auditoria) | Seção 10.12.1 | NÃO |
| Restauração em até 6 meses após expiração | Seção 13 | NÃO |
| Suspensão máxima de 3 meses | Seção 11 | NÃO |

### 11.2 Formulários Referenciados no PR 7.1 NÃO Implementados

| Código | Nome | Status |
|--------|------|--------|
| FM 7.2.1.1 | Solicitação de certificação | PARCIAL - Formulário existe mas sem todos os campos |
| FM 7.1.9 | Relatório de Revisão de Solicitação e Cálculo do Tempo de Auditoria | NÃO |
| FM 7.2.2 | Controle de Propostas | NÃO |
| FM 7.2.3 / FM 7.2.4 | Proposta Comercial | PARCIAL - Proposta existe mas sem modelo formal |
| FM 4.1.1 | Contrato de Certificação | PARCIAL - Contrato existe mas sem modelos específicos |
| FM 7.4.3.X | Plano de Auditoria - Estágio 1 | NÃO |
| FM 7.4.4.X | Plano de Auditoria - Estágio 2 | NÃO |
| FM 7.7.4.X | Relatório de Auditoria (vários modelos por categoria) | NÃO |
| FM 7.7.5.3 | Relatório de Não Conformidade | PARCIAL - NCs existem mas sem formulário padrão |
| FM 7.1.1 | Check list do processo (usado pelo comitê) | NÃO |
| FM 7.1.2.1 | Programa de controle de vencimento - Industrial | NÃO |
| FM 7.1.2.2 | Programa de controle de vencimento - Frigorífico | NÃO |
| FM 7.8.1 | Lista de Produtos Certificados Industrial | PARCIAL |
| FM 7.8.2 | Lista de Produtos Certificados Frigorífico | NÃO |
| FM 7.6.1 | Relatório de coleta de amostra | NÃO |
| FM 6.1.4 | Lista de Pessoal Qualificado | PARCIAL - AuditorCompetency |
| FM 7.7.1/7.7.2/7.7.2.1 | Certificado Halal (3 modelos) | PARCIAL - 1 modelo |
| FM 7.7.3 | Certificado de embarque (por lote) | NÃO |
| FM 4.2.3 | Declaração de confidencialidade e imparcialidade | NÃO |

---

## 12. NÃO CONFORMIDADES (Seção 10.7.7)

### 12.1 Regras do PR 7.1 vs Implementação

| Requisito | PR 7.1 | Implementação |
|-----------|--------|---------------|
| Distinção entre NC Maior e NC Menor | SIM (Seções 5.8 e 5.9) | NÃO - Sem classificação por severidade |
| NC Maior: afeta capacidade do sistema | SIM | NÃO |
| NC Menor: não afeta capacidade | SIM | NÃO |
| Observação (não obriga resposta) | SIM | NÃO - Sem conceito de "observação" |
| Prazo de resposta: 7 dias | SIM | NÃO - Sem controle de prazo |
| Auditor avalia resposta e aceita ou rejeita com comentários | SIM | PARCIAL |
| Evidências obrigatórias (mesmo para menor) | SIM | NÃO - Sem upload de evidências vinculado a NC |
| NC com prazo maior (mudanças estruturais): plano de ação aceito | SIM | NÃO |
| Prazo final: antes do vencimento do certificado (sugere 30 dias antes) | SIM | NÃO |
| Auditor encerra NC em 7 dias após receber evidências | SIM | NÃO |

---

## 13. O QUE FUNCIONA BEM

Apesar das lacunas, a implementação tem uma base sólida:

| Aspecto | Status |
|---------|--------|
| Estrutura de 17 fases com transições controladas | BOM |
| Permissões por role por fase | BOM |
| Auto-advance em fases comerciais (proposta, contrato) | BOM |
| Comitê com unanimidade | BOM |
| WorkflowPhaseHistory (tracking de tempo por fase) | BOM |
| Suporte a múltiplos tipos (Nova, Renovação, Ampliação, Manutenção) | PARCIAL - Fluxos precisam ajuste |
| Sugestão automática de auditores | BOM (conceito) |
| Classificação industrial (3 níveis hierárquicos) | BOM (estrutura), RUIM (dados) |

---

## 14. PLANO DE AÇÃO PRIORIZADO

### Prioridade 1 - CRÍTICO (Bloqueantes regulatórios)

| # | Ação | Impacto | Complexidade |
|---|------|---------|-------------|
| 1.1 | Corrigir categorias industriais (GSO 2055-2 + SMIIC 02) conforme análise anterior | Certificados com categorias erradas | ALTA |
| 1.2 | Implementar Suspensão como status/processo (não é cancelamento) | Obrigatório pelo PR 7.1 | MÉDIA |
| 1.3 | Implementar fluxo Suspensão → Cancelamento (cancelamento só após suspensão) | Obrigatório | MÉDIA |
| 1.4 | Corrigir fluxo de Renovação para incluir proposta + contrato + análise documental | Divergência com PR 7.1 | BAIXA |
| 1.5 | Implementar distinção NC Maior vs NC Menor vs Observação | Requisito normativo | MÉDIA |
| 1.6 | Validar composição do comitê: distinguir Sheikh vs Técnico, verificar não-participação na auditoria | Requisito normativo | MÉDIA |

### Prioridade 2 - IMPORTANTE (Controles operacionais)

| # | Ação | Impacto |
|---|------|---------|
| 2.1 | Implementar controles de prazo (alertas de vencimento, 6 meses antes, 90 dias, etc.) | Gestão do ciclo de 3 anos |
| 2.2 | Validar intervalo máximo de 6 meses entre Estágio 1 e Estágio 2 | Regra normativa |
| 2.3 | Implementar modelos de certificado (GAC/HAK/WHFC) | Reconhecimento internacional |
| 2.4 | Implementar cálculo automático do tempo de auditoria (FM 7.1.9) | Operacional |
| 2.5 | Implementar auditoria modo presencial vs remoto (com validação por categoria) | Regra normativa |
| 2.6 | Implementar Redução de Escopo como tipo de processo | Previsto no PR 7.1 |
| 2.7 | Implementar Término como tipo de processo | Previsto no PR 7.1 |

### Prioridade 3 - DESEJÁVEL (Melhoria operacional)

| # | Ação | Impacto |
|---|------|---------|
| 3.1 | Implementar auditoria não anunciada | 1x por ciclo, obrigatório |
| 3.2 | Implementar geração de relatórios de auditoria (FM 7.7.4.X) | Documentação |
| 3.3 | Implementar ensaios laboratoriais (coleta, envio, resultado) | Quando aplicável |
| 3.4 | Implementar auditorias especiais (4 tipos) | Operacional |
| 3.5 | Implementar cadastros em sistemas internacionais (HAKSIS, SiHalal, MOIAT, SFDA) | Exportação |
| 3.6 | Implementar certificado de embarque (por lote) para frigoríficos | Operacional |
| 3.7 | Implementar controle de imparcialidade (auditores não repetir 3+ anos) | Regra normativa |

---

## 15. CONCLUSÃO

O sistema HalalSphere implementa uma **boa estrutura base** para o fluxo de certificação, com as 17 fases, controle de transições e permissões por role. No entanto, está **significativamente aquém** dos requisitos do PR 7.1 Rev 22 em:

1. **Gestão do ciclo completo de 3 anos** (manutenção 1, manutenção 2, renovação)
2. **Controles regulatórios** (prazos, composição de equipe, categorias industriais)
3. **Processos adversos** (suspensão, cancelamento, redução, término)
4. **Reconhecimentos internacionais** (múltiplos modelos de certificado, cadastros)
5. **Ensaios laboratoriais e amostras**
6. **Documentação formal** (relatórios, formulários FM, planos de auditoria)

A implementação atual atende ao fluxo "caminho feliz" da certificação inicial (~70%), mas falta robustez para os cenários operacionais reais que a FAMBRAS Halal enfrenta no dia-a-dia.
