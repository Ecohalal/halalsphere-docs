-- Query para verificar se o Request existe no banco
SELECT
  id,
  protocol,
  "companyId",
  "companyName",
  status,
  "createdAt"
FROM "Request"
WHERE id = '34e5e010-74d7-4369-9e7e-d9d094f1f240';

-- Ver todos os Requests recentes
SELECT
  id,
  protocol,
  "companyId",
  "companyName",
  status,
  "createdAt"
FROM "Request"
ORDER BY "createdAt" DESC
LIMIT 10;

-- Ver todos os Processes recentes
SELECT
  id,
  "requestId",
  status,
  "currentPhase",
  "createdAt"
FROM "Process"
ORDER BY "createdAt" DESC
LIMIT 10;
