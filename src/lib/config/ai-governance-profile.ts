export type AiProfileName = 'LOW' | 'STANDARD' | 'HIGH';

export interface AiGovernanceConfig {
  version: string;
  runtimeProfile: AiProfileName;
  assuranceProfile: AiProfileName;
  runtime: {
    timeoutMs: number;
    maxConcurrentPerNamespace: number;
    queueTimeoutMs: number;
    failureThreshold: number;
    cooldownMs: number;
  };
  memory: {
    topicMaxChars: number;
    contextMaxChars: number;
    defaultConfidence: number;
    humanApprovedMinConfidence: number;
    provisionalThreshold: number;
    retrievalMinConfidence: number;
    includeProvisional: boolean;
    retrievalLimit: number;
    relevanceThreshold: number;
  };
  data: {
    quarantineTrustBelow: number;
    reviewQualityBelow: number;
    reviewTrustBelow: number;
    reviewIssueCount: number;
    contextMaxChars: number;
  };
  mcp: {
    maxArgumentChars: number;
    maxResponseChars: number;
    timeoutMs: number;
    maxTracesPerUser: number;
  };
  vision: {
    maxUploadBytes: number;
    workerTimeoutMs: number;
    detectTimeoutMs: number;
    defaultConfidence: number;
    defaultIou: number;
    defaultMaxDetections: number;
  };
  uploads: {
    knowledgeMaxBytes: number;
    knowledgeTextMaxChars: number;
  };
  rateLimits: {
    loginAttempts: number;
    loginWindowMs: number;
    twoFactorAttempts: number;
    twoFactorWindowMs: number;
    aiHintPerMinute: number;
    aiFeedbackPerMinute: number;
    visionPerMinute: number;
    sseOpenPerMinute: number;
  };
  agent: {
    allowToolRead: boolean;
    allowAiMemoryCandidates: boolean;
    allowWrite: false;
  };
}

const RUNTIME_PROFILES = {
  LOW: {
    runtime: { timeoutMs: 60_000, maxConcurrentPerNamespace: 1, queueTimeoutMs: 8_000, failureThreshold: 3, cooldownMs: 120_000 },
    mcp: { maxArgumentChars: 10_000, maxResponseChars: 250_000, timeoutMs: 10_000, maxTracesPerUser: 30 },
    vision: { maxUploadBytes: 4 * 1024 * 1024, workerTimeoutMs: 15_000, detectTimeoutMs: 10_000, defaultConfidence: 0.35, defaultIou: 0.45, defaultMaxDetections: 25 },
    uploads: { knowledgeMaxBytes: 8 * 1024 * 1024, knowledgeTextMaxChars: 12_000 },
    rate: { aiHintPerMinute: 5, aiFeedbackPerMinute: 10, visionPerMinute: 5, sseOpenPerMinute: 3 },
    agentToolRead: false,
  },
  STANDARD: {
    runtime: { timeoutMs: 120_000, maxConcurrentPerNamespace: 3, queueTimeoutMs: 15_000, failureThreshold: 5, cooldownMs: 60_000 },
    mcp: { maxArgumentChars: 50_000, maxResponseChars: 1_000_000, timeoutMs: 20_000, maxTracesPerUser: 100 },
    vision: { maxUploadBytes: 8 * 1024 * 1024, workerTimeoutMs: 20_000, detectTimeoutMs: 12_000, defaultConfidence: 0.35, defaultIou: 0.45, defaultMaxDetections: 50 },
    uploads: { knowledgeMaxBytes: 15 * 1024 * 1024, knowledgeTextMaxChars: 20_000 },
    rate: { aiHintPerMinute: 10, aiFeedbackPerMinute: 20, visionPerMinute: 10, sseOpenPerMinute: 5 },
    agentToolRead: true,
  },
  HIGH: {
    runtime: { timeoutMs: 180_000, maxConcurrentPerNamespace: 6, queueTimeoutMs: 30_000, failureThreshold: 7, cooldownMs: 30_000 },
    mcp: { maxArgumentChars: 100_000, maxResponseChars: 2_000_000, timeoutMs: 30_000, maxTracesPerUser: 200 },
    vision: { maxUploadBytes: 16 * 1024 * 1024, workerTimeoutMs: 30_000, detectTimeoutMs: 20_000, defaultConfidence: 0.35, defaultIou: 0.45, defaultMaxDetections: 100 },
    uploads: { knowledgeMaxBytes: 25 * 1024 * 1024, knowledgeTextMaxChars: 50_000 },
    rate: { aiHintPerMinute: 20, aiFeedbackPerMinute: 30, visionPerMinute: 20, sseOpenPerMinute: 10 },
    agentToolRead: true,
  },
} as const;

const ASSURANCE_PROFILES = {
  LOW: {
    memory: { defaultConfidence: 0.60, humanApprovedMinConfidence: 0.90, provisionalThreshold: 0.55, retrievalMinConfidence: 0.55, includeProvisional: true, retrievalLimit: 8, relevanceThreshold: 0.15 },
    data: { quarantineTrustBelow: 30, reviewQualityBelow: 50, reviewTrustBelow: 55, reviewIssueCount: 6 },
    auth: { loginAttempts: 10, twoFactorAttempts: 10 },
    allowAiMemoryCandidates: true,
  },
  STANDARD: {
    memory: { defaultConfidence: 0.68, humanApprovedMinConfidence: 0.95, provisionalThreshold: 0.65, retrievalMinConfidence: 0.65, includeProvisional: true, retrievalLimit: 5, relevanceThreshold: 0.20 },
    data: { quarantineTrustBelow: 40, reviewQualityBelow: 60, reviewTrustBelow: 65, reviewIssueCount: 4 },
    auth: { loginAttempts: 5, twoFactorAttempts: 5 },
    allowAiMemoryCandidates: true,
  },
  HIGH: {
    memory: { defaultConfidence: 0.75, humanApprovedMinConfidence: 0.98, provisionalThreshold: 0.80, retrievalMinConfidence: 0.80, includeProvisional: false, retrievalLimit: 4, relevanceThreshold: 0.30 },
    data: { quarantineTrustBelow: 55, reviewQualityBelow: 75, reviewTrustBelow: 80, reviewIssueCount: 2 },
    auth: { loginAttempts: 3, twoFactorAttempts: 3 },
    allowAiMemoryCandidates: false,
  },
} as const;

function profile(value: string | undefined, fallback: AiProfileName): AiProfileName {
  const normalized = String(value ?? '').trim().toUpperCase();
  return normalized === 'LOW' || normalized === 'STANDARD' || normalized === 'HIGH'
    ? normalized
    : fallback;
}

function integer(env: NodeJS.ProcessEnv, key: string, fallback: number, min: number, max: number): number {
  const parsed = Number(env[key]);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function decimal(env: NodeJS.ProcessEnv, key: string, fallback: number, min: number, max: number): number {
  const parsed = Number(env[key]);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function booleanValue(value: string | undefined, fallback: boolean): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

export function resolveAiGovernanceConfig(
  env: NodeJS.ProcessEnv = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): AiGovernanceConfig {
  const runtimeProfile = profile(env.AI_RUNTIME_PROFILE, 'STANDARD');
  const assuranceProfile = profile(env.AI_ASSURANCE_PROFILE, 'STANDARD');
  if (nodeEnv === 'production' && assuranceProfile === 'LOW' && env.AI_ALLOW_LOW_ASSURANCE_IN_PRODUCTION !== 'true') {
    throw new Error('LOW AI assurance is blocked in production. Set AI_ASSURANCE_PROFILE=STANDARD or HIGH.');
  }

  const capacity = RUNTIME_PROFILES[runtimeProfile];
  const assurance = ASSURANCE_PROFILES[assuranceProfile];
  const runtime = {
    timeoutMs: integer(env, 'AI_EXECUTION_TIMEOUT_MS', capacity.runtime.timeoutMs, 3_000, 240_000),
    maxConcurrentPerNamespace: integer(env, 'AI_MAX_CONCURRENT_PER_NAMESPACE', capacity.runtime.maxConcurrentPerNamespace, 1, 8),
    queueTimeoutMs: integer(env, 'AI_QUEUE_TIMEOUT_MS', capacity.runtime.queueTimeoutMs, 1_000, 60_000),
    failureThreshold: integer(env, 'AI_FAILURE_THRESHOLD', capacity.runtime.failureThreshold, 1, 10),
    cooldownMs: integer(env, 'AI_COOLDOWN_MS', capacity.runtime.cooldownMs, 15_000, 300_000),
  };

  return {
    version: '2026-07-13.2',
    runtimeProfile,
    assuranceProfile,
    runtime,
    memory: {
      topicMaxChars: runtimeProfile === 'LOW' ? 300 : runtimeProfile === 'HIGH' ? 800 : 500,
      contextMaxChars: runtimeProfile === 'LOW' ? 8_000 : runtimeProfile === 'HIGH' ? 20_000 : 12_000,
      defaultConfidence: decimal(env, 'AI_MEMORY_DEFAULT_CONFIDENCE', assurance.memory.defaultConfidence, 0, 1),
      humanApprovedMinConfidence: decimal(env, 'AI_MEMORY_HUMAN_APPROVED_MIN', assurance.memory.humanApprovedMinConfidence, 0.8, 1),
      provisionalThreshold: decimal(env, 'AI_MEMORY_PROVISIONAL_THRESHOLD', assurance.memory.provisionalThreshold, 0, 1),
      retrievalMinConfidence: decimal(env, 'AI_MEMORY_MIN_CONFIDENCE', assurance.memory.retrievalMinConfidence, 0, 1),
      includeProvisional: booleanValue(env.AI_MEMORY_INCLUDE_PROVISIONAL, assurance.memory.includeProvisional),
      retrievalLimit: integer(env, 'AI_MEMORY_RETRIEVAL_LIMIT', assurance.memory.retrievalLimit, 1, 10),
      relevanceThreshold: decimal(env, 'AI_MEMORY_RELEVANCE_THRESHOLD', assurance.memory.relevanceThreshold, 0, 1),
    },
    data: {
      quarantineTrustBelow: integer(env, 'AI_DATA_QUARANTINE_TRUST_BELOW', assurance.data.quarantineTrustBelow, 0, 100),
      reviewQualityBelow: integer(env, 'AI_DATA_REVIEW_QUALITY_BELOW', assurance.data.reviewQualityBelow, 0, 100),
      reviewTrustBelow: integer(env, 'AI_DATA_REVIEW_TRUST_BELOW', assurance.data.reviewTrustBelow, 0, 100),
      reviewIssueCount: integer(env, 'AI_DATA_REVIEW_ISSUE_COUNT', assurance.data.reviewIssueCount, 1, 20),
      contextMaxChars: integer(env, 'AI_DATA_CONTEXT_MAX_CHARS', runtimeProfile === 'LOW' ? 12_000 : runtimeProfile === 'HIGH' ? 48_000 : 24_000, 4_000, 64_000),
    },
    mcp: capacity.mcp,
    vision: capacity.vision,
    uploads: capacity.uploads,
    rateLimits: {
      loginAttempts: assurance.auth.loginAttempts,
      loginWindowMs: 15 * 60_000,
      twoFactorAttempts: assurance.auth.twoFactorAttempts,
      twoFactorWindowMs: 10 * 60_000,
      ...capacity.rate,
    },
    agent: {
      allowToolRead: booleanValue(env.AI_AGENT_TOOL_READ_ENABLED, capacity.agentToolRead),
      allowAiMemoryCandidates: booleanValue(env.AI_AGENT_MEMORY_CANDIDATES_ENABLED, assurance.allowAiMemoryCandidates),
      allowWrite: false,
    },
  };
}

export const AI_GOVERNANCE_CONFIG = Object.freeze(resolveAiGovernanceConfig());

export function getAiGovernanceProfileSnapshot() {
  return JSON.parse(JSON.stringify(AI_GOVERNANCE_CONFIG)) as AiGovernanceConfig;
}
