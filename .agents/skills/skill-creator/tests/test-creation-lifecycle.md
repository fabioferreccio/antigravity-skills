# Test: Skill Creator — Complete Lifecycle

## Test ID
`sc-test-001`

## Description
Verify that the skill-creator generates a fully compliant skill structure that passes all validation checks.

## Steps

1. Activate the skill-creator with: "Create a new skill called `test-skill-lifecycle`"
2. Provide answers to the discovery questions:
   - Purpose: "A test skill for validating the creation lifecycle"
   - Triggers: "test lifecycle", "validate creation"
   - Tools: filesystem (read)
   - Scope: workspace
   - Complexity: Level 2

## Expected Behavior

1. The agent creates the directory `.agents/skills/test-skill-lifecycle/`
2. All required files are present:
   - `SKILL.md` with valid frontmatter
   - `README.md` with all sections
   - `examples/example-01.md` with realistic content
   - `tests/test-01.md` with test definition
3. `npm run validate:structure` passes
4. `npm run validate:frontmatter` passes
5. No duplicate name conflicts
6. Catalog is updated correctly

## Validation Criteria

- [ ] Directory created at correct path
- [ ] SKILL.md frontmatter contains: name, description, version, author, tags, triggers, scope, tools, security
- [ ] Version is valid semver (1.0.0)
- [ ] Name field matches directory name
- [ ] README.md contains: Overview, When to Use, When NOT to Use, Security, License
- [ ] At least one example exists
- [ ] At least one test exists

## Cleanup

Remove `.agents/skills/test-skill-lifecycle/` after test execution.
