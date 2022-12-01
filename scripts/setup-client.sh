#!/bin/bash

set -euo pipefail

echo "Copying data..."
cp -v data/layers/*.json client/src/layers/
cp -v data/layers/*.json client/public/
cp -v "Final Report/Report.pdf" client/public/
echo "Done"
