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
function lnet2internal_from_file (pathname,container_xml) {/* line 427 */
    let filename =   container_xml                     /* line 428 */;

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
                                                       /* line 429 *//* line 430 *//* line 431 */
}

function lnet2internal_from_string (lnet) {            /* line 432 */

    return JSON.parse (lnet);
                                                       /* line 433 *//* line 434 *//* line 435 */
}

function delete_decls (d) {                            /* line 436 *//* line 437 *//* line 438 *//* line 439 */
}

function make_component_registry () {                  /* line 440 */
    return  new Component_Registry ();                 /* line 441 */;/* line 442 *//* line 443 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 444 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 445 *//* line 446 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 447 */
    let name = mangle_name ( template.name)            /* line 448 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 449 */
      load_error ( ( "Component /".toString ()+  ( template.name.toString ()+  "/ already declared".toString ()) .toString ()) )/* line 450 */
      return  reg;                                     /* line 451 */
    }
    else {                                             /* line 452 */
      reg.templates [name] =  template;                /* line 453 */
      return  reg;                                     /* line 454 *//* line 455 */
    }                                                  /* line 456 *//* line 457 */
}

function get_component_instance (reg,full_name,owner) {/* line 458 */
    /*  If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it.  *//* line 459 */
    /*  ":?<string>" is a probe part that is tagged with <string>  *//* line 460 */
    /*  ":$ <command>" is a shell-out part that sends <command> to the operating system shell  *//* line 461 */
    /*  ":<string>" else, it's just treated as a string part that produces <string> on its output  *//* line 462 */
    let template_name = mangle_name ( full_name)       /* line 463 */;
    if ( ":" ==   full_name[0] ) {                     /* line 464 */
      let instance_name = generate_instance_name ( owner, template_name)/* line 465 */;
      let instance = external_instantiate ( reg, owner, instance_name, full_name)/* line 466 */;
      return  instance;                                /* line 467 */
    }
    else {                                             /* line 468 */
      if ((( template_name) in ( reg.templates))) {    /* line 469 */
        let template =  reg.templates [template_name]; /* line 470 */
        if (( template ==  null)) {                    /* line 471 */
          load_error ( ( "Registry Error (A): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 472 */
          return  null;                                /* line 473 */
        }
        else {                                         /* line 474 */
          let instance_name = generate_instance_name ( owner, template_name)/* line 475 */;
          let instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")/* line 476 */;
          return  instance;                            /* line 477 *//* line 478 */
        }
      }
      else {                                           /* line 479 */
        load_error ( ( "Registry Error (B): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 480 */
        return  null;                                  /* line 481 *//* line 482 */
      }                                                /* line 483 */
    }                                                  /* line 484 *//* line 485 */
}

function generate_instance_name (owner,template_name) {/* line 486 */
    let owner_name =  "";                              /* line 487 */
    let instance_name =  template_name;                /* line 488 */
    if ( null!= owner) {                               /* line 489 */
      owner_name =  owner.name;                        /* line 490 */
      instance_name =  ( owner_name.toString ()+  ( "▹".toString ()+  template_name.toString ()) .toString ()) /* line 491 */;
    }
    else {                                             /* line 492 */
      instance_name =  template_name;                  /* line 493 *//* line 494 */
    }
    return  instance_name;                             /* line 495 *//* line 496 *//* line 497 */
}

function mangle_name (s) {                             /* line 498 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 499 */
    return  s;                                         /* line 500 *//* line 501 *//* line 502 */
}
                                                       /* line 503 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 504 */
/*  and output queues of mevents. */                   /* line 505 */
/*  */                                                 /* line 506 */
/*  Components can either be a user_supplied function (“leaf“), or a “container“ *//* line 507 */
/*  that routes mevents to child components according to a list of connections *//* line 508 */
/*  that serve as a mevent routing table. */           /* line 509 */
/*  */                                                 /* line 510 */
/*  Child components themselves can be leaves or other containers. *//* line 511 */
/*  */                                                 /* line 512 */
/*  `handler` invokes the code that is attached to this component. *//* line 513 */
/*  */                                                 /* line 514 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 515 */
/*  function may want whenever it is invoked again. */ /* line 516 *//* line 517 */
/*  TODO: what is .routings for? (is it a historical artefact that can be removed?)  *//* line 518 *//* line 519 */
/*  Eh_States :: enum { idle, active } */              /* line 520 */
class Eh {
  constructor () {                                     /* line 521 */

    this.name =  "";                                   /* line 522 */
    this.inq =  []                                     /* line 523 */;
    this.outq =  []                                    /* line 524 */;
    this.owner =  null;                                /* line 525 */
    this.children = [];                                /* line 526 */
    this.visit_ordering =  []                          /* line 527 */;
    this.connections = [];                             /* line 528 */
    this.routings =  []                                /* line 529 */;
    this.handler =  null;                              /* line 530 */
    this.reset_instance_data =  null;                  /* line 531 */
    this.finject =  null;                              /* line 532 */
    this.stop =  null;                                 /* line 533 */
    this.instance_data =  null;                        /* line 534 *//*  arg needed for probe support  *//* line 535 */
    this.arg =  "";                                    /* line 536 */
    this.state =  "idle";                              /* line 537 *//*  bootstrap debugging *//* line 538 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 539 *//* line 540 */
  }
}
                                                       /* line 541 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 542 */
/*  whose handler function is `container_handler`. */  /* line 543 */
function make_container (name,owner) {                 /* line 544 */
    let  eh =  new Eh ();                              /* line 545 */;
    eh.name =  name;                                   /* line 546 */
    eh.owner =  owner;                                 /* line 547 */
    eh.handler =  container_handler;                   /* line 548 */
    eh.finject =  injector;                            /* line 549 */
    eh.stop =  container_reset_children;               /* line 550 */
    eh.state =  "idle";                                /* line 551 */
    eh.kind =  "container";                            /* line 552 */
    return  eh;                                        /* line 553 *//* line 554 *//* line 555 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 556 */
/*  that will be passed back to your handler when called. *//* line 557 *//* line 558 */
function make_leaf (name,owner,instance_data,arg,handler,reset_handler) {/* line 559 */
    let  eh =  new Eh ();                              /* line 560 */;
    let  nm =  "";                                     /* line 561 */
    if ( null!= owner) {                               /* line 562 */
      nm =  owner.name;                                /* line 563 *//* line 564 */
    }
    eh.name =  ( nm.toString ()+  ( "▹".toString ()+  name.toString ()) .toString ()) /* line 565 */;
    eh.owner =  owner;                                 /* line 566 */
    eh.handler =  handler;                             /* line 567 */
    eh.reset_handler =  reset_handler;                 /* line 568 */
    eh.finject =  injector;                            /* line 569 */
    eh.stop =  leaf_reset;                             /* line 570 */
    eh.instance_data =  instance_data;                 /* line 571 */
    eh.arg =  arg;                                     /* line 572 */
    eh.state =  "idle";                                /* line 573 */
    eh.kind =  "leaf";                                 /* line 574 */
    return  eh;                                        /* line 575 *//* line 576 *//* line 577 */
}

/*  Reset Leaf part to a known, idle state. Hit the big red button.  *//* line 578 */
function leaf_reset (part) {                           /* line 579 */

    part.inq = [];                                     /* line 580 */

    part.outq = [];                                    /* line 581 */
    if (( part.reset_handler!= null)) {                /* line 582 */
      part.reset_handler ( part)                       /* line 583 *//* line 584 */
    }
    part.state =  "idle";                              /* line 585 *//* line 586 *//* line 587 */
}

/*  Sends a mevent on the given `port` with `data`, placing it on the output *//* line 588 */
/*  of the given component. */                         /* line 589 *//* line 590 */
function send (eh,port,obj,causingMevent) {            /* line 591 */
    let  d =  new Datum ();                            /* line 592 */;
    d.v =  obj;                                        /* line 593 */
    d.clone =  function () {return obj_clone ( d)      /* line 594 */;};
    d.reclaim =  null;                                 /* line 595 */
    let mev = make_mevent ( port, d)                   /* line 596 */;
    put_output ( eh, mev)                              /* line 597 *//* line 598 *//* line 599 */
}

function forward (eh,port,mev) {                       /* line 600 */
    let fwdmev = make_mevent ( port, mev.datum)        /* line 601 */;
    put_output ( eh, fwdmev)                           /* line 602 *//* line 603 *//* line 604 */
}

function inject_mevent (eh,mev) {                      /* line 605 */
    eh.finject ( eh, mev)                              /* line 606 *//* line 607 *//* line 608 */
}

function set_active (eh) {                             /* line 609 */
    eh.state =  "active";                              /* line 610 *//* line 611 *//* line 612 */
}

function set_idle (eh) {                               /* line 613 */
    eh.state =  "idle";                                /* line 614 *//* line 615 *//* line 616 */
}

function put_output (eh,mev) {                         /* line 617 */
    eh.outq.push ( mev)                                /* line 618 *//* line 619 *//* line 620 */
}

let  projectRoot =  "";                                /* line 621 *//* line 622 */
function set_environment (project_root) {              /* line 623 *//* line 624 */
    projectRoot =  project_root;                       /* line 625 *//* line 626 *//* line 627 */
}

function obj_clone (obj) {                             /* line 628 */
    return  obj;                                       /* line 629 *//* line 630 *//* line 631 */
}

/*  usage: app ${_00_} diagram_filename1 diagram_filename2 ... *//* line 632 */
/*  where ${_00_} is the root directory for the project *//* line 633 *//* line 634 */
function initialize_component_palette_from_files (project_root,diagram_source_files) {/* line 635 */
    let  reg = make_component_registry ();             /* line 636 */
    for (let diagram_source of  diagram_source_files) {/* line 637 */
      let all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)/* line 638 */;
      reg = generate_external_components ( reg, all_containers_within_single_file)/* line 639 */;
      for (let container of  all_containers_within_single_file) {/* line 640 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 641 *//* line 642 */
      }                                                /* line 643 */
    }
    initialize_stock_components ( reg)                 /* line 644 */
    return  reg;                                       /* line 645 *//* line 646 *//* line 647 */
}

function initialize_component_palette_from_string (project_root,lnet) {/* line 648 */
    /*  this version ignores project_root  */          /* line 649 */
    let  reg = make_component_registry ();             /* line 650 */
    let all_containers = lnet2internal_from_string ( lnet)/* line 651 */;
    reg = generate_external_components ( reg, all_containers)/* line 652 */;
    for (let container of  all_containers) {           /* line 653 */
      register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 654 *//* line 655 */
    }
    initialize_stock_components ( reg)                 /* line 656 */
    return  reg;                                       /* line 657 *//* line 658 *//* line 659 */
}
                                                       /* line 660 */
function clone_string (s) {                            /* line 661 */
    return  s                                          /* line 662 *//* line 663 */;/* line 664 */
}

let  load_errors =  false;                             /* line 665 */
let  runtime_errors =  false;                          /* line 666 *//* line 667 */
function load_error (s) {                              /* line 668 *//* line 669 */
    console.error ( s);                                /* line 670 */
                                                       /* line 671 */
    load_errors =  true;                               /* line 672 *//* line 673 *//* line 674 */
}

function runtime_error (s) {                           /* line 675 *//* line 676 */
    console.error ( s);                                /* line 677 */
    process.exit (1)                                   /* line 678 */
    runtime_errors =  true;                            /* line 679 *//* line 680 *//* line 681 */
}
                                                       /* line 682 */
function initialize_from_files (project_root,diagram_names) {/* line 683 */
    let arg =  null;                                   /* line 684 */
    let palette = initialize_component_palette_from_files ( project_root, diagram_names)/* line 685 */;
    return [ palette,[ project_root, diagram_names, arg]];/* line 686 *//* line 687 *//* line 688 */
}

function initialize_from_string (project_root) {       /* line 689 */
    let arg =  null;                                   /* line 690 */
    let palette = initialize_component_palette_from_string ( project_root)/* line 691 */;
    return [ palette,[ project_root, null, arg]];      /* line 692 *//* line 693 *//* line 694 */
}

function start (arg,part_name,palette,env) {           /* line 695 */
    let part = start_bare ( part_name, palette, env)   /* line 696 */;
    inject ( part, "", arg)                            /* line 697 */
    finalize ( part)                                   /* line 698 *//* line 699 *//* line 700 */
}

function start_bare (part_name,palette,env) {          /* line 701 */
    let project_root =  env [ 0];                      /* line 702 */
    let diagram_names =  env [ 1];                     /* line 703 */
    set_environment ( project_root)                    /* line 704 */
    /*  get entrypoint container */                    /* line 705 */
    let  part = get_component_instance ( palette, part_name, null)/* line 706 */;
    if ( null ==  part) {                              /* line 707 */
      load_error ( ( "Couldn't find container with page name /".toString ()+  ( part_name.toString ()+  ( "/ in files ".toString ()+  (`${ diagram_names}`.toString ()+  " (check tab names, or disable compression?)".toString ()) .toString ()) .toString ()) .toString ()) )/* line 711 *//* line 712 */
    }
    return  part;                                      /* line 713 *//* line 714 *//* line 715 */
}

function inject (part,port,payload) {                  /* line 716 */
    if ((!  load_errors)) {                            /* line 717 */
      let  d =  new Datum ();                          /* line 718 */;
      d.v =  payload;                                  /* line 719 */
      d.clone =  function () {return obj_clone ( d)    /* line 720 */;};
      d.reclaim =  null;                               /* line 721 */
      let  mev = make_mevent ( port, d)                /* line 722 */;
      inject_mevent ( part, mev)                       /* line 723 */
    }
    else {                                             /* line 724 */
      process.exit (1)                                 /* line 725 *//* line 726 */
    }                                                  /* line 727 *//* line 728 */
}

function finalize (part) {                             /* line 729 */
    console.log (JSON.stringify ( part.outq.map(item => ({ [item.port]: item.datum.v })), null, 2));/* line 730 *//* line 731 *//* line 732 */
}

function new_datum_bang () {                           /* line 733 */
    let  d =  new Datum ();                            /* line 734 */;
    d.v =  "!";                                        /* line 735 */
    d.clone =  function () {return obj_clone ( d)      /* line 736 */;};
    d.reclaim =  null;                                 /* line 737 */
    return  d                                          /* line 738 *//* line 739 */;
}
