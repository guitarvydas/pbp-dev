#!/bin/zsh
# $1 is the working directory of the project (usually '.')
# $2 is the directory of the pbp toolset (usually './pbp')
# $3 is the name (sans suffix) of the .drawio file input and the name of the .frish output and the .py output
set -e
wd="$(realpath "$1")"
pbpd="$(realpath "$2")"
name="$3"
cd "${pbpd}/dtree"
python main.py "${pbpd}/" "$3.drawio" main  dtree-transmogrifier.drawio.json | node ${pbpd}/kernel/splitoutput.js
if [ -f out.✗ ]
then
    cat out.✗
else
    mv out.frish ${wd}/${name}.frish
    mv out.py ${wd}/${name}.py
fi
#cd ${wd}
