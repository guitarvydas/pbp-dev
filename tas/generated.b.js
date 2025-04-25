
                              /* line 1 *//* line 2 *//* line 3 */
class Component_Registry {
  constructor () {            /* line 4 */

    this.templates = {};      /* line 5 *//* line 6 */
  }
}
                              /* line 7 */
class Template {
  constructor () {            /* line 8 */

    this.name =  null;        /* line 9 */
    this.template_data =  null;/* line 10 */
    this.instantiator =  null;/* line 11 *//* line 12 */
  }
}
                              /* line 13 */
function mkTemplate (name,template_data,instantiator) {/* line 14 */
    let  templ =  new Template ();/* line 15 */;
    templ.name =  name;       /* line 16 */
    templ.template_data =  template_data;/* line 17 */
    templ.instantiator =  instantiator;/* line 18 */
    return  templ;            /* line 19 *//* line 20 *//* line 21 */
}

function read_and_convert_json_file (pathname,filename) {/* line 22 */

    let jstr = fs.readFileSync (`${pathname}/${filename}`);
    let drawio = null;
    if (jstr) {
    return JSON.parse (jstr);
    } else {
    return undefined;
    }
                              /* line 23 *//* line 24 *//* line 25 */
}

function json2internal (pathname,container_xml) {/* line 26 */
    let fname =   container_xml/* line 27 */;
    let routings = read_and_convert_json_file ( pathname, fname)/* line 28 */;
    return  routings;         /* line 29 *//* line 30 *//* line 31 */
}

function delete_decls (d) {   /* line 32 *//* line 33 *//* line 34 *//* line 35 */
}

function make_component_registry () {/* line 36 */
    return  new Component_Registry ();/* line 37 */;/* line 38 *//* line 39 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 40 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 41 *//* line 42 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 43 */
    let name = mangle_name ( template.name)/* line 44 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 45 */
      load_error ( `${ "Component /"}${ `${ template.name}${ "/ already declared"}` }` )/* line 46 */
      return  reg;            /* line 47 */}
    else {                    /* line 48 */
      reg.templates [name] =  template;/* line 49 */
      return  reg;            /* line 50 *//* line 51 */}/* line 52 *//* line 53 */
}

function get_component_instance (reg,full_name,owner) {/* line 54 */
    let template_name = mangle_name ( full_name)/* line 55 */;
    if ((( template_name) in ( reg.templates))) {/* line 56 */
      let template =  reg.templates [template_name];/* line 57 */
      if (( template ==  null)) {/* line 58 */
        load_error ( `${ "Registry Error (A): Can;t find component /"}${ `${ template_name}${ "/"}` }` )/* line 59 */
        return  null;         /* line 60 */}
      else {                  /* line 61 */
        let owner_name =  ""; /* line 62 */
        let instance_name =  template_name;/* line 63 */
        if ( null!= owner) {  /* line 64 */
          owner_name =  owner.name;/* line 65 */
          instance_name =  `${ owner_name}${ `${ "."}${ template_name}` }` ;/* line 66 */}
        else {                /* line 67 */
          instance_name =  template_name;/* line 68 */}
        let instance =  template.instantiator ( reg, owner, instance_name, template.template_data)/* line 69 */;
        return  instance;}    /* line 70 */}
    else {                    /* line 71 */
      load_error ( `${ "Registry Error (B): Can't find component /"}${ `${ template_name}${ "/"}` }` )/* line 72 */
      return  null;           /* line 73 */}/* line 74 *//* line 75 */
}

function dump_registry (reg) {/* line 76 */
    nl ()                     /* line 77 */
    console.log ( "*** PALETTE ***");/* line 78 */
    for (c in  reg.templates) {/* line 79 */
      print ( c.name)         /* line 80 */}
    console.log ( "***************");/* line 81 */
    nl ()                     /* line 82 *//* line 83 *//* line 84 */
}

function print_stats (reg) {  /* line 85 */
    console.log ( `${ "registry statistics: "}${ reg.stats}` );/* line 86 *//* line 87 *//* line 88 */
}

function mangle_name (s) {    /* line 89 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 90 */
    return  s;                /* line 91 *//* line 92 *//* line 93 */
}

function generate_shell_components (reg,container_list) {/* line 94 */
    /*  [ */                  /* line 95 */
    /*      {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, *//* line 96 */
    /*      {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []} *//* line 97 */
    /*  ] */                  /* line 98 */
    if ( null!= container_list) {/* line 99 */
      for (diagram in  container_list) {/* line 100 */
        /*  loop through every component in the diagram and look for names that start with “$“ *//* line 101 */
        /*  {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, *//* line 102 */
        for (child_descriptor in  diagram [ "children"]) {/* line 103 */
          if (first_char_is ( child_descriptor [ "name"], "$")) {/* line 104 */
            let name =  child_descriptor [ "name"];/* line 105 */
            let cmd =   name.substring (1) .strip ();/* line 106 */
            let generated_leaf = mkTemplate ( name, shell_out_instantiate, cmd)/* line 107 */;
            register_component ( reg, generated_leaf)/* line 108 */}
          else if (first_char_is ( child_descriptor [ "name"], "'")) {/* line 109 */
            let name =  child_descriptor [ "name"];/* line 110 */
            let s =   name.substring (1) /* line 111 */;
            let generated_leaf = mkTemplate ( name, string_constant_instantiate, s)/* line 112 */;
            register_component_allow_overwriting ( reg, generated_leaf)/* line 113 *//* line 114 */}/* line 115 */}/* line 116 */}/* line 117 */}
    return  reg;              /* line 118 *//* line 119 *//* line 120 */
}

function first_char (s) {     /* line 121 */
    return   s[0]             /* line 122 */;/* line 123 *//* line 124 */
}

function first_char_is (s,c) {/* line 125 */
    return  c == first_char ( s)/* line 126 */;/* line 127 *//* line 128 */
}
                              /* line 129 */
/*  TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here *//* line 130 */
/*  I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped *//* line 131 *//* line 132 *//* line 133 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 134 */
/*  and output queues of messages. *//* line 135 */
/*  */                        /* line 136 */
/*  Components can either be a user_supplied function (“lea“), or a “container“ *//* line 137 */
/*  that routes messages to child components according to a list of connections *//* line 138 */
/*  that serve as a message routing table. *//* line 139 */
/*  */                        /* line 140 */
/*  Child components themselves can be leaves or other containers. *//* line 141 */
/*  */                        /* line 142 */
/*  `handler` invokes the code that is attached to this component. *//* line 143 */
/*  */                        /* line 144 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 145 */
/*  function may want whenever it is invoked again. *//* line 146 */
/*  */                        /* line 147 *//* line 148 */
/*  Eh_States :: enum { idle, active } *//* line 149 */
class Eh {
  constructor () {            /* line 150 */

    this.name =  "";          /* line 151 */
    this.inq =  []            /* line 152 */;
    this.outq =  []           /* line 153 */;
    this.owner =  null;       /* line 154 */
    this.children = [];       /* line 155 */
    this.visit_ordering =  [] /* line 156 */;
    this.connections = [];    /* line 157 */
    this.routings =  []       /* line 158 */;
    this.handler =  null;     /* line 159 */
    this.finject =  null;     /* line 160 */
    this.instance_data =  null;/* line 161 */
    this.state =  "idle";     /* line 162 *//*  bootstrap debugging *//* line 163 */
    this.kind =  null;/*  enum { container, leaf, } *//* line 164 *//* line 165 */
  }
}
                              /* line 166 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 167 */
/*  whose handler function is `container_handler`. *//* line 168 */
function make_container (name,owner) {/* line 169 */
    let  eh =  new Eh ();     /* line 170 */;
    eh.name =  name;          /* line 171 */
    eh.owner =  owner;        /* line 172 */
    eh.handler =  container_handler;/* line 173 */
    eh.finject =  container_injector;/* line 174 */
    eh.state =  "idle";       /* line 175 */
    eh.kind =  "container";   /* line 176 */
    return  eh;               /* line 177 *//* line 178 *//* line 179 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 180 */
/*  that will be passed back to your handler when called. *//* line 181 *//* line 182 */
function make_leaf (name,owner,instance_data,handler) {/* line 183 */
    let  eh =  new Eh ();     /* line 184 */;
    eh.name =  `${ owner.name}${ `${ "."}${ name}` }` /* line 185 */;
    eh.owner =  owner;        /* line 186 */
    eh.handler =  handler;    /* line 187 */
    eh.instance_data =  instance_data;/* line 188 */
    eh.state =  "idle";       /* line 189 */
    eh.kind =  "leaf";        /* line 190 */
    return  eh;               /* line 191 *//* line 192 *//* line 193 */
}

/*  Sends a message on the given `port` with `data`, placing it on the output *//* line 194 */
/*  of the given component. *//* line 195 *//* line 196 */
function send (eh,port,datum,causingMessage) {/* line 197 */
    let msg = make_message ( port, datum)/* line 198 */;
    put_output ( eh, msg)     /* line 199 *//* line 200 *//* line 201 */
}

function send_string (eh,port,s,causingMessage) {/* line 202 */
    let datum = new_datum_string ( s)/* line 203 */;
    let msg = make_message ( port, datum)/* line 204 */;
    put_output ( eh, msg)     /* line 205 *//* line 206 *//* line 207 */
}

function forward (eh,port,msg) {/* line 208 */
    let fwdmsg = make_message ( port, msg.datum)/* line 209 */;
    put_output ( eh, msg)     /* line 210 *//* line 211 *//* line 212 */
}

function inject (eh,msg) {    /* line 213 */
    eh.finject ( eh, msg)     /* line 214 *//* line 215 *//* line 216 */
}

/*  Returns a list of all output messages on a container. *//* line 217 */
/*  For testing / debugging purposes. *//* line 218 *//* line 219 */
function output_list (eh) {   /* line 220 */
    return  eh.outq;          /* line 221 *//* line 222 *//* line 223 */
}

/*  Utility for printing an array of messages. *//* line 224 */
function print_output_list (eh) {/* line 225 */
    for (m in   eh.outq) {    /* line 226 */
      console.log (format_message ( m));/* line 227 */}/* line 228 *//* line 229 */
}

function spaces (n) {         /* line 230 */
    let  s =  "";             /* line 231 */
    for (i in range( n)) {    /* line 232 */
      s =  s+ " ";            /* line 233 */}
    return  s;                /* line 234 *//* line 235 *//* line 236 */
}

function set_active (eh) {    /* line 237 */
    eh.state =  "active";     /* line 238 *//* line 239 *//* line 240 */
}

function set_idle (eh) {      /* line 241 */
    eh.state =  "idle";       /* line 242 *//* line 243 *//* line 244 */
}

/*  Utility for printing a specific output message. *//* line 245 *//* line 246 */
function fetch_first_output (eh,port) {/* line 247 */
    for (msg in   eh.outq) {  /* line 248 */
      if (( msg.port ==  port)) {/* line 249 */
        return  msg.datum;}   /* line 250 */}
    return  null;             /* line 251 *//* line 252 *//* line 253 */
}

function print_specific_output (eh,port) {/* line 254 */
    /*  port ∷ “” */          /* line 255 */
    let  datum = fetch_first_output ( eh, port)/* line 256 */;
    console.log ( datum.srepr ());/* line 257 *//* line 258 */
}

function print_specific_output_to_stderr (eh,port) {/* line 259 */
    /*  port ∷ “” */          /* line 260 */
    let  datum = fetch_first_output ( eh, port)/* line 261 */;
    /*  I don't remember why I found it useful to print to stderr during bootstrapping, so I've left it in... *//* line 262 */
    console.error ( datum.srepr ());/* line 263 *//* line 264 *//* line 265 */
}

function put_output (eh,msg) {/* line 266 */
    eh.outq.push ( msg)       /* line 267 *//* line 268 *//* line 269 */
}

let  root_project =  "";      /* line 270 */
let  root_0D =  "";           /* line 271 *//* line 272 */
function set_environment (rproject,r0D) {/* line 273 *//* line 274 *//* line 275 */
    root_project =  rproject; /* line 276 */
    root_0D =  r0D;           /* line 277 *//* line 278 *//* line 279 */
}

function probe_instantiate (reg,owner,name,template_data) {/* line 280 */
    let name_with_id = gensymbol ( "?")/* line 281 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 282 */;/* line 283 */
}

function probeA_instantiate (reg,owner,name,template_data) {/* line 284 */
    let name_with_id = gensymbol ( "?A")/* line 285 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 286 */;/* line 287 *//* line 288 */
}

function probeB_instantiate (reg,owner,name,template_data) {/* line 289 */
    let name_with_id = gensymbol ( "?B")/* line 290 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 291 */;/* line 292 *//* line 293 */
}

function probeC_instantiate (reg,owner,name,template_data) {/* line 294 */
    let name_with_id = gensymbol ( "?C")/* line 295 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 296 */;/* line 297 *//* line 298 */
}

function probe_handler (eh,msg) {/* line 299 */
    let s =  msg.datum.srepr ();/* line 300 */
    console.error ( `${ "... probe "}${ `${ eh.name}${ `${ ": "}${ s}` }` }` );/* line 301 *//* line 302 *//* line 303 */
}

function trash_instantiate (reg,owner,name,template_data) {/* line 304 */
    let name_with_id = gensymbol ( "trash")/* line 305 */;
    return make_leaf ( name_with_id, owner, null, trash_handler)/* line 306 */;/* line 307 *//* line 308 */
}

function trash_handler (eh,msg) {/* line 309 */
    /*  to appease dumped_on_floor checker *//* line 310 *//* line 311 *//* line 312 */
}

class TwoMessages {
  constructor () {            /* line 313 */

    this.firstmsg =  null;    /* line 314 */
    this.secondmsg =  null;   /* line 315 *//* line 316 */
  }
}
                              /* line 317 */
/*  Deracer_States :: enum { idle, waitingForFirstmsg, waitingForSecondmsg } *//* line 318 */
class Deracer_Instance_Data {
  constructor () {            /* line 319 */

    this.state =  null;       /* line 320 */
    this.buffer =  null;      /* line 321 *//* line 322 */
  }
}
                              /* line 323 */
function reclaim_Buffers_from_heap (inst) {/* line 324 *//* line 325 *//* line 326 *//* line 327 */
}

function deracer_instantiate (reg,owner,name,template_data) {/* line 328 */
    let name_with_id = gensymbol ( "deracer")/* line 329 */;
    let  inst =  new Deracer_Instance_Data ();/* line 330 */;
    inst.state =  "idle";     /* line 331 */
    inst.buffer =  new TwoMessages ();/* line 332 */;
    let eh = make_leaf ( name_with_id, owner, inst, deracer_handler)/* line 333 */;
    return  eh;               /* line 334 *//* line 335 *//* line 336 */
}

function send_firstmsg_then_secondmsg (eh,inst) {/* line 337 */
    forward ( eh, "1", inst.buffer.firstmsg)/* line 338 */
    forward ( eh, "2", inst.buffer.secondmsg)/* line 339 */
    reclaim_Buffers_from_heap ( inst)/* line 340 *//* line 341 *//* line 342 */
}

function deracer_handler (eh,msg) {/* line 343 */
    let  inst =  eh.instance_data;/* line 344 */
    if ( inst.state ==  "idle") {/* line 345 */
      if ( "1" ==  msg.port) {/* line 346 */
        inst.buffer.firstmsg =  msg;/* line 347 */
        inst.state =  "waitingForSecondmsg";/* line 348 */}
      else if ( "2" ==  msg.port) {/* line 349 */
        inst.buffer.secondmsg =  msg;/* line 350 */
        inst.state =  "waitingForFirstmsg";/* line 351 */}
      else {                  /* line 352 */
        runtime_error ( `${ "bad msg.port (case A) for deracer "}${ msg.port}` )}/* line 353 */}
    else if ( inst.state ==  "waitingForFirstmsg") {/* line 354 */
      if ( "1" ==  msg.port) {/* line 355 */
        inst.buffer.firstmsg =  msg;/* line 356 */
        send_firstmsg_then_secondmsg ( eh, inst)/* line 357 */
        inst.state =  "idle"; /* line 358 */}
      else {                  /* line 359 */
        runtime_error ( `${ "bad msg.port (case B) for deracer "}${ msg.port}` )}/* line 360 */}
    else if ( inst.state ==  "waitingForSecondmsg") {/* line 361 */
      if ( "2" ==  msg.port) {/* line 362 */
        inst.buffer.secondmsg =  msg;/* line 363 */
        send_firstmsg_then_secondmsg ( eh, inst)/* line 364 */
        inst.state =  "idle"; /* line 365 */}
      else {                  /* line 366 */
        runtime_error ( `${ "bad msg.port (case C) for deracer "}${ msg.port}` )}/* line 367 */}
    else {                    /* line 368 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 369 */}/* line 370 *//* line 371 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data) {/* line 372 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 373 */;
    return make_leaf ( name_with_id, owner, null, low_level_read_text_file_handler)/* line 374 */;/* line 375 *//* line 376 */
}

function low_level_read_text_file_handler (eh,msg) {/* line 377 */
    let fname =  msg.datum.srepr ();/* line 378 */

    data = fs.readFileSync (fname);
    if (data) {
      send_string (eh, "", data, msg);
    } else {
      send_string (eh, "✗", `read error on file '${fname}'`, msg);
    }
                              /* line 379 *//* line 380 *//* line 381 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data) {/* line 382 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 383 */;
    return make_leaf ( name_with_id, owner, null, ensure_string_datum_handler)/* line 384 */;/* line 385 *//* line 386 */
}

function ensure_string_datum_handler (eh,msg) {/* line 387 */
    if ( "string" ==  msg.datum.kind ()) {/* line 388 */
      forward ( eh, "", msg)  /* line 389 */}
    else {                    /* line 390 */
      let emsg =  `${ "*** ensure: type error (expected a string datum) but got "}${ msg.datum}` /* line 391 */;
      send_string ( eh, "✗", emsg, msg)/* line 392 */}/* line 393 *//* line 394 */
}

class Syncfilewrite_Data {
  constructor () {            /* line 395 */

    this.filename =  "";      /* line 396 *//* line 397 */
  }
}
                              /* line 398 */
/*  temp copy for bootstrap, sends “done“ (error during bootstrap if not wired) *//* line 399 */
function syncfilewrite_instantiate (reg,owner,name,template_data) {/* line 400 */
    let name_with_id = gensymbol ( "syncfilewrite")/* line 401 */;
    let inst =  new Syncfilewrite_Data ();/* line 402 */;
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)/* line 403 */;/* line 404 *//* line 405 */
}

function syncfilewrite_handler (eh,msg) {/* line 406 */
    let  inst =  eh.instance_data;/* line 407 */
    if ( "filename" ==  msg.port) {/* line 408 */
      inst.filename =  msg.datum.srepr ();/* line 409 */}
    else if ( "input" ==  msg.port) {/* line 410 */
      let contents =  msg.datum.srepr ();/* line 411 */
      let  f = open ( inst.filename, "w")/* line 412 */;
      if ( f!= null) {        /* line 413 */
        f.write ( msg.datum.srepr ())/* line 414 */
        f.close ()            /* line 415 */
        send ( eh, "done",new_datum_bang (), msg)/* line 416 */}
      else {                  /* line 417 */
        send_string ( eh, "✗", `${ "open error on file "}${ inst.filename}` , msg)}/* line 418 */}/* line 419 *//* line 420 */
}

class StringConcat_Instance_Data {
  constructor () {            /* line 421 */

    this.buffer1 =  null;     /* line 422 */
    this.buffer2 =  null;     /* line 423 */
    this.scount =  0;         /* line 424 *//* line 425 */
  }
}
                              /* line 426 */
function stringconcat_instantiate (reg,owner,name,template_data) {/* line 427 */
    let name_with_id = gensymbol ( "stringconcat")/* line 428 */;
    let instp =  new StringConcat_Instance_Data ();/* line 429 */;
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)/* line 430 */;/* line 431 *//* line 432 */
}

function stringconcat_handler (eh,msg) {/* line 433 */
    let  inst =  eh.instance_data;/* line 434 */
    if ( "1" ==  msg.port) {  /* line 435 */
      inst.buffer1 = clone_string ( msg.datum.srepr ())/* line 436 */;
      inst.scount =  inst.scount+ 1;/* line 437 */
      maybe_stringconcat ( eh, inst, msg)/* line 438 */}
    else if ( "2" ==  msg.port) {/* line 439 */
      inst.buffer2 = clone_string ( msg.datum.srepr ())/* line 440 */;
      inst.scount =  inst.scount+ 1;/* line 441 */
      maybe_stringconcat ( eh, inst, msg)/* line 442 */}
    else {                    /* line 443 */
      runtime_error ( `${ "bad msg.port for stringconcat: "}${ msg.port}` )/* line 444 *//* line 445 */}/* line 446 *//* line 447 */
}

function maybe_stringconcat (eh,inst,msg) {/* line 448 */
    if (((( 0 == ( inst.buffer1.length))) && (( 0 == ( inst.buffer2.length))))) {/* line 449 */
      runtime_error ( "something is wrong in stringconcat, both strings are 0 length")/* line 450 */}
    if ( inst.scount >=  2) { /* line 451 */
      let  concatenated_string =  "";/* line 452 */
      if ( 0 == ( inst.buffer1.length)) {/* line 453 */
        concatenated_string =  inst.buffer2;/* line 454 */}
      else if ( 0 == ( inst.buffer2.length)) {/* line 455 */
        concatenated_string =  inst.buffer1;/* line 456 */}
      else {                  /* line 457 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 458 */}
      send_string ( eh, "", concatenated_string, msg)/* line 459 */
      inst.buffer1 =  null;   /* line 460 */
      inst.buffer2 =  null;   /* line 461 */
      inst.scount =  0;       /* line 462 */}/* line 463 *//* line 464 */
}

/*  */                        /* line 465 *//* line 466 */
/*  this needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here *//* line 467 */
function shell_out_instantiate (reg,owner,name,template_data) {/* line 468 */
    let name_with_id = gensymbol ( "shell_out")/* line 469 */;
    let cmd =  template_data.split (" ")/* line 470 */;
    return make_leaf ( name_with_id, owner, cmd, shell_out_handler)/* line 471 */;/* line 472 *//* line 473 */
}

function shell_out_handler (eh,msg) {/* line 474 */
    let cmd =  eh.instance_data;/* line 475 */
    let s =  msg.datum.srepr ();/* line 476 */
    let  ret =  null;         /* line 477 */
    let  rc =  null;          /* line 478 */
    let  stdout =  null;      /* line 479 */
    let  stderr =  null;      /* line 480 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                              /* line 481 */
    if ( rc!= 0) {            /* line 482 */
      send_string ( eh, "✗", stderr, msg)/* line 483 */}
    else {                    /* line 484 */
      send_string ( eh, "", stdout, msg)/* line 485 *//* line 486 */}/* line 487 *//* line 488 */
}

function string_constant_instantiate (reg,owner,name,template_data) {/* line 489 *//* line 490 *//* line 491 */
    let name_with_id = gensymbol ( "strconst")/* line 492 */;
    let  s =  template_data;  /* line 493 */
    if ( root_project!= "") { /* line 494 */
      s =  s.replaceAll ( "_00_",  root_project)/* line 495 */;/* line 496 */}
    if ( root_0D!= "") {      /* line 497 */
      s =  s.replaceAll ( "_0D_",  root_0D)/* line 498 */;/* line 499 */}
    return make_leaf ( name_with_id, owner, s, string_constant_handler)/* line 500 */;/* line 501 *//* line 502 */
}

function string_constant_handler (eh,msg) {/* line 503 */
    let s =  eh.instance_data;/* line 504 */
    send_string ( eh, "", s, msg)/* line 505 *//* line 506 *//* line 507 */
}

function string_make_persistent (s) {/* line 508 */
    /*  this is here for non_GC languages like Odin, it is a no_op for GC languages like Python *//* line 509 */
    return  s;                /* line 510 *//* line 511 *//* line 512 */
}

function string_clone (s) {   /* line 513 */
    return  s;                /* line 514 *//* line 515 *//* line 516 */
}

/*  usage: app ${_00_} ${_0D_} arg main diagram_filename1 diagram_filename2 ... *//* line 517 */
/*  where ${_00_} is the root directory for the project *//* line 518 */
/*  where ${_0D_} is the root directory for 0D (e.g. 0D/odin or 0D/python) *//* line 519 *//* line 520 */
function initialize_component_palette (root_project,root_0D,diagram_source_files) {/* line 521 */
    let  reg = make_component_registry ();/* line 522 */
    for (diagram_source in  diagram_source_files) {/* line 523 */
      let all_containers_within_single_file = json2internal ( root_project, diagram_source)/* line 524 */;
      reg = generate_shell_components ( reg, all_containers_within_single_file)/* line 525 */;
      for (container in  all_containers_within_single_file) {/* line 526 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 527 *//* line 528 */}/* line 529 */}
    initialize_stock_components ( reg)/* line 530 */
    return  reg;              /* line 531 *//* line 532 *//* line 533 */
}

function print_error_maybe (main_container) {/* line 534 */
    let error_port =  "✗";    /* line 535 */
    let err = fetch_first_output ( main_container, error_port)/* line 536 */;
    if (((( err!= null)) && (( 0 < (trimws ( err.srepr ()).length))))) {/* line 537 */
      console.log ( "___ !!! ERRORS !!! ___");/* line 538 */
      print_specific_output ( main_container, error_port)/* line 539 */}/* line 540 *//* line 541 */
}

/*  debugging helpers */      /* line 542 *//* line 543 */
function nl () {              /* line 544 */
    console.log ( "");        /* line 545 *//* line 546 *//* line 547 */
}

function dump_outputs (main_container) {/* line 548 */
    nl ()                     /* line 549 */
    console.log ( "___ Outputs ___");/* line 550 */
    print_output_list ( main_container)/* line 551 *//* line 552 *//* line 553 */
}

function trimws (s) {         /* line 554 */
    /*  remove whitespace from front and back of string *//* line 555 */
    return  s.strip ();       /* line 556 *//* line 557 *//* line 558 */
}

function clone_string (s) {   /* line 559 */
    return  s                 /* line 560 *//* line 561 */;/* line 562 */
}

let  load_errors =  false;    /* line 563 */
let  runtime_errors =  false; /* line 564 *//* line 565 */
function load_error (s) {     /* line 566 *//* line 567 */
    console.log ( s);         /* line 568 */
    console.log ();           /* line 569 */
    load_errors =  true;      /* line 570 *//* line 571 *//* line 572 */
}

function runtime_error (s) {  /* line 573 *//* line 574 */
    console.log ( s);         /* line 575 */
    runtime_errors =  true;   /* line 576 *//* line 577 *//* line 578 */
}

function fakepipename_instantiate (reg,owner,name,template_data) {/* line 579 */
    let instance_name = gensymbol ( "fakepipe")/* line 580 */;
    return make_leaf ( instance_name, owner, null, fakepipename_handler)/* line 581 */;/* line 582 *//* line 583 */
}

let  rand =  0;               /* line 584 *//* line 585 */
function fakepipename_handler (eh,msg) {/* line 586 *//* line 587 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ 'rand' must be unique within a single run *//* line 588 */
    send_string ( eh, "", `${ "/tmp/fakepipe"}${ rand}` , msg)/* line 589 *//* line 590 *//* line 591 */
}
                              /* line 592 */
/*  all of the the built_in leaves are listed here *//* line 593 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 594 *//* line 595 */
function initialize_stock_components (reg) {/* line 596 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 597 */
    register_component ( reg,mkTemplate ( "?", null, probe_instantiate))/* line 598 */
    register_component ( reg,mkTemplate ( "?A", null, probeA_instantiate))/* line 599 */
    register_component ( reg,mkTemplate ( "?B", null, probeB_instantiate))/* line 600 */
    register_component ( reg,mkTemplate ( "?C", null, probeC_instantiate))/* line 601 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 602 *//* line 603 */
    register_component ( reg,mkTemplate ( "Low Level Read Text File", null, low_level_read_text_file_instantiate))/* line 604 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 605 *//* line 606 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 607 */
    register_component ( reg,mkTemplate ( "stringconcat", null, stringconcat_instantiate))/* line 608 */
    /*  for fakepipe */       /* line 609 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 610 *//* line 611 *//* line 612 */
}

function argv () {            /* line 613 */
    argv                      /* line 614 *//* line 615 *//* line 616 */
}

function initialize () {      /* line 617 */
    let root_of_project =  argv[ 1] /* line 618 */;
    let root_of_0D =  argv[ 2] /* line 619 */;
    let arg =  argv[ 3]       /* line 620 */;
    let main_container_name =  argv[ 4] /* line 621 */;
    let diagram_names =  argv.splice (0,  5-1) /* line 622 */;
    let palette = initialize_component_palette ( root_of_project, root_of_0D, diagram_names)/* line 623 */;
    return [ palette,[ root_of_project, root_of_0D, main_container_name, diagram_names, arg]];/* line 624 *//* line 625 *//* line 626 */
}

function start (palette,env) {
    start_helper ( palette, env, false)/* line 627 */
}

function start_show_all (palette,env) {
    start_helper ( palette, env, true)/* line 628 */
}

function start_helper (palette,env,show_all_outputs) {/* line 629 */
    let root_of_project =  env [ 0];/* line 630 */
    let root_of_0D =  env [ 1];/* line 631 */
    let main_container_name =  env [ 2];/* line 632 */
    let diagram_names =  env [ 3];/* line 633 */
    let arg =  env [ 4];      /* line 634 */
    set_environment ( root_of_project, root_of_0D)/* line 635 */
    /*  get entrypoint container *//* line 636 */
    let  main_container = get_component_instance ( palette, main_container_name, null)/* line 637 */;
    if ( null ==  main_container) {/* line 638 */
      load_error ( `${ "Couldn't find container with page name /"}${ `${ main_container_name}${ `${ "/ in files "}${ `${`${ diagram_names}`}${ " (check tab names, or disable compression?)"}` }` }` }` )/* line 642 *//* line 643 */}
    if ((!  load_errors)) {   /* line 644 */
      let  arg = new_datum_string ( arg)/* line 645 */;
      let  msg = make_message ( "", arg)/* line 646 */;
      inject ( main_container, msg)/* line 647 */
      if ( show_all_outputs) {/* line 648 */
        dump_outputs ( main_container)/* line 649 */}
      else {                  /* line 650 */
        print_error_maybe ( main_container)/* line 651 */
        let outp = fetch_first_output ( main_container, "")/* line 652 */;
        if ( null ==  outp) { /* line 653 */
          console.log ( "(no outputs)");/* line 654 */}
        else {                /* line 655 */
          print_specific_output ( main_container, "")/* line 656 *//* line 657 */}/* line 658 */}
      if ( show_all_outputs) {/* line 659 */
        console.log ( "--- done ---");/* line 660 *//* line 661 */}/* line 662 */}/* line 663 *//* line 664 */
}
                              /* line 665 *//* line 666 */
/*  utility functions  */     /* line 667 */
function send_int (eh,port,i,causing_message) {/* line 668 */
    let datum = new_datum_int ( i)/* line 669 */;
    send ( eh, port, datum, causing_message)/* line 670 *//* line 671 *//* line 672 */
}

function send_bang (eh,port,causing_message) {/* line 673 */
    let datum = new_datum_bang ();/* line 674 */
    send ( eh, port, datum, causing_message)/* line 675 *//* line 676 *//* line 677 */
}





