# {{PROJECT_NAME}} — Copilot Instructions

<!-- GitHub Copilot repo-wide context: .github/copilot-instructions.md
     No YAML frontmatter. Copilot reads this file for repo-wide guidance.
     Keep focused on what Copilot needs to generate correct code. -->

## Project Overview

{{PROJECT_OVERVIEW}}
<!-- 2-3 sentences describing the project purpose and domain. -->

## Tech Stack

{{TECH_STACK}}
<!-- Bulleted list of key technologies. e.g.:
     - Language: TypeScript 5.x (strict mode)
     - Framework: Next.js 14 (App Router)
     - Database: PostgreSQL with Prisma ORM
     - Testing: Vitest + React Testing Library -->

## Coding Standards

{{CODING_STANDARDS}}
<!-- Key conventions Copilot must follow when generating code:
     - Naming: camelCase for variables, PascalCase for types
     - Imports: group by external → internal → types
     - Error handling: use Result pattern, no uncaught promises
     - Style: 2-space indent, single quotes, trailing commas -->

## Build, Test & Lint Commands

{{COMMANDS}}
<!-- Verified commands for common tasks:
     - Install: npm ci
     - Dev: npm run dev
     - Test: npm test
     - Lint: npm run lint
     - Build: npm run build -->

## Security & Error Handling

{{SECURITY_RULES}}
<!-- Rules for safe code generation:
     - Never hardcode secrets, API keys, or credentials
     - Always validate and sanitize user input
     - Use parameterized queries, never string concatenation for SQL
     - Handle errors explicitly — no empty catch blocks
     - Log errors with context but never log sensitive data -->
