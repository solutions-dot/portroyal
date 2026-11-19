#!/bin/bash
# Vercel's "Ignored Build Step" (vercel.json ignoreCommand), to save build minutes (owner, 19 November 2026).
# Exit 0 = skip this build. Exit 1 = build. When in doubt (a git error, no earlier deploy to compare with) it builds.
# 1. Only main is built: work branches (claude/..., review/...) do not make preview builds.
# 2. On main, a push that changes nothing the site is made from (docs, tests, most tools) is skipped.
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then echo "Skip: branch $VERCEL_GIT_COMMIT_REF is not main."; exit 0; fi
BASE="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$BASE" ]; then echo "Build: no earlier deploy to compare with."; exit 1; fi
git cat-file -e "$BASE^{commit}" 2>/dev/null || git fetch --quiet --depth=50 origin "$BASE" 2>/dev/null || true
if ! git cat-file -e "$BASE^{commit}" 2>/dev/null; then echo "Build: cannot see the last deployed commit."; exit 1; fi
if git diff --quiet "$BASE" HEAD -- games engine shared menu tools/build.mjs tools/dist.mjs tools/anim_subset.mjs package.json package-lock.json vercel.json; then
  echo "Skip: nothing the site is built from changed since $BASE."; exit 0
fi
echo "Build: site files changed."; exit 1
