# Deployment Guide - LinkedIn Design Tool

## 🚀 Production Deployment Options

Choose the deployment method that best suits your needs:

---

## Option 1: Deploy to Hostinger (Easiest)

### Prerequisites
- Hostinger account with Node.js hosting
- Domain name
- FTP client (FileZilla)

### Steps

1. **Prepare Files**
```powershell
# Create deployment package
cd "E:\ALIYAN PROJECT\linkedIn"
# Exclude node_modules, .git, .env
```

2. **Upload via FTP**
- Connect to Hostinger FTP
- Upload all files to `public_html` folder
- Keep folder structure intact

3. **Setup Node.js on Hostinger**
- Login to Hostinger control panel
- Go to "Advanced" → "Node.js"
- Create Node.js application:
  - Node version: 18.x
  - Application mode: Production
  - Application root: `/public_html`
  - Application startup file: `backend/server.js`

4. **Install Dependencies**
- Open SSH terminal in Hostinger
```bash
cd public_html/backend
npm install --production
```

5. **Configure Environment**
- Create `.env` file in backend folder
- Copy from `.env.production` template
- Fill in MongoDB Atlas connection string
- Add your domain to FRONTEND_URL

6. **Start Application**
```bash
npm run seed-admin
# Application will auto-start via Hostinger's Node.js manager
```

7. **Setup Domain**
- Point domain A record to Hostinger IP
- Enable SSL in Hostinger panel (free Let's Encrypt)
- Your site: `https://yourdomain.com`

**Cost:** $3-5/month + domain ($10/year)

---

## Option 2: Deploy to DigitalOcean (Recommended)

### Prerequisites
- DigitalOcean account
- Domain name
- Basic Linux knowledge

### Steps

1. **Create Droplet**
- Login to DigitalOcean
- Create Droplet:
  - Image: Ubuntu 22.04
  - Plan: Basic $6/month
  - Location: Closest to your users
  - Authentication: SSH key recommended

2. **Connect to Server**
```powershell
ssh root@your_server_ip
```

3. **Install Dependencies**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MongoDB (optional - use Atlas instead)
# apt install -y mongodb

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (web server)
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

4. **Upload Project Files**

**Method A: Using Git (Recommended)**
```bash
cd /var/www
git clone https://github.com/yourusername/linkedin-design-tool.git
cd linkedin-design-tool/backend
npm install --production
```

**Method B: Using SCP**
```powershell
# From your local machine
scp -r "E:\ALIYAN PROJECT\linkedIn" root@your_server_ip:/var/www/
```

5. **Configure Environment**
```bash
cd /var/www/linkedin-design-tool/backend
nano .env
# Paste production configuration
# Update MONGODB_URI, JWT secrets, admin credentials
```

6. **Seed Admin Account**
```bash
npm run seed-admin
```

7. **Start Application with PM2**
```bash
pm2 start server.js --name linkedin-tool
pm2 startup
pm2 save
```

8. **Configure Nginx**
```bash
nano /etc/nginx/sites-available/yourdomain.com
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload size limit
    client_max_body_size 10M;
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

9. **Setup SSL**
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

10. **Configure Domain DNS**
- Go to your domain registrar
- Add A record: `@` → `your_server_ip`
- Add A record: `www` → `your_server_ip`
- Wait 5-60 minutes for propagation

11. **Test Deployment**
- Visit: `https://yourdomain.com`
- Register test user
- Login to admin: `https://yourdomain.com/admin`
- Approve user and test designer

**Cost:** $6/month + domain ($10/year)

---

## Option 3: Deploy to Vercel + MongoDB Atlas (Free)

### Limitations
- Free tier has limitations
- Serverless (cold starts)
- Good for testing/demo

### Steps

1. **Install Vercel CLI**
```powershell
npm install -g vercel
```

2. **Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. **Deploy**
```powershell
cd "E:\ALIYAN PROJECT\linkedIn"
vercel
```

4. **Add Environment Variables**
- Go to Vercel dashboard
- Add all `.env` variables
- Must use MongoDB Atlas (no local DB)

**Cost:** Free (with limits)

---

## Option 4: Deploy to Heroku

### Steps

1. **Install Heroku CLI**
```powershell
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

2. **Prepare for Heroku**

Create `Procfile` in root:
```
web: cd backend && npm start
```

Update `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

3. **Deploy**
```powershell
cd "E:\ALIYAN PROJECT\linkedIn"
heroku login
heroku create your-app-name
git init
git add .
git commit -m "Initial deployment"
git push heroku main
```

4. **Add Environment Variables**
```powershell
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# Add all other env variables
```

5. **Open App**
```powershell
heroku open
```

**Cost:** $7/month minimum (no free tier anymore)

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

### Code
- [ ] All features tested locally
- [ ] No console.log in production code
- [ ] Error handling implemented
- [ ] Input validation on all forms
- [ ] Rate limiting configured
- [ ] CORS properly configured

### Security
- [ ] Changed admin password from default
- [ ] Generated new JWT secrets (64+ chars)
- [ ] MongoDB authentication enabled
- [ ] HTTPS/SSL configured
- [ ] Security headers enabled
- [ ] File upload validation working
- [ ] Run `npm audit` and fix issues

### Environment
- [ ] NODE_ENV=production
- [ ] MongoDB Atlas connection string
- [ ] Frontend URL updated
- [ ] Payment details updated
- [ ] Email configuration (if using)
- [ ] All secrets in .env file

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Backup strategy in place
- [ ] Admin account seeded

### Performance
- [ ] Images optimized
- [ ] CSS/JS minified (optional)
- [ ] Gzip compression enabled
- [ ] CDN configured (optional)
- [ ] Database indexes created

### Monitoring
- [ ] Error logging set up
- [ ] Health check endpoint tested
- [ ] Uptime monitoring configured
- [ ] Analytics added (optional)

### Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Admin user guide created
- [ ] Deployment notes documented

---

## 🔧 Post-Deployment Tasks

After successful deployment:

1. **Test Everything**
   - Register new user
   - Upload payment screenshot
   - Login to admin panel
   - Approve user
   - Test designer access
   - Download designs
   - Test logout

2. **Monitor Logs**
```bash
# DigitalOcean
pm2 logs

# Heroku
heroku logs --tail

# Check for errors
```

3. **Setup Monitoring**
   - UptimeRobot (free): https://uptimerobot.com
   - Google Analytics (optional)
   - Error tracking (Sentry)

4. **Create Backups**
```bash
# MongoDB backup script
mongodump --uri="your_mongodb_uri" --out=/backups/$(date +%Y-%m-%d)
```

5. **Document Credentials**
   - Store in password manager
   - Share with team securely
   - Keep backup offline

---

## 🐛 Common Deployment Issues

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check MongoDB Atlas IP whitelist
- Verify connection string in .env
- Test connection: `mongosh "your_connection_string"`

### Issue: "502 Bad Gateway"
**Solution:**
- Check if Node.js is running: `pm2 status`
- Check Nginx config: `nginx -t`
- Check logs: `pm2 logs` and `tail -f /var/log/nginx/error.log`

### Issue: "Module not found"
**Solution:**
- Run `npm install` in backend folder
- Check NODE_ENV is set correctly
- Verify all dependencies in package.json

### Issue: "CORS error"
**Solution:**
- Update FRONTEND_URL in .env
- Check CORS configuration in server.js
- Clear browser cache

### Issue: "SSL certificate error"
**Solution:**
- Run certbot again: `certbot --nginx -d yourdomain.com`
- Check certificate expiry: `certbot certificates`
- Renew if needed: `certbot renew`

---

## 📈 Scaling & Optimization

When your app grows:

1. **Database Scaling**
   - Upgrade MongoDB Atlas tier
   - Add indexes for frequently queried fields
   - Enable caching (Redis)

2. **Server Scaling**
   - Upgrade droplet size
   - Use load balancer
   - Multiple server instances

3. **CDN for Static Assets**
   - Cloudflare (free)
   - AWS CloudFront
   - Serve uploads from CDN

4. **Code Optimization**
   - Enable compression
   - Lazy load images
   - Code splitting
   - Database query optimization

---

## 💰 Cost Comparison

| Platform | Monthly Cost | Best For |
|----------|-------------|----------|
| Hostinger | $3-5 | Beginners, simple setup |
| DigitalOcean | $6 | Full control, best value |
| Vercel | Free-$20 | Serverless, demos |
| Heroku | $7+ | Quick deployment |
| AWS/GCP | Variable | Enterprise scale |

**Recommendation:** Start with **DigitalOcean** or **Hostinger**

---

## 🎯 Success Metrics

Your deployment is successful when:

- ✅ Website loads at https://yourdomain.com
- ✅ SSL certificate is valid (green lock)
- ✅ Users can register and upload files
- ✅ Admin panel is accessible and functional
- ✅ Approved users can access designer
- ✅ Downloads work correctly
- ✅ No errors in server logs
- ✅ Uptime is 99%+

---

**Need help with deployment? Follow the steps for your chosen platform!** 🚀
