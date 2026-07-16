# Manual — Emissão Manual de Certificado Halal (GC)

> **Versão:** 22/jun/2026
> **Sistema:** Gestão de Certificações (HalalSphere)
> **Tela:** `/analista/emissao-manual-certificado`
> **Modelos suportados:** FM 7.7.1 (Habilitação) e FM 7.7.2 (Certificado Único)

---

## 1. Quando usar

A tela de **Emissão Manual de Certificado** existe como **ponte até o go-live do fluxo completo** (jul/2026). Permite emitir certificado halal **sem** passar pelo ciclo solicitação → proposta → contrato → auditoria → comitê.

**Pós go-live**, ela continua disponível como **emissão de exceção** para:
- Re-emissão urgente
- Cliente legado migrando do Sys Halal
- Ajuste manual fora do fluxo padrão

---

## 2. Quem pode emitir

| Perfil | Pode emitir? |
|---|:---:|
| **Admin** | ✅ |
| **Gestor** | ✅ |
| **Analista** | ✅ (operador primário) |
| Auditor / Comercial / Jurídico | ❌ |
| Empresa cliente | ❌ |

Login com qualquer perfil acima, depois acessa **Sidebar → Analista → Emissão Manual de Certificado**.

---

## 3. Fluxo de emissão (passo a passo)

A tela tem **7 seções numeradas**. Preenche de cima pra baixo.

### Seção 1 — Empresa e planta

- Selecione a **Empresa** (busca por nome ou taxId/CNPJ).
- Selecione a **Planta** (filtrado pelo `companyId` selecionado).
- A planta precisa estar **ativa** e ter **`sanitaryCode`** preenchido (SIF, SIE, Establecimiento etc.) para emitir o modelo "Habilitação COM SIF".

### Seção 2 — Identificação do certificado

- **Número do certificado** — formato IT 4.2 (`ABC.SIG.ANOMES.SEQQ.PAIS`).
  - Industrial: `FAM.XXX.2606.0001.BRA`
  - Frigorífico: `FAM.XXX.2606.0001.2.BRA` (com `.NORMA.`)
- **Data de emissão** — data de hoje por padrão (editável).
- **Data de vencimento** — +3 anos da emissão (editável).
- **Certified since** — primeira certificação histórica da empresa (preenchido automaticamente pelo sistema se já houver certificado anterior; pode ser sobrescrito).
- **Initial certification cycle date** — data do ciclo atual (igual ou anterior à data de emissão).

### Seção 3 — Normas e mercados (UX simplificada em 22/jun)

- **Tipo de Certificação**: Produto · Processo · Serviço.
- **Normas elegíveis** (marque todas que se aplicam — multi-select):
  - `GSO 2055-2 (Golfo)`
  - `OIC/SMIIC`
  - `BPJPH (Indonésia)`
  - `MUIS (Singapura)`
  - `MS (Malásia / JAKIM)`
  - `UAE.S`

- **Bloco azul read-only**: o sistema mostra automaticamente:
  - **Norma principal** derivada (GSO_2055_2 / SMIIC_02 / BOTH / VOLUNTARY)
  - **Template do PDF (combo de selos)** derivado

- **Checkbox "Customizar manualmente (exceção)"** — para casos raros, revela dropdowns para override de Norma + Template.

### Seção 4 — Layout do PDF

- **Form code** (auto-detecta se em branco):
  - **FM 7.7.1** — Approval / Habilitação (landscape A4). Para frigorífico (CV) + planta com SIF; bioquímicos K com SIF.
  - **FM 7.7.2** — Certificado Único (portrait A4). Para industrial padrão (CIV, CII, K sem SIF etc).
- **País da planta**: BR · AR · CO · PY · EC (define formato de CNPJ/CUIT/RUC/RUT + autoridade sanitária).
- **Granel** — checkbox. Adiciona disclaimer "marketed in bulk" em EN+AR.
- **Contém álcool** — checkbox. Adiciona disclaimer "alcohol-derived ingredients transformed" em EN+AR.

### Seção 5 — Marcas

- Lista de **marcas elegíveis** no certificado (multi-select chips).
- Cada marca pode ser atribuída a 1 ou mais produtos na Seção 6.

### Seção 6 — Produtos

- **+ Adicionar produto** para cada linha. Campos:
  - **Nome** (obrigatório) — ex: "Frango congelado inteiro"
  - **Code** (código FAMBRAS) — ex: "SC404097"
  - **Embalagem** — ex: "Polyethylene bag, Net weight 20kg"
  - **Marcas deste produto** — botões clicáveis das marcas adicionadas na Seção 5

- **+ Importar CSV** — abre dialog de bulk import. Veja [§7. Importação CSV](#7-importação-csv-bulk).

### Seção 7 — Assinante (opcional)

- Default: **Mohamed Hussein El Zoghbi** — Authorized representative
- Pode customizar nome e título por exceção (não preenche = usa default).

---

## 4. Regras automáticas aplicadas pelo sistema

### 4.1 Derivação de Norma e Template (UX 22/jun)

O sistema **derive automaticamente** `standard` e `templateCode` da seleção de Normas elegíveis (IT 7.10 §3.3 + FM 4.1.X REV 03):

| Normas marcadas | Norma principal | Template (selo) |
|---|---|---|
| `{GSO}` ou `{GSO, UAE}` | GSO_2055_2 | **GAC + ENAS** (bilíngue EN+AR) |
| `{UAE}` sem GSO | VOLUNTARY | **ENAS** |
| `{OIC/SMIIC}` | SMIIC_02 | **HAK** (Halal Accreditation Agency Turquia) |
| `{BPJPH}` | VOLUNTARY | **KEPKABAN BPJPH** (Indonésia) |
| `{MUIS}` | VOLUNTARY | **MUIS** (Singapura) |
| `{MS}` | VOLUNTARY | **JAKIM** (Malásia) |
| `{GSO, OIC/SMIIC}` | BOTH | GAC+ENAS (GSO domina) |
| nenhuma | VOLUNTARY | STANDARD (só selo FAMBRAS) |

Bilíngue EN+AR é **mandatório em 100% dos certs** (IT 7.10 §3.3).

### 4.2 Mapeamento Categoria → DT

O DT (Documento Técnico) é resolvido pela combinação **categoria × espécie/subcategoria**:

| Categoria | Espécie/Subcat | DT resolvido |
|---|---|---|
| **CV** Abate de animais | Aves | DT 7.2.1 |
| **CV** Abate de animais | Bovinos / Bufalinos / Ovinos / Caprinos | DT 7.2.2 |
| **CI** Proc. perecível animal | — | DT 7.1 |
| **CII** Proc. perecível vegetal | — | DT 7.1 |
| **CIII** Proc. misto animal+vegetal | — | DT 7.1 |
| **CIV** Proc. estável temperatura ambiente | — | DT 7.1 |
| **K** Bioquímicos | K-01 Aditivos alimentares | DT 7.1 |
| **K** Bioquímicos | K-02 Gelatinas e colágenos | DT 7.1 |
| **K** Bioquímicos | **K-03 Drogas e medicamentos** | **DT 7.5** |
| **K** Bioquímicos | **K-04 Cosméticos e higiene pessoal** | **DT 7.6** |
| **K** Bioquímicos | sem subcategoria | DT 7.4 (default chemicals) |
| AI Criação de animais | — | DT 7.7.1 |
| BI/BII Cultivo de plantas | — | DT 7.7.2 |
| DI/DII Ração animal | — | DT 7.9 |
| GI/GII Transporte/armazenamento | — | DT 7.8 |
| I Embalagem | — | DT 7.10 |
| E/H/HI/HII/HIII Serviços | — | DT 7.11 |
| LI Cosméticos (SMIIC) | — | DT 7.6 |

**DT 7.3 (HAS — Halal Assurance System)** é adicionado **automaticamente em todos os certificados** como requisito transversal.

### 4.3 Mapeamento Categoria → Display em SMIIC

Quando `standard = SMIIC_02`, o sistema mapeia:
- **CV (GSO)** → **CI (SMIIC)** — "Abate Halal e Processamento de produtos perecíveis de origem animal"

Outras categorias mantêm o mesmo código entre GSO e SMIIC.

### 4.4 Picker de form code (FM 7.7.1 vs FM 7.7.2)

Se `formCode` está em "Auto-detectar":

- **FM 7.7.1 (Habilitação)** — quando categoria é `{CV, CI, CIII, K}` **E** a planta tem `sanitaryCode` real (SIF, SIE etc., não INTERNAL).
- **FM 7.7.2 (Certificado Único)** — todo o resto (industrial padrão).

### 4.5 Picker de página — SEM ANEXO vs COM ANEXO (FM 7.7.2)

Apenas para FM 7.7.2 (Industrial):

| Produtos no escopo | Layout |
|---|---|
| **≤ 8 produtos** | **1 página única** com tabela inline (template "SEM ANEXO") |
| **≥ 9 produtos** | Capa + página(s) de anexo com tabela (template "COM ANEXO") |

Cutoff de 8 derivado das 8 linhas pré-numeradas do template oficial FAMBRAS.

### 4.6 Standards externas no campo "Requirements"

Após os DTs, o sistema renderiza as standards externas marcadas como elegíveis:

- `GSO 2055-1/2015`
- `OIC/SMIIC 2`
- `KEPKABAN BPJPH - Number 20:2023, PEPRES BPJPH - Number 6:2023, KEPKABAN BPJPH - Number 78:2023`
- `MUIS-HC-S001/2005`
- `MS 1500/2009`
- `UAE.S 2055-1/2015`

### 4.7 Datas

- **Issue date** — data do PDF (operador escolhe).
- **Certified since** — automaticamente puxado do certificado mais antigo da empresa (não muda em renovações).
- **Initial certification cycle date** — data do ciclo atual (muda a cada renovação de 3 anos).
- **Expiry date** — automaticamente `cycle date + 3 anos`. Editável.

---

## 5. Variantes de Layout

### FM 7.7.1 — Habilitação (Landscape A4)

- Para **frigorífico** (CV) com SIF, ou **bioquímico K** com SIF (gelatinas, heparina).
- Lista de produtos **inline genérica** no campo "Products/Scope" (ex: "cortes de frango, frango inteiro").
- Linha "Brands:" abaixo agregando marcas únicas.
- Quando frigorífico tem escopo grande (raro): variante COM ANEXO (Phase 2).

### FM 7.7.2 — Certificado Único (Portrait A4)

- Para **industrial padrão** (CIV, CII, K sem SIF, AI, BI, etc).
- **Tabela formal de produtos**: `Nº | Product Name | Code | Packing size | Product Brand`
- ≤8 produtos → tabela inline na pg 1 (template "SEM ANEXO").
- ≥9 produtos → tabela em pg 2+ (anexo).

### Bilíngue EN+AR

- Aplicado em **100% dos certs** (mandatório IT 7.10 §3.3).
- Cabeçalho bilíngue ("HALAL CERTIFICATE / شهادة حلال").
- Datas bilíngues ("Certified since / تم اعتماد الشركة من").
- Selos GCC / GAC + ENAS no topo direito.

---

## 6. Selos por mercado

| Selo | Aparece quando |
|---|---|
| **GAC** (GCC Accreditation Center) | Norma GSO marcada |
| **ENAS** (Emirates National Accreditation System) | GSO + bilíngue, ou UAE sozinho |
| **HAK** (Halal Accreditation Agency Turquia) | OIC/SMIIC marcado |
| **KEPKABAN BPJPH** (Indonésia) | BPJPH marcado |
| **MUIS** (Singapura) | MUIS marcado |
| **JAKIM** (Malásia) | MS marcado |
| **FAMBRAS Halal Brasil** | Sempre (parte do gabarito) |

Selos são **paramétricos** — não geram variantes de layout, apenas mudam a imagem do canto superior direito.

---

## 7. Importação CSV (bulk)

### Formato

Arquivo `.csv` com separador `;` (ponto-e-vírgula). Header opcional:

```
produto;code;embalagem;marcas
Frango congelado inteiro;SC404097;Polyethylene bag, Net weight 20kg;Sadia|Perdigão
Frango em pedaços;SC404098;Polyethylene bag, Net weight 10kg;Sadia
```

- **produto** — obrigatório
- **code** — opcional (código FAMBRAS, ex: SC404097)
- **embalagem** — opcional
- **marcas** — opcional, múltiplas separadas por `|`

### Title Case automático (pt-BR)

Textos importados são formatados automaticamente:

- Primeira letra de cada palavra **maiúscula**
- Preposições, artigos e contrações pt-BR **minúsculas** (de, da, do, em, com, para, no, na, ao, pela...)
- Siglas curtas **all-caps preservadas** (BRF, SIF, USP)

**Exemplos:**

| Entrada CSV | Resultado |
|---|---|
| `AV. DOS PIONEIROS, 8510` | `Av. dos Pioneiros, 8510` |
| `frango congelado` | `Frango Congelado` |
| `BRF s.a.` | `BRF S.A.` |
| `cortes de frango no espeto` | `Cortes de Frango no Espeto` |
| `óleo de soja` | `Óleo de Soja` |

### Template para download

Clique em **"Baixar modelo"** dentro do dialog de importação. Modelo já tem comentários explicativos e exemplos.

---

## 8. Validações

Ao clicar em **"Emitir certificado + gerar PDF"**, o sistema valida:

| Campo | Regra |
|---|---|
| Empresa + Planta | Obrigatórias |
| Categoria | Pelo menos 1 |
| Número do certificado | Obrigatório, único no sistema |
| Datas | Vencimento > emissão |
| Normas elegíveis | Pelo menos 1 |
| Marcas | Pelo menos 1 |
| Produtos | Pelo menos 1, todos com nome preenchido |

Se houver erros, aparece **toast vermelho** ("Existem campos obrigatórios não preenchidos") e o sistema rola até o 1º campo destacado em vermelho.

---

## 9. Após emitir

A tela mostra a página de sucesso com:

- **Número do certificado emitido**
- **Botão "Baixar PDF"** — gera URL temporária (TTL 15min) do PDF armazenado no S3
- **Botão "Baixar QR Code"** — PNG do QR
- **Link "/verify/:certNumber"** — página pública de verificação do QR
- **Botão "Nova emissão"** — reseta o formulário

PDFs são **imutáveis** — correção/alteração de escopo requer **novo certificado com nova numeração** (regra FAMBRAS).

---

## 10. Perguntas frequentes

### Por que minha empresa está aparecendo com nome vazio no PDF?

A empresa cadastrada precisa ter `legalName`, `taxId`, `address` preenchidos. Acesse `/empresas/:id` para completar o cadastro e re-emita.

### Por que o cert frigorífico não mostra os produtos individuais?

FM 7.7.1 (Habilitação) usa lista genérica inline ("cortes de frango"). Para listagem detalhada de produtos individuais com marca/código, use FM 7.7.2 (Certificado Único).

### Posso usar override manual da norma/template?

Sim. Marque o checkbox **"Customizar manualmente (exceção)"** na Seção 3. Aparece bloco amarelo com dropdowns para escolher livremente.

### O sistema gera múltiplos certs quando preciso de Golfo + Malásia?

Não — emita 2 certs separados (1 com GSO/Golfo, outro com MS/Malásia). Normas conflitantes (GSO × SMIIC) requerem dual cert (regra FAMBRAS — ver memória `frigorifico_dual_cert_rule`).

### A página de verificação QR fica em qual domínio?

QR aponta para `https://cert.fambrashalal.com.br/verify/:certNumber` (domínio FAMBRAS unificado, integração via ALB).

---

## 11. Glossário

| Sigla | Significado |
|---|---|
| **DT** | Documento Técnico FAMBRAS (DT 7.1, DT 7.2.1, etc.) |
| **FM 7.7.1** | Formulário modelo de Habilitação (frigorífico/bioquímico c/ SIF) |
| **FM 7.7.2** | Formulário modelo de Certificado Único (industrial padrão) |
| **GAC** | GCC Accreditation Center (acreditador Golfo) |
| **GSO** | Gulf Standards Organization (norma Golfo: GSO 2055-2) |
| **SMIIC** | Standards and Metrology Institute for Islamic Countries (norma Turquia/OIC) |
| **HAK** | Halal Accreditation Agency (acreditador OIC/SMIIC) |
| **ENAS** | Emirates National Accreditation System |
| **BPJPH** | Badan Penyelenggara Jaminan Produk Halal (Indonésia) |
| **MUIS** | Majlis Ugama Islam Singapura (Singapura) |
| **JAKIM** | Jabatan Kemajuan Islam Malaysia (Malásia) |
| **SIF** | Serviço de Inspeção Federal (Brasil, código sanitário oficial) |
| **HAS** | Halal Assurance System (sistema de gestão halal, DT 7.3) |
| **IT 7.10** | Instrução Técnica FAMBRAS — "Preenchimento e Emissão do Certificado Halal" |
| **FM 4.1.X** | Anexo 1 REV 03 — Tabela mestre DT × mercado → norma → selo |
