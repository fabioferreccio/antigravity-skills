# Example 1: Knex Migration — Add NOT NULL Column to Large Table

## Context

E-commerce platform. Team needs to add a `phone` column to the `customers` table (8M rows) as part of a KYC compliance requirement. The migration was written by a junior developer.

## User Input

```
Preciso aprovar essa migration antes de ir pra prod:

exports.up = function(knex) {
  return knex.schema.alterTable('customers', function(table) {
    table.string('phone', 20).notNullable();
    table.index('phone');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('customers', function(table) {
    table.dropIndex('phone');
    table.dropColumn('phone');
  });
};
```

## Expected Agent Behavior

### Phase 1: Parse
- Detects Knex.js format
- Normalizes to SQL:
  ```sql
  ALTER TABLE customers ADD COLUMN phone VARCHAR(20) NOT NULL;
  CREATE INDEX idx_customers_phone ON customers (phone);
  ```

### Phase 2: Triage
Agent asks (in Portuguese):
1. "Qual o banco de dados e versão?"
2. "Qual o tamanho estimado da tabela `customers`?" (if not provided)
3. "Qual o motivo de negócio para essa mudança?"

### Phase 3: Analyze
- 🔴 HIGH: `NOT NULL` without `DEFAULT` on 8M row table
- 🟡 MEDIUM: Non-concurrent index creation
- Recommends 3-phase migration + CONCURRENTLY index

### Phase 5: Report

```markdown
**[DB Change] Adição de coluna `phone` (NOT NULL) na tabela `customers`**

**Contexto**
Requisito de compliance KYC exige que todos os clientes tenham telefone cadastrado. A coluna `phone` será adicionada à tabela `customers` para armazenar este dado obrigatório.

---

**Alteração proposta**
Adiciona coluna `phone VARCHAR(20) NOT NULL` e cria índice na tabela `customers` (estimativa: 8M registros).

```sql
-- SQL equivalente da migration Knex.js
ALTER TABLE customers ADD COLUMN phone VARCHAR(20) NOT NULL;
CREATE INDEX idx_customers_phone ON customers (phone);
```

---

**Motivação / Nova lógica**
- Compliance KYC requer telefone obrigatório para todos os clientes
- Campo será validado no cadastro e atualização de perfil
- Índice necessário para buscas por telefone no suporte ao cliente

---

**Análise de Segurança**
- Risco de lock: 🔴 **alto** — `NOT NULL` sem `DEFAULT` em tabela de 8M rows causa scan de validação + lock exclusivo
- Estimativa de duração: **5-30 minutos** de lock dependendo do hardware
- Requer janela de manutenção: **sim** (na migration original)
- Compatível com deploy zero-downtime: **não** (na migration original)

---

**Impacto**
- Tabelas afetadas: `customers`
- Endpoints afetados: a confirmar com o time (cadastro, perfil, busca de clientes)
- Destrutiva: **não**
- Rollback disponível: **sim**

---

**Rollback**
```sql
DROP INDEX IF EXISTS idx_customers_phone;
ALTER TABLE customers DROP COLUMN phone;
```

---

**Recomendações do DBA**
- ⚠️ **Não executar a migration como está** — risco de downtime significativo
- Recomendo migration em 3 fases (zero downtime):
  1. `ALTER TABLE customers ADD COLUMN phone VARCHAR(20);` (instant, nullable)
  2. Backfill em lotes: `UPDATE customers SET phone = '' WHERE phone IS NULL AND id BETWEEN :start AND :end;`
  3. `ALTER TABLE customers ALTER COLUMN phone SET NOT NULL;` (após backfill completo)
- Trocar `CREATE INDEX` por `CREATE INDEX CONCURRENTLY` para evitar lock de escrita
- Considerar valor DEFAULT para a fase de backfill que faça sentido para o negócio

---

Aguardo aprovação ou sugestões. :pray:
```
