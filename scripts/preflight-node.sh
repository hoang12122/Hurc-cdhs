#!/bin/bash

# Read the expected Node.js version from .nvmrc
if [ ! -f ".nvmrc" ]; then
  echo "❌ Error: .nvmrc file not found!"
  exit 1
fi

EXPECTED_NODE=$(cat .nvmrc | tr -d '\r' | tr -d ' ' | sed 's/^v//')
if [ -z "$EXPECTED_NODE" ]; then
  echo "❌ Error: .nvmrc is empty!"
  exit 1
fi

# Get the current active Node.js version
ACTUAL_NODE=$(node -v | sed 's/^v//')

echo "🔎 [Preflight] Expected Node version: v$EXPECTED_NODE"
echo "🔎 [Preflight] Actual Node version: v$ACTUAL_NODE"

if [ "$ACTUAL_NODE" != "$EXPECTED_NODE" ]; then
  echo ""
  echo "❌❌❌ NODE.JS VERSION MISMATCH DETECTED! ❌❌❌"
  echo "--------------------------------------------------------"
  echo "Your active Node.js version is v$ACTUAL_NODE, but this project"
  echo "strictly requires Node.js v$EXPECTED_NODE."
  echo "--------------------------------------------------------"
  echo "👉 Action Required:"
  echo "   If you use NVM (Node Version Manager), please run:"
  echo "     nvm install $EXPECTED_NODE"
  echo "     nvm use $EXPECTED_NODE"
  echo ""
  echo "   Otherwise, please download and install Node.js v$EXPECTED_NODE"
  echo "   manually from: https://nodejs.org/dist/v$EXPECTED_NODE/"
  echo "--------------------------------------------------------"
  echo ""
  exit 1
fi

echo "✅ [Preflight] Node.js version matches .nvmrc successfully."
