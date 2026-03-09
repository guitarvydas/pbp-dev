#!/usr/bin/env swipl

:- use_module(library(http/json)).
:- use_module(library(lists)).
:- initialization(main, main).

% Main predicate for command-line usage
main :-
    % Read JSON from stdin
    json_read(user_input, JsonIn),
    
    % Process the JSON data
    process_json(JsonIn, JsonOut),
    
    % Write JSON to stdout
    json_write(user_output, JsonOut),
    nl,
    
    % Exit successfully
    halt(0).

% Process the JSON array
process_json(JsonArray, ProcessedArray) :-
    is_list(JsonArray),
    maplist(process_element, JsonArray, ProcessedArray).

% Process each top-level element
process_element(json(Props), json(ProcessedProps)) :-
    member(type=diagram, Props),
    !,
    % This is a diagram element, process its cells
    member(cells=Cells, Props),
    process_cells(Cells, ProcessedCells),
    % Replace cells in properties
    replace_property(cells, ProcessedCells, Props, ProcessedProps).

process_element(Element, Element).

% Process cells: first identify branch labels, then modify edges, then filter
process_cells(Cells, ProcessedCells) :-
    % Find all branchLabel cells and their parent edges
    findall(parent_edge(Parent, true), 
            (member(json(CellProps), Cells),
             member(type=cell, CellProps),
             member(attributes=json(Attrs), CellProps),
             member(kind=branchLabel, Attrs),
             member(branch= @(true), Attrs),
             member(parent=Parent, Attrs)), 
            TrueEdges),
    findall(parent_edge(Parent, false), 
            (member(json(CellProps), Cells),
             member(type=cell, CellProps),
             member(attributes=json(Attrs), CellProps),
             member(kind=branchLabel, Attrs),
             member(branch= @(false), Attrs),
             member(parent=Parent, Attrs)), 
            FalseEdges),
    
    % Modify edge kinds
    append(TrueEdges, FalseEdges, AllEdges),
    modify_edges(Cells, AllEdges, ModifiedCells),
    
    % Remove branchLabel cells
    exclude(is_branch_label, ModifiedCells, ProcessedCells).

% Check if a cell is a branchLabel
is_branch_label(json(Props)) :-
    member(attributes=json(Attrs), Props),
    member(kind=branchLabel, Attrs).

% Modify edge kinds based on parent_edge list
modify_edges([], _, []).
modify_edges([json(CellProps)|Rest], EdgeList, [json(NewProps)|ProcessedRest]) :-
    member(type=cell, CellProps),
    member(attributes=json(Attrs), CellProps),
    member(drawio_id=Id, Attrs),
    member(parent_edge(Id, Branch), EdgeList),
    !,
    % This edge needs to be modified
    (Branch = true -> NewKind = trueEdge ; NewKind = falseEdge),
    replace_attr_property(kind, NewKind, Attrs, NewAttrs),
    replace_property(attributes, json(NewAttrs), CellProps, NewProps),
    modify_edges(Rest, EdgeList, ProcessedRest).
modify_edges([Cell|Rest], EdgeList, [Cell|ProcessedRest]) :-
    modify_edges(Rest, EdgeList, ProcessedRest).

% Replace a property in a property list
replace_property(Key, NewValue, Props, NewProps) :-
    select(Key=_, Props, TempProps),
    !,
    NewProps = [Key=NewValue|TempProps].
replace_property(Key, Value, Props, [Key=Value|Props]).

% Replace a property in attributes (same as replace_property)
replace_attr_property(Key, NewValue, Props, NewProps) :-
    select(Key=_, Props, TempProps),
    !,
    NewProps = [Key=NewValue|TempProps].
replace_attr_property(Key, Value, Props, [Key=Value|Props]).
