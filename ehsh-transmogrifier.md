Convert the given script into bash, with the following rules. Do not proceed if anything is unclear, ask me instead.
-This is a script that allows us to use multiple programming languages in a single project.
- We want to build a project while using multi-lingual tools built in pbp and using the pbp library.
- A multi-lingual tool consists of a directory containing shell scripts and programs written in various programming languages, all tied together by a pbp drawing (.drawio). To use the tool, we need to run the pbp drawing in its environment (it's directory) allowing it to invoke scripts and programs that were created and debugged in that environment.
-There are 3 main paths 
	1. the project working directory
	2. the tool / app working directory
	3. the pbp library
- all invoked scripts fail immediately if there is any error
- variable names can contain spaces, convert spaces to underscores
- variable names that begin with upper case are exported environment variables, exported to all scripts recursively invoked from this point, but disappear when this script ends
- variable names that begin with lower case are local to the script
- "«" variable name "»" is a variable interpolation - substitute the value of the variable at this point
- "parameter" refers to the command line parameters passed into the bash script
- "out.✗" is literally the filename, including the special character "✗"
- missing files should cause immediate errors and immediate failure
