# syntax=docker/dockerfile:1

# Stage 1: Dependencies
FROM cgr.dev/chainguard/node:latest-dev AS deps
USER root
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: Builder
FROM cgr.dev/chainguard/node:latest-dev AS builder
USER root
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Environment Guard
ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION true
ENV NODE_ENV production

# Generate Prisma Clients
RUN npx prisma generate --schema=prisma/ai/schema.prisma
RUN npx prisma generate --schema=prisma/auth/schema.prisma
RUN npx prisma generate --schema=prisma/metro/schema.prisma
RUN npx prisma generate --schema=prisma/ops/schema.prisma

# Build Application
RUN npm run build

# Stage 3: Runner
FROM cgr.dev/chainguard/node:latest AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create persistent directories and fix permissions
USER root
RUN mkdir -p /app/data/offline /app/logs /app/backups /app/audit_reports && \
    chown -R node:node /app

USER node

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# BRUTAL HARDENING: Increase Node memory limit to 3GB
CMD ["node", "--max-old-space-size=3072", "-r", "tsx/register", "src/scripts/container-init.ts"]
