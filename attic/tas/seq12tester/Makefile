#	'ensure that formatted text option in draw.io is disabled everywhere'

D2J=../das2json/mac/das2json

all: seq12tester

seq12tester: seq12tester.drawio.json generated.mjs bootstrap0d.py
	cat generated.mjs main.mjs >seq12tester.mjs
	python3 main.py "." "-" "-" main seq12tester.drawio.json

seq12testerjs: seq12tester.drawio.json generated.mjs
	cat generated.mjs main.mjs >seq12tester.mjs
	node seq12tester.mjs "." "-" "-" main seq12tester.drawio.json

bootstrap0d.py: ~/projects/rt/generated.py
	cp ~/projects/rt/generated.py ./bootstrap0d.py

generated.mjs: ../generated.mjs
	cp ../generated.mjs ./generated.mjs

seq12tester.drawio.json: ./seq12tester.drawio 
	${D2J} seq12tester.drawio

## house-keeping

clean:
	rm -rf *.json
	rm -rf *~
	rm -rf __pycache__

# python3 -m venv ./rt
# source rt/bin/activate
# pip3 install websockets
