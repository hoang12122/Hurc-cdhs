import { AI_GOVERNANCE_CONFIG } from '../config/ai-governance-profile';
import {
  applyYoloQualityGate,
  type YoloQualityOptions,
  type YoloQualityResult,
} from './yolo-quality-gate';

export interface YoloDetection {
  box: [number, number, number, number];
  label: string;
  confidence: number;
  class_id: number;
}

export interface YoloResponse {
  detections: YoloDetection[];
  count: number;
  image_size: {
    width: number;
    height: number;
  };
}

export interface YoloClientOptions extends YoloQualityOptions {
  timeoutMs?: number;
}

const DEFAULT_YOLO_URL = 'http://yolo-service:5005/detect';

function buildYoloUrl(options: YoloClientOptions) {
  const profile = AI_GOVERNANCE_CONFIG.vision;
  const rawUrl = process.env.YOLO_SERVICE_URL || DEFAULT_YOLO_URL;
  const url = new URL(rawUrl);
  url.searchParams.set('conf', String(
    options.minConfidence ?? profile.defaultConfidence,
  ));
  url.searchParams.set('iou', String(
    options.iouThreshold ?? profile.defaultIou,
  ));
  url.searchParams.set('max_det', String(
    options.maxDetections ?? profile.defaultMaxDetections,
  ));
  return url.toString();
}

export async function detectObjects(
  imageBuffer: Buffer,
  options: YoloClientOptions = {},
): Promise<YoloQualityResult | null> {
  const profile = AI_GOVERNANCE_CONFIG.vision;
  if (imageBuffer.length > profile.maxUploadBytes) {
    console.warn(
      `[YOLO] Image rejected by ${AI_GOVERNANCE_CONFIG.runtimeProfile} profile size limit.`,
    );
    return null;
  }

  const timeoutMs = Math.min(
    30_000,
    Math.max(3_000, options.timeoutMs ?? profile.detectTimeoutMs),
  );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpeg' });
    formData.append('file', blob, 'image.jpg');

    const response = await fetch(buildYoloUrl(options), {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`YOLO service responded with ${response.status}: ${response.statusText}`);
    }

    const raw = (await response.json()) as YoloResponse;
    return applyYoloQualityGate(raw, {
      ...options,
      minConfidence: options.minConfidence ?? profile.defaultConfidence,
      iouThreshold: options.iouThreshold ?? profile.defaultIou,
      maxDetections: options.maxDetections ?? profile.defaultMaxDetections,
    });
  } catch (error) {
    console.error('Error calling YOLO Service:', error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
