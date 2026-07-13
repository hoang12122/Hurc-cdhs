export type AsyncCacheStatus = 'HIT' | 'MISS' | 'STALE';

interface CacheEntry<T> {
  value?: T;
  expiresAt: number;
  staleUntil: number;
  pending?: Promise<T>;
}

export class AsyncTtlCache<T> {
  private readonly entries = new Map<string, CacheEntry<T>>();

  constructor(private readonly maxEntries = 100) {}

  async get(
    key: string,
    loader: () => Promise<T>,
    ttlMs: number,
    staleMs = ttlMs * 2,
  ): Promise<{ value: T; status: AsyncCacheStatus }> {
    const now = Date.now();
    const existing = this.entries.get(key);

    if (existing?.value !== undefined && existing.expiresAt > now) {
      return { value: existing.value, status: 'HIT' };
    }

    if (existing?.pending) {
      return { value: await existing.pending, status: 'HIT' };
    }

    if (existing?.value !== undefined && existing.staleUntil > now) {
      existing.pending = this.refresh(key, loader, ttlMs, staleMs, existing);
      void existing.pending.catch(() => undefined);
      return { value: existing.value, status: 'STALE' };
    }

    const entry: CacheEntry<T> = existing ?? { expiresAt: 0, staleUntil: 0 };
    entry.pending = this.refresh(key, loader, ttlMs, staleMs, entry);
    this.entries.set(key, entry);
    return { value: await entry.pending, status: 'MISS' };
  }

  clear(key?: string) {
    if (key) this.entries.delete(key);
    else this.entries.clear();
  }

  private async refresh(
    key: string,
    loader: () => Promise<T>,
    ttlMs: number,
    staleMs: number,
    entry: CacheEntry<T>,
  ): Promise<T> {
    try {
      const value = await loader();
      const now = Date.now();
      entry.value = value;
      entry.expiresAt = now + Math.max(250, ttlMs);
      entry.staleUntil = entry.expiresAt + Math.max(0, staleMs);
      this.entries.set(key, entry);
      this.evictIfNeeded();
      return value;
    } finally {
      entry.pending = undefined;
    }
  }

  private evictIfNeeded() {
    while (this.entries.size > this.maxEntries) {
      const oldestKey = this.entries.keys().next().value as string | undefined;
      if (!oldestKey) break;
      this.entries.delete(oldestKey);
    }
  }
}
