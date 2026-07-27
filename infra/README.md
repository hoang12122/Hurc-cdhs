# Infrastructure Boundary

`infra/` owns runtime and operational infrastructure.

Allowed:

- Docker Compose, Kubernetes and infrastructure-as-code;
- network segmentation and NetworkPolicy;
- databases, brokers, object storage and telemetry services;
- PKI integration, secret-manager references and KMS/HSM contracts;
- observability, backup, restore and disaster-recovery assets;
- deployment and operational validation scripts.

Prohibited:

- production private keys, credentials or certificates;
- UI components;
- authoritative business decisions;
- undocumented public exposure or unrestricted egress;
- claims of production certification based only on local manifests or CI.

Infrastructure changes must include validation, rollback considerations and operational evidence requirements. See `docs/technical/DAY_ONE_ARCHITECTURE_BACKBONE.md`.
