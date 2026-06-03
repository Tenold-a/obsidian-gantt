#!/usr/bin/env bash
set -euo pipefail

# === One-click release script for obsidian-gantt ===
# Usage:
#   ./scripts/release.sh 0.3.0              # explicit version
#   ./scripts/release.sh patch              # auto-increment patch
#   ./scripts/release.sh minor --ci         # CI mode: skip local release, let Actions handle it
#   DRY_RUN=1 ./scripts/release.sh 0.3.0    # preview without executing
#
# Flags:
#   --ci    Skip local gh release create (GitHub Actions will do it)

DRY_RUN="${DRY_RUN:-0}"
CI_MODE=0
NEW_VERSION=""
for arg in "$@"; do
  case "$arg" in
    --ci) CI_MODE=1 ;;
    *) NEW_VERSION="$arg" ;;
  esac
done
NEW_VERSION="${NEW_VERSION:-patch}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# ── Resolve version ──────────────────────────────────────────────
CURRENT="$(node -p "require('$ROOT/package.json').version")"

if [[ "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  VERSION="$NEW_VERSION"
elif [[ "$NEW_VERSION" == "patch" || "$NEW_VERSION" == "minor" || "$NEW_VERSION" == "major" ]]; then
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"
  case "$NEW_VERSION" in
    patch) PATCH=$((PATCH + 1)) ;;
    minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
    major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  esac
  VERSION="$MAJOR.$MINOR.$PATCH"
else
  echo "ERROR: version must be X.Y.Z, 'patch', 'minor', or 'major'"
  exit 1
fi

echo ""
echo "  Version: $CURRENT → $VERSION"
echo "  Dry run: $DRY_RUN"
echo ""

# ── Safety checks ────────────────────────────────────────────────
if [[ "$DRY_RUN" == "1" ]]; then
  dry() { echo "  [dry] $*"; }
else
  dry() { "$@"; }
fi

cd "$ROOT"

# Must be on main and clean
BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "main" ]]; then
  echo "WARNING: not on 'main' branch (current: $BRANCH)"
  echo "Press Enter to continue anyway, Ctrl+C to abort..."
  read -r
fi

if [[ -n "$(git status --porcelain)" && "$DRY_RUN" != "1" ]]; then
  echo "ERROR: working tree is not clean. Commit or stash changes first."
  exit 1
fi

# ── Bump versions ────────────────────────────────────────────────
echo "=== Bumping versions to $VERSION ==="

bump_json() {
  local file="$1"
  node -e "
    const p = require('$file');
    p.version = '$VERSION';
    require('fs').writeFileSync('$file', JSON.stringify(p, null, 2) + '\n');
  "
  echo "  $file"
}

dry bump_json "$ROOT/package.json"
dry bump_json "$ROOT/packages/gantt-core/package.json"
dry bump_json "$ROOT/packages/gantt-ui/package.json"
dry bump_json "$ROOT/packages/obsidian-plugin/package.json"
dry bump_json "$ROOT/packages/web-app/package.json"
dry bump_json "$ROOT/packages/obsidian-plugin/manifest.json"

# ── Build ────────────────────────────────────────────────────────
echo ""
echo "=== Building all packages ==="

dry npm run build:core
dry npm run build:ui
dry npm run build:plugin

# ── Commit & tag ─────────────────────────────────────────────────
echo ""
echo "=== Committing and tagging ==="

dry git add \
  package.json \
  packages/gantt-core/package.json \
  packages/gantt-ui/package.json \
  packages/obsidian-plugin/package.json \
  packages/obsidian-plugin/manifest.json \
  packages/web-app/package.json

dry git commit -m "chore: bump version to $VERSION"
dry git tag -a "v$VERSION" -m "v$VERSION"

# ── Push ─────────────────────────────────────────────────────────
echo ""
echo "=== Pushing ==="
dry git push origin main
dry git push origin "v$VERSION"

# ── Test package ─────────────────────────────────────────────────
echo ""
echo "=== Building test-data package ==="

TEST_ZIP="$ROOT/obsidian-gantt-test.zip"
dry bash "$ROOT/scripts/package-test.sh" "$TEST_ZIP"

# ── GitHub Release ───────────────────────────────────────────────
if [[ "$CI_MODE" == "1" ]]; then
  echo ""
  echo "=== CI mode: skipping local release (GitHub Actions will handle it) ==="
else
  echo ""
  echo "=== Creating GitHub release ==="

  NOTES="## Changes since v$CURRENT

$(git log --oneline "v$CURRENT..v$VERSION" 2>/dev/null || git log --oneline -10)"

  dry gh release create "v$VERSION" \
    --title "v$VERSION" \
    --notes "$NOTES" \
    packages/obsidian-plugin/main.js \
    packages/obsidian-plugin/main.js.map \
    packages/obsidian-plugin/manifest.json \
    packages/obsidian-plugin/styles.css \
    "$TEST_ZIP"
fi

echo ""
echo "=== Done: v$VERSION released ==="
echo "  Release: $(gh repo view --json url -q '.url')/releases/tag/v$VERSION"
