

import sys
import re
import subprocess
import shlex
import os
import json
from collections import deque
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
        return  str( "₊") + str ( n)                        #line 26#line 27#line 28#line 29

class Datum:
    def __init__ (self,):                                   #line 30
        self.v =  None                                      #line 31
        self.clone =  None                                  #line 32
        self.reclaim =  None                                #line 33
        self.other =  None # reserved for use on per-project basis #line 34#line 35
                                                            #line 36
def new_datum_string (s):                                   #line 37
    d =  Datum ()                                           #line 38
    d.v =  s                                                #line 39
    d.clone =  lambda : clone_datum_string ( d)             #line 40
    d.reclaim =  lambda : reclaim_datum_string ( d)         #line 41
    return  d                                               #line 42#line 43#line 44

def clone_datum_string (d):                                 #line 45
    newd = new_datum_string ( d.v)                          #line 46
    return  newd                                            #line 47#line 48#line 49

def reclaim_datum_string (src):                             #line 50
    pass                                                    #line 51#line 52#line 53

def new_datum_bang ():                                      #line 54
    p =  Datum ()                                           #line 55
    p.v =  ""                                               #line 56
    p.clone =  lambda : clone_datum_bang ( p)               #line 57
    p.reclaim =  lambda : reclaim_datum_bang ( p)           #line 58
    return  p                                               #line 59#line 60#line 61

def clone_datum_bang (d):                                   #line 62
    return new_datum_bang ()                                #line 63#line 64#line 65

def reclaim_datum_bang (d):                                 #line 66
    pass                                                    #line 67#line 68#line 69

# Message passed to a leaf component.                       #line 70
#                                                           #line 71
# `port` refers to the name of the incoming or outgoing port of this component.#line 72
# `datum` is the data attached to this message.             #line 73
class Message:
    def __init__ (self,):                                   #line 74
        self.port =  None                                   #line 75
        self.datum =  None                                  #line 76#line 77
                                                            #line 78
def clone_port (s):                                         #line 79
    return clone_string ( s)                                #line 80#line 81#line 82

# Utility for making a `Message`. Used to safely “seed“ messages#line 83
# entering the very top of a network.                       #line 84
def make_message (port,datum):                              #line 85
    p = clone_string ( port)                                #line 86
    m =  Message ()                                         #line 87
    m.port =  p                                             #line 88
    m.datum =  datum.clone ()                               #line 89
    return  m                                               #line 90#line 91#line 92

# Clones a message. Primarily used internally for “fanning out“ a message to multiple destinations.#line 93
def message_clone (msg):                                    #line 94
    m =  Message ()                                         #line 95
    m.port = clone_port ( msg.port)                         #line 96
    m.datum =  msg.datum.clone ()                           #line 97
    return  m                                               #line 98#line 99#line 100

# Frees a message.                                          #line 101
def destroy_message (msg):                                  #line 102
    # during debug, dont destroy any message, since we want to trace messages, thus, we need to persist ancestor messages#line 103
    pass                                                    #line 104#line 105#line 106

def destroy_datum (msg):                                    #line 107
    pass                                                    #line 108#line 109#line 110

def destroy_port (msg):                                     #line 111
    pass                                                    #line 112#line 113#line 114

#                                                           #line 115
def format_message (m):                                     #line 116
    if  m ==  None:                                         #line 117
        return  str( "‹") +  str( m.port) +  str( "›:‹") +  str( "ϕ") +  "›,"    #line 118
    else:                                                   #line 119
        return  str( "‹") +  str( m.port) +  str( "›:‹") +  str( m.datum.v) +  "›,"    #line 120#line 121#line 122#line 123

enumDown =  0                                               #line 124
enumAcross =  1                                             #line 125
enumUp =  2                                                 #line 126
enumThrough =  3                                            #line 127#line 128
def create_down_connector (container,proto_conn,connectors,children_by_id):#line 129
    # JSON: {;dir': 0, 'source': {'name': '', 'id': 0}, 'source_port': '', 'target': {'name': 'Echo', 'id': 12}, 'target_port': ''},#line 130
    connector =  Connector ()                               #line 131
    connector.direction =  "down"                           #line 132
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])#line 133
    target_proto =  proto_conn [ "target"]                  #line 134
    id_proto =  target_proto [ "id"]                        #line 135
    target_component =  children_by_id [id_proto]           #line 136
    if ( target_component ==  None):                        #line 137
        load_error ( str( "internal error: .Down connection target internal error ") + ( proto_conn [ "target"]) [ "name"] )#line 138
    else:                                                   #line 139
        connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)#line 140#line 141
    return  connector                                       #line 142#line 143#line 144

def create_across_connector (container,proto_conn,connectors,children_by_id):#line 145
    connector =  Connector ()                               #line 146
    connector.direction =  "across"                         #line 147
    source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])]#line 148
    target_component =  children_by_id [(( proto_conn [ "target"]) [ "id"])]#line 149
    if  source_component ==  None:                          #line 150
        load_error ( str( "internal error: .Across connection source not ok ") + ( proto_conn [ "source"]) [ "name"] )#line 151
    else:                                                   #line 152
        connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])#line 153
        if  target_component ==  None:                      #line 154
            load_error ( str( "internal error: .Across connection target not ok ") + ( proto_conn [ "target"]) [ "name"] )#line 155
        else:                                               #line 156
            connector.receiver = mkReceiver ( target_component.name, target_component, proto_conn [ "target_port"], target_component.inq)#line 157#line 158#line 159
    return  connector                                       #line 160#line 161#line 162

def create_up_connector (container,proto_conn,connectors,children_by_id):#line 163
    connector =  Connector ()                               #line 164
    connector.direction =  "up"                             #line 165
    source_component =  children_by_id [(( proto_conn [ "source"]) [ "id"])]#line 166
    if  source_component ==  None:                          #line 167
        load_error ( str( "internal error: .Up connection source not ok ") + ( proto_conn [ "source"]) [ "name"] )#line 168
    else:                                                   #line 169
        connector.sender = mkSender ( source_component.name, source_component, proto_conn [ "source_port"])#line 170
        connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)#line 171#line 172
    return  connector                                       #line 173#line 174#line 175

def create_through_connector (container,proto_conn,connectors,children_by_id):#line 176
    connector =  Connector ()                               #line 177
    connector.direction =  "through"                        #line 178
    connector.sender = mkSender ( container.name, container, proto_conn [ "source_port"])#line 179
    connector.receiver = mkReceiver ( container.name, container, proto_conn [ "target_port"], container.outq)#line 180
    return  connector                                       #line 181#line 182#line 183
                                                            #line 184
def container_instantiator (reg,owner,container_name,desc): #line 185
    global enumDown, enumUp, enumAcross, enumThrough        #line 186
    container = make_container ( container_name, owner)     #line 187
    children = []                                           #line 188
    children_by_id = {}
    # not strictly necessary, but, we can remove 1 runtime lookup by “compiling it out“ here#line 189
    # collect children                                      #line 190
    for child_desc in  desc [ "children"]:                  #line 191
        child_instance = get_component_instance ( reg, child_desc [ "name"], container)#line 192
        children.append ( child_instance)                   #line 193
        id =  child_desc [ "id"]                            #line 194
        children_by_id [id] =  child_instance               #line 195#line 196#line 197
    container.children =  children                          #line 198#line 199
    connectors = []                                         #line 200
    for proto_conn in  desc [ "connections"]:               #line 201
        connector =  Connector ()                           #line 202
        if  proto_conn [ "dir"] ==  enumDown:               #line 203
            connectors.append (create_down_connector ( container, proto_conn, connectors, children_by_id)) #line 204
        elif  proto_conn [ "dir"] ==  enumAcross:           #line 205
            connectors.append (create_across_connector ( container, proto_conn, connectors, children_by_id)) #line 206
        elif  proto_conn [ "dir"] ==  enumUp:               #line 207
            connectors.append (create_up_connector ( container, proto_conn, connectors, children_by_id)) #line 208
        elif  proto_conn [ "dir"] ==  enumThrough:          #line 209
            connectors.append (create_through_connector ( container, proto_conn, connectors, children_by_id)) #line 210#line 211#line 212
    container.connections =  connectors                     #line 213
    return  container                                       #line 214#line 215#line 216

# The default handler for container components.             #line 217
def container_handler (container,message):                  #line 218
    route ( container, container, message)
    # references to 'self' are replaced by the container during instantiation#line 219
    while any_child_ready ( container):                     #line 220
        step_children ( container, message)                 #line 221#line 222#line 223

# Frees the given container and associated data.            #line 224
def destroy_container (eh):                                 #line 225
    pass                                                    #line 226#line 227#line 228

# Routing connection for a container component. The `direction` field has#line 229
# no affect on the default message routing system _ it is there for debugging#line 230
# purposes, or for reading by other tools.                  #line 231#line 232
class Connector:
    def __init__ (self,):                                   #line 233
        self.direction =  None # down, across, up, through  #line 234
        self.sender =  None                                 #line 235
        self.receiver =  None                               #line 236#line 237
                                                            #line 238
# `Sender` is used to “pattern match“ which `Receiver` a message should go to,#line 239
# based on component ID (pointer) and port name.            #line 240#line 241
class Sender:
    def __init__ (self,):                                   #line 242
        self.name =  None                                   #line 243
        self.component =  None                              #line 244
        self.port =  None                                   #line 245#line 246
                                                            #line 247#line 248#line 249
# `Receiver` is a handle to a destination queue, and a `port` name to assign#line 250
# to incoming messages to this queue.                       #line 251#line 252
class Receiver:
    def __init__ (self,):                                   #line 253
        self.name =  None                                   #line 254
        self.queue =  None                                  #line 255
        self.port =  None                                   #line 256
        self.component =  None                              #line 257#line 258
                                                            #line 259
def mkSender (name,component,port):                         #line 260
    s =  Sender ()                                          #line 261
    s.name =  name                                          #line 262
    s.component =  component                                #line 263
    s.port =  port                                          #line 264
    return  s                                               #line 265#line 266#line 267

def mkReceiver (name,component,port,q):                     #line 268
    r =  Receiver ()                                        #line 269
    r.name =  name                                          #line 270
    r.component =  component                                #line 271
    r.port =  port                                          #line 272
    # We need a way to determine which queue to target. "Down" and "Across" go to inq, "Up" and "Through" go to outq.#line 273
    r.queue =  q                                            #line 274
    return  r                                               #line 275#line 276#line 277

# Checks if two senders match, by pointer equality and port name matching.#line 278
def sender_eq (s1,s2):                                      #line 279
    same_components = ( s1.component ==  s2.component)      #line 280
    same_ports = ( s1.port ==  s2.port)                     #line 281
    return  same_components and  same_ports                 #line 282#line 283#line 284

# Delivers the given message to the receiver of this connector.#line 285#line 286
def deposit (parent,conn,message):                          #line 287
    new_message = make_message ( conn.receiver.port, message.datum)#line 288
    push_message ( parent, conn.receiver.component, conn.receiver.queue, new_message)#line 289#line 290#line 291

def force_tick (parent,eh):                                 #line 292
    tick_msg = make_message ( ".",new_datum_bang ())        #line 293
    push_message ( parent, eh, eh.inq, tick_msg)            #line 294
    return  tick_msg                                        #line 295#line 296#line 297

def push_message (parent,receiver,inq,m):                   #line 298
    inq.append ( m)                                         #line 299
    parent.visit_ordering.append ( receiver)                #line 300#line 301#line 302

def is_self (child,container):                              #line 303
    # in an earlier version “self“ was denoted as ϕ         #line 304
    return  child ==  container                             #line 305#line 306#line 307

def step_child (child,msg):                                 #line 308
    before_state =  child.state                             #line 309
    child.handler ( child, msg)                             #line 310
    after_state =  child.state                              #line 311
    return [ before_state ==  "idle" and  after_state!= "idle", before_state!= "idle" and  after_state!= "idle", before_state!= "idle" and  after_state ==  "idle"]#line 314#line 315#line 316

def step_children (container,causingMessage):               #line 317
    container.state =  "idle"                               #line 318
    for child in  list ( container.visit_ordering):         #line 319
        # child = container represents self, skip it        #line 320
        if (not (is_self ( child, container))):             #line 321
            if (not ((0==len( child.inq)))):                #line 322
                msg =  child.inq.popleft ()                 #line 323
                began_long_run =  None                      #line 324
                continued_long_run =  None                  #line 325
                ended_long_run =  None                      #line 326
                [ began_long_run, continued_long_run, ended_long_run] = step_child ( child, msg)#line 327
                if  began_long_run:                         #line 328
                    pass                                    #line 329
                elif  continued_long_run:                   #line 330
                    pass                                    #line 331
                elif  ended_long_run:                       #line 332
                    pass                                    #line 333#line 334
                destroy_message ( msg)                      #line 335
            else:                                           #line 336
                if  child.state!= "idle":                   #line 337
                    msg = force_tick ( container, child)    #line 338
                    child.handler ( child, msg)             #line 339
                    destroy_message ( msg)                  #line 340#line 341#line 342#line 343
            if  child.state ==  "active":                   #line 344
                # if child remains active, then the container must remain active and must propagate “ticks“ to child#line 345
                container.state =  "active"                 #line 346#line 347#line 348
            while (not ((0==len( child.outq)))):            #line 349
                msg =  child.outq.popleft ()                #line 350
                route ( container, child, msg)              #line 351
                destroy_message ( msg)                      #line 352#line 353#line 354#line 355#line 356#line 357

def attempt_tick (parent,eh):                               #line 358
    if  eh.state!= "idle":                                  #line 359
        force_tick ( parent, eh)                            #line 360#line 361#line 362#line 363

def is_tick (msg):                                          #line 364
    return  "." ==  msg.port
    # assume that any message that is sent to port "." is a tick #line 365#line 366#line 367

# Routes a single message to all matching destinations, according to#line 368
# the container's connection network.                       #line 369#line 370
def route (container,from_component,message):               #line 371
    was_sent =  False
    # for checking that output went somewhere (at least during bootstrap)#line 372
    fromname =  ""                                          #line 373
    if is_tick ( message):                                  #line 374
        for child in  container.children:                   #line 375
            attempt_tick ( container, child)                #line 376
        was_sent =  True                                    #line 377
    else:                                                   #line 378
        if (not (is_self ( from_component, container))):    #line 379
            fromname =  from_component.name                 #line 380
        else:                                               #line 381
            fromname =  container.name                      #line 382#line 383
        from_sender = mkSender ( fromname, from_component, message.port)#line 384#line 385
        for connector in  container.connections:            #line 386
            if sender_eq ( from_sender, connector.sender):  #line 387
                deposit ( container, connector, message)    #line 388
                was_sent =  True                            #line 389#line 390#line 391#line 392
    if not ( was_sent):                                     #line 393
        print ( "\n\n*** Error: ***")                       #line 394
        print ( "***")                                      #line 395
        print ( str( container.name) +  str( ": message '") +  str( message.port) +  str( "' from ") +  str( fromname) +  " dropped on floor..."     )#line 396
        print ( "***")                                      #line 397
        exit ()                                             #line 398#line 399#line 400#line 401

def any_child_ready (container):                            #line 402
    for child in  container.children:                       #line 403
        if child_is_ready ( child):                         #line 404
            return  True                                    #line 405#line 406#line 407
    return  False                                           #line 408#line 409#line 410

def child_is_ready (eh):                                    #line 411
    return (not ((0==len( eh.outq)))) or (not ((0==len( eh.inq)))) or ( eh.state!= "idle") or (any_child_ready ( eh))#line 412#line 413#line 414

def append_routing_descriptor (container,desc):             #line 415
    container.routings.append ( desc)                       #line 416#line 417#line 418

def container_injector (container,message):                 #line 419
    container_handler ( container, message)                 #line 420#line 421#line 422
                                                            #line 423#line 424#line 425
class Component_Registry:
    def __init__ (self,):                                   #line 426
        self.templates = {}                                 #line 427#line 428
                                                            #line 429
class Template:
    def __init__ (self,):                                   #line 430
        self.name =  None                                   #line 431
        self.template_data =  None                          #line 432
        self.instantiator =  None                           #line 433#line 434
                                                            #line 435
def mkTemplate (name,template_data,instantiator):           #line 436
    templ =  Template ()                                    #line 437
    templ.name =  name                                      #line 438
    templ.template_data =  template_data                    #line 439
    templ.instantiator =  instantiator                      #line 440
    return  templ                                           #line 441#line 442#line 443

def read_and_convert_json_file (pathname,filename):         #line 444

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
                                                            #line 445#line 446#line 447

def json2internal (pathname,container_xml):                 #line 448
    fname =  os.path.basename ( container_xml)              #line 449
    routings = read_and_convert_json_file ( pathname, fname)#line 450
    return  routings                                        #line 451#line 452#line 453

def delete_decls (d):                                       #line 454
    pass                                                    #line 455#line 456#line 457

def make_component_registry ():                             #line 458
    return  Component_Registry ()                           #line 459#line 460#line 461

def register_component (reg,template):
    return abstracted_register_component ( reg, template, False)#line 462

def register_component_allow_overwriting (reg,template):
    return abstracted_register_component ( reg, template, True)#line 463#line 464

def abstracted_register_component (reg,template,ok_to_overwrite):#line 465
    name = mangle_name ( template.name)                     #line 466
    if  reg!= None and  name in  reg.templates and not  ok_to_overwrite:#line 467
        load_error ( str( "Component /") +  str( template.name) +  "/ already declared"  )#line 468
        return  reg                                         #line 469
    else:                                                   #line 470
        reg.templates [name] =  template                    #line 471
        return  reg                                         #line 472#line 473#line 474#line 475

def get_component_instance (reg,full_name,owner):           #line 476
    template_name = mangle_name ( full_name)                #line 477
    if  template_name in  reg.templates:                    #line 478
        template =  reg.templates [template_name]           #line 479
        if ( template ==  None):                            #line 480
            load_error ( str( "Registry Error (A): Can't find component /") +  str( template_name) +  "/"  )#line 481
            return  None                                    #line 482
        else:                                               #line 483
            owner_name =  ""                                #line 484
            instance_name =  template_name                  #line 485
            if  None!= owner:                               #line 486
                owner_name =  owner.name                    #line 487
                instance_name =  str( owner_name) +  str( ".") +  template_name  #line 488
            else:                                           #line 489
                instance_name =  template_name              #line 490#line 491
            instance =  template.instantiator ( reg, owner, instance_name, template.template_data)#line 492
            return  instance                                #line 493#line 494
    else:                                                   #line 495
        load_error ( str( "Registry Error (B): Can't find component /") +  str( template_name) +  "/"  )#line 496
        return  None                                        #line 497#line 498#line 499#line 500

def dump_registry (reg):                                    #line 501
    nl ()                                                   #line 502
    print ( "*** PALETTE ***")                              #line 503
    for c in  reg.templates:                                #line 504
        print ( c.name)                                     #line 505
    print ( "***************")                              #line 506
    nl ()                                                   #line 507#line 508#line 509

def print_stats (reg):                                      #line 510
    print ( str( "registry statistics: ") +  reg.stats )    #line 511#line 512#line 513

def mangle_name (s):                                        #line 514
    # trim name to remove code from Container component names _ deferred until later (or never)#line 515
    return  s                                               #line 516#line 517#line 518
                                                            #line 519
# Data for an asyncronous component _ effectively, a function with input#line 520
# and output queues of messages.                            #line 521
#                                                           #line 522
# Components can either be a user_supplied function (“lea“), or a “container“#line 523
# that routes messages to child components according to a list of connections#line 524
# that serve as a message routing table.                    #line 525
#                                                           #line 526
# Child components themselves can be leaves or other containers.#line 527
#                                                           #line 528
# `handler` invokes the code that is attached to this component.#line 529
#                                                           #line 530
# `instance_data` is a pointer to instance data that the `leaf_handler`#line 531
# function may want whenever it is invoked again.           #line 532
#                                                           #line 533#line 534
# Eh_States :: enum { idle, active }                        #line 535
class Eh:
    def __init__ (self,):                                   #line 536
        self.name =  ""                                     #line 537
        self.inq =  deque ([])                              #line 538
        self.outq =  deque ([])                             #line 539
        self.owner =  None                                  #line 540
        self.children = []                                  #line 541
        self.visit_ordering =  deque ([])                   #line 542
        self.connections = []                               #line 543
        self.routings =  deque ([])                         #line 544
        self.handler =  None                                #line 545
        self.finject =  None                                #line 546
        self.instance_data =  None                          #line 547
        self.state =  "idle"                                #line 548# bootstrap debugging#line 549
        self.kind =  None # enum { container, leaf, }       #line 550#line 551
                                                            #line 552
# Creates a component that acts as a container. It is the same as a `Eh` instance#line 553
# whose handler function is `container_handler`.            #line 554
def make_container (name,owner):                            #line 555
    eh =  Eh ()                                             #line 556
    eh.name =  name                                         #line 557
    eh.owner =  owner                                       #line 558
    eh.handler =  container_handler                         #line 559
    eh.finject =  container_injector                        #line 560
    eh.state =  "idle"                                      #line 561
    eh.kind =  "container"                                  #line 562
    return  eh                                              #line 563#line 564#line 565

# Creates a new leaf component out of a handler function, and a data parameter#line 566
# that will be passed back to your handler when called.     #line 567#line 568
def make_leaf (name,owner,instance_data,handler):           #line 569
    eh =  Eh ()                                             #line 570
    eh.name =  str( owner.name) +  str( ".") +  name        #line 571
    eh.owner =  owner                                       #line 572
    eh.handler =  handler                                   #line 573
    eh.instance_data =  instance_data                       #line 574
    eh.state =  "idle"                                      #line 575
    eh.kind =  "leaf"                                       #line 576
    return  eh                                              #line 577#line 578#line 579

# Sends a message on the given `port` with `data`, placing it on the output#line 580
# of the given component.                                   #line 581#line 582
def send (eh,port,datum,causingMessage):                    #line 583
    msg = make_message ( port, datum)                       #line 584
    put_output ( eh, msg)                                   #line 585#line 586#line 587

def send_string (eh,port,s,causingMessage):                 #line 588
    datum = new_datum_string ( s)                           #line 589
    msg = make_message ( port, datum)                       #line 590
    put_output ( eh, msg)                                   #line 591#line 592#line 593

def forward (eh,port,msg):                                  #line 594
    fwdmsg = make_message ( port, msg.datum)                #line 595
    put_output ( eh, fwdmsg)                                #line 596#line 597#line 598

def inject (eh,msg):                                        #line 599
    eh.finject ( eh, msg)                                   #line 600#line 601#line 602

# Returns a list of all output messages on a container.     #line 603
# For testing / debugging purposes.                         #line 604#line 605
def output_list (eh):                                       #line 606
    return  eh.outq                                         #line 607#line 608#line 609

# Utility for printing an array of messages.                #line 610
def print_output_list (eh):                                 #line 611
    print ( "{")                                            #line 612
    for m in  list ( eh.outq):                              #line 613
        print (format_message ( m))                         #line 614#line 615
    print ( "}")                                            #line 616#line 617#line 618

def spaces (n):                                             #line 619
    s =  ""                                                 #line 620
    for i in range( n):                                     #line 621
        s =  s+ " "                                         #line 622
    return  s                                               #line 623#line 624#line 625

def set_active (eh):                                        #line 626
    eh.state =  "active"                                    #line 627#line 628#line 629

def set_idle (eh):                                          #line 630
    eh.state =  "idle"                                      #line 631#line 632#line 633

# Utility for printing a specific output message.           #line 634#line 635
def fetch_first_output (eh,port):                           #line 636
    for msg in  list ( eh.outq):                            #line 637
        if ( msg.port ==  port):                            #line 638
            return  msg.datum                               #line 639
    return  None                                            #line 640#line 641#line 642

def print_specific_output (eh,port):                        #line 643
    # port ∷ “”                                             #line 644
    datum = fetch_first_output ( eh, port)                  #line 645
    print ( datum.v)                                        #line 646#line 647

def print_specific_output_to_stderr (eh,port):              #line 648
    # port ∷ “”                                             #line 649
    datum = fetch_first_output ( eh, port)                  #line 650
    # I don't remember why I found it useful to print to stderr during bootstrapping, so I've left it in...#line 651
    print ( datum.v, file=sys.stderr)                       #line 652#line 653#line 654

def put_output (eh,msg):                                    #line 655
    eh.outq.append ( msg)                                   #line 656#line 657#line 658

root_project =  ""                                          #line 659
root_0D =  ""                                               #line 660#line 661
def set_environment (rproject,r0D):                         #line 662
    global root_project                                     #line 663
    global root_0D                                          #line 664
    root_project =  rproject                                #line 665
    root_0D =  r0D                                          #line 666#line 667#line 668
                                                            #line 669
def string_make_persistent (s):                             #line 670
    # this is here for non_GC languages like Odin, it is a no_op for GC languages like Python#line 671
    return  s                                               #line 672#line 673#line 674

def string_clone (s):                                       #line 675
    return  s                                               #line 676#line 677#line 678

# usage: app ${_00_} ${_0D_} arg main diagram_filename1 diagram_filename2 ...#line 679
# where ${_00_} is the root directory for the project       #line 680
# where ${_0D_} is the root directory for 0D (e.g. 0D/odin or 0D/python)#line 681#line 682
def initialize_component_palette (root_project,root_0D,diagram_source_files):#line 683
    reg = make_component_registry ()                        #line 684
    for diagram_source in  diagram_source_files:            #line 685
        all_containers_within_single_file = json2internal ( root_project, diagram_source)#line 686
        reg = generate_shell_components ( reg, all_containers_within_single_file)#line 687
        for container in  all_containers_within_single_file:#line 688
            register_component ( reg,mkTemplate ( container [ "name"], container, container_instantiator))#line 689#line 690#line 691
    initialize_stock_components ( reg)                      #line 692
    return  reg                                             #line 693#line 694#line 695

def print_error_maybe (main_container):                     #line 696
    error_port =  "✗"                                       #line 697
    err = fetch_first_output ( main_container, error_port)  #line 698
    if ( err!= None) and ( 0 < len (trimws ( err.v))):      #line 699
        print ( "___ !!! ERRORS !!! ___")                   #line 700
        print_specific_output ( main_container, error_port) #line 701#line 702#line 703#line 704

# debugging helpers                                         #line 705#line 706
def nl ():                                                  #line 707
    print ( "")                                             #line 708#line 709#line 710

def dump_outputs (main_container):                          #line 711
    nl ()                                                   #line 712
    print ( "___ Outputs ___")                              #line 713
    print_output_list ( main_container)                     #line 714#line 715#line 716

def trimws (s):                                             #line 717
    # remove whitespace from front and back of string       #line 718
    return  s.strip ()                                      #line 719#line 720#line 721

def clone_string (s):                                       #line 722
    return  s                                               #line 723#line 724#line 725

load_errors =  False                                        #line 726
runtime_errors =  False                                     #line 727#line 728
def load_error (s):                                         #line 729
    global load_errors                                      #line 730
    print ( s)                                              #line 731
    print ()                                                #line 732
    load_errors =  True                                     #line 733#line 734#line 735

def runtime_error (s):                                      #line 736
    global runtime_errors                                   #line 737
    print ( s)                                              #line 738
    runtime_errors =  True                                  #line 739#line 740#line 741
                                                            #line 742
def argv ():                                                #line 743
    return  sys.argv                                        #line 744#line 745#line 746

def initialize ():                                          #line 747
    root_of_project =  sys.argv[ 1]                         #line 748
    root_of_0D =  sys.argv[ 2]                              #line 749
    arg =  sys.argv[ 3]                                     #line 750
    main_container_name =  sys.argv[ 4]                     #line 751
    diagram_names =  sys.argv[ 5:]                          #line 752
    palette = initialize_component_palette ( root_of_project, root_of_0D, diagram_names)#line 753
    return [ palette,[ root_of_project, root_of_0D, main_container_name, diagram_names, arg]]#line 754#line 755#line 756

def start (palette,env):
    start_helper ( palette, env, False)                     #line 757

def start_show_all (palette,env):
    start_helper ( palette, env, True)                      #line 758

def start_helper (palette,env,show_all_outputs):            #line 759
    root_of_project =  env [ 0]                             #line 760
    root_of_0D =  env [ 1]                                  #line 761
    main_container_name =  env [ 2]                         #line 762
    diagram_names =  env [ 3]                               #line 763
    arg =  env [ 4]                                         #line 764
    set_environment ( root_of_project, root_of_0D)          #line 765
    # get entrypoint container                              #line 766
    main_container = get_component_instance ( palette, main_container_name, None)#line 767
    if  None ==  main_container:                            #line 768
        load_error ( str( "Couldn't find container with page name /") +  str( main_container_name) +  str( "/ in files ") +  str(str ( diagram_names)) +  " (check tab names, or disable compression?)"    )#line 772#line 773
    if not  load_errors:                                    #line 774
        marg = new_datum_string ( arg)                      #line 775
        msg = make_message ( "", marg)                      #line 776
        inject ( main_container, msg)                       #line 777
        if  show_all_outputs:                               #line 778
            dump_outputs ( main_container)                  #line 779
        else:                                               #line 780
            print_error_maybe ( main_container)             #line 781
            outp = fetch_first_output ( main_container, "") #line 782
            if  None ==  outp:                              #line 783
                print ( "«««no outputs»»»)")                #line 784
            else:                                           #line 785
                print_specific_output ( main_container, "") #line 786#line 787#line 788
        if  show_all_outputs:                               #line 789
            print ( "--- done ---")                         #line 790#line 791#line 792#line 793#line 794
                                                            #line 795
# utility functions                                         #line 796
def send_int (eh,port,i,causing_message):                   #line 797
    datum = new_datum_string (str ( i))                     #line 798
    send ( eh, port, datum, causing_message)                #line 799#line 800#line 801

def send_bang (eh,port,causing_message):                    #line 802
    datum = new_datum_bang ()                               #line 803
    send ( eh, port, datum, causing_message)                #line 804#line 805







def probeA_instantiate (reg,owner,name,template_data):      #line 1
    name_with_id = gensymbol ( "?A")                        #line 2
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 3#line 4#line 5

def probeB_instantiate (reg,owner,name,template_data):      #line 6
    name_with_id = gensymbol ( "?B")                        #line 7
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 8#line 9#line 10

def probeC_instantiate (reg,owner,name,template_data):      #line 11
    name_with_id = gensymbol ( "?C")                        #line 12
    return make_leaf ( name_with_id, owner, None, probe_handler)#line 13#line 14#line 15

def probe_handler (eh,msg):                                 #line 16
    s =  msg.datum.v                                        #line 17
    print ( str( "... probe ") +  str( eh.name) +  str( ": ") +  s   , file=sys.stderr)#line 18#line 19#line 20

def trash_instantiate (reg,owner,name,template_data):       #line 21
    name_with_id = gensymbol ( "trash")                     #line 22
    return make_leaf ( name_with_id, owner, None, trash_handler)#line 23#line 24#line 25

def trash_handler (eh,msg):                                 #line 26
    # to appease dumped_on_floor checker                    #line 27
    pass                                                    #line 28#line 29

class TwoMessages:
    def __init__ (self,):                                   #line 30
        self.firstmsg =  None                               #line 31
        self.secondmsg =  None                              #line 32#line 33
                                                            #line 34
# Deracer_States :: enum { idle, waitingForFirstmsg, waitingForSecondmsg }#line 35
class Deracer_Instance_Data:
    def __init__ (self,):                                   #line 36
        self.state =  None                                  #line 37
        self.buffer =  None                                 #line 38#line 39
                                                            #line 40
def reclaim_Buffers_from_heap (inst):                       #line 41
    pass                                                    #line 42#line 43#line 44

def deracer_instantiate (reg,owner,name,template_data):     #line 45
    name_with_id = gensymbol ( "deracer")                   #line 46
    inst =  Deracer_Instance_Data ()                        #line 47
    inst.state =  "idle"                                    #line 48
    inst.buffer =  TwoMessages ()                           #line 49
    eh = make_leaf ( name_with_id, owner, inst, deracer_handler)#line 50
    return  eh                                              #line 51#line 52#line 53

def send_firstmsg_then_secondmsg (eh,inst):                 #line 54
    forward ( eh, "1", inst.buffer.firstmsg)                #line 55
    forward ( eh, "2", inst.buffer.secondmsg)               #line 56
    reclaim_Buffers_from_heap ( inst)                       #line 57#line 58#line 59

def deracer_handler (eh,msg):                               #line 60
    inst =  eh.instance_data                                #line 61
    if  inst.state ==  "idle":                              #line 62
        if  "1" ==  msg.port:                               #line 63
            inst.buffer.firstmsg =  msg                     #line 64
            inst.state =  "waitingForSecondmsg"             #line 65
        elif  "2" ==  msg.port:                             #line 66
            inst.buffer.secondmsg =  msg                    #line 67
            inst.state =  "waitingForFirstmsg"              #line 68
        else:                                               #line 69
            runtime_error ( str( "bad msg.port (case A) for deracer ") +  msg.port )#line 70#line 71
    elif  inst.state ==  "waitingForFirstmsg":              #line 72
        if  "1" ==  msg.port:                               #line 73
            inst.buffer.firstmsg =  msg                     #line 74
            send_firstmsg_then_secondmsg ( eh, inst)        #line 75
            inst.state =  "idle"                            #line 76
        else:                                               #line 77
            runtime_error ( str( "bad msg.port (case B) for deracer ") +  msg.port )#line 78#line 79
    elif  inst.state ==  "waitingForSecondmsg":             #line 80
        if  "2" ==  msg.port:                               #line 81
            inst.buffer.secondmsg =  msg                    #line 82
            send_firstmsg_then_secondmsg ( eh, inst)        #line 83
            inst.state =  "idle"                            #line 84
        else:                                               #line 85
            runtime_error ( str( "bad msg.port (case C) for deracer ") +  msg.port )#line 86#line 87
    else:                                                   #line 88
        runtime_error ( "bad state for deracer {eh.state}") #line 89#line 90#line 91#line 92

def low_level_read_text_file_instantiate (reg,owner,name,template_data):#line 93
    name_with_id = gensymbol ( "Low Level Read Text File")  #line 94
    return make_leaf ( name_with_id, owner, None, low_level_read_text_file_handler)#line 95#line 96#line 97

def low_level_read_text_file_handler (eh,msg):              #line 98
    fname =  msg.datum.v                                    #line 99

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
                                                            #line 100#line 101#line 102

def ensure_string_datum_instantiate (reg,owner,name,template_data):#line 103
    name_with_id = gensymbol ( "Ensure String Datum")       #line 104
    return make_leaf ( name_with_id, owner, None, ensure_string_datum_handler)#line 105#line 106#line 107

def ensure_string_datum_handler (eh,msg):                   #line 108
    if  "string" ==  msg.datum.kind ():                     #line 109
        forward ( eh, "", msg)                              #line 110
    else:                                                   #line 111
        emsg =  str( "*** ensure: type error (expected a string datum) but got ") +  msg.datum #line 112
        send_string ( eh, "✗", emsg, msg)                   #line 113#line 114#line 115#line 116

class Syncfilewrite_Data:
    def __init__ (self,):                                   #line 117
        self.filename =  ""                                 #line 118#line 119
                                                            #line 120
# temp copy for bootstrap, sends “done“ (error during bootstrap if not wired)#line 121
def syncfilewrite_instantiate (reg,owner,name,template_data):#line 122
    name_with_id = gensymbol ( "syncfilewrite")             #line 123
    inst =  Syncfilewrite_Data ()                           #line 124
    return make_leaf ( name_with_id, owner, inst, syncfilewrite_handler)#line 125#line 126#line 127

def syncfilewrite_handler (eh,msg):                         #line 128
    inst =  eh.instance_data                                #line 129
    if  "filename" ==  msg.port:                            #line 130
        inst.filename =  msg.datum.v                        #line 131
    elif  "input" ==  msg.port:                             #line 132
        contents =  msg.datum.v                             #line 133
        f = open ( inst.filename, "w")                      #line 134
        if  f!= None:                                       #line 135
            f.write ( msg.datum.v)                          #line 136
            f.close ()                                      #line 137
            send ( eh, "done",new_datum_bang (), msg)       #line 138
        else:                                               #line 139
            send_string ( eh, "✗", str( "open error on file ") +  inst.filename , msg)#line 140#line 141#line 142#line 143#line 144

class StringConcat_Instance_Data:
    def __init__ (self,):                                   #line 145
        self.buffer1 =  None                                #line 146
        self.buffer2 =  None                                #line 147#line 148
                                                            #line 149
def stringconcat_instantiate (reg,owner,name,template_data):#line 150
    name_with_id = gensymbol ( "stringconcat")              #line 151
    instp =  StringConcat_Instance_Data ()                  #line 152
    return make_leaf ( name_with_id, owner, instp, stringconcat_handler)#line 153#line 154#line 155

def stringconcat_handler (eh,msg):                          #line 156
    inst =  eh.instance_data                                #line 157
    if  "1" ==  msg.port:                                   #line 158
        inst.buffer1 = clone_string ( msg.datum.v)          #line 159
        maybe_stringconcat ( eh, inst, msg)                 #line 160
    elif  "2" ==  msg.port:                                 #line 161
        inst.buffer2 = clone_string ( msg.datum.v)          #line 162
        maybe_stringconcat ( eh, inst, msg)                 #line 163
    elif  "reset" ==  msg.port:                             #line 164
        inst.buffer1 =  None                                #line 165
        inst.buffer2 =  None                                #line 166
    else:                                                   #line 167
        runtime_error ( str( "bad msg.port for stringconcat: ") +  msg.port )#line 168#line 169#line 170#line 171

def maybe_stringconcat (eh,inst,msg):                       #line 172
    if  inst.buffer1!= None and  inst.buffer2!= None:       #line 173
        concatenated_string =  ""                           #line 174
        if  0 == len ( inst.buffer1):                       #line 175
            concatenated_string =  inst.buffer2             #line 176
        elif  0 == len ( inst.buffer2):                     #line 177
            concatenated_string =  inst.buffer1             #line 178
        else:                                               #line 179
            concatenated_string =  inst.buffer1+ inst.buffer2#line 180#line 181
        send_string ( eh, "", concatenated_string, msg)     #line 182
        inst.buffer1 =  None                                #line 183
        inst.buffer2 =  None                                #line 184#line 185#line 186#line 187

#                                                           #line 188#line 189
def string_constant_instantiate (reg,owner,name,template_data):#line 190
    global root_project                                     #line 191
    global root_0D                                          #line 192
    name_with_id = gensymbol ( "strconst")                  #line 193
    s =  template_data                                      #line 194
    if  root_project!= "":                                  #line 195
        s = re.sub ( "_00_",  root_project,  s)             #line 196#line 197
    if  root_0D!= "":                                       #line 198
        s = re.sub ( "_0D_",  root_0D,  s)                  #line 199#line 200
    return make_leaf ( name_with_id, owner, s, string_constant_handler)#line 201#line 202#line 203

def string_constant_handler (eh,msg):                       #line 204
    s =  eh.instance_data                                   #line 205
    send_string ( eh, "", s, msg)                           #line 206#line 207#line 208

def fakepipename_instantiate (reg,owner,name,template_data):#line 209
    instance_name = gensymbol ( "fakepipe")                 #line 210
    return make_leaf ( instance_name, owner, None, fakepipename_handler)#line 211#line 212#line 213

rand =  0                                                   #line 214#line 215
def fakepipename_handler (eh,msg):                          #line 216
    global rand                                             #line 217
    rand =  rand+ 1
    # not very random, but good enough _ ;rand' must be unique within a single run#line 218
    send_string ( eh, "", str( "/tmp/fakepipe") +  rand , msg)#line 219#line 220#line 221
                                                            #line 222
class Switch1star_Instance_Data:
    def __init__ (self,):                                   #line 223
        self.state =  "1"                                   #line 224#line 225
                                                            #line 226
def switch1star_instantiate (reg,owner,name,template_data): #line 227
    name_with_id = gensymbol ( "switch1*")                  #line 228
    instp =  Switch1star_Instance_Data ()                   #line 229
    return make_leaf ( name_with_id, owner, instp, switch1star_handler)#line 230#line 231#line 232

def switch1star_handler (eh,msg):                           #line 233
    inst =  eh.instance_data                                #line 234
    whichOutput =  inst.state                               #line 235
    if  "" ==  msg.port:                                    #line 236
        if  "1" ==  whichOutput:                            #line 237
            forward ( eh, "1", msg)                         #line 238
            inst.state =  "*"                               #line 239
        elif  "*" ==  whichOutput:                          #line 240
            forward ( eh, "*", msg)                         #line 241
        else:                                               #line 242
            send ( eh, "✗", "internal error bad state in switch1*", msg)#line 243#line 244
    elif  "reset" ==  msg.port:                             #line 245
        inst.state =  "1"                                   #line 246
    else:                                                   #line 247
        send ( eh, "✗", "internal error bad message for switch1*", msg)#line 248#line 249#line 250#line 251

class Latch_Instance_Data:
    def __init__ (self,):                                   #line 252
        self.datum =  None                                  #line 253#line 254
                                                            #line 255
def latch_instantiate (reg,owner,name,template_data):       #line 256
    name_with_id = gensymbol ( "latch")                     #line 257
    instp =  Latch_Instance_Data ()                         #line 258
    return make_leaf ( name_with_id, owner, instp, latch_handler)#line 259#line 260#line 261

def latch_handler (eh,msg):                                 #line 262
    inst =  eh.instance_data                                #line 263
    if  "" ==  msg.port:                                    #line 264
        inst.datum =  msg.datum                             #line 265
    elif  "release" ==  msg.port:                           #line 266
        d =  inst.datum                                     #line 267
        send ( eh, "", d, msg)                              #line 268
        inst.datum =  None                                  #line 269
    else:                                                   #line 270
        send ( eh, "✗", "internal error bad message for latch", msg)#line 271#line 272#line 273#line 274

# all of the the built_in leaves are listed here            #line 275
# future: refactor this such that programmers can pick and choose which (lumps of) builtins are used in a specific project#line 276#line 277
def initialize_stock_components (reg):                      #line 278
    register_component ( reg,mkTemplate ( "1then2", None, deracer_instantiate))#line 279
    register_component ( reg,mkTemplate ( "?A", None, probeA_instantiate))#line 280
    register_component ( reg,mkTemplate ( "?B", None, probeB_instantiate))#line 281
    register_component ( reg,mkTemplate ( "?C", None, probeC_instantiate))#line 282
    register_component ( reg,mkTemplate ( "trash", None, trash_instantiate))#line 283#line 284
    register_component ( reg,mkTemplate ( "Read Text File", None, low_level_read_text_file_instantiate))#line 285
    register_component ( reg,mkTemplate ( "Ensure String Datum", None, ensure_string_datum_instantiate))#line 286#line 287
    register_component ( reg,mkTemplate ( "syncfilewrite", None, syncfilewrite_instantiate))#line 288
    register_component ( reg,mkTemplate ( "stringconcat", None, stringconcat_instantiate))#line 289
    register_component ( reg,mkTemplate ( "switch1*", None, switch1star_instantiate))#line 290
    register_component ( reg,mkTemplate ( "latch", None, latch_instantiate))#line 291
    # for fakepipe                                          #line 292
    register_component ( reg,mkTemplate ( "fakepipename", None, fakepipename_instantiate))#line 293#line 294#line 295







# this needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here#line 1
def shell_out_instantiate (reg,owner,name,template_data):   #line 2
    name_with_id = gensymbol ( "shell_out")                 #line 3
    cmd = shlex.split ( template_data)                      #line 4
    return make_leaf ( name_with_id, owner, cmd, shell_out_handler)#line 5#line 6#line 7

def shell_out_handler (eh,msg):                             #line 8
    cmd =  eh.instance_data                                 #line 9
    s =  msg.datum.v                                        #line 10
    ret =  None                                             #line 11
    rc =  None                                              #line 12
    stdout =  None                                          #line 13
    stderr =  None                                          #line 14

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
    if  rc!= 0:                                             #line 16
        send_string ( eh, "✗", stderr, msg)                 #line 17
    else:                                                   #line 18
        send_string ( eh, "", stdout, msg)                  #line 19#line 20#line 21#line 22

def generate_shell_components (reg,container_list):         #line 23
    # [                                                     #line 24
    #     {;file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 25
    #     {'file': 'simple0d.drawio', 'name': '...', 'children': [], 'connections': []}#line 26
    # ]                                                     #line 27
    if  None!= container_list:                              #line 28
        for diagram in  container_list:                     #line 29
            # loop through every component in the diagram and look for names that start with “$“ or “'“ #line 30
            # {'file': 'simple0d.drawio', 'name': 'main', 'children': [{'name': 'Echo', 'id': 5}], 'connections': [...]},#line 31
            for child_descriptor in  diagram [ "children"]: #line 32
                if first_char_is ( child_descriptor [ "name"], "$"):#line 33
                    name =  child_descriptor [ "name"]      #line 34
                    cmd =   name[1:] .strip ()              #line 35
                    generated_leaf = mkTemplate ( name, cmd, shell_out_instantiate)#line 36
                    register_component ( reg, generated_leaf)#line 37
                elif first_char_is ( child_descriptor [ "name"], "'"):#line 38
                    name =  child_descriptor [ "name"]      #line 39
                    s =   name[1:]                          #line 40
                    generated_leaf = mkTemplate ( name, s, string_constant_instantiate)#line 41
                    register_component_allow_overwriting ( reg, generated_leaf)#line 42#line 43#line 44#line 45#line 46
    return  reg                                             #line 47#line 48#line 49

def first_char (s):                                         #line 50
    return   s[0]                                           #line 51#line 52#line 53

def first_char_is (s,c):                                    #line 54
    return  c == first_char ( s)                            #line 55#line 56#line 57
                                                            #line 58
# TODO: #run_command needs to be rewritten to use the low_level “shell_out“ component, this can be done solely as a diagram without using python code here#line 59
# I'll keep it for now, during bootstrapping, since it mimics what is done in the Odin prototype _ both need to be revamped#line 60#line 61






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







def decode_install (reg):                                   #line 1
    register_component ( reg,mkTemplate ( "Decode", None, decode_instantiator))#line 2#line 3#line 4

def decode_handler (eh,msg):                                #line 5
    global decode_digits                                    #line 6
    s =  msg.datum.v                                        #line 7
    i = int ( s)                                            #line 8
    if  i >=  0 and  i <=  9:                               #line 9
        send_string ( eh, s, s, msg)                        #line 10#line 11
    send_bang ( eh, "done", msg)                            #line 12#line 13#line 14

def decode_instantiator (reg,owner,name,template_data):     #line 15
    name_with_id = gensymbol ( "Decode")                    #line 16
    return make_leaf ( name_with_id, owner, None, decode_handler)#line 17







def reverser_install (reg):                                 #line 1
    register_component ( reg,mkTemplate ( "Reverser", None, reverser_instantiator))#line 2#line 3#line 4

reverser_state =  "J"                                       #line 5#line 6
def reverser_handler (eh,msg):                              #line 7
    global reverser_state                                   #line 8
    if  reverser_state ==  "K":                             #line 9
        if  msg.port ==  "J":                               #line 10
            send_bang ( eh, "", msg)                        #line 11
            reverser_state =  "J"                           #line 12
        else:                                               #line 13
            pass                                            #line 14#line 15
    elif  reverser_state ==  "J":                           #line 16
        if  msg.port ==  "K":                               #line 17
            send_bang ( eh, "", msg)                        #line 18
            reverser_state =  "K"                           #line 19
        else:                                               #line 20
            pass                                            #line 21#line 22#line 23#line 24#line 25

def reverser_instantiator (reg,owner,name,template_data):   #line 26
    name_with_id = gensymbol ( "Reverser")                  #line 27
    return make_leaf ( name_with_id, owner, None, reverser_handler)#line 28#line 29







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







def monitor_install (reg):                                  #line 1
    register_component ( reg,mkTemplate ( "@", None, monitor_instantiator))#line 2#line 3#line 4

def monitor_instantiator (reg,owner,name,template_data):    #line 5
    name_with_id = gensymbol ( "@")                         #line 6
    return make_leaf ( name_with_id, owner, None, monitor_handler)#line 7#line 8#line 9

def monitor_handler (eh,msg):                               #line 10
    s =  msg.datum.v                                        #line 11
    i = int ( s)                                            #line 12
    while  i >  0:                                          #line 13
        s =  str( " ") +  s                                 #line 14
        i =  i- 1                                           #line 15#line 16
    print ( s)                                              #line 17#line 18





