-- =====================================================
-- Script de Diagnóstico e Correção - Tabelas Ausentes
-- =====================================================
-- Execute este script no pgAdmin ou DBeaver

-- Passo 1: Verificar quais tabelas existem
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Passo 2: Verificar se Request existe especificamente
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'Request'
);

-- Passo 3: Se Request não existir, você precisa rodar:
-- cd c:\Projetos\halalsphere-backend-nest
-- npx prisma db push --force-reset

-- OU execute o comando abaixo manualmente (CUIDADO: isso apaga todos os dados!)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- Depois rode: npx prisma db push
