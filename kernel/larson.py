

import sys
import re
import subprocess
import shlex
import os
import json
import queue
                                                            #line 1#line 2
counter =  0                                                #line 3#line 4
digits = [ "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀", "₂₁", "₂₂", "₂₃", "₂₄", "₂₅", "₂₆", "₂₇", "₂₈", "₂₉"]#line 11#line 12#line 13
def gensymbol (s):                                          #line 14
    global counter                                          #line 15
    name_with_id =  str( s) + subscripted_digit ( counter)  #line 16
    counter =  counter+ 1                                   #line 17
    return  name_with_id                                    #line 18#line 19#line 20

def subscripted_digit (n):                                  #line 21
    global digits                                           #line 22
    if ( n >=  0 and  n <=  29):                            #line 23
        return  digits [ n]                                 #line 24
    else:                                                   #line 25
        return  str( "₊") +  n                              #line 26#line 27#line 28#line 29

class Datum:
    def __init__ (self,):                                   #line 30
        self.data =  None                                   #line 31
        self.clone =  None                                  #line 32
        self.reclaim =  None                                #line 33
        self.srepr =  None                                  #line 34
        self.kind =  None                                   #line 35
        self.raw =  None                                    #line 36#line 37
                                                            #line 38
def new_datum_string (s):                                   #line 39
    d =  Datum ()                                           #line 40
    d. data =  s                                            #line 41
    d. clone =  lambda : clone_datum_string ( d)            #line 42
    d. reclaim =  lambda : reclaim_datum_string ( d)        #line 43
    d. srepr =  lambda : srepr_datum_string ( d)            #line 44
    d. raw = bytearray ( d. data,"UTF_8")                   #line 45
    d. kind =  lambda :  "string"                           #line 46
    return  d                                               #line 47#line 48#line 49

def clone_datum_string (d):                                 #line 50
    d = new_datum_string ( d. data)                         #line 51
    return  d                                               #line 52#line 53#line 54

def reclaim_datum_string (src):                             #line 55
    pass                                                    #line 56#line 57#line 58

def srepr_datum_string (d):                                 #line 59
    return  d. data                                         #line 60#line 61#line 62

def new_datum_bang ():                                      #line 63
    p = Datum ()                                            #line 64
    p. data =  True                                         #line 65
    p. clone =  lambda : clone_datum_bang ( p)              #line 66
    p. reclaim =  lambda : reclaim_datum_bang ( p)          #line 67
    p. srepr =  lambda : srepr_datum_bang ()                #line 68
    p. raw =  lambda : raw_datum_bang ()                    #line 69
    p. kind =  lambda :  "bang"                             #line 70
    return  p                                               #line 71#line 72#line 73

def clone_datum_bang (d):                                   #line 74
    return new_datum_bang ()                                #line 75#line 76#line 77

def reclaim_datum_bang (d):                                 #line 78
    pass                                                    #line 79#line 80#line 81

def srepr_datum_bang ():                                    #line 82
    return  "!"                                             #line 83#line 84#line 85

def raw_datum_bang ():                                      #line 86
    return []                                               #line 87#line 88#line 89

def new_datum_tick ():                                      #line 90
    p = new_datum_bang ()                                   #line 91
    p. kind =  lambda :  "tick"                             #line 92
    p. clone =  lambda : new_datum_tick ()                  #line 93
    p. srepr =  lambda : srepr_datum_tick ()                #line 94
    p. raw =  lambda : raw_datum_tick ()                    #line 95
    return  p                                               #line 96#line 97#line 98

def srepr_datum_tick ():                                    #line 99
    return  "."                                             #line 100#line 101#line 102

def raw_datum_tick ():                                      #line 103
    return []                                               #line 104#line 105#line 106

def new_datum_bytes (b):                                    #line 107
    p = Datum ()                                            #line 108
    p. data =  b                                            #line 109
    p. clone =  lambda : clone_datum_bytes ( p)             #line 110
    p. reclaim =  lambda : reclaim_datum_bytes ( p)         #line 111
    p. srepr =  lambda : srepr_datum_bytes ( b)             #line 112
    p. raw =  lambda : raw_datum_bytes ( b)                 #line 113
    p. kind =  lambda :  "bytes"                            #line 114
    return  p                                               #line 115#line 116#line 117

def clone_datum_bytes (src):                                #line 118
    p = Datum ()                                            #line 119
    p. clone =  src. clone                                  #line 120
    p. reclaim =  src. reclaim                              #line 121
    p. srepr =  src. srepr                                  #line 122
    p. raw =  src. raw                                      #line 123
    p. kind =  src. kind                                    #line 124
    p. data =  src.clone ()                                 #line 125
    return  p                                               #line 126#line 127#line 128

def reclaim_datum_bytes (src):                              #line 129
    pass                                                    #line 130#line 131#line 132

def srepr_datum_bytes (d):                                  #line 133
    return  d. data.decode ( "UTF_8")                       #line 134#line 135

def raw_datum_bytes (d):                                    #line 136
    return  d. data                                         #line 137#line 138#line 139

def new_datum_handle (h):                                   #line 140
    return new_datum_int ( h)                               #line 141#line 142#line 143

def new_datum_int (i):                                      #line 144
    p = Datum ()                                            #line 145
    p. data =  i                                            #line 146
    p. clone =  lambda : clone_int ( i)                     #line 147
    p. reclaim =  lambda : reclaim_int ( i)                 #line 148
    p. srepr =  lambda : srepr_datum_int ( i)               #line 149
    p. raw =  lambda : raw_datum_int ( i)                   #line 150
    p. kind =  lambda :  "int"                              #line 151
    return  p                                               #line 152#line 153#line 154

def clone_int (i):                                          #line 155
    p = new_datum_int ( i)                                  #line 156
    return  p                                               #line 157#line 158#line 159

def reclaim_int (src):                                      #line 160
    pass                                                    #line 161#line 162#line 163

def srepr_datum_int (i):                                    #line 164
    return str ( i)                                         #line 165#line 166#line 167

def raw_datum_int (i):                                      #line 168
    return  i                                               #line 169#line 170#line 171

# Message passed to a leaf component.                       #line 172
#                                                           #line 173
# `port` refers to the name of the incoming or outgoing port of this component.#line 174
# `datum` is the data attached to this message.             #line 175
class Message:
    def __init__ (self,port,datum):                         #line 176
        self.port =  port                                   #line 177
        self.datum =  datum                                 #line 178#line 179
                                                            #line 180
def clone_port (s):                                         #line 181
    return clone_string ( s)                                #line 182#line 183#line 184

# Utility for making a `Message`. Used to safely “seed“ messages#line 185
# entering the very top of a network.                       #line 186
def make_message (port,datum):                              #line 187
    p = clone_string ( port)                                #line 188
    m = Message ( p, datum.clone ())                        #line 189
    return  m                                               #line 190#line 191#line 192

# Clones a message. Primarily used internally for “fanning out“ a message to multiple destinations.#line 193
def message_clone (message):                                #line 194
    m = Message (clone_port ( message. port), message. datum.clone ())#line 195
    return  m                                               #line 196#line 197#line 198

# Frees a message.                                          #line 199
def destroy_message (msg):                                  #line 200
    # during debug, dont destroy any message, since we want to trace messages, thus, we need to persist ancestor messages#line 201
    pass                                                    #line 202#line 203#line 204

def destroy_datum (msg):                                    #line 205
    pass                                                    #line 206#line 207#line 208

def destroy_port (msg):                                     #line 209
    pass                                                    #line 210#line 211#line 212

#                                                           #line 213
def format_message (m):                                     #line 214
    if  m ==  None:                                         #line 215
        return  "ϕ"                                         #line 216
    else:                                                   #line 217
        return  str( "⟪") +  str( m. port) +  str( "⦂") +  str( m. datum.srepr ()) +  "⟫"    #line 221#line 222#line 223#line 224
                                                            #line 225
enumDown =  0                                               #line 226
enumAcross =  1                                             #line 227
enumUp =  2                                                 #line 228
enumThrough =  3                                            #line 229#line 230
def container_instantiator (reg,owner,container_name,desc): #line 231
    global enumDown, enumUp, enumAcross, enumThrough        #line 232
    container = make_container ( container_name, owner)     #line 233
    children = []                                           #line 234
    children_by_id = {}
    # not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here#line 235
    # collect children                                      #line 236
    for child_desc in  desc ["children"]:                   #line 237
        child_instance = get_component_instance ( reg, child_desc ["name"], container)#line 238
        children.append ( child_instance)                   #line 239
        children_by_id [ child_desc ["id"]] =  child_instance#line 240
    container. children =  children                         #line 241
    me =  container                                         #line 242#line 243
    connectors = []                                         #line 244
    for proto_conn in  desc ["connections"]:                #line 245
        connector = Connector ()                            #line 246
        if  proto_conn ["dir"] ==  enumDown:                #line 247
            # JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''},#line 248
            connector. direction =  "down"                  #line 249
            connector. sender = Sender ( me. name, me, proto_conn ["source_port"])#line 250
            target_component =  children_by_id [ proto_conn ["target"] ["id"]]#line 251
            if ( target_component ==  None):                #line 252
                load_error ( str( "internal error: .Down connection target internal error ") +  proto_conn ["target"] )#line 253
            else:                                           #line 254
                connector. receiver = Receiver ( target_component. name, target_component. inq, proto_conn ["target_port"], target_component)#line 255
                connectors.append ( connector)              #line 256
        elif  proto_conn ["dir"] ==  enumAcross:            #line 257
            connector. direction =  "across"                #line 258
            source_component =  children_by_id [ proto_conn ["source"] ["id"]]#line 259
            target_component =  children_by_id [ proto_conn ["target"] ["id"]]#line 260
            if  source_component ==  None:                  #line 261
                load_error ( str( "internal error: .Across connection source not ok ") +  proto_conn ["source"] )#line 262
            else:                                           #line 263
                connector. sender = Sender ( source_component. name, source_component, proto_conn ["source_port"])#line 264
                if  target_component ==  None:              #line 265
                    load_error ( str( "internal error: .Across connection target not ok ") +  proto_conn. target )#line 266
                else:                                       #line 267
                    connector. receiver = Receiver ( target_component. name, target_component. inq, proto_conn ["target_port"], target_component)#line 268
                    connectors.append ( connector)          #line 269
        elif  proto_conn ["dir"] ==  enumUp:                #line 270
            connector. direction =  "up"                    #line 271
            source_component =  children_by_id [ proto_conn ["source"] ["id"]]#line 272
            if  source_component ==  None:                  #line 273
                print ( str( "internal error: .Up connection source not ok ") +  proto_conn ["source"] )#line 274
            else:                                           #line 275
                connector. sender = Sender ( source_component. name, source_component, proto_conn ["source_port"])#line 276
                connector. receiver = Receiver ( me. name, container. outq, proto_conn ["target_port"], me)#line 277
                connectors.append ( connector)              #line 278
        elif  proto_conn ["dir"] ==  enumThrough:           #line 279
            connector. direction =  "through"               #line 280
            connector. sender = Sender ( me. name, me, proto_conn ["source_port"])#line 281
            connector. receiver = Receiver ( me. name, container. outq, proto_conn ["target_port"], me)#line 282
            connectors.append ( connector)                  #line 283#line 284
    container. connections =  connectors                    #line 285
    return  container                                       #line 286#line 287#line 288

# The default handler for container components.             #line 289
def container_handler (container,message):                  #line 290
    route ( container, container, message)
    # references to 'self' are replaced by the container during instantiation#line 291
    while any_child_ready ( container):                     #line 292
        step_children ( container, message)                 #line 293#line 294#line 295

# Frees the given container and associated data.            #line 296
def destroy_container (eh):                                 #line 297
    pass                                                    #line 298#line 299#line 300

def fifo_is_empty (fifo):                                   #line 301
    return  fifo.empty ()                                   #line 302#line 303#line 304

# Routing connection for a container component. The `direction` field has#line 305
# no affect on the default message routing system _ it is there for debugging#line 306
# purposes, or for reading by other tools.                  #line 307#line 308
class Connector:
    def __init__ (self,):                                   #line 309
        self.direction =  None # down, across, up, through  #line 310
        self.sender =  None                                 #line 311
        self.receiver =  None                               #line 312#line 313
                                                            #line 314
# `Sender` is used to “pattern match“ which `Receiver` a message should go to,#line 315
# based on component ID (pointer) and port name.            #line 316#line 317
class Sender:
    def __init__ (self,name,component,port):                #line 318
        self.name =  name                                   #line 319
        self.component =  component # from                  #line 320
        self.port =  port # from's port                     #line 321#line 322
                                                            #line 323
# `Receiver` is a handle to a destination queue, and a `port` name to assign#line 324
# to incoming messages to this queue.                       #line 325#line 326
class Receiver:
    def __init__ (self,name,queue,port,component):          #line 327
        self.name =  name                                   #line 328
        self.queue =  queue # queue (input | output) of receiver#line 329
        self.port =  port # destination port                #line 330
        self.component =  component # to (for bootstrap debug)#line 331#line 332
                                                            #line 333
# Checks if two senders match, by pointer equality and port name matching.#line 334
def sender_eq (s1,s2):                                      #line 335
    same_components = ( s1. component ==  s2. component)    #line 336
    same_ports = ( s1. port ==  s2. port)                   #line 337
    return  same_components and  same_ports                 #line 338#line 339#line 340

# Delivers the given message to the receiver of this connector.#line 341#line 342
def deposit (parent,conn,message):                          #line 343
    new_message = make_message ( conn. receiver. port, message. datum)#line 344
    push_message ( parent, conn. receiver. component, conn. receiver. queue, new_message)#line 345#line 346#line 347

def force_tick (parent,eh):                                 #line 348
    tick_msg = make_message ( ".",new_datum_tick ())        #line 349
    push_message ( parent, eh, eh. inq, tick_msg)           #line 350
    return  tick_msg                                        #line 351#line 352#line 353

def push_message (parent,receiver,inq,m):                   #line 354
    inq.put ( m)                                            #line 355
    parent. visit_ordering.put ( receiver)                  #line 356#line 357#line 358

def is_self (child,container):                              #line 359
    # in an earlier version “self“ was denoted as ϕ         #line 360
    return  child ==  container                             #line 361#line 362#line 363

def step_child (child,msg):                                 #line 364
    before_state =  child. state                            #line 365
    child.handler ( child, msg)                             #line 366
    after_state =  child. state                             #line 367
    return [ before_state ==  "idle" and  after_state!= "idle", before_state!= "idle" and  after_state!= "idle", before_state!= "idle" and  after_state ==  "idle"]#line 370#line 371#line 372

def save_message (eh,msg):                                  #line 373
    eh. saved_messages.put ( msg)                           #line 374#line 375#line 376

def fetch_saved_message_and_clear (eh):                     #line 377
    return  eh. saved_messages.get ()                       #line 378#line 379#line 380

def step_children (container,causingMessage):               #line 381
    container. state =  "idle"                              #line 382
    for child in list ( container. visit_ordering. queue):  #line 383
        # child = container represents self, skip it        #line 384
        if (not (is_self ( child, container))):             #line 385
            if (not ( child. inq.empty ())):                #line 386
                msg =  child. inq.get ()                    #line 387
                began_long_run =  None                      #line 388
                continued_long_run =  None                  #line 389
                ended_long_run =  None                      #line 390
                [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, msg)#line 391
                if  began_long_run:                         #line 392
                    save_message ( child, msg)              #line 393
                elif  continued_long_run:                   #line 394
                    pass                                    #line 395#line 396
                destroy_message ( msg)                      #line 397
            else:                                           #line 398
                if  child. state!= "idle":                  #line 399
                    msg = force_tick ( container, child)    #line 400
                    child.handler ( child, msg)             #line 401
                    destroy_message ( msg)                  #line 402#line 403
            if  child. state ==  "active":                  #line 404
                # if child remains active, then the container must remain active and must propagate “ticks“ to child#line 405
                container. state =  "active"                #line 406#line 407
            while (not ( child. outq.empty ())):            #line 408
                msg =  child. outq.get ()                   #line 409
                route ( container, child, msg)              #line 410
                destroy_message ( msg)                      #line 411#line 412#line 413#line 414#line 415

def attempt_tick (parent,eh):                               #line 416
    if  eh. state!= "idle":                                 #line 417
        force_tick ( parent, eh)                            #line 418#line 419#line 420

def is_tick (msg):                                          #line 421
    return  "tick" ==  msg. datum.kind ()                   #line 422#line 423#line 424

# Routes a single message to all matching destinations, according to#line 425
# the container's connection network.                       #line 426#line 427
def route (container,from_component,message):               #line 428
    was_sent =  False
    # for checking that output went somewhere (at least during bootstrap)#line 429
    fromname =  ""                                          #line 430
    if is_tick ( message):                                  #line 431
        for child in  container. children:                  #line 432
            attempt_tick ( container, child)                #line 433
        was_sent =  True                                    #line 434
    else:                                                   #line 435
        if (not (is_self ( from_component, container))):    #line 436
            fromname =  from_component. name                #line 437
        from_sender = Sender ( fromname, from_component, message. port)#line 438#line 439
        for connector in  container. connections:           #line 440
            if sender_eq ( from_sender, connector. sender): #line 441
                deposit ( container, connector, message)    #line 442
                was_sent =  True                            #line 443
    if not ( was_sent):                                     #line 444
        print ( "\n\n*** Error: ***")                       #line 445
        print ( "***")                                      #line 446
        print ( str( container. name) +  str( ": message '") +  str( message. port) +  str( "' from ") +  str( fromname) +  " dropped on floor..."     )#line 447
        print ( "***")                                      #line 448
        exit ()                                             #line 449#line 450#line 451#line 452

def any_child_ready (container):                            #line 453
    for child in  container. children:                      #line 454
        if child_is_ready ( child):                         #line 455
            return  True                                    #line 456
    return  False                                           #line 457#line 458#line 459

def child_is_ready (eh):                                    #line 460
    return (not ( eh. outq.empty ())) or (not ( eh. inq.empty ())) or ( eh. state!= "idle") or (any_child_ready ( eh))#line 461#line 462#line 463

def append_routing_descriptor (container,desc):             #line 464
    container. routings.put ( desc)                         #line 465#line 466#line 467

def container_injector (container,message):                 #line 468
    container_handler ( container, message)                 #line 469#line 470#line 471






                                                            #line 1#line 2#line 3
class Component_Registry:
    def __init__ (self,):                                   #line 4
        self.templates = {}                                 #line 5#line 6
                                                            #line 7
class Template:
    def __init__ (self,name,template_data,instantiator):    #line 8
        self.name =  name                                   #line 9
        self.template_data =  template_data                 #line 10
        self.instantiator =  instantiator                   #line 11#line 12
                                                            #line 13
def read_and_convert_json_file (filename):                  #line 14

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
                                                            #line 15#line 16#line 17

def json2internal (container_xml):                          #line 18
    fname =  os.path.basename ( container_xml)              #line 19
    routings = read_and_convert_json_file ( fname)          #line 20
    return  routings                                        #line 21#line 22#line 23

def delete_decls (d):                                       #line 24
    pass                                                    #line 25#line 26#line 27

def make_component_registry ():                             #line 28
    return Component_Registry ()                            #line 29#line 30#line 31

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 32

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 33#line 34

def abstracted_register_component (reg,template,ok_to_overwrite):#line 35
    name = mangle_name ( template. name)                    #line 36
    if  name in  reg. templates and not  ok_to_overwrite:   #line 37
        load_error ( str( "Component ") +  str( template. name) +  " already declared"  )#line 38
    reg. templates [ name] =  template                      #line 39
    return  reg                                             #line 40#line 41#line 42

def register_multiple_components (reg,templates):           #line 43
    for template in  templates:                             #line 44
        register_component ( reg, template)                 #line 45#line 46#line 47

def get_component_instance (reg,full_name,owner):           #line 48
    template_name = mangle_name ( full_name)                #line 49
    if  template_name in  reg. templates:                   #line 50
        template =  reg. templates [ template_name]         #line 51
        if ( template ==  None):                            #line 52
            load_error ( str( "Registry Error: Can;t find component ") +  str( template_name) +  " (does it need to be declared in components_to_include_in_project?"  )#line 53
            return  None                                    #line 54
        else:                                               #line 55
            owner_name =  ""                                #line 56
            instance_name =  template_name                  #line 57
            if  None!= owner:                               #line 58
                owner_name =  owner. name                   #line 59
                instance_name =  str( owner_name) +  str( ".") +  template_name  #line 60
            else:                                           #line 61
                instance_name =  template_name              #line 62
            instance =  template.instantiator ( reg, owner, instance_name, template. template_data)#line 63
            instance. depth = calculate_depth ( instance)   #line 64
            return  instance                                #line 65
    else:                                                   #line 66
        load_error ( str( "Registry Error: Can't find component ") +  str( template_name) +  " (does it need to be declared in components_to_include_in_project?"  )#line 67
        return  None                                        #line 68#line 69

def calculate_depth (eh):                                   #line 70
    if  eh. owner ==  None:                                 #line 71
        return  0                                           #line 72
    else:                                                   #line 73
        return  1+calculate_depth ( eh. owner)              #line 74#line 75#line 76

def dump_registry (reg):                                    #line 77
    nl ()                                                   #line 78
    print ( "*** PALETTE ***")                              #line 79
    for c in  reg. templates:                               #line 80
        print ( c. name)                                    #line 81
    print ( "***************")                              #line 82
    nl ()                                                   #line 83#line 84#line 85

def print_stats (reg):                                      #line 86
    print ( str( "registry statistics: ") +  reg. stats )   #line 87#line 88#line 89

def mangle_name (s):                                        #line 90
    # trim name to remove code from Container component names _ deferred until later (or never)#line 91
    return  s                                               #line 92#line 93#line 94

def generate_shell_components (reg,container_list):         #line 95
    # [                                                     #line 96
    #     {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 97
    #     {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []}#line 98
    # ]                                                     #line 99
    if  None!= container_list:                              #line 100
        for diagram in  container_list:                     #line 101
            # loop through every component in the diagram and look for names that start with “$“#line 102
            # {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 103
            for child_descriptor in  diagram ["children"]:  #line 104
                if first_char_is ( child_descriptor ["name"], "$"):#line 105
                    name =  child_descriptor ["name"]       #line 106
                    cmd =   name[1:] .strip ()              #line 107
                    generated_leaf = Template ( name, shell_out_instantiate, cmd)#line 108
                    register_component ( reg, generated_leaf)#line 109
                elif first_char_is ( child_descriptor ["name"], "'"):#line 110
                    name =  child_descriptor ["name"]       #line 111
                    s =   name[1:]                          #line 112
                    generated_leaf = Template ( name, string_constant_instantiate, s)#line 113
                    register_component_allow_overwriting ( reg, generated_leaf)#line 114#line 115#line 116#line 117#line 118#line 119#line 120

def first_char (s):                                         #line 121
    return   s[0]                                           #line 122#line 123#line 124

def first_char_is (s,c):                                    #line 125
    return  c == first_char ( s)                            #line 126#line 127#line 128
                                                            #line 129
# TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here#line 130
# I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped#line 131#line 132#line 133
# Data for an asyncronous component _ effectively, a function with input#line 134
# and output queues of messages.                            #line 135
#                                                           #line 136
# Components can either be a user_supplied function (“lea“), or a “container“#line 137
# that routes messages to child components according to a list of connections#line 138
# that serve as a message routing table.                    #line 139
#                                                           #line 140
# Child components themselves can be leaves or other containers.#line 141
#                                                           #line 142
# `handler` invokes the code that is attached to this component.#line 143
#                                                           #line 144
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 145
# function may want whenever it is invoked again.           #line 146
#                                                           #line 147#line 148
# Eh_States :: enum { idle, active }                        #line 149
class Eh:
    def __init__ (self,):                                   #line 150
        self.name =  ""                                     #line 151
        self.inq =  queue.Queue ()                          #line 152
        self.outq =  queue.Queue ()                         #line 153
        self.owner =  None                                  #line 154
        self.saved_messages =  queue.LifoQueue () # stack of saved message(s)#line 155
        self.children = []                                  #line 156
        self.visit_ordering =  queue.Queue ()               #line 157
        self.connections = []                               #line 158
        self.routings =  queue.Queue ()                     #line 159
        self.handler =  None                                #line 160
        self.instance_data =  None                          #line 161
        self.state =  "idle"                                #line 162# bootstrap debugging#line 163
        self.kind =  None # enum { container, leaf, }       #line 164
        self.trace =  False # set '⊤' if logging is enabled and if this component should be traced, (⊥ means silence, no tracing for this component)#line 165
        self.depth =  0 # hierarchical depth of component, 0=top, 1=1st child of top, 2=1st child of 1st child of top, etc.#line 166#line 167
                                                            #line 168
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 169
# whose handler function is `container_handler`.            #line 170
def make_container (name,owner):                            #line 171
    eh = Eh ()                                              #line 172
    eh. name =  name                                        #line 173
    eh. owner =  owner                                      #line 174
    eh. handler =  container_handler                        #line 175
    eh. inject =  container_injector                        #line 176
    eh. state =  "idle"                                     #line 177
    eh. kind =  "container"                                 #line 178
    return  eh                                              #line 179#line 180#line 181

# Creates a new leaf component out of a handler function, and a data parameter#line 182
# that will be passed back to your handler when called.     #line 183#line 184
def make_leaf (name,owner,instance_data,handler):           #line 185
    eh = Eh ()                                              #line 186
    eh. name =  str( owner. name) +  str( ".") +  name      #line 187
    eh. owner =  owner                                      #line 188
    eh. handler =  handler                                  #line 189
    eh. instance_data =  instance_data                      #line 190
    eh. state =  "idle"                                     #line 191
    eh. kind =  "leaf"                                      #line 192
    return  eh                                              #line 193#line 194#line 195

# Sends a message on the given `port` with `data`, placing it on the output#line 196
# of the given component.                                   #line 197#line 198
def send (eh,port,datum,causingMessage):                    #line 199
    msg = make_message ( port, datum)                       #line 200
    put_output ( eh, msg)                                   #line 201#line 202#line 203

def send_string (eh,port,s,causingMessage):                 #line 204
    datum = new_datum_string ( s)                           #line 205
    msg = make_message ( port, datum)                       #line 206
    put_output ( eh, msg)                                   #line 207#line 208#line 209

def forward (eh,port,msg):                                  #line 210
    fwdmsg = make_message ( port, msg. datum)               #line 211
    put_output ( eh, msg)                                   #line 212#line 213#line 214

def inject (eh,msg):                                        #line 215
    eh.inject ( eh, msg)                                    #line 216#line 217#line 218

# Returns a list of all output messages on a container.     #line 219
# For testing / debugging purposes.                         #line 220#line 221
def output_list (eh):                                       #line 222
    return  eh. outq                                        #line 223#line 224#line 225

# Utility for printing an array of messages.                #line 226
def print_output_list (eh):                                 #line 227
    for m in list ( eh. outq. queue):                       #line 228
        print (format_message ( m))                         #line 229#line 230#line 231

def spaces (n):                                             #line 232
    s =  ""                                                 #line 233
    for i in range( n):                                     #line 234
        s =  s+ " "                                         #line 235
    return  s                                               #line 236#line 237#line 238

def set_active (eh):                                        #line 239
    eh. state =  "active"                                   #line 240#line 241#line 242

def set_idle (eh):                                          #line 243
    eh. state =  "idle"                                     #line 244#line 245#line 246

# Utility for printing a specific output message.           #line 247#line 248
def fetch_first_output (eh,port):                           #line 249
    for msg in list ( eh. outq. queue):                     #line 250
        if ( msg. port ==  port):                           #line 251
            return  msg. datum                              #line 252
    return  None                                            #line 253#line 254#line 255

def print_specific_output (eh,port):                        #line 256
    # port ∷ “”                                             #line 257
    datum = fetch_first_output ( eh, port)                  #line 258
    print ( datum.srepr ())                                 #line 259#line 260

def print_specific_output_to_stderr (eh,port):              #line 261
    # port ∷ “”                                             #line 262
    datum = fetch_first_output ( eh, port)                  #line 263
    # I don't remember why I found it useful to print to stderr during bootstrapping, so I've left it in...#line 264
    print ( datum.srepr (), file=sys.stderr)                #line 265#line 266#line 267

def put_output (eh,msg):                                    #line 268
    eh. outq.put ( msg)                                     #line 269#line 270#line 271

root_project =  ""                                          #line 272
root_0D =  ""                                               #line 273#line 274
def set_environment (rproject,r0D):                         #line 275
    global root_project                                     #line 276
    global root_0D                                          #line 277
    root_project =  rproject                                #line 278
    root_0D =  r0D                                          #line 279#line 280#line 281

def probe_instantiate (reg,owner,name,template_data):       #line 282
    name_with_id = gensymbol ( "?")                         #line 283
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 284#line 285

def probeA_instantiate (reg,owner,name,template_data):      #line 286
    name_with_id = gensymbol ( "?A")                        #line 287
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 288#line 289#line 290

def probeB_instantiate (reg,owner,name,template_data):      #line 291
    name_with_id = gensymbol ( "?B")                        #line 292
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 293#line 294#line 295

def probeC_instantiate (reg,owner,name,template_data):      #line 296
    name_with_id = gensymbol ( "?C")                        #line 297
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 298#line 299#line 300

def probe_handler (eh,msg):                                 #line 301
    s =  msg. datum.srepr ()                                #line 302
    print ( str( "... probe ") +  str( eh. name) +  str( ": ") +  s   , file=sys.stderr)#line 303#line 304#line 305

def trash_instantiate (reg,owner,name,template_data):       #line 306
    name_with_id = gensymbol ( "trash")                     #line 307
    return make_leaf ( name_with_id, owner, None, trash_handler)#line 308#line 309#line 310

def trash_handler (eh,msg):                                 #line 311
    # to appease dumped_on_floor checker                    #line 312
    pass                                                    #line 313#line 314

class TwoMessages:
    def __init__ (self,first,second):                       #line 315
        self.first =  first                                 #line 316
        self.second =  second                               #line 317#line 318
                                                            #line 319
# Deracer_States :: enum { idle, waitingForFirst, waitingForSecond }#line 320
class Deracer_Instance_Data:
    def __init__ (self,state,buffer):                       #line 321
        self.state =  state                                 #line 322
        self.buffer =  buffer                               #line 323#line 324
                                                            #line 325
def reclaim_Buffers_from_heap (inst):                       #line 326
    pass                                                    #line 327#line 328#line 329

def deracer_instantiate (reg,owner,name,template_data):     #line 330
    name_with_id = gensymbol ( "deracer")                   #line 331
    inst = Deracer_Instance_Data ( "idle",TwoMessages ( None, None))#line 332
    inst. state =  "idle"                                   #line 333
    eh = make_leaf ( name_with_id, owner, inst, deracer_handler)#line 334
    return  eh                                              #line 335#line 336#line 337

def send_first_then_second (eh,inst):                       #line 338
    forward ( eh, "1", inst. buffer. first)                 #line 339
    forward ( eh, "2", inst. buffer. second)                #line 340
    reclaim_Buffers_from_heap ( inst)                       #line 341#line 342#line 343

def deracer_handler (eh,msg):                               #line 344
    inst =  eh. instance_data                               #line 345
    if  inst. state ==  "idle":                             #line 346
        if  "1" ==  msg. port:                              #line 347
            inst. buffer. first =  msg                      #line 348
            inst. state =  "waitingForSecond"               #line 349
        elif  "2" ==  msg. port:                            #line 350
            inst. buffer. second =  msg                     #line 351
            inst. state =  "waitingForFirst"                #line 352
        else:                                               #line 353
            runtime_error ( str( "bad msg.port (case A) for deracer ") +  msg. port )#line 354
    elif  inst. state ==  "waitingForFirst":                #line 355
        if  "1" ==  msg. port:                              #line 356
            inst. buffer. first =  msg                      #line 357
            send_first_then_second ( eh, inst)              #line 358
            inst. state =  "idle"                           #line 359
        else:                                               #line 360
            runtime_error ( str( "bad msg.port (case B) for deracer ") +  msg. port )#line 361
    elif  inst. state ==  "waitingForSecond":               #line 362
        if  "2" ==  msg. port:                              #line 363
            inst. buffer. second =  msg                     #line 364
            send_first_then_second ( eh, inst)              #line 365
            inst. state =  "idle"                           #line 366
        else:                                               #line 367
            runtime_error ( str( "bad msg.port (case C) for deracer ") +  msg. port )#line 368
    else:                                                   #line 369
        runtime_error ( "bad state for deracer {eh.state}") #line 370#line 371#line 372

def low_level_read_text_file_instantiate (reg,owner,name,template_data):#line 373
    name_with_id = gensymbol ( "Low Level Read Text File")  #line 374
    return make_leaf ( name_with_id, owner, None, low_level_read_text_file_handler)#line 375#line 376#line 377

def low_level_read_text_file_handler (eh,msg):              #line 378
    fname =  msg. datum.srepr ()                            #line 379

    try:
        f = open (fname)
    except Exception as e:
        f = None
    if f != None:
        data = f.read ()
        if data!= None:
            send_string (eh, "", data, msg)
        else:
            send_string (eh, "✗", f"read error on file '{fname}'", msg)
        f.close ()
    else:
        send_string (eh, "✗", f"open error on file '{fname}'", msg)
                                                            #line 380#line 381#line 382

def ensure_string_datum_instantiate (reg,owner,name,template_data):#line 383
    name_with_id = gensymbol ( "Ensure String Datum")       #line 384
    return make_leaf ( name_with_id, owner, None, ensure_string_datum_handler)#line 385#line 386#line 387

def ensure_string_datum_handler (eh,msg):                   #line 388
    if  "string" ==  msg. datum.kind ():                    #line 389
        forward ( eh, "", msg)                              #line 390
    else:                                                   #line 391
        emsg =  str( "*** ensure: type error (expected a string datum) but got ") +  msg. datum #line 392
        send_string ( eh, "✗", emsg, msg)                   #line 393#line 394#line 395

class Syncfilewrite_Data:
    def __init__ (self,):                                   #line 396
        self.filename =  ""                                 #line 397#line 398
                                                            #line 399
# temp copy for bootstrap, sends “done“ (error during bootstrap if not wired)#line 400
def syncfilewrite_instantiate (reg,owner,name,template_data):#line 401
    name_with_id = gensymbol ( "syncfilewrite")             #line 402
    inst = Syncfilewrite_Data ()                            #line 403
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)#line 404#line 405#line 406

def syncfilewrite_handler (eh,msg):                         #line 407
    inst =  eh. instance_data                               #line 408
    if  "filename" ==  msg. port:                           #line 409
        inst. filename =  msg. datum.srepr ()               #line 410
    elif  "input" ==  msg. port:                            #line 411
        contents =  msg. datum.srepr ()                     #line 412
        f = open ( inst. filename, "w")                     #line 413
        if  f!= None:                                       #line 414
            f.write ( msg. datum.srepr ())                  #line 415
            f.close ()                                      #line 416
            send ( eh, "done",new_datum_bang (), msg)       #line 417
        else:                                               #line 418
            send_string ( eh, "✗", str( "open error on file ") +  inst. filename , msg)#line 419#line 420#line 421

class StringConcat_Instance_Data:
    def __init__ (self,):                                   #line 422
        self.buffer1 =  None                                #line 423
        self.buffer2 =  None                                #line 424
        self.count =  0                                     #line 425#line 426
                                                            #line 427
def stringconcat_instantiate (reg,owner,name,template_data):#line 428
    name_with_id = gensymbol ( "stringconcat")              #line 429
    instp = StringConcat_Instance_Data ()                   #line 430
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)#line 431#line 432#line 433

def stringconcat_handler (eh,msg):                          #line 434
    inst =  eh. instance_data                               #line 435
    if  "1" ==  msg. port:                                  #line 436
        inst. buffer1 = clone_string ( msg. datum.srepr ()) #line 437
        inst. count =  inst. count+ 1                       #line 438
        maybe_stringconcat ( eh, inst, msg)                 #line 439
    elif  "2" ==  msg. port:                                #line 440
        inst. buffer2 = clone_string ( msg. datum.srepr ()) #line 441
        inst. count =  inst. count+ 1                       #line 442
        maybe_stringconcat ( eh, inst, msg)                 #line 443
    else:                                                   #line 444
        runtime_error ( str( "bad msg.port for stringconcat: ") +  msg. port )#line 445#line 446#line 447#line 448

def maybe_stringconcat (eh,inst,msg):                       #line 449
    if ( 0 == len ( inst. buffer1)) and ( 0 == len ( inst. buffer2)):#line 450
        runtime_error ( "something is wrong in stringconcat, both strings are 0 length")#line 451
    if  inst. count >=  2:                                  #line 452
        concatenated_string =  ""                           #line 453
        if  0 == len ( inst. buffer1):                      #line 454
            concatenated_string =  inst. buffer2            #line 455
        elif  0 == len ( inst. buffer2):                    #line 456
            concatenated_string =  inst. buffer1            #line 457
        else:                                               #line 458
            concatenated_string =  inst. buffer1+ inst. buffer2#line 459
        send_string ( eh, "", concatenated_string, msg)     #line 460
        inst. buffer1 =  None                               #line 461
        inst. buffer2 =  None                               #line 462
        inst. count =  0                                    #line 463#line 464#line 465

#                                                           #line 466#line 467
# this needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here#line 468
def shell_out_instantiate (reg,owner,name,template_data):   #line 469
    name_with_id = gensymbol ( "shell_out")                 #line 470
    cmd = shlex.split ( template_data)                      #line 471
    return make_leaf ( name_with_id, owner, cmd, shell_out_handler)#line 472#line 473#line 474

def shell_out_handler (eh,msg):                             #line 475
    cmd =  eh. instance_data                                #line 476
    s =  msg. datum.srepr ()                                #line 477
    ret =  None                                             #line 478
    rc =  None                                              #line 479
    stdout =  None                                          #line 480
    stderr =  None                                          #line 481
    ret = subprocess.run ( cmd,   s, "UTF_8")
    rc = ret.returncode
    stdout = ret.stdout
    stderr = ret.stderr                                     #line 482
    if  rc!= 0:                                             #line 483
        send_string ( eh, "✗", stderr, msg)                 #line 484
    else:                                                   #line 485
        send_string ( eh, "", stdout, msg)                  #line 486#line 487#line 488#line 489

def string_constant_instantiate (reg,owner,name,template_data):#line 490
    global root_project                                     #line 491
    global root_0D                                          #line 492
    name_with_id = gensymbol ( "strconst")                  #line 493
    s =  template_data                                      #line 494
    if  root_project!= "":                                  #line 495
        s = re.sub ( "_00_",  root_project,  s)             #line 496#line 497
    if  root_0D!= "":                                       #line 498
        s = re.sub ( "_0D_",  root_0D,  s)                  #line 499#line 500
    return make_leaf ( name_with_id, owner, s, string_constant_handler)#line 501#line 502#line 503

def string_constant_handler (eh,msg):                       #line 504
    s =  eh. instance_data                                  #line 505
    send_string ( eh, "", s, msg)                           #line 506#line 507#line 508

def string_make_persistent (s):                             #line 509
    # this is here for non_GC languages like Odin, it is a no_op for GC languages like Python#line 510
    return  s                                               #line 511#line 512#line 513

def string_clone (s):                                       #line 514
    return  s                                               #line 515#line 516#line 517

# usage: app ${_00_} ${_0D_} arg main diagram_filename1 diagram_filename2 ...#line 518
# where ${_00_} is the root directory for the project       #line 519
# where ${_0D_} is the root directory for 0D (e.g. 0D/odin or 0D/python)#line 520#line 521#line 522#line 523
def initialize_component_palette (root_project,root_0D,diagram_source_files):#line 524
    reg = make_component_registry ()                        #line 525
    for diagram_source in  diagram_source_files:            #line 526
        all_containers_within_single_file = json2internal ( diagram_source)#line 527
        generate_shell_components ( reg, all_containers_within_single_file)#line 528
        for container in  all_containers_within_single_file:#line 529
            register_component ( reg,Template ( container ["name"], container, container_instantiator))#line 530
    initialize_stock_components ( reg)                      #line 531
    return  reg                                             #line 532#line 533#line 534

def print_error_maybe (main_container):                     #line 535
    error_port =  "✗"                                       #line 536
    err = fetch_first_output ( main_container, error_port)  #line 537
    if ( err!= None) and ( 0 < len (trimws ( err.srepr ()))):#line 538
        print ( "___ !!! ERRORS !!! ___")                   #line 539
        print_specific_output ( main_container, error_port) #line 540#line 541#line 542

# debugging helpers                                         #line 543#line 544
def nl ():                                                  #line 545
    print ( "")                                             #line 546#line 547#line 548

def dump_outputs (main_container):                          #line 549
    nl ()                                                   #line 550
    print ( "___ Outputs ___")                              #line 551
    print_output_list ( main_container)                     #line 552#line 553#line 554

def trimws (s):                                             #line 555
    # remove whitespace from front and back of string       #line 556
    return  s.strip ()                                      #line 557#line 558#line 559

def clone_string (s):                                       #line 560
    return  s                                               #line 561#line 562#line 563

load_errors =  False                                        #line 564
runtime_errors =  False                                     #line 565#line 566
def load_error (s):                                         #line 567
    global load_errors                                      #line 568
    print ( s)                                              #line 569
    quit ()                                                 #line 570
    load_errors =  True                                     #line 571#line 572#line 573

def runtime_error (s):                                      #line 574
    global runtime_errors                                   #line 575
    print ( s)                                              #line 576
    quit ()                                                 #line 577
    runtime_errors =  True                                  #line 578#line 579#line 580

def fakepipename_instantiate (reg,owner,name,template_data):#line 581
    instance_name = gensymbol ( "fakepipe")                 #line 582
    return make_leaf ( instance_name, owner, None, fakepipename_handler)#line 583#line 584#line 585

rand =  0                                                   #line 586#line 587
def fakepipename_handler (eh,msg):                          #line 588
    global rand                                             #line 589
    rand =  rand+ 1
    # not very random, but good enough _ 'rand' must be unique within a single run#line 590
    send_string ( eh, "", str( "/tmp/fakepipe") +  rand , msg)#line 591#line 592#line 593
                                                            #line 594
# all of the the built_in leaves are listed here            #line 595
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 596#line 597#line 598
def initialize_stock_components (reg):                      #line 599
    register_component ( reg,Template ( "1then2", None, deracer_instantiate))#line 600
    register_component ( reg,Template ( "?", None, probe_instantiate))#line 601
    register_component ( reg,Template ( "?A", None, probeA_instantiate))#line 602
    register_component ( reg,Template ( "?B", None, probeB_instantiate))#line 603
    register_component ( reg,Template ( "?C", None, probeC_instantiate))#line 604
    register_component ( reg,Template ( "trash", None, trash_instantiate))#line 605#line 606
    register_component ( reg,Template ( "Low Level Read Text File", None, low_level_read_text_file_instantiate))#line 607
    register_component ( reg,Template ( "Ensure String Datum", None, ensure_string_datum_instantiate))#line 608#line 609
    register_component ( reg,Template ( "syncfilewrite", None, syncfilewrite_instantiate))#line 610
    register_component ( reg,Template ( "stringconcat", None, stringconcat_instantiate))#line 611
    # for fakepipe                                          #line 612
    register_component ( reg,Template ( "fakepipename", None, fakepipename_instantiate))#line 613#line 614#line 615

def argv ():                                                #line 616
    sys.argv                                                #line 617#line 618#line 619

def initialize ():                                          #line 620
    root_of_project =  sys.argv[ 1]                         #line 621
    root_of_0D =  sys.argv[ 2]                              #line 622
    arg =  sys.argv[ 3]                                     #line 623
    main_container_name =  sys.argv[ 4]                     #line 624
    diagram_names =  sys.argv[ 5:]                          #line 625
    palette = initialize_component_palette ( root_project, root_0D, diagram_names)#line 626
    return [ palette,[ root_of_project, root_of_0D, main_container_name, diagram_names, arg]]#line 627#line 628#line 629

def start (palette,env):
    start_helper ( palette, env, False)                     #line 630

def start_show_all (palette,env):
    start_helper ( palette, env, True)                      #line 631

def start_helper (palette,env,show_all_outputs):            #line 632
    root_of_project =  env [ 0]                             #line 633
    root_of_0D =  env [ 1]                                  #line 634
    main_container_name =  env [ 2]                         #line 635
    diagram_names =  env [ 3]                               #line 636
    arg =  env [ 4]                                         #line 637
    set_environment ( root_of_project, root_of_0D)          #line 638
    # get entrypoint container                              #line 639
    main_container = get_component_instance ( palette, main_container_name, None)#line 640
    if  None ==  main_container:                            #line 641
        load_error ( str( "Couldn't find container with page name ") +  str( main_container_name) +  str( " in files ") +  str( diagram_names) +  "(check tab names, or disable compression?)"    )#line 645#line 646
    if not  load_errors:                                    #line 647
        arg = new_datum_string ( arg)                       #line 648
        msg = make_message ( "", arg)                       #line 649
        inject ( main_container, msg)                       #line 650
        if  show_all_outputs:                               #line 651
            dump_outputs ( main_container)                  #line 652
        else:                                               #line 653
            print_error_maybe ( main_container)             #line 654
            outp = fetch_first_output ( main_container, "") #line 655
            if  None ==  outp:                              #line 656
                print ( "(no outputs)")                     #line 657
            else:                                           #line 658
                print_specific_output ( main_container, "") #line 659#line 660#line 661
        if  show_all_outputs:                               #line 662
            print ( "--- done ---")                         #line 663#line 664#line 665#line 666#line 667
                                                            #line 668#line 669
# utility functions                                         #line 670
def send_int (eh,port,i,causing_message):                   #line 671
    datum = new_datum_int ( i)                              #line 672
    send ( eh, port, datum, causing_message)                #line 673#line 674#line 675

def send_bang (eh,port,causing_message):                    #line 676
    datum = new_datum_bang ()                               #line 677
    send ( eh, port, datum, causing_message)                #line 678#line 679#line 680







count_counter =  0                                          #line 1
direction =  1                                              #line 2#line 3
def count_handler (eh,msg):                                 #line 4
    global count_counter, direction                         #line 5
    if  msg. port ==  "adv":                                #line 6
        count_counter =  count_counter+ direction           #line 7
        send_int ( eh, "", count_counter, msg)              #line 8
    elif  msg. port ==  "rev":                              #line 9
        direction =  direction* - 1                         #line 10#line 11#line 12#line 13

def count_instantiator (reg,owner,name,template_data):      #line 14
    name_with_id = gensymbol ( "Count")                     #line 15
    return make_leaf ( name_with_id, owner, None, count_handler)#line 16#line 17#line 18

def count_install (reg):                                    #line 19
    register_component ( reg,Template ( "Count", None, count_instantiator))#line 20#line 21#line 22







def decode_install (reg):                                   #line 1
    register_component ( reg,Template ( "Decode", None, decode_instantiator))#line 2#line 3#line 4

decode_digits = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]#line 5
def decode_handler (eh,msg):                                #line 6
    global decode_digits                                    #line 7
    i = int ( msg. datum.raw ())                            #line 8
    if  i >=  0 and  i <=  9:                               #line 9
        send_string ( eh, decode_digits [ i], decode_digits [ i], msg)#line 10#line 11
    send_bang ( eh, "done", msg)                            #line 12#line 13#line 14

def decode_instantiator (reg,owner,name,template_data):     #line 15
    name_with_id = gensymbol ( "Decode")                    #line 16
    return make_leaf ( name_with_id, owner, None, decode_handler)#line 17







def reverser_install (reg):                                 #line 1
    register_component ( reg,Template ( "Reverser", None, reverser_instantiator))#line 2#line 3#line 4

reverser_state =  "J"                                       #line 5#line 6
def reverser_handler (eh,msg):                              #line 7
    global reverser_state                                   #line 8
    if  reverser_state ==  "K":                             #line 9
        if  msg. port ==  "J":                              #line 10
            send_bang ( eh, "", msg)                        #line 11
            reverser_state =  "J"                           #line 12
        else:                                               #line 13
            pass                                            #line 14#line 15
    elif  reverser_state ==  "J":                           #line 16
        if  msg. port ==  "K":                              #line 17
            send_bang ( eh, "", msg)                        #line 18
            reverser_state =  "K"                           #line 19
        else:                                               #line 20
            pass                                            #line 21#line 22#line 23#line 24#line 25

def reverser_instantiator (reg,owner,name,template_data):   #line 26
    name_with_id = gensymbol ( "Reverser")                  #line 27
    return make_leaf ( name_with_id, owner, None, reverser_handler)#line 28#line 29







def delay_install (reg):                                    #line 1
    register_component ( reg,Template ( "Delay", None, delay_instantiator))#line 2#line 3#line 4

class Delay_Info:
    def __init__ (self,):                                   #line 5
        self.counter =  0                                   #line 6
        self.saved_message =  None                          #line 7#line 8
                                                            #line 9
def delay_instantiator (reg,owner,name,template_data):      #line 10
    name_with_id = gensymbol ( "delay")                     #line 11
    info = Delay_Info ()                                    #line 12
    return make_leaf ( name_with_id, owner, info, delay_handler)#line 13#line 14#line 15

DELAYDELAY =  50000                                         #line 16#line 17
def first_time (m):                                         #line 18
    return not is_tick ( m)                                 #line 19#line 20#line 21

def delay_handler (eh,msg):                                 #line 22
    info =  eh. instance_data                               #line 23
    if first_time ( msg):                                   #line 24
        info. saved_message =  msg                          #line 25
        set_active ( eh)
        # tell engine to keep running this component with ;ticks' #line 26#line 27#line 28
    count =  info. counter                                  #line 29
    next =  count+ 1                                        #line 30
    if  info. counter >=  DELAYDELAY:                       #line 31
        set_idle ( eh)
        # tell engine that we're finally done               #line 32
        forward ( eh, "", info. saved_message)              #line 33
        next =  0                                           #line 34#line 35
    info. counter =  next                                   #line 36#line 37#line 38







def monitor_install (reg):                                  #line 1
    register_component ( reg,Template ( "@", None, monitor_instantiator))#line 2#line 3#line 4

def monitor_instantiator (reg,owner,name,template_data):    #line 5
    name_with_id = gensymbol ( "@")                         #line 6
    return make_leaf ( name_with_id, owner, None, monitor_handler)#line 7#line 8#line 9

def monitor_handler (eh,msg):                               #line 10
    s =  msg. datum.srepr ()                                #line 11
    i = int ( s)                                            #line 12
    while  i >  0:                                          #line 13
        s =  str( " ") +  s                                 #line 14
        i =  i- 1                                           #line 15#line 16
    print ( s)                                              #line 17#line 18





[palette, env] = initialize ()

delay_install (palette)
count_install (palette)
reverser_install (palette)
decode_install (palette)
monitor_install (palette)

start (palette, env)
