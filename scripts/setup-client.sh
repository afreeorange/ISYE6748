#!/bin/bash

set -euo pipefail

echo "Copying data..."
cp -v data/layers/*.json client/src/data/
cp -v "documents/Mid-term Presentation/Presentation.pdf" client/public/midterm-report.pdf
cp -v "documents/Final Report/Report.pdf" client/public/
echo "Done"
