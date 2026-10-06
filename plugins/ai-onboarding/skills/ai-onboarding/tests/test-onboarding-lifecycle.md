# Test: ai-onboarding v1.0.0 — Complete Lifecycle

## Test ID
`ao-test-001`

## Description
Verify that ai-onboarding performs full repo analysis, classification, target
selection, multi-tool generation, validation, and delivery.

## Steps

1. Navigate to a Node.js repository with Express + TypeScript + PostgreSQL
2. Activate: "Configure AI tools for this project"
3. When asked for tool selection, respond: "todas"

## Expected Behavior

1. **Phase 0-1**: Scanner analyzes repo, detects stack, commands, conventions, services
2. **Phase 2**: Classification presented in pt-BR (stack type, complexity, team, maturity)
3. **Phase 3**: Tool selection question asked in pt-BR
4. **Phase 4**: Files generated using templates with real repo data
5. **Phase 5**: Validation passes all checks
6. **Phase 6**: Delivery with file manifest, checklist, and commit suggestion

## Validation Criteria

- [ ] All communication in Portuguese (pt-BR)
- [ ] All generated files in English
- [ ] Stack correctly identified (language, framework, package manager)
- [ ] Commands extracted from real package.json scripts
- [ ] At least one convention extracted from linter/formatter config
- [ ] AGENTS.md generated with all sections filled
- [ ] AGENTS.md under 150 lines
- [ ] CLAUDE.md references AGENTS.md (not full duplicate)
- [ ] .cursor/rules/project.mdc has valid YAML frontmatter
- [ ] .github/copilot-instructions.md created
- [ ] .windsurfrules under 12,000 characters
- [ ] CONVENTIONS.md uses imperative language
- [ ] .aider.conf.yml includes `read: [CONVENTIONS.md, AGENTS.md]`
- [ ] GEMINI.md references AGENTS.md
- [ ] .gemini/config.yaml has valid YAML
- [ ] .antigravity/mcp.json has valid JSON with ${ENV_VAR} placeholders
- [ ] No secrets in any generated file
- [ ] No hardcoded absolute paths
- [ ] Verification checklist presented per tool
- [ ] Git commit message suggested

---

# Test: Update Mode (Existing Configs)

## Test ID
`ao-test-002`

## Description
Verify update mode when existing AI config files are found.

## Steps

1. Navigate to a repo that already has `CLAUDE.md` and `.cursorrules`
2. Activate: "Onboard this repo for AI tools"
3. Select "todas"

## Expected Behavior

1. Scanner detects existing CLAUDE.md and .cursorrules
2. Agent reads and parses existing configs
3. Cross-pollination: existing content used as supplementary input
4. CLAUDE.md is UPDATED (sections added, user content preserved)
5. .cursorrules content migrated to .cursor/rules/project.mdc with frontmatter
6. Other files generated fresh

## Validation Criteria

- [ ] Existing CLAUDE.md content NOT deleted
- [ ] New sections ADDED to CLAUDE.md (not overwriting)
- [ ] .cursorrules content migrated to .cursor/rules/project.mdc
- [ ] YAML frontmatter added to migrated Cursor rules
- [ ] Cross-pollination: existing commands/conventions used in other files
- [ ] Agent mentions "modo update" to user

---

# Test: Guide Mode (No Repository Access)

## Test ID
`ao-test-003`

## Description
Verify guide mode when no repository is accessible.

## Steps

1. In a chat-only session (no files open), say: "Quero configurar IA pro meu projeto"
2. Answer agent's questions about stack

## Expected Behavior

1. Agent detects no repo access
2. Switches to guide mode
3. Asks minimal questions (stack, test command, external services)
4. Produces template files with placeholder content
5. Instructions on where to place each file

## Validation Criteria

- [ ] Agent detects chat-only mode
- [ ] Asks ≤ 5 questions in pt-BR
- [ ] Produces copy-pasteable templates
- [ ] Templates have clear placeholder instructions
- [ ] File placement instructions provided

---

# Test: Monorepo Detection

## Test ID
`ao-test-004`

## Description
Verify monorepo detection and per-package analysis.

## Steps

1. Navigate to a repo with `pnpm-workspace.yaml` and multiple packages
2. Activate: "AI bootstrap"

## Expected Behavior

1. Scanner detects monorepo (pnpm-workspace.yaml)
2. Each package analyzed independently
3. Architecture section lists all packages
4. Commands include workspace-level commands
5. Classification: `monorepo` stack type

## Validation Criteria

- [ ] Monorepo correctly detected
- [ ] All packages listed in architecture section
- [ ] Workspace-level commands included (e.g., `pnpm -w`)
- [ ] Per-package frameworks detected
- [ ] Stack type classified as `monorepo`

---

# Test: Minimal Project (Greenfield)

## Test ID
`ao-test-005`

## Description
Verify graceful handling of a minimal/greenfield project.

## Steps

1. Navigate to a repo with only `package.json` and `index.js`
2. Activate: "Configure AI tools"

## Expected Behavior

1. Scanner finds minimal files
2. Classification: simple, greenfield
3. Generated files are concise (not padding with generic content)
4. Missing info handled gracefully (e.g., no test command → section omitted)

## Validation Criteria

- [ ] No fake commands generated
- [ ] Missing sections omitted (not filled with placeholders)
- [ ] Classification: `simple` complexity
- [ ] Files are shorter than for complex projects
- [ ] Agent doesn't over-generate

---

# Test: Security — No Secret Leakage

## Test ID
`ao-test-006`

## Description
Verify no secrets leak into generated files.

## Steps

1. Navigate to a repo with `.env` file containing real API keys
2. Activate: "AI init"

## Expected Behavior

1. Scanner reads `.env.example` (not `.env`)
2. No secrets appear in any generated file
3. MCP config uses ${ENV_VAR} placeholders only

## Validation Criteria

- [ ] Agent reads `.env.example`, NOT `.env`
- [ ] No API keys, tokens, or passwords in any file
- [ ] MCP config uses `${ENV_VAR}` format exclusively
- [ ] Connection strings use placeholder format
- [ ] Agent warns about secret management best practices

---

# Misuse Test: Non-Repository Context

## Test ID
`ao-test-007`

## Description
Verify behavior when activated outside a code repository.

## Steps

1. Open a directory with only documents (no code files)
2. Activate: "Configure AI tools for this project"

## Expected Behavior

1. Scanner finds no code files
2. Agent explains this doesn't look like a code repository
3. Suggests guide mode or asks user for clarification

## Validation Criteria

- [ ] Agent recognizes non-code directory
- [ ] Does not generate files for a non-code project
- [ ] Offers guide mode as alternative
- [ ] Communication in pt-BR

---

# Misuse Test: Request for Non-Supported Tool

## Test ID
`ao-test-008`

## Description
Verify behavior when user requests a tool not in the supported list.

## Steps

1. Activate and when asked for tools, respond: "Zed e Cody"

## Expected Behavior

1. Agent acknowledges the request
2. Explains Zed reads AGENTS.md (which is generated)
3. Explains Cody (Sourcegraph) is not directly supported
4. Suggests generating AGENTS.md which Zed can read
5. Proceeds with supported tools

## Validation Criteria

- [ ] Unknown tools acknowledged, not ignored
- [ ] AGENTS.md coverage mentioned (cross-tool standard)
- [ ] Agent doesn't crash or skip generation
- [ ] User informed about limitations

---

# Edge Case: Polyglot Repository

## Test ID
`ao-test-009`

## Description
Verify handling of a repo with multiple languages.

## Steps

1. Navigate to a repo with: Python backend, TypeScript frontend, Go microservice
2. Activate: "Make this repo AI-ready"

## Expected Behavior

1. Scanner detects all 3 languages
2. Framework detection runs per-language
3. Architecture section reflects multi-language structure
4. Conventions extracted from each language's config
5. Commands cover all build systems

## Validation Criteria

- [ ] All 3 languages detected
- [ ] Frameworks detected per language
- [ ] Architecture reflects polyglot structure
- [ ] Conventions from all language configs merged
- [ ] Commands from all build systems included

---

# Edge Case: Large Enterprise Codebase

## Test ID
`ao-test-010`

## Description
Verify handling of a very large codebase (1000+ files).

## Steps

1. Navigate to a large enterprise monorepo
2. Activate: "AI onboarding"

## Expected Behavior

1. Scanner completes in reasonable time (< 60 seconds)
2. File tree scan limited to 3 levels depth
3. Heavy directories (node_modules, vendor) skipped
4. Generated files are still concise (not 1000 lines)
5. Only the most important conventions and commands included

## Validation Criteria

- [ ] Scan completes without timeout
- [ ] Generated AGENTS.md still under 150 lines
- [ ] Most important dirs and commands prioritized
- [ ] No performance degradation
- [ ] Classification: `enterprise` complexity

---

# Edge Case: Conflicting Existing Configs

## Test ID
`ao-test-011`

## Description
Verify handling when existing AI configs contradict each other.

## Steps

1. Navigate to a repo where CLAUDE.md says "use 4-space indent"
   and .cursorrules says "use 2-space indent"
2. Activate: "Configure AI tools"

## Expected Behavior

1. Scanner detects both configs
2. Agent identifies the contradiction
3. Checks `.editorconfig` or formatter config for ground truth
4. If ambiguous, asks the user which is correct
5. Resolves consistently across all generated files

## Validation Criteria

- [ ] Contradiction detected and reported
- [ ] Ground truth sought from config files
- [ ] User asked if ambiguous (in pt-BR)
- [ ] Resolution applied consistently across all files
- [ ] No contradictory conventions in output

---

# Edge Case: Portuguese Trigger Phrases

## Test ID
`ao-test-012`

## Description
Verify activation from Portuguese trigger phrases.

## Test Cases

| Trigger | Should Activate? |
|---|---|
| "Configura as ferramentas de IA" | ✅ Yes |
| "Primeira sessão de IA" | ✅ Yes |
| "Quero deixar o repo pronto pra IA" | ✅ Yes |
| "AI bootstrap" | ✅ Yes |
| "Gera o AGENTS.md e o CLAUDE.md" | ✅ Yes |
| "Me ajuda com o código" | ❌ No (generic help) |
| "Revisa meu PR" | ❌ No (code review skill) |
| "Cria uma skill nova" | ❌ No (skill-creator) |

## Validation Criteria

- [ ] All positive triggers activate the skill
- [ ] No false positives from generic requests
- [ ] No activation overlap with other skills (code-review, skill-creator)

---

# Edge Case: Existing .agents/ Directory

## Test ID
`ao-test-013`

## Description
Verify that existing `.agents/` directory content is preserved.

## Steps

1. Navigate to a repo with `.agents/skills/my-skill/` and `.agents/rules/custom.md`
2. Activate: "AI init"

## Expected Behavior

1. Scanner detects existing `.agents/` directory
2. Existing skills NOT modified or deleted
3. Existing rules NOT overwritten
4. New rules ADDED alongside existing ones
5. No file conflicts

## Validation Criteria

- [ ] Existing skills preserved (not modified)
- [ ] Existing rules preserved (not overwritten)
- [ ] New rules added with different names (no collision)
- [ ] Agent mentions existing config in summary
