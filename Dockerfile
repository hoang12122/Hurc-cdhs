# syntax=docker/dockerfile:1

FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
COPY scripts ./scripts
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
      npm ci --legacy-peer-deps --ignore-scripts; \
    else \
      npm install --legacy-peer-deps --ignore-scripts; \
    fi

FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production
ENV SKIP_PREFLIGHT=true
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_PUBLIC_SETUP_COMPLETE=true
ENV SESSION_SECRET=docker_build_placeholder
ENV AUTH_DATABASE_URL=postgresql://build:placeholder@localhost:5432/auth
ENV AI_DATABASE_URL=postgresql://build:placeholder@localhost:5432/ai
ENV METRO_DATABASE_URL=postgresql://build:placeholder@localhost:5432/metro
ENV OPS_DATABASE_URL=postgresql://build:placeholder@localhost:5432/ops
ENV DATABASE_URL=postgresql://build:placeholder@localhost:5432/main
RUN npm run db:validate:all
RUN npm run import:gis-bim:dry-run
RUN npm run build
RUN npx tsc -p tsconfig.init.json && cp src/scripts/register.js ./dist-init/register.js || true

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install Python3 for AI Lab modules
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip python3-venv ca-certificates && rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
# Install Python packages using a virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir -r requirements.txt

# Install runtime dependencies for the init script (prisma)
RUN npm install -g prisma@5.22.0
RUN mkdir -p /app/data/offline /app/data/import /app/logs /app/backups /app/audit_reports

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist-init ./dist-init
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/.prisma-runtime ./.prisma-runtime
COPY --from=builder /app/src/lib/ai ./src/lib/ai
COPY --from=builder /app/data/import ./data/import

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(async r => { const j = await r.json(); process.exit(r.ok && j.status === 'healthy' ? 0 : 1); }).catch(() => process.exit(1))"

# Start server
CMD ["node", "server.js"]
