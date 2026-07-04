const { spawn } = require('child_process');
const path = require('path');

function runInSandbox(command, dockerImage, timeoutMs) {
    const timeoutSec = parseInt(timeoutMs, 10) / 1000;
    const workspace = process.cwd();
    
    const args = [
        'run', '--rm',
        '-v', `${workspace}:/workspace:ro`,
        '-w', '/workspace',
        dockerImage,
        'sh', '-c', command
    ];
    
    console.log(`Executing in Sandbox (Image: ${dockerImage}, Timeout: ${timeoutSec}s)...`);
    console.log(`Command: docker ${args.join(' ')}\n`);

    const child = spawn('docker', args);
    
    let stdoutData = '';
    let stderrData = '';

    const timeout = setTimeout(() => {
        child.kill();
        console.log(`\n[ERROR] Execution timed out after ${timeoutSec} seconds.`);
        console.log("--- PARTIAL STDOUT ---\n" + (stdoutData || "<empty>"));
        console.log("\n--- PARTIAL STDERR ---\n" + (stderrData || "<empty>"));
        process.exit(1);
    }, parseInt(timeoutMs, 10));

    child.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    child.on('error', (err) => {
        clearTimeout(timeout);
        if (err.code === 'ENOENT') {
            console.log('\n[ERROR] Docker is not installed or not in PATH.');
        } else {
            console.log(`\n[ERROR] An unexpected error occurred: ${err.message}`);
        }
    });

    child.on('close', (code) => {
        clearTimeout(timeout);
        console.log("--- STDOUT ---");
        console.log(stdoutData || "<empty>");
        console.log("\n--- STDERR ---");
        console.log(stderrData || "<empty>");
        console.log(`\nExit Code: ${code}`);
    });
}

if (process.argv.length < 3) {
    console.log('Usage: node sandbox.js "<command>" [docker_image] [timeout_ms]');
    process.exit(1);
}

const cmd = process.argv[2];
const image = process.argv[3] || 'ubuntu:latest';
const timeout = process.argv[4] || '10000';

runInSandbox(cmd, image, timeout);
