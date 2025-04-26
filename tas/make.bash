#!/bin/bash
set -e
node das2json.js rt2all.drawio
./rt 'stock'

