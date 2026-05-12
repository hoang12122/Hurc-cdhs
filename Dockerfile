# PHASE 1: Build Dependencies (Alpine for nimbleness)
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl && apk upgrade --no-cache
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# PHASE 2: Build Application
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl && apk upgrade --no-cache
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

# PHASE 3: Zero-CVE Production Runner (Distroless)
# Using gcr.io/distroless/nodejs22-debian12 (Debian-based distroless)
FROM gcr.io/distroless/nodejs22-debian12 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Distroless images come with a 'nonroot' user (UID 65532) by default.
# We will copy the standalone build and static assets.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static
COPY --from=builder /app/db.json ./db.json
COPY --from=builder /app/db.backup.json ./db.backup.json

# Use the built-in nonroot user for execution
USER 65532

EXPOSE 3000
ENV PORT 3000

# Lệnh để chạy ứng dụng ở chế độ standalone
# Command must be in exec form as there is no shell
CMD ["server.js"]
