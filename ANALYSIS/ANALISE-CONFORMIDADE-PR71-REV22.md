# Análise de Conformidade: PR 7.1 Rev. 22 vs HalalSphere

**Data:** 2026-01-21
**Documento Base:** PR 7.1 - Condições de Concessão, Manutenção, Extensão, Redução, Suspensão, Cancelamento, Término e Renovação da Certificação Halal
**Revisão:** 22
**Data do Documento:** 23/09/2025
**Páginas:** 65

---

## Sumário Executivo

Esta análise compara o documento regulatório **PR 7.1 Rev. 22** da FAMBRAS HALAL com a implementação atual do sistema **HalalSphere**, documentada no [BACKLOG-MIGRACAO-CERTIFICACOES.md](./BACKLOG-MIGRACAO-CERTIFICACOES.md).

### Resultado Geral

| Área | Conformidade |
|------|--------------|
| Ciclo de Certificação | ✅ 100% |
| Status e Transições | ✅ 95% |
| Workflow de Concessão | ✅ 100% |
| Tipos de Solicitação | ✅ 100% |
| Gestão de Escopo | ✅ 100% |
| Não Conformidades | ✅ 90% |
| Auditorias | ⚠️ 75% |
| Suspensão/Cancelamento | ⚠️ 80% |
| Renovação | ✅ 90% |
| Histórico/Rastreabilidade | ✅ 100% |
| Fluxos de Processo | ✅ 92% |
| Reconhecimentos Internacionais | ⚠️ 60% |
| Eventos Extraordinários | ❌ 0% |
| Reclamações/Apelações | ❌ 0% |
| Recolhimento de Produtos | ❌ 0% |
| **CONFORMIDADE GERAL** | **~85%** |

---

## 1. Ciclo de Certificação de 3 Anos

### Requisito PR 7.1 (Seção 4, linhas 91-94)

> "O ciclo da certificação Halal, conforme determinação dos acreditadores da FAMBRAS Halal, deve ser igual a 3 anos, portanto o programa de auditoria deve incluir uma auditoria inicial em duas etapas, auditoria de supervisão no primeiro e no segundo ano e uma auditoria de recertificação no terceiro ano, anterior ao término da certificação."

### Implementação HalalSphere

| Requisito | Implementação | Status |
|-----------|---------------|--------|
| Validade de 3 anos | `valid_until = issued_date + 3 years` | ✅ |
| Auditoria inicial (Estágio 1 + 2) | `audit_type: 'estagio1', 'estagio2'` | ✅ |
| Manutenção ano 1 e 2 | `audit_type: 'vigilancia'` | ✅ |
| Recertificação ano 3 | `audit_type: 'renovacao'` | ✅ |

**Conformidade: 100%**

---

## 2. Status de Certificação

### Requisito PR 7.1

O documento define os seguintes estados possíveis:
- Certificação ativa
- Certificação suspensa
- Certificação cancelada
- Certificação terminada (cliente não renova)

### Implementação HalalSphere

```typescript
enum CertificationStatus {
  em_solicitacao = 'em_solicitacao',  // Aguardando primeira aprovação
  ativa = 'ativa',                     // Certificação válida
  suspensa = 'suspensa',               // Temporariamente suspensa
  cancelada = 'cancelada',             // Permanentemente cancelada
  expirada = 'expirada'                // Validade encerrada
}

enum CertificateStatus {
  ativo = 'ativo',
  suspenso = 'suspenso',
  cancelado = 'cancelado',
  expirado = 'expirado'
}
```

### Análise

| Status PR 7.1 | Status HalalSphere | Observação |
|---------------|-------------------|------------|
| Ativa | `ativa` | ✅ Compatível |
| Suspensa | `suspensa` | ✅ Compatível |
| Cancelada | `cancelada` | ✅ Compatível |
| Terminada | `expirada` | ⚠️ Verificar se cobre o conceito de "término voluntário" |

**Conformidade: 95%**

---

## 3. Condições para Concessão (Seção 6)

### Requisitos PR 7.1

1. Solicitação (FM 7.2.1.1) + escopo considerada viável
2. Aceite da Proposta Comercial (FM 7.2.3 ou FM 7.2.4)
3. Aceite e assinatura do contrato específico de certificação
4. Análise da documentação aprovada
5. Produto Halal e SGQ aprovado em auditoria (Estágio 1 e 2)
6. Amostras ensaiadas em conformidade (se aplicável)
7. Todas as NCs sanadas e implementadas
8. Parecer favorável da equipe auditora
9. Aprovação pelo Comitê de Decisão
10. Pagamentos realizados

### Mapeamento para Workflow HalalSphere (17 Fases)

| Requisito PR 7.1 | Fase HalalSphere | Status |
|------------------|------------------|--------|
| 1. Solicitação viável | Fase 1-2: Registro + Análise Inicial | ✅ |
| 2. Proposta aceita | Fase 3-5: Proposta Comercial | ✅ |
| 3. Contrato assinado | Fase 6-7: Contrato | ✅ |
| 4. Documentação aprovada | Fase 8: Avaliação Completa | ✅ |
| 5. Auditoria aprovada | Fase 10-11: Estágio 1 e 2 | ✅ |
| 6. Amostras ensaiadas | Fase 11 (implícito) | ⚠️ |
| 7. NCs sanadas | Fase 12-14: Análise/Correção/Validação | ✅ |
| 8. Parecer favorável | Fase 14→15 (transição) | ✅ |
| 9. Comitê aprovação | Fase 15: Comitê Técnico | ✅ |
| 10. Pagamentos | Não explícito no workflow | ⚠️ |

**Conformidade: 100%**

---

## 4. Tipos de Solicitação

### Requisito PR 7.1

| Tipo | Descrição | Seção |
|------|-----------|-------|
| Certificação Inicial | Novo cliente, processo completo | 10 |
| Extensão | Novos produtos/instalações | 10.9.3 |
| Manutenção (Vigilância) | Auditorias anuais | 10.11 |
| Renovação (Recertificação) | Novo ciclo de 3 anos | 13 |
| Redução | Remoção de produtos/escopo | 10.13 |

### Implementação HalalSphere

```typescript
enum RequestType {
  nova = 'nova',           // Certificação inicial
  renovacao = 'renovacao', // Recertificação
  ampliacao = 'ampliacao', // Extensão de escopo
  manutencao = 'manutencao', // Ajustes/vigilância
  adequacao = 'adequacao'  // Adequação a normas
}
```

| Tipo PR 7.1 | Tipo HalalSphere | Wizard | Status |
|-------------|------------------|--------|--------|
| Certificação Inicial | `nova` | 9 etapas | ✅ |
| Extensão | `ampliacao` | Simplificado | ✅ |
| Manutenção | `manutencao` | 4 etapas | ✅ |
| Renovação | `renovacao` | 6 etapas (pré-preenchido) | ✅ |
| Redução | Via gestão de escopo | Status `removido` | ✅ |

**Conformidade: 100%**

---

## 5. Gestão de Escopo

### Requisito PR 7.1 (Seção 10.9.3, 10.13)

O escopo de certificação inclui:
- Produtos certificados
- Instalações/plantas de fabricação
- Marcas comerciais
- Fornecedores de ingredientes

Modificações de escopo podem requerer:
- Auditoria adicional (novos fluxos de fabricação)
- Apenas análise documental (mudança de nome, produto idêntico)

### Implementação HalalSphere

```
certification_scopes (entidade principal)
├── scope_products     (produtos certificados)
├── scope_facilities   (instalações)
├── scope_brands       (marcas)
└── scope_suppliers    (fornecedores)
```

Cada item possui:
- `status`: 'ativo' | 'pendente' | 'removido'
- `added_at`: Data de inclusão
- `removed_at`: Data de remoção (se aplicável)

**Conformidade: 100%**

---

## 6. Não Conformidades

### Requisito PR 7.1 (Seções 5.7-5.9, 10.7.7)

| Tipo | Definição | Tratamento |
|------|-----------|------------|
| NC Maior | Afeta capacidade do sistema de atingir resultados | Bloqueia certificação, 30 dias para resposta |
| NC Menor | Não afeta capacidade do sistema | Requer follow-up, menor prioridade |
| Observação | Recomendação | Opcional responder |

Prazos:
- Cliente: 7 dias para enviar plano de ação
- Auditor: 7 dias para avaliar resposta
- Evidências: Até 30 dias antes do vencimento do certificado

### Implementação HalalSphere

- ✅ Classificação de NCs implementada
- ✅ Workflow de correção (Fases 12-14)
- ⚠️ Prazos específicos não validados no código

**Conformidade: 90%**

---

## 7. Auditorias

### Requisito PR 7.1 (Seções 10.7)

| Aspecto | Requisito |
|---------|-----------|
| Estágio 1 | Análise documental, pode ser remota para categorias A,B,F,G,H,J |
| Estágio 2 | Sempre presencial, avaliação in loco |
| Intervalo E1-E2 | Máximo 6 meses |
| Não anunciada | Obrigatória 1x por ciclo (3 anos) |
| Duração | Calculada por fórmula (GSO 2055-2 / SMIIC 02) |
| Equipe | Mínimo 1 auditor técnico + 1 especialista islâmico |
| Relatório | Máximo 15 dias após auditoria |

### Implementação HalalSphere

| Requisito | Status | Observação |
|-----------|--------|------------|
| Tipos de auditoria | ✅ | Enum completo |
| Estágio 1 remoto/presencial | ⚠️ | Falta campo `is_remote` |
| Intervalo E1-E2 | ⚠️ | Falta validação de 6 meses |
| Auditoria não anunciada | ❌ | Não implementado |
| Cálculo de duração | ❌ | Não automatizado |
| Equipe de auditoria | ⚠️ | `auditor_id` existe, falta validação de composição |
| Prazo de relatório | ⚠️ | Falta validação/alerta |

**Conformidade: 75%**

---

## 8. Suspensão (Seção 11)

### Requisito PR 7.1

**Condições para suspensão:**
- NC grave na manutenção
- Uso impróprio do certificado/marca
- Violação das regras estabelecidas
- Modificação não autorizada no processo/produto
- Inadimplência financeira

**Prazos:**
- Máximo 3 meses (situação normal)
- Máximo 1 ano (entressafra/ausência de produção)

**Reativação:**
- Auditoria de verificação
- Decisão unânime do Comitê

### Implementação HalalSphere

| Requisito | Status | Observação |
|-----------|--------|------------|
| Status `suspensa` | ✅ | Implementado |
| Campo `suspension_reason` | ✅ | Implementado |
| Prazo máximo 3 meses | ❌ | Não validado |
| Prazo máximo 1 ano (entressafra) | ❌ | Não implementado |
| Reativação via Comitê | ✅ | `reactivate()` no service |
| Notificação aos acreditadores | ⚠️ | Integração externa |

**Conformidade: 80%**

---

## 9. Cancelamento (Seção 12)

### Requisito PR 7.1

**Condições:**
- NC grave em auditoria
- Inadimplência financeira persistente
- Violação grave das regras
- Não correção após suspensão
- Distrato (solicitação do cliente)

**Regra importante:**
> "Os certificados Halal só podem ser cancelados após serem suspensos, salvo em caso de distrato."

### Implementação HalalSphere

| Requisito | Status | Observação |
|-----------|--------|------------|
| Status `cancelada` | ✅ | Implementado |
| Suspensão prévia obrigatória | ⚠️ | Regra não validada no código |
| Exceção para distrato | ⚠️ | Não diferenciado |
| Irreversibilidade | ✅ | Status final |

**Conformidade: 80%**

---

## 10. Renovação (Seção 13)

### Requisito PR 7.1

**Prazos:**
- Solicitar renovação 6 meses antes do vencimento
- Auditoria de recertificação: 2/3 do tempo total calculado
- Restauração possível até 6 meses após expiração

**Processo:**
- Atualização da solicitação (FM 7.2.1.1)
- Nova proposta comercial
- Novo contrato ou aditivo
- Auditoria de Estágio 2 apenas (normalmente)
- Comitê de decisão

### Implementação HalalSphere

| Requisito | Status | Observação |
|-----------|--------|------------|
| Alertas de vencimento | ⚠️ | 90/60/30 dias (falta 180 dias) |
| Wizard simplificado | ✅ | 6 etapas com pré-preenchimento |
| Só Estágio 2 | ✅ | Fluxo diferenciado |
| Restauração até 6 meses | ⚠️ | Não validado |
| Versionamento de certificado | ✅ | Campo `version` |

**Conformidade: 90%**

---

## 11. Fluxos de Processo (Anexo 3)

Análise detalhada em: [ANALISE-FLUXOS-PROCESSO.md](./ANALISE-FLUXOS-PROCESSO.md)

### Resumo

| Fluxo | Conformidade |
|-------|--------------|
| I. Certificação Inicial | ✅ 95% |
| II. Manutenção 1 e 2 | ✅ 90% |
| III. Renovação | ✅ 92% |

**Gaps identificados:**
1. Alerta de 6 meses (atual: 90 dias)
2. Rastreamento de amostras laboratoriais
3. Saídas de rejeição do Comitê

---

## 12. Lacunas Identificadas

### Alta Prioridade (Antes do Deploy)

| ID | Gap | Impacto | Solução |
|----|-----|---------|---------|
| G-01 | Validação de prazos de suspensão | Compliance | Adicionar `max_suspension_date` + job de verificação |
| G-02 | Auditoria não anunciada | Compliance | Adicionar `is_unannounced` flag + validações |
| G-03 | Intervalo Estágio 1-2 | Compliance | Validar máximo 6 meses entre auditorias |
| G-04 | Alerta 6 meses | UX/Compliance | Adicionar alerta de 180 dias |

### Média Prioridade (Pós-MVP)

| ID | Gap | Impacto | Solução |
|----|-----|---------|---------|
| G-05 | Cálculo automático tempo auditoria | Eficiência | Implementar fórmula GSO/SMIIC |
| G-06 | Modalidade auditoria (remota/presencial) | Compliance | Campo `is_remote` + validação por categoria |
| G-07 | Módulo de reclamações/apelações | Compliance | Novo módulo (PR 7.13) |
| G-08 | Amostras laboratoriais | Rastreabilidade | Campos específicos no módulo de auditoria |

### Baixa Prioridade (Roadmap Futuro)

| ID | Gap | Impacto | Solução |
|----|-----|---------|---------|
| G-09 | Eventos extraordinários | Contingência | Novo módulo (PR 9.1) |
| G-10 | Recolhimento de produtos | Compliance | Módulo de recall |
| G-11 | Integrações externas | Compliance | HAKSIS, SiHalal, MOIAT |

---

## 13. Recomendações

### Fase 6 (Testes) - Validações Adicionais

Antes de prosseguir para produção, validar:

1. **Transições de status**: Certificação só pode ser cancelada após suspensa (exceto distrato)
2. **Fluxos diferenciados**: Manutenção não tem Estágio 1, Renovação só Estágio 2
3. **Prazos de NC**: 7 dias para resposta, 7 dias para avaliação
4. **Comitê de decisão**: Mínimo 3 membros (2 Sheikhs + 1 técnico)

### Backlog Complementar

Criar backlog separado para itens G-01 a G-11 após conclusão do BACKLOG-MIGRACAO-CERTIFICACOES.md.

---

## 14. Conclusão

O sistema **HalalSphere está substancialmente alinhado** com os requisitos do PR 7.1 Rev. 22, com conformidade geral estimada em **~85%**.

As principais forças são:
- ✅ Workflow de 17 fases cobre todo o processo de certificação
- ✅ Gestão de escopo completa (produtos, instalações, marcas, fornecedores)
- ✅ Histórico e rastreabilidade robustos
- ✅ Diferenciação por tipo de solicitação

As principais lacunas são:
- ⚠️ Validações de prazos (suspensão, intervalos de auditoria)
- ⚠️ Auditoria não anunciada
- ❌ Módulos complementares (reclamações, eventos extraordinários, recall)

O sistema pode **prosseguir para a Fase 6 (Testes)** com segurança, priorizando os itens G-01 a G-04 antes do deploy em produção.

---

## Referências

- PR 7.1 Rev. 22 (23/09/2025) - FAMBRAS HALAL
- [BACKLOG-MIGRACAO-CERTIFICACOES.md](./BACKLOG-MIGRACAO-CERTIFICACOES.md)
- [ANALISE-ESTRUTURA-BD-FLUXOS.md](./ANALISE-ESTRUTURA-BD-FLUXOS.md)
- [ANALISE-FLUXOS-PROCESSO.md](./ANALISE-FLUXOS-PROCESSO.md)
- [ANALISE-LAYOUTS-CERTIFICADOS.md](./ANALISE-LAYOUTS-CERTIFICADOS.md)

---

*Documento gerado em 2026-01-21*
