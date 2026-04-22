const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

const swiperJsCdn = '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>\n<script src="./main.js"></script>';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Fix BBB Logo case-sensitive absolute path failure mapping
        content = content.replace(/url\('\/uploads\//gi, "url('./Uploads/");
        content = content.replace(/url\('\/Uploads\//gi, "url('./Uploads/");

        // Inject Swiper JS correctly by targeting the explicit relative path we created earlier
        content = content.replace(/<script type="module" src="\.\/main\.js"><\/script>/g, swiperJsCdn);
        content = content.replace(/<script src="\.\/main\.js"><\/script>/g, swiperJsCdn);

        // Sanitize duplicates if any
        if(content.split('<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>').length > 2) {
            content = content.replace('<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>\n', '');
        }

        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Repaired bugs in ${file}`);
        count++;
    }
});
console.log(`Repaired ${count} views successfully.`);
