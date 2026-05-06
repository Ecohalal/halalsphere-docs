# Cadastro de Empresa e Planta — Mapeamento do Estado Atual

> Documento de referência: snapshot do **estado atual** do cadastro de
> empresa e planta no HalalSphere (GC), antes do refator que separa Empresa
> de Planta e habilita modelo multi-país.
>
> Gerado em 2026-05-04 a partir de análise direta do schema, controllers e
> services do `halalsphere-backend` (commit referência: branch `release`).

---

## 1. Decisão histórica relevante

No schema do HalalSphere (`prisma/schema.prisma:2033`) há a nota:

```
// NOTA: model Plant REMOVIDO - campos absorvidos por Company (plantCode, plantCodeType, etc.)
// Tabela "plants" mantida no banco para referência histórica
```

Em algum momento da construção do HalalSphere foi tomada a decisão consciente
de **remover o `model Plant` separado** e absorver seus campos em `Company`.
A premissa implícita era "uma empresa FAMBRAS = uma planta". Essa premissa
não se sustenta quando consideramos:

- Grupos brasileiros com múltiplas filiais (cada uma com CNPJ + SIF próprios).
  Ex.: Minerva S.A., JBS, Marfrig, BRF.
- Operação internacional desses grupos (Minerva no Paraguai com RUC +
  Establecimiento No., etc.).
- Habilitação por país de destino (HAKSİS Turquia, BPJPH Indonésia, MOIAT
  Emirados, SFDA Arábia) que é por **planta**, não por empresa.
- Certificação halal que é por **planta**, não por empresa jurídica.

---

## 2. Modelos atuais — Empresa + Planta misturadas em `Company`

### 2.1 `Company` (modelo único hoje)

Identificadores e dados PJ:
- `cnpj` (único, 14 dígitos) — assume Brasil
- `razaoSocial`, `nomeFantasia`, `tipoEmpresa`
- `address` (JSON) + colunas planas (`endereco`, `cidade`, `estado`, `cep`, `pais`)
- `contact` (JSON) + colunas planas (`email`, `telefone`)
- `numEmployees`, `annualRevenue`, `mainActivity`

Dados de Planta vazando em Company (ponto crítico):
- `plantCode` String? — SIF/SIE/SIM/interno (1 por empresa)
- `plantCodeType` enum {sif, sie, sim, internal}
- `productionCapacity`, `employeeCount`, `shiftsCount`

Habilitação internacional (todos em Company):
- `haksisRegistered` (Turquia)
- `siHalalRegistered` (Indonésia)
- `moiatRegistered` (Emirados)
- `sfdaRegistered` (Arábia)
- `internationalRegistrations` JSON (detalhes)

Workflow FAMBRAS (G-111 a G-116, já implementado):
- `pendingValidation` boolean
- `isVerified`, `verifiedAt`, `verifiedBy`
- `isActive` (soft delete)
- `validationNotes`

Vínculo:
- `userId` único (1:1 com User; admin temporário no onboarding)
- `groupId` (obrigatório — cria grupo solo se independente)
- `isHeadquarters` boolean

### 2.2 `CompanyGroup` (grupos empresariais — G-010 a G-013)

```
- name ("Grupo BRF", "Grupo Minerva")
- tradeName, document (CNPJ holding opcional)
- contactName, contactEmail, contactPhone
- companies[]
- sharedSuppliers[] (G-006)
- corporateDocuments[] (G-003)
```

Toda Company pertence a um grupo (mesmo que solo). Isso já existe e funciona.

### 2.3 `Certification` (certificação por empresa, não por planta)

```
- companyId (FK Company)  ← certificação atrelada à Empresa
- certificationNumber (HS-2026-001), certificationType, status
- validFrom, validUntil
- industrialGroupId, industrialCategoryId, industrialSubcategoryId
- standard (CertificationStandard) + standardNotes
- suspensão / cancelamento / rejeição (todos com tipo + razão)
- analystId (analista FAMBRAS)
- 20+ relações: scope, requests, history, documents, contracts, audits,
  proposals, certificates, comments, labSamples, complaints,
  sealUsageControls, nonConformities, qualityReviews,
  supplierHomologations, etc.
```

### 2.4 `CertificationScope` + `ScopeFacility`

```
CertificationScope (1:1 com Certification)
  - description, productionCapacity, numEmployees, numShifts
  - appccCount, productionLines, productVariety
  - hasSubcontracted + subcontractedDesc
  - applicableStandards
  - facilities[], products[], brands[], suppliers[]

ScopeFacility (filhas do Scope)
  - name, address, city, state, country, postalCode
  - facilityType (fabrica, armazem, escritorio)
  - status (ativo/inativo)
```

**Nota:** `ScopeFacility` modela "instalações no escopo da certificação" mas
não tem código sanitário (SIF/equivalente). Endereço sim, identificador
operacional não.

### 2.5 Outros modelos relevantes

- **`SharedSupplier`** (G-006): fornecedor compartilhado dentro do grupo
  com `halalCertificateUrl`, `halalCertificateExpiry`, status approval.
  **Sem SIF.**
- **`ScopeSupplier`**: fornecedor de matéria-prima por escopo. Tem
  `halalCertificateNumber`, `halalIssueDate`, `halalValidityDate`,
  `manufacturerName`, `manufacturerAddress`, `riskLevel` (BAIXO, MEDIO,
  ALTO, CRITICO). **Sem SIF.**
- **`Product`**: catálogo mestre por Company.
- **`Contract`, `Proposal`, `Audit`, `Certificate`, `AiAnalysis`**: todos
  com FK direto para Company.

---

## 3. Endpoints `/companies` (já implementados — 30+ rotas)

| Categoria | Rotas |
|---|---|
| Onboarding | `POST /companies/register` (G-111), `GET /companies/me` |
| CRUD básico | `POST /companies`, `GET /:id`, `PATCH /:id`, `DELETE`, `PATCH /:id/reactivate` |
| Lookup CNPJ | `GET /cnpj/:cnpj`, `/cnpj/:cnpj/exists`, `/cnpj/:cnpj/full` |
| Listagem/busca | `GET /companies` (filtros), `/search/query`, `/stats/summary` |
| Validação FAMBRAS | `GET /pending-validation` (G-116), `POST /:id/validate` (G-115), `/:id/reject-validation`, `PATCH /:id/verify`, `/:id/unverify` |
| Grupos | `GET /group/:groupId`, `POST /:id/add-to-group`, `/:id/remove-from-group` |

Service implementa: CNPJ unicidade aplicacional, soft delete, criação
automática de grupo solo quando `groupId` ausente.

---

## 4. Mapa de inconsistências e limitações

| Conceito de negócio | Onde está hoje | Limitação |
|---|---|---|
| Empresa = pessoa jurídica | `Company` (CNPJ) | Mistura com planta; assume Brasil (CNPJ hardcoded) |
| Planta = unidade operacional | `Company.plantCode` | **1 por empresa**. Empresa com 5 SIFs vira 5 Companies (ou perde 4) |
| Multi-país | colunas planas (`pais`, `estado`) | Sem suporte estrutural a outros taxIds (RUC, CUIT, NIT) ou códigos sanitários (Establecimiento No.) |
| Habilitação por país de destino | `Company.haksisRegistered` etc. | Habilitação é por planta, não por empresa |
| Certificação | `Certification.companyId` | Certificação é por planta |
| Instalação no escopo | `ScopeFacility` | Sem código sanitário |
| Fornecedor com cert halal | `SharedSupplier`, `ScopeSupplier` | Sem código sanitário; perde rastreabilidade quando fornecedor é planta |
| Plantas externas (TASK-07) | Não existe | Sem casa |

---

## 5. Premissas que mudam no novo modelo

1. **HalalSphere é MVP**, sem volume relevante de dados em produção. Aceito
   zerar cadastro pra simplificar refator (decisão 2026-05-04).
2. **Certificação é por planta**, não por empresa.
3. **Habilitação por país de destino é por planta.**
4. **Cada planta = pessoa jurídica própria** (no Brasil cada filial tem CNPJ
   distinto; no Paraguai cada estabelecimento tem RUC + Establecimiento No.).
5. **Grupos empresariais** (Minerva, JBS, Marfrig, BRF) agrupam plantas
   nacionalmente e internacionalmente. Mesmo grupo pode ter Companies em
   múltiplos países.
6. **Multi-país é mandatório**, não opcional. Cada país tem seu pacote de
   identificadores: BR (CNPJ + SIF), PY (RUC + Establecimiento No.),
   AR (CUIT), BO (NIT + Senasag), CO (NIT + INVIMA), etc.

---

## 6. Próximo passo

Desenho do novo modelo Empresa+Planta+Habilitação por país, com schema
concreto e plano de refator. Documento separado:
`PLANNING/CADASTRO-EMPRESA-PLANTA-NOVO-MODELO.md` (a criar).
