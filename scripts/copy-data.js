import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src/server/data');
const destDir = path.join(__dirname, '../dist/server/data');

function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('📦 Copying data files...');
console.log(`   From: ${srcDir}`);
console.log(`   To:   ${destDir}`);

if (fs.existsSync(srcDir)) {
    copyRecursive(srcDir, destDir);
    console.log('✅ Data files copied successfully!');
} else {
    console.log('⚠️  Source data directory not found. Skipping...');
}
