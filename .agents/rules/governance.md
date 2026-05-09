# Repository Governance Rules

These rules are **always active** and apply to every agent interaction within this workspace.

## Language

1. **User interaction**: MUST always be in Brazilian Portuguese
2. **Internal reasoning and artifacts**: ALL internal files (SKILL.md, README.md, tests, examples, specs, plans) and agent reasoning MUST be in English

## Code Quality

1. Every skill must pass `npm run validate` before being committed
2. All SKILL.md files must contain valid YAML frontmatter
3. Semantic versioning is mandatory — no exceptions
4. CHANGELOG.md must be updated for every skill change
5. The main README.md must be updated to include the skill in the "Available Skills" table when created

## Security

1. **NEVER** store API keys, tokens, passwords, or secrets in any file
2. **NEVER** execute `rm -rf`, `git push --force`, or destructive commands without explicit user approval
3. **NEVER** access files outside the workspace directory
4. **ALWAYS** declare security requirements in skill frontmatter
5. **ALWAYS** respect .gitignore entries

## Documentation

1. Every skill must have a README.md with: purpose, usage, examples, limitations
2. Every skill must have at least one example in `examples/`
3. Every skill must have at least one test in `tests/`
4. Descriptions must be written in third person

## Naming

1. Skill names must be lowercase, hyphen-separated
2. Skill names must be unique across the entire registry
3. Skill directory name must match the `name` field in SKILL.md frontmatter

## Commits

1. Follow Conventional Commits format
2. Use the skill name as the commit scope
3. Keep commit messages under 100 characters
