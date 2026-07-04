# Test Suite: local-ai-orchestrator

## Prompt 1: Verify Schema Export
**Input**: Calling `getToolSchemas()` programmatically.
**Expected**: Returns an array of exactly 5 JSON Schema objects containing `function.name`, `function.description`, and `function.parameters`.

## Prompt 2: Dispatch Valid Tool
**Input**: Calling `executeTool('read_file_chunked', { filePath: 'package.json', startLine: 1, endLine: 5 })`
**Expected**: The TypeScript wrapper invokes `child_process.execSync` passing the arguments to the `read_chunk.js/py` script safely, returning the output as a string.

## Prompt 3: Invalid Tool Request
**Input**: Calling `executeTool('delete_database', {})`
**Expected**: Throws `Error: Tool 'delete_database' is not supported by the local orchestrator.`
