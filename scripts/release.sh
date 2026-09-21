#!/bin/zsh
# Release helper: bump the cache version, stage the site, zip it, and
# optionally deploy to Netlify production.
#
#   scripts/release.sh 29            # bump to v29, stage + zip
#   scripts/release.sh 29 --deploy   # also `netlify deploy --prod`
#
# Requires the Netlify CLI (bundled in .netlify-tools or on PATH) and a linked
# site (`netlify link --id <site id>`) for --deploy.
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT"

VERSION="${1:-}"
[[ -n "$VERSION" && "$VERSION" == <-> ]] || { echo "usage: scripts/release.sh <number> [--deploy]" >&2; exit 2; }
DEPLOY="${2:-}"

# 1. Bump the single cache version and the matching ?v= URLs.
sed -i '' -E "s/const CACHE_VERSION = \"iag-v[0-9]+\";/const CACHE_VERSION = \"iag-v${VERSION}\";/" sw.js
sed -i '' -E "s/\?v=[0-9]+/?v=${VERSION}/g" sw.js index.html
grep -q "iag-v${VERSION}" sw.js && grep -q "?v=${VERSION}" index.html

# 2. Syntax checks (the README's verification list).
node --check js/app.js && node --check js/content.js && node --check sw.js

# 3. Stage only the files the site needs.
STAMP="$(date +%Y%m%d-%H%M%S)"
STAGE="output/releases/netlify-v${VERSION}-${STAMP}"
mkdir -p "$STAGE"
cp -R index.html sw.js manifest.webmanifest _headers css js assets icons vendor "$STAGE"/
find "$STAGE" -name .DS_Store -delete
ZIP="output/releases/Into-Action-Group-v${VERSION}-${STAMP}.zip"
(cd "$STAGE" && zip -qr "$ROOT/$ZIP" .)
echo "staged: $STAGE"
echo "zip:    $ZIP"

# 4. Optional production deploy.
if [[ "$DEPLOY" == "--deploy" ]]; then
  NETLIFY="${ROOT}/.netlify-tools/node_modules/.bin/netlify"
  [[ -x "$NETLIFY" ]] || NETLIFY="netlify"
  "$NETLIFY" deploy --prod --dir="$STAGE" --message "v${VERSION}"
fi
