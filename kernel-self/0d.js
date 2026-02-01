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
    parent.visit_ordering.push ( receiver)             /* line 289 *//* line 290 *//* line 291 */
}

function is_self (child,container) {                   /* line 292 */
    /*  in an earlier version “self“ was denoted as ϕ *//* line 293 */
    return  child ==  container;                       /* line 294 *//* line 295 *//* line 296 */
}

function step_child_once (child,mev) {                 /* line 297 */
    let before_state =  child.state;                   /* line 298 */
    child.handler ( child, mev)                        /* line 299 */
    let after_state =  child.state;                    /* line 300 */
    return [(( before_state ==  "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state ==  "idle"))];/* line 303 *//* line 304 *//* line 305 */
}

function step_children (container,causingMevent) {     /* line 306 */
    container.state =  "idle";                         /* line 307 *//* line 308 */
    /*  phase 1 - loop through children and process inputs or children that not "idle"  *//* line 309 */
    for (let child of   container.visit_ordering) {    /* line 310 */
      /*  child = container represents self, skip it *//* line 311 */
      if (((! (is_self ( child, container))))) {       /* line 312 */
        if (((! ((0=== child.inq.length))))) {         /* line 313 */
          let mev =  child.inq.shift ()                /* line 314 */;
          step_child_once ( child, mev)                /* line 315 *//* line 316 */
          destroy_mevent ( mev)                        /* line 317 */
        }
        else {                                         /* line 318 */
          if ( child.state!= "idle") {                 /* line 319 */
            let mev = force_tick ( container, child)   /* line 320 */;
            step_child_once ( child, mev)              /* line 321 */
            destroy_mevent ( mev)                      /* line 322 *//* line 323 */
          }                                            /* line 324 */
        }                                              /* line 325 */
      }                                                /* line 326 */
    }

    container.visit_ordering = [];                     /* line 327 *//* line 328 */
    /*  phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections  *//* line 329 */
    for (let child of  container.children) {           /* line 330 */
      if ( child.state ==  "active") {                 /* line 331 */
        /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 332 */
        container.state =  "active";                   /* line 333 *//* line 334 */
      }                                                /* line 335 */
      while (((! ((0=== child.outq.length))))) {       /* line 336 */
        let mev =  child.outq.shift ()                 /* line 337 */;
        route ( container, child, mev)                 /* line 338 */
        destroy_mevent ( mev)                          /* line 339 *//* line 340 */
      }                                                /* line 341 */
    }                                                  /* line 342 *//* line 343 */
}

function attempt_tick (parent,eh) {                    /* line 344 */
    if ( eh.state!= "idle") {                          /* line 345 */
      force_tick ( parent, eh)                         /* line 346 *//* line 347 */
    }                                                  /* line 348 *//* line 349 */
}

function is_tick (mev) {                               /* line 350 */
    return  "." ==  mev.port
    /*  assume that any mevent that is sent to port "." is a tick  *//* line 351 */;/* line 352 *//* line 353 */
}

/*  Routes a single mevent to all matching destinations, according to *//* line 354 */
/*  the container's connection network. */             /* line 355 *//* line 356 */
function route (container,from_component,mevent) {     /* line 357 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 358 */
    let  fromname =  "";                               /* line 359 *//* line 360 */
    ticktime =  ticktime+ 1;                           /* line 361 */
    if (is_tick ( mevent)) {                           /* line 362 */
      for (let child of  container.children) {         /* line 363 */
        attempt_tick ( container, child)               /* line 364 */
      }
      was_sent =  true;                                /* line 365 */
    }
    else {                                             /* line 366 */
      if (((! (is_self ( from_component, container))))) {/* line 367 */
        fromname =  from_component.name;               /* line 368 *//* line 369 */
      }
      let from_sender = mkSender ( fromname, from_component, mevent.port)/* line 370 */;/* line 371 */
      for (let connector of  container.connections) {  /* line 372 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 373 */
          deposit ( container, connector, mevent)      /* line 374 */
          was_sent =  true;                            /* line 375 *//* line 376 */
        }                                              /* line 377 */
      }                                                /* line 378 */
    }
    if ((! ( was_sent))) {                             /* line 379 */
      console.error ( "internal error" + ": " +  ( container.name.toString ()+  ( ": mevent on port '".toString ()+  ( mevent.port.toString ()+  ( "' from ".toString ()+  ( fromname.toString ()+  " dropped on floor...".toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 380 *//* line 381 */
    }                                                  /* line 382 *//* line 383 */
}

function any_child_ready (container) {                 /* line 384 */
    for (let child of  container.children) {           /* line 385 */
      if (child_is_ready ( child)) {                   /* line 386 */
        return  true;                                  /* line 387 *//* line 388 */
      }                                                /* line 389 */
    }
    return  false;                                     /* line 390 *//* line 391 *//* line 392 */
}

function child_is_ready (eh) {                         /* line 393 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 394 *//* line 395 *//* line 396 */
}

function append_routing_descriptor (container,desc) {  /* line 397 */
    container.routings.push ( desc)                    /* line 398 *//* line 399 *//* line 400 */
}

function injector (eh,mevent) {                        /* line 401 */
    eh.handler ( eh, mevent)                           /* line 402 *//* line 403 *//* line 404 */
}
                                                       /* line 405 *//* line 406 *//* line 407 */
class Component_Registry {
  constructor () {                                     /* line 408 */

    this.templates = {};                               /* line 409 *//* line 410 */
  }
}
                                                       /* line 411 */
class Template {
  constructor () {                                     /* line 412 */

    this.name =  null;                                 /* line 413 */
    this.container =  null;                            /* line 414 */
    this.instantiator =  null;                         /* line 415 *//* line 416 */
  }
}
                                                       /* line 417 */
function mkTemplate (name,template_data,instantiator) {/* line 418 */
    let  templ =  new Template ();                     /* line 419 */;
    templ.name =  name;                                /* line 420 */
    templ.template_data =  template_data;              /* line 421 */
    templ.instantiator =  instantiator;                /* line 422 */
    return  templ;                                     /* line 423 *//* line 424 *//* line 425 */
}
                                                       /* line 426 */
/*  convert a little-network to internal form (an object data structure created by json parser) ...  *//* line 427 */
/*  the actual data structure depends on the json parser library used by the target language  *//* line 428 */
/*  the form of the data structure doesn't matter here, as long as we use lookup operators "@" in this .rt code  *//* line 429 *//* line 430 */
/*  ... by reading the little-net from an external file  *//* line 431 */
function lnet2internal_from_file (container_xml) {     /* line 432 */
    let pathname = process.env.PBPHERE                 /* line 433 */;
    let filename =   container_xml                     /* line 434 */;

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
                                                       /* line 435 *//* line 436 *//* line 437 */
}

/*  ... by reading the little-net from an embedded string (an aspect of creating t2t tool code)  *//* line 438 */
function lnet2internal_from_string (lnet) {            /* line 439 */

    return JSON.parse (lnet);
                                                       /* line 440 *//* line 441 *//* line 442 */
}

function delete_decls (d) {                            /* line 443 *//* line 444 *//* line 445 *//* line 446 */
}

function make_component_registry () {                  /* line 447 */
    return  new Component_Registry ();                 /* line 448 */;/* line 449 *//* line 450 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 451 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 452 *//* line 453 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 454 */
    let name = mangle_name ( template.name)            /* line 455 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 456 */
      load_error ( ( "Component /".toString ()+  ( template.name.toString ()+  "/ already declared".toString ()) .toString ()) )/* line 457 */
      return  reg;                                     /* line 458 */
    }
    else {                                             /* line 459 */
      reg.templates [name] =  template;                /* line 460 */
      return  reg;                                     /* line 461 *//* line 462 */
    }                                                  /* line 463 *//* line 464 */
}

function get_component_instance (reg,full_name,owner) {/* line 465 */
    /*  If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it.  *//* line 466 */
    /*  ":?<string>" is a probe part that is tagged with <string>  *//* line 467 */
    /*  ":$ <command>" is a shell-out part that sends <command> to the operating system shell  *//* line 468 */
    /*  ":<string>" else, it's just treated as a string part that produces <string> on its output  *//* line 469 */
    let template_name = mangle_name ( full_name)       /* line 470 */;
    if ( ":" ==   full_name[0] ) {                     /* line 471 */
      let instance_name = generate_instance_name ( owner, template_name)/* line 472 */;
      let instance = external_instantiate ( reg, owner, instance_name, full_name)/* line 473 */;
      return  instance;                                /* line 474 */
    }
    else {                                             /* line 475 */
      if ((( template_name) in ( reg.templates))) {    /* line 476 */
        let template =  reg.templates [template_name]; /* line 477 */
        if (( template ==  null)) {                    /* line 478 */
          load_error ( ( "Registry Error (A): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 479 */
          return  null;                                /* line 480 */
        }
        else {                                         /* line 481 */
          let instance_name = generate_instance_name ( owner, template_name)/* line 482 */;
          let instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")/* line 483 */;
          return  instance;                            /* line 484 *//* line 485 */
        }
      }
      else {                                           /* line 486 */
        load_error ( ( "Registry Error (B): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 487 */
        return  null;                                  /* line 488 *//* line 489 */
      }                                                /* line 490 */
    }                                                  /* line 491 *//* line 492 */
}

function generate_instance_name (owner,template_name) {/* line 493 */
    let owner_name =  "";                              /* line 494 */
    let instance_name =  template_name;                /* line 495 */
    if ( null!= owner) {                               /* line 496 */
      owner_name =  owner.name;                        /* line 497 */
      instance_name =  ( owner_name.toString ()+  ( "▹".toString ()+  template_name.toString ()) .toString ()) /* line 498 */;
    }
    else {                                             /* line 499 */
      instance_name =  template_name;                  /* line 500 *//* line 501 */
    }
    return  instance_name;                             /* line 502 *//* line 503 *//* line 504 */
}

function mangle_name (s) {                             /* line 505 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 506 */
    return  s;                                         /* line 507 *//* line 508 *//* line 509 */
}
                                                       /* line 510 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 511 */
/*  and output queues of mevents. */                   /* line 512 */
/*  */                                                 /* line 513 */
/*  Components can either be a user_supplied function (“leaf“), or a “container“ *//* line 514 */
/*  that routes mevents to child components according to a list of connections *//* line 515 */
/*  that serve as a mevent routing table. */           /* line 516 */
/*  */                                                 /* line 517 */
/*  Child components themselves can be leaves or other containers. *//* line 518 */
/*  */                                                 /* line 519 */
/*  `handler` invokes the code that is attached to this component. *//* line 520 */
/*  */                                                 /* line 521 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 522 */
/*  function may want whenever it is invoked again. */ /* line 523 *//* line 524 */
/*  TODO: what is .routings for? (is it a historical artefact that can be removed?)  *//* line 525 *//* line 526 */
/*  Eh_States :: enum { idle, active } */              /* line 527 */
class Eh {
  constructor () {                                     /* line 528 */

    this.name =  "";                                   /* line 529 */
    this.inq =  []                                     /* line 530 */;
    this.outq =  []                                    /* line 531 */;
    this.owner =  null;                                /* line 532 */
    this.children = [];                                /* line 533 */
    this.visit_ordering =  []                          /* line 534 */;
    this.connections = [];                             /* line 535 */
    this.routings =  []                                /* line 536 */;
    this.handler =  null;                              /* line 537 */
    this.reset_instance_data =  null;                  /* line 538 */
    this.finject =  null;                              /* line 539 */
    this.stop =  null;                                 /* line 540 */
    this.instance_data =  null;                        /* line 541 *//*  arg needed for probe support  *//* line 542 */
    this.arg =  "";                                    /* line 543 */
    this.state =  "idle";                              /* line 544 *//*  bootstrap debugging *//* line 545 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 546 *//* line 547 */
  }
}
                                                       /* line 548 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 549 */
/*  whose handler function is `container_handler`. */  /* line 550 */
function make_container (name,owner) {                 /* line 551 */
    let  eh =  new Eh ();                              /* line 552 */;
    eh.name =  name;                                   /* line 553 */
    eh.owner =  owner;                                 /* line 554 */
    eh.handler =  container_handler;                   /* line 555 */
    eh.finject =  injector;                            /* line 556 */
    eh.stop =  container_reset_children;               /* line 557 */
    eh.state =  "idle";                                /* line 558 */
    eh.kind =  "container";                            /* line 559 */
    return  eh;                                        /* line 560 *//* line 561 *//* line 562 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 563 */
/*  that will be passed back to your handler when called. *//* line 564 *//* line 565 */
function make_leaf (name,owner,instance_data,arg,handler,reset_handler) {/* line 566 */
    let  eh =  new Eh ();                              /* line 567 */;
    let  nm =  "";                                     /* line 568 */
    if ( null!= owner) {                               /* line 569 */
      nm =  owner.name;                                /* line 570 *//* line 571 */
    }
    eh.name =  ( nm.toString ()+  ( "▹".toString ()+  name.toString ()) .toString ()) /* line 572 */;
    eh.owner =  owner;                                 /* line 573 */
    eh.handler =  handler;                             /* line 574 */
    eh.reset_handler =  reset_handler;                 /* line 575 */
    eh.finject =  injector;                            /* line 576 */
    eh.stop =  leaf_reset;                             /* line 577 */
    eh.instance_data =  instance_data;                 /* line 578 */
    eh.arg =  arg;                                     /* line 579 */
    eh.state =  "idle";                                /* line 580 */
    eh.kind =  "leaf";                                 /* line 581 */
    return  eh;                                        /* line 582 *//* line 583 *//* line 584 */
}

/*  Reset Leaf part to a known, idle state. Hit the big red button.  *//* line 585 */
function leaf_reset (part) {                           /* line 586 */

    part.inq = [];                                     /* line 587 */

    part.outq = [];                                    /* line 588 */
    if (( part.reset_handler!= null)) {                /* line 589 */
      part.reset_handler ( part)                       /* line 590 *//* line 591 */
    }
    part.state =  "idle";                              /* line 592 *//* line 593 *//* line 594 */
}

/*  Sends a mevent on the given `port` with `data`, placing it on the output *//* line 595 */
/*  of the given component. */                         /* line 596 *//* line 597 */
function send (eh,port,obj,causingMevent) {            /* line 598 */
    let  d =  new Datum ();                            /* line 599 */;
    d.v =  obj;                                        /* line 600 */
    d.clone =  function () {return obj_clone ( d)      /* line 601 */;};
    d.reclaim =  null;                                 /* line 602 */
    let mev = make_mevent ( port, d)                   /* line 603 */;
    put_output ( eh, mev)                              /* line 604 *//* line 605 *//* line 606 */
}

function forward (eh,port,mev) {                       /* line 607 */
    let fwdmev = make_mevent ( port, mev.datum)        /* line 608 */;
    put_output ( eh, fwdmev)                           /* line 609 *//* line 610 *//* line 611 */
}

function inject_mevent (eh,mev) {                      /* line 612 */
    eh.finject ( eh, mev)                              /* line 613 *//* line 614 *//* line 615 */
}

function set_active (eh) {                             /* line 616 */
    eh.state =  "active";                              /* line 617 *//* line 618 *//* line 619 */
}

function set_idle (eh) {                               /* line 620 */
    eh.state =  "idle";                                /* line 621 *//* line 622 *//* line 623 */
}

function put_output (eh,mev) {                         /* line 624 */
    eh.outq.push ( mev)                                /* line 625 *//* line 626 *//* line 627 */
}

function obj_clone (obj) {                             /* line 628 */
    return  obj;                                       /* line 629 *//* line 630 *//* line 631 */
}

function initialize_component_palette_from_files (diagram_source_files) {/* line 632 */
    let  reg = make_component_registry ();             /* line 633 */
    for (let diagram_source of  diagram_source_files) {/* line 634 */
      let all_containers_within_single_file = lnet2internal_from_file ( diagram_source)/* line 635 */;
      for (let container of  all_containers_within_single_file) {/* line 636 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 637 *//* line 638 */
      }                                                /* line 639 */
    }
    initialize_stock_components ( reg)                 /* line 640 */
    return  reg;                                       /* line 641 *//* line 642 *//* line 643 */
}

function initialize_component_palette_from_string (lnet) {/* line 644 */
    let  reg = make_component_registry ();             /* line 645 */
    let all_containers = lnet2internal_from_string ( lnet)/* line 646 */;
    reg = generate_external_components ( reg, all_containers)/* line 647 */;
    for (let container of  all_containers) {           /* line 648 */
      register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 649 *//* line 650 */
    }
    initialize_stock_components ( reg)                 /* line 651 */
    return  reg;                                       /* line 652 *//* line 653 *//* line 654 */
}
                                                       /* line 655 */
function clone_string (s) {                            /* line 656 */
    return  s                                          /* line 657 *//* line 658 */;/* line 659 */
}

let  load_errors =  false;                             /* line 660 */
let  runtime_errors =  false;                          /* line 661 *//* line 662 */
function load_error (s) {                              /* line 663 *//* line 664 */
    console.error ( s);                                /* line 665 */
                                                       /* line 666 */
    load_errors =  true;                               /* line 667 *//* line 668 *//* line 669 */
}

function runtime_error (s) {                           /* line 670 *//* line 671 */
    console.error ( s);                                /* line 672 */
    process.exit (1)                                   /* line 673 */
    runtime_errors =  true;                            /* line 674 *//* line 675 *//* line 676 */
}
                                                       /* line 677 */
function initialize_from_files (diagram_names) {       /* line 678 */
    let arg =  null;                                   /* line 679 */
    let palette = initialize_component_palette_from_files ( diagram_names)/* line 680 */;
    return [ palette,[ diagram_names, arg]];           /* line 681 *//* line 682 *//* line 683 */
}

function initialize_from_string () {                   /* line 684 */
    let arg =  null;                                   /* line 685 */
    let palette = initialize_component_palette_from_string ();/* line 686 */
    return [ palette,[ null, arg]];                    /* line 687 *//* line 688 *//* line 689 */
}

function start (arg,part_name,palette,env) {           /* line 690 */
    let part = start_bare ( part_name, palette, env)   /* line 691 */;
    inject ( part, "", arg)                            /* line 692 */
    finalize ( part)                                   /* line 693 *//* line 694 *//* line 695 */
}

function start_bare (part_name,palette,env) {          /* line 696 */
    let diagram_names =  env [ 0];                     /* line 697 */
    /*  get entrypoint container */                    /* line 698 */
    let  part = get_component_instance ( palette, part_name, null)/* line 699 */;
    if ( null ==  part) {                              /* line 700 */
      load_error ( ( "Couldn't find container with page name /".toString ()+  ( part_name.toString ()+  ( "/ in files ".toString ()+  (`${ diagram_names}`.toString ()+  " (check tab names, or disable compression?)".toString ()) .toString ()) .toString ()) .toString ()) )/* line 704 *//* line 705 */
    }
    return  part;                                      /* line 706 *//* line 707 *//* line 708 */
}

function inject (part,port,payload) {                  /* line 709 */
    if ((!  load_errors)) {                            /* line 710 */
      let  d =  new Datum ();                          /* line 711 */;
      d.v =  payload;                                  /* line 712 */
      d.clone =  function () {return obj_clone ( d)    /* line 713 */;};
      d.reclaim =  null;                               /* line 714 */
      let  mev = make_mevent ( port, d)                /* line 715 */;
      inject_mevent ( part, mev)                       /* line 716 */
    }
    else {                                             /* line 717 */
      process.exit (1)                                 /* line 718 *//* line 719 */
    }                                                  /* line 720 *//* line 721 */
}

function finalize (part) {                             /* line 722 */
    console.log (JSON.stringify ( part.outq.map(item => ({ [item.port]: item.datum.v })), null, 2));/* line 723 *//* line 724 *//* line 725 */
}

function new_datum_bang () {                           /* line 726 */
    let  d =  new Datum ();                            /* line 727 */;
    d.v =  "!";                                        /* line 728 */
    d.clone =  function () {return obj_clone ( d)      /* line 729 */;};
    d.reclaim =  null;                                 /* line 730 */
    return  d                                          /* line 731 *//* line 732 */;
}
