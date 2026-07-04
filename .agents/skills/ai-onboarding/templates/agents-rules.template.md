# {{RULE_TOPIC}}

<!-- Workspace rule file: .agents/rules/*.md
     Loaded automatically by Antigravity for every agent interaction.
     Keep rules concise and actionable. One topic per file. -->

## Rule

{{RULE_CONTENT}}
<!-- Concise, actionable bullets. e.g.:
- All API endpoints must validate request bodies against a schema
- Use the shared error handler — never catch and swallow errors silently
- Database queries must use parameterized statements
- Log all mutations with actor ID and timestamp
- Responses must follow the standard envelope format: { data, error, meta }
-->

## When Enforced

{{WHEN_ENFORCED}}
<!-- When does this rule apply? e.g.:
- Every commit (pre-commit hook validates)
- Every code review (reviewer checklist item)
- Every deployment (CI pipeline gate)
- Every PR that touches src/api/
-->

## Exceptions

{{EXCEPTIONS}}
<!-- When can this rule be relaxed? e.g.:
- Prototyping or spike branches (must not be merged to main)
- Test fixtures that intentionally test error paths
- Legacy code under active migration (tracked in JIRA-1234)
- None — this rule has no exceptions
-->
