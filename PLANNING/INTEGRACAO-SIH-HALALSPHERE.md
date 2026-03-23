# Plano de Integracao: SIH <-> HalalSphere

**Data**: 2026-03-23
**Status**: Planejado
**Estimativa**: 5 SP (Epic H do PLANO-IMPLEMENTACAO-GAPS-FAMBRAS.md)
**Referencia**: PR 7.1 Rev 22 — GAPs 33, 34, 35

---

## Contexto

O SIH (Supervisao Industrial Halal) e o HalalSphere sao sistemas independentes:

| | SIH | HalalSphere |
|---|-----|-------------|
| **Funcao** | Supervisao diaria de planta (frigorifico) | Gestao de certificacao Halal |
| **URL** | supervisao-industrial.ecohalal.solutions | gestaodecertificacoes.ecohalal.solutions |
| **Backend** | NestJS 11 + Prisma 7 + PostgreSQL (porta 3334) | NestJS 11 + Prisma 7 + PostgreSQL (porta 3333) |
| **Auth** | JWT RS256 (chaves proprias) | JWT RS256 (chaves proprias) |
| **DB** | Separado | Separado |
| **Modelos** | 10 modelos, 14 services | 47 modelos, 54 services |

O SIH ja cobre FM 7.1.3.x (producao), FM 7.1.4.x (abate), FM 7.1.6.1 (NCs), FM 7.1.7.x (embarque).
O que falta e a **ponte** entre os dois sistemas.

---

## Objetivos da Integracao

1. **Vinculo Plant <-> Company**: planta no SIH corresponde a empresa no HalalSphere
2. **NCs criticas do SIH impactam certificacao**: NC critica no SIH gera alerta/notificacao no HalalSphere
3. **Visibilidade de supervisao**: dashboard do HalalSphere mostra resumo de supervisao (dados SIH)
4. **Relatorios assinados acessiveis**: relatorios do SIH visiveis na pagina da certificacao no HalalSphere
5. **Certificado de embarque**: HalalSphere gera FM 7.7.3 usando dados do ShippingReport do SIH
6. **SSO futuro**: preparar para autenticacao unica (nao implementar agora)

---

## Arquitetura de Integracao

### Opcao escolhida: API-to-API via webhooks

```
SIH Backend                          HalalSphere Backend
    |                                       |
    |--- POST /webhooks/sih/nc-critica ---->|  (NC critica criada)
    |--- POST /webhooks/sih/report-signed ->|  (Relatorio assinado)
    |                                       |
    |<-- GET /api/sih/plant-status ---------|  (HalalSphere consulta SIH)
    |<-- GET /api/sih/reports-summary ------|  (Resumo de relatorios)
    |                                       |
```

**Autenticacao entre sistemas**: API Key compartilhada (header `X-Integration-Key`)
Mais simples que JWT cross-system. Chave armazenada no AWS Secrets Manager de ambos.

---

## Itens de Implementacao

### H.1 — Vinculo Plant <-> Company (P)

**SIH**: campo `externalCompanyId` na Plant ja existe — preencher com Company.id do HalalSphere

**HalalSphere**: campo `sihPlantId` na Company (novo) — armazena Plant.id do SIH

**Como vincular**:
- Admin no HalalSphere configura o vinculo (tela de admin da empresa)
- Ou: match automatico por SIF code (`Plant.sifCode` = `Company.plantCode`)

**Arquivos SIH**:
- Nenhum (campo ja existe)

**Arquivos HalalSphere**:
- `prisma/schema.prisma` — novo campo `sihPlantId` na Company
- Migration
- `src/company/company.service.ts` — metodo para vincular
- Frontend: campo na tela de admin da empresa

---

### H.2 — Webhook: NC critica no SIH -> Alerta no HalalSphere (M)

**Trigger**: quando NC com severidade `critica` e criada no SIH
**Acao**: SIH envia POST para HalalSphere com dados da NC

**Payload do webhook**:
```json
{
  "event": "nc.critica",
  "plantId": "uuid",
  "externalCompanyId": "uuid (Company.id no HalalSphere)",
  "ncId": "uuid",
  "severity": "critica",
  "description": "...",
  "category": "...",
  "reportType": "slaughter|production|shipping",
  "reportId": "uuid",
  "createdAt": "ISO date"
}
```

**HalalSphere ao receber**:
1. Busca Company pelo `externalCompanyId`
2. Busca certificacoes ativas da empresa
3. Cria Notification para gestor + analista responsavel
4. Envia email de alerta
5. Registra no CertificationHistory

**Arquivos SIH**:
- `src/non-conformity/non-conformity.service.ts` — apos criar NC critica, enviar webhook
- `src/integration/integration.service.ts` — novo service para envio de webhooks
- `src/integration/integration.module.ts` — novo modulo

**Arquivos HalalSphere**:
- `src/integration/integration.controller.ts` — endpoint `POST /webhooks/sih/nc-critica`
- `src/integration/integration.service.ts` — processar webhook
- `src/integration/integration.module.ts` — novo modulo
- Guard de API Key para validar `X-Integration-Key`

---

### H.3 — Webhook: Relatorio assinado -> Registro no HalalSphere (P)

**Trigger**: quando relatorio (abate/producao/embarque) e assinado no SIH
**Acao**: SIH envia POST para HalalSphere com resumo do relatorio

**Payload**:
```json
{
  "event": "report.signed",
  "plantId": "uuid",
  "externalCompanyId": "uuid",
  "reportType": "slaughter|production|shipping",
  "reportId": "uuid",
  "serialNumber": "1234-2026-000001-AB",
  "date": "2026-03-23",
  "summary": {
    "totalAnimals": 500,
    "approvedAnimals": 498,
    "species": "ave"
  },
  "signedBy": "Nome do Supervisor",
  "signedAt": "ISO date"
}
```

**HalalSphere ao receber**:
1. Registra no CertificationHistory da certificacao vinculada
2. Armazena resumo (JSON) para exibicao no dashboard

**Arquivos SIH**:
- Adicionar envio de webhook nos metodos `sign` de cada report service

**Arquivos HalalSphere**:
- Endpoint `POST /webhooks/sih/report-signed`
- Armazenar em tabela de integracao ou no CertificationHistory

---

### H.4 — HalalSphere consulta SIH: Resumo de supervisao (M)

**Uso**: Dashboard da certificacao no HalalSphere mostra status de supervisao

**Endpoint no SIH** (novo):
```
GET /api/external/plant-summary/:plantId
Headers: X-Integration-Key: {api_key}
```

**Response**:
```json
{
  "plantId": "uuid",
  "period": { "from": "2026-01-01", "to": "2026-03-23" },
  "reports": {
    "slaughter": { "total": 45, "signed": 43, "pending": 2 },
    "production": { "total": 12, "signed": 12, "pending": 0 },
    "shipping": { "total": 8, "signed": 7, "pending": 1 }
  },
  "nonConformities": {
    "total": 5,
    "aberta": 1,
    "em_tratamento": 1,
    "resolvida": 2,
    "encerrada": 1,
    "criticas": 0
  },
  "lastReportDate": "2026-03-22",
  "supervisorName": "Nome do Supervisor"
}
```

**Arquivos SIH**:
- `src/integration/external.controller.ts` — endpoints para consulta externa
- `src/integration/external.service.ts` — queries de resumo
- Guard de API Key

**Arquivos HalalSphere**:
- `src/integration/sih-client.service.ts` — client HTTP para consultar SIH
- Frontend: componente `SupervisionSummary` na pagina da certificacao (para empresas com supervisor)

---

### H.5 — Certificado de embarque FM 7.7.3 (M)

**Fluxo**:
1. Supervisor assina ShippingReport no SIH (webhook H.3 notifica HalalSphere)
2. Gestor no HalalSphere solicita emissao do certificado de embarque
3. HalalSphere consulta SIH para obter dados completos do ShippingReport
4. HalalSphere gera PDF do certificado FM 7.7.3 usando `CertificatePdfService`
5. Certificado armazenado no S3 e vinculado a certificacao

**Endpoint no SIH** (novo):
```
GET /api/external/shipping-reports/:id/full
Headers: X-Integration-Key: {api_key}
```

**Arquivos SIH**:
- Adicionar ao external.controller.ts

**Arquivos HalalSphere**:
- `src/certificate/certificate-pdf.service.ts` — template FM 7.7.3
- `src/certificate/certificate.controller.ts` — endpoint para gerar certificado de embarque
- Frontend: botao "Emitir Certificado de Embarque" vinculado ao shipping report

---

### H.6 — Preparacao para SSO (P)

**Nao implementar agora** — apenas preparar a infraestrutura.

**O que preparar**:
- Padronizar formato do JWT payload em ambos os sistemas
- Documentar como sera o fluxo de SSO (login unico, redirect entre sistemas)
- `externalUserId` no SIH ja existe — mapear para User.id do HalalSphere
- Avaliar OAuth2/OIDC como protocolo (Keycloak ou AWS Cognito)

**Nenhum codigo nesta fase** — apenas documentacao.

---

## Resumo de Estimativas

| Item | Descricao | Complexidade | SIH | HalalSphere |
|------|-----------|-------------|-----|-------------|
| H.1 | Vinculo Plant <-> Company | P | 0 | Migration + service + frontend |
| H.2 | Webhook NC critica | M | Service + webhook | Controller + service + notifications |
| H.3 | Webhook relatorio assinado | P | Webhook nos 3 sign methods | Controller + history |
| H.4 | Consulta resumo supervisao | M | Controller externo | Client HTTP + frontend |
| H.5 | Certificado embarque FM 7.7.3 | M | Controller externo | PDF template + endpoint |
| H.6 | Preparacao SSO | P | Documentacao | Documentacao |

**Total**: ~5 SP conforme estimativa original

---

## Ordem de Execucao

1. **H.1** — Vinculo Plant <-> Company (prerequisito de todos os demais)
2. **H.2** — Webhook NC critica (maior impacto operacional)
3. **H.4** — Consulta resumo (visibilidade no dashboard)
4. **H.3** — Webhook relatorio assinado (complementar)
5. **H.5** — Certificado de embarque (depende de H.4)
6. **H.6** — SSO (futuro)

---

## Prerequisitos

1. **API Key**: criar e armazenar no Secrets Manager de ambos os ambientes
2. **Network**: SIH e HalalSphere precisam se comunicar (mesma VPC ou VPC peering na AWS)
3. **CORS/Security**: endpoints de integracao NAO devem ser publicos — validar API Key + IP whitelist
4. **Ambiente**: implementar em staging primeiro, validar, depois producao

---

## Riscos

| Risco | Mitigacao |
|-------|----------|
| SIH fora do ar | HalalSphere funciona sem dados de supervisao — degradacao graceful |
| Webhook falha | Retry com backoff exponencial (3 tentativas) + dead letter queue |
| Dados inconsistentes | Vinculo Plant <-> Company validado manualmente pelo admin |
| Latencia | Consultas ao SIH com cache (Redis, TTL 5min) no HalalSphere |
