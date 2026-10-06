import os
import sys
import argparse

try:
    from tree_sitter_languages import get_parser
    HAS_TREE_SITTER = True
except ImportError:
    HAS_TREE_SITTER = False

# Mapping common extensions to tree-sitter language names
EXT_TO_LANG = {
    '.py': 'python',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.java': 'java',
    '.cs': 'c_sharp',
    '.cpp': 'cpp',
    '.c': 'c',
    '.go': 'go',
    '.rb': 'ruby',
    '.rs': 'rust',
    '.php': 'php',
}

def parse_file(filepath, ext):
    lang_name = EXT_TO_LANG.get(ext)
    if not lang_name or not HAS_TREE_SITTER:
        return []

    try:
        parser = get_parser(lang_name)
        with open(filepath, 'r', encoding='utf-8') as f:
            code = f.read()
        tree = parser.parse(bytes(code, "utf8"))
        
        entities = []
        
        def traverse(node):
            if node.type in ['class_declaration', 'class_definition']:
                name_node = next((c for c in node.children if c.type == 'identifier'), None)
                if name_node:
                    name = code[name_node.start_byte:name_node.end_byte]
                    entities.append(f"- Class: {name}")
            elif node.type in ['function_declaration', 'function_definition', 'method_declaration', 'method_definition']:
                name_node = next((c for c in node.children if c.type in ['identifier', 'property_identifier']), None)
                if name_node:
                    name = code[name_node.start_byte:name_node.end_byte]
                    entities.append(f"  - Method: {name}")
            elif node.type in ['interface_declaration']:
                name_node = next((c for c in node.children if c.type == 'type_identifier'), None)
                if name_node:
                    name = code[name_node.start_byte:name_node.end_byte]
                    entities.append(f"- Interface: {name}")

            for child in node.children:
                traverse(child)

        traverse(tree.root_node)
        return entities
    except Exception as e:
        return [f"  - [Error parsing AST: {str(e)}]"]

def explore(root_path, target_extensions, max_depth):
    target_exts = [e.strip() if e.startswith('.') else f".{e.strip()}" for e in target_extensions.split(',')]
    
    print(f"## AST Architecture Map for `{root_path}`")
    if not HAS_TREE_SITTER:
        print("> [!WARNING]\n> `tree_sitter_languages` not installed. Showing only files without AST.\n> Run: `pip install tree-sitter tree-sitter-languages`\n")
    
    def walk_dir(current_path, current_depth):
        if current_depth > max_depth:
            return

        try:
            items = sorted(os.listdir(current_path))
        except PermissionError:
            return

        for item in items:
            if item in ['.git', 'node_modules', 'venv', '__pycache__', 'dist', 'build', 'out']:
                continue

            item_path = os.path.join(current_path, item)
            indent = "  " * current_depth
            
            if os.path.isdir(item_path):
                print(f"{indent}📁 {item}/")
                walk_dir(item_path, current_depth + 1)
            else:
                _, ext = os.path.splitext(item)
                if ext in target_exts:
                    print(f"{indent}📄 {item}")
                    if HAS_TREE_SITTER:
                        entities = parse_file(item_path, ext)
                        for entity in entities:
                            print(f"{indent}  {entity}")

    walk_dir(root_path, 0)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Explore AST of a codebase.")
    parser.add_argument("path", help="Root directory to explore")
    parser.add_argument("extensions", help="Comma-separated list of extensions (e.g. .ts,.js)")
    parser.add_argument("depth", type=int, help="Maximum depth to traverse")
    args = parser.parse_args()
    
    explore(args.path, args.extensions, args.depth)
