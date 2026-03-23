#!/usr/bin/env python3
"""
Improved program to read kernel.drawio.json and replace ":DONE" with "'DONE" and ":$" with "$"
This version handles special cases where ":$" appears in quoted strings.

HOW TO USE:
1. Save this script as "modify_drawio.py"
2. Place your kernel.drawio.json file in the same directory
3. Run the script: python modify_drawio.py
4. A new file "modified-kernel.drawio.json" will be created with the replacements
"""

import re
import os
import sys
import json

def modify_json_file(input_file_path, output_file_path):
    """Modify the JSON file by replacing ":DONE" with "'DONE" and ":$" with "$"."""
    try:
        # Read the file content
        with open(input_file_path, 'r', encoding='utf-8') as file:
            file_content = file.read()
        
        
        # Count original occurrences
        count_done = len(re.findall(r':DONE', file_content))
        count_dollar = len(re.findall(r':\$', file_content))
        
        # Replace ":DONE" with "'DONE"
        modified_content = re.sub(r':DONE', "'DONE", file_content)
        
        # Special handling for ":$" pattern, including when it appears in quoted strings like ":$ ./ndsl emit.ohm emitPython.rewrite"
        # The pattern looks for ":$" including when it's inside double-quoted strings
        modified_content = re.sub(r':\$', "$", modified_content)
        
        # Handle specific case for ":$" at the beginning of quoted strings
        modified_content = re.sub(r'":\$ ', '"$ ', modified_content)
        
        # Count new occurrences to verify replacements
        count_done_after = len(re.findall(r':DONE', modified_content))
        count_done_new = len(re.findall(r"'DONE", modified_content))
        count_dollar_after = len(re.findall(r':\$', modified_content))
        
        # If there are still occurrences of ":$", log them for debugging
        if count_dollar_after > 0:
            print("\nWARNING: Some \":$\" instances were not replaced. Locations:")
            lines = modified_content.split('\n')
            for i, line in enumerate(lines):
                if ':$' in line:
                    print(f"Line {i+1}: {line}")
        
        # Write the modified content to the output file
        with open(output_file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        
        return True
        
    except Exception as e:
        print(f"Error processing the file: {str(e)}")
        return False

def main():
    """Main execution function."""
    input_file = 'kernel.drawio.json'
    output_file = 'modified-kernel.drawio.json'
    
    # Allow command-line arguments for input and output files
    if len(sys.argv) >= 2:
        input_file = sys.argv[1]
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    
    # Check if the input file exists
    if not os.path.exists(input_file):
        print(f"Error: The file '{input_file}' does not exist in the current directory.")
        sys.exit(1)
    
    result = modify_json_file(input_file, output_file)
    
    if result:
        pass
    else:
        print('Failed to process file. Please check the error messages above.')

if __name__ == "__main__":
    main()
