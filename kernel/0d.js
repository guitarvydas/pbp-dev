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

function step_child (child,mev) {                      /* line 284 */
    let before_state =  child.state;                   /* line 285 */
    child.handler ( child, mev)                        /* line 286 */
    let after_state =  child.state;                    /* line 287 */
    return [(( before_state ==  "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state!= "idle")),(( before_state!= "idle") && ( after_state ==  "idle"))];/* line 290 *//* line 291 *//* line 292 */
}

function step_child_once (child,mev) {                 /* line 293 */
    let  began_long_run =  null;                       /* line 294 */
    let  continued_long_run =  null;                   /* line 295 */
    let  ended_long_run =  null;                       /* line 296 */
    [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, mev)/* line 297 */;/* line 298 *//* line 299 */
}

function step_children (container,causingMevent) {     /* line 300 */
    container.state =  "idle";                         /* line 301 */
    for (let child of   container.visit_ordering) {    /* line 302 */
      /*  child = container represents self, skip it *//* line 303 */
      if (((! (is_self ( child, container))))) {       /* line 304 */
        if (((! ((0=== child.inq.length))))) {         /* line 305 */
          let mev =  child.inq.shift ()                /* line 306 */;
          step_child_once ( child, mev)                /* line 307 *//* line 308 */
          destroy_mevent ( mev)                        /* line 309 */
        }
        else {                                         /* line 310 */
          if ( child.state!= "idle") {                 /* line 311 */
            let mev = force_tick ( container, child)   /* line 312 */;
            step_child_once ( child, mev)              /* line 313 */
            destroy_mevent ( mev)                      /* line 314 *//* line 315 */
          }                                            /* line 316 */
        }                                              /* line 317 */
        if ( child.state ==  "active") {               /* line 318 */
          /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 319 */
          container.state =  "active";                 /* line 320 *//* line 321 */
        }                                              /* line 322 */
        while (((! ((0=== child.outq.length))))) {     /* line 323 */
          let mev =  child.outq.shift ()               /* line 324 */;
          route ( container, child, mev)               /* line 325 */
          destroy_mevent ( mev)                        /* line 326 *//* line 327 */
        }                                              /* line 328 */
      }                                                /* line 329 */
    }                                                  /* line 330 *//* line 331 */
}

function attempt_tick (parent,eh) {                    /* line 332 */
    if ( eh.state!= "idle") {                          /* line 333 */
      force_tick ( parent, eh)                         /* line 334 *//* line 335 */
    }                                                  /* line 336 *//* line 337 */
}

function is_tick (mev) {                               /* line 338 */
    return  "." ==  mev.port
    /*  assume that any mevent that is sent to port "." is a tick  *//* line 339 */;/* line 340 *//* line 341 */
}

/*  Routes a single mevent to all matching destinations, according to *//* line 342 */
/*  the container's connection network. */             /* line 343 *//* line 344 */
function route (container,from_component,mevent) {     /* line 345 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 346 */
    let  fromname =  "";                               /* line 347 *//* line 348 */
    ticktime =  ticktime+ 1;                           /* line 349 */
    if (is_tick ( mevent)) {                           /* line 350 */
      for (let child of  container.children) {         /* line 351 */
        attempt_tick ( container, child)               /* line 352 */
      }
      was_sent =  true;                                /* line 353 */
    }
    else {                                             /* line 354 */
      if (((! (is_self ( from_component, container))))) {/* line 355 */
        fromname =  from_component.name;               /* line 356 *//* line 357 */
      }
      let from_sender = mkSender ( fromname, from_component, mevent.port)/* line 358 */;/* line 359 */
      for (let connector of  container.connections) {  /* line 360 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 361 */
          deposit ( container, connector, mevent)      /* line 362 */
          was_sent =  true;                            /* line 363 *//* line 364 */
        }                                              /* line 365 */
      }                                                /* line 366 */
    }
    if ((! ( was_sent))) {                             /* line 367 */
      live_update ( "✗",  ( container.name.toString ()+  ( ": mevent '".toString ()+  ( mevent.port.toString ()+  ( "' from ".toString ()+  ( fromname.toString ()+  " dropped on floor...".toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 368 *//* line 369 */
    }                                                  /* line 370 *//* line 371 */
}

function any_child_ready (container) {                 /* line 372 */
    for (let child of  container.children) {           /* line 373 */
      if (child_is_ready ( child)) {                   /* line 374 */
        return  true;                                  /* line 375 *//* line 376 */
      }                                                /* line 377 */
    }
    return  false;                                     /* line 378 *//* line 379 *//* line 380 */
}

function child_is_ready (eh) {                         /* line 381 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 382 *//* line 383 *//* line 384 */
}

function append_routing_descriptor (container,desc) {  /* line 385 */
    container.routings.push ( desc)                    /* line 386 *//* line 387 *//* line 388 */
}

function injector (eh,mevent) {                        /* line 389 */
    eh.handler ( eh, mevent)                           /* line 390 *//* line 391 *//* line 392 */
}
                                                       /* line 393 *//* line 394 *//* line 395 */
class Component_Registry {
  constructor () {                                     /* line 396 */

    this.templates = {};                               /* line 397 *//* line 398 */
  }
}
                                                       /* line 399 */
class Template {
  constructor () {                                     /* line 400 */

    this.name =  null;                                 /* line 401 */
    this.container =  null;                            /* line 402 */
    this.instantiator =  null;                         /* line 403 *//* line 404 */
  }
}
                                                       /* line 405 */
function mkTemplate (name,template_data,instantiator) {/* line 406 */
    let  templ =  new Template ();                     /* line 407 */;
    templ.name =  name;                                /* line 408 */
    templ.template_data =  template_data;              /* line 409 */
    templ.instantiator =  instantiator;                /* line 410 */
    return  templ;                                     /* line 411 *//* line 412 *//* line 413 */
}
                                                       /* line 414 */
function lnet2internal_from_file (pathname,container_xml) {/* line 415 */
    let filename =   container_xml                     /* line 416 */;

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
                                                       /* line 417 *//* line 418 *//* line 419 */
}

function lnet2internal_from_string (lnet) {            /* line 420 */

    return JSON.parse (lnet);
                                                       /* line 421 *//* line 422 *//* line 423 */
}

function delete_decls (d) {                            /* line 424 *//* line 425 *//* line 426 *//* line 427 */
}

function make_component_registry () {                  /* line 428 */
    return  new Component_Registry ();                 /* line 429 */;/* line 430 *//* line 431 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 432 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 433 *//* line 434 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 435 */
    let name = mangle_name ( template.name)            /* line 436 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 437 */
      load_error ( ( "Component /".toString ()+  ( template.name.toString ()+  "/ already declared".toString ()) .toString ()) )/* line 438 */
      return  reg;                                     /* line 439 */
    }
    else {                                             /* line 440 */
      reg.templates [name] =  template;                /* line 441 */
      return  reg;                                     /* line 442 *//* line 443 */
    }                                                  /* line 444 *//* line 445 */
}

function get_component_instance (reg,full_name,owner) {/* line 446 */
    let template_name = mangle_name ( full_name)       /* line 447 */;
    if ( ":" ==   full_name[0] ) {                     /* line 448 */
      let instance_name = generate_instance_name ( owner, template_name)/* line 449 */;
      let instance = external_instantiate ( reg, owner, instance_name, full_name)/* line 450 */;
      return  instance;                                /* line 451 */
    }
    else {                                             /* line 452 */
      if ((( template_name) in ( reg.templates))) {    /* line 453 */
        let template =  reg.templates [template_name]; /* line 454 */
        if (( template ==  null)) {                    /* line 455 */
          load_error ( ( "Registry Error (A): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 456 */
          return  null;                                /* line 457 */
        }
        else {                                         /* line 458 */
          let instance_name = generate_instance_name ( owner, template_name)/* line 459 */;
          let instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")/* line 460 */;
          return  instance;                            /* line 461 *//* line 462 */
        }
      }
      else {                                           /* line 463 */
        load_error ( ( "Registry Error (B): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 464 */
        return  null;                                  /* line 465 *//* line 466 */
      }                                                /* line 467 */
    }                                                  /* line 468 *//* line 469 */
}

function generate_instance_name (owner,template_name) {/* line 470 */
    let owner_name =  "";                              /* line 471 */
    let instance_name =  template_name;                /* line 472 */
    if ( null!= owner) {                               /* line 473 */
      owner_name =  owner.name;                        /* line 474 */
      instance_name =  ( owner_name.toString ()+  ( "▹".toString ()+  template_name.toString ()) .toString ()) /* line 475 */;
    }
    else {                                             /* line 476 */
      instance_name =  template_name;                  /* line 477 *//* line 478 */
    }
    return  instance_name;                             /* line 479 *//* line 480 *//* line 481 */
}

function mangle_name (s) {                             /* line 482 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 483 */
    return  s;                                         /* line 484 *//* line 485 *//* line 486 */
}
                                                       /* line 487 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 488 */
/*  and output queues of mevents. */                   /* line 489 */
/*  */                                                 /* line 490 */
/*  Components can either be a user_supplied function (“leaf“), or a “container“ *//* line 491 */
/*  that routes mevents to child components according to a list of connections *//* line 492 */
/*  that serve as a mevent routing table. */           /* line 493 */
/*  */                                                 /* line 494 */
/*  Child components themselves can be leaves or other containers. *//* line 495 */
/*  */                                                 /* line 496 */
/*  `handler` invokes the code that is attached to this component. *//* line 497 */
/*  */                                                 /* line 498 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 499 */
/*  function may want whenever it is invoked again. */ /* line 500 */
/*  */                                                 /* line 501 *//* line 502 */
/*  Eh_States :: enum { idle, active } */              /* line 503 */
class Eh {
  constructor () {                                     /* line 504 */

    this.name =  "";                                   /* line 505 */
    this.inq =  []                                     /* line 506 */;
    this.outq =  []                                    /* line 507 */;
    this.owner =  null;                                /* line 508 */
    this.children = [];                                /* line 509 */
    this.visit_ordering =  []                          /* line 510 */;
    this.connections = [];                             /* line 511 */
    this.routings =  []                                /* line 512 */;
    this.handler =  null;                              /* line 513 */
    this.finject =  null;                              /* line 514 */
    this.instance_data =  null;                        /* line 515 *//*  arg needed for probe support  *//* line 516 */
    this.arg =  "";                                    /* line 517 */
    this.state =  "idle";                              /* line 518 *//*  bootstrap debugging *//* line 519 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 520 *//* line 521 */
  }
}
                                                       /* line 522 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 523 */
/*  whose handler function is `container_handler`. */  /* line 524 */
function make_container (name,owner) {                 /* line 525 */
    let  eh =  new Eh ();                              /* line 526 */;
    eh.name =  name;                                   /* line 527 */
    eh.owner =  owner;                                 /* line 528 */
    eh.handler =  container_handler;                   /* line 529 */
    eh.finject =  injector;                            /* line 530 */
    eh.state =  "idle";                                /* line 531 */
    eh.kind =  "container";                            /* line 532 */
    return  eh;                                        /* line 533 *//* line 534 *//* line 535 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 536 */
/*  that will be passed back to your handler when called. *//* line 537 *//* line 538 */
function make_leaf (name,owner,container,arg,handler) {/* line 539 */
    let  eh =  new Eh ();                              /* line 540 */;
    let  nm =  "";                                     /* line 541 */
    if ( null!= owner) {                               /* line 542 */
      nm =  owner.name;                                /* line 543 *//* line 544 */
    }
    eh.name =  ( nm.toString ()+  ( "▹".toString ()+  name.toString ()) .toString ()) /* line 545 */;
    eh.owner =  owner;                                 /* line 546 */
    eh.handler =  handler;                             /* line 547 */
    eh.finject =  injector;                            /* line 548 */
    eh.instance_data =  container;                     /* line 549 */
    eh.arg =  arg;                                     /* line 550 */
    eh.state =  "idle";                                /* line 551 */
    eh.kind =  "leaf";                                 /* line 552 */
    return  eh;                                        /* line 553 *//* line 554 *//* line 555 */
}

/*  Sends a mevent on the given `port` with `data`, placing it on the output *//* line 556 */
/*  of the given component. */                         /* line 557 *//* line 558 */
function send (eh,port,obj,causingMevent) {            /* line 559 */
    let  d = Datum ();                                 /* line 560 */
    d.v =  obj;                                        /* line 561 */
    d.clone =  function () {return obj_clone ( d)      /* line 562 */;};
    d.reclaim =  None;                                 /* line 563 */
    let mev = make_mevent ( port, d)                   /* line 564 */;
    put_output ( eh, mev)                              /* line 565 *//* line 566 *//* line 567 */
}

function forward (eh,port,mev) {                       /* line 568 */
    let fwdmev = make_mevent ( port, mev.datum)        /* line 569 */;
    put_output ( eh, fwdmev)                           /* line 570 *//* line 571 *//* line 572 */
}

function inject_mevent (eh,mev) {                      /* line 573 */
    eh.finject ( eh, mev)                              /* line 574 *//* line 575 *//* line 576 */
}

function set_active (eh) {                             /* line 577 */
    eh.state =  "active";                              /* line 578 *//* line 579 *//* line 580 */
}

function set_idle (eh) {                               /* line 581 */
    eh.state =  "idle";                                /* line 582 *//* line 583 *//* line 584 */
}

function put_output (eh,mev) {                         /* line 585 */
    eh.outq.push ( mev)                                /* line 586 *//* line 587 *//* line 588 */
}

let  projectRoot =  "";                                /* line 589 *//* line 590 */
function set_environment (project_root) {              /* line 591 *//* line 592 */
    projectRoot =  project_root;                       /* line 593 *//* line 594 *//* line 595 */
}

function obj_clone (obj) {                             /* line 596 */
    return  obj;                                       /* line 597 *//* line 598 *//* line 599 */
}

/*  usage: app ${_00_} diagram_filename1 diagram_filename2 ... *//* line 600 */
/*  where ${_00_} is the root directory for the project *//* line 601 *//* line 602 */
function initialize_component_palette_from_files (project_root,diagram_source_files) {/* line 603 */
    let  reg = make_component_registry ();             /* line 604 */
    for (let diagram_source of  diagram_source_files) {/* line 605 */
      let all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)/* line 606 */;
      reg = generate_external_components ( reg, all_containers_within_single_file)/* line 607 */;
      for (let container of  all_containers_within_single_file) {/* line 608 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 609 *//* line 610 */
      }                                                /* line 611 */
    }
    initialize_stock_components ( reg)                 /* line 612 */
    return  reg;                                       /* line 613 *//* line 614 *//* line 615 */
}

function initialize_component_palette_from_string (project_root,lnet) {/* line 616 */
    /*  this version ignores project_root  */          /* line 617 */
    let  reg = make_component_registry ();             /* line 618 */
    let all_containers = lnet2internal_from_string ( lnet)/* line 619 */;
    reg = generate_external_components ( reg, all_containers)/* line 620 */;
    for (let container of  all_containers) {           /* line 621 */
      register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 622 *//* line 623 */
    }
    initialize_stock_components ( reg)                 /* line 624 */
    return  reg;                                       /* line 625 *//* line 626 *//* line 627 */
}
                                                       /* line 628 */
function clone_string (s) {                            /* line 629 */
    return  s                                          /* line 630 *//* line 631 */;/* line 632 */
}

let  load_errors =  false;                             /* line 633 */
let  runtime_errors =  false;                          /* line 634 *//* line 635 */
function load_error (s) {                              /* line 636 *//* line 637 */
    console.error ( s);                                /* line 638 */
                                                       /* line 639 */
    load_errors =  true;                               /* line 640 *//* line 641 *//* line 642 */
}

function runtime_error (s) {                           /* line 643 *//* line 644 */
    console.error ( s);                                /* line 645 */
    runtime_errors =  true;                            /* line 646 *//* line 647 *//* line 648 */
}
                                                       /* line 649 */
function initialize_from_files (project_root,diagram_names) {/* line 650 */
    let arg =  null;                                   /* line 651 */
    let palette = initialize_component_palette_from_files ( project_root, diagram_names)/* line 652 */;
    return [ palette,[ project_root, diagram_names, arg]];/* line 653 *//* line 654 *//* line 655 */
}

function initialize_from_string (project_root) {       /* line 656 */
    let arg =  null;                                   /* line 657 */
    let palette = initialize_component_palette_from_string ( project_root)/* line 658 */;
    return [ palette,[ project_root, null, arg]];      /* line 659 *//* line 660 *//* line 661 */
}

function start (arg,part_name,palette,env) {           /* line 662 */
    let part = start_bare ( part_name, palette, env)   /* line 663 */;
    inject ( part, "", arg)                            /* line 664 */
    finalize ( part)                                   /* line 665 *//* line 666 *//* line 667 */
}

function start_bare (part_name,palette,env) {          /* line 668 */
    let project_root =  env [ 0];                      /* line 669 */
    let diagram_names =  env [ 1];                     /* line 670 */
    set_environment ( project_root)                    /* line 671 */
    /*  get entrypoint container */                    /* line 672 */
    let  part = get_component_instance ( palette, part_name, null)/* line 673 */;
    if ( null ==  part) {                              /* line 674 */
      load_error ( ( "Couldn't find container with page name /".toString ()+  ( part_name.toString ()+  ( "/ in files ".toString ()+  (`${ diagram_names}`.toString ()+  " (check tab names, or disable compression?)".toString ()) .toString ()) .toString ()) .toString ()) )/* line 678 *//* line 679 */
    }
    return  part;                                      /* line 680 *//* line 681 *//* line 682 */
}

function inject (part,port,payload) {                  /* line 683 */
    if ((!  load_errors)) {                            /* line 684 */
      let  d = Datum ();                               /* line 685 */
      d.v =  payload;                                  /* line 686 */
      d.clone =  function () {return obj_clone ( d)    /* line 687 */;};
      d.reclaim =  None;                               /* line 688 */
      let  mev = make_mevent ( port, d)                /* line 689 */;
      inject_mevent ( part, mev)                       /* line 690 */
    }
    else {                                             /* line 691 */
      process.exit (1)                                 /* line 692 *//* line 693 */
    }                                                  /* line 694 *//* line 695 */
}

function finalize (part) {                             /* line 696 */
    JSON.stringify ( part.outq)                        /* line 697 *//* line 698 *//* line 699 */
}

function new_datum_bang () {                           /* line 700 */
    let  d = Datum ();                                 /* line 701 */
    d.v =  "!";                                        /* line 702 */
    d.clone =  function () {return obj_clone ( d)      /* line 703 */;};
    d.reclaim =  None;                                 /* line 704 */
    return  d                                          /* line 705 *//* line 706 */;
}
