#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# ci-local.sh — Simula o pipeline CI do GitHub Actions localmente
#
# Reproduz os jobs dos workflows:
#   • validate.yml      → structure, frontmatter, catalog, duplicates
#   • quality-gate.yml  → full validation + readme check
#   • sync-catalog.yml  → catalog regeneration
#
# Usage:
#   ./scripts/ci-local.sh              # Roda tudo
#   ./scripts/ci-local.sh --stage X    # Roda apenas o stage X
#
# Stages: install, validate, structure, frontmatter, catalog,
#          duplicates, readme, sync, test, all
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ─── State ───────────────────────────────────────────────────────
TOTAL=0
PASSED=0
FAILED=0
SKIPPED=0
FAILED_STAGES=()
START_TIME=$(date +%s)

# ─── Helpers ─────────────────────────────────────────────────────
banner() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║${NC}  ${BOLD}🚀 Antigravity Skills — Local CI Pipeline${NC}                   ${CYAN}║${NC}"
  echo -e "${CYAN}║${NC}  ${DIM}Simulating GitHub Actions locally${NC}                           ${CYAN}║${NC}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  local node_v=$(node -v)
  local pm_v=$($PM -v)
  echo -e "  ${DIM}Node $node_v | $PM $pm_v | $(date -u '+%Y-%m-%d %H:%M:%S UTC')${NC}"
  echo ""
}

stage_header() {
  local stage_num=$1
  local stage_name=$2
  echo -e "${BLUE}──────────────────────────────────────────────────────────────${NC}"
  echo -e "  ${BOLD}Stage ${stage_num}:${NC} ${stage_name}"
  echo -e "${BLUE}──────────────────────────────────────────────────────────────${NC}"
}

run_stage() {
  local name=$1
  shift
  TOTAL=$((TOTAL + 1))

  local stage_start
  stage_start=$(date +%s)

  echo -e "  ${YELLOW}▶${NC} Running: ${BOLD}${name}${NC}"

  local exit_code=0
  "$@" 2>&1 | sed 's/^/    /' || exit_code=$?

  local stage_end
  stage_end=$(date +%s)
  local duration=$((stage_end - stage_start))

  if [ $exit_code -eq 0 ]; then
    PASSED=$((PASSED + 1))
    echo -e "  ${GREEN}✅ PASS${NC} ${name} ${DIM}(${duration}s)${NC}"
  else
    FAILED=$((FAILED + 1))
    FAILED_STAGES+=("$name")
    echo -e "  ${RED}❌ FAIL${NC} ${name} ${DIM}(${duration}s)${NC}"
  fi
  echo ""
}

skip_stage() {
  local name=$1
  TOTAL=$((TOTAL + 1))
  SKIPPED=$((SKIPPED + 1))
  echo -e "  ${DIM}⏭️  SKIP${NC} ${name}"
}

summary() {
  local end_time
  end_time=$(date +%s)
  local total_time=$((end_time - START_TIME))

  echo ""
  echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
  echo -e "  ${BOLD}📊 CI Pipeline Summary${NC}"
  echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "  ${GREEN}✅ Passed:${NC}  ${PASSED}"
  echo -e "  ${RED}❌ Failed:${NC}  ${FAILED}"
  echo -e "  ${DIM}⏭️  Skipped:${NC} ${SKIPPED}"
  echo -e "  ${DIM}📦 Total:${NC}   ${TOTAL}"
  echo -e "  ${DIM}⏱️  Time:${NC}    ${total_time}s"
  echo ""

  if [ ${#FAILED_STAGES[@]} -gt 0 ]; then
    echo -e "  ${RED}${BOLD}Failed stages:${NC}"
    for stage in "${FAILED_STAGES[@]}"; do
      echo -e "    ${RED}•${NC} ${stage}"
    done
    echo ""
    echo -e "  ${RED}${BOLD}Pipeline FAILED ❌${NC}"
    echo ""
    exit 1
  else
    echo -e "  ${GREEN}${BOLD}Pipeline PASSED ✅${NC}"
    echo ""
  fi
}

# ─── Parse Args ──────────────────────────────────────────────────
STAGE="all"
while [[ $# -gt 0 ]]; do
  case $1 in
    --stage)
      STAGE="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [--stage <stage>]"
      echo ""
      echo "Stages:"
      echo "  all          Run all stages (default)"
      echo "  install      Install dependencies"
      echo "  validate     Full validation suite"
      echo "  structure    Structure validation only"
      echo "  frontmatter  Frontmatter validation only"
      echo "  catalog      Catalog validation only"
      echo "  duplicates   Duplicate detection only"
      echo "  readme       README check"
      echo "  sync         Sync catalog.json"
      echo "  test         Run tests"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

should_run() {
  [[ "$STAGE" == "all" || "$STAGE" == "$1" ]]
}

# ─── Detect Package Manager ─────────────────────────────────────
detect_pm() {
  local dir="${1:-.}"
  if [ -f "$dir/pnpm-lock.yaml" ]; then
    echo "pnpm"
  elif [ -f "$dir/yarn.lock" ]; then
    echo "yarn"
  elif [ -f "$dir/package-lock.json" ]; then
    echo "npm"
  else
    echo "npm"
  fi
}

PM=$(detect_pm)

# ─── Pipeline ────────────────────────────────────────────────────
banner
echo -e "  ${DIM}Package manager: ${PM}${NC}"
echo ""

# Stage 1: Install
if should_run "install"; then
  stage_header 1 "📦 Install Dependencies"
  run_stage "${PM} install" $PM install
else
  skip_stage "Install Dependencies"
fi

# Stage 2: Full Validation
if should_run "validate"; then
  stage_header 2 "🔍 Full Validation Suite"
  run_stage "Full validation" node scripts/validate.js
else
  skip_stage "Full Validation Suite"
fi

# Stage 3: Structure Validation
if should_run "structure"; then
  stage_header 3 "🏗️  Structure Validation"
  run_stage "Structure check" node scripts/validate.js --structure
else
  skip_stage "Structure Validation"
fi

# Stage 4: Frontmatter Validation
if should_run "frontmatter"; then
  stage_header 4 "📝 Frontmatter Validation"
  run_stage "Frontmatter check" node scripts/validate.js --frontmatter
else
  skip_stage "Frontmatter Validation"
fi

# Stage 5: Catalog Validation
if should_run "catalog"; then
  stage_header 5 "📚 Catalog Validation"
  run_stage "Catalog check" node scripts/validate.js --catalog
else
  skip_stage "Catalog Validation"
fi

# Stage 6: Duplicate Detection
if should_run "duplicates"; then
  stage_header 6 "🔎 Duplicate Detection"
  run_stage "Duplicate check" node scripts/validate.js --duplicates
else
  skip_stage "Duplicate Detection"
fi

# Stage 7: README Check
if should_run "readme"; then
  stage_header 7 "📖 README Check"
  run_stage "README check" node scripts/validate.js --readme-check
else
  skip_stage "README Check"
fi

# Stage 8: Catalog Sync
if should_run "sync"; then
  stage_header 8 "🔄 Catalog Sync"
  run_stage "Catalog sync" node scripts/sync-catalog.js
else
  skip_stage "Catalog Sync"
fi

# Stage 9: Tests
if should_run "test"; then
  stage_header 9 "🧪 Tests"
  run_stage "Test suite" node --test tests/
else
  skip_stage "Tests"
fi

# ─── Summary ─────────────────────────────────────────────────────
summary
