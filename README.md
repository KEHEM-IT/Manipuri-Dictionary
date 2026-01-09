# 📚 Bishnupriya Dictionary Application

A modern, feature-rich dictionary web application built with Vue 3, TypeScript, and Tailwind CSS. Search words, listen to pronunciations, and explore definitions in a beautiful dark/light theme interface.

## ✨ Features

- 🔍 **Smart Search** - Search words with instant results
- 🎤 **Voice Search** - Speak your search query using Web Speech API
- 🌓 **Dark/Light Theme** - Toggle between themes with auto-save preference
- 🔊 **Audio Pronunciation** - Listen to word pronunciations
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🌐 **Multi-language Support** - Filter by language (English/Bangla)
- 🎯 **Individual Word Pages** - Dedicated pages with full word details
- ⚡ **Fast & Modern** - Built with Vite and Vue 3 Composition API

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vue Router 4** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation build tool
- **Axios** - HTTP client
- **Web Speech API** - Voice recognition

### Backend
- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe backend development
- **CORS** - Cross-origin resource sharing
- **Node.js** - JavaScript runtime

## 📋 Prerequisites

Before installation, ensure you have:
- **Node.js** (v16 or higher)
- **npm** package manager
- **PM2** (for production): `npm install -g pm2`
- Modern web browser (Chrome/Edge recommended for voice features)

## 🚀 Quick Start

### Development Mode

1. **Install Dependencies**
```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

2. **Run Development Servers**
```bash
npm run dev
```
This starts both frontend (port 5173) and backend (port 3000) concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

### Production Mode

For production deployment, see [PRODUCTION.md](PRODUCTION.md) for detailed instructions.

**Quick production setup:**

```bash
# Windows
setup-production.bat
start-production.bat

# Linux/Mac
npm run build
npm run start:pm2
```

## 📁 Project Structure

```
bishnupriya-dictionary/
├── backend/                      # Express API server
│   ├── src/
│   │   ├── index.ts             # Server entry point
│   │   ├── routes/              # API routes
│   │   └── data/                # Dictionary data
│   ├── dist/                    # Built backend (production)
│   └── package.json
│
├── frontend/                     # Vue 3 application
│   ├── src/
│   │   ├── router/              # Vue Router configuration
│   │   ├── views/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── composables/         # Vue composables
│   │   ├── types/               # TypeScript definitions
│   │   ├── App.vue              # Root component
│   │   └── main.ts              # Application entry
│   ├── dist/                    # Built frontend (production)
│   └── package.json
│
├── logs/                         # PM2 logs (production)
├── ecosystem.config.js           # PM2 configuration
├── package.json                  # Root package file
├── setup-production.bat          # Windows setup script
├── start-production.bat          # Windows start script
├── PRODUCTION.md                 # Production deployment guide
└── README.md                     # This file
```

## 🎯 Development Guide

### Available Scripts

**Root Level:**
```bash
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build            # Build both for production
npm run start            # Start production server
npm run start:pm2        # Start with PM2
npm run logs:pm2         # View PM2 logs
npm run monit:pm2        # Monitor PM2 processes
```

**Backend:**
```bash
cd backend
npm run dev              # Start with hot reload
npm run build            # Build for production
npm run start            # Start production build
```

**Frontend:**
```bash
cd frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=production
```

### API Configuration

The frontend automatically proxies API requests in development:
- Development: `/api` → `http://localhost:3000/api`
- Production: Backend serves both API and static files

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```

### Dictionary Routes
```
GET /api/dictionary/search?q=word&lang=english
GET /api/dictionary/word/:id
GET /api/dictionary/random
```

## 🎨 Features Guide

### Homepage
- Featured/random words
- Search box with language filter
- Theme toggle button
- Responsive card layout

### Search
**Text Search:**
1. Type word in search box
2. Select language (English/Bangla)
3. Press Enter or click search
4. View results at `/search?q=word&lang=english`

**Voice Search:**
1. Click microphone icon 🎤
2. Wait for "Listening..." indicator
3. Speak clearly
4. Results appear automatically

### Word Details
- Click any word card
- View complete information at `/word/{id}`
- Audio pronunciation
- Definitions, examples, synonyms, antonyms

### Theme Switching
- Click sun ☀️ / moon 🌙 icon
- Preference saved automatically
- Persists across sessions

## 🧪 Testing Checklist

After installation, verify:

- [ ] Homepage loads with words
- [ ] Search returns results
- [ ] Voice search works (Chrome/Edge)
- [ ] Word detail pages load
- [ ] Theme toggle persists
- [ ] Audio pronunciation plays
- [ ] Language filter works
- [ ] Responsive on mobile
- [ ] API health check responds

## 🌐 Browser Support

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Core App | ✅ | ✅ | ✅ | ✅ |
| Voice Search | ✅ | ✅ | ❌ | ❌ |
| Dark Mode | ✅ | ✅ | ✅ | ✅ |
| Audio | ✅ | ✅ | ✅ | ✅ |

*Voice search requires Web Speech API (Chrome/Edge)*

## 🐛 Troubleshooting

### Development Issues

**Port Already in Use:**
```bash
# Change port in backend/src/index.ts
const PORT = process.env.PORT || 3001;
```

**CORS Errors:**
- Ensure backend CORS is configured
- Check frontend proxy in `vite.config.ts`

**Voice Search Not Working:**
- Use Chrome or Edge browser
- Check microphone permissions
- Verify HTTPS in production

### Production Issues

**Build Fails:**
```bash
# Clean and rebuild
rm -rf frontend/dist backend/dist node_modules
npm install
npm run build
```

**PM2 Won't Start:**
```bash
# Check logs
pm2 logs bishnupriya-dictionary

# Restart PM2
pm2 restart ecosystem.config.js
```

**Memory Issues:**
```bash
# Adjust in ecosystem.config.js
max_memory_restart: '500M'
```

## 📦 Production Deployment

See [PRODUCTION.md](PRODUCTION.md) for comprehensive deployment guide including:
- Build process
- PM2 configuration
- Environment setup
- Monitoring and logs
- Zero-downtime updates
- Security checklist

### Quick Production Commands

```bash
# Build
npm run build

# Start with PM2
npm run start:pm2

# Monitor
npm run monit:pm2

# View logs
npm run logs:pm2

# Update app
git pull
npm run build
npm run reload:pm2
```

## 🚢 Deployment Platforms

### PM2 (Recommended for VPS)
```bash
npm run build
npm run start:pm2
```

### Docker
```bash
# Coming soon
```

### Cloud Platforms
- **Vercel**: Auto-deploy from GitHub
- **Netlify**: Drag & drop `frontend/dist`
- **Railway**: Connect GitHub repository
- **DigitalOcean**: Use PM2 on droplet

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open Pull Request

## 📄 License

This project is developed and maintained by **KEHEM IT**.

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact KEHEM IT support

## 🎉 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for utility-first CSS
- Express.js community
- Web Speech API contributors

---

**Developed with ❤️ by KEHEM IT**

For detailed production deployment instructions, see [PRODUCTION.md](PRODUCTION.md)
