#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const minimumVersion = [3, 10, 0];
const failures = [];

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

function parseVersion(value) {
  const match = String(value).match(/(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function compareVersion(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function requireText(content, expected, message) {
  if (!content.includes(expected)) failures.push(message);
}

const requirements = read('infra/vision-trainer/requirements.txt');
const securityOverride = read('docker-compose.mlflow-security.yml');
const platformCompose = read('docker-compose.platform.yml');
const platformRunner = read('scripts/platform-compose.mjs');

const packageMatch = requirements.match(/^mlflow==([^\s]+)$/m);
if (!packageMatch) {
  failures.push('infra/vision-trainer/requirements.txt must pin MLflow exactly.');
}
const packageVersion = packageMatch ? parseVersion(packageMatch[1]) : null;
if (!packageVersion || compareVersion(packageVersion, minimumVersion) < 0) {
  failures.push('MLflow Python dependency must be at least 3.10.0.');
}

const imageMatch = securityOverride.match(/ghcr\.io\/mlflow\/mlflow:v(\d+\.\d+\.\d+)/);
const imageVersion = imageMatch ? parseVersion(imageMatch[1]) : null;
if (!imageVersion || compareVersion(imageVersion, minimumVersion) < 0) {
  failures.push('MLflow container image must be at least v3.10.0.');
}
if (packageVersion && imageVersion && compareVersion(packageVersion, imageVersion) !== 0) {
  failures.push('MLflow Python client and server image versions must match.');
}

requireText(platformRunner, "'docker-compose.mlflow-security.yml'", 'Platform compose must load the MLflow security override.');
requireText(securityOverride, 'MLFLOW_SERVER_ENABLE_JOB_EXECUTION: "false"', 'MLflow job execution must be explicitly disabled.');
requireText(securityOverride, 'MLFLOW_SERVER_ALLOWED_HOSTS: "mlflow:5000,hurc_mlflow:5000,localhost:*,127.0.0.1:*"', 'MLflow must allow only the expected internal and loopback Host headers.');
requireText(securityOverride, 'read_only: true', 'MLflow container root filesystem must be read-only.');
requireText(securityOverride, 'no-new-privileges:true', 'MLflow container must enable no-new-privileges.');
requireText(securityOverride, 'cap_drop:', 'MLflow container must drop Linux capabilities.');
requireText(platformCompose, '127.0.0.1:${MLFLOW_HOST_PORT:-5000}:5000', 'MLflow host port must remain bound to loopback only.');

const trackedFiles = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => !file.startsWith('docs/'))
  .filter((file) => file !== 'scripts/check-mlflow-security.mjs')
  .filter((file) => /(^|\/)(Dockerfile[^/]*|[^/]+\.(py|ya?ml|ini|toml|env|txt|ts|tsx|js|mjs))$/i.test(file));

const forbiddenPatterns = [
  ['MLflow job execution enabled', /MLFLOW_SERVER_ENABLE_JOB_EXECUTION\s*[:=]\s*["']?true/i],
  ['MLServer shell serving enabled', /enable_mlserver\s*=\s*True/i],
  ['LOCAL model environment manager', /env_manager\s*=\s*["']?LOCAL/i],
  ['unsafe upload filename preservation', /UPLOAD_KEEP_FILENAME\s*[:=]\s*True/i],
  ['MLflow basic-auth app enabled without reviewed gateway', /--app-name\s+basic-auth/i],
];

for (const file of trackedFiles) {
  const content = read(file);
  for (const [label, pattern] of forbiddenPatterns) {
    if (pattern.test(content)) failures.push(`${label}: ${file}`);
  }
}

if (failures.length > 0) {
  console.error('[mlflow-security] Security invariant violations detected:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[mlflow-security] PASS: MLflow ${packageMatch?.[1]} is pinned, isolated, job execution is disabled, and unsafe serving options are absent.`);
