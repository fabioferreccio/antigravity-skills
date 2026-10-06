# Bitbucket Integration

Bitbucket integration for posting pull request review comments.

**No common MCP server is available for Bitbucket.** Use the REST API directly via curl.

## Authentication

### Option 1: App Password (Bitbucket Cloud)

```bash
BB_USER="username"
BB_APP_PASSWORD="app-password"
AUTH="-u $BB_USER:$BB_APP_PASSWORD"
```

### Option 2: Access Token (Bitbucket Cloud or Server)

```bash
TOKEN="access-token"
AUTH="-H 'Authorization: Bearer $TOKEN'"
```

### Option 3: HTTP Access Token (Bitbucket Server / Data Center)

```bash
TOKEN="http-access-token"
AUTH="-H 'Authorization: Bearer $TOKEN'"
```

## Bitbucket Cloud API (api.bitbucket.org)

### Get PR Diff

```bash
curl -s $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID/diff"
```

### Get PR Details

```bash
curl -s $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID"
```

### Get Changed Files

```bash
curl -s $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID/diffstat"
```

### Post General Comment

```bash
curl -s -X POST $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "raw": "REVIEW BODY"
    }
  }'
```

### Post Inline Comment

```bash
curl -s -X POST $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "raw": "INLINE COMMENT"
    },
    "inline": {
      "path": "path/to/file.ts",
      "to": LINE_NUMBER
    }
  }'
```

### Post Inline Comment on Deleted Line

```bash
curl -s -X POST $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "raw": "COMMENT ON DELETED LINE"
    },
    "inline": {
      "path": "path/to/file.ts",
      "from": LINE_NUMBER
    }
  }'
```

### Approve PR

```bash
curl -s -X POST $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID/approve"
```

### Request Changes (via Task)

Bitbucket Cloud does not have a native "request changes" state. Use tasks instead:

```bash
curl -s -X POST $AUTH \
  "https://api.bitbucket.org/2.0/repositories/WORKSPACE/REPO/pullrequests/PR_ID/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "raw": "TASK: Fix the SQL injection vulnerability in user-service.ts:42"
    }
  }'
```

## Bitbucket Server / Data Center API

For self-hosted Bitbucket instances, the API base and structure differ:

### API Base

```
https://HOST/rest/api/1.0/projects/PROJECT_KEY/repos/REPO_SLUG/pull-requests/PR_ID
```

### Post General Comment (Server)

```bash
curl -s -X POST $AUTH \
  "https://HOST/rest/api/1.0/projects/PROJECT/repos/REPO/pull-requests/PR_ID/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "REVIEW BODY"
  }'
```

### Post Inline Comment (Server)

```bash
curl -s -X POST $AUTH \
  "https://HOST/rest/api/1.0/projects/PROJECT/repos/REPO/pull-requests/PR_ID/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "INLINE COMMENT",
    "anchor": {
      "path": "path/to/file.ts",
      "line": LINE_NUMBER,
      "lineType": "ADDED",
      "fileType": "TO"
    }
  }'
```

## Suggestion Syntax

Bitbucket does **not** have native suggestion syntax like GitHub or GitLab. Use markdown code blocks with diff formatting as a convention:

````markdown
**Suggested fix:**
```diff
- const result = db.query("SELECT * FROM users WHERE id = " + userId);
+ const result = db.query("SELECT * FROM users WHERE id = $1", [userId]);
```
````

## Important Notes

- **Line references**: Bitbucket Cloud uses `to` for lines in the new version and `from` for lines in the old version of the file.
- **Bitbucket Server** uses a different API structure with `anchor` objects containing `line`, `lineType` (`ADDED`, `REMOVED`, `CONTEXT`), and `fileType` (`FROM`, `TO`).
- **WORKSPACE** in Bitbucket Cloud = the workspace slug (often the organization name).
- **PROJECT_KEY** in Bitbucket Server = the project key (uppercase abbreviation).
- **Pagination**: Bitbucket Cloud uses `page` and `pagelen` parameters. Default page size is 10.
- **Rate limiting**: Bitbucket Cloud has rate limits that vary by authentication method. App passwords have lower limits than OAuth tokens.
- There is no bulk review endpoint — each inline comment requires a separate API call.
