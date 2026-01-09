# 📋 Quick Reference Card

## 🚀 Common Commands

### Development
```bash
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Frontend only (port 5173)
npm run dev:backend      # Backend only (port 3000)
```

### Building
```bash
npm run build            # Build everything
setup-production.bat     # Windows: Build & setup
```

### Production
```bash
npm run start:pm2        # Start with PM2
npm run stop:pm2         # Stop PM2
npm run restart:pm2      # Restart
npm run reload:pm2       # Zero-downtime reload
npm run logs:pm2         # View logs
npm run monit:pm2        # Monitor resources
pm2 list                 # List all PM2 processes
```

## 🌐 URLs

- **Development Frontend:** http://localhost:5173
- **Development Backend:** http://localhost:3000
- **Production (both):** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health

## 📁 Key Files

### Configuration
- `ecosystem.config.js` - PM2 settings
- `.env` - Environment variables
- `package.json` - Scripts & dependencies

### Entry Points
- `frontend/src/main.ts` - Frontend entry
- `backend/src/index.ts` - Backend entry

### Documentation
- `README.md` - Project overview
- `PRODUCTION.md` - Production guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment steps
- `SETUP_SUMMARY.md` - What was configured

## 🔧 Troubleshooting

### Build Issues
```bash
rm -rf node_modules frontend/dist backend/dist
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
npm run build
```

### PM2 Issues
```bash
pm2 logs bishnupriya-dictionary  # Check logs
pm2 restart ecosystem.config.js  # Restart
pm2 delete ecosystem.config.js   # Remove
pm2 save                         # Save process list
```

### Port Issues
```bash
pm2 stop bishnupriya-dictionary  # Stop PM2
# or change PORT in .env file
```

## 📊 PM2 Monitoring

```bash
pm2 list                 # List processes
pm2 monit                # Resource monitor
pm2 logs                 # All logs
pm2 logs [app-name]      # Specific app logs
pm2 describe [app-name]  # Detailed info
```

## 🔄 Update Workflow

```bash
git pull                 # Get latest code
npm run build            # Rebuild
npm run reload:pm2       # Zero-downtime reload
```

## ⚙️ Environment Variables

```env
PORT=3000                # Server port
NODE_ENV=production      # Environment mode
```

## 🛠️ First-Time Setup

```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 2. Install cross-env (Windows)
npm install cross-env --save-dev

# 3. Build
npm run build

# 4. Start
npm run start:pm2

# 5. Configure auto-start (optional)
pm2 save
pm2 startup
```

## 📝 File Structure

```
Dictionary/
├── backend/
│   ├── src/           # Source code
│   └── dist/          # Built code
├── frontend/
│   ├── src/           # Source code
│   └── dist/          # Built code
├── logs/              # PM2 logs
├── ecosystem.config.js
├── package.json
└── .env
```

## ✅ Health Checks

```bash
# API Health
curl http://localhost:3000/api/health

# PM2 Status
pm2 status

# View Logs
npm run logs:pm2
```

## 🎯 Production Checklist

- [ ] Dependencies installed
- [ ] Build successful
- [ ] .env configured
- [ ] PM2 running
- [ ] Health check passes
- [ ] No errors in logs
- [ ] Application accessible

## 📞 Quick Help

**Issue:** Can't access application  
**Fix:** Check PM2 logs: `npm run logs:pm2`

**Issue:** Build fails  
**Fix:** Clean install: see "Build Issues" above

**Issue:** PM2 won't start  
**Fix:** Check if port is available, review logs

**Issue:** Memory issues  
**Fix:** Adjust `max_memory_restart` in `ecosystem.config.js`

---

**Keep this card handy for quick reference!**
