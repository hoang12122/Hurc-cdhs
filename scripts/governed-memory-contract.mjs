#!/usr/bin/env node
import { createHash } from 'node:crypto';

export const MEMORY_CLASSES = Object.freeze(['episodic', 'semantic', 'decision', 'task', 'preference']);
export const LIFECYCLE = Object.freeze(['transient', 'proposed', 'reviewed', 'approved', 'active', 'superseded', 'deleted']);
export const NEXT_STATE = Object.freeze({
  transient: 'proposed',
  proposed: 'reviewed',
  reviewed: 'approved',
  approved: 'active',
  active: 'superseded',
  superseded: 'deleted'
});

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\b(?:api[_-]?key|secret|password|passwd|token)\b\s*[:=]\s*[^\s]+/i,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/
];

function requireString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${field} is required`);
  return value.trim();
}

function requireIso(value, field) {
  requireString(value, field);
  if (Number.isNaN(Date.parse(value))) throw new Error(`${field} must be ISO-8601`);
}

export function namespaceKey(namespace) {
  const userId = requireString(namespace?.userId, 'namespace.userId');
  const roleId = requireString(namespace?.roleId, 'namespace.roleId');
  const domain = requireString(namespace?.domain, 'namespace.domain');
  return createHash('sha256').update(`${userId}\u0000${roleId}\u0000${domain}`).digest('hex');
}

export function assertNamespaceAccess(record, actor, grants = []) {
  const expected = namespaceKey(record.namespace);
  if (record.namespace.key !== expected) throw new Error('namespace key mismatch');
  const actorKey = namespaceKey(actor);
  if (actorKey === expected) return true;
  const allowed = grants.some((grant) => grant?.from === actorKey && grant?.to === expected && grant?.action === 'retrieve');
  if (!allowed) throw new Error('cross-namespace retrieval denied');
  return true;
}

export function assertNoPreferenceSecret(record) {
  if (record.memoryClass !== 'preference') return;
  const serialized = JSON.stringify(record.content ?? {});
  if (SECRET_PATTERNS.some((pattern) => pattern.test(serialized))) {
    throw new Error('secret-like value rejected from preference memory');
  }
}

export function validateMemoryRecord(record, { now = new Date() } = {}) {
  requireString(record?.id, 'id');
  if (!MEMORY_CLASSES.includes(record.memoryClass)) throw new Error(`invalid memory class: ${record.memoryClass}`);
  if (!LIFECYCLE.includes(record.state)) throw new Error(`invalid lifecycle state: ${record.state}`);
  const key = namespaceKey(record.namespace);
  if (record.namespace.key !== key) throw new Error('namespace key mismatch');

  requireString(record.provenance?.sourceType, 'provenance.sourceType');
  requireString(record.provenance?.sourceRef, 'provenance.sourceRef');
  if (record.provenance?.origin === 'ai' && record.state === 'active') {
    throw new Error('AI-originated record cannot become active directly');
  }
  if (typeof record.confidence !== 'number' || record.confidence < 0 || record.confidence > 1) {
    throw new Error('confidence must be between 0 and 1');
  }
  if (!Number.isInteger(record.version) || record.version < 1) throw new Error('version must be a positive integer');
  requireString(record.schemaVersion, 'schemaVersion');
  requireIso(record.createdAt, 'createdAt');
  requireIso(record.updatedAt, 'updatedAt');

  if (!record.retention?.class && !record.retention?.expiresAt) {
    throw new Error('retention.class or retention.expiresAt is required');
  }
  if (record.retention?.expiresAt) requireIso(record.retention.expiresAt, 'retention.expiresAt');
  if (record.state === 'superseded' && !record.supersededBy) throw new Error('supersededBy is required');
  if (['approved', 'active', 'superseded'].includes(record.state)) {
    requireString(record.approval?.approverId, 'approval.approverId');
    requireIso(record.approval?.approvedAt, 'approval.approvedAt');
  }
  if (record.deletedAt) requireIso(record.deletedAt, 'deletedAt');
  if (record.hardDeleted === true && record.retention?.hardDeleteAuthorized !== true) {
    throw new Error('hard delete requires retention authorization');
  }
  if (record.retention?.expiresAt && Date.parse(record.retention.expiresAt) <= now.getTime() && record.state === 'active') {
    throw new Error('expired record cannot remain active');
  }
  assertNoPreferenceSecret(record);
  return true;
}

export function transitionRecord(record, nextState, actorId, reason, timestamp = new Date().toISOString()) {
  validateMemoryRecord(record, { now: new Date(timestamp) });
  if (NEXT_STATE[record.state] !== nextState) throw new Error(`invalid transition ${record.state} -> ${nextState}`);
  requireString(actorId, 'actorId');
  requireString(reason, 'reason');
  const updated = structuredClone(record);
  updated.state = nextState;
  updated.version += 1;
  updated.updatedAt = timestamp;
  updated.audit = [...(updated.audit ?? []), { action: 'transition', from: record.state, to: nextState, actorId, reason, timestamp }];
  return updated;
}

export function isExpired(record, now = new Date()) {
  return Boolean(record.retention?.expiresAt && Date.parse(record.retention.expiresAt) <= now.getTime());
}
