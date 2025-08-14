# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies for better compatibility
RUN apk add --no-cache python3 make g++

# Set npm configuration
ENV npm_config_cache=/tmp/.npm
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Copy package files first (for better caching)
COPY package*.json ./

# Clear npm cache and install all dependencies (including dev dependencies for build)
RUN npm cache clean --force && \
    npm install --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["node", "dist/main"]
