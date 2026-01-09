import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Word } from '../types/index.js';

// Bishnupriya Manipuri alphabets mapping
const ALPHABET_MAP: { [key: string]: string } = {
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

/**
 * Get the first character of a Bishnupriya word
 * Handles Bengali script properly
 */
export function getFirstCharacter(word: string): string {
    if (!word || word.length === 0) return '';

    // Get the first character
    const firstChar = word.charAt(0);

    console.log(`First character of "${word}": "${firstChar}" (Unicode: ${firstChar.charCodeAt(0).toString(16)})`);

    return firstChar;
}

/**
 * Get the alphabet file name for a given character
 */
export function getAlphabetFileName(character: string): string | null {
    const fileName = ALPHABET_MAP[character];
    console.log(`Looking for alphabet file for "${character}": ${fileName || 'NOT FOUND'}`);
    return fileName || null;
}

/**
 * Load words from an alphabet JSON file
 */
export function loadAlphabetFile(fileName: string): Word[] {
    try {
        // Try multiple path resolutions to handle both src and dist directories
        const possiblePaths = [
            path.join(__dirname, '../data/alphabets', fileName),
            path.join(__dirname, '../../src/data/alphabets', fileName),
            path.join(process.cwd(), 'src/data/alphabets', fileName),
            path.join(process.cwd(), 'src/server/data/alphabets', fileName),
            path.join(process.cwd(), 'dist/server/data/alphabets', fileName),
        ];

        let filePath = '';
        for (const tryPath of possiblePaths) {
            if (fs.existsSync(tryPath)) {
                filePath = tryPath;
                break;
            }
        }

        if (!filePath) {
            console.warn(`Alphabet file not found: ${fileName}. Tried paths:`, possiblePaths);
            return [];
        }

        console.log(`Attempting to load file: ${filePath}`);

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        // Handle both direct array format and object with 'words' property
        let words: Word[] = Array.isArray(data) ? data : (data.words || []);
        
        // Generate ASCII-safe IDs if they don't exist (hex hash)
        words = words.map((word, index) => {
            if (word.id && typeof word.id === 'string') return word;

            const seed = `${word.bpy || ''}|${word.bn || ''}|${word.en || ''}|${fileName}|${index}`;
            const hash = crypto.createHash('sha1').update(seed).digest('hex').slice(0, 12);
            return {
                ...word,
                id: hash
            } as Word;
        });
        
        console.log(`Loaded ${words.length} words from ${fileName}`);
        return words;
    } catch (error) {
        console.error(`Error loading alphabet file ${fileName}:`, error);
        return [];
    }
}

/**
 * Search for a word in the appropriate alphabet file(s)
 */
export function searchWordInAlphabets(
    searchTerm: string,
    language: 'bpy' | 'bn' | 'en'
): Word[] {
    const results: Word[] = [];
    const searchLower = searchTerm.toLowerCase();

    console.log(`\n=== Searching for "${searchTerm}" in language "${language}" ===`);

    // For Bishnupriya search, we know which file to check
    if (language === 'bpy') {
        const firstChar = getFirstCharacter(searchTerm);
        const fileName = getAlphabetFileName(firstChar);

        if (fileName) {
            console.log(`Searching in specific file: ${fileName}`);
            const words = loadAlphabetFile(fileName);
            const matches = words.filter(word => {
                const match = word.bpy.toLowerCase().includes(searchLower);
                if (match) {
                    console.log(`Found match: ${word.bpy}`);
                }
                return match;
            });
            results.push(...matches);
        } else {
            console.log(`No alphabet file found for character: ${firstChar}`);
        }
    } else {
        // For Bengali/English, we need to search all files
        console.log(`Searching all files for ${language} term`);
        const allFiles = Object.values(ALPHABET_MAP);

        for (const fileName of allFiles) {
            const words = loadAlphabetFile(fileName);
            const matches = words.filter(word =>
                word[language].toLowerCase().includes(searchLower)
            );
            if (matches.length > 0) {
                console.log(`Found ${matches.length} matches in ${fileName}`);
            }
            results.push(...matches);
        }
    }

    console.log(`Total results found: ${results.length}\n`);
    return results;
}

/**
 * Get a word by its ID (searches all alphabet files)
 */
export function getWordById(id: string): Word | null {
    const allFiles = Object.values(ALPHABET_MAP);

    for (const fileName of allFiles) {
        const words = loadAlphabetFile(fileName);
        const word = words.find(w => w.id === id);

        if (word) {
            return word;
        }
    }

    return null;
}

/**
 * Get all words from all alphabet files
 */
export function getAllWords(): Word[] {
    const allWords: Word[] = [];
    const allFiles = Object.values(ALPHABET_MAP);

    for (const fileName of allFiles) {
        const words = loadAlphabetFile(fileName);
        allWords.push(...words);
    }

    return allWords;
}

/**
 * Get all available alphabets
 */
export function getAllAlphabets(): string[] {
    return Object.keys(ALPHABET_MAP);
}

/**
 * Get words by alphabet letter
 */
export function getWordsByAlphabet(letter: string): Word[] {
    const fileName = getAlphabetFileName(letter);

    if (!fileName) {
        return [];
    }

    return loadAlphabetFile(fileName);
}
