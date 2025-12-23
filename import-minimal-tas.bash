#!/bin/bash
# for TaS, use code that is known to work for TaS (ostensibly the same as ${KERNEL}/???, but not necessarily)
TaS_Dev=$1
TAS=$2
cp -f ${TaS_Dev}/* ${TAS}
