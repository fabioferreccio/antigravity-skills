# Test Suite: explore-codebase-ast

## Prompt 1: Basic execution
**Input**: `/explore ./src .ts 3`
**Expected**: The AI executes the script and summarizes the TS classes and interfaces up to 3 levels deep.

## Prompt 2: Multiple extensions
**Input**: `/explore ./backend .java,.cs 5`
**Expected**: The AI executes the script for Java and C# files, up to 5 levels deep.

## Prompt 3: Missing dependency
**Input**: (User doesn't have Python `tree-sitter-languages` installed)
**Expected**: The AI falls back to Node.js regex script or gracefully instructs the user to run `pip install tree-sitter tree-sitter-languages`.

## Misuse 1: Extreme depth
**Input**: `/explore ./ 100`
**Expected**: The AI warns the user that depth 100 might take too long and suggests limiting to 3 or 5, or running the script but stopping if it times out.

## Misuse 2: Invalid extensions
**Input**: `/explore ./src ts` (without dot)
**Expected**: The script handles it correctly because it prepends `.` automatically.

## Edge Case 1: Empty directory
**Input**: `/explore ./empty .ts 2`
**Expected**: Outputs an empty map without crashing.
