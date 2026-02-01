#!/bin/bash
node das2json.js kernel.drawio
python3 main.py . - '' main kernel.drawio.json | node decodeoutput.mjs
