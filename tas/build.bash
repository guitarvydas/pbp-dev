#!/bin/bash
cp stubbed-out-repl.py repl.py
node das2json.js rt2all.drawio
#python3 main.py . - '' main rt2all.drawio.json
python3 main.py . - '' main rt2all.drawio.json | node decodeoutput.mjs
