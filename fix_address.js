const fs = require('fs');
const path = require('path');

const replacements = {
    "Location: Bandra West, Mumbai, Maharashtra, India": "Location: Mumbai, Maharashtra, India",
    "<li>Bandra West, Mumbai</li>": "<li>Mumbai, Maharashtra, India</li>",
    "- Location: Bandra West, Mumbai, Maharashtra, India": "- Location: Mumbai, Maharashtra, India"
};

function fixFile(filePath) {
    // Only process html and txt files
    if (!filePath.endsWith('.html') && !filePath.endsWith('.txt')) return;
    
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
        console.log(`Removed Bandra from: ${path.basename(filePath)}`);
    }
}

const dir = __dirname;
const files = fs.readdirSync(dir);
files.forEach(file => {
    fixFile(path.join(dir, file));
});

console.log("Done fixing addresses.");
