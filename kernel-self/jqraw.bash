#!/bin/bash
# collapse all stdin JSON to 1 line per top-level array element
# usage: ./jqraw.bash <rt2all.drawio.json >tmp.json
jq -r '
  "{", ([to_entries[] | @json "\(.key):\(.value)"] | .[:-1][] += ",")[], "}"
'
