# Platform Detection

How to detect which git platform is in use and select the best integration method for posting review comments.

## Detection Methods

### 1. From MR/PR URL

Parse the URL to identify the platform:

| URL Pattern | Platform |
|---|---|
| `github.com` or `api.github.com` | GitHub |
| `gitlab.com` or custom GitLab instances | GitLab |
| `bitbucket.org` or `api.bitbucket.org` | Bitbucket |

### 2. From Git Remote

```bash
git remote get-url origin
```

Parse the output to detect the platform:

```
# GitHub patterns
git@github.com:owner/repo.git
https://github.com/owner/repo.git

# GitLab patterns
git@gitlab.com:owner/repo.git
https://gitlab.com/owner/repo.git
git@gitlab.company.com:group/repo.git       # self-hosted

# Bitbucket patterns
git@bitbucket.org:workspace/repo.git
https://bitbucket.org/workspace/repo.git
git@bitbucket.company.com:7999/project/repo.git  # Bitbucket Server
```

### 3. From MCP Availability

Check for platform-specific MCP tools:

- `mcp__github__*` tools available → **GitHub**
- `mcp__gitlab__*` tools available → **GitLab**
- No Bitbucket MCP typically → use REST API directly

### 4. From CLI Availability

```bash
gh --version 2>/dev/null    # GitHub CLI
glab --version 2>/dev/null  # GitLab CLI
```

If a CLI is present and authenticated, it can be used as a fallback for posting comments.

## Comment Posting Priority

When selecting a method for posting review comments, prefer in this order:

| Priority | Method | Reliability | Requirements |
|---|---|---|---|
| 1 | MCP tools | Highest — native integration, structured API | MCP server configured |
| 2 | CLI tools (`gh` / `glab`) | High — well-tested, handles auth | CLI installed + authenticated |
| 3 | `curl` scripts | Universal — works everywhere | API token available |

### Decision Flow

```
Is MCP available for the detected platform?
├── YES → Use MCP tools (most reliable, structured responses)
└── NO
    ├── Is platform CLI installed and authenticated?
    │   ├── YES → Use CLI (gh pr review / glab mr note)
    │   └── NO → Use curl with API token
    └── For Bitbucket: always use curl (no common MCP or CLI)
```

### Important Considerations

- **MCP tools** return structured data and handle authentication automatically — always prefer them when available.
- **CLI tools** require prior authentication (`gh auth login` / `glab auth login`) but provide a clean interface.
- **curl scripts** are the universal fallback and require a manually configured token (environment variable or config file).
- **Bitbucket** has no widely-available MCP server or dedicated CLI — always use the REST API via curl.
- For **self-hosted** GitLab or Bitbucket Server instances, the API base URL must be adjusted accordingly.
