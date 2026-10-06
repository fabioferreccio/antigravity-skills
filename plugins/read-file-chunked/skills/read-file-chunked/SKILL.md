---
name: read-file-chunked
description: >
  Reads large files in specific chunks with pagination, providing exact lines to the model.
  Prevents context window overflow and VRAM spikes by extracting only the requested subset of lines.
version: 1.0.0
author: AI Assistant
tags:
  - context-optimization
  - file-reading
  - pagination
  - efficiency
triggers:
  - "/read <arquivo> [linha_inicio] [linha_fim]"
  - "read file chunk"
  - "read lines from file"
scope: workspace
tools:
  - terminal
security:
  network: false
  filesystem: read
  terminal: sandboxed
---

# Goal

Allow the AI to read precise chunks of large files (e.g. from line 100 to 150) without blowing up the context window. It's highly optimized for token usage and memory efficiency.

# Instructions

1. **Validate Environment**:
   - Check if Python is installed (`python --version` or `python3 --version`).
   - Check if Node.js is installed (`node --version`).
   - Use whichever runtime is available in the user's environment.

2. **Execute Reader**:
   - Ensure you pass the `file_path`, `start_line` (default: 1), and `end_line` (default: 100 if omitted).
   - If Python: `python .agents/skills/read-file-chunked/scripts/read.py <file_path> <start_line> <end_line>`
   - If Node.js: `node .agents/skills/read-file-chunked/scripts/read.js <file_path> <start_line> <end_line>`

3. **Present Output**:
   - The script will output the requested lines, prefixed with line numbers (e.g., ` 100 | function test() {`).
   - Use this extracted snippet for internal reasoning or present the relevant parts to the user.

# Conventions

- **Line Numbers**: The output explicitly includes line numbers to allow the AI to propose precise edits later.
- **Fallbacks**: If the end line is greater than the file length, it just stops at the EOF.

# Constraints

- Do NOT attempt to read more than 300 lines at once. If the user requests `start: 1, end: 10000`, override the `end_line` to `300` and paginate in subsequent calls if needed.
- ONLY read files within the workspace scope.
