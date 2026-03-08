# `@make` — Multi-Language Project Build System

> **How to read this document:** Start with _Quick Start_ and _Basic Usage_. The rest is here when you need it.

---

## Quick Start

`@make` lets you build a project using **any combination of programming languages** — Python, Prolog, JavaScript, Bash, or anything else — without needing to produce a single stand-alone executable, and without `#ifdef`s, FFIs, or Docker.

Each project lives in its own directory. Projects can call other projects as sub-components. The operating system handles isolation; `@make` handles coordination.

**What you need to get started:**

1. A project directory
2. A copy of the `@make` script in that directory (or on your `$PATH`)
3. A custom `@makec` script you write for your project

That's it.

---

## Basic Usage

### Building a project

From inside your project directory:

```bash
@make
```

This runs your project's custom build script (`@makec`) with environment variables already set up for you.

### Using a project as a sub-component of another project

From inside the _calling_ project's directory:

```bash
@make <path/to/sub-project> <basename-of-file-to-process> $(pwd)
```

Example:

```bash
@make ./dtree mydiagram $(pwd)
```

The sub-project runs, reads what it needs, and deposits its output **in your directory** — not its own. You don't need to know what languages the sub-project uses internally.

### Keeping local copies of sub-projects

It's recommended to copy sub-projects you depend on into a `./pbp` subdirectory of your project. This avoids "version hell" — updates to shared code won't silently break your project.

```
my-project/
  @make
  @makec
  pbp/          ← copies of sub-projects and tools this project depends on
  *.py, *.js, ... ← your source files
```

When calling a sub-project stored in `./pbp`:

```bash
@make ./pbp/dtree mydiagram $(pwd)
```

---

## Writing `@makec`

`@makec` is the custom build script you write for each project. It's a Bash script that describes the actual build steps.

### Minimal example

```bash
#!/bin/bash
set -o pipefail

cat myfile.grid | ${PBP}/t2t strexpander | ${PBP}/t2t pythonize
```

### What you get for free

`@make` sets up these environment variables before calling your `@makec`:

|Variable|Value|
|---|---|
|`${PBPWD}`|The callee's working directory (your project's directory)|
|`${PBP}`|Path to the tools directory (e.g., `./pbp`)|
|`${PBPCALLER}`|The calling project's working directory|
|`${PYTHONPATH}`|Pre-configured to include `${PBP}/kernel`|

Your `@makec` also inherits `set -e` from `@make`, which stops the build immediately on any error.

### Tips

- Use `set -o pipefail` at the top of `@makec` if you use shell pipelines — this catches failures in the middle of a pipeline, not just at the end.
- Temporary files created during the build can be cleaned up with `rm -f temp.*` at the end of your script.
- You can invoke tools from `${PBP}` directly: `${PBP}/t2t`, `${PBP}/runpbp`, etc.

---

## The `@make` Script (Reference)

```bash
#!/bin/bash

set -e
export SHELLOPTS
shopt -s nullglob

if [ -d "${PBP_ROOT}" ]; then
    echo "refreshing ./pbp"
    "${PBP_ROOT}/import-minimal.bash"
fi

if [ "$#" -eq 0 ]; then
    # Top-level build
    export PBPWD=$(pwd)
    export PBP="$(pwd)/pbp"
    export PYTHONPATH="${PBP}/kernel:${PYTHONPATH}"
    export PBPCALLER=$PBPWD
    fname="example"
    ${PBP}/resetlog

elif [ "$#" -eq 3 ]; then
    # Called as sub-project
    export PBPWD=$1
    fname="$2"
    export PBPCALLER="$3"
else
    echo "Usage: $0 [diagram callerWDIR]" >&2
    exit 1
fi

export SELF="${RANDOM}$$"
rm -f ${SELF}* *.mr *.json temp.*
cd "${PBPWD}"
export PATH="${PBP}:${PATH}"

./@makec ${fname}

if [ -f out.✗ ]; then
    echo; echo ">> ERROR <<"
    cat out.✗
else
    rm -f temp.*
fi
```

---

## Available Tools (`${PBP}`)

These tools ship with the `pbp` toolkit and are available in your `@makec` via `${PBP}/`:

|Tool|Purpose|
|---|---|
|`t2t`|Text-to-text transmogrification (the main workhorse)|
|`runpbp`|Run a PBP-style pipeline|
|`brace_indent`|Indent code by brace structure|
|`brace_indent_del`|Remove brace-based indentation|
|`check-for-errors`|Scan output for error markers|
|`das2json`|Convert DAS format to JSON|
|`debug-vars`|Print environment variables for debugging|
|`del_blank_lines`|Remove blank lines from a stream|
|`indent`|General indentation utility|
|`resetlog`|Clear the build log|
|`rigid_indent`|Fixed-column indentation|
|`splitoutputs`|Split a stream into multiple output files|

Full documentation for each tool is maintained separately.

---

## A Real Example: `frishc` and `dtree`

The `frishc` project is written mostly in meta-Python. One part of its source is a decision-tree diagram. Here's how the build works:

1. `frishc`'s `@makec` calls the `dtree` sub-project, passing it the diagram file.
2. `dtree` transmogrifies the diagram into meta-Python and writes the result into `frishc`'s directory.
3. `frishc`'s `@makec` includes that generated file and continues building.
4. The final output is runnable Python — assembled from diagram source, generated code, and hand-written code.

Neither project needs to know the internal details of the other. `frishc` doesn't know that `dtree` uses a diagram as its own source code, or which languages it uses internally.

---

## Background and Discussion

> This section is for readers who want to understand _why_ `@make` works the way it does.

### The problem with traditional polyglot techniques

Using multiple programming languages in one project traditionally means choosing between:

- **`#ifdef` macros** — these clutter source code and force you to mentally simulate the preprocessor to understand what the code actually does.
- **FFIs (Foreign Function Interfaces)** — these require deep understanding of how different languages represent data structures internally.
- **Shell pipelines** — actually quite good, but underused because of the 20th-century assumption that all programs must ultimately be single stand-alone executables.

`@make` leans into shell pipelines and process isolation. Each language's code lives entirely within its own ecosystem. Communication between parts happens through files and standard input/output — not through shared data structures or calling conventions.

### Why not Docker?

Docker achieves similar isolation, but requires significant up-front investment: learning container syntax, managing images, setting up build and release pipelines. For small, quickie helper tools built during development, that overhead defeats the purpose.

`@make` achieves most of the same benefits using only Bash, environment variables, and the operating system's existing process model — tools you already have.

### Environment variables as dynamic scoping

Bash environment variables are _dynamically scoped_ — a variable set in a parent process is visible to all child processes, but changes made by a child don't propagate back up. `@make` uses this property deliberately: each sub-project inherits the environment it needs, runs, and returns without polluting the caller's environment.

This is similar to "special variables" in Common Lisp, or dynamic binding in early Lisps — a technique that was largely abandoned in favor of static typing, but which turns out to be very useful for coordinating multi-language builds.

### Python vs. Bash

`@make` and `@makec` are written in Bash because Bash is more concise for this kind of work: setting environment variables, running sub-processes, checking for files, piping streams. Python is perfectly capable of doing the same things, just more verbosely.

That said, if you find Bash syntax difficult to read or maintain, these scripts can be rewritten in Python without loss of functionality. An LLM can convert them reliably.

### The bigger picture

Programming languages are notations for thought, not ends in themselves:

- Functional programming is a notation for pure computation.
- Prolog is a notation for relational queries over factbases.
- Statecharts are a notation for control flow.
- Bash is a notation for composing processes.

There's no reason a single project can't use all of them — each for the part of the problem it expresses most clearly. `@make` makes that practical without requiring a large infrastructure investment.

---

## Source Code

- `@make` and related scripts: _[link to repo]_
- `frishc` project: _[link to repo]_
- `dtree` project: _[link to repo]_