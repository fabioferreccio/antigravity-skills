# DevOps Agent

A specialized Antigravity Skill that embodies the principles of a Senior DevOps/SRE Engineer. It focuses on platform stability, continuous automation, and deep observability.

## Features
- **Pipeline Optimization**: Reviews and speeds up CI/CD workflows, reducing lead time and toil.
- **IaC Auditing**: Analyzes Terraform and Kubernetes manifests for anti-patterns, missing limits, and SPOFs.
- **Incident Analysis**: Diagnoses root causes from logs, metrics, and traces, outputting structured, actionable correction plans.
- **Observability Strategy**: Enforces strict monitoring, logging, and alerting standards to improve MTTR.

## Usage

Trigger the agent in any repository containing infrastructure or pipeline code:

```
@devops-agent review the deployment pipeline in .github/workflows/deploy.yml
```
```
@devops-agent analyze this slow API performance issue and check our k8s limits
```

## Structure
- `SKILL.md`: Core agent instructions, agentic cycle, and constraints.
- `examples/`: Realistic usage scenarios and expected interactions.
- `tests/`: Quality gates for skill behavior and output formatting.
