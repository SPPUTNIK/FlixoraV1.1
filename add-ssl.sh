#!/bin/bash

# Super simple SSL setup
echo "🔐 Adding SSL to flixora.uk..."

# Create SSL directories
mkdir -p certbot/{conf,www}

# Start your app normally
docker compose -f docker-compose.prod.yml up -d

# Get SSL certificate
echo "Getting SSL certificate..."
docker compose -f docker-compose.prod.yml --profile ssl run --rm certbot

# Restart nginx to use the new certificate
docker compose -f docker-compose.prod.yml restart nginx

echo "✅ Done! Your site should now work with HTTPS"
echo "🌐 Check: https://flixora.uk"
