FROM node:20-alpine

WORKDIR /usr/src/app

# Install system dependencies for VPS compatibility
RUN apk add --no-cache \
    libc6-compat \
    curl

# Set environment variables for VPS optimization
ENV NODE_ENV=production
ENV npm_config_cache=/tmp/.npm
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NPM_CONFIG_PROGRESS=false
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with VPS optimizations
RUN npm cache clean --force && \
    npm ci --production=false --no-audit --no-fund --quiet && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]