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

def step_child_once (child,mev):                       #line 293
    began_long_run =  None                             #line 294
    continued_long_run =  None                         #line 295
    ended_long_run =  None                             #line 296
    [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, mev)#line 297#line 298#line 299

def step_children (container,causingMevent):           #line 300
    container.state =  "idle"                          #line 301
    for child in  list ( container.visit_ordering):    #line 302
        # child = container represents self, skip it   #line 303
        if (not (is_self ( child, container))):        #line 304
            if (not ((0==len( child.inq)))):           #line 305
                mev =  child.inq.popleft ()            #line 306
                step_child_once ( child, mev)          #line 307#line 308
                destroy_mevent ( mev)                  #line 309
            else:                                      #line 310
                if  child.state!= "idle":              #line 311
                    mev = force_tick ( container, child)#line 312
                    step_child_once ( child, mev)      #line 313
                    destroy_mevent ( mev)              #line 314#line 315#line 316#line 317
            if  child.state ==  "active":              #line 318
                # if child remains active, then the container must remain active and must propagate “ticks“ to child#line 319
                container.state =  "active"            #line 320#line 321#line 322
            while (not ((0==len( child.outq)))):       #line 323
                mev =  child.outq.popleft ()           #line 324
                route ( container, child, mev)         #line 325
                destroy_mevent ( mev)                  #line 326#line 327#line 328#line 329#line 330#line 331

def attempt_tick (parent,eh):                          #line 332
    if  eh.state!= "idle":                             #line 333
        force_tick ( parent, eh)                       #line 334#line 335#line 336#line 337

def is_tick (mev):                                     #line 338
    return  "." ==  mev.port
    # assume that any mevent that is sent to port "." is a tick #line 339#line 340#line 341

# Routes a single mevent to all matching destinations, according to#line 342
# the container's connection network.                  #line 343#line 344
def route (container,from_component,mevent):           #line 345
    was_sent =  False
    # for checking that output went somewhere (at least during bootstrap)#line 346
    fromname =  ""                                     #line 347
    global ticktime                                    #line 348
    ticktime =  ticktime+ 1                            #line 349
    if is_tick ( mevent):                              #line 350
        for child in  container.children:              #line 351
            attempt_tick ( container, child)           #line 352
        was_sent =  True                               #line 353
    else:                                              #line 354
        if (not (is_self ( from_component, container))):#line 355
            fromname =  from_component.name            #line 356#line 357
        from_sender = mkSender ( fromname, from_component, mevent.port)#line 358#line 359
        for connector in  container.connections:       #line 360
            if sender_eq ( from_sender, connector.sender):#line 361
                deposit ( container, connector, mevent)#line 362
                was_sent =  True                       #line 363#line 364#line 365#line 366
    if not ( was_sent):                                #line 367
        live_update ( "✗",  str( container.name) +  str( ": mevent '") +  str( mevent.port) +  str( "' from ") +  str( fromname) +  " dropped on floor..."     )#line 368#line 369#line 370#line 371

def any_child_ready (container):                       #line 372
    for child in  container.children:                  #line 373
        if child_is_ready ( child):                    #line 374
            return  True                               #line 375#line 376#line 377
    return  False                                      #line 378#line 379#line 380

def child_is_ready (eh):                               #line 381
    return (not ((0==len( eh.outq)))) or (not ((0==len( eh.inq)))) or ( eh.state!= "idle") or (any_child_ready ( eh))#line 382#line 383#line 384

def append_routing_descriptor (container,desc):        #line 385
    container.routings.append ( desc)                  #line 386#line 387#line 388

def injector (eh,mevent):                              #line 389
    eh.handler ( eh, mevent)                           #line 390#line 391#line 392
                                                       #line 393#line 394#line 395
class Component_Registry:
    def __init__ (self,):                              #line 396
        self.templates = {}                            #line 397#line 398
                                                       #line 399
class Template:
    def __init__ (self,):                              #line 400
        self.name =  None                              #line 401
        self.container =  None                         #line 402
        self.instantiator =  None                      #line 403#line 404
                                                       #line 405
def mkTemplate (name,template_data,instantiator):      #line 406
    templ =  Template ()                               #line 407
    templ.name =  name                                 #line 408
    templ.template_data =  template_data               #line 409
    templ.instantiator =  instantiator                 #line 410
    return  templ                                      #line 411#line 412#line 413
                                                       #line 414
def lnet2internal_from_file (pathname,container_xml):  #line 415
    filename =  os.path.basename ( container_xml)      #line 416

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
                                                       #line 417#line 418#line 419

def lnet2internal_from_string (lnet):                  #line 420

    try:
        routings = json.loads(lnet)
        return routings
    except json.JSONDecodeError as e:
        print ("Error decoding JSON from string 'lnet': '{e}'")
        return None
                                                       #line 421#line 422#line 423

def delete_decls (d):                                  #line 424
    pass                                               #line 425#line 426#line 427

def make_component_registry ():                        #line 428
    return  Component_Registry ()                      #line 429#line 430#line 431

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 432

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 433#line 434

def abstracted_register_component (reg,template,ok_to_overwrite):#line 435
    name = mangle_name ( template.name)                #line 436
    if  reg!= None and  name in  reg.templates and not  ok_to_overwrite:#line 437
        load_error ( str( "Component /") +  str( template.name) +  "/ already declared"  )#line 438
        return  reg                                    #line 439
    else:                                              #line 440
        reg.templates [name] =  template               #line 441
        return  reg                                    #line 442#line 443#line 444#line 445

def get_component_instance (reg,full_name,owner):      #line 446
    template_name = mangle_name ( full_name)           #line 447
    if  ":" ==   full_name[0] :                        #line 448
        instance_name = generate_instance_name ( owner, template_name)#line 449
        instance = external_instantiate ( reg, owner, instance_name, full_name)#line 450
        return  instance                               #line 451
    else:                                              #line 452
        if  template_name in  reg.templates:           #line 453
            template =  reg.templates [template_name]  #line 454
            if ( template ==  None):                   #line 455
                load_error ( str( "Registry Error (A): Can't find component /") +  str( template_name) +  "/"  )#line 456
                return  None                           #line 457
            else:                                      #line 458
                instance_name = generate_instance_name ( owner, template_name)#line 459
                instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")#line 460
                return  instance                       #line 461#line 462
        else:                                          #line 463
            load_error ( str( "Registry Error (B): Can't find component /") +  str( template_name) +  "/"  )#line 464
            return  None                               #line 465#line 466#line 467#line 468#line 469

def generate_instance_name (owner,template_name):      #line 470
    owner_name =  ""                                   #line 471
    instance_name =  template_name                     #line 472
    if  None!= owner:                                  #line 473
        owner_name =  owner.name                       #line 474
        instance_name =  str( owner_name) +  str( "▹") +  template_name  #line 475
    else:                                              #line 476
        instance_name =  template_name                 #line 477#line 478
    return  instance_name                              #line 479#line 480#line 481

def mangle_name (s):                                   #line 482
    # trim name to remove code from Container component names _ deferred until later (or never)#line 483
    return  s                                          #line 484#line 485#line 486
                                                       #line 487
# Data for an asyncronous component _ effectively, a function with input#line 488
# and output queues of mevents.                        #line 489
#                                                      #line 490
# Components can either be a user_supplied function (“leaf“), or a “container“#line 491
# that routes mevents to child components according to a list of connections#line 492
# that serve as a mevent routing table.                #line 493
#                                                      #line 494
# Child components themselves can be leaves or other containers.#line 495
#                                                      #line 496
# `handler` invokes the code that is attached to this component.#line 497
#                                                      #line 498
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 499
# function may want whenever it is invoked again.      #line 500
#                                                      #line 501#line 502
# Eh_States :: enum { idle, active }                   #line 503
class Eh:
    def __init__ (self,):                              #line 504
        self.name =  ""                                #line 505
        self.inq =  deque ([])                         #line 506
        self.outq =  deque ([])                        #line 507
        self.owner =  None                             #line 508
        self.children = []                             #line 509
        self.visit_ordering =  deque ([])              #line 510
        self.connections = []                          #line 511
        self.routings =  deque ([])                    #line 512
        self.handler =  None                           #line 513
        self.finject =  None                           #line 514
        self.instance_data =  None                     #line 515# arg needed for probe support #line 516
        self.arg =  ""                                 #line 517
        self.state =  "idle"                           #line 518# bootstrap debugging#line 519
        self.kind =  None # enum { container, leaf, }  #line 520#line 521
                                                       #line 522
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 523
# whose handler function is `container_handler`.       #line 524
def make_container (name,owner):                       #line 525
    eh =  Eh ()                                        #line 526
    eh.name =  name                                    #line 527
    eh.owner =  owner                                  #line 528
    eh.handler =  container_handler                    #line 529
    eh.finject =  injector                             #line 530
    eh.state =  "idle"                                 #line 531
    eh.kind =  "container"                             #line 532
    return  eh                                         #line 533#line 534#line 535

# Creates a new leaf component out of a handler function, and a data parameter#line 536
# that will be passed back to your handler when called.#line 537#line 538
def make_leaf (name,owner,container,arg,handler):      #line 539
    eh =  Eh ()                                        #line 540
    nm =  ""                                           #line 541
    if  None!= owner:                                  #line 542
        nm =  owner.name                               #line 543#line 544
    eh.name =  str( nm) +  str( "▹") +  name           #line 545
    eh.owner =  owner                                  #line 546
    eh.handler =  handler                              #line 547
    eh.finject =  injector                             #line 548
    eh.instance_data =  container                      #line 549
    eh.arg =  arg                                      #line 550
    eh.state =  "idle"                                 #line 551
    eh.kind =  "leaf"                                  #line 552
    return  eh                                         #line 553#line 554#line 555

# Sends a mevent on the given `port` with `data`, placing it on the output#line 556
# of the given component.                              #line 557#line 558
def send (eh,port,obj,causingMevent):                  #line 559
    d = Datum ()                                       #line 560
    d.v =  obj                                         #line 561
    d.clone =  lambda : obj_clone ( d)                 #line 562
    d.reclaim =  None                                  #line 563
    mev = make_mevent ( port, d)                       #line 564
    put_output ( eh, mev)                              #line 565#line 566#line 567

def forward (eh,port,mev):                             #line 568
    fwdmev = make_mevent ( port, mev.datum)            #line 569
    put_output ( eh, fwdmev)                           #line 570#line 571#line 572

def inject_mevent (eh,mev):                            #line 573
    eh.finject ( eh, mev)                              #line 574#line 575#line 576

def set_active (eh):                                   #line 577
    eh.state =  "active"                               #line 578#line 579#line 580

def set_idle (eh):                                     #line 581
    eh.state =  "idle"                                 #line 582#line 583#line 584

def put_output (eh,mev):                               #line 585
    eh.outq.append ( mev)                              #line 586#line 587#line 588

projectRoot =  ""                                      #line 589#line 590
def set_environment (project_root):                    #line 591
    global projectRoot                                 #line 592
    projectRoot =  project_root                        #line 593#line 594#line 595

def obj_clone (obj):                                   #line 596
    return  obj                                        #line 597#line 598#line 599

# usage: app ${_00_} diagram_filename1 diagram_filename2 ...#line 600
# where ${_00_} is the root directory for the project  #line 601#line 602
def initialize_component_palette_from_files (project_root,diagram_source_files):#line 603
    reg = make_component_registry ()                   #line 604
    for diagram_source in  diagram_source_files:       #line 605
        all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)#line 606
        reg = generate_external_components ( reg, all_containers_within_single_file)#line 607
        for container in  all_containers_within_single_file:#line 608
            register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 609#line 610#line 611
    initialize_stock_components ( reg)                 #line 612
    return  reg                                        #line 613#line 614#line 615

def initialize_component_palette_from_string (project_root,lnet):#line 616
    # this version ignores project_root                #line 617
    reg = make_component_registry ()                   #line 618
    all_containers = lnet2internal_from_string ( lnet) #line 619
    reg = generate_external_components ( reg, all_containers)#line 620
    for container in  all_containers:                  #line 621
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 622#line 623
    initialize_stock_components ( reg)                 #line 624
    return  reg                                        #line 625#line 626#line 627
                                                       #line 628
def clone_string (s):                                  #line 629
    return  s                                          #line 630#line 631#line 632

load_errors =  False                                   #line 633
runtime_errors =  False                                #line 634#line 635
def load_error (s):                                    #line 636
    global load_errors                                 #line 637
    print ( s, file=sys.stderr)                        #line 638
                                                       #line 639
    load_errors =  True                                #line 640#line 641#line 642

def runtime_error (s):                                 #line 643
    global runtime_errors                              #line 644
    print ( s, file=sys.stderr)                        #line 645
    runtime_errors =  True                             #line 646#line 647#line 648
                                                       #line 649
def initialize_from_files (project_root,diagram_names):#line 650
    arg =  None                                        #line 651
    palette = initialize_component_palette_from_files ( project_root, diagram_names)#line 652
    return [ palette,[ project_root, diagram_names, arg]]#line 653#line 654#line 655

def initialize_from_string (project_root):             #line 656
    arg =  None                                        #line 657
    palette = initialize_component_palette_from_string ( project_root)#line 658
    return [ palette,[ project_root, None, arg]]       #line 659#line 660#line 661

def start (arg,part_name,palette,env):                 #line 662
    part = start_bare ( part_name, palette, env)       #line 663
    inject ( part, "", arg)                            #line 664
    finalize ( part)                                   #line 665#line 666#line 667

def start_bare (part_name,palette,env):                #line 668
    project_root =  env [ 0]                           #line 669
    diagram_names =  env [ 1]                          #line 670
    set_environment ( project_root)                    #line 671
    # get entrypoint container                         #line 672
    part = get_component_instance ( palette, part_name, None)#line 673
    if  None ==  part:                                 #line 674
        load_error ( str( "Couldn't find container with page name /") +  str( part_name) +  str( "/ in files ") +  str(str ( diagram_names)) +  " (check tab names, or disable compression?)"    )#line 678#line 679
    return  part                                       #line 680#line 681#line 682

def inject (part,port,payload):                        #line 683
    if not  load_errors:                               #line 684
        d = Datum ()                                   #line 685
        d.v =  payload                                 #line 686
        d.clone =  lambda : obj_clone ( d)             #line 687
        d.reclaim =  None                              #line 688
        mev = make_mevent ( port, d)                   #line 689
        inject_mevent ( part, mev)                     #line 690
    else:                                              #line 691
        exit (1)                                       #line 692#line 693#line 694#line 695

def finalize (part):                                   #line 696
    print (deque_to_json ( part.outq))                 #line 697#line 698#line 699

def new_datum_bang ():                                 #line 700
    d = Datum ()                                       #line 701
    d.v =  "!"                                         #line 702
    d.clone =  lambda : obj_clone ( d)                 #line 703
    d.reclaim =  None                                  #line 704
    return  d                                          #line 705#line 706
