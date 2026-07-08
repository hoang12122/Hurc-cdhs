#!/usr/bin/env node

const { spawnSync } = require('node:child_process');

// ESLint 9 defaults to the new flat-config system. This project still uses
// .eslintrc.json because eslint-config-next is already wired through
// next/core-web-vitals. Keep the runner cross-platform instead of relying on
// shell-specific environment syntax such as `ESLINT_USE_FLAT_CONFIG=false`.
process.env.ESLINT_USE_FLAT_CONFIG = process.env.ESLINT_USE_FLAT_CONFIG || 'false';

const args = process.argv.slice(2);
const eslintBin = require.resolve('eslint/bin/eslint.js');

const result = spawnSync(process.execPath, [eslintBin, ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

if (result.error) {
  console.error('[ESLINT] Failed to start ESLint:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
