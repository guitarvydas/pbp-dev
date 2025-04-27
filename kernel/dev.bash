#!/bin/bash
# for bootstrapping a kernel build before make.bash fully works
set -e
set -x
# uncomment next line if generated kernel cannot be used
cp @golden-kernel0d.py kernel0d.py
# comment next line if generated kernel cannot be used
#cat external.py stock.py 0d.py >kernel0d.py

node das2json.js kernel.drawio
./tas.bash 'external'
./tas.bash 'stock'
./tas.bash '0d'
