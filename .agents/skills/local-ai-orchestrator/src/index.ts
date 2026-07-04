import { ToolSchemas } from './domain/schemas';
import {
  executeExploreCodebaseAst,
  executeReadFileChunked,
  executeInSandbox,
  executeApplyStructuralPatch,
  executeQueryHomelabState
} from './infrastructure/executor';

/**
 * Returns the standardized JSON Schemas for the tools, 
 * ready to be injected into Ollama, Claude, or Antigravity's tool definitions.
 */
export function getToolSchemas() {
  return ToolSchemas;
}

/**
 * Executes a tool by name with the given arguments.
 * Automatically delegates to the appropriate underlying script (.py or .js)
 * based on the host environment's capabilities.
 */
export async function executeTool(toolName: string, args: any): Promise<string> {
  switch (toolName) {
    case 'explore_codebase_ast':
      return await executeExploreCodebaseAst(args);
    case 'read_file_chunked':
      return await executeReadFileChunked(args);
    case 'execute_in_sandbox':
      return await executeInSandbox(args);
    case 'apply_structural_patch':
      return await executeApplyStructuralPatch(args);
    case 'query_homelab_state':
      return await executeQueryHomelabState(args);
    default:
      throw new Error(`Tool '${toolName}' is not supported by the local orchestrator.`);
  }
}
