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
rt {

  Main = TopLevel+
  TopLevel =
    | Defvar -- defvar
    | Defconst -- defconst
    | Defn -- defn
    | Defobj -- defobj
    | Import -- import
    | comment -- comment

   Defvar = kw<"defvar"> Lval "⇐" Exp
   Defconst = kw<"defconst"> Lval "≡" Exp
   Defn = kw<"defn"> ident Formals StatementBlock
   Defobj = kw<"defobj"> ident ObjFormals "{" InitStatement+ "}"
   Import = kw<"import"> ident

   StatementBlock = "{" Rec_Statement "}"

   Rec_Statement =
     | comment Rec_Statement? -- comment
     | Macro -- macro
     | Deftemp -- deftemp
     | Defsynonym -- defsynonym     
     | kw<"global"> ident CommaIdent* Rec_Statement? -- globals
     | IfStatement  -- if
     | kw<"pass"> Rec_Statement? -- pass
     | kw<"return"> ReturnExp -- return
     | ForStatement -- for
     | WhileStatement  -- while
     | Assignment -- assignment
     | Lval Rec_Statement? -- call
   CommaIdent = "," ident

   Macro =
     | "#" "❲low_level_read_text_file_handler❳" "(" eh "," msg "," fname "," ok "," err ")" -- read
     | "#" "❲read_and_convert_json_file❳" "(" fname ")" -- racjf

   Deftemp = kw<"deftemp"> Lval "⇐" Exp Rec_Statement?
   Defsynonym = Lval "≡" Exp Rec_Statement?

   InitStatement = "•" ident "⇐" Exp comment?

   IfStatement = kw<"if"> Exp StatementBlock ElifStatement* ElseStatement? Rec_Statement?
   ElifStatement = kw<"elif"> Exp StatementBlock
   ElseStatement = kw<"else"> StatementBlock

   ForStatement = kw<"for"> ident kw<"in"> Exp StatementBlock Rec_Statement?
   WhileStatement = kw<"while"> Exp StatementBlock Rec_Statement?

   Assignment = 
     | "[" Lval CommaLval+ "]" "⇐" Exp Rec_Statement? -- multiple
     | Lval "⇐" Exp Rec_Statement? -- single

   CommaLval = "," Lval

    ReturnExp =
      | "[" Exp CommaExp+ "]" Rec_Statement? -- multiple
      | Exp Rec_Statement? -- single

    CommaExp = "," Exp
    
    Exp =  BooleanExp

    BooleanExp =
      | BooleanExp boolNeq BooleanNot -- boolopneq
      | BooleanExp boolOp BooleanNot -- boolop
      | BooleanNot -- basic

    BooleanNot =
      | kw<"not"> BooleanExp -- not
      | AddExp -- basic

    AddExp =
      | AddExp "+" MulExp  -- plus
      | AddExp "-" MulExp  -- minus
      | MulExp -- basic

    MulExp =
      | MulExp "*" ExpExp  -- times
      | MulExp "/" ExpExp  -- divide
      | ExpExp -- basic

    ExpExp =
      | Primary "^" ExpExp  -- power
      | Primary -- basic

    Primary =
      | Primary "@" ident -- lookupident
      | Primary "@" Primary -- lookup
      | Primary "." ident -- field
      | Primary "[" Exp "]" -- index
      | Primary "[" digit+ ":" "]" -- nthslice
      | ident Actuals -- identcall
      | Primary Actuals -- call
      | Atom -- atom

    Atom =
      | "[" "]" -- emptylistconst
      | "{" "}" -- emptydict
      | "(" Exp ")" -- paren
      | "[" PrimaryComma+ "]" -- listconst
      | "{" PairComma+ "}" -- dict
      | lambda LambdaFormals? ":" Exp -- lambda
      | kw<"fresh"> "(" ident ")" -- fresh
      | kw<"car"> "(" Exp ")" -- car
      | kw<"cdr"> "(" Exp ")" -- cdr
      | kw<"argvcdr"> "(" digit ")" -- nthargvcdr
      | kw<"nthargv"> "(" digit ")" -- nthargv
      | kw<"stringcdr"> "(" Exp ")" -- stringcdr
      | kw<"strcons"> "(" Exp "," Exp ")" -- strcons
      | "+" Primary -- pos
      | "-" Primary -- neg
      | phi -- phi
      | "⊤" -- true
      | "⊥" -- false
      | kw<"range"> "(" Exp ")" -- range
      | string -- string
      | number -- number
      | ident -- ident



    PrimaryComma = Primary ","?
    PairComma = Pair ","?
    
    Lval = Exp

    Formals =
      | "(" ")" -- noformals
      | "(" Formal CommaFormal* ")" -- withformals
    ObjFormals =
      | "(" ")" -- noformals
      | "(" Formal CommaFormal* ")" -- withformals
    LambdaFormals =
      | "(" ")" -- noformals
      | "(" Formal CommaFormal* ")" -- withformals

    Formal = 
       | ident "∷" Exp -- defaultvalue
       | ident -- plain
       
    CommaFormal = "," Formal
    
    Actuals = 
      | "(" ")" -- noactuals
      | "(" Actual CommaActual* ")" -- actuals

   Actual = ParamName? Exp
   CommaActual = "," Actual

   ParamName = ident "∷"

    number =
      | digit* "." digit+  -- fract
      | digit+             -- whole

    Pair = string ":" Exp ","?
  

  boolOp = (boolEq | boolNeq | "<=" | ">=" | ">" | "<" | kw<"and"> | kw<"or"> | kw<"in">)
  boolEq = "="
  boolNeq = "!="

  string = "“" stringchar* "”"
  stringchar = 
    | "“" stringchar* "”" -- rec
    | ~"“" ~"”" any -- other

    keyword = (
        kw<"fresh">
      | kw<"defconst">
      | kw<"deftemp">
      | kw<"defobj">
      | kw<"defvar">
      | kw<"defn">
      | kw<"useglobal">
      | kw<"pass">
      | kw<"return">
      | kw<"if">
      | kw<"elif">
      | kw<"else">
      | kw<"and">
      | kw<"or">
      | kw<"in">
      | kw<"not">
      | kw<"range">
      | kw<"while">
      | kw<"import">
      | kw<"as">
      | kw<"car">
      | kw<"cdr">
      | kw<"stringcdr">
      | kw<"argvcdr">
      | kw<"nthargv">
      | kw<"strcons">
      | lambda
      | phi
      )
      
  lambda = "λ" | kw<"λ">
  phi = "ϕ" | kw<"ϕ">

  kw<s> = "❲" s "❳"
  ident  = ~keyword "❲" idchar+ "❳"
  idchar =
    | "❲" idchar+ "❳" -- rec
    | ~"❲" ~"❳" any -- other

  comment = "⌈" commentchar* "⌉"
  commentchar = 
    | "⌈" commentchar* "⌉" -- rec
    | ~"⌈" ~"⌉" any -- other

  eh = ident
  fname = ident
  msg = ident
  ok = port
  err = port
  port = string
  
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
    let rs = s.replace (/"/g, '"').replace (/'/g, ';');
    return rs;
}


let parameters = {};
function pushParameter (name, v) {
    parameters [name].push (v);
}
function popParameter (name) {
    parameters [name].pop ();
}
function getParameter (name) {
    return parameters [name];
}

parameters ["functionName"] = [];
parameters ["freshdict"] = [];

let _rewrite = {

Main : function (TopLevel,) {
enter_rule ("Main");
    set_return (`${TopLevel.rwr ().join ('')}`);
return exit_rule ("Main");
},
TopLevel_defvar : function (Defvar,) {
enter_rule ("TopLevel_defvar");
    set_return (`${Defvar.rwr ()}`);
return exit_rule ("TopLevel_defvar");
},
TopLevel_defconst : function (Defconst,) {
enter_rule ("TopLevel_defconst");
    set_return (`${Defconst.rwr ()}`);
return exit_rule ("TopLevel_defconst");
},
TopLevel_defn : function (Defn,) {
enter_rule ("TopLevel_defn");
    set_return (`${Defn.rwr ()}`);
return exit_rule ("TopLevel_defn");
},
TopLevel_defobj : function (Defobj,) {
enter_rule ("TopLevel_defobj");
    set_return (`${Defobj.rwr ()}`);
return exit_rule ("TopLevel_defobj");
},
TopLevel_import : function (Import,) {
enter_rule ("TopLevel_import");
    set_return (`${Import.rwr ()}`);
return exit_rule ("TopLevel_import");
},
TopLevel_comment : function (s,) {
enter_rule ("TopLevel_comment");
    set_return (`${s.rwr ()}`);
return exit_rule ("TopLevel_comment");
},
kw : function (s,) {
enter_rule ("kw");
    set_return (`${s.rwr ()}`);
return exit_rule ("kw");
},
Defvar : function (__,lval,_eq,e,) {
enter_rule ("Defvar");
    set_return (`\n(defparameter ${lval.rwr ()} ${e.rwr ()})`);
return exit_rule ("Defvar");
},
Defconst : function (__,lval,_eq,e,) {
enter_rule ("Defconst");
    set_return (`\n(defparameter ${lval.rwr ()} ${e.rwr ()})`);
return exit_rule ("Defconst");
},
Defn : function (_4,ident,Formals,StatementBlock,) {
enter_rule ("Defn");
    pushParameter ("functionName", `${ident.rwr ()}`);
    set_return (`\n(defun ${ident.rwr ()} (${Formals.rwr ()})${StatementBlock.rwr ()})`);
popParameter ("functionName");
return exit_rule ("Defn");
},
Defobj : function (_defobj,ident,Formals,lb,init,rb,) {
enter_rule ("Defobj");
    set_return (`\n(defun ${ident.rwr ()} (${Formals.rwr ()})⤷\n(list⤷${init.rwr ().join ('')}⤶⤶))\n`);
return exit_rule ("Defobj");
},
Import : function (_10,ident,) {
enter_rule ("Import");
    set_return (``);
return exit_rule ("Import");
},
StatementBlock : function (_11,Statement,_12,) {
enter_rule ("StatementBlock");
    set_return (`⤷${Statement.rwr ()}⤶`);
return exit_rule ("StatementBlock");
},
Rec_Statement_globals : function (_24,ident1,cidents,scope,) {
enter_rule ("Rec_Statement_globals");
    set_return (`${scope.rwr ().join ('')}`);
return exit_rule ("Rec_Statement_globals");
},
CommaIdent : function (_comma,ident,) {
enter_rule ("CommaIdent");
    set_return (` ${ident.rwr ()}`);
return exit_rule ("CommaIdent");
},
Rec_Statement_comment : function (s,rec,) {
enter_rule ("Rec_Statement_comment");
    set_return (`\n${s.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("Rec_Statement_comment");
},
Rec_Statement_if : function (IfStatement,) {
enter_rule ("Rec_Statement_if");
    set_return (`${IfStatement.rwr ()}`);
return exit_rule ("Rec_Statement_if");
},
Rec_Statement_pass : function (_27,scope,) {
enter_rule ("Rec_Statement_pass");
    set_return (`\n#| pass |#${scope.rwr ().join ('')}`);
return exit_rule ("Rec_Statement_pass");
},
Rec_Statement_return : function (_29,ReturnExp,) {
enter_rule ("Rec_Statement_return");
    set_return (`\n(return-from ${getParameter ("functionName")} ${ReturnExp.rwr ()})`);
return exit_rule ("Rec_Statement_return");
},
Rec_Statement_for : function (ForStatement,) {
enter_rule ("Rec_Statement_for");
    set_return (`${ForStatement.rwr ()}`);
return exit_rule ("Rec_Statement_for");
},
Rec_Statement_while : function (WhileStatement,) {
enter_rule ("Rec_Statement_while");
    set_return (`${WhileStatement.rwr ()}`);
return exit_rule ("Rec_Statement_while");
},
Rec_Statement_assignment : function (Assignment,) {
enter_rule ("Rec_Statement_assignment");
    set_return (`${Assignment.rwr ()}`);
return exit_rule ("Rec_Statement_assignment");
},
Rec_Statement_call : function (Lval,scope,) {
enter_rule ("Rec_Statement_call");
    set_return (`\n(${Lval.rwr ()} ${scope.rwr ().join ('')})`);
return exit_rule ("Rec_Statement_call");
},
Macro_read : function (_octothorpe,_read,lp,eh,_comma1,msg,_comma2,fname,_comma3,ok,_comma4,err,rp,) {
enter_rule ("Macro_read");
    set_return (`
;; read text from a named file ${fname.rwr ()}, send the text out on port ${ok.rwr ()} else send error info on port ${err.rwr ()}
;; given ${eh.rwr ()} and ${msg.rwr ()} if needed
(handler-bind ((error #'(lambda (condition) (send_string ${eh.rwr ()} ${err.rwr ()} (format nil "~&~A~&" condition)))))⤷
  (with-open-file (stream ${fname.rwr ()})⤷
    (let ((contents (make-string (file-length stream))))⤷
      (read-sequence contents stream)
      (send_string ${eh.rwr ()} ${ok.rwr ()} contents))))⤶⤶⤶
`);
return exit_rule ("Macro_read");
},
Macro_racjf : function (_octothorpe,_racjf,lp,fname,rp,) {
enter_rule ("Macro_racjf");
    set_return (`
  ;; read json from a named file and convert it into internal form (a tree of routings)
  ;; return the routings from the function or print an error message and return nil
(handler-bind ((error #'(lambda (condition) nil)))⤷
  (with-open-file (json-stream "~/projects/rtlarson/eyeballs.json" :direction :input)⤷
    (json:decode-json json-stream)))⤶⤶
`);
return exit_rule ("Macro_racjf");
},
Deftemp : function (_deftemp,lval,_mutate,e,rec,) {
enter_rule ("Deftemp");
    set_return (`\n(let ((${lval.rwr ()} ${e.rwr ()}))⤷${rec.rwr ().join ('')}⤶)`);
return exit_rule ("Deftemp");
},
Defsynonym : function (lval,_eqv,e,rec,) {
enter_rule ("Defsynonym");
    set_return (`\n(let ((${lval.rwr ()} ${e.rwr ()}))⤷${rec.rwr ().join ('')}⤶)`);
return exit_rule ("Defsynonym");
},
InitStatement : function (_mark,ident,_33,Exp,cmt,) {
enter_rule ("InitStatement");
    set_return (`\n(cons '${ident.rwr ()} ${Exp.rwr ()}) ${cmt.rwr ().join ('')}`);
return exit_rule ("InitStatement");
},
IfStatement : function (_35,Exp,StatementBlock,ElifStatement,ElseStatement,rec,) {
enter_rule ("IfStatement");
    set_return (`\n(cond ⤷\n(${Exp.rwr ()}⤷${StatementBlock.rwr ()}⤶)${ElifStatement.rwr ().join ('')}${ElseStatement.rwr ().join ('')}⤶)${rec.rwr ().join ('')}`);
return exit_rule ("IfStatement");
},
ElifStatement : function (_37,Exp,StatementBlock,) {
enter_rule ("ElifStatement");
    set_return (`\n(${Exp.rwr ()}⤷${StatementBlock.rwr ()}⤶)`);
return exit_rule ("ElifStatement");
},
ElseStatement : function (_39,StatementBlock,) {
enter_rule ("ElseStatement");
    set_return (`\n(t⤷${StatementBlock.rwr ()}⤶)`);
return exit_rule ("ElseStatement");
},
ForStatement : function (_41,ident,_43,Exp,StatementBlock,rec,) {
enter_rule ("ForStatement");
    set_return (`\n(loop for ${ident.rwr ()} in ${Exp.rwr ()}⤷\ndo${StatementBlock.rwr ()}⤶)${rec.rwr ().join ('')}`);
return exit_rule ("ForStatement");
},
WhileStatement : function (_45,Exp,StatementBlock,rec,) {
enter_rule ("WhileStatement");
    set_return (`\n(loop while ${Exp.rwr ()}⤷\ndo${StatementBlock.rwr ()}⤶)${rec.rwr ().join ('')}`);
return exit_rule ("WhileStatement");
},
Assignment_multiple : function (_55,Lval1,Lval2,_57,_58,Exp,rec,) {
enter_rule ("Assignment_multiple");
    set_return (`\n(multiple-value-setq (${Lval1.rwr ()}${Lval2.rwr ().join ('')}) ${Exp.rwr ()})${rec.rwr ().join ('')}`);
return exit_rule ("Assignment_multiple");
},
Assignment_single : function (Lval,_59,Exp,rec,) {
enter_rule ("Assignment_single");
    set_return (`\n(setf ${Lval.rwr ()} ${Exp.rwr ()})${rec.rwr ().join ('')}`);
return exit_rule ("Assignment_single");
},
CommaLval : function (_comma,Lval,) {
enter_rule ("CommaLval");
    set_return (` ${Lval.rwr ()}`);
return exit_rule ("CommaLval");
},
ReturnExp_multiple : function (_60,Exp1,Exp2,_62,rec,) {
enter_rule ("ReturnExp_multiple");
    set_return (`(values ${Exp1.rwr ()} ${Exp2.rwr ().join ('')})${rec.rwr ().join ('')}`);
return exit_rule ("ReturnExp_multiple");
},
ReturnExp_single : function (Exp,rec,) {
enter_rule ("ReturnExp_single");
    set_return (`${Exp.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("ReturnExp_single");
},
CommaExp : function (_comma,e,) {
enter_rule ("CommaExp");
    set_return (` ${e.rwr ()}`);
return exit_rule ("CommaExp");
},
Exp : function (BooleanExp,) {
enter_rule ("Exp");
    set_return (`${BooleanExp.rwr ()}`);
return exit_rule ("Exp");
},
BooleanExp_boolopneq : function (BooleanExp,boolOp,BooleanNot,) {
enter_rule ("BooleanExp_boolopneq");
    set_return (`(not (${boolOp.rwr ()} ${BooleanExp.rwr ()} ${BooleanNot.rwr ()}))`);
return exit_rule ("BooleanExp_boolopneq");
},
BooleanExp_boolop : function (BooleanExp,boolOp,BooleanNot,) {
enter_rule ("BooleanExp_boolop");
    set_return (`(${boolOp.rwr ()} ${BooleanExp.rwr ()} ${BooleanNot.rwr ()})`);
return exit_rule ("BooleanExp_boolop");
},
BooleanExp_basic : function (BooleanNot,) {
enter_rule ("BooleanExp_basic");
    set_return (`${BooleanNot.rwr ()}`);
return exit_rule ("BooleanExp_basic");
},
BooleanNot_not : function (_64,BooleanExp,) {
enter_rule ("BooleanNot_not");
    set_return (`(not ${BooleanExp.rwr ()})`);
return exit_rule ("BooleanNot_not");
},
BooleanNot_basic : function (AddExp,) {
enter_rule ("BooleanNot_basic");
    set_return (`${AddExp.rwr ()}`);
return exit_rule ("BooleanNot_basic");
},
AddExp_plus : function (AddExp,_65,MulExp,) {
enter_rule ("AddExp_plus");
    set_return (`(+ ${AddExp.rwr ()} ${MulExp.rwr ()})`);
return exit_rule ("AddExp_plus");
},
AddExp_minus : function (AddExp,_66,MulExp,) {
enter_rule ("AddExp_minus");
    set_return (`(- ${AddExp.rwr ()} ${MulExp.rwr ()})`);
return exit_rule ("AddExp_minus");
},
AddExp_basic : function (MulExp,) {
enter_rule ("AddExp_basic");
    set_return (`${MulExp.rwr ()}`);
return exit_rule ("AddExp_basic");
},
MulExp_times : function (MulExp,_67,ExpExp,) {
enter_rule ("MulExp_times");
    set_return (`(* ${MulExp.rwr ()} ${ExpExp.rwr ()})`);
return exit_rule ("MulExp_times");
},
MulExp_divide : function (MulExp,_68,ExpExp,) {
enter_rule ("MulExp_divide");
    set_return (`(/ ${MulExp.rwr ()} ${ExpExp.rwr ()})`);
return exit_rule ("MulExp_divide");
},
MulExp_basic : function (ExpExp,) {
enter_rule ("MulExp_basic");
    set_return (`${ExpExp.rwr ()}`);
return exit_rule ("MulExp_basic");
},
ExpExp_power : function (Primary,_69,ExpExp,) {
enter_rule ("ExpExp_power");
    set_return (`(expt ${Primary.rwr ()} ${ExpExp.rwr ()})`);
return exit_rule ("ExpExp_power");
},
ExpExp_basic : function (Primary,) {
enter_rule ("ExpExp_basic");
    set_return (`${Primary.rwr ()}`);
return exit_rule ("ExpExp_basic");
},
Primary_lookupident : function (p,_at,key,) {
enter_rule ("Primary_lookupident");
    set_return (`(assoc '${key.rwr ()} ${p.rwr ()})`);
return exit_rule ("Primary_lookupident");
},
Primary_lookup : function (p,_at,key,) {
enter_rule ("Primary_lookup");
    set_return (`(assoc ${key.rwr ()} ${p.rwr ()})`);
return exit_rule ("Primary_lookup");
},
Primary_field : function (p,_dot,key,) {
enter_rule ("Primary_field");
    set_return (`(assoc '${key.rwr ()} ${p.rwr ()})`);
return exit_rule ("Primary_field");
},
Primary_index : function (p,lb,e,rb,) {
enter_rule ("Primary_index");
    set_return (`(nth ${e.rwr ()} ${p.rwr ()})`);
return exit_rule ("Primary_index");
},
Primary_nthslice : function (p,lb,ds,_colon,rb,) {
enter_rule ("Primary_nthslice");
    set_return (`(nthcdr ${ds.rwr ().join ('')} ${p.rwr ()})`);
return exit_rule ("Primary_nthslice");
},
Primary_identcall : function (id,actuals,) {
enter_rule ("Primary_identcall");
    set_return (`(${id.rwr ()} ${actuals.rwr ()})`);
return exit_rule ("Primary_identcall");
},
Primary_call : function (p,actuals,) {
enter_rule ("Primary_call");
    set_return (`(${p.rwr ()} ${actuals.rwr ()})`);
return exit_rule ("Primary_call");
},
Primary_atom : function (a,) {
enter_rule ("Primary_atom");
    set_return (`${a.rwr ()}`);
return exit_rule ("Primary_atom");
},
Atom_emptylistconst : function (_72,_73,) {
enter_rule ("Atom_emptylistconst");
    set_return (`nil`);
return exit_rule ("Atom_emptylistconst");
},
Atom_emptydict : function (_76,_77,) {
enter_rule ("Atom_emptydict");
    set_return (`bil`);
return exit_rule ("Atom_emptydict");
},
Atom_paren : function (_70,Exp,_71,) {
enter_rule ("Atom_paren");
    set_return (`${Exp.rwr ()}`);
return exit_rule ("Atom_paren");
},
Atom_listconst : function (_74,PrimaryComma,_75,) {
enter_rule ("Atom_listconst");
    set_return (`(list ${PrimaryComma.rwr ().join ('')})`);
return exit_rule ("Atom_listconst");
},
Atom_dict : function (_78,PairComma,_79,) {
enter_rule ("Atom_dict");
    pushParameter ("freshdict", `_dict`);
    set_return (`(let ((_dict (make-hash-table :test 'equal))⤷${PairComma.rwr ().join ('')}\n_dict⤶)`);
popParameter ("freshdict");
return exit_rule ("Atom_dict");
},
Atom_lambda : function (_80,Formals,_81,Exp,) {
enter_rule ("Atom_lambda");
    set_return (` #'(lambda (${Formals.rwr ().join ('')}) ${Exp.rwr ()})`);
return exit_rule ("Atom_lambda");
},
Atom_fresh : function (_83,_84,ident,_85,) {
enter_rule ("Atom_fresh");
    set_return (` (${ident.rwr ()})`);
return exit_rule ("Atom_fresh");
},
Atom_car : function (_83,_84,e,_85,) {
enter_rule ("Atom_car");
    set_return (` (car ${e.rwr ()})`);
return exit_rule ("Atom_car");
},
Atom_cdr : function (_83,_84,e,_85,) {
enter_rule ("Atom_cdr");
    set_return (` (cdr ${e.rwr ()})`);
return exit_rule ("Atom_cdr");
},
Atom_nthargvcdr : function (_83,lb,n,rb,) {
enter_rule ("Atom_nthargvcdr");
    set_return (` (nthcdr ${n.rwr ()} (argv))`);
return exit_rule ("Atom_nthargvcdr");
},
Atom_nthargv : function (_83,_84,n,_85,) {
enter_rule ("Atom_nthargv");
    set_return (` (nth ${n.rwr ()} (argv))`);
return exit_rule ("Atom_nthargv");
},
Atom_stringcdr : function (_83,_84,e,_85,) {
enter_rule ("Atom_stringcdr");
    set_return (` (subseq ${e.rwr ()} 1)`);
return exit_rule ("Atom_stringcdr");
},
Atom_strcons : function (_strcons,lp,e1,_comma,e2,rp,) {
enter_rule ("Atom_strcons");
    set_return (` (concatenate 'string ${e1.rwr ()} ${e2.rwr ()})`);
return exit_rule ("Atom_strcons");
},
Atom_pos : function (_86,Primary,) {
enter_rule ("Atom_pos");
    set_return (` +${Primary.rwr ()}`);
return exit_rule ("Atom_pos");
},
Atom_neg : function (_87,Primary,) {
enter_rule ("Atom_neg");
    set_return (` -${Primary.rwr ()}`);
return exit_rule ("Atom_neg");
},
Atom_phi : function (phi,) {
enter_rule ("Atom_phi");
    set_return (` nil`);
return exit_rule ("Atom_phi");
},
Atom_true : function (_88,) {
enter_rule ("Atom_true");
    set_return (` t`);
return exit_rule ("Atom_true");
},
Atom_false : function (_89,) {
enter_rule ("Atom_false");
    set_return (` nil`);
return exit_rule ("Atom_false");
},
Atom_range : function (_range,lb,Exp,rb,) {
enter_rule ("Atom_range");
    set_return (`(loop for n from 0 below ${Exp.rwr ()} by 1 collect n)`);
return exit_rule ("Atom_range");
},
Atom_string : function (string,) {
enter_rule ("Atom_string");
    set_return (` ${string.rwr ()}`);
return exit_rule ("Atom_string");
},
Atom_number : function (number,) {
enter_rule ("Atom_number");
    set_return (` ${number.rwr ()}`);
return exit_rule ("Atom_number");
},
Atom_ident : function (ident,) {
enter_rule ("Atom_ident");
    set_return (` ${ident.rwr ()}`);
return exit_rule ("Atom_ident");
},
PrimaryComma : function (Primary,_94,) {
enter_rule ("PrimaryComma");
    set_return (`${Primary.rwr ()} `);
return exit_rule ("PrimaryComma");
},
PairComma : function (Pair,_95,) {
enter_rule ("PairComma");
    set_return (`${Pair.rwr ()} `);
return exit_rule ("PairComma");
},
Lval : function (Exp,) {
enter_rule ("Lval");
    set_return (`${Exp.rwr ()}`);
return exit_rule ("Lval");
},
keyword : function (_144,) {
enter_rule ("keyword");
    set_return (`${_144.rwr ()}`);
return exit_rule ("keyword");
},
Formals_noformals : function (_148,_149,) {
enter_rule ("Formals_noformals");
    set_return (``);
return exit_rule ("Formals_noformals");
},
Formals_withformals : function (_150,Formal,CommaFormal,_151,) {
enter_rule ("Formals_withformals");
    set_return (` ${Formal.rwr ()}${CommaFormal.rwr ().join ('')}`);
return exit_rule ("Formals_withformals");
},
ObjFormals_noformals : function (_148,_149,) {
enter_rule ("ObjFormals_noformals");
    set_return (``);
return exit_rule ("ObjFormals_noformals");
},
ObjFormals_withformals : function (_150,Formal,CommaFormal,_151,) {
enter_rule ("ObjFormals_withformals");
    set_return (` ${Formal.rwr ()}${CommaFormal.rwr ().join ('')}`);
return exit_rule ("ObjFormals_withformals");
},
LambdaFormals_noformals : function (_148,_149,) {
enter_rule ("LambdaFormals_noformals");
    set_return (``);
return exit_rule ("LambdaFormals_noformals");
},
LambdaFormals_withformals : function (_150,Formal,CommaFormal,_151,) {
enter_rule ("LambdaFormals_withformals");
    set_return (`${Formal.rwr ()}${CommaFormal.rwr ().join ('')}`);
return exit_rule ("LambdaFormals_withformals");
},
Formal_defaultvalue : function (ident,_152,Exp,) {
enter_rule ("Formal_defaultvalue");
    set_return (`(${ident.rwr ()} ${Exp.rwr ()})`);
return exit_rule ("Formal_defaultvalue");
},
Formal_plain : function (ident,) {
enter_rule ("Formal_plain");
    set_return (`${ident.rwr ()}`);
return exit_rule ("Formal_plain");
},
CommaFormal : function (_153,Formal,) {
enter_rule ("CommaFormal");
    set_return (` ${Formal.rwr ()}`);
return exit_rule ("CommaFormal");
},
Actuals_noactuals : function (_154,_155,) {
enter_rule ("Actuals_noactuals");
    set_return (``);
return exit_rule ("Actuals_noactuals");
},
Actuals_actuals : function (_156,Actual,CommaActual,_157,) {
enter_rule ("Actuals_actuals");
    set_return (` ${Actual.rwr ()}${CommaActual.rwr ().join ('')}`);
return exit_rule ("Actuals_actuals");
},
Actual : function (ParamName,Exp,) {
enter_rule ("Actual");
    set_return (`${ParamName.rwr ().join ('')}${Exp.rwr ()}`);
return exit_rule ("Actual");
},
CommaActual : function (_158,Actual,) {
enter_rule ("CommaActual");
    set_return (` ${Actual.rwr ()}`);
return exit_rule ("CommaActual");
},
ParamName : function (ident,_159,) {
enter_rule ("ParamName");
    set_return (`:${ident.rwr ()} `);
return exit_rule ("ParamName");
},
number_fract : function (num,_dot,den,) {
enter_rule ("number_fract");
    set_return (`${num.rwr ().join ('')}.${den.rwr ().join ('')}`);
return exit_rule ("number_fract");
},
number_whole : function (digit,) {
enter_rule ("number_whole");
    set_return (`${digit.rwr ().join ('')}`);
return exit_rule ("number_whole");
},
Pair : function (string,_161,Exp,_162,) {
enter_rule ("Pair");
    set_return (`\n(setf (gethash ${string.rwr ()} ${getParameter ("freshdict")}) ${Exp.rwr ()})`);
return exit_rule ("Pair");
},
boolOp : function (_191,) {
enter_rule ("boolOp");
    set_return (` ${_191.rwr ()} `);
return exit_rule ("boolOp");
},
boolEq : function (op,) {
enter_rule ("boolEq");
    set_return (`= `);
return exit_rule ("boolEq");
},
boolNeq : function (op,) {
enter_rule ("boolNeq");
    set_return (`??? `);
return exit_rule ("boolNeq");
},
phi : function (_192,) {
enter_rule ("phi");
    set_return (` nil`);
return exit_rule ("phi");
},
string : function (lb,cs,rb,) {
enter_rule ("string");
    set_return (`${lb.rwr ()}${cs.rwr ().join ('')}${rb.rwr ()}`);
return exit_rule ("string");
},
stringchar_rec : function (lb,cs,rb,) {
enter_rule ("stringchar_rec");
    set_return (`${lb.rwr ()}${cs.rwr ().join ('')}${rb.rwr ()}`);
return exit_rule ("stringchar_rec");
},
stringchar_other : function (c,) {
enter_rule ("stringchar_other");
    set_return (`${c.rwr ()}`);
return exit_rule ("stringchar_other");
},
kw : function (lb,s,rb,) {
enter_rule ("kw");
    set_return (`${lb.rwr ()}${s.rwr ()}${rb.rwr ()}`);
return exit_rule ("kw");
},
ident : function (lb,cs,rb,) {
enter_rule ("ident");
    set_return (`${lb.rwr ()}${cs.rwr ().join ('')}${rb.rwr ()}`);
return exit_rule ("ident");
},
idchar_rec : function (lb,cs,rb,) {
enter_rule ("idchar_rec");
    set_return (`${lb.rwr ()}${cs.rwr ().join ('')}${rb.rwr ()}`);
return exit_rule ("idchar_rec");
},
idchar_other : function (c,) {
enter_rule ("idchar_other");
    set_return (`${c.rwr ()}`);
return exit_rule ("idchar_other");
},
comment : function (lb,cs,rb,) {
enter_rule ("comment");
    set_return (`${lb.rwr ()}${cs.rwr ().join ('')}${rb.rwr ()}`);
return exit_rule ("comment");
},
commentchar_rec : function (lb,cs,rb,) {
enter_rule ("commentchar_rec");
    set_return (`${lb.rwr ()}${cs.rwr ().join ('')}${rb.rwr ()}`);
return exit_rule ("commentchar_rec");
},
commentchar_other : function (c,) {
enter_rule ("commentchar_other");
    set_return (`${c.rwr ()}`);
return exit_rule ("commentchar_other");
},
eh : function (id,) {
enter_rule ("eh");
    set_return (`${id.rwr ()}`);
return exit_rule ("eh");
},
fname : function (id,) {
enter_rule ("fname");
    set_return (`${id.rwr ()}`);
return exit_rule ("fname");
},
msg : function (id,) {
enter_rule ("msg");
    set_return (`${id.rwr ()}`);
return exit_rule ("msg");
},
ok : function (p,) {
enter_rule ("ok");
    set_return (`${p.rwr ()}`);
return exit_rule ("ok");
},
err : function (p,) {
enter_rule ("err");
    set_return (`${p.rwr ()}`);
return exit_rule ("err");
},
port : function (s,) {
enter_rule ("port");
    set_return (`${s.rwr ()}`);
return exit_rule ("port");
},
_terminal: function () { return this.sourceString; },
_iter: function (...children) { return children.map(c => c.rwr ()); }
}
import * as fs from 'fs';
const argv = process.argv.slice(2);
let srcFilename = argv[0];
if ('-' == srcFilename) { srcFilename = 0 }
let src = fs.readFileSync(srcFilename, 'utf-8');
let parser = ohm.grammar (grammar);
let cst = parser.match (src);
let sem = parser.createSemantics ();
sem.addOperation ('rwr', _rewrite);
console.log (sem (cst).rwr ());


