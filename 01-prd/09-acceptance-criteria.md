# 9. Acceptance Criteria Globais

Esta seção define critérios de aceitação que se aplicam a **todas as user stories** do HalalSphere, além dos critérios específicos de cada US.

## 9.1 Funcionalidade

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Funciona conforme especificado** | Todos os requisitos funcionais da US estão implementados | Testes E2E passam |
| **Tratamento de erros** | Erros são capturados e exibidos de forma amigável (sem stack traces) | Testes de erro + validação manual |
| **Validações de input** | Campos obrigatórios validados client-side e server-side | Testes de validação |
| **Estados de loading** | Feedback visual durante operações assíncronas (spinners, skeleton) | Inspeção manual |
| **Mensagens de sucesso** | Confirmação visual após ações bem-sucedidas (toast, modal) | Inspeção manual |

---

## 9.2 Performance

**Aplicável a todas as US**:

| Critério | Métrica | Validação |
|----------|---------|-----------|
| **Tempo de resposta** | P95 <2s para páginas, <500ms para ações | Lighthouse, k6 |
| **First Contentful Paint** | <1.5s | Lighthouse |
| **Tamanho de bundle JS** | <500KB (gzipped) por rota | Webpack Bundle Analyzer |
| **Imagens otimizadas** | WebP, lazy loading, responsive | Lighthouse |
| **Queries otimizadas** | N+1 queries resolvidos, índices adequados | Query profiler |

---

## 9.3 Segurança

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Autenticação** | Rotas protegidas requerem JWT válido | Testes de autenticação |
| **Autorização** | RBAC aplicado (usuário só vê/edita o que tem permissão) | Testes de autorização |
| **Sanitização de inputs** | XSS prevenido (HTML escapado, CSP headers) | OWASP ZAP scan |
| **SQL Injection prevenido** | Prepared statements, ORM seguro | Testes de segurança |
| **HTTPS obrigatório** | Redirect HTTP → HTTPS | Inspeção manual |
| **Headers de segurança** | CSP, X-Frame-Options, X-Content-Type-Options | Security Headers scan |
| **Secrets não expostos** | Sem API keys, passwords em código ou logs | Code review + Snyk |

---

## 9.4 Usabilidade

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Responsivo** | Funciona em mobile (320px), tablet (768px), desktop (1024px+) | Testes manuais em 3 breakpoints |
| **Navegação por teclado** | Tab, Enter, Esc funcionam | Teste manual (sem mouse) |
| **Acessibilidade** | WCAG 2.1 AA: contraste, alt text, ARIA labels | axe DevTools (0 violações) |
| **Feedback claro** | Usuário sempre sabe o que está acontecendo | Inspeção manual |
| **Consistência visual** | Segue Design System (cores, tipografia, espaçamentos) | Code review + Storybook |
| **Textos claros** | Labels e mensagens sem jargão técnico | Content review |

---

## 9.5 Internacionalização (i18n)

**Aplicável a todas as US com UI**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Strings traduzíveis** | Todos os textos UI usam i18next (não hardcoded) | Code review |
| **Idiomas suportados** | pt-BR, en-US (MVP); ar-SA, tr-TR (Fase 3) | Testes em cada idioma |
| **Formatos localizados** | Datas, moedas, números formatados por locale | Testes de formatação |
| **RTL suportado** | Layout funciona em árabe (right-to-left) | Testes manuais (Fase 3) |

---

## 9.6 Testes

**Aplicável a todas as US**:

| Critério | Cobertura | Ferramentas |
|----------|-----------|-------------|
| **Unit tests** | >80% de cobertura de funções críticas | Jest (frontend), pytest (backend) |
| **Integration tests** | Endpoints críticos testados | Supertest (API) |
| **E2E tests** | Happy path principal da US | Playwright |
| **Code review** | 1 aprovação obrigatória antes de merge | GitHub PR |
| **CI/CD passa** | Build, lint, tests, security scan | GitHub Actions |

---

## 9.7 Documentação

**Aplicável a todas as US**:

| Critério | Descrição | Localização |
|----------|-----------|-------------|
| **API documentada** | Endpoints documentados no Swagger UI | OpenAPI 3.0 spec |
| **Código comentado** | Lógica complexa tem comentários explicativos | Inline comments |
| **Changelog atualizado** | Mudanças registradas | CHANGELOG.md |
| **ADR (se necessário)** | Decisões arquiteturais importantes documentadas | /docs/adr/ |

---

## 9.8 Compliance e Auditoria

**Aplicável a todas as US que manipulam dados ou processos críticos**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **Audit trail** | Ações críticas registradas (quem, quando, o quê, IP) | Logs estruturados |
| **LGPD compliance** | Dados pessoais tratados conforme LGPD | Checklist LGPD |
| **ISO 17065 compliance** | Rastreabilidade de processos de certificação | Checklist ISO 17065 |
| **PR 7.1 Rev 21 compliance** | Workflow segue procedimento operacional | Validação com especialista Halal |
| **Retenção de dados** | Dados históricos mantidos por 3 anos mínimo | Política de backup |

---

## 9.9 Observabilidade

**Aplicável a todas as US**:

| Critério | Descrição | Ferramentas |
|----------|-----------|-------------|
| **Logs estruturados** | JSON com campos padrão (timestamp, level, user_id, request_id) | Winston/Pino |
| **Métricas expostas** | Endpoints de saúde (/health, /metrics) | Prometheus |
| **Alertas configurados** | Erros críticos disparam alertas | PagerDuty |
| **Dashboards** | Métricas de negócio e técnicas visíveis | Grafana |

---

## 9.10 Qualidade de Código

**Aplicável a todas as US**:

| Critério | Métrica | Ferramentas |
|----------|---------|-------------|
| **Linter passa** | 0 erros de linting | ESLint, Ruff |
| **Formatter aplicado** | Código formatado consistentemente | Prettier, Black |
| **Complexidade ciclomática** | <10 por função | SonarQube |
| **Code smells** | Rating A no SonarQube | SonarQube |
| **Duplicação** | <3% de código duplicado | SonarQube |
| **Vulnerabilidades** | 0 high/critical | Snyk, npm audit |

---

## 9.11 DevOps e Deploy

**Aplicável a todas as US**:

| Critério | Descrição | Validação |
|----------|-----------|-----------|
| **CI/CD automatizado** | Build, test, deploy automatizados | GitHub Actions |
| **Deploy sem downtime** | Blue-green ou rolling deployment | Kubernetes |
| **Rollback testado** | Capacidade de reverter deploy em <5min | Runbook testado |
| **Staging validado** | US testada em staging antes de produção | Processo de release |
| **Secrets gerenciados** | Secrets não commitados, usam Vault/AWS Secrets | Code scan |

---

## 9.12 Definition of Done (DoD)

Uma User Story só pode ser considerada **DONE** quando:

✅ **Todos os Acceptance Criteria específicos da US** estão atendidos
✅ **Todos os Acceptance Criteria Globais** desta seção estão atendidos
✅ **Code review aprovado** por pelo menos 1 pessoa
✅ **CI/CD pipeline passa** (build, lint, tests, security scan)
✅ **Testado em staging** por Product Owner ou QA
✅ **Documentação atualizada** (API docs, manuais, changelog)
✅ **Deploy em produção bem-sucedido** (sem rollback)
✅ **Validado em produção** (smoke tests passam)

**Nota**: Apenas após DoD completo, a US pode ser marcada como "Done" no board e os story points contabilizados na velocidade do sprint.

---

## 📊 Status Atual do PRD v2.0

**✅ Este PRD está 100% completo!**

- ✅ Todas as 69 user stories detalhadas com acceptance criteria específicos (594 SP)
- ✅ Acceptance criteria globais definidos (aplicam-se a todas as US)
- ✅ Roadmap de 30 semanas definido (MVP em 22 semanas)
- ✅ Requisitos não-funcionais completos (performance, segurança, i18n)
- ✅ Dependências mapeadas e riscos mitigados com planos de contingência
- ✅ UX Design Guide separado ([ux-design-guide.md](../03-ux/ux-design-guide.md))

**Próximos passos**:
1. Revisão com stakeholders (CEO, CTO, Especialista Halal)
2. Aprovação final
3. Kickoff de desenvolvimento (Sprint 0: Fundação)
