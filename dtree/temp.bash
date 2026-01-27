#!/bin/bash
set -e
fname="$2"
export pbp="$1"
export PYTHONPATH="${pbp}/kernel:$PYTHONPATH"
splitoutjs="${pbp}/kernel/splitoutput.js"
node ${pbp}/das/das2json.mjs "${fname}.drawio"
./check-for-span-error.bash  "${fname}.drawio.json}
python main.py ${pbp} 'xinterpret.drawio' main  "${fname}.drawio.json" | node "${splitoutjs}"
if [ -f out.✗ ]
then
    cat out.✗
    exit 1
fi
