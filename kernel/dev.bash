#!/bin/bash
# for bootstrapping a kernel build before make.bash fully works
set -e

node das2json.js kernel.drawio
# define OLD=1 if using kernel.drawio that contains "'DONE" and "$ ..."
# else define OLD=0 for new syntax using ":" instead of "'" and "$"
OLD=0
if [ "$OLD" -eq 1 ]; then
    echo '*** old ***'
    cp @golden-kernel0d.py kernel0d.py
    python3 backward.py
    mv modified-kernel.drawio.json kernel.drawio.json
    ./tas.bash 'external'
    ./tas.bash 'stock'
    ./tas.bash '0d'
else
    echo
    echo '                   *** new ***'
    echo
    cp @golden-kernel0d.py kernel0d.py
    node das2json.js kernel.drawio
    python3 backward.py
    mv modified-kernel.drawio.json kernel.drawio.json
    ./tas.bash 'external'
    ./tas.bash 'stock'
    ./tas.bash '0d'
    cat external.py stock.py 0d.py >kernel0d.py
    node das2json.js kernel.drawio
    ./tas.bash 'kernel_external.rt'
fi

