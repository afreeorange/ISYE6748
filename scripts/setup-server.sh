#!/bin/bash

set -euo pipefail

# Keep it flat.
echo "Copying data..."
mkdir -p server/data
cp -v data/layers/*.json server/data/
cp -v data/processed/100-layer-frequencies* server/data/
cp -v data/similarity_matrices/*.parquet server/data/
echo "Done"

if [[ -n "$ON_PROVISIONED_SERVER" ]]; then
    echo "Installing dependencies"
    pushd server
    poetry install --no-root
    popd
    echo "Done"
fi
