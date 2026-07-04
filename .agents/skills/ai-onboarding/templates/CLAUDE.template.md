# {{PROJECT_NAME}} — Claude Code Context

<!-- CLAUDE.md — Context file for Claude Code (claude.ai/code).
     If AGENTS.md exists in the repo root, this file supplements it with
     Claude-specific guidance. Keep under 150 lines. -->

<!-- When AGENTS.md is present, uncomment the next line: -->
<!-- See AGENTS.md for full project context (architecture, tech stack, conventions). -->

## Project Overview

{{PROJECT_OVERVIEW}}
<!-- Brief 1-2 sentence summary. If AGENTS.md covers this, keep it minimal. -->

## Key Commands

<!-- Only verified commands. Claude will run these directly. -->

```bash
# Install dependencies
{{CMD_INSTALL}}

# Run development server
{{CMD_DEV}}

# Run tests
{{CMD_TEST}}

# Run linter
{{CMD_LINT}}

# Build for production
{{CMD_BUILD}}
```

{{EXTRA_COMMANDS}}

## Coding Standards

{{CODING_STANDARDS}}
<!-- Bullets covering the most impactful conventions:
     - Naming conventions (files, variables, types)
     - Import ordering and style
     - Error handling patterns
     - Formatting rules (indent, quotes, semicolons) -->

## Think Step-by-Step

<!-- Guide Claude to reason carefully on complex tasks. -->

For complex changes:
1. Read the relevant source files before making edits
2. Understand the existing patterns and conventions in the codebase
3. Plan the change — identify all files that need modification
4. Implement incrementally, verifying each step
5. Run tests after changes: `{{CMD_TEST}}`
6. Run linter to catch style issues: `{{CMD_LINT}}`

{{THINK_GUIDANCE}}
<!-- Add project-specific thinking guidance, e.g.:
     - When modifying the API, check all consumers
     - When adding a migration, verify rollback works
     - When changing shared types, grep for all usages -->

## Important Boundaries

{{BOUNDARIES}}
<!-- Critical rules Claude must follow:
     - Never expose secrets or API keys
     - Never modify auto-generated files
     - Always run tests before suggesting changes are complete -->

## Additional Context

<!-- Point to supplementary rule files. -->

{{ADDITIONAL_CONTEXT}}
<!-- e.g. - See .claude/rules/ for topic-specific rules -->
<!-- e.g. - See docs/CONTRIBUTING.md for contribution guidelines -->
