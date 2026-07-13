import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';
import { getDigitalTwinOverview } from '@/lib/services/digital-twin/overview-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();
    if (!checkRateLimit(`digital-twin-overview:${user.id}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const overview = await getDigitalTwinOverview();
    return NextResponse.json(overview, {
      headers: {
        'cache-control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('[digital-twin] overview failed:', error);
    return NextResponse.json({ error: 'Không thể tổng hợp trạng thái Digital Twin.' }, { status: 500 });
  }
}
