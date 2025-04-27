
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
                    name = gensymbol (mangle_name ( child_descriptor [ "name"]))#line 23
                    arg =  child_descriptor [ "name"]  #line 24
                    generated_leaf = mkTemplate ( name, child_descriptor, arg, external_instantiate)#line 25
                    register_component ( reg, generated_leaf)#line 26#line 27#line 28#line 29#line 30
    return  reg                                        #line 31#line 32#line 33

def first_char (s):                                    #line 34
    return   s[0]                                      #line 35#line 36#line 37

def first_char_is (s,c):                               #line 38
    return  c == first_char ( s)                       #line 39#line 40#line 41
                                                       #line 42
def probe_instantiate (reg,owner,name,template_data,arg):#line 1
    name_with_id = gensymbol ( "?A")                   #line 2
    return make_leaf ( name_with_id, owner, None, "", probe_handler)#line 3#line 4#line 5

def probe_handler (eh,mev):                            #line 6
    global ticktime                                    #line 7
    s =  mev.datum.v                                   #line 8
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.arg) +  str( ": ") + str ( s)      )#line 15#line 16#line 17

def trash_instantiate (reg,owner,name,template_data,arg):#line 18
    name_with_id = gensymbol ( "trash")                #line 19
    return make_leaf ( name_with_id, owner, None, "", trash_handler)#line 20#line 21#line 22

def trash_handler (eh,mev):                            #line 23
    # to appease dumped_on_floor checker               #line 24
    pass                                               #line 25#line 26

class TwoMevents:
    def __init__ (self,):                              #line 27
        self.firstmev =  None                          #line 28
        self.secondmev =  None                         #line 29#line 30
                                                       #line 31
# Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev }#line 32
class Deracer_Instance_Data:
    def __init__ (self,):                              #line 33
        self.state =  None                             #line 34
        self.buffer =  None                            #line 35#line 36
                                                       #line 37
def reclaim_Buffers_from_heap (inst):                  #line 38
    pass                                               #line 39#line 40#line 41

def deracer_instantiate (reg,owner,name,template_data,arg):#line 42
    name_with_id = gensymbol ( "deracer")              #line 43
    inst =  Deracer_Instance_Data ()                   #line 44
    inst.state =  "idle"                               #line 45
    inst.buffer =  TwoMevents ()                       #line 46
    eh = make_leaf ( name_with_id, owner, inst, "", deracer_handler)#line 47
    return  eh                                         #line 48#line 49#line 50

def send_firstmev_then_secondmev (eh,inst):            #line 51
    forward ( eh, "1", inst.buffer.firstmev)           #line 52
    forward ( eh, "2", inst.buffer.secondmev)          #line 53
    reclaim_Buffers_from_heap ( inst)                  #line 54#line 55#line 56

def deracer_handler (eh,mev):                          #line 57
    inst =  eh.instance_data                           #line 58
    if  inst.state ==  "idle":                         #line 59
        if  "1" ==  mev.port:                          #line 60
            inst.buffer.firstmev =  mev                #line 61
            inst.state =  "waitingForSecondmev"        #line 62
        elif  "2" ==  mev.port:                        #line 63
            inst.buffer.secondmev =  mev               #line 64
            inst.state =  "waitingForFirstmev"         #line 65
        else:                                          #line 66
            runtime_error ( str( "bad mev.port (case A) for deracer ") +  mev.port )#line 67#line 68
    elif  inst.state ==  "waitingForFirstmev":         #line 69
        if  "1" ==  mev.port:                          #line 70
            inst.buffer.firstmev =  mev                #line 71
            send_firstmev_then_secondmev ( eh, inst)   #line 72
            inst.state =  "idle"                       #line 73
        else:                                          #line 74
            runtime_error ( str( "bad mev.port (case B) for deracer ") +  mev.port )#line 75#line 76
    elif  inst.state ==  "waitingForSecondmev":        #line 77
        if  "2" ==  mev.port:                          #line 78
            inst.buffer.secondmev =  mev               #line 79
            send_firstmev_then_secondmev ( eh, inst)   #line 80
            inst.state =  "idle"                       #line 81
        else:                                          #line 82
            runtime_error ( str( "bad mev.port (case C) for deracer ") +  mev.port )#line 83#line 84
    else:                                              #line 85
        runtime_error ( "bad state for deracer {eh.state}")#line 86#line 87#line 88#line 89

def low_level_read_text_file_instantiate (reg,owner,name,template_data,arg):#line 90
    name_with_id = gensymbol ( "Low Level Read Text File")#line 91
    return make_leaf ( name_with_id, owner, None, "", low_level_read_text_file_handler)#line 92#line 93#line 94

def low_level_read_text_file_handler (eh,mev):         #line 95
    fname =  mev.datum.v                               #line 96

    try:
        f = open (fname)
    except Exception as e:
        f = None
    if f != None:
        data = f.read ()
        if data!= None:
            send (eh, "", data, mev)
        else:
            send (eh, "✗", f"read error on file '{fname}'", mev)
        f.close ()
    else:
        send (eh, "✗", f"open error on file '{fname}'", mev)
                                                       #line 97#line 98#line 99

def ensure_string_datum_instantiate (reg,owner,name,template_data,arg):#line 100
    name_with_id = gensymbol ( "Ensure String Datum")  #line 101
    return make_leaf ( name_with_id, owner, None, "", ensure_string_datum_handler)#line 102#line 103#line 104

def ensure_string_datum_handler (eh,mev):              #line 105
    if  "string" ==  mev.datum.kind ():                #line 106
        forward ( eh, "", mev)                         #line 107
    else:                                              #line 108
        emev =  str( "*** ensure: type error (expected a string datum) but got ") +  mev.datum #line 109
        send ( eh, "✗", emev, mev)                     #line 110#line 111#line 112#line 113

class Syncfilewrite_Data:
    def __init__ (self,):                              #line 114
        self.filename =  ""                            #line 115#line 116
                                                       #line 117
# temp copy for bootstrap, sends "done“ (error during bootstrap if not wired)#line 118
def syncfilewrite_instantiate (reg,owner,name,template_data,arg):#line 119
    name_with_id = gensymbol ( "syncfilewrite")        #line 120
    inst =  Syncfilewrite_Data ()                      #line 121
    return make_leaf ( name_with_id, owner, inst, "", syncfilewrite_handler)#line 122#line 123#line 124

def syncfilewrite_handler (eh,mev):                    #line 125
    inst =  eh.instance_data                           #line 126
    if  "filename" ==  mev.port:                       #line 127
        inst.filename =  mev.datum.v                   #line 128
    elif  "input" ==  mev.port:                        #line 129
        contents =  mev.datum.v                        #line 130
        f = open ( inst.filename, "w")                 #line 131
        if  f!= None:                                  #line 132
            f.write ( mev.datum.v)                     #line 133
            f.close ()                                 #line 134
            send ( eh, "done",new_datum_bang (), mev)  #line 135
        else:                                          #line 136
            send ( eh, "✗", str( "open error on file ") +  inst.filename , mev)#line 137#line 138#line 139#line 140#line 141

class StringConcat_Instance_Data:
    def __init__ (self,):                              #line 142
        self.buffer1 =  None                           #line 143
        self.buffer2 =  None                           #line 144#line 145
                                                       #line 146
def stringconcat_instantiate (reg,owner,name,template_data,arg):#line 147
    name_with_id = gensymbol ( "stringconcat")         #line 148
    instp =  StringConcat_Instance_Data ()             #line 149
    return make_leaf ( name_with_id, owner, instp, "", stringconcat_handler)#line 150#line 151#line 152

def stringconcat_handler (eh,mev):                     #line 153
    inst =  eh.instance_data                           #line 154
    if  "1" ==  mev.port:                              #line 155
        inst.buffer1 = clone_string ( mev.datum.v)     #line 156
        maybe_stringconcat ( eh, inst, mev)            #line 157
    elif  "2" ==  mev.port:                            #line 158
        inst.buffer2 = clone_string ( mev.datum.v)     #line 159
        maybe_stringconcat ( eh, inst, mev)            #line 160
    elif  "reset" ==  mev.port:                        #line 161
        inst.buffer1 =  None                           #line 162
        inst.buffer2 =  None                           #line 163
    else:                                              #line 164
        runtime_error ( str( "bad mev.port for stringconcat: ") +  mev.port )#line 165#line 166#line 167#line 168

def maybe_stringconcat (eh,inst,mev):                  #line 169
    if  inst.buffer1!= None and  inst.buffer2!= None:  #line 170
        concatenated_string =  ""                      #line 171
        if  0 == len ( inst.buffer1):                  #line 172
            concatenated_string =  inst.buffer2        #line 173
        elif  0 == len ( inst.buffer2):                #line 174
            concatenated_string =  inst.buffer1        #line 175
        else:                                          #line 176
            concatenated_string =  inst.buffer1+ inst.buffer2#line 177#line 178
        send ( eh, "", concatenated_string, mev)       #line 179
        inst.buffer1 =  None                           #line 180
        inst.buffer2 =  None                           #line 181#line 182#line 183#line 184

#                                                      #line 185#line 186
def string_constant_instantiate (reg,owner,name,template_data,arg):#line 187
    global projectRoot                                 #line 188
    name_with_id = gensymbol ( "strconst")             #line 189
    s =  template_data                                 #line 190
    if  projectRoot!= "":                              #line 191
        s = re.sub ( "_00_",  projectRoot,  s)         #line 192#line 193
    return make_leaf ( name_with_id, owner, s, "", string_constant_handler)#line 194#line 195#line 196

def string_constant_handler (eh,mev):                  #line 197
    s =  eh.instance_data                              #line 198
    send ( eh, "", s, mev)                             #line 199#line 200#line 201

def fakepipename_instantiate (reg,owner,name,template_data,arg):#line 202
    instance_name = gensymbol ( "fakepipe")            #line 203
    return make_leaf ( instance_name, owner, None, "", fakepipename_handler)#line 204#line 205#line 206

rand =  0                                              #line 207#line 208
def fakepipename_handler (eh,mev):                     #line 209
    global rand                                        #line 210
    rand =  rand+ 1
    # not very random, but good enough _ ;rand' must be unique within a single run#line 211
    send ( eh, "", str( "/tmp/fakepipe") +  rand , mev)#line 212#line 213#line 214
                                                       #line 215
class Switch1star_Instance_Data:
    def __init__ (self,):                              #line 216
        self.state =  "1"                              #line 217#line 218
                                                       #line 219
def switch1star_instantiate (reg,owner,name,template_data,arg):#line 220
    name_with_id = gensymbol ( "switch1*")             #line 221
    instp =  Switch1star_Instance_Data ()              #line 222
    return make_leaf ( name_with_id, owner, instp, "", switch1star_handler)#line 223#line 224#line 225

def switch1star_handler (eh,mev):                      #line 226
    inst =  eh.instance_data                           #line 227
    whichOutput =  inst.state                          #line 228
    if  "" ==  mev.port:                               #line 229
        if  "1" ==  whichOutput:                       #line 230
            forward ( eh, "1", mev)                    #line 231
            inst.state =  "*"                          #line 232
        elif  "*" ==  whichOutput:                     #line 233
            forward ( eh, "*", mev)                    #line 234
        else:                                          #line 235
            send ( eh, "✗", "internal error bad state in switch1*", mev)#line 236#line 237
    elif  "reset" ==  mev.port:                        #line 238
        inst.state =  "1"                              #line 239
    else:                                              #line 240
        send ( eh, "✗", "internal error bad mevent for switch1*", mev)#line 241#line 242#line 243#line 244

class StringAccumulator:
    def __init__ (self,):                              #line 245
        self.s =  ""                                   #line 246#line 247
                                                       #line 248
def strcatstar_instantiate (reg,owner,name,template_data,arg):#line 249
    name_with_id = gensymbol ( "String Concat *")      #line 250
    instp =  StringAccumulator ()                      #line 251
    return make_leaf ( name_with_id, owner, instp, "", strcatstar_handler)#line 252#line 253#line 254

def strcatstar_handler (eh,mev):                       #line 255
    accum =  eh.instance_data                          #line 256
    if  "" ==  mev.port:                               #line 257
        accum.s =  str( accum.s) +  mev.datum.v        #line 258
    elif  "fini" ==  mev.port:                         #line 259
        send ( eh, "", accum.s, mev)                   #line 260
    else:                                              #line 261
        send ( eh, "✗", "internal error bad mevent for String Concat *", mev)#line 262#line 263#line 264#line 265

# all of the the built_in leaves are listed here       #line 266
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 267#line 268
def initialize_stock_components (reg):                 #line 269
    register_component ( reg,mkTemplate ( "1then2", None, "", deracer_instantiate))#line 270
    register_component ( reg,mkTemplate ( "?", None, "", probe_instantiate))#line 271
    register_component ( reg,mkTemplate ( "trash", None, "", trash_instantiate))#line 272#line 273#line 274
    register_component ( reg,mkTemplate ( "Read Text File", None, "", low_level_read_text_file_instantiate))#line 275
    register_component ( reg,mkTemplate ( "Ensure String Datum", None, "", ensure_string_datum_instantiate))#line 276#line 277
    register_component ( reg,mkTemplate ( "syncfilewrite", None, "", syncfilewrite_instantiate))#line 278
    register_component ( reg,mkTemplate ( "stringconcat", None, "", stringconcat_instantiate))#line 279
    register_component ( reg,mkTemplate ( "switch1*", None, "", switch1star_instantiate))#line 280
    register_component ( reg,mkTemplate ( "String Concat *", None, "", strcatstar_instantiate))#line 281
    # for fakepipe                                     #line 282
    register_component ( reg,mkTemplate ( "fakepipename", None, "", fakepipename_instantiate))#line 283#line 284#line 285
#
import sys
import re
import subprocess
import shlex
import os
import json
from collections import deque
import socket
import struct
import base64
import hashlib
import random
from repl import live_update

def deque_to_json(d):
    # """
    # Convert a deque of Mevent objects to a JSON string, preserving order.
    # Each Mevent object is converted to a dict with a single key (from Mevent.key)
    # containing the payload as its value.

    # Args:
    #     d: The deque of Mevent objects to convert

    # Returns:
    #     A JSON string representation of the deque
    # """
    # # Convert deque to list of objects where each mevent's key contains its payload
    ordered_list = [{mev.port: "" if mev.datum.v is None else mev.datum.v} for mev in d]

    # # Convert to JSON with indentation for readability
    return json.dumps(ordered_list, indent=2)


                                                       #line 1#line 2
counter =  0                                           #line 3
ticktime =  0                                          #line 4#line 5
digits = [ "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀", "₂₁", "₂₂", "₂₃", "₂₄", "₂₅", "₂₆", "₂₇", "₂₈", "₂₉"]#line 12#line 13#line 14
def gensymbol (s):                                     #line 15
    global counter                                     #line 16
    name_with_id =  str( s) + subscripted_digit ( counter) #line 17
    counter =  counter+ 1                              #line 18
    return  name_with_id                               #line 19#line 20#line 21

def subscripted_digit (n):                             #line 22
    global digits                                      #line 23
    if ( n >=  0 and  n <=  29):                       #line 24
        return  digits [ n]                            #line 25
    else:                                              #line 26
        return  str( "₊") + str ( n)                   #line 27#line 28#line 29#line 30

class Datum:
    def __init__ (self,):                              #line 31
        self.v =  None                                 #line 32
        self.clone =  None                             #line 33
        self.reclaim =  None                           #line 34
        self.other =  None # reserved for use on per-project basis #line 35#line 36
                                                       #line 37#line 38
# Mevent passed to a leaf component.                   #line 39
#                                                      #line 40
# `port` refers to the name of the incoming or outgoing port of this component.#line 41
# `payload` is the data attached to this mevent.       #line 42
class Mevent:
    def __init__ (self,):                              #line 43
        self.port =  None                              #line 44
        self.datum =  None                             #line 45#line 46
                                                       #line 47
def clone_port (s):                                    #line 48
    return clone_string ( s)                           #line 49#line 50#line 51

# Utility for making a `Mevent`. Used to safely "seed“ mevents#line 52
# entering the very top of a network.                  #line 53
def make_mevent (port,datum):                          #line 54
    p = clone_string ( port)                           #line 55
    m =  Mevent ()                                     #line 56
    m.port =  p                                        #line 57
    m.datum =  datum.clone ()                          #line 58
    return  m                                          #line 59#line 60#line 61

# Clones a mevent. Primarily used internally for “fanning out“ a mevent to multiple destinations.#line 62
def mevent_clone (mev):                                #line 63
    m =  Mevent ()                                     #line 64
    m.port = clone_port ( mev.port)                    #line 65
    m.datum =  mev.datum.clone ()                      #line 66
    return  m                                          #line 67#line 68#line 69

# Frees a mevent.                                      #line 70
def destroy_mevent (mev):                              #line 71
    # during debug, dont destroy any mevent, since we want to trace mevents, thus, we need to persist ancestor mevents#line 72
    pass                                               #line 73#line 74#line 75

def destroy_datum (mev):                               #line 76
    pass                                               #line 77#line 78#line 79

def destroy_port (mev):                                #line 80
    pass                                               #line 81#line 82#line 83

#                                                      #line 84
def format_mevent (m):                                 #line 85
    if  m ==  None:                                    #line 86
        return  "{}"                                   #line 87
    else:                                              #line 88
        return  str( "{%5C”") +  str( m.port) +  str( "%5C”:%5C”") +  str( m.datum.v) +  "%5C”}"    #line 89#line 90#line 91

def format_mevent_raw (m):                             #line 92
    if  m ==  None:                                    #line 93
        return  ""                                     #line 94
    else:                                              #line 95
        return  m.datum.v                              #line 96#line 97#line 98#line 99

enumDown =  0                                          #line 100
enumAcross =  1                                        #line 101
enumUp =  2                                            #line 102
enumThrough =  3                                       #line 103#line 104
def create_down_connector (container,proto_conn,connectors,children_by_id):#line 105
    # JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''},#line 106
    connector =  Connector ()                          #line 107
    connector.direction =  "down"                      #line 108
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])#line 109
    target_proto =  proto_conn [ "target"]             #line 110
    id_proto =  target_proto [ "id"]                   #line 111
    target_component =  children_by_id [id_proto]      #line 112
    if ( target_component ==  None):                   #line 113
        load_error ( str( "internal error: .Down connection target internal error ") + ( proto_conn [ "target"]) [ "name"] )#line 114
    else:                                              #line 115
        connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)#line 116#line 117
    return  connector                                  #line 118#line 119#line 120

def create_across_connector (container,proto_conn,connectors,children_by_id):#line 121
    connector =  Connector ()                          #line 122
    connector.direction =  "across"                    #line 123
    source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])]#line 124
    target_component =  children_by_id [(( proto_conn [ "target"]) [ "id"])]#line 125
    if  source_component ==  None:                     #line 126
        load_error ( str( "internal error: .Across connection source not ok ") + ( proto_conn [ "source"]) [ "name"] )#line 127
    else:                                              #line 128
        connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])#line 129
        if  target_component ==  None:                 #line 130
            load_error ( str( "internal error: .Across connection target not ok ") + ( proto_conn [ "target"]) [ "name"] )#line 131
        else:                                          #line 132
            connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)#line 133#line 134#line 135
    return  connector                                  #line 136#line 137#line 138

def create_up_connector (container,proto_conn,connectors,children_by_id):#line 139
    connector =  Connector ()                          #line 140
    connector.direction =  "up"                        #line 141
    source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])]#line 142
    if  source_component ==  None:                     #line 143
        load_error ( str( "internal error: .Up connection source not ok ") + ( proto_conn [ "source"]) [ "name"] )#line 144
    else:                                              #line 145
        connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])#line 146
        connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)#line 147#line 148
    return  connector                                  #line 149#line 150#line 151

def create_through_connector (container,proto_conn,connectors,children_by_id):#line 152
    connector =  Connector ()                          #line 153
    connector.direction =  "through"                   #line 154
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])#line 155
    connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)#line 156
    return  connector                                  #line 157#line 158#line 159
                                                       #line 160
def container_instantiator (reg,owner,container_name,desc,arg):#line 161
    global enumDown, enumUp, enumAcross, enumThrough   #line 162
    container = make_container ( container_name, owner)#line 163
    children = []                                      #line 164
    children_by_id = {}
    # not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here#line 165
    # collect children                                 #line 166
    for child_desc in  desc [ "children"]:             #line 167
        child_instance = get_component_instance ( reg, child_desc [ "name"], container)#line 168
        children.append ( child_instance)              #line 169
        id =  child_desc [ "id"]                       #line 170
        children_by_id [id] =  child_instance          #line 171#line 172#line 173
    container.children =  children                     #line 174#line 175
    connectors = []                                    #line 176
    for proto_conn in  desc [ "connections"]:          #line 177
        connector =  Connector ()                      #line 178
        if  proto_conn [ "dir"] ==  enumDown:          #line 179
            connectors.append (create_down_connector ( container, proto_conn, connectors, children_by_id)) #line 180
        elif  proto_conn [ "dir"] ==  enumAcross:      #line 181
            connectors.append (create_across_connector ( container, proto_conn, connectors, children_by_id)) #line 182
        elif  proto_conn [ "dir"] ==  enumUp:          #line 183
            connectors.append (create_up_connector ( container, proto_conn, connectors, children_by_id)) #line 184
        elif  proto_conn [ "dir"] ==  enumThrough:     #line 185
            connectors.append (create_through_connector ( container, proto_conn, connectors, children_by_id)) #line 186#line 187#line 188
    container.connections =  connectors                #line 189
    return  container                                  #line 190#line 191#line 192

# The default handler for container components.        #line 193
def container_handler (container,mevent):              #line 194
    route ( container, container, mevent)
    # references to 'self' are replaced by the container during instantiation#line 195
    while any_child_ready ( container):                #line 196
        step_children ( container, mevent)             #line 197#line 198#line 199

# Frees the given container and associated data.       #line 200
def destroy_container (eh):                            #line 201
    pass                                               #line 202#line 203#line 204

# Routing connection for a container component. The `direction` field has#line 205
# no affect on the default mevent routing system _ it is there for debugging#line 206
# purposes, or for reading by other tools.             #line 207#line 208
class Connector:
    def __init__ (self,):                              #line 209
        self.direction =  None # down, across, up, through#line 210
        self.sender =  None                            #line 211
        self.receiver =  None                          #line 212#line 213
                                                       #line 214
# `Sender` is used to “pattern match“ which `Receiver` a mevent should go to,#line 215
# based on component ID (pointer) and port name.       #line 216#line 217
class Sender:
    def __init__ (self,):                              #line 218
        self.name =  None                              #line 219
        self.component =  None                         #line 220
        self.port =  None                              #line 221#line 222
                                                       #line 223#line 224#line 225
# `Receiver` is a handle to a destination queue, and a `port` name to assign#line 226
# to incoming mevents to this queue.                   #line 227#line 228
class Receiver:
    def __init__ (self,):                              #line 229
        self.name =  None                              #line 230
        self.queue =  None                             #line 231
        self.port =  None                              #line 232
        self.component =  None                         #line 233#line 234
                                                       #line 235
def mkSender (name,component,port):                    #line 236
    s =  Sender ()                                     #line 237
    s.name =  name                                     #line 238
    s.component =  component                           #line 239
    s.port =  port                                     #line 240
    return  s                                          #line 241#line 242#line 243

def mkReceiver (name,component,port,q):                #line 244
    r =  Receiver ()                                   #line 245
    r.name =  name                                     #line 246
    r.component =  component                           #line 247
    r.port =  port                                     #line 248
    # We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq.#line 249
    r.queue =  q                                       #line 250
    return  r                                          #line 251#line 252#line 253

# Checks if two senders match, by pointer equality and port name matching.#line 254
def sender_eq (s1,s2):                                 #line 255
    same_components = ( s1.component ==  s2.component) #line 256
    same_ports = ( s1.port ==  s2.port)                #line 257
    return  same_components and  same_ports            #line 258#line 259#line 260

# Delivers the given mevent to the receiver of this connector.#line 261#line 262
def deposit (parent,conn,mevent):                      #line 263
    new_mevent = make_mevent ( conn.receiver.port, mevent.datum)#line 264
    push_mevent ( parent, conn.receiver.component, conn.receiver.queue, new_mevent)#line 265#line 266#line 267

def force_tick (parent,eh):                            #line 268
    tick_mev = make_mevent ( ".",new_datum_bang ())    #line 269
    push_mevent ( parent, eh, eh.inq, tick_mev)        #line 270
    return  tick_mev                                   #line 271#line 272#line 273

def push_mevent (parent,receiver,inq,m):               #line 274
    inq.append ( m)                                    #line 275
    parent.visit_ordering.append ( receiver)           #line 276#line 277#line 278

def is_self (child,container):                         #line 279
    # in an earlier version “self“ was denoted as ϕ    #line 280
    return  child ==  container                        #line 281#line 282#line 283

def step_child (child,mev):                            #line 284
    before_state =  child.state                        #line 285
    child.handler ( child, mev)                        #line 286
    after_state =  child.state                         #line 287
    return [ before_state ==  "idle" and  after_state!= "idle", before_state!= "idle" and  after_state!= "idle", before_state!= "idle" and  after_state ==  "idle"]#line 290#line 291#line 292

def step_children (container,causingMevent):           #line 293
    container.state =  "idle"                          #line 294
    for child in  list ( container.visit_ordering):    #line 295
        # child = container represents self, skip it   #line 296
        if (not (is_self ( child, container))):        #line 297
            if (not ((0==len( child.inq)))):           #line 298
                mev =  child.inq.popleft ()            #line 299
                began_long_run =  None                 #line 300
                continued_long_run =  None             #line 301
                ended_long_run =  None                 #line 302
                [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, mev)#line 303
                if  began_long_run:                    #line 304
                    pass                               #line 305
                elif  continued_long_run:              #line 306
                    pass                               #line 307
                elif  ended_long_run:                  #line 308
                    pass                               #line 309#line 310
                destroy_mevent ( mev)                  #line 311
            else:                                      #line 312
                if  child.state!= "idle":              #line 313
                    mev = force_tick ( container, child)#line 314
                    child.handler ( child, mev)        #line 315
                    destroy_mevent ( mev)              #line 316#line 317#line 318#line 319
            if  child.state ==  "active":              #line 320
                # if child remains active, then the container must remain active and must propagate “ticks“ to child#line 321
                container.state =  "active"            #line 322#line 323#line 324
            while (not ((0==len( child.outq)))):       #line 325
                mev =  child.outq.popleft ()           #line 326
                route ( container, child, mev)         #line 327
                destroy_mevent ( mev)                  #line 328#line 329#line 330#line 331#line 332#line 333

def attempt_tick (parent,eh):                          #line 334
    if  eh.state!= "idle":                             #line 335
        force_tick ( parent, eh)                       #line 336#line 337#line 338#line 339

def is_tick (mev):                                     #line 340
    return  "." ==  mev.port
    # assume that any mevent that is sent to port "." is a tick #line 341#line 342#line 343

# Routes a single mevent to all matching destinations, according to#line 344
# the container's connection network.                  #line 345#line 346
def route (container,from_component,mevent):           #line 347
    was_sent =  False
    # for checking that output went somewhere (at least during bootstrap)#line 348
    fromname =  ""                                     #line 349
    global ticktime                                    #line 350
    ticktime =  ticktime+ 1                            #line 351
    if is_tick ( mevent):                              #line 352
        for child in  container.children:              #line 353
            attempt_tick ( container, child)           #line 354
        was_sent =  True                               #line 355
    else:                                              #line 356
        if (not (is_self ( from_component, container))):#line 357
            fromname =  from_component.name            #line 358#line 359
        from_sender = mkSender ( fromname, from_component, mevent.port)#line 360#line 361
        for connector in  container.connections:       #line 362
            if sender_eq ( from_sender, connector.sender):#line 363
                deposit ( container, connector, mevent)#line 364
                was_sent =  True                       #line 365#line 366#line 367#line 368
    if not ( was_sent):                                #line 369
        live_update ( "✗",  str( container.name) +  str( ": mevent '") +  str( mevent.port) +  str( "' from ") +  str( fromname) +  " dropped on floor..."     )#line 370#line 371#line 372#line 373

def any_child_ready (container):                       #line 374
    for child in  container.children:                  #line 375
        if child_is_ready ( child):                    #line 376
            return  True                               #line 377#line 378#line 379
    return  False                                      #line 380#line 381#line 382

def child_is_ready (eh):                               #line 383
    return (not ((0==len( eh.outq)))) or (not ((0==len( eh.inq)))) or ( eh.state!= "idle") or (any_child_ready ( eh))#line 384#line 385#line 386

def append_routing_descriptor (container,desc):        #line 387
    container.routings.append ( desc)                  #line 388#line 389#line 390

def injector (eh,mevent):                              #line 391
    eh.handler ( eh, mevent)                           #line 392#line 393#line 394
                                                       #line 395#line 396#line 397
class Component_Registry:
    def __init__ (self,):                              #line 398
        self.templates = {}                            #line 399#line 400
                                                       #line 401
class Template:
    def __init__ (self,):                              #line 402
        self.name =  None                              #line 403
        self.container =  None                         #line 404
        self.arg =  None                               #line 405
        self.instantiator =  None                      #line 406#line 407
                                                       #line 408
def mkTemplate (name,container,arg,instantiator):      #line 409
    templ =  Template ()                               #line 410
    templ.name =  name                                 #line 411
    templ.container =  container                       #line 412
    templ.arg =  arg                                   #line 413
    templ.instantiator =  instantiator                 #line 414
    return  templ                                      #line 415#line 416#line 417
                                                       #line 418
def lnet2internal_from_file (pathname,container_xml):  #line 419
    filename =  os.path.basename ( container_xml)      #line 420

    try:
        fil = open(filename, "r")
        json_data = fil.read()
        routings = json.loads(json_data)
        fil.close ()
        return routings
    except FileNotFoundError:
        print (f"File not found: '{filename}'")
        return None
    except json.JSONDecodeError as e:
        print ("Error decoding JSON in file: '{e}'")
        return None
                                                       #line 421#line 422#line 423

def lnet2internal_from_string ():                      #line 424

    try:
        routings = json.loads(lnet)
        return routings
    except json.JSONDecodeError as e:
        print ("Error decoding JSON from string 'lnet': '{e}'")
        return None
                                                       #line 425#line 426#line 427

def delete_decls (d):                                  #line 428
    pass                                               #line 429#line 430#line 431

def make_component_registry ():                        #line 432
    return  Component_Registry ()                      #line 433#line 434#line 435

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 436

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 437#line 438

def abstracted_register_component (reg,template,ok_to_overwrite):#line 439
    name = mangle_name ( template.name)                #line 440
    if  reg!= None and  name in  reg.templates and not  ok_to_overwrite:#line 441
        load_error ( str( "Component /") +  str( template.name) +  "/ already declared"  )#line 442
        return  reg                                    #line 443
    else:                                              #line 444
        reg.templates [name] =  template               #line 445
        return  reg                                    #line 446#line 447#line 448#line 449

def get_component_instance (reg,full_name,owner):      #line 450
    template_name = mangle_name ( full_name)           #line 451
    if  template_name in  reg.templates:               #line 452
        template =  reg.templates [template_name]      #line 453
        if ( template ==  None):                       #line 454
            load_error ( str( "Registry Error (A): Can't find component /") +  str( template_name) +  "/"  )#line 455
            return  None                               #line 456
        else:                                          #line 457
            owner_name =  ""                           #line 458
            instance_name =  template_name             #line 459
            if  None!= owner:                          #line 460
                owner_name =  owner.name               #line 461
                instance_name =  str( owner_name) +  str( "▹") +  template_name  #line 462
            else:                                      #line 463
                instance_name =  template_name         #line 464#line 465
            instance =  template.instantiator ( reg, owner, instance_name, template.container, template.arg)#line 466
            return  instance                           #line 467#line 468
    else:                                              #line 469
        load_error ( str( "Registry Error (B): Can't find component /") +  str( template_name) +  "/"  )#line 470
        return  None                                   #line 471#line 472#line 473#line 474

def mangle_name (s):                                   #line 475
    # trim name to remove code from Container component names _ deferred until later (or never)#line 476
    return  s                                          #line 477#line 478#line 479
                                                       #line 480
# Data for an asyncronous component _ effectively, a function with input#line 481
# and output queues of mevents.                        #line 482
#                                                      #line 483
# Components can either be a user_supplied function (“leaf“), or a “container“#line 484
# that routes mevents to child components according to a list of connections#line 485
# that serve as a mevent routing table.                #line 486
#                                                      #line 487
# Child components themselves can be leaves or other containers.#line 488
#                                                      #line 489
# `handler` invokes the code that is attached to this component.#line 490
#                                                      #line 491
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 492
# function may want whenever it is invoked again.      #line 493
#                                                      #line 494#line 495
# Eh_States :: enum { idle, active }                   #line 496
class Eh:
    def __init__ (self,):                              #line 497
        self.name =  ""                                #line 498
        self.inq =  deque ([])                         #line 499
        self.outq =  deque ([])                        #line 500
        self.owner =  None                             #line 501
        self.children = []                             #line 502
        self.visit_ordering =  deque ([])              #line 503
        self.connections = []                          #line 504
        self.routings =  deque ([])                    #line 505
        self.handler =  None                           #line 506
        self.finject =  None                           #line 507
        self.container =  None                         #line 508
        self.arg =  ""                                 #line 509
        self.state =  "idle"                           #line 510# bootstrap debugging#line 511
        self.kind =  None # enum { container, leaf, }  #line 512#line 513
                                                       #line 514
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 515
# whose handler function is `container_handler`.       #line 516
def make_container (name,owner):                       #line 517
    eh =  Eh ()                                        #line 518
    eh.name =  name                                    #line 519
    eh.owner =  owner                                  #line 520
    eh.handler =  container_handler                    #line 521
    eh.finject =  injector                             #line 522
    eh.state =  "idle"                                 #line 523
    eh.kind =  "container"                             #line 524
    return  eh                                         #line 525#line 526#line 527

# Creates a new leaf component out of a handler function, and a data parameter#line 528
# that will be passed back to your handler when called.#line 529#line 530
def make_leaf (name,owner,container,arg,handler):      #line 531
    eh =  Eh ()                                        #line 532
    nm =  ""                                           #line 533
    if  None!= owner:                                  #line 534
        nm =  owner.name                               #line 535#line 536
    eh.name =  str( nm) +  str( "▹") +  name           #line 537
    eh.owner =  owner                                  #line 538
    eh.handler =  handler                              #line 539
    eh.finject =  injector                             #line 540
    eh.container =  container                          #line 541
    eh.arg =  arg                                      #line 542
    eh.state =  "idle"                                 #line 543
    eh.kind =  "leaf"                                  #line 544
    return  eh                                         #line 545#line 546#line 547

# Sends a mevent on the given `port` with `data`, placing it on the output#line 548
# of the given component.                              #line 549#line 550
def send (eh,port,obj,causingMevent):                  #line 551
    d = Datum ()                                       #line 552
    d.v =  obj                                         #line 553
    d.clone =  lambda : obj_clone ( d)                 #line 554
    d.reclaim =  None                                  #line 555
    mev = make_mevent ( port, d)                       #line 556
    put_output ( eh, mev)                              #line 557#line 558#line 559

def forward (eh,port,mev):                             #line 560
    fwdmev = make_mevent ( port, mev.datum)            #line 561
    put_output ( eh, fwdmev)                           #line 562#line 563#line 564

def inject (eh,mev):                                   #line 565
    eh.finject ( eh, mev)                              #line 566#line 567#line 568

def set_active (eh):                                   #line 569
    eh.state =  "active"                               #line 570#line 571#line 572

def set_idle (eh):                                     #line 573
    eh.state =  "idle"                                 #line 574#line 575#line 576

def put_output (eh,mev):                               #line 577
    eh.outq.append ( mev)                              #line 578#line 579#line 580

projectRoot =  ""                                      #line 581#line 582
def set_environment (project_root):                    #line 583
    global projectRoot                                 #line 584
    projectRoot =  project_root                        #line 585#line 586#line 587

def obj_clone (obj):                                   #line 588
    return  obj                                        #line 589#line 590#line 591

# usage: app ${_00_} diagram_filename1 diagram_filename2 ...#line 592
# where ${_00_} is the root directory for the project  #line 593#line 594
def initialize_component_palette_from_files (project_root,diagram_source_files):#line 595
    reg = make_component_registry ()                   #line 596
    for diagram_source in  diagram_source_files:       #line 597
        all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)#line 598
        reg = generate_external_components ( reg, all_containers_within_single_file)#line 599
        for container in  all_containers_within_single_file:#line 600
            register_component ( reg,mkTemplate ( container [ "name"], container, "", container_instantiator))#line 601#line 602#line 603
    initialize_stock_components ( reg)                 #line 604
    return  reg                                        #line 605#line 606#line 607

def initialize_component_palette_from_string (project_root):#line 608
    # this version ignores project_root                #line 609
    reg = make_component_registry ()                   #line 610
    all_containers = lnet2internal_from_string ()      #line 611
    reg = generate_external_components ( reg, all_containers)#line 612
    for container in  all_containers:                  #line 613
        register_component ( reg,mkTemplate ( container [ "name"], container, "", container_instantiator))#line 614#line 615
    initialize_stock_components ( reg)                 #line 616
    return  reg                                        #line 617#line 618#line 619
                                                       #line 620
def clone_string (s):                                  #line 621
    return  s                                          #line 622#line 623#line 624

load_errors =  False                                   #line 625
runtime_errors =  False                                #line 626#line 627
def load_error (s):                                    #line 628
    global load_errors                                 #line 629
    print ( s, file=sys.stderr)                        #line 630
                                                       #line 631
    load_errors =  True                                #line 632#line 633#line 634

def runtime_error (s):                                 #line 635
    global runtime_errors                              #line 636
    print ( s, file=sys.stderr)                        #line 637
    runtime_errors =  True                             #line 638#line 639#line 640
                                                       #line 641
def initialize_from_files (project_root,diagram_names):#line 642
    arg =  None                                        #line 643
    palette = initialize_component_palette_from_files ( project_root, diagram_names)#line 644
    return [ palette,[ project_root, diagram_names, arg]]#line 645#line 646#line 647

def initialize_from_string (project_root):             #line 648
    arg =  None                                        #line 649
    palette = initialize_component_palette_from_string ( project_root)#line 650
    return [ palette,[ project_root, None, arg]]       #line 651#line 652#line 653

def start (arg,Part_name,palette,env):                 #line 654
    project_root =  env [ 0]                           #line 655
    diagram_names =  env [ 1]                          #line 656
    set_environment ( project_root)                    #line 657
    # get entrypoint container                         #line 658
    Part = get_component_instance ( palette, Part_name, None)#line 659
    if  None ==  Part:                                 #line 660
        load_error ( str( "Couldn't find container with page name /") +  str( Part_name) +  str( "/ in files ") +  str(str ( diagram_names)) +  " (check tab names, or disable compression?)"    )#line 664#line 665
    if not  load_errors:                               #line 666
        d = Datum ()                                   #line 667
        d.v =  arg                                     #line 668
        d.clone =  lambda : obj_clone ( d)             #line 669
        d.reclaim =  None                              #line 670
        mev = make_mevent ( "", d)                     #line 671
        inject ( Part, mev)                            #line 672#line 673
    print (deque_to_json ( Part.outq))                 #line 674#line 675#line 676

def new_datum_bang ():                                 #line 677
    d = Datum ()                                       #line 678
    d.v =  "!"                                         #line 679
    d.clone =  lambda : obj_clone ( d)                 #line 680
    d.reclaim =  None                                  #line 681
    return  d                                          #line 682#line 683