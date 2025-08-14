# Use Node.js 20 for better compatibility with latest packages
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1024"

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

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod"]
