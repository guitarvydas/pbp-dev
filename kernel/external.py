
def external_instantiate (reg,owner,name,arg):         #line 1
    name_with_id = gensymbol ( name)                   #line 2
    return make_leaf ( name_with_id, owner, None, arg, handle_external)#line 3#line 4#line 5

def generate_external_components (reg,container_list): #line 6
    # nothing to do here, anymore - get_component_instance doesn;t need a template for ":..." Parts #line 7
    return  reg                                        #line 8#line 9#line 10