import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';
import { AsyncTtlCache } from '@/lib/cache/async-ttl-cache';
import {
  getDigitalTwinOverview,
  type DigitalTwinOverview,
} from '@/lib/services/digital-twin/overview-service';

export const dynamic = 'force-dynamic';

const overviewCache = new AsyncTtlCache<DigitalTwinOverview>(4);

function readLimit(request: Request) {
  const raw = new URL(request.url).searchParams.get('limit');
  const parsed = Number(raw ?? 40);
  if (!Number.isFinite(parsed)) return 40;
  return Math.min(200, Math.max(8, Math.round(parsed)));
}

export async function GET(request: Request) {
  const started = performance.now();
  try {
    const user = await requireAuth();
    if (!checkRateLimit(`digital-twin-overview:${user.id}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const limit = readLimit(request);
    const cached = await overviewCache.get(
      'digital-twin-overview',
      () => getDigitalTwinOverview(),
      10_000,
      20_000,
    );
    const overview = {
      ...cached.value,
      assets: cached.value.assets.slice(0, limit),
      returnedAssets: Math.min(limit, cached.value.assets.length),
      totalAssets: cached.value.assets.length,
    };

    return NextResponse.json(overview, {
      headers: {
        'cache-control': 'private, max-age=5, stale-while-revalidate=15',
        'server-timing': `app;dur=${(performance.now() - started).toFixed(1)}`,
        'x-runtime-cache': cached.status,
      },
    });
  } catch (error) {
    console.error('[digital-twin] overview failed:', error);
    return NextResponse.json({ error: 'Không thể tổng hợp trạng thái Digital Twin.' }, { status: 500 });
  }
}
