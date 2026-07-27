# Signed Model Registry and Governed MLOps

**Document code:** HURC-CDHS-MLOPS-REGISTRY-01  
**Status:** executable baseline for local/offline model promotion  
**Scope:** artifact integrity, approval, provenance, promotion, rollback and CI evidence

## 1. Objective

The model registry is the trust boundary between training and inference. A model is not eligible for deployment merely because it exists in MLflow or object storage. Promotion requires a signed registry manifest and an exact SHA-256 match against the local artifact.

## 2. Registry record

Each model record contains at least:

- stable model identifier and semantic version;
- local artifact path or immutable object-storage reference;
- SHA-256 checksum;
- lifecycle state: `candidate`, `approved`, `deprecated` or `revoked`;
- framework and training-run identifier;
- dataset and feature-set versions when available;
- evaluation metrics and acceptance threshold;
- approver identity and approval timestamp for production promotion;
- rollback target and deployment history.

The manifest itself is signed with Ed25519. Private signing keys are never committed to the repository. Verification uses the corresponding public key distributed through the internal trust store.

## 3. Cryptographic mechanism

For artifact bytes `B`:

```text
artifact_digest = SHA-256(B)
```

The manifest is canonicalized by recursively sorting object keys. The signature is:

```text
signature = Ed25519.Sign(private_key, canonical_manifest_without_signature)
```

Verification succeeds only when both conditions hold:

```text
Ed25519.Verify(public_key, canonical_manifest, signature) = true
SHA-256(local_artifact) = manifest.sha256
```

This separates two threats:

1. checksum mismatch detects artifact modification;
2. signature mismatch detects unauthorized manifest replacement.

## 4. Executable implementation

- `scripts/model-registry-sign.mjs`: calculates checksums and signs the canonical manifest;
- `scripts/model-registry-verify.mjs`: verifies signature, model status and every artifact checksum;
- `scripts/test-model-registry.mjs`: generates an ephemeral Ed25519 key pair, signs a test artifact, verifies it and proves that tampering is rejected;
- `.github/workflows/security-and-acceptance.yml`: executes the proof on every pull request and protected branch run.

Commands:

```bash
npm run test:model-registry
npm run model-registry:sign -- registry.json private-key.pem
npm run model-registry:verify -- registry.json public-key.pem
```

## 5. Promotion workflow

```text
training run
→ metrics and dataset provenance recorded
→ candidate artifact written to private object storage
→ security and quality evaluation
→ human approval
→ SHA-256 manifest generated
→ Ed25519 signature created by controlled signer
→ registry verification
→ staged deployment
→ canary/acceptance test
→ production promotion or rollback
```

A model in `revoked` state must never be loaded. A `candidate` model may be evaluated only in isolated staging. Production loading requires an approved record and successful signature/checksum verification before process startup.

## 6. MLOps completeness requirements

The target MLOps control plane consists of:

- MLflow for experiment and run metadata;
- private object storage for datasets and artifacts;
- signed registry manifest as the deployment authorization record;
- dataset, schema and feature-definition versions;
- evaluation suites for accuracy, robustness, data leakage and drift;
- approval and segregation of duties;
- model-serving deployment history;
- monitoring, rollback and revocation;
- AI Governance enforcement at inference time.

MLflow registration alone is not considered authorization. The signed manifest is the offline-verifiable release evidence.

## 7. Security properties and limitations

Provided controls:

- no public model provider is required;
- exact artifact integrity is verified before promotion;
- unauthorized manifest changes are detected;
- CI proves normal verification and tamper rejection;
- signing keys remain outside source control.

Remaining infrastructure controls:

- keys should be held in HSM/KMS or an offline signing workstation;
- public keys require controlled rotation and revocation;
- production startup must enforce verification, not rely only on CI;
- object storage should use versioning, retention lock and restricted service identities;
- model SBOM and malware scanning should be attached to each approved release.
