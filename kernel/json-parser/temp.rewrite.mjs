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

main : function (item,) {
enter_rule ("main");
    set_return (`${item.rwr ().join ('')}`);
return exit_rule ("main");
},
object_multiple : function (lb,nameValuePair,_commas,nvps,rb,) {
enter_rule ("object_multiple");
    set_return (`(dict ${nameValuePair.rwr ()} ${nvps.rwr ().join ('')})`);
return exit_rule ("object_multiple");
},
object_single : function (lb,nvp,rb,) {
enter_rule ("object_single");
    set_return (`(obj ${nvp.rwr ()})`);
return exit_rule ("object_single");
},
object_empty : function (lb,ws,rb,) {
enter_rule ("object_empty");
    set_return (`(obj)`);
return exit_rule ("object_empty");
},
nameValuePair : function (ws1,str,ws2,_colon,ws3,val,) {
enter_rule ("nameValuePair");
    set_return (`(${str.rwr ()} . ${val.rwr ()})`);
return exit_rule ("nameValuePair");
},
array_multiple : function (lb,ws,val,_commas,vals,rb,) {
enter_rule ("array_multiple");
    set_return (`(jarray ${val.rwr ()} ${vals.rwr ().join ('')})`);
return exit_rule ("array_multiple");
},
array_single : function (lb,ws,val,rb,) {
enter_rule ("array_single");
    set_return (`(jarray ${val.rwr ()})`);
return exit_rule ("array_single");
},
array_empty : function (lb,ws,rb,) {
enter_rule ("array_empty");
    set_return (`(jarray)`);
return exit_rule ("array_empty");
},
value : function (ws1,val,ws2,) {
enter_rule ("value");
    set_return (`${val.rwr ()}`);
return exit_rule ("value");
},
value1_string : function (x,) {
enter_rule ("value1_string");
    set_return (`${x.rwr ()}`);
return exit_rule ("value1_string");
},
value1_number : function (x,) {
enter_rule ("value1_number");
    set_return (`${x.rwr ()}`);
return exit_rule ("value1_number");
},
value1_object : function (x,) {
enter_rule ("value1_object");
    set_return (`${x.rwr ()}`);
return exit_rule ("value1_object");
},
value1_array : function (x,) {
enter_rule ("value1_array");
    set_return (`${x.rwr ()}`);
return exit_rule ("value1_array");
},
value1_true : function (x,) {
enter_rule ("value1_true");
    set_return (`${x.rwr ()}`);
return exit_rule ("value1_true");
},
value1_false : function (x,) {
enter_rule ("value1_false");
    set_return (`${x.rwr ()}`);
return exit_rule ("value1_false");
},
value1_null : function (x,) {
enter_rule ("value1_null");
    set_return (`${x.rwr ()}`);
return exit_rule ("value1_null");
},
string : function (lq,cs,rq,) {
enter_rule ("string");
    set_return (`${lq.rwr ()}${cs.rwr ().join ('')}${rq.rwr ()}`);
return exit_rule ("string");
},
string_innard_quotationMark : function (c1,c2,) {
enter_rule ("string_innard_quotationMark");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_quotationMark");
},
string_innard_solidus : function (c1,c2,) {
enter_rule ("string_innard_solidus");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_solidus");
},
string_innard_reverseSolidus : function (c1,c2,) {
enter_rule ("string_innard_reverseSolidus");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_reverseSolidus");
},
string_innard_backSpace : function (c1,c2,) {
enter_rule ("string_innard_backSpace");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_backSpace");
},
string_innard_formFeed : function (c1,c2,) {
enter_rule ("string_innard_formFeed");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_formFeed");
},
string_innard_lineFeed : function (c1,c2,) {
enter_rule ("string_innard_lineFeed");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_lineFeed");
},
string_innard_carriageReturn : function (c1,c2,) {
enter_rule ("string_innard_carriageReturn");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_carriageReturn");
},
string_innard_horizontalTab : function (c1,c2,) {
enter_rule ("string_innard_horizontalTab");
    set_return (`${c1.rwr ()}${c2.rwr ()}`);
return exit_rule ("string_innard_horizontalTab");
},
string_innard_fourHexDigits : function (_,cu,h1,h2,h3,h4,) {
enter_rule ("string_innard_fourHexDigits");
    set_return (`${_.rwr ()}${cu.rwr ()}${h1.rwr ()}${h2.rwr ()}${h3.rwr ()}${h4.rwr ()}`);
return exit_rule ("string_innard_fourHexDigits");
},
string_innard_other : function (c,) {
enter_rule ("string_innard_other");
    set_return (`${c.rwr ()}`);
return exit_rule ("string_innard_other");
},
hex : function (c,) {
enter_rule ("hex");
    set_return (`${c.rwr ()}`);
return exit_rule ("hex");
},
number_fractional : function (sign,zero,fraction,exponent,) {
enter_rule ("number_fractional");
    set_return (`${sign.rwr ().join ('')}${zero.rwr ()}${fraction.rwr ().join ('')}${exponent.rwr ().join ('')}`);
return exit_rule ("number_fractional");
},
number_number : function (sign,d,ds,fraction,exponent,) {
enter_rule ("number_number");
    set_return (`${sign.rwr ().join ('')}${d.rwr ()}${ds.rwr ().join ('')}${fraction.rwr ().join ('')}${exponent.rwr ().join ('')}`);
return exit_rule ("number_number");
},
fraction : function (dot,ds,) {
enter_rule ("fraction");
    set_return (`${dot.rwr ()}${ds.rwr ().join ('')}`);
return exit_rule ("fraction");
},
exponent : function (e,sign,ds,) {
enter_rule ("exponent");
    set_return (`${e.rwr ()}${sign.rwr ().join ('')}${ds.rwr ().join ('')}`);
return exit_rule ("exponent");
},
ws : function (c,) {
enter_rule ("ws");
    set_return (`${c.rwr ().join ('')}`);
return exit_rule ("ws");
},
_terminal: function () { return this.sourceString; },
_iter: function (...children) { return children.map(c => c.rwr ()); }
}
