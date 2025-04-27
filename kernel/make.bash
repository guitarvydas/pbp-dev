#!/bin/bash
set -e
node das2json.js kernel.drawio
./tas '0d'
./tas 'external'
./tas 'stock'
NOW=$(date)
FRESHDIR="before-${NOW}"
mkdir ./"${FRESHDIR}"
mv ./kernel0d.py ./"${FRESHDIR}"
cat 0d.py external.py stock.py >kernel0d.py

