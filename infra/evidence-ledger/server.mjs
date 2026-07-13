import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname } from 'node:path';
import { JsonRpcProvider, Wallet } from 'ethers';

const PORT = Number(process.env.PORT || 8787);
const RPC_URL = process.env.BESU_RPC_URL || 'http://besu:8545';
const DATA_FILE = process.env.LEDGER_DATA_FILE || '/data/anchors.ndjson';
const GATEWAY_TOKEN = process.env.LEDGER_GATEWAY_TOKEN || '';
const WRITE_ENABLED = process.env.LEDGER_WRITE_ENABLED === 'true';
const SIGNER_MODE = process.env.LEDGER_SIGNER_MODE || 'disabled';
const PRIVATE_KEY = process.env.LEDGER_PRIVATE_KEY || '';
const EXTERNAL_SIGNER_URL = process.env.LEDGER_EXTERNAL_SIGNER_URL || '';
const EXTERNAL_SIGNER_TOKEN = process.env.LEDGER_EXTERNAL_SIGNER_TOKEN || '';
const MAX_BODY_BYTES = 64 * 1024;

if (GATEWAY_TOKEN.length < 24) {
  throw new Error('LEDGER_GATEWAY_TOKEN must contain at least 24 characters.');
}
if (!['disabled', 'external', 'local-dev'].includes(SIGNER_MODE)) {
  throw new Error('LEDGER_SIGNER_MODE must be disabled, external or local-dev.');
}
if (process.env.NODE_ENV === 'production' && SIGNER_MODE === 'local-dev') {
  throw new Error('local-dev signer is blocked in production.');
}

const provider = new JsonRpcProvider(RPC_URL);

function jsonResponse(response, status, body) {
  const encoded = Buffer.from(JSON.stringify(body));
  response.writeHead(status, {
    'content-type': 'application/json',
    'content-length': encoded.length,
    'cache-control': 'no-store',
  });
  response.end(encoded);
}

function authorized(request) {
  const value = request.headers.authorization || '';
  const received = Buffer.from(value.replace(/^Bearer\s+/i, ''));
  const expected = Buffer.from(GATEWAY_TOKEN);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error(`Request body exceeds ${MAX_BODY_BYTES} bytes.`);
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON.');
    error.status = 400;
    throw error;
  }
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map(key => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeHash(value) {
  const normalized = String(value || '').toLowerCase().replace(/^0x/, '');
  if (!/^[a-f0-9]{64}$/.test(normalized)) {
    const error = new Error('evidenceHash must be a 64-character SHA-256 hexadecimal value.');
    error.status = 400;
    throw error;
  }
  return normalized;
}

async function appendRecord(record) {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  await appendFile(DATA_FILE, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
}

async function anchorWithLocalSigner(evidenceHash) {
  if (!PRIVATE_KEY) throw new Error('LEDGER_PRIVATE_KEY is required for local-dev signing.');
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const transaction = await wallet.sendTransaction({
    to: wallet.address,
    value: 0n,
    data: `0x${evidenceHash}`,
  });
  const receipt = await transaction.wait(1);
  return {
    transactionHash: transaction.hash,
    blockNumber: receipt?.blockNumber ?? null,
    signer: wallet.address,
  };
}

async function anchorWithExternalSigner(evidenceHash, metadataHash, evidenceId) {
  if (!EXTERNAL_SIGNER_URL) throw new Error('LEDGER_EXTERNAL_SIGNER_URL is required.');
  const response = await fetch(EXTERNAL_SIGNER_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(EXTERNAL_SIGNER_TOKEN ? { authorization: `Bearer ${EXTERNAL_SIGNER_TOKEN}` } : {}),
    },
    body: JSON.stringify({ evidenceId, evidenceHash, metadataHash, rpcUrl: RPC_URL }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`External signer returned HTTP ${response.status}.`);
  const result = await response.json();
  if (!/^0x[a-fA-F0-9]{64}$/.test(String(result.transactionHash || ''))) {
    throw new Error('External signer returned an invalid transaction hash.');
  }
  return {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber ?? null,
    signer: result.signer ?? 'external',
  };
}

async function anchorEvidence(body) {
  if (!WRITE_ENABLED) {
    const error = new Error('Ledger writes are disabled by configuration.');
    error.status = 503;
    throw error;
  }

  const evidenceId = String(body.evidenceId || '').trim();
  if (!evidenceId || evidenceId.length > 160) {
    const error = new Error('evidenceId is required and must not exceed 160 characters.');
    error.status = 400;
    throw error;
  }

  const evidenceHash = normalizeHash(body.evidenceHash);
  const metadata = canonicalize(body.metadata && typeof body.metadata === 'object' ? body.metadata : {});
  const metadataJson = JSON.stringify(metadata);
  if (Buffer.byteLength(metadataJson) > 16 * 1024) {
    const error = new Error('metadata exceeds 16 KiB.');
    error.status = 413;
    throw error;
  }
  const metadataHash = sha256(metadataJson);

  let chainResult;
  if (SIGNER_MODE === 'local-dev') {
    chainResult = await anchorWithLocalSigner(evidenceHash);
  } else if (SIGNER_MODE === 'external') {
    chainResult = await anchorWithExternalSigner(evidenceHash, metadataHash, evidenceId);
  } else {
    const error = new Error('Ledger signer is disabled.');
    error.status = 503;
    throw error;
  }

  const record = {
    anchorId: randomUUID(),
    evidenceId,
    evidenceHash,
    metadataHash,
    transactionHash: chainResult.transactionHash,
    blockNumber: chainResult.blockNumber,
    signer: chainResult.signer,
    signerMode: SIGNER_MODE,
    anchoredAt: new Date().toISOString(),
  };
  record.recordHash = sha256(JSON.stringify(canonicalize(record)));
  await appendRecord(record);
  return record;
}

async function findAnchor(evidenceHash) {
  try {
    const text = await readFile(DATA_FILE, 'utf8');
    const lines = text.trim().split('\n').filter(Boolean).slice(-10_000).reverse();
    for (const line of lines) {
      const record = JSON.parse(line);
      if (record.evidenceHash === evidenceHash) return record;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  return null;
}

async function handleRequest(request, response) {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/health') {
    try {
      const [blockNumber, network] = await Promise.all([
        provider.getBlockNumber(),
        provider.getNetwork(),
      ]);
      return jsonResponse(response, 200, {
        status: 'healthy',
        writeEnabled: WRITE_ENABLED,
        signerMode: SIGNER_MODE,
        blockNumber,
        chainId: network.chainId.toString(),
      });
    } catch (error) {
      return jsonResponse(response, 503, { status: 'degraded', error: error.message });
    }
  }

  if (!authorized(request)) return jsonResponse(response, 401, { error: 'Unauthorized.' });

  if (request.method === 'POST' && url.pathname === '/anchors') {
    const body = await readJsonBody(request);
    const record = await anchorEvidence(body);
    return jsonResponse(response, 201, record);
  }

  if (request.method === 'GET' && url.pathname === '/verify') {
    const evidenceHash = normalizeHash(url.searchParams.get('hash'));
    const record = await findAnchor(evidenceHash);
    if (!record) return jsonResponse(response, 404, { verified: false });
    const transaction = await provider.getTransaction(record.transactionHash).catch(() => null);
    return jsonResponse(response, 200, {
      verified: Boolean(transaction),
      record,
      transactionBlockNumber: transaction?.blockNumber ?? null,
    });
  }

  return jsonResponse(response, 404, { error: 'Not found.' });
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch(error => {
    console.error('[evidence-ledger]', error);
    jsonResponse(response, Number(error.status || 500), {
      error: Number(error.status || 500) >= 500 ? 'Ledger operation failed.' : error.message,
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[evidence-ledger] listening on :${PORT}; signer=${SIGNER_MODE}; write=${WRITE_ENABLED}`);
});
