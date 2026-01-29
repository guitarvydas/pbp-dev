# dtree

GOAL: compile the following diagram to executable code

![decision tree for xinterpret()](./status/xinterpret-dtree.drawio.png)

For example
`diagram -> JSON -> Python`

# Status
`progress.drawio` contains sketches of progress to date


`diagram -> JSON` appears to work

(aside: this took little effort, the intial check in was only several hours ago)

## Usage
use `make` then look at `xinterpret.json`

The idea is to strip out all of the graphics-only noise and write only the semantically interesting stuff to JSON (major reduction of the information)

The `diagram -> JSON` step is done by
1. draw drawing using draw.io, using only Rhombuses and Processes and labelled edges, as seen in `xinterpret.drawio`
2. use T2T (OhmJS + RWR) to transmogrify to `xinterpret.json` [RWR is a tiny DSL used in conjuction with OhmJS to rewrite strings (more powerful than it sounds)]

# Pond'ring

I think that I want to generate `diagram -> JSON -> I.R. -> Python`

I think that I want to generate an I.R. (Intermediate Representation) file that looks like:

```
[ found?
  | yes:
    [compiling?
      | yes:
	    [immediate?
		  | yes: #compile(word)
		  | no: #exec(word)
	  | no: #exec(word)
	]
  | no:
    [ compiling?
	  | yes:
        [int?
		  | yes: #compileInteger(word)
		  | no:
            [ float?
              | yes: #compileFloat(word)
			  | no: #error(word)
			]
	    ]
	  | no:
        [int?
		  | yes: #pushInt(word)
		  | no:
            [ float?
              | yes: #pushFloat(word)
			  | no: #error(word)
			]
	    ]
  ]
]
  
```

I know that I can write a simple T2T transmogrifier that converts this to xxx (for now xxx==meta-Python) code. The generated code can be pasted into a program, or,,, we could use UNIX utilities to automatically batch process the pasting operation.

I think that I might use the SWIPL language to inhale and process `xinterpret.json`. Question to self: does the SWIPL program produce the I.R. or just produce something the can be transmogrified into the I.R.?

Aside: the above I.R. needs to be modified to make it more realistic... e.g. `compiling?` can be converted to `%inCompilationState` and `#compileInteger(word)` can be converted to 
```
%push (%toint (word))
@literalize
```

This proposed I.R. syntax could be done with markdown,,, but, I've found that a bracketed, recursive syntax is easier to parse using existing tools (I like OhmJS). Indented syntaxes are parse-able, but make the work harder than necessary. If you waste brain-power doing make-work, that brain-power isn't available for thinking about more interesting issues.

## Manually Written Code
Below is meta-language code that I wrote manually, wishing that I had a tools that generated this code from the diagram...

```
    if (found) {
        defsynonym xt ≡ item
        if %inCompilationState {
            ⌈ found and compiling ⌉
            if (foundImmediate) {
                ⌈ found and compiling and immediate ⌉
                %funcall exec (xt)
            } else {
                ⌈ found and compiling and not immediate ⌉
                %ram+(xt)
            }
        } else {
            ⌈ found and not compiling ⌉
            %funcall exec (xt)
        }
    } else {
        defsynonym word ≡ item
        ⌈ not found ⌉
        if %inCompilationState {
            ⌈ not found and compiling ⌉
            if (%isInteger (word)) {
                %push (%toint (word))
                @literalize
            } elif (%isFloat (word)) {
                %push (%tofloat (word))
                @literalize
            } else {
                %funcall notfound (word)
                return False
            }
        } else {
            ⌈ not found and not compiling ⌉
            if (%isInteger (word)) {
                %push (%toint (word))
            } elif (%isFloat (word)) {
                %push (%tofloat (word))
            } else {
                %funcall notfound (word)
                return False
            }
        }
    }
```

This suggests that the diagram needs to be tweaked and tightened up, and, likewise, the I.R. needs to reflect the various changes.

Question to self: is this an appropriate approach? A: Choosing parse-able text as the narrow waist is probably a "good" idea - it will scale well, even if it makes implementation temporarily a bit more clunky.

So, next steps:
1. rewrite the intermediate code and write a transmogrifier for it `I.R. -> .grish`
2. Think about how to transmogrify the JSON file above into I.R. code
3. tweak the diagram to suit step 1.
