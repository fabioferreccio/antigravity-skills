# Conventions

<!-- Aider context file: CONVENTIONS.md
     Use imperative language ("Use...", "Always...", "Never...").
     Plain markdown only — no YAML frontmatter.
     Aider loads this file automatically when present in the repo root. -->

## Coding Conventions

{{CODING_CONVENTIONS}}
<!-- Imperative bullets covering style and patterns. e.g.:
- Use 2-space indentation
- Use single quotes for strings
- Add trailing commas in multi-line structures
- Prefer const over let; never use var
- Use descriptive variable names — no single-letter names except in loops
- Keep functions under 40 lines
- Use early returns to reduce nesting
- Add JSDoc comments to all exported functions
-->

## Architecture

{{ARCHITECTURE_RULES}}
<!-- Rules governing project structure and design. e.g.:
- Follow Clean Architecture: dependencies point inward
- Place all business logic in the domain layer
- Never import infrastructure code from domain modules
- Use dependency injection for external services
- Keep controllers thin — delegate to use cases
- Co-locate tests with source files
-->

## Testing

{{TESTING_CONVENTIONS}}
<!-- Testing rules and conventions. e.g.:
- Write tests for every new function or module
- Use descriptive test names: "should [expected behavior] when [condition]"
- Prefer integration tests for API endpoints
- Use factories for test data, not raw objects
- Mock external services, never real APIs in tests
- Run the full test suite before marking work as complete
-->

## Security

{{SECURITY_RULES}}
<!-- Security rules the agent must follow. e.g.:
- Never hardcode secrets, API keys, or passwords
- Always validate and sanitize user input
- Use parameterized queries for all database operations
- Never log sensitive data (passwords, tokens, PII)
- Use HTTPS for all external API calls
- Apply principle of least privilege for all permissions
-->
