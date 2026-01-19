# ============================================================================
# Build stage
# ============================================================================
FROM node:22-slim AS builder

WORKDIR /app

# Required for native dependencies
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Harden npm (still good practice)
RUN npm config set audit false \
 && npm config set fund false \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./

# ✅ THIS WILL WORK
RUN npm ci

COPY . .
RUN npm run build


# ============================================================================
# Runtime stage
# ============================================================================
FROM node:22-slim AS production

WORKDIR /app
ENV NODE_ENV=production

# Non-root user
RUN useradd -m appuser

COPY --from=builder /app/dist ./dist

RUN npm install -g serve && npm cache clean --force

USER appuser

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
