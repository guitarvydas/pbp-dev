#!/bin/bash
set -e
cp live-repl.py repl.py
D2J=./das2json/mac/das2json
${D2J} rt2py.drawio
./gen.bash test.rt generated.json
