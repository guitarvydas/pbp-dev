create a python script called `trmog` that I will put into the ${PBP} directory that is invoked as:

`${PBP}/trmog --outname "${test}" --drawing grid.drawio --main main.py --arg "${test}.grid"`

the rest is pseudo-bash syntax:

trmog runs
  `rm -f out.*`
  `${PBP}/das2json "${drawing}"`
  `python "${main}" "${arg}" main "${drawing}.json" | ${PBP}/splitoutputs
  
  where {
    ${PBP} is an environment variable
	splitoutputs is a script on the ${PBP} path
  }

## afterwards, trmog moves results to caller's working directory, if no errors were encountered (if out.✗ exists, then there were errors and out.✗ contains the error messages)
if [ -f out.✗ ]
then
    echo
    echo ">> ERROR <<"
    cat out.✗
else
    for every out.<???> mv out.<???> to "${outname}.<???>"
    rm -f temp.*
fi  if 

---

before running step 1, trmog needs to do `rm -f out.*`. Show me the full trmog again.

It appears to have left `out.py` (and `out.0.grid`) and the temp.* files and hasn't removed them.
