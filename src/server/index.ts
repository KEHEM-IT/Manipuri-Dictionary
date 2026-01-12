import express, { Application } from 'express';
import 'dotenv/config';
import app from './app.js';

import cors from 'cors';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dictionaryRoutes from './routes/dictionary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dictionary', dictionaryRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Bishnupriya Dictionary API is running',
        timestamp: new Date().toISOString()
    });
});

// Debug endpoint to check file system
app.get('/api/debug', (_req, res) => {
    const fs = require('fs');
    const path = require('path');

    const diagnostics = {
        cwd: process.cwd(),
        __dirname: __dirname || 'not available',
        nodeVersion: process.version,
        platform: process.platform,
        env: process.env.VERCEL ? 'vercel' : 'local',
        paths: {} as any
    };

    // Check various possible paths
    const pathsToCheck = [
        './dist/server/data/alphabets',
        './src/server/data/alphabets',
        './api/data/alphabets',
        '/var/task/dist/server/data/alphabets',
        path.join(process.cwd(), 'dist/server/data/alphabets'),
        path.join(process.cwd(), 'src/server/data/alphabets'),
    ];

    pathsToCheck.forEach(p => {
        try {
            const exists = fs.existsSync(p);
            diagnostics.paths[p] = {
                exists,
                files: exists ? fs.readdirSync(p).slice(0, 5) : []
            };
        } catch (e: any) {
            diagnostics.paths[p] = { error: e.message };
        }
    });

    res.json(diagnostics);
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});