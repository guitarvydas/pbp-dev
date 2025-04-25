#!/bin/bash
set -e
D2J=./das2json/mac/das2json
${D2J} rt2py.drawio
./gen-py.bash test.rt generated-py.json

${D2J} rt2cl.drawio
./gen-cl.bash test.rt generated-lisp.json

${D2J} rt2js.drawio
./gen-js.bash test.rt generated-mjs.json
