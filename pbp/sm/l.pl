cell(
    id="yK0KRwzggwMbkE22hVbx-13",
    parent="yK0KRwzggwMbkE22hVbx-1",
    source="yK0KRwzggwMbkE22hVbx-17",
    kind="edge",
    target="yK0KRwzggwMbkE22hVbx-20").
cell(
    id="yK0KRwzggwMbkE22hVbx-14",
    parent="yK0KRwzggwMbkE22hVbx-13",
    kind="edgeLabel",
    value="x > w<div>{reverse ()}</div>").

merge:-
    cell(id=_,parent=P,kind="edgeLabel",value=C),
    cell(id=P,source=Src,target=Dest,kind="edge",parent=_),
    assert(transition(source=Src,target=Dest,test=C)).
