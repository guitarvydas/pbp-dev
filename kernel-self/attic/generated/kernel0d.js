import * as fs from 'fs';
import path from 'path';
import execSync from 'child_process';
                                                       /* line 1 *//* line 2 */
let  counter =  0;                                     /* line 3 */
let  ticktime =  0;                                    /* line 4 *//* line 5 */
let  digits = [ "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀", "₂₁", "₂₂", "₂₃", "₂₄", "₂₅", "₂₆", "₂₇", "₂₈", "₂₉"];/* line 12 *//* line 13 *//* line 14 */
function gensymbol (s) {                               /* line 15 *//* line 16 */
    let name_with_id =  ( s.toString ()+ subscripted_digit ( counter).toString ()) /* line 17 */;
    counter =  counter+ 1;                             /* line 18 */
    return  name_with_id;                              /* line 19 *//* line 20 *//* line 21 */
}

function subscripted_digit (n) {                       /* line 22 *//* line 23 */
    if (((( n >=  0) && ( n <=  29)))) {               /* line 24 */
      return  digits [ n];                             /* line 25 */
    }
    else {                                             /* line 26 */
      return  ( "₊".toString ()+ `${ n}`.toString ())  /* line 27 */;/* line 28 */
    }                                                  /* line 29 *//* line 30 */
}

class Datum {
  constructor () {                                     /* line 31 */

    this.v =  null;                                    /* line 32 */
    this.clone =  null;                                /* line 33 */
    this.reclaim =  null;                              /* line 34 */
    this.other =  null;/*  reserved for use on per-project basis  *//* line 35 *//* line 36 */
  }
}
                                                       /* line 37 */
function new_datum_string (s) {                        /* line 38 */
    let d =  new Datum ();                             /* line 39 */;
    d.v =  s;                                          /* line 40 */
    d.clone =  function () {return clone_datum_string ( d)/* line 41 */;};
    d.reclaim =  function () {return reclaim_datum_string ( d)/* line 42 */;};
    return  d;                                         /* line 43 *//* line 44 *//* line 45 */
}

function clone_datum_string (d) {                      /* line 46 */
    let newd = new_datum_string ( d.v)                 /* line 47 */;
    return  newd;                                      /* line 48 *//* line 49 *//* line 50 */
}

function reclaim_datum_string (src) {                  /* line 51 *//* line 52 *//* line 53 *//* line 54 */
}

function new_datum_bang () {                           /* line 55 */
    let p =  new Datum ();                             /* line 56 */;
    p.v =  "";                                         /* line 57 */
    p.clone =  function () {return clone_datum_bang ( p)/* line 58 */;};
    p.reclaim =  function () {return reclaim_datum_bang ( p)/* line 59 */;};
    return  p;                                         /* line 60 *//* line 61 *//* line 62 */
}

function clone_datum_bang (d) {                        /* line 63 */
    return new_datum_bang ();                          /* line 64 *//* line 65 *//* line 66 */
}

function reclaim_datum_bang (d) {                      /* line 67 *//* line 68 *//* line 69 *//* line 70 */
}

/*  Mevent passed to a leaf component. */              /* line 71 */
/*  */                                                 /* line 72 */
/*  `port` refers to the name of the incoming or outgoing port of this component. *//* line 73 */
/*  `payload` is the data attached to this mevent. */  /* line 74 */
class Mevent {
  constructor () {                                     /* line 75 */

    this.port =  null;                                 /* line 76 */
    this.datum =  null;                                /* line 77 *//* line 78 */
  }
}
                                                       /* line 79 */
function clone_port (s) {                              /* line 80 */
    return clone_string ( s)                           /* line 81 */;/* line 82 *//* line 83 */
}

/*  Utility for making a `Mevent`. Used to safely "seed“ mevents *//* line 84 */
/*  entering the very top of a network. */             /* line 85 */
function make_mevent (port,datum) {                    /* line 86 */
    let p = clone_string ( port)                       /* line 87 */;
    let  m =  new Mevent ();                           /* line 88 */;
    m.port =  p;                                       /* line 89 */
    m.datum =  datum.clone ();                         /* line 90 */
    return  m;                                         /* line 91 *//* line 92 *//* line 93 */
}

/*  Clones a mevent. Primarily used internally for “fanning out“ a mevent to multiple destinations. *//* line 94 */
function mevent_clone (mev) {                          /* line 95 */
    let  m =  new Mevent ();                           /* line 96 */;
    m.port = clone_port ( mev.port)                    /* line 97 */;
    m.datum =  mev.datum.clone ();                     /* line 98 */
    return  m;                                         /* line 99 *//* line 100 *//* line 101 */
}

/*  Frees a mevent. */                                 /* line 102 */
function destroy_mevent (mev) {                        /* line 103 */
    /*  during debug, dont destroy any mevent, since we want to trace mevents, thus, we need to persist ancestor mevents *//* line 104 *//* line 105 *//* line 106 *//* line 107 */
}

function destroy_datum (mev) {                         /* line 108 *//* line 109 *//* line 110 *//* line 111 */
}

function destroy_port (mev) {                          /* line 112 *//* line 113 *//* line 114 *//* line 115 */
}

/*  */                                                 /* line 116 */
function format_mevent (m) {                           /* line 117 */
    if ( m ==  null) {                                 /* line 118 */
      return  "{}";                                    /* line 119 */
    }
    else {                                             /* line 120 */
      return  ( "{%5C”".toString ()+  ( m.port.toString ()+  ( "%5C”:%5C”".toString ()+  ( m.datum.v.toString ()+  "%5C”}".toString ()) .toString ()) .toString ()) .toString ()) /* line 121 */;/* line 122 */
    }                                                  /* line 123 */
}

function format_mevent_raw (m) {                       /* line 124 */
    if ( m ==  null) {                                 /* line 125 */
      return  "";                                      /* line 126 */
    }
    else {                                             /* line 127 */
      return  m.datum.v;                               /* line 128 *//* line 129 */
    }                                                  /* line 130 *//* line 131 */
}

const  enumDown =  0                                   /* line 132 */;
const  enumAcross =  1                                 /* line 133 */;
const  enumUp =  2                                     /* line 134 */;
const  enumThrough =  3                                /* line 135 */;/* line 136 */
function create_down_connector (container,proto_conn,connectors,children_by_id) {/* line 137 */
    /*  JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''}, *//* line 138 */
    let  connector =  new Connector ();                /* line 139 */;
    connector.direction =  "down";                     /* line 140 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 141 */;
    let target_proto =  proto_conn [ "target"];        /* line 142 */
    let id_proto =  target_proto [ "id"];              /* line 143 */
    let target_component =  children_by_id [id_proto]; /* line 144 */
    if (( target_component ==  null)) {                /* line 145 */
      load_error ( ( "internal error: .Down connection target internal error ".toString ()+ ( proto_conn [ "target"]) [ "name"].toString ()) )/* line 146 */
    }
    else {                                             /* line 147 */
      connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 148 */;/* line 149 */
    }
    return  connector;                                 /* line 150 *//* line 151 *//* line 152 */
}

function create_across_connector (container,proto_conn,connectors,children_by_id) {/* line 153 */
    let  connector =  new Connector ();                /* line 154 */;
    connector.direction =  "across";                   /* line 155 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 156 */
    let target_component =  children_by_id [(( proto_conn [ "target"]) [ "id"])];/* line 157 */
    if ( source_component ==  null) {                  /* line 158 */
      load_error ( ( "internal error: .Across connection source not ok ".toString ()+ ( proto_conn [ "source"]) [ "name"].toString ()) )/* line 159 */
    }
    else {                                             /* line 160 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 161 */;
      if ( target_component ==  null) {                /* line 162 */
        load_error ( ( "internal error: .Across connection target not ok ".toString ()+ ( proto_conn [ "target"]) [ "name"].toString ()) )/* line 163 */
      }
      else {                                           /* line 164 */
        connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 165 */;/* line 166 */
      }                                                /* line 167 */
    }
    return  connector;                                 /* line 168 *//* line 169 *//* line 170 */
}

function create_up_connector (container,proto_conn,connectors,children_by_id) {/* line 171 */
    let  connector =  new Connector ();                /* line 172 */;
    connector.direction =  "up";                       /* line 173 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 174 */
    if ( source_component ==  null) {                  /* line 175 */
      load_error ( ( "internal error: .Up connection source not ok ".toString ()+ ( proto_conn [ "source"]) [ "name"].toString ()) )/* line 176 */
    }
    else {                                             /* line 177 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 178 */;
      connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 179 */;/* line 180 */
    }
    return  connector;                                 /* line 181 *//* line 182 *//* line 183 */
}

function create_through_connector (container,proto_conn,connectors,children_by_id) {/* line 184 */
    let  connector =  new Connector ();                /* line 185 */;
    connector.direction =  "through";                  /* line 186 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 187 */;
    connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 188 */;
    return  connector;                                 /* line 189 *//* line 190 *//* line 191 */
}
                                                       /* line 192 */
function container_instantiator (reg,owner,container_name,desc) {/* line 193 *//* line 194 */
    let container = make_container ( container_name, owner)/* line 195 */;
    let children = [];                                 /* line 196 */
    let children_by_id = {};
    /*  not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here *//* line 197 */
    /*  collect children */                            /* line 198 */
    for (let child_desc of  desc [ "children"]) {      /* line 199 */
      let child_instance = get_component_instance ( reg, child_desc [ "name"], container)/* line 200 */;
      children.push ( child_instance)                  /* line 201 */
      let id =  child_desc [ "id"];                    /* line 202 */
      children_by_id [id] =  child_instance;           /* line 203 *//* line 204 *//* line 205 */
    }
    container.children =  children;                    /* line 206 *//* line 207 */
    let connectors = [];                               /* line 208 */
    for (let proto_conn of  desc [ "connections"]) {   /* line 209 */
      let  connector =  new Connector ();              /* line 210 */;
      if ( proto_conn [ "dir"] ==  enumDown) {         /* line 211 */
        connectors.push (create_down_connector ( container, proto_conn, connectors, children_by_id)) /* line 212 */
      }
      else if ( proto_conn [ "dir"] ==  enumAcross) {  /* line 213 */
        connectors.push (create_across_connector ( container, proto_conn, connectors, children_by_id)) /* line 214 */
      }
      else if ( proto_conn [ "dir"] ==  enumUp) {      /* line 215 */
        connectors.push (create_up_connector ( container, proto_conn, connectors, children_by_id)) /* line 216 */
      }
      else if ( proto_conn [ "dir"] ==  enumThrough) { /* line 217 */
        connectors.push (create_through_connector ( container, proto_conn, connectors, children_by_id)) /* line 218 *//* line 219 */
      }                                                /* line 220 */
    }
    container.connections =  connectors;               /* line 221 */
    return  container;                                 /* line 222 *//* line 223 *//* line 224 */
}

/*  The default handler for container components. */   /* line 225 */
function container_handler (container,mevent) {        /* line 226 */
    route ( container, container, mevent)
    /*  references to 'self' are replaced by the container during instantiation *//* line 227 */
    while (any_child_ready ( container)) {             /* line 228 */
      step_children ( container, mevent)               /* line 229 */
    }                                                  /* line 230 *//* line 231 */
}

/*  Frees the given container and associated data. */  /* line 232 */
function destroy_container (eh) {                      /* line 233 *//* line 234 *//* line 235 *//* line 236 */
}

/*  Routing connection for a container component. The `direction` field has *//* line 237 */
/*  no affect on the default mevent routing system _ it is there for debugging *//* line 238 */
/*  purposes, or for reading by other tools. */        /* line 239 *//* line 240 */
class Connector {
  constructor () {                                     /* line 241 */

    this.direction =  null;/*  down, across, up, through *//* line 242 */
    this.sender =  null;                               /* line 243 */
    this.receiver =  null;                             /* line 244 *//* line 245 */
  }
}
                                                       /* line 246 */
/*  `Sender` is used to “pattern match“ which `Receiver` a mevent should go to, *//* line 247 */
/*  based on component ID (pointer) and port name. */  /* line 248 *//* line 249 */
class Sender {
  constructor () {                                     /* line 250 */

    this.name =  null;                                 /* line 251 */
    this.component =  null;                            /* line 252 */
    this.port =  null;                                 /* line 253 *//* line 254 */
  }
}
                                                       /* line 255 *//* line 256 *//* line 257 */
/*  `Receiver` is a handle to a destination queue, and a `port` name to assign *//* line 258 */
/*  to incoming mevents to this queue. */              /* line 259 *//* line 260 */
class Receiver {
  constructor () {                                     /* line 261 */

    this.name =  null;                                 /* line 262 */
    this.queue =  null;                                /* line 263 */
    this.port =  null;                                 /* line 264 */
    this.component =  null;                            /* line 265 *//* line 266 */
  }
}
                                                       /* line 267 */
function mkSender (name,component,port) {              /* line 268 */
    let  s =  new Sender ();                           /* line 269 */;
    s.name =  name;                                    /* line 270 */
    s.component =  component;                          /* line 271 */
    s.port =  port;                                    /* line 272 */
    return  s;                                         /* line 273 *//* line 274 *//* line 275 */
}

function mkReceiver (name,component,port,q) {          /* line 276 */
    let  r =  new Receiver ();                         /* line 277 */;
    r.name =  name;                                    /* line 278 */
    r.component =  component;                          /* line 279 */
    r.port =  port;                                    /* line 280 */
    /*  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. *//* line 281 */
    r.queue =  q;                                      /* line 282 */
    return  r;                                         /* line 283 *//* line 284 *//* line 285 */
}

/*  Checks if two senders match, by pointer equality and port name matching. *//* line 286 */
function sender_eq (s1,s2) {                           /* line 287 */
    let same_components = ( s1.component ==  s2.component);/* line 288 */
    let same_ports = ( s1.port ==  s2.port);           /* line 289 */
    return (( same_components) && ( same_ports));      /* line 290 *//* line 291 *//* line 292 */
}

/*  Delivers the given mevent to the receiver of this connector. *//* line 293 *//* line 294 */
function deposit (parent,conn,mevent) {                /* line 295 */
    let new_mevent = make_mevent ( conn.receiver.port, mevent.datum)/* line 296 */;
    push_mevent ( parent, conn.receiver.component, conn.receiver.queue, new_mevent)/* line 297 *//* line 298 *//* line 299 */
}

function force_tick (parent,eh) {                      /* line 300 */
    let tick_mev = make_mevent ( ".",new_datum_bang ())/* line 301 */;
    push_mevent ( parent, eh, eh.inq, tick_mev)        /* line 302 */
    return  tick_mev;                                  /* line 303 *//* line 304 *//* line 305 */
}

function push_mevent (parent,receiver,inq,m) {         /* line 306 */
    inq.push ( m)                                      /* line 307 */
    parent.visit_ordering.push ( receiver)             /* line 308 *//* line 309 *//* line 310 */
}

function is_self (child,container) {                   /* line 311 */
    /*  in an earlier version “self“ was denoted as ϕ *//* line 312 */
    return  child ==  container;                       /* line 313 *//* line 314 *//* line 315 */
}

function step_child (child,mev) {                      /* line 316 */
    let before_state =  child.state;                   /* line 317 */
    child.handler ( child, mev)                        /* line 318 */
    let after_state =  child.state;                    /* line 319 */
    return [(( before_state ==  "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state ==  "idle"))];/* line 322 *//* line 323 *//* line 324 */
}

function step_children (container,causingMevent) {     /* line 325 */
    container.state =  "idle";                         /* line 326 */
    for (let child of   container.visit_ordering) {    /* line 327 */
      /*  child = container represents self, skip it *//* line 328 */
      if (((! (is_self ( child, container))))) {       /* line 329 */
        if (((! ((0=== child.inq.length))))) {         /* line 330 */
          let mev =  child.inq.shift ()                /* line 331 */;
          let  began_long_run =  null;                 /* line 332 */
          let  continued_long_run =  null;             /* line 333 */
          let  ended_long_run =  null;                 /* line 334 */
          [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, mev)/* line 335 */;
          if ( began_long_run) {                       /* line 336 *//* line 337 */
          }
          else if ( continued_long_run) {              /* line 338 *//* line 339 */
          }
          else if ( ended_long_run) {                  /* line 340 *//* line 341 *//* line 342 */
          }
          destroy_mevent ( mev)                        /* line 343 */
        }
        else {                                         /* line 344 */
          if ( child.state!= "idle") {                 /* line 345 */
            let mev = force_tick ( container, child)   /* line 346 */;
            child.handler ( child, mev)                /* line 347 */
            destroy_mevent ( mev)                      /* line 348 *//* line 349 */
          }                                            /* line 350 */
        }                                              /* line 351 */
        if ( child.state ==  "active") {               /* line 352 */
          /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 353 */
          container.state =  "active";                 /* line 354 *//* line 355 */
        }                                              /* line 356 */
        while (((! ((0=== child.outq.length))))) {     /* line 357 */
          let mev =  child.outq.shift ()               /* line 358 */;
          route ( container, child, mev)               /* line 359 */
          destroy_mevent ( mev)                        /* line 360 *//* line 361 */
        }                                              /* line 362 */
      }                                                /* line 363 */
    }                                                  /* line 364 *//* line 365 */
}

function attempt_tick (parent,eh) {                    /* line 366 */
    if ( eh.state!= "idle") {                          /* line 367 */
      force_tick ( parent, eh)                         /* line 368 *//* line 369 */
    }                                                  /* line 370 *//* line 371 */
}

function is_tick (mev) {                               /* line 372 */
    return  "." ==  mev.port
    /*  assume that any mevent that is sent to port "." is a tick  *//* line 373 */;/* line 374 *//* line 375 */
}

/*  Routes a single mevent to all matching destinations, according to *//* line 376 */
/*  the container's connection network. */             /* line 377 *//* line 378 */
function route (container,from_component,mevent) {     /* line 379 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 380 */
    let  fromname =  "";                               /* line 381 *//* line 382 */
    ticktime =  ticktime+ 1;                           /* line 383 */
    if (is_tick ( mevent)) {                           /* line 384 */
      for (let child of  container.children) {         /* line 385 */
        attempt_tick ( container, child)               /* line 386 */
      }
      was_sent =  true;                                /* line 387 */
    }
    else {                                             /* line 388 */
      if (((! (is_self ( from_component, container))))) {/* line 389 */
        fromname =  from_component.name;               /* line 390 *//* line 391 */
      }
      let from_sender = mkSender ( fromname, from_component, mevent.port)/* line 392 */;/* line 393 */
      for (let connector of  container.connections) {  /* line 394 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 395 */
          deposit ( container, connector, mevent)      /* line 396 */
          was_sent =  true;                            /* line 397 *//* line 398 */
        }                                              /* line 399 */
      }                                                /* line 400 */
    }
    if ((! ( was_sent))) {                             /* line 401 */
      live_update ( "✗",  ( container.name.toString ()+  ( ": mevent '".toString ()+  ( mevent.port.toString ()+  ( "' from ".toString ()+  ( fromname.toString ()+  " dropped on floor...".toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 402 *//* line 403 */
    }                                                  /* line 404 *//* line 405 */
}

function any_child_ready (container) {                 /* line 406 */
    for (let child of  container.children) {           /* line 407 */
      if (child_is_ready ( child)) {                   /* line 408 */
        return  true;                                  /* line 409 *//* line 410 */
      }                                                /* line 411 */
    }
    return  false;                                     /* line 412 *//* line 413 *//* line 414 */
}

function child_is_ready (eh) {                         /* line 415 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 416 *//* line 417 *//* line 418 */
}

function append_routing_descriptor (container,desc) {  /* line 419 */
    container.routings.push ( desc)                    /* line 420 *//* line 421 *//* line 422 */
}

function container_injector (container,mevent) {       /* line 423 */
    container_handler ( container, mevent)             /* line 424 *//* line 425 *//* line 426 */
}
                                                       /* line 427 *//* line 428 *//* line 429 */
class Component_Registry {
  constructor () {                                     /* line 430 */

    this.templates = {};                               /* line 431 *//* line 432 */
  }
}
                                                       /* line 433 */
class Template {
  constructor () {                                     /* line 434 */

    this.name =  null;                                 /* line 435 */
    this.template_data =  null;                        /* line 436 */
    this.instantiator =  null;                         /* line 437 *//* line 438 */
  }
}
                                                       /* line 439 */
function mkTemplate (name,template_data,instantiator) {/* line 440 */
    let  templ =  new Template ();                     /* line 441 */;
    templ.name =  name;                                /* line 442 */
    templ.template_data =  template_data;              /* line 443 */
    templ.instantiator =  instantiator;                /* line 444 */
    return  templ;                                     /* line 445 *//* line 446 *//* line 447 */
}
                                                       /* line 448 */
function lnet2internal_from_file (pathname,container_xml) {/* line 449 */
    let filename =   container_xml                     /* line 450 */;

    let jstr = undefined;
    if (filename == "0") {
    jstr = fs.readFileSync (0, { encoding: 'utf8'});
    } else if (pathname) {
    jstr = fs.readFileSync (`${pathname}/${filename}`, { encoding: 'utf8'});
    } else {
    jstr = fs.readFileSync (`${filename}`, { encoding: 'utf8'});
    }
    if (jstr) {
    return JSON.parse (jstr);
    } else {
    return undefined;
    }
                                                       /* line 451 *//* line 452 *//* line 453 */
}

function lnet2internal_from_string () {                /* line 454 */

    return JSON.parse (lnet);
                                                       /* line 455 *//* line 456 *//* line 457 */
}

function delete_decls (d) {                            /* line 458 *//* line 459 *//* line 460 *//* line 461 */
}

function make_component_registry () {                  /* line 462 */
    return  new Component_Registry ();                 /* line 463 */;/* line 464 *//* line 465 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 466 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 467 *//* line 468 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 469 */
    let name = mangle_name ( template.name)            /* line 470 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 471 */
      load_error ( ( "Component /".toString ()+  ( template.name.toString ()+  "/ already declared".toString ()) .toString ()) )/* line 472 */
      return  reg;                                     /* line 473 */
    }
    else {                                             /* line 474 */
      reg.templates [name] =  template;                /* line 475 */
      return  reg;                                     /* line 476 *//* line 477 */
    }                                                  /* line 478 *//* line 479 */
}

function get_component_instance (reg,full_name,owner) {/* line 480 */
    let template_name = mangle_name ( full_name)       /* line 481 */;
    if ((( template_name) in ( reg.templates))) {      /* line 482 */
      let template =  reg.templates [template_name];   /* line 483 */
      if (( template ==  null)) {                      /* line 484 */
        load_error ( ( "Registry Error (A): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 485 */
        return  null;                                  /* line 486 */
      }
      else {                                           /* line 487 */
        let owner_name =  "";                          /* line 488 */
        let instance_name =  template_name;            /* line 489 */
        if ( null!= owner) {                           /* line 490 */
          owner_name =  owner.name;                    /* line 491 */
          instance_name =  ( owner_name.toString ()+  ( "▹".toString ()+  template_name.toString ()) .toString ()) /* line 492 */;
        }
        else {                                         /* line 493 */
          instance_name =  template_name;              /* line 494 *//* line 495 */
        }
        let instance =  template.instantiator ( reg, owner, instance_name, template.template_data)/* line 496 */;
        return  instance;                              /* line 497 *//* line 498 */
      }
    }
    else {                                             /* line 499 */
      load_error ( ( "Registry Error (B): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 500 */
      return  null;                                    /* line 501 *//* line 502 */
    }                                                  /* line 503 *//* line 504 */
}

function mangle_name (s) {                             /* line 505 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 506 */
    return  s;                                         /* line 507 *//* line 508 *//* line 509 */
}
                                                       /* line 510 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 511 */
/*  and output queues of mevents. */                   /* line 512 */
/*  */                                                 /* line 513 */
/*  Components can either be a user_supplied function (“lea“), or a “container“ *//* line 514 */
/*  that routes mevents to child components according to a list of connections *//* line 515 */
/*  that serve as a mevent routing table. */           /* line 516 */
/*  */                                                 /* line 517 */
/*  Child components themselves can be leaves or other containers. *//* line 518 */
/*  */                                                 /* line 519 */
/*  `handler` invokes the code that is attached to this component. *//* line 520 */
/*  */                                                 /* line 521 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 522 */
/*  function may want whenever it is invoked again. */ /* line 523 */
/*  */                                                 /* line 524 *//* line 525 */
/*  Eh_States :: enum { idle, active } */              /* line 526 */
class Eh {
  constructor () {                                     /* line 527 */

    this.name =  "";                                   /* line 528 */
    this.inq =  []                                     /* line 529 */;
    this.outq =  []                                    /* line 530 */;
    this.owner =  null;                                /* line 531 */
    this.children = [];                                /* line 532 */
    this.visit_ordering =  []                          /* line 533 */;
    this.connections = [];                             /* line 534 */
    this.routings =  []                                /* line 535 */;
    this.handler =  null;                              /* line 536 */
    this.finject =  null;                              /* line 537 */
    this.instance_data =  null;                        /* line 538 */
    this.state =  "idle";                              /* line 539 *//*  bootstrap debugging *//* line 540 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 541 *//* line 542 */
  }
}
                                                       /* line 543 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 544 */
/*  whose handler function is `container_handler`. */  /* line 545 */
function make_container (name,owner) {                 /* line 546 */
    let  eh =  new Eh ();                              /* line 547 */;
    eh.name =  name;                                   /* line 548 */
    eh.owner =  owner;                                 /* line 549 */
    eh.handler =  container_handler;                   /* line 550 */
    eh.finject =  container_injector;                  /* line 551 */
    eh.state =  "idle";                                /* line 552 */
    eh.kind =  "container";                            /* line 553 */
    return  eh;                                        /* line 554 *//* line 555 *//* line 556 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 557 */
/*  that will be passed back to your handler when called. *//* line 558 *//* line 559 */
function make_leaf (name,owner,instance_data,handler) {/* line 560 */
    let  eh =  new Eh ();                              /* line 561 */;
    eh.name =  ( owner.name.toString ()+  ( "▹".toString ()+  name.toString ()) .toString ()) /* line 562 */;
    eh.owner =  owner;                                 /* line 563 */
    eh.handler =  handler;                             /* line 564 */
    eh.instance_data =  instance_data;                 /* line 565 */
    eh.state =  "idle";                                /* line 566 */
    eh.kind =  "leaf";                                 /* line 567 */
    return  eh;                                        /* line 568 *//* line 569 *//* line 570 */
}

/*  Sends a mevent on the given `port` with `data`, placing it on the output *//* line 571 */
/*  of the given component. */                         /* line 572 *//* line 573 */
function send (eh,port,datum,causingMevent) {          /* line 574 */
    let mev = make_mevent ( port, datum)               /* line 575 */;
    put_output ( eh, mev)                              /* line 576 *//* line 577 *//* line 578 */
}

function send_string (eh,port,s,causingMevent) {       /* line 579 */
    let datum = new_datum_string ( s)                  /* line 580 */;
    let mev = make_mevent ( port, datum)               /* line 581 */;
    put_output ( eh, mev)                              /* line 582 *//* line 583 *//* line 584 */
}

function forward (eh,port,mev) {                       /* line 585 */
    let fwdmev = make_mevent ( port, mev.datum)        /* line 586 */;
    put_output ( eh, fwdmev)                           /* line 587 *//* line 588 *//* line 589 */
}

function inject (eh,mev) {                             /* line 590 */
    eh.finject ( eh, mev)                              /* line 591 *//* line 592 *//* line 593 */
}

function set_active (eh) {                             /* line 594 */
    eh.state =  "active";                              /* line 595 *//* line 596 *//* line 597 */
}

function set_idle (eh) {                               /* line 598 */
    eh.state =  "idle";                                /* line 599 *//* line 600 *//* line 601 */
}

function put_output (eh,mev) {                         /* line 602 */
    eh.outq.push ( mev)                                /* line 603 *//* line 604 *//* line 605 */
}

let  projectRoot =  "";                                /* line 606 *//* line 607 */
function set_environment (project_root) {              /* line 608 *//* line 609 */
    projectRoot =  project_root;                       /* line 610 *//* line 611 *//* line 612 */
}
                                                       /* line 613 */
function string_make_persistent (s) {                  /* line 614 */
    /*  this is here for non_GC languages like Odin, it is a no_op for GC languages like Python *//* line 615 */
    return  s;                                         /* line 616 *//* line 617 *//* line 618 */
}

function string_clone (s) {                            /* line 619 */
    return  s;                                         /* line 620 *//* line 621 *//* line 622 */
}

/*  usage: app ${_00_} diagram_filename1 diagram_filename2 ... *//* line 623 */
/*  where ${_00_} is the root directory for the project *//* line 624 *//* line 625 */
function initialize_component_palette_from_files (project_root,diagram_source_files) {/* line 626 */
    let  reg = make_component_registry ();             /* line 627 */
    for (let diagram_source of  diagram_source_files) {/* line 628 */
      let all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)/* line 629 */;
      reg = generate_shell_components ( reg, all_containers_within_single_file)/* line 630 */;
      for (let container of  all_containers_within_single_file) {/* line 631 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 632 *//* line 633 */
      }                                                /* line 634 */
    }
    initialize_stock_components ( reg)                 /* line 635 */
    return  reg;                                       /* line 636 *//* line 637 *//* line 638 */
}

function initialize_component_palette_from_string (project_root) {/* line 639 */
    /*  this version ignores project_root  */          /* line 640 */
    let  reg = make_component_registry ();             /* line 641 */
    let all_containers = lnet2internal_from_string (); /* line 642 */
    reg = generate_shell_components ( reg, all_containers)/* line 643 */;
    for (let container of  all_containers) {           /* line 644 */
      register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 645 *//* line 646 */
    }
    initialize_stock_components ( reg)                 /* line 647 */
    return  reg;                                       /* line 648 *//* line 649 *//* line 650 */
}
                                                       /* line 651 */
function clone_string (s) {                            /* line 652 */
    return  s                                          /* line 653 *//* line 654 */;/* line 655 */
}

let  load_errors =  false;                             /* line 656 */
let  runtime_errors =  false;                          /* line 657 *//* line 658 */
function load_error (s) {                              /* line 659 *//* line 660 */
    console.error ( s);                                /* line 661 */
                                                       /* line 662 */
    load_errors =  true;                               /* line 663 *//* line 664 *//* line 665 */
}

function runtime_error (s) {                           /* line 666 *//* line 667 */
    console.error ( s);                                /* line 668 */
    runtime_errors =  true;                            /* line 669 *//* line 670 *//* line 671 */
}
                                                       /* line 672 */
function initialize_from_files (project_root,diagram_names) {/* line 673 */
    let arg =  null;                                   /* line 674 */
    let palette = initialize_component_palette_from_files ( project_root, diagram_names)/* line 675 */;
    return [ palette,[ project_root, diagram_names, arg]];/* line 676 *//* line 677 *//* line 678 */
}

function initialize_from_string (project_root) {       /* line 679 */
    let arg =  null;                                   /* line 680 */
    let palette = initialize_component_palette_from_string ( project_root)/* line 681 */;
    return [ palette,[ project_root, null, arg]];      /* line 682 *//* line 683 *//* line 684 */
}

function start (arg,main_container_name,palette,env) { /* line 685 */
    let project_root =  env [ 0];                      /* line 686 */
    let diagram_names =  env [ 1];                     /* line 687 */
    set_environment ( project_root)                    /* line 688 */
    /*  get entrypoint container */                    /* line 689 */
    let  main_container = get_component_instance ( palette, main_container_name, null)/* line 690 */;
    if ( null ==  main_container) {                    /* line 691 */
      load_error ( ( "Couldn't find container with page name /".toString ()+  ( main_container_name.toString ()+  ( "/ in files ".toString ()+  (`${ diagram_names}`.toString ()+  " (check tab names, or disable compression?)".toString ()) .toString ()) .toString ()) .toString ()) )/* line 695 *//* line 696 */
    }
    if ((!  load_errors)) {                            /* line 697 */
      let  marg = new_datum_string ( arg)              /* line 698 */;
      let  mev = make_mevent ( "", marg)               /* line 699 */;
      inject ( main_container, mev)                    /* line 700 *//* line 701 */
    }                                                  /* line 702 *//* line 703 */
}
                                                       /* line 704 */
/*  utility functions  */                              /* line 705 */
function send_int (eh,port,i,causing_mevent) {         /* line 706 */
    let datum = new_datum_string (`${ i}`)             /* line 707 */;
    send ( eh, port, datum, causing_mevent)            /* line 708 *//* line 709 *//* line 710 */
}

function send_bang (eh,port,causing_mevent) {          /* line 711 */
    let datum = new_datum_bang ();                     /* line 712 */
    send ( eh, port, datum, causing_mevent)            /* line 713 *//* line 714 */
}

/*  this needs to be rewritten to use the low_level "shell_out“ component, this can be done solely as a diagram without using python code here *//* line 1 */
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
    if ( rc ==  0) {                                   /* line 16 */
      send_string ( eh, "", ( stdout.toString ()+  stderr.toString ()) , msg)/* line 17 */
    }
    else {                                             /* line 18 */
      send_string ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , msg)/* line 19 *//* line 20 */
    }                                                  /* line 21 *//* line 22 */
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
            register_component ( reg, generated_leaf)  /* line 37 */
          }
          else if (first_char_is ( child_descriptor [ "name"], "'")) {/* line 38 */
            let name =  child_descriptor [ "name"];    /* line 39 */
            let s =   name.substring (1)               /* line 40 */;
            let generated_leaf = mkTemplate ( name, s, string_constant_instantiate)/* line 41 */;
            register_component_allow_overwriting ( reg, generated_leaf)/* line 42 *//* line 43 */
          }                                            /* line 44 */
        }                                              /* line 45 */
      }                                                /* line 46 */
    }
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

function probe_handler (eh,mev) {                      /* line 16 *//* line 17 */
    let s =  mev.datum.v;                              /* line 18 */
    live_update ( "Info",  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.name.toString ()+  ( ": ".toString ()+   s.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 26 *//* line 27 *//* line 28 */
}

function trash_instantiate (reg,owner,name,template_data) {/* line 29 */
    let name_with_id = gensymbol ( "trash")            /* line 30 */;
    return make_leaf ( name_with_id, owner, null, trash_handler)/* line 31 */;/* line 32 *//* line 33 */
}

function trash_handler (eh,mev) {                      /* line 34 */
    /*  to appease dumped_on_floor checker */          /* line 35 *//* line 36 *//* line 37 */
}

class TwoMevents {
  constructor () {                                     /* line 38 */

    this.firstmev =  null;                             /* line 39 */
    this.secondmev =  null;                            /* line 40 *//* line 41 */
  }
}
                                                       /* line 42 */
/*  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } *//* line 43 */
class Deracer_Instance_Data {
  constructor () {                                     /* line 44 */

    this.state =  null;                                /* line 45 */
    this.buffer =  null;                               /* line 46 *//* line 47 */
  }
}
                                                       /* line 48 */
function reclaim_Buffers_from_heap (inst) {            /* line 49 *//* line 50 *//* line 51 *//* line 52 */
}

function deracer_instantiate (reg,owner,name,template_data) {/* line 53 */
    let name_with_id = gensymbol ( "deracer")          /* line 54 */;
    let  inst =  new Deracer_Instance_Data ();         /* line 55 */;
    inst.state =  "idle";                              /* line 56 */
    inst.buffer =  new TwoMevents ();                  /* line 57 */;
    let eh = make_leaf ( name_with_id, owner, inst, deracer_handler)/* line 58 */;
    return  eh;                                        /* line 59 *//* line 60 *//* line 61 */
}

function send_firstmev_then_secondmev (eh,inst) {      /* line 62 */
    forward ( eh, "1", inst.buffer.firstmev)           /* line 63 */
    forward ( eh, "2", inst.buffer.secondmev)          /* line 64 */
    reclaim_Buffers_from_heap ( inst)                  /* line 65 *//* line 66 *//* line 67 */
}

function deracer_handler (eh,mev) {                    /* line 68 */
    let  inst =  eh.instance_data;                     /* line 69 */
    if ( inst.state ==  "idle") {                      /* line 70 */
      if ( "1" ==  mev.port) {                         /* line 71 */
        inst.buffer.firstmev =  mev;                   /* line 72 */
        inst.state =  "waitingForSecondmev";           /* line 73 */
      }
      else if ( "2" ==  mev.port) {                    /* line 74 */
        inst.buffer.secondmev =  mev;                  /* line 75 */
        inst.state =  "waitingForFirstmev";            /* line 76 */
      }
      else {                                           /* line 77 */
        runtime_error ( ( "bad mev.port (case A) for deracer ".toString ()+  mev.port.toString ()) )/* line 78 *//* line 79 */
      }
    }
    else if ( inst.state ==  "waitingForFirstmev") {   /* line 80 */
      if ( "1" ==  mev.port) {                         /* line 81 */
        inst.buffer.firstmev =  mev;                   /* line 82 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 83 */
        inst.state =  "idle";                          /* line 84 */
      }
      else {                                           /* line 85 */
        runtime_error ( ( "bad mev.port (case B) for deracer ".toString ()+  mev.port.toString ()) )/* line 86 *//* line 87 */
      }
    }
    else if ( inst.state ==  "waitingForSecondmev") {  /* line 88 */
      if ( "2" ==  mev.port) {                         /* line 89 */
        inst.buffer.secondmev =  mev;                  /* line 90 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 91 */
        inst.state =  "idle";                          /* line 92 */
      }
      else {                                           /* line 93 */
        runtime_error ( ( "bad mev.port (case C) for deracer ".toString ()+  mev.port.toString ()) )/* line 94 *//* line 95 */
      }
    }
    else {                                             /* line 96 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 97 *//* line 98 */
    }                                                  /* line 99 *//* line 100 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data) {/* line 101 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 102 */;
    return make_leaf ( name_with_id, owner, null, low_level_read_text_file_handler)/* line 103 */;/* line 104 *//* line 105 */
}

function low_level_read_text_file_handler (eh,mev) {   /* line 106 */
    let fname =  mev.datum.v;                          /* line 107 */

    if (fname == "0") {
    data = fs.readFileSync (0, { encoding: 'utf8'});
    } else {
    data = fs.readFileSync (fname, { encoding: 'utf8'});
    }
    if (data) {
      send_string (eh, "", data, mev);
    } else {
      send_string (eh, "✗", `read error on file '${fname}'`, mev);
    }
                                                       /* line 108 *//* line 109 *//* line 110 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data) {/* line 111 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 112 */;
    return make_leaf ( name_with_id, owner, null, ensure_string_datum_handler)/* line 113 */;/* line 114 *//* line 115 */
}

function ensure_string_datum_handler (eh,mev) {        /* line 116 */
    if ( "string" ==  mev.datum.kind ()) {             /* line 117 */
      forward ( eh, "", mev)                           /* line 118 */
    }
    else {                                             /* line 119 */
      let emev =  ( "*** ensure: type error (expected a string datum) but got ".toString ()+  mev.datum.toString ()) /* line 120 */;
      send_string ( eh, "✗", emev, mev)                /* line 121 *//* line 122 */
    }                                                  /* line 123 *//* line 124 */
}

class Syncfilewrite_Data {
  constructor () {                                     /* line 125 */

    this.filename =  "";                               /* line 126 *//* line 127 */
  }
}
                                                       /* line 128 */
/*  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) *//* line 129 */
function syncfilewrite_instantiate (reg,owner,name,template_data) {/* line 130 */
    let name_with_id = gensymbol ( "syncfilewrite")    /* line 131 */;
    let inst =  new Syncfilewrite_Data ();             /* line 132 */;
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)/* line 133 */;/* line 134 *//* line 135 */
}

function syncfilewrite_handler (eh,mev) {              /* line 136 */
    let  inst =  eh.instance_data;                     /* line 137 */
    if ( "filename" ==  mev.port) {                    /* line 138 */
      inst.filename =  mev.datum.v;                    /* line 139 */
    }
    else if ( "input" ==  mev.port) {                  /* line 140 */
      let contents =  mev.datum.v;                     /* line 141 */
      let  f = open ( inst.filename, "w")              /* line 142 */;
      if ( f!= null) {                                 /* line 143 */
        f.write ( mev.datum.v)                         /* line 144 */
        f.close ()                                     /* line 145 */
        send ( eh, "done",new_datum_bang (), mev)      /* line 146 */
      }
      else {                                           /* line 147 */
        send_string ( eh, "✗", ( "open error on file ".toString ()+  inst.filename.toString ()) , mev)/* line 148 *//* line 149 */
      }                                                /* line 150 */
    }                                                  /* line 151 *//* line 152 */
}

class StringConcat_Instance_Data {
  constructor () {                                     /* line 153 */

    this.buffer1 =  null;                              /* line 154 */
    this.buffer2 =  null;                              /* line 155 *//* line 156 */
  }
}
                                                       /* line 157 */
function stringconcat_instantiate (reg,owner,name,template_data) {/* line 158 */
    let name_with_id = gensymbol ( "stringconcat")     /* line 159 */;
    let instp =  new StringConcat_Instance_Data ();    /* line 160 */;
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)/* line 161 */;/* line 162 *//* line 163 */
}

function stringconcat_handler (eh,mev) {               /* line 164 */
    let  inst =  eh.instance_data;                     /* line 165 */
    if ( "1" ==  mev.port) {                           /* line 166 */
      inst.buffer1 = clone_string ( mev.datum.v)       /* line 167 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 168 */
    }
    else if ( "2" ==  mev.port) {                      /* line 169 */
      inst.buffer2 = clone_string ( mev.datum.v)       /* line 170 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 171 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 172 */
      inst.buffer1 =  null;                            /* line 173 */
      inst.buffer2 =  null;                            /* line 174 */
    }
    else {                                             /* line 175 */
      runtime_error ( ( "bad mev.port for stringconcat: ".toString ()+  mev.port.toString ()) )/* line 176 *//* line 177 */
    }                                                  /* line 178 *//* line 179 */
}

function maybe_stringconcat (eh,inst,mev) {            /* line 180 */
    if ((( inst.buffer1!= null) && ( inst.buffer2!= null))) {/* line 181 */
      let  concatenated_string =  "";                  /* line 182 */
      if ( 0 == ( inst.buffer1.length)) {              /* line 183 */
        concatenated_string =  inst.buffer2;           /* line 184 */
      }
      else if ( 0 == ( inst.buffer2.length)) {         /* line 185 */
        concatenated_string =  inst.buffer1;           /* line 186 */
      }
      else {                                           /* line 187 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 188 *//* line 189 */
      }
      send_string ( eh, "", concatenated_string, mev)  /* line 190 */
      inst.buffer1 =  null;                            /* line 191 */
      inst.buffer2 =  null;                            /* line 192 *//* line 193 */
    }                                                  /* line 194 *//* line 195 */
}

/*  */                                                 /* line 196 *//* line 197 */
function string_constant_instantiate (reg,owner,name,template_data) {/* line 198 *//* line 199 */
    let name_with_id = gensymbol ( "strconst")         /* line 200 */;
    let  s =  template_data;                           /* line 201 */
    if ( projectRoot!= "") {                           /* line 202 */
      s =  s.replaceAll ( "_00_",  projectRoot)        /* line 203 */;/* line 204 */
    }
    return make_leaf ( name_with_id, owner, s, string_constant_handler)/* line 205 */;/* line 206 *//* line 207 */
}

function string_constant_handler (eh,mev) {            /* line 208 */
    let s =  eh.instance_data;                         /* line 209 */
    send_string ( eh, "", s, mev)                      /* line 210 *//* line 211 *//* line 212 */
}

function fakepipename_instantiate (reg,owner,name,template_data) {/* line 213 */
    let instance_name = gensymbol ( "fakepipe")        /* line 214 */;
    return make_leaf ( instance_name, owner, null, fakepipename_handler)/* line 215 */;/* line 216 *//* line 217 */
}

let  rand =  0;                                        /* line 218 *//* line 219 */
function fakepipename_handler (eh,mev) {               /* line 220 *//* line 221 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ ;rand' must be unique within a single run *//* line 222 */
    send_string ( eh, "", ( "/tmp/fakepipe".toString ()+  rand.toString ()) , mev)/* line 223 *//* line 224 *//* line 225 */
}
                                                       /* line 226 */
class Switch1star_Instance_Data {
  constructor () {                                     /* line 227 */

    this.state =  "1";                                 /* line 228 *//* line 229 */
  }
}
                                                       /* line 230 */
function switch1star_instantiate (reg,owner,name,template_data) {/* line 231 */
    let name_with_id = gensymbol ( "switch1*")         /* line 232 */;
    let instp =  new Switch1star_Instance_Data ();     /* line 233 */;
    return make_leaf ( name_with_id, owner, instp, switch1star_handler)/* line 234 */;/* line 235 *//* line 236 */
}

function switch1star_handler (eh,mev) {                /* line 237 */
    let  inst =  eh.instance_data;                     /* line 238 */
    let whichOutput =  inst.state;                     /* line 239 */
    if ( "" ==  mev.port) {                            /* line 240 */
      if ( "1" ==  whichOutput) {                      /* line 241 */
        forward ( eh, "1", mev)                        /* line 242 */
        inst.state =  "*";                             /* line 243 */
      }
      else if ( "*" ==  whichOutput) {                 /* line 244 */
        forward ( eh, "*", mev)                        /* line 245 */
      }
      else {                                           /* line 246 */
        send ( eh, "✗", "internal error bad state in switch1*", mev)/* line 247 *//* line 248 */
      }
    }
    else if ( "reset" ==  mev.port) {                  /* line 249 */
      inst.state =  "1";                               /* line 250 */
    }
    else {                                             /* line 251 */
      send ( eh, "✗", "internal error bad mevent for switch1*", mev)/* line 252 *//* line 253 */
    }                                                  /* line 254 *//* line 255 */
}

class Latch_Instance_Data {
  constructor () {                                     /* line 256 */

    this.datum =  null;                                /* line 257 *//* line 258 */
  }
}
                                                       /* line 259 */
function latch_instantiate (reg,owner,name,template_data) {/* line 260 */
    let name_with_id = gensymbol ( "latch")            /* line 261 */;
    let instp =  new Latch_Instance_Data ();           /* line 262 */;
    return make_leaf ( name_with_id, owner, instp, latch_handler)/* line 263 */;/* line 264 *//* line 265 */
}

function latch_handler (eh,mev) {                      /* line 266 */
    let  inst =  eh.instance_data;                     /* line 267 */
    if ( "" ==  mev.port) {                            /* line 268 */
      inst.datum =  mev.datum;                         /* line 269 */
    }
    else if ( "release" ==  mev.port) {                /* line 270 */
      let  d =  inst.datum;                            /* line 271 */
      if ( d ==  null) {                               /* line 272 */
        send_string ( eh, "", "", mev)                 /* line 273 */
        console.error ( " *** latch sending empty string ***");/* line 274 */
      }
      else {                                           /* line 275 */
        send ( eh, "", d, mev)                         /* line 276 *//* line 277 */
      }
      inst.datum =  null;                              /* line 278 */
    }
    else {                                             /* line 279 */
      send ( eh, "✗", "internal error bad mevent for latch", mev)/* line 280 *//* line 281 */
    }                                                  /* line 282 *//* line 283 */
}

/*  all of the the built_in leaves are listed here */  /* line 284 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 285 *//* line 286 */
function initialize_stock_components (reg) {           /* line 287 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 288 */
    register_component ( reg,mkTemplate ( "?A", null, probeA_instantiate))/* line 289 */
    register_component ( reg,mkTemplate ( "?B", null, probeB_instantiate))/* line 290 */
    register_component ( reg,mkTemplate ( "?C", null, probeC_instantiate))/* line 291 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 292 *//* line 293 */
    register_component ( reg,mkTemplate ( "Read Text File", null, low_level_read_text_file_instantiate))/* line 294 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 295 *//* line 296 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 297 */
    register_component ( reg,mkTemplate ( "stringconcat", null, stringconcat_instantiate))/* line 298 */
    register_component ( reg,mkTemplate ( "switch1*", null, switch1star_instantiate))/* line 299 */
    register_component ( reg,mkTemplate ( "latch", null, latch_instantiate))/* line 300 */
    /*  for fakepipe */                                /* line 301 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 302 *//* line 303 *//* line 304 */
}




