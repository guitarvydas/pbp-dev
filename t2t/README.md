t2t - Text to Text transpiler

T2T creates DSLs.

T2T reduces the amount of work required to build a DSL. You should be able to create a new DSL in an afternoon.

You only need to create a grammar and a corresponding rewrite specification. You use t2t to translate the new DSL syntax into code for any existing programming language (like Python, Haskell, etc), then run the generated code.

This means that you write a lot less code and let the computer do the rest of the coding work for you.

The grammar is written in OhmJS format and the rewrite specification is described in `doc/rwr/RWR Spec.pdf`.

T2t transpiles a source program into another program. T2t uses a grammar and a rewrite specification (files) to guide it. 

![overview](./doc/sketches-t2t%20overview.drawio.png)


See `./doc/T2T.pdf` for more.
