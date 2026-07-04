# GitHub Integration

GitHub integration for posting pull request review comments.

## MCP Approach (Preferred)

Use these MCP tools when the `mcp__github__*` server is available:

| Tool | Purpose |
|---|---|
| `mcp__github__get_pull_request` | Get PR details (title, body, state, head/base refs) |
| `mcp__github__list_pull_request_files` | Get list of changed files with patch data |
| `mcp__github__create_pull_request_review` | Post a full review with inline comments |
| `mcp__github__add_pull_request_review_comment` | Add a single inline comment to a specific line |

### Example: Post a Review with Inline Comments (MCP)

```
mcp__github__create_pull_request_review(
  owner: "OWNER",
  repo: "REPO",
  pull_number: PR_NUMBER,
  event: "COMMENT",
  body: "## Code Review Summary\n\nFound 3 issues.",
  comments: [
    {
      path: "src/service.ts",
      line: 42,
      body: "⚠️ This SQL query is vulnerable to injection. Use parameterized queries."
    }
  ]
)
```

## CLI Approach (gh)

Use the GitHub CLI when MCP is not available but `gh` is installed and authenticated.

### Get PR Diff

```bash
gh pr diff <PR_NUMBER>
```

### Post Review Comment (General)

```bash
gh pr review <PR_NUMBER> --comment --body "REVIEW BODY"
```

### Post Inline Comment (via API through gh)

```bash
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
  -f body="COMMENT" \
  -f commit_id="HEAD_SHA" \
  -f path="file/path.ts" \
  -F line=42 \
  -f side="RIGHT"
```

### Approve or Request Changes

```bash
# Approve
gh pr review <PR_NUMBER> --approve --body "LGTM"

# Request changes
gh pr review <PR_NUMBER> --request-changes --body "Please fix the issues below."
```

## curl Approach (Fallback)

Use curl when neither MCP nor `gh` CLI is available.

### Obtain Token

```bash
TOKEN=$(gh auth token 2>/dev/null || echo "$GITHUB_TOKEN")
```

### Post PR Review with Inline Comments

```bash
curl -s -X POST \
  "https://api.github.com/repos/OWNER/REPO/pulls/PR_NUMBER/reviews" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "body": "GENERAL COMMENT",
    "event": "COMMENT",
    "comments": [
      {
        "path": "path/to/file.ts",
        "line": 42,
        "body": "INLINE COMMENT"
      }
    ]
  }'
```

### Post Single Inline Comment

```bash
curl -s -X POST \
  "https://api.github.com/repos/OWNER/REPO/pulls/PR_NUMBER/comments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "body": "INLINE COMMENT",
    "commit_id": "HEAD_SHA",
    "path": "path/to/file.ts",
    "line": 42,
    "side": "RIGHT"
  }'
```

## GitHub Suggestion Syntax

To propose a concrete code fix that the author can apply with one click:

````markdown
```suggestion
corrected line here
```
````

For multi-line suggestions:

````markdown
```suggestion
line 1 corrected
line 2 corrected
```
````

## Important Notes

- GitHub uses **1-indexed line numbers** in the **final version** of the file for inline comments.
- For **multi-line comments**, use `start_line` and `line` to specify the range.
- The `side` parameter determines where the comment anchors:
  - `RIGHT` — on additions (new file version)
  - `LEFT` — on deletions (old file version)
- **Review events**:
  - `COMMENT` — neutral, informational review
  - `APPROVE` — approve the PR
  - `REQUEST_CHANGES` — block merge until addressed
- The `commit_id` for inline comments should be the **HEAD commit SHA** of the PR branch.
- Rate limits: GitHub API has rate limits (5000 requests/hour for authenticated users). Batch inline comments into a single review when possible.
