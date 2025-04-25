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
    return parameters [name];
}


let _rewrite = {

Main : function (Statement,) {
enter_rule ("Main");
    set_return (`${Statement.rwr ()}`);
return exit_rule ("Main");
},
Statement_assignment : function (a,_assign,e,rec,) {
enter_rule ("Statement_assignment");
    set_return (`\n${a.rwr ()}${_assign.rwr ()}${e.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("Statement_assignment");
},
Statement_return : function (_return,e,) {
enter_rule ("Statement_return");
    set_return (`\nreturn ${e.rwr ()}`);
return exit_rule ("Statement_return");
},
Expression_plus : function (a,_op,e,) {
enter_rule ("Expression_plus");
    set_return (`${a.rwr ()}${_op.rwr ()}${e.rwr ()}`);
return exit_rule ("Expression_plus");
},
Expression_primary : function (a,) {
enter_rule ("Expression_primary");
    set_return (`${a.rwr ()}`);
return exit_rule ("Expression_primary");
},
atom : function (a,_lookahead,) {
enter_rule ("atom");
    set_return (`${a.rwr ()}`);
return exit_rule ("atom");
},
primary_id : function (letters,) {
enter_rule ("primary_id");
    set_return (`${letters.rwr ().join ('')}`);
return exit_rule ("primary_id");
},
primary_int : function (digits,) {
enter_rule ("primary_int");
    set_return (`${digits.rwr ().join ('')}`);
return exit_rule ("primary_int");
},
_terminal: function () { return this.sourceString; },
_iter: function (...children) { return children.map(c => c.rwr ()); }
}
