#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
  echo "Creating local Python venv..."
  python3 -m venv .venv || {
    echo ""
    echo "ERROR: Cannot create virtual environment."
    echo "Install WSL package: sudo apt install python3-venv" 
    echo "Then re-run ./run-backend.sh"
    exit 1
  }
fi

. .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
