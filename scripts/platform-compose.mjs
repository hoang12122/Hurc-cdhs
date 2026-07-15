#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
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

function readEnvironmentFile(filePath) {
  if (!filePath) return {};
  const values = {};
  for (const rawLine of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    values[key] = value;
  }
  return values;
}

const envFile = process.env.PLATFORM_ENV_FILE?.trim();
let envFilePath = null;
if (envFile) {
  envFilePath = resolve(envFile);
  if (!existsSync(envFilePath)) {
    console.error(`PLATFORM_ENV_FILE does not exist: ${envFilePath}`);
    process.exit(2);
  }
}
const fileEnvironment = readEnvironmentFile(envFilePath);
const deploymentMode = process.env.PLATFORM_DEPLOYMENT_MODE
  ?? fileEnvironment.PLATFORM_DEPLOYMENT_MODE
  ?? 'development';
const useProductionImages = deploymentMode === 'production'
  || process.env.PLATFORM_USE_PRODUCTION_IMAGES === 'true';

const composeFiles = [
  'docker-compose.yml',
  'docker-compose.platform.yml',
  'docker-compose.mlflow-security.yml',
  'docker-compose.platform-enhancements.yml',
  'docker-compose.etl-accepted.yml',
  'docker-compose.vision-scada.yml',
  ...(useProductionImages ? ['docker-compose.platform-production-images.yml'] : []),
];
const args = ['compose'];
for (const file of composeFiles) {
  if (!existsSync(resolve(file))) {
    console.error(`Required compose file does not exist: ${file}`);
    process.exit(2);
  }
  args.push('-f', file);
}
if (envFilePath) args.push('--env-file', envFilePath);

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
  ...fileEnvironment,
  PLATFORM_DEPLOYMENT_MODE: deploymentMode,
  ...(action === 'up' ? { DATA_PLATFORM_PHASE: String(phase) } : {}),
};

console.log(`[platform-compose] docker ${args.join(' ')}`);
console.log(`[platform-compose] PLATFORM_DEPLOYMENT_MODE=${deploymentMode}`);
if (action === 'up') console.log(`[platform-compose] DATA_PLATFORM_PHASE=${phase}`);
if (useProductionImages) console.log('[platform-compose] immutable production image override enabled');
console.log('[platform-compose] MLflow security override enabled');

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
