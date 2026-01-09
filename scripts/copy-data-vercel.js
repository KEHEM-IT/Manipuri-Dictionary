// Copy data files to the correct location for Vercel
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src/server/data');
const destDirs = [
    path.join(__dirname, '../dist/server/data'),
    path.join(__dirname, '../api/data')  // For Vercel serverless
];

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

console.log('📦 Copying data files for Vercel deployment...');
console.log(`   From: ${srcDir}`);

if (fs.existsSync(srcDir)) {
    for (const destDir of destDirs) {
        console.log(`   To:   ${destDir}`);
        copyRecursive(srcDir, destDir);
    }
    console.log('✅ Data files copied successfully!');
} else {
    console.log('⚠️  Source data directory not found. Skipping...');
}
