#!/usr/bin/env node

export const PROMOTION_STATES = [
  'quarantine',
  'standardized',
  'security-reviewed',
  'approved',
  'recovery-ready',
];

export const LOADABLE_STATES = new Set(['approved', 'recovery-ready']);

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`Missing or invalid ${field}`);
}

function requireHex(value, length, field) {
  if (typeof value !== 'string' || !new RegExp(`^[a-f0-9]{${length}}$`).test(value)) {
    throw new Error(`Missing or invalid ${field}`);
  }
}

export function validateModelRecord(model, { requireChecksums = true } = {}) {
  for (const field of ['id', 'alias', 'version', 'artifactPath', 'license', 'licenseEvidence', 'sourceUri', 'sourceBrowser', 'framework', 'runtimeCompatibility', 'promotionState', 'recoveryArtifactPath']) {
    requireString(model[field], `model.${field}`);
  }

  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(model.version)) {
    throw new Error(`Invalid semantic version for ${model.id}: ${model.version}`);
  }
  if (!PROMOTION_STATES.includes(model.promotionState)) {
    throw new Error(`Invalid promotion state for ${model.id}: ${model.promotionState}`);
  }
  if (!Array.isArray(model.approvals)) throw new Error(`Missing model.approvals for ${model.id}`);
  if (!Array.isArray(model.provenance) || model.provenance.length === 0) {
    throw new Error(`Missing provenance for ${model.id}`);
  }
  for (const item of model.provenance) {
    requireString(item.type, 'provenance.type');
    requireString(item.reference, 'provenance.reference');
    requireString(item.recordedAt, 'provenance.recordedAt');
  }
  if (requireChecksums) {
    requireHex(model.sha256, 64, `SHA-256 checksum for ${model.id}`);
    requireHex(model.sha512, 128, `SHA-512 checksum for ${model.id}`);
  }
}

export function validateRegistry(manifest, options = {}) {
  requireString(manifest.registryId, 'registryId');
  requireString(manifest.schemaVersion, 'schemaVersion');
  if (!Array.isArray(manifest.models) || manifest.models.length === 0) {
    throw new Error('Manifest must contain a non-empty models array');
  }
  const aliases = new Set();
  const identities = new Set();
  for (const model of manifest.models) {
    validateModelRecord(model, options);
    const identity = `${model.id}@${model.version}`;
    if (identities.has(identity)) throw new Error(`Duplicate model identity: ${identity}`);
    identities.add(identity);
    const aliasKey = `${model.alias}@${model.version}`;
    if (aliases.has(aliasKey)) throw new Error(`Duplicate model alias/version: ${aliasKey}`);
    aliases.add(aliasKey);
  }
}

export function assertPromotionTransition(from, to) {
  const fromIndex = PROMOTION_STATES.indexOf(from);
  const toIndex = PROMOTION_STATES.indexOf(to);
  if (fromIndex < 0 || toIndex < 0 || toIndex !== fromIndex + 1) {
    throw new Error(`Invalid promotion transition: ${from} -> ${to}`);
  }
}
