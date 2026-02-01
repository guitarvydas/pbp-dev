#!/usr/bin/env swipl

:- use_module(library(http/json)).
:- initialization(main, main).

main :-
    open('/dev/stdin', read, In),
    json_read_dict(In, Data),
    close(In),
    
    get_diagram_cells(Data, Cells),
    find_root(Cells, Root),
    walk_tree(Root, Cells, Result),
    
    format('~w~n', [Result]),
    halt.

get_diagram_cells(Data, Cells) :-
    member(Diagram, Data),
    get_dict(type, Diagram, "diagram"),
    Cells = Diagram.cells,
    !.

find_root(Cells, Root) :-
    findall(Target, (member(Edge, Cells), get_dict(target, Edge, Target)), Targets),
    member(Root, Cells),
    is_decision_node(Root),
    \+ member(Root.id, Targets),
    !.

is_decision_node(Cell) :-
    get_dict(kind, Cell, Kind),
    (Kind = "process" ; Kind = "rhombus"),
    \+ get_dict(source, Cell, _).

walk_tree(Node, Cells, Result) :-
    walk_by_kind(Node.kind, Node.text, Node, Cells, Result).

walk_by_kind("process", Text, _Node, _Cells, Text) :- !.

walk_by_kind("rhombus", Text, Node, Cells, Result) :-
    find_branch(Node.id, true, Cells, TrueNode),
    find_branch(Node.id, false, Cells, FalseNode),
    walk_tree(TrueNode, Cells, TrueResult),
    walk_tree(FalseNode, Cells, FalseResult),
    format(atom(Result), '[ ~w | yes: ~w | no: ~w ]', [Text, TrueResult, FalseResult]),
    !.

find_branch(SourceId, BranchValue, Cells, TargetNode) :-
    (   BranchValue = true, EdgeKind = "trueEdge"
    ;   BranchValue = false, EdgeKind = "falseEdge"
    ),
    member(Edge, Cells),
    get_dict(source, Edge, SourceId),
    get_dict(kind, Edge, EdgeKind),
    get_dict(target, Edge, TargetId),
    member(TargetNode, Cells),
    TargetNode.id = TargetId,
    is_decision_node(TargetNode),
    !.

find_branch(SourceId, BranchValue, Cells, TargetNode) :-
    member(Edge, Cells),
    get_dict(source, Edge, SourceId),
    get_dict(kind, Edge, "edge"),
    get_dict(id, Edge, EdgeId),
    get_dict(target, Edge, TargetId),
    member(Label, Cells),
    get_dict(kind, Label, "branchLabel"),
    get_dict(parent, Label, EdgeId),
    get_dict(branch, Label, BranchValue),
    member(TargetNode, Cells),
    TargetNode.id = TargetId,
    is_decision_node(TargetNode),
    !.
