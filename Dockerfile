# Build
FROM node:24-alpine AS builder
WORKDIR /app

# Copy 

COPY package*.json ./
RUN npm install
COPY . .

# Prisma
RUN npx prisma generate

# Build
RUN npm run build

# Run
FROM node:24-alpine AS runner
WORKDIR /app

# Add group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

USER appuser

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]