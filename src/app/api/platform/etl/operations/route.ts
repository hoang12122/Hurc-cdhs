import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';
import { AsyncTtlCache } from '@/lib/cache/async-ttl-cache';
import {
  getEtlOperationsOverview,
  type EtlOperationsOverview,
} from '@/lib/services/etl-operations-service';

export const dynamic = 'force-dynamic';

const operationsCache = new AsyncTtlCache<EtlOperationsOverview>(4);

export async function GET() {
  const started = performance.now();
  try {
    const user = await requireAuth();
    if (!checkRateLimit(`etl-operations:${user.id}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const cached = await operationsCache.get(
      'etl-operations',
      () => getEtlOperationsOverview(),
      5_000,
      15_000,
    );

    return NextResponse.json(cached.value, {
      headers: {
        'cache-control': 'private, max-age=3, stale-while-revalidate=15',
        'server-timing': `etl;dur=${(performance.now() - started).toFixed(1)}`,
        'x-runtime-cache': cached.status,
      },
    });
  } catch (error) {
    console.error('[etl-operations] failed:', error);
    return NextResponse.json({ error: 'Không thể tải dữ liệu vận hành ETL.' }, { status: 500 });
  }
}
