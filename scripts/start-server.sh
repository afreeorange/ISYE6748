#!/bin/bash

set -euo pipefail

yarn setup:server

echo "Starting a live-reloading server..."
cd server
FLASK_DEBUG=1 poetry run flask --app server run
