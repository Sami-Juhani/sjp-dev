#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"

# This will only ignore the the build when pushing to development branch
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ||  "$VERCEL_GIT_COMMIT_REF" == "preview"  ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi