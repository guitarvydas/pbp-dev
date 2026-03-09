# JSON Processing Tool

This SWIPL Prolog program processes JSON files to modify edge types based on branchLabel cells.

## Usage

### As a command-line tool (stdin/stdout):

```bash
# Basic usage
cat input.json | ./process_json_cli.pl > output.json

# With pretty printing
cat input.json | ./process_json_cli.pl | python3 -m json.tool > output.json

# Using file redirection
./process_json_cli.pl < input.json > output.json
```

### What it does:

1. Finds all cells with `kind: "branchLabel"` and `branch: true`
2. Modifies their parent edge's `kind` from `"edge"` to `"trueEdge"`
3. Finds all cells with `kind: "branchLabel"` and `branch: false`
4. Modifies their parent edge's `kind` from `"edge"` to `"falseEdge"`
5. Removes all branchLabel cells from the output

## Requirements

- SWI-Prolog must be installed (`apt-get install swi-prolog`)
- The script must be executable (`chmod +x process_json_cli.pl`)

## Example

Input edge with drawio_id "zTViIhP_tUskBqKQNT3X-44":
```json
{
  "type": "cell",
  "attributes": {
    "drawio_id": "zTViIhP_tUskBqKQNT3X-44",
    "kind": "edge"
  }
}
```

BranchLabel pointing to this edge:
```json
{
  "type": "cell",
  "attributes": {
    "kind": "branchLabel",
    "branch": true,
    "parent": "zTViIhP_tUskBqKQNT3X-44"
  }
}
```

Output (edge modified, branchLabel removed):
```json
{
  "type": "cell",
  "attributes": {
    "drawio_id": "zTViIhP_tUskBqKQNT3X-44",
    "kind": "trueEdge"
  }
}
```
