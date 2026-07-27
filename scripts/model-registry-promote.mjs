#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { assertPromotionTransition, validateRegistry } from './model-registry-contract.mjs';

async function main() {
  const [manifestPath, alias, targetState, approver, reason] = process.argv.slice(2);
  if (!manifestPath || !alias || !targetState || !approver || !reason) {
    throw new Error('Usage: node scripts/model-registry-promote.mjs <manifest.json> <alias> <target-state> <approver> <reason>');
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.signature) throw new Error('Promotion requires an unsigned working manifest; re-sign after promotion');
  validateRegistry(manifest, { requireChecksums: false });
  const matches = manifest.models.filter((model) => model.alias === alias);
  if (matches.length !== 1) throw new Error(`Expected exactly one model for alias ${alias}`);
  const model = matches[0];
  assertPromotionTransition(model.promotionState, targetState);
  model.promotionState = targetState;
  model.approvals.push({ state: targetState, approver, reason, approvedAt: new Date().toISOString() });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  console.log(`Promoted ${model.alias}@${model.version} to ${targetState}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
