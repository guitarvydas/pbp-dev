# TaS - Text as Syntax Compiler
A "new" textual language that inhales '.rt' files and spits out Python and Javascript and Common Lisp equivalents.


# Usage:
./make.bash

# Nuts and Bolts
Currently the compiler is built as a DaS (Diagrams as Syntax) project. See the source code in `tas.drawio` and use the draw.io editor to edit it: [drawio tool](https://app.diagrams.net).

DaS is used to keep things flexible. In the future, it should be possible to boil the whole thing down into just a few JS and Python and bash files (as was done for the t2t/ stuff and for das2json.mjs).

# Status
This used to be a working directory for building the 0D kernel, and, the Larson Scanner, and, Tas (formerly called RT) all done in a multi-process, windowed REPL. This version runs only from the command line.

WIP ... I'm trying to clean out everything leaving only the TaS compiler related stuff.

To see the original, look at the rt repository. [Not necessary].

This version compiles `stock.rt` into `stock.py` and `stock.js` and `stock.lisp` as a test.
