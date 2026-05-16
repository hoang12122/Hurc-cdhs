# syntax=docker/dockerfile:1
# PHASE 1: Build Dependencies (Chainguard for Zero-CVE)
FROM cgr.dev/chainguard/node:latest-dev AS deps
USER root
RUN apk update && apk upgrade --no-cache && apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json* ./
# Use npm install instead of npm ci to allow resolving missing platform-specific 
# dependencies (like snappy) during build when coming from a Windows host.
RUN npm install && npm cache clean --force

# PHASE 2: Build Application
FROM cgr.dev/chainguard/node:latest-dev AS builder
USER root
RUN apk update && apk upgrade --no-cache && apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma for linux-musl (Alpine) AND linux-debian (For Distroless runner)
# Note: Distroless nodejs-debian12 is based on Debian, so we need the debian query engines.
RUN npx prisma generate --schema=prisma/ai/schema.prisma
RUN npx prisma generate --schema=prisma/auth/schema.prisma
RUN npx prisma generate --schema=prisma/metro/schema.prisma
RUN npx prisma generate --schema=prisma/ops/schema.prisma

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
RUN mkdir -p /app/logs /app/backups /app/audit_reports

# PHASE 3: Zero-CVE Production Runner (Secure Chainguard)
FROM cgr.dev/chainguard/node:latest AS runner
USER root
RUN apk update && apk upgrade --no-cache && apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy build artifacts and dependencies needed for migrations
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/scripts/container-init.ts ./src/scripts/container-init.ts

# Set permissions
RUN mkdir -p /app/data/offline /app/logs /app/backups /app/audit_reports && \
    chown -R node:node /app

USER node

EXPOSE 3000
ENV PORT 3000

    # Use the initialization script to handle migrations and start the server
    # BRUTAL HARDENING: Increase Node memory limit to 3GB to match container quota
    CMD ["node", "--max-old-space-size=3072", "-r", "tsx/register", "src/scripts/container-init.ts"]
