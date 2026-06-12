# SQL — Cleanup `\r\n` no legal_name de BRF/Nicolini

**Origem:** query de diagnóstico do autocomplete BRF (2026-05-14) revelou
1 linha com legal_name "BRF S.A.\r\nFRIGORÍFICO NICOLINI LTDA" — o script
de espelhamento `mirror-fambras-lists.ts` concatenou duas razões sociais
da mesma célula da FM 7.8.x.

**Impacto:** display feio no autocomplete e nas telas; quebra de linha
embutida polui qualquer renderização que não faça escape.

**Aplicar em:** prod (DBeaver). Operação idempotente — re-rodar é seguro.

---

## 1. ANTES — confirmar a linha-alvo

```sql
SELECT id, legal_name, tax_id, country, group_id
FROM companies
WHERE legal_name LIKE E'%\r\n%' OR legal_name LIKE E'%\n%';
```

**Esperado antes:** 1 linha — `97b37276-64a9-5849-8257-859114f2b869`
(BRF S.A. / Frigorífico Nicolini, tax_id `89751036000110`).

> Se mais linhas aparecerem, ajustar o UPDATE individualmente — pode
> haver outros casos não detectados ainda.

---

## 2. APLICAR — normalizar legal_name

### 2.1 Caso específico Nicolini (recomendado — controle manual)

```sql
UPDATE companies
SET legal_name = 'BRF S.A. - Frigorífico Nicolini Ltda'
WHERE id = '97b37276-64a9-5849-8257-859114f2b869';
```

### 2.2 Alternativa genérica (se quiser pegar todos os casos de uma vez)

```sql
UPDATE companies
SET legal_name = REGEXP_REPLACE(legal_name, E'[\r\n]+', ' - ', 'g')
WHERE legal_name ~ E'[\r\n]';
```

> A versão genérica troca qualquer `\r\n`/`\n` por ` - `. Se você
> preferir só remover (sem o separador), use `' '` em vez de `' - '`.

---

## 3. DEPOIS — confirmar limpeza

```sql
SELECT id, legal_name, tax_id
FROM companies
WHERE legal_name LIKE E'%\r\n%' OR legal_name LIKE E'%\n%';
```

**Esperado depois:** 0 linhas.

```sql
SELECT id, legal_name, tax_id
FROM companies
WHERE id = '97b37276-64a9-5849-8257-859114f2b869';
```

**Esperado:** legal_name = `BRF S.A. - Frigorífico Nicolini Ltda` (sem
quebras de linha).

---

## 4. Notas

- Esse cleanup é cosmético — não afeta integridade referencial nem PDFs
  já emitidos (os 3 manuais carimbaram o legal_name no momento da emissão).
- Os 12 certs mirror amarrados a essa company seguem com `mirroredFromName`
  apontando para a string original da FM 7.8.x — isso é audit trail e
  fica intocado.
- Se mais casos forem detectados em queries futuras, adicionar nesta
  doc antes de aplicar.
