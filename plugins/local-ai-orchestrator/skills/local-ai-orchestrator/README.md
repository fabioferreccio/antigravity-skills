# local-ai-orchestrator

A TypeScript meta-skill that bundles our 5 advanced local tools into a single, zero-dependency Node.js library. It uses Clean Architecture to decouple the JSON Schema definitions from the async execution logic.

## Supported Tools
1. `explore_codebase_ast`
2. `read_file_chunked`
3. `execute_in_sandbox`
4. `apply_structural_patch`
5. `query_homelab_state`

## How it Works
The orchestrator exports two main elements:
1. `getToolSchemas()`: Returns the OpenAI/Ollama compliant JSON Schemas for the tools.
2. `executeTool(toolName, args)`: A secure async wrapper that maps the tool call to the respective polyglot script (`.py` or `.js`) residing in your repository. It automatically detects if you have Node or Python installed and routes the execution safely.

## Setup
```bash
cd .agents/skills/local-ai-orchestrator
npm install
npm run build
```

## Integration Example
```typescript
import { getToolSchemas, executeTool } from './dist';

// 1. Give tools to Ollama
const ollamaPayload = {
  model: 'llama3',
  messages: [...],
  tools: getToolSchemas()
};

// 2. Execute requested tool
const result = await executeTool(
  response.message.tool_calls[0].function.name,
  response.message.tool_calls[0].function.arguments
);
console.log(result.stdout);
```
