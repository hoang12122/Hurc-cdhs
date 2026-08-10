#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  assertNamespaceAccess,
  isExpired,
  namespaceKey,
  transitionRecord,
  validateMemoryRecord
} from './governed-memory-contract.mjs';

function digest(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export class GovernedMemoryStore {
  constructor(records = [], { auditPath = null } = {}) {
    this.records = new Map();
    this.auditPath = auditPath;
    for (const record of records) {
      validateMemoryRecord(record);
      this.records.set(record.id, structuredClone(record));
    }
  }

  async audit(event) {
    const envelope = { ...event, evidenceDigest: digest(event) };
    if (this.auditPath) {
      await mkdir(path.dirname(this.auditPath), { recursive: true });
      await appendFile(this.auditPath, `${JSON.stringify(envelope)}\n`, { mode: 0o600 });
    }
    return envelope;
  }

  async create(record, actorId) {
    validateMemoryRecord(record);
    if (this.records.has(record.id)) throw new Error('record already exists');
    if (record.state !== 'transient') throw new Error('new durable memory must begin as transient');
    this.records.set(record.id, structuredClone(record));
    await this.audit({ action: 'create', recordId: record.id, namespaceKey: record.namespace.key, actorId, timestamp: record.createdAt });
    return structuredClone(record);
  }

  retrieve(id, actorNamespace, grants = [], now = new Date()) {
    const record = this.records.get(id);
    if (!record || record.state === 'deleted') throw new Error('record not found');
    assertNamespaceAccess(record, actorNamespace, grants);
    if (isExpired(record, now)) throw new Error('record expired');
    return structuredClone(record);
  }

  async transition(id, nextState, actorId, reason, timestamp = new Date().toISOString()) {
    const record = this.records.get(id);
    if (!record) throw new Error('record not found');
    const updated = transitionRecord(record, nextState, actorId, reason, timestamp);
    if (nextState === 'approved') {
      updated.approval = { approverId: actorId, approvedAt: timestamp, reason };
    }
    if (nextState === 'active' && record.provenance.origin === 'ai' && !record.approval?.approverId) {
      throw new Error('AI-originated record requires human approval before activation');
    }
    validateMemoryRecord(updated, { now: new Date(timestamp) });
    this.records.set(id, updated);
    await this.audit({ action: 'transition', recordId: id, from: record.state, to: nextState, actorId, reason, timestamp });
    return structuredClone(updated);
  }

  async supersede(id, replacement, actorId, reason, timestamp = new Date().toISOString()) {
    const current = this.records.get(id);
    if (!current || current.state !== 'active') throw new Error('only active memory may be superseded');
    validateMemoryRecord(replacement, { now: new Date(timestamp) });
    if (replacement.state !== 'transient') throw new Error('replacement must begin as transient');
    if (replacement.namespace.key !== current.namespace.key) throw new Error('supersession namespace mismatch');
    this.records.set(replacement.id, structuredClone(replacement));
    const superseded = structuredClone(current);
    superseded.state = 'superseded';
    superseded.supersededBy = replacement.id;
    superseded.version += 1;
    superseded.updatedAt = timestamp;
    superseded.audit = [...(superseded.audit ?? []), { action: 'supersede', actorId, reason, replacementId: replacement.id, timestamp }];
    validateMemoryRecord(superseded, { now: new Date(timestamp) });
    this.records.set(id, superseded);
    await this.audit({ action: 'supersede', recordId: id, replacementId: replacement.id, actorId, reason, timestamp });
    return { superseded: structuredClone(superseded), replacement: structuredClone(replacement) };
  }

  async forget(id, actorId, reason, { hardDelete = false, retentionAuthorized = false, timestamp = new Date().toISOString() } = {}) {
    const record = this.records.get(id);
    if (!record) throw new Error('record not found');
    if (!actorId || !reason) throw new Error('forget requires actor and reason');
    if (hardDelete && !retentionAuthorized) throw new Error('hard delete requires retention authorization');

    const evidence = await this.audit({
      action: hardDelete ? 'hard-delete' : 'soft-delete',
      recordId: id,
      recordDigest: digest(record),
      namespaceKey: record.namespace.key,
      actorId,
      reason,
      timestamp,
      retentionAuthorized
    });

    if (hardDelete) {
      this.records.delete(id);
      return evidence;
    }
    const deleted = structuredClone(record);
    deleted.state = 'deleted';
    deleted.deletedAt = timestamp;
    deleted.version += 1;
    deleted.updatedAt = timestamp;
    deleted.content = { tombstone: true };
    deleted.audit = [...(deleted.audit ?? []), evidence];
    this.records.set(id, deleted);
    return evidence;
  }

  async expire(now = new Date(), actorId = 'system:ttl') {
    const evidence = [];
    for (const record of this.records.values()) {
      if (record.state !== 'deleted' && isExpired(record, now)) {
        evidence.push(await this.forget(record.id, actorId, 'TTL expired', { timestamp: now.toISOString() }));
      }
    }
    return evidence;
  }

  async exportSnapshot(filePath) {
    const records = [...this.records.values()].sort((a, b) => a.id.localeCompare(b.id));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify({ schemaVersion: '1.0.0', records }, null, 2)}\n`, { mode: 0o600 });
  }

  static async fromSnapshot(filePath, options = {}) {
    const parsed = JSON.parse(await readFile(filePath, 'utf8'));
    return new GovernedMemoryStore(parsed.records ?? [], options);
  }
}

export function makeNamespace(userId, roleId, domain) {
  const namespace = { userId, roleId, domain };
  return { ...namespace, key: namespaceKey(namespace) };
}
