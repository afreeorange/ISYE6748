#!/bin/bash

set -euo pipefail

yarn setup:client

pushd client
echo "Building website"
yarn build

echo "Deploying to the ⛅️"
aws s3 sync build/ s3://icd10.ninja/ --delete
popd
