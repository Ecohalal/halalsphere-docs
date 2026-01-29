# Branding Temporário: Gestão de Certificações

**Data:** 29 de Janeiro de 2026
**Status:** ATIVO - Temporário
**Objetivo:** Substituir branding HalalSphere por "Gestão de Certificações" temporariamente

---

## Alterações Realizadas

### 1. `index.html`

| Campo | Antes (Original) | Depois (Temporário) |
|-------|-------------------|---------------------|
| Favicon | `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` | `<link rel="icon" type="image/png" href="/favicon_gestao.png" />` |
| Meta description | `HalalSphere - O ecossistema digital da certificação Halal` | `Gestão de Certificações - O Ecossistema Digital de Gestão de Certificações` |
| Title | `HalalSphere - Certificação Halal Digital` | `Gestão de Certificações` |

### 2. `src/pages/Login.tsx`

| Campo | Antes (Original) | Depois (Temporário) |
|-------|-------------------|---------------------|
| Logo src | `/logo.png` | `/gestao_certificacoes_logo.png` |
| Logo alt | `HalalSphere` | `Gestão de Certificações` |
| Tagline | `O ecossistema digital da certificação Halal` | `O Ecossistema Digital de Gestão de Certificações` |
| Footer | `© 2025 HalalSphere. Todos os direitos reservados.` | `© 2025 Gestão de Certificações. Todos os direitos reservados.` |

### 3. `src/components/layout/Header.tsx`

| Campo | Antes (Original) | Depois (Temporário) |
|-------|-------------------|---------------------|
| Logo src | `/logo.png` | `/gestao_certificacoes_logo.png` |
| Logo alt | `HalalSphere` | `Gestão de Certificações` |
| App name (h1) | `HalalSphere` | `Gestão de Certificações` |

### 4. `src/components/layout/MobileMenu.tsx`

| Campo | Antes (Original) | Depois (Temporário) |
|-------|-------------------|---------------------|
| Logo src | `/logo.png` | `/gestao_certificacoes_logo.png` |
| Logo alt | `HalalSphere` | `Gestão de Certificações` |

---

## Arquivos de Logo/Favicon

| Arquivo | Uso |
|---------|-----|
| `/public/logo.png` | Logo original HalalSphere (manter no repositório) |
| `/public/favicon.svg` | Favicon original HalalSphere (manter no repositório) |
| `/public/gestao_certificacoes_logo.png` | Logo temporário Gestão de Certificações |
| `/public/favicon_gestao.png` | Favicon temporário Gestão de Certificações |

---

## Como Reverter

Para voltar ao branding original HalalSphere, reverter as seguintes alterações:

### index.html
```html
<!-- DE: -->
<link rel="icon" type="image/png" href="/favicon_gestao.png" />
<meta name="description" content="Gestão de Certificações - O Ecossistema Digital de Gestão de Certificações" />
<title>Gestão de Certificações</title>

<!-- PARA: -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="description" content="HalalSphere - O ecossistema digital da certificação Halal" />
<title>HalalSphere - Certificação Halal Digital</title>
```

### src/pages/Login.tsx
```tsx
// DE:
src="/gestao_certificacoes_logo.png"
alt="Gestão de Certificações"
O Ecossistema Digital de Gestão de Certificações
© 2025 Gestão de Certificações. Todos os direitos reservados.

// PARA:
src="/logo.png"
alt="HalalSphere"
O ecossistema digital da certificação Halal
© 2025 HalalSphere. Todos os direitos reservados.
```

### src/components/layout/Header.tsx
```tsx
// DE:
<img src="/gestao_certificacoes_logo.png" alt="Gestão de Certificações" className="h-8 md:h-10 w-auto" />
<h1 className="text-lg md:text-xl font-semibold text-primary hidden sm:block">Gestão de Certificações</h1>

// PARA:
<img src="/logo.png" alt="HalalSphere" className="h-8 md:h-10 w-auto" />
<h1 className="text-lg md:text-xl font-semibold text-primary hidden sm:block">HalalSphere</h1>
```

### src/components/layout/MobileMenu.tsx
```tsx
// DE:
<img src="/gestao_certificacoes_logo.png" alt="Gestão de Certificações" className="h-12 w-auto" />

// PARA:
<img src="/logo.png" alt="HalalSphere" className="h-12 w-auto" />
```

---

**Nota:** Os arquivos originais (`logo.png`, `favicon.svg`) permanecem no repositório e não foram removidos.
