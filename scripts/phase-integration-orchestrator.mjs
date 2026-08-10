import crypto from 'node:crypto';

const REQUIRED_PHASES = ['phase1', 'phase2', 'phase3'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function evaluateIntegratedRuntime(input) {
  assert(input && typeof input === 'object', 'integration input is required');
  for (const phase of REQUIRED_PHASES) assert(input[phase], `${phase} evidence is required`);

  const correlationId = input.correlationId || crypto.randomUUID();
  const evaluatedAt = new Date().toISOString();

  const phase1Ok =
    ['approved', 'recovery-ready'].includes(input.phase1.modelStatus) &&
    input.phase1.signatureVerified === true &&
    input.phase1.sha256Verified === true &&
    input.phase1.sha512Verified === true &&
    input.phase1.sbomVerified === true;

  const phase2Ok =
    input.phase2.defaultDeny === true &&
    input.phase2.publicDnsBlocked === true &&
    input.phase2.publicIpBlocked === true &&
    input.phase2.publicPorts.length === 0 &&
    input.phase2.runtimeDownloadBlocked === true &&
    Array.isArray(input.phase2.allowedServices);

  const namespace = input.phase3.namespace || {};
  const phase3Ok =
    Boolean(namespace.userId && namespace.roleId && namespace.domain) &&
    input.phase3.provenancePresent === true &&
    input.phase3.humanApprovalRequired === true &&
    input.phase3.autonomousOperationalWrite === false &&
    input.phase3.crossNamespaceAccess === false;

  const gates = { phase1: phase1Ok, phase2: phase2Ok, phase3: phase3Ok };
  const allowRuntime = Object.values(gates).every(Boolean);

  return {
    correlationId,
    evaluatedAt,
    decision: allowRuntime ? 'ALLOW' : 'DENY',
    allowRuntime,
    gates,
    model: {
      alias: input.phase1.alias,
      version: input.phase1.version,
      manifestDigest: input.phase1.manifestDigest,
    },
    network: {
      policyDigest: input.phase2.policyDigest,
      allowedServices: input.phase2.allowedServices,
    },
    memory: {
      namespace,
      memoryType: input.phase3.memoryType,
      ttl: input.phase3.ttl,
      approvalId: input.phase3.approvalId || null,
    },
    evidenceDigest: digest({ correlationId, gates, input }),
    rollbackPlan: allowRuntime
      ? ['revoke-memory-session', 'apply-egress-deny', 'select-recovery-ready-model']
      : ['keep-runtime-stopped'],
  };
}

export function assertIntegratedRuntime(input) {
  const result = evaluateIntegratedRuntime(input);
  if (!result.allowRuntime) {
    const failed = Object.entries(result.gates).filter(([, ok]) => !ok).map(([name]) => name);
    throw new Error(`integrated runtime denied: ${failed.join(', ')}`);
  }
  return result;
}
