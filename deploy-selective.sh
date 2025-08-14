#!/bin/bash

# VPS Deployment Script for FlixoraV1.1 - Selective Restart

echo "🚀 Starting selective deployment..."

# Set environment variables
export NODE_ENV=production

# Add missing environment variables to .env file
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

# Check if this is first deployment
if ! docker ps -q -f name=nginx > /dev/null 2>&1; then
    echo "🆕 First deployment - starting all containers..."
    docker-compose -f docker-compose.prod.yml up -d --build
else
    echo "🔄 Updating existing deployment..."
    
    # Only restart backend and frontend, keep nginx running
    echo "🛑 Stopping backend and frontend..."
    docker-compose -f docker-compose.prod.yml stop backend frontend
    
    echo "🔨 Building and starting backend and frontend..."
    docker-compose -f docker-compose.prod.yml up -d --build backend frontend
    
    echo "ℹ️ Nginx continues running without interruption"
fi

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
