# Conventions Reference

## Naming

- Skill names: `lowercase-hyphen-separated` (e.g., `sql-architect`)
- Directories: match skill name exactly
- Scripts: `verb-noun.sh` or `verb-noun.py` (e.g., `validate-schema.py`)
- Templates: `noun.template.md` (e.g., `skill-md.template.md`)

## Descriptions

- Third person: "Validates..." not "Validate..."
- Keyword-rich: include terms users would search for
- Specific: "Validates SQL schema naming conventions" not "Helps with databases"
- Under 200 characters for frontmatter `description` field

## Versioning

- Start at `1.0.0` — no `0.x.x` in the public registry
- Follow semver: `MAJOR.MINOR.PATCH`
- MAJOR: breaking changes to activation or output format
- MINOR: new capabilities or phases
- PATCH: bug fixes, typo corrections, compression

## Frontmatter (Required Fields)

```yaml
---
name: <kebab-case>
description: >
  <third-person, keyword-rich, under 200 chars>
version: <semver>
author: <name>
tags:
  - <tag-1>
  - <tag-2>
triggers:
  - "<trigger-phrase-1>"
  - "<trigger-phrase-2>"
scope: <workspace|global>
tools:
  - <filesystem|terminal|browser|network>
security:
  network: <true|false>
  filesystem: <read|read-write>
  terminal: <sandboxed|full>
---
```

## SKILL.md Sections (Required)

1. `# Goal` — one paragraph
2. `# Instructions` — numbered steps or decision trees
3. `# Constraints` — safety and operational boundaries
4. `# Output Format` — what the agent produces

## SKILL.md Sections (Optional)

- `# Conventions` — standards to follow
- `# Examples` — inline examples (for Level 1 skills without examples/)
- `# Escalation` — when to ask the user

## Paths

- Always use relative paths within the skill directory
- Workspace: `.agents/skills/<skill-name>/`
- Global: `~/.gemini/antigravity/skills/<skill-name>/`
