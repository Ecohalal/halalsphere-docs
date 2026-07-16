# REVIEW N2 — Certificados históricos / transferência / casing (para FAMBRAS)

> Gerado 2026-07-01. Contexto: seed N2 (1010 certificações / 1253 certificados) reconstruído das
> planilhas FM 7.8.x. A lista de certificados traz **todo certificado já emitido**, inclusive os
> emitidos quando a planta pertencia a **outro CNPJ**. Como o **SIF é a identidade estável** do
> estabelecimento, o seed ancora cada certificado na **planta atual pelo SIF** (o CNPJ do papel pode
> ser histórico). Abaixo estão os 13 casos em que o CNPJ do certificado ≠ CNPJ do dono atual da planta.

## Legenda
- ✅ **OK (sem ação)** — resolução correta, é consolidação nossa ou typo de dado sem impacto.
- 🔶 **FAMBRAS confirmar** — precisa de olho humano (casing ou transferência real).

## Tabela

| # | Nº certificado (base) | SIF | CNPJ no certificado | CNPJ dono atual da planta | Situação | Ação |
|---|---|---|---|---|---|---|
| 1 | FMA.SWD.2404.1235 | 4086 | 11610856000103 | 11610856000600 | FRIGOMARCA: CNPJ genérico `000103` consolidado p/ filial por SIF | ✅ |
| 2 | FMA.VAZ.2404.1152 | 3505 | 11610856000103 | 11610856000367 | idem FRIGOMARCA | ✅ |
| 3 | MIN.BRS.2602.1427 | 421 | 67620337000114 | 67620377000114 | Minerva: typo 1 dígito no CNPJ (`337`↔`377`), mesma planta | ✅ |
| 4 | MIN.PGS.2602.1428 | 431 | 67620337000467 | 67620377000467 | idem typo Minerva | ✅ |
| 5 | MIN.JOB.2604.1429 | 451 | 67620337000386 | 67620377000386 | idem typo Minerva | ✅ |
| 6 | PMF.ARI.2510.1343 | 177 | 16820052000144 | 16820052000659 | Prima Foods: mesma empresa, filial diferente (mesma raiz CNPJ) | ✅ |
| 7 | **JBS.CPE.2502.4954** | 4400 | 02916265016597 (casing IND) | 02916265007768 (frigorífico) | **Casing**: cert no CNPJ da unidade de casing; SIF 4400 pertence ao frigorífico | 🔶 confirmar se o cert é do frigorífico |
| 8 | **MIN.JOB.2405.4382** | 451 | 67620377005930 (Minerva Casing) | 67620377000386 (dono do SIF) | **Casing**: cert no CNPJ de casing; SIF 451 é do estabelecimento José Bonifácio | 🔶 confirmar |
| 9 | **BWL.PXP.2210.5622** | 1922 | 06945520000153 | 02916265038647 (**JBS**) | **Transferência**: SIF 1922 hoje é da JBS | 🔶 confirmar transferência real |
| 10 | **FTC.MNI.2604.1456** | 3047 | 03853896001200 (**Marfrig**) | 52168923000584 (**Fortunceres**, grupo Minerva) | **Transferência** Marfrig→Fortunceres | 🔶 confirmar |
| 11 | **PTL.VAZ.2311.1349** | 585 | 11610856000448 (**FRIGOMARCA**) | 05408755000143 (**Frig. Pantanal**) | **Transferência** FRIGOMARCA→Pantanal | 🔶 confirmar |
| 12 | **BMG.JUW.2307.1399** | 2620 | 10989834001288 (BMG Foods) | 11958002001003 (**Falcão**) | **Transferência** →Falcão | 🔶 confirmar |
| 13 | **HEX.PTO.2601.5920** | 407 | 72923113001818 (Hexus/Vidara) | 04908706000107 | **Transferência** Hexus→outro CNPJ | 🔶 confirmar |

## O que a FAMBRAS precisa decidir

**Casos ✅ (1–6):** nenhuma ação — resolução correta.

**Casos 🔶 (7–13), 7 no total:**
- **Casing (7, 8):** confirmar que o certificado com SIF 4400/451 é do **estabelecimento frigorífico/abate** (dono real do SIF), não da unidade de casing que compartilha o CNPJ na planilha. Se for da unidade de casing, a FAMBRAS indica o CNPJ/estabelecimento correto.
- **Transferências (9–13):** confirmar que a **venda/transferência é real** (não erro de dado na planilha). Se real, o comportamento está correto: o certificado histórico segue a planta (SIF) e hoje aparece sob o novo dono; a reemissão sob o novo CNPJ é processo de negócio. Se for erro de dado, a FAMBRAS corrige o CNPJ na fonte.

## Regra de fundo (confirmada com Renato)
SIF = identidade estável da planta. Numa venda/transferência: o SIF fica, CNPJ+razão mudam →
`Plant.company_id` reatribui à nova Company/grupo; a certificação segue a planta (`plantId`);
reemissão sob novo CNPJ = processo de negócio. Sem problema estrutural.
