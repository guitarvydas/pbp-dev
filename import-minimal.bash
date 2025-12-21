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

# for TaS, use code that is known to work for TaS (ostensibly the same as ${KERNEL}/???, but not necessarily)
cp ${TaS_Dev}/cldecode.{ohm,rewrite} ${TAS}
cp ${TaS_Dev}/cleanup.py ${TAS}
cp ${TaS_Dev}/clindenter.mjs ${TAS}
cp ${TaS_Dev}/clmvline.py ${TAS}
cp ${TaS_Dev}/clrelocate.py ${TAS}
cp ${TaS_Dev}/decodeoutput.mjs ${TAS}
cp ${TaS_Dev}/das2json.js ${TAS}
cp ${TaS_Dev}/emit.ohm ${TAS}
cp ${TaS_Dev}/emitPython.rewrite ${TAS}
cp ${TaS_Dev}/emitcl.rewrite ${TAS}
cp ${TaS_Dev}/emitjs.rewrite ${TAS}
cp ${TaS_Dev}/errgrep.py ${TAS}
cp ${TaS_Dev}/indenter.mjs ${TAS}
cp ${TaS_Dev}/internalize.{ohm,rewrite} ${TAS}
cp ${TaS_Dev}/jsdecode.{ohm,rewrite} ${TAS}
cp ${TaS_Dev}/jsindenter.mjs ${TAS}
cp ${TaS_Dev}/jsrelocate.py ${TAS}
cp ${TaS_Dev}/kernel0d.py ${TAS}
cp ${TaS_Dev}/main.py ${TAS}
cp ${TaS_Dev}/pydecode.{ohm,rewrite} ${TAS}
cp ${TaS_Dev}/pyrelocate.py ${TAS}
cp ${TaS_Dev}/repl.py ${TAS}
cp ${TaS_Dev}/tas.drawio ${TAS}
cp ${TaS_Dev}/semantics.{ohm,rewrite} ${TAS}
cp ${TaS_Dev}/support.js ${TAS}
cp ${TaS_Dev}/syntax.{ohm,rewrite} ${TAS}
cp ${TaS_Dev}/unencode.mjs ${TAS}
