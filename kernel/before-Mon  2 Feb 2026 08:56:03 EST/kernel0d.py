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
    parent.visit_ordering.append ( receiver)           #line 289#line 290#line 291

def is_self (child,container):                         #line 292
    # in an earlier version “self“ was denoted as ϕ    #line 293
    return  child ==  container                        #line 294#line 295#line 296

def step_child_once (child,mev):                       #line 297
    before_state =  child.state                        #line 298
    child.handler ( child, mev)                        #line 299
    after_state =  child.state                         #line 300
    return [ before_state ==  "idle" and  after_state!= "idle", before_state!= "idle" and  after_state!= "idle", before_state!= "idle" and  after_state ==  "idle"]#line 303#line 304#line 305

def step_children (container,causingMevent):           #line 306
    container.state =  "idle"                          #line 307#line 308
    # phase 1 - loop through children and process inputs or children that not "idle" #line 309
    for child in  list ( container.visit_ordering):    #line 310
        # child = container represents self, skip it   #line 311
        if (not (is_self ( child, container))):        #line 312
            if (not ((0==len( child.inq)))):           #line 313
                mev =  child.inq.popleft ()            #line 314
                step_child_once ( child, mev)          #line 315#line 316
                destroy_mevent ( mev)                  #line 317
            else:                                      #line 318
                if  child.state!= "idle":              #line 319
                    mev = force_tick ( container, child)#line 320
                    step_child_once ( child, mev)      #line 321
                    destroy_mevent ( mev)              #line 322#line 323#line 324#line 325#line 326

    container.visit_ordering.clear ()                  #line 327#line 328
    # phase 2 - loop through children and route their outputs to appropriate receiver queues based on .connections #line 329
    for child in  container.children:                  #line 330
        if  child.state ==  "active":                  #line 331
            # if child remains active, then the container must remain active and must propagate “ticks“ to child#line 332
            container.state =  "active"                #line 333#line 334#line 335
        while (not ((0==len( child.outq)))):           #line 336
            mev =  child.outq.popleft ()               #line 337
            route ( container, child, mev)             #line 338
            destroy_mevent ( mev)                      #line 339#line 340#line 341#line 342#line 343

def attempt_tick (parent,eh):                          #line 344
    if  eh.state!= "idle":                             #line 345
        force_tick ( parent, eh)                       #line 346#line 347#line 348#line 349

def is_tick (mev):                                     #line 350
    return  "." ==  mev.port
    # assume that any mevent that is sent to port "." is a tick #line 351#line 352#line 353

# Routes a single mevent to all matching destinations, according to#line 354
# the container's connection network.                  #line 355#line 356
def route (container,from_component,mevent):           #line 357
    was_sent =  False
    # for checking that output went somewhere (at least during bootstrap)#line 358
    fromname =  ""                                     #line 359
    global ticktime                                    #line 360
    ticktime =  ticktime+ 1                            #line 361
    if is_tick ( mevent):                              #line 362
        for child in  container.children:              #line 363
            attempt_tick ( container, child)           #line 364
        was_sent =  True                               #line 365
    else:                                              #line 366
        if (not (is_self ( from_component, container))):#line 367
            fromname =  from_component.name            #line 368#line 369
        from_sender = mkSender ( fromname, from_component, mevent.port)#line 370#line 371
        for connector in  container.connections:       #line 372
            if sender_eq ( from_sender, connector.sender):#line 373
                deposit ( container, connector, mevent)#line 374
                was_sent =  True                       #line 375#line 376#line 377#line 378
    if not ( was_sent):                                #line 379
        live_update ( "internal error",  str( container.name) +  str( ": mevent on port '") +  str( mevent.port) +  str( "' from ") +  str( fromname) +  " dropped on floor..."     )#line 380#line 381#line 382#line 383

def any_child_ready (container):                       #line 384
    for child in  container.children:                  #line 385
        if child_is_ready ( child):                    #line 386
            return  True                               #line 387#line 388#line 389
    return  False                                      #line 390#line 391#line 392

def child_is_ready (eh):                               #line 393
    return (not ((0==len( eh.outq)))) or (not ((0==len( eh.inq)))) or ( eh.state!= "idle") or (any_child_ready ( eh))#line 394#line 395#line 396

def append_routing_descriptor (container,desc):        #line 397
    container.routings.append ( desc)                  #line 398#line 399#line 400

def injector (eh,mevent):                              #line 401
    eh.handler ( eh, mevent)                           #line 402#line 403#line 404
                                                       #line 405#line 406#line 407
class Component_Registry:
    def __init__ (self,):                              #line 408
        self.templates = {}                            #line 409#line 410
                                                       #line 411
class Template:
    def __init__ (self,):                              #line 412
        self.name =  None                              #line 413
        self.container =  None                         #line 414
        self.instantiator =  None                      #line 415#line 416
                                                       #line 417
def mkTemplate (name,template_data,instantiator):      #line 418
    templ =  Template ()                               #line 419
    templ.name =  name                                 #line 420
    templ.template_data =  template_data               #line 421
    templ.instantiator =  instantiator                 #line 422
    return  templ                                      #line 423#line 424#line 425
                                                       #line 426
# convert a little-network to internal form (an object data structure created by json parser) ... #line 427
# the actual data structure depends on the json parser library used by the target language #line 428
# the form of the data structure doesn't matter here, as long as we use lookup operators "@" in this .rt code #line 429#line 430
# ... by reading the little-net from an external file  #line 431
def lnet2internal_from_file (container_xml):           #line 432
    pathname = os.getenv('PBPHERE', '<none>')          #line 433
    filename =  os.path.basename ( container_xml)      #line 434

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
                                                       #line 435#line 436#line 437

# ... by reading the little-net from an embedded string (an aspect of creating t2t tool code) #line 438
def lnet2internal_from_string (lnet):                  #line 439

    try:
        routings = json.loads(lnet)
        return routings
    except json.JSONDecodeError as e:
        print ("Error decoding JSON from string 'lnet': '{e}'")
        return None
                                                       #line 440#line 441#line 442

def delete_decls (d):                                  #line 443
    pass                                               #line 444#line 445#line 446

def make_component_registry ():                        #line 447
    return  Component_Registry ()                      #line 448#line 449#line 450

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 451

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 452#line 453

def abstracted_register_component (reg,template,ok_to_overwrite):#line 454
    name = mangle_name ( template.name)                #line 455
    if  reg!= None and  name in  reg.templates and not  ok_to_overwrite:#line 456
        load_error ( str( "Component /") +  str( template.name) +  "/ already declared"  )#line 457
        return  reg                                    #line 458
    else:                                              #line 459
        reg.templates [name] =  template               #line 460
        return  reg                                    #line 461#line 462#line 463#line 464

def get_component_instance (reg,full_name,owner):      #line 465
    # If a part name begins with ":", it is treated as a JIT part and we let the runtime factory generate it on-the-fly (see kernel_external.rt and external.rt) else it is assumed to be a regular AOT part and assumed to have been registered before runtime, so we just pull its template out of the registry and instantiate it. #line 466
    # ":?<string>" is a probe part that is tagged with <string> #line 467
    # ":$ <command>" is a shell-out part that sends <command> to the operating system shell #line 468
    # ":<string>" else, it's just treated as a string part that produces <string> on its output #line 469
    template_name = mangle_name ( full_name)           #line 470
    if  ":" ==   full_name[0] :                        #line 471
        instance_name = generate_instance_name ( owner, template_name)#line 472
        instance = external_instantiate ( reg, owner, instance_name, full_name)#line 473
        return  instance                               #line 474
    else:                                              #line 475
        if  template_name in  reg.templates:           #line 476
            template =  reg.templates [template_name]  #line 477
            if ( template ==  None):                   #line 478
                load_error ( str( "Registry Error (A): Can't find component /") +  str( template_name) +  "/"  )#line 479
                return  None                           #line 480
            else:                                      #line 481
                instance_name = generate_instance_name ( owner, template_name)#line 482
                instance =  template.instantiator ( reg, owner, instance_name, template.template_data, "")#line 483
                return  instance                       #line 484#line 485
        else:                                          #line 486
            load_error ( str( "Registry Error (B): Can't find component /") +  str( template_name) +  "/"  )#line 487
            return  None                               #line 488#line 489#line 490#line 491#line 492

def generate_instance_name (owner,template_name):      #line 493
    owner_name =  ""                                   #line 494
    instance_name =  template_name                     #line 495
    if  None!= owner:                                  #line 496
        owner_name =  owner.name                       #line 497
        instance_name =  str( owner_name) +  str( "▹") +  template_name  #line 498
    else:                                              #line 499
        instance_name =  template_name                 #line 500#line 501
    return  instance_name                              #line 502#line 503#line 504

def mangle_name (s):                                   #line 505
    # trim name to remove code from Container component names _ deferred until later (or never)#line 506
    return  s                                          #line 507#line 508#line 509
                                                       #line 510
# Data for an asyncronous component _ effectively, a function with input#line 511
# and output queues of mevents.                        #line 512
#                                                      #line 513
# Components can either be a user_supplied function (“leaf“), or a “container“#line 514
# that routes mevents to child components according to a list of connections#line 515
# that serve as a mevent routing table.                #line 516
#                                                      #line 517
# Child components themselves can be leaves or other containers.#line 518
#                                                      #line 519
# `handler` invokes the code that is attached to this component.#line 520
#                                                      #line 521
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 522
# function may want whenever it is invoked again.      #line 523#line 524
# TODO: what is .routings for? (is it a historical artefact that can be removed?) #line 525#line 526
# Eh_States :: enum { idle, active }                   #line 527
class Eh:
    def __init__ (self,):                              #line 528
        self.name =  ""                                #line 529
        self.inq =  deque ([])                         #line 530
        self.outq =  deque ([])                        #line 531
        self.owner =  None                             #line 532
        self.children = []                             #line 533
        self.visit_ordering =  deque ([])              #line 534
        self.connections = []                          #line 535
        self.routings =  deque ([])                    #line 536
        self.handler =  None                           #line 537
        self.reset_instance_data =  None               #line 538
        self.finject =  None                           #line 539
        self.stop =  None                              #line 540
        self.instance_data =  None                     #line 541# arg needed for probe support #line 542
        self.arg =  ""                                 #line 543
        self.state =  "idle"                           #line 544# bootstrap debugging#line 545
        self.kind =  None # enum { container, leaf, }  #line 546#line 547
                                                       #line 548
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 549
# whose handler function is `container_handler`.       #line 550
def make_container (name,owner):                       #line 551
    eh =  Eh ()                                        #line 552
    eh.name =  name                                    #line 553
    eh.owner =  owner                                  #line 554
    eh.handler =  container_handler                    #line 555
    eh.finject =  injector                             #line 556
    eh.stop =  container_reset_children                #line 557
    eh.state =  "idle"                                 #line 558
    eh.kind =  "container"                             #line 559
    return  eh                                         #line 560#line 561#line 562

# Creates a new leaf component out of a handler function, and a data parameter#line 563
# that will be passed back to your handler when called.#line 564#line 565
def make_leaf (name,owner,instance_data,arg,handler,reset_handler):#line 566
    eh =  Eh ()                                        #line 567
    nm =  ""                                           #line 568
    if  None!= owner:                                  #line 569
        nm =  owner.name                               #line 570#line 571
    eh.name =  str( nm) +  str( "▹") +  name           #line 572
    eh.owner =  owner                                  #line 573
    eh.handler =  handler                              #line 574
    eh.reset_handler =  reset_handler                  #line 575
    eh.finject =  injector                             #line 576
    eh.stop =  leaf_reset                              #line 577
    eh.instance_data =  instance_data                  #line 578
    eh.arg =  arg                                      #line 579
    eh.state =  "idle"                                 #line 580
    eh.kind =  "leaf"                                  #line 581
    return  eh                                         #line 582#line 583#line 584

# Reset Leaf part to a known, idle state. Hit the big red button. #line 585
def leaf_reset (part):                                 #line 586

    part.inq.clear ()                                  #line 587

    part.outq.clear ()                                 #line 588
    if ( part.reset_handler!= None):                   #line 589
        part.reset_handler ( part)                     #line 590#line 591
    part.state =  "idle"                               #line 592#line 593#line 594

# Sends a mevent on the given `port` with `data`, placing it on the output#line 595
# of the given component.                              #line 596#line 597
def send (eh,port,obj,causingMevent):                  #line 598
    d =  Datum ()                                      #line 599
    d.v =  obj                                         #line 600
    d.clone =  lambda : obj_clone ( d)                 #line 601
    d.reclaim =  None                                  #line 602
    mev = make_mevent ( port, d)                       #line 603
    put_output ( eh, mev)                              #line 604#line 605#line 606

def forward (eh,port,mev):                             #line 607
    fwdmev = make_mevent ( port, mev.datum)            #line 608
    put_output ( eh, fwdmev)                           #line 609#line 610#line 611

def inject_mevent (eh,mev):                            #line 612
    eh.finject ( eh, mev)                              #line 613#line 614#line 615

def set_active (eh):                                   #line 616
    eh.state =  "active"                               #line 617#line 618#line 619

def set_idle (eh):                                     #line 620
    eh.state =  "idle"                                 #line 621#line 622#line 623

def put_output (eh,mev):                               #line 624
    eh.outq.append ( mev)                              #line 625#line 626#line 627

def obj_clone (obj):                                   #line 628
    return  obj                                        #line 629#line 630#line 631

def initialize_component_palette_from_files (diagram_source_files):#line 632
    reg = make_component_registry ()                   #line 633
    for diagram_source in  diagram_source_files:       #line 634
        all_containers_within_single_file = lnet2internal_from_file ( diagram_source)#line 635
        for container in  all_containers_within_single_file:#line 636
            register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 637#line 638#line 639
    initialize_stock_components ( reg)                 #line 640
    return  reg                                        #line 641#line 642#line 643

def initialize_component_palette_from_string (lnet):   #line 644
    reg = make_component_registry ()                   #line 645
    all_containers = lnet2internal_from_string ( lnet) #line 646
    for container in  all_containers:                  #line 647
        register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 648#line 649
    initialize_stock_components ( reg)                 #line 650
    return  reg                                        #line 651#line 652#line 653
                                                       #line 654
def clone_string (s):                                  #line 655
    return  s                                          #line 656#line 657#line 658

load_errors =  False                                   #line 659
runtime_errors =  False                                #line 660#line 661
def load_error (s):                                    #line 662
    global load_errors                                 #line 663
    print ( s, file=sys.stderr)                        #line 664
                                                       #line 665
    load_errors =  True                                #line 666#line 667#line 668

def runtime_error (s):                                 #line 669
    global runtime_errors                              #line 670
    print ( s, file=sys.stderr)                        #line 671
    exit (1)                                           #line 672
    runtime_errors =  True                             #line 673#line 674#line 675
                                                       #line 676
def initialize_from_files (diagram_names):             #line 677
    arg =  None                                        #line 678
    palette = initialize_component_palette_from_files ( diagram_names)#line 679
    return [ palette,[ diagram_names, arg]]            #line 680#line 681#line 682

def initialize_from_string ():                         #line 683
    arg =  None                                        #line 684
    palette = initialize_component_palette_from_string ()#line 685
    return [ palette,[ None, arg]]                     #line 686#line 687#line 688

def start (arg,part_name,palette,env):                 #line 689
    part = start_bare ( part_name, palette, env)       #line 690
    inject ( part, "", arg)                            #line 691
    finalize ( part)                                   #line 692#line 693#line 694

def start_bare (part_name,palette,env):                #line 695
    diagram_names =  env [ 0]                          #line 696
    # get entrypoint container                         #line 697
    part = get_component_instance ( palette, part_name, None)#line 698
    if  None ==  part:                                 #line 699
        load_error ( str( "Couldn't find container with page name /") +  str( part_name) +  str( "/ in files ") +  str(str ( diagram_names)) +  " (check tab names, or disable compression?)"    )#line 703#line 704
    return  part                                       #line 705#line 706#line 707

def inject (part,port,payload):                        #line 708
    if not  load_errors:                               #line 709
        d =  Datum ()                                  #line 710
        d.v =  payload                                 #line 711
        d.clone =  lambda : obj_clone ( d)             #line 712
        d.reclaim =  None                              #line 713
        mev = make_mevent ( port, d)                   #line 714
        inject_mevent ( part, mev)                     #line 715
    else:                                              #line 716
        exit (1)                                       #line 717#line 718#line 719#line 720

def finalize (part):                                   #line 721
    print (deque_to_json ( part.outq))                 #line 722#line 723#line 724

def new_datum_bang ():                                 #line 725
    d =  Datum ()                                      #line 726
    d.v =  "!"                                         #line 727
    d.clone =  lambda : obj_clone ( d)                 #line 728
    d.reclaim =  None                                  #line 729
    return  d                                          #line 730#line 731
# This is called `external` due to historical reasons. This has evolved into 2 kinds of Leaf parts: AOT and JIT (statically generated before runtime, vs. dynamically generated at runtime). If a part name begins with ;:', it is treated specially as a JIT part, else the part is assumed to have been pre-loaded into the register in the regular way. #line 1#line 2
def external_instantiate (reg,owner,name,arg):         #line 3
    name_with_id = gensymbol ( name)                   #line 4
    return make_leaf ( name_with_id, owner, None, arg, handle_external, None)#line 5#line 6#line 7
#line 1
def trash_instantiate (reg,owner,name,template_data,arg):#line 2
    name_with_id = gensymbol ( "trash")                #line 3
    return make_leaf ( name_with_id, owner, None, "", trash_handler, None)#line 4#line 5#line 6

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

def deracer_reset_handler (eh):                        #line 26
    inst =  eh.instance_data                           #line 27
    inst.state =  "idle"                               #line 28
    inst.buffer =  TwoMevents ()                       #line 29#line 30#line 31

def deracer_instantiate (reg,owner,name,template_data,arg):#line 32
    name_with_id = gensymbol ( "deracer")              #line 33
    inst =  Deracer_Instance_Data ()                   #line 34
    inst.state =  "idle"                               #line 35
    inst.buffer =  TwoMevents ()                       #line 36
    eh = make_leaf ( name_with_id, owner, inst, "", deracer_handler, deracer_reset_handler)#line 37
    return  eh                                         #line 38#line 39#line 40

def send_firstmev_then_secondmev (eh,inst):            #line 41
    forward ( eh, "1", inst.buffer.firstmev)           #line 42
    forward ( eh, "2", inst.buffer.secondmev)          #line 43
    reclaim_Buffers_from_heap ( inst)                  #line 44#line 45#line 46

def deracer_handler (eh,mev):                          #line 47
    inst =  eh.instance_data                           #line 48
    if  inst.state ==  "idle":                         #line 49
        if  "1" ==  mev.port:                          #line 50
            inst.buffer.firstmev =  mev                #line 51
            inst.state =  "waitingForSecondmev"        #line 52
        elif  "2" ==  mev.port:                        #line 53
            inst.buffer.secondmev =  mev               #line 54
            inst.state =  "waitingForFirstmev"         #line 55
        else:                                          #line 56
            runtime_error ( str( "bad mev.port (case A) for deracer ") +  mev.port )#line 57#line 58
    elif  inst.state ==  "waitingForFirstmev":         #line 59
        if  "1" ==  mev.port:                          #line 60
            inst.buffer.firstmev =  mev                #line 61
            send_firstmev_then_secondmev ( eh, inst)   #line 62
            inst.state =  "idle"                       #line 63
        else:                                          #line 64
            runtime_error ( str( "deracer: waiting for 1 but got [") +  str( mev.port) +  "] (case B)"  )#line 65#line 66
    elif  inst.state ==  "waitingForSecondmev":        #line 67
        if  "2" ==  mev.port:                          #line 68
            inst.buffer.secondmev =  mev               #line 69
            send_firstmev_then_secondmev ( eh, inst)   #line 70
            inst.state =  "idle"                       #line 71
        else:                                          #line 72
            runtime_error ( str( "deracer: waiting for 2 but got [") +  str( mev.port) +  "] (case C)"  )#line 73#line 74
    else:                                              #line 75
        runtime_error ( "bad state for deracer {eh.state}")#line 76#line 77#line 78#line 79

def low_level_read_text_file_instantiate (reg,owner,name,template_data,arg):#line 80
    name_with_id = gensymbol ( "Low Level Read Text File")#line 81
    return make_leaf ( name_with_id, owner, None, "", low_level_read_text_file_handler, None)#line 82#line 83#line 84

def low_level_read_text_file_handler (eh,mev):         #line 85
    fname =  mev.datum.v                               #line 86

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
                                                       #line 87#line 88#line 89

def ensure_string_datum_instantiate (reg,owner,name,template_data,arg):#line 90
    name_with_id = gensymbol ( "Ensure String Datum")  #line 91
    return make_leaf ( name_with_id, owner, None, "", ensure_string_datum_handler, None)#line 92#line 93#line 94

def ensure_string_datum_handler (eh,mev):              #line 95
    if  "string" ==  mev.datum.kind ():                #line 96
        forward ( eh, "", mev)                         #line 97
    else:                                              #line 98
        emev =  str( "*** ensure: type error (expected a string datum) but got ") +  mev.datum #line 99
        send ( eh, "✗", emev, mev)                     #line 100#line 101#line 102#line 103

class Syncfilewrite_Data:
    def __init__ (self,):                              #line 104
        self.filename =  ""                            #line 105#line 106
                                                       #line 107
def syncfilewrite_reset_handler (eh):                  #line 108
    eh.instance_data =  Syncfilewrite_Data ()          #line 109#line 110#line 111

# temp copy for bootstrap, sends "done“ (error during bootstrap if not wired)#line 112
def syncfilewrite_instantiate (reg,owner,name,template_data,arg):#line 113
    name_with_id = gensymbol ( "syncfilewrite")        #line 114
    inst =  Syncfilewrite_Data ()                      #line 115
    return make_leaf ( name_with_id, owner, inst, "", syncfilewrite_handler, syncfilewrite_reset_handler)#line 116#line 117#line 118

def syncfilewrite_handler (eh,mev):                    #line 119
    inst =  eh.instance_data                           #line 120
    if  "filename" ==  mev.port:                       #line 121
        inst.filename =  mev.datum.v                   #line 122
    elif  "input" ==  mev.port:                        #line 123
        contents =  mev.datum.v                        #line 124
        f = open ( inst.filename, "w")                 #line 125
        if  f!= None:                                  #line 126
            f.write ( mev.datum.v)                     #line 127
            f.close ()                                 #line 128
            send ( eh, "done",new_datum_bang (), mev)  #line 129
        else:                                          #line 130
            send ( eh, "✗", str( "open error on file ") +  inst.filename , mev)#line 131#line 132#line 133#line 134#line 135

class StringConcat_Instance_Data:
    def __init__ (self,):                              #line 136
        self.buffer1 =  None                           #line 137
        self.buffer2 =  None                           #line 138#line 139
                                                       #line 140
def strinconcat_reset_handler (eh):                    #line 141
    inst =  eh.instance_data                           #line 142
    inst.buffer1 =  None                               #line 143
    inst.buffer2 =  None                               #line 144#line 145#line 146

def stringconcat_instantiate (reg,owner,name,template_data,arg):#line 147
    name_with_id = gensymbol ( "stringconcat")         #line 148
    instp =  StringConcat_Instance_Data ()             #line 149
    return make_leaf ( name_with_id, owner, instp, "", stringconcat_handler, stringconcat_reset_handler)#line 150#line 151#line 152

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
    return make_leaf ( name_with_id, owner, s, "", string_constant_handler, None)#line 194#line 195#line 196

def string_constant_handler (eh,mev):                  #line 197
    s =  eh.instance_data                              #line 198
    send ( eh, "", s, mev)                             #line 199#line 200#line 201

def fakepipename_instantiate (reg,owner,name,template_data,arg):#line 202
    instance_name = gensymbol ( "fakepipe")            #line 203
    return make_leaf ( instance_name, owner, None, "", fakepipename_handler, None)#line 204#line 205#line 206

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
def switch1star_reset_handler (eh):                    #line 220
    inst =  eh.instance_data                           #line 221
    inst =  Switch1star_Instance_Data ()               #line 222#line 223#line 224

def switch1star_instantiate (reg,owner,name,template_data,arg):#line 225
    name_with_id = gensymbol ( "switch1*")             #line 226
    instp =  Switch1star_Instance_Data ()              #line 227
    return make_leaf ( name_with_id, owner, instp, "", switch1star_handler, switch1star_reset_handler)#line 228#line 229#line 230

def switch1star_handler (eh,mev):                      #line 231
    inst =  eh.instance_data                           #line 232
    whichOutput =  inst.state                          #line 233
    if  "" ==  mev.port:                               #line 234
        if  "1" ==  whichOutput:                       #line 235
            forward ( eh, "1", mev)                    #line 236
            inst.state =  "*"                          #line 237
        elif  "*" ==  whichOutput:                     #line 238
            forward ( eh, "*", mev)                    #line 239
        else:                                          #line 240
            send ( eh, "✗", "internal error bad state in switch1*", mev)#line 241#line 242
    elif  "reset" ==  mev.port:                        #line 243
        inst.state =  "1"                              #line 244
    else:                                              #line 245
        send ( eh, "✗", "internal error bad mevent for switch1*", mev)#line 246#line 247#line 248#line 249

class StringAccumulator:
    def __init__ (self,):                              #line 250
        self.s =  ""                                   #line 251#line 252
                                                       #line 253
def strcatstar_reset_handler (eh):                     #line 254
    eh.instance_data =  StringAccumulator ()           #line 255#line 256#line 257

def strcatstar_instantiate (reg,owner,name,template_data,arg):#line 258
    name_with_id = gensymbol ( "String Concat *")      #line 259
    instp =  StringAccumulator ()                      #line 260
    return make_leaf ( name_with_id, owner, instp, "", strcatstar_handler, strcatstar_reset_handler)#line 261#line 262#line 263

def strcatstar_handler (eh,mev):                       #line 264
    accum =  eh.instance_data                          #line 265
    if  "" ==  mev.port:                               #line 266
        accum.s =  str( accum.s) +  mev.datum.v        #line 267
    elif  "fini" ==  mev.port:                         #line 268
        send ( eh, "", accum.s, mev)                   #line 269
    else:                                              #line 270
        send ( eh, "✗", "internal error bad mevent for String Concat *", mev)#line 271#line 272#line 273#line 274

class BlockOnErrorState:
    def __init__ (self,):                              #line 275
        self.hasError =  "no"                          #line 276#line 277
                                                       #line 278
def blockOnError_reset_handler (eh):                   #line 279
    eh.instance_data =  BlockOnErrorState ()           #line 280#line 281#line 282

def blockOnError_instantiate (reg,owner,name,template_data,arg):#line 283
    name_with_id = gensymbol ( "blockOnError")         #line 284
    instp =  BlockOnErrorState ()                      #line 285
    return make_leaf ( name_with_id, owner, instp, "", blockOnError_handler, blockOnError_reset_handler)#line 286#line 287#line 288

def blockOnError_handler (eh,mev):                     #line 289
    inst =  eh.instance_data                           #line 290
    if  "" ==  mev.port:                               #line 291
        if  inst.hasError ==  "no":                    #line 292
            send ( eh, "", mev.datum.v, mev)           #line 293#line 294
    elif  "✗" ==  mev.port:                            #line 295
        inst.hasError =  "yes"                         #line 296
    elif  "reset" ==  mev.port:                        #line 297
        inst.hasError =  "no"                          #line 298#line 299#line 300#line 301

def stop_instantiate (reg,owner,name,template_data,arg):#line 302
    name_with_id = gensymbol ( "Stop")                 #line 303
    inst =  None                                       #line 304
    return make_leaf ( name_with_id, owner, inst, "", stop_handler, None)#line 305#line 306#line 307

def stop_handler (eh,mev):                             #line 308
    inst =  eh.instance_data                           #line 309
    parent =  eh.owner                                 #line 310
    s =  str( "   !!! stopping: '") +  str( parent.name) +  "'"  #line 311
    print ( s, file=sys.stderr)                        #line 312
                                                       #line 313
    parent.stop ( parent)                              #line 314
    send ( eh, "", mev.datum.v, mev)                   #line 315#line 316#line 317

# all of the the built_in leaves are listed here       #line 318
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 319#line 320
def initialize_stock_components (reg):                 #line 321
    register_component ( reg,mkTemplate ( "1then2", None, deracer_instantiate))#line 322
    register_component ( reg,mkTemplate ( "1→2", None, deracer_instantiate))#line 323
    register_component ( reg,mkTemplate ( "trash", None, trash_instantiate))#line 324
    register_component ( reg,mkTemplate ( "🗑️", None, trash_instantiate))#line 325
    register_component ( reg,mkTemplate ( "🚫", None, stop_instantiate))#line 326
    register_component ( reg,mkTemplate ( "blockOnError", None, blockOnError_instantiate))#line 327#line 328#line 329
    register_component ( reg,mkTemplate ( "Read Text File", None, low_level_read_text_file_instantiate))#line 330
    register_component ( reg,mkTemplate ( "Ensure String Datum", None, ensure_string_datum_instantiate))#line 331#line 332
    register_component ( reg,mkTemplate ( "syncfilewrite", None, syncfilewrite_instantiate))#line 333
    register_component ( reg,mkTemplate ( "String Concat", None, stringconcat_instantiate))#line 334
    register_component ( reg,mkTemplate ( "switch1*", None, switch1star_instantiate))#line 335
    register_component ( reg,mkTemplate ( "String Concat *", None, strcatstar_instantiate))#line 336
    # for fakepipe                                     #line 337
    register_component ( reg,mkTemplate ( "fakepipename", None, fakepipename_instantiate))#line 338#line 339#line 340
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

def probe_handler (eh,tag,mev):                        #line 14
    s =  mev.datum.v                                   #line 15
    live_update ( "Info",  str( "  @") +  str(str ( ticktime)) +  str( "  ") +  str( "probe ") +  str( eh.name) +  str( ": ") + str ( s)      )#line 23#line 24#line 25

def shell_out_handler (eh,cmd,mev):                    #line 26
    s =  mev.datum.v                                   #line 27
    ret =  None                                        #line 28
    rc =  None                                         #line 29
    stdout =  None                                     #line 30
    stderr =  None                                     #line 31
    command =  cmd                                     #line 32
    pbpRoot = os.getenv('PBP', '<none>')               #line 33
    if  pbpRoot!= "":                                  #line 34
        command = re.sub ( "_/",  str( pbpRoot) +  "/" ,  command)#line 37#line 38

    try:
        with open('junk.command.txt', 'w') as file:
            file.write(os.getcwd())
            file.write(' ')
            file.write(cmd)
            file.write(' ')
        ret = subprocess.run (shlex.split ( command), input= s, text=True, capture_output=True)
        rc = ret.returncode
        stdout = ret.stdout.strip ()
        stderr = ret.stderr.strip ()
    except Exception as e:
        ret = None
        rc = 1
        stdout = ''
        stderr = str(e)
                                                       #line 39
    if  rc ==  0:                                      #line 40
        send ( eh, "", str( stdout) +  stderr , mev)   #line 41
    else:                                              #line 42
        send ( eh, "✗", str( stdout) +  stderr , mev)  #line 43#line 44#line 45#line 46
