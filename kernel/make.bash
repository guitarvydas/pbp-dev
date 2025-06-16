#!/bin/bash
set -e
npm install
node das2json.js kernel.drawio
./tas.bash 'external'
./tas.bash 'stock'
./tas.bash 'kernel_external'
./tas.bash '0d'
NOW=$(date)
FRESHDIR="before-${NOW}"
mkdir ./"${FRESHDIR}"
mv ./kernel0d.py ./"${FRESHDIR}"
cat 0d.py external.py stock.py kernel_external.py >kernel0d.py

