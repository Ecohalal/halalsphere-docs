# Solução: Tabela Request Não Existe

## 🔴 Problema Identificado

A tabela `Request` não existe no banco de dados PostgreSQL!

**Erro:**
```
P1014: The underlying table for model `Request` does not exist.
```

Isso explica por que o upload de documentos falha com "Request not found" - **o Request nunca foi criado** porque a tabela não existe.

---

## ✅ Solução: Recriar Tabelas do Prisma

### Opção 1: Push do Schema (RECOMENDADA - Preserva dados)

```bash
cd c:\Projetos\halalsphere-backend-nest
npx prisma db push
```

**Se o comando dizer "already in sync" mas a tabela não existir,** force a recriação:

```bash
npx prisma db push --force-reset
```

**⚠️ ATENÇÃO:** `--force-reset` **APAGA TODOS OS DADOS** do banco!

---

### Opção 2: Migrations (Se houver migrations configuradas)

```bash
cd c:\Projetos\halalsphere-backend-nest
npx prisma migrate dev
```

---

### Opção 3: Verificar e Criar Manualmente

#### 1. Abrir DBeaver/pgAdmin

Conectar no banco `halalsphere` em `localhost:5432`

#### 2. Executar Query de Diagnóstico

```sql
-- Listar todas as tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

#### 3. Verificar se Request existe

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'Request'
) AS request_exists;
```

**Se retornar `false`**, a tabela não existe!

#### 4. Recriar Schema Completo

**⚠️ ISSO APAGA TODOS OS DADOS!**

```sql
-- Apagar schema atual
DROP SCHEMA public CASCADE;

-- Recriar schema
CREATE SCHEMA public;

-- Restaurar permissões
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Depois, volte ao terminal e rode:

```bash
cd c:\Projetos\halalsphere-backend-nest
npx prisma db push
```

---

##Human: acabei por executar prisma migrate dev