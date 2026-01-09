// Location: backend/src/index.ts
import express, { Application } from 'express';
import cors from 'cors';
import dictionaryRoutes from './routes/dictionary';

const app: Application = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});