# Example: Integrating with Ollama JS SDK

## Input
In a Node.js script connecting to a local Llama3 instance:

```typescript
import { ollama } from 'ollama';
import { getToolSchemas, executeTool } from '../.agents/skills/local-ai-orchestrator/dist';

async function main() {
  const messages = [{ role: 'user', content: 'What is the current memory usage of the redis container?' }];
  
  const response = await ollama.chat({
    model: 'llama3.1',
    messages,
    tools: getToolSchemas()
  });

  if (response.message.tool_calls) {
    for (const tool of response.message.tool_calls) {
      console.log(`Executing ${tool.function.name}...`);
      const output = await executeTool(tool.function.name, tool.function.arguments);
      
      messages.push(response.message);
      messages.push({ role: 'tool', content: output });
    }
    
    // Send back to the model with the tool output
    const finalResponse = await ollama.chat({ model: 'llama3.1', messages });
    console.log("Model response:", finalResponse.message.content);
  }
}
```

## Expected Output
```text
Executing query_homelab_state...
Model response: The Redis container is currently healthy and using 15MB of RAM.
```
