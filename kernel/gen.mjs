

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





