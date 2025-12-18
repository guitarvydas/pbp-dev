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

def step_child_once (child,mev):                       #line 284
    before_state =  child.state                        #line 285
    child.handler ( child, mev)                        #line 286
    after_state =  child.state                         #line 287
    return [ before_state ==  "idle" and  after_state!= "idle", before_state!= "idle" and  after_state!= "idle", before_state!= "idle" and  after_state ==  "idle"]#line 290#line 291#line 292

def step_children (container,causingMevent):           #line 293
    container.state =  "idle"                          #line 294#line 295
    # phase 1 - loop through children and process inputs or children that not "idle" #line 296
    for child in  list ( container.visit_ordering):    #line 297
        # child = container represents self, skip it   #line 298
        if (not (is_self ( child, container))):        #line 299
            if (not ((0==len( child.inq)))):           #line 300
                mev =  child.inq.popleft ()            #line 301
                step_child_once ( child, mev)          #line 302#line 303
                destroy_mevent ( mev)                  #line 304
            else:                                      #line 305
                if  child.state!= "idle":              #line 306
                    mev = force_tick ( container, child)#line 307
                    step_child_once ( child, mev)      #line 308
                    destroy_mevent ( mev)              #line 309#line 310#line 311#line 312#line 313

    container.visit_ordering = deque ([])              #line 314#line 315
    # phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections #line 316
    for child in  container.children:                  #line 317
        if  child.state ==  "active":                  #line 318
            # if child remains active, then the container must remain active and must propagate “ticks“ to child#line 319
            container.state =  "active"                #line 320#line 321#line 322
        while (not ((0==len( child.outq)))):           #line 323
            mev =  child.outq.popleft ()               #line 324
            route ( container, child, mev)             #line 325
            destroy_mevent ( mev)                      #line 326#line 327#line 328#line 329#line 330

def attempt_tick (parent,eh):                          #line 331
    if  eh.state!= "idle":                             #line 332
        force_tick ( parent, eh)                       #line 333#line 334#line 335#line 336

def is_tick (mev):                                     #line 337
    return  "." ==  mev.port
    # assume that any mevent that is sent to port "." is a tick #line 338#line 339#line 340

# Routes a single mevent to all matching destinations, according to#line 341
# the container's connection network.                  #line 342#line 343
def route (container,from_component,mevent):           #line 344
    was_sent =  False
    # for checking that output went somewhere (at least during bootstrap)#line 345
    fromname =  ""                                     #line 346
    global ticktime                                    #line 347
    ticktime =  ticktime+ 1                            #line 348
    if is_tick ( mevent):                              #line 349
        for child in  container.children:              #line 350
            attempt_tick ( container, child)           #line 351
        was_sent =  True                               #line 352
    else:                                              #line 353
        if (not (is_self ( from_component, container))):#line 354
            fromname =  from_component.name            #line 355#line 356
        from_sender = mkSender ( fromname, from_component, mevent.port)#line 357#line 358
        for connector in  container.connections:       #line 359
            if sender_eq ( from_sender, connector.sender):#line 360
                deposit ( container, connector, mevent)#line 361
                was_sent =  True                       #line 362#line 363#line 364#line 365
    if not ( was_sent):                                #line 366
        live_update ( "✗",  str( container.name) +  str( ": mevent '") +  str( mevent.port) +  str( "' from ") +  str( fromname) +  " dropped on floor..."     )#line 367#line 368#line 369#line 370

def any_child_ready (container):                       #line 371
    for child in  container.children:                  #line 372
        if child_is_ready ( child):                    #line 373
            return  True                               #line 374#line 375#line 376
    return  False                                      #line 377#line 378#line 379

def child_is_ready (eh):                               #line 380
    return (not ((0==len( eh.outq)))) or (not ((0==len( eh.inq)))) or ( eh.state!= "idle") or (any_child_ready ( eh))#line 381#line 382#line 383

def append_routing_descriptor (container,desc):        #line 384
    container.routings.append ( desc)                  #line 385#line 386#line 387

def injector (eh,mevent):                              #line 388
    eh.handler ( eh, mevent)                           #line 389#line 390#line 391
                                                       #line 392#line 393#line 394
class Component_Registry:
    def __init__ (self,):                              #line 395
        self.templates = {}                            #line 396#line 397
                                                       #line 398
class Template:
    def __init__ (self,):                              #line 399
        self.name =  None                              #line 400
        self.container =  None                         #line 401
        self.instantiator =  None                      #line 402#line 403
                                                       #line 404
def mkTemplate (name,template_data,instantiator):      #line 405
    templ =  Template ()                               #line 406
    templ.name =  name                                 #line 407
    templ.template_data =  template_data               #line 408
    templ.instantiator =  instantiator                 #line 409
    return  templ                                      #line 410#line 411#line 412
                                                       #line 413
def lnet2internal_from_file (pathname,container_xml):  #line 414
    filename =  os.path.basename ( container_xml)      #line 415

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
                                                       #line 416#line 417#line 418

def lnet2internal_from_string (lnet):                  #line 419

    try:
        routings = json.loads(lnet)
        return routings
    except json.JSONDecodeError as e:
        print ("Error decoding JSON from string 'lnet': '{e}'")
        return None
                                                       #line 420#line 421#line 422

def delete_decls (d):                                  #line 423
    pass                                               #line 424#line 425#line 426

def make_component_registry ():                        #line 427
    return  Component_Registry ()                      #line 428#line 429#line 430

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 431

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 432#line 433

def abstracted_register_component (reg,template,ok_to_overwrite):#line 434
    name = mangle_name ( template.name)                #line 435
    if  reg!= None and  name in  reg.templates and not  ok_to_overwrite:#line 436
        load_error ( str( "Component /") +  str( template.name) +  "/ already declared"  )#line 437
        return  reg                                    #line 438
    else:                                              #line 439
        reg.templates [name] =  template               #line 440
        return  reg                                    #line 441#line 442#line 443#line 444

def get_component_instance (reg,full_name,owner):      #line 445
    template_name = mangle_name ( full_name)           #line 446
    if  ":" ==   full_name[0] :                        #line 447
        instance_name = generate_instance_name ( owner, template_name)#line 448
        instance = external_instantiate ( reg, owner, instance_name, full_name)#line 449
        return  instance                               #line 450
    else:                                              #line 451
        if  template_name in  reg.templates:           #line 452
            template =  reg.templates [template_name]  #line 453
            if ( template ==  None):                   #line 454
                load_error ( str( "Registry Error (A): Can't find component /") +  str( template_name) +  "/"  )#line 455
                return  None                           #line 456
            else:                                      #line 457
                instance_name = generate_instance_name ( owner, template_name)#line 458
                instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")#line 459
                return  instance                       #line 460#line 461
        else:                                          #line 462
            load_error ( str( "Registry Error (B): Can't find component /") +  str( template_name) +  "/"  )#line 463
            return  None                               #line 464#line 465#line 466#line 467#line 468

def generate_instance_name (owner,template_name):      #line 469
    owner_name =  ""                                   #line 470
    instance_name =  template_name                     #line 471
    if  None!= owner:                                  #line 472
        owner_name =  owner.name                       #line 473
        instance_name =  str( owner_name) +  str( "▹") +  template_name  #line 474
    else:                                              #line 475
        instance_name =  template_name                 #line 476#line 477
    return  instance_name                              #line 478#line 479#line 480

def mangle_name (s):                                   #line 481
    # trim name to remove code from Container component names _ deferred until later (or never)#line 482
    return  s                                          #line 483#line 484#line 485
                                                       #line 486
# Data for an asyncronous component _ effectively, a function with input#line 487
# and output queues of mevents.                        #line 488
#                                                      #line 489
# Components can either be a user_supplied function (“leaf“), or a “container“#line 490
# that routes mevents to child components according to a list of connections#line 491
# that serve as a mevent routing table.                #line 492
#                                                      #line 493
# Child components themselves can be leaves or other containers.#line 494
#                                                      #line 495
# `handler` invokes the code that is attached to this component.#line 496
#                                                      #line 497
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 498
# function may want whenever it is invoked again.      #line 499
#                                                      #line 500#line 501
# Eh_States :: enum { idle, active }                   #line 502
class Eh:
    def __init__ (self,):                              #line 503
        self.name =  ""                                #line 504
        self.inq =  deque ([])                         #line 505
        self.outq =  deque ([])                        #line 506
        self.owner =  None                             #line 507
        self.children = []                             #line 508
        self.visit_ordering =  deque ([])              #line 509
        self.connections = []                          #line 510
        self.routings =  deque ([])                    #line 511
        self.handler =  None                           #line 512
        self.finject =  None                           #line 513
        self.instance_data =  None                     #line 514# arg needed for probe support #line 515
        self.arg =  ""                                 #line 516
        self.state =  "idle"                           #line 517# bootstrap debugging#line 518
        self.kind =  None # enum { container, leaf, }  #line 519#line 520
                                                       #line 521
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 522
# whose handler function is `container_handler`.       #line 523
def make_container (name,owner):                       #line 524
    eh =  Eh ()                                        #line 525
    eh.name =  name                                    #line 526
    eh.owner =  owner                                  #line 527
    eh.handler =  container_handler                    #line 528
    eh.finject =  injector                             #line 529
    eh.state =  "idle"                                 #line 530
    eh.kind =  "container"                             #line 531
    return  eh                                         #line 532#line 533#line 534

# Creates a new leaf component out of a handler function, and a data parameter#line 535
# that will be passed back to your handler when called.#line 536#line 537
def make_leaf (name,owner,container,arg,handler):      #line 538
    eh =  Eh ()                                        #line 539
    nm =  ""                                           #line 540
    if  None!= owner:                                  #line 541
        nm =  owner.name                               #line 542#line 543
    eh.name =  str( nm) +  str( "▹") +  name           #line 544
    eh.owner =  owner                                  #line 545
    eh.handler =  handler                              #line 546
    eh.finject =  injector                             #line 547
    eh.instance_data =  container                      #line 548
    eh.arg =  arg                                      #line 549
    eh.state =  "idle"                                 #line 550
    eh.kind =  "leaf"                                  #line 551
    return  eh                                         #line 552#line 553#line 554

# Sends a mevent on the given `port` with `data`, placing it on the output#line 555
# of the given component.                              #line 556#line 557
def send (eh,port,obj,causingMevent):                  #line 558
    d = Datum ()                                       #line 559
    d.v =  obj                                         #line 560
    d.clone =  lambda : obj_clone ( d)                 #line 561
    d.reclaim =  None                                  #line 562
    mev = make_mevent ( port, d)                       #line 563
    put_output ( eh, mev)                              #line 564#line 565#line 566

def forward (eh,port,mev):                             #line 567
    fwdmev = make_mevent ( port, mev.datum)            #line 568
    put_output ( eh, fwdmev)                           #line 569#line 570#line 571

def inject_mevent (eh,mev):                            #line 572
    eh.finject ( eh, mev)                              #line 573#line 574#line 575

def set_active (eh):                                   #line 576
    eh.state =  "active"                               #line 577#line 578#line 579

def set_idle (eh):                                     #line 580
    eh.state =  "idle"                                 #line 581#line 582#line 583

def put_output (eh,mev):                               #line 584
    eh.outq.append ( mev)                              #line 585#line 586#line 587

projectRoot =  ""                                      #line 588#line 589
def set_environment (project_root):                    #line 590
    global projectRoot                                 #line 591
    projectRoot =  project_root                        #line 592#line 593#line 594

def obj_clone (obj):                                   #line 595
    return  obj                                        #line 596#line 597#line 598

# usage: app ${_00_} diagram_filename1 diagram_filename2 ...#line 599
# where ${_00_} is the root directory for the project  #line 600#line 601
def initialize_component_palette_from_files (project_root,diagram_source_files):#line 602
    reg = make_component_registry ()                   #line 603
    for diagram_source in  diagram_source_files:       #line 604
        all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)#line 605
        reg = generate_external_components ( reg, all_containers_within_single_file)#line 606
        for container in  all_containers_within_single_file:#line 607
            register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 608#line 609#line 610
    initialize_stock_components ( reg)                 #line 611
    return  reg                                        #line 612#line 613#line 614

def initialize_component_palette_from_string (project_root,lnet):#line 615
    # this version ignores project_root                #line 616
    reg = make_component_registry ()                   #line 617
    all_containers = lnet2internal_from_string ( lnet) #line 618
    reg = generate_external_components ( reg, all_containers)#line 619
    for container in  all_containers:                  #line 620
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 621#line 622
    initialize_stock_components ( reg)                 #line 623
    return  reg                                        #line 624#line 625#line 626
                                                       #line 627
def clone_string (s):                                  #line 628
    return  s                                          #line 629#line 630#line 631

load_errors =  False                                   #line 632
runtime_errors =  False                                #line 633#line 634
def load_error (s):                                    #line 635
    global load_errors                                 #line 636
    print ( s, file=sys.stderr)                        #line 637
                                                       #line 638
    load_errors =  True                                #line 639#line 640#line 641

def runtime_error (s):                                 #line 642
    global runtime_errors                              #line 643
    print ( s, file=sys.stderr)                        #line 644
    runtime_errors =  True                             #line 645#line 646#line 647
                                                       #line 648
def initialize_from_files (project_root,diagram_names):#line 649
    arg =  None                                        #line 650
    palette = initialize_component_palette_from_files ( project_root, diagram_names)#line 651
    return [ palette,[ project_root, diagram_names, arg]]#line 652#line 653#line 654

def initialize_from_string (project_root):             #line 655
    arg =  None                                        #line 656
    palette = initialize_component_palette_from_string ( project_root)#line 657
    return [ palette,[ project_root, None, arg]]       #line 658#line 659#line 660

def start (arg,part_name,palette,env):                 #line 661
    part = start_bare ( part_name, palette, env)       #line 662
    inject ( part, "", arg)                            #line 663
    finalize ( part)                                   #line 664#line 665#line 666

def start_bare (part_name,palette,env):                #line 667
    project_root =  env [ 0]                           #line 668
    diagram_names =  env [ 1]                          #line 669
    set_environment ( project_root)                    #line 670
    # get entrypoint container                         #line 671
    part = get_component_instance ( palette, part_name, None)#line 672
    if  None ==  part:                                 #line 673
        load_error ( str( "Couldn't find container with page name /") +  str( part_name) +  str( "/ in files ") +  str(str ( diagram_names)) +  " (check tab names, or disable compression?)"    )#line 677#line 678
    return  part                                       #line 679#line 680#line 681

def inject (part,port,payload):                        #line 682
    if not  load_errors:                               #line 683
        d = Datum ()                                   #line 684
        d.v =  payload                                 #line 685
        d.clone =  lambda : obj_clone ( d)             #line 686
        d.reclaim =  None                              #line 687
        mev = make_mevent ( port, d)                   #line 688
        inject_mevent ( part, mev)                     #line 689
    else:                                              #line 690
        exit (1)                                       #line 691#line 692#line 693#line 694

def finalize (part):                                   #line 695
    print (deque_to_json ( part.outq))                 #line 696#line 697#line 698

def new_datum_bang ():                                 #line 699
    d = Datum ()                                       #line 700
    d.v =  "!"                                         #line 701
    d.clone =  lambda : obj_clone ( d)                 #line 702
    d.reclaim =  None                                  #line 703
    return  d                                          #line 704#line 705
def external_instantiate (reg,owner,name,arg):         #line 1
    name_with_id = gensymbol ( name)                   #line 2
    return make_leaf ( name_with_id, owner, None, arg, handle_external)#line 3#line 4#line 5

def generate_external_components (reg,container_list): #line 6
    # nothing to do here, anymore - get_component_instance doesn;t need a template for ":..." Parts #line 7
    return  reg                                        #line 8#line 9#line 10
#line 1
def trash_instantiate (reg,owner,name,template_data,arg):#line 2
    name_with_id = gensymbol ( "trash")                #line 3
    return make_leaf ( name_with_id, owner, None, "", trash_handler)#line 4#line 5#line 6

def trash_handler (eh,mev):                            #line 7
    # to appease dumped_on_floor checker               #line 8
    pass                                               #line 9#line 10

class TwoMevents:
    def __init__ (self,):                              #line 11
        self.firstmev =  None                          #line 12
        self.secondmev =  None                         #line 13#line 14
                                                       #line 15
# Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev }#line 16
class Deracer_Instance_Data:
    def __init__ (self,):                              #line 17
        self.state =  None                             #line 18
        self.buffer =  None                            #line 19#line 20
                                                       #line 21
def reclaim_Buffers_from_heap (inst):                  #line 22
    pass                                               #line 23#line 24#line 25

def deracer_instantiate (reg,owner,name,template_data,arg):#line 26
    name_with_id = gensymbol ( "deracer")              #line 27
    inst =  Deracer_Instance_Data ()                   #line 28
    inst.state =  "idle"                               #line 29
    inst.buffer =  TwoMevents ()                       #line 30
    eh = make_leaf ( name_with_id, owner, inst, "", deracer_handler)#line 31
    return  eh                                         #line 32#line 33#line 34

def send_firstmev_then_secondmev (eh,inst):            #line 35
    forward ( eh, "1", inst.buffer.firstmev)           #line 36
    forward ( eh, "2", inst.buffer.secondmev)          #line 37
    reclaim_Buffers_from_heap ( inst)                  #line 38#line 39#line 40

def deracer_handler (eh,mev):                          #line 41
    inst =  eh.instance_data                           #line 42
    if  inst.state ==  "idle":                         #line 43
        if  "1" ==  mev.port:                          #line 44
            inst.buffer.firstmev =  mev                #line 45
            inst.state =  "waitingForSecondmev"        #line 46
        elif  "2" ==  mev.port:                        #line 47
            inst.buffer.secondmev =  mev               #line 48
            inst.state =  "waitingForFirstmev"         #line 49
        else:                                          #line 50
            runtime_error ( str( "bad mev.port (case A) for deracer ") +  mev.port )#line 51#line 52
    elif  inst.state ==  "waitingForFirstmev":         #line 53
        if  "1" ==  mev.port:                          #line 54
            inst.buffer.firstmev =  mev                #line 55
            send_firstmev_then_secondmev ( eh, inst)   #line 56
            inst.state =  "idle"                       #line 57
        else:                                          #line 58
            runtime_error ( str( "bad mev.port (case B) for deracer ") +  mev.port )#line 59#line 60
    elif  inst.state ==  "waitingForSecondmev":        #line 61
        if  "2" ==  mev.port:                          #line 62
            inst.buffer.secondmev =  mev               #line 63
            send_firstmev_then_secondmev ( eh, inst)   #line 64
            inst.state =  "idle"                       #line 65
        else:                                          #line 66
            runtime_error ( str( "bad mev.port (case C) for deracer ") +  mev.port )#line 67#line 68
    else:                                              #line 69
        runtime_error ( "bad state for deracer {eh.state}")#line 70#line 71#line 72#line 73

def low_level_read_text_file_instantiate (reg,owner,name,template_data,arg):#line 74
    name_with_id = gensymbol ( "Low Level Read Text File")#line 75
    return make_leaf ( name_with_id, owner, None, "", low_level_read_text_file_handler)#line 76#line 77#line 78

def low_level_read_text_file_handler (eh,mev):         #line 79
    fname =  mev.datum.v                               #line 80

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
                                                       #line 81#line 82#line 83

def ensure_string_datum_instantiate (reg,owner,name,template_data,arg):#line 84
    name_with_id = gensymbol ( "Ensure String Datum")  #line 85
    return make_leaf ( name_with_id, owner, None, "", ensure_string_datum_handler)#line 86#line 87#line 88

def ensure_string_datum_handler (eh,mev):              #line 89
    if  "string" ==  mev.datum.kind ():                #line 90
        forward ( eh, "", mev)                         #line 91
    else:                                              #line 92
        emev =  str( "*** ensure: type error (expected a string datum) but got ") +  mev.datum #line 93
        send ( eh, "✗", emev, mev)                     #line 94#line 95#line 96#line 97

class Syncfilewrite_Data:
    def __init__ (self,):                              #line 98
        self.filename =  ""                            #line 99#line 100
                                                       #line 101
# temp copy for bootstrap, sends "done“ (error during bootstrap if not wired)#line 102
def syncfilewrite_instantiate (reg,owner,name,template_data,arg):#line 103
    name_with_id = gensymbol ( "syncfilewrite")        #line 104
    inst =  Syncfilewrite_Data ()                      #line 105
    return make_leaf ( name_with_id, owner, inst, "", syncfilewrite_handler)#line 106#line 107#line 108

def syncfilewrite_handler (eh,mev):                    #line 109
    inst =  eh.instance_data                           #line 110
    if  "filename" ==  mev.port:                       #line 111
        inst.filename =  mev.datum.v                   #line 112
    elif  "input" ==  mev.port:                        #line 113
        contents =  mev.datum.v                        #line 114
        f = open ( inst.filename, "w")                 #line 115
        if  f!= None:                                  #line 116
            f.write ( mev.datum.v)                     #line 117
            f.close ()                                 #line 118
            send ( eh, "done",new_datum_bang (), mev)  #line 119
        else:                                          #line 120
            send ( eh, "✗", str( "open error on file ") +  inst.filename , mev)#line 121#line 122#line 123#line 124#line 125

class StringConcat_Instance_Data:
    def __init__ (self,):                              #line 126
        self.buffer1 =  None                           #line 127
        self.buffer2 =  None                           #line 128#line 129
                                                       #line 130
def stringconcat_instantiate (reg,owner,name,template_data,arg):#line 131
    name_with_id = gensymbol ( "stringconcat")         #line 132
    instp =  StringConcat_Instance_Data ()             #line 133
    return make_leaf ( name_with_id, owner, instp, "", stringconcat_handler)#line 134#line 135#line 136

def stringconcat_handler (eh,mev):                     #line 137
    inst =  eh.instance_data                           #line 138
    if  "1" ==  mev.port:                              #line 139
        inst.buffer1 = clone_string ( mev.datum.v)     #line 140
        maybe_stringconcat ( eh, inst, mev)            #line 141
    elif  "2" ==  mev.port:                            #line 142
        inst.buffer2 = clone_string ( mev.datum.v)     #line 143
        maybe_stringconcat ( eh, inst, mev)            #line 144
    elif  "reset" ==  mev.port:                        #line 145
        inst.buffer1 =  None                           #line 146
        inst.buffer2 =  None                           #line 147
    else:                                              #line 148
        runtime_error ( str( "bad mev.port for stringconcat: ") +  mev.port )#line 149#line 150#line 151#line 152

def maybe_stringconcat (eh,inst,mev):                  #line 153
    if  inst.buffer1!= None and  inst.buffer2!= None:  #line 154
        concatenated_string =  ""                      #line 155
        if  0 == len ( inst.buffer1):                  #line 156
            concatenated_string =  inst.buffer2        #line 157
        elif  0 == len ( inst.buffer2):                #line 158
            concatenated_string =  inst.buffer1        #line 159
        else:                                          #line 160
            concatenated_string =  inst.buffer1+ inst.buffer2#line 161#line 162
        send ( eh, "", concatenated_string, mev)       #line 163
        inst.buffer1 =  None                           #line 164
        inst.buffer2 =  None                           #line 165#line 166#line 167#line 168

#                                                      #line 169#line 170
def string_constant_instantiate (reg,owner,name,template_data,arg):#line 171
    global projectRoot                                 #line 172
    name_with_id = gensymbol ( "strconst")             #line 173
    s =  template_data                                 #line 174
    if  projectRoot!= "":                              #line 175
        s = re.sub ( "_00_",  projectRoot,  s)         #line 176#line 177
    return make_leaf ( name_with_id, owner, s, "", string_constant_handler)#line 178#line 179#line 180

def string_constant_handler (eh,mev):                  #line 181
    s =  eh.instance_data                              #line 182
    send ( eh, "", s, mev)                             #line 183#line 184#line 185

def fakepipename_instantiate (reg,owner,name,template_data,arg):#line 186
    instance_name = gensymbol ( "fakepipe")            #line 187
    return make_leaf ( instance_name, owner, None, "", fakepipename_handler)#line 188#line 189#line 190

rand =  0                                              #line 191#line 192
def fakepipename_handler (eh,mev):                     #line 193
    global rand                                        #line 194
    rand =  rand+ 1
    # not very random, but good enough _ ;rand' must be unique within a single run#line 195
    send ( eh, "", str( "/tmp/fakepipe") +  rand , mev)#line 196#line 197#line 198
                                                       #line 199
class Switch1star_Instance_Data:
    def __init__ (self,):                              #line 200
        self.state =  "1"                              #line 201#line 202
                                                       #line 203
def switch1star_instantiate (reg,owner,name,template_data,arg):#line 204
    name_with_id = gensymbol ( "switch1*")             #line 205
    instp =  Switch1star_Instance_Data ()              #line 206
    return make_leaf ( name_with_id, owner, instp, "", switch1star_handler)#line 207#line 208#line 209

def switch1star_handler (eh,mev):                      #line 210
    inst =  eh.instance_data                           #line 211
    whichOutput =  inst.state                          #line 212
    if  "" ==  mev.port:                               #line 213
        if  "1" ==  whichOutput:                       #line 214
            forward ( eh, "1", mev)                    #line 215
            inst.state =  "*"                          #line 216
        elif  "*" ==  whichOutput:                     #line 217
            forward ( eh, "*", mev)                    #line 218
        else:                                          #line 219
            send ( eh, "✗", "internal error bad state in switch1*", mev)#line 220#line 221
    elif  "reset" ==  mev.port:                        #line 222
        inst.state =  "1"                              #line 223
    else:                                              #line 224
        send ( eh, "✗", "internal error bad mevent for switch1*", mev)#line 225#line 226#line 227#line 228

class StringAccumulator:
    def __init__ (self,):                              #line 229
        self.s =  ""                                   #line 230#line 231
                                                       #line 232
def strcatstar_instantiate (reg,owner,name,template_data,arg):#line 233
    name_with_id = gensymbol ( "String Concat *")      #line 234
    instp =  StringAccumulator ()                      #line 235
    return make_leaf ( name_with_id, owner, instp, "", strcatstar_handler)#line 236#line 237#line 238

def strcatstar_handler (eh,mev):                       #line 239
    accum =  eh.instance_data                          #line 240
    if  "" ==  mev.port:                               #line 241
        accum.s =  str( accum.s) +  mev.datum.v        #line 242
    elif  "fini" ==  mev.port:                         #line 243
        send ( eh, "", accum.s, mev)                   #line 244
    else:                                              #line 245
        send ( eh, "✗", "internal error bad mevent for String Concat *", mev)#line 246#line 247#line 248#line 249

class BlockOnErrorState:
    def __init__ (self,):                              #line 250
        self.hasError =  "no"                          #line 251#line 252
                                                       #line 253
def blockOnError_instantiate (reg,owner,name,template_data):#line 254
    name_with_id = gensymbol ( "blockOnError")         #line 255
    instp =  BlockOnErrorState ()                      #line 256
    return make_leaf ( name_with_id, owner, instp, blockOnError_handler)#line 257#line 258#line 259

def blockOnError_handler (eh,mev):                     #line 260
    inst =  eh.instance_data                           #line 261
    if  "" ==  mev.port:                               #line 262
        if  inst.hasError ==  "no":                    #line 263
            send ( eh, "", mev.datum.v, mev)           #line 264#line 265
    elif  "✗" ==  mev.port:                            #line 266
        inst.hasError =  "yes"                         #line 267
    elif  "reset" ==  mev.port:                        #line 268
        inst.hasError =  "no"                          #line 269#line 270#line 271#line 272

# all of the the built_in leaves are listed here       #line 273
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 274#line 275
def initialize_stock_components (reg):                 #line 276
    register_component ( reg,mkTemplate ( "1then2", None, deracer_instantiate))#line 277
    register_component ( reg,mkTemplate ( "1→2", None, deracer_instantiate))#line 278
    register_component ( reg,mkTemplate ( "trash", None, trash_instantiate))#line 279
    register_component ( reg,mkTemplate ( "blockOnError", None, blockOnError_instantiate))#line 280#line 281#line 282
    register_component ( reg,mkTemplate ( "Read Text File", None, low_level_read_text_file_instantiate))#line 283
    register_component ( reg,mkTemplate ( "Ensure String Datum", None, ensure_string_datum_instantiate))#line 284#line 285
    register_component ( reg,mkTemplate ( "syncfilewrite", None, syncfilewrite_instantiate))#line 286
    register_component ( reg,mkTemplate ( "String Concat", None, stringconcat_instantiate))#line 287
    register_component ( reg,mkTemplate ( "switch1*", None, switch1star_instantiate))#line 288
    register_component ( reg,mkTemplate ( "String Concat *", None, strcatstar_instantiate))#line 289
    # for fakepipe                                     #line 290
    register_component ( reg,mkTemplate ( "fakepipename", None, fakepipename_instantiate))#line 291#line 292#line 293
def handle_external (eh,mev):                          #line 1
    s =  eh.arg                                        #line 2
    firstc =  s [ 1]                                   #line 3
    if  firstc ==  "$":                                #line 4
        shell_out_handler ( eh,    s[1:] [1:] [1:] , mev)#line 5
    elif  firstc ==  "?":                              #line 6
        probe_handler ( eh,  s[1:] , mev)              #line 7
    else:                                              #line 8
        # just a string, send it out                   #line 9
        send ( eh, "",  s[1:] , mev)                   #line 10#line 11#line 12#line 13

def probe_handler (eh,s,mev):                          #line 14
    s =  mev.datum.v                                   #line 15
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.name) +  str( ": ") + str ( s)      )#line 23#line 24#line 25

def shell_out_handler (eh,cmd,mev):                    #line 26
    s =  mev.datum.v                                   #line 27
    ret =  None                                        #line 28
    rc =  None                                         #line 29
    stdout =  None                                     #line 30
    stderr =  None                                     #line 31

    try:
        with open('junk.txt', 'w') as file:
            file.write(cmd)
        ret = subprocess.run (shlex.split ( cmd), input= s, text=True, capture_output=True)
        rc = ret.returncode
        stdout = ret.stdout.strip ()
        stderr = ret.stderr.strip ()
    except Exception as e:
        ret = None
        rc = 1
        stdout = ''
        stderr = str(e)
                                                       #line 32
    if  rc ==  0:                                      #line 33
        send ( eh, "", str( stdout) +  stderr , mev)   #line 34
    else:                                              #line 35
        send ( eh, "✗", str( stdout) +  stderr , mev)  #line 36#line 37#line 38#line 39
