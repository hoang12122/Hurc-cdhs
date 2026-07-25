import { isIP } from 'node:net';

const INTERNAL_DNS_SUFFIXES = [
  '.local',
  '.internal',
  '.svc',
  '.svc.cluster.local',
];

const INTERNAL_DNS_HOSTS = new Set([
  'localhost',
  'host.docker.internal',
  'gateway.docker.internal',
]);

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/^\[|\]$/g, '');
}

function isPrivateIpv4(hostname: string): boolean {
  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some(value => !Number.isInteger(value) || value < 0 || value > 255)) {
    return false;
  }

  const [a, b] = octets;
  return a === 127
    || a === 10
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 169 && b === 254);
}

function isPrivateIpv6(hostname: string): boolean {
  return hostname === '::1'
    || hostname.startsWith('fc')
    || hostname.startsWith('fd')
    || /^fe[89ab]/i.test(hostname);
}

function isInternalServiceName(hostname: string): boolean {
  if (!hostname || hostname.length > 253) return false;
  if (INTERNAL_DNS_HOSTS.has(hostname)) return true;
  if (INTERNAL_DNS_SUFFIXES.some(suffix => hostname.endsWith(suffix))) return true;

  // Docker Compose and Kubernetes service names are normally single-label DNS names.
  return !hostname.includes('.') && /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(hostname);
}

export function isLocalAiHostname(rawHostname: string): boolean {
  const hostname = normalizeHostname(rawHostname);
  const ipVersion = isIP(hostname);
  if (ipVersion === 4) return isPrivateIpv4(hostname);
  if (ipVersion === 6) return isPrivateIpv6(hostname);
  return isInternalServiceName(hostname);
}

export function assertLocalAiEndpoint(rawEndpoint: string, label = 'AI endpoint'): URL {
  let endpoint: URL;
  try {
    endpoint = new URL(rawEndpoint);
  } catch {
    throw new Error(`${label} is not a valid absolute URL.`);
  }

  if (!['http:', 'https:'].includes(endpoint.protocol)) {
    throw new Error(`${label} must use HTTP(S) inside the private network.`);
  }
  if (endpoint.username || endpoint.password) {
    throw new Error(`${label} must not contain credentials in the URL.`);
  }
  if (!isLocalAiHostname(endpoint.hostname)) {
    throw new Error(
      `${label} violates LOCAL_AI_ONLY policy: public or untrusted host "${endpoint.hostname}" is blocked.`,
    );
  }

  return endpoint;
}

export function normalizeLocalAiBaseUrl(rawEndpoint: string, label: string): string {
  const endpoint = assertLocalAiEndpoint(rawEndpoint, label);
  endpoint.hash = '';
  endpoint.search = '';
  return endpoint.toString().replace(/\/$/, '');
}
