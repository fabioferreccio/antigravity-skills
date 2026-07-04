const fs = require('fs');
const readline = require('readline');

async function readChunk(filePath, startLine, endLine) {
    const start = parseInt(startLine, 10);
    const end = parseInt(endLine, 10);
    
    if (isNaN(start) || isNaN(end)) {
        console.error("Error: start_line and end_line must be numbers.");
        process.exit(1);
    }

    try {
        const fileStream = fs.createReadStream(filePath);
        
        fileStream.on('error', (err) => {
            console.error(`Error: ${err.message}`);
            process.exit(1);
        });

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let currentLine = 1;
        for await (const line of rl) {
            if (currentLine >= start && currentLine <= end) {
                console.log(`${currentLine.toString().padStart(4, ' ')} | ${line}`);
            } else if (currentLine > end) {
                rl.close();
                break;
            }
            currentLine++;
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

if (process.argv.length < 5) {
    console.log("Usage: node read.js <file_path> <start_line> <end_line>");
    process.exit(1);
}

readChunk(process.argv[2], process.argv[3], process.argv[4]);
