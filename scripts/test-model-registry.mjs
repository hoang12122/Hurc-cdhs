#!/usr/bin/env node
import { generateKeyPairSync } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function runSuccess(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  if (result.error) throw new Error(`${script} failed to start: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`${script} exited ${result.status}; stdout=${result.stdout}; stderr=${result.stderr}`);
  return result;
}

function runExpectedRejection(script, args, expectedMessage) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  if (result.error) throw new Error(`${script} failed to start: ${result.error.message}`);
  if (result.status === 0) throw new Error(`${script} unexpectedly accepted invalid input`);
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (!output.includes(expectedMessage)) throw new Error(`${script} rejected for unexpected reason; expected=${expectedMessage}; output=${output}`);
}

const dir = await mkdtemp(path.join(tmpdir(), 'hurc-model-registry-'));
const artifact = path.join(dir, 'model.bin');
const manifest = path.join(dir, 'registry.json');
const privateKeyPath = path.join(dir, 'private.pem');
const publicKeyPath = path.join(dir, 'public.pem');
const sbomPath = path.join(dir, 'sbom.cdx.json');

await writeFile(artifact, 'deterministic-local-model-artifact\n');
const baseModel = {
  id: 'demo-anomaly-model',
  alias: 'anomaly-primary',
  version: '1.0.0',
  artifactPath: './model.bin',
  recoveryArtifactPath: './model.bin',
  license: 'Apache-2.0',
  licenseEvidence: 'licenses/Apache-2.0.txt',
  sourceUri: 'internal://model-source/demo-anomaly-model/1.0.0',
  sourceBrowser: 'internal://source-browser/demo-anomaly-model/1.0.0',
  framework: 'test',
  runtimeCompatibility: 'node-test-runtime',
  trainingRunId: 'ci-proof',
  promotionState: 'recovery-ready',
  approvals: [
    { state: 'standardized', approver: 'ci', reason: 'fixture', approvedAt: '2026-01-01T00:00:00.000Z' },
    { state: 'security-reviewed', approver: 'security', reason: 'fixture', approvedAt: '2026-01-01T00:01:00.000Z' },
    { state: 'approved', approver: 'owner', reason: 'fixture', approvedAt: '2026-01-01T00:02:00.000Z' },
    { state: 'recovery-ready', approver: 'ops', reason: 'fixture', approvedAt: '2026-01-01T00:03:00.000Z' },
  ],
  provenance: [{ type: 'training-run', reference: 'ci-proof', recordedAt: '2026-01-01T00:00:00.000Z' }],
};
await writeFile(manifest, JSON.stringify({ schemaVersion: '2.0.0', registryId: 'hurc-local-model-registry', models: [baseModel] }, null, 2));
await writeFile(sbomPath, JSON.stringify({ bomFormat: 'CycloneDX', specVersion: '1.6', version: 1, components: [{ type: 'library', name: 'local-model-runtime', version: '1.0.0' }] }, null, 2));

const { privateKey, publicKey } = generateKeyPairSync('ed25519');
await writeFile(privateKeyPath, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
await writeFile(publicKeyPath, publicKey.export({ type: 'spki', format: 'pem' }));

runSuccess('scripts/model-registry-sign.mjs', [manifest, privateKeyPath]);
runSuccess('scripts/model-registry-verify.mjs', [manifest, publicKeyPath, 'anomaly-primary']);
runSuccess('scripts/check-model-sbom.mjs', [sbomPath]);

const signed = JSON.parse(await readFile(manifest, 'utf8'));
if (!/^[a-f0-9]{64}$/.test(signed.models[0].sha256)) throw new Error('Expected SHA-256 checksum');
if (!/^[a-f0-9]{128}$/.test(signed.models[0].sha512)) throw new Error('Expected SHA-512 checksum');

await writeFile(artifact, 'tampered-artifact\n');
runExpectedRejection('scripts/model-registry-verify.mjs', [manifest, publicKeyPath], 'SHA-256 mismatch');
await writeFile(artifact, 'deterministic-local-model-artifact\n');

const tamperedManifest = JSON.parse(await readFile(manifest, 'utf8'));
tamperedManifest.models[0].license = 'Unknown';
await writeFile(manifest, JSON.stringify(tamperedManifest, null, 2));
runExpectedRejection('scripts/model-registry-verify.mjs', [manifest, publicKeyPath], 'Manifest signature verification failed');

const unsignedMissingProvenance = { schemaVersion: '2.0.0', registryId: 'hurc-local-model-registry', models: [{ ...baseModel, provenance: [] }] };
await writeFile(manifest, JSON.stringify(unsignedMissingProvenance, null, 2));
runExpectedRejection('scripts/model-registry-sign.mjs', [manifest, privateKeyPath], 'Missing provenance');

const promotionManifest = { schemaVersion: '2.0.0', registryId: 'hurc-local-model-registry', models: [{ ...baseModel, promotionState: 'quarantine', approvals: [] }] };
await writeFile(manifest, JSON.stringify(promotionManifest, null, 2));
runExpectedRejection('scripts/model-registry-promote.mjs', [manifest, 'anomaly-primary', 'approved', 'ci', 'skip'], 'Invalid promotion transition');

promotionManifest.models[0].promotionState = 'standardized';
await writeFile(manifest, JSON.stringify(promotionManifest, null, 2));
runSuccess('scripts/model-registry-promote.mjs', [manifest, 'anomaly-primary', 'security-reviewed', 'security', 'review passed']);

const notLoadable = JSON.parse(await readFile(manifest, 'utf8'));
await writeFile(manifest, JSON.stringify(notLoadable, null, 2));
runSuccess('scripts/model-registry-sign.mjs', [manifest, privateKeyPath]);
runExpectedRejection('scripts/model-registry-verify.mjs', [manifest, publicKeyPath], 'Model is not loadable');

console.log('Phase 1 model supply-chain proof passed: schema, dual checksum, provenance, promotion, load rejection, SBOM and tamper controls');
