# Test Suite: query-homelab-state

## Prompt 1: Query existing Docker container
**Input**: `/infra_status "redis" "false"`
**Expected**: Script finds `redis` in `docker ps`, runs `docker stats`, skips logs, and returns the Markdown report.

## Prompt 2: Fallback to Kubernetes
**Input**: `/infra_status "frontend-api" "true"`
**Expected**: Script doesn't find `frontend-api` in Docker. Falls back to `kubectl get pods -l app=frontend-api`. Finds the pod, extracts `kubectl top` metrics and pulls the last 100 lines of logs.

## Prompt 3: Service not found
**Input**: `/infra_status "nonexistent_service"`
**Expected**: Fails Docker check. Fails Kubernetes check. Returns `[ERROR] Service 'nonexistent_service' not found`.

## Prompt 4: Handling missing kubectl/docker
**Input**: Execution on an environment without `docker` or `kubectl`.
**Expected**: The `subprocess.run` calls will fail cleanly (exit code > 0) without crashing the Python/Node wrapper, falling through to the "Service not found" error safely.
