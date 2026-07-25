const DEFAULT_DIMENSIONS = 256;
const MAX_FEATURES = 4_096;

function foldVietnamese(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, match => match === 'đ' ? 'd' : 'D')
    .toLocaleLowerCase('vi');
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function tokenize(value: string): string[] {
  return foldVietnamese(value)
    .split(/[^a-z0-9_-]+/i)
    .map(token => token.trim())
    .filter(token => token.length >= 2)
    .slice(0, MAX_FEATURES);
}

function characterTrigrams(token: string): string[] {
  if (token.length < 3) return [`c:${token}`];
  const padded = `^${token}$`;
  const features: string[] = [];
  for (let index = 0; index <= padded.length - 3; index += 1) {
    features.push(`c:${padded.slice(index, index + 3)}`);
  }
  return features;
}

function addFeature(vector: number[], feature: string, weight: number): void {
  const hash = stableHash(feature);
  const index = hash % vector.length;
  const sign = (hash & 0x80000000) === 0 ? 1 : -1;
  vector[index] += sign * weight;
}

export function buildLocalSemanticVector(
  value: string,
  dimensions = DEFAULT_DIMENSIONS,
): number[] {
  const boundedDimensions = Math.max(64, Math.min(1_024, Math.floor(dimensions)));
  const vector = new Array<number>(boundedDimensions).fill(0);
  const tokens = tokenize(value);
  const frequencies = new Map<string, number>();

  for (const token of tokens) frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
  for (const [token, frequency] of frequencies) {
    const termWeight = 1 + Math.log(frequency);
    addFeature(vector, `w:${token}`, termWeight);
    for (const trigram of characterTrigrams(token)) addFeature(vector, trigram, termWeight * 0.35);
  }

  const magnitude = Math.sqrt(vector.reduce((sum, valueAtIndex) => sum + valueAtIndex ** 2, 0));
  if (magnitude === 0) return vector;
  return vector.map(valueAtIndex => valueAtIndex / magnitude);
}

export function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length === 0 || left.length !== right.length) return 0;
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }
  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  if (denominator === 0) return 0;
  return Math.max(0, Math.min(1, dot / denominator));
}

export function localSemanticSimilarity(left: string, right: string): number {
  return cosineSimilarity(buildLocalSemanticVector(left), buildLocalSemanticVector(right));
}

export interface MmrCandidate<T> {
  item: T;
  relevance: number;
  vector: number[];
}

export function selectWithMmr<T>(
  candidates: MmrCandidate<T>[],
  limit: number,
  lambda = 0.78,
): MmrCandidate<T>[] {
  const boundedLimit = Math.max(1, Math.min(limit, candidates.length));
  const boundedLambda = Math.max(0.5, Math.min(1, lambda));
  const remaining = [...candidates];
  const selected: MmrCandidate<T>[] = [];

  while (remaining.length > 0 && selected.length < boundedLimit) {
    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let index = 0; index < remaining.length; index += 1) {
      const candidate = remaining[index];
      const redundancy = selected.length === 0
        ? 0
        : Math.max(...selected.map(previous => cosineSimilarity(candidate.vector, previous.vector)));
      const mmrScore = boundedLambda * candidate.relevance - (1 - boundedLambda) * redundancy;
      if (mmrScore > bestScore) {
        bestScore = mmrScore;
        bestIndex = index;
      }
    }
    selected.push(remaining.splice(bestIndex, 1)[0]);
  }

  return selected;
}

export const LOCAL_VECTOR_DIMENSIONS = DEFAULT_DIMENSIONS;
