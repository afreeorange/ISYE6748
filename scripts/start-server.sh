#!/bin/bash

set -euo pipefail

echo "Starting a live-reloading server..."
cd server
FLASK_DEBUG=1 uv run flask --app server run
