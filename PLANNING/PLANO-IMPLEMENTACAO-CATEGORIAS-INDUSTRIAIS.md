# Plano de Implementação - Categorias Industriais (Modelo Dual GSO/SMIIC)

**Data**: 2026-03-17 (atualizado)
**Baseado em**: PR 7.1 Rev 22, Análise de Cruzamento GSO x SMIIC
**Abordagem**: Modelo Dual com Mapeamento + Seleção Múltipla + Norma definida pelo analista

---

## PREMISSAS DE NEGÓCIO

1. **Empresa escolhe categorias, analista define norma**: O cliente seleciona seus grupos/categorias de atuação. O analista FAMBRAS é quem decide posteriormente qual norma se aplica (GSO, SMIIC, ambas, voluntária) durante a revisão da solicitação.

2. **Múltiplos grupos/categorias por certificação**: Uma empresa pode atuar em mais de um grupo simultaneamente (ex: Abate + Armazenamento/Distribuição = grupos C + G). A relação entre Certification e categorias é **many-to-many**.

3. **Todas as categorias visíveis**: O wizard mostra TODAS as categorias de ambas as normas. Não há filtro por norma na seleção do cliente.

---

## RESUMO

| Item | Valor |
|------|-------|
| Fases | 6 |
| Arquivos backend afetados | ~14 |
| Arquivos frontend afetados | ~8 |
| Migrations Prisma | 1 (schema) + 1 (dados) |
| Risco produção | ALTO (dados existentes precisam migrar) |
| Mudança arquitetural | FK única → tabela de junção many-to-many |

---

## PRÉ-REQUISITOS

- [ ] Backup do banco de produção antes de qualquer execução
- [ ] Verificar se existem certificações vinculadas a categorias atuais em produção
- [ ] Definir janela de manutenção para migração de dados

---

## FASE 1 - SCHEMA PRISMA (Backend)

**Objetivo**: Migrar de FK única para many-to-many + suportar ambas as normas

### 1.1 Criar enum `AuditMode`

```prisma
enum AuditMode {
  IN_LOCO
  REMOTO
}
```

### 1.2 Criar enum `CertificationStandard`

```prisma
enum CertificationStandard {
  GSO_2055_2
  SMIIC_02
  BOTH
  VOLUNTARY
}
```

### 1.3 Alterar modelo `IndustrialGroup`

```prisma
model IndustrialGroup {
  id              String    @id @default(uuid())
  code            String    @unique           // A, B, C, ..., L
  name            String                      // Nome unificado
  nameEn          String?
  nameAr          String?
  description     String?
  descriptionEn   String?
  descriptionAr   String?
  icon            String?
  displayOrder    Int
  isActive        Boolean   @default(true)

  // NOVOS CAMPOS
  gsoGroupName     String?    // Nome do grupo temático no GSO (ex: "Agricultura")
  smiicGroupName   String?    // Nome do grupo temático na SMIIC
  applicableGso    Boolean    @default(true)
  applicableSmiic  Boolean    @default(true)

  // Relations
  categories       IndustrialCategory[]
  // REMOVIDO: certifications Certification[] (era FK direta)
  // NOVO: via tabela de junção
  certificationCategories CertificationIndustrialCategory[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

### 1.4 Alterar modelo `IndustrialCategory`

```prisma
model IndustrialCategory {
  id              String    @id @default(uuid())
  groupId         String
  code            String    @unique           // AI, AII, BI, CI, CV, etc.
  name            String
  nameEn          String?
  nameAr          String?
  description     String?
  descriptionEn   String?
  descriptionAr   String?
  auditDays       Float?                     // Dias base (campo existente)
  displayOrder    Int
  isActive        Boolean   @default(true)

  // NOVOS CAMPOS - Mapeamento entre normas
  gsoCode          String?    // Código na norma GSO (pode diferir do code)
  smiicCode        String?    // Código na norma SMIIC
  gsoName          String?    // Nome específico na norma GSO
  smiicName        String?    // Nome específico na norma SMIIC

  // Regras de auditoria Estágio 1 por norma
  gsoAuditMode     AuditMode  @default(IN_LOCO)
  smiicAuditMode   AuditMode  @default(IN_LOCO)

  // Aplicabilidade
  applicableGso    Boolean    @default(true)
  applicableSmiic  Boolean    @default(true)

  // Dias de auditoria por norma (opcional, para cálculo futuro)
  auditDaysGso     Float?
  auditDaysSmiic   Float?

  // Relations
  group            IndustrialGroup       @relation(fields: [groupId], references: [id])
  subcategories    IndustrialSubcategory[]
  auditorCompetencies AuditorCompetency[]
  // REMOVIDO: certifications Certification[] (era FK direta)
  // NOVO: via tabela de junção
  certificationCategories CertificationIndustrialCategory[]

  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}
```

### 1.5 Criar tabela de junção `CertificationIndustrialCategory`

Esta é a mudança principal - substitui as 3 FKs únicas por uma relação many-to-many:

```prisma
model CertificationIndustrialCategory {
  id                     String    @id @default(uuid())
  certificationId        String
  industrialGroupId      String
  industrialCategoryId   String
  industrialSubcategoryId String?   // Subcategoria é opcional

  // Qual é o papel desta categoria na certificação
  isPrimary              Boolean   @default(false)  // Categoria principal vs secundária

  // Relations
  certification          Certification        @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  industrialGroup        IndustrialGroup      @relation(fields: [industrialGroupId], references: [id])
  industrialCategory     IndustrialCategory   @relation(fields: [industrialCategoryId], references: [id])
  industrialSubcategory  IndustrialSubcategory? @relation(fields: [industrialSubcategoryId], references: [id])

  // Impedir duplicatas
  @@unique([certificationId, industrialCategoryId])

  createdAt              DateTime  @default(now())
}
```

### 1.6 Alterar modelo `Certification`

```prisma
model Certification {
  // ... campos existentes mantidos ...

  // REMOVER (migrar para tabela de junção):
  // industrialGroupId        String?
  // industrialCategoryId     String?
  // industrialSubcategoryId  String?
  // industrialGroup          IndustrialGroup?
  // industrialCategory       IndustrialCategory?
  // industrialSubcategory    IndustrialSubcategory?

  // NOVOS CAMPOS
  standard                   CertificationStandard?  // Preenchido pelo ANALISTA, não pelo cliente
  standardNotes              String?                  // Justificativa do analista

  // NOVA RELATION (many-to-many via junção)
  industrialCategories       CertificationIndustrialCategory[]
}
```

### 1.7 Alterar modelo `IndustrialSubcategory`

Adicionar relação com tabela de junção:

```prisma
model IndustrialSubcategory {
  // ... campos existentes mantidos ...

  // NOVA RELATION
  certificationCategories CertificationIndustrialCategory[]
}
```

### 1.8 Estratégia de migration (NÃO breaking)

A migration deve ser em **2 passos** para não perder dados:

**Passo 1**: Adicionar novos campos e tabela de junção (SEM remover campos antigos)
```sql
-- Adicionar enums
CREATE TYPE "AuditMode" AS ENUM ('IN_LOCO', 'REMOTO');
CREATE TYPE "CertificationStandard" AS ENUM ('GSO_2055_2', 'SMIIC_02', 'BOTH', 'VOLUNTARY');

-- Adicionar campos novos nos modelos existentes
ALTER TABLE "IndustrialGroup" ADD COLUMN "gsoGroupName" TEXT, ...;
ALTER TABLE "IndustrialCategory" ADD COLUMN "gsoCode" TEXT, ...;
ALTER TABLE "Certification" ADD COLUMN "standard" "CertificationStandard";

-- Criar tabela de junção
CREATE TABLE "CertificationIndustrialCategory" (...);
```

**Passo 2** (após migração de dados na Fase 6): Remover campos antigos
```sql
ALTER TABLE "Certification" DROP COLUMN "industrialGroupId";
ALTER TABLE "Certification" DROP COLUMN "industrialCategoryId";
ALTER TABLE "Certification" DROP COLUMN "industrialSubcategoryId";
```

**Checklist**:
- [ ] Enums criados
- [ ] Campos novos adicionados (sem remover antigos)
- [ ] Tabela de junção criada
- [ ] Migration gerada e revisada
- [ ] Executada em dev local
- [ ] Campos antigos mantidos temporariamente para backward compatibility

---

## FASE 2 - SEED DATA (Backend)

**Objetivo**: Reescrever seed com dados corretos de ambas as normas

### 2.1 Reescrever `prisma/seed-industrial.ts`

#### Grupos (12)

| code | name | gsoGroupName | smiicGroupName | applicableGso | applicableSmiic |
|------|------|-------------|----------------|---------------|-----------------|
| A | Criação de animais | Agricultura | Agricultura | true | true |
| B | Plantação agrícola | Agricultura | Agricultura | true | true |
| C | Produção de produtos alimentícios | Proc. alimentos e rações | Proc. alimentos e rações | true | true |
| D | Produção de ração animal | Proc. alimentos e rações | Proc. alimentos e rações | true | true |
| E | Serviço de alimentação | Servir o alimento | Serviço de alimentação | true | true |
| F | Distribuição | Distrib./varejo/transp./armaz. | Varejo/transp./armaz. | true | true |
| G | Transporte e armazenamento | Distrib./varejo/transp./armaz. | Varejo/transp./armaz. | true | true |
| H | Serviços | Serviços auxiliares | Serviços auxiliares | true | true |
| I | Embalagem | Serviços auxiliares | Serviços auxiliares | true | true |
| J | Fabricação de equipamentos | - | Serviços auxiliares | true | true |
| K | Bioquímica | Bioquímica | Bioquímica | true | true |
| L | Outros materiais de processamento | - | Outros | **false** | true |

#### Categorias (25)

| code | groupCode | name | gsoCode | smiicCode | gsoAuditMode | smiicAuditMode | appGso | appSmiic |
|------|-----------|------|---------|-----------|-------------|----------------|--------|----------|
| AI | A | Criação de animais (carne/leite/ovos/mel) | AI | AI | REMOTO | REMOTO | true | true |
| AII | A | Piscicultura / produtos marinhos | AII | AII | REMOTO | REMOTO | true | true |
| BI | B | Cultivo de plantas (exceto leguminosas/grãos) | BI | BI | REMOTO | REMOTO | true | true |
| BII | B | Cultivo de leguminosas e grãos | BII | BII | REMOTO | REMOTO | true | true |
| CI | C | Processamento de origem animal perecível | CI | CI | IN_LOCO | IN_LOCO | true | true |
| CII | C | Processamento vegetal perecível | CII | CII | IN_LOCO | IN_LOCO | true | true |
| CIII | C | Processamento de produtos mistos | CIII | CIII | IN_LOCO | IN_LOCO | true | true |
| CIV | C | Produtos estáveis em temperatura ambiente | CIV | CIV | IN_LOCO | IN_LOCO | true | true |
| CV | C | Abate de animais | CV | CI* | IN_LOCO | IN_LOCO | true | true |
| DI | D | Ração (animais produtores de alimentos) | DI | DI | IN_LOCO | IN_LOCO | true | true |
| DII | D | Ração (animais de estimação) | DII | DII | IN_LOCO | IN_LOCO | true | true |
| E | E | Serviço de alimentação | E | E | IN_LOCO | REMOTO | true | true |
| FI | F | Distribuição atacado e varejo | FI | FI | REMOTO | REMOTO | true | true |
| FII | F | Negociação e mediação | FII | FII | REMOTO | REMOTO | true | true |
| GI | G | Transporte/armazenamento (perecíveis) | GI | GI | REMOTO | REMOTO | true | true |
| GII | G | Transporte/armazenamento (temp. ambiente) | GII | GII | REMOTO | REMOTO | true | true |
| H | H | Serviços de segurança alimentar | H | HI | REMOTO | REMOTO | true | true |
| HII | H | Serviços financeiros islâmicos | - | HII | - | REMOTO | **false** | true |
| HIII | H | Turismo Muslim Friendly | - | HIII | - | REMOTO | **false** | true |
| I | I | Embalagem e materiais | I | I | IN_LOCO | IN_LOCO | true | true |
| J | J | Fabricação de equipamentos | J | J | REMOTO | REMOTO | true | true |
| K | K | Fabricação de materiais bioquímicos | K | K | IN_LOCO | IN_LOCO | true | true |
| LI | L | Cosméticos | -** | LI | - | IN_LOCO | **false** | true |
| LII | L | Têxteis e produtos têxteis | -** | LII | - | IN_LOCO | **false** | true |
| LIII | L | Couro e derivados | -** | LIII | - | IN_LOCO | **false** | true |

*CV na SMIIC mapeia para CI (abate incorporado em CI)
**No GSO, Cosméticos/Têxteis/Couro estão como exemplos dentro de K

### 2.2 Subcategorias

Manter estrutura existente mas com exemplos corretos extraídos do PR 7.1. Definir por grupo de atividade.

**Checklist**:
- [ ] Seed reescrito com 12 grupos e 25 categorias
- [ ] Campos de mapeamento GSO/SMIIC preenchidos
- [ ] Regras de auditoria por norma corretas
- [ ] Executado em dev local

---

## FASE 3 - BACKEND SERVICES (Backend)

### 3.1 Atualizar `industrial-classification.service.ts`

**Alterações**:

1. **Novo método para buscar categorias de uma certificação**:
   ```typescript
   async getCategoriesForCertification(certificationId: string):
     Promise<CertificationIndustrialCategory[]>
   ```

2. **Novo método para adicionar/remover categorias**:
   ```typescript
   async addCategoryToCertification(
     certificationId: string,
     categoryCode: string,
     subcategoryCode?: string,
     isPrimary?: boolean
   ): Promise<CertificationIndustrialCategory>

   async removeCategoryFromCertification(
     certificationId: string,
     categoryCode: string
   ): Promise<void>
   ```

3. **Manter métodos de listagem existentes** (sem filtro por norma no service - wizard mostra tudo):
   - `getAllGroupsWithRelations()` → retorna todos
   - `getCategoriesByGroupCode()` → retorna todas as categorias do grupo

4. **Novo método para obter auditMode conforme norma da certificação**:
   ```typescript
   async getAuditModeForCertification(
     certificationId: string,
     categoryCode: string
   ): Promise<AuditMode>
   // Usa certification.standard para decidir gsoAuditMode ou smiicAuditMode
   ```

### 3.2 Atualizar `industrial-classification.controller.ts`

**Novos endpoints**:

```
POST   /certifications/:id/industrial-categories     → adicionar categoria
DELETE /certifications/:id/industrial-categories/:code → remover categoria
GET    /certifications/:id/industrial-categories      → listar categorias da certificação
PATCH  /certifications/:id/industrial-categories/:code/primary → marcar como primária
```

**Endpoints existentes mantidos** (listagem de grupos/categorias sem mudança na API).

### 3.3 Reescrever `category-display-map.ts`

Dois mapas estáticos + função que decide:

```typescript
export function getCategoryDisplay(
  code: string,
  standard?: CertificationStandard
): string {
  if (standard === 'SMIIC_02') return SMIIC_MAP[code] || code;
  return GSO_MAP[code] || code;
}
```

### 3.4 Atualizar `certificate-pdf.service.ts`

- Buscar TODAS as categorias da certificação (via tabela de junção)
- Listar categorias no certificado PDF
- Usar código correto conforme `certification.standard`
- Categoria primária em destaque

### 3.5 Atualizar `workflow.service.ts` - Gulf Restrictions

Substituir hardcoded `['C', 'D', 'E', 'I', 'K']` por consulta ao auditMode do banco:

```typescript
// Buscar TODAS as categorias da certificação
const categories = await this.prisma.certificationIndustrialCategory.findMany({
  where: { certificationId },
  include: { industrialCategory: true }
});

// Verificar se ALGUMA categoria exige auditoria presencial
const standard = certification.standard;
const requiresInLoco = categories.some(c => {
  const mode = standard === 'SMIIC_02'
    ? c.industrialCategory.smiicAuditMode
    : c.industrialCategory.gsoAuditMode;
  return mode === 'IN_LOCO';
});
```

### 3.6 Atualizar `certification.service.ts`

- Adicionar campo `standard` na criação (opcional - analista preenche depois)
- Substituir FKs únicas pela tabela de junção
- Criar endpoint ou campo para analista definir `standard` + `standardNotes`

### 3.7 Atualizar DTOs

**`create-certification.dto.ts`**:
```typescript
// REMOVER campos únicos:
// industrialGroupId?: string
// industrialCategoryId?: string
// industrialSubcategoryId?: string

// ADICIONAR:
industrialCategories?: {
  categoryCode: string;
  subcategoryCode?: string;
  isPrimary?: boolean;
}[];
standard?: CertificationStandard;    // Opcional na criação (analista define depois)
standardNotes?: string;
```

### 3.8 Criar endpoint para analista definir norma

```typescript
@Patch(':id/standard')
@Roles('analista', 'gestor', 'admin')
async setStandard(
  @Param('id') id: string,
  @Body() dto: { standard: CertificationStandard; notes?: string }
)
```

**Checklist**:
- [ ] Service com métodos many-to-many
- [ ] Controller com endpoints CRUD de categorias
- [ ] Display map com 2 mapas
- [ ] Certificate PDF listando múltiplas categorias
- [ ] Workflow usando auditMode do banco
- [ ] Certification service com tabela de junção
- [ ] DTO com array de categorias
- [ ] Endpoint para analista definir norma

---

## FASE 4 - FRONTEND (Frontend)

### 4.1 Remover dados estáticos legados

**Arquivo a remover**: `src/lib/industrial-classification.ts`

Buscar e atualizar todos os imports que referenciam este arquivo.

### 4.2 Atualizar service do frontend

**Arquivo**: `src/services/industrial-classification.service.ts`

Adicionar:
```typescript
// Tipos para seleção múltipla
interface SelectedCategory {
  categoryCode: string;
  subcategoryCode?: string;
  isPrimary: boolean;
}

// Métodos para categorias da certificação
async addCategory(certificationId: string, data: SelectedCategory): Promise<void>
async removeCategory(certificationId: string, categoryCode: string): Promise<void>
async getCategories(certificationId: string): Promise<CertificationIndustrialCategory[]>
```

### 4.3 Atualizar Wizard - Seleção múltipla

**Arquivo**: `src/components/wizard/IndustrialClassificationStep.tsx`

**Novo fluxo do wizard (SEM passo de norma)**:

```
Passo 1: Selecionar Grupo(s)
  → Grid de cards com TODOS os 12 grupos
  → Seleção MÚLTIPLA (checkboxes ou toggle)
  → Mostrar contador de selecionados
  → Botão "Próximo" quando >= 1 selecionado

Passo 2: Selecionar Categoria(s) por grupo
  → Para CADA grupo selecionado, mostrar suas categorias
  → Seções agrupadas por grupo com header
  → Seleção MÚLTIPLA de categorias
  → Badge indicando modo de auditoria (ícone presencial/remoto)
  → Indicar com tag sutil quais são exclusivas SMIIC (HII, HIII, LI-LIII)

Passo 3: Selecionar Subcategoria(s) - opcional
  → Para CADA categoria selecionada, permitir escolher subcategorias
  → Pode pular se nenhuma subcategoria relevante

Passo 4: Revisão e marcação de primária
  → Lista todas as categorias selecionadas
  → Permitir marcar UMA como "Categoria Principal"
  → Mostrar resumo: "Grupo C - Abate (CV) + Grupo G - Transporte (GI)"
```

**Componentes visuais**:
- Cards de grupo: checkbox no canto + ícone + nome + descrição
- Lista de categorias: checkbox + código + nome + badge auditMode
- Chips de resumo: removíveis com X

### 4.4 Atualizar tipos

**Arquivo**: `src/types/certification.types.ts`

```typescript
// REMOVER campos únicos:
// industrialGroupId?: string
// industrialCategoryId?: string
// industrialSubcategoryId?: string

// ADICIONAR:
interface CertificationIndustrialCategory {
  id: string;
  certificationId: string;
  industrialGroupId: string;
  industrialCategoryId: string;
  industrialSubcategoryId?: string;
  isPrimary: boolean;
  industrialGroup: IndustrialGroup;
  industrialCategory: IndustrialCategory;
  industrialSubcategory?: IndustrialSubcategory;
}

interface Certification {
  // ... existentes ...
  standard?: CertificationStandard;
  standardNotes?: string;
  industrialCategories?: CertificationIndustrialCategory[];
}

// WizardData:
interface WizardData {
  // REMOVER campos únicos de industrial
  // ADICIONAR:
  selectedCategories?: {
    categoryCode: string;
    subcategoryCode?: string;
    isPrimary: boolean;
  }[];
}
```

### 4.5 Atualizar página de nova certificação

**Arquivo**: `src/pages/company/NewCertificationRequest.tsx`

- Receber array de categorias do wizard
- Enviar no DTO como `industrialCategories[]`

### 4.6 Criar componente de definição de norma (para analista)

**Novo componente**: `src/components/certification/StandardSelector.tsx`

- Visível apenas para roles: analista, gestor, admin
- Select com opções: GSO 2055-2, SMIIC 02, Ambas, Voluntária
- Campo de justificativa/notas
- Exibe automaticamente as implicações (quais categorias mudam de código, modo de auditoria)

### 4.7 Atualizar detalhes da certificação

Na página de detalhes da certificação, exibir:
- Lista de categorias selecionadas (com código, nome, grupo)
- Badge da categoria primária
- Campo de norma (editável pelo analista)
- Se norma definida: mostrar código correto (GSO ou SMIIC) ao lado de cada categoria

### 4.8 Atualizar CompetencyFormModal

- Mostrar todas as categorias (sem filtro)
- Badge indicando aplicabilidade GSO / SMIIC / Ambas

**Checklist**:
- [ ] Arquivo estático legado removido
- [ ] Service com métodos many-to-many
- [ ] Wizard com seleção múltipla de grupos e categorias
- [ ] Passo de revisão com marcação de primária
- [ ] Tipos atualizados (array em vez de FK única)
- [ ] Página de nova certificação atualizada
- [ ] StandardSelector para analista
- [ ] Detalhes da certificação com múltiplas categorias
- [ ] CompetencyFormModal atualizado

---

## FASE 5 - TESTES (Backend)

### 5.1 Testes do service de classificação

```
describe('IndustrialClassificationService')
  describe('addCategoryToCertification')
    ✓ deve adicionar uma categoria à certificação
    ✓ deve adicionar múltiplas categorias
    ✓ deve rejeitar categoria duplicada
    ✓ deve permitir marcar uma como primária
    ✓ deve mover isPrimary se outra for marcada

  describe('removeCategoryFromCertification')
    ✓ deve remover uma categoria
    ✓ deve permitir remover todas

  describe('getAuditModeForCertification')
    ✓ deve retornar IN_LOCO para E quando standard = GSO
    ✓ deve retornar REMOTO para E quando standard = SMIIC
    ✓ deve retornar IN_LOCO se QUALQUER categoria exigir presencial
```

### 5.2 Testes do workflow

```
describe('WorkflowService - Multiple Categories')
  ✓ se certificação tem CV + GI, Estágio 1 deve ser presencial (CV exige)
  ✓ se certificação tem FI + GII, Estágio 1 pode ser remoto
  ✓ se certificação tem E + FI no GSO, Estágio 1 presencial (E exige no GSO)
  ✓ se certificação tem E + FI na SMIIC, Estágio 1 remoto (E permite na SMIIC)
```

### 5.3 Testes de certificado PDF

```
describe('CertificatePdfService')
  ✓ deve listar todas as categorias no certificado
  ✓ deve destacar categoria primária
  ✓ deve usar códigos GSO quando standard = GSO
  ✓ deve usar códigos SMIIC quando standard = SMIIC
  ✓ CV deve aparecer como CI no certificado SMIIC
```

**Checklist**:
- [ ] Testes many-to-many
- [ ] Testes workflow com múltiplas categorias
- [ ] Testes PDF com múltiplas categorias
- [ ] Todos os testes passando

---

## FASE 6 - MIGRAÇÃO DE DADOS EM PRODUÇÃO

### 6.1 Inventário

```sql
SELECT ic.code, ic.name, COUNT(c.id) as total
FROM "IndustrialCategory" ic
LEFT JOIN "Certification" c ON c."industrialCategoryId" = ic.id
GROUP BY ic.code, ic.name ORDER BY total DESC;
```

### 6.2 Script de migração

**Arquivo**: `prisma/migrate-industrial-data.ts`

```
1. Criar novos grupos/categorias (seed correto)
2. Para cada Certification com industrialCategoryId antigo:
   a. Mapear código antigo → código novo (tabela da Fase 2)
   b. Inserir na tabela CertificationIndustrialCategory
   c. Marcar como isPrimary = true (era a única)
   d. Definir standard = null (analista decidirá)
3. Para cada AuditorCompetency:
   a. Mapear industrialCategoryId antigo → novo
4. Validar: zero certificações sem categoria
5. Remover categorias/grupos antigos sem referências
6. Remover colunas FK antigas da Certification (Passo 2 da migration)
```

### 6.3 Mapa de migração

| Código Antigo (Seed atual) | → Código Novo | Observação |
|---------------------------|---------------|------------|
| AI (Criação Animais) | AI | Compatível |
| AII (Aquicultura) | AII | Compatível |
| AIII (Cultivo Plantas) | BI | Muda de grupo A→B |
| BI (Carnes e Derivados) | CI | Muda de grupo B→C |
| BII (Laticínios) | CI | Agrupado em CI |
| BIII (Pescados) | CI | Agrupado em CI |
| BIV (Prod. Vegetais) | CII | Muda B→C |
| BV (Grãos e Cereais) | CIV | Temp. ambiente |
| BVI (Óleos e Gorduras) | CIV | Temp. ambiente |
| BVII (Doces) | CIV | Temp. ambiente |
| BVIII (Prontos Consumo) | CIII | Produtos mistos |
| CI (Abate Bovinos) | CV | Abate |
| CII (Abate Aves) | CV | Abate |
| DI-DIII (Bebidas) | CIV | Temp. ambiente |
| EI-EIII (Restaurantes) | E | Cat. única |
| FI (Atacado) | FI | Compatível |
| FII (Varejo) | FI | Agrupado |
| FIII (Armazém) | GI | Muda F→G |
| FIV (Transporte) | GI | Muda F→G |
| GI-GIV (Cosméticos) | LI | Novo grupo L |
| HI-HIII (Farmacêuticos) | K | Bioquímica |
| II-IIII (Embalagens) | I | Compatível |
| JI-JII (Equipamentos) | J | Compatível |
| KI-KIV (Bioquímica) | K | Compatível |

### 6.4 Ordem de execução

```
1. Backup do banco
2. Migration Passo 1 (adicionar campos + tabela junção, SEM remover FKs)
3. Deploy backend (backward compatible - lê FK antiga E tabela nova)
4. Executar seed de novos dados
5. Executar script de migração (popular tabela de junção)
6. Validar com queries
7. Migration Passo 2 (remover FKs antigas)
8. Deploy backend definitivo
9. Deploy frontend com wizard atualizado
```

**Checklist**:
- [ ] Inventário executado
- [ ] Script de migração testado em staging
- [ ] Backup realizado
- [ ] Executado em produção
- [ ] Zero dados órfãos confirmado
- [ ] FKs antigas removidas

---

## DIAGRAMA DA NOVA ARQUITETURA

```
┌─────────────────┐      ┌──────────────────────────────────┐
│  Certification  │      │  CertificationIndustrialCategory │
│                 │ 1──N │                                  │
│  id             │──────│  certificationId                 │
│  standard?      │      │  industrialGroupId    ───┐       │
│  standardNotes? │      │  industrialCategoryId  ──┼──┐    │
│                 │      │  industrialSubcatId?   ──┼──┼─┐  │
│                 │      │  isPrimary             │  │  │  │
│                 │      └──────────────────────────┘  │  │  │
└─────────────────┘                                    │  │  │
                                                       │  │  │
┌─────────────────┐  ┌───────────────────┐  ┌─────────┴──┴──┴──┐
│ IndustrialGroup │  │IndustrialCategory │  │IndustrialSubcat   │
│                 │  │                   │  │                   │
│  code (A-L)     │  │  code (AI,CV...)  │  │  code (CV-01...)  │
│  gsoGroupName   │  │  gsoCode          │  │                   │
│  smiicGroupName │  │  smiicCode         │  │                   │
│  applicableGso  │  │  gsoAuditMode      │  │                   │
│  applicableSmiic│  │  smiicAuditMode    │  │                   │
│                 │  │  applicableGso     │  │                   │
│                 │  │  applicableSmiic   │  │                   │
└─────────────────┘  └───────────────────┘  └───────────────────┘
```

**Fluxo**:
1. **Cliente**: Seleciona N categorias de M grupos no wizard
2. **Sistema**: Grava na tabela `CertificationIndustrialCategory`
3. **Analista**: Posteriormente define `standard` na certificação
4. **Sistema**: Usa `standard` + `gsoAuditMode`/`smiicAuditMode` para validações de auditoria
5. **Certificado PDF**: Lista todas as categorias com códigos corretos para a norma definida
