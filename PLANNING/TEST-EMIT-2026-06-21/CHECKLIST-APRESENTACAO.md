# Checklist da apresentação — Emissão de Certificados Halal (GC)

## Antes de abrir o navegador

- [ ] Confirmar que último deploy backend (`a6f5fe96` ou superior) terminou
- [ ] Confirmar que último deploy frontend (`a3f36ae8` ou superior) terminou
- [ ] Limpar cache do navegador / usar aba anônima
- [ ] Ter abertos: 1 cert real recente da BRF + 1 template oficial da pasta `@TEMPLATE` para comparar lado a lado se cliente pedir
- [ ] Pasta `output/` deste diretório contém 12 PDFs de teste já validados (caso precise mostrar como referência)

## Casos seguros para demonstrar ao vivo

### 🟢 Industrial — Cert Único (FM 7.7.2)

| Demo | Como fazer | O que mostrar |
|---|---|---|
| **CIV + Golfo (GAC+ENAS bilíngue)** | Categoria CIV, marcar GSO em Normas elegíveis, 10+ produtos | Selo GAC+ENAS, attachment de produtos, bilíngue OK, GSO 2055-1/2015 aparece em Requirements |
| **CIV + Indonésia (BPJPH)** | Categoria CIV, marcar BPJPH, 10 produtos | Selo BPJPH (Garuda), KEPKABAN BPJPH em Requirements, sem GAC |
| **CIV + Singapura (MUIS)** | Categoria CIV, marcar MUIS, 10 produtos | Selo MUIS, MUIS-HC-S001/2005 em Requirements |
| **CIV + Malásia (MS)** | Categoria CIV, marcar MS, 10 produtos | Selo JAKIM, MS 1500/2009 em Requirements |
| **CIV + OIC/SMIIC** | Categoria CIV, marcar OIC_SMIIC, 10 produtos | Selo HAL Accreditation Agency, OIC/SMIIC 2 em Requirements, **categoria CI** (não CV — fix de hoje) |
| **CIV + GSO granel + álcool** | Categoria CIV, marcar GSO, ativar checkboxes granel e álcool | Disclaimer "marketed in bulk" + "alcohol-derived ingredients" em EN+AR na página 2 |

### 🟢 Frigorífico — Habilitação (FM 7.7.1)

| Demo | Como fazer | O que mostrar |
|---|---|---|
| **CV bovino + GSO** | Categoria CV, planta com species=Bovino, marcar GSO | DT 7.2.2 Bovine, layout landscape, QR+sig posicionados OK, GAC+ENAS |
| **CV + OIC/SMIIC** | Categoria CV, marcar OIC_SMIIC | **Categoria renderiza como "CI - Abate Halal..."** (fix do dia), selo HAK |
| **K bioquímicos + GSO** | Categoria K, planta com SIF, marcar GSO | FM 7.7.1 picker (K+SIF), DT 7.4 |

## Fluxo recomendado de demo (15-20min)

1. **Login + abrir tela manual** (`/analista/emissao-manual-certificado`)
2. **Mostrar Seção 3 simplificada**: marcar "GSO 2055-2 (Golfo)" e apontar o bloco azul "Norma principal: GSO 2055-2 · Template do PDF: GAC + ENAS (bilíngue) — auto" — explicar que o sistema deriva selo da norma automaticamente
3. **Demonstrar override**: marcar checkbox "Customizar manualmente (exceção)" para mostrar que ainda dá pra escolher manualmente em casos raros
4. **Preencher empresa + planta + categoria** (usar BRF já cadastrada)
5. **Importar CSV** ou adicionar 5-10 produtos manualmente — mostrar marca por produto
6. **Emitir** e abrir PDF gerado
7. **Comparar lado a lado** com template oficial da pasta `@TEMPLATE` para mostrar fidelidade
8. **Repetir** com 1 ou 2 cenários diferentes (frigorífico, OIC/SMIIC etc) para mostrar variedade de selos

## Se o cliente perguntar...

### "Por que esse cert com 5 produtos veio em 2 páginas?"
> "Hoje o sistema sempre usa o gabarito com anexo para industrializados. A variante de 1 página (até 8 produtos inline) é Phase 2 — temos o template oficial mapeado, sai logo. Não compromete validade do certificado, é só otimização visual."

### "Por que 'Certified since' está com a data de hoje?"
> "Em certificados de renovação (cliente já tem histórico), o sistema puxa a data do 1º certificado da empresa. Como este é um cert novo emitido agora, fica igual à data de emissão. Em produção real com clientes recorrentes, esse campo mostra o histórico correto."

### "Onde estão os produtos no certificado de frigorífico?"
> "Frigorífico, conforme orientação FAMBRAS (Lina), trabalha com escopo genérico — categoria 'CV - Abate de animais' cobre todos os produtos. O cliente FAMBRAS Lina confirmou na sessão hands-on que 'cortes de frango' inline em 1-2 linhas matam o gabarito. Lista detalhada de produtos vai pro anexo se o escopo crescer."

### "Por que K caiu em DT 7.4 (chemicals) e não DT 7.5 (drugs)?"
> "Categoria K é bioquímicos — pode ser food additive, drug ou cosmetic. Quando há subcategoria explícita (K-01 alimento, K-02 gelatina), o sistema refina para DT 7.1. Sem subcategoria, default conservador é DT 7.4. No fluxo real o analista escolhe subcategoria no cadastro."

### "O layout está fiel ao oficial?"
> "Auditamos os 4 layouts base (FM 7.7.1 landscape EN+AR, FM 7.7.2 portrait EN+AR) contra os 336 templates oficiais da FAMBRAS. Conferimos posicionamento de selos, datas, QR code, assinatura. Hoje (sessão 21/jun) corrigimos 4 gaps específicos: mapeamento CV→CI em SMIIC, renderização de standards em FM 7.7.2, alinhamento de datas e posicionamento de QR+assinatura."

### "E o templates árabes diferentes?"
> "Estamos aguardando da Elaine (Qualidade FAMBRAS) a versão final do template árabe oficial. Os atuais foram derivados do email Care Coding de fim de 2025 e estão funcionais — quando chegar a versão final atualizamos."

## Comandos de emergência (se algo travar)

- **Cert manual não emite**: ver `/admin/auth-logs` para checar permissão; role deve ser analista/gestor/admin
- **PDF sai vazio**: ver Cloudwatch logs do serviço `halalsphere-api`
- **Empresa não aparece na lista**: ver se cadastro está completo via `/empresas/:id` — campos `legalName`, `taxId`, `address` (JSON)
- **Categoria não aparece**: ver `/industrial-classification` está populado (deve ter ~30 categorias após reset 28/mai)

## Cleanup pós-apresentação

12 certs emitidos com `certificateNumber LIKE 'TEST-CASE-%'` para limpar:

```sql
-- Verificar primeiro
SELECT id, certificate_number, status, issued_at FROM certificates 
WHERE certificate_number LIKE 'TEST-CASE-%';

-- Cascade de Certification + Scope (verificar FK em prod)
DELETE FROM certificates WHERE certificate_number LIKE 'TEST-CASE-%';
```

## Lembretes

- Apresentação é DEFINITIVA — não pode haver erro técnico não-justificado
- 12 PDFs de teste em `output/` servem como referência se cliente pedir
- `GAPS.md` neste diretório tem o relatório completo de gaps por caso
