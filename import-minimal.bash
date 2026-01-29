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
TaS_Dev=${PBP_ROOT}/tas-d
dtree_Dev=${PBP_ROOT}/dtree-d
rm -rf pbp
mkdir pbp
cd pbp

# convention: each subdirectory is suffixed by "-d"
KERNEL=./kernel-d
DAS=./das-d
TAS=./tas-d
T2T=./t2t-d
DTREE=./dtree-d
DOC=./doc-d

rm -rf tas-d
rm -rf das-d
rm -rf t2t-d
rm -rf kernel-d
rm -rf dtree-d
rm -rf doc-d
mkdir tas-d
mkdir das-d
mkdir t2t-d
mkdir t2t-d/lib-d
mkdir kernel-d
mkdir dtree-d
mkdir doc-d

cp ${Dev}/t2t.bash .
cp ${Dev}/runpbp .
cp ${Dev}/main.py .
cp ${Dev}/init.bash .
cp ${Dev}/kernel-d/package.json .
cp ${Dev}/pbp-lifecycle.drawio.png .
cp ${Dev}/api.md .

cp ${Dev}/runpbp .
cp ${Dev}/indent .
cp ${Dev}/t2t .
cp ${Dev}/das2json .
cp ${Dev}/splitoutputs .
cp ${Dev}/check-for-errors .

cp ${Dev}/doc-d/semantics.pdf ${DOC}

cp ${Dev}/kernel-d/package.json ${KERNEL}
cp ${Dev}/kernel-d/kernel0d.py ${KERNEL}/kernel0d.py
cp ${Dev}/kernel-d/stubbed-out-repl.py ${KERNEL}/repl.py
cp ${Dev}/kernel-d/splitoutput.js ${KERNEL}
cp ${Dev}/kernel-d/kernel0d.js ${KERNEL}/kernel0d.js
cp ${Dev}/kernel-d/kernel0d.lisp ${KERNEL}/kernel0d.lisp

cp ${Dev}/das-d/das2json.mjs ${DAS}/das2json.mjs

cp ${Dev}/t2t-d/lib-d/args.part.js ${T2T}/lib
cp ${Dev}/t2t-d/lib-d/front.part.js ${T2T}/lib
cp ${Dev}/t2t-d/lib-d/middle.part.js ${T2T}/lib
cp ${Dev}/t2t-d/lib-d/tail.part.js ${T2T}/lib
cp ${Dev}/t2t-d/lib-d/rwr.mjs ${T2T}/lib

${Dev}/import-minimal-tas.bash ${TaS_Dev} ${TAS}
${Dev}/import-minimal-dtree.bash ${dtree_Dev} ${DTREE}

