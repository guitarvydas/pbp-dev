import sys

for line in sys.stdin:
    modified = line.replace("{", ":⤷").replace("}", "⤶")
    sys.stdout.write(modified)
