#!/usr/bin/env bash
# Build for GitHub Pages and push to the gh-pages branch.
# Usage: npm run deploy
set -euo pipefail

REPO_URL="https://github.com/earthwisegrounding/angie-tatum.git"
BASE="/angie-tatum/"

cd "$(dirname "$0")/.."
DEPLOY_BASE="$BASE" npm run build
cp dist/index.html dist/404.html
touch dist/.nojekyll

TMP=$(mktemp -d)
cp -R dist/* dist/.nojekyll "$TMP"/
cd "$TMP"
git init -qb gh-pages
git add -A
git commit -qm "Deploy Pages build"
git push -f "$REPO_URL" gh-pages
cd - >/dev/null
rm -rf "$TMP"
echo "Deployed → https://earthwisegrounding.github.io/angie-tatum/"
