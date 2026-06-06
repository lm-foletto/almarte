#!/usr/bin/env bash
# Simple helper to generate a config.js from a .env file
# Usage: copy .env.example -> .env, edit values, then run: ./make-config.sh
set -e
ENV_FILE=.env
OUT=./config.js
if [ ! -f "$ENV_FILE" ]; then
  echo "No $ENV_FILE found. Copy .env.example to .env and fill values." >&2
  exit 1
fi

echo "Generating $OUT from $ENV_FILE"
echo "// Generated config — DO NOT COMMIT" > "$OUT"
echo "window.APP_CONFIG = (function(){ return {" >> "$OUT"

grep -v '^\s*#' "$ENV_FILE" | grep -E '=' || true | while IFS='=' read -r key val; do
  key=$(echo "$key" | tr -d ' '\'\"')
  val=$(echo "$val" | sed 's/^\s*//;s/\s*$//')
  # escape backslashes and quotes
  val=$(printf '%s' "$val" | sed 's/\\/\\\\/g; s/"/\\"/g')
  echo "  ${key}: \"${val}\"," >> "$OUT"
done

echo "}; })();" >> "$OUT"
chmod +x "$OUT" || true

echo "Done. Created $OUT (add to .gitignore)."
