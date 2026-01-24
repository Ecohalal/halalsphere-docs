# Database Design

**PostgreSQL 16 + pgvector | 40+ Tabelas | MVP em Producao: Janeiro 2026**

---

## Arquivos do Database Design

### [1. ERD - Entity Relationship Diagram](01-erd.md)
**Diagramas Mermaid | Relacionamentos | Visao Geral**

- Diagrama resumido (alto nivel)
- Diagramas detalhados por dominio (14 secoes)
- Relacionamentos FK
- Tipos de dados principais
- Estrutura de Grupos Empresariais
- Nova estrutura de Certificacoes

### [2. Dicionario de Dados](02-data-dictionary.md)
**Documentacao Completa de 44 Tabelas**

- `users` - Usuarios do sistema (12 roles)
- `companies` - Dados cadastrais das empresas
- `company_groups` - Grupos empresariais
- `plants` - Plantas/instalacoes
- `requests` - Solicitacoes de certificacao
- `processes` - Processos de certificacao (17 fases)
- `certifications` - Certificacoes (nova estrutura)
- `certification_scopes` - Escopos das certificacoes
- `industrial_groups/categories/subcategories` - GSO 2055-2
- `pricing_tables` / `proposals` - Propostas comerciais
- `e_signature_configs` / `storage_configs` - Configuracoes
- E mais...

### [3. DDL - Data Definition Language](03-ddl.md)
**Scripts SQL Completos | CREATE TABLE | Constraints**

- Extensions (uuid-ossp, pgcrypto, pg_trgm, vector)
- 30+ ENUMs definidos
- 44 tabelas CREATE TABLE
- Triggers (updated_at automatico)
- Constraints (validacoes, FKs, UNIQUEs)

### [4. Indices e Performance](04-indexes.md)
**Otimizacoes | Full-Text Search | pgvector**

- Indices simples por tabela
- Indices compostos (queries complexas)
- Full-text search (empresas, protocolos)
- pgvector HNSW (RAG para chatbot)
- Materialized views (dashboards)
- Particionamento (audit_trail)
- Configuracoes de performance

### [5. Migrations Strategy](05-migrations.md)
**Prisma Migrate | Versionamento | Rollback**

- Estrutura de migrations
- Historico de migrations aplicadas
- Exemplos de migration
- Data migration
- Rollback strategy
- CI/CD Integration

---

## Estatisticas do Banco

### Tabelas por Dominio

| Dominio | Qtd | Tabelas |
|---------|-----|---------|
| **Core** | 6 | users, companies, company_groups, plants, requests, processes |
| **Certificacoes** | 9 | certifications, certification_scopes, scope_*, certification_requests, request_workflows, certification_history |
| **Classificacao Industrial** | 3 | industrial_groups, industrial_categories, industrial_subcategories |
| **Documentos** | 2 | documents, document_requests |
| **Contratos** | 4 | contracts, proposals, pricing_tables, signature_documents |
| **Auditorias** | 3 | audits, committee_decisions, certificates |
| **IA/Chat** | 4 | ai_analyses, knowledge_base, chat_messages, comments |
| **Notificacoes** | 2 | notifications, audit_trail |
| **Grupos Empresariais** | 4 | shared_suppliers, corporate_documents, user_invites, access_requests |
| **Configuracoes** | 5 | e_signature_configs, storage_configs, company_buckets, cnpj_lookup_configs, cnpj_lookup_cache |
| **Historico** | 2 | process_phase_history, process_history |
| **Total** | **44** | - |

### Enums do Sistema

| Categoria | Qtd | Exemplos |
|-----------|-----|----------|
| Usuarios | 1 | UserRole (12 roles) |
| Solicitacoes | 4 | RequestType, CertificationType, ProductOrigin, RequestStatus |
| Processos | 3 | ProcessStatus (16), ProcessPhase (17), Priority |
| Certificacoes | 4 | CertificationStatus, SuspensionType, CancellationType, ScopeItemStatus |
| Documentos | 3 | DocumentType (15), ValidationStatus, DocumentRequestStatus |
| Contratos | 4 | ContractType, ContractStatus, ProposalStatus, SignatureStatus |
| Auditorias | 4 | AuditType (7), AuditStatus, AuditResult, DecisionType |
| Sistema | 7 | NotificationType, AuditEntity, AuditAction, StorageProvider, ESignatureProvider, CnpjLookupProvider, etc. |
| **Total** | **30+** | - |

### Dados Esperados (Producao)

- **Empresas ativas**: ~200 (com grupos empresariais)
- **Certificacoes ativas**: ~500
- **Processos em andamento**: 100-150 simultaneos
- **Usuarios**: ~200 (12 roles diferentes)
- **Documentos**: ~15.000 arquivos
- **Storage total**: ~500 GB

### Performance

- **Queries <1s**: 95% das consultas
- **Indices**: 80+ indices otimizados
- **Full-text search**: Sub-segundo em 50k registros
- **Vector search**: <100ms para RAG
- **Backup**: Diario (retencao 7 anos)

---

## Relacionamentos Principais

```
users ─┬─→ companies (proprietario)
       ├─→ processes (analista/auditor)
       ├─→ certifications (analista)
       ├─→ notifications
       ├─→ chat_messages
       └─→ audit_trail

company_groups ─┬─→ companies (grupo)
                ├─→ shared_suppliers
                └─→ corporate_documents

companies ─┬─→ requests
           ├─→ certifications
           ├─→ contracts
           └─→ plants

certifications ─┬─→ certification_scopes
                │   ├─→ scope_products
                │   ├─→ scope_facilities
                │   ├─→ scope_brands
                │   └─→ scope_suppliers
                ├─→ certification_requests
                │   └─→ request_workflows
                └─→ certification_history

requests ─┬─→ processes
          ├─→ documents
          └─→ industrial_classification

processes ─┬─→ documents
           ├─→ contracts → proposals
           ├─→ audits
           ├─→ committee_decisions
           ├─→ certificates
           └─→ ai_analyses

industrial_groups ─→ industrial_categories ─→ industrial_subcategories
```

---

## Quick Start

### 1. Executar Migrations
```bash
# Usar Prisma (recomendado)
npx prisma migrate dev

# Ou em producao
npx prisma migrate deploy
```

### 2. Verificar Schema
```bash
npx prisma studio
# Abre interface visual em http://localhost:5555
```

### 3. Gerar Cliente
```bash
npx prisma generate
```

### 4. Popular Dados de Exemplo
```bash
npm run db:seed
# Cria dados de exemplo para desenvolvimento
```

---

## Navegacao

- [Voltar para Technical Architecture](../README.md)
- [Stack Tecnologica](../01-stack.md)
- [System Architecture](../02-system-architecture.md)
- [APIs e Integracoes](../04-apis.md)

---

**Ultima atualizacao**: 24 de Janeiro de 2026
