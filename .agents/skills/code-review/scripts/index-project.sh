#!/usr/bin/env bash
set -euo pipefail

# Usage: ./index-project.sh [project_root]
# Generates .code-review-index.json at the project root
#
# Note: every existence check uses `if` instead of `[ -f x ] && cmd` —
# under `set -e`, a failing AND-list at top level aborts the script,
# so the one-liner form would exit on the first missing file.

PROJECT_ROOT="${1:-.}"
cd "$PROJECT_ROOT"

echo "🔍 Indexing project at $(pwd)..."

add_json() { # add_json <json_array> <value>
  echo "$1" | jq --arg v "$2" '. + [$v] | unique'
}

# Detect languages
LANGUAGES="[]"
if [ -f package.json ]; then LANGUAGES=$(add_json "$LANGUAGES" "javascript"); fi
if [ -f tsconfig.json ]; then LANGUAGES=$(add_json "$LANGUAGES" "typescript"); fi
if [ -f go.mod ]; then LANGUAGES=$(add_json "$LANGUAGES" "go"); fi
if [ -f Cargo.toml ]; then LANGUAGES=$(add_json "$LANGUAGES" "rust"); fi
if [ -f pom.xml ]; then LANGUAGES=$(add_json "$LANGUAGES" "java"); fi
if [ -f build.gradle ]; then LANGUAGES=$(add_json "$LANGUAGES" "java"); fi
if [ -f build.gradle.kts ]; then LANGUAGES=$(add_json "$LANGUAGES" "kotlin"); fi
if [ -f pyproject.toml ] || [ -f requirements.txt ] || [ -f setup.py ]; then LANGUAGES=$(add_json "$LANGUAGES" "python"); fi
if [ -f Gemfile ]; then LANGUAGES=$(add_json "$LANGUAGES" "ruby"); fi
if [ -f pubspec.yaml ]; then LANGUAGES=$(add_json "$LANGUAGES" "dart"); fi
if [ -f composer.json ]; then LANGUAGES=$(add_json "$LANGUAGES" "php"); fi
if [ -f mix.exs ]; then LANGUAGES=$(add_json "$LANGUAGES" "elixir"); fi
if find . -maxdepth 3 \( -name '*.csproj' -o -name '*.sln' \) -print -quit 2>/dev/null | grep -q .; then
  LANGUAGES=$(add_json "$LANGUAGES" "csharp")
fi

# Detect frameworks (simplified — the agent does deeper analysis)
FRAMEWORKS="[]"
if [ -f package.json ]; then
  if grep -q '"@nestjs/core"' package.json; then FRAMEWORKS=$(add_json "$FRAMEWORKS" "nestjs"); fi
  if grep -q '"express"' package.json; then FRAMEWORKS=$(add_json "$FRAMEWORKS" "express"); fi
  if grep -q '"next"' package.json; then FRAMEWORKS=$(add_json "$FRAMEWORKS" "nextjs"); fi
  if grep -q '"react"' package.json; then FRAMEWORKS=$(add_json "$FRAMEWORKS" "react"); fi
  if grep -q '"vue"' package.json; then FRAMEWORKS=$(add_json "$FRAMEWORKS" "vue"); fi
  if grep -q '"prisma"' package.json || grep -q '"@prisma/client"' package.json; then FRAMEWORKS=$(add_json "$FRAMEWORKS" "prisma"); fi
fi
if [ -f pubspec.yaml ] && grep -q 'flutter' pubspec.yaml; then FRAMEWORKS=$(add_json "$FRAMEWORKS" "flutter"); fi

# Detect architecture pattern
ARCH="unknown"
if [ -d src/core ] && [ -d src/infra ]; then ARCH="clean-architecture"; fi
if [ -d src/domain ] && [ -d src/application ] && [ -d src/infrastructure ]; then ARCH="clean-architecture"; fi
if [ -d app/models ] && [ -d app/views ] && [ -d app/controllers ]; then ARCH="mvc"; fi
if [ -d src/ports ] && [ -d src/adapters ]; then ARCH="hexagonal"; fi

# Detect default branch
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")

# Detect git host (portable — no grep -P, which macOS/BSD grep lacks)
GIT_HOST=$(git remote get-url origin 2>/dev/null \
  | sed -E 's#^[a-z+]+://##; s#^[^@]*@##; s#[:/].*$##' || true)
GIT_HOST="${GIT_HOST:-unknown}"

# Staleness hash: sha256 over key config files, matching references/indexing.md Step 8
sha256() {
  if command -v sha256sum >/dev/null 2>&1; then sha256sum | awk '{print $1}'; else shasum -a 256 | awk '{print $1}'; fi
}
HASH_FILES=(package.json tsconfig.json go.mod Cargo.toml pom.xml build.gradle build.gradle.kts \
  pyproject.toml requirements.txt Gemfile pubspec.yaml composer.json mix.exs .editorconfig AGENTS.md CLAUDE.md)
EXISTING_FILES=()
for f in "${HASH_FILES[@]}"; do
  if [ -f "$f" ]; then EXISTING_FILES+=("$f"); fi
done
if [ "${#EXISTING_FILES[@]}" -gt 0 ]; then
  PROJECT_HASH="sha256:$(cat "${EXISTING_FILES[@]}" | sha256)"
else
  PROJECT_HASH="sha256:empty"
fi

# Detect agent rules file
AGENT_RULES="none"
if [ -f .github/copilot-instructions.md ]; then AGENT_RULES=".github/copilot-instructions.md"; fi
if [ -f CLAUDE.md ]; then AGENT_RULES="CLAUDE.md"; fi
if [ -f AGENTS.md ]; then AGENT_RULES="AGENTS.md"; fi

# Generate index
jq -n \
  --arg version "1.1.0" \
  --arg indexed_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg project_hash "$PROJECT_HASH" \
  --argjson languages "$LANGUAGES" \
  --argjson frameworks "$FRAMEWORKS" \
  --arg arch "$ARCH" \
  --arg default_branch "$DEFAULT_BRANCH" \
  --arg git_host "$GIT_HOST" \
  --arg agent_rules "$AGENT_RULES" \
  '{
    version: $version,
    indexed_at: $indexed_at,
    project_hash: $project_hash,
    languages: $languages,
    frameworks: $frameworks,
    architecture_pattern: $arch,
    conventions: {},
    structure: {},
    complementary_skills: [],
    platform: {
      git_host: $git_host,
      default_branch: $default_branch
    },
    agent_rules_file: $agent_rules
  }' > .code-review-index.json

echo "✅ Index generated at .code-review-index.json"
jq . .code-review-index.json
