#!/bin/bash
# cd to pbp-kit (or local project), then run this script
# ~/projects/pbp-dev/import-minimal.bash
wd=.
pbp=./pbp
if [ -z "$PBP_ROOT" ]; then
    echo "Error: PBP_ROOT environment variable is not set" >&2
    echo "Error:   put 'export PBP_ROOT=<your path>' in your .bashrc or .zshrc file after replacing <your path> with a path customized for your setup" >&2
    exit 1
fi
Dev=${PBP_ROOT}
TaS_Dev=${PBP_ROOT}/tas
dtree_Dev=${PBP_ROOT}/dtree
rm -rf pbp
mkdir pbp
cd pbp

KERNEL=./kernel
DAS=./das
TAS=./tas
T2T=./t2t
DTREE=./dtree
DOC=./doc

rm -rf tas
rm -rf das
rm -rf t2t
rm -rf kernel
rm -rf dtree
rm -rf doc
mkdir tas
mkdir das
mkdir t2t
mkdir t2t/lib
mkdir kernel
mkdir dtree
mkdir doc

cp ${Dev}/t2t.bash .
cp ${Dev}/runpbp .
cp ${Dev}/main.py .
cp ${Dev}/init.bash .
cp ${Dev}/kernel/package.json .
cp ${Dev}/pbp-lifecycle.drawio.png .
cp ${Dev}/api.md .

cp ${Dev}/doc/semantics.pdf ${DOC}

cp ${Dev}/kernel/package.json ${KERNEL}
cp ${Dev}/kernel/kernel0d.py ${KERNEL}/kernel0d.py
cp ${Dev}/kernel/stubbed-out-repl.py ${KERNEL}/repl.py
cp ${Dev}/kernel/splitoutput.js ${KERNEL}
cp ${Dev}/kernel/kernel0d.js ${KERNEL}/kernel0d.js
cp ${Dev}/kernel/kernel0d.lisp ${KERNEL}/kernel0d.lisp

cp ${Dev}/das/das2json.mjs ${DAS}/das2json.mjs
cp ${Dev}/das/check-for-span-error.bash ${DAS}

cp ${Dev}/das/PBP.xml ${DAS}/PBP.xml
cp ${Dev}/t2t/lib/args.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/front.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/middle.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/tail.part.js ${T2T}/lib
cp ${Dev}/t2t/lib/rwr.mjs ${T2T}/lib

${Dev}/import-minimal-tas.bash ${TaS_Dev} ${TAS}
${Dev}/import-minimal-dtree.bash ${dtree_Dev} ${DTREE}
