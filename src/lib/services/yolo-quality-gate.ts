import type { YoloDetection, YoloResponse } from './yolo';

export interface YoloQualityOptions {
  minConfidence?: number;
  iouThreshold?: number;
  maxDetections?: number;
  allowedLabels?: string[];
}

export interface YoloQualityReport {
  inputCount: number;
  outputCount: number;
  removedLowConfidence: number;
  removedByLabel: number;
  removedByNms: number;
  minConfidence: number;
  iouThreshold: number;
}

export interface YoloQualityResult extends YoloResponse {
  quality: YoloQualityReport;
}

const DEFAULT_MIN_CONFIDENCE = 0.35;
const DEFAULT_IOU_THRESHOLD = 0.45;
const DEFAULT_MAX_DETECTIONS = 50;

function area(box: [number, number, number, number]) {
  const width = Math.max(0, box[2] - box[0]);
  const height = Math.max(0, box[3] - box[1]);
  return width * height;
}

export function calculateIou(boxA: [number, number, number, number], boxB: [number, number, number, number]) {
  const x1 = Math.max(boxA[0], boxB[0]);
  const y1 = Math.max(boxA[1], boxB[1]);
  const x2 = Math.min(boxA[2], boxB[2]);
  const y2 = Math.min(boxA[3], boxB[3]);
  const interArea = area([x1, y1, x2, y2]);
  const unionArea = area(boxA) + area(boxB) - interArea;
  return unionArea > 0 ? interArea / unionArea : 0;
}

function isValidBox(box: number[]): box is [number, number, number, number] {
  return box.length === 4 && box.every(Number.isFinite) && box[2] > box[0] && box[3] > box[1];
}

function normalizeDetection(detection: YoloDetection): YoloDetection | null {
  if (!isValidBox(detection.box)) return null;
  if (!Number.isFinite(detection.confidence)) return null;

  return {
    box: detection.box.map((value) => Math.max(0, Number(value))) as [number, number, number, number],
    label: String(detection.label || 'unknown').trim(),
    confidence: Math.max(0, Math.min(1, detection.confidence)),
    class_id: Number.isFinite(detection.class_id) ? detection.class_id : -1,
  };
}

export function applyYoloQualityGate(response: YoloResponse, options: YoloQualityOptions = {}): YoloQualityResult {
  const minConfidence = options.minConfidence ?? DEFAULT_MIN_CONFIDENCE;
  const iouThreshold = options.iouThreshold ?? DEFAULT_IOU_THRESHOLD;
  const maxDetections = options.maxDetections ?? DEFAULT_MAX_DETECTIONS;
  const allowedLabelSet = options.allowedLabels?.length ? new Set(options.allowedLabels.map((label) => label.toLowerCase())) : null;

  const normalized = response.detections.map(normalizeDetection).filter(Boolean) as YoloDetection[];
  const confidenceFiltered = normalized.filter((detection) => detection.confidence >= minConfidence);
  const labelFiltered = allowedLabelSet
    ? confidenceFiltered.filter((detection) => allowedLabelSet.has(detection.label.toLowerCase()))
    : confidenceFiltered;

  const sorted = [...labelFiltered].sort((a, b) => b.confidence - a.confidence);
  const selected: YoloDetection[] = [];
  let removedByNms = 0;

  for (const detection of sorted) {
    const overlapsSameClass = selected.some(
      (kept) => kept.class_id === detection.class_id && calculateIou(kept.box, detection.box) >= iouThreshold,
    );

    if (overlapsSameClass) {
      removedByNms += 1;
      continue;
    }

    selected.push(detection);
    if (selected.length >= maxDetections) break;
  }

  return {
    detections: selected,
    count: selected.length,
    image_size: response.image_size,
    quality: {
      inputCount: response.detections.length,
      outputCount: selected.length,
      removedLowConfidence: normalized.length - confidenceFiltered.length,
      removedByLabel: confidenceFiltered.length - labelFiltered.length,
      removedByNms,
      minConfidence,
      iouThreshold,
    },
  };
}
