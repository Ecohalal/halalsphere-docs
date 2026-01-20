-- ============================================================================
-- MIGRATION: Adicionar coluna request_id à tabela documents
-- ============================================================================
-- Data: 2026-01-19
-- Descrição: Resolve o problema de vínculo entre documentos e solicitações
--            adicionando uma foreign key diretamente na tabela documents
-- ============================================================================

-- Verificar se a tabela documents existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'documents'
    ) THEN
        RAISE EXCEPTION 'Tabela documents não existe! Execute as migrations anteriores primeiro.';
    END IF;
END $$;

-- Verificar se a tabela requests existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'requests'
    ) THEN
        RAISE EXCEPTION 'Tabela requests não existe! Execute as migrations anteriores primeiro.';
    END IF;
END $$;

-- ============================================================================
-- STEP 1: Adicionar coluna request_id (nullable inicialmente)
-- ============================================================================

ALTER TABLE documents
ADD COLUMN IF NOT EXISTS request_id UUID;

COMMENT ON COLUMN documents.request_id IS 'ID da solicitação (request) à qual este documento está vinculado';

-- ============================================================================
-- STEP 2: Criar índice para performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_documents_request_id
ON documents(request_id);

-- ============================================================================
-- STEP 3: Adicionar foreign key constraint
-- ============================================================================

ALTER TABLE documents
ADD CONSTRAINT fk_documents_request_id
FOREIGN KEY (request_id)
REFERENCES requests(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- ============================================================================
-- STEP 4: Atualizar documentos existentes (se houver)
-- ============================================================================
-- ATENÇÃO: Este step tenta vincular documentos órfãos a requests existentes
-- baseado em alguma lógica de correspondência. Ajuste conforme necessário.

-- Exemplo: Se você tem uma tabela de processo que conecta documents e requests
-- UPDATE documents d
-- SET request_id = (
--     SELECT r.id
--     FROM requests r
--     INNER JOIN processes p ON p.request_id = r.id
--     WHERE p.id = d.process_id
--     LIMIT 1
-- )
-- WHERE d.request_id IS NULL;

-- Se não houver como vincular automaticamente, os documentos órfãos
-- permanecerão com request_id = NULL até serem processados manualmente

-- ============================================================================
-- STEP 5 (OPCIONAL): Tornar coluna NOT NULL após migração dos dados
-- ============================================================================
-- DESCOMENTE APÓS GARANTIR QUE TODOS OS DOCUMENTOS TENHAM request_id

-- ALTER TABLE documents
-- ALTER COLUMN request_id SET NOT NULL;

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================

-- Verificar estrutura da tabela
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'documents'
AND column_name = 'request_id';

-- Verificar constraints
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'documents'
AND tc.constraint_type = 'FOREIGN KEY'
AND kcu.column_name = 'request_id';

-- Contar documentos com e sem request_id
SELECT
    COUNT(*) FILTER (WHERE request_id IS NOT NULL) as com_request_id,
    COUNT(*) FILTER (WHERE request_id IS NULL) as sem_request_id,
    COUNT(*) as total
FROM documents;

-- ============================================================================
-- ROLLBACK (em caso de necessidade)
-- ============================================================================

-- Para reverter esta migration, execute:
/*
ALTER TABLE documents DROP CONSTRAINT IF EXISTS fk_documents_request_id;
DROP INDEX IF EXISTS idx_documents_request_id;
ALTER TABLE documents DROP COLUMN IF EXISTS request_id;
*/
