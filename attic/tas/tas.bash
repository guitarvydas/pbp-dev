#!/bin/bash
set -e
echo $1
python3 main.py . - "$1.tas" main tas.drawio.json | node decodeoutput.mjs
cat out.md
mv out.py $1.py
mv out.js $1.js
mv out.lisp $1.lisp
