#!/usr/bin/env bash
set -euo pipefail

# Usage: ./post-gitlab-comments.sh <gitlab_host> <project_path> <mr_iid> <comments_json_file>
# comments_json_file format: [{"path": "file.ts", "line": 42, "body": "comment"}]

GITLAB_HOST="$1"
PROJECT_PATH="$2"  # e.g., "group/project"
MR_IID="$3"
COMMENTS_FILE="$4"

# URL-encode project path
ENCODED_PROJECT=$(echo "$PROJECT_PATH" | sed 's/\//%2F/g')

# Get token
if [ "$GITLAB_HOST" = "gitlab.com" ]; then
  TOKEN=$(glab auth token 2>/dev/null || echo "${GITLAB_TOKEN:-}")
else
  TOKEN=$(grep -A5 "$GITLAB_HOST" ~/.config/glab-cli/config.yml 2>/dev/null | grep token | awk '{print $2}' || echo "${GITLAB_TOKEN:-}")
fi

if [ -z "$TOKEN" ]; then
  echo "Error: No GitLab token found. Run 'glab auth login' or set GITLAB_TOKEN."
  exit 1
fi

# Get diff refs
DIFF_REFS=$(curl -s \
  "https://$GITLAB_HOST/api/v4/projects/$ENCODED_PROJECT/merge_requests/$MR_IID" \
  -H "PRIVATE-TOKEN: $TOKEN" \
  | jq '.diff_refs')

BASE_SHA=$(echo "$DIFF_REFS" | jq -r '.base_sha')
START_SHA=$(echo "$DIFF_REFS" | jq -r '.start_sha')
HEAD_SHA=$(echo "$DIFF_REFS" | jq -r '.head_sha')

# Post each comment as a discussion
jq -c '.[]' "$COMMENTS_FILE" | while read -r comment; do
  FILE_PATH=$(echo "$comment" | jq -r '.path')
  LINE=$(echo "$comment" | jq -r '.line')
  BODY=$(echo "$comment" | jq -r '.body')

  RESULT=$(curl -s -X POST \
    "https://$GITLAB_HOST/api/v4/projects/$ENCODED_PROJECT/merge_requests/$MR_IID/discussions" \
    -H "PRIVATE-TOKEN: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg body "$BODY" \
      --arg base "$BASE_SHA" \
      --arg start "$START_SHA" \
      --arg head "$HEAD_SHA" \
      --arg path "$FILE_PATH" \
      --argjson line "$LINE" \
      '{
        body: $body,
        position: {
          position_type: "text",
          base_sha: $base,
          start_sha: $start,
          head_sha: $head,
          new_path: $path,
          new_line: $line
        }
      }')")

  TYPE=$(echo "$RESULT" | jq -r '.notes[0].type // "null"')
  if [ "$TYPE" = "DiffNote" ]; then
    echo "✅ Anchored: $FILE_PATH:$LINE"
  else
    echo "⚠️  Not anchored (general note): $FILE_PATH:$LINE"
  fi
done

echo "✅ All comments posted."
