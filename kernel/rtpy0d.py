

counter  = 0
digits  = ["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉","₁₀","₁₁","₁₂","₁₃","₁₄","₁₅","₁₆","₁₇","₁₈","₁₉","₂₀","₂₁","₂₂","₂₃","₂₄","₂₅","₂₆","₂₇","₂₈","₂₉"]
def  gensym  ( s ):
    global  counter
    name_with_id  =  str( s ) +  subscripted_digit  ( counter )
    counter  =  counter +1
    return  name_with_id 

def  subscripted_digit  ( n ):
    global  digits
    if ( n  >= 0  and   n  <= 29):
        return  digits  [ n ]
    else:
        return  str("₊") +  n  
    

class  Datum :
    def __init__ (self):
        self. data  =  None
        self. clone  =  None
        self. reclaim  =  None
        self. srepr  =  None
        self. kind  =  None
        self. raw  =  None

def  new_datum_string  ( s ):
    d  =   Datum  ()
    d . data  =  s
    d . clone  =  lambda :  clone_datum_string  ( d )
    d . reclaim  =  lambda :  reclaim_datum_string  ( d )
    d . srepr  =  lambda :  srepr_datum_string  ( d )
    d . raw  =  lambda :  raw_datum_string  ( d )
    d . kind  =  lambda : "string"
    return  d 

def  clone_datum_string  ( d ):
    d  =  new_datum_string  ( d . data )
    return  d 

def  reclaim_datum_string  ( src ):
    pass

def  srepr_datum_string  ( d ):
    return  d . data 

def  raw_datum_string  ( d ):
    return  bytearray  ( d . data ,"UTF_8")

def  new_datum_bang  ():
    p  =  Datum  ()
    p . data  =  True
    p . clone  =  lambda :  clone_datum_bang  ( p )
    p . reclaim  =  lambda :  reclaim_datum_bang  ( p )
    p . srepr  =  lambda :  srepr_datum_bang  ()
    p . raw  =  lambda :  raw_datum_bang  ()
    p . kind  =  lambda : "bang"
    return  p 

def  clone_datum_bang  ( d ):
    return  new_datum_bang  ()

def  reclaim_datum_bang  ( d ):
    pass

def  srepr_datum_bang  ():
    return "!"

def  raw_datum_bang  ():
    return []

def  new_datum_tick  ():
    p  =  new_datum_bang  ()
    p . kind  =  lambda : "tick"
    p . clone  =  lambda :  new_datum_tick  ()
    p . srepr  =  lambda :  srepr_datum_tick  ()
    p . raw  =  lambda :  raw_datum_tick  ()
    return  p 

def  srepr_datum_tick  ():
    return "."

def  raw_datum_tick  ():
    return []

def  new_datum_bytes  ( b ):
    p  =  Datum  ()
    p . data  =  b
    p . clone  =  clone_datum_bytes
    p . reclaim  =  lambda :  reclaim_datum_bytes  ( p )
    p . srepr  =  lambda :  srepr_datum_bytes  ( b )
    p . raw  =  lambda :  raw_datum_bytes  ( b )
    p . kind  =  lambda : "bytes"
    return  p 

def  clone_datum_bytes  ( src ):
    p  =  Datum  ()
    p  =  src
    p . data  =  src . clone  ()
    return  p 

def  reclaim_datum_bytes  ( src ):
    pass

def  srepr_datum_bytes  ( d ):
    return  d . data . decode  ("UTF_8")

def  raw_datum_bytes  ( d ):
    return  d . data 

def  new_datum_handle  ( h ):
    return  new_datum_int  ( h )

def  new_datum_int  ( i ):
    p  =  Datum  ()
    p . data  =  i
    p . clone  =  lambda :  clone_int  ( i )
    p . reclaim  =  lambda :  reclaim_int  ( i )
    p . srepr  =  lambda :  srepr_datum_int  ( i )
    p . raw  =  lambda :  raw_datum_int  ( i )
    p . kind  =  lambda : "int"
    return  p 

def  clone_int  ( i ):
    p  =  new_datum_int  ( i )
    return  p 

def  reclaim_int  ( src ):
    pass

def  srepr_datum_int  ( i ):
    return  str  ( i )

def  raw_datum_int  ( i ):
    return  i 

class  Message :
    def __init__ (self, port , datum ):
        self. port  =  port
        self. datum  =  datum 

def  clone_port  ( s ):
    return  clone_string  ( s )

def  make_message  ( port , datum ):
    p  =  clone_string  ( port )
    m  =  Message  ( port = p , datum = datum . clone  ())
    return  m 

def  message_clone  ( message ):
    m  =  Message  ( port = clone_port  ( message . port ), datum = message . datum . clone  ())
    return  m 

def  destroy_message  ( msg ):
    pass

def  destroy_datum  ( msg ):
    pass

def  destroy_port  ( msg ):
    pass

def  format_message  ( m ):
    if  m  ==  None:
        return "ϕ"
    else:
        return  str("⟪") +  str( m . port ) +  str("⦂") +  str( m . datum . srepr  ()) + "⟫"    
    

drInject  = "inject"
drSend  = "send"
drInOut  = "inout"
drForward  = "forward"
drDown  = "down"
drUp  = "up"
drAcross  = "across"
drThrough  = "through"
def  make_Routing_Descriptor  ( action , component , port , message ):
    return {"action": action ,"component": component ,"port": port ,"message": message }

def  make_Send_Descriptor  ( component , port , message , cause_port , cause_message ):
    rdesc  =  make_Routing_Descriptor  ( action = drSend , component = component , port = port , message = message )
    return {"action": drSend ,"component": rdesc  [" component "],"port": rdesc  [" port "],"message": rdesc  [" message "],"cause_port": cause_port ,"cause_message": cause_message ,"fmt": fmt_send }

def  log_send  ( sender , sender_port , msg , cause_msg ):
    send_desc  =  make_Send_Descriptor  ( component = sender , port = sender_port , message = msg , cause_port = cause_msg . port , cause_message = cause_msg )
    append_routing_descriptor  ( container = sender . owner , desc = send_desc )

def  log_send_string  ( sender , sender_port , msg , cause_msg ):
    send_desc  =  make_Send_Descriptor  ( sender , sender_port , msg , cause_msg . port , cause_msg )
    append_routing_descriptor  ( container = sender . owner , desc = send_desc )

def  fmt_send  ( desc , indent ):
    return ""

def  fmt_send_string  ( desc , indent ):
    return  fmt_send  ( desc , indent )

def  make_Forward_Descriptor  ( component , port , message , cause_port , cause_message ):
    rdesc  =  make_Routing_Descriptor  ( action = drSend , component = component , port = port , message = message )
    fmt_forward  =  lambda  desc : ""
    return {"action": drForward ,"component": rdesc  [" component "],"port": rdesc  [" port "],"message": rdesc  [" message "],"cause_port": cause_port ,"cause_message": cause_message ,"fmt": fmt_forward }

def  log_forward  ( sender , sender_port , msg , cause_msg ):
    pass

def  fmt_forward  ( desc ):
    print  ( str("*** Error fmt_forward ") +  desc  )
    quit  ()

def  make_Inject_Descriptor  ( receiver , port , message ):
    rdesc  =  make_Routing_Descriptor  ( action = drInject , component = receiver , port = port , message = message )
    return {"action": drInject ,"component": rdesc  [" component "],"port": rdesc  [" port "],"message": rdesc  [" message "],"fmt": fmt_inject }

def  log_inject  ( receiver , port , msg ):
    inject_desc  =  make_Inject_Descriptor  ( receiver = receiver , port = port , message = msg )
    append_routing_descriptor  ( container = receiver , desc = inject_desc )

def  fmt_inject  ( desc , indent ):
    return  str("\n") +  str( indent ) +  str("⟹  ") +  str( desc  [" component "]. name ) +  str(".") +  str( desc  [" port "]) +  str(" ") +  format_message  ( desc  [" message "])       

def  make_Down_Descriptor  ( container , source_port , source_message , target , target_port , target_message ):
    return {"action": drDown ,"container": container ,"source_port": source_port ,"source_message": source_message ,"target": target ,"target_port": target_port ,"target_message": target_message ,"fmt": fmt_down }

def  log_down  ( container , source_port , source_message , target , target_port , target_message ):
    rdesc  =  make_Down_Descriptor  ( container , source_port , source_message , target , target_port , target_message )
    append_routing_descriptor  ( container , rdesc )

def  fmt_down  ( desc , indent ):
    return  str("\n") +  str( indent ) +  str(" ↓ ") +  str( desc  [" container "]. name ) +  str(".") +  str( desc  [" source_port "]) +  str(" ➔ ") +  str( desc  [" target "]. name ) +  str(".") +  str( desc  [" target_port "]) +  str(" ") +  format_message  ( desc  [" target_message "])           

def  make_Up_Descriptor  ( source , source_port , source_message , container , container_port , container_message ):
    return {"action": drUp ,"source": source ,"source_port": source_port ,"source_message": source_message ,"container": container ,"container_port": container_port ,"container_message": container_message ,"fmt": fmt_up }

def  log_up  ( source , source_port , source_message , container , target_port , target_message ):
    rdesc  =  make_Up_Descriptor  ( source , source_port , source_message , container , target_port , target_message )
    append_routing_descriptor  ( container , rdesc )

def  fmt_up  ( desc , indent ):
    return  str("\n") +  str( indent ) +  str("↑ ") +  str( desc  [" source "]. name ) +  str(".") +  str( desc  [" source_port "]) +  str(" ➔ ") +  str( desc  [" container "]. name ) +  str(".") +  str( desc  [" container_port "]) +  str(" ") +  format_message  ( desc  [" container_message "])           

def  make_Across_Descriptor  ( container , source , source_port , source_message , target , target_port , target_message ):
    return {"action": drAcross ,"container": container ,"source": source ,"source_port": source_port ,"source_message": source_message ,"target": target ,"target_port": target_port ,"target_message": target_message ,"fmt": fmt_across }

def  log_across  ( container , source , source_port , source_message , target , target_port , target_message ):
    rdesc  =  make_Across_Descriptor  ( container , source , source_port , source_message , target , target_port , target_message )
    append_routing_descriptor  ( container , rdesc )

def  fmt_across  ( desc , indent ):
    return  str("\n") +  str( indent ) +  str("→ ") +  str( desc  [" source "]. name ) +  str(".") +  str( desc  [" source_port "]) +  str(" ➔ ") +  str( desc  [" target "]. name ) +  str(".") +  str( desc  [" target_port "]) +  str("  ") +  format_message  ( desc  [" target_message "])           

def  make_Through_Descriptor  ( container , source_port , source_message , target_port , message ):
    return {"action": drThrough ,"container": container ,"source_port": source_port ,"source_message": source_message ,"target_port": target_port ,"message": message ,"fmt": fmt_through }

def  log_through  ( container , source_port , source_message , target_port , message ):
    rdesc  =  make_Through_Descriptor  ( container , source_port , source_message , target_port , message )
    append_routing_descriptor  ( container , rdesc )

def  fmt_through  ( desc , indent ):
    return  str("\n") +  str( indent ) +  str("⇶ ") +  str( desc  [" container "]. name ) +  str(".") +  str( desc  [" source_port "]) +  str(" ➔ ") +  str( desc  [" container "]. name ) +  str(".") +  str( desc  [" target_port "]) +  str(" ") +  format_message  ( desc  [" message "])           

def  make_InOut_Descriptor  ( container , component , in_message , out_port , out_message ):
    return {"action": drInOut ,"container": container ,"component": component ,"in_message": in_message ,"out_message": out_message ,"fmt": fmt_inout }

def  log_inout  ( container , component , in_message ):
    if  component . outq . empty  ():
        log_inout_no_output  ( container = container , component = component , in_message = in_message )
    else:
        log_inout_recursively  ( container = container , component = component , in_message = in_message , out_messages = list  ( component . outq . queue ))
    

def  log_inout_no_output  ( container , component , in_message ):
    rdesc  =  make_InOut_Descriptor  ( container = container , component = component , in_message = in_message , out_port = None, out_message = None)
    append_routing_descriptor  ( container , rdesc )

def  log_inout_single  ( container , component , in_message , out_message ):
    rdesc  =  make_InOut_Descriptor  ( container = container , component = component , in_message = in_message , out_port = None, out_message = out_message )
    append_routing_descriptor  ( container , rdesc )

def  log_inout_recursively  ( container , component , in_message , out_messages =[]):
    if [] ==  out_messages :
        pass
    else:
        m  =   out_messages [0]
        rest  =   out_messages [1:]
        log_inout_single  ( container = container , component = component , in_message = in_message , out_message = m )
        log_inout_recursively  ( container = container , component = component , in_message = in_message , out_messages = rest )
    

def  fmt_inout  ( desc , indent ):
    outm  =  desc  [" out_message "]
    if  None ==  outm :
        return  str("\n") +  str( indent ) + "  ⊥"  
    else:
        return  str("\n") +  str( indent ) +  str("  ∴ ") +  str( desc  [" component "]. name ) +  str(" ") +  format_message  ( outm )     
    

def  log_tick  ( container , component , in_message ):
    pass

def  routing_trace_all  ( container ):
    indent  = ""
    lis  =  list  ( container . routings . queue )
    return  recursive_routing_trace  ( container , lis , indent )

def  recursive_routing_trace  ( container , lis , indent ):
    if [] ==  lis :
        return ""
    else:
        desc  =  first  ( lis )
        formatted  =  desc  [" fmt "] ( desc , indent )
        return  formatted + recursive_routing_trace  ( container , rest  ( lis ), indent +"  ")
    

enumDown  = 0
enumAcross  = 1
enumUp  = 2
enumThrough  = 3
def  container_instantiator  ( reg , owner , container_name , desc ):
    global  enumDown ,  enumUp ,  enumAcross ,  enumThrough
    container  =  make_container  ( container_name , owner )
    children  = []
    children_by_id  = {}
    for  child_desc  in  desc  [" children "]:
        child_instance  =  get_component_instance  ( reg , child_desc  [" name "], container )
        children . append  ( child_instance )
        children_by_id  [ child_desc  [" id "]] =  child_instance 
    
    container . children  =  children
    me  =  container
    connectors  = []
    for  proto_conn  in  desc  [" connections "]:
        source_component  =  None
        target_component  =  None
        connector  =  Connector  ()
        if  proto_conn  [" dir "] ==  enumDown :
            connector . direction  = "down"
            connector . sender  =  Sender  ( me . name , me , proto_conn  [" source_port "])
            target_component  =  children_by_id  [ proto_conn  [" target "] [" id "]]
            if ( target_component  ==  None):
                load_error  ( str("internal error: .Down connection target internal error ") +  proto_conn  [" target "] )
            else:
                connector . receiver  =  Receiver  ( target_component . name , target_component . inq , proto_conn  [" target_port "], target_component )
                connectors . append  ( connector )
            
        elif  proto_conn  [" dir "] ==  enumAcross :
            connector . direction  = "across"
            source_component  =  children_by_id  [ proto_conn  [" source "] [" id "]]
            target_component  =  children_by_id  [ proto_conn  [" target "] [" id "]]
            if  source_component  ==  None:
                load_error  ( str("internal error: .Across connection source not ok ") +  proto_conn  [" source "] )
            else:
                connector . sender  =  Sender  ( source_component . name , source_component , proto_conn  [" source_port "])
                if  target_component  ==  None:
                    load_error  ( str("internal error: .Across connection target not ok ") +  proto_conn . target  )
                else:
                    connector . receiver  =  Receiver  ( target_component . name , target_component . inq , proto_conn  [" target_port "], target_component )
                    connectors . append  ( connector )
                
            
        elif  proto_conn  [" dir "] ==  enumUp :
            connector . direction  = "up"
            source_component  =  children_by_id  [ proto_conn  [" source "] [" id "]]
            if  source_component  ==  None:
                print  ( str("internal error: .Up connection source not ok ") +  proto_conn  [" source "] )
            else:
                connector . sender  =  Sender  ( source_component . name , source_component , proto_conn  [" source_port "])
                connector . receiver  =  Receiver  ( me . name , container . outq , proto_conn  [" target_port "], me )
                connectors . append  ( connector )
            
        elif  proto_conn  [" dir "] ==  enumThrough :
            connector . direction  = "through"
            connector . sender  =  Sender  ( me . name , me , proto_conn  [" source_port "])
            connector . receiver  =  Receiver  ( me . name , container . outq , proto_conn  [" target_port "], me )
            connectors . append  ( connector )
        
    
    container . connections  =  connectors
    return  container 

def  container_handler  ( container , message ):
    route  ( container = container , from_component = container , message = message )
    while  any_child_ready  ( container ):
        step_children  ( container , message )
    

def  destroy_container  ( eh ):
    pass

def  fifo_is_empty  ( fifo ):
    return  fifo . empty  ()

class  Connector :
    def __init__ (self):
        self. direction  =  None
        self. sender  =  None
        self. receiver  =  None

class  Sender :
    def __init__ (self, name , component , port ):
        self. name  =  name
        self. component  =  component
        self. port  =  port 

class  Receiver :
    def __init__ (self, name , queue , port , component ):
        self. name  =  name
        self. queue  =  queue
        self. port  =  port
        self. component  =  component 

def  sender_eq  ( s1 , s2 ):
    same_components  = ( s1 . component  ==  s2 . component )
    same_ports  = ( s1 . port  ==  s2 . port )
    return  same_components   and   same_ports 

def  deposit  ( parent , conn , message ):
    new_message  =  make_message  ( port = conn . receiver . port , datum = message . datum )
    log_connection  ( parent , conn , new_message )
    push_message  ( parent , conn . receiver . component , conn . receiver . queue , new_message )

def  force_tick  ( parent , eh ):
    tick_msg  =  make_message  (".", new_datum_tick  ())
    push_message  ( parent , eh , eh . inq , tick_msg )
    return  tick_msg 

def  push_message  ( parent , receiver , inq , m ):
    inq . put  ( m )
    parent . visit_ordering . put  ( receiver )

def  is_self  ( child , container ):
    return  child  ==  container 

def  step_child  ( child , msg ):
    before_state  =  child . state
    child . handler  ( child , msg )
    after_state  =  child . state
    return [ before_state  == "idle"  and   after_state !="idle",  before_state !="idle"  and   after_state !="idle",  before_state !="idle"  and   after_state  == "idle"]

def  save_message  ( eh , msg ):
    eh . saved_messages . put  ( msg )

def  fetch_saved_message_and_clear  ( eh ):
    return  eh . saved_messages . get  ()

def  step_children  ( container , causingMessage ):
    container . state  = "idle"
    for  child  in  list  ( container . visit_ordering . queue ):
        if (not ( is_self  ( child , container ))):
            if (not ( child . inq . empty  ())):
                msg  =  child . inq . get  ()
                [ began_long_run ,  continued_long_run ,  ended_long_run ] =  step_child  ( child , msg )
                if  began_long_run :
                    save_message  ( child , msg )
                elif  continued_long_run :
                    pass
                elif  ended_long_run :
                    log_inout  ( container = container , component = child , in_message = fetch_saved_message_and_clear  ( child ))
                else:
                    log_inout  ( container = container , component = child , in_message = msg )
                
                destroy_message  ( msg )
            else:
                if  child . state !="idle":
                    msg  =  force_tick  ( container , child )
                    child . handler  ( child , msg )
                    log_tick  ( container = container , component = child , in_message = msg )
                    destroy_message  ( msg )
                
            
            if  child . state  == "active":
                container . state  = "active"
            
            while (not ( child . outq . empty  ())):
                msg  =  child . outq . get  ()
                route  ( container , child , msg )
                destroy_message  ( msg )
            
        
    

def  attempt_tick  ( parent , eh ):
    if  eh . state !="idle":
        force_tick  ( parent , eh )
    

def  is_tick  ( msg ):
    return "tick" ==  msg . datum . kind  ()

def  route  ( container , from_component , message ):
    was_sent  =  False
    fromname  = ""
    if  is_tick  ( message ):
        for  child  in  container . children :
            attempt_tick  ( container , child , message )
        
        was_sent  =  True
    else:
        if (not ( is_self  ( from_component , container ))):
            fromname  =  from_component . name 
        
        from_sender  =  Sender  ( name = fromname , component = from_component , port = message . port )
        for  connector  in  container . connections :
            if  sender_eq  ( from_sender , connector . sender ):
                deposit  ( container , connector , message )
                was_sent  =  True
            
        
    
    if not ( was_sent ):
        print  ("\n\n*** Error: ***")
        dump_possible_connections  ( container )
        print_routing_trace  ( container )
        print  ("***")
        print  ( str( container . name ) +  str(": message ;") +  str( message . port ) +  str("' from ") +  str( fromname ) + " dropped on floor..."     )
        print  ("***")
        exit  ()
    

def  dump_possible_connections  ( container ):
    print  ( str("*** possible connections for ") +  str( container . name ) + ":"  )
    for  connector  in  container . connections :
        print  ( str( connector . direction ) +  str(" ") +  str( connector . sender . name ) +  str(".") +  str( connector . sender . port ) +  str(" -> ") +  str( connector . receiver . name ) +  str(".") +  connector . receiver . port         )
    

def  any_child_ready  ( container ):
    for  child  in  container . children :
        if  child_is_ready  ( child ):
            return  True
        
    
    return  False

def  child_is_ready  ( eh ):
    return (not ( eh . outq . empty  ()))  or  (not ( eh . inq . empty  ()))  or  ( eh . state !="idle")  or  ( any_child_ready  ( eh ))

def  print_routing_trace  ( eh ):
    print  ( routing_trace_all  ( eh ))

def  append_routing_descriptor  ( container , desc ):
    container . routings . put  ( desc )

def  log_connection  ( container , connector , message ):
    if "down" ==  connector . direction :
        log_down  ( container = container , source_port = connector . sender . port , source_message = None, target = connector . receiver . component , target_port = connector . receiver . port , target_message = message )
    elif "up" ==  connector . direction :
        log_up  ( source = connector . sender . component , source_port = connector . sender . port , source_message = None, container = container , target_port = connector . receiver . port , target_message = message )
    elif "across" ==  connector . direction :
        log_across  ( container = container , source = connector . sender . component , source_port = connector . sender . port , source_message = None, target = connector . receiver . component , target_port = connector . receiver . port , target_message = message )
    elif "through" ==  connector . direction :
        log_through  ( container = container , source_port = connector . sender . port , source_message = None, target_port = connector . receiver . port , message = message )
    else:
        print  ( str("*** FATAL error: in log_connection /") +  str( connector . direction ) +  str("/ /") +  str( message . port ) +  str("/ /") +  str( message . datum . srepr  ()) + "/"      )
        exit  ()
    

def  container_injector  ( container , message ):
    log_inject  ( receiver = container , port = message . port , msg = message )
    container_handler  ( container , message )

import  os
import  json
import  sys
class  Component_Registry :
    def __init__ (self):
        self. templates  = {}

class  Template :
    def __init__ (self, name , template_data , instantiator ):
        self. name  =  name
        self. template_data  =  template_data
        self. instantiator  =  instantiator 

def  read_and_convert_json_file  ( filename ):
    try:
    
        fil  =  open  ( filename ,"r")
        json_data  =  fil . read  ()
        routings  =  json . loads  ( json_data )
        fil . close  ()
        return  routings 
    except  FileNotFoundError :
        print  ( str("File not found: ") +  filename  )
        return  None
    except  json . JSONDecodeError  as  e :
        print  ( str("Error decoding JSON in file: ") +  e  )
        return  None
    

def  json2internal  ( container_xml ):
    fname  =  os . path . basename  ( container_xml )
    routings  =  read_and_convert_json_file  ( fname )
    return  routings 

def  delete_decls  ( d ):
    pass

def  make_component_registry  ():
    return  Component_Registry  ()

def  register_component  ( reg , template , ok_to_overwrite = False):
    name  =  mangle_name  ( template . name )
    if  name   in   reg . templates   and  not  ok_to_overwrite :
        load_error  ( str("Component ") +  str( template . name ) + " already declared"  )
    
    reg . templates  [ name ] =  template
    return  reg 

def  register_multiple_components  ( reg , templates ):
    for  template  in  templates :
        register_component  ( reg , template )
    

def  get_component_instance  ( reg , full_name , owner ):
    template_name  =  mangle_name  ( full_name )
    if  template_name   in   reg . templates :
        template  =  reg . templates  [ template_name ]
        if ( template  ==  None):
            load_error  ( str("Registry Error: Can't find component ") +  str( template_name ) + " (does it need to be declared in components_to_include_in_project?"  )
            return  None
        else:
            owner_name  = ""
            instance_name  =  template_name
            if  None!= owner :
                owner_name  =  owner . name
                instance_name  =  str( owner_name ) +  str(".") +  template_name   
            else:
                instance_name  =  template_name 
            
            instance  =  template . instantiator  ( reg , owner , instance_name , template . template_data )
            instance . depth  =  calculate_depth  ( instance )
            return  instance 
        
    else:
        load_error  ( str("Registry Error: Can't find component ") +  str( template_name ) + " (does it need to be declared in components_to_include_in_project?"  )
        return  None
    

def  calculate_depth  ( eh ):
    if  eh . owner  ==  None:
        return 0
    else:
        return 1+ calculate_depth  ( eh . owner )
    

def  dump_registry  ( reg ):
    print  ()
    print  ("*** PALETTE ***")
    for  c  in  reg . templates :
        print  ( c . name )
    
    print  ("***************")
    print  ()

def  print_stats  ( reg ):
    print  ( str("registry statistics: ") +  reg . stats  )

def  mangle_name  ( s ):
    return  s 

import  subprocess
def  generate_shell_components  ( reg , container_list ):
    if  None!= container_list :
        for  diagram  in  container_list :
            for  child_descriptor  in  diagram  [" children "]:
                if  first_char_is  ( child_descriptor  [" name "],"$"):
                    name  =  child_descriptor  [" name "]
                    cmd  =   name [1:] . strip  ()
                    generated_leaf  =  Template  ( name = name , instantiator = shell_out_instantiate , template_data = cmd )
                    register_component  ( reg , generated_leaf )
                elif  first_char_is  ( child_descriptor  [" name "],"'"):
                    name  =  child_descriptor  [" name "]
                    s  =   name [1:]
                    generated_leaf  =  Template  ( name = name , instantiator = string_constant_instantiate , template_data = s )
                    register_component  ( reg , generated_leaf , ok_to_overwrite = True)
                
            
        
    

def  first_char  ( s ):
    return   s [0] 

def  first_char_is  ( s , c ):
    return  c  ==  first_char  ( s )

def  run_command  ( eh , cmd , s ):
    ret  =  subprocess . run  ( cmd , capture_output = True, input = s , encoding ="UTF_8")
    if not ( ret . returncode  == 0):
        if  ret . stderr != None:
            return ["",  ret . stderr ]
        else:
            return ["",  str("error in shell_out ") +  ret . returncode  ]
        
    else:
        return [ ret . stdout ,  None]
    

import  queue
import  sys
class  Eh :
    def __init__ (self):
        self. name  = ""
        self. inq  =  queue . Queue  ()
        self. outq  =  queue . Queue  ()
        self. owner  =  None
        self. saved_messages  =  queue . LifoQueue  ()
        self. inject  =  injector_NIY
        self. children  = []
        self. visit_ordering  =  queue . Queue  ()
        self. connections  = []
        self. routings  =  queue . Queue  ()
        self. handler  =  None
        self. instance_data  =  None
        self. state  = "idle"
        self. kind  =  None
        self. trace  =  False
        self. depth  = 0

def  make_container  ( name , owner ):
    eh  =  Eh  ()
    eh . name  =  name
    eh . owner  =  owner
    eh . handler  =  container_handler
    eh . inject  =  container_injector
    eh . state  = "idle"
    eh . kind  = "container"
    return  eh 

def  make_leaf  ( name , owner , instance_data , handler ):
    eh  =  Eh  ()
    eh . name  =  str( owner . name ) +  str(".") +  name
    eh . owner  =  owner
    eh . handler  =  handler
    eh . instance_data  =  instance_data
    eh . state  = "idle"
    eh . kind  = "leaf"
    return  eh 

def  send  ( eh , port , datum , causingMessage ):
    msg  =  make_message  ( port , datum )
    log_send  ( sender = eh , sender_port = port , msg = msg , cause_msg = causingMessage )
    put_output  ( eh , msg )

def  send_string  ( eh , port , s , causingMessage ):
    datum  =  new_datum_string  ( s )
    msg  =  make_message  ( port = port , datum = datum )
    log_send_string  ( sender = eh , sender_port = port , msg = msg , cause_msg = causingMessage )
    put_output  ( eh , msg )

def  forward  ( eh , port , msg ):
    fwdmsg  =  make_message  ( port , msg . datum )
    log_forward  ( sender = eh , sender_port = port , msg = msg , cause_msg = msg )
    put_output  ( eh , msg )

def  inject  ( eh , msg ):
    eh . inject  ( eh , msg )

def  output_list  ( eh ):
    return  eh . outq 

def  print_output_list  ( eh ):
    for  m  in  list  ( eh . outq . queue ):
        print  ( format_message  ( m ))
    

def  spaces  ( n ):
    s  = ""
    for  i  in  range ( n ):
        s  =  s +" "
    
    return  s 

def  set_active  ( eh ):
    eh . state  = "active"

def  set_idle  ( eh ):
    eh . state  = "idle"

def  fetch_first_output  ( eh , port ):
    for  msg  in  list  ( eh . outq . queue ):
        if ( msg . port  ==  port ):
            return  msg . datum 
        
    
    return  None

def  print_specific_output  ( eh , port ="", stderr = False):
    datum  =  fetch_first_output  ( eh , port )
    outf  =  None
    if  datum != None:
        if  stderr :
            outf  =  sys . stderr 
        else:
            outf  =  sys . stdout 
        
        print  ( datum . srepr  (), file = outf )
    

def  put_output  ( eh , msg ):
    eh . outq . put  ( msg )

def  injector_NIY  ( eh , msg ):
    print  ( str("Injector not implemented for this component ") +  str( eh . name ) +  str(" kind ∷ ") +  str( eh . kind ) +  str(",  port ∷ ") +  msg . port      )
    exit  ()

import  sys
import  re
import  subprocess
import  shlex
root_project  = ""
root_0D  = ""
def  set_environment  ( rproject , r0D ):
    global  root_project
    global  root_0D
    root_project  =  rproject
    root_0D  =  r0D 

def  probe_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("?")
    return  make_leaf  ( name = name_with_id , owner = owner , instance_data = None, handler = probe_handler )

def  probeA_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("?A")
    return  make_leaf  ( name = name_with_id , owner = owner , instance_data = None, handler = probe_handler )

def  probeB_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("?B")
    return  make_leaf  ( name = name_with_id , owner = owner , instance_data = None, handler = probe_handler )

def  probeC_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("?C")
    return  make_leaf  ( name = name_with_id , owner = owner , instance_data = None, handler = probe_handler )

def  probe_handler  ( eh , msg ):
    s  =  msg . datum . srepr  ()
    print  ( str("... probe ") +  str( eh . name ) +  str(": ") +  s    , file = sys . stderr )

def  trash_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("trash")
    return  make_leaf  ( name = name_with_id , owner = owner , instance_data = None, handler = trash_handler )

def  trash_handler  ( eh , msg ):
    pass

class  TwoMessages :
    def __init__ (self, first , second ):
        self. first  =  first
        self. second  =  second 

class  Deracer_Instance_Data :
    def __init__ (self, state , buffer ):
        self. state  =  state
        self. buffer  =  buffer 

def  reclaim_Buffers_from_heap  ( inst ):
    pass

def  deracer_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("deracer")
    inst  =  Deracer_Instance_Data  ("idle", TwoMessages  ( None, None))
    inst . state  = "idle"
    eh  =  make_leaf  ( name = name_with_id , owner = owner , instance_data = inst , handler = deracer_handler )
    return  eh 

def  send_first_then_second  ( eh , inst ):
    forward  ( eh ,"1", inst . buffer . first )
    forward  ( eh ,"2", inst . buffer . second )
    reclaim_Buffers_from_heap  ( inst )

def  deracer_handler  ( eh , msg ):
    inst  =  eh . instance_data
    if  inst . state  == "idle":
        if "1" ==  msg . port :
            inst . buffer . first  =  msg
            inst . state  = "waitingForSecond"
        elif "2" ==  msg . port :
            inst . buffer . second  =  msg
            inst . state  = "waitingForFirst"
        else:
            runtime_error  ( str("bad msg.port (case A) for deracer ") +  msg . port  )
        
    elif  inst . state  == "waitingForFirst":
        if "1" ==  msg . port :
            inst . buffer . first  =  msg
            send_first_then_second  ( eh , inst )
            inst . state  = "idle"
        else:
            runtime_error  ( str("bad msg.port (case B) for deracer ") +  msg . port  )
        
    elif  inst . state  == "waitingForSecond":
        if "2" ==  msg . port :
            inst . buffer . second  =  msg
            send_first_then_second  ( eh , inst )
            inst . state  = "idle"
        else:
            runtime_error  ( str("bad msg.port (case C) for deracer ") +  msg . port  )
        
    else:
        runtime_error  ("bad state for deracer {eh.state}")
    

def  low_level_read_text_file_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("Low Level Read Text File")
    return  make_leaf  ( name_with_id , owner , None, low_level_read_text_file_handler )

def  low_level_read_text_file_handler  ( eh , msg ):
    fname  =  msg . datum . srepr  ()
    try:
    
        f  =  open  ( fname )
    except  Exception  as  e :
        f  =  None
    
    if  f != None:
        data  =  f . read  ()
        if  data != None:
            send_string  ( eh ,"", data , msg )
        else:
            emsg  =  str("read error on file ") +  fname
            send_string  ( eh ,"✗", emsg , msg )
        
        f . close  ()
    else:
        emsg  =  str("open error on file ") +  fname
        send_string  ( eh ,"✗", emsg , msg )
    

def  ensure_string_datum_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("Ensure String Datum")
    return  make_leaf  ( name_with_id , owner , None, ensure_string_datum_handler )

def  ensure_string_datum_handler  ( eh , msg ):
    if "string" ==  msg . datum . kind  ():
        forward  ( eh ,"", msg )
    else:
        emsg  =  str("*** ensure: type error (expected a string datum) but got ") +  msg . datum
        send_string  ( eh ,"✗", emsg , msg )
    

class  Syncfilewrite_Data :
    def __init__ (self):
        self. filename  = ""

def  syncfilewrite_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("syncfilewrite")
    inst  =  Syncfilewrite_Data  ()
    return  make_leaf  ( name_with_id , owner , inst , syncfilewrite_handler )

def  syncfilewrite_handler  ( eh , msg ):
    inst  =  eh . instance_data
    if "filename" ==  msg . port :
        inst . filename  =  msg . datum . srepr  ()
    elif "input" ==  msg . port :
        contents  =  msg . datum . srepr  ()
        f  =  open  ( inst . filename ,"w")
        if  f != None:
            f . write  ( msg . datum . srepr  ())
            f . close  ()
            send  ( eh ,"done", new_datum_bang  (), msg )
        else:
            send_string  ( eh ,"✗", str("open error on file ") +  inst . filename  , msg )
        
    

class  StringConcat_Instance_Data :
    def __init__ (self):
        self. buffer1  =  None
        self. buffer2  =  None
        self. count  = 0

def  stringconcat_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("stringconcat")
    instp  =  StringConcat_Instance_Data  ()
    return  make_leaf  ( name_with_id , owner , instp , stringconcat_handler )

def  stringconcat_handler  ( eh , msg ):
    inst  =  eh . instance_data
    if "1" ==  msg . port :
        inst . buffer1  =  clone_string  ( msg . datum . srepr  ())
        inst . count  =  inst . count +1
        maybe_stringconcat  ( eh , inst , msg )
    elif "2" ==  msg . port :
        inst . buffer2  =  clone_string  ( msg . datum . srepr  ())
        inst . count  =  inst . count +1
        maybe_stringconcat  ( eh , inst , msg )
    else:
        runtime_error  ( str("bad msg.port for stringconcat: ") +  msg . port  )
    

def  maybe_stringconcat  ( eh , inst , msg ):
    if (0 ==  len  ( inst . buffer1 ))  and  (0 ==  len  ( inst . buffer2 )):
        runtime_error  ("something is wrong in stringconcat, both strings are 0 length")
    
    if  inst . count  >= 2:
        concatenated_string  = ""
        if 0 ==  len  ( inst . buffer1 ):
            concatenated_string  =  inst . buffer2 
        elif 0 ==  len  ( inst . buffer2 ):
            concatenated_string  =  inst . buffer1 
        else:
            concatenated_string  =  inst . buffer1 + inst . buffer2 
        
        send_string  ( eh ,"", concatenated_string , msg )
        inst . buffer1  =  None
        inst . buffer2  =  None
        inst . count  = 0
    

def  shell_out_instantiate  ( reg , owner , name , template_data ):
    name_with_id  =  gensym  ("shell_out")
    cmd  =  shlex . split  ( template_data )
    return  make_leaf  ( name_with_id , owner , cmd , shell_out_handler )

def  shell_out_handler  ( eh , msg ):
    cmd  =  eh . instance_data
    s  =  msg . datum . srepr  ()
    [ stdout ,  stderr ] =  run_command  ( eh , cmd , s )
    if  stderr != None:
        send_string  ( eh ,"✗", stderr , msg )
    else:
        send_string  ( eh ,"", stdout , msg )
    

def  string_constant_instantiate  ( reg , owner , name , template_data ):
    global  root_project
    global  root_0D
    name_with_id  =  gensym  ("strconst")
    s  =  template_data
    if  root_project !="":
        s  =  re . sub  ("_00_", root_project , s )
    
    if  root_0D !="":
        s  =  re . sub  ("_0D_", root_0D , s )
    
    return  make_leaf  ( name_with_id , owner , s , string_constant_handler )

def  string_constant_handler  ( eh , msg ):
    s  =  eh . instance_data
    send_string  ( eh ,"", s , msg )

def  string_make_persistent  ( s ):
    return  s 

def  string_clone  ( s ):
    return  s 

import  sys
def  parse_command_line_args  ():
    global  root_project
    global  root_0D
    if ( len  ( sys . argv ) < (5+1)):
        load_error  ("usage: ${_00_} ${_0D_} app <arg> <main tab name> <diagram file name 1> ...")
        return  None
    else:
        root_project  =  sys.argv[1]
        root_0D  =  sys.argv[2]
        arg  =  sys.argv[3]
        main_container_name  =  sys.argv[4]
        diagram_source_files  =  sys.argv[5:]
        return [ root_project ,  root_0D ,  arg ,  main_container_name ,  diagram_source_files ]
    

def  initialize_component_palette  ( root_project , root_0D , diagram_source_files , project_specific_components_subroutine ):
    reg  =  make_component_registry  ()
    for  diagram_source  in  diagram_source_files :
        all_containers_within_single_file  =  json2internal  ( diagram_source )
        generate_shell_components  ( reg , all_containers_within_single_file )
        for  container  in  all_containers_within_single_file :
            register_component  ( reg , Template  ( name = container  [" name "], template_data = container , instantiator = container_instantiator ))
        
    
    initialize_stock_components  ( reg )
    project_specific_components_subroutine  ( root_project , root_0D , reg )
    return  reg 

def  print_error_maybe  ( main_container ):
    error_port  = "✗"
    err  =  fetch_first_output  ( main_container , error_port )
    if ( err != None)  and  (0 <  len  ( trimws  ( err . srepr  ()))):
        print  ("___ !!! ERRORS !!! ___")
        print_specific_output  ( main_container , error_port , False)
    

def  dump_outputs  ( main_container ):
    print  ()
    print  ("___ Outputs ___")
    print_output_list  ( main_container )

def  trace_outputs  ( main_container ):
    print  ()
    print  ("___ Message Traces ___")
    print_routing_trace  ( main_container )

def  dump_hierarchy  ( main_container ):
    print  ()
    print  ( str("___ Hierarchy ___") + ( build_hierarchy  ( main_container )) )

def  build_hierarchy  ( c ):
    s  = ""
    for  child  in  c . children :
        s  =  str( s ) +  build_hierarchy  ( child ) 
    
    indent  = ""
    for  i  in  range ( c . depth ):
        indent  =  indent +"  "
    
    return  str("\n") +  str( indent ) +  str("(") +  str( c . name ) +  str( s ) + ")"     

def  dump_connections  ( c ):
    print  ()
    print  ("___ connections ___")
    dump_possible_connections  ( c )
    for  child  in  c . children :
        print  ()
        dump_possible_connections  ( child )
    

def  trimws  ( s ):
    return  s . strip  ()

def  clone_string  ( s ):
    return  s 

load_errors  =  False
runtime_errors  =  False
def  load_error  ( s ):
    global  load_errors
    print  ( s )
    quit  ()
    load_errors  =  True

def  runtime_error  ( s ):
    global  runtime_errors
    print  ( s )
    quit  ()
    runtime_errors  =  True

def  fakepipename_instantiate  ( reg , owner , name , template_data ):
    instance_name  =  gensym  ("fakepipe")
    return  make_leaf  ( instance_name , owner , None, fakepipename_handler )

rand  = 0
def  fakepipename_handler  ( eh , msg ):
    global  rand
    rand  =  rand +1
    send_string  ( eh ,"", str("/tmp/fakepipe") +  rand  , msg )

class  OhmJS_Instance_Data :
    def __init__ (self):
        self. pathname_0D_  =  None
        self. grammar_name  =  None
        self. grammar_filename  =  None
        self. semantics_filename  =  None
        self. s  =  None

def  ohmjs_instantiate  ( reg , owner , name , template_data ):
    instance_name  =  gensym  ("OhmJS")
    inst  =  OhmJS_Instance_Data  ()
    return  make_leaf  ( instance_name , owner , inst , ohmjs_handle )

def  ohmjs_maybe  ( eh , inst , causingMsg ):
    if  None!= inst . pathname_0D_   and   None!= inst . grammar_name   and   None!= inst . grammar_filename   and   None!= inst . semantics_filename   and   None!= inst . s :
        cmd  = [ str( inst . pathname_0D_ ) + "/std/ohmjs.js" , inst . grammar_name , inst . grammar_filename , inst . semantics_filename ]
        [ captured_output , err ] =  run_command  ( eh , cmd , inst . s )
        if  err  ==  None:
            err  = ""
        
        errstring  =  trimws  ( err )
        if  len  ( errstring ) == 0:
            send_string  ( eh ,"", trimws  ( captured_output ), causingMsg )
        else:
            send_string  ( eh ,"✗", errstring , causingMsg )
        
        inst . pathname_0D_  =  None
        inst . grammar_name  =  None
        inst . grammar_filename  =  None
        inst . semantics_filename  =  None
        inst . s  =  None
    

def  ohmjs_handle  ( eh , msg ):
    inst  =  eh . instance_data
    if  msg . port  == "0D path":
        inst . pathname_0D_  =  clone_string  ( msg . datum . srepr  ())
        ohmjs_maybe  ( eh , inst , msg )
    elif  msg . port  == "grammar name":
        inst . grammar_name  =  clone_string  ( msg . datum . srepr  ())
        ohmjs_maybe  ( eh , inst , msg )
    elif  msg . port  == "grammar":
        inst . grammar_filename  =  clone_string  ( msg . datum . srepr  ())
        ohmjs_maybe  ( eh , inst , msg )
    elif  msg . port  == "semantics":
        inst . semantics_filename  =  clone_string  ( msg . datum . srepr  ())
        ohmjs_maybe  ( eh , inst , msg )
    elif  msg . port  == "input":
        inst . s  =  clone_string  ( msg . datum . srepr  ())
        ohmjs_maybe  ( eh , inst , msg )
    else:
        emsg  =  str("!!! ERROR: OhmJS got an illegal message port ") +  msg . port
        send_string  ( eh ,"✗", emsg , msg )
    

def  initialize_stock_components  ( reg ):
    register_component  ( reg , Template  ("1then2", None, deracer_instantiate ))
    register_component  ( reg , Template  ("?", None, probe_instantiate ))
    register_component  ( reg , Template  ("?A", None, probeA_instantiate ))
    register_component  ( reg , Template  ("?B", None, probeB_instantiate ))
    register_component  ( reg , Template  ("?C", None, probeC_instantiate ))
    register_component  ( reg , Template  ("trash", None, trash_instantiate ))
    register_component  ( reg , Template  ("Low Level Read Text File", None, low_level_read_text_file_instantiate ))
    register_component  ( reg , Template  ("Ensure String Datum", None, ensure_string_datum_instantiate ))
    register_component  ( reg , Template  ("syncfilewrite", None, syncfilewrite_instantiate ))
    register_component  ( reg , Template  ("stringconcat", None, stringconcat_instantiate ))
    register_component  ( reg , Template  ("fakepipename", None, fakepipename_instantiate ))
    register_component  ( reg , Template  ("OhmJS", None, ohmjs_instantiate ))

def  run  ( pregistry , root_project , root_0D , arg , main_container_name , diagram_source_files , injectfn , show_hierarchy = True, show_connections = True, show_traces = True, show_all_outputs = True):
    set_environment  ( root_project , root_0D )
    main_container  =  get_component_instance  ( pregistry , main_container_name , owner = None)
    if  None ==  main_container :
        load_error  ( str("Couldn't find container with page name ") +  str( main_container_name ) +  str(" in files ") +  str( diagram_source_files ) + " (check tab names, or disable compression?)"    )
    
    if  show_hierarchy :
        dump_hierarchy  ( main_container )
    
    if  show_connections :
        dump_connections  ( main_container )
    
    if not  load_errors :
        injectfn  ( root_project , root_0D , arg , main_container )
    
    if  show_all_outputs :
        dump_outputs  ( main_container )
    else:
        print_error_maybe  ( main_container )
        print_specific_output  ( main_container , port ="", stderr = False)
    
    if  show_traces :
        print  ("___ routing traces ___")
        print  ( routing_trace_all  ( main_container ))
    
    if  show_all_outputs :
        print  ("___ done ___")
    





