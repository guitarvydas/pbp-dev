all: fivewhys

fivewhys: agency
	node ../../das/das2json.mjs fivewhys.drawio
	python3 main.py . 'Why is concurrency programming so difficult?' main fivewhys.drawio.json |  node ../../kernel/splitoutput.js

agency:
	( cd agency ; make )
