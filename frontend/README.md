# Frontend Boundary

`frontend/` owns user-interface and browser/client concerns.

Allowed:

- app/page shells;
- UI components and design system;
- feature hooks and view-models;
- client API adapters using public contracts;
- accessibility and frontend tests.

Prohibited:

- direct database access;
- broker or infrastructure administration;
- production credentials, certificates or private keys;
- imports from backend implementation internals;
- authoritative business decisions that belong in backend services.

The existing Next.js code under `src/` remains supported during controlled migration. New frontend features should follow the structure defined in `docs/technical/DAY_ONE_ARCHITECTURE_BACKBONE.md`.
