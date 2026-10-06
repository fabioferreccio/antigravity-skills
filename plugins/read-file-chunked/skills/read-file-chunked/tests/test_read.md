# Test Suite: read-file-chunked

## Prompt 1: Basic execution
**Input**: `/read ./src/app.js 1 50`
**Expected**: The AI executes the script and outputs the first 50 lines with line numbers.

## Prompt 2: Omitted end_line
**Input**: `/read ./src/app.js 10`
**Expected**: The AI executes the script with `start_line: 10` and `end_line: 110` (or its internal default limit up to 300).

## Prompt 3: Omitted start_line and end_line
**Input**: `/read ./src/app.js`
**Expected**: The AI defaults to `1` and `100`, reading the first 100 lines.

## Misuse 1: Extreme pagination
**Input**: `/read ./src/huge_file.csv 1 100000`
**Expected**: The AI limits the read to a safe chunk (e.g., 300 lines) and informs the user that they must paginate to avoid VRAM exhaustion.

## Edge Case 1: Non-existent file
**Input**: `/read ./src/missing.js 1 10`
**Expected**: Script outputs "Error: File not found", and the AI relays the message to the user.
