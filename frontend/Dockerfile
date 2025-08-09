FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with exact versions from package-lock.json
RUN npm ci --quiet

# Copy the rest of the application
COPY . .

# Expose port 3000
EXPOSE 3000

# Serve on all network interfaces
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]