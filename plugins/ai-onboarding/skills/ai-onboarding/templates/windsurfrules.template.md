# {{PROJECT_NAME}} — Windsurf Rules

<!-- Windsurf global rules file: .windsurfrules
     Uses XML-style tags for structured sections.
     Keep under 12,000 characters total. -->

<tech_stack>
{{TECH_STACK_LIST}}
<!-- List each technology on its own line. e.g.:
- Language: TypeScript 5.x
- Framework: Express.js 4.x
- Database: PostgreSQL 16
- ORM: Prisma 5.x
- Runtime: Node.js 20 LTS
- Package Manager: pnpm 9.x
- Test Runner: Vitest
- Linter: ESLint 9 (flat config)
- Formatter: Prettier 3.x
-->
</tech_stack>

<architecture>
{{ARCHITECTURE_OVERVIEW}}
<!-- Describe the project structure and key architectural decisions. e.g.:
- Monorepo managed with Turborepo
- Clean Architecture: domain → application → infrastructure
- Feature-based directory structure under src/features/
- Shared utilities in src/shared/
- API routes in src/api/ following RESTful conventions
- Database migrations in prisma/migrations/
-->
</architecture>

<coding_guidelines>
{{CODING_GUIDELINES}}
<!-- Key coding conventions. e.g.:
- Use strict TypeScript — no `any` types
- Prefer `const` over `let`; never use `var`
- Use async/await, not callbacks or raw Promises
- All functions must have explicit return types
- Use named exports, avoid default exports
- Group imports: external → internal → types
- Maximum function length: 40 lines
- Maximum file length: 300 lines
- Use early returns to reduce nesting
- Error messages must be user-friendly and actionable
-->
</coding_guidelines>

<commands>
{{COMMANDS}}
<!-- Verified commands only. e.g.:
- Install: pnpm install
- Dev: pnpm dev
- Test: pnpm test
- Lint: pnpm lint
- Format: pnpm format
- Build: pnpm build
- Migrate: pnpm prisma migrate dev
-->
</commands>

<do_not>
{{BOUNDARIES}}
<!-- Absolute prohibitions. e.g.:
- Do NOT commit .env files or secrets
- Do NOT modify auto-generated files (*.gen.ts, prisma/client/)
- Do NOT use console.log in production code — use the logger
- Do NOT bypass TypeScript strict mode with @ts-ignore
- Do NOT merge migrations that have already been applied
- Do NOT run destructive database commands without confirmation
- Do NOT install packages without checking for existing alternatives
-->
</do_not>
