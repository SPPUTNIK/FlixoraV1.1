#!/bin/bash

echo "🚀 FLIXORA Production Deployment Fix Script"
echo "==========================================="

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root or with sudo"
    exit 1
fi

echo "📋 Step 1: Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down -v --remove-orphans

echo "📋 Step 2: Cleaning up Docker resources..."
docker system prune -f
docker volume prune -f

echo "📋 Step 3: Building fresh images with no cache..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "📋 Step 4: Starting services with HTTP-only configuration..."
docker-compose -f docker-compose.prod.yml up -d

echo "📋 Step 5: Waiting for services to start..."
sleep 30

echo "📋 Step 6: Checking container status..."
docker-compose -f docker-compose.prod.yml ps

echo "📋 Step 7: Checking logs for errors..."
echo "--- Frontend Logs ---"
docker-compose -f docker-compose.prod.yml logs frontend | tail -20

echo "--- Backend Logs ---"
docker-compose -f docker-compose.prod.yml logs backend | tail -20

echo "--- Database Logs ---"
docker-compose -f docker-compose.prod.yml logs db | tail -20

echo "--- Nginx Logs ---"
docker-compose -f docker-compose.prod.yml logs nginx | tail -20

echo "📋 Step 8: Testing connectivity..."
echo "Testing frontend (should return HTML):"
curl -I http://localhost:80 2>/dev/null | head -5

echo "Testing backend health (should return JSON):"
curl -s http://localhost:80/api/health 2>/dev/null | head -3

echo "📋 Step 9: Verifying MongoDB connection..."
docker exec -it db mongo --eval "db.runCommand({connectionStatus: 1})" 2>/dev/null | grep -E "(ok|authenticated)"

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📊 Quick Status Check:"
echo "====================="
echo "Frontend: http://abdessamad.com"
echo "Backend API: http://abdessamad.com/api"
echo ""
echo "If everything looks good, you can set up SSL with:"
echo "./setup-ssl.sh"
echo ""
echo "To view live logs, run:"
echo "docker-compose -f docker-compose.prod.yml logs -f [service-name]"
