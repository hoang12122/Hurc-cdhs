# Phase 2 — AI Infrastructure Egress Control

Related roadmap: #62

## Objective

Enforce deny-by-default network access for AI runtimes. AI services may communicate only with approved internal dependencies: TrustGraph, Ollama/NemoClaw, PostgreSQL and explicitly approved internal services.

## Docker controls

- AI services must run only on private internal networks.
- No AI service may publish ports on `0.0.0.0`, `::` or an external interface.
- Published ports, where strictly required for local administration, must bind to `127.0.0.1` only.
- External networks are prohibited for AI services.
- DNS must resolve through approved internal infrastructure only.

## Kubernetes controls

- Apply default-deny ingress and egress NetworkPolicy to AI namespaces.
- Add explicit egress allow rules only for TrustGraph, Ollama/NemoClaw, PostgreSQL, kube-dns/internal DNS and approved internal service namespaces.
- Public CIDRs and unrestricted `0.0.0.0/0` egress are prohibited.
- AI workloads must not use `hostNetwork`, privileged mode or unrestricted host ports.

## Host firewall contract

- Host firewall policy for AI container bridges must be deny-by-default.
- Only approved internal destination CIDRs and ports may be accepted.
- Forwarding from AI networks to public interfaces must be dropped.
- Rules must be idempotent, auditable and reversible.

## Verification evidence

CI/staging must prove:

- public DNS lookups from the AI runtime fail;
- direct connections to representative public IPs fail;
- approved internal service names and ports remain reachable in the test fixture;
- no AI service publishes a public port;
- Docker Compose and Kubernetes manifests do not contain unrestricted egress;
- rollback restores the previous audited firewall policy without enabling public AI access.

## Safety boundaries

- Tests run only in CI/staging fixtures.
- No production exploitation or external scanning.
- No destructive writes to operational data.
- No automatic relaxation of policy when a dependency is unreachable.

## Delivery controls

All implementation changes must pass CodeQL, Security and Acceptance Gate, Docker Acceptance Gate and HURC1 IRONCLAD before merge.
