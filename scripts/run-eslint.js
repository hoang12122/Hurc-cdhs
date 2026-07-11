#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const eslintExecutable = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'eslint.cmd' : 'eslint',
);

// ESLint 9 uses flat config by default. Keep this runner only as a
// cross-platform wrapper around the local CLI and avoid legacy eslintrc mode.
delete process.env.ESLINT_USE_FLAT_CONFIG;

if (!fs.existsSync(eslintExecutable)) {
  console.error(`[ESLINT] ESLint executable not found at ${eslintExecutable}.`);
  console.error('[ESLINT] Run npm install --include=dev --ignore-scripts before linting.');
  process.exit(1);
}

console.log('[ESLINT] Using ESLint flat config.');
console.log(`[ESLINT] Command: ${eslintExecutable} ${args.join(' ')}`);

const result = spawnSync(eslintExecutable, args, {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

if (result.error) {
  console.error('[ESLINT] Failed to start ESLint:', result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`[ESLINT] ESLint failed with exit code ${result.status}.`);
}

process.exit(result.status ?? 1);
