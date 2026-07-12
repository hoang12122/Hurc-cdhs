'use server';

import { requireAuth, requirePermission } from '@/lib/auth-enforcer';
import { aiDb, IS_DATABASE_OFFLINE } from '@/lib/prisma';
import { jsonDb } from '@/lib/db/json-db';
import { getRegisteredAiAgents } from '@/lib/services/ai/control-plane';
import { getAiRuntimeGuardStatus } from '@/lib/services/ai/runtime-guard';
import {
  getMemoryHealth,
  reviewMemory,
  type AgentMemory,
} from '@/lib/services/agent-memory';
import {
  assessDataCandidate,
  type DataAssessmentOptions,
} from '@/lib/services/ai/data-governance';

async function getAuditSummary() {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const [total, critical, blocked] = await Promise.all([
        aiDb.aiSafetyLog.count({
          where: { action: { startsWith: 'AI_GOVERNANCE_' } },
        }),
        aiDb.aiSafetyLog.count({
          where: {
            action: { startsWith: 'AI_GOVERNANCE_' },
            riskLevel: 'CRITICAL',
          },
        }),
        aiDb.aiSafetyLog.count({
          where: {
            action: { startsWith: 'AI_GOVERNANCE_' },
            details: { contains: '"decision":"block"' },
          },
        }),
      ]);
      return {
        store: 'postgres-ai-safety-log',
        total,
        critical,
        blocked,
      };
    } catch (error) {
      return {
        store: 'postgres-ai-safety-log',
        total: 0,
        critical: 0,
        blocked: 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  try {
    const events = await jsonDb.getCollection<any>('ai_governance_audit');
    return {
      store: 'json-hash-chain',
      total: events.length,
      critical: events.filter(event => event.riskLevel === 'critical').length,
      blocked: events.filter(event => event.decision === 'block').length,
    };
  } catch (error) {
    return {
      store: 'json-hash-chain',
      total: 0,
      critical: 0,
      blocked: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getAiGovernanceDashboard() {
  await requireAuth();

  const [memory, audit] = await Promise.all([
    getMemoryHealth().catch(error => ({
      active: 0,
      verified: 0,
      provisional: 0,
      quarantined: 0,
      expired: 0,
      duplicateReinforcements: 0,
      error: error instanceof Error ? error.message : String(error),
    })),
    getAuditSummary(),
  ]);

  return {
    enabled: true,
    mode: 'advisory-only',
    writeAccess: false,
    agents: getRegisteredAiAgents(),
    runtime: getAiRuntimeGuardStatus(),
    memory,
    audit,
    protections: [
      'deterministic-agent-routing',
      'domain-and-user-namespaces',
      'prompt-injection-screening',
      'secret-redaction',
      'single-flight-deduplication',
      'per-namespace-concurrency-limit',
      'circuit-breaker-and-timeout',
      'memory-confidence-and-ttl',
      'memory-quarantine',
      'data-provenance-and-versioning',
      'safety-field-conflict-blocking',
      'human-approval-for-state-change',
      'immutable-audit-chain',
    ],
  };
}

export async function getAiMemoryQuarantine(limit = 100) {
  await requirePermission('admin:system');
  if (!IS_DATABASE_OFFLINE) {
    return {
      records: [] as AgentMemory[],
      note: 'Memory quarantine currently uses the offline governance store; PostgreSQL persistence requires a dedicated schema migration.',
    };
  }
  const records = await jsonDb.getCollection<AgentMemory>('ai_memory_quarantine');
  return {
    records: [...records].reverse().slice(0, Math.max(1, Math.min(limit, 500))),
  };
}

export async function reviewAiMemory(
  memoryId: string,
  decision: 'approve' | 'quarantine' | 'supersede',
) {
  await requirePermission('admin:system');
  return reviewMemory(memoryId, decision);
}

export async function assessAiDataCandidate(
  data: Record<string, unknown>,
  options: DataAssessmentOptions = {},
) {
  await requirePermission('admin:system');
  return assessDataCandidate(data, options);
}
