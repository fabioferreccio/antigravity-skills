# MCP Server Catalog

Known Model Context Protocol servers organized by service type.
For each server: npm package, config example, required env vars, and capabilities.

---

## Database Servers

### PostgreSQL

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "DATABASE_URL": "${DATABASE_URL}"
    }
  }
}
```

**Enables**: Query execution, schema inspection, table listing, data exploration.
**Detect from**: `pg`, `postgres`, `psycopg2`, `asyncpg`, `pgx`, `sqlx` (with postgres feature), Prisma with `postgresql` provider, `DATABASE_URL` containing `postgres://`

### MySQL

```json
{
  "mysql": {
    "command": "npx",
    "args": ["-y", "@benborla29/mcp-server-mysql"],
    "env": {
      "MYSQL_HOST": "${MYSQL_HOST}",
      "MYSQL_USER": "${MYSQL_USER}",
      "MYSQL_PASSWORD": "${MYSQL_PASSWORD}",
      "MYSQL_DATABASE": "${MYSQL_DATABASE}"
    }
  }
}
```

**Enables**: Query execution, schema inspection.
**Detect from**: `mysql2`, `mysqlclient`, `pymysql`, Prisma with `mysql` provider

### SQLite

```json
{
  "sqlite": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sqlite", "${SQLITE_DB_PATH}"],
    "env": {}
  }
}
```

**Enables**: Query execution on local SQLite databases.
**Detect from**: `better-sqlite3`, `sqlite3`, Prisma with `sqlite` provider, `*.db` or `*.sqlite` files

### MongoDB

```json
{
  "mongodb": {
    "command": "npx",
    "args": ["-y", "mcp-mongo-server"],
    "env": {
      "MONGODB_URI": "${MONGODB_URI}"
    }
  }
}
```

**Enables**: Collection querying, document inspection.
**Detect from**: `mongodb`, `mongoose`, `pymongo`, `motor`, `MONGODB_URI` in env

### Redis

```json
{
  "redis": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-redis"],
    "env": {
      "REDIS_URL": "${REDIS_URL}"
    }
  }
}
```

**Enables**: Key inspection, cache management.
**Detect from**: `redis`, `ioredis`, `aioredis`, `REDIS_URL` in env

---

## Version Control

### GitHub

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

**Enables**: PR management, issue tracking, repo search, file operations.
**Detect from**: `.github/` directory, GitHub Actions workflows, `origin` remote URL

### GitLab

```json
{
  "gitlab": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-gitlab"],
    "env": {
      "GITLAB_TOKEN": "${GITLAB_TOKEN}",
      "GITLAB_URL": "${GITLAB_URL}"
    }
  }
}
```

**Enables**: MR management, pipeline inspection, issue tracking.
**Detect from**: `.gitlab-ci.yml`, `origin` remote URL containing `gitlab`

---

## Cloud Providers

### Google Cloud (GCP)

Available as **one-click servers** in Antigravity IDE (Settings → Customizations → Add MCP+).

```json
{
  "gcp": {
    "serverUrl": "https://cloudcode-mcp.googleapis.com/v1/mcp/sse",
    "env": {
      "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_APPLICATION_CREDENTIALS}"
    }
  }
}
```

**Enables**: GCP resource management, Cloud Run, BigQuery, Cloud Storage.
**Detect from**: `@google-cloud/*` packages, `.gcloudignore`, `app.yaml`, `cloudbuild.yaml`

### AWS

```json
{
  "aws": {
    "command": "npx",
    "args": ["-y", "mcp-server-aws"],
    "env": {
      "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
      "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}",
      "AWS_REGION": "${AWS_REGION}"
    }
  }
}
```

**Detect from**: `@aws-sdk/*`, `boto3`, `aws-cdk`, `serverless.yml` with `aws` provider, `samconfig.toml`

---

## Observability

### Sentry

```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "@sentry/mcp-server"],
    "env": {
      "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
      "SENTRY_ORG": "${SENTRY_ORG}"
    }
  }
}
```

**Enables**: Error tracking, issue management, release monitoring.
**Detect from**: `@sentry/node`, `@sentry/react`, `sentry-sdk`, `sentry_sdk`, `.sentryclirc`

---

## Search

### Elasticsearch

```json
{
  "elasticsearch": {
    "command": "npx",
    "args": ["-y", "mcp-server-elasticsearch"],
    "env": {
      "ELASTICSEARCH_URL": "${ELASTICSEARCH_URL}"
    }
  }
}
```

**Detect from**: `@elastic/elasticsearch`, `elasticsearch-py`, `ELASTICSEARCH_URL` in env

---

## Communication

### Slack

```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
    }
  }
}
```

**Detect from**: `@slack/bolt`, `@slack/web-api`, `slack-sdk`, Slack webhook URLs in env

---

## File System & General

### Filesystem

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "${WORKSPACE_PATH}"],
    "env": {}
  }
}
```

**Enables**: File operations outside the workspace.
**Recommend**: Only when the project needs to access files outside the repo root.

---

## Selection Guidelines

1. **Only recommend servers for detected services** — never speculatively add servers
2. **Fewer is better** — each server adds context overhead
3. **Priority order**: Database > Version Control > Cloud > Observability > Search > Communication
4. **Always use env-var placeholders** — never hardcode credentials
5. **Verify the server exists** — npm packages change; include only known-good servers
6. **One-click servers** — for GCP in Antigravity IDE, mention the UI option instead of manual config
