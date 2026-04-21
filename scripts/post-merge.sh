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
