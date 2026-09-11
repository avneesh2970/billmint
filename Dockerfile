# ==========================================
# BILLMINT BACKEND SERVICE DOCKERFILE
# ==========================================
FROM node:20-alpine AS base

WORKDIR /app

# Copy root package manifests
COPY package*.json ./
COPY packages ./packages
COPY services ./services

# Install dependencies
RUN npm ci --only=production

# Expose backend port
EXPOSE 5000

# Set default Node environment
ENV NODE_ENV=production

# Start backend services engine
CMD ["node", "services/start-all-services.js"]
