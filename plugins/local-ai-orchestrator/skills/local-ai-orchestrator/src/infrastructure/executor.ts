import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Helper to determine the path to the underlying polyglot scripts
function getScriptPath(skillName: string, scriptBaseName: string): { type: 'node' | 'python', path: string } {
    // Assuming the orchestrator is in .agents/skills/local-ai-orchestrator/dist
    const repoRoot = path.join(__dirname, '..', '..', '..', '..');
    const skillPath = path.join(repoRoot, skillName, 'scripts');
    
    // Check if python is requested/available
    const pyPath = path.join(skillPath, `${scriptBaseName}.py`);
    const jsPath = path.join(skillPath, `${scriptBaseName}.js`);
    
    if (fs.existsSync(pyPath)) {
        try {
            execSync('python --version');
            return { type: 'python', path: pyPath };
        } catch (e) {
            // Fallback to JS if Python isn't available
        }
    }

    if (fs.existsSync(jsPath)) {
        return { type: 'node', path: jsPath };
    }

    throw new Error(`Execution script not found for skill: ${skillName}`);
}

function runScript(skillName: string, scriptBaseName: string, args: string[]): string {
    const scriptInfo = getScriptPath(skillName, scriptBaseName);
    
    // Wrap args in quotes carefully to prevent shell injection, though execFileSync is safer
    const safeArgs = args.map(arg => {
        // Simple escape for child_process.execSync (in production, use spawnSync or execFileSync)
        return `"${arg.replace(/"/g, '\\"')}"`;
    });
    
    const cmd = `${scriptInfo.type} "${scriptInfo.path}" ${safeArgs.join(' ')}`;
    
    try {
        const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        return stdout.trim();
    } catch (err: any) {
        return `[ERROR] Execution failed:\n${err.stderr ? err.stderr.toString() : err.message}`;
    }
}

export async function executeExploreCodebaseAst(args: any): Promise<string> {
    // Falls back to explore.js or explore.py
    return runScript('explore-codebase-ast', 'explore', [args.rootPath, args.targetTech, args.depth ? args.depth.toString() : '2']);
}

export async function executeReadFileChunked(args: any): Promise<string> {
    return runScript('read-file-chunked', 'read_chunk', [args.filePath, args.startLine.toString(), args.endLine.toString()]);
}

export async function executeInSandbox(args: any): Promise<string> {
    const image = args.dockerImage || "ubuntu:latest";
    const timeout = args.timeoutMs ? args.timeoutMs.toString() : "5000";
    return runScript('execute-in-sandbox', 'sandbox', [args.command, image, timeout]);
}

export async function executeApplyStructuralPatch(args: any): Promise<string> {
    return runScript('apply-structural-patch', 'apply_patch', [args.filePath, args.patchContent]);
}

export async function executeQueryHomelabState(args: any): Promise<string> {
    const fetchLogs = args.fetchLogs ? 'true' : 'false';
    return runScript('query-homelab-state', 'query_infra', [args.targetService, fetchLogs]);
}
