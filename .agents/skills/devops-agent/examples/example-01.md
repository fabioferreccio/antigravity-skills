# Example: Pipeline Optimization

**User**: `@devops-agent Our deployment pipeline is taking 45 minutes to run and failing randomly. Please review .github/workflows/main.yml.`

**DevOps Agent**:

1. **Incidente/Gargalo**: The CI pipeline has a 45-minute execution time and suffers from intermittent test failures (flakiness).
2. **Root Cause**: Tests are running sequentially without caching for `node_modules` or Docker layers. A specific E2E test is failing due to race conditions.
3. **Impacto**: High lead time for changes, developer frustration, and delayed deployments, violating the principle of fast feedback.
4. **Automação Recomendada**: Implement dependency caching, split tests into parallel matrix jobs, and automatically quarantine flaky tests.
5. **Plano de Correção**:
   - Add `actions/cache` for npm dependencies.
   - Use matrix strategy in GitHub Actions to run unit and integration tests in parallel.
   - Quarantine the flaky E2E test and add an automated retry step for it.
6. **Métricas**: Pipeline duration (target: < 15 mins), pipeline success rate (target: > 95%).
7. **Estratégia de Observabilidade**: Export GitHub Actions metrics to Datadog/Grafana to track build times and failure rates continuously.
