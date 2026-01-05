PBP=../
all:
	rm -f out.*
	rm -f *.json
	node $(PBP)/das/das2json.mjs dtree-transmogrifier.drawio
	./check-for-span-error.bash  dtree-transmogrifier.drawio.json
	python3 main.py $(PBP) 'xinterpret.drawio' main  dtree-transmogrifier.drawio.json | node $(PBP)/kernel/splitoutput.js
	@if [ -f out.✗ ]; then \
	  cat out.✗; \
	fi

install:
	npm install yargs prompt-sync ohm-js @xmldom/xmldom

clean:
	rm -f out.*
	rm -f *.json
	rm -f junk.* temp.*
