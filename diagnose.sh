#!/bin/bash

echo "🔍 FLIXORA VPS Diagnostic Script"
echo "================================"

echo "📋 System Information:"
echo "OS: $(uname -a)"
echo "Docker Version: $(docker --version)"
echo "Docker Compose Version: $(docker compose version)"
echo "Available Memory: $(free -h | grep ^Mem | awk '{print $2}')"
echo "Available Disk: $(df -h / | tail -1 | awk '{print $4}')"

echo ""
echo "📊 Docker Status:"
sudo systemctl status docker --no-pager -l

echo ""
echo "🐳 Docker Info:"
docker info

echo ""
echo "📦 Current Containers:"
docker ps -a

echo ""
echo "🗂️ Docker Images:"
docker images

echo ""
echo "💾 Docker Volumes:"
docker volume ls

echo ""
echo "🌐 Network Connectivity:"
echo "Testing internet connection..."
ping -c 3 google.com

echo ""
echo "📋 Environment File:"
if [ -f .env ]; then
    echo "✅ .env file exists"
    echo "Environment variables (without sensitive data):"
    grep -v "PASSWORD\|SECRET\|API_KEY" .env | head -10
else
    echo "❌ .env file not found"
fi

echo ""
echo "📋 Docker Compose File:"
if [ -f docker-compose.prod.yml ]; then
    echo "✅ docker-compose.prod.yml exists"
else
    echo "❌ docker-compose.prod.yml not found"
fi

echo ""
echo "🔍 Checking for common issues..."

# Check if ports are in use
echo "Port 80 usage:"
sudo netstat -tulpn | grep :80 || echo "Port 80 is free"

echo "Port 27017 usage:"
sudo netstat -tulpn | grep :27017 || echo "Port 27017 is free"

echo ""
echo "📋 Recent Docker logs:"
journalctl -u docker --no-pager -l -n 10

echo ""
echo "✅ Diagnostic completed!"
echo "If you see any errors above, they might explain why the containers aren't starting."
