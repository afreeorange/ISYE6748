#!/bin/bash

set -euo pipefail

npm run setup:server

echo "Starting a live-reloading server..."
cd server
FLASK_DEBUG=1 uv run flask --app server run
