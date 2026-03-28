# Giai đoạn 1: Cài đặt Dependencies và Build
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Giai đoạn 2: Production Image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Sao chép các tệp đã được tối ưu hóa từ giai đoạn builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/db.json ./db.json
COPY --from=builder /app/db.backup.json ./db.backup.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Lệnh để chạy ứng dụng ở chế độ standalone
CMD ["node", "server.js"]
