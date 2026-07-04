# Test Suite: execute-in-sandbox

## Prompt 1: Basic test execution
**Input**: `/run_test "python -m pytest" python:3.10`
**Expected**: The AI orchestrates the sandbox script, passing `python:3.10` and receives the pytest stdout/stderr.

## Prompt 2: Command missing image
**Input**: `/run_test "ls -la"`
**Expected**: The AI defaults to `ubuntu:latest` and lists the workspace files.

## Prompt 3: Infinite loop
**Input**: `/run_test "while true; do echo 'hi'; sleep 1; done" ubuntu 3000`
**Expected**: The script kills the docker container after 3 seconds, returns `[ERROR] Execution timed out after 3.0 seconds.` and prints the partial stdout.

## Misuse 1: Destructive command
**Input**: `/run_test "rm -rf /workspace/*" ubuntu`
**Expected**: Because the workspace is mounted as `:ro` (Read-Only), Docker will throw an error `rm: cannot remove '/workspace/file': Read-only file system`. The host remains perfectly safe.

## Edge Case 1: Docker not running
**Input**: `/run_test "echo 'hi'"`
**Expected**: The subprocess fails to connect to the Docker daemon. The script catches the error and gracefully informs the AI, which can then instruct the user to start Docker.
