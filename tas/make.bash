#!/bin/bash
set -e
cp ../kernel/kernel0d.py .
node das2json.js tas.drawio
./tas.bash 'test'

