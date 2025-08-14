FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with exact versions from package-lock.json
RUN npm ci --quiet

# Copy the rest of the application
COPY . .

# Build the Next.js application for production
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set environment variable for port
ENV PORT=3000

# Start the production server on port 3000
CMD ["npm", "start", "--", "-p", "3000"]