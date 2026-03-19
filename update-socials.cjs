const fs = require('fs');
const path = require('path');
const dir = __dirname;
let count = 0;

const yelpSmall = `<a class="size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="https://www.yelp.com/biz/united-remodeling-oxnard" target="_blank">
<i class="fa-brands fa-yelp text-lg"></i>
</a>`;

const googleSmall = `\n<a class="size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="https://g.page/r/CWfUcyxh-4PKEAE/review" target="_blank">
<i class="fa-brands fa-google text-lg"></i>
</a>`;

const yelpSmall2 = `<a class="size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="https://www.yelp.com/biz/united-remodeling-oxnard" target="_blank">
            <i class="fa-brands fa-yelp text-lg"></i>
        </a>`;

const googleSmall2 = `\n        <a class="size-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="https://g.page/r/CWfUcyxh-4PKEAE/review" target="_blank">
            <i class="fa-brands fa-google text-lg"></i>
        </a>`;


const yelpLarge = `<a class="size-[48px] rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-sm" href="https://www.yelp.com/biz/united-remodeling-oxnard" target="_blank">
                        <i class="fa-brands fa-yelp text-xl"></i>
                    </a>`;

const googleLarge = `\n                    <a class="size-[48px] rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 shadow-sm" href="https://g.page/r/CWfUcyxh-4PKEAE/review" target="_blank">
                        <i class="fa-brands fa-google text-xl"></i>
                    </a>`;


fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        let newContent = content.split(yelpSmall).join(yelpSmall + googleSmall);
        newContent = newContent.split(yelpSmall2).join(yelpSmall2 + googleSmall2);
        newContent = newContent.split(yelpLarge).join(yelpLarge + googleLarge);
        
        if (content !== newContent) {
            fs.writeFileSync(path.join(dir, file), newContent);
            console.log(`Updated social icons in ${file}`);
            count++;
        }
    }
});
console.log(`Updated ${count} files.`);
