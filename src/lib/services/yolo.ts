import { applyYoloQualityGate, type YoloQualityOptions, type YoloQualityResult } from './yolo-quality-gate';

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
const DEFAULT_TIMEOUT_MS = 12000;

function buildYoloUrl(options: YoloClientOptions) {
  const rawUrl = process.env.YOLO_SERVICE_URL || DEFAULT_YOLO_URL;
  const url = new URL(rawUrl);

  if (options.minConfidence !== undefined) url.searchParams.set('conf', String(options.minConfidence));
  if (options.iouThreshold !== undefined) url.searchParams.set('iou', String(options.iouThreshold));
  if (options.maxDetections !== undefined) url.searchParams.set('max_det', String(options.maxDetections));

  return url.toString();
}

export async function detectObjects(imageBuffer: Buffer, options: YoloClientOptions = {}): Promise<YoloQualityResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

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
    return applyYoloQualityGate(raw, options);
  } catch (error) {
    console.error('Error calling YOLO Service:', error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
