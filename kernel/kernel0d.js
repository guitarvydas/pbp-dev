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

/*  Frees the given container and associated data. */  /* line 200 */
function destroy_container (eh) {                      /* line 201 *//* line 202 *//* line 203 *//* line 204 */
}

/*  Routing connection for a container component. The `direction` field has *//* line 205 */
/*  no affect on the default mevent routing system _ it is there for debugging *//* line 206 */
/*  purposes, or for reading by other tools. */        /* line 207 *//* line 208 */
class Connector {
  constructor () {                                     /* line 209 */

    this.direction =  null;/*  down, across, up, through *//* line 210 */
    this.sender =  null;                               /* line 211 */
    this.receiver =  null;                             /* line 212 *//* line 213 */
  }
}
                                                       /* line 214 */
/*  `Sender` is used to “pattern match“ which `Receiver` a mevent should go to, *//* line 215 */
/*  based on component ID (pointer) and port name. */  /* line 216 *//* line 217 */
class Sender {
  constructor () {                                     /* line 218 */

    this.name =  null;                                 /* line 219 */
    this.component =  null;                            /* line 220 */
    this.port =  null;                                 /* line 221 *//* line 222 */
  }
}
                                                       /* line 223 *//* line 224 *//* line 225 */
/*  `Receiver` is a handle to a destination queue, and a `port` name to assign *//* line 226 */
/*  to incoming mevents to this queue. */              /* line 227 *//* line 228 */
class Receiver {
  constructor () {                                     /* line 229 */

    this.name =  null;                                 /* line 230 */
    this.queue =  null;                                /* line 231 */
    this.port =  null;                                 /* line 232 */
    this.component =  null;                            /* line 233 *//* line 234 */
  }
}
                                                       /* line 235 */
function mkSender (name,component,port) {              /* line 236 */
    let  s =  new Sender ();                           /* line 237 */;
    s.name =  name;                                    /* line 238 */
    s.component =  component;                          /* line 239 */
    s.port =  port;                                    /* line 240 */
    return  s;                                         /* line 241 *//* line 242 *//* line 243 */
}

function mkReceiver (name,component,port,q) {          /* line 244 */
    let  r =  new Receiver ();                         /* line 245 */;
    r.name =  name;                                    /* line 246 */
    r.component =  component;                          /* line 247 */
    r.port =  port;                                    /* line 248 */
    /*  We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq. *//* line 249 */
    r.queue =  q;                                      /* line 250 */
    return  r;                                         /* line 251 *//* line 252 *//* line 253 */
}

/*  Checks if two senders match, by pointer equality and port name matching. *//* line 254 */
function sender_eq (s1,s2) {                           /* line 255 */
    let same_components = ( s1.component ==  s2.component);/* line 256 */
    let same_ports = ( s1.port ==  s2.port);           /* line 257 */
    return (( same_components) && ( same_ports));      /* line 258 *//* line 259 *//* line 260 */
}

/*  Delivers the given mevent to the receiver of this connector. *//* line 261 *//* line 262 */
function deposit (parent,conn,mevent) {                /* line 263 */
    let new_mevent = make_mevent ( conn.receiver.port, mevent.datum)/* line 264 */;
    push_mevent ( parent, conn.receiver.component, conn.receiver.queue, new_mevent)/* line 265 *//* line 266 *//* line 267 */
}

function force_tick (parent,eh) {                      /* line 268 */
    let tick_mev = make_mevent ( ".",new_datum_bang ())/* line 269 */;
    push_mevent ( parent, eh, eh.inq, tick_mev)        /* line 270 */
    return  tick_mev;                                  /* line 271 *//* line 272 *//* line 273 */
}

function push_mevent (parent,receiver,inq,m) {         /* line 274 */
    inq.push ( m)                                      /* line 275 */
    parent.visit_ordering.push ( receiver)             /* line 276 *//* line 277 *//* line 278 */
}

function is_self (child,container) {                   /* line 279 */
    /*  in an earlier version “self“ was denoted as ϕ *//* line 280 */
    return  child ==  container;                       /* line 281 *//* line 282 *//* line 283 */
}

function step_child_once (child,mev) {                 /* line 284 */
    let before_state =  child.state;                   /* line 285 */
    child.handler ( child, mev)                        /* line 286 */
    let after_state =  child.state;                    /* line 287 */
    return [(( before_state ==  "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state ==  "idle"))];/* line 290 *//* line 291 *//* line 292 */
}

function step_children (container,causingMevent) {     /* line 293 */
    container.state =  "idle";                         /* line 294 *//* line 295 */
    /*  phase 1 - loop through children and process inputs or children that not "idle"  *//* line 296 */
    for (let child of   container.visit_ordering) {    /* line 297 */
      /*  child = container represents self, skip it *//* line 298 */
      if (((! (is_self ( child, container))))) {       /* line 299 */
        if (((! ((0=== child.inq.length))))) {         /* line 300 */
          let mev =  child.inq.shift ()                /* line 301 */;
          step_child_once ( child, mev)                /* line 302 *//* line 303 */
          destroy_mevent ( mev)                        /* line 304 */
        }
        else {                                         /* line 305 */
          if ( child.state!= "idle") {                 /* line 306 */
            let mev = force_tick ( container, child)   /* line 307 */;
            step_child_once ( child, mev)              /* line 308 */
            destroy_mevent ( mev)                      /* line 309 *//* line 310 */
          }                                            /* line 311 */
        }                                              /* line 312 */
      }                                                /* line 313 */
    }

    container.visit_ordering = [];                     /* line 314 *//* line 315 */
    /*  phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections  *//* line 316 */
    for (let child of  container.children) {           /* line 317 */
      if ( child.state ==  "active") {                 /* line 318 */
        /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 319 */
        container.state =  "active";                   /* line 320 *//* line 321 */
      }                                                /* line 322 */
      while (((! ((0=== child.outq.length))))) {       /* line 323 */
        let mev =  child.outq.shift ()                 /* line 324 */;
        route ( container, child, mev)                 /* line 325 */
        destroy_mevent ( mev)                          /* line 326 *//* line 327 */
      }                                                /* line 328 */
    }                                                  /* line 329 *//* line 330 */
}

function attempt_tick (parent,eh) {                    /* line 331 */
    if ( eh.state!= "idle") {                          /* line 332 */
      force_tick ( parent, eh)                         /* line 333 *//* line 334 */
    }                                                  /* line 335 *//* line 336 */
}

function is_tick (mev) {                               /* line 337 */
    return  "." ==  mev.port
    /*  assume that any mevent that is sent to port "." is a tick  *//* line 338 */;/* line 339 *//* line 340 */
}

/*  Routes a single mevent to all matching destinations, according to *//* line 341 */
/*  the container's connection network. */             /* line 342 *//* line 343 */
function route (container,from_component,mevent) {     /* line 344 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 345 */
    let  fromname =  "";                               /* line 346 *//* line 347 */
    ticktime =  ticktime+ 1;                           /* line 348 */
    if (is_tick ( mevent)) {                           /* line 349 */
      for (let child of  container.children) {         /* line 350 */
        attempt_tick ( container, child)               /* line 351 */
      }
      was_sent =  true;                                /* line 352 */
    }
    else {                                             /* line 353 */
      if (((! (is_self ( from_component, container))))) {/* line 354 */
        fromname =  from_component.name;               /* line 355 *//* line 356 */
      }
      let from_sender = mkSender ( fromname, from_component, mevent.port)/* line 357 */;/* line 358 */
      for (let connector of  container.connections) {  /* line 359 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 360 */
          deposit ( container, connector, mevent)      /* line 361 */
          was_sent =  true;                            /* line 362 *//* line 363 */
        }                                              /* line 364 */
      }                                                /* line 365 */
    }
    if ((! ( was_sent))) {                             /* line 366 */
      console.error ( "internal error" + ": " +  ( container.name.toString ()+  ( ": mevent on port '".toString ()+  ( mevent.port.toString ()+  ( "' from ".toString ()+  ( fromname.toString ()+  " dropped on floor...".toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 367 *//* line 368 */
    }                                                  /* line 369 *//* line 370 */
}

function any_child_ready (container) {                 /* line 371 */
    for (let child of  container.children) {           /* line 372 */
      if (child_is_ready ( child)) {                   /* line 373 */
        return  true;                                  /* line 374 *//* line 375 */
      }                                                /* line 376 */
    }
    return  false;                                     /* line 377 *//* line 378 *//* line 379 */
}

function child_is_ready (eh) {                         /* line 380 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 381 *//* line 382 *//* line 383 */
}

function append_routing_descriptor (container,desc) {  /* line 384 */
    container.routings.push ( desc)                    /* line 385 *//* line 386 *//* line 387 */
}

function injector (eh,mevent) {                        /* line 388 */
    eh.handler ( eh, mevent)                           /* line 389 *//* line 390 *//* line 391 */
}
                                                       /* line 392 *//* line 393 *//* line 394 */
class Component_Registry {
  constructor () {                                     /* line 395 */

    this.templates = {};                               /* line 396 *//* line 397 */
  }
}
                                                       /* line 398 */
class Template {
  constructor () {                                     /* line 399 */

    this.name =  null;                                 /* line 400 */
    this.container =  null;                            /* line 401 */
    this.instantiator =  null;                         /* line 402 *//* line 403 */
  }
}
                                                       /* line 404 */
function mkTemplate (name,template_data,instantiator) {/* line 405 */
    let  templ =  new Template ();                     /* line 406 */;
    templ.name =  name;                                /* line 407 */
    templ.template_data =  template_data;              /* line 408 */
    templ.instantiator =  instantiator;                /* line 409 */
    return  templ;                                     /* line 410 *//* line 411 *//* line 412 */
}
                                                       /* line 413 */
function lnet2internal_from_file (pathname,container_xml) {/* line 414 */
    let filename =   container_xml                     /* line 415 */;

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
                                                       /* line 416 *//* line 417 *//* line 418 */
}

function lnet2internal_from_string (lnet) {            /* line 419 */

    return JSON.parse (lnet);
                                                       /* line 420 *//* line 421 *//* line 422 */
}

function delete_decls (d) {                            /* line 423 *//* line 424 *//* line 425 *//* line 426 */
}

function make_component_registry () {                  /* line 427 */
    return  new Component_Registry ();                 /* line 428 */;/* line 429 *//* line 430 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 431 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 432 *//* line 433 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 434 */
    let name = mangle_name ( template.name)            /* line 435 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 436 */
      load_error ( ( "Component /".toString ()+  ( template.name.toString ()+  "/ already declared".toString ()) .toString ()) )/* line 437 */
      return  reg;                                     /* line 438 */
    }
    else {                                             /* line 439 */
      reg.templates [name] =  template;                /* line 440 */
      return  reg;                                     /* line 441 *//* line 442 */
    }                                                  /* line 443 *//* line 444 */
}

function get_component_instance (reg,full_name,owner) {/* line 445 */
    /*  If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it.  *//* line 446 */
    /*  ":?<string>" is a probe part that is tagged with <string>  *//* line 447 */
    /*  ":$ <command>" is a shell-out part that sends <command> to the operating system shell  *//* line 448 */
    /*  ":<string>" else, it's just treated as a string part that produces <string> on its output  *//* line 449 */
    let template_name = mangle_name ( full_name)       /* line 450 */;
    if ( ":" ==   full_name[0] ) {                     /* line 451 */
      let instance_name = generate_instance_name ( owner, template_name)/* line 452 */;
      let instance = external_instantiate ( reg, owner, instance_name, full_name)/* line 453 */;
      return  instance;                                /* line 454 */
    }
    else {                                             /* line 455 */
      if ((( template_name) in ( reg.templates))) {    /* line 456 */
        let template =  reg.templates [template_name]; /* line 457 */
        if (( template ==  null)) {                    /* line 458 */
          load_error ( ( "Registry Error (A): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 459 */
          return  null;                                /* line 460 */
        }
        else {                                         /* line 461 */
          let instance_name = generate_instance_name ( owner, template_name)/* line 462 */;
          let instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")/* line 463 */;
          return  instance;                            /* line 464 *//* line 465 */
        }
      }
      else {                                           /* line 466 */
        load_error ( ( "Registry Error (B): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 467 */
        return  null;                                  /* line 468 *//* line 469 */
      }                                                /* line 470 */
    }                                                  /* line 471 *//* line 472 */
}

function generate_instance_name (owner,template_name) {/* line 473 */
    let owner_name =  "";                              /* line 474 */
    let instance_name =  template_name;                /* line 475 */
    if ( null!= owner) {                               /* line 476 */
      owner_name =  owner.name;                        /* line 477 */
      instance_name =  ( owner_name.toString ()+  ( "▹".toString ()+  template_name.toString ()) .toString ()) /* line 478 */;
    }
    else {                                             /* line 479 */
      instance_name =  template_name;                  /* line 480 *//* line 481 */
    }
    return  instance_name;                             /* line 482 *//* line 483 *//* line 484 */
}

function mangle_name (s) {                             /* line 485 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 486 */
    return  s;                                         /* line 487 *//* line 488 *//* line 489 */
}
                                                       /* line 490 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 491 */
/*  and output queues of mevents. */                   /* line 492 */
/*  */                                                 /* line 493 */
/*  Components can either be a user_supplied function (“leaf“), or a “container“ *//* line 494 */
/*  that routes mevents to child components according to a list of connections *//* line 495 */
/*  that serve as a mevent routing table. */           /* line 496 */
/*  */                                                 /* line 497 */
/*  Child components themselves can be leaves or other containers. *//* line 498 */
/*  */                                                 /* line 499 */
/*  `handler` invokes the code that is attached to this component. *//* line 500 */
/*  */                                                 /* line 501 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 502 */
/*  function may want whenever it is invoked again. */ /* line 503 */
/*  */                                                 /* line 504 *//* line 505 */
/*  Eh_States :: enum { idle, active } */              /* line 506 */
class Eh {
  constructor () {                                     /* line 507 */

    this.name =  "";                                   /* line 508 */
    this.inq =  []                                     /* line 509 */;
    this.outq =  []                                    /* line 510 */;
    this.owner =  null;                                /* line 511 */
    this.children = [];                                /* line 512 */
    this.visit_ordering =  []                          /* line 513 */;
    this.connections = [];                             /* line 514 */
    this.routings =  []                                /* line 515 */;
    this.handler =  null;                              /* line 516 */
    this.finject =  null;                              /* line 517 */
    this.instance_data =  null;                        /* line 518 *//*  arg needed for probe support  *//* line 519 */
    this.arg =  "";                                    /* line 520 */
    this.state =  "idle";                              /* line 521 *//*  bootstrap debugging *//* line 522 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 523 *//* line 524 */
  }
}
                                                       /* line 525 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 526 */
/*  whose handler function is `container_handler`. */  /* line 527 */
function make_container (name,owner) {                 /* line 528 */
    let  eh =  new Eh ();                              /* line 529 */;
    eh.name =  name;                                   /* line 530 */
    eh.owner =  owner;                                 /* line 531 */
    eh.handler =  container_handler;                   /* line 532 */
    eh.finject =  injector;                            /* line 533 */
    eh.state =  "idle";                                /* line 534 */
    eh.kind =  "container";                            /* line 535 */
    return  eh;                                        /* line 536 *//* line 537 *//* line 538 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 539 */
/*  that will be passed back to your handler when called. *//* line 540 *//* line 541 */
function make_leaf (name,owner,instance_data,arg,handler) {/* line 542 */
    let  eh =  new Eh ();                              /* line 543 */;
    let  nm =  "";                                     /* line 544 */
    if ( null!= owner) {                               /* line 545 */
      nm =  owner.name;                                /* line 546 *//* line 547 */
    }
    eh.name =  ( nm.toString ()+  ( "▹".toString ()+  name.toString ()) .toString ()) /* line 548 */;
    eh.owner =  owner;                                 /* line 549 */
    eh.handler =  handler;                             /* line 550 */
    eh.finject =  injector;                            /* line 551 */
    eh.instance_data =  instance_data;                 /* line 552 */
    eh.arg =  arg;                                     /* line 553 */
    eh.state =  "idle";                                /* line 554 */
    eh.kind =  "leaf";                                 /* line 555 */
    return  eh;                                        /* line 556 *//* line 557 *//* line 558 */
}

/*  Sends a mevent on the given `port` with `data`, placing it on the output *//* line 559 */
/*  of the given component. */                         /* line 560 *//* line 561 */
function send (eh,port,obj,causingMevent) {            /* line 562 */
    let  d =  new Datum ();                            /* line 563 */;
    d.v =  obj;                                        /* line 564 */
    d.clone =  function () {return obj_clone ( d)      /* line 565 */;};
    d.reclaim =  null;                                 /* line 566 */
    let mev = make_mevent ( port, d)                   /* line 567 */;
    put_output ( eh, mev)                              /* line 568 *//* line 569 *//* line 570 */
}

function forward (eh,port,mev) {                       /* line 571 */
    let fwdmev = make_mevent ( port, mev.datum)        /* line 572 */;
    put_output ( eh, fwdmev)                           /* line 573 *//* line 574 *//* line 575 */
}

function inject_mevent (eh,mev) {                      /* line 576 */
    eh.finject ( eh, mev)                              /* line 577 *//* line 578 *//* line 579 */
}

function set_active (eh) {                             /* line 580 */
    eh.state =  "active";                              /* line 581 *//* line 582 *//* line 583 */
}

function set_idle (eh) {                               /* line 584 */
    eh.state =  "idle";                                /* line 585 *//* line 586 *//* line 587 */
}

function put_output (eh,mev) {                         /* line 588 */
    eh.outq.push ( mev)                                /* line 589 *//* line 590 *//* line 591 */
}

let  projectRoot =  "";                                /* line 592 *//* line 593 */
function set_environment (project_root) {              /* line 594 *//* line 595 */
    projectRoot =  project_root;                       /* line 596 *//* line 597 *//* line 598 */
}

function obj_clone (obj) {                             /* line 599 */
    return  obj;                                       /* line 600 *//* line 601 *//* line 602 */
}

/*  usage: app ${_00_} diagram_filename1 diagram_filename2 ... *//* line 603 */
/*  where ${_00_} is the root directory for the project *//* line 604 *//* line 605 */
function initialize_component_palette_from_files (project_root,diagram_source_files) {/* line 606 */
    let  reg = make_component_registry ();             /* line 607 */
    for (let diagram_source of  diagram_source_files) {/* line 608 */
      let all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)/* line 609 */;
      reg = generate_external_components ( reg, all_containers_within_single_file)/* line 610 */;
      for (let container of  all_containers_within_single_file) {/* line 611 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 612 *//* line 613 */
      }                                                /* line 614 */
    }
    initialize_stock_components ( reg)                 /* line 615 */
    return  reg;                                       /* line 616 *//* line 617 *//* line 618 */
}

function initialize_component_palette_from_string (project_root,lnet) {/* line 619 */
    /*  this version ignores project_root  */          /* line 620 */
    let  reg = make_component_registry ();             /* line 621 */
    let all_containers = lnet2internal_from_string ( lnet)/* line 622 */;
    reg = generate_external_components ( reg, all_containers)/* line 623 */;
    for (let container of  all_containers) {           /* line 624 */
      register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 625 *//* line 626 */
    }
    initialize_stock_components ( reg)                 /* line 627 */
    return  reg;                                       /* line 628 *//* line 629 *//* line 630 */
}
                                                       /* line 631 */
function clone_string (s) {                            /* line 632 */
    return  s                                          /* line 633 *//* line 634 */;/* line 635 */
}

let  load_errors =  false;                             /* line 636 */
let  runtime_errors =  false;                          /* line 637 *//* line 638 */
function load_error (s) {                              /* line 639 *//* line 640 */
    console.error ( s);                                /* line 641 */
                                                       /* line 642 */
    load_errors =  true;                               /* line 643 *//* line 644 *//* line 645 */
}

function runtime_error (s) {                           /* line 646 *//* line 647 */
    console.error ( s);                                /* line 648 */
    runtime_errors =  true;                            /* line 649 *//* line 650 *//* line 651 */
}
                                                       /* line 652 */
function initialize_from_files (project_root,diagram_names) {/* line 653 */
    let arg =  null;                                   /* line 654 */
    let palette = initialize_component_palette_from_files ( project_root, diagram_names)/* line 655 */;
    return [ palette,[ project_root, diagram_names, arg]];/* line 656 *//* line 657 *//* line 658 */
}

function initialize_from_string (project_root) {       /* line 659 */
    let arg =  null;                                   /* line 660 */
    let palette = initialize_component_palette_from_string ( project_root)/* line 661 */;
    return [ palette,[ project_root, null, arg]];      /* line 662 *//* line 663 *//* line 664 */
}

function start (arg,part_name,palette,env) {           /* line 665 */
    let part = start_bare ( part_name, palette, env)   /* line 666 */;
    inject ( part, "", arg)                            /* line 667 */
    finalize ( part)                                   /* line 668 *//* line 669 *//* line 670 */
}

function start_bare (part_name,palette,env) {          /* line 671 */
    let project_root =  env [ 0];                      /* line 672 */
    let diagram_names =  env [ 1];                     /* line 673 */
    set_environment ( project_root)                    /* line 674 */
    /*  get entrypoint container */                    /* line 675 */
    let  part = get_component_instance ( palette, part_name, null)/* line 676 */;
    if ( null ==  part) {                              /* line 677 */
      load_error ( ( "Couldn't find container with page name /".toString ()+  ( part_name.toString ()+  ( "/ in files ".toString ()+  (`${ diagram_names}`.toString ()+  " (check tab names, or disable compression?)".toString ()) .toString ()) .toString ()) .toString ()) )/* line 681 *//* line 682 */
    }
    return  part;                                      /* line 683 *//* line 684 *//* line 685 */
}

function inject (part,port,payload) {                  /* line 686 */
    if ((!  load_errors)) {                            /* line 687 */
      let  d =  new Datum ();                          /* line 688 */;
      d.v =  payload;                                  /* line 689 */
      d.clone =  function () {return obj_clone ( d)    /* line 690 */;};
      d.reclaim =  null;                               /* line 691 */
      let  mev = make_mevent ( port, d)                /* line 692 */;
      inject_mevent ( part, mev)                       /* line 693 */
    }
    else {                                             /* line 694 */
      process.exit (1)                                 /* line 695 *//* line 696 */
    }                                                  /* line 697 *//* line 698 */
}

function finalize (part) {                             /* line 699 */
    console.log (JSON.stringify ( part.outq.map(item => ({ [item.port]: item.datum.v })), null, 2));/* line 700 *//* line 701 *//* line 702 */
}

function new_datum_bang () {                           /* line 703 */
    let  d =  new Datum ();                            /* line 704 */;
    d.v =  "!";                                        /* line 705 */
    d.clone =  function () {return obj_clone ( d)      /* line 706 */;};
    d.reclaim =  null;                                 /* line 707 */
    return  d                                          /* line 708 *//* line 709 */;
}
/*  This is called `external` due to historical reasons. This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way.  *//* line 1 *//* line 2 */
function external_instantiate (reg,owner,name,arg) {   /* line 3 */
    let name_with_id = gensymbol ( name)               /* line 4 */;
    return make_leaf ( name_with_id, owner, null, arg, handle_external)/* line 5 */;/* line 6 *//* line 7 */
}

function generate_external_components (reg,container_list) {/* line 8 */
    /*  nothing to do here, anymore - get_component_instance doesn't need a template for ":..." Parts  *//* line 9 */
    return  reg;                                       /* line 10 *//* line 11 *//* line 12 */
}
/* line 1 */
function trash_instantiate (reg,owner,name,template_data,arg) {/* line 2 */
    let name_with_id = gensymbol ( "trash")            /* line 3 */;
    return make_leaf ( name_with_id, owner, null, "", trash_handler)/* line 4 */;/* line 5 *//* line 6 */
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

function deracer_instantiate (reg,owner,name,template_data,arg) {/* line 26 */
    let name_with_id = gensymbol ( "deracer")          /* line 27 */;
    let  inst =  new Deracer_Instance_Data ();         /* line 28 */;
    inst.state =  "idle";                              /* line 29 */
    inst.buffer =  new TwoMevents ();                  /* line 30 */;
    let eh = make_leaf ( name_with_id, owner, inst, "", deracer_handler)/* line 31 */;
    return  eh;                                        /* line 32 *//* line 33 *//* line 34 */
}

function send_firstmev_then_secondmev (eh,inst) {      /* line 35 */
    forward ( eh, "1", inst.buffer.firstmev)           /* line 36 */
    forward ( eh, "2", inst.buffer.secondmev)          /* line 37 */
    reclaim_Buffers_from_heap ( inst)                  /* line 38 *//* line 39 *//* line 40 */
}

function deracer_handler (eh,mev) {                    /* line 41 */
    let  inst =  eh.instance_data;                     /* line 42 */
    if ( inst.state ==  "idle") {                      /* line 43 */
      if ( "1" ==  mev.port) {                         /* line 44 */
        inst.buffer.firstmev =  mev;                   /* line 45 */
        inst.state =  "waitingForSecondmev";           /* line 46 */
      }
      else if ( "2" ==  mev.port) {                    /* line 47 */
        inst.buffer.secondmev =  mev;                  /* line 48 */
        inst.state =  "waitingForFirstmev";            /* line 49 */
      }
      else {                                           /* line 50 */
        runtime_error ( ( "bad mev.port (case A) for deracer ".toString ()+  mev.port.toString ()) )/* line 51 *//* line 52 */
      }
    }
    else if ( inst.state ==  "waitingForFirstmev") {   /* line 53 */
      if ( "1" ==  mev.port) {                         /* line 54 */
        inst.buffer.firstmev =  mev;                   /* line 55 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 56 */
        inst.state =  "idle";                          /* line 57 */
      }
      else {                                           /* line 58 */
        runtime_error ( ( "bad mev.port (case B) for deracer ".toString ()+  mev.port.toString ()) )/* line 59 *//* line 60 */
      }
    }
    else if ( inst.state ==  "waitingForSecondmev") {  /* line 61 */
      if ( "2" ==  mev.port) {                         /* line 62 */
        inst.buffer.secondmev =  mev;                  /* line 63 */
        send_firstmev_then_secondmev ( eh, inst)       /* line 64 */
        inst.state =  "idle";                          /* line 65 */
      }
      else {                                           /* line 66 */
        runtime_error ( ( "bad mev.port (case C) for deracer ".toString ()+  mev.port.toString ()) )/* line 67 *//* line 68 */
      }
    }
    else {                                             /* line 69 */
      runtime_error ( "bad state for deracer {eh.state}")/* line 70 *//* line 71 */
    }                                                  /* line 72 *//* line 73 */
}

function low_level_read_text_file_instantiate (reg,owner,name,template_data,arg) {/* line 74 */
    let name_with_id = gensymbol ( "Low Level Read Text File")/* line 75 */;
    return make_leaf ( name_with_id, owner, null, "", low_level_read_text_file_handler)/* line 76 */;/* line 77 *//* line 78 */
}

function low_level_read_text_file_handler (eh,mev) {   /* line 79 */
    let fname =  mev.datum.v;                          /* line 80 */

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
                                                       /* line 81 *//* line 82 *//* line 83 */
}

function ensure_string_datum_instantiate (reg,owner,name,template_data,arg) {/* line 84 */
    let name_with_id = gensymbol ( "Ensure String Datum")/* line 85 */;
    return make_leaf ( name_with_id, owner, null, "", ensure_string_datum_handler)/* line 86 */;/* line 87 *//* line 88 */
}

function ensure_string_datum_handler (eh,mev) {        /* line 89 */
    if ( "string" ==  mev.datum.kind ()) {             /* line 90 */
      forward ( eh, "", mev)                           /* line 91 */
    }
    else {                                             /* line 92 */
      let emev =  ( "*** ensure: type error (expected a string datum) but got ".toString ()+  mev.datum.toString ()) /* line 93 */;
      send ( eh, "✗", emev, mev)                       /* line 94 *//* line 95 */
    }                                                  /* line 96 *//* line 97 */
}

class Syncfilewrite_Data {
  constructor () {                                     /* line 98 */

    this.filename =  "";                               /* line 99 *//* line 100 */
  }
}
                                                       /* line 101 */
/*  temp copy for bootstrap, sends "done“ (error during bootstrap if not wired) *//* line 102 */
function syncfilewrite_instantiate (reg,owner,name,template_data,arg) {/* line 103 */
    let name_with_id = gensymbol ( "syncfilewrite")    /* line 104 */;
    let inst =  new Syncfilewrite_Data ();             /* line 105 */;
    return make_leaf ( name_with_id, owner, inst, "", syncfilewrite_handler)/* line 106 */;/* line 107 *//* line 108 */
}

function syncfilewrite_handler (eh,mev) {              /* line 109 */
    let  inst =  eh.instance_data;                     /* line 110 */
    if ( "filename" ==  mev.port) {                    /* line 111 */
      inst.filename =  mev.datum.v;                    /* line 112 */
    }
    else if ( "input" ==  mev.port) {                  /* line 113 */
      let contents =  mev.datum.v;                     /* line 114 */
      let  f = open ( inst.filename, "w")              /* line 115 */;
      if ( f!= null) {                                 /* line 116 */
        f.write ( mev.datum.v)                         /* line 117 */
        f.close ()                                     /* line 118 */
        send ( eh, "done",new_datum_bang (), mev)      /* line 119 */
      }
      else {                                           /* line 120 */
        send ( eh, "✗", ( "open error on file ".toString ()+  inst.filename.toString ()) , mev)/* line 121 *//* line 122 */
      }                                                /* line 123 */
    }                                                  /* line 124 *//* line 125 */
}

class StringConcat_Instance_Data {
  constructor () {                                     /* line 126 */

    this.buffer1 =  null;                              /* line 127 */
    this.buffer2 =  null;                              /* line 128 *//* line 129 */
  }
}
                                                       /* line 130 */
function stringconcat_instantiate (reg,owner,name,template_data,arg) {/* line 131 */
    let name_with_id = gensymbol ( "stringconcat")     /* line 132 */;
    let instp =  new StringConcat_Instance_Data ();    /* line 133 */;
    return make_leaf ( name_with_id, owner, instp, "", stringconcat_handler)/* line 134 */;/* line 135 *//* line 136 */
}

function stringconcat_handler (eh,mev) {               /* line 137 */
    let  inst =  eh.instance_data;                     /* line 138 */
    if ( "1" ==  mev.port) {                           /* line 139 */
      inst.buffer1 = clone_string ( mev.datum.v)       /* line 140 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 141 */
    }
    else if ( "2" ==  mev.port) {                      /* line 142 */
      inst.buffer2 = clone_string ( mev.datum.v)       /* line 143 */;
      maybe_stringconcat ( eh, inst, mev)              /* line 144 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 145 */
      inst.buffer1 =  null;                            /* line 146 */
      inst.buffer2 =  null;                            /* line 147 */
    }
    else {                                             /* line 148 */
      runtime_error ( ( "bad mev.port for stringconcat: ".toString ()+  mev.port.toString ()) )/* line 149 *//* line 150 */
    }                                                  /* line 151 *//* line 152 */
}

function maybe_stringconcat (eh,inst,mev) {            /* line 153 */
    if ((( inst.buffer1!= null) && ( inst.buffer2!= null))) {/* line 154 */
      let  concatenated_string =  "";                  /* line 155 */
      if ( 0 == ( inst.buffer1.length)) {              /* line 156 */
        concatenated_string =  inst.buffer2;           /* line 157 */
      }
      else if ( 0 == ( inst.buffer2.length)) {         /* line 158 */
        concatenated_string =  inst.buffer1;           /* line 159 */
      }
      else {                                           /* line 160 */
        concatenated_string =  inst.buffer1+ inst.buffer2;/* line 161 *//* line 162 */
      }
      send ( eh, "", concatenated_string, mev)         /* line 163 */
      inst.buffer1 =  null;                            /* line 164 */
      inst.buffer2 =  null;                            /* line 165 *//* line 166 */
    }                                                  /* line 167 *//* line 168 */
}

/*  */                                                 /* line 169 *//* line 170 */
function string_constant_instantiate (reg,owner,name,template_data,arg) {/* line 171 *//* line 172 */
    let name_with_id = gensymbol ( "strconst")         /* line 173 */;
    let  s =  template_data;                           /* line 174 */
    if ( projectRoot!= "") {                           /* line 175 */
      s =  s.replaceAll ( "_00_",  projectRoot)        /* line 176 */;/* line 177 */
    }
    return make_leaf ( name_with_id, owner, s, "", string_constant_handler)/* line 178 */;/* line 179 *//* line 180 */
}

function string_constant_handler (eh,mev) {            /* line 181 */
    let s =  eh.instance_data;                         /* line 182 */
    send ( eh, "", s, mev)                             /* line 183 *//* line 184 *//* line 185 */
}

function fakepipename_instantiate (reg,owner,name,template_data,arg) {/* line 186 */
    let instance_name = gensymbol ( "fakepipe")        /* line 187 */;
    return make_leaf ( instance_name, owner, null, "", fakepipename_handler)/* line 188 */;/* line 189 *//* line 190 */
}

let  rand =  0;                                        /* line 191 *//* line 192 */
function fakepipename_handler (eh,mev) {               /* line 193 *//* line 194 */
    rand =  rand+ 1;
    /*  not very random, but good enough _ ;rand' must be unique within a single run *//* line 195 */
    send ( eh, "", ( "/tmp/fakepipe".toString ()+  rand.toString ()) , mev)/* line 196 *//* line 197 *//* line 198 */
}
                                                       /* line 199 */
class Switch1star_Instance_Data {
  constructor () {                                     /* line 200 */

    this.state =  "1";                                 /* line 201 *//* line 202 */
  }
}
                                                       /* line 203 */
function switch1star_instantiate (reg,owner,name,template_data,arg) {/* line 204 */
    let name_with_id = gensymbol ( "switch1*")         /* line 205 */;
    let instp =  new Switch1star_Instance_Data ();     /* line 206 */;
    return make_leaf ( name_with_id, owner, instp, "", switch1star_handler)/* line 207 */;/* line 208 *//* line 209 */
}

function switch1star_handler (eh,mev) {                /* line 210 */
    let  inst =  eh.instance_data;                     /* line 211 */
    let whichOutput =  inst.state;                     /* line 212 */
    if ( "" ==  mev.port) {                            /* line 213 */
      if ( "1" ==  whichOutput) {                      /* line 214 */
        forward ( eh, "1", mev)                        /* line 215 */
        inst.state =  "*";                             /* line 216 */
      }
      else if ( "*" ==  whichOutput) {                 /* line 217 */
        forward ( eh, "*", mev)                        /* line 218 */
      }
      else {                                           /* line 219 */
        send ( eh, "✗", "internal error bad state in switch1*", mev)/* line 220 *//* line 221 */
      }
    }
    else if ( "reset" ==  mev.port) {                  /* line 222 */
      inst.state =  "1";                               /* line 223 */
    }
    else {                                             /* line 224 */
      send ( eh, "✗", "internal error bad mevent for switch1*", mev)/* line 225 *//* line 226 */
    }                                                  /* line 227 *//* line 228 */
}

class StringAccumulator {
  constructor () {                                     /* line 229 */

    this.s =  "";                                      /* line 230 *//* line 231 */
  }
}
                                                       /* line 232 */
function strcatstar_instantiate (reg,owner,name,template_data,arg) {/* line 233 */
    let name_with_id = gensymbol ( "String Concat *")  /* line 234 */;
    let instp =  new StringAccumulator ();             /* line 235 */;
    return make_leaf ( name_with_id, owner, instp, "", strcatstar_handler)/* line 236 */;/* line 237 *//* line 238 */
}

function strcatstar_handler (eh,mev) {                 /* line 239 */
    let  accum =  eh.instance_data;                    /* line 240 */
    if ( "" ==  mev.port) {                            /* line 241 */
      accum.s =  ( accum.s.toString ()+  mev.datum.v.toString ()) /* line 242 */;
    }
    else if ( "fini" ==  mev.port) {                   /* line 243 */
      send ( eh, "", accum.s, mev)                     /* line 244 */
    }
    else {                                             /* line 245 */
      send ( eh, "✗", "internal error bad mevent for String Concat *", mev)/* line 246 *//* line 247 */
    }                                                  /* line 248 *//* line 249 */
}

class BlockOnErrorState {
  constructor () {                                     /* line 250 */

    this.hasError =  "no";                             /* line 251 *//* line 252 */
  }
}
                                                       /* line 253 */
function blockOnError_instantiate (reg,owner,name,template_data,arg) {/* line 254 */
    let name_with_id = gensymbol ( "blockOnError")     /* line 255 */;
    let instp =  new BlockOnErrorState ();             /* line 256 */;
    return make_leaf ( name_with_id, owner, instp, blockOnError_handler)/* line 257 */;/* line 258 *//* line 259 */
}

function blockOnError_handler (eh,mev) {               /* line 260 */
    let  inst =  eh.instance_data;                     /* line 261 */
    if ( "" ==  mev.port) {                            /* line 262 */
      if ( inst.hasError ==  "no") {                   /* line 263 */
        send ( eh, "", mev.datum.v, mev)               /* line 264 *//* line 265 */
      }
    }
    else if ( "✗" ==  mev.port) {                      /* line 266 */
      inst.hasError =  "yes";                          /* line 267 */
    }
    else if ( "reset" ==  mev.port) {                  /* line 268 */
      inst.hasError =  "no";                           /* line 269 *//* line 270 */
    }                                                  /* line 271 *//* line 272 */
}

/*  all of the the built_in leaves are listed here */  /* line 273 */
/*  future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project *//* line 274 *//* line 275 */
function initialize_stock_components (reg) {           /* line 276 */
    register_component ( reg,mkTemplate ( "1then2", null, deracer_instantiate))/* line 277 */
    register_component ( reg,mkTemplate ( "1→2", null, deracer_instantiate))/* line 278 */
    register_component ( reg,mkTemplate ( "trash", null, trash_instantiate))/* line 279 */
    register_component ( reg,mkTemplate ( "blockOnError", null, blockOnError_instantiate))/* line 280 *//* line 281 *//* line 282 */
    register_component ( reg,mkTemplate ( "Read Text File", null, low_level_read_text_file_instantiate))/* line 283 */
    register_component ( reg,mkTemplate ( "Ensure String Datum", null, ensure_string_datum_instantiate))/* line 284 *//* line 285 */
    register_component ( reg,mkTemplate ( "syncfilewrite", null, syncfilewrite_instantiate))/* line 286 */
    register_component ( reg,mkTemplate ( "String Concat", null, stringconcat_instantiate))/* line 287 */
    register_component ( reg,mkTemplate ( "switch1*", null, switch1star_instantiate))/* line 288 */
    register_component ( reg,mkTemplate ( "String Concat *", null, strcatstar_instantiate))/* line 289 */
    /*  for fakepipe */                                /* line 290 */
    register_component ( reg,mkTemplate ( "fakepipename", null, fakepipename_instantiate))/* line 291 *//* line 292 *//* line 293 */
}
function handle_external (eh,mev) {                    /* line 1 */
    let s =  eh.arg;                                   /* line 2 */
    let  firstc =  s [ 1];                             /* line 3 */
    if ( firstc ==  "$") {                             /* line 4 */
      shell_out_handler ( eh,    s.substring (1) .substring (1) .substring (1) , mev)/* line 5 */
    }
    else if ( firstc ==  "?") {                        /* line 6 */
      probe_handler ( eh,  s.substring (1) , mev)      /* line 7 */
    }
    else {                                             /* line 8 */
      /*  just a string, send it out  */               /* line 9 */
      send ( eh, "",  s.substring (1) , mev)           /* line 10 *//* line 11 */
    }                                                  /* line 12 *//* line 13 */
}

function probe_handler (eh,tag,mev) {                  /* line 14 */
    let s =  mev.datum.v;                              /* line 15 */
    console.error ( "Info" + ": " +  ( "  @".toString ()+  (`${ ticktime}`.toString ()+  ( "  ".toString ()+  ( "probe ".toString ()+  ( eh.name.toString ()+  ( ": ".toString ()+ `${ s}`.toString ()) .toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 23 *//* line 24 *//* line 25 */
}

function shell_out_handler (eh,cmd,mev) {              /* line 26 */
    let s =  mev.datum.v;                              /* line 27 */
    let  ret =  null;                                  /* line 28 */
    let  rc =  null;                                   /* line 29 */
    let  stdout =  null;                               /* line 30 */
    let  stderr =  null;                               /* line 31 */

    stdout = execSync(`${ cmd} ${ s}`, { encoding: 'utf-8' });
    ret = true;
                                                       /* line 32 */
    if ( rc ==  0) {                                   /* line 33 */
      send ( eh, "", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 34 */
    }
    else {                                             /* line 35 */
      send ( eh, "✗", ( stdout.toString ()+  stderr.toString ()) , mev)/* line 36 *//* line 37 */
    }                                                  /* line 38 *//* line 39 */
}
