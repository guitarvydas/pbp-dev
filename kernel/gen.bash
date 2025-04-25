#!/bin/bash
# usage ./gen.bash ${SRC} generated.json
set -e
src=$1
gen=$2
python3 main.py . 0D/python '' main rt2all.drawio.json >$gen
