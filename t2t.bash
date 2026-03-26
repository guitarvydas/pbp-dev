#!/bin/bash
set -e

if [ "$#" -eq 1 ]; then
  grammar="${PBPWD}/$1.ohm"
  rewrite="${PBPWD}/$1.rwr"
elif [ "$#" -eq 2 ]; then
  grammar="${PBPWD}/$1.ohm"
  rewrite="${PBPWD}/$2.rwr"
else
  echo "Usage: $0 base            # uses base.ohm and base.rwr" >&2
  echo "   or: $0 grammar-base rewrite-base" >&2
  exit 1
fi
src=-

# t2tlibd is the lib directory for t2t
t2tlibd="${PBP}/t2td/lib"
# wsupport is support.js in the current working directory
wsupport="${PBPWD}/support.mjs"

node "${t2tlibd}/rwr.mjs" "${rewrite}" >"${PBPWD}/temp.rewrite.mjs"

sed -e 's/`/` + "`" + String.raw`/g' <"${grammar}" >"${PBPWD}/temp.grammar"

echo cat "${t2tlibd}/front.part.js" "${PBPWD}/temp.grammar" "${t2tlibd}/middle.part.js" "${t2tlibd}/args.part.js" "${wsupport}" "${PBPWD}/temp.rewrite.mjs" "${t2tlibd}/tail.part.js" >"${PBPWD}/temp.nanodsl.mjs"

cat "${t2tlibd}/front.part.js" "${PBPWD}/temp.grammar" "${t2tlibd}/middle.part.js" "${t2tlibd}/args.part.js" "${wsupport}" "${PBPWD}/temp.rewrite.mjs" "${t2tlibd}/tail.part.js" >"${PBPWD}/temp.nanodsl.mjs"

node "${PBPWD}/temp.nanodsl.mjs" "${src}"
