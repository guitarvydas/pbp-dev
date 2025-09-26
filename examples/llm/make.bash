#!/bin/bash
cd agency
make
cd ..
node ../zd/das2json.mjs <dpink.drawio >dpink.json
python3 main.py . - 'Why is concurrency so difficult?' main dpink.json |  node ../util/decodeoutput.js
