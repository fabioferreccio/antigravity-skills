#!/usr/bin/env bash
set -euo pipefail

# Usage: ./post-bitbucket-comments.sh <workspace> <repo> <pr_id> <comments_json_file>

WORKSPACE="$1"
REPO="$2"
PR_ID="$3"
COMMENTS_FILE="$4"

# Get token
TOKEN="${BITBUCKET_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  echo "Error: Set BITBUCKET_TOKEN environment variable."
  exit 1
fi

# Post each comment
jq -c '.[]' "$COMMENTS_FILE" | while read -r comment; do
  FILE_PATH=$(echo "$comment" | jq -r '.path')
  LINE=$(echo "$comment" | jq -r '.line')
  BODY=$(echo "$comment" | jq -r '.body')

  curl -s -X POST \
    "https://api.bitbucket.org/2.0/repositories/$WORKSPACE/$REPO/pullrequests/$PR_ID/comments" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg body "$BODY" \
      --arg path "$FILE_PATH" \
      --argjson line "$LINE" \
      '{
        content: {raw: $body},
        inline: {path: $path, to: $line}
      }')" \
    | jq '{id: .id, path: .inline.path, line: .inline.to}'

  echo "✅ Posted: $FILE_PATH:$LINE"
done

echo "✅ All comments posted."
