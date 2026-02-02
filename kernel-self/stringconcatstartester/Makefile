#	'ensure that formatted text option in draw.io is disabled everywhere'

D2J=../das2json/mac/das2json

all: stringconcatstartester

stringconcatstartester: stringconcatstartester.drawio.json generated.mjs
	cat generated.mjs main.mjs >stringconcatstartester.mjs
	node stringconcatstartester.mjs "." "-" "-" main stringconcatstartester.drawio.json

generated.mjs: ../generated.mjs
	cp ../generated.mjs ./generated.mjs

stringconcatstartester.drawio.json: ./stringconcatstartester.drawio 
	${D2J} stringconcatstartester.drawio

## house-keeping

clean:
	rm -rf *.json
	rm -rf *~
	rm -rf __pycache__

# python3 -m venv ./rt
# source rt/bin/activate
# pip3 install websockets
