# Edição de escopo do certificado (Fase 1) — Handoff 2026-07-13

> ⚠️ **HISTÓRICO — NÃO É FONTE DA VERDADE.** Este handoff descreve o momento em que foi escrito e **pode estar defasado** (vários afirmavam "feito/commitado" para código que o git desmentia). Para o estado atual, leia **`sih-docs/PLANNING/BACKLOG-ECOHALAL.md`**. Use este arquivo só para entender *por que* uma decisão foi tomada.

Feature: permitir que o **analista corrija o escopo de certificações importadas (mirror)**
direto na tela de detalhe do certificado — validação do seed: corrigir código FAMBRAS,
nome/embalagem de produto e **reamarrar marcas ao produto certo**. Com **trilha de auditoria**.

## Decisões (Renato, 13/jul)
- Edição na **tela de detalhe do certificado** (`/certificacoes/:id`).
- Fase 1 = **escopo (produtos + marcas)**. Fase 2 (futura) = campos gerais (datas, norma,
  categorias M2M, mercados).
- **Número do certificado TRAVADO** (regra "PDF imutável, correção = novo número"). Não editável.
- **Auditoria obrigatória** (ISO 17065): quem mudou qual campo, de X→Y, quando.

## Implementado — ✅ **EM `release`** (back `0f3a9b32` · front `a44f9e49`, remote `origin`)

> Correção de 16/jul: este handoff dizia *"código pronto, NÃO deployado"* — o git desmentia
> (é o caso citado no §6 do mestre). Estado atual em `sih-docs/PLANNING/BACKLOG-ECOHALAL.md` (§4).

### Backend (`halalsphere-backend`)
- `certification-scope.service.ts`: **persistir `code`** (código FAMBRAS — era ignorado no
  add/update de produto) + **auditoria transacional**. Cada add/update/remove de **produto** e
  **marca** grava um `CertificationHistory` DENTRO da mesma transação da edição (atômico), com
  `metadata = { changes: {campo: {from, to}} }` (só campos que mudaram). Ações:
  `scope_product_added/updated/removed`, `scope_brand_added/updated/removed`.
- `certification-scope.controller.ts`: as 6 rotas de mutação (produto/marca add/update/remove)
  passam `req.user.id` como `performedBy`.
- `dto/scope-product.dto.ts`: campo `code` no Create + Update.
- **Sem migration** (coluna `scope_products.code` já existia). **Sem rota nova** → sem regen de API Gateway.
- A trilha reaproveita `CertificationHistory` (já exposta em `GET /certifications/:id/timeline`).
  A tabela `AuditTrail` genérica segue dormente (decisão: não acordar agora).

### Frontend (`halalsphere-frontend`)
- Novo `src/components/certification/ScopeEditor.tsx` (modal): edita produtos (nome, código
  FAMBRAS, embalagem, categoria, origem, descrição + **marcas por produto** via chips) e marcas
  (nome, add, remover). Cada ação chama `scopeService` e invalida as queries. Mostra o
  **histórico de alterações do escopo** (filtra `scope_*` do timeline).
- `CertificationDetails.tsx`: botão **"Editar escopo"** no card de Escopo (só `analista/gestor/admin`),
  abre o modal; `onChanged → refetch()`. Passa a exibir o `code` do produto no read-only.
- `certification.types.ts`: `ScopeProduct` ganhou `code/packingSize/brands`; DTOs ganharam
  `code/packingSize/brandIds`.

## Como validar (local do Renato)
1. Abrir um certificado mirror em `/certificacoes/:id` → card "Escopo" → **Editar escopo**.
2. Corrigir o **código FAMBRAS** de um produto → Salvar → conferir toast + code no read-only.
3. **Reamarrar marca**: desmarcar a marca do produto errado, marcar no certo → Salvar.
4. Adicionar/remover produto e marca.
5. Conferir o **Histórico de alterações do escopo** no rodapé do modal (quem/quando/o quê).

## Deploy
- ✅ **Feito** — push em `release` nos 2 repos: back `0f3a9b32` · front `a44f9e49`.
  Sem migration, sem gateway (nenhuma rota nova).
- 🔧 **Falta só a validação do Renato** — aberta no §4.1 do mestre.

## Fase 2 (não incluída) — 🚩 REESCOPAR ANTES DE INICIAR
Campos gerais do certificado (datas, norma, observações), categorias M2M `industrialCategories`
(hoje só o create popula) e edição do escopo geral (capacidade/turnos). O número do certificado
permanece travado.

> ⚠️ **`market scopes` SAIU deste pacote (16/jul):** a **Trilha A já entregou `marketScopes`**
> (`847006e6` · `d2ec0623` · `ea8e76fa`) e o arquivo (`manualEmit` + `ManualCertificateEmission.tsx`)
> é **domínio dela** — o §2 do mestre marca como "nunca em paralelo". Ver §4.2/Trilha C.
