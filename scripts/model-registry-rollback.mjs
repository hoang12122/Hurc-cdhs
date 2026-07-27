#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { validateRegistry } from './model-registry-contract.mjs';

async function main() {
  const [manifestPath, alias, operator, reason, evidenceDir = 'artifacts/model-registry-rollback'] = process.argv.slice(2);
  if (!manifestPath || !alias || !operator || !reason) {
    throw new Error('Usage: node scripts/model-registry-rollback.mjs <manifest.json> <alias> <operator> <reason> [evidence-dir]');
  }

  const raw = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);
  validateRegistry(manifest);
  const candidates = manifest.models
    .filter((model) => model.alias === alias && model.promotionState === 'recovery-ready')
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
  if (candidates.length === 0) throw new Error(`No recovery-ready model available for alias ${alias}`);
  const selected = candidates[0];
  const evidence = {
    schemaVersion: '1.0.0',
    action: 'model-rollback',
    registryId: manifest.registryId,
    alias,
    selectedModelId: selected.id,
    selectedVersion: selected.version,
    artifactPath: selected.artifactPath,
    recoveryArtifactPath: selected.recoveryArtifactPath,
    sha256: selected.sha256,
    sha512: selected.sha512,
    manifestSha256: createHash('sha256').update(raw).digest('hex'),
    operator,
    reason,
    createdAt: new Date().toISOString(),
  };
  await mkdir(evidenceDir, { recursive: true });
  const filename = `${alias.replace(/[^a-zA-Z0-9._-]/g, '_')}-${Date.now()}.json`;
  const outputPath = path.join(evidenceDir, filename);
  await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, { mode: 0o600 });
  console.log(`Rollback evidence created -> ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
