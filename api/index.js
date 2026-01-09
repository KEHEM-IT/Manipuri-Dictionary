import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check that will definitely work
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL ? 'vercel' : 'local',
        url: req.url
    });
});

// Export for Vercel
export default app;
