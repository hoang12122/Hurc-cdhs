# Vibe Coding Guardrails — Mandatory

These rules apply to every AI-generated or AI-modified change.

## 1. No arbitrary patterns

AI must not invent a new architectural pattern, directory convention, state-management style, transport layer or persistence approach unless an approved ADR explicitly authorizes it.

Before writing code, AI must identify and reuse the nearest existing pattern in the repository. When no suitable pattern exists, AI must stop implementation at the design boundary and create or update an ADR before introducing the pattern.

## 2. Layer ownership

- `frontend/` owns presentation, interaction, hooks, view models, design system and client adapters.
- `backend/` owns domain rules, application services, validation, authorization, persistence orchestration and integration contracts.
- `infra/` owns runtime topology, deployment configuration, network policy, observability, backup, PKI and disaster recovery.

Never place:

- business decisions, authorization rules, pricing, workflow transitions or data-integrity rules in frontend code;
- UI, browser-only behavior or CSS in backend code;
- business rules, approval decisions or user-facing workflow logic in infrastructure code.

## 3. Public contracts only

Cross-layer and cross-module communication must use a versioned public contract, API, event schema or adapter interface. Frontend code must not import backend internals. Infrastructure adapters must not become a hidden business-logic layer.

## 4. Migration and cutover safety

A module must not advance to `shadow`, `canary`, `migrated` or `retired` unless:

1. all required CI gates for the current head commit are successful;
2. the migration registry contains owner, public contract, characterization tests and rollback manifest;
3. the feature flag and rollback action are executable;
4. observability and comparison metrics exist;
5. an authorized reviewer approves the transition.

`shadow` must keep user traffic at 0%. It may execute only background comparison and must not become the source of record.

## 5. Required verification

Every AI-authored structural change must run:

```bash
npm run test:architecture-backbone
npm run test:safe-module-migration
npm run typecheck
npm run lint
```

Run relevant contract, security, build and smoke tests whenever the changed scope requires them.

## 6. No silent exceptions

Comments, prompts and chat approvals do not override these rules. Any exception requires a time-bounded ADR that records owner, risk, compensating controls, expiry date and removal plan.
