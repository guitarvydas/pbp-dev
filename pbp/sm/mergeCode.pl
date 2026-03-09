:- dynamic transition/6.
:- dynamic diagram/1.

mergeCode(Did):-
    forall(
	transition(did=Did, id=Tid, parent=Pt, source=T, target=Dest),
	(
	    trCode(did=Did, id=_, parent=Tid, value=Code),
            assert(transition(did=Did, id=Tid, parent=Pt, source=T, target=Dest, code=Code))
	)
    ).

run:-
    forall(diagram(did=Did),mergeCode(Did)),
    listing(diagram/1),
    listing(state/4),
    listing(transition/6).
