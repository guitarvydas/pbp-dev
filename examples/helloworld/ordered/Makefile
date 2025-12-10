ifndef PBP_ROOT
$(error PBP_ROOT environment variable is not set)
endif

all:
	node ./pbp/das/das2json.mjs ordered.drawio
	python3 main.py . '' main ordered.drawio.json

init:
	${PBP_ROOT}/init.bash
