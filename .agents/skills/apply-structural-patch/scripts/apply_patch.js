const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function applyPatch(filePath, patchContent) {
    if (!fs.existsSync(filePath)) {
        console.error(`[ERROR] Target file not found: ${filePath}`);
        process.exit(1);
    }

    const cleanPatch = patchContent.replace(/\\n/g, '\n').trim() + '\n';
    const tempPatchPath = path.join(os.tmpdir(), `temp_${Date.now()}.patch`);

    try {
        fs.writeFileSync(tempPatchPath, cleanPatch, 'utf8');
        console.log(`Attempting to apply patch to ${filePath}...`);

        // Try git apply
        const gitResult = spawnSync('git', ['apply', '--ignore-whitespace', tempPatchPath], { encoding: 'utf8' });

        if (gitResult.status === 0) {
            console.log('[SUCCESS] Patch applied successfully via git apply.');
        } else {
            console.log(`[WARNING] git apply failed: ${gitResult.stderr.trim()}. Attempting fallback to 'patch'...`);
            
            // Fallback to patch utility
            const patchResult = spawnSync('patch', ['-p1', '--no-backup-if-mismatch', '-i', tempPatchPath], { encoding: 'utf8' });
            
            if (patchResult.status === 0) {
                console.log('[SUCCESS] Patch applied successfully via patch utility.');
            } else {
                console.error(`[ERROR] Fallback patch also failed:\n${patchResult.stderr.trim()}\n${patchResult.stdout.trim()}`);
                process.exit(1);
            }
        }
    } catch (e) {
        console.error(`[ERROR] Unexpected error while applying patch: ${e.message}`);
        process.exit(1);
    } finally {
        if (fs.existsSync(tempPatchPath)) {
            fs.unlinkSync(tempPatchPath);
        }
    }
}

if (process.argv.length < 4) {
    console.error('Usage: node apply_patch.js <file_path> <patch_content>');
    process.exit(1);
}

applyPatch(process.argv[2], process.argv[3]);
