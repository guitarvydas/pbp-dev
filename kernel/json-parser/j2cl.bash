#!/bin/bash
# usage: json-parser/j2cl.bash scanner.drawio.json
# converts ???.drawio.json to ???.drawio.json.lisp, i.e. a lisp data structure that can be expanded into lists of hash tables
# use das2json to convert ???.drawio to ???.drawio.lisp (as in rebuild.bash)
T2T=../t2t/nanodsl
T2TLIB=../t2t/lib
J2CL=./json-parser
${T2T} ${T2TLIB} ${J2CL}/json.grammar ${J2CL}/json.rewrite ${J2CL}/jsonsupport.js $1 >$1.lisp

