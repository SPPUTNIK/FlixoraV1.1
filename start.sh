#!/bin/bash

echo "🚀 Starting FLIXORA..."

docker compose -f docker-compose.prod.yml up -d

echo "✅ FLIXORA is running!"
echo "🌐 Visit: http://flixora.uk"
