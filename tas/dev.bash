#!/bin/bash
set -e
cp ../zd/1.kernel0d.py ../zd/kernel0d.py
# node das2json.js rt2all.drawio
# ./rt '0d'
# NOW=$(date)
# FRESHDIR="before-${NOW}"
# mkdir ../zd/"${FRESHDIR}"
# mv ../zd/kernel0d.py ../zd/"${FRESHDIR}"
# cat 0d.py shellout.py stock.py >../zd/kernel0d.py
./make.bash
