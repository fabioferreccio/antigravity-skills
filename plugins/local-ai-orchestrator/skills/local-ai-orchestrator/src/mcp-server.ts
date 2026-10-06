import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getToolSchemas, executeTool } from "./index";

// Initialize the MCP Server
const server = new Server(
  {
    name: "local-ai-orchestrator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tool Discovery
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const schemas = getToolSchemas();
  
  return {
    tools: schemas.map((schema: any) => ({
      name: schema.function.name,
      description: schema.function.description,
      inputSchema: schema.function.parameters,
    })),
  };
});

// Register Tool Execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const result = await executeTool(name, args || {});
    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error executing tool '${name}': ${error.message || String(error)}`,
        },
      ],
    };
  }
});

// Connect the Stdio Transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Local AI Orchestrator MCP Server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running MCP Server:", error);
  process.exit(1);
});
