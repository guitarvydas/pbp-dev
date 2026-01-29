ifndef PBP_ROOT
$(error PBP_ROOT environment variable is not set)
endif

all:
	node ./pbp/das/das2json.mjs seq.drawio
	python3 main.py . '' main seq.drawio.json

init:
	${PBP_ROOT}/init.bash
