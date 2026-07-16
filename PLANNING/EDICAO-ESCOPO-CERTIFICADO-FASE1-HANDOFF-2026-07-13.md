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

## Implementado (código pronto, **NÃO deployado**) — tsc OK nos dois

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
- Push em `release` nos 2 repos (backend + frontend). Sem migration, sem gateway.
- **Aguardando autorização do Renato** (feature nova em dado de certificado).

## Fase 2 (não incluída)
Campos gerais do certificado (datas, norma, observações), categorias M2M `industrialCategories`
(hoje só o create popula), market scopes, e edição do escopo geral (capacidade/turnos). O número
do certificado permanece travado.
