#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const action = process.argv[2] ?? 'config';
const phase = Number(process.argv[3] ?? 0);
const supportedActions = new Set(['config', 'up', 'down', 'logs', 'ps']);

if (!supportedActions.has(action)) {
  console.error(`Unsupported platform action: ${action}`);
  process.exit(2);
}
if (action === 'up' && (!Number.isInteger(phase) || phase < 1 || phase > 4)) {
  console.error('Platform phase must be an integer from 1 to 4.');
  process.exit(2);
}

const args = [
  'compose',
  '-f',
  'docker-compose.yml',
  '-f',
  'docker-compose.platform.yml',
];

const envFile = process.env.PLATFORM_ENV_FILE?.trim();
if (envFile) {
  const absolutePath = resolve(envFile);
  if (!existsSync(absolutePath)) {
    console.error(`PLATFORM_ENV_FILE does not exist: ${absolutePath}`);
    process.exit(2);
  }
  args.push('--env-file', absolutePath);
}

if (action === 'config') {
  args.push('config', '--quiet');
} else if (action === 'up') {
  args.push('--profile', 'core', '--profile', `phase${phase}`, 'up', '-d');
} else if (action === 'down') {
  args.push('down');
} else if (action === 'logs') {
  args.push('logs', '--tail', process.env.PLATFORM_LOG_TAIL ?? '200');
} else if (action === 'ps') {
  args.push('ps');
}

const childEnvironment = {
  ...process.env,
  ...(action === 'up' ? { DATA_PLATFORM_PHASE: String(phase) } : {}),
};

console.log(`[platform-compose] docker ${args.join(' ')}`);
if (action === 'up') {
  console.log(`[platform-compose] DATA_PLATFORM_PHASE=${phase}`);
}
const result = spawnSync('docker', args, {
  cwd: process.cwd(),
  env: childEnvironment,
  stdio: 'inherit',
  shell: false,
});

if (result.error) {
  console.error(`[platform-compose] ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
