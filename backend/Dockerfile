# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Start the app
CMD ["node", "dist/main"]
