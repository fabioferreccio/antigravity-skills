const { execSync } = require('child_process');

function runCmd(cmd) {
    try {
        const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        return { stdout: stdout.trim(), stderr: '', code: 0 };
    } catch (err) {
        return { stdout: err.stdout ? err.stdout.toString().trim() : '', stderr: err.stderr ? err.stderr.toString().trim() : err.message, code: err.status || 1 };
    }
}

function queryDocker(service, fetchLogs) {
    const ps = runCmd(`docker ps -a --filter name=${service} --format '{{.ID}}|{{.Names}}|{{.Status}}'`);
    if (ps.code !== 0 || !ps.stdout) return { found: false };

    const lines = ps.stdout.split('\n');
    const [cid, cname, status] = lines[0].split('|');

    let report = `## 🐳 Platform: Docker\n**Service**: ${cname} (${cid})\n**Status**: ${status}\n\n`;

    const stats = runCmd(`docker stats ${cid} --no-stream --format '{{.CPUPerc}} CPU | {{.MemUsage}} RAM'`);
    if (stats.code === 0 && stats.stdout) {
        report += `**Resources**: ${stats.stdout}\n\n`;
    }

    if (fetchLogs) {
        const logs = runCmd(`docker logs --tail=100 ${cid}`);
        report += "### 📝 Logs (Last 100 lines)\n```text\n";
        const combined = `${logs.stdout}\n${logs.stderr}`.trim();
        report += (combined ? combined : '<empty>') + "\n```\n";
    }

    return { found: true, report };
}

function queryKubernetes(service, fetchLogs) {
    let podName, status;
    const json = runCmd(`kubectl get pods -l app=${service} -o json`);
    
    if (json.code === 0 && json.stdout) {
        try {
            const data = JSON.parse(json.stdout);
            if (data.items && data.items.length > 0) {
                podName = data.items[0].metadata.name;
                status = data.items[0].status.phase;
            }
        } catch (e) {}
    }

    if (!podName) {
        const fallback = runCmd(`kubectl get pods --no-headers | grep ${service} | head -n 1 | awk '{print $1"|"$3}'`);
        if (fallback.code !== 0 || !fallback.stdout) return { found: false };
        [podName, status] = fallback.stdout.split('|');
    }

    let report = `## ☸️ Platform: Kubernetes\n**Service**: ${podName}\n**Status**: ${status}\n\n`;

    const top = runCmd(`kubectl top pod ${podName} --no-headers`);
    if (top.code === 0 && top.stdout) {
        report += `**Resources (CPU/RAM)**: ${top.stdout}\n\n`;
    }

    if (fetchLogs) {
        const logs = runCmd(`kubectl logs --tail=100 ${podName}`);
        report += "### 📝 Logs (Last 100 lines)\n```text\n";
        const combined = `${logs.stdout}\n${logs.stderr}`.trim();
        report += (combined ? combined : '<empty>') + "\n```\n";
    }

    return { found: true, report };
}

function main() {
    if (process.argv.length < 3) {
        console.log('Usage: node query_infra.js <target_service> [fetch_logs: true/false]');
        process.exit(1);
    }

    const service = process.argv[2];
    const fetchLogs = process.argv.length > 3 && process.argv[3].toLowerCase() === 'true';

    console.log(`# Infrastructure Report for '${service}'\n`);

    const dockerRes = queryDocker(service, fetchLogs);
    if (dockerRes.found) {
        console.log(dockerRes.report);
        process.exit(0);
    }

    const k8sRes = queryKubernetes(service, fetchLogs);
    if (k8sRes.found) {
        console.log(k8sRes.report);
        process.exit(0);
    }

    console.log(`[ERROR] Service '${service}' not found in local Docker or Kubernetes context.`);
    process.exit(1);
}

main();
