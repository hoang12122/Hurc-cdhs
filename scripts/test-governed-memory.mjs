#!/usr/bin/env node
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { GovernedMemoryStore, makeNamespace } from './governed-memory-store.mjs';
import { validateMemoryRecord } from './governed-memory-contract.mjs';

function expectReject(fn, expected) {
  try {
    const result = fn();
    if (result?.then) return result.then(() => { throw new Error(`Expected rejection: ${expected}`); }, (error) => {
      if (!String(error.message).includes(expected)) throw error;
    });
    throw new Error(`Expected rejection: ${expected}`);
  } catch (error) {
    if (!String(error.message).includes(expected)) throw error;
  }
}

const now = '2026-07-27T10:00:00.000Z';
const namespace = makeNamespace('user-1', 'engineer', 'railway-maintenance');
const otherNamespace = makeNamespace('user-2', 'engineer', 'railway-maintenance');

function record(overrides = {}) {
  return {
    id: 'memory-1',
    memoryClass: 'semantic',
    state: 'transient',
    namespace,
    provenance: {
      sourceType: 'document',
      sourceRef: 'DNF-001',
      sourceDigest: 'sha256:abc',
      origin: 'human-verified'
    },
    confidence: 0.95,
    schemaVersion: '1.0.0',
    version: 1,
    createdAt: now,
    updatedAt: now,
    retention: { class: 'operational-record' },
    content: { statement: 'Verified railway maintenance fact' },
    audit: [],
    ...overrides
  };
}

validateMemoryRecord(record());
expectReject(() => validateMemoryRecord(record({ provenance: {} })), 'provenance.sourceType is required');
expectReject(() => validateMemoryRecord(record({ memoryClass: 'unknown' })), 'invalid memory class');
expectReject(() => validateMemoryRecord(record({ namespace: { ...namespace, key: 'bad' } })), 'namespace key mismatch');
expectReject(() => validateMemoryRecord(record({
  memoryClass: 'preference',
  content: { apiKey: 'secret-value' }
})), 'secret-like value rejected');
expectReject(() => validateMemoryRecord(record({
  state: 'active',
  provenance: { sourceType: 'ai', sourceRef: 'model-output', origin: 'ai' },
  approval: { approverId: 'human-1', approvedAt: now }
})), 'AI-originated record cannot become active directly');

const dir = await mkdtemp(path.join(tmpdir(), 'hurc-governed-memory-'));
const auditPath = path.join(dir, 'audit.ndjson');
const store = new GovernedMemoryStore([], { auditPath });
await store.create(record(), 'human-1');
expectReject(() => Promise.resolve(store.retrieve('memory-1', otherNamespace)), 'cross-namespace retrieval denied');

await store.transition('memory-1', 'proposed', 'human-1', 'Propose verified fact', '2026-07-27T10:01:00.000Z');
await store.transition('memory-1', 'reviewed', 'reviewer-1', 'Reviewed provenance', '2026-07-27T10:02:00.000Z');
await store.transition('memory-1', 'approved', 'approver-1', 'Approved for durable use', '2026-07-27T10:03:00.000Z');
await store.transition('memory-1', 'active', 'operator-1', 'Activate approved memory', '2026-07-27T10:04:00.000Z');
const active = store.retrieve('memory-1', namespace, [], new Date('2026-07-27T10:05:00.000Z'));
if (active.state !== 'active' || active.approval.approverId !== 'approver-1') throw new Error('approval workflow failed');

const replacement = record({
  id: 'memory-2',
  version: 1,
  createdAt: '2026-07-27T10:06:00.000Z',
  updatedAt: '2026-07-27T10:06:00.000Z',
  content: { statement: 'Updated verified railway maintenance fact' }
});
const supersession = await store.supersede('memory-1', replacement, 'approver-1', 'New verified source', '2026-07-27T10:06:00.000Z');
if (supersession.superseded.supersededBy !== 'memory-2') throw new Error('supersession pointer missing');

const expiring = record({
  id: 'memory-expiring',
  retention: { expiresAt: '2026-07-27T10:10:00.000Z' },
  createdAt: '2026-07-27T10:07:00.000Z',
  updatedAt: '2026-07-27T10:07:00.000Z'
});
await store.create(expiring, 'human-1');
const expiryEvidence = await store.expire(new Date('2026-07-27T10:11:00.000Z'));
if (!expiryEvidence.some((item) => item.recordId === 'memory-expiring')) throw new Error('TTL expiry evidence missing');

expectReject(
  () => store.forget('memory-2', 'operator-1', 'Unauthorized hard delete', { hardDelete: true }),
  'hard delete requires retention authorization'
);
const deleteEvidence = await store.forget('memory-2', 'operator-1', 'User-authorized forgetting');
if (!deleteEvidence.evidenceDigest) throw new Error('forget audit evidence missing digest');

const audit = await readFile(auditPath, 'utf8');
for (const action of ['create', 'transition', 'supersede', 'soft-delete']) {
  if (!audit.includes(`\"action\":\"${action}\"`)) throw new Error(`audit missing ${action}`);
}

console.log('Governed memory proof passed: schema, namespace isolation, provenance, approval, TTL, supersession, secret rejection and controlled forgetting');
