#!/bin/bash

#!/bin/bash

# SSL Setup Script for Flixora
# This script automates the entire SSL certificate process

DOMAIN="flixora.uk"
EMAIL="bakihanma02@proton.me"  # Change this to your email

echo "� Setting up SSL for $DOMAIN..."

# Step 1: Start services with HTTP-only config
echo "📋 Starting services with HTTP-only configuration..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Step 2: Get SSL certificate
echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Step 3: Switch to HTTPS configuration
    echo "🔄 Switching to HTTPS configuration..."
    
    # Update docker-compose to use HTTPS config
    sed -i 's|nginx-http-only.conf|nginx-https.conf|g' docker-compose.prod.yml
    
    # Restart nginx with new config
    echo "🔃 Restarting nginx with HTTPS configuration..."
    docker-compose -f docker-compose.prod.yml up -d --force-recreate nginx
    
    echo "🎉 SSL setup completed! Your site should now be available at https://$DOMAIN"
    echo "🔗 Testing HTTPS..."
    sleep 5
    
    # Test HTTPS
    if curl -sSf https://$DOMAIN > /dev/null 2>&1; then
        echo "✅ HTTPS is working correctly!"
    else
        echo "⚠️  HTTPS test failed. Check the logs:"
        echo "   docker logs nginx"
    fi
    
else
    echo "❌ Failed to obtain SSL certificate!"
    echo "💡 Common issues:"
    echo "   - Domain $DOMAIN not pointing to this server"
    echo "   - Port 80 not accessible from internet"
    echo "   - Firewall blocking connections"
    echo ""
    echo "🔍 Check logs: docker logs nginx"
    echo "🔍 Check certbot logs: docker-compose -f docker-compose.prod.yml logs certbot"
fi
