# Test: Repository Maintainer — Structure Validation

## Test ID
`rm-test-001`

## Description
Verify that the repository-maintainer correctly identifies a skill with missing required files.

## Setup

Create a temporary skill directory with an intentionally incomplete structure:

```
.agents/skills/test-incomplete/
├── SKILL.md    # present
└── (no README.md, no examples/, no tests/)
```

## Expected Behavior

The repository-maintainer should:

1. Detect the missing `README.md`
2. Detect the missing `examples/` directory
3. Detect the missing `tests/` directory
4. Report each as 🔴 Critical violations
5. NOT report false positives for `SKILL.md` (which is present)

## Expected Output

```markdown
| Skill | Check | Status | Details |
|---|---|---|---|
| test-incomplete | SKILL.md | 🟢 Pass | Present |
| test-incomplete | README.md | 🔴 Critical | Missing required file |
| test-incomplete | examples/ | 🔴 Critical | Missing required directory |
| test-incomplete | tests/ | 🔴 Critical | Missing required directory |
```

## Cleanup

Remove `.agents/skills/test-incomplete/` after test execution.
