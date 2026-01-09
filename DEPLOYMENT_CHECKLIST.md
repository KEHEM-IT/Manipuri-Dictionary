# 🚀 Production Deployment Checklist

## Pre-Deployment

### 1. Code Review
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] All TypeScript errors resolved
- [ ] Code formatted and linted
- [ ] Git repository up to date

### 2. Dependencies
- [ ] Root dependencies installed: `npm install`
- [ ] Backend dependencies installed: `cd backend && npm install`
- [ ] Frontend dependencies installed: `cd frontend && npm install`
- [ ] No security vulnerabilities: `npm audit`

### 3. Environment Configuration
- [ ] `.env` file created (copy from `.env.example`)
- [ ] PORT configured (default: 3000)
- [ ] NODE_ENV set to 'production'
- [ ] All sensitive data in environment variables
- [ ] `.env` added to `.gitignore`

### 4. Build Process
- [ ] Frontend builds successfully: `npm run build:frontend`
- [ ] Backend builds successfully: `npm run build:backend`
- [ ] `frontend/dist/` directory created with files
- [ ] `backend/dist/` directory created with files
- [ ] No build warnings or errors

### 5. PM2 Setup
- [ ] PM2 installed globally: `npm install -g pm2`
- [ ] `ecosystem.config.js` reviewed
- [ ] Logs directory exists: `logs/`
- [ ] PM2 startup configured: `pm2 startup`

## Deployment Steps

### Step 1: Build Application
```bash
npm run build
```
**Verify:**
- [ ] No build errors
- [ ] `frontend/dist/index.html` exists
- [ ] `backend/dist/index.js` exists

### Step 2: Test Production Build Locally
```bash
npm start
```
**Verify:**
- [ ] Server starts on correct port
- [ ] Can access http://localhost:3000
- [ ] Frontend loads properly
- [ ] API endpoints respond
- [ ] No console errors

### Step 3: Start with PM2
```bash
npm run start:pm2
```
**Verify:**
- [ ] PM2 shows process running: `pm2 list`
- [ ] No errors in logs: `pm2 logs bishnupriya-dictionary`
- [ ] Application accessible at http://localhost:3000

### Step 4: Configure PM2 Startup
```bash
pm2 save
pm2 startup
```
**Verify:**
- [ ] PM2 will restart on system reboot
- [ ] Startup command executed successfully

## Post-Deployment Testing

### Functional Testing
- [ ] Homepage loads correctly
- [ ] Search functionality works
- [ ] Word detail pages load
- [ ] API endpoints respond correctly
- [ ] Theme toggle works and persists
- [ ] Audio pronunciation plays
- [ ] Voice search works (Chrome/Edge)
- [ ] Language filter functions
- [ ] Navigation between pages works

### Performance Testing
- [ ] Page load time acceptable (< 3s)
- [ ] API response time acceptable (< 1s)
- [ ] No memory leaks: `pm2 monit`
- [ ] CPU usage normal (< 50%)
- [ ] No excessive logging

### Mobile Testing
- [ ] Responsive layout on mobile
- [ ] Touch interactions work
- [ ] Navigation menu accessible
- [ ] Search box usable
- [ ] Cards display correctly

### Browser Testing
- [ ] Chrome/Chromium works
- [ ] Firefox works
- [ ] Edge works
- [ ] Safari works (if available)

## Monitoring Setup

### PM2 Monitoring
```bash
# View logs
pm2 logs bishnupriya-dictionary

# Monitor resources
pm2 monit

# Check status
pm2 status
```

**Verify:**
- [ ] Logs are being written to `logs/` directory
- [ ] No error messages in logs
- [ ] Memory usage stable
- [ ] CPU usage reasonable

### Log Rotation (Optional)
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Security Checklist

### Application Security
- [ ] No sensitive data in git repository
- [ ] Environment variables properly configured
- [ ] CORS configured appropriately
- [ ] Input validation on backend
- [ ] No console.log with sensitive data
- [ ] Error messages don't expose internals

### Server Security (if applicable)
- [ ] Firewall configured (allow only necessary ports)
- [ ] SSH key authentication enabled
- [ ] Non-root user running application
- [ ] Regular security updates applied
- [ ] SSL/TLS certificate installed (HTTPS)

## Backup Strategy

### Before Deployment
- [ ] Code backed up to git repository
- [ ] Database backed up (if applicable)
- [ ] Configuration files documented

### Regular Backups
- [ ] Daily log backups configured
- [ ] Weekly full backups
- [ ] Backup restoration tested

## Rollback Plan

### If Deployment Fails
```bash
# Stop PM2
npm run stop:pm2

# Checkout previous version
git checkout [previous-commit]

# Rebuild
npm run build

# Restart
npm run start:pm2
```

**Document:**
- [ ] Previous working commit hash
- [ ] Rollback procedure tested
- [ ] Team notified of rollback process

## Update Procedure

### For Future Updates
```bash
# Pull latest code
git pull

# Install any new dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Rebuild
npm run build

# Reload with zero downtime
npm run reload:pm2
```

**Verify:**
- [ ] Update procedure documented
- [ ] Team trained on update process
- [ ] Downtime minimized

## Common Issues & Solutions

### Issue: Port Already in Use
**Solution:**
```bash
pm2 stop bishnupriya-dictionary
# or change port in .env
```

### Issue: Build Fails
**Solution:**
```bash
rm -rf node_modules frontend/dist backend/dist
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
npm run build
```

### Issue: PM2 Won't Start
**Solution:**
```bash
pm2 logs bishnupriya-dictionary
# Check logs for errors
# Fix errors and retry
```

### Issue: High Memory Usage
**Solution:**
```bash
# Adjust in ecosystem.config.js
max_memory_restart: '500M'
pm2 restart ecosystem.config.js
```

## Performance Optimization

### After Deployment
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Optimize images (if any)
- [ ] Minify assets (done by Vite)
- [ ] Enable HTTP/2 (if using HTTPS)
- [ ] Monitor and optimize slow queries

## Documentation

### Team Documentation
- [ ] Deployment procedure documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Contact information for support
- [ ] Architecture diagram created

## Sign-off

### Deployment Complete
- [ ] All checklist items completed
- [ ] Application running smoothly
- [ ] Monitoring in place
- [ ] Team notified
- [ ] Documentation updated
- [ ] Client/stakeholders informed

**Deployed by:** _________________  
**Date:** _________________  
**Version:** _________________  
**Notes:** _________________

---

## Quick Reference Commands

```bash
# Build
npm run build

# Start
npm run start:pm2

# Stop
npm run stop:pm2

# Restart
npm run restart:pm2

# Reload (zero downtime)
npm run reload:pm2

# Logs
npm run logs:pm2

# Monitor
npm run monit:pm2

# Status
pm2 status

# Delete from PM2
npm run delete:pm2
```

## Support Contacts

- **Developer:** KEHEM IT
- **Repository:** [GitHub URL]
- **Documentation:** README.md, PRODUCTION.md

---

**Remember:** Test everything in a staging environment before deploying to production!
