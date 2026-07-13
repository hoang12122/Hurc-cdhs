import { NextRequest, NextResponse } from 'next/server';
import { AI_GOVERNANCE_CONFIG } from '@/lib/config/ai-governance-profile';
import { internalLogSystemEvent as logSystemEvent } from '@/lib/services/log-service';
import { requirePermission } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';

const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: NextRequest) {
  try {
    const user = await requirePermission('ai:use');
    const profile = AI_GOVERNANCE_CONFIG;
    if (!checkRateLimit(
      `vision-analyze:${user.id}`,
      profile.rateLimits.visionPerMinute,
      60_000,
    )) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type' }, { status: 415 });
    }
    if (file.size > profile.vision.maxUploadBytes) {
      const maxMb = Math.floor(profile.vision.maxUploadBytes / 1024 / 1024);
      return NextResponse.json({ error: `Image is too large. Maximum size is ${maxMb}MB for ${profile.runtimeProfile} profile.` }, { status: 413 });
    }

    const aiWorkerUrl = process.env.AI_WORKER_URL || 'http://yolo-service:5005';
    const proxyFormData = new FormData();
    proxyFormData.append('file', file, file.name);

    const response = await fetch(`${aiWorkerUrl}/detect`, {
      method: 'POST',
      body: proxyFormData,
      signal: AbortSignal.timeout(profile.vision.workerTimeoutMs),
    });

    if (!response.ok) throw new Error(`AI Worker returned ${response.status}`);
    const data = await response.json();
    await logSystemEvent(
      'AI_VISION_ANALYZE',
      'INFO',
      `User ${user.id} analyzed image under ${profile.runtimeProfile} profile. Detections: ${data.detections?.length || 0}.`,
      'ai',
    );
    return NextResponse.json({
      ...data,
      governanceProfile: profile.runtimeProfile,
    });
  } catch (error: any) {
    console.error('[AI Vision API Error]:', error);
    await logSystemEvent('AI_VISION_ERROR', 'ERROR', 'AI vision request failed', 'ai').catch(() => undefined);
    const timedOut = error?.name === 'TimeoutError';
    return NextResponse.json({ error: timedOut ? 'AI worker timed out' : 'Failed to analyze image' }, { status: timedOut ? 504 : 500 });
  }
}
