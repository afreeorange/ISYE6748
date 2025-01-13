#!/bin/bash

set -euo pipefail

npm run setup:client

pushd client
echo "Building website"
npm run build

echo "Deploying to the ⛅️"
aws s3 sync build/ s3://icd10.ninja/ --delete
popd

echo "‼️ Don't forget to run an invalidation!"
echo "aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths '/*'"
