#!/bin/bash
echo running larson.py
cat zd.py count.py decode.py reverser.py delay.py monitor.py larsonmain.py >larson.py
python3 larson.py . ../0D/python "" main scanner.drawio.json
