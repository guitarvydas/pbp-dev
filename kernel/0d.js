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

function step_children (container,causingMevent) {     /* line 293 */
    container.state =  "idle";                         /* line 294 */
    for (let child of   container.visit_ordering) {    /* line 295 */
      /*  child = container represents self, skip it *//* line 296 */
      if (((! (is_self ( child, container))))) {       /* line 297 */
        if (((! ((0=== child.inq.length))))) {         /* line 298 */
          let mev =  child.inq.shift ()                /* line 299 */;
          let  began_long_run =  null;                 /* line 300 */
          let  continued_long_run =  null;             /* line 301 */
          let  ended_long_run =  null;                 /* line 302 */
          [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, mev)/* line 303 */;
          if ( began_long_run) {                       /* line 304 *//* line 305 */
          }
          else if ( continued_long_run) {              /* line 306 *//* line 307 */
          }
          else if ( ended_long_run) {                  /* line 308 *//* line 309 *//* line 310 */
          }
          destroy_mevent ( mev)                        /* line 311 */
        }
        else {                                         /* line 312 */
          if ( child.state!= "idle") {                 /* line 313 */
            let mev = force_tick ( container, child)   /* line 314 */;
            child.handler ( child, mev)                /* line 315 */
            destroy_mevent ( mev)                      /* line 316 *//* line 317 */
          }                                            /* line 318 */
        }                                              /* line 319 */
        if ( child.state ==  "active") {               /* line 320 */
          /*  if child remains active, then the container must remain active and must propagate “ticks“ to child *//* line 321 */
          container.state =  "active";                 /* line 322 *//* line 323 */
        }                                              /* line 324 */
        while (((! ((0=== child.outq.length))))) {     /* line 325 */
          let mev =  child.outq.shift ()               /* line 326 */;
          route ( container, child, mev)               /* line 327 */
          destroy_mevent ( mev)                        /* line 328 *//* line 329 */
        }                                              /* line 330 */
      }                                                /* line 331 */
    }                                                  /* line 332 *//* line 333 */
}

function attempt_tick (parent,eh) {                    /* line 334 */
    if ( eh.state!= "idle") {                          /* line 335 */
      force_tick ( parent, eh)                         /* line 336 *//* line 337 */
    }                                                  /* line 338 *//* line 339 */
}

function is_tick (mev) {                               /* line 340 */
    return  "." ==  mev.port
    /*  assume that any mevent that is sent to port "." is a tick  *//* line 341 */;/* line 342 *//* line 343 */
}

/*  Routes a single mevent to all matching destinations, according to *//* line 344 */
/*  the container's connection network. */             /* line 345 *//* line 346 */
function route (container,from_component,mevent) {     /* line 347 */
    let  was_sent =  false;
    /*  for checking that output went somewhere (at least during bootstrap) *//* line 348 */
    let  fromname =  "";                               /* line 349 *//* line 350 */
    ticktime =  ticktime+ 1;                           /* line 351 */
    if (is_tick ( mevent)) {                           /* line 352 */
      for (let child of  container.children) {         /* line 353 */
        attempt_tick ( container, child)               /* line 354 */
      }
      was_sent =  true;                                /* line 355 */
    }
    else {                                             /* line 356 */
      if (((! (is_self ( from_component, container))))) {/* line 357 */
        fromname =  from_component.name;               /* line 358 *//* line 359 */
      }
      let from_sender = mkSender ( fromname, from_component, mevent.port)/* line 360 */;/* line 361 */
      for (let connector of  container.connections) {  /* line 362 */
        if (sender_eq ( from_sender, connector.sender)) {/* line 363 */
          deposit ( container, connector, mevent)      /* line 364 */
          was_sent =  true;                            /* line 365 *//* line 366 */
        }                                              /* line 367 */
      }                                                /* line 368 */
    }
    if ((! ( was_sent))) {                             /* line 369 */
      live_update ( "✗",  ( container.name.toString ()+  ( ": mevent '".toString ()+  ( mevent.port.toString ()+  ( "' from ".toString ()+  ( fromname.toString ()+  " dropped on floor...".toString ()) .toString ()) .toString ()) .toString ()) .toString ()) )/* line 370 *//* line 371 */
    }                                                  /* line 372 *//* line 373 */
}

function any_child_ready (container) {                 /* line 374 */
    for (let child of  container.children) {           /* line 375 */
      if (child_is_ready ( child)) {                   /* line 376 */
        return  true;                                  /* line 377 *//* line 378 */
      }                                                /* line 379 */
    }
    return  false;                                     /* line 380 *//* line 381 *//* line 382 */
}

function child_is_ready (eh) {                         /* line 383 */
    return ((((((((! ((0=== eh.outq.length))))) || (((! ((0=== eh.inq.length))))))) || (( eh.state!= "idle")))) || ((any_child_ready ( eh))));/* line 384 *//* line 385 *//* line 386 */
}

function append_routing_descriptor (container,desc) {  /* line 387 */
    container.routings.push ( desc)                    /* line 388 *//* line 389 *//* line 390 */
}

function injector (eh,mevent) {                        /* line 391 */
    eh.handler ( eh, mevent)                           /* line 392 *//* line 393 *//* line 394 */
}
                                                       /* line 395 *//* line 396 *//* line 397 */
class Component_Registry {
  constructor () {                                     /* line 398 */

    this.templates = {};                               /* line 399 *//* line 400 */
  }
}
                                                       /* line 401 */
class Template {
  constructor () {                                     /* line 402 */

    this.name =  null;                                 /* line 403 */
    this.container =  null;                            /* line 404 */
    this.instantiator =  null;                         /* line 405 *//* line 406 */
  }
}
                                                       /* line 407 */
function mkTemplate (name,template_data,instantiator) {/* line 408 */
    let  templ =  new Template ();                     /* line 409 */;
    templ.name =  name;                                /* line 410 */
    templ.template_data =  template_data;              /* line 411 */
    templ.instantiator =  instantiator;                /* line 412 */
    return  templ;                                     /* line 413 *//* line 414 *//* line 415 */
}
                                                       /* line 416 */
function lnet2internal_from_file (pathname,container_xml) {/* line 417 */
    let filename =   container_xml                     /* line 418 */;

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
                                                       /* line 419 *//* line 420 *//* line 421 */
}

function lnet2internal_from_string (lnet) {            /* line 422 */

    return JSON.parse (lnet);
                                                       /* line 423 *//* line 424 *//* line 425 */
}

function delete_decls (d) {                            /* line 426 *//* line 427 *//* line 428 *//* line 429 */
}

function make_component_registry () {                  /* line 430 */
    return  new Component_Registry ();                 /* line 431 */;/* line 432 *//* line 433 */
}

function register_component (reg,template) {
    return abstracted_register_component ( reg, template, false);/* line 434 */
}

function register_component_allow_overwriting (reg,template) {
    return abstracted_register_component ( reg, template, true);/* line 435 *//* line 436 */
}

function abstracted_register_component (reg,template,ok_to_overwrite) {/* line 437 */
    let name = mangle_name ( template.name)            /* line 438 */;
    if ((((((( reg!= null) && ( name))) in ( reg.templates))) && ((!  ok_to_overwrite)))) {/* line 439 */
      load_error ( ( "Component /".toString ()+  ( template.name.toString ()+  "/ already declared".toString ()) .toString ()) )/* line 440 */
      return  reg;                                     /* line 441 */
    }
    else {                                             /* line 442 */
      reg.templates [name] =  template;                /* line 443 */
      return  reg;                                     /* line 444 *//* line 445 */
    }                                                  /* line 446 *//* line 447 */
}

function get_component_instance (reg,full_name,owner) {/* line 448 */
    let template_name = mangle_name ( full_name)       /* line 449 */;
    if ( ":" ==   full_name[0] ) {                     /* line 450 */
      let instance_name = generate_instance_name ( owner, template_name)/* line 451 */;
      let instance = external_instantiate ( reg, owner, instance_name, full_name)/* line 452 */;
      return  instance;                                /* line 453 */
    }
    else {                                             /* line 454 */
      if ((( template_name) in ( reg.templates))) {    /* line 455 */
        let template =  reg.templates [template_name]; /* line 456 */
        if (( template ==  null)) {                    /* line 457 */
          load_error ( ( "Registry Error (A): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 458 */
          return  null;                                /* line 459 */
        }
        else {                                         /* line 460 */
          let instance_name = generate_instance_name ( owner, template_name)/* line 461 */;
          let instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")/* line 462 */;
          return  instance;                            /* line 463 *//* line 464 */
        }
      }
      else {                                           /* line 465 */
        load_error ( ( "Registry Error (B): Can't find component /".toString ()+  ( template_name.toString ()+  "/".toString ()) .toString ()) )/* line 466 */
        return  null;                                  /* line 467 *//* line 468 */
      }                                                /* line 469 */
    }                                                  /* line 470 *//* line 471 */
}

function generate_instance_name (owner,template_name) {/* line 472 */
    let owner_name =  "";                              /* line 473 */
    let instance_name =  template_name;                /* line 474 */
    if ( null!= owner) {                               /* line 475 */
      owner_name =  owner.name;                        /* line 476 */
      instance_name =  ( owner_name.toString ()+  ( "▹".toString ()+  template_name.toString ()) .toString ()) /* line 477 */;
    }
    else {                                             /* line 478 */
      instance_name =  template_name;                  /* line 479 *//* line 480 */
    }
    return  instance_name;                             /* line 481 *//* line 482 *//* line 483 */
}

function mangle_name (s) {                             /* line 484 */
    /*  trim name to remove code from Container component names _ deferred until later (or never) *//* line 485 */
    return  s;                                         /* line 486 *//* line 487 *//* line 488 */
}
                                                       /* line 489 */
/*  Data for an asyncronous component _ effectively, a function with input *//* line 490 */
/*  and output queues of mevents. */                   /* line 491 */
/*  */                                                 /* line 492 */
/*  Components can either be a user_supplied function (“leaf“), or a “container“ *//* line 493 */
/*  that routes mevents to child components according to a list of connections *//* line 494 */
/*  that serve as a mevent routing table. */           /* line 495 */
/*  */                                                 /* line 496 */
/*  Child components themselves can be leaves or other containers. *//* line 497 */
/*  */                                                 /* line 498 */
/*  `handler` invokes the code that is attached to this component. *//* line 499 */
/*  */                                                 /* line 500 */
/*  `instance_data` is a pointer to instance data that the `leaf_handler` *//* line 501 */
/*  function may want whenever it is invoked again. */ /* line 502 */
/*  */                                                 /* line 503 *//* line 504 */
/*  Eh_States :: enum { idle, active } */              /* line 505 */
class Eh {
  constructor () {                                     /* line 506 */

    this.name =  "";                                   /* line 507 */
    this.inq =  []                                     /* line 508 */;
    this.outq =  []                                    /* line 509 */;
    this.owner =  null;                                /* line 510 */
    this.children = [];                                /* line 511 */
    this.visit_ordering =  []                          /* line 512 */;
    this.connections = [];                             /* line 513 */
    this.routings =  []                                /* line 514 */;
    this.handler =  null;                              /* line 515 */
    this.finject =  null;                              /* line 516 */
    this.instance_data =  null;                        /* line 517 *//*  arg needed for probe support  *//* line 518 */
    this.arg =  "";                                    /* line 519 */
    this.state =  "idle";                              /* line 520 *//*  bootstrap debugging *//* line 521 */
    this.kind =  null;/*  enum { container, leaf, } */ /* line 522 *//* line 523 */
  }
}
                                                       /* line 524 */
/*  Creates a component that acts as a container. It is the same as a `Eh` instance *//* line 525 */
/*  whose handler function is `container_handler`. */  /* line 526 */
function make_container (name,owner) {                 /* line 527 */
    let  eh =  new Eh ();                              /* line 528 */;
    eh.name =  name;                                   /* line 529 */
    eh.owner =  owner;                                 /* line 530 */
    eh.handler =  container_handler;                   /* line 531 */
    eh.finject =  injector;                            /* line 532 */
    eh.state =  "idle";                                /* line 533 */
    eh.kind =  "container";                            /* line 534 */
    return  eh;                                        /* line 535 *//* line 536 *//* line 537 */
}

/*  Creates a new leaf component out of a handler function, and a data parameter *//* line 538 */
/*  that will be passed back to your handler when called. *//* line 539 *//* line 540 */
function make_leaf (name,owner,container,arg,handler) {/* line 541 */
    let  eh =  new Eh ();                              /* line 542 */;
    let  nm =  "";                                     /* line 543 */
    if ( null!= owner) {                               /* line 544 */
      nm =  owner.name;                                /* line 545 *//* line 546 */
    }
    eh.name =  ( nm.toString ()+  ( "▹".toString ()+  name.toString ()) .toString ()) /* line 547 */;
    eh.owner =  owner;                                 /* line 548 */
    eh.handler =  handler;                             /* line 549 */
    eh.finject =  injector;                            /* line 550 */
    eh.instance_data =  container;                     /* line 551 */
    eh.arg =  arg;                                     /* line 552 */
    eh.state =  "idle";                                /* line 553 */
    eh.kind =  "leaf";                                 /* line 554 */
    return  eh;                                        /* line 555 *//* line 556 *//* line 557 */
}

/*  Sends a mevent on the given `port` with `data`, placing it on the output *//* line 558 */
/*  of the given component. */                         /* line 559 *//* line 560 */
function send (eh,port,obj,causingMevent) {            /* line 561 */
    let  d = Datum ();                                 /* line 562 */
    d.v =  obj;                                        /* line 563 */
    d.clone =  function () {return obj_clone ( d)      /* line 564 */;};
    d.reclaim =  None;                                 /* line 565 */
    let mev = make_mevent ( port, d)                   /* line 566 */;
    put_output ( eh, mev)                              /* line 567 *//* line 568 *//* line 569 */
}

function forward (eh,port,mev) {                       /* line 570 */
    let fwdmev = make_mevent ( port, mev.datum)        /* line 571 */;
    put_output ( eh, fwdmev)                           /* line 572 *//* line 573 *//* line 574 */
}

function inject_mevent (eh,mev) {                      /* line 575 */
    eh.finject ( eh, mev)                              /* line 576 *//* line 577 *//* line 578 */
}

function set_active (eh) {                             /* line 579 */
    eh.state =  "active";                              /* line 580 *//* line 581 *//* line 582 */
}

function set_idle (eh) {                               /* line 583 */
    eh.state =  "idle";                                /* line 584 *//* line 585 *//* line 586 */
}

function put_output (eh,mev) {                         /* line 587 */
    eh.outq.push ( mev)                                /* line 588 *//* line 589 *//* line 590 */
}

let  projectRoot =  "";                                /* line 591 *//* line 592 */
function set_environment (project_root) {              /* line 593 *//* line 594 */
    projectRoot =  project_root;                       /* line 595 *//* line 596 *//* line 597 */
}

function obj_clone (obj) {                             /* line 598 */
    return  obj;                                       /* line 599 *//* line 600 *//* line 601 */
}

/*  usage: app ${_00_} diagram_filename1 diagram_filename2 ... *//* line 602 */
/*  where ${_00_} is the root directory for the project *//* line 603 *//* line 604 */
function initialize_component_palette_from_files (project_root,diagram_source_files) {/* line 605 */
    let  reg = make_component_registry ();             /* line 606 */
    for (let diagram_source of  diagram_source_files) {/* line 607 */
      let all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)/* line 608 */;
      reg = generate_external_components ( reg, all_containers_within_single_file)/* line 609 */;
      for (let container of  all_containers_within_single_file) {/* line 610 */
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 611 *//* line 612 */
      }                                                /* line 613 */
    }
    initialize_stock_components ( reg)                 /* line 614 */
    return  reg;                                       /* line 615 *//* line 616 *//* line 617 */
}

function initialize_component_palette_from_string (project_root,lnet) {/* line 618 */
    /*  this version ignores project_root  */          /* line 619 */
    let  reg = make_component_registry ();             /* line 620 */
    let all_containers = lnet2internal_from_string ( lnet)/* line 621 */;
    reg = generate_external_components ( reg, all_containers)/* line 622 */;
    for (let container of  all_containers) {           /* line 623 */
      register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))/* line 624 *//* line 625 */
    }
    initialize_stock_components ( reg)                 /* line 626 */
    return  reg;                                       /* line 627 *//* line 628 *//* line 629 */
}
                                                       /* line 630 */
function clone_string (s) {                            /* line 631 */
    return  s                                          /* line 632 *//* line 633 */;/* line 634 */
}

let  load_errors =  false;                             /* line 635 */
let  runtime_errors =  false;                          /* line 636 *//* line 637 */
function load_error (s) {                              /* line 638 *//* line 639 */
    console.error ( s);                                /* line 640 */
                                                       /* line 641 */
    load_errors =  true;                               /* line 642 *//* line 643 *//* line 644 */
}

function runtime_error (s) {                           /* line 645 *//* line 646 */
    console.error ( s);                                /* line 647 */
    runtime_errors =  true;                            /* line 648 *//* line 649 *//* line 650 */
}
                                                       /* line 651 */
function initialize_from_files (project_root,diagram_names) {/* line 652 */
    let arg =  null;                                   /* line 653 */
    let palette = initialize_component_palette_from_files ( project_root, diagram_names)/* line 654 */;
    return [ palette,[ project_root, diagram_names, arg]];/* line 655 *//* line 656 *//* line 657 */
}

function initialize_from_string (project_root) {       /* line 658 */
    let arg =  null;                                   /* line 659 */
    let palette = initialize_component_palette_from_string ( project_root)/* line 660 */;
    return [ palette,[ project_root, null, arg]];      /* line 661 *//* line 662 *//* line 663 */
}

function start (arg,part_name,palette,env) {           /* line 664 */
    let part = start_bare ( part_name, palette, env)   /* line 665 */;
    inject ( part, "", arg)                            /* line 666 */
    finalize ( part)                                   /* line 667 *//* line 668 *//* line 669 */
}

function start_bare (part_name,palette,env) {          /* line 670 */
    let project_root =  env [ 0];                      /* line 671 */
    let diagram_names =  env [ 1];                     /* line 672 */
    set_environment ( project_root)                    /* line 673 */
    /*  get entrypoint container */                    /* line 674 */
    let  part = get_component_instance ( palette, part_name, null)/* line 675 */;
    if ( null ==  part) {                              /* line 676 */
      load_error ( ( "Couldn't find container with page name /".toString ()+  ( part_name.toString ()+  ( "/ in files ".toString ()+  (`${ diagram_names}`.toString ()+  " (check tab names, or disable compression?)".toString ()) .toString ()) .toString ()) .toString ()) )/* line 680 *//* line 681 */
    }
    return  part;                                      /* line 682 *//* line 683 *//* line 684 */
}

function inject (part,port,payload) {                  /* line 685 */
    if ((!  load_errors)) {                            /* line 686 */
      let  d = Datum ();                               /* line 687 */
      d.v =  payload;                                  /* line 688 */
      d.clone =  function () {return obj_clone ( d)    /* line 689 */;};
      d.reclaim =  None;                               /* line 690 */
      let  mev = make_mevent ( port, d)                /* line 691 */;
      inject_mevent ( part, mev)                       /* line 692 */
    }
    else {                                             /* line 693 */
      process.exit (1)                                 /* line 694 *//* line 695 */
    }                                                  /* line 696 *//* line 697 */
}

function finalize (part) {                             /* line 698 */
    JSON.stringify ( part.outq)                        /* line 699 *//* line 700 *//* line 701 */
}

function new_datum_bang () {                           /* line 702 */
    let  d = Datum ();                                 /* line 703 */
    d.v =  "!";                                        /* line 704 */
    d.clone =  function () {return obj_clone ( d)      /* line 705 */;};
    d.reclaim =  None;                                 /* line 706 */
    return  d                                          /* line 707 *//* line 708 */;
}
