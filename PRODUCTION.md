# Bishnupriya Dictionary - Production Deployment Guide

## Production Setup with PM2

This project uses PM2 to serve both frontend and backend as a single application in production.

### Architecture
- **Development**: Frontend (Vite) and Backend (Express) run separately
- **Production**: Backend serves both API and static frontend files

### Prerequisites
- Node.js (v16 or higher)
- PM2 installed globally: `npm install -g pm2`

### Build & Deploy Steps

#### 1. Install Dependencies
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

#### 2. Build for Production
```bash
npm run build
```
This will:
- Build the frontend (creates `frontend/dist`)
- Build the backend (creates `backend/dist`)

#### 3. Start with PM2
```bash
npm run start:pm2
```

### PM2 Commands

```bash
# Start application
npm run start:pm2

# Stop application
npm run stop:pm2

# Restart application
npm run restart:pm2

# Reload application (zero-downtime)
npm run reload:pm2

# Delete from PM2
npm run delete:pm2

# View logs
npm run logs:pm2

# Monitor processes
npm run monit:pm2

# Or use PM2 directly
pm2 list                    # List all processes
pm2 logs bishnupriya-dictionary    # View logs
pm2 show bishnupriya-dictionary    # Show process details
pm2 monit                   # Monitor resources
```

### Development

```bash
# Run both frontend and backend in dev mode
npm run dev

# Or run separately
npm run dev:backend
npm run dev:frontend
```

### Production Configuration

The application uses `ecosystem.config.js` for PM2 configuration:
- **Cluster mode**: Uses all CPU cores for better performance
- **Auto-restart**: Automatically restarts on crashes
- **Memory limit**: Restarts if memory exceeds 500MB
- **Logs**: Stored in `logs/` directory

### Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):
```bash
PORT=3000
NODE_ENV=production
```

### Port Configuration

- **Production**: Backend serves on port 3000 (serves both API and frontend)
- **Development**: 
  - Backend: http://localhost:3000
  - Frontend: http://localhost:5173

### API Endpoints

All API endpoints are prefixed with `/api`:
- `GET /api/health` - Health check
- `GET /api/dictionary/*` - Dictionary routes

### Logs

Logs are stored in the `logs/` directory:
- `err.log` - Error logs
- `out.log` - Output logs
- `combined.log` - Combined logs

### Monitoring

```bash
# View real-time logs
pm2 logs bishnupriya-dictionary

# Monitor CPU and memory
pm2 monit

# Web-based dashboard
pm2 plus
```

### Updating Application

```bash
# Pull latest changes
git pull

# Rebuild
npm run build

# Reload with zero downtime
npm run reload:pm2
```

### Troubleshooting

1. **Port already in use**
   ```bash
   pm2 stop bishnupriya-dictionary
   # or kill the process using the port
   ```

2. **Application not starting**
   ```bash
   pm2 logs bishnupriya-dictionary
   # Check logs for errors
   ```

3. **Memory issues**
   - Adjust `max_memory_restart` in `ecosystem.config.js`
   - Check logs for memory leaks

4. **Build errors**
   ```bash
   # Clean and rebuild
   rm -rf frontend/dist backend/dist
   npm run build
   ```

### Production Checklist

- [ ] Environment variables configured
- [ ] Frontend built successfully
- [ ] Backend built successfully
- [ ] PM2 configuration reviewed
- [ ] Logs directory exists
- [ ] Port is available
- [ ] Application tested locally
- [ ] Health check endpoint working

### Backup PM2 Configuration

```bash
# Save current PM2 processes
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Security Notes

- Never commit `.env` file to git
- Use environment variables for sensitive data
- Keep dependencies updated
- Monitor logs regularly
- Set up proper firewall rules
