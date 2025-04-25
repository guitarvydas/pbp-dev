def monitor_install (reg):                                  #line 1
    register_component ( reg,mkTemplate ( "@", None, monitor_instantiator))#line 2#line 3#line 4

def monitor_instantiator (reg,owner,name,template_data):    #line 5
    name_with_id = gensymbol ( "@")                         #line 6
    return make_leaf ( name_with_id, owner, None, monitor_handler)#line 7#line 8#line 9

def monitor_handler (eh,msg):                               #line 10
    s =  msg.datum.v                                        #line 11
    i = int ( s)                                            #line 12
    while  i >  0:                                          #line 13
        s =  str( " ") +  s                                 #line 14
        i =  i- 1                                           #line 15#line 16
    print ( s)                                              #line 17#line 18
