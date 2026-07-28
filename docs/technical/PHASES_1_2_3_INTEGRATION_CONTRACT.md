# Phases 1–2–3 Integration Contract

Related roadmap: #62. Source PRs: #63, #64 and #65.

## Runtime decision algorithm

The integrated runtime is fail-closed. It returns `ALLOW` only when all three gates are true in the same correlated evaluation:

1. **Phase 1 — model trust**
   - model status is `approved` or `recovery-ready`;
   - signature, SHA-256, SHA-512 and SBOM are verified;
   - model alias/version and manifest digest are recorded.
2. **Phase 2 — network isolation**
   - deny-by-default is active;
   - public DNS and representative public IP access are blocked;
   - no public AI ports exist;
   - runtime model download is blocked;
   - only approved internal services are present in the allowlist.
3. **Phase 3 — governed memory**
   - namespace contains user, role and domain;
   - provenance is present;
   - human approval policy is enforced;
   - cross-namespace access is denied;
   - autonomous writes to operational data are denied.

Any failed or missing phase produces `DENY`; no degraded permissive mode exists.

## Correlation and evidence

Every evaluation has one `correlationId`, timestamp and SHA-256 evidence digest. The evidence links:

- selected model manifest;
- active network-policy digest and allowlist;
- memory namespace, type, TTL and approval identifier;
- individual phase gate outcomes.

## Ordered startup

1. Verify and select the approved model.
2. Apply and verify deny-by-default egress controls.
3. Authorize the governed memory namespace.
4. Evaluate the integrated policy.
5. Start the AI runtime only after an `ALLOW` decision.

## Ordered rollback

Rollback is executed in the reverse safety order:

1. revoke the memory session and block new writes;
2. apply network deny and terminate active AI connections;
3. select the last `recovery-ready` model or keep the runtime stopped.

Rollback must never enable public AI access, runtime downloads or autonomous operational writes.

## CI proof

`npm run test:phase-integration` verifies:

- valid evidence produces `ALLOW`;
- quarantine/unverified models produce `DENY`;
- open public egress produces `DENY`;
- missing namespace/provenance produces `DENY`;
- autonomous operational writes produce `DENY`;
- rollback order is Memory → Network → Model.
