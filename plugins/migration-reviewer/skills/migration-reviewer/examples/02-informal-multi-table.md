# Example 2: Informal Description — Multi-Table Schema Change

## Context

FinTech platform. A product owner verbally describes a schema change during a stand-up. The developer relays it informally to the migration reviewer.

## User Input

```
Fala, preciso de um relatório pra aprovação. A gente precisa:
- tirar a coluna legacy_code da tabela transactions (ninguém usa mais)
- botar um campo discount_percentage decimal na tabela order_items
- criar um índice composto em orders (user_id, created_at)

É pra prod, PostgreSQL 14, tabela transactions tem uns 50M de linhas,
order_items uns 20M e orders uns 15M. Motivo é limpeza técnica + feature
de desconto que o time de pricing pediu.
```

## Expected Agent Behavior

### Phase 1: Parse
- Detects informal description
- Normalizes to SQL:
  ```sql
  ALTER TABLE transactions DROP COLUMN legacy_code;
  ALTER TABLE order_items ADD COLUMN discount_percentage DECIMAL(5,2);
  CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders (user_id, created_at DESC);
  ```

### Phase 2: Triage
Agent may ask:
1. "O campo `discount_percentage` pode ser NULL ou precisa de um DEFAULT?"
2. "Existem endpoints que ainda referenciam `legacy_code`?"
3. "O índice composto em `orders` é para suportar qual query específica?"

### Phase 3: Analyze
- 🔴 HIGH: `DROP COLUMN legacy_code` — irreversible data loss
- 🟢 LOW: `ADD COLUMN discount_percentage` — nullable, instant in PG 14
- 🟢 LOW: `CREATE INDEX CONCURRENTLY` — non-blocking

### Phase 5: Report

```markdown
**[DB Change] Remoção de coluna legada + campo de desconto + índice composto**

**Contexto**
Duas motivações combinadas: (1) limpeza técnica removendo a coluna `legacy_code` da tabela `transactions`, que não é mais utilizada por nenhum serviço; (2) suporte à nova feature de descontos solicitada pelo time de pricing, adicionando `discount_percentage` em `order_items`. Índice composto em `orders` para otimizar consultas por usuário ordenadas por data.

---

**Alteração proposta**
Três operações em três tabelas distintas no PostgreSQL 14.

```sql
-- 1. Remoção de coluna legada (DESTRUTIVA)
ALTER TABLE transactions DROP COLUMN legacy_code;

-- 2. Adição de campo de desconto (não destrutiva)
ALTER TABLE order_items ADD COLUMN discount_percentage DECIMAL(5,2);

-- 3. Criação de índice composto (não destrutiva)
CREATE INDEX CONCURRENTLY idx_orders_user_created
  ON orders (user_id, created_at DESC);
```

---

**Motivação / Nova lógica**
- Coluna `legacy_code` em `transactions` foi depreciada há 6+ meses e não é referenciada por nenhum endpoint ativo
- `discount_percentage` suporta a nova feature de precificação dinâmica do time de pricing
- Índice composto otimiza a query de listagem de pedidos por usuário, ordenados por data (tela principal do dashboard)

---

**Análise de Segurança**
- Risco de lock:
  - `DROP COLUMN`: 🟢 baixo (PG 14 — mark-only, dados removidos no VACUUM)
  - `ADD COLUMN`: 🟢 baixo (nullable, instant em PG 14)
  - `CREATE INDEX CONCURRENTLY`: 🟢 baixo (non-blocking)
- Estimativa de duração:
  - `DROP COLUMN`: instant
  - `ADD COLUMN`: instant
  - `CREATE INDEX CONCURRENTLY`: **5-15 minutos** (15M rows)
- Requer janela de manutenção: **não**
- Compatível com deploy zero-downtime: **sim**

---

**Impacto**
- Tabelas afetadas: `transactions`, `order_items`, `orders`
- Endpoints afetados: confirmar que nenhum endpoint usa `legacy_code`; endpoints de pricing usarão `discount_percentage`
- Destrutiva: **sim** (DROP COLUMN em `transactions` remove dados permanentemente)
- Rollback disponível: **parcial** (ver seção Rollback)

---

**Rollback**
```sql
-- Operação 1: NÃO reversível sem backup
-- ⚠️ Dados de legacy_code serão perdidos permanentemente
-- Para reverter: restaurar coluna vazia (dados perdidos)
ALTER TABLE transactions ADD COLUMN legacy_code VARCHAR(50);

-- Operação 2: Totalmente reversível
ALTER TABLE order_items DROP COLUMN discount_percentage;

-- Operação 3: Totalmente reversível
DROP INDEX CONCURRENTLY idx_orders_user_created;
```

---

**Recomendações do DBA**
- ⚠️ Antes de executar o `DROP COLUMN`, confirmar com 100% de certeza que nenhum serviço, job, ou relatório referencia `legacy_code`. Sugiro rodar: `grep -r "legacy_code" --include="*.ts" --include="*.js" --include="*.sql" .`
- Considerar backup da coluna antes do drop: `CREATE TABLE _backup_legacy_code AS SELECT id, legacy_code FROM transactions;`
- Executar as 3 operações em migrations separadas para rollback granular

---

Aguardo aprovação ou sugestões. :pray:
```
