# {{PROJECT_NAME}} — Gemini Code Assist Context

<!-- Gemini Code Assist context file: GEMINI.md
     If AGENTS.md exists, reference it for shared context.
     Add only Gemini-specific guidance here. -->

<!-- When AGENTS.md is present, uncomment the next line: -->
<!-- See AGENTS.md for full project context (architecture, tech stack, conventions). -->

## Project Overview

{{PROJECT_OVERVIEW}}
<!-- Brief summary. Minimize duplication with AGENTS.md. -->

## Key Commands

{{COMMANDS}}
<!-- Verified commands for common development tasks. e.g.:
- Install: npm ci
- Dev: npm run dev
- Test: npm test
- Lint: npm run lint
- Build: npm run build
-->

## Conventions

{{CONVENTIONS}}
<!-- Key coding conventions. e.g.:
- Use TypeScript strict mode
- Prefer named exports
- Follow the existing import ordering
-->

## Boundaries

{{BOUNDARIES}}
<!-- Things the agent must never do. e.g.:
- Never commit secrets or API keys
- Never modify generated files
-->

## Gemini-Specific Configuration

{{GEMINI_SPECIFIC}}
<!-- Gemini Code Assist specific settings and pointers. e.g.:
- Style guide: Follow Google TypeScript Style Guide
- Code review: Enabled via .gemini/config.yaml
- Severity threshold: See .gemini/config.yaml for comment_severity_threshold
- Custom rules: See .gemini/rules/ for topic-specific rules
-->

## Additional References

<!-- Point to config and rule files that Gemini should be aware of. -->
- Configuration: `.gemini/config.yaml`
- Rules: `.gemini/rules/`
