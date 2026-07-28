import assert from 'node:assert/strict';
import { assertIntegratedRuntime, evaluateIntegratedRuntime } from './phase-integration-orchestrator.mjs';

function validFixture() {
  return {
    correlationId: 'integration-proof-001',
    phase1: {
      alias: 'hurc-assistant',
      version: '1.0.0',
      modelStatus: 'approved',
      signatureVerified: true,
      sha256Verified: true,
      sha512Verified: true,
      sbomVerified: true,
      manifestDigest: 'a'.repeat(64),
    },
    phase2: {
      defaultDeny: true,
      publicDnsBlocked: true,
      publicIpBlocked: true,
      publicPorts: [],
      runtimeDownloadBlocked: true,
      allowedServices: ['trustgraph', 'ollama', 'postgresql'],
      policyDigest: 'b'.repeat(64),
    },
    phase3: {
      namespace: { userId: 'user-1', roleId: 'engineer', domain: 'maintenance' },
      provenancePresent: true,
      humanApprovalRequired: true,
      autonomousOperationalWrite: false,
      crossNamespaceAccess: false,
      memoryType: 'semantic',
      ttl: 'P30D',
      approvalId: 'approval-001',
    },
  };
}

const allowed = assertIntegratedRuntime(validFixture());
assert.equal(allowed.decision, 'ALLOW');
assert.deepEqual(allowed.rollbackPlan, [
  'revoke-memory-session',
  'apply-egress-deny',
  'select-recovery-ready-model',
]);
assert.match(allowed.evidenceDigest, /^[a-f0-9]{64}$/);

const unapprovedModel = validFixture();
unapprovedModel.phase1.modelStatus = 'quarantine';
assert.equal(evaluateIntegratedRuntime(unapprovedModel).decision, 'DENY');
assert.throws(() => assertIntegratedRuntime(unapprovedModel), /phase1/);

const openEgress = validFixture();
openEgress.phase2.publicIpBlocked = false;
assert.equal(evaluateIntegratedRuntime(openEgress).decision, 'DENY');
assert.throws(() => assertIntegratedRuntime(openEgress), /phase2/);

const invalidMemory = validFixture();
invalidMemory.phase3.namespace.domain = '';
invalidMemory.phase3.provenancePresent = false;
assert.equal(evaluateIntegratedRuntime(invalidMemory).decision, 'DENY');
assert.throws(() => assertIntegratedRuntime(invalidMemory), /phase3/);

const autonomousWrite = validFixture();
autonomousWrite.phase3.autonomousOperationalWrite = true;
assert.equal(evaluateIntegratedRuntime(autonomousWrite).decision, 'DENY');

console.log('Phase 1-2-3 integration proof passed');
