# prompt-engineering

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Supreme Skill Architecture

## Overview

Elite interactive prompt engineering system for designing, auditing, optimizing, and evolving prompts for LLMs, agents, and complex AI workflows. It transforms vague intent into production-grade prompt architectures using a multi-agent internal simulation.

## When to Use

- When you need a robust system prompt for a new agent.
- When an existing prompt is failing, inconsistent, or hallucinating.
- When you need to reduce token costs without losing quality.
- When porting prompts between models (e.g., GPT-4 to Claude 3).
- When you need structured, deterministic outputs for automation.

## When NOT to Use

- For simple, one-off questions where a basic prompt suffices.
- For non-AI related text editing.
- When you don't care about token efficiency or output structure.

## Installation

### Local (workspace-scoped)

```bash
npx antigravity install prompt-engineering
```

### Global (available everywhere)

```bash
npx antigravity install prompt-engineering --global
```

## Usage

This skill activates automatically when you ask to create, improve, or optimize prompts. It follows a multi-phase internal logic:
1. **Discovery**: Asks strategic questions in Portuguese to define success metrics.
2. **Simulation**: Internally simulates an Architect, Diagnostician, and Optimizer.
3. **Delivery**: Produces a high-signal English prompt with a Portuguese explanation.

## Examples

### Example 1: Creating a Production Agent Prompt

**User says**: "Crie um prompt para um agente que analisa logs de segurança."

**Agent does**:
1. Classifies as `Creation` + `Agentic`.
2. Asks about log format and specific threats to detect.
3. Simulates the internal agents to design a structured JSON-output prompt.

**Output**:
- **Objective**: Log analysis with threat classification.
- **Final Prompt**: (Detailed system prompt in English)
- **Why It Works**: Explanation of the schema and reasoning chain (in Portuguese).

## Limitations

- Prompt quality depends on the provided context (garbage in, garbage out).
- Model-specific optimizations are based on known best practices and may vary with model updates.

## Security

| Access | Level |
|---|---|
| Filesystem | read-write |
| Terminal | sandboxed |
| Network | false |

## Changelog

See the main [CHANGELOG.md](../../CHANGELOG.md) for version history.

## License

[MIT](../../LICENSE)
