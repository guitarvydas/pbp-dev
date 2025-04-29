#!/bin/bash
# for bootstrapping a kernel build before make.bash fully works
# update: use ./make.bash instead of this script
set -e

node das2json.js kernel.drawio
# define VER=1 if using kernel.drawio that contains "'DONE" and "$ ..."
# else define VER=2 for new syntax using ":" instead of "'" and "$", built using old kernel
# else define VER=3 for new syntax using ":" instead of "'" and "$", built using generated new kernel
# leave it at 3, because the new kernel is now OK
VER=3
if [ "$VER" -eq 1 ]; then
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
    if [ "$VER" -eq 2 ]; then
	# refresh old version for bootstrapping
	cp @golden-kernel0d.py kernel0d.py
	node das2json.js kernel.drawio
	python3 backward.py
	mv modified-kernel.drawio.json kernel.drawio.json
	./tas.bash 'external'
	./tas.bash 'stock'
	./tas.bash 'kernel_external'
	./tas.bash '0d'
    fi
    # make new 
    cat 0d.py external.py stock.py kernel_external.py >kernel0d.py
    node das2json.js kernel.drawio
    ./tas.bash 'external'
    ./tas.bash 'stock'
    ./tas.bash 'kernel_external'
    ./tas.bash '0d'
fi

