// Serverless function entry point for Vercel
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Debug endpoint - simplified, no dynamic imports
app.get('/api/debug', (_req, res) => {
    const diagnostics = {
        cwd: process.cwd(),
        __dirname: __dirname,
        nodeVersion: process.version,
        platform: process.platform,
        env: process.env.VERCEL ? 'vercel' : 'local',
        vercelRegion: process.env.VERCEL_REGION || 'none',
        paths: {}
    };
    
    // Check various possible paths
    const pathsToCheck = [
        './dist/server/data/alphabets',
        './src/server/data/alphabets',
        './api/data/alphabets',
        '/var/task/dist/server/data/alphabets',
        '/var/task/api/data/alphabets',
        path.join(process.cwd(), 'dist/server/data/alphabets'),
        path.join(process.cwd(), 'src/server/data/alphabets'),
        path.join(process.cwd(), 'api/data/alphabets'),
        path.join(__dirname, 'data/alphabets'),
        path.join(__dirname, '../dist/server/data/alphabets'),
    ];
    
    pathsToCheck.forEach(p => {
        try {
            const exists = fs.existsSync(p);
            diagnostics.paths[p] = {
                exists,
                files: exists ? fs.readdirSync(p).slice(0, 10) : []
            };
        } catch (e) {
            diagnostics.paths[p] = { error: e.message };
        }
    });
    
    res.json(diagnostics);
});

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'Bishnupriya Dictionary API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL ? 'vercel' : 'local'
    });
});

// Temporary simple dictionary endpoint for testing
app.get('/api/dictionary/test', (_req, res) => {
    res.json({
        success: true,
        message: 'Dictionary endpoint is working',
        cwd: process.cwd(),
        __dirname: __dirname
    });
});

// Dictionary routes - will be added after we confirm paths work
app.get('/api/dictionary/words', async (_req, res) => {
    try {
        // Try to import the helper
        const { getAllWords } = await import('../dist/server/utils/alphabetHelper.js');
        const words = getAllWords();
        res.json({
            success: true,
            count: words.length,
            data: words
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to load words',
            details: error.message,
            stack: error.stack
        });
    }
});

app.get('/api/dictionary/search', async (req, res) => {
    try {
        const { term, language } = req.query;
        
        if (!term || !language) {
            return res.status(400).json({
                success: false,
                error: 'Term and language are required'
            });
        }

        const { searchWordInAlphabets } = await import('../dist/server/utils/alphabetHelper.js');
        const results = searchWordInAlphabets(term, language);
        
        res.json({
            success: true,
            count: results.length,
            searchTerm: term,
            language: language,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Search failed',
            details: error.message,
            stack: error.stack
        });
    }
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Export the Express app as a serverless function
export default app;
