#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ESLint 9 defaults to the new flat-config system. This project still uses
// .eslintrc.json because eslint-config-next is already wired through
// next/core-web-vitals. Keep the runner cross-platform instead of relying on
// shell-specific environment syntax such as `ESLINT_USE_FLAT_CONFIG=false`.
process.env.ESLINT_USE_FLAT_CONFIG = process.env.ESLINT_USE_FLAT_CONFIG || 'false';

const args = process.argv.slice(2);
const eslintExecutable = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'eslint.cmd' : 'eslint',
);

const defaultIgnorePatterns = [
  '.next/**',
  'node_modules/**',
  'coverage/**',
  'dist/**',
  'dist-init/**',
  '.prisma-runtime/**',
  '.build-logs/**',
  'public/**',
  'docs/**',
];

const hasIgnorePattern = args.includes('--ignore-pattern');
const normalizedArgs = hasIgnorePattern
  ? args
  : args.flatMap((arg, index) => {
      if (index !== args.length - 1) return [arg];
      return [arg, ...defaultIgnorePatterns.flatMap((pattern) => ['--ignore-pattern', pattern])];
    });

if (!fs.existsSync(eslintExecutable)) {
  console.error(`[ESLINT] ESLint executable not found at ${eslintExecutable}.`);
  console.error('[ESLINT] Run npm install --include=dev --ignore-scripts before linting.');
  process.exit(1);
}

console.log('[ESLINT] Using legacy .eslintrc mode for Next.js compatibility.');
console.log(`[ESLINT] Command: ${eslintExecutable} ${normalizedArgs.join(' ')}`);

const result = spawnSync(eslintExecutable, normalizedArgs, {
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
