#!/bin/bash
set -euo pipefail
NOW=$(date)
FRESHDIR="before-${NOW}"
mkdir ./"${FRESHDIR}"
mv ./kernel0d.py ./"${FRESHDIR}"
mv new-kernel0d.py kernel0d.py
