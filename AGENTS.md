# antigravity-skills Registry

Production-grade public registry of reusable Antigravity Skills — versioned, documented, testable, and installable via npx.

## Stack
- **Language**: TypeScript / Node.js
- **CLI Framework**: Commander
- **Package Manager**: pnpm

## Architecture
This is a monorepo-style skill registry. Skills are located in `.agents/skills/`.
The CLI tool is in `cli/`.

## Governance Rules
The project follows strict governance rules, detailed in `.agents/rules/governance.md`:
- **Language**: User interaction in pt-BR. Internal reasoning and files in English.
- **Code Quality**: Run `npm run validate` before committing. SKILL.md requires valid YAML frontmatter. Semantic versioning is mandatory.
- **Security**: No secrets in files. Do not use destructive commands (`rm -rf`, `git push --force`) without explicit approval. Respect `.gitignore`.
- **Documentation**: All skills need a `README.md`, examples in `examples/`, and tests in `tests/`. Descriptions must be in third person.
- **Naming**: Skills must be lowercase, hyphen-separated, and unique.
- **Commits**: Follow Conventional Commits format.

## Commands
- **Install dependencies**: `pnpm install`
- **Validate all skills**: `npm run lint`
- **Test skills**: `npm run test`
