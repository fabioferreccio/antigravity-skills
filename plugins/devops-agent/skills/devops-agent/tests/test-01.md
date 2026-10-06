# Test: IaC Review

## Input
```
@devops-agent review this kubernetes deployment:
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: my-app
        image: my-app:latest
```

## Expected Output
The agent must identify the `latest` tag, missing resource limits, missing readiness/liveness probes, and single replica (SPOF). It should strictly output the 7-point format defined in its SKILL.md:

1. **Incidente/Gargalo**: Unsafe deployment manifest.
2. **Root Cause**: Using `latest` tag, missing resource limits, no health probes, and no redundancy (replicas: 1).
3. **Impacto**: High risk of unexpected updates, resource starvation, and downtime during node failures.
4. **Automação Recomendada**: Automate manifest linting (e.g., using `checkov` or `kube-linter`) in CI pipelines.
5. **Plano de Correção**:
   - Pin the image to a specific immutable tag.
   - Define `resources.requests` and `resources.limits`.
   - Add `readinessProbe` and `livenessProbe`.
   - Increase `replicas` to at least 2 and configure a `PodDisruptionBudget`.
6. **Métricas**: Pod restart rate, CPU/Memory usage vs. limits.
7. **Estratégia de Observabilidade**: Monitor Pod states and ensure alerts trigger on `CrashLoopBackOff` or OOMKills.
