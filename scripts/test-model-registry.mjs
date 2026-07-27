#!/usr/bin/env node
import { generateKeyPairSync } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function runSuccess(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  if (result.error) {
    throw new Error(`${script} failed to start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${script} exited ${result.status}; stdout=${result.stdout}; stderr=${result.stderr}`);
  }
  return result;
}

function runExpectedRejection(script, args, expectedMessage) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  if (result.error) {
    throw new Error(`${script} failed to start during rejection proof: ${result.error.message}`);
  }
  if (result.status === 0) {
    throw new Error(`${script} unexpectedly accepted a tampered artifact; stdout=${result.stdout}; stderr=${result.stderr}`);
  }

  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (!output.includes(expectedMessage)) {
    throw new Error(`${script} rejected for an unexpected reason; expected=${expectedMessage}; status=${result.status}; output=${output}`);
  }
  return result;
}

const dir = await mkdtemp(path.join(tmpdir(), 'hurc-model-registry-'));
const artifact = path.join(dir, 'model.bin');
const manifest = path.join(dir, 'registry.json');
const privateKeyPath = path.join(dir, 'private.pem');
const publicKeyPath = path.join(dir, 'public.pem');

await writeFile(artifact, 'deterministic-local-model-artifact\n');
await writeFile(manifest, JSON.stringify({
  schemaVersion: '1.0.0',
  registryId: 'hurc-local-model-registry',
  models: [{
    id: 'demo-anomaly-model',
    version: '1.0.0',
    artifactPath: './model.bin',
    status: 'candidate',
    framework: 'test',
    trainingRunId: 'ci-proof'
  }]
}, null, 2));

const { privateKey, publicKey } = generateKeyPairSync('ed25519');
await writeFile(privateKeyPath, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
await writeFile(publicKeyPath, publicKey.export({ type: 'spki', format: 'pem' }));

runSuccess('scripts/model-registry-sign.mjs', [manifest, privateKeyPath]);
runSuccess('scripts/model-registry-verify.mjs', [manifest, publicKeyPath]);

const signed = JSON.parse(await readFile(manifest, 'utf8'));
if (signed.signature?.algorithm !== 'Ed25519') throw new Error('Expected Ed25519 signature');
if (!/^[a-f0-9]{64}$/.test(signed.models[0].sha256)) throw new Error('Expected SHA-256 checksum');

await writeFile(artifact, 'tampered-artifact\n');
runExpectedRejection(
  'scripts/model-registry-verify.mjs',
  [manifest, publicKeyPath],
  'Checksum mismatch for demo-anomaly-model@1.0.0'
);

console.log('Signed model registry proof passed, including explicit checksum tamper rejection');
