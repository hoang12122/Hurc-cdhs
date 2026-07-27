# AI algorithms, vectors, long-term memory and security evidence

**Document code:** HURC-CDHS-AI-EVIDENCE-01  
**Scope:** local AI, Secure RAG, vector mapping, governed memory, training, model registry, CI/CD and security controls  
**Assurance principle:** evidence from source code and executable tests; no claim is based only on a prompt or design intention.

## 1. Executive conclusion

The software uses a governed hybrid architecture:

1. **NemoClaw/Nemotron local inference** generates answers through an HTTP-compatible internal interface.
2. **TrustGraph GraphRAG and DocumentRAG** retrieve graph and document evidence in parallel.
3. **Secure RAG hooks** enforce collection scope, prompt-injection filtering, bounded context, provenance and output DLP.
4. **Governed long-term memory** stores only scoped memories with checksum, confidence, verification state, expiry and provenance.
5. **Local semantic vectors** supplement lexical and entity matching without calling a public embedding API.
6. **Governed training** requires versioned data, reproducible feature definitions, evaluation gates and human approval.
7. **Signed local model registry** uses SHA-256 artifact checksums and Ed25519 manifest signatures before promotion.
8. **Human approval remains mandatory** for actions that change data, models or operational state.

## 2. Algorithm inventory and source evidence

| Capability | Applied algorithm/mechanism | Source evidence |
|---|---|---|
| Query routing | Hybrid intent classification: deterministic classifier with local-model assistance and safe fallback | `src/lib/services/ai-smart-router.ts`, `src/lib/services/ai.ts` |
| Graph retrieval | GraphRAG with entity/triple limits, subgraph bound and path-length bound | `src/lib/services/ai/secure-rag-hooks.ts` |
| Document retrieval | DocumentRAG with bounded document limit | `src/lib/services/ai/secure-rag-hooks.ts` |
| Concurrent retrieval | `Promise.allSettled` with an independent timeout for each retrieval branch | `src/lib/services/ai/secure-rag-hooks.ts` |
| Retrieval firewall | Content sanitization, sensitive-data redaction, injection detection and quarantine | `src/lib/services/ai/secure-rag-firewall.ts` |
| Evidence ranking | Deduplicate by SHA-256; rank by `trustWeight + bounded source score` | `src/lib/services/ai/secure-rag-evidence.ts` |
| Context construction | At most 12 accepted evidence items and 18,000 characters; provenance labels `[G#]`/`[D#]` | `src/lib/services/ai/secure-rag-evidence.ts` |
| Output protection | DLP/redaction and policy/token/private-key leakage detection | `src/lib/services/ai/secure-rag-firewall.ts` |
| Runtime isolation | Namespace semaphore, single-flight, queue timeout and circuit breaker | `src/lib/services/ai/runtime-guard.ts` |
| Memory integrity | SHA-256 identity, reinforcement counter, confidence, status and expiry | `src/lib/services/agent-memory/store.ts` |
| Memory retrieval | Hybrid lexical + local vector + entity + confidence + importance + recency ranking | `src/lib/services/agent-memory/retrieval.ts` |
| Result diversity | Maximal Marginal Relevance (MMR) removes near-duplicate memories | `src/lib/services/ai/local-vector.ts` |
| Local-only enforcement | Private-host endpoint validation, model allowlist, offline model loading and CI source scan | `src/lib/services/ai/local-endpoint-policy.ts`, `scripts/check-local-ai-only.mjs` |
| Model artifact integrity | SHA-256 checksum for every artifact | `scripts/model-registry-sign.mjs`, `scripts/model-registry-verify.mjs` |
| Release authorization | Ed25519 signature over canonical registry manifest | `scripts/model-registry-sign.mjs`, `scripts/model-registry-verify.mjs` |
| Tamper rejection | executable positive and negative test | `scripts/test-model-registry.mjs` |
| Stream feature reproducibility | schema-versioned normalization, replay and deterministic feature definitions | `infra/etl-normalizer`, `infra/etl-replay-worker` |

## 3. Vector usage and mathematical proof

### 3.1 TrustGraph vectors

`TrustGraphClient` exposes the following local vector operations:

- `embeddings(text)` returns `number[][]`;
- `graphEmbeddingsQuery(query)` performs graph-vector retrieval;
- `documentEmbeddingsQuery(query)` performs document-vector retrieval.

These vectors remain behind the configured TrustGraph private endpoint. The application does not need a public embedding provider.

### 3.2 Deterministic local memory vector

Long-term memory has an additional deterministic local feature vector in `local-vector.ts`.

Processing steps:

1. Unicode NFKD normalization and Vietnamese accent folding.
2. Tokenization into words.
3. Generation of word features and character trigrams.
4. Feature hashing into a fixed **256-dimensional vector**.
5. Signed accumulation to reduce hash-collision bias.
6. L2 normalization.

For a text feature `f`, the vector cell is selected by:

```text
index(f) = FNV1a(f) mod 256
sign(f)  = +1 or -1 from the high hash bit
v[index] = v[index] + sign(f) × weight(f)
```

The resulting vector is normalized:

```text
v_normalized = v / sqrt(sum(v_i²))
```

Similarity is cosine similarity:

```text
cos(q, m) = (q · m) / (||q|| × ||m||)
```

The implementation clamps the reported value to `[0, 1]` for ranking. This vector is local, deterministic, dependency-free and reproducible. It is a resilient fallback and a memory-ranking feature; it does not pretend to replace a trained multilingual embedding model.

### 3.3 Long-term memory ranking formula

For each memory candidate:

```text
score = 0.28 × lexical_similarity
      + 0.30 × local_vector_similarity
      + 0.20 × entity_overlap
      + 0.12 × confidence
      + 0.06 × normalized_importance
      + 0.04 × recency
```

Recency uses exponential decay:

```text
recency = exp(-age_days / 120)
```

After ranking, MMR selects diverse memories:

```text
MMR(d) = λ × relevance(d)
       - (1 - λ) × max cosine(d, selected)
```

The production value is `λ = 0.78`, which keeps relevance dominant while penalizing duplicate context.

### 3.4 Memory lifetime

Memory expiry is calculated in `agent-memory/shared.ts`:

```text
ttl_days = clamp(30 + 18 × importance + 120 × confidence, 30, 365)
```

Human-approved and database-derived memories may become verified. Unsafe, low-confidence or disallowed AI-output memories are quarantined and are not normally retrieved.

## 4. Secure RAG processing proof

The Secure RAG pipeline executes four non-optional stages:

1. **Scope and Injection Wall**
   - resolves only collections allowed for the selected agent;
   - hashes the user namespace;
   - blocks critical prompt-injection requests before retrieval.
2. **Retrieved Data Firewall**
   - treats retrieved content as untrusted evidence, never as an instruction channel;
   - redacts secrets and quarantines unsafe chunks.
3. **Bounded Context Builder**
   - deduplicates evidence by SHA-256;
   - limits quantity and character size;
   - attaches collection, document code, version, page and hash provenance.
4. **Output DLP**
   - scans the generated answer again;
   - redacts sensitive data and blocks policy, token or private-key leakage.

Graph evidence receives trust weight `1.00`; document evidence receives `0.86`. A source-provided similarity score is bounded to `[0,1]` before being added to the trust weight.

## 5. Governed learning and training proof

The system does not permit uncontrolled self-training from its own answers. The accepted lifecycle is:

```text
verified source data
→ immutable raw copy
→ versioned curated dataset
→ deterministic train/validation/test split
→ fixed training configuration and random seed
→ experiment tracking
→ metric and robustness evaluation
→ human approval
→ signed model registry
→ staged deployment
→ drift monitoring and rollback
```

For a supervised model with observations `(x_i, y_i)`, the optimization target must be explicitly recorded. For classification, a common objective is cross entropy:

```text
L = -(1/N) × Σ_i Σ_c y_i,c log(p_i,c)
```

For regression, a common baseline is mean squared error:

```text
MSE = (1/N) × Σ_i (y_i - ŷ_i)²
```

The repository does not claim a model is optimal merely because it minimizes training loss. Acceptance must compare against a fixed baseline on held-out data and include operational metrics such as precision, recall, false-alarm rate, latency and calibration. A candidate is promoted only when it meets the approved threshold and passes security, data-leakage and robustness checks.

Training/inference skew is controlled by requiring the same feature definition, unit, time window, missing-value policy and schema version in both paths. Stream-derived rolling features use reproducible formulas such as:

```text
mean_t = (1 / |W_t|) × Σ x_i
variance_t = (1 / |W_t|) × Σ (x_i - mean_t)²
z_t = (x_t - mean_t) / max(std_t, epsilon)
```

## 6. Signed model registry proof

For artifact bytes `B`:

```text
artifact_digest = SHA-256(B)
```

The canonical manifest is signed with Ed25519:

```text
signature = Ed25519.Sign(private_key, canonical_manifest_without_signature)
```

Deployment authorization requires both:

```text
Ed25519.Verify(public_key, canonical_manifest, signature) = true
SHA-256(local_artifact) = manifest.sha256
```

This provides independent detection of artifact tampering and unauthorized manifest replacement. `scripts/test-model-registry.mjs` creates an ephemeral Ed25519 key pair, signs an artifact, verifies it, then modifies the artifact and proves verification fails.

Lifecycle states are `candidate`, `approved`, `deprecated` and `revoked`. Production loaders must reject `candidate` and `revoked` records. Signing private keys are not stored in the repository.

## 7. Local-only AI proof

The intended runtime is enforced, not merely documented:

- public AI SDK dependencies are rejected by CI;
- public AI API-key names and known public AI hosts are rejected in `src/` and `infra/`;
- NemoClaw endpoints accept only loopback, private IP, Docker/Kubernetes service names or internal DNS suffixes;
- request redirects are rejected, preventing a local endpoint from redirecting to a public provider;
- model names are selected from a local allowlist;
- the Python AI server sets `HF_HUB_OFFLINE`, `TRANSFORMERS_OFFLINE` and `HF_DATASETS_OFFLINE`;
- language, YOLO and Whisper models must already exist in mounted local paths;
- `local_files_only=True` and `trust_remote_code=False` are mandatory;
- the former public Google generative-AI SDK dependency has been removed.

The phrase “OpenAI-compatible” refers only to an internal JSON wire format. It does not authorize an OpenAI service or public endpoint.

## 8. Critical weaknesses found and remediation

| Severity | Weakness found | Impact | Remediation |
|---|---|---|---|
| Critical | User-supplied `model_id` was passed to model loading | arbitrary repository/path selection and unintended download | local alias-to-path allowlist |
| Critical | `trust_remote_code=True` was enabled | model repository code could execute during load | forced `trust_remote_code=False` |
| Critical | Runtime model download was possible | data-sovereignty breach and supply-chain exposure | offline environment plus `local_files_only=True` |
| High | Model artifacts lacked signed release authorization | unauthorized or modified model could be promoted | Ed25519 signed manifest and SHA-256 verification |
| High | AI endpoints were not strictly validated | accidental routing to public AI services | private-host policy and startup/CI gate |
| High | Image/audio uploads were unbounded | memory exhaustion and decompression-bomb risk | byte, MIME and pixel limits |
| High | Internal exception text was returned to clients | information disclosure | generic external errors; internal logging only |
| High | Memory retrieval lacked a vector component | weak recall when wording differs | local feature vectors and cosine similarity |
| Medium | Repeated memories could dominate context | duplicated context and biased answers | MMR diversity selection |
| Medium | Public SDK used only for schema types | unnecessary public-AI dependency and attack surface | local tool-schema types and code split |
| Medium | Generated scratch verifier was tracked | repository noise and misleading evidence | removed and replaced by executable CI tests |
| Medium | Workflow granted `security-events: write` globally | excess token privilege | permission moved only to CodeQL job |

## 9. Executable verification

```bash
npm run security:local-ai-only
npm run test:local-ai-vector-memory
npm run test:secure-rag-hooks
npm run test:ai-governance
npm run test:model-registry
npm run platform:config
node scripts/check-mlflow-security.mjs
node scripts/check-etl-architecture.mjs
python3 -m unittest infra/etl-normalizer/test_contract.py
python3 -m unittest infra/etl-replay-worker/test_replay.py
npm run typecheck
npm run lint
npm run build
python3 -m py_compile infra/ai-server/main.py infra/ai-server/transcribe.py
```

The Security and Acceptance workflow runs these checks automatically for pull requests to `main`. CodeQL, dependency audit, production build and scheduled private security regression provide separate evidence layers.

## 10. Pentest and continuous-improvement boundary

Permitted recurring tests are non-destructive and run against isolated CI or private staging:

- static analysis and CodeQL;
- dependency and container scanning;
- prompt-injection and output-DLP regression tests;
- model-registry signature/checksum tamper tests;
- malformed request, size-boundary and file-type tests;
- authorization/scope tests across collection and namespace boundaries;
- RAG retrieval timeout and degraded-mode tests.

The system must not autonomously exploit production, expose a service to the Internet, modify operational data or learn directly from unverified AI output. Findings become reviewed issues/PRs, and deployment remains subject to human approval and passing gates.

## 11. Remaining limitations and next controlled phase

1. The deterministic local vector improves recall but is not a trained Vietnamese embedding. TrustGraph local embeddings remain the preferred semantic layer.
2. The signed registry baseline is executable, but production startup must make verification mandatory and keys should be held in HSM/KMS or an offline signer.
3. Network-level egress denial must also be enforced by host firewall/container policy; application checks are defense in depth, not a replacement.
4. Long-term memory should next add explicit episodic, semantic, decision and task memory types, with human review for durable operational facts.
5. Production MLOps still requires dataset retention policy, model SBOM, malware scanning, drift thresholds and rollback drills.
6. Destructive repository cleanup must follow a retention manifest so audit evidence is not removed accidentally.
