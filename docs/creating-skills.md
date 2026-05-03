# Creating Your First Skill

This guide walks you through creating a new Antigravity Skill from scratch.

## Prerequisites

- Node.js >= 18
- This repository cloned locally
- `npm install` completed

## Step 1: Scaffold the Skill

Use the built-in scaffolder:

```bash
node scripts/scaffold-skill.js --name my-first-skill --author "Your Name <email>"
```

This creates:

```
.agents/skills/my-first-skill/
├── SKILL.md
├── README.md
├── examples/
│   └── example-01.md
└── tests/
    └── test-01.md
```

## Step 2: Define the Skill Logic

Edit `SKILL.md` and replace all `TODO` placeholders:

### Frontmatter

```yaml
---
name: my-first-skill
description: >
  Formats JavaScript files using consistent indentation and
  removes trailing whitespace. Activates when the user asks
  to clean up or format their code files.
version: 1.0.0
author: Your Name <your@email.com>
tags:
  - formatting
  - javascript
  - code-quality
triggers:
  - "format my code"
  - "clean up this file"
scope: workspace
tools:
  - filesystem
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---
```

### Body

Write clear, step-by-step instructions for the agent.

## Step 3: Document the Skill

Edit `README.md` with:
- Clear overview
- When to use (and when NOT to)
- Installation instructions
- At least one example
- Known limitations

## Step 4: Add Examples and Tests

### Example (`examples/example-01.md`)
Show a realistic user request and expected agent behavior.

### Test (`tests/test-01.md`)
Define setup, steps, expected behavior, and validation criteria.

## Step 5: Validate

```bash
npm run validate
```

All checks should pass.

## Step 6: Sync Catalog

```bash
npm run catalog:sync
```

## Step 7: Commit and PR

```bash
git add .
git commit -m "feat(skills): add my-first-skill v1.0.0"
git push origin feat/my-first-skill
```

Open a Pull Request using the provided template.

## Tips

1. **Be specific in descriptions** — vague descriptions cause false activations
2. **Write in third person** — "Formats JavaScript files..." not "Format JavaScript files..."
3. **Think about security** — declare all access requirements upfront
4. **Start simple** — Level 1-2 skills are easier to get right
5. **Test with Antigravity** — actually use the skill in an Antigravity session
