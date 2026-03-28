type RateLimitInfo = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitInfo>();

/**
 * Basic in-memory rate limiter
 * @param identifier The unique identifier for the user (e.g. IP address or email)
 * @param limit Maximum number of requests allowed within the window
 * @param windowMs Time window in milliseconds
 * @returns boolean - true if allowed, false if rate limited
 */
export function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const info = store.get(identifier);

  if (!info || now > info.resetTime) {
    // New window
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (info.count >= limit) {
    return false;
  }

  // Increment counter
  info.count++;
  return true;
}

// Clean up expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();
