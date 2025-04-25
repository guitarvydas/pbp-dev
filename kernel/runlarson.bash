#!/bin/bash
set -e
cd ../rtlarson
make scanner.drawio.json
cd ../rt
cp ../rtlarson/scanner.drawio.json .
./rebuild.bash
cat zd.py count.py decode.py reverser.py delay.py monitor.py larsonmain.py >larson.py
./run1.bash
