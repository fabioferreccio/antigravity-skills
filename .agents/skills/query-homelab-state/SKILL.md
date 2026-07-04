---
name: query-homelab-state
description: >
  Query the health, available resources (CPU/RAM), and logs of specific containers running in a local cluster or Docker host.
  Acts as a DevOps SRE agent automatically detecting between Docker and Kubernetes (kubectl).
version: 1.0.0
author: AI Assistant
tags:
  - devops
  - monitoring
  - docker
  - kubernetes
  - sre
triggers:
  - "/infra_status <target_service> [fetch_logs]"
  - "why is my container down"
  - "check the logs for"
  - "get status of service"
scope: workspace
tools:
  - terminal
security:
  network: false
  filesystem: read-only
  terminal: sandboxed
---

# Goal

Allow the AI to debug local infrastructure (databases, APIs, monitoring services) autonomously by safely extracting CPU/RAM metrics, health status, and truncated logs (tail=100) from Docker or Kubernetes without requiring the user to open the terminal.

# Instructions

1. **Verify Environment**:
   - Determine if Python (`python`) or Node.js (`node`) is available to run the wrapper.

2. **Execute Wrapper**:
   - Pass the `target_service` and `fetch_logs` (true/false) to the wrapper.
   - Python: `python .agents/skills/query-homelab-state/scripts/query_infra.py "<target_service>" "<fetch_logs>"`
   - Node: `node .agents/skills/query-homelab-state/scripts/query_infra.js "<target_service>" "<fetch_logs>"`

3. **Orchestrator Fallback**:
   - The script will natively try to query `docker` first.
   - If the container is not found in Docker, the script will automatically fallback to `kubectl` to search for pods matching the target service.

4. **Analyze Output**:
   - Read the aggregated Markdown report returned by the script.
   - The report contains: Service Name, Platform (Docker/K8s), Status, CPU/RAM usage, and optionally the last 100 lines of logs.
   - Use this data to diagnose issues (e.g. OOMKilled, CrashLoopBackOff, application errors) and proactively present a root cause analysis to the user.

# Conventions

- **Log Limit**: To prevent context window overflows, logs are strictly limited to the last 100 lines.
- **Read-Only**: This skill is exclusively for querying state. It cannot restart, delete, or modify containers.

# Constraints

- Do NOT attempt to install `docker` or `kubectl`. Assume they are pre-configured by the user.
