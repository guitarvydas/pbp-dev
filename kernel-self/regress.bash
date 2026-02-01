#!/bin/bash
set -euo pipefail
if [[ "$(pwd)" == *"kernel-self" ]];
then
    cp ../kernel/*.rt .
    npm install
    node das2json.mjs kernel.drawio
    ./tas.bash 'external'
    ./tas.bash 'stock'
    ./tas.bash 'kernel_external'
    ./tas.bash '0d'
else
    echo "wrong directory"
    exit 1
fi


