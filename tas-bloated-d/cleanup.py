#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from repl import live_update

# Read from stdin and replace ¶ with newline
src = sys.stdin.read().replace('¶', '\n')

# Send live update first
# live_update("Info", f"cleanup.py")

# Write to /tmp/src
with open('/tmp/src', 'w') as f:
    f.write(src)

# Print to stdout
print(src)
