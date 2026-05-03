# Test: Skill Creator v2.0 — Complete Lifecycle

## Test ID
`sc-test-001`

## Description
Verify that the skill-creator v2.0 generates a fully compliant skill passing all phases including Skill Fit Test, Architecture Decision, and Internal Quality Gate.

## Steps

1. Activate the skill-creator with: "Create a new skill called `test-skill-lifecycle`"
2. Provide answers to the discovery questions:
   - Purpose: "A test skill for validating the creation lifecycle"
   - Triggers: "test lifecycle", "validate creation"
   - Tools: filesystem (read)
   - Scope: workspace
   - Frequency: daily

## Expected Behavior

1. **Phase 1**: Agent asks up to 5 strategic questions in Portuguese
2. **Phase 2**: Skill Fit Test passes (repeated workflow + saves time)
3. **Phase 3**: Architecture classified as "Single Skill", Level 2
4. **Phase 4**: Directory `.agents/skills/test-skill-lifecycle/` created with all files
5. **Phase 5**: Quality Gate passes all 5 checks
6. **Phase 6**: All validation commands pass
7. **Phase 7**: Summary with trigger alternatives and evolution plan

## Validation Criteria

- [ ] Discovery conducted in Portuguese
- [ ] Skill Fit Test explicitly evaluated
- [ ] Architecture type and complexity level stated
- [ ] Directory created at correct path
- [ ] SKILL.md frontmatter contains: name, description, version, author, tags, triggers, scope, tools, security
- [ ] SKILL.md written entirely in English
- [ ] Version is valid semver (1.0.0)
- [ ] Name field matches directory name
- [ ] README.md contains: Overview, When to Use, When NOT to Use, Installation (both scopes), Security, License
- [ ] At least one example exists
- [ ] Tests include 10+ prompts with pass/fail criteria
- [ ] Tests include misuse prompts
- [ ] Tests include edge case prompts
- [ ] 5 trigger alternatives presented and ranked
- [ ] Quality Gate checklist presented
- [ ] Evolution Plan included (10/100/1000 uses)

## Cleanup

Remove `.agents/skills/test-skill-lifecycle/` after test execution.

---

# Test: Skill Fit Rejection

## Test ID
`sc-test-002`

## Description
Verify that the skill-creator rejects requests that don't qualify as skills.

## Steps

1. Activate with: "Create a skill that prints hello world"

## Expected Behavior

1. Agent runs Skill Fit Test
2. Request is rejected (not a repeated workflow, doesn't save time, no expert reasoning)
3. Agent explains why in Portuguese
4. Agent suggests alternatives (e.g., "just run `echo hello`")

## Validation Criteria

- [ ] Skill Fit Test explicitly fails
- [ ] Rejection is polite and in Portuguese
- [ ] Alternative approach suggested
- [ ] No files are created

---

# Test: Architecture Classification

## Test ID
`sc-test-003`

## Description
Verify correct architecture type assignment for different request types.

## Test Cases

| Request | Expected Architecture | Expected Level |
|---|---|---|
| "Create a skill to enforce commit message format" | Reviewer | 2 |
| "Create a skill that generates license files" | Generator | 3 |
| "Create a skill that manages the full deploy pipeline" | Orchestrator + Children | 5 |
| "Create a skill with API reference for our internal SDK" | Static Knowledge | 1 |
| "Create a skill that audits code and generates fix patches" | Multi-Skill Suite | 4 |

## Validation Criteria

- [ ] Each request mapped to the correct architecture type
- [ ] Complexity level matches expected value
- [ ] Justification provided in Portuguese

---

# Test: Token Compression

## Test ID
`sc-test-004`

## Description
Verify that the generated SKILL.md uses token-efficient patterns.

## Steps

1. Create a Level 4 skill with complex instructions

## Validation Criteria

- [ ] No prose where a decision tree would suffice
- [ ] Heavy documentation moved to `references/`
- [ ] Repeated text extracted into reusable rules
- [ ] SKILL.md kernel is under 200 lines
- [ ] Graph knowledge used when appropriate (ontology.yaml, workflows.yaml)
