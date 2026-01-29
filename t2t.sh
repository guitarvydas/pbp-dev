#!/bin/bash
set -e
grammar=$1
rewrite=$2
src=$3

node "${PBP_T2T_LIBD}/rwr.mjs" "${rewrite}" >"${PBP_WD}/temp.rewrite.mjs"
sed -e 's/`/` + "`" + String.raw`/g' <"${grammar}" >temp.grammar
cat "${PBP_T2T_LIBD}/front.part.js" temp.grammar "${PBP_T2T_LIBD}/middle.part.js" "${PBP_T2T_LIBD}/args.part.js" "${PBP_WSUPPORT}" "${PBP_WD}/temp.rewrite.mjs" "${PBP_T2T_LIBD}/tail.part.js" >"${PBP_WD}/temp.nanodsl.mjs"
node "${PBP_WD}/temp.nanodsl.mjs" "${src}"
