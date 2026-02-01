The general idea is that it should be possible to make little sketches of parts of one's program and then transmogrify the sketches automatically to generate code suitable for inclusion in the program / project.

The sketches don't attempt to describe the whole program / project. Instead, they can be used to generate snippets of code for inclusion in the program / project. 

The idea is to a hybrid of notations for programming. Some parts of the program are better expressed as textual code done in the usual manner. Some parts, though, are better expressed as diagrams.

In this example, we create a minimal decision tree diagram syntax and use it to generate code that would be harder to comprehend when written in textual form.

The minimal syntax is trivial. It contains
- decision nodes (drawio "rhombus" figures)
- action nodes (drawio "process" figures)
- arrows that connect nodes
- decision nodes can only have two outward connections "yes" and "no"
- the text inside nodes is generally untouched - it is just code in the target programming language. The tool weeds out newlines and `<div>`, `</div>`, `<span ....>`, `</span>`.  Drawio sometimes inserts divs and spans into the text contained in its figures. All of these things are turned into empty strings, which means that one can use spaces and newlines on the diagrams to aid readabilty, where the spaces and newlines (and divs and spans) are deleted to result in legal code for the target language. For example a node might contain "this is a function (a, b, c)" which is output as "thisisafunction(a, b, c)"

We use drawio to draw the sketches