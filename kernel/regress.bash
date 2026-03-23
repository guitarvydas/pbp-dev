#!/bin/bash
set -euo pipefail
rm -rf ../kernel-self
cp -R ../kernel ../kernel-self
cd ../kernel-self
mv new-kernel0d.py kernel0d.py
./make.bash
echo "if OK, then run ./cpnew.bash"


