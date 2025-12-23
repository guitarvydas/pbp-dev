#!/bin/bash
# usage ./gen-js.bash ${SRC}.a generated.a.js
set -e
src=$1
gen=$2
python3 main.py . - $src main rt2js.drawio.json >$gen
