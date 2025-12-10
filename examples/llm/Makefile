ifndef PBP_ROOT
$(error PBP_ROOT environment variable is not set)
endif

all: fivewhys

fivewhys: agency
	node ./pbp/das/das2json.mjs fivewhys.drawio
	python3 main.py . 'Why is concurrency programming so difficult?' main fivewhys.drawio.json |  node ./pbp/kernel/splitoutput.js
	cat out.md

agency:
	( cd agency ; make )

init:
	${PBP_ROOT}/init.bash
