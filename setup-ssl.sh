#!/bin/bash

# SSL Certificate Setup Script using Let's Encrypt

echo "🔒 Setting up SSL certificates with Let's Encrypt..."

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Stop nginx container temporarily
echo "🛑 Stopping nginx container..."
docker-compose -f docker-compose.prod.yml stop nginx

# Create SSL directory
sudo mkdir -p ./ssl

# Get certificates for both domains
echo "📜 Obtaining SSL certificates..."
sudo certbot certonly --standalone \
    -d abdessamad.com \
    -d api.abdessamad.com \
    --email your-email@example.com \
    --agree-tos \
    --non-interactive

# Copy certificates to our ssl directory
echo "📋 Copying certificates..."
sudo cp /etc/letsencrypt/live/abdessamad.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/abdessamad.com/privkey.pem ./ssl/

# Set proper permissions
sudo chown $USER:$USER ./ssl/*
sudo chmod 644 ./ssl/fullchain.pem
sudo chmod 600 ./ssl/privkey.pem

# Restart nginx container
echo "🔄 Restarting nginx container..."
docker-compose -f docker-compose.prod.yml up -d nginx

echo "✅ SSL certificates installed successfully!"
echo "🔄 Setting up automatic renewal..."

# Add cron job for automatic renewal
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && docker-compose -f $(pwd)/docker-compose.prod.yml restart nginx") | crontab -

echo "✅ Automatic renewal set up!"
echo "🌐 Your website should now be available with HTTPS at:"
echo "   - https://abdessamad.com"
echo "   - https://api.abdessamad.com"
