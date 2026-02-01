import sys
import re

def move_line_to_column_140(line):
    # Move '#line' to the 140th column by inserting spaces if necessary
    match = re.search(r'(#line.*)', line)
    if match:
        before = line[:match.start()]  # Text before '#line'
        line_length_before = len(before)
        spaces_needed = 140 - line_length_before
        if spaces_needed > 0:
            # Add the required spaces to move '#line' to the 140th column
            return before + ' ' * spaces_needed + match.group(1)
    return line

def highlight_substring(line):
    # Highlight the substring between '>>>' and '<<<' in bright red
    # on command line... line = re.sub(r'(>>>.*?<<<)', r'\033[91m\1\033[0m', line)
    line = re.sub(r'(>>>.*?<<<)', r'\1', line)
    # Move '#line' to the 140th column and highlight it in bright red
    line = move_line_to_column_140(line)
    # on command line ...line = re.sub(r'(#line.*)', r'\033[91m\1\033[0m', line)
    line = re.sub(r'(#line.*)', r'\1', line)
    return line

def check_for_stars(source_code):
    found = False
    for line_num, line in enumerate(source_code.splitlines(), start=1):
        if '>>>' in line:
            found = True
            highlighted_line = highlight_substring(line)            
            print(f"\n{highlighted_line}", file=sys.stderr)
    
    if found:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <filename>")
        sys.exit(1)

    filename = sys.argv[1]

    try:
        with open(filename, 'r') as file:
            source_code = file.read()
            check_for_stars(source_code)
    except FileNotFoundError:
        print(f"File '{filename}' not found.")
        sys.exit(1)
