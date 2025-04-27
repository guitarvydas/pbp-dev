
def external_instantiate (reg,owner,name,container,arg):#line 1
    name_with_id = gensymbol ( "external")             #line 2
    return make_leaf ( name_with_id, owner, container, arg, external_handler)#line 3#line 4#line 5

def external_handler (eh,msg):                         #line 6
    handler = dispatch_lookup ( eh.name,  eh)          #line 7
    if  None ==  handler:                              #line 8
        # just a string with no further meaning - send it out as a string #line 9
        send ( eh, "", eh.arg, msg)                    #line 10
    else:                                              #line 11
        # handler implemented on a per-project basis   #line 12
        handler ( eh,  msg)                            #line 13#line 14#line 15#line 16

def generate_external_components (reg,container_list): #line 17
    if  None!= container_list:                         #line 18
        for diagram in  container_list:                #line 19
            # loop through every component in the diagram and look for names that start with ":“ #line 20
            for child_descriptor in  diagram [ "children"]:#line 21
                if first_char_is ( child_descriptor [ "name"], ":"):#line 22
                    name = mangle_name ( child_descriptor [ "name"])#line 23
                    arg =  child_descriptor [ "name"]  #line 24
                    generated_leaf = mkTemplate ( name, child_descriptor, arg, external_instantiate)#line 25
                    register_component ( reg, generated_leaf)#line 26#line 27#line 28#line 29#line 30
    return  reg                                        #line 31#line 32#line 33

def first_char (s):                                    #line 34
    return   s[0]                                      #line 35#line 36#line 37

def first_char_is (s,c):                               #line 38
    return  c == first_char ( s)                       #line 39#line 40#line 41
                                                       #line 42