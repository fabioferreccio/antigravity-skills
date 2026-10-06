---
name: local-ai-orchestrator
description: >
  A unified TypeScript orchestrator that exposes 5 hyper-optimized local AI tools
  (AST mapping, Chunked reading, Sandbox, Git Patch, Infra State) with strict JSON Schemas
  and async execution wrappers compatible with Ollama, Claude, and Antigravity.
version: 1.0.0
author: AI Assistant
tags:
  - orchestrator
  - typescript
  - ollama
  - mcp
  - local-ai
triggers:
  - "load local tools"
  - "init local orchestrator"
  - "get schemas for ollama"
scope: workspace
tools:
  - terminal
  - filesystem
security:
  network: false
  filesystem: read-write
  terminal: sandboxed
---

# Goal

Aggregate the 5 previously built skills (`explore-codebase-ast`, `read-file-chunked`, `execute-in-sandbox`, `apply-structural-patch`, `query-homelab-state`) into a single, cohesive TypeScript module based on Clean Architecture. 

This skill acts as a bridge: it exports standard JSON Schemas (tool definitions) and a safe async `executeTool` function so that any agent (Ollama, Claude, or custom scripts) can natively use the tools.

# Architecture

- **Lightweight**: No heavy dependencies. Relies on native Node.js `child_process`.
- **Polyglot Fallback**: It intelligently delegates execution to the existing `python` or `node` scripts present in the repository, avoiding logic duplication.
- **CommonJS**: Compiled to standard JS for maximum compatibility across setups without requiring complex ESModule flags.

# Usage

1. **Install Dependencies**: `cd .agents/skills/local-ai-orchestrator && npm install`
2. **Build**: `npm run build`
3. **Import in your AI loop**:
   ```typescript
   import { getToolSchemas, executeTool } from './.agents/skills/local-ai-orchestrator/dist';
   
   const schemas = getToolSchemas();
   // Pass schemas to Ollama/Claude
   
   // When the model calls a tool:
   const result = await executeTool('read_file_chunked', { filePath: 'src/app.ts', startLine: 1, endLine: 50 });
   ```
