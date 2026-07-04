export const ToolSchemas = [
  {
    type: "function",
    function: {
      name: "explore_codebase_ast",
      description: "Map the file tree of a project analyzing the internal structure (AST).",
      parameters: {
        type: "object",
        properties: {
          rootPath: { type: "string" },
          targetTech: { type: "string", enum: ["ts", "js", "py", "go", "cs", "java", "rb"] },
          depth: { type: "number" }
        },
        required: ["rootPath", "targetTech"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "read_file_chunked",
      description: "Read large files in specific chunks with pagination, providing exact lines.",
      parameters: {
        type: "object",
        properties: {
          filePath: { type: "string" },
          startLine: { type: "number" },
          endLine: { type: "number" }
        },
        required: ["filePath", "startLine", "endLine"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "execute_in_sandbox",
      description: "Execute unit tests, build commands, or scripts inside a secure Docker sandbox.",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string" },
          dockerImage: { type: "string" },
          timeoutMs: { type: "number" }
        },
        required: ["command"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "apply_structural_patch",
      description: "Apply surgical code changes using unified Git patch format.",
      parameters: {
        type: "object",
        properties: {
          filePath: { type: "string" },
          patchContent: { type: "string" }
        },
        required: ["filePath", "patchContent"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "query_homelab_state",
      description: "Query health, available resources (CPU/RAM), and logs of local containers in Docker or Kubernetes.",
      parameters: {
        type: "object",
        properties: {
          targetService: { type: "string" },
          fetchLogs: { type: "boolean" }
        },
        required: ["targetService"]
      }
    }
  }
];
