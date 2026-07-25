#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(root, 'architecture/migration-registry.json');
const policyPath = path.join(root, 'docs/technical/LEGACY_MODULE_MIGRATION_STRATEGY.md');

const fail = (message) => {
  console.error(`SAFE_MIGRATION_CHECK_FAILED: ${message}`);
  process.exitCode = 1;
};

if (!fs.existsSync(registryPath)) fail('missing architecture/migration-registry.json');
if (!fs.existsSync(policyPath)) fail('missing migration policy document');

if (!process.exitCode) {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const allowed = new Set(registry.allowedStates ?? []);
  const requiredStates = ['legacy', 'isolated', 'shadow', 'canary', 'migrated', 'retired'];
  for (const state of requiredStates) {
    if (!allowed.has(state)) fail(`missing allowed migration state: ${state}`);
  }

  const seen = new Set();
  for (const module of registry.modules ?? []) {
    for (const field of ['id', 'boundedContext', 'owner', 'state', 'featureFlag', 'rollbackManifest']) {
      if (!module[field]) fail(`module ${module.id ?? '<unknown>'} missing ${field}`);
    }
    if (seen.has(module.id)) fail(`duplicate module id: ${module.id}`);
    seen.add(module.id);
    if (!allowed.has(module.state)) fail(`module ${module.id} has invalid state ${module.state}`);

    const rollbackPath = path.join(root, module.rollbackManifest);
    if (!fs.existsSync(rollbackPath)) fail(`module ${module.id} rollback manifest not found`);
    else {
      const rollback = JSON.parse(fs.readFileSync(rollbackPath, 'utf8'));
      if (rollback.moduleId !== module.id) fail(`rollback manifest module mismatch for ${module.id}`);
      if (!rollback.featureFlag) fail(`rollback manifest missing featureFlag for ${module.id}`);
      if (!rollback.rollbackAction) fail(`rollback manifest missing rollbackAction for ${module.id}`);
      if (!Number.isFinite(rollback.maximumRollbackMinutes)) fail(`rollback time missing for ${module.id}`);
      if (!Array.isArray(rollback.mandatoryTriggers) || rollback.mandatoryTriggers.length < 2) {
        fail(`rollback manifest needs mandatory triggers for ${module.id}`);
      }
    }

    if (module.state !== 'legacy') {
      if (!module.publicContract || module.publicContract === 'pending') fail(`non-legacy module ${module.id} requires public contract`);
      if (!Array.isArray(module.characterizationTests) || module.characterizationTests.length === 0) {
        fail(`non-legacy module ${module.id} requires characterization tests`);
      }
    }
  }
}

if (!process.exitCode) console.log('Safe module migration registry and rollback invariants passed.');
