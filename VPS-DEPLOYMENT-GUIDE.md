# VPS Deployment Guide for FlixoraV1.1

## Prerequisites on VPS

1. **Update your VPS**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Install Git**:
   ```bash
   sudo apt install -y git
   ```

## DNS Configuration

Before deploying, configure these DNS records in your domain provider:

```
Type    Name    Value           TTL
A       @       YOUR_VPS_IP     300
A       api     YOUR_VPS_IP     300
CNAME   www     abdessamad.com  300
```

## Deployment Steps

1. **Clone your project to VPS**:
   ```bash
   git clone <your-repository-url>
   cd FlixoraV1.1/TV
   ```

2. **Make scripts executable**:
   ```bash
   chmod +x deploy.sh setup-ssl.sh
   ```

3. **Update email in SSL script**:
   Edit `setup-ssl.sh` and replace `your-email@example.com` with your actual email.

4. **Deploy the application**:
   ```bash
   ./deploy.sh
   ```

5. **Setup SSL certificates**:
   ```bash
   ./setup-ssl.sh
   ```

## Authentication

This application uses email/password authentication only. Users can:
- Sign up with email and password
- Sign in with their credentials
- Reset password via email
- Update their profile information

No third-party OAuth providers (Google, 42 Intra) are configured.

## Security Considerations

1. **Firewall Setup**:
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw --force enable
   ```

2. **Change default MongoDB passwords**:
   Edit the `.env` file and change all default passwords to strong, unique passwords.

3. **Regular Updates**:
   Set up automatic security updates:
   ```bash
   sudo apt install -y unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

## Monitoring

1. **Check container status**:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

2. **View logs**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f [service-name]
   ```

3. **Monitor resources**:
   ```bash
   docker stats
   ```

## Backup Strategy

1. **Database Backup**:
   ```bash
   docker exec db mongodump --out /backup
   docker cp db:/backup ./backup-$(date +%Y%m%d)
   ```

2. **Uploads Backup**:
   ```bash
   tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
   ```

## Troubleshooting

1. **If containers fail to start**:
   - Check logs: `docker-compose -f docker-compose.prod.yml logs`
   - Verify .env file has all required variables
   - Ensure DNS records are properly configured

2. **If SSL fails**:
   - Ensure ports 80 and 443 are open
   - Verify DNS records point to your VPS IP
   - Check if domain is accessible via HTTP first

3. **If database connection fails**:
   - Verify MongoDB container is running
   - Check database credentials in .env file
   - Ensure network connectivity between containers
