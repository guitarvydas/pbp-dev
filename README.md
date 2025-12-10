This is the working repository for PBP (Parts Based Programming) tools.

The main tools are the subdirectories
- kernel
- das
- t2t

where 
- _das_ means *diagrams as syntax*
- _t2t_ means _text to text_ transmogrification ("transpiling", "compiling", "macros")
- _kernel_ is the implementation of an asynchronous-message-passing kernel between Parts (Leaf and Container)

If you just intend to use the tools (recommended for first exposure), skip down to the `# Using the Tools for Programming Projects` section.

## Philosophy Corner
Computers are not just "better paper", yet, we continue to program them using notations intended for use on paper, just like we did in the stone age (1960s).

A major advance in PL (Programming Language) design occurred in the early 1970s with the invention of UNIX pipes[^p] but was roundly ignored and conflated with the concept of "operating systems" instead of "programming languages".

Traditional PLs allowed us to create single-threaded programs using syntaxes that were deemed to be better than assembler and machine code. We, also, wound *linters*[^tc] directly into PLs instead of making them into separate tools.

We got away with such sequential, synchronous PLs for decades because we couldn't afford to build computers with zillions of little CPUs in them. Today, we can afford to do that (with Arduinos, ESP32, Raspberry PIs, etc.) but we continue to use single-threaded thinking due to our own momentum. You can see that we've stepped outside of the sweet spot of old PL designs by noticing that we think that "concurrency" is some kind of difficult, mystical issue[^c].

A Bugs Bunny moment ("I shoulda turned left at Albuquerque") happened without notice. Single-threaded languages handled multi-threading by adopting time-sharing concepts and, implicitly adopting the concept of shared memory for multiple threading. This lead to all sorts of hand-wringing, in the form of workarounds to handle the accidentally created complexity of "thread safety", which wouldn't even have been an issue if computers had been built with multiple CPUs with thin wires between them.

Today, we have computer networks composed of zillions of CPUs/computers/nodes with thin wires between them,,, but, we let momentum rule the day by using PLs originally designed, scribbled on cave walls, for single-threaded thinking and workarounds like time-sharing. IoT, robotics, internet, NPCs in gaming, etc. abound, but we try to force them all into calculator / clockwork designs.

PBP emerged from 0D (zero dependency, i.e. async message passing) to form a baby-step towards defining new-breed PDEs[^pde] for the 21st century.

Almost bizarrely, existing tools for parsing 1D textual languages are quite capable of parsing 2D diagrammatic languages (and, probably, visual programming languages, too). Modern diagram editors like drawio, Excalidraw, yEd, etc. crush 2D diagrams down into 1D textual form (e.g. XML, graphML). Such textual formats are considered to be unreadable by humans but are supremely readable by machines and existing parsing technologies. PEG, esp. OhmJS, makes automated building of parsers much easier than older CFG based techniques. We don't need to build graphical editors for diagrammatic nor visual programming languages. We can start by using what we've got. That's what `das2json` is for. Older techniques from compiler research, such as Fraser/Davidson peepholing and Cordy's Orthogonal Code Generator and backtracking and staged computation can be brought back to life and applied to more modern problem domains. 

Old ideas based on biases towards premature optimization can be re-thought. For example, the very concept of user-defined "data structures" is just an optimization for the fact that we would have preferred to have ubiquitous pattern-matchers that worked on-the-fly to destructure blobs of data on an as-needed basis. We simply couldn't afford to do that in the 1970s. Maybe we can now?

Early compilers used to work in a staged manner - pattern matching streaming input and transpiling one form of text (HLL syntax) into another form of syntax (assembler). Examples of such compilers are PT Pascal and its derivates like Concurrent Euclid, Turing, etc. 

Furthermore, in the early days, it was generally considered laughable to work with variable-length strings, but, today, we know about (decent) garbage collection and simple ideas like string interpolation[^t]. The *t2t* tool makes it easy to parse strings and to rewrite strings into other strings[^po].

As far as I can tell, there are only a couple of things that we need to do. We can use modern programming languages to implement these ideas and we can begin using them immediately without needing to wait for better, new languages:
- pure message-passing, real async
	- functions are - by definition - _synchronous_, which happens to be the opposite of _asynchronous_
	- queues, not stacks
- ports - well-defined input _and_ output points on each Part
	- my kindergarten teacher taught me not to colour outside of the lines, which translates in DPLs to not letting arrows cross the boundaries of Parts (software units) except at well-defined ports
	- if you have to worry about "global variables" or "captured, closed-over variables", maybe you're pushing your notation out of its sweet spot? Maybe you need to be using a notation that provides true isolation between software units along with synchronous operation of the internals of software units, that is less bloatful than what "operating systems" have become?
	- we with that we could compose programs using Software LEGO Parts, but, instead we have to create tightly coupled meshes of software gears using ultra-type-checked APIs and function signatures
	- to "send" data from one Part to another, the system doesn't need to know what the data looks like, other than that it's a blob of data delivered to/from a port, only the sender and receiver need to agree on what's inside
- recursive nesting and bundling
	- `Forth` does this, `/bin/*sh` does this
		- `Forth` via double-indirection, `/bin/*sh` by Greenspunian kinds of double-indirection involving `fork`s
	- in pure message-passing[^mp] there is - implicitly, at least - the underlying concept of moving data from one place to another. The knee-jerk way to describe such a connection is with a simple pair `{sender, receiver}`. To implement nesting, though, just make that a triple instead, e.g. `{direction, sender, receiver}` where direction is `[down|across|up|through]`. `Down` and `Up` are ways to implement nesting by having Container Parts punt messages to/from inner Parts.

[^p]: UNIX might have borrowed ideas from earlier systems, but it made the concept of pipes available to a wider audience.
[^tc]: Type checkers ≡ linter tools. Instead of making type checkers into separate tools, we allowed the needs of type-checking linters to pollute the syntax of our programming languages with type annotations and heaps of restrictions that made the job of linting easier at the expense of making programming harder. Ironically, a language for linting - Prolog - was invented early on, but was roundly ignored by compiler writers who chose to Greenspun type checking manually into compiler implementations.
[^c]: Concurrency is all around us. Humanity has developed multiple protocols for handling concurrent events (like shaking hands, starting meetings on time, etc.). I even taught my 5 year olds how to deal with hard real-time issues (aka "piano lessons" and sheet music).
[^pde]: Program Development Environment, formerly known as IDEs consisting of Programming Languages and Operating Systems and text editors and other forms of bloatware.
[^t]:. I wonder if TCL and SNOBOL and Icon should be re-visited?
[^po]: The idea of simply transmogrifying strings into other strings and not bothering with all of the other doo-dads that we've so laboriously invented, sounds preposterous on the surface. But, that's only "premature optimization" style thinking. I've been using t2t for several years to build new languages (like for the kernel itself) and haven't found it necessary to make things more complicated.
[^mp]: Pure message passing is like rolling a ball of data through a tube, while impure forms of message passing involve: calling methods and blocking while waiting for a returned answer (that *wait* is an implicit transfer of control flow, in addition to passing the data)
## Kernel
A blob of code that implements async message-passing using two kinds of Parts:
- Container Parts
	- a way to recursively bundle Parts and for treating programming in a LEGO block manner
- Leaf Parts
	- code in the traditional sense, `async`
- The kernel code is written in an meta language (`.rt`) and the compiler is implemented as drawware (look at `kernel.drawio`)
- The original kernel was implemented in `Odin` by Zac Nowicki. Over time, it moved to Python, then to `.rt`. 
- The kernel compiler generates kernels in 3 different languages - Python, Javascript, Common Lisp. It can probably be easily hacked to generate code for other languages.
## DaS
Contains a program - `das2json.mjs` - that converts `.drawio` files to JSON while stripping out the bulk of redundant, graphics rendering information.

Originally this was written by Zac Nowicki as an Odin program that used an off-the-shelf XML parsing library. The current version is written in node.js. Working versions of `das2jon` have been written in `t2t` but are somewhere else on my disk and are not included in this subdirectory at the moment.
## T2T
This subdirectory contains a text to text transmogrification program.

The front end uses `OhmJS` to parse input grammars.

The back end uses a simple DSL (I call that an SCN[^scn]) `RWR` that contains rules for rewriting parses of the input. Documentation for `RWR` can be found in [RWR Spec](RWR%20Spec.pdf). Under the hood, `t2t` runs OhmJS twice and bolts everything together using files in `t2t/lib`.

The `pbp/t2t.bash` script[^scr] does the necessary work to run a transmogrification. The script needs 6 arguments:
1. current working directory (typically `.`)
2. a path to the pbp toolset (typically `./pbp`)
3. the name of a grammar file
4. the name of a rewrite rule file
5. the name of a node.js file containing support functions (typically empty, sometimes containing 1 or two JS functions that are only a few lines long, each (search for examples in the `pbp/examples` subdirectories))
6. the name of an input source file to be transmogrified (or `-` to signify `stdin`)

[^scn]: SCN ≡ Solution Centric Notation.
[^scr]: This script is used in many drawware components in the toolset. You can find these by looking at drawings that have the string `:$ ./t2t.bash ...` in them.
## TaS (WIP)
The _tas_ (text as syntax, i.e. the traditional form of programming languages) subdirectory contains some experimental code for building a Programming Language Workbench (PLWB) using a choreographer process plus some other windows and processes. WIP.

The experiment is that of building REPLs for DPLs (_Diagrammatic Programming Languages_) using processes and windows instead of hard-wiring the REPLs into the programming languages themselves. The advantage is that we just use off-the-shelf tools, like the drawio editor or emacs or whatever, without needing to add features to them.

The "enabling technology" is that our machines are orders of magnitude faster than they were in the early days when we settled on the idea of using and implementing programming languages. On today's stock development computers, we can afford to spin up processes and windows in a way that was unimaginable a few decades ago.

# Using the Tools for Programming Projects
the `${PBP_ROOT}/import_minimal.bash` script copies the bare minimum of files from the project development repository at ${PBP_ROOT}

1. `clone https://github.com/guitarvydas/pbp-dev ./pbp`
2. `export set PBP_ROOT=<... your path ...>`
3. `${PBP_ROOT}/import_minimal.bash` 

... or ... 

just copy, recursively, the pbp toolset from another project into your new project 

Then run 
```
./pbp/init.bash
```
which will copy a few files up from `./pbp/*` into the current project (files: `PBP.xml`, `package.json`) and make them available to drawio and node.
## Create a DPL Program and Transmogrify It To Python
1. use [drawio]([https://www.drawio.com)) to draw a program 
	- see the ??? video or the `./examples/*` subdirectory, if you haven't done this before
	- the drawio editor should pick up `PBP.xml` from your project directory, which gives you a small palette of Parts that can be used for drawing PBP programs (drawio starts up with the PBP palette closed, you'll have to open it)
	- I find it to be more convenient to download a local copy of drawio rather than using the web version
2. create a [Makefile](./doc/how-create-Makefile.md)
3. create [main.py](./doc/how-to-create-main-dot-py.md)
4. 