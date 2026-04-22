import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = process.cwd();
const dirs = ['Uploads', 'Uploads/Gallery', 'images', 'images/services'];

const compressImages = async () => {
    let oldBytes = 0;
    let newBytes = 0;

    for (const d of dirs) {
        const fullDir = path.join(dir, d);
        if (!fs.existsSync(fullDir)) continue;

        const files = fs.readdirSync(fullDir);
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const filePath = path.join(fullDir, file);
                const stat = fs.statSync(filePath);
                
                // Only compress chunks bigger than 300KB
                if (stat.size > 300000) {
                    oldBytes += stat.size;
                    const tempPath = filePath + '.tmp';
                    
                    if (ext === '.png') {
                        await sharp(filePath).resize({ width: 1920, withoutEnlargement: true }).png({ quality: 75 }).toFile(tempPath);
                    } else {
                        await sharp(filePath).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 75 }).toFile(tempPath);
                    }
                    
                    fs.unlinkSync(filePath);
                    fs.renameSync(tempPath, filePath);
                    
                    const newStat = fs.statSync(filePath);
                    newBytes += newStat.size;
                    console.log(`Compressed ${file}: ${(stat.size/1024/1024).toFixed(2)}MB -> ${(newStat.size/1024/1024).toFixed(2)}MB`);
                }
            }
        }
    }
    
    console.log(`\nAggressive optimization complete! Saved ${((oldBytes - newBytes)/1024/1024).toFixed(2)} MB of bandwidth!`);
};

compressImages().catch(console.error);
