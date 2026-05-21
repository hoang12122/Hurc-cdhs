# syntax=docker/dockerfile:1

FROM cgr.dev/chainguard/node:latest-dev AS deps
USER root
WORKDIR /app
COPY package*.json ./
COPY scripts ./scripts
RUN npm ci --legacy-peer-deps

FROM cgr.dev/chainguard/node:latest-dev AS builder
USER root
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_ENV_VALIDATION true
ENV NODE_ENV production
RUN npx prisma generate --schema=prisma/ai/schema.prisma
RUN npx prisma generate --schema=prisma/auth/schema.prisma
RUN npx prisma generate --schema=prisma/metro/schema.prisma
RUN npx prisma generate --schema=prisma/ops/schema.prisma
RUN npx tsc src/scripts/container-init.ts --esModuleInterop --skipLibCheck --outDir ./dist-init
RUN npm run build

FROM cgr.dev/chainguard/node:latest AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
USER root
# Install runtime dependencies for the init script (prisma)
RUN npm install -g prisma
RUN mkdir -p /app/data/offline /app/logs /app/backups /app/audit_reports && chown -R node:node /app

USER node
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Explicitly copy files needed for initialization
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist-init ./dist-init
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT 3000
# Run the compiled init script directly with Node
CMD ["node", "--max-old-space-size=3072", "dist-init/container-init.js"]
