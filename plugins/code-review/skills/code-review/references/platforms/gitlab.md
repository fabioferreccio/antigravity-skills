# GitLab Integration

GitLab integration for posting merge request review comments.

## MCP Approach (Preferred for General Comments)

Use these MCP tools when the `mcp__gitlab__*` server is available:

| Tool | Purpose |
|---|---|
| `mcp__gitlab__get_merge_request` | Get MR details including `diff_refs` (base_sha, start_sha, head_sha) |
| `mcp__gitlab__get_merge_request_diffs` | Get the full diff with file paths and line numbers |
| `mcp__gitlab__create_merge_request_note` | Post a general comment on the MR |

### Example: Post a General Comment (MCP)

```
mcp__gitlab__create_merge_request_note(
  project_id: "owner/repo",
  merge_request_iid: MR_IID,
  body: "## Code Review Summary\n\nFound 3 issues."
)
```

> **Note:** For inline comments anchored to specific diff lines, MCP may not correctly serialize the `position` object. Use curl instead.

## CLI Approach (glab)

Use the GitLab CLI when MCP is not available but `glab` is installed and authenticated.

### Get MR Diff

```bash
glab mr diff <MR_IID>
```

### Post General Comment

```bash
glab mr note <MR_IID> --message "REVIEW BODY"
```

### View MR Details

```bash
glab mr view <MR_IID> --comments
```

## curl Approach (Required for Inline Comments)

**IMPORTANT:** NEVER use `glab api -f` for inline comments — it does not correctly serialize nested objects like `position`. Always use `curl` with a JSON body.

### Obtain Token

```bash
# For self-hosted GitLab instances:
TOKEN=$(grep -A5 "<gitlab-host>" ~/.config/glab-cli/config.yml | grep token | awk '{print $2}')

# For gitlab.com:
TOKEN=$(glab auth token)
```

### Get diff_refs (Required for Inline Comments)

Before posting inline comments, retrieve the MR's diff references:

```bash
curl -s \
  "https://GITLAB_HOST/api/v4/projects/OWNER%2FREPO/merge_requests/IID" \
  -H "PRIVATE-TOKEN: $TOKEN" | jq '.diff_refs'
```

This returns:
```json
{
  "base_sha": "abc123...",
  "start_sha": "def456...",
  "head_sha": "ghi789..."
}
```

### Post Inline Comment (Anchored to Diff)

```bash
curl -s -X POST \
  "https://GITLAB_HOST/api/v4/projects/OWNER%2FREPO/merge_requests/IID/discussions" \
  -H "PRIVATE-TOKEN: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "COMMENT BODY",
    "position": {
      "position_type": "text",
      "base_sha": "BASE_SHA",
      "start_sha": "START_SHA",
      "head_sha": "HEAD_SHA",
      "new_path": "path/to/file.ts",
      "new_line": LINE_NUMBER
    }
  }' | jq '{id: .id, type: .notes[0].type}'
```

### Verify Comment Anchored Correctly

After posting, check the response:

```json
{
  "id": "discussion-id",
  "type": "DiffNote"
}
```

- `"type": "DiffNote"` → comment is correctly anchored to the diff line.
- `"type": null` → the position did NOT anchor. The SHAs or line numbers are likely incorrect.

### Post General Comment (curl)

```bash
curl -s -X POST \
  "https://GITLAB_HOST/api/v4/projects/OWNER%2FREPO/merge_requests/IID/notes" \
  -H "PRIVATE-TOKEN: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "GENERAL REVIEW COMMENT"
  }'
```

## GitLab Suggestion Syntax

To propose a concrete code fix inline:

````markdown
```suggestion:-0+0
corrected line here
```
````

For multi-line suggestions (replace 3 lines starting from 2 lines above):

````markdown
```suggestion:-2+0
line 1 corrected
line 2 corrected
line 3 corrected
```
````

The format is `suggestion:-N+M` where:
- `-N` = number of lines ABOVE the commented line to include
- `+M` = number of lines BELOW the commented line to include

## Important Notes

- `OWNER%2FREPO` = URL-encoded project path (e.g., `my-group%2Fmy-project`). For nested groups: `group%2Fsubgroup%2Frepo`.
- `IID` = the MR number from the URL (the user-facing number), NOT the internal database ID.
- `diff_refs` from `get_merge_request` provides: `base_sha`, `start_sha`, `head_sha` — all three are required for inline comments.
- For **deleted lines**: use `old_path` + `old_line` instead of `new_path` + `new_line`.
- For **modified lines**: you may need both `old_path`/`old_line` AND `new_path`/`new_line`.
- GitLab creates a **discussion thread** for each inline comment, which the author can resolve.
- Self-hosted GitLab instances may have different API versions — verify with `/api/v4/version`.
