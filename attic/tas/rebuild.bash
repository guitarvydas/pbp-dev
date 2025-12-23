#!/bin/bash
node das2json.js rt2all.drawio
python3 main.py . - '' main rt2all.drawio.json | node decodeoutput.mjs
