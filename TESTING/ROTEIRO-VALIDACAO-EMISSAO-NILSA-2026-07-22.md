# Roteiro de Validação — Emissão Manual de Certificado (deploy 22/jul)

> **Para:** Nilsa (QA) · **Sistema:** GC — Gestão de Certificações · **Tela:** `/analista/emissao-manual-certificado`
> **O que mudou:** correções dos apontamentos dos testes FAMBRAS de 20/jul (Giovanna/William/Soha)
> + fundação de imutabilidade do certificado (ISO 17065).
> **Como reportar:** para cada teste, marcar ✅/❌ + print quando ❌. Mandar direto no grupo — não precisa esperar reunião.
> ⚠️ Prod é tratada como homologação — pode emitir certificado de teste à vontade.

---

## T1 — UAE.S sozinha NÃO é mais "Sem norma acreditada"
1. Emissão manual → seção **Normas de Reconhecimento** → marcar **somente UAE.S**.
2. **Esperado:** a "Norma Principal" derivada **NÃO** mostra mais *"Sem norma acreditada (GSO/SMIIC)"* (antes mostrava). Deve tratar como norma acreditada (família GSO).
- [ ] ✅ / ❌

## T2 — GSO não sai mais como "2055-2" na linha de normas
1. Emitir um certificado com **GSO** marcada (qualquer tipo industrial, ex.: Único — Industrial).
2. Abrir o PDF → bloco **Requirements**.
3. **Esperado:** a linha de norma traz **GSO 2055-1/2015** (nunca "2055-2"). O **selo GAC** (canto superior direito) continua com "GSO 2055-2:2021" — **isso é correto**, é a norma do organismo certificador, não do produto.
- [ ] ✅ / ❌

## T3 — Preset frigorífico respeita as normas marcadas (era o "sai Indonésia sem pedir")
1. Escolher uma planta **frigorífico** → Tipo habilitação (FM 7.7.1).
2. Em Normas, marcar **só GSO e UAE.S**.
3. Emissão → **"Vários por grupo de normas (frigorífico)"** → **Aplicar preset**.
4. **Esperado:** só aparece(m) grupo(s) com GSO/UAE.S. **NÃO** aparecem grupos de Indonésia (BPJPH), Malásia (MS) nem Turquia (OIC/SMIIC) se não foram marcadas.
5. Repetir marcando **todas** as normas → aí sim o preset monta todos os grupos da espécie (bovino = 3, aves = 5).
- [ ] ✅ / ❌

## T4 — Único em frigorífico BLOQUEIA normas de grupos diferentes
1. Planta frigorífico **bovino**, Tipo habilitação, emissão **"Único (todos os produtos juntos)"**.
2. Marcar **GSO + BPJPH** (grupos de habilitação diferentes).
3. **Esperado:** ao tentar emitir, **bloqueia** com mensagem orientando usar "Vários por grupo de normas".
4. Agora marcar **GSO + UAE.S** (mesmo grupo `.1` em bovino) → **Esperado: deixa emitir** normal.
5. **Industrial (FM 7.7.2)** com várias normas → **Esperado: SEM bloqueio** (industrial combina tudo num certificado — é o modelo correto).
- [ ] ✅ / ❌

## T5 — Checkbox de carmim/conchonilha (E120) + aviso
1. Emissão **industrial** (Único — Industrial, DT 7.1) → na seção do Tipo, marcar **"Produto contém corante carmim/conchonilha (E120)"**.
2. Marcar normas **GSO** e/ou **UAE.S** → emitir.
3. **Esperado:** o certificado é emitido, e na tela de sucesso aparece um **banner âmbar de atenção** dizendo que GSO/UAE **rejeitam** produtos com este ingrediente (é aviso, não trava — decisão de produto).
4. Repetir com normas **BPJPH/MUIS/MS** (Ásia Amarela) → **Esperado: SEM aviso**.
- [ ] ✅ / ❌

## T6 — Reimpressão não muda o conteúdo (imutabilidade)
1. Emitir um certificado qualquer e **baixar o PDF**.
2. Na lista de certificados, **Imprimir/baixar o MESMO certificado de novo** (2ª vez).
3. **Esperado:** o conteúdo (normas, produtos, categoria, datas) é **idêntico** nas duas impressões. *(Por baixo: a 1ª impressão "congela" o conteúdo; a 2ª sai do congelado.)*
- [ ] ✅ / ❌

## T7 — Regressões rápidas (não deve ter quebrado)
- [ ] Emissão simples industrial (1 norma, 2 produtos) sai normal, PDF abre.
- [ ] Emissão com **destino marcado** (seção 6, ex.: Indonésia) segue listando as normas do catálogo.
- [ ] Busca por **SIF** no seletor de planta segue funcionando.
- [ ] PDF continua **bloqueando cópia de texto** mas abrindo sem senha.

---

## Parte do Renato (SQL — 5 min, DBeaver `postgres`/GC)
```sql
-- 3 migrations de hoje aplicadas:
SELECT migration_name, finished_at FROM _prisma_migrations
 WHERE migration_name LIKE '20260722%' ORDER BY 1;

-- Snapshots congelando (após os testes T6 da Nilsa):
SELECT certificate_number, resolved_scope_snapshot->>'source' AS origem
  FROM certificates WHERE resolved_scope_snapshot IS NOT NULL ORDER BY created_at DESC;

-- Tabelas novas de ingrediente (seed conchonilha = 1 ingrediente + 5 regras):
SELECT i.code, r.standard, r.accepted
  FROM restricted_ingredients i JOIN restricted_ingredient_standard_rules r ON r.ingredient_id = i.id;

-- Reparos do catálogo: DT 7.5/7.6 interno com standards vazio + dt_only:
SELECT dt_code, market, dt_only, standards FROM certification_standards_by_market
 WHERE dt_only = true ORDER BY dt_code;
```

> **Fora do escopo desta validação:** layout fino do PDF (marca centralizada, datas alinhadas,
> Estado por extenso — G2/G4/W8/W9/W10/W14) ainda **não foi mexido**; textos EN de categoria
> aguardam entrega FAMBRAS. Não reportar esses como falha — já estão no backlog.
