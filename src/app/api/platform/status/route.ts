import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';
import { getPlatformHealthOverview } from '@/lib/services/platform-health-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuth();
    if (!checkRateLimit(`platform-status:${user.id}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const overview = await getPlatformHealthOverview();
    return NextResponse.json(overview, {
      headers: { 'cache-control': 'private, no-store' },
    });
  } catch (error) {
    console.error('[platform-status] failed:', error);
    return NextResponse.json({ error: 'Không thể kiểm tra trạng thái nền tảng.' }, { status: 500 });
  }
}
