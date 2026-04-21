#!/bin/bash
set -e

if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund || npm i --no-audit --no-fund
else
  npm i --no-audit --no-fund
fi

if [ -n "$DATABASE_URL" ]; then
  npx drizzle-kit push --force || true
fi

# Install Playwright's bundled Chromium so tests/e2e/*.spec.ts can run.
# This is a no-op once the browser is already cached.
npx playwright install chromium >/dev/null 2>&1 || true
