import sys
import subprocess
import json

def run_cmd(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except Exception as e:
        return "", str(e), 1

def query_docker(service, fetch_logs):
    # Find container ID
    stdout, stderr, code = run_cmd(f"docker ps -a --filter name={service} --format '{{{{.ID}}}}|{{{{.Names}}}}|{{{{.Status}}}}'")
    if code != 0 or not stdout:
        return False, None
    
    parts = stdout.split('\n')[0].split('|')
    cid = parts[0]
    cname = parts[1]
    status = parts[2]
    
    report = f"## 🐳 Platform: Docker\n**Service**: {cname} ({cid})\n**Status**: {status}\n\n"
    
    # Get stats
    stats_out, _, stats_code = run_cmd(f"docker stats {cid} --no-stream --format '{{{{.CPUPerc}}}} CPU | {{{{.MemUsage}}}} RAM'")
    if stats_code == 0 and stats_out:
        report += f"**Resources**: {stats_out}\n\n"
        
    if fetch_logs:
        logs_out, logs_err, logs_code = run_cmd(f"docker logs --tail=100 {cid}")
        report += "### 📝 Logs (Last 100 lines)\n```text\n"
        # Combine stdout and stderr for logs
        combined_logs = (logs_out + "\n" + logs_err).strip()
        report += (combined_logs if combined_logs else "<empty>") + "\n```\n"
        
    return True, report

def query_kubernetes(service, fetch_logs):
    stdout, stderr, code = run_cmd(f"kubectl get pods -l app={service} -o json")
    if code != 0 or not stdout:
        # Fallback to grep if no labels
        stdout, stderr, code = run_cmd(f"kubectl get pods --no-headers | grep {service} | head -n 1 | awk '{{print $1\"|\"$3}}'")
        if code != 0 or not stdout:
            return False, None
        
        parts = stdout.split('|')
        pod_name = parts[0]
        status = parts[1]
    else:
        try:
            data = json.loads(stdout)
            if not data.get("items"):
                return False, None
            pod = data["items"][0]
            pod_name = pod["metadata"]["name"]
            status = pod["status"]["phase"]
        except:
            return False, None
            
    report = f"## ☸️ Platform: Kubernetes\n**Service**: {pod_name}\n**Status**: {status}\n\n"
    
    top_out, _, top_code = run_cmd(f"kubectl top pod {pod_name} --no-headers")
    if top_code == 0 and top_out:
        report += f"**Resources (CPU/RAM)**: {top_out}\n\n"
        
    if fetch_logs:
        logs_out, logs_err, logs_code = run_cmd(f"kubectl logs --tail=100 {pod_name}")
        report += "### 📝 Logs (Last 100 lines)\n```text\n"
        combined_logs = (logs_out + "\n" + logs_err).strip()
        report += (combined_logs if combined_logs else "<empty>") + "\n```\n"
        
    return True, report

def main():
    if len(sys.argv) < 2:
        print("Usage: python query_infra.py <target_service> [fetch_logs: true/false]")
        sys.exit(1)
        
    service = sys.argv[1]
    fetch_logs = True if len(sys.argv) > 2 and sys.argv[2].lower() == 'true' else False
    
    print(f"# Infrastructure Report for '{service}'\n")
    
    # Try Docker
    found, report = query_docker(service, fetch_logs)
    if found:
        print(report)
        sys.exit(0)
        
    # Try Kubernetes
    found, report = query_kubernetes(service, fetch_logs)
    if found:
        print(report)
        sys.exit(0)
        
    print(f"[ERROR] Service '{service}' not found in local Docker or Kubernetes context.")
    sys.exit(1)

if __name__ == "__main__":
    main()
