

function decode_install (reg) {/* line 1 */
    register_component ( reg,mkTemplate ( "Decode", null, decode_instantiator))/* line 2 *//* line 3 *//* line 4 */
}

let  decode_digits = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];/* line 5 */
function decode_handler (eh,msg) {/* line 6 *//* line 7 */
    let  i = Number ( msg.datum.srepr ())/* line 8 */;
    if ((( i >=  0) && ( i <=  9))) {/* line 9 */
      send_string ( eh, decode_digits [ i], decode_digits [ i], msg)/* line 10 *//* line 11 */}
    send_bang ( eh, "done", msg)/* line 12 *//* line 13 *//* line 14 */
}

function decode_instantiator (reg,owner,name,template_data) {/* line 15 */
    let name_with_id = gensymbol ( "Decode")/* line 16 */;
    return make_leaf ( name_with_id, owner, null, decode_handler)/* line 17 */;
}





