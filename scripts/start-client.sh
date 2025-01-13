#!/bin/bash

set -euo pipefail

npm run setup:client

# Start a live-reloading server
cd client
npm i
npm run start
