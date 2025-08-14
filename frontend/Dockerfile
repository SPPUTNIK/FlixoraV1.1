FROM node:18-alpine

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Set npm configuration
ENV npm_config_cache=/tmp/.npm
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Copy package files
COPY package.json package-lock.json* ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm ci --only=production --no-audit --no-fund

# Copy the rest of the application
COPY . .

# Build the Next.js application for production
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set environment variable for port
ENV PORT=3000

# Start the production server
CMD ["npm", "start"]