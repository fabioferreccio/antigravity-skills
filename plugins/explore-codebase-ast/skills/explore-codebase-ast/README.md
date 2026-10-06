# explore-codebase-ast

Map a project's architecture efficiently by analyzing its Abstract Syntax Tree (AST). This skill reads through the directory structure and parses code files using `tree-sitter`, identifying classes, methods, interfaces, and inheritances. This avoids loading massive files into the AI's context window.

## Usage

You can trigger this skill by asking the AI to explore the codebase using the slash command:

```
/explore <directory> <extensions> <depth>
```

Alternatively, use natural language:
- "Map the codebase architecture in ./src for .ts and .js files up to depth 3"
- "Analyze AST of directory ./lib"

## Requirements

This skill attempts to use Python or Node.js dynamically. 
For Python, it requires `tree-sitter` and `tree-sitter-languages` (which provides polyglot support for C#, Java, TS, JS, Python, Go, Ruby, etc.).

## Output

The skill generates a Markdown structural map of the requested directory, making it highly token-efficient and easy for the AI to reason about system architecture before diving into specific file logic.
