import { NextRequest, NextResponse } from 'next/server';
import { AI_GOVERNANCE_CONFIG } from '@/lib/config/ai-governance-profile';
import { detectObjects } from '@/lib/services/yolo';
import { requirePermission } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

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
    const profile = AI_GOVERNANCE_CONFIG;
    if (!checkRateLimit(
      `vision-detect:${user.id}`,
      profile.rateLimits.visionPerMinute,
      60_000,
    )) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type. Use JPEG, PNG or WEBP.' }, { status: 415 });
    }
    if (file.size > profile.vision.maxUploadBytes) {
      const maxMb = Math.floor(profile.vision.maxUploadBytes / 1024 / 1024);
      return NextResponse.json({ error: `Image is too large. Maximum size is ${maxMb}MB for ${profile.runtimeProfile} profile.` }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await detectObjects(buffer, {
      minConfidence: readNumberParam(
        req,
        'conf',
        profile.vision.defaultConfidence,
        0.05,
        0.95,
      ),
      iouThreshold: readNumberParam(
        req,
        'iou',
        profile.vision.defaultIou,
        0.1,
        0.9,
      ),
      maxDetections: readNumberParam(
        req,
        'max_det',
        profile.vision.defaultMaxDetections,
        1,
        200,
      ),
      timeoutMs: readNumberParam(
        req,
        'timeout_ms',
        profile.vision.detectTimeoutMs,
        3_000,
        30_000,
      ),
    });

    if (!result) {
      return NextResponse.json({ error: 'YOLO Detection failed. Dịch vụ AI Vision chưa khả dụng hoặc phản hồi quá thời gian.' }, { status: 503 });
    }
    return NextResponse.json({
      ...result,
      governanceProfile: profile.runtimeProfile,
    });
  } catch (error: any) {
    console.error('API Vision Detect Error:', error);
    return NextResponse.json({ error: 'Máy chủ AI gặp sự cố.' }, { status: 500 });
  }
}
