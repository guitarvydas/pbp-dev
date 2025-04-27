
def external_instantiate (reg,owner,name,container,arg):#line 1
    name_with_id = gensymbol ( "external")             #line 2
    return make_leaf ( name_with_id, owner, container, arg, external_handler)#line 3#line 4#line 5

def external_handler (eh,msg):                         #line 6
    handle_external ( eh.arg, eh, msg)                 #line 7#line 8#line 9

def generate_external_components (reg,container_list): #line 10
    if  None!= container_list:                         #line 11
        for diagram in  container_list:                #line 12
            # loop through every component in the diagram and look for names that start with ":“ #line 13
            for child_descriptor in  diagram [ "children"]:#line 14
                if first_char_is ( child_descriptor [ "name"], ":"):#line 15
                    template_name =  ":"               #line 16
                    arg =  child_descriptor [ "name"]  #line 17
                    generated_leaf = mkTemplate ( template_name, child_descriptor, arg, external_instantiate)#line 18
                    register_component ( reg, generated_leaf)#line 19#line 20#line 21#line 22#line 23
    return  reg                                        #line 24#line 25#line 26

def first_char (s):                                    #line 27
    return   s[0]                                      #line 28#line 29#line 30

def first_char_is (s,c):                               #line 31
    return  c == first_char ( s)                       #line 32#line 33#line 34
                                                       #line 35