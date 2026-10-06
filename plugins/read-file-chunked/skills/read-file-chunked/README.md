# read-file-chunked

A highly optimized skill designed to read large files in specific, paginated chunks. This avoids context window overflow and excessive token usage when an AI agent needs to inspect a large codebase file.

## Usage

You can trigger this skill by asking the AI to read a file with specific lines using the slash command:

```
/read <file_path> <start_line> <end_line>
```

Alternatively, use natural language:
- "Read the first 50 lines of src/utils/helper.js"
- "Show me lines 150 to 200 from config/settings.json"

## Requirements

The skill intelligently detects whether Python or Node.js is installed on your system and runs the respective internal script to read the file chunk. It requires no external dependencies.

## Output

The skill outputs the extracted text with exact line numbers appended at the start of each line, ensuring the AI can propose highly precise edits.
