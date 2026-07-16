# Relatório de gaps — bateria 12 casos vs templates oficiais

Bateria emitida automaticamente pelo script `emit-12-certs.py` em 21/jun/2026
para validar fidelidade do GC contra `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026`
antes da apresentação definitiva ao cliente.

## Casos por status

### ✅ OK (validados nesta sessão sem ressalvas estruturais)

| Caso | Cenário | Selo | Observação |
|---|---|---|---|
| 08 | Frigorífico BR Bovino + GSO | GAC + ENAS | FM 7.7.1 layout landscape OK; QR+sig posicionamento OK; standards OK |
| 10 | Frigorífico BR + OIC/SMIIC | HAL Accreditation Agency | **Fix CV→CI funcionou** — agora mostra "CI - Abate Halal e Processamento..." |
| 11 | Industrial K + GSO | GAC + ENAS | FM 7.7.1 picker correto (K + planta SIF); standards renderiza |
| 12 | Industrial CIV + GSO granel + álcool | GAC + ENAS | Disclaimers granel + álcool em EN+AR funcionando na pág 2 |

### 🟢 OK pós-fix `a6f5fe96` (deploy CONFIRMADO funcional em 22/jun ~03h)

Re-emissão de 22/jun valida:
- **CASE-04**: `KEPKABAN BPJPH - Number 20:2023, PEPRES BPJPH - Number 6:2023, KEPKABAN BPJPH - Number 78:2023` ✅
- **CASE-05**: `MUIS-HC-S001/2005` ✅
- **Certified since** agora puxa data de cert anterior da BRF (não mais data de hoje) — bug se resolve naturalmente em prod.

Todos os PDFs FM 7.7.2 agora renderizam standards externas no bloco Requirements.

| Caso | Cenário | Standard renderizado |
|---|---|---|
| 01 | Industrial CIV + GSO | GSO 2055-1/2015 |
| 02 | Industrial CIV + GSO (5 prod) | GSO 2055-1/2015 (anexo persiste — Phase 2) |
| 03 | Industrial CIV + OIC | OIC/SMIIC 2 |
| 04 | Industrial CIV + BPJPH | KEPKABAN BPJPH - Number 20:2023, PEPRES BPJPH - Number 6:2023, KEPKABAN BPJPH - Number 78:2023 ✅ |
| 05 | Industrial CIV + MUIS | MUIS-HC-S001/2005 ✅ |
| 06 | Industrial CIV + MS | MS 1500/2009 |
| 07 | Industrial CIV + UAE | UAE.S 2055-1/2015 |
| 12 | Industrial CIV granel+álcool | GSO 2055-1/2015 + disclaimers OK |

### 🟡 Gap conhecido (justificável na apresentação)

| Gap | Cases | Severidade | Decisão PO |
|---|---|---|---|
| **Combo GAC + ENAS no FM 7.7.2** | 01,12 (GSO) | Baixo (cosmético) | Tentativa de stacking horizontal (commit `87ec069d`) revertida em `ad2197e9` porque ENAS sobrepunha título "HALAL CERTIFICATE" do bg. Solução clean exige re-arte do bg ou asset combinado. Hoje o último selo do array (`ENAS_SEAL`) prevalece visualmente. **Workaround para a apresentação**: usar template `GCC` (só GAC) em vez de `GAC_ENAS` quando demonstrar Golfo; ou aceitar visual atual.|

### 🟢 RESOLVIDOS na sessão de 22/jun (madrugada)

| Gap | Fix | Commit |
|---|---|---|
| ~~CV→CI mapping em SMIIC~~ | Mapa GSO→SMIIC encapsulado em `getCategoryDisplay` | `39d2d50d` |
| ~~UX 3 dropdowns redundantes~~ | Auto-derivar `standard` + `templateCode` das normas elegíveis + checkbox override | `a3f36ae8` |
| ~~Standards não renderizando em FM 7.7.2~~ | Adicionado render de `requirements.standards` nos 2 cert renderers | `a6f5fe96` |
| ~~Frigorífico não lista produtos inline~~ | Renderizar `products[].name` + `Brands:` após `Products/Scope` no FM 7.7.1 | `0699773e` |
| ~~"Certified since" data de hoje~~ | Resolve-se naturalmente: puxa data do cert mais antigo da empresa (presente em prod real). | — |
| ~~K (bioquímicos) sempre cai em DT 7.4~~ | Subcategorias K-03 (drugs) → DT 7.5 e K-04 (cosmetics) → DT 7.6. Migration aditiva idempotente seedou K-03 e K-04. | `d043e572` |
| ~~CSV importado vem em MAIÚSCULAS ou minúsculas~~ | `toTitleCasePtBr` aplicado no `BulkImportProductsDialog.parseCsv` para produto, embalagem e marcas. Preserva siglas curtas (BRF, SIF). Pedido Lina 20/mai. | `abb54da6` |
| ~~FM 7.7.2 sempre com anexo (Phase 2)~~ | Tabela inline na 1ª página quando `products.length <= 8`. Threshold derivado das 8 linhas pré-numeradas do template oficial. Aplicado em ambos certificate renderers (standard + arabic). Pedido explícito Lina+Fuad reunião 20/mai. | `13dff1d7` |

### 🔴 Pendência externa

| Item | Quem | Quando |
|---|---|---|
| Template árabe oficial final | Elaine (Qualidade FAMBRAS) | Bloqueia validação de árabe |
| Anexo > 8 produtos (cardinalidade exata) | Já confirmado pelo Renato como ≥9 | OK |
| Layout FM 7.7.2 SEM ANEXO oficial | Existe na pasta `INDUSTRIAL\BRASIL\` | Já validado, falta implementar renderer |

## Gaps de DT (auditoria Agent A)

✅ **Resolvidos hoje:**
- CV→CI mapping em SMIIC (commit `39d2d50d`)
- Standards não renderizando em FM 7.7.2 (commit `a6f5fe96`)

🟡 **Conhecidos mas não bloqueantes:**
- K não diferencia drugs (DT 7.5) e cosmetics (DT 7.6) sem subcategoria explícita
- DT 7.3 (HAS) é sempre adicionado mesmo sem template físico — correto, é transversal
- Cochonilha split funciona só para DT 7.1 nos "Demais mercados"

## Gaps de UX (auditoria Agent C → fix deployado)

✅ **Resolvido hoje:**
- Auto-derivação de `standard` + `templateCode` das normas elegíveis (commit `a3f36ae8`)
- Checkbox "Customizar manualmente (exceção)" revela campos antigos como fallback
- Eliminado campo "Norma aplicada" redundante

## Casos pendentes de validação visual (em andamento ao escrever)

CASE-01/02/03/04/05/06/07 + 09 — aguardando re-test pós-deploy `a6f5fe96`.
