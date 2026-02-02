{
  quit immediately if there are any errors
  PBP WD = working directory from which this script was invoked
  PBP LIBD = full path specified by second parameter and expanded to full
  PBP APPD = full path of first parameter and expanded to full
  app main = «PBP APPD» with suffix '.drawio'
  PBP arg = third parameter as full path if it's a file or just the third parameter
  PBP t2t = «PBP LIBD»/t2t.sh
  PBP das2json = «PBP LIBD>/das2json.sh
  PBP split outputs = «PBP LIBD»/splitoutputs.sh
  PBP check for errors = «PBP LIBD»/check-for-errors.sh
  push «PBP LIBD»/kernel onto PYTHONPATH
  cd to the «PBP APPD» directory, to run the tool
  first, remove all 'out.*' files
  run «das2json» on «app main»
  run «check for errors» on «app main».json
  run python with parameters: main.py «PBP LIBD» «PBP arg» main «PBP arg».json piped to «split outputs»
  if the run produced "out.✗" {
    change the name of "out.✗" to "ERRORS"
    print out "ERRORS"
    quit with error status
  } else {
    move "out.frish" to «PBP WD» while changing its name to the basename of «PBP arg».frish
    move "out.dt" to «PBP WD» while changing its name to the basename of «PBP arg».dt
    move "out.js" to «PBP WD» while changing its name to the basename of «PBP arg».js
    move "out.py" to «PBP WD» while changing its name to the basename of «PBP arg».py
  }
}
```
