The goal is to allow using many programming languages to produce a running program.

The ability to easily use multiple languages is important for breaking out of the stone-age, 20th century mindset that _all_ software needs to be optimized to production levels. 21st century computers are powerful enough and cheap enough to allow us to build less-optimized programs as helpers and tools for our own programming workflow.

In the 20th century, programming adopted a stone-age workflow consisting of using one textual programming language and a text (fixed text, programmers') editor. And, useful programming languages like Prolog were shunned due to perceived inefficiency.

In the 21st century we can use techniques like backtracking again. This allows us to easily build tools that increase our own productivity during production program development. For example, we can use PEG parsing technologies like OhmJS, we can use Prolog to inference information instead of writing complicated and hoary code containing loops and recursion.

Trying to use traditional polyglot (multi-language) techniques to quickly build tools for ourselves is often too painful and too complicated to bother with for small, quickie helper tools. Traditional techniques involve use of `#ifdef`s and `FFI`s and shell pipelines. `#ifdef`s sully the source code and make the code harder to read and harder to reason about (you have to "play computer in your head" to understand which pieces of code). `FFI`s require a deep understanding of the data structure differences between the various programming language. Again, stopping to think hard about issues that aren't directly related to the programs we are trying to invent slows us down, stops our flow, and causes us to avoid building a plethora of tools because the process takes too long. Shell pipelines allow us to build polyglot solutions in a convenient manner, but, due to the 20th century mindset that _all_ programs must produce a single, stand-alone executable, we have generally ignored this route. The tools available for building pipelines remain rooted in the stone age and our 20th century mindset makes us think that type checking is  necessary for programming (type checking is just a helper that makes it easier to build stand-alone executables), thus, we avoid dynamic scoping that could help us quickly build tools for ourselves. `@make` uses environment variable inheritance in a manner similar to "special" variables in Common Lisp or dynamic binding in Lisp 1.5.

We can do everything with today's technology that `@make` does, but this requires us to think hard, which stops our "flow" and causes us to avoid building "quickie" helper tools. The issue is not _whether_ we can do something, it's _how convenient_ it is to do it. For example, we don't actually need programming languages - we could simply build hardware using transistors and ICs, but, using programming languages makes the process much easier, thus enabling a larger class of designers ("programmers") to build hardware more easily.

For example, I often use OhmJS, Javascript, Python, bash and SWIPL (Prolog) to build diagram compilers (transmogrifiers). I have to use Javascript because OhmJS is written in Javascript. I have to infer some relationships, because current diagram editors don't produce the information required for creating DPLs with varied semantics. When it comes to doing inferencing, using Prolog syntax makes it much easier to express and reason about, rather than writing hoary code in imperative and functional programming languages. Ultimately, I would rather use any language better than Javascript (like Python, Common Lisp, Odin, etc.), but I want to mix in snippets of code written in paradigms not inherently supported by Python. I develop the transmogrifier in its own project directory, then go on to developing another project in another directory. The second project can use the first project as a sub-project, even though the sub-project is not a single, monolithic program stored in `./local/bin`, without needing to know about the internals of the sub-project, like which languages are used. The second project provides command line parameters, and possibly a file in its own directory, the sub-project runs and leaves its result in a file in the second project's directory (not its own directory). 

An example is the `frishc` project which is mostly written in meta-Python. One part of the source code is written as a diagram (a "decision tree"). The `frishc` project build script calls the sub-project `dtree` to transmogrify the diagram into meta-Python source code. The `frishc` build script includes the generated code into its own source code, then builds the rest of the `frishc` project. The `frishc` project transmogrifies meta-Python into runnable Python, including the part that was generated from the diagram. The wip code for `frishc` is in a public github repo (...) and the code for the `dtree` project is in another github repo (...). The `dtree` project uses a diagram as its main source code - the diagram expresses a diagram transmogrifier that transmogrifies decision tree diagrams into meta-Python. The `dtree` projects uses a diagram of PBP source code to transmogrify diagrams of decision trees into meta-Python. PBP source code is written using the drawio editor. Decision tree source code is written using the drawio editor. Both syntaxes are different. The PBP DPL (Diagrammatic Programming Language) uses syntax that looks like an extended form of node-and-arrow, while the `dtree` syntax consists of only 3 kinds of graphical figures (rhombuses, yes/no arrows, "process" boxes ; all 3 figures can contain text). Neither DPL is Turing complete, but act as layers that allow expression of snippets of code that can be combined with manually written snippets of code in some Turing complete language (like Python, Javascript, Common Lisp, Odin).

This is "polyglot" programming without the need to resort to `#ifdef`s and `FFI`s. Source code for the project can be written in any programming language and live entirely in the eco-system provided by the language's compiler/interpreter, using whatever data structures and paradigms provided by the language eco-system. For example, Prolog `functors` are represented internally in ways that are not directly usable in, say, Python programs. We want to express parts of a program using Prolog's relational techniques, but use Python's other language features for other parts of the program.

This method makes it possible to using Turing-incomplete notations, like small, but convenient DPLs to express portions of the source code for a project. For example, we can use diagrams to express decision trees and insert those trees into our final code. We can use diagrams to express state machines for control flow and insert such control flow logic into our final code, even when most of the code is written in a purely functional manner - control flow logic is more easily expressed as state machines rather than as mutually recursive functions (with added baubles like promises, coroutines, threads, etc.).

The key to all of this is _isolation_. We can build parts of programs in various ways as long as the parts are completely isolated from one another and have very well-defined ways of communicating and transferring data between one another. We already have workflows that allow for this kind of development - operating systems that wrap code in _processes_. This `@make` approach just extends and structures the approach and allows us to think in terms of _parts_ instead of in terms of stand-alone _programming languages_.

We need to develop code - in many languages - then make it available as a "Part" to other projects.

All "programming languages" are just 20th century IDEs for producing assembler code for 20th century computers.

"Type checking" is just a helper tool that helps us produce tested and working assembler faster.

There is only one programming language for computers - machine code.

Programming languages are notations for thought. Functional programming lets us think about problems that are pure computations without side-effects. Prolog (and its descendants) let us think in terms of queries on factbases. Statecharts lets us think in terms of control flow. Assembler lets us write machine code using humanized "mnemonics". Assembler transcends FP and Prolog, but, is a messy, spaghetti approach that doesn't let us think and express code in any particular paradigm. FP molds the spaghetti one way. Prolog molds it another way. Statecharts mold it yet another way.

Prolog syntax is much more convenient than writing imperative loops within loops in imperative languages and in FP languages.

Statechart syntax is much more convenient than writing complex control flows, ie. "reality", using only sequential composition, like in FP

Ideally, we should be able use workflows that use any, or all, of these languages.

To build a project, I invoke `@make`. `@make` contains boilerplate to set up various environment variables, and eventually calls `@makec` which contains custom build steps for the project-at-hand.

`@make` is invoked in two ways
1. to build a project
2. to allow the project to be "called" from another project as a sub-project.

`@make` invokes a per-project custom script called `@makec`. `@make` is boilerplate code that sets up certain environment variables, while `@makec` actually builds the project and is allowed to refer to the environment variables. Controlling the values of the environment variables makes it possible to use the sub-project as a subordinate project while allowing the sub-project to be built on its own as a main project. It's like using a software tool as a single executable that can be found by searching `$PATH`, in the way that `bash` does, except that projects build this way do not need to consist of single executables - the sub-project can invoke code written in multiple languages. In essence, the operating system (e.g. Linux, MacOS) becomes the "programming language" for development of code. Operating systems know how to load and run different languages and `bash` allows composing solutions using combinations of programming languages, making it possible to use the programming languages as laser-focused "notations" for any paradigm needed for creating the final program.

Traditional program development workflow typically consists of choosing _one_ programming language and sticking with it to express and program the complete program. This method, flips that workflow over and makes it possible to build programs using multiple programming languages without needing to produce a single, stand-alone executable for the resulting tool/program.

# Docker
This technique accomplishes much of what Docker does (although you have to manually install certain languages and tools), but this technique is lighter weight. It uses environment variables and environment variable inheritance instead of relying on the operating system to create isolated containers replete with whole operating systems and new syntaxes for building and releasing containers.

I think that Docker is heavy-weight and requires too much up-front understanding before I can get anything running. 

I think that Docker requires lots of resources and background knowledge. I think that we should be able to build multi-language tools and apps without suffering a huge learning curve for the supporting the infrastructure and just getting the infrastructure to work.

The main problem with using stock Linux `bash` scripting is the idea that `$PATH` and `./local/bin` are essentially flat, infinitely huge, non-hierarchical / non-structured, melting pots of all tools.

We tend to use `bash` scripts in a way reminiscent of the `global variable` problem. The solution to the global variable problem is to explicitly pass all parameters into each routine.

Likewise, the "solution" to the dependency injection issue is to not-rely on global locations for flat collections of functions, but to pass in as parameters collections of functions to be used.

Early Lisps solved this problem by using dynamically scoped variables. Common Lisp makes this explicit by allowing variables to be declared "special". The programming community discarded this sort of capability through its over-emphasis on AOT compilation and static checking. Dynamic scoping is harder to fully check in an AOT manner, so it was simply discarded - which caused a plethora of unforeseen issues related to convenient coordination of programs and functions and asynchronous software parts.

Bash already allows dynamic scoping of environment variables. `@make` uses these features to make coordination and multi-language programming easier.

We've been forging ahead with what we were given in the 20th century, instead of stepping back and coming up with different ways to do things.

We don't need to solve 100% of the problem, just enough, say 80%, to make it _much_ more convenient to use.

# `@make`

At present, the best I can do is to tinker with `bash` scripts and environment variables. It is expected that this technique will be extended to allow multi-language development in other ways.

The goal is to produce a project that lives in its own directory and can be called by other projects as a component. Traditionally, we expect a component to be a single, stand-alone executable that is loaded by the operating system, while, here we treat the component as a self-contained, isolated set of code that is invoked by the operating system, but not necessarily as a stand-alone binary executable.
## Top Level Build
`@make` called with zero command line parameters is a top level build. It builds the project "in situ".  Via `@makec`, it can use any combination of compilers and languages and the result(s) remains in the project's directory.

## Sub-project
`@make` called with 3 command line parameters, though, constitutes a use of the project as a sub-component. The project executes, but, places results into the caller's project directory.

The 3 parameters are
- $1 is the callee's working dir
- $2 is the basename (less path and suffix) of the caller's file to be processed
- $3 is the caller's working dir.

These details need to be known to build a project while leaving the results in the caller's project directory.

The custom build step `@makec` can refer to the following environment variables
- `${PBPWD}` - the callee's working directory
- `${PBP}` - the path to the PBP tools (essentially like `./local/bin`)
- `${PBPCALLER}` - the caller's working directory
- `${PYTHONPATH}` - a pathname used by the Python compiler

Can we do this with what we've already got? Here's what I've got thus far. It may not be the ultimate solution, but is usable and might inspire better combinations. I'm using `bash` but this can be rewritten in `Python`. Bash's syntax is more concise than Python's for this kind of thing, so I'm using `bash` for now. I know that I can get an LLM to convert my bash scripts into Python when the time comes.

To make a  project, I invoke 
```
@make
```

To make a second  project and use the first project as a sub-project - a development tool - I invoke
```
@make <path to sub-project's directory> <path to stock tools> $(pwd)
```

Usually, I copy a bunch of useful tools into a sub-directory `./pbp`, so the 2nd arg is simply `./pbp`. I could leave the tools in one place and give a path to that, but, for now I make a copy of the tools that my project relies on - keeping a local copy fights the "version hell" problem. Traditionally, shared code is huge and, therefore, cannot be inexpensively copied and must be shared by accessing it from github or other repositories. This no-copy method works, but, leads to "version hell", where updates to the shared code break assumptions made in a project. Copying is not a problem when the shared code is not very big or, as in 21st century computers, we have ample storage. Again, avoidance of copying code was the preferred route in the stone age (20th century) due to limited storage and due to concerns for DRY (Don't Repeat Yourself). We do need to address the issue of updates and bug-fixing to imported code, but our 20th century techniques are, thus far, insufficient for this task. For example, we should not be using any imported code that is not already "perfect" - after 50 years, type checking has not reached the point where "perfect" code can easily be produced, so we have adopted the mindset that all imported code is imperfect and will need to be eventually updated, and, unlike most other industries (e.g. automotive, electronics), we expect that each software product must evolve over time instead of being released as new, different products.

@ `@make`
```
#!/bin/bash

set -e
export SHELLOPTS
shopt -s nullglob

# During development of pbp-dev, I export PBP_ROOT and want to make a fresh copy of it every time
# skip this step if PBP_ROOT is not set
# DO NOT define PBP_ROOT under normal circustances (this is a kludge used during pbp-dev development only)
if [ -d "${PBP_ROOT}" ]; then
    echo "refreshing ./pbp"
    "${PBP_ROOT}/import-minimal.bash"
fi

# set up env vars depending on whether this script was called from elsewhere or is the top level
if [ "$#" -eq 0 ]; then
    # no arguments - top level build
    # current working directory
    export PBPWD=$(pwd)
    export PBP="$(pwd)/pbp"
    export PYTHONPATH="${PBP}/kernel:${PYTHONPATH}"
    export PBPCALLER=$PBPWD
    fname="example"
    ${PBP}/resetlog

elif [ "$#" -eq 3 ]; then
    # exactly three arguments
    # $1 is callee's working dir
    # $2 is basename of the caller's file to be processed
    # $3 is caller's working dir
    # push a new value of PBPWD onto the stack, which will get unwound to its previous value when this script ends
    export PBPWD=$1
    fname="$2"
    export PBPCALLER="$3"
else
    # error: usage
    echo "Usage: $0 [diagram callerWDIR]" >&2
    exit 1
fi

export SELF="${RANDOM}$$"

rm -f ${SELF}*
rm -f *.mr
rm -f *.json
rm -f temp.*
cd "${PBPWD}"

export PATH="${PBP}:${PATH}"

./@makec ${fname}



## move results to caller's working directory, if no errors
if [ -f out.✗ ]
then
    echo
    echo ">> ERROR <<"
    cat out.✗
else
    rm -f temp.*
fi
```

# Example `@makec`
This is just an example custom script. You will need to write a custom script specific to each project.


```
#!/bin/bash
set -o pipefail
test=strexpander
cat ${test}.grid | ${PBP}/t2t strexpander | ${PBP}/t2t pythonize
rm -f temp.*
```

The "interesting" bits in this code are
- `set -o pipefail` 
	- tells `bash` to kill the pipeline if any stage fails. This assumes, of course, the you are using pipelines in your custom script. Every custom script inherits `set -e` from `@make`. This kills the script if any error is encountered. Killing, further, on pipe failure depends on how you wish to debug your project.
- `${PBP}/t2t strexpander`
	- This script uses a tool called `t2t` found in the `${PBP}` directory. `${PBP}` automatically is set up by `@make`
- `rm -f temp.*`
	- `t2t` (currently) creates various temporary files, each prefixed by `temp.`. It is not necessary to leave these temporary files after running `@make` (which invokes `@makec`), hence we just delete them (`rm` deletes files). Aside: `@make` sets up `shopt -s nullglob` which allows `rm` to work as written, and, this option is inherited by `@makec`.

# Provided Tools

As of this writing, the tools available in the `${PBP}` directory are
- `brace_indent`
- `brace_indent_del`
- `check-for-errors`
- `das2json`
- `debug-vars`
- `del_blank_lines`
- `indent`
- `resetlog`
- `rigid_indent`
- `runpbp`
- `splitoutputs`
- `t2t`

These are small tools mostly meant for t2t (text-to-text) transmogrification of code. They are documented elsewhere.

# Python vs. Bash
These scripts are currently written using the bash scripting language, since the author is  familiar with that syntax. For the purposes needed here, bash syntax is more concise than that of Python - creating environment variables, running sub-processes, checking for existing files, creating files, etc.

I've used an LLM to convert these scripts into Python without problem. The result is less readable and harder to tinker with, but might be more familiar to others if they are not comfortable with writing bash scripts.
