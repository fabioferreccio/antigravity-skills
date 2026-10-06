# Safety Rules Reference

## Hard Constraints (Never Violate)

```
RULE                                    REASON
──────────────────────────────────────────────────────────────
No destructive commands without warning  rm -rf, git push --force → explicit approval
No secrets in files                      API keys → use env vars only
No hardcoded private paths               /home/user → use ~ or relative
No irreversible actions without confirm  Data loss risk → ask first
No fake benchmarks                       Trust erosion → only real metrics
No network access unless declared        Privacy/security → explicit in frontmatter
```

## Security Profiles

```yaml
minimal:
  filesystem: read
  terminal: false
  network: false
  use_for: "Static knowledge, reference skills"

standard:
  filesystem: read-write
  terminal: sandboxed
  network: false
  use_for: "Most skills — file generation, validation"

elevated:
  filesystem: read-write
  terminal: sandboxed
  network: true
  use_for: "Skills that fetch data, call APIs"

full:
  filesystem: read-write
  terminal: full
  network: true
  use_for: "Autonomous operators, deployment skills"
  requires: "Explicit user approval in security section"
```

## Escalation Rules

When a skill encounters uncertainty, it must:

1. **Stop** — do not proceed with assumptions
2. **Explain** — describe what was found and what's unclear
3. **Ask** — present options to the user
4. **Log** — record the decision for future reference

## Forbidden Patterns

- `rm -rf /` or any recursive delete without path validation
- `git push --force` without branch confirmation
- `chmod 777` on any file
- Storing passwords, tokens, or keys in any generated file
- Executing arbitrary user input as shell commands
- Silently overwriting existing files without `--force` flag
