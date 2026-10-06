# dba-agent

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

DBA Agent is a specialized cognitive system for diagnosing and resolving database performance, integrity, and security issues. It simulates an expert DBA's reasoning cycle — Observe → Reflect → Act → Evaluate — to produce evidence-based recommendations with full trade-off analysis and rollback plans.

Supports: PostgreSQL, MySQL/MariaDB, SQLite, and generic SQL dialects.

## When to Use

- You have a slow query and need EXPLAIN ANALYZE interpretation
- You need to design or review an index strategy
- You are reviewing a migration for safety and lock risk
- You suspect N+1 queries in your ORM layer
- You are experiencing deadlocks or lock contention
- You need to decide between partitioning vs sharding
- You want to audit a schema for normalization and constraint issues
- You are diagnosing replication lag

## When NOT to Use

- Infraestrutura de cloud/network (use infra-agent)
- Tuning de aplicação sem envolvimento de queries (use backend review)
- Problemas de rede ou latência externa ao banco

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install dba-agent
```

### Global (available everywhere)

```bash
npx antigravity install dba-agent --global
```

## Usage

This skill activates automatically when:

- User mentions slow queries, EXPLAIN plans, or query optimization
- User asks about indexes, partitioning, or sharding
- User shares a migration file for review
- User reports deadlocks or lock contention
- User asks for N+1 detection or ORM query analysis
- User says "diagnosticar banco", "tuning de banco", or "dba agent"

## Execution Modes

| Mode | When to Use |
|---|---|
| **Query Optimizer** | Slow query, high planner cost, seq scan |
| **Index Advisor** | Missing index, low selectivity, composite key decision |
| **Schema Reviewer** | DDL review, migration analysis, normalization |
| **Transaction Auditor** | Deadlock, lock contention, isolation level issue |
| **N+1 Detector** | ORM repeated selects, loop queries |
| **Partition Planner** | Large table, time-series, range queries |
| **Shard Architect** | Scale-out, hotspot, cross-region demand |
| **Migration Reviewer** | Schema change safety, lock risk assessment |
| **Replication Analyst** | Replica lag, read scaling, failover |
| **Full Diagnosis** | Broad context, "diagnosticar banco" |

## Examples

### Example 1: Slow Query Optimization

**User says**: "Essa query está levando 8 segundos. EXPLAIN ANALYZE: `Seq Scan on orders (cost=0.00..45231.00 rows=1200000 width=128) (actual time=0.05..7831.2 rows=1200000 loops=1)`"

**Agent does**:
1. Observes: full sequential scan on `orders`, 1.2M rows, no index used
2. Reflects: is there a WHERE clause? what is the cardinality of the filter column?
3. Acts: proposes composite index, rewrites query, annotates plan
4. Evaluates: estimated cost reduction, write overhead, rollback DDL

**Output structure**:
```
## 1. Diagnóstico
Seq scan em `orders` varrendo 1.2M linhas — nenhum índice está sendo utilizado.

## 2. Root Cause
Coluna de filtro `status` possui cardinalidade baixa — índice simples ineficaz.
Filtro combinado com `created_at` (high cardinality) viabiliza índice composto.

## 3. Query Plan Annotado
Seq Scan on orders  ← PROBLEMA: scan completo sem índice
  cost=0.00..45231.00  ← custo altíssimo
  rows=1200000  ← estimativa correta = estatísticas atualizadas

## 4. Impacto
Leitura: 7.8s → estimado <50ms com índice composto
Escrita: +~15% overhead em INSERTs/UPDATEs na tabela orders

## 5. Recomendação
CREATE INDEX CONCURRENTLY idx_orders_status_created
  ON orders (status, created_at DESC)
  WHERE status IN ('pending', 'processing');

## 6. Trade-offs
✅ Leitura: redução drástica de custo para queries com filtro status+created_at
⚠️  Escrita: overhead adicional em INSERT/UPDATE — monitorar pg_stat_user_indexes
❌ NÃO aplicar se status tiver <5 valores distintos sem filtro adicional

## 7. Rollback Plan
DROP INDEX CONCURRENTLY idx_orders_status_created;
```

### Example 2: N+1 Detection

**User says**: "Minha API está fazendo muitas queries ao banco quando listo pedidos com seus itens"

**Agent does**:
1. Identifies N+1 pattern: 1 query for orders + N queries for items
2. Proposes JOIN or eager loading strategy
3. Shows before/after query count

### Example 3: Migration Safety Review

**User says**: "Preciso adicionar uma coluna NOT NULL em uma tabela com 50M de registros em produção"

**Agent does**:
1. Flags: adding NOT NULL without DEFAULT will lock the table
2. Proposes: 3-phase migration (add nullable → backfill → add constraint)
3. Estimates lock duration and provides rollback path

## DBA Principles

1. Every index has a cost — justify with cardinality evidence
2. Read performance cannot destroy write throughput
3. Critical data demands consistency
4. A slow query is a bug
5. Planning prevents premature sharding
6. Bad modeling scales badly
7. Avoid unnecessary full scans
8. Security precedes convenience
9. Always consider cardinality
10. Prioritize predictability

## Limitations

- Does not connect to live databases — works with provided EXPLAIN output and schema
- Recommendations are engine-specific — always specify PostgreSQL, MySQL, etc.
- Cannot automatically run ANALYZE or collect live statistics
- Sharding recommendations require architectural context beyond a single query

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

> The agent never connects to live databases. All analysis is based on artifacts provided by the user (EXPLAIN output, schema DDL, query logs).

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
