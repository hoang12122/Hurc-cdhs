type RateLimitInfo = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitInfo>();

// Clean up expired entries periodically to prevent memory leaks
// Moved inside a lazy-init function to prevent build-time side-effects
let cleanupInterval: NodeJS.Timeout | null = null;
function startCleanup() {
    if (cleanupInterval) return;
    cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, value] of store.entries()) {
            if (now > value.resetTime) {
                store.delete(key);
            }
        }
    }, 5 * 60 * 1000).unref();
}

const MAX_STORE_SIZE = 10000;

/**
 * Basic in-memory rate limiter with Size Capping (Anti OOM/DDoS)
 * @param identifier The unique identifier for the user (e.g. IP address or email)
 * @param limit Maximum number of requests allowed within the window
 * @param windowMs Time window in milliseconds
 * @returns boolean - true if allowed, false if rate limited
 */
export function checkRateLimit(identifier: string, limit: number = 5, windowMs: number = 60000): boolean {
  if (typeof window === 'undefined') startCleanup();
  
  const now = Date.now();
  const info = store.get(identifier);

  if (!info || now > info.resetTime) {
    // New window - Check OOM Constraint before adding
    if (store.size >= MAX_STORE_SIZE) {
        // Force garbage collection of expired items
        for (const [key, value] of store.entries()) {
            if (now > value.resetTime) store.delete(key);
        }
        
        // If still full after GC, we must block to prevent RAM crash
        if (store.size >= MAX_STORE_SIZE) {
            console.warn("[SECURITY] Rate Limiter hit MAX_STORE_SIZE. Potential DDoS attack. Blocking new IPs.");
            return false;
        }
    }

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
