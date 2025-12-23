#!/bin/bash
wd=.
pbp=./pbp
if [ -z "$PBP_ROOT" ]; then
    echo "Error: PBP_ROOT environment variable is not set" >&2
    echo "Error:   put 'export PBP_ROOT=<your path>' in your .bashrc or .zshrc file after replacing <your path> with a path customized for your setup" >&2
    exit 1
fi
Dev=${PBP_ROOT}
TaS_Dev=${PBP_ROOT}/tas
rm -rf pbp
mkdir pbp
cd pbp

KERNEL=./kernel
DAS=./das
TAS=./tas
T2T=./t2t

rm -rf tas
rm -rf das
rm -rf t2t
rm -rf kernel
mkdir tas
mkdir das
mkdir t2t
mkdir t2t/lib
mkdir kernel

cp ${Dev}/t2t.bash .
cp ${Dev}/main.py .
cp ${Dev}/init.bash .
cp ${Dev}/kernel/package.json .

cp ${Dev}/kernel/package.json ${KERNEL}
cp ${Dev}/kernel/kernel0d.py ${KERNEL}/kernel0d.py
cp ${Dev}/kernel/stubbed-out-repl.py ${KERNEL}/repl.py
cp ${Dev}/kernel/splitoutput.js ${KERNEL}
cp ${Dev}/kernel/kernel0d.js ${KERNEL}/kernel0d.js
cp ${Dev}/kernel/kernel0d.lisp ${KERNEL}/kernel0d.lisp
cp ${Dev}/das/das2json.mjs ${DAS}/das2json.mjs
cp ${Dev}/das/PBP.xml ${DAS}/PBP.xml
cp ${Dev}/t2t/lib/args.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/front.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/middle.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/tail.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/rwr.mjs ${T2T}/lib

${Dev}/import-minimal-tas.bash ${Tas_Dev} ${TAS}
