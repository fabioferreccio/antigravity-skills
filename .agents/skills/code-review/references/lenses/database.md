# Database Review Lens

Polyglot database review lens.

## 9 review lenses

1. **N+1 Queries** (Critico): Loops executing query per iteration. Fix: batch queries, JOINs, eager loading.

2. **Missing Indexes** (Critico/Importante):
   - FK indexes (Postgres doesn't auto-create)
   - Index type selection: B-tree (default), GIN (JSONB/full-text), GiST (geometric), BRIN (time-series)
   - Composite indexes (equality first, range last, leftmost prefix rule)
   - Partial indexes (`WHERE deleted_at IS NULL`)
   - Covering indexes (`INCLUDE (col)`)

3. **Inefficient Queries** (Importante):
   - OFFSET pagination → cursor-based (keyset)
   - Unbatched inserts → multi-row INSERT or COPY
   - Check-then-insert → UPSERT
   - LIKE '%term%' → full-text search

4. **Migration Safety** (Critico):
   - Missing down/rollback migration
   - Destructive operations without backup strategy
   - NOT NULL on existing tables requires DEFAULT
   - Never edit generated migrations
   - Rollback viability assessment for every migration

5. **Transaction Boundaries** (Critico/Importante):
   - Operations should be atomic but aren't
   - Never make external API calls inside transactions
   - Deadlock prevention: deterministic lock ordering
   - Queue processing: SELECT ... FOR UPDATE SKIP LOCKED

6. **SQL Injection** (Critico): String concatenation in queries

7. **Connection/Pool Misuse** (Critico):
   - Connection leak (not returning to pool)
   - Missing idle timeout configuration
   - Named prepared statements in transaction-mode pooling

8. **Schema & Type Issues** (Importante):
   - Use bigint for IDs, text over varchar(n), timestamptz over timestamp
   - numeric over float for money, boolean over varchar for flags
   - PK strategy: identity for single-DB, UUIDv7 for distributed

9. **Repository Pattern Violations** (Importante):
   - Business logic in queries
   - Raw SQL in use cases/controllers
   - ORM queries outside repository layer

## ORM-specific checks
- **Prisma**: `findMany` without `take`, nested includes depth
- **TypeORM**: QueryBuilder vs find, lazy loading pitfalls
- **SQLAlchemy**: N+1 with relationships, session management
- **Hibernate**: FetchType.EAGER, HQL injection
- **EF Core**: `Include` chains, tracking vs no-tracking
- **Drizzle**: never edit generated migrations
