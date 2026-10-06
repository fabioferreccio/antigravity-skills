# execute-in-sandbox

Executes unit tests, build commands, or arbitrary scripts safely inside a Docker sandbox. This protects your host machine from dangerous commands (like `rm -rf /`) while allowing the AI to run tests and self-correct its code autonomously.

## Usage

Trigger the skill using the slash command:

```
/run_test "<command>" [docker_image] [timeout_ms]
```

Alternatively, use natural language:
- "Run `npm test` in a sandbox using the `node:18` image."
- "Test this Python script safely using `python:3.10`."

## Requirements

1. **Docker**: Must be installed and running on the host machine.
2. **Python or Node.js**: Required to run the internal wrapper scripts that handle timeouts and stream segregation.

## Security Model

To ensure maximum safety:
- The workspace directory is mounted inside the Docker container as **Read-Only** (`:ro`).
- Network access might be available depending on the docker configuration, but host files cannot be altered by the container.
- A strict execution timeout is enforced.
