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
  for (const moduleEntry of registry.modules ?? []) {
    for (const field of ['id', 'boundedContext', 'owner', 'state', 'featureFlag', 'rollbackManifest']) {
      if (!moduleEntry[field]) fail(`module ${moduleEntry.id ?? '<unknown>'} missing ${field}`);
    }
    if (seen.has(moduleEntry.id)) fail(`duplicate module id: ${moduleEntry.id}`);
    seen.add(moduleEntry.id);
    if (!allowed.has(moduleEntry.state)) fail(`module ${moduleEntry.id} has invalid state ${moduleEntry.state}`);

    const rollbackPath = path.join(root, moduleEntry.rollbackManifest);
    if (!fs.existsSync(rollbackPath)) fail(`module ${moduleEntry.id} rollback manifest not found`);
    else {
      const rollback = JSON.parse(fs.readFileSync(rollbackPath, 'utf8'));
      if (rollback.moduleId !== moduleEntry.id) fail(`rollback manifest module mismatch for ${moduleEntry.id}`);
      if (!rollback.featureFlag) fail(`rollback manifest missing featureFlag for ${moduleEntry.id}`);
      if (!rollback.rollbackAction) fail(`rollback manifest missing rollbackAction for ${moduleEntry.id}`);
      if (!Number.isFinite(rollback.maximumRollbackMinutes)) fail(`rollback time missing for ${moduleEntry.id}`);
      if (!Array.isArray(rollback.mandatoryTriggers) || rollback.mandatoryTriggers.length < 2) {
        fail(`rollback manifest needs mandatory triggers for ${moduleEntry.id}`);
      }
    }

    if (moduleEntry.state !== 'legacy') {
      if (!moduleEntry.publicContract || moduleEntry.publicContract === 'pending') fail(`non-legacy module ${moduleEntry.id} requires public contract`);
      if (!Array.isArray(moduleEntry.characterizationTests) || moduleEntry.characterizationTests.length === 0) {
        fail(`non-legacy module ${moduleEntry.id} requires characterization tests`);
      }
    }

    if (moduleEntry.state === 'shadow') {
      if (!moduleEntry.shadow || moduleEntry.shadow.enabled !== true) fail(`shadow module ${moduleEntry.id} requires shadow.enabled=true`);
      if (moduleEntry.shadow.userTrafficPercent !== 0) fail(`shadow module ${moduleEntry.id} must keep user traffic at 0%`);
      if (!Array.isArray(moduleEntry.shadow.comparisonMetrics) || moduleEntry.shadow.comparisonMetrics.length === 0) {
        fail(`shadow module ${moduleEntry.id} requires comparison metrics`);
      }
      if (moduleEntry.cutover?.enabled === true) fail(`shadow module ${moduleEntry.id} must not enable cutover`);
    }

    if (['canary', 'migrated', 'retired'].includes(moduleEntry.state)) {
      if (moduleEntry.ciGateStatus !== 'success') fail(`${moduleEntry.state} module ${moduleEntry.id} requires ciGateStatus=success`);
      if (!moduleEntry.approvedBy) fail(`${moduleEntry.state} module ${moduleEntry.id} requires approvedBy`);
    }
  }
}

if (!process.exitCode) console.log('Safe module migration registry and rollback invariants passed.');
