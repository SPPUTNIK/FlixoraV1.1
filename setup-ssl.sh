#!/bin/bash

# setup-ssl.sh - Simple SSL setup for your existing docker-compose.prod.yml

set -e

echo "🔐 Setting up SSL certificates for flixora.uk..."

# Check if domain is accessible
echo "🌍 Checking domain accessibility..."
if ! curl -f http://flixora.uk/ --max-time 10 2>/dev/null; then
    echo "⚠️  Warning: flixora.uk might not be accessible yet"
    echo "   Make sure your domain DNS is pointing to this server"
    read -p "   Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ SSL setup cancelled"
        exit 1
    fi
fi

# Create directories for Certbot
echo "📁 Creating SSL directories..."
mkdir -p certbot/{conf,www,logs}

# Start containers in HTTP mode first
echo "🚀 Starting containers in HTTP mode..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Test HTTP access and certbot challenge location
echo "🧪 Testing HTTP access..."
if curl -f http://flixora.uk/ --max-time 10 2>/dev/null; then
    echo "✅ HTTP access confirmed"
else
    echo "⚠️  Warning: HTTP access test failed, but continuing..."
fi

# Run Certbot to obtain certificates
echo "🔒 Obtaining SSL certificates..."
if docker compose -f docker-compose.prod.yml --profile ssl-setup run --rm certbot; then
    echo "✅ SSL certificates obtained successfully!"
    
    # Restart nginx to enable HTTPS mode
    echo "🔄 Restarting nginx to enable HTTPS..."
    docker compose -f docker-compose.prod.yml restart nginx
    
    # Wait for restart
    sleep 10
    
    # Test HTTPS
    echo "🧪 Testing HTTPS connection..."
    if curl -f https://flixora.uk/ --insecure --max-time 15 2>/dev/null; then
        echo "✅ HTTPS is working!"
        echo ""
        echo "🎉 SSL setup completed successfully!"
        echo "   Your site is now available at: https://flixora.uk"
        echo "   HTTP traffic will automatically redirect to HTTPS"
        echo ""
        echo "📋 Next steps:"
        echo "   1. Test all functionality with HTTPS"
        echo "   2. Update any hardcoded HTTP URLs to HTTPS"
    else
        echo "⚠️  HTTPS test failed, but certificates were created"
        echo "   The certificates might need a moment to be recognized"
        echo "   Check the logs: docker compose -f docker-compose.prod.yml logs nginx"
    fi
else
    echo "❌ Failed to obtain SSL certificates"
    echo ""
    echo "📋 Common issues:"
    echo "   - Domain DNS not pointing to this server"
    echo "   - Port 80 not accessible from internet"
    echo "   - Firewall blocking connections"
    echo "   - Domain not publicly accessible"
    echo ""
    echo "🔍 Check logs: docker compose -f docker-compose.prod.yml --profile ssl-setup logs certbot"
    exit 1
fi

echo ""
echo "📝 SSL Management Commands:"
echo "   Renew certificates:"
echo "     docker compose -f docker-compose.prod.yml --profile ssl-setup run --rm certbot renew"
echo "   Check certificate status:"
echo "     openssl x509 -enddate -noout -in certbot/conf/live/flixora.uk/fullchain.pem"
echo "   Restart nginx after renewal:"
echo "     docker compose -f docker-compose.prod.yml restart nginx"
