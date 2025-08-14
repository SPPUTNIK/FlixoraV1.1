#!/bin/bash

echo "🚀 Starting FLIXORA on flixora.uk..."

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Start the services
echo "▶️ Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 15

# Show status
echo "📊 Container status:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "✅ FLIXORA is running!"
echo "🌐 Access your website at: http://flixora.uk"
echo "🔧 API endpoint: http://flixora.uk/api"
echo ""
echo "To stop the services, run:"
echo "docker compose -f docker-compose.prod.yml down"
