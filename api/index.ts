// Serverless function entry point for Vercel
import express, { Application } from 'express';
import cors from 'cors';
import dictionaryRoutes from '../dist/server/routes/dictionary.js';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dictionary', dictionaryRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Bishnupriya Dictionary API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Export the Express app as a serverless function
export default app;
