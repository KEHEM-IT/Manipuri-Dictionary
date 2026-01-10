import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Bishnupriya Manipuri alphabets mapping
const ALPHABET_MAP = {
    'অ': 'অ.json', 'আ': 'আ.json', 'ই': 'ই.json', 'ঈ': 'ঈ.json',
    'উ': 'উ.json', 'ঊ': 'ঊ.json', 'ঋ': 'ঋ.json', 'এ': 'এ.json',
    'ঐ': 'ঐ.json', 'ও': 'ও.json', 'ঔ': 'ঔ.json',
    'ক': 'ক.json', 'খ': 'খ.json', 'গ': 'গ.json', 'ঘ': 'ঘ.json', 'ঙ': 'ঙ.json',
    'চ': 'চ.json', 'ছ': 'ছ.json', 'জ': 'জ.json', 'ঝ': 'ঝ.json', 'ঞ': 'ঞ.json',
    'ট': 'ট.json', 'ঠ': 'ঠ.json', 'ড': 'ড.json', 'ঢ': 'ঢ.json', 'ণ': 'ণ.json',
    'ত': 'ত.json', 'থ': 'থ.json', 'দ': 'দ.json', 'ধ': 'ধ.json', 'ন': 'ন.json',
    'প': 'প.json', 'ফ': 'ফ.json', 'ব': 'ব.json', 'ভ': 'ভ.json', 'ম': 'ম.json',
    'য': 'য.json', 'র': 'র.json', 'ল': 'ল.json', 'শ': 'শ.json', 'ষ': 'ষ.json',
    'স': 'স.json', 'হ': 'হ.json', 'ড়': 'ড়.json', 'ঢ়': 'ঢ়.json', 'য়': 'য়.json',
    'ৎ': 'ৎ.json', 'ং': 'ং.json', 'ঃ': 'ঃ.json', 'ঁ': 'ঁ.json'
};

// Find data directory
function findDataDir() {
    const possiblePaths = [
        path.join(process.cwd(), 'dist/server/data/alphabets'),
        path.join(process.cwd(), 'src/server/data/alphabets'),
        path.join(process.cwd(), 'api/data/alphabets'),
        path.join(__dirname, 'data/alphabets'),
        path.join(__dirname, '../dist/server/data/alphabets'),
    ];
    
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            console.log(`✅ Found data directory: ${p}`);
            return p;
        }
    }
    
    console.error('❌ Data directory not found. Tried:', possiblePaths);
    return null;
}

const DATA_DIR = findDataDir();

// Load alphabet file
function loadAlphabetFile(fileName) {
    if (!DATA_DIR) {
        console.error('Data directory not found');
        return [];
    }
    
    try {
        const filePath = path.join(DATA_DIR, fileName);
        
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            return [];
        }
        
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        let words = Array.isArray(data) ? data : (data.words || []);
        
        // Generate IDs if needed
        words = words.map((word, index) => {
            if (word.id) return word;
            const seed = `${word.bpy || ''}|${word.bn || ''}|${word.en || ''}|${fileName}|${index}`;
            const hash = crypto.createHash('sha1').update(seed).digest('hex').slice(0, 12);
            return { ...word, id: hash };
        });
        
        return words;
    } catch (error) {
        console.error(`Error loading ${fileName}:`, error);
        return [];
    }
}

// Get all words
function getAllWords() {
    const allWords = [];
    Object.values(ALPHABET_MAP).forEach(fileName => {
        const words = loadAlphabetFile(fileName);
        allWords.push(...words);
    });
    return allWords;
}

// Find word by ID across all files
function findWordById(wordId) {
    for (const fileName of Object.values(ALPHABET_MAP)) {
        const words = loadAlphabetFile(fileName);
        const found = words.find(word => word.id === wordId);
        if (found) return found;
    }
    return null;
}

// Search words
function searchWordInAlphabets(searchTerm, language) {
    const results = [];
    const searchLower = searchTerm.toLowerCase();
    
    if (language === 'bpy') {
        const firstChar = searchTerm.charAt(0);
        const fileName = ALPHABET_MAP[firstChar];
        if (fileName) {
            const words = loadAlphabetFile(fileName);
            results.push(...words.filter(word => word.bpy && word.bpy.toLowerCase().includes(searchLower)));
        }
    } else {
        Object.values(ALPHABET_MAP).forEach(fileName => {
            const words = loadAlphabetFile(fileName);
            results.push(...words.filter(word => {
                const value = word[language];
                return value && value.toLowerCase().includes(searchLower);
            }));
        });
    }
    
    return results;
}

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        dataDir: DATA_DIR || 'not found'
    });
});

app.get('/api/debug', (req, res) => {
    const diagnostics = {
        cwd: process.cwd(),
        __dirname: __dirname,
        dataDir: DATA_DIR,
        paths: {}
    };
    
    const pathsToCheck = [
        path.join(process.cwd(), 'dist/server/data/alphabets'),
        path.join(process.cwd(), 'src/server/data/alphabets'),
        path.join(process.cwd(), 'api/data/alphabets'),
        path.join(__dirname, 'data/alphabets'),
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

app.get('/api/dictionary/words', (req, res) => {
    try {
        const words = getAllWords();
        res.json({
            success: true,
            count: words.length,
            data: words
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get word by ID
app.get('/api/dictionary/word/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Word ID is required'
            });
        }
        
        const word = findWordById(id);
        
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
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/dictionary/search', (req, res) => {
    try {
        const { term, language } = req.query;
        
        if (!term || !language) {
            return res.status(400).json({
                success: false,
                error: 'Term and language are required'
            });
        }
        
        const results = searchWordInAlphabets(term.trim(), language);
        
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
            error: error.message
        });
    }
});

app.get('/api/dictionary/alphabets', (req, res) => {
    res.json({
        success: true,
        count: Object.keys(ALPHABET_MAP).length,
        data: Object.keys(ALPHABET_MAP)
    });
});

app.get('/api/dictionary/alphabet/:letter', (req, res) => {
    try {
        const { letter } = req.params;
        const fileName = ALPHABET_MAP[letter];
        
        if (!fileName) {
            return res.status(404).json({
                success: false,
                error: `No alphabet file for: ${letter}`
            });
        }
        
        const words = loadAlphabetFile(fileName);
        res.json({
            success: true,
            alphabet: letter,
            count: words.length,
            data: words
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Autocomplete endpoint for word suggestions
app.get('/api/dictionary/autocomplete', (req, res) => {
    try {
        const { term, language, limit = 10 } = req.query;
        
        if (!term || !language) {
            return res.status(400).json({
                success: false,
                error: 'Term and language are required'
            });
        }
        
        const searchTerm = term.trim().toLowerCase();
        const maxResults = parseInt(limit) || 10;
        let results = [];
        
        if (language === 'bpy') {
            // For Bishnupriya, search in the alphabet file of the first character
            const firstChar = term.charAt(0);
            const fileName = ALPHABET_MAP[firstChar];
            
            if (fileName) {
                const words = loadAlphabetFile(fileName);
                results = words.filter(word => 
                    word.bpy && word.bpy.toLowerCase().startsWith(searchTerm)
                );
            }
            
            // If not enough results, search other files
            if (results.length < maxResults) {
                Object.values(ALPHABET_MAP).forEach(fileName => {
                    if (results.length >= maxResults) return;
                    const words = loadAlphabetFile(fileName);
                    const matches = words.filter(word => 
                        word.bpy && 
                        word.bpy.toLowerCase().includes(searchTerm) &&
                        !results.some(r => r.id === word.id)
                    );
                    results.push(...matches);
                });
            }
        } else {
            // For Bengali and English, search all files
            Object.values(ALPHABET_MAP).forEach(fileName => {
                if (results.length >= maxResults) return;
                const words = loadAlphabetFile(fileName);
                const matches = words.filter(word => {
                    const value = word[language];
                    return value && value.toLowerCase().includes(searchTerm);
                });
                results.push(...matches);
            });
        }
        
        // Sort by relevance (starts with search term first)
        results.sort((a, b) => {
            const aValue = (a[language] || '').toLowerCase();
            const bValue = (b[language] || '').toLowerCase();
            const aStarts = aValue.startsWith(searchTerm);
            const bStarts = bValue.startsWith(searchTerm);
            
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return aValue.localeCompare(bValue);
        });
        
        // Limit results
        results = results.slice(0, maxResults);
        
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
            error: error.message
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

export default app;
