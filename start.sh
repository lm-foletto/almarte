#!/usr/bin/env bash
# Sobe o site Almarte localmente em http://localhost:8000
set -e
cd "$(dirname "$0")"
PORT="${1:-8000}"
echo "Almarte rodando em http://localhost:$PORT  (Ctrl+C para parar)"
python3 -m http.server "$PORT"
