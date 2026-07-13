import { sanitizeAiText, sha256 } from '../control-plane';

export function clampScore(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeString(value: string): string {
  return sanitizeAiText(value, 50_000)
    .replace(/\s+/g, ' ')
    .trim();
}

export function canonicalizeData(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return normalizeString(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return Object.is(value, -0) ? 0 : value;
  }
  if (typeof value === 'boolean') return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonicalizeData);
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.keys(record)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((result, key) => {
        if (record[key] !== undefined) result[key] = canonicalizeData(record[key]);
        return result;
      }, {});
  }
  return String(value);
}

export function computeDataFingerprint(value: unknown): string {
  return sha256(JSON.stringify(canonicalizeData(value)));
}

export function flattenText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(flattenText).join(' ');
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).map(flattenText).join(' ');
  }
  return value == null ? '' : String(value);
}

export function hasPlaceholderValue(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^(n\/a|na|none|null|undefined|unknown|tbd|todo|chưa rõ|không rõ|-+)$/i.test(value.trim());
}

export function getPath(record: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[segment];
  }, record);
}

export function inferEntityId(record: Record<string, unknown>): string {
  const candidate = record.id
    ?? record.entityId
    ?? record.code
    ?? record.failureReportNo
    ?? record.assetId
    ?? record.equipmentId;
  return candidate
    ? normalizeString(String(candidate))
    : `unidentified-${computeDataFingerprint(record).slice(0, 16)}`;
}

export function inferEntityType(record: Record<string, unknown>): string {
  return normalizeString(String(
    record.entityType ?? record.type ?? record.recordType ?? 'unknown-entity',
  ));
}

export function parseTimestamp(value: unknown): number | null {
  if (!value) return null;
  const parsed = new Date(String(value)).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}
