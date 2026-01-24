# 4. Dicionario de Dados

**PostgreSQL 16 + pgvector | 40+ Tabelas | MVP em Producao: Janeiro 2026**

---

## 4.1 Tabela: `users`

Armazena todos os usuarios do sistema (12 roles).

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL, DEFAULT uuid_generate_v4() | Identificador unico |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Email de login |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hash (cost=12) |
| `role` | ENUM | NOT NULL | 12 roles: admin, empresa, analista, auditor, gestor, comercial, juridico, financeiro, gestor_auditoria, supervisor, controlador, secretaria |
| `name` | VARCHAR(255) | NOT NULL | Nome completo |
| `phone` | VARCHAR(20) | NULL | Telefone (formato internacional) |
| `mfa_config` | JSONB | NULL | `{secret, backup_codes[]}` para TOTP |
| `mfa_enabled` | BOOLEAN | NOT NULL, DEFAULT false | MFA ativado? |
| `login_attempts` | INTEGER | NOT NULL, DEFAULT 0 | Tentativas de login (rate limiting) |
| `locked_until` | TIMESTAMP | NULL | Bloqueio temporario (apos 5 tentativas) |
| `last_login` | TIMESTAMP | NULL | Ultimo login bem-sucedido |
| `is_group_admin` | BOOLEAN | NOT NULL, DEFAULT false | Admin do grupo empresarial |
| `is_company_admin` | BOOLEAN | NOT NULL, DEFAULT false | Admin da empresa |
| `is_temporary_admin` | BOOLEAN | NOT NULL, DEFAULT false | Admin temporario (primeiro usuario) |
| `admin_assigned_at` | TIMESTAMP | NULL | Quando FAMBRAS designou |
| `admin_assigned_by` | UUID | NULL, FK | Quem designou (userId FAMBRAS) |
| `pending_company_access` | UUID | NULL | CompanyId que solicitou acesso |
| `access_requested_at` | TIMESTAMP | NULL | Quando solicitou |
| `access_request_message` | TEXT | NULL | Mensagem da solicitacao |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de atualizacao |

**Indices**:
- `idx_users_email` (UNIQUE)
- `idx_users_role`
- `idx_users_is_group_admin`
- `idx_users_is_company_admin`

---

## 4.2 Tabela: `companies`

Dados cadastrais das empresas solicitantes.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | Identificador unico |
| `user_id` | UUID | FK users(id), UNIQUE, NULL | Usuario proprietario |
| `group_id` | UUID | FK company_groups(id), NULL | Grupo empresarial |
| `cnpj` | VARCHAR(14) | UNIQUE, NOT NULL | CNPJ (apenas numeros) |
| `razao_social` | VARCHAR(255) | NOT NULL | Razao social |
| `nome_fantasia` | VARCHAR(255) | NULL | Nome fantasia |
| `address` | JSONB | NULL | `{cep, logradouro, numero, complemento, bairro, cidade, uf, pais}` |
| `contact` | JSONB | NULL | `{email, telefone, whatsapp, responsavel}` |
| `email` | VARCHAR(255) | NULL | Email (flat field) |
| `telefone` | VARCHAR(50) | NULL | Telefone (flat field) |
| `endereco` | TEXT | NULL | Endereco (flat field) |
| `cidade` | VARCHAR(100) | NULL | Cidade |
| `estado` | VARCHAR(100) | NULL | Estado |
| `cep` | VARCHAR(20) | NULL | CEP |
| `pais` | VARCHAR(100) | NULL | Pais |
| `tipo_empresa` | VARCHAR(100) | NULL | Tipo da empresa |
| `website` | VARCHAR(255) | NULL | Site da empresa |
| `num_employees` | INTEGER | NULL | Numero de funcionarios |
| `annual_revenue` | DECIMAL(15,2) | NULL | Faturamento anual (BRL) |
| `main_activity` | TEXT | NULL | Atividade principal (CNAE) |
| `is_verified` | BOOLEAN | NOT NULL, DEFAULT false | Verificado pela FAMBRAS |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativo no sistema |
| `verified_at` | TIMESTAMP | NULL | Data de verificacao |
| `verified_by` | UUID | FK users(id), NULL | Quem verificou |
| `is_headquarters` | BOOLEAN | NOT NULL, DEFAULT false | E matriz do grupo? |
| `pending_validation` | BOOLEAN | NOT NULL, DEFAULT true | Aguardando validacao FAMBRAS? |
| `validation_notes` | TEXT | NULL | Notas de validacao |
| `created_by` | UUID | NULL | Usuario que cadastrou |
| `created_at` | TIMESTAMP | NOT NULL | Data de cadastro |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_companies_user_id`
- `idx_companies_cnpj` (UNIQUE)
- `idx_companies_is_verified`
- `idx_companies_is_active`
- `idx_companies_group_id`
- `idx_companies_pending_validation`

---

## 4.3 Tabela: `company_groups`

Grupos empresariais (holdings, conglomerados).

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | Identificador unico |
| `name` | VARCHAR(255) | NOT NULL | Nome do grupo |
| `trade_name` | VARCHAR(255) | NULL | Nome fantasia do grupo |
| `document` | VARCHAR(20) | NULL | CNPJ da holding |
| `contact_name` | VARCHAR(255) | NULL | Nome do contato |
| `contact_email` | VARCHAR(255) | NULL | Email do contato |
| `contact_phone` | VARCHAR(50) | NULL | Telefone do contato |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_company_groups_name`
- `idx_company_groups_document`

---

## 4.4 Tabela: `plants`

Plantas/instalacoes das empresas.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | Identificador unico |
| `company_id` | UUID | FK companies(id), NOT NULL | Empresa |
| `code` | VARCHAR(50) | NOT NULL | Codigo SIF ou interno |
| `code_type` | ENUM | NOT NULL | sif, sie, sim, internal |
| `name` | VARCHAR(255) | NOT NULL | Nome da planta |
| `address` | TEXT | NOT NULL | Endereco |
| `city` | VARCHAR(100) | NULL | Cidade |
| `state` | VARCHAR(100) | NULL | Estado |
| `postal_code` | VARCHAR(20) | NULL | CEP |
| `country` | VARCHAR(10) | NOT NULL, DEFAULT 'BR' | Pais |
| `production_capacity` | VARCHAR(255) | NULL | Capacidade de producao |
| `employee_count` | INTEGER | NULL | Numero de funcionarios |
| `shifts_count` | INTEGER | NULL | Numero de turnos |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativa |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_plants_company_id`
- `idx_plants_code`
- `idx_plants_code_type`
- `idx_plants_is_active`
- UNIQUE(`company_id`, `code`)

---

## 4.5 Tabela: `requests`

Solicitacoes de certificacao.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da solicitacao |
| `company_id` | UUID | FK companies(id), NOT NULL | Empresa solicitante |
| `protocol` | VARCHAR(50) | UNIQUE, NULL | REQ-20260115-00001 |
| `company_name` | VARCHAR(255) | NOT NULL | Nome da empresa |
| `cnpj` | VARCHAR(20) | NULL | CNPJ formatado |
| `request_type` | ENUM | NOT NULL | nova, inicial, renovacao, ampliacao, manutencao, adequacao |
| `certification_type` | ENUM | NOT NULL | C1-C6, produto, processo, servico |
| `industrial_group_id` | UUID | FK, NULL | Grupo industrial GSO 2055-2 |
| `industrial_category_id` | UUID | FK, NULL | Categoria industrial |
| `industrial_subcategory_id` | UUID | FK, NULL | Subcategoria industrial |
| `contact_person` | VARCHAR(255) | NULL | Pessoa de contato |
| `contact_email` | VARCHAR(255) | NULL | Email de contato |
| `contact_phone` | VARCHAR(50) | NULL | Telefone de contato |
| `facility_address` | TEXT | NULL | Endereco da instalacao |
| `facility_city` | VARCHAR(100) | NULL | Cidade |
| `facility_state` | VARCHAR(100) | NULL | Estado |
| `facility_country` | VARCHAR(100) | NULL | Pais |
| `facility_postal_code` | VARCHAR(20) | NULL | CEP |
| `product_origin` | ENUM | NULL | animal, vegetal, misto, quimico |
| `product_type` | VARCHAR(255) | NULL | Tipo do produto |
| `product_category` | VARCHAR(255) | NULL | Categoria do produto |
| `product_description` | TEXT | NULL | Descricao do produto |
| `product_details` | JSONB | NULL | {nome, descricao, ingredientes} |
| `production_details` | JSONB | NULL | {capacidade, turnos, processos} |
| `industrial_classification` | VARCHAR(500) | NULL | Classificacao industrial |
| `estimated_production_capacity` | VARCHAR(255) | NULL | Capacidade estimada |
| `current_certifications` | TEXT | NULL | Certificacoes atuais |
| `additional_info` | TEXT | NULL | Informacoes adicionais |
| `status` | ENUM | NOT NULL | rascunho, enviado, pendente, em_analise, aprovado, rejeitado, cancelado |
| `submitted_at` | TIMESTAMP | NULL | Data de envio |
| `reviewer_id` | UUID | FK users(id), NULL | Revisor |
| `reviewed_at` | TIMESTAMP | NULL | Data de revisao |
| `review_notes` | TEXT | NULL | Notas de revisao |
| `rejection_reason` | TEXT | NULL | Motivo de rejeicao |
| `cancel_reason` | TEXT | NULL | Motivo de cancelamento |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_requests_company_id`
- `idx_requests_status`
- `idx_requests_protocol`
- `idx_requests_reviewer_id`
- `idx_requests_industrial_group_id`
- `idx_requests_industrial_category_id`
- `idx_requests_industrial_subcategory_id`

---

## 4.6 Tabela: `processes`

Processos de certificacao (workflow).

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do processo |
| `request_id` | UUID | FK requests(id), UNIQUE, NOT NULL | Solicitacao origem |
| `analyst_id` | UUID | FK users(id), NULL | Analista responsavel |
| `auditor_id` | UUID | FK users(id), NULL | Auditor designado |
| `current_phase` | ENUM | NOT NULL, DEFAULT cadastro_solicitacao | 17 fases: cadastro_solicitacao ate certificado_emitido |
| `status` | ENUM | NOT NULL | 16 status: rascunho ate suspenso |
| `priority` | ENUM | NOT NULL, DEFAULT media | baixa, media, alta, urgente |
| `days_in_phase` | INTEGER | NOT NULL, DEFAULT 0 | Dias na fase atual |
| `estimated_end` | TIMESTAMP | NULL | Previsao de conclusao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_processes_request_id` (UNIQUE)
- `idx_processes_analyst_id`
- `idx_processes_auditor_id`
- `idx_processes_status`
- `idx_processes_current_phase`

---

## 4.7 Tabela: `documents`

Documentos uploadados.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do documento |
| `request_id` | UUID | FK requests(id), NOT NULL | Solicitacao |
| `certification_id` | UUID | FK certifications(id), NULL | Certificacao |
| `document_type` | ENUM | NOT NULL | 15 tipos de documento |
| `file_name` | VARCHAR(255) | NOT NULL | Nome original |
| `file_url` | TEXT | NOT NULL | URL do arquivo |
| `file_size` | INTEGER | NOT NULL | Tamanho em bytes |
| `mime_type` | VARCHAR(100) | NOT NULL | Tipo MIME |
| `validation_status` | ENUM | NOT NULL, DEFAULT pendente | pendente, aprovado, rejeitado |
| `validation_notes` | TEXT | NULL | Notas de validacao |
| `valid_until` | TIMESTAMP | NULL | Validade do documento |
| `uploaded_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de upload |
| `validated_at` | TIMESTAMP | NULL | Data de validacao |

**Indices**:
- `idx_documents_request_id`
- `idx_documents_certification_id`
- `idx_documents_document_type`
- `idx_documents_validation_status`

---

## 4.8 Tabela: `document_requests`

Solicitacoes de documentos pendentes.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da solicitacao |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `requested_by` | UUID | FK users(id), NOT NULL | Quem solicitou |
| `document_type` | ENUM | NOT NULL | Tipo de documento |
| `description` | TEXT | NOT NULL | Descricao |
| `due_date` | TIMESTAMP | NULL | Prazo |
| `status` | ENUM | NOT NULL, DEFAULT pendente | pendente, atendido, cancelado |
| `responded_at` | TIMESTAMP | NULL | Data de resposta |
| `uploaded_doc_id` | UUID | FK documents(id), NULL | Documento enviado |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_document_requests_process_id`
- `idx_document_requests_requested_by`
- `idx_document_requests_status`
- `idx_document_requests_due_date`

---

## 4.9 Tabela: `contracts`

Propostas e contratos.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do contrato |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `company_id` | UUID | FK companies(id), NOT NULL | Empresa |
| `certification_id` | UUID | FK certifications(id), NULL | Certificacao |
| `contract_type` | ENUM | NOT NULL | proposta, contrato |
| `status` | ENUM | NOT NULL | rascunho, enviado, em_negociacao, assinado, cancelado |
| `total_value` | DECIMAL(10,2) | NOT NULL | Valor total |
| `num_installments` | INTEGER | NOT NULL | Numero de parcelas |
| `validity_months` | INTEGER | NOT NULL | Validade em meses |
| `pdf_url` | TEXT | NULL | URL do PDF |
| `sent_at` | TIMESTAMP | NULL | Data de envio |
| `signed_at` | TIMESTAMP | NULL | Data de assinatura |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_contracts_process_id`
- `idx_contracts_company_id`
- `idx_contracts_certification_id`
- `idx_contracts_status`

---

## 4.10 Tabela: `audits`

Auditorias realizadas.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da auditoria |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `certification_id` | UUID | FK certifications(id), NULL | Certificacao |
| `auditor_id` | UUID | FK users(id), NULL | Auditor |
| `audit_type` | ENUM | NOT NULL | inicial, estagio1, estagio2, vigilancia, renovacao, especial, follow_up |
| `status` | ENUM | NOT NULL | agendado, em_andamento, concluido, cancelado |
| `scheduled_date` | TIMESTAMP | NOT NULL | Data agendada |
| `completed_date` | TIMESTAMP | NULL | Data de conclusao |
| `location` | JSONB | NOT NULL | {tipo: presencial/remota, endereco?} |
| `result` | ENUM | NULL | aprovado, aprovado_condicional, reprovado |
| `findings` | JSONB | NULL | {conformidades: [], nao_conformidades: []} |
| `auditor_notes` | TEXT | NULL | Notas do auditor |
| `is_unannounced` | BOOLEAN | NOT NULL, DEFAULT false | Auditoria nao anunciada |
| `unannounced_window_start` | TIMESTAMP | NULL | Inicio da janela permitida |
| `unannounced_window_end` | TIMESTAMP | NULL | Fim da janela permitida |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_audits_process_id`
- `idx_audits_certification_id`
- `idx_audits_auditor_id`
- `idx_audits_status`
- `idx_audits_scheduled_date`

---

## 4.11 Tabela: `committee_decisions`

Decisoes do comite tecnico.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da decisao |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `decision_type` | ENUM | NOT NULL | aprovar, reprovar, solicitar_info |
| `justification` | TEXT | NOT NULL | Justificativa |
| `requested_info` | TEXT | NULL | Informacao solicitada |
| `voted_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data da votacao |
| `decided_by` | VARCHAR(255) | NOT NULL | Nome do gestor |

**Indices**:
- `idx_committee_decisions_process_id`

---

## 4.12 Tabela: `certificates`

Certificados Halal emitidos.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do certificado |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `certification_id` | UUID | FK certifications(id), NULL | Certificacao |
| `issued_by_id` | UUID | FK users(id), NULL | Quem emitiu |
| `certificate_number` | VARCHAR(50) | UNIQUE, NOT NULL | 'HS-2026-00001' |
| `version` | INTEGER | NOT NULL, DEFAULT 1 | Versao (renovacoes) |
| `status` | ENUM | NOT NULL | ativo, suspenso, cancelado, expirado |
| `issued_at` | TIMESTAMP | NOT NULL | Data de emissao |
| `expires_at` | TIMESTAMP | NOT NULL | Data de expiracao |
| `pdf_url` | TEXT | NOT NULL | URL do PDF |
| `qr_code_url` | TEXT | NOT NULL | URL do QR Code |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_certificates_process_id`
- `idx_certificates_certification_id`
- `idx_certificates_certificate_number`
- `idx_certificates_status`

---

## 4.13 Tabela: `ai_analyses`

Analises realizadas por IA.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da analise |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `analysis_type` | ENUM | NOT NULL | pre_auditoria, risco, chatbot |
| `status` | ENUM | NOT NULL | pendente, concluido, erro |
| `result` | JSONB | NULL | Resultado da analise |
| `confidence` | FLOAT | NULL | 0.0 - 1.0 |
| `executed_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de execucao |
| `completed_at` | TIMESTAMP | NULL | Data de conclusao |

**Indices**:
- `idx_ai_analyses_process_id`
- `idx_ai_analyses_analysis_type`

---

## 4.14 Tabela: `knowledge_base`

Base de conhecimento para RAG.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do documento |
| `content` | TEXT | NOT NULL | Conteudo |
| `metadata` | JSONB | NOT NULL | {source, category, tags, author} |
| `embedding` | VECTOR(1536) | NULL | Embedding pgvector |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

---

## 4.15 Tabela: `chat_messages`

Mensagens do chatbot.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da mensagem |
| `user_id` | UUID | FK users(id), NOT NULL | Usuario |
| `role` | ENUM | NOT NULL | user, assistant, system |
| `content` | TEXT | NOT NULL | Conteudo |
| `metadata` | JSONB | NULL | {sources: [], confidence: number} |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_chat_messages_user_id`
- `idx_chat_messages_created_at`

---

## 4.16 Tabela: `notifications`

Notificacoes em tempo real.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da notificacao |
| `user_id` | UUID | FK users(id), NOT NULL | Usuario |
| `type` | ENUM | NOT NULL | info, warning, error, success |
| `title` | VARCHAR(255) | NOT NULL | Titulo |
| `message` | TEXT | NOT NULL | Mensagem |
| `link` | VARCHAR(255) | NULL | Link de acao |
| `read_at` | TIMESTAMP | NULL | Data de leitura |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_notifications_user_id`
- `idx_notifications_read_at`

---

## 4.17 Tabela: `audit_trail`

Log de auditoria completo (ISO 17065).

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do log |
| `entity` | ENUM | NOT NULL | process, contract, certificate, audit, document, user, company |
| `entity_id` | UUID | NOT NULL | ID da entidade |
| `action` | ENUM | NOT NULL | create, update, delete, approve, reject, sign, cancel |
| `user_id` | UUID | FK users(id), NOT NULL | Usuario que executou |
| `changes` | JSONB | NULL | {before: {}, after: {}} |
| `ip_address` | VARCHAR(45) | NULL | Endereco IP |
| `user_agent` | TEXT | NULL | User agent |
| `created_at` | TIMESTAMP | NOT NULL | Data da acao |

**Indices**:
- `idx_audit_trail_entity_id`
- `idx_audit_trail_user_id`
- `idx_audit_trail_created_at`

---

## 4.18 Tabela: `comments`

Comentarios em processos.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do comentario |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `user_id` | UUID | FK users(id), NOT NULL | Autor |
| `content` | TEXT | NOT NULL | Conteudo |
| `mentions` | TEXT[] | DEFAULT [] | IDs de usuarios mencionados |
| `is_internal` | BOOLEAN | NOT NULL, DEFAULT false | Interno (nao visivel ao cliente) |
| `edited_at` | TIMESTAMP | NULL | Data de edicao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_comments_process_id`
- `idx_comments_user_id`
- `idx_comments_created_at`

---

## 4.19 Tabela: `process_phase_history`

Historico de fases do processo.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do historico |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `phase` | INTEGER | NOT NULL | Fase (1-12) |
| `entered_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Entrada na fase |
| `exited_at` | TIMESTAMP | NULL | Saida da fase |
| `days_in_phase` | INTEGER | NULL | Dias na fase |

**Indices**:
- `idx_process_phase_history_process_id`

---

## 4.20 Tabela: `process_history`

Historico de mudancas de status.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do historico |
| `process_id` | UUID | FK processes(id), NOT NULL | Processo |
| `status` | ENUM | NOT NULL | Status do processo |
| `notes` | TEXT | NULL | Notas |
| `changed_by` | UUID | FK users(id), NOT NULL | Quem alterou |
| `created_at` | TIMESTAMP | NOT NULL | Data da alteracao |

**Indices**:
- `idx_process_history_process_id`
- `idx_process_history_created_at`

---

## 4.21 Tabela: `industrial_groups`

Grupos industriais GSO 2055-2.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do grupo |
| `code` | VARCHAR(1) | UNIQUE, NOT NULL | A, B, C, D |
| `name` | VARCHAR(255) | NOT NULL | Nome em portugues |
| `name_en` | VARCHAR(255) | NULL | Nome em ingles |
| `name_ar` | VARCHAR(255) | NULL | Nome em arabe |
| `description` | TEXT | NOT NULL | Descricao |
| `description_en` | TEXT | NULL | Descricao em ingles |
| `description_ar` | TEXT | NULL | Descricao em arabe |
| `icon` | VARCHAR(10) | NULL | Emoji ou icon |
| `display_order` | INTEGER | NOT NULL, DEFAULT 0 | Ordem de exibicao |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativo |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_industrial_groups_code`
- `idx_industrial_groups_is_active`

---

## 4.22 Tabela: `industrial_categories`

Categorias industriais GSO 2055-2.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da categoria |
| `group_id` | UUID | FK industrial_groups(id), NOT NULL | Grupo |
| `code` | VARCHAR(10) | UNIQUE, NOT NULL | AI, AII, BI, etc |
| `name` | VARCHAR(255) | NOT NULL | Nome em portugues |
| `name_en` | VARCHAR(255) | NULL | Nome em ingles |
| `name_ar` | VARCHAR(255) | NULL | Nome em arabe |
| `description` | TEXT | NULL | Descricao |
| `description_en` | TEXT | NULL | Descricao em ingles |
| `description_ar` | TEXT | NULL | Descricao em arabe |
| `audit_days` | FLOAT | NULL | Tempo de auditoria em dias |
| `display_order` | INTEGER | NOT NULL, DEFAULT 0 | Ordem de exibicao |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativo |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_industrial_categories_group_id`
- `idx_industrial_categories_code`
- `idx_industrial_categories_is_active`

---

## 4.23 Tabela: `industrial_subcategories`

Subcategorias industriais GSO 2055-2.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da subcategoria |
| `category_id` | UUID | FK industrial_categories(id), NOT NULL | Categoria |
| `code` | VARCHAR(10) | NOT NULL | Codigo |
| `name` | VARCHAR(255) | NOT NULL | Nome em portugues |
| `name_en` | VARCHAR(255) | NULL | Nome em ingles |
| `name_ar` | VARCHAR(255) | NULL | Nome em arabe |
| `description` | TEXT | NULL | Descricao |
| `description_en` | TEXT | NULL | Descricao em ingles |
| `description_ar` | TEXT | NULL | Descricao em arabe |
| `examples` | TEXT[] | DEFAULT [] | Exemplos de atividades |
| `examples_en` | TEXT[] | DEFAULT [] | Exemplos em ingles |
| `examples_ar` | TEXT[] | DEFAULT [] | Exemplos em arabe |
| `display_order` | INTEGER | NOT NULL, DEFAULT 0 | Ordem de exibicao |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativo |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_industrial_subcategories_category_id`
- `idx_industrial_subcategories_code`
- `idx_industrial_subcategories_is_active`
- UNIQUE(`category_id`, `code`)

---

## 4.24 Tabela: `pricing_tables`

Tabelas de precos.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da tabela |
| `version` | VARCHAR(20) | NOT NULL | v1.0, v1.1, etc |
| `effective_from` | TIMESTAMP | NOT NULL | Inicio da vigencia |
| `effective_to` | TIMESTAMP | NULL | Fim da vigencia |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativa |
| `base_prices` | JSONB | NOT NULL | Precos base por tipo |
| `product_multipliers` | JSONB | NOT NULL | Multiplicadores por qtd produtos |
| `shift_multipliers` | JSONB | NOT NULL | Multiplicadores por turnos |
| `history_multipliers` | JSONB | NOT NULL | Multiplicadores por historico |
| `supplier_multipliers` | JSONB | NOT NULL | Multiplicadores por fornecedores |
| `man_hour_rates` | JSONB | NOT NULL | Taxas de homem-hora |
| `travel_costs` | JSONB | NOT NULL | Custos de deslocamento |
| `accommodation_cost` | DECIMAL(10,2) | NOT NULL | Custo de hospedagem |
| `document_analysis_fee` | DECIMAL(10,2) | NOT NULL | Taxa de analise documental |
| `committee_fee` | DECIMAL(10,2) | NOT NULL | Taxa de comite |
| `issuance_fee` | DECIMAL(10,2) | NOT NULL | Taxa de emissao |
| `tax_rate` | DECIMAL(5,2) | NOT NULL | Taxa de imposto (%) |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_pricing_tables_is_active`
- `idx_pricing_tables_effective_from`

---

## 4.25 Tabela: `proposals`

Propostas comerciais.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da proposta |
| `process_id` | UUID | FK processes(id), UNIQUE, NOT NULL | Processo |
| `certification_id` | UUID | FK certifications(id), NULL | Certificacao |
| `pricing_table_id` | UUID | FK pricing_tables(id), NOT NULL | Tabela de precos |
| `calculation_inputs` | JSONB | NOT NULL | Inputs do calculo |
| `breakdown` | JSONB | NOT NULL | Detalhamento do calculo |
| `total_value` | DECIMAL(10,2) | NOT NULL | Valor total |
| `manual_adjustment` | DECIMAL(10,2) | NULL, DEFAULT 0 | Ajuste manual |
| `adjustment_reason` | TEXT | NULL | Motivo do ajuste |
| `adjusted_by` | UUID | FK users(id), NULL | Quem ajustou |
| `final_value` | DECIMAL(10,2) | NOT NULL | Valor final |
| `status` | ENUM | NOT NULL, DEFAULT rascunho | rascunho, calculada, enviada, aceita, recusada, expirada |
| `valid_until` | TIMESTAMP | NULL | Validade |
| `pdf_url` | TEXT | NULL | URL do PDF |
| `pdf_generated_at` | TIMESTAMP | NULL | Data de geracao do PDF |
| `sent_at` | TIMESTAMP | NULL | Data de envio |
| `responded_at` | TIMESTAMP | NULL | Data de resposta |
| `response_notes` | TEXT | NULL | Notas da resposta |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_proposals_process_id`
- `idx_proposals_certification_id`
- `idx_proposals_status`
- `idx_proposals_valid_until`

---

## 4.26 Tabela: `certifications`

Certificacoes (nova estrutura central).

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da certificacao |
| `company_id` | UUID | FK companies(id), NOT NULL | Empresa |
| `plant_id` | UUID | FK plants(id), NULL | Planta/instalacao |
| `certification_number` | VARCHAR(50) | UNIQUE, NULL | HS-2026-001 |
| `certification_type` | ENUM | NOT NULL | Tipo de certificacao |
| `industrial_group_id` | UUID | FK, NULL | Grupo industrial |
| `industrial_category_id` | UUID | FK, NULL | Categoria industrial |
| `industrial_subcategory_id` | UUID | FK, NULL | Subcategoria industrial |
| `status` | ENUM | NOT NULL, DEFAULT em_solicitacao | em_solicitacao, ativa, suspensa, cancelada, expirada, recusada |
| `valid_from` | TIMESTAMP | NULL | Inicio da validade |
| `valid_until` | TIMESTAMP | NULL | Fim da validade |
| `analyst_id` | UUID | FK users(id), NULL | Analista responsavel |
| `suspension_type` | ENUM | NULL | normal (3 meses), entressafra (1 ano) |
| `suspended_at` | TIMESTAMP | NULL | Data de suspensao |
| `max_suspension_date` | TIMESTAMP | NULL | Data maxima de suspensao |
| `suspension_reason` | TEXT | NULL | Motivo da suspensao |
| `cancellation_type` | ENUM | NULL | pos_suspensao, distrato |
| `cancelled_at` | TIMESTAMP | NULL | Data de cancelamento |
| `cancellation_reason` | TEXT | NULL | Motivo do cancelamento |
| `rejected_at` | TIMESTAMP | NULL | Data de rejeicao |
| `rejection_reason` | TEXT | NULL | Motivo da rejeicao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_certifications_company_id`
- `idx_certifications_plant_id`
- `idx_certifications_status`
- `idx_certifications_valid_until`
- `idx_certifications_certification_number`
- `idx_certifications_analyst_id`

---

## 4.27 Tabela: `certification_scopes`

Escopo das certificacoes.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do escopo |
| `certification_id` | UUID | FK certifications(id), UNIQUE, NOT NULL | Certificacao |
| `description` | TEXT | NULL | Descricao |
| `production_capacity` | VARCHAR(255) | NULL | Capacidade de producao |
| `num_employees` | INTEGER | NULL | Numero de funcionarios |
| `num_shifts` | INTEGER | NULL | Numero de turnos |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

---

## 4.28 Tabela: `scope_products`

Produtos no escopo da certificacao.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do produto |
| `scope_id` | UUID | FK certification_scopes(id), NOT NULL | Escopo |
| `name` | VARCHAR(255) | NOT NULL | Nome do produto |
| `description` | TEXT | NULL | Descricao |
| `category` | VARCHAR(255) | NULL | Categoria |
| `origin` | ENUM | NULL | animal, vegetal, misto, quimico |
| `status` | ENUM | NOT NULL, DEFAULT ativo | ativo, pendente, removido |
| `added_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de adicao |
| `removed_at` | TIMESTAMP | NULL | Data de remocao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_scope_products_scope_id`
- `idx_scope_products_status`

---

## 4.29 Tabela: `scope_facilities`

Instalacoes no escopo da certificacao.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da instalacao |
| `scope_id` | UUID | FK certification_scopes(id), NOT NULL | Escopo |
| `name` | VARCHAR(255) | NULL | Nome |
| `address` | TEXT | NOT NULL | Endereco |
| `city` | VARCHAR(100) | NULL | Cidade |
| `state` | VARCHAR(100) | NULL | Estado |
| `country` | VARCHAR(100) | NULL | Pais |
| `postal_code` | VARCHAR(20) | NULL | CEP |
| `facility_type` | VARCHAR(100) | NULL | Tipo (fabrica, armazem, etc) |
| `status` | ENUM | NOT NULL, DEFAULT ativo | ativo, pendente, removido |
| `added_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de adicao |
| `removed_at` | TIMESTAMP | NULL | Data de remocao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_scope_facilities_scope_id`
- `idx_scope_facilities_status`

---

## 4.30 Tabela: `scope_brands`

Marcas no escopo da certificacao.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da marca |
| `scope_id` | UUID | FK certification_scopes(id), NOT NULL | Escopo |
| `name` | VARCHAR(255) | NOT NULL | Nome da marca |
| `logo_url` | TEXT | NULL | URL do logo |
| `status` | ENUM | NOT NULL, DEFAULT ativo | ativo, pendente, removido |
| `added_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de adicao |
| `removed_at` | TIMESTAMP | NULL | Data de remocao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_scope_brands_scope_id`
- `idx_scope_brands_status`

---

## 4.31 Tabela: `scope_suppliers`

Fornecedores no escopo da certificacao.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do fornecedor |
| `scope_id` | UUID | FK certification_scopes(id), NOT NULL | Escopo |
| `name` | VARCHAR(255) | NOT NULL | Nome |
| `cnpj` | VARCHAR(20) | NULL | CNPJ |
| `ingredient_type` | VARCHAR(255) | NULL | Tipo de ingrediente |
| `has_halal_certificate` | BOOLEAN | NOT NULL, DEFAULT false | Possui certificado Halal |
| `status` | ENUM | NOT NULL, DEFAULT ativo | ativo, pendente, removido |
| `added_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de adicao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_scope_suppliers_scope_id`
- `idx_scope_suppliers_status`

---

## 4.32 Tabela: `certification_requests`

Solicitacoes vinculadas a certificacao.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da solicitacao |
| `certification_id` | UUID | FK certifications(id), NOT NULL | Certificacao |
| `protocol` | VARCHAR(50) | UNIQUE, NULL | REQ-20260120-00001 |
| `request_type` | ENUM | NOT NULL | nova, renovacao, manutencao, ajuste |
| `status` | ENUM | NOT NULL, DEFAULT rascunho | Status |
| `submitted_at` | TIMESTAMP | NULL | Data de envio |
| `completed_at` | TIMESTAMP | NULL | Data de conclusao |
| `reviewer_id` | UUID | FK users(id), NULL | Revisor |
| `reviewed_at` | TIMESTAMP | NULL | Data de revisao |
| `review_notes` | TEXT | NULL | Notas de revisao |
| `rejection_reason` | TEXT | NULL | Motivo de rejeicao |
| `change_description` | TEXT | NULL | Descricao da mudanca |
| `change_type` | VARCHAR(100) | NULL | Tipo de mudanca |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_certification_requests_certification_id`
- `idx_certification_requests_status`
- `idx_certification_requests_request_type`
- `idx_certification_requests_protocol`

---

## 4.33 Tabela: `request_workflows`

Workflows das solicitacoes de certificacao.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do workflow |
| `request_id` | UUID | FK certification_requests(id), UNIQUE, NOT NULL | Solicitacao |
| `current_phase` | ENUM | NOT NULL, DEFAULT cadastro_solicitacao | Fase atual |
| `status` | ENUM | NOT NULL, DEFAULT rascunho | Status |
| `priority` | ENUM | NOT NULL, DEFAULT media | Prioridade |
| `analyst_id` | UUID | FK users(id), NULL | Analista |
| `auditor_id` | UUID | FK users(id), NULL | Auditor |
| `days_in_phase` | INTEGER | NOT NULL, DEFAULT 0 | Dias na fase |
| `estimated_end` | TIMESTAMP | NULL | Previsao de conclusao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_request_workflows_request_id`
- `idx_request_workflows_status`
- `idx_request_workflows_current_phase`
- `idx_request_workflows_analyst_id`
- `idx_request_workflows_auditor_id`

---

## 4.34 Tabela: `certification_history`

Historico da certificacao (timeline).

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do historico |
| `certification_id` | UUID | FK certifications(id), NOT NULL | Certificacao |
| `action` | VARCHAR(100) | NOT NULL | Acao realizada |
| `action_description` | TEXT | NULL | Descricao da acao |
| `request_id` | UUID | NULL | ID da solicitacao |
| `document_id` | UUID | NULL | ID do documento |
| `audit_id` | UUID | NULL | ID da auditoria |
| `certificate_id` | UUID | NULL | ID do certificado |
| `performed_by` | UUID | FK users(id), NULL | Quem realizou |
| `metadata` | JSONB | NULL | Metadados |
| `performed_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data da acao |

**Indices**:
- `idx_certification_history_certification_id`
- `idx_certification_history_action`
- `idx_certification_history_performed_at`

---

## 4.35 Tabela: `shared_suppliers`

Fornecedores compartilhados do grupo.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do fornecedor |
| `group_id` | UUID | FK company_groups(id), NOT NULL | Grupo |
| `name` | VARCHAR(255) | NOT NULL | Nome |
| `document` | VARCHAR(20) | NULL | CNPJ |
| `contact_name` | VARCHAR(255) | NULL | Nome do contato |
| `contact_email` | VARCHAR(255) | NULL | Email |
| `contact_phone` | VARCHAR(50) | NULL | Telefone |
| `products` | TEXT[] | DEFAULT [] | Produtos fornecidos |
| `status` | ENUM | NOT NULL, DEFAULT pending | pending, approved, rejected, suspended |
| `approved_at` | TIMESTAMP | NULL | Data de aprovacao |
| `approved_by` | UUID | NULL | Quem aprovou |
| `halal_certificate_url` | TEXT | NULL | URL do certificado Halal |
| `halal_certificate_expiry` | TIMESTAMP | NULL | Validade do certificado |
| `added_by` | UUID | NOT NULL | Quem adicionou |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_shared_suppliers_group_id`
- `idx_shared_suppliers_status`
- `idx_shared_suppliers_document`

---

## 4.36 Tabela: `corporate_documents`

Documentos corporativos do grupo.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do documento |
| `group_id` | UUID | FK company_groups(id), NOT NULL | Grupo |
| `name` | VARCHAR(255) | NOT NULL | Nome |
| `description` | TEXT | NULL | Descricao |
| `category` | ENUM | NOT NULL | bpf, appcc, procedimento, manual, politica, outro |
| `file_url` | TEXT | NOT NULL | URL do arquivo |
| `file_name` | VARCHAR(255) | NOT NULL | Nome do arquivo |
| `file_size` | INTEGER | NOT NULL | Tamanho em bytes |
| `mime_type` | VARCHAR(100) | NOT NULL | Tipo MIME |
| `valid_until` | TIMESTAMP | NULL | Validade |
| `version` | VARCHAR(20) | NULL | Versao |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativo |
| `uploaded_by` | UUID | NOT NULL | Quem enviou |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_corporate_documents_group_id`
- `idx_corporate_documents_category`
- `idx_corporate_documents_is_active`

---

## 4.37 Tabela: `user_invites`

Convites de usuarios.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do convite |
| `company_id` | UUID | NOT NULL | Empresa |
| `email` | VARCHAR(255) | NOT NULL | Email do convidado |
| `name` | VARCHAR(255) | NULL | Nome |
| `role` | ENUM | NOT NULL, DEFAULT empresa | Role |
| `token` | VARCHAR(100) | UNIQUE, NOT NULL | Token do convite |
| `status` | ENUM | NOT NULL, DEFAULT pending | pending, accepted, expired, cancelled |
| `expires_at` | TIMESTAMP | NOT NULL | Validade |
| `invited_by` | UUID | NOT NULL | Quem convidou |
| `accepted_at` | TIMESTAMP | NULL | Data de aceite |
| `accepted_by_id` | UUID | NULL | User ID que aceitou |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_user_invites_company_id`
- `idx_user_invites_email`
- `idx_user_invites_token`
- `idx_user_invites_status`
- `idx_user_invites_expires_at`

---

## 4.38 Tabela: `access_requests`

Solicitacoes de acesso.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da solicitacao |
| `company_id` | UUID | NOT NULL | Empresa |
| `user_id` | UUID | NOT NULL | Usuario |
| `message` | TEXT | NULL | Mensagem |
| `status` | ENUM | NOT NULL, DEFAULT pending | pending, approved, rejected |
| `responded_at` | TIMESTAMP | NULL | Data de resposta |
| `responded_by` | UUID | NULL | Quem respondeu |
| `response_message` | TEXT | NULL | Mensagem de resposta |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_access_requests_company_id`
- `idx_access_requests_user_id`
- `idx_access_requests_status`
- UNIQUE(`company_id`, `user_id`)

---

## 4.39 Tabela: `e_signature_configs`

Configuracoes de assinatura eletronica.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da config |
| `company_id` | UUID | NULL | Empresa (null = global) |
| `provider` | ENUM | NOT NULL | clicksign, d4sign, docusign, adobe_sign, custom, none |
| `api_key` | TEXT | NULL | API key |
| `api_secret` | TEXT | NULL | API secret |
| `webhook_url` | TEXT | NULL | URL do webhook |
| `config` | JSONB | NULL | Configuracoes especificas |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativa |
| `is_default` | BOOLEAN | NOT NULL, DEFAULT false | Padrao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_e_signature_configs_company_id`
- `idx_e_signature_configs_provider`
- `idx_e_signature_configs_is_active`
- `idx_e_signature_configs_is_default`

---

## 4.40 Tabela: `signature_documents`

Documentos para assinatura.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do documento |
| `contract_id` | UUID | NOT NULL | Contrato |
| `config_id` | UUID | NOT NULL | Config usada |
| `provider_doc_id` | TEXT | NOT NULL | ID no provider |
| `signer_email` | VARCHAR(255) | NOT NULL | Email do signatario |
| `signer_name` | VARCHAR(255) | NOT NULL | Nome do signatario |
| `status` | ENUM | NOT NULL | pendente, assinado, recusado, expirado, cancelado, rejeitado |
| `signed_at` | TIMESTAMP | NULL | Data de assinatura |
| `refused_at` | TIMESTAMP | NULL | Data de recusa |
| `refusal_reason` | TEXT | NULL | Motivo da recusa |
| `expires_at` | TIMESTAMP | NULL | Validade |
| `webhook_events` | JSONB | NULL | Log de eventos |
| `signed_document_url` | TEXT | NULL | URL do doc assinado |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_signature_documents_contract_id`
- `idx_signature_documents_config_id`
- `idx_signature_documents_status`
- `idx_signature_documents_signer_email`

---

## 4.41 Tabela: `storage_configs`

Configuracoes de armazenamento.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da config |
| `provider` | ENUM | NOT NULL | s3, local, azure, gcp, cloudflare_r2 |
| `access_key` | TEXT | NULL | Chave de acesso |
| `secret_key` | TEXT | NULL | Chave secreta |
| `region` | VARCHAR(50) | NULL | Regiao |
| `bucket` | VARCHAR(255) | NULL | Nome do bucket |
| `endpoint` | TEXT | NULL | Endpoint customizado |
| `cdn_url` | TEXT | NULL | URL do CDN |
| `max_file_size` | INTEGER | DEFAULT 52428800 | Tamanho maximo (50MB) |
| `allowed_types` | TEXT[] | DEFAULT [...] | Tipos permitidos |
| `is_default` | BOOLEAN | NOT NULL, DEFAULT false | Padrao |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativo |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_storage_configs_provider`
- `idx_storage_configs_is_default`
- `idx_storage_configs_is_active`

---

## 4.42 Tabela: `company_buckets`

Buckets por empresa.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do bucket |
| `company_id` | UUID | UNIQUE, NOT NULL | Empresa |
| `bucket_name` | VARCHAR(255) | NOT NULL | Nome do bucket |
| `storage_config_id` | UUID | FK storage_configs(id), NOT NULL | Config de storage |
| `path` | VARCHAR(500) | NULL | Path/prefix |
| `quota` | BIGINT | NULL | Quota em bytes |
| `used_space` | BIGINT | NOT NULL, DEFAULT 0 | Espaco usado |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Ativo |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_company_buckets_bucket_name`
- `idx_company_buckets_storage_config_id`
- `idx_company_buckets_is_active`

---

## 4.43 Tabela: `cnpj_lookup_configs`

Configuracoes de consulta CNPJ.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID da config |
| `provider` | ENUM | NOT NULL | none, brasilapi, receitaws, cnpjws |
| `receitaws_token` | TEXT | NULL | Token ReceitaWS |
| `cnpjws_token` | TEXT | NULL | Token CNPJ.ws |
| `cache_enabled` | BOOLEAN | NOT NULL, DEFAULT true | Cache habilitado |
| `cache_duration_hours` | INTEGER | NOT NULL, DEFAULT 24 | Duracao do cache |
| `rate_limit_per_minute` | INTEGER | NOT NULL, DEFAULT 10 | Limite por minuto |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT false | Ativa |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |
| `updated_at` | TIMESTAMP | NOT NULL | Ultima atualizacao |

**Indices**:
- `idx_cnpj_lookup_configs_provider`
- `idx_cnpj_lookup_configs_is_active`

---

## 4.44 Tabela: `cnpj_lookup_cache`

Cache de consultas CNPJ.

| Coluna | Tipo | Constraints | Descricao |
|--------|------|-------------|-----------|
| `id` | UUID | PK, NOT NULL | ID do cache |
| `config_id` | UUID | FK cnpj_lookup_configs(id), NOT NULL | Config |
| `cnpj` | VARCHAR(14) | NOT NULL | CNPJ consultado |
| `data` | JSONB | NOT NULL | Dados retornados |
| `provider` | ENUM | NOT NULL | Provider usado |
| `expires_at` | TIMESTAMP | NOT NULL | Expiracao |
| `created_at` | TIMESTAMP | NOT NULL | Data de criacao |

**Indices**:
- `idx_cnpj_lookup_cache_cnpj`
- `idx_cnpj_lookup_cache_config_id`
- `idx_cnpj_lookup_cache_expires_at`
- UNIQUE(`cnpj`, `config_id`)

---

## 4.45 Enums do Sistema

### UserRole (12 roles)
```sql
admin, empresa, analista, auditor, gestor, comercial,
juridico, financeiro, gestor_auditoria, supervisor, controlador, secretaria
```

### RequestType (6 tipos)
```sql
nova, inicial, renovacao, ampliacao, manutencao, adequacao
```

### CertificationType (9 tipos)
```sql
C1, C2, C3, C4, C5, C6, produto, processo, servico
```

### RequestStatus (7 status)
```sql
rascunho, enviado, pendente, em_analise, aprovado, rejeitado, cancelado
```

### ProcessStatus (16 status)
```sql
rascunho, pendente, em_andamento, aguardando_documentos, analise_documental,
analise_tecnica, aguardando_auditoria, proposta_enviada, aguardando_assinatura,
em_auditoria, concluido, aprovado, reprovado, certificado, cancelado, suspenso
```

### ProcessPhase (17 fases)
```sql
cadastro_solicitacao, analise_documental_inicial, elaboracao_proposta,
negociacao_proposta, proposta_aprovada, elaboracao_contrato, assinatura_contrato,
avaliacao_documental, planejamento_auditoria, auditoria_estagio1, auditoria_estagio2,
analise_nao_conformidades, correcao_nao_conformidades, validacao_correcoes,
comite_tecnico, emissao_certificado, certificado_emitido
```

### DocumentType (15 tipos)
```sql
contrato_social, certidao_negativa, alvara_funcionamento, laudo_tecnico,
licenca_sanitaria, fotos, videos, laudos, manual_bpf, fluxograma_processo,
lista_fornecedores, certificado_ingredientes, analise_produto, rotulo_produto, outros
```

### AuditType (7 tipos)
```sql
inicial, estagio1, estagio2, vigilancia, renovacao, especial, follow_up
```

### CertificationStatus (6 status)
```sql
em_solicitacao, ativa, suspensa, cancelada, expirada, recusada
```

### StorageProvider (5 providers)
```sql
s3, local, azure, gcp, cloudflare_r2
```

### ESignatureProvider (6 providers)
```sql
clicksign, d4sign, docusign, adobe_sign, custom, none
```

---

**Ultima atualizacao**: 24 de Janeiro de 2026
