// Location: backend/src/routes/dictionary.ts
import { Router, Request, Response } from 'express';
import {
    getAllWords,
    searchWordInAlphabets,
    getWordById,
    getAllAlphabets,
    getWordsByAlphabet
} from '../utils/alphabetHelper';

const router = Router();

/**
 * GET /api/dictionary/words
 * Get all words from all alphabet files
 */
router.get('/words', (_req: Request, res: Response) => {
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
            error: 'Failed to retrieve words'
        });
    }
});

/**
 * GET /api/dictionary/search?term=জাকা&language=bpy
 * Search for words - automatically finds the correct alphabet file
 */
router.get('/search', (req: Request, res: Response) => {
    const { term, language } = req.query;

    if (!term || !language) {
        return res.status(400).json({
            success: false,
            error: 'Term and language are required'
        });
    }

    const lang = language as 'bpy' | 'bn' | 'en';

    if (!['bpy', 'bn', 'en'].includes(lang)) {
        return res.status(400).json({
            success: false,
            error: 'Language must be one of: bpy, bn, en'
        });
    }

    // Trim the search term to remove leading/trailing whitespace
    const trimmedTerm = (term as string).trim();

    if (!trimmedTerm) {
        return res.status(400).json({
            success: false,
            error: 'Search term cannot be empty'
        });
    }

    try {
        const results = searchWordInAlphabets(trimmedTerm, lang);

        res.json({
            success: true,
            count: results.length,
            searchTerm: trimmedTerm,
            language: lang,
            data: results
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            error: 'Search failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * GET /api/dictionary/word/:id
 * Get a specific word by ID
 */
router.get('/word/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    try {
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
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve word'
        });
    }
});

/**
 * GET /api/dictionary/alphabets
 * Get all available alphabets
 */
router.get('/alphabets', (_req: Request, res: Response) => {
    try {
        const alphabets = getAllAlphabets();
        res.json({
            success: true,
            count: alphabets.length,
            data: alphabets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve alphabets'
        });
    }
});

/**
 * GET /api/dictionary/alphabet/:letter
 * Get all words starting with a specific alphabet
 */
router.get('/alphabet/:letter', (req: Request, res: Response) => {
    const { letter } = req.params;

    try {
        const words = getWordsByAlphabet(letter);

        if (words.length === 0) {
            return res.status(404).json({
                success: false,
                error: `No words found for alphabet: ${letter}`
            });
        }

        res.json({
            success: true,
            alphabet: letter,
            count: words.length,
            data: words
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve words for alphabet'
        });
    }
});

export default router;