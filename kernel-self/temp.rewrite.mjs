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
    set_return (`#${cs.rwr ().join ('')}`);
return exit_rule ("char_comment");
},
char_errormessage : function (lb,cs,rb,) {
enter_rule ("char_errormessage");
    set_return (` >>> ${cs.rwr ().join ('')} <<< `);
return exit_rule ("char_errormessage");
},
char_line : function (lb,cs,rb,) {
enter_rule ("char_line");
    set_return (`#line ${cs.rwr ().join ('')}`);
return exit_rule ("char_line");
},
char_ulb : function (c,) {
enter_rule ("char_ulb");
    set_return (``);
return exit_rule ("char_ulb");
},
char_encodedulb : function (c,) {
enter_rule ("char_encodedulb");
    set_return (`_L`);
return exit_rule ("char_encodedulb");
},
char_urb : function (c,) {
enter_rule ("char_urb");
    set_return (``);
return exit_rule ("char_urb");
},
char_encodedurb : function (c,) {
enter_rule ("char_encodedurb");
    set_return (`R_`);
return exit_rule ("char_encodedurb");
},
char_space : function (c,) {
enter_rule ("char_space");
    set_return (`_`);
return exit_rule ("char_space");
},
char_tab : function (c,) {
enter_rule ("char_tab");
    set_return (`	`);
return exit_rule ("char_tab");
},
char_newline : function (c,) {
enter_rule ("char_newline");
    set_return (`
`);
return exit_rule ("char_newline");
},
char_paramark : function (c,) {
enter_rule ("char_paramark");
    set_return (`¶`);
return exit_rule ("char_paramark");
},
char_other : function (c,) {
enter_rule ("char_other");
    set_return (`${c.rwr ()}`);
return exit_rule ("char_other");
},
_terminal: function () { return this.sourceString; },
_iter: function (...children) { return children.map(c => c.rwr ()); }
}
