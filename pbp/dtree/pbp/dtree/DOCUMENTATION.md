# Decision Tree Transmogrifier: Draw.io to Frish Meta-Code

## Overview

The dtree (decision tree) transmogrifier converts visual decision tree diagrams created in draw.io into executable `.frish` meta-code through a multi-stage pipeline. This allows you to design decision logic visually and automatically generate code from it.

## Pipeline Architecture

The transformation follows this 5-stage pipeline:

```
Draw.io Diagram (.drawio)
    ↓
  [Stage 1: Draw.io XML Parsing]
    ↓
JSON Representation (.json)
    ↓
  [Stage 2: Prolog Processing]
    ↓
Enhanced JSON (with edge labels)
    ↓
  [Stage 3: Decision Tree Extraction]
    ↓
Decision Tree IR (.dt format)
    ↓
  [Stage 4: Code Generation]
    ↓
Frish Meta-Code (.frish)
```

---

## Stage 1: Draw.io XML to JSON

**Input:** Draw.io diagram (XML/GraphML format)  
**Output:** Structured JSON representation  
**Tools:** OhmJS grammar (`dtree.ohm`) + RWR rewrite rules (`dtree.rwr`)

### What Happens

The draw.io diagram uses specific shapes to represent decision tree elements:
- **Rhombus shapes** → Decision nodes (conditions/questions)
- **Process/Rectangle shapes** → Action nodes (leaf nodes)
- **Labeled edges** → "yes" or "no" branches

The parser:
1. Parses the XML structure using the `dtree.ohm` grammar
2. Identifies key elements:
   - `<mxCell>` tags (nodes and edges)
   - `id`, `parent`, `source`, `target` attributes
   - `style` attributes (to identify rhombus vs process shapes)
   - `value` attributes (text labels like "yes", "no", or condition names)
3. Converts to clean JSON using `dtree.rwr` rewrite rules

### Example XML Fragment → JSON

**Draw.io XML:**
```xml
<mxCell id="abc123" value="found?" style="rhombus;" vertex="1" parent="1"/>
<mxCell id="edge1" edge="1" source="abc123" target="xyz789" parent="1"/>
<mxCell id="label1" value="yes" parent="edge1" style="edgeLabel;"/>
```

**Generated JSON:**
```json
{
  "type": "cell",
  "attributes": {
    "id": "c7",
    "drawio_id": "abc123",
    "text": "found?",
    "kind": "rhombus",
    "parent": "2"
  }
},
{
  "type": "cell",
  "attributes": {
    "id": "c8",
    "source": "abc123",
    "target": "xyz789",
    "kind": "edge"
  }
}
```

---

## Stage 2: Prolog Edge Processing

**Input:** JSON from Stage 1  
**Output:** Enhanced JSON with properly labeled edges  
**Tool:** SWI-Prolog script (`process_json.pl`)

### What Happens

The Prolog script processes the JSON to:
1. Find all `branchLabel` cells (the "yes"/"no" text labels)
2. Match them to their parent edges
3. Convert generic `"kind": "edge"` to specific edge types:
   - `"kind": "trueEdge"` (for "yes" branches)
   - `"kind": "falseEdge"` (for "no" branches)
4. Remove the branchLabel cells (they're no longer needed)

This makes the graph structure clearer by directly marking which edges are true/false branches.

---

## Stage 3: Decision Tree IR Generation

**Input:** Enhanced JSON  
**Output:** Decision tree intermediate representation (.dt format)  
**Process:** Component-based graph traversal

### The .dt Format

The intermediate representation is a nested bracket notation:

```
[ <condition>
  | yes: <action or nested decision>
  | no: <action or nested decision>
]
```

### Example Decision Tree IR

```
[ found
  | yes:
    [%inCompilationState
      | yes:
        [ foundImmediate
          | yes: @exec(xt)
          | no: @compile(xt)
        ]         
      | no: @exec(xt)
    ]
  | no:
    [ %inCompilationState
      | yes:
        [%isInteger(word)
          | yes: @compileInteger(word)
          | no:
            [ %isFloat(word)
              | yes: @compileFloat(word)
              | no: @error(word)
            ]
        ]
      | no: [...]
    ]
]
```

### Notation Conventions

- **Conditions** (in rhombus nodes) can use:
  - Plain names: `found`, `foundImmediate`
  - Function calls: `%isInteger(word)`, `%inCompilationState`
  
- **Actions** (in process nodes) use:
  - `@` prefix: `@exec(xt)`, `@compileInteger(word)`
  - Function calls: `%funcall name(args)`

---

## Stage 4: Frish Code Generation

**Input:** Decision tree IR (.dt format)  
**Output:** Frish meta-code (.frish)  
**Tools:** OhmJS grammar (`dt.ohm`) + RWR rewrite rules (`dtfrish.rwr`)

### The dt.ohm Grammar

Defines the structure of the decision tree IR:

```ohm
dt {
  Main = YesNo
  YesNo = "[" text YesBranch NoBranch "]"
  YesBranch = "|" "yes" ":" (YesNo | text)
  NoBranch = "|" "no" ":" (YesNo | text)
  text = char+
  // ... character definitions
}
```

### The dtfrish.rwr Rewrite Rules

Transforms the nested bracket notation into nested if-else statements:

```rwr
YesNo [lb text y n rb] = ‛if («text») {⤷«y»⤶\n} else {⤷«n»⤶\n}'
YesBranch [_or _yes _ x] = ‛\n«x»'
NoBranch [_or _no _ x] = ‛\n«x»'
```

Special transformations:
- `@` prefix becomes `%funcall `
- HTML tags (`<div>`, `<span>`) are stripped
- Newlines and question marks are removed
- Indentation is added via `⤷` (indent) and `⤶` (dedent) markers

### Generated Frish Output

```frish
if (found) {
    if (%incompilingstate) {
        if (foundimmediate) {
            %funcall exec(item)
        } else {
            %funcall compileword(item)
        }
    } else {
        %funcall exec(item)
    }
} else {
    if (%incompilingstate) {
        if (%isinteger(item)) {
            %funcall compileinteger(item)
        } else {
            if (%isfloat(item)) {
                %funcall compilefloat(item)
            } else {
                %returnFalse
            }
        }
    } else {
        // ... similar structure
    }
}
```

---

## Stage 5: Target Language Generation (Optional)

The frish meta-code can be further transpiled to specific languages like Python, JavaScript, etc. using additional rewrite rules (`dtpython.rwr`, etc.).

The Python output is nearly identical but removes the `%funcall` prefixes:

```python
if (found) {
    if (%incompilingstate) {
        if (foundimmediate) {
            exec(item)  # Note: no %funcall prefix
        } else {
            compileword(item)
        }
    } else {
        exec(item)
    }
}
# ...
```

---

## Key Design Principles

### 1. Visual First
Decision logic is designed visually in draw.io, making it easier to:
- Understand complex branching logic
- Communicate with non-programmers
- Maintain and modify decision trees

### 2. Multi-Stage Transformation
Each stage has a single, clear purpose:
- Keeps transformations simple and debuggable
- Allows intermediate inspection at each stage
- Enables targeting multiple output languages

### 3. Text as the "Narrow Waist"
The `.dt` intermediate representation is human-readable text:
- Easy to inspect and debug
- Can be manually written or edited
- Scales well as a format

### 4. Component-Based Architecture
Uses the PBP (Parts Based Programming) kernel system:
- Processes are isolated components
- Data flows through well-defined interfaces
- Easy to test and modify individual stages

---

## Build Process

The `Makefile` orchestrates the entire pipeline:

```makefile
all:
    # Stage 1: Convert draw.io to JSON
    node $(PBP)/das/das2json.mjs dtree-transmogrifier.drawio
    
    # Check for errors
    ./check-for-span-error.bash dtree-transmogrifier.drawio.json
    
    # Stages 2-4: Process JSON through Python/Prolog/OhmJS pipeline
    python3 main.py $(PBP) 'xinterpret.drawio' main \
        dtree-transmogrifier.drawio.json | \
        node $(PBP)/kernel/splitoutput.js
```

---

## Advantages of This Approach

1. **Visual Programming**: Design complex logic without writing code
2. **Automatic Code Generation**: No manual translation errors
3. **Multi-Language Support**: Same diagram → multiple target languages
4. **Maintainability**: Update the diagram, regenerate the code
5. **Documentation**: The diagram IS the documentation
6. **Type Safety**: Visual structure enforces valid decision tree shape

---

## Limitations and Considerations

1. **Draw.io Constraints**: Must use specific shapes (rhombus/process) and edge labels
2. **Learning Curve**: Requires understanding the visual conventions
3. **Build Complexity**: Multi-tool pipeline (Node.js, Python, Prolog, OhmJS)
4. **Debugging**: Errors can occur at multiple stages

---

## Summary

The dtree transmogrifier demonstrates a practical approach to visual programming:

1. **Draw** your decision tree in draw.io using rhombus (decisions) and rectangles (actions)
2. **Label** edges as "yes" or "no"
3. **Run** the build process
4. **Get** clean, nested if-else code in frish (or Python, etc.)

The key insight is using **text-based intermediate representations** between each stage, making the transformation pipeline transparent, debuggable, and extensible to new target languages.
