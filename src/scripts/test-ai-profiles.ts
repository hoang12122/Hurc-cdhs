import assert from 'node:assert/strict';
import { resolveAiGovernanceConfig } from '../lib/config/ai-governance-profile';

function main() {
  const standard = resolveAiGovernanceConfig({}, 'development');
  assert.equal(standard.runtimeProfile, 'STANDARD');
  assert.equal(standard.assuranceProfile, 'STANDARD');
  assert.equal(standard.runtime.timeoutMs, 120_000);
  assert.equal(standard.runtime.maxConcurrentPerNamespace, 3);
  assert.equal(standard.memory.retrievalMinConfidence, 0.65);
  assert.equal(standard.data.quarantineTrustBelow, 40);
  assert.equal(standard.agent.allowWrite, false);

  const lowCapacity = resolveAiGovernanceConfig({
    AI_RUNTIME_PROFILE: 'LOW',
    AI_ASSURANCE_PROFILE: 'STANDARD',
  }, 'development');
  assert.equal(lowCapacity.runtime.maxConcurrentPerNamespace, 1);
  assert.equal(lowCapacity.runtime.timeoutMs, 60_000);
  assert.equal(lowCapacity.vision.maxUploadBytes, 4 * 1024 * 1024);
  assert.equal(lowCapacity.agent.allowToolRead, false);

  const highAssurance = resolveAiGovernanceConfig({
    AI_RUNTIME_PROFILE: 'HIGH',
    AI_ASSURANCE_PROFILE: 'HIGH',
    AI_MEMORY_INCLUDE_PROVISIONAL: 'true',
    AI_MEMORY_MIN_CONFIDENCE: '0.1',
    AI_MEMORY_PROVISIONAL_THRESHOLD: '0.1',
    AI_DATA_QUARANTINE_TRUST_BELOW: '1',
    AI_DATA_REVIEW_QUALITY_BELOW: '1',
    AI_DATA_REVIEW_TRUST_BELOW: '1',
    AI_DATA_REVIEW_ISSUE_COUNT: '20',
    AI_AGENT_MEMORY_CANDIDATES_ENABLED: 'true',
  }, 'production');
  assert.equal(highAssurance.runtime.maxConcurrentPerNamespace, 6);
  assert.equal(highAssurance.memory.includeProvisional, false);
  assert.equal(highAssurance.memory.retrievalMinConfidence, 0.8);
  assert.equal(highAssurance.memory.provisionalThreshold, 0.8);
  assert.equal(highAssurance.data.quarantineTrustBelow, 55);
  assert.equal(highAssurance.data.reviewQualityBelow, 75);
  assert.equal(highAssurance.data.reviewTrustBelow, 80);
  assert.equal(highAssurance.data.reviewIssueCount, 2);
  assert.equal(highAssurance.agent.allowAiMemoryCandidates, false);
  assert.equal(highAssurance.agent.allowWrite, false);

  const clamped = resolveAiGovernanceConfig({
    AI_EXECUTION_TIMEOUT_MS: '999999',
    AI_MAX_CONCURRENT_PER_NAMESPACE: '99',
    AI_MEMORY_RETRIEVAL_LIMIT: '99',
    AI_DATA_CONTEXT_MAX_CHARS: '999999',
  }, 'development');
  assert.equal(clamped.runtime.timeoutMs, 240_000);
  assert.equal(clamped.runtime.maxConcurrentPerNamespace, 8);
  assert.equal(clamped.memory.retrievalLimit, 10);
  assert.equal(clamped.data.contextMaxChars, 64_000);

  assert.throws(
    () => resolveAiGovernanceConfig({ AI_ASSURANCE_PROFILE: 'LOW' }, 'production'),
    /LOW AI assurance is blocked in production/,
  );

  const approvedLow = resolveAiGovernanceConfig({
    AI_ASSURANCE_PROFILE: 'LOW',
    AI_ALLOW_LOW_ASSURANCE_IN_PRODUCTION: 'true',
  }, 'production');
  assert.equal(approvedLow.assuranceProfile, 'LOW');

  console.log('AI executable profile invariant checks passed.');
}

main();
