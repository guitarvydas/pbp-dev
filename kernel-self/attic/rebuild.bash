#!/bin/bash
set -e
D2J=./das2json/mac/das2json
${D2J} rt2py.drawio
# ./gen-py.bash 0d.rt 0d.py
# ./gen-py.bash stock.rt stock.py
# ./gen-py.bash shellout.rt shellout.py
# cat 0d.py stock.py shellout.py > zd.py

# ./gen-py.bash count.rt count.py
# ./gen-py.bash decode.rt decode.py
./gen-py.bash reverser.rt reverser.py
# ./gen-py.bash delay.rt delay.py
# ./gen-py.bash monitor.rt monitor.py

cat reverser.py >generated-py.json
#cat zd.py count.py decode.py reverser.py delay.py monitor.py >generated-py.json
#echo '*** Python not generated ***' >generated-py.json
