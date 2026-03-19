const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');

        // Restore Vite module tracking so Rollup doesn't skip building Javascript outputs
        content = content.replace(/<script src="\.\/main\.js"><\/script>/g, '<script type="module" src="./main.js"></script>');

        if (content !== fs.readFileSync(path.join(dir, file), 'utf8')) {
            fs.writeFileSync(path.join(dir, file), content);
            console.log(`Restored Rollup compiler tracking for ${file}`);
            count++;
        }
    }
});
console.log(`Successfully synced Javascript Vite builds across ${count} views.`);
