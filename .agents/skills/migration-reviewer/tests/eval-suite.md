# migration-reviewer — Evaluation Suite

## Valid Activation Prompts (10)

### V-01: Knex Migration File
```
Input: "Revisar essa migration antes de rodar em prod: exports.up = function(knex) { return knex.schema.createTable('audit_logs', function(table) { table.increments('id'); table.string('action'); table.timestamps(); }); };"
Expected activation: YES
Expected phase: Parse → Analyze → Report
Key assertions:
  - Agent detects Knex.js format
  - Agent normalizes to CREATE TABLE SQL
  - Agent classifies as non-destructive (new table)
  - Agent generates Slack-ready report
  - Agent asks for business context if not provided
```

### V-02: Prisma Schema Change
```
Input: "Adicionei esse model no schema.prisma: model Payment { id Int @id @default(autoincrement()) amount Decimal @db.Decimal(10,2) status String @default('pending') orderId Int order Order @relation(fields: [orderId], references: [id]) }"
Expected activation: YES
Expected phase: Parse → Triage → Report
Key assertions:
  - Agent detects Prisma format
  - Agent normalizes to CREATE TABLE + FK SQL
  - Agent asks about database engine and business motivation
  - Agent assesses FK constraint impact
```

### V-03: Raw SQL ALTER TABLE
```
Input: "Migration pra aprovação: ALTER TABLE users ADD COLUMN cpf VARCHAR(14) UNIQUE NOT NULL;"
Expected activation: YES
Expected phase: Parse → Triage → Analyze → Report
Key assertions:
  - Agent flags NOT NULL without DEFAULT as high risk
  - Agent asks for table size
  - Agent recommends 3-phase migration
  - Agent includes rollback SQL
```

### V-04: DROP TABLE Migration
```
Input: "Preciso dropar a tabela temp_imports que era usada para migração de dados. Já não tem mais uso."
Expected activation: YES
Expected phase: Parse → Triage → Analyze → Report
Key assertions:
  - Agent classifies as CRITICAL destructive
  - Agent asks for confirmation of no dependent services
  - Agent suggests backup before drop
  - Agent warns rollback requires backup restoration
```

### V-05: Informal Description
```
Input: "preciso botar um campo de desconto na tabela de produtos, pode ser null, decimal"
Expected activation: YES
Expected phase: Parse → Analyze → Report
Key assertions:
  - Agent normalizes to ALTER TABLE products ADD COLUMN discount DECIMAL
  - Agent classifies as non-destructive, low risk
  - Agent generates full report even from informal input
```

### V-06: Multiple Operations Migration
```
Input: "Migration com várias operações: criar tabela categories, adicionar coluna category_id em products como FK, criar índice"
Expected activation: YES
Expected phase: Parse → Triage → Analyze → Report
Key assertions:
  - Agent handles multi-operation migration
  - Agent assesses each operation individually
  - Agent identifies FK constraint validation risk
  - Agent recommends operation ordering
```

### V-07: TypeORM Migration
```
Input: "export class AddPhoneColumn1234 implements MigrationInterface { async up(queryRunner) { await queryRunner.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(20)`); } async down(queryRunner) { await queryRunner.query(`ALTER TABLE users DROP COLUMN phone`); } }"
Expected activation: YES
Expected phase: Parse → Analyze → Report
Key assertions:
  - Agent detects TypeORM format
  - Agent normalizes to SQL
  - Agent classifies as non-destructive (nullable ADD COLUMN)
  - Agent validates down migration exists
```

### V-08: Index-Only Migration
```
Input: "Preciso criar um índice composto em orders (user_id, status, created_at) pra melhorar a query do dashboard. PostgreSQL 14, tabela com 30M rows."
Expected activation: YES
Expected phase: Parse → Analyze → Report
Key assertions:
  - Agent recommends CREATE INDEX CONCURRENTLY
  - Agent estimates creation time for 30M rows
  - Agent assesses write amplification
  - Agent includes DROP INDEX in rollback
```

### V-09: Column Type Change
```
Input: "Preciso mudar a coluna price de INTEGER pra DECIMAL(10,2) na tabela products. Temos 500k produtos."
Expected activation: YES
Expected phase: Parse → Analyze → Report
Key assertions:
  - Agent flags as MEDIUM risk (potential table rewrite)
  - Agent checks PostgreSQL version for rewrite behavior
  - Agent recommends new-column-swap strategy for large tables
  - Agent warns about application code changes needed
```

### V-10: Constraint Addition
```
Input: "Adicionar constraint de CHECK na coluna status da tabela orders: status IN ('pending', 'paid', 'cancelled', 'refunded'). Tabela tem 10M rows."
Expected activation: YES
Expected phase: Parse → Analyze → Report
Key assertions:
  - Agent flags validation scan for 10M rows
  - Agent recommends NOT VALID + VALIDATE CONSTRAINT strategy
  - Agent estimates lock duration
  - Agent provides rollback (DROP CONSTRAINT)
```

---

## Misuse Prompts — Should NOT Activate (3)

### M-01: Query Optimization
```
Input: "Essa query está lenta: SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT 100"
Expected activation: NO
Reason: Query optimization is the domain of dba-agent (Query Optimizer mode), not migration-reviewer
Expected response: Redirect to dba-agent, clarify that migration-reviewer is for schema change approval reports
```

### M-02: Schema Design from Scratch
```
Input: "Preciso desenhar o modelo de dados para um sistema de e-commerce do zero"
Expected activation: NO
Reason: Schema design is the domain of dba-agent (Schema Reviewer mode) or enterprise-architect
Expected response: Redirect to appropriate skill, offer to review the resulting migration once it exists
```

### M-03: Application Architecture
```
Input: "Como estruturar os repositories no meu backend para acessar o banco?"
Expected activation: NO
Reason: Application layer architecture, not database migration
Expected response: Redirect to clean-architecture or staff-engineer
```

---

## Edge Cases (3)

### E-01: Migration Without Down/Rollback
```
Input: "exports.up = function(knex) { return knex.schema.alterTable('users', function(table) { table.string('nickname'); }); }; // sem exports.down"
Expected behavior:
  - Agent detects missing rollback migration
  - Agent flags as concern in the report
  - Agent generates the rollback SQL anyway
  - Agent recommends adding exports.down to the migration file
```

### E-02: Conflicting Operations in Same Migration
```
Input: "Migration: CREATE TABLE temp_data (...); INSERT INTO temp_data SELECT * FROM legacy_data; DROP TABLE legacy_data; ALTER TABLE temp_data RENAME TO legacy_data;"
Expected behavior:
  - Agent detects complex multi-step operation
  - Agent classifies as CRITICAL (DROP TABLE involved)
  - Agent warns about atomicity risks
  - Agent recommends splitting into separate migrations
  - Agent provides step-by-step rollback for each operation
```

### E-03: Empty or No-Op Migration
```
Input: "Revisar: exports.up = function(knex) { return Promise.resolve(); };"
Expected behavior:
  - Agent detects no-op migration
  - Agent asks why the migration exists
  - Agent does NOT generate a full report for a no-op
  - Agent suggests removing the migration if truly empty
```
