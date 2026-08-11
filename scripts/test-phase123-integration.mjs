#!/usr/bin/env node
import { authorizeIntegratedExecution } from './phase123-orchestrator.mjs';

const sha256 = 'a'.repeat(64);
const sha512 = 'b'.repeat(128);

function fixture() {
  return {
    request: {
      requestId: 'ci-phase123-proof',
      userId: 'user-001',
      roleId: 'engineering-safety',
      domain: 'metro-line-1'
    },
    model: {
      alias: 'internal-rag-model',
      version: '1.0.0',
      signatureVerified: true,
      sha256,
      sha512,
      license: 'Apache-2.0',
      provenance: 'internal-registry/model/internal-rag-model/1.0.0',
      state: 'recovery-ready',
      imageDigest: 'c'.repeat(64),
      sbomDigest: 'd'.repeat(64)
    },
    network: {
      restrictedProfile: true,
      publicPortPublished: false,
      publicDnsReachable: false,
      publicIpReachable: false,
      allowedServices: ['trustgraph', 'ollama', 'postgresql', 'internal-dns']
    },
    memory: {
      type: 'decision',
      namespace: {
        userId: 'user-001',
        roleId: 'engineering-safety',
        domain: 'metro-line-1'
      },
      provenance: 'approved-document:DNF-2026-001',
      confidence: 0.98,
      version: 1,
      ttlSeconds: 86400,
      requiresHumanApproval: true,
      humanApproved: true,
      aiOutputUnverified: false,
      operationalWrite: false,
      containsSecret: false
    }
  };
}

function expectReject(name, mutate, message) {
  const input = fixture();
  mutate(input);
  try {
    authorizeIntegratedExecution(input);
    throw new Error(`${name}: unexpectedly allowed`);
  } catch (error) {
    if (!String(error.message).includes(message)) {
      throw new Error(`${name}: expected '${message}', got '${error.message}'`);
    }
  }
}

const evidence = authorizeIntegratedExecution(fixture());
if (evidence.decision !== 'allow') throw new Error('Valid integrated execution was not allowed');
if (!/^[a-f0-9]{64}$/.test(evidence.evidenceDigest)) throw new Error('Evidence digest is invalid');

expectReject('unsigned model', (x) => { x.model.signatureVerified = false; }, 'Model signature is not verified');
expectReject('unapproved model', (x) => { x.model.state = 'standardized'; }, 'Model state is not loadable');
expectReject('missing provenance', (x) => { x.model.provenance = ''; }, 'Model provenance is missing');
expectReject('public port', (x) => { x.network.publicPortPublished = true; }, 'Public AI port is published');
expectReject('public DNS', (x) => { x.network.publicDnsReachable = true; }, 'Public DNS is reachable');
expectReject('public IP', (x) => { x.network.publicIpReachable = true; }, 'Public IP is reachable');
expectReject('unapproved service', (x) => { x.network.allowedServices.push('public-internet'); }, 'Unapproved internal service');
expectReject('cross-user retrieval', (x) => { x.memory.namespace.userId = 'user-999'; }, 'Cross-user memory access denied');
expectReject('missing memory provenance', (x) => { x.memory.provenance = ''; }, 'Memory provenance is required');
expectReject('unverified AI truth', (x) => { x.memory.aiOutputUnverified = true; }, 'Unverified AI output cannot become long-term truth');
expectReject('missing approval', (x) => { x.memory.humanApproved = false; }, 'Human approval is required');
expectReject('operational write', (x) => { x.memory.operationalWrite = true; }, 'Autonomous operational data write is prohibited');
expectReject('secret preference', (x) => { x.memory.type = 'preference'; x.memory.containsSecret = true; }, 'Preference memory must not contain secrets');

console.log('Phase 1-2-3 integration proof passed with fail-closed rejection cases');
