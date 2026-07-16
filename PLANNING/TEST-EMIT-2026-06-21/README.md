# Bateria de teste: 12 certs cobrindo matriz de variantes

Objetivo: validar fidelidade visual do PDF gerado contra templates oficiais FAMBRAS em
`C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026\` antes da apresentacao definitiva (22/jun).

## Pre-requisitos

- `jq` instalado (Git Bash do Windows ja vem; senao `winget install jqlang.jq`)
- `curl` (vem com Windows 10+)
- Usuario TEST-emitter criado no GC com role `analista` ou `gestor`

## Como rodar

```bash
export HALALSPHERE_EMAIL='test-emitter@ecohalal.dev'
export HALALSPHERE_PASSWORD='****'  # senha do TEST-emitter
bash ./emit-12-certs.sh
```

Saidas:
- `output/CASE-NN-certificado_TEST-CASE-NN-XXXXX.pdf` — 12 PDFs
- `output/CASE-NN-payload.json` — payload enviado (para debug)
- `output/CASE-NN-response.json` — resposta da API (para debug)
- `output/summary.csv` — resumo por caso (HTTP status, nome do arquivo, erro)

## Matriz dos 12 casos

| # | Categoria | Normas elegiveis | Template esperado | Form code | Anexo | Granel/Alcool |
|---|---|---|---|---|---|---|
| 01 | CIV | GSO | GAC_ENAS | FM 7.7.2 | COM (11 prod) | - |
| 02 | CIV | GSO | GAC_ENAS | FM 7.7.2 | **SEM** (5 prod, gap conhecido) | - |
| 03 | CIV | OIC_SMIIC | OIC_SMIIC | FM 7.7.2 | COM (10 prod) | - |
| 04 | CIV | BPJPH | BPJPH | FM 7.7.2 | COM (10 prod) | - |
| 05 | CIV | MUIS | MUIS | FM 7.7.2 | COM (10 prod) | - |
| 06 | CIV | MS | MS | FM 7.7.2 | COM (10 prod) | - |
| 07 | CIV | UAE | UAE | FM 7.7.2 | COM (10 prod) | - |
| 08 | CV | GSO | GAC_ENAS | FM 7.7.1 | inline (2 prod) | - |
| 09 | CV | MS | MS | FM 7.7.1 | inline (2 prod) | - |
| 10 | CV | OIC_SMIIC | OIC_SMIIC | FM 7.7.1 | inline (2 prod) | - |
| 11 | K | GSO | GAC_ENAS | FM 7.7.1 (com SIF) | COM (4 prod) | - |
| 12 | CIV | GSO | GAC_ENAS | FM 7.7.2 | COM (10 prod) | **Granel + Alcool** |

> Todos emitidos na primeira planta da BRF para isolar. CertificateNumber prefixado com `TEST-CASE-NN-<timestamp>` para nao colidir com FAM.* reais.

## Pos-emissao

Comparar cada `CASE-NN-*.pdf` lado a lado com template oficial:
- CASE-01/02/03/04/05/06/07/12 -> `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026\INDUSTRIAL\BRASIL\...\FM 7.7.2*.docx` correspondente
- CASE-08/09/10/11 -> `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026\FRIGORIFICO\BRASIL\...\FM 7.7.1*.docx` correspondente

Documentar gaps em `output/GAPS.md`.

## Cleanup pos-apresentacao

Os 12 certs ficam em prod com `certificateNumber LIKE 'TEST-CASE-%'`. Para apagar:

```sql
DELETE FROM certificates WHERE certificate_number LIKE 'TEST-CASE-%';
-- + cascade: certifications + scopes (verificar FK)
```

Ou via UI no `/certificates` com filtro do prefixo.
