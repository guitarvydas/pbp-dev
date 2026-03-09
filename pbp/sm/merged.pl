:- dynamic diagram/1.

diagram(did=i4kYwzf).

state(did=i4kYwzf,id=i17,parent=i1,name="idle", enter="", exit="").
state(did=i4kYwzf,id=i20,parent=i1,name="wait for w recrossing", enter="", exit="").
state(did=i4kYwzf,id=i23,parent=i1,name="wait for zero recrossing", enter="", exit="").
:- dynamic transition/6.

transition(did=i4kYwzf,id=i13,parent=i1,source=i17,target=i20,guard="x > w", transitioncode="{reverse ()}").
transition(did=i4kYwzf,id=i15,parent=i1,source=i17,target=i23,guard="x < 0", transitioncode="{reverse ()}").
transition(did=i4kYwzf,id=i18,parent=i1,source=i20,target=i17,guard="x <= w", transitioncode="").
transition(did=i4kYwzf,id=i21,parent=i1,source=i23,target=i17,guard="x >= 0", transitioncode="").

