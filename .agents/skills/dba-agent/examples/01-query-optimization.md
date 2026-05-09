# Example 1: Query Optimization (PostgreSQL)

## Context

E-commerce platform. The `orders` table has 8M rows. A report query
listing pending orders with user data takes 12+ seconds.

## User Input

```
Essa query tá levando 12 segundos em produção. Segue o EXPLAIN ANALYZE:

SELECT o.id, o.created_at, o.total, u.email
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'pending'
ORDER BY o.created_at DESC
LIMIT 100;

EXPLAIN ANALYZE output:
Sort (cost=98432.15..98432.40 rows=100 width=64) (actual time=12031.4..12031.5 rows=100 loops=1)
  Sort Key: o.created_at DESC
  Sort Method: top-N heapsort  Memory: 42kB
  -> Hash Join (cost=18432.00..97831.00 rows=240000 width=64) (actual time=2341.2..11891.3 rows=240000 loops=1)
       Hash Cond: (o.user_id = u.id)
       -> Seq Scan on orders o (cost=0.00..71200.00 rows=240000 width=48) (actual time=0.08..8731.1 rows=240000 loops=1)
             Filter: (status = 'pending')
             Rows Removed by Filter: 7760000
       -> Hash (cost=5200.00..5200.00 rows=250000 width=24) (actual time=1201.3..1201.3 rows=250000 loops=1)
             Buckets: 262144  Batches: 2  Memory Usage: 8192kB
             -> Seq Scan on users u (cost=0.00..5200.00 rows=250000 width=24)
```

## Expected Agent Output

```
## 1. Diagnóstico
Dois seq scans: `orders` (8M rows, filtrando para 240k) e `users` (250k rows).
Sort ocorre após o join, sem índice de suporte para `status + created_at`.

## 2. Root Cause
- Ausência de índice em `orders(status, created_at)` força seq scan de 8M rows
- `users` não tem índice em `id`? Verificar — ou Hash Join está batendo no límite de memória
- work_mem provavelmente baixo (Hash Join usando 2 batches = spill para disco)

## 3. Query Plan Anotado
Sort ← PROBLEMA: sort de 240k rows sem índice de suporte
  -> Hash Join ← OK para 250k users, mas com memory spill
       -> Seq Scan on orders ← CRÍTICO: varrendo 8M rows para filtrar 240k (97% desperdiçado)
            Filter: status = 'pending'
            Rows Removed: 7,760,000 ← altíssimo waste
       -> Seq Scan on users ← Aceitável se não houver índice em id (PK já é indexed)

## 4. Impacto
- Leitura: 12s → estimado <80ms com índice + work_mem ajustado
- Escrita: ~8% overhead em INSERT/UPDATE em orders
- Memória: Hash Join está fazendo disk spill (2 batches) — ajustar work_mem

## 5. Recomendação

-- Índice composto com filtro parcial (apenas pending)
CREATE INDEX CONCURRENTLY idx_orders_pending_created
  ON orders (created_at DESC)
  WHERE status = 'pending';

-- Ajuste de work_mem para a sessão (ou globalmente se RAM permitir)
SET work_mem = '64MB';

-- Query reescrita (sem alteração necessária — índice resolve)

## 6. Trade-offs
✅ Leitura: eliminação do seq scan, query <80ms
✅ Partial index: só indexa 'pending' — menor que índice completo
⚠️  Escrita: overhead mínimo pois partial index só é atualizado quando status='pending'
⚠️  work_mem global pode aumentar consumo de RAM em conexões paralelas
❌ NÃO usar se 'pending' representar >30% da tabela (índice perde efetividade)

## 7. Rollback Plan
DROP INDEX CONCURRENTLY idx_orders_pending_created;
RESET work_mem;
```
