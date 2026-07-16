# Ficha Técnica — SysHalal (Sys Halal)

> Material objetivo para Comercial, Marketing e Produto. Uso interno.
> Atualizado em 2026-07-14.

| Campo | Conteúdo |
|---|---|
| **Nome** | SysHalal — Sys Halal |
| **O que é** | Sistema operacional de emissão do certificado Halal de exportação por embarque/lote |
| **Estágio na cadeia** | Exportação — porta final da cadeia |
| **Status** | 🟢 Em produção desde agosto/2025 |

## Para que serve
Gera o documento oficial (PDF com QR Code) que acompanha cada lote certificado na
exportação. É a etapa final: transforma a habilitação e a operação supervisionada em um
certificado de embarque válido para o destino.

## Quem usa
Despachantes e clientes exportadores · Certificadora (validação e emissão).

## Principais funcionalidades
- **Emissão de certificado de exportação por lote**, com layout customizável por mercado/cliente.
- **Geração de PDF e QR Code** de verificação.
- **Cartas de correção** e histórico de alterações dos certificados.
- **Cadastro de empresas, habilitações e documentação** voltado à exportação.
- **Integrações externas** (armazenamento, e-mail, notificações) e dados públicos/SFDA (Saudi Halal Center).

## Diferenciais de venda
- Sistema consolidado e em produção há mais tempo (desde ago/2025), com base de embarques real.
- Layouts de certificado adaptáveis por país/cliente de destino.
- Caminho de integração com o ecossistema para validação cruzada (combate à fraude documental).

## Papel no ecossistema
Estágio **pós-emissão / exportação** e sistema de registro dos embarques. Evolução
planejada: alinhamento ao cadastro master do GC e **validação cruzada de 4 portas**
(empresa habilitada + certificado válido + produto no escopo + evidência operacional do SIH).

## Stack (resumo)
Next.js 14 + React 18 (next-auth) · NestJS 10 + Prisma 6 · PostgreSQL · AWS (S3, SES, SNS) · pdf-lib + qrcode · TanStack Query · Chart.js.

## Evoluções planejadas
API v2 (integração externa) · Alinhamento com o GC (set/2026) · Validação cruzada de 4 portas (set–out/2026).
