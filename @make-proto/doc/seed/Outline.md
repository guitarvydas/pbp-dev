# meta
I want to document `@make` and `@makec` in a way that makes it possible to build multi-language tools without it being necessary to understand the issues. E.g. "do it this way", and "later, if you want to know more..."

The document "Towards Multi-Language Programming" is a collection of information that includes a lot of discussion of issues.

We need to produce a document, or set of documents, that allow instant, light-weight access to the ideas - how to get started - without making the reader wade through a lot of information.

I don't use Docker for similar reasons. See the `Docker` section.

# Usage
- bare minimum required to use these tools
# Discussion of Issues
# Python vs. Bash
- it's easy to write these tools in Python if one considers Python to be more readable than Bash
- scripting languages don't expose "types" to programmers, Python isn't as hard-core as other statically typed languages, but still slows down development turn-around by requiring too much detail before anything can run
- my problem during development was making silly typos
	- maybe a "new bash" could first lint-check scripts before running them, in an attempt to find as many errors AOT (ahead of time) as can be reasonably done without impacting the syntax in the way that statically typed languages do - maybe there's a reasonable compromise possible without going all the way to where the language is distorted in order to appease the type checker
# Why Use @make Instead of Docker
# Source Code for Scripts