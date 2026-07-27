# Production Certification Records, Security Commitment and Impact Assessment

**Document code:** HURC-CDHS-PROD-CERT-01  
**Applies to:** data platform, IoT, AI/MLOps, model registry and permissioned evidence ledger  
**Status:** mandatory certification package template

## 1. Purpose and assurance boundary

This document defines the records, approvals and operational evidence required before a deployment may be certified for production use.

Passing CI/CD, static analysis, dependency audit, configuration validation or invariant tests proves only that source-controlled policies and software checks are present and have executed successfully in the tested revision. CI artifacts are supporting evidence only. They do not prove that production infrastructure exists, that controls are enforced at runtime, that recovery objectives have been achieved, or that authorized parties have approved operational risk.

The approved statement before completion of this package is:

> The source code contains a production baseline and executable invariant checks; the environment has not yet received production deployment certification.

## 2. Mandatory certification dossier

Each item must identify the owner, evidence location, revision, collection time, reviewer, decision and approval signature.

| ID | Mandatory record | Minimum required content | Required approval |
|---|---|---|---|
| CERT-01 | System scope and certification boundary | environments, sites, services, data classes, excluded scope, dependencies | system owner, approving authority |
| CERT-02 | Architecture and data-flow baseline | logical/physical diagrams, trust zones, ports, protocols, external interfaces, failure domains | solution architect, security representative |
| CERT-03 | Asset and node inventory | at least three independent broker nodes/failure domains, host IDs, OS/container versions, storage, ownership | infrastructure and operations representatives |
| CERT-04 | Broker durability evidence | replication factor, minimum in-sync replicas, partition placement, quorum test, producer/consumer recovery, reconciliation | platform owner, operations representative |
| CERT-05 | PKI policy and certificate inventory | CA hierarchy, offline root controls, issuing CA, device identity mapping, validity, renewal, revocation, CRL/OCSP, certificate owners | PKI owner, security representative |
| CERT-06 | Device enrollment and revocation records | approved enrollment, hardware binding, topic ACL, suspension/revocation tests, orphan certificate checks | IoT owner, security representative |
| CERT-07 | KMS/HSM assurance record | provider and location, key IDs, non-exportable attestation, algorithm, rotation, dual control, break-glass and audit log | key custodian, security representative, approving authority |
| CERT-08 | Firewall or NetworkPolicy evidence | default-deny ingress/egress, explicit allowlists, DNS/NTP/repository exceptions, enforcement export and negative tests | network owner, security representative |
| CERT-09 | Object storage protection record | versioning, object-lock mode, retention, legal hold, deletion approval, replication, access policy | data owner, security representative |
| CERT-10 | Backup plan and inventory | covered systems, backup method, encryption, schedule, retention, off-site destination and separation of failure domains | backup owner, operations representative |
| CERT-11 | Restore test report | selected recovery point, restoration steps, measured RPO/RTO, integrity validation, unresolved exceptions | operations representative, system owner |
| CERT-12 | Failover drill report | scenario, participants, timeline, evidence, quorum behavior, consumer resumption, reconciliation, corrective actions | system owner, operations, security, approving authority |
| CERT-13 | Data-loss reconciliation report | source/target counts, offsets, checksums, duplicate/loss findings and disposition | data owner, internal reviewer |
| CERT-14 | Vulnerability and dependency assessment | SAST, CodeQL, dependency audit, container/image assessment, exceptions, remediation deadlines | security representative, system owner |
| CERT-15 | Penetration or security validation report | approved scope, methods, findings, severity, remediation and retest; no unauthorized testing | security representative, approving authority |
| CERT-16 | Secrets and privileged-access review | secret locations, access list, MFA, PAM/break-glass, rotation, dormant account review, separation of duties | IAM owner, security representative |
| CERT-17 | Logging, monitoring and alerting acceptance | security/audit sources, retention, time synchronization, alert routes, test events and response ownership | SOC/monitoring owner, operations representative |
| CERT-18 | Incident response and rollback plan | severity model, contacts, containment, evidence preservation, rollback/revocation, communication and exercises | incident commander, system owner, security representative |
| CERT-19 | AI/model release dossier | dataset provenance, feature version, metrics, bias/safety evaluation, signed manifest, checksum, human approval, rollback/revocation | model owner, data owner, security/assurance reviewer |
| CERT-20 | Privacy and data-protection assessment | data inventory, purpose, minimization, retention, access, export, deletion and applicable approvals | data protection representative, data owner |
| CERT-21 | Consortium ledger governance pack | charter, members, validator operators, endorsement policy, onboarding/removal, key custody, dispute/change process | authorized representative of each participating organization |
| CERT-22 | Operational runbooks and training | startup/shutdown, certificate rotation, backup/restore, failover, DLQ replay, incident handling and attendance records | operations owner, system owner |
| CERT-23 | Change and release approval | approved release SHA, images/digests, configuration revision, maintenance window, rollback decision and sign-off | change manager, system owner, security representative |
| CERT-24 | Residual risk acceptance | open risks, compensating controls, owner, expiry/review date and explicit acceptance/rejection | accountable risk owner, approving authority |
| CERT-25 | Final production certification record | consolidated result, conditions, expiry, restrictions and signatures | system owner, security, operations and approving authority |

## 3. Required evidence quality

Evidence is acceptable only when it is attributable, reproducible and protected against unauthorized modification.

Every record must include:

- unique document/evidence ID;
- system and environment identity;
- source revision, image digest or configuration version;
- date, time and synchronized time source;
- collector and reviewer identities;
- command, procedure or test-case reference;
- raw output or immutable evidence link;
- checksum or signed manifest where practical;
- deviations, impact and corrective-action owner;
- approval status and signature or approved electronic signature.

Screenshots without source identity, timestamps, underlying logs or reviewer attribution are not sufficient as sole evidence.

## 4. Security commitment

The system owner and delivery team commit to the following conditions:

1. No production certification will be claimed solely from CI/CD success or repository configuration.
2. Production private keys must not be committed to source control, CI variables visible to jobs, container images or unprotected filesystems.
3. Device and service identities must be uniquely attributable, revocable and restricted by least-privilege ACLs.
4. Signing keys must be non-exportable in an approved KMS/HSM and subject to separation of duties and auditable use.
5. Network communication must follow default-deny principles; public AI endpoints and unapproved runtime model downloads remain prohibited.
6. Sensitive data and large evidence payloads must remain off-chain; the ledger stores only minimum provenance and cryptographic references.
7. Backup copies must be encrypted, immutable for the approved retention period and held in an off-site failure domain.
8. Security findings, recovery-test failures, data-loss discrepancies and policy exceptions must be recorded and resolved or formally accepted before promotion.
9. Emergency access must be time-bound, logged, reviewed and revoked after use.
10. Certification must expire or be reassessed after material architecture, PKI, KMS/HSM, network, data-classification, consortium-membership or recovery-design changes.

## 5. Security and operational impact assessment

The impact assessment must be completed before approval and repeated after material change.

### 5.1 Confidentiality impact

Assess unauthorized disclosure of credentials, device identities, operational telemetry, maintenance records, model artifacts, personal data and consortium metadata. Document encryption, access controls, data minimization, logging and breach-response measures.

### 5.2 Integrity impact

Assess false telemetry, replay, duplicate events, model/artifact tampering, unauthorized ledger writes, altered evidence and configuration drift. Document signatures, checksums, idempotency, schema validation, approval gates, immutable storage and reconciliation controls.

### 5.3 Availability and safety impact

Assess loss of broker quorum, CA/KMS/HSM outage, network-policy errors, storage unavailability, backup failure, model-service failure and validator loss. Record degraded modes, operational safety consequences, RPO/RTO, rollback, manual fallback and escalation criteria.

### 5.4 Privacy and legal impact

Assess collection purpose, legal/organizational authority, data retention, cross-boundary transfer, right of access/deletion where applicable, evidence admissibility and consortium obligations. Legal or data-protection approval is mandatory where required.

### 5.5 Business and service impact

Record affected services, users, stations/assets, maximum tolerable outage, financial/contractual exposure, reporting obligations, operational workarounds and dependencies on third parties.

### 5.6 Supply-chain impact

Record images, packages, firmware, model sources, repositories, signatures, SBOM/provenance where available, vulnerability exposure and contingency for unavailable or compromised suppliers.

### 5.7 Residual-risk decision

Each unresolved risk must state likelihood, impact, current controls, compensating controls, owner, due date, review date and approval decision. High or critical residual risk may not be implicitly accepted by merging code or passing CI.

## 6. Minimum acceptance gates

Production certification must be rejected or conditionally withheld when any of the following applies:

- fewer than three independent broker nodes or no verified failure-domain separation;
- replication/quorum behavior has not been tested;
- production CA, revocation process or certificate inventory is absent;
- signing keys are exportable or KMS/HSM evidence is missing;
- default-deny firewall/NetworkPolicy is not enforced or negative-tested;
- off-site immutable backup is absent;
- restore or failover drill has not met approved RPO/RTO;
- unexplained data loss, duplicate evidence or checksum mismatch exists;
- critical/high security findings remain without approved treatment;
- consortium membership or endorsement governance lacks signed approval;
- required signatures are missing.

## 7. Failover and restore minutes — required fields

The signed minutes must contain:

- record ID and test date/time;
- environment and certified revision;
- scenario, assumptions and success criteria;
- participating teams and decision authority;
- pre-test health, offsets, counts and checksums;
- actions and exact timeline;
- observed service behavior and alarms;
- measured outage, RPO and RTO;
- post-recovery reconciliation and data-loss result;
- security and safety impact;
- deviations and corrective actions;
- evidence attachments and checksums;
- conclusion: pass, conditional pass or fail;
- names, roles, signatures and signing time of system owner, operations, security and approving authority.

## 8. CI artifacts as supporting evidence

Permitted CI supporting artifacts include workflow logs, build logs, test reports, dependency-audit reports, CodeQL output, compose validation, model-registry tamper tests and resilience invariant reports.

They support traceability to a source revision, but they do not replace:

- independent production machines or failure domains;
- real CA/PKI issuance and revocation;
- real KMS/HSM key attestation;
- enforced firewall or NetworkPolicy exports and tests;
- off-site immutable backup records;
- executed restore and failover drills;
- operational reconciliation;
- legal, organizational or consortium approvals;
- signed acceptance by accountable authorities.

## 9. Certification decision and validity

The final decision must identify the approved environment, revision, scope, restrictions, residual risks, certification date, expiry/review date and events requiring reassessment.

At minimum, reassessment is required after changes to cluster topology, failure domains, CA hierarchy, certificate policy, KMS/HSM, network boundaries, backup destination, data classification, model-signing workflow, validator membership or endorsement policy.
