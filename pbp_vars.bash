#!/bin/bash
pbplib=$1
export PBP_runpbp="${pbplib}/runpbp"
export PBP_indent="${pbplib}/tas-d/indenter.mjs"
export PBP_t2t="${pbplib}/t2t"
export PBP_das2json="${pbplib}/das-d/das2json.mjs"
export PBP_split_outputs="${pbplib}/kernel-d/splitoutputs"
export PBP_check_for_errors="${pbplib}/das-d/check-for-errors"

