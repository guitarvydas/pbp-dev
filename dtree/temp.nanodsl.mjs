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
dt {
  Main = YesNo
  YesNo = "[" text YesBranch NoBranch "]"

  YesBranch = "|" "yes" ":" (YesNo | text)
  NoBranch = "|" "no" ":" (YesNo | text)

  text = char+
  
  char =
    | "\n" -- newline
    | "?" -- questionmark
    | "&lt;div&gt;" -- begindiv
    | "&lt;/div&gt;" -- enddiv
    | "&lt;span" (~"&gt;" any)* "&gt;" -- beginspan
    | "&lt;/span&gt;" -- endspan
    | "@" -- at
    | space -- space
    | (~space ~"[" ~"]" ~"|" ~"yes" ~"no" ~":" ~"&" ~";" any) -- other
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

let counter = 2;
let dict = {};

function newid (prefix) {
    let id = counter;
    let newname = `${prefix}${id}`;
    counter += 1;
    return `${newname}`;
}
function memoid (name, id) {
    dict [name] = id;
    return "";
}
function reset () {
    dict = {};
}

function fetchid (name) {
    let id = dict[name];
    if (id) {
	return id;
    } else {
	return name;
    }
}


function maptojson () {
    let s = "";
    for (let name in dict) {
	if (s !== "") {
	    s += ",";  // Add comma before appending
	}
	s += `\n"${name}":"${dict[name]}"`;
    }
    return `{${s}\n}`;
}

function maptopl () {
    let s = "";
    for (let name in dict) {
    	s += `\nid("${name}",${dict[name]}).`;
    }
    return `${s}\n`;
}

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
import * as fs from 'fs';

let terminated = false;

function xbreak () {
    terminated = true;
    return '';
}

function xcontinue () {
    terminated = false;
    return '';
}
    
function is_terminated () {
    return terminated;
}
function expand (src, parser) {
    let cst = parser.match (src);
    if (cst.failed ()) {
	//th  row Error (`${cst.message}\ngrammar=${grammarname (grammar)}\nsrc=\n${src}`);
	throw Error (cst.message);
    }
    let sem = parser.createSemantics ();
    sem.addOperation ('rwr', _rewrite);
    return sem (cst).rwr ();
}

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
	let s = src;
	xcontinue ();
	while (! is_terminated ()) {
	    xbreak ();
	    s = expand (s, parser);
	}
	console.log (s);
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

