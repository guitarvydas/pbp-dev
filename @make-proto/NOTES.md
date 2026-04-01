${PBP}/das2json dtree-transmogrifier.drawio
python main.py "${PBPCALLER}/${fname}.drawio" main dtree-transmogrifier.drawio.json | ${PBP}/splitoutputs
if [ -f out.✗ ]
then
    echo
    echo ">> ERROR <<"
    cat out.✗
    exit 1
else
    mv out.frish "${PBPCALLER}/${fname}.frish"
    mv out.dt "${PBPCALLER}/${fname}.dt"
    rm -f out.js out.py # generated from wrong diagram
fi

- bash, node, python, swipl, jq
  - node for OhmJS + RWR
  - node for translate.js
  - bash for pipeline to to split generated outputs
  - bash for splitoutputs script
  - bash for indent script
  - node for indent.mjs
  - bash for t2t script
  - bash to print out.✗
  - bash to sequence steps
  - Python importing kernel0d.py
  - fake pipeline via file for pre-normalized.json                <<<<<<< uniqify name of temp file

Further: the path of least resistance, for me, for building the "dtree" diagram transmogrifier, involves using the following tools: bash, node.js, python, swipl, jq (node.js for OhmJS plus RWR (my DSL (written in OhmJS)), swipl == SWI Prolog). I am able to develop with a combination of these tools, still wondering about options to ship a "production" version (I _could_ rewrite everything in one language, one executable, but I would prefer to just use what I've already got (and, Docker seems like overkill).

# Options
- re-script everything in a meta-language, use transmogrifier to emit code in one language --> one executable
  - use Python
	- use prolog.js as prolog.py to repace swipl
  - use Janet, 
	- with Scheme to janet for prolog replacement
	- with OhmJS to Janet PEG for grammar and rewriter (t2t)
	- meta-syntactify indenter
	- convert pipelines to temp file
  - use SBCL
	- is SBCL portable to Windows, MacOS, Linux?
	- cl-holm library for CL
- use Docker to contain all tools
