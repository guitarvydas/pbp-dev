import sys
import re
from repl import live_update

def check_for_stars(source_code):
    found = False
    good = ''
    rc = 0
    for line in source_code.splitlines():
        if '>>>' in line:
            found = True
            print(f"error: {line}", file=sys.stderr)
        else:
            good += line + '\n'
    if found:
        print ("errors found", file=sys.stderr)
        rc = 1
    else:
        print (good, file=sys.stdout)
        rc = 0
    return rc

if __name__ == "__main__":
    try:
        source_code = sys.stdin.read()
        rc = check_for_stars(source_code)
        exit (rc)
    except FileNotFoundError:
        print(f"in errgrep.py: File '{filename}' not found.", file=sys.stderr)
