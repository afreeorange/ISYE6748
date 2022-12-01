#!/bin/bash

set -euo pipefail

yarn setup:client

# Start a live-reloading server
cd client
yarn
yarn start
