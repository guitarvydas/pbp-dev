import sys
import re

def move_line_to_column(line, col):
    # Search for '#line' in the line
    match = re.search(r'(/\* line.*)', line)
    if match:
        before = line[:match.start()]  # Text before '/* line'
        line_length_before = len(before)
        spaces_needed = col - line_length_before
        if spaces_needed > 0:
            # Add the required spaces to move '/* line' to the desired column
            return before + ' ' * spaces_needed + match.group(1)
    return line

def process_file(file, col):
    try:
        for line in file:
            # Move '/* line' to the specified column for each line
            adjusted_line = move_line_to_column(line.rstrip(), col)
            print(adjusted_line)
    except FileNotFoundError:
        print(f"in jsrelocate.py: File 'stdin' not found.", file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 jsrelocate.py <column_number>", file=sys.stderr)
    else:
        try:
            col = int(sys.argv[1])
        except ValueError:
            print("in jsrelocate.py: Column number must be an integer.", file=sys.stderr)
        try:
            process_file(sys.stdin, col)
        except:
            print("in jsrelocate.py: internal error", file=sys.stderr)

