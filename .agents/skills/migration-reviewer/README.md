# migration-reviewer

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

Migration Reviewer is a specialized cognitive system that receives database migrations in any format (Knex, Prisma, Sequelize, TypeORM, Django, Rails, raw SQL, or informal descriptions), performs DBA-grade safety and impact analysis, and generates a professional Slack-ready Markdown approval report for Stack Leaders and Holders.

The agent simulates a Senior DBA review pipeline — Parse → Triage → Analyze → Contextualize → Report — to ensure every schema change is thoroughly evaluated for lock risk, destructive potential, rollback viability, and business impact before reaching production.

## When to Use

- You have a migration (any format) that needs approval before production
- You want a safety analysis of a schema change with lock risk assessment
- You need a professional report for stakeholders who approve database changes
- You received an informal description of a database change and need it formalized
- You want to ensure rollback viability before deploying a migration
- You need to classify whether a migration is destructive or non-destructive

## When NOT to Use

- Query performance optimization (use `dba-agent` in Query Optimizer mode)
- Designing a schema from scratch (use `dba-agent` in Schema Reviewer mode)
- Infrastructure or cloud configuration (use `devops-agent`)
- Application architecture decisions (use `clean-architecture`)

## Compatibility

This skill follows the [Agent Skills open standard](https://agentskills.io/specification) and is compatible with:

| Client | Status |
|---|---|
| **Antigravity** (Google) | ✅ Fully supported |
| **Claude Code** (Anthropic) | ✅ Fully supported |
| **VS Code Copilot** (Agent Skills spec) | ✅ Compatible |

## Installation

### Antigravity (default)

```bash
# Workspace-scoped
npx antigravity install migration-reviewer

# Global
npx antigravity install migration-reviewer --global
```

### Claude Code

```bash
# Workspace-scoped (.claude/skills/)
npx antigravity install migration-reviewer --claude

# Global (~/.claude/skills/)
npx antigravity install migration-reviewer --claude --global
```

### Both clients at once

```bash
npx antigravity install migration-reviewer --all-clients
```

## Usage

This skill activates automatically when:

- User shares a migration file or migration code snippet
- User asks to review, analyze, or approve a migration
- User says "gerar relatório de migration" or "db change report"
- User provides an informal description of a database change
- User mentions "relatório de mudança no banco"

### Supported Migration Formats

| Format | Detection |
|---|---|
| Knex.js | `exports.up`, `knex.schema`, `table.increments()` |
| Prisma | `model`, `@@map`, `@relation` |
| Sequelize | `queryInterface`, `DataTypes` |
| TypeORM | `MigrationInterface`, `queryRunner` |
| Django | `migrations.RunSQL`, `migrations.AddField` |
| Rails | `change`, `add_column`, `create_table` |
| Raw SQL | `ALTER TABLE`, `CREATE TABLE`, DDL statements |
| Informal | Natural language descriptions of changes |

## Workflow

```
Input (migration file/snippet/description)
  │
  ├─→ Phase 1: PARSE ──────────── Detect format, normalize to SQL
  ├─→ Phase 2: TRIAGE ─────────── Sufficient context? Ask if not
  ├─→ Phase 3: ANALYZE ────────── Safety, lock risk, destructive check
  ├─→ Phase 4: CONTEXTUALIZE ──── Business motivation, impact map
  └─→ Phase 5: REPORT ─────────── Slack-ready Markdown output
```

## Output Format

The generated report follows this structure:

```
**[DB Change] <concise title>**

**Contexto**
<business motivation>

---

**Alteração proposta**
<technical description + SQL>

---

**Motivação / Nova lógica**
<business rules as bullets>

---

**Análise de Segurança**
- Risco de lock: <level>
- Estimativa de duração: <estimate>
- Requer janela de manutenção: sim/não
- Compatível com deploy zero-downtime: sim/não

---

**Impacto**
- Tabelas afetadas: <list>
- Endpoints afetados: <list>
- Destrutiva: sim/não
- Rollback disponível: sim/não

---

**Rollback**
<SQL to reverse>

---

Aguardo aprovação ou sugestões. :pray:
```

## Examples

### Example 1: Knex Migration Review

**User provides**: A Knex migration adding a NOT NULL column to a large table.

**Agent does**:
1. Parses Knex syntax, normalizes to SQL
2. Asks about table size and database version
3. Flags lock risk for NOT NULL without DEFAULT
4. Recommends 3-phase migration strategy
5. Generates complete Slack-ready report

### Example 2: Informal Description

**User says**: "preciso botar um campo de telefone na tabela de users, não pode ser null"

**Agent does**:
1. Interprets intent: `ALTER TABLE users ADD COLUMN phone VARCHAR(20) NOT NULL`
2. Asks about DEFAULT value, table size, and database engine
3. Generates professional report with all safety analysis

See `examples/` directory for detailed input/output examples.

## Limitations

- Does not connect to live databases — works with user-provided migration files and context
- Lock duration estimates are approximate and depend on hardware, load, and engine version
- Cannot automatically detect all affected endpoints — may ask user for this information
- Rollback for data-destructive operations may involve data loss acknowledgment

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

> The agent never connects to live databases. All analysis is based on migration files and context provided by the user.

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
