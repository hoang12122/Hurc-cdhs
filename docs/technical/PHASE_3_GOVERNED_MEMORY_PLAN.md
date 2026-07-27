# Phase 3 — Governed Long-Term Memory

Related roadmap: #62

## Objective

Establish a fail-closed long-term memory layer for AI-assisted workflows. No model output becomes durable truth unless it passes schema validation, namespace authorization, provenance requirements and human approval policy.

## Memory classes

The only supported classes are:

- `episodic`: event, timestamp, responsible party and outcome;
- `semantic`: verified regulation, document or asset characteristic;
- `decision`: decision, rationale, approver and effective period;
- `task`: work item, deadline, dependency and status;
- `preference`: user presentation or workflow preference without secrets.

## Namespace contract

Every record must include:

- `userId`;
- `roleId`;
- `domain`;
- a deterministic namespace key derived from those values;
- access policy metadata.

Cross-user, cross-role or cross-domain retrieval is denied unless an explicit policy grants it.

## Provenance and trust

Every record must include:

- source type and source reference;
- source digest where applicable;
- confidence score;
- schema version;
- record version;
- creation and update timestamps;
- TTL or explicit retention class;
- supersession pointer when replaced;
- human approval state and approver identity when approval is required.

Unverified AI output must remain transient and cannot be promoted to durable memory automatically.

## Lifecycle

Allowed lifecycle states:

`transient -> proposed -> reviewed -> approved -> active -> superseded -> deleted`

State skipping is prohibited. Deletion is soft-delete first, requires an audit reason and must preserve immutable audit evidence. Hard deletion requires retention-policy authorization.

## Controlled forgetting

The system must support:

- TTL expiry;
- policy-driven deletion;
- user-authorized forgetting where legally and operationally allowed;
- supersession without loss of audit history;
- audit reports for create, review, approve, activate, retrieve, supersede and delete actions.

## Security invariants

- No secret material in preference memory.
- No autonomous write to operational source-of-truth systems.
- No cross-namespace retrieval by default.
- No durable record without provenance.
- No AI-generated fact promoted directly to `active`.
- No hard delete without explicit retention authorization.

## Acceptance tests

CI must prove:

- valid records pass schema validation;
- missing provenance is rejected;
- invalid memory classes are rejected;
- cross-namespace retrieval is denied;
- AI-originated records cannot bypass human approval;
- TTL expiry and supersession work correctly;
- delete/forget operations produce auditable evidence;
- secret-like values are rejected from preference memory.

## Delivery controls

All implementation changes must pass CodeQL, Security and Acceptance Gate, Docker Acceptance Gate and HURC1 IRONCLAD. This plan does not authorize public AI endpoints, public ports, runtime model downloads or autonomous writes to operational data.
