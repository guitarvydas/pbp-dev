

let  count_counter =  0;                               /* line 1 */
let  count_direction =  1;                             /* line 2 *//* line 3 */
function count_handler (eh,msg) {                      /* line 4 *//* line 5 */
    if ( msg.port ==  "adv") {                         /* line 6 */
      count_counter =  count_counter+ count_direction; /* line 7 */
      send_int ( eh, "", count_counter, msg)           /* line 8 */}
    else if ( msg.port ==  "rev") {                    /* line 9 */
      count_direction = (- count_direction)            /* line 10 */;/* line 11 */}/* line 12 *//* line 13 */
}

function count_instantiator (reg,owner,name,template_data) {/* line 14 */
    let name_with_id = gensymbol ( "Count")            /* line 15 */;
    return make_leaf ( name_with_id, owner, null, count_handler)/* line 16 */;/* line 17 *//* line 18 */
}

function count_install (reg) {                         /* line 19 */
    register_component ( reg,mkTemplate ( "Count", null, count_instantiator))/* line 20 *//* line 21 */
}







import * as fs from 'fs';
import path from 'path';
const command_line_argv = process.argv.slice(1);
import execSync from 'child_process';
                                                       /* line 1 *//* line 2 */
let  counter =  0;                                     /* line 3 *//* line 4 */
let  digits = [ "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀", "₂₁", "₂₂", "₂₃", "₂₄", "₂₅", "₂₆", "₂₇", "₂₈", "₂₉"];/* line 11 *//* line 12 *//* line 13 */
function gensymbol (s) {                               /* line 14 *//* line 15 */
    let name_with_id =  `${ s}${subscripted_digit ( counter)}` /* line 16 */;
    counter =  counter+ 1;                             /* line 17 */
    return  name_with_id;                              /* line 18 *//* line 19 *//* line 20 */
}

function subscripted_digit (n) {                       /* line 21 *//* line 22 */
    if (((( n >=  0) && ( n <=  29)))) {               /* line 23 */
      return  digits [ n];                             /* line 24 */}
    else {                                             /* line 25 */
      return  `${ "₊"}${ n}`                           /* line 26 */;/* line 27 */}/* line 28 *//* line 29 */
}

class Datum {
  constructor () {                                     /* line 30 */

    this.v =  null;                                    /* line 31 */
    this.clone =  null;                                /* line 32 */
    this.reclaim =  null;                              /* line 33 */
    this.other =  null;/*  reserved for use on per-project basis  *//* line 34 *//* line 35 */
  }
}
                                                       /* line 36 */
function new_datum_string (s) {                        /* line 37 */
    let d =  new Datum ();                             /* line 38 */;
    d.v =  s;                                          /* line 39 */
    d.clone =  function () {return clone_datum_string ( d)/* line 40 */;};
    d.reclaim =  function () {return reclaim_datum_string ( d)/* line 41 */;};
    return  d;                                         /* line 42 *//* line 43 *//* line 44 */
}

function clone_datum_string (d) {                      /* line 45 */
    let newd = new_datum_string ( d.v)                 /* line 46 */;
    return  newd;                                      /* line 47 *//* line 48 *//* line 49 */
}

function reclaim_datum_string (src) {                  /* line 50 *//* line 51 *//* line 52 *//* line 53 */
}

function new_datum_bang () {                           /* line 54 */
    let p =  new Datum ();                             /* line 55 */;
    p.v =  "";                                         /* line 56 */
    p.clone =  function () {return clone_datum_bang ( p)/* line 57 */;};
    p.reclaim =  function () {return reclaim_datum_bang ( p)/* line 58 */;};
    return  p;                                         /* line 59 *//* line 60 *//* line 61 */
}

function clone_datum_bang (d) {                        /* line 62 */
    return new_datum_bang ();                          /* line 63 *//* line 64 *//* line 65 */
}

function reclaim_datum_bang (d) {                      /* line 66 *//* line 67 *//* line 68 *//* line 69 */
}

/*  Message passed to a leaf component. */             /* line 70 */
/*  */                                                 /* line 71 */
/*  `port` refers to the name of the incoming or outgoing port of this component. *//* line 72 */
/*  `datum` is the data attached to this message. */   /* line 73 */
class Message {
  constructor () {                                     /* line 74 */

    this.port =  null;                                 /* line 75 */
    this.datum =  null;                                /* line 76 *//* line 77 */
  }
}
                                                       /* line 78 */
function clone_port (s) {                              /* line 79 */
    return clone_string ( s)                           /* line 80 */;/* line 81 *//* line 82 */
}

/*  Utility for making a `Message`. Used to safely “seed“ messages *//* line 83 */
/*  entering the very top of a network. */             /* line 84 */
function make_message (port,datum) {                   /* line 85 */
    let p = clone_string ( port)                       /* line 86 */;
    let  m =  new Message ();                          /* line 87 */;
    m.port =  p;                                       /* line 88 */
    m.datum =  datum.clone ();                         /* line 89 */
    return  m;                                         /* line 90 *//* line 91 *//* line 92 */
}

/*  Clones a message. Primarily used internally for “fanning out“ a message to multiple destinations. *//* line 93 */
function message_clone (msg) {                         /* line 94 */
    let  m =  new Message ();                          /* line 95 */;
    m.port = clone_port ( msg.port)                    /* line 96 */;
    m.datum =  msg.datum.clone ();                     /* line 97 */
    return  m;                                         /* line 98 *//* line 99 *//* line 100 */
}

/*  Frees a message. */                                /* line 101 */
function destroy_message (msg) {                       /* line 102 */
    /*  during debug, dont destroy any message, since we want to trace messages, thus, we need to persist ancestor messages *//* line 103 *//* line 104 *//* line 105 *//* line 106 */
}

function destroy_datum (msg) {                         /* line 107 *//* line 108 *//* line 109 *//* line 110 */
}

function destroy_port (msg) {                          /* line 111 *//* line 112 *//* line 113 *//* line 114 */
}

/*  */                                                 /* line 115 */
function format_message (m) {                          /* line 116 */
    if ( m ==  null) {                                 /* line 117 */
      return  `${ "‹"}${ `${ m.port}${ `${ "›:‹"}${ `${ "ϕ"}${ "›,"}` }` }` }` /* line 118 */;}
    else {                                             /* line 119 */
      return  `${ "‹"}${ `${ m.port}${ `${ "›:‹"}${ `${ m.datum.v}${ "›,"}` }` }` }` /* line 120 */;/* line 121 */}/* line 122 *//* line 123 */
}

const  enumDown =  0                                   /* line 124 */;
const  enumAcross =  1                                 /* line 125 */;
const  enumUp =  2                                     /* line 126 */;
const  enumThrough =  3                                /* line 127 */;/* line 128 */
function create_down_connector (container,proto_conn,connectors,children_by_id) {/* line 129 */
    /*  JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''}, *//* line 130 */
    let  connector =  new Connector ();                /* line 131 */;
    connector.direction =  "down";                     /* line 132 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 133 */;
    let target_proto =  proto_conn [ "target"];        /* line 134 */
    let id_proto =  target_proto [ "id"];              /* line 135 */
    let target_component =  children_by_id [id_proto]; /* line 136 */
    if (( target_component ==  null)) {                /* line 137 */
      load_error ( `${ "internal error: .Down connection target internal error "}${( proto_conn [ "target"]) [ "name"]}` )/* line 138 */}
    else {                                             /* line 139 */
      connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 140 */;/* line 141 */}
    return  connector;                                 /* line 142 *//* line 143 *//* line 144 */
}

function create_across_connector (container,proto_conn,connectors,children_by_id) {/* line 145 */
    let  connector =  new Connector ();                /* line 146 */;
    connector.direction =  "across";                   /* line 147 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 148 */
    let target_component =  children_by_id [(( proto_conn [ "target"]) [ "id"])];/* line 149 */
    if ( source_component ==  null) {                  /* line 150 */
      load_error ( `${ "internal error: .Across connection source not ok "}${( proto_conn [ "source"]) [ "name"]}` )/* line 151 */}
    else {                                             /* line 152 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 153 */;
      if ( target_component ==  null) {                /* line 154 */
        load_error ( `${ "internal error: .Across connection target not ok "}${( proto_conn [ "target"]) [ "name"]}` )/* line 155 */}
      else {                                           /* line 156 */
        connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 157 */;/* line 158 */}/* line 159 */}
    return  connector;                                 /* line 160 *//* line 161 *//* line 162 */
}

function create_up_connector (container,proto_conn,connectors,children_by_id) {/* line 163 */
    let  connector =  new Connector ();                /* line 164 */;
    connector.direction =  "up";                       /* line 165 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 166 */
    if ( source_component ==  null) {                  /* line 167 */
      load_error ( `${ "internal error: .Up connection source not ok "}${( proto_conn [ "source"]) [ "name"]}` )/* line 168 */}
    else {                                             /* line 169 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 170 */;
      connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 171 */;/* line 172 */}
    return  connector;                                 /* line 173 *//* line 174 *//* line 175 */
}

function create_through_connector (container,proto_conn,connectors,children_by_id) {/* line 176 */
    let  connector =  new Connector ();                /* line 177 */;
    connector.direction =  "through";                  /* line 178 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 179 */;
    connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 180 */;
    return  connector;                                 /* line 181 *//* line 182 *//* line 183 */
}
                                                       /* line 184 */
function container_instantiator (reg,owner,container_name,desc) {/* line 185 *//* line 186 */
    let container = make_container ( container_name, owner)/* line 187 */;
    let children = [];                                 /* line 188 */
    let children_by_id = {};
    /*  not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here *//* line 189 */
    /*  collect children */                            /* line 190 */
    for (let child_desc of  desc [ "children"]) {      /* line 191 */
      let child_instance = get_component_instance ( reg, child_desc [ "name"], container)/* line 192 */;
      children.push ( child_instance)                  /* line 193 */
      let id =  child_desc [ "id"];                    /* line 194 */
      children_by_id [id] =  child_instance;           /* line 195 *//* line 196 *//* line 197 */}
    container.children =  children;                    /* line 198 *//* line 199 */
    let connectors = [];                               /* line 200 */
    for (let proto_conn of  desc [ "connections"]) {   /* line 201 */
      let  connector =  new Connector ();              /* line 202 */;
      if ( proto_conn [ "dir"] ==  enumDown) {         /* line 203 */
        connectors.push (create_down_connector ( container, proto_conn, connectors, children_by_id)) /* line 204 */}
      else if ( proto_conn [ "dir"] ==  enumAcross) {  /* line 205 */
        connectors.push (create_across_connector ( container, proto_conn, connectors, children_by_id)) /* line 206 */}
      else if ( proto_conn [ "dir"] ==  enumUp) {      /* line 207 */
        connectors.push (create_up_connector ( container, proto_conn, connectors, children_by_id)) /* line 208 */}
      else if ( proto_conn [ "dir"] ==  enumThrough) { /* line 209 */
        connectors.push (create_through_connector ( container, proto_conn, connectors, children_by_id)) /* line 210 *//* line 211 */}/* line 212 */}
    container.connections =  connectors;               /* line 213 */
    return  container;                                 /* line 214 *//* line 215 *//* line 216 */
}

/*  The default handler for container components. */   /* line 217 */
function container_handler (container,message) {       /* line 218 */
    route ( container, container, message)
    /*  references to 'self' are replaced by the container during instantiation *//* line 219 */
    while (any_child_ready ( container)) {             /* line 220 */
      step_children ( container, message)              /* line 221 */}/* line 222 *//* line 223 */
}

/*  Frees the given container and associated data. */  /* line 224 */
function destroy_container (eh) {                      /* line 225 *//* line 226 *//* line 227 *//* line 228 */
}

/*  Routing connection for a container component. The `direction` field has *//* line 229 */
/*  no affect on the default message routing system _ it is there for debugging *//* line 230 */
/*  purposes, or for reading by other tools. */        /* line 231 *//* line 232 */
class Connector {
  constructor () {                                     /* line 233 */

    this.direction =  null;/*  down, across, up, through *//* line 234 */
    this.sender =  null;                               /* line 235 */
    this.receiver =  null;                             /* line 236 *//* line 237 */
  }
}
                                                       /* line 238 */
/*  `Sender` is used to “pattern match“ which `Receiver` a message should go to, *//* line 239 */
/*  based on component ID (pointer) and port name. */  /* line 240 *//* line 241 */
class Sender {
  constructor () {                                     /* line 242 */

    this.name =  null;                                 /* line 243 */
    this.component =  null;                            /* line 244 */
    this.port =  null;                                 /* line 245 *//* line 246 */
  }
}
                                                       /* line 247 *//* line 248 *//* line 249 */
/*  `Receiver` is a handle to a destination queue, and a `port` name to assign *//* line 250 */
/*  to incoming messages to this queue. */             /* line 251 *//* line 252 */
class Receiver {
  constructor () {                                     /* line 253 */

    this.name =  null;                                 /* line 254 */
    this.queue =  null;                                /* line 255 */
    this.port =  null;                                 /* line 256 */
    this.component =  null;                            /* line 257 *//* line 258 */
  }
}
                                                       /* line 259 */
function mkSender (name,component,port) {              /* line 260 */
    let  s =  new Sender ();                           /* line 261 */;
    s.name =  name;                                    /* line 262 */
    s.component =  component;                          /* line 263 */
    s.port =  port;                                    /* line 264 */
    return  s;                                         /* line 265 *//* line 266 *//* line 267 */
}

function mkReceiver (name,component,port,q) {          /* line 268 */
    let  r =  new Receiver ();                         /* line 269 */;
    r.name =  name;                                    /* line 270 */
    r.component =  component;                          /* line 271 */
    r.port =  port;                                    /* line 272 */
    /*  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. *//* line 273 */
    r.queue =  q;                                      /* line 274 */
    return  r;                                         /* line 275 *//* line 276 *//* line 277 */
}

/*  Checks if two senders match, by pointer equality and port name matching. *//* line 278 */
function sender_eq (s1,s2) {                           /* line 279 */
    let same_components = ( s1.component ==  s2.component);/* line 280 */
    let same_ports = ( s1.port ==  s2.port);           /* line 281 */
    return (( same_components) && ( same_ports));      /* line 282 *//* line 283 *//* line 284 */
}

/*  Delivers the given message to the receiver of this connector. *//* line 285 *//* line 286 */
function deposit (parent,conn,message) {               /* line 287 */
    let new_message = make_message ( conn.receiver.port, message.datum)/* line 288 */;
    push_message ( parent, conn.receiver.component, conn.receiver.queue, new_message)/* line 289 *//* line 290 *//* line 291 */
}

function force_tick (parent,eh) {                      /* line 292 */
    let tick_msg = make_message ( ".",new_datum_bang ())/* line 293 */;
    push_message ( parent, eh, eh.inq, tick_msg)       /* line 294 */
    return  tick_msg;                                  /* line 295 *//* line 296 *//* line 297 */
}

function push_message (parent,receiver,inq,m) {        /* line 298 */
    inq.push ( m)                                      /* line 299 */
    parent.visit_ordering.push ( receiver)             /* line 300 *//* line 301 *//* line 302 */
}

function is_self (child,container) {                   /* line 303 */
    /*  in an earlier version “self“ was denoted as ϕ *//* line 304 */
    return  child ==  container;                       /* line 305 *//* line 306 *//* line 307 */
}

function step_child (child,msg) {                      /* line 308 */
    let before_state =  child.state;                   /* line 309 */
    child.handler ( child, msg)                        /* line 310 */
    let after_state =  child.state;                    /* line 311 */
    return [(( before_state ==  "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state ==  "idle"))];/* line 314 *//* line 315 *//* line 316 */
}

function step_children (container,causingMessage) {    /* line 317 */
    container.state =  "idle";                         /* line 318 */
    for (let child of   container.visit_ordering) {    /* line 319 */
      /*  child = container represents self, skip it *//* line 320 */
      if (((! (is_self ( child, container))))) {       /* line 321 */
        if (((! ((0=== child.inq.length))))) {         /* line 322 */
          let msg =  child.inq.shift ()                /* line 323 */;
          let  began_long_run =  null;                 /* line 324 */
          let  continued_long_run =  null;             /* line 325 */
          let  ended_long_run =  null;                 /* line 326 */
          [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, msg)/* line 327 */;
          if ( began_long_run) {                       /* line 328 *//* line 329 */}
          else if ( continued_long_run) {              /* line 330 *//* line 331 */}
          else if ( ended_long_run) {                  /* line 332 *//* line 333 *//* line 334 */}
          destroy_message ( msg)                       /* line 335 */}
        else {                                         /* line 336 */
          if ( child.state!= "idle") {                 /* line 337 */
            let msg = force_tick ( container, child)   /* line 338 */;
            child.handler ( child, msg)                /* line 339 */
            destroy_message ( msg)                     /* line 340 *//* line 341 */}/* line 342 */}/* line 343 */
        if ( child.state ==  "active") {               /* line 344 */
          /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 345 */
          container.state =  "active";                 /* line 346 *//* line 347 */}/* line 348 */
        while (((! ((0=== child.outq.length))))) {     /* line 349 */
          let msg =  child.outq.shift ()               /* line 350 */;
          route ( container, child, msg)               /* line 351 */
          destroy_message ( msg)                       /* line 352 *//* line 353 */}/* line 354 */}/* line 355 */}/* line 356 *//* line 357 */
}

function attempt_tick (parent,eh) {                    /* line 358 */
    if ( eh.state!= "idle") {                          /* line 359 */
      force_tick ( parent, eh)                         /* line 360 *//* line 361 */}/* line 362 *//* line 363 */
}

function is_tick (msg) {                               /* line 364 */
    return  "." ==  msg.port
    /*  assume that any message that is sent to port "." is a tick  *//* line 365 */;/* line 366 *//* line 367 */
}

/*  Routes a single message to all matching destinations, according to *//* line 368 */
/*  the container's connection network. */             /* line 369 *//* line 370 */
function route (container,from_component,message) {    /* line 371 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 372 */
    let  fromname =  "";                               /* line 373 */
    if (is_tick ( message)) {                          /* line 374 */
      for (let child of  container.children) {         /* line 375 */
        attempt_tick ( container, child)               /* line 376 */}
      was_sent =  true;                                /* line 377 */}
    else {                                             /* line 378 */
      if (((! (is_self ( from_component, container))))) {/* line 379 */
        fromname =  from_component.name;               /* line 380 *//* line 381 */}
      let from_sender = mkSender ( fromname, from_component, message.port)/* line 382 */;/* line 383 */
      for (let connector of  container.connections) {  /* line 384 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 385 */
          deposit ( container, connector, message)     /* line 386 */
          was_sent =  true;                            /* line 387 *//* line 388 */}/* line 389 */}/* line 390 */}
    if ((! ( was_sent))) {                             /* line 391 */
      console.log ( "\n\n*** Error: ***");             /* line 392 */
      console.log ( "***");                            /* line 393 */
      console.log ( `${ container.name}${ `${ ": message '"}${ `${ message.port}${ `${ "' from "}${ `${ fromname}${ " dropped on floor..."}` }` }` }` }` );/* line 394 */
      console.log ( "***");                            /* line 395 */
      process.exit (1)                                 /* line 396 *//* line 397 */}/* line 398 *//* line 399 */
}

function any_child_ready (container) {                 /* line 400 */
    for (let child of  container.children) {           /* line 401 */
      if (child_is_ready ( child)) {                   /* line 402 */
        return  true;                                  /* line 403 *//* line 404 */}/* line 405 */}
    return  false;                                     /* line 406 *//* line 407 *//* line 408 */
}

function child_is_ready (eh) {                         /* line 409 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 410 *//* line 411 *//* line 412 */
}

function append_routing_descriptor (container,desc) {  /* line 413 */
    container.routings.push ( desc)                    /* line 414 *//* line 415 *//* line 416 */
}

function container_injector (container,message) {      /* line 417 */
    container_handler ( container, message)            /* line 418 *//* line 419 *//* line 420 */
}
                                                       /* line 421 *//* line 422 *//* line 423 */
class Component_Registry {
  constructor () {                                     /* line 424 */

    this.templates = {};                               /* line 425 *//* line 426 */
  }
}
                                                       /* line 427 */
class Template {
  constructor () {                                     /* line 428 */

    this.name =  null;                                 /* line 429 */
    this.template_data =  null;                        /* line 430 */
    this.instantiator =  null;                         /* line 431 *//* line 432 */
  }
}
                                                       /* line 433 */
function mkTemplate (name,template_data,instantiator) {/* line 434 */
    let  templ =  new Template ();                     /* line 435 */;
    templ.name =  name;                                /* line 436 */
    templ.template_data =  template_data;              /* line 437 */
    templ.instantiator =  instantiator;                /* line 438 */
    return  templ;                                     /* line 439 *//* line 440 *//* line 441 */
}

function read_and_convert_json_file (pathname,filename) {/* line 442 */

    let jstr = undefined;
    if (filename == "0") {
    jstr = fs.readFileSync (0);
    } else if (pathname) {
    jstr = fs.readFileSync (`${pathname}/${filename}`);
    } else {
    jstr = fs.readFileSync (`${filename}`);
    }
    if (jstr) {
    return JSON.parse (jstr);
    } else {
    return undefined;
    }
                                                       /* line 443 *//* line 444 *//* line 445 */
}

function json2internal (pathname,container_xml) {      /* line 446 */
    let fname =   container_xml                        /* line 447 */;
    let routings = read_and_convert_json_file ( pathname, fname)/* line 448 */;
    return  routings;                                  /* line 449 *//* line 450 *//* line 451 */
}

function delete_decls (d) {                            /* line 452 *//* line 453 *//* line 454 *//* line 455 */
}

function make_component_registry () {                  /* line 456 */
    return  new Component_Registry ();                 /* line 457 */;/* line 458 *//* line 459 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 460 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 461 *//* line 462 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 463 */
    let name = mangle_name ( template.name)            /* line 464 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 465 */
      load_error ( `${ "Component /"}${ `${ template.name}${ "/ already declared"}` }` )/* line 466 */
      return  reg;                                     /* line 467 */}
    else {                                             /* line 468 */
      reg.templates [name] =  template;                /* line 469 */
      return  reg;                                     /* line 470 *//* line 471 */}/* line 472 *//* line 473 */
}

function get_component_instance (reg,full_name,owner) {/* line 474 */
    let template_name = mangle_name ( full_name)       /* line 475 */;
    if ((( template_name) in ( reg.templates))) {      /* line 476 */
      let template =  reg.templates [template_name];   /* line 477 */
      if (( template ==  null)) {                      /* line 478 */
        load_error ( `${ "Registry Error (A): Can't find component /"}${ `${ template_name}${ "/"}` }` )/* line 479 */
        return  null;                                  /* line 480 */}
      else {                                           /* line 481 */
        let owner_name =  "";                          /* line 482 */
        let instance_name =  template_name;            /* line 483 */
        if ( null!= owner) {                           /* line 484 */
          owner_name =  owner.name;                    /* line 485 */
          instance_name =  `${ owner_name}${ `${ "."}${ template_name}` }` /* line 486 */;}
        else {                                         /* line 487 */
          instance_name =  template_name;              /* line 488 *//* line 489 */}
        let instance =  template.instantiator ( reg, owner, instance_name, template.template_data)/* line 490 */;
        return  instance;                              /* line 491 *//* line 492 */}}
    else {                                             /* line 493 */
      load_error ( `${ "Registry Error (B): Can't find component /"}${ `${ template_name}${ "/"}` }` )/* line 494 */
      return  null;                                    /* line 495 *//* line 496 */}/* line 497 *//* line 498 */
}

function dump_registry (reg) {                         /* line 499 */
    nl ()                                              /* line 500 */
    console.log ( "*** PALETTE ***");                  /* line 501 */
    for (let c of  reg.templates) {                    /* line 502 */
      console.log ( c.name);                           /* line 503 */}
    console.log ( "***************");                  /* line 504 */
    nl ()                                              /* line 505 *//* line 506 *//* line 507 */
}

function print_stats (reg) {                           /* line 508 */
    console.log ( `${ "registry statistics: "}${ reg.stats}` );/* line 509 *//* line 510 *//* line 511 */
}

function mangle_name (s) {                             /* line 512 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 513 */
    return  s;                                         /* line 514 *//* line 515 *//* line 516 */
}
                                                       /* line 517 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 518 */
/*  and output queues of messages. */                  /* line 519 */
/*  */                                                 /* line 520 */
/*  Components can either be a user_supplied function (“lea“), or a “container“ *//* line 521 */
/*  that routes messages to child components according to a list of connections *//* line 522 */
/*  that serve as a message routing table. */          /* line 523 */
/*  */                                                 /* line 524 */
/*  Child components themselves can be leaves or other containers. *//* line 525 */
/*  */                                                 /* line 526 */
/*  `handler` invokes the code that is attached to this component. *//* line 527 */
/*  */                                                 /* line 528 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 529 */
/*  function may want whenever it is invoked again. */ /* line 530 */
/*  */                                                 /* line 531 *//* line 532 */
/*  Eh_States :: enum { idle, active } */              /* line 533 */
class Eh {
  constructor () {                                     /* line 534 */

    this.name =  "";                                   /* line 535 */
    this.inq =  []                                     /* line 536 */;
    this.outq =  []                                    /* line 537 */;
    this.owner =  null;                                /* line 538 */
    this.children = [];                                /* line 539 */
    this.visit_ordering =  []                          /* line 540 */;
    this.connections = [];                             /* line 541 */
    this.routings =  []                                /* line 542 */;
    this.handler =  null;                              /* line 543 */
    this.finject =  null;                              /* line 544 */
    this.instance_data =  null;                        /* line 545 */
    this.state =  "idle";                              /* line 546 *//*  bootstrap debugging *//* line 547 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 548 *//* line 549 */
  }
}
                                                       /* line 550 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 551 */
/*  whose handler function is `container_handler`. */  /* line 552 */
function make_container (name,owner) {                 /* line 553 */
    let  eh =  new Eh ();                              /* line 554 */;
    eh.name =  name;                                   /* line 555 */
    eh.owner =  owner;                                 /* line 556 */
    eh.handler =  container_handler;                   /* line 557 */
    eh.finject =  container_injector;                  /* line 558 */
    eh.state =  "idle";                                /* line 559 */
    eh.kind =  "container";                            /* line 560 */
    return  eh;                                        /* line 561 *//* line 562 *//* line 563 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 564 */
/*  that will be passed back to your handler when called. *//* line 565 *//* line 566 */
function make_leaf (name,owner,instance_data,handler) {/* line 567 */
    let  eh =  new Eh ();                              /* line 568 */;
    eh.name =  `${ owner.name}${ `${ "."}${ name}` }`  /* line 569 */;
    eh.owner =  owner;                                 /* line 570 */
    eh.handler =  handler;                             /* line 571 */
    eh.instance_data =  instance_data;                 /* line 572 */
    eh.state =  "idle";                                /* line 573 */
    eh.kind =  "leaf";                                 /* line 574 */
    return  eh;                                        /* line 575 *//* line 576 *//* line 577 */
}

/*  Sends a message on the given `port` with `data`, placing it on the output *//* line 578 */
/*  of the given component. */                         /* line 579 *//* line 580 */
function send (eh,port,datum,causingMessage) {         /* line 581 */
    let msg = make_message ( port, datum)              /* line 582 */;
    put_output ( eh, msg)                              /* line 583 *//* line 584 *//* line 585 */
}

function send_string (eh,port,s,causingMessage) {      /* line 586 */
    let datum = new_datum_string ( s)                  /* line 587 */;
    let msg = make_message ( port, datum)              /* line 588 */;
    put_output ( eh, msg)                              /* line 589 *//* line 590 *//* line 591 */
}

function forward (eh,port,msg) {                       /* line 592 */
    let fwdmsg = make_message ( port, msg.datum)       /* line 593 */;
    put_output ( eh, fwdmsg)                           /* line 594 *//* line 595 *//* line 596 */
}

function inject (eh,msg) {                             /* line 597 */
    eh.finject ( eh, msg)                              /* line 598 *//* line 599 *//* line 600 */
}

/*  Returns a list of all output messages on a container. *//* line 601 */
/*  For testing / debugging purposes. */               /* line 602 *//* line 603 */
function output_list (eh) {                            /* line 604 */
    return  eh.outq;                                   /* line 605 *//* line 606 *//* line 607 */
}

/*  Utility for printing an array of messages. */      /* line 608 */
function print_output_list (eh) {                      /* line 609 */
    console.log ( "{");                                /* line 610 */
    for (let m of   eh.outq) {                         /* line 611 */
      console.log (format_message ( m));               /* line 612 *//* line 613 */}
    console.log ( "}");                                /* line 614 *//* line 615 *//* line 616 */
}

function spaces (n) {                                  /* line 617 */
    let  s =  "";                                      /* line 618 */
    for (let i of range( n)) {                         /* line 619 */
      s =  s+ " ";                                     /* line 620 */}
    return  s;                                         /* line 621 *//* line 622 *//* line 623 */
}

function set_active (eh) {                             /* line 624 */
    eh.state =  "active";                              /* line 625 *//* line 626 *//* line 627 */
}

function set_idle (eh) {                               /* line 628 */
    eh.state =  "idle";                                /* line 629 *//* line 630 *//* line 631 */
}

/*  Utility for printing a specific output message. */ /* line 632 *//* line 633 */
function fetch_first_output (eh,port) {                /* line 634 */
    for (let msg of   eh.outq) {                       /* line 635 */
      if (( msg.port ==  port)) {                      /* line 636 */
        return  msg.datum;}                            /* line 637 */}
    return  null;                                      /* line 638 *//* line 639 *//* line 640 */
}

function print_specific_output (eh,port) {             /* line 641 */
    /*  port ∷ “” */                                   /* line 642 */
    let  datum = fetch_first_output ( eh, port)        /* line 643 */;
    console.log ( datum.v);                            /* line 644 *//* line 645 */
}

function print_specific_output_to_stderr (eh,port) {   /* line 646 */
    /*  port ∷ “” */                                   /* line 647 */
    let  datum = fetch_first_output ( eh, port)        /* line 648 */;
    /*  I don't remember why I found it useful to print to stderr during bootstrapping, so I've left it in... *//* line 649 */
    console.error ( datum.v);                          /* line 650 *//* line 651 *//* line 652 */
}

function put_output (eh,msg) {                         /* line 653 */
    eh.outq.push ( msg)                                /* line 654 *//* line 655 *//* line 656 */
}

let  root_project =  "";                               /* line 657 */
let  root_0D =  "";                                    /* line 658 *//* line 659 */
function set_environment (rproject,r0D) {              /* line 660 *//* line 661 *//* line 662 */
    root_project =  rproject;                          /* line 663 */
    root_0D =  r0D;                                    /* line 664 *//* line 665 *//* line 666 */
}
                                                       /* line 667 */
function string_make_persistent (s) {                  /* line 668 */
    /*  this is here for non_GC languages like Odin, it is a no_op for GC languages like Python *//* line 669 */
    return  s;                                         /* line 670 *//* line 671 *//* line 672 */
}

function string_clone (s) {                            /* line 673 */
    return  s;                                         /* line 674 *//* line 675 *//* line 676 */
}

/*  usage: app ${_00_} ${_0D_} arg main diagram_filename1 diagram_filename2 ... *//* line 677 */
/*  where ${_00_} is the root directory for the project *//* line 678 */
/*  where ${_0D_} is the root directory for 0D (e.g. 0D/odin or 0D/python) *//* line 679 *//* line 680 */
function initialize_component_palette (root_project,root_0D,diagram_source_files) {/* line 681 */
    let  reg = make_component_registry ();             /* line 682 */
    for (let diagram_source of  diagram_source_files) {/* line 683 */
      let all_containers_within_single_file = json2internal ( root_project, diagram_source)/* line 684 */;
      reg = generate_shell_components ( reg, all_containers_within_single_file)/* line 685 */;
      for (let container of  all_containers_within_single_file) {/* line 686 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 687 *//* line 688 */}/* line 689 */}
    initialize_stock_components ( reg)                 /* line 690 */
    return  reg;                                       /* line 691 *//* line 692 *//* line 693 */
}

function print_error_maybe (main_container) {          /* line 694 */
    let error_port =  "✗";                             /* line 695 */
    let err = fetch_first_output ( main_container, error_port)/* line 696 */;
    if (((( err!= null)) && (( 0 < (trimws ( err.v).length))))) {/* line 697 */
      console.log ( "___ !!! ERRORS !!! ___");         /* line 698 */
      print_specific_output ( main_container, error_port)/* line 699 *//* line 700 */}/* line 701 *//* line 702 */
}

/*  debugging helpers */                               /* line 703 *//* line 704 */
function nl () {                                       /* line 705 */
    console.log ( "");                                 /* line 706 *//* line 707 *//* line 708 */
}

function dump_outputs (main_container) {               /* line 709 */
    nl ()                                              /* line 710 */
    console.log ( "___ Outputs ___");                  /* line 711 */
    print_output_list ( main_container)                /* line 712 *//* line 713 *//* line 714 */
}

function trimws (s) {                                  /* line 715 */
    /*  remove whitespace from front and back of string *//* line 716 */
    return  s.strip ();                                /* line 717 *//* line 718 *//* line 719 */
}

function clone_string (s) {                            /* line 720 */
    return  s                                          /* line 721 *//* line 722 */;/* line 723 */
}

let  load_errors =  false;                             /* line 724 */
let  runtime_errors =  false;                          /* line 725 *//* line 726 */
function load_error (s) {                              /* line 727 *//* line 728 */
    console.log ( s);                                  /* line 729 */
    console.log ();                                    /* line 730 */
    load_errors =  true;                               /* line 731 *//* line 732 *//* line 733 */
}

function runtime_error (s) {                           /* line 734 *//* line 735 */
    console.log ( s);                                  /* line 736 */
    runtime_errors =  true;                            /* line 737 *//* line 738 *//* line 739 */
}
                                                       /* line 740 */
function argv () {                                     /* line 741 */
    return  command_line_argv                          /* line 742 */;/* line 743 *//* line 744 */
}

function initialize () {                               /* line 745 */
    let root_of_project =  command_line_argv[ 1]       /* line 746 */;
    let root_of_0D =  command_line_argv[ 2]            /* line 747 */;
    let arg =  command_line_argv[ 3]                   /* line 748 */;
    let main_container_name =  command_line_argv[ 4]   /* line 749 */;
    let diagram_names =  command_line_argv.splice ( 5) /* line 750 */;
    let palette = initialize_component_palette ( root_of_project, root_of_0D, diagram_names)/* line 751 */;
    return [ palette,[ root_of_project, root_of_0D, main_container_name, diagram_names, arg]];/* line 752 *//* line 753 *//* line 754 */
}

function start (palette,env) {
    start_helper ( palette, env, false)                /* line 755 */
}

function start_show_all (palette,env) {
    start_helper ( palette, env, true)                 /* line 756 */
}

function start_helper (palette,env,show_all_outputs) { /* line 757 */
    let root_of_project =  env [ 0];                   /* line 758 */
    let root_of_0D =  env [ 1];                        /* line 759 */
    let main_container_name =  env [ 2];               /* line 760 */
    let diagram_names =  env [ 3];                     /* line 761 */
    let arg =  env [ 4];                               /* line 762 */
    set_environment ( root_of_project, root_of_0D)     /* line 763 */
    /*  get entrypoint container */                    /* line 764 */
    let  main_container = get_component_instance ( palette, main_container_name, null)/* line 765 */;
    if ( null ==  main_container) {                    /* line 766 */
      load_error ( `${ "Couldn't find container with page name /"}${ `${ main_container_name}${ `${ "/ in files "}${ `${`${ diagram_names}`}${ " (check tab names, or disable compression?)"}` }` }` }` )/* line 770 *//* line 771 */}
    if ((!  load_errors)) {                            /* line 772 */
      let  marg = new_datum_string ( arg)              /* line 773 */;
      let  msg = make_message ( "", marg)              /* line 774 */;
      inject ( main_container, msg)                    /* line 775 */
      if ( show_all_outputs) {                         /* line 776 */
        dump_outputs ( main_container)                 /* line 777 */}
      else {                                           /* line 778 */
        print_error_maybe ( main_container)            /* line 779 */
        let outp = fetch_first_output ( main_container, "")/* line 780 */;
        if ( null ==  outp) {                          /* line 781 */
          console.log ( "«««no outputs»»»)");          /* line 782 */}
        else {                                         /* line 783 */
          print_specific_output ( main_container, "")  /* line 784 *//* line 785 */}/* line 786 */}
      if ( show_all_outputs) {                         /* line 787 */
        console.log ( "--- done ---");                 /* line 788 *//* line 789 */}/* line 790 */}/* line 791 *//* line 792 */
}
                                                       /* line 793 */
/*  utility functions  */                              /* line 794 */
function send_int (eh,port,i,causing_message) {        /* line 795 */
    let datum = new_datum_string (`${ i}`)             /* line 796 */;
    send ( eh, port, datum, causing_message)           /* line 797 *//* line 798 *//* line 799 */
}

function send_bang (eh,port,causing_message) {         /* line 800 */
    let datum = new_datum_bang ();                     /* line 801 */
    send ( eh, port, datum, causing_message)           /* line 802 *//* line 803 */
}







function probeA_instantiate (reg,owner,name,template_data) {/* line 1 */
    let name_with_id = gensymbol ( "?A")               /* line 2 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 3 */;/* line 4 *//* line 5 */
}

function probeB_instantiate (reg,owner,name,template_data) {/* line 6 */
    let name_with_id = gensymbol ( "?B")               /* line 7 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 8 */;/* line 9 *//* line 10 */
}

function probeC_instantiate (reg,owner,name,template_data) {/* line 11 */
    let name_with_id = gensymbol ( "?C")               /* line 12 */;
    return make_leaf ( name_with_id, owner, null, probe_handler)/* line 13 */;/* line 14 *//* line 15 */
}

function probe_handler (eh,msg) {                      /* line 16 */
    let s =  msg.datum.v;                              /* line 17 */
    console.error ( `${ "... probe "}${ `${ eh.name}${ `${ ": "}${ s}` }` }` );/* line 18 *//* line 19 *//* line 20 */
}

function trash_instantiate (reg,owner,name,template_data) {/* line 21 */
    let name_with_id = gensymbol ( "trash")            /* line 22 */;
    return make_leaf ( name_with_id, owner, null, trash_handler)/* line 23 */;/* line 24 *//* line 25 */
}

function trash_handler (eh,msg) {                      /* line 26 */
    /*  to appease dumped_on_floor checker */          /* line 27 *//* line 28 *//* line 29 */
}

class TwoMessages {
  constructor () {                                     /* line 30 */

    this.firstmsg =  null;                             /* line 31 */
    this.secondmsg =  null;                            /* line 32 *//* line 33 */
  }
}
                                                       /* line 34 */
/*  Deracer_States :: enum { idle, waitingForFirstmsg, waitingForSecondmsg } *//* line 35 */
class Deracer_Instance_Data {
  constructor () {                                     /* line 36 */

    this.state =  null;                                /* line 37 */
    this.buffer =  null;                               /* line 38 *//* line 39 */
  }
}
                                                       /* line 40 */
function reclaim_Buffers_from_heap (inst) {            /* line 41 *//* line 42 *//* line 43 *//* line 44 */
}

function deracer_instantiate (reg,owner,name,template_data) {/* line 45 */
    let name_with_id = gensymbol ( "deracer")          /* line 46 */;
    let  inst =  new Deracer_Instance_Data ();         /* line 47 */;
    inst.state =  "idle";                              /* line 48 */
    inst.buffer =  new TwoMessages ();                 /* line 49 */;
    let eh = make_leaf ( name_with_id, owner, inst, deracer_handler)/* line 50 */;
    return  eh;                                        /* line 51 *//* line 52 *//* line 53 */
}

function send_firstmsg_then_secondmsg (eh,inst) {      /* line 54 */
    forward ( eh, "1", inst.buffer.firstmsg)           /* line 55 */
    forward ( eh, "2", inst.buffer.secondmsg)          /* line 56 */
    reclaim_Buffers_from_heap ( inst)                  /* line 57 *//* line 58 *//* line 59 */
}

function deracer_handler (eh,msg) {                    /* line 60 */
    let  inst =  eh.instance_data;                     /* line 61 */
    if ( inst.state ==  "idle") {                      /* line 62 */
      if ( "1" ==  msg.port) {                         /* line 63 */
        inst.buffer.firstmsg =  msg;                   /* line 64 */
        inst.state =  "waitingForSecondmsg";           /* line 65 */}
      else if ( "2" ==  msg.port) {                    /* line 66 */
        inst.buffer.secondmsg =  msg;                  /* line 67 */
        inst.state =  "waitingForFirstmsg";            /* line 68 */}
      else {                                           /* line 69 */
        runtime_error ( `${ "bad msg.port (case A) for deracer "}${ msg.port}` )/* line 70 *//* line 71 */}}
    else if ( inst.state ==  "waitingForFirstmsg") {   /* line 72 */
      if ( "1" ==  msg.port) {                         /* line 73 */
        inst.buffer.firstmsg =  msg;                   /* line 74 */
        send_firstmsg_then_secondmsg ( eh, inst)       /* line 75 */
        inst.state =  "idle";                          /* line 76 */}
      else {                                           /* line 77 */
        runtime_error ( `${ "bad msg.port (case B) for deracer "}${ msg.port}` )/* line 78 *//* line 79 */}}
    else if ( inst.state ==  "waitingForSecondmsg") {  /* line 80 */
      if ( "2" ==  msg.port) {                         /* line 81 */
        inst.buffer.secondmsg =  msg;                  /* line 82 */
        send_firstmsg_then_secondmsg ( eh, inst)       /* line 83 */
        inst.state =  "idle";                          /* line 84 */}
      else {                                           /* line 85 */
        runtime_error ( `${ "bad msg.port (case C) for deracer "}${ msg.port}` )/* line 86 *//* line 87 */}}
    else {                                             /* line 88 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 89 *//* line 90 */}/* line 91 *//* line 92 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data) {/* line 93 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 94 */;
    return make_leaf ( name_with_id, owner, null, low_level_read_text_file_handler)/* line 95 */;/* line 96 *//* line 97 */
}

function low_level_read_text_file_handler (eh,msg) {   /* line 98 */
    let fname =  msg.datum.v;                          /* line 99 */

    if (fname == "0") {
    data = fs.readFileSync (0);
    } else {
    data = fs.readFileSync (fname);
    }
    if (data) {
      send_string (eh, "", data, msg);
    } else {
      send_string (eh, "✗", `read error on file '${fname}'`, msg);
    }
                                                       /* line 100 *//* line 101 *//* line 102 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data) {/* line 103 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 104 */;
    return make_leaf ( name_with_id, owner, null, ensure_string_datum_handler)/* line 105 */;/* line 106 *//* line 107 */
}

function ensure_string_datum_handler (eh,msg) {        /* line 108 */
    if ( "string" ==  msg.datum.kind ()) {             /* line 109 */
      forward ( eh, "", msg)                           /* line 110 */}
    else {                                             /* line 111 */
      let emsg =  `${ "*** ensure: type error (expected a string datum) but got "}${ msg.datum}` /* line 112 */;
      send_string ( eh, "✗", emsg, msg)                /* line 113 *//* line 114 */}/* line 115 *//* line 116 */
}

class Syncfilewrite_Data {
  constructor () {                                     /* line 117 */

    this.filename =  "";                               /* line 118 *//* line 119 */
  }
}
                                                       /* line 120 */
/*  temp copy for bootstrap, sends “done“ (error during bootstrap if not wired) *//* line 121 */
function syncfilewrite_instantiate (reg,owner,name,template_data) {/* line 122 */
    let name_with_id = gensymbol ( "syncfilewrite")    /* line 123 */;
    let inst =  new Syncfilewrite_Data ();             /* line 124 */;
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)/* line 125 */;/* line 126 *//* line 127 */
}

function syncfilewrite_handler (eh,msg) {              /* line 128 */
    let  inst =  eh.instance_data;                     /* line 129 */
    if ( "filename" ==  msg.port) {                    /* line 130 */
      inst.filename =  msg.datum.v;                    /* line 131 */}
    else if ( "input" ==  msg.port) {                  /* line 132 */
      let contents =  msg.datum.v;                     /* line 133 */
      let  f = open ( inst.filename, "w")              /* line 134 */;
      if ( f!= null) {                                 /* line 135 */
        f.write ( msg.datum.v)                         /* line 136 */
        f.close ()                                     /* line 137 */
        send ( eh, "done",new_datum_bang (), msg)      /* line 138 */}
      else {                                           /* line 139 */
        send_string ( eh, "✗", `${ "open error on file "}${ inst.filename}` , msg)/* line 140 *//* line 141 */}/* line 142 */}/* line 143 *//* line 144 */
}

class StringConcat_Instance_Data {
  constructor () {                                     /* line 145 */

    this.buffer1 =  null;                              /* line 146 */
    this.buffer2 =  null;                              /* line 147 *//* line 148 */
  }
}
                                                       /* line 149 */
function stringconcat_instantiate (reg,owner,name,template_data) {/* line 150 */
    let name_with_id = gensymbol ( "stringconcat")     /* line 151 */;
    let instp =  new StringConcat_Instance_Data ();    /* line 152 */;
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)/* line 153 */;/* line 154 *//* line 155 */
}

function stringconcat_handler (eh,msg) {               /* line 156 */
    let  inst =  eh.instance_data;                     /* line 157 */
    if ( "1" ==  msg.port) {                           /* line 158 */
      inst.buffer1 = clone_string ( msg.datum.v)       /* line 159 */;
      maybe_stringconcat ( eh, inst, msg)              /* line 160 */}
    else if ( "2" ==  msg.port) {                      /* line 161 */
      inst.buffer2 = clone_string ( msg.datum.v)       /* line 162 */;
      maybe_stringconcat ( eh, inst, msg)              /* line 163 */}
    else if ( "reset" ==  msg.port) {                  /* line 164 */
      inst.buffer1 =  null;                            /* line 165 */
      inst.buffer2 =  null;                            /* line 166 */}
    else {                                             /* line 167 */
      runtime_error ( `${ "bad msg.port for stringconcat: "}${ msg.port}` )/* line 168 *//* line 169 */}/* line 170 *//* line 171 */
}

function maybe_stringconcat (eh,inst,msg) {            /* line 172 */
    if ((( inst.buffer1!= null) && ( inst.buffer2!= null))) {/* line 173 */
      let  concatenated_string =  "";                  /* line 174 */
      if ( 0 == ( inst.buffer1.length)) {              /* line 175 */
        concatenated_string =  inst.buffer2;           /* line 176 */}
      else if ( 0 == ( inst.buffer2.length)) {         /* line 177 */
        concatenated_string =  inst.buffer1;           /* line 178 */}
      else {                                           /* line 179 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 180 *//* line 181 */}
      send_string ( eh, "", concatenated_string, msg)  /* line 182 */
      inst.buffer1 =  null;                            /* line 183 */
      inst.buffer2 =  null;                            /* line 184 *//* line 185 */}/* line 186 *//* line 187 */
}

/*  */                                                 /* line 188 *//* line 189 */
function string_constant_instantiate (reg,owner,name,template_data) {/* line 190 *//* line 191 *//* line 192 */
    let name_with_id = gensymbol ( "strconst")         /* line 193 */;
    let  s =  template_data;                           /* line 194 */
    if ( root_project!= "") {                          /* line 195 */
      s =  s.replaceAll ( "_00_",  root_project)       /* line 196 */;/* line 197 */}
    if ( root_0D!= "") {                               /* line 198 */
      s =  s.replaceAll ( "_0D_",  root_0D)            /* line 199 */;/* line 200 */}
    return make_leaf ( name_with_id, owner, s, string_constant_handler)/* line 201 */;/* line 202 *//* line 203 */
}

function string_constant_handler (eh,msg) {            /* line 204 */
    let s =  eh.instance_data;                         /* line 205 */
    send_string ( eh, "", s, msg)                      /* line 206 *//* line 207 *//* line 208 */
}

function fakepipename_instantiate (reg,owner,name,template_data) {/* line 209 */
    let instance_name = gensymbol ( "fakepipe")        /* line 210 */;
    return make_leaf ( instance_name, owner, null, fakepipename_handler)/* line 211 */;/* line 212 *//* line 213 */
}

let  rand =  0;                                        /* line 214 *//* line 215 */
function fakepipename_handler (eh,msg) {               /* line 216 *//* line 217 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ ;rand' must be unique within a single run *//* line 218 */
    send_string ( eh, "", `${ "/tmp/fakepipe"}${ rand}` , msg)/* line 219 *//* line 220 *//* line 221 */
}
                                                       /* line 222 */
class Switch1star_Instance_Data {
  constructor () {                                     /* line 223 */

    this.state =  "1";                                 /* line 224 *//* line 225 */
  }
}
                                                       /* line 226 */
function switch1star_instantiate (reg,owner,name,template_data) {/* line 227 */
    let name_with_id = gensymbol ( "switch1*")         /* line 228 */;
    let instp =  new Switch1star_Instance_Data ();     /* line 229 */;
    return make_leaf ( name_with_id, owner, instp, switch1star_handler)/* line 230 */;/* line 231 *//* line 232 */
}

function switch1star_handler (eh,msg) {                /* line 233 */
    let  inst =  eh.instance_data;                     /* line 234 */
    let whichOutput =  inst.state;                     /* line 235 */
    if ( "" ==  msg.port) {                            /* line 236 */
      if ( "1" ==  whichOutput) {                      /* line 237 */
        forward ( eh, "1", msg)                        /* line 238 */
        inst.state =  "*";                             /* line 239 */}
      else if ( "*" ==  whichOutput) {                 /* line 240 */
        forward ( eh, "*", msg)                        /* line 241 */}
      else {                                           /* line 242 */
        send ( eh, "✗", "internal error bad state in switch1*", msg)/* line 243 *//* line 244 */}}
    else if ( "reset" ==  msg.port) {                  /* line 245 */
      inst.state =  "1";                               /* line 246 */}
    else {                                             /* line 247 */
      send ( eh, "✗", "internal error bad message for switch1*", msg)/* line 248 *//* line 249 */}/* line 250 *//* line 251 */
}

class Latch_Instance_Data {
  constructor () {                                     /* line 252 */

    this.datum =  null;                                /* line 253 *//* line 254 */
  }
}
                                                       /* line 255 */
function latch_instantiate (reg,owner,name,template_data) {/* line 256 */
    let name_with_id = gensymbol ( "latch")            /* line 257 */;
    let instp =  new Latch_Instance_Data ();           /* line 258 */;
    return make_leaf ( name_with_id, owner, instp, latch_handler)/* line 259 */;/* line 260 *//* line 261 */
}

function latch_handler (eh,msg) {                      /* line 262 */
    let  inst =  eh.instance_data;                     /* line 263 */
    if ( "" ==  msg.port) {                            /* line 264 */
      inst.datum =  msg.datum;                         /* line 265 */}
    else if ( "release" ==  msg.port) {                /* line 266 */
      let  d =  inst.datum;                            /* line 267 */
      send ( eh, "", d, msg)                           /* line 268 */
      inst.datum =  null;                              /* line 269 */}
    else {                                             /* line 270 */
      send ( eh, "✗", "internal error bad message for latch", msg)/* line 271 *//* line 272 */}/* line 273 *//* line 274 */
}

/*  all of the the built_in leaves are listed here */  /* line 275 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 276 *//* line 277 */
function initialize_stock_components (reg) {           /* line 278 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 279 */
    register_component ( reg,mkTemplate ( "?A", null, probeA_instantiate))/* line 280 */
    register_component ( reg,mkTemplate ( "?B", null, probeB_instantiate))/* line 281 */
    register_component ( reg,mkTemplate ( "?C", null, probeC_instantiate))/* line 282 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 283 *//* line 284 */
    register_component ( reg,mkTemplate ( "Read Text File", null, low_level_read_text_file_instantiate))/* line 285 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 286 *//* line 287 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 288 */
    register_component ( reg,mkTemplate ( "stringconcat", null, stringconcat_instantiate))/* line 289 */
    register_component ( reg,mkTemplate ( "switch1*", null, switch1star_instantiate))/* line 290 */
    register_component ( reg,mkTemplate ( "latch", null, latch_instantiate))/* line 291 */
    /*  for fakepipe */                                /* line 292 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 293 *//* line 294 *//* line 295 */
}







/*  this needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here *//* line 1 */
function shell_out_instantiate (reg,owner,name,template_data) {/* line 2 */
    let name_with_id = gensymbol ( "shell_out")        /* line 3 */;
    let cmd =  template_data.split (" ")               /* line 4 */;
    return make_leaf ( name_with_id, owner, cmd, shell_out_handler)/* line 5 */;/* line 6 *//* line 7 */
}

function shell_out_handler (eh,msg) {                  /* line 8 */
    let cmd =  eh.instance_data;                       /* line 9 */
    let s =  msg.datum.v;                              /* line 10 */
    let  ret =  null;                                  /* line 11 */
    let  rc =  null;                                   /* line 12 */
    let  stdout =  null;                               /* line 13 */
    let  stderr =  null;                               /* line 14 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 15 */
    if ( rc!= 0) {                                     /* line 16 */
      send_string ( eh, "✗", stderr, msg)              /* line 17 */}
    else {                                             /* line 18 */
      send_string ( eh, "", stdout, msg)               /* line 19 *//* line 20 */}/* line 21 *//* line 22 */
}

function generate_shell_components (reg,container_list) {/* line 23 */
    /*  [ */                                           /* line 24 */
    /*      {;file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, *//* line 25 */
    /*      {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []} *//* line 26 */
    /*  ] */                                           /* line 27 */
    if ( null!= container_list) {                      /* line 28 */
      for (let diagram of  container_list) {           /* line 29 */
        /*  loop through every component in the diagram and look for names that start with “$“ or “'“  *//* line 30 */
        /*  {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]}, *//* line 31 */
        for (let child_descriptor of  diagram [ "children"]) {/* line 32 */
          if (first_char_is ( child_descriptor [ "name"], "$")) {/* line 33 */
            let name =  child_descriptor [ "name"];    /* line 34 */
            let cmd =   name.substring (1) .strip ();  /* line 35 */
            let generated_leaf = mkTemplate ( name, cmd, shell_out_instantiate)/* line 36 */;
            register_component ( reg, generated_leaf)  /* line 37 */}
          else if (first_char_is ( child_descriptor [ "name"], "'")) {/* line 38 */
            let name =  child_descriptor [ "name"];    /* line 39 */
            let s =   name.substring (1)               /* line 40 */;
            let generated_leaf = mkTemplate ( name, s, string_constant_instantiate)/* line 41 */;
            register_component_allow_overwriting ( reg, generated_leaf)/* line 42 *//* line 43 */}/* line 44 */}/* line 45 */}/* line 46 */}
    return  reg;                                       /* line 47 *//* line 48 *//* line 49 */
}

function first_char (s) {                              /* line 50 */
    return   s[0]                                      /* line 51 */;/* line 52 *//* line 53 */
}

function first_char_is (s,c) {                         /* line 54 */
    return  c == first_char ( s)                       /* line 55 */;/* line 56 *//* line 57 */
}
                                                       /* line 58 */
/*  TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here *//* line 59 */
/*  I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped *//* line 60 *//* line 61 */






function decode_install (reg) {                        /* line 1 */
    register_component ( reg,mkTemplate ( "Decode", null, decode_instantiator))/* line 2 *//* line 3 *//* line 4 */
}

function decode_handler (eh,msg) {                     /* line 5 *//* line 6 */
    let s =  msg.datum.v;                              /* line 7 */
    let  i = Number ( s)                               /* line 8 */;
    if ((( i >=  0) && ( i <=  9))) {                  /* line 9 */
      send_string ( eh, s, s, msg)                     /* line 10 *//* line 11 */}
    send_bang ( eh, "done", msg)                       /* line 12 *//* line 13 *//* line 14 */
}

function decode_instantiator (reg,owner,name,template_data) {/* line 15 */
    let name_with_id = gensymbol ( "Decode")           /* line 16 */;
    return make_leaf ( name_with_id, owner, null, decode_handler)/* line 17 */;
}







function reverser_install (reg) {                      /* line 1 */
    register_component ( reg,mkTemplate ( "Reverser", null, reverser_instantiator))/* line 2 *//* line 3 *//* line 4 */
}

let  reverser_state =  "J";                            /* line 5 *//* line 6 */
function reverser_handler (eh,msg) {                   /* line 7 *//* line 8 */
    if ( reverser_state ==  "K") {                     /* line 9 */
      if ( msg.port ==  "J") {                         /* line 10 */
        send_bang ( eh, "", msg)                       /* line 11 */
        reverser_state =  "J";                         /* line 12 */}
      else {                                           /* line 13 *//* line 14 *//* line 15 */}}
    else if ( reverser_state ==  "J") {                /* line 16 */
      if ( msg.port ==  "K") {                         /* line 17 */
        send_bang ( eh, "", msg)                       /* line 18 */
        reverser_state =  "K";                         /* line 19 */}
      else {                                           /* line 20 *//* line 21 *//* line 22 */}/* line 23 */}/* line 24 *//* line 25 */
}

function reverser_instantiator (reg,owner,name,template_data) {/* line 26 */
    let name_with_id = gensymbol ( "Reverser")         /* line 27 */;
    return make_leaf ( name_with_id, owner, null, reverser_handler)/* line 28 */;/* line 29 */
}







function delay_install (reg) {                         /* line 1 */
    register_component ( reg,mkTemplate ( "Delay", null, delay_instantiator))/* line 2 *//* line 3 *//* line 4 */
}

class Delay_Info {
  constructor () {                                     /* line 5 */

    this.counter =  0;                                 /* line 6 */
    this.saved_message =  null;                        /* line 7 *//* line 8 */
  }
}
                                                       /* line 9 */
function delay_instantiator (reg,owner,name,template_data) {/* line 10 */
    let name_with_id = gensymbol ( "delay")            /* line 11 */;
    let info =  new Delay_Info ();                     /* line 12 */;
    return make_leaf ( name_with_id, owner, info, delay_handler)/* line 13 */;/* line 14 *//* line 15 */
}

let  DELAYDELAY =  5000;                               /* line 16 *//* line 17 */
function first_time (m) {                              /* line 18 */
    return (! is_tick ( m)                             /* line 19 */);/* line 20 *//* line 21 */
}

function delay_handler (eh,msg) {                      /* line 22 */
    let info =  eh.instance_data;                      /* line 23 */
    if (first_time ( msg)) {                           /* line 24 */
      info.saved_message =  msg;                       /* line 25 */
      set_active ( eh)
      /*  tell engine to keep running this component with ;ticks'  *//* line 26 *//* line 27 */}/* line 28 */
    let count =  info.counter;                         /* line 29 */
    let  next =  count+ 1;                             /* line 30 */
    if ( info.counter >=  DELAYDELAY) {                /* line 31 */
      set_idle ( eh)
      /*  tell engine that we're finally done  */      /* line 32 */
      forward ( eh, "", info.saved_message)            /* line 33 */
      next =  0;                                       /* line 34 *//* line 35 */}
    info.counter =  next;                              /* line 36 *//* line 37 *//* line 38 */
}







function monitor_install (reg) {                       /* line 1 */
    register_component ( reg,mkTemplate ( "@", null, monitor_instantiator))/* line 2 *//* line 3 *//* line 4 */
}

function monitor_instantiator (reg,owner,name,template_data) {/* line 5 */
    let name_with_id = gensymbol ( "@")                /* line 6 */;
    return make_leaf ( name_with_id, owner, null, monitor_handler)/* line 7 */;/* line 8 *//* line 9 */
}

function monitor_handler (eh,msg) {                    /* line 10 */
    let  s =  msg.datum.v;                             /* line 11 */
    let  i = Number ( s)                               /* line 12 */;
    while ( i >  0) {                                  /* line 13 */
      s =  `${ " "}${ s}`                              /* line 14 */;
      i =  i- 1;                                       /* line 15 *//* line 16 */}
    console.log ( s);                                  /* line 17 *//* line 18 */
}





let [palette, env] = initialize ();
start_show_all (palette, env);
