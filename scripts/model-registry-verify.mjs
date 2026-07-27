#!/usr/bin/env node
import { createHash, createPublicKey, verify } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LOADABLE_STATES, stableStringify, validateRegistry } from './model-registry-contract.mjs';

async function fileDigest(filePath, algorithm) {
  const data = await readFile(filePath);
  return createHash(algorithm).update(data).digest('hex');
}

async function main() {
  const [manifestPath, publicKeyPath, requestedAlias] = process.argv.slice(2);
  if (!manifestPath || !publicKeyPath) {
    throw new Error('Usage: node scripts/model-registry-verify.mjs <manifest.json> <public-key.pem> [alias]');
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const signature = manifest.signature;
  if (signature?.algorithm !== 'Ed25519' || typeof signature.value !== 'string') {
    throw new Error('Manifest is missing a valid Ed25519 signature');
  }

  const unsigned = structuredClone(manifest);
  delete unsigned.signature;
  validateRegistry(unsigned);
  const payload = stableStringify(unsigned);
  const publicKey = createPublicKey(await readFile(publicKeyPath));
  const validSignature = verify(null, Buffer.from(payload), publicKey, Buffer.from(signature.value, 'base64'));
  if (!validSignature) throw new Error('Manifest signature verification failed');

  const selected = requestedAlias
    ? manifest.models.filter((model) => model.alias === requestedAlias)
    : manifest.models;
  if (requestedAlias && selected.length === 0) throw new Error(`Unknown model alias: ${requestedAlias}`);

  const baseDir = path.dirname(path.resolve(manifestPath));
  for (const model of selected) {
    if (!LOADABLE_STATES.has(model.promotionState)) {
      throw new Error(`Model is not loadable: ${model.alias}@${model.version} state=${model.promotionState}`);
    }
    const artifact = path.resolve(baseDir, model.artifactPath);
    const actual256 = await fileDigest(artifact, 'sha256');
    const actual512 = await fileDigest(artifact, 'sha512');
    if (actual256 !== model.sha256) throw new Error(`SHA-256 mismatch for ${model.id}@${model.version}`);
    if (actual512 !== model.sha512) throw new Error(`SHA-512 mismatch for ${model.id}@${model.version}`);
  }

  console.log(`Verified signature, provenance and dual checksums for ${selected.length} loadable model record(s)`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
