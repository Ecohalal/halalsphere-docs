# 6. Indices e Performance

**PostgreSQL 16 + pgvector | 40+ Tabelas | MVP em Producao: Janeiro 2026**

---

## 6.1 Indices Principais por Tabela

### Users
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_group_admin ON users(is_group_admin);
CREATE INDEX idx_users_is_company_admin ON users(is_company_admin);
```

### Companies
```sql
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE UNIQUE INDEX idx_companies_cnpj ON companies(cnpj);
CREATE INDEX idx_companies_is_verified ON companies(is_verified);
CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_companies_group_id ON companies(group_id);
CREATE INDEX idx_companies_pending_validation ON companies(pending_validation);
```

### Company Groups
```sql
CREATE INDEX idx_company_groups_name ON company_groups(name);
CREATE INDEX idx_company_groups_document ON company_groups(document);
```

### Plants
```sql
CREATE INDEX idx_plants_company_id ON plants(company_id);
CREATE INDEX idx_plants_code ON plants(code);
CREATE INDEX idx_plants_code_type ON plants(code_type);
CREATE INDEX idx_plants_is_active ON plants(is_active);
CREATE UNIQUE INDEX idx_plants_company_code ON plants(company_id, code);
```

### Industrial Classification
```sql
CREATE INDEX idx_industrial_groups_code ON industrial_groups(code);
CREATE INDEX idx_industrial_groups_is_active ON industrial_groups(is_active);
CREATE INDEX idx_industrial_categories_group_id ON industrial_categories(group_id);
CREATE INDEX idx_industrial_categories_code ON industrial_categories(code);
CREATE INDEX idx_industrial_categories_is_active ON industrial_categories(is_active);
CREATE INDEX idx_industrial_subcategories_category_id ON industrial_subcategories(category_id);
CREATE INDEX idx_industrial_subcategories_code ON industrial_subcategories(code);
CREATE INDEX idx_industrial_subcategories_is_active ON industrial_subcategories(is_active);
```

### Requests
```sql
CREATE INDEX idx_requests_company_id ON requests(company_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_protocol ON requests(protocol);
CREATE INDEX idx_requests_reviewer_id ON requests(reviewer_id);
CREATE INDEX idx_requests_industrial_group_id ON requests(industrial_group_id);
CREATE INDEX idx_requests_industrial_category_id ON requests(industrial_category_id);
CREATE INDEX idx_requests_industrial_subcategory_id ON requests(industrial_subcategory_id);
```

### Processes
```sql
CREATE UNIQUE INDEX idx_processes_request_id ON processes(request_id);
CREATE INDEX idx_processes_analyst_id ON processes(analyst_id);
CREATE INDEX idx_processes_auditor_id ON processes(auditor_id);
CREATE INDEX idx_processes_status ON processes(status);
CREATE INDEX idx_processes_current_phase ON processes(current_phase);
```

### Certifications
```sql
CREATE INDEX idx_certifications_company_id ON certifications(company_id);
CREATE INDEX idx_certifications_plant_id ON certifications(plant_id);
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_certifications_valid_until ON certifications(valid_until);
CREATE INDEX idx_certifications_certification_number ON certifications(certification_number);
CREATE INDEX idx_certifications_analyst_id ON certifications(analyst_id);
```

### Documents
```sql
CREATE INDEX idx_documents_request_id ON documents(request_id);
CREATE INDEX idx_documents_certification_id ON documents(certification_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_validation_status ON documents(validation_status);
```

### Contracts
```sql
CREATE INDEX idx_contracts_process_id ON contracts(process_id);
CREATE INDEX idx_contracts_company_id ON contracts(company_id);
CREATE INDEX idx_contracts_certification_id ON contracts(certification_id);
CREATE INDEX idx_contracts_status ON contracts(status);
```

### Audits
```sql
CREATE INDEX idx_audits_process_id ON audits(process_id);
CREATE INDEX idx_audits_certification_id ON audits(certification_id);
CREATE INDEX idx_audits_auditor_id ON audits(auditor_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_scheduled_date ON audits(scheduled_date);
```

### Certificates
```sql
CREATE INDEX idx_certificates_process_id ON certificates(process_id);
CREATE INDEX idx_certificates_certification_id ON certificates(certification_id);
CREATE INDEX idx_certificates_certificate_number ON certificates(certificate_number);
CREATE INDEX idx_certificates_status ON certificates(status);
```

---

## 6.2 Indices Compostos (Performance)

```sql
-- Busca de processos por empresa + status (Dashboard)
CREATE INDEX idx_processes_company_status
    ON processes(request_id, status)
    INCLUDE (analyst_id, current_phase);

-- Busca de processos por analista + fase (Kanban)
CREATE INDEX idx_processes_analyst_phase
    ON processes(analyst_id, current_phase)
    WHERE analyst_id IS NOT NULL;

-- Busca de auditorias por auditor + data (Calendario)
CREATE INDEX idx_audits_auditor_date
    ON audits(auditor_id, scheduled_date)
    WHERE status IN ('agendado', 'em_andamento');

-- Certificados proximos de vencer (Renovacao)
CREATE INDEX idx_certificates_expiring
    ON certificates(status, expires_at)
    WHERE status = 'ativo';

-- Certifications proximas de vencer
CREATE INDEX idx_certifications_expiring
    ON certifications(status, valid_until)
    WHERE status = 'ativa';

-- Solicitacoes pendentes por empresa
CREATE INDEX idx_requests_pending
    ON requests(company_id, status)
    WHERE status IN ('enviado', 'pendente', 'em_analise');

-- Propostas pendentes de resposta
CREATE INDEX idx_proposals_pending
    ON proposals(status, valid_until)
    WHERE status = 'enviada';

-- Notificacoes nao lidas
CREATE INDEX idx_notifications_unread
    ON notifications(user_id, created_at)
    WHERE read_at IS NULL;
```

---

## 6.3 Indices Full-Text Search

```sql
-- Busca de empresas por nome (fuzzy search)
CREATE INDEX idx_companies_name_fts
    ON companies USING gin(
        to_tsvector('portuguese',
            razao_social || ' ' || COALESCE(nome_fantasia, '')
        )
    );

-- Busca fuzzy de empresas (trigram similarity)
CREATE INDEX idx_companies_name_trgm
    ON companies USING gin(razao_social gin_trgm_ops);

-- Busca de solicitacoes por protocolo (trigram)
CREATE INDEX idx_requests_protocol_trgm
    ON requests USING gin(protocol gin_trgm_ops);

-- Busca de certificacoes por numero
CREATE INDEX idx_certifications_number_trgm
    ON certifications USING gin(certification_number gin_trgm_ops);
```

---

## 6.4 Indices para RAG (pgvector)

```sql
-- Extensao pgvector para embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Indice HNSW para busca semantica rapida no knowledge_base
CREATE INDEX idx_knowledge_base_embedding
    ON knowledge_base
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Configuracao otimizada para queries
SET hnsw.ef_search = 100;
```

---

## 6.5 Indices de Audit Trail

```sql
-- Busca de logs por entidade
CREATE INDEX idx_audit_trail_entity
    ON audit_trail(entity, entity_id);

-- Busca de logs por usuario
CREATE INDEX idx_audit_trail_user_id
    ON audit_trail(user_id);

-- Busca de logs por data (range queries)
CREATE INDEX idx_audit_trail_created_at
    ON audit_trail(created_at DESC);

-- Indice composto para busca completa
CREATE INDEX idx_audit_trail_entity_date
    ON audit_trail(entity, entity_id, created_at DESC);
```

---

## 6.6 Indices de Historico

```sql
-- Process Phase History
CREATE INDEX idx_process_phase_history_process_id
    ON process_phase_history(process_id);

CREATE INDEX idx_process_phase_history_entered_at
    ON process_phase_history(process_id, entered_at DESC);

-- Process History
CREATE INDEX idx_process_history_process_id
    ON process_history(process_id);

CREATE INDEX idx_process_history_created_at
    ON process_history(process_id, created_at DESC);

-- Certification History
CREATE INDEX idx_certification_history_certification_id
    ON certification_history(certification_id);

CREATE INDEX idx_certification_history_performed_at
    ON certification_history(certification_id, performed_at DESC);
```

---

## 6.7 Materialized Views para Dashboards

```sql
-- Estatisticas por analista
CREATE MATERIALIZED VIEW analyst_stats AS
SELECT
    u.id AS analyst_id,
    u.name AS analyst_name,
    COUNT(DISTINCT p.id) AS total_processes,
    COUNT(*) FILTER (WHERE p.status = 'em_andamento') AS active_processes,
    COUNT(*) FILTER (WHERE p.status IN ('concluido', 'certificado')) AS completed_processes,
    AVG(p.days_in_phase)::INTEGER AS avg_days_in_phase
FROM users u
LEFT JOIN processes p ON p.analyst_id = u.id
WHERE u.role IN ('analista', 'gestor')
GROUP BY u.id, u.name;

CREATE UNIQUE INDEX idx_analyst_stats_id ON analyst_stats(analyst_id);

-- Estatisticas por empresa
CREATE MATERIALIZED VIEW company_stats AS
SELECT
    c.id AS company_id,
    c.razao_social,
    COUNT(DISTINCT r.id) AS total_requests,
    COUNT(DISTINCT cert.id) AS total_certifications,
    COUNT(*) FILTER (WHERE cert.status = 'ativa') AS active_certifications,
    MAX(r.created_at) AS last_request_date
FROM companies c
LEFT JOIN requests r ON r.company_id = c.id
LEFT JOIN certifications cert ON cert.company_id = c.id
GROUP BY c.id, c.razao_social;

CREATE UNIQUE INDEX idx_company_stats_id ON company_stats(company_id);

-- Refresh (executar via cron diario)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY analyst_stats;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY company_stats;
```

---

## 6.8 Particionamento de Tabelas

```sql
-- Particionar audit_trail por mes (retencao 7 anos)
CREATE TABLE audit_trail_partitioned (
    LIKE audit_trail INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Criar particoes
CREATE TABLE audit_trail_2025_01 PARTITION OF audit_trail_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE audit_trail_2025_02 PARTITION OF audit_trail_partitioned
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- ... continuar para todos os meses

-- Particionar notifications (retencao 90 dias)
CREATE TABLE notifications_partitioned (
    LIKE notifications INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Auto-vacuum agressivo em tabelas grandes
ALTER TABLE audit_trail SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE notifications SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05
);
```

---

## 6.9 Configuracoes de Performance

```sql
-- Connection pooling (via PgBouncer ou Supabase)
-- shared_buffers = 256MB (ou 25% da RAM)
-- effective_cache_size = 768MB (ou 75% da RAM)
-- maintenance_work_mem = 128MB
-- work_mem = 16MB

-- Estatisticas mais detalhadas
ALTER TABLE users SET (autovacuum_enabled = true);
ALTER TABLE companies SET (autovacuum_enabled = true);
ALTER TABLE processes SET (autovacuum_enabled = true);
ALTER TABLE certifications SET (autovacuum_enabled = true);

-- Vacuum agressivo para tabelas de log
ALTER TABLE audit_trail SET (
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_threshold = 500
);
```

---

**Ultima atualizacao**: 24 de Janeiro de 2026
