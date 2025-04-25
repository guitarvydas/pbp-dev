#	'ensure that formatted text option in draw.io is disabled everywhere'

#SRC=test.rt
#SRC=count.rt
#SRC=decode.rt
SRC=reverser.rt
#SRC=test.err.rt
#SRC=0d.rt


out.py: 0d.rt stock.rt shellout.rt emit.ohm emitPython.rewrite
	./build.bash

all:
	cp rebuild-all.bash rebuild.bash
	python3 choreographer.py

# kernel0d.py: ~/projects/rt/generated.py
# 	cp ~/projects/rt/generated.py ./kernel0d.py

## house-keeping

clean:
	rm -rf *.json
	rm -rf junk*
	rm -rf temp.*
	rm -rf *~
	rm -rf __pycache__
	rm -f generated-*
	rm -f rebuild.bash

install-js-requires:
	npm install yargs prompt-sync ohm-js @xmldom/xmldom
pyenv:
	python3 -m venv ./rt
	# source rt/bin/activate
	# pip3 install websockets
