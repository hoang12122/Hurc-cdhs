import { aiDb, IS_DATABASE_OFFLINE } from '../../prisma';
import { sha256, type GovernanceContext } from './control-plane';

export type GovernanceAuditPhase = 'request' | 'response' | 'error' | 'memory' | 'quarantine';

export interface PersistedGovernanceAuditInput {
  context: GovernanceContext;
  phase: GovernanceAuditPhase;
  decision: 'allow' | 'advisory-only' | 'quarantine' | 'block';
  summary: string;
  confidence?: number;
  error?: string;
}

interface AuditDetails {
  version: 1;
  requestId: string;
  phase: GovernanceAuditPhase;
  operation: string;
  agentId: string;
  domain: string;
  namespace: string;
  fingerprint: string;
  riskScore: number;
  riskLevel: string;
  decision: string;
  confidence?: number;
  summary: string;
  error?: string;
  previousHash: string;
  eventHash: string;
  timestamp: string;
}

function actorFromNamespace(namespace: string): string {
  const parts = namespace.split(':');
  return parts[parts.length - 1] || 'anonymous';
}

function parseDetails(value: string): Partial<AuditDetails> | null {
  try {
    return JSON.parse(value) as Partial<AuditDetails>;
  } catch {
    return null;
  }
}

/**
 * Persists governance evidence in PostgreSQL production using the existing
 * immutable AiSafetyLog model. Offline mode is handled by control-plane's
 * JSON hash-chain and therefore returns without a duplicate write.
 */
export async function persistProductionGovernanceAudit(input: PersistedGovernanceAuditInput): Promise<void> {
  if (IS_DATABASE_OFFLINE) return;

  try {
    const previous = await aiDb.aiSafetyLog.findFirst({
      where: {
        action: {
          startsWith: 'AI_GOVERNANCE_',
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      select: {
        details: true,
      },
    });

    const previousHash = previous ? (parseDetails(previous.details)?.eventHash ?? 'GENESIS') : 'GENESIS';
    const timestamp = new Date().toISOString();
    const canonical = JSON.stringify({
      requestId: input.context.requestId,
      phase: input.phase,
      operation: input.context.operation,
      agentId: input.context.agent.id,
      domain: input.context.domain,
      namespace: input.context.namespace,
      fingerprint: input.context.fingerprint,
      riskScore: input.context.riskScore,
      riskLevel: input.context.riskLevel,
      decision: input.decision,
      confidence: input.confidence,
      summary: input.summary,
      error: input.error,
      previousHash,
      timestamp,
    });
    const details: AuditDetails = {
      version: 1,
      requestId: input.context.requestId,
      phase: input.phase,
      operation: input.context.operation,
      agentId: input.context.agent.id,
      domain: input.context.domain,
      namespace: input.context.namespace,
      fingerprint: input.context.fingerprint,
      riskScore: input.context.riskScore,
      riskLevel: input.context.riskLevel,
      decision: input.decision,
      confidence: input.confidence,
      summary: input.summary.slice(0, 1_000),
      error: input.error?.slice(0, 1_000),
      previousHash,
      eventHash: sha256(canonical),
      timestamp,
    };

    await aiDb.aiSafetyLog.create({
      data: {
        eventId: input.context.requestId,
        userId: actorFromNamespace(input.context.namespace),
        targetType: 'AI_GOVERNANCE',
        targetId: input.context.agent.id,
        action: `AI_GOVERNANCE_${input.phase.toUpperCase()}`,
        riskLevel: input.context.riskLevel.toUpperCase(),
        details: JSON.stringify(details),
        isImmutable: true,
      },
    });
  } catch (error) {
    console.warn('[AI GOVERNANCE AUDIT] PostgreSQL persistence unavailable:', error instanceof Error ? error.message : error);
  }
}
