# HURC1-CRM Project Guide

Professional technical management and maintenance system for Metro infrastructure.

## Build/Dev Commands

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck` or `npx tsc --noEmit`
- **Database Migration**: `npm run migrate` (JSON to PostgreSQL)

## Technology Stack

- **Frontend**: Next.js 14, Tailwind CSS, Radix UI (shadcn/ui)
- **Backend/ORM**: Prisma with multiple PostgreSQL databases (Auth, Ops, AI, Metro)
- **Caching**: Redis
- **Logging**: Winston with Grafana Loki integration
- **AI**: Google Gemini/Nemotron (NemoClaw Client), TrustGraph RAG, Local YOLOv8

## Coding Standards

- **Server Actions**: All data mutations MUST happen in Server Actions. Use `@/lib/actions`.
- **Services**: Business logic must reside in `@/lib/services`.
- **Database Safety**: Always handle `IS_DATABASE_OFFLINE` flag by falling back to `json-db-service`.
- **Logging**: Use `@/lib/services/log-service` for all critical operations.
- **Security**: Never expose raw database IDs or internal credentials in client components.
- **DB Wrapper**: Use `db-wrapper.ts` for all AI-related database operations. Fixed location: `src/lib/services/db-wrapper.ts`.

## AI Constraints

- **Role**: You are a Technical Advisor, not a direct executor unless asked.
- **Verification**: Always verify paths using `PathValidator` before reading/writing files.
- **Safety**: Do not read `.env`, `node_modules`, `.next`, or `.git`.
