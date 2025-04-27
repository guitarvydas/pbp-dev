#!/bin/bash
# for bootstrapping a kernel build before make.bash fully works
set -e
set -x

node das2json.js kernel.drawio

OLD=1
if [ "$OLD" -eq 1 ]; then
    cp @golden-kernel0d.py kernel0d.py
    python3 backward.py
    mv modified-kernel.drawio.json kernel.drawio.json
else
    cat external.py stock.py 0d.py >kernel0d.py
fi

# comment next line if generated kernel cannot be used

./tas.bash 'external'
./tas.bash 'stock'
./tas.bash '0d'
