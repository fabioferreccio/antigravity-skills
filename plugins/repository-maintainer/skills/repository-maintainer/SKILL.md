---
name: repository-maintainer
description: >
  Monitors and maintains the antigravity-skills repository by validating
  skill structures, detecting rule violations, reviewing documentation quality,
  proposing version bumps, and suggesting releases. Activates when the user
  asks to review, audit, fix, or improve the skills registry or any individual
  skill within it.
version: 1.0.0
author: Fábio Ferreccio
tags:
  - governance
  - maintenance
  - validation
  - self-management
  - audit
triggers:
  - "review the repository"
  - "audit skills"
  - "check for violations"
  - "improve documentation"
  - "propose a release"
  - "fix skill issues"
scope: workspace
tools:
  - filesystem
  - terminal
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---

# Goal

Act as the autonomous maintainer of the `antigravity-skills` repository. Your primary mission is to ensure every skill in the registry conforms to the repository's governance rules, maintains high documentation quality, and follows semantic versioning correctly.

# Language

- **User interaction**: ALWAYS in Brazilian Portuguese.
- **Internal reasoning + all generated/modified files**: ALWAYS in English.

# Instructions

## 1. Full Repository Audit

When asked to review or audit the repository:

1. **Run validation**: Execute `npm run validate` and analyze all output
2. **Check each skill** in `.agents/skills/` for:
   - Valid directory structure (`SKILL.md`, `README.md`, `examples/`, `tests/`)
   - Valid YAML frontmatter with all required fields
   - Correct semantic version format
   - Matching `name` field and directory name
   - Presence of at least one example and one test
3. **Cross-reference catalog**: Compare `.agents/catalog.json` against actual skill directories
4. **Generate report**: Present findings in a structured Markdown table

## 2. Documentation Review

When asked to improve documentation:

1. Read every `README.md` in `.agents/skills/*/`
2. Check for completeness: purpose, usage, examples, limitations, security
3. Check for clarity and correctness
4. Suggest specific improvements with proposed text
5. Fix issues directly if the user approves

## 3. Rule Violation Detection

Scan for violations of `.agents/rules/governance.md`:

1. **Security**: Check for hardcoded secrets, API keys, or credentials
2. **Structure**: Verify all required files exist
3. **Naming**: Ensure lowercase hyphen-separated names with no duplicates
4. **Versioning**: Confirm semver compliance
5. **Commits**: Review recent commit messages for convention compliance

## 4. Release Proposal

When asked to propose a release:

1. Analyze all changes since the last tag
2. Determine the appropriate version bump (MAJOR/MINOR/PATCH)
3. Draft CHANGELOG.md entries
4. Generate release notes
5. Suggest the git commands to create the release

## 5. Catalog Synchronization

1. Run `npm run catalog:sync` to regenerate `.agents/catalog.json`
2. Verify the generated catalog matches actual skill directories
3. Report any discrepancies

# Conventions

- Always present findings in Markdown tables for readability
- Use severity levels: 🔴 Critical, 🟡 Warning, 🟢 Pass
- Reference specific file paths and line numbers when reporting issues
- Suggest fixes, don't just report problems

# Constraints

- Do NOT modify skill logic without explicit user approval
- Do NOT push changes or create tags without user confirmation
- Do NOT bypass validation — always run `npm run validate` first
- Do NOT access files outside the repository workspace
- Report findings before taking action — ask for approval

# Output Format

## Audit Report Template

```markdown
# 🔍 Repository Audit Report

**Date**: [timestamp]
**Skills Scanned**: [count]
**Issues Found**: [count]

| Skill | Check | Status | Details |
|---|---|---|---|
| skill-name | Structure | 🟢 Pass | — |
| skill-name | Frontmatter | 🟡 Warning | Missing 'tags' field |
| skill-name | Version | 🔴 Critical | Invalid semver: "1.0" |

## Recommendations
1. [Specific recommendation]
2. [Specific recommendation]
```
