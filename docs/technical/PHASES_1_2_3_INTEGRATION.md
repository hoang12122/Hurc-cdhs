# Integration Contract — Phases 1, 2 and 3

Related roadmap: #62

## Objective

Link the internal model supply chain, infrastructure egress controls and governed long-term memory into one fail-closed execution path.

## Execution algorithm

1. Resolve a requested model alias and version from the signed internal registry.
2. Verify Ed25519 signature, SHA-256, SHA-512, license, provenance, runtime compatibility and promotion state.
3. Require the model to be `approved` or `recovery-ready`.
4. Bind the verified model digest to an approved AI runtime image and SBOM digest.
5. Start the runtime only inside the Phase 2 restricted network profile.
6. Verify no public port, public DNS or public IP egress is available.
7. Allow only approved internal dependencies: TrustGraph, Ollama/NemoClaw, PostgreSQL, internal DNS and explicitly approved services.
8. Build the Phase 3 memory namespace from user, role and domain.
9. Authorize memory access before retrieval or write.
10. Require provenance, confidence, version, TTL and human approval where policy requires it.
11. Reject unverified AI output as long-term truth.
12. Emit an immutable execution evidence record linking model digest, runtime image digest, network policy digest, memory namespace, authorization decision and operator/request identity.

## Fail-closed conditions

Execution must stop when any of the following occurs:

- unsigned or tampered model manifest;
- checksum mismatch or missing license/provenance;
- model not approved;
- missing or invalid SBOM binding;
- runtime outside the restricted network profile;
- public port or public egress detected;
- unauthorized cross-namespace memory access;
- memory write without provenance or required approval;
- autonomous write to operational data.

## Rollback chain

Rollback must:

1. select the last `recovery-ready` model;
2. restore its verified runtime image and SBOM binding;
3. preserve the deny-by-default network policy;
4. avoid reopening public AI access;
5. keep existing governed-memory audit evidence immutable;
6. mark superseded memory records rather than silently overwriting them;
7. emit one linked rollback evidence record.

## Delivery controls

The integration proof must run in CI and pass CodeQL, Security and Acceptance Gate, Docker Acceptance Gate and HURC1 IRONCLAD. The integration does not authorize public AI endpoints, runtime model downloads or autonomous writes to operational data.
