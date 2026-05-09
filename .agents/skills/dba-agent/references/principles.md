# DBA Agent Principles

## Core Principles

### P-01 — Every Index Has a Cost
Indexes improve read performance but add overhead to every write operation
(INSERT, UPDATE, DELETE). Always quantify the cardinality of the target column
before recommending an index. Use `pg_stat_user_indexes` to detect unused indexes.

**Cardinality thresholds (PostgreSQL)**:
- < 2 distinct values (e.g., boolean): use partial index or no index
- 2–100 distinct values: evaluate selectivity against query filter
- > 1000 distinct values: strong candidate for B-tree index

### P-02 — Read Performance Cannot Destroy Write Throughput
Every additional index increases WAL volume and write latency. For OLTP systems
with high write rates (>5k writes/min), quantify write amplification before
adding composite indexes. Target: write latency regression < 10%.

### P-03 — Critical Data Demands Consistency
Choose isolation levels deliberately:
- `READ COMMITTED` (default PostgreSQL): protects against dirty reads
- `REPEATABLE READ`: prevents non-repeatable reads (use for financial aggregates)
- `SERIALIZABLE`: full isolation (use for inventory, accounting, balance operations)

Cost increases significantly with isolation level. Never use SERIALIZABLE by default.

### P-04 — A Slow Query Is a Bug
Establish SLOs for query performance:
- OLTP queries: < 10ms P99
- Reporting queries: < 2s P99
- Batch queries: bounded by business requirements

Any violation is a regression and must be treated as a bug.

### P-05 — Planning Prevents Premature Sharding
Sharding is a last resort. Before sharding, exhaust in order:
1. Query optimization + proper indexing
2. Table partitioning (range, list, hash)
3. Read replicas for read scaling
4. Connection pooling (PgBouncer, ProxySQL)
5. Caching layer (Redis) for hot data
6. Vertical scaling (CPU, RAM, NVMe)

Only consider sharding when write throughput saturates a single node **and**
all above options are exhausted.

### P-06 — Bad Modeling Scales Badly
Fix the data model before optimizing queries. Common anti-patterns:
- EAV (Entity-Attribute-Value) tables: migrate to JSONB or proper schema
- Polymorphic associations without constraints: create proper join tables
- Storing delimited lists in VARCHAR: normalize to junction table
- Missing foreign keys: add with DEFERRABLE INITIALLY DEFERRED for bulk loads

### P-07 — Avoid Unnecessary Full Scans
Seq scans are acceptable for small tables (< 10k rows) or when returning >30%
of the table. For any other case, a seq scan signals a missing index.
Always check `pg_stat_user_tables.seq_scan` to identify chronic offenders.

### P-08 — Security Precedes Convenience
Never recommend exposing raw query results or bypassing row-level security
for performance gains. Audit access patterns alongside performance tuning.
Ensure pg_stat_statements does not expose sensitive query parameters in logs.

### P-09 — Always Consider Cardinality
Before any index recommendation, estimate:
- `n_distinct` from `pg_stats`
- Correlation (sequential vs random access pattern)
- Filter selectivity for partial indexes

### P-10 — Prioritize Predictability
A query with consistent 50ms execution is preferable to one averaging 20ms
but spiking to 5s under load. Design for stable P99 latency, not best-case
average. Use `pg_stat_statements` to monitor P99 over time.

---

## Engine-Specific Reference

### PostgreSQL

Key diagnostic views:
```sql
-- Slow queries
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Table bloat candidates
SELECT relname, n_live_tup, n_dead_tup, last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 10000
ORDER BY n_dead_tup DESC;

-- Replication lag
SELECT client_addr, state, sent_lsn, write_lsn,
       (sent_lsn - write_lsn) AS write_lag_bytes
FROM pg_stat_replication;
```

### MySQL/MariaDB

Key diagnostic queries:
```sql
-- Slow queries (requires slow_query_log=ON)
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;

-- Index usage
SELECT table_name, index_name, rows_read, rows_examined
FROM information_schema.INDEX_STATISTICS
WHERE table_schema = 'your_db';

-- Lock waits
SHOW ENGINE INNODB STATUS;
SELECT * FROM information_schema.INNODB_LOCK_WAITS;
```

---

## Partitioning Decision Matrix

| Scenario | Strategy | Key Column |
|---|---|---|
| Time-series, append-only | RANGE by month/year | created_at, event_date |
| Multi-tenant, equal distribution | HASH by tenant_id | tenant_id |
| Regional data, compliance | LIST by region | country_code, region |
| Mixed access patterns | Composite partition | (region, created_at) |

## Sharding Decision Thresholds

| Signal | Threshold | Action |
|---|---|---|
| Table size | > 1TB and growing | Evaluate partitioning first |
| Write throughput | > 50k writes/min sustained | Evaluate sharding |
| Single-node CPU | > 80% sustained | Vertical scale or read replicas first |
| Replication lag | > 60s persistent | Diagnose, don't shard yet |
