I want to document how to use and develop further the tools in pbp-dev. I've attached a zip of the whole directory and sub-directory structure containing code.

Let's begin with a brief, 1-paragraph overview, including a brief overview of each tool subdirectory.

Most importantly, we want to describe how to build each tool. Is that a "usage" section for each tool? I think that each tool has a Makefile. Correct? Is usage just as simple as running 'make'?

This is a set of tools meant for writing code that writes code. The goal is to target simplicity for *software development*. The hope is that a simpler development workflow, should result in a plethora of simpler, more flexible, more innovative tools for direct use and for non-programmers.

The stance, here, is that the term "efficiency" means something quite different when applied to production code vs. applied to software development. From a software development perspective, "efficiency" is more about development turn-around time, allowing freedom to explore design spaces, etc. If the tool works "fast enough" to save development time, then it is fast enough and doesn't need to be further optimized, nor suffer from the drawbacks of using programming languages aimed only at creating production quality code, e.g. by having to over-specify types to appease certain type checkers, to couch all problems in the functional paradigm, etc.

The main tool is the kernel that supports Part Based Programming. By snipping hidden dependencies due to over-use of function calls (functions cause blocking that is generally solved by requiring the use of a preemptive operating system), PBP allows programmers to create stand-alone software parts. This allows systems to be architected in a layered manner, instead of a sprawling manner. This allows programmers to build-and-forget. Once a part has been bench-tested and debugged, programmers can forget about its inner details, freeing their minds to focus on other issues, like exploring a given problem space more thoroughly.

The `das/das2json.mjs` tool converts drawio diagrams to json which  represent "graphs" that describe Container parts and can be used for PBP programming.


sub-directories
- kernel
- tas - t2t
- das
- dtree
