#!/bin/bash
set -e
#!/bin/bash
if grep span $1 ; then \
    echo 'draw.io sometimes inserts "span" into port names (if word wrap and/or formatted text enabled)'
    echo 'this is an error, do not continue'
    echo 'turn off "word wrap" and "formatted text" options for each port in draw.io ' for "$1"
    exit 1
else
    # echo OK
    exit 0
fi

