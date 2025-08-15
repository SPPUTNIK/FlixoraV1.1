#!/bin/sh

# nginx-smart-ssl.sh - Smart SSL startup script for nginx
# Automatically handles HTTP-only or HTTP+HTTPS based on SSL certificate availability

echo "🚀 Starting NGINX with smart SSL detection..."

# Check if SSL certificates exist
if [ -f "/etc/letsencrypt/live/flixora.uk/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/flixora.uk/privkey.pem" ]; then
    echo "✅ SSL certificates found! Enabling HTTPS with redirect..."
    
    # Copy the SSL-ready configuration
    cp /etc/nginx/nginx-ssl-ready.conf /etc/nginx/nginx.conf
    
    # Add HTTP to HTTPS redirect
    sed -i '/# Certbot challenge location/a\
        # Redirect HTTP to HTTPS (except for certbot challenges)\
        location / {\
            return 301 https://$server_name$request_uri;\
        }\
' /etc/nginx/nginx.conf
    
    echo "🔒 HTTPS mode: HTTP traffic will redirect to HTTPS"
    echo "🌐 Available at: https://flixora.uk"
else
    echo "⚠️  SSL certificates not found. Running in HTTP-only mode..."
    
    # Use the original HTTP-only configuration
    cp /etc/nginx/nginx-http.conf /etc/nginx/nginx.conf
    
    echo "🌐 Available at: http://flixora.uk"
    echo "📝 To enable HTTPS, run: docker compose -f docker-compose.prod.yml --profile ssl-setup run --rm certbot"
fi

# Test NGINX configuration
echo "🔍 Testing NGINX configuration..."
if nginx -t; then
    echo "✅ NGINX configuration is valid!"
    echo "🌍 Starting NGINX server..."
    exec nginx -g "daemon off;"
else
    echo "❌ NGINX configuration test failed!"
    echo "📋 Configuration details:"
    nginx -T
    exit 1
fi
