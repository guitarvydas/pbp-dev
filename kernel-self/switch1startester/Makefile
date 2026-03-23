#	'ensure that formatted text option in draw.io is disabled everywhere'

D2J=../das2json/mac/das2json

all: switch1startester

switch1startester: switch1startester.drawio.json generated.mjs
	cat generated.mjs main.mjs >switch1startester.mjs
	node switch1startester.mjs "." "-" "-" main switch1startester.drawio.json

generated.mjs: ../generated.mjs
	cp ../generated.mjs ./generated.mjs

switch1startester.drawio.json: ./switch1startester.drawio 
	${D2J} switch1startester.drawio

## house-keeping

clean:
	rm -rf *.json
	rm -rf *~
	rm -rf __pycache__

# python3 -m venv ./rt
# source rt/bin/activate
# pip3 install websockets
