#!/usr/bin/env node
import { createHash, createPrivateKey, sign } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stableStringify, validateRegistry } from './model-registry-contract.mjs';

async function fileDigest(filePath, algorithm) {
  const data = await readFile(filePath);
  return createHash(algorithm).update(data).digest('hex');
}

async function main() {
  const [manifestPath, privateKeyPath, outputPath = manifestPath] = process.argv.slice(2);
  if (!manifestPath || !privateKeyPath) {
    throw new Error('Usage: node scripts/model-registry-sign.mjs <manifest.json> <private-key.pem> [output.json]');
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  validateRegistry(manifest, { requireChecksums: false });

  const baseDir = path.dirname(path.resolve(manifestPath));
  for (const model of manifest.models) {
    const artifact = path.resolve(baseDir, model.artifactPath);
    model.sha256 = await fileDigest(artifact, 'sha256');
    model.sha512 = await fileDigest(artifact, 'sha512');
    model.checksumAlgorithms = ['SHA-256', 'SHA-512'];
  }

  manifest.schemaVersion = '2.0.0';
  manifest.generatedAt = new Date().toISOString();
  delete manifest.signature;
  validateRegistry(manifest);
  const payload = stableStringify(manifest);
  const privateKey = createPrivateKey(await readFile(privateKeyPath));
  const signature = sign(null, Buffer.from(payload), privateKey).toString('base64');
  manifest.signature = { algorithm: 'Ed25519', value: signature };
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  console.log(`Signed ${manifest.models.length} model record(s) with SHA-256/SHA-512 -> ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
