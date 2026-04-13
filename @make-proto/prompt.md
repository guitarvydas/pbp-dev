# @make
I want to write one generic and one custom build script for a project that allows the project to be built in two different ways:
1. as a top level build of the basic tool, including a test for the tool
2. as a sub-level build that runs the tools on a caller-supplied target and leaves the result in the caller's working directory

The generic script is called "@make".
The custom script is called "@makec".
A custom test script, called "@testc" exists but is only used during top-level builds.

In both cases, the custom script may involve calling multiple languages and scripts (eg. Python, JS, JQ, SWIPL, bash, zsh, etc.). All of the languages / tools return 0 on success and non-0 on failure (the usual shell return codes). When a tool fails, it first creates a file "out.✗" and the contents of that file must be printed on the console, if it exists, on failure, regardless if the file is in the current working directory or that of the caller.

The top-level build must occur in an environment that contains
- $PBP - path to other tools used by the build script
- $PBPWD - working directory path of the current build
- $PYTHONPATH - set up to point to the Python path used to build the tool

When the tool is called in sub-level mode, its $PBP, $PBPWD and $PYTHONPATH must point to the paths used when building the top level version of the tool. The caller has its own version of these variables, but these values must be shadowed when rerunning the sub-level tool and then unshadowed when returning to the caller's script.

The tool build uses the variables $TARGET and $TARGETPATH to indicate the name of the output and the path where the generated file will be put. 
In the case of a top-level build, $TARGETPATH will be the same as $PBPWD, i.e. the working directory of the tool.
In the case of a sub-level build, $TARGETPATH will be supplied by the caller.


In both cases, the programmer only needs to call "@make" with appropriate conmmand line args.
If no args are given, this is a top level build and the script sets up default versions of the variables.
If two args are given, the first is taken to be $TARGETPATH and the second is the basename (without suffix) of the target ($TARGET).

When a top-level build is specified, @make punts custom build work to @makec and custom test work to @testc.
When a sub-level build is specified, @make punts custom build work to @makec and does not invoke @testc.

I need templates for @make, @makec and @testc. I will fill in the custom details on a per-project basis.

If this specification is unclear or has missing information, ask me, do not infer the intended operational semantics.

--- abandon ---
