import * as fs from 'fs';
import path from 'path';
import execSync from 'child_process';
import 'dotenv/config';
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
                                                       /* line 37 *//* line 38 */
/*  Mevent passed to a leaf component. */              /* line 39 */
/*  */                                                 /* line 40 */
/*  `port` refers to the name of the incoming or outgoing port of this component. *//* line 41 */
/*  `payload` is the data attached to this mevent. */  /* line 42 */
class Mevent {
  constructor () {                                     /* line 43 */

    this.port =  null;                                 /* line 44 */
    this.datum =  null;                                /* line 45 *//* line 46 */
  }
}
                                                       /* line 47 */
function clone_port (s) {                              /* line 48 */
    return clone_string ( s)                           /* line 49 */;/* line 50 *//* line 51 */
}

/*  Utility for making a `Mevent`. Used to safely "seed“ mevents *//* line 52 */
/*  entering the very top of a network. */             /* line 53 */
function make_mevent (port,datum) {                    /* line 54 */
    let p = clone_string ( port)                       /* line 55 */;
    let  m =  new Mevent ();                           /* line 56 */;
    m.port =  p;                                       /* line 57 */
    m.datum =  datum.clone ();                         /* line 58 */
    return  m;                                         /* line 59 *//* line 60 *//* line 61 */
}

/*  Clones a mevent. Primarily used internally for “fanning out“ a mevent to multiple destinations. *//* line 62 */
function mevent_clone (mev) {                          /* line 63 */
    let  m =  new Mevent ();                           /* line 64 */;
    m.port = clone_port ( mev.port)                    /* line 65 */;
    m.datum =  mev.datum.clone ();                     /* line 66 */
    return  m;                                         /* line 67 *//* line 68 *//* line 69 */
}

/*  Frees a mevent. */                                 /* line 70 */
function destroy_mevent (mev) {                        /* line 71 */
    /*  during debug, dont destroy any mevent, since we want to trace mevents, thus, we need to persist ancestor mevents *//* line 72 *//* line 73 *//* line 74 *//* line 75 */
}

function destroy_datum (mev) {                         /* line 76 *//* line 77 *//* line 78 *//* line 79 */
}

function destroy_port (mev) {                          /* line 80 *//* line 81 *//* line 82 *//* line 83 */
}

/*  */                                                 /* line 84 */
function format_mevent (m) {                           /* line 85 */
    if ( m ==  null) {                                 /* line 86 */
      return  "{}";                                    /* line 87 */
    }
    else {                                             /* line 88 */
      return  ( "{%5C”".toString ()+  ( m.port.toString ()+  ( "%5C”:%5C”".toString ()+  ( m.datum.v.toString ()+  "%5C”}".toString ()) .toString ()) .toString ()) .toString ()) /* line 89 */;/* line 90 */
    }                                                  /* line 91 */
}

function format_mevent_raw (m) {                       /* line 92 */
    if ( m ==  null) {                                 /* line 93 */
      return  "";                                      /* line 94 */
    }
    else {                                             /* line 95 */
      return  m.datum.v;                               /* line 96 *//* line 97 */
    }                                                  /* line 98 *//* line 99 */
}

const  enumDown =  0                                   /* line 100 */;
const  enumAcross =  1                                 /* line 101 */;
const  enumUp =  2                                     /* line 102 */;
const  enumThrough =  3                                /* line 103 */;/* line 104 */
function create_down_connector (container,proto_conn,connectors,children_by_id) {/* line 105 */
    /*  JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''}, *//* line 106 */
    let  connector =  new Connector ();                /* line 107 */;
    connector.direction =  "down";                     /* line 108 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 109 */;
    let target_proto =  proto_conn [ "target"];        /* line 110 */
    let id_proto =  target_proto [ "id"];              /* line 111 */
    let target_component =  children_by_id [id_proto]; /* line 112 */
    if (( target_component ==  null)) {                /* line 113 */
      load_error ( ( "internal error: .Down connection target internal error ".toString ()+ ( proto_conn [ "target"]) [ "name"].toString ()) )/* line 114 */
    }
    else {                                             /* line 115 */
      connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 116 */;/* line 117 */
    }
    return  connector;                                 /* line 118 *//* line 119 *//* line 120 */
}

function create_across_connector (container,proto_conn,connectors,children_by_id) {/* line 121 */
    let  connector =  new Connector ();                /* line 122 */;
    connector.direction =  "across";                   /* line 123 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 124 */
    let target_component =  children_by_id [(( proto_conn [ "target"]) [ "id"])];/* line 125 */
    if ( source_component ==  null) {                  /* line 126 */
      load_error ( ( "internal error: .Across connection source not ok ".toString ()+ ( proto_conn [ "source"]) [ "name"].toString ()) )/* line 127 */
    }
    else {                                             /* line 128 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 129 */;
      if ( target_component ==  null) {                /* line 130 */
        load_error ( ( "internal error: .Across connection target not ok ".toString ()+ ( proto_conn [ "target"]) [ "name"].toString ()) )/* line 131 */
      }
      else {                                           /* line 132 */
        connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)/* line 133 */;/* line 134 */
      }                                                /* line 135 */
    }
    return  connector;                                 /* line 136 *//* line 137 *//* line 138 */
}

function create_up_connector (container,proto_conn,connectors,children_by_id) {/* line 139 */
    let  connector =  new Connector ();                /* line 140 */;
    connector.direction =  "up";                       /* line 141 */
    let source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])];/* line 142 */
    if ( source_component ==  null) {                  /* line 143 */
      load_error ( ( "internal error: .Up connection source not ok ".toString ()+ ( proto_conn [ "source"]) [ "name"].toString ()) )/* line 144 */
    }
    else {                                             /* line 145 */
      connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])/* line 146 */;
      connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 147 */;/* line 148 */
    }
    return  connector;                                 /* line 149 *//* line 150 *//* line 151 */
}

function create_through_connector (container,proto_conn,connectors,children_by_id) {/* line 152 */
    let  connector =  new Connector ();                /* line 153 */;
    connector.direction =  "through";                  /* line 154 */
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])/* line 155 */;
    connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)/* line 156 */;
    return  connector;                                 /* line 157 *//* line 158 *//* line 159 */
}
                                                       /* line 160 */
function container_instantiator (reg,owner,container_name,desc,arg) {/* line 161 *//* line 162 */
    let container = make_container ( container_name, owner)/* line 163 */;
    let children = [];                                 /* line 164 */
    let children_by_id = {};
    /*  not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here *//* line 165 */
    /*  collect children */                            /* line 166 */
    for (let child_desc of  desc [ "children"]) {      /* line 167 */
      let child_instance = get_component_instance ( reg, child_desc [ "name"], container)/* line 168 */;
      children.push ( child_instance)                  /* line 169 */
      let id =  child_desc [ "id"];                    /* line 170 */
      children_by_id [id] =  child_instance;           /* line 171 *//* line 172 *//* line 173 */
    }
    container.children =  children;                    /* line 174 *//* line 175 */
    let connectors = [];                               /* line 176 */
    for (let proto_conn of  desc [ "connections"]) {   /* line 177 */
      let  connector =  new Connector ();              /* line 178 */;
      if ( proto_conn [ "dir"] ==  enumDown) {         /* line 179 */
        connectors.push (create_down_connector ( container, proto_conn, connectors, children_by_id)) /* line 180 */
      }
      else if ( proto_conn [ "dir"] ==  enumAcross) {  /* line 181 */
        connectors.push (create_across_connector ( container, proto_conn, connectors, children_by_id)) /* line 182 */
      }
      else if ( proto_conn [ "dir"] ==  enumUp) {      /* line 183 */
        connectors.push (create_up_connector ( container, proto_conn, connectors, children_by_id)) /* line 184 */
      }
      else if ( proto_conn [ "dir"] ==  enumThrough) { /* line 185 */
        connectors.push (create_through_connector ( container, proto_conn, connectors, children_by_id)) /* line 186 *//* line 187 */
      }                                                /* line 188 */
    }
    container.connections =  connectors;               /* line 189 */
    return  container;                                 /* line 190 *//* line 191 *//* line 192 */
}

/*  The default handler for container components. */   /* line 193 */
function container_handler (container,mevent) {        /* line 194 */
    route ( container, container, mevent)
    /*  references to 'self' are replaced by the container during instantiation *//* line 195 */
    while (any_child_ready ( container)) {             /* line 196 */
      step_children ( container, mevent)               /* line 197 */
    }                                                  /* line 198 *//* line 199 */
}

/*  Stop all children. Reset to a known state. Hit the big red button.  *//* line 200 */
function container_reset_children (container) {        /* line 201 */
    for (let child of  container.children) {           /* line 202 */
      child.stop ( child)                              /* line 203 *//* line 204 */
    }

    container.visit_ordering = [];                     /* line 205 */

    container.routings = [];                           /* line 206 */

    container.inq = [];                                /* line 207 */

    container.outq = [];                               /* line 208 */
    container.state =  "idle";                         /* line 209 *//* line 210 *//* line 211 */
}

/*  Frees the given container and associated data. */  /* line 212 */
function destroy_container (eh) {                      /* line 213 *//* line 214 *//* line 215 *//* line 216 */
}
                                                       /* line 217 */
/*  Routing connection for a container component. The `direction` field has *//* line 218 */
/*  no affect on the default mevent routing system _ it is there for debugging *//* line 219 */
/*  purposes, or for reading by other tools. */        /* line 220 *//* line 221 */
class Connector {
  constructor () {                                     /* line 222 */

    this.direction =  null;/*  down, across, up, through *//* line 223 */
    this.sender =  null;                               /* line 224 */
    this.receiver =  null;                             /* line 225 *//* line 226 */
  }
}
                                                       /* line 227 */
/*  `Sender` is used to “pattern match“ which `Receiver` a mevent should go to, *//* line 228 */
/*  based on component ID (pointer) and port name. */  /* line 229 *//* line 230 */
class Sender {
  constructor () {                                     /* line 231 */

    this.name =  null;                                 /* line 232 */
    this.component =  null;                            /* line 233 */
    this.port =  null;                                 /* line 234 *//* line 235 */
  }
}
                                                       /* line 236 *//* line 237 *//* line 238 */
/*  `Receiver` is a handle to a destination queue, and a `port` name to assign *//* line 239 */
/*  to incoming mevents to this queue. */              /* line 240 *//* line 241 */
class Receiver {
  constructor () {                                     /* line 242 */

    this.name =  null;                                 /* line 243 */
    this.queue =  null;                                /* line 244 */
    this.port =  null;                                 /* line 245 */
    this.component =  null;                            /* line 246 *//* line 247 */
  }
}
                                                       /* line 248 */
function mkSender (name,component,port) {              /* line 249 */
    let  s =  new Sender ();                           /* line 250 */;
    s.name =  name;                                    /* line 251 */
    s.component =  component;                          /* line 252 */
    s.port =  port;                                    /* line 253 */
    return  s;                                         /* line 254 *//* line 255 *//* line 256 */
}

function mkReceiver (name,component,port,q) {          /* line 257 */
    let  r =  new Receiver ();                         /* line 258 */;
    r.name =  name;                                    /* line 259 */
    r.component =  component;                          /* line 260 */
    r.port =  port;                                    /* line 261 */
    /*  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. *//* line 262 */
    r.queue =  q;                                      /* line 263 */
    return  r;                                         /* line 264 *//* line 265 *//* line 266 */
}

/*  Checks if two senders match, by pointer equality and port name matching. *//* line 267 */
function sender_eq (s1,s2) {                           /* line 268 */
    let same_components = ( s1.component ==  s2.component);/* line 269 */
    let same_ports = ( s1.port ==  s2.port);           /* line 270 */
    return (( same_components) && ( same_ports));      /* line 271 *//* line 272 *//* line 273 */
}

/*  Delivers the given mevent to the receiver of this connector. *//* line 274 *//* line 275 */
function deposit (parent,conn,mevent) {                /* line 276 */
    let new_mevent = make_mevent ( conn.receiver.port, mevent.datum)/* line 277 */;
    push_mevent ( parent, conn.receiver.component, conn.receiver.queue, new_mevent)/* line 278 *//* line 279 *//* line 280 */
}

function force_tick (parent,eh) {                      /* line 281 */
    let tick_mev = make_mevent ( ".",new_datum_bang ())/* line 282 */;
    push_mevent ( parent, eh, eh.inq, tick_mev)        /* line 283 */
    return  tick_mev;                                  /* line 284 *//* line 285 *//* line 286 */
}

function push_mevent (parent,receiver,inq,m) {         /* line 287 */
    inq.push ( m)                                      /* line 288 */
    if (( receiver.special)) {                         /* line 289 */
      parent.visit_ordering.unshift ( receiver)        /* line 290 */
    }
    else {                                             /* line 291 */
      parent.visit_ordering.push ( receiver)           /* line 292 *//* line 293 */
    }                                                  /* line 294 *//* line 295 *//* line 296 */
}

function is_self (child,container) {                   /* line 297 */
    /*  in an earlier version “self“ was denoted as ϕ *//* line 298 */
    return  child ==  container;                       /* line 299 *//* line 300 *//* line 301 */
}

function step_child_once (child,mev) {                 /* line 302 */
    if (( false )) {                                   /* line 303 */
      console.error ( ( "-- stepping '".toString ()+  ( child.name.toString ()+  "'".toString ()) .toString ()) );/* line 304 */
                                                       /* line 305 *//* line 306 */
    }
    let before_state =  child.state;                   /* line 307 */
    child.handler ( child, mev)                        /* line 308 */
    let after_state =  child.state;                    /* line 309 */
    return [(( before_state ==  "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state ==  "idle"))];/* line 312 *//* line 313 *//* line 314 */
}

function step_children (container,causingMevent) {     /* line 315 */
    container.state =  "idle";                         /* line 316 *//* line 317 */
    /*  phase 1 - loop through children and process inputs or children that not "idle"  *//* line 318 */
    for (let child of   container.visit_ordering) {    /* line 319 */
      /*  child = container represents self, skip it *//* line 320 */
      if (((! (is_self ( child, container))))) {       /* line 321 */
        if (((! ((0=== child.inq.length))))) {         /* line 322 */
          let mev =  child.inq.shift ()                /* line 323 */;
          step_child_once ( child, mev)                /* line 324 *//* line 325 */
          destroy_mevent ( mev)                        /* line 326 */
        }
        else {                                         /* line 327 */
          if ( child.state!= "idle") {                 /* line 328 */
            let mev = force_tick ( container, child)   /* line 329 */;
            step_child_once ( child, mev)              /* line 330 */
            destroy_mevent ( mev)                      /* line 331 *//* line 332 */
          }                                            /* line 333 */
        }                                              /* line 334 */
      }                                                /* line 335 */
    }

    container.visit_ordering = [];                     /* line 336 *//* line 337 */
    /*  phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections  *//* line 338 */
    for (let child of  container.children) {           /* line 339 */
      if ( child.state ==  "active") {                 /* line 340 */
        /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 341 */
        container.state =  "active";                   /* line 342 *//* line 343 */
      }                                                /* line 344 */
      while (((! ((0=== child.outq.length))))) {       /* line 345 */
        let mev =  child.outq.shift ()                 /* line 346 */;
        route ( container, child, mev)                 /* line 347 */
        destroy_mevent ( mev)                          /* line 348 *//* line 349 */
      }                                                /* line 350 */
    }                                                  /* line 351 *//* line 352 */
}

function attempt_tick (parent,eh) {                    /* line 353 */
    if ( eh.state!= "idle") {                          /* line 354 */
      force_tick ( parent, eh)                         /* line 355 *//* line 356 */
    }                                                  /* line 357 *//* line 358 */
}

function is_tick (mev) {                               /* line 359 */
    return  "." ==  mev.port
    /*  assume that any mevent that is sent to port "." is a tick  *//* line 360 */;/* line 361 *//* line 362 */
}

/*  Routes a single mevent to all matching destinations, according to *//* line 363 */
/*  the container's connection network. */             /* line 364 *//* line 365 */
function route (container,from_component,mevent) {     /* line 366 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 367 */
    let  fromname =  "";                               /* line 368 *//* line 369 */
    ticktime =  ticktime+ 1;                           /* line 370 */
    if (is_tick ( mevent)) {                           /* line 371 */
      for (let child of  container.children) {         /* line 372 */
        attempt_tick ( container, child)               /* line 373 */
      }
      was_sent =  true;                                /* line 374 */
    }
    else {                                             /* line 375 */
      if (((! (is_self ( from_component, container))))) {/* line 376 */
        fromname =  from_component.name;               /* line 377 *//* line 378 */
      }
      let from_sender = mkSender ( fromname, from_component, mevent.port)/* line 379 */;/* line 380 */
      for (let connector of  container.connections) {  /* line 381 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 382 */
          deposit ( container, connector, mevent)      /* line 383 */
          was_sent =  true;                            /* line 384 *//* line 385 */
        }                                              /* line 386 */
      }                                                /* line 387 */
    }
    if ((! ( was_sent))) {                             /* line 388 */
      console.error ( "internal error" + ": " +  ( container.name.toString ()+  ( ": mevent on port '".toString ()+  ( mevent.port.toString ()+  ( "' from ".toString ()+  ( fromname.toString ()+  " dropped on floor...".toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 389 *//* line 390 */
    }                                                  /* line 391 *//* line 392 */
}

function any_child_ready (container) {                 /* line 393 */
    for (let child of  container.children) {           /* line 394 */
      if (child_is_ready ( child)) {                   /* line 395 */
        return  true;                                  /* line 396 *//* line 397 */
      }                                                /* line 398 */
    }
    return  false;                                     /* line 399 *//* line 400 *//* line 401 */
}

function child_is_ready (eh) {                         /* line 402 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 403 *//* line 404 *//* line 405 */
}

function append_routing_descriptor (container,desc) {  /* line 406 */
    container.routings.push ( desc)                    /* line 407 *//* line 408 *//* line 409 */
}

function injector (eh,mevent) {                        /* line 410 */
    eh.handler ( eh, mevent)                           /* line 411 *//* line 412 *//* line 413 */
}
                                                       /* line 414 *//* line 415 *//* line 416 */
class Component_Registry {
  constructor () {                                     /* line 417 */

    this.templates = {};                               /* line 418 *//* line 419 */
  }
}
                                                       /* line 420 */
class Template {
  constructor () {                                     /* line 421 */

    this.name =  null;                                 /* line 422 */
    this.container =  null;                            /* line 423 */
    this.instantiator =  null;                         /* line 424 *//* line 425 */
  }
}
                                                       /* line 426 */
function mkTemplate (name,template_data,instantiator) {/* line 427 */
    let  templ =  new Template ();                     /* line 428 */;
    templ.name =  name;                                /* line 429 */
    templ.template_data =  template_data;              /* line 430 */
    templ.instantiator =  instantiator;                /* line 431 */
    return  templ;                                     /* line 432 *//* line 433 *//* line 434 */
}
                                                       /* line 435 */
/*  convert a little-network to internal form (an object data structure created by json parser) ...  *//* line 436 */
/*  the actual data structure depends on the json parser library used by the target language  *//* line 437 */
/*  the form of the data structure doesn't matter here, as long as we use lookup operators "@" in this .rt code  *//* line 438 *//* line 439 */
/*  ... by reading the little-net from an external file  *//* line 440 */
function lnet2internal_from_file (container_xml) {     /* line 441 */
    let pathname = process.env.PBPWD                   /* line 442 */;
    let filename =   container_xml                     /* line 443 */;

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
                                                       /* line 444 *//* line 445 *//* line 446 */
}

/*  ... by reading the little-net from an embedded string (an aspect of creating t2t tool code)  *//* line 447 */
function lnet2internal_from_string (lnet) {            /* line 448 */

    return JSON.parse (lnet);
                                                       /* line 449 *//* line 450 *//* line 451 */
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
      load_error ( ( "Component /".toString ()+  ( template.name.toString ()+  "/ already declared".toString ()) .toString ()) )/* line 466 */
      return  reg;                                     /* line 467 */
    }
    else {                                             /* line 468 */
      reg.templates [name] =  template;                /* line 469 */
      return  reg;                                     /* line 470 *//* line 471 */
    }                                                  /* line 472 *//* line 473 */
}

function get_component_instance (reg,full_name,owner) {/* line 474 */
    /*  If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it.  *//* line 475 */
    /*  ":?<string>" is a probe part that is tagged with <string>  *//* line 476 */
    /*  ":$ <command>" is a shell-out part that sends <command> to the operating system shell  *//* line 477 */
    /*  ":<string>" else, it's just treated as a string part that produces <string> on its output  *//* line 478 */
    let template_name = mangle_name ( full_name)       /* line 479 */;
    if ( ":" ==   full_name[0] ) {                     /* line 480 */
      let instance_name = generate_instance_name ( owner, template_name)/* line 481 */;
      let instance = external_instantiate ( reg, owner, instance_name, full_name)/* line 482 */;
      return  instance;                                /* line 483 */
    }
    else {                                             /* line 484 */
      if ((( template_name) in ( reg.templates))) {    /* line 485 */
        let template =  reg.templates [template_name]; /* line 486 */
        if (( template ==  null)) {                    /* line 487 */
          load_error ( ( "Registry Error (A): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 488 */
          return  null;                                /* line 489 */
        }
        else {                                         /* line 490 */
          let instance_name = generate_instance_name ( owner, template_name)/* line 491 */;
          let instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")/* line 492 */;
          return  instance;                            /* line 493 *//* line 494 */
        }
      }
      else {                                           /* line 495 */
        load_error ( ( "Registry Error (B): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 496 */
        return  null;                                  /* line 497 *//* line 498 */
      }                                                /* line 499 */
    }                                                  /* line 500 *//* line 501 */
}

function generate_instance_name (owner,template_name) {/* line 502 */
    let owner_name =  "";                              /* line 503 */
    let instance_name =  template_name;                /* line 504 */
    if ( null!= owner) {                               /* line 505 */
      owner_name =  owner.name;                        /* line 506 */
      instance_name =  ( owner_name.toString ()+  ( "▹".toString ()+  template_name.toString ()) .toString ()) /* line 507 */;
    }
    else {                                             /* line 508 */
      instance_name =  template_name;                  /* line 509 *//* line 510 */
    }
    return  instance_name;                             /* line 511 *//* line 512 *//* line 513 */
}

function mangle_name (s) {                             /* line 514 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 515 */
    return  s;                                         /* line 516 *//* line 517 *//* line 518 */
}
                                                       /* line 519 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 520 */
/*  and output queues of mevents. */                   /* line 521 */
/*  */                                                 /* line 522 */
/*  Components can either be a user_supplied function (“leaf“), or a “container“ *//* line 523 */
/*  that routes mevents to child components according to a list of connections *//* line 524 */
/*  that serve as a mevent routing table. */           /* line 525 */
/*  */                                                 /* line 526 */
/*  Child components themselves can be leaves or other containers. *//* line 527 */
/*  */                                                 /* line 528 */
/*  `handler` invokes the code that is attached to this component. *//* line 529 */
/*  */                                                 /* line 530 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 531 */
/*  function may want whenever it is invoked again. */ /* line 532 *//* line 533 */
/*  TODO: what is .routings for? (is it a historical artefact that can be removed?)  *//* line 534 *//* line 535 */
/*  Eh_States :: enum { idle, active } */              /* line 536 */
class Eh {
  constructor () {                                     /* line 537 */

    this.name =  "";                                   /* line 538 */
    this.inq =  []                                     /* line 539 */;
    this.outq =  []                                    /* line 540 */;
    this.owner =  null;                                /* line 541 */
    this.children = [];                                /* line 542 */
    this.visit_ordering =  []                          /* line 543 */;
    this.connections = [];                             /* line 544 */
    this.routings =  []                                /* line 545 */;
    this.handler =  null;                              /* line 546 */
    this.reset_instance_data =  null;                  /* line 547 */
    this.finject =  null;                              /* line 548 */
    this.stop =  null;                                 /* line 549 */
    this.instance_data =  null;                        /* line 550 *//*  arg needed for probe support  *//* line 551 */
    this.arg =  "";                                    /* line 552 */
    this.state =  "idle";                              /* line 553 */
    this.special =  false;                             /* line 554 *//*  bootstrap debugging *//* line 555 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 556 *//* line 557 */
  }
}
                                                       /* line 558 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 559 */
/*  whose handler function is `container_handler`. */  /* line 560 */
function make_container (name,owner) {                 /* line 561 */
    let  eh =  new Eh ();                              /* line 562 */;
    eh.name =  name;                                   /* line 563 */
    eh.owner =  owner;                                 /* line 564 */
    eh.handler =  container_handler;                   /* line 565 */
    eh.finject =  injector;                            /* line 566 */
    eh.stop =  container_reset_children;               /* line 567 */
    eh.state =  "idle";                                /* line 568 */
    eh.kind =  "container";                            /* line 569 */
    return  eh;                                        /* line 570 *//* line 571 *//* line 572 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 573 */
/*  that will be passed back to your handler when called. *//* line 574 *//* line 575 */
function make_leaf (name,owner,instance_data,arg,handler,reset_handler) {/* line 576 */
    let  eh =  new Eh ();                              /* line 577 */;
    let  nm =  "";                                     /* line 578 */
    if ( null!= owner) {                               /* line 579 */
      nm =  owner.name;                                /* line 580 *//* line 581 */
    }
    eh.name =  ( nm.toString ()+  ( "▹".toString ()+  name.toString ()) .toString ()) /* line 582 */;
    eh.owner =  owner;                                 /* line 583 */
    eh.handler =  handler;                             /* line 584 */
    eh.reset_handler =  reset_handler;                 /* line 585 */
    eh.finject =  injector;                            /* line 586 */
    eh.stop =  leaf_reset;                             /* line 587 */
    eh.instance_data =  instance_data;                 /* line 588 */
    eh.arg =  arg;                                     /* line 589 */
    eh.state =  "idle";                                /* line 590 */
    eh.kind =  "leaf";                                 /* line 591 */
    return  eh;                                        /* line 592 *//* line 593 *//* line 594 */
}

/*  Reset Leaf part to a known, idle state. Hit the big red button.  *//* line 595 */
function leaf_reset (part) {                           /* line 596 */

    part.inq = [];                                     /* line 597 */

    part.outq = [];                                    /* line 598 */
    if (( part.reset_handler!= null)) {                /* line 599 */
      part.reset_handler ( part)                       /* line 600 *//* line 601 */
    }
    part.state =  "idle";                              /* line 602 *//* line 603 *//* line 604 */
}

/*  Sends a mevent on the given `port` with `data`, placing it on the output *//* line 605 */
/*  of the given component. */                         /* line 606 *//* line 607 */
function send (eh,port,obj,causingMevent) {            /* line 608 */
    let  d =  new Datum ();                            /* line 609 */;
    d.v =  obj;                                        /* line 610 */
    d.clone =  function () {return obj_clone ( d)      /* line 611 */;};
    d.reclaim =  null;                                 /* line 612 */
    let mev = make_mevent ( port, d)                   /* line 613 */;
    put_output ( eh, mev)                              /* line 614 *//* line 615 *//* line 616 */
}

function forward (eh,port,mev) {                       /* line 617 */
    let fwdmev = make_mevent ( port, mev.datum)        /* line 618 */;
    put_output ( eh, fwdmev)                           /* line 619 *//* line 620 *//* line 621 */
}

function inject_mevent (eh,mev) {                      /* line 622 */
    eh.finject ( eh, mev)                              /* line 623 *//* line 624 *//* line 625 */
}

function set_active (eh) {                             /* line 626 */
    eh.state =  "active";                              /* line 627 *//* line 628 *//* line 629 */
}

function set_idle (eh) {                               /* line 630 */
    eh.state =  "idle";                                /* line 631 *//* line 632 *//* line 633 */
}

function put_output (eh,mev) {                         /* line 634 */
    eh.outq.push ( mev)                                /* line 635 *//* line 636 *//* line 637 */
}

function obj_clone (obj) {                             /* line 638 */
    return  obj;                                       /* line 639 *//* line 640 *//* line 641 */
}

function initialize_component_palette_from_files (diagram_source_files) {/* line 642 */
    let  reg = make_component_registry ();             /* line 643 */
    for (let diagram_source of  diagram_source_files) {/* line 644 */
      let all_containers_within_single_file = lnet2internal_from_file ( diagram_source)/* line 645 */;
      for (let container of  all_containers_within_single_file) {/* line 646 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 647 *//* line 648 */
      }                                                /* line 649 */
    }
    initialize_stock_components ( reg)                 /* line 650 */
    return  reg;                                       /* line 651 *//* line 652 *//* line 653 */
}

function initialize_component_palette_from_string (lnet) {/* line 654 */
    let  reg = make_component_registry ();             /* line 655 */
    let all_containers = lnet2internal_from_string ( lnet)/* line 656 */;
    for (let container of  all_containers) {           /* line 657 */
      register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 658 *//* line 659 */
    }
    initialize_stock_components ( reg)                 /* line 660 */
    return  reg;                                       /* line 661 *//* line 662 *//* line 663 */
}
                                                       /* line 664 */
function clone_string (s) {                            /* line 665 */
    return  s                                          /* line 666 *//* line 667 */;/* line 668 */
}

let  load_errors =  false;                             /* line 669 */
let  runtime_errors =  false;                          /* line 670 *//* line 671 */
function load_error (s) {                              /* line 672 *//* line 673 */
    console.error ( s);                                /* line 674 */
                                                       /* line 675 */
    load_errors =  true;                               /* line 676 *//* line 677 *//* line 678 */
}

function runtime_error (s) {                           /* line 679 *//* line 680 */
    console.error ( s);                                /* line 681 */
    process.exit (1)                                   /* line 682 */
    runtime_errors =  true;                            /* line 683 *//* line 684 *//* line 685 */
}
                                                       /* line 686 */
function initialize_from_files (diagram_names) {       /* line 687 */
    let arg =  null;                                   /* line 688 */
    let palette = initialize_component_palette_from_files ( diagram_names)/* line 689 */;
    return [ palette,[ diagram_names, arg]];           /* line 690 *//* line 691 *//* line 692 */
}

function initialize_from_string () {                   /* line 693 */
    let arg =  null;                                   /* line 694 */
    let palette = initialize_component_palette_from_string ();/* line 695 */
    return [ palette,[ null, arg]];                    /* line 696 *//* line 697 *//* line 698 */
}

function start (arg,part_name,palette,env) {           /* line 699 */
    let part = start_bare ( part_name, palette, env)   /* line 700 */;
    inject ( part, "", arg)                            /* line 701 */
    finalize ( part)                                   /* line 702 *//* line 703 *//* line 704 */
}

function start_bare (part_name,palette,env) {          /* line 705 */
    let diagram_names =  env [ 0];                     /* line 706 */
    /*  get entrypoint container */                    /* line 707 */
    let  part = get_component_instance ( palette, part_name, null)/* line 708 */;
    if ( null ==  part) {                              /* line 709 */
      load_error ( ( "Couldn't find container with page name /".toString ()+  ( part_name.toString ()+  ( "/ in files ".toString ()+  (`${ diagram_names}`.toString ()+  " (check tab names, or disable compression?)".toString ()) .toString ()) .toString ()) .toString ()) )/* line 713 *//* line 714 */
    }
    return  part;                                      /* line 715 *//* line 716 *//* line 717 */
}

function inject (part,port,payload) {                  /* line 718 */
    if ((!  load_errors)) {                            /* line 719 */
      let  d =  new Datum ();                          /* line 720 */;
      d.v =  payload;                                  /* line 721 */
      d.clone =  function () {return obj_clone ( d)    /* line 722 */;};
      d.reclaim =  null;                               /* line 723 */
      let  mev = make_mevent ( port, d)                /* line 724 */;
      inject_mevent ( part, mev)                       /* line 725 */
    }
    else {                                             /* line 726 */
      process.exit (1)                                 /* line 727 *//* line 728 */
    }                                                  /* line 729 *//* line 730 */
}

function finalize (part) {                             /* line 731 */
    console.log (JSON.stringify ( part.outq.map(item => ({ [item.port]: item.datum.v })), null, 2));/* line 732 *//* line 733 *//* line 734 */
}

function new_datum_bang () {                           /* line 735 */
    let  d =  new Datum ();                            /* line 736 */;
    d.v =  "!";                                        /* line 737 */
    d.clone =  function () {return obj_clone ( d)      /* line 738 */;};
    d.reclaim =  null;                                 /* line 739 */
    return  d                                          /* line 740 *//* line 741 */;
}
/*  (This used to be called `external` due to historical reasons). This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way.  *//* line 1 *//* line 2 */
function jit_instantiate (reg,owner,name,arg) {        /* line 3 */
    let name_with_id = gensymbol ( name)               /* line 4 */;
    let  inst = make_leaf ( name_with_id, owner, null, arg, handle_external, null)/* line 5 */;
    let  firstc =  name [ 1];                          /* line 6 */
    if (( firstc ==  "?")) {                           /* line 7 */
      /*  probes get to go to the front of the line  *//* line 8 */
      inst.special =  true;                            /* line 9 *//* line 10 */
    }
    return  inst;                                      /* line 11 *//* line 12 *//* line 13 */
}

function handle_jit (eh,mev) {                         /* line 14 */
    let s =  eh.arg;                                   /* line 15 */
    let  firstc =  s [ 1];                             /* line 16 */
    if ( firstc ==  "$") {                             /* line 17 */
      shell_out_handler ( eh,    s.substring (1) .substring (1) .substring (1) , mev)/* line 18 */
    }
    else if ( firstc ==  "?") {                        /* line 19 */
      probe_handler ( eh,  s.substring (1) , mev)      /* line 20 */
    }
    else {                                             /* line 21 */
      /*  just a string, send it out  */               /* line 22 */
      send ( eh, "",  s.substring (1) , mev)           /* line 23 *//* line 24 */
    }                                                  /* line 25 *//* line 26 */
}

function probe_handler (eh,tag,mev) {                  /* line 27 */
    let s =  mev.datum.v;                              /* line 28 */
    console.error ( "Info" + ": " +  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.name.toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 36 *//* line 37 *//* line 38 */
}

function shell_out_handler (eh,cmd,mev) {              /* line 39 */
    let s =  mev.datum.v;                              /* line 40 */
    let  ret =  null;                                  /* line 41 */
    let  rc =  null;                                   /* line 42 */
    let  stdout =  null;                               /* line 43 */
    let  stderr =  null;                               /* line 44 */
    let  command =  cmd;                               /* line 45 */
    let  pbpRoot = process.env.PBP                     /* line 46 */;
    if ( pbpRoot!= "") {                               /* line 47 */
      command =  command.replaceAll ( "_/",  ( pbpRoot.toString ()+  "/".toString ()) )/* line 50 */;/* line 51 */
    }
    if (( false )) {                                   /* line 52 */
      console.error ( ( "- --- shell-out: ".toString ()+  command.toString ()) );/* line 53 */
                                                       /* line 54 *//* line 55 */
    }

    stdout = execSync(`${ command} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 56 */
    if ( rc ==  0) {                                   /* line 57 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 58 */
    }
    else {                                             /* line 59 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 60 *//* line 61 */
    }                                                  /* line 62 *//* line 63 */
}
/* line 1 */
function trash_instantiate (reg,owner,name,template_data,arg) {/* line 2 */
    let name_with_id = gensymbol ( "trash")            /* line 3 */;
    return make_leaf ( name_with_id, owner, null, "", trash_handler, null)/* line 4 */;/* line 5 *//* line 6 */
}

function trash_handler (eh,mev) {                      /* line 7 */
    /*  to appease dumped_on_floor checker */          /* line 8 *//* line 9 *//* line 10 */
}

class TwoMevents {
  constructor () {                                     /* line 11 */

    this.firstmev =  null;                             /* line 12 */
    this.secondmev =  null;                            /* line 13 *//* line 14 */
  }
}
                                                       /* line 15 */
/*  Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev } *//* line 16 */
class Deracer_Instance_Data {
  constructor () {                                     /* line 17 */

    this.state =  null;                                /* line 18 */
    this.buffer =  null;                               /* line 19 *//* line 20 */
  }
}
                                                       /* line 21 */
function reclaim_Buffers_from_heap (inst) {            /* line 22 *//* line 23 *//* line 24 *//* line 25 */
}

function deracer_reset_handler (eh) {                  /* line 26 */
    let  inst =  eh.instance_data;                     /* line 27 */
    inst.state =  "idle";                              /* line 28 */
    inst.buffer =  new TwoMevents ();                  /* line 29 */;/* line 30 *//* line 31 */
}

function deracer_instantiate (reg,owner,name,template_data,arg) {/* line 32 */
    let name_with_id = gensymbol ( "deracer")          /* line 33 */;
    let  inst =  new Deracer_Instance_Data ();         /* line 34 */;
    inst.state =  "idle";                              /* line 35 */
    inst.buffer =  new TwoMevents ();                  /* line 36 */;
    let eh = make_leaf ( name_with_id, owner, inst, "", deracer_handler, deracer_reset_handler)/* line 37 */;
    return  eh;                                        /* line 38 *//* line 39 *//* line 40 */
}

function send_firstmev_then_secondmev (eh,inst) {      /* line 41 */
    forward ( eh, "1", inst.buffer.firstmev)           /* line 42 */
    forward ( eh, "2", inst.buffer.secondmev)          /* line 43 */
    reclaim_Buffers_from_heap ( inst)                  /* line 44 *//* line 45 *//* line 46 */
}

function deracer_handler (eh,mev) {                    /* line 47 */
    let  inst =  eh.instance_data;                     /* line 48 */
    if ( inst.state ==  "idle") {                      /* line 49 */
      if ( "1" ==  mev.port) {                         /* line 50 */
        inst.buffer.firstmev =  mev;                   /* line 51 */
        inst.state =  "waitingForSecondmev";           /* line 52 */
      }
      else if ( "2" ==  mev.port) {                    /* line 53 */
        inst.buffer.secondmev =  mev;                  /* line 54 */
        inst.state =  "waitingForFirstmev";            /* line 55 */
      }
      else {                                           /* line 56 */
        runtime_error ( ( "bad mev.port (case A) for deracer ".toString ()+  mev.port.toString ()) )/* line 57 *//* line 58 */
      }
    }
    else if ( inst.state ==  "waitingForFirstmev") {   /* line 59 */
      if ( "1" ==  mev.port) {                         /* line 60 */
        inst.buffer.firstmev =  mev;                   /* line 61 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 62 */
        inst.state =  "idle";                          /* line 63 */
      }
      else {                                           /* line 64 */
        runtime_error ( ( "deracer: waiting for 1 but got [".toString ()+  ( mev.port.toString ()+  "] (case B)".toString ()) .toString ()) )/* line 65 *//* line 66 */
      }
    }
    else if ( inst.state ==  "waitingForSecondmev") {  /* line 67 */
      if ( "2" ==  mev.port) {                         /* line 68 */
        inst.buffer.secondmev =  mev;                  /* line 69 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 70 */
        inst.state =  "idle";                          /* line 71 */
      }
      else {                                           /* line 72 */
        runtime_error ( ( "deracer: waiting for 2 but got [".toString ()+  ( mev.port.toString ()+  "] (case C)".toString ()) .toString ()) )/* line 73 *//* line 74 */
      }
    }
    else {                                             /* line 75 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 76 *//* line 77 */
    }                                                  /* line 78 *//* line 79 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data,arg) {/* line 80 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 81 */;
    return make_leaf ( name_with_id, owner, null, "", low_level_read_text_file_handler, null)/* line 82 */;/* line 83 *//* line 84 */
}

function low_level_read_text_file_handler (eh,mev) {   /* line 85 */
    let fname =  mev.datum.v;                          /* line 86 */

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
                                                       /* line 87 *//* line 88 *//* line 89 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data,arg) {/* line 90 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 91 */;
    return make_leaf ( name_with_id, owner, null, "", ensure_string_datum_handler, null)/* line 92 */;/* line 93 *//* line 94 */
}

function ensure_string_datum_handler (eh,mev) {        /* line 95 */
    if ( "string" ==  mev.datum.kind ()) {             /* line 96 */
      forward ( eh, "", mev)                           /* line 97 */
    }
    else {                                             /* line 98 */
      let emev =  ( "*** ensure: type error (expected a string datum) but got ".toString ()+  mev.datum.toString ()) /* line 99 */;
      send ( eh, "✗", emev, mev)                       /* line 100 *//* line 101 */
    }                                                  /* line 102 *//* line 103 */
}

class Syncfilewrite_Data {
  constructor () {                                     /* line 104 */

    this.filename =  "";                               /* line 105 *//* line 106 */
  }
}
                                                       /* line 107 */
function syncfilewrite_reset_handler (eh) {            /* line 108 */
    eh.instance_data =  new Syncfilewrite_Data ();     /* line 109 */;/* line 110 *//* line 111 */
}

/*  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) *//* line 112 */
function syncfilewrite_instantiate (reg,owner,name,template_data,arg) {/* line 113 */
    let name_with_id = gensymbol ( "syncfilewrite")    /* line 114 */;
    let inst =  new Syncfilewrite_Data ();             /* line 115 */;
    return make_leaf ( name_with_id, owner, inst, "", syncfilewrite_handler, syncfilewrite_reset_handler)/* line 116 */;/* line 117 *//* line 118 */
}

function syncfilewrite_handler (eh,mev) {              /* line 119 */
    let  inst =  eh.instance_data;                     /* line 120 */
    if ( "filename" ==  mev.port) {                    /* line 121 */
      inst.filename =  mev.datum.v;                    /* line 122 */
    }
    else if ( "input" ==  mev.port) {                  /* line 123 */
      let contents =  mev.datum.v;                     /* line 124 */
      let  f = open ( inst.filename, "w")              /* line 125 */;
      if ( f!= null) {                                 /* line 126 */
        f.write ( mev.datum.v)                         /* line 127 */
        f.close ()                                     /* line 128 */
        send ( eh, "done",new_datum_bang (), mev)      /* line 129 */
      }
      else {                                           /* line 130 */
        send ( eh, "✗", ( "open error on file ".toString ()+  inst.filename.toString ()) , mev)/* line 131 *//* line 132 */
      }                                                /* line 133 */
    }                                                  /* line 134 *//* line 135 */
}

class StringConcat_Instance_Data {
  constructor () {                                     /* line 136 */

    this.buffer1 =  null;                              /* line 137 */
    this.buffer2 =  null;                              /* line 138 *//* line 139 */
  }
}
                                                       /* line 140 */
function stringconcat_reset_handler (eh) {             /* line 141 */
    let  inst =  eh.instance_data;                     /* line 142 */
    inst.buffer1 =  null;                              /* line 143 */
    inst.buffer2 =  null;                              /* line 144 *//* line 145 *//* line 146 */
}

function stringconcat_instantiate (reg,owner,name,template_data,arg) {/* line 147 */
    let name_with_id = gensymbol ( "stringconcat")     /* line 148 */;
    let instp =  new StringConcat_Instance_Data ();    /* line 149 */;
    return make_leaf ( name_with_id, owner, instp, "", stringconcat_handler, stringconcat_reset_handler)/* line 150 */;/* line 151 *//* line 152 */
}

function stringconcat_handler (eh,mev) {               /* line 153 */
    let  inst =  eh.instance_data;                     /* line 154 */
    if ( "1" ==  mev.port) {                           /* line 155 */
      inst.buffer1 = clone_string ( mev.datum.v)       /* line 156 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 157 */
    }
    else if ( "2" ==  mev.port) {                      /* line 158 */
      inst.buffer2 = clone_string ( mev.datum.v)       /* line 159 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 160 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 161 */
      inst.buffer1 =  null;                            /* line 162 */
      inst.buffer2 =  null;                            /* line 163 */
    }
    else {                                             /* line 164 */
      runtime_error ( ( "bad mev.port for stringconcat: ".toString ()+  mev.port.toString ()) )/* line 165 *//* line 166 */
    }                                                  /* line 167 *//* line 168 */
}

function maybe_stringconcat (eh,inst,mev) {            /* line 169 */
    if ((( inst.buffer1!= null) && ( inst.buffer2!= null))) {/* line 170 */
      let  concatenated_string =  "";                  /* line 171 */
      if ( 0 == ( inst.buffer1.length)) {              /* line 172 */
        concatenated_string =  inst.buffer2;           /* line 173 */
      }
      else if ( 0 == ( inst.buffer2.length)) {         /* line 174 */
        concatenated_string =  inst.buffer1;           /* line 175 */
      }
      else {                                           /* line 176 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 177 *//* line 178 */
      }
      send ( eh, "", concatenated_string, mev)         /* line 179 */
      inst.buffer1 =  null;                            /* line 180 */
      inst.buffer2 =  null;                            /* line 181 *//* line 182 */
    }                                                  /* line 183 *//* line 184 */
}

/*  */                                                 /* line 185 *//* line 186 */
function string_constant_instantiate (reg,owner,name,template_data,arg) {/* line 187 *//* line 188 */
    let name_with_id = gensymbol ( "strconst")         /* line 189 */;
    let  s =  template_data;                           /* line 190 */
    if ( projectRoot!= "") {                           /* line 191 */
      s =  s.replaceAll ( "_00_",  projectRoot)        /* line 192 */;/* line 193 */
    }
    return make_leaf ( name_with_id, owner, s, "", string_constant_handler, null)/* line 194 */;/* line 195 *//* line 196 */
}

function string_constant_handler (eh,mev) {            /* line 197 */
    let s =  eh.instance_data;                         /* line 198 */
    send ( eh, "", s, mev)                             /* line 199 *//* line 200 *//* line 201 */
}

function fakepipename_instantiate (reg,owner,name,template_data,arg) {/* line 202 */
    let instance_name = gensymbol ( "fakepipe")        /* line 203 */;
    return make_leaf ( instance_name, owner, null, "", fakepipename_handler, null)/* line 204 */;/* line 205 *//* line 206 */
}

let  rand =  0;                                        /* line 207 *//* line 208 */
function fakepipename_handler (eh,mev) {               /* line 209 *//* line 210 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ ;rand' must be unique within a single run *//* line 211 */
    send ( eh, "", ( "/tmp/fakepipe".toString ()+  rand.toString ()) , mev)/* line 212 *//* line 213 *//* line 214 */
}
                                                       /* line 215 */
class Switch1star_Instance_Data {
  constructor () {                                     /* line 216 */

    this.state =  "1";                                 /* line 217 *//* line 218 */
  }
}
                                                       /* line 219 */
function switch1star_reset_handler (eh) {              /* line 220 */
    let  inst =  eh.instance_data;                     /* line 221 */
    inst =  new Switch1star_Instance_Data ();          /* line 222 */;/* line 223 *//* line 224 */
}

function switch1star_instantiate (reg,owner,name,template_data,arg) {/* line 225 */
    let name_with_id = gensymbol ( "switch1*")         /* line 226 */;
    let instp =  new Switch1star_Instance_Data ();     /* line 227 */;
    return make_leaf ( name_with_id, owner, instp, "", switch1star_handler, switch1star_reset_handler)/* line 228 */;/* line 229 *//* line 230 */
}

function switch1star_handler (eh,mev) {                /* line 231 */
    let  inst =  eh.instance_data;                     /* line 232 */
    let whichOutput =  inst.state;                     /* line 233 */
    if ( "" ==  mev.port) {                            /* line 234 */
      if ( "1" ==  whichOutput) {                      /* line 235 */
        forward ( eh, "1", mev)                        /* line 236 */
        inst.state =  "*";                             /* line 237 */
      }
      else if ( "*" ==  whichOutput) {                 /* line 238 */
        forward ( eh, "*", mev)                        /* line 239 */
      }
      else {                                           /* line 240 */
        send ( eh, "✗", "internal error bad state in switch1*", mev)/* line 241 *//* line 242 */
      }
    }
    else if ( "reset" ==  mev.port) {                  /* line 243 */
      inst.state =  "1";                               /* line 244 */
    }
    else {                                             /* line 245 */
      send ( eh, "✗", "internal error bad mevent for switch1*", mev)/* line 246 *//* line 247 */
    }                                                  /* line 248 *//* line 249 */
}

class StringAccumulator {
  constructor () {                                     /* line 250 */

    this.s =  "";                                      /* line 251 *//* line 252 */
  }
}
                                                       /* line 253 */
function strcatstar_reset_handler (eh) {               /* line 254 */
    eh.instance_data =  new StringAccumulator ();      /* line 255 */;/* line 256 *//* line 257 */
}

function strcatstar_instantiate (reg,owner,name,template_data,arg) {/* line 258 */
    let name_with_id = gensymbol ( "String Concat *")  /* line 259 */;
    let instp =  new StringAccumulator ();             /* line 260 */;
    return make_leaf ( name_with_id, owner, instp, "", strcatstar_handler, strcatstar_reset_handler)/* line 261 */;/* line 262 *//* line 263 */
}

function strcatstar_handler (eh,mev) {                 /* line 264 */
    let  accum =  eh.instance_data;                    /* line 265 */
    if ( "" ==  mev.port) {                            /* line 266 */
      accum.s =  ( accum.s.toString ()+  mev.datum.v.toString ()) /* line 267 */;
    }
    else if ( "fini" ==  mev.port) {                   /* line 268 */
      send ( eh, "", accum.s, mev)                     /* line 269 */
    }
    else {                                             /* line 270 */
      send ( eh, "✗", "internal error bad mevent for String Concat *", mev)/* line 271 *//* line 272 */
    }                                                  /* line 273 *//* line 274 */
}

class BlockOnErrorState {
  constructor () {                                     /* line 275 */

    this.hasError =  "no";                             /* line 276 *//* line 277 */
  }
}
                                                       /* line 278 */
function blockOnError_reset_handler (eh) {             /* line 279 */
    eh.instance_data =  new BlockOnErrorState ();      /* line 280 */;/* line 281 *//* line 282 */
}

function blockOnError_instantiate (reg,owner,name,template_data,arg) {/* line 283 */
    let name_with_id = gensymbol ( "blockOnError")     /* line 284 */;
    let instp =  new BlockOnErrorState ();             /* line 285 */;
    return make_leaf ( name_with_id, owner, instp, "", blockOnError_handler, blockOnError_reset_handler)/* line 286 */;/* line 287 *//* line 288 */
}

function blockOnError_handler (eh,mev) {               /* line 289 */
    let  inst =  eh.instance_data;                     /* line 290 */
    if ( "" ==  mev.port) {                            /* line 291 */
      if ( inst.hasError ==  "no") {                   /* line 292 */
        send ( eh, "", mev.datum.v, mev)               /* line 293 *//* line 294 */
      }
    }
    else if ( "✗" ==  mev.port) {                      /* line 295 */
      inst.hasError =  "yes";                          /* line 296 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 297 */
      inst.hasError =  "no";                           /* line 298 *//* line 299 */
    }                                                  /* line 300 *//* line 301 */
}

function stop_instantiate (reg,owner,name,template_data,arg) {/* line 302 */
    let name_with_id = gensymbol ( "Stop")             /* line 303 */;
    let inst =  null;                                  /* line 304 */
    return make_leaf ( name_with_id, owner, inst, "", stop_handler, null)/* line 305 */;/* line 306 *//* line 307 */
}

function stop_handler (eh,mev) {                       /* line 308 */
    let  inst =  eh.instance_data;                     /* line 309 */
    let  parent =  eh.owner;                           /* line 310 */
    let  s =  ( "   !!! stopping: '".toString ()+  ( parent.name.toString ()+  "'".toString ()) .toString ()) /* line 311 */;
    console.error ( s);                                /* line 312 */
                                                       /* line 313 */
    parent.stop ( parent)                              /* line 314 */
    send ( eh, "", mev.datum.v, mev)                   /* line 315 *//* line 316 *//* line 317 */
}

/*  all of the the built_in leaves are listed here */  /* line 318 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 319 *//* line 320 */
function initialize_stock_components (reg) {           /* line 321 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 322 */
    register_component ( reg,mkTemplate ( "1→2", null, deracer_instantiate))/* line 323 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 324 */
    register_component ( reg,mkTemplate ( "🗑️", null, trash_instantiate))/* line 325 */
    register_component ( reg,mkTemplate ( "🚫", null, stop_instantiate))/* line 326 */
    register_component ( reg,mkTemplate ( "blockOnError", null, blockOnError_instantiate))/* line 327 *//* line 328 *//* line 329 */
    register_component ( reg,mkTemplate ( "Read Text File", null, low_level_read_text_file_instantiate))/* line 330 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 331 *//* line 332 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 333 */
    register_component ( reg,mkTemplate ( "String Concat", null, stringconcat_instantiate))/* line 334 */
    register_component ( reg,mkTemplate ( "switch1*", null, switch1star_instantiate))/* line 335 */
    register_component ( reg,mkTemplate ( "String Concat *", null, strcatstar_instantiate))/* line 336 */
    /*  for fakepipe */                                /* line 337 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 338 *//* line 339 *//* line 340 */
}
