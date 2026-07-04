# apply-structural-patch

Applies surgical code changes using unified Git patch format instead of rewriting the whole file in the chat. This drastically reduces AI output tokens and speeds up interactions by editing files surgically.

## Usage

Trigger the skill using the slash command:

```
/apply_patch <file_path> <patch_content>
```

Alternatively, use natural language:
- "Apply this patch to `src/utils.js`"
- "Use the surgical edit skill to change the validation in `app.py`"

## Requirements

1. **git or patch utility**: The system must have `git apply` or standard `patch` available in the PATH. Most developer machines natively support this.
2. **Python or Node.js**: Required to run the internal wrapper scripts that handle the temporary `.patch` file creation and execution.

## Benefits
- **Token Efficiency**: Changing 2 lines in a 1000-line file costs only the patch output, saving hundreds of thousands of tokens over a session.
- **Speed**: The AI response completes much faster.
- **Safety**: Uses standard Git mechanisms to ensure the patch applies correctly without breaking the surrounding AST structure.
