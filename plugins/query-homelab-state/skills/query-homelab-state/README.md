# query-homelab-state

A DevOps/SRE skill that empowers the AI to debug your local infrastructure directly. It queries container status, resource usage (CPU/RAM), and logs from both Docker and Kubernetes.

## Usage

Trigger the skill using the slash command:

```
/infra_status <target_service> [fetch_logs: true/false]
```

Alternatively, use natural language:
- "Why did my `postgres-db` container crash?"
- "Check the logs for the `redis` service in my cluster."
- "What's the memory usage of the `api-backend` pod?"

## Features

- **Smart Orchestrator Detection**: The script automatically checks Docker first. If the service isn't found, it falls back to Kubernetes (`kubectl`) to locate matching pods.
- **Context Protection**: Logs are strictly capped at 100 lines (`--tail=100`) to prevent crashing the AI's context window.
- **Read-Only Safety**: The script only executes read operations (`ps`, `stats`, `logs`, `get pods`, `top`). It will never delete or restart your workloads.

## Requirements

1. **Docker**: `docker` must be available in the PATH and the user must have socket permissions.
2. **Kubernetes (Optional)**: `kubectl` must be configured with a valid `kubeconfig` if targeting K8s workloads.
3. **Python or Node.js**: Required to run the internal aggregator scripts.
