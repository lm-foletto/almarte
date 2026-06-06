#!/usr/bin/env bash
#!/usr/bin/env bash
# Sobe o site Almarte localmente em http://localhost:8000
set -euo pipefail
cd "$(dirname "$0")"

# If there's a virtualenv in ./venv, activate it so make-config or Python use the venv
if [ -f "venv/bin/activate" ]; then
	# shellcheck disable=SC1091
	source "venv/bin/activate"
fi

PORT="${1:-8000}"

# If a local .env exists, generate config.js from it (local dev). This mirrors CI behavior.
if [ -f ".env" ]; then
	if [ -x "./make-config.sh" ]; then
		echo "Found .env — generating config.js from .env"
		./make-config.sh
	else
		echo "Found .env but make-config.sh not executable or missing; skipping config generation"
	fi
else
	echo "No .env found — using default fallbacks (or CI-generated config.js)."
fi

echo "Almarte rodando em http://localhost:$PORT  (Ctrl+C para parar)"
python3 -m http.server "$PORT"

