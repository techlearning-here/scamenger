---
name: add-flashcards
description: Pick 5 pending stories from story-queue.csv, verify flashcard rendering via Playwright E2E, mark FlashCardAdded=True in CSV, commit, push, and open a GitHub PR — all from a dedicated git worktree.
---

# add-flashcards

Pick 5 stories from `docs/story-queue.csv` where `FlashCardAdded` is `False`, verify each renders flashcards via Playwright, mark them done in the CSV, commit, push, and open a PR — all from a dedicated git worktree.

## Rules

- Work entirely inside the worktree. Never modify the main working tree during the run.
- Skip a story (do not mark True) if its content file is missing or Playwright fails.
- Load GH credentials from `frontend/.secrets` before any `gh` command.
- If fewer than 5 pending stories remain, process however many are left.

## Steps

### 1. Create worktree + branch

```bash
REPO_ROOT=$(git -C /Users/sunilgovindan/Work/scamenger/scamenger rev-parse --show-toplevel)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BRANCH="flashcards/batch-${TIMESTAMP}"
WORKTREE="/tmp/scamenger-flashcards-${TIMESTAMP}"

git -C "$REPO_ROOT" worktree add "$WORKTREE" -b "$BRANCH"
echo "Worktree: $WORKTREE  Branch: $BRANCH"
```

### 2. Pick 5 pending stories

Run this Python snippet to extract the slugs:

```bash
python3 - <<'EOF'
import csv

csv_path = "/Users/sunilgovindan/Work/scamenger/scamenger/docs/story-queue.csv"
with open(csv_path, newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

pending = [r for r in rows if r.get('FlashCardAdded', 'False').strip() == 'False'][:5]
for r in pending:
    slug = r['story_file'].replace('.json', '')
    print(slug)
EOF
```

Capture the slugs as a list. If none, print "No pending stories — all done." and stop.

### 3. For each slug

#### 3a. Verify the content file exists

```bash
SLUG="<current-slug>"
CONTENT_FILE="$WORKTREE/frontend/src/data/scam-stories-content/${SLUG}.ts"
if [ ! -f "$CONTENT_FILE" ]; then
  echo "SKIP $SLUG — content file missing"
  continue
fi
echo "OK  $SLUG — content file found"
```

#### 3b. Run Playwright test

```bash
cd "$WORKTREE/frontend"
TEST_STORY_SLUG="$SLUG" node_modules/.bin/playwright test e2e/flashcards.spec.ts 2>&1
```

- If exit code 0 → mark as passed.
- If non-zero → print the output, mark as SKIP, continue to next story.

### 4. Update CSV for all passed stories

Run this Python snippet once after all stories are processed, passing in the list of slugs that passed:

```bash
python3 - <<'EOF'
import csv, sys

passed_slugs = set(sys.argv[1:])
csv_path = "$WORKTREE/docs/story-queue.csv"

with open(csv_path, newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))
    fieldnames = rows[0].keys() if rows else []

updated = 0
for row in rows:
    slug = row['story_file'].replace('.json', '')
    if slug in passed_slugs:
        row['FlashCardAdded'] = 'True'
        updated += 1

with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    w.writerows(rows)

print(f"Marked {updated} stories as FlashCardAdded=True")
EOF
```

### 5. Commit

```bash
cd "$WORKTREE"
git add docs/story-queue.csv
git commit -m "flashcards: mark $(echo $PASSED_SLUGS | wc -w | tr -d ' ') stories as FlashCardAdded=True

Stories processed:
$(echo "$PASSED_SLUGS" | tr ' ' '\n' | sed 's/^/- /')

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

### 6. Push branch

```bash
cd "$WORKTREE"
git push origin "$BRANCH"
```

### 7. Create PR

```bash
source /Users/sunilgovindan/Work/scamenger/scamenger/frontend/.secrets
cd "$WORKTREE"
GH_TOKEN="$GH_TOKEN" gh pr create \
  --title "flashcards: add FlashCardAdded tracking for batch ${TIMESTAMP}" \
  --body "$(cat <<PREOF
## Summary

Marks the following stories as verified for flashcard rendering:

$(echo "$PASSED_SLUGS" | tr ' ' '\n' | sed 's/^/- /')

## What was checked

- Content file (\`.ts\`) exists in \`src/data/scam-stories-content/\`
- Playwright E2E (Chromium, headless): all 7 flashcard tests pass against \`localhost:3000\`
- \`FlashCardAdded\` column updated to \`True\` in \`docs/story-queue.csv\`

## Test run

\`\`\`
7 passed per story
\`\`\`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
PREOF
)"
```

### 8. Report

Print a summary table:

```
✓  <slug>   — 7/7 tests passed
✓  <slug>   — 7/7 tests passed
✗  <slug>   — SKIPPED (content file missing)
...

Branch:  flashcards/batch-<timestamp>
PR:      <url>
```
