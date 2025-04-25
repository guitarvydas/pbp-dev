

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





