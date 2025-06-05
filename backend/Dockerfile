# syntax=docker.io/docker/dockerfile:1

FROM node:22.16.0-alpine3.22 AS base

LABEL authors="apple"

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat dumb-init

WORKDIR /app

# Enable pnpm and install dependencies
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm i

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN corepack enable pnpm && pnpm prisma generate

# Build the NestJS application
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run NestJS
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy package files for production dependencies installation
COPY package.json pnpm-lock.yaml* .npmrc* ./
COPY .env.example .env

# Install only production dependencies
RUN corepack enable pnpm && pnpm i --prod && pnpm store prune

# Copy built application and generated Prisma client
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/generated/prisma ./generated/prisma

# Copy Prisma schema for potential migrations
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma


# Change to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health.js || exit 1

# Use dumb-init to handle signals properly and start the application
ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "yes | npx prisma@6.8.2 migrate deploy && node dist/main.js"]