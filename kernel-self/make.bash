#!/bin/bash
set -e
npm install
node das2json.mjs kernel.drawio
./tas.bash 'jit'
./tas.bash 'stock'
./tas.bash '0d'
NOW=$(date)
FRESHDIR="before-${NOW}"
mkdir ./"${FRESHDIR}"
cp ./kernel0d.py ./"${FRESHDIR}"
echo "created ${FRESHDIR}"
cat 0d.py jit.py stock.py >new-kernel0d.py
cat 0d.js jit.js stock.js >kernel0d.js
cat 0d.lisp jit.lisp stock.lisp >kernel0d.lisp

