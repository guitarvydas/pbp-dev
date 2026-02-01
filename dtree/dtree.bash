#!/bin/bash
set -e
fname="$2"
export pbp="$1"
export PYTHONPATH="${pbp}/kernel:$PYTHONPATH"
splitoutjs="${pbp}/kernel/splitoutput.js"
node "${pbp}/das/das2json.mjs" dtree-transmogrifier.drawio
./check-for-span-error.bash  dtree-transmogrifier.drawio.json
python main.py "${pbp}" "${fname}.drawio" main  dtree-transmogrifier.drawio.json | node "${splitoutjs}"
if [ -f out.✗ ]
then
    cat out.✗
    echo
    exit 1
fi
