/**
 * Server-Side TTL Cache
 * 
 * In-memory cache for reference data that rarely changes.
 * Eliminates redundant DB queries for subsystems, locations, roles, etc.
 * 
 * Data Classification:
 * - T1 (CRITICAL): Auth data — NOT cached (always fresh from DB)
 * - T2 (HIGH): Operations core — short TTL cache (30s)
 * - T3 (STANDARD): Reference/config data — medium TTL cache (5-10min)
 * - T4 (LOW): Analytics/AI — longer TTL cache (15min)
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
    hitCount: number;
}

class ServerCache {
    private store = new Map<string, CacheEntry<any>>();
    private readonly maxEntries = 100;

    /**
     * Get cached value or execute fetcher and cache result
     */
    async getOrFetch<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttlMs: number = 60_000
    ): Promise<T> {
        const now = Date.now();
        const cached = this.store.get(key);

        if (cached && now < cached.expiresAt) {
            cached.hitCount++;
            return cached.data as T;
        }

        // Fetch fresh data
        const data = await fetcher();

        // Evict oldest entries if at capacity
        if (this.store.size >= this.maxEntries) {
            const oldestKey = this.findOldestEntry();
            if (oldestKey) this.store.delete(oldestKey);
        }

        this.store.set(key, {
            data,
            expiresAt: now + ttlMs,
            hitCount: 0,
        });

        return data;
    }

    /**
     * Invalidate a specific cache key
     */
    invalidate(key: string): void {
        this.store.delete(key);
    }

    /**
     * Invalidate all keys matching a prefix
     */
    invalidatePrefix(prefix: string): void {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) {
                this.store.delete(key);
            }
        }
    }

    /**
     * Clear entire cache
     */
    clear(): void {
        this.store.clear();
    }

    /**
     * Get cache stats for monitoring
     */
    getStats(): { size: number; keys: string[] } {
        return {
            size: this.store.size,
            keys: [...this.store.keys()],
        };
    }

    private findOldestEntry(): string | null {
        let oldestKey: string | null = null;
        let oldestTime = Infinity;

        for (const [key, entry] of this.store.entries()) {
            const insertTime = entry.expiresAt - 60_000; // approximate
            if (insertTime < oldestTime) {
                oldestTime = insertTime;
                oldestKey = key;
            }
        }

        return oldestKey;
    }
}

// ============ SINGLETON ============

const cacheInstance = new ServerCache();

declare global {
    var __serverCache: ServerCache | undefined;
}

export const cache: ServerCache = globalThis.__serverCache ?? cacheInstance;

if (process.env.NODE_ENV !== 'production') {
    globalThis.__serverCache = cache;
}

// ============ TTL CONSTANTS (Data Classification) ============

/** T1 CRITICAL: Auth data - NEVER cached */
// No constant needed — always query DB directly

/** T3 STANDARD: Reference data that rarely changes */
export const TTL_REFERENCE = 10 * 60 * 1000; // 10 minutes

/** T3 STANDARD: Configuration data */
export const TTL_CONFIG = 5 * 60 * 1000; // 5 minutes

/** T2 HIGH: Operations summary data */
export const TTL_OPS_SUMMARY = 30 * 1000; // 30 seconds

/** T4 LOW: Analytics and AI data */
export const TTL_ANALYTICS = 15 * 60 * 1000; // 15 minutes

// ============ CACHE KEYS ============

export const CACHE_KEYS = {
    SUBSYSTEMS: 'ref:subsystems',
    LOCATIONS: 'ref:locations',
    RESPONSIBLE_UNITS: 'ref:responsible_units',
    MAINTENANCE_STANDARDS: 'ref:maintenance_standards',
    ROLES: 'ref:roles',
    AI_AGENTS: 'ai:agents',
    SYSTEM_STATE: 'config:system_state',
} as const;

// ============ CLEANUP ============

// Clean expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of (cache as any).store?.entries?.() || []) {
        if (now > entry.expiresAt) {
            (cache as any).store?.delete?.(key);
        }
    }
}, 5 * 60 * 1000).unref?.();
