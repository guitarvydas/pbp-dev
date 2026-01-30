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
cldecode {
  text = char+
  char =
    | "“" (~"“" ~"”" any)* "”"  -- string
    | "⌈" (~"⌈" ~"⌉" any)* "⌉"   -- comment
    | "⎝" (~"⎝" ~"⎠" any)* "⎠"  -- errormessage
    | "⎩" (~"⎩" ~"⎭" any)* "⎭"  -- line
    | "❲"                       -- ulb
    | "%E2%9D%B2"               -- encodedulb
    | "❳"                       -- urb
    | "%E2%9D%B3"               -- encodedurb
    | "%20"                     -- space
    | "%09"                     -- tab
    | "%0A"                     -- newline
    | any                       -- other
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

function encodews (s) { return encodequotes (encodeURIComponent (s)); }

function encodequotes (s) { 
    let rs = s.replace (/"/g, '%22').replace (/'/g, '%27');
    return rs;
}

let linenumber = 0;
function getlineinc () {
    linenumber += 1;
    return `${linenumber}`;
}

function part (s, i) {
    let lis = s.split ("⫶");
    let len = lis.length - 1
    let r = []
    let ix = Number (i);
    for (; ix < len ; ix += 3) {
	r.push (`${lis [ix]}`);
    }
    return `${r.join ('')}`;
}

function enspace (arr) {
    // create space-separated args for exec
    return arr;
    //return arr.join (" ");
}

function pycommentify (s) {
    return s;
    //return s.replaceAll (/\n/g, "\n#").replaceAll ("%0A", "%0A#");
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
    return parameters [name];
}


let _rewrite = {

text : function (chars,) {
enter_rule ("text");
    set_return (`${chars.rwr ().join ('')}`);
return exit_rule ("text");
},
char_string : function (lq,cs,rq,) {
enter_rule ("char_string");
    set_return (`"${cs.rwr ().join ('')}"`);
return exit_rule ("char_string");
},
char_comment : function (lb,cs,rb,) {
enter_rule ("char_comment");
    set_return (` #| ${cs.rwr ().join ('')} |#`);
return exit_rule ("char_comment");
},
char_errormessage : function (lb,cs,rb,) {
enter_rule ("char_errormessage");
    set_return (` >>> ${cs.rwr ().join ('')} <<< `);
return exit_rule ("char_errormessage");
},
char_line : function (lb,cs,rb,) {
enter_rule ("char_line");
    set_return (` #|line ${cs.rwr ().join ('')}|#`);
return exit_rule ("char_line");
},
char_ulb : function (c,) {
enter_rule ("char_ulb");
    set_return (``);
return exit_rule ("char_ulb");
},
char_encodedulb : function (c,) {
enter_rule ("char_encodedulb");
    set_return (`-L`);
return exit_rule ("char_encodedulb");
},
char_urb : function (c,) {
enter_rule ("char_urb");
    set_return (``);
return exit_rule ("char_urb");
},
char_encodedurb : function (c,) {
enter_rule ("char_encodedurb");
    set_return (`R-`);
return exit_rule ("char_encodedurb");
},
char_space : function (c,) {
enter_rule ("char_space");
    set_return (`-`);
return exit_rule ("char_space");
},
char_tab : function (c,) {
enter_rule ("char_tab");
    set_return (`-TAB-`);
return exit_rule ("char_tab");
},
char_newline : function (c,) {
enter_rule ("char_newline");
    set_return (`\n`);
return exit_rule ("char_newline");
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

