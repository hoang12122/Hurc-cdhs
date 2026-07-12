import type { GovernanceContext } from './control-plane';

interface CircuitState {
  consecutiveFailures: number;
  openedUntil: number;
  halfOpenProbe: boolean;
  lastFailure?: string;
}

interface RuntimeGuardOptions {
  timeoutMs?: number;
  maxConcurrentPerNamespace?: number;
  queueTimeoutMs?: number;
  failureThreshold?: number;
  cooldownMs?: number;
}

const circuits = new Map<string, CircuitState>();
const activeByNamespace = new Map<string, number>();
const waitersByNamespace = new Map<string, Array<() => void>>();
const inFlightByFingerprint = new Map<string, Promise<unknown>>();

function getCircuit(agentId: string): CircuitState {
  const current = circuits.get(agentId);
  if (current) return current;
  const initial: CircuitState = {
    consecutiveFailures: 0,
    openedUntil: 0,
    halfOpenProbe: false,
  };
  circuits.set(agentId, initial);
  return initial;
}

function circuitAllowsRequest(agentId: string): boolean {
  const state = getCircuit(agentId);
  const now = Date.now();
  if (state.openedUntil === 0) return true;
  if (state.openedUntil > now) return false;
  if (state.halfOpenProbe) return false;
  state.halfOpenProbe = true;
  return true;
}

function recordSuccess(agentId: string): void {
  const state = getCircuit(agentId);
  state.consecutiveFailures = 0;
  state.openedUntil = 0;
  state.halfOpenProbe = false;
  state.lastFailure = undefined;
}

function recordFailure(agentId: string, error: unknown, threshold: number, cooldownMs: number): void {
  const state = getCircuit(agentId);
  state.consecutiveFailures += 1;
  state.halfOpenProbe = false;
  state.lastFailure = error instanceof Error ? error.message : String(error);
  if (state.consecutiveFailures >= threshold) {
    state.openedUntil = Date.now() + cooldownMs;
  }
}

async function acquireNamespaceSlot(namespace: string, maxConcurrent: number, timeoutMs: number): Promise<() => void> {
  const current = activeByNamespace.get(namespace) ?? 0;
  if (current < maxConcurrent) {
    activeByNamespace.set(namespace, current + 1);
    return () => releaseNamespaceSlot(namespace);
  }

  await new Promise<void>((resolve, reject) => {
    const waiters = waitersByNamespace.get(namespace) ?? [];
    const timer = setTimeout(() => {
      const queue = waitersByNamespace.get(namespace) ?? [];
      waitersByNamespace.set(namespace, queue.filter(item => item !== wake));
      reject(new Error(`AI namespace queue timeout: ${namespace}`));
    }, timeoutMs);

    const wake = () => {
      clearTimeout(timer);
      resolve();
    };

    waiters.push(wake);
    waitersByNamespace.set(namespace, waiters);
  });

  activeByNamespace.set(namespace, (activeByNamespace.get(namespace) ?? 0) + 1);
  return () => releaseNamespaceSlot(namespace);
}

function releaseNamespaceSlot(namespace: string): void {
  const current = Math.max(0, (activeByNamespace.get(namespace) ?? 1) - 1);
  activeByNamespace.set(namespace, current);
  const waiters = waitersByNamespace.get(namespace) ?? [];
  const next = waiters.shift();
  waitersByNamespace.set(namespace, waiters);
  next?.();
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`AI execution timeout after ${timeoutMs}ms`)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Executes one governed operation with:
 * - single-flight deduplication by request fingerprint;
 * - per-namespace concurrency isolation;
 * - timeout protection;
 * - circuit breaker with half-open recovery.
 */
export async function executeWithRuntimeGuard<T>(
  context: GovernanceContext,
  executor: () => Promise<T>,
  options: RuntimeGuardOptions = {},
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? 120_000;
  const maxConcurrent = options.maxConcurrentPerNamespace ?? 3;
  const queueTimeoutMs = options.queueTimeoutMs ?? 15_000;
  const failureThreshold = options.failureThreshold ?? 5;
  const cooldownMs = options.cooldownMs ?? 60_000;

  if (!circuitAllowsRequest(context.agent.id)) {
    const state = getCircuit(context.agent.id);
    throw new Error(`AI circuit open for ${context.agent.id} until ${new Date(state.openedUntil).toISOString()}`);
  }

  const existing = inFlightByFingerprint.get(context.fingerprint) as Promise<T> | undefined;
  if (existing) return existing;

  const execution = (async () => {
    const release = await acquireNamespaceSlot(context.namespace, maxConcurrent, queueTimeoutMs);
    try {
      const result = await withTimeout(executor(), timeoutMs);
      recordSuccess(context.agent.id);
      return result;
    } catch (error) {
      recordFailure(context.agent.id, error, failureThreshold, cooldownMs);
      throw error;
    } finally {
      release();
    }
  })();

  inFlightByFingerprint.set(context.fingerprint, execution);
  try {
    return await execution;
  } finally {
    if (inFlightByFingerprint.get(context.fingerprint) === execution) {
      inFlightByFingerprint.delete(context.fingerprint);
    }
  }
}

export function getAiRuntimeGuardStatus() {
  return {
    circuits: Array.from(circuits.entries()).map(([agentId, state]) => ({
      agentId,
      state: state.openedUntil > Date.now() ? 'open' : state.halfOpenProbe ? 'half-open' : 'closed',
      consecutiveFailures: state.consecutiveFailures,
      openedUntil: state.openedUntil ? new Date(state.openedUntil).toISOString() : null,
      lastFailure: state.lastFailure ?? null,
    })),
    namespaces: Array.from(activeByNamespace.entries()).map(([namespace, active]) => ({
      namespace,
      active,
      queued: (waitersByNamespace.get(namespace) ?? []).length,
    })),
    singleFlightRequests: inFlightByFingerprint.size,
  };
}

export function resetAiRuntimeGuardForTests(): void {
  circuits.clear();
  activeByNamespace.clear();
  waitersByNamespace.clear();
  inFlightByFingerprint.clear();
}
