#!/bin/bash
set -euo pipefail

src_dir="."
dst_dir="../kernel"

for src_file in "$src_dir"/*; do
  if [[ ! -f "$src_file" ]]; then continue; fi
  
  base=$(basename "$src_file")
  dst_file="$dst_dir/$base"
  
  if [[ -f "$dst_file" && "$src_file" -nt "$dst_file" ]]; then
    cp -v "$src_file" "$dst_file"
  fi
done
