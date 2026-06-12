# Plano Bloco 1 — Internacionalizacao: Cadastro Multi-Pais

> **Status**: PLANEJADO (nao iniciado)
> **Data**: 2026-04-11
> **Prioridade**: Apos certificados (Bloco 2)
> **Dependencia**: Nenhuma — pode ser executado independente

## Contexto

O sistema HalalSphere atende apenas empresas brasileiras. A FAMBRAS tem filiais na Argentina, Colombia, Paraguai e Equador que precisam usar o sistema. O objetivo deste bloco e permitir que empresas desses 5 paises se cadastrem, percorram o workflow completo e cheguem ao final do fluxo (certificado).

**Principio**: Nao perder nada do que ja funciona para Brasil. Expandir sem quebrar.

## Decisao pendente: i18n

A internacionalizacao da interface (pt-BR → espanhol) sera tratada em plano separado.
Opcoes em avaliacao:
- i18n progressivo (infra agora, traduzir so o que tocar)
- i18n em bloco separado (sistema opera em pt-BR para todos ate la)

---

## APIs de Lookup por Pais

| Pais | Doc Fiscal | API de Lookup | Endpoint | Auth | Dados |
|------|-----------|---------------|----------|------|-------|
| **BR** | CNPJ | **cnpj.ws** (ja implementado) | Backend configura provider | DB config | Razao social, endereco, atividade, socios |
| **AR** | CUIT | **AFIP sr-padron** (gov, gratis) | `soa.afip.gob.ar/sr-padron/v2/persona/{cuit}` | Nenhuma | Nome, tipo, domicilio fiscal |
| **CO** | NIT | **RUES** (gov, web scraping) | Nao tem API REST publica gratuita | N/A | Necessita scraping ou servico pago |
| **PY** | RUC | **TuRuc API** (gratis) | `turuc.com.py/api/` (REST JSON) | Nenhuma | Razao social, estado, RUC |
| **EC** | RUC | **SRI** (gov, web) | Nao tem API REST publica gratuita | N/A | Necessita scraping ou servico pago |

**Decisao**: Lookup automatico para BR (manter), AR e PY (APIs gratis). CO e EC = cadastro manual.

## APIs de CEP/Codigo Postal

| Pais | Formato | API Gratuita |
|------|---------|-------------|
| **BR** | 8 digitos | BrasilAPI + ViaCEP (ja implementado) |
| **AR** | 4 digitos / CPA 8 chars | Georef AR (gov, gratis): `apis.datos.gob.ar/georef/api/direcciones` |
| **CO** | 6 digitos | Manual (sem API publica) |
| **PY** | 6 digitos | Manual (sem API publica) |
| **EC** | 6 digitos | Manual (sem API publica) |

## Orgaos de Inspecao Sanitaria

| Pais | Orgao Federal | Equivalente ao SIF |
|------|--------------|-------------------|
| **BR** | MAPA/DIPOA | SIF, SIE, SIM |
| **AR** | SENASA | No de Establecimiento SENASA |
| **CO** | INVIMA | Registro Sanitario INVIMA |
| **PY** | SENACSA | No de Registro SENACSA |
| **EC** | AGROCALIDAD | No de Registro AGROCALIDAD |

---

## Tarefas

### Fase 1 — Backend: Schema e DTOs

#### 1.1 Prisma Schema — Expandir enums
**Arquivo**: `halalsphere-backend/prisma/schema.prisma`
- Expandir `PlantCodeType`: adicionar `senasa`, `invima`, `senacsa`, `agrocalidad`
- Confirmar `TaxIdType` inclui `CUIT`
- Confirmar `Country` inclui `AR` e `EC`

#### 1.2 Register DTO — Expandir paises e tipos
**Arquivo**: `halalsphere-backend/src/auth/dto/register.dto.ts`
- `country`: `['BR', 'CO', 'PY']` → `['BR', 'AR', 'CO', 'EC', 'PY']`
- `taxIdType`: adicionar `'CUIT'`
- `uf`: tornar opcional

#### 1.3 Auth Service — Corrigir mapeamento pais
**Arquivo**: `halalsphere-backend/src/auth/auth.service.ts`
- Substituir ternario hardcoded por mapa `COUNTRY_NAMES`

#### 1.4 Company DTO — Remover validacao CNPJ hardcoded
**Arquivos**: `create-company.dto.ts`, `register-company.dto.ts`
- Remover regex CNPJ, usar `@MinLength(8) + @MaxLength(20)`
- Remover default `'Brasil'`

#### 1.5 Company Service — Validacao condicional por pais
**Arquivo**: `halalsphere-backend/src/company/company.service.ts`
- Validar CNPJ (14 digitos) somente se country === 'BR'

#### 1.6 Migration Prisma

### Fase 2 — Backend: Tax ID Lookup Service

#### 2.1 Expandir cnpj-lookup internamente
- Adicionar `lookupTaxId(country, taxId)` no service existente
- BR: fluxo existente | AR: AFIP | PY: TuRuc | CO/EC: null

#### 2.2 Provider Argentina (AFIP)
**Novo**: `src/cnpj-lookup/providers/afip.provider.ts`

#### 2.3 Provider Paraguai (TuRuc)
**Novo**: `src/cnpj-lookup/providers/turuc.provider.ts`

#### 2.4 Controller — Endpoint generico
- `GET /cnpj-lookup/international/:country/:taxId`

### Fase 3 — Frontend: Formularios Multi-Pais

#### 3.1 UfSelect → StateSelect (generico por pais)
#### 3.2 brazilian-states.ts → expandir com provincias/departamentos
#### 3.3 CEP lookup condicional por pais (Georef AR)
#### 3.4 CnpjSearchInput → TaxIdSearchInput (generico)
#### 3.5 RegisterCompanyPage — adaptar por pais
#### 3.6 AddCompanyToGroupModal — PlantCodeType por pais
#### 3.7 company.types.ts — expandir PlantCodeType

### Fase 4 — Admin: Simplificar Config Lookup

- Descontinuar multi-provider (manter apenas o ativo)
- Seção informativa para AR/PY (API publica) e CO/EC (sem lookup)

### Fase 5 — Auditor Allocation

- Remover defaults `'BR'` hardcoded em matching.service.ts
- Skip logica UF adjacency quando pais != BR

---

## Arquivos Alterados

### Backend (~12 arquivos)
1. `prisma/schema.prisma`
2. `src/auth/dto/register.dto.ts`
3. `src/auth/auth.service.ts`
4. `src/company/dto/create-company.dto.ts`
5. `src/company/dto/register-company.dto.ts`
6. `src/company/company.service.ts`
7. `src/cnpj-lookup/cnpj-lookup.service.ts`
8. `src/cnpj-lookup/cnpj-lookup.controller.ts`
9. `src/cnpj-lookup/providers/afip.provider.ts` (NOVO)
10. `src/cnpj-lookup/providers/turuc.provider.ts` (NOVO)
11. `src/auditor-allocation/services/matching.service.ts`
12. `src/auditor-competency/dto/create-competency.dto.ts`

### Frontend (~11 arquivos)
1. `src/types/international.ts` (ja OK)
2. `src/types/company.types.ts`
3. `src/lib/brazilian-states.ts`
4. `src/lib/masks.ts`
5. `src/components/ui/UfSelect.tsx`
6. `src/components/onboarding/CnpjSearchInput.tsx`
7. `src/pages/onboarding/RegisterCompanyPage.tsx`
8. `src/components/group/AddCompanyToGroupModal.tsx`
9. `src/services/cep.service.ts`
10. `src/services/cnpj-lookup-config.service.ts`
11. `src/pages/admin/CnpjLookupSettings.tsx`

---

## O que NAO muda (preservado)

- Fluxo CNPJ lookup para BR (provider cnpj.ws, cache, rate limit)
- CEP lookup para BR (BrasilAPI + ViaCEP)
- Workflow de 17 fases (agnostico de pais)
- Campo `cnpj` no schema Company (nome legacy, semantica = taxId principal)
- Modulo cnpj-lookup (nome mantido, expandido internamente)
- Rotas existentes da API (backward compat)
- `international.ts` no frontend (ja tem AR, EC, CUIT)

---

## Verificacao / Testes

1. Cadastro BR: funcionar exatamente como antes
2. Cadastro AR: CUIT + provincias + lookup AFIP
3. Cadastro CO: NIT + departamentos + sem lookup
4. Cadastro PY: RUC + departamentos + lookup TuRuc
5. Cadastro EC: RUC + provincias + sem lookup
6. Grupo multi-pais: empresas BR + AR coexistem
7. Workflow: empresa AR percorre 17 fases
8. Auditor: alocacao funciona com pais != BR
9. Testes unitarios: 31 test files passando
