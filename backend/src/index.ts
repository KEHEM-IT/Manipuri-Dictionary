// Location: backend/src/index.ts
import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import dictionaryRoutes from './routes/dictionary';

const app: Application = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/dictionary', dictionaryRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Bishnupriya Dictionary API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve static frontend files in production
if (isProduction) {
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    
    // Serve static files
    app.use(express.static(frontendPath));
    
    // Handle client-side routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
} else {
    // 404 handler for development
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: 'Route not found'
        });
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (isProduction) {
        console.log('Serving frontend from backend in production mode');
    }
});