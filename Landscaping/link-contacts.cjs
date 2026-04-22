const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const allFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const emailPlain = "info@unitedremodelingca.com";
const emailLink = `<a href="mailto:info@unitedremodelingca.com" class="hover:text-[#f68712] transition-colors">info@unitedremodelingca.com</a>`;

const phonePlain = "805-232-5817";
const phoneLink = `<a href="tel:8052325817" class="hover:text-[#f68712] transition-colors">805-232-5817</a>`;

let emailCount = 0;
let phoneCount = 0;

allFiles.forEach(file => {
    const p = path.join(rootDir, file);
    let code = fs.readFileSync(p, 'utf8');

    // Simple replacement ensuring we don't accidentally double-wrap if executed twice.
    // Regex matches the explicit strings ONLY if they are not already preceded by 'mailto:' or 'tel:'
    
    // Replace emails specifically NOT surrounded by quotes, mailto:, etc.
    const emailRegex = /(?<!mailto:|">|text-white">)info@unitedremodelingca\.com(?!<\/a>)/g;
    if (code.match(emailRegex)) {
        code = code.replace(emailRegex, emailLink);
        emailCount++;
    }

    // Replace phone specifically NOT surrounded by tel: or quotes
    const phoneRegex = /(?<!tel:|">|text-white">)805-232-5817(?!<\/a>)/g;
    if (code.match(phoneRegex)) {
        code = code.replace(phoneRegex, phoneLink);
        phoneCount++;
    }

    fs.writeFileSync(p, code, 'utf8');
});

console.log(`Successfully mapped ${emailCount} templates for email links and ${phoneCount} templates for phone links natively.`);
