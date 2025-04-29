#!/bin/bash
set -e
cp ../kernel/kernel0d.py .
node das2json.js tas.drawio
./rt.bash 'stock'

