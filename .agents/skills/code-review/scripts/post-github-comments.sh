#!/usr/bin/env bash
set -euo pipefail

# Usage: ./post-github-comments.sh <owner> <repo> <pr_number> <comments_json_file>
# comments_json_file format: [{"path": "file.ts", "line": 42, "body": "comment"}]
#
# GitHub's batch review endpoint is all-or-nothing: if a single comment fails
# to anchor (line not in the diff), the whole request returns HTTP 422 and
# NOTHING is posted. On 422 this script falls back to posting comments one by
# one, so one bad anchor doesn't discard the entire review.

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

# Attempt 1: batch review with all inline comments
HTTP_CODE=$(curl -s -o /tmp/gh-review-response.json -w "%{http_code}" -X POST \
  "https://api.github.com/repos/$OWNER/$REPO/pulls/$PR_NUMBER/reviews" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "$(jq -n \
    --arg body "🤖 Code Review by code-review skill" \
    --arg event "COMMENT" \
    --arg sha "$HEAD_SHA" \
    --slurpfile comments "$COMMENTS_FILE" \
    '{body: $body, event: $event, commit_id: $sha, comments: $comments[0]}')")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  jq '{id: .id, state: .state, comments: (.comments // [] | length)}' /tmp/gh-review-response.json
  echo "✅ Review posted successfully (batch)."
  exit 0
fi

echo "⚠️  Batch review failed (HTTP $HTTP_CODE). Falling back to per-comment posting..."
jq -r '.message // empty' /tmp/gh-review-response.json || true

FAILED=0
while IFS= read -r comment; do
  FILE_PATH=$(echo "$comment" | jq -r '.path')
  LINE=$(echo "$comment" | jq -r '.line')

  CODE=$(curl -s -o /tmp/gh-comment-response.json -w "%{http_code}" -X POST \
    "https://api.github.com/repos/$OWNER/$REPO/pulls/$PR_NUMBER/comments" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -d "$(echo "$comment" | jq --arg sha "$HEAD_SHA" \
      '{body: .body, commit_id: $sha, path: .path, line: .line, side: "RIGHT"}')")

  if [ "$CODE" = "201" ]; then
    echo "✅ Anchored: $FILE_PATH:$LINE"
  else
    FAILED=$((FAILED + 1))
    echo "❌ Failed (HTTP $CODE): $FILE_PATH:$LINE — $(jq -r '.message // "unknown error"' /tmp/gh-comment-response.json)"
  fi
done < <(jq -c '.[]' "$COMMENTS_FILE")

if [ "$FAILED" -gt 0 ]; then
  echo "⚠️  $FAILED comment(s) failed to anchor. Include them in the general summary comment instead."
  exit 1
fi
echo "✅ All comments posted individually."
