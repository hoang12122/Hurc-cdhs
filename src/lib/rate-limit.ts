import { AI_GOVERNANCE_CONFIG } from './config/ai-governance-profile';

type RateLimitInfo = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitInfo>();
let cleanupInterval: NodeJS.Timeout | null = null;
const MAX_STORE_SIZE = 10_000;

function startCleanup() {
  if (cleanupInterval) return;
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) store.delete(key);
    }
  }, 5 * 60_000).unref();
}

function profileLimit(identifier: string, requestedLimit: number, requestedWindowMs: number) {
  const limits = AI_GOVERNANCE_CONFIG.rateLimits;
  if (identifier.startsWith('login:')) {
    return { limit: limits.loginAttempts, windowMs: limits.loginWindowMs };
  }
  if (identifier.startsWith('2fa:')) {
    return { limit: limits.twoFactorAttempts, windowMs: limits.twoFactorWindowMs };
  }
  if (identifier.startsWith('ai_assist:')) {
    return { limit: limits.aiHintPerMinute, windowMs: 60_000 };
  }
  if (identifier.startsWith('ai_feedback:')) {
    return { limit: limits.aiFeedbackPerMinute, windowMs: 60_000 };
  }
  if (identifier.startsWith('vision-detect:') || identifier.startsWith('vision-analyze:')) {
    return { limit: limits.visionPerMinute, windowMs: 60_000 };
  }
  if (identifier.startsWith('sse:')) {
    return { limit: limits.sseOpenPerMinute, windowMs: 60_000 };
  }
  return {
    limit: Math.max(1, Math.floor(requestedLimit)),
    windowMs: Math.max(1_000, Math.floor(requestedWindowMs)),
  };
}

export function checkRateLimit(
  identifier: string,
  requestedLimit = 5,
  requestedWindowMs = 60_000,
): boolean {
  if (typeof window === 'undefined') startCleanup();
  const { limit, windowMs } = profileLimit(
    identifier,
    requestedLimit,
    requestedWindowMs,
  );
  const now = Date.now();
  const info = store.get(identifier);

  if (!info || now > info.resetTime) {
    if (store.size >= MAX_STORE_SIZE) {
      for (const [key, value] of store.entries()) {
        if (now > value.resetTime) store.delete(key);
      }
      if (store.size >= MAX_STORE_SIZE) {
        console.warn('[SECURITY] Rate limiter store is full; blocking new identifiers.');
        return false;
      }
    }

    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (info.count >= limit) return false;
  info.count += 1;
  return true;
}

export function getRateLimiterStatus() {
  return {
    activeIdentifiers: store.size,
    maxIdentifiers: MAX_STORE_SIZE,
    runtimeProfile: AI_GOVERNANCE_CONFIG.runtimeProfile,
    assuranceProfile: AI_GOVERNANCE_CONFIG.assuranceProfile,
    limits: { ...AI_GOVERNANCE_CONFIG.rateLimits },
  };
}
