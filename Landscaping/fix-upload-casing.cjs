const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(file => file.endsWith('.html'));

let updatedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // MacOS natively ignored "gallery" vs "Gallery" when we dynamically built the photo grid.
    // Linux rigidly crashes Hostinger's build if the strings don't violently match perfectly.
    if (content.includes('Uploads/gallery/')) {
        content = content.replace(/Uploads\/gallery\//g, 'Uploads/Gallery/');
        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
    }
});

console.log('Successfully aligned Linux case-sensitivity AST mappings across ' + updatedCount + ' templates globally.');
