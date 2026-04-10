# Epic 11 - Revisão Ortográfica Completa da Plataforma

> **1 User Story** | **Estimativa Total**: 8 Story Points
> **Prioridade Geral**: Should Have (P1) - Qualidade e profissionalismo dos textos
> **Data**: 05/03/2026

---

## Sumário

| # | Categoria | Stories | SP |
|---|-----------|---------|-----|
| 1 | Revisão Ortográfica | US-098 | 8 |

---

## 1. Revisão Ortográfica

---

##### **US-098: Revisão Ortográfica Completa da Plataforma**

```
Como usuário da plataforma,
Eu quero que todos os textos exibidos estejam escritos corretamente em português,
Para que o sistema transmita profissionalismo e credibilidade junto aos clientes e organismos reguladores.
```

**Prioridade**: Should Have (P1)
**Estimativa**: 8 story points
**Dependências**: Nenhuma

**Critérios de Aceitação**:
- [ ] Todos os labels de formulários revisados e corrigidos
- [ ] Todas as mensagens de sucesso, erro e validação revisadas
- [ ] Textos de menus, breadcrumbs e navegação revisados
- [ ] Títulos de páginas e seções revisados
- [ ] Textos de modais de confirmação e diálogos revisados
- [ ] Textos de tooltips e placeholders revisados
- [ ] Textos de emails e notificações revisados (templates backend)
- [ ] Mensagens de erro da API (backend) revisadas
- [ ] Nenhum texto com erro ortográfico, gramatical ou de acentuação remanescente
- [ ] Consistência terminológica garantida (ex: "Certificação" vs "certificação", uso uniforme de termos técnicos Halal)

**Regras de Negócio**:
- **RN-098-01**: A revisão deve cobrir frontend (componentes React, páginas, mensagens) e backend (mensagens de erro, templates de email, respostas da API)
- **RN-098-02**: Termos técnicos Halal devem seguir a terminologia oficial da PR 7.1 Rev 21/22
- **RN-098-03**: Manter consistência entre singular/plural e uso de maiúsculas em termos-chave (ex: "Certificação Halal", "Organismo de Certificação")
- **RN-098-04**: Textos de enums e status devem usar labels amigáveis em português, não os valores técnicos em inglês

**Escopo da Revisão**:

| Área | Localização | Exemplos |
|------|-------------|----------|
| **Frontend - Páginas** | `src/pages/**/*.tsx` | Títulos, descrições, textos estáticos |
| **Frontend - Componentes** | `src/components/**/*.tsx` | Labels, placeholders, tooltips |
| **Frontend - Constantes/i18n** | `src/constants/`, `src/utils/` | Mapeamentos de status, mensagens |
| **Backend - Mensagens** | `src/**/*.service.ts` | Mensagens de erro e validação |
| **Backend - Templates** | `src/**/templates/` | Templates de email/notificação |
| **Backend - DTOs** | `src/**/*.dto.ts` | Mensagens de validação dos decorators |

**Testes**:
- [ ] Teste manual: Navegação completa por todas as telas verificando textos
- [ ] Teste manual: Disparar todas as mensagens de erro/validação e verificar ortografia
- [ ] Teste manual: Verificar emails enviados pelo sistema

---

## Resumo de Classificação

### Por Tipo

| Tipo | Qtd | Stories |
|------|-----|---------|
| **Melhoria de Qualidade** | 1 | US-098 |

### Por Prioridade

| Prioridade | Qtd | SP |
|------------|-----|-----|
| **Should Have (P1)** | 1 | 8 |
