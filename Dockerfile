# ─── Build Stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source
COPY . .

# Build frontend
RUN npm run build

# ─── Production Stage ────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy package files and install production deps only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server source
COPY server.ts ./
COPY src/lib/groq.ts ./src/lib/groq.ts
COPY src/lib/newsdata.ts ./src/lib/newsdata.ts
COPY src/lib/elevenlabs.ts ./src/lib/elevenlabs.ts

# Expose port
EXPOSE 3001

# Start production server
CMD ["npx", "tsx", "server.ts"]
