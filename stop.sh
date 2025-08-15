#!/bin/bash

echo "🛑 Stopping FLIXORA..."
docker compose -f docker-compose.prod.yml down
echo "✅ Stopped!"
