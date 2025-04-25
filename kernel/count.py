count_counter =  0                                          #line 1
count_direction =  1                                        #line 2#line 3
def count_handler (eh,msg):                                 #line 4
    global count_counter, count_direction                   #line 5
    if  msg.port ==  "adv":                                 #line 6
        count_counter =  count_counter+ count_direction     #line 7
        send_int ( eh, "", count_counter, msg)              #line 8
    elif  msg.port ==  "rev":                               #line 9
        count_direction = - count_direction                 #line 10#line 11#line 12#line 13

def count_instantiator (reg,owner,name,template_data):      #line 14
    name_with_id = gensymbol ( "Count")                     #line 15
    return make_leaf ( name_with_id, owner, None, count_handler)#line 16#line 17#line 18

def count_install (reg):                                    #line 19
    register_component ( reg,mkTemplate ( "Count", None, count_instantiator))#line 20#line 21
