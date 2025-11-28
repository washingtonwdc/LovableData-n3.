#!/bin/sh
set -e
SEED_DIR=/app/seed_assets
TARGET_DIR=/app/attached_assets
SEED_FILE="dados estruturados normalizado_1763396739562.json"
if [ ! -f "$TARGET_DIR/$SEED_FILE" ] && [ -f "$SEED_DIR/$SEED_FILE" ]; then
  mkdir -p "$TARGET_DIR"
  cp "$SEED_DIR/$SEED_FILE" "$TARGET_DIR/"
fi
exec node dist/index.js
