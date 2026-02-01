# JQ Summary
# What This Command Does

```bash
jq 'map(if has("cells") then .cells |= map(.attributes | del(.drawio_id)) else . end)'
```

## In One Sentence

**Unwraps cell attributes and removes drawio_id from each cell.**

## Two Operations

### 1. Unwrap Attributes
```
{"type": "cell", "attributes": {"id": "c5", "text": "hello"}}
                    ↓
{"id": "c5", "text": "hello"}
```

### 2. Remove drawio_id
```
{"id": "c5", "drawio_id": "xyz-123", "text": "hello"}
                    ↓
{"id": "c5", "text": "hello"}
```

## Before/After

**Before:**
```json
{
  "cells": [
    {"type": "cell", "attributes": {"id": "c5", "drawio_id": "xyz", "text": "hi"}}
  ]
}
```

**After:**
```json
{
  "cells": [
    {"id": "c5", "text": "hi"}
  ]
}
```

## Why?

1. **Simplify structure** - Remove the wrapper layer
2. **Clean data** - Remove Draw.io-specific IDs you don't need
3. **Prepare for processing** - Get cells in a flat, clean format

## Applies To

- ✓ Diagrams with `cells` field
- ✗ Map objects (unchanged)

---

# Before After Demo
# Visual Demonstration

## Command
```bash
jq 'map(if has("cells") then .cells |= map(.attributes | del(.drawio_id)) else . end)'
```

## BEFORE

```json
[
  {
    "type": "diagram",
    "cells": [
      {
        "type": "cell",
        "attributes": {
          "id": "c5",
          "drawio_id": "zTViIhP_tUskBqKQNT3X-46",
          "parent": "c4",
          "text": "hello",
          "kind": "process"
        }
      },
      {
        "type": "cell",
        "attributes": {
          "id": "c6",
          "drawio_id": "abc-123",
          "source": "c5",
          "target": "c7",
          "kind": "edge"
        }
      }
    ]
  },
  {
    "map": {
      "old1": "new1",
      "old2": "new2"
    }
  }
]
```

## AFTER

```json
[
  {
    "type": "diagram",
    "cells": [
      {
        "id": "c5",
        "parent": "c4",
        "text": "hello",
        "kind": "process"
      },
      {
        "id": "c6",
        "source": "c5",
        "target": "c7",
        "kind": "edge"
      }
    ]
  },
  {
    "map": {
      "old1": "new1",
      "old2": "new2"
    }
  }
]
```

## What Changed

### Cell 1
**Before:**
- Wrapped in `{"type": "cell", "attributes": {...}}`
- Has `drawio_id: "zTViIhP_tUskBqKQNT3X-46"`

**After:**
- Unwrapped - just the attributes contents
- `drawio_id` removed

### Cell 2
**Before:**
- Wrapped in `{"type": "cell", "attributes": {...}}`
- Has `drawio_id: "abc-123"`

**After:**
- Unwrapped - just the attributes contents
- `drawio_id` removed

### Map Object
**Before & After:**
- Unchanged (no `cells` field)

## Summary

For each diagram:
1. ❌ Removes the cell wrapper (`{"type": "cell", "attributes": ...}`)
2. ❌ Removes `drawio_id` field
3. ✓ Keeps all other cell data (id, parent, text, kind, source, target, etc.)

For the map object:
4. ✓ Unchanged
---

# Understanding: jq 'map(if has("cells") then .cells |= map(.attributes | del(.drawio_id)) else . end)'

## What It Does

This command transforms your JSON data in two ways:

1. **Unwraps cell attributes** - extracts the contents of each cell's `attributes` field
2. **Removes drawio_id** - deletes the `drawio_id` field from each cell

## Breaking Down The Command

```jq
map(
  if has("cells") 
  then .cells |= map(.attributes | del(.drawio_id)) 
  else . 
  end
)
```

### Part 1: Outer `map(...)`
Processes each element in the top-level array (diagrams and map object).

### Part 2: `if has("cells")`
Checks if the current item has a `cells` field (i.e., is a diagram, not the map object).

### Part 3: `.cells |= map(...)`
Updates the `cells` field with the transformed version.

### Part 4: `.attributes | del(.drawio_id)`
For each cell:
- Extract `.attributes` (unwrap)
- Delete the `drawio_id` field

### Part 5: `else .`
If no `cells` field (the map object), return unchanged.

## Transformation Example

### Before
```json
[
  {
    "type": "diagram",
    "cells": [
      {
        "type": "cell",
        "attributes": {
          "id": "c5",
          "drawio_id": "zTViIhP_tUskBqKQNT3X-46",
          "parent": "c4",
          "text": "hello"
        }
      },
      {
        "type": "cell",
        "attributes": {
          "id": "c6",
          "drawio_id": "abc-123",
          "kind": "process"
        }
      }
    ]
  },
  {
    "map": {...}
  }
]
```

### After
```json
[
  {
    "type": "diagram",
    "cells": [
      {
        "id": "c5",
        "parent": "c4",
        "text": "hello"
      },
      {
        "id": "c6",
        "kind": "process"
      }
    ]
  },
  {
    "map": {...}
  }
]
```

## What Changed

### For Each Cell:
1. **Unwrapped:** `{"type": "cell", "attributes": {...}}` → `{...}`
2. **Removed:** `drawio_id` field deleted

### For Map Object:
- No change (doesn't have `cells` field)

## Step-by-Step for One Cell

```
Input cell:
{
  "type": "cell",
  "attributes": {
    "id": "c5",
    "drawio_id": "zTViIhP_tUskBqKQNT3X-46",
    "text": "hello"
  }
}

↓ .attributes
{
  "id": "c5",
  "drawio_id": "zTViIhP_tUskBqKQNT3X-46",
  "text": "hello"
}

↓ del(.drawio_id)
{
  "id": "c5",
  "text": "hello"
}

↓ This becomes the new cell
Output cell:
{
  "id": "c5",
  "text": "hello"
}
```

## Visual Flow

```
map(                                        # For each top-level item
  if has("cells")                           # Is it a diagram?
  then
    .cells |= map(                          # Transform each cell
      .attributes                           # Unwrap attributes
      | del(.drawio_id)                     # Remove drawio_id
    )
  else                                      # Not a diagram?
    .                                       # Keep unchanged (map object)
  end
)
```

## Common Use Case

This is typically used to:
1. **Clean up Draw.io exports** - Remove the internal Draw.io IDs
2. **Simplify structure** - Flatten the cell wrapper
3. **Prepare for processing** - Get cells into a cleaner format

## Equivalent Operations

### Just unwrap (keep drawio_id):
```jq
map(if has("cells") then .cells |= map(.attributes) else . end)
```

### Just remove drawio_id (keep wrapper):
```jq
map(if has("cells") then .cells |= map(.attributes.drawio_id = null) else . end)
```

### Unwrap + remove multiple fields:
```jq
map(if has("cells") then .cells |= map(.attributes | del(.drawio_id, .type)) else . end)
```

## Why Use This?

**Before processing:**
- Complex nested structure with wrappers
- Contains Draw.io-specific IDs you don't need

**After processing:**
- Clean, flat cell objects
- Only the data you care about
- Ready for your tree walker or other tools

---
