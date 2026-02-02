# This is called `external` due to historical reasons. This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way. #line 1#line 2
def external_instantiate (reg,owner,name,arg):         #line 3
    name_with_id = gensymbol ( name)                   #line 4
    return make_leaf ( name_with_id, owner, None, arg, handle_external, None)#line 5#line 6#line 7
