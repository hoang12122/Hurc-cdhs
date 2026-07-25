import assert from 'node:assert/strict';
import {
  assertLocalAiEndpoint,
  isLocalAiHostname,
} from '../lib/services/ai/local-endpoint-policy';
import {
  buildLocalSemanticVector,
  localSemanticSimilarity,
  selectWithMmr,
} from '../lib/services/ai/local-vector';

function testLocalEndpointPolicy(): void {
  const allowed = [
    'http://localhost:11434',
    'http://ollama:11434',
    'http://trustgraph-api:8088',
    'http://127.0.0.1:3002',
    'http://10.10.20.30:8080',
    'http://service.ai.svc.cluster.local:8080',
  ];
  for (const endpoint of allowed) assert.doesNotThrow(() => assertLocalAiEndpoint(endpoint));

  const blocked = [
    'https://api.openai.com/v1',
    'https://api.anthropic.com',
    'https://generativelanguage.googleapis.com',
    'https://example.com/local-proxy',
  ];
  for (const endpoint of blocked) assert.throws(() => assertLocalAiEndpoint(endpoint));
  assert.equal(isLocalAiHostname('192.168.1.10'), true);
  assert.equal(isLocalAiHostname('8.8.8.8'), false);
}

function testSemanticVector(): void {
  const related = localSemanticSimilarity(
    'Kiểm tra khuyết tật ray tại ga Ba Son',
    'Rà soát hư hỏng đường ray và khuyết tật bề mặt ở Ba Son',
  );
  const unrelated = localSemanticSimilarity(
    'Kiểm tra khuyết tật ray tại ga Ba Son',
    'Quy trình cấp phát văn phòng phẩm hằng tháng',
  );
  assert.ok(related > unrelated, `Expected related=${related} > unrelated=${unrelated}`);
  assert.ok(related > 0.15, `Related vector similarity too low: ${related}`);
}

function testMmrDiversity(): void {
  const candidates = [
    { item: 'rail-primary', relevance: 0.95, vector: buildLocalSemanticVector('khuyết tật ray Ba Son') },
    { item: 'rail-duplicate', relevance: 0.92, vector: buildLocalSemanticVector('hư hỏng ray tại ga Ba Son') },
    { item: 'maintenance-diverse', relevance: 0.82, vector: buildLocalSemanticVector('kế hoạch bảo trì PSD và kiểm tra dây đai') },
  ];
  const selected = selectWithMmr(candidates, 2, 0.72).map(candidate => candidate.item);
  assert.equal(selected[0], 'rail-primary');
  assert.ok(selected.includes('maintenance-diverse'), `MMR did not diversify: ${selected.join(', ')}`);
}

function main(): void {
  testLocalEndpointPolicy();
  testSemanticVector();
  testMmrDiversity();
  console.log('[local-ai-vector-memory] All local-only and vector ranking checks passed.');
}

main();
