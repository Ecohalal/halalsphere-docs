# Briefing — Bloco 2: Engine de Certificados Parametrica

> Use este briefing para iniciar nova sessao Claude Code.
> Prompt sugerido: "Leia o briefing em PLANNING/BRIEFING-BLOCO2-CERTIFICADOS.md e vamos trabalhar no Bloco 2"

---

## Contexto

O sistema HalalSphere gera certificados Halal em PDF (backend NestJS + PDFKit).
A FAMBRAS usa 336 templates DOCX (em `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026\`)
organizados por pais (BR/AR/CO/PY/EC), tipo (frigorifico/industrial), acreditacao, etc.

### Descoberta chave (sessao 11-12/04/2026)
Os 336 DOCX colapsam em **4-5 templates base**. A maioria das variacoes e puramente
textual/parametrica. A diferenca real de layout e:
- **Standard** (sem arabe) vs **Arabic bilingue** (GAC+ENAS, OIC/SMIIC)
- **Landscape** (FM 7.7.1 Approval) vs **Portrait** (FM 7.7.2 Certificado Unico)

### Os 4-5 renderers necessarios

| # | Template Base | Orientacao | Quando usar |
|---|-------------|-----------|------------|
| 1 | FM 7.7.1 Standard | Landscape | Approval sem arabe (GSO, UAE, BPJPH, MUIS, MS, SEM GOLFO) |
| 2 | FM 7.7.1 Arabic | Landscape | Approval com GAC+ENAS ou OIC (bilingue EN+AR) |
| 3 | FM 7.7.2 Standard | Portrait | Cert. unico sem arabe |
| 4 | FM 7.7.2 Arabic | Portrait | Cert. unico OIC/SMIIC (bilingue EN+AR) |

### O que JA existe implementado

**Backend** (`halalsphere-backend/src/certificate/`):
- `pdf/certificate-renderer.ts` — FM 7.7.2 portrait, usa background image, multi-pagina
- `pdf/approval-renderer.ts` — FM 7.7.1 landscape, usa background image
- `pdf/base-template.renderer.ts` — classe base (possivelmente obsoleta, nao herdada pelos renderers ativos)
- `pdf/qrcode-generator.ts` — QR com logo FAMBRAS, error correction H
- `pdf/product-table.renderer.ts` — tabela de produtos (possivelmente nao usado pelo renderer ativo)
- `pdf/pdf-utils.ts` — cores, fontes, dimensoes, formatacao de data
- `certificate-pdf.service.ts` — orquestrador (busca dados, monta context, chama renderer)
- `data/seal-config.ts` — selos por mercado (todos com paths PLACEHOLDER)
- `data/signatory-config.ts` — signatario padrao (Mohamed Hussein El Zoghbi)
- `data/dt-code-map.ts` — categoria → DT code
- `data/category-display-map.ts` — categoria display GSO vs SMIIC
- `data/arabic-labels.ts` — labels em arabe
- `interfaces/certificate-template.interfaces.ts` — PdfRenderContext, CompanyData, etc.

**Assets existentes** (`src/certificate/assets/`):
- `fonts/NotoSansArabic-Regular.ttf`, `NotoSansArabic-Bold.ttf` — OK
- `images/fambras-qr-logo.jpeg` — logo para QR code — OK
- **FALTAM**: selo FAMBRAS, selo GAC, selo ENAS, selo BPJPH, selo MUIS, selo MS, selo OIC

**Imagens de referencia** (`halalsphere-docs/CERTIFICATES/layouts/`):
- `Cert_unico_com_cabeçalho.png` — background portrait (usado pelo CertificateRenderer)
- `Cert_unico_completo.png` — certificado completo de referencia
- `Cert_unico_bordas.png` — so as bordas turquesa
- `cert_unico_logo_cabecalho_completo.png` — logo cabecalho
- `assinatura_cert_unico.png` — assinatura + selo FAMBRAS
- `Certifificado_aprovacao_partes/fundo_completo_sem_assinatura.png` — background landscape
- `Certifificado_aprovacao_partes/assinatura.png` — assinatura approval
- `Certifificado_aprovacao_partes/selo_gac.png` — selo GAC real
- `Certifificado_aprovacao_partes/logo_fambras_certificacao.png`
- `Certifificado_aprovacao_partes/logo_cabeçalho_completo.png`
- `Certifificado_aprovacao_partes/bordas.png` — bordas landscape
- `fambras-halal-logo.png` — selo FAMBRAS (verde, handshake)
- `logo_qrcode.jpeg` — logo FAMBRAS para overlay no QR
- `qrcode_fambras_frigorifico.png` — exemplo de QR gerado
- `approval_layout_analysis.png` — screenshot de approval real (JBS)

### Os 7 eixos de variacao (todos parametricos)

| Eixo | Valores | Como afeta |
|------|---------|-----------|
| **Tipo** | FRIGORIFICO / INDUSTRIAL | FM 7.7.1 vs FM 7.7.2, colunas da tabela de produtos |
| **Pais** | BR, AR, CO, PY, EC | Sufixo form code (.A, .C, .P), label registration ID, background image |
| **Especie** (frig) | AVES / BOVINOS | DT code (7.2.1 vs 7.2.2) — ja no dt-code-map |
| **Acreditacao** | GAC, GAC+ENAS, BPJPH, MUIS, MS, UAE, OIC/SMIIC, SEM GOLFO | Selos renderizados, Arabic bilingue ou nao |
| **Registration ID** | CNPJ (BR), CUIT (AR), RUT (CO), RUC (PY/EC) + com/sem SIF | Label dinamico |
| **Anexo** | COM / SEM produto attachment | Paginas extras — ja implementado |
| **Embalagem** | Normal / Granel / Alcool | Disclaimer condicional no anexo |

### GAPs identificados (o que falta)

1. **Selos sao placeholders** — PNGs reais existem em layouts/ mas nao em assets/images/
2. **Sem variante Arabic bilingue** — renderers 2 e 4 nao existem
3. **Sem config por pais** — sufixo form code, label registration ID, orgao sanitario
4. **Sem combos de acreditacao** — seal-config tem selos individuais, nao GAC+ENAS junto
5. **Sem flags granel/alcool** — disclaimers condicionais nao implementados
6. **extractRequirements()** nao passa norma para getCategoryDisplay()
7. **Multiplas categorias** — extractRequirements() pega so UMA categoria
8. **BaseTemplateRenderer** possivelmente codigo morto (nao herdado)

### Templates DOCX de referencia (ja analisados)

Para comparar layout, abrir estes DOCX representativos:
- BR GOLFO GSO: `FRIGORIFICO/BRASIL/AVES/GOLFO - GSO - DT 7.2.1/FM 7.7.1 - BR COM SIF - GOLFO_GSO.docx`
- AR GOLFO: `FRIGORIFICO/ARGENTINA/AVES/COM GOLFO SEM ANEXO.docx`
- GAC+ENAS (Arabic): `FRIGORIFICO/BRASIL/BOVINOS/GOLFO - GSO E UAE - DT 7.2.2/GAC E ENAS/FM 7.7.1 - BR SEM SIF - GAC e ENAS.docx`
- OIC/SMIIC (Arabic): `INDUSTRIAL/BRASIL/OIC SMIIC - DT'S/FM 7.7.2 - CERTIFICADO UNICO - OIC_COM ANEXO DE PRODUTOS.docx`
- Granel: `INDUSTRIAL/BRASIL/GOLFO - DT 7.4/GAC/FM 7.7.2 - CERT UNICO - GOLFO_COM_ANEXO_granel.docx`
- Alcool: `INDUSTRIAL/BRASIL/GOLFO - DT 7.4/GAC/FM 7.7.2 - CERT UNICO - GOLFO_COM_ANEXO_granel_alcool.docx`

Todos estao em `C:\HalalSphere\@TEMPLATE DO CERTIFICADO.2026\`

### Contexto adicional

- Bloco 1 (internacionalizacao cadastro) esta PLANEJADO mas nao iniciado — sera feito depois
- Branch de trabalho: `release`
- NUNCA push sem confirmacao explicita do Renato
- Ler `GUIDES/LICOES-APRENDIDAS.md` antes de qualquer alteracao
- Novo controller = regenerar API Gateway no mesmo commit

---

## Proximos passos sugeridos

1. Copiar assets reais (selos, logos) de layouts/ para assets/images/
2. Criar `country-config.ts` (sufixo form code, label regID, orgao sanitario por pais)
3. Expandir `seal-config.ts` para combos (GAC+ENAS, BPJPH+MUIS)
4. Adicionar flags granel/alcool ao PdfRenderContext
5. Corrigir extractRequirements() (norma + multiplas categorias)
6. Implementar renderers Arabic (FM 7.7.1 Arabic, FM 7.7.2 Arabic)
7. Parametrizar background images por pais+acreditacao
8. Testar geracao de PDF com dados reais
