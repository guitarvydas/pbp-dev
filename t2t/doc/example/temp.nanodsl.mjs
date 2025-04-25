'use strict'

import * as ohm from 'ohm-js';

let verbose = false;

function top (stack) { let v = stack.pop (); stack.push (v); return v; }

function set_top (stack, v) { stack.pop (); stack.push (v); return v; }

let return_value_stack = [];
let rule_name_stack = [];
let depth_prefix = ' ';

function enter_rule (name) {
    if (verbose) {
	console.error (depth_prefix, ["enter", name]);
	depth_prefix += ' ';
    }
    return_value_stack.push ("");
    rule_name_stack.push (name);
}

function set_return (v) {
    set_top (return_value_stack, v);
}

function exit_rule (name) {
    if (verbose) {
	depth_prefix = depth_prefix.substr (1);
	console.error (depth_prefix, ["exit", name]);
    }
    rule_name_stack.pop ();
    return return_value_stack.pop ()
}

const grammar = String.raw`
ex {
  Main = Statement
  Statement = 
    | #atom "<-" Expression Statement? -- assignment
    | "return" Expression              -- return
  Expression = 
    | #atom "+" Expression  -- plus
    | #atom                 -- primary
  atom = primary &(space | end)
  primary =
    | letter+ -- id
    | digit+  -- int
}
`;

let args = {};
function resetArgs () {
    args = {};
}
function memoArg (name, accessorString) {
    args [name] = accessorString;
};
function fetchArg (name) {
    return args [name];
}

// empty
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
import * as fs from 'fs';

function grammarname (s) {
    let n = s.search (/{/);
    return s.substr (0, n).replaceAll (/\n/g,'').trim ();
}

try {
    const argv = process.argv.slice(2);
    let srcFilename = argv[0];
    if ('-' == srcFilename) { srcFilename = 0 }
    let src = fs.readFileSync(srcFilename, 'utf-8');
    try {
	let parser = ohm.grammar (grammar);
	let cst = parser.match (src);
	if (cst.failed ()) {
	    //throw Error (`${cst.message}\ngrammar=${grammarname (grammar)}\nsrc=\n${src}`);
	    throw Error (cst.message);
	}
	let sem = parser.createSemantics ();
	sem.addOperation ('rwr', _rewrite);
	console.log (sem (cst).rwr ());
	process.exit (0);
    } catch (e) {
	//console.error (`${e}\nargv=${argv}\ngrammar=${grammarname (grammar)}\src=\n${src}`);
	console.error (`${e}\n\ngrammar = "${grammarname (grammar)}"`);
	process.exit (1);
    }
} catch (e) {
    console.error (`${e}\n\ngrammar = "${grammarname (grammar)}`);
    process.exit (1);
}

