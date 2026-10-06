const fs = require('fs');
const path = require('path');

const rootPath = process.argv[2];
const extensions = process.argv[3].split(',').map(ext => ext.trim().startsWith('.') ? ext.trim() : `.${ext.trim()}`);
const maxDepth = parseInt(process.argv[4], 10);

console.log(`## Architecture Map for \`${rootPath}\``);
console.log(`> [!WARNING]\n> Using fallback Node.js script (Regex-based). For true polyglot AST parsing, use Python with \`tree-sitter-languages\`.\n`);

function extractEntities(content, ext) {
    const entities = [];
    
    if (['.js', '.ts', '.java', '.cs', '.php'].includes(ext)) {
        // Naive Class matching
        const classRegex = /class\s+([A-Za-z0-9_]+)/g;
        let match;
        while ((match = classRegex.exec(content)) !== null) {
            entities.push(`- Class: ${match[1]}`);
        }
        
        // Naive Interface matching
        const interfaceRegex = /interface\s+([A-Za-z0-9_]+)/g;
        while ((match = interfaceRegex.exec(content)) !== null) {
            entities.push(`- Interface: ${match[1]}`);
        }
    }
    
    return entities;
}

function walkDir(currentPath, currentDepth) {
    if (currentDepth > maxDepth) return;

    let items;
    try {
        items = fs.readdirSync(currentPath);
    } catch (e) {
        return;
    }

    // Sort to keep output consistent
    items.sort();

    for (const item of items) {
        if (['.git', 'node_modules', 'venv', '__pycache__', 'dist', 'build', 'out'].includes(item)) {
            continue;
        }

        const itemPath = path.join(currentPath, item);
        const indent = '  '.repeat(currentDepth);

        let stat;
        try {
            stat = fs.statSync(itemPath);
        } catch (e) {
            continue;
        }

        if (stat.isDirectory()) {
            console.log(`${indent}📁 ${item}/`);
            walkDir(itemPath, currentDepth + 1);
        } else {
            const ext = path.extname(item);
            if (extensions.includes(ext)) {
                console.log(`${indent}📄 ${item}`);
                const content = fs.readFileSync(itemPath, 'utf8');
                const entities = extractEntities(content, ext);
                for (const entity of entities) {
                    console.log(`${indent}  ${entity}`);
                }
            }
        }
    }
}

walkDir(rootPath, 0);
