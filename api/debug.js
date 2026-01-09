import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const diagnostics = {
        cwd: process.cwd(),
        __dirname: __dirname,
        __filename: __filename,
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
    
    res.status(200).json(diagnostics);
}
