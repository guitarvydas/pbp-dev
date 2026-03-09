#!/bin/bash
# $1 = name of file to be transmogrified, e.g. `hello.pml`
projdir=$(pwd)
rm -f out.*
cd pbp/tas
node das2json.mjs transmogrify.drawio
python3 main.py . - "${projdir}/$1" main transmogrify.drawio.json | node splitoutput.js
mv out.* ${projdir}
cd ${projdir}
if [[ -f out.✗ ]]; then
  cat out.✗
fi
