#!/bin/bash
# LOCKFILE INTEGRITY VERIFIER
# Ensures package-lock.json is consistent with package.json

echo "🔍 Verifying lockfile integrity..."

# Check if npm ci would work without changes
if ! npm ci --dry-run &> /dev/null; then
    echo "❌ Error: package-lock.json is out of sync with package.json."
    echo "Run 'npm install' locally to update the lockfile."
    exit 1
fi

echo "✅ Lockfile is synchronized."
