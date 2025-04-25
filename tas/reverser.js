

function reverser_install (reg) {/* line 1 */
    register_component ( reg,mkTemplate ( "Reverser", null, reverser_instantiator))/* line 2 *//* line 3 *//* line 4 */
}

let  reverser_state =  "J";   /* line 5 *//* line 6 */
function reverser_handler (eh,msg) {/* line 7 *//* line 8 */
    if ( reverser_state ==  "K") {/* line 9 */
      if ( msg.port ==  "J") {/* line 10 */
        send_bang ( eh, "", msg)/* line 11 */
        reverser_state =  "J";/* line 12 */}
      else {                  /* line 13 *//* line 14 *//* line 15 */}}
    else if ( reverser_state ==  "J") {/* line 16 */
      if ( msg.port ==  "K") {/* line 17 */
        send_bang ( eh, "", msg)/* line 18 */
        reverser_state =  "K";/* line 19 */}
      else {                  /* line 20 *//* line 21 *//* line 22 */}/* line 23 */}/* line 24 *//* line 25 */
}

function reverser_instantiator (reg,owner,name,template_data) {/* line 26 */
    let name_with_id = gensymbol ( "Reverser")/* line 27 */;
    return make_leaf ( name_with_id, owner, null, reverser_handler)/* line 28 */;/* line 29 */
}





