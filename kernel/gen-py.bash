#!/bin/bash
# usage ./generate-chunk.bash ${SRC}.a generated.a.py
set -e
src=$1
gen=$2
python3 main.py . 0D/python $src main rt2py.drawio.json >$gen
python3 pyrelocate.py  $gen 60 >/tmp/$gen
mv /tmp/$gen ./$gen
python3 errcheck.py $gen
