# Test Suite: apply-structural-patch

## Prompt 1: Standard Patch
**Input**: `/apply_patch ./target.py "--- a/target.py\n+++ b/target.py\n@@ -1,2 +1,2 @@\n-old\n+new"`
**Expected**: The script creates the temporary `.patch` file, applies it successfully, and cleans it up.

## Prompt 2: File Not Found
**Input**: `/apply_patch ./missing.txt "--- a/missing.txt\n+++ b/missing.txt\n@@ -1,1 +1,1 @@\n-a\n+b"`
**Expected**: The script detects `os.path.exists` is false and returns `[ERROR] Target file not found`.

## Prompt 3: Malformed Patch
**Input**: `/apply_patch ./target.py "invalid patch data"`
**Expected**: `git apply` fails and falls back to `patch`. `patch` also fails and returns the raw stderr, allowing the AI to understand it provided a bad format.
