#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const composeFiles = [
  'docker-compose.yml',
  'docker-compose.platform.yml',
  'docker-compose.platform-enhancements.yml',
  'docker-compose.etl-accepted.yml',
  'docker-compose.platform-production-images.yml',
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
args.push('--profile', '*', 'config', '--format', 'json');

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
  process.stderr.write(result.stderr || 'Unable to resolve Compose configuration.\n');
  process.exit(result.status ?? 1);
}

let configuration;
try {
  configuration = JSON.parse(String(result.stdout));
} catch (error) {
  console.error('[image-pin-audit] Compose did not return valid JSON:', error);
  process.exit(1);
}

const phasePattern = /^phase[1-4]$/;
const services = Object.entries(configuration.services ?? {})
  .filter(([, service]) => Array.isArray(service.profiles)
    && service.profiles.some(profile => phasePattern.test(String(profile))));
if (services.length === 0) {
  console.error('[image-pin-audit] No Phase 1-4 services were resolved.');
  process.exit(1);
}

const requireDigest = process.env.PLATFORM_REQUIRE_IMAGE_DIGEST !== 'false';
const failures = [];
const audited = [];
for (const [serviceName, service] of services) {
  const image = String(service.image ?? '').trim();
  audited.push({ serviceName, image });
  const lower = image.toLowerCase();
  const leaf = image.slice(image.lastIndexOf('/') + 1);
  const hasDigest = /@sha256:[a-f0-9]{64}$/i.test(image);
  const hasTag = leaf.includes(':');

  if (!image) {
    failures.push(`${serviceName}: production image reference is missing`);
  } else if (lower.includes('replace-with') || lower.includes('change-me')) {
    failures.push(`${serviceName}: placeholder image reference (${image})`);
  } else if (lower === 'latest' || lower.endsWith(':latest')) {
    failures.push(`${serviceName}: latest tag is mutable (${image})`);
  } else if (requireDigest && !hasDigest) {
    failures.push(`${serviceName}: immutable sha256 digest is required (${image})`);
  } else if (!requireDigest && !hasDigest && !hasTag) {
    failures.push(`${serviceName}: explicit version tag or digest is required (${image})`);
  }
}

console.log(`[image-pin-audit] Audited ${audited.length} Phase 1-4 services.`);
audited.forEach(item => console.log(`- ${item.serviceName}: ${item.image || '<missing>'}`));
if (failures.length > 0) {
  console.error('[image-pin-audit] FAILED:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`[image-pin-audit] PASS (${requireDigest ? 'digest-required' : 'tag-or-digest'} mode).`);
