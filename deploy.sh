#!/bin/bash

# VPS Deployment Script for FlixoraV1.1

echo "🚀 Starting deployment to VPS..."

# Set environment variables
export NODE_ENV=production

# Add missing environment variables that might be needed
echo "📝 Adding missing environment variables to .env file..."

# Check if .env file has all required variables
if ! grep -q "MONGO_INITDB_ROOT_USERNAME" .env; then
    echo "MONGO_INITDB_ROOT_USERNAME=admin" >> .env
fi

if ! grep -q "MONGO_INITDB_ROOT_PASSWORD" .env; then
    echo "MONGO_INITDB_ROOT_PASSWORD=securepassword123" >> .env
fi

if ! grep -q "MONGO_INITDB_DATABASE" .env; then
    echo "MONGO_INITDB_DATABASE=hypertube" >> .env
fi

if ! grep -q "MONGO_APP_USER" .env; then
    echo "MONGO_APP_USER=hypertubeUser" >> .env
fi

if ! grep -q "MONGO_APP_PASSWORD" .env; then
    echo "MONGO_APP_PASSWORD=appPass" >> .env
fi

if ! grep -q "MONGO_APP_DATABASE" .env; then
    echo "MONGO_APP_DATABASE=hypertube" >> .env
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Remove old images (optional - uncomment if you want to rebuild from scratch)
# echo "🗑️ Removing old images..."
# docker system prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Show status
echo "📊 Container status:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
echo "🌐 Your website should be available at:"
echo "   - Frontend: https://abdessamad.com"
echo "   - API: https://api.abdessamad.com"
echo ""
echo "📋 Next steps:"
echo "1. Configure DNS records to point to your VPS IP"
echo "2. Install SSL certificates using certbot"
echo "3. Test your deployment"
