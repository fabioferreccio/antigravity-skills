# Example: Creating a SQL Schema Validator Skill

## User Request

> "Create a skill that validates SQL schema files against naming conventions and best practices."

## Expected Agent Behavior

### Phase 1: Discovery

The agent asks in Portuguese:

```
Vou te ajudar a criar essa skill. Algumas perguntas:

1. Esse problema de validação de schemas SQL acontece com frequência no seu dia a dia?
2. Quem vai usar? Só você ou o time inteiro?
3. Quais frameworks/ORMs estão envolvidos? (Prisma, Knex, raw SQL?)
4. O que seria uma falha inaceitável? (ex: deixar passar uma migration com lock)
5. Quais frases deveriam ativar a skill?
   → "validate SQL schema", "check database naming", "review migrations"
```

### Phase 2: Skill Fit Test

```
✅ Skill Fit Test PASSED:
  - Repeated workflow: Yes (every migration)
  - Saves time: Yes (manual review takes 10+ min)
  - Reduces errors: Yes (naming inconsistencies cause production bugs)
  - Enforces standards: Yes (team naming conventions)
```

### Phase 3: Architecture Decision

```
Architecture: Reviewer (audit and validate existing work)
Complexity: Level 3 (instructions + examples + scripts)

Justificativa: É uma skill de revisão que precisa de scripts
auxiliares para parsing de SQL. Não precisa de estado dinâmico
nem orquestração.
```

### Phase 4: Output Construction

The agent generates:

```
.agents/skills/sql-validator/
├── SKILL.md
├── README.md
├── examples/
│   └── example-01.md
├── tests/
│   └── test-01.md       # 10 prompts + 3 misuse + 3 edge cases
└── scripts/
    └── validate-schema.py
```

### Phase 5: Internal Quality Gate

```
1. Better than public skills? ✅ — includes lock detection
2. Token efficient? ✅ — decision tree, no prose
3. Expert-grade? ✅ — covers indexes, rollback, naming
4. Precise activation? ✅ — 5 triggers ranked
5. Evolvable? ✅ — learns from team patterns
```

### Phase 6: Validation

```
✅ Structure: Pass
✅ Frontmatter: Pass
✅ No duplicates: Pass
✅ Catalog synced: Pass
```

### Phase 7: Finalization

```markdown
## ✅ Skill Created Successfully

**Name**: `sql-validator`
**Version**: 1.0.0
**Architecture**: Reviewer
**Scope**: workspace
**Path**: `.agents/skills/sql-validator/`

### Trigger Alternatives (ranked)
1. "Validate SQL schema files against naming conventions and index best practices"
2. "Review database migration for naming, locks, and rollback safety"
3. "Check SQL schema compliance"
4. "Validate database naming"
5. "Review SQL"

### Evolution Plan
- **After 10 uses**: Learn team-specific naming patterns
- **After 100 uses**: Auto-detect ORM and adapt rules
- **After 1000 uses**: Predict migration risks from schema history

### Next Steps
1. Review generated files
2. Run `npm run validate`
3. Commit: `git commit -m "feat(skills): add sql-validator v1.0.0"`
```
