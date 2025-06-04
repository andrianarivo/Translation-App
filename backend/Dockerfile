# syntax=docker.io/docker/dockerfile:1

FROM node:22.16.0-alpine3.22 AS base

LABEL authors="apple"

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat dumb-init

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN \
  if [ -f yarn.lock ]; then yarn prisma generate; \
  elif [ -f package-lock.json ]; then npm run prisma:generate || npx prisma@6.8.2 generate; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm prisma generate; \
  else npx prisma@6.8.2 generate; \
  fi

# Build the NestJS application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else npm run build; \
  fi

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
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
COPY .env.example .env

# Install only production dependencies based on package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --production && yarn cache clean; \
  elif [ -f package-lock.json ]; then npm ci --only=production && npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --prod && pnpm store prune; \
  else echo "Lockfile not found." && exit 1; \
  fi

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