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

# Stop all children. Reset to a known state. Hit the big red button. #line 200
def container_reset_children (container):              #line 201
    for child in  container.children:                  #line 202
        child.stop ( child)                            #line 203#line 204

    container.visit_ordering.clear ()                  #line 205

    container.routings.clear ()                        #line 206

    container.inq.clear ()                             #line 207

    container.outq.clear ()                            #line 208
    container.state =  "idle"                          #line 209#line 210#line 211

# Frees the given container and associated data.       #line 212
def destroy_container (eh):                            #line 213
    pass                                               #line 214#line 215#line 216
                                                       #line 217
# Routing connection for a container component. The `direction` field has#line 218
# no affect on the default mevent routing system _ it is there for debugging#line 219
# purposes, or for reading by other tools.             #line 220#line 221
class Connector:
    def __init__ (self,):                              #line 222
        self.direction =  None # down, across, up, through#line 223
        self.sender =  None                            #line 224
        self.receiver =  None                          #line 225#line 226
                                                       #line 227
# `Sender` is used to “pattern match“ which `Receiver` a mevent should go to,#line 228
# based on component ID (pointer) and port name.       #line 229#line 230
class Sender:
    def __init__ (self,):                              #line 231
        self.name =  None                              #line 232
        self.component =  None                         #line 233
        self.port =  None                              #line 234#line 235
                                                       #line 236#line 237#line 238
# `Receiver` is a handle to a destination queue, and a `port` name to assign#line 239
# to incoming mevents to this queue.                   #line 240#line 241
class Receiver:
    def __init__ (self,):                              #line 242
        self.name =  None                              #line 243
        self.queue =  None                             #line 244
        self.port =  None                              #line 245
        self.component =  None                         #line 246#line 247
                                                       #line 248
def mkSender (name,component,port):                    #line 249
    s =  Sender ()                                     #line 250
    s.name =  name                                     #line 251
    s.component =  component                           #line 252
    s.port =  port                                     #line 253
    return  s                                          #line 254#line 255#line 256

def mkReceiver (name,component,port,q):                #line 257
    r =  Receiver ()                                   #line 258
    r.name =  name                                     #line 259
    r.component =  component                           #line 260
    r.port =  port                                     #line 261
    # We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq.#line 262
    r.queue =  q                                       #line 263
    return  r                                          #line 264#line 265#line 266

# Checks if two senders match, by pointer equality and port name matching.#line 267
def sender_eq (s1,s2):                                 #line 268
    same_components = ( s1.component ==  s2.component) #line 269
    same_ports = ( s1.port ==  s2.port)                #line 270
    return  same_components and  same_ports            #line 271#line 272#line 273

# Delivers the given mevent to the receiver of this connector.#line 274#line 275
def deposit (parent,conn,mevent):                      #line 276
    new_mevent = make_mevent ( conn.receiver.port, mevent.datum)#line 277
    push_mevent ( parent, conn.receiver.component, conn.receiver.queue, new_mevent)#line 278#line 279#line 280

def force_tick (parent,eh):                            #line 281
    tick_mev = make_mevent ( ".",new_datum_bang ())    #line 282
    push_mevent ( parent, eh, eh.inq, tick_mev)        #line 283
    return  tick_mev                                   #line 284#line 285#line 286

def push_mevent (parent,receiver,inq,m):               #line 287
    inq.append ( m)                                    #line 288
    if ( receiver.special):                            #line 289
        parent.visit_ordering.appendleft ( receiver)   #line 290
    else:                                              #line 291
        parent.visit_ordering.append ( receiver)       #line 292#line 293#line 294#line 295#line 296

def is_self (child,container):                         #line 297
    # in an earlier version “self“ was denoted as ϕ    #line 298
    return  child ==  container                        #line 299#line 300#line 301

def step_child_once (child,mev):                       #line 302
    if ( False ):                                      #line 303
        print ( str( "-- stepping '") +  str( child.name) +  "'"  , file=sys.stderr)#line 304
                                                       #line 305#line 306
    before_state =  child.state                        #line 307
    child.handler ( child, mev)                        #line 308
    after_state =  child.state                         #line 309
    return [ before_state ==  "idle" and  after_state!= "idle", before_state!= "idle" and  after_state!= "idle", before_state!= "idle" and  after_state ==  "idle"]#line 312#line 313#line 314

def step_children (container,causingMevent):           #line 315
    container.state =  "idle"                          #line 316#line 317
    # phase 1 - loop through children and process inputs or children that not "idle" #line 318
    for child in  list ( container.visit_ordering):    #line 319
        # child = container represents self, skip it   #line 320
        if (not (is_self ( child, container))):        #line 321
            if (not ((0==len( child.inq)))):           #line 322
                mev =  child.inq.popleft ()            #line 323
                step_child_once ( child, mev)          #line 324#line 325
                destroy_mevent ( mev)                  #line 326
            else:                                      #line 327
                if  child.state!= "idle":              #line 328
                    mev = force_tick ( container, child)#line 329
                    step_child_once ( child, mev)      #line 330
                    destroy_mevent ( mev)              #line 331#line 332#line 333#line 334#line 335

    container.visit_ordering.clear ()                  #line 336#line 337
    # phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections #line 338
    for child in  container.children:                  #line 339
        if  child.state ==  "active":                  #line 340
            # if child remains active, then the container must remain active and must propagate “ticks“ to child#line 341
            container.state =  "active"                #line 342#line 343#line 344
        while (not ((0==len( child.outq)))):           #line 345
            mev =  child.outq.popleft ()               #line 346
            route ( container, child, mev)             #line 347
            destroy_mevent ( mev)                      #line 348#line 349#line 350#line 351#line 352

def attempt_tick (parent,eh):                          #line 353
    if  eh.state!= "idle":                             #line 354
        force_tick ( parent, eh)                       #line 355#line 356#line 357#line 358

def is_tick (mev):                                     #line 359
    return  "." ==  mev.port
    # assume that any mevent that is sent to port "." is a tick #line 360#line 361#line 362

# Routes a single mevent to all matching destinations, according to#line 363
# the container's connection network.                  #line 364#line 365
def route (container,from_component,mevent):           #line 366
    was_sent =  False
    # for checking that output went somewhere (at least during bootstrap)#line 367
    fromname =  ""                                     #line 368
    global ticktime                                    #line 369
    ticktime =  ticktime+ 1                            #line 370
    if is_tick ( mevent):                              #line 371
        for child in  container.children:              #line 372
            attempt_tick ( container, child)           #line 373
        was_sent =  True                               #line 374
    else:                                              #line 375
        if (not (is_self ( from_component, container))):#line 376
            fromname =  from_component.name            #line 377#line 378
        from_sender = mkSender ( fromname, from_component, mevent.port)#line 379#line 380
        for connector in  container.connections:       #line 381
            if sender_eq ( from_sender, connector.sender):#line 382
                deposit ( container, connector, mevent)#line 383
                was_sent =  True                       #line 384#line 385#line 386#line 387
    if not ( was_sent):                                #line 388
        live_update ( "internal error",  str( container.name) +  str( ": mevent on port '") +  str( mevent.port) +  str( "' from ") +  str( fromname) +  " dropped on floor..."     )#line 389#line 390#line 391#line 392

def any_child_ready (container):                       #line 393
    for child in  container.children:                  #line 394
        if child_is_ready ( child):                    #line 395
            return  True                               #line 396#line 397#line 398
    return  False                                      #line 399#line 400#line 401

def child_is_ready (eh):                               #line 402
    return (not ((0==len( eh.outq)))) or (not ((0==len( eh.inq)))) or ( eh.state!= "idle") or (any_child_ready ( eh))#line 403#line 404#line 405

def append_routing_descriptor (container,desc):        #line 406
    container.routings.append ( desc)                  #line 407#line 408#line 409

def injector (eh,mevent):                              #line 410
    eh.handler ( eh, mevent)                           #line 411#line 412#line 413
                                                       #line 414#line 415#line 416
class Component_Registry:
    def __init__ (self,):                              #line 417
        self.templates = {}                            #line 418#line 419
                                                       #line 420
class Template:
    def __init__ (self,):                              #line 421
        self.name =  None                              #line 422
        self.container =  None                         #line 423
        self.instantiator =  None                      #line 424#line 425
                                                       #line 426
def mkTemplate (name,template_data,instantiator):      #line 427
    templ =  Template ()                               #line 428
    templ.name =  name                                 #line 429
    templ.template_data =  template_data               #line 430
    templ.instantiator =  instantiator                 #line 431
    return  templ                                      #line 432#line 433#line 434
                                                       #line 435
# convert a little-network to internal form (an object data structure created by json parser) ... #line 436
# the actual data structure depends on the json parser library used by the target language #line 437
# the form of the data structure doesn't matter here, as long as we use lookup operators "@" in this .rt code #line 438#line 439
# ... by reading the little-net from an external file  #line 440
def lnet2internal_from_file (container_xml):           #line 441
    pathname = os.getenv('PBPWD', '<none>')            #line 442
    filename =  os.path.basename ( container_xml)      #line 443

    try:
        fil = open(filename, "r")
        json_data = fil.read()
        routings = json.loads(json_data)
        fil.close ()
        return routings
    except FileNotFoundError:
        print (f"File not found: '{filename}'", file=sys.stderr)
        return None
    except json.JSONDecodeError as e:
        print (f"Error decoding JSON in path /{pathname}/: '{e}'", file=sys.stderr)
        return None
                                                       #line 444#line 445#line 446

# ... by reading the little-net from an embedded string (an aspect of creating t2t tool code) #line 447
def lnet2internal_from_string (lnet):                  #line 448

    try:
        routings = json.loads(lnet)
        return routings
    except json.JSONDecodeError as e:
        print ("Error decoding JSON from string 'lnet': '{e}'")
        return None
                                                       #line 449#line 450#line 451

def delete_decls (d):                                  #line 452
    pass                                               #line 453#line 454#line 455

def make_component_registry ():                        #line 456
    return  Component_Registry ()                      #line 457#line 458#line 459

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 460

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 461#line 462

def abstracted_register_component (reg,template,ok_to_overwrite):#line 463
    name = mangle_name ( template.name)                #line 464
    if  reg!= None and  name in  reg.templates and not  ok_to_overwrite:#line 465
        load_error ( str( "Component /") +  str( template.name) +  "/ already declared"  )#line 466
        return  reg                                    #line 467
    else:                                              #line 468
        reg.templates [name] =  template               #line 469
        return  reg                                    #line 470#line 471#line 472#line 473

def get_component_instance (reg,full_name,owner):      #line 474
    # If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it. #line 475
    # ":?<string>" is a probe part that is tagged with <string> #line 476
    # ":$ <command>" is a shell-out part that sends <command> to the operating system shell #line 477
    # ":<string>" else, it's just treated as a string part that produces <string> on its output #line 478
    template_name = mangle_name ( full_name)           #line 479
    if  ":" ==   full_name[0] :                        #line 480
        instance_name = generate_instance_name ( owner, template_name)#line 481
        instance = jit_instantiate ( reg, owner, instance_name, full_name)#line 482
        return  instance                               #line 483
    else:                                              #line 484
        if  template_name in  reg.templates:           #line 485
            template =  reg.templates [template_name]  #line 486
            if ( template ==  None):                   #line 487
                load_error ( str( "Registry Error (A): Can't find component /") +  str( template_name) +  "/"  )#line 488
                return  None                           #line 489
            else:                                      #line 490
                instance_name = generate_instance_name ( owner, template_name)#line 491
                instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")#line 492
                return  instance                       #line 493#line 494
        else:                                          #line 495
            load_error ( str( "Registry Error (B): Can't find component /") +  str( template_name) +  "/"  )#line 496
            return  None                               #line 497#line 498#line 499#line 500#line 501

def generate_instance_name (owner,template_name):      #line 502
    owner_name =  ""                                   #line 503
    instance_name =  template_name                     #line 504
    if  None!= owner:                                  #line 505
        owner_name =  owner.name                       #line 506
        instance_name =  str( owner_name) +  str( "▹") +  template_name  #line 507
    else:                                              #line 508
        instance_name =  template_name                 #line 509#line 510
    return  instance_name                              #line 511#line 512#line 513

def mangle_name (s):                                   #line 514
    # trim name to remove code from Container component names _ deferred until later (or never)#line 515
    return  s                                          #line 516#line 517#line 518
                                                       #line 519
# Data for an asyncronous component _ effectively, a function with input#line 520
# and output queues of mevents.                        #line 521
#                                                      #line 522
# Components can either be a user_supplied function (“leaf“), or a “container“#line 523
# that routes mevents to child components according to a list of connections#line 524
# that serve as a mevent routing table.                #line 525
#                                                      #line 526
# Child components themselves can be leaves or other containers.#line 527
#                                                      #line 528
# `handler` invokes the code that is attached to this component.#line 529
#                                                      #line 530
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 531
# function may want whenever it is invoked again.      #line 532#line 533
# TODO: what is .routings for? (is it a historical artefact that can be removed?) #line 534#line 535
# Eh_States :: enum { idle, active }                   #line 536
class Eh:
    def __init__ (self,):                              #line 537
        self.name =  ""                                #line 538
        self.inq =  deque ([])                         #line 539
        self.outq =  deque ([])                        #line 540
        self.owner =  None                             #line 541
        self.children = []                             #line 542
        self.visit_ordering =  deque ([])              #line 543
        self.connections = []                          #line 544
        self.routings =  deque ([])                    #line 545
        self.handler =  None                           #line 546
        self.reset_instance_data =  None               #line 547
        self.finject =  None                           #line 548
        self.stop =  None                              #line 549
        self.instance_data =  None                     #line 550# arg needed for probe support #line 551
        self.arg =  ""                                 #line 552
        self.state =  "idle"                           #line 553
        self.special =  False                          #line 554# bootstrap debugging#line 555
        self.kind =  None # enum { container, leaf, }  #line 556#line 557
                                                       #line 558
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 559
# whose handler function is `container_handler`.       #line 560
def make_container (name,owner):                       #line 561
    eh =  Eh ()                                        #line 562
    eh.name =  name                                    #line 563
    eh.owner =  owner                                  #line 564
    eh.handler =  container_handler                    #line 565
    eh.finject =  injector                             #line 566
    eh.stop =  container_reset_children                #line 567
    eh.state =  "idle"                                 #line 568
    eh.kind =  "container"                             #line 569
    return  eh                                         #line 570#line 571#line 572

# Creates a new leaf component out of a handler function, and a data parameter#line 573
# that will be passed back to your handler when called.#line 574#line 575
def make_leaf (name,owner,instance_data,arg,handler,reset_handler):#line 576
    eh =  Eh ()                                        #line 577
    nm =  ""                                           #line 578
    if  None!= owner:                                  #line 579
        nm =  owner.name                               #line 580#line 581
    eh.name =  str( nm) +  str( "▹") +  name           #line 582
    eh.owner =  owner                                  #line 583
    eh.handler =  handler                              #line 584
    eh.reset_handler =  reset_handler                  #line 585
    eh.finject =  injector                             #line 586
    eh.stop =  leaf_reset                              #line 587
    eh.instance_data =  instance_data                  #line 588
    eh.arg =  arg                                      #line 589
    eh.state =  "idle"                                 #line 590
    eh.kind =  "leaf"                                  #line 591
    return  eh                                         #line 592#line 593#line 594

# Reset Leaf part to a known, idle state. Hit the big red button. #line 595
def leaf_reset (part):                                 #line 596

    part.inq.clear ()                                  #line 597

    part.outq.clear ()                                 #line 598
    if ( part.reset_handler!= None):                   #line 599
        part.reset_handler ( part)                     #line 600#line 601
    part.state =  "idle"                               #line 602#line 603#line 604

# Sends a mevent on the given `port` with `data`, placing it on the output#line 605
# of the given component.                              #line 606#line 607
def send (eh,port,obj,causingMevent):                  #line 608
    d =  Datum ()                                      #line 609
    d.v =  obj                                         #line 610
    d.clone =  lambda : obj_clone ( d)                 #line 611
    d.reclaim =  None                                  #line 612
    mev = make_mevent ( port, d)                       #line 613
    put_output ( eh, mev)                              #line 614#line 615#line 616

def forward (eh,port,mev):                             #line 617
    fwdmev = make_mevent ( port, mev.datum)            #line 618
    put_output ( eh, fwdmev)                           #line 619#line 620#line 621

def inject_mevent (eh,mev):                            #line 622
    eh.finject ( eh, mev)                              #line 623#line 624#line 625

def set_active (eh):                                   #line 626
    eh.state =  "active"                               #line 627#line 628#line 629

def set_idle (eh):                                     #line 630
    eh.state =  "idle"                                 #line 631#line 632#line 633

def put_output (eh,mev):                               #line 634
    eh.outq.append ( mev)                              #line 635#line 636#line 637

def obj_clone (obj):                                   #line 638
    return  obj                                        #line 639#line 640#line 641

def initialize_component_palette_from_files (diagram_source_files):#line 642
    reg = make_component_registry ()                   #line 643
    for diagram_source in  diagram_source_files:       #line 644
        all_containers_within_single_file = lnet2internal_from_file ( diagram_source)#line 645
        for container in  all_containers_within_single_file:#line 646
            register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 647#line 648#line 649
    initialize_stock_components ( reg)                 #line 650
    return  reg                                        #line 651#line 652#line 653

def initialize_component_palette_from_string (lnet):   #line 654
    reg = make_component_registry ()                   #line 655
    all_containers = lnet2internal_from_string ( lnet) #line 656
    for container in  all_containers:                  #line 657
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 658#line 659
    initialize_stock_components ( reg)                 #line 660
    return  reg                                        #line 661#line 662#line 663
                                                       #line 664
def clone_string (s):                                  #line 665
    return  s                                          #line 666#line 667#line 668

load_errors =  False                                   #line 669
runtime_errors =  False                                #line 670#line 671
def load_error (s):                                    #line 672
    global load_errors                                 #line 673
    print ( s, file=sys.stderr)                        #line 674
                                                       #line 675
    load_errors =  True                                #line 676#line 677#line 678

def runtime_error (s):                                 #line 679
    global runtime_errors                              #line 680
    print ( s, file=sys.stderr)                        #line 681
    exit (1)                                           #line 682
    runtime_errors =  True                             #line 683#line 684#line 685
                                                       #line 686
def initialize_from_files (diagram_names):             #line 687
    arg =  None                                        #line 688
    palette = initialize_component_palette_from_files ( diagram_names)#line 689
    return [ palette,[ diagram_names, arg]]            #line 690#line 691#line 692

def initialize_from_string ():                         #line 693
    arg =  None                                        #line 694
    palette = initialize_component_palette_from_string ()#line 695
    return [ palette,[ None, arg]]                     #line 696#line 697#line 698

def start (arg,part_name,palette,env):                 #line 699
    part = start_bare ( part_name, palette, env)       #line 700
    inject ( part, "", arg)                            #line 701
    finalize ( part)                                   #line 702#line 703#line 704

def start_bare (part_name,palette,env):                #line 705
    diagram_names =  env [ 0]                          #line 706
    # get entrypoint container                         #line 707
    part = get_component_instance ( palette, part_name, None)#line 708
    if  None ==  part:                                 #line 709
        load_error ( str( "Couldn't find container with page name /") +  str( part_name) +  str( "/ in files ") +  str(str ( diagram_names)) +  " (check tab names, or disable compression?)"    )#line 713#line 714
    return  part                                       #line 715#line 716#line 717

def inject (part,port,payload):                        #line 718
    if not  load_errors:                               #line 719
        d =  Datum ()                                  #line 720
        d.v =  payload                                 #line 721
        d.clone =  lambda : obj_clone ( d)             #line 722
        d.reclaim =  None                              #line 723
        mev = make_mevent ( port, d)                   #line 724
        inject_mevent ( part, mev)                     #line 725
    else:                                              #line 726
        exit (1)                                       #line 727#line 728#line 729#line 730

def finalize (part):                                   #line 731
    print (deque_to_json ( part.outq))                 #line 732#line 733#line 734

def new_datum_bang ():                                 #line 735
    d =  Datum ()                                      #line 736
    d.v =  "!"                                         #line 737
    d.clone =  lambda : obj_clone ( d)                 #line 738
    d.reclaim =  None                                  #line 739
    return  d                                          #line 740#line 741
