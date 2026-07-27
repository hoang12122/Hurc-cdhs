#!/usr/bin/env node
import { createHash, createPrivateKey, sign } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
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
  const [manifestPath, privateKeyPath, outputPath = manifestPath] = process.argv.slice(2);
  if (!manifestPath || !privateKeyPath) {
    throw new Error('Usage: node scripts/model-registry-sign.mjs <manifest.json> <private-key.pem> [output.json]');
  }

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (!Array.isArray(manifest.models) || manifest.models.length === 0) {
    throw new Error('Manifest must contain a non-empty models array');
  }

  const baseDir = path.dirname(path.resolve(manifestPath));
  for (const model of manifest.models) {
    if (!model.id || !model.version || !model.artifactPath) {
      throw new Error('Each model requires id, version and artifactPath');
    }
    const artifact = path.resolve(baseDir, model.artifactPath);
    model.sha256 = await sha256File(artifact);
    model.algorithm = 'SHA-256';
  }

  manifest.schemaVersion = manifest.schemaVersion || '1.0.0';
  manifest.generatedAt = new Date().toISOString();
  delete manifest.signature;
  const payload = stableStringify(manifest);
  const privateKey = createPrivateKey(await readFile(privateKeyPath));
  const signature = sign(null, Buffer.from(payload), privateKey).toString('base64');
  manifest.signature = { algorithm: 'Ed25519', value: signature };
  await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  console.log(`Signed ${manifest.models.length} model record(s) -> ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
