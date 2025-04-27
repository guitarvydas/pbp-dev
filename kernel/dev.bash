#!/bin/bash
set -e
set -x
cp @golden-kernel0d.py kernel0d.py
node das2json.js kernel.drawio
./tas 'stock'
