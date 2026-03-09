import sys
import re

def move_line_to_column(line, col):
    # Search for '#|line' in the line
    match = re.search(r'(#\|line.*)', line)
    if match:
        before = line[:match.start()]  # Text before '#|line'
        line_length_before = len(before)
        spaces_needed = col - line_length_before
        if spaces_needed > 0:
            # Add the required spaces to move '#|line' to the desired column
            return before + ' ' * spaces_needed + match.group(1)
    return line

def process_file(filename, col):
    try:
        with open(filename, 'r') as file:
            for line in file:
                # Move '#|line' to the specified column for each line
                adjusted_line = move_line_to_column(line.rstrip(), col)
                print(adjusted_line)
    except FileNotFoundError:
        print(f"File '{filename}' not found.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <filename> <column_number>")
        sys.exit(1)

    filename = sys.argv[1]
    try:
        col = int(sys.argv[2])
    except ValueError:
        print("Column number must be an integer.")
        sys.exit(1)

    process_file(filename, col)
