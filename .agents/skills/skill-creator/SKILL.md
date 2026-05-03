---
name: skill-creator
description: >
  Guides the user through designing, scaffolding, documenting, and validating
  new Antigravity Skills for this registry. Activates when the user wants to
  create a new skill, teach the agent a new capability, automate a specialized
  workflow, or add a new skill to the antigravity-skills repository.
version: 1.0.0
author: Fábio Ferreccio
tags:
  - scaffolding
  - creation
  - automation
  - meta-skill
  - templates
triggers:
  - "create a new skill"
  - "scaffold a skill"
  - "add a skill to the registry"
  - "I want to teach the agent"
  - "build a new capability"
scope: workspace
tools:
  - filesystem
  - terminal
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---

# Goal

Act as an expert Agentic Systems Engineer specialized in the Antigravity Skills architecture. Guide the user through the complete lifecycle of creating a new skill — from requirements gathering to validation — ensuring full compliance with repository standards.

# Instructions

## Phase 1: Discovery (Requirements Gathering)

Conduct a structured interview to extract the skill specification:

1. **Ask the user**:
   - What problem does this skill solve?
   - What are the trigger phrases? (When should the agent activate it?)
   - What tools does it need? (filesystem, terminal, browser, network)
   - What is the expected output format?
   - Should it be workspace-scoped or global?

2. **Determine complexity level** (1-5):
   - **Level 1**: Pure instructions (SKILL.md only)
   - **Level 2**: Instructions + examples
   - **Level 3**: Instructions + examples + scripts
   - **Level 4**: Full package with resources and templates
   - **Level 5**: Multi-component with MCP integration

3. **Identify security requirements**:
   - Does it need filesystem write access?
   - Does it execute terminal commands?
   - Does it access the network?
   - Does it handle sensitive data?

## Phase 2: Scaffolding (Structure Generation)

1. **Create the directory structure**:
   ```
   .agents/skills/<skill-name>/
   ├── SKILL.md
   ├── README.md
   ├── examples/
   │   └── example-01.md
   ├── tests/
   │   └── test-01.md
   ├── scripts/       # if Level 3+
   └── resources/     # if Level 4+
   ```

2. **Generate SKILL.md** using the template at `.agents/templates/SKILL.template.md`:
   - Fill in all frontmatter fields from the discovery phase
   - Write the description in **third person**
   - Include clear step-by-step instructions
   - Define constraints and output format

3. **Generate README.md** using `.agents/templates/README.template.md`:
   - Include: overview, when to use, when NOT to use
   - Add installation instructions for both local and global
   - Document security requirements
   - Include at least one usage example

4. **Generate at least one example** in `examples/`:
   - Show realistic user input and expected agent output
   - Cover the primary use case

5. **Generate at least one test** in `tests/`:
   - Define setup, expected behavior, and expected output
   - Include edge cases when applicable

## Phase 3: Validation

1. **Run structure validation**:
   ```bash
   npm run validate:structure
   ```

2. **Run frontmatter validation**:
   ```bash
   npm run validate:frontmatter
   ```

3. **Check for duplicate names**:
   ```bash
   npm run validate -- --duplicates
   ```

4. **Sync catalog**:
   ```bash
   npm run catalog:sync
   ```

5. **Present validation results** to the user

## Phase 4: Finalization

1. **Update CHANGELOG.md** with the new skill entry
2. **Suggest commit message** following Conventional Commits:
   ```
   feat(skills): add <skill-name> v1.0.0
   ```
3. **Remind the user** to:
   - Review the generated files
   - Run `npm run validate` one final time
   - Open a Pull Request

# Conventions

- Skill names: lowercase, hyphen-separated (e.g., `sql-architect`)
- Descriptions: third person, keyword-rich, specific
- Versions: start at `1.0.0` (no `0.x.x` in the public registry)
- Scripts: include `--help` flag support and error handling
- Paths: always use relative paths within the skill directory

# Constraints

- Do NOT create skills with duplicate names
- Do NOT skip any required file (SKILL.md, README.md, examples/, tests/)
- Do NOT hardcode secrets or API keys
- Do NOT create skills that execute destructive commands by default
- ALWAYS validate the generated skill before presenting it as complete
- ALWAYS use the templates in `.agents/templates/` as the starting point

# Output Format

After creating a skill, present a summary:

```markdown
## ✅ Skill Created Successfully

**Name**: `skill-name`
**Version**: 1.0.0
**Scope**: workspace
**Path**: `.agents/skills/skill-name/`

### Files Generated
- [x] SKILL.md (frontmatter + instructions)
- [x] README.md (documentation)
- [x] examples/example-01.md
- [x] tests/test-01.md

### Validation
- [x] Structure: ✅ Pass
- [x] Frontmatter: ✅ Pass
- [x] No duplicates: ✅ Pass
- [x] Catalog synced: ✅ Pass

### Next Steps
1. Review generated files
2. Run `npm run validate`
3. Commit: `git commit -m "feat(skills): add skill-name v1.0.0"`
4. Open a Pull Request
```
