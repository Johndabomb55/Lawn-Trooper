#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/downloads"
OUTPUT_FILE="$OUTPUT_DIR/project.zip"

mkdir -p "$OUTPUT_DIR"

cd "$ROOT_DIR"
zip -r "$OUTPUT_FILE" client server shared public package.json tsconfig.json vite.config.ts components.json >/dev/null

echo "Created: $OUTPUT_FILE"
