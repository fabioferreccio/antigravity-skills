import os
import sys
import subprocess

def run_in_sandbox(command, docker_image, timeout_ms):
    timeout_sec = int(timeout_ms) / 1000.0
    workspace = os.getcwd()
    
    # Using read-only mount (:ro) for maximum safety as requested
    docker_cmd = [
        "docker", "run", "--rm",
        "-v", f"{workspace}:/workspace:ro",
        "-w", "/workspace",
        docker_image,
        "sh", "-c", command
    ]
    
    print(f"Executing in Sandbox (Image: {docker_image}, Timeout: {timeout_sec}s)...")
    print(f"Command: {' '.join(docker_cmd)}\n")

    try:
        result = subprocess.run(
            docker_cmd,
            capture_output=True,
            text=True,
            timeout=timeout_sec
        )
        
        print("--- STDOUT ---")
        print(result.stdout if result.stdout else "<empty>")
        print("\n--- STDERR ---")
        print(result.stderr if result.stderr else "<empty>")
        print(f"\nExit Code: {result.returncode}")
        
    except subprocess.TimeoutExpired as e:
        print(f"\n[ERROR] Execution timed out after {timeout_sec} seconds.")
        if e.stdout:
            print("--- PARTIAL STDOUT ---\n", e.stdout.decode('utf-8', errors='ignore'))
        if e.stderr:
            print("--- PARTIAL STDERR ---\n", e.stderr.decode('utf-8', errors='ignore'))
    except FileNotFoundError:
        print("\n[ERROR] Docker is not installed or not in PATH.")
    except Exception as e:
        print(f"\n[ERROR] An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python sandbox.py \"<command>\" [docker_image] [timeout_ms]")
        sys.exit(1)
        
    cmd = sys.argv[1]
    image = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else "ubuntu:latest"
    timeout = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] else "10000"
    
    run_in_sandbox(cmd, image, timeout)
