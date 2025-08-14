#!/bin/bash

echo "🛑 Stopping FLIXORA..."

# Stop all containers
docker compose -f docker-compose.prod.yml down

echo "✅ FLIXORA stopped successfully!"
