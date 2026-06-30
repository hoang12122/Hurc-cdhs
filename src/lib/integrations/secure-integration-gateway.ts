import { createHmac, timingSafeEqual } from 'crypto';

export type ExternalSystemKind = 'sap' | 'maximo' | 'scada' | 'gis' | 'bi' | 'cmms' | 'generic';
export type IntegrationDirection = 'inbound' | 'outbound' | 'bidirectional';

export interface IntegrationPolicy {
  id: string;
  systemKind: ExternalSystemKind;
  direction: IntegrationDirection;
  allowedHosts: string[];
  allowedEventTypes: string[];
  requiredPermission?: string;
  enabled: boolean;
}

export interface IntegrationEnvelope<TPayload = unknown> {
  id: string;
  sourceSystem: string;
  targetSystem: string;
  eventType: string;
  occurredAt: string;
  schemaVersion: '1.0';
  payload: TPayload;
  metadata?: Record<string, string | number | boolean>;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'apiKey',
  'api_key',
  'privateKey',
  'private_key',
  'session',
  'cookie',
]);

export function createIntegrationEnvelope<TPayload>(input: Omit<IntegrationEnvelope<TPayload>, 'id' | 'occurredAt' | 'schemaVersion'>): IntegrationEnvelope<TPayload> {
  return {
    ...input,
    id: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
    schemaVersion: '1.0',
  };
}

export function redactIntegrationPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactIntegrationPayload);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => {
        if (SENSITIVE_KEYS.has(key) || SENSITIVE_KEYS.has(key.toLowerCase())) {
          return [key, '[REDACTED]'];
        }
        return [key, redactIntegrationPayload(item)];
      }),
    );
  }

  if (typeof value === 'string' && value.length > 4000) {
    return `${value.slice(0, 4000)}...[TRUNCATED]`;
  }

  return value;
}

export function isHostAllowed(targetUrl: string, allowedHosts: string[]) {
  try {
    const { hostname, protocol } = new URL(targetUrl);
    if (!['https:', 'http:'].includes(protocol)) return false;
    return allowedHosts.some((allowedHost) => hostname === allowedHost || hostname.endsWith(`.${allowedHost}`));
  } catch {
    return false;
  }
}

export function assertIntegrationPolicy(policy: IntegrationPolicy, targetUrl: string, eventType: string) {
  if (!policy.enabled) {
    throw new Error(`Integration policy is disabled: ${policy.id}`);
  }

  if (!policy.allowedEventTypes.includes(eventType)) {
    throw new Error(`Integration event is not allowed by policy: ${eventType}`);
  }

  if (!isHostAllowed(targetUrl, policy.allowedHosts)) {
    throw new Error(`Integration target is not allowlisted: ${targetUrl}`);
  }
}

export function signIntegrationBody(body: string, secret: string, timestamp = Date.now()) {
  const payload = `${timestamp}.${body}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return { timestamp, signature: `sha256=${signature}` };
}

export function verifyIntegrationSignature(input: {
  body: string;
  secret: string;
  timestamp: string | number;
  signature: string;
  toleranceMs?: number;
}) {
  const timestamp = Number(input.timestamp);
  const toleranceMs = input.toleranceMs ?? 5 * 60 * 1000;

  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() - timestamp) > toleranceMs) return false;

  const expected = signIntegrationBody(input.body, input.secret, timestamp).signature;
  const received = Buffer.from(input.signature);
  const expectedBuffer = Buffer.from(expected);

  if (received.length !== expectedBuffer.length) return false;
  return timingSafeEqual(received, expectedBuffer);
}

export function buildSignedIntegrationHeaders(body: string, secret: string) {
  const { timestamp, signature } = signIntegrationBody(body, secret);
  return {
    'content-type': 'application/json',
    'x-hurc-timestamp': String(timestamp),
    'x-hurc-signature': signature,
  };
}
