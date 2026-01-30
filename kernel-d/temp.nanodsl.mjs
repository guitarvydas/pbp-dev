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
emit {

  Main = ParaMark TopLevel+
  TopLevel =
    | Defvar -- defvar
    | Defconst -- defconst
    | Defn -- defn
    | Defobj -- defobj
    | Import -- import
    | External -- external
    | comment line? -- comment
    | line -- line

   Defvar = kw<"defvar"> Lval "⇐" Exp line?
   Defconst = kw<"defconst"> Lval "≡" Exp line?
   Defn = kw<"defn"> ident Formals StatementBlock line?
   Defobj = kw<"defobj"> ident ObjFormals line? "{" line? InitStatement+ "}" line?
   Import = kw<"import"> ident line?

   StatementBlock = line? "{" line? Rec_Statement line? "}" line?

   Rec_Statement = line? R_Statement line?
   R_Statement =
     | comment Rec_Statement? -- comment
     | External Rec_Statement? -- external
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
     | line Rec_Statement? -- line
   CommaIdent = Comma ident

   External = ExternalPhrase line?
   ExternalPhrase =
     | "#" xkw<"low_level_read_text_file_handler"> "(" eh Comma msg Comma fname Comma ok Comma err ")" -- read
     | "#" xkw<"read_and_convert_lnet_file"> "(" pathname Comma fname ")" -- raclnetf
     | "#" xkw<"internalize_lnet_from_string"> "(" ")" -- internalizeLnetFromString
     | "#" xkw<"freshQueue"> "(" ")" -- freshQueue
     | "#" xkw<"resetQueue"> "(" Exp ")" -- resetQueue
     | "#" xkw<"freshStack"> "(" ")" -- freshStack
     | "#" xkw<"fresh"> "(" ident ")" -- fresh
     | "#" xkw<"stringcar"> "(" Exp ")" -- stringcar
     | "#" xkw<"stringcdr"> "(" Exp ")" -- stringcdr
     | "#" xkw<"strcons"> "(" Exp Comma Exp ")" -- strcons
     | "#" xkw<"stringshrink"> "(" Exp ")" -- stringshrink
     | "#" xkw<"append"> "(" Exp Comma Exp ")" -- append
     | "#" xkw<"basename"> "(" Exp ")" -- basename
     | "#" xkw<"preamble"> "(" ")" -- preamble
     | "#" xkw<"print_stdout"> "(" Exp ")" -- print_stdout
     | "#" xkw<"print_stderr"> "(" Exp ")" -- print_stderr
     | "#" xkw<"print_nl"> "(" ")" -- print_nl
     | "#" xkw<"print_nl_stderr"> "(" ")" -- print_nl_stderr
     | "#" xkw<"display_queue_as_json"> "(" Exp ")" -- display_queue_as_json
     | "#" xkw<"substitute"> "(" Exp Comma Exp Comma Exp ")" -- substitute
     | "#" xkw<"run_command"> "(" Cmd Comma Args Comma ret Comma rc Comma stdout Comma stderr ")" -- run_command
     | "#" xkw<"abort"> "(" ")" -- abort
     | "#" xkw<"asstr"> "(" Exp ")" -- asstr
     | "#" xkw<"len"> "(" Exp ")" -- len
     | "#" xkw<"asint"> "(" Exp ")" -- asint
     | "#" xkw<"enqueue"> "(" Exp Comma Exp ")" -- enqueue
     | "#" xkw<"dequeue"> "(" Exp ")" -- dequeue
     | "#" xkw<"empty"> "(" Exp ")" -- empty
     | "#" xkw<"queue2list"> "(" Exp ")" -- queue2list
     | "#" xkw<"negate"> "(" Exp ")" -- negate
     | "#" xkw<"live_update"> "(" Exp Comma Exp ")" -- liveUpdate
     | "#" xkw<"queue_as_json_to_stdout"> "(" Exp ")" -- queueAsJsonToStdout
     | "#" xkw<"dir"> "(" Exp ")" -- dir
     | "#" xkw<"dispatch_lookup"> "(" Exp Comma Exp ")" -- dispatch_lookup
     | "#" xkw<"dispatch"> "(" Exp Comma Exp Comma Exp")" -- dispatch
     
     | "#" ident "(" StuffInsideParentheses* ")" -- unrecognized


   Cmd = Exp
   Args = Exp
   ret = ident
   rc = ident
   stdout = ident
   stderr = ident
   
   Deftemp = kw<"deftemp"> Lval "⇐" Exp Rec_Statement?
   Defsynonym =
     | Lval errorMessage "≡" Exp Rec_Statement? -- illegal
     | ident "≡" Exp Rec_Statement? -- legal

   InitStatement = "•" ident "⇐" Exp (comment | line)*

   IfStatement = kw<"if"> Exp StatementBlock ElifStatement* ElseStatement? Rec_Statement?
   ElifStatement = kw<"elif"> Exp StatementBlock
   ElseStatement = kw<"else"> StatementBlock

   ForStatement = kw<"for"> ident kw<"in"> Exp StatementBlock Rec_Statement?
   WhileStatement = kw<"while"> Exp StatementBlock Rec_Statement?

   Assignment = 
     | "[" LvalComma+ "]" "⇐" Exp Rec_Statement? -- multiple
     | Lval "⇐" Exp Rec_Statement? -- single

   LvalComma = Lval Comma?

    ReturnExp =
      | "[" ExpComma+ "]" Rec_Statement? -- multiple
      | Exp Rec_Statement? -- single

    ExpComma = Exp Comma?
    
    Exp =  BooleanAndOrIn

    BooleanAndOrIn =
      | BooleanAndOrIn andOrIn BooleanExp -- andOrIn
      | BooleanExp -- default
      
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
      | PrimaryIndexed Actuals -- call
      | PrimaryIndexed -- plain

    PrimaryIndexed =
      | PrimaryIndexed "@" ident -- lookupident
      | PrimaryIndexed "@" PrimaryIndexed -- lookup
      | PrimaryIndexed "." ident -- fieldident
      | PrimaryIndexed "." PrimaryIndexed -- field
      | PrimaryIndexed "[" Exp "]" -- index
      | PrimaryIndexed "[" digit+ ":" "]" -- nthslice
      | Atom -- atom

    Atom =
      | External -- external
      | "[" "]" -- emptylistconst
      | "{" "}" -- emptydict
      | "(" Exp ")" -- paren
      | "[" line? PrimaryComma+ line? "]" -- listconst
      | "{" line? PairComma+ line? "}" -- dict
      | lambda LambdaFormals? ":" Exp -- lambda
      | phi -- phi
      | "⊤" -- true
      | "⊥" -- false
      | "↪︎" ident -- subr
      | kw<"range"> "(" Exp ")" -- range
      | ident Actuals -- callident
      | string -- string
      | number -- number
      | ident -- ident



    PrimaryComma = Primary Comma? line?
    PairComma = Pair Comma?

    StuffInsideParentheses =
      | "(" StuffInsideParentheses* ")" -- rec
      | ~"(" ~")" any -- default
    
    Lval = Exp

    Formals =
      | "(" ")" -- noformals
      | "(" FormalComma* ")" -- withformals
    ObjFormals =
      | "(" ")" -- noformals
      | "(" FormalComma* ")" -- withformals
    LambdaFormals =
      | "(" ")" -- noformals
      | "(" FormalComma* ")" -- withformals

    Formal = 
       | ident -- plain
       
    FormalComma = Formal Comma?
    
    Actuals = 
      | "(" ")" -- noactuals
      | "(" ActualComma* ")" line? -- actuals

   Actual = Exp
   ActualComma = comment? Actual Comma? line?

    number =
      | digit* "." digit+  -- fract
      | digit+             -- whole

    Pair = string ":" Exp Comma?
  

  andOrIn =
    | kw<"and"> -- and
    | kw<"or"> -- or
    | kw<"in"> -- in

  boolOp = (boolEq | boolNeq | "<=" | ">=" | ">" | "<")
  boolEq = "="
  boolNeq = "!="

  string = "“" stringchar* "”"
  stringchar = 
    | "“" stringchar* "”" -- rec
    | ~"“" ~"”" any -- other

    keyword = (
        kw<"defconst">
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
      | kw<"pair">
      | kw<"push">
      | lambda
      | phi
      )
      
  lambda = ("λ" | kw<"%CE%BB">)
  phi = ("ϕ" | kw<"%CF%95">)

  kw<s> = "❲" s "❳"
  xkw<s> = "❲" s "❳"
  ident  = ~keyword "❲" idchar+ "❳"
  idchar =
    | "❲" idchar+ "❳" -- rec
    | ~"❲" ~"❳" any -- other

  comment = "⌈" commentchar* "⌉"
  commentchar = 
    | "⌈" commentchar* "⌉" -- rec
    | ~"⌈" ~"⌉" any -- other

  errorMessage = "⎝" errorchar* "⎠"
  errorchar =  
    | "⎝" errorchar* "⎠" -- rec
    | ~"⎝" ~"⎠" any -- other

  eh = ident
  fname = ident
  pathname = ident
  msg = ident
  ok = port
  err = port
  port = string
  Key = Exp
  Kvs = Exp

  line = "⎩" (~"⎩" ~"⎭" any)* "⎭"

  Comma = line? "," line?
  ParaMark = "¶"
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

Main : function (Para,TopLevel,) {
enter_rule ("Main");
    set_return (`${Para.rwr ()}${TopLevel.rwr ().join ('')}`);
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
TopLevel_comment : function (s,line,) {
enter_rule ("TopLevel_comment");
    set_return (`${s.rwr ()}${line.rwr ().join ('')}`);
return exit_rule ("TopLevel_comment");
},
TopLevel_line : function (line,) {
enter_rule ("TopLevel_line");
    set_return (`${line.rwr ()}`);
return exit_rule ("TopLevel_line");
},
kw : function (s,) {
enter_rule ("kw");
    set_return (`${s.rwr ()}`);
return exit_rule ("kw");
},
Defvar : function (__,lval,_eq,e,line,) {
enter_rule ("Defvar");
    set_return (`\n(defparameter ${lval.rwr ()} ${e.rwr ()})${line.rwr ().join ('')}`);
return exit_rule ("Defvar");
},
Defconst : function (__,lval,_eq,e,line,) {
enter_rule ("Defconst");
    set_return (`\n(defparameter ${lval.rwr ()} ${e.rwr ()})`);
return exit_rule ("Defconst");
},
Defn : function (_4,ident,Formals,StatementBlock,line,) {
enter_rule ("Defn");
    pushParameter ("functionName", `${ident.rwr ()}`);
    set_return (`\n(defun ${ident.rwr ()} (&optional ${Formals.rwr ()})⤷\n(declare (ignorable ${Formals.rwr ()}))${StatementBlock.rwr ()}⤶)`);
popParameter ("functionName");
return exit_rule ("Defn");
},
Defobj : function (_defobj,ident,Formals,line1,lb,line2,init,rb,line3,) {
enter_rule ("Defobj");
    set_return (`
(defclass ${ident.rwr ()} ()${line1.rwr ().join ('')}⤷${line2.rwr ().join ('')}
  (⤷${part (`${init.rwr ().join ('')}`,`0`,)}⤶⤶))${line3.rwr ().join ('')}\n
`);
return exit_rule ("Defobj");
},
Import : function (_10,ident,line,) {
enter_rule ("Import");
    set_return (``);
return exit_rule ("Import");
},
StatementBlock : function (line1,lb,line2,Statement,line3,rb,line4,) {
enter_rule ("StatementBlock");
    set_return (`${line1.rwr ().join ('')}${line2.rwr ().join ('')}${Statement.rwr ()}${line3.rwr ().join ('')}${line4.rwr ().join ('')}\n`);
return exit_rule ("StatementBlock");
},
Rec_Statement : function (line1,R_Statement,line2,) {
enter_rule ("Rec_Statement");
    set_return (`${line1.rwr ().join ('')}${R_Statement.rwr ()}${line2.rwr ().join ('')}`);
return exit_rule ("Rec_Statement");
},
R_Statement_globals : function (_24,ident1,cidents,scope,) {
enter_rule ("R_Statement_globals");
    set_return (`${scope.rwr ().join ('')}`);
return exit_rule ("R_Statement_globals");
},
R_Statement_comment : function (s,rec,) {
enter_rule ("R_Statement_comment");
    set_return (`\n${s.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("R_Statement_comment");
},
R_Statement_external : function (x,rec,) {
enter_rule ("R_Statement_external");
    set_return (`\n${x.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("R_Statement_external");
},
R_Statement_if : function (IfStatement,) {
enter_rule ("R_Statement_if");
    set_return (`${IfStatement.rwr ()}`);
return exit_rule ("R_Statement_if");
},
R_Statement_pass : function (_27,scope,) {
enter_rule ("R_Statement_pass");
    set_return (`\n#| pass |#${scope.rwr ().join ('')}`);
return exit_rule ("R_Statement_pass");
},
R_Statement_return : function (_29,ReturnExp,) {
enter_rule ("R_Statement_return");
    set_return (`\n(return-from ${getParameter ("functionName")} ⤷${ReturnExp.rwr ()}⤶)`);
return exit_rule ("R_Statement_return");
},
R_Statement_for : function (ForStatement,) {
enter_rule ("R_Statement_for");
    set_return (`${ForStatement.rwr ()}`);
return exit_rule ("R_Statement_for");
},
R_Statement_while : function (WhileStatement,) {
enter_rule ("R_Statement_while");
    set_return (`${WhileStatement.rwr ()}`);
return exit_rule ("R_Statement_while");
},
R_Statement_assignment : function (Assignment,) {
enter_rule ("R_Statement_assignment");
    set_return (`${Assignment.rwr ()}`);
return exit_rule ("R_Statement_assignment");
},
R_Statement_call : function (Lval,scope,) {
enter_rule ("R_Statement_call");
    set_return (`\n${Lval.rwr ()}${scope.rwr ().join ('')}`);
return exit_rule ("R_Statement_call");
},
R_Statement_line : function (line,rec,) {
enter_rule ("R_Statement_line");
    set_return (`${line.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("R_Statement_line");
},
CommaIdent : function (_comma,ident,) {
enter_rule ("CommaIdent");
    set_return (`, ${ident.rwr ()}`);
return exit_rule ("CommaIdent");
},
External : function (x,line,) {
enter_rule ("External");
    set_return (`${x.rwr ()}${line.rwr ().join ('')}`);
return exit_rule ("External");
},
ExternalPhrase_read : function (_octothorpe,_read,lp,eh,_comma1,msg,_comma2,fname,_comma3,ok,_comma4,err,rp,) {
enter_rule ("ExternalPhrase_read");
    set_return (`
;; read text from a named file ${fname.rwr ()}, send the text out on port ${ok.rwr ()} else send error info on port ${err.rwr ()}
;; given ${eh.rwr ()} and ${msg.rwr ()} if needed
(handler-bind ((error #'(lambda (condition) (send_string ${eh.rwr ()} ${err.rwr ()} (format nil "~&~A~&" condition)))))⤷
  (with-open-file (stream ${fname.rwr ()})⤷
    (let ((contents (make-string (file-length stream))))⤷
      (read-sequence contents stream)
      (send_string ${eh.rwr ()} ${ok.rwr ()} contents))))⤶⤶⤶
`);
return exit_rule ("ExternalPhrase_read");
},
ExternalPhrase_raclnetf : function (_octothorpe,_,lp,pathname,_comma,fname,rp,) {
enter_rule ("ExternalPhrase_raclnetf");
    set_return (`
  ;; read json from a named file and convert it into internal form (a list of Container alists)
  (json2dict (merge-pathnames ${pathname.rwr ()} ${fname.rwr ()}))
`);
return exit_rule ("ExternalPhrase_raclnetf");
},
ExternalPhrase_internalizeLnetFromString : function (_octothorpe,_,lp,rp,) {
enter_rule ("ExternalPhrase_internalizeLnetFromString");
    set_return (`
  (internalize-lnet-from-JSON *lnet*)
`);
return exit_rule ("ExternalPhrase_internalizeLnetFromString");
},
ExternalPhrase_freshQueue : function (_octothorpe,_83,_84,_85,) {
enter_rule ("ExternalPhrase_freshQueue");
    set_return (` (make-instance 'Queue)`);
return exit_rule ("ExternalPhrase_freshQueue");
},
ExternalPhrase_resetQueue : function (_octothorpe,_83,_84,e,_85,) {
enter_rule ("ExternalPhrase_resetQueue");
    set_return (`\n(setf ${e.rwr ()} (make-instance 'Queue))`);
return exit_rule ("ExternalPhrase_resetQueue");
},
ExternalPhrase_freshStack : function (_octothorpe,_83,_84,_85,) {
enter_rule ("ExternalPhrase_freshStack");
    set_return (` nil`);
return exit_rule ("ExternalPhrase_freshStack");
},
ExternalPhrase_fresh : function (_octothorpe,_83,_84,ident,_85,) {
enter_rule ("ExternalPhrase_fresh");
    set_return (` (make-instance '${ident.rwr ()})`);
return exit_rule ("ExternalPhrase_fresh");
},
ExternalPhrase_stringshrink : function (_octothorpe,_83,_84,e,_85,) {
enter_rule ("ExternalPhrase_stringshrink");
    set_return (` ${e.rwr ()}`);
return exit_rule ("ExternalPhrase_stringshrink");
},
ExternalPhrase_stringcar : function (_octothorpe,_83,_84,e,_85,) {
enter_rule ("ExternalPhrase_stringcar");
    set_return (` (string (char ${e.rwr ()} 0))`);
return exit_rule ("ExternalPhrase_stringcar");
},
ExternalPhrase_stringcdr : function (_octothorpe,_83,_84,e,_85,) {
enter_rule ("ExternalPhrase_stringcdr");
    set_return (` (subseq ${e.rwr ()} 1)`);
return exit_rule ("ExternalPhrase_stringcdr");
},
ExternalPhrase_strcons : function (_octothorpe,_strcons,lp,e1,_comma,e2,rp,) {
enter_rule ("ExternalPhrase_strcons");
    set_return (` (concatenate 'string ${e1.rwr ()} ${e2.rwr ()})`);
return exit_rule ("ExternalPhrase_strcons");
},
ExternalPhrase_append : function (_octothorpe,_append,lp,lis,_comma,e2,rp,) {
enter_rule ("ExternalPhrase_append");
    set_return (` (setf ${lis.rwr ()} (append ${lis.rwr ()} (list ${e2.rwr ()})))`);
return exit_rule ("ExternalPhrase_append");
},
ExternalPhrase_basename : function (_octothorpe,_basename,lp,s,rp,) {
enter_rule ("ExternalPhrase_basename");
    set_return (`${s.rwr ()}`);
return exit_rule ("ExternalPhrase_basename");
},
ExternalPhrase_preamble : function (_octothorpe,_preamble,lb,rp,) {
enter_rule ("ExternalPhrase_preamble");
    set_return (`(load "~/quicklisp/setup.lisp")
(proclaim '(optimize (debug 3) (safety 3) (speed 0)))
(ql:quickload :uiop)
(ql:quickload :cl-json)

(defun getwd (s)
  #+lispworks (merge-pathnames s (get-working-directory))
  #-lispworks s
)

(defun dict-fresh () (make-hash-table :test 'equal))

(defun dict-in? (name table)
  (when (and table name)
    (multiple-value-bind (dont-care found)
       (gethash name table)
      dont-care ;; quell warnings that dont-care is unused
      found)))

(defun jparse (filename)
  (let ((s (uiop:read-file-string filename)))
    (internalize-lnet-from-JSON s)))
  
(defun internalize-lnet-from-JSON (s)
  (let ((s (uiop:read-file-string filename)))
    (let ((cl-json:*json-identifier-name-to-lisp* 'identity)) ;; preserves case
      (with-input-from-string (strm s)
        (cl-json:decode-json strm)))))

(defun json2dict (filename)
  (let ((j (jparse filename)))
    (make-dict nil j)))


(defun make-dict (dict x)
  (assert (or (not (null dict)) (not (null x))))
  (cond 

    ;; done
    ((null x) dict)

    ;; bottom
    ((atom x) x)

    ;; key/value pair - put it in dict
    ((kv? x)
      (let ((v (make-dict dict (val x))))
        (setf (gethash (key x) dict) v)
	dict))

    ;; begin new dict
    ((kv? (car x))
      (let ((new-dict (make-hash-table :test 'equal)))
        (mapc #'(lambda (y)
                  (make-dict new-dict y))
          x)
        new-dict))

    ;; list of dicts (json array)
    ((not (kv? (car x)))
      ;; list of kvs (json array)
      (mapcar #'(lambda (y)
                  (make-dict nil y))
        x))))

(defun key (kv)
  (symbol-name (car kv)))

(defun val (kv)
  (cdr kv))

(defun kv? (x)
  (and (listp x)
       (atom (car x))))

;;;;
;(load "~/quicklisp/setup.lisp")
(ql:quickload '(:websocket-driver-client :cl-json :uiop))

(defun live_update (key value)
  (let* ((client (wsd:make-client "ws://localhost:8966"))
         (json-data (json:encode-json-to-string 
                    (list (cons key value)))))
    (wsd:start-connection client)
    (wsd:send client json-data)
    (sleep 0.1)  ; Add small delay to ensure message is sent
    (wsd:close-connection client)))


;;;;

(defclass Queue ()
  ((contents :accessor contents :initform nil)))

(defmethod enqueue ((self Queue) v)
  (setf (contents self) (append (contents self) (list v))))

(defmethod dequeue ((self Queue))
  (pop (contents self)))
    
(defmethod empty? ((self Queue))
  (null (contents self)))

(defmethod queue2list ((self Queue))
  (contents self))
`);
return exit_rule ("ExternalPhrase_preamble");
},
ExternalPhrase_print_stdout : function (_octothorpe,_,lp,e,rp,) {
enter_rule ("ExternalPhrase_print_stdout");
    set_return (`(format *standard-output* "~a~%25" ${e.rwr ()})`);
return exit_rule ("ExternalPhrase_print_stdout");
},
ExternalPhrase_print_stderr : function (_octothorpe,_,lp,e,rp,) {
enter_rule ("ExternalPhrase_print_stderr");
    set_return (`(format *error-output* "~a~%25" ${e.rwr ()})`);
return exit_rule ("ExternalPhrase_print_stderr");
},
ExternalPhrase_print_nl : function (_octothorpe,_,lp,rp,) {
enter_rule ("ExternalPhrase_print_nl");
    set_return (`(format *standard-output* "%0A")`);
return exit_rule ("ExternalPhrase_print_nl");
},
ExternalPhrase_print_nl_stderr : function (_octothorpe,_,lp,rp,) {
enter_rule ("ExternalPhrase_print_nl_stderr");
    set_return (`(format *error-output* "%0A")`);
return exit_rule ("ExternalPhrase_print_nl_stderr");
},
ExternalPhrase_substitute : function (_octothorpe,_,lp,new_item,_comma1,old_item,_comma2,s,rp,) {
enter_rule ("ExternalPhrase_substitute");
    set_return (`(substitute ${new_item.rwr ()} ${old_item.rwr ()} ${s.rwr ()})`);
return exit_rule ("ExternalPhrase_substitute");
},
ExternalPhrase_run_command : function (_octothorpe,_,lp,cmd,_comma1,args,_comma2,ret,_comma3,rc,_comma4,out,_comma5,errout,rp,) {
enter_rule ("ExternalPhrase_run_command");
    set_return (`(multiple-value-setq (${out.rwr ()} ${errout.rwr ()} ${rc.rwr ()}) (uiop::run-program (concatenate 'string ${cmd.rwr ()} " " ${args.rwr ()}) :output :string :error :string))`);
return exit_rule ("ExternalPhrase_run_command");
},
ExternalPhrase_abort : function (_octothorpe,_,lp,rp,) {
enter_rule ("ExternalPhrase_abort");
    set_return (`(break)`);
return exit_rule ("ExternalPhrase_abort");
},
ExternalPhrase_asstr : function (_octothorpe,_,lp,e,rp,) {
enter_rule ("ExternalPhrase_asstr");
    set_return (`(format nil "~a" ${e.rwr ()})`);
return exit_rule ("ExternalPhrase_asstr");
},
ExternalPhrase_len : function (_octothorpe,_,lp,e,rp,) {
enter_rule ("ExternalPhrase_len");
    set_return (`(length ${e.rwr ()})`);
return exit_rule ("ExternalPhrase_len");
},
ExternalPhrase_asint : function (_octothorpe,_,lp,e,rp,) {
enter_rule ("ExternalPhrase_asint");
    set_return (`(parse-integer ${e.rwr ()})`);
return exit_rule ("ExternalPhrase_asint");
},
ExternalPhrase_enqueue : function (_octothorpe,_,lp,obj,_comma,e,rp,) {
enter_rule ("ExternalPhrase_enqueue");
    set_return (`(enqueue ${obj.rwr ()} ${e.rwr ()})`);
return exit_rule ("ExternalPhrase_enqueue");
},
ExternalPhrase_dequeue : function (_octothorpe,_,lp,obj,rp,) {
enter_rule ("ExternalPhrase_dequeue");
    set_return (`(dequeue ${obj.rwr ()})`);
return exit_rule ("ExternalPhrase_dequeue");
},
ExternalPhrase_empty : function (_octothorpe,_,lp,q,rp,) {
enter_rule ("ExternalPhrase_empty");
    set_return (`(empty? ${q.rwr ()})`);
return exit_rule ("ExternalPhrase_empty");
},
ExternalPhrase_queue2list : function (_octothorpe,_,lp,q,rp,) {
enter_rule ("ExternalPhrase_queue2list");
    set_return (`(queue2list ${q.rwr ()})`);
return exit_rule ("ExternalPhrase_queue2list");
},
ExternalPhrase_negate : function (_octothorpe,_,lp,x,rp,) {
enter_rule ("ExternalPhrase_negate");
    set_return (`(- ${x.rwr ()})`);
return exit_rule ("ExternalPhrase_negate");
},
ExternalPhrase_liveUpdate : function (_octothorpe,_,lp,s1,_comma,s2,rp,) {
enter_rule ("ExternalPhrase_liveUpdate");
    set_return (`(live_update ${s1.rwr ()} ${s2.rwr ()})`);
return exit_rule ("ExternalPhrase_liveUpdate");
},
ExternalPhrase_queueAsJsonToStdout : function (_octothorpe,_,lp,x,rp,) {
enter_rule ("ExternalPhrase_queueAsJsonToStdout");
    set_return (`(queue-as-json-to-stdout ${x.rwr ()})`);
return exit_rule ("ExternalPhrase_queueAsJsonToStdout");
},
ExternalPhrase_dir : function (_octothorpe,_,lp,x,rp,) {
enter_rule ("ExternalPhrase_dir");
    set_return (`(getwd ${x.rwr ()})`);
return exit_rule ("ExternalPhrase_dir");
},
ExternalPhrase_dispatch_lookup : function (_octothorpe,_,lp,arg,_comma,eh,rp,) {
enter_rule ("ExternalPhrase_dispatch_lookup");
    set_return (`(dispatch_lookup ${arg.rwr ()} ${eh.rwr ()})`);
return exit_rule ("ExternalPhrase_dispatch_lookup");
},
ExternalPhrase_dispatch : function (_octothorpe,_,lp,f,_comma,eh,_comma1,msg,rp,) {
enter_rule ("ExternalPhrase_dispatch");
    set_return (`(${f.rwr ()} ${eh.rwr ()}, ${msg.rwr ()})`);
return exit_rule ("ExternalPhrase_dispatch");
},
ExternalPhrase_unrecognized : function (_octothorpe,ident,lp,stuff,rp,) {
enter_rule ("ExternalPhrase_unrecognized");
    set_return (`${_octothorpe.rwr ()} ${ident.rwr ()} ⎝ error - unrecognized external (with given arguments) ⎠ ${lp.rwr ()}${stuff.rwr ().join ('')}${rp.rwr ()} `);
return exit_rule ("ExternalPhrase_unrecognized");
},
Deftemp : function (_deftemp,lval,_mutate,e,rec,) {
enter_rule ("Deftemp");
    set_return (`\n(let ((${lval.rwr ()} ${e.rwr ()}))⤷\n(declare (ignorable ${lval.rwr ()}))${rec.rwr ().join ('')}⤶)`);
return exit_rule ("Deftemp");
},
Defsynonym_illegal : function (lval,err,_eqv,e,rec,) {
enter_rule ("Defsynonym_illegal");
    set_return (`\n${lval.rwr ()} ${err.rwr ()} = ${e.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("Defsynonym_illegal");
},
Defsynonym_legal : function (id,_eqv,e,rec,) {
enter_rule ("Defsynonym_legal");
    set_return (`\n(let ((${id.rwr ()} ${e.rwr ()}))⤷\n(declare (ignorable ${id.rwr ()}))${rec.rwr ().join ('')}⤶)`);
return exit_rule ("Defsynonym_legal");
},
InitStatement : function (_mark,ident,_33,Exp,fluff,) {
enter_rule ("InitStatement");
    set_return (`\n(${ident.rwr ()} :accessor ${ident.rwr ()} :initarg :${ident.rwr ()} :initform ${Exp.rwr ()}) ${fluff.rwr ().join ('')}⫶ ${ident.rwr ()} ⫶ :${ident.rwr ()} ${ident.rwr ()} ⫶`);
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
    set_return (`\n(loop for ${ident.rwr ()} in ${Exp.rwr ()}⤷\ndo⤷\n(progn⤷\n${ident.rwr ()}${StatementBlock.rwr ()}))⤶⤶⤶${rec.rwr ().join ('')}`);
return exit_rule ("ForStatement");
},
WhileStatement : function (_45,Exp,StatementBlock,rec,) {
enter_rule ("WhileStatement");
    set_return (`\n(loop while ${Exp.rwr ()}⤷\ndo⤷\n(progn⤷${StatementBlock.rwr ()}⤶)⤶)⤶${rec.rwr ().join ('')}`);
return exit_rule ("WhileStatement");
},
Assignment_multiple : function (lb,Lvals,rb,_assign,Exp,rec,) {
enter_rule ("Assignment_multiple");
    set_return (`\n(multiple-value-setq (${Lvals.rwr ().join ('')}) ⤷${Exp.rwr ()}⤶)${rec.rwr ().join ('')}`);
return exit_rule ("Assignment_multiple");
},
Assignment_single : function (Lval,_59,Exp,rec,) {
enter_rule ("Assignment_single");
    set_return (`\n(setf ${Lval.rwr ()} ${Exp.rwr ()})${rec.rwr ().join ('')}`);
return exit_rule ("Assignment_single");
},
LvalComma : function (Lval,Comma,) {
enter_rule ("LvalComma");
    set_return (`${Lval.rwr ()}${Comma.rwr ().join ('')}`);
return exit_rule ("LvalComma");
},
ReturnExp_multiple : function (_60,Exps,_62,rec,) {
enter_rule ("ReturnExp_multiple");
    set_return (`(values ${Exps.rwr ().join ('')})${rec.rwr ().join ('')}`);
return exit_rule ("ReturnExp_multiple");
},
ReturnExp_single : function (Exp,rec,) {
enter_rule ("ReturnExp_single");
    set_return (`${Exp.rwr ()}${rec.rwr ().join ('')}`);
return exit_rule ("ReturnExp_single");
},
ExpComma : function (Exp,Comma,) {
enter_rule ("ExpComma");
    set_return (`${Exp.rwr ()}${Comma.rwr ().join ('')}`);
return exit_rule ("ExpComma");
},
Exp : function (e,) {
enter_rule ("Exp");
    set_return (`${e.rwr ()}`);
return exit_rule ("Exp");
},
BooleanAndOrIn_andOrIn : function (e1,op,e2,) {
enter_rule ("BooleanAndOrIn_andOrIn");
    set_return (`(${op.rwr ()} ${e1.rwr ()} ${e2.rwr ()})`);
return exit_rule ("BooleanAndOrIn_andOrIn");
},
BooleanAndOrIn_default : function (e,) {
enter_rule ("BooleanAndOrIn_default");
    set_return (`${e.rwr ()}`);
return exit_rule ("BooleanAndOrIn_default");
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
Primary_call : function (p,actuals,) {
enter_rule ("Primary_call");
    set_return (`(funcall ${p.rwr ()} ${actuals.rwr ()})`);
return exit_rule ("Primary_call");
},
Primary_plain : function (p,) {
enter_rule ("Primary_plain");
    set_return (`${p.rwr ()}`);
return exit_rule ("Primary_plain");
},
PrimaryIndexed_lookupident : function (p,_at,key,) {
enter_rule ("PrimaryIndexed_lookupident");
    set_return (`(gethash ${key.rwr ()} ${p.rwr ()})`);
return exit_rule ("PrimaryIndexed_lookupident");
},
PrimaryIndexed_lookup : function (p,_at,key,) {
enter_rule ("PrimaryIndexed_lookup");
    set_return (`(gethash ${key.rwr ()} ${p.rwr ()})`);
return exit_rule ("PrimaryIndexed_lookup");
},
PrimaryIndexed_fieldident : function (p,_dot,key,) {
enter_rule ("PrimaryIndexed_fieldident");
    set_return (`(slot-value ${p.rwr ()} '${key.rwr ()})`);
return exit_rule ("PrimaryIndexed_fieldident");
},
PrimaryIndexed_field : function (p,_dot,key,) {
enter_rule ("PrimaryIndexed_field");
    set_return (`(slot-value ${p.rwr ()} ${key.rwr ()})`);
return exit_rule ("PrimaryIndexed_field");
},
PrimaryIndexed_index : function (p,lb,e,rb,) {
enter_rule ("PrimaryIndexed_index");
    set_return (`(nth ${e.rwr ()} ${p.rwr ()})`);
return exit_rule ("PrimaryIndexed_index");
},
PrimaryIndexed_nthslice : function (p,lb,ds,_colon,rb,) {
enter_rule ("PrimaryIndexed_nthslice");
    set_return (`(nthcdr ${ds.rwr ().join ('')} ${p.rwr ()})`);
return exit_rule ("PrimaryIndexed_nthslice");
},
PrimaryIndexed_atom : function (a,) {
enter_rule ("PrimaryIndexed_atom");
    set_return (`${a.rwr ()}`);
return exit_rule ("PrimaryIndexed_atom");
},
Atom_external : function (x,) {
enter_rule ("Atom_external");
    set_return (`${x.rwr ()}`);
return exit_rule ("Atom_external");
},
Atom_callident : function (id,actuals,) {
enter_rule ("Atom_callident");
    set_return (`(funcall (quote ${id.rwr ()}) ${actuals.rwr ()})`);
return exit_rule ("Atom_callident");
},
Atom_emptylistconst : function (_72,_73,) {
enter_rule ("Atom_emptylistconst");
    set_return (` nil`);
return exit_rule ("Atom_emptylistconst");
},
Atom_emptydict : function (_76,_77,) {
enter_rule ("Atom_emptydict");
    set_return (` (dict-fresh)`);
return exit_rule ("Atom_emptydict");
},
Atom_paren : function (_70,Exp,_71,) {
enter_rule ("Atom_paren");
    set_return (`${Exp.rwr ()}`);
return exit_rule ("Atom_paren");
},
Atom_listconst : function (lb,line1,PrimaryComma,line2,rb,) {
enter_rule ("Atom_listconst");
    set_return (`(list ${line1.rwr ().join ('')} ${PrimaryComma.rwr ().join ('')})${line2.rwr ().join ('')}`);
return exit_rule ("Atom_listconst");
},
Atom_dict : function (_78,line1,PairComma,line2,_79,) {
enter_rule ("Atom_dict");
    pushParameter ("freshdict", `_dict`);
    set_return (`\n(let ((_dict (dict-fresh)))⤷${line1.rwr ().join ('')}${PairComma.rwr ().join ('')}${line2.rwr ().join ('')}\n_dict⤶)`);
popParameter ("freshdict");
return exit_rule ("Atom_dict");
},
Atom_lambda : function (_80,Formals,_81,Exp,) {
enter_rule ("Atom_lambda");
    set_return (` #'(lambda (&optional ${Formals.rwr ().join ('')})⤷${Exp.rwr ()}⤶)`);
return exit_rule ("Atom_lambda");
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
Atom_subr : function (_,ident,) {
enter_rule ("Atom_subr");
    set_return (` #'${ident.rwr ()}`);
return exit_rule ("Atom_subr");
},
Atom_range : function (_91,_92,Exp,_93,) {
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
PrimaryComma : function (Primary,_94,line,) {
enter_rule ("PrimaryComma");
    set_return (`${Primary.rwr ()} ${line.rwr ().join ('')}`);
return exit_rule ("PrimaryComma");
},
PairComma : function (Pair,_95,) {
enter_rule ("PairComma");
    set_return (`${Pair.rwr ()} `);
return exit_rule ("PairComma");
},
StuffInsideParentheses_rec : function (lp,stuff,rp,) {
enter_rule ("StuffInsideParentheses_rec");
    set_return (`${lp.rwr ()}${stuff.rwr ().join ('')}${rp.rwr ()}`);
return exit_rule ("StuffInsideParentheses_rec");
},
StuffInsideParentheses_default : function (x,) {
enter_rule ("StuffInsideParentheses_default");
    set_return (`${x.rwr ()}`);
return exit_rule ("StuffInsideParentheses_default");
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
Formals_withformals : function (_150,FormalComma,_151,) {
enter_rule ("Formals_withformals");
    set_return (`${FormalComma.rwr ().join ('')}`);
return exit_rule ("Formals_withformals");
},
ObjFormals_noformals : function (_148,_149,) {
enter_rule ("ObjFormals_noformals");
    set_return (``);
return exit_rule ("ObjFormals_noformals");
},
ObjFormals_withformals : function (_150,FormalComma,_151,) {
enter_rule ("ObjFormals_withformals");
    set_return (`${FormalComma.rwr ().join ('')}`);
return exit_rule ("ObjFormals_withformals");
},
LambdaFormals_noformals : function (_148,_149,) {
enter_rule ("LambdaFormals_noformals");
    set_return (``);
return exit_rule ("LambdaFormals_noformals");
},
LambdaFormals_withformals : function (_150,FormalComma,_151,) {
enter_rule ("LambdaFormals_withformals");
    set_return (`${FormalComma.rwr ().join ('')}`);
return exit_rule ("LambdaFormals_withformals");
},
Formal : function (ident,) {
enter_rule ("Formal");
    set_return (`${ident.rwr ()}`);
return exit_rule ("Formal");
},
FormalComma : function (Formal,comma,) {
enter_rule ("FormalComma");
    set_return (` ${Formal.rwr ()}${comma.rwr ().join ('')}`);
return exit_rule ("FormalComma");
},
Actuals_noactuals : function (_154,_155,) {
enter_rule ("Actuals_noactuals");
    set_return (``);
return exit_rule ("Actuals_noactuals");
},
Actuals_actuals : function (_156,ActualComma,_157,line,) {
enter_rule ("Actuals_actuals");
    set_return (` ${ActualComma.rwr ().join ('')} ${line.rwr ().join ('')}`);
return exit_rule ("Actuals_actuals");
},
Actual : function (Exp,) {
enter_rule ("Actual");
    set_return (`${Exp.rwr ()}`);
return exit_rule ("Actual");
},
ActualComma : function (comment,Actual,comma,line,) {
enter_rule ("ActualComma");
    set_return (`${comment.rwr ().join ('')}${Actual.rwr ()}${comma.rwr ().join ('')}${line.rwr ().join ('')}`);
return exit_rule ("ActualComma");
},
number_fract : function (num,_160,den,) {
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
    set_return (`\n(setf (gethash ${string.rwr ()} ${getParameter ("freshdict")}) ⤷${Exp.rwr ()}⤶)`);
return exit_rule ("Pair");
},
andOrIn_and : function (op,) {
enter_rule ("andOrIn_and");
    set_return (` and `);
return exit_rule ("andOrIn_and");
},
andOrIn_or : function (op,) {
enter_rule ("andOrIn_or");
    set_return (` or `);
return exit_rule ("andOrIn_or");
},
andOrIn_in : function (op,) {
enter_rule ("andOrIn_in");
    set_return (` dict-in? `);
return exit_rule ("andOrIn_in");
},
boolOp : function (_191,) {
enter_rule ("boolOp");
    set_return (` ${_191.rwr ()} `);
return exit_rule ("boolOp");
},
boolEq : function (op,) {
enter_rule ("boolEq");
    set_return (`equal `);
return exit_rule ("boolEq");
},
boolNeq : function (op,) {
enter_rule ("boolNeq");
    set_return (`equal `);
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
errorMessage : function (_239,errorchar,_240,) {
enter_rule ("errorMessage");
    set_return (`${_239.rwr ()}${errorchar.rwr ().join ('')}${_240.rwr ()}`);
return exit_rule ("errorMessage");
},
errorchar_rec : function (_241,errorchar,_242,) {
enter_rule ("errorchar_rec");
    set_return (`${_241.rwr ()}${errorchar.rwr ().join ('')}${_242.rwr ()}`);
return exit_rule ("errorchar_rec");
},
errorchar_other : function (any,) {
enter_rule ("errorchar_other");
    set_return (`${any.rwr ()}`);
return exit_rule ("errorchar_other");
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
line : function (lb,cs,rb,) {
enter_rule ("line");
    set_return (`${lb.rwr ()}${cs.rwr ().join ('')}${rb.rwr ()}`);
return exit_rule ("line");
},
Comma : function (line1,_comma,line2,) {
enter_rule ("Comma");
    set_return (`${line1.rwr ().join ('')} ${line2.rwr ().join ('')}`);
return exit_rule ("Comma");
},
ParaMark : function (c,) {
enter_rule ("ParaMark");
    set_return (`${c.rwr ()}`);
return exit_rule ("ParaMark");
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

