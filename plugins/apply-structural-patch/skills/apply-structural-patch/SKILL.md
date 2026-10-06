---
name: apply-structural-patch
description: >
  Apply surgical code changes using unified Git patch format instead of rewriting the whole file in the chat.
  Drastically reduces output tokens and avoids syntax truncations.
version: 1.0.0
author: AI Assistant
tags:
  - patch
  - git
  - token-optimization
  - surgical-edit
triggers:
  - "/apply_patch <file_path> <patch_content>"
  - "apply git patch"
  - "patch the file"
  - "surgical edit"
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

Apply surgical code edits via unified Git patches instead of generating the entire source file in the response. This saves vast amounts of output tokens, prevents context window limits, and speeds up the AI execution.

# Instructions

1. **Format the Patch**:
   - Ensure the patch string is a valid unified diff format. 
   - It should contain the standard `--- a/file` and `+++ b/file` headers, followed by `@@` hunk headers, and `+`/`-` line additions/removals.

2. **Execute Wrapper**:
   - Determine whether Python (`python`) or Node.js (`node`) is available.
   - Run the respective script, passing the `file_path` and the `patch_content`.
   - Python: `python .agents/skills/apply-structural-patch/scripts/apply_patch.py "<file_path>" "<patch_content>"`
   - Node: `node .agents/skills/apply-structural-patch/scripts/apply_patch.js "<file_path>" "<patch_content>"`

3. **Verify Application**:
   - The script attempts `git apply` first (which handles spacing gracefully) and falls back to `patch` if needed.
   - Read the standard output. If it says `[SUCCESS]`, the code was altered successfully.
   - If it says `[ERROR]`, read the stderr. You might need to regenerate the patch if the line offsets or context lines were wildly inaccurate.

# Conventions

- **Unified Diff Format**: The AI must produce rigorous diff formats for the script to succeed.
- **Temporary Files**: The script writes the patch to a temporary location (`/tmp` or `%TEMP%`), applies it, and deletes the temporary file automatically.

# Constraints

- ONLY apply patches to files within the designated workspace.
- Do NOT generate full files if a simple patch is sufficient.
