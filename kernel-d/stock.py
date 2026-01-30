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

def stop_handler (eh):                                 #line 308
    inst =  eh.instance_data                           #line 309
    parent =  eh.owner                                 #line 310
    s =  str( "   !!! stopping") +  parent.name        #line 311
    print ( s, file=sys.stderr)                        #line 312
                                                       #line 313
    parent.stop ( parent)                              #line 314
    forward ( eh, "", mev)                             #line 315#line 316#line 317

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
