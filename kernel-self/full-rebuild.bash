#!/bin/bash
set -e
cp live-repl.py repl.py
D2J=./das2json/mac/das2json
${D2J} rt2py.drawio
./gen-py.bash 0d.rt.a generated.a.py
./gen-py.bash 0d.rt.b generated.b.py
cat generated.a.py generated.b.py > zd.py

./gen-py.bash count.rt count.py
./gen-py.bash decode.rt decode.py
./gen-py.bash reverser.rt reverser.py
./gen-py.bash delay.rt delay.py
./gen-py.bash monitor.rt monitor.py

cat zd.py count.py decode.py reverser.py delay.py monitor.py >generated.py
# echo '*** Python not generated ***' >generated.py

${D2J} rt2cl.drawio
./gen-cl.bash 0d.rt.a generated.a.lisp
./gen-cl.bash 0d.rt.b generated.b.lisp
cat generated.a.lisp generated.b.lisp >zd.lisp

./gen-cl.bash count.rt count.lisp
./gen-cl.bash decode.rt decode.lisp
./gen-cl.bash reverser.rt reverser.lisp
./gen-cl.bash delay.rt delay.lisp
./gen-cl.bash monitor.rt monitor.lisp

cat zd.lisp count.lisp decode.lisp reverser.lisp delay.lisp monitor.lisp >generated.lisp
# echo '*** Common Lisp not generated ***' >generated.lisp

${D2J} rt2js.drawio
./gen-js.bash 0d.rt.a generated.a.mjs
./gen-js.bash 0d.rt.b generated.b.mjs
cat generated.a.mjs generated.b.mjs > zd.mjs

./gen-js.bash count.rt count.mjs
./gen-js.bash decode.rt decode.mjs
./gen-js.bash reverser.rt reverser.mjs
./gen-js.bash delay.rt delay.mjs
./gen-js.bash monitor.rt monitor.mjs

cat zd.mjs count.mjs decode.mjs reverser.mjs delay.mjs monitor.mjs >generated.mjs

