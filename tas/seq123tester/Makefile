#	'ensure that formatted text option in draw.io is disabled everywhere'

D2J=../das2json/mac/das2json

all: seq123tester

seq123tester: seq123tester.drawio.json generated.mjs
	cat generated.mjs main.mjs >seq123tester.mjs
	node seq123tester.mjs "." "-" "-" main seq123tester.drawio.json

generated.mjs: ../generated.mjs
	cp ../generated.mjs ./generated.mjs

seq123tester.drawio.json: ./seq123tester.drawio 
	${D2J} seq123tester.drawio

## house-keeping

clean:
	rm -rf *.json
	rm -rf *~
	rm -rf __pycache__

# python3 -m venv ./rt
# source rt/bin/activate
# pip3 install websockets
