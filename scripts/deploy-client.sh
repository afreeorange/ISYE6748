#!/bin/bash

set -euo pipefail

rm -rf client/dist
./scripts/setup-client.sh

pushd client
echo "Building website"
pnpm build

echo "Deploying to the ⛅️"
aws s3 sync dist/ s3://icd10.ninja/ --delete
popd

echo "‼️ Don't forget to run an invalidation!"
echo "aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths '/*'"
