#!/usr/bin/env node
import { createHash } from 'node:crypto';

const APPROVED_MODEL_STATES = new Set(['approved', 'recovery-ready']);
const MEMORY_TYPES = new Set(['episodic', 'semantic', 'decision', 'task', 'preference']);
const APPROVED_SERVICES = new Set(['trustgraph', 'ollama', 'nemoclaw', 'postgresql', 'internal-dns']);

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function digest(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function validateModel(model) {
  requireValue(model?.signatureVerified === true, 'Model signature is not verified');
  requireValue(/^[a-f0-9]{64}$/.test(model.sha256 || ''), 'Model SHA-256 is invalid');
  requireValue(/^[a-f0-9]{128}$/.test(model.sha512 || ''), 'Model SHA-512 is invalid');
  requireValue(typeof model.license === 'string' && model.license.length > 0, 'Model license is missing');
  requireValue(typeof model.provenance === 'string' && model.provenance.length > 0, 'Model provenance is missing');
  requireValue(APPROVED_MODEL_STATES.has(model.state), `Model state is not loadable: ${model.state}`);
  requireValue(/^[a-f0-9]{64}$/.test(model.imageDigest || ''), 'Runtime image digest is invalid');
  requireValue(/^[a-f0-9]{64}$/.test(model.sbomDigest || ''), 'SBOM digest is invalid');
}

function validateNetwork(network) {
  requireValue(network?.restrictedProfile === true, 'Restricted AI network profile is not enabled');
  requireValue(network.publicPortPublished === false, 'Public AI port is published');
  requireValue(network.publicDnsReachable === false, 'Public DNS is reachable');
  requireValue(network.publicIpReachable === false, 'Public IP is reachable');
  requireValue(Array.isArray(network.allowedServices), 'Network allowlist is missing');
  for (const service of network.allowedServices) {
    requireValue(APPROVED_SERVICES.has(service), `Unapproved internal service: ${service}`);
  }
}

function validateMemory(memory, request) {
  requireValue(MEMORY_TYPES.has(memory.type), `Invalid memory type: ${memory.type}`);
  requireValue(memory.namespace?.userId === request.userId, 'Cross-user memory access denied');
  requireValue(memory.namespace?.roleId === request.roleId, 'Cross-role memory access denied');
  requireValue(memory.namespace?.domain === request.domain, 'Cross-domain memory access denied');
  requireValue(typeof memory.provenance === 'string' && memory.provenance.length > 0, 'Memory provenance is required');
  requireValue(Number.isFinite(memory.confidence) && memory.confidence >= 0 && memory.confidence <= 1, 'Memory confidence is invalid');
  requireValue(Number.isInteger(memory.version) && memory.version > 0, 'Memory version is invalid');
  requireValue(Number.isInteger(memory.ttlSeconds) && memory.ttlSeconds > 0, 'Memory TTL is invalid');
  requireValue(memory.aiOutputUnverified !== true, 'Unverified AI output cannot become long-term truth');
  if (memory.requiresHumanApproval) {
    requireValue(memory.humanApproved === true, 'Human approval is required');
  }
  requireValue(memory.operationalWrite === false, 'Autonomous operational data write is prohibited');
  if (memory.type === 'preference') {
    requireValue(memory.containsSecret === false, 'Preference memory must not contain secrets');
  }
}

export function authorizeIntegratedExecution(input) {
  requireValue(input?.request?.requestId, 'Request ID is required');
  validateModel(input.model);
  validateNetwork(input.network);
  validateMemory(input.memory, input.request);

  const evidence = {
    schemaVersion: '1.0.0',
    decision: 'allow',
    requestId: input.request.requestId,
    actor: {
      userId: input.request.userId,
      roleId: input.request.roleId,
      domain: input.request.domain
    },
    model: {
      alias: input.model.alias,
      version: input.model.version,
      sha256: input.model.sha256,
      sha512: input.model.sha512,
      imageDigest: input.model.imageDigest,
      sbomDigest: input.model.sbomDigest,
      state: input.model.state
    },
    networkPolicyDigest: digest(input.network),
    memoryNamespace: input.memory.namespace,
    memoryPolicyDigest: digest(input.memory),
    generatedAt: new Date().toISOString()
  };
  evidence.evidenceDigest = digest(evidence);
  return evidence;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.stdin.setEncoding('utf8');
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  try {
    const evidence = authorizeIntegratedExecution(JSON.parse(raw));
    process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
