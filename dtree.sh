#!/bin/zsh
# $1 is the working directory of the project (usually '.')
# $2 is the directory of the pbp toolset (usually './pbp')
# $3 is the name (sans suffix) of the .drawio file input and the name of the .frish output and the .py output
wd="$(realpath "$1")"
pbpd="$(realpath "$2")"
name="$3"
rm -f "${pbpd}/dtree/out.*"
rm -f "${pbpd}/dtree/*.json"
set -e
cd "${pbpd}/dtree"
node ${pbpd}/das/das2json.mjs ${pbpd}/dtree/dtree-transmogrifier.drawio
./check-for-span-error.bash  dtree-transmogrifier.drawio.json
python main.py "${pbpd}/" "${wd}/$3.drawio" main  ${pbpd}/dtree/dtree-transmogrifier.drawio.json | node ${pbpd}/kernel/splitoutput.js
if [ -f out.✗ ]
then
    cat out.✗
else
    mv out.frish ${wd}/${name}.frish
    mv out.dt ${wd}/${name}.dt
fi
#cd ${wd}
