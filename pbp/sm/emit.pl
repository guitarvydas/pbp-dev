emitTransitions(Diagram,IDstate,Dest,Guard,Tcode):-
    forall(
        transition(did=Diagram, id=_, parent=_, source=IDstate, target=Dest, guard=Guard, transitioncode=Tcode),
	(
	    state(did=Diagram, id=Dest, parent=_, name=DestName, enter=_, exit=_),
            format("%next ~q %when (~w) ~w~n",[DestName,Guard,Tcode])
	)
    ).

emitState(Diagram,IDstate):-
    state(did=Diagram, id=IDstate, parent=_, name=Name,enter=Enter,exit=Exit),
    format("state ~q {~n{~w}~n{~n", [Name, Enter]),
    emitTransitions(Diagram,IDstate,_,_,_),
    format("}~n{~w}~n}~n",[Exit]).

emitAllStates(Diagram):-
    forall(
	state(did=Diagram, id=IDstate, parent=_, name=_, enter=_, exit=_),
	emitState(Diagram,IDstate)
    ).

emit:-
    forall(
	diagram(did=Diagram),
	emitAllStates(Diagram)
    ).
