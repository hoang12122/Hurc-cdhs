import { AI_GOVERNANCE_CONFIG } from '../../../config/ai-governance-profile';
import { jsonDb } from '../../../db/json-db';
import type { GovernedDataEnvelope } from './types';

export function partitionGovernedContext<T extends Record<string, unknown>>(
  envelopes: GovernedDataEnvelope<T>[],
  maxChars = AI_GOVERNANCE_CONFIG.data.contextMaxChars,
): string {
  const eligible = envelopes
    .filter(item => item.decision === 'accept' || item.decision === 'review')
    .sort((a, b) => b.trustScore - a.trustScore
      || b.qualityScore - a.qualityScore
      || a.entityId.localeCompare(b.entityId));

  const partitions = new Map<string, string[]>();
  for (const envelope of eligible) {
    const key = `${envelope.namespace}|${envelope.domain}`;
    const list = partitions.get(key) ?? [];
    list.push(JSON.stringify({
      entityType: envelope.entityType,
      entityId: envelope.entityId,
      version: envelope.version,
      provenance: envelope.provenance,
      trustScore: envelope.trustScore,
      qualityScore: envelope.qualityScore,
      data: envelope.data,
    }));
    partitions.set(key, list);
  }

  let output = '';
  for (const [partition, records] of partitions) {
    const block = `\n[DATA PARTITION: ${partition}]\n${records.join('\n')}\n`;
    if (output.length + block.length > maxChars) break;
    output += block;
  }
  return output.trim();
}

export async function quarantineDataCandidate<T extends Record<string, unknown>>(
  envelope: GovernedDataEnvelope<T>,
  reason?: string,
): Promise<void> {
  try {
    await jsonDb.insertRecord('ai_data_quarantine', {
      id: `dataq-${envelope.fingerprint.slice(0, 24)}`,
      ...envelope,
      decision: 'quarantine',
      quarantineReason: reason ?? envelope.issues.join('; '),
      quarantinedAt: new Date().toISOString(),
      assuranceProfile: AI_GOVERNANCE_CONFIG.assuranceProfile,
    });
  } catch (error) {
    console.warn(
      '[AI DATA GOVERNANCE] Quarantine persistence unavailable:',
      error instanceof Error ? error.message : error,
    );
  }
}
