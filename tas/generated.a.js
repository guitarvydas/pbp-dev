

import * as fs from 'fs';
var path = require('path');
const argv = process.argv.slice(2);
const execSync = require('child_process').execSync;
                              /* line 1 *//* line 2 */
let  counter =  0;            /* line 3 *//* line 4 */
let  digits = [ "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀", "₂₁", "₂₂", "₂₃", "₂₄", "₂₅", "₂₆", "₂₇", "₂₈", "₂₉"];/* line 11 *//* line 12 *//* line 13 */
function gensymbol (s) {      /* line 14 *//* line 15 */
    let name_with_id =  `${ s}${subscripted_digit ( counter)}` /* line 16 */;
    counter =  counter+ 1;    /* line 17 */
    return  name_with_id;     /* line 18 *//* line 19 *//* line 20 */
}

function subscripted_digit (n) {/* line 21 *//* line 22 */
    if (((( n >=  0) && ( n <=  29)))) {/* line 23 */
      return  digits [ n];    /* line 24 */}
    else {                    /* line 25 */
      return  `${ "₊"}${ n}`  /* line 26 */;/* line 27 */}/* line 28 *//* line 29 */
}

class Datum {
  constructor () {            /* line 30 */

    this.data =  null;        /* line 31 */
    this.clone =  null;       /* line 32 */
    this.reclaim =  null;     /* line 33 */
    this.srepr =  null;       /* line 34 */
    this.kind =  null;        /* line 35 */
    this.raw =  null;         /* line 36 *//* line 37 */
  }
}
                              /* line 38 */
function new_datum_string (s) {/* line 39 */
    let d =  new Datum ();    /* line 40 */;
    d.data =  s;              /* line 41 */
    d.clone =  function () {return clone_datum_string ( d)/* line 42 */;};
    d.reclaim =  function () {return reclaim_datum_string ( d)/* line 43 */;};
    d.srepr =  function () {return srepr_datum_string ( d)/* line 44 */;};
    d.raw = new TextEncoder().encode( d.data)/* line 45 */;
    d.kind =  function () {return  "string";};/* line 46 */
    return  d;                /* line 47 *//* line 48 *//* line 49 */
}

function clone_datum_string (d) {/* line 50 */
    let newd = new_datum_string ( d.data)/* line 51 */;
    return  newd;             /* line 52 *//* line 53 *//* line 54 */
}

function reclaim_datum_string (src) {/* line 55 *//* line 56 *//* line 57 *//* line 58 */
}

function srepr_datum_string (d) {/* line 59 */
    return  d.data;           /* line 60 *//* line 61 *//* line 62 */
}

function new_datum_bang () {  /* line 63 */
    let p =  new Datum ();    /* line 64 */;
    p.data =  true;           /* line 65 */
    p.clone =  function () {return clone_datum_bang ( p)/* line 66 */;};
    p.reclaim =  function () {return reclaim_datum_bang ( p)/* line 67 */;};
    p.srepr =  function () {return srepr_datum_bang ();};/* line 68 */
    p.raw =  function () {return raw_datum_bang ();};/* line 69 */
    p.kind =  function () {return  "bang";};/* line 70 */
    return  p;                /* line 71 *//* line 72 *//* line 73 */
}

function clone_datum_bang (d) {/* line 74 */
    return new_datum_bang (); /* line 75 *//* line 76 *//* line 77 */
}

function reclaim_datum_bang (d) {/* line 78 *//* line 79 *//* line 80 *//* line 81 */
}

function srepr_datum_bang () {/* line 82 */
    return  "!";              /* line 83 *//* line 84 *//* line 85 */
}

function raw_datum_bang () {  /* line 86 */
    return [];                /* line 87 *//* line 88 *//* line 89 */
}

function new_datum_tick () {  /* line 90 */
    let p = new_datum_bang ();/* line 91 */
    p.kind =  function () {return  "tick";};/* line 92 */
    p.clone =  function () {return new_datum_tick ();};/* line 93 */
    p.srepr =  function () {return srepr_datum_tick ();};/* line 94 */
    p.raw =  function () {return raw_datum_tick ();};/* line 95 */
    return  p;                /* line 96 *//* line 97 *//* line 98 */
}

function srepr_datum_tick () {/* line 99 */
    return  ".";              /* line 100 *//* line 101 *//* line 102 */
}

function raw_datum_tick () {  /* line 103 */
    return [];                /* line 104 *//* line 105 *//* line 106 */
}

function new_datum_bytes (b) {/* line 107 */
    let p =  new Datum ();    /* line 108 */;
    p.data =  b;              /* line 109 */
    p.clone =  function () {return clone_datum_bytes ( p)/* line 110 */;};
    p.reclaim =  function () {return reclaim_datum_bytes ( p)/* line 111 */;};
    p.srepr =  function () {return srepr_datum_bytes ( b)/* line 112 */;};
    p.raw =  function () {return raw_datum_bytes ( b)/* line 113 */;};
    p.kind =  function () {return  "bytes";};/* line 114 */
    return  p;                /* line 115 *//* line 116 *//* line 117 */
}

function clone_datum_bytes (src) {/* line 118 */
    let p =  new Datum ();    /* line 119 */;
    p.clone =  src.clone;     /* line 120 */
    p.reclaim =  src.reclaim; /* line 121 */
    p.srepr =  src.srepr;     /* line 122 */
    p.raw =  src.raw;         /* line 123 */
    p.kind =  src.kind;       /* line 124 */
    p.data =  src.clone ();   /* line 125 */
    return  p;                /* line 126 *//* line 127 *//* line 128 */
}

function reclaim_datum_bytes (src) {/* line 129 *//* line 130 *//* line 131 *//* line 132 */
}

function srepr_datum_bytes (d) {/* line 133 */
    return  d.data.decode ( "UTF_8")/* line 134 */;/* line 135 */
}

function raw_datum_bytes (d) {/* line 136 */
    return  d.data;           /* line 137 *//* line 138 *//* line 139 */
}

function new_datum_handle (h) {/* line 140 */
    return new_datum_int ( h) /* line 141 */;/* line 142 *//* line 143 */
}

function new_datum_int (i) {  /* line 144 */
    let p =  new Datum ();    /* line 145 */;
    p.data =  i;              /* line 146 */
    p.clone =  function () {return clone_int ( i)/* line 147 */;};
    p.reclaim =  function () {return reclaim_int ( i)/* line 148 */;};
    p.srepr =  function () {return srepr_datum_int ( i)/* line 149 */;};
    p.raw =  function () {return raw_datum_int ( i)/* line 150 */;};
    p.kind =  function () {return  "int";};/* line 151 */
    return  p;                /* line 152 *//* line 153 *//* line 154 */
}

function clone_int (i) {      /* line 155 */
    let p = new_datum_int ( i)/* line 156 */;
    return  p;                /* line 157 *//* line 158 *//* line 159 */
}

function reclaim_int (src) {  /* line 160 *//* line 161 *//* line 162 *//* line 163 */
}

function srepr_datum_int (i) {/* line 164 */
    return `${ i}`            /* line 165 */;/* line 166 *//* line 167 */
}

function raw_datum_int (i) {  /* line 168 */
    return  i;                /* line 169 *//* line 170 *//* line 171 */
}

/*  Message passed to a leaf component. *//* line 172 */
/*  */                        /* line 173 */
/*  `port` refers to the name of the incoming or outgoing port of this component. *//* line 174 */
/*  `datum` is the data attached to this message. *//* line 175 */
class Message {
  constructor () {            /* line 176 */

    this.port =  null;        /* line 177 */
    this.datum =  null;       /* line 178 *//* line 179 */
  }
}
                              /* line 180 */
function clone_port (s) {     /* line 181 */
    return clone_string ( s)  /* line 182 */;/* line 183 *//* line 184 */
}

/*  Utility for making a `Message`. Used to safely “seed“ messages *//* line 185 */
/*  entering the very top of a network. *//* line 186 */
function make_message (port,datum) {/* line 187 */
    let p = clone_string ( port)/* line 188 */;
    let  m =  new Message (); /* line 189 */;
    m.port =  p;              /* line 190 */
    m.datum =  datum.clone ();/* line 191 */
    return  m;                /* line 192 *//* line 193 *//* line 194 */
}

/*  Clones a message. Primarily used internally for “fanning out“ a message to multiple destinations. *//* line 195 */
function message_clone (msg) {/* line 196 */
    let  m =  new Message (); /* line 197 */;
    m.port = clone_port ( msg.port)/* line 198 */;
    m.datum =  msg.datum.clone ();/* line 199 */
    return  m;                /* line 200 *//* line 201 *//* line 202 */
}

/*  Frees a message. */       /* line 203 */
function destroy_message (msg) {/* line 204 */
    /*  during debug, dont destroy any message, since we want to trace messages, thus, we need to persist ancestor messages *//* line 205 *//* line 206 *//* line 207 *//* line 208 */
}

function destroy_datum (msg) {/* line 209 *//* line 210 *//* line 211 *//* line 212 */
}

function destroy_port (msg) { /* line 213 *//* line 214 *//* line 215 *//* line 216 */
}

/*  */                        /* line 217 */
function format_message (m) { /* line 218 */
    if ( m ==  null) {        /* line 219 */
      return  "ϕ";            /* line 220 */}
    else {                    /* line 221 */
      return  `${ "⟪"}${ `${ m.port}${ `${ "⦂"}${ `${ m.datum.srepr ()}${ "⟫"}` }` }` }` /* line 225 */;/* line 226 */}/* line 227 *//* line 228 */
}
                              /* line 229 */
const  enumDown =  0          /* line 230 */;
const  enumAcross =  1        /* line 231 */;
const  enumUp =  2            /* line 232 */;
const  enumThrough =  3       /* line 233 */;/* line 234 */
function create_down_connector (container,proto_conn,connectors,children_by_id) {/* line 235 */
    /*  JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''}, *//* line 236 */
    let  connector =  new Connector ();/* line 237 */;
    connector.direction =  "down";/* line 238 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 239 */;
    let target_proto =  proto_conn [ "target"];/* line 240 */
    let id_proto =  target_proto [ "id"];/* line 241 */
    let target_component =  children_by_id [id_proto];/* line 242 */
    if (( target_component ==  null)) {/* line 243 */
      load_error ( `${ "internal error: .Down connection target internal error "}${ proto_conn [ "target"]}` )/* line 244 */}
    else {                    /* line 245 */
      connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 246 */;/* line 247 */}
    return  connector;        /* line 248 *//* line 249 *//* line 250 */
}

function create_across_connector (container,proto_conn,connectors,children_by_id) {/* line 251 */
    let  connector =  new Connector ();/* line 252 */;
    connector.direction =  "across";/* line 253 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 254 */
    let target_component =  children_by_id [(( proto_conn [ "target"]) [ "id"])];/* line 255 */
    if ( source_component ==  null) {/* line 256 */
      load_error ( `${ "internal error: .Across connection source not ok "}${ proto_conn [ "source"]}` )/* line 257 */}
    else {                    /* line 258 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 259 */;
      if ( target_component ==  null) {/* line 260 */
        load_error ( `${ "internal error: .Across connection target not ok "}${ proto_conn.target}` )/* line 261 */}
      else {                  /* line 262 */
        connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 263 */;/* line 264 */}/* line 265 */}
    return  connector;        /* line 266 *//* line 267 *//* line 268 */
}

function create_up_connector (container,proto_conn,connectors,children_by_id) {/* line 269 */
    let  connector =  new Connector ();/* line 270 */;
    connector.direction =  "up";/* line 271 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 272 */
    if ( source_component ==  null) {/* line 273 */
      print ( `${ "internal error: .Up connection source not ok "}${ proto_conn [ "source"]}` )/* line 274 */}
    else {                    /* line 275 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 276 */;
      connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 277 */;/* line 278 */}
    return  connector;        /* line 279 *//* line 280 *//* line 281 */
}

function create_through_connector (container,proto_conn,connectors,children_by_id) {/* line 282 */
    let  connector =  new Connector ();/* line 283 */;
    connector.direction =  "through";/* line 284 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 285 */;
    connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 286 */;
    return  connector;        /* line 287 *//* line 288 *//* line 289 */
}
                              /* line 290 */
function container_instantiator (reg,owner,container_name,desc) {/* line 291 *//* line 292 */
    let container = make_container ( container_name, owner)/* line 293 */;
    let children = [];        /* line 294 */
    let children_by_id = {};
    /*  not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here *//* line 295 */
    /*  collect children */   /* line 296 */
    for (child_desc in  desc [ "children"]) {/* line 297 */
      let child_instance = get_component_instance ( reg, child_desc [ "name"], container)/* line 298 */;
      children.push ( child_instance) /* line 299 */
      let id =  child_desc [ "id"];/* line 300 */
      children_by_id [id] =  child_instance;/* line 301 *//* line 302 *//* line 303 */}
    container.children =  children;/* line 304 *//* line 305 */
    let connectors = [];      /* line 306 */
    for (proto_conn in  desc [ "connections"]) {/* line 307 */
      let  connector =  new Connector ();/* line 308 */;
      if ( proto_conn [ "dir"] ==  enumDown) {/* line 309 */
        connectors.push (create_down_connector ( container, proto_conn, connectors, children_by_id)) /* line 310 */}
      else if ( proto_conn [ "dir"] ==  enumAcross) {/* line 311 */
        connectors.push (create_across_connector ( container, proto_conn, connectors, children_by_id)) /* line 312 */}
      else if ( proto_conn [ "dir"] ==  enumUp) {/* line 313 */
        connectors.push (create_up_connector ( container, proto_conn, connectors, children_by_id)) /* line 314 */}
      else if ( proto_conn [ "dir"] ==  enumThrough) {/* line 315 */
        connectors.push (create_through_connector ( container, proto_conn, connectors, children_by_id)) /* line 316 *//* line 317 */}/* line 318 */}
    container.connections =  connectors;/* line 319 */
    return  container;        /* line 320 *//* line 321 *//* line 322 */
}

/*  The default handler for container components. *//* line 323 */
function container_handler (container,message) {/* line 324 */
    route ( container, container, message)
    /*  references to 'self' are replaced by the container during instantiation *//* line 325 */
    while (any_child_ready ( container)) {/* line 326 */
      step_children ( container, message)/* line 327 */}/* line 328 *//* line 329 */
}

/*  Frees the given container and associated data. *//* line 330 */
function destroy_container (eh) {/* line 331 *//* line 332 *//* line 333 *//* line 334 */
}

/*  Routing connection for a container component. The `direction` field has *//* line 335 */
/*  no affect on the default message routing system _ it is there for debugging *//* line 336 */
/*  purposes, or for reading by other tools. *//* line 337 *//* line 338 */
class Connector {
  constructor () {            /* line 339 */

    this.direction =  null;/*  down, across, up, through *//* line 340 */
    this.sender =  null;      /* line 341 */
    this.receiver =  null;    /* line 342 *//* line 343 */
  }
}
                              /* line 344 */
/*  `Sender` is used to “pattern match“ which `Receiver` a message should go to, *//* line 345 */
/*  based on component ID (pointer) and port name. *//* line 346 *//* line 347 */
class Sender {
  constructor () {            /* line 348 */

    this.name =  null;        /* line 349 */
    this.component =  null;   /* line 350 */
    this.port =  null;        /* line 351 *//* line 352 */
  }
}
                              /* line 353 *//* line 354 *//* line 355 */
/*  `Receiver` is a handle to a destination queue, and a `port` name to assign *//* line 356 */
/*  to incoming messages to this queue. *//* line 357 *//* line 358 */
class Receiver {
  constructor () {            /* line 359 */

    this.name =  null;        /* line 360 */
    this.queue =  null;       /* line 361 */
    this.port =  null;        /* line 362 */
    this.component =  null;   /* line 363 *//* line 364 */
  }
}
                              /* line 365 */
function mkSender (name,component,port) {/* line 366 */
    let  s =  new Sender ();  /* line 367 */;
    s.name =  name;           /* line 368 */
    s.component =  component; /* line 369 */
    s.port =  port;           /* line 370 */
    return  s;                /* line 371 *//* line 372 *//* line 373 */
}

function mkReceiver (name,component,port,q) {/* line 374 */
    let  r =  new Receiver ();/* line 375 */;
    r.name =  name;           /* line 376 */
    r.component =  component; /* line 377 */
    r.port =  port;           /* line 378 */
    /*  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. *//* line 379 */
    r.queue =  q;             /* line 380 */
    return  r;                /* line 381 *//* line 382 *//* line 383 */
}

/*  Checks if two senders match, by pointer equality and port name matching. *//* line 384 */
function sender_eq (s1,s2) {  /* line 385 */
    let same_components = ( s1.component ==  s2.component);/* line 386 */
    let same_ports = ( s1.port ==  s2.port);/* line 387 */
    return (( same_components) && ( same_ports));/* line 388 *//* line 389 *//* line 390 */
}

/*  Delivers the given message to the receiver of this connector. *//* line 391 *//* line 392 */
function deposit (parent,conn,message) {/* line 393 */
    let new_message = make_message ( conn.receiver.port, message.datum)/* line 394 */;
    push_message ( parent, conn.receiver.component, conn.receiver.queue, new_message)/* line 395 *//* line 396 *//* line 397 */
}

function force_tick (parent,eh) {/* line 398 */
    let tick_msg = make_message ( ".",new_datum_tick ())/* line 399 */;
    push_message ( parent, eh, eh.inq, tick_msg)/* line 400 */
    return  tick_msg;         /* line 401 *//* line 402 *//* line 403 */
}

function push_message (parent,receiver,inq,m) {/* line 404 */
    inq.push ( m)             /* line 405 */
    parent.visit_ordering.push ( receiver)/* line 406 *//* line 407 *//* line 408 */
}

function is_self (child,container) {/* line 409 */
    /*  in an earlier version “self“ was denoted as ϕ *//* line 410 */
    return  child ==  container;/* line 411 *//* line 412 *//* line 413 */
}

function step_child (child,msg) {/* line 414 */
    let before_state =  child.state;/* line 415 */
    child.handler ( child, msg)/* line 416 */
    let after_state =  child.state;/* line 417 */
    return [(( before_state ==  "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state ==  "idle"))];/* line 420 *//* line 421 *//* line 422 */
}

function step_children (container,causingMessage) {/* line 423 */
    container.state =  "idle";/* line 424 */
    for (child in   container.visit_ordering) {/* line 425 */
      /*  child = container represents self, skip it *//* line 426 */
      if (((! (is_self ( child, container))))) {/* line 427 */
        if (((! ((0=== child.inq.length))))) {/* line 428 */
          let msg =  child.inq.shift ()/* line 429 */;
          let  began_long_run =  null;/* line 430 */
          let  continued_long_run =  null;/* line 431 */
          let  ended_long_run =  null;/* line 432 */
          [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, msg)/* line 433 */;
          if ( began_long_run) {/* line 434 *//* line 435 */}
          else if ( continued_long_run) {/* line 436 *//* line 437 */}
          else if ( ended_long_run) {/* line 438 *//* line 439 *//* line 440 */}
          destroy_message ( msg)/* line 441 */}
        else {                /* line 442 */
          if ( child.state!= "idle") {/* line 443 */
            let msg = force_tick ( container, child)/* line 444 */;
            child.handler ( child, msg)/* line 445 */
            destroy_message ( msg)}/* line 446 */}/* line 447 */
        if ( child.state ==  "active") {/* line 448 */
          /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 449 */
          container.state =  "active";/* line 450 */}/* line 451 */
        while (((! ((0=== child.outq.length))))) {/* line 452 */
          let msg =  child.outq.shift ()/* line 453 */;
          route ( container, child, msg)/* line 454 */
          destroy_message ( msg)}}/* line 455 */}/* line 456 *//* line 457 *//* line 458 *//* line 459 */
}

function attempt_tick (parent,eh) {/* line 460 */
    if ( eh.state!= "idle") { /* line 461 */
      force_tick ( parent, eh)/* line 462 */}/* line 463 *//* line 464 */
}

function is_tick (msg) {      /* line 465 */
    return  "tick" ==  msg.datum.kind ();/* line 466 *//* line 467 *//* line 468 */
}

/*  Routes a single message to all matching destinations, according to *//* line 469 */
/*  the container's connection network. *//* line 470 *//* line 471 */
function route (container,from_component,message) {/* line 472 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 473 */
    let  fromname =  "";      /* line 474 */
    if (is_tick ( message)) { /* line 475 */
      for (child in  container.children) {/* line 476 */
        attempt_tick ( container, child)/* line 477 */}
      was_sent =  true;       /* line 478 */}
    else {                    /* line 479 */
      if (((! (is_self ( from_component, container))))) {/* line 480 */
        fromname =  from_component.name;/* line 481 */}
      let from_sender = mkSender ( fromname, from_component, message.port)/* line 482 */;/* line 483 */
      for (connector in  container.connections) {/* line 484 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 485 */
          deposit ( container, connector, message)/* line 486 */
          was_sent =  true;}} /* line 487 */}
    if ((! ( was_sent))) {    /* line 488 */
      print ( "\n\n*** Error: ***")/* line 489 */
      print ( "***")          /* line 490 */
      print ( `${ container.name}${ `${ ": message '"}${ `${ message.port}${ `${ "' from "}${ `${ fromname}${ " dropped on floor..."}` }` }` }` }` )/* line 491 */
      print ( "***")          /* line 492 */
      process.exit (1)        /* line 493 *//* line 494 */}/* line 495 *//* line 496 */
}

function any_child_ready (container) {/* line 497 */
    for (child in  container.children) {/* line 498 */
      if (child_is_ready ( child)) {/* line 499 */
        return  true;}        /* line 500 */}
    return  false;            /* line 501 *//* line 502 *//* line 503 */
}

function child_is_ready (eh) {/* line 504 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 505 *//* line 506 *//* line 507 */
}

function append_routing_descriptor (container,desc) {/* line 508 */
    container.routings.push ( desc)/* line 509 *//* line 510 *//* line 511 */
}

function container_injector (container,message) {/* line 512 */
    container_handler ( container, message)/* line 513 *//* line 514 *//* line 515 */
}





