# 🏗️ Architecture Overview

## Development Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT MODE                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   Frontend (Vite)    │         │   Backend (Express)  │
│   Port: 5173         │◄────────│   Port: 3000         │
│                      │  Proxy  │                      │
│  - Vue 3             │  /api   │  - TypeScript        │
│  - TypeScript        │  ──────►│  - API Routes        │
│  - Tailwind CSS      │         │  - Dictionary Data   │
│  - Vue Router        │         │  - CORS Enabled      │
│  - Hot Reload        │         │  - Hot Reload        │
└──────────────────────┘         └──────────────────────┘
         │                                  │
         │                                  │
         ▼                                  ▼
  User Browser ──────────────────► Direct API Access
  localhost:5173                    localhost:3000/api
```

### Development Flow:
1. Frontend runs on Vite dev server (5173)
2. Backend runs separately on Express (3000)
3. Vite proxies `/api` requests to backend
4. Hot reload works for both independently
5. CORS enabled for cross-origin requests

---

## Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION MODE                          │
└─────────────────────────────────────────────────────────────┘

                    ┌────────────────────┐
                    │       PM2          │
                    │  Process Manager   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Cluster Mode     │
                    │  (All CPU Cores)   │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Instance 1  │    │   Instance 2  │    │   Instance N  │
│  Port: 3000   │    │  Port: 3000   │    │  Port: 3000   │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                     │
        └────────────────────┴─────────────────────┘
                             │
                ┌────────────▼────────────┐
                │  Express.js Server      │
                │  Port: 3000             │
                └────────────┬────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │  API Routes  │         │ Static Files │
        │  /api/*      │         │  /* (SPA)    │
        │              │         │              │
        │ - /health    │         │ index.html   │
        │ - /search    │         │ assets/      │
        │ - /word/:id  │         │ (frontend)   │
        └──────────────┘         └──────────────┘
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │ Dictionary   │         │   Browser    │
        │    Data      │         │ Client-side  │
        │  (JSON)      │         │   Routing    │
        └──────────────┘         └──────────────┘
                                         │
                                         ▼
                                  User Browser
                                localhost:3000
```

### Production Flow:
1. PM2 starts multiple instances (cluster mode)
2. Each instance runs Express server on port 3000
3. Express serves BOTH:
   - API endpoints at `/api/*`
   - Frontend static files at `/*`
4. Client-side routing handled by serving `index.html`
5. Load balanced across all CPU cores
6. Auto-restart on crashes
7. Zero-downtime reloads

---

## Request Flow Diagram

### Development Request Flow

```
User Browser (localhost:5173)
       │
       ├─► Static Files ──────► Vite Dev Server
       │                        (Hot Reload)
       │
       └─► API Requests (/api)
                 │
                 ▼
           Vite Proxy
                 │
                 ▼
           Backend Server (localhost:3000)
                 │
                 ├─► Routes
                 ├─► Controllers
                 └─► Data/JSON
```

### Production Request Flow

```
User Browser (localhost:3000)
       │
       ▼
   PM2 Load Balancer
       │
       ├─────────┬─────────┬─────────┐
       ▼         ▼         ▼         ▼
   Instance1 Instance2 Instance3  InstanceN
       │         │         │         │
       └─────────┴─────────┴─────────┘
                 │
                 ▼
         Express Server
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
   API Route?         Static File?
   (/api/*)              (/*)
       │                   │
       ▼                   ▼
  Process API         Serve from
    Request          frontend/dist/
       │                   │
       ▼                   ▼
  JSON Response      HTML/CSS/JS
```

---

## Build Process

```
┌─────────────────────────────────────────────────────────────┐
│                        BUILD PROCESS                         │
└─────────────────────────────────────────────────────────────┘

npm run build
      │
      ├─► npm run build:frontend
      │        │
      │        ├─► vue-tsc (Type check)
      │        │
      │        ├─► vite build
      │        │        │
      │        │        ├─► Bundle Vue components
      │        │        ├─► Process Tailwind CSS
      │        │        ├─► Minify JS/CSS
      │        │        └─► Generate assets
      │        │
      │        └─► Output: frontend/dist/
      │                 ├─── index.html
      │                 ├─── assets/
      │                 │     ├── index.js
      │                 │     └── index.css
      │                 └─── ...
      │
      └─► npm run build:backend
               │
               ├─► tsc (TypeScript compile)
               │
               ├─► npm run copy-data
               │        │
               │        └─► Copy src/data/ to dist/data/
               │
               └─► Output: backend/dist/
                        ├─── index.js
                        ├─── routes/
                        ├─── utils/
                        └─── data/
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT SETUP                          │
└─────────────────────────────────────────────────────────────┘

Development Machine                Production Server
       │                                  │
       │  1. git push                     │
       ▼                                  ▼
   Git Repository ────────────────► git pull
       │                                  │
       │                                  ▼
       │                          npm run build
       │                                  │
       │                                  ├─► Build Frontend
       │                                  └─► Build Backend
       │                                  │
       │                                  ▼
       │                          npm run start:pm2
       │                                  │
       │                                  ├─► Start PM2
       │                                  ├─► Cluster Mode
       │                                  └─► Monitor
       │                                  │
       │                                  ▼
       │                           Application Running
       │                                  │
       │                                  ├─► Auto-restart
       │                                  ├─► Load balancing
       │                                  └─► Logging
       │
       └────────────────────────────────────┘
```

---

## File System Structure

```
Dictionary/
│
├── backend/
│   ├── src/                    # Source TypeScript files
│   │   ├── index.ts           # Main server file
│   │   ├── routes/            # API route handlers
│   │   ├── utils/             # Helper functions
│   │   └── data/              # Dictionary JSON files
│   │
│   ├── dist/                  # Compiled JavaScript (production)
│   │   ├── index.js          # Compiled server
│   │   ├── routes/           # Compiled routes
│   │   ├── utils/            # Compiled utilities
│   │   └── data/             # Copied data files
│   │
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript config
│
├── frontend/
│   ├── src/                   # Source Vue files
│   │   ├── main.ts           # App entry point
│   │   ├── App.vue           # Root component
│   │   ├── router/           # Vue Router
│   │   ├── views/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── composables/      # Composition API
│   │   └── types/            # TypeScript types
│   │
│   ├── dist/                  # Built static files (production)
│   │   ├── index.html        # Main HTML file
│   │   └── assets/           # Bundled JS/CSS
│   │
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.ts        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS config
│
├── logs/                      # PM2 logs (production)
│   ├── err.log               # Error logs
│   ├── out.log               # Output logs
│   └── combined.log          # All logs
│
├── ecosystem.config.js        # PM2 configuration
├── package.json              # Root scripts
├── .env                      # Environment variables
└── [Documentation files]
```

---

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐
│       FRONTEND          │  │       BACKEND           │
├─────────────────────────┤  ├─────────────────────────┤
│  Vue 3 (Framework)      │  │  Express (Framework)    │
│  TypeScript (Language)  │  │  TypeScript (Language)  │
│  Vue Router (Routing)   │  │  Node.js (Runtime)      │
│  Tailwind (Styling)     │  │                         │
│  Axios (HTTP Client)    │  │  CORS (Middleware)      │
│  Vite (Build Tool)      │  │  JSON (Data Format)     │
└─────────────────────────┘  └─────────────────────────┘
           │                            │
           └────────────┬───────────────┘
                        │
           ┌────────────▼────────────┐
           │   PROCESS MANAGEMENT    │
           ├─────────────────────────┤
           │  PM2 (Cluster Mode)     │
           │  Auto-restart           │
           │  Load Balancing         │
           │  Log Management         │
           └─────────────────────────┘
```

---

## Monitoring & Logging Flow

```
Application Instances
       │
       ├─► stdout ──────┐
       ├─► stderr ──────┤
       └─► events ──────┤
                        │
                        ▼
                    PM2 Logger
                        │
                        ├─► logs/out.log
                        ├─► logs/err.log
                        └─► logs/combined.log
                        │
                        ▼
                 View with PM2
                        │
                        ├─► pm2 logs
                        ├─► pm2 monit
                        └─► pm2 describe
```

---

This architecture ensures:
- ✅ Easy development with hot reload
- ✅ Efficient production with clustering
- ✅ Single port deployment (3000)
- ✅ Automatic failover and restart
- ✅ Optimal resource utilization
- ✅ Simple update workflow
