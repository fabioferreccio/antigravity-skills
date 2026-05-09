# dba-agent — Evaluation Suite

## Valid Activation Prompts (10)

### V-01: Basic Slow Query
```
Input: "Essa query está demorando 5 segundos: SELECT * FROM orders WHERE user_id = 42"
Expected activation: YES
Expected mode: Query Optimizer
Key assertions:
  - Agent asks for EXPLAIN ANALYZE if not provided
  - Agent checks for index on user_id
  - Agent avoids SELECT * recommendation
```

### V-02: EXPLAIN ANALYZE Provided
```
Input: "EXPLAIN ANALYZE: Seq Scan on products (cost=0.00..12400 rows=400000 width=64)"
Expected activation: YES
Expected mode: Query Optimizer
Key assertions:
  - Agent annotates the plan line by line
  - Agent identifies seq scan as root cause
  - Agent proposes specific index DDL
```

### V-03: Index Design Request
```
Input: "Devo criar um índice em (user_id, created_at) ou (created_at, user_id)?"
Expected activation: YES
Expected mode: Index Advisor
Key assertions:
  - Agent explains column order impact on index selectivity
  - Agent asks about query WHERE clause order
  - Agent mentions cardinality of each column
```

### V-04: Deadlock Report
```
Input: "Temos deadlocks frequentes entre as tabelas orders e inventory. Segue o log do PostgreSQL..."
Expected activation: YES
Expected mode: Transaction Auditor
Key assertions:
  - Agent builds lock dependency graph
  - Agent identifies transaction ordering issue
  - Agent proposes consistent lock acquisition order
```

### V-05: N+1 Detection
```
Input: "Minha API faz uma query pra listar posts e depois uma query pra cada post buscar os comments"
Expected activation: YES
Expected mode: N+1 Detector
Key assertions:
  - Agent confirms N+1 pattern
  - Agent provides JOIN-based solution
  - Agent mentions eager loading if ORM is identified
```

### V-06: Partition Planning
```
Input: "Tabela de eventos tem 200M rows e cresce 2M/dia. Como particionar?"
Expected activation: YES
Expected mode: Partition Planner
Key assertions:
  - Agent recommends RANGE partition by date
  - Agent addresses partition pruning validation
  - Agent mentions pg_partman or equivalent for automation
```

### V-07: Migration Review
```
Input: "Revisar essa migration antes de rodar em prod: ALTER TABLE users ADD COLUMN age INT NOT NULL DEFAULT 0;"
Expected activation: YES
Expected mode: Migration Reviewer
Key assertions:
  - Agent detects PostgreSQL version dependency (v11+ vs older)
  - Agent confirms constant DEFAULT is safe in PG11+
  - Agent verifies lock scope
```

### V-08: Sharding Decision
```
Input: "Nosso banco de orders chegou em 500GB e temos 10k writes/min. Precisamos de sharding?"
Expected activation: YES
Expected mode: Shard Architect
Key assertions:
  - Agent first asks about partitioning and read replicas status
  - Agent challenges necessity of sharding
  - Agent defines shard key criteria if sharding is warranted
```

### V-09: Full Diagnosis
```
Input: "Diagnosticar banco de dados: temos queries lentas, alto CPU no RDS, e replica lag de 30s"
Expected activation: YES
Expected mode: Full Diagnosis
Key assertions:
  - Agent requests pg_stat_activity, pg_stat_user_indexes, slow query log
  - Agent produces all 7 sections of the output format
  - Agent addresses CPU, slow queries, and replica lag separately
```

### V-10: Replication Lag
```
Input: "Nossa replica está com 45 segundos de lag. Temos muitos writes na primary."
Expected activation: YES
Expected mode: Replication Analyst
Key assertions:
  - Agent asks for pg_stat_replication output
  - Agent checks for long-running transactions blocking WAL application
  - Agent suggests max_standby_streaming_delay tuning
```

---

## Misuse Prompts — Should NOT Activate (3)

### M-01: Infrastructure Topic
```
Input: "Como configurar auto-scaling no AWS RDS?"
Expected activation: NO
Reason: Infrastructure/cloud configuration, not query or schema analysis
Expected response: Redirect to infrastructure domain, offer schema-level advice only
```

### M-02: Application Logic
```
Input: "Como estruturar minha camada de service no backend para separar responsabilidades?"
Expected activation: NO
Reason: Application architecture, not database concern
Expected response: Clarify scope — offer database layer advice if query patterns are involved
```

### M-03: Vague Performance Complaint
```
Input: "Meu sistema está lento"
Expected activation: PARTIAL (escalate)
Expected behavior:
  - Agent does NOT assume database is the cause
  - Agent lists what context is needed (slow query log, EXPLAIN, schema)
  - Agent asks specific diagnostic questions before proceeding
```

---

## Edge Cases (3)

### E-01: Conflicting Indexes
```
Input: "Temos 12 índices nessa tabela e os INSERTs estão lentos. EXPLAIN ANALYZE do INSERT: [plan]"
Expected behavior:
  - Agent identifies index bloat as root cause
  - Agent audits index usage via pg_stat_user_indexes
  - Agent proposes index consolidation, not addition
  - Agent provides DROP INDEX DDL with rollback path
```

### E-02: Low Cardinality Column Index
```
Input: "Vou criar um índice na coluna 'is_active' (boolean, 95% true)"
Expected behavior:
  - Agent REJECTS the simple index recommendation
  - Agent explains low cardinality makes index worse than seq scan
  - Agent proposes partial index: WHERE is_active = false (high selectivity side)
  - Agent validates with estimated selectivity math
```

### E-03: Sharding Premature Escalation
```
Input: "Nossa tabela tem 10GB. Precisamos de sharding?"
Expected behavior:
  - Agent REJECTS sharding as premature
  - Agent explains 10GB is manageable with proper indexing and partitioning
  - Agent proposes alternative: VACUUM, ANALYZE, index review, read replicas
  - Agent sets threshold for when sharding becomes relevant (>1TB with write saturation)
```
