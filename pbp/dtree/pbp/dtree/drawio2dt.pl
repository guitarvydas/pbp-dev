:- use_module(library(http/json)).

test(Name,ID,Cells) :-
    open('xinterpret.json',read,Strm),
    json_read(Strm,J),
    close(Strm),
    J=[json([name=Name, id=ID, cells=Cells])|_].

