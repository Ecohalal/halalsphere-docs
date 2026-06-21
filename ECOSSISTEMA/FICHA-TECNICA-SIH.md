# Ficha Técnica — SIH (Supervisão Industrial Halal)

> Material objetivo para Comercial, Marketing e Produto. Uso interno.
> Atualizado em 2026-06-18.

| Campo | Conteúdo |
|---|---|
| **Nome** | SIH — Supervisão Industrial Halal |
| **O que é** | Sistema web responsivo (otimizado para tablets em campo) que digitaliza os formulários de supervisão (FM) da FAMBRAS Halal |
| **Estágio na cadeia** | Operação contínua — supervisão diária na planta |
| **Status** | 🟢 Em produção, em piloto controlado (go-live pleno FAMBRAS: agosto/2026) |

## Para que serve
Substitui o preenchimento em papel dos relatórios de supervisão Halal (abate, produção,
embarque), garantindo legibilidade, validação automática e rastreabilidade em tempo real
dos dados que comprovam a conformidade Halal da operação.

## Quem usa
Supervisores Halal (em campo) · Coordenadores e gestores · Auditores / Administração.

## Principais funcionalidades
- **Formulários digitais fiéis aos modelos FM oficiais** (abate de aves e bovinos, produção
  industrial, embarque de exportação, venda interna, transferência).
- **Validação em tempo real** dos itens Conforme / Não-Conforme.
- **Numeração serial automática** por planta (`SIF/ANO/SEQUENCIAL`).
- **Workflow de não-conformidades** com prazos automáticos (7 dias).
- **Registro diário de ocorrências** e **catálogo de produtos Halal** por planta.
- **Vínculo embarque ⇄ produção** (rastreabilidade origem → produção → embarque, sem redigitação).
- **Dashboard consolidado** em tempo real.

## Diferenciais de venda
- Tempo de preenchimento cai de 15-25 min para 5-10 min; consolidação passa a ser em tempo real.
- Erros de preenchimento caem de ~15% para <2%.
- Rastreabilidade 100% digital e tracking automático de prazos de não-conformidade.
- Pensado para uso em campo (tablet), com estrutura preparada para operação offline.

## Papel no ecossistema
**Camada operacional / evidência de campo.** Gera a prova de que cada lote passou por
supervisão Halal real (datas de abate, supervisor, volumes) — a "porta 4" da validação
cruzada do ecossistema. Consome cadastros de planta e certificado do GC.

## Stack (resumo)
React 19 + Vite + Tailwind/shadcn · NestJS 11 + Prisma 7 · PostgreSQL · AWS (S3) · PWA.
