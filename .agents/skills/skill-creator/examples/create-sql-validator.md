# Example: Creating a SQL Schema Validator Skill

## User Request

> "Create a skill that validates SQL schema files against naming conventions and best practices."

## Expected Agent Behavior

### Phase 1: Discovery

The agent asks clarifying questions:

```
I'll help you create a SQL schema validation skill. Let me gather some details:

1. **Trigger phrases**: When should this activate?
   → "validate SQL schema", "check database naming", "review migrations"

2. **Tools needed**: What access does it require?
   → Filesystem (read), Terminal (for running SQL linters)

3. **Scope**: Workspace or global?
   → Workspace (project-specific conventions)

4. **Complexity**: Level 3 (instructions + examples + scripts)
```

### Phase 2: Scaffolding

The agent generates:

```
.agents/skills/sql-validator/
├── SKILL.md
├── README.md
├── examples/
│   └── example-01.md
├── tests/
│   └── test-01.md
└── scripts/
    └── validate-schema.py
```

### Phase 3: Validation

```
✅ Structure: Pass
✅ Frontmatter: Pass
✅ No duplicates: Pass
✅ Catalog synced: Pass
```

### Phase 4: Finalization

```markdown
## ✅ Skill Created Successfully

**Name**: `sql-validator`
**Version**: 1.0.0
**Scope**: workspace
**Path**: `.agents/skills/sql-validator/`

### Next Steps
1. Review generated files
2. Run `npm run validate`
3. Commit: `git commit -m "feat(skills): add sql-validator v1.0.0"`
```
