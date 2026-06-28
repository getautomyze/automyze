const fs = require('fs');
const path = require('path');

const replacements = {
    "â†’": "→",
    "ðŸ“ ": "📍",
    "Â·": "·",
    "â€”": "—",
    "â€“": "–",
    "â€¢": "•",
    "â• ": "═",
    "â€™": "’",
    "â€œ": "“",
    "â€": "”",
    "April": "June"
};

function fixFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    for (const [bad, good] of Object.entries(replacements)) {
        if (content.includes(bad)) {
            content = content.split(bad).join(good);
            changed = true;
        }
    }
    
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${path.basename(filePath)}`);
    }
}

const dir = __dirname;
const files = fs.readdirSync(dir);
files.forEach(file => {
    fixFile(path.join(dir, file));
});

console.log("Done fixing encodings.");
