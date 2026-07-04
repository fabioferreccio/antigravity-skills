import os
import sys
import tempfile
import subprocess

def apply_patch(file_path, patch_content):
    if not os.path.exists(file_path):
        print(f"[ERROR] Target file not found: {file_path}")
        sys.exit(1)

    # Clean up patch content formatting if needed
    patch_content = patch_content.replace("\\n", "\n").strip() + "\n"

    try:
        # Create a temporary patch file
        with tempfile.NamedTemporaryFile('w', suffix='.patch', delete=False, encoding='utf-8') as patch_file:
            patch_file.write(patch_content)
            temp_patch_path = patch_file.name

        print(f"Attempting to apply patch to {file_path}...")
        
        # We try git apply first, which is the standard cross-platform way
        cmd = ["git", "apply", "--ignore-whitespace", temp_patch_path]
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            print("[SUCCESS] Patch applied successfully via git apply.")
        else:
            # Fallback to standard patch utility if git fails
            print(f"[WARNING] git apply failed: {result.stderr.strip()}. Attempting fallback to 'patch'...")
            cmd_fallback = ["patch", "-p1", "--no-backup-if-mismatch", "-i", temp_patch_path]
            result_fallback = subprocess.run(cmd_fallback, capture_output=True, text=True)
            
            if result_fallback.returncode == 0:
                print("[SUCCESS] Patch applied successfully via patch utility.")
            else:
                print(f"[ERROR] Fallback patch also failed:\n{result_fallback.stderr.strip()}\n{result_fallback.stdout.strip()}")
                sys.exit(1)

    except Exception as e:
        print(f"[ERROR] Unexpected error while applying patch: {str(e)}")
        sys.exit(1)
    finally:
        if 'temp_patch_path' in locals() and os.path.exists(temp_patch_path):
            os.remove(temp_patch_path)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python apply_patch.py <file_path> <patch_content>")
        sys.exit(1)
        
    apply_patch(sys.argv[1], sys.argv[2])
