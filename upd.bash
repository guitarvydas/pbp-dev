#!/bin/bash
# ./upd.bash ~/projects/pbp-kit
echo
echo "updating $1"
echo
set -x
cp ~/projects/pbp-dev/kernel/kernel0d.py "$1/pbp/kernel"
cp ~/projects/pbp-dev/kernel/kernel0d.js "$1/pbp/kernel"
cp ~/projects/pbp-dev/kernel/kernel0d.lisp "$1/pbp/kernel"
cp ~/projects/pbp-dev/das/das2json.mjs "$1/pbp/das"
cd "$1"
git add "./pbp/kernel/kernel0d.py"
git add "./pbp/kernel/kernel0d.js"
git add "./pbp/kernel/kernel0d.lisp"
git add "./pbp/das/das2json.mjs"
git commit -q -m 'update kernel and das2json'
git push
