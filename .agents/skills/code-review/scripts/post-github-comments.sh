#!/usr/bin/env bash
set -euo pipefail

# Usage: ./post-github-comments.sh <owner> <repo> <pr_number> <comments_json_file>
# comments_json_file format: [{"path": "file.ts", "line": 42, "body": "comment"}]

OWNER="$1"
REPO="$2"
PR_NUMBER="$3"
COMMENTS_FILE="$4"

# Get token
TOKEN=$(gh auth token 2>/dev/null || echo "${GITHUB_TOKEN:-}")
if [ -z "$TOKEN" ]; then
  echo "Error: No GitHub token found. Run 'gh auth login' or set GITHUB_TOKEN."
  exit 1
fi

# Get HEAD SHA
HEAD_SHA=$(gh api "repos/$OWNER/$REPO/pulls/$PR_NUMBER" --jq '.head.sha')

# Post review with inline comments
curl -s -X POST \
  "https://api.github.com/repos/$OWNER/$REPO/pulls/$PR_NUMBER/reviews" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "$(jq -n \
    --arg body "🤖 Code Review by code-review skill" \
    --arg event "COMMENT" \
    --arg sha "$HEAD_SHA" \
    --slurpfile comments "$COMMENTS_FILE" \
    '{body: $body, event: $event, commit_id: $sha, comments: $comments[0]}')" \
  | jq '{id: .id, state: .state, comments: (.comments // [] | length)}'

echo "✅ Review posted successfully."
