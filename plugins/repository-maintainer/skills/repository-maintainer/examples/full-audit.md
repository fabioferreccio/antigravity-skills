# Example: Full Repository Audit

## User Request

> "Review the entire skills repository and report any issues."

## Expected Agent Behavior

1. The agent activates the `repository-maintainer` skill
2. Runs `npm run validate` to get validation results
3. Scans each skill directory for compliance
4. Cross-references catalog.json with actual directories
5. Generates a structured audit report

## Expected Output

```markdown
# 🔍 Repository Audit Report

**Date**: 2026-05-03T00:30:00-03:00
**Skills Scanned**: 2
**Issues Found**: 0

| Skill | Check | Status | Details |
|---|---|---|---|
| repository-maintainer | Structure | 🟢 Pass | All required files present |
| repository-maintainer | Frontmatter | 🟢 Pass | Valid YAML with all fields |
| repository-maintainer | Version | 🟢 Pass | 1.0.0 (valid semver) |
| repository-maintainer | Docs | 🟢 Pass | README complete |
| skill-creator | Structure | 🟢 Pass | All required files present |
| skill-creator | Frontmatter | 🟢 Pass | Valid YAML with all fields |
| skill-creator | Version | 🟢 Pass | 1.0.0 (valid semver) |
| skill-creator | Docs | 🟢 Pass | README complete |

## Catalog Status
✅ catalog.json is consistent with 2 skills

## Recommendations
No issues found. Repository is fully compliant.
```
