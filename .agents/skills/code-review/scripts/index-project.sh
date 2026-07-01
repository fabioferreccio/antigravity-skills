#!/usr/bin/env bash
set -euo pipefail

# Usage: ./index-project.sh [project_root]
# Generates .code-review-index.json at the project root

PROJECT_ROOT="${1:-.}"
cd "$PROJECT_ROOT"

echo "🔍 Indexing project at $(pwd)..."

# Detect languages
LANGUAGES="[]"
[ -f package.json ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["javascript"]')
[ -f tsconfig.json ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["typescript"] | unique')
[ -f go.mod ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["go"]')
[ -f Cargo.toml ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["rust"]')
[ -f pom.xml ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["java"]')
[ -f build.gradle ] || [ -f build.gradle.kts ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["kotlin"]')
[ -f pyproject.toml ] || [ -f requirements.txt ] || [ -f setup.py ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["python"]')
[ -f Gemfile ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["ruby"]')
[ -f pubspec.yaml ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["dart"]')
[ -f composer.json ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["php"]')
[ -f mix.exs ] && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["elixir"]')
find . -maxdepth 3 -name '*.csproj' -o -name '*.sln' 2>/dev/null | head -1 | grep -q . && LANGUAGES=$(echo "$LANGUAGES" | jq '. + ["csharp"]')

# Detect frameworks (simplified — the agent does deeper analysis)
FRAMEWORKS="[]"
[ -f package.json ] && grep -q '"@nestjs/core"' package.json 2>/dev/null && FRAMEWORKS=$(echo "$FRAMEWORKS" | jq '. + ["nestjs"]')
[ -f package.json ] && grep -q '"express"' package.json 2>/dev/null && FRAMEWORKS=$(echo "$FRAMEWORKS" | jq '. + ["express"]')
[ -f package.json ] && grep -q '"next"' package.json 2>/dev/null && FRAMEWORKS=$(echo "$FRAMEWORKS" | jq '. + ["nextjs"]')
[ -f package.json ] && grep -q '"react"' package.json 2>/dev/null && FRAMEWORKS=$(echo "$FRAMEWORKS" | jq '. + ["react"]')
[ -f package.json ] && grep -q '"vue"' package.json 2>/dev/null && FRAMEWORKS=$(echo "$FRAMEWORKS" | jq '. + ["vue"]')
[ -f package.json ] && grep -q '"prisma"' package.json 2>/dev/null && FRAMEWORKS=$(echo "$FRAMEWORKS" | jq '. + ["prisma"]')
[ -f pubspec.yaml ] && grep -q 'flutter' pubspec.yaml 2>/dev/null && FRAMEWORKS=$(echo "$FRAMEWORKS" | jq '. + ["flutter"]')

# Detect architecture pattern
ARCH="unknown"
[ -d src/core ] && [ -d src/infra ] && ARCH="clean-architecture"
[ -d src/domain ] && [ -d src/application ] && [ -d src/infrastructure ] && ARCH="clean-architecture"
[ -d app/models ] && [ -d app/views ] && [ -d app/controllers ] && ARCH="mvc"
[ -d src/ports ] && [ -d src/adapters ] && ARCH="hexagonal"

# Detect default branch
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")

# Detect git host
GIT_HOST=$(git remote get-url origin 2>/dev/null | grep -oP '(?<=@|//)([^:/]+)' | head -1 || echo "unknown")

# Generate hash of key config files for staleness detection
HASH_INPUT=""
[ -f package.json ] && HASH_INPUT="$HASH_INPUT$(md5sum package.json 2>/dev/null || md5 package.json 2>/dev/null)"
[ -f go.mod ] && HASH_INPUT="$HASH_INPUT$(md5sum go.mod 2>/dev/null || md5 go.mod 2>/dev/null)"
[ -f Cargo.toml ] && HASH_INPUT="$HASH_INPUT$(md5sum Cargo.toml 2>/dev/null || md5 Cargo.toml 2>/dev/null)"
PROJECT_HASH=$(echo "$HASH_INPUT" | md5sum 2>/dev/null | awk '{print $1}' || echo "$HASH_INPUT" | md5 | awk '{print $1}')

# Detect agent rules file
AGENT_RULES="none"
[ -f AGENTS.md ] && AGENT_RULES="AGENTS.md"
[ -f CLAUDE.md ] && AGENT_RULES="CLAUDE.md"
[ -f .github/copilot-instructions.md ] && AGENT_RULES=".github/copilot-instructions.md"

# Generate index
jq -n \
  --arg version "1.0.0" \
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
cat .code-review-index.json | jq .
