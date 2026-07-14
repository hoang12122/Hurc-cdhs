import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024 * 1024;
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const user = await requirePermission('admin:system');
    if (!checkRateLimit(`vision-training:${user.id}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Too many training control requests.' }, { status: 429 });
    }
    const token = process.env.VISION_TRAINER_TOKEN;
    const baseUrl = process.env.VISION_TRAINER_URL;
    if (!baseUrl || !token || token.length < 24) {
      return NextResponse.json({ error: 'Vision training service is not safely configured.' }, { status: 503 });
    }
    const { path } = await context.params;
    if (!Array.isArray(path) || path.length === 0 || path.some(segment => !SAFE_SEGMENT.test(segment))) {
      return NextResponse.json({ error: 'Invalid training API path.' }, { status: 400 });
    }
    const target = new URL(path.map(encodeURIComponent).join('/'), `${baseUrl.replace(/\/$/, '')}/`);
    request.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));

    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Training request exceeds 16MB.' }, { status: 413 });
    }
    const hasBody = !['GET', 'HEAD'].includes(request.method);
    const body = hasBody ? await request.arrayBuffer() : undefined;
    if (body && body.byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Training request exceeds 16MB.' }, { status: 413 });
    }
    const headers: Record<string, string> = { authorization: `Bearer ${token}` };
    const contentType = request.headers.get('content-type');
    if (contentType) headers['content-type'] = contentType;

    const response = await fetch(target, {
      method: request.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(request.method === 'GET' ? 10_000 : 30_000),
    });
    const responseType = response.headers.get('content-type') ?? 'application/json';
    const payload = await response.arrayBuffer();
    return new NextResponse(payload, {
      status: response.status,
      headers: {
        'content-type': responseType,
        'cache-control': 'no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[vision-training-proxy] failed:', error);
    return NextResponse.json({ error: 'Vision training request failed.' }, { status: 500 });
  }
}

export const GET = proxy;
export const POST = proxy;
