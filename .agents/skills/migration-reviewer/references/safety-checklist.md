# Migration Safety Checklist

Reference document for the `migration-reviewer` skill. Used during Phase 3 (Analyze) to systematically evaluate every DDL operation.

---

## DDL Operation Risk Matrix

### 🔴 CRITICAL Risk

| Operation | Risk | Why | Mitigation |
|---|---|---|---|
| `DROP TABLE` | Data loss | Irreversible destruction of all table data | Backup verification, soft-delete pattern, rename-then-drop |
| `TRUNCATE TABLE` | Data loss | Removes all rows without logging individual deletes | Export data first, use DELETE with WHERE for partial removal |

### 🔴 HIGH Risk

| Operation | Risk | Why | Mitigation |
|---|---|---|---|
| `DROP COLUMN` | Data loss | Column data is permanently removed | Add deprecation period, backup column data first |
| `ADD COLUMN NOT NULL` (no DEFAULT) | Table lock | PG < 11: full table rewrite; PG >= 11: constraint validation scan | 3-phase migration: nullable → backfill → add NOT NULL |
| `ALTER COLUMN TYPE` (incompatible) | Table rewrite | Changing type may require full table rewrite + lock | Create new column → backfill → swap → drop old |
| `RENAME TABLE` | Application break | All queries referencing old name will fail | Create view with old name as alias |

### 🟡 MEDIUM Risk

| Operation | Risk | Why | Mitigation |
|---|---|---|---|
| `RENAME COLUMN` | Application break | ORM and raw queries referencing old name will fail | Deploy application changes first, then rename |
| `ADD INDEX` (non-concurrent) | Write lock | Blocks writes during index creation | Use `CREATE INDEX CONCURRENTLY` (PostgreSQL) |
| `ADD CONSTRAINT (FK)` | Validation lock | Validates all existing rows against referenced table | Use `NOT VALID` then `VALIDATE CONSTRAINT` separately |
| `ADD CONSTRAINT (CHECK)` | Validation lock | Scans all rows for constraint validation | Use `NOT VALID` then `VALIDATE CONSTRAINT` |
| `INSERT/UPDATE` (data migration) | Lock contention | Large batch operations may escalate locks | Process in batches with sleep intervals |
| `ALTER COLUMN SET NOT NULL` | Validation scan | Scans all rows to verify no NULLs exist | Ensure backfill is complete first |

### 🟢 LOW Risk

| Operation | Risk | Why | Mitigation |
|---|---|---|---|
| `CREATE TABLE` | None | No existing data affected | Standard review |
| `ADD COLUMN` (nullable) | None (PG 11+) | Instant metadata-only operation in modern PostgreSQL | Verify PG version >= 11 |
| `ADD COLUMN DEFAULT` (constant) | None (PG 11+) | Instant with constant DEFAULT in PG 11+ | Verify DEFAULT is constant, not volatile |
| `CREATE INDEX CONCURRENTLY` | Minimal | Non-blocking but slower than regular index | Monitor for concurrent build failures |
| `ADD CONSTRAINT` (on new table) | None | No existing data to validate | Standard review |
| `COMMENT ON` | None | Metadata-only operation | No mitigation needed |

---

## Lock Escalation Reference

### PostgreSQL Lock Types (ordered by severity)

```
ACCESS SHARE           ← SELECT (least restrictive)
ROW SHARE              ← SELECT FOR UPDATE
ROW EXCLUSIVE          ← UPDATE, DELETE, INSERT
SHARE UPDATE EXCLUSIVE ← VACUUM, CREATE INDEX CONCURRENTLY
SHARE                  ← CREATE INDEX (non-concurrent)
SHARE ROW EXCLUSIVE    ← CREATE TRIGGER
EXCLUSIVE              ← Rare
ACCESS EXCLUSIVE       ← ALTER TABLE, DROP TABLE (most restrictive)
```

### Lock Duration Estimates (rough guidelines)

| Table Size | ADD COLUMN (nullable) | ADD INDEX (concurrent) | ADD NOT NULL (after backfill) | Full Rewrite |
|---|---|---|---|---|
| < 100K rows | Instant | < 1s | < 1s | < 5s |
| 100K - 1M | Instant | 1-10s | 1-5s | 5-60s |
| 1M - 10M | Instant | 10s-2min | 5-30s | 1-10min |
| 10M - 100M | Instant | 2-15min | 30s-5min | 10-60min |
| > 100M | Instant | 15min+ | 5-30min | 1hr+ |

> ⚠️ These are rough estimates. Actual duration depends on hardware, I/O, concurrent load, and database configuration.

---

## Engine-Specific Considerations

### PostgreSQL

- PG 11+: ADD COLUMN with constant DEFAULT is instant (no rewrite)
- PG 12+: ADD NOT NULL with DEFAULT is instant
- Always prefer `CREATE INDEX CONCURRENTLY`
- `ALTER TABLE` takes `ACCESS EXCLUSIVE` lock by default
- Use `NOT VALID` + `VALIDATE CONSTRAINT` for foreign keys on large tables

### MySQL / MariaDB

- `ALTER TABLE` in MySQL < 8.0 often causes full table copy
- MySQL 8.0+ supports instant ADD COLUMN (at end of table only)
- `pt-online-schema-change` for large table alterations
- InnoDB Online DDL varies by operation — check MySQL docs per operation

### SQL Server

- `ALTER TABLE ADD COLUMN` with DEFAULT is metadata-only in SQL Server 2012+
- Online index rebuilds available in Enterprise edition
- Schema locks (Sch-M) block all concurrent access

---

## Rollback Viability Classification

| Operation | Rollback Possible | Rollback Method | Data Recovery |
|---|---|---|---|
| ADD COLUMN | ✅ Yes | DROP COLUMN | N/A (new column) |
| DROP COLUMN | ⚠️ Partial | Re-add column | Data lost — requires backup |
| ADD INDEX | ✅ Yes | DROP INDEX | N/A |
| DROP INDEX | ✅ Yes | Re-create index | N/A (rebuild time) |
| ADD CONSTRAINT | ✅ Yes | DROP CONSTRAINT | N/A |
| DROP TABLE | ❌ No (without backup) | Restore from backup | Requires backup |
| RENAME COLUMN | ✅ Yes | Rename back | N/A |
| ALTER COLUMN TYPE | ⚠️ Partial | Alter back (if compatible) | Possible truncation |
| INSERT/UPDATE | ⚠️ Partial | Reverse UPDATE / DELETE | Depends on data |
