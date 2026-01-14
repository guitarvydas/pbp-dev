let parameters = {};
function pushParameter (name, v) {
    if (!parameters [name]) {
        parameters [name] = [];
    }
    parameters [name].push (v);
}
function popParameter (name) {
    parameters [name].pop ();
}
function getParameter (name) {
    let top = parameters [name].pop ();
    parameters [name].push (top);
    return top;
}


let _rewrite = {

Main : function (YesNo,) {
enter_rule ("Main");
    set_return (`${YesNo.rwr ()}`);
return exit_rule ("Main");
},
YesNo : function (lb,text,y,n,rb,) {
enter_rule ("YesNo");
    set_return (`[ ${text.rwr ()}⤷${y.rwr ()}⤶\n⤷${n.rwr ()}⤶\n]`);
return exit_rule ("YesNo");
},
YesBranch : function (_or,_yes,_,x,) {
enter_rule ("YesBranch");
    set_return (`\n| yes: ${x.rwr ()}`);
return exit_rule ("YesBranch");
},
NoBranch : function (_or,_no,_,x,) {
enter_rule ("NoBranch");
    set_return (`\n| no: ${x.rwr ()}`);
return exit_rule ("NoBranch");
},
text : function (cs,) {
enter_rule ("text");
    set_return (`${cs.rwr ().join ('')}`);
return exit_rule ("text");
},
char_newline : function (_,) {
enter_rule ("char_newline");
    set_return (``);
return exit_rule ("char_newline");
},
char_questionmark : function (_,) {
enter_rule ("char_questionmark");
    set_return (``);
return exit_rule ("char_questionmark");
},
char_begindiv : function (_,) {
enter_rule ("char_begindiv");
    set_return (``);
return exit_rule ("char_begindiv");
},
char_enddiv : function (_,) {
enter_rule ("char_enddiv");
    set_return (``);
return exit_rule ("char_enddiv");
},
char_beginspan : function (lb,cs,rb,) {
enter_rule ("char_beginspan");
    set_return (``);
return exit_rule ("char_beginspan");
},
char_endspan : function (_,) {
enter_rule ("char_endspan");
    set_return (``);
return exit_rule ("char_endspan");
},
char_other : function (c,) {
enter_rule ("char_other");
    set_return (`${c.rwr ()}`);
return exit_rule ("char_other");
},
_terminal: function () { return this.sourceString; },
_iter: function (...children) { return children.map(c => c.rwr ()); }
}
