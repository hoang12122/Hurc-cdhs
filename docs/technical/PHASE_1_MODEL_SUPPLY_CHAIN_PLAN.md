# Phase 1 — Internal Model Supply Chain

Related roadmap: #62

## Objective

Establish a fail-closed internal model supply chain. A model may not be loaded unless its manifest, provenance, license, promotion state, signature and artifact checksums are valid.

## Registry contract

Each model record must contain:

- immutable model ID;
- human-readable alias;
- semantic version;
- SHA-256 and SHA-512 artifact checksums;
- license identifier and license evidence location;
- source provenance and approved source browser location;
- framework and runtime compatibility metadata;
- training run or imported release identifier;
- promotion state;
- recovery metadata;
- signed manifest metadata.

## Promotion workflow

The only allowed promotion path is:

`quarantine -> standardized -> security-reviewed -> approved -> recovery-ready`

Promotion is monotonic. Skipping states is prohibited. Revocation returns the model to a non-loadable state and requires a new reviewed version before use.

## Load-time verification

Before loading a model, the runtime must:

1. read the signed registry manifest from the internal registry;
2. verify the Ed25519 signature against an approved public key;
3. verify SHA-256 and SHA-512 for every referenced artifact;
4. validate license and source provenance metadata;
5. confirm the model is in `approved` or `recovery-ready` state;
6. confirm runtime compatibility and local-only source policy;
7. reject the load on any missing, malformed or mismatched field.

The runtime must not download models from public endpoints.

## SBOM evidence

CI must generate or validate:

- an SBOM for each AI container image;
- an SBOM or equivalent component inventory for model runtime dependencies;
- a signed evidence reference linking the model manifest, image digest and SBOM digest.

Generated SBOM artifacts are CI evidence and must not contain secrets or model binaries.

## Acceptance tests

CI must prove:

- valid manifests pass signature and dual-checksum verification;
- altered artifacts are rejected;
- altered manifests are rejected;
- missing license or provenance is rejected;
- invalid promotion transitions are rejected;
- unapproved models cannot be loaded;
- public runtime download configuration is rejected;
- private keys and model binaries are not committed.

## Rollback

Rollback restores the last `recovery-ready` model and its verified runtime image digest. Rollback evidence must include the selected model version, manifest digest, image digest, operator, timestamp and reason.

## Delivery controls

All implementation changes must pass CodeQL, Security and Acceptance Gate, Docker Acceptance Gate and HURC1 IRONCLAD. This plan does not authorize public AI endpoints, public ports or autonomous writes to operational data.
