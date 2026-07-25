import { suggestCollection } from '../ai-smart-router';
import { detectPromptInjection, redactSensitiveData, sanitizeAiText } from './control-plane';
import type { SecureRagState } from './secure-rag-types';

const COLLECTION_ALIASES: Record<string, string[]> = {
  'hurc-general': ['hurc-general', 'general', 'knowledge'],
  'hurc-dnf': ['hurc-dnf', 'dnf'],
  'hurc-hazards': ['hurc-hazards', 'hazards', 'safety'],
  'hurc-inspections': ['hurc-inspections', 'inspections'],
  'hurc-maintenance': ['hurc-maintenance', 'maintenance'],
  'hurc-standards': ['hurc-standards', 'technical-documents', 'standards'],
};

const RETRIEVED_INSTRUCTION_PATTERNS: Array<[string, RegExp]> = [
  ['ignore-prior-instructions', /ignore\s+(all|any|the|previous|prior)\s+(instructions|rules|policy)/i],
  ['system-message-spoofing', /(?:^|\n)\s*(system|developer|assistant)\s*(message|prompt)?\s*:/i],
  ['special-token-spoofing', /<\|(?:system|assistant|developer|tool)\|>|\[INST\]|<<SYS>>/i],
  ['policy-bypass', /(bypass|override|disable|remove).{0,40}(guardrail|policy|safety|scope|filter)/i],
  ['secret-exfiltration', /(reveal|print|dump|exfiltrate|send).{0,50}(secret|token|password|credential|system prompt)/i],
  ['tool-coercion', /(call|invoke|execute|run).{0,40}(tool|function|shell|command|database)/i],
  ['role-escalation', /(you are now|act as).{0,50}(root|administrator|developer|unrestricted)/i],
  ['jailbreak-marker', /\b(jailbreak|do anything now|DAN mode)\b/i],
];

const OUTPUT_LEAK_PATTERNS: RegExp[] = [
  /\[AI CONTROL PLANE - IMMUTABLE POLICY\]/i,
  /(?:system|developer) prompt\s*:/i,
  /Bearer\s+(?!\[REDACTED\])\S+/i,
  /-----BEGIN [A-Z ]+PRIVATE KEY-----/i,
];

function normalizeCollection(value: string): string {
  const normalized = value.trim().toLowerCase();
  for (const [canonical, aliases] of Object.entries(COLLECTION_ALIASES)) {
    if (canonical === normalized || aliases.includes(normalized)) return canonical;
  }
  return normalized;
}

function collectionVariants(value: string): Set<string> {
  const canonical = normalizeCollection(value);
  return new Set([canonical, ...(COLLECTION_ALIASES[canonical] ?? []), value.toLowerCase()]);
}

export function isCollectionAllowed(collection: string, allowedCollections: readonly string[]): boolean {
  const requested = collectionVariants(collection);
  return allowedCollections.some((allowed) => {
    const variants = collectionVariants(allowed);
    return Array.from(requested).some((item) => variants.has(item));
  });
}

export function resolveAllowedCollection(state: SecureRagState): string {
  const suggested = state.requestedCollection || suggestCollection(state.query);
  if (state.requestedCollection && !isCollectionAllowed(suggested, state.governance.agent.collections)) {
    throw new Error(`RAG_SCOPE_VIOLATION: collection '${suggested}' is outside agent scope`);
  }
  if (isCollectionAllowed(suggested, state.governance.agent.collections)) return suggested;
  if (state.governance.agent.collections.includes('hurc-general')) return 'hurc-general';
  return state.governance.agent.collections[0] || 'hurc-general';
}

export function assessRetrievedContent(raw: string, maxChars = 8_000): {
  content: string;
  signals: string[];
  quarantined: boolean;
  redacted: boolean;
  reason?: string;
} {
  const normalized = sanitizeAiText(raw, maxChars);
  const extended = RETRIEVED_INSTRUCTION_PATTERNS
    .filter(([, pattern]) => pattern.test(normalized))
    .map(([name]) => name);
  const signals = Array.from(new Set([...detectPromptInjection(normalized), ...extended]));
  const redacted = redactSensitiveData(normalized);

  if (signals.length >= 2) {
    return {
      content: '', signals, quarantined: true, redacted: redacted.detected,
      reason: 'Retrieved content contains multiple instruction-injection indicators',
    };
  }

  const retained = redacted.text.split('\n')
    .filter((line) => !RETRIEVED_INSTRUCTION_PATTERNS.some(([, pattern]) => pattern.test(line)))
    .join('\n').trim();
  if (!retained) {
    return {
      content: '', signals, quarantined: true, redacted: redacted.detected,
      reason: 'Retrieved content was empty after instruction filtering',
    };
  }
  return { content: retained, signals, quarantined: false, redacted: redacted.detected };
}

export function guardGeneratedOutput(raw: string, maxChars: number): {
  output: string;
  triggered: boolean;
  redacted: boolean;
} {
  const redacted = redactSensitiveData(sanitizeAiText(raw, maxChars));
  if (OUTPUT_LEAK_PATTERNS.some((pattern) => pattern.test(redacted.text))) {
    return {
      output: 'Yêu cầu hoặc phản hồi đã chạm giới hạn bảo mật. Hệ thống không thể cung cấp nội dung nội bộ, thông tin xác thực hoặc chỉ dẫn vượt phạm vi được cấp phép.',
      triggered: true,
      redacted: true,
    };
  }
  return { output: redacted.text, triggered: redacted.detected, redacted: redacted.detected };
}
