#!/bin/bash
set -euo pipefail

# cd to pbp-kit (or local project), then run this script
# ~/projects/pbpev/import-minimal.bash

# ── guard: PBP_ROOT must be set ──────────────────────────────────────────────
if [ -z "${PBP_ROOT:-}" ]; then
    echo "Error: PBP_ROOT environment variable is not set" >&2
    echo "Error:   put 'export PBP_ROOT=<your path>' in your .bashrc or .zshrc" >&2
    echo "Error:   replacing <your path> with a path customized for your setup" >&2
    exit 1
fi

Dev="${PBP_ROOT}"
TaS_Dev="${PBP_ROOT}/tas"
dtree_Dev="${PBP_ROOT}/dtree"

# ── guard: source root must exist ────────────────────────────────────────────
if [ ! -d "${Dev}" ]; then
    echo "Error: PBP_ROOT directory does not exist: ${Dev}" >&2
    exit 1
fi

# ── helper: copy with existence check ────────────────────────────────────────
safe_cp() {
    local src="$1"
    local dst="$2"
    if [ ! -e "${src}" ]; then
        echo "Warning: source not found, skipping: ${src}" >&2
        return 0
    fi
    cp -- "${src}" "${dst}"
}

# ── helper: run external script with existence check ─────────────────────────
safe_run() {
    local script="$1"
    shift
    if [ ! -x "${script}" ]; then
        echo "Error: script not found or not executable: ${script}" >&2
        exit 1
    fi
    "${script}" "$@"
}

# ── destination layout ───────────────────────────────────────────────────────
wd="$(pwd)"
pbp="${wd}/pbp"

KERNEL="${pbp}/kernel"
DAS="${pbp}/das"
TAS="${pbp}/tas"
T2T="${pbp}/t2td"
DTREE="${pbp}/dtree"
DOC="${pbp}/doc"

# ── (re)build destination tree ───────────────────────────────────────────────
rm -rf -- "${pbp}"
mkdir -p -- \
    "${TAS}" \
    "${DAS}" \
    "${T2T}/lib" \
    "${KERNEL}" \
    "${DOC}"

# ── top-level files ──────────────────────────────────────────────────────────
for f in \
    main.py \
    init.bash \
    kernel/package.json \
    api.md \
    indent \
    t2t \
    das2json \
    splitoutputs \
    check-for-errors \
    resetlog \
    rigid_indent \
    brace_indent \
    brace_indent_del \
    del_blank_lines \
    trmog
do
    safe_cp "${Dev}/${f}" "${pbp}/"
done

# ── doc ──────────────────────────────────────────────────────────────────────
safe_cp "${Dev}/doc/semantics.pdf"              "${DOC}/"

# ── kernel ───────────────────────────────────────────────────────────────────
safe_cp "${Dev}/kernel/package.json"            "${KERNEL}/"
safe_cp "${Dev}/kernel/kernel0d.py"             "${KERNEL}/kernel0d.py"
safe_cp "${Dev}/kernel/stubbed-out-repl.py"     "${KERNEL}/repl.py"
safe_cp "${Dev}/kernel/splitoutput.js"          "${KERNEL}/"
safe_cp "${Dev}/kernel/kernel0d.js"             "${KERNEL}/kernel0d.js"
safe_cp "${Dev}/kernel/kernel0d.lisp"           "${KERNEL}/kernel0d.lisp"

# ── das ──────────────────────────────────────────────────────────────────────
safe_cp "${Dev}/das/das2json.mjs"               "${DAS}/das2json.mjs"

# ── t2td/lib ─────────────────────────────────────────────────────────────────
for f in args front middle tail; do
    safe_cp "${Dev}/t2td/lib/${f}.part.js"      "${T2T}/lib/"
done
safe_cp "${Dev}/t2td/lib/rwr.mjs"               "${T2T}/lib/"

# ── delegate to sub-importers ────────────────────────────────────────────────
safe_run "${Dev}/import-minimal-tas.bash" "${TaS_Dev}" "${TAS}"
mkdir -p "${pbp}/dtree"
safe_run "${HOME}/projects/dtree/min.bash" "${pbp}/dtree"
mkdir -p "${pbp}/sm"
safe_run "${HOME}/projects/sm/min.bash" "${pbp}/sm"

#echo "import-minimal: done (${pbp})"

