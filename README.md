This is the working repository for PBP (Parts Based Programming) tools.

The main tools are the subdirectories
- kernel
- das
- t2t
- dtree

where 
- _das_ means *diagrams as syntax*
- _t2t_ means _text to text_ transmogrification ("transpiling", "compiling", "macros")
- _kernel_ is the implementation of an asynchronous-message-passing kernel between Parts (Leaf and Container)
- *dtree* transmogrifies a simple kind of diagram (a "decision tree" with only 2 kinds of nodes and only 2 kinds of branches) to meta code (which has a syntax very reminiscent to that of Python). 

# Usage
If you just intend to *use* the tools (recommended for first exposure), see the [pbp-kit](https://github.com/guitarvydas/pbp-kit) repository instead.

This repository is meant to house *all* of the code needed to maintain the `pbp-kit` tools. You don't need most of this stuff if you only want to create new PBP projects.

See the `Makefiles` and `README.md`s in each individual sub-directory here to alter any of the tools.

To update `pbp-kit` with changes made here, use the `updall.bash` script.

Many of these tools use code generators to create tool code. Code generation is a two-step process. The first step is to generate code for the tool(s), which is similar to using compilers. In most cases, however, one only wants to use compilers to compile code. The second step is to use the tools in a new project. Only the second step is necessary for new pbp-kit projects. Changes to the tools herein require the first step and necessitate an update to the pbp-kit repository.
## Kernel
A blob of code that implements asynchronous message-passing using two types of parts:

* Container parts: a way to recursively bundle parts and treat programming in a LEGO block manner.
* Leaf parts: code in the traditional sense, asynchronous.

The kernel code is written in a meta language (.rt) and the compiler is implemented as drawware (see kernel.drawio).

The original kernel was implemented in Odin by Zac Nowicki. Over time, it was moved to Python, then to .rt.

The kernel compiler generates kernels in three different languages—Python, JavaScript and Common Lisp. It is likely that it could be easily modified to generate code for other languages.
## DaS
Contains a program, das2json.mjs, that converts .drawio files to JSON while removing the majority of redundant graphics rendering information.

Originally written by Zac Nowicki as an Odin program that utilized an off-the-shelf XML parsing library, the current version is written in Node.js. Working versions of das2jon have been written in t2t, but are not yet included here.
## T2T
This subdirectory contains a text-to-text transmogrification program.  

The front end uses OhmJS to parse input grammars.

The back end uses a simple DSL (I refer to it as an SCN[^scn]) RWR that contains rules for rewriting parses of the input. Documentation for RWR can be found in [RWR Spec](RWR%20Spec.pdf). Under the hood, t2t runs OhmJS twice and combines the results using files in `t2t/lib`.

The `pbp/t2t.bash` script[^scr] performs the necessary work to run a transmogrification. The script requires six arguments:

1. The current working directory (typically `.`)
2. The path to the pbp toolset (typically `./pbp`)
3. The name of a grammar file
4. The name of a rewrite rule file
5. The name of a node.js file containing support functions (typically empty, sometimes containing one or two short JavaScript functions, each of which is a few lines long (examples  can be found in the `pbp/examples` subdirectories)
6. The name of an input source file to be transmogrified (or - to signify stdin)

[^scn]: SCN ≡ Solution Centric Notation.
[^scr]: This script is used in many drawware components in the toolset. You can find these by looking at drawings that have the string `:$ ./t2t.bash ...` in them.

---

## TaS (WIP)
The _tas_ (text as syntax, i.e. the traditional form of programming languages) subdirectory contains some experimental code for building a Programming Language Workbench (PLWB) using a choreographer process plus some other windows and processes. WIP.

The experiment is that of building REPLs for DPLs (_Diagrammatic Programming Languages_) using processes and windows instead of hard-wiring the REPLs into the programming languages themselves. The advantage is that we just use off-the-shelf tools, like the drawio editor or emacs or whatever, without needing to add features to them.

The "enabling technology" is that our machines are orders of magnitude faster than they were in the early days when we settled on the idea of using and implementing programming languages. On today's stock development computers, we can afford to spin up processes and windows in a way that was unimaginable a few decades ago.

## dtree

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


![API](./api.md)

## Philosophy Corner
Computers are not merely “better paper,” yet we continue to program them using notations intended for use on paper, a practice that dates back to the 1960s.

A significant advancement in programming language (PL) design occurred in the early 1970s with the invention of UNIX pipes[^p], but this innovation was largely ignored and conflated with the concept of “operating systems” rather than “programming languages.”

Traditional PLs enabled the creation of single-threaded programs using syntaxes that were considered superior to assembler and machine code. Additionally, linters[^tc] were integrated directly into PLs rather than being developed as separate tools.

We were able to use such sequential, synchronous PLs for decades because we could not afford to build computers with numerous small CPUs. Today, we can afford to do so (with devices like Arduinos, ESP32 and Raspberry Pis), yet we continue to operate with a single-threaded mindset due to inertia. This is evident in our perception of “concurrency” as a complex and challenging issue[^c].

Single-threaded languages handled multi-threading by adopting time-sharing concepts and implicitly the concept of shared memory for multiple threading. This led to various workarounds to manage the inadvertently created complexity of “thread safety,” which would not have been an issue if computers had been built with multiple CPUs connected by thin wires.

Today, we have computer networks composed of countless CPUs, computers and nodes connected by thin wires. However, we allow momentum to dictate our approach by using programming languages originally designed for single-threaded thinking and workarounds such as time-sharing. IoT, robotics, the internet, NPCs in gaming, and more abound, yet we attempt to force them into calculator or clockwork designs.

PBP emerged from 0D (zero dependency, i.e., asynchronous message passing) and represents a baby step towards defining new-breed PDEs[^pde] for the 21st century.

Surprisingly, existing tools for parsing one-dimensional textual languages are quite capable of parsing two-dimensional diagrammatic languages (and, likely, visual programming languages as well). Modern diagram editors such as Drawio, Excalidraw, yEd, and others compress two-dimensional diagrams into one-dimensional textual form (e.g., XML or GraphML). These textual formats are considered unreadable by humans but are highly readable by machines and existing parsing technologies. PEG, particularly OhmJS, simplifies the automated construction of parsers significantly compared to older CFG-based techniques. Consequently, we do not need to develop graphical editors for diagrammatic or visual programming languages. We can begin by utilizing existing tools. This is precisely the purpose of `das2json`.

Older techniques from compiler research, such as Fraser/Davidson peepholing, Cordy’s Orthogonal Code Generator, backtracking, and staged computation, can be revived and applied to more modern problem domains.

Concepts based on biases towards premature optimization can be reconsidered. For instance, the very concept of user-defined “data structures” is merely an optimization for the fact that we would have preferred ubiquitous pattern-matchers that could destructure data on an as-needed basis. We simply lacked the resources to implement such a system in the 1970s. Perhaps we can now?

Early compilers operated in a staged manner, streaming input and transpiling one form of text (HLL syntax) into another (assembler syntax). Examples of such compilers include PT Pascal and its derivatives such as Concurrent Euclid, Turing, and others. 

Furthermore, in the early days, it was generally considered laughable to work with variable-length strings. However, today, we are aware of (decent) garbage collection and simple concepts such as string interpolation[^t]. The `t2t` tool facilitates the parsing and rewriting of strings[^po].

As far as I can determine, there are only a few key considerations. We can implement these ideas using modern programming languages and begin using them immediately without waiting for new languages.

- Pure Message-Passing and Asynchronous Execution:
  - Functions are inherently synchronous, which is the opposite of asynchronous.
  - Use queues instead of stacks.

- Ports:
  - Ports should be well-defined input and output points on each part.
  - Similar to kindergarten, avoid crossing boundaries between parts (software units) except at well-defined ports.
  - If you need to manage “global variables” or “captured, closed-over variables,” consider using a notation that provides true isolation between software units while maintaining synchronous operation of their internals. This approach should be less bloated than what “operating systems” have become.

- Recursive Nesting and Bundling:
  - This concept is implemented in `Forth` and `/bin/*sh`.
    - `Forth` uses double-indirection, while `/bin/*sh` uses Greenspunian double-indirection involving forks.
  - In pure message-passing[^mp], there is implicitly the concept of moving data from one place to another. A simple pair `{sender, receiver}` can describe such a connection. To implement nesting, extend this to a triple `{direction, sender, receiver}`, where direction can be `[down|across|up|through]`. Down and up can be implemented by having Container Parts punt messages to/from inner Parts.

[^p]: UNIX drew inspiration from earlier systems, but it made the concept of pipes accessible to a broader audience.
[^tc]: Type checkers are synonymous with linter tools. Rather than creating separate tools, we permitted the needs of type-checking linters to influence the syntax of our programming languages with type annotations and numerous restrictions that facilitated linting at the expense of making programming more difficult. Ironically, a language for linting, Prolog, was developed early on but was largely ignored by compiler writers who opted to manually implement type checking into compiler implementations.
[^c]: Concurrency is ubiquitous. Humanity has developed numerous protocols for managing concurrent events, such as shaking hands and adhering to meeting schedules. I even taught my five-year-olds how to handle challenging real-time situations, such as piano lessons and sheet music.
[^pde]: Program Development Environment, formerly known as IDEs, comprises programming languages, operating systems, text editors and other software.
[^t]:. It would be worthwhile to revisit TCL, SNOBOL and Icon.
[^po]: The concept of simply transforming strings into other strings without the need for all the other complex features we have so diligently developed appears preposterous at first glance. However, this is merely an example of “premature optimization” thinking. I have been using t2t for several years to create new languages (such as for the kernel itself) and have not found it necessary to complicate matters further.
[^mp]: Pure message passing is akin to transmitting data through a tube. In contrast, impure forms of message passing involve calling methods and blocking while awaiting a returned answer. This blocking implicitly transfers control flow, in addition to passing the data.
