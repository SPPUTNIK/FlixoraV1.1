# Use Node.js 20 for better compatibility with latest packages
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies for VPS compatibility
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat \
    curl

# Set environment variables for VPS optimization
ENV NODE_ENV=production
ENV npm_config_cache=/tmp/.npm
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NPM_CONFIG_PROGRESS=false
ENV NPM_CONFIG_LOGLEVEL=warn

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies with VPS optimizations
RUN npm cache clean --force && \
    npm install --production=false --no-audit --no-fund --quiet && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]
