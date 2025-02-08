#!/bin/bash

set -euo pipefail

# Start a live-reloading server
cd client
pnpm i
pnpm dev
