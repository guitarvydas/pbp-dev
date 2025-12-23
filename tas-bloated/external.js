/*  This is called `external` due to historical reasons. This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way.  *//* line 1 *//* line 2 */
function external_instantiate (reg,owner,name,arg) {   /* line 3 */
    let name_with_id = gensymbol ( name)               /* line 4 */;
    return make_leaf ( name_with_id, owner, null, arg, handle_external)/* line 5 */;/* line 6 *//* line 7 */
}

function generate_external_components (reg,container_list) {/* line 8 */
    /*  nothing to do here, anymore - get_component_instance doesn't need a template for ":..." Parts  *//* line 9 */
    return  reg;                                       /* line 10 *//* line 11 *//* line 12 */
}
