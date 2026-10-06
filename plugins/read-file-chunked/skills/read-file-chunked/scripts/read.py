import sys

def read_chunk(file_path, start_line, end_line):
    try:
        start = int(start_line)
        end = int(end_line)
        
        if start < 1:
            start = 1
        
        with open(file_path, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f, 1):
                if i >= start and i <= end:
                    print(f"{i:4d} | {line.rstrip('\\n')}")
                elif i > end:
                    break
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python read.py <file_path> <start_line> <end_line>")
        sys.exit(1)
        
    read_chunk(sys.argv[1], sys.argv[2], sys.argv[3])
