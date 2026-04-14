#!/bin/bash
# Usage: ./scripts/call-api.sh "#2d308b" "#e1aacb"

REFERENCE=$1
TARGET=$2
OWNER="YOUR_USERNAME"
REPO="photoshop-hsl-delta"
TOKEN=$GITHUB_TOKEN

# Trigger the workflow
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$OWNER/$REPO/actions/workflows/hsl-delta-api.yml/dispatches" \
  -d "{\"ref\":\"main\",\"inputs\":{\"reference\":\"$REFERENCE\",\"target\":\"$TARGET\"}}"

echo "Workflow triggered. Check:"
echo "https://github.com/$OWNER/$REPO/actions"