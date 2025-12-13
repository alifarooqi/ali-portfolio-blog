#!/usr/bin/env bash
set -euo pipefail

# ---- Config ----
BASE_BRANCH="main"
BRANCH_PREFIX="auto"
COMMIT_MSG=${1:-"chore: automated update"}
PR_TITLE="$COMMIT_MSG"
PR_BODY="This PR was created and merged automatically 🤖"

# ---- Sanity checks ----
git rev-parse --is-inside-work-tree >/dev/null
command -v gh >/dev/null || { echo "❌ gh CLI not found"; exit 1; }

if git diff --quiet && git diff --cached --quiet; then
  echo "🟡 No changes to commit"
  exit 0
fi

# ---- Create branch ----
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BRANCH="$BRANCH_PREFIX/$TIMESTAMP"

echo "🌱 Creating branch $BRANCH"
git checkout -b "$BRANCH"

# ---- Commit & push ----
git add .
git commit -m "$COMMIT_MSG"
git push -u origin "$BRANCH"

# ---- Create PR ----
echo "📬 Creating PR"
gh pr create \
  --base "$BASE_BRANCH" \
  --head "$BRANCH" \
  --title "$PR_TITLE" \
  --body "$PR_BODY"

echo "🔗 PR created"

# ---- Merge PR ----
echo "🧩 Merging PR"
gh pr merge \
  --merge \
  --delete-branch

# ---- Return to base ----
git checkout "$BASE_BRANCH"
git pull origin "$BASE_BRANCH"

echo "✅ Done. Changes merged into $BASE_BRANCH"
