#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const composeFiles = [
  'docker-compose.yml',
  'docker-compose.platform.yml',
  'docker-compose.platform-enhancements.yml',
];
const args = ['compose'];
for (const file of composeFiles) {
  if (!existsSync(resolve(file))) {
    console.error(`[image-pin-audit] Missing Compose file: ${file}`);
    process.exit(2);
  }
  args.push('-f', file);
}

const envFile = process.env.PLATFORM_ENV_FILE?.trim();
if (envFile) {
  const absolutePath = resolve(envFile);
  if (!existsSync(absolutePath)) {
    console.error(`[image-pin-audit] PLATFORM_ENV_FILE does not exist: ${absolutePath}`);
    process.exit(2);
  }
  args.push('--env-file', absolutePath);
}
args.push('config', '--images');

const result = spawnSync('docker', args, {
  cwd: process.cwd(),
  env: process.env,
  encoding: 'utf8',
  shell: false,
});
if (result.error) {
  console.error(`[image-pin-audit] ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  process.stderr.write(result.stderr || 'Unable to resolve Compose images.\n');
  process.exit(result.status ?? 1);
}

const images = [...new Set(
  String(result.stdout)
    .split(/\r?\n/)
    .map(value => value.trim())
    .filter(Boolean),
)];
if (images.length === 0) {
  console.error('[image-pin-audit] Compose did not return any images.');
  process.exit(1);
}

const requireDigest = process.env.PLATFORM_REQUIRE_IMAGE_DIGEST === 'true';
const failures = [];
for (const image of images) {
  const lower = image.toLowerCase();
  const leaf = image.slice(image.lastIndexOf('/') + 1);
  const hasDigest = /@sha256:[a-f0-9]{64}$/i.test(image);
  const hasTag = leaf.includes(':');

  if (lower.includes('replace-with') || lower.includes('change-me')) {
    failures.push(`${image}: placeholder image reference`);
  } else if (lower === 'latest' || lower.endsWith(':latest')) {
    failures.push(`${image}: latest tag is mutable`);
  } else if (requireDigest && !hasDigest) {
    failures.push(`${image}: immutable sha256 digest is required`);
  } else if (!requireDigest && !hasDigest && !hasTag) {
    failures.push(`${image}: explicit version tag or digest is required`);
  }
}

console.log(`[image-pin-audit] Resolved ${images.length} unique image references.`);
images.forEach(image => console.log(`- ${image}`));
if (failures.length > 0) {
  console.error('[image-pin-audit] FAILED:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`[image-pin-audit] PASS (${requireDigest ? 'digest-required' : 'tag-or-digest'} mode).`);
