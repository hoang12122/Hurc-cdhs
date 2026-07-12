import { NextRequest, NextResponse } from 'next/server';
import { detectObjects } from '@/lib/services/yolo';
import { requirePermission } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function readNumberParam(req: NextRequest, key: string, fallback: number, min: number, max: number) {
  const raw = req.nextUrl.searchParams.get(key);
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('ai:use');
    if (!checkRateLimit(`vision-detect:${user.id}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type. Use JPEG, PNG or WEBP.' }, { status: 415 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Image is too large. Maximum size is 8MB.' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await detectObjects(buffer, {
      minConfidence: readNumberParam(req, 'conf', 0.35, 0.05, 0.95),
      iouThreshold: readNumberParam(req, 'iou', 0.45, 0.1, 0.9),
      maxDetections: readNumberParam(req, 'max_det', 50, 1, 200),
      timeoutMs: readNumberParam(req, 'timeout_ms', 12_000, 3_000, 30_000),
    });

    if (!result) {
      return NextResponse.json({ error: 'YOLO Detection failed. Dịch vụ AI Vision chưa khả dụng hoặc phản hồi quá thời gian.' }, { status: 503 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Vision Detect Error:', error);
    return NextResponse.json({ error: 'Máy chủ AI gặp sự cố.' }, { status: 500 });
  }
}
