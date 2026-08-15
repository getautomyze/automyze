const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

let fixedCount = 0;

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Find "Request AI Audit →" NOT followed by "</a>"
        // We can do this with a regex lookahead
        const regex1 = /(Request AI Audit →)(?!<\/a>)/g;
        if (regex1.test(content)) {
            content = content.replace(regex1, '$1</a>');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed missing </a> in: ${file}`);
            fixedCount++;
        }
    }
});

console.log(`Total files fixed: ${fixedCount}`);
