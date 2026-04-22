const fs = require('fs');
const path = require('path');

const dir = __dirname;
let updatedCount = 0;

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Regex to capture the entire consent block and extract its dynamic ID.
        // It matches from <div class="flex items-start... down to </div> right before <button
        const consentRegex = /<div class="flex items-start gap-3 pt-2 pb-2">[\s\S]*?<input type="checkbox"[^>]*id="([^"]+)"[^>]*>[\s\S]*?<\/label>\s*<\/div>/g;
        
        const newContent = content.replace(consentRegex, (match, idStr) => {
            return `<div class="flex items-start gap-3 pt-2 pb-4">
                    <input type="checkbox" name="Data_Consent" id="${idStr}" class="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#f68712] focus:ring-[#f68712] transition-colors cursor-pointer" required>
                    <label for="${idStr}" class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        I authorize UNITED REMODELING and/or its dealers to call and/or text me about its products at the number I entered above, using an automatic dialing system, even if I am on a “Do Not Call” list. Msg/data rates may apply. Consent here is not a condition of purchase. Please read our <span class="open-privacy-modal text-[#f68712] cursor-pointer hover:underline transition-all">privacy policy</span> for more information about how we collect and use personal information.
                    </label>
                </div>`;
        });
        
        // Let's also ensure privacy-link ID works if it's there
        const finalContent = newContent.replace(/<a href="#" id="privacy-link"[^>]*>[\s\S]*?<\/a>/g, '');

        if (content !== finalContent) {
            fs.writeFileSync(path.join(dir, file), finalContent);
            console.log(`Updated consent text in ${file}`);
            updatedCount++;
        }
    }
});
console.log(`Global consent update complete. Modified ${updatedCount} files.`);
