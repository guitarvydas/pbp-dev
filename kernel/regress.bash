#!/bin/bash
set -euo pipefail
if [[ "$(pwd)" == *"kernel-self" ]];
then
    cp ../kernel/new-kernel0d.py ./kernel0d.py
    cp ../kernel/*.rt .
    cp ../kernel/emit.ohm .
    cp ../kernel/emit*.rewrite .
    npm install
    node das2json.mjs kernel.drawio
    ./tas.bash 'external'
    ./tas.bash 'stock'
    ./tas.bash 'kernel_external'
    ./tas.bash '0d'
    cat 0d.py external.py stock.py kernel_external.py >kernel0d.py
    echo "kernel0d.py created"
    cat 0d.js external.js stock.js kernel_external.js >kernel0d.js
    cat 0d.lisp external.lisp stock.lisp kernel_external.lisp >kernel0d.lisp
    ./tas.bash 'external'
    ./tas.bash 'stock'
    ./tas.bash 'kernel_external'
    ./tas.bash '0d'
else
    echo "wrong directory"
    exit 1
fi


