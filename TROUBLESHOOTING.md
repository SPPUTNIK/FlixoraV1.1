# FLIXORA DEPLOYMENT TROUBLESHOOTING GUIDE

## Current Status of Fixes Applied

### ✅ Issues Fixed:
1. **Frontend Dockerfile**: Changed from dev mode to production build (`npm run build` + `npm start`)
2. **MongoDB Service Name**: Fixed inconsistency - now using `db` throughout (docker-compose & .env)
3. **Nginx Configuration**: Switched to HTTP-only config for initial deployment
4. **OAuth Cleanup**: Removed all Google/42 OAuth dependencies

### 🔧 Key Configuration Files Updated:

#### `frontend/Dockerfile`
- Now builds production bundle: `RUN npm run build`
- Starts with: `CMD ["npm", "start"]`

#### `docker-compose.prod.yml`
- MongoDB service name: `db` (was inconsistently `mongo`)
- Nginx using `nginx-http.conf` (HTTP-only)
- Removed SSL port and volume mounts for initial deployment

#### `.env`
- MongoDB URI uses correct service name: `db:27017`
- All MongoDB environment variables properly set

## Deployment Steps

### 1. Initial Deployment (HTTP-only)
```bash
# Make scripts executable
chmod +x deploy-fix.sh setup-ssl.sh

# Deploy with fixes
sudo ./deploy-fix.sh
```

### 2. Verify Deployment
```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yml ps

# Check logs for errors
docker-compose -f docker-compose.prod.yml logs -f

# Test endpoints
curl http://abdessamad.com
curl http://abdessamad.com/api/health
```

### 3. Setup SSL (after HTTP deployment works)
```bash
sudo ./setup-ssl.sh
```

## Common Issues & Solutions

### Frontend Issues
**Problem**: "Build failed" or "Module not found"
**Solution**: 
```bash
# Check if build directory exists
docker exec -it frontend ls -la .next/

# If missing, rebuild:
docker-compose -f docker-compose.prod.yml build --no-cache frontend
```

### Backend Issues
**Problem**: "Cannot connect to MongoDB"
**Check**:
```bash
# Verify MongoDB is running
docker exec -it db mongo --eval "db.runCommand({ping: 1})"

# Check environment variables
docker exec -it backend env | grep MONGO
```

### MongoDB Issues
**Problem**: Authentication failed
**Solution**:
```bash
# Check if user was created
docker exec -it db mongo hypertube --eval "db.getUsers()"

# Recreate if needed:
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d db
# Wait for MongoDB init to complete
docker-compose -f docker-compose.prod.yml up -d
```

### Nginx Issues
**Problem**: "502 Bad Gateway"
**Check**:
```bash
# Verify upstream services are running
docker-compose -f docker-compose.prod.yml ps frontend backend

# Check Nginx config
docker exec -it nginx nginx -t

# Check connectivity from nginx to services
docker exec -it nginx wget -O- http://frontend:3000 --timeout=5
docker exec -it nginx wget -O- http://backend:3001/health --timeout=5
```

## Quick Commands Reference

```bash
# View logs for specific service
docker-compose -f docker-compose.prod.yml logs -f [frontend|backend|db|nginx]

# Restart specific service
docker-compose -f docker-compose.prod.yml restart [service-name]

# Rebuild and restart everything
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Check disk space (common issue)
df -h

# Check memory usage
free -m

# Clean up Docker resources
docker system prune -f
docker volume prune -f
```

## Success Indicators

✅ **All services should show "running":**
```bash
docker-compose -f docker-compose.prod.yml ps
```

✅ **HTTP requests should work:**
- `curl http://abdessamad.com` → Returns HTML
- `curl http://abdessamad.com/api/health` → Returns JSON

✅ **No error logs in:**
```bash
docker-compose -f docker-compose.prod.yml logs --tail=50
```

✅ **MongoDB authentication successful:**
```bash
docker exec -it db mongo hypertube -u hypertubeUser -p appPass --eval "db.stats()"
```

## Next Steps After Successful HTTP Deployment

1. **Test Application Functionality**
   - Register a new user
   - Login/logout
   - Browse movies
   - Test API endpoints

2. **Setup SSL Certificate**
   ```bash
   sudo ./setup-ssl.sh
   ```

3. **Monitor Performance**
   - Check memory usage: `docker stats`
   - Monitor logs: `docker-compose -f docker-compose.prod.yml logs -f`

4. **Setup Automated Backups** (optional)
   - Database backups
   - Log rotation
   - System monitoring
