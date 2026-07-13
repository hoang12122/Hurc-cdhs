import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';
import { AsyncTtlCache } from '@/lib/cache/async-ttl-cache';
import {
  getPlatformHealthOverview,
  type PlatformHealthOverview,
} from '@/lib/services/platform-health-service';

export const dynamic = 'force-dynamic';

const healthCache = new AsyncTtlCache<PlatformHealthOverview>(4);

export async function GET() {
  const started = performance.now();
  try {
    const user = await requireAuth();
    if (!checkRateLimit(`platform-status:${user.id}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const cached = await healthCache.get(
      'platform-health',
      () => getPlatformHealthOverview(),
      5_000,
      10_000,
    );

    return NextResponse.json(cached.value, {
      headers: {
        'cache-control': 'private, max-age=3, stale-while-revalidate=10',
        'server-timing': `app;dur=${(performance.now() - started).toFixed(1)}`,
        'x-runtime-cache': cached.status,
      },
    });
  } catch (error) {
    console.error('[platform-status] failed:', error);
    return NextResponse.json({ error: 'Không thể kiểm tra trạng thái nền tảng.' }, { status: 500 });
  }
}
