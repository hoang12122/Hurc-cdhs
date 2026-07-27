# Backend Boundary

`backend/` owns domain, application, API, persistence and integration concerns.

Allowed:

- domain models and policies;
- application services and use cases;
- API endpoints and input validation;
- persistence and external-system adapters;
- public contracts, event schemas and backend tests.

Prohibited:

- UI components, CSS or browser-only runtime logic;
- exposing secret material to clients;
- importing frontend implementation details;
- hiding infrastructure topology inside business logic;
- bypassing approved integration gateways or public contracts.

The existing server-side code under `src/` remains supported during controlled migration. New backend services should follow the structure defined in `docs/technical/DAY_ONE_ARCHITECTURE_BACKBONE.md`.
