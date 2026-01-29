ifndef PBP_ROOT
$(error PBP_ROOT environment variable is not set)
endif

all:
	node ./pbp/das/das2json.mjs par.drawio
	python3 main.py . '' main par.drawio.json

init:
	${PBP_ROOT}/init.bash
