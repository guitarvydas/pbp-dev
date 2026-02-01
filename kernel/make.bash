#!/bin/bash
set -e
npm install
node das2json.mjs kernel.drawio
./tas.bash 'external'
./tas.bash 'stock'
./tas.bash 'kernel_external'
./tas.bash '0d'
NOW=$(date)
FRESHDIR="before-${NOW}"
mkdir ./"${FRESHDIR}"
mv ./kernel0d.py ./"${FRESHDIR}"
echo "created ${FRESHDIR}"
cat 0d.py external.py stock.py kernel_external.py >new-kernel0d.py
cat 0d.js external.js stock.js kernel_external.js >kernel0d.js
cat 0d.lisp external.lisp stock.lisp kernel_external.lisp >kernel0d.lisp

