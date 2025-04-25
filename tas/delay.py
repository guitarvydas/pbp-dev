def delay_install (reg):                                    #line 1
    register_component ( reg,mkTemplate ( "Delay", None, delay_instantiator))#line 2#line 3#line 4

class Delay_Info:
    def __init__ (self,):                                   #line 5
        self.counter =  0                                   #line 6
        self.saved_message =  None                          #line 7#line 8
                                                            #line 9
def delay_instantiator (reg,owner,name,template_data):      #line 10
    name_with_id = gensymbol ( "delay")                     #line 11
    info =  Delay_Info ()                                   #line 12
    return make_leaf ( name_with_id, owner, info, delay_handler)#line 13#line 14#line 15

DELAYDELAY =  5000                                          #line 16#line 17
def first_time (m):                                         #line 18
    return not is_tick ( m)                                 #line 19#line 20#line 21

def delay_handler (eh,msg):                                 #line 22
    info =  eh.instance_data                                #line 23
    if first_time ( msg):                                   #line 24
        info.saved_message =  msg                           #line 25
        set_active ( eh)
        # tell engine to keep running this component with ;ticks' #line 26#line 27#line 28
    count =  info.counter                                   #line 29
    next =  count+ 1                                        #line 30
    if  info.counter >=  DELAYDELAY:                        #line 31
        set_idle ( eh)
        # tell engine that we're finally done               #line 32
        forward ( eh, "", info.saved_message)               #line 33
        next =  0                                           #line 34#line 35
    info.counter =  next                                    #line 36#line 37#line 38
