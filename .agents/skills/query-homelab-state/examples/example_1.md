# Example: Debugging a crashed database

## Input
```
User request: "/infra_status postgres true"
```

## Internal Execution
The AI verifies Python is installed and executes:
```bash
python .agents/skills/query-homelab-state/scripts/query_infra.py "postgres" "true"
```

## Expected Output
```text
# Infrastructure Report for 'postgres'

## 🐳 Platform: Docker
**Service**: db_postgres (9f8b2c4d1e)
**Status**: Exited (137) 2 minutes ago

**Resources**: 0.00% CPU | 0B / 0B RAM

### 📝 Logs (Last 100 lines)
```text
2026-07-03 10:12:05.123 UTC [1] LOG:  database system is ready to accept connections
2026-07-03 12:45:12.441 UTC [45] FATAL:  out of memory
2026-07-03 12:45:12.441 UTC [45] DETAIL:  Failed on request of size 134217728 in memory context "CacheMemoryContext".
```
```

## AI Response to User
"O container `postgres` caiu (Status: Exited 137). Olhando os logs que acabei de puxar, a causa raiz foi um erro fatal de **Out of Memory (OOM)** ao tentar alocar 134MB no `CacheMemoryContext`. Recomendo aumentarmos o limite de memória no `docker-compose.yml` ou ajustarmos o `shared_buffers` no `postgresql.conf`."
