# Cadastro de Empresa e Planta — Novo Modelo

> Documento de design completo do refator do cadastro de Empresa e Planta
> no HalalSphere (GC), separando entidades, habilitando multi-país, e
> alinhando com o restante do ecossistema halal (SIH, SysHalal).
>
> Documento companheiro do mapeamento do estado atual em
> [CADASTRO-EMPRESA-PLANTA-MAPEAMENTO.md](./CADASTRO-EMPRESA-PLANTA-MAPEAMENTO.md).
>
> Gerado em 2026-05-04 a partir da decisão arquitetural de tornar o GC
> (HalalSphere) o cadastro master de Empresa+Planta no ecossistema, com
> SIH e (eventualmente) SysHalal consumindo via API.
>
> **Status (2026-05-07):** Caminho A confirmado pelo PO — refactor executa
> **antes** da Onda 1+ FAMBRAS (ver `sih-docs/PLANNING/FAMBRAS-VISITA-1504-ONDA-1+.md`).
> **D8 original mantida** (reset da base autorizado pelo PO; todos os
> fluxos atuais são testes descartáveis). Estimativa: **12-17 dias úteis**
> em 5 fases. Itens 4, 5 e 6 da Onda 1+ FAMBRAS (CertificationScope APPCC,
> Subcontractor, ScopeBrand.ownership) já foram implementados em
> 2026-05-07 antes do refactor — serão preservados no schema fresh.

---

## Sumário

1. [Resumo executivo](#1-resumo-executivo)
2. [Decisões arquiteturais consolidadas](#2-decisões-arquiteturais-consolidadas)
3. [Enums novos](#3-enums-novos)
4. [Schema das entidades](#4-schema-das-entidades)
5. [Refator das entidades dependentes](#5-refator-das-entidades-dependentes)
6. [User refinado e segregação por grupo](#6-user-refinado-e-segregação-por-grupo)
7. [Endpoints HTTP](#7-endpoints-http)
8. [Guard `@CompanyGroupScope`](#8-guard-companygroupscope)
9. [Plano de execução em fases](#9-plano-de-execução-em-fases)
10. [Roadmap pós-MVP](#10-roadmap-pós-mvp)
11. [Decisões registradas](#11-decisões-registradas)

---

## 1. Resumo executivo

**4 níveis de granularidade**, hoje colapsados em `Company`:

```
CompanyGroup       → Holding/Grupo multinacional ("Minerva", "JBS", "BRF")
    ↓ 1:N
Company            → Pessoa Jurídica em um país ("Minerva BR" CNPJ X, "Minerva PY" RUC Y)
    ↓ 1:N
Plant              → Unidade Operacional certificável (com SIF/Establecimiento/etc)
    ↓ 1:N
CountryHabilitation → Habilitação dessa planta para exportar a um país de destino
```

**O que muda em uma frase:** `Company` deixa de carregar dados de planta;
`Plant` vira entidade própria; habilitações por país de destino saem de
flags booleanas e viram tabela aberta; certificação halal passa a ser
por planta, não por empresa.

**Habilitadores de negócio:**

- Grupos multinacionais com plantas em vários países (Minerva BR + Minerva PY)
- Empresas com múltiplas plantas no mesmo país (5 SIFs distintos)
- Habilitação por país de destino (SFDA, JAKIM, BPJPH, MOIAT, HAKSİS, etc.)
  como tabela aberta — adicionar país é INSERT, não migration
- Plantas externas (não-FAMBRAS) registradas para rastreabilidade
  (suporta TASK-07 do SIH — desossa com origem CDIAL/IFANCA)
- Segregação de visibilidade por usuário externo (cliente vê só dados
  do próprio grupo; FAMBRAS/Ecohalal veem tudo)

---

## 2. Decisões arquiteturais consolidadas

| # | Decisão | Razão |
|---|---|---|
| D1 | GC (HalalSphere) é master único de Empresa+Planta | É o ERP da certificadora; SysHalal e SIH consomem via API |
| D2 | SysHalal é puro produção, **não alterado** | Operacional há 9+ meses; refator é projeto separado |
| D3 | Multi-país é mandatório desde o dia 1 | Grupos brasileiros têm operação em PY/AR/UY/BO/etc. |
| D4 | Identificadores fiscais/sanitários abertos via enum | Adicionar país novo não exige migration de schema |
| D5 | Habilitação por país de destino é tabela aberta | Adicionar mercado novo (ex: Tailândia CICOT) é INSERT |
| D6 | Certificação é por Plant, não por Company | Modelo correto operacionalmente; alinha com habilitação por planta |
| D7 | Plantas externas (TASK-07) cabem como Company com `relationship=partner` | Sem entidade nova; sem inflar SysHalal com cadastro de outras certificadoras |
| D8 | HalalSphere é MVP — pode zerar dados | Sem migração; refator com schema fresh |
| D9 | `relationship` ∈ {client, partner}; prospect é fase do client | Workflow `pendingValidation` já modela ciclo do lead |
| D10 | CompanyGroup é multinacional (cobre Companies em vários países) | Visão consolidada do conglomerado; FAMBRAS pode comercializar por Company |
| D11 | Habilitações cadastradas manualmente no MVP | Integração com APIs oficiais (SFDA, JAKIM) é roadmap futuro |
| D12 | User externo vinculado a `companyGroupId` (e opcionalmente `companyId`) | 1 user = 1 grupo no MVP; tabela N:N só se aparecer caso |
| D13 | Despachantes do SysHalal **não** têm correspondente no GC | GC é fluxo de certificação; despachante é contexto de exportação |
| D14 | Cert externa (TASK-07) é campo opcional em Plant, não tabela separada | 1 planta = 1 cert halal vigente por vez no MVP |

---

## 3. Enums novos

### 3.1 `Country`

Códigos ISO 3166-1 alpha-2. Lista core relevante para halal/exportação. Extensível.

```prisma
enum Country {
  // América do Sul
  BR  // Brasil
  AR  // Argentina
  PY  // Paraguai
  UY  // Uruguai
  BO  // Bolívia
  CO  // Colômbia
  PE  // Peru
  EC  // Equador
  CL  // Chile

  // América do Norte
  US  // Estados Unidos
  CA  // Canadá
  MX  // México

  // Europa
  GB  // Reino Unido
  IE  // Irlanda
  ES  // Espanha
  PT  // Portugal
  FR  // França
  DE  // Alemanha
  IT  // Itália
  NL  // Holanda
  BE  // Bélgica
  PL  // Polônia
  TR  // Turquia (também atende mundo muçulmano)

  // Oriente Médio
  SA  // Arábia Saudita
  AE  // Emirados Árabes Unidos
  BH  // Bahrein
  KW  // Kuwait
  OM  // Omã
  QA  // Catar
  JO  // Jordânia
  LB  // Líbano
  IQ  // Iraque
  IR  // Irã
  YE  // Iêmen

  // África / Norte da África
  EG  // Egito
  MA  // Marrocos
  TN  // Tunísia
  DZ  // Argélia
  LY  // Líbia
  SD  // Sudão
  NG  // Nigéria
  ZA  // África do Sul

  // Ásia / Sudeste asiático
  MY  // Malásia
  ID  // Indonésia
  TH  // Tailândia
  SG  // Singapura
  PH  // Filipinas
  VN  // Vietnã
  BD  // Bangladesh
  PK  // Paquistão
  IN  // Índia
  CN  // China
  JP  // Japão
  KR  // Coreia do Sul

  // Oceania
  AU  // Austrália
  NZ  // Nova Zelândia

  OUTRO // Fallback para país não listado (raro)
}
```

### 3.2 `TaxIdType`

Tipo de identificador fiscal/jurídico de uma `Company`. Valor mora em `Company.taxId` (string).

```prisma
enum TaxIdType {
  // América do Sul
  CNPJ      // Brasil — Cadastro Nacional de Pessoa Jurídica
  CPF       // Brasil — Pessoa Física (raro em B2B, suportado)
  CUIT      // Argentina — Clave Única de Identificación Tributaria
  RUC_PY    // Paraguai — Registro Único del Contribuyente
  RUC_UY    // Uruguai — Registro Único Tributario
  RUC_PE    // Peru
  RUC_EC    // Equador
  NIT_BO    // Bolívia — Número de Identificación Tributaria
  NIT_CO    // Colômbia
  RUT_CL    // Chile — Rol Único Tributario

  // América do Norte
  RFC_MX    // México — Registro Federal de Contribuyentes
  EIN_US    // EUA — Employer Identification Number
  BN_CA     // Canadá — Business Number

  // Europa
  VAT_EU    // União Europeia — VAT genérico
  VAT_GB    // Reino Unido
  VAT_TR    // Turquia

  // Outros
  TIN       // Tax Identification Number (genérico internacional)
  OUTRO     // Fallback
}
```

### 3.3 `SanitaryCodeType`

Tipo de código sanitário/inspeção da `Plant`. Valor mora em `Plant.sanitaryCode`.

```prisma
enum SanitaryCodeType {
  // Brasil
  SIF                // Serviço de Inspeção Federal
  SIE                // Serviço de Inspeção Estadual
  SIM                // Serviço de Inspeção Municipal
  SISBI              // Sistema Brasileiro de Inspeção (equivalência federal)

  // América Latina
  ESTABLECIMIENTO_PY // SENACSA Paraguai
  ESTABLECIMIENTO_AR // SENASA Argentina
  ESTABLECIMIENTO_UY // INAC Uruguai
  SENASAG            // SENASAG Bolívia
  INVIMA             // INVIMA Colômbia
  SAG                // SAG Chile
  SENASA_PE          // SENASA Peru

  // América do Norte
  USDA_PLANT         // USDA Plant Number (USA)
  CFIA_PLANT         // Canadian Food Inspection Agency
  SAGARPA_MX         // SAGARPA México

  // Europa
  EU_PLANT_NUMBER    // EU Plant approval number (formato BR XX-Y CE)
  UK_FSA_PLANT       // UK Food Standards Agency

  // Genéricos
  GENERIC            // Outro código sanitário (país não listado)
  INTERNAL           // Sem registro oficial / código interno
}
```

> **Nota de unicidade:** o par `(sanitaryCode, sanitaryCodeType)` identifica
> univocamente uma planta no mundo. País é implícito no `sanitaryCodeType`
> (SIF é só BR, ESTABLECIMIENTO_PY é só PY, etc.). Não precisa repetir
> `country` no índice.

### 3.4 `HabilitationSystem`

Sistema regulatório que habilita uma `Plant` a exportar para um país de destino.

```prisma
enum HabilitationSystem {
  // Mercado halal — religioso/governamental
  SFDA               // Saudi Food and Drug Authority (Arábia Saudita)
  SASO               // Saudi Standards Organization (Arábia Saudita)
  ESMA               // Emirates Authority for Standardization (UAE)
  FIRS               // Food Import Registration System (UAE)
  JAKIM              // Jabatan Kemajuan Islam Malaysia
  DVS_MY             // Department of Veterinary Services (Malásia sanitário)
  BPJPH              // Badan Penyelenggara Jaminan Produk Halal (Indonésia)
  MUI                // Majelis Ulama Indonesia (religioso Indonésia)
  HAKSIS             // Turquia (SMIIC/HAK)
  CICOT              // Central Islamic Council of Thailand
  MUIS_SG            // Majlis Ugama Islam Singapura
  EHCC               // Egypt Halal Certification Center

  // Mercado ocidental — sanitário
  USDA_FSIS          // USA — Food Safety and Inspection Service
  EU_HEALTH_CERT     // União Europeia — Certificado Sanitário
  UK_FSA             // UK Food Standards Agency
  CFIA               // Canadian Food Inspection Agency

  // Brasil — habilitação por país (lista MAPA/DIPOA por destino)
  MAPA_LIST          // Lista de estabelecimentos habilitados MAPA por país

  OUTRO              // Sistema não listado
}
```

### 3.5 `CompanyRelationship`

Natureza da relação da `Company` com a FAMBRAS.

```prisma
enum CompanyRelationship {
  client   // Cliente FAMBRAS — em qualquer fase do funil (prospect → ativo → renovação)
  partner  // Empresa parceira/fornecedora referenciada (não cliente FAMBRAS)
  // 'prospect' não existe: lead pré-comercial é client + pendingValidation=true
}
```

### 3.6 `PlantType` (espelha enum do SIH)

```prisma
enum PlantType {
  abatedouro       // Slaughterhouse
  frigorifico      // Cold storage / meat processor
  processamento    // Food processing
  laticinio        // Dairy
  armazenamento    // Warehouse / cold storage only
  escritorio       // Office (no production)
  outro
}
```

### 3.7 `Species` (espelha enum do SIH)

```prisma
enum Species {
  bovino
  ave
  ovino
  caprino
  bufalino
  suino_haram   // Suíno é haram; existe apenas para indicar segregação obrigatória em planta multi-espécie
  outro
}
```

### 3.8 `HabilitationStatus`

```prisma
enum HabilitationStatus {
  active
  pending
  suspended
  expired
  revoked
}
```

---

## 4. Schema das entidades

### 4.1 `CompanyGroup` (refinamento mínimo)

Mantém o que existe hoje, com pequenos refinamentos:

```prisma
model CompanyGroup {
  id           String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  name         String   @db.VarChar(255)         // "Grupo Minerva", "Grupo BRF"
  tradeName    String?  @map("trade_name") @db.VarChar(255)
  document     String?  @db.VarChar(50)          // CNPJ da holding (BR) ou tax ID estrangeiro, opcional
  documentType TaxIdType? @map("document_type")  // Tipo do documento da holding (opcional)

  // Contato corporativo do grupo
  contactName  String?  @map("contact_name") @db.VarChar(255)
  contactEmail String?  @map("contact_email") @db.VarChar(255)
  contactPhone String?  @map("contact_phone") @db.VarChar(50)

  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relações
  companies          Company[]
  users              User[]              @relation("CompanyGroupUsers")
  sharedSuppliers    SharedSupplier[]
  corporateDocuments CorporateDocument[]

  @@index([name])
  @@index([document])
  @@map("company_groups")
}
```

**Mudanças:**
- Adicionado `documentType TaxIdType?` (antes era só string sem tipo)
- Adicionado `isActive` (soft delete coerente com Company)
- Adicionada relação com Users (`companyGroupId` em User)

### 4.2 `Company` (refator significativo)

```prisma
model Company {
  id      String @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  groupId String @map("group_id") @db.Uuid

  // ============================
  // IDENTIFICAÇÃO MULTI-PAÍS
  // ============================
  country   Country
  taxId     String     @db.VarChar(50)  // Valor do tax ID (CNPJ, CUIT, RUC, NIT, etc.)
  taxIdType TaxIdType  @map("tax_id_type")

  // ============================
  // DADOS PJ
  // ============================
  legalName    String  @map("legal_name") @db.VarChar(255)   // Razão social / Nome legal
  tradeName    String? @map("trade_name") @db.VarChar(255)   // Nome fantasia
  address      Json?                                          // {street, number, complement, neighborhood, city, state, postalCode, country}
  contact      Json?                                          // {email, phone, whatsapp, contactName, role}

  // ============================
  // CLASSIFICAÇÃO COMERCIAL
  // ============================
  relationship CompanyRelationship @default(client)

  // ============================
  // WORKFLOW FAMBRAS (aplicável quando relationship=client)
  // ============================
  pendingValidation Boolean   @default(true) @map("pending_validation")
  isVerified        Boolean   @default(false) @map("is_verified")
  verifiedAt        DateTime? @map("verified_at")
  verifiedBy        String?   @map("verified_by") @db.Uuid
  validationNotes   String?   @map("validation_notes") @db.Text

  // ============================
  // SOFT DELETE
  // ============================
  isActive Boolean @default(true) @map("is_active")

  // ============================
  // METADATA OPCIONAL
  // ============================
  numEmployees   Int?     @map("num_employees")
  annualRevenue  Decimal? @map("annual_revenue") @db.Decimal(15, 2)
  mainActivity   String?  @map("main_activity") @db.Text
  isHeadquarters Boolean  @default(false) @map("is_headquarters")

  // ============================
  // AUDIT
  // ============================
  createdBy String?  @map("created_by") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // ============================
  // RELAÇÕES
  // ============================
  group     CompanyGroup @relation(fields: [groupId], references: [id])
  verifier  User?        @relation("CompanyVerifier", fields: [verifiedBy], references: [id])
  plants    Plant[]
  users     User[]       @relation("CompanyUsers")

  // Relações herdadas (mantidas, mas com possível mudança de granularidade — ver §5)
  contracts        Contract[]
  proposals        Proposal[]
  products         Product[]
  documents        Document[]
  esignatureConfig ESignatureConfig[]
  bucket           CompanyBucket?

  @@unique([country, taxId, taxIdType], map: "company_tax_id_uq")
  @@index([groupId])
  @@index([country])
  @@index([relationship])
  @@index([isActive])
  @@index([pendingValidation])
  @@map("companies")
}
```

**O que SAI de Company (movido pra Plant ou CountryHabilitation):**

| Campo atual | Destino |
|---|---|
| `cnpj` (string única) | Substituído por `taxId` + `taxIdType` + `country` |
| `plantCode`, `plantCodeType` | `Plant.sanitaryCode`, `Plant.sanitaryCodeType` |
| `productionCapacity`, `employeeCount`, `shiftsCount` | `Plant.productionCapacity`, `Plant.employeeCount`, `Plant.shiftsCount` |
| `haksisRegistered`, `siHalalRegistered`, `moiatRegistered`, `sfdaRegistered` | Linhas em `CountryHabilitation` |
| `internationalRegistrations` (JSON) | Linhas em `CountryHabilitation` |
| `userId` (1:1) | `User.companyId` (N:1) |
| `razaoSocial`, `nomeFantasia` | Renomeados para `legalName`, `tradeName` (alinha com terminologia internacional) |
| `endereco`, `cidade`, `estado`, `cep`, `pais` (colunas planas) | Removidas — usa só JSON `address` |
| `email`, `telefone` (colunas planas) | Removidas — usa só JSON `contact` |
| `tipoEmpresa` (string livre) | Removido — `relationship` + tipo da Plant cobre |

### 4.3 `Plant` (entidade nova)

```prisma
model Plant {
  id        String @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  companyId String @map("company_id") @db.Uuid

  // ============================
  // IDENTIFICAÇÃO
  // ============================
  name             String           @db.VarChar(255)    // "Unidade Palmeiras", "Planta São Paulo"
  sanitaryCode     String           @db.VarChar(50)     // "SIF 1234", "ESTABLECIMIENTO 0567"
  sanitaryCodeType SanitaryCodeType @map("sanitary_code_type")

  // ============================
  // CLASSIFICAÇÃO OPERACIONAL
  // ============================
  plantType PlantType @map("plant_type")
  species   Species[] @default([])

  // ============================
  // ENDEREÇO (pode diferir da Company.matriz)
  // ============================
  address Json? // {street, number, complement, neighborhood, city, state, postalCode}

  // ============================
  // CAPACIDADE
  // ============================
  productionCapacity String? @map("production_capacity") @db.VarChar(255)  // ex: "1500 cabeças/dia"
  employeeCount      Int?    @map("employee_count")
  shiftsCount        Int?    @map("shifts_count")

  // ============================
  // CERT EXTERNA (TASK-07 — quando Company.relationship = partner)
  // Usados apenas se a planta NÃO é cliente FAMBRAS
  // ============================
  certifierName        String?   @map("certifier_name") @db.VarChar(100)        // FAMBRAS / CDIAL / IFANCA / JAKIM / etc.
  externalCertNumber   String?   @map("external_cert_number") @db.VarChar(100)
  externalCertIssueDate  DateTime? @map("external_cert_issue_date") @db.Date
  externalCertExpiryDate DateTime? @map("external_cert_expiry_date") @db.Date
  externalCertS3Key      String?   @map("external_cert_s3_key") @db.VarChar(500)

  // ============================
  // STATUS
  // ============================
  isActive Boolean @default(true) @map("is_active")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // ============================
  // RELAÇÕES
  // ============================
  company              Company               @relation(fields: [companyId], references: [id], onDelete: Cascade)
  countryHabilitations CountryHabilitation[]
  certifications       Certification[]       // Certificações FAMBRAS desta planta (quando client)
  scopeFacilities      ScopeFacility[]       // Quando facility no escopo é uma planta cadastrada

  @@unique([sanitaryCode, sanitaryCodeType], map: "plant_sanitary_uq")
  @@index([companyId])
  @@index([sanitaryCode])
  @@index([plantType])
  @@index([certifierName])
  @@index([isActive])
  @@map("plants")
}
```

**Notas:**
- `certifierName` é texto livre porque o universo é finito mas heterogêneo (FAMBRAS, CDIAL, IFANCA, JAKIM, regional menor, etc.). Se virar enum no futuro, refator simples.
- Os campos `external*` são preenchidos apenas para plantas cuja `Company.relationship = partner`. Para plantas FAMBRAS, certificação vem via `certifications[]` (relação com `Certification`) — modelo rico do GC.
- `species` é array porque uma planta pode operar múltiplas espécies.

### 4.4 `CountryHabilitation` (entidade nova)

```prisma
model CountryHabilitation {
  id      String @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  plantId String @map("plant_id") @db.Uuid

  destinationCountry Country            @map("destination_country")
  system             HabilitationSystem
  registrationCode   String             @map("registration_code") @db.VarChar(100)

  validFrom  DateTime?           @map("valid_from") @db.Date
  validUntil DateTime?           @map("valid_until") @db.Date
  status     HabilitationStatus  @default(active)

  notes         String? @db.Text
  documentS3Key String? @map("document_s3_key") @db.VarChar(500)

  createdBy String?  @map("created_by") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relações
  plant Plant @relation(fields: [plantId], references: [id], onDelete: Cascade)

  @@unique([plantId, destinationCountry, system], map: "habilitation_uq")
  @@index([destinationCountry])
  @@index([validUntil])
  @@index([status])
  @@map("country_habilitations")
}
```

**Notas:**
- A unicidade `(plantId, destinationCountry, system)` impede duplicatas:
  uma planta tem no máximo 1 habilitação ativa por (país, sistema).
- Caso de "renovação": atualiza `validUntil`, mantém o registro. Histórico
  é capturado em audit log separado, não em registros versionados.
- `validUntil` indexado pra alertas de vencimento.
- `documentS3Key` aponta pra anexo do certificado/documento de habilitação.

---

## 5. Refator das entidades dependentes

### 5.1 `Certification` — companyId → plantId

```prisma
model Certification {
  // ... mantém id, certificationNumber, certificationType, status, validFrom, validUntil, etc.

  // MUDA: era companyId String → plantId String
  plantId String @map("plant_id") @db.Uuid

  // MUDA: relação company → plant
  plant Plant @relation(fields: [plantId], references: [id], onDelete: Cascade)

  // Mantém todas as relações filhas (scope, requests, history, documents,
  // contracts, audits, proposals, certificates, comments, labSamples,
  // complaints, sealUsageControls, nonConformities, qualityReviews,
  // supplierHomologations, etc.)

  @@index([plantId])
  // ... resto dos índices mantidos
}
```

> **Nota:** uma planta pode ter histórico de várias certificações (renovações,
> ampliações, restaurações). Modelo atual já suporta via `RequestType`
> (nova/renovacao/ampliacao/etc.).

### 5.2 `ScopeFacility` — adiciona plantId opcional

```prisma
model ScopeFacility {
  // ... mantém todos os campos atuais (name, address, city, state, country, postalCode, facilityType)

  // ADICIONA:
  plantId String? @map("plant_id") @db.Uuid

  // ADICIONA relação:
  plant Plant? @relation(fields: [plantId], references: [id])

  @@index([plantId])
  // ... mantém outros
}
```

**Semântica:**
- Se `plantId` preenchido → instalação no escopo é uma Plant cadastrada (vínculo formal). Endereço pode ser puxado da Plant pra evitar redundância.
- Se `plantId` nulo → instalação não-Plant (escritório, armazém alugado, etc.) — mantém endereço manual.

### 5.3 `ScopeSupplier` — adiciona companyId/plantId opcionais

```prisma
model ScopeSupplier {
  // ... mantém campos atuais (name, cnpj, ingredientType, halalCertNumber, etc.)

  // ADICIONA:
  companyId String? @map("company_id") @db.Uuid
  plantId   String? @map("plant_id") @db.Uuid

  company Company? @relation(fields: [companyId], references: [id])
  plant   Plant?   @relation(fields: [plantId], references: [id])

  @@index([companyId])
  @@index([plantId])
}
```

**Semântica:**
- Se `plantId` preenchido → fornecedor é uma Plant cadastrada (rastreabilidade forte; SIF disponível via `Plant.sanitaryCode`).
- Se só `companyId` preenchido → fornecedor é uma Company sem Plant cadastrada.
- Se ambos nulos → fornecedor avulso (modelo atual, com cnpj livre).

### 5.4 `SharedSupplier` — adiciona companyId/plantId opcionais

```prisma
model SharedSupplier {
  // ... mantém campos atuais

  // ADICIONA:
  companyId String? @map("company_id") @db.Uuid
  plantId   String? @map("plant_id") @db.Uuid

  company Company? @relation(fields: [companyId], references: [id])
  plant   Plant?   @relation(fields: [plantId], references: [id])

  @@index([companyId])
  @@index([plantId])
}
```

### 5.5 Outras relações — sem mudanças significativas

Permanecem com `companyId` direto (operações são por entidade jurídica, não por planta):
- `Contract`, `Proposal` (contratos comerciais são com a PJ)
- `Product` (catálogo é da empresa, escopo de cert refina por planta)
- `Document` (documentos corporativos)
- `ESignatureConfig`, `CompanyBucket`

---

## 6. User refinado e segregação por grupo

### 6.1 Schema do User

```prisma
model User {
  // ... mantém todos os campos atuais (id, email, passwordHash, role, name, phone, etc.)

  // ============================
  // VÍNCULO COMPANY/GROUP (substitui User.company 1:1)
  // ============================
  companyGroupId String? @map("company_group_id") @db.Uuid
  companyId      String? @map("company_id") @db.Uuid

  // ============================
  // FLAGS (já existem hoje — mantidas)
  // ============================
  isGroupAdmin     Boolean   @default(false) @map("is_group_admin")
  isCompanyAdmin   Boolean   @default(false) @map("is_company_admin")
  isTemporaryAdmin Boolean   @default(false) @map("is_temporary_admin")
  adminAssignedAt  DateTime? @map("admin_assigned_at")
  adminAssignedBy  String?   @map("admin_assigned_by") @db.Uuid

  // ============================
  // RELAÇÕES (substituem User.company 1:1)
  // ============================
  companyGroup CompanyGroup? @relation("CompanyGroupUsers", fields: [companyGroupId], references: [id])
  company      Company?      @relation("CompanyUsers", fields: [companyId], references: [id])

  // ... mantém todas as outras relações (auditTrails, chatMessages, etc.)

  @@index([companyGroupId])
  @@index([companyId])
}
```

**O que sai do schema atual:**
- `Company.userId @unique` (vínculo 1:1) → some
- `User.company Company?` (relação reversa do anterior) → vira N:1

**O que entra:**
- `User.companyGroupId` (FK CompanyGroup, opcional)
- `User.companyId` (FK Company, opcional, escopo restrito a Company específica do grupo)

### 6.2 Regras de visibilidade

| Cenário | Configuração | Acesso |
|---|---|---|
| Usuário FAMBRAS/Ecohalal | role ∈ {admin, gestor, analista, auditor, qualidade, ...} | Global (sem filtro) |
| Cliente — admin do grupo | role=empresa, isGroupAdmin=true, companyGroupId=X | Todas Companies+Plants do grupo X |
| Cliente — admin de empresa | role=empresa, isCompanyAdmin=true, companyId=Y | Apenas Company Y + suas Plants |
| Cliente — usuário comum | role=empresa, sem flags, companyId=Y | Apenas Company Y, leitura |

---

## 7. Endpoints HTTP

### 7.1 `/companies` (mantém + ajusta)

Endpoints existentes mantidos com pequenas adaptações de payload (CNPJ → `taxId` + `taxIdType` + `country`):

| Método | Rota | Mudança |
|---|---|---|
| POST | `/companies` | DTO aceita `country`, `taxId`, `taxIdType` (substitui `cnpj`). Usado para criar Company adicional dentro de um Group existente. |
| ~~POST~~ | ~~`/companies/register`~~ | **Removido (2026-05-07).** Onboarding inicial (G-111..G-114) consolidado em `POST /auth/register`, que cria User + Group + Company atomicamente. Para criar Company adicional dentro de um Group existente, use `POST /companies`. |
| GET | `/companies/me` | Retorna company se `req.user.companyId` setado, senão erro |
| GET | `/companies/:id` | Inclui `plants[]` no payload |
| GET | `/companies` | Filtros adicionais: `country`, `relationship` |
| GET | `/companies/lookup/:taxId` | **Substitui** `/cnpj/:cnpj`. Aceita query `taxIdType` e `country` |
| GET | `/companies/:id/plants` | **Novo**: lista plantas da company |
| PATCH | `/companies/:id` | `taxId` e `taxIdType` imutáveis após criação |
| PATCH | `/companies/:id/verify` | Mantém |
| PATCH | `/companies/:id/unverify` | Mantém |
| POST | `/companies/:id/validate` | G-115 (mantém) |
| POST | `/companies/:id/reject-validation` | Mantém |
| GET | `/companies/pending-validation` | G-116 (mantém) |
| POST | `/companies/:id/add-to-group` | Mantém |
| POST | `/companies/:id/remove-from-group` | Mantém |
| DELETE | `/companies/:id` | Soft delete (mantém) |

#### 7.1.1 Lookup CNPJ — provider único, sem proxy backend

**Decisão (2026-05-07):** o módulo backend `src/cnpj-lookup/` foi **removido inteiro**
(controller + service + 3 providers configuráveis + tabelas `cnpj_lookup_configs` e
`cnpj_lookup_cache` + tela admin frontend). Era código morto: a config no DB tinha
`is_active=false` e o frontend já chamava direto `https://publica.cnpj.ws/cnpj/{cnpj}`.

**Estado final:**
- Frontend: [`services/cnpj.service.ts`](https://github.com/Ecohalal/halalsphere-frontend/blob/develop/src/services/cnpj.service.ts) chama o endpoint público diretamente
  com timeout de 5s, sem auth, sem cache compartilhado.
- Em caso de falha (timeout, 404, 429, 5xx, rede), o hook `useCnpjLookup` expõe
  `canFillManually=true` e o `CnpjSearchInput` mostra banner inline orientando o
  usuário a preencher os campos manualmente.
- Form continua editável em qualquer estado do lookup — o backend não confia no
  retorno da API pública (validação real é o `pendingValidation` resolvido pelo
  admin FAMBRAS via `POST /companies/:id/validate`).
- Multi-país: lookup só vale para `country=BR && taxIdType=CNPJ`. Para outros países,
  o registro é manual (sem auto-preenchimento integrado no MVP).

### 7.2 `/plants` (novo controller)

```
POST   /companies/:companyId/plants     → cria Plant dentro de Company
GET    /companies/:companyId/plants     → lista Plants de uma Company
GET    /plants                          → lista global (com filtros)
GET    /plants/:id                      → detalhe
GET    /plants/lookup/:sanitaryCode     → busca por SIF/equivalente (query: sanitaryCodeType)
PATCH  /plants/:id                      → atualizar (sanitaryCode/Type imutáveis)
DELETE /plants/:id                      → soft delete (isActive=false)
PATCH  /plants/:id/reactivate           → reativar
```

**Filtros em GET /plants:**

```
?country=BR
?sanitaryCodeType=SIF
?plantType=abatedouro
?species=bovino
?certifierName=FAMBRAS
?relationship=client|partner       (filtra via Company.relationship)
?companyId=...
?companyGroupId=...
?isActive=true
?search=...                        (busca em name, sanitaryCode)
?skip=0&take=50
```

**Caso de uso (TASK-07 desossa):**

```
GET /plants?plantType=abatedouro&isActive=true
```

Retorna todas as plantas abatedouro — internas (FAMBRAS) e externas (parceiras com cert CDIAL/IFANCA/etc.). Frontend exibe com badge diferenciando.

### 7.3 `/country-habilitations` (novo controller)

```
POST   /plants/:plantId/country-habilitations  → cria habilitação para uma planta
GET    /plants/:plantId/country-habilitations  → lista habilitações de uma planta
GET    /country-habilitations                  → lista global (filtros)
GET    /country-habilitations/:id              → detalhe
PATCH  /country-habilitations/:id              → atualizar (validUntil, status, etc.)
DELETE /country-habilitations/:id              → revogar (status=revoked)
```

**Filtros em GET /country-habilitations:**

```
?destinationCountry=SA
?system=SFDA
?status=active
?expiringInDays=30           (vencendo nos próximos N dias)
```

### 7.4 `/company-groups` (refinamento)

Mantém endpoints existentes, agora com:

```
GET    /company-groups/:id/companies     → lista Companies do grupo
GET    /company-groups/:id/plants        → lista Plants do grupo (todas Plants de todas Companies)
GET    /company-groups/:id/users         → lista Users vinculados ao grupo
```

### 7.5 Auth — login retorna escopo

`POST /auth/login` retorna no payload do JWT:

```json
{
  "sub": "user-uuid",
  "role": "empresa",
  "companyGroupId": "group-uuid",
  "companyId": "company-uuid",
  "isGroupAdmin": true,
  "isCompanyAdmin": false,
  "isInternal": false  // calculado: role !== 'empresa'
}
```

---

## 8. Guard `@CompanyGroupScope`

Decorator que injeta filtro automático de `companyGroupId` em queries quando user é externo. Espelha o padrão da TASK-03 do SIH (Controladoria por grupo IN/IND).

### 8.1 Arquivos novos

```
src/auth/decorators/company-group-scope.decorator.ts
src/auth/interceptors/company-group-scope.interceptor.ts
```

### 8.2 Decorator

```typescript
// src/auth/decorators/company-group-scope.decorator.ts
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { CompanyGroupScopeInterceptor } from '../interceptors/company-group-scope.interceptor';

export const COMPANY_GROUP_SCOPE_KEY = 'companyGroupScope';

export interface CompanyGroupScopeOptions {
  /** Nome do campo no query/body que carrega o filtro de groupId. Default: 'companyGroupId' */
  field?: string;
  /** Se true, exige que o user externo passe o filtro (não permite query sem escopo). Default: true */
  required?: boolean;
}

/**
 * Marca um endpoint para ser automaticamente filtrado por companyGroupId
 * quando o usuário autenticado for externo (role=empresa).
 *
 * Para users FAMBRAS/Ecohalal (role admin, gestor, etc.), o filtro NÃO é aplicado.
 */
export const CompanyGroupScope = (options: CompanyGroupScopeOptions = {}) =>
  applyDecorators(
    SetMetadata(COMPANY_GROUP_SCOPE_KEY, { field: 'companyGroupId', required: true, ...options }),
    UseInterceptors(CompanyGroupScopeInterceptor),
  );
```

### 8.3 Interceptor

```typescript
// src/auth/interceptors/company-group-scope.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { COMPANY_GROUP_SCOPE_KEY, CompanyGroupScopeOptions } from '../decorators/company-group-scope.decorator';

const INTERNAL_ROLES = new Set([
  'admin', 'analista', 'auditor', 'gestor', 'comercial',
  'juridico', 'financeiro', 'gestor_auditoria', 'supervisor',
  'controlador', 'secretaria', 'qualidade',
]);

@Injectable()
export class CompanyGroupScopeInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<CompanyGroupScopeOptions>(
      COMPANY_GROUP_SCOPE_KEY,
      context.getHandler(),
    );
    if (!options) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Users FAMBRAS/Ecohalal: sem filtro automático
    if (INTERNAL_ROLES.has(user.role)) {
      return next.handle();
    }

    // User externo: injeta filtro
    const userGroupId = user.companyGroupId;
    if (!userGroupId) {
      throw new ForbiddenException('Usuário externo sem grupo vinculado');
    }

    const field = options.field || 'companyGroupId';

    // Sobrescreve query/body com o groupId do user, ignorando qualquer valor que ele tenha enviado
    if (request.query) request.query[field] = userGroupId;
    if (request.body && typeof request.body === 'object') request.body[field] = userGroupId;

    return next.handle();
  }
}
```

### 8.4 Uso em controllers

```typescript
@Get()
@CompanyGroupScope()
async findAll(@Query() filters: CompanyFiltersDto, @Req() req) {
  // filters.companyGroupId já está populado pelo interceptor (se user externo)
  return this.service.findAll(filters);
}

@Get(':id')
@CompanyGroupScope()
async findOne(@Param('id') id: string, @Req() req) {
  const company = await this.service.findById(id);
  if (!INTERNAL_ROLES.has(req.user.role) && company.groupId !== req.user.companyGroupId) {
    throw new ForbiddenException('Empresa fora do seu grupo');
  }
  return company;
}
```

> **Nota:** o decorator atende ~80% dos casos (filtro automático em listas).
> Para `findById`, validação manual no service ainda é necessária pra
> garantir que o user externo não acesse uma Company de outro grupo via ID.
> Esse padrão vai ser embutido em um helper utilitário `assertScope(user, entity)`
> a ser implementado no service base.

---

## 9. Plano de execução em fases

### Fase 1 — Schema + migrations (backend)

**Estimativa:** 2 dias.

1. **Adicionar enums:**
   - `Country`, `TaxIdType`, `SanitaryCodeType`, `HabilitationSystem`,
     `CompanyRelationship`, `HabilitationStatus`, `PlantType`, `Species`
2. **Refator `Company`:**
   - Drop columns: `cnpj`, `plantCode`, `plantCodeType`, `productionCapacity`,
     `employeeCount`, `shiftsCount`, `haksisRegistered`, `siHalalRegistered`,
     `moiatRegistered`, `sfdaRegistered`, `internationalRegistrations`,
     `userId`, `endereco`, `cidade`, `estado`, `cep`, `pais`,
     `email`, `telefone`, `tipoEmpresa`
   - Rename: `razaoSocial` → `legalName`, `nomeFantasia` → `tradeName`
   - Add: `country`, `taxId`, `taxIdType`, `relationship`
   - Add unique constraint: `(country, taxId, taxIdType)`
3. **Refator `User`:**
   - Add: `companyGroupId`, `companyId`
   - Drop unique constraint anterior em Company.userId
4. **Refator `CompanyGroup`:**
   - Add: `documentType`, `isActive`
5. **Criar `Plant`** (model novo)
6. **Criar `CountryHabilitation`** (model novo)
7. **Refator `Certification`:**
   - Drop FK `companyId`, add FK `plantId`
8. **Refator `ScopeFacility`, `ScopeSupplier`, `SharedSupplier`:**
   - Add FKs opcionais `plantId` (e `companyId` onde aplicável)
9. **Migration SQL** (zera dados; HalalSphere é MVP, sem volume relevante):
   ```sql
   -- Em ordem: drop FKs, drop tables filhas com volume = 0, recriar
   -- Execução via prisma migrate dev (nome: refactor_company_plant)
   ```
10. **Seed enriquecido pós-reset (atualizado 2026-05-07):**
    - **CompanyGroup "Minerva" (multinacional):** 2 Companies (BR CNPJ + PY RUC)
      - 3 Plants em Minerva BR (3 SIFs distintos)
      - 1 Plant em Minerva PY (Establecimiento_PY)
      - CountryHabilitations: Minerva BR Goiás → SA via SFDA, → AE via ESMA
    - **CompanyGroup "BRF" (multinacional):** 2 Companies (BR + AR)
      - 2 Plants em BRF BR (frigorífico + processados)
      - 1 Plant em BRF AR (Establecimiento_AR)
    - **CompanyGroup "ATA Tensoativos" (Industrial, sem supervisor):** baseado
      no caso real do anexo Ayat (FM 7.2.3 / FM 4.1.1)
      - 1 Company BR + 1 Plant
      - Sem CountryHabilitation (mercado interno)
      - Cliente FAMBRAS típico Industrial (DT 7.4 — Químicos e Agentes de Limpeza)
    - **CompanyGroup "Frigorifico XYZ" (partner, TASK-07):**
      - 1 Company BR + 1 Plant com `relationship=partner`
      - Cert externa CDIAL anexada via `Plant.externalCertS3Key`
    - Cobre os 6 cenários-chave do material FAMBRAS: multinacional,
      multi-planta, industrial sem supervisor, partner com cert externa,
      mercado interno puro, exportação Golfo. Custo estimado: ~0.5 dia.

### Fase 2 — Refactor backend services & controllers

**Estimativa:** 3-4 dias.

1. **`CompanyService`:**
   - Adapta `create`, `update`, `register` para `taxId` + `taxIdType` + `country`
   - Adapta `findByCnpj` → `findByTaxId(taxId, taxIdType, country)`
   - Adicionar métodos pra lidar com `relationship`
   - Remove handling de `plantCode`, `productionCapacity`, etc.
2. **`CompanyController`:**
   - DTOs atualizados (Zod schemas)
   - Endpoint `/companies/lookup/:taxId` (substitui `/cnpj/:cnpj`)
3. **`PlantService` + `PlantController` (novos):**
   - CRUD completo
   - Lookup por `sanitaryCode` + `sanitaryCodeType`
   - Filtros multi-país, por relationship, por type
4. **`CountryHabilitationService` + `Controller` (novos):**
   - CRUD
   - Cron job de alerta de vencimento (30 dias)
5. **`UserService`:**
   - Login retorna `companyGroupId`, `companyId` no JWT
   - Onboarding cria User com `companyGroupId` apropriado
6. **Decorator `@CompanyGroupScope` + interceptor:**
   - Implementação descrita em §8
7. **Refactor controllers existentes** que usam `Company` indiretamente
   pra aplicar `@CompanyGroupScope` onde necessário (Certification, Audit,
   Contract, Proposal, etc.)
8. **Testes unitários e e2e:**
   - Cobrir multi-país (criar Company PY, criar Plant com EstablecimientoPY)
   - Cobrir segregação (user externo não vê grupo alheio)
   - Cobrir TASK-07 case (Plant partner com cert externa)

### Fase 3 — Frontend

**Estimativa:** 4-5 dias.

1. **Forms novos:**
   - `CompanyForm` adaptado pra multi-país (seleciona country, ajusta validação de taxId conforme type)
   - `PlantForm` (novo): nome, sanitaryCode + type, plantType, species, capacidade, endereço
   - `CountryHabilitationForm` (novo)
2. **UI workflows:**
   - Wizard de cadastro de Company → cria 1 Plant inicial em sequência (UX simplificada)
   - Tela "Plantas da Empresa" (listagem com CRUD)
   - Tela "Habilitações" da Planta (sub-aba na Plant)
3. **Lista de Plants** com filtros (country, type, relationship, certifier)
4. **Lookup CNPJ → seleção de país antes** do lookup (já que tax IDs variam)
5. **Badge visual** na lista de Plants: verde (FAMBRAS), amarelo (partner com cert válida), vermelho (cert vencida ou ausente)
6. **Tradução pt-BR / en / es** (i18next) — labels específicos por país (CNPJ vs CUIT vs RUC)

### Fase 4 — Tests + smoke

**Estimativa:** 1-2 dias.

1. Suite e2e completa do fluxo Company → Plant → CountryHabilitation
2. Smoke em staging: cadastrar empresa multinacional fictícia,
   adicionar plantas BR e PY, habilitar pra Arábia Saudita, validar via
   admin FAMBRAS
3. Performance: query de listagem de Plants global com 1000+ registros
   (verificar índices)

### Fase 5 — Integração com SIH

**Estimativa:** 2-3 dias (após Fases 1-4 estáveis).

1. **SDK `@ecohalal/gc-sdk`** TypeScript:
   - Cliente para `/companies`, `/plants`, `/country-habilitations`
   - Auth via JWT
   - Cache local com TTL configurável
2. **SIH refactor:**
   - `Plant` do SIH vira cache local de Plant do GC pelo SIF
   - `Plant.externalCompanyId` (string solta) → renomear para `gcPlantId` (FK lógica)
   - Service de sync inicial (paginação)
   - Webhook handler (quando GC expor)
3. **TASK-07 (desossa) finalizada:**
   - Dropdown de origem de carcaça consulta `GET /plants?plantType=abatedouro` no GC
   - Sem cadastro novo no SIH

**Total estimado: 12-17 dias úteis** (1 dev full-time, ~3 semanas).

---

## 10. Roadmap pós-MVP

| Item | Quando |
|---|---|
| Tabela N:N `UserGroupMembership` (consultor multi-grupo no GC) | Quando aparecer caso real |
| Sync GC ↔ SysHalal (Companies/Plants) | Após estabilização do GC |
| TASK-S0: refator do SysHalal pra alinhar com GC | Projeto separado, requer planejamento de produção |
| Integração com APIs oficiais de habilitação (SFDA, JAKIM, etc.) | Quando uma autoridade oferecer API estável |
| Webhooks de mudança em `Company`/`Plant` | Quando SIH precisar de invalidação reativa de cache |
| Histórico versionado de `CountryHabilitation` (não só status atual) | Se auditoria pedir registro completo de renovações |
| Auto-sync de status de cert FAMBRAS via SysHalal `/certified*` | Roadmap após sync GC↔SysHalal |
| Sistema de notificação de vencimento (90/60/30 dias) | Após Fase 4, junto com email SES |
| OCR em documento de habilitação anexado | Backlog (similar a TASK-12 do SIH) |
| Internacionalização (i18n) completa de mensagens de erro/UI | Em paralelo com Fase 3 |

---

## 11. Decisões registradas

Tomadas em sessões com o PO (Renato) entre 2026-05-04 conforme documento
de mapeamento e nesta especificação:

| Ref | Decisão |
|---|---|
| D1 | Master único: HalalSphere (GC). SIH consome via API. SysHalal é puro produção operacional. |
| D2 | SysHalal NÃO é alterado. Sistema em produção há 9+ meses. |
| D3 | Multi-país obrigatório desde dia 1. |
| D4 | Identificadores via enum estendíveis (TaxIdType, SanitaryCodeType). |
| D5 | Habilitações como tabela aberta (CountryHabilitation). |
| D6 | Certificação por Plant, não por Company. |
| D7 | Plantas externas (TASK-07) cabem como Company `relationship=partner`. |
| D8 | HalalSphere é MVP — pode zerar dados, sem migração. |
| D9 | `relationship` ∈ {client, partner}; prospect é fase do client. |
| D10 | CompanyGroup é multinacional. |
| D11 | Habilitações cadastradas manualmente no MVP. |
| D12 | Vínculo `User.companyGroupId` (1 user = 1 grupo no MVP). Sem N:N. |
| D13 | Despachantes do SysHalal: out of scope MVP do GC. |
| D14 | Cert externa em campos opcionais de Plant (não tabela separada). |
| D15 | Certificação halal externa de uma Plant é validada manualmente (PDF anexado). Quando FAMBRAS: SysHalal valida via `/certified`. |
| D16 | Renomeações: `razaoSocial` → `legalName`, `nomeFantasia` → `tradeName` (terminologia internacional). |
| D17 | Drop colunas planas redundantes (`endereco`, `cidade`, `estado`, etc.). Manter só JSON `address`/`contact`. |
| D18 | Plant.species é array (suporta plantas multi-espécie). |
| D19 | **(2026-05-07)** Caminho A escolhido pelo PO: refactor antes da Onda 1+ FAMBRAS. D8 reconfirmado (reset autorizado). Seed enriquecido com cenário ATA Tensoativos (cliente real anonimizado, FM 7.2.3/4.1.1) + BRF multinacional para cobrir 6 cenários FAMBRAS-realistas. |

---

## Próximos passos depois deste documento

1. PO valida este documento (passada ampla, ajustes pontuais).
2. Criar branch `feat/cadastro-empresa-plant-refactor` em `halalsphere-backend`.
3. Iniciar Fase 1 (schema + migrations).
4. Em paralelo, alinhar com time de frontend o redesign dos forms (Fase 3).
5. Após Fase 4 (tests/smoke), planejar Fase 5 (integração SIH) — pode ser
   item separado pro time do SIH.

---

*Documento gerado em 2026-05-04. Atualizações registradas no Git.*
