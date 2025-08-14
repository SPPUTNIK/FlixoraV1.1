#!/bin/bash

echo "🚀 FLIXORA VPS Deployment Script (Ubuntu 24.04 + Docker 27.5.1)"
echo "================================================================"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Starting Docker..."
        sudo systemctl start docker
        sudo systemctl enable docker
        sleep 5
    fi
}

# Function to check Node.js version in backend
check_node_version() {
    echo "📋 Checking Node.js version in backend container..."
    docker run --rm node:18-alpine node --version
}

# Function to clean up old containers and images
cleanup_docker() {
    echo "🧹 Cleaning up old Docker resources..."
    docker compose -f docker-compose.prod.yml down -v --remove-orphans 2>/dev/null || true
    docker system prune -f
    docker volume prune -f
}

# Function to fix npm issues
fix_npm_issues() {
    echo "🔧 Applying npm fixes for VPS environment..."
    
    # Set npm cache directory
    export npm_config_cache=/tmp/.npm
    
    # Set Node.js memory limit for build
    export NODE_OPTIONS="--max-old-space-size=2048"
}

# Main deployment function
deploy() {
    echo "🚀 Starting FLIXORA deployment..."
    
    # Check Docker
    check_docker
    
    # Check Node.js
    check_node_version
    
    # Apply fixes
    fix_npm_issues
    
    # Clean up
    cleanup_docker
    
    # Build with no cache and verbose output
    echo "🔨 Building containers (this may take several minutes)..."
    docker compose -f docker-compose.prod.yml build --no-cache --progress=plain
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Trying with legacy Docker build..."
        export DOCKER_BUILDKIT=0
        export COMPOSE_DOCKER_CLI_BUILD=0
        docker compose -f docker-compose.prod.yml build --no-cache
    fi
    
    # Start services
    echo "▶️ Starting services..."
    docker compose -f docker-compose.prod.yml up -d
    
    # Wait for services
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    # Check status
    echo "📊 Container status:"
    docker compose -f docker-compose.prod.yml ps
    
    # Check logs for errors
    echo "📋 Recent logs:"
    echo "--- Backend Logs ---"
    docker compose -f docker-compose.prod.yml logs --tail=10 backend
    
    echo "--- Frontend Logs ---"
    docker compose -f docker-compose.prod.yml logs --tail=10 frontend
    
    # Test endpoints
    echo "🧪 Testing endpoints..."
    sleep 5
    
    echo "Testing frontend..."
    curl -I http://flixora.uk:80 2>/dev/null | head -3
    
    echo "Testing backend API..."
    curl -s http://flixora.uk:80/api/health | head -3
}

# Run deployment
deploy

echo ""
echo "✅ Deployment completed!"
echo "🌐 Access your website at: http://flixora.uk"
echo "🔧 API endpoint: http://flixora.uk/api"
echo ""
echo "If you encounter issues, check logs with:"
echo "docker compose -f docker-compose.prod.yml logs -f [service-name]"
