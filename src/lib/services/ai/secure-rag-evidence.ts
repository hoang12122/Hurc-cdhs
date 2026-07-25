import { sha256 } from './control-plane';
import { assessRetrievedContent } from './secure-rag-firewall';
import type { RawRetrievalBranch, SecureEvidence } from './secure-rag-types';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' ? value as Record<string, unknown> : undefined;
}

function firstString(record: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return undefined;
}

function firstNumber(record: Record<string, unknown> | undefined, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record?.[key];
    const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export function evidenceFromBranch(branch: RawRetrievalBranch, collection: string): SecureEvidence[] {
  if (!branch.response) return [];
  const trustWeight = branch.kind === 'graph' ? 1 : 0.86;
  const assessment = assessRetrievedContent(branch.response.response ?? '');
  const items: SecureEvidence[] = [{
    id: `${branch.kind}-response`,
    kind: branch.kind,
    title: branch.kind === 'graph' ? 'TrustGraph GraphRAG synthesis' : 'TrustGraph DocumentRAG synthesis',
    collection,
    content: assessment.content,
    trustWeight,
    injectionSignals: assessment.signals,
    quarantined: assessment.quarantined,
    quarantineReason: assessment.reason,
    hash: sha256(`${branch.kind}\n${assessment.content}`),
  }];

  for (const [index, rawSource] of (branch.response.sources ?? []).entries()) {
    const source = asRecord(rawSource);
    const rawContent = firstString(source, ['content', 'text', 'chunk', 'excerpt', 'page_content']);
    if (!rawContent) continue;
    const filtered = assessRetrievedContent(rawContent, 6_000);
    const id = firstString(source, ['id', 'document_id', 'doc_id', 'chunk_id', 'source_id']) || `${branch.kind}-${index + 1}`;
    items.push({
      id,
      kind: branch.kind,
      title: firstString(source, ['title', 'name', 'filename', 'path']),
      documentCode: firstString(source, ['document_code', 'code', 'documentCode']),
      version: firstString(source, ['version', 'revision']),
      page: firstString(source, ['page', 'page_number', 'pageNumber']),
      collection,
      score: firstNumber(source, ['score', 'similarity', 'relevance']),
      content: filtered.content,
      trustWeight,
      injectionSignals: filtered.signals,
      quarantined: filtered.quarantined,
      quarantineReason: filtered.reason,
      hash: sha256(`${branch.kind}\n${id}\n${filtered.content}`),
    });
  }
  return items;
}

export function rankEvidence(items: SecureEvidence[]): SecureEvidence[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.hash)) return false;
    seen.add(item.hash);
    return true;
  }).sort((a, b) => {
    const score = (item: SecureEvidence) => item.trustWeight + Math.max(0, Math.min(1, item.score ?? 0));
    return score(b) - score(a);
  });
}

export function buildBoundedEvidenceContext(
  evidence: SecureEvidence[], maxChars = 18_000, maxItems = 12,
): { context: string; accepted: SecureEvidence[] } {
  const accepted: SecureEvidence[] = [];
  const blocks: string[] = [];
  let used = 0;
  for (const item of rankEvidence(evidence)) {
    if (item.quarantined || !item.content || accepted.length >= maxItems) continue;
    const sameKind = accepted.filter((entry) => entry.kind === item.kind).length + 1;
    const label = `${item.kind === 'graph' ? 'G' : 'D'}${sameKind}`;
    const metadata = [
      item.documentCode && `code=${item.documentCode}`,
      item.version && `version=${item.version}`,
      item.page !== undefined && `page=${item.page}`,
      `collection=${item.collection}`,
      `sha256=${item.hash.slice(0, 16)}`,
    ].filter(Boolean).join('; ');
    const remaining = maxChars - used;
    if (remaining <= 200) break;
    const content = item.content.slice(0, Math.max(0, remaining - metadata.length - 80));
    const block = `[${label}] ${metadata}\n${content}`;
    blocks.push(block);
    accepted.push(item);
    used += block.length + 2;
  }
  return { context: blocks.join('\n\n'), accepted };
}
