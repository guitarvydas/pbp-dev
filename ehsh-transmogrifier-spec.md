I've built a software tool in it's own directory using several shell scripts and small programs in various languages (JS, Python, SWIPL) and using the PBP toolset.

I want to wrap this as a stand-alone, callable command-line unit avoiding Docker, using a shell script or python (or something more appropriate)? The programs and scripts cannot be compiled into a single executable, they must run at runtime.

For this discussion, I will abbreviate the working directory pathname to "WD".

For this discussion, I will abbreviate the directory pathname of the tool to "DTREED".

For this discussion, I will abbreviate the tool to "DTREE". 

For this discussion, I will abbreviate the pathname of the PBP library as "LIBD". 

In the resulting code, I want to make these pathnames available (should they be environment variables or something else?) to any scripts or code invoked from this tool, made unique in some way (maybe a prefix like "PBP_"? or by treating the variable value as a simple stack and pushing the value onto the front variable, much like is done with the PATH environment variable). If it is best to make the environment variables, then we need to export
- PBP_WD
- PBP_LIBD
- PBP_DTREED
- PBP_DTREE

I want to invoke dtree on the command line by passing it a single basename and a relative pathname to LIBD. The name refers to a .drawio file in WD. The result will be 4 files with suffixes ".frish", ".py", ".js" and ".dt" each with the specified basename, ending up in WD

DTREE may use several scripts found in the pbp library
- das2json «basename.drawio» : converts «basename.drawio» into «basename.drawion.json» 
- splitoutputs : inhales JSON from stdin if no command line arguments and produces the 4 files above ; used to accept the output from the main program that I describe below on stdin ; if there is a command line argument, it uses it as the JSON input and ignores stdin
- check-for-errors : accepts a filename either on the command line or via stdin and runs some checks possibly producing output on stderr ; returns a fail status if it finds anything wrong, otherwise results in a success status
- python with parameters: main.py «PBP LIBD» «PBP arg» main «PBP arg».json piped to «split outputs»

