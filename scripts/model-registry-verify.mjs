#!/usr/bin/env node
import { createHash, createPublicKey, verify } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function sha256File(filePath) {
  const data = await readFile(filePath);
  return createHash('sha256').update(data).digest('hex');
}

async function main() {
  const [manifestPath, publicKeyPath] = process.argv.slice(2);
  if (!manifestPath || !publicKeyPath) {
    throw new Error('Usage: node scripts/model-registry-verify.mjs <manifest.json> <public-key.pem>');
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const signature = manifest.signature;
  if (signature?.algorithm !== 'Ed25519' || typeof signature.value !== 'string') {
    throw new Error('Manifest is missing a valid Ed25519 signature');
  }
  if (!Array.isArray(manifest.models) || manifest.models.length === 0) {
    throw new Error('Manifest must contain a non-empty models array');
  }

  const unsigned = structuredClone(manifest);
  delete unsigned.signature;
  const payload = stableStringify(unsigned);
  const publicKey = createPublicKey(await readFile(publicKeyPath));
  const validSignature = verify(null, Buffer.from(payload), publicKey, Buffer.from(signature.value, 'base64'));
  if (!validSignature) throw new Error('Manifest signature verification failed');

  const baseDir = path.dirname(path.resolve(manifestPath));
  for (const model of manifest.models) {
    if (!model.id || !model.version || !model.artifactPath || !/^[a-f0-9]{64}$/.test(model.sha256 || '')) {
      throw new Error('Each model requires id, version, artifactPath and SHA-256 checksum');
    }
    if (!['candidate', 'approved', 'deprecated', 'revoked'].includes(model.status)) {
      throw new Error(`Invalid model status for ${model.id}: ${model.status}`);
    }
    const actual = await sha256File(path.resolve(baseDir, model.artifactPath));
    if (actual !== model.sha256) throw new Error(`Checksum mismatch for ${model.id}@${model.version}`);
  }

  console.log(`Verified registry signature and ${manifest.models.length} artifact checksum(s)`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
