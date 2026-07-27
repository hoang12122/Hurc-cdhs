# Architecture Backbone — Mandatory Rules

These rules apply to every human and AI-authored change.

## Backbone

The project architecture is organized around:

- `frontend/`: user interface and client concerns;
- `backend/`: domain, application, API and persistence concerns;
- `infra/`: runtime infrastructure, networking, data services, PKI, observability, backup and disaster recovery;
- `.claude/rules/`: mandatory project policies for humans and AI agents.

The existing `src/` Next.js modular monolith remains supported during controlled migration. New independently deployable or clearly separated components must use the backbone directories.

## Mandatory dependency direction

```text
frontend -> public API/contracts -> backend -> infrastructure adapters/configuration
```

Never:

- import backend internals from frontend;
- access databases, secret stores, brokers or private keys from frontend code;
- import UI/browser modules into backend code;
- place business decision logic in infrastructure manifests or scripts;
- commit production credentials, certificates, private keys or tokens;
- bypass public contracts for cross-module communication;
- create a generic dumping-ground `shared/` directory.

## Required design steps

Before implementing a feature:

1. identify its bounded context and owner;
2. choose the correct backbone directory;
3. define API/event contracts and versioning;
4. identify security, data and operational impacts;
5. define tests and rollback/migration behavior;
6. record an ADR for any approved architecture exception.

## Review requirements

Changes to directory boundaries, public contracts, infrastructure topology or these rules require architecture review. CI evidence supports review but does not replace human approval or operational validation.
