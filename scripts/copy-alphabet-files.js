import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../../backend/src/data/alphabets');
const targetDir = path.join(__dirname, '../src/server/data/alphabets');

function copyAlphabetFiles() {
    console.log('📚 Copying alphabet JSON files...');
    console.log(`   From: ${sourceDir}`);
    console.log(`   To:   ${targetDir}`);

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log('   Created target directory');
    }

    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
        console.error('❌ Source directory not found!');
        process.exit(1);
    }

    // Read all files from source directory
    const files = fs.readdirSync(sourceDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    console.log(`   Found ${jsonFiles.length} JSON files`);

    let copiedCount = 0;
    for (const file of jsonFiles) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        
        fs.copyFileSync(sourcePath, targetPath);
        copiedCount++;
        
        if (copiedCount % 10 === 0) {
            console.log(`   Copied ${copiedCount}/${jsonFiles.length} files...`);
        }
    }

    console.log(`✅ Successfully copied ${copiedCount} alphabet files!`);
}

copyAlphabetFiles();
