# {{PROJECT_NAME}}

<!-- AGENTS.md — Cross-tool context file recognized by Antigravity, Cursor, Copilot, and others.
     Fill every {{PLACEHOLDER}} with real data extracted from repo analysis.
     Keep this file under ~150 lines so every tool can ingest it fully. -->

## Project Overview

{{PROJECT_OVERVIEW}}
<!-- 2-3 sentences: what the project does, who it serves, core value proposition. -->

## Architecture

<!-- List the key directories and their purpose. Only include directories that exist. -->

```
{{ARCHITECTURE_TREE}}
```

| Directory | Purpose |
|-----------|---------|
{{ARCHITECTURE_TABLE}}
<!-- e.g. | src/         | Application source code          | -->
<!-- e.g. | tests/       | Unit and integration tests       | -->
<!-- e.g. | docs/        | Project documentation            | -->

## Tech Stack

| Layer            | Technology       |
|------------------|------------------|
| Language         | {{LANGUAGE}}     |
| Framework        | {{FRAMEWORK}}    |
| Package Manager  | {{PACKAGE_MANAGER}} |
| Runtime          | {{RUNTIME}}      |
| Database         | {{DATABASE}}     |
| Test Framework   | {{TEST_FRAMEWORK}} |
| Linter           | {{LINTER}}       |
| Formatter        | {{FORMATTER}}    |

## Commands

<!-- IMPORTANT: Only include commands that were VERIFIED to work. Never guess. -->

| Task    | Command              |
|---------|----------------------|
| Install | `{{CMD_INSTALL}}`    |
| Dev     | `{{CMD_DEV}}`        |
| Test    | `{{CMD_TEST}}`       |
| Lint    | `{{CMD_LINT}}`       |
| Build   | `{{CMD_BUILD}}`      |
{{EXTRA_COMMANDS}}
<!-- Add additional verified commands as needed -->

## Conventions

<!-- 5-10 bullets derived from linter configs, editorconfig, or team standards. -->

{{CONVENTIONS}}
<!-- e.g. - Use single quotes for strings -->
<!-- e.g. - Indent with 2 spaces -->
<!-- e.g. - Trailing commas in multi-line structures -->
<!-- e.g. - Prefer named exports over default exports -->
<!-- e.g. - File names use kebab-case -->

## Boundaries

<!-- Things the agent must NEVER do in this project. -->

{{BOUNDARIES}}
<!-- e.g. - Never commit .env files or secrets -->
<!-- e.g. - Never modify generated files (*.gen.ts, *.generated.go) -->
<!-- e.g. - Never squash or rewrite merged migrations -->
<!-- e.g. - Never run destructive commands without explicit approval -->

## Pointers

<!-- References to additional context files the agent should consult. -->

{{POINTERS}}
<!-- e.g. - Rules: .agents/rules/ -->
<!-- e.g. - Skills: .agents/skills/ -->
<!-- e.g. - ADRs: docs/adr/ -->
