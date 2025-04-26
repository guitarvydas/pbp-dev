
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
def container_instantiator (reg,owner,container_name,desc):#line 161
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
        self.template_data =  None                     #line 404
        self.instantiator =  None                      #line 405#line 406
                                                       #line 407
def mkTemplate (name,template_data,instantiator):      #line 408
    templ =  Template ()                               #line 409
    templ.name =  name                                 #line 410
    templ.template_data =  template_data               #line 411
    templ.instantiator =  instantiator                 #line 412
    return  templ                                      #line 413#line 414#line 415
                                                       #line 416
def lnet2internal_from_file (pathname,container_xml):  #line 417
    filename =  os.path.basename ( container_xml)      #line 418

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
                                                       #line 419#line 420#line 421

def lnet2internal_from_string ():                      #line 422

    try:
        routings = json.loads(lnet)
        return routings
    except json.JSONDecodeError as e:
        print ("Error decoding JSON from string 'lnet': '{e}'")
        return None
                                                       #line 423#line 424#line 425

def delete_decls (d):                                  #line 426
    pass                                               #line 427#line 428#line 429

def make_component_registry ():                        #line 430
    return  Component_Registry ()                      #line 431#line 432#line 433

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 434

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 435#line 436

def abstracted_register_component (reg,template,ok_to_overwrite):#line 437
    name = mangle_name ( template.name)                #line 438
    if  reg!= None and  name in  reg.templates and not  ok_to_overwrite:#line 439
        load_error ( str( "Component /") +  str( template.name) +  "/ already declared"  )#line 440
        return  reg                                    #line 441
    else:                                              #line 442
        reg.templates [name] =  template               #line 443
        return  reg                                    #line 444#line 445#line 446#line 447

def get_component_instance (reg,full_name,owner):      #line 448
    template_name = mangle_name ( full_name)           #line 449
    if  template_name in  reg.templates:               #line 450
        template =  reg.templates [template_name]      #line 451
        if ( template ==  None):                       #line 452
            load_error ( str( "Registry Error (A): Can't find component /") +  str( template_name) +  "/"  )#line 453
            return  None                               #line 454
        else:                                          #line 455
            owner_name =  ""                           #line 456
            instance_name =  template_name             #line 457
            if  None!= owner:                          #line 458
                owner_name =  owner.name               #line 459
                instance_name =  str( owner_name) +  str( "▹") +  template_name  #line 460
            else:                                      #line 461
                instance_name =  template_name         #line 462#line 463
            instance =  template.instantiator ( reg, owner, instance_name, template.template_data)#line 464
            return  instance                           #line 465#line 466
    else:                                              #line 467
        load_error ( str( "Registry Error (B): Can't find component /") +  str( template_name) +  "/"  )#line 468
        return  None                                   #line 469#line 470#line 471#line 472

def mangle_name (s):                                   #line 473
    # trim name to remove code from Container component names _ deferred until later (or never)#line 474
    return  s                                          #line 475#line 476#line 477
                                                       #line 478
# Data for an asyncronous component _ effectively, a function with input#line 479
# and output queues of mevents.                        #line 480
#                                                      #line 481
# Components can either be a user_supplied function (“lea“), or a “container“#line 482
# that routes mevents to child components according to a list of connections#line 483
# that serve as a mevent routing table.                #line 484
#                                                      #line 485
# Child components themselves can be leaves or other containers.#line 486
#                                                      #line 487
# `handler` invokes the code that is attached to this component.#line 488
#                                                      #line 489
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 490
# function may want whenever it is invoked again.      #line 491
#                                                      #line 492#line 493
# Eh_States :: enum { idle, active }                   #line 494
class Eh:
    def __init__ (self,):                              #line 495
        self.name =  ""                                #line 496
        self.inq =  deque ([])                         #line 497
        self.outq =  deque ([])                        #line 498
        self.owner =  None                             #line 499
        self.children = []                             #line 500
        self.visit_ordering =  deque ([])              #line 501
        self.connections = []                          #line 502
        self.routings =  deque ([])                    #line 503
        self.handler =  None                           #line 504
        self.finject =  None                           #line 505
        self.instance_data =  None                     #line 506
        self.state =  "idle"                           #line 507# bootstrap debugging#line 508
        self.kind =  None # enum { container, leaf, }  #line 509#line 510
                                                       #line 511
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 512
# whose handler function is `container_handler`.       #line 513
def make_container (name,owner):                       #line 514
    eh =  Eh ()                                        #line 515
    eh.name =  name                                    #line 516
    eh.owner =  owner                                  #line 517
    eh.handler =  container_handler                    #line 518
    eh.finject =  injector                             #line 519
    eh.state =  "idle"                                 #line 520
    eh.kind =  "container"                             #line 521
    return  eh                                         #line 522#line 523#line 524

# Creates a new leaf component out of a handler function, and a data parameter#line 525
# that will be passed back to your handler when called.#line 526#line 527
def make_leaf (name,owner,instance_data,handler):      #line 528
    eh =  Eh ()                                        #line 529
    nm =  ""                                           #line 530
    if  None!= owner:                                  #line 531
        nm =  owner.name                               #line 532#line 533
    eh.name =  str( nm) +  str( "▹") +  name           #line 534
    eh.owner =  owner                                  #line 535
    eh.handler =  handler                              #line 536
    eh.finject =  injector                             #line 537
    eh.instance_data =  instance_data                  #line 538
    eh.state =  "idle"                                 #line 539
    eh.kind =  "leaf"                                  #line 540
    return  eh                                         #line 541#line 542#line 543

# Sends a mevent on the given `port` with `data`, placing it on the output#line 544
# of the given component.                              #line 545#line 546
def send (eh,port,obj,causingMevent):                  #line 547
    d = Datum ()                                       #line 548
    d.v =  obj                                         #line 549
    d.clone =  lambda : obj_clone ( d)                 #line 550
    d.reclaim =  None                                  #line 551
    mev = make_mevent ( port, d)                       #line 552
    put_output ( eh, mev)                              #line 553#line 554#line 555

def forward (eh,port,mev):                             #line 556
    fwdmev = make_mevent ( port, mev.datum)            #line 557
    put_output ( eh, fwdmev)                           #line 558#line 559#line 560

def inject (eh,mev):                                   #line 561
    eh.finject ( eh, mev)                              #line 562#line 563#line 564

def set_active (eh):                                   #line 565
    eh.state =  "active"                               #line 566#line 567#line 568

def set_idle (eh):                                     #line 569
    eh.state =  "idle"                                 #line 570#line 571#line 572

def put_output (eh,mev):                               #line 573
    eh.outq.append ( mev)                              #line 574#line 575#line 576

projectRoot =  ""                                      #line 577#line 578
def set_environment (project_root):                    #line 579
    global projectRoot                                 #line 580
    projectRoot =  project_root                        #line 581#line 582#line 583

def obj_clone (obj):                                   #line 584
    return  obj                                        #line 585#line 586#line 587

# usage: app ${_00_} diagram_filename1 diagram_filename2 ...#line 588
# where ${_00_} is the root directory for the project  #line 589#line 590
def initialize_component_palette_from_files (project_root,diagram_source_files):#line 591
    reg = make_component_registry ()                   #line 592
    for diagram_source in  diagram_source_files:       #line 593
        all_containers_within_single_file = lnet2internal_from_file ( project_root, diagram_source)#line 594
        reg = generate_shell_components ( reg, all_containers_within_single_file)#line 595
        for container in  all_containers_within_single_file:#line 596
            register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 597#line 598#line 599
    initialize_stock_components ( reg)                 #line 600
    return  reg                                        #line 601#line 602#line 603

def initialize_component_palette_from_string (project_root):#line 604
    # this version ignores project_root                #line 605
    reg = make_component_registry ()                   #line 606
    all_containers = lnet2internal_from_string ()      #line 607
    reg = generate_shell_components ( reg, all_containers)#line 608
    for container in  all_containers:                  #line 609
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 610#line 611
    initialize_stock_components ( reg)                 #line 612
    return  reg                                        #line 613#line 614#line 615
                                                       #line 616
def clone_string (s):                                  #line 617
    return  s                                          #line 618#line 619#line 620

load_errors =  False                                   #line 621
runtime_errors =  False                                #line 622#line 623
def load_error (s):                                    #line 624
    global load_errors                                 #line 625
    print ( s, file=sys.stderr)                        #line 626
                                                       #line 627
    load_errors =  True                                #line 628#line 629#line 630

def runtime_error (s):                                 #line 631
    global runtime_errors                              #line 632
    print ( s, file=sys.stderr)                        #line 633
    runtime_errors =  True                             #line 634#line 635#line 636
                                                       #line 637
def initialize_from_files (project_root,diagram_names):#line 638
    arg =  None                                        #line 639
    palette = initialize_component_palette_from_files ( project_root, diagram_names)#line 640
    return [ palette,[ project_root, diagram_names, arg]]#line 641#line 642#line 643

def initialize_from_string (project_root):             #line 644
    arg =  None                                        #line 645
    palette = initialize_component_palette_from_string ( project_root)#line 646
    return [ palette,[ project_root, None, arg]]       #line 647#line 648#line 649

def start (arg,Part_name,palette,env):                 #line 650
    project_root =  env [ 0]                           #line 651
    diagram_names =  env [ 1]                          #line 652
    set_environment ( project_root)                    #line 653
    # get entrypoint container                         #line 654
    Part = get_component_instance ( palette, Part_name, None)#line 655
    if  None ==  Part:                                 #line 656
        load_error ( str( "Couldn't find container with page name /") +  str( Part_name) +  str( "/ in files ") +  str(str ( diagram_names)) +  " (check tab names, or disable compression?)"    )#line 660#line 661
    if not  load_errors:                               #line 662
        d = Datum ()                                   #line 663
        d.v =  arg                                     #line 664
        d.clone =  lambda : obj_clone ( d)             #line 665
        d.reclaim =  None                              #line 666
        mev = make_mevent ( "", d)                     #line 667
        inject ( Part, mev)                            #line 668#line 669
    print (deque_to_json ( Part.outq))                 #line 670#line 671#line 672

def new_datum_bang ():                                 #line 673
    d = Datum ()                                       #line 674
    d.v =  "!"                                         #line 675
    d.clone =  lambda : obj_clone ( d)                 #line 676
    d.reclaim =  None                                  #line 677
    return  d                                          #line 678#line 679
# this needs to be rewritten to use the low_level "shell_out“ component, this can be done solely as a diagram without using python code here#line 1
def shell_out_instantiate (reg,owner,name,template_data):#line 2
    name_with_id = gensymbol ( "shell_out")            #line 3
    cmd = shlex.split ( template_data)                 #line 4
    return make_leaf ( name_with_id, owner, cmd, shell_out_handler)#line 5#line 6#line 7

def shell_out_handler (eh,msg):                        #line 8
    cmd =  eh.instance_data                            #line 9
    s =  msg.datum.v                                   #line 10
    ret =  None                                        #line 11
    rc =  None                                         #line 12
    stdout =  None                                     #line 13
    stderr =  None                                     #line 14

    try:
        ret = subprocess.run ( cmd, input= s, text=True, capture_output=True)
        rc = ret.returncode
        stdout = ret.stdout.strip ()
        stderr = ret.stderr.strip ()
    except Exception as e:
        ret = None
        rc = 1
        stdout = ''
        stderr = str(e)
                                                       #line 15
    if  rc ==  0:                                      #line 16
        send ( eh, "", str( stdout) +  stderr , msg)   #line 17
    else:                                              #line 18
        send ( eh, "✗", str( stdout) +  stderr , msg)  #line 19#line 20#line 21#line 22

def generate_shell_components (reg,container_list):    #line 23
    # [                                                #line 24
    #     {;file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 25
    #     {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []}#line 26
    # ]                                                #line 27
    if  None!= container_list:                         #line 28
        for diagram in  container_list:                #line 29
            # loop through every component in the diagram and look for names that start with “$“ or “'“ #line 30
            # {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 31
            for child_descriptor in  diagram [ "children"]:#line 32
                if first_char_is ( child_descriptor [ "name"], "$"):#line 33
                    name =  child_descriptor [ "name"] #line 34
                    cmd =   name[1:] .strip ()         #line 35
                    generated_leaf = mkTemplate ( name, cmd, shell_out_instantiate)#line 36
                    register_component ( reg, generated_leaf)#line 37
                elif first_char_is ( child_descriptor [ "name"], "'"):#line 38
                    name =  child_descriptor [ "name"] #line 39
                    s =   name[1:]                     #line 40
                    generated_leaf = mkTemplate ( name, s, string_constant_instantiate)#line 41
                    register_component_allow_overwriting ( reg, generated_leaf)#line 42#line 43#line 44#line 45#line 46
    return  reg                                        #line 47#line 48#line 49

def first_char (s):                                    #line 50
    return   s[0]                                      #line 51#line 52#line 53

def first_char_is (s,c):                               #line 54
    return  c == first_char ( s)                       #line 55#line 56#line 57
                                                       #line 58
# TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here#line 59
# I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped#line 60#line 61
def probeA_instantiate (reg,owner,name,template_data): #line 1
    name_with_id = gensymbol ( "?A")                   #line 2
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 3#line 4#line 5

def probeB_instantiate (reg,owner,name,template_data): #line 6
    name_with_id = gensymbol ( "?B")                   #line 7
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 8#line 9#line 10

def probeC_instantiate (reg,owner,name,template_data): #line 11
    name_with_id = gensymbol ( "?C")                   #line 12
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 13#line 14#line 15

def probe_handler (eh,mev):                            #line 16
    global ticktime                                    #line 17
    s =  mev.datum.v                                   #line 18
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.name) +  str( ": ") + str ( s)      )#line 25#line 26#line 27

def trash_instantiate (reg,owner,name,template_data):  #line 28
    name_with_id = gensymbol ( "trash")                #line 29
    return make_leaf ( name_with_id, owner, None, trash_handler)#line 30#line 31#line 32

def trash_handler (eh,mev):                            #line 33
    # to appease dumped_on_floor checker               #line 34
    pass                                               #line 35#line 36

class TwoMevents:
    def __init__ (self,):                              #line 37
        self.firstmev =  None                          #line 38
        self.secondmev =  None                         #line 39#line 40
                                                       #line 41
# Deracer_States :: enum { idle, waitingForFirstmev, waitingForSecondmev }#line 42
class Deracer_Instance_Data:
    def __init__ (self,):                              #line 43
        self.state =  None                             #line 44
        self.buffer =  None                            #line 45#line 46
                                                       #line 47
def reclaim_Buffers_from_heap (inst):                  #line 48
    pass                                               #line 49#line 50#line 51

def deracer_instantiate (reg,owner,name,template_data):#line 52
    name_with_id = gensymbol ( "deracer")              #line 53
    inst =  Deracer_Instance_Data ()                   #line 54
    inst.state =  "idle"                               #line 55
    inst.buffer =  TwoMevents ()                       #line 56
    eh = make_leaf ( name_with_id, owner, inst, deracer_handler)#line 57
    return  eh                                         #line 58#line 59#line 60

def send_firstmev_then_secondmev (eh,inst):            #line 61
    forward ( eh, "1", inst.buffer.firstmev)           #line 62
    forward ( eh, "2", inst.buffer.secondmev)          #line 63
    reclaim_Buffers_from_heap ( inst)                  #line 64#line 65#line 66

def deracer_handler (eh,mev):                          #line 67
    inst =  eh.instance_data                           #line 68
    if  inst.state ==  "idle":                         #line 69
        if  "1" ==  mev.port:                          #line 70
            inst.buffer.firstmev =  mev                #line 71
            inst.state =  "waitingForSecondmev"        #line 72
        elif  "2" ==  mev.port:                        #line 73
            inst.buffer.secondmev =  mev               #line 74
            inst.state =  "waitingForFirstmev"         #line 75
        else:                                          #line 76
            runtime_error ( str( "bad mev.port (case A) for deracer ") +  mev.port )#line 77#line 78
    elif  inst.state ==  "waitingForFirstmev":         #line 79
        if  "1" ==  mev.port:                          #line 80
            inst.buffer.firstmev =  mev                #line 81
            send_firstmev_then_secondmev ( eh, inst)   #line 82
            inst.state =  "idle"                       #line 83
        else:                                          #line 84
            runtime_error ( str( "bad mev.port (case B) for deracer ") +  mev.port )#line 85#line 86
    elif  inst.state ==  "waitingForSecondmev":        #line 87
        if  "2" ==  mev.port:                          #line 88
            inst.buffer.secondmev =  mev               #line 89
            send_firstmev_then_secondmev ( eh, inst)   #line 90
            inst.state =  "idle"                       #line 91
        else:                                          #line 92
            runtime_error ( str( "bad mev.port (case C) for deracer ") +  mev.port )#line 93#line 94
    else:                                              #line 95
        runtime_error ( "bad state for deracer {eh.state}")#line 96#line 97#line 98#line 99

def low_level_read_text_file_instantiate (reg,owner,name,template_data):#line 100
    name_with_id = gensymbol ( "Low Level Read Text File")#line 101
    return make_leaf ( name_with_id, owner, None, low_level_read_text_file_handler)#line 102#line 103#line 104

def low_level_read_text_file_handler (eh,mev):         #line 105
    fname =  mev.datum.v                               #line 106

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
                                                       #line 107#line 108#line 109

def ensure_string_datum_instantiate (reg,owner,name,template_data):#line 110
    name_with_id = gensymbol ( "Ensure String Datum")  #line 111
    return make_leaf ( name_with_id, owner, None, ensure_string_datum_handler)#line 112#line 113#line 114

def ensure_string_datum_handler (eh,mev):              #line 115
    if  "string" ==  mev.datum.kind ():                #line 116
        forward ( eh, "", mev)                         #line 117
    else:                                              #line 118
        emev =  str( "*** ensure: type error (expected a string datum) but got ") +  mev.datum #line 119
        send ( eh, "✗", emev, mev)                     #line 120#line 121#line 122#line 123

class Syncfilewrite_Data:
    def __init__ (self,):                              #line 124
        self.filename =  ""                            #line 125#line 126
                                                       #line 127
# temp copy for bootstrap, sends "done“ (error during bootstrap if not wired)#line 128
def syncfilewrite_instantiate (reg,owner,name,template_data):#line 129
    name_with_id = gensymbol ( "syncfilewrite")        #line 130
    inst =  Syncfilewrite_Data ()                      #line 131
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)#line 132#line 133#line 134

def syncfilewrite_handler (eh,mev):                    #line 135
    inst =  eh.instance_data                           #line 136
    if  "filename" ==  mev.port:                       #line 137
        inst.filename =  mev.datum.v                   #line 138
    elif  "input" ==  mev.port:                        #line 139
        contents =  mev.datum.v                        #line 140
        f = open ( inst.filename, "w")                 #line 141
        if  f!= None:                                  #line 142
            f.write ( mev.datum.v)                     #line 143
            f.close ()                                 #line 144
            send ( eh, "done",new_datum_bang (), mev)  #line 145
        else:                                          #line 146
            send ( eh, "✗", str( "open error on file ") +  inst.filename , mev)#line 147#line 148#line 149#line 150#line 151

class StringConcat_Instance_Data:
    def __init__ (self,):                              #line 152
        self.buffer1 =  None                           #line 153
        self.buffer2 =  None                           #line 154#line 155
                                                       #line 156
def stringconcat_instantiate (reg,owner,name,template_data):#line 157
    name_with_id = gensymbol ( "stringconcat")         #line 158
    instp =  StringConcat_Instance_Data ()             #line 159
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)#line 160#line 161#line 162

def stringconcat_handler (eh,mev):                     #line 163
    inst =  eh.instance_data                           #line 164
    if  "1" ==  mev.port:                              #line 165
        inst.buffer1 = clone_string ( mev.datum.v)     #line 166
        maybe_stringconcat ( eh, inst, mev)            #line 167
    elif  "2" ==  mev.port:                            #line 168
        inst.buffer2 = clone_string ( mev.datum.v)     #line 169
        maybe_stringconcat ( eh, inst, mev)            #line 170
    elif  "reset" ==  mev.port:                        #line 171
        inst.buffer1 =  None                           #line 172
        inst.buffer2 =  None                           #line 173
    else:                                              #line 174
        runtime_error ( str( "bad mev.port for stringconcat: ") +  mev.port )#line 175#line 176#line 177#line 178

def maybe_stringconcat (eh,inst,mev):                  #line 179
    if  inst.buffer1!= None and  inst.buffer2!= None:  #line 180
        concatenated_string =  ""                      #line 181
        if  0 == len ( inst.buffer1):                  #line 182
            concatenated_string =  inst.buffer2        #line 183
        elif  0 == len ( inst.buffer2):                #line 184
            concatenated_string =  inst.buffer1        #line 185
        else:                                          #line 186
            concatenated_string =  inst.buffer1+ inst.buffer2#line 187#line 188
        send ( eh, "", concatenated_string, mev)       #line 189
        inst.buffer1 =  None                           #line 190
        inst.buffer2 =  None                           #line 191#line 192#line 193#line 194

#                                                      #line 195#line 196
def string_constant_instantiate (reg,owner,name,template_data):#line 197
    global projectRoot                                 #line 198
    name_with_id = gensymbol ( "strconst")             #line 199
    s =  template_data                                 #line 200
    if  projectRoot!= "":                              #line 201
        s = re.sub ( "_00_",  projectRoot,  s)         #line 202#line 203
    return make_leaf ( name_with_id, owner, s, string_constant_handler)#line 204#line 205#line 206

def string_constant_handler (eh,mev):                  #line 207
    s =  eh.instance_data                              #line 208
    send ( eh, "", s, mev)                             #line 209#line 210#line 211

def fakepipename_instantiate (reg,owner,name,template_data):#line 212
    instance_name = gensymbol ( "fakepipe")            #line 213
    return make_leaf ( instance_name, owner, None, fakepipename_handler)#line 214#line 215#line 216

rand =  0                                              #line 217#line 218
def fakepipename_handler (eh,mev):                     #line 219
    global rand                                        #line 220
    rand =  rand+ 1
    # not very random, but good enough _ ;rand' must be unique within a single run#line 221
    send ( eh, "", str( "/tmp/fakepipe") +  rand , mev)#line 222#line 223#line 224
                                                       #line 225
class Switch1star_Instance_Data:
    def __init__ (self,):                              #line 226
        self.state =  "1"                              #line 227#line 228
                                                       #line 229
def switch1star_instantiate (reg,owner,name,template_data):#line 230
    name_with_id = gensymbol ( "switch1*")             #line 231
    instp =  Switch1star_Instance_Data ()              #line 232
    return make_leaf ( name_with_id, owner, instp, switch1star_handler)#line 233#line 234#line 235

def switch1star_handler (eh,mev):                      #line 236
    inst =  eh.instance_data                           #line 237
    whichOutput =  inst.state                          #line 238
    if  "" ==  mev.port:                               #line 239
        if  "1" ==  whichOutput:                       #line 240
            forward ( eh, "1", mev)                    #line 241
            inst.state =  "*"                          #line 242
        elif  "*" ==  whichOutput:                     #line 243
            forward ( eh, "*", mev)                    #line 244
        else:                                          #line 245
            send ( eh, "✗", "internal error bad state in switch1*", mev)#line 246#line 247
    elif  "reset" ==  mev.port:                        #line 248
        inst.state =  "1"                              #line 249
    else:                                              #line 250
        send ( eh, "✗", "internal error bad mevent for switch1*", mev)#line 251#line 252#line 253#line 254

class StringAccumulator:
    def __init__ (self,):                              #line 255
        self.s =  ""                                   #line 256#line 257
                                                       #line 258
def strcatstar_instantiate (reg,owner,name,template_data):#line 259
    name_with_id = gensymbol ( "String Concat *")      #line 260
    instp =  StringAccumulator ()                      #line 261
    return make_leaf ( name_with_id, owner, instp, strcatstar_handler)#line 262#line 263#line 264

def strcatstar_handler (eh,mev):                       #line 265
    accum =  eh.instance_data                          #line 266
    if  "" ==  mev.port:                               #line 267
        accum.s =  str( accum.s) +  mev.datum.v        #line 268
    elif  "fini" ==  mev.port:                         #line 269
        send ( eh, "", accum.s, mev)                   #line 270
    else:                                              #line 271
        send ( eh, "✗", "internal error bad mevent for String Concat *", mev)#line 272#line 273#line 274#line 275

# all of the the built_in leaves are listed here       #line 276
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 277#line 278
def initialize_stock_components (reg):                 #line 279
    register_component ( reg,mkTemplate ( "1then2", None, deracer_instantiate))#line 280
    register_component ( reg,mkTemplate ( "?A", None, probeA_instantiate))#line 281
    register_component ( reg,mkTemplate ( "?B", None, probeB_instantiate))#line 282
    register_component ( reg,mkTemplate ( "?C", None, probeC_instantiate))#line 283
    register_component ( reg,mkTemplate ( "trash", None, trash_instantiate))#line 284#line 285#line 286
    register_component ( reg,mkTemplate ( "Read Text File", None, low_level_read_text_file_instantiate))#line 287
    register_component ( reg,mkTemplate ( "Ensure String Datum", None, ensure_string_datum_instantiate))#line 288#line 289
    register_component ( reg,mkTemplate ( "syncfilewrite", None, syncfilewrite_instantiate))#line 290
    register_component ( reg,mkTemplate ( "stringconcat", None, stringconcat_instantiate))#line 291
    register_component ( reg,mkTemplate ( "switch1*", None, switch1star_instantiate))#line 292
    register_component ( reg,mkTemplate ( "String Concat *", None, strcatstar_instantiate))#line 293
    # for fakepipe                                     #line 294
    register_component ( reg,mkTemplate ( "fakepipename", None, fakepipename_instantiate))#line 295#line 296#line 297