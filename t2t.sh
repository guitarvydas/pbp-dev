#!/bin/bash
set -euo pipefail

echo "$@" >${PBP_WD}/temp.t2t.args

if [ "$#" -eq 1 ]; then
  grammar="$1.ohm"
  rewrite="$1.rwr"
elif [ "$#" -eq 2 ]; then
  grammar="$1.ohm"
  rewrite="$2.rwr"
else
  echo "Usage: $0 base            # uses base.ohm and base.rwr" >&2
  echo "   or: $0 grammar-base rewrite-base" >&2
  exit 1
fi
src=-

t2tlibd="${PBP_LIBD}/t2t-d/lib-d"
node "${t2tlibd}/rwr.mjs" "${rewrite}" >"${PBP_WD}/temp.rewrite.mjs"
sed -e 's/`/` + "`" + String.raw`/g' <"${grammar}" >temp.grammar
echo cat "${t2tlibd}/front.part.js" temp.grammar "${t2tlibd}/middle.part.js" "${t2tlibd}/args.part.js" "${PBP_WSUPPORT}" "${PBP_WD}/temp.rewrite.mjs" "${t2tlibd}/tail.part.js" >"${PBP_WD}/temp.nanodsl.mjs"
cat "${t2tlibd}/front.part.js" temp.grammar "${t2tlibd}/middle.part.js" "${t2tlibd}/args.part.js" "${PBP_WSUPPORT}" "${PBP_WD}/temp.rewrite.mjs" "${t2tlibd}/tail.part.js" >"${PBP_WD}/temp.nanodsl.mjs"
node "${PBP_WD}/temp.nanodsl.mjs" "${src}"
