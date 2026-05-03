---
name: skill-template
description: >
  Base template for creating new Antigravity Skills. Replace all
  placeholder content with your skill's specific information.
version: 1.0.0
author: Your Name <your@email.com>
tags:
  - tag-1
  - tag-2
  - tag-3
triggers:
  - "describe when this skill should activate"
  - "another trigger phrase"
scope: workspace
tools:
  - filesystem
security:
  network: false
  filesystem: read
  terminal: sandboxed
---

# Goal

<!-- Clearly state what this skill accomplishes in 1-2 sentences -->

Replace this with a clear, concise description of the skill's primary objective.

# Instructions

<!-- Step-by-step execution flow for the agent -->

1. **Analyze** the user's request to understand the specific requirements
2. **Gather** necessary context from the workspace
3. **Execute** the core logic of this skill
4. **Validate** the output meets quality standards
5. **Present** results to the user in a clear format

# Conventions

<!-- Standards and patterns the agent must follow -->

- Follow existing project conventions
- Use consistent naming patterns
- Produce deterministic, reproducible outputs
- Include error handling for edge cases

# Constraints

<!-- Security limitations and operational boundaries -->

- Do NOT modify files outside the designated scope
- Do NOT execute destructive commands without user approval
- Do NOT store sensitive information in output files
- ALWAYS validate inputs before processing

# Output Format

<!-- Define the expected structure of the skill's output -->

The skill should produce:

1. A summary of actions taken
2. Any generated files or modifications
3. Validation results (if applicable)

# Examples

## Example 1: Basic Usage

### Input
```
User request: "Apply this skill to the current project"
```

### Expected Output
```
✅ Skill executed successfully
- Action 1 completed
- Action 2 completed
- No issues detected
```
