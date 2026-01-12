// src/server/routes/admin.ts
import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import * as fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Word } from '../types';
import {
    getAllWords,
    getWordById,
    getAllAlphabets,
    getWordsByAlphabet,
    loadAlphabetFile
} from '../utils/alphabetHelper';

const router = Router();

// Demo admin credentials - Replace with database in production
const ADMIN_USERS = [
    {
        id: '1',
        username: 'admin',
        password: crypto.createHash('sha256').update('admin123').digest('hex'), // Hashed password
        email: 'admin@bmdictionary.com',
        role: 'admin'
    }
];

// Middleware to verify JWT token (simplified for demo)
const verifyToken = (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'No token provided'
        });
    }

    // In production, verify JWT properly
    // For demo, just check if token exists
    if (token.startsWith('demo_token_')) {
        next();
    } else {
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

/**
 * POST /api/admin/login
 * Admin login
 */
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password are required'
        });
    }

    try {
        // Hash the provided password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Find user
        const user = ADMIN_USERS.find(
            u => u.username === username && u.password === hashedPassword
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token (in production, use JWT)
        const token = 'demo_token_' + Date.now();

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

/**
 * GET /api/admin/test
 * Test endpoint to check data loading
 */
router.get('/test', verifyToken, (_req: Request, res: Response) => {
    try {
        const alphabets = getAllAlphabets();
        const testLetter = 'অ';
        const testWords = getWordsByAlphabet(testLetter);
        
        res.json({
            success: true,
            data: {
                totalAlphabets: alphabets.length,
                alphabets: alphabets.slice(0, 5),
                testLetter,
                testWordsCount: testWords.length,
                sampleWords: testWords.slice(0, 3)
            }
        });
    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({
            success: false,
            error: 'Test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
    }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', verifyToken, async (_req: Request, res: Response) => {
    try {
        console.log('=== Getting Stats ===');
        const alphabets = getAllAlphabets();
        console.log(`Total alphabets: ${alphabets.length}`);
        
        // Count words efficiently by reading each file
        let totalWords = 0;
        const categories = new Map<string, number>();
        let successfulLoads = 0;
        let failedLoads = 0;
        
        for (const letter of alphabets) {
            try {
                const words = getWordsByAlphabet(letter);
                if (words && words.length > 0) {
                    totalWords += words.length;
                    successfulLoads++;
                    
                    // Count categories (limit to first 100 words per file for performance)
                    words.slice(0, 100).forEach(word => {
                        if (word.cat && Array.isArray(word.cat)) {
                            word.cat.forEach(category => {
                                categories.set(category, (categories.get(category) || 0) + 1);
                            });
                        }
                    });
                }
            } catch (error) {
                failedLoads++;
                console.error(`Error loading alphabet ${letter}:`, error);
            }
        }

        console.log(`Loaded ${successfulLoads} alphabets successfully, ${failedLoads} failed`);
        console.log(`Total words: ${totalWords}`);

        // Get user-submitted words
        const usersDataDir = path.join(__dirname, '../data/usersData');
        let pendingWords = 0;
        try {
            const files = await fs.readdir(usersDataDir);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const content = await fs.readFile(path.join(usersDataDir, file), 'utf-8');
                    const data = JSON.parse(content);
                    if (data.words && Array.isArray(data.words)) {
                        pendingWords += data.words.filter((w: any) => w.status === 'pending').length;
                    }
                }
            }
        } catch (error) {
            console.log('No pending words directory or empty:', error);
        }

        // Mock data for other stats (replace with actual data from analytics)
        const stats = {
            totalWords,
            totalAlphabets: alphabets.length,
            pendingWords,
            approvedWords: totalWords,
            activeUsers: 1284, // Mock - replace with actual user count
            dailySearches: 456, // Mock - replace with actual analytics
            weeklyGrowth: 12.5, // Mock - calculate from actual data
            categories: Array.from(categories.entries()).map(([name, count]) => ({
                name,
                count
            })).sort((a, b) => b.count - a.count).slice(0, 10),
            recentActivity: [], // Will be populated by separate endpoint
            debug: {
                successfulLoads,
                failedLoads
            }
        };

        console.log('Stats ready:', JSON.stringify(stats, null, 2));

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve statistics',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
    }
});

/**
 * GET /api/admin/words
 * Get all words with pagination and filters
 */
router.get('/words', verifyToken, (_req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', search = '', alphabet = '', status = 'all' } = _req.query;

        let words: Word[] = [];

        // Filter by alphabet
        if (alphabet && alphabet !== 'all') {
            words = getWordsByAlphabet(alphabet as string);
        } else {
            // Get words from first few alphabets only for performance
            const alphabets = getAllAlphabets().slice(0, 10);
            for (const letter of alphabets) {
                try {
                    const letterWords = getWordsByAlphabet(letter);
                    words.push(...letterWords);
                } catch (error) {
                    console.error(`Error loading ${letter}:`, error);
                }
            }
        }

        // Filter by search term
        if (search) {
            const searchLower = (search as string).toLowerCase();
            words = words.filter(word =>
                word.bpy?.toLowerCase().includes(searchLower) ||
                word.bn?.toLowerCase().includes(searchLower) ||
                word.en?.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;

        const paginatedWords = words.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: {
                words: paginatedWords,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: words.length,
                    totalPages: Math.ceil(words.length / limitNum)
                }
            }
        });
    } catch (error) {
        console.error('Get words error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve words',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * GET /api/admin/word/:id
 * Get single word by ID
 */
router.get('/word/:id', verifyToken, (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const word = getWordById(id);

        if (!word) {
            return res.status(404).json({
                success: false,
                error: 'Word not found'
            });
        }

        res.json({
            success: true,
            data: word
        });
    } catch (error) {
        console.error('Get word error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve word'
        });
    }
});

/**
 * PUT /api/admin/word/:id
 * Update a word
 */
router.put('/word/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const word = getWordById(id);
        if (!word) {
            return res.status(404).json({
                success: false,
                error: 'Word not found'
            });
        }

        // Determine which alphabet file this word belongs to
        const firstChar = word.bpy.charAt(0);
        const fileName = `${firstChar}.json`;
        const alphabetsDir = path.join(__dirname, '../data/alphabets');
        const filePath = path.join(alphabetsDir, fileName);

        // Read the file
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        let words: Word[] = Array.isArray(data) ? data : (data.words || []);

        // Find and update the word
        const index = words.findIndex(w => w.id === id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Word not found in file'
            });
        }

        words[index] = { ...words[index], ...updatedData, id };

        // Write back to file
        const fileData = Array.isArray(data) ? words : { ...data, words };
        await fs.writeFile(filePath, JSON.stringify(fileData, null, 2), 'utf-8');

        res.json({
            success: true,
            message: 'Word updated successfully',
            data: words[index]
        });
    } catch (error) {
        console.error('Update word error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update word'
        });
    }
});

/**
 * DELETE /api/admin/word/:id
 * Delete a word
 */
router.delete('/word/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const word = getWordById(id);
        if (!word) {
            return res.status(404).json({
                success: false,
                error: 'Word not found'
            });
        }

        // Determine which alphabet file this word belongs to
        const firstChar = word.bpy.charAt(0);
        const fileName = `${firstChar}.json`;
        const alphabetsDir = path.join(__dirname, '../data/alphabets');
        const filePath = path.join(alphabetsDir, fileName);

        // Read the file
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        let words: Word[] = Array.isArray(data) ? data : (data.words || []);

        // Filter out the word
        words = words.filter(w => w.id !== id);

        // Write back to file
        const fileData = Array.isArray(data) ? words : { ...data, words };
        await fs.writeFile(filePath, JSON.stringify(fileData, null, 2), 'utf-8');

        res.json({
            success: true,
            message: 'Word deleted successfully'
        });
    } catch (error) {
        console.error('Delete word error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete word'
        });
    }
});

/**
 * POST /api/admin/word
 * Add a new word (directly to alphabets, not usersData)
 */
router.post('/word', verifyToken, async (req: Request, res: Response) => {
    try {
        const wordData = req.body;

        if (!wordData.bpy) {
            return res.status(400).json({
                success: false,
                error: 'Bishnupriya word is required'
            });
        }

        // Generate ID
        const id = crypto.randomBytes(6).toString('hex');
        const newWord = {
            ...wordData,
            id
        };

        // Determine alphabet file
        const firstChar = wordData.bpy.charAt(0);
        const fileName = `${firstChar}.json`;
        const alphabetsDir = path.join(__dirname, '../data/alphabets');
        const filePath = path.join(alphabetsDir, fileName);

        // Read existing data
        let fileData: any;
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            fileData = JSON.parse(content);
        } catch {
            fileData = { letter: firstChar, words: [] };
        }

        let words: Word[] = Array.isArray(fileData) ? fileData : (fileData.words || []);
        words.push(newWord);

        // Write back
        const finalData = Array.isArray(fileData) ? words : { ...fileData, words };
        await fs.writeFile(filePath, JSON.stringify(finalData, null, 2), 'utf-8');

        res.json({
            success: true,
            message: 'Word added successfully',
            data: newWord
        });
    } catch (error) {
        console.error('Add word error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add word'
        });
    }
});

/**
 * GET /api/admin/pending-words
 * Get all pending words from usersData
 */
router.get('/pending-words', verifyToken, async (_req: Request, res: Response) => {
    try {
        const usersDataDir = path.join(__dirname, '../data/usersData');
        const pendingWords: any[] = [];

        try {
            const files = await fs.readdir(usersDataDir);
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(usersDataDir, file);
                    const content = await fs.readFile(filePath, 'utf-8');
                    const data = JSON.parse(content);
                    
                    if (data.words && Array.isArray(data.words)) {
                        const pending = data.words
                            .filter((w: any) => w.status === 'pending')
                            .map((w: any) => ({
                                ...w,
                                fileName: file,
                                letter: data.letter
                            }));
                        pendingWords.push(...pending);
                    }
                }
            }
        } catch (error) {
            console.log('No pending words directory found');
        }

        res.json({
            success: true,
            count: pendingWords.length,
            data: pendingWords
        });
    } catch (error) {
        console.error('Get pending words error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve pending words'
        });
    }
});

/**
 * POST /api/admin/approve-word/:id
 * Approve a pending word and move it to main dictionary
 */
router.post('/approve-word/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usersDataDir = path.join(__dirname, '../data/usersData');
        const alphabetsDir = path.join(__dirname, '../data/alphabets');

        // Find the word in usersData
        const files = await fs.readdir(usersDataDir);
        let wordToApprove: any = null;
        let sourceFile = '';

        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(usersDataDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const data = JSON.parse(content);

                if (data.words && Array.isArray(data.words)) {
                    const word = data.words.find((w: any) => w.id === id);
                    if (word) {
                        wordToApprove = word;
                        sourceFile = file;
                        break;
                    }
                }
            }
        }

        if (!wordToApprove) {
            return res.status(404).json({
                success: false,
                error: 'Pending word not found'
            });
        }

        // Add to main dictionary
        const firstChar = wordToApprove.bpy.charAt(0);
        const targetFile = `${firstChar}.json`;
        const targetPath = path.join(alphabetsDir, targetFile);

        let targetData: any;
        try {
            const content = await fs.readFile(targetPath, 'utf-8');
            targetData = JSON.parse(content);
        } catch {
            targetData = { letter: firstChar, words: [] };
        }

        let words: Word[] = Array.isArray(targetData) ? targetData : (targetData.words || []);
        
        // Remove status and addedAt fields
        const { status, addedAt, fileName, letter, ...cleanWord } = wordToApprove;
        words.push(cleanWord);

        const finalData = Array.isArray(targetData) ? words : { ...targetData, words };
        await fs.writeFile(targetPath, JSON.stringify(finalData, null, 2), 'utf-8');

        // Remove from usersData
        const sourcePath = path.join(usersDataDir, sourceFile);
        const sourceContent = await fs.readFile(sourcePath, 'utf-8');
        const sourceData = JSON.parse(sourceContent);
        sourceData.words = sourceData.words.filter((w: any) => w.id !== id);
        await fs.writeFile(sourcePath, JSON.stringify(sourceData, null, 2), 'utf-8');

        res.json({
            success: true,
            message: 'Word approved and added to dictionary'
        });
    } catch (error) {
        console.error('Approve word error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to approve word'
        });
    }
});

/**
 * DELETE /api/admin/pending-word/:id
 * Reject a pending word
 */
router.delete('/pending-word/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usersDataDir = path.join(__dirname, '../data/usersData');

        const files = await fs.readdir(usersDataDir);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(usersDataDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const data = JSON.parse(content);

                if (data.words && Array.isArray(data.words)) {
                    const wordIndex = data.words.findIndex((w: any) => w.id === id);
                    if (wordIndex !== -1) {
                        data.words.splice(wordIndex, 1);
                        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
                        
                        return res.json({
                            success: true,
                            message: 'Pending word rejected and removed'
                        });
                    }
                }
            }
        }

        res.status(404).json({
            success: false,
            error: 'Pending word not found'
        });
    } catch (error) {
        console.error('Reject word error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reject word'
        });
    }
});

/**
 * GET /api/admin/alphabets
 * Get all alphabets with word counts
 */
router.get('/alphabets', verifyToken, (_req: Request, res: Response) => {
    try {
        const alphabets = getAllAlphabets();
        const alphabetStats = alphabets.map(letter => {
            try {
                const words = getWordsByAlphabet(letter);
                return {
                    letter,
                    count: words.length
                };
            } catch (error) {
                return {
                    letter,
                    count: 0
                };
            }
        });

        res.json({
            success: true,
            data: alphabetStats
        });
    } catch (error) {
        console.error('Get alphabets error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve alphabets'
        });
    }
});

export default router;
