#!/bin/bash

# Process JSON to modify edge kinds based on branchLabel cells
# Reads from stdin, writes to stdout

jq '.[0].cells |= (
    # Step 1: Extract branchLabel parent mappings
    # Create a dictionary: {parent_id: branch_value}
    (map(select(.attributes.kind == "branchLabel")) | 
	 map({(.attributes.parent): .attributes.branch})) as $labelMap |
	
	# Step 2: Merge all mappings into one object
	($labelMap | add // {}) as $labels |
	
	# Step 3: Process each cell
	map(
	    # If this is an edge and has a branchLabel child, modify its kind
	    if (.attributes.kind == "edge") and ($labels[.attributes.drawio_id] != null) then
               .attributes.kind = (if $labels[.attributes.drawio_id] then "trueEdge" else "falseEdge" end)
	       else
		   .
		   end
	) |
	
	# Step 4: Remove all branchLabel cells
	map(select(.attributes.kind != "branchLabel"))
)'

