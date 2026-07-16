# Ficha Técnica — GC (Gestão de Certificações)

> Material objetivo para Comercial, Marketing e Produto. Uso interno.
> Atualizado em 2026-07-14.

| Campo | Conteúdo |
|---|---|
| **Nome** | Gestão de Certificações |
| **O que é** | Plataforma SaaS B2B que automatiza o ciclo completo de certificação Halal de uma empresa |
| **Estágio na cadeia** | Pré-mercado — habilitação da empresa |
| **Status** | 🟡 Pré-go-live — base real carregada; emissão manual em produção (go-live pleno FAMBRAS: agosto/2026) |

## Para que serve
Digitaliza e automatiza a certificação Halal — da solicitação à emissão do certificado
de habilitação — reduzindo o ciclo de **7-8 meses para 2-3 meses**, com conformidade ao
PR 7.1 e às normas internacionais (GSO 2055-2, SMIIC, ISO 17065, GAC).

## Quem usa
Empresas solicitantes · Analistas · Auditores · Comitê Técnico · Gestão da certificadora.

## Principais funcionalidades
- Workflow de certificação em **12 fases rastreáveis**, com notificações automáticas.
- **Calculadora inteligente** de proposta comercial (multi-variável).
- **Gestão colaborativa de contratos** (negociação cláusula a cláusula, versionada).
- **Calendário inteligente** de auditorias (otimiza alocação dos auditores).
- **IA de análise pré-auditoria** (extrai produtos/ingredientes/fornecedores e sinaliza riscos).
- **Emissão de certificado digital** com QR Code de verificação pública.
- **Cadastro multi-país** nativo e **modelo dual GSO/SMIIC**.

## Diferenciais de venda
- Reduz o tempo de certificação em ~60%.
- Transparência total: empresa acompanha o status em tempo real (menos ligações reativas).
- Conformidade auditável (rastreabilidade 100% para GAC / ISO 17065).
- IA aplicada em pontos críticos do processo.

## Papel no ecossistema
**Master de cadastro** do ecossistema (empresa, planta, escopo, certificado). Alimenta
o SIH e o SysHalal com os dados de habilitação.

## Stack (resumo)
React 19 + TypeScript · NestJS 11 + Prisma 7 · PostgreSQL · AWS (S3, SES, ECS) · IA Anthropic Claude.
